import assert from "node:assert/strict";
import { test } from "node:test";

test("tests run on Node 24", () => {
  const [major] = process.versions.node.split(".");
  assert.equal(major, "24");
});
