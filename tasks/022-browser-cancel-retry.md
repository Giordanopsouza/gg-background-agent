---
id: 022-browser-cancel-retry
feature: web
status: pending
---

# Control cancellation and retry in the UI

## Scope

Expose cancel and explicit retry actions with status-aware controls and preserved attempt history.

## Context

- Milestone: F2 in the [roadmap](../docs/roadmap.md).
- Requirements: FR-08; FR-09; FR-10; AC-06; AC-08; AC-11 in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [021-browser-live-timeline](021-browser-live-timeline.md) — Reconcile snapshots and live progress.
- [010-cancel-runs](010-cancel-runs.md) — Cancel queued and active runs.
- [011-retry-runs](011-retry-runs.md) — Retry terminal attempts without rewriting history.
- [012-restart-recovery](012-restart-recovery.md) — Recover interrupted runs on server startup.

## Acceptance criteria

- [ ] Show cancel for queued/running work, cancellation-in-progress feedback for cancelling, and retry for failed/interrupted/cancelled attempts.
- [ ] Commands have per-action idempotency keys; duplicate clicks and uncertain response retries do not create extra attempts.
- [ ] Reconcile responses and events with current server state so a stale command receipt cannot regress a newer terminal run.
- [ ] On retry, show the new queued attempt alongside its prior terminal attempt and linkage; explain that failure retries keep the same simulation scenario.
- [ ] Surface conflicts and unavailable-server errors without changing local state to a fabricated success.
- [ ] Record keyboard-accessible walkthroughs for queued cancel, active cancel, completion races, server restart, and explicit retry.

## Out of scope

- Automatic retry policies or editing previous prompts.
- Cancelling all work or deleting attempt history.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F2 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

