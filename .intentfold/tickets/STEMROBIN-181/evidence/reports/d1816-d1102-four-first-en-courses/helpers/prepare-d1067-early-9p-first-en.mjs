import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const configs = {
  'phy9-c1-s1-n6': {
    task: 'D1067', batch: 'D-002', objects: 19,
    science: '9p-n6-science-review-final.json', binding: '9p-n6-science-review-binding.json',
    zhHash: '65873ac37ba0ed406fa0d19f352b0ec6d6231601491e80b737ab562819d99e2e',
    rawHash: 'd49e2dec80dadbb97bc973dad64636cb5d3a3e207923f5d5d17cffaac019618b',
  },
  'phy9-c1-s2-n13': {
    task: 'D1072', batch: 'D-002', objects: 5,
    science: '9p-n13-science-review.json', binding: '9p-n13-science-review.json',
    zhHash: '7d52525a9123ee92b95cec599176877cc91f8ae59b42de86b1f3ddf1fe8e894f',
    rawHash: '383fa9609624cb262060405f116fb1cce974ec77a14b69ebb07669f7c2b5e912',
  },
  'phy9-c1-s2-n27': {
    task: 'D1081', batch: 'D-009', objects: 9,
    science: '9p-n27-n28-science-review-correction.json',
    binding: '9p-n27-n28-finalization-binding.json', scienceOriginal: '9p-n27-n28-science-review.json',
    combinedCorrection: true,
    zhHash: 'a63c4d9e7aa2625b9690c96ea8177ce3179073649bdf5b772ca6fbe01f89bcae',
    rawHash: '3a1461952eb2ee493d5c97ce954455a8f639015a72dc257bbf9a182057acea8e',
  },
  'phy9-c1-s2-n28': {
    task: 'D1083', batch: 'D-009', objects: 17,
    science: '9p-n27-n28-science-review-correction.json',
    binding: '9p-n27-n28-finalization-binding.json', scienceOriginal: '9p-n27-n28-science-review.json',
    combinedCorrection: true,
    zhHash: 'ca1018d0785f99a828b3080500ee0f7d2deba73dffb7ed600666ff4b6815dae1',
    rawHash: 'a9b23302b7b5816e1d33f8a86dbd25e8992b3c9787b9759d168ff3c8203e7d63',
  },
  'phy9-c1-s3-n30': {
    task: 'D1085', batch: 'D-010', objects: 5,
    science: '9p-n30-n31-science-review.json', binding: 'd010-finalization-binding.json',
    combinedNative: 'n30',
    zhHash: '713cfb07bcd2a879c8124d8133b0e967155f3e175b2b5004da42fda8c2d92321',
    rawHash: 'b00671f962545a218afc55b6bc6ecacbe58b34d301025a4f51fb83704bd6fe8b',
  },
  'phy9-c1-s3-n31': {
    task: 'D1087', batch: 'D-010', objects: 17,
    science: '9p-n30-n31-science-review.json', binding: 'd010-finalization-binding.json',
    combinedNative: 'n31',
    zhHash: 'f07e79d44cd44f38fdebb1b4c28e90babe18f8b149d0bb45cbd784681842b48a',
    rawHash: 'c45bc127ac2ade94f04b137ef581d249c949b18d4300f4ed3ef181327109186d',
  },
  'phy9-c1-s3-n33': {
    task: 'D1104', batch: 'D-010', objects: 12,
    science: '9p-n33-science-review.json', binding: 'd010-finalization-binding.json',
    singleNative: true,
    zhHash: 'c8bbca00f7470a26256f5a3f18fb91e06abb9fab85624120cb54a1e7b504aa96',
    rawHash: 'a1acbaab95a5894733163fef35f948de22dc662d7918209f6097521666bcef0c',
  },
  'phy9-c1-s3-n36': {
    task: 'D1106', batch: 'D-011', objects: 18,
    science: '9p-n36-n37-science-review-correction.json', binding: 'd011-finalization-binding.json',
    scienceOriginal: '9p-n36-n37-science-review.json', finalizedCorrection: true,
    zhHash: 'b2ec50ddb513b2e8fd2df2fa68d43ae632ca0a4e014c6f8157afbe1f09fb18b4',
    rawHash: 'b3c55c4c6699bba48dd62157186cd21a5d4684905f9b58805a7ebd67d0cc5933',
  },
  'phy9-c1-s4-n37': {
    task: 'D1108', batch: 'D-011', objects: 15,
    science: '9p-n36-n37-science-review-correction.json', binding: 'd011-finalization-binding.json',
    scienceOriginal: '9p-n36-n37-science-review.json', finalizedCorrection: true,
    zhHash: 'c1d71eab2ae04f5b67fafc831f8805a0e1a067d757c21a892b47e0701914b85b',
    rawHash: 'eb0cf43264eede37a28015b11b87c07f5b43b73c83de0049ae5342a19caf06cd',
  },
  'phy9-c1-s5-n45': {
    task: 'D1124', batch: 'D-013', objects: 10,
    science: '9p-n43-n45-science-review.json', binding: 'd013-finalization-binding.json',
    scopedNative: true,
    zhHash: '5a4365380d93e14a8740a715879677e1ced9815811f6fdb7cca19e12c208b4c2',
    rawHash: 'bf73ca7664cb941f5e1de24a45edbd985ced13e3dc2a173d6af8599111eb920a',
  },
  'phy9-c1-s6-n54': {
    task: 'D1129', batch: 'D-016', objects: 38,
    science: '9p-n54-science-review.json', binding: 'd016-finalization-binding.json',
    directScienceNative: true,
    zhHash: '15d3bdbd655a39b1b83413a0eb3147ac31dbd7632a35e41a5cf6aad4bd38d2be',
    rawHash: 'c3a6df77bd20269dc1559f0e974b505c24647c1f4a39e9bda60b0893e7ef9f68',
  },
};
const card = process.argv[2], config = configs[card];
assert(config);
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const scienceFile = `${ticket}/evidence/reports/${config.science}`;
const bindingFile = `${ticket}/evidence/reports/${config.binding}`;
assert.equal(read(scienceFile).status, 'pass');
assert.equal(read(bindingFile).status, 'pass');
const source = bind(`${book}/lessons/${card}/lesson.json`);
const approvedZh = bind(`${book}/editions/modern-us-neutral/lessons/${card}/lesson.json`);
assert.equal(source.sha256, config.rawHash);
assert.equal(approvedZh.sha256, config.zhHash);
const raw = read(source.path), zh = read(approvedZh.path);
assert.equal(raw.prose.length, config.objects);
assert.equal(raw.exercise_count, 0);
assert.equal(raw.figures.length, 0);
assert.equal(zh.status, 'ready');
assert.deepEqual(zh.source.data, raw);
const meter = read(`${ticket}/production-meter.json`);
const delivery = meter.deliveryBatches.find(batch => batch.id === config.batch);
assert.equal(delivery.status, 'complete-committed-pushed');
assert(delivery.cards.includes(card));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const gitHash = file => {
  const result = spawnSync('git', ['show', `${delivery.commit}:${path.relative(repo, file)}`], {
    cwd: repo, maxBuffer: 4 * 1024 * 1024,
  });
  assert.equal(result.status, 0, result.stderr?.toString());
  return hash(result.stdout);
};
const products = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
  .map(name => bind(`${book}/editions/modern-us-neutral/lessons/${card}/${name}`));
