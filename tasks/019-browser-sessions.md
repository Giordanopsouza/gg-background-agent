---
id: 019-browser-sessions
feature: web
status: pending
---

# Browse and create sessions in the UI

## Scope

Wire session creation, listing, selection, and snapshot loading into the browser shell.

## Context

- Milestone: F2 in the [roadmap](../docs/roadmap.md).
- Requirements: FR-01; AC-11 in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [018-browser-shell](018-browser-shell.md) — Serve the simulation interface shell.
- [005-create-and-read-sessions](005-create-and-read-sessions.md) — Create and retrieve sessions.

## Acceptance criteria

- [ ] Load and paginate the session list, display an empty state, and allow validated session creation through the existing HTTP contract.
- [ ] Allocate one idempotency key per deliberate create action and reuse it for uncertain-request retries; a new action gets a new key.
- [ ] Selecting a session loads its prompt/run snapshot and lastEventSeq; refreshing restores the selected session without submitting any commands.
- [ ] Handle unknown/deleted selections, validation errors, and server-unavailable responses visibly without inventing state.
- [ ] Render all user-provided titles/text safely as text rather than executable markup.
- [ ] Record a browser walkthrough covering creation, duplicate/uncertain response retry, selection, refresh, and pagination.

## Out of scope

- Prompt submission, live event streaming, and cancel/retry controls.
- User accounts or cross-device preferences.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F2 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

