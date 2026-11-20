import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const firstPath = path.join(tmp, 'source235237-FIRST-review-01/report.json')
const affectedPath = path.join(tmp, 'source236-theorem-affected-review-02/report.json')
const first = read(firstPath)
const affected = read(affectedPath)
assert.equal(affected.status, 'pass')
assert.deepEqual(affected.findings, [])
assert.deepEqual(first.defects.map(item => item.id), ['R236-THEOREM40-OMISSION'])
const source236 = first.pages.find(item => item.physicalPage === 236)
const source237 = first.pages.find(item => item.physicalPage === 237)
assert.equal(source236.blocks.find(item => item.ref === 'p0236#3').readableStructureStatus, 'pass')
assert.equal(source236.blocks.find(item => item.ref === 'p0236#5').status, 'pass')
assert.equal(source236.blocks.find(item => item.ref === 'p0236#7').status, 'pass')
assert.equal(source236.blocks.find(item => item.ref === 'p0236#8').status, 'pass')
for (const item of source237.blocks.filter(item => /^p0237#[1-9]$/.test(item.ref))) {
  if (item.ref === 'p0237#7') assert.equal(item.mathMeaningStatus, 'pass')
  else assert.equal(item.status, 'pass')
}
assert.equal(source237.blocks.find(item => item.ref === 'p0237#10').status, 'pass')
affected.inputBindings.forEach(item => assert.equal(hash(item.path), item.sha256After))
const base = path.join(tmp, 'g10-n68')
assert.ok(!fs.existsSync(base), base)
const pages = [
  { page: 212, artifact: 'g10-n61/artifacts', work: 'g10-n61/work' },
  { page: 236, artifact: 'source236-theorem-repair-02/artifacts',
    work: 'source236-theorem-repair-02/work' },
  { page: 237, artifact: 'source237238-author/artifacts', work: 'source237238-author/work' },
]
const files = pages.flatMap(item => {
  const padded = String(item.page).padStart(4, '0')
  return [
    ...['page.md', 'page.json', 'audit.json'].map(name => ({
      from: path.join(tmp, item.artifact, '9-10g/pages', padded, name),
      to: path.join(base, 'artifacts/9-10g/pages', padded, name),
    })),
    ...['page.png', 'layout.json'].map(name => ({
      from: path.join(tmp, item.work, '9-10g/pages', padded, name),
      to: path.join(base, 'work/9-10g/pages', padded, name),
    })),
  ]
})
files.push({
  from: path.join(tmp, 'source236-theorem-repair-02/work/9-10g/pages/0236/figures/fig-g10-104.png'),
  to: path.join(base, 'work/9-10g/pages/0236/figures/fig-g10-104.png'),
})
files.forEach(item => assert.ok(fs.statSync(item.from).isFile(), item.from))
fs.mkdirSync(base)
for (const item of files) {
  fs.mkdirSync(path.dirname(item.to), { recursive: true })
  fs.copyFileSync(item.from, item.to, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(item.to, 0o644)
  assert.equal(hash(item.to), hash(item.from))
}
save(path.join(base, 'source-admission.json'), {
  status: 'pass-for-readable-n68-source-only-with-local-holds',
  lesson: 'geo910-c2-s3-n68',
  bindings: [...new Set([...files.map(item => item.from), firstPath, affectedPath,
    path.join(tmp, 'source236-theorem-repair-02/repair.json'),
    path.join(tmp, 'source236-theorem-repair-02/result.json'),
    path.join(tmp, 'source236-theorem-focused-01/preparation.json')])].map(bind),
  firstIndependentReview: bind(firstPath), affectedWordReview: bind(affectedPath),
  inheritedLimitations: first.explicitHolds,
  originalFirstMalformed236HashPreserved: true,
  originalFIRSTProcedureApproved: false, originalFailuresAndHoldsPreserved: true,
  sourceWordRepairs: 1, scopedFigureRefs: ['p0236#3', 'p0236#4'],
  explicitFigureOwner: 'N68 theorem40 proof, as first independent review states',
  figure104ReadableStructurePASSOnlyNotModernFigureApproval: true,
  inequality257InclusiveMeaningPASSOnlyNotExactGlyphApproval: true,
  chapter212OnlyUnchangedAncestor: true, N67AndN69Approved: false,
  wholePageApproved: false, wholeLessonApproved: false,
  modernFigureApproved: false, parentImages: 16, published: false,
})
console.log(JSON.stringify({ base, copied: files.length, parentImageLoads: 16, published: false }))
