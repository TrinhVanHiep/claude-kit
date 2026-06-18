# @hieptv/claude-kit

A reusable Claude Code setup for JavaScript/TypeScript projects. Two layers:

- **Universal (auto-updating):** real-time ESLint hooks that make convention
  violations visible to Claude the moment they happen — `PostToolUse` lints the
  edited file, `Stop` lints everything changed before the turn ends. They reuse
  **your** repo's ESLint config; no second source of truth. Fail-open, CI-parity.
- **Editable (scaffolded once):** an input-driven, gated `/pipeline` command and
  its agents (`ba-analyst`, `architect`, `dev-reviewer`, `qa-planner`,
  `security-reviewer`, `api-integrator`), the skill-authoring convention, a
  grounding checklist, and a `CLAUDE.md` template — copied into your repo to customize.

Give `/pipeline` a task (free text, a ticket, a mockup image, or a spec file) and
it runs requirements → architecture → review → implement → verify → security,
pausing for your approval after Requirements and before any code is written.

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
