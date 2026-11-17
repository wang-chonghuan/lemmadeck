import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const out = '.intentfold/tickets/STEMROBIN-184/tmp/n15-n16-errata-preparation'
const A = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file))
const run = (name, args) => {
  assert(!fs.existsSync(`${out}/${name}.command.json`), 'No second execution')
  const startedAt = new Date().toISOString()
  const r = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', ...args], {
    encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  })
  fs.writeFileSync(`${out}/${name}.stdout.txt`, r.stdout || '')
  fs.writeFileSync(`${out}/${name}.stderr.txt`, r.stderr || '')
  fs.writeFileSync(`${out}/${name}.command.json`, JSON.stringify({
    args, startedAt, finishedAt: new Date().toISOString(), exit: r.status, signal: r.signal,
  }, null, 2) + '\n')
  console.log(`${name}: exit${r.status}\n${r.stdout || ''}${r.stderr || ''}`)
  assert.equal(r.status, 0, 'Preserve first failure')
}
for (const n of [59, 62]) {
  const id = String(n).padStart(4, '0')
  const before = read(`${out}/before/${A}/pages/${id}/page.json`)
  run(`finalize-${id}`, ['finalize', '--book', '9-10g', '--page', String(n)])
  const after = read(`${A}/pages/${id}/page.json`)
  assert.deepEqual(after.blocks, before.blocks, 'All faithful blocks must remain identical')
  const beforeAudit = read(`${out}/before/${A}/pages/${id}/audit.json`)
  const afterAudit = read(`${A}/pages/${id}/audit.json`)
  assert.deepEqual(afterAudit.figures, beforeAudit.figures, 'No recrop or figure drift')
  assert.equal(afterAudit.lines_printed, beforeAudit.lines_printed)
  assert.equal(afterAudit.lines_md, beforeAudit.lines_md)
  assert.deepEqual(afterAudit.errors, [])
}
for (const n of [15, 16]) {
  const id = `geo910-c1-s2-n${n}`
  for (const kind of ['lesson', 'exercises', 'figures']) {
    const file = `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/${id}/${kind}.template.json`
    assert.equal(sha(file), sha(path.join(out, 'before', file)), 'Do not overwrite another author')
  }
  run(`prepare-${id}`, ['adapt-prepare', '--book', '9-10g', '--edition', 'modern-us-neutral', '--lesson', id, '--force'])
}
