import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const out = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(out, '../../../../..');
const nativePath = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d042-n134-native/result.json');
const expectedSha = '7f4e05b65d4383bac08e2b02601d4cd84eb87c924a1c3b3026ba1471ff052e3f';
const requireApp = createRequire(path.join(repo, 'app/package.json'));
const { chromium, expect } = requireApp('@playwright/test');
const nativeRequire = createRequire(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const { proseFlow, proseOutline, sectionBreakIndices } = nativeRequire('./htmlfrag.js');
const absolute = (p) => path.resolve(repo, p);
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const hash = (p) => sha(fs.readFileSync(p));
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const bind = (p) => ({ path: absolute(p), sha256: hash(absolute(p)) });
const write = (name, value) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
const native = read(nativePath);
const result = {
  schema: 'ld-s10y-lesson/native-full-card-display-check@1',
  ticket: 'STEMROBIN-181',
  card: 'phy9-c2-s7-n134',
  startedAt: new Date().toISOString(),
  status: 'RUNNING',
  nativeResult: { path: nativePath, expectedSha256: expectedSha, sha256: hash(nativePath) },
  execution: {
    command: 'cd app && node ../.intentfold/tickets/STEMROBIN-181/tmp/d042-n134-display/check.mjs',
    script: bind(path.join(out, 'check.mjs')),
    package: bind(requireApp.resolve('@playwright/test/package.json')),
    packageVersion: requireApp('@playwright/test/package.json').version,
    headless: true,
    channel: 'chrome',
    browserLaunches: 0,
    browserPasses: 0,
    isolatedContexts: 0,
    foregroundActions: 0,
    nativeRerenders: 0,
    repairs: 0,
    retries: 0,
    screenshotImageOpensByCommand: 0,
    formalProductAC: false,
    databaseOrAppStarted: false,
    limitation: 'Explicitly requested isolated headless native offline HTML check. Not headed product AC; no DB, live app, app-shell, OS or authenticated workflow coverage.',
  },
  exactNativeInputs: [],
  nativeFlowInputs: [
    bind('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'),
    bind('.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'),
    bind('.claude/skills/ld-s10y-lesson/tools/render_lesson.js'),
  ],
  consumedReviews: [],
  protectedFiles: [],
  surfaces: [],
  screenshots: [],
  failures: [],
  visualReview: 'PENDING-independent-firsthand-opens',
};
let browser;
let context;
let baseline = [];

function check(condition, label, details) {
  if (!condition) result.failures.push({ label, details });
  return condition;
}

function filesUnder(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const p = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(p) : [p];
  });
}

// Decode the browser's screenshot pixels; do not rerender any native media.
function pngPixels(buffer) {
  let width, height, channels;
  const chunks = [];
  for (let offset = 8; offset < buffer.length;) {
    const size = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + size);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      if (data[8] !== 8 || ![2, 6].includes(data[9]) || data[12] !== 0) throw new Error('Unsupported screenshot PNG');
      channels = data[9] === 6 ? 4 : 3;
    }
    if (type === 'IDAT') chunks.push(data);
    offset += size + 12;
  }
  const raw = zlib.inflateSync(Buffer.concat(chunks));
  const stride = width * channels;
  const pixels = Buffer.alloc(height * stride);
  const paeth = (a, b, c) => {
    const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? pixels[y * stride + x - channels] : 0;
      const b = y ? pixels[(y - 1) * stride + x] : 0;
      const c = y && x >= channels ? pixels[(y - 1) * stride + x - channels] : 0;
      const adjustment = [0, a, b, Math.floor((a + b) / 2), paeth(a, b, c)][filter];
      if (adjustment === undefined) throw new Error('Unsupported screenshot PNG filter');
      pixels[y * stride + x] = (raw[y * (stride + 1) + x + 1] + adjustment) & 255;
    }
  }
  return { width, height, channels, pixels };
}

