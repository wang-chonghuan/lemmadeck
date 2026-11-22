import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const card = 'phy9-c1-s2-n16';
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const expected = {
  template: '79b6e5fe0a432629d219d8943c72a0a0508a82a0dd18ad403784411d2a5a8c61',
  source: 'd3fb6a87ab2e9234af1fddfeb813ddb7f0923c06ddf95d446cec9afacb613eb2',
  zh: 'a88f6c550662f54eec030a36a1726552ff011f84e4970f8ce0d36a71f0ec30b6',
  commit: '45915a468f08b2b694885fd0f359eff1a932a913',
};
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const serialize = data => JSON.stringify(data, null, 2) + '\n';
const science = bind(`${ticket}/evidence/reports/9p-n16-science-review.json`);
const report = read(science.path);
assert.equal(report.status, 'pass');
assert.equal(report.lesson_id, card);
assert.equal(report.input_bindings.template.sha256, expected.template);
assert.equal(report.input_bindings.original_lesson_json.sha256, expected.source);
const deliveries = read(`${ticket}/production-meter.json`).deliveryBatches
  .filter(batch => batch.id === 'D-004');
assert.equal(deliveries.length, 1);
const delivery = deliveries[0];
assert.equal(delivery.status, 'complete-committed-pushed');
assert.equal(delivery.commit, expected.commit);
assert(delivery.cards.includes(card));
const source = bind(`${book}/lessons/${card}/lesson.json`);
assert.equal(source.sha256, expected.source);
const products = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
  .map(name => bind(`${book}/editions/modern-us-neutral/lessons/${card}/${name}`));
assert.equal(products[0].sha256, expected.zh);
const zh = read(products[0].path);
assert.equal(zh.card_id, card);
assert.equal(zh.status, 'ready');
assert.equal(zh.source.sha256, source.sha256);
assert.deepEqual(zh.source.data, read(source.path));
const audit = read(products[3].path);
assert.equal(audit.lesson, card);
assert.equal(audit.status, 'pass');
assert.equal(audit.sourceLessonSha256, source.sha256);
assert.deepEqual(audit.errors, []);
assert.equal(audit.proseBlocks, zh.prose.length);
assert.equal(audit.errata, zh.errata.length);
assert.equal(audit.figures, 0);
assert.equal(audit.exercises, 0);
assert.equal(read(products[2].path).figures.length, 0);
const sourceExercises = bind(`${book}/lessons/${card}/exercises.json`);
const exercises = read(products[1].path);
assert.equal(audit.sourceExercisesSha256, sourceExercises.sha256);
assert.equal(exercises.source.sha256, sourceExercises.sha256);
assert.deepEqual(exercises.source.data, read(sourceExercises.path));
assert.equal(exercises.exercises.length, 0);

const deliveryByteChecks = [source, sourceExercises, ...products].map(file => {
  const result = spawnSync('git', [
    '--no-optional-locks', 'show', `${expected.commit}:${path.relative(repo, file.path)}`,
  ], { cwd: repo, maxBuffer: 4 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stderr?.toString());
  const committedSha256 = hash(result.stdout);
  assert.equal(committedSha256, file.sha256);
  return { path: file.path, sha256: committedSha256, currentBytesMatch: true };
});
const reviewedDraft = structuredClone(zh);
reviewedDraft.status = 'draft';
const statusOnlyBytes = serialize(reviewedDraft);
const statusOnlySha256 = hash(statusOnlyBytes);
const statusOnlyMatches = statusOnlySha256 === expected.template;

// Only the reported alias and its exact checkout-local suffix are candidates.
const templateSuffix = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card}/lesson.template.json`;
const historicalAlias = `/Users/yong/.codex/worktrees/00b1/lemmadeck/${templateSuffix}`;
assert.equal(report.input_bindings.template.path, historicalAlias);
const aliasChecks = [];
let recoveredTemplate = null;
if (!statusOnlyMatches) {
  for (const file of [historicalAlias, `${repo}/${templateSuffix}`]) {
    if (!fs.existsSync(file)) {
      aliasChecks.push({ path: file, exists: false });
      continue;
    }
    const binding = bind(file);
    const matches = binding.sha256 === expected.template
      && binding.bytes === report.input_bindings.template.bytes;
    aliasChecks.push({ ...binding, exists: true, exactReviewedBytesMatch: matches });
    if (matches) {
      const candidate = read(file);
      assert.equal(candidate.status, 'draft');
      candidate.status = 'ready';
      assert.deepEqual(candidate, zh);
      recoveredTemplate = binding;
      break;
    }
  }
}
const recovered = statusOnlyMatches || recoveredTemplate !== null;
const out = `${ticket}/tmp/d1816-d1233-n16-delivered-science-binding`;
save(`${out}/result.json`, {
  task: 'D1233', status: recovered ? 'pass' : 'binding-gap',
  card, book: '9p', science, source, sourceExercises,
  approvedZh: products[0], products, nativeAudit: products[3],
  historicalDelivery: delivery.id, historicalCommit: expected.commit,
  deliveryByteChecks, allNativeDeliveryBytesSourceAndAuditMatch: true,
  reviewedTemplateSha256: expected.template,
  reviewedTemplateBytes: report.input_bindings.template.bytes,
  statusOnlyNativeFinalization: {
    from: 'draft', to: 'ready', matchesReviewedTemplate: statusOnlyMatches,
    reconstructedDraftSha256: statusOnlySha256,
    reconstructedDraftBytes: Buffer.byteLength(statusOnlyBytes),
  },
  historicalAliasChecks: aliasChecks, recoveredTemplate,
  exactReviewedScienceToDeliveredBindingRecovered: recovered,
  allReviewedContentAndMetadataOutsideStatusByteExact: recovered,
  gap: recovered ? null : {
    kind: 'exact-historical-template-alias-unavailable',
    statusOnlyConversionMatched: false,
    expectedSha256: expected.template, actualSha256: statusOnlySha256,
    scope: 'Byte-binding gap only; not a new scientific verdict or invalidation of D-004 delivery.',
    fabricatedTemplateOrApproval: false,
  },
  helper: bind(`${ticket}/tmp/d1816-recovery/recover-d1233-n16-delivered-science-binding.mjs`),
  fullScienceReviewReplayed: false, sourceReviewReplayed: false,
  sourceImages: 0, nativeCalls: 0, paidCalls: 0, networkCalls: 0,
  databaseWrites: 0, productFilesChanged: 0, gitWrites: 0,
  newCompleteCourses: 0, newSourcePages: 0,
  englishPreparationAuthorReviewAndFinalizeStillPending: true,
});
console.log(JSON.stringify({ status: recovered ? 'pass' : 'binding-gap', binding: bind(`${out}/result.json`) }));
