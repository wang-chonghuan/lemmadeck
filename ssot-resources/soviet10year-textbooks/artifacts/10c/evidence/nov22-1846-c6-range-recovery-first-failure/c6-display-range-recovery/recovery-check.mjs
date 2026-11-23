import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import readline from 'node:readline';
import { pathToFileURL } from 'node:url';
import { chromium } from '../../../app/node_modules/playwright/index.mjs';

const ROOT = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
const OUT = path.join(ROOT, '.tmp/stemrobin-184-six/c6-display-range-recovery');
const INPUT = path.join(ROOT, '.tmp/stemrobin-184-six/c6-modern-representation-repair/work/render/10c/modern-us-neutral/ana10-c6-ex');
const OLD = path.join(ROOT, '.tmp/stemrobin-184-six/c6-first-offline-display-review');
const expected = {
  'exercises.html': 'cc33a1856682c63224b915f912d0ff8be6e2dc2144c0aef7285ec2d9f8f6784d',
  'text.html': 'd04e59931019614e84795f559e30f2dcd6f29bd64fa32ba3a0d55acd465de952',
};
const affected = [342, 358, 359, 360, 367, 372, 375, 379];
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const result = {
  schema: 'stemrobin-184/c6-display-range-recovery@1',
  cwd: process.cwd(), argv: process.argv, startedAt: new Date().toISOString(),
  scope: 'ONLY failed/unreached C6 offline display; SAME 184-6 finish=review',
  status: 'RUNNING', inputs: [], originalBindings: [], originalFlags: [],
  stages: [], screenshots: [], faults: [], browserClosed: false,
  counters: { browserInvocations: 1, screenshotsCreated: 0, modelViewsInScript: 0,
    polls: 0, retries: 0, paidAuxiliaryCalls: 0, adjudicationInputs: 0 },
  truncation: { geometryOmitted: 0, logsOmitted: 0 },
};
const save = () => fs.writeFileSync(path.join(OUT, 'browser-evidence.json'), JSON.stringify(result, null, 2) + '\n');
const check = (ok, message) => { if (!ok) throw new Error(message); };
const rl = readline.createInterface({ input: process.stdin });
const queue = [];
let waiting;
rl.on('line', line => { if (waiting) { const resolve = waiting; waiting = null; resolve(line); } else queue.push(line); });
const receive = () => queue.length ? Promise.resolve(queue.shift()) : new Promise(resolve => { waiting = resolve; });

async function ranges(page, ownerIds) {
  return page.evaluate(ids => {
    const flags = [];
    const owners = [];
    const box = e => {
      const r = e.getBoundingClientRect();
      return { x: r.x, y: r.y + scrollY, right: r.right, bottom: r.bottom + scrollY, width: r.width, height: r.height };
    };
    for (const id of ids) {
      const owner = document.getElementById(`ex-${id}`);
      if (!owner) throw new Error(`Missing display owner ${id}`);
      const body = owner.querySelector('.body');
      const nodes = [];
      const math = [...body.querySelectorAll('.katex')];
      for (let mathIndex = 0; mathIndex < math.length; mathIndex++) {
        const visual = math[mathIndex].querySelector('.katex-html');
        const nb = math[mathIndex].closest('.nb');
        const walker = document.createTreeWalker(visual, NodeFilter.SHOW_TEXT);
        let node;
        let textIndex = -1;
        while ((node = walker.nextNode())) {
          textIndex++;
          if (!node.textContent.replace(/[\s\u200b]/g, '')) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          let rangeIndex = -1;
          for (const glyph of range.getClientRects()) {
            rangeIndex++;
            if (!glyph.width || !glyph.height) continue;
            for (let ancestor = nb || body; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) {
              const css = getComputedStyle(ancestor);
              const ar = ancestor.getBoundingClientRect();
              const top = ar.top + ancestor.clientTop;
              const bottom = top + ancestor.clientHeight;
              if (/hidden|clip|auto|scroll/.test(css.overflowY) &&
                  (glyph.top < top - 2 || glyph.bottom > bottom + 2)) {
                const item = {
                  type: 'font-layout-range-vs-scrollbox', owner: id,
                  mathIndex, textIndex, rangeIndex, text: node.textContent,
                  glyphParentClass: node.parentElement.className,
                  ancestor: ancestor.className, overflowX: css.overflowX, overflowY: css.overflowY,
                  excessTop: top - glyph.top, excessBottom: glyph.bottom - bottom,
                  rangeBox: { x: glyph.x, y: glyph.y + scrollY, width: glyph.width, height: glyph.height,
                    right: glyph.right, bottom: glyph.bottom + scrollY },
                  glyphElementBox: box(node.parentElement),
                  clipBox: { x: ar.left + ancestor.clientLeft, top: top + scrollY,
                    right: ar.left + ancestor.clientLeft + ancestor.clientWidth, bottom: bottom + scrollY },
                  elementLayoutIsInkProof: false,
                };
                flags.push(item);
                nodes.push({ mathIndex, textIndex, text: node.textContent, className: node.parentElement.className });
              }
            }
          }
        }
      }
      owners.push({ owner: id, box: box(owner), flaggedNodes: nodes });
    }
    return { tolerancePx: 2, flags, owners, omitted: 0, method: 'Range font layout, NOT painted ink' };
  }, ownerIds);
}

