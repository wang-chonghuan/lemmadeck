import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const root = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const edition = `${root}/editions/modern-us-neutral`;
const meter = read(`${ticket}/production-meter.json`);
const previousPush = bind(`${ticket}/evidence/reports/d1816-d1421-four-9p-en/actual-push.json`);
assert.equal(read(previousPush.path).independentRemoteVerification.matchesCommittedHead, true);
const configurations = [
  ['phy9-c1-s4-n40', '9p-n40-n41-science-review.json', null, 'd013-finalization-binding.json'],
  ['phy9-c1-s4-n42', '9p-n42-science-correction.json', '9p-n42-science-review.json', 'd013-finalization-binding.json'],
  ['phy9-c1-s5-n43', '9p-n43-n45-science-review.json', null, 'd013-finalization-binding.json'],
  ['phy9-c1-s5-n46', '9p-n46-science-correction.json', '9p-n46-science-review.json', 'd014-finalization-binding.json'],
];
const courses = [], figureTuples = [], historicalDeliveries = {};
const historical = name => {
  const file = bind(`${ticket}/evidence/reports/${name}`);
  return { base: 'reports', path: name, sha256: file.sha256, historicalStatus: read(file.path).status,
    historicalOnly: true, historicalScienceApprovalAssumed: false };
};
for (const [card, scienceName, firstName, anchorName] of configurations) {
  const rawSource = bind(`${root}/lessons/${card}/lesson.json`), raw = read(rawSource.path);
  const products = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => bind(`${edition}/lessons/${card}/${name}`));
  const lesson = read(products[0].path), audit = read(products[3].path);
  assert.equal(lesson.status, 'ready');
  assert.equal(audit.status, 'pass');
  assert.equal(audit.sourceLessonSha256, rawSource.sha256);
  assert.deepEqual(lesson.source.data, raw);
  assert.equal(raw.exercise_count, 0);
  const delivery = meter.deliveryBatches.find(row => row.status === 'complete-committed-pushed' && row.cards.includes(card));
  assert(delivery);
  historicalDeliveries[delivery.id] = { commitRecorded: delivery.commit };
  const science = historical(scienceName);
  if (firstName) Object.assign(science, {
    firstReview: historical(firstName), correction: historical(scienceName), anchorBinding: historical(anchorName),
  });
  else science.finalizationBinding = historical(anchorName);
  const figures = read(products[2].path).figures;
  for (const figure of figures) {
    const spec = read(`${edition}/${figure.spec}`);
    assert.equal(spec.mode, 'deterministic');
    const files = Object.fromEntries(['spec', 'svg', 'render', 'review']
      .map(name => [name, bind(`${edition}/${figure[name]}`)]));
    const review = read(files.review.path);
    assert.equal(review.status, 'pass');
    assert.equal(review.spec.sha256, files.spec.sha256);
    assert.equal(review.outputs.svg.sha256, files.svg.sha256);
    const source = bind(`${root}/figures/${figure.id}.png`);
    assert.equal(spec.source.image.sha256, source.sha256);
    assert.equal(review.source.sha256, source.sha256);
    const evidence = read(files.render.path);
    assert.equal(review.render.sha256, files.render.sha256);
    assert.equal(evidence.output.svg.sha256, files.svg.sha256);
    const independentFile = bind(`${edition}/figures/${figure.id}.independent-review.json`);
    const independent = read(independentFile.path);
    assert.equal(independent.status, 'pass');
    const originalGate = bind(path.resolve(repo, independent.originalReport.path));
    assert.equal(originalGate.sha256, independent.originalReport.sha256);
    assert.equal((independent.source ?? independent.bindings.source).sha256, source.sha256);
    assert.equal((independent.spec ?? independent.bindings.spec).sha256, files.spec.sha256);
    assert.equal((independent.outputs?.svg ?? independent.bindings.svg).sha256, files.svg.sha256);
    figureTuples.push({
      card, id: figure.id, mode: spec.mode, display: spec.display,
      source: { path: path.relative(root, source.path), sha256: source.sha256 },
      sha256ByFile: Object.fromEntries([...Object.values(files), independentFile]
        .map(file => [path.relative(edition, file.path), file.sha256])),
      originalGate: { path: path.relative(`${ticket}/evidence/reports`, originalGate.path), sha256: originalGate.sha256 },
      actualSourceSpecOutputIndependentAndNativeHashesMatch: true, originalSourceAndFigureApprovalNotReplayed: true,
    });
  }
  courses.push({
    card, objects: raw.prose.length, originalTasks: 0, figureIds: figures.map(figure => figure.id),
    sourceFigureCount: raw.figures.length, historicalDeliveryBatch: delivery.id, rawSource,
    chineseProducts: { files: products,
      sha256ByFile: Object.fromEntries(products.map(file => [path.basename(file.path), file.sha256])) },
    science: { ...science, newEnglishScienceReviewRequired: true }, genuinelyHeld: false,
    sourceMathSubscriptsRetained: card.endsWith('n40'),
    historicalNeighborHoldsNotReopened: true,
  });
}
const file = `${ticket}/tmp/d1816-d1435-next-surface-humidity-en-inventory/result.json`;
save(file, {
  task: 'D1435', status: 'FIRST_MISSING_EN_INVENTORY_NATIVE_PREPARATION_PENDING',
  previousPush, courses, figureTuples, historicalDeliveries,
  newCompleteCourses: 0, newSourcePages: 0, historicalChineseScienceApprovalRecovered: false,
  parentNewImages: 0, sourceAndHistoricalFigureReviewsReplayed: false, databaseWrites: 0, paidCalls: 0,
  fullEnglishAccessibilityApproval: false, formalHandoff: false, scopeCompleted: false,
  next: 'Prepare missing English templates, author, and obtain first independent English science/fidelity/readability reviews.',
});
console.log(JSON.stringify({ inventory: bind(file), cards: courses.map(row => row.card),
  objects: courses.reduce((sum, row) => sum + row.objects, 0), figures: figureTuples.length, parentNewImages: 0 }));
