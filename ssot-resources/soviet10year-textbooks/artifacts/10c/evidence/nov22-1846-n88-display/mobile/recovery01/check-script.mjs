import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
const script = fileURLToPath(import.meta.url);
const originalScript = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp/nov22-n88-mobile-display.mjs');
const base = path.join(root, '.tmp/stemrobin-184-six/n88-draft-display');
const original = path.join(base, 'mobile');
const out = path.join(original, 'recovery01');
const viewport = { width: 390, height: 844 };
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const write = (name, value) => fs.writeFileSync(path.join(out, name),
  typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const scope = {
  ticket: 'STEMROBIN-184/184-6', invocation: 'SAME; affected-only technical recovery01',
  subject: 'Four affected NEW MOBILE draft figures and outstanding endpoint views',
  viewport, headed: true, initialFailurePreserved: true,
  change: 'Exclude actual display:none/visibility:hidden helper geometry from visible bounds only',
  excluded: ['renderer changes', 'HTML changes', 'SVG changes', 'spec changes', 'content changes',
    'prose workflow replay', 'exercise workflow replay', 'navigation replay', 'app', 'DB', 'keyboard',
    'grading', 'choices', 'answer disclosures', 'source/crop/math review', 'whole lesson approval',
    'original images', 'other previews', 'installs', 'services', 'Git', 'backend', 'publication', 'formal defence'],
};
const usage = {
  chargesCarried: 74, paidGenerationCalls: 0, hiddenFees: 'UNKNOWN', completeLessons: 0,
  parentImagesThisRecovery: 0, parentImagesUsedPreviously: 24, parentImagesCeiling: 24,
  parentBudgetPermanentlyExhausted: true, previousCaptures: 0, previousModelViews: 0,
  sharedNativeCaptureCeiling: 8, sharedModelViewCeiling: 8, creationInclusiveCeiling: 16,
  resets: 0, originals: 0, composites: 0, reopens: 0, otherImageOperations: 0,
};
const anchors = {
  'final-report.json': 'c07b6e2dfbc847152bd07779ae19e591c423c0e82303c9f392c6362b3cca0050',
  'ledger.json': 'f29a5301316743db2a138bdceddb5adf123e343cb8553052e730044fe41c39e8',
  'visual-observations.json': '68e04d0f1544d91e5b4889fc63d42aee191e941efdcfd17c86a83f8243bceafb',
  'execution.json': '09d639213c5a750c24f512be40aaab71a7795ae8ead3902022a0d01c1f031356',
  'browser-evidence.json': '16023886c0d99f6dbe6c7768928a3a61ada2303012e398df4956678c074ea092',
};

async function supervise() {
  assert.equal(process.cwd(), path.join(root, 'app'));
  assert(!fs.existsSync(out), 'No recovery replay or overwrite');
  const preserved = [bind(originalScript), ...fs.readdirSync(original, { withFileTypes: true })
    .filter(x => x.isFile()).map(x => bind(path.join(original, x.name)))];
  for (const [name, hash] of Object.entries(anchors)) {
    assert.equal(bind(path.join(original, name)).sha256, hash, 'Original receipt binding: ' + name);
  }
  assert.equal(bind(originalScript).sha256, '94ee272a994e1cc82d0e83e08eeb6a0d46e4270f1d6d1d7367b1638625aded59');
  fs.mkdirSync(out);
  write('preserved-originals.json', { schema: 'stemrobin1846/n88-recovery-preserved@1', files: preserved });
  const startedAt = new Date().toISOString();
  const stdout = [], stderr = [];
  const argv = [script, '--browser'];
  let launchError = null;
  const child = spawn(process.execPath, argv, { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.on('data', chunk => { stdout.push(chunk); process.stdout.write(chunk); });
  child.stderr.on('data', chunk => { stderr.push(chunk); process.stderr.write(chunk); });
  child.on('error', error => { launchError = error.stack; });
  const result = await new Promise(resolve => child.on('close',
    (exitCode, signal) => resolve({ exitCode, signal })));
  write('browser.stdout.txt', Buffer.concat(stdout).toString('utf8'));
  write('browser.stderr.txt', Buffer.concat(stderr).toString('utf8'));
  write('execution.json', {
    schema: 'stemrobin1846/n88-recovery-execution@1', scope, startedAt, endedAt: new Date().toISOString(),
    command: process.execPath, argv, supervisorArgv: process.argv, cwd: process.cwd(),
    script: bind(script), ...result, launchError, childClosed: true, backgroundServers: 0,
    streams: { stdout: bind(path.join(out, 'browser.stdout.txt')),
      stderr: bind(path.join(out, 'browser.stderr.txt')) },
    originalFailure: bind(path.join(original, 'execution.json')),
  });
  process.exitCode = result.exitCode ?? 1;
}

async function runBrowser() {
  assert.equal(process.cwd(), path.join(root, 'app'));
  assert(fs.existsSync(out) && !fs.existsSync(path.join(out, 'browser-evidence.json')), 'No replay');
  const preserved = read(path.join(out, 'preserved-originals.json')).files;
  const previous = read(path.join(original, 'browser-evidence.json'));
  const evidence = {
    schema: 'stemrobin1846/n88-mobile-recovery-browser@1', scope, usage, status: 'RUNNING',
    startedAt: new Date().toISOString(), argv: process.argv, cwd: process.cwd(), script: bind(script),
    originalFailure: Object.keys(anchors).map(name => bind(path.join(original, name))),
    inputs: [], figures: [], captures: [], checks: [], failures: [],
    console: [], pageErrors: [], requests: [], requestFailures: [],
    actions: { goto: 0, scrollIntoView: 0, mouseMoves: 0, horizontalWheel: 0,
      screenshotsAttempted: 0, screenshotsCreated: 0, programmaticHorizontalScroll: 0,
      linkClicks: 0, verticalWheel: 0, proseParityWorkflows: 0, exerciseParityWorkflows: 0,
      navigationWorkflows: 0, keyboard: 0, disclosures: 0, choices: 0, inputs: 0 },
    closure: { browserClosed: false, contextClosed: false, pagesClosed: false },
    reusedPassEvidence: {
      receipt: bind(path.join(original, 'browser-evidence.json')),
      prose38: previous.checks.find(x => x.name === 'All proseFlow and text layout'),
      exercises34: previous.checks.find(x => x.name === 'All 34 exercises semantic parity, groups and layout'),
      nativeNavigation: previous.checks.filter(x => /Real (text to written|written to text) link navigation/.test(x.name)),
      textFonts: previous.text.fonts, writtenFonts: previous.written.fonts,
      textOverflow: previous.text.pageOverflow, writtenOverflow: previous.written.pageOverflow,
      pageErrors: previous.pageErrors, console: previous.console,
      replayed: false,
    },
  };
  let browser, context, page;
  const check = (name, pass, details) => {
    evidence.checks.push({ name, pass: Boolean(pass), details });
    if (!pass) evidence.failures.push({ name, details });
    assert(pass, name);
  };
  const preserveCheck = item => {
    const current = bind(item.path);
    check('Unchanged binding: ' + item.path, current.sha256 === item.sha256, current);
    return current;
  };
  try {
    preserved.forEach(preserveCheck);
    check('Previous shared image usage is zero', previous.actions.screenshotsCreated === 0
      && read(path.join(original, 'visual-observations.json')).actualFunctionsViewImageCalls === 0, usage);
    check('Reuse established PASS workflows', evidence.reusedPassEvidence.prose38.pass
      && evidence.reusedPassEvidence.exercises34.pass
      && evidence.reusedPassEvidence.nativeNavigation.length === 2
      && evidence.reusedPassEvidence.nativeNavigation.every(x => x.pass), { replayed: false });
    evidence.inputs = previous.inputs.map(preserveCheck);
    const manifest = read(path.join(base, 'manifest.json'));
    const lessonItem = manifest.sourceTextAndSvgCopies.find(x => /\/lesson\.json$/.test(x.snapshot.path));
    const lesson = read(path.resolve(root, lessonItem.snapshot.path));
    const figures = lesson.prose.filter(x => x.kind === 'fig');
    const affected = previous.figures.filter(x => x.status === 'FAIL_AFFECTED_DEPENDENCY_STOPPED');
    check('Exactly four affected figures, current inputs derive same targets', affected.length === 4
      && figures.length === affected.length && figures.every((x, i) => x.id === affected[i].id),
    figures.map(x => ({ id: x.id, label: x.label })));
    const require = createRequire(path.join(root, 'app/package.json'));
    const { chromium } = require('playwright');
    evidence.dependencies = [bind(path.join(root, 'app/package.json')), bind(require.resolve('playwright'))];
    browser = await chromium.launch({ channel: 'chrome', headless: false });
    evidence.browser = { channel: 'chrome', headless: false, version: browser.version(), viewport };
    context = await browser.newContext({ viewport, deviceScaleFactor: 1, serviceWorkers: 'block' });
    await context.route('**/*', route => {
      const url = route.request().url(), allowed = /^(file|data|blob):/.test(url);
      evidence.requests.push({ url: url.startsWith('data:') ? 'data:[embedded]' : url, allowed });
      return allowed ? route.continue() : route.abort('blockedbyclient');
    });
    page = await context.newPage();
    page.setDefaultTimeout(10000);
    page.on('console', message => evidence.console.push({ type: message.type(), text: message.text() }));
    page.on('pageerror', error => evidence.pageErrors.push(error.stack));
    page.on('requestfailed', request => evidence.requestFailures.push({ url: request.url(),
      failure: request.failure() }));
    const text = manifest.outputs.find(x => x.path.endsWith('/text.html'));
    evidence.actions.goto++;
    await page.goto(pathToFileURL(path.resolve(root, text.path)).href, { waitUntil: 'load' });
    // Observe only affected SVG font completion, not the already-passed prose/exercise workflows.
    evidence.figureFontCompletion = await page.evaluate(async () => {
      await document.fonts.ready;
      const samples = new Map();
      for (const node of document.querySelectorAll('.figure-media text')) {
        const s = getComputedStyle(node), font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
        samples.set(font, (samples.get(font) || '') + node.textContent);
      }
      for (const [font, text] of samples) await document.fonts.load(font, text);
      await document.fonts.ready;
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      return { status: document.fonts.status,
        missing: [...samples].filter(([font, text]) => !document.fonts.check(font, text)).map(([font]) => font) };
    });
    check('Affected figure fonts complete', evidence.figureFontCompletion.status === 'loaded'
      && evidence.figureFontCompletion.missing.length === 0, evidence.figureFontCompletion);
    for (const figure of figures) {
      const record = { id: figure.id, label: figure.label, status: 'RUNNING', wheel: [] };
      evidence.figures.push(record);
      const element = page.getByRole('figure', { name: figure.label, exact: true });
      try {
        check('No external requests or browser errors before ' + figure.id,
          evidence.pageErrors.length === 0 && !evidence.console.some(x => x.type === 'error')
          && !evidence.requests.some(x => !x.allowed), { pageErrors: evidence.pageErrors, console: evidence.console });
        evidence.actions.scrollIntoView++;
        await element.scrollIntoViewIfNeeded();
        record.before = await element.evaluate(el => {
          const svg = el.querySelector('.figure-media > svg'), media = el.querySelector('.figure-media');
          const rootBox = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
          const box = n => { const r = n.getBoundingClientRect(); return {
            x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom }; };
          const inside = b => b.x >= rootBox.x - 1 && b.right <= rootBox.right + 1
            && b.y >= rootBox.y - 1 && b.bottom <= rootBox.bottom + 1;
          const labels = [...svg.querySelectorAll('text')].map(n => {
            const m = n.getScreenCTM(), sum = m.a ** 2 + m.b ** 2 + m.c ** 2 + m.d ** 2;
            const determinant = m.a * m.d - m.b * m.c;
            const scale = Math.sqrt((sum - Math.sqrt(Math.max(0, sum ** 2 - 4 * determinant ** 2))) / 2);
            const b = box(n), s = getComputedStyle(n);
            return { id: n.id, text: n.textContent, bounds: b, insideCanvas: inside(b),
              scale, cssFontSize: parseFloat(s.fontSize), actualTextPx: parseFloat(s.fontSize) * scale,
              font: s.fontFamily, transform: { a: m.a, b: m.b, c: m.c, d: m.d, e: m.e, f: m.f } };
          });
          const excludedHiddenHelpers = [], objects = [];
          for (const n of svg.querySelectorAll('path,line,polyline,polygon,rect,circle,ellipse')) {
            if (n.closest('defs,clipPath,marker,mask')) continue;
            // Only actual CSS-hidden geometry is excluded. Zero size never exempts a visible object.
            let hiddenAncestor = null;
            for (let ancestor = n; ancestor; ancestor = ancestor.parentElement) {
              const s = getComputedStyle(ancestor);
              if (s.display === 'none') { hiddenAncestor = ancestor.id || ancestor.tagName; break; }
            }
            const s = getComputedStyle(n);
            if (hiddenAncestor || s.visibility === 'hidden') {
              excludedHiddenHelpers.push({ id: n.id, tag: n.tagName, display: s.display,
                visibility: s.visibility, hiddenAncestor, bounds: box(n) });
              continue;
            }
            const b = box(n);
            objects.push({ id: n.id, tag: n.tagName, bounds: b, insideCanvas: inside(b),
              display: s.display, visibility: s.visibility, clipPath: s.clipPath,
              stroke: s.stroke, strokeWidth: s.strokeWidth, fill: s.fill });
          }
          const caption = el.querySelector('figcaption');
          return { viewport: { width: innerWidth, height: innerHeight }, mediaWidth: media.getBoundingClientRect().width,
            svg: box(svg), viewBox: { x: vb.x, y: vb.y, width: vb.width, height: vb.height },
            labels, objects, excludedHiddenHelpers,
            minTextPx: Math.min(...labels.map(x => x.actualTextPx)),
            outsideLabels: labels.filter(x => !x.insideCanvas), outsideVisibleObjects: objects.filter(x => !x.insideCanvas),
            caption: { text: caption?.textContent, bounds: caption && box(caption) },
            layout: el.dataset.figureLayout, figure: box(el),
            clientWidth: el.clientWidth, scrollWidth: el.scrollWidth, scrollLeft: el.scrollLeft,
            end: el.scrollWidth - el.clientWidth, pageScrollX: scrollX };
        });
        const before = record.before;
        check(figure.id + ' actual 640px media and visible canvas bounds',
          before.viewport.width === 390 && before.viewport.height === 844
          && before.mediaWidth === 640 && before.layout === 'scroll' && before.objects.length > 0
          && before.labels.length > 0 && before.minTextPx >= 16 && before.outsideLabels.length === 0
          && before.outsideVisibleObjects.length === 0 && before.scrollLeft === 0 && before.end > 0
          && before.caption.text.replace(/\s/g, '') === figure.label.replace(/\s/g, '')
          && before.svg.y >= 0 && before.svg.bottom <= viewport.height, before);
        const capture = async side => {
          check('Shared capture ceiling before ' + figure.id + side,
            evidence.actions.screenshotsAttempted + usage.previousCaptures < 8, evidence.actions);
          const file = path.join(out, figure.id + '-' + side + '-390x844.png');
          assert(!fs.existsSync(file), 'No capture overwrite/retry');
          evidence.actions.screenshotsAttempted++;
          await page.screenshot({ path: file, fullPage: false });
          evidence.actions.screenshotsCreated++;
          evidence.captures.push({ ...bind(file), figure: figure.id, side, viewport,
            captureNumber: evidence.actions.screenshotsCreated, nativeScreenshot: true,
            actualScrollLeft: await element.evaluate(el => el.scrollLeft), modelView: 'PENDING' });
        };
        await capture('LEFT');
        const b = before.figure;
        const x = Math.max(1, Math.min(389, b.x + b.width / 2));
        const y = Math.max(1, Math.min(843, b.y + Math.min(b.height / 2, 120)));
        evidence.actions.mouseMoves++;
        await page.mouse.move(x, y);
        const target = await page.evaluate(({ x, y, id }) => {
          const hit = document.elementFromPoint(x, y);
          return { tag: hit?.tagName, figure: hit?.closest('figure')?.id, inside: hit?.closest('figure')?.id === id };
        }, { x, y, id: figure.id });
        check(figure.id + ' wheel pointer is inside figure', target.inside, target);
        record.wheel.push({ before: before.scrollLeft, endBefore: before.end,
          pointer: { x, y }, target, deltaX: 2000, deltaY: 0 });
        evidence.actions.horizontalWheel++;
        await page.mouse.wheel(2000, 0);
        record.wheel[0].reached = await element.evaluate(el => new Promise(resolve => {
          const deadline = performance.now() + 3000;
          const poll = () => {
            if (Math.abs(el.scrollLeft - (el.scrollWidth - el.clientWidth)) <= 1) return resolve(true);
            if (performance.now() > deadline) return resolve(false);
            requestAnimationFrame(poll);
          };
          poll();
        }));
        record.after = await element.evaluate(el => ({
          mediaWidth: el.querySelector('.figure-media').getBoundingClientRect().width,
          scrollLeft: el.scrollLeft, end: el.scrollWidth - el.clientWidth, pageScrollX: scrollX,
          svgRight: el.querySelector('svg').getBoundingClientRect().right,
          figureRight: el.getBoundingClientRect().right }));
        Object.assign(record.wheel[0], { after: record.after.scrollLeft, endAfter: record.after.end });
        check(figure.id + ' native wheel reached actual right end with unchanged media',
          record.wheel[0].reached && record.after.scrollLeft === record.after.end
          && record.after.scrollLeft > before.scrollLeft && record.after.end === before.end
          && record.after.mediaWidth === 640 && record.after.pageScrollX === 0
          && Math.abs(record.after.svgRight - record.after.figureRight) <= 1, record.after);
        await capture('RIGHT');
        record.status = 'MECHANICAL_PASS_VISUAL_PENDING';
        console.log(JSON.stringify({ figure: figure.id, status: record.status, width: before.mediaWidth,
          minTextPx: before.minTextPx, excludedHiddenHelpers: before.excludedHiddenHelpers.length,
          wheel: record.wheel, captures: evidence.captures.filter(x => x.figure === figure.id) }));
      } catch (error) {
        record.status = 'FAIL_AFFECTED_DEPENDENCY_STOPPED';
        record.error = error.stack;
        evidence.failures.push({ name: figure.id, error: error.stack });
        console.error(error.stack);
      }
    }
    check('No recovery browser/console errors or external requests',
      evidence.pageErrors.length === 0 && !evidence.console.some(x => x.type === 'error')
      && !evidence.requests.some(x => !x.allowed), { pageErrors: evidence.pageErrors, console: evidence.console });
    check('Exactly eight outstanding captures with four native wheels',
      evidence.captures.length === 8 && evidence.actions.screenshotsAttempted === 8
      && evidence.actions.horizontalWheel === 4, evidence.actions);
    evidence.status = evidence.failures.length ? 'FAIL_PRESERVED' : 'MECHANICAL_PASS_VISUAL_PENDING';
  } catch (error) {
    evidence.status = 'FAIL_PRESERVED';
    evidence.failures.push({ name: 'Stopped dependent recovery stage', error: error.stack });
    console.error(error.stack);
  } finally {
    if (context) {
      try { await context.close(); evidence.closure.contextClosed = evidence.closure.pagesClosed = true; }
      catch (error) { evidence.failures.push({ name: 'Context close', error: error.stack }); }
    } else evidence.closure.contextClosed = evidence.closure.pagesClosed = true;
    if (browser) {
      try { await browser.close(); evidence.closure.browserClosed = true; }
      catch (error) { evidence.failures.push({ name: 'Browser close', error: error.stack }); }
    } else evidence.closure.browserClosed = true;
    evidence.preservedOriginalsAfter = preserved.map(x => {
      const after = bind(x.path); return { ...after, unchanged: x.sha256 === after.sha256 };
    });
    evidence.inputsAfter = evidence.inputs.map(x => {
      const after = bind(x.path); return { ...after, unchanged: x.sha256 === after.sha256 };
    });
    if (![...evidence.preservedOriginalsAfter, ...evidence.inputsAfter].every(x => x.unchanged)) {
      evidence.failures.push({ name: 'Existing output/input binding changed; dependent approval stopped' });
    }
    if (evidence.failures.length) evidence.status = 'FAIL_PRESERVED';
    evidence.endedAt = new Date().toISOString();
    write('browser-evidence.json', evidence);
    console.log(JSON.stringify({ status: evidence.status, actions: evidence.actions, closure: evidence.closure }));
    process.exitCode = evidence.failures.length ? 1 : 0;
  }
}

function finalize() {
  assert.equal(process.cwd(), path.join(root, 'app'));
  assert(!fs.existsSync(path.join(out, 'final-report.json')), 'No finalization replay');
  const evidence = read(path.join(out, 'browser-evidence.json'));
  const execution = read(path.join(out, 'execution.json'));
  const visual = read(path.join(out, 'visual-observations.json'));
  assert.equal(visual.views.length, evidence.captures.length);
  assert(visual.views.length <= 8 && new Set(visual.views.map(x => x.path)).size === visual.views.length);
  for (const view of visual.views) {
    const capture = evidence.captures.find(x => x.path === view.path);
    assert(capture && capture.sha256 === view.sha256 && bind(view.path).sha256 === view.sha256);
    assert(view.tool === 'functions.view_image' && view.actualViews === 1 && view.observation.length > 80);
  }
  const report = {
    schema: 'stemrobin1846/n88-mobile-recovery-final@1', scope,
    verdict: execution.exitCode === 0 && evidence.failures.length === 0 && visual.views.length === 8
      && visual.views.every(x => x.status === 'DISPLAY_PASS') ? 'PASS_AFFECTED_MOBILE_DRAFT_DISPLAY_RECOVERY'
        : 'FAIL_OR_INCOMPLETE_RECOVERY_PRESERVED',
    createdAt: new Date().toISOString(), script: bind(script), originalFailure: evidence.originalFailure,
    preservedOriginals: bind(path.join(out, 'preserved-originals.json')),
    execution: bind(path.join(out, 'execution.json')), browserEvidence: bind(path.join(out, 'browser-evidence.json')),
    visualObservations: bind(path.join(out, 'visual-observations.json')), captures: evidence.captures,
    figures: evidence.figures.map(x => ({ id: x.id, mechanicalStatus: x.status,
      visualStatus: visual.views.filter(v => v.figure === x.id).map(v => ({ side: v.side, status: v.status })),
      mediaWidth: x.before?.mediaWidth, minTextPx: x.before?.minTextPx,
      visibleObjectCount: x.before?.objects.length, hiddenHelperCount: x.before?.excludedHiddenHelpers.length,
      outsideVisibleObjects: x.before?.outsideVisibleObjects, outsideLabels: x.before?.outsideLabels,
      wheel: x.wheel, before: x.before?.scrollLeft, after: x.after?.scrollLeft, end: x.after?.end })),
    failures: evidence.failures, findings: visual.findings, reusedPassEvidence: evidence.reusedPassEvidence,
    actions: evidence.actions, closure: { ...evidence.closure, childClosed: execution.childClosed, backgroundServers: 0 },
    usage: { ...usage, recoveryCaptures: evidence.actions.screenshotsCreated, recoveryModelViews: visual.views.length,
      sharedCapturesUsed: evidence.actions.screenshotsCreated + usage.previousCaptures,
      sharedModelViewsUsed: visual.views.length + usage.previousModelViews,
      creationInclusiveUsed: evidence.actions.screenshotsCreated + visual.views.length },
    existingInputsAndFailuresPreserved: [...evidence.inputsAfter, ...evidence.preservedOriginalsAfter].every(x => x.unchanged),
    figureMathSourceCropWholeLessonApproval: false, unrelatedHolds: 'UNCHANGED; pending elsewhere',
    appDbKeyboardGradingChoicesDisclosuresPublication: 'NOT RUN', offlineRenderExecutions: 0,
  };
  write('final-report.json', report);
  write('ledger.json', { schema: 'stemrobin1846/n88-mobile-recovery-ledger@1', scope, ...report.usage,
    qualification: 'SAME invocation; affected display technical recovery only; initial failures retained, no PASS workflows replayed.',
    originalLedger: bind(path.join(original, 'ledger.json')), finalReport: bind(path.join(out, 'final-report.json')) });
  write('manifest.json', { schema: 'stemrobin1846/n88-mobile-recovery-manifest@1', scope, verdict: report.verdict,
    script: bind(script), originalFailure: evidence.originalFailure, unchangedInputs: evidence.inputsAfter,
    originalOutputsAndScript: evidence.preservedOriginalsAfter,
    outputs: fs.readdirSync(out).filter(name => fs.statSync(path.join(out, name)).isFile())
      .map(name => bind(path.join(out, name))), usage: report.usage });
  console.log(JSON.stringify({ verdict: report.verdict, report: bind(path.join(out, 'final-report.json')),
    ledger: bind(path.join(out, 'ledger.json')), manifest: bind(path.join(out, 'manifest.json')),
    script: bind(script), usage: report.usage, closure: report.closure }));
}

if (process.argv[2] === '--browser') await runBrowser();
else if (process.argv[2] === '--finalize') finalize();
else if (process.argv.length === 2) await supervise();
else throw new Error('Unsupported mode');
