---
name: review-pr
description: Full PR review command. Pass a PR number, branch name, or leave empty for HEAD~1. Runs dev-reviewer, security-reviewer, and performance-reviewer in parallel to produce a severity-grouped report.
---

# PR Review

Review the diff from `$ARGUMENTS`.

## Step 1 — Get the diff
- PR number (e.g. `42`) → run `gh pr diff 42`
- Branch name → run `git diff main...<branch>`
- Empty → run `git diff HEAD~1`

## Step 2 — Run in parallel
Delegate concurrently to these agents (pass the full diff as context):
- `dev-reviewer` — code quality, conventions, over-engineering, framework idioms
- `security-reviewer` — XSS, injection, auth, secrets, PII, supply-chain
- `performance-reviewer` — re-renders, N+1, missing indexes, bundle size

## Step 3 — Synthesize
Merge all findings into one report, grouped by severity:

```
## Summary
N blockers · M security · K perf · J suggestions

## [BLOCK] Must fix before merge
...

## [CRITICAL] / [HIGH] Security
...

## [PERF-HIGH] Performance
...

## [SUGGEST] Non-blocking improvements
...

## [NIT] Style
...
```

If `$ARGUMENTS` is a PR number, offer to post findings as inline GitHub PR comments
after showing the report. Do not post without explicit approval.
