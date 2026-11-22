import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const configs = {
  'phy9-c1-s2-n10': {
    task: 'D1308', batch: 'D-005', objects: 9, figures: 2,
    noHistoricalScience: true, nextInventory: true,
    science: '9p-n10-science-review.json', figureGate: 'image-review-9p-n10.json',
    historicalScienceBindingGap: 'd1816-d1307-next-four-en-inventory/result.json',
    zhHash: 'c2a537f1714777e69884020b6ffb5f224db13fe049f2845fc7a03889d8cd4bbf',
    rawHash: '4efc2c697368e651bef6b781f09e1010bd6c1d959e17e3e980a139eadacdbc14',
  },
  'phy9-c1-s2-n15': {
    task: 'D1315', batch: 'D-004', objects: 14, figures: 1,
    noHistoricalScience: true, nextInventory: true,
    science: '9p-n15-science-review-f1-correction.json',
    scienceOriginal: '9p-n15-science-review.json', figureGate: 'image-review-9p-n15-fig22.json',
    historicalScienceBindingGap: 'd1816-d1307-next-four-en-inventory/result.json',
    zhHash: 'b6fe2f1eb6511d4f6384c710992e65b209f41c9af7f05b8f9b68ccb5b628bdb9',
    rawHash: '4337e595aae7796a3ea30cc6b42fc5640ec16547c00a3e18d80883cca408ac22',
  },
  'phy9-c1-s2-n18': {
    task: 'D1322', batch: 'D-007', objects: 14, figures: 1,
    noHistoricalScience: true, nextInventory: true,
    science: '9p-n17-n18-science-review.json', figureGate: 'image-review-9p-n18-fig25.json',
    historicalScienceBindingGap: 'd1816-d1307-next-four-en-inventory/result.json',
    zhHash: '24441d47e8099ca3736b269da3e59fd4e8a97861719ebdd29809e0ad3b37005b',
    rawHash: '21400ed555ac137a101853c9094591a2a6e1c0889aa4f76dbc5d6a72bcf27a88',
  },
  'phy9-c1-s2-n20': {
    task: 'D1329', batch: 'D-007', objects: 35, figures: 2,
    noHistoricalScience: true, nextInventory: true,
    science: '9p-n19-n20-science-review-f1-correction.json',
    scienceOriginal: '9p-n19-n20-science-review.json', figureGate: 'image-review-9p-n20-fig27.json',
    historicalScienceBindingGap: 'd1816-d1307-next-four-en-inventory/result.json',
    zhHash: 'a2b33f0d40fcd64160117b5a2dd467bc040fc137d0759a393a9e5002730aa809',
    rawHash: '0c99fdf6d774300bd770ff46480d00f0abd88bb23c11ffcf0bb2ee1512437b1f',
  },
  'phy9-c1-s1-n1': {
    task: 'D1274', batch: 'D-001', objects: 10, figures: 2,
    noHistoricalScience: true, generatedInventory: true,
    figureGate: 'image-review-9p-batch1-final.json',
    historicalScienceBindingGap: 'd1816-d1272-next-three-en-inventory/result.json',
    zhHash: '5699f908b05a6079e9a1aa60cc72f923289e596da93ad8aea90d537483567d0e',
    rawHash: '7e0fa6f53c354177d4defe332d40838aae133fa0cb3874c6517efef611c44fe5',
  },
  'phy9-c1-s1-n2': {
    task: 'D1281', batch: 'D-001', objects: 13, figures: 1,
    noHistoricalScience: true, generatedInventory: true,
    figureGate: 'image-review-9p-batch1-final.json',
    historicalScienceBindingGap: 'd1816-d1272-next-three-en-inventory/result.json',
    zhHash: '494d8e0fa17638dabfc3b87eefcb6e6ca6b6793bd692bd3f2c45b82bbeb039ae',
    rawHash: '17f7589a48bc25eb8348dc198965b7489257908bc8e8ddb7069449e61cae2b52',
  },
  'phy9-c1-s1-n3': {
    task: 'D1288', batch: 'D-001', objects: 13, figures: 1,
    noHistoricalScience: true, generatedInventory: true,
    figureGate: 'image-review-9p-batch1-final.json',
    historicalScienceBindingGap: 'd1816-d1272-next-three-en-inventory/result.json',
    zhHash: '87993d4c9e4549281cfd5df5f75c43d64eefaee9e97e3196e80fdf69d5b35da1',
    rawHash: 'ae15583c381e2e5a8ba0a0ed684df6e0efe2c9cebaf23468acf12411ff5dd1ba',
  },
  'phy9-c2-s4-n97': {
    task: 'D1263', batch: 'D-024', objects: 7, noHistoricalScience: true,
    historicalScienceBindingGap: 'd1816-d983-n97-history-gap/inventory-gap.json',
    zhHash: 'a7b934b3dc18cd4fa7df30fdbdd435b6fd0f213ececad84efe5bc076cfddb67a',
    rawHash: 'b16968c3629da28849c511c7e7ba82a8ee08cfdd4e19ce5f5e52a96d85067804',
  },
  'phy9-c1-s1-n4': {
    task: 'D1234', batch: 'D-001', objects: 4, noHistoricalScience: true,
    zhHash: 'fe92134a3391fcadc6cad054edae959dac4922e065e938bb6a91a9fcd9bf9940',
    rawHash: 'c4587104f856c06f9565d85249619a3747ba170fb1405b9e3138bf377389ed66',
  },
  'phy9-c1-s2-n16': {
    task: 'D1236', batch: 'D-004', objects: 4, noHistoricalScience: true,
    science: '9p-n16-science-review.json',
    historicalScienceBindingGap: 'd1816-d1233-n16-delivered-science-binding/result.gap-confirmed.json',
    zhHash: 'a88f6c550662f54eec030a36a1726552ff011f84e4970f8ce0d36a71f0ec30b6',
    rawHash: 'd3fb6a87ab2e9234af1fddfeb813ddb7f0923c06ddf95d446cec9afacb613eb2',
  },
  'phy9-c1-s1-n7': {
    task: 'D1246', batch: 'D-002', objects: 6, figures: 1,
    science: '9p-n7-science-review-final.json', binding: '9p-n7-science-review-final.json',
    acceptedInventory: true,
    figureGateAbsolute: `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/figures/fig-04.context-binding-independent-review.json`,
    zhHash: '274def6797db6c8842fbd8c7171b56a7e49ff7889639c37e5b9350f6d25b7551',
    rawHash: 'f577ac9489642115be251eb96149df4e892cc1a66b9af64356eb0debe620bacd',
  },
  'phy9-c1-s6-n49': {
    task: 'D1248', batch: 'D-014', objects: 7, figures: 1,
    science: '9p-n49-science-review.json', binding: 'd014-finalization-binding.json',
    acceptedInventory: true, figureGate: '9p-n49-figure-review.json',
    zhHash: '5139a9f89de45e2b5118bbc0683f3b81a049be0edddcf84d595186e94b157dba',
    rawHash: '3facfa8fd223b66af0d09572fe48d74770f8ae95febceb6316d5faef05c5ba16',
  },
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
  'phy9-c1-s7-n56': {
    task: 'D1135', batch: 'D-016', objects: 9, figures: 1,
    science: '9p-n56-science-review.json', binding: 'd016-finalization-binding.json',
    directScienceNative: true, figureGate: '9p-n56-figure-review.json',
    zhHash: '31e3a1aa991ca3ec176f4212eac85c0f54e7a4b578342fabd66c289729491c3c',
    rawHash: 'ca0b8c425ba63098eda86e7d558912eb14f961e2e900fb636e71344649a9eb8f',
  },
  'phy9-c1-s7-n57': {
    task: 'D1137', batch: 'D-016', objects: 27, figures: 1,
    science: '9p-n57-science-review.json', binding: 'd016-finalization-binding.json',
    directScienceNative: true, figureGate: '9p-n57-figure-review.json',
    zhHash: '43e67b7e0910d0404c4774f2e9ae513ec10c4aea42d626759a9c5619f1a2d17d',
    rawHash: '73756bbcaad361366b832d78fa2f75e493b58a8f1c3390d13f0ff598f42e02bf',
  },
  'phy10-c1-s2-n5': {
    book: '10p', task: 'D1150', batch: 'D-025', objects: 10,
    science: 'd025-10p-n5-science-review.json', binding: 'd025-finalization-binding.json',
    durableScienceInputs: true,
    zhHash: 'acc499febd7133544a0d1a58dad8aba3e3a9e369952a190dc3af769794c17e6e',
    rawHash: 'ee7b3ee1b3f19499309530a070d2f107936067026a289dc7e9386e756969c11a',
  },
  'phy10-c1-s2-n10': {
    book: '10p', task: 'D1157', batch: 'D-004', objects: 10,
    science: '10p-n10-science-review.json',
    binding: '../../tmp/d1816-d1156-n10-delivered-science-binding/result.json',
    statusOnlyScienceBinding: true,
    zhHash: 'dabf6998d602388a7798014649c9889308983fb00469dc67d6ef85b2676e6985',
    rawHash: 'c838db724c05e24fb87b66f15ee5f256706f8accda8a703cdfcb6b9725a3c89e',
  },
  'phy10-c1-s2-n9': {
    book: '10p', task: 'D1176', batch: 'D-005', objects: 8, figures: 1,
    science: '10p-n9-n13-science-review-layout.json',
    binding: '../../tmp/d1816-d1175-n9-delivered-science-binding/result.json',
    figureGate: '../../tmp/d1816-d1175-n9-delivered-science-binding/result.json',
    statusOnlyScienceBinding: true, hashesFromBinding: true,
  },
  'phy10-c1-s2-n15': {
    book: '10p', task: 'D1178', batch: 'D-006', objects: 11, figures: 2,
    science: '10p-n15-n16-science-review-caption-binding.json',
    binding: '../../tmp/d1816-d1177-n15-delivered-science-binding/result.json',
    figureGate: '../../tmp/d1816-d1177-n15-delivered-science-binding/result.json',
    statusOnlyScienceBinding: true, hashesFromBinding: true,
  },
};
const card = process.argv[2], config = configs[card];
assert(config);
const bookId = config.book || '9p';
assert(card.startsWith(`phy${bookId.slice(0, -1)}-`));
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/${bookId}`;
const scienceFile = `${ticket}/evidence/reports/${config.science}`;
const bindingFile = `${ticket}/evidence/reports/${config.binding}`;
if (!config.noHistoricalScience) {
  assert.equal(read(scienceFile).status, 'pass');
  assert.equal(read(bindingFile).status, 'pass');
}
const source = bind(`${book}/lessons/${card}/lesson.json`);
const approvedZh = bind(`${book}/editions/modern-us-neutral/lessons/${card}/lesson.json`);
assert.equal(source.sha256, config.hashesFromBinding ? read(bindingFile).source.sha256 : config.rawHash);
assert.equal(approvedZh.sha256, config.hashesFromBinding ? read(bindingFile).approvedZh.sha256 : config.zhHash);
const raw = read(source.path), zh = read(approvedZh.path);
assert.equal(raw.prose.length, config.objects);
assert.equal(raw.exercise_count, 0);
assert.equal(raw.figures.length, config.figures || 0);
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
let acceptedInventory, generatedInventory, nextInventory;
if (config.nextInventory) {
  const file = `${ticket}/tmp/d1816-d1307-next-four-en-inventory/result.json`;
  assert.equal(bind(file).sha256, 'a82ba906d1f347c9e88b000f737bd9b576387a10019fcfe06e1dfb5f8abe821a');
  nextInventory = read(file);
  const candidate = nextInventory.candidates.find(row => row.card === card);
  assert(candidate && !candidate.genuinelyHeld);
  assert.equal(candidate.rawSource.sha256, source.sha256);
  assert.equal(candidate.chineseProducts.sha256ByFile['lesson.json'], approvedZh.sha256);
  assert.equal(nextInventory.historicalDeliveries[config.batch].commitRecorded, delivery.commit);
  assert.equal(candidate.science.sha256, bind(scienceFile).sha256);
  for (const product of products)
    assert.equal(candidate.chineseProducts.sha256ByFile[path.basename(product.path)], product.sha256);
} else if (config.generatedInventory) {
  const file = `${ticket}/tmp/d1816-d1272-next-three-en-inventory/result.json`;
  assert.equal(bind(file).sha256, '52205bf20aca5b560af1ed4712b0a629523804af0def9b29574040c9ea78d89b');
  generatedInventory = read(file);
  const candidate = generatedInventory.candidates.find(row => row.card === card);
  assert(candidate && !candidate.genuinelyHeld);
  assert.equal(candidate.source.sha256, source.sha256);
  assert.equal(candidate.zhProductHashes['lesson.json'], approvedZh.sha256);
  assert.equal(generatedInventory.historicalDeliveries[config.batch].commitRecorded, delivery.commit);
  for (const product of products)
    assert.equal(candidate.zhProductHashes[path.basename(product.path)], product.sha256);
} else if (config.acceptedInventory) {
  const file = `${ticket}/tmp/d1816-d1245-next-two-en-inventory/result.json`;
  const inventory = read(file);
  acceptedInventory = inventory.candidates.find(row => row.card === card);
  assert(acceptedInventory && !acceptedInventory.genuinelyHeld);
  assert.equal(acceptedInventory.source.sha256, source.sha256);
  assert.equal(acceptedInventory.approvedZh.sha256, approvedZh.sha256);
  assert.equal(acceptedInventory.independentScience.sha256, bind(scienceFile).sha256);
  assert.equal(acceptedInventory.historicalCompleteDelivery.commit, delivery.commit);
  assert.equal(acceptedInventory.historicalCompleteDelivery.currentSourceAndFourZhProductsMatchCommit, true);
  assert.equal(acceptedInventory.figure.currentSourceSpecRenderSvgReviewBindingsMatch, true);
} else if (config.noHistoricalScience) {
  assert.equal(config.figures || 0, 0);
} else if (config.statusOnlyScienceBinding) {
  const binding = read(bindingFile);
  assert.equal(binding.card, card);
  assert.equal(binding.science.sha256, bind(scienceFile).sha256);
  assert.equal(binding.source.sha256, source.sha256);
  assert.equal(binding.approvedZh.sha256, approvedZh.sha256);
  assert.equal(binding.allReviewedContentAndMetadataOutsideStatusByteExact, true);
  for (const product of products)
    assert.equal(binding.products.find(file => file.path === product.path).sha256, product.sha256);
} else if (config.durableScienceInputs) {
  const science = read(scienceFile), binding = read(bindingFile);
  const nativeRow = binding.cards.find(row => row.card === card && row.book === bookId);
  assert(nativeRow);
  assert.equal(nativeRow.science.sha256, bind(scienceFile).sha256);
  assert.equal(science.inputs.sourceLesson.sha256, source.sha256);
  assert.equal(science.inputs.modernLesson.sha256, approvedZh.sha256);
  for (const product of products) {
    assert.equal(nativeRow.outputs.find(file => `${repo}/${file.path}` === product.path).sha256,
      product.sha256);
  }
} else if (config.combinedCorrection || config.combinedNative || config.singleNative || config.finalizedCorrection || config.scopedNative || config.directScienceNative) {
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
    if (config.figureGate)
      assert.equal(nativeRow.figureReview.sha256,
        bind(`${ticket}/evidence/reports/${config.figureGate}`).sha256);
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
const figureGate = config.figureGateAbsolute ? bind(config.figureGateAbsolute)
  : config.figureGate ? bind(`${ticket}/evidence/reports/${config.figureGate}`) : null;
const figureInventory = read(`${book}/editions/modern-us-neutral/lessons/${card}/figures.json`)
  .figures.map(figure => {
    if (nextInventory) {
      const observed = nextInventory.figureTuples.find(row => row.card === card && row.id === figure.id);
      assert(observed && observed.actualSourceSpecOutputIndependentAndNativeHashesMatch);
      const mode = observed.mode;
      assert(['deterministic', 'generated'].includes(mode));
      const keys = mode === 'generated' ? ['spec', 'png', 'generation', 'review']
        : ['spec', 'svg', 'render', 'review'];
      const files = Object.fromEntries(keys.map(key =>
        [key, bind(`${book}/editions/modern-us-neutral/${figure[key]}`)]));
      for (const file of Object.values(files))
        assert.equal(observed.sha256ByFile[path.relative(`${book}/editions/modern-us-neutral`, file.path)], file.sha256);
      const spec = read(files.spec.path), review = read(files.review.path);
      assert.equal(spec.mode, mode);
      assert.equal(review.status, 'pass');
      assert.equal(review.spec.sha256, files.spec.sha256);
      const sourceImage = bind(`${book}/${observed.source.path}`);
      assert.equal(sourceImage.sha256, observed.source.sha256);
      assert.equal(spec.source.image.sha256, sourceImage.sha256);
      assert.equal(review.source.sha256, sourceImage.sha256);
      const media = mode === 'generated' ? 'png' : 'svg';
      assert.equal(review.outputs[media].sha256, files[media].sha256);
      if (mode === 'generated') {
        assert.equal(review.generation.sha256, files.generation.sha256);
        assert.equal(read(files.generation.path).output.sha256, files.png.sha256);
      } else {
        const render = read(files.render.path);
        assert.equal(review.render.sha256, files.render.sha256);
        assert.equal(render.status, 'pass');
        assert.equal(render.output.svg.sha256, files.svg.sha256);
      }
      const independent = bind(`${book}/editions/modern-us-neutral/figures/${figure.id}.independent-review.json`);
      assert.equal(independent.sha256, observed.sha256ByFile[`figures/${figure.id}.independent-review.json`]);
      const approval = read(independent.path);
      assert.equal(approval.status, 'pass');
      assert.equal(approval.id ?? approval.figure, figure.id);
      const sourceFigureGate = bind(`${ticket}/evidence/reports/${observed.originalGate.path}`);
      assert.equal(sourceFigureGate.sha256, observed.originalGate.sha256);
      assert.equal(approval.originalReport.sha256, sourceFigureGate.sha256);
      assert.equal(approval.source?.sha256 ?? approval.bindings.source.sha256, sourceImage.sha256);
      assert.equal(approval.spec?.sha256 ?? approval.bindings.spec.sha256, files.spec.sha256);
      assert.equal(approval.outputs?.[media]?.sha256 ?? approval.bindings[media].sha256, files[media].sha256);
      return { id: figure.id, mode, files, sourceImage, existingReviewStatus: review.status,
        sourceFigureGate, independentFigureReview: independent, inventoryOnly: true,
        declaredHistoricalSourceImage: spec.source.image,
        receivedInventory: bind(`${ticket}/tmp/d1816-d1307-next-four-en-inventory/result.json`),
        originalSourceSpecAndMediaBytesUnchanged: true,
        newEnglishTupleOrFigureApprovalCreated: false };
    }
    if (config.generatedInventory) {
      const files = Object.fromEntries(['spec', 'png', 'generation', 'review'].map(key =>
        [key, bind(`${book}/editions/modern-us-neutral/${figure[key]}`)]));
      const spec = read(files.spec.path), review = read(files.review.path);
      assert.equal(spec.mode, 'generated');
      assert.equal(review.status, 'pass');
      assert.equal(review.spec.sha256, files.spec.sha256);
      assert.equal(review.generation.sha256, files.generation.sha256);
      assert.equal(review.outputs.png.sha256, files.png.sha256);
      assert.equal(bind(path.resolve(repo, spec.source.image.path)).sha256, spec.source.image.sha256);
      assert.equal(read(files.generation.path).output.sha256, files.png.sha256);
      assert(figureGate);
      const independent = bind(`${book}/editions/modern-us-neutral/figures/${figure.id}.independent-review.json`);
      const approval = read(independent.path);
      assert.equal(approval.status, 'pass');
      assert.equal(approval.originalReportSha256, figureGate.sha256);
      assert.equal(approval.specSha256, files.spec.sha256);
      assert.equal(approval.outputSha256, files.png.sha256);
      const observed = generatedInventory['9pFigureTuples'].find(row => row.id === figure.id);
      assert(observed);
      for (const [key, file] of Object.entries(files))
        assert.equal(observed[key === 'review' ? 'nativeReviewSha256' : `${key}Sha256`], file.sha256);
      assert.equal(observed.independentReviewSha256, independent.sha256);
      return { id: figure.id, mode: 'generated', files, existingReviewStatus: review.status,
        sourceFigureGate: figureGate, independentFigureReview: independent, inventoryOnly: true,
        newEnglishTupleOrFigureApprovalCreated: false };
    }
    const files = Object.fromEntries(['spec', 'svg', 'render', 'review'].map(key =>
      [key, bind(`${book}/editions/modern-us-neutral/${figure[key]}`)]));
    const review = read(files.review.path), render = read(files.render.path);
    assert.equal(review.status, 'pass');
    assert.equal(render.status, 'pass');
    assert.equal(review.spec.sha256, files.spec.sha256);
    assert.equal(review.render.sha256, files.render.sha256);
    assert.equal(review.outputs.svg.sha256, files.svg.sha256);
    assert.equal(render.output.svg.sha256, files.svg.sha256);
    assert(figureGate);
    const gate = read(figureGate.path);
    assert.equal(gate.status, 'pass');
    if (acceptedInventory) {
      assert.equal(acceptedInventory.figure.id, figure.id);
      for (const [key, file] of Object.entries(files))
        assert.equal(acceptedInventory.figure[key].sha256, file.sha256);
      assert(acceptedInventory.figure.exactFigureFidelityGate.some(file => file.sha256 === figureGate.sha256));
    } else {
      const approved = gate.figures.find(item => item.id === figure.id);
      assert.equal(approved.status, 'pass');
      assert.equal(approved.bindings.svg.sha256, files.svg.sha256);
    }
    const spec = read(files.spec.path);
    assert.equal(spec.mode, 'deterministic');
    assert(figure.mode === undefined || figure.mode === spec.mode);
    assert.equal(bind(path.resolve(repo, spec.source.image.path)).sha256, spec.source.image.sha256);
    return { id: figure.id, files, existingReviewStatus: review.status,
      sourceFigureGate: figureGate, inventoryOnly: true,
      newEnglishTupleOrFigureApprovalCreated: false };
  });
assert.equal(figureInventory.length, config.figures || 0);
assert(!fs.existsSync(`${book}/editions/modern-us-neutral-en/lessons/${card}`));
assert(!read(`${book}/editions/modern-us-neutral-en/book.json`).lessons.some(row => row.id === card));
const work = `${repo}/.tmp/STEMROBIN-181/d1816-${config.task.toLowerCase()}/work`;
const receipt = run(`${config.task.toLowerCase()}-${card.split('-').at(-1)}-first-missing-en-prepare`, [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`, 'adapt-prepare',
  '--book', bookId, '--edition', 'modern-us-neutral-en', '--lesson', card,
  '--root', path.dirname(book), '--work', work,
]);
const out = `${ticket}/tmp/d1816-${config.task.toLowerCase()}-${card.split('-').at(-1)}-first-missing-en`;
save(`${out}/prepared.json`, {
  task: config.task, book: bookId, card, work, firstEnglishPrepare: receipt,
  completeChineseHistoricalNative: audit,
  historicalZhScience: config.noHistoricalScience ? null : bind(scienceFile),
  historicalZhAuthorFreeze: config.noHistoricalScience ? null : bind(bindingFile),
  historicalZhScienceBinding: config.noHistoricalScience ? null : bind(bindingFile),
  historicalScienceApprovalAssumed: false,
  firstEnglishScienceFidelityReviewRequired: true,
  retainedUnboundHistoricalScience: config.noHistoricalScience && config.science ? bind(scienceFile) : null,
  historicalScienceBindingGap: config.historicalScienceBindingGap
    ? bind(`${ticket}/tmp/${config.historicalScienceBindingGap}`) : null,
  receivedHistoricalEvidenceInventory: generatedInventory
    ? bind(`${ticket}/tmp/d1816-d1272-next-three-en-inventory/result.json`)
    : acceptedInventory ? bind(`${ticket}/tmp/d1816-d1245-next-two-en-inventory/result.json`)
    : nextInventory ? bind(`${ticket}/tmp/d1816-d1307-next-four-en-inventory/result.json`) : null,
  historicalOriginalScience: config.scienceOriginal
    ? bind(`${ticket}/evidence/reports/${config.scienceOriginal}`) : null,
  historicalFigureGate: figureGate, historicalChineseDelivery: delivery,
  historicalNativeEvidenceKind: 'retained native adaptation audit and byte-exact delivered products',
  approvedZh, source, sourcePages, productsReusedExactly: products,
  originalObjects: config.objects, originalTasks: 0, originalFigures: config.figures || 0,
  existingFigureTupleInventory: figureInventory, newEnglishTuplesStillPending: figureInventory.length > 0,
  originalSourceZhAndFigurePassReplayed: false,
  alreadyDeliveredAndCountedInHistoricalBatch: config.batch,
  englishCanonicalAndIndexAbsent: true, retainedEnglishRestorationNotAssumed: true,
  englishAuthorAndIndependentReview: 'pending', parentNewImages: 0,
  paidCalls: 0, databaseWrites: 0, newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ prepared: bind(`${out}/prepared.json`), objects: config.objects }));
