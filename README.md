# @hieptv/claude-kit

A reusable Claude Code setup for JavaScript/TypeScript projects. Two layers:

- **Universal (auto-updating):** real-time ESLint hooks that make convention
  violations visible to Claude the moment they happen — `PostToolUse` lints the
  edited file, `Stop` lints everything changed before the turn ends. They reuse
  **your** repo's ESLint config; no second source of truth. Fail-open, CI-parity.
- **Editable (scaffolded once):** generic review agents (`architect`,
  `dev-reviewer`, `security-reviewer`), a `/pipeline` command, the skill-authoring
  convention, and a `CLAUDE.md` template — copied into your repo to customize.

## Install

```bash
pnpm add -D @hieptv/claude-kit
pnpm exec aitop-claude
# or: pnpm exec aitop-claude --vendor
```

Then fill the `{{PLACEHOLDERS}}` in `CLAUDE.md`, ensure ESLint is installed, and
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
| `templates/agents/*` | editable | architect · dev-reviewer · security-reviewer |
| `templates/commands/pipeline.md` | editable | feature pipeline orchestration |
| `templates/conventions/skill-authoring.md` | editable | how to write skills/agents |
| `templates/CLAUDE.md.tmpl` | editable | hard-rules skeleton |
| `scripts/validate-skills.mjs` | tooling | frontmatter linter for skills/agents |

## Design notes

- **Fail-open** by design — a hook bug must never brick a session. (A compliance
  repo can fork to fail-closed.)
- **CI-parity** — hooks run ESLint with `CI=true` so editor-mode rule relaxations
  don't let violations through that CI would later block.
- **Least-privilege agents** — reviewers are read-only (`Read, Grep, Glob, Bash`).

## Publish to npm

The scoped package is configured as public because npm requires
`--access public` for the first publication of a public scoped package.

```bash
npm login
npm whoami
npm publish
```

For later releases, update the version first:

```bash
npm version patch
npm publish
```
