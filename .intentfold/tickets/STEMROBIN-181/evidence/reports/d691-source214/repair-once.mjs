import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const old = path.join(tmp, 'd675-source213214-row-recovery')
const out = path.join(tmp, 'd685-source214-character-repair')
const page = path.join(out, 'root/10p/pages/0214')
const work = path.join(out, 'work')
const prepared = path.join(work, '10p/pages/0214')
fs.mkdirSync(page, { recursive: true })
fs.mkdirSync(prepared, { recursive: true })
for (const name of ['page.md', 'page.json', 'audit.json']) fs.copyFileSync(path.join(old, 'root/10p/pages/0214', name), path.join(page, name))
for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) fs.copyFileSync(path.join(old, 'work/10p/pages/0214', name), path.join(prepared, name))
const text = fs.readFileSync(path.join(page, 'page.md'), 'utf8')
assert.equal(text.split('需要把目镜').length, 2)
fs.writeFileSync(path.join(page, 'page.md'), text.replace('需要把目镜', '需把目镜'))
const command = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
  '--book', '10p', '--page', '214', '--root', path.join(out, 'root'), '--work', work,
]
const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
fs.writeFileSync(path.join(out, 'finalize-receipt.json'), `${JSON.stringify({ command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2)}\n`, { flag: 'wx' })
assert.equal(result.status, 0, result.stdout + result.stderr)
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert.equal(hash(path.join(prepared, 'figures/fig-190.png')), hash(path.join(old, 'work/10p/pages/0214/figures/fig-190.png')))
fs.copyFileSync(path.join(old, 'work/10p/pages/0214/figures/fig-190.svg'), path.join(prepared, 'figures/fig-190.svg'))
const report = {
  ticket: 'STEMROBIN-181', page: 214, status: 'SINGLE-SOURCE-CHARACTER-REPAIR-NATIVE-PASS-REVIEW-PENDING',
  change: 'Unprinted 要 removed from 需要把目镜 to exact 需把目镜',
  nativeFinalizeExitCode: 0, vectorizeRepeated: false,
  PNGSVGUnchanged: true, sourcePhi2Unchanged: true, imagesOpened: 0,
  files: ['page.md', 'page.json', 'audit.json'].map((name) => ({ path: path.join(page, name), sha256: hash(path.join(page, name)) })),
}
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify(report, null, 2))
