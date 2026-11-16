import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral';
const card = 'phy9-c1-s7-t4';
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const verify = async value => {
  if (!value || typeof value !== 'object') return;
  if (value.path && value.sha256) assert.equal((await bind(value.path)).sha256, value.sha256, value.path);
  for (const child of Object.values(value)) await verify(child);
};
const freezePath = `${work}/9p-t4-answer-author-freeze.json`;
const freeze = await read(freezePath);
await verify(freeze);
const draft = await read(freeze.answerDraft.path);
const prepared = await read(freeze.inputs.nativePreparedAnswerTemplate.path);
const exercises = await read(`${root}/lessons/${card}/exercises.json`);
assert.equal(draft.answers.length, 7);
assert.deepEqual(draft.answers.map(item => item.exercise), exercises.exercises.map(item => item.number));
const observations = [
  'Uniform isotropic unconstrained expansion is a similarity transformation, so the shared-apex radial directions and phi remain unchanged. Actual fig101 original/previews inspected in this invocation and reused.',
  'At common equilibrium temperature and fixed liquid mass, liquid expansion exceeding capacity expansion below the co-expanding reference raises the level. The conclusion is explicitly conditional, not universal.',
  'Equal capillary area and common effective expansion coefficient give height sensitivity proportional to reservoir volume. Larger reservoir wins; equilibrium sensitivity is not response speed.',
  'Initial hoop diameter0.995m, increment0.005m and beta12e-6/K give418.760469K.419C integer approximation and420C coarse rounding are distinguished, without using wheel diameter as D0 or treating rise as final temperature.',
  'Equal fixed actual volumes give density ratio88/83. A theoretical fixed-mass reference gives gamma=(88/83-1)/60=0.001004016/K. Both samples are not incorrectly declared equal-mass.',
  'Fixed initially stress-free axial linear elasticity gives compressive magnitude proportional to temperature rise from0C;3e7*(25/10)=7.5e7Pa.15K would give only the additional stress, not the final value.',
  'Actual fig102 upper contact is over the free left portion, with right side fixed/connected and heater in series. Heating opens it by downward bend, lower layer smaller beta. Cooling restores contact; below-strip initially separated signal contact closes on warming. All three source response targets covered.',
];
for (const [index, answer] of draft.answers.entries()) {
  assert.equal(answer.prompt, exercises.exercises[index].text);
  assert.equal(answer.grading, 'ungraded');
  assert.deepEqual(answer.parts, []);
  assert.deepEqual(answer.figureEvidence, prepared.answers[index].figureEvidence);
  assert.equal(answer.source, index >= 3 && index <= 5 ? 'book' : 'derived');
  if (prepared.answers[index].bookRaw) assert.equal(answer.bookRaw, prepared.answers[index].bookRaw);
  else assert.equal(Object.hasOwn(answer, 'bookRaw'), false);
}
const gatePath = `${work}/9p-t4-answer-review.json`;
await fs.writeFile(gatePath, JSON.stringify({
  ticket: 'STEMROBIN-181', lesson: card, status: 'pass',
  reviewer: 'Main, independent of Einstein answer author',
  reviewKind: 'unique-independent-seven-task-answer-gate',
  bindings: {
    authorFreeze: await bind(freezePath), draft: freeze.answerDraft,
    prepared: freeze.inputs.nativePreparedAnswerTemplate,
    exercises: await bind(`${root}/lessons/${card}/exercises.json`),
    rawIndependentSolutions: await bind(`${work}/d017-independent-raw-solutions.md`),
    actualFigureReview: await bind(`${work}/9p-t4-figure-review.json`),
  },
  independentSolutionOrder: 'Main raw source solutions were recorded before any answer/choice draft or book-answer candidate. Complete current prompts and both original/current figures consumed; passed figure pixel gate reused.',
  answers: draft.answers.map((answer, index) => ({
    exercise: answer.exercise, status: 'pass', independentSolutionAndComparison: observations[index],
    originalBookRaw: answer.bookRaw ?? null, readOnly: true,
    promptAndFigureEvidenceUnchanged: true, completeResponseTargets: true,
  })),
  limits: 'Seven ungraded standards, parts[]; no answer-input interaction, unsafe operational instructions, new pixel/SCI/source gate or production writes. Author math-parse checks reused; batch offline display still pending.',
}, null, 2) + '\n', { flag: 'wx' });
const destination = `${root}/lessons/${card}/answer-keys.json`;
await fs.copyFile(freeze.answerDraft.path, destination, fs.constants.COPYFILE_EXCL);
const args = [
  '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'finalize',
  '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', card,
];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args, { encoding: 'utf8' });
process.stdout.write(output);
assert.equal((await read(destination)).status, 'ready');
await fs.writeFile(`${work}/d017-t4-answer-nativefinalization.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', gate: await bind(gatePath),
  draft: freeze.answerDraft, finalization: { command: args, output },
  output: await bind(destination),
  limits: 'One native answer-finalize only; no prepare repetition, interaction generation, publish or DB write.',
}, null, 2) + '\n', { flag: 'wx' });
