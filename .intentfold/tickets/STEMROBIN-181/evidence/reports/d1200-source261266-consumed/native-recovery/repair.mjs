import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.dirname(new URL(import.meta.url).pathname)
const tmp = path.dirname(own)
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
}
const proofFile = path.join(tmp, 'd1192-counter-focused-proof/report.json')
assert.equal(sha(proofFile), '6c81f063979bba77ad0027f6dddc4a65ff42dc511c9dd6b4f8d766f1f1680f54')
const proof = read(proofFile)
assert.equal(proof.status, 'PASS')
assert.equal(sha(proof.layout.path), proof.layout.sha256)
save(path.join(own, 'started.json'), { stage: 'AFFECTED-FAILED-FINALIZE-ONLY', proof: bind(proofFile) })
const outputs = []
for (const [page, author] of [[261, 'd1131-source261-first-author'], [265, 'd1159-source265-first-author']]) {
  const number = String(page).padStart(4, '0')
  const sourceRoot = path.join(tmp, author, 'root/10p/pages', number)
  const sourceWork = path.join(tmp, author, 'work/10p/pages', number)
  const root = path.join(own, 'source' + page, 'root')
  const work = path.join(own, 'source' + page, 'work')
  const targetRoot = path.join(root, '10p/pages', number)
  const targetWork = path.join(work, '10p/pages', number)
  fs.cpSync(sourceRoot, targetRoot, { recursive: true, errorOnExist: true, force: false })
  fs.cpSync(sourceWork, targetWork, { recursive: true, errorOnExist: true, force: false })
  for (const directory of [targetRoot, targetWork]) {
    const writable = folder => {
      fs.chmodSync(folder, 0o755)
      for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
        const file = path.join(folder, entry.name)
        if (entry.isDirectory()) writable(file)
        else fs.chmodSync(file, 0o644)
      }
    }
    writable(directory)
  }
  const beforeJson = read(path.join(targetRoot, 'page.json'))
  const originalFiles = ['page.md', 'page.json', 'audit.json'].map(name => bind(path.join(sourceRoot, name)))
  const originalPixels = bind(path.join(sourceWork, 'page.png'))
  const cropBefore = page === 265 ? ['png', 'svg'].map(ext =>
    bind(path.join(targetWork, 'figures', 'fig-227.' + ext))) : []
  const native = path.join(own, 'source' + page, 'finalize-repair')
  const command = [
    'node', '.intentfold/tickets/STEMROBIN-181/tmp/record-offline-command.mjs', native,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
    '--book', '10p', '--page', String(page), '--root', root, '--work', work,
    '--pdf', 'ssot-resources/soviet10year-textbooks/sources/soviet10years/10p 苏联中学课本 物理 十年级 .pdf',
  ]
  const result = spawnSync(command[0], command.slice(1), {
    cwd: repo, encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024,
  })
  if (result.status !== 0) {
    save(path.join(own, 'source' + page, 'failure.json'), {
      exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
    })
    throw new Error(result.stdout + result.stderr)
  }
  const audit = read(path.join(targetRoot, 'audit.json'))
  assert.equal(audit.lines_printed, 24)
  assert.equal(audit.lines_md, 24)
  assert.deepEqual(audit.errors, [])
  assert.deepEqual(read(path.join(targetRoot, 'page.json')), beforeJson)
  originalFiles.forEach(item => assert.equal(sha(item.path), item.sha256))
  assert.equal(sha(originalPixels.path), originalPixels.sha256)
  assert.equal(sha(path.join(targetWork, 'page.png')), originalPixels.sha256)
  cropBefore.forEach(item => assert.equal(sha(item.path), item.sha256))
  outputs.push({
    page, status: 'PASS24/24', root, work, originalFiles, originalPixels,
    current: ['page.md', 'page.json', 'audit.json'].map(name => bind(path.join(targetRoot, name))),
    cropBytesUnchanged: cropBefore, nativeReceipt: bind(path.join(native, 'receipt.json')),
    sourceContentChanges: 0, sourcePixelEdits: 0, vectorizeReplays: 0,
    firstFailureRetainedAt: path.join(tmp, author),
  })
}
save(path.join(own, 'report.json'), {
  ticket: 'STEMROBIN-181', batch: 'D037', status: 'PASS',
  proof: bind(proofFile), outputs, failedFinalizeRecoveryCalls: 2,
  passedNativeReplays: 0, parentImageOpens: 0, paidCalls: 0,
  completeCard: false, sourceConsumption: false,
})
console.log(JSON.stringify({ report: bind(path.join(own, 'report.json')), status: 'PASS', outputs }))
