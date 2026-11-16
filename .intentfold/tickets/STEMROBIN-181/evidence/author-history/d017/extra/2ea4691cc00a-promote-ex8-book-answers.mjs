import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const capture = `${work}/9p-ex7-answer-capture`;
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const bind = async file => ({
  path: file, sha256: crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex'),
});
const freeze = await read(`${capture}/author-freeze.json`);
const candidate = freeze.separate_next_batch_candidate.candidate;
assert.deepEqual(await bind(candidate.path), candidate);
const source = freeze.bindings.source;
assert.equal((await bind(source.path)).sha256, source.sha256);
const snippet = freeze.snippets.find(item => item.group === '练习 8');
assert.deepEqual(await bind(snippet.file.path), snippet.file);
const originalCropCheck = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '-c', 'import sys;from PIL import Image;a=Image.open(sys.argv[1]).convert("RGB");b=Image.open(sys.argv[2]).convert("RGB");x,y,w,h=map(int,sys.argv[3:]);assert a.crop((x,y,x+w,y+h)).tobytes()==b.tobytes();print("Exact original exercise8 pixels confirmed")',
  source.path, snippet.file.path, ...snippet.box_xywh.map(String),
], { encoding: 'utf8' });
const payload = await read(candidate.path);
const raw = ['$420$ 度.', '$\\approx0.001$ 度$^{-1}$.', '$7.5\\times10^7$ 牛顿/米$^2$.'];
assert.deepEqual(payload.answers.map(answer => answer.exercise), [4, 5, 6]);
assert.deepEqual(payload.answers.map(answer => answer.raw), raw);
assert.ok(payload.answers.every(answer => answer.lesson === 'phy9-c1-s7-t4' &&
  answer.pdfPage === 337 && answer.printedPage === 328));
const exercisesPath = `${root}/lessons/phy9-c1-s7-t4/exercises.json`;
const exercises = await read(exercisesPath);
assert.equal(exercises.count, 7);
assert.deepEqual(exercises.exercises.map(exercise => exercise.number), ['1', '2', '3', '4', '5', '6', '7']);
const durablePath = `${root}/answers.json`;
const beforeBinding = await bind(durablePath);
const before = await read(durablePath);
assert.equal(before.count, 41);
const gatePath = `${work}/answer-review-9p-ex8-capture.json`;
await fs.writeFile(gatePath, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass',
  reviewKind: 'unique-independent-initial-capture-gate-exercise8-only',
  reviewer: 'Main, independent of Carson source-answer author',
  order: 'Actual original exercise8 snippet opened and all3 entries read before candidate JSON.',
  authorFreeze: await bind(`${capture}/author-freeze.json`), candidate,
  source, snippet, exactOriginalCropCheck: originalCropCheck,
  originalSnippetActuallyOpened: true,
  originalSourceExercises: await bind(exercisesPath), prior41Answers: beforeBinding,
  entries: payload.answers.map(answer => ({ ...answer, status: 'source-faithful-pass' })),
  scope: 'Actual one-row exercise8 heading and exactlyprinted4/5/6. First420 hasno approximation sign; second0.001 hasone anddegree^-1; third7.5 times10^7 hasNewton/meter^2. No entries1/2/3/7 invented, no changedunits orderivedanswers.',
  limits: 'New capture scope only; prior41 answers andsource/figure/SCI gates not repeated. Doesnotapprove modernmath orcompletecard.',
}, null, 2) + '\n', { flag: 'wx' });
for (const answer of payload.answers) {
  assert.ok(!before.answers.some(item => item.lesson === answer.lesson && item.exercise === answer.exercise));
}
before.answers.push(...payload.answers);
before.count = before.answers.length;
await fs.writeFile(durablePath, JSON.stringify(before, null, 2) + '\n');
const command = ['.claude/skills/ld-s10y-answer/tools/answers.py', 'finalize', '--book', '9p'];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, { encoding: 'utf8' });
process.stdout.write(output);
const current = await read(durablePath);
assert.equal(current.status, 'captured');
assert.equal(current.count, 44);
assert.deepEqual(current.answers.filter(answer => answer.lesson !== 'phy9-c1-s7-t4'),
  before.answers.filter(answer => answer.lesson !== 'phy9-c1-s7-t4'));
await fs.writeFile(`${work}/answer-review-9p-ex8-capture-promotion.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', initialGate: await bind(gatePath),
  nativeFinalization: { command, output }, current: await bind(durablePath),
  prior41AnswersUnchanged: true, newFaithfulCapturedAnswers: 3,
  mathematicalAnswerApproval: false, productionWrite: false,
}, null, 2) + '\n', { flag: 'wx' });
