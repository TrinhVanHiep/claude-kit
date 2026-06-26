---
name: refactor
description: Safe refactoring command. Describe what to refactor and the refactorer agent makes the change in an isolated git worktree (your working tree is untouched), runs all checks, and presents the diff for your approval before merging.
---

# Refactor

Delegate the refactoring task in `$ARGUMENTS` to the `refactorer` agent.

Do NOT implement the refactoring yourself. Hand the full task to the agent.

The refactorer will:
1. Record the baseline (typecheck + lint + tests must pass first)
2. Plan every file that will change before touching anything
3. Make changes in small, verifiable steps — running checks after each
4. Update every consumer (no dangling imports)
5. Run the full check suite — all must pass
6. Present `git diff` and a summary of what changed

**Your working tree is isolated** — the refactorer runs in a separate git worktree,
so your current work is never touched. You review and approve the diff before
anything merges.
