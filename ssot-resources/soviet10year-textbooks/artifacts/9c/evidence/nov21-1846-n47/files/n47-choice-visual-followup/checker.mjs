import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { chromium } from '../../../app/node_modules/playwright/index.mjs';

const ROOT = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), ROOT);
delete process.env.PWDEBUG;
const OUT = path.join(ROOT, '.tmp/stemrobin-184-six/n47-choice-visual-followup');
const INPUT = path.join(ROOT, '.tmp/stemrobin-184-six/n47-preview-repaired/choices.html');
const MANIFEST = path.join(ROOT, '.tmp/stemrobin-184-six/n47-preview-repaired/manifest.json');
const EVIDENCE = path.join(OUT, 'evidence.json');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const rel = file => path.relative(ROOT, file);
assert(!fs.existsSync(EVIDENCE), 'This unique acquisition cannot be replayed.');
assert(!fs.existsSync(path.join(OUT, 'captures')), 'Capture directory must be new.');
fs.mkdirSync(path.join(OUT, 'captures'));

const evidence = {
  schema: 'stemrobin1846/n47-independent-choice-visual-followup@1',
  stage: 'n47-independent-choice-capture-followup-first',
  started: new Date().toISOString(), cwd: ROOT,
  scope: 'Repaired standalone choices acquisition/layout only. No source, math, answer, key, text, inherited DOM or native-click gate replay.',
  launchOptions: { headless: true, timeout: 30000 },
  inherited: {
    nativeClicks: 64, DOMAssertions: 111, textVisual: 'PASS affected text only',
    provenance: 'Human-supplied inheritance only; no historical evidence files read.',
  },
  accounting: {
    browserLaunches: 0, screenshotCreations: 0, actualImageToolViews: 0,
    historicalSartreImageViews: 8, totalKnownN47ImageViews: 8,
    parentImagesOrDecodes: 0, hiddenBrowserImageInternals: 'UNKNOWN',
    newNativeClicks: 0, inheritedNativeClicks: 64, inheritedDOMAssertions: 111,
    inheritedTextVisual: 'PASS affected text only',
    imageViewLimit: 2, screenshotLimit: 2, networkRequests: 0,
  },
  inputs: [], assertions: [], requests: [], views: [], screenshots: [],
  errors: [], cleanup: { contexts: [], browserClosed: false },
  assertionVerdict: 'PENDING', visualVerdict: 'PENDING_TWO_ACTUAL_IMAGE_TOOL_OBSERVATIONS',
};

function readBound(file, expected, purpose) {
  const bytes = fs.readFileSync(file);
  const binding = { path: rel(file), bytes: bytes.length, sha256: sha(bytes), purpose };
  evidence.inputs.push(binding);
  assert.equal(binding.sha256, expected, `Input hash changed: ${file}`);
  return bytes;
}

function check(id, passed, actual) {
  const item = { id, passed: Boolean(passed), actual };
  evidence.assertions.push(item);
  if (!passed) {
    console.error(JSON.stringify({ failure: item }));
    throw new Error(`Affected acquisition gate failed: ${id}`);
  }
}

