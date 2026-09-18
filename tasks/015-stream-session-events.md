---
id: 015-stream-session-events
feature: events
status: pending
---

# Stream events with resumable SSE

## Scope

Implement the SSE endpoint as a cursor-driven reader over durable events, including reconnect behavior and bounded slow-client handling.

## Context

- Milestone: F1 in the [roadmap](../docs/roadmap.md).
- Requirements: FR-06; FR-07; AC-04; AC-05 in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [014-read-event-history](014-read-event-history.md) — Expose cursor-based event history.
- [009-durable-scheduler](009-durable-scheduler.md) — Execute queued runs one at a time.

## Acceptance criteria

- [ ] GET /api/sessions/:id/stream emits text/event-stream using id: seq, event: session-event, and JSON data; validate the session/cursor before opening the stream.
- [ ] Last-Event-ID takes precedence over after; the same ordered read path handles backlog and future events without a replay/live-subscription gap.
- [ ] Poll at the documented initial 250 ms target and send comment heartbeats about every 15 seconds without persisting heartbeat events.
- [ ] Respect write backpressure with a bounded buffer/drain timeout; close persistently slow clients so they can replay later.
- [ ] Disconnect clears connection-specific timers/listeners without cancelling runs or holding up other clients; shutdown can close all streams.
- [ ] HTTP tests verify framing, cursor precedence, events arriving during replay, multiple observers, disconnect cleanup, and slow-client isolation.

## Out of scope

- WebSockets, presence, and bidirectional streaming commands.
- Exactly-once transport delivery.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F1 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

