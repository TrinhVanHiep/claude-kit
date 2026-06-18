#!/usr/bin/env node
// Stop hook — before Claude ends a turn, lint every .ts/.tsx file it changed
// in the working tree. Mirrors what .husky/pre-commit does, but fires at
// turn-end so issues are fixed while context is hot, not at commit time.
//
// Only runs work when code actually changed → conversational turns are untouched.
// Fail-OPEN on any internal error. Honors `stop_hook_active` so it nudges at
// most once and can never trap the user in a loop.
//
// Exit codes: 0 = clean / skip / fail-open · 2 = errors found (stderr → Claude).
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const LINT_RE = /\.(?:ts|tsx|js|jsx|mjs|cjs)$/
const MAX_FILES = 80 // safety cap for huge changesets

function resolveEslintBin(projectDir) {
  for (const name of ['eslint', 'eslint.cmd']) {
    const bin = path.join(projectDir, 'node_modules', '.bin', name)
    if (existsSync(bin))
      return bin
  }
  return null
}

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
}

function main() {
  let input = {}
  try {
    input = JSON.parse(readFileSync(0, 'utf8') || '{}')
  }
  catch {
    return 0
  }
  // We already nudged once this turn — let it stop to avoid an infinite loop.
  if (input.stop_hook_active)
    return 0

  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd()
  const eslintBin = resolveEslintBin(projectDir)
  if (!eslintBin)
    return 0

  // Collect changed (tracked vs HEAD) + new (untracked) files. git paths are
  // relative to the git root, which may differ from projectDir (e.g. a web/
  // subfolder) — resolve via the toplevel and keep only files under projectDir.
  let gitRoot
  let changed = []
  try {
    gitRoot = git(['rev-parse', '--show-toplevel'], projectDir).trim()
    const tracked = git(['diff', '--name-only', '--diff-filter=ACMR', 'HEAD'], projectDir)
    const untracked = git(['ls-files', '--others', '--exclude-standard'], projectDir)
    changed = `${tracked}\n${untracked}`.split('\n').map(s => s.trim()).filter(Boolean)
  }
  catch {
    return 0 // not a git repo / no HEAD yet → fail-open
  }

  const relFiles = [...new Set(changed)]
    .filter(f => LINT_RE.test(f))
    .map(f => path.resolve(gitRoot, f))
    .filter((abs) => {
      const r = path.relative(projectDir, abs)
      return r && !r.startsWith('..') && !path.isAbsolute(r)
    })
    .map(abs => path.relative(projectDir, abs))

  if (relFiles.length === 0)
    return 0
  const truncated = relFiles.length > MAX_FILES
  const batch = relFiles.slice(0, MAX_FILES)

  try {
    execFileSync(
      eslintBin,
      ['--cache', '--quiet', '--no-error-on-unmatched-pattern', '--format', 'stylish', ...batch],
      // CI:true forces full rules (see lint-edited-file.mjs) for gate parity.
      { cwd: projectDir, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', env: { ...process.env, CI: 'true' } },
    )
    return 0
  }
  catch (err) {
    if (err.status !== 1)
      return 0
    const out = `${err.stdout || ''}${err.stderr || ''}`.trim()
    if (!out)
      return 0
    const note = truncated ? `\n(showing first ${MAX_FILES} of ${relFiles.length} changed files)` : ''
    process.stderr.write(
      `ESLint errors remain in files changed this turn — fix them before finishing:${note}\n\n${out}\n`,
    )
    return 2
  }
}

process.exit(main())
