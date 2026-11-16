import assert from 'node:assert/strict';
import path from 'node:path';
import {
  ticket, evidence, bytes, read, hash, relative, exists, records,
} from './retain-d016-evidence.mjs';
import {
  resolver, boundObjects, shaOf, local, safeFile, exactSet, surfaceKey, surfaceKeys, jsonBytes,
} from './d024-contract-final98.mjs';

export {
  root, ticket, evidence, indexPath, collections, bytes, read, hash, bind, verify,
  absolute, relative, exists, records, lookup, scratch, immutableWrite, walk,
} from './retain-d016-evidence.mjs';
export { resolver, boundObjects, shaOf, local, safeFile, exactSet, surfaceKey, surfaceKeys, jsonBytes };
export const tmp = `${ticket}/tmp`;
export const bookRoot = book => `ssot-resources/soviet10year-textbooks/artifacts/${book}`;
export const modernRoot = book => `${bookRoot(book)}/editions/modern-us-neutral`;
export const targets = [
  { book: '9p', card: 'phy9-c2-s3-n93', native: 'd024-n93-native-finalization.json',
    science: '9p-n93-science-review.json', gate: '9p-n93-figure-review.json',
    preparation: 'd024-modern-preparation.json', freeze: '9p-n93-prose-freeze.json',
    figures: ['fig-173', 'fig-174', 'fig-175', 'fig-176'] },
  { book: '9p', card: 'phy9-c2-s4-n97', native: 'd024-n97-native-finalization.json',
    science: '9p-n97-science-review.json', gate: '9p-n97-figure-review.json',
    preparation: 'd024-n97-modern-preparation.json', freeze: '9p-n97-prose-freeze.json',
    figures: [] },
  { book: '10p', card: 'phy10-c1-s2-n7', native: 'd024-10p-n7-native-finalization.json',
    science: '10p-n7-science-review.json', gate: '10p-n7-figure-review.json',
    preparation: 'd024-10p-n7-modern-preparation.json', freeze: '10p-n7-prose-freeze.json',
    figures: ['fig-09', 'fig-10', 'fig-11'] },
];
export const finalCards = targets.map(row => row.card);
export const finalFigures = targets.flatMap(row => row.figures.map(id => ({ book: row.book, id })));
export const figureKey = row => `${row.book}:${row.id}`;
export const sortedCards = [...finalCards].sort();
export const checkpointPath = `${tmp}/offline-d024/checkpoint-${sortedCards.join('--')}.json`;
export const resultPath = `${tmp}/offline-d024/result-${sortedCards.join('--')}.json`;
export const preparationReceipt = `${tmp}/d024-mixed7-delivery-helpers-preparation.json`;
export const manifestPath = `${evidence}/reports/d024-retention-manifest.json`;
export const finalizationPath = `${evidence}/reports/d024-finalization-binding.json`;
export const stagingPath = `${tmp}/d024-staging-boundary.json`;
export const pushPath = `${tmp}/d024-actual-push-receipt.json`;
export const progressPath = `${tmp}/d024-plane-progress-receipt.json`;
export const renderPath = `${tmp}/d024-10p-n7-native-offline-render.json`;
export const branch = 'codex/STEMROBIN-181-textbooks';
export const parentPrefix = 'ab07fc9';
export const sourcePages = [
  ...Array.from({ length: 11 }, (_, i) => 224 + i),
  ...Array.from({ length: 8 }, (_, i) => 236 + i),
];
export const deferredPages = [235, ...Array.from({ length: 8 }, (_, i) => 244 + i)];
export const sourceFigureIds = [
  ...Array.from({ length: 18 }, (_, i) => `fig-${173 + i}`), 'tbl-p0240-01',
].sort();
export const sourceCards = [
  'phy9-c2-s3-n93', 'phy9-c2-s3-n94', 'phy9-c2-s3-n95', 'phy9-c2-s3-n96',
  'phy9-c2-s3-t11', 'phy9-c2-s3-t14', 'phy9-c2-s4-n97', 'phy9-c2-s4-n98', 'phy9-c2-s4-n99',
];
export const binding = (name, sha256) => ({ path: `${tmp}/${name}`, sha256 });
export const sourceSpecs = [
  { ...binding('d024-source224-234-finalization.json',
    'b7e8c3e121f2402467ae67178cd381d5d9f86f31a976fa6c7ec62124081bd544'),
  pages: sourcePages.slice(0, 11), reviews: 6 },
  { ...binding('d025-source236-243-finalization.json',
    'e39605896c21968dd99a01900ef7f1e757f6ecbffad5d0452eb80981023347a3'),
  pages: sourcePages.slice(11), reviews: 4 },
];
export const final98History = binding('d024-final98-delivery-helpers-preparation.json',
  'f0d17b5712f94b9a84c2558b2eaca0aeedd26c85d8abce2dbba53afcc44deed9');
