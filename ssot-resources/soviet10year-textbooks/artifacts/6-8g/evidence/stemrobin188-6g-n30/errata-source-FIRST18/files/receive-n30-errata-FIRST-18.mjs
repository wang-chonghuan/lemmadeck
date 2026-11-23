import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const own = path.join(tmp, 'n30-errata-first-independent-review-18')
const file = path.join(own, 'manifest.json')
assert.equal(hash(file), '1bd615793ef8d49568d39f34e2a4c280f07b7a78cf2e194cdbc330c40f0c9adc')
const manifest = read(file)
const refs = [bind(file)]
for (const item of [...manifest.files, manifest.inputBinding, manifest.priorSourceReviewBinding]) {
  assert.equal(hash(item.path), item.sha256, item.path)
  if (item.requiredModeOctal) assert.equal(fs.statSync(item.path).mode & 0o777, 0o444)
  refs.push({ path: item.path, sha256: item.sha256 })
}
const retained = retainCurrent6g(
  'evidence/stemrobin188-6g-n30/errata-source-FIRST18',
  [...refs, bind(path.join(tmp, 'receive-n30-errata-FIRST-18.mjs'))],
  ['evidence/stemrobin188-6g-n30/assembly-and-prepare-first18/retention.json'],
  {
    status: 'SOURCE_ONLY_FIRST_SEALED_PROPOSAL_REVIEW_PENDING',
    lesson: manifest.lesson, counts: manifest.imageCounts,
    noProposalApprovalYet: true,
  },
)
const text = read(path.join(tmp, 'n30-text-author-received-18.json'))
const input = path.join(tmp, 'n30-errata-independent-inputs-18/post-FIRST.json')
save(input, {
  status: 'EXACT_TWO_ERRATA_PROPOSALS_AFTER_SEALED_FIRST',
  first: manifest.files[0],
  sourceDerivation: bind(path.join(own, 'report.json')),
  firstRetention: retained.retention,
  proposals: text.proposals,
  originalCandidate: text.lesson,
  correctedPreview: bind(path.join(tmp, 'n30-proposed-math-preview-18/lesson.template.json')),
  source139: bind(path.join(tmp, 'n30-draft-first-18/artifacts/6-8g/pages/0139/page.json')),
  noAnswersOrChoices: true,
  affectedScopeOnly: ['p0139#1', 'p0139#5'],
  additionalImages: 0,
})
console.log(JSON.stringify({ retention: retained.retention, postFirst: bind(input) }))
