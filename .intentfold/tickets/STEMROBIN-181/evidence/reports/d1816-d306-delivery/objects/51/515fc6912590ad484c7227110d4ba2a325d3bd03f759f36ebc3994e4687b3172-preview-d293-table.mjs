import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const out = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d293-n19-figure-context/tbl-p0053-01';
const bind = file => ({ path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const before = ['spec.json', 'tbl-p0053-01.svg', 'tbl-p0053-01.render.json']
  .map(name => bind(`${out}/${name}`));
const svg = fs.readFileSync(before[1].path, 'utf8');
const records = [];
const requests = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const width of [640, 331]) {
    const context = await browser.newContext({ viewport: { width, height: 850 } });
    try {
      await context.route('**/*', route => {
        requests.push(route.request().url());
        return route.abort();
      });
      const page = await context.newPage();
      await page.setContent(`<html><head><style>
        html,body{margin:0;padding:0;background:#fff}
        .media{width:100%;overflow-x:auto}
        svg{width:640px;height:auto;display:block}
        </style></head><body><div class="media">${svg}</div></body></html>`);
      await page.evaluate(() => document.fonts.ready);
      const metrics = await page.locator('.media').evaluate(node => {
        const svg = node.querySelector('svg');
        node.scrollLeft = node.scrollWidth;
        const sizes = [...svg.querySelectorAll('text')].map(text => {
          const matrix = text.getScreenCTM();
          return parseFloat(getComputedStyle(text).fontSize) * Math.hypot(matrix.a, matrix.b);
        });
        return { mediaWidth: svg.getBoundingClientRect().width, labelSizes: sizes,
          scrollLeft: node.scrollLeft, maxScroll: node.scrollWidth - node.clientWidth,
          visibleObjects: svg.querySelectorAll('path,line,polygon,text').length };
      });
      assert.equal(metrics.mediaWidth, 640);
      assert(metrics.labelSizes.length === 30 && metrics.labelSizes.every(size => size >= 16));
      assert(Math.abs(metrics.scrollLeft - metrics.maxScroll) <= 1);
      assert(metrics.visibleObjects > 30);
      const file = `${out}/tbl-p0053-01.w${width}.png`;
      assert(!fs.existsSync(file));
      const image = await page.screenshot({ path: file, fullPage: true });
      assert(image.length > 8000);
      records.push({ width, screenshot: bind(file), metrics });
    } finally { await context.close(); }
  }
} finally { await browser.close(); }
assert.deepEqual(requests, []);
for (const record of before) assert.equal(bind(record.path).sha256, record.sha256);
fs.writeFileSync(`${out}/preview.json`, JSON.stringify({ status: 'pass', before, records,
  requests, geometryRerenders: 0, specChanged: false, svgChanged: false,
  actualImageOpens: 0, paidCalls: 0, databaseWrites: false }, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ preview: bind(`${out}/preview.json`) }));
