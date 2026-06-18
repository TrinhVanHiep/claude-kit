---
name: pipeline
description: Run the feature pipeline — requirements → architecture → review → implement → security review, with a gate between each stage. Use when the user asks to build a non-trivial feature end-to-end and wants reviewed, convention-compliant output rather than a one-shot edit.
---

# Feature pipeline

Drive a feature from request to reviewed implementation through explicit stages.
Each stage has a **gate**: do not proceed until its output is sound. State the
verdict at each gate; if a gate fails, fix before advancing — never skip silently.

## Stages

1. **Requirements.** Restate the request as user stories + acceptance criteria +
   explicit out-of-scope. Surface ambiguities now.
   **Gate:** requirements are unambiguous and agreed.

2. **Architecture** — delegate to the `architect` agent.
   Produce the file-level plan, data flow, API contract, and todo list.
   **Gate:** plan obeys `CLAUDE.md`, reuses existing code, no premature abstraction.

3. **Plan review** — delegate to `dev-reviewer` (and `security-reviewer` if the
   feature touches auth/PII/external input). Run them in parallel.
   **Gate:** no `[BLOCK]` findings remain unaddressed.

4. **Implement.** Execute the plan top-to-bottom. Keep diffs minimal and idiomatic.
   The repo's lint hooks enforce conventions in real time — fix what they flag.
   **Gate:** typecheck + lint pass; acceptance criteria met.

5. **Security review** — delegate to `security-reviewer` on the actual diff.
   **Gate:** no `[CRITICAL]`/`[HIGH]` findings remain.

## Rules
- Write artifacts (requirements, plan, reviews) under `.claude/pipeline/<slug>/`
  so the run is auditable and resumable.
- Prefer parallel sub-agents where stages are independent (e.g. dev + security review).
- Lead with blockers. Don't pad with nits.
