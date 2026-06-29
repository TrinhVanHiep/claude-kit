# Contributing to @hieptv/claude-kit

## Setup

```bash
git clone https://github.com/TrinhVanHiep/claude-kit.git
cd claude-kit
node --version  # must be >=18
```

No dependencies to install — this package ships only Node built-ins.

## Project layout

```
bin/init.mjs                        # CLI scaffolder (aitop-claude)
hooks/lint-edited-file.mjs          # PostToolUse hook — lint one file
hooks/gate-stop.mjs                 # Stop hook — lint all working-tree changes
templates/agents/                   # Agent definitions (editable by users)
templates/commands/pipeline.md      # /pipeline command
templates/conventions/              # Grounding checklist + skill-authoring guide
templates/CLAUDE.md.tmpl            # CLAUDE.md skeleton
scripts/validate-skills.mjs         # Frontmatter linter
```

## Validate before committing

```bash
node scripts/validate-skills.mjs templates/agents templates/commands
```

This runs automatically as `prepublishOnly`.

## Adding or editing an agent

Agents live in `templates/agents/`. Each file needs a YAML frontmatter block
with at least `name`, `description`, and `tools`. Run the validator after editing.

## Releasing

Publishing is automated via **npm Trusted Publishing** (OIDC) — no token, no OTP.

**One-time setup** (maintainer, on npmjs.com):
- Go to the package → **Settings → Trusted Publisher → GitHub Actions**.
- Repository: `TrinhVanHiep/claude-kit`, workflow: `.github/workflows/publish.yml`.

**Each release:**
1. Bump `version` in `package.json` following semver.
2. Commit: `git commit -m "chore: release vX.Y.Z"`.
3. Tag: `git tag vX.Y.Z`.
4. Push tag: `git push origin vX.Y.Z` — the `publish.yml` workflow publishes to
   npm automatically, with provenance attached.

If Trusted Publishing isn't configured yet, publish manually instead:
`npm publish --access public` (npm will prompt for your 2FA OTP).

## Reporting bugs

Open an issue at https://github.com/TrinhVanHiep/claude-kit/issues with:
- Node version (`node --version`)
- The command you ran
- Full terminal output
