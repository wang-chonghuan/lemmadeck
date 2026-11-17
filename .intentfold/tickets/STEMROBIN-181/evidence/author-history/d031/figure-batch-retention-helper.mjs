import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, read, bytes, bind, hash,
  verify, exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

const [execute, freezePath, reviewPath] = process.argv.slice(2);
assert.equal(execute, '--execute');
assert.ok(freezePath && reviewPath);
const freeze = await read(freezePath);
const review = await read(reviewPath);
assert.ok(['pass', 'fail'].includes(review.status.toLowerCase()));
for (const binding of freeze.frozenFiles) await verify(binding.path, binding.sha256);
const ownedRoot = relative(freeze.ownedRoot);
assert.ok(ownedRoot.startsWith('.tmp/STEMROBIN-181/9p-d031-'));
const name = path.basename(ownedRoot);
const output = `${evidence}/reports/${name}-retention-manifest.json`;
assert.ok(!await exists(output));
const beforeIndex = await bytes(indexPath);
const index = JSON.parse(beforeIndex);
const retained = [];
const reused = [];
async function retain(file, destination) {
  file = relative(file);
  const data = await bytes(file);
  const sha256 = hash(data);
  const previous = lookup(index, file, sha256);
  if (previous) {
    await verify(previous, sha256);
    reused.push({ path: previous, sha256, originalPath: file });
    return;
  }
  await immutableWrite(destination, data);
  const row = { path: destination, sha256, originalPath: file,
    batch: 'D-031', deliveryClaim: false };
  const collection = /\.png$/.test(file) ? 'figurePixels'
    : /\.(?:svg|spec\.json)$/.test(file) ? 'figureFiles' : 'reports';
  const old = index[collection].find(item => item.path === destination);
  if (old) assert.equal(old.sha256, sha256);
  else index[collection].push(row);
  retained.push(row);
}
for (const file of await walk(ownedRoot))
  await retain(file, `${evidence}/figures/candidates/9p/${name}/${path.relative(ownedRoot, file)}`);
for (const file of [freezePath, reviewPath])
  await retain(file, `${evidence}/reports/${path.basename(file)}`);
await retain(`${ticket}/tmp/retain-d031-figure-batch.mjs`,
  `${evidence}/author-history/d031/figure-batch-retention-helper.mjs`);
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'exact-figure-author-and-independent-evidence-retained',
  freeze: await bind(freezePath), independentReview: await bind(reviewPath),
  independentResult: review.status, retained, reused,
  limits: 'Byte-exact retention of frozen author outputs, initial failures, sole repairs and independent review. No source inventory, scientific/pixel/native/browser gate replay, promotion, card completion, DB, commit/push or handoff.',
}, null, 2)}\n`);
index.reports.push({ ...await bind(output), batch: 'D-031', deliveryClaim: false });
assert.deepEqual(await bytes(indexPath), beforeIndex);
index.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
console.log(JSON.stringify({ manifest: await bind(output),
  retained: retained.length, reused: reused.length, result: review.status }));
