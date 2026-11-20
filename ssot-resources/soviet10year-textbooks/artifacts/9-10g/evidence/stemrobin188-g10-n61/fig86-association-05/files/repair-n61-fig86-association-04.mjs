import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const root = path.join(tmp, 'n61-fig86-affected-04')
assert.ok(!fs.existsSync(root), root)
fs.mkdirSync(root)
const beforePath = path.join(tmp, 'n61-fig8687-affected-02/fig-g10-86.repair3.spec.json')
const reportPath = path.join(tmp, 'known-affected-review-02/report.json')
assert.equal(read(reportPath).verdicts['fig86-current'].verdict, 'FAIL')
const before = read(beforePath)
const beforeSHA256 = hash(beforePath)
assert.equal(hash(before.source.image.path), before.source.image.sha256)
const current = structuredClone(before)
const guide = {
  id: 'A1-association-leader',
  type: 'segment',
  from: 'A1',
  to: [-1.64, 2.44],
  stroke: 'muted',
  strokeWidth: 1.5,
  dash: 0,
  description: 'Modern label guide, absent from the original. Identifies the unchanged upper-diameter/front-generator endpoint A1, not the nearby silhouette/rim junction. No new source edge, measurement or point is asserted.',
}
const connects = {
  id: 'A1-association-leader-connects',
  type: 'connects',
  arrow: guide.id,
  from: guide.from,
  to: guide.to,
}
current.objects.push(guide)
current.assertions.push(connects)
const specPath = path.join(root, 'fig-g10-86.repair4.spec.json')
save(specPath, current)
save(path.join(root, 'affected-change.json'), {
  before: bind(beforePath), after: bind(specPath), review: bind(reportPath),
  finding: 'F86-REPAIR3-A1-AMBIGUOUS-JUNCTION',
  changes: [guide, connects], originalSourceInventoryUnchanged: true,
  oldObjectsGeometryLabelsAssertionsUnchanged: true,
  priorContentRepairs: 3, newContentRepairs: 1, totalContentRepairs: 4,
  parentImageLedgerBeforeRender: {
    sourceOriginal86Loads: 1, previousCurrentDualWidthSheetUnits: 2,
    contextImageUnits: 3, batchImageUnits: 3,
  },
  sourceObservation: 'Original86 contains one frustum panel and the six labels A/B/O/A1/B1/O1. A1 denotes the upper chord/front generator junction inside the left side of the upper oval; the left silhouette touches the oval at a different unlabelled junction. No source leader, point dot, apex, values or angle marks. The current guide is an explicit modern addition only.',
  source: bind(before.source.image.path), parentIndependentReview: false,
  historicalFailuresAndUnknownsPreserved: true,
})
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
for (const [name, command, args] of [
  ['validate', python, ['-B', '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
    specPath, '--stage', 'draft', '--json']],
  ['render', 'node', ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    '--spec', specPath,
    '--svg', path.join(root, 'fig-g10-86.repair4.svg'),
    '--report', path.join(root, 'fig-g10-86.repair4.render.json')]],
]) {
  const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024 })
  save(path.join(root, `${name}.command.json`), {
    command, args, cwd: repo, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message,
  })
  assert.equal(result.status, 0, `${name}: ${result.stderr}`)
}
assert.equal(read(path.join(root, 'fig-g10-86.repair4.render.json')).status, 'pass')
assert.equal(hash(beforePath), beforeSHA256)
console.log(JSON.stringify({ root, native: 'pass', totalContentRepairs: 4,
  geometryAndLabelPlacementChanged: false, wholeLessonApproved: false }))
