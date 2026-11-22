import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const [reviewPath, reviewHash, requestedCard = 'phy9-c2-s2-n72'] = process.argv.slice(2);
assert.equal(bind(reviewPath).sha256, reviewHash);
assert.equal(read(reviewPath).status ?? read(reviewPath).result, 'PASS');
const configurations = {
  'phy10-c1-s2-n2': { book: '10p', task: 'D1220', directory: 'd1816-d1220-n2-first-en-native',
    prepare: 'd1816-d1217-n2-first-missing-en', author: 'd1816-d1224-n2-paragraph-start',
    status: 'AFFECTED_ONLY_ONE_PARAGRAPH_START_NATIVE_PASS', objects: 15, figures: 3,
    sharedLessonContext: true },
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
const contextText = value => (config.proseOnlyContext
  ? value.prose.filter(block => block.kind === 'p').map(block => block.text)
  : [value.printed_title, ...value.prose.filter(block => block.kind !== 'fig')
    .map(block => block.text)]).map(text => ({ lesson: card, text }));
const zhContext = contextText(zh), enContext = contextText(lesson);
assert.equal(zhContext.length, enContext.length);
const assets = [];
const target = `${root}/${bookId}/editions/${edition}`;
for (const item of prepared.existingFigureTupleInventory) {
  for (const file of Object.values(item.files))
    assert.equal(bind(file.path).sha256, file.sha256);
  const originalSpec = read(item.files.spec.path);
  let localizedContext = enContext;
  if (config.sharedLessonContext) {
    const grouped = value => [value.printed_title, ...value.prose.map(block => block.text)].join('\n\n');
    const ownRows = originalSpec.source.authoritativeText.filter(row => row.lesson === card);
    assert.equal(ownRows.length, 1);
    assert.equal(ownRows[0].text, grouped(zh));
    localizedContext = originalSpec.source.authoritativeText.map(row => row.lesson === card
      ? { ...row, text: grouped(lesson) } : row);
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
  const compare = structuredClone(spec);
  compare.source.authoritativeText = originalSpec.source.authoritativeText;
  assert.deepEqual(compare, originalSpec);
  const directory = `${target}/figures`;
  const specFile = `${directory}/${item.id}.spec.json`;
  const svgFile = `${directory}/${item.id}.svg`;
  const renderFile = `${directory}/${item.id}.render.json`;
  const reviewFile = `${directory}/${item.id}.review.json`;
  save(specFile, spec);
  copy(item.files.svg.path, svgFile);
  const render = read(item.files.render.path);
  assert.equal(render.status, 'pass');
  assert.equal(render.output.svg.sha256, item.files.svg.sha256);
  render.spec = { path: specFile, sha256: bind(specFile).sha256 };
  render.output.svg = { path: svgFile, sha256: bind(svgFile).sha256 };
  render.contextLocalization = {
    originalSpec: item.files.spec, originalRender: item.files.render,
    onlyAuthoritativeTextTranslated: true, visibleGeometryLabelsAndSvgUnchanged: true,
    englishApplicabilityReview: bind(reviewPath), rendererCalls: 0,
  };
  save(renderFile, render);
  const review = read(item.files.review.path);
  assert.equal(review.status, 'pass');
  review.spec = { path: specFile, sha256: bind(specFile).sha256 };
  review.render = { path: renderFile, sha256: bind(renderFile).sha256 };
  review.outputs.svg = { path: svgFile, sha256: bind(svgFile).sha256 };
  review.localeContextReconciliation = {
    originalReview: item.files.review, originalFigureGate: prepared.historicalFigureGate,
    englishApplicabilityReview: bind(reviewPath), currentEnglish: authored.englishDraft,
    approvedChinese: prepared.approvedZh, sourceInventoryAndSvgUnchanged: true,
    sourceScienceAndSavedPixelReviewReplayed: false, completeEnglishAccessibilityApproval: false,
    actualEnglishCourseWidthCheckPending: true,
  };
  save(reviewFile, review);
  assets.push({ id: item.id, spec: bind(specFile), svg: bind(svgFile),
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
  entry.mode = 'deterministic';
  for (const key of ['spec', 'svg', 'render', 'review'])
    entry[key] = `figures/${entry.id}.${key === 'svg' ? 'svg' : `${key}.json`}`;
}
fs.writeFileSync(`${templates}/figures.template.json`, JSON.stringify(manifest, null, 2) + '\n');
save(`${out}/inputs.freeze.json`, {
  prepared: bind(preparedPath), authored: bind(authoredPath), englishReview: bind(reviewPath),
  englishFigureAssets: assets, contextOnlyTranslation: true,
  unchangedVisibleSvgAndSourceFacts: true, firstNativeBindingCheckPending: true,
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
  sourceGeometryEnglishFigureLabelsAndSvgBytesUnchanged: true,
  originalSourceZhAndFigurePassReplayed: false,
  sourceChineseMachineLabelsAndSectionRetained: true,
  completeEnglishAccessibilityApproval: false, actualDisplayWidthsPending: true,
  parentImages: 0, databaseWrites: 0, paidCalls: 0, fullCourseApproved: false,
  newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ result: bind(`${out}/result.json`), nativePASS: true }));
