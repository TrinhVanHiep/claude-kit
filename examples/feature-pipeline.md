# Build a feature end-to-end with `/pipeline`

The `/pipeline` command runs the full senior-engineer workflow with two human
gates. You stay in control at the two moments that matter — what to build, and
whether the plan is right — and Claude handles the rest.

## The scenario

You need a "saved searches" feature: a user can name and store a filter set, see
their saved searches in a dropdown, and delete one.

## Run it

```
/pipeline Users can save the current search filters under a name, see saved
searches in a dropdown, apply one, and delete one. Persist server-side.
```

You can also pass a ticket, a spec file path, or a mockup image instead of free text:

```
/pipeline PROJ-412
/pipeline ./specs/saved-searches.md
/pipeline ./design/saved-searches.png
```

## What happens, stage by stage

### 1 · Requirements — `ba-analyst`
Produces user stories, Given/When/Then acceptance criteria, edge cases (empty
list, duplicate names, permission boundaries), and an explicit out-of-scope list.

> **🚦 GATE 1 — your approval.** Claude stops and shows the requirements + open
> questions. Adjust or approve before anything else runs.

### 2 · Architecture — `architect`
Turns the approved requirements into a file-level plan: which files to create or
change, what to reuse, the data flow, and the API contract — all obeying your
`CLAUDE.md` (folder layout, API boundary, state decision tree).

### 3 · Plan review — parallel
`dev-reviewer`, `qa-planner`, and (because this touches a backend API)
`security-reviewer` run concurrently. Their findings fold back into the plan, and
a test plan is written.

> **🚦 GATE 2 — your approval.** Claude shows the reviewed plan + test plan and
> stops. **No code is written until you approve.**

### 4–6 · Implement → Verify → Security
- Implements minimal, idiomatic diffs; the lint hooks correct convention
  violations in real time as each file is written.
- For the backend wiring, delegates to `api-integrator` (typed fetchers + one
  data hook per endpoint, sharing query keys).
- Runs your declared typecheck → lint → test commands; everything must pass.
- `security-reviewer` audits the actual `git diff` for XSS, auth, secrets, PII.

### 7 · Summary
Reports the files changed, which acceptance criteria are met, verification
results, and any follow-ups. It offers to open a PR — it won't push or commit
unless you ask.

## Why the gates matter

Most agent failures are expensive because they happen *after* code is written. By
forcing approval **after Requirements** and **before Implement**, a wrong
assumption costs you a 30-second correction, not a full re-implementation.
