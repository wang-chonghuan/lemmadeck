import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../..');
export const work = '.intentfold/tickets/STEMROBIN-181/tmp';
export const out = `${work}/d021-caption-affected`;
export const modern = 'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral';
export const cards = [82, 83, 84].map(n => `phy9-c2-s2-n${n}`);
export const affected = cards[0];
export const rendererPath = '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js';
export const pinned = {
  result: {
    path: `${work}/offline-d021/result-${cards.join('--')}.json`,
    sha256: 'f25fe18e98226f457bf08921c0508e321dd548f53498fe4148343998425da1e1',
  },
  tiles: {
    path: `${work}/d021-offline-tiles.json`,
    sha256: '271ce3f5aaba0d1face46733d7859f74bd522f2085d286451932bba4d3642435',
  },
  native: {
    path: `${work}/d021-native-offline-render.json`,
    sha256: '61c770cac6afeda04b37a13e2aaeafdb4fd18503b7efb102d382bf7d694f7aef',
  },
  oldCheck: {
    path: `${work}/offline-d021-check.mjs`,
    sha256: '8ddae9363b84ba946b5a6e6135f0ecb209a087002f5ffbde148e703d7b2c4585',
  },
  oldCrop: {
    path: `${work}/crop-d021-pixels.py`,
    sha256: 'df86e80dcaf571b072a83bc2f00ee8b3b92384386358db244f9fabae615b560a',
  },
  oldRenderer: {
    path: rendererPath,
    sha256: '808e26583b135d966a1c3e2569eaa40b77e78f4fa1efb6036ec9f8a0f100937a',
  },
  layoutFix: {
    path: `${out}/native-layout-fix.json`,
    sha256: '3ee59d086fda96fc2b0ef4b4ebc0f281aa88458748e07de125fc170bcc7ff25c',
  },
  layoutHelper: {
    path: `${work}/fix-d021-caption-display.mjs`,
    sha256: '0e39937c553c1f3a6f9036fd94811399fe464e13ee358d5b003650fc300c1b92',
  },
  reviews: [
    {
      path: `${work}/d021-n82-screenshot-review.json`,
      sha256: '20e20df06174119e090c4ee88032ca077151860e6ef1d219e31b0c7c263ee2c8',
    },
    {
      path: `${work}/d021-n83-screenshot-review.json`,
      sha256: '2707186512637fc06c92a943fcf449c13251a23bcbca9ed9259e682e2ea2bd39',
    },
    {
      path: `${work}/d021-n84-screenshot-review.json`,
      sha256: '4180092fe87813af7051a189b0e54ddd694cfebd24a9fa2ff872ac37216d9abd',
    },
  ],
};

export const absolute = value => path.resolve(root, value);
export function relative(value) {
  assert.equal(typeof value, 'string');
  const name = path.relative(root, absolute(value));
  assert.ok(name && name !== '..' && !name.startsWith('../'), `Outside workspace: ${value}`);
  assert.ok(!/(^|\/)\.env(?:$|\.)/.test(name), 'No secret file bindings');
  return name;
}
export const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export const read = async file => JSON.parse(await fs.readFile(absolute(file), 'utf8'));
export const bind = async file => ({
  path: relative(file), sha256: hash(await fs.readFile(absolute(file))),
});
export function binding(value) {
  assert.ok(value && typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256),
    'An exact existing path/SHA binding is required');
  return { path: relative(value.path), sha256: value.sha256 };
}
export const identity = value => `${relative(value.path)}:${value.sha256}`;
export const surfaceKey = item =>
  `${item.card ?? item.id}:${item.surface}:${item.viewport?.width ?? item.viewport}`;
export const tileKey = identity;
export function exactSet(actual, expected, message) {
  assert.equal(new Set(actual).size, actual.length, `Duplicates: ${message}`);
  assert.equal(new Set(expected).size, expected.length, `Duplicate expectations: ${message}`);
  assert.deepEqual([...actual].sort(), [...expected].sort(), message);
}
export const expectedSurfaces = cards.flatMap(card =>
  ['text', 'exercises'].flatMap(surface => [1440, 390].map(viewport =>
    surfaceKey({ card, surface, viewport }))));
