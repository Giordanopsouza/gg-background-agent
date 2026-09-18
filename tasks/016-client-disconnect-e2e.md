---
id: 016-client-disconnect-e2e
feature: verification
status: pending
---

# Prove work survives client disconnection

## Scope

Add a process-level test harness and acceptance scenario for background execution and event replay through real HTTP connections.

## Context

- Milestone: F1 in the [roadmap](../docs/roadmap.md).
- Requirements: AC-03; AC-04; AC-05; AC-09 in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [015-stream-session-events](015-stream-session-events.md) — Stream events with resumable SSE.
- [010-cancel-runs](010-cancel-runs.md) — Cancel queued and active runs.

## Acceptance criteria

- [ ] npm run test:e2e builds and launches an isolated child server on loopback with a temporary on-disk database and reliable cleanup.
- [ ] Submit a slow run, capture a cursor, close its observer, and prove the server continues to a terminal result with all recorded events retained.
- [ ] Reconnect after the captured cursor and verify ordered replay without missing events; exercise Last-Event-ID over a conflicting query cursor.
- [ ] Run a second observer during the scenario to prove one disconnect cannot cancel execution or disrupt another client.
- [ ] Assert FIFO execution across sessions, maximum concurrency one, and next-run progress after a simulated failure through public responses/events.
- [ ] Use observable readiness/events with bounded deadlines instead of arbitrary long sleeps; report failures with redacted diagnostic output.

## Out of scope

- Server-kill recovery scenarios owned by task 017.
- Browser rendering assertions.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F1 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

