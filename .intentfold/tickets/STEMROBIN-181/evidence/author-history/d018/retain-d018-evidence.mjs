import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  root, ticket, evidence, indexPath, book, durableFigures,
  absolute, relative, hash, bytes, read, exists, bind, lookup, verify,
  activePaths, scratch, immutableWrite,
} from './retain-d017-evidence.mjs';
import { collections, records, walk } from './retain-d016-evidence.mjs';

export {
  root, ticket, evidence, indexPath, book, durableFigures,
  absolute, relative, hash, bytes, read, exists, bind, lookup, verify,
  activePaths, scratch, immutableWrite,
};
export const inputsPath = `${ticket}/tmp/d018-retention-inputs.json`;
export const retentionManifest = `${evidence}/reports/d018-retention-manifest.json`;
export const exerciseCard = 'phy9-c2-s2-t7';
export const completeCards = ['phy9-c2-s2-n63', 'phy9-c2-s2-n64', exerciseCard];
export const blockedCards = [60, 62, 65].map(number => `phy9-c2-s2-n${number}`);
export const blockedFigures = ['fig-104', 'fig-106', 'fig-110'];
export const reusedCheckpoint = `${ticket}/tmp/offline-d018/checkpoint-phy9-c2-s2-n63.json`;
export const reusedTiles = `${ticket}/tmp/offline-d018/d018-n63-screenshot-tiles.json`;
export const reusedPixelReview = `${ticket}/tmp/d018-n63-screenshot-review.json`;
export const vectorFontAliasManifest = `${ticket}/tmp/d018-vector-font-before/aliases.json`;
export const fontCorrectionFolder = `${ticket}/tmp/offline-d018-font-correction`;
export const fontFirstPolicyAliasManifest = `${ticket}/tmp/d018-vector-font-first-policy/aliases.json`;
export const fontReadyAliasManifest = `${fontCorrectionFolder}/font-ready-capture.json`;
export const requiredFontAliasManifests = [
  vectorFontAliasManifest, fontFirstPolicyAliasManifest, fontReadyAliasManifest,
];
export const fontFinalFolder = `${ticket}/tmp/offline-d018-font-final`;
export const final64DisplayResultPath = `${fontFinalFolder}/result-phy9-c2-s2-n64.json`;
export const initial64DisplayPaths = {
  result: `${ticket}/tmp/offline-d018/checkpoint-phy9-c2-s2-n64.json`,
  tiles: `${ticket}/tmp/offline-d018/d018-n64-screenshot-tiles.json`,
  review: `${ticket}/tmp/d018-n64-screenshot-review.json`,
};
export const finalScreenPaths = {
  result: `${ticket}/tmp/offline-d018/result-${completeCards.join('--')}.json`,
  tiles: `${ticket}/tmp/offline-d018/d018-screenshot-tiles.json`,
  review: `${ticket}/tmp/d018-screenshot-review.json`,
};
export const requiredReportNames = [
  ...[60, 62, 63, 64, 65].flatMap(number =>
    [`9p-n${number}-prose-freeze.json`, `9p-n${number}-science-review.json`]),
  '9p-t7-prose-freeze.json', '9p-t7-science-review.json',
  '9p-n60-figure-review.json', 'd018-n60-figures-author-freeze.json',
  'd018-n62-figures-author-freeze.json', 'd018-n63-source-unit-erratum.json',
  'd018-n63-native-finalization.json', 'd018-n63-prior-index-archival-recovery.json',
  'd018-prior64-recovery/recovery.json', 'd018-n63-screenshot-review.json',
  'd018-n64-screenshot-review.json', 'd018-t7-screenshot-review.json',
  '9p-n65-figure-review.json',
  'd018-n64-native-finalization.json', 'd018-n64-offline-render.json',
  'd018-vector-font-final-tool-binding.json',
  '9p-ex9-answer-capture/author-freeze.json',
  'source-review-9p-0164-0166-finalization-trace.json',
];
const sourceStart = 156;
const integratedThrough = 166;
const historicalOnlyPage = 167;
const shaPattern = /^[a-f0-9]{64}$/;
const exactSet = (actual, expected, label) => {
  assert.equal(new Set(actual).size, actual.length, `Duplicate ${label}`);
  assert.deepEqual([...actual].sort(), [...expected].sort(), label);
};
export const surfaceKey = item =>
  `${item.card ?? item.id}:${item.surface}:${item.viewport?.width ?? item.viewport}`;
const tileKey = item => `${relative(item.path)}:${item.sha256}`;
const mergeMetadata = (target, metadata) => {
  for (const [key, value] of Object.entries(structuredClone(metadata))) {
    if (!(key in target)) target[key] = structuredClone(value);
    else if (key === 'role' && target.role !== value) {
      target.roles = [...new Set([...(target.roles ?? [target.role]), value])];
    } else if (key === 'original' && target.original !== value) {
      target.originalAliases = [...new Set([...(target.originalAliases ?? [target.original]), value])];
    } else if (key === 'figure' && target.figure !== value) {
      target.figures = [...new Set([...(target.figures ?? [target.figure]), value])];
    } else if (key === 'cropOf' && target.cropOf !== value) {
      target.cropOrigins = [...new Set([...(target.cropOrigins ?? [target.cropOf]), value])];
    } else assert.deepEqual(target[key], value, `Conflicting metadata: ${key}`);
  }
};

