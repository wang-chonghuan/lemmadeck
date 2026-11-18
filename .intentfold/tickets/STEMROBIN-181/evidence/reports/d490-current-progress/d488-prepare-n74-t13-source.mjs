import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const folder = `${ticket}/tmp/d488-n74-t13-first-source-preparation`;
const cards = ['phy10-c2-s2-n74', 'phy10-c2-s2-t13'];
const base = `${ticket}/tmp`;
assert.equal(await exists(folder), false);
const inputs = [];
for (const file of [
  `${base}/d448-source193195-first-independent-text-review/report.json`,
  `${base}/d478-source196-first-affected-text-review/report.json`,
  `${base}/d481-source197-first-independent-text-review/report.json`,
]) inputs.push(await bind(file));
const r196 = await read(inputs[1].path);
assert.equal(r196.current_content_composition.SOURCE196_TEXT_content, 'PASS');
assert.equal(r196.permission_seal_qualification.status, 'PROCEDURAL-HOLD');
const r197 = await read(inputs[2].path);
assert.equal(r197.checks.SOURCE197_TEXT, 'HOLD');
assert.ok(r197.findings.every(row => row.pointer === '/blocks/5/lines/0'));
assert.ok(r197.checks.local_boundaries.startsWith('PASS'));
const projections = [];
for (let page = 195; page <= 197; page++) {
  const id = String(page).padStart(4, '0');
  const source = page === 195 ? `${base}/d435-source193195-first-author/source/10p`
    : page === 196 ? `${base}/d477-source196-first-punctuation-repair/source/10p`
      : `${base}/d467-source197-first-author/source/10p`;
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const file = `${source}/pages/${id}/${name}`;
    const input = await bind(file);
    inputs.push(input);
    const data = await bytes(file);
    await immutableWrite(`${folder}/full-source/10p/pages/${id}/${name}`, data);
    let view = data;
    if (name === 'page.json' && page === 196) {
      const doc = JSON.parse(data);
      assert.equal(doc.blocks[8].kind, 'exhead');
      assert.equal(doc.blocks[8].lines.join(''), '练习 8');
      doc.blocks[8].kind = 'h3';
      view = Buffer.from(serialize(doc));
      projections.push({
        page, fullSource: input, classification: {
          pointer: '/blocks/8/kind', before: 'exhead', after: 'h3',
        },
        reason: 'Authoritative TOC routes exercise8 to standalone phy10-c2-s2-t13; only derived assembly changes classification.',
        originalWordsAndRefsUnchanged: true,
      });
    }
    if (name === 'page.json' && page === 197) {
      const doc = JSON.parse(data);
      assert.equal(doc.blocks[0].kind, 'ex');
      assert.equal(doc.blocks[1].kind, 'ex');
      assert.equal(doc.blocks[2].lines.join(''), '75. 透镜');
      doc.blocks = doc.blocks.slice(0, 3);
      view = Buffer.from(serialize(doc));
      projections.push({
        page, fullSource: input, retainedRefs: ['p0197#1', 'p0197#2', 'p0197#3'],
        rightBoundary: 'p0197#3', excludedIncompleteN75: true,
        excludedUnresolvedPunctuation: '/blocks/5/lines/0', noSourceWordsChanged: true,
      });
    }
    await immutableWrite(`${folder}/root/10p/pages/${id}/${name}`, view);
  }
}
for (const [id, source] of [
  ...['fig-159', 'fig-160'].map(id =>
    [id, `${base}/d435-source193195-first-author/work/10p/pages/0195/figures`]),
  ...['fig-161', 'fig-162', 'fig-163'].map(id =>
    [id, `${base}/d453-source196-first-author/work/10p/pages/0196/figures`]),
]) {
  for (const extension of ['png', 'svg']) {
    const file = `${source}/${id}.${extension}`;
    inputs.push(await bind(file));
    await immutableWrite(`${folder}/root/10p/figures/${id}.${extension}`, await bytes(file));
  }
}
await immutableWrite(`${folder}/started.json`, serialize({
  ticket: 'STEMROBIN-181', cards, inputs, projections,
  scopedTextSOURCE: 'PASS-existing-content-and-local-boundary-evidence',
  SOURCE196ProceduralHOLD: r196.permission_seal_qualification,
  SOURCE197LaterPunctuationHOLDExcludedNotRepaired: true,
  firstScopedAssembly: true, firstModernPreparations: true, newImages: 0,
}));
const common = ['--book', '10p', '--root', absolute(`${folder}/root`),
  '--work', absolute(`${folder}/work`)];
for (const [stage, args, receiptName] of [
  ['assemble', [...common, '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json'], 'assemble'],
  ...cards.map(card => ['adapt-prepare',
    [...common, '--edition', 'modern-us-neutral', '--lesson', card], `adapt-prepare-${card}`]),
]) {
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', stage, ...args];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  await immutableWrite(`${folder}/${receiptName}.json`, serialize({
    command, invocations: 1, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }));
  assert.equal(result.status, 0, `${stage}: ${result.stdout}\n${result.stderr}`);
}
const lessons = [];
for (const card of cards) {
  const lessonPath = `${folder}/root/10p/lessons/${card}/lesson.json`;
  const exercisePath = `${folder}/root/10p/lessons/${card}/exercises.json`;
  const lesson = await read(lessonPath), exercises = await read(exercisePath);
  assert.equal(lesson.card_id, card);
  if (card.endsWith('n74')) {
    assert.equal(exercises.exercises.length, 0);
    assert.deepEqual(lesson.figures.map(row => row.id), ['fig-160', 'fig-161', 'fig-162', 'fig-163']);
  } else {
    assert.deepEqual(exercises.exercises.map(row => row.number), ['1', '2', '3', '4', '5', '6', '7']);
  }
  const refs = [...lesson.prose, ...exercises.exercises]
    .flatMap(row => row.source_refs ?? row.pages ?? []);
  assert.ok(refs.every(ref => !ref.startsWith('p0197#') || Number(ref.split('#')[1]) <= 2));
  lessons.push({
    card, sourceLesson: await bind(lessonPath), sourceExercises: await bind(exercisePath),
    sourceQuestions: exercises.exercises.length, proseBlocks: lesson.prose.length,
    figures: lesson.figures.map(row => row.id),
    templateDirectory: `${folder}/work/adapt/10p/modern-us-neutral/lessons/${card}`,
  });
}
for (const row of inputs) await verify(row.path, row.sha256);
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', cards,
  status: 'FIRST-SCOPED-N74-T13-ASSEMBLY-MODERN-TEXT-PENDING-HOLDS-PRESERVED',
  inputs, projections, lessons, rawRoot: `${folder}/root`, work: `${folder}/work`,
  scopedBodySource: 'PASS-existing-content-and-local-boundary-evidence-only',
  SOURCE196ProceduralHOLD: r196.permission_seal_qualification,
  SOURCE197LaterPunctuationHOLDExcludedNotRepaired: true,
  RAW160: 'HOLD', SVG160: 'HOLD', RAW161: 'HOLD', SVG161: 'HOLD',
  RAW162: 'HOLD', SVG162: 'HOLD', RAW163: 'PASS', SVG163: 'PASS',
  SCI: 'pending', ZHEN: 'pending', FIG: 'pending', DISPLAY: 'pending',
  completeCard: false, sourcePagesAdded: 0, completeCardsAdded: 0, canonicalWrites: false,
  newImages: 0, parentImageCount: 24, noImageBudgetReset: true,
  historicalFAILHOLDPreserved: true, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
}));
console.log(JSON.stringify({ manifest: await bind(manifestPath), lessons }));
