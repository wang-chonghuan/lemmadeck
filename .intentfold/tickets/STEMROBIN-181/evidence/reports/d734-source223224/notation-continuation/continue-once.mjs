import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const prior = path.join(tmp, 'd716-source223224-first-author')
const prep = path.join(tmp, 'd714-source223224-first-preparation/work/10p/pages')
const out = path.join(tmp, 'd717-source223224-native-continuation')
const root = path.join(out, 'root')
const work = path.join(out, 'work')
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const first = JSON.parse(fs.readFileSync(path.join(prior, 'report.json'), 'utf8'))
assert.equal(first.status, 'FIRST-NATIVE-FAIL-RETAINED')
const report = {
  ...first, status: 'ROMAN-PLATE-NOTATION-CONTINUATION-NATIVE-PENDING', native: [], files: [],
  firstFailure: { path: path.relative(repo, path.join(prior, 'report.json')), sha256: sha(path.join(prior, 'report.json')) },
  technicalNotationRepair: 'Printed Roman plateI/II represented by supported Latin I/II; reference content not changed. Whitelist forbids dedicated numeral codepointsU2160/U2161.',
  originalFAILPreserved: true, imageOpensAdded: 0,
}
for (const number of [223, 224]) {
  const digits = String(number).padStart(4, '0')
  const page = path.join(root, '10p/pages', digits)
  const prepared = path.join(work, '10p/pages', digits)
  fs.mkdirSync(page, { recursive: true })
  fs.mkdirSync(prepared, { recursive: true })
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) fs.copyFileSync(path.join(prep, digits, name), path.join(prepared, name), fs.constants.COPYFILE_EXCL)
  if (number === 223) {
    for (const name of ['page.md', 'page.json', 'audit.json']) fs.copyFileSync(path.join(prior, 'root/10p/pages/0223', name), path.join(page, name), fs.constants.COPYFILE_EXCL)
    const file = path.join(page, 'page.md')
    let text = fs.readFileSync(file, 'utf8')
    assert.equal(text.split('彩图Ⅰ').length, 2)
    assert.equal(text.split('彩图Ⅱ').length, 2)
    text = text.replace('彩图Ⅰ', '彩图 I').replace('彩图Ⅱ', '彩图 II')
    fs.writeFileSync(file, text)
  } else {
    const script = fs.readFileSync(path.join(prior, 'author-once.mjs'), 'utf8')
    const match = script.match(/  224: `([\s\S]*?)`,\n}/)
    assert.ok(match)
    const meta = JSON.parse(fs.readFileSync(path.join(prepared, 'page.template.md'), 'utf8').split('---')[1])
    meta.printed_page = 214
    meta.notes = [first.boundary, first.sourceFacts, 'External colorplate I/II references not acquired or approved.']
    fs.writeFileSync(path.join(page, 'page.md'), `---\n${JSON.stringify(meta, null, 2)}\n---\n${match[1]}`, { flag: 'wx' })
  }
  for (const verb of ['finalize', 'vectorize']) {
    const command = [
      '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', verb, '--book', '10p', '--page', String(number),
      '--root', root, '--work', work,
    ]
    const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
    const file = path.join(out, `${number}-${verb}.receipt.json`)
    fs.writeFileSync(file, `${JSON.stringify({ command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2)}\n`, { flag: 'wx' })
    report.native.push({ page: number, verb, path: path.relative(repo, file), sha256: sha(file), exitCode: result.status })
    if (result.status !== 0) {
      report.status = 'NATIVE-FAIL-RETAINED'
      fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
      console.log(JSON.stringify({ status: report.status, page: number, stdout: result.stdout, stderr: result.stderr }))
      process.exit(1)
    }
  }
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const file = path.join(page, name)
    report.files.push({ path: path.relative(repo, file), sha256: sha(file) })
  }
}
report.status = 'SOURCE223224-NATIVE-PASS-FIRST-INDEPENDENT-REVIEW-PENDING'
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify(report))
