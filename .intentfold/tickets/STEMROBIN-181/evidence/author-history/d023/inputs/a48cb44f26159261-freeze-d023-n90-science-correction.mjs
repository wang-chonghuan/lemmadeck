import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { ticket, book, read, bytes, bind, verify, exists, immutableWrite } from './retain-d016-evidence.mjs';

const tmp = `${ticket}/tmp`;
const folder = '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s3-n90';
const lessonPath = `${folder}/lesson.template.json`;
const work = `${tmp}/d023-sci-correction/n90`;
const output = `${tmp}/9p-n90-prose-correction-freeze.json`;
assert.ok(!await exists(output) && !await exists(`${work}/started.json`));
const reviewPath = `${tmp}/9p-n90-science-review.json`;
await verify(reviewPath, 'deff7c17744ba08b199c3544e5e7ab57f8016c767df673a5f3765a0ef525e9f2');
const review = await read(reviewPath);
assert.equal(review.status, 'fail');
assert.deepEqual(review.findings.map(row => row.id), ['SCI90-01', 'SCI90-02', 'SCI90-03']);
const freezePath = `${tmp}/9p-n90-prose-freeze.json`;
const freeze = await read(freezePath);
const beforePath = freeze.templates.find(row => row.active.path.endsWith('/lesson.template.json')).snapshot.path;
const before = await read(beforePath);
const current = await read(lessonPath);
const expected = structuredClone(before);
for (const index of [12, 18]) expected.prose[index].text = current.prose[index].text;
expected.prose[12].changes = [...before.prose[12].changes, 'context-number'];
expected.prose[12].numeric_changes = current.prose[12].numeric_changes;
assert.deepEqual(current, expected);
assert.equal(current.prose[12].numeric_changes.length, 1);
assert.equal(current.prose[12].numeric_changes[0].from, '1787');
assert.equal(current.prose[12].numeric_changes[0].to, '1789');
const helper = `${tmp}/d021-n83-n84-native-text-20261116-a.py`;
const exercisesPath = `${folder}/exercises.template.json`;
const exercises = await read(exercisesPath);
const profile = await read('.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json');
await immutableWrite(`${work}/started.json`, `${JSON.stringify({
  original: await bind(beforePath), current: await bind(lessonPath), review: await bind(reviewPath),
  helper: await bind(helper), scope: 'One correction-only normalize, text check and flow; no original gate replay.',
}, null, 2)}\n`);
const run = payload => JSON.parse(execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python',
  ['-B', helper], { input: JSON.stringify({ book, ...payload }), encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } }));
const normalized = run({ mode: 'normalize', lesson: current, exercises });
for (let index = 0; index < before.prose.length; index++) {
  if (![12, 18].includes(index)) assert.deepEqual(normalized.lesson.prose[index], before.prose[index]);
}
assert.deepEqual(normalized.exercises, exercises);
assert.deepEqual(normalized.lesson.section_breaks, before.section_breaks);
const check = run({ mode: 'validate-text', ...normalized, profile });
await immutableWrite(`${work}/native-text-check.json`, `${JSON.stringify(check, null, 2)}\n`);
assert.deepEqual(check.errors, []);
await fs.writeFile(lessonPath, `${JSON.stringify(normalized.lesson, null, 2)}\n`);
const flow = execFileSync(process.execPath,
  ['.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', lessonPath], { encoding: 'utf8' });
await immutableWrite(`${work}/native-flow.json`, flow);
await immutableWrite(`${work}/lesson.template.json`, await bytes(lessonPath));
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D023', lesson: 'phy9-c2-s3-n90',
  status: 'affected-prose-correction-frozen-awaiting-independent-SCI',
  changedBlocks: [12, 18], findings: review.findings.map(row => row.id),
  before: { freeze: await bind(freezePath), review: await bind(reviewPath), lesson: await bind(beforePath) },
  bindings: {
    lessonTemplate: await bind(lessonPath), exercisesTemplate: await bind(exercisesPath),
    figuresTemplate: await bind(`${folder}/figures.template.json`),
    sourceLesson: await bind(`${book}/lessons/phy9-c2-s3-n90/lesson.json`),
    sourceExercises: await bind(`${book}/lessons/phy9-c2-s3-n90/exercises.json`),
    correctedSnapshot: await bind(`${work}/lesson.template.json`),
    nativeText: await bind(`${work}/native-text-check.json`),
    nativeFlow: await bind(`${work}/native-flow.json`), nativeHelper: await bind(helper),
  },
  delta: [12, 18].map(index => ({ block: index,
    before: before.prose[index].text, after: normalized.lesson.prose[index].text })),
  historicalNumericCorrection: normalized.lesson.prose[12].numeric_changes,
  externalEvidenceReused: review.externalEvidence,
  faithfulSourceAndFormulaAndOtherBlocksAndTasksAndFiguresUnchanged: true,
  originalSCIObservationsReused: true, independentReviewCalls: 0, correctionNativeSequences: 1,
  imageOpens: 0, sourceGateReplays: 0, geometryRepairs: 0,
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(output)));
