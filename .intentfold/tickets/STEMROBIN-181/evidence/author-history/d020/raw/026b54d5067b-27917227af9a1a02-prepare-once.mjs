import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const out = path.dirname(import.meta.filename)
const page = Number(process.argv[2])
assert([204, 205, 206, 207].includes(page))
const work = `.tmp/ld-s10y-lesson/9p/pages/${String(page).padStart(4, '0')}`
const durable = `ssot-resources/soviet10year-textbooks/artifacts/9p/pages/${String(page).padStart(4, '0')}`
const report = path.join(out, `prepare-${page}.json`)
const bind = file => ({
  path: path.relative(root, file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
})
assert(!fs.existsSync(work), `Preparation already exists: ${work}`)
assert(!fs.existsSync(durable), `Persistent page already exists: ${durable}`)
assert(!fs.existsSync(report))
assert(!fs.existsSync(path.join(out, 'author-freeze.json')))
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const tool = '.claude/skills/ld-s10y-lesson/tools/p2c.py'
const args = ['-B', tool, 'prepare', '--book', '9p', '--page', String(page)]
const result = spawnSync(python, args, {
  encoding: 'utf8',
  timeout: 180000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
})
const record = {
  ticket: 'STEMROBIN-181',
  role: 'source-author-native-prepare-only',
  pdfPage: page,
  initialNativeAndPersistentPageAbsent: true,
  command: [python, ...args],
  cwd: root,
  helper: bind(import.meta.filename),
  nativeTool: bind(path.resolve(tool)),
  exitCode: result.status,
  signal: result.signal,
  error: result.error?.message ?? null,
  stdout: result.stdout,
  stderr: result.stderr,
  outputs: ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']
    .filter(name => fs.existsSync(`${work}/${name}`))
    .map(name => bind(path.resolve(work, name))),
  processesFinished: true,
  finalizeVectorizeAssembleOrPromotion: false,
}
fs.writeFileSync(report, `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ report: bind(report), ...record }, null, 2))
assert.equal(result.status, 0)
