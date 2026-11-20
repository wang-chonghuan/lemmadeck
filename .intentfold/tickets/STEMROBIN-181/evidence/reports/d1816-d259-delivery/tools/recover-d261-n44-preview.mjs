import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d261-n44-preview-recovery`;
const authorDir = `${T}/tmp/d1816-d256-n44-author`;
const bind = file => ({ path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const selected = JSON.parse(fs.readFileSync(`${authorDir}/bilingual-figure-bindings.json`));
const original = [selected.spec, selected.render, selected.svg,
  selected.templates.zh, selected.templates.en];
for (const row of original) assert.equal(bind(row.path).sha256, row.sha256);
assert(!fs.existsSync(`${O}/recovery.json`));
fs.mkdirSync(O, { recursive: true });
const svg = fs.readFileSync(selected.svg.path, 'utf8');
const requests = [];
const previews = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const width of [640, 331]) {
    const context = await browser.newContext({ viewport: { width, height: 1100 } });
    try {
      await context.route('**/*', route => {
        requests.push(route.request().url());
        return route.abort();
      });
      const page = await context.newPage();
      await page.setContent(`<html><head><style>
        html,body{margin:0;padding:0;background:#ffffff}
        svg{width:100%;height:auto;display:block}
        </style></head><body>${svg}</body></html>`);
      await page.evaluate(() => document.fonts.ready);
      const geometry = await page.locator('svg').evaluate(node => ({
        width: node.getBoundingClientRect().width,
        height: node.getBoundingClientRect().height,
        background: getComputedStyle(node).backgroundColor,
        labelSizes: [...node.querySelectorAll('text')].map(text => {
          const matrix = text.getScreenCTM();
          return parseFloat(getComputedStyle(text).fontSize) * Math.hypot(matrix.a, matrix.b);
        }),
        colors: [...new Set([...node.querySelectorAll('text,ellipse,path')]
          .filter(node => getComputedStyle(node).display !== 'none')
          .flatMap(node => [getComputedStyle(node).fill, getComputedStyle(node).stroke]))],
      }));
      assert.equal(geometry.width, width);
      assert.equal(geometry.background, 'rgb(255, 255, 255)');
      assert(geometry.labelSizes.every(size => size >= 16));
      const file = `${O}/fig-68.w${width}.png`;
      await page.locator('svg').screenshot({ path: file });
      previews.push({ ...bind(file), width, geometry });
    } finally { await context.close(); }
  }
} finally { await browser.close(); }
assert.deepEqual(requests, []);
for (const row of original) assert.equal(bind(row.path).sha256, row.sha256);
fs.writeFileSync(`${O}/recovery.json`, JSON.stringify({
  status: 'preview-recovered-affected-visual-review-pending', selected, previews,
  previousFailure: bind(`${T}/tmp/d1816-d258-n44-review/report.json`),
  diagnosis: 'Direct Resvg rasterization did not resolve semantic CSS variables; ' +
    'original previews contain black RGB with transparency. Isolated Chromium captures ' +
    'the unchanged SVG with native CSS variable fallback and opaque white background.',
  svgChanged: false, specChanged: false, renderChanged: false, textChanged: false,
  geometryRerenders: 0, paidCalls: 0, parentImageOpens: 1, requests, headless: true,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ recovery: bind(`${O}/recovery.json`), previews }));
