import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { chromium } from '../../../app/node_modules/playwright/index.mjs';

const ROOT = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), ROOT);
const OUT = path.join(ROOT, '.tmp/stemrobin-184-six/n47-offline-diagnosis');
const ORIGINAL = path.join(ROOT, '.tmp/stemrobin-184-six/n47-offline');
const PREVIEW = path.join(ROOT, '.tmp/stemrobin-184-six/n47-preview');
const output = path.join(OUT, 'diagnosis-evidence.json');
assert(!fs.existsSync(output), 'The unique first diagnosis may not be replayed.');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const rel = file => path.relative(ROOT, file);
const report = {
  schema: 'stemrobin1846/n47-affected-layout-diagnosis@1',
  started: new Date().toISOString(), cwd: ROOT,
  scope: 'Technical geometry diagnosis only: text .nb and choices .sr-nb/.option-text. No written preview, screenshot, image observation, content/math/behavior tests or clicks.',
  accounting: { browserTransactions: 0, screenshotCreations: 0, actualImageToolViews: 0,
    manualPNGOrPillowDecodesOrOpens: 0, parentImagesOrDecodes: 0,
    hiddenBrowserImageInternals: 'UNKNOWN', nativeClicks: 0,
    reserve2: 'LOCKED; unused', paidCalls: 0, networkDocumentation: 0 },
  reads: [], custody: {}, requests: [], views: [], technicalAssertions: [], errors: [],
  cleanup: { browserClosed: false, contextsClosed: [] },
  visualVerdict: 'NOT_PERFORMED; NO_VISUAL_PASS',
  existingFirstGateVerdict: 'FAIL; unchanged',
  hypothesis: {
    mathRule: '.nb, .sr-nb { overflow-y: hidden; padding-block: 0.3em; }',
    optionRule: '.preview-option .option-text { overflow-y: hidden; padding-block: 0.3em; }',
    horizontalPreservation: 'Existing overflow-x:auto is retained; no width, font-size or formula changes.',
    application: 'Temporary style element in each isolated offline browser page only.',
  },
};
const read = (file, purpose) => {
  const bytes = fs.readFileSync(file);
  report.reads.push({ path: rel(file), bytes: bytes.length, sha256: sha(bytes), purpose });
  return bytes;
};
const record = (id, passed, actual) => {
  const item = { id, passed: Boolean(passed), actual };
  report.technicalAssertions.push(item);
  if (!item.passed) console.error(JSON.stringify({ diagnosticFailure: item }));
};
function custody() {
  const files = [], directories = [];
  function walk(dir) {
    directories.push({ path: rel(dir), mode: (fs.statSync(dir).mode & 0o777).toString(8) });
    for (const item of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(dir, item.name);
      assert(!item.isSymbolicLink());
      if (item.isDirectory()) walk(file);
      else {
        assert(item.isFile());
        const bytes = read(file, 'Original frozen-package raw-byte custody hash only; PNGs are not decoded or image-opened');
        files.push({ path: rel(file), bytes: bytes.length, sha256: sha(bytes),
          mode: (fs.statSync(file).mode & 0o777).toString(8) });
      }
    }
  }
  walk(ORIGINAL);
  return { files, directories };
}
report.custody.before = custody();
const originalManifestFile = path.join(ORIGINAL, 'hash-manifest.json');
const originalManifest = JSON.parse(read(originalManifestFile, 'Validate own first-package custody manifest').toString('utf8'));
record('original-manifest-unchanged-from-first-freeze',
  sha(fs.readFileSync(originalManifestFile)) === '840cd5bead575dc7347184504c78ef275ee872d0ef8238aec6d16f982f99cc23',
  { sha256: sha(fs.readFileSync(originalManifestFile)) });
for (const item of originalManifest.ownedFiles) {
  const actual = report.custody.before.files.find(x => x.path === item.path);
  record(`original-custody:${item.path}`, actual?.sha256 === item.sha256
    && actual.bytes === item.bytes && actual.mode === '444', actual);
}
const first = JSON.parse(read(path.join(ORIGINAL, 'browser-evidence-first.json'),
  'Own first geometric failure/preview binding evidence only').toString('utf8'));
