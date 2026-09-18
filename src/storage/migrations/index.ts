import * as initialSchema from "./001-initial-schema.ts";

export type Migration = {
  version: number;
  name: string;
  sql: string;
};

export const MIGRATIONS: readonly Migration[] = [initialSchema];
