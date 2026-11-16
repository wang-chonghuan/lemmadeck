import assert from 'node:assert/strict';
import {
  ticket, book, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const [number, ...reports] = process.argv.slice(2);
assert.ok(['86', '87', '88', '89'].includes(number));
const card = `phy9-c2-s3-n${number}`;
const output = `${ticket}/tmp/9p-n${number}-figure-review.json`;
assert.ok(!await exists(output), 'Never replace an existing owning gate.');
const source = await read(`${book}/lessons/${card}/lesson.json`);
const expected = source.figures.map(figure => figure.id).sort();
assert.ok(reports.length || expected.length === 0);
const figures = [];
const inputs = [];
for (const file of reports) {
  const report = await read(file);
  assert.equal(report.status, 'pass');
  inputs.push(await bind(file));
  for (const figure of report.figures ?? [report]) {
    assert.equal(figure.status, 'pass');
    assert.ok(expected.includes(figure.id), `Unexpected figure ${figure.id}`);
    assert.ok(!figures.some(item => item.id === figure.id));
    for (const key of ['source', 'context', 'lesson', 'spec', 'render', 'svg']) {
      const binding = figure.bindings[key];
      assert.ok(binding?.path && binding.sha256, `Missing ${figure.id}/${key}`);
      await verify(binding.path, binding.sha256);
    }
    figures.push(figure);
  }
}
assert.deepEqual(figures.map(figure => figure.id).sort(), expected);
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D022', lesson: card, status: 'pass',
  owningIndependentReports: inputs, figures,
  aggregationOnly: true, newImageOpens: 0, newNativeOrSubstantiveReviewCalls: 0,
  scope: 'Exact existing independent current-context gates consumed without changing their observations.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(output)));
