import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const out = path.dirname(fileURLToPath(import.meta.url));
const abs = file => path.resolve(root, file);
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(abs(file))).digest('hex');
const binding = file => ({ path: abs(file), bytes: fs.statSync(abs(file)).size, sha256: hash(file) });
const read = file => JSON.parse(fs.readFileSync(abs(file), 'utf8'));
const write = (name, value) => fs.writeFileSync(path.join(out, name),
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const checkBinding = item => {
  const actual = binding(item.path);
  assert.equal(actual.sha256, item.sha256, item.path);
  if (item.bytes !== undefined) assert.equal(actual.bytes, item.bytes, item.path);
  return actual;
};
const rawBase = '.tmp/stemrobin-184-six/n88-raw-assembly/artifacts/10c/editions/modern-us-neutral';
const canonicalBase = 'ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral';
const lessonRel = 'lessons/ana10-c6-s3-n88';
const expected = {
  'lesson.json': 'c86cc2b5fb3e6e6615de0a15096c8acbfd70fd2f048505c09d3d6853c3d4ad20',
  'exercises.json': '4829df629eb4486ec5469270b5fc6c329ad1b09fd34ea98685b28fc28eb0a95c',
  'figures.json': '1543ec1f9191b2f253897a6b99c1906378ef0377d335cfc99a7f7a0bcc636acf',
  'adaptation.audit.json': '8c62925f125c32772ccd9c24737d710eb394af5c31834e87ce22647600f8277a',
};
const report = {
  schema: 'stemrobin1846/n88-ready-affected-intake@1', status: 'RUNNING',
  cwd: root, files: [], figures: [], affectedBlocks: [0,5,8,12,17,21,23,26],
  noFigurePixelDecodesOrViews: true, historicalProvenanceIsNotRuntimeDependency: true,
};
try {
  for (const [name, sha256] of Object.entries(expected)) {
    const current = `${canonicalBase}/${lessonRel}/${name}`;
    const raw = `${rawBase}/${lessonRel}/${name}`;
    assert.equal(hash(current), sha256, current);
    assert.equal(hash(raw), sha256, raw);
    assert(fs.readFileSync(abs(current)).equals(fs.readFileSync(abs(raw))));
    report.files.push({ canonical: binding(current), raw: binding(raw), byteExact: true });
  }
  const textHTML = '.tmp/stemrobin-184-six/n88-raw-assembly/work/render/10c/modern-us-neutral/ana10-c6-s3-n88/text.html';
  assert.equal(hash(textHTML), 'cc83c93414b6c1be03a0451e8647a7a36880d505455dbfe62cc0306f888d8412');
  report.textHTML = binding(textHTML);
  const writtenHTML = textHTML.replace('/text.html', '/exercises.html');
  assert.equal(hash(writtenHTML), 'b9777739bc5dbeb59befcfc0e1e55ce174b6a5bd933da4142357e089078deb85');
  report.writtenHTMLHashOnlyNotOpened = binding(writtenHTML);
  const promotionFile = '.tmp/stemrobin-184-six/n88-canonical-ready/promotion.json';
  assert.equal(hash(promotionFile), '71b258bad2a63323315c1475eb0d1e5fedf0334b1406f1c9702790de4f33a487');
  report.promotion = binding(promotionFile);
  const promotion = read(promotionFile);
  assert.deepEqual(promotion.promotedFigures.map(f => f.figure), ['fig-38','fig-39','fig-40','fig-41']);
  for (const item of promotion.promotedFigures) {
    const bindings = Object.fromEntries(['originalSpec','spec','svg','render','review']
      .map(key => [key, checkBinding(item[key])]));
    const oldSpec = read(item.originalSpec.path);
    const spec = read(item.spec.path);
    const oldImagePath = oldSpec.source.image.path;
    const newImagePath = spec.source.image.path;
    assert.notEqual(oldImagePath, newImagePath);
    const adjusted = structuredClone(oldSpec);
    adjusted.source.image.path = newImagePath;
    assert.deepEqual(spec, adjusted, `${item.figure}: only source image path may differ`);
    checkBinding(spec.source.image);
    assert(newImagePath.startsWith('ssot-resources/'));
    const rawSvg = `${rawBase}/figures/${item.figure}.svg`;
    assert(fs.readFileSync(abs(rawSvg)).equals(fs.readFileSync(abs(item.svg.path))));
    const render = read(item.render.path);
    const review = read(item.review.path);
    assert.equal(render.status, 'pass');
    assert.equal(review.status, 'pass');
    assert.equal(render.figure, item.figure);
    assert.equal(review.figure, item.figure);
    const activeBindings = [
      render.spec, render.output.svg, review.source, review.spec,
      review.render, review.outputs.svg, ...(render.assets ?? []),
    ];
    for (const active of activeBindings) {
      assert(active.path.startsWith('ssot-resources/'), `${item.figure}: durable runtime path`);
      checkBinding(active);
    }
    const oldReview = read(`${rawBase}/figures/${item.figure}.review.json`);
    const oldRender = read(`${rawBase}/figures/${item.figure}.render.json`);
    assert.equal(review.notes, oldReview.notes, `${item.figure}: substantive notes reused`);
    assert.equal(review.reviewedAt, oldReview.reviewedAt);
    const expectedReview = structuredClone(oldReview);
    expectedReview.source = review.source;
    expectedReview.spec = review.spec;
    expectedReview.render = review.render;
    expectedReview.outputs = review.outputs;
    expectedReview.promotion = review.promotion;
    assert.deepEqual(review, expectedReview);
    const expectedRender = structuredClone(oldRender);
    expectedRender.spec = render.spec;
    expectedRender.output = render.output;
    expectedRender.promotion = render.promotion;
    assert.deepEqual(render, expectedRender);
    assert.equal(review.promotion.originalContentReviewAndDisplayEvidenceReused, true);
    assert.equal(review.promotion.pathBindingOnly, true);
    assert.equal(review.promotion.mathematicalOrVisualContentChanges, 0);
    assert.equal(render.promotion.producerOrVisualReviewReplayed, false);
    assert.deepEqual(render.promotion.changedSpecFields, ['/source/image/path']);
    report.figures.push({ figure: item.figure, bindings, changedSpecFields: ['/source/image/path'],
      oldImagePath, newImagePath, svgRaw: binding(rawSvg), svgByteExact: true,
      activeBindings: activeBindings.map(checkBinding),
      substantiveReviewNotesExact: true, renderMeasurementsExact: true,
      displayPASSReused: render.displayChecks, historicalProvenanceNotRequiredAtRuntime: true });
  }
  const receiptFile = '.tmp/stemrobin-184-six/n88-stage-executions/canonical-finalize-first/execution.json';
  const receipt = read(receiptFile);
  assert.equal(receipt.cwd, root);
  assert.equal(receipt.exitCode, 0);
  assert.equal(receipt.signal, null);
  assert.equal(receipt.launchError, null);
  report.nativeFinalizerReused = {
    receipt: binding(receiptFile), cwd: receipt.cwd, command: receipt.command,
    argv: receipt.argv, exitCode: receipt.exitCode,
    streams: Object.fromEntries(Object.entries(receipt.streams).map(([key, item]) =>
      [key, checkBinding(item)])), replayed: false,
  };
  const lesson = read(`${canonicalBase}/${lessonRel}/lesson.json`);
  assert.equal(lesson.status, 'ready');
  const require = createRequire(abs('.claude/skills/ld-s10y-lesson/package.json'));
  const { proseOutline } = require(abs('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
  const outline = proseOutline(lesson.prose);
  assert.equal(outline.length, 50);
  const boundaries = lesson.section_breaks.map((pair, number) => {
    const matches = outline.filter((p, i) => i > 0
      && outline[i - 1].text === pair.before && p.text === pair.after);
    assert.equal(matches.length, 1, `boundary ${number}`);
    return { number, beforeIndex: matches[0].index - 1, afterIndex: matches[0].index, ...pair };
  });
  assert.equal(boundaries.length, 5);
  report.targets = outline.filter(p => report.affectedBlocks.includes(p.blockIndex));
  report.boundaries = boundaries;
  report.paragraphCount = outline.length;
  write('targets.json', { outline, affectedBlocks: report.affectedBlocks, boundaries,
    html: report.textHTML, canonicalLesson: report.files[0].canonical });
  report.status = 'PASS';
} catch (error) {
  report.status = 'HOLD';
  report.firstFailure = { message: String(error), stack: error.stack };
  process.exitCode = 1;
} finally {
  write('intake.json', report);
  console.log(JSON.stringify(report, null, 2));
}