for (const name of ['text.html', 'choices.html']) {
  const file = path.join(PREVIEW, name);
  const bytes = read(file, 'Authorized current affected preview only');
  const expected = first.bindings.find(x => x.path === rel(file));
  record(`affected-preview-binding:${name}`, expected?.sha256 === sha(bytes),
    { expected, actualSha256: sha(bytes) });
}

async function fontReady(page) {
  await page.waitForLoadState('load');
  return page.evaluate(async () => {
    await document.fonts.ready;
    const fonts = new Map();
    for (const el of document.querySelectorAll('.nb .katex-html span,.sr-nb .katex-html span')) {
      const s = getComputedStyle(el), family = s.fontFamily.split(',')[0].replaceAll('"', '');
      if (family.startsWith('KaTeX_')) {
        fonts.set(`${s.fontStyle} ${s.fontWeight} ${s.fontSize} "${family}"`, el.textContent || '()x0');
      }
    }
    for (const [font, sample] of fonts) await document.fonts.load(font, sample);
    await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return { readyState: document.readyState, fontsStatus: document.fonts.status,
      loadedFaces: [...document.fonts].filter(f => f.status === 'loaded')
        .map(f => ({ family: f.family, style: f.style, weight: f.weight })) };
  });
}

async function snapshot(page, selector) {
  return page.evaluate(selector => {
    const number = value => parseFloat(value) || 0;
    const containers = [...document.querySelectorAll(selector)].map((el, index) => {
      el.scrollTop = 0;
      el.scrollLeft = 0;
      const s = getComputedStyle(el), r = el.getBoundingClientRect();
      const horizontalGutter = Math.max(0,
        el.offsetHeight - el.clientHeight - number(s.borderTopWidth) - number(s.borderBottomWidth));
      const verticalGutter = Math.max(0,
        el.offsetWidth - el.clientWidth - number(s.borderLeftWidth) - number(s.borderRightWidth));
      const viewport = {
        top: r.top + number(s.borderTopWidth),
        bottom: r.bottom - number(s.borderBottomWidth) - horizontalGutter,
        left: r.left + number(s.borderLeftWidth),
        right: r.right - number(s.borderRightWidth) - verticalGutter,
      };
      const ranges = [];
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        if (!n.textContent.trim() || n.parentElement.closest('.katex-mathml')) continue;
        const range = document.createRange();
        range.selectNodeContents(n);
        for (const box of range.getClientRects()) {
          if (box.width <= 0 || box.height <= 0) continue;
          ranges.push({ text: n.textContent, katexDescendant: Boolean(n.parentElement.closest('.katex-html')),
            parentClass: n.parentElement.className,
            left: box.left, right: box.right, top: box.top, bottom: box.bottom,
            width: box.width, height: box.height,
            protrudesTop: Math.max(0, viewport.top - box.top),
            protrudesBottom: Math.max(0, box.bottom - viewport.bottom) });
        }
      }
      const minimumTop = ranges.length ? Math.min(...ranges.map(x => x.top)) : null;
      const maximumBottom = ranges.length ? Math.max(...ranges.map(x => x.bottom)) : null;
      const topExcess = minimumTop == null ? 0 : Math.max(0, viewport.top - minimumTop);
      const bottomExcess = maximumBottom == null ? 0 : Math.max(0, maximumBottom - viewport.bottom);
      const verticalEnabled = ['auto', 'scroll'].includes(s.overflowY);
      return {
        index, className: el.className,
        parentClass: el.parentElement.className,
        questionId: el.closest('[data-question-id]')?.dataset.questionId ?? null,
        optionId: el.closest('[data-option-id]')?.dataset.optionId ?? null,
        rect: { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height },
        clientHeight: el.clientHeight, scrollHeight: el.scrollHeight, offsetHeight: el.offsetHeight,
        clientWidth: el.clientWidth, scrollWidth: el.scrollWidth, offsetWidth: el.offsetWidth,
        computed: { overflowX: s.overflowX, overflowY: s.overflowY,
          paddingTop: s.paddingTop, paddingBottom: s.paddingBottom,
          paddingLeft: s.paddingLeft, paddingRight: s.paddingRight,
          fontSize: s.fontSize, lineHeight: s.lineHeight, boxSizing: s.boxSizing,
          borderTop: s.borderTopWidth, borderBottom: s.borderBottomWidth,
          scrollbarGutter: s.scrollbarGutter, maskImage: s.maskImage, clipPath: s.clipPath },
        scrollbars: { horizontalGutterPx: horizontalGutter, verticalGutterPx: verticalGutter,
          verticalScrollEnabled: verticalEnabled,
          verticalOverflowPx: Math.max(0, el.scrollHeight - el.clientHeight),
          verticalScrollbarEligible: verticalEnabled && el.scrollHeight > el.clientHeight,
          horizontalOverflowPx: Math.max(0, el.scrollWidth - el.clientWidth),
          horizontalScrollEnabled: ['auto', 'scroll'].includes(s.overflowX),
          drawnScrollbarPixels: 'NOT_OBSERVED; zero images' },
        viewport, rangeBounds: { minimumTop, maximumBottom,
          height: minimumTop == null ? null : maximumBottom - minimumTop, topExcess, bottomExcess },
        ranges, containsFullRangeBoundsExactly: topExcess === 0 && bottomExcess === 0,
        initiallyAffected: topExcess > 0 || bottomExcess > 0 || verticalGutter > 0
          || (verticalEnabled && el.scrollHeight > el.clientHeight),
      };
    });
    return {
      document: { viewportWidth: innerWidth, viewportHeight: innerHeight,
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        documentHeight: document.documentElement.scrollHeight },
      containers,
    };
  }, selector);
}

