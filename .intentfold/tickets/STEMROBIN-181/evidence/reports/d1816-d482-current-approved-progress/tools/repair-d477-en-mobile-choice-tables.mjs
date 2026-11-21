import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const D = `${T}/tmp/d1816-d472-n153-subset-display`;
const O = `${T}/tmp/d1816-d477-en-mobile-choice-table-repair`;
const { chromium } = createRequire(`${repo}/app/package.json`)('playwright');
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
assert(!fs.existsSync(`${O}/result.json`));
const original = read(`${D}/result.json`).records.find(row =>
  row.locale === 'en' && row.viewport.name === 'mobile' && row.surface === 'choices');
assert.equal(bind(original.html.path).sha256, original.html.sha256);
const reviewFile = `${T}/tmp/d1816-d473-n153-subset-first-pixels/report.json`;
assert.equal(read(reviewFile).status, 'sampled-first-display-pixels-fail');
const requests = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
fs.mkdirSync(O, { recursive: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route('**/*', route => { requests.push(route.request().url()); return route.abort(); });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.setContent(fs.readFileSync(original.html.path, 'utf8'), { waitUntil: 'load' });
  const before = await page.locator('[data-question]').evaluateAll(nodes =>
    nodes.map(node => ({ id: node.dataset.question, source: node.dataset.source,
      mode: node.dataset.mode, text: node.textContent })));
  await page.addStyleTag({ content: '@media(max-width:640px){html[lang="en"] li.ex .body{overflow-x:visible}html[lang="en"] .option-text{min-width:0}html[lang="en"] .choice-stem{overflow-wrap:anywhere}html[lang="en"] .table-scroll{max-width:100%;min-width:0;overflow-x:auto;overflow-y:hidden}}' });
  await page.evaluate(() => {
    for (const table of document.querySelectorAll('.option-text table')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll';
      table.replaceWith(wrapper);
      wrapper.append(table);
    }
    for (const body of document.querySelectorAll('li.ex .body')) body.scrollLeft = 0;
  });
  await page.evaluate(() => document.fonts.ready);
  const after = await page.locator('[data-question]').evaluateAll(nodes =>
    nodes.map(node => ({ id: node.dataset.question, source: node.dataset.source,
      mode: node.dataset.mode, text: node.textContent })));
  assert.deepEqual(after, before);
  assert.equal(after.length, 55);
  assert.equal(await page.locator('.choice-option').count(), 220);
  assert.equal(await page.locator('[data-source="2"],[data-source="10"]').count(), 0);
  const geometry = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    fontsLoaded: document.fonts.check('16px "KaTeX_Main"'),
    body: [...document.querySelectorAll('li.ex .body,.choice-stem,.option-text')].map(node => {
      const box = node.getBoundingClientRect();
      return { className: node.className, x: box.x, right: box.right,
        scrollWidth: node.scrollWidth, clientWidth: node.clientWidth, scrollLeft: node.scrollLeft };
    }),
    tables: [...document.querySelectorAll('.table-scroll')].map(node => {
      const start = node.scrollLeft;
      node.scrollLeft = node.scrollWidth;
      const end = node.scrollLeft;
      const reachable = end >= node.scrollWidth - node.clientWidth - 1;
      node.scrollLeft = 0;
      return { start, end, scrollWidth: node.scrollWidth, clientWidth: node.clientWidth, reachable };
    }),
  }));
  assert(geometry.fontsLoaded);
  assert(geometry.width <= 391);
  assert(geometry.body.every(row => row.x >= -1 && row.right <= 391
    && row.scrollWidth <= row.clientWidth + 1 && row.scrollLeft === 0));
  assert.equal(geometry.tables.length, 8);
  assert(geometry.tables.every(row => row.reachable));
  const htmlFile = `${O}/en-mobile-choices.html`;
  fs.writeFileSync(htmlFile, await page.content(), { flag: 'wx' });
  const tableQuestion = page.locator('[data-source="12"]');
  const screenshots = [];
  for (const [name, target, scrollEnd] of [
    ['stem-and-first-table-start', tableQuestion.locator('.choice-stem'), false],
    ['first-table-end', tableQuestion.locator('.table-scroll').nth(0), true],
    ['third-table-end', tableQuestion.locator('.table-scroll').nth(2), true],
  ]) {
    await target.scrollIntoViewIfNeeded();
    if (scrollEnd) await target.evaluate(node => { node.scrollLeft = node.scrollWidth; });
    assert.equal(await tableQuestion.locator('.body').evaluate(node => node.scrollLeft), 0);
    const file = `${O}/${name}.png`;
    await page.screenshot({ path: file, fullPage: false });
    screenshots.push({ name, ...bind(file) });
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(requests, []);
  fs.writeFileSync(`${O}/result.json`, JSON.stringify({
    stage: 'D477', status: 'affected-en-mobile-table-layout-pass-pixels-pending',
    original: original.html, firstFailure: bind(reviewFile), html: bind(htmlFile),
    screenshots, geometry, errors, requests, offline: true, headless: true,
    changedScope: 'Only English-mobile choice table scroll containers; body/stem remain at horizontal origin.',
    questionViewTextIdentityAndOptionsUnchanged: true, other11SurfacesReplayed: false,
    memberSemanticReviewsReplayed: false, parentImageOpens: 0,
    sourcePagesAdded: 0, completeCoursesAdded: 0, paidCalls: 0,
    wholeCourseApproval: false, databaseWrites: false,
  }, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ result: bind(`${O}/result.json`), screenshots: 3 }));
  await context.close();
} finally { await browser.close(); }