export const n94Blocker = binding('d024-n94-display-blocker.json',
  'e5c9676631f0a9f4332298cdef5201134e06c9556f3ef17de727bdbcba8e773c');
export const n95Blocker = binding('d024-n95-blocker.json',
  '36e5cf1e96afaa5d22c985954bd32c12a5a922b5e32efdf0f7e4eb202464cde5');
export const n98Blocker = binding('d024-n98-blocker.json',
  'd941ae1caad4952970ef388125517a5a82926bfb9dd040f8dbe289153de84ea6');
export const n98FigureFreeze = binding('d025-n98-figures-author-freeze.json',
  '71084cbd664d58bb47ce0e622036d20f18b39f9977e801422f06c2622c8e6185');
export const n98Science = binding('9p-n98-science-review.json',
  '0fa493e655ffd400ca1b90339e446278bc6b4d20bda686ea8a3b025a767cdc99');
export const continuation = binding('d024-mixed-continuation-preparation.json',
  'badba27aafb8c59c8dafe42778257d68333b7fdbefb45e470dd3b12c0ffdc266');
export const originalRender = binding('d024-native-offline-render.json',
  '1824ab485f685e222b098cde01bab83aa2b464288b67faebc97c7d3783436876');
export const affectedText = binding('d024-10p-n7-prose-author/native-text-affected-result.json',
  '98bb0efb55b6735e00af5c8ddd287448cce0ca32e79e93ceb349c9b47ff6b433');
export const affectedHelper = `${tmp}/validate-d024-n7-affected.py`;
export const initial10pFreeze = binding('10p-n7-prose-freeze.json',
  '70610bf5e7900974ae8cd91851344db4de96e73c29293ff44c6e264b41f07f11');
export const optionalSourceCorrections = [
  binding('d025-source248-251-correction/author-freeze.json',
    'adcae37a3b7f5887d27376884feef0dcfa7846b651e410fa6b1e8229b3cda907'),
  binding('d025-source248-251-correction/count-command.json',
    '022562d59e5fb8f05a64cc31525bed135a4ee23fddd56e97e58bce9317098fc9'),
];
export const figureIds = rows => rows.map(row => typeof row === 'string' ? row : row.id);
export const opaqueHistory = raw =>
  ['reports', 'surfaces', 'figurePixels', 'figureFiles', 'sourceCrops'].every(key => Array.isArray(raw[key]));
export const excluded = [
  'n94 quarantined; sole fig177 repair exhausted at actual mobile label15.50078125px/width310.015625px.',
  'n95 fig182 sole repair exhausted; fig183 author-pass only, never promoted.',
  'n98 fig189 initial and sole repair failed: Unsupported arrow marker aspect ratio; no SVG/native/display approval.',
  'n98 generated tbl-p0240-01 portrait is author-pass only, not independently approved or promoted.',
  'n96 incomplete235 and n99 incomplete243; t11sixteen/t14five unsolved source tasks remain source-only.',
  'Source244-251 unfinalized;244 only repair22/21 exhausted; no product SOURCE writes from those pages.',
  'Unrelated10pn5/index row,9pt4/fig101-102,n65 and.env remain untouched.',
];
export const counts = {
  sourceExerciseObjects: 0, workedExamples: 0, newUnsolvedWrittenTasks: 0,
  writtenExercises: 0, choiceQuestions: 0, choiceOptions: 0, readOnlyStandardAnswers: 0,
  deferredSourceUnsolvedTasks: 21,
};
export const ownedTmp = name =>
  /^d024-/.test(name) || name === 'offline-d024' ||
  /^d023-source224-227-/.test(name) ||
  /^d025-(?:source(?:236-243|236-239|240-243|242|244-247|248-251)-|n98-)/.test(name) ||
  /^(?:9p|SCI9p|zero-figure9p)-n(?:93|94|95|97|98)-/.test(name) ||
  /^(?:10p|SCI10p)-n7-/.test(name);
