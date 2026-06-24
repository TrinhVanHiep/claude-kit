# @hieptv/claude-kit

[![npm version](https://img.shields.io/npm/v/@hieptv/claude-kit)](https://www.npmjs.com/package/@hieptv/claude-kit)
[![npm downloads](https://img.shields.io/npm/dw/@hieptv/claude-kit)](https://www.npmjs.com/package/@hieptv/claude-kit)
[![license](https://img.shields.io/npm/l/@hieptv/claude-kit)](LICENSE)
[![node](https://img.shields.io/node/v/@hieptv/claude-kit)](package.json)

> **Drop-in Claude Code setup** for JS/TS projects: real-time ESLint enforcement inside every Claude session + a gated multi-agent pipeline that stops to ask before writing a single line of code.

Two layers — one command to install both:

- **Universal hooks (auto-updating):** `PostToolUse` lints the file Claude just
  edited; `Stop` lints all working-tree changes before the turn ends. Uses
  **your** repo's ESLint config — no second source of truth. Fail-open,
  CI-parity.
- **Editable scaffolding (yours to customize):** a `/pipeline` command that takes
  any input (free text, ticket, mockup image, or spec file) and runs
  requirements → architecture → code-review → implement → verify → security,
  pausing for your approval after Requirements and before code is written. Six
  specialist agents: `ba-analyst`, `architect`, `dev-reviewer`, `qa-planner`,
  `security-reviewer`, `api-integrator`.

## Install

```bash
pnpm add -D @hieptv/claude-kit
pnpm exec aitop-claude
# or: pnpm exec aitop-claude --vendor
```

Then fill the `{{PLACEHOLDERS}}` in `CLAUDE.md`, work through
`conventions/grounding-checklist.md`, ensure ESLint is installed, and
**restart Claude Code** so the hooks load (`/hooks` to verify).

## How it stays drift-free

`settings.json` points the hooks at
`node_modules/@hieptv/claude-kit/hooks/*.mjs`, so `pnpm update @hieptv/claude-kit`
upgrades the enforcement logic everywhere at once. The scaffolded agents and
`CLAUDE.md` are yours to edit and are never overwritten without `--force`.

## What `aitop-claude` does

```
$ pnpm exec aitop-claude
@hieptv/claude-kit → /your-project

  write          .claude/agents/ba-analyst.md
  write          .claude/agents/architect.md
  write          .claude/agents/dev-reviewer.md
  write          .claude/agents/qa-planner.md
  write          .claude/agents/security-reviewer.md
  write          .claude/agents/api-integrator.md
  write          .claude/commands/pipeline.md
  write          .claude/conventions/skill-authoring.md
  write          .claude/conventions/grounding-checklist.md
  write          CLAUDE.md (template — fill the {{PLACEHOLDERS}})
  write          .claude/settings.json (hooks wired)

Done. Next:
  1. Ensure @hieptv/claude-kit is a devDependency (so node_modules path resolves).
  2. Fill the {{PLACEHOLDERS}} in CLAUDE.md and review .claude/agents.
  3. Ensure ESLint is installed (the hooks lint via your repo's own config).
  4. Restart Claude Code (or /clear) so hooks load. Verify with /hooks.
```

Run again with `--force` to overwrite existing files, or `--vendor` to copy hooks
into `.claude/hooks/` (air-gapped / no node_modules required).

## What's in the box

| Path | Layer | Purpose |
|---|---|---|
| `hooks/lint-edited-file.mjs` | universal | `PostToolUse` — lint the file just edited |
| `hooks/gate-stop.mjs` | universal | `Stop` — lint all working-tree changes |
| `bin/init.mjs` | tooling | scaffolder (`aitop-claude`) |
| `templates/agents/*` | editable | ba-analyst · architect · dev-reviewer · qa-planner · security-reviewer · api-integrator |
| `templates/commands/pipeline.md` | editable | input-driven gated feature pipeline |
| `templates/conventions/skill-authoring.md` | editable | how to write skills/agents |
| `templates/conventions/grounding-checklist.md` | editable | what each project must provide |
| `templates/CLAUDE.md.tmpl` | editable | hard-rules skeleton |
| `scripts/validate-skills.mjs` | tooling | frontmatter linter for skills/agents |

## Design notes

- **Fail-open** by design — a hook bug must never brick a session. (A compliance
  repo can fork to fail-closed.)
- **CI-parity** — hooks run ESLint with `CI=true` so editor-mode rule relaxations
  don't let violations through that CI would later block.
- **Least-privilege agents** — reviewers are read-only (`Read, Grep, Glob, Bash`).
- **Two human gates only** — after Requirements and before Implement; everything else flows.
- **Grounding-dependent** — the pipeline is only as good as the project's `CLAUDE.md`,
  custom ESLint rules, and declared commands. See `conventions/grounding-checklist.md`.
