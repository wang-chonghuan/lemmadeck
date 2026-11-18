import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { isDeepStrictEqual } from 'node:util';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const out = '/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d330-t18-desktop-choice-display';
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
assert.equal(path.dirname(fileURLToPath(import.meta.url)), out);
assert.ok(!fs.existsSync(path.join(out, 'dom-capture.json')), 'First pass only; no replay');
const viewport = { width: 1440, height: 960 };
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const hash = p => sha(fs.readFileSync(p));
const inputs = [];
const binding = (p, expected, role) => {
  const file = path.resolve(repo, p);
  const sha256 = hash(file);
  if (expected) assert.equal(sha256, expected, `Input hash mismatch: ${file}`);
  const b = { path: file, sha256, role };
  inputs.push(b);
  return b;
};
const readJSON = b => JSON.parse(fs.readFileSync(b.path, 'utf8'));
const write = (name, data) => {
  const file = path.join(out, name);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
  return { path: file, sha256: hash(file) };
};
const result = {
  schema: 'STEMROBIN-181/d330-desktop-choices-first-display@1',
  ticket: 'STEMROBIN-181', card: 'phy9-c2-s4-t18',
  startedAt: new Date().toISOString(),
  execution: {
    headless: true, channel: 'chrome', viewport, deviceScaleFactor: 1,
    offline: true, networkAllowed: false, browserLaunches: 0, isolatedContexts: 0,
    actualDOMInspections: 0, independentExpectedDocumentExtractions: 0,
    fullPageCaptureAttempts: 0, fullPageCaptures: 0, imagesOpenedByScript: 0,
    retries: 0, repairs: 0, nativeRenders: 0, nativeReviews: 0, mathReviews: 0,
    foregroundActions: 0, appServerStarted: false, DBAccess: false,
    freshImagesAtEntry: 0, parentImageCountInherited: 24, parentNewImagePayloads: 0,
    maxActualImageOpens: 8, maxContextImageOpens: 24,
    permanentWorkerCreated: false, newWorktreeOrBranch: false,
  },
  originalSourceTasks: 16, selectedSourceTasks: 14, heldSourceTasks: ['1', '9'],
  completeCardClaim: false, fullGate2PASS: false, formalProductAC: false,
  surfaces: [], tiles: [], failures: [], blockedRequests: [],
  visualReview: 'PENDING-firsthand-image-opens',
};
const check = (s, ok, label, details) => {
  s.checks.push({ label, pass: !!ok, ...(details === undefined ? {} : { details }) });
  if (!ok) {
    const finding = { language: s.language, label, ...(details === undefined ? {} : { details }) };
    s.failures.push(finding);
    result.failures.push(finding);
  }
};
let browser, context;

