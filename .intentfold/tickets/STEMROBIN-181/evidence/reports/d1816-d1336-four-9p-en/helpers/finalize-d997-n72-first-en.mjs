import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const [reviewPath, reviewHash, requestedCard = 'phy9-c2-s2-n72'] = process.argv.slice(2);
assert.equal(bind(reviewPath).sha256, reviewHash);
assert.equal(read(reviewPath).status ?? read(reviewPath).result, 'PASS');
const configurations = {
  'phy9-c1-s2-n10': { task: 'D1311', directory: 'd1816-d1311-n10-first-en-native',
    prepare: 'd1816-d1308-n10-first-missing-en', author: 'd1816-d1343-n10-two-readability-recovery',
    status: 'AFFECTED_ONLY_TWO_N10_READABILITY_FINDINGS_AUTHOR_PASS', objects: 9, figures: 2,
    nextFourAdapter: true, contextProjection: 'title-nonfig', contextRows: 8, whitespaceContext: true },
  'phy9-c1-s2-n15': { task: 'D1318', directory: 'd1816-d1318-n15-first-en-native',
    prepare: 'd1816-d1315-n15-first-missing-en', author: 'd1816-d1346-n15-readability',
    status: 'AFFECTED_ONLY_THERMAL_READABILITY_FINDINGS_AUTHOR_PASS', objects: 14, figures: 1,
    nextFourAdapter: true, contextProjection: 'grouped-printed-nonfig', contextRows: 1, whitespaceContext: true },
  'phy9-c1-s2-n18': { task: 'D1325', directory: 'd1816-d1325-n18-first-en-native',
    prepare: 'd1816-d1322-n18-first-missing-en', author: 'd1816-d1345-n18-readability',
    status: 'AFFECTED_ONLY_THERMAL_READABILITY_FINDINGS_AUTHOR_PASS', objects: 14, figures: 1,
    nextFourAdapter: true, contextProjection: 'grouped-all', contextRows: 1 },
  'phy9-c1-s2-n20': { task: 'D1332', directory: 'd1816-d1332-n20-first-en-native',
    prepare: 'd1816-d1329-n20-first-missing-en', author: 'd1816-d1347-n20-readability',
    status: 'AFFECTED_ONLY_THERMAL_READABILITY_FINDINGS_AUTHOR_PASS', objects: 35, figures: 2,
    nextFourAdapter: true, contextProjection: 'nonfig', contextRows: 33, englishMaxWidthPx: 640 },
  'phy9-c1-s1-n1': { task: 'D1306', directory: 'd1816-d1306-n1-source-label-native-recovery',
    prepare: 'd1816-d1274-n1-first-missing-en', author: 'd1816-d1304-n1-source-figure-labels',
    status: 'AFFECTED_ONLY_UNNUMBERED_SOURCE_LABELS_NATIVE_PASS', objects: 10, figures: 2, generatedPng: true },
  'phy9-c1-s1-n2': { task: 'D1284', directory: 'd1816-d1284-n2-first-en-native',
    prepare: 'd1816-d1281-n2-first-missing-en', author: 'd1816-d1305-n2-source-figure-labels',
    status: 'AFFECTED_ONLY_UNNUMBERED_SOURCE_LABELS_NATIVE_PASS', objects: 13, figures: 1, generatedPng: true },
  'phy9-c1-s1-n3': { task: 'D1303', directory: 'd1816-d1303-n3-caption-label-native-recovery',
    prepare: 'd1816-d1288-n3-first-missing-en', author: 'd1816-d1302-n3-caption-label',
    status: 'AFFECTED_ONLY_N3_CAPTION_LABEL_NATIVE_PASS',
    objects: 13, figures: 1, generatedPng: true },
  'phy9-c2-s4-n97': { task: 'D1267', directory: 'd1816-d1267-n97-first-en-native',
    prepare: 'd1816-d1263-n97-first-missing-en', author: 'd1816-d1271-n97-two-findings',
    status: 'AFFECTED_ONLY_TWO_N97_TEXT_FINDINGS_AUTHOR_PASS', objects: 7, figures: 0 },
  'phy9-c1-s1-n4': { task: 'D1239', directory: 'd1816-d1239-n4-first-en-native',
    prepare: 'd1816-d1234-n4-first-missing-en', author: 'd1816-d1235-n4-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 4, figures: 0 },
  'phy9-c1-s2-n16': { task: 'D1240', directory: 'd1816-d1240-n16-first-en-native',
    prepare: 'd1816-d1236-n16-first-missing-en', author: 'd1816-d1237-n16-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 4, figures: 0 },
  'phy9-c1-s1-n7': { task: 'D1251', directory: 'd1816-d1251-n7-first-en-native',
    prepare: 'd1816-d1246-n7-first-missing-en', author: 'd1816-d1247-n7-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 6, figures: 1, titleContext: true },
  'phy9-c1-s6-n49': { task: 'D1252', directory: 'd1816-d1252-n49-first-en-native',
    prepare: 'd1816-d1248-n49-first-missing-en', author: 'd1816-d1265-n49-source-chapter',
    status: 'AFFECTED_ONLY_SOURCE_CHAPTER_IDENTITY_AUTHOR_PASS', objects: 7, figures: 1, groupedContext: true },
  'phy10-c1-s2-n2': { book: '10p', task: 'D1220', directory: 'd1816-d1220-n2-first-en-native',
    prepare: 'd1816-d1217-n2-first-missing-en', author: 'd1816-d1225-n2-horizontal-referent',
    status: 'AFFECTED_ONLY_ONE_HORIZONTAL_SPRING_REFERENT_NATIVE_PASS', objects: 15, figures: 3,
    sharedLessonContext: true, inheritSharedEnglishContext: true,
    sharedContextNonfig: true, groupedContextRecovery: true },
  'phy9-c2-s2-n72': { task: 'D997', directory: 'd1816-d997-n72-first-en-native',
    prepare: 'd1816-d993-n72-first-missing-en', author: 'd1816-d995-n72-label-identity',
    status: 'AFFECTED_ONLY_EIGHT_MACHINE_LABEL_IDENTITIES_PASS', objects: 13, figures: 4 },
  'phy9-c2-s2-n73': { task: 'D1007', directory: 'd1816-d1007-n73-first-en-native',
    prepare: 'd1816-d1002-n73-first-missing-en', author: 'd1816-d1012-n73-two-review-findings',
    status: 'AFFECTED_ONLY_TWO_INDEPENDENT_EN_WORDING_FINDINGS_NATIVE_PASS', objects: 22, figures: 2 },
  'phy9-c2-s2-n64': { task: 'D1017', directory: 'd1816-d1017-n64-first-en-native',
    prepare: 'd1816-d1013-n64-first-missing-en', author: 'd1816-d1019-n64-unchanged-block-metadata',
    status: 'AFFECTED_ONLY_SEVEN_UNCHANGED_BLOCK_METADATA_NATIVE_PASS', objects: 42, figures: 2,
    groupedContextRecovery: true },
  'phy9-c2-s2-n81': { task: 'D1029', directory: 'd1816-d1029-n81-first-en-native',
    prepare: 'd1816-d1025-n81-first-missing-en', author: 'd1816-d1027-n81-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 17, figures: 1,
    proseOnlyContext: true },
  'phy9-c2-s3-n89': { task: 'D1037', directory: 'd1816-d1037-n89-first-en-native',
    prepare: 'd1816-d1034-n89-first-missing-en', author: 'd1816-d1040-n89-two-readability-findings',
    status: 'AFFECTED_ONLY_TWO_INDEPENDENT_EN_READABILITY_FINDINGS_NATIVE_PASS', objects: 4, figures: 0 },
  'phy9-c2-s4-n105': { task: 'D1043', directory: 'd1816-d1043-n105-first-en-native',
    prepare: 'd1816-d1041-n105-first-missing-en', author: 'd1816-d1042-n105-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 9, figures: 0 },
  'phy9-c2-s2-n61': { task: 'D1056', directory: 'd1816-d1056-n61-first-en-native',
    prepare: 'd1816-d1054-n61-first-missing-en', author: 'd1816-d1055-n61-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 6, figures: 0 },
  'phy9-c1-s1-n6': { task: 'D1070', directory: 'd1816-d1070-n6-first-en-native',
    prepare: 'd1816-d1067-n6-first-missing-en', author: 'd1816-d1080-n6-two-flow-findings',
    status: 'AFFECTED_ONLY_TWO_INDEPENDENT_EN_FLOW_FINDINGS_NATIVE_PASS', objects: 19, figures: 0 },
  'phy9-c1-s2-n13': { task: 'D1074', directory: 'd1816-d1074-n13-first-en-native',
    prepare: 'd1816-d1072-n13-first-missing-en', author: 'd1816-d1073-n13-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 5, figures: 0 },
  'phy9-c1-s2-n27': { task: 'D1090', directory: 'd1816-d1090-n27-first-en-native',
    prepare: 'd1816-d1081-n27-first-missing-en', author: 'd1816-d1082-n27-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 9, figures: 0 },
  'phy9-c1-s2-n28': { task: 'D1092', directory: 'd1816-d1092-n28-first-en-native',
    prepare: 'd1816-d1083-n28-first-missing-en', author: 'd1816-d1084-n28-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 17, figures: 0 },
  'phy9-c1-s3-n30': { task: 'D1094', directory: 'd1816-d1094-n30-first-en-native',
    prepare: 'd1816-d1085-n30-first-missing-en', author: 'd1816-d1123-n30-interaction-effects',
    status: 'AFFECTED_ONLY_ONE_INTERACTION_EFFECTS_PHRASE_NATIVE_PASS', objects: 5, figures: 0 },
  'phy9-c1-s3-n31': { task: 'D1096', directory: 'd1816-d1096-n31-first-en-native',
    prepare: 'd1816-d1087-n31-first-missing-en', author: 'd1816-d1088-n31-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 17, figures: 0 },
  'phy9-c1-s3-n33': { task: 'D1112', directory: 'd1816-d1112-n33-first-en-native',
    prepare: 'd1816-d1104-n33-first-missing-en', author: 'd1816-d1105-n33-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 12, figures: 0 },
  'phy9-c1-s3-n36': { task: 'D1114', directory: 'd1816-d1114-n36-first-en-native',
    prepare: 'd1816-d1106-n36-first-missing-en', author: 'd1816-d1111-n36-three-citation-identities',
    status: 'AFFECTED_ONLY_THREE_BARE_SECTION_CITATION_IDENTITIES_NATIVE_PASS', objects: 18, figures: 0 },
  'phy9-c1-s4-n37': { task: 'D1116', directory: 'd1816-d1116-n37-first-en-native',
    prepare: 'd1816-d1108-n37-first-missing-en', author: 'd1816-d1109-n37-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 15, figures: 0 },
  'phy9-c1-s5-n45': { task: 'D1126', directory: 'd1816-d1126-n45-first-en-native',
    prepare: 'd1816-d1124-n45-first-missing-en', author: 'd1816-d1125-n45-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 10, figures: 0 },
  'phy9-c1-s6-n54': { task: 'D1132', directory: 'd1816-d1132-n54-first-en-native',
    prepare: 'd1816-d1129-n54-first-missing-en', author: 'd1816-d1153-n54-equation-lead-in',
    status: 'AFFECTED_ONLY_ONE_EQUATION_LEAD_IN_NATIVE_PASS', objects: 38, figures: 0 },
  'phy9-c1-s7-n56': { task: 'D1140', directory: 'd1816-d1140-n56-first-en-native',
    prepare: 'd1816-d1135-n56-first-missing-en', author: 'd1816-d1136-n56-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 9, figures: 1,
    groupedContextRecovery: true },
  'phy9-c1-s7-n57': { task: 'D1144', directory: 'd1816-d1144-n57-first-en-native',
    prepare: 'd1816-d1137-n57-first-missing-en', author: 'd1816-d1139-n57-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 27, figures: 1,
    groupedContextRecovery: true },
  'phy10-c1-s2-n5': { book: '10p', task: 'D1161', directory: 'd1816-d1161-n5-first-en-native',
    prepare: 'd1816-d1150-n5-first-missing-en', author: 'd1816-d1152-n5-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 10, figures: 0 },
  'phy10-c1-s2-n10': { book: '10p', task: 'D1164', directory: 'd1816-d1164-n10-first-en-native',
    prepare: 'd1816-d1157-n10-first-missing-en', author: 'd1816-d1158-n10-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 10, figures: 0 },
  'phy10-c1-s2-n9': { book: '10p', task: 'D1183', directory: 'd1816-d1183-n9-first-en-native',
    prepare: 'd1816-d1176-n9-first-missing-en', author: 'd1816-d1193-n9-turning-point-sentence',
    status: 'AFFECTED_ONLY_ONE_TURNING_POINT_SENTENCE_NATIVE_PASS', objects: 8, figures: 1,
    groupedContext: true, groupedContextNonfig: true },
  'phy10-c1-s2-n15': { book: '10p', task: 'D1184', directory: 'd1816-d1184-n15-first-en-native',
    prepare: 'd1816-d1178-n15-first-missing-en', author: 'd1816-d1180-n15-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 11, figures: 2,
    groupedContext: true },
  'phy10-c1-s2-n4': { book: '10p', task: 'D1204', directory: 'd1816-d1204-n4-first-en-native',
    prepare: 'd1816-d1202-n4-first-missing-en', author: 'd1816-d1203-n4-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 6, figures: 1,
    sharedLessonContext: true, sharedManifest: true },
  'phy10-c1-s2-n1': { book: '10p', task: 'D1209', directory: 'd1816-d1209-n1-first-en-native',
    prepare: 'd1816-d1207-n1-first-missing-en', author: 'd1816-d1208-n1-first-missing-en',
    status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', objects: 16, figures: 2,
    proseOnlyContext: true },
};
const config = configurations[requestedCard];
assert(config);
const card = requestedCard, edition = 'modern-us-neutral-en';
const bookId = config.book || '9p';
assert(card.startsWith(`phy${bookId.slice(0, -1)}-`));
const preparedPath = `${ticket}/tmp/${config.prepare}/prepared.json`;
const authoredPath = `${ticket}/tmp/${config.author}/authored.json`;
const prepared = read(preparedPath), authored = read(authoredPath);
const inventoryHash = 'a82ba906d1f347c9e88b000f737bd9b576387a10019fcfe06e1dfb5f8abe821a';
const adapterInventory = config.nextFourAdapter ? read(prepared.receivedHistoricalEvidenceInventory.path) : null;
if (config.nextFourAdapter) {
  assert.equal(prepared.receivedHistoricalEvidenceInventory.sha256, inventoryHash);
  assert.equal(bind(prepared.receivedHistoricalEvidenceInventory.path).sha256, inventoryHash);
  assert.equal(prepared.historicalScienceApprovalAssumed, false);
  assert.equal(prepared.firstEnglishScienceFidelityReviewRequired, true);
}
assert.equal(authored.status, config.status);
assert(JSON.stringify(read(reviewPath)).includes(authored.englishDraft.sha256));
assert.equal(bind(authored.englishDraft.path).sha256, authored.englishDraft.sha256);
for (const file of [prepared.source, ...prepared.sourcePages, ...prepared.productsReusedExactly])
  assert.equal(bind(file.path).sha256, file.sha256);
const source = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/${bookId}`;
const root = `${repo}/.tmp/STEMROBIN-181/d1816-${config.task.toLowerCase()}/root`;
const out = `${ticket}/tmp/${config.directory}`;
if (fs.existsSync(root)) {
  assert(config.groupedContextRecovery);
  assert.equal(read(`${out}/first-context-shape-failure.json`).officialNativeCommandsInvoked, 0);
  assert(!fs.existsSync(`${root}/${bookId}/editions`));
  for (const name of ['book.json', 'pages', 'figures', `lessons/${card}`])
    assert.equal(fs.readlinkSync(`${root}/${bookId}/${name}`), `${source}/${name}`);
} else {
  fs.mkdirSync(`${root}/${bookId}/lessons`, { recursive: true });
  for (const name of ['book.json', 'pages', 'figures', `lessons/${card}`]) {
    const from = `${source}/${name}`;
    fs.symlinkSync(from, `${root}/${bookId}/${name}`, fs.statSync(from).isDirectory() ? 'dir' : 'file');
  }
}
const savedReview = `${out}/first-en-review.original.json`;
if (fs.existsSync(savedReview)) assert.equal(bind(savedReview).sha256, reviewHash);
else copy(reviewPath, savedReview);
const lesson = read(authored.englishDraft.path), zh = read(prepared.approvedZh.path);
if (config.nextFourAdapter) {
  assert.deepEqual(lesson.source, zh.source);
  assert.equal(lesson.prose.length, config.objects);
  assert.deepEqual(lesson.prose.filter(block => block.kind === 'fig').map(block => block.id),
    zh.prose.filter(block => block.kind === 'fig').map(block => block.id));
}
const contextText = value => (config.proseOnlyContext
  ? value.prose.filter(block => block.kind === 'p').map(block => block.text)
  : [config.titleContext ? value.title : value.printed_title, ...value.prose.filter(block => block.kind !== 'fig')
    .map(block => block.text)]).map(text => ({ lesson: card, text }));
const zhContext = contextText(zh), enContext = contextText(lesson);
assert.equal(zhContext.length, enContext.length);
// Match the original context projection exactly before applying the same projection in English.
const generatedContext = originalSpec => {
  const texts = value => value.prose.filter(block => block.kind !== 'fig').map(block => block.text);
  const rows = (value, grouped) => (grouped ? [texts(value).join('\n\n')] : texts(value))
    .map(text => ({ lesson: card, text }));
  const grouped = originalSpec.source.authoritativeText.length === 1;
  assert.deepEqual(originalSpec.source.authoritativeText, rows(zh, grouped));
  return rows(lesson, grouped);
};
const nextFourContext = value => {
  let texts = value.prose.filter(block => config.contextProjection === 'grouped-all' || block.kind !== 'fig')
    .map(block => block.text);
  if (config.contextProjection === 'title-nonfig') texts.unshift(value.title);
  if (config.contextProjection.startsWith('grouped-')) texts = [[value.printed_title, ...texts].join('\n\n')];
  return texts.map(text => ({ lesson: card, text }));
};
const assets = [];
const target = `${root}/${bookId}/editions/${edition}`;
for (const item of prepared.existingFigureTupleInventory) {
  for (const file of Object.values(item.files))
    assert.equal(bind(file.path).sha256, file.sha256);
  const originalSpec = read(item.files.spec.path);
  assert(['generated', 'deterministic'].includes(originalSpec.mode));
  const generated = originalSpec.mode === 'generated';
  if (!config.nextFourAdapter) assert.equal(generated, !!config.generatedPng);
  let localizedContext = enContext;
  let englishMetadataChanges;
  if (config.nextFourAdapter) {
    const inventoryItem = adapterInventory.figureTuples.find(figure => figure.card === card && figure.id === item.id);
    assert(inventoryItem);
    assert.equal(item.mode, originalSpec.mode);
    assert.equal(inventoryItem.mode, originalSpec.mode);
    assert.equal(item.originalSourceSpecAndMediaBytesUnchanged, true);
    assert.equal(item.receivedInventory.sha256, inventoryHash);
    assert.equal(path.resolve(item.receivedInventory.path), path.resolve(prepared.receivedHistoricalEvidenceInventory.path));
    const canonicalSource = `${source}/figures/${item.id}.png`;
    assert.equal(path.resolve(item.sourceImage.path), canonicalSource);
    assert.equal(item.sourceImage.sha256, inventoryItem.source.sha256);
    assert.equal(originalSpec.source.image.sha256, item.sourceImage.sha256);
    assert.deepEqual(item.declaredHistoricalSourceImage, originalSpec.source.image);
    for (const file of [item.sourceImage, item.sourceFigureGate, item.independentFigureReview])
      assert.equal(bind(file.path).sha256, file.sha256);
    assert.equal(read(item.independentFigureReview.path).status, 'pass');
    for (const [key, file] of Object.entries(item.files)) {
      const suffix = key === 'generation' ? 'png.json' : key === 'svg' || key === 'png' ? key : `${key}.json`;
      assert.equal(file.sha256, inventoryItem.sha256ByFile[`figures/${item.id}.${suffix}`]);
    }
    assert.deepEqual(Object.keys(item.files).sort(),
      generated ? ['generation', 'png', 'review', 'spec'] : ['render', 'review', 'spec', 'svg']);
    const projected = nextFourContext(zh), historical = originalSpec.source.authoritativeText;
    assert.equal(historical.length, config.contextRows);
    assert.equal(projected.length, historical.length);
    if (config.whitespaceContext) {
      const normalized = rows => rows.map(row => ({ ...row, text: row.text.replace(/\s+/g, '') }));
      assert.deepEqual(normalized(historical), normalized(projected));
    } else assert.deepEqual(historical, projected);
    localizedContext = nextFourContext(lesson);
    assert.equal(localizedContext.length, historical.length);
    englishMetadataChanges = {
      projection: config.contextProjection, originalContextRows: historical.length,
      chineseComparison: config.whitespaceContext ? 'Only whitespace removed for comparison; originals unchanged' : 'Exact rows',
      affectedContextReconciliation: true, sameProjectionTranslatedIntoEnglish: true,
      historicalChineseScienceApprovalRecovered: false,
      declaredHistoricalSourceImage: item.declaredHistoricalSourceImage,
      canonicalSourceImage: { ...originalSpec.source.image, path: path.relative(repo, canonicalSource) },
      sourceHashUnchanged: item.sourceImage.sha256, sourcePixelsReopened: false,
      ...(config.englishMaxWidthPx ? {
        originalMaxWidthPx: originalSpec.display.maxWidthPx ?? null,
        englishMaxWidthPx: config.englishMaxWidthPx,
        declaration: 'English instructional inline maximum 640; original display widths retained, original spec unchanged',
      } : {}),
      independentEnglishContextAndPixelReviewPending: true,
    };
  } else if (generated) {
    assert.equal(originalSpec.mode, 'generated');
    assert.deepEqual(Object.keys(item.files).sort(), ['generation', 'png', 'review', 'spec']);
    assert.equal(bind(item.independentFigureReview.path).sha256, item.independentFigureReview.sha256);
    assert.equal(read(item.independentFigureReview.path).status, 'pass');
    localizedContext = generatedContext(originalSpec);
  } else if (config.sharedLessonContext) {
    const grouped = value => [value.printed_title, ...value.prose
      .filter(block => !config.sharedContextNonfig || block.kind !== 'fig')
      .map(block => block.text)].join('\n\n');
    const ownRows = originalSpec.source.authoritativeText.filter(row => row.lesson === card);
    assert.equal(ownRows.length, 1);
    assert.equal(ownRows[0].text, grouped(zh));
    localizedContext = originalSpec.source.authoritativeText.map(row => row.lesson === card
      ? { ...row, text: grouped(lesson) } : row);
    const inheritedSpecPath = `${source}/editions/${edition}/figures/${item.id}.spec.json`;
    if (config.inheritSharedEnglishContext && fs.existsSync(inheritedSpecPath)) {
      const inherited = read(inheritedSpecPath), comparison = structuredClone(inherited);
      comparison.source.authoritativeText = originalSpec.source.authoritativeText;
      comparison.display.widths = originalSpec.display.widths;
      assert.deepEqual(comparison, originalSpec);
      assert.equal(bind(`${source}/editions/${edition}/figures/${item.id}.svg`).sha256, item.files.svg.sha256);
      assert.equal(inherited.source.authoritativeText.length, localizedContext.length);
      localizedContext = localizedContext.map((row, index) => {
        const prior = inherited.source.authoritativeText[index];
        assert.equal(prior.lesson, row.lesson);
        return row.lesson === card ? row : prior;
      });
      copy(inheritedSpecPath, `${out}/inherited-shared/${item.id}.spec.original.json`);
    }
  } else if (config.groupedContextRecovery || config.groupedContext) {
    const groupedContext = value => [{
      lesson: card, text: [value.printed_title, ...value.prose
        .filter(block => !config.groupedContextNonfig || block.kind !== 'fig')
        .map(block => block.text)].join('\n\n'),
    }];
    assert.deepEqual(originalSpec.source.authoritativeText, groupedContext(zh));
    localizedContext = groupedContext(lesson);
  } else assert.deepEqual(originalSpec.source.authoritativeText, zhContext);
  const spec = structuredClone(originalSpec);
  spec.source.authoritativeText = localizedContext;
  if (config.nextFourAdapter) {
    spec.source.image = englishMetadataChanges.canonicalSourceImage;
    if (config.englishMaxWidthPx) {
      assert.equal(spec.display.purpose, 'instructional');
      assert.equal(spec.display.layout, 'inline');
      assert(spec.display.widths.every(width => width <= config.englishMaxWidthPx));
      assert(originalSpec.display.maxWidthPx == null);
      spec.display.maxWidthPx = config.englishMaxWidthPx;
    }
  }
  const compare = structuredClone(spec);
  compare.source.authoritativeText = originalSpec.source.authoritativeText;
  if (config.nextFourAdapter) {
    compare.source.image = originalSpec.source.image;
    compare.display = originalSpec.display;
  }
  assert.deepEqual(compare, originalSpec);
  const directory = `${target}/figures`;
  const specFile = `${directory}/${item.id}.spec.json`;
  const svgFile = `${directory}/${item.id}.svg`;
  const renderFile = `${directory}/${item.id}.render.json`;
  const reviewFile = `${directory}/${item.id}.review.json`;
  save(specFile, spec);
  if (generated) {
    const pngFile = `${directory}/${item.id}.png`;
    const generationFile = `${directory}/${item.id}.png.json`;
    copy(item.files.png.path, pngFile);
    copy(item.files.generation.path, generationFile);
    const generation = read(generationFile), review = read(item.files.review.path);
    assert.equal(generation.output.sha256, item.files.png.sha256);
    assert.equal(review.status, 'pass');
    assert.equal(review.spec.sha256, item.files.spec.sha256);
    assert.equal(review.generation.sha256, item.files.generation.sha256);
    assert.equal(review.outputs.png.sha256, item.files.png.sha256);
    assert.equal(review.source.sha256, originalSpec.source.image.sha256);
    review.spec = { path: specFile, sha256: bind(specFile).sha256 };
    review.generation = { path: generationFile, sha256: bind(generationFile).sha256 };
    review.outputs.png = { path: pngFile, sha256: bind(pngFile).sha256 };
    review.localeContextReconciliation = {
      originalSpec: item.files.spec, originalGeneration: item.files.generation,
      originalReview: item.files.review, originalFigureGate: item.sourceFigureGate ?? prepared.historicalFigureGate,
      originalIndependentFigureReview: item.independentFigureReview,
      englishApplicabilityReview: bind(reviewPath), currentEnglish: authored.englishDraft,
      approvedChinese: prepared.approvedZh, sourceInventoryAndPngUnchanged: true,
      generationMetadataRequestOutputAndReferencesUnchanged: true,
      sourceScienceAndSavedPixelReviewReplayed: false, completeEnglishAccessibilityApproval: false,
      actualEnglishCourseWidthCheckPending: true, rendererCalls: 0, paidCalls: 0,
      ...(config.nextFourAdapter ? { englishMetadataChanges, receivedInventory: item.receivedInventory,
        originalSourceImage: item.sourceImage, historicalChineseScienceApprovalRecovered: false } : {}),
    };
    if (config.nextFourAdapter) review.source = { ...review.source, path: spec.source.image.path };
    save(reviewFile, review);
    assets.push({ id: item.id, mode: 'generated', spec: bind(specFile), png: bind(pngFile),
      generation: bind(generationFile), review: bind(reviewFile), original: item.files });
    continue;
  }
  copy(item.files.svg.path, svgFile);
  const render = read(item.files.render.path);
  assert.equal(render.status, 'pass');
  assert.equal(render.output.svg.sha256, item.files.svg.sha256);
  if (config.nextFourAdapter) assert.equal(render.spec.sha256, item.files.spec.sha256);
  render.spec = { path: specFile, sha256: bind(specFile).sha256 };
  render.output.svg = { path: svgFile, sha256: bind(svgFile).sha256 };
  render.contextLocalization = {
    originalSpec: item.files.spec, originalRender: item.files.render,
    onlyAuthoritativeTextTranslated: !config.nextFourAdapter, visibleGeometryLabelsAndSvgUnchanged: true,
    englishApplicabilityReview: bind(reviewPath), rendererCalls: 0,
    ...(config.nextFourAdapter ? { englishMetadataChanges } : {}),
  };
  save(renderFile, render);
  const review = read(item.files.review.path);
  assert.equal(review.status, 'pass');
  if (config.nextFourAdapter) {
    assert.equal(review.spec.sha256, item.files.spec.sha256);
    assert.equal(review.render.sha256, item.files.render.sha256);
    assert.equal(review.outputs.svg.sha256, item.files.svg.sha256);
  }
  review.spec = { path: specFile, sha256: bind(specFile).sha256 };
  review.render = { path: renderFile, sha256: bind(renderFile).sha256 };
  review.outputs.svg = { path: svgFile, sha256: bind(svgFile).sha256 };
  review.localeContextReconciliation = {
    originalReview: item.files.review, originalFigureGate: item.sourceFigureGate ?? prepared.historicalFigureGate,
    englishApplicabilityReview: bind(reviewPath), currentEnglish: authored.englishDraft,
    approvedChinese: prepared.approvedZh, sourceInventoryAndSvgUnchanged: true,
    sourceScienceAndSavedPixelReviewReplayed: false, completeEnglishAccessibilityApproval: false,
    actualEnglishCourseWidthCheckPending: true,
    ...(config.nextFourAdapter ? { englishMetadataChanges, receivedInventory: item.receivedInventory,
      originalIndependentFigureReview: item.independentFigureReview, originalSourceImage: item.sourceImage,
      historicalChineseScienceApprovalRecovered: false } : {}),
  };
  if (config.nextFourAdapter) {
    assert.equal(review.spec.sha256, bind(specFile).sha256);
    assert.equal(review.source.sha256, item.sourceImage.sha256);
    review.source = { ...review.source, path: spec.source.image.path };
  }
  save(reviewFile, review);
  assets.push({ id: item.id, ...(config.nextFourAdapter ? { mode: 'deterministic' } : {}),
    spec: bind(specFile), svg: bind(svgFile),
    render: bind(renderFile), review: bind(reviewFile), original: item.files });
}
const templates = `${prepared.work}/adapt/${bookId}/${edition}/lessons/${card}`;
copy(`${templates}/lesson.template.json`, `${out}/prepared-lesson-template.original.json`);
copy(`${templates}/figures.template.json`, `${out}/prepared-figures-template.original.json`);
fs.copyFileSync(authored.englishDraft.path, `${templates}/lesson.template.json`);
const manifest = config.sharedManifest
  ? read(prepared.productsReusedExactly.find(file => file.path.endsWith('/figures.json')).path)
  : read(`${templates}/figures.template.json`);
if (config.sharedManifest) {
  manifest.edition = edition;
  manifest.status = 'draft';
}
assert.equal(manifest.figures.length, config.figures);
for (const entry of manifest.figures) {
  const asset = assets.find(asset => asset.id === entry.id);
  assert(asset);
  if (config.nextFourAdapter) {
    const label = authored.localizedFigureLabels?.[entry.id]
      ?? (/^fig-\d+$/.test(entry.id) ? `Figure ${entry.id.slice(4)}` : undefined);
    assert(typeof label === 'string' && label.trim() && !/[\u3400-\u9fff\u0400-\u04ff]/.test(label));
    entry.label = label;
  }
  if (asset.mode === 'generated') {
    const label = authored.localizedFigureLabels?.[entry.id]
      ?? (config.nextFourAdapter && /^fig-\d+$/.test(entry.id) ? `Figure ${entry.id.slice(4)}` : undefined)
      ?? lesson.prose.find(block => block.kind === 'fig' && block.id === entry.id)?.label;
    assert(typeof label === 'string' && label.trim() && !/[\u3400-\u9fff\u0400-\u04ff]/.test(label),
      'A reviewed English manifest label must be supplied by the author');
    entry.label = label;
    entry.mode = 'generated';
    for (const key of ['svg', 'render', 'artwork']) delete entry[key];
    Object.assign(entry, {
      spec: `figures/${entry.id}.spec.json`, png: `figures/${entry.id}.png`,
      generation: `figures/${entry.id}.png.json`, review: `figures/${entry.id}.review.json`,
    });
    continue;
  }
  entry.mode = 'deterministic';
  if (config.nextFourAdapter) for (const key of ['png', 'generation', 'artwork']) delete entry[key];
  for (const key of ['spec', 'svg', 'render', 'review'])
    entry[key] = `figures/${entry.id}.${key === 'svg' ? 'svg' : `${key}.json`}`;
}
fs.writeFileSync(`${templates}/figures.template.json`, JSON.stringify(manifest, null, 2) + '\n');
save(`${out}/inputs.freeze.json`, {
  prepared: bind(preparedPath), authored: bind(authoredPath), englishReview: bind(reviewPath),
  englishFigureAssets: assets, contextOnlyTranslation: true,
  unchangedVisibleSvgAndSourceFacts: !config.generatedPng,
  ...(config.generatedPng ? { unchangedPngGenerationAndSourceFacts: true } : {}),
  ...(config.nextFourAdapter ? {
    receivedInventory: prepared.receivedHistoricalEvidenceInventory,
    contextOnlyTranslation: false, explicitEnglishSourcePathAndDisplayMetadataReconciliation: true,
    unchangedVisibleSvgAndSourceFacts: true, unchangedPngGenerationAndSourceFacts: true,
    historicalChineseScienceApprovalRecovered: false,
  } : {}),
  firstNativeBindingCheckPending: true,
});
const receipts = [];
for (const command of ['adapt-finalize', 'render'])
  receipts.push(run(`${config.task.toLowerCase()}-${card.split('-').at(-1)}-en-${command}-first`, [
    `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
    `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`, command,
    '--book', bookId, '--root', root, '--work', prepared.work, '--edition', edition, '--lesson', card,
  ]));
const directory = `${target}/lessons/${card}`;
const row = {
  locale: 'en', edition, assets,
  lesson: bind(`${directory}/lesson.json`), exercises: bind(`${directory}/exercises.json`),
  figures: bind(`${directory}/figures.json`), audit: bind(`${directory}/adaptation.audit.json`),
  textHtml: bind(`${prepared.work}/render/${bookId}/${edition}/${card}/text.html`),
};
assert.equal(read(row.audit.path).status, 'pass');
assert.deepEqual(read(row.lesson.path).prose, lesson.prose);
assert.deepEqual(read(row.lesson.path).section_breaks, lesson.section_breaks);
assert.equal(read(row.exercises.path).count, 0);
assert.equal(read(row.figures.path).figures.length, config.figures);
for (const file of [prepared.source, ...prepared.sourcePages, ...prepared.productsReusedExactly])
  assert.equal(bind(file.path).sha256, file.sha256);
save(`${out}/result.json`, {
  task: config.task, status: 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS',
  card, root, work: prepared.work, rows: [row], receipts,
  prepared: bind(preparedPath), authored: bind(authoredPath), review: bind(reviewPath),
  originalObjects: config.objects, originalTasks: 0, originalFigures: config.figures,
  onlyFigureAuthoritativeTextAndMetadataBindingsChanged: true,
  sourceGeometryEnglishFigureLabelsAndSvgBytesUnchanged: !config.generatedPng,
  ...(config.generatedPng ? {
    pngBytesAndOriginalGenerationEvidenceUnchanged: true,
    onlyFigureAuthoritativeTextManifestLabelsAndReviewBindingsChanged: true,
    embeddedRasterGlyphCertificationClaimed: false,
  } : {}),
  ...(config.nextFourAdapter ? {
    receivedInventory: prepared.receivedHistoricalEvidenceInventory,
    perAssetModes: Object.fromEntries(assets.map(asset => [asset.id, asset.mode])),
    historicalChineseScienceApprovalRecovered: false,
    pngBytesAndOriginalGenerationEvidenceUnchanged: assets.some(asset => asset.mode === 'generated'),
    embeddedRasterGlyphCertificationClaimed: false,
    englishContextSourcePathAndDisplayMetadataChangesDisclosed: true,
    independentEnglishContextAndPixelReviewPending: true,
    originalSourceLabelIdentitiesAndSnapshotUnchanged: true,
    numberedEnglishManifestLabelsDeclaredWithoutChangingSource: true,
  } : {}),
  originalSourceZhAndFigurePassReplayed: false,
  sourceChineseMachineLabelsAndSectionRetained: true,
  completeEnglishAccessibilityApproval: false, actualDisplayWidthsPending: true,
  parentImages: 0, databaseWrites: 0, paidCalls: 0, fullCourseApproved: false,
  newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ result: bind(`${out}/result.json`), nativePASS: true }));
