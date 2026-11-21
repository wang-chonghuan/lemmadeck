import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { chromium } from '../../../app/node_modules/playwright/index.mjs';

const ROOT = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), ROOT);
const OUT = path.join(ROOT, '.tmp/stemrobin-184-six/n47-offline-recovery');
const REPAIRED = path.join(ROOT, '.tmp/stemrobin-184-six/n47-preview-repaired');
const FIRST = path.join(ROOT, '.tmp/stemrobin-184-six/n47-offline/browser-evidence-first.json');
const EVIDENCE = path.join(OUT, 'browser-evidence.json');
assert(!fs.existsSync(EVIDENCE), 'Unique recovery must not be replayed.');
fs.mkdirSync(path.join(OUT, 'captures'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const rel = file => path.relative(ROOT, file);
const evidence = {
  schema: 'stemrobin1846/n47-affected-visual-recovery-browser@1',
  started: new Date().toISOString(), cwd: ROOT,
  scope: 'Affected repaired text/choices only; harness is test framing, not product UI. No written, semantic/source/content gate replay, native click replay, keyboard, DB, server, publisher or strict-source approval.',
  accounting: {
    browserTransactions: 0, screenshotCreations: 0, actualImageToolViews: 0,
    firstImageToolViews: 6, cumulativeImageToolViews: 6,
    releasedReserveViews: 2, maximumCumulativeViews: 8,
    parentImagesOrDecodes: 0, manualPNGOrPillowDecodesOrOpens: 0,
    hiddenBrowserImageInternals: 'UNKNOWN', actualNewNativeClicks: 0,
    inheritedNativeClicks: 64, nativeClicksInheritedNotReplayed: true,
    networkDocs: 0, installs: 0, paidCalls: 0,
  },
  reads: [], bindings: [], assertions: [], requests: [], views: [], screenshots: [],
  errors: [], cleanup: { browserClosed: false, contextsClosed: [] },
  assertionVerdict: 'PENDING', visualVerdict: 'PENDING_TWO_ACTUAL_OBSERVATIONS',
};
function read(file, purpose) {
  const bytes = fs.readFileSync(file);
  const binding = { path: rel(file), bytes: bytes.length, sha256: sha(bytes) };
  evidence.reads.push({ ...binding, purpose });
  evidence.bindings.push(binding);
  return bytes;
}
function check(id, passed, actual) {
  const item = { id, passed: Boolean(passed), actual };
  evidence.assertions.push(item);
  if (!item.passed) console.error(JSON.stringify({ recoveryFailure: item }));
  return item.passed;
}
const firstBytes = read(FIRST, 'Own first evidence for inherited passed gates and original preview binding; no images');
check('first-evidence-sha-unchanged',
  sha(firstBytes) === '3c9f4a27b937636a7eb93cf480fc70286209d72c470a7c4a4d6f795adc041c99',
  { sha256: sha(firstBytes) });
const first = JSON.parse(firstBytes.toString('utf8'));
evidence.inherited = {
  firstEvidence: evidence.bindings.at(-1), firstAssertionVerdict: first.assertionVerdict,
  firstFailRemainsFail: first.assertionVerdict === 'FAIL',
  nativeClicks: first.nativeClickCount,
  passedNativeBehaviorAssertionIds: first.assertions.filter(x => x.passed
    && /actual-exclusive-isolated/.test(x.id)).map(x => x.id),
  passedContentAndPayloadAssertionIds: first.assertions.filter(x => x.passed
    && /all-derived-prose|all-derived-written|all-derived-display|381-conditional|view-id-only|no-raw-math-errors/.test(x.id))
    .map(x => x.id),
  note: 'Original 64 trusted clicks and content assertions are inherited, not newly executed. Written is not loaded in recovery.',
};
check('inherited-native-click-evidence-actual64',
  first.nativeClickCount === 64 && first.nativeClicks.length === 64
    && evidence.inherited.passedNativeBehaviorAssertionIds.length === 64,
  { clicks: first.nativeClicks.length, passedBehaviorAssertions: evidence.inherited.passedNativeBehaviorAssertionIds.length });
const manifestFile = path.join(REPAIRED, 'manifest.json');
const manifestBytes = read(manifestFile, 'Current repair manifest; read actual field names');
check('repair-manifest-sha', sha(manifestBytes) === '96f02fd7ce8caf794923526056741d09b712e27b9807366a27115c8030f0f60c',
  { sha256: sha(manifestBytes) });
const manifest = JSON.parse(manifestBytes.toString('utf8'));
const rendererFile = path.join(ROOT, manifest.renderer.path);
const rendererBytes = read(rendererFile, 'Current renderer SHA binding only; not executed');
check('renderer-sha', sha(rendererBytes) === '65f50ebd93f6386219b36a9fefe9f7935632ebe014a61ec627d1f551604c3305'
  && rendererBytes.length === manifest.renderer.bytes, { sha256: sha(rendererBytes), manifest: manifest.renderer });
const documents = {};
for (const kind of ['text', 'choices']) {
  const repairedFile = path.join(REPAIRED, `${kind}.html`);
  const outputBinding = manifest.outputs.find(x => x.path === rel(repairedFile));
  const originalBinding = manifest.originals.find(x => path.basename(x.path) === `${kind}.html`);
  const originalFile = path.join(ROOT, originalBinding.path);
  const previousBinding = first.bindings.find(x => x.path === originalBinding.path);
  const originalBytes = read(originalFile, 'Original allowed preview bytes for CSS-stripped DOM custody binding only; not navigated');
  const repairedBytes = read(repairedFile, 'Repaired affected actual file input');
  check(`${kind}:original-bound-to-first-evidence`,
    previousBinding?.sha256 === originalBinding.sha256 && sha(originalBytes) === previousBinding.sha256,
  { previousBinding, originalBinding, actualSha256: sha(originalBytes) });
  check(`${kind}:repaired-output-sha`,
    outputBinding?.sha256 === sha(repairedBytes) && outputBinding.bytes === repairedBytes.length,
  { outputBinding, actualSha256: sha(repairedBytes), actualBytes: repairedBytes.length });
  documents[kind] = { originalHtml: originalBytes.toString('utf8'),
    repairedHtml: repairedBytes.toString('utf8'), repairedFile,
    originalBinding: previousBinding, repairedBinding: outputBinding };
}
for (const viewport of ['desktop', 'mobile']) read(path.join(OUT, `${viewport}-harness.html`),
  'Owned two-iframe test framing only');

async function ready(surface) {
  await surface.waitForLoadState('load');
  return surface.evaluate(async () => {
    await document.fonts.ready;
    const fonts = new Map();
    for (const el of document.querySelectorAll('.nb .katex-html span,.sr-nb .katex-html span,.prose-math')) {
      const s = getComputedStyle(el), family = s.fontFamily.split(',')[0].replaceAll('"', '');
      if (family.startsWith('KaTeX_')) fonts.set(
        `${s.fontStyle} ${s.fontWeight} ${s.fontSize} "${family}"`, el.textContent || '()x0');
    }
    for (const [spec, text] of fonts) await document.fonts.load(spec, text);
    await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return { readyState: document.readyState, fontsStatus: document.fonts.status,
      loadedFaces: [...document.fonts].filter(x => x.status === 'loaded')
        .map(x => ({ family: x.family, style: x.style, weight: x.weight })) };
  });
}

async function measure(surface, kind) {
  const result = await surface.evaluate(kind => {
    const selector = kind === 'text' ? 'p.para .nb' : '.preview-question .sr-nb,.preview-option .option-text';
    const number = value => parseFloat(value) || 0;
    const rect = el => {
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height };
    };
    const containers = [...document.querySelectorAll(selector)].map((el, index) => {
      el.scrollLeft = 0; el.scrollTop = 0;
      const s = getComputedStyle(el), r = rect(el);
      const horizontalGutter = Math.max(0, el.offsetHeight - el.clientHeight
        - number(s.borderTopWidth) - number(s.borderBottomWidth));
      const verticalGutter = Math.max(0, el.offsetWidth - el.clientWidth
        - number(s.borderLeftWidth) - number(s.borderRightWidth));
      const viewportTop = r.top + number(s.borderTopWidth);
      const viewportBottom = r.bottom - number(s.borderBottomWidth) - horizontalGutter;
      const ranges = [];
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        if (!n.textContent.trim() || n.parentElement.closest('.katex-mathml')) continue;
        const range = document.createRange(); range.selectNodeContents(n);
        for (const box of range.getClientRects()) if (box.width > 0 && box.height > 0) {
          ranges.push({ text: n.textContent, top: box.top, bottom: box.bottom,
            left: box.left, right: box.right, width: box.width, height: box.height,
            topExcess: Math.max(0, viewportTop - box.top),
            bottomExcess: Math.max(0, box.bottom - viewportBottom) });
        }
      }
      return { index, className: el.className, questionId: el.closest('[data-question-id]')?.dataset.questionId ?? null,
        optionId: el.closest('[data-option-id]')?.dataset.optionId ?? null,
        rect: r, clientHeight: el.clientHeight, scrollHeight: el.scrollHeight, offsetHeight: el.offsetHeight,
        clientWidth: el.clientWidth, scrollWidth: el.scrollWidth, offsetWidth: el.offsetWidth,
        computed: { overflowX: s.overflowX, overflowY: s.overflowY,
          paddingTop: s.paddingTop, paddingBottom: s.paddingBottom,
          fontSize: s.fontSize, lineHeight: s.lineHeight, maskImage: s.maskImage, clipPath: s.clipPath },
        scrollbars: { horizontalGutterPx: horizontalGutter, verticalGutterPx: verticalGutter,
          verticalScrollbarEligible: ['auto', 'scroll'].includes(s.overflowY) && el.scrollHeight > el.clientHeight },
        viewportTop, viewportBottom, ranges,
        maxTopExcess: Math.max(0, ...ranges.map(x => x.topExcess)),
        maxBottomExcess: Math.max(0, ...ranges.map(x => x.bottomExcess)) };
    });
    const overlap = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > .5
      && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > .5;
    const collisions = [];
    for (const selector of ['p.para', '.preview-question', '.preview-option']) {
      const elements = [...document.querySelectorAll(selector)];
      for (let i = 1; i < elements.length; i++) if (overlap(rect(elements[i - 1]), rect(elements[i]))) {
        collisions.push({ selector, previous: i - 1, next: i, a: rect(elements[i - 1]), b: rect(elements[i]) });
      }
    }
    const controls = [...document.querySelectorAll('.preview-option')].map(el => {
      const input = el.querySelector('input'), text = el.querySelector('.option-text');
      const inputRect = rect(input), textRect = rect(text), labelRect = rect(el);
      return { questionId: el.closest('[data-question-id]').dataset.questionId, optionId: el.dataset.optionId,
        input: inputRect, text: textRect, label: labelRect,
        horizontalGap: textRect.left - inputRect.right,
        centerVerticalDelta: (inputRect.top + inputRect.bottom - textRect.top - textRect.bottom) / 2,
        controlInsideLabel: inputRect.top >= labelRect.top && inputRect.bottom <= labelRect.bottom
          && inputRect.left >= labelRect.left && inputRect.right <= labelRect.right,
        textInsideLabel: textRect.top >= labelRect.top && textRect.bottom <= labelRect.bottom
          && textRect.left >= labelRect.left && textRect.right <= labelRect.right,
        overlap: overlap(inputRect, textRect) };
    });
    for (const q of document.querySelectorAll('.preview-question')) {
      const h2 = q.querySelector('h2'), next = h2.nextElementSibling;
      if (next && overlap(rect(h2), rect(next))) collisions.push({ type: 'stem-options', id: q.dataset.questionId });
    }
    const flow = [...document.querySelectorAll('.sheet,h1,p.para,.preview-question,h2,.preview-option,input,.option-text')]
      .map((el, index) => ({ index, tag: el.tagName, className: el.className, rect: rect(el),
        fontSize: getComputedStyle(el).fontSize, lineHeight: getComputedStyle(el).lineHeight,
        textIndent: getComputedStyle(el).textIndent }));
    const clone = document.body.cloneNode(true);
    for (const style of clone.querySelectorAll('style')) style.remove();
    const last = kind === 'text' ? document.querySelector('a.jump')
      : [...document.querySelectorAll('.preview-option')].at(-1);
    const contentBottom = Math.max(...[...document.body.children]
      .filter(el => el.tagName !== 'STYLE').map(el => rect(el).bottom));
    return { selector, containers, collisions, controls, flow, lastContent: rect(last),
      document: { innerWidth, innerHeight, clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth, bodyScrollWidth: document.body.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight, bodyScrollHeight: document.body.scrollHeight,
        contentBottom },
      serializedBodyWithoutCss: clone.innerHTML };
  }, kind);
  result.bodySha256 = sha(result.serializedBodyWithoutCss);
  delete result.serializedBodyWithoutCss;
  result.renderSignatureSha256 = sha(JSON.stringify({
    documentWidth: result.document.clientWidth,
    flow: result.flow, containers: result.containers, controls: result.controls,
  }));
  return result;
}

