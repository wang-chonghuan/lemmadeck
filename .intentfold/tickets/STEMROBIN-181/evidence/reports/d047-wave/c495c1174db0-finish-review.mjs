import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const E = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.dirname(E);
const W = path.resolve(tmp, '../../../../');
const A = path.join(tmp, 'd045-10p-fig64-author');
const reportPath = path.join(tmp, 'd046-fig64-independent-review.json');
const nativePath = path.join(E, 'fig-64.review.json');
const load = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const record = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size });
const write = (p, value) => {
  assert.ok(p.startsWith(`${E}/`) || p === reportPath, `Unowned output: ${p}`);
  assert.ok(!fs.existsSync(p), `Refusing overwrite/replay: ${p}`);
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
};
assert.ok(!fs.existsSync(reportPath) && !fs.existsSync(nativePath), 'Review already exists');

const checked = new Map();
const check = item => {
  assert.ok(fs.statSync(item.path).isFile(), `Missing binding: ${item.path}`);
  assert.equal(hash(item.path), item.sha256, `SHA drift: ${item.path}`);
  if (Number.isInteger(item.bytes)) assert.equal(fs.statSync(item.path).size, item.bytes);
  checked.set(item.path, record(item.path));
};
const walk = value => {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && /^[0-9a-f]{64}$/.test(value.sha256 || '')) check(value);
  for (const child of Object.values(value)) walk(child);
};
const freezePath = path.join(A, 'author-freeze.json');
check({ path: freezePath, sha256: 'ad92bb174ccaf934e400a66a9479413570f8e6a70d6f54224463cd4d6aeaab67' });
const freeze = load(freezePath);
walk(freeze);
assert.equal(freeze.outputs.spec.sha256, 'ecf66cc1b8094669fbf8e7b25e0dde2ef0016ac9dc680ff698f0d79fe3a7098a');
assert.equal(freeze.repairBudget.used, 0);
assert.equal(freeze.generationCalls, 1);
assert.equal(freeze.renderingMode, 'generated');
assert.equal(freeze.repairFreeze.sha256, '234f22abbc69b624a4207ac9ac74d1397e70633e17a5297252b9148aed590296');

const inventoryPath = path.join(E, 'independent-source-inventory.json');
check({ path: inventoryPath, sha256: '590d4b638f6ad062f7fd255aee9f86001c24865ebc89216cff0e48afe8805afb' });
const inventory = load(inventoryPath);
assert.equal(inventory.independence.authorArtifactsReadAtRecording, false);
assert.equal(inventory.independence.imageOpenCountAtRecording, 1);
assert.ok(Date.parse(inventory.recordedAt) >= fs.statSync(freezePath).mtimeMs);
check(inventory.source);

const repair = load(freeze.repairFreeze.path);
walk(repair);
const context = load(freeze.currentBilingualContext.path);
walk(context);
const spec = load(freeze.outputs.spec.path);
const generation = load(freeze.outputs.generation.path);
assert.equal(spec.mode, 'generated');
assert.equal(spec.display.purpose, 'instructional');
assert.deepEqual(spec.display.widths, [640]);
assert.equal(spec.display.layout, 'scroll');
assert.equal(spec.source.authoritativeText.length, 2);
assert.deepEqual(generation.references, [freeze.sourceGeometry.source]);
assert.equal(generation.schema, 'n-azure/image-generation@1');
assert.equal(generation.request.n, 1);
check(generation.output);
assert.equal(generation.output.path, freeze.outputs.png.path);
assert.equal(generation.prompt.trimEnd(), fs.readFileSync(freeze.outputs.prompt.path, 'utf8').trimEnd());
for (const [index, language] of ['zh', 'en'].entries()) {
  const current = repair.outputs.find(item => item.language === language);
  const prosePath = path.join(A, 'inputs', language, 'prose.md');
  assert.equal(hash(prosePath), current.prose.sha256);
  assert.equal(hash(path.join(A, 'inputs', language, 'lesson.template.json')), current.frozen.sha256);
  assert.equal(hash(current.template.path), current.frozen.sha256);
  const text = fs.readFileSync(prosePath, 'utf8');
  assert.equal(context.texts[index].language, language);
  assert.equal(context.texts[index].text, text);
  assert.equal(spec.source.authoritativeText[index].text, text);
  assert.ok(generation.prompt.includes(text.trimEnd()), `Incomplete ${language} generation context`);
}

