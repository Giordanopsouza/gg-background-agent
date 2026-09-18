---
id: 013-graceful-shutdown
feature: recovery
status: pending
---

# Stop the scheduler cleanly on shutdown

## Scope

Handle termination signals with a bounded shutdown sequence that stops new claims and records cancellation when possible.

## Context

- Milestone: F1 in the [roadmap](../docs/roadmap.md).
- Requirements: Lifecycle and scheduling; FR-09 in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [010-cancel-runs](010-cancel-runs.md) — Cancel queued and active runs.
- [012-restart-recovery](012-restart-recovery.md) — Recover interrupted runs on server startup.

## Acceptance criteria

- [ ] SIGINT and SIGTERM stop new work claims before requesting cancellation of the active run.
- [ ] Await cooperative cancellation for a documented bounded interval, record the terminal state when possible, and close streams, timers, HTTP, and storage.
- [ ] Repeated shutdown signals cannot create duplicate transitions or claim another run.
- [ ] If the process exits before persistence completes, the next startup follows the interruption/cancellation rules rather than claiming successful shutdown.
- [ ] Queued independent runs remain persisted and eligible on the next startup.
- [ ] Process tests check graceful active/idle shutdown, resource cleanup, bounded exit, and unchanged queued records.

## Out of scope

- Durable continuation through laptop sleep or power loss.
- Remote process supervision.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F1 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

