#!/usr/bin/env node
// PostToolUse hook — lint the single file Claude just edited and feed any
// errors straight back so it self-corrects in-session (instead of discovering
// the same violations later at `git commit` / CI).
//
// Reuses the repo's existing ESLint config + custom rules in plugins/eslint/ —
// no new lint logic. Fail-OPEN: any internal hiccup (ESLint missing, bad JSON,
// crash) exits 0 so a hook bug can never brick the session.
//
// Exit codes: 0 = clean / skip / fail-open · 2 = errors found (stderr → Claude).
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const LINT_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'])
const SKIP_SEGMENTS = ['node_modules', '.next', 'dist', 'build', '.turbo', 'coverage']

function resolveEslintBin(projectDir) {
  for (const name of ['eslint', 'eslint.cmd']) {
    const bin = path.join(projectDir, 'node_modules', '.bin', name)
    if (existsSync(bin))
      return bin
  }
  return null
}

function main() {
  let input
  try {
    input = JSON.parse(readFileSync(0, 'utf8') || '{}')
  }
  catch {
    return 0
  }

  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd()
  const filePath = input?.tool_input?.file_path
  if (!filePath)
    return 0

  if (!LINT_EXT.has(path.extname(filePath)))
    return 0

  // Only lint files that live inside the project, and skip vendor/build output.
  const rel = path.relative(projectDir, filePath)
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel))
    return 0
  if (rel.split(path.sep).some(seg => SKIP_SEGMENTS.includes(seg)))
    return 0

  const eslintBin = resolveEslintBin(projectDir)
  if (!eslintBin)
    return 0 // ESLint not installed → fail-open

  try {
    execFileSync(
      eslintBin,
      ['--cache', '--quiet', '--no-error-on-unmatched-pattern', '--format', 'stylish', rel],
      // CI:true forces full rules — @antfu/eslint-config otherwise disables some
      // when it detects an editor (Claude Code runs in the VSCode terminal), so
      // the hook would be laxer than the authoritative CI gate.
      { cwd: projectDir, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', env: { ...process.env, CI: 'true' } },
    )
    return 0 // exit 0 from ESLint → no errors
  }
  catch (err) {
    // ESLint exit 1 = lint problems. Any other status (2 = config error,
    // ENOENT, etc.) is an environment issue → fail-open, never block.
    if (err.status !== 1)
      return 0
    const out = `${err.stdout || ''}${err.stderr || ''}`.trim()
    if (!out)
      return 0
    process.stderr.write(
      `ESLint errors in ${rel} (the file you just edited) — fix before continuing:\n\n${out}\n`,
    )
    return 2
  }
}

process.exit(main())
