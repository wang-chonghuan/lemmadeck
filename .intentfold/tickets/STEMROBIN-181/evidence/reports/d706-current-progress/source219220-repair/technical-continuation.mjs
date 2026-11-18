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
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
assert.equal(read(path.join(out, '219-finalize.receipt.json')).exitCode, 0)
assert.equal(read(path.join(out, '219-vectorize193.receipt.json')).exitCode, 2)
const report = {
  ticket: 'STEMROBIN-181', status: 'AFFECTED-NATIVE-TECHNICAL-CONTINUATION-PENDING',
  cause: 'p2c vectorize has no --figure option. Continue via existing vectorize.py --input/--output only.',
  firstTechnicalFAIL: { path: path.join(out, '219-vectorize193.receipt.json'), sha256: sha(path.join(out, '219-vectorize193.receipt.json')) },
  source219FinalizeReplayed: false, RAW194SVGUnchangedPASSReused: true,
  changes: ['219 fig193 padding12to0 unchangedsnappedbox', '220 omitted以 and是 restored'],
  native: [], outputs: [], imagesOpened: 0, originalFAILPreserved: true,
}
const vectorCommand = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/vectorize.py',
  '--input', path.join(work, '10p/pages/0219/figures/fig-193.png'),
  '--output', path.join(work, '10p/pages/0219/figures/fig-193.svg'),
]
function call(name, command) {
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  const file = path.join(out, `${name}.receipt.json`)
  fs.writeFileSync(file, `${JSON.stringify({ command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2)}\n`, { flag: 'wx' })
  report.native.push({ path: file, sha256: sha(file), exitCode: result.status })
  assert.equal(result.status, 0, result.stdout + result.stderr)
}
call('219-vectorize193-continuation', vectorCommand)
const page = path.join(root, '10p/pages/0220')
const prepared = path.join(work, '10p/pages/0220')
fs.mkdirSync(page, { recursive: true })
fs.mkdirSync(prepared, { recursive: true })
for (const name of ['page.md', 'page.json', 'audit.json']) fs.copyFileSync(path.join(old, 'root/10p/pages/0220', name), path.join(page, name), fs.constants.COPYFILE_EXCL)
for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) fs.copyFileSync(path.join(old, 'work/10p/pages/0220', name), path.join(prepared, name), fs.constants.COPYFILE_EXCL)
let text = fs.readFileSync(path.join(page, 'page.md'), 'utf8')
for (const [before, after] of [
  ['惠更斯原理在机械波为题', '惠更斯原理在以机械波为题'],
  ['反射定律，但因为所有的', '反射定律，但是因为所有的'],
]) {
  assert.equal(text.split(before).length, 2)
  text = text.replace(before, after)
}
fs.writeFileSync(path.join(page, 'page.md'), text)
call('220-finalize', [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
  '--book', '10p', '--page', '220', '--root', root, '--work', work,
])
for (const number of [219, 220]) for (const name of ['page.md', 'page.json', 'audit.json']) {
  const file = path.join(root, '10p/pages', `0${number}`, name)
  report.outputs.push({ path: file, sha256: sha(file) })
}
for (const id of [193, 194]) for (const extension of ['png', 'svg']) {
  const file = path.join(work, '10p/pages/0219/figures', `fig-${id}.${extension}`)
  report.outputs.push({ path: file, sha256: sha(file) })
  if (id === 194) assert.equal(sha(file), sha(path.join(old, 'work/10p/pages/0219/figures', `fig-${id}.${extension}`)))
}
assert.deepEqual(read(path.join(root, '10p/pages/0219/audit.json')).figures?.[0]?.box,
  read(path.join(old, 'root/10p/pages/0219/audit.json')).figures?.[0]?.box)
report.status = 'THREE-FINDINGS-AFFECTED-REPAIR-NATIVE-PASS-REVIEW-PENDING'
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ status: report.status, native: report.native }))
