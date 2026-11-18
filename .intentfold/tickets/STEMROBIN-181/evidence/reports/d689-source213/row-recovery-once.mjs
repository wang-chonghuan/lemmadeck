import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const old = path.join(tmp, 'd673-source213214-first-author')
const prep = path.join(tmp, 'd671-source213214-first-preparation/work/10p/pages')
const out = path.join(tmp, 'd675-source213214-row-recovery')
fs.mkdirSync(out, { recursive: true })
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const root = path.join(out, 'root')
const work = path.join(out, 'work')
const script = fs.readFileSync(path.join(old, 'author-and-native-once.mjs'), 'utf8')
const raw214 = script.match(/214: `([\s\S]*?)`,\n\}/)?.[1]
assert.ok(raw214)
const report = {
  ticket: 'STEMROBIN-181', status: 'ROW-REPRESENTATION-RECOVERY-ONLY',
  originalFailure: { path: path.join(old, '213-finalize.receipt.json'), sha256: sha(path.join(old, '213-finalize.receipt.json')) },
  correction: 'Display fractions each form one native row, not a wrap; fig188/189 captions share one printed horizontal row. No prose/math tokens removed or counting override.',
  source214Discrepancy: 'Literal phi2 in substitution prose retained despite surrounding phi. No modern correction approved.',
  native: [], files: [], imagesOpened: 0,
}
for (const number of [213, 214]) {
  const digits = String(number).padStart(4, '0')
  const page = path.join(root, '10p/pages', digits)
  const prepared = path.join(work, '10p/pages', digits)
  fs.mkdirSync(page, { recursive: true })
  fs.mkdirSync(prepared, { recursive: true })
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) fs.copyFileSync(path.join(prep, digits, name), path.join(prepared, name))
  let body, meta
  if (number === 213) {
    const previous = fs.readFileSync(path.join(old, 'root/10p/pages/0213/page.md'), 'utf8')
    meta = JSON.parse(previous.split('---')[1])
    body = previous.split('---').slice(2).join('---')
    body = body.replaceAll('↵', '').replace('<!-- cap 图 189 -->', '<!-- cap 图 189 samerow -->')
    fs.copyFileSync(path.join(old, 'root/10p/pages/0213/audit.json'), path.join(page, 'audit.json'))
  } else {
    meta = JSON.parse(fs.readFileSync(path.join(prepared, 'page.template.md'), 'utf8').split('---')[1])
    meta.printed_page = 204
    body = raw214.replaceAll('↵', '').replaceAll('\\\\', '\\')
  }
  meta.notes = [
    ...(meta.notes ?? []).filter((note) => !note.includes('two printed rows')),
    report.correction,
    ...(number === 214 ? [report.source214Discrepancy] : []),
  ]
  fs.writeFileSync(path.join(page, 'page.md'), `---\n${JSON.stringify(meta, null, 2)}\n---\n${body}`)
  for (const verb of ['finalize', 'vectorize']) {
    const command = [
      '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', verb, '--book', '10p', '--page', String(number),
      '--root', root, '--work', work,
    ]
    const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
    const receipt = { command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }
    fs.writeFileSync(path.join(out, `${number}-${verb}.receipt.json`), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
    report.native.push({ page: number, verb, exitCode: result.status })
    if (result.status !== 0) {
      report.status = 'NATIVE-FAIL-RETAINED-DEPENDENT-STAGE-STOPPED'
      fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
      console.log(JSON.stringify(receipt))
      process.exit(1)
    }
  }
  for (const name of ['page.md', 'page.json', 'audit.json']) report.files.push({ path: path.join(page, name), sha256: sha(path.join(page, name)) })
  for (const name of fs.readdirSync(path.join(prepared, 'figures'))) {
    const file = path.join(prepared, 'figures', name)
    report.files.push({ path: file, sha256: sha(file) })
  }
}
report.status = 'NATIVE-PASS-SOURCE213214-FIRST-INDEPENDENT-REVIEW-PENDING'
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify(report, null, 2))
