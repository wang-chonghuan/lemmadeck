import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(import.meta.filename)
const bind = file => ({
  path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
})
const json = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
assert.equal(process.cwd(), root)
assert(!fs.existsSync(path.join(out, 'author-freeze.json')))
const pages = [220, 221, 222, 223]
const candidates = pages.map(page => path.join(out, `${String(page).padStart(4, '0')}.page.md`))
const nativeFiles = pages.flatMap(page => ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']
  .map(file => path.join(root, `.tmp/ld-s10y-lesson/9p/pages/${String(page).padStart(4, '0')}`, file)))
const helpers = ['author-counts.py', 'count-once.mjs', 'author-observations.json'].map(file => path.join(out, file))
const nativeHelpers = ['blocks.py', 'layout.py'].map(file => path.join(root, '.claude/skills/ld-s10y-lesson/tools', file))
const bindings = [...candidates, ...nativeFiles, ...helpers, ...nativeHelpers].map(bind)
json(path.join(out, 'bindings-before-native-call.json'), { role: 'author-instrumentation-only', bindings })
const python = path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const args = ['-B', path.join(out, 'author-counts.py')]
const result = spawnSync(python, args, {
  cwd: root, encoding: 'utf8', timeout: 180000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
})
const stdout = path.join(out, 'author-counts.stdout.json')
const stderr = path.join(out, 'author-counts.stderr.txt')
fs.writeFileSync(stdout, result.stdout ?? '', { flag: 'wx' })
fs.writeFileSync(stderr, result.stderr ?? '', { flag: 'wx' })
json(path.join(out, 'author-counts.command.json'), {
  command: [python, ...args], cwd: root, exitCode: result.status,
  signal: result.signal ?? null, error: result.error?.message ?? null,
  helper: bind(import.meta.filename), counterHelper: bind(args[1]),
  stdout: bind(stdout), stderr: bind(stderr), perPageCalls: 1, finalized: false,
})
assert.equal(result.status, 0)
for (const before of bindings) assert.equal(bind(before.path).sha256, before.sha256)
const counts = JSON.parse(result.stdout)
console.log(JSON.stringify({
  output: bind(stdout),
  pages: counts.pages.map(page => ({
    page: page.pdf_page, visuallyAuthored: page.visually_authored_printed_rows,
    candidate: page.candidate_rows, native: page.native_masked_rows,
    blockRowsMatchAuthor: page.block_rows_match_author, figures: page.figures,
    nativeBands: page.native_masked_bands,
  })),
}, null, 2))