export const helperName = name =>
  /^(?:retain|complete|stage|render|post|prepare|author|finalize|combine|promote|recover|record|freeze|repair|count|crop|offline|quarantine|seed|project|validate)-d024(?:-|\.)/.test(name) ||
  /^(?:prepare|author|finalize|combine|review|promote|record|build|render)-d025-(?:n98|source236-243)(?:-|\.)/.test(name);
export function ownedDocument(file) {
  file = relative(file);
  return file.startsWith(`${tmp}/`) &&
    (ownedTmp(file.slice(`${tmp}/`.length).split('/')[0]) || helperName(path.basename(file))) ||
    /^\.tmp\/STEMROBIN-181\/(?:(?:9p-)?(?:d024-|n(?:93|94|95|97|98)-|d025-n98-)|10p-(?:d024-|n7-))/.test(file);
}

// The imported module contributes only the generic exact-byte resolver, never its n98 target plan.
export async function seedHistory(state) {
  const old = await state.document(final98History.path, final98History.sha256);
  assert.equal(old.status, 'prepared-not-executed');
  state.collect(old);
  const locks = new Map();
  for (const row of [
    ...old.frozenInputs, ...old.historicalRecords, ...old.helpers,
    ...old.historicalHelpersPreservedByteForByte, ...sourceSpecs,
    final98History, n94Blocker, n95Blocker, n98Blocker, n98FigureFreeze, n98Science,
    continuation, originalRender, affectedText,
  ]) locks.set(relative(row.path), row.sha256);
  if (await exists(preparationReceipt)) {
    const own = await state.document(preparationReceipt);
    for (const row of own.frozenInputs ?? []) locks.set(relative(row.path), row.sha256);
  }
  const report = async name => {
    const file = name.startsWith(`${tmp}/`) ? name : `${tmp}/${name}`;
    const expected = locks.get(relative(file));
    const raw = await state.document(file, expected);
    return { raw, binding: { path: relative(file), sha256: (await state.resolve(file, expected)).sha256 } };
  };
  const quarantine = (await report(n94Blocker.path)).raw;
  assert.equal(quarantine.status, 'excluded-display-failure-with-exhausted-figure-repair');
  assert.equal(quarantine.repairBudgetExhausted, true);
  assert.equal(quarantine.promotedAgain, false);
  for (const row of quarantine.retained) {
    state.aliases.set(`${relative(row.originalPath)}:${row.sha256}`, relative(row.path));
    await state.resolve(row.originalPath, row.sha256);
  }
  const failed98 = (await report(n98Blocker.path)).raw;
  assert.equal(failed98.status, 'excluded-exhausted-author-figure-failure');
  assert.equal(failed98.repairBudgetExhausted, true);
  assert.equal(failed98.promoted, false);
  assert.deepEqual(failed98.author, n98FigureFreeze);
  assert.deepEqual(failed98.science, n98Science);
  assert.equal(failed98.failedFigure.id, 'fig-189');
  assert.equal(failed98.failedFigure.finalOutputContractMediaEvidencePresent, false);
  assert.equal(failed98.retainedAuthorPass.independentApproval, false);
  const failed95 = (await report(n95Blocker.path)).raw;
  locks.set(relative(failed95.unchangedSCI.path), failed95.unchangedSCI.sha256);
  for (const n of [93, 94, 97]) {
    const native = (await report(`d024-n${n}-native-finalization.json`)).raw;
    for (const row of [native.science, native.figureGate, ...native.consumedBindings]) {
      const file = relative(row.originalPath ?? row.path);
      if (file.startsWith(`${tmp}/`) && /(?:prose-freeze|science-review|figure-review)\.json$/.test(file)) {
        locks.set(file, row.sha256);
      }
    }
  }
  await report(n98FigureFreeze.path);
  assert.equal((await report(n98Science.path)).raw.status, 'pass');
  const seed = (await report(continuation.path)).raw;
  assert.deepEqual(seed.cards, sortedCards);
  assert.equal(seed.reusedSurfaceCount, 8);
  assert.equal(relative(seed.checkpoint.path), checkpointPath);
  exactSet(seed.aliases.map(row => row.sha256), [
    '13820044852e0586858e156b9c263bd352e20821c7cd4a86747d2e12ecd6f5dc',
    '1554c2cb985dd9afae21eaa2dcb2cbaaae9b22648dec4d6f9976195d05fb1d60',
    '1700f4b4e0471c79ee5eb149c8d4508ef843743284c559fa2642950261e19429',
    '9fc55bd8c776d08e0e48b406a6a5ce45d8a2fda37159b84d858ec581139a491c',
  ], 'exact historical seed aliases');
  for (const row of seed.aliases) {
    state.aliases.set(`${relative(row.originalPath)}:${row.sha256}`, relative(row.path));
    await state.resolve(row.originalPath, row.sha256);
  }
  return { locks, report, seed };
}

