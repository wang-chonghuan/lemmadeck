import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  tmp, evidence, indexPath, collections, bytes, read, bind, hash, verify, relative, absolute,
  scratch, exists, lookup, immutableWrite, walk, jsonBytes, safeFile, local, boundObjects,
  shaOf, resolver, ownedTmp, helperName, ownedDocument, seedHistory, reconstructHistory,
  targetPreparation, displayPreparation, bookRoot, modernRoot, targets, finalCards, finalFigures,
  sourcePages, sourceFigureIds, sourceSpecs, preparationReceipt, manifestPath, originalRender,
  renderPath, continuation, final98History, n94Blocker, n95Blocker, n98Blocker, n98FigureFreeze,
  n98Science, counts, excluded, exactSet, affectedText, affectedHelper, opaqueHistory,
} from './d024-contract-mixed7.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute'], 'PREPARE ONLY; main authorizes retention later.');
assert.ok(!await exists(manifestPath), 'Retention already consumed.');
const indexBefore = await bytes(indexPath);
const originalIndex = JSON.parse(indexBefore);
const index = structuredClone(originalIndex);
for (const name of collections) assert.ok(Array.isArray(index[name]));
const state = resolver(index);
const plan = new Map();
const historyFiles = new Map();
const retained = [];
const reused = [];
const roots = [];
const provenanceOnly = [];
async function historyWalk(folder) {
  const files = [];
  for (const entry of await fs.readdir(absolute(folder), { withFileTypes: true })) {
    const file = `${folder}/${entry.name}`;
    if (entry.isSymbolicLink()) {
      const target = safeFile(await fs.realpath(absolute(file)));
      const sourceFigure = sourceFigureIds.some(id =>
        target === `${bookRoot('9p')}/figures/${id}.png`);
      assert.ok(ownedDocument(target) || sourceFigure, `Unowned historical symlink target: ${file}`);
      const stat = await fs.stat(absolute(target));
      provenanceOnly.push({ path: file, target,
        reason: 'Existing local author-context link; retained as target bytes, never as a new symlink.' });
      if (stat.isFile()) files.push(file);
      else assert.ok(stat.isDirectory(), `Unsupported historical link: ${file}`);
    } else if (entry.isDirectory()) files.push(...await historyWalk(file));
    else if (entry.isFile()) files.push(file);
  }
  return files;
}
function register(row, collection = 'reports') {
  assert.ok(!index[collection].some(item => item.path === row.path && item.sha256 !== row.sha256));
  if (!index[collection].some(item => item.path === row.path && item.sha256 === row.sha256 &&
    item.originalPath === row.originalPath)) index[collection].push(row);
}
async function retain(file, expected, destination, metadata = {}) {
  file = safeFile(file);
  assert.ok(scratch(file) || !file.includes('/phy9-c2-s2-n65/') && !file.includes('/phy10-c1-s2-n5/'),
    `Unowned evidence input: ${file}`);
  assert.match(expected, /^[a-f0-9]{64}$/, `Retention needs an exact SHA: ${file}`);
  const prior = lookup(index, file, expected);
  if (prior && (!destination || prior !== file)) {
    const data = plan.get(prior)?.data ?? (await state.resolve(prior, expected)).data;
    assert.equal(hash(data), expected);
    if (!lookup(originalIndex, file, expected) && prior !== file) {
      const row = { path: prior, originalPath: file, sha256: expected, batch: 'D-024', ...metadata };
      register(row, /\.png$/.test(file) ? 'figurePixels' : 'reports');
      retained.push(row);
    }
    reused.push({ originalPath: file, path: prior, sha256: expected, ...metadata });
    return prior;
  }
  const resolved = await state.resolve(file, expected);
  const { source, data, sha256 } = resolved;
  if (!scratch(file) && source === file && !destination) return file;
  destination ??= `${evidence}/author-history/d024/inputs/${sha256.slice(0, 16)}-${path.basename(file)}`;
  destination = safeFile(destination);
  assert.ok(destination.startsWith(`${evidence}/`));
  if (plan.has(destination)) assert.deepEqual(plan.get(destination).data, data);
  else {
    if (await exists(destination)) await verify(destination, sha256);
    plan.set(destination, { source, data, sha256 });
  }
  const row = { path: destination, originalPath: file, sha256, batch: 'D-024', ...metadata };
  register(row, /\.png$/.test(file) ? 'figurePixels' : 'reports');
  retained.push(row);
  state.remember(destination, sha256);
  return destination;
}
async function inventory(folder, select) {
  if (!await exists(folder)) return;
  for (const entry of await fs.readdir(absolute(folder), { withFileTypes: true })) {
    if (!select(entry.name)) continue;
    const file = `${folder}/${entry.name}`;
    const files = entry.isDirectory() ? await historyWalk(file) : entry.isFile() ? [file] : [];
    for (const input of files) {
      const data = await bytes(input);
      const sha256 = hash(data);
      historyFiles.set(input, sha256);
      state.remember(input, sha256);
      if (/\.json$/.test(input)) state.collect(JSON.parse(data));
    }
  }
}
await inventory(tmp, name => ownedTmp(name) || helperName(name) || name === 'retain-d016-evidence.mjs');
await inventory('.tmp/STEMROBIN-181', name =>
  /^(?:9p-)?d024(?:-|$)/.test(name) ||
  /^9p-(?:n(?:93|94|95|97|98)-|d025-n98-)/.test(name) || /^10p-(?:d024-|n7-)/.test(name));
