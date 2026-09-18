---
id: 012-restart-recovery
feature: recovery
status: pending
---

# Recover interrupted runs on server startup

## Scope

Wire the startup sequence so persisted in-flight work receives an honest terminal recovery state before new work can execute.

## Context

- Milestone: F1 in the [roadmap](../docs/roadmap.md).
- Requirements: FR-09; AC-07 in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [009-durable-scheduler](009-durable-scheduler.md) — Execute queued runs one at a time.
- [010-cancel-runs](010-cancel-runs.md) — Cancel queued and active runs.

## Acceptance criteria

- [ ] Startup validates configuration and owns the listening port before opening/migrating storage or mutating recovery state.
- [ ] While initialization/recovery runs, application routes stay unavailable and the scheduler cannot claim work.
- [ ] Every persisted running run becomes interrupted with run.interrupted; every cancelling run becomes cancelled with its event.
- [ ] Previously queued runs retain their order and execute only after recovery commits; recovered attempts never replay automatically.
- [ ] Repeated startup produces no duplicate terminal events; failed recovery prevents readiness and scheduler activation.
- [ ] Tests seed persisted states, reopen storage, and check recovery, queue preservation, idempotence, and occupied-port startup without database mutation.

## Out of scope

- Restoring worker memory or resuming a partial simulation.
- Multi-process ownership and sandbox checkpoints.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F1 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