export async function reconstructHistory(state, report) {
  for (const name of [
    ...[93, 94, 95, 97, 98].map(n => `9p-n${n}-prose-freeze.json`),
    '10p-n7-prose-freeze.json',
  ]) {
    const freeze = (await report(name)).raw;
    const n = /9p-n(\d+)-/.exec(name)?.[1];
    const folder = freeze.authorInputs?.path ? path.dirname(freeze.authorInputs.path)
      : `${tmp}/d024-n${n}-prose-author`;
    const startedPath = `${folder}/normalize-started.json`;
    if (await exists(startedPath)) {
      const started = await state.document(startedPath);
      const authoredPath = freeze.authorInputs?.path ?? `${folder}/authored-before-normalization.json`;
      const authored = await state.document(authoredPath, freeze.authorInputs?.sha256);
      for (const field of ['lesson', 'exercises']) {
        const input = started.inputs.find(row => row.path.endsWith(`/${field}.template.json`));
        assert.ok(input, `Missing historical normalization input: ${name}/${field}`);
        if (hash(jsonBytes(authored[field])) !== input.sha256) {
          await state.resolve(input.path, input.sha256);
          continue;
        }
        state.materialize(authored[field], input, `${authoredPath}#${field}`);
      }
    }
    const flowPath = freeze.nativeFlowCommand?.path ?? `${folder}/native-flow-command.json`;
    if (!await exists(flowPath) && !freeze.nativeFlowCommand) continue;
    const flow = await state.document(flowPath, freeze.nativeFlowCommand?.sha256);
    if (name === '10p-n7-prose-freeze.json') {
      const candidatePath = freeze.correctedCandidate?.path ??
        `${folder}/corrected-candidate-not-revalidated.json`;
      const candidate = await state.document(candidatePath, freeze.correctedCandidate?.sha256);
      const lesson = structuredClone(candidate.lesson);
      lesson.section_breaks = [];
      state.materialize(lesson, flow.input, `${candidatePath}#lesson.section_breaks=[]`);
      continue;
    }
    const candidatePath = `${folder}/normalized-candidate.json`;
    if (await exists(candidatePath)) {
      state.materialize((await state.document(candidatePath)).lesson, flow.input, `${candidatePath}#lesson`);
    } else {
      const snapshot = (freeze.snapshots ?? []).find(row =>
        (row.originalPath ?? row.path).endsWith('/lesson.template.json'));
      assert.ok(snapshot, `Missing exact normalized history for ${name}`);
      const lesson = JSON.parse((await state.resolve(snapshot.path, snapshot.sha256)).data);
      lesson.section_breaks = [];
      state.materialize(lesson, flow.input, `${snapshot.path}#section_breaks=[]`);
    }
  }
  const history = (await report('d024-helper-history/reconstruction.json')).raw;
  for (const row of [history.exactEarlierVersion, history.currentVersion]) {
    await state.resolve(row.path, row.sha256);
  }
  state.aliases.set(`${relative(history.originalPath)}:${history.exactEarlierVersion.sha256}`,
    relative(history.exactEarlierVersion.path));
  const boundary = (await report('d024-exercise12-boundary-correction/author-freeze.json')).raw;
  for (const [name, row] of [
    ['page.md', boundary.before], ['page.json', boundary.sourcePageJson], ['audit.json', boundary.sourceAudit],
  ]) state.aliases.set(`${bookRoot('9p')}/pages/0230/${name}:${row.sha256}`, relative(row.path));
}

