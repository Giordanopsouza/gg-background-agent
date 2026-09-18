---
id: 004-transactional-commands-events
feature: storage
status: pending
---

# Persist commands and events atomically

## Scope

Provide the coordinator's transaction primitives for domain changes, ordered events, and idempotent command receipts.

## Context

- Milestone: F1 in the [roadmap](../docs/roadmap.md).
- Requirements: FR-03; FR-05; AC-02; AC-10 in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [003-sqlite-schema-migrations](003-sqlite-schema-migrations.md) — Create durable SQLite storage and migrations.

## Acceptance criteria

- [ ] One transaction can apply domain writes, allocate session event sequences, append schema-versioned events, and store the original response status/body.
- [ ] Command scope includes operation and resource; identical canonical request content replays its stored response while changed content with the same key produces a conflict.
- [ ] Missing or malformed idempotency keys are rejected before mutation; command receipts survive connection close and reopen.
- [ ] Concurrent duplicate submissions through the supported single-process connection path cannot create two receipts or execute the domain write twice.
- [ ] Failure injection between domain, event, and receipt writes leaves none of the transaction visible and does not consume a visible event sequence.
- [ ] Tests cover canonicalization, key scoping, original response replay, conflicts, rollback, and sequence allocation.

## Out of scope

- Generic event sourcing or event-log compaction.
- Individual session/run HTTP endpoints.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F1 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

