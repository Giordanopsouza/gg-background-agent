# Sources, attribution, and confidence

Reviewed September 18, 2026. Implementation decisions in our documents are proposals unless explicitly attributed to a source.

## User-provided input

- [Supplied architecture diagram](ramp-supplied-diagram.mmd), preserved verbatim from the attachment. This is the source for the detailed module inventory, file labels, and service connections.
- User direction: start with simple building blocks; Cloudflare and OpenCode are not mandatory, and the first stage need not include an agent or remote computer.
- User objective: understand and explain the system, build a compelling demo, then grow toward production.

## Primary external references

| Source | Used for |
| --- | --- |
| [Ramp: Why We Built Our Own Background Agent](https://engineering.ramp.com/post/why-we-built-our-background-agent) | Motivation and a short historical summary of Inspect |
| [Original user-linked Ramp URL](https://builders.ramp.com/post/why-we-built-our-background-agent) | Alternate address for the same article |
| [OpenCode server](https://opencode.ai/docs/server/) | Server/client placement, HTTP surface, SSE event transport |
| [OpenCode SDK](https://opencode.ai/docs/sdk/) | Runner-side typed client |
| [Modal snapshots](https://modal.com/docs/guide/sandbox-snapshots) | Snapshot categories and recovery limitations |
| [Cloudflare Durable Object WebSockets](https://developers.cloudflare.com/durable-objects/best-practices/websockets/) | Inbound versus outbound hibernation behavior |
| [Cloudflare storage](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/) | Reference for a possible future durable session implementation |
| [GitHub App installation authentication](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/authenticating-as-a-github-app-installation) | Future repository-scoped app credentials |
| [Node releases](https://nodejs.org/en/about/previous-releases) | Node 24 LTS baseline |
| [TypeScript 6.0](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html) | Compiler baseline |
| [Express 5](https://expressjs.com/en/5x/api/) | Minimal HTTP framework candidate |
| [better-sqlite3 releases](https://github.com/WiseLibs/better-sqlite3/releases) | SQLite library candidate and version baseline |

The direct Ramp pages exposed only a JavaScript shell through the page reader. The full article was available through the search index of Ramp's own engineering domain; that primary-source indexed text was read for this analysis. No third-party recreation was treated as authoritative.

## Unverified or intentionally unresolved

- The provenance and exact implementation fidelity of the supplied diagram.
- Ramp's current adoption, operating costs, reliability, or internal implementation.
- Compatibility of a particular future OpenCode version with question handling, cancellation, crash recovery, and our target repository. Test these before selecting a harness.
- Whether checkpointing preserves all future application dependencies consistently; a filesystem image alone is not that proof.
- Exact versions and native-module installation compatibility for the proposed local stack. F0 must pin and test them; these documents do not claim an installed or validated dependency set.
- Target repository, model provider, cloud budget, identity provider, and production scale.

No latency, cost, availability, or coding-quality benchmark has been run. Targets in the spec are acceptance criteria for future work.
