import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folder = `${base}/d572-n75-first-figure-contexts`;
const card = 'phy10-c2-s2-n75';
const candidate = `${base}/d566-n75-first-bilingual-text-author/candidate`;
const reviewPath = `${base}/d568-n75-first-independent-text-review/report.json`;
await verify(reviewPath, '1f6feb01e70e2483b130643f338ac76a38e5430339bfc94563d4f92fa7e1f5ca');
const review = await read(reviewPath);
assert.equal(review.SCI, 'PASS');
assert.equal(review.ZHEN, 'PASS');
assert.equal(await exists(folder), false);
const author = await read(`${base}/d566-n75-first-bilingual-text-author/report.json`);
for (const row of author.candidates) await verify(row.path, row.sha256);
const contextRoot = `${folder}/context-root`;
const lessonRoot = `${contextRoot}/10p/editions/modern-us-neutral/lessons/${card}`;
for (const name of ['lesson', 'exercises']) {
  await immutableWrite(`${lessonRoot}/${name}.json`, await bytes(`${candidate}/en/${name}.template.json`));
}
const preparation = await read(`${base}/d564-n75-first-source-preparation/manifest.json`);
const figures = (await read(`${candidate}/en/figures.template.json`)).figures;
assert.deepEqual(figures.map(row => row.id), Array.from({ length: 13 }, (_, index) => `fig-${164 + index}`));
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
  context.sourceImage.approvalScope = 'Necessary original extraction fidelity only; all original fine-detail FAIL/HOLD and source201 ordering qualification remain. No modern FIG approval.';
  context.authoritativeTextReview = await bind(reviewPath);
  const frozenPath = `${folder}/${figure.id}.context.json`;
  await immutableWrite(frozenPath, serialize(context));
  contexts.push({ figure: figure.id, context: await bind(frozenPath),
    originalImage: original, firstContextBuild: true });
}
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', card,
  status: 'FIRST-N75-FIGURE-CONTEXTS-READY-TEXT-PASS-NO-FIG-PASS',
  textReview: await bind(reviewPath), contexts,
  fullZH: await bind(`${candidate}/zh/lesson.template.json`),
  fullEN: await bind(`${candidate}/en/lesson.template.json`),
  sourceQuestions: 0, SCI: 'PASS-INHERITED-NOT-REPEATED', ZHEN: 'PASS-INHERITED-NOT-REPEATED',
  FIG: 'pending', DISPLAY: 'pending', completeCard: false,
  plannedSeparateBatches: [
    ['fig-164', 'fig-165'], ['fig-166', 'fig-167'], ['fig-168', 'fig-169'],
    ['fig-170', 'fig-171'], ['fig-172', 'fig-173'], ['fig-174', 'fig-175'], ['fig-176'],
  ],
  parentImageOpens: 0, parentImageCount: 24, noImageBudgetReset: true,
  historicalFAILHOLDPreserved: true, originalImagesChanged: false,
  sourcePagesAdded: 0, completeCardsAdded: 0,
  newPermanentWorkersWorktreesBranches: 0, newPaidGeneration: 0, DBMergeDeploy: false,
}));
console.log(JSON.stringify(await bind(manifestPath)));
