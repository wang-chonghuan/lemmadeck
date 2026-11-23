import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), W)
const ROOT = '.intentfold/tickets/STEMROBIN-188/tmp/n37-fig229231-author7'
const B = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g'
const E = `${B}/editions/modern-us-neutral/figures`
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const binding = (file, durablePath) => ({
  path: path.resolve(file), sha256: hash(file),
  ...(durablePath ? { durablePath } : {}),
})
const save = (name, data) => {
  assert(!name.includes('..'))
  fs.writeFileSync(`${ROOT}/${name}`, `${JSON.stringify(data, null, 2).replace(
    /[\u007f-\uffff]/g,
    (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`,
  )}\n`)
}
const receipt = load(`${ROOT}/author-receipt.json`)
assert.equal(receipt.status, 'AUTHOR_ONLY')
assert.equal(receipt.cwd, W)
assert.equal(receipt.imageCounters.batchTotal, 4)
assert.equal(receipt.sourceFirst.sha256, hash(`${ROOT}/SOURCE-FIRST.md`))
assert.equal(fs.statSync(`${ROOT}/SOURCE-FIRST.md`).mode & 0o777, 0o444)

const ids = ['fig-229', 'fig-230', 'fig-231']
const figures = ids.map((id) => {
  const spec = load(`${ROOT}/${id}.spec.json`)
  const native = load(`${ROOT}/${id}.render.producer.json`)
  const relocated = load(`${ROOT}/${id}.render.json`)
  assert.equal(native.status, 'pass')
  assert.equal(relocated.status, 'pass')
  assert.equal(spec.source.image.path, `${B}/figures/${id}.png`)
  assert.equal(spec.source.image.sha256, hash(spec.source.image.path))
  assert.equal(native.spec.sha256, hash(`${ROOT}/${id}.spec.json`))
  assert.equal(native.output.svg.sha256, hash(`${ROOT}/${id}.svg`))
  assert.equal(relocated.spec.path, `${E}/${id}.spec.json`)
  assert.equal(relocated.output.svg.path, `${E}/${id}.svg`)
  const expected = structuredClone(native)
  expected.spec.path = relocated.spec.path
  expected.output.svg.path = relocated.output.svg.path
  assert.deepEqual(relocated, expected, 'Only spec.path and output.svg.path may relocate')
  for (const stage of ['validate-draft', 'validate-rendered']) {
    assert(receipt.executions.some((run) => run.figure === id && run.stage === stage && run.exitCode === 0))
  }
  assert.equal(spec.display.purpose, 'instructional')
  assert(spec.source.inventory.every((group) => group.requires.includes('pointRelationships')))
  assert(!spec.assertions.some((item) => item.type === 'equalDistance'))
  return {
    id, status: 'AUTHOR_ONLY', mode: 'deterministic', purpose: 'instructional',
    source: binding(spec.source.image.path, spec.source.image.path),
    spec: binding(`${ROOT}/${id}.spec.json`, `${E}/${id}.spec.json`),
    svg: binding(`${ROOT}/${id}.svg`, `${E}/${id}.svg`),
    render: binding(`${ROOT}/${id}.render.json`, `${E}/${id}.render.json`),
    originalProducer: binding(`${ROOT}/${id}.render.producer.json`),
    preview: binding(`${ROOT}/${id}.preview.png`),
    nativeChecks: {
      draftValidation: 'pass', renderedValidation: 'pass', render: native.status,
      collisions: native.collisions.length,
      widths: native.displayChecks.map((check) => check.width),
      measuredMinimumTextPx: Math.min(...native.displayChecks.map((check) => check.measuredMinPx)),
      objects: native.objects, labels: native.labels, assertions: spec.assertions.length,
    },
    independentReview: 'required; no author semantic approval or promotion',
  }
})

const failedAt = `${ROOT}/failures/fig-229-render-native-2`
const firstFailure = load(`${failedAt}/fig-229.spec.json`)
const repaired = load(`${ROOT}/fig-229.spec.json`)
assert.deepEqual(firstFailure.assertions, repaired.assertions)
const stripPlacements = (spec) => spec.objects.map(({ labelPlacement, ...object }) => object)
assert.deepEqual(stripPlacements(firstFailure), stripPlacements(repaired))
const failures = [
  {
    figure: 'fig-229', stage: 'render-native', exitCode: 2,
    diagnosis: 'upper-A1 and lower-O label/stroke clearance',
    files: ['spec.json', 'svg', 'render.producer.json', 'preview.png'].map(
      (suffix) => binding(`${failedAt}/fig-229.${suffix}`),
    ),
    repair: receipt.repairs[0].repair,
    geometryAndAssertionsUnchanged: true,
    repairedNativeExitCode: 0,
  },
]

receipt.imageCounters = {
  ...receipt.imageCounters, candidatePreviewOpens: 3,
  failedPreviewOpens: 1, batchTotal: 7, contextTotal: 7,
  unusedBatchAllowance: 1, unusedContextAllowance: 17,
}
receipt.imageEvents = [
  ...ids.map((id, index) => ({
    sequence: index + 1, role: 'original', ...binding(`${B}/figures/${id}.png`),
    opens: 1, countedTotalAfter: index + 1,
  })),
  {
    sequence: 4, role: 'actual native failure inspection',
    ...binding(`${failedAt}/fig-229.preview.png`), opens: 1, countedTotalAfter: 4,
  },
  ...ids.map((id, index) => ({
    sequence: index + 5, role: 'final candidate preview',
    ...binding(`${ROOT}/${id}.preview.png`), opens: 1, countedTotalAfter: index + 5,
  })),
]
receipt.nativeFailures = failures
receipt.captureFailures = []
receipt.contentReviewFailures = []
receipt.independentSemanticReview = 'not performed by AUTHOR; required before promotion'
receipt.authorPreviewObservations = [
  { figure: 'fig-229', observation: 'Final preview opened once after clearance repair; six labels, two acute-angle arcs and O -> O1 arrow visible.' },
  { figure: 'fig-230', observation: 'Final preview opened once; eight labels, two rows and increasing M-Q-P-N transversal visible; no angle markings added.' },
  { figure: 'fig-231', observation: 'Final preview opened once; eight point labels, visible D junction and only the given alpha arc right/below B; C remains C and speck role remains UNKNOWN.' },
]
receipt.browserLifecycle = {
  implementation: `${SKILL_PATH()}/scripts/render_spec.mjs`,
  mode: 'isolated headless existing Playwright',
  closure: 'Each native invocation awaited browser.close() in finally; all producer commands terminated.',
  commandProcessesStillRunning: 0,
}
receipt.authorScript = binding(`${ROOT}/author.mjs`)
receipt.finalizationScript = binding(`${ROOT}/finalize.mjs`)
receipt.finalizedAt = new Date().toISOString()
save('author-receipt.json', receipt)

const manifest = {
  status: 'AUTHOR_ONLY', ticket: 'STEMROBIN-188', lesson: 'geo68-c3-s2-n37',
  scope: 'N37 fig-229/230/231 only', cwd: W, outputRoot: path.resolve(ROOT),
  durableBookRoot: B, durableFigureRoot: E,
  sourceFirst: { ...binding(`${ROOT}/SOURCE-FIRST.md`), mode: '0444', originalOpensBeforeSeal: 3 },
  figures,
  receipt: binding(`${ROOT}/author-receipt.json`),
  failures,
  imageCounters: receipt.imageCounters,
  usage: receipt.usage,
  uncertainties: [
    'Original glyph alphabet remains UNKNOWN from pixels; modern names are mathematical text mappings, not inferred source alphabets.',
    'fig-231 pixel a/alpha glyph remains UNKNOWN as a source observation; approved exercise text supplies Greek alpha for the modern figure.',
    'fig-231 C-speck role remains UNKNOWN; no prime, point, label, incidence, or relationship is invented.',
  ],
  metadataRelocation: 'Native producers retained; final reports change only spec.path and output.svg.path to durable edition destinations. No path-only rerenders.',
  approvalBoundary: 'Native mechanical PASS is not semantic approval. Parent may promote only after independent reviewer. Text approval is not image approval.',
  forbiddenActionsPerformed: [],
}
save('manifest.json', manifest)
console.log(JSON.stringify({
  status: manifest.status,
  figures: figures.map((figure) => ({
    id: figure.id, spec: figure.spec.sha256, svg: figure.svg.sha256, render: figure.render.sha256,
  })),
  manifest: binding(`${ROOT}/manifest.json`),
  sourceFirst: manifest.sourceFirst,
  receipt: manifest.receipt,
  imageCounters: manifest.imageCounters,
}, null, 2))

function SKILL_PATH() {
  return '.agents/skills/ld-s10y-image'
}