export async function targetPreparation(state, report) {
  const sources = [];
  for (const spec of sourceSpecs) {
    const raw = await state.document(spec.path, spec.sha256);
    assert.equal(raw.status, 'pass-approved-source-pages-only');
    assert.deepEqual(raw.pages.map(row => row.pdf_page), spec.pages);
    assert.equal(raw.reviews.length, spec.reviews);
    for (const row of raw.reviews) await state.resolve(row.path, row.sha256);
    sources.push({ path: spec.path, sha256: spec.sha256 });
  }
  const cards = [];
  for (const target of targets) {
    const prepared = await report(target.preparation);
    assert.ok(prepared.raw.cards.includes(target.card));
    const closure = prepared.raw.closures.find(row => row.card === target.card);
    assert.ok(closure, `Missing actual SOURCE closure: ${target.card}`);
    assert.equal(closure.lastOpen, false);
    if (target.book === '9p') {
      assert.equal(closure.solvedTeachingExamples, 0);
      assert.equal(closure.newUnsolvedTasks, 0);
      assert.deepEqual(prepared.raw.source, sources[target.card === finalCards[0] ? 0 : 1]);
    } else {
      assert.equal(closure.sourceTasks, 0);
      assert.deepEqual(closure.physicalPages, [27, 28, 29]);
    }
    exactSet(figureIds(closure.figures), target.figures, `${target.card} source figures`);
    await state.resolve(closure.page.path, closure.page.sha256);
    const source = await read(`${bookRoot(target.book)}/lessons/${target.card}/lesson.json`);
    const tasks = await read(`${bookRoot(target.book)}/lessons/${target.card}/exercises.json`);
    assert.ok(source.prose.some(row => (row.source_refs ?? []).includes(closure.lastRef)));
    assert.equal(tasks.count, 0);
    assert.deepEqual(tasks.exercises, []);
    const native = await report(target.native);
    assert.equal(native.raw.status, 'pass');
    assert.equal(native.raw.card, target.card);
    const sci = await state.document(native.raw.science.path, native.raw.science.sha256);
    const gate = await state.document(native.raw.figureGate.path, native.raw.figureGate.sha256);
    assert.equal(sci.status, 'pass');
    assert.equal(gate.status, 'pass');
    assert.equal((await report(target.science)).binding.sha256, native.raw.science.sha256);
    assert.equal((await report(target.gate)).binding.sha256, native.raw.figureGate.sha256);
    exactSet(gate.figures.map(row => row.id), target.figures, `${target.card} existing figure gate`);
    const frozenBinding = native.raw.consumedBindings.find(row =>
      relative(row.originalPath ?? row.path) === `${tmp}/${target.freeze}`);
    assert.ok(frozenBinding, `Native must bind actual author freeze: ${target.card}`);
    const freeze = await state.document(frozenBinding.path, frozenBinding.sha256);
    const authorFreeze = { path: `${tmp}/${target.freeze}`, sha256: frozenBinding.sha256 };
    if (target.book === '10p') {
      assert.equal(freeze.lesson ?? freeze.card, target.card);
      assert.equal(freeze.counts.solvedTeachingExamples, 0);
      assert.equal(freeze.counts.newUnsolvedTasks, 0);
      assert.deepEqual(freeze.preparation, prepared.binding);
      const affected = await state.document(affectedText.path, affectedText.sha256);
      assert.equal(affected.status, 'pass');
      assert.deepEqual(affected.errors, []);
      assert.deepEqual(affected.affectedIndices, [3, 4]);
      assert.equal(affected.normalizeAndFlowReruns, 0);
      assert.deepEqual(affected.currentLessonTemplate, freeze.bindings.lessonTemplate);
      const sciFreezes = [];
      const sciAffected = [];
      boundObjects(sci, (row, sha) => {
        if (sha === authorFreeze.sha256 &&
          relative(row.originalPath ?? row.path) === authorFreeze.path) sciFreezes.push(row);
        if (sha === affectedText.sha256 &&
          relative(row.originalPath ?? row.path) === affectedText.path) sciAffected.push(row);
      });
      assert.ok(sciFreezes.length, 'SCI10p7 must explicitly bind the actual author freeze');
      assert.ok(sciAffected.length, 'SCI10p7 must explicitly bind the actual affected native PASS receipt');
    }
    for (const row of native.raw.outputs) {
      assert.ok(relative(row.path).startsWith(`${modernRoot(target.book)}/lessons/${target.card}/`));
      assert.equal(hash(await bytes(row.path)), row.sha256, `Native output drift: ${row.path}`);
    }
    cards.push({ book: target.book, card: target.card, closure,
      preparation: prepared.binding, freeze: authorFreeze, native: native.binding,
      ...(target.book === '10p' ? { affectedText } : {}),
      science: native.raw.science, figureGate: native.raw.figureGate,
      outputs: native.raw.outputs, workedExamples: 0, newUnsolvedWrittenTasks: 0 });
  }
  return { cards, sources, sourcePages, figures: finalFigures, counts,
    excludedN94: n94Blocker, excludedN95: n95Blocker, excludedN98: n98Blocker,
    basis: 'Existing SOURCE/SCI/figure/native receipts consumed by exact SHA; no owning gate replay.' };
}

