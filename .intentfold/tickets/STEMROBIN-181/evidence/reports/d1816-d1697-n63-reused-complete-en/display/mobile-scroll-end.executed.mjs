import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { chromium, expect } = require('playwright/test');
const original = `${ticket}/tmp/d1816-d1698-n63-null-chapter-display-recovery/report.json`;
const view = read(original).views.find(row => row.viewport.name === 'mobile');
assert.equal(bind(view.html.path).sha256, view.html.sha256);
const requests = [], errors = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
let result, failure;
try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 1,
    offline: true, serviceWorkers: 'block',
  });
  await context.route('**/*', route => {
    requests.push(route.request().url());
    return route.abort();
  });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.setContent(fs.readFileSync(view.html.path, 'utf8'), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const figure = page.locator('figure#fig-125[data-figure-layout="scroll"]');
  await figure.scrollIntoViewIfNeeded();
  const measure = () => figure.evaluate(node => {
    const rect = node.getBoundingClientRect();
    const svg = node.querySelector('svg');
    const media = svg.getBoundingClientRect();
    const drawing = svg.getBBox();
    const point = svg.createSVGPoint();
    point.x = drawing.x + drawing.width;
    point.y = drawing.y;
    const rightmost = point.matrixTransform(svg.getScreenCTM());
    return {
      clientWidth: node.clientWidth, scrollWidth: node.scrollWidth, scrollLeft: node.scrollLeft,
      maxScrollLeft: node.scrollWidth - node.clientWidth,
      overflowX: getComputedStyle(node).overflowX,
      viewport: { left: rect.left, right: rect.right, width: rect.width },
      media: { left: media.left, right: media.right, width: media.width },
      rightmostDrawingX: rightmost.x,
      rightmostLabels: [...svg.querySelectorAll('text')]
        .filter(label => ['Mosaic screen', 'R', 'Amplifier'].includes(label.textContent))
        .map(label => {
          const box = label.getBoundingClientRect();
          return { text: label.textContent, left: box.left, right: box.right,
            visibleWithinLocalViewport: box.left >= rect.left - 1 && box.right <= rect.right + 1 };
        }),
      documentWidth: document.documentElement.scrollWidth,
    };
  });
  const before = await measure();
  assert.equal(before.clientWidth, 358);
  assert.equal(before.media.width, 640);
  assert.equal(before.overflowX, 'auto');
  assert(before.maxScrollLeft > 0);
  const attempted = await figure.evaluate(node => {
    const attemptedScrollLeft = node.scrollWidth;
    node.scrollLeft = attemptedScrollLeft;
    return attemptedScrollLeft;
  });
  await expect.poll(async () => {
    const current = await measure();
    return Math.abs(current.scrollLeft - current.maxScrollLeft);
  }).toBeLessThanOrEqual(1);
  const after = await measure();
  assert.equal(after.documentWidth, 390);
  assert(after.media.right <= after.viewport.right + 1);
  assert(after.rightmostDrawingX <= after.viewport.right + 1);
  assert.equal(after.rightmostLabels.length, 3);
  assert(after.rightmostLabels.every(label => label.visibleWithinLocalViewport));
  assert.deepEqual(requests, []);
  assert.deepEqual(errors, []);
  result = { before, attemptedScrollLeft: attempted, after,
    achievedLocalEnd: true, rightmostDrawingAndLabelsWithinViewport: true };
} catch (error) {
  failure = { message: error.message, stack: error.stack };
} finally {
  await browser.close();
}
save(`${ticket}/tmp/d1816-d1701-n63-mobile-scroll-end/report.json`, {
  status: failure ? 'FAIL' : 'PASS', task: 'D1701', card: 'phy10-c1-s6-n63',
  scope: 'Affected-only observed mobile local horizontal scroll endpoint; no full DOM or pixel review replay',
  originalDisplay: bind(original), unchangedHtml: view.html,
  executedHelper: bind(new URL(import.meta.url).pathname),
  result, failure: failure || null, requests, errors, browserClosed: true,
  browserMode: 'isolated-headless-offline', screenshots: 0, actualImageOpens: 0,
  sourceLessonFigureAndEarlierImagesUnchanged: true, databaseWrites: 0, paidCalls: 0,
});
assert(!failure, failure?.message);
console.log(JSON.stringify(bind(`${ticket}/tmp/d1816-d1701-n63-mobile-scroll-end/report.json`)));
