export const version = 1;
export const name = "initial-schema";

// Domain tables from Spec 001. Identities are UUIDs; queue_order and
// event seq are the integers we actually sort by.
export const sql = `
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  next_event_seq INTEGER NOT NULL DEFAULT 0 CHECK (next_event_seq >= 0)
);

CREATE TABLE prompts (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(id),
  text TEXT NOT NULL,
  author_id TEXT NOT NULL DEFAULT 'local-user',
  created_at TEXT NOT NULL
);

CREATE TABLE runs (
  id TEXT PRIMARY KEY,
  prompt_id TEXT NOT NULL REFERENCES prompts(id),
  session_id TEXT NOT NULL REFERENCES sessions(id),
  queue_order INTEGER NOT NULL UNIQUE,
  attempt INTEGER NOT NULL CHECK (attempt >= 1),
  retry_of TEXT REFERENCES runs(id),
  scenario TEXT NOT NULL CHECK (scenario IN ('success', 'failure', 'slow')),
  status TEXT NOT NULL CHECK (
    status IN (
      'queued',
      'running',
      'cancelling',
      'succeeded',
      'failed',
      'cancelled',
      'interrupted'
    )
  ),
  created_at TEXT NOT NULL,
  started_at TEXT,
  finished_at TEXT,
  updated_at TEXT NOT NULL,
  error_code TEXT,
  summary TEXT
);

CREATE UNIQUE INDEX runs_one_nonterminal_per_prompt
  ON runs(prompt_id)
  WHERE status IN ('queued', 'running', 'cancelling');

CREATE TABLE events (
  session_id TEXT NOT NULL REFERENCES sessions(id),
  seq INTEGER NOT NULL CHECK (seq >= 1),
  run_id TEXT REFERENCES runs(id),
  type TEXT NOT NULL,
  schema_version INTEGER NOT NULL CHECK (schema_version >= 1),
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (session_id, seq)
);

CREATE TABLE commands (
  scope TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  response_status INTEGER NOT NULL,
  response_body TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (scope, idempotency_key)
);
`;
