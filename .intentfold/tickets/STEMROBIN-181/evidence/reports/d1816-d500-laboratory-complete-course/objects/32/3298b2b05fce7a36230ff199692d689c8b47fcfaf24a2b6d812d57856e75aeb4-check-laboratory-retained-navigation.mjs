import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const { chromium } = createRequire(`${repo}/app/package.json`)('playwright');
const directory = process.argv[2];
const output = `${directory}/retained-navigation-check.json`;
assert(!fs.existsSync(output));
const allowed = new Set(['zh', 'en'].flatMap(locale =>
  ['text.html', 'exercises.html'].map(file =>
    pathToFileURL(path.resolve(`${directory}/offline/${locale}/${file}`)).href)));
const records = [], requests = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const locale of ['zh', 'en']) {
    const context = await browser.newContext();
    await context.route('**/*', route => {
      const url = route.request().url();
      requests.push({ url, allowed: allowed.has(url) });
      return allowed.has(url) ? route.continue() : route.abort();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const text = pathToFileURL(path.resolve(`${directory}/offline/${locale}/text.html`)).href;
    const exercises = pathToFileURL(path.resolve(`${directory}/offline/${locale}/exercises.html`)).href;
    await page.goto(text);
    await page.locator('a.jump').click();
    await page.waitForURL(exercises);
    assert.equal(await page.locator('li.ex,figure,input,textarea').count(), 0);
    await page.locator('a.jump').click();
    await page.waitForURL(text);
    assert.equal(await page.locator('figure').count(), 1);
    assert.deepEqual(errors, []);
    records.push({ locale, text, exercises, forwardAndBack: true, errors });
    await context.close();
  }
} finally { await browser.close(); }
assert(requests.every(record => record.allowed));
fs.writeFileSync(output, JSON.stringify({
  status: 'PASS', records, requests, screenshots: 0, imageOpens: 0,
  scope: 'First retained-path navigation checks only. HTML bytes and whole-course display observations inherited; no source/text/figure review replay.',
}, null, 2) + '\n');