// Main supplies final hashes, not provisional screens. Additional historical alias
// manifests use {files:[{path,originalPath,sha256}]} or {recovered:{...}}.
// Required input shape:
// {batch:"D018",final:true,sourcePrefix:166,
//  completeCards:[{id,science:{path,sha256}}],
//  excludedCards:[{id,status:"blocked",report:{path,sha256}}],
//  figures:[{id,card,report:{path,sha256}}],
//  screens:{result:{path,sha256},tiles:{path,sha256},review:{path,sha256}},
//  displayCorrection:{card:"phy9-c2-s2-n64",
//    initial:{result:{path,sha256},tiles:{path,sha256},review:{path,sha256}},
//    effective:{result:{path,sha256},tiles:{path,sha256},review:{path,sha256}}},
//  aliasManifests:[{path,sha256}],aliases:[{path,originalPath,sha256}],
//  activeBindings:[{report,trail,path,sha256}],extraEvidence:[{path,sha256}],
//  interactionGates:[{card:"phy9-c2-s2-t7",surface:"answers"|"choices",report:{path,sha256}}]}
export async function displayCorrectionBindings(input) {
  const correction = input.displayCorrection;
  assert.equal(correction?.card, completeCards[1], 'Bind the confirmed n64 page-font correction explicitly.');
  const bindings = [];
  for (const stage of ['initial', 'effective']) {
    for (const field of ['result', 'tiles', 'review']) {
      const binding = correction[stage]?.[field];
      assert.ok(binding?.path && binding.sha256, `Wait for n64 ${stage}.${field}.`);
      if (stage === 'initial') assert.equal(relative(binding.path), initial64DisplayPaths[field]);
      else {
        assert.notEqual(relative(binding.path), initial64DisplayPaths[field],
          'Never overwrite the initial failed evidence with corrected bytes.');
        if (field === 'result') assert.equal(relative(binding.path), final64DisplayResultPath,
          'The Arial-first correction attempt is historical failure, not the final effective result.');
        if (field !== 'review') assert.ok(relative(binding.path).startsWith(`${fontFinalFolder}/`),
          'Effective result/tiles must use the final KaTeX_Main-first folder.');
      }
      await verify(binding.path, binding.sha256);
      bindings.push(structuredClone(binding));
    }
  }
  const initial = await read(correction.initial.review.path);
  const effective = await read(correction.effective.review.path);
  assert.equal(initial.status, 'fail', 'Keep the actual initial n64 pixel failure; do not relabel it.');
  assert.equal(effective.status, 'pass', 'Wait for Main independent affected-only display correction.');
  for (const stage of ['initial', 'effective']) {
    const report = stage === 'initial' ? initial : effective;
    if (report.bindings?.tiles) {
      assert.equal(relative(report.bindings.tiles.path), relative(correction[stage].tiles.path));
      assert.equal(report.bindings.tiles.sha256, correction[stage].tiles.sha256);
    }
    const resultBinding = report.bindings?.result ?? report.bindings?.checkpoint;
    if (resultBinding) {
      assert.equal(relative(resultBinding.path), relative(correction[stage].result.path));
      assert.equal(resultBinding.sha256, correction[stage].result.sha256);
    }
  }
  return bindings;
}

export async function verifyEffectiveDisplay(input, result, tiles, review) {
  const correction = input.displayCorrection;
  const card = completeCards[1];
  const initialResult = await read(correction.initial.result.path);
  const effectiveResult = await read(correction.effective.result.path);
  const effectiveTiles = await read(correction.effective.tiles.path);
  const effectiveReview = await read(correction.effective.review.path);
  assert.equal(effectiveResult.status, 'pass');
  const expected = ['text', 'exercises'].flatMap(surface =>
    [1440, 390].map(viewport => ({ card, surface, viewport })));
  const initialRows = initialResult.results.filter(item => (item.card ?? item.id) === card);
  exactSet(initialRows.map(surfaceKey), expected.map(surfaceKey), 'Original n64 four native surface rows');
  const correctedRows = effectiveResult.results.filter(item => (item.card ?? item.id) === card);
  const textRows = correctedRows.filter(item => item.surface === 'text');
  exactSet(textRows.map(surfaceKey), expected.filter(item => item.surface === 'text').map(surfaceKey),
    'Only the two affected n64 text surfaces are corrected');
  assert.ok(correctedRows.length === effectiveResult.results.length &&
    correctedRows.every(item => ['text', 'exercises'].includes(item.surface)),
  'The font-correction result may not rerun n63/t7 or introduce other surfaces.');
  exactSet(correctedRows.map(surfaceKey), [...new Set(correctedRows.map(surfaceKey))],
    'Unique corrected/reused n64 rows');
  const combined64 = result.results.filter(item => (item.card ?? item.id) === card);
  exactSet(combined64.map(surfaceKey), expected.map(surfaceKey), 'Effective n64 combined surface coverage');
  for (const row of combined64) {
    const authoritative = row.surface === 'text'
      ? textRows.find(item => surfaceKey(item) === surfaceKey(row))
      : initialRows.find(item => surfaceKey(item) === surfaceKey(row));
    assert.deepEqual(row, authoritative,
      'Copy the corrected text rows and the original two empty exercise rows, not rewritten snapshots.');
  }
  for (const row of correctedRows.filter(item => item.surface === 'exercises')) {
    assert.deepEqual(row, initialRows.find(item => surfaceKey(item) === surfaceKey(row)),
      'Empty exercise rows are reused, not rerun or updated after the font fix.');
  }
  const opened = review.tiles ?? review.actualOpened;
  const effectiveOpened = effectiveReview.tiles ?? effectiveReview.actualOpened;
  assert.ok(Array.isArray(opened) && Array.isArray(effectiveOpened));
  assert.ok(effectiveOpened.every(item => item.card === card && item.surface === 'text' &&
    item.actuallyOpened === true));
  assert.ok(effectiveTiles.tiles.every(item => item.card === card && item.surface === 'text'));
  exactSet(effectiveTiles.tiles.map(tileKey), effectiveOpened.map(tileKey),
    'Effective n64 tile manifest is the supplied actually-opened correction evidence');
  exactSet(opened.filter(item => item.card === card).map(tileKey), effectiveOpened.map(tileKey),
    'Final combine uses effective n64 pixels, not initially failed tiles');
  for (const item of effectiveOpened) {
    assert.deepEqual(item, opened.find(tile => tileKey(tile) === tileKey(item)),
      'Combine copies the original effective pixel-report entries without a second gate.');
  }
  for (const item of effectiveTiles.tiles) {
    assert.deepEqual(item, tiles.tiles.find(tile => tileKey(tile) === tileKey(item)),
      'Combine copies the effective tile manifest entries verbatim.');
  }
}

