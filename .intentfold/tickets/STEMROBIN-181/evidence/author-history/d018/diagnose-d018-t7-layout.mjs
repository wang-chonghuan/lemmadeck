import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { ticket, read, bind, immutableWrite } from './retain-d018-evidence.mjs';

const work = `${ticket}/tmp`;
const checkpoint = `${work}/offline-d018/checkpoint-phy9-c2-s2-t7.json`;
const html = '.tmp/ld-s10y-lesson/render/9p/modern-us-neutral/phy9-c2-s2-t7/choices.html';
const require = createRequire(path.resolve('app/package.json'));
const { chromium } = require('playwright');
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  await page.goto(pathToFileURL(path.resolve(html)).href);
  await page.evaluate(() => document.fonts.ready);
  const dimensions = await page.evaluate(() => [...document.querySelectorAll('.options .sr-nb')]
    .filter(element => element.scrollWidth > element.clientWidth + 1)
    .map(element => {
      const box = element.getBoundingClientRect();
      const katex = element.querySelector('.katex');
      const glyphs = [...element.querySelectorAll('.katex-html .mord')].map(glyph => {
        const rect = glyph.getBoundingClientRect();
        return { text: glyph.textContent, left: rect.left - box.left, right: rect.right - box.left };
      });
      return {
        tex: element.querySelector('annotation').textContent,
        scrollWidth: element.scrollWidth, clientWidth: element.clientWidth,
        rect: { width: box.width, height: box.height },
        katexWidth: katex.getBoundingClientRect().width,
        font: getComputedStyle(katex).font,
        parentWidth: element.parentElement.getBoundingClientRect().width,
        glyphs,
      };
    }));
  assert.equal(dimensions.length, 2);
  const image = `${work}/d018-t7-choice-layout-diagnosis.png`;
  await page.locator('[data-question-id="electron-transfer-mass"]').screenshot({ path: image });
  await immutableWrite(`${work}/d018-t7-choice-layout-diagnosis.json`, `${JSON.stringify({
    role: 'Failed-surface geometry diagnosis, not another semantic or display gate.',
    initialCheckpoint: await bind(checkpoint), initialHtml: await bind(html),
    failedScreenshot: await bind(image), dimensions,
    independentApprovalsClaimed: false,
  }, null, 2)}\n`);
  console.log(JSON.stringify(dimensions, null, 2));
} finally {
  await browser.close();
}
