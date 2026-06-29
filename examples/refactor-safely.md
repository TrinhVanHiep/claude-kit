# Refactor safely with `/refactor`

The `/refactor` command hands the work to the `refactorer` agent, which runs in
an **isolated git worktree** — your working tree is never touched until you
approve the diff.

## The scenario

A `useFilters` hook has grown to 200 lines and three responsibilities. You want it
split into focused hooks without changing behavior.

## Run it

```
/refactor Split useFilters into useFilterState (the reducer + setters),
useFilterSync (URL <-> state), and useFilterPersistence (server save/load).
Keep the public API of useFilters as a thin composition of the three so callers
don't change.
```

## What the refactorer guarantees

1. **Baseline first** — typecheck + lint + tests must pass *before* it starts. A
   refactor on a red build is refused.
2. **Plans every file** that will change before touching anything.
3. **Small, verifiable steps** — runs checks after each, not just at the end.
4. **Updates every consumer** — no dangling imports left behind.
5. **Full check suite green** — all must pass.
6. **Shows you the `git diff`** and a summary; nothing merges until you approve.

## Why the worktree matters

A refactor that breaks halfway is the worst case — you're left with a
half-migrated tree and no clean baseline. Because the refactorer works in a
separate worktree, a failed or abandoned refactor leaves your actual workspace
exactly as it was. You review a complete, green diff or you throw it away — never
a partial mess.
