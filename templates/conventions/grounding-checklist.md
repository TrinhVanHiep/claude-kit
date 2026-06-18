# Grounding checklist — what each project MUST provide

The kit is the engine; this is the fuel. The `/pipeline` orchestrator is only as
good as the grounding below. Without it, the pipeline runs but produces
convention-violating or wrong-altitude code. Complete this before relying on
autonomous runs.

## Required (pipeline depends on these)
- [ ] **`CLAUDE.md` filled in** — no `{{PLACEHOLDERS}}` left. Specifically:
  - Hard rules (folder layout, API boundary, state decision tree, security).
  - Tech stack (framework, UI library, state libs, test stack).
  - Where new code lives + where it must NOT go.
- [ ] **ESLint configured** — the hooks lint via the project's own config. Custom
  rules that encode hard rules (import boundaries, design-system-first) make the
  real-time enforcement actually bite.
- [ ] **Declared commands** — typecheck, lint, and test commands discoverable in
  `package.json` so the Verify stage can run them.
- [ ] **Feature scaffolder** — a `gen:feature` (or equivalent) so new domains get
  the correct folder layout instead of hand-rolled structure.

## Strongly recommended
- [ ] **Custom ESLint rules** for the project's non-negotiables (e.g. block legacy
  imports, enforce the design system). Mechanical rules > prose the model may skip.
- [ ] **pre-commit hook** (husky) as the commit-time backstop behind the live hooks.
- [ ] **A design-spec / mockup flow** for UI tasks, so image input becomes a
  token-accurate spec the pipeline can build to.
- [ ] **Playwright + MCP** if you want reproducible UI verification (the QA plan
  references it; a ui-test-author can fill it in).

## How the pipeline degrades when grounding is missing
| Missing | Effect |
|---|---|
| `CLAUDE.md` placeholders | Architect/implementer guess conventions → drift |
| No custom ESLint rules | Hooks catch only generic lint, not your boundaries |
| No test command | Verify stage can't prove correctness |
| No scaffolder | Folder layout hand-made → inconsistent across features |
| No mockup flow | UI fidelity unverifiable → manual review mandatory |
