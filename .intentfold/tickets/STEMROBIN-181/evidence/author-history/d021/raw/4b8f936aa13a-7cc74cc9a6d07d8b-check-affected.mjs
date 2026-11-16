import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import {
  root, out, modern, affected, pinned, absolute, bind, read, verify, absent,
  immutableWrite, oldHistory, readiness, unchangedContent, helperBindings,
  exactSet, expectedSurfaces, surfaceKey,
} from './common.mjs';

const args = process.argv.slice(2);
assert.equal(args.length, 2, 'Usage: node check-affected.mjs --main-ready NATIVE-LAYOUT-FIX.json');
assert.equal(args[0], '--main-ready', 'Main explicit readiness is mandatory');
delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = 'never';
const rawPath = `${out}/result-affected-raw.json`;
const effectivePath = `${out}/result-effective.json`;
const failurePath = `${out}/check-failure.json`;
for (const file of [rawPath, effectivePath, failurePath]) await absent(file);
const history = await oldHistory();
const ready = await readiness(args[1], history, true);
const content = await unchangedContent(history);
const helpers = await helperBindings();
const lesson = await read(`${modern}/lessons/${affected}/lesson.json`);
const figures = await read(`${modern}/lessons/${affected}/figures.json`);
const references = lesson.prose.flatMap(block =>
  block.kind === 'fig' ? [block.id] : (block.figures ?? []).map(item => item.id));
const caps = lesson.prose.filter(block => block.kind === 'cap');
const sourceCaps = lesson.source.data.prose.filter(block => block.kind === 'cap');
assert.equal(caps.length, 5);
assert.deepEqual(caps.map(block => block.label), sourceCaps.map(block => block.label),
  'All source-known caption labels are retained');
const capLabels = caps.map(block => block.label);
const captionFigures = caps.map(cap => {
  const figure = lesson.figures.find(item => item.label === cap.label);
  assert.ok(figure, `Unknown caption: ${cap.label}`);
  return { id: figure.id, label: cap.label, text: cap.text, sourceRefs: cap.source_refs };
});
const originalRun = lesson.prose.filter(block =>
  (block.kind === 'fig' && ['fig-156', 'fig-157'].includes(block.id)) ||
  (block.kind === 'cap' && captionFigures.some(item =>
    ['fig-156', 'fig-157'].includes(item.id) && item.label === block.label)));
assert.deepEqual(originalRun.map(block => block.kind),
  ['fig', 'fig', 'cap', 'cap'], 'Do not reorder source/lesson blocks to fix display');
assert.deepEqual(originalRun.filter(block => block.kind === 'fig').map(block => block.id),
  ['fig-156', 'fig-157']);
const { choiceHtml } = await import(pathToFileURL(
  path.join(root, '.claude/skills/ld-s10y-lesson/tools/choice_html.mjs')).href);
