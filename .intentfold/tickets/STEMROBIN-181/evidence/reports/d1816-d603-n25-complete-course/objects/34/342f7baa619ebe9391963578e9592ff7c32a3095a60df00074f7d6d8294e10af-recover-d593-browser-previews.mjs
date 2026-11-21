import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(`${process.cwd()}/app/package.json`);
const { chromium } = require('playwright');
const out = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d593-n25-figures-first';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const records = [];
try {
  for (const id of ['fig-40', 'fig-41', 'fig-42']) {
    const spec = JSON.parse(fs.readFileSync(`${out}/${id}.spec.json`));
    const file = `${out}/${id}.preview.png`;
    fs.writeFileSync(`${out}/first-failure/${id}.unresolved-theme-preview.png`, fs.readFileSync(file), { flag: 'wx' });
    const context = await browser.newContext({ viewport: { width: spec.canvas.width, height: spec.canvas.height } });
    await context.route('**/*', route => route.abort());
    const page = await context.newPage();
    const svg = fs.readFileSync(`${out}/${id}.svg`, 'utf8');
    const svgSHA = crypto.createHash('sha256').update(svg).digest('hex');
    await page.setContent(`<html><style>:root{--ld-figure-ink:#1b1b1b;--ld-figure-muted:#6b6b6b;--ld-figure-accent:#1b1b1b;--ld-figure-accent-soft:#777;--ld-figure-grid:#ddd;--ld-figure-paper:#fff}body{margin:0;background:#fff}</style>${svg}</html>`);
    await page.evaluate(() => document.fonts.ready);
    const painted = await page.locator('svg path,svg line,svg circle').evaluateAll(nodes =>
      nodes.filter(node => {
        const box = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return box.width + box.height > 10 && style.display !== 'none' && style.visibility !== 'hidden'
          && style.stroke !== 'none' && style.stroke !== 'rgba(0, 0, 0, 0)';
      }).length);
    assert(painted > 0, `${id}: no painted geometry`);
    const image = await page.screenshot({ path: file });
    records.push({ id, paintedGeometry: painted, preview: file,
      sha256: crypto.createHash('sha256').update(image).digest('hex'), svgSHA,
      sourceSVGUnchanged: svgSHA === crypto.createHash('sha256').update(fs.readFileSync(`${out}/${id}.svg`)).digest('hex') });
    await context.close();
  }
} finally {
  await browser.close();
}
fs.writeFileSync(`${out}/preview-recovery.json`, JSON.stringify({
  status: 'pass', records, cause: 'Resvg preview did not resolve theme CSS variables; the SVG and native geometry were not missing.',
  svgRerendered: false, contentRepair: false, browserClosed: true, independentPixels: 'pending',
  parentSourceAndPreviewImageOpens: 6, furtherParentImageOpens: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ status: 'pass', previews: records.length, browserClosed: true }));
