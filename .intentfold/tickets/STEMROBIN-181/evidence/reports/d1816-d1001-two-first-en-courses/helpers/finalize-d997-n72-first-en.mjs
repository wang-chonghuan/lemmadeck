import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const [reviewPath, reviewHash] = process.argv.slice(2);
assert.equal(bind(reviewPath).sha256, reviewHash);
assert.equal(read(reviewPath).status, 'PASS');
const card = 'phy9-c2-s2-n72', edition = 'modern-us-neutral-en';
const preparedPath = `${ticket}/tmp/d1816-d993-n72-first-missing-en/prepared.json`;
const authoredPath = `${ticket}/tmp/d1816-d995-n72-label-identity/authored.json`;
const prepared = read(preparedPath), authored = read(authoredPath);
assert.equal(authored.status, 'AFFECTED_ONLY_EIGHT_MACHINE_LABEL_IDENTITIES_PASS');
assert(JSON.stringify(read(reviewPath)).includes(authored.englishDraft.sha256));
assert.equal(bind(authored.englishDraft.path).sha256, authored.englishDraft.sha256);
for (const file of [prepared.source, ...prepared.sourcePages, ...prepared.productsReusedExactly])
  assert.equal(bind(file.path).sha256, file.sha256);
const source = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/9p`;
const root = `${repo}/.tmp/STEMROBIN-181/d1816-d997/root`;
const out = `${ticket}/tmp/d1816-d997-n72-first-en-native`;
assert(!fs.existsSync(root));
fs.mkdirSync(`${root}/9p/lessons`, { recursive: true });
for (const name of ['book.json', 'pages', 'figures', `lessons/${card}`]) {
  const from = `${source}/${name}`;
  fs.symlinkSync(from, `${root}/9p/${name}`, fs.statSync(from).isDirectory() ? 'dir' : 'file');
}
copy(reviewPath, `${out}/first-en-review.original.json`);
const lesson = read(authored.englishDraft.path), zh = read(prepared.approvedZh.path);
const contextText = value => [value.printed_title, ...value.prose.filter(block => block.kind !== 'fig')
  .map(block => block.text)].map(text => ({ lesson: card, text }));
const zhContext = contextText(zh), enContext = contextText(lesson);
assert.equal(zhContext.length, enContext.length);
const assets = [];
const target = `${root}/9p/editions/${edition}`;
for (const item of prepared.existingFigureTupleInventory) {
  for (const file of Object.values(item.files))
    assert.equal(bind(file.path).sha256, file.sha256);
  const originalSpec = read(item.files.spec.path);
  assert.deepEqual(originalSpec.source.authoritativeText, zhContext);
  const spec = structuredClone(originalSpec);
  spec.source.authoritativeText = enContext;
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
const templates = `${prepared.work}/adapt/9p/${edition}/lessons/${card}`;
copy(`${templates}/lesson.template.json`, `${out}/prepared-lesson-template.original.json`);
copy(`${templates}/figures.template.json`, `${out}/prepared-figures-template.original.json`);
fs.copyFileSync(authored.englishDraft.path, `${templates}/lesson.template.json`);
const manifest = read(`${templates}/figures.template.json`);
assert.equal(manifest.figures.length, 4);
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
  receipts.push(run(`d997-n72-en-${command}-first`, [
    `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
    `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`, command,
    '--book', '9p', '--root', root, '--work', prepared.work, '--edition', edition, '--lesson', card,
  ]));
const directory = `${target}/lessons/${card}`;
const row = {
  locale: 'en', edition, assets,
  lesson: bind(`${directory}/lesson.json`), exercises: bind(`${directory}/exercises.json`),
  figures: bind(`${directory}/figures.json`), audit: bind(`${directory}/adaptation.audit.json`),
  textHtml: bind(`${prepared.work}/render/9p/${edition}/${card}/text.html`),
};
assert.equal(read(row.audit.path).status, 'pass');
assert.deepEqual(read(row.lesson.path).prose, lesson.prose);
assert.deepEqual(read(row.lesson.path).section_breaks, lesson.section_breaks);
assert.equal(read(row.exercises.path).count, 0);
assert.equal(read(row.figures.path).figures.length, 4);
for (const file of [prepared.source, ...prepared.sourcePages, ...prepared.productsReusedExactly])
  assert.equal(bind(file.path).sha256, file.sha256);
save(`${out}/result.json`, {
  task: 'D997', status: 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS',
  card, root, work: prepared.work, rows: [row], receipts,
  prepared: bind(preparedPath), authored: bind(authoredPath), review: bind(reviewPath),
  originalObjects: 13, originalTasks: 0, originalFigures: 4,
  onlyFigureAuthoritativeTextAndMetadataBindingsChanged: true,
  sourceGeometryEnglishFigureLabelsAndSvgBytesUnchanged: true,
  originalSourceZhAndFigurePassReplayed: false,
  sourceChineseMachineLabelsAndSectionRetained: true,
  completeEnglishAccessibilityApproval: false, actualDisplayWidthsPending: true,
  parentImages: 0, databaseWrites: 0, paidCalls: 0, fullCourseApproved: false,
  newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ result: bind(`${out}/result.json`), nativePASS: true }));
