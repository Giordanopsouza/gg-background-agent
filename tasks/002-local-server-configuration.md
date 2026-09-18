---
id: 002-local-server-configuration
feature: http
status: pending
---

# Start a local-only HTTP server

## Scope

Add validated configuration, the Express server entry point, and a consistent local HTTP error boundary.

## Context

- Milestone: F0 in the [roadmap](../docs/roadmap.md).
- Requirements: AC-01; HTTP contracts; Boundaries in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [001-bootstrap-typescript-toolchain](001-bootstrap-typescript-toolchain.md) — Bootstrap the TypeScript toolchain.

## Acceptance criteria

- [ ] Defaults match the spec: 127.0.0.1:3000, ./.data/sessions.sqlite, and simulated worker mode; invalid port, nonlocal binding, or unsupported mode fails clearly.
- [ ] npm run dev and npm start launch the development and compiled server respectively; GET /health reports readiness and mode: simulated.
- [ ] Before readiness, application routes return 503; claiming an occupied listening port fails before any database recovery can execute.
- [ ] JSON commands enforce a 64 KiB limit, expected Host values, and same-origin browser requests; localhost curl requests without an Origin remain usable.
- [ ] Malformed input, oversized bodies, unknown routes, and unexpected errors use the documented JSON error envelope without stack traces.
- [ ] HTTP tests cover valid requests, malformed JSON, limits, Host/Origin rejection, and not-ready responses.

## Out of scope

- Account authentication and public hosting.
- Scheduler startup and database recovery, wired in later tasks.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F0 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

