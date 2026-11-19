import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const require = createRequire(`${process.cwd()}/app/package.json`);
const { chromium } = require('playwright');
const { proseFlow } = require(path.resolve('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const base = '.tmp/STEMROBIN-181/d1817';
const output = process.argv[2] || '.intentfold/tickets/STEMROBIN-181/tmp/d1817-n128-display';
assert(/^\.intentfold\/tickets\/STEMROBIN-181\/tmp\/d1817-n128-display(?:-affected)?$/.test(output));
const id = 'phy10-c3-s3-n128';
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
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
      const directory = `${base}/n128-root/10p/editions/${edition}/lessons/${id}`;
      const lesson = read(`${directory}/lesson.json`);
      assert.equal(read(`${directory}/adaptation.audit.json`).status, 'pass');
      assert.equal(read(`${directory}/exercises.json`).count, 0);
      assert.equal(read(`${directory}/figures.json`).figures.length, 0);
      assert.equal(lesson.prose.length, 7);
      assert.equal(lesson.section_breaks.length, 3);
      const flow = proseFlow(lesson.prose, lesson.section_breaks);
      const htmlFile = `${base}/display/render/10p/${edition}/${id}/text.html`;
      const html = fs.readFileSync(htmlFile, 'utf8');
      assert(!/<(?:script|link)\b/i.test(html));
      assert(html.includes('data:font/woff2;base64,'));
      await page.setContent(html, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.err,.katex-error,.sr-tex-err,input,textarea,figure').count(), 0);
      const paragraphs = await page.locator('p.para').evaluateAll(nodes => nodes.map(node => {
        const clone = node.cloneNode(true);
        for (const formula of clone.querySelectorAll('.katex')) {
          const annotation = formula.querySelector('annotation');
          if (!annotation) throw new Error('Missing KaTeX source annotation');
          formula.replaceWith(document.createTextNode(`$${annotation.textContent}$`));
        }
        return clone.textContent;
      }));
      assert.equal(paragraphs.length, locale === 'zh' ? 12 : 13);
      const expected = flow.filter(block => block.kind === 'p');
      assert.equal(paragraphs.length, expected.length);
      for (const [index, paragraph] of paragraphs.entries()) {
        assert.equal(plain(paragraph), plain(expected[index].text.replaceAll('**', '').replace(/\r?\n/g, '')));
        assert(!paragraph.includes('**'), 'Unresolved bold delimiter');
      }
      assert.equal(await page.locator('p.para.section').count(), 3);
      const math = await page.locator('p.para .katex annotation').allTextContents();
      assert.deepEqual(math, ['x', '\\alpha', 'x', 'x']);
      assert(await page.locator('p.para strong').count() >= 3);
      const headings = await page.locator('h1,.crumb').allInnerTexts();
      assert(headings[0].includes(lesson.title));
      if (locale === 'en') assert(!headings.some(text => /[\u3400-\u9fff]/.test(text)));
      const geometry = await page.evaluate(() => {
        const boxes = [...document.querySelector('.sheet').children].map(node => {
          const box = node.getBoundingClientRect();
          return { tag: node.tagName, x: box.x, y: box.y, right: box.right, bottom: box.bottom,
            width: box.width, height: box.height };
        });
        const fonts = [...document.querySelectorAll('p.para')].flatMap(node => {
          const size = parseFloat(getComputedStyle(node).fontSize);
          return [...node.querySelectorAll('.prose-math,.katex')].map(child => ({
            family: getComputedStyle(child).fontFamily,
            ratio: parseFloat(getComputedStyle(child).fontSize) / size,
          }));
        });
        return { width: document.documentElement.scrollWidth, boxes,
          fontCount: fonts.length, fontFamilies: [...new Set(fonts.map(font => font.family))],
          minFontRatio: Math.min(...fonts.map(font => font.ratio)),
          maxFontRatio: Math.max(...fonts.map(font => font.ratio)),
          indents: [...document.querySelectorAll('p.para')].map(node => getComputedStyle(node).textIndent) };
      });
      assert(geometry.width <= viewport.width + 1);
      assert(geometry.boxes.every(box => box.width > 0 && box.height > 0 && box.x >= -1 && box.right <= viewport.width + 1));
      for (let index = 1; index < geometry.boxes.length; index++) {
        assert(geometry.boxes[index].y >= geometry.boxes[index - 1].bottom - 1);
      }
      assert(geometry.fontCount > 0);
      assert(geometry.fontFamilies.every(family => family.includes('KaTeX')));
      assert(geometry.minFontRatio >= 1.09);
      assert(geometry.indents.every(indent => parseFloat(indent) === 0));
      assert.deepEqual(errors, []);
      const screenshot = `${output}/${locale}-text-${viewport.name}.png`;
      assert(!fs.existsSync(screenshot));
      const image = await page.screenshot({ path: screenshot, fullPage: true });
      assert(image.length > 8000);
      records.push({ id, edition, locale, viewport, html: { path: htmlFile, sha256: hash(Buffer.from(html)) },
        screenshot: { path: screenshot, sha256: hash(image) }, headings, sourceBlocks: 7,
        paragraphs: paragraphs.length, sectionBreaks: 3, math, writtenQuestions: 0, figures: 0,
        geometry, status: 'pass' });
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
  schema: 'STEMROBIN-181/offline-complete-card-display@1', batch: 'D041', id,
  status: 'pass', headless: true, offline: true, productAcceptance: false,
  records, requests, independentPixels: 'pending', parentNewImageOpens: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ id, screenshots: records.length, dom: 'PASS', independentPixels: 'pending', databaseWrites: false }));
