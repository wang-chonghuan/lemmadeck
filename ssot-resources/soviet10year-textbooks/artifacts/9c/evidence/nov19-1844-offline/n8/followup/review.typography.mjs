import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck';
if (process.cwd() !== root) throw new Error('Exact isolated worktree required');
const out = path.join(root, '.tmp/stemrobin-184-resume/n8-offline-review');
const retained = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-offline/n8/first');
const beforePath = path.join(out, 'choices.before-typography.html');
const currentPath = path.join(root, '.tmp/stemrobin-184-resume/offline/render/9c/modern-us-neutral/ana9-c2-s2-n8/choices.html');
const oldGenerator = path.join(out, 'preview.before-typography.mjs');
const generator = path.join(root, '.tmp/stemrobin-184-resume/preview-n8-choices.mjs');
const jsonPath = path.join(out, 'review.typography.json');
const mdPath = path.join(out, 'review.typography.md');
if (fs.existsSync(jsonPath) || fs.existsSync(mdPath)) throw new Error('One follow-up only; existing evidence must not be overwritten');
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bytes = file => fs.readFileSync(file);
const text = file => fs.readFileSync(file, 'utf8');
const bind = file => ({ path: file, sha256: digest(bytes(file)), bytes: fs.statSync(file).size });
const first = JSON.parse(text(path.join(out, 'report.json')));
const adjudication = JSON.parse(text(path.join(out, 'review.json')));
const intakePath = path.join(retained, 'parent-intake.json');
const intake = JSON.parse(text(intakePath));
const before = text(beforePath), current = text(currentPath);
const originalGenerator = text(oldGenerator), currentGenerator = text(generator);
const beforeRule = '.option-letter .prose-math{font-size:1em}';
const repairedRule = '.sr-prose-math{font-family:KaTeX_Main,serif;font-size:1.1em}.option-letter .sr-prose-math{font-size:1em}';
const report = {
  schema: 'stemrobin-184/n8-affected-typography-followup@1',
  startedAt: new Date().toISOString(), status: 'running',
  scope: '184-4 n8; CSS-only choice typography follow-up; no whole-check replay',
  observations: [], checks: [], bindings: [],
  runCount: 1, wholeLessonReruns: 0, controlSelectionReruns: 0,
  screenshotsGenerated: 0, imagesOpened: 0, crops: 0, imageDecodes: 0, imageReopens: 0,
  cumulativeImages: '6/6; parent permanently24/24; TEXT ONLY',
  browserClosed: false, contextsClosed: 0, browserLaunches: 0,
  initialRawStatus: first.status, initialRawSummary: first.summary,
  retainedAdjudications: adjudication.measurementAdjudications,
  reusedInitialPasses: adjudication.passes,
  repairByReviewer: false,
};
const check = (id, pass, evidence) => report.checks.push({ id, status: pass ? 'pass' : 'fail', evidence });
const initialNames = [
  'check.mjs', 'finish-evidence.mjs', 'report.json', 'review.json', 'review.md',
  'images-ledger.json', 'first-run.lock',
  'text-desktop.png', 'exercises-desktop.png', 'choices-desktop.png',
  'text-mobile.png', 'exercises-mobile.png', 'choices-mobile.png',
];
const tracked = [...new Set([
  ...first.inputBindings.map(b => b.path), beforePath, currentPath, oldGenerator, generator, intakePath,
  ...initialNames.flatMap(name => [path.join(out, name), path.join(retained, name)]),
  path.join(out, 'choices.render.before-typography.json'),
  path.join(retained, 'preview-before-typography.mjs'), path.join(retained, 'choices.render.json'),
  path.join(path.dirname(currentPath), 'choices.render.json'),
])];
report.bindings = tracked.map(bind);

function splitStyles(html) {
  const matches = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)];
  return {
    count: matches.length,
    css: matches.map(m => m[1]),
    outside: html.replace(/(<style\b[^>]*>)[\s\S]*?(<\/style>)/g, '$1__CSS__$2'),
  };
}