async function boundedReady(page) {
  await page.waitForLoadState('load', { timeout: 10000 });
  let timer;
  try {
    return await Promise.race([
      page.evaluate(async () => {
        await document.fonts.ready;
        const used = new Map();
        for (const el of document.querySelectorAll('.katex-html span,.prose-math')) {
          const style = getComputedStyle(el);
          const family = style.fontFamily.split(',')[0].trim().replaceAll('"', '');
          if (family.startsWith('KaTeX_') && el.textContent.trim()) {
            const spec = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} "${family}"`;
            used.set(spec, { spec, family, text: el.textContent });
          }
        }
        const usedLoads = await Promise.all([...used.values()].map(async item => {
          const faces = await document.fonts.load(item.spec, item.text);
          return { spec: item.spec, family: item.family, matchedFaces: faces.length,
            loaded: faces.length > 0 && faces.every(face => face.status === 'loaded'),
            check: document.fonts.check(item.spec, item.text) };
        }));
        await document.fonts.ready;
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        return { readyState: document.readyState, fontStatus: document.fonts.status, usedLoads,
          loadedFaces: [...document.fonts].filter(face => face.status === 'loaded')
            .map(face => ({ family: face.family, style: face.style, weight: face.weight })),
          nonloadedFaces: [...document.fonts].filter(face => face.status !== 'loaded')
            .map(face => ({ family: face.family, style: face.style, weight: face.weight, status: face.status })) };
      }),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('Page/font readiness exceeded 10 seconds')), 10000);
        timer.unref();
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

async function resetScrollers(page) {
  return page.evaluate(async () => {
    for (const el of document.querySelectorAll('*')) {
      if (el.scrollLeft || el.scrollTop) {
        el.scrollLeft = 0;
        el.scrollTop = 0;
      }
    }
    window.scrollTo(0, 0);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return { x: scrollX, y: scrollY,
      nonzero: [...document.querySelectorAll('*')].filter(el => el.scrollLeft || el.scrollTop)
        .map(el => ({ tag: el.tagName, className: el.className, x: el.scrollLeft, y: el.scrollTop })) };
  });
}

async function measure(page) {
  return page.evaluate(() => {
    const rect = el => {
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom,
        width: r.width, height: r.height };
    };
    const visible = el => {
      for (let node = el; node; node = node.parentElement) {
        const s = getComputedStyle(node);
        if (s.display === 'none' || s.visibility !== 'visible' || Number(s.opacity) === 0) return false;
      }
      const r = rect(el);
      return r.width > 0 && r.height > 0;
    };
    const intersects = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > .5
      && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > .5;
    const inside = (a, b) => a.left >= b.left - 1 && a.right <= b.right + 1
      && a.top >= b.top - 1 && a.bottom <= b.bottom + 1;
    const container = el => {
      const r = rect(el), s = getComputedStyle(el);
      const n = key => parseFloat(s[key]) || 0;
      const verticalGutter = Math.max(0, el.offsetWidth - el.clientWidth
        - n('borderLeftWidth') - n('borderRightWidth'));
      const horizontalGutter = Math.max(0, el.offsetHeight - el.clientHeight
        - n('borderTopWidth') - n('borderBottomWidth'));
      const clip = { left: r.left + n('borderLeftWidth'), right: r.right - n('borderRightWidth') - verticalGutter,
        top: r.top + n('borderTopWidth'), bottom: r.bottom - n('borderBottomWidth') - horizontalGutter };
      const ranges = [];
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (!node.textContent.trim() || node.parentElement.closest('.katex-mathml,script,style,annotation')
          || !visible(node.parentElement)) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const box of range.getClientRects()) {
          if (box.width > 0 && box.height > 0) ranges.push({
            text: node.textContent, left: box.left, right: box.right, top: box.top,
            bottom: box.bottom, width: box.width, height: box.height,
          });
        }
      }
      return { className: el.className, rect: r, clip, paintedTextRanges: ranges,
        visible: visible(el), clientWidth: el.clientWidth, scrollWidth: el.scrollWidth,
        clientHeight: el.clientHeight, scrollHeight: el.scrollHeight,
        overflowX: s.overflowX, overflowY: s.overflowY, maskImage: s.maskImage, clipPath: s.clipPath,
        verticalGutter, horizontalGutter,
        verticalScrollbarEligible: ['auto', 'scroll'].includes(s.overflowY) && el.scrollHeight > el.clientHeight,
        maxVerticalTextExcess: Math.max(0, ...ranges.flatMap(box => [clip.top - box.top, box.bottom - clip.bottom])),
        maxHorizontalTextExcess: Math.max(0, ...ranges.flatMap(box => [clip.left - box.left, box.right - clip.right])) };
    };
    const questions = [...document.querySelectorAll('.preview-question')].map(section => {
      const questionId = section.dataset.questionId;
      const heading = section.querySelector('h2');
      const options = [...section.querySelectorAll('.preview-option')].map(label => {
        const text = label.querySelector('.option-text'), controls = [...label.querySelectorAll('input')];
        const labelRect = rect(label), textRect = text ? rect(text) : null;
        return { questionId, optionId: label.dataset.optionId, labelRect, visible: visible(label),
          optionText: text?.innerText.trim() ?? '', text: text ? container(text) : null,
          controls: controls.map(input => ({ type: input.type, name: input.name, ariaLabel: input.getAttribute('aria-label'),
            checked: input.checked, disabled: input.disabled, visible: visible(input), rect: rect(input),
            insideLabel: inside(rect(input), labelRect),
            overlapsText: textRect ? intersects(rect(input), textRect) : true,
            horizontalGap: textRect ? textRect.left - rect(input).right : null })),
          textInsideLabel: textRect ? inside(textRect, labelRect) : false };
      });
      return { questionId, rect: rect(section), visible: visible(section), headingNonempty: Boolean(heading?.innerText.trim()),
        headingRect: heading ? rect(heading) : null, options,
        stemContainers: [...section.querySelectorAll('h2 .sr-nb')].map(container) };
    });
    const collisions = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (i && intersects(questions[i - 1].rect, q.rect)) collisions.push({ type: 'sections', index: i });
      if (q.options[0] && q.headingRect && intersects(q.headingRect, q.options[0].labelRect)) {
        collisions.push({ type: 'stem-options', questionId: q.questionId });
      }
      for (let j = 1; j < q.options.length; j++) {
        if (intersects(q.options[j - 1].labelRect, q.options[j].labelRect)) {
          collisions.push({ type: 'options', questionId: q.questionId, index: j });
        }
      }
    }
    const last = questions.at(-1)?.options.at(-1);
    const contentBottom = Math.max(0, ...[...document.body.children]
      .filter(el => !['SCRIPT', 'STYLE'].includes(el.tagName)).map(el => rect(el).bottom));
    const fullWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, innerWidth);
    const fullHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, innerHeight);
    return {
      topLevel: window.top === window, url: location.href, iframeCount: document.querySelectorAll('iframe').length,
      viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
      fullContent: { width: fullWidth, height: fullHeight, contentBottom,
        documentScrollWidth: document.documentElement.scrollWidth,
        documentScrollHeight: document.documentElement.scrollHeight,
        bodyScrollWidth: document.body.scrollWidth, bodyScrollHeight: document.body.scrollHeight },
      bodyNonempty: Boolean(document.body.innerText.trim()),
      visibleErrorCount: [...document.querySelectorAll('.err,.katex-error,[role="alert"]')].filter(visible).length,
      imageElements: document.querySelectorAll('img').length,
      questions, collisions, lastOption: last ? { questionId: last.questionId, optionId: last.optionId,
        rect: last.labelRect, textRect: last.text?.rect, optionText: last.optionText } : null,
    };
  });
}

let browser;
const contexts = [];
try {
  const bytes = readBound(INPUT, '21cd70805a4601cbbbd9fbd2822da4047fcdc674bc68ba037e543f9324ef59be',
    'Only repaired standalone choices input; no semantic or answer review.');
  const manifestBytes = readBound(MANIFEST, '96f02fd7ce8caf794923526056741d09b712e27b9807366a27115c8030f0f60c',
    'Only actual repaired choices output binding selected; other paths not read.');
  const binding = JSON.parse(manifestBytes.toString('utf8')).outputs.find(item => item.path === rel(INPUT));
  check('actual-repaired-manifest-binding', binding?.sha256 === sha(bytes) && binding.bytes === bytes.length, binding);
  evidence.actualManifestBinding = binding;
  browser = await chromium.launch({ headless: true, timeout: 30000 });
  evidence.accounting.browserLaunches++;
  evidence.browserVersion = browser.version();
  for (const viewport of [
    { id: 'desktop', width: 1440, height: 960, mobile: false },
    { id: 'mobile', width: 390, height: 844, mobile: true },
  ]) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      screen: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1,
      isMobile: viewport.mobile, hasTouch: viewport.mobile, offline: true, serviceWorkers: 'block',
    });
    contexts.push({ id: viewport.id, context });
    await context.route('**/*', async route => {
      const url = route.request().url();
      const allowed = url === pathToFileURL(INPUT).href || url.startsWith('data:');
      evidence.requests.push({ viewport: viewport.id, url: url.startsWith('data:') ? 'data:[embedded]' : url, allowed });
      if (/^https?:/.test(url)) evidence.accounting.networkRequests++;
      if (allowed) await route.continue(); else await route.abort('blockedbyclient');
    });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    await page.goto(pathToFileURL(INPUT).href, { waitUntil: 'load', timeout: 15000 });
    const ready = await boundedReady(page);
    check(`${viewport.id}:used-fonts-ready`, ready.readyState === 'complete' && ready.fontStatus === 'loaded'
      && ready.usedLoads.length > 0 && ready.usedLoads.every(item => item.loaded && item.check), ready);
    const reset = await resetScrollers(page);
    const layout = await measure(page);
    const view = { id: viewport.id, requestedViewport: viewport, ready, reset, layout, pageErrors };
    evidence.views.push(view);
    check(`${viewport.id}:direct-top-level-exact-viewport`, layout.topLevel && layout.iframeCount === 0
      && layout.url === pathToFileURL(INPUT).href && layout.viewport.width === viewport.width
      && layout.viewport.height === viewport.height, { url: layout.url, viewport: layout.viewport, iframeCount: layout.iframeCount });
    const options = layout.questions.flatMap(q => q.options);
    check(`${viewport.id}:actual-four-questions-sixteen-painted-options`, layout.bodyNonempty
      && layout.questions.length === 4 && new Set(layout.questions.map(q => q.questionId)).size === 4
      && layout.questions.every(q => q.questionId && q.visible && q.headingNonempty && q.options.length === 4
        && new Set(q.options.map(o => o.optionId)).size === 4)
      && options.length === 16 && options.every(o => o.visible && o.optionText && o.text?.visible
        && o.text.paintedTextRanges.length > 0),
    { questionIds: layout.questions.map(q => q.questionId), optionCount: options.length,
      nonemptyOptionCount: options.filter(o => o.optionText).length });
    check(`${viewport.id}:nonempty-radio-controls-no-clicks`, options.every(o => o.controls.length === 1
      && o.controls[0].type === 'radio' && o.controls[0].visible && !o.controls[0].checked && !o.controls[0].disabled
      && o.controls[0].name === o.questionId && o.controls[0].ariaLabel === o.optionId),
    { count: options.reduce((n, o) => n + o.controls.length, 0), clicks: 0 });
    const containers = layout.questions.flatMap(q => [...q.stemContainers, ...q.options.map(o => o.text)]);
    check(`${viewport.id}:no-local-vertical-scrollbars-or-painted-clipping`, containers.every(c => c
      && !c.verticalScrollbarEligible && c.verticalGutter <= 1 && c.maxVerticalTextExcess <= 1
      && c.maskImage === 'none' && c.clipPath === 'none'),
    containers.map(c => ({ className: c.className, verticalScrollbarEligible: c.verticalScrollbarEligible,
      verticalGutter: c.verticalGutter, maxVerticalTextExcess: c.maxVerticalTextExcess })));
    check(`${viewport.id}:all-option-horizontal-painted-coverage`, options.every(o => o.text.maxHorizontalTextExcess <= 1
      && o.text.rect.left >= -1 && o.text.rect.right <= layout.fullContent.width + 1),
    options.map(o => ({ questionId: o.questionId, optionId: o.optionId, horizontalExcess: o.text.maxHorizontalTextExcess })));
    check(`${viewport.id}:gutters-section-spacing-no-overlap`, layout.collisions.length === 0
      && options.every(o => o.textInsideLabel && o.controls[0].insideLabel
        && !o.controls[0].overlapsText && o.controls[0].horizontalGap >= 0),
    { collisions: layout.collisions, minimumRadioTextGap: Math.min(...options.map(o => o.controls[0].horizontalGap)) });
    const endpoint = await page.evaluate(async () => {
      const last = [...document.querySelectorAll('.preview-option')].at(-1);
      last.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'instant' });
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const r = last.getBoundingClientRect(), text = last.querySelector('.option-text').getBoundingClientRect();
      return { scrollX, scrollY, viewportHeight: innerHeight, top: r.top, bottom: r.bottom,
        textTop: text.top, textBottom: text.bottom,
        questionId: last.closest('.preview-question').dataset.questionId, optionId: last.dataset.optionId,
        reachable: r.top >= -1 && r.bottom <= innerHeight + 1 && text.top >= -1 && text.bottom <= innerHeight + 1 };
    });
    view.finalOptionReachability = endpoint;
    check(`${viewport.id}:actual-final-option-reachable`, endpoint.reachable
      && endpoint.questionId === layout.lastOption.questionId && endpoint.optionId === layout.lastOption.optionId, endpoint);
    view.captureReset = await resetScrollers(page);
    check(`${viewport.id}:capture-full-extents-left-reset-no-error-only-state`,
      view.captureReset.x === 0 && view.captureReset.y === 0 && view.captureReset.nonzero.length === 0
      && layout.fullContent.width === viewport.width && layout.lastOption.rect.bottom <= layout.fullContent.height
      && layout.lastOption.textRect.bottom <= layout.fullContent.height
      && layout.visibleErrorCount === 0 && layout.imageElements === 0 && pageErrors.length === 0,
    { reset: view.captureReset, fullContent: layout.fullContent, lastOption: layout.lastOption, pageErrors });
    assert(evidence.accounting.screenshotCreations < 2, 'Screenshot cap exhausted.');
    const file = path.join(OUT, 'captures', `${viewport.id}-choices-full.png`);
    assert(!fs.existsSync(file));
    const screenshot = await page.screenshot({ path: file, fullPage: true, timeout: 15000 });
    evidence.accounting.screenshotCreations++;
    evidence.screenshots.push({ path: rel(file), bytes: screenshot.length, sha256: sha(screenshot),
      viewport: { width: viewport.width, height: viewport.height }, fullContent: layout.fullContent,
      fullPage: true, imageObservation: 'PENDING', screenshotDecodeByChecker: false });
    console.log(JSON.stringify({ viewport: viewport.id, questionIds: layout.questions.map(q => q.questionId),
      options: options.length, fullContent: layout.fullContent, screenshot: evidence.screenshots.at(-1) }));
  }
} catch (error) {
  evidence.errors.push({ message: error.message, stack: error.stack });
  console.error(error.stack);
  process.exitCode = 1;
} finally {
  for (const item of contexts) {
    try {
      await item.context.close();
      evidence.cleanup.contexts.push({ id: item.id, closed: true });
    } catch (error) {
      evidence.cleanup.contexts.push({ id: item.id, closed: false, error: error.message });
      evidence.errors.push({ message: `Context cleanup: ${error.message}` });
      process.exitCode = 1;
    }
  }
  if (browser) {
    try {
      await browser.close();
      evidence.cleanup.browserClosed = !browser.isConnected();
    } catch (error) {
      evidence.errors.push({ message: `Browser cleanup: ${error.message}` });
      process.exitCode = 1;
    }
  }
  for (const binding of evidence.inputs) {
    const bytes = fs.readFileSync(path.join(ROOT, binding.path));
    if (sha(bytes) !== binding.sha256 || bytes.length !== binding.bytes) {
      evidence.errors.push({ message: `Input changed during capture: ${binding.path}` });
      process.exitCode = 1;
    }
  }
  evidence.ended = new Date().toISOString();
  evidence.unresolvedFailures = [
    ...evidence.assertions.filter(item => !item.passed), ...evidence.errors,
  ];
  const passed = evidence.views.length === 2 && evidence.screenshots.length === 2
    && evidence.unresolvedFailures.length === 0 && evidence.cleanup.browserClosed
    && evidence.cleanup.contexts.length === 2 && evidence.cleanup.contexts.every(item => item.closed);
  evidence.assertionVerdict = passed ? 'PASS' : 'FAIL';
  if (!passed) process.exitCode = 1;
  fs.writeFileSync(EVIDENCE, JSON.stringify(evidence, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ assertionVerdict: evidence.assertionVerdict,
    visualVerdict: evidence.visualVerdict, screenshots: evidence.accounting.screenshotCreations,
    unresolvedFailures: evidence.unresolvedFailures.length, cleanup: evidence.cleanup }));
}