function nonblankMedia(image, rect) {
  const x0 = Math.max(0, Math.ceil(rect.x));
  const y0 = Math.max(0, Math.ceil(rect.y));
  const x1 = Math.min(image.width, Math.floor(rect.x + rect.width));
  const y1 = Math.min(image.height, Math.floor(rect.y + rect.height));
  let ink = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const offset = (y * image.width + x) * image.channels;
      if (Math.min(...image.pixels.subarray(offset, offset + 3)) < 210) ink++;
    }
  }
  return { rectangle: { x0, y0, x1, y1 }, inkPixels: ink, totalPixels: (x1 - x0) * (y1 - y0), nonblank: ink > 100 };
}

async function inspectPage(page) {
  return page.evaluate(() => {
    const rect = (node) => {
      const r = node.getBoundingClientRect();
      return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height };
    };
    const sourceText = (node) => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent;
      if (node.nodeType !== Node.ELEMENT_NODE) return '';
      if (node.matches('.katex')) return `$${node.querySelector('annotation[encoding="application/x-tex"]').textContent}$`;
      if (node.tagName === 'BR') return '\n';
      const children = [...node.childNodes].map(sourceText).join('');
      return node.tagName === 'STRONG' ? `**${children}**` : children;
    };
    const geometry = (node) => {
      const r = rect(node), css = getComputedStyle(node);
      return { ...r, display: css.display, visibility: css.visibility, fontSize: parseFloat(css.fontSize), fontFamily: css.fontFamily, textIndent: css.textIndent };
    };
    const paragraphs = [...document.querySelectorAll('p.para')].map((node, index) => ({
      index, text: sourceText(node), sectionBreak: node.classList.contains('section'),
      borderTop: getComputedStyle(node).borderTopWidth, geometry: geometry(node),
    }));
    const math = [...document.querySelectorAll('p.para .katex')].map((node) => ({
      tex: node.querySelector('annotation[encoding="application/x-tex"]')?.textContent,
      geometry: geometry(node),
      visualGeometry: geometry(node.querySelector('.katex-html')),
      overflow: node.closest('.nb').scrollWidth - node.closest('.nb').clientWidth,
    }));
    const labels = [...document.querySelectorAll('figure svg text[data-label-id]')].map((node) => {
      const matrix = node.getScreenCTM(), box = node.getBBox();
      const scale = Math.hypot(matrix.a, matrix.b);
      const svg = node.ownerSVGElement, svgRect = rect(svg), labelRect = rect(node);
      return {
        id: node.dataset.labelId, text: node.textContent, font: getComputedStyle(node).fontFamily,
        sizePx: parseFloat(getComputedStyle(node).fontSize) * scale,
        geometry: labelRect, bbox: { x: box.x, y: box.y, width: box.width, height: box.height },
        insideMedia: labelRect.x >= svgRect.x - 1 && labelRect.y >= svgRect.y - 1
          && labelRect.x + labelRect.width <= svgRect.x + svgRect.width + 1
          && labelRect.y + labelRect.height <= svgRect.y + svgRect.height + 1,
      };
    });
    const media = [...document.querySelectorAll('figure .figure-media > svg')].map((node) => ({
      id: node.closest('figure').id, geometry: rect(node), viewBox: node.getAttribute('viewBox'),
      preparedFont: node.getAttribute('data-ld-vector-font'),
      nativeStyle: node.querySelector('style')?.textContent,
    }));
    const sheet = document.querySelector('.sheet');
    const blocks = [...sheet.children].map((node) => ({
      tag: node.tagName, className: node.className, id: node.id,
      text: node.matches('p.para,.figcap') ? sourceText(node) : node.matches('h1,.crumb,a') ? node.innerText : '',
      geometry: geometry(node),
    }));
    const collisions = blocks.slice(1).flatMap((block, i) => {
      const prior = blocks[i], overlap = prior.geometry.y + prior.geometry.height - block.geometry.y;
      return overlap > 1 ? [{ prior: i, next: i + 1, overlapPx: overlap }] : [];
    });
    const cutoffs = [];
    for (const node of document.querySelectorAll('p.para,h1,.crumb,.figcap,.jump')) {
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      for (let text = walker.nextNode(); text; text = walker.nextNode()) {
        if (!text.textContent.trim() || text.parentElement.closest('.katex')) continue;
        const range = document.createRange();
        range.selectNodeContents(text);
        for (const r of range.getClientRects()) {
          if (r.left < -1 || r.right > innerWidth + 1) cutoffs.push({ text: text.textContent, left: r.left, right: r.right });
          for (let parent = text.parentElement; parent; parent = parent.parentElement) {
            const css = getComputedStyle(parent), box = parent.getBoundingClientRect();
            if (['hidden', 'clip'].includes(css.overflowY) && (r.top < box.top - 1 || r.bottom > box.bottom + 1)) {
              cutoffs.push({ text: text.textContent, clippingAncestor: parent.className });
            }
          }
        }
      }
    }
    const formulaCutoffs = math.filter((item) =>
      item.overflow > 1 || item.visualGeometry.x < -1
      || item.visualGeometry.x + item.visualGeometry.width > innerWidth + 1
      || item.visualGeometry.width <= 0 || item.visualGeometry.height <= 0);
    return {
      title: document.querySelector('h1').innerText, paragraphs, math, media, labels, blocks,
      collisions, cutoffs, formulaCutoffs,
      exerciseCount: document.querySelectorAll('li.ex').length,
      exerciseLists: document.querySelectorAll('ol.ex').length,
      errors: [...document.querySelectorAll('.err,.sr-tex-err,.katex-error')].map((node) => node.textContent),
      unresolvedMath: paragraphs.filter((p) => /\\(?:frac|vec|Phi|alpha|cos)\b|\$/.test(
        p.text.replace(/\$[^$]*\$/g, ''))),
      scriptCount: document.scripts.length,
      fonts: [...document.fonts].map((font) => ({ family: font.family, style: font.style, weight: font.weight, status: font.status })),
      fontStatus: document.fonts.status,
      proseCharacters: [...document.querySelectorAll('.prose-math')].map((node) => ({
        text: node.textContent, ...geometry(node),
      })),
      scroll: { width: document.scrollingElement.scrollWidth, clientWidth: document.scrollingElement.clientWidth, height: document.scrollingElement.scrollHeight },
      footer: { text: sheet.lastElementChild.innerText, href: sheet.lastElementChild.getAttribute('href'), geometry: rect(sheet.lastElementChild) },
      rawVisibleMathMarkers: /\$|\\(?:vec|Phi|alpha|frac|cos)\b/.test(sheet.innerText),
    };
  });
}

