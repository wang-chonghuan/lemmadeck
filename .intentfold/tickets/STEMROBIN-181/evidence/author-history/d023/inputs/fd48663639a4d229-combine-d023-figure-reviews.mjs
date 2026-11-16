import assert from 'node:assert/strict';
import { ticket, book, read, bind, verify, exists, immutableWrite } from './retain-d016-evidence.mjs';

const [number, ...reports] = process.argv.slice(2);
assert.ok(['90', '91', '92'].includes(number));
const card = `phy9-c2-s3-n${number}`;
const output = `${ticket}/tmp/9p-n${number}-figure-review.json`;
assert.ok(!await exists(output));
const expected = (await read(`${book}/lessons/${card}/lesson.json`)).figures.map(item => item.id).sort();
assert.ok(reports.length || !expected.length);
const figures = [];
const inputs = [];
for (const file of reports) {
  const report = await read(file);
  assert.equal(report.status, 'pass');
  inputs.push(await bind(file));
  for (const figure of report.figures ?? [report]) {
    assert.equal(figure.status, 'pass');
    assert.ok(expected.includes(figure.id));
    assert.ok(!figures.some(row => row.id === figure.id));
    const media = figure.bindings.png ? 'png' : 'svg';
    const native = figure.bindings.generation ? 'generation' : 'render';
    for (const name of ['source', 'context', 'lesson', 'spec', native, media]) {
      const binding = figure.bindings[name];
      assert.ok(binding?.path && binding.sha256, `Missing ${figure.id}/${name}`);
      await verify(binding.path, binding.sha256);
    }
    figures.push(figure);
  }
}
assert.deepEqual(figures.map(row => row.id).sort(), expected);
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D023', lesson: card, status: 'pass',
  owningIndependentReports: inputs, figures, aggregationOnly: true,
  newImageOpens: 0, newNativeOrSubstantiveReviewCalls: 0,
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(output)));
