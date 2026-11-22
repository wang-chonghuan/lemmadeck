import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const require = createRequire(path.join(repo, 'app/package.json'));
const { chromium } = require('playwright-core');
const revision = Number(process.argv[2]);
assert.ok(revision === 2 || revision === 3);
const digest = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const binding = (file) => ({ path: file, sha256: digest(file), bytes: fs.statSync(file).size });
const specPath = path.join(root, `spec.r${revision}.json`);
const svgPath = path.join(root, `fig-205.r${revision}.svg`);
const renderPath = path.join(root, `fig-205.r${revision}.render.json`);
const reportPath = path.join(root, `mobile.r${revision}.json`);
assert.ok(!fs.existsSync(reportPath), 'Refusing to replay completed mobile evidence.');
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const nativeReport = JSON.parse(fs.readFileSync(renderPath, 'utf8'));
assert.equal(nativeReport.status, 'pass');
assert.equal(nativeReport.spec.sha256, digest(specPath));
assert.equal(nativeReport.output.svg.sha256, digest(svgPath));
const svg = fs.readFileSync(svgPath, 'utf8');
const executablePath = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean).find((candidate) => fs.existsSync(candidate));
assert.ok(executablePath, 'An existing local Chromium is required.');
const browser = await chromium.launch({ executablePath, headless: true });
const results = [];
const errors = [];
const networkRequests = [];
try {
  for (const width of [300, 358]) {
    assert.ok(spec.display.widths.includes(width));
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
    });
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.route('**/*', (route) => {
      networkRequests.push(route.request().url());
      return route.abort();
    });
    await page.setContent(`<!doctype html>
      <html><head><meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:">
      <style>
        html,body{margin:0;background:#fff;color:#172120;}
        #media{width:${width}px;max-width:${spec.display.maxWidthPx}px;margin:16px auto;}
        #media svg{display:block;width:100%;height:auto;}
      </style></head><body><div id="media">${svg}</div></body></html>`);
    await page.evaluate(() => document.fonts.ready);
    const measured = await page.evaluate(({ minTextPx }) => {
      const media = document.getElementById('media');
      const figure = media.querySelector('svg');
      const rect = figure.getBoundingClientRect();
      const matrix = figure.getScreenCTM();
      const labels = [...figure.querySelectorAll('text')].map((node) => {
        const ctm = node.getScreenCTM();
        const px = Number(node.getAttribute('font-size')) * Math.hypot(ctm.a, ctm.b);
        const bounds = node.getBoundingClientRect();
        return {
          id: node.getAttribute('data-label-id'),
          text: node.textContent,
          px,
          bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height },
          insideMedia: bounds.left >= rect.left && bounds.right <= rect.right &&
            bounds.top >= rect.top && bounds.bottom <= rect.bottom,
        };
      });
      return {
        viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
        actualMedia: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        screenCTM: { a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d, e: matrix.e, f: matrix.f },
        minTextPx,
        measuredMinPx: Math.min(...labels.map((label) => label.px)),
        labels,
        pageHorizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      };
    }, { minTextPx: spec.display.minTextPx });
    assert.ok(Math.abs(measured.actualMedia.width - width) < 0.01, 'Measure the media, not its container or nominal viewport.');
    assert.ok(Math.abs(measured.actualMedia.height - width * spec.canvas.height / spec.canvas.width) < 0.1);
    assert.equal(measured.viewport.width, 390);
    assert.ok(measured.measuredMinPx >= spec.display.minTextPx);
    assert.ok(measured.labels.every((label) => label.insideMedia));
    assert.ok(!measured.pageHorizontalOverflow);
    const pngPath = path.join(root, `fig-205.r${revision}.media${width}.png`);
    const screenshot = await page.locator('#media svg').screenshot({ path: pngPath });
    const pixels = await page.evaluate(async (dataUrl) => {
      const image = new Image();
      image.src = dataUrl;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let inkPixels = 0;
      let nearBlackPixels = 0;
      for (let index = 0; index < data.length; index += 4) {
        if (data[index] < 220 || data[index + 1] < 220 || data[index + 2] < 220) inkPixels++;
        if (data[index] < 32 && data[index + 1] < 32 && data[index + 2] < 32) nearBlackPixels++;
      }
      return {
        width: canvas.width, height: canvas.height,
        inkPixels, nearBlackPixels,
        inkFraction: inkPixels / (canvas.width * canvas.height),
      };
    }, `data:image/png;base64,${screenshot.toString('base64')}`);
    assert.equal(pixels.width, width);
    assert.ok(pixels.inkPixels > 200 && pixels.inkFraction < 0.25, 'Reject blank or black raster.');
    const htmlPath = path.join(root, `fig-205.r${revision}.media${width}.html`);
    fs.writeFileSync(htmlPath, await page.content());
    results.push({ status: 'pass', declaredWidth: width, ...measured, pixels, screenshot: binding(pngPath), html: binding(htmlPath) });
    await page.close();
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(networkRequests, []);
} finally {
  await browser.close();
}
const report = {
  schema: 'same188-6/author-offline-mobile@1',
  role: 'AUTHOR_ONLY_NOT_REVIEW',
  status: 'pass',
  cumulativeContentRevision: revision,
  spec: binding(specPath),
  svg: binding(svgPath),
  nativeRender: binding(renderPath),
  browser: { engine: 'Chromium', executablePath, headless: true, closed: true },
  surface: 'Offline native SVG rendered as inline instructional media, at actual measured 300/358px within a 390x844 mobile viewport. Not live product acceptance or independent review.',
  results,
  errors,
  networkRequests,
  sourceReopened: false,
  nativeRenderReplayed: false,
  independentSourceMathDisplayReview: 'pending elsewhere',
};
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status: report.status, report: binding(reportPath), widths: results.map((result) => ({ width: result.actualMedia.width, height: result.actualMedia.height, minTextPx: result.measuredMinPx, pixels: result.pixels })) }));
