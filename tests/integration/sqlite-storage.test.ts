import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

import Database from "better-sqlite3";

import {
  applyMigrations,
  openDatabase,
  schemaVersion,
  StorageError,
  type SqliteDatabase,
} from "../../src/storage/database.ts";
import { migrateConfiguredDatabase } from "../../src/storage/migrate.ts";
import { MIGRATIONS } from "../../src/storage/migrations/index.ts";

test("openDatabase creates the parent directory and can be rerun without losing data", async () => {
  await withTempDir(async (dir) => {
    const databasePath = path.join(dir, "nested", "sessions.sqlite");
    const db = openDatabase(databasePath);
    try {
      insertSession(db, "session-1");
      assert.equal(schemaVersion(db), 1);
    } finally {
      db.close();
    }

    const reopened = openDatabase(databasePath);
    try {
      assert.equal(schemaVersion(reopened), 1);
      assert.deepEqual(sessionIds(reopened), ["session-1"]);
      assert.equal(pragma(reopened, "foreign_keys"), 1);
      assert.equal(pragma(reopened, "journal_mode"), "wal");
      assert.equal(pragma(reopened, "synchronous"), 2);
    } finally {
      reopened.close();
    }
  });
});

test("tables include identities, timestamps, queue order, attempts, events, and command receipts", async () => {
  await withTempDir(async (dir) => {
    const db = openDatabase(path.join(dir, "sessions.sqlite"));
    try {
      assert.deepEqual(columns(db, "sessions"), [
        "id",
        "title",
        "created_at",
        "updated_at",
        "next_event_seq",
      ]);
      assert.deepEqual(columns(db, "prompts"), [
        "id",
        "session_id",
        "text",
        "author_id",
        "created_at",
      ]);
      assert.deepEqual(columns(db, "runs"), [
        "id",
        "prompt_id",
        "session_id",
        "queue_order",
        "attempt",
        "retry_of",
        "scenario",
        "status",
        "created_at",
        "started_at",
        "finished_at",
        "updated_at",
        "error_code",
        "summary",
      ]);
      assert.deepEqual(columns(db, "events"), [
        "session_id",
        "seq",
        "run_id",
        "type",
        "schema_version",
        "payload_json",
        "created_at",
      ]);
      assert.deepEqual(columns(db, "commands"), [
        "scope",
        "idempotency_key",
        "request_hash",
        "response_status",
        "response_body",
        "created_at",
      ]);
    } finally {
      db.close();
    }
  });
});

test("queue order, event sequence, and one nonterminal run per prompt are unique", async () => {
  await withTempDir(async (dir) => {
    const db = openDatabase(path.join(dir, "sessions.sqlite"));
    try {
      insertSession(db, "session-1");
      insertSession(db, "session-2");
      insertPrompt(db, "prompt-1", "session-1");
      insertPrompt(db, "prompt-2", "session-1");

      insertRun(db, {
        id: "run-1",
        promptId: "prompt-1",
        sessionId: "session-1",
        queueOrder: 1,
        status: "queued",
      });
      assert.throws(
        () =>
          insertRun(db, {
            id: "run-2",
            promptId: "prompt-2",
            sessionId: "session-1",
            queueOrder: 1,
            status: "queued",
          }),
        /UNIQUE/,
      );

      insertEvent(db, { sessionId: "session-1", seq: 1 });
      insertEvent(db, { sessionId: "session-2", seq: 1 });
      assert.throws(
        () => insertEvent(db, { sessionId: "session-1", seq: 1 }),
        /UNIQUE/,
      );

      assert.throws(
        () =>
          insertRun(db, {
            id: "run-active-2",
            promptId: "prompt-1",
            sessionId: "session-1",
            queueOrder: 2,
            status: "running",
          }),
        /UNIQUE/,
      );

      db.prepare("UPDATE runs SET status = ? WHERE id = ?").run(
        "failed",
        "run-1",
      );
      insertRun(db, {
        id: "run-retry",
        promptId: "prompt-1",
        sessionId: "session-1",
        queueOrder: 2,
        attempt: 2,
        retryOf: "run-1",
        status: "queued",
      });
    } finally {
      db.close();
    }
  });
});

