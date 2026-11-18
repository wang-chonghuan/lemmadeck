import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folder = `${base}/d581-n76-first-source-preparation`;
const card = 'phy10-c2-s2-n76';
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const boundaryPath = `${base}/d575-source204-first-independent-review/report.json`;
const boundaryFreezePath = `${base}/d575-source204-first-independent-review/review-freeze.json`;
await verify(boundaryPath, '000a788b79fec1d627e7ddc9336bc3d04b32b944caf8cb310ac35cc11440bf33');
await verify(boundaryFreezePath, '695f6b9d550995efa6c0fccb73e8d2cc1076449b8e4e9d1abf41379be7fd7538');
const boundaryFreeze = await read(boundaryFreezePath);
for (const entry of boundaryFreeze.entries) await verify(entry.path, entry.sha256);
const boundary = await read(boundaryPath);
assert.equal(boundary.gates.SOURCE204.status, 'PASS');
assert.deepEqual(boundary.gates.SOURCE204.blocking_list, []);
assert.equal(boundary.gates.N76_RIGHT_BOUNDARY.status, 'PASS');
assert.deepEqual(boundary.gates.N76_RIGHT_BOUNDARY.blocking_list, []);
assert.equal(boundary.gates.N76_RIGHT_BOUNDARY.native_one_based_ref, 'p0204#1');
assert.equal(boundary.gates.N76_RIGHT_BOUNDARY.carryover_before_heading, false);
const accepted203 = `${base}/d569-source203-first-independent-review/report.json`;
await verify(accepted203, '8c1642a0e31b320d960b317b20fb7a0202b1c120d5b55e59a5f8fe6c8ae20824');
const boundaryBinding = await bind(boundaryPath);
assert.equal(await exists(folder), false);
const inputs = [boundaryBinding, await bind(boundaryFreezePath), await bind(accepted203)];
for (const [file, sha256] of [
  [`${base}/d573-n76-preauthor-source202-requirements/source-requirements.json`,
    '8d739ab32f03e50c5cff7ebc9f395d940b716a0cecd60e2e4c0199fdf4a1dd30'],
  [`${base}/d580-n76-source203-requirement-extension/report.json`,
    'cd45d42349ceb01aa9935db0136ee5e25c1d083125d3cb90561cc5c2a48c3c97'],
]) {
  await verify(file, sha256);
  inputs.push(await bind(file));
}
const projections = [];
for (let page = 202; page <= 204; page++) {
  const id = String(page).padStart(4, '0');
  const source = page === 204 ? `${base}/d570-source204-first-author/source/10p` : raw;
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const file = `${source}/pages/${id}/${name}`;
    const input = await bind(file);
    inputs.push(input);
    const data = await bytes(file);
    await immutableWrite(`${folder}/full-source/10p/pages/${id}/${name}`, data);
    let view = data;
    if (name === 'page.json' && page === 202) {
      const doc = JSON.parse(data);
      assert.equal(doc.blocks[0].kind, 'h3');
      assert.equal(doc.blocks[0].lines.join(''), '76. 透镜成像作图法');
    }
    if (name === 'page.json' && page === 204) {
      const doc = JSON.parse(data);
      assert.equal(doc.blocks[0].kind, 'h3');
      assert.ok(doc.blocks[0].lines.join('').startsWith('77. '));
      doc.blocks = doc.blocks.slice(0, 1);
      view = Buffer.from(serialize(doc));
      projections.push({
        page, fullSource: input, rightBoundary: 'p0204#1', retainedRefs: ['p0204#1'],
        excludedIncompleteN77: true, noSourceWordsChanged: true,
        authority: boundaryBinding,
      });
    }
    await immutableWrite(`${folder}/root/10p/pages/${id}/${name}`, view);
  }
}
for (let number = 177; number <= 180; number++) {
  const id = `fig-${number}`;
  for (const extension of ['png', 'svg']) {
    const file = `${raw}/figures/${id}.${extension}`;
    inputs.push(await bind(file));
    await immutableWrite(`${folder}/root/10p/figures/${id}.${extension}`, await bytes(file));
  }
}
await immutableWrite(`${folder}/started.json`, serialize({
  ticket: 'STEMROBIN-181', card, inputs, projections,
  scopedTextSOURCE: 'PASS-existing-202203-and-first-independent-actual-204-right-boundary',
  firstScopedAssembly: true, firstModernPreparation: true, newImages: 0,
  historicalFAILHOLDPreserved: true,
}));
const common = ['--book', '10p', '--root', absolute(`${folder}/root`),
  '--work', absolute(`${folder}/work`)];
for (const [stage, args] of [
  ['assemble', [...common, '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json']],
  ['adapt-prepare', [...common, '--edition', 'modern-us-neutral', '--lesson', card]],
]) {
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', stage, ...args];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  await immutableWrite(`${folder}/${stage}.json`, serialize({
    command, invocations: 1, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }));
  assert.equal(result.status, 0, `${stage}: ${result.stdout}\n${result.stderr}`);
}
const lessonPath = `${folder}/root/10p/lessons/${card}/lesson.json`;
const exercisePath = `${folder}/root/10p/lessons/${card}/exercises.json`;
const lesson = await read(lessonPath), exercises = await read(exercisePath);
assert.equal(lesson.card_id, card);
assert.equal(exercises.exercises.length, 0);
assert.ok(lesson.prose.every(row => row.source_refs.every(ref => !ref.startsWith('p0204#'))));
assert.deepEqual(lesson.figures.map(row => row.id), ['fig-177', 'fig-178', 'fig-179', 'fig-180']);
for (const row of inputs) await verify(row.path, row.sha256);
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', card,
  status: 'FIRST-SCOPED-N76-ASSEMBLY-MODERN-TEXT-PENDING-HOLDS-PRESERVED',
  inputs, projections, sourceLesson: await bind(lessonPath), sourceExercises: await bind(exercisePath),
  sourceQuestions: 0, proseBlocks: lesson.prose.length, figures: lesson.figures.map(row => row.id),
  rawRoot: `${folder}/root`, work: `${folder}/work`,
  templateDirectory: `${folder}/work/adapt/10p/modern-us-neutral/lessons/${card}`,
  scopedBodySource: 'PASS-existing-source-and-first-independent-actual-right-boundary',
  SCI: 'pending', ZHEN: 'pending', FIG: 'pending', DISPLAY: 'pending', completeCard: false,
  incompleteN77Excluded: true, sourcePagesAdded: 0, completeCardsAdded: 0, canonicalWrites: false,
  newImages: 0, parentImageCount: 24, noImageBudgetReset: true,
  historicalFAILHOLDPreserved: true, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
}));
console.log(JSON.stringify({ manifest: await bind(manifestPath), proseBlocks: lesson.prose.length,
  sourceQuestions: exercises.exercises.length, figures: lesson.figures.map(row => row.id) }));
