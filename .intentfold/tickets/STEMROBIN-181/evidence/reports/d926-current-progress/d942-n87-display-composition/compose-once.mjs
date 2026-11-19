import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const own = path.join(tmp, 'd942-n87-display-composition')
assert.ok(!fs.existsSync(path.join(own, 'report.json')), 'Composition is write-once')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hashes = new Map()
const sha = file => {
  if (!hashes.has(file))
    hashes.set(file, crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'))
  return hashes.get(file)
}
const bind = file => ({ path: file, sha256: sha(file) })
const captureDir = path.join(tmp, 'd910-n87-first-dom-capture')
const capture = read(path.join(captureDir, 'offline-report.json'))
assert.equal(capture.capture, 'PASS')
assert.equal(capture.checks.length, 16)
const plan = read(path.join(captureDir, 'visual-review-plan.json'))
const recipes = read(path.join(captureDir, 'crop-recipes.json')).recipes
assert.equal(recipes.length, 85)
const recipeMap = new Map(recipes.map(recipe => [recipe.id, recipe]))
assert.equal(recipeMap.size, 85)
const names = [
  'd927-n87-first-display-coverage01',
  'd935-n87-first-display-coverage02',
  'd936-n87-first-display-coverage03',
  'd938-n87-first-display-coverage04',
  'd939-n87-first-display-coverage05',
  'd940-n87-first-display-coverage06',
  'd941-n87-first-display-coverage07',
  'd943-n87-first-display-coverage08',
  'd944-n87-first-display-coverage09',
  'd945-n87-first-display-coverage10',
]
const inputs = [
  bind(path.join(captureDir, 'offline-report.json')),
  bind(path.join(captureDir, 'visual-review-plan.json')),
  bind(path.join(captureDir, 'crop-recipes.json')),
]
const targets = new Map()
const batches = []
let actualReviewerImageLoads = 0
function observations(report) {
  const found = []
  function visit(value) {
    if (!value || typeof value !== 'object') return
    if (typeof value.recipeId === 'string' &&
      [value.verdict, value.visualVerdict, value.recipeVerdict].some(item => typeof item === 'string')) {
      found.push(value)
      return
    }
    for (const child of Object.values(value)) visit(child)
  }
  visit(report)
  return found
}
function loadReport(name) {
  const file = path.join(tmp, name, 'report.json')
  const report = read(file)
  const binding = bind(file)
  inputs.push(binding)
  const usageFile = path.join(tmp, name, 'usage.json')
  if (fs.existsSync(usageFile)) inputs.push(bind(usageFile))
  return { report, binding, usage: fs.existsSync(usageFile) ? read(usageFile) : null }
}
function usageLoads(usage, recipeId) {
  if (!usage) return undefined
  const events = usage.loadEvents ?? usage.loads ??
    (Array.isArray(usage.imageLoads) ? usage.imageLoads : undefined)
  if (!Array.isArray(events)) return undefined
  const matching = events.filter(event => event.recipeId === recipeId)
  assert.equal(matching.length, 1, `Ambiguous load event ${recipeId}`)
  return matching[0].loads ?? matching[0].count
}
function addTarget(observation, binding, originalRecipe = true, usage = null) {
  const recipe = recipeMap.get(observation.recipeId)
  assert.ok(recipe, observation.recipeId)
  assert.ok(!targets.has(recipe.id), `Duplicate target ${recipe.id}`)
  const rectangle = observation.rectangle ?? observation.crop
  if (originalRecipe) assert.deepEqual(rectangle, recipe.crop)
  const imagePath = observation.path ?? observation.image ?? observation.crop?.path
  const imageSha = observation.sha256 ?? observation.crop?.sha256
  assert.ok(imagePath && imageSha, `Missing frozen image ${recipe.id}`)
  assert.equal(sha(imagePath), imageSha)
  if (observation.source) {
    assert.equal(observation.source.path, recipe.source.path)
    assert.equal(observation.source.sha256, recipe.source.sha256)
  }
  const loads = observation.imageLoads ?? observation.modelLoadCount ??
    observation.visualLoads ?? observation.loads ?? usageLoads(usage, recipe.id)
  assert.equal(loads, 1, `Expected one actual load for ${recipe.id}`)
  actualReviewerImageLoads += loads
  const originalVerdict = observation.verdict ?? observation.visualVerdict ?? observation.recipeVerdict
  const verdict = ['PASS', 'PASS-OBSERVED-PIXELS-ONLY'].includes(originalVerdict) ? 'PASS' : originalVerdict
  targets.set(recipe.id, {
    recipeId: recipe.id,
    verdict, originalVerdict,
    source: recipe.source,
    originalCrop: recipe.crop,
    observedCrop: rectangle,
    observedImage: { path: imagePath, sha256: imageSha },
    report: binding,
    affectedEvidenceReplacement: !originalRecipe,
    localizedFindings: observation.localizedFindings ?? observation.findings ?? [],
  })
}
for (const [index, name] of names.entries()) {
  const expected = plan.batches.find(batch => batch.id === `full-coverage-${index + 1}`)
  assert.ok(expected)
  const { report, binding, usage } = loadReport(name)
  assert.equal(typeof report.batchVerdict, 'string')
  assert.equal(report.completeCard, false)
  const reviewed = observations(report)
  assert.deepEqual(reviewed.map(item => item.recipeId).sort(), [...expected.recipeIds].sort())
  for (const observation of reviewed) addTarget(observation, binding, true, usage)
  batches.push({
    batch: expected.id, report: binding, targets: reviewed.length,
    reportedVerdict: report.batchVerdict,
    verdict: reviewed.every(item => targets.get(item.recipeId).verdict === 'PASS') ? 'PASS' : 'HOLD',
  })
}
assert.equal(targets.size, 77)
const firstDetail = loadReport('d923-n87-first-display-figure-detail')
assert.equal(firstDetail.report.status, 'FAIL')
assert.equal(firstDetail.report.productDisplayDefectProven, false)
const firstObservations = observations(firstDetail.report)
assert.equal(firstObservations.length, 8)
const failures = firstObservations.filter(item => item.verdict !== 'PASS')
assert.equal(failures.length, 2)
for (const observation of firstObservations.filter(item => item.verdict === 'PASS'))
  addTarget(observation, firstDetail.binding)
actualReviewerImageLoads += failures.length
const affected = loadReport('d931-n87-two-evidence-crop-affected-review')
assert.equal(affected.report.status, 'PASS')
assert.equal(affected.report.affectedOnly, true)
assert.deepEqual(affected.report.binding.firstIndependentFigureDetailReview.sha256,
  firstDetail.binding.sha256)
const affectedObservations = observations(affected.report)
assert.deepEqual(affectedObservations.map(item => item.recipeId).sort(),
  failures.map(item => item.recipeId).sort())
for (const observation of affectedObservations) addTarget(observation, affected.binding, false)
assert.equal(targets.size, 85)
assert.equal(actualReviewerImageLoads, 87)

const surfaces = []
for (const surface of plan.coverage) {
  const assigned = surface.recipeIds.map(id => targets.get(id))
  assert.ok(assigned.every(Boolean))
  const sourceInfo = plan.originalScreenshots.find(item => item.path === surface.screenshot.path)
  assert.ok(sourceInfo)
  const ordered = assigned.toSorted((a, b) => a.originalCrop.top - b.originalCrop.top)
  let bottom = 0
  for (const target of ordered) {
    assert.equal(target.originalCrop.left, 0)
    assert.equal(target.originalCrop.top, bottom)
    assert.equal(target.originalCrop.width, sourceInfo.dimensions.width)
    assert.deepEqual(target.source, surface.screenshot)
    bottom += target.originalCrop.height
  }
  assert.equal(bottom, sourceInfo.dimensions.height)
  surfaces.push({
    locale: surface.locale, surface: surface.surface, viewport: surface.viewport,
    screenshot: surface.screenshot, reviewedRecipeIds: surface.recipeIds,
    fullDocumentPixelCoverage: true,
    verdict: assigned.every(target => target.verdict === 'PASS') ? 'PASS' : 'HOLD',
  })
}
assert.equal(surfaces.length, 16)
const passedRecipeTargets = [...targets.values()].filter(item => item.verdict === 'PASS').length
const fullDISPLAY = passedRecipeTargets === 85 && surfaces.every(surface => surface.verdict === 'PASS')
const report = {
  schema: 'STEMROBIN-181/d942-display-evidence-composition@1',
  ticket: 'STEMROBIN-181', successor: 'successor181-3', card: 'phy10-c2-s3-n87',
  recordedAt: new Date().toISOString(),
  status: fullDISPLAY ? 'BILINGUAL-16SURFACE-DISPLAY-COMPOSED-PASS-NOT-PROMOTED' : 'DISPLAY-HOLD',
  evidenceCompositionOnly: true, independentVisualReviewReplayed: false,
  fullDISPLAY, completeCard: false,
  expectedRecipeTargets: 85, reviewedRecipeTargets: targets.size, passedRecipeTargets,
  fullCoverageTargets: 77, figureDetailTargets: 8, actualReviewerImageLoads,
  parentNewImages: 0, nativeCalls: 0, browserCaptures: 0, paidCalls: 0,
  originalFigureDetailFailures: {
    report: firstDetail.binding, historicalStatus: firstDetail.report.status,
    failedRecipeIds: failures.map(item => item.recipeId),
    failureKind: 'INCOMPLETE-EVIDENCE-WINDOWS-NOT-PROVEN-PAGE-DEFECTS',
    affectedResolution: affected.binding, originalEvidenceUnchanged: true,
  },
  firstCaptureTechnicalFailures: capture.firstFailuresPreserved,
  batches, surfaces, targets: [...targets.values()], inputs,
  limits: [
    'PASS applies to these unchanged offline native renders and client display views only.',
    'This composition does not replace SCI/source/figure/choice review or approve publication.',
    'The original capture and figure-detail failures remain immutable historical evidence.',
    'Complete-card readiness and canonical promotion are separate, unperformed operations.',
  ],
  gitIndexMeterPromotion: false, databasePublisherDeploy: false, testsBuild: false,
  backendSupervisorOtherChat: false, commitPush: false, handoff: false,
}
fs.mkdirSync(own, { recursive: true })
fs.writeFileSync(path.join(own, 'report.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' })
fs.writeFileSync(path.join(own, 'usage.json'), JSON.stringify({
  schema: 'STEMROBIN-181/d942-composition-usage@1',
  parentNewImages: 0, actualReviewerImageLoadsRetainedNotRepeated: actualReviewerImageLoads,
  nativeCalls: 0, browserCaptures: 0, paidCalls: 0, tokens: null, costUsd: null,
  currentStage: 'TEXT-ONLY-IMMUTABLE-EVIDENCE-COMPOSITION',
}, null, 2) + '\n', { flag: 'wx' })
fs.writeFileSync(path.join(own, 'freeze.json'), JSON.stringify({
  inputs, outputs: [bind(path.join(own, 'report.json')), bind(path.join(own, 'usage.json'))],
}, null, 2) + '\n', { flag: 'wx' })
const sums = ['report.json', 'usage.json', 'freeze.json'].map(name =>
  `${sha(path.join(own, name))}  ${name}`).join('\n') + '\n'
fs.writeFileSync(path.join(own, 'SHA256SUMS'), sums, { flag: 'wx' })
console.log(JSON.stringify({
  report: bind(path.join(own, 'report.json')), fullDISPLAY, completeCard: false,
  reviewedRecipeTargets: targets.size, passedRecipeTargets, actualReviewerImageLoads,
}))
