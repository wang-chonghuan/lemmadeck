import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const out = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d283-fig27-author';
const bind = file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
assert(!fs.existsSync(`${out}/preview-recovery.json`));
const before = ['spec.json', 'fig-27.svg', 'fig-27.render.json'].map(name => bind(`${out}/${name}`));
const svg = fs.readFileSync(`${out}/fig-27.svg`, 'utf8');
const previews = [];
const requests = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const width of [420, 331]) {
    const context = await browser.newContext({ viewport: { width, height: 550 } });
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
      const file = `${out}/fig-27.w${width}.png`;
      assert(!fs.existsSync(file));
      await page.locator('svg').screenshot({ path: file });
      previews.push({ ...bind(file), width });
    } finally { await context.close(); }
  }
} finally { await browser.close(); }
assert.deepEqual(requests, []);
for (const original of before) assert.equal(bind(original.path).sha256, original.sha256);
fs.writeFileSync(`${out}/preview-recovery.json`, JSON.stringify({
  status: 'unchanged-svg-browser-preview-recovered',
  original: before, previews, failedResvgPreview: bind(`${out}/fig-27.preview.png`),
  diagnosis: 'Resvg did not resolve semantic CSS variable fallback; browser resolves unchanged SVG.',
  svgChanged: false, specChanged: false, geometryRerenders: 0,
  parentNewImageOpens: 1, requests, paidCalls: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ recovery: bind(`${out}/preview-recovery.json`), previews }));
