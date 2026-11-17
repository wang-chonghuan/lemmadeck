import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = '.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p80-p83-prepare'
const pages = [80, 81, 82, 83]
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert(!fs.existsSync(root), 'First prepare only')
for (const page of pages) {
  const id = String(page).padStart(4, '0')
  assert(!fs.existsSync(`.tmp/ld-s10y-lesson/9-10g/pages/${id}`))
  assert(!fs.existsSync(`ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/${id}`))
}
fs.mkdirSync(root)
const commands = []
for (const page of pages) {
  const id = String(page).padStart(4, '0')
  const executable = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
  const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'prepare', '--book', '9-10g', '--page', String(page)]
  const startedAtUtc = new Date().toISOString()
  const child = spawnSync(executable, args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
  for (const [suffix, text] of [['stdout.txt', child.stdout || ''], ['stderr.txt', child.stderr || '']]) {
    fs.writeFileSync(`${root}/${id}.${suffix}`, text, { flag: 'wx' })
  }
  const command = { page, executable, args, cwd: process.cwd(), startedAtUtc,
    finishedAtUtc: new Date().toISOString(), exit: child.status,
    signal: child.signal, error: child.error?.message || null, invocationCount: 1 }
  fs.writeFileSync(`${root}/${id}.command.json`, JSON.stringify(command, null, 2) + '\n', { flag: 'wx' })
  console.log(`${page}: exit ${child.status}; ${child.stdout.trim()}`)
  assert.equal(child.status, 0, 'Preserve first failure; do not retry passed pages')
  command.prepared = ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'].map(name => {
    const path = `.tmp/ld-s10y-lesson/9-10g/pages/${id}/${name}`
    return { path, sha256: hash(path) }
  })
  commands.push(command)
}
fs.writeFileSync(`${root}/result.json`, JSON.stringify({
  status: 'PREPARED_ONLY_NO_TRANSCRIPTION_OR_FINALIZE', commands,
}, null, 2) + '\n', { flag: 'wx' })
