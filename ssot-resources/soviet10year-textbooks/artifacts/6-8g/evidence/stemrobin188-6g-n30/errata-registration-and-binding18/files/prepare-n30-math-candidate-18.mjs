import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const own = path.join(tmp, 'n30-proposed-math-preview-18')
assert.ok(!fs.existsSync(own))
fs.mkdirSync(own)
const received = read(path.join(tmp, 'n30-text-author-received-18.json'))
assert.equal(hash(received.lesson.path), received.lesson.sha256)
assert.equal(hash(received.proposals.path), received.proposals.sha256)
const lesson = read(received.lesson.path)
const proposals = read(received.proposals.path).proposals
assert.equal(proposals.length, 2)
assert.deepEqual(lesson.errata, [])
for (const proposal of proposals) {
  const target = lesson.prose[proposal.target.block_index]
  assert.ok(target.source_refs.includes(proposal.block))
  assert.equal(target.text.split(proposal.original).length - 1, 1)
  target.text = target.text.replace(proposal.original, proposal.corrected)
  target.changes = [...new Set([...target.changes, 'math-correction'])]
}
const file = path.join(own, 'lesson.template.json')
save(file, lesson)
save(path.join(own, 'context.json'), {
  status: 'PROPOSED_MATH_PREVIEW_ONLY_NOT_SOURCE_REGISTERED_OR_APPROVED',
  lesson: 'geo68-c2-s4-n30',
  proposedText: bind(file),
  unchangedExercises: received.exercises,
  originalCandidate: received.lesson,
  proposals: received.proposals,
  source: bind(path.join(tmp,
    'n30-draft-first-18/artifacts/6-8g/lessons/geo68-c2-s4-n30/lesson.json')),
  originalFigures: [190, 191].map(number => ({
    id: `fig-${number}`,
    source: bind(path.join(tmp, `n30-draft-first-18/artifacts/6-8g/figures/fig-${number}.png`)),
  })),
  registeredErrata: 0,
  sourceAndAuthorSnapshotsUnchanged: true,
  independentApproval: false,
  nativeFinalizationAllowed: false,
  parentImageLoads: 0,
})
console.log(JSON.stringify({ context: bind(path.join(own, 'context.json')), text: bind(file) }))