const { report, locks } = await seedHistory(state);
const required = [
  ...sourceSpecs, final98History, n94Blocker, n95Blocker, n98Blocker,
  n98FigureFreeze, n98Science, continuation, originalRender, affectedText,
  { path: affectedHelper },
  ...[93, 94, 95, 97, 98].flatMap(n => [
    { path: `${tmp}/9p-n${n}-prose-freeze.json` },
    { path: `${tmp}/9p-n${n}-science-review.json` },
  ]),
  ...[93, 94, 97].flatMap(n => [
    { path: `${tmp}/9p-n${n}-figure-review.json` },
    { path: `${tmp}/d024-n${n}-native-finalization.json` },
  ]),
  ...targets.flatMap(row => [row.native, row.science, row.gate, row.preparation, row.freeze])
    .map(name => ({ path: `${tmp}/${name}` })),
  ...['d024-replacement-modern-preparation.json', 'd024-replacement-delivery-helpers-preparation.json',
    'd024-helper-history/reconstruction.json', 'd024-continuation-2-seed.json',
    'd024-continuation-3-seed.json', 'd024-offline-tiles.json', 'd024-screenshot-review.json',
    'crop-d024-mixed-pixels.py'].map(name => ({ path: `${tmp}/${name}` })),
  { path: renderPath }, { path: preparationReceipt },
];
for (const row of required.filter(row => /\.json$/.test(row.path))) await report(row.path);
await reconstructHistory(state, report);
for (const [file, sha256] of historyFiles) if (/\.json$/.test(file)) await state.document(file, sha256);
const expanded = new Set();
while (true) {
  const pending = [...state.documents.entries()].filter(([key]) => !expanded.has(key));
  if (!pending.length) break;
  for (const [key, doc] of pending) {
    expanded.add(key);
    if (opaqueHistory(doc.raw)) continue;
    const dependencies = [];
    boundObjects(doc.raw, (row, sha) => {
      if (local(row.path) && scratch(row.path) && ownedDocument(row.path) && /\.json$/.test(row.path)) {
        dependencies.push({ path: row.path, sha256: sha });
      }
    });
    for (const row of dependencies) await state.document(row.path, row.sha256);
  }
}
const prepared = await targetPreparation(state, report);
const display = await displayPreparation(state, report);
const preparation = (await report(preparationReceipt)).raw;
assert.equal(preparation.status, 'prepared-not-executed');
assert.deepEqual(preparation.cards, finalCards);
for (const row of [...preparation.helpers, ...preparation.historicalHelpersPreservedByteForByte]) {
  await state.resolve(row.path, row.sha256);
}
for (const [file, sha256] of historyFiles) {
  await retain(file, sha256, `${evidence}/author-history/d024/files/${relative(file)}`,
    { role: 'Verbatim owned history; blocked98/partial SOURCE is not approval or delivery.' });
}
for (const row of required) {
  const resolved = await state.resolve(row.path, row.sha256 ?? locks.get(relative(row.path)));
  const destination = await retain(row.path, resolved.sha256,
    `${evidence}/reports/${row.path.slice(`${tmp}/`.length)}`);
  if (!roots.some(item => item.name === row.path.slice(`${tmp}/`.length))) {
    roots.push({ name: row.path.slice(`${tmp}/`.length),
      original: { path: relative(row.path), sha256: resolved.sha256 },
      retained: { path: destination, sha256: resolved.sha256 } });
  }
}
for (const doc of state.documents.values()) {
  await retain(doc.file, doc.sha256);
  if (opaqueHistory(doc.raw)) {
    provenanceOnly.push({ path: doc.file, sha256: doc.sha256,
      reason: 'Historical global evidence-index snapshot retained opaque; no unowned dependency traversal.' });
    continue;
  }
  const bindings = [];
  boundObjects(doc.raw, (row, sha) => bindings.push({ ...row, sha256: sha }));
  for (const row of bindings) {
    if (!local(row.path)) {
      provenanceOnly.push({ path: row.path, sha256: row.sha256, reason: 'External identity in raw history only.' });
      continue;
    }
    if (!scratch(row.path) && (row.path.includes('/phy10-c1-s2-n5/') ||
      row.path.includes('/phy9-c2-s2-n65/'))) {
      provenanceOnly.push({ path: row.path, sha256: row.sha256,
        reason: 'Unowned live file untouched; exact author before-snapshot retained as owned history.' });
      continue;
    }
    await retain(row.path, row.sha256);
    if (row.snapshotPath) await retain(row.snapshotPath, row.snapshotSha256 ?? row.sha256);
    if (typeof row.snapshot === 'string') await retain(row.snapshot, row.sha256);
  }
}
const quarantine = (await report(n94Blocker.path)).raw;
const failedBrowser = await state.document(quarantine.initialBrowser.path, quarantine.initialBrowser.sha256);
assert.equal(failedBrowser.status, 'fail');
for (const row of [...failedBrowser.results, ...display.offline.raw.results]) {
  await retain(row.screenshot, row.screenshotSha256);
  await retain(row.sourceHtml.path, row.sourceHtml.sha256);
  if (row.metrics.scrollEndScreenshot) {
    await retain(row.metrics.scrollEndScreenshot, row.metrics.scrollEndScreenshotSha256);
  }
}

