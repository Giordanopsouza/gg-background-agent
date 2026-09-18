# GG Background Agent — architecture and specifications

Build an understandable background coding system in small, demonstrable steps. Start with durable sessions and a scripted worker; add a coding agent, isolated execution, and pull requests only after that foundation works.

**Status:** F0 toolchain is pinned and the local HTTP server defaults to 127.0.0.1:3000 (September 18, 2026). Session behavior and SQLite storage are not implemented yet. Cloudflare, Modal, and OpenCode remain reference choices, not requirements for the first build.

## Runtime

Install with Node **24**, then:

```sh
nvm install
npm ci
npm run build
npm run typecheck
npm run lint
npm run format:check
npm test
```

`npm run dev` watches `src/` and runs the TypeScript server. `npm start` runs the compiled server after `npm run build`. Both bind `127.0.0.1:3000` by default (`HOST`, `PORT`, `DATABASE_PATH`). `GET /health` reports readiness and `mode: simulated`. Session routes and SQLite recovery are later tasks; application routes return 503 until the server is ready.

`db:migrate`, `test:e2e`, and `demo:seed` are owned by later tasks and are not present as placeholders.

Checked on Node 24 (macOS Darwin 25.6.0 arm64, and Linux aarch64 via `node:24.21.0-bookworm`). Windows is pending. Any current Node 24 release is fine; package versions are pinned in `package-lock.json`.

## Read in this order

1. [Architecture](docs/architecture.md): how the supplied reference works, what we retain, and how the first version differs.
2. [First-build specification](docs/specs/001-session-foundation.md): requirements, stack, interfaces, lifecycle, tests, commands, and acceptance criteria.
3. [Roadmap and demo](docs/roadmap.md): small milestones and the gates before real code execution and production.
4. [Domain glossary](CONTEXT.md): precise meanings of session, run, workspace, and sandbox.
5. [Sources and evidence](docs/reference/sources.md): source attribution and uncertainties.
6. [Task tracker](tasks/README.md): one file per atomic task, with dependencies, acceptance criteria, and status. Begin with [001 — Bootstrap the TypeScript toolchain](tasks/001-bootstrap-typescript-toolchain.md).

The [original supplied Mermaid diagram](docs/reference/ramp-supplied-diagram.mmd) is preserved unchanged. The diagrams in the architecture document describe our proposal.

## First learning outcome

Submit a task, watch recorded progress, close the client, reconnect, and see that the task continued. Queue another prompt, cancel it, and restart the server to see explicit recovery behavior. All execution in this first version is labeled **simulation**.

The first-version tasks cover F0–F2 in the [roadmap](docs/roadmap.md). Complete the F1 acceptance gate before beginning browser work. No cloud accounts, model credentials, repository access, or paid infrastructure are needed for this version.
