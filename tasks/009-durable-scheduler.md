---
id: 009-durable-scheduler
feature: execution
status: pending
---

# Execute queued runs one at a time

## Scope

Connect the database queue to the scripted worker with a single in-process scheduler that records progress and outcomes through the coordinator.

## Context

- Milestone: F1 in the [roadmap](../docs/roadmap.md).
- Requirements: FR-04; FR-05; AC-03; AC-09 in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [006-submit-prompts](006-submit-prompts.md) — Accept prompts into the durable queue.
- [007-run-lifecycle](007-run-lifecycle.md) — Enforce run lifecycle transitions.
- [008-scripted-worker](008-scripted-worker.md) — Implement cancellable simulation scenarios.

## Acceptance criteria

- [ ] Atomically claim the oldest queued run and record run.started; at most one run is running or cancelling globally.
- [ ] Persist worker progress, successful summaries, and stable failure codes through coordinator operations with session/run-correlated logs.
- [ ] Submission wakes the scheduler after commit; periodic durable-queue checks recover from a missed in-memory wakeup.
- [ ] A worker failure reaches failed and allows the next independent queued simulation to run; terminal late callbacks cannot alter history.
- [ ] Provide start/stop-claiming hooks for later startup/shutdown tasks and wire normal ready-server execution without blocking HTTP handling.
- [ ] Tests queue at least three runs across sessions, prove start order and maximum concurrency of one, and exercise missed wakeup and failure continuation.

## Out of scope

- Multiple workers, distributed leases, and cloud queues.
- Recovery of an in-flight run after server restart.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F1 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

