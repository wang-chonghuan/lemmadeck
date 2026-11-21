import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root);
const reports = path.join(root, '.intentfold/tickets/STEMROBIN-181/evidence/reports');
const out = path.join(reports, 'd1816-d536-n97-affected-review');
const d534 = path.join(reports, 'd1816-d534-n97-fig223224-local-repair');
const d535 = path.join(reports, 'd1816-d535-n97-fig225-local-repair');
const prior = path.join(reports, 'd1238-current-progress');
const ids = ['fig-223', 'fig-224', 'fig-225'];
const inputBindings = new Map();
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = (file, expected) => {
  assert(file.startsWith(`${root}/`), `Outside authorized checkout: ${file}`);
  const bytes = fs.readFileSync(file);
  const value = { path: file, sha256: hash(bytes), bytes: bytes.length, hashVerified: true };
  if (expected) assert.equal(value.sha256, expected, `SHA mismatch: ${file}`);
  if (inputBindings.has(file)) assert.equal(value.sha256, inputBindings.get(file).sha256);
  inputBindings.set(file, value);
  return value;
};
const read = (file, expected) => {
  bind(file, expected);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
};
const text = file => {
  bind(file);
  return fs.readFileSync(file, 'utf8');
};
const localPrior = historic => {
  const marker = '/d1214-n97-fig223225-first-author/';
  assert(historic.includes(marker));
  return path.join(prior, 'd1214-n97-fig223225-first-author', historic.split(marker)[1]);
};
const observations = read(path.join(out, 'observations.json'));
const author534Binding = bind(path.join(d534, 'report.json'),
  '16f161dce1b2a24f8dc462678c0f98543c004336bab9e1607da5d1ce6166d166');
const author534 = read(author534Binding.path);
const browser534Binding = bind(path.join(d534, 'browser-evidence.json'));
const browser534 = read(browser534Binding.path);
const author535Binding = bind(path.join(d535, 'repair.json'));
read(author535Binding.path);
const width535Binding = bind(path.join(d535, 'width-check.json'));
const width535 = read(width535Binding.path);
const author535ObservationsBinding = bind(path.join(d535, 'author-observations.json'));
read(author535ObservationsBinding.path);
const firstBinding = bind(path.join(prior, 'd1226-n97-fig223225-first-independent-review/report.json'),
  'a399029c1510d778140ed12743d4955af99b7553c6a1ae4094815bd99a51167c');
const first = read(firstBinding.path);
const descriptorBinding = bind(path.join(prior, 'd1219-n97-rigid-rod-affected-review/report.json'),
  'fe1f8732330baf553943a44e19d42eb1695eade3d87b0eb1c6d570ebe88b0e0c');
const descriptor = read(descriptorBinding.path);
assert.equal(descriptor.status, 'PASS');
const approvedText = ['zh', 'en'].map(locale => {
  const file = path.join(prior, 'd1218-n97-rigid-rod-affected-repair', locale, 'lesson.template.json');
  const expected = descriptor.candidates.find(c => c.locale === locale && c.kind === 'lesson').current.sha256;
  return { locale, binding: bind(file, expected), template: read(file) };
});
const approvedSnapshot = approvedText.flatMap(({ template }) =>
  template.prose.filter(p => p.kind === 'p').map(p => ({ lesson: template.id, text: p.text })));
