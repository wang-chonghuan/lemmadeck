import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const [execute, reviewSha, freezeSha] = process.argv.slice(2);
assert.equal(execute, '--execute');
assert.equal(process.argv.slice(2).length, 3);
assert.match(reviewSha, /^[a-f0-9]{64}$/);
assert.match(freezeSha, /^[a-f0-9]{64}$/);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folder = `${base}/d593-n76-first-figure-contexts`;
const card = 'phy10-c2-s2-n76';
const candidate = `${base}/d597-n76-r08-first-text-repair/candidate`;
const reviewPath = `${base}/d598-n76-r08-first-affected-text-review/report.json`;
const freezePath = `${base}/d598-n76-r08-first-affected-text-review/review-freeze.json`;
await verify(reviewPath, reviewSha);
await verify(freezePath, freezeSha);
const review = await read(reviewPath), freeze = await read(freezePath);
assert.equal(review.gates.SCI.status, 'PASS');
assert.equal(review.gates.ZHEN.status, 'PASS');
assert.deepEqual(review.gates.SCI.blocking_list, []);
assert.deepEqual(review.gates.ZHEN.blocking_list, []);
for (const row of freeze.files) await verify(row.path, row.sha256);
assert.equal(await exists(folder), false);
await verify(`${base}/d597-n76-r08-first-text-repair/report.json`,
  'e9451961ef81508ed3b364ab18b4446aa307ff247d4d335f2aca1c0bd3384a6e');
const author = await read(`${base}/d597-n76-r08-first-text-repair/report.json`);
for (const row of author.candidates) await verify(row.path, row.sha256);
const contextRoot = `${folder}/context-root`;
const lessonRoot = `${contextRoot}/10p/editions/modern-us-neutral/lessons/${card}`;
for (const name of ['lesson', 'exercises']) {
  await immutableWrite(`${lessonRoot}/${name}.json`, await bytes(`${candidate}/en/${name}.template.json`));
}
const preparation = await read(`${base}/d581-n76-first-source-preparation/manifest.json`);
const figures = (await read(`${candidate}/en/figures.template.json`)).figures;
assert.deepEqual(figures.map(row => row.id), ['fig-177', 'fig-178', 'fig-179', 'fig-180']);
const contexts = [];
for (const figure of figures) {
  const original = preparation.inputs.find(row =>
    row.path.endsWith(`/figures/${figure.id}.png`) && row.sha256 === figure.source.png.sha256);
  assert.ok(original, figure.id);
  await verify(original.path, original.sha256);
  await immutableWrite(`${contextRoot}/10p/figures/${figure.id}.png`, await bytes(original.path));
  const contextPath = `${folder}/${figure.id}.native-context.json`;
  const command = [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.agents/skills/ld-s10y-image/scripts/build_context.py',
    '--book', '10p', '--edition', 'modern-us-neutral', '--figure', figure.id,
    '--root', absolute(contextRoot), '--output', absolute(contextPath),
  ];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 30000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  await immutableWrite(`${folder}/${figure.id}.context-command.json`,
    serialize({ command, invocations: 1, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }));
  assert.equal(result.status, 0, result.stderr);
  const context = await read(contextPath);
  assert.equal(context.sourceImage.sha256, original.sha256);
  context.sourceImage.path = original.path;
  context.sourceImage.approvalScope = 'Existing first independent extraction-fidelity PASS only; not modern FIG or DISPLAY approval.';
  context.authoritativeTextReview = await bind(reviewPath);
  const frozenPath = `${folder}/${figure.id}.context.json`;
  await immutableWrite(frozenPath, serialize(context));
  contexts.push({ figure: figure.id, context: await bind(frozenPath),
    originalImage: original, firstContextBuild: true });
}
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', card,
  status: 'FIRST-N76-FIGURE-CONTEXTS-READY-TEXT-PASS-NO-FIG-PASS',
  textReview: await bind(reviewPath), textReviewFreeze: await bind(freezePath), contexts,
  fullZH: await bind(`${candidate}/zh/lesson.template.json`),
  fullEN: await bind(`${candidate}/en/lesson.template.json`),
  sourceQuestions: 0, SCI: 'PASS-INHERITED-NOT-REPEATED', ZHEN: 'PASS-INHERITED-NOT-REPEATED',
  FIG: 'pending', DISPLAY: 'pending', completeCard: false,
  plannedSeparateBatches: [['fig-177', 'fig-178'], ['fig-179', 'fig-180']],
  parentImageOpens: 0, parentImageCount: 24, noImageBudgetReset: true,
  historicalFAILHOLDPreserved: true, originalImagesChanged: false,
  sourcePagesAdded: 0, completeCardsAdded: 0,
  newPermanentWorkersWorktreesBranches: 0, newPaidGeneration: 0, DBMergeDeploy: false,
}));
console.log(JSON.stringify(await bind(manifestPath)));
