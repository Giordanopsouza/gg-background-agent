# GG Background Agent — architecture and specifications

Build an understandable background coding system in small, demonstrable steps. Start with durable sessions and a scripted worker; add a coding agent, isolated execution, and pull requests only after that foundation works.

**Status:** planning only, September 18, 2026. This repository contains documentation, not a runnable application. Cloudflare, Modal, and OpenCode are reference choices, not requirements for the first build.

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
