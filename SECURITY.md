# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in `@hieptv/claude-kit`, please report it
responsibly. **Do NOT open a public GitHub issue.** Instead, open a private
security advisory via the repository's **Security → Advisories** tab on GitHub.

## Response Timeline

- Acknowledgment: within 48 hours
- Initial assessment: within 7 days
- Fix or mitigation: prioritized by severity

## Scope

This package ships executable Node scripts and Markdown agent/command definitions:

### Executable code (`bin/`, `hooks/`, `scripts/`)
- `bin/init.mjs` — scaffolder that writes into the consumer's `.claude/` directory.
- `hooks/*.mjs` — run inside Claude Code sessions via `settings.json`.
- `scripts/validate-skills.mjs` — frontmatter linter.

These run on a developer's machine. Review them before use. The hooks are
**fail-open** by design: any internal error exits 0 so a hook bug can never block
a session — but that also means a hook must never be trusted to *enforce* security
on its own. Use ESLint rules and CI as the authoritative gate.

### Agent / command Markdown (`templates/`)
- Non-executable prompt definitions copied into the consumer's repo.
- Must never contain API keys, secrets, or credentials.

## Best Practices for Contributors

- Never commit API keys, tokens, or credentials — not in code, not in templates.
- Keep hooks fail-open; never make a hook that can brick a session on error.
- Reviewer agents must stay least-privilege (`Read, Grep, Glob, Bash` only) — an
  agent that can `Write` while claiming to "review" is a supply-chain risk.
- Report any template that attempts prompt injection or instructs Claude to
  exfiltrate data.
