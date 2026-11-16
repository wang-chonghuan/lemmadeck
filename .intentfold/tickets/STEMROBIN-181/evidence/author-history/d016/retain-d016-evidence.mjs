import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
export const ticket = '.intentfold/tickets/STEMROBIN-181';
export const evidence = `${ticket}/evidence`;
export const indexPath = `${evidence}/index.json`;
export const book = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
export const durableFigures = `${book}/editions/modern-us-neutral/figures`;
export const cards = ['phy9-c1-s6-n54', 'phy9-c1-s6-t8', 'phy9-c1-s7-n56', 'phy9-c1-s7-n57'];
export const collections = ['reports', 'surfaces', 'figurePixels', 'figureFiles', 'sourceCrops'];
export const absolute = file => path.resolve(root, file);
export const relative = file => path.relative(root, absolute(file));
export const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
export const bytes = file => fs.readFile(absolute(file));
export const read = async file => JSON.parse(await bytes(file));
export const exists = file => fs.access(absolute(file)).then(() => true, () => false);
export const bind = async file => ({ path: relative(file), sha256: hash(await bytes(file)) });
export const records = index => collections.flatMap(key => index[key] ?? []);
export const scratch = file => /^(?:\.tmp\/|\.intentfold\/tickets\/STEMROBIN-181\/tmp\/)/.test(relative(file));

export function lookup(index, original, sha256) {
  const matches = records(index).filter(record =>
    [record.path, record.originalPath, record.original].filter(Boolean)
      .some(file => absolute(file) === absolute(original)) && record.sha256 === sha256);
  const paths = [...new Set(matches.map(record => relative(record.path)))].sort();
  return paths[0] ?? null;
}

export async function verify(file, sha256) {
  assert.match(sha256, /^[a-f0-9]{64}$/, `Invalid SHA: ${file}`);
  assert.equal(hash(await bytes(file)), sha256, `Byte drift: ${file}`);
}

// Only path-bearing fields are active references; prose and historical before snapshots are not.
export function activePaths(value, visit, trail = []) {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach((item, i) => activePaths(item, visit, [...trail, i]));
    return;
  }
  if (typeof value.path === 'string') visit(value, 'path', value.sha256, [...trail, 'path']);
  for (const [key, item] of Object.entries(value)) {
    if (['before', 'originalPath', 'original', 'path'].includes(key)) continue;
    if (typeof item === 'string' && /^(?:\.tmp\/|\.intentfold\/|ssot-resources\/|\/Users\/)/.test(item)) {
      visit(value, key, null, [...trail, key]);
    } else if (item && typeof item === 'object') activePaths(item, visit, [...trail, key]);
  }
}

export async function immutableWrite(file, data) {
  if (await exists(file)) assert.deepEqual(await bytes(file), Buffer.from(data), `Refuse overwrite: ${file}`);
  else {
    await fs.mkdir(path.dirname(absolute(file)), { recursive: true });
    await fs.writeFile(absolute(file), data, { flag: 'wx' });
  }
}

export async function walk(folder) {
  const output = [];
  for (const entry of (await fs.readdir(absolute(folder), { withFileTypes: true }))
    .sort((a, b) => a.name.localeCompare(b.name))) {
    const file = `${relative(folder)}/${entry.name}`;
    assert.ok(!entry.isSymbolicLink(), `Unexpected symlink: ${file}`);
    if (entry.isDirectory()) output.push(...await walk(file));
    else if (entry.isFile()) output.push(file);
  }
  return output;
}

