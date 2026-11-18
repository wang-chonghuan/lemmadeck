import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const folder = `${ticket}/tmp/d475-n73-first-source-preparation`;
const card = 'phy10-c2-s2-n73';
const base = `${ticket}/tmp`;
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
assert.equal(await exists(folder), false);
const inputs = [];
for (const file of [
  `${base}/d437-source192-h01-first-detail-review/report.json`,
  `${base}/d448-source193195-first-independent-text-review/report.json`,
  `${base}/d460-source193194-first-affected-text-review/report.json`,
  `${base}/d450-source193-raw156157-first-independent-review/report.json`,
]) inputs.push(await bind(file));
const affected = await read(inputs[2].path);
assert.equal(affected.combined_current_TEXT, 'PASS');
assert.equal(affected.SOURCE193_TEXT, 'PASS');
assert.equal(affected.SOURCE194_TEXT, 'PASS');
const initial = await read(inputs[1].path);
assert.equal(initial.SOURCE195_TEXT, 'PASS');
assert.equal(initial.boundary_and_question_limits.preceding_unit_end,
  'Observed immediately before 74 heading, after fiber-optics paragraph and fig159 caption.');
const projections = [];
for (let page = 192; page <= 195; page++) {
  const id = String(page).padStart(4, '0');
  const source = page === 192 ? raw
    : page <= 194 ? `${base}/d459-source193194-first-literal-repair/source/10p`
      : `${base}/d435-source193195-first-author/source/10p`;
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const file = `${source}/pages/${id}/${name}`;
    const input = await bind(file);
    inputs.push(input);
    const data = await bytes(file);
    await immutableWrite(`${folder}/full-source/10p/pages/${id}/${name}`, data);
    let view = data;
    if (name === 'page.json' && page === 192) {
      const doc = JSON.parse(data);
      assert.equal(doc.blocks[3].kind, 'h3');
      assert.equal(doc.blocks[3].lines.join(''), '73. 全反射');
      assert.equal(doc.blocks[4].open, true);
    }
    if (name === 'page.json' && page === 195) {
      const doc = JSON.parse(data);
      assert.equal(doc.blocks[4].kind, 'h3');
      assert.equal(doc.blocks[4].lines.join(''), '74. 三棱镜中的光路');
      doc.blocks = doc.blocks.slice(0, 5);
      view = Buffer.from(serialize(doc));
      projections.push({
        page, fullSource: input, rightBoundary: 'p0195#5',
        retainedRefs: ['p0195#1', 'p0195#2', 'p0195#3', 'p0195#4', 'p0195#5'],
        excludedIncompleteN74: true, noSourceWordsChanged: true,
      });
    }
    await immutableWrite(`${folder}/root/10p/pages/${id}/${name}`, view);
  }
}
for (const [id, page] of [['fig-156', 193], ['fig-157', 193], ['fig-158', 194], ['fig-159', 195]]) {
  for (const extension of ['png', 'svg']) {
    const source = `${base}/d435-source193195-first-author/work/10p/pages/${String(page).padStart(4, '0')}/figures/${id}.${extension}`;
    inputs.push(await bind(source));
    await immutableWrite(`${folder}/root/10p/figures/${id}.${extension}`, await bytes(source));
  }
}
await immutableWrite(`${folder}/started.json`, serialize({
  ticket: 'STEMROBIN-181', card, inputs, projections,
  scopedTextSOURCE: 'PASS-composed-existing-evidence',
  wholeSOURCE193: 'HOLD-RAW156-SVG156', wholeSOURCE194: 'pending-RAW158-SVG158',
  wholeSOURCE195: 'HOLD-RAW160-SVG160', firstScopedAssembly: true,
  firstModernPreparation: true, newImages: 0,
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
  (!ref.startsWith('p0192#') || Number(ref.split('#')[1]) >= 5) &&
  (!ref.startsWith('p0195#') || Number(ref.split('#')[1]) <= 4))));
assert.deepEqual(lesson.figures.map(row => row.id), ['fig-156', 'fig-157', 'fig-158', 'fig-159']);
for (const row of inputs) await verify(row.path, row.sha256);
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', card,
  status: 'FIRST-SCOPED-N73-ASSEMBLY-MODERN-TEXT-PENDING-FIGURE-HOLDS-RETAINED',
  inputs, projections, sourceLesson: await bind(lessonPath), sourceExercises: await bind(exercisePath),
  sourceQuestions: 0, proseBlocks: lesson.prose.length, figures: lesson.figures.map(row => row.id),
  rawRoot: `${folder}/root`, work: `${folder}/work`,
  templateDirectory: `${folder}/work/adapt/10p/modern-us-neutral/lessons/${card}`,
  scopedBodySource: 'PASS-composed-existing-text-evidence',
  SOURCE193: 'HOLD', SOURCE194: 'pending', SOURCE195: 'HOLD',
  RAW156: 'HOLD', SVG156: 'HOLD', RAW157: 'PASS', SVG157: 'PASS',
  RAW158: 'pending', SVG158: 'pending', RAW159: 'pending', SVG159: 'pending',
  SCI: 'pending', ZHEN: 'pending', FIG: 'pending', DISPLAY: 'pending', completeCard: false,
  priorN72ExcludedFromModernPreparation: true, incompleteN74Excluded: true,
  sourcePagesAdded: 0, completeCardsAdded: 0, canonicalWrites: false,
  newImages: 0, parentImageCount: 24, noImageBudgetReset: true,
  historicalFAILHOLDPreserved: true, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
}));
console.log(JSON.stringify({ manifest: await bind(manifestPath), proseBlocks: lesson.prose.length,
  sourceQuestions: exercises.exercises.length, figures: lesson.figures.map(row => row.id) }));
