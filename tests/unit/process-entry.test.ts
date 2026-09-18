import assert from "node:assert/strict";
import { test } from "node:test";

import { startServer } from "../../src/server.ts";

test("importing the entry module does not bind a port", () => {
  assert.equal(typeof startServer, "function");
});
