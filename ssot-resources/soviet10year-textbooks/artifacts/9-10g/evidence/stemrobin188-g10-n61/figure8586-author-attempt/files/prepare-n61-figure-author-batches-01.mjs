import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, core, read, bind, save } from './retain-scoped-evidence-02.mjs'

const lesson = 'geo910-c2-s3-n61'
const manifestPath = path.join(tmp, 'n61-modern-text-review-inputs-01/manifest.json')
const manifest = read(manifestPath)
const admissionPath = path.join(tmp, 'n61-modern-text-admission-01.json')
const admission = read(admissionPath)
assert.equal(admission.status,
  'pass-for-modern-n61-text-only-with-inherited-source-and-procedural-holds')
const [editionLesson, editionExercises] = admission.candidates
const sourceRetentionPath = path.join(core, 'evidence/stemrobin188-g10-n61/source/bindings.json')
const sourceRetention = read(sourceRetentionPath)
const contracts = read(manifest.figureContractsOnly.path)
assert.deepEqual(contracts.figures.map(f => f.id), read(editionLesson.path).figures.map(f => f.id))
assert.equal(contracts.figures.length, 6)
for (let index = 0; index < contracts.figures.length; index += 2) {
  const group = contracts.figures.slice(index, index + 2)
  const output = path.join(tmp,
    `n61-fig${group.map(f => f.id.replace('fig-g10-', '')).join('')}-author-inputs-01`)
  assert.ok(!fs.existsSync(output), output)
  fs.mkdirSync(output)
  const figures = group.map(originalContract => {
    const id = originalContract.id
    const from = path.join(tmp, 'g10-n61/artifacts/9-10g/figures', `${id}.png`)
    const retained = sourceRetention.bindings.find(b => b.from === from)
    assert.ok(retained, from)
    const sourceImage = bind(path.join(core, retained.retained))
    assert.equal(sourceImage.sha256, originalContract.source.png.sha256)
    const contextPath = path.join(output, `${id}.context.json`)
    save(contextPath, {
      schema: 'stemrobin188-closed-candidate-figure-context@1',
      status: 'closed-text-semanticPASS-with-source-and-proceduralHOLDs-figure-unreviewed',
      ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g',
      lesson, edition: 'modern-us-neutral', figure: id, sourceImage,
      editionLesson, editionExercises,
      completeEditionProse: read(editionLesson.path).prose,
      completeEditionExercises: read(editionExercises.path).exercises,
      textAdmission: bind(admissionPath), sourceHolds: manifest.sourceHolds, originalContract,
      authoritativeRule: 'Complete closed edition text supplies mathematical roles; original PNG supplies visual structure. Inspect original and seal fresh pixel FIRST inventory before any spec. Preserve ambiguous labels and fine source relationships without deriving them from answers or symmetry.',
      sourceOrTextRepairsAuthorized: false, strictFIRSTProcessApproved: false,
      independentTextSemanticPASS: true, figureApproved: false, wholeLessonApproved: false,
    })
    return { id, sourceImage, context: bind(contextPath), originalContract }
  })
  const bindings = [editionLesson, editionExercises, manifest.figureContractsOnly,
    manifest.sourceAdmission, bind(sourceRetentionPath), bind(manifestPath),
    bind(admissionPath), bind(new URL(import.meta.url).pathname),
    ...figures.flatMap(f => [f.sourceImage, f.context])]
  save(path.join(output, 'manifest.json'), {
    schema: 'stemrobin188-bounded-figure-author-inputs@1',
    status: 'pending-bounded-author-only-text-semanticPASS-with-inheritedHOLDs',
    ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g', lesson,
    figures, editionLesson, editionExercises, sourceHolds: manifest.sourceHolds, bindings,
    imagesPlanned: 6, hardImageLimit: 8, contextImageLimit: 24,
    displayWidths: [480, 300], displayMinTextPx: 16,
    freshPixelInventoriesRequired: true, contentRepairLimitPerFigure: 1,
    initialContentRepairsPerFigure: 0, sourceOrTextEditsAuthorized: false,
    paidAndModelServiceCallsAuthorized: false, semanticApproval: false,
    strictFIRSTProcessApproved: false, templatesApplied: false,
    wholeLessonApproved: false, published: false, parentImageLoads: 0,
  })
  console.log(JSON.stringify({ output, figures: figures.map(f => f.id),
    bindings: bindings.length, imagesPlanned: 6 }))
}