try {
  const manifest = binding('.intentfold/tickets/STEMROBIN-181/tmp/d329-t18-scoped-display/manifest.json',
    '0576e2ab7b403545aeb78ec8a18893912fe620e46e54f4eb4ded654f6912d113', 'input-manifest');
  const assembly = binding('.intentfold/tickets/STEMROBIN-181/tmp/d328-t18-reviewed-text-assembly/manifest.json',
    '5c85c17433f6b5df33f735b6ddf7a8d3324dd582d3b40b1f4df191acf3070c61', 'reviewed-visible-input-manifest');
  result.manifest = manifest;
  result.assembly = assembly;
  const m = readJSON(manifest), a = readJSON(assembly);
  assert.equal(m.assembly.sha256, assembly.sha256);
  assert.equal(m.originalSourceTasks, 16);
  assert.deepEqual(m.omittedHeldSourceTasks, ['1', '9']);
  const method = binding('.intentfold/tickets/STEMROBIN-181/tmp/d297-t5-scoped-display/check.mjs',
    undefined, 'existing-DOM-Range-and-capture-method');
  const methodText = fs.readFileSync(method.path, 'utf8');
  const methodStart = methodText.indexOf('async function inspectPage(');
  const methodEnd = methodText.indexOf('\nfunction expectedFor(', methodStart);
  assert.ok(methodStart >= 0 && methodEnd > methodStart);
  const inspectSource = methodText.slice(methodStart, methodEnd);
  const inspectPage = vm.runInNewContext(`(${inspectSource})`);
  result.methodReuse = {
    ...method, reusedFunction: 'inspectPage', reusedFunctionSha256: sha(inspectSource),
    exactFunctionReusedWithoutNativeOrAnswerCode: true,
    supplementalChecks: 'Independent expected Document; native controls and Range collisions; all font faces loaded; last option reachability',
    captureAdaptation: 'One fullPage per language, sheet bounds, original-pixel sharp extract, height <=960, no resampling',
  };
  binding('.claude/skills/ld-s10y-lesson/tools/choice_html.mjs', m.renderer.sha256, 'shared-choiceHtml');
  const { choiceHtml } = await import(pathToFileURL(path.join(repo, m.renderer.path)).href);
  const requireApp = createRequire(path.join(repo, 'app/package.json'));
  const requireRuntime = createRequire('/Users/yong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/package.json');
  const sharp = requireRuntime('sharp');
  const { chromium } = requireApp('playwright');
  result.execution.playwrightVersion = requireApp('playwright/package.json').version;
  result.execution.playwrightPackage = binding(requireApp.resolve('playwright/package.json'), undefined, 'existing-app-playwright');
  result.execution.sharpPackage = binding(requireRuntime.resolve('sharp/package.json'), undefined, 'existing-desktop-sharp');
  const data = ['zh', 'en'].map(language => {
    const expectation = m.expectations.find(e => e.language === language && e.surface === 'choices');
    const htmlEntry = m.outputs.find(e => e.language === language && e.surface === 'choices');
    const visibleEntry = a.outputs.find(e => e.language === language && path.basename(e.path) === 'visible-only.json');
    assert.ok(expectation && htmlEntry && visibleEntry);
    assert.equal(expectation.exercises, 14);
    assert.equal(expectation.choiceOptions, 59);
    const html = binding(htmlEntry.path, htmlEntry.sha256, 'immutable-choices-HTML');
    const visible = binding(visibleEntry.path, visibleEntry.sha256, 'reviewed-visible-only');
    const views = readJSON(visible);
    assert.equal(views.length, 14);
    assert.equal(views.reduce((n, q) => n + q.options.length, 0), 59);
    assert.ok(views.every(q => ['single', 'multiple'].includes(q.mode) && q.figure_ids.length === 0
      && q.options.every(o => o.figure_ids.length === 0)));
    const htmlText = fs.readFileSync(html.path, 'utf8');
    return { language, expectation, html, visible, views,
      embeddedFontFaces: (htmlText.match(/@font-face\s*\{/g) ?? []).length,
      sourceScriptTags: (htmlText.match(/<script\b/gi) ?? []).length,
      fragments: views.map(q => ({ stem: choiceHtml(q.stem), options: q.options.map(o => choiceHtml(o.text)) })) };
  });
  delete process.env.PWDEBUG;
  process.env.PLAYWRIGHT_HTML_OPEN = 'never';
  result.execution.browserLaunches++;
  browser = await chromium.launch({ channel: 'chrome', headless: true,
    args: ['--disable-background-networking', '--disable-component-update', '--disable-sync',
      '--no-first-run', '--disable-extensions', '--disable-domain-reliability', '--no-pings',
      '--host-resolver-rules=MAP * ~NOTFOUND'] });
  result.execution.browserVersion = browser.version();
  context = await browser.newContext({ viewport, deviceScaleFactor: 1, offline: true,
    serviceWorkers: 'block', acceptDownloads: false });
  result.execution.isolatedContexts++;
  const allowed = new Set(data.map(d => pathToFileURL(d.html.path).href));
  await context.route('**/*', async route => {
    const request = route.request(), url = request.url();
    if (url.startsWith('data:') || (request.isNavigationRequest() && allowed.has(url))) await route.continue();
    else {
      result.blockedRequests.push({ url, resourceType: request.resourceType() });
      await route.abort('blockedbyclient');
    }
  });
  for (const d of data) {
    const s = { language: d.language, surface: 'choices', viewport, deviceScaleFactor: 1,
      inputHTML: d.html, visibleInput: d.visible, checks: [], failures: [],
      pageErrors: [], consoleErrors: [], requestFailures: [], actualDOMInspections: 0,
      fullPageCaptureAttempts: 0, fullPageCaptures: 0 };
    result.surfaces.push(s);
    const page = await context.newPage();
    let loaded = false;
    page.on('pageerror', e => s.pageErrors.push(String(e)));
    page.on('console', m => { if (m.type() === 'error') s.consoleErrors.push(m.text()); });
    page.on('requestfailed', r => s.requestFailures.push({ url: r.url(), failure: r.failure() }));
    try {
      result.execution.independentExpectedDocumentExtractions++;
      s.expectedViews = await page.evaluate(fragments => {
        const doc = document.implementation.createHTMLDocument('independent-expectations');
        const sourceText = node => {
          if (node.nodeType === Node.TEXT_NODE) return node.textContent;
          if (node.nodeType !== Node.ELEMENT_NODE) return '';
          if (node.matches('.katex')) {
            const tex = node.querySelector('annotation[encoding="application/x-tex"]');
            if (!tex) throw new Error('Expected rendered formula lacks TeX');
            const delimiter = node.closest('.katex-display') ? '$$' : '$';
            return `${delimiter}${tex.textContent}${delimiter}`;
          }
          if (node.tagName === 'BR') return '\n';
          const text = [...node.childNodes].map(sourceText).join('');
          return node.tagName === 'STRONG' ? `**${text}**` : text;
        };
        const extract = html => {
          const node = doc.createElement('div');
          node.innerHTML = html;
          return { text: sourceText(node), math: [...node.querySelectorAll('.katex')].map(n => ({
            tex: n.querySelector('annotation[encoding="application/x-tex"]').textContent,
            display: !!n.closest('.katex-display') })) };
        };
        return fragments.map(q => ({ stem: extract(q.stem), options: q.options.map(extract) }));
      }, d.fragments);
      const url = pathToFileURL(d.html.path).href;
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      loaded = page.url() === url;
      s.fontLoadFailures = await page.evaluate(async () => {
        const settled = await Promise.allSettled([...document.fonts].map(f => f.load()));
        await document.fonts.ready;
        return settled.flatMap((r, i) => r.status === 'rejected' ? [{ index: i, reason: String(r.reason) }] : []);
      });
      s.actualDOMInspections++;
      result.execution.actualDOMInspections++;
      const o = s.observed = await inspectPage(page);
      s.layout = await page.evaluate(() => {
        const rect = n => {
          const r = n.getBoundingClientRect();
          return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height };
        };
        const visible = n => {
          for (let p = n; p; p = p.parentElement) {
            const c = getComputedStyle(p);
            if (c.display === 'none' || c.visibility !== 'visible' || Number(c.opacity) === 0) return false;
          }
          const b = rect(n);
          return b.width > 0 && b.height > 0;
        };
        const overlap = (a, b) => Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > 1
          && Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > 1;
        const controls = [...document.querySelectorAll('.option input')].map(n => ({
          box: rect(n), visible: visible(n), appearance: getComputedStyle(n).appearance,
          label: n.getAttribute('aria-label'), name: n.name, defaultChecked: n.defaultChecked }));
        const fragments = [];
        const walker = document.createTreeWalker(document.querySelector('.sheet'), NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          if (!n.textContent.trim() || n.parentElement.closest('.katex,script,style')) continue;
          const r = document.createRange();
          r.selectNodeContents(n);
          fragments.push({ text: n.textContent, visible: visible(n.parentElement),
            boxes: [...r.getClientRects()].map(b => ({ x: b.x + scrollX, y: b.y + scrollY, width: b.width, height: b.height })) });
        }
        const math = [...document.querySelectorAll('.katex-html')].map(rect);
        const controlTextOverlaps = controls.flatMap((c, i) => fragments.flatMap(f =>
          f.boxes.some(b => overlap(c.box, b)) ? [{ controlIndex: i, text: f.text }] : []));
        const controlMathOverlaps = controls.flatMap((c, i) => math.flatMap((b, j) =>
          overlap(c.box, b) ? [{ controlIndex: i, formulaIndex: j }] : []));
        const textOverlaps = fragments.flatMap((f, i) => fragments.slice(i + 1).flatMap((g, j) =>
          f.boxes.some(a => g.boxes.some(b => overlap(a, b))) ? [{ a: i, b: i + j + 1, textA: f.text, textB: g.text }] : []));
        const scrollers = [...document.querySelectorAll('.sheet,.body,.option,.sr-nb,.nb')].flatMap(n =>
          n.scrollWidth > n.clientWidth + 1 ? [{ tag: n.tagName, className: n.className,
            clientWidth: n.clientWidth, scrollWidth: n.scrollWidth }] : []);
        return { sheet: rect(document.querySelector('.sheet')), controls, fragments,
          controlTextOverlaps, controlMathOverlaps, textOverlaps, scrollers,
          questions: [...document.querySelectorAll('li.ex')].map(n => ({
            id: n.dataset.questionId, number: n.querySelector('.no').textContent, box: rect(n),
            options: [...n.querySelectorAll('.option')].map((p, i) => ({ label: String.fromCharCode(65 + i), box: rect(p) })) })) };
      });
      const expectedMath = s.expectedViews.flatMap(q => [q.stem, ...q.options].flatMap(v => v.math));
      check(s, o.headingVisible && o.title === d.expectation.heading, 'Exact visible language heading');
      check(s, o.scriptCount === 0 && d.sourceScriptTags === 0, 'Input and live document script count zero');
      check(s, o.exercises.length === 14 && o.controls.length === 59, 'Exactly 14 questions and 59 options', {
        questions: o.exercises.length, options: o.controls.length });
      check(s, isDeepStrictEqual(o.exercises.map(e => e.questionId), d.expectation.ids), 'Exact manifest question IDs and order');
      check(s, isDeepStrictEqual(o.exercises.map(e => e.number), d.views.map((_, i) => `${i + 1}.`)),
        'Subset display numbering 1..14, not source total 16');
      check(s, o.exercises.every((e, i) => e.bodyVisible && e.text === s.expectedViews[i]?.stem.text),
        'Every complete visible stem matches independent Document text');
      for (const [i, e] of o.exercises.entries()) {
        const q = d.views[i];
        if (!q) continue;
        check(s, e.options.length === q.options.length && e.options.every((p, j) =>
          p.text === s.expectedViews[i].options[j].text && p.visible && p.disabled && !p.checked
          && p.label === String.fromCharCode(65 + j) && p.type === (q.mode === 'single' ? 'radio' : 'checkbox')),
        `All exact visible options and native ${q.mode} controls: ${d.expectation.ids[i]}`);
        check(s, e.details.length === 0, `No answer detail: ${d.expectation.ids[i]}`);
      }
      s.modes = d.views.reduce((r, q) => ({ ...r, [q.mode]: (r[q.mode] ?? 0) + 1 }), {});
      check(s, o.controls.every(c => c.tag === 'INPUT' && c.disabled && !c.checked && !c.editable),
        'Only unselected disabled native inputs');
      check(s, s.layout.controls.every(c => c.visible && c.appearance === 'auto' && !c.defaultChecked),
        'Every native control has positive visible bounds and default unchecked state');
      check(s, o.errors.length === 0 && !o.unresolvedMath, 'No KaTeX error or unrendered source', o.errors);
      check(s, isDeepStrictEqual(o.formulas.map(({ tex, display }) => ({ tex, display })), expectedMath),
        'All ordered formula annotations match independent expected Document', { formulas: o.formulas.length });
      check(s, o.formulas.every(m => m.visual && m.visual.width > 0 && m.visual.height > 0
        && m.geometry.fontSize >= 16 && m.geometry.fontFamily.includes('KaTeX_Main') && m.cutoffs.length === 0),
      'Every formula visible, readable and uncut');
      check(s, o.fontStatus === 'loaded' && o.fonts.length === d.embeddedFontFaces && o.fonts.length > 0
        && o.fonts.every(f => f.status === 'loaded') && s.fontLoadFailures.length === 0,
      'All declared font faces loaded', { declared: d.embeddedFontFaces, fonts: o.fonts, failures: s.fontLoadFailures });
      check(s, o.scroll.width <= o.scroll.clientWidth && o.scroll.width <= viewport.width
        && s.layout.scrollers.length === 0, 'No page or internal horizontal overflow', s.layout.scrollers);
      check(s, o.cutoffs.length === 0, 'No DOM/Range text clipping', o.cutoffs);
      check(s, o.collisions.length === 0 && s.layout.controlTextOverlaps.length === 0
        && s.layout.controlMathOverlaps.length === 0 && s.layout.textOverlaps.length === 0,
      'No block, option, text or control overlap', {
        blocks: o.collisions, controlText: s.layout.controlTextOverlaps,
        controlMath: s.layout.controlMathOverlaps, text: s.layout.textOverlaps });
      check(s, s.layout.fragments.every(f => f.visible && f.boxes.some(b => b.width > 0 && b.height > 0)),
        'Every non-math text fragment actually visible');
      check(s, o.media.length === 0 && o.viewOnlyExtraneousText === '', 'No unbound media or extraneous view text');
      s.lastOptionReachability = await page.evaluate(() => {
        scrollTo(0, document.scrollingElement.scrollHeight);
        const n = document.querySelector('li.ex:last-child .option:last-child');
        const r = n.getBoundingClientRect();
        return { reachedPageEnd: scrollY + innerHeight >= document.scrollingElement.scrollHeight - 1,
          lastOptionFullyVisible: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth,
          pageY: scrollY, documentHeight: document.scrollingElement.scrollHeight,
          lastOption: { left: r.left, top: r.top, right: r.right, bottom: r.bottom } };
      });
      check(s, s.lastOptionReachability.reachedPageEnd && s.lastOptionReachability.lastOptionFullyVisible,
        'Page bottom and entire final option reachable', s.lastOptionReachability);
    } catch (e) {
      check(s, false, 'First inspection error retained; no retry or repair', String(e.stack ?? e));
    } finally {
      if (loaded) {
        try {
          await page.evaluate(() => { scrollTo(0, 0); });
          s.fullPageCaptureAttempts++;
          result.execution.fullPageCaptureAttempts++;
          const file = path.join(out, `${d.language}-choices-1440x960-fullpage.png`);
          const buffer = await page.screenshot({ path: file, fullPage: true, animations: 'disabled', timeout: 30000 });
          s.fullPageCaptures++;
          result.execution.fullPageCaptures++;
          const meta = await sharp(buffer).metadata();
          s.capture = { path: file, sha256: hash(file), width: meta.width, height: meta.height,
            language: d.language, viewport, deviceScaleFactor: 1, parentHTML: d.html,
            actualCaptureNumber: 1, opened: false };
          const bounds = s.layout?.sheet;
          assert.ok(bounds, 'No measured sheet bounds; do not invent tiles');
          const left = Math.floor(bounds.x), top = Math.floor(bounds.y);
          const right = Math.ceil(bounds.x + bounds.width), bottom = Math.ceil(bounds.y + bounds.height);
          assert.ok(left >= 0 && top >= 0 && right <= meta.width && bottom <= meta.height);
          s.sheetPixelBounds = { left, top, width: right - left, height: bottom - top, right, bottom };
          for (let y = top, i = 1; y < bottom; y += 960, i++) {
            const crop = { left, top: y, width: right - left, height: Math.min(960, bottom - y) };
            const tilePath = path.join(out, `${d.language}-choices-sheet-${String(i).padStart(3, '0')}.png`);
            await sharp(buffer).extract(crop).png().toFile(tilePath);
            result.tiles.push({ path: tilePath, sha256: hash(tilePath), language: d.language,
              viewport, deviceScaleFactor: 1, crop, parentPath: file, parentSHA256: s.capture.sha256,
              parentHTML: d.html, originalPixels: true, resampled: false, opened: false,
              naturalSequence: result.tiles.length + 1,
              contentRanges: s.layout.questions.filter(q => q.box.y < y + crop.height
                && q.box.y + q.box.height > y).map(q => ({ id: q.id, number: q.number,
                questionFullyContained: q.box.y >= y && q.box.y + q.box.height <= y + crop.height,
                options: q.options.filter(p => p.box.y < y + crop.height
                  && p.box.y + p.box.height > y).map(p => ({ label: p.label,
                  fullyContained: p.box.y >= y && p.box.y + p.box.height <= y + crop.height })) })) });
          }
          check(s, result.tiles.filter(t => t.language === d.language).reduce((n, t) =>
            n + t.crop.width * t.crop.height, 0) === (right - left) * (bottom - top),
          'Exact complete sheet right/bottom tile coverage without resampling');
        } catch (e) {
          check(s, false, 'First capture failure retained; no retry', String(e.stack ?? e));
        }
      } else check(s, false, 'No capture of stale or unloaded page');
      check(s, !s.pageErrors.length && !s.consoleErrors.length && !s.requestFailures.length,
        'No page, console or resource errors', { page: s.pageErrors, console: s.consoleErrors, resources: s.requestFailures });
      await page.close();
      s.status = s.failures.length ? 'FAIL-DOM-preserved-no-repair' : 'PASS-DOM-desktop-choices-only';
      console.log(`${d.language}: ${s.status}, DOM=${s.actualDOMInspections}, capture=${s.fullPageCaptures}`);
    }
  }
} catch (e) {
  result.failures.push({ label: 'First pass stopped without rerun', error: String(e.stack ?? e) });
} finally {
  if (context) await context.close();
  if (browser) await browser.close();
  result.execution.browserClosed = !!browser;
  result.inputsAfter = inputs.map(b => ({ ...b, afterSHA256: hash(b.path), unchanged: hash(b.path) === b.sha256 }));
  if (result.inputsAfter.some(b => !b.unchanged)) result.failures.push({ label: 'Consumed input bytes changed' });
  result.finishedAt = new Date().toISOString();
  result.status = result.failures.length ? 'FAIL-DOM-preserved-no-repair' : 'PASS-DOM-visual-review-pending';
  result.plannedImageOpens = result.tiles.slice(0, 8).map(t => ({ path: t.path, sha256: t.sha256, sequence: t.naturalSequence }));
  result.unobservedBeyondBudget = result.tiles.slice(8);
  result.output = write('dom-capture.json', result);
  console.log(JSON.stringify({ status: result.status, report: result.output,
    firstDOM: result.execution.actualDOMInspections, firstCaptures: result.execution.fullPageCaptures,
    failures: result.failures, totalTiles: result.tiles.length, plannedOpens: result.plannedImageOpens,
    unobservedBeyondBudget: result.unobservedBeyondBudget.map(t => ({ path: t.path, crop: t.crop })) }, null, 2));
  process.exitCode = result.failures.length ? 1 : 0;
}
