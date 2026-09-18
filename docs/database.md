# Database

Local single-user model: a `session` is the durable conversation. Almost
every domain table has `session_id` → `sessions.id` (SQLite default
`ON DELETE NO ACTION`, equivalent to restrict). Identities are UUID
text; `queue_order` and event `seq` are the integers we actually sort
by. Timestamps are UTC ISO-8601 text. Foreign keys, WAL, and
`synchronous=FULL` are required on every connection.

**Live after task 003:** `sessions`, `prompts`, `runs`, `events`,
`commands`, plus bookkeeping table `schema_migrations`. Command/event
write helpers are task 004; scheduling and recovery are later.

## ER diagram (product target)

```mermaid
erDiagram
    sessions ||--o{ prompts : contains
    sessions ||--o{ runs : queues
    sessions ||--o{ events : records
    prompts ||--o{ runs : attempts
    runs ||--o{ events : emits
    runs ||--o| runs : retry_of

    sessions {
        text id PK
        text title
        text created_at
        text updated_at
        int next_event_seq "allocator; >= 0"
    }

    prompts {
        text id PK
        text session_id FK
        text text
        text author_id "default local-user"
        text created_at
    }

    runs {
        text id PK
        text prompt_id FK
        text session_id FK
        int queue_order UK "global claim order"
        int attempt ">= 1"
        text retry_of "nullable FK runs.id"
        text scenario "success | failure | slow"
        text status "queued | running | cancelling | succeeded | failed | cancelled | interrupted"
        text created_at
        text started_at "nullable"
        text finished_at "nullable"
        text updated_at
        text error_code "nullable"
        text summary "nullable"
    }

    events {
        text session_id PK_FK
        int seq PK ">= 1; per session"
        text run_id "nullable FK runs.id"
        text type
        int schema_version ">= 1"
        text payload_json
        text created_at
    }

    commands {
        text scope PK "operation plus resource"
        text idempotency_key PK
        text request_hash
        int response_status
        text response_body
        text created_at
    }
```

Partial unique index `runs_one_nonterminal_per_prompt`: a prompt may
have only one row in `queued`, `running`, or `cancelling` at a time.
Retry is a new run after the previous one is terminal.

## Quick reference

| Table                | Purpose                                                                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sessions`           | Durable conversation. Holds the next event sequence; has no independent “running” flag. Activity is derived from its runs.                                                                              |
| `prompts`            | A person’s instruction in a session. Independent simulation input in this version; a follow-up does not inherit a workspace.                                                                            |
| `runs`               | One execution attempt for a prompt. Global unique `queue_order` is the scheduler’s claim order. `retry_of` links a new attempt to the previous terminal run.                                            |
| `events`             | Committed facts about a session or run. Primary key `(session_id, seq)` is the replay cursor. `run_id` is null for session-level facts.                                                                 |
| `commands`           | Idempotency receipts, not domain history. Same `(scope, idempotency_key)` with the same hash replays the stored response; a different hash is a conflict. Scope includes operation and resource.        |
| `schema_migrations`  | Applied migration versions (`version`, `name`, `applied_at`). Not a product table.                                                                                                                      |

`session` **vs** `prompt` **vs** `run`**:** session = the conversation
that outlives any attempt; prompt = one submitted instruction; run =
one try at that instruction. Retry never mutates the old run back to
running.

`event` **vs** `command`**:** event = a recorded fact the client can
replay; command = a stored HTTP result so a retried request does not
mutate twice. Keep both for the life of this local demo.

Initial event types: `session.created`, `prompt.accepted`,
`run.queued`, `run.started`, `run.progress`, `run.cancel_requested`,
`run.cancelled`, `run.succeeded`, `run.failed`, `run.interrupted`.
`queued`, `running`, and `cancelling` are nonterminal; all other run
statuses are terminal.
