import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folder = `${base}/d564-n75-first-source-preparation`;
const card = 'phy10-c2-s2-n75';
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const boundaryPath = `${base}/d560-source202-first-independent-review/report.json`;
await verify(boundaryPath, '26be6ba4f2b576018b03e3807663fb026b9bd1117e6ed73a5167a2c8b9e1355e');
await verify(`${base}/d560-source202-first-independent-review/review-freeze.json`,
  'fff6ca53729def6e10e4622d6b8da88f0388a68303de03b907268df9ef66e10c');
const boundary = await read(boundaryPath);
assert.equal(boundary.gates.N75_RIGHT_BOUNDARY.status, 'PASS');
assert.deepEqual(boundary.gates.N75_RIGHT_BOUNDARY.blocking_list, []);
const boundaryBinding = await bind(boundaryPath);
assert.equal(await exists(folder), false);
const inputs = [boundaryBinding];
for (const file of [
  `${base}/d552-n75-native-ref-adapter/source-requirements.native-refs.json`,
  `${base}/d552-n75-native-ref-adapter/source200-extension.native-refs.json`,
  `${base}/d562-n75-source201-requirement-extension/report.json`,
  `${ticket}/evidence/reports/d558-source201-consumed-and-first-figure-records.json`,
]) inputs.push(await bind(file));
const projections = [];
for (let page = 197; page <= 202; page++) {
  const id = String(page).padStart(4, '0');
  const source = page === 202 ? `${base}/d554-source202-first-author/source/10p` : raw;
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const file = `${source}/pages/${id}/${name}`;
    const input = await bind(file);
    inputs.push(input);
    const data = await bytes(file);
    await immutableWrite(`${folder}/full-source/10p/pages/${id}/${name}`, data);
    let view = data;
    if (name === 'page.json' && page === 197) {
      const doc = JSON.parse(data);
      assert.equal(doc.blocks[2].kind, 'h3');
      assert.equal(doc.blocks[2].lines.join(''), '75. 透镜');
    }
    if (name === 'page.json' && page === 202) {
      const doc = JSON.parse(data);
      assert.equal(doc.blocks[0].kind, 'h3');
      assert.equal(doc.blocks[0].lines.join(''), '76. 透镜成像作图法');
      doc.blocks = doc.blocks.slice(0, 1);
      view = Buffer.from(serialize(doc));
      projections.push({
        page, fullSource: input, rightBoundary: 'p0202#1', retainedRefs: ['p0202#1'],
        excludedIncompleteN76: true, noSourceWordsChanged: true,
        authority: boundaryBinding,
      });
    }
    await immutableWrite(`${folder}/root/10p/pages/${id}/${name}`, view);
  }
}
for (let number = 164; number <= 176; number++) {
  const id = `fig-${number}`;
  for (const extension of ['png', 'svg']) {
    const file = `${raw}/figures/${id}.${extension}`;
    inputs.push(await bind(file));
    await immutableWrite(`${folder}/root/10p/figures/${id}.${extension}`, await bytes(file));
  }
}
await immutableWrite(`${folder}/started.json`, serialize({
  ticket: 'STEMROBIN-181', card, inputs, projections,
  scopedTextSOURCE: 'PASS-composed-existing-content-with-first-independent-actual-right-boundary',
  firstScopedAssembly: true, firstModernPreparation: true, newImages: 0,
  historicalSourceQualificationsPreserved: true,
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
assert.ok(lesson.prose.every(row => row.source_refs.every(ref =>
  (!ref.startsWith('p0197#') || Number(ref.split('#')[1]) >= 4) &&
  !ref.startsWith('p0202#'))));
assert.deepEqual(lesson.figures.map(row => row.id),
  Array.from({ length: 13 }, (_, index) => `fig-${164 + index}`));
for (const row of inputs) await verify(row.path, row.sha256);
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', card,
  status: 'FIRST-SCOPED-N75-ASSEMBLY-MODERN-TEXT-PENDING-HISTORICAL-HOLDS-PRESERVED',
  inputs, projections, sourceLesson: await bind(lessonPath), sourceExercises: await bind(exercisePath),
  sourceQuestions: 0, proseBlocks: lesson.prose.length, figures: lesson.figures.map(row => row.id),
  rawRoot: `${folder}/root`, work: `${folder}/work`,
  templateDirectory: `${folder}/work/adapt/10p/modern-us-neutral/lessons/${card}`,
  scopedBodySource: 'PASS-composed-existing-text-and-first-actual-right-boundary-evidence',
  historicalSourceQualificationsPreserved: true, modernFigureSourceInventoriesStillRequired: true,
  SCI: 'pending', ZHEN: 'pending', FIG: 'pending', DISPLAY: 'pending', completeCard: false,
  priorT13ExcludedFromModernPreparation: true, incompleteN76Excluded: true,
  sourcePagesAdded: 0, completeCardsAdded: 0, canonicalWrites: false,
  newImages: 0, parentImageCount: 24, noImageBudgetReset: true,
  historicalFAILHOLDPreserved: true, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
}));
console.log(JSON.stringify({ manifest: await bind(manifestPath), proseBlocks: lesson.prose.length,
  sourceQuestions: exercises.exercises.length, figures: lesson.figures.map(row => row.id) }));
