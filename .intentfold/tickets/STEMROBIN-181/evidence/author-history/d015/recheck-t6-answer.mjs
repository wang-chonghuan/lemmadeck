import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const read = async p => JSON.parse(await fs.readFile(p, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const freezePath = `${work}/9p-t6-answer-correction-freeze.json`;
const freeze = await read(freezePath);
for (const b of [freeze.before_draft, freeze.current_draft, freeze.initial_independent_review]) {
  assert.deepEqual(await bind(b.path), b);
}
const before = await read(freeze.before_draft.path);
const current = await read(freeze.current_draft.path);
const restored = structuredClone(current);
restored.answers[1].displayAnswer = before.answers[1].displayAnswer;
restored.answers[1].notes = before.answers[1].notes;
assert.deepEqual(restored, before);
assert.deepEqual(freeze.changed_paths, ['/answers/1/displayAnswer', '/answers/1/notes']);
const affected = current.answers[1];
assert.equal(affected.exercise, '2');
assert.equal(affected.grading, 'ungraded');
assert.deepEqual(affected.parts, []);
const evidence = 'Actually read corrected answer2: no predetermined sugar/soap direction without conditions; retains adult-guided actual calibrated comparison to same-temperature water, composition/concentration, prior hypotheses, recorded uncertainty and genuine incomplete steps. Greater/lower/unresolved within uncertainty are distinguished, and unresolved is not exact equality. No invented observation or unsupported empirical sign remains.';
const initial = await read(freeze.initial_independent_review.path);
const exercises = structuredClone(initial.exercises);
Object.assign(exercises[1], { status: 'pass', evidence });
await fs.writeFile(`${work}/9p-t6-answer-review.json`, JSON.stringify({
  ...initial, status: 'pass',
  bindings: { ...initial.bindings, draft: freeze.current_draft },
  exercises, findings: [],
  initialReview: freeze.initial_independent_review,
  affectedOnlyCorrection: {
    finding: 'F1', exercise: '2', fields: freeze.changed_paths, status: 'pass', evidence,
    freeze: await bind(freezePath), before: freeze.before_draft, current: freeze.current_draft,
    otherTenAnswersDeepEqual: true, otherTenIndependentPassesInheritedNotRepeated: true,
  },
  limits: 'One initial independent answer gate plus affected-only answer2 correction. No repeated ten-answer review, new research or production write.',
}, null, 2) + '\n', { flag: 'wx' });
console.log('Affected-only answer2PASS; initial other10PASS retained.');