async function endpointChecks(surface, selector) {
  return surface.evaluate(async selector => {
    const results = [];
    const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
    for (const [index, el] of [...document.querySelectorAll(selector)].entries()) {
      if (el.scrollWidth <= el.clientWidth || !['auto', 'scroll'].includes(getComputedStyle(el).overflowX)) continue;
      el.scrollIntoView({ block: 'center', inline: 'nearest' });
      const endpoint = side => {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), ranges = [];
        let n;
        while ((n = walker.nextNode())) {
          if (!n.textContent.trim() || n.parentElement.closest('.katex-mathml')) continue;
          const range = document.createRange(); range.selectNodeContents(n);
          for (const r of range.getClientRects()) if (r.width > 0 && r.height > 0) {
            ranges.push({ text: n.textContent, top: r.top, bottom: r.bottom, left: r.left, right: r.right });
          }
        }
        const selected = ranges.reduce((a, b) => !a || (side === 'left' ? b.left < a.left : b.right > a.right) ? b : a, null);
        const box = el.getBoundingClientRect();
        if (!selected) return { reachable: false };
        const x = side === 'left' ? Math.max(box.left + 2, selected.left + 1)
          : Math.min(box.left + el.clientWidth - 2, selected.right - 1);
        const y = Math.max(2, Math.min(innerHeight - 2, (selected.top + selected.bottom) / 2));
        const top = document.elementFromPoint(x, y), maskChain = [];
        for (let p = el; p; p = p.parentElement) {
          const s = getComputedStyle(p);
          if ((s.maskImage && s.maskImage !== 'none') || (s.clipPath && s.clipPath !== 'none')) maskChain.push(p.className);
        }
        return { range: selected, box: { left: box.left, right: box.left + el.clientWidth },
          reachable: side === 'left' ? selected.left >= box.left - 1
            : selected.right <= box.left + el.clientWidth + 1,
          roundingTolerancePx: 1, unmaskedHit: top === el || el.contains(top),
          point: { x, y }, hit: top?.tagName, maskChain };
      };
      el.scrollTop = 0; el.scrollLeft = 0; await frame();
      const left = endpoint('left'), maxScroll = el.scrollWidth - el.clientWidth;
      el.scrollLeft = maxScroll; await frame();
      const right = endpoint('right'), actualRight = el.scrollLeft;
      el.scrollLeft = 0; el.scrollTop = 0; await frame();
      results.push({ index, className: el.className, clientWidth: el.clientWidth, scrollWidth: el.scrollWidth,
        maxScroll, actualRight, left, right, resetLeft: el.scrollLeft,
        passed: left.reachable && right.reachable && left.unmaskedHit && right.unmaskedHit
          && !left.maskChain.length && !right.maskChain.length
          && Math.abs(maxScroll - actualRight) <= 1 && el.scrollLeft === 0 });
    }
    for (const el of document.querySelectorAll(selector)) { el.scrollLeft = 0; el.scrollTop = 0; }
    window.scrollTo(0, 0);
    return results;
  }, selector);
}

