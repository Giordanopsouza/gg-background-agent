import assert from "node:assert/strict";
import http from "node:http";
import net from "node:net";
import { test } from "node:test";

import express from "express";

import { httpErrorHandler } from "../../src/http/errors.ts";
import { startServer, type ServerHandle } from "../../src/server.ts";
import { findFreePort, rawRequest } from "./request.ts";

test("GET /health reports readiness and simulated mode", async () => {
  const server = await startTestServer();
  try {
    const response = await localRequest(server, { path: "/health" });
    assert.equal(response.status, 200);
    assert.equal(
      response.headers["content-type"]?.includes("application/json"),
      true,
    );
    assert.deepEqual(JSON.parse(response.body), {
      ready: true,
      mode: "simulated",
    });
  } finally {
    await server.stop();
  }
});

test("application routes return 503 before readiness", async () => {
  const server = await startTestServer({}, { becomeReady: false });
  try {
    const health = await localRequest(server, { path: "/health" });
    assert.deepEqual(JSON.parse(health.body), {
      ready: false,
      mode: "simulated",
    });

    const command = await localRequest(server, {
      method: "POST",
      path: "/api/sessions",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "demo" }),
    });
    assert.equal(command.status, 503);
    assertEnvelope(command.body, "NOT_READY");
    assertNoStack(command.body);
  } finally {
    await server.stop();
  }
});

test("an occupied listening port fails before recovery runs", async () => {
  const host = "127.0.0.1";
  const port = await findFreePort(host);
  const occupant = await occupyPort(host, port);
  let recovered = false;

  try {
    await assert.rejects(
      () =>
        startServer({
          env: { HOST: host, PORT: String(port) },
          recover() {
            recovered = true;
          },
        }),
      { message: /already in use/ },
    );
    assert.equal(recovered, false);
  } finally {
    await closeNetServer(occupant);
  }
});

test("malformed JSON uses the error envelope", async () => {
  const server = await startTestServer();
  try {
    const response = await localRequest(server, {
      method: "POST",
      path: "/api/sessions",
      headers: { "content-type": "application/json" },
      body: "{",
    });
    assert.equal(response.status, 400);
    assertEnvelope(response.body, "MALFORMED_JSON");
    assertNoStack(response.body);
  } finally {
    await server.stop();
  }
});

test("unknown routes use the error envelope", async () => {
  const server = await startTestServer();
  try {
    const response = await localRequest(server, { path: "/no-such-route" });
    assert.equal(response.status, 404);
    assertEnvelope(response.body, "NOT_FOUND");
    assertNoStack(response.body);
  } finally {
    await server.stop();
  }
});

test("unexpected errors use the error envelope without a stack trace", async () => {
  const app = express();
  app.get("/boom", () => {
    throw new Error("secret-stack-token");
  });
  app.use(httpErrorHandler);

  const listener = http.createServer(app);
  const port = await findFreePort();
  await listen(listener, port);
  try {
    const response = await rawRequest({
      host: "127.0.0.1",
      port,
      path: "/boom",
    });
    assert.equal(response.status, 500);
    assertEnvelope(response.body, "INTERNAL_ERROR");
    assert.equal(
      JSON.parse(response.body).error.message,
      "An unexpected error occurred.",
    );
    assertNoStack(response.body);
    assert.doesNotMatch(response.body, /secret-stack-token/);
  } finally {
    await closeHttpServer(listener);
  }
});

async function startTestServer(
  env: NodeJS.ProcessEnv = {},
  options: { becomeReady?: boolean } = {},
): Promise<ServerHandle> {
  const port = env.PORT ?? String(await findFreePort());
  const server = await startServer({
    env: {
      HOST: "127.0.0.1",
      DATABASE_PATH: "./.data/sessions.sqlite",
      WORKER_MODE: "simulated",
      ...env,
      PORT: port,
    },
  });
  if (options.becomeReady !== false) {
    server.markReady();
  }
  return server;
}

async function localRequest(
  server: ServerHandle,
  options: {
    method?: string;
    path: string;
    headers?: Record<string, string>;
    body?: string;
  },
): Promise<Awaited<ReturnType<typeof rawRequest>>> {
  return await rawRequest({
    host: "127.0.0.1",
    port: server.config.port,
    method: options.method,
    path: options.path,
    headers: options.headers,
    body: options.body,
  });
}

function assertEnvelope(body: string, code: string): void {
  const parsed: unknown = JSON.parse(body);
  assert.ok(parsed !== null && typeof parsed === "object");
  assert.ok("error" in parsed);
  const { error } = parsed as { error: unknown };
  assert.ok(error !== null && typeof error === "object");
  assert.deepEqual(Object.keys(error as object).sort(), ["code", "message"]);
  assert.equal((error as { code: unknown }).code, code);
  assert.equal(typeof (error as { message: unknown }).message, "string");
}

function assertNoStack(body: string): void {
  assert.doesNotMatch(body, /"stack"/);
  assert.doesNotMatch(body, /at \S+ \(/);
}

async function occupyPort(host: string, port: number): Promise<net.Server> {
  const server = net.createServer();
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen({ host, port, exclusive: true }, () => {
      resolve();
    });
  });
  return server;
}

async function listen(server: http.Server, port: number): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen({ host: "127.0.0.1", port, exclusive: true }, () => {
      resolve();
    });
  });
}

async function closeNetServer(server: net.Server): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function closeHttpServer(server: http.Server): Promise<void> {
  server.closeAllConnections();
  await closeNetServer(server);
}
