---
id: 001-bootstrap-typescript-toolchain
feature: tooling
status: in-progress
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

- [x] Require Node 24 and pin exact direct dependency versions; commit-ready package-lock.json is generated and clean npm ci succeeds.
- [x] Strict TypeScript ESM compilation emits to dist/; source and compiled tests have deliberate, separate entry points.
- [x] npm run build, npm run typecheck, npm run lint, npm run format:check, and npm test work; tests use node:test and node:assert/strict.
- [x] Provide the development watch/start mechanism for a minimal entry point; do not install no-op scripts that falsely pass future migration, e2e, or seeding work.
- [x] Ignore node_modules, dist, .data, SQLite sidecars, and local secrets while retaining tracked configuration examples.
- [x] Record macOS and Linux install/build evidence using available environments; an untested platform is explicitly pending rather than claimed supported.

## Out of scope

- Session behavior, database schema, and HTTP routes.
- Cloud setup and extra package/workspace frameworks.

## Log

### [PA] 2026-09-18 12:22 — Grooming

Created for F0 of the local simulated first version. Dependencies and verification criteria are specified; implementation has not started. Timestamp uses America/Sao_Paulo.

### [SWE] 2026-09-18 14:36 — Start implementation

Began F0 toolchain bootstrap: pin Node 24 LTS, exact npm and dependency versions, ESM TypeScript emit, and the development/test scripts the later application tasks will use.

### [SWE] 2026-09-18 14:47 — Toolchain verified

Pinned Node 24.21.0 and npm 11.19.0 with exact direct dependencies (TypeScript 6.0.3, ESLint 10.10.0, typescript-eslint 8.70.0, Prettier 3.9.8). App emit is `dist/`; tests emit separately to `dist-tests/`. `npm ci`, `build`, `typecheck`, `lint`, `format:check`, `test`, `dev`, and `start` succeed. `db:migrate`, `test:e2e`, and `demo:seed` were omitted. Evidence: macOS Darwin 25.6.0 arm64; Linux aarch64 `node:24.21.0-bookworm`. Windows is pending. GitHub Actions `ubuntu-latest` is present for later x64 Linux evidence.

### [SWE] 2026-09-18 15:52 — Relax runtime pins and watcher

Dropped the exact Node/npm patch requirement (`>=24`, no `engine-strict`, no `packageManager` pin). Replaced `scripts/dev.mjs` with `node --watch --watch-path=src src/server.ts`. Package versions stay exact via the lockfile.

### [SWE] 2026-09-18 15:54 — Remove GitHub Actions

Deleted `.github/workflows/ci.yml`. Toolchain checks stay local (`npm test`, typecheck, lint, format). Linux evidence remains the earlier aarch64 container run, not hosted CI.

