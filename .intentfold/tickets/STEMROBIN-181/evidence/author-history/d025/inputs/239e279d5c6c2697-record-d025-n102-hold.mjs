import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, read, bytes, bind, verify, exists, immutableWrite, absolute,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const tmp = `${ticket}/tmp`;
const output = `${tmp}/d025-n102-figure-hold.json`;
assert.ok(!await exists(output));
const freezePath = `${tmp}/d026-n102-figures-author-freeze.json`;
await verify(freezePath, '5ec5cd697db03aa9c13d74a5ef9dc37ca1831909bc22676679611e290dc7a226');
const freeze = await read(freezePath);
const passing = freeze.figures['fig-196'];
const failed = freeze.figures['fig-197'];
assert.equal(passing.status, 'pass');
assert.equal(failed.status, 'fail');
for (const figure of [passing, failed]) {
  for (const key of ['source', 'spec', 'render', 'context', 'review']) {
    await verify(figure[key].path, figure[key].sha256);
  }
}
const render = await read(failed.render.path);
assert.equal(render.status, 'fail');
assert.ok(render.collisions.some(row => row.id === '197-electron-name-label'));
const meterPath = `${ticket}/production-meter.json`;
const before = await bytes(meterPath);
const meter = JSON.parse(before);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 77);
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D025', card: freeze.lesson,
  status: 'hold-not-complete',
  authorFreeze: await bind(freezePath),
  science: await bind(`${tmp}/9p-n102-science-review.json`),
  prose: await bind(`${tmp}/9p-n102-prose-freeze.json`),
  figures: [
    { id: 'fig-196', status: 'author-pass-only-not-independent-or-promoted',
      spec: passing.spec, render: passing.render, review: passing.review },
    { id: 'fig-197', status: 'native-fail-after-sole-repair',
      spec: failed.spec, render: failed.render, review: failed.review,
      collisions: render.collisions },
  ],
  replacement: { book: '9p', card: 'phy9-c2-s4-n105', status: 'prose-authoring-only' },
  countsChanged: false, furtherFigureRetries: 0,
  limits: 'Existing author failure recorded without replay or new approval. Source and passing prose/SCI retained; n102 excluded from batch completion. No generation, independent pixel gate, promotion, native lesson finalization, browser, Git or DB operation.',
}, null, 2)}\n`);
const next = meter.currentCheckpoint.nextBatch;
next.status = 'developing-three-provisional-cards-n102-figure-hold';
next.targets = [
  { book: '10p', card: 'phy10-c1-s2-n5', status: 'ready-existing-native-display-new-SCI' },
  { book: '9p', card: 'phy9-c2-s4-n101', status: 'SCI-pass-figure-context-affected-review-pending' },
  { book: '9p', card: 'phy9-c2-s4-n105', status: 'source-complete-prose-authoring' },
];
next.excludedCards.push({
  book: '9p', card: freeze.lesson, blocker: await bind(output),
});
next.verification = 'Reuse n5 SOURCE/native/display and new SCI, n101 SCI and exact pixels; only n101 context bindings rechecked. New105 requires own SCI/native and one101/105 batch display run. n102 remains held.';
meter.currentCheckpoint.unfinished.push(
  'D025 n102 excluded:fig197 top-label collision remains after sole repair;196 hybrid author-pass only. Source/prose/SCI retained; no more figure retry or promotion. Replacement105 source-complete prose in progress.',
);
meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(meterPath), before, 'Concurrent meter update');
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
console.log(JSON.stringify(await bind(output)));
