import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ticket, absolute, read, bind, verify } from '../retain-d016-evidence.mjs';

const folder = `${ticket}/tmp/d319-t18-arc-flame-text-review`;
const file = `${folder}/written-answer-review.json`;
const review = await read(file);
assert.equal(review.outcome, 'pass');
for (const binding of [review.baseline, review.authorFreeze, review.authorReport, ...review.candidates]) {
  await verify(binding.path, binding.sha256);
  assert.equal((await fs.stat(absolute(binding.path))).mode & 0o777, 0o444);
}
const authorRoot = path.dirname(review.authorFreeze.path);
const freeze = await read(review.authorFreeze.path);
for (const binding of freeze.artifacts) {
  await verify(`${authorRoot}/${binding.path}`, binding.sha256);
}
const report = await read(review.authorReport.path);
await verify(`${authorRoot}/${report.localSyntax.path}`, report.localSyntax.sha256);
assert.equal(report.localSyntax.exitCode, 0);
for (const candidate of review.candidates) {
  const data = await read(candidate.path);
  assert.equal(data.lesson, review.card);
  assert.deepEqual(data.answers.map(row => row.exercise), review.reviewedSourceTasks);
  for (const answer of data.answers) {
    assert.equal(answer.grading, 'ungraded');
    assert.equal(answer.source, 'derived');
    assert.deepEqual(answer.parts, []);
    assert.ok(answer.displayAnswer.trim());
  }
}
await fs.chmod(absolute(file), 0o444);
console.log(JSON.stringify({ review: await bind(file), outcome: 'pass', localSyntaxRepeated: false, imagesOpened: 0 }));
