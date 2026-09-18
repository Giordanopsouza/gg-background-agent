import path from "node:path";
import { pathToFileURL } from "node:url";

import { loadConfig } from "../config.ts";
import { openDatabase, schemaVersion } from "./database.ts";

export function migrateConfiguredDatabase(
  env: NodeJS.ProcessEnv = process.env,
): { databasePath: string; version: number } {
  const { databasePath } = loadConfig(env);
  const db = openDatabase(databasePath);
  try {
    return { databasePath, version: schemaVersion(db) };
  } finally {
    db.close();
  }
}

function isMainModule(): boolean {
  const entryPath = process.argv[1];
  if (entryPath === undefined) {
    return false;
  }

  return import.meta.url === pathToFileURL(path.resolve(entryPath)).href;
}

function main(): void {
  try {
    const { databasePath, version } = migrateConfiguredDatabase();
    process.stdout.write(
      `Migrated ${databasePath} to schema version ${String(version)}\n`,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to migrate the database";
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}

if (isMainModule()) {
  main();
}