test("foreign keys reject orphan prompts, runs, events, and retries", async () => {
  await withTempDir(async (dir) => {
    const db = openDatabase(path.join(dir, "sessions.sqlite"));
    try {
      assert.throws(
        () => insertPrompt(db, "prompt-1", "missing-session"),
        /FOREIGN KEY/,
      );

      insertSession(db, "session-1");
      insertPrompt(db, "prompt-1", "session-1");
      assert.throws(
        () =>
          insertRun(db, {
            id: "run-1",
            promptId: "prompt-1",
            sessionId: "session-1",
            queueOrder: 1,
            retryOf: "missing-run",
            status: "queued",
          }),
        /FOREIGN KEY/,
      );
      assert.throws(
        () =>
          insertEvent(db, {
            sessionId: "session-1",
            seq: 1,
            runId: "missing-run",
          }),
        /FOREIGN KEY/,
      );
    } finally {
      db.close();
    }
  });
});

test("a failed migration rolls back and leaves existing data in place", async () => {
  await withTempDir(async (dir) => {
    const databasePath = path.join(dir, "sessions.sqlite");
    const db = openDatabase(databasePath);
    try {
      insertSession(db, "session-1");
      insertCommand(db, "session:session-1:create");

      assert.throws(
        () =>
          applyMigrations(db, [
            ...MIGRATIONS,
            {
              version: 2,
              name: "broken",
              sql: `
                CREATE TABLE should_not_exist (id TEXT PRIMARY KEY);
                CREATE TABLE broken (
              `,
            },
          ]),
        (error: unknown) => {
          assert.ok(error instanceof StorageError);
          assert.match(error.message, /migration 2 \(broken\)/);
          assert.match(error.message, /Existing data was left unchanged/);
          return true;
        },
      );

      assert.equal(schemaVersion(db), 1);
      assert.deepEqual(sessionIds(db), ["session-1"]);
      assert.deepEqual(commandScopes(db), ["session:session-1:create"]);
      assert.equal(tableExists(db, "should_not_exist"), false);
    } finally {
      db.close();
    }

    const reopened = openDatabase(databasePath);
    try {
      assert.equal(schemaVersion(reopened), 1);
      assert.deepEqual(sessionIds(reopened), ["session-1"]);
    } finally {
      reopened.close();
    }
  });
});

test("opening a newer schema fails without resetting the file", async () => {
  await withTempDir(async (dir) => {
    const databasePath = path.join(dir, "sessions.sqlite");
    const db = openDatabase(databasePath);
    try {
      insertSession(db, "session-1");
      db.prepare(
        "INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)",
      ).run(99, "future", "2026-09-18T00:00:00.000Z");
    } finally {
      db.close();
    }

    assert.throws(
      () => openDatabase(databasePath),
      (error: unknown) => {
        assert.ok(error instanceof StorageError);
        assert.match(error.message, /schema version 99/);
        assert.match(error.message, /file was not modified/);
        return true;
      },
    );

    const raw = new Database(databasePath);
    try {
      assert.deepEqual(
        raw.prepare("SELECT id FROM sessions ORDER BY id").all(),
        [{ id: "session-1" }],
      );
    } finally {
      raw.close();
    }
  });
});

test("storage initialization failures are actionable and do not delete existing files", async () => {
  await withTempDir(async (dir) => {
    const databasePath = path.join(dir, "sessions.sqlite");
    await mkdir(databasePath);

    assert.throws(
      () => openDatabase(databasePath),
      (error: unknown) => {
        assert.ok(error instanceof StorageError);
        assert.match(error.message, /Could not open/);
        assert.match(error.message, /sessions\.sqlite/);
        return true;
      },
    );

    const info = await stat(databasePath);
    assert.equal(info.isDirectory(), true);
  });
});

test("migrateConfiguredDatabase applies migrations to DATABASE_PATH", async () => {
  await withTempDir(async (dir) => {
    const databasePath = path.join(dir, "data", "sessions.sqlite");
    const result = migrateConfiguredDatabase({ DATABASE_PATH: databasePath });
    assert.equal(result.databasePath, databasePath);
    assert.equal(result.version, 1);

    const db = openDatabase(databasePath);
    try {
      insertSession(db, "session-1");
    } finally {
      db.close();
    }

    const again = migrateConfiguredDatabase({ DATABASE_PATH: databasePath });
    assert.equal(again.version, 1);
    const reopened = openDatabase(databasePath);
    try {
      assert.deepEqual(sessionIds(reopened), ["session-1"]);
    } finally {
      reopened.close();
    }
  });
});

