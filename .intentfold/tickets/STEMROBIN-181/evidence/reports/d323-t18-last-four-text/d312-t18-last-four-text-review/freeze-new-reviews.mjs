import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, absolute, read, bind, verify,
} from '../retain-d016-evidence.mjs';

const folder = `${ticket}/tmp/d312-t18-last-four-text-review`;
const answerPath = `${folder}/written-answer-review.json`;
const answer = await read(answerPath);
for (const binding of [answer.baseline, answer.candidate, answer.authorFreeze, answer.authorReport]) {
  await verify(binding.path, binding.sha256);
}
const visiblePath = `${folder}/phase2-visible-review.json`;
const visible = await read(visiblePath);
await verify(visible.baseline.path, visible.baseline.sha256);
for (const binding of visible.visibleBindings) {
  await verify(binding.path, binding.sha256);
  const views = await read(binding.path);
  assert.equal(views.length, 4);
  assert.equal(views.reduce((sum, view) => sum + view.options.length, 0), 16);
  for (const [i, review] of visible.question_reviews.entries()) {
    assert.deepEqual(views[i].options.map(row => row.id),
      review.mathematics.option_checks.map(row => row.option_id));
  }
}
for (const file of [answerPath, visiblePath]) await fs.chmod(absolute(file), 0o444);
console.log(JSON.stringify({
  answers: await bind(answerPath), visibleReview: await bind(visiblePath),
  choiceAuthorKeysRead: false, imagesOpened: 0,
}));