const affectedPath = path.join(tmp, 'd045-n40-affected-review.json');
check({ path: affectedPath, sha256: '475d71e4fcb72e6f0c3cd7b3e60030c36c8a1ad062e24d350994909f25995500' });
const affected = load(affectedPath);
walk(affected);
assert.equal(affected.affectedZHEN, 'PASS');
assert.equal(affected.inherited.originalSCI, 'PASS');
assert.equal(affected.repairFreeze.sha256, freeze.repairFreeze.sha256);
const science = load(context.science.path);
assert.equal(science.cardResults.find(item => item.card === 'phy10-c1-s5-n40').SCI, 'PASS');

for (const key of ['nativeSpecDraft', 'nativeSpecRendered']) {
  const receipt = load(freeze.receipts[key].path);
  assert.equal(receipt.status, 'pass');
  assert.deepEqual(receipt.errors, []);
  assert.equal(receipt.spec, freeze.outputs.spec.path);
}
for (const key of ['nativeRenderZH', 'nativeRenderEN']) assert.equal(load(freeze.receipts[key].path).ok, true);
for (const item of freeze.receipts.commands) assert.equal(load(item.path).exitCode, 0);
const headed = load(freeze.receipts.headedMedia.path);
assert.equal(headed.headed, true);
assert.equal(headed.status, 'pass');
assert.deepEqual(headed.errors, []);
for (const language of ['zh', 'en']) {
  const items = headed.measurements.filter(item => item.language === language);
  assert.equal(items.length, 3);
  for (const item of items) {
    assert.equal(item.mediaWidthPx, 640);
    assert.equal(item.imageWidthPx, 640);
    assert.equal(item.pageHorizontalOverflowPx, 0);
    assert.equal(item.missingModernMedia, 0);
    assert.ok(item.proseFontSizesPx.every(size => size >= 16));
  }
  const end = items.find(item => item.phase === 'end');
  assert.equal(end.scrollLeftPx, 282);
  assert.equal(end.maxScrollLeftPx, 282);
}
walk(headed);

const imageOpenRecords = [
  { ...record(inventory.source.path), purpose: 'Independent original pixel inventory before author materials' },
  { ...record(freeze.outputs.png.path), purpose: 'Complete generated raster at original detail' },
  ...['en-desktop-640.png', 'zh-desktop-640.png', 'en-mobile390-start.png',
    'en-mobile390-end.png', 'zh-mobile390-start.png', 'zh-mobile390-end.png']
    .map(name => ({ ...record(path.join(A, 'previews/screenshots', name)), purpose: name })),
].map((item, index) => ({ ordinal: index + 1, ...item }));
const judgmentsPath = path.join(E, 'visual-judgments.json');
const judgments = load(judgmentsPath);
assert.equal(judgments.status, 'pass');
assert.equal(judgments.imageOpenCount, imageOpenRecords.length);
assert.equal(judgments.sourceCoverage.length, inventory.inventory.length);
assert.deepEqual(judgments.defects, []);
const bindingPath = path.join(E, 'binding-audit.json');
write(bindingPath, {
  schema: 'ld-s10y-image/independent-binding-audit@1',
  status: 'pass',
  checkedAt: new Date().toISOString(),
  bindings: [...checked.values()],
  checks: {
    authorFreezeCurrent: true, repairFreezeCurrent: true,
    currentCompleteZHENMatchesSpecAndGeneration: true,
    SCIAndAffectedZHENPassReused: true,
    nativeSpecAndGenerationAndHeadedReceiptsReused: true,
    mobileScrollEndReachedZHEN: true,
    independentInventoryPredatesAuthorMaterialRead: true,
    generationAndRenderReplays: 0,
  },
  imageOpenRecords,
});

// The native recorder validates and binds current inputs; it does not replay production.
const nativeScript = path.join(W, '.agents/skills/ld-s10y-image/scripts/record_review.py');
const notes = `Independent fig64 visual PASS only. Original pixels opened and inventory recorded before author materials; all required scene objects and planar nested surface ripples retained, not spherical bulk waves. Complete current n40 ZH+EN and spec read. Eight image opens including complete generated raster, both 640px desktop media and both mobile390 start/end pairs. Existing hash-checked native/spec/generation/headed receipts reused; mobile end 282/282 reachable. No labels, invented values, cultural leakage, or answer disclosure. SCI and affectedZHEN PASS inherited, not rerun. Independent inventory SHA ${hash(inventoryPath)}; visual judgments SHA ${hash(judgmentsPath)}; binding audit SHA ${hash(bindingPath)}. No full-card approval, promotion, author repair, generation replay, or render replay.`;
const args = ['-B', nativeScript, '--spec', freeze.outputs.spec.path,
  '--generation', freeze.outputs.generation.path, '--output', nativePath,
  '--status', 'pass', '--notes', notes];