// Media stays byte-identical. Only reference paths in the approved seven figures' JSON may change.
const rebound = [];
const productWrites = [];
const media = [];
for (const figure of finalFigures) {
  const folder = `${modernRoot(figure.book)}/figures`;
  const spec = await read(`${folder}/${figure.id}.spec.json`);
  assert.equal(spec.id, figure.id);
  assert.ok(['deterministic', 'generated'].includes(spec.mode));
  const mediaFile = `${folder}/${figure.id}.${spec.mode === 'generated' ? 'png' : 'svg'}`;
  media.push({ book: figure.book, id: figure.id, ...await bind(mediaFile) });
  const independent = await read(`${folder}/${figure.id}.independent-review.json`);
  assert.equal(independent.status, 'pass');
  for (const suffix of ['spec.json', spec.mode === 'generated' ? 'png.json' : 'render.json',
    'independent-review.json', 'review.json']) {
    const file = `${folder}/${figure.id}.${suffix}`;
    const beforeBytes = await bytes(file);
    const original = JSON.parse(beforeBytes);
    state.collect(original);
    const current = structuredClone(original);
    const replacements = [];
    async function rebind(value, trail = []) {
      if (!value || typeof value !== 'object') return;
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) await rebind(value[i], [...trail, i]);
        return;
      }
      for (const [field, item] of Object.entries(value)) {
        if (['before', 'original', 'originalPath', 'bytesBase64'].includes(field)) continue;
        if (typeof item === 'string' && /^(?:\.tmp\/|\.intentfold\/|ssot-resources\/|\/Users\/)/.test(item)) {
          if (field === 'workspace' && absolute(item) === absolute('.')) {
            provenanceOnly.push({ ...figure, field: [...trail, field], value: item, reason: 'Reviewer identity.' });
            continue;
          }
          const expected = field === 'path' ? shaOf(value) : undefined;
          const resolved = await state.resolve(item, expected);
          const destination = await retain(item, resolved.sha256, undefined, figure);
          if (relative(destination) !== relative(item)) {
            value[field] = destination;
            replacements.push({ trail: [...trail, field], original: item, path: destination,
              sha256: resolved.sha256 });
          }
        } else if (item && typeof item === 'object') await rebind(item, [...trail, field]);
      }
    }
    await rebind(current);
    const reversed = structuredClone(current);
    for (const row of replacements) {
      let owner = reversed;
      for (const field of row.trail.slice(0, -1)) owner = owner[field];
      owner[row.trail.at(-1)] = row.original;
    }
    assert.deepEqual(reversed, original, 'Only metadata reference paths may change');
    const backup = await retain(file, hash(beforeBytes),
      `${evidence}/author-history/d024/${figure.book}/${figure.id}-${suffix}-before-durable-paths.json`, figure);
    const data = replacements.length ? jsonBytes(current) : beforeBytes;
    if (replacements.length) productWrites.push({ file, beforeBytes, data });
    rebound.push({ ...figure, before: { path: backup, sha256: hash(beforeBytes) },
      current: { path: file, sha256: hash(data) }, replacements });
  }
}
const sourceFigures = new Set();
for (const number of sourcePages) {
  const page = await read(`${bookRoot('9p')}/pages/${String(number).padStart(4, '0')}/page.json`);
  for (const row of page.meta.figures) sourceFigures.add(row.id);
}
exactSet([...sourceFigures], sourceFigureIds, 'approved SOURCE9p figures');
const carryover = collections.flatMap(name => index[name]).filter(row =>
  row.batch === 'D-024' && row.priorBatch === 'D-023');
