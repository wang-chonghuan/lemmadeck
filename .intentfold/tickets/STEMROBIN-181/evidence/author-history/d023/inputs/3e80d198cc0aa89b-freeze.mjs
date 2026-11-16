import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const out = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const repo = path.resolve(out, '../../../../..')
const local = (...parts) => path.join(out, ...parts)
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const binding = file => ({ path: file, sha256: sha(file) })
const shaText = text => crypto.createHash('sha256').update(text).digest('hex')
const inputs = read(local('context/input-bindings.json'))
for (const entry of Object.values(inputs)) assert.equal(sha(entry.path), entry.sha256, `current input drift: ${entry.path}`)
assert.equal(inputs.science.sha256, 'dd8ee4ca44944096803e2650424160076fa6bfa2a8eeff6f4733d68ffee150f0')
assert.equal(inputs.correctedFreeze.sha256, '6aafb2f19b3dc708a2ea6f332aa48b626013eb31e1faa0b75935bce2c86674f3')
const lesson = read(inputs.lesson.path)
const context = read(local('context/context.json'))
const spec = read(local('spec/repair.json'))
const render = read(local('render/repair.json'))
const previews = read(local('previews/metrics.json'))
const observations = read(local('observations/author-observations.json'))
const text = [lesson.printed_title, ...lesson.prose.map(block => block.text).filter(Boolean)].join('\n\n')
const authoritativeText = [{ lesson: lesson.id, text }]
assert.deepEqual(spec.source.authoritativeText, authoritativeText)
assert.deepEqual(context.authoritativeText, authoritativeText)
assert.equal(context.lessons[0].authoritativeText, text)
assert.equal(context.lessons[0].printed_title, lesson.printed_title)
assert.deepEqual(context.completeLesson, lesson)
assert.deepEqual(read(local('context/lesson.template.json')), lesson)
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, sha(local('spec/repair.json')))
assert.equal(render.output.svg.sha256, sha(local('svg/repair.svg')))
assert.equal(previews.status, 'pass')
assert.equal(previews.browser.headless, true)
assert.equal(previews.browser.closed, true)
assert.equal(previews.bindings.svg.sha256, sha(local('svg/repair.svg')))
assert.deepEqual(previews.results.map(item => item.width), [640, 331, 342])
for (const item of previews.results) {
  assert.equal(sha(item.screenshot.path), item.screenshot.sha256)
  assert.equal(item.status, 'pass')
  assert.ok(item.metrics.minTextPx >= 16)
}
assert.equal(observations.imageOpens.total, 4)
assert.equal(observations.nativeExecution.targetedRepairs, 1)
assert.equal(observations.scope.reviewAt1FilesWritten, 0)
const initialSpec = read(local('spec/initial.json'))
const repairPlan = read(local('commands/repair-plan.json'))
const restoredSpec = structuredClone(spec)
for (const edit of repairPlan.changes) {
  const object = restoredSpec.objects.find(item => item.id === edit.object)
  assert.deepEqual(object.at, edit.after)
  object.at = edit.before
}
assert.deepEqual(restoredSpec, initialSpec)
assert.equal(read(local('commands/source-content-checks.json')).spec.sha256, sha(local('spec/initial.json')))
assert.equal(read(local('render/initial.json')).status, 'fail')
for (const { nativeAssertions = [], contentAssertions = [] } of observations.sourceFactExecutableMappings) {
  for (const id of nativeAssertions) assert.ok(spec.assertions.some(item => item.id === id))
  for (const id of contentAssertions) assert.ok(read(local('commands/source-content-checks.json')).checks.some(item => item.id === id && item.status === 'pass'))
}
function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap(entry => entry.isDirectory() ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)])
}
const freezePath = local('authored-freeze.json')
assert.ok(!fs.existsSync(freezePath))
const artifacts = files(out).map(binding)
const payload = {
  schema: 'd023-n92/figure-authored-freeze@1',
  ticket: 'STEMROBIN-181',
  batch: 'D023',
  lesson: lesson.id,
  figure: 'fig-172',
  role: 'AUTHOR',
  status: 'author-pass-awaiting-independent-review',
  date: '2026-11-16',
  authoredAt: new Date().toISOString(),
  bindings: {
    sourceImage: inputs.source,
    context: binding(local('context/context.json')),
    nativeContextInitial: binding(local('context/native-context-initial.json')),
    lessonTemplate: inputs.lesson,
    frozenFullLesson: binding(local('context/lesson.template.json')),
    exercisesTemplate: inputs.exercises,
    inventory: binding(local('inventory/inventory.json')),
    pixelMeasurements: binding(local('inventory/source-pixel-measurements.json')),
    spec: binding(local('spec/repair.json')),
    render: binding(local('render/repair.json')),
    svg: binding(local('svg/repair.svg')),
    scienceEffectiveReview: inputs.science,
    correctedProseFreeze: inputs.correctedFreeze,
    previews: previews.results.map(item => ({ width: item.width, ...item.screenshot })),
    previewMetrics: binding(local('previews/metrics.json')),
    previewFixture: binding(local('previews/fixture.html')),
    observations: binding(local('observations/author-observations.json')),
    contentAssertionsInitial: binding(local('commands/source-content-checks.json')),
    repairPlan: binding(local('commands/repair-plan.json')),
    initialSpec: binding(local('spec/initial.json')),
    initialRenderFailure: binding(local('render/initial.json')),
    initialSvg: binding(local('svg/initial.svg')),
    commands: artifacts.filter(item => item.path.startsWith(local('commands/'))),
    nativeTools: ['build_context.py', 'validate_spec.py', 'render_spec.mjs', 'materialize_arrowheads.mjs']
      .map(name => binding(path.join(repo, '.agents/skills/ld-s10y-image/scripts', name))),
  },
  fullAuthoritativeText: {
    sha256: shaText(text),
    printed_title: lesson.printed_title,
    proseBlocks: lesson.prose.length,
    paragraphBlocks: lesson.prose.filter(block => block.kind === 'p').length,
    captions: lesson.prose.filter(block => block.kind === 'cap').length,
    exercises: 0,
    canonical: '[lesson.printed_title, ...lesson.prose.map(block => block.text).filter(Boolean)].join("\\n\\n")',
    contextAndSpecExactlyMatchCurrentCanonical: true,
    currentLessonMatchesEffectiveSCIAndCorrectionFreeze: true,
  },
  sourceContentEvidence: {
    initialExecutableContentAssertions: 'pass',
    appliesToSelectedRepairedSpec: true,
    reason: 'Exact structural restoration proves repair changed only five tick text-anchor positions. The initial source-content assertions remain applicable; no source, science, prose, or normalization replay was run.',
    measuredUpperTraceColumns: 248,
    allSourceFactsMapped: true,
    labels: 'English and mathematical symbols only',
    colors: 'semantic roles only',
    historicalTemperature: '4.1 K is the original reported mercury value, not a universal critical temperature.',
    noInferredVerticalValuesOrFabricatedLowTemperatureCutoff: true,
  },
  display: {
    purpose: 'instructional', layout: 'inline', maxWidthPx: 640, minTextPx: 16,
    intendedWidths: [640, 331, 342],
    measuredMinTextPx: previews.results.map(item => ({ width: item.width, px: item.metrics.minTextPx })),
  },
  execution: {
    imageOpens: observations.imageOpens,
    native: observations.nativeExecution,
    previewCaptures: 3,
    previews: 'isolated HEADLESS existing app Playwright; PWDEBUG unset; PLAYWRIGHT_HTML_OPEN never; browser closed',
    preliminaryPixelInspectionRuns: 1,
    boundPixelMeasurementRuns: 1,
    initialFailureAndRepairOutputsPreserved: true,
  },
  authorApproval: {
    status: 'pass',
    scope: 'Source inventory, deterministic author assertions, native render and the three once-opened isolated previews only.',
    independentReviewerRequired: true,
    independentlyReviewed: false,
    promotable: false,
    reviewAt1: null,
  },
  scope: observations.scope,
  artifacts,
}
fs.writeFileSync(freezePath, `${JSON.stringify(payload, null, 2)}\n`)
console.log(JSON.stringify({
  freeze: binding(freezePath), status: payload.status,
  imageOpens: 4, native: payload.execution.native, previews: payload.bindings.previews,
}, null, 2))
