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
const B = '.tmp/STEMROBIN-181/d1816-d590';
const O = `${T}/tmp/d1816-d599-n25-offline-display`;
const ID = 'phy10-c1-s3-n25';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const plain = text => text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\s+/g, ' ').trim();
assert.equal(read(`${T}/tmp/d1816-d598-n25-native/result.json`).status,
  'NATIVE_PASS_DISPLAY_PENDING');
assert(!fs.existsSync(O));
fs.mkdirSync(O, { recursive: true });
const allowed = new Set(['modern-us-neutral', 'modern-us-neutral-en'].flatMap(edition =>
  ['text.html', 'exercises.html'].map(name => pathToFileURL(path.resolve(
    `${B}/work/render/10p/${edition}/${ID}/${name}`)).href)));
const records = [], requests = [];
let failure = null;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 960 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
      await context.route('**/*', route => {
        const url = route.request().url();
        requests.push({ url, allowed: allowed.has(url) });
        return allowed.has(url) ? route.continue() : route.abort();
      });
      try {
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
        const directory = `${B}/root/10p/editions/${edition}/lessons/${ID}`;
        const lessonFile = `${directory}/lesson.json`;
        const lesson = read(lessonFile);
        assert.equal(read(`${directory}/adaptation.audit.json`).status, 'pass');
        assert.equal(lesson.prose.length, 23);
        assert.equal(read(`${directory}/exercises.json`).count, 0);
        assert.deepEqual(read(`${directory}/figures.json`).figures.map(figure => figure.id),
          ['fig-40', 'fig-41', 'fig-42']);
        const expected = proseFlow(lesson.prose, lesson.section_breaks)
          .filter(block => !['fig', 'cap'].includes(block.kind));
        const htmlFile = `${B}/work/render/10p/${edition}/${ID}/text.html`;
        const html = fs.readFileSync(htmlFile, 'utf8');
        assert(!/<(?:script|link)\b/i.test(html));
        assert(html.includes('data:font/woff2;base64,'));
        const textUrl = pathToFileURL(path.resolve(htmlFile)).href;
        await page.goto(textUrl, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.locator('.err,.katex-error,.sr-tex-err,input,textarea').count(), 0);
        assert.equal(await page.locator('figure').count(), 3);
        const paragraphs = await page.locator('p.para').evaluateAll(nodes => nodes.map(node => {
          const clone = node.cloneNode(true);
          for (const formula of clone.querySelectorAll('.katex')) {
            const annotation = formula.querySelector('annotation');
            if (!annotation) throw Error('Missing KaTeX source');
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
          pageWidth: document.documentElement.scrollWidth,
          boxes: [...document.querySelector('.sheet').children].map(node => {
            const box = node.getBoundingClientRect();
            return { x: box.x, y: box.y, right: box.right, bottom: box.bottom,
              width: box.width, height: box.height };
          }),
          figures: [...document.querySelectorAll('figure')].map(figure => {
            const svg = figure.querySelector('svg');
            return { width: svg.getBoundingClientRect().width,
              objectCount: svg.querySelectorAll('path,line,circle,ellipse,polyline,polygon').length,
              labels: [...svg.querySelectorAll('[data-label-id]')].map(node => ({
                id: node.getAttribute('data-label-id'),
                text: node.textContent,
                fontPx: parseFloat(getComputedStyle(node).fontSize)
                  * Math.hypot(node.getScreenCTM().a, node.getScreenCTM().b),
              })) };
          }),
        }));
        assert(geometry.pageWidth <= viewport.width + 1);
        assert(geometry.boxes.every(box => box.width > 0 && box.height > 0
          && box.x >= -1 && box.right <= viewport.width + 1));
        for (let i = 1; i < geometry.boxes.length; i++)
          assert(geometry.boxes[i].y >= geometry.boxes[i - 1].bottom - 1);
        const figureSpecs = read(`${directory}/figures.json`).figures.map(figure =>
          read(`${B}/root/10p/editions/${edition}/${figure.spec}`));
        assert(geometry.figures.every((figure, index) =>
          figure.width >= Math.min(...figureSpecs[index].display.widths)
          && figure.width <= figureSpecs[index].display.maxWidthPx
          && figure.objectCount > 0 && figure.labels.length > 0
          && figure.labels.every(label => label.fontPx >= 16)));
        const heading = await page.locator('h1').innerText();
        assert(heading.includes(lesson.title));
        if (locale === 'en') assert(!/[\u3400-\u9fff]/.test(heading));
        const screenshots = [];
        const complete = `${O}/${locale}-${viewport.name}-complete-text.png`;
        await page.screenshot({ path: complete, fullPage: true });
        screenshots.push({ ...bind(complete), role: 'complete-text' });
        if (viewport.name === 'mobile') {
          await page.locator('figure').nth(2).scrollIntoViewIfNeeded();
          const figureFile = `${O}/${locale}-mobile-fig42.png`;
          await page.screenshot({ path: figureFile });
          screenshots.push({ ...bind(figureFile), role: 'mobile-phase-figure' });
        }
        const forward = page.getByRole('link', {
          name: locale === 'en' ? 'Exercises · 0 →' : '去做题 · 0 道 →', exact: true,
        });
        await forward.click();
        const exercisesFile = htmlFile.replace(/text\.html$/, 'exercises.html');
        await page.waitForURL(pathToFileURL(path.resolve(exercisesFile)).href);
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.locator('li.ex,figure,input,textarea,.err,.katex-error').count(), 0);
        const back = page.getByRole('link', {
          name: locale === 'en' ? '← Back to text' : '← 回课文', exact: true,
        });
        assert(await back.isVisible());
        await back.click();
        await page.waitForURL(textUrl);
        assert.deepEqual(errors, []);
        records.push({ locale, edition, viewport, status: 'PASS', lesson: bind(lessonFile),
          html: bind(htmlFile), exercises: bind(exercisesFile), paragraphs: paragraphs.length,
          figureCount: 3, exerciseCount: 0, geometry, screenshots, errors,
          forwardAndBackNavigation: true });
      } finally { await context.close(); }
    }
  }
} catch (error) {
  failure = { message: error.message, stack: error.stack };
} finally {
  await browser.close();
}
fs.writeFileSync(`${O}/result.json`, JSON.stringify({
  schema: 'STEMROBIN-181/offline-complete-card-display@1', course: ID, batch: 'D599',
  status: failure ? 'FAIL' : 'PASS', records, requests, failure,
  headless: true, offline: true, visualObservationPending: true,
  parentImageOpens: 0, newCourseApproval: false, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
assert.equal(failure, null);
assert.equal(records.length, 4);
assert(requests.every(row => row.allowed));
console.log(JSON.stringify({ course: ID, display: 'PASS', surfaces: 4, screenshots: 6,
  independentVisualObservation: 'PENDING' }));
