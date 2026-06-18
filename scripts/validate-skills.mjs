#!/usr/bin/env node
// Validate skill/agent markdown frontmatter shape. Usage:
//   node scripts/validate-skills.mjs <dir> [<dir> ...]
// Checks: frontmatter exists, has `name` (== filename) + `description` (>=30 chars).
// Exits 1 on any violation so it can gate CI.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---/
const MD_EXT_RE = /\.md$/

const dirs = process.argv.slice(2)
if (dirs.length === 0) {
  process.stderr.write('usage: validate-skills.mjs <dir> [<dir> ...]\n')
  process.exit(2)
}

const problems = []

function frontmatter(text) {
  const m = text.match(FRONTMATTER_RE)
  if (!m)
    return null
  const out = {}
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':')
    if (i === -1)
      continue
    out[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return out
}

function checkFile(file) {
  const expected = path.basename(file).replace(MD_EXT_RE, '')
  const fm = frontmatter(readFileSync(file, 'utf8'))
  if (!fm) {
    problems.push(`${file}: missing frontmatter`)
    return
  }
  if (fm.name !== expected)
    problems.push(`${file}: name "${fm.name || ''}" != filename "${expected}"`)
  if (!fm.description || fm.description.length < 30)
    problems.push(`${file}: description missing or < 30 chars`)
}

for (const dir of dirs) {
  let entries
  try {
    entries = readdirSync(dir)
  }
  catch {
    continue
  }
  for (const entry of entries) {
    const full = path.join(dir, entry)
    if (entry.endsWith('.md') && statSync(full).isFile())
      checkFile(full)
  }
}

if (problems.length > 0) {
  const detail = problems.map(p => `  - ${p}`).join('\n')
  process.stderr.write(`Skill validation failed:\n${detail}\n`)
  process.exit(1)
}
process.stdout.write('Skill frontmatter OK\n')
