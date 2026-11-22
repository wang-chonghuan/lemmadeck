import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
const self = fileURLToPath(import.meta.url);
const base = path.join(root, '.tmp/stemrobin-184-six/n88-draft-display');
const out = path.join(base, 'desktop');
const manifestFile = path.join(base, 'manifest.json');
const viewport = { width: 1440, height: 960 };
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const write = (name, value) => fs.writeFileSync(path.join(out, name),
  typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n',
  { flag: 'wx' });
const scope = 'N88 NEW DESKTOP offline draft display only. Not app/DB/keyboard, source or mathematical review, figure approval, modern finalization, lesson approval, publication, or formal defence.';
assert.equal(process.cwd(), path.join(root, 'app'));
assert.equal(self, path.join(root,
  '.intentfold/tickets/STEMROBIN-184/tmp/nov22-n88-desktop-display.mjs'));

if (process.argv[2] === 'seal') {
  const evidence = read(path.join(out, 'browser-evidence.json'));
  const review = read(path.join(out, 'visual-review.json'));
  assert.equal(review.views.length, evidence.captures.length);
  assert(review.views.length <= 6 && evidence.captureAttempts <= 6);
  assert.equal(new Set(review.views.map(v => v.path)).size, review.views.length);
  for (const view of review.views) {
    const capture = evidence.captures.find(c => c.path === view.path);
    assert(capture);
    assert.equal(view.sha256, capture.sha256);
    assert.equal(bind(view.path).sha256, capture.sha256);
    assert.equal(view.tool, 'functions.view_image');
    assert.equal(view.viewCount, 1);
  }
  const unchanged = evidence.inputs.map(input => ({
    ...bind(input.path), unchanged: bind(input.path).sha256 === input.sha256,
  }));
  const pass = evidence.status === 'MECHANICAL_DRAFT_DISPLAY_PASS_VISUAL_PENDING'
    && review.status === 'PASS' && unchanged.every(x => x.unchanged);
  const files = fs.readdirSync(out).filter(name => fs.statSync(path.join(out, name)).isFile());
  write('final-ledger.json', {
    schema: 'stemrobin1846/n88-desktop-display-final@1',
    scope, status: pass ? 'PASS' : 'HOLD', argv: process.argv,
    cwd: process.cwd(), timestamp: new Date().toISOString(),
    mechanicalStatus: evidence.status, visualStatus: review.status,
    captureAttempts: evidence.captureAttempts, nativeRastersCreated: evidence.captures.length,
    modelViews: review.views.length,
    creationInclusiveUsed: evidence.captureAttempts + review.views.length,
    creationInclusiveLimit: 12, nativeRasterLimit: 6, modelViewLimit: 6,
    neverReset: true, parentImageBudgetPermanent: '24/24',
    chargesCarried: 74, paidGenerationCalls: 0, hiddenFees: 'UNKNOWN',
    completedLessons: 0, figureApproval: false, mathematicalReview: 'PENDING_ELSEWHERE',
    formalDefence: false, originalOrCandidatePreviewImagesOpened: 0,
    browserClosed: evidence.browserClosed, contextClosed: evidence.contextClosed,
    unchangedInputs: unchanged, artifacts: files.map(name => bind(path.join(out, name))),
    findings: [...evidence.failures, ...review.findings],
    expectedExitCode: pass ? 0 : 2,
  });
  console.log(JSON.stringify({ status: pass ? 'PASS' : 'HOLD',
    finalLedger: bind(path.join(out, 'final-ledger.json')) }));
  process.exitCode = pass ? 0 : 2;
} else if (process.argv[2] !== '--browser-child') {
  assert.equal(process.argv.length, 2, 'No rerender, recheck, or alternate viewport mode');
  fs.mkdirSync(out);
  const childArgv = [self, '--browser-child'];
  const startedAt = new Date().toISOString();
  const stdout = [];
  const stderr = [];
  const child = spawn(process.execPath, childArgv, {
    cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout.on('data', chunk => { stdout.push(chunk); process.stdout.write(chunk); });
  child.stderr.on('data', chunk => { stderr.push(chunk); process.stderr.write(chunk); });
  const result = await new Promise(resolve => {
    child.once('error', error => resolve({ code: null, signal: null, error: error.stack }));
    child.once('close', (code, signal) => resolve({ code, signal }));
  });
  write('stdout.log', Buffer.concat(stdout).toString('utf8'));
  write('stderr.log', Buffer.concat(stderr).toString('utf8'));
  write('execution.json', {
    scope, parent: { executable: process.execPath, argv: process.argv,
      cwd: process.cwd(), pid: process.pid, script: bind(self) },
    child: { executable: process.execPath, argv: [process.execPath, ...childArgv],
      cwd: process.cwd(), pid: child.pid, ...result },
    startedAt, endedAt: new Date().toISOString(),
    stdout: bind(path.join(out, 'stdout.log')), stderr: bind(path.join(out, 'stderr.log')),
    expectedParentExitCode: result.code ?? 2, execSessionRequiredAfterCompletion: false,
  });
  process.exitCode = result.code ?? 2;
} else {
  const evidence = {
    schema: 'stemrobin1846/n88-desktop-draft-display@1',
    scope, status: 'RUNNING', argv: process.argv, cwd: process.cwd(),
    executable: process.execPath, script: bind(self), startedAt: new Date().toISOString(),
    viewport, headed: true, browserLaunches: 0, inputs: [], checks: [], failures: [],
    pageStates: [], figures: [], nativeActions: [], console: [], pageErrors: [],
    requests: [], blockedRequests: [], requestFailures: [], captures: [], captureAttempts: 0,
    nativeRasterLimit: 6, modelViewLimit: 6, creationInclusiveLimit: 12,
    chargesCarried: 74, paidGenerationCalls: 0, hiddenFees: 'UNKNOWN',
    completedLessons: 0, parentImageBudgetPermanent: '24/24', neverReset: true,
    offlineOfficialRenderReruns: 0, originalOrCandidatePreviewImagesOpened: 0,
    browserClosed: false, contextClosed: false,
  };
  const journal = event => fs.appendFileSync(path.join(out, 'actions-and-capture-ledger.jsonl'),
    JSON.stringify({ timestamp: new Date().toISOString(), ...event }) + '\n');
  const check = (name, pass, details) => {
    const entry = { name, pass: Boolean(pass), details };
    evidence.checks.push(entry);
    if (!entry.pass) evidence.failures.push(entry);
    journal({ type: 'check', ...entry });
  };
  const action = entry => {
    evidence.nativeActions.push(entry);
    journal({ type: 'native-action', ...entry });
  };
  let browser;
  let context;
  let page;
  try {
    fs.writeFileSync(path.join(out, 'actions-and-capture-ledger.jsonl'), '', { flag: 'wx' });
    const manifest = read(manifestFile);
    const expectedHashes = {
      [manifestFile]: 'c801504ad263a346f2f9a377599194e109a347b4d08cddf843696c4cca42a4d8',
      [path.join(base, 'html/ana10-c6-s3-n88/text.html')]:
        'f48973a4ab39c0c288f18f4c298806f5e1915abf7ebe74dc7328c3327f7f347c',
      [path.join(base, 'html/ana10-c6-s3-n88/exercises.html')]:
        'b9777739bc5dbeb59befcfc0e1e55ce174b6a5bd933da4142357e089078deb85',
    };
    const snapshots = manifest.sourceTextAndSvgCopies.map(x => ({
      ...x.snapshot, path: path.resolve(root, x.snapshot.path),
    }));
    const inputs = [manifestFile, ...manifest.outputs.map(x => path.resolve(root, x.path)),
      ...snapshots.map(x => x.path), self,
      path.join(root, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'),
      path.join(root, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js'),
      path.join(root, 'app/package.json')];
    evidence.inputs = [...new Set(inputs)].map(bind);
    for (const input of evidence.inputs) {
      const expected = expectedHashes[input.path]
        || snapshots.find(x => x.path === input.path)?.sha256;
      if (expected) assert.equal(input.sha256, expected, `Immutable input mismatch: ${input.path}`);
    }
    const require = createRequire(path.join(root, 'app/package.json'));
    const { chromium } = require('playwright');
    const { inline, proseInline, proseFlow } = require(
      path.join(root, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
    evidence.playwrightEntry = bind(require.resolve('playwright'));
    const lesson = read(snapshots.find(x => /\/lesson\.json$/.test(x.path)).path);
    const exercises = read(snapshots.find(x => /\/exercises\.json$/.test(x.path)).path);
    const flow = proseFlow(lesson.prose, lesson.section_breaks);
    const prose = flow.filter(b => !['fig', 'cap'].includes(b.kind));
    const figures = flow.filter(b => b.kind === 'fig');
    assert.equal(figures.length, 4);
    assert.deepEqual(figures.map(f => f.id), ['fig-38', 'fig-39', 'fig-40', 'fig-41']);
    assert.equal(exercises.exercises.length, 34);
    assert.equal(exercises.count, 34);
    // Current renderer strips a matching printed numeric prefix, not arbitrary leading digits.
    const written = exercises.exercises.map(e => {
      assert(/^\d+$/.test(String(e.source_number)));
      const prefix = e.text.match(/^\s*(\d+)([.°*])\s*/);
      const text = prefix && prefix[1] === String(e.source_number)
        ? e.text.slice(prefix[0].length) : e.text;
      return { number: String(e.number), html: inline(text) };
    });
    const expected = {
      prose: prose.map(b => ({ html: proseInline(b.text), section: Boolean(b.sectionBreak) })),
      written, figures: figures.map(f => ({ id: f.id, label: f.label,
        caption: proseInline(flow.find(b => b.kind === 'cap' && b.label === f.label).text) })),
      title: inline(lesson.printed_title || lesson.title),
      writtenTitle: inline(`${lesson.printed_title || lesson.title} \u00b7 \u4e60\u9898`),
      groups: exercises.exercises.filter((e, i, items) => i === 0 || e.group !== items[i - 1].group)
        .map(e => proseInline(e.group || '\u7ec3\u4e60')),
    };
    write('derived-targets.json', { lessonId: lesson.id, expected,
      proseText: prose.map(b => b.text), figureIds: figures.map(f => f.id),
      exerciseNumbers: written.map(x => x.number),
      derivation: 'Current manifest snapshots; htmlfrag proseFlow/proseInline/inline and current renderer numeric-prefix semantics. No N81 content.' });
    browser = await chromium.launch({ channel: 'chrome', headless: false });
    evidence.browserLaunches++;
    evidence.browserVersion = browser.version();
    context = await browser.newContext({ viewport, serviceWorkers: 'block' });
    await context.route('**/*', async route => {
      const url = route.request().url();
      const protocol = new URL(url).protocol;
      evidence.requests.push({ url, method: route.request().method(), protocol });
      if (['file:', 'data:', 'blob:'].includes(protocol)) await route.continue();
      else {
        evidence.blockedRequests.push(url);
        await route.abort('blockedbyclient');
      }
    });
    page = await context.newPage();
    page.setDefaultTimeout(12000);
    page.on('console', msg => evidence.console.push({
      type: msg.type(), text: msg.text(), location: msg.location(), url: page.url(),
    }));
    page.on('pageerror', error => evidence.pageErrors.push({ message: error.message,
      stack: error.stack, url: page.url() }));
    page.on('requestfailed', request => evidence.requestFailures.push({
      url: request.url(), failure: request.failure(),
    }));
    const fontsReady = async () => {
      await page.evaluate(async () => {
        await document.fonts.ready;
        const nodes = document.querySelectorAll('.katex-html span,.prose-math,.sr-prose-math,svg text,svg tspan');
        const requests = new Map();
        for (const node of nodes) {
          const s = getComputedStyle(node);
          const font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
          requests.set(font, (requests.get(font) || '') + (node.textContent || 'x'));
        }
        await Promise.all([...requests].map(([font, text]) => document.fonts.load(font, text)));
        await document.fonts.ready;
      });
    };
    const goto = async (file, fragment = '') => {
      const url = pathToFileURL(path.join(base, 'html/ana10-c6-s3-n88', file)).href + fragment;
      await page.goto(url, { waitUntil: 'load' });
      await fontsReady();
      action({ kind: fragment ? 'native-fragment-navigation' : 'file-navigation',
        url, observedUrl: page.url(), scroll: await page.evaluate(() => ({ x: scrollX, y: scrollY })) });
    };
    const scrollState = () => page.evaluate(() => ({
      x: scrollX, y: scrollY, maxY: document.documentElement.scrollHeight - innerHeight,
    }));
    const wheel = async (deltaY, label, x = 1310, y = 480) => {
      const before = await scrollState();
      await page.mouse.move(x, y);
      await page.mouse.wheel(0, deltaY);
      const target = Math.max(0, Math.min(before.maxY, before.y + deltaY));
      await page.waitForFunction(targetY => Math.abs(scrollY - targetY) <= 2, target,
        { timeout: 6000 });
      const after = await scrollState();
      action({ kind: 'native-mouse-wheel', label, deltaY, pointer: { x, y }, before, after });
      return after;
    };
    const align = async (locator, label, top = 40) => {
      const box = await locator.boundingBox();
      assert(box, `Missing scroll target: ${label}`);
      await wheel(box.y - top, label);
    };
    const traverse = async (name, direction) => {
      let state = await scrollState();
      for (let step = 0; step < 120; step++) {
        const remaining = direction > 0 ? state.maxY - state.y : state.y;
        if (remaining <= 2) break;
        state = await wheel(direction * Math.min(700, remaining), `${name}-${direction > 0 ? 'down' : 'up'}-${step}`);
      }
      check(`${name}-native-scroll-${direction > 0 ? 'end' : 'start'}`,
        direction > 0 ? Math.abs(state.y - state.maxY) <= 2 : state.y <= 2, state);
    };
    const comparePage = async name => {
      const state = await page.evaluate(({ name, expected }) => {
        const signature = element => {
          const copy = element.cloneNode(true);
          for (const math of copy.querySelectorAll('.katex')) {
            const annotation = math.querySelector('annotation');
            math.replaceWith(document.createTextNode('$' + (annotation?.textContent || 'MISSING') + '$'));
          }
          for (const br of copy.querySelectorAll('br')) br.replaceWith(document.createTextNode('\n'));
          return copy.textContent.replace(/\s+/g, ' ').trim();
        };
        const sigHtml = html => {
          const node = document.createElement('div');
          node.innerHTML = html;
          return signature(node);
        };
        const compare = (selector, items) => {
          const nodes = [...document.querySelectorAll(selector)];
          return { count: nodes.length, expectedCount: items.length,
            comparisons: items.map((item, index) => ({
              index, expected: sigHtml(item.html), actual: nodes[index] ? signature(nodes[index]) : null,
              match: Boolean(nodes[index]) && signature(nodes[index]) === sigHtml(item.html),
              rect: nodes[index]?.getBoundingClientRect().toJSON(),
            })) };
        };
        const sheet = document.querySelector('.sheet');
        const children = [...sheet.children].map(el => ({
          tag: el.tagName, id: el.id, class: el.className, rect: el.getBoundingClientRect().toJSON(),
        }));
        const title = document.querySelector('h1');
        const titleMatches = signature(title) === sigHtml(name === 'text' ? expected.title : expected.writtenTitle);
        return { name, url: location.href, viewport: { width: innerWidth, height: innerHeight },
          fonts: { status: document.fonts.status, faces: [...document.fonts].map(f => ({
            family: f.family, weight: f.weight, style: f.style, status: f.status,
          })) },
          errors: [...document.querySelectorAll('.err,.katex-error,.sr-tex-err')].map(el => el.textContent),
          horizontalPageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          prose: name === 'text' ? compare('p.para', expected.prose) : null,
          written: name === 'written' ? compare('li.ex .body', expected.written) : null,
          title: { matches: titleMatches, actual: signature(title), rect: title.getBoundingClientRect().toJSON() },
          captions: name === 'text' ? expected.figures.map(f => {
            const figure = document.getElementById(f.id);
            const cap = figure?.querySelector('figcaption');
            const media = figure?.querySelector('.figure-media');
            return { id: f.id, match: Boolean(cap) && signature(cap) === sigHtml(f.caption),
              mediaRect: media?.getBoundingClientRect().toJSON(), rect: cap?.getBoundingClientRect().toJSON(),
              labelMatches: figure?.getAttribute('aria-label') === f.label };
          }) : [],
          sectionComparisons: name === 'text' ? expected.prose.map((p, i) =>
            Boolean(document.querySelectorAll('p.para')[i]?.classList.contains('section')) === p.section) : [],
          groupComparisons: name === 'written' ? compare('.exgroup', expected.groups.map(html => ({ html }))) : null,
          exerciseIds: name === 'written' ? [...document.querySelectorAll('li.ex')].map(el => el.id) : [],
          documentChildOrder: children,
          childOverlaps: children.slice(1).flatMap((child, index) =>
            child.rect.top < children[index].rect.bottom - 1 ? [{ before: children[index], after: child }] : []),
          links: [...document.querySelectorAll('a[href]')].map(el => ({
            text: el.textContent, href: el.getAttribute('href'), resolvedHref: el.href,
          })),
          scripts: document.scripts.length,
          disclosedOrInteractiveNodes: document.querySelectorAll('details,input,textarea,select,[data-question-id]').length,
        };
      }, { name, expected });
      evidence.pageStates.push(state);
      check(`${name}-exact-viewport`, JSON.stringify(state.viewport) === JSON.stringify(viewport), state.viewport);
      check(`${name}-fonts-loaded`, state.fonts.status === 'loaded'
        && state.fonts.faces.every(f => f.status !== 'loading' && f.status !== 'error'), state.fonts);
      check(`${name}-render-errors-zero`, state.errors.length === 0, state.errors);
      check(`${name}-no-horizontal-page-overflow`, state.horizontalPageOverflow <= 0, state.horizontalPageOverflow);
      check(`${name}-title-parity`, state.title.matches, state.title);
      check(`${name}-title-and-flow-not-overlapping`, state.childOverlaps.length === 0, state.childOverlaps);
      for (const [key, comparison] of Object.entries({
        prose: state.prose, written: state.written, groups: state.groupComparisons,
      }).filter(([, value]) => value)) {
        check(`${name}-${key}-full-parity`, comparison.count === comparison.expectedCount
          && comparison.comparisons.every(x => x.match), comparison);
      }
      if (name === 'text') {
        check('text-current-section-breaks', state.sectionComparisons.every(Boolean), state.sectionComparisons);
        check('text-captions-bound-and-flowing', state.captions.every(c => c.match && c.labelMatches
          && c.rect.top >= c.mediaRect.bottom - 1), state.captions);
      } else check('written-all-current-identities', JSON.stringify(state.exerciseIds)
        === JSON.stringify(written.map(x => `ex-${x.number}`)), state.exerciseIds);
      check(`${name}-no-answer-or-choice-disclosure`, state.scripts === 0
        && state.disclosedOrInteractiveNodes === 0, {
        scripts: state.scripts, disclosedOrInteractiveNodes: state.disclosedOrInteractiveNodes,
      });
      return state;
    };
    const capture = async (name, locator, details) => {
      assert(evidence.captureAttempts < 6, 'Permanent raster budget exhausted');
      const file = path.join(out, name + '.png');
      assert(!fs.existsSync(file), 'Never overwrite or retry a screenshot');
      evidence.captureAttempts++;
      journal({ type: 'capture-attempt', name, path: file, attempt: evidence.captureAttempts, details });
      if (locator) await locator.screenshot({ path: file, type: 'png', scale: 'css' });
      else await page.screenshot({ path: file, type: 'png', scale: 'css', fullPage: false });
      const result = { name, ...bind(file), viewport, details };
      evidence.captures.push(result);
      journal({ type: 'capture-created', ...result });
    };
    await goto('text.html');
    await comparePage('text');
    await traverse('text', 1);
    await traverse('text', -1);
    for (const f of figures) {
      await goto('text.html', '#' + f.id);
      const locator = page.locator(`figure[id="${f.id}"]`);
      await align(locator, `align-${f.id}`);
      const metrics = await locator.evaluate(el => {
        const svg = el.querySelector('svg');
        const media = el.querySelector('.figure-media');
        const rect = svg.getBoundingClientRect();
        const visible = node => {
          const s = getComputedStyle(node);
          return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > 0;
        };
        const footprint = node => {
          const box = node.getBBox();
          const ctm = node.getScreenCTM();
          const corners = [[box.x, box.y], [box.x + box.width, box.y],
            [box.x, box.y + box.height], [box.x + box.width, box.y + box.height]]
            .map(([x, y]) => new DOMPoint(x, y).matrixTransform(ctm));
          return { left: Math.min(...corners.map(p => p.x)), right: Math.max(...corners.map(p => p.x)),
            top: Math.min(...corners.map(p => p.y)), bottom: Math.max(...corners.map(p => p.y)) };
        };
        const inside = box => box.left >= rect.left - 1 && box.right <= rect.right + 1
          && box.top >= rect.top - 1 && box.bottom <= rect.bottom + 1;
        const labels = [...svg.querySelectorAll('text')].map(node => {
          const glyphs = [...node.querySelectorAll('tspan')];
          const sizes = (glyphs.length ? glyphs : [node]).map(glyph => {
            const ctm = glyph.getScreenCTM();
            return parseFloat(getComputedStyle(glyph).fontSize) * Math.hypot(ctm.a, ctm.b);
          });
          const box = footprint(node);
          return { id: node.dataset.labelId || node.id, text: node.textContent,
            scaledTextPx: Math.min(...sizes), visible: visible(node), footprint: box, inside: inside(box),
            fill: getComputedStyle(node).fill };
        });
        const curves = [...svg.querySelectorAll('[id$="-raw-path-layer"] path')].map((node, index) => ({
          index, visible: visible(node), pathLength: node.getTotalLength(),
          footprint: footprint(node), inside: inside(footprint(node)),
          stroke: getComputedStyle(node).stroke, strokeWidth: getComputedStyle(node).strokeWidth,
        }));
        const points = [...svg.querySelectorAll('circle,ellipse')].filter(visible).map(node => ({
          id: node.id, visible: visible(node), footprint: footprint(node), inside: inside(footprint(node)),
          fill: getComputedStyle(node).fill,
        }));
        const graphics = [...svg.querySelectorAll('path,line,polygon,polyline,circle,ellipse,text')]
          .filter(node => !node.closest('defs') && visible(node)).map(node => ({
            tag: node.tagName, id: node.id, footprint: footprint(node),
            fill: getComputedStyle(node).fill, stroke: getComputedStyle(node).stroke,
          }));
        const overlaps = labels.flatMap((a, i) => labels.slice(i + 1).flatMap(b =>
          Math.min(a.footprint.right, b.footprint.right) - Math.max(a.footprint.left, b.footprint.left) > 1
          && Math.min(a.footprint.bottom, b.footprint.bottom) - Math.max(a.footprint.top, b.footprint.top) > 1
            ? [{ first: a.id, second: b.id }] : []));
        return { id: el.id, hash: location.hash, mediaWidth: media.getBoundingClientRect().width,
          svgRect: rect.toJSON(), figureRect: el.getBoundingClientRect().toJSON(),
          minScaledTextPx: Math.min(...labels.map(l => l.scaledTextPx)),
          labels, labelOverlaps: overlaps, curves, points, graphics,
          horizontalEnd: el.scrollWidth - el.clientWidth, scrollLeft: el.scrollLeft,
          fonts: document.fonts.status };
      });
      evidence.figures.push(metrics);
      check(`${f.id}-native-fragment`, metrics.hash === '#' + f.id, metrics.hash);
      check(`${f.id}-actual-media-width-640`, metrics.mediaWidth === 640, metrics.mediaWidth);
      check(`${f.id}-actual-svg-width-640`, metrics.svgRect.width === 640, metrics.svgRect);
      check(`${f.id}-screen-text-at-least-16`, metrics.minScaledTextPx >= 16, metrics.labels);
      check(`${f.id}-all-labels-visible-inside`, metrics.labels.length > 0
        && metrics.labels.every(l => l.visible && l.inside), metrics.labels);
      check(`${f.id}-no-label-overlap`, metrics.labelOverlaps.length === 0, metrics.labelOverlaps);
      check(`${f.id}-curves-present-visible-inside`, metrics.curves.length > 0
        && metrics.curves.every(c => c.visible && c.pathLength > 0 && c.inside && c.stroke !== 'none'), metrics.curves);
      check(`${f.id}-visible-points-inside`, metrics.points.every(p => p.visible && p.inside), metrics.points);
      check(`${f.id}-complete-normal-width-capture-fit`, metrics.figureRect.left >= 0
        && metrics.figureRect.right <= 1440 && metrics.figureRect.top >= 0
        && metrics.figureRect.bottom <= 960, metrics.figureRect);
      if (metrics.horizontalEnd > 0) {
        const box = await locator.boundingBox();
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.wheel(metrics.horizontalEnd + 500, 0);
        await page.waitForFunction(id => {
          const el = document.getElementById(id);
          return Math.abs(el.scrollLeft - (el.scrollWidth - el.clientWidth)) <= 1;
        }, f.id);
        action({ kind: 'native-figure-horizontal-wheel-end', id: f.id,
          scrollLeft: await locator.evaluate(el => el.scrollLeft) });
        await page.mouse.wheel(-metrics.horizontalEnd - 500, 0);
        await page.waitForFunction(id => document.getElementById(id).scrollLeft <= 1, f.id);
        action({ kind: 'native-figure-horizontal-wheel-start', id: f.id });
      } else action({ kind: 'figure-horizontal-end-already-visible', id: f.id, end: 0 });
      await capture(f.id, locator, { figure: f.id, mediaWidth: metrics.mediaWidth,
        minScaledTextPx: metrics.minScaledTextPx, captionIncluded: true });
    }
    const roundingStart = prose.findIndex(b =>
      b.text.includes('3.078') && b.text.includes('\u4f8b1'));
    const roundingEnd = prose.findIndex(b =>
      b.text.includes('0.3141') && b.text.includes('0.3142'));
    const poleStart = prose.findIndex(b =>
      b.text.includes('\u95ed\u533a\u95f4') && b.text.includes('\u4e0d\u80fd\u91cd\u590d'));
    const poleEnd = poleStart + 1;
    assert(roundingStart >= 0 && roundingEnd >= roundingStart && poleStart >= 0);
    for (const region of [
      { name: 'rounding-table-qualification', start: roundingStart, end: roundingEnd },
      { name: 'periodic-pole-endpoint-qualification', start: poleStart, end: poleEnd },
    ]) {
      await align(page.locator('p.para').nth(region.start), region.name, 60);
      const metrics = await page.evaluate(({ start, end }) =>
        [...document.querySelectorAll('p.para')].slice(start, end + 1).map((el, i) => ({
          index: start + i, text: el.innerText, rect: el.getBoundingClientRect().toJSON(),
        })), region);
      check(`${region.name}-all-qualification-text-visible`,
        metrics.every(m => m.rect.top >= 0 && m.rect.bottom <= 960
          && m.rect.left >= 0 && m.rect.right <= 1440), metrics);
      await capture(region.name, null, { ...region, metrics });
    }
    await traverse('text-before-navigation', 1);
    const textLink = page.locator('a[href="exercises.html"]');
    await textLink.click();
    await page.waitForURL(pathToFileURL(path.join(base, 'html/ana10-c6-s3-n88/exercises.html')).href);
    await fontsReady();
    action({ kind: 'native-link-click', from: 'text', to: 'written', observedUrl: page.url() });
    await comparePage('written');
    for (const number of [written[0].number, written[Math.floor(written.length / 2)].number,
      written.at(-1).number]) {
      await goto('exercises.html', '#ex-' + number);
      const rect = await page.locator(`li.ex[id="ex-${number}"]`).boundingBox();
      check(`written-native-anchor-${number}`, page.url().endsWith('#ex-' + number)
        && rect && rect.y < 960 && rect.y + rect.height > 0, { url: page.url(), rect });
    }
    await traverse('written', -1);
    await traverse('written', 1);
    await page.locator('a[href="text.html"]').click();
    await page.waitForURL(pathToFileURL(path.join(base, 'html/ana10-c6-s3-n88/text.html')).href);
    await fontsReady();
    action({ kind: 'native-link-click', from: 'written', to: 'text', observedUrl: page.url() });
    check('native-navigation-both-directions', evidence.nativeActions.filter(a => a.kind === 'native-link-click').length === 2,
      evidence.nativeActions.filter(a => a.kind === 'native-link-click'));
    check('console-errors-zero', evidence.console.filter(c => c.type === 'error').length === 0, evidence.console);
    check('page-errors-zero', evidence.pageErrors.length === 0, evidence.pageErrors);
    check('no-nonlocal-requests', evidence.blockedRequests.length === 0, evidence.blockedRequests);
    check('request-failures-zero', evidence.requestFailures.length === 0, evidence.requestFailures);
    check('exactly-six-new-raster-captures-once', evidence.captureAttempts === 6 && evidence.captures.length === 6,
      { attempts: evidence.captureAttempts, captures: evidence.captures.length });
    evidence.status = evidence.failures.length ? 'HOLD' : 'MECHANICAL_DRAFT_DISPLAY_PASS_VISUAL_PENDING';
  } catch (error) {
    evidence.status = 'HOLD';
    evidence.failure = error.stack;
    evidence.failures.push({ name: 'execution-failure', pass: false, details: error.stack });
    console.error(error.stack);
  } finally {
    try {
      if (context) { await context.close(); evidence.contextClosed = true; }
    } catch (error) { evidence.failures.push({ name: 'context-close', details: error.stack }); }
    try {
      if (browser) { await browser.close(); evidence.browserClosed = true; }
    } catch (error) { evidence.failures.push({ name: 'browser-close', details: error.stack }); }
    evidence.inputHashesAfter = evidence.inputs.map(input => {
      const actual = bind(input.path);
      return { ...actual, unchanged: actual.sha256 === input.sha256 };
    });
    if (evidence.inputHashesAfter.some(x => !x.unchanged)) {
      evidence.failures.push({ name: 'input-changed-during-readonly-check',
        details: evidence.inputHashesAfter.filter(x => !x.unchanged) });
    }
    if (evidence.failures.length) evidence.status = 'HOLD';
    evidence.endedAt = new Date().toISOString();
    write('browser-evidence.json', evidence);
    console.log(JSON.stringify({ status: evidence.status, failures: evidence.failures.map(f => f.name),
      captures: evidence.captures, nativeActions: evidence.nativeActions.length,
      browserClosed: evidence.browserClosed, contextClosed: evidence.contextClosed,
      evidence: bind(path.join(out, 'browser-evidence.json')) }));
    process.exitCode = evidence.status === 'MECHANICAL_DRAFT_DISPLAY_PASS_VISUAL_PENDING' ? 0 : 2;
  }
}
