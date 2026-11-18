import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const out = path.dirname(fileURLToPath(import.meta.url))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const read = name => JSON.parse(fs.readFileSync(path.join(out, name), 'utf8'))
const save = (name, value) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const bindings = read('input-bindings.json')
for (const input of bindings.inputs) assert.equal(hash(input.path), input.sha256, input.path)
const opens = read('actual-opens.json')
assert.equal(opens.opens.length, 3)
assert.equal(opens.budget.cumulativeContextImages, 18)
for (const open of opens.opens) assert.equal(hash(open.path), open.sha256)
const initial = read('initial/receipt.json')
const final = read('repair-1/receipt.json')
assert.equal(initial.exitCode, 2)
assert.equal(final.exitCode, 0)
for (const receipt of [initial, final]) {
  for (const output of receipt.outputs) assert.equal(hash(output.path), output.sha256)
}
const initialSpec = read('initial/fig-134.spec.json')
const finalSpec = read('repair-1/fig-134.spec.json')
const differences = []
for (let i = 0; i < initialSpec.objects.length; i++) {
  if (JSON.stringify(initialSpec.objects[i]) !== JSON.stringify(finalSpec.objects[i])) differences.push(initialSpec.objects[i].id)
}
assert.deepEqual(differences, ['modern-origin-label'])
assert.deepEqual(initialSpec.assertions, finalSpec.assertions)
assert.equal(hash(path.join(out, 'fig-134.spec.json')), hash(path.join(out, 'repair-1/fig-134.spec.json')))
const render = read('repair-1/fig-134.render.json')
assert.equal(render.status, 'pass')
assert.equal(render.collisions.length, 0)
assert.deepEqual(render.displayChecks.map(item => item.width), [342, 640])
const report = {
  schema: 'bounded-n67-fig134-first-author-report@1', ticket: 'STEMROBIN-181', batch: 'D033',
  card: 'phy10-c2-s2-n67', figure: 'fig-134',
  status: 'AUTHORED-NATIVE-PASS-INDEPENDENT-REVIEW-PENDING',
  role: 'First modern-figure author, not independent reviewer',
  sourceContext: bound(path.join(out, 'source-context.json')),
  inputBindings: bound(path.join(out, 'input-bindings.json')),
  pixelInventory: bound(path.join(out, 'source-inventory.json')),
  geometryEvidence: bound(path.join(out, 'geometry-evidence.json')),
  actualOpens: bound(path.join(out, 'actual-opens.json')),
  finalAuthorOutputs: {
    spec: bound(path.join(out, 'repair-1/fig-134.spec.json')),
    svg: bound(path.join(out, 'repair-1/fig-134.svg')),
    render: bound(path.join(out, 'repair-1/fig-134.render.json')),
  },
  native: {
    initialExitCode: 2, initialStatus: 'FAIL', initialReceipt: bound(path.join(out, 'initial/receipt.json')),
    finding: bound(path.join(out, 'repair-finding.json')), repairCount: 1,
    repairExitCode: 0, repairStatus: 'pass', repairReceipt: bound(path.join(out, 'repair-1/receipt.json')),
    stableRenderer: 'Unmodified existing JSXGraph renderer, 1.13.1',
    originalFailedSpecSvgReportAndLogsPreserved: true,
    onlyChangedObject: 'modern-origin-label',
    displayChecks: render.displayChecks, collisions: render.collisions,
  },
  authorPreviewObservations: {
    scope: 'First author visual inspection only, not an independent visual/SCI/cultural/display gate',
    widthsActuallyOpenedOnce: [342, 640],
    observations: [
      'One common left vertex and six outward boundary rays retained.',
      'Noncircular six-corner outline is an arbitrary example, not a circular-cone-only model.',
      'Sphere has the common vertex as its center; R reaches the sphere silhouette.',
      'S leader ends on the shaded curved sphere patch, not the arbitrary planar region.',
      'Omega marks the direction family and the displayed definition is Omega = S / R squared.',
      'All nine English/mathematical labels visible; no clipping or label overlap observed at either author-preview width.',
    ],
    previewReceipt: bound(path.join(out, 'preview-receipt.json')),
    productScreenshotAcceptancePerformed: false,
  },
  sourceVersusModernAdditions: read('source-inventory.json').modernAdditionsSeparateFromPixels,
  imageBudget: {
    inherited: 15, newImages: 3, cumulativeSameAgentContextImages: 18,
    batchMaximum: 5, contextMaximum: 24, reset: false, parentImagesOpened: 0, reopens: 0,
    check: '15 + 3 = 18 <= 24',
  },
  pending: {
    independentModernFigureReview: 'HOLD-NOT-REVIEWED',
    affectedSCIAndZHENTextReview: 'pending; original semantic PASS retained, not repeated here',
    historicalEntityDeclaration: 'HOLD-N67-TEXT-F05 retained',
    wholeCardDisplayAcceptance: 'not performed',
    source177IndependentReview: 'This agent was its author and cannot be its independent reviewer',
  },
  preservation: {
    allInputHashesUnchanged: true, sourcePngUnchanged: true,
    allHistoricalFAILHOLDAndPaidOutputsPreserved: true,
    writesOnlyD257: true, stableSkillRendererOrCanonicalEdited: false,
    lessonFinalizedOrPromoted: false, independentReviewRecorded: false,
    sharedMeterIndexDatabaseGitDeployOrAgentsUsed: false,
  },
}
save('report.json', report)
const artifacts = []
function walk(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(folder, entry.name)
    if (entry.isDirectory()) walk(p)
    else artifacts.push(bound(p))
  }
}
walk(out)
const freeze = {
  schema: 'bounded-n67-fig134-first-author-freeze@1', ticket: 'STEMROBIN-181', batch: 'D033',
  status: report.status, role: report.role, frozenUtc: new Date().toISOString(),
  immutablePolicy: 'Create once; do not update author outputs after this freeze.',
  artifacts, report: bound(path.join(out, 'report.json')), actualOpens: bound(path.join(out, 'actual-opens.json')),
  finalAuthorOutputs: report.finalAuthorOutputs,
  imageBudget: report.imageBudget, initialFAILPreserved: true, repairCount: 1,
  independentReview: 'HOLD-NOT-REVIEWED', promoted: false,
}
save('author-freeze.json', freeze)
fs.chmodSync(path.join(out, 'author-freeze.json'), 0o444)
console.log(JSON.stringify({ status: report.status, freeze: bound(path.join(out, 'author-freeze.json')), report: freeze.report, actualOpens: freeze.actualOpens, finalAuthorOutputs: report.finalAuthorOutputs, cumulativeImages: 18 }, null, 2))
