---
id: 008-scripted-worker
feature: execution
status: pending
---

# Implement cancellable simulation scenarios

## Scope

Create the asynchronous scripted worker with success, failure, and slow scenarios. Keep it independent of storage and HTTP.

## Context

- Milestone: F1 in the [roadmap](../docs/roadmap.md).
- Requirements: FR-11; Scripted worker behavior in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [001-bootstrap-typescript-toolchain](001-bootstrap-typescript-toolchain.md) — Bootstrap the TypeScript toolchain.

## Acceptance criteria

- [ ] success emits three labeled progress steps and a simulated summary; failure emits one step then SIMULATED_FAILURE.
- [ ] slow emits observable progress over approximately 15 seconds using asynchronous delays that leave the event loop responsive.
- [ ] The worker accepts a cancellation signal and progress callback; cancellation interrupts waits and prevents subsequent steps.
- [ ] All output identifies simulation and makes no claim that code changed, checks actually ran, or a PR exists.
- [ ] Deterministic tests use controlled timing to check step order, failure, abort before start, and abort during a delay.
- [ ] The worker invokes no model, child shell, repository modification, or network service.

## Out of scope

- Database writes, lifecycle ownership, and worker self-retries.
- Agent harness or provider abstractions.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F1 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

