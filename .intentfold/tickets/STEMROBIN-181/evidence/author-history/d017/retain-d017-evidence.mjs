import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  root, ticket, evidence, indexPath, book, durableFigures, collections,
  absolute, relative, hash, bytes, read, exists, bind, records, lookup,
  verify, activePaths, scratch, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

export {
  root, ticket, evidence, indexPath, book, durableFigures, absolute, relative,
  hash, bytes, read, exists, bind, lookup, verify, activePaths, scratch, immutableWrite,
};
export const inputsPath = `${ticket}/tmp/d017-retention-inputs.json`;
export const retentionManifest = `${evidence}/reports/d017-retention-manifest.json`;
export const completeCards = ['phy9-c2-s1', 'phy9-c2-s2-n59', 'phy9-c2-s2-n61'];
export const excludedCard = 'phy9-c1-s7-t4';
export const mandatoryFigures = ['fig-103', 'tbl-p0146-01'];
export const excludedFigures = ['fig-101', 'fig-102'];
export const blockerReportPath = `${ticket}/tmp/d017-t4-offline-blocker.json`;
export const blockedCheckpoint = `${ticket}/tmp/offline-d017/initial-four-card-checkpoint.json`;
export const finalResultPath = `${ticket}/tmp/offline-d017/result-${completeCards.join('--')}.json`;

