import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const { chromium } = createRequire(`${repo}/app/package.json`)('playwright');
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d382-display-missing-evidence`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const originalFile = `${T}/tmp/d1816-d363-n149-n151-display/result.json`;
const original = read(originalFile);
assert.equal(original.status, 'pass');
assert.equal(original.records.length, 8);
assert(!fs.existsSync(O));
fs.mkdirSync(O, { recursive: true });
const allowed = new Set(original.records.flatMap(row =>
  [row.html.path, row.html.path.replace(/text\.html$/, 'exercises.html')])
  .map(file => pathToFileURL(path.resolve(file)).href));
const observations = [];
const routes = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const row of original.records) {
    assert.equal(bind(row.html.path).sha256, row.html.sha256);
    assert.equal(bind(row.lesson.path).sha256, row.lesson.sha256);
    const context = await browser.newContext({ viewport: {
      width: row.viewport.width, height: row.viewport.height,
    } });
    await context.route('**/*', route => {
      const url = route.request().url();
      routes.push({ url, allowed: allowed.has(url) });
      return allowed.has(url) ? route.continue() : route.abort();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    try {
      const textUrl = pathToFileURL(path.resolve(row.html.path)).href;
      await page.goto(textUrl, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const name = row.id.endsWith('n149') ? 'n149' : 'n151';
      const prefix = `${name}-${row.locale}-${row.viewport.name}`;
      if (name === 'n149' && row.viewport.name === 'mobile') {
        const figure = page.locator('figure[id="fig-277"]');
        const initial = await figure.evaluate(node => ({
          scrollLeft: node.scrollLeft, clientWidth: node.clientWidth,
          scrollWidth: node.scrollWidth,
        }));
        assert.equal(initial.scrollLeft, 0);
        assert.equal(initial.clientWidth, 358);
        assert.equal(initial.scrollWidth, 640);
        await figure.scrollIntoViewIfNeeded();
        const leftFile = `${O}/${prefix}-figure-initial-left.png`;
        await page.screenshot({ path: leftFile });
        const box = await figure.boundingBox();
        assert(box && box.height > 0);
        await page.mouse.move(box.x + box.width / 2, box.y + 40);
        await page.mouse.wheel(640, 0);
        await page.waitForFunction(() =>
          document.querySelector('figure[id="fig-277"]').scrollLeft === 282);
        const after = await figure.evaluate(node => ({
          scrollLeft: node.scrollLeft, clientWidth: node.clientWidth,
          scrollWidth: node.scrollWidth,
        }));
        const rightFile = `${O}/${prefix}-figure-pan-right.png`;
        await page.screenshot({ path: rightFile });
        observations.push({ id: row.id, locale: row.locale, viewport: row.viewport,
          kind: 'mobile-figure-pan', html: bind(row.html.path), initial, after,
          action: 'mouse.wheel(640, 0) over figure viewport',
          screenshots: [
            { ...bind(leftFile), role: 'initial-left' },
            { ...bind(rightFile), role: 'pan-right' },
          ] });
      }
      const link = page.getByRole('link', {
        name: row.locale === 'en' ? 'Exercises · 0 →' : '去做题 · 0 道 →',
        exact: true,
      });
      assert.equal(await link.getAttribute('href'), 'exercises.html');
      await link.click();
      const destinationFile = row.html.path.replace(/text\.html$/, 'exercises.html');
      const destinationUrl = pathToFileURL(path.resolve(destinationFile)).href;
      await page.waitForURL(destinationUrl);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('li.ex,figure,input,textarea,.err,.katex-error').count(), 0);
      const back = page.getByRole('link', {
        name: row.locale === 'en' ? '← Back to text' : '← 回课文', exact: true,
      });
      assert(await back.isVisible());
      const screenshotFile = `${O}/${prefix}-empty-exercises.png`;
      await page.screenshot({ path: screenshotFile, fullPage: true });
      const geometry = await page.evaluate(() => {
        const nodes = [...document.querySelector('.sheet').children];
        return { width: document.documentElement.scrollWidth,
          boxes: nodes.map(node => {
            const box = node.getBoundingClientRect();
            return { x: box.x, y: box.y, right: box.right, bottom: box.bottom,
              width: box.width, height: box.height, text: node.textContent };
          }) };
      });
      assert(geometry.width <= row.viewport.width);
      assert(geometry.boxes.length >= 2);
      assert(geometry.boxes.every(box => box.width > 0 && box.height > 0 &&
        box.x >= 0 && box.right <= row.viewport.width));
      for (let index = 1; index < geometry.boxes.length; index++)
        assert(geometry.boxes[index].y >= geometry.boxes[index - 1].bottom - 1);
      await back.click();
      await page.waitForURL(textUrl);
      assert.deepEqual(errors, []);
      observations.push({ id: row.id, locale: row.locale, viewport: row.viewport,
        kind: 'empty-exercise-navigation', html: bind(row.html.path),
        destination: bind(destinationFile), destinationUrl, geometry,
        observedForwardClick: true, observedBackClick: true, errors,
        screenshots: [{ ...bind(screenshotFile), role: 'empty-exercise-destination' }] });
      fs.writeFileSync(`${O}/partial-result.json`, JSON.stringify({
        observations, routes,
      }, null, 2) + '\n');
    } finally { await context.close(); }
  }
} finally { await browser.close(); }
assert.equal(observations.length, 10);
assert.equal(observations.flatMap(row => row.screenshots).length, 12);
assert(routes.every(row => row.allowed));
fs.writeFileSync(`${O}/result.json`, JSON.stringify({
  batch: 'D382', status: 'pass', scope: 'Only missing D364 display evidence',
  inheritedAutomaticEvidence: bind(originalFile), observations, routes,
  originalTextChecksReplayed: false, geometryRerenders: 0,
  headless: true, offline: true, independentPixelReviewPending: true,
  parentImageOpens: 0, paidCalls: 0, databaseWrites: false,
  productAcceptance: false, formalHandoff: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ status: 'pass', observations: observations.length,
  screenshots: 12, parentImageOpens: 0 }));