async function platformFonts(page) {
  const session = await context.newCDPSession(page);
  try {
    await session.send('DOM.enable');
    await session.send('CSS.enable');
    const { root } = await session.send('DOM.getDocument');
    const { nodeIds } = await session.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: 'figure text[data-label-id]' });
    const rows = [];
    for (const nodeId of nodeIds) {
      const attributes = (await session.send('DOM.getAttributes', { nodeId })).attributes;
      const id = attributes[attributes.indexOf('data-label-id') + 1];
      const { fonts } = await session.send('CSS.getPlatformFontsForNode', { nodeId });
      rows.push({ id, fonts });
    }
    return rows;
  } finally {
    await session.detach();
  }
}

try {
  if (result.nativeResult.sha256 !== expectedSha) throw new Error('Native result receipt SHA mismatch; no browser launched');
  if (native.card !== result.card || native.languages.length !== 2) throw new Error('Wrong native target');
  baseline = filesUnder(path.dirname(nativePath)).map(bind);
  for (const item of native.inputs) {
    const actual = bind(item.path);
    if (actual.sha256 !== item.sha256) throw new Error(`Native input SHA mismatch: ${item.path}`);
    result.exactNativeInputs.push({ ...actual, expectedSha256: item.sha256, role: 'consumed-native-finalization-input' });
  }
  for (const item of native.protectedFiles) {
    const actual = bind(item.path);
    result.protectedFiles.push({ ...actual, nativeHistoricalSha256: item.sha256, equalsHistorical: item.sha256 === actual.sha256 });
  }
  const original = bind('.intentfold/tickets/STEMROBIN-181/tmp/d041-9p-n134-science-review.json');
  for (const item of [original, bind(native.science.path), bind(native.figure.path)]) {
    const review = read(item.path);
    result.consumedReviews.push({
      ...item, status: review.status, effectiveSCI: review.effectiveSCI, effectiveZHEN: review.effectiveZHEN,
      substantiveReviewRepeated: false, originalOrMediaImageOpens: 0,
    });
  }
  const languages = native.languages.map((entry) => {
    for (const item of [entry.finalize, entry.render, ...entry.outputs, ...entry.html]) {
      const actual = bind(item.path);
      if (actual.sha256 !== item.sha256) throw new Error(`Native output SHA mismatch: ${item.path}`);
      result.exactNativeInputs.push({ ...actual, expectedSha256: item.sha256, role: 'real-finalized-native-output' });
    }
    const lessonPath = entry.outputs.find((item) => path.basename(item.path) === 'lesson.json').path;
    const exercisePath = entry.outputs.find((item) => path.basename(item.path) === 'exercises.json').path;
    const auditPath = entry.outputs.find((item) => path.basename(item.path) === 'adaptation.audit.json').path;
    const lesson = read(absolute(lessonPath)), exercises = read(absolute(exercisePath)), audit = read(absolute(auditPath));
    if (lesson.status !== 'ready' || exercises.status !== 'ready' || audit.status !== 'pass') throw new Error('Native finalization not ready/pass');
    if (exercises.count !== 0 || exercises.exercises.length !== 0 || exercises.source.data.count !== 0) throw new Error('Incorrect native zero-exercise payload');
    const flow = proseFlow(lesson.prose, lesson.section_breaks);
    const outline = proseOutline(lesson.prose);
    const indices = sectionBreakIndices(lesson.prose, lesson.section_breaks);
    const math = flow.filter((item) => item.kind === 'p').flatMap((item) => [...item.text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map((m) => m[1] ?? m[2]));
    if (!math.length) throw new Error(`No derived native math tokens: ${entry.language}`);
    const figureDir = path.join(absolute(entry.root), '9p/editions/modern-us-neutral/figures');
    for (const id of ['fig-301', 'fig-302', 'fig-303']) {
      for (const suffix of ['spec.json', 'svg', 'render.json', 'review.json']) {
        result.exactNativeInputs.push({ ...bind(path.join(figureDir, id + '.' + suffix)), role: 'native-figure-display-input' });
      }
    }
    const spec = read(path.join(figureDir, 'fig-301.spec.json'));
    return {
      entry, lesson, exercises, spec, flow, outline, indices, math,
      boundaries: indices.map((index) => ({ index, before: outline[index - 1].text, after: outline[index].text })),
    };
  });
  delete process.env.PWDEBUG;
  process.env.PLAYWRIGHT_HTML_OPEN = 'never';
  browser = await chromium.launch({ channel: 'chrome', headless: true, downloadsPath: out });
  result.execution.browserLaunches = 1;
  result.execution.browserPasses = 1;
  result.execution.browserVersion = browser.version();
  context = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1, offline: true, serviceWorkers: 'block', acceptDownloads: false });
  result.execution.isolatedContexts = 1;
  const externalRequests = [];
  await context.route(/^https?:/, (route) => {
    externalRequests.push(route.request().url());
    return route.abort('blockedbyclient');
  });
  const page = await context.newPage();
  for (const data of languages) {
    for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
      for (const kind of ['text', 'exercises']) {
        const id = `${data.entry.language}-${kind}-${viewport.width}x${viewport.height}`;
        const surface = { id, language: data.entry.language, kind, viewport, status: 'RUNNING', failures: [], pageErrors: [], consoleErrors: [], requestFailures: [] };
        result.surfaces.push(surface);
        const failStart = result.failures.length;
        const html = data.entry.html.find((item) => path.basename(item.path) === `${kind}.html`);
        surface.nativeHtml = { ...bind(html.path), expectedSha256: html.sha256 };
        const onPageError = (error) => surface.pageErrors.push(String(error));
        const onConsole = (message) => { if (message.type() === 'error') surface.consoleErrors.push(message.text()); };
        const onRequestFailure = (request) => surface.requestFailures.push({ url: request.url(), failure: request.failure() });
        page.on('pageerror', onPageError);
        page.on('console', onConsole);
        page.on('requestfailed', onRequestFailure);
        try {
          await page.setViewportSize(viewport);
          await page.goto(pathToFileURL(absolute(html.path)).href, { waitUntil: 'load' });
          await page.evaluate(async () => { await document.fonts.ready; });
          await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
          const observed = await inspectPage(page);
          surface.observed = observed;
          const prefix = (label) => `${id}: ${label}`;
          check(observed.errors.length === 0 && !observed.rawVisibleMathMarkers && observed.unresolvedMath.length === 0, prefix('no unresolved math/error state'), observed.errors);
          check(observed.scriptCount === 0 && externalRequests.length === 0, prefix('unchanged offline self-contained HTML'), externalRequests);
          check(observed.fontStatus === 'loaded' && !observed.fonts.some((font) => font.status === 'error'), prefix('font readiness'), observed.fonts);
          check(observed.fonts.length === 20, prefix('20 native embedded font faces'), observed.fonts.length);
          check(observed.scroll.width <= observed.scroll.clientWidth + 1, prefix('no whole-page horizontal overflow'), observed.scroll);
          check(observed.cutoffs.length === 0 && observed.formulaCutoffs.length === 0, prefix('no text or formula cutoffs'), { text: observed.cutoffs, math: observed.formulaCutoffs });
          check(observed.collisions.length === 0, prefix('no incoherent block collision'), observed.collisions);
          if (kind === 'text') {
            const paragraphs = data.flow.filter((item) => item.kind === 'p');
            surface.intendedParagraphs = data.outline;
            surface.nativeBoundaries = data.boundaries;
            surface.resolvedBreakIndices = data.indices;
            surface.intendedMathSequence = data.math;
            check(JSON.stringify(observed.paragraphs.map((p) => p.text)) === JSON.stringify(paragraphs.map((p) => p.text)), prefix('every exact complete native paragraph body'), { expected: paragraphs.map((p) => p.text), actual: observed.paragraphs.map((p) => p.text) });
            check(observed.paragraphs.every((p) => p.geometry.width > 0 && p.geometry.height > 0 && p.geometry.visibility === 'visible' && p.geometry.display !== 'none' && parseFloat(p.geometry.textIndent) === 0), prefix('all prose visible with no indent'));
            check(JSON.stringify(observed.math.map((m) => m.tex)) === JSON.stringify(data.math), prefix('complete ordered native math tokens/formulas'), observed.math.map((m) => m.tex));
            check(observed.math.every((m) => m.geometry.fontSize >= 16 && m.geometry.fontFamily.includes('KaTeX_Main')), prefix('native readable math font and size'));
            check(observed.proseCharacters.every((p) => p.fontFamily.includes('KaTeX_Main') && p.fontSize >= 16), prefix('prose ASCII native font and size'));
            const actualSections = observed.paragraphs.filter((p) => p.sectionBreak).map((p) => p.index);
            check(JSON.stringify(actualSections) === JSON.stringify(data.indices), prefix('exact boundary placement'), actualSections);
            surface.boundaryObservations = data.boundaries.map((boundary) => ({
              ...boundary,
              actualBefore: observed.paragraphs[boundary.index - 1]?.text,
              actualAfter: observed.paragraphs[boundary.index]?.text,
              borderTop: observed.paragraphs[boundary.index]?.borderTop,
            }));
            check(surface.boundaryObservations.every((b) => b.before === b.actualBefore && b.after === b.actualAfter && parseFloat(b.borderTop) >= 1), prefix('exact adjacent boundary strings and visible rule'), surface.boundaryObservations);
            const flowBlocks = observed.blocks.filter((b) => b.className === 'figcap' || b.tag === 'FIGURE' || b.tag === 'P').map((b) => ({ kind: b.tag === 'FIGURE' ? 'fig' : b.className === 'figcap' ? 'cap' : 'p', text: b.text, id: b.id || undefined }));
            const intendedBlocks = data.flow.map((b) => ({ kind: b.kind, text: b.text || '', id: b.kind === 'fig' ? b.id : undefined }));
            check(JSON.stringify(flowBlocks) === JSON.stringify(intendedBlocks), prefix('full native prose/figure/caption order'), flowBlocks);
            check(JSON.stringify(observed.media.map(m => m.id)) === JSON.stringify(['fig-301', 'fig-302', 'fig-303']), prefix('figures 301-303 each displayed exactly once in text'), observed.media);
            check(observed.exerciseCount === 0, prefix('no exercise objects in text'));
            check(observed.media.every((m) => m.preparedFont === 'katex-main'), prefix('existing native shared KaTeX figure preparation'));
            check(observed.labels.length > 0 && observed.labels.every((label) => label.sizePx >= data.spec.display.minTextPx - 0.01 && label.insideMedia), prefix('all labels >=16px at actual media width and unclipped'), observed.labels);
            surface.platformFonts = await platformFonts(page);
            check(surface.platformFonts.every((entry) => entry.fonts.length > 0 && entry.fonts.some((font) => font.glyphCount > 0)), prefix('actual label font use'), surface.platformFonts);
            check(observed.footer.href === 'exercises.html' && /\b0\b/.test(observed.footer.text), prefix('native correct zero-exercise footer'), observed.footer);
          } else {
            surface.emptyExerciseInterpretation = 'PASS when native count/exercises/source count are zero and no exercise bodies/media exist; no positive-height empty-container assertion.';
            check(observed.exerciseCount === 0 && observed.exerciseLists === 0 && observed.paragraphs.length === 0 && observed.math.length === 0 && observed.media.length === 0, prefix('correct finalized empty exercise surface'), observed);
            check(observed.footer.href === 'text.html', prefix('native return-to-text link'), observed.footer);
          }
          if (kind === 'text') {
            check(observed.title === (data.lesson.printed_title || data.lesson.title), prefix('exact language-bound display heading'), observed.title);
            const scrollFigures = page.locator('figure[data-figure-layout="scroll"]');
            surface.figureScrollEnds = [];
            for (let i = 0; i < await scrollFigures.count(); i++) {
              const figure = scrollFigures.nth(i);
              await figure.evaluate(node => { node.scrollLeft = node.scrollWidth; });
              await expect.poll(() => figure.evaluate(node =>
                node.scrollWidth - node.clientWidth - node.scrollLeft)).toBeLessThanOrEqual(1);
              surface.figureScrollEnds.push(await figure.evaluate(node => ({
                id: node.id, width: node.clientWidth, contentWidth: node.scrollWidth,
                end: node.scrollLeft, reachable: node.scrollWidth - node.clientWidth - node.scrollLeft <= 1,
              })));
              await figure.evaluate(node => { node.scrollLeft = 0; });
            }
          }
          await page.getByRole('link').scrollIntoViewIfNeeded();
          await expect(page.getByRole('link')).toBeInViewport();
          surface.endReachable = await page.evaluate(() => {
            const sheet = document.querySelector('.sheet'), footer = sheet.lastElementChild;
            const r = footer.getBoundingClientRect(), prior = footer.previousElementSibling.getBoundingClientRect();
            return { footerVisible: r.top >= 0 && r.bottom <= innerHeight + 1, footerTop: r.top, footerBottom: r.bottom, previousContentBottom: prior.bottom, pageY: scrollY, documentHeight: document.scrollingElement.scrollHeight };
          });
          check(surface.endReachable.footerVisible && surface.endReachable.previousContentBottom <= surface.endReachable.footerTop + 1, prefix('footer/end reachable without collision'), surface.endReachable);
          await page.evaluate(() => scrollTo({ top: 0, left: 0, behavior: 'instant' }));
          const screenshotPath = path.join(out, `${id}-fullpage.png`);
          const buffer = await page.screenshot({ path: screenshotPath, fullPage: true, animations: 'disabled' });
          const pixels = pngPixels(buffer);
          const screenshot = { surface: id, ...bind(screenshotPath), nativeHtml: surface.nativeHtml, fullPage: true, width: pixels.width, height: pixels.height, initiallyOpen: kind === 'text' };
          result.screenshots.push(screenshot);
          surface.screenshot = screenshot;
          if (kind === 'text') {
            surface.mediaPixels = observed.media.map((m) => nonblankMedia(pixels, m.geometry));
            check(surface.mediaPixels.every((m) => m.nonblank), prefix('actual screenshot media nonblank'), surface.mediaPixels);
          }
          check(surface.pageErrors.length === 0 && surface.consoleErrors.length === 0 && surface.requestFailures.length === 0, prefix('no page/console/request errors'), { page: surface.pageErrors, console: surface.consoleErrors, requests: surface.requestFailures });
        } catch (error) {
          result.failures.push({ label: `${id}: execution failure`, details: String(error.stack ?? error) });
        } finally {
          page.off('pageerror', onPageError);
          page.off('console', onConsole);
          page.off('requestfailed', onRequestFailure);
          surface.failures = result.failures.slice(failStart);
          surface.status = surface.failures.length ? 'FAIL-preserved-no-repair' : 'PASS-mechanical';
          console.log(`${id}: ${surface.status} (${surface.failures.length} failures)`);
        }
      }
    }
  }
  result.externalRequests = externalRequests;
  check(result.surfaces.length === 8 && result.screenshots.length === 8, 'all eight surfaces captured', { surfaces: result.surfaces.length, screenshots: result.screenshots.length });
} catch (error) {
  result.failures.push({ label: 'execution stopped', details: String(error.stack ?? error) });
} finally {
  if (context) await context.close();
  if (browser) await browser.close();
  result.execution.browserClosed = true;
  result.nativeFilesUnchanged = baseline.map((item) => ({ ...item, afterSha256: hash(item.path), unchanged: hash(item.path) === item.sha256 }));
  check(result.nativeFilesUnchanged.every((item) => item.unchanged), 'exact native tree unchanged');
  result.protectedFiles = result.protectedFiles.map((item) => ({ ...item, afterSha256: hash(item.path), unchangedDuringCheck: hash(item.path) === item.sha256 }));
  result.protectedFilesChangedDuringConcurrentCheck = result.protectedFiles.filter((item) => !item.unchangedDuringCheck);
  result.finishedAt = new Date().toISOString();
  result.status = result.failures.length ? 'FAIL-preserved-no-repair' : 'PASS-mechanical-independent-display-review-pending';
  write('screenshot-manifest.json', {
    schema: 'native-display-screenshot-manifest@1', ticket: result.ticket, card: result.card,
    nativeResult: result.nativeResult, browserPasses: result.execution.browserPasses,
    screenshots: result.screenshots, screenshotsOpenedByCommand: 0,
  });
  result.screenshotManifest = bind(path.join(out, 'screenshot-manifest.json'));
  write('result.json', result);
  console.log(JSON.stringify({ status: result.status, failures: result.failures.map((f) => f.label), result: bind(path.join(out, 'result.json')), screenshotManifest: result.screenshotManifest }, null, 2));
  process.exitCode = result.failures.length ? 1 : 0;
}