export async function finalInputs() {
  assert.ok(await exists(inputsPath), 'Prepared only: final d018-retention-inputs.json is required.');
  const inputBytes = await bytes(inputsPath);
  const input = JSON.parse(inputBytes);
  assert.equal(input.batch, 'D018');
  assert.equal(input.final, true, 'Provisional author/screen inputs cannot authorize retention.');
  assert.equal(input.sourcePrefix, integratedThrough, '167 remains history, not integrated source.');
  exactSet(input.completeCards.map(card => card.id), completeCards, 'D018 complete cards');
  exactSet(input.excludedCards.map(card => card.id), blockedCards, 'D018 blocked cards');
  for (const card of input.completeCards) await verify(card.science.path, card.science.sha256);
  for (const card of input.excludedCards) {
    assert.equal(card.status, 'blocked');
    await verify(card.report.path, card.report.sha256);
  }
  assert.ok(Array.isArray(input.figures), 'Main must supply the final independent figure bindings.');
  assert.ok(input.figures.every(item => completeCards.includes(item.card)));
  assert.ok(input.figures.every(item => !blockedFigures.includes(item.id)));
  exactSet(input.figures.map(item => item.id), [...new Set(input.figures.map(item => item.id))], 'figure identities');
  for (const item of input.figures) await verify(item.report.path, item.report.sha256);
  for (const key of ['result', 'tiles', 'review']) {
    assert.ok(input.screens?.[key]?.sha256, `Final screens.${key} missing; wait for Main.`);
    assert.equal(relative(input.screens[key].path), finalScreenPaths[key]);
    await verify(input.screens[key].path, input.screens[key].sha256);
  }
  for (const key of ['aliasManifests', 'aliases', 'activeBindings', 'extraEvidence']) {
    assert.ok(Array.isArray(input[key]), `Main must supply ${key}, including an explicit empty array if unused.`);
  }
  assert.ok(Array.isArray(input.interactionGates), 'Main must bind the final t7 answers/choices gates.');
  exactSet(input.interactionGates.map(item => `${item.card}:${item.surface}`),
    ['answers', 'choices'].map(surface => `${exerciseCard}:${surface}`), 't7 interaction gate coverage');
  for (const item of input.interactionGates) {
    await verify(item.report.path, item.report.sha256);
    assert.equal((await read(item.report.path)).status, 'pass', 'Use the existing independent interaction gate.');
  }
  for (const manifest of requiredFontAliasManifests) {
    assert.ok(input.aliasManifests.some(item => relative(item.path) === manifest),
      `The immutable original/first-policy/font-ready alias manifest is mandatory: ${manifest}`);
  }
  for (const item of [...input.aliasManifests, ...input.extraEvidence]) await verify(item.path, item.sha256);
  await displayCorrectionBindings(input);
  return { input, inputBytes };
}

export async function figureIds(cards) {
  const ids = new Set();
  for (const card of cards) {
    const folder = `${book}/editions/modern-us-neutral/lessons/${card.id}`;
    const lesson = await read(`${folder}/lesson.json`);
    const exercises = await read(`${folder}/exercises.json`);
    for (const item of lesson.figures ?? []) ids.add(item.id);
    for (const item of lesson.prose ?? []) {
      if (item.kind === 'fig') ids.add(item.id);
      for (const figure of item.figures ?? []) ids.add(figure.id);
    }
    for (const item of exercises.exercises ?? []) {
      for (const id of item.figure_refs ?? []) ids.add(id);
      for (const figure of item.figures ?? []) ids.add(figure.id);
    }
  }
  assert.ok([...ids].every(id => /^[a-z0-9-]+$/.test(id)));
  assert.ok(blockedFigures.every(id => !ids.has(id)), 'Blocked60/62/65 must not be completed or rebound.');
  return [...ids].sort();
}

export async function exactAliases(input) {
  const aliases = [];
  const add = item => {
    assert.ok(item.path && item.originalPath && shaPattern.test(item.sha256), 'Invalid historical exact alias');
    aliases.push(structuredClone({
      path: relative(item.path), originalPath: relative(item.originalPath), sha256: item.sha256,
      role: item.role ?? 'Exact historical bytes; not retroactive approval',
    }));
  };
  const manifests = [
    `${ticket}/tmp/d018-bound-inputs/snapshot-60-62-63.json`,
    `${ticket}/tmp/d018-bound-inputs/snapshot-64.json`,
    `${ticket}/tmp/d018-n63-prior-index-archival-recovery.json`,
    `${ticket}/tmp/d018-prior64-recovery/recovery.json`,
    ...requiredFontAliasManifests,
    ...input.aliasManifests.map(item => item.path),
  ];
  for (const file of [...new Set(manifests.map(relative))]) {
    const document = await read(file);
    for (const item of document.files ?? []) add(item);
    if (document.recovered?.originalPath) add(document.recovered);
    for (const item of document.exact_aliases ?? []) add(item);
  }
  for (const number of [63, 64, 65]) {
    const before = `${ticket}/tmp/9p-n${number}-before`;
    if (!(await exists(before))) continue;
    for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
      const file = `${before}/${name}`;
      add({ ...(await bind(file)),
        originalPath: `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s2-n${number}/${name}` });
    }
  }
  for (const item of input.aliases) add(item);
  for (const item of aliases) await verify(item.path, item.sha256);
  return aliases;
}

