---
id: 003-sqlite-schema-migrations
feature: storage
status: in-progress
---

# Create durable SQLite storage and migrations

## Scope

Introduce the SQLite connection and versioned schema for sessions, prompts, runs, events, and command receipts.

## Context

- Milestone: F0 in the [roadmap](../docs/roadmap.md).
- Requirements: AC-01; AC-10; Data model in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [002-local-server-configuration](002-local-server-configuration.md) — Start a local-only HTTP server.

## Acceptance criteria

- [x] npm run db:migrate applies migrations to the configured database, creates its parent directory, and can be rerun without losing data.
- [x] Tables contain the spec's identities, timestamps, queue order, attempt linkage, event cursor, and command receipt fields with appropriate foreign keys and uniqueness constraints.
- [x] Queue ordering uses a unique persisted integer; each session's event sequence is unique; a prompt cannot have two nonterminal attempts.
- [x] Connections enable foreign keys, WAL, and synchronous=FULL; statements use parameters and transactions remain synchronous and short.
- [x] Tests use temporary on-disk databases to verify migration, reopen persistence, constraints, and rollback of a failed migration.
- [x] Storage initialization failures are actionable; existing user data is never silently reset.

## Out of scope

- Commands, scheduling, or automatic restart recovery.
- ORM adoption, retention, or multi-host database operation.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F0 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

### [SWE] 2026-09-18 17:16 — Start implementation

Began durable SQLite storage: versioned migrations, WAL plus synchronous=FULL, and on-disk tests for reopen, constraints, and failed-migration rollback. Timestamp uses America/Sao_Paulo.

### [SWE] 2026-09-18 17:22 — Storage verified

Pinned better-sqlite3 13.0.3. `npm run db:migrate` creates the parent directory and applies the versioned schema. Connections set foreign_keys, WAL, and synchronous=FULL. Constraints cover global queue_order, per-session event seq, and one nonterminal run per prompt. Failed migrations and newer schemas leave existing data in place. `npm test`, typecheck, lint, format:check, and build pass. Status stays in-progress pending Tester and commit. Timestamp uses America/Sao_Paulo.

