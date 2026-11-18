import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const owned = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d662-n78-fig182183-author');
assert.equal(process.cwd(), repo);
const require = createRequire(path.join(repo, 'app/package.json'));
const { chromium } = require('playwright');
const bind = file => ({ path: file, sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
  bytes: fs.statSync(file).size });
const directory = path.join(owned, 'fig-183');
const svgPath = path.join(directory, 'figure.svg');
const svg = fs.readFileSync(svgPath, 'utf8');
const spec = JSON.parse(fs.readFileSync(path.join(directory, 'spec.json'), 'utf8'));
const native = JSON.parse(fs.readFileSync(path.join(directory, 'render.json'), 'utf8'));
assert.equal(native.status, 'pass');
assert.equal(bind(svgPath).sha256, native.output.svg.sha256);
const startedAt = new Date().toISOString();
const executable = [process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean).find(fs.existsSync);
assert.ok(executable);
const browser = await chromium.launch({ executablePath: executable, headless: true });
const receipts = [];
const style = `
  :root { --ld-figure-ink:#15201f; --ld-figure-muted:#4c5a58;
    --ld-figure-accent:#15201f; --ld-figure-accent-soft:#8a9795;
    --ld-figure-grid:#e3eae9; --ld-figure-paper:#fff; }
  html,body { margin:0; background:#fff; }
  .media svg { display:block; width:100%; height:auto; }`;
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  for (const width of spec.display.widths) {
    await page.setViewportSize({ width, height: Math.ceil(spec.canvas.height * width / 640) });
    await page.setContent(`<!doctype html><style>${style}</style><div class="media" style="width:${width}px">${svg}</div>`);
    const dom = await page.evaluate(() => {
      const svg = document.querySelector('.media svg'), media = svg.getBoundingClientRect();
      const labels = [...svg.querySelectorAll('text')].map(node => {
        const box = node.getBoundingClientRect(), ctm = node.getScreenCTM();
        return { text: node.textContent, px: Number(node.getAttribute('font-size')) * Math.hypot(ctm.a, ctm.b),
          left: box.left, top: box.top, right: box.right, bottom: box.bottom,
          inMedia: box.left >= media.left && box.top >= media.top && box.right <= media.right && box.bottom <= media.bottom };
      });
      return { mediaWidth: media.width, mediaHeight: media.height, labels,
        visibleGeometry: [...svg.querySelectorAll('line,path,polygon')].filter(node => getComputedStyle(node).display !== 'none').length };
    });
    assert.equal(dom.mediaWidth, width);
    assert.ok(dom.labels.length === 6 && dom.labels.every(label => label.px >= 16 && label.inMedia));
    assert.ok(dom.visibleGeometry > 30);
    const screenshot = path.join(directory, `display-${width}.png`);
    assert.equal(fs.existsSync(screenshot), false);
    const png = await page.locator('.media').screenshot({ path: screenshot, animations: 'disabled' });
    const pixels = await page.evaluate(async base64 => {
      const image = new Image();
      image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
      const rgba = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let nonwhite = 0, dark = 0;
      for (let i = 0; i < rgba.length; i += 4) {
        if (rgba[i] < 245 || rgba[i + 1] < 245 || rgba[i + 2] < 245) nonwhite++;
        if (rgba[i] < 100 && rgba[i + 1] < 100 && rgba[i + 2] < 100) dark++;
      }
      return { width: canvas.width, height: canvas.height, nonwhite, dark,
        nonwhiteFraction: nonwhite / (canvas.width * canvas.height) };
    }, png.toString('base64'));
    assert.ok(pixels.nonwhite > 200 && pixels.dark > 100 && pixels.nonwhiteFraction < 0.45,
      'blank/black raster rejection');
    receipts.push({ width, svgInput: bind(svgPath), screenshot: bind(screenshot), dom, pixels,
      mechanicalStatus: 'pass', independentFIG: 'PENDING', independentVisual: 'PENDING' });
  }
  await page.setViewportSize({ width: 697, height: 260 });
  await page.setContent(`<!doctype html><style>${style}
    .comparison { display:flex; gap:24px; align-items:flex-start; }
    .caption { height:30px; font:16px Arial,sans-serif; color:#15201f; }
    </style><div class="comparison">
    <div><div class="caption">331 px</div><div class="media" style="width:331px">${svg}</div></div>
    <div><div class="caption">342 px</div><div class="media" style="width:342px">${svg}</div></div></div>`);
  const comparison = path.join(directory, 'display-331-342.png');
  assert.equal(fs.existsSync(comparison), false);
  await page.locator('.comparison').screenshot({ path: comparison, animations: 'disabled' });
  const receiptPath = path.join(owned, 'preview-receipt.json');
  fs.writeFileSync(receiptPath, `${JSON.stringify({
    schema: 'd662/figure183-native-svg-width-evidence@1', startedAt, finishedAt: new Date().toISOString(),
    cwd: repo, browserExecutable: executable, headless: true, sourceSVGUnmodified: bind(svgPath),
    nativeRenderNotRerun: true, inheritedWidths: spec.display.widths, receipts,
    comparisonScreenshot: bind(comparison), fullCardAcceptance: false,
    authorMechanicalChecksOnly: true, independentVisual: 'PENDING', independentFIG: 'PENDING',
    fig182Skipped: 'STOP after first genuine native collision and sole spec repair still failing. No dependent preview stage.',
  }, null, 2)}\n`, { flag: 'wx' });
  console.log(JSON.stringify({ receipt: bind(receiptPath), comparison: bind(comparison) }));
} finally {
  await browser.close();
}