const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
for (const width of [1440, 390]) {
  await absent(`${out}/${affected}-text-${width}.png`);
  await absent(`${out}/${affected}-text-${width}-scroll-end.png`);
}
const results = [];
let openedSurfaces = 0;
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    try {
      const page = await context.newPage();
      openedSurfaces += 1;
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(pathToFileURL(absolute(ready.newText.path)).href);
      await page.evaluate(() => document.fonts.ready);
      await page.locator('h1').waitFor();
      const metrics = await page.evaluate(() => {
        const markdownText = element => {
          if (!element) return null;
          const clone = element.cloneNode(true);
          for (const formula of clone.querySelectorAll('.katex')) {
            const tex = formula.querySelector('annotation[encoding="application/x-tex"]');
            if (!tex) throw new Error('Rendered formula has no source annotation');
            formula.replaceWith(document.createTextNode(`$${tex.textContent}$`));
          }
          return clone.textContent;
        };
        const renderedFigures = [...document.querySelectorAll('figure.fig')];
        return {
          heading: document.querySelector('h1')?.textContent,
          bodyText: document.body.innerText,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          formulaErrors: document.querySelectorAll('.err,.sr-tex-err,.tex-err,.katex-error').length,
          clippedAnswerMath: [...document.querySelectorAll('details .sr-nb')]
            .filter(element => element.scrollWidth > element.clientWidth + 1)
            .map(element => element.querySelector('annotation')?.textContent),
          clippedChoiceMath: [...document.querySelectorAll('.options .sr-nb')]
            .filter(element => element.scrollWidth > element.clientWidth + 1)
            .map(element => element.querySelector('annotation')?.textContent),
          orphanQuotes: [...document.querySelectorAll('p.para')]
            .filter(p => /^[\u201d\u2019\u300d\u300f]+$/.test(p.textContent.trim())).length,
          images: [...document.images].map(image => ({
            complete: image.complete, naturalWidth: image.naturalWidth,
            width: image.getBoundingClientRect().width, height: image.getBoundingClientRect().height,
          })),
          media: renderedFigures.map(figure => ({
            id: figure.id,
            width: figure.querySelector('.figure-media').getBoundingClientRect().width,
            texts: [...figure.querySelectorAll('svg text')].map(text => {
              const matrix = text.getScreenCTM();
              return {
                text: text.textContent,
                size: parseFloat(getComputedStyle(text).fontSize) * Math.hypot(matrix.a, matrix.b),
              };
            }),
          })),
          breaks: [...document.querySelectorAll('p.para.section')].map(line => {
            let previous = line.previousElementSibling;
            while (previous?.matches('figure.fig,.figcap')) previous = previous.previousElementSibling;
            if (!previous?.matches('p.para')) throw new Error('Semantic break has no preceding prose paragraph');
            return { before: markdownText(previous), after: markdownText(line) };
          }),
          captions: [...document.querySelectorAll('.figcap')].map(cap => ({
            text: cap.textContent, previousFigure: cap.previousElementSibling?.matches('figure.fig')
              ? cap.previousElementSibling.id : null,
          })),
          captionAdjacency: renderedFigures.map(figure => ({
            id: figure.id,
            nextIsCaption: figure.nextElementSibling?.matches('.figcap') ?? false,
            nextText: figure.nextElementSibling?.textContent ?? null,
          })),
          affectedDisplayOrder: [...document.querySelectorAll('figure.fig,.figcap')]
            .filter(element => ['fig-156', 'fig-157'].includes(element.id) ||
              (element.matches('.figcap') &&
                /^\u56fe\s*(156|157)$/.test(element.textContent.trim())))
            .map(element => element.matches('figure.fig')
              ? { kind: 'fig', id: element.id } : { kind: 'cap', text: element.textContent }),
        };
      });
      const normalize = text => text?.replace(/\s+/g, '');
      assert.ok(metrics.heading.includes(lesson.title), affected);
      assert.equal(metrics.overflow, false, '82 text page overflow');
      assert.equal(metrics.formulaErrors, 0, '82 text formula error');
      assert.equal(metrics.orphanQuotes, 0, '82 orphan closing quote');
      assert.deepEqual(errors, [], '82 browser errors');
      assert.equal(metrics.media.length, references.length, '82 missing figure');
      assert.ok(metrics.images.every(image => image.complete && image.naturalWidth > 0 && image.width > 0));
      for (const [index, id] of references.entries()) {
        const figure = figures.figures.find(item => item.id === id);
        const spec = await read(`${modern}/${figure.spec}`);
        const media = metrics.media[index];
        assert.equal(media.id, id, '82 figure order mismatch');
        assert.ok(media.width > 0, '82 blank figure');
        assert.ok(media.texts.every(text => text.size >= spec.display.minTextPx),
          `${id}: text below actual media-width floor`);
      }
      exactSet(metrics.captions.map(cap => normalize(cap.text)),
        capLabels.map(normalize), 'Every source-known caption exactly once');
      for (const expected of captionFigures) {
        const matches = metrics.captionAdjacency.filter(item => item.id === expected.id);
        assert.equal(matches.length, 1, `Figure must occur once: ${expected.id}`);
        assert.equal(matches[0].nextIsCaption, true, `${expected.id}.nextElementSibling is not .figcap`);
        assert.equal(normalize(matches[0].nextText), normalize(expected.text),
          `${expected.id}: adjacent caption label does not match`);
        const cap = metrics.captions.find(item => normalize(item.text) === normalize(expected.text));
        assert.equal(cap.previousFigure, expected.id, 'Caption attached to wrong figure');
      }
      const pairCaps = ['fig-156', 'fig-157'].map(id => captionFigures.find(item => item.id === id));
      assert.deepEqual(metrics.affectedDisplayOrder.map(item =>
        item.kind === 'fig' ? item : { kind: 'cap', text: normalize(item.text) }), [
        { kind: 'fig', id: 'fig-156' }, { kind: 'cap', text: normalize(pairCaps[0].text) },
        { kind: 'fig', id: 'fig-157' }, { kind: 'cap', text: normalize(pairCaps[1].text) },
      ], 'Display must be fig156,cap156,fig157,cap157');
      const boundaries = await page.evaluate(html => {
        const text = fragment => {
          const container = document.createElement('div');
          container.innerHTML = fragment;
          for (const formula of container.querySelectorAll('.katex')) {
            const tex = formula.querySelector('annotation[encoding="application/x-tex"]');
            if (!tex) throw new Error('Expected boundary has no math source annotation');
            formula.replaceWith(document.createTextNode(`$${tex.textContent}$`));
          }
          return container.textContent;
        };
        return html.map(boundary => ({ before: text(boundary.before), after: text(boundary.after) }));
      }, (lesson.section_breaks ?? []).map(boundary => ({
        before: choiceHtml(boundary.before), after: choiceHtml(boundary.after),
      })));
      for (const boundary of boundaries) {
        assert.ok(metrics.breaks.some(line =>
          normalize(line.before) === normalize(boundary.before) &&
          normalize(line.after) === normalize(boundary.after)), '82 semantic break misplaced');
      }
      const scrollEnds = await page.evaluate(() =>
        [...document.querySelectorAll('.nb, figure.fig, li.ex .body')]
          .filter(element => element.scrollWidth > element.clientWidth + 1).map(element => {
            element.scrollLeft = element.scrollWidth;
            return {
              kind: element.tagName,
              tex: element.querySelector('annotation[encoding="application/x-tex"]')?.textContent ?? null,
              scrollWidth: element.scrollWidth, clientWidth: element.clientWidth, scrollLeft: element.scrollLeft,
              endReached: element.scrollLeft + element.clientWidth >= element.scrollWidth - 1,
            };
          }));
      assert.ok(scrollEnds.every(item => item.endReached), '82 unreachable horizontal end');
      if (scrollEnds.length) {
        const endScreenshot = `${out}/${affected}-text-${viewport.width}-scroll-end.png`;
        await page.screenshot({ path: absolute(endScreenshot), fullPage: true });
        metrics.scrollEndScreenshot = absolute(endScreenshot);
        metrics.scrollEndScreenshotSha256 = (await bind(endScreenshot)).sha256;
      }
      metrics.scrollEnds = scrollEnds;
      await page.evaluate(() => {
        for (const element of document.querySelectorAll('.nb, figure.fig, li.ex .body')) element.scrollLeft = 0;
        window.scrollTo(0, document.documentElement.scrollHeight);
        if (scrollY + innerHeight < document.documentElement.scrollHeight - 1) throw new Error('Page end unreachable');
        window.scrollTo(0, 0);
      });
      const screenshot = `${out}/${affected}-text-${viewport.width}.png`;
      await page.screenshot({ path: absolute(screenshot), fullPage: true });
      results.push({
        id: affected, surface: 'text', viewport, metrics, screenshot: absolute(screenshot),
        screenshotSha256: (await bind(screenshot)).sha256, sourceHtml: ready.newText,
      });
      await page.close();
    } finally {
      await context.close();
    }
  }
} catch (error) {
  await immutableWrite(failurePath, {
    status: 'fail', error: error.message, results, openedSurfaces,
    mainReadiness: ready.requestBinding, helpers,
    policy: 'No resume or implicit rerun. Main must diagnose before explicitly authorizing another attempt.',
  });
  throw error;
} finally {
  await browser.close();
}
assert.equal(openedSurfaces, 2);
assert.equal(results.length, 2);
// Detect concurrent mutation before recording a usable effective result.
await readiness(args[1], history, true);
await unchangedContent(history);
for (const item of helpers) await verify(item);
await immutableWrite(rawPath, {
  ticket: 'STEMROBIN-181', batch: 'D021', status: 'pass', results,
  browser: { headless: true, isolated: true, userProfileUsed: false, htmlReportAutoOpen: false },
  openedSurfaces, mainReadiness: ready.requestBinding, nativeRender: ready.request.nativeRender,
  mainExplicitReadiness: true,
  nativeHelper: ready.request.nativeHelper, renderer: ready.request.renderer,
  helpers, basis: pinned.oldCheck, captions: captionFigures,
  scope: 'ONLY82 text at desktop/mobile. Existing offline checks plus explicit source-known caption adjacency.',
  nativeInvocations: 0, substantiveGateInvocations: 0, imagesOpenedByModel: 0,
});
const merged = history.result.results.map(row =>
  row.id === affected && row.surface === 'text'
    ? results.find(item => surfaceKey(item) === surfaceKey(row)) : row);
