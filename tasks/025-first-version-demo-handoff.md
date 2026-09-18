---
id: 025-first-version-demo-handoff
feature: demo
status: pending
---

# Complete the first-version demonstration

## Scope

Finalize first-version usage documentation and demonstrate the complete five-minute learning workflow against the implemented application.

## Context

- Milestone: F2 in the [roadmap](../docs/roadmap.md).
- Requirements: AC-01 through AC-12; FR-01 through FR-12 in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [022-browser-cancel-retry](022-browser-cancel-retry.md) — Control cancellation and retry in the UI.
- [023-demo-seed-command](023-demo-seed-command.md) — Seed repeatable simulation examples.
- [024-local-latency-measurement](024-local-latency-measurement.md) — Measure local acceptance and display latency.

## Acceptance criteria

- [ ] Update the root README from planning-only status to accurate implemented scope with real install, migrate, dev/build/start, test, and seed commands.
- [ ] Document single-user/single-process-per-database constraints, localhost operation, simulation labeling, and what browser closure versus server shutdown does.
- [ ] Follow the roadmap's five-minute demo: submit/queue, close/reconnect, cancel, kill/restart, inspect interruption, and explicitly retry.
- [ ] Record AC-11/AC-12 browser walkthrough evidence and link every FR/AC to its owning passing test or recorded walkthrough without creating a separate task-plan document.
- [ ] Run the applicable build, typecheck, lint, formatting, unit/integration, and e2e checks; record actual outcomes and retain any unresolved criteria as unchecked.
- [ ] Explain session, run, worker, event, workspace, and sandbox accurately; list real agent execution and hosting as future work.
- [ ] Append Tester results before following the README's commit-and-done lifecycle; do not mark this task complete from documentation changes alone.

## Out of scope

- Implementing F3–F5 or provisioning infrastructure.
- Rebranding simulated steps as real coding or verification.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F2 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