async function scrollReachability(page) {
  return page.evaluate(() => {
    const records = [];
    for (const el of document.querySelectorAll('li.ex .nb,li.ex .body')) {
      if (el.scrollWidth <= el.clientWidth + 1) continue;
      const css = getComputedStyle(el);
      if (!/auto|scroll/.test(css.overflowX)) continue;
      const owner = Number(el.closest('li.ex').id.slice(3));
      const same = [...el.closest('.body').querySelectorAll('.nb')];
      const nbIndex = el.matches('.nb') ? same.indexOf(el) : null;
      el.scrollTo({ left: 0, behavior: 'instant' });
      const start = el.scrollLeft;
      const max = el.scrollWidth - el.clientWidth;
      el.scrollTo({ left: max, behavior: 'instant' });
      const end = el.scrollLeft;
      const er = el.getBoundingClientRect();
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let last = null;
      let node;
      while ((node = walker.nextNode())) {
        if (node.parentElement.closest('.katex-mathml')) continue;
        if (node.textContent.replace(/[\s\u200b]/g, '')) last = node;
      }
      let terminal = null;
      if (last) {
        const range = document.createRange();
        range.setStart(last, Math.max(0, last.textContent.length - 1));
        range.setEnd(last, last.textContent.length);
        const r = range.getBoundingClientRect();
        terminal = { text: last.textContent, left: r.left, right: r.right,
          clipLeft: er.left + el.clientLeft, clipRight: er.left + el.clientLeft + el.clientWidth };
      }
      const reachesEnd = Math.abs(end - max) <= 1 && start === 0;
      const terminalReachable = terminal && terminal.right <= terminal.clipRight + 1 &&
        terminal.right > terminal.clipLeft && terminal.left < terminal.clipRight;
      records.push({ owner, className: el.className, nbIndex,
        clientWidth: el.clientWidth, scrollWidth: el.scrollWidth, start, max, end,
        terminal, reachesEnd, terminalReachable, geometryOnly: true });
      el.scrollTo({ left: 0, behavior: 'instant' });
    }
    return records;
  });
}