export async function displayPreparation(state, report) {
  const seed = (await report(continuation.path)).raw;
  const previous = await state.document(seed.previous.path, seed.previous.sha256);
  assert.equal(previous.status, 'pass');
  exactSet(previous.results.map(surfaceKey), surfaceKeys(finalCards.slice(0, 2)), 'eight prior surfaces');
  const original = (await report(originalRender.path)).raw;
  assert.deepEqual(original.cards, ['phy9-c2-s3-n93', 'phy9-c2-s3-n94', 'phy9-c2-s4-n97']);
  const rendered = (await report(renderPath)).raw;
  assert.equal(rendered.status, 'pass-native-render-10p7-display-pending');
  assert.deepEqual(rendered.cards, [targets[2].card]);
  assert.deepEqual(rendered.originalBatchRender, originalRender);
  for (const row of [...original.html, ...rendered.html]) await state.resolve(row.path, row.sha256);
  const tiles = await report('d024-offline-tiles.json');
  assert.equal(relative(tiles.raw.result.path), resultPath);
  const offline = await state.document(tiles.raw.result.path, tiles.raw.result.sha256);
  assert.equal(offline.status, 'pass');
  exactSet(offline.results.map(surfaceKey), surfaceKeys(finalCards), 'twelve mixed surfaces');
  assert.equal(offline.reusedSurfaceCount, 8);
  for (const row of previous.results) {
    assert.deepEqual(offline.results.find(item => surfaceKey(item) === surfaceKey(row)), row,
      `Earlier passed browser row changed: ${surfaceKey(row)}`);
  }
  for (const row of offline.results) {
    await state.resolve(row.sourceHtml.path, row.sourceHtml.sha256);
    await state.resolve(row.screenshot, row.screenshotSha256);
    if (row.metrics.scrollEndScreenshot) {
      await state.resolve(row.metrics.scrollEndScreenshot, row.metrics.scrollEndScreenshotSha256);
    }
  }
  const pixels = await report('d024-screenshot-review.json');
  assert.equal(pixels.raw.status, 'pass');
  assert.deepEqual(pixels.raw.batchResult, tiles.raw.result);
  assert.equal(relative(pixels.raw.tileManifest.path), tiles.binding.path);
  assert.equal(pixels.raw.tileManifest.sha256, tiles.binding.sha256);
  const tileKey = row => `${relative(row.path)}:${row.sha256}`;
  exactSet(pixels.raw.tiles.map(tileKey), tiles.raw.tiles.map(tileKey), 'actually observed unique tiles');
  exactSet([...pixels.raw.surfaces, ...pixels.raw.emptySourceDefinedSurfaces].map(surfaceKey),
    surfaceKeys(finalCards), 'reviewed and SOURCE-empty surfaces');
  for (const row of pixels.raw.tiles) {
    assert.equal(row.status, 'pass');
    assert.equal(row.actuallyOpened, true);
    assert.equal(row.openCount, 1);
    assert.ok(row.reviewer && row.observations?.trim());
    await state.resolve(row.path, row.sha256);
  }
  for (const row of pixels.raw.independentReports) {
    const review = await state.document(row.path, row.sha256);
    assert.equal(review.status, 'pass');
    assert.equal(review.freshContext, true);
    assert.ok(review.imagesLoaded > 0 && review.imagesLoaded <= 8);
    assert.equal(review.imagesLoaded, review.tiles.length);
    assert.deepEqual(review.batchResult, tiles.raw.result);
  }
  return { previous: seed.previous, render: rendered, tiles, pixels,
    offline: { binding: tiles.raw.result, raw: offline } };
}

