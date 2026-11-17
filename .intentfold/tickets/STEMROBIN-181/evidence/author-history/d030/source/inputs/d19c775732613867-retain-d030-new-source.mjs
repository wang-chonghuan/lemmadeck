import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, read, bytes, bind, hash,
  verify, exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const tmp = `${ticket}/tmp`;
const manifestPath = `${evidence}/reports/d030-source-retention-manifest.json`;
assert.ok(!await exists(manifestPath));
const consumedPath = `${tmp}/d030-source-consumed/result.json`;
await verify(consumedPath, '580947e4b654f9e220df555f2b71070a2565ab45983f451b0252d391e87c8512');
const consumed = await read(consumedPath);
assert.equal(consumed.status, 'pass-source-only-consumed');
for (const review of consumed.reviews) await verify(review.path, review.sha256);
const beforeIndex = await bytes(indexPath);
const index = JSON.parse(beforeIndex);
const retained = [];
const reused = [];
async function retain(file, destination, expected) {
  file = relative(file);
  const data = await bytes(file);
  const sha256 = hash(data);
  if (expected) assert.equal(sha256, expected, `Input drift: ${file}`);
  const previous = lookup(index, file, sha256);
  if (previous) {
    await verify(previous, sha256);
    reused.push({ path: previous, sha256, originalPath: file });
    return;
  }
  destination ??= `${evidence}/author-history/d030/source/inputs/${sha256.slice(0, 16)}-${path.basename(file)}`;
  await immutableWrite(destination, data);
  const row = { path: destination, sha256, originalPath: file,
    batch: 'D-030', deliveryClaim: false };
  const collection = /\.png$/.test(file) ? 'sourceCrops' : 'reports';
  const old = index[collection].find(item => item.path === destination);
  if (old) assert.equal(old.sha256, sha256);
  else index[collection].push(row);
  retained.push(row);
}
for (const entry of await fs.readdir(absolute(tmp), { withFileTypes: true })) {
  if (entry.isDirectory() && /^d030-(source|n11[34]-source)/.test(entry.name)) {
    for (const file of await walk(`${tmp}/${entry.name}`))
      await retain(file, `${evidence}/author-history/d030/source/${entry.name}/${path.relative(`${tmp}/${entry.name}`, file)}`);
  } else if (entry.isFile() && (
    /^d030-source.*\.json$/.test(entry.name) ||
    /^(?:finalize-d030-source|correct-d030-source|record-d030-source|reconcile-d030-source|assemble-d030-n11[34]|consume-d030-new-source)/.test(entry.name)
  )) {
    await retain(`${tmp}/${entry.name}`, `${evidence}/author-history/d030/source/reports/${entry.name}`);
  }
}
for (const row of consumed.pages) {
  const stem = String(row.page).padStart(4, '0');
  const source = `ssot-resources/soviet10year-textbooks/artifacts/9p/pages/${stem}`;
  const page = await read(`${source}/page.json`);
  await retain(`.tmp/ld-s10y-lesson/9p/pages/${stem}/page.png`,
    `${evidence}/source-pages/9p/${stem}/page.png`, page.meta.render.sha256);
  for (const binding of row.outputs)
    await retain(binding.path, `${evidence}/author-history/d030/source/pages/${stem}/${path.basename(binding.path)}`, binding.sha256);
}
for (const figure of consumed.sourceFigures) {
  await verify(figure.durable.path, figure.durable.sha256);
  await retain(figure.from.path,
    `${evidence}/author-history/d030/source/raw-figures/${path.basename(figure.from.path)}`, figure.from.sha256);
}
for (const file of [
  `${tmp}/d030-n111-ready/result.json`,
  `${tmp}/d030-n111-ready/before/production-meter.json`,
  `${tmp}/record-d030-n111-ready.mjs`,
  `${tmp}/retain-d030-new-source.mjs`,
]) await retain(file);
await immutableWrite(manifestPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'source-only-exact-evidence-retained',
  consumed: await bind(consumedPath), retained, reused,
  counts: consumed.counts,
  limits: 'Existing SOURCE/native/crop evidence, original failures and candidate bytes retained without replay. Raw pages, figures and source objects unchanged; no modern approval, commit/push, DB or formal handoff.',
}, null, 2)}\n`);
index.reports.push({ ...await bind(manifestPath), batch: 'D-030', deliveryClaim: false });
assert.deepEqual(await bytes(indexPath), beforeIndex);
index.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
console.log(JSON.stringify({ manifest: await bind(manifestPath),
  retained: retained.length, reused: reused.length }));
