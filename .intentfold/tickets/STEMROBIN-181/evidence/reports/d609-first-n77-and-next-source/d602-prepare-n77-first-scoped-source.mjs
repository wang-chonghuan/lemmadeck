import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`, folder = `${base}/d602-n77-first-source-preparation`;
const card = 'phy10-c2-s2-n77';
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const objectReviewPath = `${base}/d596-first-source204205-object-boundary-adjudication/report.json`;
const boundaryPath = `${base}/d594-source206-first-independent-review/report.json`;
for (const [file, sha] of [
  [objectReviewPath, '6409c253ebe9c0dce119bc3d1b50d3c9585f52082b88e5a7136ce95a59bf3a10'],
  [`${base}/d596-first-source204205-object-boundary-adjudication/review-freeze.json`,
    '1fc13f40e42d71c9b8402a5ca4439cf7c7f3965a6b9bae269d8c35004a9f5643'],
  [boundaryPath, '8b357e2a1c14671bc3f5eed68cec881c5e5714689a0d0d950220c44cf47a1208'],
  [`${base}/d594-source206-first-independent-review/review-freeze.json`,
    '73bf7569fcbc3dd478bcba0b28e5577e145b5ff99e90743f8aa09ff3693c7e7c'],
]) await verify(file, sha);
const objectReview = await read(objectReviewPath), boundary = await read(boundaryPath);
assert.equal(objectReview.gates.SOURCE204205_OBJECT_BOUNDARY.status, 'PASS');
assert.deepEqual(objectReview.gates.SOURCE204205_OBJECT_BOUNDARY.blocking_list, []);
for (const gate of ['SOURCE206', 'SOURCE205206_JOIN', 'N77_RIGHT_BOUNDARY']) {
  assert.equal(boundary.gates[gate].status, 'PASS');
  assert.deepEqual(boundary.gates[gate].blocking_list, []);
}
assert.equal(await exists(folder), false);
const inputs = [await bind(objectReviewPath), await bind(boundaryPath)];
for (const file of [
  `${base}/d591-n77-preauthor-source204-requirements/source-requirements.json`,
  `${base}/d595-n77-source205-requirement-extension/report.json`,
  `${base}/d600-n77-source206-requirement-extension/report.json`,
]) inputs.push(await bind(file));
const projections = [];
for (let page = 204; page <= 206; page++) {
  const id = String(page).padStart(4, '0');
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const source = `${canonical}/pages/${id}/${name}`, binding = await bind(source);
    inputs.push(binding);
    const data = await bytes(source);
    await immutableWrite(`${folder}/full-source/10p/pages/${id}/${name}`, data);
    let view = data;
    if (name === 'page.json' && page === 204) {
      await verify(source, '8dc12b02ea24152edb7a3d76d2c63069b9e401aa3df0d9d7203ade0b64ce3fbd');
      const before = JSON.parse(data), projected = structuredClone(before);
      assert.equal(projected.blocks[2].open, true);
      projected.blocks[2].open = false;
      const masked = structuredClone(projected);
      masked.blocks[2].open = true;
      assert.deepEqual(masked, before);
      view = Buffer.from(serialize(projected));
      projections.push({
        page, fullSource: binding, pointer: '/blocks/2/open', from: true, to: false,
        authority: await bind(objectReviewPath), wordsAndAllOtherFieldsUnchanged: true,
        twoIndependentParagraphsNotJoined: true, originalJoinHOLDPreserved: true,
      });
    }
    if (name === 'page.json' && page === 206) {
      await verify(source, 'b4a8634e20305fcf3feba9e54a61f65117a119dd71d7c13c6a4468342872ebc9');
      const projected = JSON.parse(data);
      assert.equal(projected.blocks[11].kind, 'h3');
      assert.match(projected.blocks[11].lines.join(''), /^78\.\s+/u);
      projected.blocks = projected.blocks.slice(0, 12);
      view = Buffer.from(serialize(projected));
      projections.push({
        page, fullSource: binding, rightBoundary: 'p0206#12',
        retainedRefs: projected.blocks.map((_, index) => `p0206#${index + 1}`),
        excludedIncompleteN78: true, authority: await bind(boundaryPath),
        noRetainedSourceWordsChanged: true,
      });
    }
    await immutableWrite(`${folder}/root/10p/pages/${id}/${name}`, view);
  }
}
for (const extension of ['png', 'svg']) {
  const file = `${canonical}/figures/fig-179.${extension}`;
  inputs.push(await bind(file));
  await immutableWrite(`${folder}/root/10p/figures/fig-179.${extension}`, await bytes(file));
}
await immutableWrite(`${folder}/started.json`, serialize({
  ticket: 'STEMROBIN-181', card, inputs, projections,
  firstScopedAssembly: true, firstModernPreparation: true, newImages: 0,
  scopedSourceObjectClosure: 'Existing accepted source plus first independent204205 derived object boundary and205206/rightboundary.',
  canonicalWrites: false, originalFAILHOLDPreserved: true,
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
assert.equal(lesson.prose.filter(row => row.kind === 'p').length, 9);
assert.equal(exercises.exercises.length, 8);
assert.ok(lesson.prose.every(row => row.source_refs.every(ref => !/^p0206#1[2-5]$/.test(ref))));
assert.deepEqual(lesson.figures, []);
for (const row of inputs) await verify(row.path, row.sha256);
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', card,
  status: 'FIRST-SCOPED-N77-ASSEMBLY-MODERN-TEXT-PENDING-HOLDS-PRESERVED',
  inputs, projections, sourceLesson: await bind(lessonPath), sourceExercises: await bind(exercisePath),
  sourceQuestions: 8, proseBlocks: lesson.prose.length, sourceLocalFigures: [],
  requiredSharedProseFigures: ['fig-179'],
  sharedFigurePolicy: 'Original n77 prose explicitly references179; attach one shared179 to first referencing modern paragraph through existing validate_shared_prose_figures contract. Native source and source snapshots remain unchanged; first modern FIG179 approval is still pending fromn76.',
  rawRoot: `${folder}/root`, work: `${folder}/work`,
  templateDirectory: `${folder}/work/adapt/10p/modern-us-neutral/lessons/${card}`,
  incompleteN78Excluded: true, sourcePagesAdded: 0, completeCardsAdded: 0, canonicalWrites: false,
  SCI: 'pending-first-independent', ZHEN: 'pending-first-independent',
  FIG: 'pending-first-shared-179', DISPLAY: 'pending', completeCard: false,
  newImages: 0, parentImageCount: 24, noImageBudgetReset: true,
  historicalFAILHOLDPreserved: true, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
}));
console.log(JSON.stringify({
  manifest: await bind(manifestPath), proseBlocks: lesson.prose.length,
  sourceQuestions: exercises.exercises.length, requiredSharedFigures: ['fig-179'],
}));
