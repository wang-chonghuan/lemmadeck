import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folder = `${base}/d545-n72-first-figure-contexts`;
const card = 'phy10-c2-s2-n72';
const candidate = `${base}/d479-n72-first-table-identity-repair/candidate`;
const reviewPath = `${base}/d480-n72-first-affected-table-review/report.json`;
const review = await read(reviewPath);
assert.equal(review.status, 'AFFECTED-PASS-SCI-ZHEN-COMPOSED-PASS');
assert.equal(review.SCI, 'PASS-INHERITED');
assert.equal(review.ZHEN, 'PASS-COMPOSED');
assert.equal(await exists(folder), false);
const repair = await read(`${base}/d479-n72-first-table-identity-repair/report.json`);
for (const row of repair.candidateBindings) await verify(row.path, row.sha256);
const contextRoot = `${folder}/context-root`;
const lessonRoot = `${contextRoot}/10p/editions/modern-us-neutral/lessons/${card}`;
for (const name of ['lesson', 'exercises']) {
  await immutableWrite(`${lessonRoot}/${name}.json`, await bytes(`${candidate}/en/${name}.template.json`));
}
const preparation = await read(`${base}/d445-n72-first-source-preparation/manifest.json`);
const figures = (await read(`${candidate}/en/figures.template.json`)).figures;
assert.deepEqual(figures.map(row => row.id),
  ['fig-151', 'fig-152', 'fig-153', 'fig-154', 'tbl-p0191-01', 'fig-155']);
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
  context.sourceImage.approvalScope = 'Original extraction only; historical SOURCE188/191 and RAW155/SVG155 HOLDs remain.';
  context.authoritativeTextReview = await bind(reviewPath);
  const frozenPath = `${folder}/${figure.id}.context.json`;
  await immutableWrite(frozenPath, serialize(context));
  contexts.push({ figure: figure.id, context: await bind(frozenPath),
    originalImage: original, brief: figure.text_brief, firstContextBuild: true });
}
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', card,
  status: 'FIRST-SIX-FIGURE-CONTEXTS-READY-NO-AUTHOR-OR-FIG-PASS-CLAIM',
  textReview: await bind(reviewPath), contexts,
  fullZH: await bind(`${candidate}/zh/lesson.template.json`),
  fullEN: await bind(`${candidate}/en/lesson.template.json`),
  sourceQuestions: 0, SCI: 'PASS-INHERITED', ZHEN: 'PASS-COMPOSED-INHERITED',
  FIG: 'pending', DISPLAY: 'pending', completeCard: false,
  plannedSeparateBatches: [['fig-151', 'fig-152'], ['fig-153', 'fig-154'], ['tbl-p0191-01', 'fig-155']],
  parentImageOpens: 0, parentImageCount: 24, noImageBudgetReset: true,
  historicalFAILHOLDPreserved: true, SCIOrZHENRepeated: false,
  originalImagesChanged: false, sourcePagesAdded: 0, completeCardsAdded: 0,
  newPermanentWorkersWorktreesBranches: 0, newPaidGeneration: 0, DBMergeDeploy: false,
}));
console.log(JSON.stringify(await bind(manifestPath)));