function pngDimensions(data) {
  assert.equal(data.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  return [data.readUInt32BE(16), data.readUInt32BE(20)];
}

async function prepare() {
  const originalIndex = await bytes(indexPath);
  const index = JSON.parse(originalIndex);
  for (const key of collections) assert.ok(Array.isArray(index[key]), `Missing index collection ${key}`);
  const plan = new Map();
  const reused = [];
  async function retain(source, destination, collection = 'reports', metadata = {}, expected) {
    assert.ok(collections.includes(collection));
    source = relative(source);
    destination = relative(destination);
    assert.ok(destination.startsWith(`${evidence}/`));
    const data = await bytes(source);
    const sha256 = hash(data);
    if (expected) assert.equal(sha256, expected, `Frozen byte drift: ${source}`);
    const existing = lookup(index, source, sha256);
    if (existing) {
      await verify(existing, sha256);
      reused.push({ originalPath: source, path: existing, sha256 });
      return existing;
    }
    if (plan.has(destination)) {
      assert.equal(plan.get(destination).sha256, sha256, `Destination collision: ${destination}`);
      return destination;
    }
    const previous = records(index).filter(record => absolute(record.path) === absolute(destination));
    previous.forEach(record => assert.equal(record.sha256, sha256, `Index collision: ${destination}`));
    if (await exists(destination)) await verify(destination, sha256);
    plan.set(destination, { source, data, collection, sha256, metadata });
    return destination;
  }
  async function folder(source, destination, collection = 'reports', metadata = {}) {
    for (const file of await walk(source)) {
      await retain(file, `${destination}/${path.relative(source, file)}`,
        /\.w\d+\.png$/.test(file) ? 'figurePixels' : collection, metadata);
    }
  }
  const requiredReports = [
    ...['n54', 't8', 'n56', 'n57'].flatMap(short =>
      [`9p-${short}-prose-freeze.json`, `9p-${short}-science-review.json`]),
    '9p-t8-fig77-context-author-freeze.json', '9p-t8-figure-review.json',
    '9p-n56-figure-review.json', '9p-n57-figure-review.json', 'd016-figures-author-freeze.json',
    'd016-science-references.json', 'd016-independent-raw-solutions.md',
    'source-review-9p-0136-0139.json', 'source-review-9p-0136-0139-finalization-trace.json',
    'source-review-9p-0140-0143.json', 'source-review-9p-0140-0143-correction.json',
    'source-review-9p-0140-0143-finalization-trace.json',
    'source-review-9p-0135-exercise7-heading-correction.json',
    'answer-review-9p-ex7-capture.json', 'answer-review-9p-ex7-capture-promotion.json',
    '9p-t8-answer-review.json', '9p-t8-choice-review.json', '9p-t8-choice-author-comparison.json',
    'd016-native-offline-finalization.json', 'd016-finalization-binding.json',
    'd016-screenshot-review.json',
    'd016-answer-display-finalization.json', 'd016-answer-display-screenshot-correction.json',
  ];
  for (const name of requiredReports) {
    await retain(`${ticket}/tmp/${name}`, `${evidence}/reports/${name}`);
  }
  const selected = /^(?:9p-(?:n54|n56|n57|t8)-|d016-|(?:author|record|review|promote|recheck|freeze|reuse|complete|finalize|finish|crop|retain|rebind)-d016|(?:freeze-9p-n54|author-9p-n56-n57|record-d016-n54-t8|record-d016-n56-n57|(?:complete|finalize)-source-0136-0139|finalize-source-0140-0143|promote-ex7-book-answers)\.)/;
  for (const entry of await fs.readdir(absolute(`${ticket}/tmp`), { withFileTypes: true })) {
    if (entry.isFile() && selected.test(entry.name) && !requiredReports.includes(entry.name) &&
      !['d016-effective-offline-result.json', 'd016-effective-screenshot-tiles.json'].includes(entry.name)) {
      await retain(`${ticket}/tmp/${entry.name}`, `${evidence}/author-history/d016/${entry.name}`);
    }
  }
  for (const name of ['retain-d016-evidence.mjs', 'rebind-d016-durable-paths.mjs']) {
    await retain(`${ticket}/tmp/${name}`, `${evidence}/author-history/d016/${name}`);
  }
  for (const name of ['9p-next-source-0136-0139', '9p-next-source-0140-0143', '9p-n56-n57-before']) {
    await folder(`${ticket}/tmp/${name}`, `${evidence}/author-history/d016/${name}`);
  }
  await folder(`${ticket}/tmp/d016-answer-display`, `${evidence}/author-history/d016/answer-display-correction`);
  for (const name of ['source-review-9p-0136-0139-evidence', 'source-review-9p-0140-0143-evidence']) {
    await folder(`${ticket}/tmp/${name}`, `${evidence}/source-crops/d016/${name}`, 'sourceCrops');
  }
  for (const name of ['9p-d016-figures', '9p-d016-fig77']) {
    await folder(`.tmp/STEMROBIN-181/${name}`, `${evidence}/figures/candidates/9p/${name}`, 'figureFiles');
  }
  const templateBindings = [];
  const cardCounts = [];
  const surfaceDefinition = [];
  for (const card of cards) {
    const short = card.split('-').at(-1);
    const science = await read(`${ticket}/tmp/9p-${short}-science-review.json`);
    assert.equal(science.status, 'pass');
    for (const key of ['template', 'exercisesTemplate', 'source', 'exercisesSource']) {
      const binding = science.bindings[key];
      await verify(binding.path, binding.sha256);
      if (key.endsWith('Template') || key === 'template') {
        await retain(binding.path, `${evidence}/author-history/d016/${card}/${path.basename(binding.path)}`,
          'reports', { card, role: 'Exact science-bound template' }, binding.sha256);
        templateBindings.push({ card, key, ...binding });
      }
    }
    const freeze = await read(`${ticket}/tmp/9p-${short}-prose-freeze.json`);
    for (const key of ['authorHelper', 'nativeCheckHelper']) {
      const binding = freeze[key];
      if (binding) await retain(binding.path, `${evidence}/author-history/d016/${path.basename(binding.path)}`,
        'reports', { role: 'Exact frozen helper dependency' }, binding.sha256);
    }
    const lessonFolder = `${book}/editions/modern-us-neutral/lessons/${card}`;
    const lesson = await read(`${lessonFolder}/lesson.json`);
    const exercises = await read(`${lessonFolder}/exercises.json`);
    const sourceLesson = await read(science.bindings.source.path);
    const sourceExercises = await read(science.bindings.exercisesSource.path);
    cardCounts.push({ card, sourceProseBlocks: sourceLesson.prose.length,
      sourceTasks: sourceExercises.exercises.length, modernTasks: exercises.exercises.length });
    const surfaces = [
      { surface: 'text', empty: !lesson.prose.some(block => block.kind === 'fig' || block.text?.trim()) },
      { surface: 'exercises', empty: exercises.exercises.length === 0 },
    ];
    if (short === 't8') surfaces.push({ surface: 'choices', empty: false }, { surface: 'answers', empty: false });
    for (const surface of surfaces) {
      for (const viewport of [1440, 390]) surfaceDefinition.push({ card, viewport, ...surface });
    }
  }
  const answerReview = await read(`${ticket}/tmp/9p-t8-answer-review.json`);
  assert.equal(answerReview.status, 'pass');
  await retain(answerReview.bindings.draft.path, `${evidence}/author-history/d016/9p-t8-frozen.answer-draft.json`,
    'reports', { role: 'Exact independently reviewed answer draft' }, answerReview.bindings.draft.sha256);
  await retain(answerReview.bindings.prepared.path, `${evidence}/author-history/d016/9p-t8-frozen.answer-keys.template.json`,
    'reports', { role: 'Exact native prepared answer template before authoring' }, answerReview.bindings.prepared.sha256);
  const answerFreeze = await read(`${ticket}/tmp/9p-t8-answer-author-freeze.json`);
  for (const [name, binding] of Object.entries(answerFreeze.bindings)) {
    if (scratch(binding.path) && name.startsWith('definition_')) {
      await retain(binding.path, `${evidence}/author-history/d016/${name}.lesson.template.json`,
        'reports', { role: 'Exact answer-author definition input; existing SCI approval not repeated' }, binding.sha256);
    }
  }
  const captureFolder = `${ticket}/tmp/9p-ex7-answer-capture`;
  for (const name of ['capture-manifest.json', 'author-freeze.json', 'exercise7.append.json',
    'snippets/exercise7.png', 'native/9p/answers.template.json']) {
    await retain(`${captureFolder}/${name}`, `${evidence}/author-history/d016/9p-ex7-answer-capture/${name}`);
  }
  const capture = await read(`${captureFolder}/capture-manifest.json`);
  for (const key of ['parent_source_image', 'snippet', 'append_payload', 'preserved_author_freeze']) {
    const binding = capture.bindings[key];
    await verify(binding.path, binding.sha256);
  }
  await retain(capture.bindings.parent_source_image.path, `${evidence}/source-pages/9p/answer-page-0337.png`,
    'sourceCrops', { role: 'Exercise7 source parent; other printed columns outside batch scope' },
    capture.bindings.parent_source_image.sha256);
  const sourcePages = [];
  for (let page = 135; page <= 143; page++) {
    const id = String(page).padStart(4, '0');
    const pageFolder = `${book}/pages/${id}`;
    const source = await read(`${pageFolder}/page.json`);
    const audit = await read(`${pageFolder}/audit.json`);
    for (const name of ['page.md', 'page.json', 'audit.json']) {
      await retain(`${pageFolder}/${name}`, `${evidence}/author-history/d016/source-pages/${id}/${name}`);
    }
    for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
      await retain(`.tmp/ld-s10y-lesson/9p/pages/${id}/${name}`, `${evidence}/source-pages/9p/${id}/${name}`,
        'sourceCrops', { page, role: page === 135 ? 'Affected heading context only' : 'Finalized source scan/history' });
    }
    await verify(`.tmp/ld-s10y-lesson/9p/pages/${id}/page.png`, source.meta.render.sha256);
    const sourceFigures = source.blocks.filter(block => block.kind === 'fig').map(block => block.id);
    if (page !== 135) {
      for (const figure of sourceFigures) {
        await retain(`${book}/figures/${figure}.png`, `${evidence}/source-crops/9p/${figure}.png`,
          'sourceCrops', { page, figure, role: 'Original source pixels, not a modern n55 figure' });
      }
    }
    sourcePages.push({ page, printedRowsIncludingFooter: audit.lines_printed, authoredRows: audit.lines_md,
      sourceFigures, errata: source.meta.errata ?? [], audit: await bind(`${pageFolder}/audit.json`) });
  }
  for (const name of ['0135.page.md', 'author-notes.json']) {
    await retain(`${ticket}/tmp/9p-next-source-0132-0135/${name}`,
      `${evidence}/author-history/d016/p135-heading-history/${name}`);
  }
  const initialResultPath = `${ticket}/tmp/offline-batch2/result-${[...cards].sort().join('--')}.json`;
  const initialTilePath = `${ticket}/tmp/offline-batch2/d016-screenshot-tiles.json`;
  await retain(initialResultPath, `${evidence}/offline/d016/${path.basename(initialResultPath)}`);
  await retain(initialTilePath, `${evidence}/offline/d016/${path.basename(initialTilePath)}`);
  const initialResult = await read(initialResultPath);
  for (const surface of initialResult.results.filter(item => item.surface === 'answers')) {
    await retain(surface.screenshot, `${evidence}/offline/d016/initial-answer-display/${path.basename(surface.screenshot)}`,
      'surfaces', { role: 'Initialfailedanswerdisplay preserved, not final approval' }, surface.screenshotSha256);
  }
  for (const tile of (await read(initialTilePath)).tiles.filter(item => item.surface === 'answers')) {
    await retain(tile.path, `${evidence}/offline/d016/initial-answer-display/${path.basename(tile.path)}`,
      'surfaces', { role: 'Initialfailedanswerdisplay original-pixel tile' }, tile.sha256);
  }
  const resultPath = `${ticket}/tmp/d016-effective-offline-result.json`;
  const tilePath = `${ticket}/tmp/d016-effective-screenshot-tiles.json`;
  const result = await read(resultPath);
  const pixels = await read(`${ticket}/tmp/d016-screenshot-review.json`);
  const manifest = await read(tilePath);
  assert.equal(result.status, 'pass');
  assert.equal(pixels.status, 'pass');
  await verify(resultPath, pixels.batchResult.sha256);
  assert.equal(absolute(resultPath), absolute(pixels.batchResult.path));
  const surfaceKey = item => `${item.card ?? item.id}:${item.surface}:${item.viewport?.width ?? item.viewport}`;
  const exactSet = (actual, expected, message) => {
    assert.equal(new Set(actual).size, actual.length, `Duplicate ${message}`);
    assert.deepEqual([...actual].sort(), [...expected].sort(), message);
  };
  exactSet(result.results.map(surfaceKey), surfaceDefinition.map(surfaceKey), 'batch coverage');
  exactSet(pixels.surfaces.map(surfaceKey), surfaceDefinition.filter(item => !item.empty).map(surfaceKey), 'nonempty review coverage');
  exactSet(pixels.emptySourceDefinedSurfaces.map(surfaceKey), surfaceDefinition.filter(item => item.empty).map(surfaceKey), 'empty coverage');
  exactSet(manifest.emptySourceDefinedSurfaces.map(surfaceKey), pixels.emptySourceDefinedSurfaces.map(surfaceKey), 'manifest empty coverage');
  const tileKey = tile => `${relative(tile.path)}:${tile.sha256}`;
  exactSet(pixels.tiles.map(tileKey), manifest.tiles.map(tileKey), 'actually opened tile coverage');
  exactSet([...new Set(pixels.tiles.map(surfaceKey))],
    surfaceDefinition.filter(item => !item.empty).map(surfaceKey), 'tile surface coverage');
  await retain(resultPath, `${evidence}/offline/d016/${path.basename(resultPath)}`);
  await retain(tilePath, `${evidence}/offline/d016/${path.basename(tilePath)}`);
  for (const surface of result.results) {
    const definition = surfaceDefinition.find(item => surfaceKey(item) === surfaceKey(surface));
    await verify(surface.screenshot, surface.screenshotSha256);
    const inspected = pixels.surfaces.find(item => surfaceKey(item) === surfaceKey(surface));
    if (inspected) assert.equal(inspected.status, 'pass');
    await retain(surface.screenshot, `${evidence}/offline/d016/${path.basename(surface.screenshot)}`, 'surfaces',
      { card: surface.id, surface: surface.surface, viewport: surface.viewport.width,
        inspectedViaOpenedTiles: !definition.empty, inspectedBy: inspected?.reviewer ?? null,
        emptySourceDefined: definition.empty });
  }
  for (const tile of pixels.tiles) {
    assert.equal(tile.actuallyOpened, true, `Tile not opened: ${tile.path}`);
    assert.ok(tile.reviewer, `Missing tile reviewer: ${tile.path}`);
    const originalTile = manifest.tiles.find(item => tileKey(item) === tileKey(tile));
    for (const key of ['card', 'surface', 'viewport', 'crop']) assert.deepEqual(tile[key], originalTile[key]);
    assert.equal(absolute(tile.source), absolute(originalTile.source));
    const parent = result.results.find(item => absolute(item.screenshot) === absolute(tile.source));
    assert.ok(parent && surfaceKey(parent) === surfaceKey(tile));
    const [width, height] = pngDimensions(await bytes(tile.source));
    const [left, top, right, bottom] = tile.crop;
    assert.ok(tile.crop.length === 4 && tile.crop.every(Number.isInteger));
    assert.ok(left >= 0 && top >= 0 && right > left && bottom > top && right <= width && bottom <= height);
    await verify(tile.path, tile.sha256);
    assert.deepEqual(pngDimensions(await bytes(tile.path)), [right - left, bottom - top]);
    await retain(tile.path, `${evidence}/offline/d016/${path.basename(tile.path)}`, 'surfaces',
      { card: tile.card, surface: tile.surface, viewport: tile.viewport, actuallyOpened: true,
        inspectedBy: tile.reviewer, cropOf: tile.source, parentSha256: parent.screenshotSha256, crop: tile.crop });
  }
  // Resolve inherited77 solely through the existing index; all new active evidence must be planned.
  const projectedIndex = structuredClone(index);
  for (const [destination, item] of plan) {
    projectedIndex[item.collection].push({ path: destination, sha256: item.sha256, originalPath: item.source });
  }
  for (const figure of ['fig-77', 'fig-99', 'fig-100']) {
    const report = await read(`${durableFigures}/${figure}.independent-review.json`);
    assert.equal(report.status, 'pass');
    const active = [];
    activePaths(report, (owner, key, sha256) => active.push({ file: owner[key], sha256 }));
    for (const reference of active) {
      const sha256 = reference.sha256 ?? hash(await bytes(reference.file));
      if (scratch(reference.file)) {
        const retained = lookup(projectedIndex, reference.file, sha256);
        assert.ok(retained, `Unretained active ${figure} evidence: ${reference.file}`);
        if (!plan.has(retained)) await verify(retained, sha256);
      } else {
        const planned = plan.get(relative(reference.file));
        if (planned) assert.equal(planned.sha256, sha256, `Planned gate binding changed:${reference.file}`);
        else await verify(reference.file, sha256);
      }
    }
    const gate = report.originalReport;
    const plannedGate = plan.get(relative(gate.path));
    if (plannedGate) assert.equal(plannedGate.sha256, gate.sha256);
    else await verify(gate.path, gate.sha256);
  }
  const summary = {
    ticket: 'STEMROBIN-181', batch: 'D-016', scope: cards, templateBindings, cardCounts, sourcePages,
    derivedCounts: {
      sourcePages: sourcePages.filter(item => item.page !== 135).length,
      affectedHeadingPages: sourcePages.filter(item => item.page === 135).length,
      printedRowsIncludingFooter: sourcePages.filter(item => item.page !== 135)
        .reduce((sum, item) => sum + item.printedRowsIncludingFooter, 0),
      sourceFigures: sourcePages.filter(item => item.page !== 135).flatMap(item => item.sourceFigures).length,
      capturedExercise7Answers: (await read(`${captureFolder}/exercise7.append.json`)).answers.length,
      surfaces: result.results.length, nonemptySurfaces: pixels.surfaces.length,
      sourceDefinedEmptySurfaces: pixels.emptySourceDefinedSurfaces.length, actuallyOpenedTiles: pixels.tiles.length,
      plannedFiles: plan.size, reusedBindings: reused.length,
    },
    reused, result: await bind(resultPath), pixels: await bind(`${ticket}/tmp/d016-screenshot-review.json`),
    noNewGateRenderBrowserOrMeterWrite: true,
    historicalReportsPreservedVerbatim: true,
    excludes: ['n55 modern figures', 'source144+', 'exercise8 candidate and338 diagnostic pixels'],
  };
  const manifestPath = `${evidence}/reports/d016-retention-manifest.json`;
  const manifestBytes = Buffer.from(`${JSON.stringify(summary, null, 2)}\n`);
  if (await exists(manifestPath)) assert.deepEqual(await bytes(manifestPath), manifestBytes);
  return { originalIndex, index, plan, summary, manifestPath, manifestBytes };
}

