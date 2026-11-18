import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

const args = process.argv.slice(2);
assert.equal(args.length, 3);
assert.deepEqual(args.slice(0, 2), ['--execute', '--review-freeze-sha']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folder = `${base}/d522-t13-first-native-review-validation`;
const reviewFolder = `${base}/d521-t13-q7-first-affected-choice-review`;
const authorFolder = `${base}/d520-t13-q7-first-choice-stem-repair`;
assert.equal(await exists(folder), false, 'Never replay a first native invocation');
await verify(`${reviewFolder}/review-freeze.json`, args[2]);
await verify(`${authorFolder}/author-freeze.json`,
  '0d7a28c51e1d4e4fb5432e86ce06991ccf2de3e794e105329b74f2cafd35b837');
const reviewFreeze = await read(`${reviewFolder}/review-freeze.json`);
const authorFreeze = await read(`${authorFolder}/author-freeze.json`);
assert.ok(Array.isArray(reviewFreeze.files));
for (const freeze of [authorFreeze, reviewFreeze]) {
  for (const row of freeze.files) {
    await verify(row.path, row.sha256);
    assert.equal((await fs.stat(absolute(row.path))).mode & 0o777, 0o444, row.path);
  }
}
const sealFor = file => {
  const seal = reviewFreeze.files.find(row => absolute(row.path) === absolute(file));
  assert.ok(seal, `Missing independent frozen seal: ${file}`);
  return seal;
};
sealFor(`${reviewFolder}/report.json`);
const locales = [];
for (const locale of ['zh', 'en']) {
  const structural = await read(
    `${base}/d502-t13-q367-first-bilingual-choice-author/${locale}/first-structural-receipt.json`);
  assert.equal(structural.attempt, 1);
  assert.equal(structural.exit_code, 0);
  assert.equal(structural.review_flag_used, false);
  for (const row of [...structural.tool_bindings, ...structural.native_refreshed_source_input_bindings]) {
    await verify(row.path, row.sha256);
  }
  const seedPath = structural.seed.path;
  await verify(seedPath, structural.seed.sha256);
  const draftPath = `${authorFolder}/${locale}/draft.json`;
  const reviewPath = `${reviewFolder}/${locale}/review.json`;
  sealFor(reviewPath);
  const review = await read(reviewPath);
  assert.equal(review.schema, 's10y-choice-review-v1');
  assert.equal(review.reviewer.kind, 'independent_agent');
  assert.equal(review.outcome, 'pass');
  assert.deepEqual(review.question_reviews.map(row => row.question_id),
    ['t13-q3-ray-image', 't13-q6-oil-air', 't13-q7-prism-bound']);
  assert.deepEqual(review.question_reviews[2].mathematics.correct, ['a']);
  const draft = await read(draftPath);
  const original = await read(
    `${base}/d502-t13-q367-first-bilingual-choice-author/${locale}/draft.json`);
  assert.deepEqual(draft.questions.slice(0, 2), original.questions.slice(0, 2),
    'Inherit unchanged Q3/Q6 without replay');
  const command = {
    executable: structural.command.executable,
    argv: [
      structural.tool_bindings[0].path, '--repo',
      structural.command.argv[2], '--seed', seedPath,
      '--draft', absolute(draftPath), '--review', absolute(reviewPath),
    ],
    cwd: root, env_overrides: { PYTHONDONTWRITEBYTECODE: '1' },
  };
  locales.push({
    locale, command, seed: await bind(seedPath), draft: await bind(draftPath),
    review: await bind(reviewPath), firstStructure: structural,
    tools: structural.tool_bindings,
    sourceInputs: structural.native_refreshed_source_input_bindings,
  });
}
await immutableWrite(`${folder}/inputs-before.json`, serialize({
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-t13',
  authorFreeze: await bind(`${authorFolder}/author-freeze.json`),
  reviewFreeze: await bind(`${reviewFolder}/review-freeze.json`),
  independentReport: await bind(`${reviewFolder}/report.json`),
  locales, parentImageCount: 24, newParentImages: 0, noImageBudgetReset: true,
  completeChoiceCoverage: false, fullcard: false,
}));
const outcomes = [];
for (const row of locales) {
  const localeFolder = `${folder}/${row.locale}`;
  await immutableWrite(`${localeFolder}/started.json`, serialize({
    ticket: 'STEMROBIN-181', locale: row.locale, attempt: 1,
    validationWithReview: true, standaloneStructureRepeated: false,
    command: row.command, startedAt: new Date().toISOString(),
    seed: row.seed, draft: row.draft, review: row.review,
  }));
  const startedAt = new Date().toISOString();
  const result = spawnSync(row.command.executable, row.command.argv, {
    cwd: root, encoding: 'utf8', timeout: 120000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  await immutableWrite(`${localeFolder}/stdout.txt`, result.stdout ?? '');
  await immutableWrite(`${localeFolder}/stderr.txt`, result.stderr ?? '');
  const receiptPath = `${localeFolder}/first-native-review-receipt.json`;
  await immutableWrite(receiptPath, serialize({
    ticket: 'STEMROBIN-181', locale: row.locale, card: 'phy10-c2-s2-t13',
    command: row.command, startedAt, finishedAt: new Date().toISOString(),
    invocations: 1, standaloneStructureRepeated: false,
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    seed: row.seed, draft: row.draft, review: row.review,
    tools: row.tools, sourceInputs: row.sourceInputs,
    stdout: await bind(`${localeFolder}/stdout.txt`),
    stderr: await bind(`${localeFolder}/stderr.txt`),
    status: result.status === 0 ? 'SCOPED-NATIVE-REVIEW-PASS' : 'NATIVE-FAIL-HOLD-RETAINED',
    semanticsNotAutomaticallyProved: true, originalFirstQ7FAILPreserved: true,
    selectedSourceNumbers: ['3', '6', '7'], excludedSourceNumbers: ['1', '2', '4', '5'],
    completeChoiceCoverage: false, fullcard: false, newImages: 0, parentImageCount: 24,
    sourceProblemHOLDsPreserved: true, repairAttempt: 1, secondRepairAuthorized: false,
  }));
  outcomes.push({ locale: row.locale, exitCode: result.status, receipt: await bind(receiptPath) });
  for (const binding of [row.seed, row.draft, row.review, ...row.tools, ...row.sourceInputs]) {
    await verify(binding.path, binding.sha256);
  }
}
const reportPath = `${folder}/report.json`;
await immutableWrite(reportPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', card: 'phy10-c2-s2-t13',
  status: outcomes.every(row => row.exitCode === 0)
    ? 'SELECTED-THREE-CONDITIONAL-CHOICES-FIRST-NATIVE-REVIEW-PASS'
    : 'FIRST-NATIVE-FAIL-HOLD-RETAINED-NO-REPLAY',
  inputsBefore: await bind(`${folder}/inputs-before.json`), outcomes,
  validateWithReviewCalls: { zh: 1, en: 1 }, newStandaloneStructureCalls: 0,
  newSourceResolutions: 0, newSemanticReviewsByParent: 0,
  affectedReviewInherited: true, unchangedQ3Q6GatesInherited: true,
  originalFirstQ7FAILPreserved: true, allHistoricalFAILHOLDPreserved: true,
  completeChoiceCoverage: false, completeCardsAdded: 0, completeDeliveredCards: 98,
  fullcard: false, DISPLAY: 'NOT-RUN-NOT-PASSED',
  newImages: 0, parentImageCount: 24, noImageBudgetReset: true,
  sourcePagesAdded: 0, newPaidGeneration: 0, DBMergeDeployCommitPush: false,
}));
const files = [];
for (const file of await walk(folder)) {
  await fs.chmod(absolute(file), 0o444);
  files.push({ ...await bind(file), mode: '0444' });
}
await immutableWrite(`${folder}/native-freeze.json`, serialize({
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-t13', files,
  frozenAt: new Date().toISOString(), selfHashExcluded: true, mode: '0444',
  completeChoiceCoverage: false, fullcard: false,
}));
await fs.chmod(absolute(`${folder}/native-freeze.json`), 0o444);
console.log(JSON.stringify({ report: await bind(reportPath), outcomes }));
