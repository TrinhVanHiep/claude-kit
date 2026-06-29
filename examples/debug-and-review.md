# Fix a bug, then harden it

Two commands that pair well: `/debug` finds and fixes a root cause, then
`/review-pr` audits the fix before you merge.

## Step 1 — `/debug` a failing symptom

Pass the actual symptom — an error message, a failing test name, or a description
of the wrong behavior:

```
/debug Clicking "Apply" on a saved search throws "Cannot read properties of
undefined (reading 'filters')" — only when the search was created in another tab.
```

The `debugger` agent will, without guessing:

1. Run the failing path to **reproduce** the symptom.
2. Trace the call stack and locate the blast radius.
3. Form **≤3 hypotheses** and test each one.
4. **State the proven root cause before touching code.**
5. Implement a minimal fix.
6. Run typecheck + lint + tests to verify.
7. Show the `git diff`.

The discipline that makes it reliable: it must *prove* the cause (step 4) before
it's allowed to edit. No "try this and see."

## Step 2 — `/review-pr` the fix

Before merging, get three senior reviewers in parallel:

```
/review-pr
```

(Empty reviews `HEAD~1`. Pass a PR number — `/review-pr 42` — or a branch —
`/review-pr fix/saved-search-crash`.)

This fans out to:
- `dev-reviewer` — conventions, over-engineering, framework idioms
- `security-reviewer` — XSS, injection, auth, secrets, PII, supply-chain
- `performance-reviewer` — re-renders, N+1 queries, bundle size, leaks

…then merges everything into one report grouped by severity (`[BLOCK]` /
`[SUGGEST]` / `[NIT]`), leading with blockers. Add `--comment` to post the
findings as inline PR comments instead of just printing them.

## Why this order

`/debug` optimizes for *correctness of the fix*; `/review-pr` optimizes for
*everything the fix might have missed* — a security regression, a perf cliff, a
convention drift. Running them back to back means a one-line bug fix can't quietly
introduce a bigger problem.