async function main() {
  assert.deepEqual(process.argv.slice(2), ['--execute'], 'Prepared only. Main must authorize execution; then pass --execute.');
  const state = await prepare();
  assert.deepEqual(await bytes(indexPath), state.originalIndex, 'Shared index changed during preflight');
  for (const [destination, item] of state.plan) {
    await verify(item.source, item.sha256);
    await immutableWrite(destination, item.data);
    state.index[item.collection].push({
      path: destination, sha256: item.sha256, originalPath: item.source, batch: 'D-016', ...item.metadata,
    });
  }
  await immutableWrite(state.manifestPath, state.manifestBytes);
  if (!state.index.reports.some(record => record.path === state.manifestPath)) {
    state.index.reports.push({ path: state.manifestPath, sha256: hash(state.manifestBytes), batch: 'D-016' });
  }
  assert.deepEqual(await bytes(indexPath), state.originalIndex, 'Shared index changed before update');
  state.index.updatedAt = new Date().toISOString();
  await fs.writeFile(absolute(indexPath), `${JSON.stringify(state.index, null, 2)}\n`);
  console.log(JSON.stringify(state.summary.derivedCounts, null, 2));
  console.log('D016 evidence retained. Rebind is a separate explicitly authorized operation.');
}

if (process.argv[1] && absolute(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
