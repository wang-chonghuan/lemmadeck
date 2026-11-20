import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const R = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const W = path.join(R, '.intentfold/tickets/STEMROBIN-188/tmp/n66-figure9899-author-01')
assert.equal(process.cwd(), R)
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
function metadata(file) {
  const absolute = path.resolve(file)
  const bytes = fs.readFileSync(absolute)
  return {
    path: absolute, sha256: hash(bytes), bytes: bytes.length,
    mode: (fs.statSync(absolute).mode & 0o7777).toString(8).padStart(4, '0'),
  }
}
function write(file, value) {
  assert.ok(file.startsWith(`${W}/`))
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o444 })
  fs.chmodSync(file, 0o444)
  return metadata(file)
}
const inventory = load(path.join(W, 'source-inventory.json'))
const before = load(path.join(W, 'inputs-before.json')).inputs
const after = before.map(item => metadata(item.path))
for (let n = 0; n < before.length; n++) {
  assert.equal(after[n].sha256, before[n].sha256, `Input changed: ${after[n].path}`)
  assert.equal(after[n].bytes, before[n].bytes)
  assert.equal(after[n].mode, before[n].mode)
}
const afterBinding = write(path.join(W, 'inputs-after.json'), {
  schema: 'stemrobin188-figure-author-input-bindings@1',
  capturedAt: new Date().toISOString(), inputs: after, allInputsByteAndModeUnchanged: true,
})
const attempts = load(path.join(W, 'native-attempts-FIRST.json'))
const repair = load(path.join(W, 'fig-g10-99.repair-after.json'))
assert.equal(repair.status, 'native-draft-and-render-pass-author-only')
const perFigure = ['fig-g10-98', 'fig-g10-99'].map(id => {
  const spec = metadata(path.join(W, `${id}.spec.json`))
  const first = metadata(path.join(W, `${id}.spec-FIRST.json`))
  assert.equal(first.mode, '0444')
  assert.equal(spec.mode, '0644')
  const render = load(path.join(W, `${id}.render.json`))
  const svg = metadata(path.join(W, `${id}.svg`))
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, spec.sha256)
  assert.equal(render.output.svg.sha256, svg.sha256)
  assert.equal(path.resolve(R, render.spec.path), spec.path)
  assert.equal(path.resolve(R, render.output.svg.path), svg.path)
  assert.equal(render.collisions.length, 0)
  assert.equal(render.displayChecks.length, 1)
  assert.equal(render.displayChecks[0].width, 640)
  assert.equal(render.displayChecks[0].status, 'pass')
  assert.equal(render.displayChecks[0].measuredMinPx, 24)
  const standalone = id === 'fig-g10-98'
    ? [`${id}.draft-validate-FIRST-receipt.json`]
    : [`${id}.draft-validate-FIRST-receipt.json`, `${id}.draft-validate-repair1-receipt.json`]
  const rendering = id === 'fig-g10-98'
    ? [`${id}.render-FIRST-receipt.json`]
    : [`${id}.render-FIRST-receipt.json`, `${id}.render-repair1-receipt.json`]
  for (const file of standalone) assert.equal(load(path.join(W, file)).exitCode, 0)
  const source = inventory.figures.find(f => f.id === id)
  return {
    figure: id,
    status: 'authored-native-pass-with-source-glyph-and-independent-review-HOLDs',
    inputOriginal: after.find(a => a.path === source.source.path),
    independentPixelInventory: source,
    outputs: { first, spec, svg, render: metadata(path.join(W, `${id}.render.json`)) },
    nativeEvidence: {
      draftValidationStandalone: standalone.map(file => metadata(path.join(W, file))),
      rendering: rendering.map(file => metadata(path.join(W, file))),
      finalStatus: render.status,
      collisionCount: render.collisions.length,
      objects: render.objects, labels: render.labels, displayChecks: render.displayChecks,
    },
    substantiveRepairs: id === 'fig-g10-99' ? 1 : 0,
    technicalRecoveries: 0,
    failures: id === 'fig-g10-99' ? [{
      phase: 'render-FIRST', exitCode: 2, category: 'content-label-layout',
      collision: { id: '99-b-label', text: 'b', position: 'SE', score: 10000 },
      receipt: metadata(path.join(W, `${id}.render-FIRST-receipt.json`)),
      failedSvg: metadata(path.join(W, `${id}.render-FIRST-failed.svg`)),
      failedRender: metadata(path.join(W, `${id}.render-FIRST-failed.json`)),
      originalSpec: first,
      resolvedBy: 'One apply_patch change: 99-b.labelPlacement.offset from absent to [0,16]. Geometry, assertions, label text and font sizes unchanged.',
    }] : [],
    holds: [
      ...source.uncertainties.map(u => ({ ...u, category: 'source-glyph', cleared: false })),
      {
        id: `${id}-independent-review-not-authorized`,
        category: 'approval-boundary',
        description: 'Native draft/render pass is author evidence only. No rendered image was visually inspected, no independent mathematical/cultural review or review@1 approval was performed. Promotion and publication are not authorized.',
        cleared: false,
      },
    ],
    renderedImagesVisuallyInspectedByAuthor: false,
    independentReviewAt1: null,
    approved: false, published: false,
  }
})
const contracts = [
  'AGENTS.md', '.intentfold/readme.md', '.intentfold/project.json',
  '.intentfold/charter/product.md', '.intentfold/charter/engineering.md',
  '.intentfold/charter/operations.md', '.intentfold/charter/ui.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/routing.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs',
].map(file => metadata(path.join(R, file)))
const setup = write(path.join(W, 'setup-directory-observation.json'), {
  schema: 'stemrobin188-setup-execution-receipt@1',
  cwd: R,
  command: ['ls', '-ld', '.intentfold/tickets/STEMROBIN-188/tmp/n66-figure9899-author-01'],
  exitCode: 1, stdout: '',
  stderr: 'ls: .intentfold/tickets/STEMROBIN-188/tmp/n66-figure9899-author-01: No such file or directory\n',
  interpretation: 'Owned output directory did not yet exist before first authoring. apply_patch created it. This is setup evidence, not content failure, scientific rejection or a substantive spec repair.',
})
const report = write(path.join(W, 'author-report.json'), {
  schema: 'stemrobin188-bounded-modern-figure-author-report@1',
  role: 'figure-author-only',
  assignment: 'Authorized offline SAME188-6 STEMROBIN-188 N66 first author figures 98 and 99',
  repository: R, outputRoot: W, completedAt: new Date().toISOString(),
  status: 'author-work-complete-native-pass-review-and-source-glyph-HOLDs-remain',
  inputs: {
    before, after, allInputsByteAndModeUnchanged: true,
    beforeEvidence: metadata(path.join(W, 'inputs-before.json')),
    afterEvidence: afterBinding,
    scope: 'Only figure9899.json, its complete current lesson/exercises snapshots, its listed source admission/full source lesson and its two exact original PNGs. No paths inside source-admission bindings were followed.',
    currentEditionTextStatus: 'draft; text review pending. Included verbatim, not independently approved.',
    sourceAdmissionInheritedLimitations: load(before.find(i => i.path.endsWith('/source-admission.json')).path).inheritedLimitations,
  },
  authoritativeText: {
    includedWholeCurrentLessonAndExercises: true,
    draftEvidence: metadata(path.join(W, 'draft-authoring.json')),
    noAnswerKeysConsulted: true,
  },
  sourceInventory: metadata(path.join(W, 'source-inventory.json')),
  imageUsage: inventory.imageUsage,
  figures: perFigure,
  modernRegularization: inventory.modernRegularization,
  repairs: [metadata(path.join(W, 'fig-g10-99.repair-before.json')), metadata(path.join(W, 'fig-g10-99.repair-after.json'))],
  failuresPreserved: perFigure.flatMap(f => f.failures),
  setupReceipt: setup,
  nativeCalls: {
    figure98: { standaloneDraftValidation: 1, renderer: 1, rendererInternalDraftValidation: 1 },
    figure99: { standaloneDraftValidation: 2, renderer: 2, rendererInternalDraftValidation: 2 },
    totalStandaloneDraftValidation: 3, totalRenderer: 3, totalRendererInternalDraftValidation: 3,
    reasonForExtraFigure99Calls: 'Only the one permitted targeted substantive label repair after preserved FIRST render failure.',
    substantiveSpecRepairs: 1, technicalRecoveryRetries: 0,
    firstAttemptEvidence: metadata(path.join(W, 'native-attempts-FIRST.json')),
    noNativeIndependentReviewCalls: true,
  },
  readOnlyContractAndNativeToolBindings: contracts,
  prohibitionCompliance: {
    allWritesInsideOwnedRoot: true, applicationChanges: 0, gitWrites: 0,
    envFilesRead: 0, databaseConnections: 0, installs: 0, paidModelCalls: 0,
    externalNetworkCalls: 0, messagesToOtherChatsOrAgents: 0,
    otherTicketOutputsReadBeyondListedInputs: 0,
    previousFigureSpecsAnswersReviewsOrHistoricalPackagesRead: 0,
    renderedImageLoads: 0, independentVisualReviews: 0,
    independentNativeReviewAt1Approvals: 0, adaptFinalizeCalls: 0, publisherCalls: 0,
  },
  holds: [
    { id: 'text-review-pending', category: 'inherited', cleared: false, description: 'Current edition text snapshots remain draft; mathematical source content was declared unchanged by text author, not approved here.' },
    { id: 'source-glyph-identity', category: 'source', cleared: false, description: 'Provisional oval origin glyphs, exact vector accents and Figure 99 oblique basis/phi glyphs are explicitly unresolved. No conventions substituted as established source facts.' },
    { id: 'independent-figure-review', category: 'approval-boundary', cleared: false, description: 'Required independent source/edition/render visual and mathematical/cultural review is not authorized for this author. The perspective regularization and full source fidelity remain for that review.' },
    { id: 'lesson-integration-product-promotion-publication', category: 'out-of-scope', cleared: false, description: 'No lesson manifest integration, offline full-lesson/product surface approval, durable promotion or publication performed. Ticket temporary render paths are author evidence only.' },
  ],
  independentReviewer: false,
  figuresApproved: false, wholeLessonApproved: false, published: false,
})
const entries = fs.readdirSync(W).sort().filter(name => name !== 'output-index.json').map(name => {
  const file = path.join(W, name)
  assert.ok(fs.statSync(file).isFile(), 'Output index expects only files in this owned root')
  return metadata(file)
})
const index = write(path.join(W, 'output-index.json'), {
  schema: 'stemrobin188-bounded-modern-figure-author-output-index@1',
  role: 'figure-author-only', outputRoot: W, sealedAt: new Date().toISOString(),
  status: 'sealed-author-only',
  outputs: entries,
})
const sealed = load(index.path)
assert.ok(Array.isArray(sealed.outputs))
assert.equal(sealed.outputs.length, entries.length)
assert.ok(!sealed.outputs.some(o => o.path === index.path))
for (const item of sealed.outputs) {
  assert.ok(path.isAbsolute(item.path) && item.path.startsWith(`${W}/`))
  assert.match(item.sha256, /^[a-f0-9]{64}$/)
  assert.match(item.mode, /^[0-7]{4}$/)
  assert.ok(Number.isInteger(item.bytes) && item.bytes > 0)
  assert.deepEqual(metadata(item.path), item)
}
assert.equal(index.mode, '0444')
console.log(JSON.stringify({
  index, report, indexedOutputs: entries.length,
  figures: perFigure.map(f => ({ id: f.figure, ...f.outputs, substantiveRepairs: f.substantiveRepairs })),
  ownActualImageLoads: { source: 2, rendered: 0, other: 0, total: 2 },
  nativeStatus: 'Both pass; 24 px at 640 px, no collisions',
  approval: 'HOLD: unresolved source glyphs and independent review; not promoted or published',
}, null, 2))
