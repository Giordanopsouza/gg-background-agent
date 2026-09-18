import assert from "node:assert/strict";
import { test } from "node:test";

import { startProcess } from "../../src/server.ts";

test("startProcess returns a handle that stop can release", () => {
  const handle = startProcess();
  assert.equal(typeof handle.stop, "function");
  handle.stop();
});
