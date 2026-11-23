import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187';
assert.equal(process.cwd(), root);
const directory = path.dirname(fileURLToPath(import.meta.url));
const id = 'fig-choice-4m-992-measure';
const specPath = path.join(directory, `${id}.spec.json`);
const svgPath = path.join(directory, `${id}.svg`);
const renderPath = path.join(directory, `${id}.render.json`);
const previewPath = path.join(directory, `${id}.full-normal640.png`);
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const render = JSON.parse(fs.readFileSync(renderPath, 'utf8'));
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const near = (actual, expected, tolerance = 1e-10) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
const vector = (from, to) => [to[0] - from[0], to[1] - from[1]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
const radiansToDegrees = value => value * 180 / Math.PI;
const names = ['A', 'B', 'C', 'D'];
const sqrt3 = Math.sqrt(3);
const exactBasis = [[0, 0], [5, 0], [5, 2], [7 / (1 + sqrt3), 7 * sqrt3 / (1 + sqrt3)]];
const expectedDegrees = [60, 90, 135, 75];
const expectedCosines = [0.5, 0, -Math.SQRT1_2, (Math.sqrt(6) - Math.sqrt(2)) / 4];
const objects = new Map(spec.objects.map(object => [object.id, object]));

assert.equal(spec.id, id);
assert.equal(spec.mode, 'deterministic');
assert.ok(spec.source.authoredBasis);
assert.equal('image' in spec.source, false);
assert.equal(spec.source.authoritativeText[0].text, '画一个四边形，量出每个角的大小。');
assert.deepEqual(spec.display, { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 });
assert.equal(spec.objects.length, 12);
assert.deepEqual(spec.objects.filter(object => object.visible !== false).map(object => object.type).sort(),
  ['segment', 'segment', 'segment', 'segment', 'text', 'text', 'text', 'text']);
const points = names.map((name, index) => {
  const point = objects.get(name);
  assert.equal(point.type, 'point');
  assert.equal(point.visible, false);
  point.at.forEach((coordinate, axis) => near(coordinate, exactBasis[index][axis], 1e-12));
  const label = objects.get(`${name}-letter`);
  assert.equal(label.text, name);
  assert.deepEqual(label.at, point.at);
  assert.ok(label.fontSize >= 20);
  assert.deepEqual(spec.source.inventory[index].objects.includes(`${name}-letter`), true);
  return point.at;
});
near(points[3][0] + points[3][1], 7);
near(points[3][1] / points[3][0], sqrt3);
const measurements = points.map((vertex, index) => {
  const incoming = vector(vertex, points[(index + 3) % 4]);
  const outgoing = vector(vertex, points[(index + 1) % 4]);
  const product = dot(incoming, outgoing);
  const determinant = cross(incoming, outgoing);
  const lengths = Math.hypot(...incoming) * Math.hypot(...outgoing);
  assert.ok(lengths > 0);
  assert.ok(determinant < 0, `${names[index]} is not a convex CCW vertex`);
  const cosine = product / lengths;
  const acosDegrees = radiansToDegrees(Math.acos(Math.max(-1, Math.min(1, cosine))));
  const atan2Degrees = radiansToDegrees(Math.atan2(Math.abs(determinant), product));
  near(cosine, expectedCosines[index]);
  near(acosDegrees, expectedDegrees[index]);
  near(atan2Degrees, expectedDegrees[index]);
  return { vertex: names[index], at: vertex, incoming, outgoing, dot: product, cross: determinant,
    cosine, acosDegrees, atan2Degrees, expectedDegrees: expectedDegrees[index] };
});
const [xMin, yMax, xMax, yMin] = spec.canvas.boundingBox;
const scaleX = spec.canvas.width / (xMax - xMin);
const scaleY = spec.canvas.height / (yMax - yMin);
near(scaleX, 100);
near(scaleY, 100);
assert.equal(spec.canvas.keepAspectRatio, true);
const expectedScreen = points.map(([x, y]) => [(x - xMin) * scaleX, (yMax - y) * scaleY]);
assert.equal(render.status, 'pass');
assert.equal(render.renderer.name, 'JSXGraph');
assert.equal(render.spec.sha256, sha256(specPath));
assert.equal(render.output.svg.sha256, sha256(svgPath));
assert.deepEqual(render.collisions, []);
assert.equal(render.labels, 4);
assert.deepEqual(render.displayChecks.map(item => item.status), ['pass']);
near(render.displayChecks[0].measuredMinPx, 24);
const png = fs.readFileSync(previewPath);
assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
assert.equal(png.readUInt32BE(16), 640);
assert.equal(png.readUInt32BE(20), 600);

const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
const browser = await chromium.launch({ headless: true });
let screen;
try {
  const page = await browser.newPage({ viewport: { width: 640, height: 600 }, deviceScaleFactor: 1 });
  await page.route('**/*', route => route.abort());
  await page.setContent(`<style>
    :root { --ld-figure-ink:#15201f; --ld-figure-paper:#fff; }
    html,body { margin:0; }
    .figure-scroll { width:640px; overflow-x:auto; }
    svg { display:block; width:640px; height:auto; flex-shrink:0; }
  </style><div class="figure-scroll">${fs.readFileSync(svgPath, 'utf8')}</div>`);
  screen = await page.locator('svg').evaluate(svg => {
    const matrix = svg.getScreenCTM();
    const visible = node => {
      for (let current = node; current && current instanceof Element; current = current.parentElement) {
        const style = getComputedStyle(current);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
      }
      return true;
    };
    const rect = svg.getBoundingClientRect();
    const edges = [...svg.querySelectorAll('line')].filter(visible).map(line => ({
      id: line.id,
      from: [Number(line.getAttribute('x1')), Number(line.getAttribute('y1'))],
      to: [Number(line.getAttribute('x2')), Number(line.getAttribute('y2'))],
      strokeWidth: Number(getComputedStyle(line).strokeWidth.replace('px', ''))
    }));
    const labels = [...svg.querySelectorAll('text')].filter(visible).map(text => {
      const box = text.getBoundingClientRect();
      return { text: text.textContent, fontSize: Number(getComputedStyle(text).fontSize.replace('px', '')),
        box: { x: box.x - rect.x, y: box.y - rect.y, width: box.width, height: box.height } };
    });
    const extraVisibleGeometry = [...svg.querySelectorAll('path,polygon,polyline,circle,ellipse,rect,image,foreignObject')]
      .filter(node => !node.closest('defs') && visible(node)).map(node => ({ tag: node.tagName, id: node.id }));
    const wrapper = svg.parentElement;
    wrapper.scrollLeft = wrapper.scrollWidth;
    return { width: rect.width, height: rect.height, viewBox: svg.getAttribute('viewBox'),
      intrinsicWidth: svg.getAttribute('width'), intrinsicHeight: svg.getAttribute('height'),
      matrix: { a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d, e: matrix.e, f: matrix.f },
      edges, labels, extraVisibleGeometry, deviceScaleFactor: window.devicePixelRatio,
      scroll: { clientWidth: wrapper.clientWidth, scrollWidth: wrapper.scrollWidth, reachedEnd:
        wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 1 } };
  });
} finally {
  await browser.close();
}
near(screen.width, 640);
near(screen.height, 600);
assert.equal(screen.viewBox, '0 0 640 600');
assert.equal(screen.intrinsicWidth, '640');
assert.equal(screen.intrinsicHeight, '600');
assert.equal(screen.deviceScaleFactor, 1);
near(screen.matrix.a, 1);
near(screen.matrix.d, 1);
near(screen.matrix.b, 0);
near(screen.matrix.c, 0);
near(Math.hypot(screen.matrix.a, screen.matrix.b) * scaleX,
  Math.hypot(screen.matrix.c, screen.matrix.d) * scaleY);
assert.ok(screen.scroll.reachedEnd);
assert.deepEqual(screen.extraVisibleGeometry, []);
assert.equal(screen.edges.length, 4);
assert.deepEqual(screen.labels.map(label => label.text).sort(), names);
const actualScreen = new Map();
for (const [index, name] of names.entries()) {
  const next = names[(index + 1) % 4];
  const edgeId = `edge-${name}${next}`;
  assert.equal(objects.get(edgeId).from, name);
  assert.equal(objects.get(edgeId).to, next);
  const edge = screen.edges.find(item => item.id === `ld-${id}_ld-${edgeId}`);
  assert.ok(edge, `missing ${edgeId}`);
  edge.from.forEach((coordinate, axis) => near(coordinate, expectedScreen[index][axis], 1e-7));
  edge.to.forEach((coordinate, axis) => near(coordinate, expectedScreen[(index + 1) % 4][axis], 1e-7));
  actualScreen.set(name, edge.from);
  for (const endpoint of [edge.from, edge.to]) {
    assert.ok(endpoint[0] > edge.strokeWidth / 2 && endpoint[0] < 640 - edge.strokeWidth / 2);
    assert.ok(endpoint[1] > edge.strokeWidth / 2 && endpoint[1] < 600 - edge.strokeWidth / 2);
  }
}
const screenAngles = names.map((name, index) => {
  const vertex = actualScreen.get(name);
  const u = vector(vertex, actualScreen.get(names[(index + 3) % 4]));
  const v = vector(vertex, actualScreen.get(names[(index + 1) % 4]));
  const degrees = radiansToDegrees(Math.atan2(Math.abs(cross(u, v)), dot(u, v)));
  near(degrees, expectedDegrees[index], 1e-7);
  return { vertex: name, degrees };
});
for (const label of screen.labels) {
  assert.ok(label.fontSize >= 20);
  assert.ok(label.box.width > 0 && label.box.height > 0);
  assert.ok(label.box.x >= 0 && label.box.y >= 0);
  assert.ok(label.box.x + label.box.width <= 640 && label.box.y + label.box.height <= 600);
}
const report = { status: 'pass', role: 'author mechanical evidence, not independent approval',
  figure: id, measurements, scale: { xPxPerUnit: scaleX, yPxPerUnit: scaleY },
  screen, screenAngles, preview: { path: previewPath, width: 640, height: 600,
    covers: ['full canvas', 'normal 640px scroll-media width'], imageLoadsByThisScript: 0 },
  bindings: [specPath, svgPath, renderPath, previewPath].map(file => ({ path: file, sha256: sha256(file) })) };
fs.writeFileSync(path.join(directory, 'check-REPAIR1.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ status: report.status, angles: measurements.map(item => ({
  vertex: item.vertex, dotAcos: item.acosDegrees, crossDotAtan2: item.atan2Degrees })),
  screenAngles, scale: report.scale, labelsPx: screen.labels.map(item => item.fontSize),
  preview: report.preview, independentApproval: false }, null, 2));
