import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, bind, save, hash } from './retain-scoped-evidence-02.mjs'

const root = path.join(tmp, 'source215216-metadata-repair-01')
assert.ok(!fs.existsSync(root), root)
const reviewPath = path.join(tmp, 'source215216-FIRST-review-01/report.json')
const review = read(reviewPath)
assert.equal(review.FAIL.filter(f => ['F215-EMPHASIS', 'F216-EMPHASIS', 'F216-NAMESPACE'].includes(f.id)).length, 3)
const sources = [
  { page: 215, name: 'source213215-author', note: 'REPAIR1 source typography for p0215#13: the terminal defined term 旋转图形 is visibly emphasized across its printed line break. Record only this definite term; finer emphasis boundaries remain HOLD. All literal text, math and source pixels stay unchanged.' },
  { page: 216, name: 'source216218-author', note: 'REPAIR1 source typography for p0216#8-9: definite wavy underlines mark 旋转图形的截面 and 轴截面, and the cylinder definition has strong emphasis. Fine bold-span boundaries remain HOLD. Add inherited g10 namespace with exact saved crops reused; literal text and all source pixels stay unchanged.' },
]
const pages = sources.map(p => {
  const id = String(p.page).padStart(4, '0')
  const author = path.join(tmp, p.name)
  const original = path.join(author, 'artifacts/9-10g/pages', id)
  const candidate = path.join(root, 'artifacts/9-10g/pages', id)
  fs.mkdirSync(candidate, { recursive: true })
  const inputs = ['page.md', 'page.json', 'audit.json'].map(name => {
    const from = path.join(original, name)
    const to = path.join(candidate, name)
    fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
    fs.chmodSync(to, 0o644)
    assert.equal(hash(from), hash(to))
    return { before: bind(from), copied: bind(to) }
  })
  const old = read(path.join(original, 'page.json'))
  const crops = old.meta.figures.map(f => {
    const from = path.join(author, 'work/9-10g/pages', id, 'figures', `${f.id}.png`)
    const newID = p.page === 216 ? f.id.replace(/^fig-/, 'fig-g10-') : f.id
    const to = path.join(root, 'work/9-10g/pages', id, 'figures', `${newID}.png`)
    fs.mkdirSync(path.dirname(to), { recursive: true })
    fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
    assert.equal(hash(from), hash(to))
    return { oldID: f.id, newID, before: bind(from), after: bind(to), pixelBytesReused: true }
  })
  return { ...p, original, candidate, inputs, crops }
})
save(path.join(root, 'repair-scope.json'), {
  schema: 'stemrobin188-source215216-sole-metadata-repair-scope@1',
  status: 'prepared-only-not-yet-edited', review: bind(reviewPath), pages,
  allowedChanges: ['one-source-emphasis-note-per-page', '216-g10-namespace-and-derived-figure-IDs-only'],
  source215HeadingUnchanged: true, headingContractAdjudicationStillPending: true,
  allOtherFieldsAndLiteralBlocksFrozen: true,
  repairsUsedBefore: { 215: 0, 216: 0 }, repairLimitPerPage: 1,
  nativeCallsAllowed: 0, sourceImageLoadsAllowed: 0,
  originalFIRSTsFailuresAndHoldsPreserved: true, wholeLessonApproved: false,
})
console.log(JSON.stringify({ root, pages: [215, 216], artifactCopies: 6,
  exactCropCopies: pages.reduce((n, p) => n + p.crops.length, 0), nativeCalls: 0, images: 0 }))
