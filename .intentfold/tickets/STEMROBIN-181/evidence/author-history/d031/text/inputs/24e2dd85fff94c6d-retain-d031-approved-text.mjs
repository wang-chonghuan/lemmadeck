import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, read, bytes, bind, hash,
  verify, exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const tmp = `${ticket}/tmp`;
const output = `${evidence}/reports/d031-approved-text-retention.json`;
assert.ok(!await exists(output));
const science = [
  [`${tmp}/9p-n113-science-review.json`, 'a737213742ab0bb257fe29a829b7c75f1e16d1bfcee376870208add938906fe7'],
  [`${tmp}/9p-n114-science-review.json`, '75456eabec7b4a666cd5e00db5b2c7f8791b902f96190f4a5f026cb19e0151b8'],
];
for (const [file, sha256] of science) await verify(file, sha256);
assert.equal((await read(science[0][0])).status, 'SCI-PASS');
assert.equal((await read(science[1][0])).status, 'PASS');
const beforeIndex = await bytes(indexPath);
const index = JSON.parse(beforeIndex);
const retained = [];
const reused = [];
async function retain(file, destination) {
  file = relative(file);
  assert.ok(!/(?:^|\/)\.env(?:\.|$)/.test(file));
  const data = await bytes(file);
  const sha256 = hash(data);
  const previous = lookup(index, file, sha256);
  if (previous) {
    await verify(previous, sha256);
    reused.push({ path: previous, sha256, originalPath: file });
    return;
  }
  destination ??= `${evidence}/author-history/d031/text/inputs/${sha256.slice(0, 16)}-${path.basename(file)}`;
  await immutableWrite(destination, data);
  const row = { path: destination, sha256, originalPath: file,
    batch: 'D-031', deliveryClaim: false };
  const collection = /\.png$/.test(file) ? 'sourceCrops' : 'reports';
  const old = index[collection].find(item => item.path === destination);
  if (old) assert.equal(old.sha256, sha256);
  else index[collection].push(row);
  retained.push(row);
}
for (const number of [113, 114]) {
  for (const suffix of ['prose-author', 'modern-text-prepared']) {
    const directory = `d031-n${number}-${suffix}`;
    for (const file of await walk(`${tmp}/${directory}`))
      await retain(file, `${evidence}/author-history/d031/text/${directory}/${path.relative(`${tmp}/${directory}`, file)}`);
  }
  for (const name of [`9p-n${number}-prose-freeze.json`, `9p-n${number}-science-review.json`,
    `prepare-d031-n${number}-modern-text.mjs`])
    await retain(`${tmp}/${name}`, `${evidence}/author-history/d031/text/reports/${name}`);
}
for (const name of ['page.md', 'page.json', 'audit.json'])
  await retain(`ssot-resources/soviet10year-textbooks/artifacts/9p/pages/0278/${name}`,
    `${evidence}/author-history/d031/text/source278-after-approved-errata/${name}`);
await retain(`${tmp}/retain-d031-approved-text.mjs`);
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'approved-text-only-retained-figures-pending',
  science: await Promise.all(science.map(([file]) => bind(file))),
  preparation: await Promise.all([113, 114].map(number =>
    bind(`${tmp}/d031-n${number}-modern-text-prepared/result.json`))),
  retained, reused,
  limits: 'Approved frozen full text/translations, raw snapshots, author failures and exact errata migration retained. No new SCI/source/native/browser/image/figure check, modern-card completion, DB, commit/push or handoff.',
}, null, 2)}\n`);
index.reports.push({ ...await bind(output), batch: 'D-031', deliveryClaim: false });
assert.deepEqual(await bytes(indexPath), beforeIndex);
index.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
const meterPath = `${ticket}/production-meter.json`;
const meter = await read(meterPath);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 80);
for (const target of meter.currentCheckpoint.nextBatch.targets) {
  if (target.card.endsWith('-n113') || target.card.endsWith('-n114')) {
    const number = target.card.endsWith('-n113') ? 113 : 114;
    target.status = 'science-and-translation-pass-modern-figures-pending';
    target.science = await bind(`${tmp}/9p-n${number}-science-review.json`);
    target.preparation = await bind(`${tmp}/d031-n${number}-modern-text-prepared/result.json`);
  }
}
meter.currentCheckpoint.nextBatch.approvedTextRetention = await bind(output);
meter.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify({ manifest: await bind(output),
  retained: retained.length, reused: reused.length, deliveredUnchanged: 80 }));