// Main supplies actual final hashes after screens freeze; no provisional completion.
// {completeCards:[{id,science:{path,sha256}}],
//  excludedCards:[{id,status:"blocked",report:{path,sha256}}],
//  screens:{result,tiles,review}, interactionGates:[{card,surface,report}],
//  extraEvidence:[{path,sha256}]}
export async function finalInputs() {
  assert.ok(await exists(inputsPath), 'Prepared only: final D017 card/screen bindings have not been supplied.');
  const inputBytes = await bytes(inputsPath);
  const input = JSON.parse(inputBytes);
  assert.ok(Array.isArray(input.completeCards));
  const ids = input.completeCards.map(card => card.id);
  exactSet(ids, completeCards, 'Only the three complete D017 cards');
  assert.ok(Array.isArray(input.excludedCards) && input.excludedCards.length === 1);
  const excluded = input.excludedCards[0];
  assert.equal(excluded.id, excludedCard);
  assert.equal(excluded.status, 'blocked');
  assert.equal(relative(excluded.report.path), blockerReportPath);
  await verify(excluded.report.path, excluded.report.sha256);
  const blocker = await read(excluded.report.path);
  assert.equal(blocker.status, 'blocked');
  assert.equal(blocker.lesson, excludedCard);
  assert.equal(blocker.failedSurface, 'exercises');
  assert.equal(blocker.viewport, 390);
  assert.equal(blocker.figure, 'fig-101');
  assert.equal(blocker.actualMediaWidthPx, 310.015625);
  assert.equal(blocker.actualPhiTextPx, 15.50078125);
  assert.equal(blocker.requiredMinTextPx, 16);
  assert.equal(blocker.authorRepairsUsed, 1);
  assert.equal(blocker.furtherRepairsPerformed, 0);
  exactSet(blocker.completedCards, completeCards, 'Blocker records the same completed subset');
  assert.equal(relative(blocker.initialFourCardCheckpoint.path), blockedCheckpoint);
  await verify(blocker.initialFourCardCheckpoint.path, blocker.initialFourCardCheckpoint.sha256);
  const checkpoint = await read(blocker.initialFourCardCheckpoint.path);
  assert.equal(checkpoint.status, 'fail', 'Retain the actual blocked surface, never convert it to a pass');
  assert.ok(checkpoint.error?.includes('fig-101') && checkpoint.error.includes('310.015625'));
  assert.ok(input.screens && ['result', 'tiles', 'review'].every(key => input.screens[key]?.sha256),
    'Final result, tile manifest and unique screenshot review are all required');
  assert.ok(Array.isArray(input.interactionGates) && Array.isArray(input.extraEvidence));
  for (const card of input.completeCards) {
    assert.match(card.id, /^[a-z0-9-]+$/);
    await verify(card.science.path, card.science.sha256);
    const source = await read(`${book}/lessons/${card.id}/lesson.json`);
    assert.equal(source.id, card.id);
    assert.ok(source.start_page <= 155, 'Source156+ is outside this delivery');
    const refs = source.prose.flatMap(block => block.source_refs ?? []);
    assert.ok(refs.length, 'Cannot derive source-page coverage');
    for (const ref of refs) {
      const match = ref.match(/^p(\d{4})#/);
      assert.ok(match && Number(match[1]) <= 155, `Source156+ or unknown source ref: ${ref}`);
    }
  }
  assert.equal(relative(input.screens.result.path), finalResultPath);
  assert.equal(relative(input.screens.tiles.path), `${ticket}/tmp/offline-d017/d017-screenshot-tiles.json`);
  for (const binding of Object.values(input.screens)) await verify(binding.path, binding.sha256);
  for (const surface of ['choices', 'answers']) {
    const matches = input.interactionGates.filter(gate =>
      gate.card === excludedCard && gate.surface === surface);
    assert.equal(matches.length, 1, `Retain the original t4 ${surface} gate as blocked-card history`);
  }
  for (const gate of input.interactionGates) {
    assert.ok(gate.card === excludedCard && ['choices', 'answers'].includes(gate.surface));
    await verify(gate.report.path, gate.report.sha256);
  }
  for (const binding of input.extraEvidence) await verify(binding.path, binding.sha256);
  return { input, inputBytes, blocker };
}

const exactSet = (actual, expected, label) => {
  assert.equal(new Set(actual).size, actual.length, `Duplicate ${label}`);
  assert.deepEqual([...actual].sort(), [...expected].sort(), label);
};
const surfaceKey = item => `${item.card ?? item.id}:${item.surface}:${item.viewport?.width ?? item.viewport}`;
const tileKey = item => `${relative(item.path)}:${item.sha256}`;
const pngDimensions = data => {
  assert.equal(data.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  return [data.readUInt32BE(16), data.readUInt32BE(20)];
};
const mergeMetadata = (target, metadata) => {
  for (const [key, value] of Object.entries(metadata)) {
    if (!(key in target)) target[key] = value;
    else if (key === 'role' && target.role !== value) {
      target.roles = [...new Set([...(target.roles ?? [target.role]), value])];
    } else assert.deepEqual(target[key], value, `Conflicting evidence metadata: ${key}`);
  }
};

export async function figureIds(cards) {
  const ids = new Set();
  for (const card of cards) {
    const folder = `${book}/editions/modern-us-neutral/lessons/${card.id}`;
    const lesson = await read(`${folder}/lesson.json`);
    const exercises = await read(`${folder}/exercises.json`);
    for (const figure of lesson.figures ?? []) ids.add(figure.id);
    for (const block of lesson.prose ?? []) {
      if (block.kind === 'fig') ids.add(block.id);
      for (const figure of block.figures ?? []) ids.add(figure.id);
    }
    for (const exercise of exercises.exercises ?? []) {
      for (const id of exercise.figure_refs ?? []) ids.add(id);
      for (const figure of exercise.figures ?? []) ids.add(figure.id);
    }
  }
  assert.ok(mandatoryFigures.every(id => ids.has(id)), 'Missing a confirmed D017 figure reference');
  assert.ok(excludedFigures.every(id => !ids.has(id)), 'Do not complete or rebind t4 resources101/102');
  assert.ok([...ids].every(id => /^[a-z0-9-]+$/.test(id)), 'Invalid figure identity');
  return [...ids].sort();
}

export async function prepareRetention() {
  const { input, inputBytes, blocker } = await finalInputs();
  const indexBytes = await bytes(indexPath);
  const index = JSON.parse(indexBytes);
  for (const key of collections) assert.ok(Array.isArray(index[key]), `Missing ${key}`);
  const plan = new Map();
  const reused = [];
  const protectedProducts = [];
  const frozenInputAliases = [];

  async function retain(source, destination, collection = 'reports', metadata = {}, expected) {
    source = relative(source);
    destination = relative(destination);
    assert.ok(destination.startsWith(`${evidence}/`) && collections.includes(collection));
    const pagePath = source.match(/(?:\/pages\/|\/source-pages\/)(\d{4})(?:\/|$)/);
    if (pagePath) assert.ok(Number(pagePath[1]) <= 155, 'Do not retain unintegrated source156+');
    const batchPath = source.match(/(?:next-source|source-review)-(\d{4})-(\d{4})/);
    if (batchPath) assert.ok(Number(batchPath[2]) <= 155, 'Do not retain a source156+ author/review batch');
    const data = await bytes(source);
    const sha256 = hash(data);
    if (expected) assert.equal(sha256, expected, `Frozen evidence drift: ${source}`);
    const existing = lookup(index, source, sha256);
    if (existing) {
      await verify(existing, sha256);
      const record = records(index).find(row => relative(row.path) === existing && row.sha256 === sha256);
      mergeMetadata(record, metadata);
      reused.push({ originalPath: source, path: existing, sha256 });
      return existing;
    }
    const previous = plan.get(destination);
    if (previous) {
      assert.equal(previous.sha256, sha256, `Destination collision: ${destination}`);
      mergeMetadata(previous.metadata, metadata);
      return destination;
    }
    for (const record of records(index).filter(record => relative(record.path) === destination)) {
      assert.equal(record.sha256, sha256, `Index collision: ${destination}`);
    }
    if (await exists(destination)) await verify(destination, sha256);
    plan.set(destination, { source, data, sha256, collection, metadata: structuredClone(metadata) });
    return destination;
  }
  async function folder(source, destination, collection = 'reports', metadata = {}) {
    assert.ok(await exists(source), `Missing frozen folder: ${source}`);
    for (const file of await walk(source)) {
      const pixel = /\.w\d+\.png$/.test(file) || /\/(?:preview|w(?:640|331|342))[^/]*\.png$/.test(file);
      await retain(file, `${destination}/${path.relative(source, file)}`,
        pixel ? 'figurePixels' : collection, metadata);
    }
  }
  const projectedIndex = () => {
    const projected = structuredClone(index);
    for (const [destination, item] of plan) {
      projected[item.collection].push({
        path: destination, sha256: item.sha256, originalPath: item.source, ...item.metadata,
      });
    }
    return projected;
  };
  async function boundInputs(reportPath, destination, metadata) {
    const references = [];
    activePaths(await read(reportPath), (owner, key, sha256) =>
      references.push({ file: owner[key], sha256 }));
    for (const reference of references) {
      if (!scratch(reference.file)) continue;
      const expected = reference.sha256 ?? hash(await bytes(reference.file));
      if (lookup(projectedIndex(), reference.file, expected)) continue;
      const snapshot = [...plan.entries()].find(([, item]) =>
        item.sha256 === expected && (!item.metadata.original || item.metadata.original === reference.file));
      if (snapshot) {
        const [destination, item] = snapshot;
        mergeMetadata(item.metadata, { original: reference.file });
        frozenInputAliases.push({
          originalPath: reference.file, path: destination, sha256: expected,
          snapshotSource: item.source,
          basis: 'Exact preserved historical bytes match the frozen SHA; current revised file not substituted',
        });
        continue;
      }
      await retain(reference.file,
        `${destination}/${hash(reference.file).slice(0, 12)}-${path.basename(reference.file)}`,
        'reports', metadata, expected);
    }
  }

  const requiredReports = [
    '9p-t4-prose-freeze.json', '9p-t4-science-review.json', '9p-t4-figure-review.json',
    '9p-n58-prose-freeze.json', '9p-n58-science-review.json', '9p-n58-figure-review.json',
    '9p-n59-prose-freeze.json', '9p-n59-science-review.json', '9p-n59-figure-review.json',
    '9p-n61-prose-freeze.json', '9p-n61-science-review.json',
    '9p-t4-answer-review.json', '9p-t4-choice-review.json', '9p-t4-choice-author-comparison.json',
    '9p-t4-answer-author-freeze.json',
    'd017-t4-figures-author-freeze.json', 'd017-n58-portrait-author-freeze.json',
    'd017-n59-figure-author-freeze.json',
    'd017-n58-path-correction.json',
    'd017-answer-display-correction.json', 'fix-d017-answer-display.mjs',
    'd017-finalization-binding.json', 'd017-screenshot-review.json',
    'answer-review-9p-ex8-capture.json', 'answer-review-9p-ex8-capture-promotion.json',
    ...['0144-0147', '0148-0151', '0152-0155'].flatMap(pages =>
      [`source-review-9p-${pages}.json`, `source-review-9p-${pages}-finalization-trace.json`]),
    '9p-t4-choice-seed.json', '9p-t4-choice-draft.json',
    '9p-t4-choice-view.json', '9p-t4-choice-author-manifest.json',
  ];
  for (const name of requiredReports) {
    await retain(`${ticket}/tmp/${name}`, `${evidence}/reports/${name}`);
  }
  const selected = /^(?:d017-|(?:author|record|review|promote|recheck|freeze|reuse|recover|complete|finalize|finish|crop|fix|retain|rebind|check)-d017|author-9p-(?:t4|n58|n59|n61)|9p-(?:t4|n58|n59|n61)-|source-review-9p-(?:0144-0147|0148-0151|0152-0155)|finalize-source-(?:0144-0147|0148-0151|0152-0155))/;
  for (const entry of await fs.readdir(absolute(`${ticket}/tmp`), { withFileTypes: true })) {
    if (entry.isFile() && selected.test(entry.name) && !requiredReports.includes(entry.name)) {
      await retain(`${ticket}/tmp/${entry.name}`, `${evidence}/author-history/d017/${entry.name}`);
    }
  }
  for (const name of ['retain-d017-evidence.mjs', 'rebind-d017-durable-paths.mjs',
    'retain-d016-evidence.mjs', 'promote-ex8-book-answers.mjs']) {
    await retain(`${ticket}/tmp/${name}`, `${evidence}/author-history/d017/${name}`);
  }
  for (const pages of ['0144-0147', '0148-0151', '0152-0155']) {
    await folder(`${ticket}/tmp/9p-next-source-${pages}`,
      `${evidence}/author-history/d017/9p-next-source-${pages}`);
    const crops = `${ticket}/tmp/source-review-9p-${pages}-evidence`;
    if (await exists(crops)) await folder(crops, `${evidence}/source-crops/d017/${path.basename(crops)}`, 'sourceCrops');
  }
  for (const entry of await fs.readdir(absolute(`${ticket}/tmp`), { withFileTypes: true })) {
    if (entry.isDirectory() && /^d017-/.test(entry.name)) {
      await folder(`${ticket}/tmp/${entry.name}`, `${evidence}/author-history/d017/${entry.name}`);
    }
  }
  for (const entry of await fs.readdir(absolute('.tmp/STEMROBIN-181'), { withFileTypes: true })) {
    if (entry.isDirectory() && (/^9p-d017-/.test(entry.name) ||
      ['9p-n58-portrait', '9p-n59-figures'].includes(entry.name))) {
      await folder(`.tmp/STEMROBIN-181/${entry.name}`,
        `${evidence}/figures/candidates/9p/${entry.name}`, 'figureFiles',
        { role: 'Exact author candidates, including failed initial/repair evidence; not an approval' });
    }
  }
  const correction = await read(`${ticket}/tmp/d017-n58-path-correction.json`);
  for (const original of correction.preservedOriginals) {
    await retain(original.preserved.path,
      `${evidence}/author-history/d017/d017-n58-path-original/${path.basename(original.preserved.path)}`,
      'reports', { original: original.active, role: 'Pre-path-correction bytes, never replaced by current spec' },
      original.preserved.sha256);
  }
  for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
    await retain(`${ticket}/tmp/9p-t4-before/${name}`,
      `${evidence}/author-history/d017/9p-t4-before/${name}`, 'reports',
      { original: `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${excludedCard}/${name}`,
        role: 'Original native t4 template before authoring/promotion; frozen bytes retained' });
  }
  const recovery = await read(`${ticket}/tmp/d017-figure-template-recovery.json`);
  assert.equal(recovery.status, 'exact-original-template-bytes-recovered');
  assert.equal(recovery.method.cmdPrepareCalled, false);
  assert.equal(recovery.method.gatesRepeated, false);
  for (const item of recovery.recoveries) {
    assert.ok(completeCards.includes(item.card));
    assert.equal(item.recovered.sha256, item.expectedSha256);
    await verify(item.originalPath, item.currentActiveTemplateSha256Unchanged);
    await retain(item.recovered.path,
      `${evidence}/author-history/d017/d017-figure-template-recovery/${item.card}/figures.template.json`,
      'reports', item.metadata, item.expectedSha256);
  }
  const capture = await read(`${ticket}/tmp/answer-review-9p-ex8-capture.json`);
  const captureRoot = `${ticket}/tmp/9p-ex7-answer-capture`;
  for (const [binding, source, name, collection] of [
    [capture.authorFreeze, `${captureRoot}/author-freeze.json`, 'author-freeze.json', 'reports'],
    [capture.candidate, `${captureRoot}/exercise8.candidate.json`, 'exercise8.candidate.json', 'reports'],
    [capture.snippet.file, `${captureRoot}/snippets/exercise8.png`, 'snippets/exercise8.png', 'sourceCrops'],
  ]) {
    assert.equal(relative(binding.path), source, 'Use the exact exercise8 capture input, not a guessed candidate');
    await retain(binding.path, `${evidence}/author-history/d017/9p-ex8-answer-capture/${name}`,
      collection, { role: 'Exact new exercise8 capture input; retained for blocked t4, no gate repeated' },
      binding.sha256);
  }
  assert.equal(relative(capture.source.path), '.tmp/ld-s10y-answer/9p/pages/page-0337.png');
  await retain(capture.source.path, `${evidence}/source-pages/9p/answer-page-0337.png`,
    'sourceCrops', { role: 'Shared original0337 parent; exact prior retention may be reused' }, capture.source.sha256);
  for (const name of requiredReports.filter(name => name.endsWith('.json'))) {
    await boundInputs(`${ticket}/tmp/${name}`, `${evidence}/author-history/d017/${name}/bound-inputs`,
      { role: 'Exact frozen author/gate/correction input; original reports remain verbatim' });
  }
  const excluded = input.excludedCards[0];
  await retain(excluded.report.path, `${evidence}/reports/${path.basename(blockerReportPath)}`,
    'reports', { card: excludedCard, status: 'blocked', role: 'Original t4 surface exclusion record' },
    excluded.report.sha256);
  await retain(blocker.initialFourCardCheckpoint.path, `${evidence}/offline/d017/history/${path.basename(blockedCheckpoint)}`,
    'reports', { card: excludedCard, status: 'blocked', role: 'Final t4 mobile surface blocker, not completion' },
    blocker.initialFourCardCheckpoint.sha256);
  await retain(`${ticket}/tmp/offline-d017/initial-answer-1440.png`,
    `${evidence}/offline/d017/history/initial-answer-1440.png`, 'surfaces',
    { card: excludedCard, surface: 'answers', viewport: 1440,
      role: 'Initial full-atom subscript clipping failure; no pixel review repeated' });
  await folder(`${ticket}/tmp/offline-d017`, `${evidence}/offline/d017/history`, 'reports',
    { role: 'Verbatim D017 checkpoint/screens/diagnostics history; not a completed-surface assertion' });
  const answerCorrection = await read(`${ticket}/tmp/d017-answer-display-correction.json`);
  await verify(answerCorrection.preservedInitialCheckpoint.path, answerCorrection.preservedInitialCheckpoint.sha256);
  const initialAnswerFailure = await read(answerCorrection.preservedInitialCheckpoint.path);
  assert.equal(initialAnswerFailure.status, 'fail');
  const offlineHistory = {
    initialAnswerFailure: answerCorrection.preservedInitialCheckpoint,
    initialAnswerPixels: await bind(`${ticket}/tmp/offline-d017/initial-answer-1440.png`),
    answerDisplayCorrection: await bind(`${ticket}/tmp/d017-answer-display-correction.json`),
    finalT4MobileFailure: blocker.initialFourCardCheckpoint,
    t4ExclusionReport: excluded.report,
    semanticGatesAndOriginalAuthorDraftsNotChanged: true,
    priorNativeWidthFigurePassDoesNotOverrideActualMobileFailure: true,
  };
  const excludedSnapshots = [];
  for (const base of [
    `${book}/lessons/${excludedCard}`,
    `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${excludedCard}`,
    `${book}/editions/modern-us-neutral/lessons/${excludedCard}`,
  ]) {
    if (!(await exists(base))) continue;
    for (const file of await walk(base)) {
      await retain(file, `${evidence}/author-history/d017/blocked/${hash(base).slice(0, 12)}/${path.relative(base, file)}`,
        'reports', { card: excludedCard, role: 'Blocked t4 source/author/product snapshot; not delivered or promoted' });
      if (base.startsWith(`${book}/editions/`)) {
        const binding = await bind(file);
        protectedProducts.push(binding);
        excludedSnapshots.push(binding);
      }
    }
  }
  const t4SourceExercises = await read(`${book}/lessons/${excludedCard}/exercises.json`);
  assert.equal(t4SourceExercises.exercises.length, 7, 'Keep all seven source tasks despite surface blocker');
  for (const id of excludedFigures) {
    await retain(`${book}/figures/${id}.png`, `${evidence}/source-crops/9p/${id}.png`,
      'sourceCrops', { figure: id, role: 'Excluded t4 source figure, not a new completed resource' });
    for (const name of (await fs.readdir(absolute(durableFigures))).filter(name => name.startsWith(`${id}.`))) {
      const file = `${durableFigures}/${name}`;
      await retain(file, `${evidence}/author-history/d017/blocked/figures/${name}`,
        'figureFiles', { card: excludedCard, figure: id, role: 'Exact unstaged101/102 history; never rebound here' });
      protectedProducts.push(await bind(file));
    }
  }
  for (const binding of input.extraEvidence) {
    await retain(binding.path, `${evidence}/author-history/d017/extra/${hash(binding.path).slice(0, 12)}-${path.basename(binding.path)}`,
      'reports', { role: 'Main-selected exact additional final evidence' }, binding.sha256);
  }

  const counts = [];
  const expectedSurfaces = [];
  for (const card of input.completeCards) {
    const gate = await read(card.science.path);
    assert.equal(gate.status, 'pass', `The recorded SCI gate is not pass: ${card.id}`);
    await retain(card.science.path, `${evidence}/reports/${path.basename(card.science.path)}`,
      'reports', { card: card.id, role: 'Existing unique SCI gate' }, card.science.sha256);
    const references = [];
    activePaths(gate, (owner, key, sha256) => references.push({ file: owner[key], sha256 }));
    for (const reference of references) {
      if (!scratch(reference.file)) continue;
      const expected = reference.sha256 ?? hash(await bytes(reference.file));
      const existing = lookup(projectedIndex(), reference.file, expected);
      if (existing) continue;
      await retain(reference.file,
        `${evidence}/author-history/d017/${card.id}/gate-inputs/${hash(reference.file).slice(0, 12)}-${path.basename(reference.file)}`,
        'reports', { card: card.id, role: 'Exact SCI-bound author input' }, expected);
    }
    const draftFolder = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card.id}`;
    for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
      await retain(`${draftFolder}/${name}`, `${evidence}/author-history/d017/${card.id}/${name}`,
        'reports', { card: card.id, role: 'Final author scratch snapshot; approval not regenerated' });
    }
    const finalFolder = `${book}/editions/modern-us-neutral/lessons/${card.id}`;
    const lesson = await read(`${finalFolder}/lesson.json`);
    const exercises = await read(`${finalFolder}/exercises.json`);
    const sourceLesson = await read(`${book}/lessons/${card.id}/lesson.json`);
    const sourceExercises = await read(`${book}/lessons/${card.id}/exercises.json`);
    counts.push({ card: card.id, sourceProseBlocks: sourceLesson.prose.length,
      sourceTasks: sourceExercises.exercises.length, modernTasks: exercises.exercises.length });
    for (const file of await walk(finalFolder)) protectedProducts.push(await bind(file));
    const surfaces = [
      { surface: 'text', empty: !lesson.prose.some(block => block.kind === 'fig' || block.text?.trim()) },
      { surface: 'exercises', empty: exercises.exercises.length === 0 },
    ];
    for (const surface of surfaces) {
      for (const viewport of [1440, 390]) expectedSurfaces.push({ card: card.id, viewport, ...surface });
    }
  }
  for (const gate of input.interactionGates) {
    await retain(gate.report.path, `${evidence}/reports/${path.basename(gate.report.path)}`,
      'reports', { card: gate.card, surface: gate.surface,
        role: 'Existing unique interaction gate retained for blocked t4, not completion' }, gate.report.sha256);
  }
  const sourcePages = [];
  for (let page = 144; page <= 155; page++) {
    const id = String(page).padStart(4, '0');
    const sourceFolder = `${book}/pages/${id}`;
    const source = await read(`${sourceFolder}/page.json`);
    const audit = await read(`${sourceFolder}/audit.json`);
    for (const name of ['page.md', 'page.json', 'audit.json']) {
      await retain(`${sourceFolder}/${name}`, `${evidence}/author-history/d017/source-pages/${id}/${name}`);
    }
    for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
      await retain(`.tmp/ld-s10y-lesson/9p/pages/${id}/${name}`,
        `${evidence}/source-pages/9p/${id}/${name}`, 'sourceCrops', { page, role: 'Already finalized source/history' });
    }
    await verify(`.tmp/ld-s10y-lesson/9p/pages/${id}/page.png`, source.meta.render.sha256);
    const sourceFigures = source.blocks.filter(block => block.kind === 'fig').map(block => block.id);
    for (const id of sourceFigures) {
      await retain(`${book}/figures/${id}.png`, `${evidence}/source-crops/9p/${id}.png`,
        'sourceCrops', { page, figure: id, role: 'Exact original source crop' });
    }
    sourcePages.push({ page, printedRowsIncludingFooter: audit.lines_printed,
      authoredRows: audit.lines_md, sourceFigures, errata: source.meta.errata ?? [],
      audit: await bind(`${sourceFolder}/audit.json`) });
  }
  const figures = await figureIds(input.completeCards);
  for (const id of figures) {
    await retain(`${book}/figures/${id}.png`, `${evidence}/source-crops/9p/${id}.png`,
      'sourceCrops', { figure: id, role: 'Referenced original of a completed D017 card' });
    const independent = await read(`${durableFigures}/${id}.independent-review.json`);
    assert.equal(independent.status, 'pass');
    const references = [];
    activePaths(independent, (owner, key, sha256) => references.push({ file: owner[key], sha256 }));
    for (const reference of references) {
      const expected = reference.sha256 ?? hash(await bytes(reference.file));
      if (!scratch(reference.file)) {
        const retained = lookup(projectedIndex(), reference.file, expected);
        if (retained) continue;
        if (!(await exists(reference.file))) {
          assert.ok(reference.file.startsWith(`${evidence}/reports/`), `Missing durable active binding: ${reference.file}`);
          const original = `${ticket}/tmp/${path.basename(reference.file)}`;
          await retain(original, reference.file, 'reports', { figure: id, role: 'Immutable original unique gate' }, expected);
        } else await verify(reference.file, expected);
        continue;
      }
      if (!lookup(projectedIndex(), reference.file, expected)) {
        await retain(reference.file,
          `${evidence}/author-history/d017/${id}/active-inputs/${hash(reference.file).slice(0, 12)}-${path.basename(reference.file)}`,
          'reports', { figure: id, role: 'Exact active figure-evidence dependency' }, expected);
      }
    }
    for (const file of (await fs.readdir(absolute(durableFigures))).filter(name => name.startsWith(`${id}.`))) {
      protectedProducts.push(await bind(`${durableFigures}/${file}`));
    }
  }

  const result = await read(input.screens.result.path);
  const tiles = await read(input.screens.tiles.path);
  const review = await read(input.screens.review.path);
  assert.equal(result.status, 'pass');
  assert.equal(review.status, 'pass');
  assert.equal(relative(review.batchResult.path), relative(input.screens.result.path));
  assert.equal(review.batchResult.sha256, input.screens.result.sha256);
  exactSet(result.results.map(surfaceKey), expectedSurfaces.map(surfaceKey), 'final surface coverage');
  const priorCheckpoint = await read(blocker.initialFourCardCheckpoint.path);
  const desktop = result.results.filter(row => row.viewport.width === 1440);
  assert.equal(desktop.length, 6, 'Reuse only the six already-passed three-card desktop surfaces');
  for (const surface of desktop) {
    const prior = priorCheckpoint.results.find(row => surfaceKey(row) === surfaceKey(surface));
    assert.ok(prior, `Missing reused desktop checkpoint evidence: ${surfaceKey(surface)}`);
    assert.deepEqual(surface, prior, 'Final desktop evidence must be reused verbatim, not rerun');
  }
  exactSet(review.surfaces.map(surfaceKey), expectedSurfaces.filter(row => !row.empty).map(surfaceKey), 'nonempty reviews');
  exactSet(review.emptySourceDefinedSurfaces.map(surfaceKey), expectedSurfaces.filter(row => row.empty).map(surfaceKey), 'source-defined empties');
  exactSet(tiles.emptySourceDefinedSurfaces.map(surfaceKey), review.emptySourceDefinedSurfaces.map(surfaceKey), 'tile empties');
  exactSet(tiles.tiles.map(tileKey), review.tiles.map(tileKey), 'actually opened final tiles');
  exactSet([...new Set(review.tiles.map(surfaceKey))],
    expectedSurfaces.filter(row => !row.empty).map(surfaceKey), 'nonempty tile coverage');
  for (const binding of Object.values(input.screens)) {
    await retain(binding.path, `${evidence}/offline/d017/${path.basename(binding.path)}`, 'reports', {}, binding.sha256);
  }
  for (const surface of result.results) {
    const definition = expectedSurfaces.find(row => surfaceKey(row) === surfaceKey(surface));
    const inspection = review.surfaces.find(row => surfaceKey(row) === surfaceKey(surface));
    if (inspection) assert.equal(inspection.status, 'pass');
    await retain(surface.screenshot, `${evidence}/offline/d017/${path.basename(surface.screenshot)}`, 'surfaces',
      { card: surface.id, surface: surface.surface, viewport: surface.viewport.width,
        emptySourceDefined: definition.empty, inspectedViaOpenedTiles: !definition.empty,
        inspectedBy: inspection?.reviewer ?? null }, surface.screenshotSha256);
  }
  for (const tile of review.tiles) {
    assert.equal(tile.actuallyOpened, true);
    assert.ok(tile.reviewer);
    const original = tiles.tiles.find(row => tileKey(row) === tileKey(tile));
    for (const key of ['card', 'surface', 'viewport', 'crop']) assert.deepEqual(tile[key], original[key]);
    assert.equal(relative(tile.source), relative(original.source));
    const parent = result.results.find(row => relative(row.screenshot) === relative(tile.source));
    assert.ok(parent && surfaceKey(parent) === surfaceKey(tile));
    const [width, height] = pngDimensions(await bytes(tile.source));
    const [left, top, right, bottom] = tile.crop;
    assert.ok(tile.crop.length === 4 && tile.crop.every(Number.isInteger));
    assert.ok(left >= 0 && top >= 0 && right > left && bottom > top && right <= width && bottom <= height);
    const data = await bytes(tile.path);
    assert.equal(hash(data), tile.sha256);
    assert.deepEqual(pngDimensions(data), [right - left, bottom - top]);
    await retain(tile.path, `${evidence}/offline/d017/${path.basename(tile.path)}`, 'surfaces',
      { card: tile.card, surface: tile.surface, viewport: tile.viewport,
        actuallyOpened: true, inspectedBy: tile.reviewer, crop: tile.crop,
        cropOf: tile.source, parentSha256: parent.screenshotSha256 }, tile.sha256);
  }
  const summary = {
    ticket: 'STEMROBIN-181', batch: 'D-017', scope: input.completeCards.map(card => card.id),
    completeCards: input.completeCards.map(card => card.id),
    excludedCards: [{ ...excluded, sourceTasks: t4SourceExercises.exercises.length,
      blocker: { surface: blocker.failedSurface, viewport: blocker.viewport, figure: blocker.figure,
        actualMediaWidthPx: blocker.actualMediaWidthPx, actualPhiTextPx: blocker.actualPhiTextPx,
        requiredMinTextPx: blocker.requiredMinTextPx, authorRepairsUsed: blocker.authorRepairsUsed,
        furtherRepairsPerformed: blocker.furtherRepairsPerformed },
      figures: excludedFigures, completed: false, activeDurableRebind: false,
      modernCardAndFigures101102Staging: false, snapshots: excludedSnapshots }],
    finalInputs: { path: inputsPath, sha256: hash(inputBytes) }, cardCounts: counts, figures, sourcePages,
    frozenInputAliases,
    screens: input.screens, offlineHistory, preservedProducts: protectedProducts, reused,
    derivedCounts: { sourcePages: sourcePages.length, plannedFiles: plan.size,
      surfaces: result.results.length, nonemptySurfaces: review.surfaces.length,
      sourceDefinedEmptySurfaces: review.emptySourceDefinedSurfaces.length,
      actuallyOpenedTiles: review.tiles.length },
    exactGateAndFailedInitialBytesPreserved: true,
    n58PathCorrectionAndOriginalSnapshotsRetained: true,
    t4InitialPassesTwoDisplayFailuresAndCorrectionRetainedAsBlockedHistory: true,
    sourceScienceFigureChoiceAnswerGatesRepeated: false, browserRendererOrMeterWrites: false,
    excludes: ['Source156+ not integrated', 't4 and figures101/102 not delivered or staged',
      'n55 as a delivered card; failed author history only'],
  };
  return { inputBytes, indexBytes, index, plan, protectedProducts, summary };
}

async function main() {
  assert.deepEqual(process.argv.slice(2), ['--execute'],
    'Prepared only; Main must supply final inputs and explicitly authorize --execute.');
  const state = await prepareRetention();
  assert.deepEqual(await bytes(inputsPath), state.inputBytes, 'Final inputs changed during preflight');
  assert.deepEqual(await bytes(indexPath), state.indexBytes, 'Shared evidence index changed during preflight');
  for (const binding of state.protectedProducts) await verify(binding.path, binding.sha256);
  for (const [destination, item] of state.plan) {
    await verify(item.source, item.sha256);
    await immutableWrite(destination, item.data);
    const record = { path: destination, sha256: item.sha256, originalPath: item.source,
      batch: 'D-017', ...item.metadata };
    if (!state.index[item.collection].some(row => row.path === destination)) state.index[item.collection].push(record);
  }
  const manifestBytes = Buffer.from(`${JSON.stringify(state.summary, null, 2)}\n`);
  await immutableWrite(retentionManifest, manifestBytes);
  if (!state.index.reports.some(row => row.path === retentionManifest)) {
    state.index.reports.push({ path: retentionManifest, sha256: hash(manifestBytes), batch: 'D-017' });
  }
  for (const binding of state.protectedProducts) await verify(binding.path, binding.sha256);
  assert.deepEqual(await bytes(inputsPath), state.inputBytes, 'Final inputs changed before index update');
  assert.deepEqual(await bytes(indexPath), state.indexBytes, 'Concurrent evidence index update; copies preserved');
  state.index.updatedAt = new Date().toISOString();
  await fs.writeFile(absolute(indexPath), `${JSON.stringify(state.index, null, 2)}\n`);
  console.log(`D017 evidence retained; products/meter unchanged. Rebind requires separate authorization.`);
}

if (process.argv[1] && absolute(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
