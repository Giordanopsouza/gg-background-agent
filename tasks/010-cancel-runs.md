---
id: 010-cancel-runs
feature: execution
status: pending
---

# Cancel queued and active runs

## Scope

Implement the cancellation HTTP command and connect durable cancellation state to the scheduler's active worker.

## Context

- Milestone: F1 in the [roadmap](../docs/roadmap.md).
- Requirements: FR-08; AC-06 in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [009-durable-scheduler](009-durable-scheduler.md) — Execute queued runs one at a time.

## Acceptance criteria

- [ ] POST /api/runs/:id/cancel requires an idempotency key and returns the documented run response; unknown runs return 404.
- [ ] Queued cancellation commits cancelled and its event without invoking the worker.
- [ ] Active cancellation commits cancelling and run.cancel_requested before signaling the worker; worker acknowledgement commits cancelled.
- [ ] Repeated commands replay their original responses; fresh commands against terminal runs return the existing terminal state without new lifecycle events.
- [ ] Cancellation/completion races obey first-committed precedence and leave other queued runs intact.
- [ ] Tests prove no steps for queued cancellation, active cancellation within 2 seconds on an unloaded machine, race handling, and later queue progress.

## Out of scope

- Cancelling entire sessions or all queued work.
- Force-killing real tools or operating-system processes.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F1 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

