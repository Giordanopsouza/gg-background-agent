---
id: 006-submit-prompts
feature: sessions
status: pending
---

# Accept prompts into the durable queue

## Scope

Implement prompt submission as a durable command that creates one prompt and its first queued run before acknowledging the request.

## Context

- Milestone: F1 in the [roadmap](../docs/roadmap.md).
- Requirements: FR-02; FR-03; AC-02 in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [005-create-and-read-sessions](005-create-and-read-sessions.md) — Create and retrieve sessions.

## Acceptance criteria

- [ ] POST /api/sessions/:id/prompts validates text up to 16,000 characters and an explicit success, failure, or slow scenario.
- [ ] One transaction records local-user authorship, an attempt-1 run with globally ordered queue position, prompt.accepted and run.queued events, and the command receipt.
- [ ] Return 202 with prompt/run IDs immediately after commit; execution need not have started.
- [ ] Ten duplicate requests with one key create exactly one prompt/run; changed input returns 409 and unknown sessions return 404.
- [ ] The 101st distinct prompt in a session is rejected clearly; replaying an already accepted request at the cap still returns its original response.
- [ ] Integration tests prove queue persistence across reopen and that failed transactions are neither acknowledged nor partially visible.

## Out of scope

- Execution, retry, or AI conversation context.
- Converting prompt text into shell commands.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F1 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

