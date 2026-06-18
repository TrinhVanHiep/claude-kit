# Skill & agent authoring convention

Borrowed from the VDS SDD framework — keep skills/agents discoverable, enforceable,
and resistant to the model rationalizing its way around a gate.

## Frontmatter (required)
- `name` — must equal the folder/file name (kebab-case).
- `description` — ≥ 30 chars, written so the model can decide *when* to use it.
  Lead with the role, then the trigger ("Use when…").
- `tools` (agents) — least-privilege. Review agents get `Read, Grep, Glob, Bash`
  only; implementers get Write/Edit.
- `model` (agents) — `opus` for design/security judgement, `sonnet` for
  mechanical/analytic passes.

## Body
- Keep it ≤ ~150 lines. Push long detail to a `references/` file.
- **Hard gates** that must not be skipped get an explicit, named gate the model
  must report a verdict for — not a soft "should".
- Include an **Anti-Patterns** section listing the specific shortcuts the model
  tends to take, so it can recognize and avoid them.
- Voice: senior engineer. Concrete over decorative. No marketing adjectives.

## Anti-patterns (for skills themselves)
- A `description` that says *what it is* but never *when to use it* → never fires.
- A gate phrased as advice ("try to…") → gets skipped under pressure.
- Over-broad `tools` on a review agent → it starts "fixing" instead of reviewing.
- Detail dumped inline that bloats every invocation → move to `references/`.

## Validate
Run `node node_modules/@hieptv/claude-kit/scripts/validate-skills.mjs .claude/agents .claude/commands`
(or the vendored path) to check frontmatter shape before committing.
