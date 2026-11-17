import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const evidence = dirname(fileURLToPath(import.meta.url));
const tmp = dirname(evidence);
const root = resolve(tmp, 'd045-10p-fig737475-author');
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const load = (path) => JSON.parse(readFileSync(path, 'utf8'));
const record = (path) => ({ path, sha256: sha(readFileSync(path)) });
const inputs = [
  [resolve(root, 'author-freeze.json'), '970d931673c995c89677e46bed4847bbb73aa176ee6da73bbb4bd46dc85ae506'],
  [resolve(tmp, 'd045-n40-text-repair/repair-freeze.json'), '234f22abbc69b624a4207ac9ac74d1397e70633e17a5297252b9148aed590296'],
  [resolve(tmp, 'd045-n40-affected-review.json'), '475d71e4fcb72e6f0c3cd7b3e60030c36c8a1ad062e24d350994909f25995500'],
];
const bindings = [];

function verifyDeclaredRecords(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    const actual = record(value.path);
    assert.equal(actual.sha256, value.sha256, value.path);
    bindings.push(actual);
  }
  Object.values(value).forEach(verifyDeclaredRecords);
}

for (const [path, expected] of inputs) {
  assert.equal(record(path).sha256, expected, path);
  verifyDeclaredRecords(load(path));
}

const freeze = load(inputs[0][0]);
const affected = load(inputs[2][0]);
assert.equal(affected.affectedZHEN, 'PASS');
assert.equal(affected.status, 'AFFECTED-PASS');
assert.deepEqual(affected.reviewedBlocks, [5, 17]);
assert.deepEqual(affected.defects, []);
const science = load(affected.originalReview.path);
const n40 = science.cardResults.find((card) => card.card === 'phy10-c1-s5-n40');
assert.equal(n40.SCI, 'PASS');
assert.equal(affected.inherited.originalSCI, 'PASS');
assert.equal(affected.inherited.unaffectedZHEN, 'PASS');

const frozen = Object.fromEntries(
  freeze.authoritativeText.frozenFullProse.map((language) => [
    language.language,
    {
      prose: readFileSync(language.prose.path, 'utf8'),
      template: load(language.templates.lesson.path),
    },
  ]),
);
const textBindings = [];
for (const object of n40.objects) {
  for (const language of ['zh', 'en']) {
    const old = object.reviewedText?.[language];
    if (!old) continue;
    const current = frozen[language].template.prose[object.index].text;
    const repaired = language === 'en'
      ? affected.affectedResults.find((block) => block.blockIndex === object.index)
      : undefined;
    const expected = repaired
      ? repaired.textBindings.repairedEN.textSha256
      : old.textSha256;
    assert.equal(sha(current), expected, `${language} block ${object.index}`);
    textBindings.push({
      language,
      blockIndex: object.index,
      sha256: expected,
      gate: repaired ? 'affected-ZHEN-PASS' : 'inherited-unchanged-text-PASS',
    });
  }
}

