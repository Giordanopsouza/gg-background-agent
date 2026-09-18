---
id: 021-browser-live-timeline
feature: web
status: pending
---

# Reconcile snapshots and live progress

## Scope

Connect the selected session to EventSource and keep its run state and ordered history correct through refresh and reconnect.

## Context

- Milestone: F2 in the [roadmap](../docs/roadmap.md).
- Requirements: FR-06; FR-07; FR-12; AC-04; AC-05; AC-11 in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [020-browser-prompts-runs](020-browser-prompts-runs.md) — Submit prompts and inspect queued runs.
- [015-stream-session-events](015-stream-session-events.md) — Stream events with resumable SSE.

## Acceptance criteria

- [ ] Load a consistent session snapshot at cursor N and open the stream after N; apply later events to that snapshot without reapplying historical state.
- [ ] Load prior event pages for the visible timeline through cursor N, then merge streamed events by (sessionId, seq) so every recorded event appears once.
- [ ] Display transport connecting/live/reconnecting separately from run status; disconnected transport never implies success, failure, or cancellation.
- [ ] Deduplicate replayed events, keep cursor order, and close obsolete EventSource/listeners when changing sessions or leaving the page.
- [ ] Refresh or reconnect recovers authoritative state/history without resubmitting commands; unknown event schema/types produce a visible recoverable error.
- [ ] Record browser evidence for closing/reopening a slow run, network interruption, rapid session switching, and events arriving between snapshot load and subscription.

## Out of scope

- Presence, multiplayer editing, or polling-driven command resubmission.
- Inferring terminal state from missing events.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F2 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

