import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const domFile = `${ticket}/tmp/d1816-d1907-ex1-section-display/report.json`;
const dom = read(domFile);
const view = dom.views.find(view => view.surface === 'answers' && view.viewport.name === 'mobile');
assert.equal(bind(view.html.path).sha256, view.html.sha256);
const out = `${ticket}/tmp/d1816-d1918-ex1-mobile-formula-scroll`;
const images = `${repo}/.tmp/STEMROBIN-181/d1816-d1918/display`;
fs.mkdirSync(images, { recursive: true });
const report = {
  card: dom.card, status: 'IN_PROGRESS', dom: bind(domFile), html: view.html,
  images: [], requests: [], errors: [], parentImageOpens: 0, databaseWrites: 0, paidCalls: 0,
  interaction: 'Real Playwright pointer wheel horizontal input in a mobile-sized viewport',
  touchOrKeyboardScrollClaimed: false, mathematicalContentChanged: false,
};
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: view.viewport });
  await context.route('**/*', route => {
    report.requests.push(route.request().url());
    return route.abort();
  });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  await page.setContent(fs.readFileSync(view.html.path, 'utf8'), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const wrappers = page.locator('.answer[data-number="8"] .sr-nb');
  const count = await wrappers.count();
  let formula;
  for (let index = 0; index < count; index++) {
    const candidate = wrappers.nth(index);
    if (await candidate.evaluate(node => node.scrollWidth > node.clientWidth + 1
      && /3500/.test(node.querySelector('annotation')?.textContent ?? ''))) {
      formula = candidate;
      break;
    }
  }
  assert(formula, 'Find the exact reviewed overflowing formula, not a substitute expression');
  await formula.evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
  report.before = await formula.evaluate(node => ({
    clientWidth: node.clientWidth, scrollWidth: node.scrollWidth, scrollLeft: node.scrollLeft,
    overflowX: getComputedStyle(node).overflowX,
    tex: node.querySelector('annotation')?.textContent,
  }));
  assert.equal(report.before.scrollLeft, 0);
  assert.equal(report.before.overflowX, 'auto');
  const capture = async (state) => {
    const file = `${images}/en-mobile-answer-8-formula-${state}-viewport.png`;
    await page.screenshot({ path: file });
    report.images.push({ surface: 'answers', viewport: 'mobile', question: 8, state, ...bind(file) });
  };
  await capture('start');
  const box = await formula.boundingBox();
  assert(box);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(600, 0);
  await page.waitForFunction(() => {
    const nodes = [...document.querySelectorAll('.answer[data-number="8"] .sr-nb')];
    return nodes.some(node => /3500/.test(node.querySelector('annotation')?.textContent ?? '')
      && node.scrollLeft > 0 && Math.abs(node.scrollWidth - node.clientWidth - node.scrollLeft) <= 1);
  });
  report.after = await formula.evaluate(node => {
    const box = node.getBoundingClientRect();
    const tail = [...node.querySelectorAll('.katex-html span')].filter(span => span.textContent === '3500')
      .map(span => {
        const bounds = span.getBoundingClientRect();
        return { left: bounds.left, right: bounds.right, width: bounds.width };
      }).filter(box => box.width > 0);
    return {
      clientWidth: node.clientWidth, scrollWidth: node.scrollWidth, scrollLeft: node.scrollLeft,
      left: box.left, right: box.right, denominatorTail: tail,
      tex: node.querySelector('annotation')?.textContent,
      documentWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth,
    };
  });
  assert.equal(report.after.tex, report.before.tex);
  assert(report.after.denominatorTail.length > 0);
  assert(report.after.denominatorTail.every(tail =>
    tail.left >= report.after.left - 1 && tail.right <= report.after.right + 1));
  assert(report.after.documentWidth <= report.after.viewportWidth + 1);
  await capture('end');
  assert.deepEqual(report.requests, []);
  assert.deepEqual(report.errors, []);
  report.status = 'HORIZONTAL_SCROLL_DOM_PASS_AFFECTED_PIXEL_REVIEW_REQUIRED';
  await context.close();
} catch (error) {
  report.status = 'FAIL';
  report.error = { name: error.name, message: error.message };
  process.exitCode = 1;
} finally {
  await browser.close();
  report.browserClosed = true;
  save(`${out}/report.json`, report);
}
console.log(JSON.stringify({ card: report.card, status: report.status, report: bind(`${out}/report.json`) }));
