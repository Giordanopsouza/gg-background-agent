---
id: 001-bootstrap-typescript-toolchain
feature: tooling
status: pending
---

# Bootstrap the TypeScript toolchain

## Scope

Create the minimal Node/TypeScript package and reproducible development, build, formatting, and test tooling. This task establishes executable tooling; later tasks supply the application commands they own.

## Context

- Milestone: F0 in the [roadmap](../docs/roadmap.md).
- Requirements: AC-01; Tech stack; Commands in [Spec 001](../docs/specs/001-session-foundation.md).
- Apply the [tracker lifecycle](README.md); use the [domain glossary](../CONTEXT.md) for terminology.

## Dependencies

None.

## Acceptance criteria

- [ ] Pin a Node 24 LTS patch, its npm version, and compatible exact direct dependency versions; commit-ready package-lock.json is generated and clean npm ci succeeds.
- [ ] Strict TypeScript ESM compilation emits to dist/; source and compiled tests have deliberate, separate entry points.
- [ ] npm run build, npm run typecheck, npm run lint, npm run format:check, and npm test work; tests use node:test and node:assert/strict.
- [ ] Provide the development watch/start mechanism for a minimal entry point; do not install no-op scripts that falsely pass future migration, e2e, or seeding work.
- [ ] Ignore node_modules, dist, .data, SQLite sidecars, and local secrets while retaining tracked configuration examples.
- [ ] Record macOS and Linux install/build evidence using available environments or CI; an untested platform is explicitly pending rather than claimed supported.

## Out of scope

- Session behavior, database schema, and HTTP routes.
- Cloud setup and extra package/workspace frameworks.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F0 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

