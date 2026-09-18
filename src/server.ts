import http from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { loadConfig, type AppConfig } from "./config.ts";
import { createHttpApp } from "./http/routes.ts";

export type StartServerOptions = {
  env?: NodeJS.ProcessEnv;
  // Later tasks use this to open SQLite. Today tests use it to prove
  // recovery does not run if the port is already taken.
  recover?: () => Promise<void> | void;
};

export type ServerHandle = {
  config: AppConfig;
  markReady: () => void;
  stop: () => Promise<void>;
};

export async function startServer(
  options: StartServerOptions = {},
): Promise<ServerHandle> {
  const config = loadConfig(options.env);
  let ready = false;
  const app = createHttpApp({
    config,
    isReady: () => ready,
  });
  const server = http.createServer(app);

  await listen(server, config);

  try {
    await options.recover?.();
  } catch (error) {
    await closeServer(server);
    throw error;
  }

  return {
    config,
    markReady: () => {
      ready = true;
    },
    stop: () => closeServer(server),
  };
}

function listen(server: http.Server, config: AppConfig): Promise<void> {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(
      { host: config.host, port: config.port, exclusive: true },
      () => {
        server.off("error", reject);
        resolve();
      },
    );
  });
}

function closeServer(server: http.Server): Promise<void> {
  server.closeAllConnections();
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

// True only when this file is the program (`npm run dev` / `npm start`).
// Tests import startServer without binding port 3000.
function isMainModule(): boolean {
  const entryPath = process.argv[1];
  if (entryPath === undefined) {
    return false;
  }

  return import.meta.url === pathToFileURL(path.resolve(entryPath)).href;
}

async function main(): Promise<void> {
  try {
    const handle = await startServer();
    handle.markReady();
    const { host, port, workerMode } = handle.config;
    process.stdout.write(
      `gg-background-agent: listening on http://${host}:${port} (mode=${workerMode})\n`,
    );

    const onStop = (): void => {
      void handle.stop();
    };

    process.once("SIGINT", onStop);
    process.once("SIGTERM", onStop);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to start the server";
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}

if (isMainModule()) {
  void main();
}