import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import zlib from 'node:zlib';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck';
if (process.cwd() !== root) throw new Error('Exact isolated worktree required');
const out = path.join(root, '.tmp/stemrobin-184-resume/n8-offline-review');
const htmlRoot = path.join(root, '.tmp/stemrobin-184-resume/offline/render/9c/modern-us-neutral/ana9-c2-s2-n8');
const canonicalRoot = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/lessons/ana9-c2-s2-n8');
const editionRoot = path.resolve(canonicalRoot, '../..');
const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'first-run.lock'), new Date().toISOString(), { flag: 'wx' });
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const binding = file => ({ path: file, sha256: sha(fs.readFileSync(file)), bytes: fs.statSync(file).size });
const normalize = s => s.replace(/\*\*/g, '').replace(/\s+/g, '').replace(/[\u200b-\u200d\ufeff]/g, '');
const lesson = JSON.parse(fs.readFileSync(path.join(canonicalRoot, 'lesson.json'), 'utf8'));
const exercises = JSON.parse(fs.readFileSync(path.join(canonicalRoot, 'exercises.json'), 'utf8'));
const figures = JSON.parse(fs.readFileSync(path.join(canonicalRoot, 'figures.json'), 'utf8'));
const inputs = [
  ...['text', 'exercises', 'choices'].map(n => path.join(htmlRoot, `${n}.html`)),
  ...['lesson', 'exercises', 'figures'].map(n => path.join(canonicalRoot, `${n}.json`)),
  ...figures.figures.flatMap(f => [f.spec, f.render, f.review].map(p => path.join(editionRoot, p))),
  path.join(root, '.agents/skills/ld-s10y-image/SKILL.md'),
  path.join(root, '.claude/skills/ld-s10y-lesson/references/production-resume.md'),
  path.join(root, '.tmp/stemrobin-184-resume/n8-math-review/review.modern.md'),
  path.join(root, '.tmp/stemrobin-184-resume/table36-review/review.md'),
];
const report = {
  schema: 'stemrobin-184/n8-offline-whole-lesson-review@1',
  startedAt: new Date().toISOString(),
  status: 'running',
  scope: '184-4 B continuation; first whole-lesson OFFLINE check; layout/text only',
  policy: {
    runLimit: 1, repairOrRetry: false, imagesOpenedLimit: 6, imagesPerBatchLimit: 8,
    parentImagesPermanently: '24/24', sourceImagesOpened: 0, figuresReopened: 0,
    answerKeysRead: false, choiceAuthorInternalsRead: false, serviceCalls: false,
    desktopOrCDPOrPersistentProfile: false, browser: 'explicit isolated headless Chromium',
    productionApproval: false,
  },
  runtime: { module: require.resolve('playwright'), executable: chromium.executablePath() },
  inputBindings: inputs.map(binding),
  inputSetSha256: null, surfaces: [], checks: [], screenshots: [],
  imagesOpened: 0, browserClosed: false, contextsClosed: 0,
  visualReview: { status: 'pending', observations: [] },
};
report.inputSetSha256 = sha(JSON.stringify(report.inputBindings));
const check = (id, pass, evidence) => report.checks.push({ id, status: pass ? 'pass' : 'fail', evidence });
const save = () => fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'w' });

