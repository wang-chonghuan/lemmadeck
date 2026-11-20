import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const reviewPath = path.join(tmp, 'source165166-affected-review-01/report.json')
assert.equal(hash(reviewPath), 'aa4e1ce1e69b5f1846e726ad0ad1959c443b0b02f32c5beaee58707ba41f989f')
const review = json(reviewPath)
assert.equal(review.status, 'pass-for-readable-n46-source-only')
assert.equal(review.localHoldsPreserved, true)
assert.deepEqual(review.extent.exercises, [34, 35, 36, 37, 38, 39])
const manifestPath = path.join(tmp, 'n45n46-review-inputs-01/manifest.json')
const manifest = json(manifestPath)
const pages = manifest.n46Pages.map(page => {
  if (page.physical < 165) return page
  const current = review.pages.find(item => item.physical === page.physical)
  assert.ok(current)
  const artifacts = current.files.filter(item => item.role === 'artifacts').map(item => item.current)
  const source = current.files.filter(item => item.role === 'work').map(item => item.current)
  assert.equal(artifacts.length, 3)
  assert.equal(source.length, 2)
  return {
    physical: page.physical,
    artifactDirectory: path.dirname(artifacts[0].path),
    workDirectory: path.dirname(source[0].path),
    artifacts, source, crops: [],
  }
})
assert.deepEqual(pages.map(page => page.physical), [163, 164, 165, 166])
const bindings = pages.flatMap(page => [...page.artifacts, ...page.source, ...page.crops])
bindings.push({ path: reviewPath, sha256: hash(reviewPath) },
  { path: manifestPath, sha256: hash(manifestPath) },
  review.bindings.authorReport, review.bindings.originalReview, review.bindings.independentFIRST,
  ...review.bindings.originalFIRST)
for (const binding of bindings) assert.equal(hash(binding.path), binding.sha256, binding.path)
const admission = {
  status: review.status, lesson: review.lesson, localHoldsPreserved: true,
  extent: review.extent, pages, bindings,
  localHolds: review.localHolds, notApproved: review.notApproved,
  inheritedVerdicts: review.inheritedVerdictsExactUnmodified,
  originalReviewStatusPreserved: 'revise',
  sourceRepairCountPerAffectedPage: review.cumulativeAuthorRepairCountPerPage,
  chapterReviewApproved: false,
}
const out = path.join(tmp, 'n46-source-admission-01.json')
fs.writeFileSync(out, JSON.stringify(admission, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ out, sha256: hash(out), bindings: bindings.length, status: admission.status }))
