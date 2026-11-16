import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const work = '.tmp/STEMROBIN-181/9p-d019-n67-figures'
const originalFreezePath = '.intentfold/tickets/STEMROBIN-181/tmp/d019-n67-figures-author-freeze.json'
const proseFreezePath = '.intentfold/tickets/STEMROBIN-181/tmp/9p-n67-prose-freeze.json'
const templatePath = '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s2-n67/lesson.template.json'
const finalContextPath = `${work}/context-final.json`
const reportPath = '.intentfold/tickets/STEMROBIN-181/tmp/d019-n67-figures-context-binding.json'
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
function writeNew(file, value) {
  assert(!fs.existsSync(file), `Preserve existing file: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
function diff(a, b, target = '') {
  if (JSON.stringify(a) === JSON.stringify(b)) return []
  if (a && b && typeof a === 'object' && typeof b === 'object' && Array.isArray(a) === Array.isArray(b)) {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])]
      .flatMap(key => diff(a[key], b[key], `${target}/${key}`))
  }
  return [{ target, before: a, after: b }]
}

assert.equal(sha(originalFreezePath), '8a77060194159a76977289672f8f3a208be30e592455c45e682469d5f30cb6fc')
assert.equal(sha(proseFreezePath), 'a462ebbd3ce735bc66b772351298dee9e102e3e9ede1130667af57aa508b2d1b')
assert.equal(sha(templatePath), '30f4103b6a77e244fed668e9a463cd0f47419cc9d89e3a0999c6ef76714ed78d')
const originalFreeze = load(originalFreezePath)
const oldContextPath = originalFreeze.figures[0].bindings.context.path
const oldContext = load(oldContextPath)
const before = load(oldContext.edition.snapshot.path)
const after = load(templatePath)
const proseFreeze = load(proseFreezePath)
assert.equal(sha(oldContext.edition.snapshot.path), oldContext.edition.binding.sha256)
assert.deepEqual(proseFreeze.bindings.lessonTemplate, bind(templatePath))
assert.equal(sha(oldContext.canonicalSource.binding.path), oldContext.canonicalSource.binding.sha256)

const deltas = diff(before, after)
assert.deepEqual(deltas.map(item => item.target), ['/prose/1/text', '/prose/4/text'])
assert.equal(after.prose[1].text, before.prose[1].text.replace('；\n\n一次', '；\n一次'))
assert.equal(
  after.prose[4].text,
  before.prose[4].text.replace('试探电荷$q$的力矢量除以带符号的电荷量$q$', '试探电荷q的力矢量除以带符号的电荷量q'),
)
const semanticText = text => text.replace(/\$q\$/g, 'q').replace(/\s+/g, '')
for (const index of [1, 4]) assert.equal(semanticText(before.prose[index].text), semanticText(after.prose[index].text))
const relevant = [3, 6, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 24, 25, 26, 27, 28, 30, 31, 32]
for (const index of relevant) assert.deepEqual(before.prose[index], after.prose[index])

const preserved = new Map()
function preserve(binding) {
  assert.equal(sha(binding.path), binding.sha256, `Frozen evidence changed: ${binding.path}`)
  preserved.set(binding.path, binding)
}
preserve(bind(originalFreezePath))
preserve(oldContext.edition.snapshot)
preserve(oldContext.canonicalSource.snapshot)
for (const key of ['inventoryTrace', 'authorHelper', 'rendererRuntimeOverride', 'preservedRuntimeFailure', 'preservedRuntimeBridgeBeforeFix', 'authorObservations']) {
  preserve(originalFreeze[key])
}
for (const figure of originalFreeze.figures) {
  for (const [key, binding] of Object.entries(figure.bindings)) {
    if (key !== 'lesson') preserve(binding)
  }
  for (const preview of figure.previewImages) preserve({ path: preview.path, sha256: preview.sha256 })
}

const contextFinal = {
  ...oldContext,
  edition: {
    binding: bind(templatePath),
    data: after,
    authorFreeze: bind(proseFreezePath),
    originalCapturedBinding: oldContext.edition.binding,
    originalCapturedSnapshot: oldContext.edition.snapshot,
    authorStatus: proseFreeze.status,
  },
  supersedesContext: bind(oldContextPath),
  rebindScope: 'Full final lesson context only. Original source, FigureSpec, native render, SVG, PNG and author pixel observations remain byte-identical.',
  authoritativeText: [
    { lesson: after.id, text: after.printed_title },
    ...after.prose.filter(block => block.text?.trim()).map(block => ({ lesson: after.id, text: block.text })),
  ],
  independentFigureApproval: false,
}
writeNew(finalContextPath, contextFinal)
const report = {
  ticket: 'STEMROBIN-181', batch: 'D019', lesson: after.id,
  role: 'figure-author-context-only-rebind',
  status: 'context-rebound-awaiting-main-unique-independent-figure-gate',
  bindings: {
    originalAuthorFreeze: bind(originalFreezePath),
    finalProseFreeze: bind(proseFreezePath),
    originalContext: bind(oldContextPath),
    effectiveContext: bind(finalContextPath),
    capturedLessonSnapshot: oldContext.edition.snapshot,
    finalLessonTemplate: bind(templatePath),
    helper: bind(`${work}/context-rebind.mjs`),
  },
  deltaCheck: {
    status: 'pass-context-equivalence-only',
    exactChangedPaths: deltas.map(item => item.target),
    deltas,
    classifications: [
      { target: '/prose/1/text', change: 'One paragraph-separating blank line removed; no words, symbols or scientific propositions changed.' },
      { target: '/prose/4/text', change: 'Two narrative $q$ wrappers removed; q names the same signed test charge. No equation, condition or proposition changed.' },
    ],
    allOtherTemplateFieldsStructurallyUnchanged: true,
    allOther31ProseBlocksExact: true,
    changedBlockSemanticsEqualAfterOnlyWhitespaceAndNarrativeQWrapperNormalization: true,
    rawSourceSnapshotsRefsAndErrataUnchanged: true,
    figureBlocksCaptionsAndReferencesExact: true,
    conditionsAndSignedSymbolsUnchanged: true,
    equationBodiesAndEquationLabelsUnchanged: true,
    exactRawMathTokenSequenceClaimedAcrossRemovedNarrativeWrappers: false,
    focusedFigureSemantics: [
      { id: 'fig-113', unchangedBlocks: [9, 11, 12, 13, 14, 15], judgment: 'Positive/negative source-charge radial field direction, negligible probe disturbance, positive-probe convention, material/model conditions and symbols unchanged.' },
      { id: 'fig-114', unchangedBlocks: [22, 24, 25, 26, 27, 28, 30, 31, 32], judgment: 'Fixed source distribution, common observation point, component indices, signed charge/vector relations, vector sum and parallelogram-not-trajectory meaning unchanged.' },
    ],
  },
  figures: originalFreeze.figures.map(figure => ({
    id: figure.id,
    contextKind: 'lesson',
    status: 'author-candidate-context-rebound-not-approved',
    contextMapping: { from: figure.bindings.context, to: bind(finalContextPath) },
    lessonMapping: { from: figure.bindings.lesson, to: bind(templatePath) },
    bindings: {
      source: figure.bindings.source,
      context: bind(finalContextPath),
      lesson: bind(templatePath),
      spec: figure.bindings.spec,
      render: figure.bindings.render,
      svg: figure.bindings.svg,
      png: figure.bindings.fullPNG,
      previews: figure.bindings.previews,
    },
    originalSpecAuthorityBindingRetained: oldContext.edition.binding,
    effectiveAuthorityOverride: 'Use context-final and final lesson binding together with the preserved original spec/render/output bindings. This report does not rewrite or impersonate a new native render.',
    repairsUsed: figure.repairsUsed,
    nativeRenderAndAuthorPixelObservationsInheritedWithoutRepeating: true,
    independentFigurePASSInherited: false,
    newImageOpensOrRenders: 0,
  })),
  preservedEvidence: [...preserved.values()],
  newPixelOrSourceInspection: false,
  renderInvocation: false,
  scienceGateRepeated: false,
  independentApproval: false,
  promotionOrDurableOrAuthorPackageEdits: false,
  nextAssignment: 'Wait for Main n68 final freeze and dispatch; no n68 active context or figures constructed.',
  inFlightProcesses: [],
}
writeNew(reportPath, report)
for (const binding of preserved.values()) preserve(binding)
assert.equal(sha(templatePath), contextFinal.edition.binding.sha256)
console.log(JSON.stringify({ report: bind(reportPath), contextFinal: bind(finalContextPath), status: report.status, figures: report.figures.map(figure => figure.id), inFlightProcesses: [] }, null, 2))
