import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const page = Number(process.argv[2])
assert([196, 197, 198, 199].includes(page))
const root = process.cwd()
const out = '.intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0196-0199'
const work = `.tmp/ld-s10y-lesson/9p/pages/${String(page).padStart(4, '0')}`
const durable = `ssot-resources/soviet10year-textbooks/artifacts/9p/pages/${String(page).padStart(4, '0')}`
const report = `${out}/prepare-${page}.json`
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
assert(!fs.existsSync(work), `Prepared page exists; do not repeat: ${work}`)
assert(!fs.existsSync(durable), `Durable page exists; do not re-author: ${durable}`)
assert(!fs.existsSync(report))
assert(!fs.existsSync(`${out}/author-freeze.json`))
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const tool = '.claude/skills/ld-s10y-lesson/tools/p2c.py'
const args = ['-B', tool, 'prepare', '--book', '9p', '--page', String(page)]
const result = spawnSync(python, args, {
  encoding: 'utf8', timeout: 180000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
})
const metadata = {
  ticket: 'STEMROBIN-181', batch: 'D020', role: 'source-author-native-prepare-only',
  pdfPage: page, initialAuthorPackageAndNativePageAbsent: true,
  command: [python, ...args], cwd: root,
  exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
  stdout: result.stdout, stderr: result.stderr,
  helper: bind(path.relative(root, import.meta.filename)), nativeTool: bind(tool),
  outputs: ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']
    .filter(name => fs.existsSync(`${work}/${name}`)).map(name => bind(`${work}/${name}`)),
  sourceFinalizeVectorizeAssembleOrGate: false, processesFinished: true,
}
fs.writeFileSync(report, `${JSON.stringify(metadata, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ preparation: bind(report), ...metadata }, null, 2))
assert.equal(result.status, 0)
