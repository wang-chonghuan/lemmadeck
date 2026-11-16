import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const ticket = '.intentfold/tickets/STEMROBIN-181';
const work = '.tmp/STEMROBIN-181/9p-n53-figures';
const read = async p => JSON.parse(await fs.readFile(p, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const freeze = await read(`${work}/author-freeze.json`);
for (const b of [freeze.inputs.template, freeze.inputs.sourceLesson, freeze.inputs.sourceImage,
  freeze.context, freeze.spec, freeze.svg, freeze.nativeRender, ...freeze.previews]) {
  assert.deepEqual(await bind(b.path), { path: b.path, sha256: b.sha256 });
}
assert.equal(freeze.nativeRenderStatus, 'pass');
const spec = await read(freeze.spec.path);
const manifest = await read(freeze.previewManifest.path);
assert.deepEqual(spec.display.widths, [640, 331, 342]);
const reportPath = `${ticket}/tmp/9p-n53-figure-review.json`;
await fs.writeFile(reportPath, JSON.stringify({
  ticket: 'STEMROBIN-181', lesson: freeze.lesson, status: 'pass',
  reviewer: 'Main, independent of Einstein author',
  order: 'Opened actual original91 and read complete current n53 context before final modern previews/spec; then actually opened all three640/331/342 preview PNGs and compared inventory/assertions.',
  authorFreeze: await bind(`${work}/author-freeze.json`),
  figures: [{
    id: 'fig-91', status: 'pass',
    bindings: {
      source: freeze.inputs.sourceImage, context: freeze.context, lesson: freeze.inputs.template,
      spec: freeze.spec, svg: freeze.svg, render: freeze.nativeRender,
    },
    inspectedPixels: freeze.previews,
    independentSourceInventory: [
      'Two side-by-side specimens: a rounded oblique top-face specimen with12 curved front-side bands, b13 sloping straight bands. Top-face rear outline/texture is not another side band.',
      'The b cross-boundaries slope downward to the right. Both outlines contain small nonuniform ledges, not one uniform displacement. No quantified offset or atom dots occur in the original.',
      'Each specimen has one outward upward and one outward downward tensile arrow, four total; these are load arrows, not the slip direction.',
      'Only subfigure labels occur, localized to Latin a/b consistently with current prose. No axes, measurement scale, atom grid, dislocation core or before-after model is invented.',
    ],
    visualObservations: [
      'Actually viewed640/331/342 pixels: all12 curved a-side bands plus top face and13 b bands remain complete. The short ledges and right-down band slope are visible. Source hatching is omitted without changing structure.',
      'Four arrowheads remain visible and correctly directed. Both Latin labels are legible and contained; no overlapping text, cropped lower band, black raster or exposed construction-point grid.',
      'Minimum label text is32/16.55/17.1px at640/331/342. Width/height stay stable; b rightmost corners and both bottom arrows/labels are visible.',
      'Figure illustrates the source simplified result of layer slip under tensile stress; current text explicitly distinguishes real local dislocation movement from simultaneous whole-plane motion.',
    ],
    assertions: 'Mapped displacement assertions cover every source contour anchor and ledge inside each inventory group;13 b-band object count and four arrow connects/direction assertions supplement rather than replace relationships. No rectangular source grid exists, so none is fabricated.',
    previewManifest: await bind(freeze.previewManifest.path),
    sourceRegularization: 'Clean deterministic contours preserve counts, slope signs and relative ledges; exact coordinate sizes are author regularization, not measured scientific data.',
    repairsUsed: 0, findings: [],
  }],
  nativePreviewRecord: manifest.status ?? 'author evidence only',
}, null, 2) + '\n', { flag: 'wx' });
execFileSync(process.execPath, [
  `${ticket}/tmp/promote-d005-figure.mjs`, '9p', freeze.lesson, 'fig-91', reportPath,
], { stdio: 'inherit' });
