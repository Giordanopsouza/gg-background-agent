import path from "node:path";
import { pathToFileURL } from "node:url";

// Something tests can hold onto so they can shut the process down.
export type ProcessHandle = {
  stop: () => void;
};

// Turns the process on. A timer keeps Node from quitting right away —
// with nothing left to do, it would just exit. This is not a web server yet.
export function startProcess(): ProcessHandle {
  // Tick every minute. We don't need the tick to do anything; we just need
  // the timer to exist. void means "yes, we know we're ignoring this value."
  const keepAlive = setInterval(() => {
    void process.pid;
  }, 60_000);

  return {
    stop(): void {
      clearInterval(keepAlive);
    },
  };
}

// Are we running this file directly, or did a test import it?
// Only the first case should actually start the process.
function isMainModule(): boolean {
  const entryPath = process.argv[1];
  if (entryPath === undefined) {
    return false;
  }

  // Node tells us this file as a file:// URL and the launch path as a normal
  // path. Convert the path to the same shape, then see if they match.
  return import.meta.url === pathToFileURL(path.resolve(entryPath)).href;
}

// If someone ran this file on purpose, start up. If a test imported it, don't.
if (isMainModule()) {
  const handle = startProcess();
  process.stdout.write("gg-background-agent: process started\n");

  const onStop = (): void => {
    handle.stop();
  };

  // Ctrl+C, or a process manager asking us to quit. Listen once, then stop
  // the timer so Node can exit.
  process.once("SIGINT", onStop);
  process.once("SIGTERM", onStop);
}
