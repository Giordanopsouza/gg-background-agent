export const version = 2;
export const name = "relational-integrity";

export const sql = `
CREATE UNIQUE INDEX prompts_id_session_unique
  ON prompts(id, session_id);

CREATE TABLE runs_new (
  id TEXT PRIMARY KEY,
  prompt_id TEXT NOT NULL,
  session_id TEXT NOT NULL REFERENCES sessions(id),
  queue_order INTEGER NOT NULL UNIQUE,
  attempt INTEGER NOT NULL CHECK (attempt >= 1),
  retry_of TEXT,
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
  summary TEXT,
  FOREIGN KEY (prompt_id, session_id) REFERENCES prompts(id, session_id),
  FOREIGN KEY (retry_of, prompt_id, session_id)
    REFERENCES runs_new(id, prompt_id, session_id)
);

CREATE UNIQUE INDEX runs_id_prompt_session_unique
  ON runs_new(id, prompt_id, session_id);

CREATE UNIQUE INDEX runs_id_session_unique
  ON runs_new(id, session_id);

INSERT INTO runs_new
SELECT * FROM runs;

CREATE TABLE events_new (
  session_id TEXT NOT NULL REFERENCES sessions(id),
  seq INTEGER NOT NULL CHECK (seq >= 1),
  run_id TEXT,
  type TEXT NOT NULL,
  schema_version INTEGER NOT NULL CHECK (schema_version >= 1),
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (run_id, session_id) REFERENCES runs_new(id, session_id)
);

INSERT INTO events_new
SELECT * FROM events;

DROP TABLE events;
DROP TABLE runs;

ALTER TABLE runs_new RENAME TO runs;
ALTER TABLE events_new RENAME TO events;

CREATE UNIQUE INDEX runs_one_nonterminal_per_prompt
  ON runs(prompt_id)
  WHERE status IN ('queued', 'running', 'cancelling');
`;
