import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const old = path.join(tmp, 'd680-source215216-first-author')
const out = path.join(tmp, 'd690-source215216-word-repair')
const root = path.join(out, 'root')
const work = path.join(out, 'work')
const changes = {
  215: [['如果把透镜有一半遮', '如果把透镜右半部遮'], ['面的近处森林', '面的远处森林']],
  216: [['则幻灯片底片的放大率', '则幻灯对底片的放大率']],
}
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const report = { ticket: 'STEMROBIN-181', status: 'THREE-AFFECTED-WORD-REPAIR-NATIVE-PASS-REVIEW-PENDING', changes, native: [], files: [], imageOpens: 0, vectorizeRepeated: false }
for (const number of [215, 216]) {
  const digits = String(number).padStart(4, '0')
  const page = path.join(root, '10p/pages', digits)
  const prepared = path.join(work, '10p/pages', digits)
  fs.mkdirSync(page, { recursive: true })
  fs.mkdirSync(prepared, { recursive: true })
  for (const name of ['page.md', 'page.json', 'audit.json']) fs.copyFileSync(path.join(old, 'root/10p/pages', digits, name), path.join(page, name))
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) fs.copyFileSync(path.join(old, 'work/10p/pages', digits, name), path.join(prepared, name))
  let text = fs.readFileSync(path.join(page, 'page.md'), 'utf8')
  for (const [before, after] of changes[number]) {
    assert.equal(text.split(before).length, 2)
    text = text.replace(before, after)
  }
  fs.writeFileSync(path.join(page, 'page.md'), text)
  const command = [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '10p', '--page', String(number),
    '--root', root, '--work', work,
  ]
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  fs.writeFileSync(path.join(out, `${number}-finalize.receipt.json`), `${JSON.stringify({ command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2)}\n`, { flag: 'wx' })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  report.native.push({ page: number, exitCode: result.status })
  const oldFigures = path.join(old, 'work/10p/pages', digits, 'figures')
  if (fs.existsSync(oldFigures)) for (const name of fs.readdirSync(oldFigures)) {
    const source = path.join(oldFigures, name)
    const dest = path.join(prepared, 'figures', name)
    if (name.endsWith('.svg')) fs.copyFileSync(source, dest)
    assert.equal(sha(dest), sha(source), 'Unchanged reviewed figure drift')
  }
  for (const name of ['page.md', 'page.json', 'audit.json']) report.files.push({ path: path.join(page, name), sha256: sha(path.join(page, name)) })
}
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify(report, null, 2))
