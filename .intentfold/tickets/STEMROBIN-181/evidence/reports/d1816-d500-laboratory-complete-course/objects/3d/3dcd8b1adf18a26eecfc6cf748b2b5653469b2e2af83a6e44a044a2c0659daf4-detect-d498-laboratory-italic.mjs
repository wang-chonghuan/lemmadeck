import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const { chromium } = createRequire(`${repo}/app/package.json`)('playwright');
const output = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d498-laboratory-offline-display/italic-dom-defect.json';
assert(!fs.existsSync(output));
const records = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
    const page = await browser.newPage();
    await page.route('**/*', route => route.request().url().startsWith('file:')
      ? route.continue() : route.abort());
    await page.goto(pathToFileURL(path.resolve(
      `.tmp/STEMROBIN-181/d1816-d492/source-work/render/10p/${edition}/phy10-c4-s4/text.html`)).href);
    const terms = await page.locator('p.para').filter({
      hasText: locale === 'zh' ? /\*物镜\*|\*目镜\*/ : /\*objective\*|\*eyepiece\*/,
    }).evaluateAll(nodes => nodes.map(node => ({
      text: node.textContent, emphasisTags: node.querySelectorAll('em').length,
    })));
    assert.equal(terms.length, 2);
    assert(terms.every(term => term.emphasisTags === 0));
    records.push({ locale, terms, status: 'LITERAL_MARKDOWN_STARS_NOT_ITALIC' });
    await page.close();
  }
} finally { await browser.close(); }
fs.writeFileSync(output, JSON.stringify({
  status: 'FAIL_DISPLAY_EMPHASIS_ONLY', records, imageOpens: 0,
  scope: 'Actual original D498 DOM observation only; first whole-content mechanical PASS remains unchanged.',
}, null, 2) + '\n');
console.log(JSON.stringify({ status: 'FAIL_DISPLAY_EMPHASIS_ONLY', records }));
