import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
const script = fileURLToPath(import.meta.url);
const base = path.join(root, '.tmp/stemrobin-184-six/n88-draft-display');
const out = path.join(base, 'mobile');
const viewport = { width: 390, height: 844 };
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: sha(bytes) };
};
const write = (name, value) => fs.writeFileSync(path.join(out, name),
  typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const manifestPath = path.join(base, 'manifest.json');
const manifestHash = 'c801504ad263a346f2f9a377599194e109a347b4d08cddf843696c4cca42a4d8';
const scope = {
  ticket: 'STEMROBIN-184/184-6', finish: 'SAME offline finish review',
  subject: 'NEW MOBILE draft display only, local file preview',
  viewport, headed: true,
  excluded: ['app', 'DB', 'keyboard', 'answer disclosures', 'choices', 'grading',
    'source fidelity', 'math review', 'crop review', 'whole lesson approval',
    'publication', 'formal defence', 'desktop evidence'],
};

async function supervise() {
  assert.equal(process.cwd(), path.join(root, 'app'));
  assert(!fs.existsSync(out), 'Output already exists: no replay permitted');
  fs.mkdirSync(out);
  const startedAt = new Date().toISOString();
  const stdout = [];
  const stderr = [];
  let launchError = null;
  const argv = [script, '--browser'];
  const child = spawn(process.execPath, argv, { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.on('data', data => { stdout.push(data); process.stdout.write(data); });
  child.stderr.on('data', data => { stderr.push(data); process.stderr.write(data); });
  child.on('error', error => { launchError = error.stack; });
  const result = await new Promise(resolve => child.on('close',
    (exitCode, signal) => resolve({ exitCode, signal })));
  write('browser.stdout.txt', Buffer.concat(stdout).toString('utf8'));
  write('browser.stderr.txt', Buffer.concat(stderr).toString('utf8'));
  write('execution.json', {
    schema: 'stemrobin1846/n88-mobile-execution@1', startedAt,
    endedAt: new Date().toISOString(), cwd: process.cwd(),
    command: process.execPath, argv, supervisorArgv: process.argv, script: bind(script),
    ...result, launchError,
    streams: { stdout: bind(path.join(out, 'browser.stdout.txt')),
      stderr: bind(path.join(out, 'browser.stderr.txt')) },
    childClosed: true, backgroundServers: 0,
  });
  process.exitCode = result.exitCode ?? 1;
}

async function browserCheck() {
  assert.equal(process.cwd(), path.join(root, 'app'));
  assert(fs.existsSync(out));
  assert(!fs.existsSync(path.join(out, 'browser-evidence.json')), 'No replay permitted');
  const evidence = {
    schema: 'stemrobin1846/n88-mobile-browser@1', scope, status: 'RUNNING',
    startedAt: new Date().toISOString(), cwd: process.cwd(), argv: process.argv,
    script: bind(script), inputs: [], checks: [], failures: [], console: [],
    pageErrors: [], requests: [], requestFailures: [], captures: [], figures: [],
    actions: { goto: 0, linkClicks: 0, scrollIntoView: 0, mouseMoves: 0,
      horizontalWheel: 0, verticalWheel: 0, screenshotsAttempted: 0,
      screenshotsCreated: 0, programmaticHorizontalScroll: 0, keyboard: 0,
      disclosures: 0, choices: 0, inputs: 0 },
    usage: { chargesCarried: 74, paidGenerationCalls: 0, hiddenFees: 'UNKNOWN',
      completeLessons: 0, parentImagesUsed: 24, parentImagesCeiling: 24,
      parentBudgetPermanentlyExhausted: true, nativeCaptureCeiling: 8,
      modelViewCeiling: 8, creationInclusiveCeiling: 16, resets: 0,
      modelViews: 'PENDING separately recorded actual tool calls' },
    browserClosed: false, contextClosed: false, pagesClosed: false,
  };
  let browser;
  let context;
  let page;
  let boundInputs = [];
  const check = (name, condition, details) => {
    evidence.checks.push({ name, pass: Boolean(condition), details });
    if (!condition) evidence.failures.push({ name, details });
    return Boolean(condition);
  };
  const critical = (name, condition, details) => {
    assert(check(name, condition, details), name);
  };
  const stopped = () => {
    critical('No browser page errors', evidence.pageErrors.length === 0, evidence.pageErrors);
    critical('No console errors', !evidence.console.some(x => x.type === 'error'), evidence.console);
    critical('No external page request', !evidence.requests.some(x => !x.allowed), evidence.requests);
  };
  try {
    critical('Specified manifest hash', bind(manifestPath).sha256 === manifestHash, bind(manifestPath));
    const manifest = read(manifestPath);
    const resolve = item => path.resolve(root, item.path);
    const htmlItems = manifest.outputs;
    critical('Exactly supplied N88 HTML outputs', htmlItems.length === 2
      && htmlItems.every(x => /\/ana10-c6-s3-n88\/(text|exercises)\.html$/.test(x.path)), htmlItems);
    boundInputs = [
      { path: manifestPath, sha256: manifestHash },
      ...htmlItems.map(x => ({ ...x, path: resolve(x) })),
      ...manifest.sourceTextAndSvgCopies.flatMap(x => [x.original, x.snapshot])
        .map(x => ({ ...x, path: resolve(x) })),
      { ...manifest.actualRenderReceipt, path: resolve(manifest.actualRenderReceipt) },
    ];
    for (const input of boundInputs) {
      const current = bind(input.path);
      evidence.inputs.push(current);
      critical('Current bound input: ' + input.path, current.sha256 === input.sha256, current);
    }
    const execution = read(resolve(manifest.actualRenderReceipt));
    critical('Reuse successful official render without executing it', execution.exitCode === 0,
      { receipt: bind(resolve(manifest.actualRenderReceipt)), exitCode: execution.exitCode,
        previousSessionReportedByUser: 'a7bb78', renderExecutionsThisCheck: 0 });
    const lessonFile = manifest.sourceTextAndSvgCopies.find(x => /\/lesson\.json$/.test(x.snapshot.path));
    const exerciseFile = manifest.sourceTextAndSvgCopies.find(x => /\/exercises\.json$/.test(x.snapshot.path));
    const lesson = read(resolve(lessonFile.snapshot));
    const exercises = read(resolve(exerciseFile.snapshot));
    const require = createRequire(path.join(root, 'app/package.json'));
    const { chromium } = require('playwright');
    const helperPath = path.join(root, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js');
    const rendererPath = path.join(root, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js');
    const { inline, proseInline, proseFlow } = require(helperPath);
    const mergePath = path.join(root, '.claude/skills/ld-s10y-lesson/tools/publish_merge.js');
    const { sourceNumberForArtifact } = require(mergePath);
    evidence.dependencies = [bind(path.join(root, 'app/package.json')), bind(require.resolve('playwright')),
      bind(helperPath), bind(rendererPath), bind(mergePath)];
    const flow = proseFlow(lesson.prose, lesson.section_breaks);
    const paragraphs = flow.filter(x => !['fig', 'cap'].includes(x.kind));
    const figures = flow.filter(x => x.kind === 'fig');
    const expectedFlow = flow.filter(x => x.kind !== 'cap').map(x =>
      x.kind === 'fig' ? { kind: 'fig', id: x.id } : { kind: 'p', html: proseInline(x.text),
        section: Boolean(x.sectionBreak) });
    const written = exercises.exercises.map(e => {
      const number = sourceNumberForArtifact(e);
      const prefix = e.text.match(/^\s*(\d+)([.°*])\s*/);
      // This candidate uses only plain numbered exercises; stop rather than guess other prefixes.
      assert(prefix && prefix[1] === String(number) && prefix[2] === '.', 'Unexpected number prefix');
      assert(!(e.figures || []).length, 'Unexpected written figure dependency');
      return { id: 'ex-' + e.number, number: String(number) + '.', html: inline(e.text.slice(prefix[0].length)) };
    });
    const groups = exercises.exercises.filter((e, i, a) => i === 0 || e.group !== a[i - 1].group)
      .map(e => proseInline(e.group || '\u7ec3\u4e60'));
    critical('Current N88 contains 34 written exercises', exercises.count === 34 && written.length === 34,
      { count: exercises.count, derived: written.length });
    critical('Current prose derives exactly figures 38-41', figures.length === 4
      && figures.every((x, i) => x.id === 'fig-' + (38 + i)), figures.map(x => ({ id: x.id, label: x.label })));
    browser = await chromium.launch({ channel: 'chrome', headless: false });
    evidence.browser = { version: browser.version(), channel: 'chrome', headless: false };
    context = await browser.newContext({ viewport, deviceScaleFactor: 1, serviceWorkers: 'block' });
    await context.route('**/*', route => {
      const url = route.request().url();
      const allowed = /^(file|data|blob):/.test(url);
      evidence.requests.push({ url: url.startsWith('data:') ? 'data:[embedded]' : url, allowed });
      return allowed ? route.continue() : route.abort('blockedbyclient');
    });
    page = await context.newPage();
    page.setDefaultTimeout(10000);
    page.on('console', message => evidence.console.push({ type: message.type(), text: message.text() }));
    page.on('pageerror', error => evidence.pageErrors.push(error.stack));
    page.on('requestfailed', request => evidence.requestFailures.push({
      url: request.url().startsWith('data:') ? 'data:[embedded]' : request.url(),
      failure: request.failure() }));
    const waitFonts = async () => page.evaluate(async () => {
      await document.fonts.ready;
      const samples = new Map();
      for (const node of document.querySelectorAll('.katex-html span,.prose-math,.figure-media text')) {
        const s = getComputedStyle(node);
        const font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
        samples.set(font, (samples.get(font) || '') + (node.textContent || 'x'));
      }
      for (const [font, text] of samples) await document.fonts.load(font, text);
      await document.fonts.ready;
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      return { status: document.fonts.status, samples: samples.size,
        missing: [...samples].filter(([font, text]) => !document.fonts.check(font, text)).map(([font]) => font),
        faces: [...document.fonts].map(f => ({ family: f.family, style: f.style,
          weight: f.weight, status: f.status })) };
    });
    const fileFor = name => resolve(htmlItems.find(x => x.path.endsWith('/' + name + '.html')));
    evidence.actions.goto++;
    await page.goto(pathToFileURL(fileFor('text')).href, { waitUntil: 'load' });
    const textFonts = await waitFonts();
    const textState = await page.evaluate(({ expectedFlow, paragraphs }) => {
      const signature = node => {
        const copy = node.cloneNode(true);
        for (const math of copy.querySelectorAll('.katex')) math.replaceWith(
          document.createTextNode('$' + math.querySelector('annotation').textContent + '$'));
        for (const br of copy.querySelectorAll('br')) br.replaceWith(document.createTextNode('\n'));
        return copy.textContent.replace(/\s+/g, ' ').trim();
      };
      const sigHtml = html => { const div = document.createElement('div'); div.innerHTML = html; return signature(div); };
      const nodes = [...document.querySelector('.sheet').children].filter(x =>
        x.matches('.para,figure.fig'));
      const matches = expectedFlow.map((item, i) => item.kind === 'fig'
        ? nodes[i]?.id === item.id
        : Boolean(nodes[i]?.matches('.para')) && signature(nodes[i]) === sigHtml(item.html)
          && nodes[i].classList.contains('section') === item.section);
      const bounds = nodes.map(n => { const r = n.getBoundingClientRect();
        return { id: n.id || null, kind: n.tagName, x: r.x, y: r.y,
          width: r.width, height: r.height, right: r.right, bottom: r.bottom }; });
      return { viewport: { width: innerWidth, height: innerHeight },
        pageWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth,
        pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        errors: document.querySelectorAll('.err,.katex-error,.sr-tex-err').length,
        mathCount: document.querySelectorAll('.katex').length, proseCount: document.querySelectorAll('.para').length,
        expectedProseCount: paragraphs, flowCount: nodes.length, expectedFlowCount: expectedFlow.length,
        matches, bounds, coherent: bounds.every((r, i) => r.height > 0 && r.x >= 0 && r.right <= innerWidth
          && (i === 0 || r.y >= bounds[i - 1].bottom - 1)),
        forbiddenControls: document.querySelectorAll('details,input,select,textarea,button,script').length };
    }, { expectedFlow, paragraphs: paragraphs.length });
    evidence.text = { fonts: textFonts, ...textState };
    const textPass = check('All proseFlow and text layout', textState.matches.every(Boolean)
      && textState.flowCount === textState.expectedFlowCount && textState.proseCount === paragraphs.length
      && textState.coherent && !textState.pageOverflow && textState.errors === 0 && textState.mathCount > 0
      && textFonts.status === 'loaded' && textFonts.missing.length === 0
      && textState.forbiddenControls === 0, evidence.text);
    stopped();
    for (const figure of figures) {
      const record = { id: figure.id, label: figure.label, status: 'RUNNING', wheel: [] };
      evidence.figures.push(record);
      try {
        const element = page.getByRole('figure', { name: figure.label, exact: true });
        evidence.actions.scrollIntoView++;
        await element.scrollIntoViewIfNeeded();
        record.before = await element.evaluate(el => {
          const svg = el.querySelector('.figure-media > svg');
          const media = el.querySelector('.figure-media');
          const vb = svg.viewBox.baseVal;
          const rootBox = svg.getBoundingClientRect();
          const box = n => { const r = n.getBoundingClientRect(); return {
            x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom }; };
          const labels = [...svg.querySelectorAll('text')].map(n => {
            const m = n.getScreenCTM();
            const sum = m.a ** 2 + m.b ** 2 + m.c ** 2 + m.d ** 2;
            const determinant = m.a * m.d - m.b * m.c;
            const scale = Math.sqrt((sum - Math.sqrt(Math.max(0, sum ** 2 - 4 * determinant ** 2))) / 2);
            const b = box(n);
            return { id: n.id, text: n.textContent, font: getComputedStyle(n).fontFamily,
              cssFontSize: parseFloat(getComputedStyle(n).fontSize), scale,
              actualTextPx: parseFloat(getComputedStyle(n).fontSize) * scale, bounds: b,
              insideCanvas: b.x >= rootBox.x - 1 && b.right <= rootBox.right + 1
                && b.y >= rootBox.y - 1 && b.bottom <= rootBox.bottom + 1 };
          });
          const objects = [...svg.querySelectorAll('path,line,polyline,polygon,rect,circle,ellipse')].filter(n =>
            !n.closest('defs,clipPath,marker,mask')).map(n => {
            const b = box(n);
            return { id: n.id, tag: n.tagName, bounds: b,
              insideCanvas: b.x >= rootBox.x - 1 && b.right <= rootBox.right + 1
                && b.y >= rootBox.y - 1 && b.bottom <= rootBox.bottom + 1 };
          });
          const caption = el.querySelector('figcaption');
          return { mediaWidth: media.getBoundingClientRect().width, svg: box(svg),
            viewBox: { x: vb.x, y: vb.y, width: vb.width, height: vb.height },
            labels, objects, minTextPx: Math.min(...labels.map(n => n.actualTextPx)),
            outsideLabels: labels.filter(n => !n.insideCanvas), outsideObjects: objects.filter(n => !n.insideCanvas),
            caption: { text: caption?.textContent, bounds: caption && box(caption) },
            layout: el.dataset.figureLayout, clientWidth: el.clientWidth, scrollWidth: el.scrollWidth,
            scrollLeft: el.scrollLeft, end: el.scrollWidth - el.clientWidth,
            figure: box(el), pageScrollX: scrollX, pageOverflow: document.documentElement.scrollWidth > innerWidth };
        });
        critical(figure.id + ' fixed media, fonts and canvas bounds', record.before.mediaWidth === 640
          && record.before.layout === 'scroll' && record.before.labels.length > 0
          && record.before.minTextPx >= 16 && record.before.outsideLabels.length === 0
          && record.before.outsideObjects.length === 0 && record.before.scrollLeft === 0
          && record.before.end > 0 && !record.before.pageOverflow
          && record.before.caption.text.replace(/\s/g, '') === figure.label.replace(/\s/g, '')
          && record.before.svg.y >= 0 && record.before.svg.bottom <= viewport.height,
        record.before);
        const capture = async side => {
          critical('Capture ceiling before creation', evidence.actions.screenshotsAttempted < 8,
            evidence.actions);
          const file = path.join(out, figure.id + '-' + side + '-390x844.png');
          assert(!fs.existsSync(file), 'No screenshot retry/overwrite permitted');
          evidence.actions.screenshotsAttempted++;
          await page.screenshot({ path: file, fullPage: false });
          evidence.actions.screenshotsCreated++;
          evidence.captures.push({ figure: figure.id, side, viewport, ...bind(file),
            modelView: 'PENDING', captureNumber: evidence.actions.screenshotsCreated,
            actualScrollLeft: await element.evaluate(el => el.scrollLeft) });
        };
        await capture('LEFT');
        const b = record.before.figure;
        const x = Math.max(1, Math.min(viewport.width - 1, b.x + b.width / 2));
        const y = Math.max(1, Math.min(viewport.height - 1, b.y + Math.min(b.height / 2, 120)));
        evidence.actions.mouseMoves++;
        await page.mouse.move(x, y);
        evidence.actions.horizontalWheel++;
        await page.mouse.wheel(2000, 0);
        record.wheel.push({ deltaX: 2000, deltaY: 0, pointer: { x, y }, before: record.before.scrollLeft });
        await element.evaluate(el => new Promise((resolve, reject) => {
          const deadline = performance.now() + 3000;
          const poll = () => {
            if (Math.abs(el.scrollLeft - (el.scrollWidth - el.clientWidth)) <= 1) return resolve();
            if (performance.now() > deadline) return reject(new Error('Native wheel did not reach right end'));
            requestAnimationFrame(poll);
          };
          poll();
        }));
        record.after = await element.evaluate(el => ({
          mediaWidth: el.querySelector('.figure-media').getBoundingClientRect().width,
          scrollLeft: el.scrollLeft, end: el.scrollWidth - el.clientWidth,
          pageScrollX: scrollX, pageOverflow: document.documentElement.scrollWidth > innerWidth,
          svgRight: el.querySelector('svg').getBoundingClientRect().right,
          figureRight: el.getBoundingClientRect().right }));
        record.wheel[0].after = record.after.scrollLeft;
        record.wheel[0].end = record.after.end;
        critical(figure.id + ' native right end, unchanged width and contained page',
          record.after.scrollLeft === record.after.end && record.after.scrollLeft > record.before.scrollLeft
          && record.after.mediaWidth === 640 && record.after.pageScrollX === 0 && !record.after.pageOverflow
          && Math.abs(record.after.svgRight - record.after.figureRight) <= 1, record.after);
        await capture('RIGHT');
        record.status = 'MECHANICAL_PASS_VISUAL_PENDING';
        stopped();
      } catch (error) {
        record.status = 'FAIL_AFFECTED_DEPENDENCY_STOPPED';
        record.error = error.stack;
        evidence.failures.push({ name: figure.id, error: error.stack });
      }
    }
    const jump = page.getByRole('link').filter({ hasText: '\u53bb\u505a\u9898' });
    evidence.actions.scrollIntoView++;
    await jump.scrollIntoViewIfNeeded();
    const beforeY = await page.evaluate(() => scrollY);
    evidence.actions.mouseMoves++;
    await page.mouse.move(8, 400);
    evidence.actions.verticalWheel++;
    await page.mouse.wheel(0, -240);
    await page.waitForFunction(y => scrollY < y, beforeY);
    evidence.readOnlyTextScroll = { beforeY, afterY: await page.evaluate(() => scrollY), deltaY: -240 };
    evidence.actions.linkClicks++;
    await jump.click();
    critical('Real text to written link navigation', page.url() === pathToFileURL(fileFor('exercises')).href, page.url());
    const writtenFonts = await waitFonts();
    const writtenState = await page.evaluate(({ written, groups }) => {
      const sig = node => {
        const copy = node.cloneNode(true);
        for (const math of copy.querySelectorAll('.katex')) math.replaceWith(
          document.createTextNode('$' + math.querySelector('annotation').textContent + '$'));
        for (const br of copy.querySelectorAll('br')) br.replaceWith(document.createTextNode('\n'));
        return copy.textContent.replace(/\s+/g, ' ').trim();
      };
      const sigHtml = html => { const div = document.createElement('div'); div.innerHTML = html; return sig(div); };
      const items = [...document.querySelectorAll('li.ex')];
      const matches = written.map((e, i) => items[i]?.id === e.id
        && sig(items[i].querySelector('.body')) === sigHtml(e.html)
        && sig(items[i].querySelector('.no')) === e.number);
      const groupNodes = [...document.querySelectorAll('.exgroup')];
      const bounds = items.map(n => { const r = n.getBoundingClientRect(); return {
        id: n.id, x: r.x, y: r.y, right: r.right, bottom: r.bottom, height: r.height }; });
      return { count: items.length, matches, groupCount: groupNodes.length,
        groupMatches: groups.map((g, i) => Boolean(groupNodes[i]) && sig(groupNodes[i]) === sigHtml(g)),
        pageWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth,
        pageOverflow: document.documentElement.scrollWidth > innerWidth,
        errors: document.querySelectorAll('.err,.katex-error,.sr-tex-err').length,
        forbiddenControls: document.querySelectorAll('details,input,select,textarea,button,script').length,
        mathCount: document.querySelectorAll('.katex').length, bounds,
        coherent: bounds.every((b, i) => b.x >= 0 && b.right <= innerWidth && b.height > 0
          && (i === 0 || b.y >= bounds[i - 1].bottom - 1)) };
    }, { written, groups });
    evidence.written = { fonts: writtenFonts, ...writtenState };
    check('All 34 exercises semantic parity, groups and layout', writtenState.count === 34
      && writtenState.matches.every(Boolean) && writtenState.groupCount === groups.length
      && writtenState.groupMatches.every(Boolean) && writtenState.coherent && !writtenState.pageOverflow
      && writtenState.errors === 0 && writtenState.forbiddenControls === 0 && writtenState.mathCount > 0
      && writtenFonts.status === 'loaded' && writtenFonts.missing.length === 0, evidence.written);
    const last = page.locator('[id="' + written.at(-1).id + '"]');
    evidence.actions.scrollIntoView++;
    await last.scrollIntoViewIfNeeded();
    const writtenBeforeY = await page.evaluate(() => scrollY);
    evidence.actions.mouseMoves++;
    await page.mouse.move(8, 400);
    evidence.actions.verticalWheel++;
    await page.mouse.wheel(0, -240);
    await page.waitForFunction(y => scrollY < y, writtenBeforeY);
    evidence.readOnlyWrittenScroll = { beforeY: writtenBeforeY, afterY: await page.evaluate(() => scrollY), deltaY: -240 };
    evidence.actions.linkClicks++;
    await page.getByRole('link', { name: '\u2190 \u56de\u8bfe\u6587', exact: true }).click();
    critical('Real written to text link navigation', page.url() === pathToFileURL(fileFor('text')).href, page.url());
    evidence.navigationBackFonts = await waitFonts();
    stopped();
    check('Exactly eight new endpoint captures, no repeats', evidence.captures.length === 8
      && evidence.actions.screenshotsAttempted === 8, evidence.actions);
    evidence.status = evidence.failures.length || !textPass ? 'FAIL_PRESERVED' : 'MECHANICAL_PASS_VISUAL_PENDING';
    console.log(JSON.stringify({ status: evidence.status, captures: evidence.captures.length,
      figures: evidence.figures.map(x => ({ id: x.id, status: x.status,
        minTextPx: x.before?.minTextPx, wheel: x.wheel })), actions: evidence.actions,
      failures: evidence.failures.map(x => ({ name: x.name, error: x.error })) }));
  } catch (error) {
    evidence.status = 'FAIL_PRESERVED';
    evidence.failures.push({ name: 'Stopped dependent stage', error: error.stack });
    console.error(error.stack);
  } finally {
    if (context) {
      try { await context.close(); evidence.contextClosed = true; evidence.pagesClosed = true; }
      catch (error) { evidence.failures.push({ name: 'Context close', error: error.stack }); }
    } else evidence.contextClosed = evidence.pagesClosed = true;
    if (browser) {
      try { await browser.close(); evidence.browserClosed = true; }
      catch (error) { evidence.failures.push({ name: 'Browser close', error: error.stack }); }
    } else evidence.browserClosed = true;
    evidence.inputsAfter = boundInputs.map(x => {
      try { const after = bind(x.path); return { ...after, unchanged: after.sha256 === x.sha256 }; }
      catch (error) { return { path: x.path, unchanged: false, error: error.message }; }
    });
    check('All existing inputs remained unchanged', evidence.inputsAfter.every(x => x.unchanged), evidence.inputsAfter);
    if (evidence.failures.length) evidence.status = 'FAIL_PRESERVED';
    evidence.endedAt = new Date().toISOString();
    write('browser-evidence.json', evidence);
    process.exitCode = evidence.failures.length ? 1 : 0;
  }
}

function finalize() {
  assert.equal(process.cwd(), path.join(root, 'app'));
  assert(!fs.existsSync(path.join(out, 'final-report.json')), 'Final report already exists');
  const evidence = read(path.join(out, 'browser-evidence.json'));
  const execution = read(path.join(out, 'execution.json'));
  const review = read(path.join(out, 'visual-observations.json'));
  assert.equal(evidence.captures.length, review.views.length);
  assert(review.views.length <= 8);
  assert(new Set(review.views.map(x => x.path)).size === review.views.length);
  for (const view of review.views) {
    const capture = evidence.captures.find(x => x.path === view.path);
    assert(capture && capture.sha256 === view.sha256 && view.tool === 'functions.view_image'
      && view.actualViews === 1 && typeof view.observation === 'string' && view.observation.length > 80);
  }
  const allVisualPass = review.views.every(x => x.status === 'DISPLAY_PASS');
  const verdict = execution.exitCode === 0 && evidence.failures.length === 0 && allVisualPass
    && review.views.length === 8 ? 'PASS_NEW_MOBILE_DRAFT_DISPLAY_ONLY' : 'FAIL_OR_INCOMPLETE_PRESERVED';
  const report = {
    schema: 'stemrobin1846/n88-mobile-final@1', verdict, scope,
    createdAt: new Date().toISOString(), script: bind(script),
    execution: bind(path.join(out, 'execution.json')), browserEvidence: bind(path.join(out, 'browser-evidence.json')),
    visualObservations: bind(path.join(out, 'visual-observations.json')),
    captures: evidence.captures, failures: evidence.failures,
    figureSummary: evidence.figures.map(x => ({ id: x.id, mechanicalStatus: x.status,
      mediaWidth: x.before?.mediaWidth, minTextPx: x.before?.minTextPx,
      before: x.before?.scrollLeft, after: x.after?.scrollLeft, end: x.after?.end, nativeWheel: x.wheel })),
    counts: { prose: evidence.text?.proseCount, exercises: evidence.written?.count,
      consoleErrors: evidence.console.filter(x => x.type === 'error').length,
      pageErrors: evidence.pageErrors.length, actions: evidence.actions },
    closure: { browserClosed: evidence.browserClosed, contextClosed: evidence.contextClosed,
      pagesClosed: evidence.pagesClosed, childClosed: execution.childClosed, backgroundServers: 0 },
    usage: { chargesCarried: 74, paidGenerationCalls: 0, hiddenFees: 'UNKNOWN', completeLessons: 0,
      parentImagesUsed: 24, parentImagesCeiling: 24, parentBudgetPermanentlyExhausted: true,
      childNativeCaptures: evidence.actions.screenshotsCreated, childModelViews: review.views.length,
      creationInclusiveUsed: evidence.actions.screenshotsCreated + review.views.length,
      creationInclusiveCeiling: 16, modelViewCeiling: 8, resets: 0, otherImageOperations: 0 },
    figureMathReview: 'PENDING ELSEWHERE', sourceCropWholeLessonApproval: false,
    officialOfflineRenderExecutions: 0, appDbKeyboardGradingPublication: 'NOT RUN',
    inputsPreserved: evidence.inputsAfter.every(x => x.unchanged),
  };
  write('final-report.json', report);
  write('ledger.json', { schema: 'stemrobin1846/n88-mobile-ledger@1', scope, ...report.usage,
    qualification: 'Display-only observations of new endpoint captures; not an image-skill promotion or lesson completion.',
    finalReport: bind(path.join(out, 'final-report.json')), execution: report.execution,
    browserEvidence: report.browserEvidence, visualObservations: report.visualObservations });
  console.log(JSON.stringify({ verdict, report: bind(path.join(out, 'final-report.json')),
    ledger: bind(path.join(out, 'ledger.json')), script: bind(script), usage: report.usage }));
}

if (process.argv[2] === '--browser') await browserCheck();
else if (process.argv[2] === '--finalize') finalize();
else if (process.argv.length === 2) await supervise();
else throw new Error('No unsupported mode or replay');
