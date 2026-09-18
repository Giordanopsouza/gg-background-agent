---
id: 017-restart-e2e-foundation-gate
feature: verification
status: pending
---

# Verify restart recovery and the terminal demo

## Scope

Extend process acceptance tests to abrupt interruption and retry, then record the F1 terminal walkthrough before browser work begins.

## Context

- Milestone: F1 in the [roadmap](../docs/roadmap.md).
- Requirements: AC-01 through AC-10; F1 exit gate in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [011-retry-runs](011-retry-runs.md) — Retry terminal attempts without rewriting history.
- [012-restart-recovery](012-restart-recovery.md) — Recover interrupted runs on server startup.
- [013-graceful-shutdown](013-graceful-shutdown.md) — Stop the scheduler cleanly on shutdown.
- [016-client-disconnect-e2e](016-client-disconnect-e2e.md) — Prove work survives client disconnection.

## Acceptance criteria

- [ ] Kill the child server during running work; restart using the same database and prove interrupted history, retained events, and no replay of that attempt.
- [ ] Exercise restart from a durably committed cancelling state, proving one cancelled outcome; previously queued work remains ordered and executes.
- [ ] Explicitly retry an interrupted attempt through HTTP and verify the new identity/link while the old attempt remains terminal.
- [ ] Starting a second server on the owned port fails before recovery can mark the first server's active run interrupted.
- [ ] Map AC-01 through AC-10 to concrete passing tests, including duplicate submissions and transaction-failure rollback from their owning tasks.
- [ ] Append Tester evidence and a terminal walkthrough to this task's log; F2 dependencies remain unsatisfied until the tracker lifecycle marks this task done.

## Out of scope

- Browser interface and production readiness claims.
- New application features disguised as acceptance testing.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F1 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

