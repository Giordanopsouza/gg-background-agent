---
id: 018-browser-shell
feature: web
status: pending
---

# Serve the simulation interface shell

## Scope

Add a minimal same-origin HTML/CSS/JavaScript shell served by the existing server, visibly labeled as a simulation.

## Context

- Milestone: F2 in the [roadmap](../docs/roadmap.md).
- Requirements: FR-12; AC-11 in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [017-restart-e2e-foundation-gate](017-restart-e2e-foundation-gate.md) — Verify restart recovery and the terminal demo.

## Acceptance criteria

- [ ] Development and compiled production commands serve the same browser shell; npm run build copies static assets into the distributable.
- [ ] The page has a persistent simulation label and distinct regions for sessions, prompt submission, run status, timeline, and connection state.
- [ ] Empty/loading/error states are readable without fabricated sessions or progress.
- [ ] Use semantic controls, keyboard focus indicators, accessible status text, and a layout usable at narrow and desktop widths.
- [ ] Keep scripts/styles local; introduce no frontend framework, account login, or new deployment requirement.
- [ ] Record a manual keyboard/narrow-width walkthrough and verify built asset URLs return successfully.

## Out of scope

- Session API wiring and event subscriptions.
- Polished dashboards, editors, or remote desktop embeds.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F2 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