export function reportFromManifest(state, manifest) {
  for (const row of manifest.aliases) state.aliases.set(row.originalAndSha, row.snapshot);
  return async name => {
    const file = name.startsWith(`${tmp}/`) ? name.slice(`${tmp}/`.length) : name;
    const row = manifest.roots.find(item => item.name === file);
    assert.ok(row, `Missing retained root: ${file}`);
    const raw = await state.document(row.retained.path, row.retained.sha256);
    return { raw, binding: row.original };
  };
}

export function assertStaging(staging) {
  assert.equal(staging.status, 'exact-owned-files-staged');
  assert.deepEqual(staging.cards, finalCards);
  assert.ok(staging.parent.startsWith(parentPrefix));
  assert.equal(staging.bothIndicesExplicit, true);
  assert.equal(staging.threeIndicesExplicit, true);
  exactSet(staging.indexProjections.map(row => row.path), [
    `${bookRoot('9p')}/book.json`, `${modernRoot('9p')}/book.json`, `${modernRoot('10p')}/book.json`,
  ], 'three explicit indices');
  const partial = staging.indexProjections.find(row => row.path === `${modernRoot('10p')}/book.json`);
  assert.deepEqual(partial.ownedCards, [targets[2].card]);
  assert.equal(partial.partialIndex, true);
  assert.equal(partial.preservesUnrelatedWorkingBytes, true);
  assert.equal(staging.carryover.length, 4);
  exactSet(staging.files.map(row => row.path), [...new Set(staging.files.map(row => row.path))],
    'unique staged files');
  for (const row of staging.files) {
    assert.match(row.sha256, /^[a-f0-9]{64}$/);
    assert.equal(row.stagedBlobSha256, row.sha256);
    assert.match(row.workspaceSha256, /^[a-f0-9]{64}$/);
  }
}

export function assertPush(push) {
  assert.equal(push.status, 'ordinary-push-confirmed-by-actual-remote');
  assert.deepEqual(push.cards, finalCards);
  assert.equal(push.completeDeliveredCardsAtPush, 77);
  assert.match(push.commit, /^[a-f0-9]{40}$/);
  assert.equal(push.remoteRef, `refs/heads/${branch}`);
  assert.deepEqual(push.remoteOutput.trim().split(/\s+/), [push.commit, push.remoteRef]);
}
