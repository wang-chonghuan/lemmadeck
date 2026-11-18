import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const prior = path.join(tmp, 'd710-source221222-first-author')
const out = path.join(tmp, 'd721-source221222-affected-repair')
const root = path.join(out, 'root')
const work = path.join(out, 'work')
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const changes = {
  221: [['在第一种媒质中光速等于', '在第一种媒质中的光速等于']],
  222: [
    ['叫做相对折\n射率.', '叫做**相对折**\n**射率**.'],
    ['媒质的绝对折射率', '媒质的**绝对折射率**'],
    ['**折射率与光束的入射角无关，但是它与光的颜色有关，这**', '**折射率**与光束的入射角无关，但是它与光的颜色有关，这'],
    ['虹彩的边缘，通', '虹彩的边缘. 通'],
  ],
}
const report = {
  ticket: 'STEMROBIN-181', status: 'FIVE-FINDINGS-AFFECTED-NATIVE-PENDING', changes,
  crop195: 'padding12to0 exactsnapboxunchanged',
  imageOpens: 0, firstFAILPreserved: true, canonicalWrites: false, databaseWrites: false,
  native: [], outputs: [],
}
fs.writeFileSync(path.join(out, 'started.json'), JSON.stringify({ startedAt: new Date().toISOString() }), { flag: 'wx' })
for (const number of [221, 222]) {
  const digits = String(number).padStart(4, '0')
  const page = path.join(root, '10p/pages', digits)
  const prepared = path.join(work, '10p/pages', digits)
  fs.mkdirSync(page, { recursive: true })
  fs.mkdirSync(prepared, { recursive: true })
  for (const name of ['page.md', 'page.json', 'audit.json']) fs.copyFileSync(path.join(prior, 'root/10p/pages', digits, name), path.join(page, name), fs.constants.COPYFILE_EXCL)
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) fs.copyFileSync(path.join(prior, 'work/10p/pages', digits, name), path.join(prepared, name), fs.constants.COPYFILE_EXCL)
  const file = path.join(page, 'page.md')
  let text = fs.readFileSync(file, 'utf8')
  for (const [before, after] of changes[number]) {
    assert.equal(text.split(before).length, 2, before)
    text = text.replace(before, after)
  }
  if (number === 221) {
    const parts = text.split('---')
    const meta = JSON.parse(parts[1])
    meta.figure_crops = { 'fig-195': { padding_px: 0, reason: 'Independent source review found clipped caption tops in12px margin; exact snapped diagram box unchanged.' } }
    text = `---\n${JSON.stringify(meta, null, 2)}\n---${parts.slice(2).join('---')}`
  }
  fs.writeFileSync(file, text)
  for (const verb of number === 221 ? ['finalize', 'vectorize'] : ['finalize']) {
    const command = [
      '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', verb, '--book', '10p', '--page', String(number),
      '--root', root, '--work', work,
    ]
    const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
    const receipt = path.join(out, `${number}-${verb}.receipt.json`)
    fs.writeFileSync(receipt, `${JSON.stringify({ command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2)}\n`, { flag: 'wx' })
    report.native.push({ page: number, verb, path: path.relative(repo, receipt), sha256: sha(receipt), exitCode: result.status })
    assert.equal(result.status, 0, result.stdout + result.stderr)
  }
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const file = path.join(page, name)
    report.outputs.push({ path: path.relative(repo, file), sha256: sha(file) })
  }
}
report.status = 'FIVE-FINDINGS-AFFECTED-NATIVE-PASS-REVIEW-PENDING'
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ status: report.status, native: report.native }))
