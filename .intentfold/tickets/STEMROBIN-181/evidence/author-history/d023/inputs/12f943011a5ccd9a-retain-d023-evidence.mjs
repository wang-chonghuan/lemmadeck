import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, book, durableFigures, read, bytes, bind, hash,
  verify, relative, absolute, scratch, exists, lookup, activePaths, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.equal(process.argv[2], '--execute');
const tmp = `${ticket}/tmp`;
const manifestPath = `${evidence}/reports/d023-retention-manifest.json`;
assert.ok(!await exists(manifestPath), 'Retention already consumed.');
const indexBefore = await bytes(indexPath);
const index = JSON.parse(indexBefore);
const retained = [];
const aliases = new Map();
const snapshots = new Map();
const key = (file, sha) => `${relative(file)}:${sha}`;
for (const n of [90, 91, 92]) {
  if (!await exists(`${tmp}/9p-n${n}-prose-correction-freeze.json`)) continue;
  const correction = await read(`${tmp}/9p-n${n}-prose-correction-freeze.json`);
  aliases.set(key(correction.bindings.lessonTemplate.path, correction.before.lesson.sha256),
    correction.before.lesson.path);
}
for (const n of [90, 91, 92]) {
  const trace = await read(`${tmp}/d023-n${n}-native-finalization.json`);
  assert.equal(trace.status, 'pass');
  for (const row of trace.consumedBindings) {
    aliases.set(key(row.originalPath, row.sha256), row.path);
  }
}
async function retain(file, expected, target) {
  file = relative(file);
  assert.ok(!file.startsWith('../'), `External evidence: ${file}`);
  let source = aliases.get(key(file, expected)) ?? file;
  const prior = expected && lookup(index, file, expected);
  if (prior) {
    await verify(prior, expected);
    return prior;
  }
  let data = await bytes(source);
  if (expected && hash(data) !== expected) {
    for (const candidate of snapshots.get(expected) ?? []) {
      if (!await exists(candidate)) continue;
      const frozen = await bytes(candidate);
      if (hash(frozen) !== expected) continue;
      source = candidate;
      data = frozen;
      aliases.set(key(file, expected), source);
      break;
    }
  }
  const sha256 = hash(data);
  if (expected) assert.equal(sha256, expected, `Frozen drift: ${file}`);
  if (!scratch(file) && relative(source) === file) {
    if (file.startsWith(`${evidence}/`) && !lookup(index, file, sha256)) {
      index.reports.push({ path: file, sha256, batch: 'D-023', role: 'Existing repair receipt' });
    }
    return file;
  }
  target ??= `${evidence}/author-history/d023/inputs/${sha256.slice(0, 16)}-${path.basename(file)}`;
  const known = retained.find(row => row.originalPath === file && row.sha256 === sha256);
  if (known) return known.path;
  await immutableWrite(target, data);
  const collection = /\.png$/.test(file) ? 'figurePixels' : 'reports';
  const record = { path: target, originalPath: file, sha256, batch: 'D-023' };
  if (!index[collection].some(row => row.path === target && row.sha256 === sha256)) {
    assert.ok(!index[collection].some(row => row.path === target), `Index collision: ${target}`);
    index[collection].push(record);
  }
  retained.push(record);
  return target;
}
async function retainBoundInputs(value) {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    for (const item of value) await retainBoundInputs(item);
    return;
  }
  const expected = value.sha256 ?? value.actual_sha256;
  if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(expected ?? '') &&
      !relative(value.path).startsWith('../')) {
    await retain(value.path, expected);
  }
  for (const item of Object.values(value)) {
    if (item && typeof item === 'object') await retainBoundInputs(item);
  }
}
function collectSnapshots(value) {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach(collectSnapshots);
    return;
  }
  const expected = value.sha256 ?? value.actual_sha256;
  if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(expected ?? '') &&
      !relative(value.path).startsWith('../')) {
    if (!snapshots.has(expected)) snapshots.set(expected, new Set());
    snapshots.get(expected).add(relative(value.path));
  }
  Object.values(value).filter(item => item && typeof item === 'object').forEach(collectSnapshots);
}
const reports = [
  'd023-source219-223-finalization.json', 'd023-modern-preparation.json',
  'd023-source220-223-source-review.json',
  'd023-source-correction/correction.json',
  'd023-source-correction/independent-affected-review.json',
  ...[90, 91, 92].flatMap(n => [
    `9p-n${n}-prose-freeze.json`, `9p-n${n}-science-review.json`,
  ]),
  ...[90, 91, 92].flatMap(n => [
    `9p-n${n}-figure-review.json`, `d023-n${n}-native-finalization.json`,
  ]),
  'd023-native-offline-render.json', 'd023-offline-tiles.json', 'd023-screenshot-review.json',
  ...process.argv.slice(3),
];
for (const n of [90, 91, 92]) {
  for (const suffix of ['prose-correction-freeze.json', 'science-effective-review.json']) {
    const name = `9p-n${n}-${suffix}`;
    if (await exists(`${tmp}/${name}`)) reports.push(name);
  }
}
for (const name of reports) collectSnapshots(await read(`${tmp}/${name}`));
const roots = [];
for (const name of reports) {
  const file = `${tmp}/${name}`;
  const target = `${evidence}/reports/${name}`;
  const retainedPath = await retain(file, null, target);
  roots.push({ name, original: await bind(file), retained: await bind(retainedPath) });
  const raw = await read(file);
  await retainBoundInputs(raw);
}
const tiles = await read(`${tmp}/d023-offline-tiles.json`);
const offline = await read(tiles.result.path);
for (const surface of offline.results) {
  await retain(surface.screenshot, surface.screenshotSha256);
  await retain(surface.sourceHtml.path, surface.sourceHtml.sha256);
  if (surface.metrics.scrollEndScreenshot) {
    await retain(surface.metrics.scrollEndScreenshot, surface.metrics.scrollEndScreenshotSha256);
  }
}
for (const tile of tiles.tiles) await retain(tile.path, tile.sha256);
for (const helper of [
  'retain-d023-evidence.mjs', 'finalize-d023-card.mjs', 'combine-d023-figure-reviews.mjs',
  'render-d023-batch.mjs', 'offline-d023-check.mjs',
  'crop-d023-pixels.py', 'combine-d023-screenshot-reviews.mjs', 'complete-d023.mjs', 'stage-d023.mjs',
]) {
  await retain(`${tmp}/${helper}`);
}
const rebound = [];
const provenanceOnly = [];
for (const id of ['fig-170', 'fig-171', 'fig-172', 'tbl-p0219-01']) {
  const file = `${durableFigures}/${id}.independent-review.json`;
  const beforeBytes = await bytes(file);
  const original = JSON.parse(beforeBytes);
  assert.equal(original.status, 'pass');
  const current = structuredClone(original);
  const references = [];
  activePaths(current, (owner, field, sha256, trail) => {
    references.push({ owner, field, sha256, trail });
  });
  const replacements = [];
  for (const ref of references) {
    const source = ref.owner[ref.field];
    if (ref.field === 'workspace' && absolute(source) === absolute('.')) {
      provenanceOnly.push({ id, field: ref.trail, value: source,
        reason: 'Reviewer checkout identity, not a file or native/product dependency.' });
      continue;
    }
    const expected = ref.sha256 ?? hash(await bytes(source));
    const destination = await retain(source, expected);
    if (relative(destination) !== relative(source)) {
      ref.owner[ref.field] = destination;
      replacements.push({ trail: ref.trail, original: source, path: destination, sha256: expected });
    } else await verify(source, expected);
  }
  const reversed = structuredClone(current);
  for (const change of replacements) {
    let owner = reversed;
    for (const field of change.trail.slice(0, -1)) owner = owner[field];
    owner[change.trail.at(-1)] = change.original;
  }
  assert.deepEqual(reversed, original, 'Only metadata paths may change.');
  const backup = `${evidence}/author-history/d023/${id}-before-durable-paths.json`;
  await immutableWrite(backup, beforeBytes);
  index.reports.push({ path: backup, sha256: hash(beforeBytes), originalPath: file, batch: 'D-023' });
  if (replacements.length) await fs.writeFile(absolute(file), `${JSON.stringify(current, null, 2)}\n`);
  rebound.push({ id, before: { path: backup, sha256: hash(beforeBytes) },
    current: await bind(file), replacements });
}
const manifest = {
  ticket: 'STEMROBIN-181', batch: 'D023', status: 'exact-evidence-retained-path-only-rebinding',
  cards: [90, 91, 92].map(n => `phy9-c2-s3-n${n}`),
  roots, retained, rebound, provenanceOnly,
  evidenceIndexBefore: { path: indexPath, sha256: hash(indexBefore) },
  sourcePages: [219, 220, 221, 222, 223],
  excluded: 'n86 fig166 exhausted independent failure; n93 outgoing source remains open. Source224 onward is next-batch work. Older failures unchanged.',
  limits: 'Raw owning reports retained verbatim; their original paths remain provenance. Direct hash-bound inputs and current product metadata paths retained, without recursive runtime capture. No new source/science/pixel/native/browser gate; all spec/media/render/review@1 bytes unchanged.',
};
await immutableWrite(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
index.reports.push({ ...await bind(manifestPath), batch: 'D-023' });
assert.deepEqual(await bytes(indexPath), indexBefore, 'Concurrent evidence index change.');
index.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
console.log(JSON.stringify({ retained: retained.length, reboundPaths: rebound.reduce((n, row) => n + row.replacements.length, 0),
  manifest: await bind(manifestPath) }));
