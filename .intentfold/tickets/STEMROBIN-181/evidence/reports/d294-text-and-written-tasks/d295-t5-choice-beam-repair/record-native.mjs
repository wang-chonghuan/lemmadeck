import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const target = process.argv[2]
assert(['isolation', 'zh', 'en'].includes(target))
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const binding = read(path.join(out, 'source-binding.json'))
const inputs = [
  binding.originalFreeze, binding.previousSourceBinding, binding.originalReport,
  binding.originalScopeAndHolds, binding.phase1, binding.inheritedOpens,
  ...binding.contracts,
  ...binding.languages.flatMap(item => [item.originalDraft, item.originalVisible, item.seed, ...item.authority]),
]
for (const input of inputs) assert.equal(hash(input.path), input.sha256)
const item = binding.languages.find(item => item.language === target)
const command = target === 'isolation'
  ? ['python3', '-B', path.join(out, 'check-isolation.py')]
  : ['python3', '-B', path.join(root, '.agents/skills/ld-s10y-choice/scripts/validate.py'),
    '--repo', item.repository, '--seed', item.seed.path, '--draft', path.join(out, target, 'draft.json')]
const folder = path.join(out, 'native-initial', target)
fs.mkdirSync(folder, { recursive: true })
const startedUtc = new Date().toISOString()
const proc = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: out },
})
const stdout = path.join(folder, target === 'isolation' ? 'stdout.json' : 'stdout.txt')
const stderr = path.join(folder, 'stderr.txt')
fs.writeFileSync(stdout, proc.stdout || '', { flag: 'wx' })
fs.writeFileSync(stderr, proc.stderr || '', { flag: 'wx' })
const receiptPath = path.join(folder, 'receipt.json')
fs.writeFileSync(receiptPath, `${JSON.stringify({
  command, startedUtc, finishedUtc: new Date().toISOString(),
  exitCode: proc.status, signal: proc.signal, error: proc.error?.message || null,
  candidateDrafts: binding.languages.map(item => bound(path.join(out, item.language, 'draft.json'))),
  stdout: bound(stdout), stderr: bound(stderr),
  scope: target === 'isolation' ? 'Local field delta and untouched raw JSON byte accounting only.' : 'Native structure validate on new snapshot only; no semantic review supplied.',
  attempt: 1, automaticRetries: 0, reviewSupplied: false,
  independentReview: 'PENDING-D296', sourcePresolveOrOtherQuestionSemanticReplay: false,
  newImages: 0, cumulativeImages: 24, retainFirstFailure: true,
}, null, 2)}\n`, { flag: 'wx' })
for (const input of inputs) assert.equal(hash(input.path), input.sha256)
console.log(JSON.stringify({ target, receipt: bound(receiptPath), exitCode: proc.status, newImages: 0, independentReview: 'PENDING-D296' }, null, 2))
process.exitCode = proc.status === 0 ? 0 : 1
