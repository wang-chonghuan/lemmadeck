import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { ticket, book, read, bind, bytes, immutableWrite } from './retain-d016-evidence.mjs';

const tmp = `${ticket}/tmp`;
const native = `${tmp}/d021-n83-n84-native-text-20261116-a.py`;
const profile = await read('.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json');
const run = payload => JSON.parse(execFileSync(
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', ['-B', native], {
    input: JSON.stringify({ book, ...payload }), encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  }));
const selection = [[92, 8]];
for (const [number, block] of selection) {
  const changed = Array.isArray(block) ? block : [block];
  const card = `phy9-c2-s3-n${number}`;
  const folder = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card}`;
  const lessonPath = `${folder}/lesson.template.json`;
  const exercisesPath = `${folder}/exercises.template.json`;
  const work = `${tmp}/d023-sci-correction/n${number}`;
  const freezePath = `${tmp}/9p-n${number}-prose-correction-freeze.json`;
  const originalFreezePath = `${tmp}/9p-n${number}-prose-freeze.json`;
  const originalReviewPath = `${tmp}/9p-n${number}-science-review.json`;
  const originalFreeze = await read(originalFreezePath);
  const originalReview = await read(originalReviewPath);
  assert.equal(originalReview.status, 'fail');
  assert.equal(originalReview.findings.length, 1);
  const beforePath = originalFreeze.templates.find(item =>
    (item.active?.path ?? item.original?.path).endsWith('/lesson.template.json')).snapshot.path;
  const before = await read(beforePath);
  const lesson = await read(lessonPath);
  const expected = structuredClone(before);
  for (const index of changed) expected.prose[index].text = lesson.prose[index].text;
  assert.deepEqual(lesson, expected, 'Correction must affect only the identified prose text.');
  for (const index of changed) assert.notEqual(before.prose[index].text, lesson.prose[index].text);
  const exercises = await read(exercisesPath);
  const normalized = run({ mode: 'normalize', lesson, exercises });
  for (let index = 0; index < before.prose.length; index++) {
    if (!changed.includes(index)) assert.deepEqual(normalized.lesson.prose[index], before.prose[index]);
  }
  assert.deepEqual(normalized.exercises, exercises);
  assert.deepEqual(normalized.lesson.section_breaks, before.section_breaks);
  const textCheck = run({ mode: 'validate-text', ...normalized, profile });
  await immutableWrite(`${work}/native-text-check.json`, `${JSON.stringify(textCheck, null, 2)}\n`);
  assert.deepEqual(textCheck.errors, []);
  await fs.writeFile(lessonPath, `${JSON.stringify(normalized.lesson, null, 2)}\n`);
  const flowOutput = execFileSync(process.execPath, [
    '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', lessonPath,
  ], { encoding: 'utf8' });
  const flow = JSON.parse(flowOutput);
  await immutableWrite(`${work}/native-flow.json`, flowOutput);
  await immutableWrite(`${work}/lesson.template.json`, await bytes(lessonPath));
  await immutableWrite(freezePath, `${JSON.stringify({
    ticket: 'STEMROBIN-181', batch: 'D023', lesson: card,
    status: 'affected-prose-correction-frozen-awaiting-independent-SCI',
    changedBlock: block, finding: originalReview.findings[0].id,
    before: { freeze: await bind(originalFreezePath), review: await bind(originalReviewPath),
      lesson: await bind(beforePath) },
    bindings: {
      lessonTemplate: await bind(lessonPath), exercisesTemplate: await bind(exercisesPath),
      figuresTemplate: await bind(`${folder}/figures.template.json`),
      sourceLesson: await bind(`${book}/lessons/${card}/lesson.json`),
      sourceExercises: await bind(`${book}/lessons/${card}/exercises.json`),
      correctedSnapshot: await bind(`${work}/lesson.template.json`),
      nativeText: await bind(`${work}/native-text-check.json`),
      nativeFlow: await bind(`${work}/native-flow.json`),
      nativeHelper: await bind(native),
    },
    delta: changed.map(index => ({
      block: index, before: before.prose[index].text, after: normalized.lesson.prose[index].text,
    })),
    paragraphs: flow.paragraphs.length, boundaries: normalized.lesson.section_breaks,
    sourceAndFormulaAndNumberAndOtherBlocksUnchanged: true,
    independentReviewCalls: 0, nativeTextAndFlowCorrectionRuns: 1,
    imageOpens: 0, sourceGates: 0, geometryRepairs: 0,
  }, null, 2)}\n`);
  console.log(JSON.stringify(await bind(freezePath)));
}
