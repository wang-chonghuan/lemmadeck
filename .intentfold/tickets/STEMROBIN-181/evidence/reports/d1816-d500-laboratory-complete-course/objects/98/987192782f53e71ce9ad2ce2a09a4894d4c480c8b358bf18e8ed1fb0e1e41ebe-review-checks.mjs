import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const out = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp');
const display = path.join(tmp, 'd1816-d498a-laboratory-italic-display');
const authorityPath = path.join(display, 'result.json');
const nativePath = path.join(tmp, 'd1816-d497-laboratory-native-finalization/result.json');
const inheritedPath = path.join(tmp, 'd1816-d496a-laboratory-affected-review/report.json');
const inheritedFreezePath = path.join(tmp, 'd1816-d496a-laboratory-affected-review/review-freeze.json');
const freezePath = path.join(out, 'input-freeze.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  assert(file.startsWith(`${repo}/`), `Outside cwd: ${file}`);
  const data = fs.readFileSync(file);
  return { path: file, bytes: data.length, sha256: crypto.createHash('sha256').update(data).digest('hex') };
};
const save = (name, data) => fs.writeFileSync(path.join(out, name),
  `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
const names = [
  'zh-desktop-complete-text.png', 'en-desktop-complete-text.png',
  'zh-mobile-complete-text.png', 'en-mobile-complete-text.png',
  'zh-mobile-figure.png', 'en-mobile-figure.png',
  'zh-mobile-microscope.png', 'en-mobile-microscope.png',
];

if (process.argv[2] === 'freeze') {
  const current = read(authorityPath);
  const native = read(nativePath);
  const inherited = read(inheritedPath);
  const previousFreeze = read(inheritedFreezePath);
  const inputs = new Map();
  const add = (file, expected, role) => {
    const actual = bind(file);
    if (expected) assert.equal(actual.sha256, expected, `Binding changed: ${file}`);
    const prior = inputs.get(file);
    inputs.set(file, { ...actual, roles: [...new Set([...(prior?.roles ?? []), role])],
      ...(expected ? { expectedSha256: expected, matchesExpected: true } : {}) });
  };
  const walk = (node, role) => {
    if (!node || typeof node !== 'object') return;
    if (node.path && node.sha256) add(node.path, node.sha256, role);
    for (const value of Object.values(node)) if (typeof value === 'object') walk(value, role);
  };
  for (const file of [authorityPath, nativePath, inheritedPath, inheritedFreezePath])
    add(file, null, 'authority-or-inherited-receipt');
  assert.equal(current.status, 'PASS');
  assert.equal(current.batch, 'D498a');
  assert.equal(current.course, 'phy10-c4-s4');
  assert.equal(current.records.length, 4);
  assert.equal(native.status, 'NATIVE_PASS_DISPLAY_PENDING');
  assert.equal(inherited.status, 'PASS');
  walk(current, 'current-D498a-display');
  walk(native, 'native-finalization-byte-bindings');
  walk(inherited.currentWholeTemplates, 'inherited-approved-template');
  walk(inherited.currentRawLesson, 'source-byte-binding-only');
  walk(inherited.inheritedOriginalFail, 'preserved-original-fail-and-freeze');
  for (const row of previousFreeze.currentInputRecords) {
    if (/\/figures\/fig-278\./.test(row.path)) add(row.path, row.sha256, 'inherited-figure-byte-binding-only');
  }
  for (const file of [
    '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
    '.claude/skills/ld-s10y-lesson/tools/render_lesson.js',
    '.claude/skills/ld-s10y-lesson/tools/htmlfrag-emphasis.test.mjs',
    '.claude/skills/ld-s10y-lesson/tools/htmlfrag-caption.test.mjs',
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.agents/skills/ld-s10y-image/references/quality-gate.md',
    '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/check-d498-laboratory-offline.mjs',
    '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d498-laboratory-offline-display/italic-dom-defect.json',
    '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native/d498a-laboratory-emphasis-renderer-tests/receipt.json',
    '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native/d498a-laboratory-emphasis-renderer-tests/stdout.txt',
    '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native/d498a-laboratory-emphasis-renderer-tests/stderr.txt',
  ]) add(path.join(repo, file), null, 'display-repair-or-review-contract');
  add(fileURLToPath(import.meta.url), null, 'review-check-implementation');
  const selected = names.map((name, index) => ({
    ...bind(path.join(display, name)), plannedOpen: index + 1,
  }));
  assert(selected.every(row => inputs.has(row.path)));
  const delta = current.records.filter(row => row.viewport.name === 'desktop').map(row => {
    const original = native.records.find(item => item.locale === row.locale);
    const oldHtml = fs.readFileSync(original.html.path, 'utf8');
    const newHtml = fs.readFileSync(row.html.path, 'utf8');
    const emphasisCount = (newHtml.match(/<em>/g) ?? []).length;
    const unchangedAfterRestoringLiteralStars = newHtml.replace(/<\/?em>/g, '*') === oldHtml;
    assert.equal(emphasisCount, 2);
    assert(unchangedAfterRestoringLiteralStars);
    assert.equal(fs.readFileSync(row.destination.path, 'utf8'),
      fs.readFileSync(original.emptyExercises.path, 'utf8'));
    return { locale: row.locale, originalHtml: bind(original.html.path),
      currentHtml: bind(row.html.path), emphasisCount, unchangedAfterRestoringLiteralStars,
      emptyExerciseHtmlByteIdentical: true };
  });
  save('input-freeze.json', {
    schemaVersion: 1, task: 'STEMROBIN-181 D499 FIRST independent complete laboratory offline display review',
    cwd: repo, frozenAt: new Date().toISOString(), frozenBeforeImageOpen: true,
    actualImageOpensAtFreeze: 0, authority: bind(authorityPath),
    selectedScreenshots: selected, inputBindings: [...inputs.values()],
    nativeStatusVerbatim: native.status, historicalD498IsNotAuthority: true,
    nonDisplayGatesInheritedNotReplayed: true, sourceReadsAreHashOnly: true,
    displayOnlyHtmlDelta: delta, maxBatchImageOpens: 8, maxContextImageOpens: 24,
  });
  console.log(JSON.stringify({ status: 'FROZEN', freeze: bind(freezePath),
    inputs: inputs.size, selectedScreenshots: selected, displayOnlyHtmlDelta: delta }, null, 2));
} else if (process.argv[2] === 'dom') {
  const freeze = read(freezePath);
  for (const row of freeze.inputBindings) assert.equal(bind(row.path).sha256, row.sha256);
  const current = read(authorityPath);
  const { chromium } = createRequire(path.join(repo, 'app/package.json'))('playwright');
  const allowed = new Set(current.records.flatMap(row =>
    [row.html.path, row.destination.path].map(file => pathToFileURL(file).href)));
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const records = [], requests = [];
  try {
    for (const row of current.records) {
      const context = await browser.newContext({ viewport: {
        width: row.viewport.width, height: row.viewport.height,
      } });
      await context.route('**/*', route => {
        const url = route.request().url();
        requests.push({ url, allowed: allowed.has(url) });
        return allowed.has(url) ? route.continue() : route.abort();
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      try {
        const textUrl = pathToFileURL(row.html.path).href;
        await page.goto(textUrl, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        const text = await page.evaluate(() => {
          const box = node => {
            const r = node.getBoundingClientRect();
            return { x: r.x, y: r.y, width: r.width, height: r.height,
              right: r.right, bottom: r.bottom };
          };
          const paras = [...document.querySelectorAll('p.para')];
          const children = [...document.querySelector('.sheet').children];
          const terms = [...document.querySelectorAll('p.para em')].map(node => ({
            text: node.textContent, tag: node.tagName, style: getComputedStyle(node).fontStyle,
            fontSize: getComputedStyle(node).fontSize, box: box(node),
            paragraphHasLiteralStars: node.parentElement.textContent.includes('*'),
          }));
          const figure = document.querySelector('figure svg');
          const labels = [...figure.querySelectorAll('[data-label-id]')].map(node => ({
            text: node.textContent, box: box(node),
            screenFontPx: parseFloat(getComputedStyle(node).fontSize) *
              Math.hypot(node.getScreenCTM().a, node.getScreenCTM().b),
          }));
          const math = paras.flatMap(node => [...node.querySelectorAll('.prose-math,.katex')].map(child => ({
            family: getComputedStyle(child).fontFamily,
            ratio: parseFloat(getComputedStyle(child).fontSize) / parseFloat(getComputedStyle(node).fontSize),
          })));
          const forward = [...document.querySelectorAll('a')].find(a => a.getAttribute('href') === 'exercises.html');
          const tail = paras.slice(-4).map(node => ({ text: node.textContent, box: box(node) }));
          return {
            title: document.querySelector('h1').textContent,
            crumb: document.querySelector('.crumb').textContent,
            paragraphCount: paras.length, sheetChildCount: children.length,
            boxes: children.map(box), width: document.documentElement.scrollWidth,
            height: document.documentElement.scrollHeight,
            paragraphFontSizes: [...new Set(paras.map(node => getComputedStyle(node).fontSize))],
            paragraphLineHeights: [...new Set(paras.map(node => getComputedStyle(node).lineHeight))],
            headingTexts: paras.filter(node => getComputedStyle(node).fontWeight === '700').map(node => node.textContent),
            terms, figureBox: box(figure), labels, mathCount: math.length,
            mathFamilies: [...new Set(math.map(item => item.family))],
            minMathRatio: Math.min(...math.map(item => item.ratio)),
            fontStatus: document.fonts.status, katexFontLoaded: document.fonts.check('20px KaTeX_Main'),
            zeroIndent: paras.every(node => parseFloat(getComputedStyle(node).textIndent) === 0),
            errorNodes: document.querySelectorAll('.err,.katex-error,.sr-tex-err,input,textarea').length,
            forward: { text: forward.textContent, href: forward.getAttribute('href'), box: box(forward) },
            tail,
          };
        });
        assert.equal(text.paragraphCount, row.paragraphs);
        assert.equal(text.sheetChildCount, row.geometry.boxes.length);
        assert(text.width <= row.viewport.width);
        assert.equal(text.errorNodes, 0);
        assert(text.zeroIndent && text.fontStatus === 'loaded' && text.katexFontLoaded);
        assert(text.mathFamilies.every(family => family.includes('KaTeX')));
        assert(text.minMathRatio >= 1.09);
        assert(text.boxes.every(b => b.width > 0 && b.height > 0 && b.x >= 0 && b.right <= row.viewport.width + 1));
        assert(text.boxes.every((b, i) => i === 0 || b.y >= text.boxes[i - 1].bottom - 1));
        assert.deepEqual(text.terms.map(term => term.text), row.locale === 'zh'
          ? ['物镜', '目镜'] : ['objective', 'eyepiece']);
        assert(text.terms.every(term => term.style === 'italic' && !term.paragraphHasLiteralStars &&
          term.box.width > 0 && term.box.height > 0));
        assert.deepEqual(text.labels.map(item => item.text), ['A', 'B', 'C', 'α', 'β']);
        assert(text.labels.every(item => item.screenFontPx >= 16));
        if (row.viewport.name === 'mobile') assert.equal(text.figureBox.width, 358);
        const maxGeometryDelta = Math.max(...text.boxes.flatMap((b, i) =>
          ['x', 'y', 'width', 'height', 'right', 'bottom'].map(key => Math.abs(b[key] - row.geometry.boxes[i][key]))));
        assert(maxGeometryDelta <= 0.01, `Geometry differs from frozen screenshot receipt: ${maxGeometryDelta}`);
        await page.getByRole('link', { name: text.forward.text, exact: true }).click();
        await page.waitForURL(pathToFileURL(row.destination.path).href);
        await page.evaluate(() => document.fonts.ready);
        const empty = await page.evaluate(() => {
          const back = document.querySelector('a[href="text.html"]');
          const r = back.getBoundingClientRect();
          return { url: location.href, title: document.querySelector('h1').textContent,
            bodyText: document.body.innerText,
            exerciseItems: document.querySelectorAll('li.ex').length,
            answerChoiceControls: document.querySelectorAll('input,textarea,select,button,[role="button"],[role="radio"],[role="checkbox"]').length,
            figures: document.querySelectorAll('figure').length,
            errors: document.querySelectorAll('.err,.katex-error,.sr-tex-err').length,
            width: document.documentElement.scrollWidth,
            back: { text: back.textContent, href: back.getAttribute('href'),
              x: r.x, y: r.y, right: r.right, bottom: r.bottom,
              width: r.width, height: r.height,
              visible: getComputedStyle(back).visibility === 'visible' &&
                r.width > 0 && r.height > 0 && r.y >= 0 && r.bottom <= innerHeight } };
        });
        assert.equal(empty.exerciseItems + empty.answerChoiceControls + empty.figures + empty.errors, 0);
        assert(empty.back.visible && empty.width <= row.viewport.width);
        assert.equal(empty.back.text, row.locale === 'zh' ? '← 回课文' : '← Back to text');
        await page.getByRole('link', { name: empty.back.text, exact: true }).click();
        await page.waitForURL(textUrl);
        assert.deepEqual(errors, []);
        records.push({ locale: row.locale, viewport: row.viewport, status: 'PASS',
          html: bind(row.html.path), destination: bind(row.destination.path),
          text, maxGeometryDelta, emptyExercises: empty,
          independentObservedForwardClick: true, independentObservedBackClick: true,
          boundD498aObservedForwardClick: row.observedForwardClick,
          boundD498aObservedBackClick: row.observedBackClick, errors });
      } finally { await context.close(); }
    }
  } finally { await browser.close(); }
  assert(requests.every(row => row.allowed));
  save('dom-review-evidence.json', { status: 'PASS', authority: freeze.authority,
    checkedAt: new Date().toISOString(), offline: true, headless: true,
    screenshotsCreated: 0, imageOpens: 0, records, requests });
  console.log(JSON.stringify({ status: 'PASS', evidence: bind(path.join(out, 'dom-review-evidence.json')),
    records: records.map(row => ({ locale: row.locale, viewport: row.viewport,
      size: [row.text.width, row.text.height], terms: row.text.terms,
      figureWidth: row.text.figureBox.width, labels: row.text.labels,
      tail: row.text.tail, maxGeometryDelta: row.maxGeometryDelta, emptyExercises: row.emptyExercises })) }, null, 2));
} else if (process.argv[2] === 'integrity') {
  const freeze = read(freezePath);
  const changed = freeze.inputBindings.filter(row => bind(row.path).sha256 !== row.sha256);
  assert.deepEqual(changed, []);
  console.log(JSON.stringify({ status: 'PASS', inputsUnchanged: freeze.inputBindings.length,
    freeze: bind(freezePath) }, null, 2));
} else {
  throw new Error('Use freeze, dom, or integrity');
}
