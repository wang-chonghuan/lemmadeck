import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const findings = JSON.parse(fs.readFileSync(path.join(own, 'author-pixel-findings.json'), 'utf8'))
assert.equal(findings.status, 'author-pass')
for (const figure of findings.figures) {
  const initial = path.join(own, figure.id, 'initial')
  const width = path.join(own, figure.id, figure.id === 'fig-229' ? 'repair-1' : 'initial', 'width-preview-report.json')
  assert.equal(JSON.parse(fs.readFileSync(width)).status, 'pass')
  const review = path.join(initial, 'author-review.json')
  assert.ok(!fs.existsSync(review))
  const command = [
    path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
    path.join(own, 'record-cached-review.py'), figure.id,
    `AUTHOR-ONLY initial pixel review after independent source inventory, complete approved Chinese/English lessons and both solved examples were read. ${figure.sourceFidelity} ${figure.widthEvidence} ${figure.resolvedInitialFailure || 'No repairs.'} Native record-review writer uses the already-completed hash-exact native validation/render gate, checking bindings without re-evaluating geometry. This is not independent FIG/SCI approval, running-product acceptance, promotion or full-card completion. Path rebinding later preserves this initial review as history.`,
  ]
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8' })
  fs.writeFileSync(path.join(initial, 'record-author-review-command.json'), JSON.stringify({
    command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
    firstAuthorPixelReview: true, beforeFinalPathRebinding: true, independentApproval: false,
    nativeRecordReviewWriter: true, completedNativeGeometryGateConsumedByExactHash: true,
    freshGeometryAssertions: 0, sourceSpecRenderAndMediaHashesChecked: true,
  }, null, 2) + '\n', { flag: 'wx' })
  console.log(result.stdout)
  assert.equal(result.status, 0, result.stdout + result.stderr)
}
