import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const language = process.argv[2]
assert(['zh', 'en'].includes(language))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const binding = read(path.join(out, 'source-binding.json'))
const item = binding.seeds.find(seed => seed.language === language)
for (const input of [binding.manifest, item.seed, ...item.authority, ...binding.contracts]) {
  assert.equal(hash(input.path), input.sha256)
}
const checkpoint = read(path.join(out, 'independent-solution-checkpoint.json'))
assert.equal(checkpoint.savedBeforeAnyDraft, true)
assert.equal(hash(checkpoint.solutions.path), checkpoint.solutions.sha256)
const draftPath = path.join(out, language, 'draft.json')
const command = [
  'python3', '-B', path.join(root, '.agents/skills/ld-s10y-choice/scripts/validate.py'),
  '--repo', item.repository, '--seed', item.seed.path, '--draft', draftPath,
]
const folder = path.join(out, 'validation-initial', language)
fs.mkdirSync(folder, { recursive: true })
const startedUtc = new Date().toISOString()
const proc = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: out },
})
const stdout = path.join(folder, 'stdout.txt')
const stderr = path.join(folder, 'stderr.txt')
fs.writeFileSync(stdout, proc.stdout || '', { flag: 'wx' })
fs.writeFileSync(stderr, proc.stderr || '', { flag: 'wx' })
const receiptPath = path.join(folder, 'receipt.json')
fs.writeFileSync(receiptPath, `${JSON.stringify({
  command, startedUtc, finishedUtc: new Date().toISOString(),
  exitCode: proc.status, signal: proc.signal, error: proc.error?.message || null,
  seed: item.seed, canonicalSeedDigest: item.canonicalSeedDigest, draft: bound(draftPath),
  stdout: bound(stdout), stderr: bound(stderr), attempt: 1, automaticRetries: 0,
  reviewSupplied: false, structuralOnly: true, semanticReview: 'PENDING-LOCKE',
  sourceHoldsNotClearedByExitZero: true, newImageOpens: 0,
  scratchInsideStagedRepoUsed: false, sourceJSONOrSeedWritten: false,
}, null, 2)}\n`, { flag: 'wx' })
for (const input of [item.seed, ...item.authority]) assert.equal(hash(input.path), input.sha256)
console.log(JSON.stringify({
  language, receipt: bound(receiptPath), exitCode: proc.status,
  semanticReview: 'PENDING', newImages: 0,
}, null, 2))
process.exitCode = proc.status === 0 ? 0 : 1
