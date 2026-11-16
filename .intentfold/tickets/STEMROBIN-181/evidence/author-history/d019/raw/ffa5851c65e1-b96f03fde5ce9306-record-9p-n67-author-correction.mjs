import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const ticketTmp = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(ticketTmp, '9p-n67-prose-freeze.json');
const initialReport = path.join(ticketTmp, '9p-n67-author-initial/9p-n67-prose-freeze.json');
const initialTemplate = path.join(ticketTmp, '9p-n67-author-initial/lesson.template.json');
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: path.relative(root, file), sha256: hash(file) });
const report = JSON.parse(fs.readFileSync(target, 'utf8'));
const initial = JSON.parse(fs.readFileSync(initialReport, 'utf8'));
assert.equal(hash(initialReport), '45f77f4f2f0ed9fb1f367ea94768eb2a228ab27176f38e9980669b75b45e0655');
assert.equal(hash(initialTemplate), initial.bindings.lessonTemplate.sha256);
assert.equal(initial.nativeAuthorCheck.status, 'fail');
assert.equal(report.nativeAuthorCheck.invocations, 1);
assert.equal(report.authorCorrection, undefined);
const previous = JSON.parse(fs.readFileSync(initialTemplate, 'utf8'));
const current = JSON.parse(fs.readFileSync(path.join(root, report.bindings.lessonTemplate.path), 'utf8'));
const deltas = [];
for (let index = 0; index < previous.prose.length; index += 1) {
  if (previous.prose[index].text === current.prose[index].text) continue;
  assert.ok([1, 4].includes(index));
  const a = { ...previous.prose[index] };
  const b = { ...current.prose[index] };
  delete a.text;
  delete b.text;
  assert.deepEqual(a, b);
  deltas.push({
    target: `lesson.prose[${index}].text`,
    source_refs: current.prose[index].source_refs,
    before: previous.prose[index].text,
    after: current.prose[index].text,
  });
}
assert.deepEqual(deltas.map(item => item.target), ['lesson.prose[1].text', 'lesson.prose[4].text']);
const reconstructed = structuredClone(current);
for (const index of [1, 4]) reconstructed.prose[index].text = previous.prose[index].text;
assert.deepEqual(reconstructed, previous);
report.nativeAuthorCheck.invocations = 2;
report.nativeAuthorCheck.initialStatus = 'fail';
report.nativeAuthorCheck.targetedCorrectionAttempts = 1;
report.authorCorrection = {
  initialReport: bind(initialReport),
  initialLessonTemplate: {
    ...bind(initialTemplate),
    metadata: { original: report.bindings.lessonTemplate.path },
  },
  recorder: bind(fileURLToPath(import.meta.url)),
  reason: 'Restore the two original wrapped q atoms without altering equations, and remove one noncanonical blank line.',
  deltas,
  sourceFormulaCorrection: false,
  initialFailurePreservedVerbatim: true,
  changedOnlyAuthorText: true,
  independentReviewClaimed: false,
};
report.nativeAuthorCheck.historyAnnotationCommand =
  'node .intentfold/tickets/STEMROBIN-181/tmp/record-9p-n67-author-correction.mjs';
fs.writeFileSync(target, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status: report.status, authorCheck: report.nativeAuthorCheck.status, freeze: bind(target), correctionAttempts: 1 }));
