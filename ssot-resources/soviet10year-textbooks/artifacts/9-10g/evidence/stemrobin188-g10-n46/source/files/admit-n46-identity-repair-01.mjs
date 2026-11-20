import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const reviewPath = path.join(tmp, 'n45-n46-followup-review-01/n46-identity-review.json')
assert.equal(hash(reviewPath), '422b660a6d039c906e5af7980c13d56b182568463cdbef1bcd5c9ca9e1a6e727')
const review = json(reviewPath)
assert.equal(review.status, 'pass')
assert.deepEqual(review.completeJSONDiff, [{ pointer: '/blocks/7/label', before: '36*', after: '36' }])
assert.equal(review.markdown.allBodyFrontmatterAndOtherCommentsByteUnchanged, true)
assert.deepEqual(review.cumulativeAuthorRepairs, { 165: 2, 166: 1 })
const originalPath = path.join(tmp, 'n46-source-admission-01.json')
const admission = json(originalPath)
const page = admission.pages.find(item => item.physical === 165)
const files = review.files
page.artifactDirectory = path.dirname(files.find(item => item.role === 'artifacts').current.path)
page.workDirectory = path.dirname(files.find(item => item.role === 'work').current.path)
page.artifacts = files.filter(item => item.role === 'artifacts').map(item => item.current)
page.source = files.filter(item => item.role === 'work').map(item => item.current)
const added = [bind(reviewPath), bind(originalPath), ...review.inputs,
  ...files.flatMap(item => [item.original, item.immutableBefore, item.current])]
admission.bindings = [...new Map([...admission.bindings, ...added]
  .map(binding => [binding.path, binding])).values()]
for (const binding of admission.bindings) assert.equal(hash(binding.path), binding.sha256, binding.path)
admission.originalAdmissionPreserved = bind(originalPath)
admission.identityAffectedReview = bind(reviewPath)
admission.cumulativeRepairCounts = review.cumulativeAuthorRepairs
admission.originalFailedAssemblyPreserved = true
admission.fullPageOrChapterReviewApprovalClaimed = false
const output = path.join(tmp, 'n46-source-admission-identity-02.json')
fs.writeFileSync(output, JSON.stringify(admission, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ output, bindings: admission.bindings.length, cumulativeRepairCounts: admission.cumulativeRepairCounts }))