export async function expectedSha(input, aliases, file, supplied, report, trail) {
  if (supplied) {
    assert.match(supplied, shaPattern);
    return supplied;
  }
  const explicit = input.activeBindings.filter(item =>
    relative(item.path) === relative(file) && relative(item.report) === relative(report) &&
    JSON.stringify(item.trail) === JSON.stringify(trail));
  if (explicit.length) {
    assert.equal(explicit.length, 1, 'Ambiguous active path binding');
    assert.match(explicit[0].sha256, shaPattern);
    return explicit[0].sha256;
  }
  const candidates = aliases.filter(item =>
    [item.path, item.originalPath].some(original => relative(original) === relative(file)));
  const hashes = [...new Set(candidates.map(item => item.sha256))];
  assert.equal(hashes.length, 1,
    `Missing/ambiguous frozen SHA for ${report}/${trail.join('.')}; Main must bind it explicitly.`);
  return hashes[0];
}

export async function prepareRetention() {
  const { input, inputBytes } = await finalInputs();
  const indexBytes = await bytes(indexPath);
  const index = JSON.parse(indexBytes);
  for (const key of collections) assert.ok(Array.isArray(index[key]));
  const aliases = await exactAliases(input);
  const plan = new Map();
  const reused = [];
  const protectedProducts = [];
  const frozenInputAliases = [];
  const projectedIndex = () => {
    const result = structuredClone(index);
    for (const [destination, item] of plan) result[item.collection].push({
      path: destination, sha256: item.sha256, originalPath: item.source, ...structuredClone(item.metadata),
    });
    return result;
  };
  async function retain(file, destination, collection = 'reports', metadata = {}, expected) {
    file = relative(file);
    destination = relative(destination);
    assert.ok(destination.startsWith(`${evidence}/`) && collections.includes(collection));
    const sourcePage = file.match(/\/(?:pages|source-pages)\/(\d{4})(?:\/|$)/);
    const sourceRange = file.match(/(?:next-source|source-review)-(\d{4})-(\d{4})/);
    assert.ok(!sourcePage || Number(sourcePage[1]) <= historicalOnlyPage, '168+ is outside D018 retention.');
    assert.ok(!sourceRange || Number(sourceRange[2]) <= historicalOnlyPage, '168+ author batches are not D018.');
    const data = await bytes(file);
    const sha256 = hash(data);
    if (expected) assert.equal(sha256, expected, `Frozen input drift: ${file}`);
    const previous = lookup(projectedIndex(), file, sha256);
    if (previous) {
      const planned = plan.get(previous);
      if (planned) mergeMetadata(planned.metadata, metadata);
      else {
        await verify(previous, sha256);
        const record = records(index).find(item => relative(item.path) === previous && item.sha256 === sha256);
        mergeMetadata(record, metadata);
      }
      reused.push({ originalPath: file, path: previous, sha256 });
      return previous;
    }
    assert.ok(!file.includes('/phy9-c1-s7-t4/') && !/^9p-t4-/.test(path.basename(file)),
      't4 belongs to completed D017 retention; reuse its index, do not copy again.');
    if (plan.has(destination)) {
      assert.equal(plan.get(destination).sha256, sha256);
      mergeMetadata(plan.get(destination).metadata, metadata);
      return destination;
    }
    for (const row of records(index).filter(row => relative(row.path) === destination)) {
      assert.equal(row.sha256, sha256, `Index collision: ${destination}`);
    }
    if (await exists(destination)) await verify(destination, sha256);
    plan.set(destination, { source: file, data, sha256, collection, metadata: structuredClone(metadata) });
    return destination;
  }
  async function folder(source, destination, collection = 'reports', metadata = {}) {
    assert.ok(await exists(source), `Missing frozen folder: ${source}`);
    for (const file of await walk(source)) {
      const pixel = /\.w\d+\.png$/.test(file);
      await retain(file, `${destination}/${path.relative(relative(source), file)}`,
        pixel ? 'figurePixels' : collection, structuredClone(metadata));
    }
  }
  async function dependency(original, expected, metadata) {
    const existing = lookup(projectedIndex(), original, expected);
    if (existing) {
      if (!plan.has(existing)) await verify(existing, expected);
      return existing;
    }
    const matches = aliases.filter(item =>
      item.sha256 === expected && [item.path, item.originalPath].some(file => relative(file) === relative(original)));
    const alias = matches[0];
    const preserved = [...plan.entries()].find(([, item]) => item.sha256 === expected);
    let retained;
    let source;
    if (!alias && preserved) {
      retained = preserved[0];
      source = preserved[1].source;
    } else {
      source = alias?.path ?? original;
      await verify(source, expected);
      const destination = `${evidence}/author-history/d018/bound-inputs/${hash(relative(original)).slice(0, 12)}-${expected.slice(0, 12)}-${path.basename(original)}`;
      retained = await retain(source, destination, 'reports', structuredClone(metadata), expected);
    }
    if (!lookup(projectedIndex(), original, expected)) {
      index.reports.push({
        path: retained, sha256: expected, originalPath: relative(original), batch: 'D-018',
        role: 'Exact frozen-SHA historical path alias, not current-file substitution or approval',
      });
    }
    frozenInputAliases.push({
      originalPath: relative(original), path: retained, sha256: expected,
      snapshotSource: relative(source), laterArchivalRecoveryNotApproval: true,
    });
    return retained;
  }
  async function boundInputs(file, metadata) {
    const refs = [];
    activePaths(await read(file), (owner, key, sha256, trail) =>
      refs.push({ file: owner[key], sha256, trail }));
    for (const item of refs) {
      const expected = await expectedSha(input, aliases, item.file, item.sha256, file, item.trail);
      await dependency(item.file, expected, metadata);
    }
  }

  for (const name of requiredReportNames) {
    const file = `${ticket}/tmp/${name}`;
    await retain(file, `${evidence}/author-history/d018/reports/${name}`, 'reports',
      { role: 'Verbatim original author/independent/history evidence; no approval regenerated' });
  }
  const historyPattern = /^(?:d018-|9p-(?:n(?:60|62|63|64|65)|t7)-|source-review-9p-(?:0156-0159|0160-0163|0164-0166|0164-0167|0167(?:-|\.))|(?:author-9p-(?:n(?:60|62|63|64|65)|t7)|(?:record|recover|snapshot|finalize|prepare|offline|register|crop|retain|rebind|freeze|render|diagnose|preserve|seed|append)-d018|preserve-source-(?:0156-0159|0160-0163)|finalize-source-(?:0156-0159|0160-0163|0164-0166)))/;
  for (const entry of await fs.readdir(absolute(`${ticket}/tmp`), { withFileTypes: true })) {
    const nextCard = entry.name.match(/^d018-n(\d+)-/);
    if (nextCard && ![60, 62, 63, 64, 65].includes(Number(nextCard[1]))) continue;
    const nextPage = entry.name.match(/^d018-p(\d{4})(?:-|\.|$)/);
    if (nextPage && Number(nextPage[1]) > historicalOnlyPage) continue;
    if (entry.isFile() && historyPattern.test(entry.name)) {
      await retain(`${ticket}/tmp/${entry.name}`, `${evidence}/author-history/d018/${entry.name}`, 'reports',
        { role: 'Verbatim D018 history, including blocked attempts; not completed-product evidence' });
    }
  }
  for (const name of ['retain-d018-evidence.mjs', 'rebind-d018-durable-paths.mjs',
    'freeze-d018-retention-inputs.mjs']) {
    await retain(`${ticket}/tmp/${name}`, `${evidence}/author-history/d018/${name}`);
  }
  for (const name of ['d018-bound-inputs', 'd018-native-before', 'd018-prior64-recovery',
    'd018-n63-unit-erratum', 'd018-n65-fig110-atom-details',
    'd018-vector-font-before', 'd018-n64-vector-font-diagnosis', 'offline-d018-font-correction',
    '9p-n63-before', '9p-n64-before', '9p-n65-before']) {
    await folder(`${ticket}/tmp/${name}`, `${evidence}/author-history/d018/${name}`);
  }
  for (const entry of await fs.readdir(absolute(`${ticket}/tmp/offline-d018`), { withFileTypes: true })) {
    if (entry.isFile() && /^checkpoint-.*phy9-c2-s2-n65.*\.json$/.test(entry.name)) {
      await retain(`${ticket}/tmp/offline-d018/${entry.name}`,
        `${evidence}/author-history/d018/superseded65-checkpoints/${entry.name}`, 'reports',
        { role: 'Old65 seed/checkpoint history only; never the completed D018 subset' });
    }
  }
  const t7Before = `${ticket}/tmp/9p-t7-before`;
  if (await exists(t7Before)) await folder(t7Before, `${evidence}/author-history/d018/9p-t7-before`);
  await folder(`${ticket}/tmp/9p-ex9-answer-capture`,
    `${evidence}/author-history/d018/9p-ex9-answer-capture`, 'reports',
    { role: 'Original exercise9 answer capture author bytes; independent gate supplied separately, not regenerated' });
  await folder(`${ticket}/tmp/d018-vector-font-first-policy`,
    `${evidence}/author-history/d018/d018-vector-font-first-policy`, 'reports',
    { role: 'Verbatim unsuccessful Arial-first policy and exact recovered aliases; historical recovery is not approval' });
  await folder(fontFinalFolder, `${evidence}/author-history/d018/offline-d018-font-final`, 'reports',
    { role: 'Original final KaTeX_Main-first display attempt bytes; consume only the explicitly bound independent effective report' });
  for (const entry of await fs.readdir(absolute('.tmp/STEMROBIN-181'), { withFileTypes: true })) {
    if (entry.isDirectory() && /^9p-d018-n(?:60|62|64|65)-/.test(entry.name)) {
      await folder(`.tmp/STEMROBIN-181/${entry.name}`,
        `${evidence}/figures/candidates/9p/${entry.name}`, 'figureFiles',
        { role: 'Author candidates and repairs only, including blocked60/62/65; not a promotion' });
    }
  }
  await folder('.tmp/STEMROBIN-181/9p-n65-figures',
    `${evidence}/author-history/d018/9p-n65-figures`, 'figureFiles',
    { role: 'Complete n65 author scratch history including initial/repair/before-contract bytes; no rerender' });
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
    await retain(`.tmp/ld-s10y-lesson/9p/pages/0167/${name}`,
      `${evidence}/author-history/d018/unresolved-source167/${name}`, 'sourceCrops',
      { page: 167, role: 'Unresolved source167 preparation bytes, history only; not integrated or approved' });
  }
  for (const range of ['0156-0159', '0160-0163', '0164-0167']) {
    await folder(`${ticket}/tmp/9p-next-source-${range}`,
      `${evidence}/author-history/d018/9p-next-source-${range}`, 'reports',
      { role: range === '0164-0167'
        ? 'Verbatim source author history;167 unresolved and never integrated or approved here'
        : 'Verbatim source author history; final integration follows the recorded unique gate',
      integratedThrough, historicalOnlyPage });
    for (const suffix of ['', '-correction', '-finalization-trace']) {
      const file = `${ticket}/tmp/source-review-9p-${range}${suffix}.json`;
      if (await exists(file)) await retain(file, `${evidence}/author-history/d018/${path.basename(file)}`);
    }
    const crops = `${ticket}/tmp/source-review-9p-${range}-evidence`;
    if (await exists(crops)) await folder(crops, `${evidence}/source-crops/d018/${path.basename(crops)}`, 'sourceCrops',
      { role: 'Original source-gate evidence bytes; no new gate or approval', integratedThrough, historicalOnlyPage });
  }
  for (const item of [...aliases, ...input.extraEvidence]) {
    await retain(item.path,
      `${evidence}/author-history/d018/snapshots/${hash(relative(item.path)).slice(0, 12)}-${path.basename(item.path)}`,
      'reports', item.originalPath ? { original: relative(item.originalPath), role: item.role } : {}, item.sha256);
  }
  for (const item of [...input.completeCards, ...input.excludedCards]) {
    const binding = item.science ?? item.report;
    await retain(binding.path, `${evidence}/reports/${path.basename(binding.path)}`, 'reports',
      { card: item.id, role: item.status === 'blocked' ? 'Blocked history, not promotion' : 'Existing Main unique SCI bytes' },
      binding.sha256);
  }
  for (const gate of input.interactionGates) {
    await retain(gate.report.path, `${evidence}/reports/${path.basename(gate.report.path)}`, 'reports',
      { card: gate.card, surface: gate.surface, role: 'Original independent t7 interaction gate; no new approval' },
      gate.report.sha256);
  }
  for (const card of input.excludedCards) {
    for (const base of [
      `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card.id}`,
      `${book}/editions/modern-us-neutral/lessons/${card.id}`,
    ]) {
      if (!(await exists(base))) continue;
      for (const file of await walk(base)) {
        await retain(file,
          `${evidence}/author-history/d018/blocked/${card.id}/${hash(base).slice(0, 12)}/${path.relative(base, file)}`,
          'reports', { card: card.id, role: 'Blocked author/product snapshot, not promotion or delivery' });
        if (base.startsWith(`${book}/editions/`)) protectedProducts.push(await bind(file));
      }
    }
    const source = await read(`${book}/lessons/${card.id}/lesson.json`);
    for (const figure of source.figures ?? []) {
      for (const name of (await fs.readdir(absolute(durableFigures))).filter(name => name.startsWith(`${figure.id}.`))) {
        protectedProducts.push(await bind(`${durableFigures}/${name}`));
      }
    }
  }
  const sourcePages = [];
  for (let page = sourceStart; page <= input.sourcePrefix; page++) {
    const id = String(page).padStart(4, '0');
    const folder = `${book}/pages/${id}`;
    const source = await read(`${folder}/page.json`);
    const audit = await read(`${folder}/audit.json`);
    assert.equal(source.meta.page, page);
    assert.deepEqual(audit.errors, [], 'Consume finalized native audit; do not redo it.');
    for (const name of ['page.md', 'page.json', 'audit.json']) {
      await retain(`${folder}/${name}`, `${evidence}/author-history/d018/source-pages/${id}/${name}`);
    }
    for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
      await retain(`.tmp/ld-s10y-lesson/9p/pages/${id}/${name}`,
        `${evidence}/source-pages/9p/${id}/${name}`, 'sourceCrops',
        { page, role: 'Already integrated source156-166, no repeated source gate' });
    }
    await verify(`.tmp/ld-s10y-lesson/9p/pages/${id}/page.png`, source.meta.render.sha256);
    const ids = source.blocks.filter(item => item.kind === 'fig').map(item => item.id);
    for (const figure of ids) await retain(`${book}/figures/${figure}.png`,
      `${evidence}/source-crops/9p/${figure}.png`, 'sourceCrops', { page, figure });
    sourcePages.push({ page, rows: audit.lines_printed, sourceFigures: ids, errata: source.meta.errata ?? [] });
  }
  const cardCounts = [];
  const expectedSurfaces = [];
  for (const card of input.completeCards) {
    const science = await read(card.science.path);
    assert.equal(science.status, 'pass', 'Use the original Main SCI decision, never author a replacement.');
    const source = await read(`${book}/lessons/${card.id}/lesson.json`);
    const sourceExercises = await read(`${book}/lessons/${card.id}/exercises.json`);
    const modernFolder = `${book}/editions/modern-us-neutral/lessons/${card.id}`;
    const lesson = await read(`${modernFolder}/lesson.json`);
    const exercises = await read(`${modernFolder}/exercises.json`);
    assert.equal(sourceExercises.exercises.length, card.id === exerciseCard ? 11 : 0);
    assert.equal(exercises.exercises.length, sourceExercises.exercises.length);
    const refs = [
      ...source.prose.flatMap(item => item.source_refs ?? []),
      ...sourceExercises.exercises.flatMap(item => item.pages ?? []),
    ];
    assert.ok(refs.length && refs.every(ref =>
      /^p\d{4}#\d+$/.test(ref) && Number(ref.slice(1, 5)) <= integratedThrough));
    for (const file of await walk(modernFolder)) protectedProducts.push(await bind(file));
    for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
      await retain(`.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card.id}/${name}`,
        `${evidence}/author-history/d018/final-templates/${card.id}/${name}`,
        'reports', { card: card.id, role: 'Final native template, distinct from frozen original-SHA aliases' });
    }
    cardCounts.push({ card: card.id, sourceProseBlocks: source.prose.length,
      sourceTasks: sourceExercises.exercises.length, modernTasks: exercises.exercises.length });
    const surfaces = [
      ['text', !lesson.prose.some(item => item.kind === 'fig' || item.text?.trim())],
      ['exercises', exercises.exercises.length === 0],
    ];
    if (sourceExercises.exercises.length) surfaces.push(['answers', false], ['choices', false]);
    for (const [surface, empty] of surfaces) {
      for (const viewport of [1440, 390]) expectedSurfaces.push({ card: card.id, surface, viewport, empty });
    }
  }
  const figures = await figureIds(input.completeCards);
  exactSet(input.figures.map(item => item.id), figures, 'Final figure coverage');
  for (const item of input.figures) {
    const file = `${durableFigures}/${item.id}.independent-review.json`;
    const review = await read(file);
    assert.equal(review.id, item.id);
    assert.equal(review.status, 'pass', 'Existing unique figure gate only');
    await retain(item.report.path, `${evidence}/reports/${path.basename(item.report.path)}`,
      'reports', { figure: item.id, role: 'Immutable original independent figure gate' }, item.report.sha256);
    await boundInputs(file, { figure: item.id, role: 'Exact active figure binding, not a new review' });
    for (const name of (await fs.readdir(absolute(durableFigures))).filter(name => name.startsWith(`${item.id}.`))) {
      protectedProducts.push(await bind(`${durableFigures}/${name}`));
    }
  }
  for (const name of requiredReportNames) await boundInputs(`${ticket}/tmp/${name}`,
    { role: 'Exact frozen author/review input; original report remains verbatim' });
  for (const item of [
    ...input.completeCards.map(card => ({ card: card.id, binding: card.science })),
    ...input.excludedCards.map(card => ({ card: card.id, binding: card.report })),
    ...input.figures.map(figure => ({ figure: figure.id, binding: figure.report })),
  ]) {
    await boundInputs(item.binding.path,
      { role: 'Exact final-input-bound original report dependency, not a new gate' });
  }
  for (const binding of await displayCorrectionBindings(input)) {
    await boundInputs(binding.path,
      { role: 'Exact initial/effective page-font evidence dependency; original snapshots unchanged' });
  }
  for (const gate of input.interactionGates) {
    await boundInputs(gate.report.path,
      { card: gate.card, role: 'Exact t7 answer/choice gate input and output bytes; original reports unchanged' });
  }

  const prior = await read(reusedCheckpoint);
  const priorReview = await read(reusedPixelReview);
  const priorTiles = await read(reusedTiles);
  const result = await read(input.screens.result.path);
  const tiles = await read(input.screens.tiles.path);
  const review = await read(input.screens.review.path);
  await verifyEffectiveDisplay(input, result, tiles, review);
  assert.ok(['incomplete', 'pass'].includes(prior.status),
    'The original four completed n63 rows may precede batch completion; never rewrite the checkpoint.');
  assert.equal(priorReview.status, 'pass');
  assert.equal(result.status, 'pass');
  assert.equal(review.status, 'pass');
  const n63Surfaces = expectedSurfaces.filter(item => item.card === completeCards[0]);
  exactSet(prior.results.map(surfaceKey), n63Surfaces.map(surfaceKey),
    'The original n63 checkpoint contains exactly its four completed rows');
  exactSet(priorReview.surfaces.map(surfaceKey), n63Surfaces.map(surfaceKey),
    'The original pixel report covers the same four n63 surfaces');
  assert.ok(priorReview.surfaces.every(item => item.status === 'pass'),
    'Consume the four original PASS dispositions, not the incomplete batch marker.');
  exactSet(result.results.map(surfaceKey), expectedSurfaces.map(surfaceKey), 'Derived final surface coverage');
  const reused63 = result.results.filter(item => (item.card ?? item.id) === completeCards[0]);
  exactSet(reused63.map(surfaceKey), expectedSurfaces.filter(item => item.card === completeCards[0]).map(surfaceKey),
    'All four n63 surfaces reused');
  for (const item of reused63) {
    assert.deepEqual(item, prior.results.find(old => surfaceKey(old) === surfaceKey(item)),
      'n63 checkpoint rows must remain verbatim, not rerun.');
  }
  const opened = review.tiles ?? review.actualOpened;
  const priorOpened = priorReview.tiles ?? priorReview.actualOpened;
  assert.ok(Array.isArray(opened) && Array.isArray(priorOpened));
  exactSet(opened.filter(item => item.card === completeCards[0]).map(tileKey), priorOpened.map(tileKey),
    'Reuse the original n63 actually-opened pixels');
  for (const tile of priorOpened) {
    assert.deepEqual(tile, opened.find(item => tileKey(item) === tileKey(tile)),
      'Preserve the original n63 pixel report entries without reapproval.');
  }
  exactSet(tiles.tiles.map(tileKey), opened.map(tileKey), 'Final actually-opened tile coverage');
  for (const file of [reusedCheckpoint, reusedTiles, reusedPixelReview]) {
    await retain(file, `${evidence}/offline/d018/reused63/${path.basename(file)}`, 'reports',
      { card: completeCards[0], role: 'Previously passed original checkpoint/pixel review, not rerun' });
  }
  assert.equal(priorReview.bindings.checkpoint.sha256, hash(await bytes(reusedCheckpoint)));
  assert.equal(priorReview.bindings.tiles.sha256, hash(await bytes(reusedTiles)));
  exactSet(priorTiles.tiles.map(tileKey), priorOpened.map(tileKey), 'Original n63 tile manifest');
  for (const binding of Object.values(input.screens)) {
    await retain(binding.path, `${evidence}/offline/d018/${path.basename(binding.path)}`, 'reports', {}, binding.sha256);
  }
  for (const stage of ['initial', 'effective']) {
    for (const [field, binding] of Object.entries(input.displayCorrection[stage])) {
      await retain(binding.path,
        `${evidence}/offline/d018/n64-font-${stage}/${path.basename(binding.path)}`, 'reports',
        { card: completeCards[1], role: stage === 'initial'
          ? 'Verbatim initial n64 page-font failure evidence; status never rewritten'
          : 'Existing Main affected-only n64 display correction, not a new gate',
        displayCorrectionField: field }, binding.sha256);
    }
  }
  const scrollEndScreenshots = [];
  for (const item of result.results) {
    const metadata = { card: item.card ?? item.id, surface: item.surface, viewport: item.viewport.width };
    await retain(item.screenshot,
      `${evidence}/offline/d018/${path.basename(item.screenshot)}`, 'surfaces',
      structuredClone(metadata), item.screenshotSha256);
    const endPath = item.metrics?.scrollEndScreenshot;
    const endSha = item.metrics?.scrollEndScreenshotSha256;
    if (endPath || endSha) {
      assert.ok(typeof endPath === 'string' && endPath.length, 'Missing scroll-end screenshot path');
      assert.match(endSha, shaPattern, 'Missing frozen scroll-end screenshot SHA');
      const retainedPath = await retain(endPath,
        `${evidence}/offline/d018/${path.basename(endPath)}`, 'surfaces',
        { ...structuredClone(metadata), scrollPosition: 'end',
          role: 'Original full scroll-end screenshot, not only its inspected tiles' }, endSha);
      scrollEndScreenshots.push({
        ...structuredClone(metadata), originalPath: relative(endPath), path: retainedPath, sha256: endSha,
      });
    }
  }
  const t7PixelPath = `${ticket}/tmp/d018-t7-screenshot-review.json`;
  const t7PixelBinding = await bind(t7PixelPath);
  assert.ok(review.inheritedReports.some(item =>
    relative(item.path) === t7PixelBinding.path && item.sha256 === t7PixelBinding.sha256));
  const t7PixelReport = await read(t7PixelPath);
  assert.equal(t7PixelReport.status, 'pass');
  assert.equal(t7PixelReport.lesson, exerciseCard);
  for (const tile of opened) {
    const original = tiles.tiles.find(item => tileKey(item) === tileKey(tile));
    assert.ok(original);
    const t7Observation = t7PixelReport.tiles.find(item => tileKey(item) === tileKey(tile));
    if (tile.actuallyOpened !== true || !tile.reviewer || !tile.card || !tile.source) {
      assert.equal(original.card, exerciseCard);
      assert.deepEqual(tile, t7Observation);
      assert.equal(tile.actualOpened, true);
      assert.ok(t7PixelReport.role);
    } else assert.equal(tile.actuallyOpened, true);
    for (const key of ['surface', 'viewport', 'crop']) assert.deepEqual(tile[key], original[key]);
    if (tile.card) assert.equal(tile.card, original.card);
    if (tile.source) assert.equal(relative(tile.source), relative(original.source));
    await retain(tile.path, `${evidence}/offline/d018/${path.basename(tile.path)}`, 'surfaces',
      { card: original.card, surface: tile.surface, viewport: tile.viewport, actuallyOpened: true,
        inspectedBy: tile.reviewer ?? t7PixelReport.role,
        crop: structuredClone(tile.crop), cropOf: original.source }, tile.sha256);
  }
  const summary = {
    ticket: 'STEMROBIN-181', batch: 'D-018', status: 'existing-evidence-archived-no-new-approval',
    scope: input.completeCards.map(item => item.id), excludedCards: structuredClone(input.excludedCards),
    figures, blockedFigures, finalInputs: { path: inputsPath, sha256: hash(inputBytes) },
    sourceScope: { start: sourceStart, integratedThrough, historicalOnlyPage,
      page167ProductOrApproval: false },
    sourcePages, cardCounts, frozenInputAliases, reused, screens: structuredClone(input.screens),
    displayCorrection: { ...structuredClone(input.displayCorrection),
      initialPixelStatus: 'fail', effectivePixelStatus: 'pass',
      unsuccessfulFirstPolicyHistoryRetained: true,
      fontReadyInitialResultCheckpointExactAliasesRetained: true,
      effectivePolicy: 'KaTeX_Main first only for modern SVG labels containing U20D7',
      changedSurface: 'n64 text only at1440/390', emptyExerciseRowsReused: true,
      originalScienceFigureSourceAndInitialPixelReportsUnchanged: true,
      archiverPerformedReviewRenderOrToolRepair: false },
    scrollEndScreenshots,
    preservedProducts: protectedProducts,
    reused63: { checkpoint: await bind(reusedCheckpoint), tiles: await bind(reusedTiles),
      pixelReview: await bind(reusedPixelReview), exactSurfaceRowsReused: reused63.length,
      exactOpenedTilesReused: priorOpened.length, originalBatchStatus: prior.status,
      browserOrPixelReviewRepeated: false },
    derivedCounts: { plannedFiles: plan.size, sourcePages: sourcePages.length,
      surfaces: result.results.length, scrollEndScreenshots: scrollEndScreenshots.length,
      actuallyOpenedTiles: opened.length },
    originalReportsAuthorFreezesSnapshotsAndRecoveryBytesUnchanged: true,
    metadataClonedPerRecord: true, sourceScienceFigureGatesRepeated: false,
    archiverRepeatedAnyGate: false, existingAffectedDisplayCorrectionConsumed: true,
    browserRendererNativeReviewDbGitOrMeterCalls: 0,
    t4PriorD017ArchiveNotRepeated: true, blocked60And62And65NotPromotedOrRebound: true,
    superseded65SeedCheckpointHistoryOnly: true,
  };
  return { inputBytes, indexBytes, index, plan, protectedProducts, summary };
}