async function capture(page, stage, name, target, required = [], endScrollport = null) {
  check(result.screenshots.length < 8, 'Screenshot budget exhausted');
  const coverage = await page.evaluate(({ target, required, endScrollport }) => {
    for (const el of document.querySelectorAll('li.ex .nb,li.ex .body')) el.scrollTo({ left: 0, behavior: 'instant' });
    let y = 0;
    if (target === 'bottom') y = document.documentElement.scrollHeight - innerHeight;
    else if (typeof target === 'number') y = document.getElementById(`ex-${target}`).getBoundingClientRect().top + scrollY - 24;
    scrollTo({ top: Math.max(0, y), behavior: 'instant' });
    if (endScrollport) {
      const owner = document.getElementById(`ex-${endScrollport.owner}`);
      const el = endScrollport.nbIndex === null ? owner.querySelector('.body') : owner.querySelectorAll('.nb')[endScrollport.nbIndex];
      el.scrollTo({ left: el.scrollWidth - el.clientWidth, behavior: 'instant' });
    }
    const visible = [...document.querySelectorAll('li.ex')].map(e => {
      const r = e.getBoundingClientRect();
      return { owner: Number(e.id.slice(3)), x: r.x, top: r.top, right: r.right, bottom: r.bottom,
        fullyInViewport: r.top >= 0 && r.bottom <= innerHeight };
    }).filter(r => r.bottom > 0 && r.top < innerHeight);
    return { scrollX, scrollY, documentHeight: document.documentElement.scrollHeight,
      visible, required, complete: required.every(id => visible.some(v => v.owner === id && v.fullyInViewport)), endScrollport };
  }, { target, required, endScrollport });
  check(coverage.complete, `${name}: planned affected pixel coverage insufficient`);
  const file = path.join(OUT, `${name}.png`);
  check(!fs.existsSync(file), 'Screenshot replay forbidden');
  await page.screenshot({ path: file, fullPage: false, animations: 'disabled' });
  result.screenshots.push({ path: file, filename: `${name}.png`, sha256: hash(file),
    stage, coverage, creationCount: 1, modelViewCount: 0 });
  result.counters.screenshotsCreated++;
  save();
}

async function mobileGeometry(page) {
  return page.evaluate(() => {
    const faults = [];
    const rect = e => { const r = e.getBoundingClientRect(); return {
      x: r.x, y: r.y + scrollY, right: r.right, bottom: r.bottom + scrollY, width: r.width, height: r.height,
    }; };
    const overlap = (a, b) => Math.min(a.right, b.right) - Math.max(a.x, b.x) > 2 &&
      Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y) > 2;
    const owners = [...document.querySelectorAll('li.ex')];
    const ids = owners.map(e => Number(e.id.slice(3)));
    if (ids.length !== 57 || !ids.every((id, i) => id === 335 + i)) faults.push({ type: 'mobile-owner-render-order', ids });
    const sheet = rect(document.querySelector('.sheet'));
    const bounds = [];
    let prev = null;
    for (const e of owners) {
      const owner = Number(e.id.slice(3));
      const er = rect(e), br = rect(e.querySelector('.body')), nr = rect(e.querySelector('.no'));
      if (!e.querySelector('.body').innerText.trim() || er.height <= 0) faults.push({ type: 'mobile-empty-render', owner });
      if (br.x < er.x - 1 || br.right > er.right + 1 || br.bottom > er.bottom + 1 ||
          er.x < sheet.x - 1 || er.right > sheet.right + 1) faults.push({ type: 'mobile-body-bounds', owner });
      if (overlap(br, nr)) faults.push({ type: 'mobile-number-body-overlap', owner });
      if (prev && prev.bottom > er.y + 1) faults.push({ type: 'mobile-owner-overlap', owner });
      prev = er;
      bounds.push({ owner, exercise: er, body: br, number: nr });
      const nbs = [...e.querySelectorAll('.body .nb')];
      for (let i = 0; i < nbs.length; i++) for (let j = i + 1; j < nbs.length; j++) {
        if (overlap(rect(nbs[i]), rect(nbs[j]))) faults.push({ type: 'mobile-math-wrapper-overlap', owner, i, j });
      }
    }
    const flow = [...document.querySelector('.sheet').children];
    for (let i = 1; i < flow.length; i++) if (overlap(rect(flow[i - 1]), rect(flow[i]))) {
      faults.push({ type: 'mobile-group-overlap', index: i });
    }
    const maths = [...document.querySelectorAll('li.ex .katex')];
    for (const math of maths) if (!math.querySelector('.katex-html')?.innerText.trim()) faults.push({ type: 'mobile-empty-math' });
    const families = [...new Set([...document.querySelectorAll('.katex-html,.katex-html *')]
      .map(e => getComputedStyle(e).fontFamily.split(',')[0].replaceAll('"', '').trim())
      .filter(f => f.startsWith('KaTeX')))];
    const fontChecks = families.map(family => ({ family, loaded: document.fonts.check(`16px "${family}"`) }));
    if (document.fonts.status !== 'loaded' || fontChecks.some(x => !x.loaded)) faults.push({ type: 'mobile-font-not-loaded' });
    const errorCount = document.querySelectorAll('.katex-error,.err').length;
    if (errorCount) faults.push({ type: 'mobile-katex-error', errorCount });
    const images = document.querySelectorAll('img,.fig,.figure-media,canvas,video,iframe,object,embed').length;
    const scripts = document.querySelectorAll('script').length;
    const backgrounds = [...document.querySelectorAll('*')].filter(e => /url\(/.test(getComputedStyle(e).backgroundImage)).length;
    if (images || scripts || backgrounds) faults.push({ type: 'mobile-unexpected-assets', images, scripts, backgrounds });
    if (document.documentElement.scrollWidth > innerWidth + 1) faults.push({ type: 'mobile-document-overflow' });
    const pairs = [];
    for (const id of [346, 347, 378]) {
      const body = document.getElementById(`ex-${id}`).querySelector('.body');
      const labels = [];
      for (const node of body.childNodes) {
        if (node.nodeType !== Node.TEXT_NODE) continue;
        for (const match of node.textContent.matchAll(/(?:^|\s)([ab])\)/g)) {
          const start = match.index + match[0].length - 2;
          const range = document.createRange();
          range.setStart(node, start); range.setEnd(node, start + 2);
          const r = range.getBoundingClientRect();
          labels.push({ label: match[1], y: r.y + scrollY, height: r.height });
        }
      }
      pairs.push({ owner: id, labels });
      if (labels.length !== 2 || labels[1].y < labels[0].y + labels[0].height - 1) faults.push({ type: 'mobile-part-line-separation', owner: id, labels });
    }
    return { count: ids.length, ordered: ids.every((id, i) => id === 335 + i), bounds, sheet,
      mathCount: maths.length, errorCount, fontChecks, pairs, images, scripts, backgrounds,
      documentWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth, faults, omitted: 0 };
  });
}

