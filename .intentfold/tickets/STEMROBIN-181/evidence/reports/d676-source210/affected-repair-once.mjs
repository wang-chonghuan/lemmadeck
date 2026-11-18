import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const old = path.join(tmp, 'd663-source210-reconstruction')
const out = path.join(tmp, 'd669-source210-affected-repair')
const page = path.join(out, 'root/10p/pages/0210')
const work = path.join(out, 'work')
const prepared = path.join(work, '10p/pages/0210')
fs.mkdirSync(page, { recursive: true })
fs.mkdirSync(prepared, { recursive: true })
assert.equal(fs.existsSync(path.join(out, 'report.json')), false)
for (const name of ['page.md', 'page.json', 'audit.json']) fs.copyFileSync(path.join(old, 'root/10p/pages/0210', name), path.join(page, name))
for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) fs.copyFileSync(path.join(old, 'work/10p/pages/0210', name), path.join(prepared, name))
const oldText = fs.readFileSync(path.join(page, 'page.md'), 'utf8')
const parts = oldText.split('---')
const metadata = JSON.parse(parts[1])
metadata.figure_crops = { 'fig-185': {
  padding_px: 0,
  reason: 'Independent F2 observed default12px lower padding includes the severed top of the separately represented caption. Exact accepted diagram box unchanged; zero padding excludes caption while retaining diagram ink.',
} }
const body = parts.slice(2).join('---')
assert.equal(body.split('“象距”').length, 2)
fs.writeFileSync(path.join(page, 'page.md'), `---\n${JSON.stringify(metadata, null, 2)}\n---${body.replace('“象距”', '“像距”')}`)
const receipts = []
for (const verb of ['finalize', 'vectorize']) {
  const command = [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', verb, '--book', '10p', '--page', '210',
    '--root', path.join(out, 'root'), '--work', work,
  ]
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  const receipt = { command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }
  fs.writeFileSync(path.join(out, `${verb}-receipt.json`), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  receipts.push({ verb, exitCode: result.status })
}
const original = JSON.parse(fs.readFileSync(path.join(old, 'root/10p/pages/0210/page.json'), 'utf8'))
const changed = JSON.parse(fs.readFileSync(path.join(page, 'page.json'), 'utf8'))
assert.deepEqual(changed.figures[0].box, original.figures[0].box)
const restored = structuredClone(changed.blocks)
restored[1].lines[2] = original.blocks[1].lines[2]
assert.deepEqual(restored, original.blocks)
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const report = {
  ticket: 'STEMROBIN-181', page: 210, status: 'F1-F2-AFFECTED-REPAIR-NATIVE-PASS-REVIEW-PENDING',
  originalFAIL: { path: path.join(tmp, 'd664-source210-reconstruction-review/report.json'), sha256: sha(path.join(tmp, 'd664-source210-reconstruction-review/report.json')) },
  changed: ['p0210#2 quoted 象距->像距 single source character', 'fig185 padding12->0 only'],
  preserved: ['Exact accepted figure box', 'All other text/blocks/open/cont/23rows', 'No new modern/anatomy changes'],
  receipts, imagesOpened: 0, sourcePagesAdded: 0, databaseWrites: false,
  files: ['page.md', 'page.json', 'audit.json'].map((name) => ({ path: path.join(page, name), sha256: sha(path.join(page, name)) })),
  figures: ['png', 'svg'].map((ext) => {
    const file = path.join(prepared, 'figures', `fig-185.${ext}`)
    return { path: file, sha256: sha(file) }
  }),
}
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ status: report.status, files: report.files, figures: report.figures }))
