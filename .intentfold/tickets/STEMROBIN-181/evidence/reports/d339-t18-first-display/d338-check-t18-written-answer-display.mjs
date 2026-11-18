import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { choiceHtml } from '../../../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs';
import {
  ticket, absolute, read, bind, verify, exists, immutableWrite, hash,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const base = `${ticket}/tmp`, out = `${base}/d338-t18-written-answer-display`;
assert.equal(await exists(`${out}/started.json`), false);
const manifestPath = `${base}/d329-t18-scoped-display/manifest.json`;
await verify(manifestPath, '0576e2ab7b403545aeb78ec8a18893912fe620e46e54f4eb4ded654f6912d113');
const manifest = await read(manifestPath);
const methodPath = `${base}/d297-t5-scoped-display/check.mjs`;
const methodText = await fs.readFile(absolute(methodPath), 'utf8');
const start = methodText.indexOf('async function inspectPage(');
const end = methodText.indexOf('\nfunction expectedFor(', start);
assert.ok(start >= 0 && end > start);
const inspectSource = methodText.slice(start, end);
const inspectPage = vm.runInNewContext(`(${inspectSource})`);
const requireApp = createRequire(absolute('app/package.json'));
const { chromium } = requireApp('playwright');
const runtimePackage = '/Users/yong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/package.json';
const sharp = createRequire(runtimePackage)('sharp');
const inputs = [await bind(manifestPath), await bind(methodPath), await bind(runtimePackage)];
const data = [];
for (const language of ['zh', 'en']) {
  const expected = manifest.expectations.find(row => row.language === language && row.surface === 'answers');
  const html = manifest.outputs.find(row => row.language === language && row.surface === 'answers');
  for (const binding of [expected.contentInput, expected.promptInput, html]) {
    await verify(binding.path, binding.sha256);
    inputs.push(binding);
  }
  const answers = await read(expected.contentInput.path);
  const questions = await read(expected.promptInput.path);
  assert.equal(answers.answers.length, 14);
  assert.equal(questions.exercises.length, 14);
  assert.deepEqual(answers.answers.map(row => row.exercise), questions.exercises.map(row => String(row.number)));
  const fragments = questions.exercises.flatMap((question, i) =>
    [choiceHtml(question.text), choiceHtml(answers.answers[i].displayAnswer)]);
  const htmlText = await fs.readFile(absolute(html.path), 'utf8');
  data.push({ language, expected, html, fragments,
    fontFaces: (htmlText.match(/@font-face\s*\{/g) ?? []).length });
}
await immutableWrite(`${out}/started.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card: 'phy9-c2-s4-t18',
  status: 'FIRST-WRITTEN-ANSWER-FOUR-SURFACE-DISPLAY',
  inputs, sourceTasks: 14, omittedHeldSourceTasks: ['1', '9'],
  nativeRenders: 0, semanticReviews: 0, parentImageOpens: 0,
}, null, 2)}\n`);
const result = {
  ticket: 'STEMROBIN-181', batch: 'D033', card: 'phy9-c2-s4-t18',
  inputs, methodReuse: { path: methodPath, function: 'inspectPage', sha256: hash(Buffer.from(inspectSource)) },
  startedUtc: new Date().toISOString(), surfaces: [], tiles: [], failures: [],
  execution: { browserLaunches: 0, DOMInspections: 0, screenshots: 0,
    headless: true, offline: true, nativeRenders: 0, semanticReviews: 0, retries: 0,
    parentImageOpens: 0, parentImageCount: 24, newWorktreesBranchesPermanentWorkers: 0 },
  fullGate2PASS: false, completeCardClaim: false, actualVisualDISPLAY: false,
};
const check = (surface, condition, label, details) => {
  surface.checks.push({ label, pass: Boolean(condition), ...(details === undefined ? {} : { details }) });
  if (!condition) result.failures.push({ id: surface.id, label, details });
};
let browser;
try {
  delete process.env.PWDEBUG;
  process.env.PLAYWRIGHT_HTML_OPEN = 'never';
  result.execution.browserLaunches++;
  browser = await chromium.launch({ channel: 'chrome', headless: true,
    args: ['--disable-background-networking', '--disable-sync', '--no-first-run', '--disable-extensions'] });
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1,
      offline: true, serviceWorkers: 'block', acceptDownloads: false });
    const allowed = new Set(data.map(row => pathToFileURL(absolute(row.html.path)).href));
    await context.route('**/*', route => {
      const request = route.request(), url = request.url();
      return url.startsWith('data:') || (request.isNavigationRequest() && allowed.has(url))
        ? route.continue() : route.abort('blockedbyclient');
    });
    try {
      for (const row of data) {
        const surface = { id: `${row.language}-answers-${viewport.width}`, language: row.language,
          viewport, inputHTML: row.html, checks: [], pageErrors: [], consoleErrors: [], requestFailures: [] };
        result.surfaces.push(surface);
        const page = await context.newPage();
        page.on('pageerror', error => surface.pageErrors.push(String(error)));
        page.on('console', message => { if (message.type() === 'error') surface.consoleErrors.push(message.text()); });
        page.on('requestfailed', request => surface.requestFailures.push(request.url()));
        try {
          await page.goto(pathToFileURL(absolute(row.html.path)).href, { waitUntil: 'load' });
          surface.fontFailures = await page.evaluate(async () => {
            const results = await Promise.allSettled([...document.fonts].map(font => font.load()));
            await document.fonts.ready;
            return results.filter(row => row.status === 'rejected').length;
          });
          result.execution.DOMInspections++;
          const observed = surface.observed = await inspectPage(page, row.fragments);
          check(surface, observed.headingVisible && observed.title === row.expected.heading, 'Exact visible language heading');
          check(surface, observed.exercises.length === 14 &&
            observed.exercises.every((exercise, i) => exercise.id === row.expected.ids[i]), 'All fourteen source task identities');
          check(surface, observed.exercises.every((exercise, i) => exercise.bodyVisible &&
            exercise.text === observed.expectedVisibleFragments[2 * i] &&
            exercise.answer === observed.expectedVisibleFragments[2 * i + 1]),
          'Every written question and standard answer matches frozen reviewed projection');
          check(surface, observed.exercises.every(exercise =>
            exercise.details.length === 1 && exercise.details[0].open && exercise.details[0].visible),
          'Exactly fourteen open readonly standard answers');
          check(surface, observed.controls.length === 0, 'No answer input or old keyboard interaction');
          check(surface, observed.errors.length === 0 && !observed.unresolvedMath, 'No KaTeX or unresolved formula error');
          check(surface, observed.formulas.every(formula => formula.visual &&
            formula.visual.width > 0 && formula.visual.height > 0 &&
            formula.geometry.fontSize >= 16 && formula.geometry.fontFamily.includes('KaTeX_Main') &&
            formula.cutoffs.length === 0), 'All formulas visible readable and uncut');
          check(surface, observed.fontStatus === 'loaded' && observed.fonts.length === row.fontFaces &&
            observed.fonts.every(font => font.status === 'loaded') && surface.fontFailures === 0,
          'Every embedded font face loaded');
          check(surface, observed.scroll.width <= observed.scroll.clientWidth &&
            observed.scroll.width <= viewport.width, 'No whole-page horizontal overflow');
          check(surface, observed.collisions.length === 0 && observed.cutoffs.length === 0,
            'No block collision or clipped text', { collisions: observed.collisions, cutoffs: observed.cutoffs });
          check(surface, observed.media.length === 0 && observed.scriptCount === 0 &&
            observed.viewOnlyExtraneousText === '', 'No unbound image script or extra content');
          const last = page.locator('li.ex').last();
          const summary = last.locator('summary');
          await summary.click();
          check(surface, await last.locator('details').getAttribute('open') === null, 'Last answer closes using native summary');
          await summary.click();
          check(surface, await last.locator('details').getAttribute('open') !== null, 'Last answer reopens using native summary');
          surface.reachability = await page.evaluate(() => {
            scrollTo(0, document.scrollingElement.scrollHeight);
            const node = document.querySelector('li.ex:last-child details');
            const box = node.getBoundingClientRect();
            return { pageEnd: scrollY + innerHeight >= document.scrollingElement.scrollHeight - 1,
              answerBottomReachable: box.bottom <= innerHeight && box.right <= innerWidth,
              box: { top: box.top, bottom: box.bottom, right: box.right } };
          });
          check(surface, surface.reachability.pageEnd && surface.reachability.answerBottomReachable,
            'Page end and complete final answer bottom reachable', surface.reachability);
          surface.sheet = await page.locator('.sheet').evaluate(node => {
            const box = node.getBoundingClientRect();
            return { x: box.x + scrollX, y: box.y + scrollY, width: box.width, height: box.height };
          });
          await page.evaluate(() => scrollTo(0, 0));
          const file = `${out}/${surface.id}-fullpage.png`;
          assert.equal(await exists(file), false);
          await page.screenshot({ path: absolute(file), fullPage: true, animations: 'disabled' });
          result.execution.screenshots++;
          const meta = await sharp(absolute(file)).metadata();
          surface.capture = { ...await bind(file), width: meta.width, height: meta.height, opened: false };
          const left = Math.floor(surface.sheet.x), top = Math.floor(surface.sheet.y);
          const right = Math.ceil(surface.sheet.x + surface.sheet.width), bottom = meta.height;
          assert.ok(Math.abs(surface.sheet.y + surface.sheet.height - bottom) < 1);
          assert.ok(left >= 0 && top >= 0 && right <= meta.width);
          assert.ok(observed.exercises.every(exercise =>
            exercise.geometry.y >= top && exercise.geometry.y + exercise.geometry.height <= bottom));
          for (let y = top, index = 1; y < bottom; y += viewport.height, index++) {
            const crop = { left, top: y, width: right - left, height: Math.min(viewport.height, bottom - y) };
            const tile = `${out}/${surface.id}-sheet-${String(index).padStart(3, '0')}.png`;
            await sharp(absolute(file)).extract(crop).png().toFile(absolute(tile));
            result.tiles.push({ ...await bind(tile), surface: surface.id, language: row.language,
              viewport, crop, parentCapture: surface.capture, originalPixels: true, resampled: false,
              opened: false, contentRanges: observed.exercises.filter(exercise =>
                exercise.geometry.y < y + crop.height && exercise.geometry.y + exercise.geometry.height > y)
                .map(exercise => ({ id: exercise.id, number: exercise.number })) });
          }
          check(surface, result.tiles.filter(tile => tile.surface === surface.id)
            .reduce((sum, tile) => sum + tile.crop.width * tile.crop.height, 0) ===
            (right - left) * (bottom - top), 'Every captured sheet pixel tiled once');
        } catch (error) {
          check(surface, false, 'First display error preserved no retry', String(error.stack ?? error));
        } finally {
          check(surface, !surface.pageErrors.length && !surface.consoleErrors.length && !surface.requestFailures.length,
            'No page console or resource error');
          await page.close();
          surface.status = surface.checks.every(row => row.pass) ? 'PASS-DOM-only' : 'FAIL-retained';
        }
      }
    } finally {
      await context.close();
    }
  }
} finally {
  await browser?.close();
  result.execution.browserClosed = Boolean(browser);
  for (const binding of inputs) await verify(binding.path, binding.sha256);
  result.finishedUtc = new Date().toISOString();
  result.status = result.failures.length ? 'FAIL-DOM-retained-visual-pending' : 'PASS-DOM-four-surfaces-visual-pending';
  const reportPath = `${out}/dom-capture.json`;
  await immutableWrite(reportPath, `${JSON.stringify(result, null, 2)}\n`);
  for (const entry of await fs.readdir(absolute(out))) await fs.chmod(absolute(`${out}/${entry}`), 0o444);
  console.log(JSON.stringify({ report: await bind(reportPath), status: result.status,
    DOMInspections: result.execution.DOMInspections, screenshots: result.execution.screenshots,
    tiles: result.tiles.length, failures: result.failures, parentImageOpens: 0 }));
  process.exitCode = result.failures.length ? 1 : 0;
}
