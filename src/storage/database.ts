import { mkdirSync } from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

import { MIGRATIONS, type Migration } from "./migrations/index.ts";

export type SqliteDatabase = Database.Database;

export class StorageError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "StorageError";
  }
}

// Open (or create) the on-disk database, set durability pragmas, and apply
// pending migrations. Failures leave the file in place.
export function openDatabase(databasePath: string): SqliteDatabase {
  const parent = path.dirname(databasePath);
  try {
    mkdirSync(parent, { recursive: true });
  } catch (cause) {
    throw new StorageError(
      `Could not create the parent directory for the database at ${databasePath}: ${detail(cause)}`,
      { cause },
    );
  }

  let db: SqliteDatabase;
  try {
    db = new Database(databasePath);
  } catch (cause) {
    throw new StorageError(
      `Could not open the SQLite database at ${databasePath}: ${detail(cause)}`,
      { cause },
    );
  }

  try {
    configureConnection(db);
    applyMigrations(db, MIGRATIONS);
    return db;
  } catch (cause) {
    db.close();
    if (cause instanceof StorageError) {
      throw cause;
    }

    throw new StorageError(
      `Could not initialize the SQLite database at ${databasePath}: ${detail(cause)}. Existing data was left unchanged.`,
      { cause },
    );
  }
}

export function applyMigrations(
  db: SqliteDatabase,
  migrations: readonly Migration[] = MIGRATIONS,
): void {
  validateMigrations(migrations);
  ensureMigrationsTable(db);

  const current = schemaVersion(db);
  const latest = migrations[migrations.length - 1]?.version ?? 0;
  if (current > latest) {
    throw new StorageError(
      `The database at ${db.name} is at schema version ${String(current)}, but this application only supports up to ${String(latest)}. Upgrade the application; the file was not modified.`,
    );
  }

  for (const migration of migrations) {
    if (migration.version <= current) {
      continue;
    }

    try {
      db.transaction(() => {
        db.exec(migration.sql);
        db.prepare(
          "INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)",
        ).run(migration.version, migration.name, new Date().toISOString());
      })();
    } catch (cause) {
      throw new StorageError(
        `Failed to apply migration ${String(migration.version)} (${migration.name}) to ${db.name}: ${detail(cause)}. Existing data was left unchanged.`,
        { cause },
      );
    }
  }
}

export function schemaVersion(db: SqliteDatabase): number {
  const row = db
    .prepare(
      "SELECT COALESCE(MAX(version), 0) AS version FROM schema_migrations",
    )
    .get() as { version: number };
  return row.version;
}

function configureConnection(db: SqliteDatabase): void {
  db.pragma("foreign_keys = ON");
  const foreignKeys = db.pragma("foreign_keys", { simple: true });
  if (foreignKeys !== 1) {
    throw new StorageError(
      `Could not enable foreign keys on ${db.name} (foreign_keys=${String(foreignKeys)}).`,
    );
  }

  const journalMode = db.pragma("journal_mode = WAL", { simple: true });
  if (journalMode !== "wal") {
    throw new StorageError(
      `Could not enable WAL on ${db.name} (journal_mode=${String(journalMode)}).`,
    );
  }

  db.pragma("synchronous = FULL");
  const synchronous = db.pragma("synchronous", { simple: true });
  if (synchronous !== 2) {
    throw new StorageError(
      `Could not set synchronous=FULL on ${db.name} (synchronous=${String(synchronous)}).`,
    );
  }
}

function ensureMigrationsTable(db: SqliteDatabase): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL
    )
  `);
}

function validateMigrations(migrations: readonly Migration[]): void {
  for (const [index, migration] of migrations.entries()) {
    const expected = index + 1;
    if (migration.version !== expected) {
      throw new StorageError(
        `Migration versions must be consecutive integers starting at 1; expected ${String(expected)}, got ${String(migration.version)}.`,
      );
    }
  }
}

function detail(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}