async function main() {
  assert.deepEqual(process.argv.slice(2), ['--execute'],
    'Prepared only; Main must provide final inputs and explicitly authorize execution.');
  const state = await prepareRetention();
  assert.deepEqual(await bytes(inputsPath), state.inputBytes);
  assert.deepEqual(await bytes(indexPath), state.indexBytes, 'Concurrent shared evidence change');
  for (const item of state.protectedProducts) await verify(item.path, item.sha256);
  for (const [destination, item] of state.plan) {
    await verify(item.source, item.sha256);
    await immutableWrite(destination, item.data);
    const record = { path: destination, sha256: item.sha256, originalPath: item.source,
      batch: 'D-018', ...structuredClone(item.metadata) };
    if (!state.index[item.collection].some(row => relative(row.path) === destination)) {
      state.index[item.collection].push(record);
    }
  }
  const manifestBytes = Buffer.from(`${JSON.stringify(state.summary, null, 2)}\n`);
  await immutableWrite(retentionManifest, manifestBytes);
  if (!state.index.reports.some(item => relative(item.path) === retentionManifest)) {
    state.index.reports.push({ path: retentionManifest, sha256: hash(manifestBytes), batch: 'D-018' });
  }
  for (const item of state.protectedProducts) await verify(item.path, item.sha256);
  assert.deepEqual(await bytes(inputsPath), state.inputBytes);
  assert.deepEqual(await bytes(indexPath), state.indexBytes, 'Concurrent index update; preserve copies and stop');
  state.index.updatedAt = new Date().toISOString();
  await fs.writeFile(absolute(indexPath), `${JSON.stringify(state.index, null, 2)}\n`);
  console.log('D018 evidence retained. No product/spec/media/meter changes; rebind requires separate authorization.');
}

if (process.argv[1] && absolute(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
