import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const old = path.join(tmp, 'd698-source219220-first-author')
const out = path.join(tmp, 'd702-source219220-affected-repair')
const root = path.join(out, 'root')
const work = path.join(out, 'work')
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const report = { ticket: 'STEMROBIN-181', status: 'AFFECTED-REPAIR-NATIVE-PENDING', changes: [], native: [], outputs: [], imageOpens: 0 }
fs.writeFileSync(path.join(out, 'started.json'), JSON.stringify({ startedAt: new Date().toISOString() }), { flag: 'wx' })
for (const number of [219, 220]) {
  const digits = String(number).padStart(4, '0')
  const page = path.join(root, '10p/pages', digits)
  const prepared = path.join(work, '10p/pages', digits)
  fs.mkdirSync(page, { recursive: true })
  fs.mkdirSync(prepared, { recursive: true })
  for (const name of ['page.md', 'page.json', 'audit.json']) fs.copyFileSync(path.join(old, 'root/10p/pages', digits, name), path.join(page, name), fs.constants.COPYFILE_EXCL)
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) fs.copyFileSync(path.join(old, 'work/10p/pages', digits, name), path.join(prepared, name), fs.constants.COPYFILE_EXCL)
  const file = path.join(page, 'page.md')
  let text = fs.readFileSync(file, 'utf8')
  if (number === 219) {
    const parts = text.split('---')
    const meta = JSON.parse(parts[1])
    meta.figure_crops = { 'fig-193': { padding_px: 0, reason: 'Independent first review found clipped adjacent caption tops in the12px white margin; retain exact snapped diagram box and source pixels.' } }
    text = `---\n${JSON.stringify(meta, null, 2)}\n---${parts.slice(2).join('---')}`
    report.changes.push({ page: 219, change: 'Only fig193 padding12-to0; snapped box unchanged; no prose change.' })
  } else {
    for (const [before, after] of [
      ['惠更斯原理在机械波为题', '惠更斯原理在以机械波为题'],
      ['反射定律，但因为所有的', '反射定律，但是因为所有的'],
    ]) {
      assert.equal(text.split(before).length, 2)
      text = text.replace(before, after)
      report.changes.push({ page: 220, before, after })
    }
  }
  fs.writeFileSync(file, text)
  const command = [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'finalize', '--book', '10p', '--page', String(number), '--root', root, '--work', work,
  ]
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  const receipt = path.join(out, `${number}-finalize.receipt.json`)
  fs.writeFileSync(receipt, `${JSON.stringify({ command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2)}\n`, { flag: 'wx' })
  report.native.push({ page: number, verb: 'finalize', path: receipt, sha256: sha(receipt), exitCode: result.status })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  if (number === 219) {
    assert.equal(sha(path.join(prepared, 'figures/fig-194.png')), sha(path.join(old, 'work/10p/pages/0219/figures/fig-194.png')))
    fs.copyFileSync(path.join(old, 'work/10p/pages/0219/figures/fig-194.svg'), path.join(prepared, 'figures/fig-194.svg'), fs.constants.COPYFILE_EXCL)
    const vectorCommand = [
      ...command.slice(0, 3), 'vectorize', '--book', '10p', '--page', '219',
      '--figure', 'fig-193', '--root', root, '--work', work,
    ]
    const vector = spawnSync(vectorCommand[0], vectorCommand.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
    const vectorReceipt = path.join(out, '219-vectorize193.receipt.json')
    fs.writeFileSync(vectorReceipt, `${JSON.stringify({ command: vectorCommand, exitCode: vector.status, stdout: vector.stdout, stderr: vector.stderr }, null, 2)}\n`, { flag: 'wx' })
    report.native.push({ page: 219, verb: 'vectorize193', path: vectorReceipt, sha256: sha(vectorReceipt), exitCode: vector.status })
    assert.equal(vector.status, 0, vector.stdout + vector.stderr)
  }
  for (const name of ['page.md', 'page.json', 'audit.json']) report.outputs.push({ path: path.join(page, name), sha256: sha(path.join(page, name)) })
}
report.status = 'THREE-FINDINGS-AFFECTED-REPAIR-NATIVE-PASS-REVIEW-PENDING'
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify(report))