export async function verify(value) {
  const expected = binding(value);
  assert.deepEqual(await bind(expected.path), expected, `Bytes changed: ${expected.path}`);
  return expected;
}
export async function load(value) {
  await verify(value);
  return read(value.path);
}
export async function absent(file) {
  assert.equal(await fs.access(absolute(file)).then(() => true, () => false), false,
    `Never overwrite existing evidence: ${file}`);
}
export async function immutableWrite(file, value) {
  const name = relative(file);
  assert.ok(name.startsWith(`${out}/`), 'Writes are restricted to caption-affected scratch');
  await fs.mkdir(path.dirname(absolute(name)), { recursive: true });
  await fs.writeFile(absolute(name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
}
export async function helperBindings() {
  return Promise.all(['common.mjs', 'check-affected.mjs', 'crop-affected.py', 'combine-screen.mjs']
    .map(name => bind(`${out}/${name}`)));
}

export async function oldHistory() {
  const result = await load(pinned.result);
  const tiles = await load(pinned.tiles);
  const native = await load(pinned.native);
  await verify(pinned.oldCheck);
  await verify(pinned.oldCrop);
  assert.equal(result.status, 'pass', 'Old result is machine evidence, not SCREEN approval');
  exactSet(result.results.map(surfaceKey), expectedSurfaces, 'Old actual 12 surfaces');
  assert.deepEqual(binding(tiles.result), pinned.result);
  assert.equal(tiles.tiles.length, 20);
  assert.equal(tiles.emptySourceDefinedSurfaces.length, 4);
  assert.deepEqual(tiles.exactPixelReuse, [], 'Unexpected old pixel aliases');
  const reviews = [];
  const observed = new Map();
  for (const [index, reference] of pinned.reviews.entries()) {
    const report = await load(reference);
    assert.equal(report.status, index === 0 ? 'fail' : 'pass');
    assert.equal(report.freshContext, true);
    assert.ok(report.reviewer);
    assert.deepEqual(binding(report.batchResult), pinned.result);
    assert.equal(report.imagesLoaded, report.tiles.length);
    assert.ok(report.imagesLoaded <= 8);
    const assigned = tiles.tiles.filter(tile => tile.card === cards[index]);
    exactSet(report.tiles.map(tileKey), assigned.map(tileKey), 'Old exact reviewer assignment');
    for (const tile of report.tiles) {
      const original = assigned.find(item => tileKey(item) === tileKey(tile));
      assertTile(tile, original);
      assert.ok(['pass', 'fail'].includes(tile.status));
      assertActualObservation(tile);
      assert.ok(!observed.has(tileKey(tile)), 'Old tile inspected repeatedly');
      observed.set(tileKey(tile), { tile, report: reference, reviewer: report.reviewer });
    }
    reviews.push(report);
  }
  assert.equal(reviews[0].tiles.filter(tile => tile.status === 'fail').length, 2);
  assert.equal(reviews[0].tiles.filter(tile => tile.status === 'pass').length, 5);
  for (const row of result.results) {
    await verify({ path: row.screenshot, sha256: row.screenshotSha256 });
    if (row.metrics.scrollEndScreenshot) await verify({
      path: row.metrics.scrollEndScreenshot, sha256: row.metrics.scrollEndScreenshotSha256,
    });
    assert.ok(native.html.some(item => identity(item) === identity(row.sourceHtml)),
      'Old native receipt must bind every old surface HTML');
  }
  for (const tile of tiles.tiles) {
    await verify(tile);
    await verify({ path: tile.source, sha256: tile.sourceSha256 });
    const row = result.results.find(item => surfaceKey(item) === surfaceKey(tile));
    assert.ok(row && (
      (relative(tile.source) === relative(row.screenshot) && tile.sourceSha256 === row.screenshotSha256) ||
      (row.metrics.scrollEndScreenshot && relative(tile.source) === relative(row.metrics.scrollEndScreenshot) &&
        tile.sourceSha256 === row.metrics.scrollEndScreenshotSha256)));
  }
  return { result, tiles, native, reviews, observed };
}

export function assertTile(tile, original) {
  assert.ok(original, `Unknown tile: ${tile.path}`);
  for (const key of ['card', 'surface', 'viewport', 'scrollPosition', 'crop', 'sourceSha256']) {
    assert.deepEqual(tile[key], original[key], `Tile ${key}: ${tile.path}`);
  }
  assert.equal(relative(tile.source), relative(original.source), 'Tile screenshot association changed');
}
export function assertActualObservation(tile) {
  assert.equal(tile.actuallyOpened, true);
  assert.equal(tile.openCount, 1);
  assert.ok(typeof tile.observations === 'string' && tile.observations.trim());
}

export async function readiness(file, history, mainReady) {
  assert.equal(mainReady, true, 'Main explicit readiness is mandatory');
  assert.deepEqual(await bind(file), pinned.layoutFix, 'Only the supplied completed native layout fix');
  const native = await load(pinned.layoutFix);
  await verify(pinned.layoutHelper);
  assert.equal(native.status, 'pass-caption-layout-only-render');
  assert.equal(native.nativeAffectedRenderCalls, 1);
  assert.equal(native.repeatedSourceScienceFigureOrFinalizationGates, 0);
  const renderer = native.toolFixOutputs.find(item => relative(item.path) === rendererPath);
  assert.ok(renderer, 'Actual renderer output binding is required');
  for (const item of native.toolFixOutputs) await verify(item);
  assert.notEqual(renderer.sha256, pinned.oldRenderer.sha256, 'Renderer fix not present');
  assert.deepEqual(native.command, [
    '-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render',
    '--book', '9p', '--edition', 'modern-us-neutral', '--lesson', affected,
  ]);
  const output = JSON.parse(native.nativeOutput);
  assert.equal(output.ok, true);
  assert.deepEqual(output.lessons.map(item => item.lesson), [affected]);
  const archive = await load(native.before);
  const aliases = archive.aliases.filter(item => item.original.path.endsWith('.html')).map(item => ({
    originalPath: item.original.path, ...binding(item.snapshot), proof: binding(native.before),
  }));
  const rendererAlias = archive.aliases.find(item =>
    identity(item.original) === identity(pinned.oldRenderer));
  assert.ok(rendererAlias, 'Old renderer archive is required');
  await verify(rendererAlias.snapshot);
  const oldText = history.result.results.find(item =>
    item.id === affected && item.surface === 'text').sourceHtml;
  exactSet(aliases.map(item => `${relative(item.originalPath)}:${item.sha256}`),
    history.native.html.filter(item => item.path.includes(`/${affected}/`)).map(identity),
    'Exact old82 text/exercises HTML archive aliases');
  for (const alias of aliases) {
    assert.notEqual(relative(alias.path), relative(alias.originalPath), 'Archive cannot be overwritten HTML');
    assert.ok(relative(alias.path).startsWith(`${work}/`), 'Old HTML archive belongs to ticket scratch');
    await verify(alias);
  }
  const newHtml = native.html.map(binding);
  exactSet(newHtml.map(item => item.path),
    ['text', 'exercises'].map(surface =>
      `.tmp/ld-s10y-lesson/render/9p/modern-us-neutral/${affected}/${surface}.html`),
    'Exactly two native82 HTML outputs');
  for (const item of newHtml) await verify(item);
  const newText = newHtml.find(item => item.path.endsWith('/text.html'));
  assert.notEqual(newText.sha256, oldText.sha256, '82 text HTML must change');
  for (const row of history.result.results.filter(item => !(item.id === affected && item.surface === 'text'))) {
    await verify(row.sourceHtml);
  }
  for (const item of native.protectedFiles) await verify(item);
  const request = {
    mainReady: true, nativeRenderCount: 1, nativeRender: pinned.layoutFix,
    nativeHelper: pinned.layoutHelper, renderer: binding(renderer), oldHtmlAliases: aliases,
    oldRendererAlias: { originalPath: rendererPath, ...binding(rendererAlias.snapshot),
      proof: binding(native.before) },
  };
  return { request, native, newText, requestBinding: await bind(file) };
}

// Existing gates supply hashes only. No science, source, or figure gate is invoked here.
export async function unchangedContent(history) {
  const verified = new Map();
  const traces = [];
  const verifyOnce = async item => {
    const reference = binding(item);
    if (!verified.has(identity(reference))) {
      await verify(reference);
      verified.set(identity(reference), reference);
    }
  };
  for (const nativeReference of history.native.nativeTraces) {
    await verifyOnce(nativeReference);
    const native = await read(nativeReference.path);
    assert.equal(native.status, 'pass');
    assert.ok(cards.includes(native.card));
    for (const item of native.outputs) await verifyOnce(item);
    for (const item of native.consumedBindings) {
      if (/\/(?:lesson|exercises)\.(?:json|md)$|\/(?:lesson|exercises)\.template\.json$/.test(item.path)) {
        await verifyOnce(item);
      }
    }
    await verifyOnce(native.science);
    await verifyOnce(native.figureGate);
    const gate = await read(native.figureGate.path);
    const figures = await read(`${modern}/lessons/${native.card}/figures.json`);
    exactSet(figures.figures.map(item => item.id), gate.figures.map(item => item.id), 'Same gated figures');
    for (const figure of figures.figures) {
      const supplied = gate.figures.find(item => item.id === figure.id).bindings;
      for (const kind of ['spec', 'svg']) {
        await verifyOnce({ path: `${modern}/${figure[kind]}`, sha256: supplied[kind].sha256 });
      }
      if (supplied.source) await verifyOnce(supplied.source);
      for (const kind of ['context', 'lesson']) {
        if (supplied[kind]) await verifyOnce(supplied[kind]);
      }
    }
    traces.push(binding(nativeReference));
  }
  exactSet((await Promise.all(traces.map(item => read(item.path)))).map(item => item.card),
    cards, 'Same three native content receipts');
  return { nativeTraces: traces, unchangedBindings: [...verified.values()] };
}

export async function verifyEffective(result) {
  assert.equal(result.status, 'pass');
  assert.equal(result.newSurfaceCount, 2);
  assert.equal(result.reusedSurfaceCount, 10);
  exactSet(result.results.map(surfaceKey), expectedSurfaces, 'Effective original 12-surface coverage');
  await verify(result.rawResult);
  await verify(result.rawHistory.result);
  await verify(result.rawHistory.tiles);
  for (const item of result.rawHistory.initialReviews) await verify(item);
  await verify(result.mainReadiness);
  await verify(result.nativeRender);
  await verify(result.nativeHelper);
  await verify(result.renderer);
  for (const item of result.helpers) await verify(item);
  for (const item of result.unchangedBindings) await verify(item);
  for (const alias of result.oldHtmlAliases) await verify(alias);
  await verify(result.oldRendererAlias);
  const old = await load(pinned.result);
  for (const row of result.results) {
    await verify(row.sourceHtml);
    await verify({ path: row.screenshot, sha256: row.screenshotSha256 });
    if (row.metrics.scrollEndScreenshot) await verify({
      path: row.metrics.scrollEndScreenshot, sha256: row.metrics.scrollEndScreenshotSha256,
    });
    if (!(row.id === affected && row.surface === 'text')) {
      assert.deepEqual(row, old.results.find(item => surfaceKey(item) === surfaceKey(row)),
        'Reused rows must be exact old machine rows, not new assertions');
    }
  }
}
