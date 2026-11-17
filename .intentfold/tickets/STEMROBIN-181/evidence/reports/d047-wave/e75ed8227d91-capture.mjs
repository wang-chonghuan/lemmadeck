import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const A = path.dirname(fileURLToPath(import.meta.url));
const W = path.resolve(A, '../../../../..');
const require = createRequire(path.join(W, 'app/package.json'));
const { chromium } = require('playwright');
const L = 'phy10-c1-s5-n40';
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const measurements = [];
const errors = [];
const report = path.join(A, 'receipts/headed-media.json');
if (fs.existsSync(report)) throw new Error('Refusing repeated unchanged capture');
fs.mkdirSync(path.join(A, 'previews/screenshots'), { recursive: true });
const browser = await chromium.launch({ headless: false });
try {
  for (const language of ['zh', 'en']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    const html = path.join(A, `previews/${language}/${L}/text.html`);
    await page.goto(pathToFileURL(html).href, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const figure = page.getByRole('figure', { name: language === 'zh' ? '图 64' : 'Figure 64', exact: true });
    await figure.waitFor({ state: 'visible' });
    const image = figure.locator('img');
    await image.evaluate(img => img.decode());
    const observe = async (surface, phase) => {
      const item = await figure.evaluate((fig, names) => {
        const img = fig.querySelector('img');
        const media = fig.querySelector('.figure-media');
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 43;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, 64, 43);
        const pixels = ctx.getImageData(0, 0, 64, 43).data;
        let nonwhite = 0, black = 0, visible = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i + 3] > 0) visible += 1;
          if (Math.min(pixels[i], pixels[i + 1], pixels[i + 2]) < 242) nonwhite += 1;
          if (Math.max(pixels[i], pixels[i + 1], pixels[i + 2]) < 16) black += 1;
        }
        const rect = img.getBoundingClientRect();
        const body = document.documentElement;
        return {
          ...names, viewport: [innerWidth, innerHeight], mediaWidthPx: media.getBoundingClientRect().width,
          imageWidthPx: rect.width, imageHeightPx: rect.height,
          naturalSize: [img.naturalWidth, img.naturalHeight], containerWidthPx: fig.clientWidth,
          scrollWidthPx: fig.scrollWidth, scrollLeftPx: fig.scrollLeft,
          maxScrollLeftPx: fig.scrollWidth - fig.clientWidth,
          pageHorizontalOverflowPx: Math.max(0, body.scrollWidth - body.clientWidth),
          proseFontSizesPx: [...document.querySelectorAll('p.para')].map(p => parseFloat(getComputedStyle(p).fontSize)),
          figureLabelTextCount: fig.querySelectorAll('svg text').length,
          missingModernMedia: document.querySelectorAll('.err').length,
          raster: { visible, nonwhite, black, total: 64 * 43 },
        };
      }, { language, surface, phase });
      measurements.push(item);
      if (Math.abs(item.imageWidthPx - 640) > 0.1 || Math.abs(item.mediaWidthPx - 640) > 0.1) errors.push('Media not actual 640px');
      if (item.naturalSize[0] !== 1536 || item.naturalSize[1] !== 1024) errors.push('Wrong raster size');
      if (item.pageHorizontalOverflowPx > 1) errors.push('Page-wide horizontal overflow');
      if (item.missingModernMedia) errors.push('Native missing-media error');
      if (item.proseFontSizesPx.some(px => px < 16)) errors.push('Affected prose text below 16px');
      if (item.raster.nonwhite < 500 || item.raster.black > item.raster.total * 0.95) errors.push('Blank or black raster');
      return item;
    };
    await observe('native-headed-desktop', 'full');
    await image.screenshot({ path: path.join(A, `previews/screenshots/${language}-desktop-640.png`) });
    await page.setViewportSize({ width: 390, height: 844 });
    await figure.evaluate(fig => { fig.scrollLeft = 0; fig.scrollIntoView({ block: 'start' }); });
    await observe('native-headed-mobile390', 'start');
    await page.screenshot({ path: path.join(A, `previews/screenshots/${language}-mobile390-start.png`) });
    await figure.evaluate(fig => { fig.scrollLeft = fig.scrollWidth; });
    const end = await observe('native-headed-mobile390', 'end');
    if (end.maxScrollLeftPx <= 0 || Math.abs(end.scrollLeftPx - end.maxScrollLeftPx) > 1) errors.push('Scroll end unreachable');
    await page.screenshot({ path: path.join(A, `previews/screenshots/${language}-mobile390-end.png`) });
    await page.close();
  }
} finally {
  await browser.close();
  const screenshots = fs.readdirSync(path.join(A, 'previews/screenshots')).map(name => {
    const p = path.join(A, 'previews/screenshots', name);
    return { path: p, sha256: hash(p) };
  });
  fs.writeFileSync(report, JSON.stringify({
    schema: 'ld-s10y-image/author-headed-media@1',
    status: errors.length ? 'fail' : 'pass', headed: true,
    surface: 'Native offline render_lesson.js, affected paragraph-owned shared figure, no DB or application changes.',
    dimensionsNotAssumedFromCanvas: true,
    embeddedImageText: 'No image text requested; visual author must confirm no lettering. 16px figure-text gate is inapplicable only after that visual observation.',
    measurements, screenshots, errors,
  }, null, 2) + '\n');
}
if (errors.length) throw new Error(errors.join('\n'));
console.log(JSON.stringify({ status: 'pass', measurements, report }, null, 2));
