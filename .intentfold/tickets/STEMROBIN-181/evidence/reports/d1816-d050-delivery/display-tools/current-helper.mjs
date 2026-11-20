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
const ticket = '.intentfold/tickets/STEMROBIN-181';
const output = `${ticket}/tmp/d1816-d050-n13-display`;
const work = '.tmp/STEMROBIN-181/d1816-d050/n13-display';
const root = '.tmp/STEMROBIN-181/d1816-d050/n13-root/10p';
const id = 'phy10-c1-s2-n13';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => ({ path: file, sha256: hash(fs.readFileSync(file)) });
const plain = text => text.replaceAll('**', '').replace(/\s+/g, ' ').trim();
const raw = read(`${root}/lessons/${id}/lesson.json`);
assert.deepEqual(raw.figures.map(row => row.id), ['fig-17']);
assert.equal(raw.exercise_count, 0);
assert(!fs.existsSync(`${output}/result.json`));
fs.mkdirSync(output, { recursive: true });
const checkpoint = `${output}/partial-result.json`;
const records = fs.existsSync(checkpoint) ? read(checkpoint).records : [];
for (const row of records) {
  for (const binding of [row.lesson, row.html, row.screenshot]) {
    assert.equal(hash(fs.readFileSync(binding.path)), binding.sha256);
  }
}
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
      for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
        if (records.some(row => row.locale === locale && row.viewport.name === viewport.name)) continue;
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => {
          if (message.type() === 'error') errors.push(message.text());
        });
        const directory = `${root}/editions/${edition}/lessons/${id}`;
        const lesson = read(`${directory}/lesson.json`);
        const figures = read(`${directory}/figures.json`);
        assert.equal(read(`${directory}/adaptation.audit.json`).status, 'pass');
        assert.equal(read(`${directory}/exercises.json`).count, 0);
        assert.equal(lesson.prose.length, raw.prose.length);
        assert.deepEqual(figures.figures.map(row => row.id), ['fig-17']);
        const reviewFile = `${root}/editions/${edition}/figures/fig-17.review.json`;
        assert.equal(read(reviewFile).status, 'pass');
        const flow = proseFlow(lesson.prose, lesson.section_breaks);
        const expected = flow.filter(row => row.kind === 'p');
        const htmlFile = `${work}/render/10p/${edition}/${id}/text.html`;
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
            if (!annotation) throw new Error('Missing KaTeX source annotation');
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
        const figure = page.locator('figure[id="fig-17"]');
        const specFile = `${root}/editions/${edition}/figures/fig-17.spec.json`;
        const spec = read(specFile);
        const figureGeometry = await figure.evaluate(node => {
          const media = node.querySelector('.figure-media');
          const svg = media.querySelector('svg');
          if (!svg) throw new Error('Missing deterministic SVG');
          const box = media.getBoundingClientRect();
          const content = svg.getBBox();
          const labels = [...svg.querySelectorAll('text')].map(text => {
            const matrix = text.getScreenCTM();
            if (!matrix) throw new Error('Missing SVG screen transform');
            return parseFloat(getComputedStyle(text).fontSize) * Math.hypot(matrix.a, matrix.b);
          });
          node.scrollLeft = node.scrollWidth;
          return { width: box.width, height: box.height, contentWidth: content.width,
            contentHeight: content.height,
            visibleObjects: svg.querySelectorAll('path,line,polygon,polyline,circle,ellipse,text').length,
            labelSizes: labels,
            scrollEndReachable: node.scrollLeft >= node.scrollWidth - node.clientWidth - 1 };
        });
        assert(figureGeometry.width > 0 && figureGeometry.height > 0);
        assert(figureGeometry.contentWidth > 5 && figureGeometry.contentHeight > 5);
        assert(figureGeometry.visibleObjects > 0 && figureGeometry.labelSizes.length > 0);
        assert(figureGeometry.labelSizes.every(size => size >= spec.display.minTextPx - 0.05));
        assert(figureGeometry.scrollEndReachable);
        const geometry = await page.evaluate(() => {
          const boxes = [...document.querySelector('.sheet').children].map(node => {
            const box = node.getBoundingClientRect();
            return { x: box.x, y: box.y, right: box.right, bottom: box.bottom,
              width: box.width, height: box.height };
          });
          const fonts = [...document.querySelectorAll('p.para')].flatMap(node => {
            const size = parseFloat(getComputedStyle(node).fontSize);
            return [...node.querySelectorAll('.prose-math,.katex')].map(child =>
              ({ family: getComputedStyle(child).fontFamily,
                ratio: parseFloat(getComputedStyle(child).fontSize) / size }));
          });
          return { width: document.documentElement.scrollWidth, boxes,
            fontCount: fonts.length, fontFamilies: [...new Set(fonts.map(font => font.family))],
            minFontRatio: Math.min(...fonts.map(font => font.ratio)),
            indents: [...document.querySelectorAll('p.para')].map(node => getComputedStyle(node).textIndent) };
        });
        assert(geometry.width <= viewport.width + 1);
        assert(geometry.boxes.every(box => box.width > 0 && box.height > 0 && box.x >= -1
          && box.right <= viewport.width + 1));
        for (let index = 1; index < geometry.boxes.length; index++) {
          assert(geometry.boxes[index].y >= geometry.boxes[index - 1].bottom - 1);
        }
        assert(geometry.fontCount > 0 && geometry.fontFamilies.every(family => family.includes('KaTeX')));
        assert(geometry.minFontRatio >= 1.09);
        assert(geometry.indents.every(indent => parseFloat(indent) === 0));
        const headings = await page.locator('h1,.crumb').allInnerTexts();
        assert(headings[0].includes(lesson.title));
        if (locale === 'en') assert(!headings.some(text => /[\u3400-\u9fff]/.test(text)));
        const screenshot = `${output}/n13-${locale}-${viewport.name}.png`;
        const image = await page.screenshot({ path: screenshot, fullPage: true });
        assert(image.length > 8000);
        await page.setContent(fs.readFileSync(htmlFile.replace(/text\.html$/, 'exercises.html'), 'utf8'),
          { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.locator('li.ex,figure,input,textarea,.katex-error,.err').count(), 0);
        assert.deepEqual(errors, []);
        records.push({ id, edition, locale, viewport, lesson: bind(`${directory}/lesson.json`),
          html: bind(htmlFile), screenshot: { path: screenshot, sha256: hash(image) },
          headings, sourceBlocks: lesson.prose.length, paragraphs: paragraphs.length,
          figureChecks: [{ id: 'fig-17', spec: bind(specFile), ...figureGeometry }],
          geometry, emptyExercisesChecked: true, status: 'pass' });
        fs.writeFileSync(checkpoint, JSON.stringify({ records }, null, 2) + '\n');
        await page.close();
      }
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
assert.equal(records.length, 4);
assert.deepEqual(requests, []);
fs.writeFileSync(`${output}/result.json`, JSON.stringify({
  schema: 'STEMROBIN-181/offline-complete-card-display@1', batch: 'D050',
  status: 'pass', headless: true, offline: true, productAcceptance: false,
  records, requests, independentPixels: 'pending', parentImageOpens: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ surfaces: records.length, figuresPerSurface: 1,
  status: 'pass', independentPixels: 'pending', databaseWrites: false }));