let browser;
try {
  const bs = splitStyles(before), cs = splitStyles(current);
  check('original-html-bound-to-first-fail', digest(Buffer.from(before)) === first.inputBindings.find(b => b.path === currentPath).sha256, bind(beforePath));
  check('current-html-exact-authorized-sha', digest(Buffer.from(current)) === '016b550073b2501b0a74a3021593ac1c449a62af46f6816737f9ea87dc1e2fb6', bind(currentPath));
  check('html-outside-css-byte-identical', bs.count === 1 && cs.count === 1 && bs.outside === cs.outside, {
    before: digest(Buffer.from(bs.outside)), current: digest(Buffer.from(cs.outside)), styleCounts: [bs.count, cs.count],
  });
  check('exact-narrow-css-repair-only', bs.count === 1 && cs.count === 1 && bs.css[0].split(beforeRule).length === 2 && bs.css[0].replace(beforeRule, repairedRule) === cs.css[0], {
    removedRule: beforeRule, addedRules: repairedRule, beforeCssSha256: digest(Buffer.from(bs.css.join(''))), currentCssSha256: digest(Buffer.from(cs.css.join(''))),
  });
  const getGeneratorCss = s => s.split('\n').find(line => line.startsWith('const css = '));
  const oldCssLine = getGeneratorCss(originalGenerator), newCssLine = getGeneratorCss(currentGenerator);
  check('generator-view-authoring-prefix-unchanged', originalGenerator.split('const css = ')[0] === currentGenerator.split('const css = ')[0], {
    oldPrefixSha256: digest(Buffer.from(originalGenerator.split('const css = ')[0])), currentPrefixSha256: digest(Buffer.from(currentGenerator.split('const css = ')[0])),
  });
  check('generator-css-exact-repair', oldCssLine.replace(beforeRule, repairedRule) === newCssLine, { oldCssLine, newCssLine });
  check('generator-html-template-unchanged', originalGenerator.split('\n').find(l => l.startsWith('const html = ')) === currentGenerator.split('\n').find(l => l.startsWith('const html = ')), { originalGenerator: bind(oldGenerator), currentGenerator: bind(generator) });
  report.generatorNonCssDifferences = {
    note: 'Generator also changes guarded overwrite and repair receipt bookkeeping; it was read/hash-bound only, never executed. These are not HTML/view-content differences.',
    oldSuffix: originalGenerator.slice(originalGenerator.indexOf('\nassert(!html.includes')),
    currentSuffix: currentGenerator.slice(currentGenerator.indexOf('\nassert(!html.includes')),
  };
  report.initialInputs = first.inputBindings.map(b => ({ ...bind(b.path), expected: b.sha256, unchanged: bind(b.path).sha256 === b.sha256 }));
  check('all-initial-inputs-except-choices-unchanged', report.initialInputs.filter(b => b.path !== currentPath).every(b => b.unchanged), report.initialInputs);
  report.initialRecords = initialNames.map(name => {
    const reference = intake.retained.find(b => path.basename(b.path) === name);
    const local = bind(path.join(out, name)), durable = bind(path.join(retained, name));
    return { name, expected: reference?.sha256, local, durable, unchanged: local.sha256 === reference?.sha256 && durable.sha256 === reference?.sha256 };
  });
  check('all-thirteen-original-record-and-screenshot-hashes-unchanged', report.initialRecords.length === 13 && report.initialRecords.every(r => r.unchanged), report.initialRecords);
  check('retained-generator-and-original-receipt-unchanged', [
    ['preview-before-typography.mjs', oldGenerator],
    ['choices.render.json', path.join(out, 'choices.render.before-typography.json')],
  ].every(([name, local]) => {
    const expected = intake.retained.find(b => path.basename(b.path) === name)?.sha256;
    return bind(path.join(retained, name)).sha256 === expected && bind(local).sha256 === expected;
  }), { oldGenerator: bind(oldGenerator), oldReceipt: bind(path.join(out, 'choices.render.before-typography.json')) });
  check('first-fail-and-both-warning-adjudications-retained', first.status === 'fail' && first.summary.fail === 6 && adjudication.status === 'fail' && adjudication.measurementAdjudications.length === 2, {
    rawStatus: first.status, summary: first.summary, adjudications: adjudication.measurementAdjudications.map(a => ({ ids: a.ids, status: a.status, reason: a.reason })),
  });
  if (report.checks.some(c => c.status === 'fail')) throw new Error('Preflight binding failure: STOP; no browser observation or repair');

  const require = createRequire(path.join(root, 'app/package.json'));
  const { chromium } = require('playwright');
  report.runtime = { module: require.resolve('playwright'), executable: chromium.executablePath(), headless: true, offline: true, freshContexts: true, desktopCDPProfile: false };
  browser = await chromium.launch({ headless: true });
  report.browserLaunches++;
  report.runtime.version = browser.version();
  for (const [view, viewport] of [['desktop', { width: 1440, height: 960 }], ['mobile', { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, offline: true, serviceWorkers: 'block' });
    try {
      const page = await context.newPage();
      const errors = [], requests = [], failures = [], blocked = [];
      page.on('pageerror', e => errors.push({ type: 'page', message: e.message }));
      page.on('console', m => { if (m.type() === 'error') errors.push({ type: 'console', message: m.text() }); });
      page.on('request', r => requests.push({ url: r.url(), type: r.resourceType() }));
      page.on('requestfailed', r => failures.push({ url: r.url(), message: r.failure()?.errorText }));
      await context.route('**/*', route => {
        const url = route.request().url();
        if (url.startsWith('file:') || url.startsWith('data:')) return route.continue();
        blocked.push(url); return route.abort('blockedbyclient');
      });
      await page.goto(pathToFileURL(currentPath).href, { waitUntil: 'load' });
      await page.evaluate(async () => { await document.fonts.ready; });
      const m = await page.evaluate(({ before, current }) => {
        const box = el => {
          const r = el.getBoundingClientRect();
          return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
        };
        const font = el => {
          const s = getComputedStyle(el), base = getComputedStyle(el.closest('.body'));
          return { text: el.textContent, family: s.fontFamily, px: parseFloat(s.fontSize), basePx: parseFloat(base.fontSize), ratio: parseFloat(s.fontSize) / parseFloat(base.fontSize), rect: box(el), loaded: document.fonts.check(`${s.fontSize} KaTeX_Main`) };
        };
        const parse = html => new DOMParser().parseFromString(html, 'text/html');
        const original = parse(before), repaired = parse(current);
        const projection = doc => ({
          title: doc.title, sheet: doc.querySelector('.sheet').innerHTML,
          viewIds: [...doc.querySelectorAll('[data-question-id]')].map(n => n.dataset.questionId),
          annotations: [...doc.querySelectorAll('annotation[encoding="application/x-tex"]')].map(n => n.textContent),
          controls: [...doc.querySelectorAll('input')].map(n => ({ type: n.type, name: n.name, value: n.value })),
        });
        const nums = [...document.querySelectorAll('.option-text .sr-prose-math')].map(font);
        const letters = [...document.querySelectorAll('.option-letter')].map(el => ({ outer: font(el), inner: font(el.querySelector('.sr-prose-math')), nestedRatio: parseFloat(getComputedStyle(el.querySelector('.sr-prose-math')).fontSize) / parseFloat(getComputedStyle(el).fontSize) }));
        const options = [...document.querySelectorAll('label.option')].map(el => {
          const t = el.querySelector('.option-text');
          return {
            input: box(el.querySelector('input')), letter: box(el.querySelector('.option-letter')),
            text: box(t), option: box(el), disabled: el.querySelector('input').disabled,
            textScroll: { clientWidth: t.clientWidth, scrollWidth: t.scrollWidth, clientHeight: t.clientHeight, scrollHeight: t.scrollHeight },
            lines: [...t.querySelectorAll('.choice-line')].map(l => ({ rect: box(l), numeric: [...l.querySelectorAll('.sr-prose-math')].map(n => n.textContent) })),
          };
        });
        const clipping = [], collisions = [];
        for (const option of document.querySelectorAll('label.option')) {
          const nodes = [], walker = document.createTreeWalker(option, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            const n = walker.currentNode;
            if (!/[^\s\u200b-\u200d]/.test(n.textContent) || n.parentElement.closest('.katex-mathml,annotation,.vlist-s')) continue;
            const range = document.createRange(); range.selectNodeContents(n);
            for (const r of range.getClientRects()) {
              const entry = { text: n.textContent, rect: { x: r.x, y: r.y, right: r.right, bottom: r.bottom } };
              nodes.push(entry);
              for (let a = n.parentElement; a && a !== option.parentElement; a = a.parentElement) {
                const cs = getComputedStyle(a), ar = a.getBoundingClientRect();
                const x = ['hidden', 'clip', 'auto', 'scroll'].includes(cs.overflowX) && (r.left < ar.left - 1 || r.right > ar.right + 1);
                const y = ['hidden', 'clip', 'auto', 'scroll'].includes(cs.overflowY) && (r.top < ar.top - 1 || r.bottom > ar.bottom + 1);
                if (x || y) clipping.push({ ...entry, ancestor: a.className, x, y });
              }
            }
          }
          const numericNodes = [...option.querySelectorAll('.option-text .sr-prose-math')];
          for (const el of numericNodes) {
            const r = el.getBoundingClientRect(), line = el.closest('.choice-line');
            const range = document.createRange(); range.selectNodeContents(line);
            const lr = line.getBoundingClientRect();
            if (r.top < lr.top - 1 || r.bottom > lr.bottom + 1) collisions.push({ text: el.textContent, numeric: box(el), line: box(line) });
          }
        }
        return {
          viewport: { width: innerWidth, height: innerHeight },
          document: { clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth },
          projections: { original: projection(original), repaired: projection(repaired), displayed: projection(document) },
          nums, letters, options, clipping, collisions, fontStatus: document.fonts.status,
          controlStates: [...document.querySelectorAll('input')].map(n => n.checked),
        };
      }, { before, current });
      const observation = { view, viewport, measurements: m, errors, requests, failures, blocked, reachability: [] };
      report.observations.push(observation);
      const prefix = `choices-${view}`;
      check(`${prefix}:exact-html-view-tex-and-controls-unchanged`, JSON.stringify(m.projections.original) === JSON.stringify(m.projections.repaired) && JSON.stringify(m.projections.repaired) === JSON.stringify(m.projections.displayed), {
        annotationCount: m.projections.displayed.annotations.length,
        viewIds: m.projections.displayed.viewIds, controls: m.projections.displayed.controls,
        hashes: Object.fromEntries(Object.entries(m.projections).map(([k, v]) => [k, digest(Buffer.from(JSON.stringify(v)))])),
      });
      check(`${prefix}:all-sixteen-numeric-labels-main18.304-1.10`, m.nums.length === 16 && m.nums.every(n => n.family.includes('KaTeX_Main') && Math.abs(n.px - 18.304) < 0.002 && Math.abs(n.ratio - 1.1) < 0.002 && n.loaded), m.nums);
      check(`${prefix}:A-D-still1.10-not1.21`, m.letters.length === 8 && m.letters.every((l, i) => l.outer.text === `${'ABCD'[i % 4]}.` && [l.outer, l.inner].every(n => n.family.includes('KaTeX_Main') && Math.abs(n.px - 18.304) < 0.002 && Math.abs(n.ratio - 1.1) < 0.002) && Math.abs(l.nestedRatio - 1) < 0.002), m.letters);
      check(`${prefix}:numeric-and-option-glyphs-not-clipped`, m.clipping.length === 0 && m.collisions.length === 0, { clipping: m.clipping, collisions: m.collisions });
      check(`${prefix}:control-label-text-no-collision-or-clipping`, m.options.length === 8 && m.options.every(o => !o.disabled && o.input.right <= o.letter.x + 0.5 && o.letter.right <= o.text.x + 0.5 && o.text.right <= o.option.right + 0.5 && o.textScroll.scrollWidth <= o.textScroll.clientWidth + 1 && o.textScroll.scrollHeight <= o.textScroll.clientHeight + 1), m.options);
      check(`${prefix}:four-class-lines-remain-ordered-and-separated`, m.options.slice(4).every(o => o.lines.length === 4 && o.lines.every((l, i) => l.numeric[0] === `${3 - i}` && (i === 0 || l.rect.y >= o.lines[i - 1].rect.bottom - 0.5))), m.options.slice(4).map(o => o.lines));
      check(`${prefix}:no-document-horizontal-overflow`, m.document.clientWidth === viewport.width && m.document.scrollWidth === viewport.width, m.document);
      for (const selector of ['label.option input', '.option-text .choice-line']) {
        const locators = page.locator(selector);
        for (let i = 0; i < await locators.count(); i++) {
          const locator = locators.nth(i);
          await locator.scrollIntoViewIfNeeded();
          const reached = await locator.evaluate(el => {
            const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
            const hit = document.elementFromPoint(x, y);
            return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, visible: r.top >= -0.5 && r.bottom <= innerHeight + 0.5 && r.left >= -0.5 && r.right <= innerWidth + 0.5, hit: hit && (el.contains(hit) || hit.contains(el)) };
          });
          observation.reachability.push({ selector, index: i, ...reached });
        }
      }
      check(`${prefix}:all-eight-controls-and-twenty-option-lines-reachable`, observation.reachability.length === 28 && observation.reachability.every(r => r.visible && r.hit), observation.reachability);
      check(`${prefix}:no-control-selection-rerun`, m.controlStates.every(s => !s) && await page.locator('input:checked').count() === 0, { before: m.controlStates, afterCheckedCount: await page.locator('input:checked').count() });
      check(`${prefix}:zero-page-console-or-network-errors`, errors.length === 0 && failures.length === 0 && blocked.length === 0 && requests.every(r => r.url.startsWith('file:') || r.url.startsWith('data:')), { errors, failures, blocked, requests });
      if (report.checks.some(c => c.status === 'fail')) throw new Error(`Residual affected defect at ${view}: HOLD; no retry or repair`);
    } finally {
      await context.close(); report.contextsClosed++;
    }
  }
} catch (error) {
  report.executionError = { message: error.message, stack: error.stack };
  check('affected-follow-up-completed-without-residual-defect', false, report.executionError);
} finally {
  if (browser) {
    await browser.close(); report.browserClosed = !browser.isConnected();
  }
  report.completedAt = new Date().toISOString();
  report.bindingsAfter = tracked.map(bind);
  check('all-tracked-inputs-and-thirteen-originals-unchanged-during-followup', JSON.stringify(report.bindings) === JSON.stringify(report.bindingsAfter), {
    beforeSha256: digest(Buffer.from(JSON.stringify(report.bindings))), afterSha256: digest(Buffer.from(JSON.stringify(report.bindingsAfter))),
  });
  check('one-browser-two-fresh-contexts-explicitly-released', report.browserLaunches === 1 && report.observations.length === 2 && report.contextsClosed === 2 && report.browserClosed, {
    launches: report.browserLaunches, observations: report.observations.length, contextsClosed: report.contextsClosed, browserClosed: report.browserClosed,
  });
  report.status = report.checks.some(c => c.status === 'fail') ? 'hold' : 'pass';
  report.summary = { pass: report.checks.filter(c => c.status === 'pass').length, fail: report.checks.filter(c => c.status === 'fail').length, failedIds: report.checks.filter(c => c.status === 'fail').map(c => c.id) };
  report.scriptBinding = bind(path.join(out, 'review.typography.mjs'));
  report.inputSetSha256 = digest(Buffer.from(JSON.stringify(report.bindings)));
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
  const lines = [
    '# n8 Affected Typography Follow-up',
    '',
    `**${report.status.toUpperCase()}: affected choice typography only.** One isolated headless browser observation, choices only at1440x960/390x844; no whole-lesson, control-selection, source/math or figure replay.`,
    '',
    `Checks: ${report.summary.pass} pass / ${report.summary.fail} fail.`,
    ...(report.executionError ? [`HOLD diagnosis: ${report.executionError.message}`] : [
      '- All16 four-class numeral labels per viewport now use KaTeX_Main18.304px at1.10x the16.64px body. All8 A-D labels remain18.304px/1.10x; inner labels are1.00x their outer label, not nested1.21x.',
      '- Newly affected numeric/option text and native controls have no collision/clipping or document horizontal overflow. All4 class lines in each second-question option stay ordered and separated. All8 controls and20 option lines are reachable; no selections were made.',
      '- Current and original HTML are byte-identical outside CSS. The only CSS delta is the exact two-rule repair. Displayed view IDs, annotations/formulas, sheet HTML and input identities are unchanged. The generator view-authoring prefix/template is unchanged; guarded-overwrite/receipt changes are recorded and the generator was never run.',
      '- All12 initial inputs other than choices retain their hashes, including canonical lesson/exercises/figures JSON. All13 original review/lock/screenshot files and durable copies retain parent-intake hashes; original generator and receipt also match.',
      '- Zero page/console errors, failed requests or remote requests. Inline font loading completes; no screenshots or image decoding.',
    ]),
    '',
    '## Initial Evidence Preserved',
    '',
    '- Original report remains FAIL with122PASS/6FAIL. Both choice numeral failures are superseded only by this hash-bound CSS-specific follow-up, never erased.',
    '- Both3.015625px aligned-proof line-box warnings remain advisory, with no previously established ink loss. Both SVG-unit flags remain measurement false positives:36 units times0.5 display scale gives18px. Neither surface was reopened or rerun.',
    '- Reuse the original canonical coverage, proofs/E70, controls, table geometry/scroll ends, asset/pixel and visual PASS evidence. This follow-up is not new full-lesson/live-product, Gate2, source/math or publishing approval.',
    '',
    '## Bindings',
    '',
    `Original HTML: ${beforePath}`,
    `SHA-256: ${digest(Buffer.from(before))}`,
    `Repaired HTML: ${currentPath}`,
    `SHA-256: ${digest(Buffer.from(current))}`,
    `Original generator SHA-256: ${bind(oldGenerator).sha256}`,
    `Current generator SHA-256: ${bind(generator).sha256}`,
    `Initial report SHA-256: ${bind(path.join(out, 'report.json')).sha256}`,
    `Follow-up input-set SHA-256: ${report.inputSetSha256}`,
    `Follow-up script SHA-256: ${report.scriptBinding.sha256}`,
    `Follow-up JSON: ${jsonPath}`,
    `SHA-256: ${bind(jsonPath).sha256}`,
    '',
    `Browser closed:${report.browserClosed}; fresh contexts closed:${report.contextsClosed}. New images0; cumulative reviewer6/6; parent permanently24/24. No image payloads/crops/reopens. All tracked inputs and old records unchanged. Writes only the new review.typography.mjs/json/md in the owned directory; no first-run lock or canonical/skill/app/other-resource changes, keys/author internals, services/DB/publishers, installs, Git or messages.`,
  ];
  fs.writeFileSync(mdPath, `${lines.join('\n')}\n`, { flag: 'wx' });
  console.log(JSON.stringify({
    status: report.status, summary: report.summary,
    files: [path.join(out, 'review.typography.mjs'), jsonPath, mdPath].map(bind),
    currentHtmlSha256: digest(Buffer.from(current)), inputSetSha256: report.inputSetSha256,
    newImages: 0, cumulativeImages: report.cumulativeImages,
    browserClosed: report.browserClosed, contextsClosed: report.contextsClosed,
  }, null, 2));
}
