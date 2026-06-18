#!/usr/bin/env node
// Scaffolder for @hieptv/claude-kit. Run from a target repo's root:
//
//   pnpm exec aitop-claude            # reference hooks from node_modules (auto-update)
//   pnpm exec aitop-claude --vendor   # copy hooks into .claude/hooks (air-gapped)
//   pnpm exec aitop-claude --force    # overwrite existing template files
//
// Copies the EDITABLE templates (agents, commands, conventions, CLAUDE.md) once,
// then wires the two lint hooks into .claude/settings.json. Idempotent: existing
// files are kept unless --force. Never touches the universal hook logic itself —
// that lives in the package and updates via `pnpm update @hieptv/claude-kit`.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const TARGET = process.cwd()
const args = new Set(process.argv.slice(2))
const VENDOR = args.has('--vendor')
const FORCE = args.has('--force')

const log = msg => process.stdout.write(`${msg}\n`)

function copyTree(fromRel, toRel) {
  const from = path.join(KIT_ROOT, fromRel)
  if (!existsSync(from))
    return
  const to = path.join(TARGET, toRel)
  mkdirSync(to, { recursive: true })
  for (const entry of readdirSync(from)) {
    const dest = path.join(to, entry)
    if (existsSync(dest) && !FORCE) {
      log(`  skip (exists)  ${toRel}/${entry}`)
      continue
    }
    cpSync(path.join(from, entry), dest, { recursive: true })
    log(`  write          ${toRel}/${entry}`)
  }
}

function hookCommand(name) {
  // The ${CLAUDE_PROJECT_DIR} token must stay a LITERAL — Claude Code expands it
  // at hook-run time, not us.
  // eslint-disable-next-line no-template-curly-in-string
  const dir = '${CLAUDE_PROJECT_DIR}'
  const base = VENDOR
    ? `${dir}/.claude/hooks`
    : `${dir}/node_modules/@hieptv/claude-kit/hooks`
  return `node "${base}/${name}.mjs"`
}

function mergeSettings() {
  const file = path.join(TARGET, '.claude', 'settings.json')
  let settings = {}
  if (existsSync(file)) {
    try {
      settings = JSON.parse(readFileSync(file, 'utf8') || '{}')
    }
    catch {
      log('  ! .claude/settings.json is not valid JSON — leaving it untouched; wire hooks manually.')
      return
    }
  }
  settings.$schema ??= 'https://json.schemastore.org/claude-code-settings.json'
  settings.hooks ??= {}

  const serialized = JSON.stringify(settings.hooks)
  if (serialized.includes('claude-kit') || serialized.includes('/.claude/hooks/')) {
    log('  skip (wired)   .claude/settings.json hooks')
    return
  }

  settings.hooks.PostToolUse ??= []
  settings.hooks.PostToolUse.push({
    matcher: 'Edit|Write|MultiEdit',
    hooks: [{ type: 'command', command: hookCommand('lint-edited-file'), async: false }],
  })
  settings.hooks.Stop ??= []
  settings.hooks.Stop.push({
    hooks: [{ type: 'command', command: hookCommand('gate-stop'), async: false }],
  })

  writeFileSync(file, `${JSON.stringify(settings, null, 2)}\n`)
  log('  write          .claude/settings.json (hooks wired)')
}

function main() {
  log(`@hieptv/claude-kit → ${TARGET}${VENDOR ? ' (vendored hooks)' : ''}`)
  mkdirSync(path.join(TARGET, '.claude'), { recursive: true })

  copyTree('templates/agents', '.claude/agents')
  copyTree('templates/commands', '.claude/commands')
  copyTree('templates/conventions', '.claude/conventions')

  if (VENDOR)
    copyTree('hooks', '.claude/hooks')

  const claudeMd = path.join(TARGET, 'CLAUDE.md')
  if (!existsSync(claudeMd) || FORCE) {
    cpSync(path.join(KIT_ROOT, 'templates', 'CLAUDE.md.tmpl'), claudeMd)
    log('  write          CLAUDE.md (template — fill the {{PLACEHOLDERS}})')
  }
  else {
    log('  skip (exists)  CLAUDE.md')
  }

  mergeSettings()

  log('')
  log('Done. Next:')
  if (!VENDOR)
    log('  1. Ensure @hieptv/claude-kit is a devDependency (so node_modules path resolves).')
  log(`  ${VENDOR ? '1' : '2'}. Fill the {{PLACEHOLDERS}} in CLAUDE.md and review .claude/agents.`)
  log(`  ${VENDOR ? '2' : '3'}. Ensure ESLint is installed (the hooks lint via your repo's own config).`)
  log(`  ${VENDOR ? '3' : '4'}. Restart Claude Code (or /clear) so hooks load. Verify with /hooks.`)
}

main()
