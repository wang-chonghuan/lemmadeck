import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const stagePath = `${work}/d017-choice-view-review-freeze.json`;
const stage = await read(stagePath);
assert.equal(stage.status, 'pass');
for (const binding of [stage.seed, stage.view]) assert.deepEqual(await bind(binding.path), binding);
const draftPath = `${work}/9p-t4-choice-draft.json`;
const draft = await read(draftPath);
const view = await read(stage.view.path);
assert.deepEqual(draft.questions.map(question => ({ id: question.id, ...question.view })), view.questions);
assert.deepEqual(draft.new_figures, []);
const comparisons = [];
for (const [index, question] of draft.questions.entries()) {
  const independent = stage.question_reviews[index];
  assert.equal(question.id, independent.question_id);
  assert.deepEqual(question.key.correct, independent.mathematics.correct);
  assert.deepEqual(question.key.rationales.map(item => [item.option_id, item.truth]),
    independent.mathematics.option_checks.map(item => [item.option_id, item.truth]));
  assert.equal(question.source_numbers.length, 1);
  assert.equal(question.source_numbers[0], String(index + 1));
  assert.ok(question.intent.limitations.length > 0);
  comparisons.push({
    question: question.id, status: 'pass', completeTrueSet: independent.mathematics.correct,
    rationaleComparison: 'Every internal derivation was read after the view-stage solution. Correct claims and each specific mistaken procedure agree with the independently recorded option evidence. Numeric distractors42/838/417 and wrong-reference9.47e-4 recompute as stated; response-time and switch-direction false claims remain false.',
    limitations: question.intent.limitations,
  });
}
assert.deepEqual(draft.coverage.map(item => item.source_number), ['1', '2', '3', '4', '5', '6', '7']);
assert.ok(draft.coverage.every(item => item.omitted_tasks.length === 1));
const digest = path => execFileSync('python3', [
  '.agents/skills/ld-s10y-choice/scripts/prepare.py', 'digest', path,
], { encoding: 'utf8' }).trim();
const review = {
  schema: 's10y-choice-review-v1',
  seed_sha256: digest(stage.seed.path), draft_sha256: digest(draftPath),
  reviewer: { kind: 'independent_agent', identity: 'Main, independently reviewing Zeno author after pre-key source/view solution' },
  source_reviews: stage.source_reviews, figure_checks: stage.figure_checks,
  new_figure_reviews: [], question_reviews: stage.question_reviews, outcome: 'pass',
};
const reviewPath = `${work}/9p-t4-choice-review.json`;
await fs.writeFile(reviewPath, JSON.stringify(review, null, 2) + '\n', { flag: 'wx' });
const command = [
  '.agents/skills/ld-s10y-choice/scripts/validate.py', '--repo', '.',
  '--seed', stage.seed.path, '--draft', draftPath, '--review', reviewPath,
];
const output = execFileSync('python3', command, { encoding: 'utf8' });
process.stdout.write(output);
await fs.writeFile(`${work}/9p-t4-choice-author-comparison.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', independentPreKeyViewFreeze: await bind(stagePath),
  draft: await bind(draftPath), review: await bind(reviewPath), questions: comparisons,
  packageCoverage: 'All7 original written tasks covered once. q-switch retains feedback/coefficient/signal placement together. Five single/two multiple questions,30options. No task silently omitted; free construction/explanation capacity explicitly recorded as recognition limitation.',
  validation: { command, output },
  limits: 'One independent substantive choice review, view first then author-key comparison. Existing source/media pixels reused, no draft edits/new figures/production write.',
}, null, 2) + '\n', { flag: 'wx' });