function validate(name, measurement, endpoints, exactWidth) {
  check(`${name}:full-range-containment-no-waiver`,
    measurement.containers.every(x => x.maxTopExcess === 0 && x.maxBottomExcess === 0),
    { containers: measurement.containers.length,
      failures: measurement.containers.filter(x => x.maxTopExcess || x.maxBottomExcess)
        .map(x => ({ index: x.index, topExcess: x.maxTopExcess, bottomExcess: x.maxBottomExcess })) });
  check(`${name}:no-local-vertical-scrollbars`,
    measurement.containers.every(x => x.computed.overflowY === 'hidden'
      && x.scrollbars.verticalGutterPx === 0 && !x.scrollbars.verticalScrollbarEligible),
    { failures: measurement.containers.filter(x => x.computed.overflowY !== 'hidden'
      || x.scrollbars.verticalGutterPx || x.scrollbars.verticalScrollbarEligible).map(x => x.index) });
  check(`${name}:no-document-horizontal-overflow`,
    measurement.document.scrollWidth === measurement.document.clientWidth
      && measurement.document.bodyScrollWidth === measurement.document.clientWidth,
    measurement.document);
  if (exactWidth) check(`${name}:exact-full-width`,
    measurement.document.innerWidth === exactWidth && measurement.document.clientWidth === exactWidth,
    { expected: exactWidth, actual: measurement.document });
  check(`${name}:affected-flow-control-spacing`,
    !measurement.collisions.length && measurement.controls.every(x => !x.overlap
      && x.controlInsideLabel && x.textInsideLabel && x.horizontalGap >= 0),
    { collisions: measurement.collisions, controls: measurement.controls });
  check(`${name}:horizontal-endpoints-reachable-unmasked-reset-left`,
    endpoints.every(x => x.passed)
      && measurement.containers.every(x => ['auto', 'scroll'].includes(x.computed.overflowX)),
    endpoints);
}