assert.equal(approvedSnapshot.length, 32);
const diff = (a, b, at = '') => {
  if (JSON.stringify(a) === JSON.stringify(b)) return [];
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object' ||
      Array.isArray(a) !== Array.isArray(b)) return [{ pointer: at, before: a ?? null, after: b ?? null }];
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(k =>
    diff(a[k], b[k], `${at}/${k.replaceAll('~', '~0').replaceAll('/', '~1')}`));
};
const figures = ids.map((id, i) => {
  const original = first.figures.find(f => f.id === id);
  const supplied = i < 2 ? author534.figures.find(f => f.id === id) : null;
  const screenshot = i < 2 ? browser534.figures.find(f => f.id === id).screenshot :
    { path: path.join(d535, 'candidate/display-640.png'), sha256: width535.screenshot.sha256 };
  const bindings = {
    source: bind(path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures', `${id}.png`),
      original.source.sha256),
    spec: supplied ? bind(supplied.changedSpec.path, supplied.changedSpec.sha256) : bind(path.join(d535, 'candidate/spec.json')),
    svg: supplied ? bind(supplied.svg.path, supplied.svg.sha256) : bind(path.join(d535, 'candidate/figure.svg')),
    render: supplied ? bind(supplied.nativeRender.path, supplied.nativeRender.sha256) : bind(path.join(d535, 'candidate/render.json')),
    screenshot: bind(screenshot.path, screenshot.sha256)
  };
  const previousBindings = Object.fromEntries(['spec', 'svg', 'render'].map(k =>
    [k, bind(localPrior(original.candidate[k].path), original.candidate[k].sha256)]));
  const spec = read(bindings.spec.path), oldSpec = read(previousBindings.spec.path);
  const render = read(bindings.render.path), oldRender = read(previousBindings.render.path);
  assert.equal(spec.source.image.sha256, bindings.source.sha256);
  assert.equal(path.resolve(root, spec.source.image.path), bindings.source.path);
  assert.equal(oldSpec.source.image.sha256, bindings.source.sha256);
  assert.equal(render.spec.sha256, bindings.spec.sha256);
  assert.equal(render.output.svg.sha256, bindings.svg.sha256);
  assert.equal(path.resolve(root, render.spec.path), bindings.spec.path);
  assert.equal(path.resolve(root, render.output.svg.path), bindings.svg.path);
  assert.equal(render.status, 'pass');
  assert.deepEqual(render.collisions, []);
  assert.deepEqual(render.displayChecks, oldRender.displayChecks);
  assert.equal(render.objects, oldRender.objects);
  assert.equal(render.labels, oldRender.labels);
  assert.equal(oldRender.status, 'fail');
  assert.deepEqual(spec.source.authoritativeText, approvedSnapshot);
  const changedLabels = i === 0 ? ['k-x-tip', 'k1-x-tip'] :
    i === 1 ? ['k1-x-tip', 'rod-a'] : ['k-x-tip', 'k1-x-tip', 'rod-a', 'rod-b'];
  const allowed = ['/source/image/path', '/source/authoritativeText/0/text', '/source/authoritativeText/16/text',
    ...changedLabels.map(label => `/objects/${spec.objects.findIndex(o => o.id === label)}/labelPlacement/${label.startsWith('rod-') ? 'offset' : 'gap'}`)];
  const changes = diff(oldSpec, spec);
  assert.deepEqual(changes.map(c => c.pointer).sort(), allowed.sort());
  for (const label of changedLabels) {
    const placement = spec.objects.find(o => o.id === label).labelPlacement;
    const oldPlacement = oldSpec.objects.find(o => o.id === label).labelPlacement;
    if (label.startsWith('rod-')) {
      assert.deepEqual(placement.offset, i === 1 ? [6, 0] : [0, -24]);
      assert.equal(placement.position, oldPlacement.position);
      assert.equal(placement.gap, oldPlacement.gap);
    } else {
      assert.equal(oldPlacement.gap, 22);
      assert.equal(placement.gap, 24);
      assert.equal(placement.position, 'S');
    }
  }
  return { id, bindings, previousBindings, spec, render, original, changes, changedLabels };
});

