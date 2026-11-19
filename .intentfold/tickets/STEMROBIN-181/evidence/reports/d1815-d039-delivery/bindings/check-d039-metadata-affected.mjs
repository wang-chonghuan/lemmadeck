import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(`${process.cwd()}/app/package.json`);
const { chromium } = require('playwright');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => ({ path: file, sha256: hash(fs.readFileSync(file)) });
const ticket = '.intentfold/tickets/STEMROBIN-181';
const output = `${ticket}/tmp/d1815-offline-metadata-affected`;
const original = `${ticket}/tmp/d1815-offline-display`;
const render = '.tmp/STEMROBIN-181/d1815/display-metadata/render/10p/modern-us-neutral-en';
const ids = ['phy10-c2-s6-n113', 'phy10-c2-s6-n114'];
assert(!fs.existsSync(`${output}/result.json`));
fs.mkdirSync(output, { recursive: true });
const records = [];
const externalRequests = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const viewport of [{ name: 'desktop', width: 1440, height: 960 }, { name: 'mobile', width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    await context.route('**/*', route => {
      externalRequests.push(route.request().url());
      return route.abort();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    for (const id of ids) {
      const firstHtml = `${original}/modern-us-neutral-en-${id}-text-${viewport.name}.html`;
      const html = fs.readFileSync(`${render}/${id}/text.html`, 'utf8');
      const withoutCrumb = value => value.replace(/<div class="crumb">.*?<\/div>/s, '<div class="crumb"></div>');
      assert.equal(withoutCrumb(html), withoutCrumb(fs.readFileSync(firstHtml, 'utf8')),
        'Only localized chapter metadata may change');
      assert(!/<(?:script|link)\b/i.test(html));
      await page.setContent(html, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.err,.katex-error,.sr-tex-err,input,textarea').count(), 0);
      const crumb = await page.locator('.crumb').innerText();
      assert(crumb.includes('Chapter 10') && crumb.includes('The actions of light, light quanta'));
      assert(crumb.includes(`Printed page ${id.endsWith('113') ? 286 : 288}`));
      assert(!/[\u3400-\u9fff]/.test(crumb), 'English metadata must be localized');
      const geometry = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        boxes: [...document.querySelector('.sheet').children].map(node => {
          const r = node.getBoundingClientRect();
          return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
        }),
      }));
      assert(geometry.width <= viewport.width + 1);
      assert(geometry.boxes.every(r => r.x >= -1 && r.right <= viewport.width + 1 && r.width > 0 && r.height > 0));
      for (let i = 1; i < geometry.boxes.length; i++) {
        assert(geometry.boxes[i].y >= geometry.boxes[i - 1].bottom - 1);
      }
      assert.equal(errors.length, 0, errors.join('\n'));
      const screenshot = `${output}/modern-us-neutral-en-${id}-text-${viewport.name}.png`;
      assert(!fs.existsSync(screenshot));
      const image = await page.screenshot({ path: screenshot, fullPage: true });
      assert(image.length > 8000);
      const htmlFile = screenshot.replace(/\.png$/, '.html');
      fs.writeFileSync(htmlFile, html, { flag: 'wx' });
      records.push({ id, edition: 'modern-us-neutral-en', surface: 'text', viewport,
        screenshot, screenshotHash: hash(image), html: htmlFile, htmlHash: hash(Buffer.from(html)),
        firstHtml: bind(firstHtml), onlyCrumbChanged: true, crumb, geometry, status: 'pass' });
    }
    await context.close();
  }
} finally {
  await browser.close();
}
assert.equal(externalRequests.length, 0);
fs.writeFileSync(`${output}/result.json`, JSON.stringify({
  batch: 'D039', status: 'pass', records, externalRequests, headless: true, isolated: true,
  productAcceptance: false, parentImageOpens: 0, independentVisualInspection: 'pending',
  renderer: bind('.claude/skills/ld-s10y-lesson/tools/render_lesson.js'),
  beforeRenderer: bind(`${ticket}/tmp/d1814-recovery/render_lesson.before-en-metadata.js`),
  tocs: ['zh', 'en'].map(locale => bind(`ssot-resources/soviet10year-textbooks/toc/10p/${locale}.json`)),
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ status: 'pass', affectedScreenshots: records.length, onlyCrumbChanged: true }));