test("npm run db:migrate creates the configured file", async () => {
  await withTempDir(async (dir) => {
    const databasePath = path.join(dir, ".data", "sessions.sqlite");
    const { stdout, status } = await runDbMigrate(databasePath);
    assert.equal(status, 0);
    assert.match(
      stdout,
      new RegExp(`Migrated ${databasePath} to schema version 1`),
    );

    const db = openDatabase(databasePath);
    try {
      assert.equal(schemaVersion(db), 1);
    } finally {
      db.close();
    }
  });
});

test("a non-database file is not replaced", async () => {
  await withTempDir(async (dir) => {
    const databasePath = path.join(dir, "sessions.sqlite");
    await writeFile(databasePath, "not a sqlite database");

    assert.throws(() => openDatabase(databasePath), StorageError);
    assert.equal(await readFile(databasePath, "utf8"), "not a sqlite database");
  });
});

async function withTempDir(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(path.join(os.tmpdir(), "gg-storage-"));
  try {
    await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

function insertSession(db: SqliteDatabase, id: string): void {
  db.prepare(
    "INSERT INTO sessions (id, title, created_at, updated_at, next_event_seq) VALUES (?, ?, ?, ?, ?)",
  ).run(id, "Demo", "2026-09-18T00:00:00.000Z", "2026-09-18T00:00:00.000Z", 0);
}

function insertPrompt(db: SqliteDatabase, id: string, sessionId: string): void {
  db.prepare(
    "INSERT INTO prompts (id, session_id, text, author_id, created_at) VALUES (?, ?, ?, ?, ?)",
  ).run(
    id,
    sessionId,
    "do the thing",
    "local-user",
    "2026-09-18T00:00:00.000Z",
  );
}

function insertRun(
  db: SqliteDatabase,
  input: {
    id: string;
    promptId: string;
    sessionId: string;
    queueOrder: number;
    status: string;
    attempt?: number;
    retryOf?: string | null;
  },
): void {
  db.prepare(
    `INSERT INTO runs (
      id, prompt_id, session_id, queue_order, attempt, retry_of, scenario, status,
      created_at, started_at, finished_at, updated_at, error_code, summary
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    input.id,
    input.promptId,
    input.sessionId,
    input.queueOrder,
    input.attempt ?? 1,
    input.retryOf ?? null,
    "success",
    input.status,
    "2026-09-18T00:00:00.000Z",
    null,
    null,
    "2026-09-18T00:00:00.000Z",
    null,
    null,
  );
}

function insertEvent(
  db: SqliteDatabase,
  input: { sessionId: string; seq: number; runId?: string | null },
): void {
  db.prepare(
    "INSERT INTO events (session_id, seq, run_id, type, schema_version, payload_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
  ).run(
    input.sessionId,
    input.seq,
    input.runId ?? null,
    "session.created",
    1,
    "{}",
    "2026-09-18T00:00:00.000Z",
  );
}

function insertCommand(db: SqliteDatabase, scope: string): void {
  db.prepare(
    "INSERT INTO commands (scope, idempotency_key, request_hash, response_status, response_body, created_at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(scope, "key-1", "hash-1", 201, "{}", "2026-09-18T00:00:00.000Z");
}

function sessionIds(db: SqliteDatabase): string[] {
  return db
    .prepare("SELECT id FROM sessions ORDER BY id")
    .all()
    .map((row) => (row as { id: string }).id);
}

function commandScopes(db: SqliteDatabase): string[] {
  return db
    .prepare("SELECT scope FROM commands ORDER BY scope")
    .all()
    .map((row) => (row as { scope: string }).scope);
}

function columns(db: SqliteDatabase, table: string): string[] {
  return db
    .prepare(`PRAGMA table_info(${table})`)
    .all()
    .map((row) => (row as { name: string }).name);
}

function tableExists(db: SqliteDatabase, table: string): boolean {
  const row = db
    .prepare(
      "SELECT 1 AS present FROM sqlite_master WHERE type = 'table' AND name = ?",
    )
    .get(table) as { present: number } | undefined;
  return row !== undefined;
}

function pragma(db: SqliteDatabase, source: string): unknown {
  return db.pragma(source, { simple: true });
}

async function runDbMigrate(
  databasePath: string,
): Promise<{ stdout: string; stderr: string; status: number | null }> {
  return await new Promise((resolve, reject) => {
    const child = spawn("npm", ["run", "db:migrate"], {
      cwd: process.cwd(),
      env: { ...process.env, DATABASE_PATH: databasePath },
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (status) => {
      resolve({ stdout, stderr, status });
    });
  });
}
