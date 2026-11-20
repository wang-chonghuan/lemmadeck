import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, core, read, bind, save, inventory, retain } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const author = path.join(tmp, 'n61-fig86-affected-04')
const specPath = path.join(author, 'fig-g10-86.repair5.spec.json')
const spec = read(specPath)
assert.equal(read(path.join(author, 'fig-g10-86.repair5.render.json')).status, 'pass')
const root = path.join(tmp, 'n61-fig86-review-inputs-05')
assert.ok(!fs.existsSync(root), root)
fs.mkdirSync(root)
const files = [
  specPath,
  path.join(author, 'fig-g10-86.repair5.svg'),
  path.join(author, 'fig-g10-86.repair5.render.json'),
  path.join(author, 'fig-g10-86.repair5.snapshot.json'),
  path.join(author, 'fig-g10-86.repair5.widths-480-300.png'),
  path.join(author, 'repair5-changes.json'),
  path.join(author, 'affected-change.json'),
  path.join(author, 'repair4-author-visual-failure.json'),
  path.join(tmp, 'n61-fig8687-affected-02/fig-g10-86.repair3.spec.json'),
  path.join(tmp, 'known-affected-review-02/report.json'),
  path.join(tmp, 'known-affected-review-02/original86-first.json'),
  spec.source.image.path,
]
save(path.join(root, 'blind-intake.json'), {
  figure: 'fig-g10-86', original: bind(spec.source.image.path),
  firstBeforeCurrentSpecAndContext: true, maxImageUnits: 8,
})
save(path.join(root, 'manifest.json'), {
  ticket: 'STEMROBIN-188', book: '9-10g', figure: 'fig-g10-86',
  scope: 'Affected A1 association only; current horizontal muted label guide and its connects mapping',
  bindings: files.map(bind), spec: bind(specPath),
  contactSheet: bind(path.join(author, 'fig-g10-86.repair5.widths-480-300.png')),
  before: bind(path.join(tmp, 'n61-fig8687-affected-02/fig-g10-86.repair3.spec.json')),
  contentRepairTotal: 5, allOriginalObjectsGeometryAndSourceInventoryUnchanged: true,
  sourceLeaderClaimed: false, guidesAreDeclaredModernOnly: true,
  plannedImageUnits: 3, oldFailedSnapshotsNotToBeOpened: true,
  priorSourceGlyphFontHoldsPreserved: true, noProducerOrPassedReviewReruns: true,
  parentImageBudget: { actualUnits: 7, batchLimit: 8, contextLimit: 24 },
  independentApproval: false, wholeLessonApproved: false, published: false,
})
retain(path.join(core, 'evidence/stemrobin188-g10-n61/fig86-association-05'),
  [new URL(import.meta.url).pathname,
    path.join(tmp, 'repair-n61-fig86-association-04.mjs'), ...inventory(author)], {
    status: 'current-repair5-native-PASS-local-author-snapshot-PASS-independent-review-pending',
    totalContentRepairs: 5, priorIndependentRepair3FailurePreserved: true,
    repair4LocalVisualFailurePreserved: true, currentSpec: bind(specPath),
  })
console.log(JSON.stringify({ root, bindings: files.length, plannedImageUnits: 3 }))