async function endpoints(page, selector) {
  return page.evaluate(async selector => {
    const rows = [];
    const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
    for (const [index, el] of [...document.querySelectorAll(selector)].entries()) {
      if (el.scrollWidth <= el.clientWidth) continue;
      const style = getComputedStyle(el);
      if (!['auto', 'scroll'].includes(style.overflowX)) continue;
      el.scrollIntoView({ block: 'center', inline: 'nearest' });
      el.scrollTop = 0;
      const getEndpoint = side => {
        const all = [], walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let n;
        while ((n = walker.nextNode())) {
          if (!n.textContent.trim() || n.parentElement.closest('.katex-mathml')) continue;
          const range = document.createRange(); range.selectNodeContents(n);
          for (const r of range.getClientRects()) if (r.width > 0 && r.height > 0) {
            all.push({ text: n.textContent, left: r.left, right: r.right, top: r.top, bottom: r.bottom });
          }
        }
        const range = all.reduce((a, b) => !a || (side === 'left' ? b.left < a.left : b.right > a.right) ? b : a, null);
        if (!range) return { reachable: false, reason: 'No Range' };
        const r = el.getBoundingClientRect();
        const x = side === 'left' ? Math.max(r.left + 2, range.left + 1)
          : Math.min(r.left + el.clientWidth - 2, range.right - 1);
        const y = Math.max(2, Math.min(innerHeight - 2, (range.top + range.bottom) / 2));
        const hit = document.elementFromPoint(x, y);
        const maskChain = [];
        for (let p = el; p; p = p.parentElement) {
          const s = getComputedStyle(p);
          if ((s.maskImage && s.maskImage !== 'none') || (s.clipPath && s.clipPath !== 'none')) maskChain.push(p.className);
        }
        return { range, viewportLeft: r.left, viewportRight: r.left + el.clientWidth,
          reachable: side === 'left' ? range.left >= r.left - 1 : range.right <= r.left + el.clientWidth + 1,
          roundingTolerancePx: 1, hitUnmasked: el === hit || el.contains(hit),
          hitElement: hit?.tagName, point: { x, y }, maskChain };
      };
      el.scrollLeft = 0; await frame();
      const left = getEndpoint('left');
      const maxScroll = el.scrollWidth - el.clientWidth;
      el.scrollLeft = maxScroll; await frame();
      const actualRightScroll = el.scrollLeft, right = getEndpoint('right');
      el.scrollLeft = 0; el.scrollTop = 0; await frame();
      rows.push({ index, className: el.className, clientWidth: el.clientWidth, scrollWidth: el.scrollWidth,
        maxScroll, actualRightScroll, left, right, resetLeft: el.scrollLeft,
        passed: left.reachable && right.reachable && left.hitUnmasked && right.hitUnmasked
          && !left.maskChain.length && !right.maskChain.length
          && Math.abs(maxScroll - actualRightScroll) <= 1 && el.scrollLeft === 0 });
    }
    window.scrollTo(0, 0);
    return rows;
  }, selector);
}

