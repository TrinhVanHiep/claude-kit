# @hieptv/claude-kit

[![npm version](https://img.shields.io/npm/v/@hieptv/claude-kit)](https://www.npmjs.com/package/@hieptv/claude-kit)
[![npm downloads](https://img.shields.io/npm/dw/@hieptv/claude-kit)](https://www.npmjs.com/package/@hieptv/claude-kit)
[![license](https://img.shields.io/npm/l/@hieptv/claude-kit)](LICENSE)
[![node](https://img.shields.io/node/v/@hieptv/claude-kit)](package.json)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> **A senior fullstack engineering team for Claude Code.** One command scaffolds
> 12 specialist agents, 5 workflow commands, lazy-loaded domain rules, and
> real-time ESLint enforcement — so Claude writes code that passes review the
> first time.

Two layers, installed together:

- **Universal hooks (auto-updating):** `PostToolUse` lints the file Claude just
  edited; `Stop` lints all working-tree changes before the turn ends — using
  **your** repo's ESLint config, no second source of truth. Fail-open, CI-parity.
- **Editable scaffolding (yours to customize):** agents, commands, lazy-loaded
  rules, and a `CLAUDE.md` skeleton — copied into your repo so you can tune them.

## Install

```bash
pnpm add -D @hieptv/claude-kit
pnpm exec aitop-claude
# or: pnpm exec aitop-claude --vendor   # air-gapped (copies hooks into .claude/hooks)
```

Then fill the `{{PLACEHOLDERS}}` in `CLAUDE.md`, ensure ESLint is installed, and
**restart Claude Code** so the hooks and agents load (`/hooks` and `/agents` to verify).

## The team — 12 agents

| Agent | Role | Model | Access |
|---|---|---|---|
| `design-analyzer` | Mockup/Figma → build-ready spec mapped to your design system | opus | read-only |
| `ba-analyst` | Requirements → user stories + acceptance criteria | sonnet | read-only |
| `architect` | Requirements → file-level implementation plan | opus | read-only |
| `dev-reviewer` | Senior code review — conventions, over-engineering | sonnet | read-only |
| `qa-planner` | Test plan from acceptance criteria | sonnet | read-only |
| `security-reviewer` | Diff audit — XSS, injection, auth, secrets, PII | opus | read-only |
| `api-integrator` | Wire backend API → typed frontend data layer | opus | writes |
| `debugger` | Root-cause bug hunting — proves before fixing | opus | writes |
| `ui-test-author` | Playwright E2E tests with semantic locators | sonnet | writes |
| `performance-reviewer` | Re-renders, N+1, bundle size, memory leaks | sonnet | read-only |
| `refactorer` | Behavior-preserving refactor in an isolated worktree | opus | writes (worktree) |
| `tech-writer` | Docs derived from actual code — never invented | sonnet | writes docs |

Reviewers are least-privilege (`Read, Grep, Glob, Bash`); writers get `Edit/Write`
with `permissionMode: acceptEdits`. The `refactorer` runs in `isolation: worktree`
so your working tree is never touched until you approve its diff.

## The commands — 5 workflows

| Command | What it does |
|---|---|
| `/pipeline <task>` | Full feature build: requirements → architecture → review → implement → verify → security, with **two human gates** (after Requirements, before any code). Accepts free text, a ticket, a mockup image, or a spec file. |
| `/design-spec <image\|url\|design-link>` | Delegates to `design-analyzer` — turns a mockup or design-tool link (Figma, Visily, Sketch, …) into a build-ready spec (components mapped to your design system, tokens, states, responsive) you can feed into `/pipeline`. |
| `/debug <symptom>` | Delegates to `debugger` — reproduces, forms hypotheses, proves the root cause, fixes minimally, verifies. |
| `/review-pr [PR#\|branch]` | Runs `dev-reviewer` + `security-reviewer` + `performance-reviewer` in parallel, returns one severity-grouped report. Can post inline PR comments. |
| `/refactor <target>` | Delegates to `refactorer` — restructures in an isolated worktree, runs all checks, presents the diff for approval. |

## Lazy-loaded rules

Domain rules live in `.claude/rules/*.md` with `paths:` frontmatter — they load
**only when Claude touches a matching file**, keeping the base context lean:

| Rule | Loads when editing |
|---|---|
| `security.md` | `**/auth/**`, `**/api/**`, `**/middleware/**`, `**/routes/**` |
| `testing.md` | `**/*.test.*`, `**/*.spec.*`, `**/e2e/**` |
| `api-conventions.md` | `**/api/**`, `**/controllers/**`, `**/handlers/**` |

## What `aitop-claude` scaffolds

```
.claude/
  agents/        ← 12 specialist agents
  commands/      ← pipeline · design-spec · debug · review-pr · refactor
  rules/         ← security · testing · api-conventions (lazy-loaded)
  conventions/   ← grounding-checklist · skill-authoring
  settings.json  ← ESLint hooks wired
CLAUDE.md        ← hard-rules skeleton (fill the {{PLACEHOLDERS}})
.mcp.json        ← Playwright + Context7 MCP servers
```

Re-run with `--force` to overwrite, or `--vendor` to copy hooks into
`.claude/hooks/` (no `node_modules` path needed).

## Examples

Step-by-step walkthroughs with the exact prompts to type:

- [**From a mockup to shipped code**](examples/design-to-code.md) — `/design-spec`
  turns a design into a repo-grounded spec, then `/pipeline` builds it.
- [**Build a feature end-to-end**](examples/feature-pipeline.md) — `/pipeline` from
  requirements to security review, with the two human gates.
- [**Fix a bug, then harden it**](examples/debug-and-review.md) — `/debug` finds the
  root cause, `/review-pr` audits the fix in parallel.
- [**Refactor safely**](examples/refactor-safely.md) — `/refactor` restructures in an
  isolated worktree you approve before merging.

## How it stays drift-free

`settings.json` points the hooks at
`node_modules/@hieptv/claude-kit/hooks/*.mjs`, so `pnpm update @hieptv/claude-kit`
upgrades the enforcement logic everywhere at once. The scaffolded agents, rules,
and `CLAUDE.md` are yours to edit and are never overwritten without `--force`.

## Design notes

- **Fail-open** — a hook bug must never brick a session. (Fork to fail-closed for
  compliance repos.)
- **CI-parity** — hooks run ESLint with `CI=true` so editor-mode rule relaxations
  don't let violations slip past that CI would later block.
- **Least-privilege agents** — reviewers can't write; only implementers get edit access.
- **Two human gates only** — after Requirements and before Implement; the rest flows.
- **Grounding-dependent** — the agents are only as good as your `CLAUDE.md`, custom
  ESLint rules, and declared commands. See `conventions/grounding-checklist.md`.
