---
id: 002-local-server-configuration
feature: http
status: in-progress
---

# Start a local-only HTTP server

## Scope

Add local configuration, the Express server entry point, and a consistent HTTP error envelope.

## Context

- Milestone: F0 in the [roadmap](../docs/roadmap.md).
- Requirements: AC-01; HTTP contracts; Boundaries in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

- [001-bootstrap-typescript-toolchain](001-bootstrap-typescript-toolchain.md) — Bootstrap the TypeScript toolchain.

## Acceptance criteria

- [x] Defaults match the spec: 127.0.0.1:3000, ./.data/sessions.sqlite, and simulated worker mode.
- [x] npm run dev and npm start launch the development and compiled server respectively; GET /health reports readiness and mode: simulated.
- [x] Before readiness, application routes return 503; claiming an occupied listening port fails before any database recovery can execute.
- [x] Malformed JSON, unknown routes, and unexpected errors use the documented JSON error envelope without stack traces.
- [x] HTTP tests cover valid requests, malformed JSON, and not-ready responses.

## Out of scope

- Account authentication and public hosting.
- Scheduler startup and database recovery, wired in later tasks.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F0 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

### [SWE] 2026-09-18 15:59 — Start implementation

Began the local HTTP server: validated loopback configuration, Express entry, listen-before-recovery ordering, and the JSON error envelope. Timestamp uses America/Sao_Paulo.

### [SWE] 2026-09-18 16:02 — Server verified

Express 5.2.1 is pinned. Defaults are 127.0.0.1:3000, ./.data/sessions.sqlite, WORKER_MODE=simulated. GET /health returns readiness and mode. Occupied ports fail before recovery. JSON commands enforce 64 KiB, expected Host, and same-origin Origin; curl without Origin works. Errors use `{error:{code,message}}` without stacks. `npm test`, typecheck, lint, format:check, and build pass. Status stays in-progress pending Tester and commit. Timestamp uses America/Sao_Paulo.

### [SWE] 2026-09-18 16:29 — Drop request Host/Origin/size checks

Removed Host, Origin, and the 64 KiB body cap from the HTTP layer. The server still binds loopback only, parses JSON, returns 503 until ready, and uses the JSON error envelope. Timestamp uses America/Sao_Paulo.

### [SWE] 2026-09-18 16:33 — Collapse config parsing

`loadConfig` now applies defaults and converts PORT with `Number`. It no longer rejects host, port, path, or mode values. Timestamp uses America/Sao_Paulo.

