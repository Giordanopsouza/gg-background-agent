---
id: 014-read-event-history
feature: events
status: pending
---

# Expose cursor-based event history

## Scope

Expose bounded durable event reads with the same cursor semantics that the later stream will use.

## Context

- Milestone: F1 in the [roadmap](../docs/roadmap.md).
- Requirements: FR-06; AC-05; HTTP and event contracts in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [005-create-and-read-sessions](005-create-and-read-sessions.md) — Create and retrieve sessions.
- [007-run-lifecycle](007-run-lifecycle.md) — Enforce run lifecycle transitions.

## Acceptance criteria

- [ ] GET /api/sessions/:id/events returns ordered envelopes after the cursor and the last returned cursor; defaults to after=0 and limit=100.
- [ ] Cap limit at 500 and reject invalid limits or negative, noninteger, and ahead-of-history cursors.
- [ ] Unknown sessions return 404; empty existing histories/pages return a consistent empty result without inventing events.
- [ ] Return schemaVersion, sessionId, seq, nullable runId, type, at, and data from committed storage only.
- [ ] Use the shared event reader rather than a second in-memory history; paginated reads during new commits omit no events and repeat none.
- [ ] Integration tests cover page boundaries, cursor validation, independent session sequences, and concurrent appends.

## Out of scope

- SSE connection management and retention/expired cursors.
- Raw database rows in public response bodies.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F1 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

