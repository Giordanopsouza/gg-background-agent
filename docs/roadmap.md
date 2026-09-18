# Roadmap: from a session demo to a background coding system

Status: proposed. These milestones are capability gates, not calendar estimates. Finish and explain each stage before increasing infrastructure or autonomy.

## F0 — Make the local project reproducible

**Build:** one Node/TypeScript package, exact dependency pins, scripts from the [first-build spec](specs/001-session-foundation.md), configuration validation, SQLite migration, health endpoint, and test setup.

**Learn:** how the application starts and where its durable state lives.

**Exit:** a clean checkout installs, builds, migrates, starts, and passes a storage/HTTP smoke test on the documented runtime. Record exact tool versions. This is where version baselines become a validated dependency set.

## F1 — Durable sessions and scripted execution

**Build:** session/prompt/run records, command deduplication, a database-backed queue, one scheduler, scripted worker, event history, SSE, cancellation, and explicit interruption/retry behavior.

**Learn:** background execution is a lifecycle and ownership problem, even before an AI model is involved.

**Demo:** use two terminals: submit a slow simulated task, observe its event stream, disconnect the observer, and fetch the completed result. Kill/restart the server separately to demonstrate the difference between losing a client and losing the executor.

**Exit:** AC-01 through AC-10 in the spec pass. No model, shell execution, GitHub integration, or cloud account is needed.

## F2 — A small interface that makes the lifecycle visible

**Build:** a same-origin browser page with session list, prompt input, queued/running/terminal status, progress timeline, cancel/retry controls, and transport connection status. Show a persistent simulation label. Serve it from the existing server.

**Learn:** UI state can be reconstructed from durable server state; an open connection is not the task itself.

**Exit:** AC-11 and AC-12 pass. Refresh and reconnect do not duplicate progress or resubmit prompts. The demo can be explained without discussing vendor APIs.

### Five-minute demonstration

| Time | Action | Explain |
| --- | --- | --- |
| 0:00–0:40 | Show the small architecture diagram | Client, coordinator, database, worker |
| 0:40–1:30 | Submit a slow simulation, then another prompt | Prompt acceptance differs from execution; the queue is durable |
| 1:30–2:15 | Close the tab and reopen it | Work continues because it belongs to the server |
| 2:15–3:00 | Cancel queued or active work | Cancellation is a recorded transition |
| 3:00–4:00 | Start another slow run; kill and restart the server | History survives; in-flight work becomes interrupted |
| 4:00–5:00 | Retry and show the new attempt; show the next-stage diagram | An AI harness will replace simulated execution, while session concepts remain |

Call this a **background session engine demo**. Do not present it as an autonomous coding demo until F3 is working.

## F3 — A real coding loop in a disposable learning workspace

**Prerequisites:** select a small target repository, model/provider, and spending limit. Prefer a separate demo repository with fast deterministic tests. Do not start by giving the agent the orchestration project's own credentials or infrastructure.

**Build:** select a harness after a compatibility spike; add a runner that submits a prompt, normalizes progress, requests cancellation, and collects a patch and test results. Retain the scripted worker for deterministic lifecycle tests. Add a workspace identity and associate each run with its input revision and result revision.

**Harness spike:** prove one prompt, progress streaming, tool execution, abort, question/permission handling, process restart behavior, and retrieval of the terminal result. Inspect the pinned harness's actual contract. A named library alone is not evidence that all behaviors work.

**Workspace policy:** allocate a disposable checkout for the session. Local checkout separation is not a security sandbox. Local real execution is suitable only for an explicitly trusted learning repository with reviewed tools and no company secrets. If those conditions cannot be met, do F4 before real execution.

**New rules:**

- Only one writer per workspace. Human edits require the worker to pause or terminate first.
- Record exact tool command, working directory, exit code, logs, and source revision for verification. A model statement that tests passed is insufficient evidence.
- Separate `execution finished` from `verification passed`. A completed run can have failed or missing checks.
- Decide whether questions produce `waiting_for_input`, how responses are correlated, and what timeouts mean before enabling interactive tools.
- When a tool's outcome is unknown after a crash, reconcile or ask for an explicit retry. Never promise exactly-once shell side effects.
- Pause dependent follow-ups after failed/interrupted real work until workspace state is understood. The independent simulation queue semantics are insufficient here.
- Bound runtime, model calls, tool calls, output sizes, and retries. Treat reported cost as an estimate unless usage accounting is complete.

**Exit:** fix one seeded bug in the demo repository, show the patch, run the repository's tests, and demonstrate one failure honestly. No PR publication is required. Update the domain model/spec for real execution before implementing it.

## F4 — Isolated, recoverable execution

**Prerequisites:** deployment constraints, provider choice, budget, network policy, and expected concurrency. Cloudflare/Modal can be evaluated here against a conventional backend plus isolated workers.

