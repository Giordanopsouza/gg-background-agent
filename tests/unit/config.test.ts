import assert from "node:assert/strict";
import { test } from "node:test";

import { loadConfig } from "../../src/config.ts";

test("defaults match the local simulated first version", () => {
  assert.deepEqual(loadConfig({}), {
    host: "127.0.0.1",
    port: 3000,
    databasePath: "./.data/sessions.sqlite",
    workerMode: "simulated",
  });
});

test("reads HOST, PORT, and DATABASE_PATH from the environment", () => {
  const config = loadConfig({
    HOST: "localhost",
    PORT: "8080",
    DATABASE_PATH: "/tmp/sessions.sqlite",
  });

  assert.equal(config.host, "localhost");
  assert.equal(config.port, 8080);
  assert.equal(config.databasePath, "/tmp/sessions.sqlite");
  assert.equal(config.workerMode, "simulated");
});