let browser;
let desktop;
let mobile;
try {
  check(process.cwd() === ROOT, 'Wrong cwd');
  check(!fs.existsSync(path.join(OUT, 'browser-evidence.json')), 'Recovery replay forbidden');
  for (const [name, sha256] of Object.entries(expected)) {
    const file = path.join(INPUT, name);
    const actual = hash(file);
    result.inputs.push({ path: file, sha256: actual, expected: sha256, matches: actual === sha256 });
    check(actual === sha256, `Input drift ${name}`);
  }
  for (const name of ['review-check.mjs', 'browser-evidence.json', 'execution.json', 'report.md', 'bindings.json', 'manifest.json']) {
    const file = path.join(OLD, name);
    result.originalBindings.push({ path: file, sha256: hash(file) });
  }
  const old = JSON.parse(fs.readFileSync(path.join(OLD, 'browser-evidence.json'), 'utf8'));
  result.originalFlags = old.viewports[0].geometry.faults;
  check(result.originalFlags.length === 40, 'Original failure binding mismatch');
  result.reusedDesktop = {
    evidenceSha256: hash(path.join(OLD, 'browser-evidence.json')),
    checks: '57 ordered distinct owners 335..391; 71 KaTeX; loaded used fonts; no errors/overlap/document overflow/images/network; text title/jump already observed',
    repeatedPassedChecks: false,
  };
  fs.mkdirSync(path.join(OUT, 'browser-tmp'), { recursive: false });
  browser = await chromium.launch({ headless: false, downloadsPath: path.join(OUT, 'browser-tmp'),
    artifactsDir: path.join(OUT, 'browser-tmp'), env: { ...process.env, TMPDIR: path.join(OUT, 'browser-tmp') } });
  result.browser = { headed: true, freshOwnedContext: true, userBrowser: false,
    version: browser.version(), executable: chromium.executablePath() };
  desktop = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1, acceptDownloads: false });
  const d = { name: 'desktop-recovery', viewport: { width: 1440, height: 960 }, status: 'RUNNING',
    errors: [], blockedNetwork: [] };
  result.stages.push(d);
  await desktop.route(/^https?:/, async route => { d.blockedNetwork.push(route.request().url()); await route.abort(); });
  const page = await desktop.newPage();
  page.on('pageerror', e => d.errors.push(String(e)));
  await page.goto(pathToFileURL(path.join(INPUT, 'exercises.html')).href, { waitUntil: 'load', timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  d.rangeDiagnosis = await ranges(page, affected);
  d.originalOrderMapping = d.rangeDiagnosis.flags.map((f, index) => {
    const original = result.originalFlags[index];
    return { originalIndex: index, same: original && original.owner === f.owner &&
      original.ancestor === f.ancestor && Math.abs(original.excessTop - f.excessTop) < 0.01 &&
      Math.abs(original.excessBottom - f.excessBottom) < 0.01 };
  });
  check(d.rangeDiagnosis.flags.length === 40 && d.originalOrderMapping.every(x => x.same), 'Affected Range flags differ; HOLD rather than discard');
  d.scrollports = await scrollReachability(page);
  save();
  check(d.scrollports.length > 0 && d.scrollports.every(x => x.reachesEnd && x.terminalReachable), 'Desktop horizontal math end unreachable');
  await capture(page, d.name, 'desktop-top', 'top', [342]);
  await capture(page, d.name, 'desktop-middle-a', 358, [358, 359, 360, 367]);
  await capture(page, d.name, 'desktop-middle-b', 372, [372, 375, 379]);
  await capture(page, d.name, 'desktop-bottom', 'bottom');
  d.status = 'AWAITING_EXACT_DESKTOP_PIXEL_ADJUDICATION';
  save();
  console.log(JSON.stringify({ stage: d.status, rangeFlags: d.rangeDiagnosis.flags.map(f => ({
    owner: f.owner, text: f.text, ancestor: f.ancestor, class: f.glyphParentClass,
    excessTop: f.excessTop, excessBottom: f.excessBottom,
  })), scrollports: d.scrollports, screenshots: result.screenshots.map(x => x.path),
  control: 'One JSON line with verdict PASS or HOLD and perOwner observations. HOLD closes browser and stops mobile.' }));
  const adjudication = JSON.parse(await receive());
  result.counters.adjudicationInputs++;
  d.pixelAdjudication = adjudication;
  check(adjudication.verdict === 'PASS' && affected.every(id =>
    adjudication.perOwner?.some(x => x.owner === id && x.result === 'NO_OBSERVED_CROP')), 'Desktop pixel adjudication HOLD; mobile dependent stages stopped');
  check(d.errors.length === 0 && d.blockedNetwork.length === 0, 'Desktop recovery runtime failed');
  d.status = 'AFFECTED_RANGE_INK_ADJUDICATED_AND_SCROLL_REACHED';
  await desktop.close(); desktop = null;
  mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, acceptDownloads: false });
  const m = { name: 'mobile-first', viewport: { width: 390, height: 844 }, status: 'RUNNING',
    console: [], pageErrors: [], requests: [], failedRequests: [], unexpectedNetwork: [] };
  result.stages.push(m);
  await mobile.route(/^https?:/, async route => { m.unexpectedNetwork.push(route.request().url()); await route.abort(); });
  const mp = await mobile.newPage();
  mp.on('console', msg => m.console.push({ type: msg.type(), text: msg.text() }));
  mp.on('pageerror', e => m.pageErrors.push(String(e)));
  mp.on('request', req => m.requests.push({ url: req.url(), type: req.resourceType() }));
  mp.on('requestfailed', req => m.failedRequests.push({ url: req.url(), failure: req.failure() }));
  await mp.goto(pathToFileURL(path.join(INPUT, 'text.html')).href, { waitUntil: 'load', timeout: 15000 });
  await mp.evaluate(() => document.fonts.ready);
  m.textView = await mp.evaluate(() => ({
    title: document.title, heading: document.querySelector('h1')?.innerText,
    proseCount: document.querySelectorAll('p,article').length, exerciseCount: document.querySelectorAll('li.ex').length,
    jumpCount: document.querySelectorAll('a.jump').length, jumpTarget: document.querySelector('a.jump')?.getAttribute('href'),
    jumpText: document.querySelector('a.jump')?.innerText,
    children: [...document.querySelector('.sheet').children].map(e => ({ tag: e.tagName, class: e.className })),
    width: document.documentElement.scrollWidth, viewport: innerWidth,
  }));
  check(m.textView.title && m.textView.heading && m.textView.proseCount === 0 && m.textView.exerciseCount === 0 &&
    m.textView.jumpCount === 1 && m.textView.jumpTarget === 'exercises.html' &&
    /\b57\b/.test(m.textView.jumpText) && m.textView.width <= 391 &&
    m.textView.children.every(e => e.tag === 'H1' || e.class === 'crumb' || e.class === 'jump'), 'Mobile first text/jump failed');
  await Promise.all([mp.waitForURL(pathToFileURL(path.join(INPUT, 'exercises.html')).href, { timeout: 15000 }), mp.locator('a.jump').click()]);
  await mp.evaluate(() => document.fonts.ready);
  m.geometry = await mobileGeometry(mp);
  m.rangeDiagnosis = await ranges(mp, Array.from({ length: 57 }, (_, i) => 335 + i));
  m.scrollports = await scrollReachability(mp);
  save();
  check(m.geometry.faults.length === 0, `Mobile first mechanical geometry failed: ${JSON.stringify(m.geometry.faults[0])}`);
  check(m.scrollports.length > 0 && m.scrollports.every(x => x.reachesEnd && x.terminalReachable), 'Mobile horizontal math end unreachable');
  check(!m.pageErrors.length && !m.failedRequests.length && !m.unexpectedNetwork.length &&
    !m.console.some(x => x.type === 'error'), 'Mobile first runtime/assets failed');
  await capture(mp, m.name, 'mobile-top', 'top');
  await capture(mp, m.name, 'mobile-middle', 360);
  const widest = [...m.scrollports].sort((a, b) => (b.scrollWidth - b.clientWidth) - (a.scrollWidth - a.clientWidth))[0];
  await capture(mp, m.name, 'mobile-scroll-end', widest.owner, [], widest);
  await capture(mp, m.name, 'mobile-bottom', 'bottom');
  m.status = 'MECHANICAL_PASS_PENDING_FIRST_MOBILE_PIXEL_REVIEW';
  result.status = 'BROWSER_STAGES_COMPLETE_PENDING_MOBILE_PIXEL_REVIEW';
} catch (error) {
  result.status = 'HOLD';
  result.faults.push({ message: String(error), stack: error.stack });
  const running = result.stages.find(x => x.status === 'RUNNING' || x.status.startsWith('AWAITING'));
  if (running) running.status = 'HOLD';
  process.exitCode = 1;
} finally {
  try {
    if (browser) { await browser.close(); result.browserClosed = true; }
  } catch (error) {
    result.faults.push({ type: 'browser-close', message: String(error) });
    process.exitCode = 1; result.status = 'HOLD';
  }
  rl.close();
  result.postBindings = [...result.inputs, ...result.originalBindings].map(x => ({
    path: x.path, before: x.sha256, after: hash(x.path), unchanged: hash(x.path) === x.sha256,
  }));
  if (result.postBindings.some(x => !x.unchanged)) { process.exitCode = 1; result.status = 'HOLD'; }
  result.finishedAt = new Date().toISOString();
  result.exitCode = process.exitCode || 0;
  save();
  console.log(JSON.stringify({ status: result.status, exitCode: result.exitCode, browserClosed: result.browserClosed,
    stages: result.stages.map(x => ({ name: x.name, status: x.status, rangeFlags: x.rangeDiagnosis?.flags.length })),
    screenshots: result.screenshots.map(x => ({ filename: x.filename, path: x.path, sha256: x.sha256 })),
    faults: result.faults, evidence: path.join(OUT, 'browser-evidence.json') }));
}
