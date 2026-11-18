import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.dirname(fileURLToPath(import.meta.url))
assert.equal(own, `${repo}/.intentfold/tickets/STEMROBIN-181/tmp/d708-n80-fig190191192-first-author`)
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (name, value) => {
  const file = path.resolve(own, name)
  assert.ok(file.startsWith(`${own}/`) && !fs.existsSync(file))
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const firstMapping = read(`${own}/source-to-spec.json`)
for (const item of firstMapping.inputs) assert.equal(hash(item.path), item.sha256)
const sourceInventory = read(`${own}/source-inventory.json`)
const report = {
  schema: 'stemrobin181/bounded-first-author-report@1',
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n80',
  cwd: repo, ownedDirectory: own, completedAt: new Date().toISOString(),
  status: 'STOPPED-TERMINAL-FAIL-FIG191192',
  imageAccounting: {
    batchCount: 1, sourceOpens: 3, nativeOpens: 1, contextPayloadsTotal: 4,
    generatedNativePngs: 1, crops: 0, reopens: 0, batchLimit: 8, contextLimit: 24,
    plannedPayloads: 6,
    shortfallReason: 'fig191/192 terminal render failures stopped dependent media/visual stages.',
  },
  boundaries: {
    paidCalls: 0, newAgents: 0, messages: 0, fullTests: 0,
    canonicalChanges: false, toolingChanges: false, meterChanges: false,
    indexChanges: false, gitOperations: false, backendOperations: false,
    databaseOperations: false, independentRecordReview: false,
    promotion: false, wholeCardApproved: false,
  },
  holds: ['d703 modern text pending', 'Independent figure review not performed',
    'No whole-card acceptance', 'fig191/192 terminal render FAIL after sole repair'],
  sourceInventory: bind(`${own}/source-inventory.json`),
  inventoryMetadataCorrection: bind(`${own}/source-inventory-metadata-correction.json`),
  frozenInputsAndFirstMapping: bind(`${own}/source-to-spec.json`),
  humanReport: bind(`${own}/report.md`),
  figures: [],
}
for (const id of ['fig-190', 'fig-191', 'fig-192']) {
  const original = sourceInventory.figures.find(item => item.id === id)
  assert.equal(hash(original.image.path), original.image.sha256)
  const first = `${own}/${id}/first`
  const repaired = `${own}/${id}/repair1`
  const spec = read(`${repaired}/spec.json`)
  const nativeRender = read(`${repaired}/render.json`)
  assert.equal(nativeRender.spec.sha256, hash(`${repaired}/spec.json`))
  assert.equal(nativeRender.output.svg.sha256, hash(`${repaired}/figure.svg`))
  const sourcePoints = firstMapping.figures.find(item => item.id === id).sourcePointIds
  const relationships = spec.assertions.filter(item => ['collinear', 'displacement', 'equalDistance', 'parallel', 'connects'].includes(item.type))
  const mappedPointRelations = sourcePoints.map(pointId => ({
    pointId,
    inventoryGroups: spec.source.inventory.filter(group => group.objects.includes(pointId)).map(group => ({
      groupId: group.id,
      assertions: relationships.filter(item => group.assertions.includes(item.id) &&
        ['a', 'b', 'c', 'd', 'point', 'from', 'to'].some(key => item[key] === pointId)).map(item => item.id),
    })),
  }))
  const figure = {
    id, source: bind(original.image.path),
    imageOpens: { source: 1, native: id === 'fig-190' ? 1 : 0, total: id === 'fig-190' ? 2 : 1 },
    sourcePoints, mappedPointRelations,
    sourceInventoryGroups: spec.source.inventory,
    repairsUsed: 1, maximumRepairs: 1,
    first: {
      spec: bind(`${first}/spec.json`), failure: bind(`${first}/outcome.json`),
      validation: bind(`${first}/validate.receipt.json`),
      ...(fs.existsSync(`${first}/render.receipt.json`) ? { renderReceipt: bind(`${first}/render.receipt.json`) } : {}),
      ...(fs.existsSync(`${first}/render.json`) ? { render: bind(`${first}/render.json`), svg: bind(`${first}/figure.svg`) } : {}),
    },
    repair1: {
      repairReceipt: bind(`${repaired}/repair.receipt.json`),
      spec: bind(`${repaired}/spec.json`),
      validation: bind(`${repaired}/validate.receipt.json`),
      renderReceipt: bind(`${repaired}/render.receipt.json`),
      render: bind(`${repaired}/render.json`),
      svg: bind(`${repaired}/figure.svg`), outcome: bind(`${repaired}/outcome.json`),
      nativeRenderStatus: nativeRender.status, collisions: nativeRender.collisions,
      nativeDisplayChecks: nativeRender.displayChecks,
    },
    sourcePointCoverageValidator: 'native-draft-pass',
    independentReview: false, promotion: false, wholeCardApproved: false,
  }
  assert.equal(read(`${repaired}/validate.stdout.txt`).status, 'pass')
  if (id === 'fig-190') {
    assert.equal(nativeRender.status, 'pass')
    const media = read(`${repaired}/media-640.receipt.json`)
    assert.equal(media.image.sha256, hash(`${repaired}/native-640.png`))
    assert.ok(media.styleEvidence.actualRayStrokes.every(item => item.found && !item.dash))
    assert.ok(media.styleEvidence.geometry.some(item =>
      item.id === 'ld-fig-190_ld-modern-eye-lens-plane' && item.dash === '5,5'))
    figure.status = 'NATIVE-PASS-FIRST-AUTHOR-OBSERVED-NOT-INDEPENDENTLY-APPROVED'
    figure.repair1.nativeMedia = bind(`${repaired}/media-640.receipt.json`)
    figure.repair1.nativePng = bind(`${repaired}/native-640.png`)
    figure.authorObservation = {
      imageOpens: 1, image: bind(`${repaired}/native-640.png`),
      observed: [
        'A/B upright at left; A1/B1 inverted between objective and eyepiece; A2/B2 upright on the retinal plane.',
        'Both solid forward ray paths pass through A1 and emerge parallel before simplified eye refraction.',
        'F1/F2 brackets, objective focus marks and English apparatus names are legible at 640 px.',
        'Dashed eye-lens plane is visibly distinct from solid rays and source geometry.',
        'No visually overlapping labels or broken raster; this is author observation only.',
      ],
      mathematicalReviewAuthority: 'not independent; no record_review invoked',
    }
  } else {
    assert.equal(nativeRender.status, 'fail')
    assert.deepEqual(nativeRender.collisions.map(item => item.id), ['M-label', 'N-label'])
    assert.ok(!fs.existsSync(`${repaired}/native-640.png`))
    figure.status = 'TERMINAL-NATIVE-RENDER-FAIL'
    figure.stoppedAt = 'native-render; M/N labels collide; no second repair or dependent visual check'
  }
  report.figures.push(figure)
}
write('report.json', report)
const files = []
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(file)
    else if (entry.isFile()) files.push(file)
  }
}
walk(own)
files.sort()
write('artifact-hashes.json', {
  schema: 'stemrobin181/artifact-hashes@1',
  root: own, selfExcluded: true, artifacts: files.map(bind),
})
console.log(JSON.stringify({
  status: report.status, imageAccounting: report.imageAccounting,
  reports: ['report.md', 'report.json', 'artifact-hashes.json'].map(name => bind(`${own}/${name}`)),
}, null, 2))