const dimensions = {
  'fig-73': [516, 282],
  'fig-74': [610, 239],
  'fig-75': [330, 337],
};
const inline = load(resolve(root, 'receipts/actual-inline-display.json'));
const raster = load(resolve(root, 'receipts/raster-nonblank.json'));
const geometry = load(resolve(root, 'receipts/geometric-relationships.json'));
assert.equal(inline.status, 'pass');
assert.equal(raster.status, 'pass');
assert.equal(geometry.status, 'pass');
const figures = [];
for (const figure of freeze.figures) {
  const spec = load(figure.nativeOutputs.spec.path);
  const render = load(figure.nativeOutputs.render.path);
  const png = readFileSync(figure.source.path);
  const sourceDimensions = [png.readUInt32BE(16), png.readUInt32BE(20)];
  assert.deepEqual(sourceDimensions, dimensions[figure.id]);
  assert.equal(spec.source.image.sha256, figure.source.sha256);
  assert.equal(spec.source.authoritativeText[0].text, frozen.zh.prose);
  assert.equal(spec.source.authoritativeText[1].text, frozen.en.prose);
  assert.equal(render.schema, 'ld-s10y-image/render@2');
  assert.equal(render.status, 'pass');
  assert.equal(render.spec.sha256, figure.nativeOutputs.spec.sha256);
  assert.equal(render.output.svg.sha256, figure.nativeOutputs.svg.sha256);
  assert.equal(spec.display.layout, 'inline');
  assert.deepEqual([...spec.display.widths].sort((a, b) => a - b), [295, 640]);
  assert.deepEqual(render.collisions, []);
  assert.equal(render.labels, 0);
  assert.ok(render.displayChecks.every((check) => check.status === 'pass' && !check.failures.length));
  const preview = inline.previews.find((item) => item.figure === figure.id);
  assert.deepEqual(preview.widths.map((width) => width.mediaWidth), [640, 295]);
  assert.equal(preview.spec.sha256, figure.nativeOutputs.spec.sha256);
  assert.equal(preview.svg.sha256, figure.nativeOutputs.svg.sha256);
  assert.equal(record(preview.screenshot.path).sha256, preview.screenshot.sha256);
  assert.equal(preview.headed, true);
  assert.equal(preview.svgUnmodified, true);
  assert.deepEqual(preview.errors, []);
  assert.deepEqual(preview.externalRequests, []);
  assert.ok(preview.widths.every((width) => !width.clipped.length && !width.horizontalOverflow));
  const pixels = raster.images.find((image) => image.path === preview.screenshot.path);
  assert.ok(pixels.regions.every((region) => region.darkPixels > 0 && region.darkPixels < region.totalPixels));
  const geometryCheck = geometry.checks.find((check) => check.figure === figure.id);
  assert.equal(geometryCheck.status, 'pass');
  assert.equal(geometryCheck.spec.sha256, figure.nativeOutputs.spec.sha256);

  for (const kind of ['draft-validation', 'native-render', 'rendered-validation']) {
    const receipt = load(resolve(root, `receipts/${figure.id}-current-context-${kind}.json`));
    assert.equal(receipt.exitCode, 0);
    if (kind !== 'native-render') assert.equal(JSON.parse(receipt.stdout).status, 'pass');
  }

  const reviewPath = resolve(evidence, `${figure.id}.review.json`);
  const review = load(reviewPath);
  const producerCwd = dirname(figure.nativeOutputs.render.path);
  assert.equal(review.schema, 'ld-s10y-image/review@1');
  assert.equal(review.figure, figure.id);
  assert.equal(review.status, 'pass');
  assert.ok(review.notes.startsWith('Independent D046 review, not author approval.'));
  assert.equal(review.source.sha256, figure.source.sha256);
  for (const [key, expected] of [
    ['spec', figure.nativeOutputs.spec],
    ['render', figure.nativeOutputs.render],
  ]) {
    assert.equal(resolve(producerCwd, review[key].path), expected.path);
    assert.equal(review[key].sha256, expected.sha256);
  }
  assert.equal(resolve(producerCwd, review.outputs.svg.path), figure.nativeOutputs.svg.path);
  assert.equal(review.outputs.svg.sha256, figure.nativeOutputs.svg.sha256);
  figures.push({
    id: figure.id,
    source: figure.source,
    sourceDimensions,
    fullFrozenZHENVerbatim: true,
    spec: figure.nativeOutputs.spec,
    svg: figure.nativeOutputs.svg,
    render: figure.nativeOutputs.render,
    preview: preview.screenshot,
    actualMediaWidths: preview.widths.map((width) => width.mediaWidth),
    nativeReview: record(reviewPath),
    nativeReviewRelativePathBase: producerCwd,
    nativeRenderAndWidthReceiptsReused: true,
    rerendered: false,
  });
}

const result = {
  schema: 'independent-figure-binding-verification@1',
  status: 'pass',
  verifiedAt: new Date().toISOString(),
  inputFreezes: inputs.map(([path]) => record(path)),
  declaredHashRecordsVerified: bindings.length,
  uniqueDeclaredFilesVerified: new Set(bindings.map((binding) => binding.path)).size,
  sourceInventory: record(resolve(evidence, 'source-inventory.json')),
  originalSCI: 'PASS',
  affectedZHEN: 'PASS',
  unchangedOrRepairedTextBlockBindings: textBindings,
  figures,
  scope: {
    onlyWrites: resolve(evidence, 'binding-verification.json'),
    nativeRenderCalls: 0,
    browserCalls: 0,
    imageOpens: 0,
    sourceReplay: false,
    geometryAssertionEngineRerun: false,
    authorOnlyReviewsUsedAsApproval: false,
    fullCardApproval: false,
  },
};
writeFileSync(resolve(evidence, 'binding-verification.json'), `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  status: result.status,
  declaredHashRecordsVerified: result.declaredHashRecordsVerified,
  uniqueDeclaredFilesVerified: result.uniqueDeclaredFilesVerified,
  textBlockBindings: textBindings.length,
  figures: figures.map((figure) => ({ id: figure.id, nativeReview: figure.nativeReview })),
}, null, 2));
