import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(process.cwd(), root);
const own = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n35-content-independent7');
const edition = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral');
const screenshot = path.join(own, 'modern450-source-comparison7.headed-offline218.png');
assert.equal(existsSync(screenshot), false, 'Do not overwrite or reopen a prior capture.');

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const exerciseBytes = readFileSync(path.join(edition, 'lessons/geo68-c3-s2-n35/exercises.json'));
const exercise450 = JSON.parse(exerciseBytes).exercises.filter((item) => String(item.source_number || item.number) === '450');
assert.equal(exercise450.length, 1);
assert.deepEqual(exercise450[0].figure_refs, ['fig-218']);
const svgBytes = readFileSync(path.join(edition, 'figures/fig-218.svg'));
assert.equal(sha256(svgBytes), '1641c74779d32ecd40817bf218eb08eb9c2e193583c9d40ae9adf0c43e361ad6');

const escapeHtml = (text) => text.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);
const promptHtml = exercise450[0].lines.map((line) => {
  const parts = line.split(/(\$[^$]+\$)/g);
  return `<p>${parts.map((part) => part.startsWith('$') && part.endsWith('$')
    ? `<i>${escapeHtml(part.slice(1, -1))}</i>`
    : escapeHtml(part)).join('')}</p>`;
}).join('');
const html = `<!doctype html>
<html lang="zh"><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'">
<title>450</title><style>
* { box-sizing: border-box; }
body { margin: 0; background: #fff; color: #15201f; font-family: Arial, "PingFang SC", sans-serif; }
main { width: 640px; margin: 44px auto; }
header { padding-bottom: 18px; margin-bottom: 20px; border-bottom: 1px solid #cbd5d0; }
h1 { margin: 0 0 18px; font-size: 22px; font-weight: 600; letter-spacing: 0; }
p { margin: 9px 0; font-size: 19px; line-height: 1.6; }
svg { display: block; width: 640px; height: 420px; }
</style></head><body><main><header><h1>450</h1>${promptHtml}</header>${svgBytes.toString('utf8')}</main></body></html>`;

const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
const viewport = { width: 1440, height: 960 };
const errors = [];
let browser;
let metrics;
try {
  browser = await chromium.launch({
    headless: false,
    args: ['--disable-background-networking', '--disable-component-update', '--disable-domain-reliability'],
  });
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    offline: true,
    serviceWorkers: 'block',
  });
  await context.route('**/*', (route) => route.abort());
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(String(error)));
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('svg').count(), 1);
  assert.equal(await page.locator('svg line').count(), 3);
  assert.equal(await page.locator('svg text[data-label-id]').count(), 8);
  assert.equal(await page.locator('header p').count(), 3);
  metrics = await page.evaluate(() => {
    const svg = document.querySelector('svg');
    const box = svg.getBoundingClientRect();
    const labels = [...svg.querySelectorAll('text[data-label-id]')].map((label) => ({
      label: label.textContent,
      fontSize: Number.parseFloat(getComputedStyle(label).fontSize),
    }));
    return {
      figure: { x: box.x, y: box.y, width: box.width, height: box.height },
      labels,
      inViewport: box.x >= 0 && box.y >= 0 && box.right <= innerWidth && box.bottom <= innerHeight,
      otherFigureCount: document.querySelectorAll('svg').length - 1,
      externalResources: performance.getEntriesByType('resource').length,
    };
  });
  assert.equal(metrics.figure.width, 640);
  assert.equal(metrics.figure.height, 420);
  assert.equal(metrics.inViewport, true);
  assert.equal(metrics.otherFigureCount, 0);
  assert.equal(metrics.externalResources, 0);
  assert.deepEqual(errors, []);
  await page.screenshot({ path: screenshot, fullPage: false, animations: 'disabled' });
} finally {
  if (browser) await browser.close();
}

console.log(JSON.stringify({
  status: 'pass',
  screenshot,
  screenshotSha256: sha256(readFileSync(screenshot)),
  screenshotCaptures: 1,
  screenshotImageLoadsIntoReviewerContext: 'not yet loaded; view this single whole screenshot exactly once',
  viewport,
  headed: true,
  offline: true,
  routes: 'all aborted',
  content: 'only exercise 450 prompt and byte-identical approved modern fig-218 SVG',
  svgSha256: sha256(svgBytes),
  exercisesFileSha256: sha256(exerciseBytes),
  exercise450ObjectSha256: sha256(JSON.stringify(exercise450[0])),
  metrics,
  pageErrors: errors,
  browserClosed: true,
  nativeRendererOrFinalizerCalls: 0,
}, null, 2));