// PNG pixel checks use the existing screenshot, never a crop or an extra image.
function pixels(file) {
  const b = fs.readFileSync(file);
  let p = 8, width, height, depth, color;
  const compressed = [];
  while (p < b.length) {
    const len = b.readUInt32BE(p), type = b.toString('ascii', p + 4, p + 8);
    const data = b.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4); depth = data[8]; color = data[9];
    }
    if (type === 'IDAT') compressed.push(data);
    p += len + 12;
  }
  if (depth !== 8 || ![2, 6].includes(color)) throw new Error(`Unsupported PNG ${depth}/${color}`);
  const channels = color === 6 ? 4 : 3, stride = width * channels;
  const raw = zlib.inflateSync(Buffer.concat(compressed));
  const decoded = Buffer.alloc(stride * height);
  const paeth = (a, b, c) => {
    const d = a + b - c, da = Math.abs(d - a), db = Math.abs(d - b), dc = Math.abs(d - c);
    return da <= db && da <= dc ? a : db <= dc ? b : c;
  };
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const left = x >= channels ? decoded[y * stride + x - channels] : 0;
      const above = y ? decoded[(y - 1) * stride + x] : 0;
      const prior = y && x >= channels ? decoded[(y - 1) * stride + x - channels] : 0;
      const delta = [0, left, above, Math.floor((left + above) / 2), paeth(left, above, prior)][filter];
      decoded[y * stride + x] = (raw[y * (stride + 1) + 1 + x] + delta) & 255;
    }
  }
  const region = box => {
    const x0 = Math.max(0, Math.floor(box.x)), y0 = Math.max(0, Math.floor(box.y));
    const x1 = Math.min(width, Math.ceil(box.x + box.width)), y1 = Math.min(height, Math.ceil(box.y + box.height));
    let nonwhite = 0, nearblack = 0, total = 0;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      const i = y * stride + x * channels;
      if (Math.min(decoded[i], decoded[i + 1], decoded[i + 2]) < 240) nonwhite++;
      if (Math.max(decoded[i], decoded[i + 1], decoded[i + 2]) < 30) nearblack++;
      total++;
    }
    return { nonwhite, nearblack, total, nonwhiteRatio: nonwhite / total };
  };
  return { width, height, region };
}

