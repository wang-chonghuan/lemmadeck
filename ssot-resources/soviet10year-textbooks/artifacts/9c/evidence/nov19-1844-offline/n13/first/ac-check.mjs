import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const own = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(own, '../../..');
const app = path.join(root, 'app');
const require = createRequire(path.join(app, 'package.json'));
const { chromium } = require('playwright');
const { PNG } = require(path.join(path.dirname(require.resolve('playwright-core/package.json')), 'lib/utilsBundle.js'));
const renderRoot = path.join(root, '.tmp/ld-s10y-lesson/render/9c/modern-us-neutral/ana9-c3-s1-n13');
const editionRoot = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral');
const lessonRoot = path.join(editionRoot, 'lessons/ana9-c3-s1-n13');
const viewports = [{ name: 'desktop', width: 1440, height: 960 }, { name: 'mobile', width: 390, height: 844 }];
const pages = ['text', 'exercises', 'choices'];
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const json = value => JSON.stringify(value, null, 2) + '\n';
const write = (name, value) => fs.writeFile(path.join(own, name), json(value), { flag: 'wx' });

if (!process.argv.includes('--check') && !process.argv.includes('--freeze') && !process.argv.includes('--pending-only')) {
  if (process.argv.includes('--checker-repair')) {
    const initial = JSON.parse(await fs.readFile(path.join(own, 'results.json'), 'utf8'));
    assert.equal(initial.views.length, 0, 'Never replay an observed view');
    assert.equal(initial.screenshots.length, 0, 'Never recreate screenshots');
    for (const name of ['results.json', 'native.stdout.log', 'native.stderr.log', 'native-receipt.json']) {
      await fs.rename(path.join(own, name), path.join(own, 'initial-native-failure.' + name));
    }
  }
  const startedAt = new Date().toISOString();
  const pendingRepair = process.argv.includes('--pending-repair');
  const suffix = pendingRepair ? 'pending-only.' : '';
  const childArg = pendingRepair ? '--pending-only' : '--check';
  const child = spawn(process.execPath, [fileURLToPath(import.meta.url), childArg], { cwd: app, stdio: ['ignore', 'pipe', 'pipe'] });
  const out = [], err = [];
  child.stdout.on('data', chunk => { out.push(chunk); process.stdout.write(chunk); });
  child.stderr.on('data', chunk => { err.push(chunk); process.stderr.write(chunk); });
  const exitCode = await new Promise((resolve, reject) => { child.on('error', reject); child.on('close', resolve); });
  const stdout = Buffer.concat(out), stderr = Buffer.concat(err);
  await fs.writeFile(path.join(own, suffix + 'native.stdout.log'), stdout, { flag: 'wx' });
  await fs.writeFile(path.join(own, suffix + 'native.stderr.log'), stderr, { flag: 'wx' });
  await write(suffix + 'native-receipt.json', {
    startedAt, finishedAt: new Date().toISOString(), cwd: app,
    command: `${process.execPath} ${fileURLToPath(import.meta.url)}${process.argv.includes('--checker-repair') ? ' --checker-repair' : pendingRepair ? ' --pending-repair' : ''}`,
    childCommand: `${process.execPath} ${fileURLToPath(import.meta.url)} ${childArg}`,
    exitCode, stdout: { path: path.join(own, suffix + 'native.stdout.log'), bytes: stdout.length, sha256: digest(stdout) },
    stderr: { path: path.join(own, suffix + 'native.stderr.log'), bytes: stderr.length, sha256: digest(stderr) },
    checkerOnlyRepair: process.argv.includes('--checker-repair') || pendingRepair, replayedVisualChecks: 0,
  });
  process.exitCode = exitCode ?? 1;
} else if (process.argv.includes('--freeze')) {
  const result = JSON.parse(await fs.readFile(path.join(own, 'results.json'), 'utf8'));
  const visual = JSON.parse(await fs.readFile(path.join(own, 'visual-review.json'), 'utf8'));
  const pending = JSON.parse(await fs.readFile(path.join(own, 'pending-only.results.json'), 'utf8'));
  const fontAdjudications = pending.checks.filter(c => c.criterion === 'stable-embedded-fonts-and-runtime').map(c => {
    assert.equal(c.evidence.status, 'loaded');
    assert.ok(c.evidence.used.every(font => font.available && (font.glyphWidth > 0 || font.sample === '\u200b')));
    return { view: c.view, status: 'PASS', basis: 'Saved actual used-font evidence; only zero-width sample is the intentional U+200B KaTeX spacer. No browser replay.' };
  });
  assert.equal(result.screenshots.length, 6);
  assert.equal(visual.image_usage.loaded, 6);
  assert.equal(visual.image_usage.reopens, 0);
  const files = [];
  for (const name of (await fs.readdir(own)).sort()) {
    if (name === 'freeze.json') continue;
    const bytes = await fs.readFile(path.join(own, name));
    files.push({ path: path.join(own, name), bytes: bytes.length, sha256: digest(bytes) });
  }
  const statuses = visual.views.map(view => view.status);
  await write('freeze.json', {
    status: statuses.includes('FAIL') ? 'FAIL' : statuses.includes('UNKNOWN') ? 'UNKNOWN' : 'PASS',
    scope: 'FIRST offline rendered-page/controls/layout n13 only; not whole-lesson approval',
    files, image_usage: visual.image_usage, selfHashExcluded: true,
    inputFiles: result.inputs, closure: visual.closure, originalNativeExitRetained: result.nativeExit,
    fontAdjudications,
    authorReview: 'pending', independentKeyReview: 'pending', semanticOptionCorrectness: 'UNKNOWN',
  });
  console.log(json({ freeze: path.join(own, 'freeze.json'), status: statuses, files: files.length, closure: result.closure }));
} else if (process.argv.includes('--pending-only')) {
  const initial = JSON.parse(await fs.readFile(path.join(own, 'results.json'), 'utf8'));
  assert.equal(initial.screenshots.length, 6);
  const pending = { scope: 'Checker-only failed/UNKNOWN checks; zero passed-check replay; zero screenshots', checks: [], screenshots: 0, closure: {}, exitCode: 1 };
  const targets = ['desktop-text', 'desktop-choices', 'mobile-text'].map(id => initial.views.find(v => v.id === id));
  const html = new Map();
  for (const name of pages) {
    const filename = path.join(renderRoot, `${name}.html`);
    const bytes = await fs.readFile(filename);
    assert.equal(digest(bytes), initial.inputs.find(input => input.path === filename).sha256, 'Do not review changed input');
    html.set('/' + name + '.html', bytes);
  }
  let server, browser;
  const record = (id, criterion, status, evidence) => {
    const old = initial.views.find(v => v.id === id).checks.find(c => c.criterion === criterion);
    assert.ok(!old || old.status !== 'PASS', 'Passed-check replay forbidden');
    const entry = { view: id, criterion, status, evidence };
    pending.checks.push(entry);
    console.log(JSON.stringify(entry));
  };
  try {
    server = http.createServer((req, res) => {
      const body = html.get(req.url);
      res.writeHead(body ? 200 : 404, { 'Content-Type': 'text/html', 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; font-src data:; img-src data:; script-src 'none'; connect-src 'none'; form-action 'none'" });
      res.end(body ?? 'Not allowed');
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ headless: true, args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'] });
    for (const target of targets) {
      const context = await browser.newContext({ viewport: { width: target.viewport.width, height: target.viewport.height }, deviceScaleFactor: 1, serviceWorkers: 'block' });
      try {
        await context.route('**/*', route => route.request().url().startsWith(origin + '/') && html.has(new URL(route.request().url()).pathname) ? route.continue() : route.abort('blockedbyclient'));
        const page = await context.newPage();
        await page.goto(`${origin}/${target.page}.html`, { waitUntil: 'load' });
        await page.evaluate(async () => { await document.fonts.ready; await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame); });
        if (target.checks.find(c => c.criterion === 'stable-embedded-fonts-and-runtime').status === 'FAIL') {
          const fonts = await page.evaluate(() => {
            const canvas = document.createElement('canvas').getContext('2d');
            const nodes = [...document.querySelectorAll('.katex-html span,.prose-math,.sr-prose-math')].filter(e => e.childNodes.length === 1 && e.firstChild.nodeType === Node.TEXT_NODE && e.textContent.replace(/\u200b/g, '').trim());
            const used = new Map();
            for (const node of nodes) {
              const style = getComputedStyle(node);
              const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
              canvas.font = font;
              used.set(font, { font, sample: node.textContent, available: document.fonts.check(font, node.textContent), glyphWidth: canvas.measureText(node.textContent).width });
            }
            return { status: document.fonts.status, used: [...used.values()], unusedFacesMayRemainUnloaded: true };
          });
          record(target.id, 'stable-embedded-fonts-and-runtime', fonts.status === 'loaded' && fonts.used.every(f => f.available && f.glyphWidth > 0) ? 'PASS' : 'FAIL', fonts);
        }
        if (target.page === 'text') {
          const paint = await page.evaluate(indices => {
            const canvas = document.createElement('canvas').getContext('2d');
            return indices.map(index => {
              const math = document.querySelectorAll('.katex')[index];
              const host = math.closest('.nb'), container = host.getBoundingClientRect();
              const leaves = [...math.querySelectorAll('.katex-html span')].filter(e => e.childNodes.length === 1 && e.firstChild.nodeType === Node.TEXT_NODE && e.textContent.trim());
              const glyphs = leaves.map(node => {
                const style = getComputedStyle(node);
                canvas.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
                const metrics = canvas.measureText(node.textContent);
                const range = document.createRange();
                range.selectNodeContents(node);
                const r = range.getBoundingClientRect();
                const baseline = r.top + metrics.fontBoundingBoxAscent;
                const top = baseline - metrics.actualBoundingBoxAscent;
                const bottom = baseline + metrics.actualBoundingBoxDescent;
                return { text: node.textContent, font: canvas.font, rangeHeight: r.height, fontBoxHeight: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent,
                  baseline, glyphTop: top, glyphBottom: bottom, hostTop: container.top, hostBottom: container.bottom,
                  bottomClearance: container.bottom - bottom,
                  uncertainMetrics: Math.abs(r.height - metrics.fontBoundingBoxAscent - metrics.fontBoundingBoxDescent) > 1,
                  actualGlyphClipped: top < container.top - 0.5 || bottom > container.bottom + 0.5 };
              });
              return { index, tex: math.querySelector('annotation').textContent, glyphs, conclusion: glyphs.some(g => g.uncertainMetrics) ? 'UNKNOWN' : glyphs.some(g => g.actualGlyphClipped) ? 'FAIL' : 'PASS' };
            });
          }, target.measurements.formulae.filter(f => f.clips.length).map(f => f.index));
          const status = paint.some(f => f.conclusion === 'FAIL') ? 'FAIL' : paint.some(f => f.conclusion === 'UNKNOWN') ? 'UNKNOWN' : 'PASS';
          record(target.id, 'all-math-no-painted-clipping', status, { correctedToActualGlyphInkMetrics: true, formulae: paint });
          if (status !== 'PASS') {
            record(target.id, 'dependent-scroll-controls-navigation', 'UNKNOWN', 'Actual paint clipping failed or remains uncertain. Stop dependent checks; do not take new images.');
            continue;
          }
          const scrolling = await page.evaluate(async () => {
            const hosts = [...document.querySelectorAll('*')].filter(e => !['BODY', 'HTML'].includes(e.tagName) && ['auto', 'scroll'].includes(getComputedStyle(e).overflowX) && e.scrollWidth > e.clientWidth + 1);
            const rows = [];
            for (const host of hosts) {
              host.scrollIntoView({ block: 'center' });
              host.scrollLeft = host.scrollWidth;
              await new Promise(requestAnimationFrame);
              const right = host.getBoundingClientRect().right;
              const max = host.scrollWidth - host.clientWidth;
              const final = [...host.querySelectorAll('.katex-html')].map(e => e.getBoundingClientRect().right);
              rows.push({ host: host.className, max, actual: host.scrollLeft, finalMathRight: final, hostRight: right, pass: Math.abs(host.scrollLeft - max) <= 1 && final.every(x => x <= right + 1) });
              host.scrollLeft = 0;
            }
            return rows;
          });
          record(target.id, 'every-long-formula-nested-scroll-end', scrolling.every(row => row.pass) ? 'PASS' : 'FAIL', scrolling);
          if (scrolling.some(row => !row.pass)) {
            record(target.id, 'dependent-scroll-controls-navigation', 'UNKNOWN', 'Stop after true nested-scroll failure.');
            continue;
          }
          const reach = await page.evaluate(async () => {
            let rows = 0;
            const nodes = [...document.querySelectorAll('p.para,figure,.jump')];
            for (const node of nodes) {
              node.scrollIntoView({ block: 'center' });
              await new Promise(requestAnimationFrame);
              const r = node.getBoundingClientRect();
              if (r.bottom <= 0 || r.top >= innerHeight) throw new Error('Unreachable block');
              const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
              while (walker.nextNode()) {
                const text = walker.currentNode;
                if (!text.textContent.trim() || text.parentElement.closest('.katex-mathml,svg')) continue;
                const range = document.createRange();
                range.selectNodeContents(text);
                for (const box of range.getClientRects()) {
                  if (!box.width || !box.height) continue;
                  const y = box.top + scrollY;
                  scrollTo(0, y - innerHeight / 2);
                  await new Promise(requestAnimationFrame);
                  if (y - scrollY < 0 || y - scrollY > innerHeight) throw new Error('Unreachable text row');
                  rows++;
                }
              }
            }
            return { blocks: nodes.length, textFragmentsReached: rows };
          });
          record(target.id, 'scrolling-all-prose-subpart-option-rows-reachable', 'PASS', reach);
          const jump = page.getByRole('link');
          const href = await jump.getAttribute('href');
          await jump.click();
          await page.waitForURL(`${origin}/${href}`);
          record(target.id, 'existing-navigation-link-reachable', 'PASS', { target: href, reached: page.url() });
        }
      } finally {
        await context.close();
      }
    }
    pending.exitCode = pending.checks.some(c => c.status !== 'PASS') ? 1 : 0;
  } catch (error) {
    pending.error = error.stack;
    console.error(error.stack);
  } finally {
    if (browser) { await browser.close(); pending.closure.browser = browser.isConnected() ? 'FAIL' : 'closed'; }
    if (server) { await new Promise(resolve => server.close(resolve)); pending.closure.server = server.listening ? 'FAIL' : 'closed'; }
    await write('pending-only.results.json', pending);
    console.log(JSON.stringify({ pendingExit: pending.exitCode, checks: pending.checks.length, screenshots: 0, closure: pending.closure }));
    process.exitCode = pending.exitCode;
  }
} else {
  const result = {
    scope: 'STEMROBIN-184 B n13 FIRST offline visual acceptance',
    startedAt: new Date().toISOString(), status: 'UNKNOWN', nativeExit: 1,
    isolation: { headless: true, appStarted: false, database: false, outsideNetwork: 'blocked', desktopWindows: 0 },
    inputs: [], screenshots: [], views: [], blockedRequests: [], requests: [], errors: [],
    closure: { browser: 'not-started', server: 'not-started' },
  };
  const raw = new Map();
  async function readInput(filename) {
    const bytes = await fs.readFile(filename);
    raw.set(filename, bytes);
    result.inputs.push({ path: filename, bytes: bytes.length, sha256: digest(bytes) });
    return bytes.toString('utf8');
  }
  let browser, server, current;
  const record = (view, criterion, status, evidence) => {
    const entry = { criterion, status, evidence };
    view.checks.push(entry);
    console.log(JSON.stringify({ view: view.id, ...entry }));
    return status === 'PASS';
  };
  const check = (view, criterion, truth, evidence) => record(view, criterion, truth ? 'PASS' : 'FAIL', evidence);
  try {
    const html = new Map();
    for (const name of pages) html.set(`/${name}.html`, Buffer.from(await readInput(path.join(renderRoot, `${name}.html`))));
    const lesson = JSON.parse(await readInput(path.join(lessonRoot, 'lesson.json')));
    const exercises = JSON.parse(await readInput(path.join(lessonRoot, 'exercises.json')));
    const manifest = JSON.parse(await readInput(path.join(lessonRoot, 'figures.json')));
    const audit = JSON.parse(await readInput(path.join(lessonRoot, 'adaptation.audit.json')));
    const choices = JSON.parse(await readInput(path.join(root, '.tmp/stemrobin-184-resume/n13-choice-view-only.json')));
    assert.equal(manifest.figures.length, 1);
    const figure = manifest.figures[0];
    const allowedFigurePath = value => {
      const resolved = path.resolve(editionRoot, value);
      assert.ok(resolved.startsWith(editionRoot + path.sep));
      return resolved;
    };
    const spec = JSON.parse(await readInput(allowedFigurePath(figure.spec)));
    await readInput(allowedFigurePath(figure.render));
    await readInput(allowedFigurePath(figure.review));
    const svg = await readInput(allowedFigurePath(figure.svg));
    assert.equal(spec.display.minTextPx, 16);
    assert.equal(exercises.count, 1);
    assert.equal(exercises.exercises[0].number, '115');
    assert.equal(choices.questions.length, 4);
    assert.equal(choices.questions.reduce((sum, q) => sum + q.view.options.length, 0), 13);
    assert.equal(audit.proseBlocks, lesson.prose.length);
    const paragraphs = lesson.prose.filter(item => item.kind === 'p').flatMap(item => item.text.split(/\n\s*\n/));
    const normalize = value => value.replace(/\$/g, '').replace(/\s|\u200b/g, '');
    const expected = {
      paragraphs: paragraphs.map(normalize),
      exercise: normalize(exercises.exercises[0].text),
      exerciseMath: exercises.exercises[0].lines.slice(1).map(line => line.match(/\$([^$]+)\$/)[1]),
      questions: choices.questions.map(q => ({ id: q.id, stem: normalize(q.view.stem), options: q.view.options.map(o => ({ id: o.id, text: normalize(o.text) })) })),
      figure: { id: figure.id, spec, svg },
    };
    server = http.createServer((req, res) => {
      const body = html.get(req.url);
      result.requests.push({ method: req.method, path: req.url, status: body && req.method === 'GET' ? 200 : 404 });
      if (!body || req.method !== 'GET') { res.writeHead(404); res.end('Not in offline allowlist'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; font-src data:; img-src data:; connect-src 'none'; script-src 'none'; base-uri 'none'; form-action 'none'" });
      res.end(body);
    });
    await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
    result.closure.server = 'running';
    const origin = `http://127.0.0.1:${server.address().port}`;
    result.origin = origin;
    const startup = await fetch(`${origin}/text.html`);
    assert.equal(startup.status, 200);
    await startup.arrayBuffer();
    console.log(JSON.stringify({ startup: 'PASS', origin, inMemoryFiles: 3 }));
    browser = await chromium.launch({ headless: true, args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'] });
    result.closure.browser = 'running';
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1, serviceWorkers: 'block' });
      await context.route('**/*', async route => {
        const request = route.request();
        if (request.url().startsWith(origin + '/') && html.has(new URL(request.url()).pathname) && request.method() === 'GET') await route.continue();
        else { result.blockedRequests.push({ url: request.url(), method: request.method() }); await route.abort('blockedbyclient'); }
      });
      try {
        for (const name of pages) {
          current = { id: `${viewport.name}-${name}`, viewport, page: name, checks: [], status: 'UNKNOWN' };
          result.views.push(current);
          const page = await context.newPage();
          const runtimeErrors = [];
          page.on('pageerror', e => runtimeErrors.push(e.message));
          page.on('console', message => { if (message.type() === 'error') runtimeErrors.push(message.text()); });
          try {
            const response = await page.goto(`${origin}/${name}.html`, { waitUntil: 'load' });
            assert.equal(response.status(), 200);
            await page.evaluate(async () => {
              await document.fonts.ready;
              await Promise.all([...document.fonts].map(font => font.load()));
              await document.fonts.ready;
              let previous = '', stable = 0;
              for (let frame = 0; frame < 120; frame++) {
                await new Promise(requestAnimationFrame);
                const value = JSON.stringify([...document.querySelectorAll('h1,p.para,li.ex,figure,.option')].map(e => {
                  const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height];
                }));
                stable = value === previous ? stable + 1 : 0;
                previous = value;
                if (stable >= 4 && document.fonts.status === 'loaded') return;
              }
              throw new Error('Fonts/layout failed to stabilize');
            });
            const shotPath = path.join(own, `${current.id}.png`);
            const bytes = await page.screenshot({ path: shotPath, fullPage: true, animations: 'disabled' });
            const png = PNG.sync.read(bytes);
            const shot = { path: shotPath, bytes: bytes.length, sha256: digest(bytes), width: png.width, height: png.height };
            result.screenshots.push(shot);
            current.screenshot = shot;
            const measured = await page.evaluate(({ name, expected }) => {
              const norm = value => value.replace(/\$/g, '').replace(/\s|\u200b/g, '');
              const reconstructed = element => {
                const copy = element.cloneNode(true);
                copy.querySelectorAll('.katex').forEach(math => math.replaceWith(document.createTextNode(math.querySelector('annotation')?.textContent ?? 'MISSING_ANNOTATION')));
                return norm(copy.textContent);
              };
              const rect = e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom }; };
              const bodyFont = parseFloat(getComputedStyle(document.body).fontSize);
              const literals = [...document.querySelectorAll('.prose-math,.sr-prose-math')].map(e => ({
                text: e.textContent, px: parseFloat(getComputedStyle(e).fontSize),
                parentPx: parseFloat(getComputedStyle(e.closest('.para,.body') ?? e.parentElement).fontSize),
                family: getComputedStyle(e).fontFamily,
              }));
              const katex = [...document.querySelectorAll('.katex')];
              const blocks = [...document.querySelectorAll('.sheet > h1,.sheet > .crumb,.sheet > p.para,.sheet > figure,.sheet > a,.sheet > .exgroup,.sheet > ol')];
              const overlaps = [];
              const intersect = (a, b) => Math.min(a.right, b.right) - Math.max(a.x, b.x) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y) > 1;
              for (let i = 0; i < blocks.length; i++) for (let j = i + 1; j < blocks.length; j++) if (intersect(rect(blocks[i]), rect(blocks[j]))) overlaps.push({ a: blocks[i].tagName + '.' + blocks[i].className, b: blocks[j].tagName + '.' + blocks[j].className });
              for (const parent of document.querySelectorAll('li.ex,.option,.options')) {
                const kids = [...parent.children];
                for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) if (intersect(rect(kids[i]), rect(kids[j]))) overlaps.push({ a: kids[i].className || kids[i].tagName, b: kids[j].className || kids[j].tagName });
              }
              const formulae = katex.map((math, index) => {
                const visual = math.querySelector('.katex-html');
                const leaves = [...visual.querySelectorAll('span')].filter(e => e.children.length === 0 && e.textContent.trim());
                const paint = leaves.flatMap(e => [...e.getClientRects()]).filter(r => r.width > 0 && r.height > 0);
                const bounds = paint.length ? { left: Math.min(...paint.map(r => r.left)), right: Math.max(...paint.map(r => r.right)), top: Math.min(...paint.map(r => r.top)), bottom: Math.max(...paint.map(r => r.bottom)) } : null;
                const clips = [];
                let scroll = null;
                for (let parent = math.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
                  const css = getComputedStyle(parent), r = parent.getBoundingClientRect();
                  if (['auto', 'scroll'].includes(css.overflowX) && parent.scrollWidth > parent.clientWidth + 1 && !scroll) scroll = parent;
                  if (bounds && ['auto', 'scroll', 'hidden', 'clip'].includes(css.overflowY) && (bounds.top < r.top - 1 || bounds.bottom > r.bottom + 1)) clips.push({ axis: 'y', parent: parent.className, bounds, container: rect(parent) });
                  if (bounds && ['hidden', 'clip'].includes(css.overflowX) && (bounds.left < r.left - 1 || bounds.right > r.right + 1)) clips.push({ axis: 'x', parent: parent.className });
                }
                return { index, tex: math.querySelector('annotation')?.textContent, bounds, clips, scrollParent: scroll?.className ?? null };
              });
              let figure = null;
              const container = document.querySelector(`figure[id="${expected.figure.id}"]`);
              if (container) {
                const image = container.querySelector('svg');
                const outer = rect(image);
                const components = [...image.querySelectorAll('[data-label-id],line,[data-arrowhead-for]')].map(e => {
                  const r = rect(e), m = e.getScreenCTM(), style = getComputedStyle(e);
                  const stroke = parseFloat(style.strokeWidth) || 0;
                  return { id: e.getAttribute('data-label-id') || e.id || e.getAttribute('data-arrowhead-for'), tag: e.tagName, bounds: r,
                    minTextPx: e.tagName === 'text' ? parseFloat(style.fontSize) * Math.min(Math.hypot(m.a, m.b), Math.hypot(m.c, m.d)) : null,
                    strokePx: stroke * Math.max(Math.hypot(m.a, m.b), Math.hypot(m.c, m.d)),
                    visible: style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0,
                    clipped: r.x - stroke / 2 < outer.x - 1 || r.right + stroke / 2 > outer.right + 1 || r.y - stroke / 2 < outer.y - 1 || r.bottom + stroke / 2 > outer.bottom + 1 };
                });
                const canonical = new DOMParser().parseFromString(expected.figure.svg, 'image/svg+xml').documentElement;
                const labels = [...canonical.querySelectorAll('[data-label-id]')].map(e => ({ id: e.getAttribute('data-label-id'), text: e.textContent }));
                const displayed = [...image.querySelectorAll('[data-label-id]')].map(e => ({ id: e.getAttribute('data-label-id'), text: e.textContent }));
                figure = { bounds: outer, pageBounds: { ...outer, y: outer.y + scrollY, bottom: outer.bottom + scrollY }, components, labelsMatch: JSON.stringify(labels) === JSON.stringify(displayed),
                  labelCount: labels.length, minTextPx: Math.min(...components.filter(c => c.minTextPx !== null).map(c => c.minTextPx)),
                  minDeclared: expected.figure.spec.display.minTextPx,
                  widthExpected: Math.min(expected.figure.spec.display.maxWidthPx, container.clientWidth), container: rect(container) };
              }
              const paragraphText = [...document.querySelectorAll('p.para')].map(reconstructed);
              const exercise = document.querySelector('#ex-115');
              const questionRows = [...document.querySelectorAll('[data-question-id]')].map(row => ({ id: row.dataset.questionId, stem: reconstructed(row.querySelector('.stem')), options: [...row.querySelectorAll('.option')].map(label => ({ id: label.querySelector('input').value, text: reconstructed(label.querySelector('.option-text')) })) }));
              return {
                bodyFont, literals, katexCount: katex.length, katexErrors: document.querySelectorAll('.katex-error,.err').length,
                missingMath: katex.filter(e => !e.querySelector('.katex-html') || !e.querySelector('annotation')).length,
                fonts: [...document.fonts].map(f => ({ family: f.family, status: f.status })), fontStatus: document.fonts.status,
                width: { viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth },
                overlaps, formulae, figure, figureCount: document.querySelectorAll('figure,.figure-media').length / 2,
                paragraphText, paragraphExpected: expected.paragraphs, paragraphMatch: JSON.stringify(paragraphText) === JSON.stringify(expected.paragraphs),
                exerciseCount: document.querySelectorAll('li.ex').length,
                exerciseMatch: exercise ? reconstructed(exercise) === expected.exercise : null,
                subparts: exercise ? [...exercise.querySelectorAll('.prose-math')].map(e => e.textContent) : [],
                exerciseMath: exercise ? [...exercise.querySelectorAll('annotation')].map(e => e.textContent) : [],
                questionRows, questionMatch: JSON.stringify(questionRows) === JSON.stringify(expected.questions),
              };
            }, { name, expected });
            current.measurements = measured;
            check(current, 'stable-embedded-fonts-and-runtime', measured.fontStatus === 'loaded' && runtimeErrors.length === 0, { fontFaces: measured.fonts.length, runtimeErrors });
            const contentOk = name === 'text'
              ? check(current, 'all-expected-paragraphs', measured.paragraphMatch, { expected: measured.paragraphExpected.length, actual: measured.paragraphText.length, mismatches: measured.paragraphText.map((p, i) => p === measured.paragraphExpected[i] ? null : i).filter(i => i !== null) })
              : name === 'exercises'
                ? check(current, 'one-exercise115-all-four-subparts', measured.exerciseCount === 1 && measured.exerciseMatch && JSON.stringify(measured.subparts) === '["a","b","c","d"]' && JSON.stringify(measured.exerciseMath) === JSON.stringify(expected.exerciseMath), { count: measured.exerciseCount, fullTextMatch: measured.exerciseMatch, subparts: measured.subparts, mathMatch: JSON.stringify(measured.exerciseMath) === JSON.stringify(expected.exerciseMath) })
                : check(current, 'four-questions-thirteen-options-pure-view', measured.questionMatch && measured.questionRows.length === 4 && measured.questionRows.reduce((sum, row) => sum + row.options.length, 0) === 13, { fullViewMatch: measured.questionMatch, questions: measured.questionRows.length, options: measured.questionRows.map(row => row.options.length) });
            check(current, 'katex-no-error', measured.katexCount > 0 && measured.katexErrors === 0 && measured.missingMath === 0, { count: measured.katexCount, errors: measured.katexErrors, missing: measured.missingMath });
            check(current, 'literal-font-consistent-at-least-body', measured.literals.length > 0 && measured.literals.every(l => l.px >= measured.bodyFont && l.px >= l.parentPx && l.family.startsWith('KaTeX_Main')) && Math.max(...measured.literals.map(l => l.px)) - Math.min(...measured.literals.map(l => l.px)) < 0.01, { bodyPx: measured.bodyFont, literals: measured.literals });
            check(current, 'no-entire-page-horizontal-overflow', measured.width.document <= viewport.width + 1 && measured.width.body <= viewport.width + 1 && png.width === viewport.width, measured.width);
            check(current, 'no-incoherent-block-controls-overlap', measured.overlaps.length === 0, measured.overlaps);
            const clippingOk = check(current, 'all-math-no-painted-clipping', measured.formulae.every(f => f.clips.length === 0), measured.formulae.filter(f => f.clips.length));
            check(current, 'shared-figure-placement', measured.figureCount === (name === 'text' ? 1 : 0), { actual: measured.figureCount, expected: name === 'text' ? 1 : 0 });
            if (measured.figure) {
              const f = measured.figure;
              check(current, 'full-svg-effective-width-minimum-text', f.labelsMatch && f.minTextPx >= f.minDeclared && Math.abs(f.bounds.width - f.widthExpected) < 1 && Math.abs(f.bounds.height / f.bounds.width - spec.canvas.height / spec.canvas.width) < 0.002 && f.components.every(c => c.visible && !c.clipped), { actualWidth: f.bounds.width, actualHeight: f.bounds.height, expectedWidth: f.widthExpected, actualMinTextPx: f.minTextPx, declaredMinTextPx: f.minDeclared, labels: f.labelCount, labelsMatch: f.labelsMatch, components: f.components.length, componentFailures: f.components.filter(c => !c.visible || c.clipped) });
              const inkIn = bounds => {
                let ink = 0;
                for (let y = Math.max(0, Math.floor(bounds.y)); y < Math.min(png.height, Math.ceil(bounds.bottom)); y++) for (let x = Math.max(0, Math.floor(bounds.x)); x < Math.min(png.width, Math.ceil(bounds.right)); x++) {
                  const at = (y * png.width + x) * 4;
                  if (Math.min(png.data[at], png.data[at + 1], png.data[at + 2]) < 180 && png.data[at + 3] > 0) ink++;
                }
                return ink;
              };
              const inks = f.components.map(c => {
                const b = c.bounds, pad = Math.max(2, c.strokePx);
                return { id: c.id, tag: c.tag, inkPixels: inkIn({ x: b.x - pad, y: b.y + f.pageBounds.y - f.bounds.y - pad, right: b.right + pad, bottom: b.bottom + f.pageBounds.y - f.bounds.y + pad }) };
              });
              check(current, 'same-screenshot-nonblank-all-figure-parts', inks.every(c => c.inkPixels > 0), { figureInkPixels: inkIn(f.pageBounds), parts: inks });
            }
            if (contentOk && clippingOk) {
              const scrolling = await page.evaluate(() => {
                const long = [...document.querySelectorAll('*')].filter(e => e !== document.body && e !== document.documentElement && ['auto', 'scroll'].includes(getComputedStyle(e).overflowX) && e.scrollWidth > e.clientWidth + 1);
                return long.map(e => {
                  const previous = e.scrollLeft;
                  e.scrollLeft = e.scrollWidth;
                  const r = e.getBoundingClientRect(), max = e.scrollWidth - e.clientWidth;
                  const math = [...e.querySelectorAll('.katex-html')].map(k => { const kr = k.getBoundingClientRect(); return { right: kr.right, hostRight: r.right, endWithin: kr.right <= r.right + 1 }; });
                  const evidence = { host: e.className, clientWidth: e.clientWidth, scrollWidth: e.scrollWidth, end: e.scrollLeft, max, reachableEnd: Math.abs(e.scrollLeft - max) <= 1, math };
                  e.scrollLeft = previous;
                  return evidence;
                });
              });
              check(current, 'every-long-formula-nested-scroll-end', scrolling.every(s => s.reachableEnd && s.math.every(m => m.endWithin)), { scrollers: scrolling.length, rows: scrolling });
              const reached = await page.evaluate(async () => {
                const nodes = [...document.querySelectorAll('p.para,.stem,.option,#ex-115 .prose-math,figure,.jump')];
                const results = [];
                for (const node of nodes) {
                  node.scrollIntoView({ block: 'center', inline: 'nearest' });
                  await new Promise(requestAnimationFrame);
                  const ranges = [];
                  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
                  while (walker.nextNode()) {
                    const text = walker.currentNode;
                    if (!text.textContent.trim() || text.parentElement.closest('.katex-mathml,annotation,svg,script,style')) continue;
                    const range = document.createRange();
                    range.selectNodeContents(text);
                    ranges.push(...range.getClientRects());
                  }
                  const e = node.getBoundingClientRect();
                  const rowYs = [...new Set(ranges.filter(r => r.height && r.width).map(r => Math.round(r.top + scrollY)))];
                  for (const y of rowYs) {
                    scrollTo(0, y - innerHeight / 2);
                    await new Promise(requestAnimationFrame);
                    if (y - scrollY < -1 || y - scrollY > innerHeight + 1) throw new Error(`Unreachable row y=${y}`);
                  }
                  results.push({ node: node.className || node.id, rows: rowYs.length, blockReachable: e.bottom > 0 && e.top < innerHeight });
                }
                scrollTo(0, 0);
                return results;
              });
              check(current, 'scrolling-all-prose-subpart-option-rows-reachable', reached.every(r => r.blockReachable), { elements: reached.length, textRows: reached.reduce((sum, row) => sum + row.rows, 0) });
              if (name === 'choices') {
                const selection = [];
                for (const q of choices.questions) {
                  const row = page.locator(`[data-question-id="${q.id}"]`);
                  for (const option of q.view.options) {
                    const radio = row.locator(`input[type="radio"][value="${option.id}"]`);
                    const beforeOthers = await page.locator(`input[type="radio"]:checked:not([name="${q.id}"])`).evaluateAll(nodes => nodes.map(n => n.name + ':' + n.value));
                    await row.locator(`label:has(input[value="${option.id}"])`).locator('.option-letter').click();
                    assert.equal(await radio.isChecked(), true);
                    assert.equal(await row.locator('input:checked').count(), 1);
                    assert.equal(await radio.evaluate(e => e.labels.length > 0 && e.name === e.closest('[data-question-id]').dataset.questionId), true);
                    const afterOthers = await page.locator(`input[type="radio"]:checked:not([name="${q.id}"])`).evaluateAll(nodes => nodes.map(n => n.name + ':' + n.value));
                    assert.deepEqual(afterOthers, beforeOthers);
                    selection.push({ question: q.id, option: option.id, nativeLabelSelected: true, groupExclusive: true, otherGroupsPreserved: true });
                  }
                }
                check(current, 'native-radio-label-selection-group-exclusivity', selection.length === 13, selection);
              }
              const jump = page.getByRole('link');
              assert.equal(await jump.count(), 1);
              const href = await jump.getAttribute('href');
              assert.ok(html.has('/' + href));
              await jump.click();
              await page.waitForURL(`${origin}/${href}`);
              check(current, 'existing-navigation-link-reachable', page.url() === `${origin}/${href}`, { target: href, finalUrl: page.url() });
            } else {
              record(current, 'dependent-scroll-controls-navigation', 'UNKNOWN', 'Stopped because content or painted-clipping prerequisite failed. No dependent replay.');
            }
            current.status = current.checks.some(c => c.status === 'FAIL') ? 'FAIL' : current.checks.some(c => c.status === 'UNKNOWN') ? 'UNKNOWN' : 'PASS';
          } catch (error) {
            current.status = 'FAIL';
            current.error = { message: error.message, stack: error.stack };
            console.error(JSON.stringify({ view: current.id, failure: current.error }));
            result.errors.push({ view: current.id, ...current.error });
          } finally {
            await page.close();
          }
        }
      } finally {
        await context.close();
      }
    }
    assert.equal(result.screenshots.length, 6);
    result.status = result.views.some(v => v.status === 'FAIL') ? 'FAIL' : result.views.some(v => v.status === 'UNKNOWN') ? 'UNKNOWN' : 'PASS';
    result.nativeExit = result.status === 'PASS' ? 0 : 1;
  } catch (error) {
    result.status = 'FAIL';
    result.errors.push({ message: error.message, stack: error.stack });
    console.error(error.stack);
  } finally {
    if (browser) {
      await browser.close();
      result.closure.browser = browser.isConnected() ? 'FAIL-still-connected' : 'closed';
    }
    if (server) {
      await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
      result.closure.server = server.listening ? 'FAIL-still-listening' : 'closed';
    }
    result.finishedAt = new Date().toISOString();
    result.image_usage = { created: result.screenshots.length, loaded: 0, cumulativeCap: 6, parentImagePayloads: 0 };
    await write('results.json', result);
    console.log(JSON.stringify({ status: result.status, nativeExit: result.nativeExit, views: result.views.map(v => ({ id: v.id, status: v.status })), screenshots: result.screenshots.length, closure: result.closure }));
    process.exitCode = result.nativeExit;
  }
}
