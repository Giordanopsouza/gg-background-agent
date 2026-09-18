---
id: 011-retry-runs
feature: execution
status: pending
---

# Retry terminal attempts without rewriting history

## Scope

Add an idempotent retry command that creates a new queued attempt for the original prompt.

## Context

- Milestone: F1 in the [roadmap](../docs/roadmap.md).
- Requirements: FR-10; AC-08 in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [010-cancel-runs](010-cancel-runs.md) — Cancel queued and active runs.

## Acceptance criteria

- [ ] POST /api/runs/:id/retry permits failed, interrupted, and cancelled attempts and rejects succeeded/nonterminal attempts with 409.
- [ ] The new run preserves prompt and scenario, increments that prompt's attempt number, records retry_of, and receives a new UUID and global queue order.
- [ ] Old attempt state, events, timestamps, and errors remain unchanged; the new run.queued event and command receipt commit atomically.
- [ ] Reject retries when the prompt already has a nonterminal attempt, including attempts created from another historical run.
- [ ] Duplicate retry requests return the same new attempt; enqueue notification occurs only after commit.
- [ ] Tests cover all permitted/rejected states, duplicate requests, multiple historical attempts, and execution of the new attempt.

## Out of scope

- Editing the original instruction or changing its scenario.
- Automatic retries and real tool-effect reconciliation.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F1 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