for (const file of [source, ...products]) assert.equal(file.sha256, gitHash(file.path));
const audit = products.find(file => file.path.endsWith('/adaptation.audit.json'));
assert.equal(read(audit.path).status, 'pass');
assert.equal(read(audit.path).sourceLessonSha256, source.sha256);
const pages = [...new Set(raw.prose.flatMap(block => block.source_refs)
  .map(ref => /^p(\d+)#/.exec(ref)?.[1]))];
assert(pages.length && pages.every(Boolean));
const sourcePages = pages.flatMap(page => ['json', 'md'].map(ext =>
  bind(`${book}/pages/${page}/page.${ext}`)));
for (const file of sourcePages) assert.equal(file.sha256, gitHash(file.path));
if (config.combinedCorrection || config.combinedNative || config.singleNative || config.finalizedCorrection || config.scopedNative || config.directScienceNative) {
  const binding = read(bindingFile), science = read(scienceFile);
  const nativeRow = binding.cards.find(row => (config.directScienceNative ? row.card : row.id) === card);
  assert(nativeRow);
  for (const key of ['lesson', 'audit', 'exercises', 'figures'])
    assert.equal(bind(`${repo}/${nativeRow[key].path}`).sha256, nativeRow[key].sha256);
  if (config.directScienceNative) {
    assert.equal(nativeRow.science.sha256, bind(scienceFile).sha256);
    assert.equal(science.lesson, card);
    assert.equal(science.bindings.source.sha256, source.sha256);
    assert.equal(nativeRow.lesson.sha256, approvedZh.sha256);
  } else if (config.scopedNative) {
    const scope = science.lessons.find(row => row.id === card);
    assert.equal(scope.status, 'pass');
    assert.equal(nativeRow.template.sha256, scope.bindings.template.sha256);
    assert.equal(nativeRow.source.sha256, scope.bindings.source.sha256);
    assert.equal(scope.bindings.source.sha256, source.sha256);
  } else if (config.singleNative) {
    assert.equal(science.lesson, card);
    assert.equal(nativeRow.reviewedTemplate.sha256, science.bindings.template.sha256);
    assert.equal(nativeRow.reviewedSource.sha256, science.bindings.source.sha256);
    assert.equal(nativeRow.reviewedSource.sha256, source.sha256);
  } else if (config.finalizedCorrection) {
    assert.equal(science.baseline_review.sha256,
      bind(`${ticket}/evidence/reports/${config.scienceOriginal}`).sha256);
    const scope = science.lessons.find(row => row.id === card);
    assert.equal(scope.status, 'pass');
    assert.equal(nativeRow.reviewedTemplate.sha256, scope.lesson.sha256);
    assert.equal(nativeRow.reviewedSource.sha256, scope.source.sha256);
    assert.equal(scope.source.sha256, source.sha256);
  } else if (config.combinedCorrection) {
    assert.equal(binding.scienceCorrection.sha256, bind(scienceFile).sha256);
    assert.equal(science.prior_review.sha256,
      bind(`${ticket}/evidence/reports/${config.scienceOriginal}`).sha256);
    const scope = science.lessons.find(row => row.id === card);
    assert.equal(scope.status, 'pass');
    assert.equal(scope.source.sha256, source.sha256);
    assert.equal(nativeRow.reviewedTemplate.sha256, scope.template.sha256);
  } else {
    assert(science.lessons.includes(card));
    assert.equal(nativeRow.reviewedTemplate.sha256, science.bindings[`${config.combinedNative}Template`].sha256);
    assert.equal(nativeRow.reviewedSource.sha256, science.bindings[`${config.combinedNative}Source`].sha256);
    assert.equal(nativeRow.reviewedSource.sha256, source.sha256);
  }
} else if (config.binding !== config.science) {
  const binding = read(bindingFile);
  assert.equal(binding.original_science_report.sha256, bind(scienceFile).sha256);
  assert.equal(binding.file_bindings.find(file => file.role === 'durable_edition').sha256,
    approvedZh.sha256);
} else {
  const inputs = read(scienceFile).input_bindings;
  assert.equal(inputs.find(input => input.role === 'normalized_durable_edition').sha256,
    approvedZh.sha256);
  assert.equal(inputs.find(input => input.role === 'original_source_binding_only').sha256,
    source.sha256);
}
assert(!fs.existsSync(`${book}/editions/modern-us-neutral-en/lessons/${card}`));
assert(!read(`${book}/editions/modern-us-neutral-en/book.json`).lessons.some(row => row.id === card));
const work = `${repo}/.tmp/STEMROBIN-181/d1816-${config.task.toLowerCase()}/work`;
const receipt = run(`${config.task.toLowerCase()}-${card.split('-').at(-1)}-first-missing-en-prepare`, [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`, 'adapt-prepare',
  '--book', '9p', '--edition', 'modern-us-neutral-en', '--lesson', card,
  '--root', path.dirname(book), '--work', work,
]);
const out = `${ticket}/tmp/d1816-${config.task.toLowerCase()}-${card.split('-').at(-1)}-first-missing-en`;
save(`${out}/prepared.json`, {
  task: config.task, card, work, firstEnglishPrepare: receipt,
  completeChineseHistoricalNative: audit, historicalZhScience: bind(scienceFile),
  historicalZhAuthorFreeze: bind(bindingFile), historicalZhScienceBinding: bind(bindingFile),
  historicalOriginalScience: config.scienceOriginal
    ? bind(`${ticket}/evidence/reports/${config.scienceOriginal}`) : null,
  historicalFigureGate: null, historicalChineseDelivery: delivery,
  historicalNativeEvidenceKind: 'retained native adaptation audit and byte-exact delivered products',
  approvedZh, source, sourcePages, productsReusedExactly: products,
  originalObjects: config.objects, originalTasks: 0, originalFigures: 0,
  existingFigureTupleInventory: [], newEnglishTuplesStillPending: false,
  originalSourceZhAndFigurePassReplayed: false,
  alreadyDeliveredAndCountedInHistoricalBatch: config.batch,
  englishCanonicalAndIndexAbsent: true, retainedEnglishRestorationNotAssumed: true,
  englishAuthorAndIndependentReview: 'pending', parentNewImages: 0,
  paidCalls: 0, databaseWrites: 0, newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ prepared: bind(`${out}/prepared.json`), objects: config.objects }));
