import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const findings = read(path.join(own, 'author-pixel-findings.json'))
assert.equal(findings.status, 'author-pass')
for (const figure of findings.figures) {
  const out = path.join(own, figure.id, 'initial')
  assert.equal(read(path.join(out, 'width-preview-report.json')).status, 'pass')
  assert.equal(read(path.join(out, 'author-assertions.json')).status, 'pass')
  const reviewFile = path.join(out, 'author-review.json')
  assert.ok(!fs.existsSync(reviewFile))
  const command = [
    path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
    path.join(repo, '.agents/skills/ld-s10y-image/scripts/record_review.py'),
    '--spec', path.join(out, 'spec.json'), '--render', path.join(out, 'render.json'),
    '--output', reviewFile, '--status', 'pass',
    '--notes', `AUTHOR ONLY; independent FIG review pending. Fresh original inventory plus both complete approved Chinese and English lessons and both solved examples were read. ${figure.sourceFidelity} ${figure.widthEvidence} No targeted repairs. This review is not new SCI, promotion, publication or full-card completion.`,
  ]
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 180000 })
  fs.writeFileSync(path.join(out, 'record-author-review-command.json'), `${JSON.stringify({
    command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr, error: result.error?.message || null,
    nativeRecordReviewWriter: true, role: 'author-only', pendingIndependent: true,
  }, null, 2)}\n`, { flag: 'wx' })
  console.log(result.stdout)
  assert.equal(result.status, 0, result.stdout + result.stderr)
}
