import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const root = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const edition = `${root}/editions/modern-us-neutral`;
const meter = read(`${ticket}/production-meter.json`);
const configurations = [
  ['phy9-c1-s3-n34', '9p-n34-science-review.json'],
  ['phy9-c1-s3-n35', '9p-n35-science-review.json'],
  ['phy9-c1-s4-n38', '9p-n38-science-correction.json'],
  ['phy9-c1-s4-n39', '9p-n38-n39-science-review.json'],
];
const courses = [], figureTuples = [], historicalDeliveries = {};
for (const [card, scienceName] of configurations) {
  const rawSource = bind(`${root}/lessons/${card}/lesson.json`);
  const raw = read(rawSource.path);
  const products = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => bind(`${edition}/lessons/${card}/${name}`));
  const lesson = read(products[0].path), audit = read(products[3].path);
  assert.equal(lesson.status, 'ready');
  assert.equal(audit.status, 'pass');
  assert.equal(audit.sourceLessonSha256, rawSource.sha256);
  assert.deepEqual(lesson.source.data, raw);
  assert.equal(raw.exercise_count, 0);
  const delivery = meter.deliveryBatches.find(row => row.status === 'complete-committed-pushed'
    && row.cards.includes(card));
  assert(delivery);
  historicalDeliveries[delivery.id] = { commitRecorded: delivery.commit };
  const science = bind(`${ticket}/evidence/reports/${scienceName}`);
  const figures = read(products[2].path).figures;
  for (const figure of figures) {
    const spec = read(`${edition}/${figure.spec}`);
    const generated = spec.mode === 'generated';
    assert(generated || spec.mode === 'deterministic');
    const names = generated ? ['spec', 'png', 'generation', 'review'] : ['spec', 'svg', 'render', 'review'];
    const files = Object.fromEntries(names.map(name => [name, bind(`${edition}/${figure[name]}`)]));
    const review = read(files.review.path);
    const media = generated ? 'png' : 'svg';
    assert.equal(review.status, 'pass');
    assert.equal(review.spec.sha256, files.spec.sha256);
    assert.equal(review.outputs[media].sha256, files[media].sha256);
    const source = bind(`${root}/figures/${figure.id}.png`);
    assert.equal(spec.source.image.sha256, source.sha256);
    assert.equal(review.source.sha256, source.sha256);
    const evidence = read(files[generated ? 'generation' : 'render'].path);
    assert.equal(review[generated ? 'generation' : 'render'].sha256,
      files[generated ? 'generation' : 'render'].sha256);
    assert.equal(generated ? evidence.output.sha256 : evidence.output.svg.sha256, files[media].sha256);
    const independentFile = bind(`${edition}/figures/${figure.id}.independent-review.json`);
    const independent = read(independentFile.path);
    assert.equal(independent.status, 'pass');
    const originalGate = bind(path.resolve(repo, independent.originalReport.path));
    assert.equal(originalGate.sha256, independent.originalReport.sha256);
    assert.equal((independent.source ?? independent.bindings.source).sha256, source.sha256);
    assert.equal((independent.spec ?? independent.bindings.spec).sha256, files.spec.sha256);
    assert.equal((independent.outputs?.[media] ?? independent.bindings[media]).sha256, files[media].sha256);
    figureTuples.push({
      card, id: figure.id, mode: spec.mode, display: spec.display,
      source: { path: path.relative(root, source.path), sha256: source.sha256 },
      sha256ByFile: Object.fromEntries([...Object.values(files), independentFile]
        .map(file => [path.relative(edition, file.path), file.sha256])),
      originalGate: { path: path.relative(`${ticket}/evidence/reports`, originalGate.path), sha256: originalGate.sha256 },
      actualSourceSpecOutputIndependentAndNativeHashesMatch: true,
      ...(generated ? { recordedOutputDimensions: [evidence.output.width, evidence.output.height] } : {}),
      originalSourceAndFigureApprovalNotReplayed: true,
    });
  }
  courses.push({
    card, objects: raw.prose.length, originalTasks: 0, figureIds: figures.map(figure => figure.id),
    sourceFigureCount: raw.figures.length, historicalDeliveryBatch: delivery.id,
    rawSource, chineseProducts: { files: products,
      sha256ByFile: Object.fromEntries(products.map(file => [path.basename(file.path), file.sha256])) },
    science: { base: 'reports', path: scienceName, sha256: science.sha256,
      historicalStatus: read(science.path).status, historicalOnly: true,
      historicalScienceApprovalAssumed: false, newEnglishScienceReviewRequired: true },
    genuinelyHeld: false,
    ...(card.endsWith('n38') || card.endsWith('n39') ? {
      sharedFigureContextsMustPreserveOtherLesson: true,
      originalN38N39ScienceFailureAndN38CorrectionMustRemain: true,
    } : {}),
  });
}
const file = `${ticket}/tmp/d1816-d1392-next-kinetic-phase-en-inventory/result.json`;
save(file, {
  task: 'D1392', status: 'FIRST_MISSING_EN_INVENTORY_NATIVE_PREPARATION_PENDING',
  courses, figureTuples, historicalDeliveries, newCompleteCourses: 0, newSourcePages: 0,
  historicalChineseScienceApprovalRecovered: false, parentNewImages: 0,
  sourceAndHistoricalFigureReviewsReplayed: false, databaseWrites: 0, paidCalls: 0,
  fullEnglishAccessibilityApproval: false, formalHandoff: false, scopeCompleted: false,
  next: 'Prepare first missing English templates, retain actual failure history, then author and obtain first independent English science/fidelity/readability review.',
});
console.log(JSON.stringify({ inventory: bind(file), cards: courses.map(row => row.card),
  objects: courses.reduce((sum, row) => sum + row.objects, 0), parentNewImages: 0 }));
