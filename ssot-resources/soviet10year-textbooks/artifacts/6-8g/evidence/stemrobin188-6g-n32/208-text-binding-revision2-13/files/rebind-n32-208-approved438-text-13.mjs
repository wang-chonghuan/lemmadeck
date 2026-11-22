import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { core6g, retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'n32-208-text-binding-revision2-13')
fs.mkdirSync(own)
const originalSpec = path.join(core6g, 'editions/modern-us-neutral/figures/fig-208.spec.json')
const originalSVG = path.join(core6g, 'editions/modern-us-neutral/figures/fig-208.svg')
const originalRender = path.join(core6g, 'editions/modern-us-neutral/figures/fig-208.render.json')
const originalReview = path.join(core6g, 'editions/modern-us-neutral/figures/fig-208.review.json')
const priorContextFile = path.join(tmp, 'n32-fig207208-author-first-10/fig-208.context.json')
const template = path.join(tmp, 'n32-438-modern-submarkers-revision1-13/exercises.template.json')
const proofManifest = path.join(tmp, 'source167168-first-and166438-affected-review-13/manifest.json')
assert.equal(hash(proofManifest), 'a77062de4b0adf753f6ca2cc4029725b5955be29857e74a367311cbb9f69738f')
assert.ok(read(proofManifest).scopeC.disposition.startsWith('PASS'))
assert.equal(hash(template), '5ad97637caff38ecc7f76ff6704e9e8300e051711d184065c6b79543008a3138')
const text = read(template).exercises.find(item => item.number === '438').text
const priorSpec = read(originalSpec)
const spec = structuredClone(priorSpec)
assert.equal(spec.source.authoritativeText.length, 1)
assert.equal(spec.source.authoritativeText[0].exercise, '438')
const beforeText = spec.source.authoritativeText[0].text
spec.source.authoritativeText[0].text = text
const restored = structuredClone(spec)
restored.source.authoritativeText[0].text = beforeText
assert.deepEqual(restored, priorSpec)
const priorContext = read(priorContextFile)
const context = structuredClone(priorContext)
assert.equal(context.authoritativeText[0].text, beforeText)
context.authoritativeText[0].text = text
context.textPaths[1] = bind(template)
const contextFile = path.join(own, 'context.json')
const specFile = path.join(own, 'fig-208.spec.json')
save(contextFile, context)
save(specFile, spec)
const references = [
  bind(originalSpec), bind(originalSVG), bind(originalRender), bind(originalReview),
  bind(priorContextFile), bind(template), bind(proofManifest),
  bind(contextFile), bind(specFile),
]
function run(name, argv) {
  const startedAt = new Date().toISOString()
  const result = spawnSync(argv[0], argv.slice(1), { cwd: repo, encoding: 'utf8' })
  const streams = {}
  for (const stream of ['stdout', 'stderr']) {
    const file = path.join(own, `${name}.${stream}`)
    fs.writeFileSync(file, result[stream] ?? '', { flag: 'wx' })
    streams[stream] = bind(file)
  }
  const receipt = path.join(own, `${name}.execution.json`)
  save(receipt, {
    cwd: repo, argv, stdin: null, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, streams,
  })
  references.push(bind(receipt), ...Object.values(streams))
  assert.equal(result.status, 0, name)
  return bind(receipt)
}
const validateReceipt = run('validate', [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py', specFile, '--stage', 'draft',
])
const svgFile = path.join(own, 'fig-208.svg')
const renderFile = path.join(own, 'fig-208.render.json')
const renderReceipt = run('render', [
  'node', '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '--spec', specFile, '--svg', svgFile, '--report', renderFile,
])
assert.equal(read(renderFile).status, 'pass')
assert.equal(hash(svgFile), hash(originalSVG))
references.push(bind(svgFile), bind(renderFile))
const record = {
  status: '208_CHANGED_TEXT_BINDING_NATIVE_PASS_AFFECTED_REVIEW_PENDING',
  changedSpec: bind(specFile), changedContext: bind(contextFile),
  changedTemplate: bind(template),
  changedSpecLeaves: ['/source/authoritativeText/0/text'],
  changedContextLeaves: ['/authoritativeText/0/text', '/textPaths/1/path', '/textPaths/1/sha256'],
  beforeText, afterText: text,
  geometryLabelsAssertionsSourceInventoryAndDisplayUnchanged: true,
  svgByteIdentical: true, oldSVG: bind(originalSVG), changedSVG: bind(svgFile),
  originalReview: bind(originalReview), validateReceipt, renderReceipt,
  existingIndependentSourceMathVisualPASSReused: true,
  independentText438PASS: bind(proofManifest),
  contentRevisions: { prior208: 1, current208: 2, newGeometryRevisions: 0, newTextBindingRevisions: 1 },
  originalFIRSTsFailuresUnknownsAndCountersPreserved: true,
  sourceOrScreenshotImagesOpened: false, independentAffectedBindingReviewPending: true,
  currentReviewAt1NotYetWritten: true, canonicalAssetsReplaced: false,
  parentImageLoads: 0, activeExecSessions: [], wholeLessonApproved: false,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
const inputsFile = path.join(own, 'affected-review-inputs.json')
save(inputsFile, {
  status: 'AFFECTED_BINDING_ONLY_READY_NOT_DISPATCHED',
  scope: '208 current authoritative exercise438 text and its template/context/spec/render bindings only',
  record: bind(recordFile), oldSpec: bind(originalSpec), newSpec: bind(specFile),
  oldContext: bind(priorContextFile), newContext: bind(contextFile),
  reviewedTemplate: bind(template), textReviewManifest: bind(proofManifest),
  oldSVG: bind(originalSVG), newSVG: bind(svgFile), currentRender: bind(renderFile),
  originalReview: bind(originalReview), validateReceipt, renderReceipt,
  instructions: 'Zero images. Reuse valid original208 source/math/native/mobile PASS and approved438 presentation PASS. Verify only updated authoritativeText/context template binding, exact spec/context leaf differences, all geometry/inventory/label/display fields unchanged, byte-identical SVG and current changed-spec native receipts. Do not reopen source/pixels or repeat validator/render/width checks. Preserve208 previous1/current2 cumulative revisions; new geometry0. No full-lesson/source identity or other-figure approval. New review@1/promotion waits for this affected binding verdict.',
})
references.push(bind(recordFile), bind(inputsFile), bind(path.join(tmp, 'rebind-n32-208-approved438-text-13.mjs')))
console.log(JSON.stringify({
  inputs: bind(inputsFile), candidateSpec: bind(specFile),
  retention: retainCurrent6g(
    'evidence/stemrobin188-6g-n32/208-text-binding-revision2-13',
    references,
    [
      'evidence/stemrobin188-6g-n32/approved207208-assets12/retention.json',
      'evidence/stemrobin188-6g-n32/approved207208-recordings12/retention.json',
      'evidence/stemrobin188-6g-source167168/independent-review13/retention.json',
    ],
    record,
  ),
}))
