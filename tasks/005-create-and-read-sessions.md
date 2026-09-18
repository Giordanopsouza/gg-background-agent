---
id: 005-create-and-read-sessions
feature: sessions
status: pending
---

# Create and retrieve sessions

## Scope

Implement session creation, paginated listing, and consistent session snapshots through the coordinator and HTTP routes.

## Context

- Milestone: F1 in the [roadmap](../docs/roadmap.md).
- Requirements: FR-01; FR-03; AC-01 in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [002-local-server-configuration](002-local-server-configuration.md) — Start a local-only HTTP server.
- [004-transactional-commands-events](004-transactional-commands-events.md) — Persist commands and events atomically.

## Acceptance criteria

- [ ] POST /api/sessions validates the 200-character title limit and atomically returns 201 with a UUID session, session.created event, and command receipt.
- [ ] Duplicate creation with the same key returns the original session; changed input returns 409.
- [ ] GET /api/sessions defaults to 50 items, caps pages at 100, and has deterministic creation ordering with a tie-breaker for equal timestamps and an after-ID cursor.
- [ ] GET /api/sessions/:id reads ordered prompt/run summaries and lastEventSeq in one consistent transaction.
- [ ] Unknown IDs return 404 without creating records; invalid pagination returns a stable validation error.
- [ ] Integration tests cover empty lists, page boundaries, equal-timestamp ordering, deduplicated creation, and snapshot/cursor consistency.

## Out of scope

- Prompt submission and worker execution.
- A separate persisted session-running flag.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F1 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

