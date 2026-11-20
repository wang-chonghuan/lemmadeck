import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const candidate = path.join(repo, '.tmp/STEMROBIN-181/d1816-d141/figure05/candidate-2');
assert.equal(process.cwd(), repo);
const require = createRequire(path.join(repo, '.agents/skills/package.json'));
const { chromium } = require('playwright-core');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const binding = file => ({ path: file, sha256: hash(file) });
const specPath = path.join(candidate, 'fig-05.spec.json');
const svgPath = path.join(candidate, 'fig-05.svg');
const renderPath = path.join(candidate, 'fig-05.render.json');
const reportPath = path.join(candidate, 'author-preview.assertions.json');
assert(!fs.existsSync(reportPath), 'Do not overwrite preview evidence');
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const render = JSON.parse(fs.readFileSync(renderPath, 'utf8'));
assert.equal(render.status, 'pass');
assert.equal(render.spec.sha256, hash(specPath));
assert.equal(render.output.svg.sha256, hash(svgPath));
const svg = fs.readFileSync(svgPath, 'utf8');
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Figure 5</title>
<style>
html,body{margin:0;background:white;color:#111;font-family:Arial,sans-serif}
main{padding:20px;box-sizing:border-box;max-width:680px;margin:0 auto}
figure{margin:0;overflow-x:auto;max-width:100%}
figure>svg{display:block;width:640px;min-width:640px;height:520px}
body[data-theme="accent"]{--ld-figure-ink:#202124;--ld-figure-muted:#656565;--ld-figure-accent:#b91c1c}
body[data-theme="print"]{--ld-figure-ink:#000;--ld-figure-muted:#555;--ld-figure-accent:#000}
</style><body><main><figure aria-label="Figure 5">${svg}</figure></main></body></html>`;
const htmlPath = path.join(candidate, 'author-preview.html');
fs.writeFileSync(htmlPath, html);
const executablePath = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean).find(file => fs.existsSync(file));
assert(executablePath, 'Existing Chromium required');
const browser = await chromium.launch({ executablePath, headless: true });
const checks = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`file://${htmlPath}`);
  const actualPaths = await page.locator('#ld-fig-05-raw-path-layer > path').evaluateAll(nodes => nodes.map(node => ({
    d: node.getAttribute('d'), stroke: node.getAttribute('stroke'), fill: node.getAttribute('fill'),
    strokeWidth: Number(node.getAttribute('stroke-width')), dash: node.getAttribute('stroke-dasharray'),
    vectorEffect: node.getAttribute('vector-effect'),
  })));
  const specPaths = spec.objects.filter(item => item.type === 'svgPath');
  assert.equal(actualPaths.length, specPaths.length);
  actualPaths.forEach((actual, i) => {
    const expected = specPaths[i];
    assert.equal(actual.d, expected.d);
    assert.equal(actual.strokeWidth, expected.strokeWidth);
    assert(actual.stroke.includes('--ld-figure-'));
    assert.equal(actual.fill, 'none');
    assert.equal(actual.vectorEffect, 'non-scaling-stroke');
    assert.equal(Boolean(actual.dash), Boolean(expected.dash));
  });
  checks.push({ id: 'exported-svg-paths-bound', status: 'pass', paths: actualPaths.length, sameSpecPathAndStyle: true });
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const theme of ['neutral', 'accent', 'print']) {
      await page.locator('body').evaluate((body, theme) => { body.dataset.theme = theme; }, theme);
      const metrics = await page.locator('figure').evaluate(figure => {
        const svg = figure.querySelector('svg');
        const media = svg.getBoundingClientRect();
        const texts = [...svg.querySelectorAll('[data-label-id]')].map(text => {
          const matrix = text.getScreenCTM();
          const bbox = text.getBoundingClientRect();
          return {
            id: text.getAttribute('data-label-id'), text: text.textContent,
            px: Number(text.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
            box: { left: bbox.left - media.left, top: bbox.top - media.top, right: bbox.right - media.left, bottom: bbox.bottom - media.top },
            color: getComputedStyle(text).fill,
          };
        });
        const strokes = [...svg.querySelectorAll('#ld-fig-05-raw-path-layer > path')].map(p => getComputedStyle(p).stroke);
        return { mediaWidth: media.width, mediaHeight: media.height, viewportWidth: figure.clientWidth, scrollWidth: figure.scrollWidth, texts, strokes };
      });
      assert.equal(metrics.mediaWidth, 640);
      assert.equal(metrics.mediaHeight, 520);
      assert.equal(metrics.texts.length, 7);
      assert(metrics.texts.every(item => item.px >= 16));
      assert(metrics.texts.every(item => item.box.left >= 0 && item.box.top >= 0 && item.box.right <= 640 && item.box.bottom <= 520));
      assert(metrics.strokes.every(stroke => stroke !== 'none' && stroke !== 'rgb(255, 255, 255)'));
      for (let i = 0; i < metrics.texts.length; i++) for (let j = i + 1; j < metrics.texts.length; j++) {
        const a = metrics.texts[i].box, b = metrics.texts[j].box;
        assert(!(Math.min(a.right, b.right) > Math.max(a.left, b.left) && Math.min(a.bottom, b.bottom) > Math.max(a.top, b.top)));
      }
      checks.push({ id: `preview-${viewport.width}-${theme}`, status: 'pass', metrics });
    }
    await page.locator('body').evaluate(body => { body.dataset.theme = 'neutral'; });
    if (viewport.width === 390) {
      assert(await page.locator('figure').evaluate(f => f.scrollWidth > f.clientWidth));
      await page.locator('figure').evaluate(f => { f.scrollLeft = 0; });
      await page.screenshot({ path: path.join(candidate, 'author-mobile-scroll-start.png') });
      const end = await page.locator('figure').evaluate(f => {
        f.scrollLeft = f.scrollWidth;
        return { scrollLeft: f.scrollLeft, maxScroll: f.scrollWidth - f.clientWidth };
      });
      assert(end.maxScroll > 0);
      assert(Math.abs(end.scrollLeft - end.maxScroll) < 1);
      const rightAxisVisible = await page.locator('[data-label-id="distance-axis-label"]').evaluate(el => {
        const label = el.getBoundingClientRect();
        const host = el.closest('figure').getBoundingClientRect();
        return label.left >= host.left && label.right <= host.right;
      });
      assert(rightAxisVisible);
      checks.push({ id: 'author-mobile-scroll-end-reachable', status: 'pass', ...end, rightAxisLabelVisible: true });
      await page.screenshot({ path: path.join(candidate, 'author-mobile-scroll-end.png') });
    }
  }
  const pixels = await page.evaluate(async svgText => {
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgText)));
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = 640; canvas.height = 520;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white'; ctx.fillRect(0, 0, 640, 520);
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, 640, 520).data;
    let nonwhite = 0, white = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] < 240 || data[i + 1] < 240 || data[i + 2] < 240) nonwhite++;
      else white++;
    }
    return { nonwhite, white, total: 640 * 520 };
  }, svg);
  assert(pixels.nonwhite > 1000 && pixels.nonwhite < pixels.total * 0.2);
  assert(pixels.white > pixels.total * 0.8);
  checks.push({ id: 'exported-svg-nonblank-not-black', status: 'pass', ...pixels });
  assert.deepEqual(errors, []);
  checks.push({ id: 'no-preview-page-errors', status: 'pass' });
} finally {
  await browser.close();
}
const report = {
  schema: 'STEMROBIN-181/author-preview-assertions@1',
  status: 'pass',
  independentApproval: false,
  productAcceptance: false,
  surface: 'Isolated offline author-preview SVG host, not the native lesson/product integration.',
  browser: { headed: false, reason: 'Author-only SVG inspection; native headed/product acceptance remains with parent after independent approval.' },
  spec: binding(specPath), svg: binding(svgPath), render: binding(renderPath), html: binding(htmlPath),
  screenshots: ['author-mobile-scroll-start.png', 'author-mobile-scroll-end.png'].map(name => binding(path.join(candidate, name))),
  checks,
};
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status: report.status, checks: checks.length, report: reportPath, imagePayloadsReturned: 0 }));