let browser;
try {
  assert(evidence.assertions.every(x => x.passed), 'Input/inherited evidence binding failed.');
  try {
    browser = await chromium.launch({ headless: false, timeout: 30000 });
    evidence.gui = { mode: 'headed', limitation: null };
  } catch (error) {
    if (!/display|xserver|x server|window server|gui|headed|cannot open/i.test(error.message)) throw error;
    evidence.gui = { mode: 'headless', limitation: error.message };
    browser = await chromium.launch({ headless: true, timeout: 30000 });
  }
  evidence.browserVersion = browser.version();
  evidence.accounting.browserTransactions = 1;
  for (const viewport of [
    { id: 'desktop', width: 1440, height: 960, mobile: false },
    { id: 'mobile', width: 390, height: 844, mobile: true },
  ]) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      screen: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1,
      isMobile: viewport.mobile, hasTouch: viewport.mobile, offline: true, serviceWorkers: 'block',
    });
    const allowedFiles = ['text', 'choices'].map(kind => documents[kind].repairedFile)
      .concat(path.join(OUT, `${viewport.id}-harness.html`));
    await context.route('**/*', route => {
      const url = route.request().url();
      const allowed = url.startsWith('data:') || (url.startsWith('file:') && allowedFiles.includes(fileURLToPath(url)));
      evidence.requests.push({ viewport: viewport.id, url, allowed });
      return allowed ? route.continue() : route.abort('blockedbyclient');
    });
    const standalone = await context.newPage();
    standalone.on('pageerror', e => evidence.errors.push({ type: 'pageerror', message: e.message }));
    const view = { viewport, standalone: [], frames: [] };
    try {
      for (const kind of ['text', 'choices']) {
        await standalone.setViewportSize({ width: viewport.width, height: viewport.height });
        await standalone.goto(pathToFileURL(documents[kind].repairedFile).href);
        const fonts = await ready(standalone);
        const bodyBinding = await standalone.evaluate(({ original, repaired }) => {
          const serialize = html => {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            for (const style of doc.querySelectorAll('style')) style.remove();
            return { document: doc.documentElement.outerHTML, body: doc.body.innerHTML };
          };
          const oldDoc = serialize(original), newDoc = serialize(repaired);
          return { originalBody: oldDoc.body, repairedBody: newDoc.body,
            cssOnlyDocumentIdentical: oldDoc.document === newDoc.document,
            cssOnlyBodyIdentical: oldDoc.body === newDoc.body };
        }, { original: documents[kind].originalHtml, repaired: documents[kind].repairedHtml });
        const bodySha256 = sha(bodyBinding.repairedBody);
        check(`${viewport.id}-${kind}:css-stripped-document-body-bound-to-first`,
          bodyBinding.cssOnlyDocumentIdentical && bodyBinding.cssOnlyBodyIdentical,
          { bodySha256, originalBodySha256: sha(bodyBinding.originalBody),
            cssOnlyDocumentIdentical: bodyBinding.cssOnlyDocumentIdentical });
        const initial = await measure(standalone, kind);
        const initialEndpoints = await endpointChecks(standalone, initial.selector);
        validate(`${viewport.id}-${kind}:standalone-base`, initial, initialEndpoints, null);
        // Full-content height removes the native page scrollbar without changing file CSS.
        const fullHeight = Math.max(viewport.height, initial.document.scrollHeight) + 2;
        await standalone.setViewportSize({ width: viewport.width, height: fullHeight });
        await ready(standalone);
        const full = await measure(standalone, kind);
        const fullEndpoints = await endpointChecks(standalone, full.selector);
        validate(`${viewport.id}-${kind}:standalone-full-height`, full, fullEndpoints, viewport.width);
        check(`${viewport.id}-${kind}:actual-body-matches-css-stripped-binding`,
          initial.bodySha256 === bodySha256 && full.bodySha256 === bodySha256,
          { expected: bodySha256, initial: initial.bodySha256, full: full.bodySha256 });
        check(`${viewport.id}-${kind}:full-height-complete-content`,
          full.document.scrollHeight === full.document.innerHeight
            && full.document.contentBottom <= full.document.innerHeight
            && full.lastContent.bottom <= full.document.innerHeight,
          { fullHeight, document: full.document, lastContent: full.lastContent });
        view.standalone.push({ kind, fonts, cssStrippedBodySha256: bodySha256,
          initial, initialEndpoints, fullHeight, full, fullEndpoints });
      }
      const host = await context.newPage();
      host.on('pageerror', e => evidence.errors.push({ type: 'pageerror', message: e.message }));
      await host.goto(pathToFileURL(path.join(OUT, `${viewport.id}-harness.html`)).href);
      await host.waitForLoadState('load');
      for (const entry of view.standalone) {
        await host.locator(`#${entry.kind}`).evaluate((iframe, height) => {
          iframe.style.height = `${height}px`;
        }, entry.fullHeight);
      }
      const harnessAssertionStart = evidence.assertions.length;
      for (const entry of view.standalone) {
        const frameElement = await host.locator(`#${entry.kind}`).elementHandle();
        const frame = await frameElement.contentFrame();
        assert(frame, 'Actual file frame missing');
        await ready(frame);
        const measurement = await measure(frame, entry.kind);
        const endpoints = await endpointChecks(frame, measurement.selector);
        validate(`${viewport.id}-${entry.kind}:harness-frame`, measurement, endpoints, viewport.width);
        const frameBox = await host.locator(`#${entry.kind}`).evaluate(el => {
          const r = el.getBoundingClientRect();
          return { width: r.width, height: r.height, top: r.top, bottom: r.bottom,
            clientWidth: el.clientWidth, clientHeight: el.clientHeight,
            offsetWidth: el.offsetWidth, offsetHeight: el.offsetHeight,
            src: el.src, border: getComputedStyle(el).borderWidth };
        });
        check(`${viewport.id}-${entry.kind}:iframe-full-width-height-no-clipping-scrollbar`,
          frameBox.width === viewport.width && frameBox.clientWidth === viewport.width
            && frameBox.height === entry.fullHeight && frameBox.clientHeight === entry.fullHeight
            && measurement.document.innerWidth === viewport.width
            && measurement.document.clientWidth === viewport.width
            && measurement.document.scrollHeight === measurement.document.innerHeight
            && measurement.document.contentBottom <= measurement.document.innerHeight
            && frameBox.src === pathToFileURL(documents[entry.kind].repairedFile).href,
          { frameBox, innerDocument: measurement.document });
        check(`${viewport.id}-${entry.kind}:iframe-body-render-identical-to-measured-file`,
          measurement.bodySha256 === entry.full.bodySha256
            && measurement.renderSignatureSha256 === entry.full.renderSignatureSha256,
          { frameBodySha256: measurement.bodySha256, standaloneBodySha256: entry.full.bodySha256,
            frameRenderSha256: measurement.renderSignatureSha256,
            standaloneRenderSha256: entry.full.renderSignatureSha256 });
        view.frames.push({ kind: entry.kind, frameBox, measurement, endpoints });
      }
      const hostMetrics = await host.evaluate(() => {
        window.scrollTo(0, 0);
        const frames = [...document.querySelectorAll('iframe')].map(el => {
          const r = el.getBoundingClientRect();
          return { id: el.id, top: r.top, bottom: r.bottom, left: r.left, right: r.right, height: r.height };
        });
        return { innerWidth, innerHeight, clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          documentHeight: document.documentElement.scrollHeight,
          bodyWidth: document.body.getBoundingClientRect().width, frames };
      });
      check(`${viewport.id}:harness-exact-width-complete-stacking`,
        hostMetrics.innerWidth === viewport.width && hostMetrics.innerHeight === viewport.height
          && hostMetrics.clientWidth === viewport.width && hostMetrics.scrollWidth === viewport.width
          && hostMetrics.bodyWidth === viewport.width && hostMetrics.frames.length === 2
          && hostMetrics.frames[0].top === 0
          && hostMetrics.frames[1].top === hostMetrics.frames[0].bottom
          && hostMetrics.frames[1].bottom <= hostMetrics.documentHeight,
        hostMetrics);
      view.host = hostMetrics;
      const framingPassed = evidence.assertions.slice(harnessAssertionStart).every(x => x.passed);
      if (framingPassed) {
        assert(evidence.accounting.screenshotCreations < 2, 'Screenshot budget exhausted.');
        const file = path.join(OUT, 'captures', `${viewport.id}-affected.png`);
        assert(!fs.existsSync(file));
        await host.screenshot({ path: file, fullPage: true, animations: 'disabled' });
        evidence.accounting.screenshotCreations++;
        const bytes = fs.readFileSync(file);
        view.capture = { path: rel(file), bytes: bytes.length, sha256: sha(bytes),
          viewport, fullPage: true, documentHeight: hostMetrics.documentHeight,
          surfaces: ['repaired text actual file iframe', 'repaired choices actual file iframe'],
          imageToolViewed: false, note: 'Raw PNG hash only; no manual decode/open. Two frames are test framing, not product UI.' };
        evidence.screenshots.push(view.capture);
        console.log(JSON.stringify({ captured: viewport.id, sha256: view.capture.sha256,
          host: hostMetrics, frameWidths: view.frames.map(x => ({
            kind: x.kind, width: x.measurement.document.innerWidth,
            clientWidth: x.measurement.document.clientWidth, fullHeight: x.frameBox.height })) }));
      } else {
        check(`${viewport.id}:capture-withheld-invalid-harness`, false,
          { reason: 'Cannot claim exact-width/full-content framing; no screenshot spent for this viewport.' });
      }
      evidence.views.push(view);
    } finally {
      await context.close();
      evidence.cleanup.contextsClosed.push(viewport.id);
    }
  }
  check('exactly-two-affected-screenshots-created', evidence.screenshots.length === 2,
    evidence.screenshots.map(x => ({ path: x.path, sha256: x.sha256 })));
  check('only-authorized-repaired-files-and-harness-requests',
    evidence.requests.every(x => x.allowed) && !evidence.errors.length,
    { requests: evidence.requests, errors: evidence.errors });
} catch (error) {
  evidence.errors.push({ type: 'technical', message: error.message, stack: error.stack });
  check('technical-recovery-completion', false, { message: error.message, stack: error.stack });
  console.error(error.stack);
} finally {
  if (browser) {
    await browser.close();
    evidence.cleanup.browserClosed = !browser.isConnected();
  }
  for (const binding of [...new Map(evidence.bindings.map(x => [x.path, x])).values()]) {
    const bytes = fs.readFileSync(path.join(ROOT, binding.path));
    check(`unchanged-input:${binding.path}`, sha(bytes) === binding.sha256 && bytes.length === binding.bytes,
      { expected: binding, actualSha256: sha(bytes), actualBytes: bytes.length });
  }
  evidence.ended = new Date().toISOString();
  evidence.unresolvedFailures = evidence.assertions.filter(x => !x.passed);
  evidence.assertionVerdict = evidence.views.length === 2 && evidence.screenshots.length === 2
    && !evidence.unresolvedFailures.length && evidence.cleanup.browserClosed ? 'PASS' : 'FAIL';
  fs.writeFileSync(EVIDENCE, JSON.stringify(evidence, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ assertionVerdict: evidence.assertionVerdict,
    visualVerdict: evidence.visualVerdict, actualScreenshots: evidence.screenshots.length,
    actualNewClicks: 0, inheritedClicks: 64, browserClosed: evidence.cleanup.browserClosed,
    unresolvedFailures: evidence.unresolvedFailures.map(x => x.id) }));
  process.exitCode = evidence.assertionVerdict === 'PASS' ? 0 : 1;
}