assert.equal(carryover.length, 4);
for (const row of carryover) await verify(row.path, row.sha256);
const manifest = {
  ticket: 'STEMROBIN-181', batch: 'D024', status: 'exact-evidence-retained-path-only-rebinding',
  cards: finalCards, targets, roots, retained, reused, rebound, media, provenanceOnly, carryover,
  reconstructed: [...state.reconstructed].map(([file, row]) => ({
    path: file, originalPath: row.originalPath, sha256: row.sha256, basis: row.basis,
  })),
  aliases: [...state.aliases].map(([originalAndSha, snapshot]) => ({ originalAndSha, snapshot })),
  evidenceIndexBefore: { path: indexPath, sha256: hash(indexBefore) },
  targetPreparation: prepared, preparation: await bind(preparationReceipt),
  sources: prepared.sources, sourcePages, figures: finalFigures,
  sourceFigures: [...sourceFigures].sort(), counts, excluded,
  blockedHistory: { n94Blocker, n95Blocker, n98Blocker, n98FigureFreeze, n98Science, final98History },
  continuation, originalRender, newRender: (await report(renderPath)).binding,
  limits: 'Verbatim93/94/95/97/98 history and generated98portrait; exact-SHA reconstruction only. Book-qualified metadata paths only for actual93/97/10p7. No SOURCE product writes, gate/native/browser replay, portrait promotion or counts.',
};
register({ path: manifestPath, sha256: hash(jsonBytes(manifest)), batch: 'D-024' });
assert.deepEqual(await bytes(indexPath), indexBefore, 'Concurrent evidence index change');
for (const [file, sha256] of historyFiles) await verify(file, sha256);
for (const item of plan.values()) {
  const data = state.reconstructed.get(item.source)?.data ?? await bytes(item.source);
  assert.equal(hash(data), item.sha256, `Concurrent frozen input drift: ${item.source}`);
}
for (const item of productWrites) assert.deepEqual(await bytes(item.file), item.beforeBytes);
for (const row of media) await verify(row.path, row.sha256);
for (const [file, row] of state.reconstructed) await immutableWrite(file, row.data);
for (const [file, item] of plan) await immutableWrite(file, item.data);
await immutableWrite(manifestPath, jsonBytes(manifest));
for (const item of productWrites) await fs.writeFile(absolute(item.file), item.data);
for (const row of media) await verify(row.path, row.sha256);
assert.deepEqual(await bytes(indexPath), indexBefore, 'Concurrent evidence index change before update');
index.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), jsonBytes(index));
console.log(JSON.stringify({ manifest: await bind(manifestPath), retained: retained.length,
  reboundPaths: rebound.reduce((sum, row) => sum + row.replacements.length, 0), cards: finalCards }));
