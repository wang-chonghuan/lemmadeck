import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { ticket, read, bind, verify, exists, immutableWrite } from './retain-d016-evidence.mjs';

const authorPath = `${ticket}/tmp/d019-n73-figures-author-freeze.json`;
await verify(authorPath, '02d0ac5c7acc89772d9ad950ad8ea74a5315819bc64d9fe5cf3d6b1a6f433094');
const author = await read(authorPath);
const sciencePath = `${ticket}/tmp/9p-n73-science-review.json`;
const science = await read(sciencePath);
assert.equal(science.status, 'pass');
const context = await read(author.bindings.context.path);
const lesson = await read(author.bindings.lesson.path);
const authority = [lesson.printed_title, ...lesson.prose.map(block => block.text).filter(Boolean)]
  .map(text => ({ lesson: lesson.id, text }));
assert.deepEqual(context.authoritativeText, authority);
for (const binding of Object.values(author.bindings)) await verify(binding.path, binding.sha256);
const archivePath = '.tmp/STEMROBIN-181/9p-d019-n73-figures/figures.template.science-snapshot.json';
assert.ok(!await exists(archivePath));
await verify(science.bindings.figuresTemplate.path, science.bindings.figuresTemplate.sha256);
await fs.copyFile(science.bindings.figuresTemplate.path, archivePath, fs.constants.COPYFILE_EXCL);
const observations = {
  'fig-138': {
    source: 'Original crop and640 preview were opened once in the preceding continuation. Seven leftward field arrows, B/D plates, overhead E vector, same-line points2 left/1 right and upper d2/Delta d plus lower d1 guides were observed. Those pixels were not reopened.',
    widths: {
      640: 'Prior continuation: all seven field arrows and separate dimension terminals complete; B/D, both numbered filled points and the E vector intact. No invented signs, calibrated values or collisions.',
      331: 'Opened once at original331 width. All seven field arrows point left. The E-vector accent, B/D,1/2 and d1/d2/Delta d remain readable. Both upper intervals share the point2 extension; lower d1 reaches point1. Complete plates and dimensions, no clipping or overlap.',
      342: 'Opened once at original342 width. B,2,1,D preserve their order, both filled points share a field line, and the d2 plus Delta d distances span d1. The overhead vector and subscripts are visible with separate dimension arrowheads; no added polarity signs.',
    },
    geometry: 'Native distance/displacement and same-line assertions agree with the inspected B-to2-to1 geometry. Field arrows and distance-guide arrows have distinct roles; no numeric scale is asserted.',
  },
  'fig-139': {
    source: 'Original crop opened once this continuation. Two vertical plates carry left-minus/right-plus, with six leftward field arrows.1 is the right endpoint and2 the left endpoint at equal height. The open curve bows downward and returns upward toward2, with an orthogonal staircase superposed. Overprinted low marks do not establish an exact original subdivision or direction-mark count.',
    widths: {
      640: 'Opened once at original640 width. Both signs, endpoint order and all six field arrows are intact. The open bowed curve has three leftward direction marks. Both descending and ascending staircase legs and its low central connection are visible. No added B/D, distance, work, loop or answer labels; no collisions or clipping.',
      331: 'Opened once at original331 width. Minus/plus and1/2 labels remain readable. The curved path arrows are distinguishable from six field arrows; fine horizontal and vertical staircase legs remain visible on both sides and through the low center. No missing plate end or clipped annotation.',
      342: 'Opened once at original342 width. All six leftward field arrows and opposite plate signs are clear. The downward-bowed open1-to2 path and staircase construction remain distinct. Endpoint labels are readable and no vector tofu, numerical givens or answer markings appear.',
    },
    geometry: 'The previously read native spec preserves equal endpoint height and signed1-to2 horizontal displacement. Each vertical leg is perpendicular and each horizontal leg parallel to the field; signed horizontal legs sum to endpoint displacement and vertical displacement sums to zero. The eight subdivisions and three curve direction marks are explicitly modern uncalibrated regularization, not claimed source counts.',
  },
};
const figures = [];
for (const item of author.figures) {
  const b = item.bindings;
  for (const binding of Object.values(b)) await verify(binding.path, binding.sha256);
  const spec = await read(b.spec.path);
  const render = await read(b.render.path);
  assert.deepEqual(spec.source.authoritativeText, authority);
  assert.equal(render.status, 'pass');
  assert.equal(render.spec.sha256, b.spec.sha256);
  assert.equal(render.output.svg.sha256, b.svg.sha256);
  const observed = observations[item.id];
  figures.push({
    id: item.id, status: 'pass', reviewer: 'Main, independent of Einstein figure author',
    bindings: { source: b.source, context: b.context, lesson: b.lesson,
      spec: b.spec, render: b.render, svg: b.svg },
    inspectedPixels: item.previews.map(preview => ({
      path: preview.path, sha256: preview.sha256, width: preview.width,
      actualOpenedByMain: true, openCount: 1, detail: 'original',
      inspection: observed.widths[preview.width],
    })),
    independentSourceAndPixelObservations: [observed.source, observed.geometry],
    targetedGeometryRepairs: item.budget.repairsUsed,
    initialIndependentGateConsumedOnce: true, findings: [],
  });
}
const reportPath = `${ticket}/tmp/9p-n73-figure-review.json`;
assert.ok(!await exists(reportPath));
await immutableWrite(reportPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D019', lesson: lesson.id, status: 'pass',
  authorFreeze: await bind(authorPath), science: await bind(sciencePath), figures,
  archivedScienceFiguresTemplate: await bind(archivePath),
  inspectionBasis: 'One Main independent figure gate continued across compaction; only previously unopened pixels inspected. Native author render evidence consumed, not rerun. Figure139 repair budget exhausted.',
  noRepeatedPixelInspectionOrRender: true,
}, null, 2)}\n`);
for (const item of figures) execFileSync(process.execPath, [
  `${ticket}/tmp/promote-d005-figure.mjs`, '9p', lesson.id, item.id, reportPath,
], { stdio: 'inherit' });
