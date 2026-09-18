---
id: 024-local-latency-measurement
feature: verification
status: pending
---

# Measure local acceptance and display latency

## Scope

Add a repeatable local measurement procedure for prompt acknowledgement and committed-event display latency, with results tied to the test environment.

## Context

- Milestone: F2 in the [roadmap](../docs/roadmap.md).
- Requirements: Spec performance targets in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [021-browser-live-timeline](021-browser-live-timeline.md) — Reconcile snapshots and live progress.

## Acceptance criteria

- [ ] Measure at least 30 simulated runs on a documented unloaded machine, recording runtime versions, hardware, scenarios, and observer count.
- [ ] Measure prompt submission-to-acknowledgement independently from queue wait/execution; measure committed-event-to-browser-display delay with the clock method and its precision documented.
- [ ] Calculate p95 for both metrics and compare with the provisional 250 ms acceptance and 1 second display targets without conflating model or cloud latency.
- [ ] Store sample/results evidence in the task log or a linked measurement artifact, keeping prompt content and private environment values out of reports.
- [ ] If a target fails, leave the criterion pending with the measured bottleneck; any fixes stay within the local simulation scope and rerun affected checks.
- [ ] Clearly label these as local measurements rather than production SLOs or demonstrated coding performance.

## Out of scope

- Cloud load tests or broad speculative optimization.
- Changing agreed thresholds merely to obtain a pass.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F2 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