const cssPath = path.join(root, 'app/src/styles/app.css');
const css = text(cssPath);
const cssRule = (selector, start = 0) => {
  const from = css.indexOf(selector, start);
  assert(from >= 0, selector);
  return css.slice(from, css.indexOf('}', from) + 1);
};
const rootStart = css.lastIndexOf(':root {', css.indexOf('--sr-white:'));
const printStart = css.indexOf('@media print');
const productCss = [
  css.slice(rootStart, css.indexOf('}', rootStart) + 1),
  cssRule('.sr-figure-media {'),
  cssRule('.sr-figure-media[data-figure-theme="accent"] {'),
  cssRule('.sr-figure-media svg,'),
  cssRule('.sr-read-fig[data-figure-layout="scroll"],'),
  cssRule('.sr-read-fig[data-figure-layout="scroll"] .sr-figure-media,'),
  `@media print {${cssRule('.sr-print-lesson .sr-figure-media {', printStart)}}`
].join('\n');
const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
const playwrightModule = path.join(root, 'app/node_modules/playwright/index.js');
bind(playwrightModule);
bind(path.join(root, 'app/playwright.config.ts'));
const executablePath = browser534.executable;
assert(fs.existsSync(executablePath));
delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = 'never';
const themeEvidence = {
  schema: 'stemrobin/affected-figure-readonly-theme-dom@1',
  headless: true, isolatedContext: true, fixedMediaWidthPx: 640,
  scope: 'Candidate SVG DOM, changed-label clearance and role contrast only; not full course DISPLAY, print layout, or product acceptance.',
  css: bind(cssPath), exactRoleCssExcerpt: productCss, excerptSha256: hash(productCss),
  playwrightModule, executable: executablePath,
  nativeRendererReruns: 0, screenshotsCreated: 0, imagesOpened: 0,
  networkAttempts: [], pageErrors: [], browserClosed: false, figures: []
};
const browser = await chromium.launch({ executablePath, headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
  await context.route('**/*', route => route.abort());
  const page = await context.newPage();
  page.on('request', r => themeEvidence.networkAttempts.push(r.url()));
  page.on('pageerror', e => themeEvidence.pageErrors.push(String(e)));
  for (const figure of figures) {
    const svg = text(figure.bindings.svg.path), oldSvg = text(figure.previousBindings.svg.path);
    const svgChanges = await page.evaluate(({ svg, oldSvg }) => {
      const parse = s => new DOMParser().parseFromString(s, 'image/svg+xml').documentElement;
      const changes = [];
      const walk = (a, b) => {
        if (a.nodeType !== b.nodeType || a.nodeName !== b.nodeName) throw new Error('SVG structure changed');
        if (a.nodeType === 1) {
          const names = new Set([...a.getAttributeNames(), ...b.getAttributeNames()]);
          for (const name of names) if (a.getAttribute(name) !== b.getAttribute(name))
            changes.push({ label: b.getAttribute('data-label-id'), attribute: name,
              before: a.getAttribute(name), after: b.getAttribute(name) });
        } else if (a.nodeValue !== b.nodeValue) throw new Error('SVG text changed');
        if (a.childNodes.length !== b.childNodes.length) throw new Error('SVG node count changed');
        for (let i = 0; i < a.childNodes.length; i++) walk(a.childNodes[i], b.childNodes[i]);
      };
      walk(parse(oldSvg), parse(svg));
      return changes;
    }, { svg, oldSvg });
    const expectedSvgChanges = figure.changedLabels.map(id => ({
      label: `${id}-label`, attribute: figure.id === 'fig-224' && id === 'rod-a' ? 'x' : 'y',
      delta: id.startsWith('rod-') ? (figure.id === 'fig-224' ? 6 : -24) : 2
    }));
    assert.equal(svgChanges.length, expectedSvgChanges.length);
    for (const expected of expectedSvgChanges) {
      const actual = svgChanges.find(c => c.label === expected.label);
      assert(actual);
      assert.equal(actual.attribute, expected.attribute);
      assert.equal(Number(actual.after) - Number(actual.before), expected.delta);
    }
    const record = { id: figure.id, svg: figure.bindings.svg, svgChanges, themes: [] };
    for (const theme of ['accent', 'print']) {
      await page.emulateMedia({ media: theme === 'print' ? 'print' : 'screen' });
      await page.setContent(`<!doctype html><html><head><style>${productCss}
html,body{margin:0;font-size:16px;background:var(--sr-white)}
main{width:640px}figure{margin:0}
</style></head><body><main class="${theme === 'print' ? 'sr-print-lesson' : ''}">
<figure class="sr-read-fig" data-figure-layout="scroll"><span class="sr-figure-media" data-figure-theme="accent">${svg}</span></figure>
</main></body></html>`, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const state = await page.evaluate(changedLabels => {
        const svg = document.querySelector('svg'), media = document.querySelector('.sr-figure-media');
        const rect = r => ({ x: r.x, y: r.y, width: r.width, height: r.height });
        const inflate = r => ({ x: r.x - 4, y: r.y - 4, width: r.width + 8, height: r.height + 8 });
        const area = (a, b) => Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)) *
          Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
        const lum = color => {
          const rgb = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(v => {
            const s = v / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
          });
          return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
        };
        const contrast = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
        const paper = getComputedStyle(document.body).backgroundColor;
        const allLabels = [...svg.querySelectorAll('text')].map(n => {
          const s = getComputedStyle(n), matrix = n.getScreenCTM(), bbox = rect(n.getBBox());
          return { id: n.getAttribute('data-label-id'), text: n.textContent, bbox, padded: inflate(bbox),
            px: parseFloat(s.fontSize) * Math.hypot(matrix.a, matrix.b), fill: s.fill,
            contrastOnPaper: contrast(s.fill, paper), visible: s.visibility === 'visible' && s.display !== 'none' };
        });
        const geometry = [...svg.querySelectorAll('path,line,polyline,polygon,circle,ellipse,rect')]
          .filter(n => !n.closest('defs') && getComputedStyle(n).display !== 'none');
        const hits = r => geometry.filter(n => {
          const s = getComputedStyle(n);
          if (s.visibility !== 'visible' || s.stroke === 'none' || parseFloat(s.strokeWidth) <= 0 ||
              typeof n.getTotalLength !== 'function') return false;
          const length = n.getTotalLength(), matrix = n.getCTM(), padding = parseFloat(s.strokeWidth) / 2;
          const samples = Math.max(2, Math.ceil(length));
          for (let i = 0; i <= samples; i++) {
            const p = n.getPointAtLength(length * i / samples);
            const q = new DOMPoint(p.x, p.y).matrixTransform(matrix);
            if (q.x >= r.x - padding && q.x <= r.x + r.width + padding &&
                q.y >= r.y - padding && q.y <= r.y + r.height + padding) return true;
          }
          return false;
        }).map(n => n.id);
        const labels = allLabels.filter(l => changedLabels.includes(l.id.replace(/-label$/, ''))).map(l => ({
          ...l, paddedLabelOverlaps: allLabels.filter(o => o.id !== l.id && area(l.padded, o.padded) > 0).map(o => o.id),
          actualStrokeHits: hits(l.bbox)
        }));
        const strokes = geometry.filter(n => ['k-x-axis', 'k1-x-axis'].some(id => n.id.endsWith(`_ld-${id}`)))
          .map(n => ({ id: n.id, color: getComputedStyle(n).stroke,
            contrastOnPaper: contrast(getComputedStyle(n).stroke, paper) }));
        const pair = (a, b) => {
          const p = allLabels.find(l => l.id === a), q = allLabels.find(l => l.id === b);
          return p && q ? { a, b, paddedOverlapArea: area(p.padded, q.padded),
            horizontalGap: Math.max(0, q.bbox.x - p.bbox.x - p.bbox.width, p.bbox.x - q.bbox.x - q.bbox.width),
            verticalGap: Math.max(0, q.bbox.y - p.bbox.y - p.bbox.height, p.bbox.y - q.bbox.y - q.bbox.height) } : null;
        };
        return { width: svg.getBoundingClientRect().width, paper, labels,
          minTextPx: Math.min(...allLabels.map(l => l.px)),
          minTextContrast: Math.min(...allLabels.map(l => l.contrastOnPaper)),
          allTextVisible: allLabels.every(l => l.visible), horizontalAxisStrokes: strokes,
          originRodSeparation: pair('k1-origin-label', 'rod-a-label'),
          roles: Object.fromEntries(['ink', 'muted', 'accent', 'accent-soft', 'grid', 'paper']
            .map(k => [k, getComputedStyle(media).getPropertyValue(`--ld-figure-${k}`).trim()])) };
      }, figure.changedLabels);
      assert.equal(state.width, 640);
      assert.equal(state.labels.length, figure.changedLabels.length);
      assert(state.minTextPx >= 16 && state.minTextContrast >= 4.5 && state.allTextVisible);
      for (const label of state.labels) {
        assert.deepEqual(label.paddedLabelOverlaps, []);
        assert.deepEqual(label.actualStrokeHits, []);
        assert(label.padded.x >= 0 && label.padded.x + label.padded.width <= 640);
        assert(label.padded.y >= 0 && label.padded.y + label.padded.height <= figure.spec.canvas.height);
      }
      assert(state.horizontalAxisStrokes.every(s => s.contrastOnPaper >= 3));
      if (theme === 'print') assert.equal(state.roles.accent, state.roles.ink);
      record.themes.push({ theme, status: 'PASS-SCOPED-DOM-AND-CONTRAST', ...state });
    }
    assert.deepEqual(record.themes[0].labels.map(l => l.bbox), record.themes[1].labels.map(l => l.bbox));
    themeEvidence.figures.push(record);
  }
  await context.close();
} finally {
  await browser.close();
  themeEvidence.browserClosed = true;
}
assert.deepEqual(themeEvidence.networkAttempts, []);
assert.deepEqual(themeEvidence.pageErrors, []);
for (const binding of [...inputBindings.values()]) bind(binding.path, binding.sha256);
const writeNew = (name, value) => {
  const file = path.join(out, name);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return bind(file);
};
const themeBinding = writeNew('theme-checks.json', themeEvidence);
const report = {
  schema: 'stemrobin/affected-independent-figure-review@1',
  ticket: 'STEMROBIN-181', stage: 'D536', card: 'phy10-c2-s4-n97',
  cwd: root, ownershipRoot: out, completedAt: new Date().toISOString(),
  role: 'Sole independent affected-figure reviewer', reviewerIsAuthor: false,
  status: 'PASS', findings: [],
  scope: 'Changed labels and exact approved authoritativeText snapshot bindings in fig223/224/225 only. One source-before-candidate six-image batch; no full inventory, physics, text, course or global review.',
  authority: 'User-authorized existing STEMROBIN-181 continuation under one-independent-review-per-new-figure/affected-only correction rule; not a new capability invocation.',
  inheritedAuthorities: { independentFigureReview: firstBinding, descriptorReview: descriptorBinding,
    approvedTemplates: approvedText.map(t => ({ locale: t.locale, ...t.binding })) },
  authorEvidence: { d534: author534Binding, browser534: browser534Binding,
    d535: author535Binding, width535: width535Binding, author535Observations: author535ObservationsBinding },
  figures: figures.map(f => {
    const observed = observations.figures.find(o => o.id === f.id);
    const theme = themeEvidence.figures.find(o => o.id === f.id);
    return {
      id: f.id, status: 'PASS', bindings: f.bindings,
      observations: { originalScopedComparison: observed.originalScopedComparison,
        candidateScopedObservation: observed.candidateScopedObservation, unchangedContent: observed.unchangedContent,
        actualImageOpens: 2, sourceReadBeforeCorrespondingCandidate: true },
      changedLabelApproval: { ...observed.changedLabelApproval, svgAttributeChanges: theme.svgChanges,
        scopedDOMClearance: theme.themes[0].labels, originRodSeparation: theme.themes[0].originRodSeparation },
      inheritedGeometryAndOpticalPass: {
        authority: firstBinding, priorBindingsReboundToThisCheckoutAtSameHashes: f.previousBindings,
        sourceFidelity: f.original.gates.independentSourceFidelity,
        relationships: f.original.gates.sourceRelationshipSemantics,
        mathematicalOpticalTiming: f.original.gates.mathematicalOpticalTiming,
        modernClockAndEventAdditions: f.original.gates.modernClockAndEventAdditions,
        language: f.original.gates.culturalAndVisibleLabelLanguage,
        exactAllowedSpecDeltas: f.changes, geometryInventoryAssertionsCanvasDisplayUnchanged: true,
        svgGeometryAndTextUnchangedExceptDeclaredLabelCoordinates: true,
        fullSourceInventoryRebuilt: false, fullPhysicsOrOpticalReviewReplayed: false,
        historicalWholeQualityGate: f.original.gates.wholeQualityGate, historicalFailAndRepair1Preserved: true
      },
      authoritativeTextBinding: {
        status: 'PASS-EXACT-APPROVED-SNAPSHOT', descriptorAuthority: descriptorBinding,
        templates: approvedText.map(t => ({ locale: t.locale, ...t.binding })),
        extraction: "zh then en; template.prose.filter(p => p.kind === 'p'), mapped to {lesson: template.id, text: p.text}",
        snapshotCount: 32, openingIndices: [0, 16],
        openingTextExactlyApproved: true, all32EntriesStrictDeepEqualApprovedParagraphs: true,
        allOther30EntriesUnchangedFromD1226BoundSpec: true,
        descriptorOnlyTextChanges: true, sourcePathCorrectionAtIdenticalSHA: true,
        newFullProseReview: false
      },
      nativeEvidence: { binding: f.bindings.render, status: f.render.status, collisions: f.render.collisions,
        objects: f.render.objects, labels: f.render.labels, displayChecks: f.render.displayChecks,
        nativeRendererRerunByReviewer: false },
      themeChecks: { neutral: { status: 'PASS-AFFECTED-LABEL-VISUAL', screenshot: f.bindings.screenshot,
          fixedWidthPx: 640, actualImageOpened: true },
        accent: theme.themes[0], print: theme.themes[1], evidence: themeBinding,
        scope: themeEvidence.scope, fullCourseDisplayApproval: false, fullPrintLayoutApproval: false }
    };
  }),
  imageOpenLedger: observations.imageOpenOrder.map(o => ({
    ...o, ...figures.find(f => f.id === o.figure).bindings[o.kind === 'canonical-original' ? 'source' : 'screenshot'],
    tool: 'functions.view_image', actualOpen: true
  })),
  imageOpenCount: 6, sameActualContextImageCount: 6, imageBatchLimit: 8, imageContextLimit: 24,
  imageOpenLedgerMethod: 'The six actual view_image calls in this reviewer context, in order. Browser DOM parsing did not open images or produce screenshots.',
  boundaries: {
    historicalFAILAndRepair1Untouched: true, noWholeCourseApproval: true, wholeCardPass: false,
    noBlanketReviewAt1Written: true, canonicalEdits: 0, promotionPerformed: false,
    formalFigureMetadataComposition: 'Parent-owned; this report supplies affected PASS only. Existing native PASS is separately hash-verified, not rerun.',
    unresolvedGlobalHoldsNotLifted: ['N75', 'N78', 'exercise14', 'N153', 'probability', 'paidfig181'],
    retryPolicy: 'No arbitrary retry limit is introduced as a permanent new human gate.'
  },
  usage: { actualImagesOpened: 6, crops: 0, reopens: 0, screenshotsCreated: 0,
    nativeRendererRuns: 0, fullPhysicsReviews: 0, fullSourceInventoryRebuilds: 0,
    globalTestsOrAudits: 0, paidCalls: 0, databaseOperations: 0, networkRequests: 0,
    gitOperations: 0, otherAgentsChatsWorktreesBranchesOrMessages: 0,
    modelQuotaCredentialChanges: 0, canonicalEdits: 0, writesOutsideOwnershipRoot: 0,
    isolatedHeadlessBrowserLaunches: 1, taskOwnedBrowserClosed: true },
  inputBindingsUnchangedAtFinish: true,
  executionNotes: ['The first verifier invocation stopped before browser launch or generated evidence because its lexical ownership guard rejected the app dependency realpath. The verifier now binds that same existing app-installed Playwright through this checkout app/node_modules path. No dependency, configuration, or input artifact was changed.'],
  inputBindings: [...inputBindings.values()],
  writes: ['observations.json', 'verify-and-record.mjs', 'theme-checks.json', 'report.json'].map(n => path.join(out, n)),
  summary: 'Affected PASS for fig223 X/X1, fig224 X1/A, fig225 X/X1/A/B and all three exact approved authoritativeText snapshots. Six actual image opens independently confirm attribution and clearance. Geometry, optical timing, additions and language PASS are inherited only. Historical failures and all unrelated HOLD boundaries remain.'
};
bind(path.join(out, 'verify-and-record.mjs'));
report.inputBindings = [...inputBindings.values()];
const reportBinding = writeNew('report.json', report);
console.log(JSON.stringify({ status: report.status, findings: report.findings, report: reportBinding,
  themeEvidence: themeBinding, imageOpenCount: 6, browserClosed: themeEvidence.browserClosed }, null, 2));
