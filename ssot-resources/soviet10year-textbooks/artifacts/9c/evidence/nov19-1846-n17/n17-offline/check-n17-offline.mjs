import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const require = createRequire(`${root}/app/package.json`);
const { chromium } = require('playwright');
const { proseFlow } = createRequire(`${root}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`)('./htmlfrag.js');
const lesson = 'ana9-c3-s1-n17';
const directory = `${root}/.tmp/ld-s10y-lesson/render/9c/modern-us-neutral/${lesson}`;
const evidence = `${root}/.tmp/stemrobin-184-six/n17-offline`;
const modern = `${root}/ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/lessons/${lesson}`;
const content = JSON.parse(await fs.readFile(`${modern}/lesson.json`, 'utf8'));
const draft = JSON.parse(await fs.readFile(`${modern}/choice-set/draft.json`, 'utf8'));
const flow = proseFlow(content.prose, content.section_breaks);
const result = {
  lesson, status: 'fail', headless: true, database: false,
  inputs: [], views: [], screenshots: [], errors: [], closed: false,
};
await fs.mkdir(evidence, { recursive: true });
const pages = new Map();
for (const name of ['text', 'exercises', 'choices']) {
  const filename = `${directory}/${name}.html`;
  const bytes = await fs.readFile(filename);
  pages.set(`/${name}.html`, bytes);
  result.inputs.push({
    path: path.relative(root, filename),
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  });
  assert(!/<script\b/i.test(bytes.toString()), 'Static offline HTML must have no scripts');
  assert(bytes.includes(Buffer.from('data:font/woff2;base64,')), 'Embedded fonts required');
}
const server = http.createServer((request, response) => {
  const body = pages.get(request.url);
  response.writeHead(body ? 200 : 404, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; font-src data:; img-src data:; script-src 'none'; connect-src 'none'; form-action 'none'",
  });
  response.end(body ?? 'Not found');
});
let browser;
try {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    for (const name of ['text', 'exercises', 'choices']) {
      const context = await browser.newContext({ viewport, serviceWorkers: 'block' });
      try {
        await context.route('**/*', route => route.request().url().startsWith(origin + '/') ? route.continue() : route.abort());
        const page = await context.newPage();
        page.on('pageerror', error => result.errors.push(error.message));
        await page.goto(`${origin}/${name}.html`, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.locator('.katex-error,.err').count(), 0);
        const measurements = await page.evaluate(async () => {
          const frame = () => new Promise(requestAnimationFrame);
          const sheet = document.querySelector('.sheet').getBoundingClientRect();
          if (document.documentElement.scrollWidth > innerWidth + 1) throw new Error('Whole-page horizontal overflow');
          if (sheet.width <= 0) throw new Error('Blank page');
          const scrolls = [];
          for (const element of document.querySelectorAll('.nb,.body,.option-text')) {
            if (element.scrollWidth <= element.clientWidth + 1) continue;
            element.scrollLeft = element.scrollWidth;
            await frame();
            const maximum = element.scrollWidth - element.clientWidth;
            if (Math.abs(element.scrollLeft - maximum) > 1) throw new Error('Horizontal end unreachable');
            scrolls.push({ maximum, actual: element.scrollLeft });
            element.scrollLeft = 0;
          }
          let reached = 0;
          for (const element of document.querySelectorAll('.para,.fig,li.ex,.option,.jump')) {
            element.scrollIntoView({ block: 'center', behavior: 'instant' });
            await frame();
            const rectangle = element.getBoundingClientRect();
            if (rectangle.bottom <= 0 || rectangle.top >= innerHeight) throw new Error('Content unreachable');
            reached++;
          }
          const figures = [...document.querySelectorAll('.fig')].map(element => {
            const svg = element.querySelector('svg');
            if (!svg || svg.getBoundingClientRect().width <= 0) throw new Error('Blank figure');
            const sizes = [...svg.querySelectorAll('text')].map(label => {
              const transform = label.getScreenCTM();
              return Number.parseFloat(getComputedStyle(label).fontSize) * Math.hypot(transform.a, transform.b);
            });
            if (!sizes.length || Math.min(...sizes) < 16 - 0.1) throw new Error('Figure label below 16px');
            return { width: svg.getBoundingClientRect().width, minimumLabelPx: Math.min(...sizes) };
          });
          scrollTo({ top: 0, behavior: 'instant' });
          await frame();
          return { reached, scrolls, figures, fonts: document.fonts.status };
        });
        assert.equal(measurements.fonts, 'loaded');
        if (name === 'text') {
          assert.equal(await page.locator('p.para').count(), flow.filter(item => item.kind === 'p').length);
          assert.equal(await page.locator('.fig').count(), 2);
          assert.equal(await page.locator('.para.section').count(), 1);
        } else if (name === 'exercises') {
          assert.equal(await page.locator('li.ex').count(), 14);
          assert.equal(await page.locator('input,textarea,math-field').count(), 0, 'Written tasks stay read-only');
          for (let number = 134; number <= 147; number++) assert.equal(await page.locator(`#ex-${number}`).count(), 1);
        } else {
          assert.equal(await page.locator('li.ex').count(), draft.questions.length);
          const table = page.locator('[data-question-id="n17-distance-results"] table');
          assert.equal(await table.locator('tbody tr').count(), 4);
          assert.equal(await table.locator('tbody td').count(), 8);
          for (const question of draft.questions) {
            const row = page.locator(`[data-question-id="${question.id}"]`);
            assert.equal(await row.locator('input').count(), question.view.options.length);
            const first = row.locator('input').first();
            const second = row.locator('input').nth(1);
            await first.check();
            assert(await first.isChecked());
            if (question.view.mode === 'multiple') {
              await second.check();
              assert(await first.isChecked());
              assert(await second.isChecked());
              await first.uncheck();
              assert(!(await first.isChecked()));
              await second.uncheck();
            } else {
              await second.check();
              assert(await second.isChecked());
              assert(!(await first.isChecked()));
            }
          }
          await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        }
        const screenshot = `${evidence}/${name}-${viewport.width}.png`;
        await page.screenshot({ path: screenshot, fullPage: true });
        result.screenshots.push(path.relative(root, screenshot));
        const link = page.getByRole('link');
        const href = await link.getAttribute('href');
        await link.click();
        await page.waitForURL(`${origin}/${href}`);
        assert.equal(await page.locator('h1').count(), 1);
        result.views.push({ page: name, viewport, status: 'pass', measurements, navigation: href });
      } finally {
        await context.close();
      }
    }
  }
  assert.equal(result.errors.length, 0);
  result.status = 'pass';
} catch (error) {
  result.errors.push(error.stack);
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
  result.closed = true;
  await fs.writeFile(`${evidence}/results.json`, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify(result));
  process.exitCode = result.status === 'pass' ? 0 : 1;
}
