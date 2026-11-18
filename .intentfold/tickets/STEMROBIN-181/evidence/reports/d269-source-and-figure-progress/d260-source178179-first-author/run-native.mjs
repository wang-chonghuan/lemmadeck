import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const page = Number(process.argv[2])
assert([178, 179].includes(page))
const pageId = String(page).padStart(4, '0')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const bindings = read(path.join(out, 'input-bindings.json'))
for (const item of bindings.preparedInputs) assert.equal(hash(item.path), item.sha256)
const receiptDir = path.join(out, 'native', pageId)
fs.mkdirSync(receiptDir, { recursive: true })
assert(!fs.existsSync(path.join(receiptDir, 'receipt.json')), 'Do not repeat native stages')
const md = path.join(out, 'source/10p/pages', pageId, 'page.md')
fs.copyFileSync(md, path.join(receiptDir, 'authored-before-finalize.md'), fs.constants.COPYFILE_EXCL)
const python = path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const tool = path.join(root, '.claude/skills/ld-s10y-lesson/tools/p2c.py')
const options = ['--book', '10p', '--page', String(page), '--root', path.join(out, 'source'), '--work', path.join(out, 'work')]
const temp = path.join(out, 'native-tmp')
fs.mkdirSync(temp, { recursive: true })
const commands = []
function run(stage) {
  const argv = ['-B', tool, stage, ...options]
  const startedUtc = new Date().toISOString()
  const proc = spawnSync(python, argv, { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: temp } })
  fs.writeFileSync(path.join(receiptDir, `${stage}.stdout.txt`), proc.stdout || '', { flag: 'wx' })
  fs.writeFileSync(path.join(receiptDir, `${stage}.stderr.txt`), proc.stderr || '', { flag: 'wx' })
  const record = { stage, command: [python, ...argv], startedUtc, finishedUtc: new Date().toISOString(), exitCode: proc.status, error: proc.error?.message || null, stdout: proc.stdout, stderr: proc.stderr, attempt: 1 }
  commands.push(record)
  console.log(JSON.stringify(record, null, 2))
  return proc.status
}
const finalizeExitCode = run('finalize')
let vectorizeExitCode = null
if (finalizeExitCode === 0) {
  const data = read(path.join(out, 'source/10p/pages', pageId, 'page.json'))
  const expected = page === 178 ? ['fig-136'] : []
  assert.deepEqual(data.meta.figures.map(f => f.id), expected)
  vectorizeExitCode = run('vectorize')
}
const receipt = {
  schema: 'bounded-source178179-native-first-author@1', page,
  role: 'First author, not independent reviewer', commands,
  finalizeCalls: 1, vectorizeCalls: vectorizeExitCode === null ? 0 : 1,
  finalizeExitCode, vectorizeExitCode, prepareCalls: 0, assembleCalls: 0,
  reruns: 0, nativeFailuresRetained: true,
  sourceIndependentPASS: false, rawIndependentPASS: false,
  authoredSnapshotSha256: hash(path.join(receiptDir, 'authored-before-finalize.md')),
  pageMdAfterFinalizeSha256: hash(md),
}
fs.writeFileSync(path.join(receiptDir, 'receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
for (const item of bindings.preparedInputs) assert.equal(hash(item.path), item.sha256)
console.log(JSON.stringify({ receipt: path.join(receiptDir, 'receipt.json'), sha256: hash(path.join(receiptDir, 'receipt.json')), finalizeExitCode, vectorizeExitCode }))
process.exitCode = finalizeExitCode || vectorizeExitCode || 0
