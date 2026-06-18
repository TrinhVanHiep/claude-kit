# Claude Code hooks — real-time convention enforcement

These hooks move the repo's existing quality gates **earlier**: from `git commit`
(`.husky/pre-commit`) and CI, to **during the Claude session**. Claude sees a
violation right after it makes it and fixes it while context is hot — instead of
a wall of errors at commit time.

They **reuse the existing ESLint config + custom rules** in `plugins/eslint/`
(`no-import-features`, `features-antd-first`, `require-ns-option`, …). No new
lint logic, no second source of truth.

## What runs

| Hook | Event | What it does |
|---|---|---|
| `lint-edited-file.mjs` | `PostToolUse` (Edit/Write/MultiEdit) | Lints the **single file** just edited. On error, exit 2 → ESLint output is fed back to Claude to fix. Fast (`--cache`, one file). |
| `gate-stop.mjs` | `Stop` (turn end) | Lints **all .ts/.tsx changed in the working tree** (tracked vs HEAD + untracked). On error, exit 2 → blocks the turn from ending once, with the errors. Mirrors `.husky/pre-commit` but earlier. |

Wired in [`../settings.json`](../settings.json).

## Design principles

- **Fail-open.** Any internal problem (ESLint not installed, bad hook input, a
  crash) exits 0. A bug in a hook must never brick the session. This is the
  deliberate opposite of the microservice SDD hooks, which are fail-*closed* for
  compliance — a UI repo optimizes for developer flow, not audit defensibility.
- **Errors only.** `--quiet` is passed, so warnings never block — only real
  rule violations do.
- **No loops.** `gate-stop` honors `stop_hook_active`: it nudges at most once per
  turn, then lets Claude stop even if something is still red.
- **Scoped.** Only files inside the project; `node_modules`, `.next`, `dist`,
  `build`, `coverage` are skipped.

## Activation

Hooks load at **session start**. After pulling these, **restart Claude Code**
(or run `/clear`) for them to take effect. Verify with `/hooks`.

## Tuning

- **Too noisy mid-edit?** Make `lint-edited-file.mjs` informational instead of
  blocking: change its final `return 2` to `return 0` (errors still print to the
  transcript, but won't interrupt Claude).
- **Want a type-check gate too?** `tsc --noEmit` is accurate but slow (10–30s),
  so it's intentionally left out of the default `Stop` hook. Add it behind an
  env flag if your machine can absorb the latency.
- **Disable locally without committing:** override in `.claude/settings.local.json`.

## Why these two first

This is the highest-ROI lesson borrowed from the microservice SDD framework:
turn rules that are currently *trusted to the model* (CLAUDE.md hard rules) into
*enforced-at-the-tool-layer* checks — by reusing enforcement the repo already
owns. They are also the first reusable bricks of a shared `.claude` starter kit
for other projects.
