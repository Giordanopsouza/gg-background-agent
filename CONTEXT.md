# Background coding work

This project coordinates coding work that can continue after a person leaves the interface. The vocabulary separates the durable conversation, an individual execution, and the environment where code changes happen.

## Language

**Background agent**:
A coding assistant that works independently of an open client and reports its progress and results.
_Avoid_: Backdoor agent

**Session**:
A persistent conversation about one task, containing prompts, runs, and their history. A session can outlive any individual execution environment.
_Avoid_: Run, sandbox

**Prompt**:
A person's instruction submitted to a session, with its own identity and authorship.
_Avoid_: Job

**Run**:
One execution attempt to fulfill a prompt. Retrying creates a new run linked to the previous attempt.
_Avoid_: Session

**Worker**:
The executor assigned to carry out a run; in the learning version it produces scripted progress, and later it can drive a coding agent.
_Avoid_: Model

**Harness**:
The system that manages a coding agent's model calls, tools, and conversation while it performs a run.
_Avoid_: Model, session coordinator

**Workspace**:
The working copy of a target repository and the files produced while completing a session's task.
_Avoid_: Session, sandbox

**Sandbox**:
An isolated execution environment containing a workspace and its development tools.
_Avoid_: Workspace, session

**Event**:
A recorded fact about a session or run, such as a prompt being accepted or an execution finishing.
_Avoid_: Command

**Artifact**:
A result retained for inspection, such as a patch, screenshot, or test report.
_Avoid_: Event

**Checkpoint**:
A recoverable version of a workspace and the execution context needed to continue its task.
_Avoid_: Conversation history

**Verification**:
Evidence that a proposed change meets its requirements, obtained through checks such as tests or visual inspection.
_Avoid_: Agent confidence
