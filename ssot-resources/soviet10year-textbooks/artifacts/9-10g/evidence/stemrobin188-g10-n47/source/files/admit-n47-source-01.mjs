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
const priorInputPath = path.join(tmp, 'source167169-review-inputs-01/manifest.json')
const newInputPath = path.join(tmp, 'source170172-review-inputs-01/manifest.json')
const priorInput = json(priorInputPath)
const newInput = json(newInputPath)
const firstPriorReview = path.join(tmp, 'n41-choice-source167169-review-01/source-review.json')
const firstNewReview = path.join(tmp, 'source170172-review-01/review.json')
const tokenReview = path.join(tmp, 'n46-fig14-source167169-affected-review-01/source-affected-review.json')
const newAffectedReview = path.resolve(process.argv[2])
assert.ok(newAffectedReview.startsWith(tmp + path.sep))
assert.equal(json(tokenReview).status, 'pass')
assert.equal(json(newAffectedReview).outcome, 'pass')
assert.equal(json(firstPriorReview).status, 'revise')
assert.equal(json(firstNewReview).status, 'revise')
const pages = [
  priorInput.pages.find(page => page.physical === 169), ...newInput.pages,
]
assert.deepEqual(pages.map(page => page.physical), [169, 170, 171, 172])
const files = []
for (const page of pages) {
  const audit = json(path.join(page.artifactDirectory, 'audit.json'))
  assert.deepEqual(audit.errors, [])
  assert.equal(audit.lines_printed, audit.lines_md)
  assert.equal(json(path.join(page.artifactDirectory, 'page.json')).meta.numbering_scope, 'g10')
  page.crops = audit.figures.map(figure => bind(path.join(page.workDirectory, 'figures', `${figure.id}.png`)))
  files.push(...['page.md', 'page.json', 'audit.json'].map(name => path.join(page.artifactDirectory, name)),
    ...['page.png', 'layout.json'].map(name => path.join(page.workDirectory, name)),
    ...page.crops.map(crop => crop.path))
}
assert.equal(pages.flatMap(page => page.crops).length, 7)
const current = new Map([...priorInput.bindings, ...newInput.bindings]
  .map(binding => [binding.path, binding.sha256]))
for (const file of files) assert.equal(hash(file), current.get(file), file)
const bindings = [...new Set([...files, priorInputPath, newInputPath,
  firstPriorReview, firstNewReview, tokenReview, newAffectedReview])].map(bind)
const admission = {
  status: 'pass-for-readable-n47-source-only', book: '9-10g',
  lesson: 'geo910-c2-s2-n47', pages, bindings,
  scope: { first: 'p0169#1', lessonHeading: 'p0169#2', rightBoundaryExcluded: 'p0172#12',
    exercises: [49, 50, 51, 52, 53, 54], figures: [16, 17, 18, 19, 20, 21, 22] },
  inheritedReviews: [bind(firstPriorReview), bind(firstNewReview)],
  affectedReviews: [bind(tokenReview), bind(newAffectedReview)],
  localHoldsPreserved: true, originalFIRSTAndRevisePreserved: true,
  wholeAllInkPagesApproved: false, source167168ReviewCardApproved: false,
  N48Approved: false, noSourceBodyRepairInThisAdmission: true,
  modernApproved: false, answersApproved: false, choicesApproved: false, published: false,
}
const output = path.join(tmp, 'n47-source-admission-01.json')
fs.writeFileSync(output, JSON.stringify(admission, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ output, bindings: bindings.length, scope: admission.scope }))
