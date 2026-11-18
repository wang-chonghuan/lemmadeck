import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { ticket, absolute, relative, read, bind, verify } from './retain-d016-evidence.mjs';

const [file] = process.argv.slice(2);
assert.ok(relative(file).startsWith(`${ticket}/tmp/`));
const review = await read(file);
assert.equal(review.outcome, 'pass');
await verify(review.baseline.path, review.baseline.sha256);
const baseline = await read(review.baseline.path);
assert.deepEqual(review.question_reviews.flatMap(row => row.inferred_source_numbers),
  baseline.tasks.map(row => row.source_number));
for (const binding of review.visibleBindings) {
  await verify(binding.path, binding.sha256);
  assert.equal((await fs.stat(absolute(binding.path))).mode & 0o777, 0o444);
  const views = await read(binding.path);
  assert.equal(views.length, review.questionsPerLanguage);
  assert.equal(views.reduce((sum, view) => sum + view.options.length, 0), review.optionsPerLanguage);
  for (const [i, row] of review.question_reviews.entries()) {
    assert.deepEqual(views[i].options.map(option => option.id),
      row.mathematics.option_checks.map(option => option.option_id));
    assert.deepEqual(row.mathematics.correct,
      row.mathematics.option_checks.filter(option => option.truth === 'correct').map(option => option.option_id));
  }
}
await fs.chmod(absolute(file), 0o444);
console.log(JSON.stringify({ visibleReview: await bind(file), keysRead: false, imagesOpened: 0 }));
