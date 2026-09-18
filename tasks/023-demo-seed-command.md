---
id: 023-demo-seed-command
feature: demo
status: pending
---

# Seed repeatable simulation examples

## Scope

Implement the demo seed command using the application's public command contract to create clearly labeled learning examples.

## Context

- Milestone: F2 in the [roadmap](../docs/roadmap.md).
- Requirements: Commands; AC-12 in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [018-browser-shell](018-browser-shell.md) — Serve the simulation interface shell.
- [011-retry-runs](011-retry-runs.md) — Retry terminal attempts without rewriting history.

## Acceptance criteria

- [ ] npm run demo:seed targets the configured local server and creates labeled sessions with success, failure, and slow scenarios.
- [ ] Use deterministic seed-specific idempotency keys so rerunning the seed avoids duplicate fixtures while leaving other user sessions untouched.
- [ ] Report session IDs and URLs plus readiness/connection errors; do not claim execution completed merely because submission succeeded.
- [ ] Seed content consistently says simulation and contains no credentials or real repository instructions.
- [ ] Test two consecutive seed runs against an isolated server, proving stable fixture identities and preservation of preexisting user data.
- [ ] Document how to start the server, seed examples, and create fresh manual runs for the walkthrough without deleting storage.

## Out of scope

- Database reset commands or direct fixture writes that bypass coordinator invariants.
- Real repositories or external demo services.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F2 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

