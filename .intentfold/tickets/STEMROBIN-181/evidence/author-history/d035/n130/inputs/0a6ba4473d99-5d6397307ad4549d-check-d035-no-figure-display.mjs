import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import {
  ticket, absolute, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const [authorization, short, expectedSha] = process.argv.slice(2);
assert.equal(authorization, '--execute');
assert.ok(['n127', 'n130'].includes(short));
const card = `phy9-c2-s6-${short}`;
const nativePath = `${ticket}/tmp/d035-${short}-native/result.json`;
const folder = `${ticket}/tmp/d035-${short}-display`;
await verify(nativePath, expectedSha);
assert.ok(!await exists(`${folder}/started.json`), 'No display replay');
const native = await read(nativePath);
assert.equal(native.card, card);
assert.equal(native.counts.modernFigures, 0);
assert.equal(native.counts.modernExercises, 0);
const requireApp = createRequire(absolute('app/package.json'));
const { chromium, expect } = requireApp('@playwright/test');
const requireNative = createRequire(absolute('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const { proseFlow, proseOutline, sectionBreakIndices } = requireNative('./htmlfrag.js');
const result = {
  schema: 'ld-s10y-lesson/native-full-card-display-check@1',
  ticket: 'STEMROBIN-181', card, status: 'RUNNING',
  nativeResult: await bind(nativePath), surfaces: [], screenshots: [], failures: [],
  execution: { headless: true, isolated: true, browserLaunches: 0, nativeRerenders: 0,
    foregroundActions: 0, databaseOrAppStarted: false, formalProductAC: false },
  visualReview: 'PENDING-independent-firsthand-image-opens',
};
for (const row of native.inputs) await verify(row.path, row.sha256);
for (const language of native.languages)
  for (const row of [...language.outputs, ...language.html, language.finalize, language.render])
    await verify(row.path, row.sha256);
await immutableWrite(`${folder}/started.json`, `${JSON.stringify({
  native: await bind(nativePath), script: await bind(process.argv[1]),
  policy: 'One isolated offline browser pass, all bilingual desktop/mobile text and genuine empty exercise surfaces.',
}, null, 2)}\n`);
let browser;
let context;
function check(surface, condition, label, details) {
  if (!condition) {
    const failure = { surface: surface.id, label, details };
    surface.failures.push(failure);
    result.failures.push(failure);
  }
}
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  result.execution.browserLaunches = 1;
  result.execution.browserVersion = browser.version();
  context = await browser.newContext({
    viewport: { width: 1440, height: 960 }, offline: true, serviceWorkers: 'block',
    acceptDownloads: false,
  });
  const externalRequests = [];
  await context.route(/^https?:/, route => {
    externalRequests.push(route.request().url());
    return route.abort('blockedbyclient');
  });
  const page = await context.newPage();
  for (const language of native.languages) {
    const lesson = await read(language.outputs.find(row => path.basename(row.path) === 'lesson.json').path);
    const exercises = await read(language.outputs.find(row => path.basename(row.path) === 'exercises.json').path);
    assert.equal(exercises.count, 0);
    assert.deepEqual(exercises.exercises, []);
    const flow = proseFlow(lesson.prose, lesson.section_breaks);
    const outline = proseOutline(lesson.prose);
    const breakIndices = sectionBreakIndices(lesson.prose, lesson.section_breaks);
    const paragraphs = flow.filter(row => row.kind === 'p').map(row => row.text);
    const math = paragraphs.flatMap(text =>
      [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map(match => match[1] ?? match[2]));
    for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
      for (const kind of ['text', 'exercises']) {
        const surface = {
          id: `${language.language}-${kind}-${viewport.width}x${viewport.height}`,
          language: language.language, kind, viewport, failures: [], pageErrors: [], consoleErrors: [],
        };
        result.surfaces.push(surface);
        const onPageError = error => surface.pageErrors.push(String(error));
        const onConsole = message => {
          if (message.type() === 'error') surface.consoleErrors.push(message.text());
        };
        page.on('pageerror', onPageError);
        page.on('console', onConsole);
        try {
          const html = language.html.find(row => path.basename(row.path) === `${kind}.html`);
          surface.nativeHtml = html;
          await page.setViewportSize(viewport);
          await page.goto(pathToFileURL(absolute(html.path)).href, { waitUntil: 'load' });
          await page.evaluate(async () => { await document.fonts.ready; });
          await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
          surface.observed = await page.evaluate(() => {
            const rect = node => {
              const box = node.getBoundingClientRect();
              return { x: box.x + scrollX, y: box.y + scrollY, width: box.width, height: box.height };
            };
            const text = node => {
              if (node.nodeType === Node.TEXT_NODE) return node.textContent;
              if (node.nodeType !== Node.ELEMENT_NODE) return '';
              if (node.matches('.katex')) return `$${node.querySelector('annotation[encoding="application/x-tex"]').textContent}$`;
              if (node.tagName === 'BR') return '\n';
              const content = [...node.childNodes].map(text).join('');
              return node.tagName === 'STRONG' ? `**${content}**` : content;
            };
            const para = [...document.querySelectorAll('p.para')].map((node, index) => ({
              index, text: text(node), rect: rect(node), section: node.classList.contains('section'),
              border: getComputedStyle(node).borderTopWidth, indent: getComputedStyle(node).textIndent,
            }));
            const math = [...document.querySelectorAll('p.para .katex')].map(node => ({
              tex: node.querySelector('annotation[encoding="application/x-tex"]')?.textContent,
              rect: rect(node.querySelector('.katex-html')),
              overflow: node.closest('.nb').scrollWidth - node.closest('.nb').clientWidth,
              fontSize: parseFloat(getComputedStyle(node).fontSize),
              fontFamily: getComputedStyle(node).fontFamily,
            }));
            const children = [...document.querySelector('.sheet').children].map(node => ({ tag: node.tagName, rect: rect(node) }));
            const collisions = children.slice(1).flatMap((node, index) =>
              children[index].rect.y + children[index].rect.height > node.rect.y + 1 ? [{ previous: index, next: index + 1 }] : []);
            const cutoffs = [];
            for (const node of document.querySelectorAll('p.para,h1,.crumb,.jump')) {
              const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
              for (let item = walker.nextNode(); item; item = walker.nextNode()) {
                if (!item.textContent.trim() || item.parentElement.closest('.katex')) continue;
                const range = document.createRange();
                range.selectNodeContents(item);
                for (const r of range.getClientRects())
                  if (r.left < -1 || r.right > innerWidth + 1) cutoffs.push({ text: item.textContent, left: r.left, right: r.right });
              }
            }
            const footer = document.querySelector('.sheet').lastElementChild;
            return {
              paragraphs: para, math, collisions, cutoffs,
              media: document.querySelectorAll('figure,img').length,
              exerciseBodies: document.querySelectorAll('li.ex').length,
              exerciseLists: document.querySelectorAll('ol.ex').length,
              errors: [...document.querySelectorAll('.err,.sr-tex-err,.katex-error')].map(node => node.textContent),
              pageWidth: document.scrollingElement.scrollWidth, viewportWidth: innerWidth,
              fontStatus: document.fonts.status, scripts: document.scripts.length,
              footer: { text: footer.innerText, href: footer.getAttribute('href'), rect: rect(footer) },
            };
          });
          const observed = surface.observed;
          check(surface, observed.errors.length === 0, 'no rendering error', observed.errors);
          check(surface, observed.pageWidth <= observed.viewportWidth + 1, 'no whole-page overflow', observed.pageWidth);
          check(surface, observed.cutoffs.length === 0 && observed.collisions.length === 0,
            'no text cutoff or overlapping blocks', { cutoffs: observed.cutoffs, collisions: observed.collisions });
          check(surface, observed.scripts === 0 && externalRequests.length === 0 && observed.fontStatus === 'loaded',
            'self-contained offline fonts and no external scripts', { requests: externalRequests, fonts: observed.fontStatus });
          check(surface, observed.media === 0 && observed.exerciseBodies === 0, 'no invented figures or exercises');
          if (kind === 'text') {
            surface.intendedParagraphs = outline;
            surface.resolvedBreakIndices = breakIndices;
            surface.intendedMathSequence = math;
            check(surface, JSON.stringify(observed.paragraphs.map(row => row.text)) === JSON.stringify(paragraphs),
              'every complete exact native paragraph', { expected: paragraphs, actual: observed.paragraphs.map(row => row.text) });
            check(surface, observed.paragraphs.every(row => row.rect.width > 0 && row.rect.height > 0 && parseFloat(row.indent) === 0),
              'visible prose and no first-line indent');
            check(surface, JSON.stringify(observed.math.map(row => row.tex)) === JSON.stringify(math), 'ordered native math tokens');
            check(surface, observed.math.every(row => row.rect.width > 0 && row.rect.height > 0
              && row.rect.x >= -1 && row.rect.x + row.rect.width <= viewport.width + 1
              && row.overflow <= 1 && row.fontSize >= 16 && row.fontFamily.includes('KaTeX_Main')),
              'readable complete unclipped native formulas', observed.math);
            check(surface, JSON.stringify(observed.paragraphs.filter(row => row.section).map(row => row.index))
              === JSON.stringify(breakIndices), 'native adjacent section boundaries');
            check(surface, observed.footer.href === 'exercises.html' && /\b0\b/.test(observed.footer.text),
              'genuine zero-exercise footer', observed.footer);
          } else {
            check(surface, observed.paragraphs.length === 0 && observed.math.length === 0 && observed.exerciseLists === 0,
              'source-defined empty exercise surface');
            check(surface, observed.footer.href === 'text.html', 'return link to text');
          }
          await page.getByRole('link').scrollIntoViewIfNeeded();
          await expect(page.getByRole('link')).toBeInViewport();
          surface.endReachable = true;
          await page.evaluate(() => scrollTo({ top: 0, left: 0, behavior: 'instant' }));
          const screenshotPath = `${folder}/${surface.id}-fullpage.png`;
          await page.screenshot({ path: absolute(screenshotPath), fullPage: true, animations: 'disabled' });
          const screenshot = { surface: surface.id, ...await bind(screenshotPath), viewport, kind, language: language.language };
          surface.screenshot = screenshot;
          result.screenshots.push(screenshot);
          check(surface, surface.pageErrors.length === 0 && surface.consoleErrors.length === 0,
            'no page or console errors', { page: surface.pageErrors, console: surface.consoleErrors });
        } catch (error) {
          check(surface, false, 'execution failure', String(error.stack ?? error));
        } finally {
          page.off('pageerror', onPageError);
          page.off('console', onConsole);
          surface.status = surface.failures.length ? 'FAIL-preserved' : 'PASS-mechanical';
          console.log(`${surface.id}: ${surface.status}`);
        }
      }
    }
  }
  assert.equal(result.surfaces.length, 8);
  assert.equal(result.screenshots.length, 8);
} catch (error) {
  result.failures.push({ label: 'execution stopped', details: String(error.stack ?? error) });
} finally {
  if (context) await context.close();
  if (browser) await browser.close();
  result.execution.browserClosed = true;
  result.status = result.failures.length ? 'FAIL-preserved' : 'PASS-mechanical-independent-display-review-pending';
  await immutableWrite(`${folder}/result.json`, `${JSON.stringify(result, null, 2)}\n`);
}
console.log(JSON.stringify({ result: await bind(`${folder}/result.json`), status: result.status }));
process.exitCode = result.failures.length ? 1 : 0;
