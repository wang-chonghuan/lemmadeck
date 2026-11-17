import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, evidence, indexPath, absolute, read, bytes, bind,
  verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const [execute, repairReviewPath] = process.argv.slice(2);
assert.equal(execute, '--execute');
assert.ok(repairReviewPath);
const originalPath = `${ticket}/tmp/d031-n113-figures-b-independent-review.json`;
await verify(originalPath, '6d3886ea6ba548462c0cb557f7274f3d3eced4193e2a295f07365af9fff5da60');
const original = await read(originalPath);
const repaired = await read(repairReviewPath);
assert.equal(original.status, 'fail');
assert.equal(repaired.status, 'pass');
const unchanged = original.figures.find(row => row.id === 'fig-231');
const changed = repaired.figures.find(row => row.id === 'fig-232');
assert.equal(unchanged.status, 'pass');
assert.equal(changed.status, 'pass');
assert.equal(repaired.figures.length, 1);
for (const figure of [unchanged, changed])
  for (const row of Object.values(figure.bindings))
    if (row.path && row.sha256) await verify(row.path, row.sha256);
const output = `${ticket}/tmp/d031-n113-figures-b-effective-review.json`;
const durable = `${evidence}/reports/d031-n113-figures-b-effective-review.json`;
assert.ok(!await exists(output));
assert.ok(!await exists(durable));
const before = await bytes(indexPath);
const index = JSON.parse(before);
await immutableWrite(output, `${JSON.stringify({
  schema: 'ld-s10y-image/review@1', ticket: 'STEMROBIN-181',
  card: 'phy9-c2-s4-n113', batch: 'd031-n113-figures-b', status: 'pass',
  scope: 'Existing FIG231 pass plus separate changed-only FIG232 sole-repair pass.',
  originalFailure: await bind(originalPath),
  changedOnlyReview: await bind(repairReviewPath),
  figures: [unchanged, changed], findings: [],
  limits: 'Composes exact existing independent approvals without reopening FIG231 or replaying SCI, source-page, render, width or browser gates. Original unresolved-glyph FAIL retained; no further repair or full-card claim.',
}, null, 2)}\n`);
await immutableWrite(durable, await bytes(output));
index.reports.push({ ...await bind(durable), originalPath: output,
  batch: 'D-031', deliveryClaim: false });
const helper = `${ticket}/tmp/combine-d031-n113-figure-b-review.mjs`;
const helperDestination = `${evidence}/author-history/d031/combine-d031-n113-figure-b-review.mjs`;
await immutableWrite(helperDestination, await bytes(helper));
index.reports.push({ ...await bind(helperDestination), originalPath: helper,
  batch: 'D-031', deliveryClaim: false });
assert.deepEqual(await bytes(indexPath), before);
index.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
console.log(JSON.stringify({ effective: await bind(output), reused: ['fig-231'],
  changedOnly: ['fig-232'] }));