let browser;
try {
  assert(report.technicalAssertions.every(x => x.passed), 'Custody or preview changed before diagnosis.');
  try {
    browser = await chromium.launch({ headless: false, timeout: 30000 });
    report.gui = { mode: 'headed', limitation: null };
  } catch (error) {
    if (!/display|xserver|x server|window server|gui|headed|cannot open/i.test(error.message)) throw error;
    report.gui = { mode: 'headless', limitation: error.message };
    browser = await chromium.launch({ headless: true, timeout: 30000 });
  }
  report.browserVersion = browser.version();
  report.accounting.browserTransactions = 1;
  for (const viewport of [
    { id: 'desktop', width: 1440, height: 960, mobile: false },
    { id: 'mobile', width: 390, height: 844, mobile: true },
  ]) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      screen: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1, isMobile: viewport.mobile, hasTouch: viewport.mobile,
      offline: true, serviceWorkers: 'block',
    });
    await context.route('**/*', route => {
      const url = route.request().url();
      const allowed = url.startsWith('data:') || (url.startsWith('file:')
        && ['text.html', 'choices.html'].some(file => fileURLToPath(url) === path.join(PREVIEW, file)));
      report.requests.push({ view: viewport.id, url, allowed });
      return allowed ? route.continue() : route.abort('blockedbyclient');
    });
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push({ type: 'pageerror', message: error.message }));
    try {
      for (const kind of ['text', 'choices']) {
        const name = `${viewport.id}-${kind}`;
        const selector = kind === 'text' ? 'p.para .nb' : '.preview-question .sr-nb,.preview-option .option-text';
        await page.goto(pathToFileURL(path.join(PREVIEW, `${kind}.html`)).href);
        const fonts = await fontReady(page);
        const before = await snapshot(page, selector);
        const beforeEndpoints = await endpoints(page, selector);
        const css = kind === 'text'
          ? 'p.para .nb { overflow-y: hidden; padding-block: 0.3em; }'
          : '.preview-question .sr-nb, .preview-option .option-text { overflow-y: hidden; padding-block: 0.3em; }';
        await page.addStyleTag({ content: css });
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        const after = await snapshot(page, selector);
        const afterEndpoints = await endpoints(page, selector);
        const affectedIndices = before.containers.filter(x => x.initiallyAffected).map(x => x.index);
        const pairs = before.containers.map(b => {
          const a = after.containers.find(x => x.index === b.index);
          return { index: b.index, className: b.className, questionId: b.questionId, optionId: b.optionId,
            initiallyAffected: b.initiallyAffected,
            before: { dimensions: { clientHeight: b.clientHeight, scrollHeight: b.scrollHeight,
              offsetHeight: b.offsetHeight, rectHeight: b.rect.height,
              clientWidth: b.clientWidth, scrollWidth: b.scrollWidth, offsetWidth: b.offsetWidth },
              overflow: b.computed, scrollbars: b.scrollbars, rangeBounds: b.rangeBounds },
            after: { dimensions: { clientHeight: a.clientHeight, scrollHeight: a.scrollHeight,
              offsetHeight: a.offsetHeight, rectHeight: a.rect.height,
              clientWidth: a.clientWidth, scrollWidth: a.scrollWidth, offsetWidth: a.offsetWidth },
              overflow: a.computed, scrollbars: a.scrollbars, rangeBounds: a.rangeBounds,
              containsFullRangeBoundsExactly: a.containsFullRangeBoundsExactly } };
        });
        record(`${name}:all-descendant-range-bounds-fully-contained`,
          after.containers.every(x => x.containsFullRangeBoundsExactly),
          { checked: after.containers.length, initiallyAffected: affectedIndices.length,
            unresolved: after.containers.filter(x => !x.containsFullRangeBoundsExactly)
              .map(x => ({ index: x.index, className: x.className, rangeBounds: x.rangeBounds })) });
        record(`${name}:vertical-scrollbars-disabled`,
          after.containers.every(x => x.computed.overflowY === 'hidden'
            && x.scrollbars.verticalGutterPx === 0 && !x.scrollbars.verticalScrollbarEligible),
          { checked: after.containers.length,
            unresolved: after.containers.filter(x => x.computed.overflowY !== 'hidden'
              || x.scrollbars.verticalGutterPx > 0 || x.scrollbars.verticalScrollbarEligible).map(x => x.index) });
        record(`${name}:horizontal-scroll-preserved-endpoints`,
          beforeEndpoints.every(x => x.passed) && afterEndpoints.every(x => x.passed)
            && after.containers.every(x => ['auto', 'scroll'].includes(x.computed.overflowX)),
          { before: beforeEndpoints, after: afterEndpoints });
        record(`${name}:document-width-no-overflow`,
          after.document.scrollWidth === after.document.clientWidth
            && after.document.bodyScrollWidth === after.document.clientWidth,
          { before: before.document, after: after.document });
        const view = { name, viewport, selector, temporaryCss: css, fonts,
          affectedIndices, before, after, beforeEndpoints, afterEndpoints, pairs };
        report.views.push(view);
        console.log(JSON.stringify({ diagnosed: name, eligible: before.containers.length,
          initiallyAffected: affectedIndices.length,
          beforeRangeProtrusions: before.containers.filter(x => !x.containsFullRangeBoundsExactly).length,
          afterRangeProtrusions: after.containers.filter(x => !x.containsFullRangeBoundsExactly).length,
          beforeVerticalScrollbarEligible: before.containers.filter(x => x.scrollbars.verticalScrollbarEligible).length,
          afterVerticalScrollbarEligible: after.containers.filter(x => x.scrollbars.verticalScrollbarEligible).length,
          localHorizontalScrollersBefore: beforeEndpoints.length, localHorizontalScrollersAfter: afterEndpoints.length,
          beforeDocument: before.document, afterDocument: after.document }));
      }
    } finally {
      await context.close();
      report.cleanup.contextsClosed.push(viewport.id);
    }
  }
} catch (error) {
  report.errors.push({ type: 'technical', message: error.message, stack: error.stack });
  record('technical-diagnosis-completed', false, { message: error.message });
  console.error(error.stack);
} finally {
  if (browser) {
    await browser.close();
    report.cleanup.browserClosed = !browser.isConnected();
  }
  report.custody.after = custody();
  report.custody.originalByteIdentical = JSON.stringify(report.custody.before) === JSON.stringify(report.custody.after);
  record('original-frozen-package-byte-and-mode-identical', report.custody.originalByteIdentical,
    { files: report.custody.after.files.length, directories: report.custody.after.directories.length });
  for (const name of ['text.html', 'choices.html']) {
    const file = path.join(PREVIEW, name);
    const bytes = read(file, 'Post-transaction unchanged affected preview binding');
    const expected = first.bindings.find(x => x.path === rel(file));
    record(`affected-preview-unchanged:${name}`, expected?.sha256 === sha(bytes), { sha256: sha(bytes) });
  }
  record('only-affected-offline-documents-requested',
    report.requests.every(x => x.allowed && !/^https?:/.test(x.url)),
    { requests: report.requests });
  report.ended = new Date().toISOString();
  report.unresolvedTechnicalFailures = report.technicalAssertions.filter(x => !x.passed);
  report.hypothesisVerdict = report.views.length === 4 && !report.unresolvedTechnicalFailures.length
    && report.cleanup.browserClosed ? 'SUPPORTED_BY_EXACT_DOM_METRICS' : 'NOT_FULLY_SUPPORTED';
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ hypothesisVerdict: report.hypothesisVerdict,
    visualVerdict: report.visualVerdict, originalByteIdentical: report.custody.originalByteIdentical,
    browserClosed: report.cleanup.browserClosed, screenshots: 0, imageViews: 0, reserve2: 'LOCKED',
    unresolved: report.unresolvedTechnicalFailures.map(x => x.id) }));
  process.exitCode = report.hypothesisVerdict === 'SUPPORTED_BY_EXACT_DOM_METRICS' ? 0 : 1;
}
