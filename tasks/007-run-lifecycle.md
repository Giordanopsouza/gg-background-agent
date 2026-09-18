---
id: 007-run-lifecycle
feature: execution
status: pending
---

# Enforce run lifecycle transitions

## Scope

Make the coordinator the sole owner of run-state transitions and their corresponding events, independently of HTTP or worker timing.

## Context

- Milestone: F1 in the [roadmap](../docs/roadmap.md).
- Requirements: FR-05; FR-08; FR-09; Lifecycle and scheduling in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [004-transactional-commands-events](004-transactional-commands-events.md) — Persist commands and events atomically.

## Acceptance criteria

- [ ] Represent all spec run states and typed event payloads; implement the allowed transition table and explicit rejection of illegal changes.
- [ ] Every committed state transition appends its event and relevant timestamps atomically; terminal states cannot transition back to execution.
- [ ] Progress is accepted only for the appropriate active run and rejected after its terminal outcome; validate schema and simulated payloads.
- [ ] First committed cancellation/completion transition determines the outcome; late success cannot overwrite cancelling or cancelled.
- [ ] Expose coordinator operations sufficient for scheduler claim, progress, completion/failure, cancellation, and startup interruption without allowing workers to write SQL.
- [ ] Unit and real-storage tests cover each allowed transition, representative forbidden transitions, race ordering, and rollback.

## Out of scope

- Scheduling and HTTP cancellation/retry routes.
- Additional real-agent states such as waiting_for_input.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F1 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

