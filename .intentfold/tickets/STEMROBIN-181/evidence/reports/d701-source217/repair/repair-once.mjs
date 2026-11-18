import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const prior = path.join(tmp, 'd687-source217218-first-author')
const out = path.join(tmp, 'd695-source217218-affected-repair')
const first = path.join(tmp, 'd688-source217218-first-review/reports/report.json')
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert.equal(sha(first), '2a62404900fb57a3d47b955317c3965863143e41fb0faf416efacf4d6db691ac')
assert.ok(!fs.existsSync(path.join(out, 'started.json')))
fs.writeFileSync(path.join(out, 'started.json'), JSON.stringify({ startedAt: new Date().toISOString() }), { flag: 'wx' })
const changes = {
  217: [
    ['的时间，但是', '的时间. 但是'],
    ['木星的卫星食.', '木星的各卫星蚀.'],
  ],
  218: [
    ['一来，这个月亮就如同', '一来，这个“月亮”就如同'],
    ['影子里出现，站在', '影子里出现；站在'],
    ['极端困难的，因为', '极端困难的. 因为'],
    ['家 H·斐索', '家 H·裴索'],
    ['测量出来的. 斐\n索', '测量出来的. 裴\n索'],
  ],
}
const report = {
  ticket: 'STEMROBIN-181', status: 'SIX-FINDINGS-REPAIRED-NATIVE-PASS-AFFECTED-REVIEW-PENDING',
  firstReview: { path: path.relative(repo, first), sha256: sha(first) },
  changes, native: [], outputs: [], imagesOpened: 0, vectorizeCalls: 0,
  unchangedInitialHold: 'H218-INITIAL-CODEPOINT remains HOLD; H was not adjudicated or normalized.',
  originalFAILPreserved: true, completeCardClaim: false, databaseWrites: false,
}
for (const number of [217, 218]) {
  const digits = String(number).padStart(4, '0')
  const page = path.join(out, 'root/10p/pages', digits)
  const prepared = path.join(out, 'work/10p/pages', digits)
  fs.mkdirSync(page, { recursive: true })
  fs.mkdirSync(prepared, { recursive: true })
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    fs.copyFileSync(path.join(prior, 'root/10p/pages', digits, name), path.join(page, name), fs.constants.COPYFILE_EXCL)
  }
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
    fs.copyFileSync(path.join(prior, 'work/10p/pages', digits, name), path.join(prepared, name), fs.constants.COPYFILE_EXCL)
  }
  let text = fs.readFileSync(path.join(page, 'page.md'), 'utf8')
  for (const [before, after] of changes[number]) {
    assert.equal(text.split(before).length, 2, before)
    text = text.replace(before, after)
  }
  fs.writeFileSync(path.join(page, 'page.md'), text)
  const command = [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '10p',
    '--page', String(number), '--root', path.join(out, 'root'), '--work', path.join(out, 'work'),
  ]
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  const receipt = path.join(out, `${number}-finalize.receipt.json`)
  fs.writeFileSync(receipt, `${JSON.stringify({ command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2)}\n`, { flag: 'wx' })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.equal(sha(path.join(page, 'audit.json')), sha(path.join(prior, 'root/10p/pages', digits, 'audit.json')))
  report.native.push({ page: number, receipt: path.relative(repo, receipt), sha256: sha(receipt), exitCode: result.status })
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const file = path.join(page, name)
    report.outputs.push({ path: path.relative(repo, file), sha256: sha(file) })
  }
}
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ status: report.status, native: report.native, imagesOpened: 0 }))
