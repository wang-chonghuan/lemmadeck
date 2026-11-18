import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const prior = path.join(tmp, 'd717-source223224-native-continuation')
const out = path.join(tmp, 'd727-source223224-affected-repair')
const root = path.join(out, 'root')
const work = path.join(out, 'work')
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const changes = {
  223: [['那末又会获得白光（彩图 II）. 分解出来的光谱', '那末又会获得白光（彩图 II），分解出来的光谱']],
  224: [
    ['那么它就是白色', '那么它就呈白色'],
    ['入射到它那里去的太阳光线', '入射到它那里的太阳光线'],
    ['就会显出紫色. 但是没有出现这种现象', '就会显出紫色，但是没有出现这种现象'],
  ],
}
const report = {
  ticket: 'STEMROBIN-181', status: 'FOUR-LITERAL-FINDINGS-REPAIR-PENDING',
  changes, native: [], outputs: [], unchangedFigures: [], firstFAILPreserved: true,
  imagesOpened: 0, canonicalWrites: false, nativeVectorizersReplayed: false,
  colorPlatesAcquired: false, n83SourceClosed: false, modernScienceApproved: false,
}
fs.writeFileSync(path.join(out, 'started.json'), JSON.stringify({ startedAt: new Date().toISOString() }), { flag: 'wx' })
for (const number of [223, 224]) {
  const digits = String(number).padStart(4, '0')
  const page = path.join(root, '10p/pages', digits)
  const prepared = path.join(work, '10p/pages', digits)
  fs.mkdirSync(page, { recursive: true })
  fs.mkdirSync(path.join(prepared, 'figures'), { recursive: true })
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    fs.copyFileSync(path.join(prior, 'root/10p/pages', digits, name), path.join(page, name), fs.constants.COPYFILE_EXCL)
  }
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
    fs.copyFileSync(path.join(prior, 'work/10p/pages', digits, name), path.join(prepared, name), fs.constants.COPYFILE_EXCL)
  }
  const figure = number - 27
  for (const extension of ['png', 'svg']) {
    const name = `fig-${figure}.${extension}`
    const source = path.join(prior, 'work/10p/pages', digits, 'figures', name)
    const target = path.join(prepared, 'figures', name)
    fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
    report.unchangedFigures.push({ path: path.relative(repo, target), sha256: sha(target), priorSha256: sha(source) })
  }
  const markdown = path.join(page, 'page.md')
  let text = fs.readFileSync(markdown, 'utf8')
  for (const [before, after] of changes[number]) {
    assert.equal(text.split(before).length, 2, before)
    text = text.replace(before, after)
  }
  fs.writeFileSync(markdown, text)
  const command = [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '10p',
    '--page', String(number), '--root', root, '--work', work,
  ]
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  const receipt = path.join(out, `${number}-finalize.receipt.json`)
  fs.writeFileSync(receipt, `${JSON.stringify({ command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2)}\n`, { flag: 'wx' })
  report.native.push({ page: number, path: path.relative(repo, receipt), sha256: sha(receipt), exitCode: result.status })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  for (const extension of ['png', 'svg']) {
    assert.equal(sha(path.join(prepared, 'figures', `fig-${figure}.${extension}`)),
      sha(path.join(prior, 'work/10p/pages', digits, 'figures', `fig-${figure}.${extension}`)))
  }
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const file = path.join(page, name)
    report.outputs.push({ path: path.relative(repo, file), sha256: sha(file) })
  }
}
report.status = 'FOUR-LITERAL-FINDINGS-REPAIRED-NATIVE-PASS-AFFECTED-REVIEW-PENDING'
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ status: report.status, native: report.native }))