const startedAt = new Date().toISOString();
const result = spawnSync('python3', args, {
  cwd: W, encoding: 'utf8', timeout: 120000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
const nativeReceiptPath = path.join(E, 'native-review-receipt.json');
write(nativeReceiptPath, {
  schema: 'ld-s10y-image/independent-native-review-receipt@1',
  argv: ['python3', ...args], cwd: W, startedAt, finishedAt: new Date().toISOString(),
  exitCode: result.status, signal: result.signal,
  error: result.error?.message || null, stdout: result.stdout, stderr: result.stderr,
});
assert.equal(result.status, 0, result.stderr);
const native = load(nativePath);
assert.equal(native.schema, 'ld-s10y-image/review@1');
assert.equal(native.status, 'pass');
assert.equal(native.spec.sha256, freeze.outputs.spec.sha256);
assert.equal(native.generation.sha256, freeze.outputs.generation.sha256);
assert.ok(!('render' in native));
assert.equal(native.outputs.png.sha256, freeze.outputs.png.sha256);
const unchanged = [...checked.values()].every(item => hash(item.path) === item.sha256);
assert.ok(unchanged, 'Reviewed input changed during native recording');

write(reportPath, {
  schema: 'ld-s10y-image/independent-figure-review-report@1',
  ticket: 'STEMROBIN-181', batch: 'D029', figure: 'fig-64',
  card: 'phy10-c1-s5-n40', completedAt: new Date().toISOString(),
  reviewer: judgments.reviewer, status: 'PASS', independentFigureReview: true,
  authorFreeze: record(freezePath), repairFreeze: record(freeze.repairFreeze.path),
  source: record(inventory.source.path), currentSpec: record(freeze.outputs.spec.path),
  generation: record(freeze.outputs.generation.path), output: record(freeze.outputs.png.path),
  inherited: {
    SCI: 'PASS-reused-not-rerun', scienceReview: record(context.science.path),
    affectedZHEN: 'PASS-reused-not-rerun', affectedReview: record(affectedPath),
  },
  evidence: {
    independentSourceInventory: record(inventoryPath),
    visualJudgments: record(judgmentsPath), bindingAudit: record(bindingPath),
    nativeReview: record(nativePath), nativeReceipt: record(nativeReceiptPath),
    nativeRecorder: record(nativeScript), reviewHelper: record(fileURLToPath(import.meta.url)),
    headedMediaReused: record(freeze.receipts.headedMedia.path),
  },
  sourceInventoryRecordedBeforeAuthorMaterials: true,
  sourceObjectCoverage: judgments.sourceCoverage,
  semanticMeaning: 'Circular nested ripples on one water SURFACE; not spherical bulk waves.',
  display: judgments.display, defects: [], authorRepairRequired: false,
  nativeReviewAt1Written: true, nativeEvidenceArgument: '--generation',
  imagesOpened: 8, imageContextTotal: 8, imageOpenRecords, reopens: 0, cropsOpened: 0,
  authorGenerationCalls: 1, authorRepairsUsed: 0, allowedAuthorRepairsRemaining: 1,
  reviewerGenerationCalls: 0, reviewerRepairs: 0, unchangedGenerationOrRenderReplays: 0,
  checkedInputsUnchangedAfterNativeReview: unchanged,
  fullCardApproval: false, promotionPerformed: false,
  canonicalToolAppGitDBMeterIndexBackendWrites: false,
  outputBoundary: { report: reportPath, evidence: E },
  note: 'Figure-only independent review of the frozen candidate. Temporary author output paths remain unchanged; this does not promote assets or authorize parent integration/publication.',
});
console.log(JSON.stringify({
  status: 'PASS', report: record(reportPath), nativeReview: record(nativePath),
  imagesOpened: 8, defects: [], fullCardApproval: false,
}, null, 2));
