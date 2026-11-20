import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, core, read, bind, save } from './retain-scoped-evidence-02.mjs'

const lesson = 'geo910-c2-s3-n60'
const manifestPath = path.join(tmp, 'n60-modern-text-review-inputs-01/manifest.json')
const manifest = read(manifestPath)
const [editionLesson, editionExercises] = manifest.candidates
const sourceRetentionPath = path.join(core, 'evidence/stemrobin188-g10-n60/source/bindings.json')
const sourceRetention = read(sourceRetentionPath)
const contracts = read(manifest.figureContractsOnly.path)
assert.deepEqual(contracts.figures.map(f => f.id),
  Array.from({ length: 6 }, (_, i) => `fig-g10-${77 + i}`))
for (const numbers of [[77, 78], [79, 80], [81, 82]]) {
  const output = path.join(tmp, `n60-fig${numbers.join('')}-author-inputs-01`)
  assert.ok(!fs.existsSync(output), output)
  fs.mkdirSync(output)
  const figures = numbers.map(number => {
    const id = `fig-g10-${number}`
    const from = path.join(tmp, 'g10-n60/artifacts/9-10g/figures', `${id}.png`)
    const retained = sourceRetention.bindings.find(b => b.from === from)
    assert.ok(retained, from)
    const sourceImage = bind(path.join(core, retained.retained))
    const originalContract = contracts.figures.find(f => f.id === id)
    assert.equal(sourceImage.sha256, originalContract.source.png.sha256)
    const contextPath = path.join(output, `${id}.context.json`)
    save(contextPath, {
      schema: 'stemrobin188-closed-candidate-figure-context@1',
      status: 'draft-context-closed-text-candidates-not-independent-text-or-figure-approved',
      ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g',
      lesson, edition: 'modern-us-neutral', figure: id,
      sourceImage, editionLesson, editionExercises,
      completeEditionProse: read(editionLesson.path).prose,
      completeEditionExercises: read(editionExercises.path).exercises,
      sourceHolds: manifest.sourceHolds,
      originalContract,
      authoritativeRule: 'Closed modern text candidates supply mathematical roles; original PNG supplies visual structure. Fresh pixel FIRST inventory is mandatory before any spec, even for reuse. Never infer an unreadable label from symmetry or answers.',
      figure79Routing: 'Industrial parts identity is a semantic illustration, not permission to hand-roll a deterministic object substitute. If generated/hybrid artwork is required, paid/model-service calls are prohibited; return a local route HOLD.',
      figure80UnresolvedLabel: 'HOLD; never infer B1 or silently omit an inventoried unresolved source point label.',
      figure82LeadingGlyph: 'Preserve C-like source glyph uncertainty; no conventional circumference substitution or claimed codepoint resolution.',
      textRepairBudgetExhausted: true, sourceRepairAuthorized: false,
      independentTextApprovalPending: true, wholeLessonApproved: false,
    })
    return { id, sourceImage, context: bind(contextPath), originalContract }
  })
  save(path.join(output, 'manifest.json'), {
    schema: 'stemrobin188-bounded-figure-author-inputs@1',
    status: 'pending-bounded-author-only-independent-text-review-pending',
    ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g', lesson,
    figures, editionLesson, editionExercises, sourceHolds: manifest.sourceHolds,
    bindings: [editionLesson, editionExercises, manifest.figureContractsOnly,
      manifest.sourceAdmission, bind(sourceRetentionPath), bind(manifestPath),
      bind(new URL(import.meta.url).pathname),
      ...figures.flatMap(f => [f.sourceImage, f.context])],
    imagesPlanned: 6, hardImageLimit: 8, contextImageLimit: 24,
    displayWidths: [480, 300], displayMinTextPx: 16,
    freshPixelInventoriesRequired: true, contentRepairLimitPerFigure: 1,
    initialContentRepairsPerFigure: 0, sourceOrTextEditsAuthorized: false,
    paidAndModelServiceCallsAuthorized: false, semanticApproval: false,
    templatesApplied: false, wholeLessonApproved: false, published: false, parentImageLoads: 0,
  })
  console.log(JSON.stringify({ output, figures: numbers, bindings: 11, imagesPlanned: 6 }))
}