function measure({ html }) {
  const rect = el => {
    const r = el.getBoundingClientRect();
    return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height, right: r.right + scrollX, bottom: r.bottom + scrollY };
  };
  const norm = s => s.replace(/\*\*/g, '').replace(/\s+/g, '').replace(/[\u200b-\u200d\ufeff]/g, '');
  const semantic = node => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    if (node.matches('.katex')) return `$${node.querySelector('annotation[encoding="application/x-tex"]')?.textContent ?? '__MISSING_TEX__'}$`;
    if (node.matches('script,style,input,.katex-mathml')) return '';
    return [...node.childNodes].map(semantic).join('');
  };
  const source = new DOMParser().parseFromString(html, 'text/html');
  const selectors = ['h1', 'p.para', 'li.ex', 'p.stem', '.option-letter', '.option-text', '.choice-line', '.jump'];
  const exactHtmlCoverage = selectors.map(selector => ({
    selector,
    expected: [...source.querySelectorAll(selector)].map(n => norm(semantic(n))),
    actual: [...document.querySelectorAll(selector)].map(n => norm(semantic(n))),
  }));
  const paragraphs = [...document.querySelectorAll('p.para')].map(el => ({
    semantic: semantic(el), rect: rect(el),
    math: [...el.querySelectorAll('.katex')].map(k => k.querySelector('annotation')?.textContent),
  }));
  const math = [...document.querySelectorAll('.katex')].map((el, index) => {
    const cs = getComputedStyle(el), parent = getComputedStyle(el.parentElement);
    const html = el.querySelector('.katex-html');
    const htmlRects = html ? [...html.getClientRects()].map(r => ({ width: r.width, height: r.height })) : [];
    return {
      index, tex: el.querySelector('annotation')?.textContent, rect: rect(el),
      fontFamily: cs.fontFamily, px: parseFloat(cs.fontSize),
      parentPx: parseFloat(parent.fontSize), ratio: parseFloat(cs.fontSize) / parseFloat(parent.fontSize),
      fontReady: document.fonts.check(`${cs.fontSize} KaTeX_Main`),
      htmlRects, display: cs.display, visibility: cs.visibility, opacity: cs.opacity,
    };
  });
  const numericLetters = [...document.querySelectorAll('.prose-math,.sr-prose-math,.no,.option-letter')].map(el => {
    const cs = getComputedStyle(el), base = el.closest('.body,p.para') ?? el.closest('li.ex')?.querySelector('.body');
    const contentBase = base ? parseFloat(getComputedStyle(base).fontSize) : parseFloat(getComputedStyle(el.parentElement).fontSize);
    return {
      text: el.textContent, className: el.className, rect: rect(el),
      family: cs.fontFamily, px: parseFloat(cs.fontSize), contentBasePx: contentBase,
      ratio: parseFloat(cs.fontSize) / contentBase,
      fontReady: document.fonts.check(`${cs.fontSize} KaTeX_Main`),
    };
  });
  const unwrappedContentTokens = [];
  const walker = document.createTreeWalker(document.querySelector('.sheet'), NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const n = walker.currentNode, el = n.parentElement;
    if (!el.closest('p.para,.body,.no') || el.closest('.katex,.prose-math,.sr-prose-math,.no,.option-letter,.src')) continue;
    if (/[0-9A-Za-z]/.test(n.textContent)) unwrappedContentTokens.push({ text: n.textContent, parentClass: el.className });
  }
  const options = [...document.querySelectorAll('label.option')].map(el => {
    const input = el.querySelector('input'), letter = el.querySelector('.option-letter'), text = el.querySelector('.option-text');
    return {
      name: input.name, type: input.type, value: input.value, disabled: input.disabled,
      label: semantic(letter), semantic: semantic(text),
      rect: rect(el), inputRect: rect(input), letterRect: rect(letter), textRect: rect(text),
      textClient: { width: text.clientWidth, height: text.clientHeight },
      textScroll: { width: text.scrollWidth, height: text.scrollHeight },
      overflowX: getComputedStyle(text).overflowX, overflowY: getComputedStyle(text).overflowY,
      lines: [...text.querySelectorAll('.choice-line')].map(line => ({ semantic: semantic(line), rect: rect(line) })),
    };
  });
  const references = [];
  for (const el of document.querySelectorAll('[src],[href],image,use')) {
    for (const attr of ['src', 'href', 'xlink:href']) if (el.hasAttribute(attr)) references.push({ tag: el.tagName, attr, value: el.getAttribute(attr) });
  }
  for (const style of document.querySelectorAll('style')) for (const m of style.textContent.matchAll(/url\(([^)]+)\)/g)) references.push({ tag: 'STYLE', attr: 'url', value: m[1].replace(/^["']|["']$/g, '').slice(0, 140) });
  const glyphClips = [];
  for (const el of document.querySelectorAll('.katex-html span,.prose-math,.sr-prose-math,.option-letter')) {
    if (![...el.childNodes].some(n => n.nodeType === Node.TEXT_NODE && /[^\s\u200b]/.test(n.textContent))) continue;
    const r = el.getBoundingClientRect();
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const cs = getComputedStyle(a), ar = a.getBoundingClientRect();
      const clippedX = ['hidden', 'clip'].includes(cs.overflowX) && (r.left < ar.left - 1 || r.right > ar.right + 1);
      const clippedY = ['hidden', 'clip', 'auto', 'scroll'].includes(cs.overflowY) && (r.top < ar.top - 1 || r.bottom > ar.bottom + 1);
      if (clippedX || clippedY) glyphClips.push({ text: el.textContent, ancestor: a.className, clippedX, clippedY, rect: rect(el), ancestorRect: rect(a) });
    }
  }
  const figures = [...document.querySelectorAll('figure.fig')].map(el => {
    const media = el.querySelector('.figure-media'), svg = media.querySelector('svg');
    return {
      id: el.id, purpose: el.dataset.figurePurpose, layout: el.dataset.figureLayout,
      rect: rect(el), mediaRect: rect(media), svgRect: rect(svg),
      clientWidth: el.clientWidth, scrollWidth: el.scrollWidth, overflowX: getComputedStyle(el).overflowX,
      viewBox: svg.getAttribute('viewBox'), primitives: svg.querySelectorAll('path,line,rect,polyline,polygon,circle,text').length,
      labels: [...svg.querySelectorAll('text')].map(t => ({ text: t.textContent, family: getComputedStyle(t).fontFamily, px: parseFloat(getComputedStyle(t).fontSize), rect: rect(t) })),
    };
  });
  return {
    title: document.title, heading: document.querySelector('h1')?.textContent,
    viewport: { width: innerWidth, height: innerHeight },
    document: { clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight },
    fonts: { status: document.fonts.status, loaded: [...document.fonts].filter(f => f.status === 'loaded').map(f => ({ family: f.family, style: f.style, weight: f.weight })) },
    paragraphs, exactHtmlCoverage, math, numericLetters, unwrappedContentTokens, options, figures, glyphClips,
    exercises: [...document.querySelectorAll('li.ex')].map(el => ({ number: el.querySelector('.no')?.textContent, semantic: semantic(el), rect: rect(el) })),
    mathErrors: [...document.querySelectorAll('.katex-error,.err')].map(n => n.textContent),
    resultOrKeyNodes: [...document.querySelectorAll('[data-correct],[data-answer],[data-result],.result,.answer,.correct')].map(n => n.outerHTML.slice(0, 200)),
    scripts: document.scripts.length, references,
    images: [...document.images].map(i => ({ complete: i.complete, naturalWidth: i.naturalWidth, naturalHeight: i.naturalHeight })),
    finalContent: rect(document.querySelector('.sheet').lastElementChild),
  };
}

let browser;
try {
  browser = await chromium.launch({ headless: true });
  report.runtime.version = browser.version();
  for (const [view, viewport] of [['desktop', { width: 1440, height: 960 }], ['mobile', { width: 390, height: 844 }]]) {
    for (const surface of ['text', 'exercises', 'choices']) {
      const id = `${surface}-${view}`, htmlFile = path.join(htmlRoot, `${surface}.html`);
      const html = fs.readFileSync(htmlFile, 'utf8');
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1, offline: true, serviceWorkers: 'block' });
      const page = await context.newPage();
      const errors = [], requests = [], requestFailures = [], blocked = [];
      page.on('pageerror', e => errors.push({ kind: 'pageerror', message: e.message }));
      page.on('console', m => { if (m.type() === 'error') errors.push({ kind: 'console', message: m.text() }); });
      page.on('request', r => requests.push({ url: r.url(), type: r.resourceType() }));
      page.on('requestfailed', r => requestFailures.push({ url: r.url(), error: r.failure()?.errorText }));
      await context.route('**/*', route => {
        const url = route.request().url();
        if (url.startsWith('file:') || url.startsWith('data:')) return route.continue();
        blocked.push(url);
        return route.abort('blockedbyclient');
      });
      try {
        await page.goto(pathToFileURL(htmlFile).href, { waitUntil: 'load' });
        await page.evaluate(async () => { await document.fonts.ready; });
        const m = await page.evaluate(measure, { html });
        const screenshotFile = path.join(out, `${id}.png`);
        await page.screenshot({ path: screenshotFile, fullPage: true, animations: 'disabled' });
        const png = pixels(screenshotFile);
        const pixelReport = {
          width: png.width, height: png.height,
          whole: png.region({ x: 0, y: 0, width: png.width, height: png.height }),
          figures: m.figures.map(f => ({ id: f.id, ...png.region(f.rect) })),
        };
        report.screenshots.push({ ...binding(screenshotFile), id, viewport, fullPage: true, pixels: pixelReport, opened: false });
        const result = { id, htmlBinding: binding(htmlFile), measurements: m, errors, requests, requestFailures, blocked, reachability: [], interaction: [], scrolling: [] };
        report.surfaces.push(result);
        check(`${id}:no-document-horizontal-overflow`, m.document.scrollWidth <= m.document.clientWidth, m.document);
        check(`${id}:exact-supplied-html-view-coverage`, m.exactHtmlCoverage.every(c => JSON.stringify(c.expected) === JSON.stringify(c.actual)), m.exactHtmlCoverage.map(c => ({ selector: c.selector, expectedCount: c.expected.length, actualCount: c.actual.length })));
        check(`${id}:no-math-render-failures`, m.mathErrors.length === 0 && m.math.length > 0 && m.math.every(k => k.tex && k.htmlRects.some(r => r.width > 0 && r.height > 0) && k.visibility === 'visible' && k.opacity !== '0'), { errors: m.mathErrors, formulaCount: m.math.length });
        check(`${id}:katex-main-1.10em-roots`, m.math.every(k => k.fontFamily.includes('KaTeX_Main') && Math.abs(k.ratio - 1.1) < 0.002 && k.fontReady), m.math.filter(k => !k.fontFamily.includes('KaTeX_Main') || Math.abs(k.ratio - 1.1) >= 0.002 || !k.fontReady));
        check(`${id}:numeric-letter-main-1.10em`, m.numericLetters.every(k => k.family.includes('KaTeX_Main') && Math.abs(k.ratio - 1.1) < 0.002 && k.fontReady), m.numericLetters.filter(k => !k.family.includes('KaTeX_Main') || Math.abs(k.ratio - 1.1) >= 0.002 || !k.fontReady));
        check(`${id}:no-unwrapped-math-numbers-letters`, m.unwrappedContentTokens.length === 0, m.unwrappedContentTokens);
        check(`${id}:no-clipped-glyphs`, m.glyphClips.length === 0, m.glyphClips);
        check(`${id}:self-contained-assets`, m.references.every(r => r.value.startsWith('data:') || r.value.startsWith('#') || (r.tag === 'A' && ['text.html', 'exercises.html', 'choices.html'].includes(r.value))) && m.images.every(i => i.complete && i.naturalWidth > 0), { references: m.references, images: m.images });
        check(`${id}:nonblank-screenshot-and-media`, pixelReport.whole.nonwhite > 100 && pixelReport.whole.nonwhiteRatio < 0.9 && pixelReport.figures.every(f => f.nonwhite > 100), pixelReport);
        check(`${id}:no-answer-result-or-runtime-script`, m.resultOrKeyNodes.length === 0 && m.scripts === 0, { nodes: m.resultOrKeyNodes, scripts: m.scripts });

        if (surface === 'text') {
          const expected = lesson.prose.filter(p => p.kind === 'p').map(p => normalize(p.text));
          const actual = m.paragraphs.map(p => normalize(p.semantic));
          check(`${id}:exact-canonical-eleven-paragraphs-and-both-proofs`, JSON.stringify(expected) === JSON.stringify(actual), { expected, actual, proseEntryCount: lesson.prose.length, expectedFigures: lesson.prose.filter(p => p.kind === 'fig').map(f => f.id) });
          check(`${id}:canonical-table-marker`, JSON.stringify(m.figures.map(f => f.id)) === JSON.stringify(figures.figures.map(f => f.id)), m.figures.map(f => f.id));
          for (const f of m.figures) {
            check(`${id}:${f.id}:fixed640-instructional-18px`, f.layout === 'scroll' && f.purpose === 'instructional' && Math.abs(f.mediaRect.width - 640) < 0.5 && Math.abs(f.svgRect.width - 640) < 0.5 && f.labels.length > 0 && f.labels.every(t => Math.abs(t.px - 18) < 0.01), { media: f.mediaRect, svg: f.svgRect, labelCount: f.labels.length, labelSizes: [...new Set(f.labels.map(t => t.px))] });
            const ends = await page.locator(`#${f.id}`).evaluate(el => {
              const edge = () => {
                const r = el.getBoundingClientRect(), s = el.querySelector('svg').getBoundingClientRect();
                return { scrollLeft: el.scrollLeft, max: el.scrollWidth - el.clientWidth, frameLeft: s.left, frameRight: s.right, viewportLeft: r.left, viewportRight: r.right };
              };
              el.scrollLeft = 0; const start = edge();
              el.scrollLeft = el.scrollWidth; const end = edge();
              el.scrollLeft = 0;
              return { start, end };
            });
            result.scrolling.push({ id: f.id, ...ends });
            check(`${id}:${f.id}:reachable-scroll-ends`, Math.abs(ends.start.scrollLeft) < 1 && Math.abs(ends.end.scrollLeft - ends.end.max) < 1 && (view !== 'mobile' || ends.end.max > 0) && ends.start.frameLeft >= ends.start.viewportLeft - 1 && ends.end.frameRight <= ends.end.viewportRight + 1, ends);
          }
        }
        if (surface === 'exercises') {
          check(`${id}:exact-canonical-E70-a-b`, m.exercises.length === exercises.count && m.exercises.every((e, i) => normalize(e.semantic) === normalize(exercises.exercises[i].text)), { expected: exercises.exercises.map(e => normalize(e.text)), actual: m.exercises.map(e => normalize(e.semantic)) });
        }
        if (surface === 'choices') {
          check(`${id}:two-questions-eight-options-single-and-multiple`, m.exercises.length === 2 && m.options.length === 8 && m.options.filter(o => o.type === 'radio').length === 4 && m.options.filter(o => o.type === 'checkbox').length === 4, { questions: m.exercises.length, options: m.options.length, types: m.options.map(o => o.type) });
          check(`${id}:A-D-labels-no-collision`, m.options.every((o, i) => normalize(o.label) === `${'ABCD'[i % 4]}.` && o.inputRect.right <= o.letterRect.x + 0.5 && o.letterRect.right <= o.textRect.x + 0.5 && o.textRect.right <= o.rect.right + 0.5), m.options.map(o => ({ label: o.label, input: o.inputRect, letter: o.letterRect, text: o.textRect, option: o.rect })));
          check(`${id}:four-class-options-no-line-collision-or-hidden-clipping`, m.options.slice(4).every(o => o.lines.length === 4 && o.lines.every((line, i) => i === 0 || line.rect.y >= o.lines[i - 1].rect.bottom - 0.5) && o.textScroll.height <= o.textClient.height + 1 && (o.textScroll.width <= o.textClient.width + 1 || ['auto', 'scroll'].includes(o.overflowX))), m.options.slice(4));
          const before = await page.locator('.sheet').innerText();
          for (const type of ['checkbox', 'radio']) {
            const controls = page.locator(`input[type="${type}"]`);
            for (let i = 0; i < await controls.count(); i++) {
              await controls.nth(i).check();
              const states = await controls.evaluateAll(es => es.map(e => e.checked));
              result.interaction.push({ type, operation: `check-${i}`, states });
              check(`${id}:${type}:check-${i}`, type === 'radio' ? states.filter(Boolean).length === 1 && states[i] : states.slice(0, i + 1).every(Boolean), states);
            }
            if (type === 'checkbox') {
              for (let i = 0; i < await controls.count(); i++) {
                await controls.nth(i).uncheck();
                const states = await controls.evaluateAll(es => es.map(e => e.checked));
                result.interaction.push({ type, operation: `uncheck-${i}`, states });
                check(`${id}:checkbox:uncheck-${i}`, !states[i], states);
              }
            }
          }
          check(`${id}:selection-no-key-result-or-text-change`, before === await page.locator('.sheet').innerText() && await page.locator('[data-correct],[data-answer],[data-result],.result,.answer,.correct').count() === 0, { textUnchanged: before === await page.locator('.sheet').innerText() });
        }
        const targets = surface === 'choices' ? 'label.option,.jump' : surface === 'text' ? 'p.para,figure.fig,.jump' : 'li.ex .body,.jump';
        for (let i = 0; i < await page.locator(targets).count(); i++) {
          const locator = page.locator(targets).nth(i);
          await locator.scrollIntoViewIfNeeded();
          const reached = await locator.evaluate(el => {
            const r = el.getBoundingClientRect();
            return { tag: el.tagName, className: el.className, top: r.top, bottom: r.bottom, height: r.height, intersects: r.top < innerHeight && r.bottom > 0 };
          });
          result.reachability.push(reached);
        }
        const horizontal = await page.locator('.nb,.sr-nb,.option-text,.body').evaluateAll(es => es.filter(el => el.scrollWidth > el.clientWidth + 1).map(el => {
          const start = el.scrollLeft;
          el.scrollLeft = el.scrollWidth;
          const end = el.scrollLeft, max = el.scrollWidth - el.clientWidth, cs = getComputedStyle(el);
          el.scrollLeft = start;
          return { className: el.className, clientWidth: el.clientWidth, scrollWidth: el.scrollWidth, overflowX: cs.overflowX, end, max, reachable: Math.abs(end - max) < 1 && ['auto', 'scroll'].includes(cs.overflowX) };
        }));
        result.scrolling.push(...horizontal);
        check(`${id}:all-overwide-content-reachable`, horizontal.every(h => h.reachable), horizontal);
        check(`${id}:all-regions-and-controls-reachable`, result.reachability.length > 0 && result.reachability.every(r => r.intersects), result.reachability);
        await page.locator('.jump').scrollIntoViewIfNeeded();
        const final = await page.locator('.jump').evaluate(el => {
          const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
          return { top: r.top, bottom: r.bottom, right: r.right, visible: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth, hit: el.contains(document.elementFromPoint(x, y)), href: el.getAttribute('href') };
        });
        result.finalReachability = final;
        check(`${id}:final-navigation-reachable`, final.visible && final.hit && fs.existsSync(path.join(htmlRoot, final.href)), final);
        check(`${id}:no-console-page-network-errors`, errors.length === 0 && blocked.length === 0 && requestFailures.length === 0 && requests.every(r => r.url.startsWith('file:') || r.url.startsWith('data:')), { errors, blocked, requestFailures, requests });
        save();
      } finally {
        await context.close();
        report.contextsClosed++;
      }
    }
  }
} catch (error) {
  report.executionError = { message: error.message, stack: error.stack };
  check('execution-completed-without-error', false, report.executionError);
} finally {
  if (browser) {
    await browser.close();
    report.browserClosed = !browser.isConnected();
  }
  report.completedAt = new Date().toISOString();
  report.inputBindingsAfter = inputs.map(binding);
  check('all-inputs-unchanged-during-review', JSON.stringify(report.inputBindings) === JSON.stringify(report.inputBindingsAfter), { before: report.inputSetSha256, after: sha(JSON.stringify(report.inputBindingsAfter)) });
  check('all-six-surfaces-once-browser-explicitly-released', report.surfaces.length === 6 && report.screenshots.length === 6 && report.browserClosed && report.contextsClosed === 6, { surfaces: report.surfaces.length, screenshots: report.screenshots.length, browserClosed: report.browserClosed, contextsClosed: report.contextsClosed });
  report.status = report.checks.some(c => c.status === 'fail') ? 'fail' : 'visual-review-pending';
  report.summary = { pass: report.checks.filter(c => c.status === 'pass').length, fail: report.checks.filter(c => c.status === 'fail').length, failedIds: report.checks.filter(c => c.status === 'fail').map(c => c.id) };
  report.scriptBinding = binding(path.join(out, 'check.mjs'));
  save();
  console.log(JSON.stringify({ status: report.status, summary: report.summary, inputSetSha256: report.inputSetSha256, screenshots: report.screenshots.map(s => ({ id: s.id, path: s.path, sha256: s.sha256, width: s.pixels.width, height: s.pixels.height })), browserClosed: report.browserClosed, contextsClosed: report.contextsClosed }, null, 2));
}
