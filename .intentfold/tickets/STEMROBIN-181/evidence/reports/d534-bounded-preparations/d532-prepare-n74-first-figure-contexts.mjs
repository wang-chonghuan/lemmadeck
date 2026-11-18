import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folder = `${base}/d532-n74-first-figure-contexts`;
const card = 'phy10-c2-s2-n74';
const candidate = `${base}/d489-n74-t13-first-bilingual-text-author/candidate/${card}`;
const reviewPath = `${base}/d491-n74-t13-first-independent-text-review/report.json`;
await verify(reviewPath, '959199fcf36328a9a8b8b59ba1b47087021f8639ad89859ad339a8babe54f61c');
const review = await read(reviewPath);
const gate = review.cards.find(row => row.card === card);
assert.equal(gate.SCI, 'PASS');
assert.equal(gate.ZHEN, 'PASS');
assert.equal(await exists(folder), false);
const contextRoot = `${folder}/context-root`;
const lessonRoot = `${contextRoot}/10p/editions/modern-us-neutral/lessons/${card}`;
for (const name of ['lesson', 'exercises']) {
  const file = `${candidate}/en/${name}.template.json`;
  const entry = review.candidate_bindings.find(row => absolute(row.path) === absolute(file));
  assert.ok(entry);
  await verify(file, entry.sha256);
  await immutableWrite(`${lessonRoot}/${name}.json`, await bytes(file));
}
const preparation = await read(`${base}/d488-n74-t13-first-source-preparation/manifest.json`);
const figures = (await read(`${candidate}/en/figures.template.json`)).figures;
assert.deepEqual(figures.map(row => row.id), ['fig-160', 'fig-161', 'fig-162', 'fig-163']);
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
  context.sourceImage.approvalScope = 'Hash-bound original extraction; existing RAW/SVG HOLDs are not cleared by context building.';
  context.authoritativeTextReview = await bind(reviewPath);
  const frozenContextPath = `${folder}/${figure.id}.context.json`;
  await immutableWrite(frozenContextPath, serialize(context));
  contexts.push({ figure: figure.id, context: await bind(frozenContextPath),
    originalImage: original, brief: figure.brief, firstContextBuild: true });
}
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', card,
  status: 'FIRST-FOUR-FIGURE-CONTEXTS-READY-AUTHORING-PENDING',
  textReview: await bind(reviewPath), contexts,
  fullZH: await bind(`${candidate}/zh/lesson.template.json`),
  fullEN: await bind(`${candidate}/en/lesson.template.json`),
  sourceQuestions: 0, SCI: 'PASS-INHERITED', ZHEN: 'PASS-INHERITED',
  FIG: 'pending', DISPLAY: 'pending', completeCard: false,
  parentImageOpens: 0, parentImageCount: 24, noImageBudgetReset: true,
  existingRAWAndSVG_HOLDsPreserved: true, SOURCE196ProceduralHOLDPreserved: true,
  SCIOrZHENRepeated: false, originalImagesChanged: false,
  newPermanentWorkersWorktreesBranches: 0, newPaidGeneration: 0, DBMergeDeploy: false,
}));
console.log(JSON.stringify(await bind(manifestPath)));
