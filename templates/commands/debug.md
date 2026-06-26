---
name: debug
description: Systematic debugging command. Pass a symptom (error message, failing test, unexpected behavior) and it delegates to the debugger agent to find and fix the root cause with a proven methodology — no guessing.
---

# Debug

Delegate the entire debugging task to the `debugger` agent with this input: `$ARGUMENTS`.

Do NOT attempt to debug or fix anything yourself. Hand the full task to the agent.

The debugger will:
1. Run the failing command to reproduce the symptom
2. Trace the call stack and locate the blast radius
3. Form ≤3 hypotheses and test each one
4. State the proven root cause before touching code
5. Implement a minimal fix
6. Run typecheck + lint + tests to verify
7. Show `git diff` of the change
