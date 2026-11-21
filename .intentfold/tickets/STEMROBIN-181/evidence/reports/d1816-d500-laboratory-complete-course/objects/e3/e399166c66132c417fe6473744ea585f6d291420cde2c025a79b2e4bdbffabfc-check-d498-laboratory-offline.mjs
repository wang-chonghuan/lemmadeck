import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const { chromium } = createRequire(`${repo}/app/package.json`)('playwright');
const { proseFlow } = createRequire(import.meta.url)(
  path.resolve('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const T = '.intentfold/tickets/STEMROBIN-181';
const B = '.tmp/STEMROBIN-181/d1816-d492';
const O = process.argv[2] ?? `${T}/tmp/d1816-d498-laboratory-offline-display`;
const displayRoot = process.argv[3] ?? `${B}/source-work`;
const batch = process.argv[4] ?? 'D498';
const ID = 'phy10-c4-s4';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({
  path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const plain = text => text.replace(/\*\*([^*]+)\*\*/g, '$1')
  .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1').replace(/\s+/g, ' ').trim();
assert(!fs.existsSync(`${O}/result.json`));
fs.mkdirSync(O, { recursive: true });
const allowed = new Set(['modern-us-neutral', 'modern-us-neutral-en'].flatMap(edition =>
  ['text.html', 'exercises.html'].map(name => pathToFileURL(path.resolve(
    `${displayRoot}/render/10p/${edition}/${ID}/${name}`)).href)));
const records = [], requests = [];
let failure = null;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 960 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
      const context = await browser.newContext({ viewport });
      await context.route('**/*', route => {
        const url = route.request().url();
        requests.push({ url, allowed: allowed.has(url) });
        return allowed.has(url) ? route.continue() : route.abort();
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => {
        if (message.type() === 'error') errors.push(message.text());
      });
      try {
        const dir = `${B}/root/10p/editions/${edition}/lessons/${ID}`;
        const lessonFile = `${dir}/lesson.json`;
        const lesson = read(lessonFile);
        assert.equal(read(`${dir}/adaptation.audit.json`).status, 'pass');
        assert.equal(lesson.prose.length, 110);
        assert.equal(lesson.prose.filter(block => block.kind === 'h3').length, 10);
        assert.equal(read(`${dir}/exercises.json`).count, 0);
        const figures = read(`${dir}/figures.json`).figures;
        assert.equal(figures.length, 1);
        assert.equal(figures[0].id, 'fig-278');
        const expected = proseFlow(lesson.prose, lesson.section_breaks)
          .filter(block => !['fig', 'cap'].includes(block.kind));
        const htmlFile = `${displayRoot}/render/10p/${edition}/${ID}/text.html`;
        const html = fs.readFileSync(htmlFile, 'utf8');
        assert(!/<(?:script|link)\b/i.test(html));
        assert(html.includes('data:font/woff2;base64,'));
        const textUrl = pathToFileURL(path.resolve(htmlFile)).href;
        await page.goto(textUrl, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.locator('.err,.katex-error,.sr-tex-err,input,textarea').count(), 0);
        assert.equal(await page.locator('figure').count(), 1);
        if (batch !== 'D498') {
          const emphasis = await page.locator('p.para em').allInnerTexts();
          assert.deepEqual(emphasis, locale === 'zh' ? ['物镜', '目镜'] : ['objective', 'eyepiece']);
        }
        const paragraphs = await page.locator('p.para').evaluateAll(nodes => nodes.map(node => {
          const clone = node.cloneNode(true);
          for (const formula of clone.querySelectorAll('.katex')) {
            const annotation = formula.querySelector('annotation');
            if (!annotation) throw new Error('Missing KaTeX source');
            formula.replaceWith(document.createTextNode(`$${annotation.textContent}$`));
          }
          return { text: clone.textContent, lineBreaks: clone.querySelectorAll('br').length };
        }));
        assert.equal(paragraphs.length, expected.length);
        for (const [index, paragraph] of paragraphs.entries()) {
          assert.equal(plain(paragraph.text), plain(expected[index].text.replace(/\r?\n/g, '')));
          assert.equal(paragraph.lineBreaks, (expected[index].text.match(/\r?\n/g) || []).length);
        }
        const geometry = await page.evaluate(() => ({
          width: document.documentElement.scrollWidth,
          boxes: [...document.querySelector('.sheet').children].map(node => {
            const box = node.getBoundingClientRect();
            return { x: box.x, y: box.y, right: box.right, bottom: box.bottom,
              width: box.width, height: box.height };
          }),
          labels: [...document.querySelectorAll('figure svg [data-label-id]')].map(node => {
            const scale = Math.hypot(node.getScreenCTM().a, node.getScreenCTM().b);
            return { label: node.textContent, screenFontPx: parseFloat(getComputedStyle(node).fontSize) * scale };
          }),
          indents: [...document.querySelectorAll('p.para')].map(node => getComputedStyle(node).textIndent),
          fonts: [...document.querySelectorAll('p.para')].flatMap(node => {
            const size = parseFloat(getComputedStyle(node).fontSize);
            return [...node.querySelectorAll('.prose-math,.katex')].map(child => ({
              family: getComputedStyle(child).fontFamily,
              ratio: parseFloat(getComputedStyle(child).fontSize) / size,
            }));
          }),
        }));
        assert(geometry.width <= viewport.width + 1, 'Page overflows viewport');
        assert(geometry.boxes.every(box => box.width > 0 && box.height > 0 &&
          box.x >= -1 && box.right <= viewport.width + 1));
        for (let index = 1; index < geometry.boxes.length; index++)
          assert(geometry.boxes[index].y >= geometry.boxes[index - 1].bottom - 1);
        assert(geometry.labels.length >= 5);
        assert(geometry.labels.every(label => label.screenFontPx >= 16));
        assert(geometry.indents.every(indent => parseFloat(indent) === 0));
        assert(geometry.fonts.every(font => font.family.includes('KaTeX') && font.ratio >= 1.09));
        const headings = await page.locator('h1,.crumb').allInnerTexts();
        assert(headings[0].includes(lesson.title));
        if (locale === 'en') assert(!headings.some(text => /[\u3400-\u9fff]/.test(text)));
        const prefix = `${locale}-${viewport.name}`;
        const screenshots = [];
        const full = `${O}/${prefix}-complete-text.png`;
        await page.screenshot({ path: full, fullPage: true });
        screenshots.push({ ...bind(full), role: 'complete-text' });
        for (const [region, target] of [
          ['beginning', page.locator('h1')],
          ['figure', page.locator('figure')],
          ['microscope', page.locator('p.para').filter({
            hasText: locale === 'en' ? 'VII. Assemble' : '七、组装',
          })],
          ['ending', page.locator('p.para').last()],
        ]) {
          await target.scrollIntoViewIfNeeded();
          if (region === 'ending') await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          const file = `${O}/${prefix}-${region}.png`;
          await page.screenshot({ path: file, fullPage: false });
          screenshots.push({ ...bind(file), role: region });
        }
        const forward = page.getByRole('link', {
          name: locale === 'en' ? 'Exercises · 0 →' : '去做题 · 0 道 →', exact: true,
        });
        await forward.click();
        const destinationFile = htmlFile.replace(/text\.html$/, 'exercises.html');
        await page.waitForURL(pathToFileURL(path.resolve(destinationFile)).href);
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.locator('li.ex,figure,input,textarea,.err,.katex-error').count(), 0);
        const back = page.getByRole('link', {
          name: locale === 'en' ? '← Back to text' : '← 回课文', exact: true,
        });
        assert(await back.isVisible());
        assert(await page.evaluate(() => document.documentElement.scrollWidth) <= viewport.width + 1);
        const empty = `${O}/${prefix}-empty-exercises.png`;
        await page.screenshot({ path: empty, fullPage: true });
        screenshots.push({ ...bind(empty), role: 'empty-exercises' });
        await back.click();
        await page.waitForURL(textUrl);
        assert.deepEqual(errors, []);
        records.push({
          locale, edition, viewport, status: 'PASS', lesson: bind(lessonFile),
          html: bind(htmlFile), destination: bind(destinationFile), sourceBlocks: 110,
          experiments: 10, paragraphs: paragraphs.length, figureCount: 1,
          independentExercises: 0, geometry, screenshots, errors,
          observedForwardClick: true, observedBackClick: true,
        });
        fs.writeFileSync(`${O}/partial-result.json`, JSON.stringify({ records, requests }, null, 2) + '\n');
      } finally { await context.close(); }
    }
  }
} catch (error) {
  failure = { message: error.message, stack: error.stack };
} finally { await browser.close(); }
fs.writeFileSync(`${O}/result.json`, JSON.stringify({
  schema: 'STEMROBIN-181/offline-complete-card-display@1', batch, course: ID,
  status: failure ? 'FAIL' : 'PASS', records, requests, failure,
  offline: true, headless: true, visualObservationPending: true,
  parentImageOpens: 0, sourcePagesAdded: 0, completeCoursesAdded: 0,
  databaseWrites: false, productAcceptance: false,
}, null, 2) + '\n', { flag: 'wx' });
assert.equal(failure, null);
assert.equal(records.length, 4);
assert(requests.every(row => row.allowed));
console.log(JSON.stringify({ status: 'PASS', completeTextSurfaces: 4, screenshots: 24 }));
