import assert from 'node:assert/strict';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import {
  root, ticket, absolute, read, bytes, bind, verify, hash, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d031-n113-unit-repair`;
const card = 'phy9-c2-s4-n113';
assert.ok(!await exists(`${folder}/result.json`));
const before = await read(`${folder}/before/result.json`);
assert.equal(before.status, 'original-failure-and-inputs-frozen');
for (const row of [...before.failures, ...before.protectedFiles, before.tool, before.display])
  await verify(row.path, row.sha256);
const tool = '.claude/skills/ld-s10y-lesson/tools/render_lesson.js';
const toolRequire = createRequire(absolute(tool));
const katex = toolRequire('katex');
function inlineFunctions(source) {
  const start = source.indexOf('const esc = ');
  const end = source.indexOf('\nfunction figureContract');
  assert.ok(start >= 0 && end > start);
  const context = vm.createContext({ katex });
  vm.runInContext(`${source.slice(start, end)}\nglobalThis.functions = {inline, proseInline};`, context);
  return context.functions;
}
const oldInline = inlineFunctions((await bytes(before.tool.path)).toString('utf8'));
const newInline = inlineFunctions((await bytes(tool)).toString('utf8'));
const regressions = [];
for (const text of [
  '米$R^2$。', '毫米$10^{-3}$。', '方$^2$。', '厘米 $^2$。',
  '厘米$$^2$$。', '111. 通过 $p$ 型和 $n$ 型半导体交接面的电流',
]) {
  assert.equal(newInline.inline(text), oldInline.inline(text));
  regressions.push({ text, status: 'pass-unchanged' });
}
for (const [unit, tex] of [['厘米', '^2'], ['毫米', '^{3}'], ['米', '^2\\times1800']]) {
  const rendered = newInline.inline(`${unit}$${tex}$。`);
  assert.ok(rendered.startsWith(`<span class="nb">${unit}<span class="katex">`));
  assert.ok(rendered.endsWith('。</span>'));
  regressions.push({ unit, tex, status: 'pass-unit-and-power-share-nonbreaking-span' });
}
const changedFields = [];
const modern = 'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral';
for (const id of ['phy9-c2-s4-n111', card, 'phy9-c2-s5-n114']) {
  const lesson = await read(`${modern}/lessons/${id}/lesson.json`);
  const exercises = await read(`${modern}/lessons/${id}/exercises.json`);
  const fields = [
    ...['title', 'printed_title'].filter(key => lesson[key])
      .map(key => ({ name: key, text: lesson[key], fn: 'inline' })),
    ...lesson.prose.filter(row => row.text)
      .map((row, index) => ({ name: `prose-${index}`, text: row.text, fn: 'proseInline' })),
    ...exercises.exercises.map((row, index) =>
      ({ name: `exercise-${index}`, text: row.text, fn: 'inline' })),
  ];
  for (const field of fields) {
    const oldValue = oldInline[field.fn](field.text);
    const newValue = newInline[field.fn](field.text);
    if (oldValue !== newValue) changedFields.push({
      card: id, field: field.name, oldSha256: hash(oldValue), newSha256: hash(newValue),
    });
  }
}
assert.deepEqual(changedFields.map(row => [row.card, row.field]),
  [[card, 'exercise-0'], [card, 'exercise-1']]);
const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render', '--book', '9p',
  '--edition', 'modern-us-neutral', '--lesson', card, '--work', `${folder}/work`];
const rendered = spawnSync(command[0], command.slice(1), {
  encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/render.json`, `${JSON.stringify({
  command, exitCode: rendered.status, signal: rendered.signal,
  stdout: rendered.stdout, stderr: rendered.stderr,
}, null, 2)}\n`);
assert.equal(rendered.status, 0, rendered.stderr);
const oldDisplay = await read(before.display.path);
const oldText = oldDisplay.results.find(row => row.surface === 'text').sourceHtml;
const newText = `${folder}/work/render/9p/modern-us-neutral/${card}/text.html`;
assert.deepEqual(await bytes(newText), await bytes(oldText.path));
const oldExercises = oldDisplay.results.find(row => row.surface === 'exercises').sourceHtml;
const newExercises = `${folder}/work/render/9p/modern-us-neutral/${card}/exercises.html`;
const exercises = await read(`${modern}/lessons/${card}/exercises.json`);
const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
const browser = await chromium.launch({ headless: true });
const surfaces = [];
let htmlEquivalence;
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(pathToFileURL(absolute(oldExercises.path)).href);
    const expected = await page.evaluate(() => {
      let movedUnits = 0;
      for (const span of document.querySelectorAll('.nb')) {
        const tex = span.querySelector('annotation[encoding="application/x-tex"]')?.textContent;
        const previous = span.previousSibling;
        if (!tex || !/^\^(?:\d|\{\d+\})/.test(tex) || previous?.nodeType !== Node.TEXT_NODE)
          continue;
        const unit = previous.textContent.match(/(?:千米|分米|厘米|毫米|微米|纳米|米)$/)?.[0];
        if (!unit) continue;
        previous.textContent = previous.textContent.slice(0, -unit.length);
        span.prepend(document.createTextNode(unit));
        movedUnits++;
      }
      return { html: document.documentElement.outerHTML, movedUnits };
    });
    assert.equal(expected.movedUnits, 4);
    await page.goto(pathToFileURL(absolute(newExercises)).href);
    await page.evaluate(() => document.fonts.ready);
    const actualHtml = await page.evaluate(() => document.documentElement.outerHTML);
    assert.equal(actualHtml, expected.html, 'Only four unit text nodes may move inside existing math spans.');
    htmlEquivalence = { movedUnits: 4, normalizedDomSha256: hash(actualHtml),
      onlyChange: 'Four existing Chinese unit text nodes move inside their following nonbreaking math spans.' };
    const metrics = await page.evaluate(() => {
      const stems = [...document.querySelectorAll('li.ex > .body')].map(body => {
        const clone = body.cloneNode(true);
        clone.querySelectorAll('figure.fig').forEach(figure => figure.remove());
        for (const formula of clone.querySelectorAll('.katex')) {
          const tex = formula.querySelector('annotation[encoding="application/x-tex"]');
          formula.replaceWith(document.createTextNode(`$${tex.textContent}$`));
        }
        return clone.textContent;
      });
      const units = [...document.querySelectorAll('.nb')].filter(span =>
        span.firstChild?.nodeType === Node.TEXT_NODE &&
        /(?:千米|分米|厘米|毫米|微米|纳米|米)$/.test(span.firstChild.textContent))
        .map(span => {
          const range = document.createRange();
          range.selectNode(span.firstChild);
          const rects = [...range.getClientRects()];
          const rect = span.getBoundingClientRect();
          return { unit: span.firstChild.textContent,
            tex: span.querySelector('annotation').textContent,
            unitLineRects: rects.length,
            fits: span.scrollWidth <= span.clientWidth + 1,
            width: rect.width, x: rect.x, y: rect.y };
        });
      return {
        stems, units,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        formulaErrors: document.querySelectorAll('.err,.katex-error').length,
        exerciseCount: document.querySelectorAll('li.ex').length,
        images: [...document.images].map(image => ({
          complete: image.complete, naturalWidth: image.naturalWidth,
        })),
        clippedMath: [...document.querySelectorAll('.nb')]
          .filter(span => span.scrollWidth > span.clientWidth + 1)
          .map(span => span.querySelector('annotation')?.textContent),
        media: [...document.querySelectorAll('figure.fig')].map(figure => ({
          id: figure.id,
          width: figure.querySelector('.figure-media').getBoundingClientRect().width,
          texts: [...figure.querySelectorAll('svg text')].map(text => {
            const matrix = text.getScreenCTM();
            return { text: text.textContent,
              size: parseFloat(getComputedStyle(text).fontSize) * Math.hypot(matrix.a, matrix.b) };
          }),
        })),
      };
    });
    const normalize = text => text.replace(/\*\*/g, '').replace(/\s+/g, '');
    assert.deepEqual(metrics.stems.map(normalize), exercises.exercises.map(row => normalize(row.text)));
    assert.equal(metrics.exerciseCount, 2);
    assert.equal(metrics.units.length, 4);
    assert.ok(metrics.units.every(row => row.unitLineRects === 1 && row.fits));
    assert.equal(metrics.overflow, false);
    assert.equal(metrics.formulaErrors, 0);
    assert.deepEqual(metrics.clippedMath, []);
    assert.deepEqual(errors, []);
    assert.ok(metrics.media.flatMap(row => row.texts).every(row => row.size >= 16));
    const screenshot = `${folder}/exercises-${viewport.width}.png`;
    await page.screenshot({ path: absolute(screenshot), fullPage: true });
    const scrollable = await page.locator('.fig[data-figure-layout="scroll"]').count();
    let scrollEnd;
    if (scrollable) {
      await page.locator('.fig[data-figure-layout="scroll"]').evaluateAll(figures =>
        figures.forEach(figure => { figure.scrollLeft = figure.scrollWidth; }));
      const file = `${folder}/exercises-${viewport.width}-scroll-end.png`;
      await page.screenshot({ path: absolute(file), fullPage: true });
      scrollEnd = await bind(file);
    }
    surfaces.push({
      id: card, surface: 'exercises', viewport, status: 'pass',
      sourceHtml: await bind(newExercises),
      screenshot: absolute(screenshot), screenshotSha256: (await bind(screenshot)).sha256,
      metrics: { ...metrics, ...(scrollEnd ? {
        scrollEndScreenshot: absolute(scrollEnd.path),
        scrollEndScreenshotSha256: scrollEnd.sha256,
      } : {}) },
    });
    await context.close();
  }
} finally {
  await browser.close();
}
for (const row of [...before.protectedFiles, ...before.failures, before.display, before.tool])
  await verify(row.path, row.sha256);
await immutableWrite(`${folder}/result.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'pass-unit-browser-pixels-pending',
  before: await bind(`${folder}/before/result.json`),
  originalFailure: await bind(`${ticket}/tmp/d031-n113-pixel-review.json`),
  toolBefore: before.tool, toolAfter: await bind(tool),
  nativeRender: await bind(`${folder}/render.json`),
  htmlEquivalence, regressions, changedFields,
  unchangedText: { before: oldText, after: await bind(newText), bytesIdentical: true },
  changedExercises: { before: oldExercises, after: await bind(newExercises) },
  results: surfaces, protectedFiles: before.protectedFiles,
  browser: { headless: true, isolated: true, userProfileUsed: false },
  limits: 'One focused render to a new work root; two affected exercise surfaces and their scroll ends checked. Approved source/science/exercise/figure bytes, original HTML/screenshots/reviews and meter unchanged. No native-finalize/SCI/figure gate replay, image opens, full tests/build, DB or complete-card/delivery claim.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(`${folder}/result.json`)));
