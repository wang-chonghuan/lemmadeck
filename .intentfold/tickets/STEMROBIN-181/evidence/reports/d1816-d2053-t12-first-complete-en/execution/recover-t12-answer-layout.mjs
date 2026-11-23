import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, read, save, bind, run, reuseBindings } from './n42-native.mjs';

const out = `${ticket}/tmp/d1816-t12-answer-layout-recovery`;
const originalNativeFile = `${ticket}/tmp/d1816-d2059-t12-first-en-native/result.json`;
const native = read(originalNativeFile);
const answerFile = `${native.target}/answer-keys.json`;
const reviewFile = `${out}/affected-answer-review.json`;
assert.equal(read(reviewFile).status, 'PASS');
const before = read(`${out}/answer-keys.before-layout.json`);
const after = read(answerFile);
const stripLayout = text => text.replace(/\\(?:begin|end)\{aligned\}|&|\\\\/g, '');
assert.deepEqual(
  { ...after, answers: after.answers.map(answer => ({ ...answer, displayAnswer: stripLayout(answer.displayAnswer) })) },
  before,
);
const carrierTarget = `${native.root}/10p/editions/modern-us-neutral-en/lessons/${native.card}`;
fs.copyFileSync(answerFile, `${carrierTarget}/answer-keys.json`);
const answerFinalize = run('t12-affected-answer-layout-finalize', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${repo}/.claude/skills/ld-s10y-answer/tools/lesson_answers.py`,
  'finalize', '--book', '10p', '--edition', 'modern-us-neutral-en',
  '--lesson', native.card, '--root', native.root, '--work', native.work,
], [], { checkpointOnly: true });
for (const name of ['answer-keys.json', 'answer-keys.audit.json'])
  fs.copyFileSync(`${carrierTarget}/${name}`, `${native.target}/${name}`);
const changedNames = new Set(['answer-keys.json', 'answer-keys.audit.json']);
reuseBindings(native.products.filter(item => !changedNames.has(path.basename(item.path))));
const products = native.products.map(item => changedNames.has(path.basename(item.path)) ? bind(item.path) : item);
save(`${out}/recovery.json`, {
  card: native.card, status: 'AFFECTED_ANSWER_LAYOUT_FINALIZE_PASS_DISPLAY_PENDING',
  originalNative: bind(originalNativeFile),
  before: bind(`${out}/answer-keys.before-layout.json`),
  beforeAudit: bind(`${out}/answer-keys.audit.before-layout.json`),
  currentAnswer: bind(answerFile), affectedReview: bind(reviewFile),
  originalPixelFailure: bind(`${ticket}/tmp/d1816-d2050-t12-whole-pixels/review.json`),
  changedAnswers: ['2', '3', '4'], changedDisplayMathChains: 7,
  change: 'Only aligned environment, alignment columns and row breaks added to seven long calculation chains.',
  equationsEnglishMetadataAndAnswer1Unchanged: true,
  originalAuthorAndOriginalFailurePreserved: true,
  passedBaseAndUnchangedRenderReused: true,
  answerFinalizeCheckpointKey: answerFinalize.key,
  imagesOpened: 0, databaseWrites: 0, paidCalls: 0,
});
save(`${out}/result.json`, {
  ...native, products, answerLayoutRecovery: bind(`${out}/recovery.json`),
  affectedAnswerFinalizeCheckpointKey: answerFinalize.key,
  unchangedBaseFinalizeAndRenderReused: true,
});
const meterFile = `${ticket}/production-meter.json`, meter = read(meterFile);
const state = meter.currentResume1817;
state.activeLesson = native.card;
state.stage = 'Ex10 seven affected equation chains repaired and answer-finalize passed; affected display/pixels next.';
state.ex10DisplayRecovery = {
  status: 'affected-layout-and-answer-finalize-pass-display-pending',
  changedAnswers: ['2', '3', '4'], changedDisplayMathChains: 7,
  affectedAnswerReview: path.relative(repo, reviewFile),
  recovery: path.relative(repo, `${out}/recovery.json`),
  originalFailurePreserved: true, originalAuthorUnchanged: true,
  parentImageOpens: 0, producerDatabaseWrites: 0, newExternalPaidCalls: 0,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ card: native.card, status: 'affected-answer-finalize-pass', native: `${out}/result.json` }));
