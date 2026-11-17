import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, read, bind, verify, immutableWrite,
} from './retain-d016-evidence.mjs';
assert.deepEqual(process.argv.slice(2), ['--execute']);
const displayPath = `${ticket}/tmp/d048-effective-wave-display-final.json`;
await verify(displayPath, '941b0d876ceb4f9893a4144b5abc733e00594d0055d8779c18f504a8d7e38dd3');
const display = await read(displayPath);
const displayReviewPath = `${ticket}/tmp/d047-wave-display-review.json`;
const review = await read(displayReviewPath);
assert.equal(review.status, 'PASS');
assert.equal(review.displayResult.sha256, (await bind(displayPath)).sha256);
const manifest = await read(`${ticket}/tmp/d048-numbering-repair/manifest.json`);
const retainFolders = new Set([
  'd044-10p-n38-author', 'd044-10p-n39-author', 'd044-10p-n40-author',
  'd044-wave-preparation', 'd044-wave-figure-context', 'd044-localized-reference-checks',
  'd044-n38-n40-science-review-evidence', 'd044-n39-science-review-evidence',
  'd045-10p-n44-author', 'd045-n44-preparation', 'd045-n44-science-review-evidence',
  'd045-n39-text-repair', 'd045-n40-text-repair',
  'd045-n40-affected-review-evidence', 'd046-wave-bindings',
  'd046-n38-native', 'd046-n39-native', 'd046-n40-native', 'd046-n44-native',
  'd047-n39-answer-author', 'd047-n39-answer-review-evidence',
  'd047-n39-choice-author', 'd047-n39-choice-review', 'd047-n39-supplements',
  'd048-numbering-repair',
].map(name => `${ticket}/tmp/${name}`));
const retainFiles = new Set([
  'retain-d016-evidence.mjs', 'd044-prepare-wave-text.mjs',
  'd044-n38-n40-science-review.json', 'd044-n39-science-review.json',
  'd045-n44-science-review.json', 'd045-n39-affected-review.json',
  'd045-n40-affected-review.json', 'd046-finalize-wave-card.mjs',
  'd047-bind-n40.mjs', 'd047-bind-n44.mjs', 'd047-finalize-n39-supplements.mjs',
  'd047-n39-choice-review.json', 'd047-n39-answer-review.json',
  'd047-promote-wave-batch.mjs', 'd047-collect-display-reviews.mjs',
  'd029-batch.mjs', 'd048-n39-approved.json', 'd048-wave-display-manifest.json',
  'd048-display-preflight-resolution.json', 'd048-display-captured-resolution.json',
  'd048-resolve-captured-checks.mjs', 'd048-effective-wave-display.json',
  'd048-effective-wave-display-final.json', 'd048-unaffected-display-tiles.json',
  'd048-repair-display-tiles.json', 'd048-prepare-unaffected-tiles.mjs',
  'd048-combine-display.mjs', 'd048-prepare-integration.mjs',
  'd048-display-review-list.json', 'd048-prepare-display-review-list.mjs',
  'd048-push-d029.mjs',
].map(name => `${ticket}/tmp/${name}`));
for (let n = 1; n <= 5; n++) {
  for (const stem of ['d048-display-review-', 'd048-display-retained-'])
    retainFiles.add(`${ticket}/tmp/${stem}${String(n).padStart(2, '0')}.json`);
}
for (const report of review.reports) retainFiles.add(report.path);
for (const card of manifest.cards) {
  const native = await read(card.native.path);
  const gate = await read(native.manifest.path);
  for (const folder of gate.evidenceFolders) retainFolders.add(folder);
  for (const report of gate.reports) retainFiles.add(report.path);
  for (const input of native.inputs) retainFiles.add(input.path);
}
retainFolders.add(`${ticket}/tmp/d047-wave-display/run-e06b294c1a84-2026-11-17T10-27-59-172Z`);
retainFolders.add(`${ticket}/tmp/d047-wave-display/run-e06b294c1a84-2026-11-17T10-28-34-924Z`);
retainFiles.add(`${ticket}/tmp/d047-wave-display/check.mjs`);
for (const folder of retainFolders)
  assert.ok((await fs.stat(folder)).isDirectory(), `Missing evidence folder: ${folder}`);
for (const file of retainFiles)
  assert.ok((await fs.stat(file)).isFile(), `Missing evidence file: ${file}`);
const integration = {
  ticket: 'STEMROBIN-181', batch: 'D029', cards: manifest.cards,
  supplemental: manifest.supplemental, display: await bind(displayPath),
  displayReview: await bind(displayReviewPath),
  retainFolders: [...retainFolders].sort(), retainFiles: [...retainFiles].sort(),
  retainVersions: display.effectiveDisplayCombination.toolVersions,
  policy: 'Exact approved production only. Preserve all native, author, repair, review, screenshot and superseded evidence without repeating passed gates.',
};
const destination = `${ticket}/tmp/d048-wave-integration.json`;
await immutableWrite(destination, `${JSON.stringify(integration, null, 2)}\n`);
console.log(JSON.stringify({ integration: await bind(destination),
  retentionFolders: retainFolders.size, retentionFiles: retainFiles.size }));
