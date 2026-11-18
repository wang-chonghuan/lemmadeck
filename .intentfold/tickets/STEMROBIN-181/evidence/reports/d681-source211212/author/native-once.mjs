import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticketTmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const own = path.join(ticketTmp, 'd668-source211212-first-author')
const prepared = path.join(ticketTmp, 'd667-source211212-first-preparation/work')
const root = path.join(own, 'root')
const work = path.join(own, 'work')
const reports = path.join(own, 'reports')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const write = (file, value) => {
  assert.ok(file.startsWith(`${own}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
assert.equal(fs.existsSync(path.join(reports, 'native-summary.json')), false)
const inputs = []
for (const page of [211, 212]) {
  const pageId = String(page).padStart(4, '0')
  const original = path.join(prepared, '10p/pages', pageId)
  const target = path.join(work, '10p/pages', pageId)
  fs.mkdirSync(target, { recursive: true })
  const png = path.join(original, 'page.png')
  const template = path.join(original, 'page.template.md')
  const meta = JSON.parse(fs.readFileSync(template, 'utf8').split('---')[1])
  assert.equal(hash(png), meta.render.sha256)
  fs.symlinkSync(png, path.join(target, 'page.png'))
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
    const file = path.join(original, name)
    inputs.push({ path: file, sha256: hash(file), role: 'prepared-reference', page })
  }
  inputs.push({
    path: path.join(root, '10p/pages', pageId, 'page.md'),
    sha256: hash(path.join(root, '10p/pages', pageId, 'page.md')),
    role: 'first-author-before-native', page,
  })
}
const toc = path.join(repo, 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json')
const boundary = path.join(ticketTmp, 'd663-source210-reconstruction/root/10p/pages/0210/page.json')
inputs.push({ path: toc, sha256: hash(toc), role: 'official-toc' })
inputs.push({ path: boundary, sha256: hash(boundary), role: 'ending-only-boundary-not-approval' })
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const p2c = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py')
for (const relative of [
  'AGENTS.md',
  '.intentfold/readme.md',
  '.intentfold/charter/engineering.md',
  '.intentfold/charter/operations.md',
  '.intentfold/charter/product.md',
  '.intentfold/charter/ui.md',
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  '.claude/skills/ld-s10y-lesson/tools/blocks.py',
  '.claude/skills/ld-s10y-lesson/tools/vectorize.py',
  '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json',
]) {
  const file = path.join(repo, relative)
  inputs.push({ path: file, sha256: hash(file), role: 'contract-or-native-reference' })
}
write(path.join(reports, 'input-bindings.json'), inputs)
const tmpdir = path.join(work, 'native-temp')
fs.mkdirSync(tmpdir, { recursive: true })
const receipts = []
let failed = null
for (const [stage, page] of [
  ['finalize', 211], ['finalize', 212], ['vectorize', 211], ['vectorize', 212],
]) {
  const directory = path.join(reports, 'native', `${stage}-${page}-first`)
  const command = [
    python, '-B', p2c, stage, '--book', '10p', '--page', String(page),
    '--root', root, '--work', work,
  ]
  const startedAt = new Date().toISOString()
  write(path.join(directory, 'started.json'), { command, cwd: repo, startedAt })
  const result = spawnSync(command[0], command.slice(1), {
    cwd: repo, encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: tmpdir },
  })
  for (const [name, content] of [['stdout.txt', result.stdout], ['stderr.txt', result.stderr]]) {
    fs.writeFileSync(path.join(directory, name), content ?? '', { flag: 'wx' })
  }
  const receipt = {
    stage, page, command, cwd: repo, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdout: { path: path.join(directory, 'stdout.txt'), sha256: hash(path.join(directory, 'stdout.txt')) },
    stderr: { path: path.join(directory, 'stderr.txt'), sha256: hash(path.join(directory, 'stderr.txt')) },
    sourceApproval: false, cardCompletion: false,
  }
  const receiptPath = path.join(directory, 'receipt.json')
  write(receiptPath, receipt)
  receipts.push({ path: receiptPath, sha256: hash(receiptPath), stage, page, exitCode: result.status })
  console.log(JSON.stringify(receipt))
  console.log(result.stdout ?? '')
  if (result.stderr) console.log(result.stderr)
  if (result.status !== 0) {
    failed = { stage, page, receipt: receiptPath }
    break
  }
}
write(path.join(reports, 'native-summary.json'), {
  book: '10p', physicalPages: [211, 212], receipts, firstFailure: failed,
  stoppedDependentStagesAtFirstFailure: failed !== null,
  nativeOnly: true, sourceApproval: false, cardCompletion: false,
})
process.exitCode = failed ? 1 : 0
