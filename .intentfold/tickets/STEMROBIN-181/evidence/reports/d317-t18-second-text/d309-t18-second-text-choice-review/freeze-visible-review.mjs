import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, absolute, read, bind, verify, immutableWrite,
} from '../retain-d016-evidence.mjs';

const folder = `${ticket}/tmp/d309-t18-second-text-choice-review`;
const reportPath = `${folder}/phase2-visible-review.json`;
const report = await read(reportPath);
await verify(report.baseline.path, report.baseline.sha256);
for (const binding of report.visibleBindings) {
  await verify(binding.path, binding.sha256);
  const views = await read(binding.path);
  assert.equal(views.length, 4);
  for (const [i, row] of report.question_reviews.entries()) {
    assert.deepEqual(views[i].options.map(option => option.id),
      row.mathematics.option_checks.map(option => option.option_id));
  }
  assert.equal(views.reduce((sum, view) => sum + view.options.length, 0), 17);
}
await fs.chmod(absolute(reportPath), 0o444);
const freezePath = `${folder}/phase2-freeze.json`;
await immutableWrite(freezePath, `${JSON.stringify({
  schema: 'STEMROBIN-181/scoped-choice-visible-review-freeze@1',
  ticket: 'STEMROBIN-181', frozenUtc: new Date().toISOString(),
  report: await bind(reportPath), outcome: report.outcome,
  authorChoiceKeysRead: false, imagesOpened: 0,
  completeTrueSets: report.question_reviews.map(row => row.mathematics.correct),
  nativeReviewValidation: false, wholeCardApproved: false,
}, null, 2)}\n`);
await fs.chmod(absolute(freezePath), 0o444);
console.log(JSON.stringify({ report: await bind(reportPath), freeze: await bind(freezePath) }));