**Build:** separate trusted session control from repository execution. Add sandbox creation/termination, image identity, checkpoint records, heartbeat/lease handling, and artifact storage. Keep sessions independent of sandbox lifetimes. Provision repository dependencies based on a reviewed manifest.

**Distributed correctness requirements:**

- Allocate work with expiring ownership and a monotonically increasing generation/fencing token. Reject stale worker updates and publishing requests.
- Stop/revoke the old executor before allowing replacement writes. Fencing an event endpoint alone cannot stop a stale process from modifying files or external systems.
- Identify commands/events and deduplicate retries. Persist outbound work in the same transaction as scheduling state; reconcile uncertain allocation results before creating duplicate sandboxes.
- Checkpoint only at defined quiescent points. Record workspace revision, uncommitted-file recovery, harness context, image version, and expiry. Restart processes on restore and validate application data consistency.
- Define what can be lost since the last checkpoint and show that limitation. Do not promise zero lost edits merely because session events are durable.
- Detect orphaned resources, reclaim them, and report failures without unlimited retry loops.

**Exit:** disconnect clients without stopping work; terminate a sandbox and recover from a known checkpoint; deliver duplicate callbacks without duplicated state; reject stale executor mutations; confirm one session cannot read another session's workspace or artifacts.

## F5 — Reviewable GitHub changes

**Prerequisites:** repository allowlist, branch policy, publishing identity, user authorization, and review requirements.

**Build:** explicitly requested draft-PR publication, trusted GitHub integration, branch/PR reconciliation, and authenticated webhook ingestion. The sandbox produces a patch or commit candidate; trusted publishing logic validates target repository, base revision, branch, and policy before writing externally.

GitHub App installation access can be scoped to selected repositories and permissions; installation credentials are distinct from a human login. Choose the PR author identity deliberately and retain the initiating user's attribution. [GitHub installation authentication](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/authenticating-as-a-github-app-installation).

**Required behaviors:**

- Commit a publishing intent before external calls. Associate it with a deterministic branch/session identifier. After an ambiguous response, search/reconcile before retrying creation.
- Revalidate the exact source revision and checks attached to it. New edits invalidate earlier verification evidence.
- Validate webhook signatures, deduplicate delivery IDs, and prevent old events from regressing current state.
- Keep merge policy distinct from PR creation. Attribution alone does not enforce independent review; repository protections and workflow policy must do so.
- No merge permission is needed for this milestone. No automatic deployment is part of PR publication.

**Exit:** one approved demo request produces one draft PR with a diff, verification evidence, and session link. Retrying publication produces no duplicate PR. A human handles review and merge under the repository's rules.

## Production gate — required before real company use

The earlier demo milestones do not establish production readiness. Write a dedicated production spec once target users, repositories, and operational constraints are known.

| Area | Required decision or evidence |
| --- | --- |
| Identity and authorization | Organization login, repository access checks, session membership, revocation, and artifact authorization; test cross-user access |
| Credential separation | No long-lived platform or publishing credentials in agent-readable files/images; short-lived scoped credentials or a trusted broker; test secret leakage paths |
| Execution isolation | Treat repository code, dependencies, and retrieved content as untrusted; define network egress, resource limits, and isolation appropriate to the workload |
| Tool policy | Enforce permitted actions outside model-generated text; separate read-only context access from externally mutating tools |
| Recovery | Defined recovery time/data-loss objectives; verified backups/restores; checkpoint retention; reconciliation of ambiguous external effects |
| Availability | Agreed service objectives and alert ownership; tested provider outage, token expiry, queue backlog, and database failure |
| Cost and capacity | Per-run runtime/token/tool limits, global concurrency/admission limits, spend measurement, orphan cleanup, and operational stop controls |
| Observability | Correlated session/run/workspace IDs, error categories, queue/startup/verification timings, audit trail; logs redact secrets |
| Data lifecycle | Retention/deletion for prompts, source copies, artifacts, snapshots, and logs; clarify provider data handling and repository requirements |
| Evaluation | Fixed representative tasks; measure verified task success, regressions, intervention rate, time to reviewable change, and cost per successful task |
| Rollout | Small repository/user allowlist first; explicit expansion criteria, rollback plan, and incident ownership |

Candidate product metrics are accepted tasks that become verified changes, review/merge outcomes, time saved, and user intervention. Token count and number of generated PRs alone are not success measures. Establish a baseline with human or existing-tool performance before claiming improvement.

## Defer until there is evidence of need

Slack/Linear clients, browser extension, multiplayer editing, VNC, hosted VS Code, warm sandbox pools, multiple models per task, automatic child agents, long-term agent memory, and organization analytics. Each adds a separate behavior to explain and operate. None blocks the first learning outcome.

## Immediate next task

Implement F0 and F1 from [Spec 001](specs/001-session-foundation.md), then stop to run and explain the acceptance walkthrough before starting F2. The target repository and cloud stack can remain undecided during this work.
