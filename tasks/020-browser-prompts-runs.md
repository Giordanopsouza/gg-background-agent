---
id: 020-browser-prompts-runs
feature: web
status: pending
---

# Submit prompts and inspect queued runs

## Scope

Add the prompt/scenario form and snapshot-based run cards so a user can submit simulations and inspect their queue and results.

## Context

- Milestone: F2 in the [roadmap](../docs/roadmap.md).
- Requirements: FR-02; FR-04; FR-11; FR-12; AC-11 in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [019-browser-sessions](019-browser-sessions.md) — Browse and create sessions in the UI.
- [006-submit-prompts](006-submit-prompts.md) — Accept prompts into the durable queue.
- [009-durable-scheduler](009-durable-scheduler.md) — Execute queued runs one at a time.

## Acceptance criteria

- [ ] Submit text with an explicit success/failure/slow choice using one idempotency key per action; uncertain retries reuse that key.
- [ ] Respect text/body limits and display the session prompt cap and server validation errors without dropping unsent text.
- [ ] Only show accepted prompts/runs after server acknowledgement or reconciliation; distinguish a submitted request from a running task.
- [ ] Render queue/running/terminal states, attempt identity, summaries, and errors from snapshots; allow explicit refresh before live updates arrive.
- [ ] Queue multiple prompts while one runs, and make submission keyboard-accessible without accidental duplicate commands.
- [ ] Record success/failure/slow, queueing, validation, request retry, and refresh walkthroughs.

## Out of scope

- Live timeline reconciliation owned by task 021.
- Cancellation/retry actions and actual model output.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F2 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

