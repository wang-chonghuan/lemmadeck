import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184';
assert.equal(process.cwd(), root);
const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
const output = '.tmp/stemrobin-184-six/n82-resume';
const tag = process.argv[2] || 'first';
const svg = fs.readFileSync(`${output}/fig-21.svg`, 'utf8');
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 640, height: 320 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', route => route.abort());
  await page.setContent(`<style>
    :root{--ld-figure-ink:#15201f;--ld-figure-muted:#4c5a58;
      --ld-figure-accent:#245d4f;--ld-figure-accentSoft:#e4eee9;
      --ld-figure-grid:#b7c6c1;--ld-figure-paper:#fff}
    html,body{margin:0;background:white}svg{display:block;width:640px;height:auto}
  </style>${svg}`);
  const labels = await page.locator('svg text').evaluateAll(nodes => nodes.map(node => {
    const matrix = node.getScreenCTM();
    return { text: node.textContent, fontPx: parseFloat(getComputedStyle(node).fontSize) *
      Math.hypot(matrix.a, matrix.b) };
  }));
  assert.equal(labels.length, 17);
  assert(labels.every(label => label.fontPx >= 16));
  assert.deepEqual(errors, []);
  await page.screenshot({ path: `${output}/fig-21.browser-${tag}.png` });
  fs.writeFileSync(`${output}/figure-preview-${tag}.json`, JSON.stringify({
    status: 'pass', surface: 'isolated-headless-640px', labels, errors,
    resvgCssVariableBlackPreviewNotFigureFailure: true,
  }, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ status: 'pass', labels: labels.length,
    screenshot: `${output}/fig-21.browser-${tag}.png` }));
} finally {
  await browser.close();
}
