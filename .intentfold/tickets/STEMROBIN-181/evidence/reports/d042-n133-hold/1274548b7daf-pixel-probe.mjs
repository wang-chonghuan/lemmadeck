import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const E = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d040-9p-fig300-independent-evidence');
const require = createRequire(path.join(W, 'app/package.json'));
const { chromium } = require('playwright');
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const source = path.join(W, 'ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-300.png');
const candidate = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d040-fig300-path-binding/fig-300.svg');

delete process.env.PWDEBUG;
const browser = await chromium.launch({ headless: true });
try {
  if (process.argv.includes('--candidate')) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const svg = fs.readFileSync(candidate, 'utf8');
    const checks = [];
    for (const width of [640, 316]) {
      await page.setViewportSize(width === 316 ? { width: 390, height: 844 } : { width: 1440, height: 1200 });
      await page.setContent(`<html><body style="margin:0;background:white"><div id="media" style="width:${width}px;margin:0">${svg}</div></body></html>`);
      await page.locator('svg').evaluate((node, targetWidth) => {
        node.style.width = `${targetWidth}px`;
        node.style.height = 'auto';
        node.style.display = 'block';
      }, width);
      await page.evaluate(() => document.fonts.ready);
      const measurements = await page.locator('svg').evaluate((node) => {
        const screenBox = (element) => {
          const box = element.getBBox();
          const matrix = element.getScreenCTM();
          const corners = [[box.x, box.y], [box.x + box.width, box.y], [box.x, box.y + box.height], [box.x + box.width, box.y + box.height]]
            .map(([x, y]) => new DOMPoint(x, y).matrixTransform(matrix));
          const x = Math.min(...corners.map((p) => p.x));
          const y = Math.min(...corners.map((p) => p.y));
          return { x, y, width: Math.max(...corners.map((p) => p.x)) - x, height: Math.max(...corners.map((p) => p.y)) - y };
        };
        const media = node.getBoundingClientRect();
        const visible = (element) => !element.closest('defs') && getComputedStyle(element).display !== 'none' && getComputedStyle(element).visibility !== 'hidden';
        const labels = [...node.querySelectorAll('text')].filter(visible).map((element) => {
          const matrix = element.getScreenCTM();
          return {
            id: element.getAttribute('data-label-id'),
            text: element.textContent,
            fontSizeCssPx: Number.parseFloat(getComputedStyle(element).fontSize),
            screenFontPx: Number.parseFloat(getComputedStyle(element).fontSize) * Math.hypot(matrix.a, matrix.b),
            ...screenBox(element),
          };
        });
        const clippedLabels = labels.filter((box) => box.x < media.x - 0.01 || box.y < media.y - 0.01 || box.x + box.width > media.right + 0.01 || box.y + box.height > media.bottom + 0.01);
        const overlaps = [];
        for (let i = 0; i < labels.length; i++) {
          for (let j = i + 1; j < labels.length; j++) {
            const a = labels[i];
            const b = labels[j];
            if (a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y) overlaps.push([a.id, b.id]);
          }
        }
        const shapes = [...node.querySelectorAll('path,line,polygon,polyline,circle,ellipse,rect')].filter(visible).map((element) => ({
          id: element.id,
          tag: element.tagName,
          ...screenBox(element),
        }));
        const clippedShapeBoxes = shapes.filter((box) => box.x < media.x - 0.01 || box.y < media.y - 0.01 || box.x + box.width > media.right + 0.01 || box.y + box.height > media.bottom + 0.01);
        return {
          media: { x: media.x, y: media.y, width: media.width, height: media.height },
          viewBox: node.getAttribute('viewBox'),
          labelCount: labels.length,
          minimumScreenTextPx: Math.min(...labels.map((label) => label.screenFontPx)),
          labels,
          clippedLabels,
          overlaps,
          visibleShapeCount: shapes.length,
          clippedShapeBoxes,
        };
      });
      const output = path.join(E, `candidate-${width}px.png`);
      await page.locator('svg').screenshot({ path: output });
      const pixelStatistics = await page.evaluate(async (data) => {
        const image = new Image();
        image.src = data;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let inkPixels = 0;
        let opaquePixels = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i + 3] > 0) opaquePixels++;
          if (pixels[i + 3] > 0 && Math.min(pixels[i], pixels[i + 1], pixels[i + 2]) < 240) inkPixels++;
        }
        return { width: canvas.width, height: canvas.height, inkPixels, opaquePixels, totalPixels: canvas.width * canvas.height };
      }, `data:image/png;base64,${fs.readFileSync(output).toString('base64')}`);
      checks.push({
        viewport: page.viewportSize(),
        ...measurements,
        pixels: pixelStatistics,
        output: { path: output, sha256: sha256(fs.readFileSync(output)) },
        nativeFullResolution: width === 640,
      });
    }
    const receipt = {
      svg: { path: candidate, sha256: sha256(fs.readFileSync(candidate)) },
      browser: { version: browser.version(), headless: true, isolated: true, deviceScaleFactor: 1 },
      method: 'Rasterize existing SVG in an isolated browser; no JSXGraph import, geometry construction or renderer invocation.',
      checks,
      pageErrors: errors,
      fullCardDisplay: 'pending; media-only fixture is not full-card acceptance',
    };
    fs.writeFileSync(path.join(E, 'width-pixel-receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`);
    console.log(JSON.stringify(checks.map((check) => ({
      width: check.media.width,
      height: check.media.height,
      minimumScreenTextPx: check.minimumScreenTextPx,
      clippedLabels: check.clippedLabels,
      overlaps: check.overlaps,
      clippedShapeBoxes: check.clippedShapeBoxes,
      pixels: check.pixels,
      output: check.output,
    })), null, 2));
    await context.close();
  } else {
  const context = await browser.newContext({ viewport: { width: 900, height: 800 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.setContent('<html><body style="margin:0;background:white"><canvas id="pixels" width="720" height="690"></canvas></body></html>');
  const data = `data:image/png;base64,${fs.readFileSync(source).toString('base64')}`;
  const dimensions = await page.evaluate(async (url) => {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.getElementById('pixels');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 550, 85, 240, 230, 0, 0, 720, 690);
    return { width: image.naturalWidth, height: image.naturalHeight };
  }, data);
  const output = path.join(E, 'source-dial-3x.png');
  await page.locator('#pixels').screenshot({ path: output });
  const receipt = {
    source: { path: source, sha256: sha256(fs.readFileSync(source)), ...dimensions },
    crop: { sourceRectangle: [550, 85, 240, 230], scale: 3, interpolation: 'nearest-neighbor' },
    output: { path: output, sha256: sha256(fs.readFileSync(output)) },
    browser: { version: browser.version(), headless: true, isolated: true, deviceScaleFactor: 1 },
  };
  fs.writeFileSync(path.join(E, 'source-crop-receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(JSON.stringify(receipt, null, 2));
  await context.close();
  }
} finally {
  await browser.close();
}
