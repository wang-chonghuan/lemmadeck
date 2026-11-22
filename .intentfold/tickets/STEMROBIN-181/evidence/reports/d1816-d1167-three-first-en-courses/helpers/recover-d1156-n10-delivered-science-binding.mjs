import crypto from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const card = 'phy10-c1-s2-n10';
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/10p`;
const science = bind(`${ticket}/evidence/reports/10p-n10-science-review.json`);
const report = read(science.path);
assert.equal(report.status, 'pass');
const delivery = read(`${ticket}/production-meter.json`).deliveryBatches.find(batch => batch.id === 'D-004');
assert.equal(delivery.status, 'complete-committed-pushed');
assert(delivery.cards.includes(card));
const source = bind(`${book}/lessons/${card}/lesson.json`);
assert.equal(source.sha256, report.input_bindings.original_lesson_json.sha256);
const products = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
  .map(name => bind(`${book}/editions/modern-us-neutral/lessons/${card}/${name}`));
const zh = read(products[0].path);
assert.equal(zh.status, 'ready');
assert.deepEqual(zh.source.data, read(source.path));
const reviewedDraft = structuredClone(zh);
reviewedDraft.status = 'draft';
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
assert.equal(hash(JSON.stringify(reviewedDraft, null, 2) + '\n'), report.input_bindings.template.sha256);
for (const file of [source, ...products]) {
  const result = spawnSync('git', ['show', `${delivery.commit}:${path.relative(repo, file.path)}`],
    { cwd: repo, maxBuffer: 4 * 1024 * 1024 });
  assert.equal(result.status, 0);
  assert.equal(hash(result.stdout), file.sha256);
}
assert.equal(read(products[2].path).figures.length, 0);
assert.equal(read(products[3].path).status, 'pass');
assert.equal(read(products[3].path).sourceLessonSha256, source.sha256);
const out = `${ticket}/tmp/d1816-d1156-n10-delivered-science-binding`;
save(`${out}/result.json`, {
  task: 'D1156', status: 'pass', card, book: '10p', science,
  source, approvedZh: products[0], products, historicalDelivery: delivery.id,
  historicalCommit: delivery.commit, reviewedTemplateSha256: report.input_bindings.template.sha256,
  statusOnlyNativeFinalization: { from: 'draft', to: 'ready' },
  allReviewedContentAndMetadataOutsideStatusByteExact: true,
  nativeAudit: products[3], fullScienceReviewReplayed: false,
  sourceImages: 0, nativeCalls: 0, paidCalls: 0, databaseWrites: 0,
  englishPreparationAuthorReviewAndFinalizeStillPending: true,
});
console.log(JSON.stringify({ binding: bind(`${out}/result.json`) }));
