import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const { proseFlow } = require(path.resolve('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d259-display`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const verify = row => assert.equal(bind(row.path).sha256, row.sha256);
const plain = text => text.replaceAll('**', '').replace(/\s+/g, ' ').trim();
const cards = ['n44', 'n51'].map(name => {
  const native = read(`${T}/tmp/d1816-d259-${name}-native/result.json`);
  assert.equal(native.status, 'native-pass-display-pending');
  return native;
});
assert(!fs.existsSync(`${O}/result.json`));
fs.mkdirSync(O, { recursive: true });
const partial = `${O}/partial-result.json`;
const records = fs.existsSync(partial) ? read(partial).records : [];
for (const row of records) for (const value of [row.lesson, row.html, row.screenshot]) verify(value);
const requests = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 960 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({ viewport });
    await context.route('**/*', route => {
      requests.push(route.request().url());
      return route.abort();
    });
    try {
      for (const card of cards) for (const [locale, edition] of [
        ['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en'],
      ]) {
        const { id, figure, root, display } = card;
        if (records.some(row => row.id === id && row.locale === locale &&
          row.viewport.name === viewport.name)) continue;
        const page = await context.newPage();
        try {
          const errors = [];
          page.on('pageerror', error => errors.push(error.message));
          page.on('console', message => {
            if (message.type() === 'error') errors.push(message.text());
          });
          const raw = read(`${root}/9p/lessons/${id}/lesson.json`);
          const dir = `${root}/9p/editions/${edition}/lessons/${id}`;
          const lessonFile = `${dir}/lesson.json`;
          const lesson = read(lessonFile);
          assert.equal(read(`${dir}/adaptation.audit.json`).status, 'pass');
          assert.equal(read(`${dir}/exercises.json`).count, 0);
          assert.equal(lesson.prose.length, raw.prose.length);
          assert.deepEqual(read(`${dir}/figures.json`).figures.map(row => row.id), [figure]);
          const specFile = `${root}/9p/editions/${edition}/figures/${figure}.spec.json`;
          const spec = read(specFile);
          const review = read(specFile.replace('.spec.json', '.review.json'));
          assert.equal(review.status, 'pass');
          assert.equal(review.spec.sha256, bind(specFile).sha256);
          const expected = proseFlow(lesson.prose, lesson.section_breaks).filter(row => row.kind === 'p');
          const htmlFile = `${display}/render/9p/${edition}/${id}/text.html`;
          const html = fs.readFileSync(htmlFile, 'utf8');
          assert(!/<(?:script|link)\b/i.test(html));
          assert(html.includes('data:font/woff2;base64,'));
          await page.setContent(html, { waitUntil: 'load' });
          await page.evaluate(() => document.fonts.ready);
          assert.equal(await page.locator('.err,.katex-error,.sr-tex-err,input,textarea').count(), 0);
          const paragraphs = await page.locator('p.para').evaluateAll(nodes => nodes.map(node => {
            const clone = node.cloneNode(true);
            for (const formula of clone.querySelectorAll('.katex')) {
              const annotation = formula.querySelector('annotation');
              if (!annotation) throw new Error('Missing KaTeX source');
              formula.replaceWith(document.createTextNode(`$${annotation.textContent}$`));
            }
            return { text: clone.textContent, lineBreaks: clone.querySelectorAll('br').length,
              section: node.classList.contains('section') };
          }));
          assert.equal(paragraphs.length, expected.length);
          for (const [index, paragraph] of paragraphs.entries()) {
            assert.equal(plain(paragraph.text), plain(expected[index].text.replace(/\r?\n/g, '')));
            assert.equal(paragraph.lineBreaks, (expected[index].text.match(/\r?\n/g) || []).length);
            assert.equal(paragraph.section, !!expected[index].sectionBreak);
          }
          assert.equal(await page.locator('figure.fig').count(), 1);
          const media = await page.locator(`figure[id="${figure}"]`).evaluate(node => {
            const container = node.querySelector('.figure-media');
            const svg = container?.querySelector('svg');
            if (!svg) throw new Error('Missing SVG');
            const box = container.getBoundingClientRect();
            const content = svg.getBBox();
            const labelSizes = [...svg.querySelectorAll('text')].map(text => {
              const matrix = text.getScreenCTM();
              if (!matrix) throw new Error('Missing SVG transform');
              return parseFloat(getComputedStyle(text).fontSize) * Math.hypot(matrix.a, matrix.b);
            });
            return { width: box.width, height: box.height,
              contentWidth: content.width, contentHeight: content.height, labelSizes,
              visibleObjects: svg.querySelectorAll('path,line,polygon,circle,text').length };
          });
          assert(media.width > 0 && media.height > 0 && media.contentWidth > 5);
          assert(media.contentHeight > 5 && media.visibleObjects > 0 && media.labelSizes.length > 0);
          assert(media.labelSizes.every(size => size >= spec.display.minTextPx - 0.05));
          assert(media.width >= Math.min(...spec.display.widths) - 1);
          assert(media.width <= spec.display.maxWidthPx + 1);
          const geometry = await page.evaluate(() => {
            const boxes = [...document.querySelector('.sheet').children].map(node => {
              const box = node.getBoundingClientRect();
              return { x: box.x, y: box.y, right: box.right, bottom: box.bottom,
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
              fonts, indents: [...document.querySelectorAll('p.para')]
                .map(node => getComputedStyle(node).textIndent) };
          });
          assert(geometry.width <= viewport.width + 1);
          assert(geometry.boxes.every(box => box.width > 0 && box.height > 0 &&
            box.x >= -1 && box.right <= viewport.width + 1));
          for (let index = 1; index < geometry.boxes.length; index++)
            assert(geometry.boxes[index].y >= geometry.boxes[index - 1].bottom - 1);
          assert(geometry.fonts.length > 0 && geometry.fonts.every(font =>
            font.family.includes('KaTeX') && font.ratio >= 1.09));
          assert(geometry.indents.every(indent => parseFloat(indent) === 0));
          const headings = await page.locator('h1,.crumb').allInnerTexts();
          assert(headings[0].includes(lesson.title));
          if (locale === 'en') assert(!headings.some(text => /[\u3400-\u9fff]/.test(text)));
          const screenshot = `${O}/${card.name}-${locale}-${viewport.name}.png`;
          const image = await page.screenshot({ path: screenshot, fullPage: true });
          assert(image.length > 8000);
          await page.setContent(fs.readFileSync(htmlFile.replace(/text\.html$/, 'exercises.html'), 'utf8'));
          await page.evaluate(() => document.fonts.ready);
          assert.equal(await page.locator('li.ex,figure,input,textarea,.katex-error,.err').count(), 0);
          assert.deepEqual(errors, []);
          records.push({ id, locale, edition, viewport, status: 'pass',
            lesson: bind(lessonFile), html: bind(htmlFile), screenshot: bind(screenshot),
            sourceBlocks: lesson.prose.length, paragraphs: paragraphs.length,
            media, geometry, emptyExercisesChecked: true });
          fs.writeFileSync(partial, JSON.stringify({ records }, null, 2) + '\n');
        } finally { await page.close(); }
      }
    } finally { await context.close(); }
  }
} finally { await browser.close(); }
assert.equal(records.length, 8);
assert.deepEqual(requests, []);
fs.writeFileSync(`${O}/result.json`, JSON.stringify({
  schema: 'STEMROBIN-181/offline-complete-card-display@1', batch: 'D259',
  status: 'pass', records, requests, offline: true, headless: true,
  visualObservationPending: true, databaseWrites: false, productAcceptance: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ status: 'pass', surfaces: records.length }));
