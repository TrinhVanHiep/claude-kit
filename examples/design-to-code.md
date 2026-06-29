# From a mockup to shipped code

A design hand-off is where most AI coding goes wrong: the model eyeballs a
screenshot, invents spacing and colors, ignores the components you already have,
and produces something that *looks* close but matches nothing in your codebase.
`/design-spec` fixes that by turning the design into an explicit, repo-grounded
spec **before** any code is written.

## Step 1 — Turn the design into a spec

Pass a local image, an image URL, or a Figma link:

```
/design-spec ./design/settings-page.png
/design-spec https://example.com/mockups/settings.png
/design-spec https://www.figma.com/file/abc123/Settings?node-id=12-34
```

> **Figma:** if a Figma MCP / Dev Mode server is configured, the `design-analyzer`
> pulls exact tokens and measurements. Otherwise it asks you to export the frame
> as a 2x PNG — it won't guess values it can't see.

The `design-analyzer` agent will:

1. **Ground in your repo first** — grep for your design system, theme tokens,
   spacing scale, and icon set (per `CLAUDE.md`).
2. **Inventory the design top-down** and map each element to an **existing**
   component (`Button` → `src/ui/Button.tsx`) or flag it `NEW — no match`.
3. **Extract tokens**, marking anything estimated from the image with `≈`.
4. **Spec every state** — default, hover, focus, disabled, loading, empty, error.
5. **Capture** responsive behavior, interactions, data sources, and a11y.

It writes `.claude/design-specs/settings-page.md` and shows you the component
inventory + **open questions** (every `≈` estimate and ambiguity).

## Step 2 — Resolve the open questions

This is the high-leverage moment. The spec might say:

```
Open questions
- ≈ Card padding looks like 20px — confirm vs the repo's `space-5` (16px)?
- Empty state not shown in the mockup — what copy + illustration?
- "Danger zone" button: maps to NEW variant or existing `Button variant="destructive"`?
```

Answer those three lines and the implementer now has zero room to guess.

## Step 3 — Hand the approved spec to `/pipeline`

```
/pipeline ./.claude/design-specs/settings-page.md
```

From here it's the normal gated flow — `ba-analyst` turns the spec into
acceptance criteria, `architect` plans the files, reviewers check it, then it's
built and verified. Because the spec is grounded in your real components, the diff
reuses what exists instead of reinventing your design system.

## Why this beats "here's a screenshot, build it"

| Screenshot → code | `/design-spec` → `/pipeline` |
|---|---|
| Invents colors/spacing | Maps to your tokens; estimates flagged `≈` |
| Re-implements existing UI | Reuses your components by path |
| Only the happy state | Every state specced up front |
| Ambiguity discovered mid-build | Ambiguity surfaced as open questions first |
