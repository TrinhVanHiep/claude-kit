---
name: design-spec
description: Turn a design into a build-ready spec. Pass a mockup image path, an image URL, or a Figma link and it delegates to the design-analyzer agent to produce a structured spec — components mapped to your design system, tokens, states, interactions, responsive behavior — that you can hand to /pipeline or an implementer.
---

# Design → spec

Convert the design in `$ARGUMENTS` into a build-ready spec. Delegate the analysis
to the `design-analyzer` agent — do NOT eyeball the design and start coding yourself.

## Step 1 — Classify & prepare the input
- **Local image** (`.png/.jpg/.webp` path) → pass the path straight to the agent.
- **Image URL** → the agent downloads it (`curl`) then reads it.
- **Figma link** → if a Figma MCP / Dev Mode server is configured, the agent uses
  it. Otherwise, ask the user to export the frame as PNG (2x) and pass that.
- **Nothing usable** (dead link, unreadable file) → stop and ask for a real asset;
  never fabricate a spec.

## Step 2 — Delegate to `design-analyzer`
Hand it the asset plus this instruction: ground in the repo's existing design
system first, map every element to an existing component/token, and flag anything
estimated from the image as an open question.

## Step 3 — Save & present
- Write the returned spec to `.claude/design-specs/<slug>.md`.
- Present the **Overview**, the **Component inventory** (what maps to existing vs
  NEW), and the **Open questions** to the user.
- Ask the user to resolve the open questions before any code is written — a spec
  with unresolved `≈` estimates is not ready to build.

## Step 4 — Hand off
Offer to feed the approved spec into `/pipeline` (it becomes the requirements
input), or to a direct implementation if the change is small. Do not auto-start
the build.

## Rules
- The agent is read-only; it analyzes, you save and gate.
- Reuse over invention — a NEW component must be justified against the design system.
- Never invent measurements/colors/behavior that aren't visible in the design.
