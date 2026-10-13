const { test } = require('node:test')
const assert = require('node:assert/strict')
const { preserveChoiceMetadata } = require('./publish_merge.js')
test('lesson republish retains choices only when the exercise surface is unchanged', () => {
  const exercise = { number: '1', html: 'given', figures: [] }
  const existing = { edition: 'modern', exercises: [{ ...exercise, answerKey: { answer: 1 } }],
    choiceSet: { revision: 'r1' } }
  const unchanged = { edition: 'modern', exercises: [exercise] }
  assert.equal(preserveChoiceMetadata(unchanged, existing).choiceSet.revision, 'r1')
  assert.equal(preserveChoiceMetadata({ ...unchanged, exercises: [{ ...exercise, html: 'changed' }] }, existing).choiceSet, undefined)
  assert.equal(preserveChoiceMetadata({ ...unchanged, edition: 'other' }, existing).choiceSet, undefined)
})