exactSet(merged.map(surfaceKey), expectedSurfaces, 'Actual existing10 plus new2 surfaces');
await immutableWrite(effectivePath, {
  ticket: 'STEMROBIN-181', batch: 'D021', status: 'pass',
  surface: 'existing offline renderer, caption-affected composition',
  results: merged, reusedSurfaceCount: 10, newSurfaceCount: 2,
  rawResult: await bind(rawPath), mainReadiness: ready.requestBinding,
  nativeRender: ready.request.nativeRender, nativeHelper: ready.request.nativeHelper,
  renderer: ready.request.renderer, helpers, ...content,
  oldHtmlAliases: ready.request.oldHtmlAliases,
  oldRendererAlias: ready.request.oldRendererAlias,
  rawHistory: { result: pinned.result, tiles: pinned.tiles, native: pinned.native,
    initialReviews: pinned.reviews, checkHelper: pinned.oldCheck, cropHelper: pinned.oldCrop,
    rendererBefore: pinned.oldRenderer },
  reuseProof: history.result.results.filter(row => !(row.id === affected && row.surface === 'text'))
    .map(row => ({
      key: surfaceKey(row), oldResult: pinned.result, sourceHtml: row.sourceHtml,
      screenshot: { path: row.screenshot, sha256: row.screenshotSha256 },
      method: 'Exact old row, HTML SHA and screenshot SHA; no browser recheck',
    })),
  browser: { headless: true, isolated: true, userProfileUsed: false, htmlReportAutoOpen: false,
    newSurfaces: 2, reusedSurfacesNotOpened: 10 },
  scope: 'Machine receipt only. SCREEN approval requires the later exact-pixel/fresh-review composition.',
});
console.log(JSON.stringify(await bind(effectivePath)));
