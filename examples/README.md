# Examples

Real workflows that combine the kit's agents and commands. Each shows the exact
prompts to type and what each stage produces.

| Example | Commands / agents used |
|---|---|
| [From a mockup to shipped code](design-to-code.md) | `/design-spec` → design-analyzer, then `/pipeline` |
| [Build a feature end-to-end](feature-pipeline.md) | `/pipeline` → ba-analyst · architect · dev-reviewer · qa-planner · security-reviewer · api-integrator |
| [Fix a bug, then harden it](debug-and-review.md) | `/debug` → debugger, then `/review-pr` → dev/security/performance reviewers |
| [Refactor safely](refactor-safely.md) | `/refactor` → refactorer (isolated worktree) |

> All of these assume you've run `pnpm exec aitop-claude`, filled in `CLAUDE.md`,
> and restarted Claude Code so the agents and hooks are loaded.
