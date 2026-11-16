import assert from 'node:assert/strict';
import { ticket, read, bind, verify, exists, immutableWrite } from './retain-d016-evidence.mjs';

const authorPath = `${ticket}/tmp/d020-n72-figures-author-freeze.json`;
await verify(authorPath, '9b30306ac560f3d0c7aac8e05a1ef1a75b2324b7de9ff2fa90d2d042e3d5111d');
const author = await read(authorPath);
const sciencePath = `${ticket}/tmp/9p-n72-science-review.json`;
const science = await read(sciencePath);
assert.equal(science.status, 'pass');
for (const binding of Object.values(author.bindings)) await verify(binding.path, binding.sha256);
const lesson = await read(author.bindings.lesson.path);
const authority = [lesson.printed_title, ...lesson.prose.map(block => block.text).filter(Boolean)]
  .map(text => ({ lesson: lesson.id, text }));
assert.deepEqual((await read(author.bindings.context.path)).authoritativeText, authority);
assert.deepEqual(author.figures.map(item => item.id), ['fig-134', 'fig-135', 'fig-136', 'fig-137']);
const observations = {
  'fig-134': {
    source: 'Original crop opened once. Two side-by-side panels contain thirteen connected dipoles each, with twenty-six circled charge signs per panel. Each inner dielectric has a hatched sampling rectangle containing three positive and three negative charge centers. Panel a preserves varied orientations and unsigned terminal leads; panel b has left-positive/right-negative plate signs and varied tilted dipoles with a rightward bias. No source numerical scale or field arrow is printed.',
    geometry: 'The inspected final spec maps every circled charge to its pair connector, signed center displacement and dielectric containment. Sampling rectangles retain the three-plus/three-minus center inventory. Rim endpoints are collinear with charge centers and lie on the corresponding circles. Vertical panel stacking, connector clearance and hatch spacing are modern uncalibrated layout; the varied directions are not universal full alignment or free charge transport.',
    widths: {
      640: 'Both complete panels visible in a vertical stack. All thirteen pairs per panel, sampling rectangles, outer plates and terminal leads are intact. Clear signs within circles; connectors terminate at rims and hatching does not obscure signs. Panel b polarity is plus left/minus right.',
      331: 'Opened at original331 width. Both a/b labels and all circled signs remain readable. The six sampling-region charge centers in each panel are distinct; connectors and hatch borders are visible without clipped plate ends or sign collisions.',
      342: 'Opened at original342 width. All dipoles and their nonuniform orientations remain visible. Both hatched regions have three positive and three negative centers; unsigned panel a and oppositely signed panel b remain distinct. No missing connector, cultural glyph or added field annotation.',
    },
  },
  'fig-135': {
    source: 'Original crop opened once. A tilted rod joins two open circles, lower-left and upper-right. The upper endpoint has a rightward force labeled vector F1 = +|q| vector E; the lower endpoint a leftward force labeled vector F2 = minus |q| vector E. A separate rightward E vector lies beside the rod, with its label below. No q endpoint labels or torque arc are printed.',
    geometry: 'Signed displacement and force-to-endpoint assertions preserve upper-positive/lower-negative force assignment. Equal force lengths, opposite horizontal directions and field parallelism agree with the frozen uniform-field text. The tilted rod produces the stated torque model; no rotation trajectory or calibrated field amplitude is invented.',
    widths: {
      640: 'Open endpoints and tilted connector clear. Upper F1 points right, lower F2 left, and the separate E arrow right. Both signed formulas, vector accents and subscripts are intact with no overlap or clipping.',
      331: 'Opened at original331 width. F1 = +|q|E and F2 = minus |q|E remain legible with vector accents and subscripts. All three arrows, open endpoints and rod are separate; no missing arrowhead or tofu.',
      342: 'Opened at original342 width. The two forces remain equal and opposite at the correct endpoints; E is independently visible. Both complete formulas have clear signs, magnitude bars and accents without collision.',
    },
  },
  'fig-136': {
    source: 'Original crop opened once. One horizontal rod joins two open endpoint circles. Left is labeled q with minus subscript, right q with plus subscript. One rightward E vector lies below, its label beneath the arrow. No force arrows, moment label or rotation arc are printed.',
    geometry: 'Negative-to-positive signed displacement is rightward and the rod is parallel to the field. Native assertions cover both endpoints and the sole E arrow. This is the source aligned schematic, not an added assertion that all real dipoles align perfectly.',
    widths: {
      640: 'Both open circles, horizontal rod, q-minus/q-plus subscripts and rightward E arrow are intact. E vector accent clear, with no collision or added force annotation.',
      331: 'Opened at original331 width. q-minus and q-plus subscripts remain distinct and the E-vector accent readable. Rod and arrow are separate; endpoints and arrowhead are not clipped.',
      342: 'Opened at original342 width. Left-negative/right-positive label order and sole rightward field arrow remain clear. No lost subscript, filled point or extra motion marking.',
    },
  },
  'fig-137': {
    source: 'Original crop opened once. Two outer vertical plates carry plus on the left and minus on the right, with mid-height terminal leads. An inner dielectric rectangle contains five dashed leftward polarization-field arrows, alternating with six solid rightward external-field arrows spanning the plates. The first solid arrow has E0 above near the right; the first dashed arrow has E1 above near the left.',
    geometry: 'The final spec preserves exactly six rightward solid and five leftward dashed arrows; every arrow has mapped endpoints, signed horizontal displacement and plate-normal relations. All dashed-field endpoints are inside the dielectric. Arrow lengths and row spacing are schematic, not relative field magnitude measurements. No total-field formula, sigma or bound-charge particle is added.',
    widths: {
      640: 'Six solid arrows point right between complete plates; five dashed arrows point left within the complete dielectric rectangle. Plus/minus and E0/E1 vector accents and subscripts are clear. Labels are detached from line strokes, with no overlap or clipping.',
      331: 'Opened at original331 width. Both signs, E0/E1 indices and vector accents are readable. All six solid and five dashed arrows retain distinguishable direction and style; both terminal leads and full dielectric boundary are visible.',
      342: 'Opened at original342 width. Opposed fields remain distinct: six rightward solid lines and five leftward dashed lines. Labels sit above their first respective rows; no intersecting text, missing arrowhead or clipped plate end.',
    },
  },
};
const figures = [];
for (const item of author.figures) {
  for (const binding of Object.values(item.bindings)) await verify(binding.path, binding.sha256);
  const b = item.bindings;
  const spec = await read(b.spec.path);
  const render = await read(b.render.path);
  assert.deepEqual(spec.source.authoritativeText, authority);
  assert.equal(render.status, 'pass');
  assert.equal(render.spec.sha256, b.spec.sha256);
  assert.equal(render.output.svg.sha256, b.svg.sha256);
  assert.equal(render.collisions.length, 0);
  for (const preview of item.previews) await verify(preview.path, preview.sha256);
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
const reportPath = `${ticket}/tmp/9p-n72-figure-review.json`;
assert.ok(!await exists(reportPath));
await immutableWrite(reportPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D020', lesson: lesson.id, status: 'pass',
  authorFreeze: await bind(authorPath), science: await bind(sciencePath), figures,
  archivedScienceFiguresTemplate: author.snapshots.figuresTemplate,
  inspectionBasis: 'One Main independent source/spec/figure pixel gate. Four original crops and twelve final previews opened once; existing native author validation/render evidence consumed without rerendering.',
  noRepeatedPixelInspectionOrRender: true, promotionPerformed: false,
}, null, 2)}\n`);
console.log(JSON.stringify({ status: 'pass', report: await bind(reportPath),
  figures: figures.map(item => item.id), renderOrPromoteCalls: 0 }));
