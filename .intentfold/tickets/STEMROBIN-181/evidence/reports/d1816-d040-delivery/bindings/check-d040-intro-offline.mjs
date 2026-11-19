import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const require = createRequire(`${process.cwd()}/app/package.json`);
const { chromium } = require('playwright');
const { proseFlow } = require(path.resolve('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const base = '.tmp/STEMROBIN-181/d1816';
const output = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-intro-display';
const id = 'phy10-c3-s1';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const plain = text => text.replace(/\s+/g, ' ').trim();
assert(!fs.existsSync(`${output}/result.json`));
fs.mkdirSync(output, { recursive: true });
const requests = [], records = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const viewport of [{ name: 'desktop', width: 1440, height: 960 }, { name: 'mobile', width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    await context.route('**/*', route => {
      requests.push(route.request().url());
      return route.abort();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
      const dir = `${base}/root/10p/editions/${edition}/lessons/${id}`;
      const lesson = read(`${dir}/lesson.json`);
      assert.equal(read(`${dir}/adaptation.audit.json`).status, 'pass');
      assert.equal(read(`${dir}/exercises.json`).count, 0);
      assert.equal(read(`${dir}/figures.json`).figures.length, 0);
      const flow = proseFlow(lesson.prose, lesson.section_breaks);
      const htmlFile = `${base}/display/render/10p/${edition}/${id}/text.html`;
      const html = fs.readFileSync(htmlFile, 'utf8');
      assert(!/<(?:script|link)\b/i.test(html));
      assert(html.includes('data:font/woff2;base64,'));
      await page.setContent(html, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.err,.katex-error,.sr-tex-err,input,textarea,figure').count(), 0);
      const paragraphs = await page.locator('p.para').allInnerTexts();
      assert.equal(paragraphs.length, flow.filter(x => x.kind === 'p').length);
      let index = 0;
      for (const block of flow) {
        if (block.kind !== 'p') continue;
        const actual = plain(paragraphs[index++]);
        for (const part of block.text.replace(/\*\*/g, '').split(/\$\$.*?\$\$|\$.*?\$/gs).map(plain).filter(Boolean)) {
          assert(actual.includes(part), `Missing prose: ${part}`);
        }
      }
      assert.equal(await page.locator('.katex').count(), 1);
      assert.equal(await page.locator('.katex annotation').textContent(), '10^{-8}');
      const headings = await page.locator('h1,.crumb').allInnerTexts();
      if (locale === 'en') {
        assert.equal(headings[0], 'Introduction');
        assert(!headings.some(x => /[\u3400-\u9fff]/.test(x)), 'English metadata contains source Chinese');
        assert(headings[1].includes('Atomic and Nuclear Physics'));
        assert(headings[1].includes('Introduction'));
      }
      const geometry = await page.evaluate(() => {
        const boxes = [...document.querySelector('.sheet').children].map(node => {
          const r = node.getBoundingClientRect();
          return { tag: node.tagName, x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
        });
        const fonts = [...document.querySelectorAll('p.para')].flatMap(node => {
          const baseSize = parseFloat(getComputedStyle(node).fontSize);
          return [...node.querySelectorAll('.prose-math,.katex')].map(x => ({
            family: getComputedStyle(x).fontFamily,
            ratio: parseFloat(getComputedStyle(x).fontSize) / baseSize,
          }));
        });
        return { width: document.documentElement.scrollWidth, boxes, fonts,
          indent: [...document.querySelectorAll('p.para')].map(x => getComputedStyle(x).textIndent) };
      });
      assert(geometry.width <= viewport.width + 1);
      assert(geometry.boxes.every(x => x.width > 0 && x.height > 0 && x.x >= -1 && x.right <= viewport.width + 1));
      for (let i = 1; i < geometry.boxes.length; i++) assert(geometry.boxes[i].y >= geometry.boxes[i - 1].bottom - 1);
      assert(geometry.fonts.every(x => x.family.includes('KaTeX') && x.ratio >= 1.09));
      assert(geometry.indent.every(x => parseFloat(x) === 0));
      assert.equal(errors.length, 0, errors.join('\n'));
      const screenshot = `${output}/${locale}-text-${viewport.name}.png`;
      assert(!fs.existsSync(screenshot));
      const image = await page.screenshot({ path: screenshot, fullPage: true });
      assert(image.length > 8000);
      records.push({ id, edition, locale, viewport, html: { path: htmlFile, sha256: hash(Buffer.from(html)) },
        screenshot: { path: screenshot, sha256: hash(image) }, headings, sourceBlocks: 3,
        paragraphs: paragraphs.length, writtenQuestions: 0, figures: 0, geometry, status: 'pass' });
      const written = fs.readFileSync(`${base}/display/render/10p/${edition}/${id}/exercises.html`, 'utf8');
      await page.setContent(written, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('li.ex,figure,input,textarea,.katex-error,.err').count(), 0);
    }
    await context.close();
  }
} finally {
  await browser.close();
}
assert.deepEqual(requests, []);
fs.writeFileSync(`${output}/result.json`, JSON.stringify({
  schema: 'STEMROBIN-181/offline-complete-card-display@1', batch: 'D040', id,
  status: 'pass', headless: true, offline: true, productAcceptance: false,
  records, requests, independentPixels: 'pending', parentNewImageOpens: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ id, screenshots: records.length, dom: 'PASS', pixels: 'pending', databaseWrites: false }));
