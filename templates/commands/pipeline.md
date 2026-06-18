---
name: pipeline
description: Input-driven feature pipeline for FE projects. Give it a task (free text, a ticket id/URL, a mockup image path, or a spec file) and it runs the full coding workflow — requirements → architecture → review → implement → verify → security — with human-approval gates. Use when the user wants a non-trivial feature built end-to-end with reviewed, convention-compliant output.
---

# Feature pipeline (gated)

Run the whole coding workflow for the task in `$ARGUMENTS`. Stop and ask for
explicit approval at the two human gates below — never auto-proceed past them.
State the verdict at every gate; if a gate fails, fix before advancing.

## 0 · Ground & classify input
- Read `CLAUDE.md` (hard rules, stack, folder layout, API boundary, test/scaffold
  commands). If `CLAUDE.md` is missing or still has `{{PLACEHOLDERS}}`, STOP and
  tell the user to complete grounding first (see `conventions/grounding-checklist.md`).
- Classify `$ARGUMENTS`:
  - **mockup image** (`.png/.jpg` path) → first derive a design spec (run the
    project's `mockup-spec` flow if present) and treat it as the requirements input.
  - **ticket** (URL / `PROJ-123`) → fetch it if an integration exists, else ask
    the user to paste the description.
  - **file path** → read it as the spec.
  - **free text** → use as-is.
- Create the run folder `.claude/pipeline/<slug>/` for all artifacts.

## 1 · Requirements — delegate to `ba-analyst`
Produce user stories + acceptance criteria + edge cases + explicit out-of-scope.
Write `01-requirements.md`.

> **🚦 GATE 1 (human approval).** Present the requirements summary and the open
> questions. **STOP and ask the user to approve or adjust before continuing.**

## 2 · Architecture — delegate to `architect`
Turn the approved requirements into a file-level plan: files to change, components
to reuse, data flow, API contract, step-by-step todos. Write `02-architecture.md`.

## 3 · Plan review — run in parallel
Delegate concurrently to `dev-reviewer`, `qa-planner`, and (if the feature touches
auth / PII / external input / a backend API) `security-reviewer`. Fold their
findings back into the plan. Write `03-review.md` + `04-test-plan.md`.

> **🚦 GATE 2 (human approval).** Present the reviewed plan + test plan. **STOP and
> ask the user to approve before any code is written.** Do not implement until approved.

## 4 · Implement
- Scaffold with the project's generator first (e.g. `gen:feature`) when adding a
  new domain — don't hand-create the folder layout.
- For backend wiring, delegate to `api-integrator`.
- Write minimal, idiomatic diffs that obey `CLAUDE.md`. The repo's lint hooks
  enforce conventions on every edit — fix what they flag immediately.

## 5 · Verify
Run the project's declared commands (from `CLAUDE.md` / `package.json`):
typecheck → lint → tests. Everything must pass. The `Stop` hook also gates the
turn end on lint. Write results to `05-implementation-log.md`.

## 6 · Security review — delegate to `security-reviewer`
Audit the actual diff (`git diff`). Resolve every `[CRITICAL]`/`[HIGH]` finding.
Write `06-security-review.md`.

## 7 · Summary
Report what changed (files + acceptance criteria met), verify results, and any
follow-ups. Offer to open a PR — do not push/commit unless the user asks.

## Rules
- Two human gates only (after Requirements, before Implement). Everything else flows.
- Prefer parallel sub-agents where stages are independent.
- Lead with blockers; don't pad with nits.
- Every stage leaves an artifact under `.claude/pipeline/<slug>/` so the run is
  auditable and resumable.
