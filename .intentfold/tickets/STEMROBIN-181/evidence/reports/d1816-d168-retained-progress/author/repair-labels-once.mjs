import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const author = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d168-n5-figures23-author')
const figures = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d168/figures')
const bind = p => ({path: p, bytes: fs.statSync(p).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')})
const history = []
for (const id of ['fig-02', 'fig-03']) {
  const previousDir = path.join(figures, id, 'candidate-01')
  const previousSpec = path.join(previousDir, id + '.spec.json')
  const spec = JSON.parse(fs.readFileSync(previousSpec, 'utf8'))
  const render = JSON.parse(fs.readFileSync(path.join(previousDir, id + '.render.json'), 'utf8'))
  assert.equal(render.status, 'fail')
  assert.ok(render.collisions.length > 0)
  assert.ok(render.displayChecks.every(x => x.status === 'pass'))
  const changes = []
  const modify = (objectId, fields, reason) => {
    const object = spec.objects.find(x => x.id === objectId)
    assert.ok(object, objectId)
    const before = structuredClone(object)
    Object.assign(object, fields)
    changes.push({object: objectId, before, after: structuredClone(object), reason})
  }
  if (id === 'fig-02') {
    modify('f02-needle-label', {at: [263, 482], fontSize: 28},
      'Move the metal-needle label clear of the left bulb contour, retaining at least 16px text at 640px.');
    modify('f02-needle-leader', {from: [255, 507], to: [358, 552]},
      'Keep the existing annotation leader above its relocated label and targeting the same needle stem; no apparatus joint or scientific geometry changes.');
    modify('f02-ion-label', {at: [481, 480], fontSize: 28},
      'Place ion-path label in the clear lower-right interior rather than crossing the bulb boundary.');
    modify('f02-pump-label-1', {at: [150, 326]},
      'Separate the two English pump-label lines to eliminate the reported overlap.');
    modify('f02-pump-label-2', {at: [150, 278]},
      'Second line receives matching spacing and stays clear of the open sidearm.');
    const assertion = spec.assertions.find(x => x.id === 'f02-needle-leader-connects')
    const leader = spec.objects.find(x => x.id === 'f02-needle-leader')
    assertion.from = leader.from
    assertion.to = leader.to
  } else {
    modify('f03-B', {labelPlacement: {position: 'NE', offset: [0, -22]}},
      'Raise B label clear of the screen arc without moving B.');
    modify('f03-paths-label', {at: [654, 583]},
      'Increase spacing between the two helium-ion label lines.');
    modify('f03-R-label', {at: [149, 443]},
      'Visual diagnosis also found R touching its radius indicator; move only the label to its left.');
  }
  const currentDir = path.join(figures, id, 'candidate-02')
  assert.ok(!fs.existsSync(currentDir), 'Repair output already exists')
  fs.mkdirSync(currentDir, {recursive: true})
  const currentSpec = path.join(currentDir, id + '.spec.json')
  fs.writeFileSync(currentSpec, JSON.stringify(spec, null, 2) + '\n', {flag: 'wx'})
  history.push({
    figure: id, status: 'single-allowed-content-repair-used', stage: 'render-label-layout',
    inheritedRepairUsage: 0, TOTALRepairUsage: 1, maximumTOTALRepairs: 1,
    firstSpecCorrectionCount: 1, firstRenderFailureCount: 1,
    imageOpensBeforeRepair: 6, previousSpec: bind(previousSpec),
    failedRender: bind(path.join(previousDir, id + '.render.json')),
    failedOutput: bind(path.join(previousDir, id + '.svg')),
    failedPreviewOpened: bind(path.join(previousDir, id + '.preview.png')),
    nativeValidationPreviouslyPassed: true,
    currentSpec: bind(currentSpec), changes,
    scientificContentOrGeometryChanged: false,
    sourceFirstInventoriesChanged: false,
    independentReviewOrApproval: false,
    failedCallsAndOutputsPreserved: true
  })
}
fs.writeFileSync(path.join(author, 'repair-usage.json'), JSON.stringify({
  cwd, role: 'author-only', batch: 'D168', repairs: history,
  furtherContentRepairsAllowed: false
}, null, 2) + '\n', {flag: 'wx'})
console.log(JSON.stringify(history.map(x => ({figure: x.figure, repairUsage: x.TOTALRepairUsage, currentSpec: x.currentSpec})), null, 2))
