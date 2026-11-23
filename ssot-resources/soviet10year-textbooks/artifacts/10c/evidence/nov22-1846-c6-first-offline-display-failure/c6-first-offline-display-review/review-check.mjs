import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { chromium } from '../../../app/node_modules/playwright/index.mjs';

const ROOT = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
const OUT = path.join(ROOT, '.tmp/stemrobin-184-six/c6-first-offline-display-review');
const INPUT = path.join(ROOT, '.tmp/stemrobin-184-six/c6-modern-representation-repair/work/render/10c/modern-us-neutral/ana10-c6-ex');
const expectedHashes = {
  'exercises.html': 'cc33a1856682c63224b915f912d0ff8be6e2dc2144c0aef7285ec2d9f8f6784d',
  'text.html': 'd04e59931019614e84795f559e30f2dcd6f29bd64fa32ba3a0d55acd465de952',
};
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const result = {
  schema: 'stemrobin-184/c6-first-offline-display@1',
  scope: 'DISPLAY ONLY; first bound C6 offline HTML display',
  startedAt: new Date().toISOString(),
  cwd: process.cwd(),
  argv: process.argv,
  inputs: [],
  viewports: [],
  screenshots: [],
  faults: [],
  truncation: { maximumGeometryFaults: 100, omittedGeometryFaults: 0 },
  imageUsage: { screenshotsCreated: 0, modelViews: 0, conservativeUsage: 0, limit: 18 },
  ticketState: 'OPEN',
};
const save = () => fs.writeFileSync(path.join(OUT, 'browser-evidence.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'w' });
function requireCheck(condition, message) {
  if (!condition) throw new Error(message);
}

async function geometry(page) {
  return page.evaluate(() => {
    const faults = [];
    let totalFaults = 0;
    const fail = detail => { totalFaults++; if (faults.length < 100) faults.push(detail); };
    const rect = e => {
      const r = e.getBoundingClientRect();
      return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height, right: r.right, bottom: r.bottom + scrollY };
    };
    const intersects = (a, b) => Math.min(a.right, b.right) - Math.max(a.x, b.x) > 2 &&
      Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y) > 2;
    const sheet = document.querySelector('.sheet');
    const sr = rect(sheet);
    const owners = [...document.querySelectorAll('li.ex')];
    const ids = owners.map(e => Number(e.id.replace('ex-', '')));
    const ordered = ids.length === 57 && ids.every((n, i) => n === 335 + i) && new Set(ids).size === 57;
    if (!ordered) fail({ type: 'owner-count-order', count: ids.length });
    if (document.documentElement.scrollWidth > innerWidth + 1) fail({ type: 'document-horizontal-overflow', width: document.documentElement.scrollWidth, viewport: innerWidth });
    if (sr.x < -1 || sr.right > innerWidth + 1 || sr.width <= 0) fail({ type: 'sheet-bounds', rect: sr });
    const flow = [...sheet.children].filter(e => e.matches('h1,.crumb,.exgroup,ol.ex,article'));
    let previous = null;
    const groups = [];
    for (const e of flow) {
      const r = rect(e);
      if (r.x < sr.x - 1 || r.right > sr.right + 1 || r.y < sr.y - 1 || r.bottom > sr.bottom + 1) fail({ type: 'article-group-bounds', tag: e.tagName, rect: r });
      if (previous && intersects(previous.rect, r)) fail({ type: 'article-group-overlap', previous: previous.tag, tag: e.tagName });
      previous = { tag: e.tagName, rect: r };
      if (e.matches('.exgroup')) groups.push({ rect: r });
    }
    const ownerBounds = [];
    const parts = [];
    let mathCount = 0;
    let mathGlyphRanges = 0;
    let horizontalMathScrollports = 0;
    let previousOwner = null;
    for (const e of owners) {
      const owner = Number(e.id.slice(3));
      const er = rect(e);
      const body = e.querySelector('.body');
      const no = e.querySelector('.no');
      const br = rect(body);
      const nr = rect(no);
      if (er.width <= 0 || er.height <= 0 || !body.innerText.trim() || !/^\d+/.test(no.innerText)) fail({ type: 'unrendered-owner', owner });
      if (er.x < sr.x - 1 || er.right > sr.right + 1 || er.bottom > sr.bottom + 1 || br.x < er.x - 1 || br.right > er.right + 1 || br.y < er.y - 1 || br.bottom > er.bottom + 1) fail({ type: 'exercise-body-bounds', owner });
      if (intersects(nr, br)) fail({ type: 'number-body-overlap', owner });
      if (previousOwner && previousOwner.bottom > er.y + 1) fail({ type: 'owner-overlap', owner });
      previousOwner = er;
      const inlineMath = [...body.querySelectorAll('.nb')];
      for (let i = 0; i < inlineMath.length; i++) {
        for (let j = i + 1; j < inlineMath.length; j++) {
          if (intersects(rect(inlineMath[i]), rect(inlineMath[j]))) fail({ type: 'math-wrapper-overlap', owner, first: i, second: j });
        }
      }
      const labels = [];
      for (const node of body.childNodes) {
        if (node.nodeType !== Node.TEXT_NODE) continue;
        const pattern = /(?:^|\s)([a-z]|\d+)\)/g;
        for (const match of node.textContent.matchAll(pattern)) {
          const start = match.index + match[0].length - match[1].length - 1;
          const range = document.createRange();
          range.setStart(node, start);
          range.setEnd(node, start + match[1].length + 1);
          const r = range.getBoundingClientRect();
          labels.push({ label: match[1] + ')', x: r.x, y: r.y + scrollY, height: r.height });
        }
      }
      if (labels.length > 1) {
        for (let i = 1; i < labels.length; i++) {
          if (labels[i].y < labels[i - 1].y + labels[i - 1].height - 1) fail({ type: 'part-labels-not-own-lines', owner, labels });
        }
        parts.push({ owner, labels });
      }
      for (const math of body.querySelectorAll('.katex')) {
        mathCount++;
        const visual = math.querySelector('.katex-html');
        if (!visual || !visual.innerText.trim() || rect(visual).height <= 0) {
          fail({ type: 'broken-math', owner });
          continue;
        }
        const nb = math.closest('.nb');
        if (nb && nb.scrollWidth > nb.clientWidth + 1) horizontalMathScrollports++;
        const walker = document.createTreeWalker(visual, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          if (!node.textContent.replace(/[\s\u200b]/g, '')) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          for (const glyph of range.getClientRects()) {
            if (!glyph.width || !glyph.height) continue;
            mathGlyphRanges++;
            // Test actual painted text ranges against outer scroll/clipping boxes.
            // KaTeX's own internal stretchy masks are intentional geometry.
            for (let ancestor = nb || body; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) {
              const style = getComputedStyle(ancestor);
              const box = ancestor.getBoundingClientRect();
              const top = box.top + ancestor.clientTop;
              const bottom = top + ancestor.clientHeight;
              const left = box.left + ancestor.clientLeft;
              const right = left + ancestor.clientWidth;
              const clipsY = /hidden|clip|auto|scroll/.test(style.overflowY);
              const clipsX = /hidden|clip/.test(style.overflowX);
              if (clipsY && (glyph.top < top - 2 || glyph.bottom > bottom + 2)) fail({ type: 'actual-math-vertical-clipping', owner, ancestor: ancestor.className, excessTop: top - glyph.top, excessBottom: glyph.bottom - bottom });
              if (clipsX && (glyph.left < left - 2 || glyph.right > right + 2)) fail({ type: 'actual-math-horizontal-clipping', owner, ancestor: ancestor.className });
            }
          }
        }
      }
      ownerBounds.push({ owner, exercise: er, number: nr, body: br });
    }
    for (const owner of [346, 347, 378]) {
      const item = parts.find(p => p.owner === owner);
      if (!item || item.labels.length !== 2 || item.labels[0].label !== 'a)' || item.labels[1].label !== 'b)') fail({ type: 'required-latin-pair-missing', owner });
    }
    const errors = document.querySelectorAll('.katex-error,.err');
    if (errors.length) fail({ type: 'katex-error', count: errors.length });
    const images = document.querySelectorAll('img,.fig,.figure-media,canvas,video,iframe,object,embed').length;
    if (images) fail({ type: 'unexpected-images-assets', count: images });
    const scripts = document.querySelectorAll('script').length;
    if (scripts) fail({ type: 'unexpected-script', count: scripts });
    const backgroundAssets = [...document.querySelectorAll('*')].filter(e => /url\(/.test(getComputedStyle(e).backgroundImage)).length;
    if (backgroundAssets) fail({ type: 'unexpected-background-assets', count: backgroundAssets });
    const fonts = [...document.fonts].map(f => ({ family: f.family, status: f.status }));
    if (document.fonts.status !== 'loaded' || fonts.some(f => f.status === 'error')) fail({ type: 'font-load-failure' });
    const usedFamilies = [...new Set([...document.querySelectorAll('.katex-html,.katex-html *')].map(e => getComputedStyle(e).fontFamily.split(',')[0].replaceAll('"', '').trim()).filter(f => f.startsWith('KaTeX')))];
    const usedFontChecks = usedFamilies.map(family => ({ family, loaded: document.fonts.check(`16px "${family}"`) }));
    if (usedFontChecks.some(f => !f.loaded)) fail({ type: 'used-font-not-ready' });
    if (!mathCount) fail({ type: 'no-rendered-math' });
    return {
      count: ids.length, distinctCount: new Set(ids).size, firstOwner: ids[0], lastOwner: ids.at(-1), ordered,
      sheet: sr, articleCount: document.querySelectorAll('article').length, articleEquivalent: '.sheet',
      groupCount: groups.length, groups, ownerBounds, parts, mathCount, mathGlyphRanges, horizontalMathScrollports,
      documentWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth,
      imageCount: images, katexErrorCount: errors.length, scripts, backgroundAssets, fonts, usedFontChecks,
      faults, totalFaults, omittedFaults: totalFaults - faults.length,
    };
  });
}

let browser;
try {
  requireCheck(process.cwd() === ROOT, 'Wrong execution cwd');
  for (const [name, expected] of Object.entries(expectedHashes)) {
    const p = path.join(INPUT, name);
    const sha256 = hash(p);
    result.inputs.push({ path: p, sha256, expected, matches: sha256 === expected });
    requireCheck(sha256 === expected, `Input hash mismatch: ${name}`);
  }
  // This brand-new profile is inside the evidence directory, never a user profile.
  const desktop = await chromium.launchPersistentContext(path.join(OUT, 'fresh-browser-profile'), {
    headless: false, viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1,
    downloadsPath: path.join(OUT, 'browser-downloads'), artifactsDir: path.join(OUT, 'browser-artifacts'),
    acceptDownloads: false,
  });
  browser = desktop.browser();
  result.browser = { kind: 'installed-app Playwright Chromium', headed: true, freshOwnedProfile: true, version: browser.version(), executable: chromium.executablePath() };
  for (const [name, viewport] of [['desktop', { width: 1440, height: 960 }], ['mobile', { width: 390, height: 844 }]]) {
    const context = name === 'desktop' ? desktop : await browser.newContext({ viewport, deviceScaleFactor: 1, acceptDownloads: false });
    const record = { name, viewport, console: [], pageErrors: [], requests: [], failedRequests: [], unexpectedNetwork: [], status: 'RUNNING' };
    result.viewports.push(record);
    await context.route(/^https?:/, async route => {
      record.unexpectedNetwork.push(route.request().url());
      await route.abort('blockedbyclient');
    });
    const page = await context.newPage();
    page.on('console', m => record.console.push({ type: m.type(), text: m.text() }));
    page.on('pageerror', e => record.pageErrors.push(String(e)));
    page.on('request', r => record.requests.push({ url: r.url(), type: r.resourceType() }));
    page.on('requestfailed', r => record.failedRequests.push({ url: r.url(), failure: r.failure() }));
    await page.goto(pathToFileURL(path.join(INPUT, 'text.html')).href, { waitUntil: 'load', timeout: 15000 });
    await page.evaluate(() => document.fonts.ready);
    record.textView = await page.evaluate(() => ({
      title: document.title, heading: document.querySelector('h1')?.innerText,
      proseCount: document.querySelectorAll('p.para,p,article').length,
      exerciseCount: document.querySelectorAll('li.ex').length,
      sheetChildren: [...document.querySelector('.sheet').children].map(e => ({ tag: e.tagName, class: e.className })),
      jumpCount: document.querySelectorAll('a.jump').length,
      jumpText: document.querySelector('a.jump')?.innerText,
      jumpTarget: document.querySelector('a.jump')?.getAttribute('href'),
      documentWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth,
      imageCount: document.querySelectorAll('img,.fig,.figure-media').length,
    }));
    requireCheck(record.textView.title && record.textView.heading && record.textView.proseCount === 0 &&
      record.textView.exerciseCount === 0 && record.textView.jumpCount === 1 &&
      record.textView.jumpTarget === 'exercises.html' && /\b57\b/.test(record.textView.jumpText) &&
      record.textView.sheetChildren.every(e => e.tag === 'H1' || e.class === 'crumb' || e.class === 'jump') &&
      record.textView.documentWidth <= viewport.width + 1 && record.textView.imageCount === 0, `${name}: empty-prose title/jump contract failed`);
    await Promise.all([
      page.waitForURL(pathToFileURL(path.join(INPUT, 'exercises.html')).href, { timeout: 15000 }),
      page.locator('a.jump').click(),
    ]);
    await page.evaluate(() => document.fonts.ready);
    record.exercisesURL = page.url();
    record.geometry = await geometry(page);
    result.truncation.omittedGeometryFaults += record.geometry.omittedFaults;
    save();
    requireCheck(record.geometry.totalFaults === 0, `${name}: ${record.geometry.totalFaults} display geometry/render fault(s); first ${JSON.stringify(record.geometry.faults[0])}`);
    requireCheck(!record.pageErrors.length && !record.failedRequests.length && !record.unexpectedNetwork.length &&
      !record.console.some(m => m.type === 'error'), `${name}: console/page/asset failure`);
    for (const [position, owner, offset] of [['top', null, 0], ['middle', 362, 0.5], ['bottom', 385, 0.72]]) {
      const capture = await page.evaluate(({ owner, offset }) => {
        const target = owner ? document.getElementById(`ex-${owner}`).getBoundingClientRect().top + scrollY - innerHeight * offset : 0;
        scrollTo({ top: Math.max(0, target), behavior: 'instant' });
        return { scrollX, scrollY, documentHeight: document.documentElement.scrollHeight };
      }, { owner, offset });
      const filename = `${name}-${position}.png`;
      const p = path.join(OUT, filename);
      requireCheck(!fs.existsSync(p), `Screenshot exists; refusing replay: ${filename}`);
      await page.screenshot({ path: p, fullPage: false, animations: 'disabled' });
      result.screenshots.push({ filename, path: p, sha256: hash(p), viewport, anchorOwner: owner, capture, creationCount: 1, modelViewCount: 0 });
      result.imageUsage.screenshotsCreated++;
      result.imageUsage.conservativeUsage++;
      save();
    }
    record.status = 'PASS';
    save();
    if (name === 'mobile') await context.close();
  }
  result.status = 'BROWSER_ASSERTIONS_PASS_PENDING_PIXEL_REVIEW';
} catch (error) {
  result.status = 'FAIL';
  result.faults.push({ type: 'execution-or-display', message: String(error), stack: error.stack });
  const running = result.viewports.find(v => v.status === 'RUNNING');
  if (running) running.status = 'FAIL';
  process.exitCode = 1;
} finally {
  if (browser) {
    try { await browser.close(); result.browserClosed = true; }
    catch (error) { result.faults.push({ type: 'browser-close', message: String(error) }); process.exitCode = 1; result.status = 'FAIL'; }
  }
  result.finishedAt = new Date().toISOString();
  result.exitCode = process.exitCode || 0;
  save();
  console.log(JSON.stringify({
    status: result.status, exitCode: result.exitCode,
    viewports: result.viewports.map(v => ({ name: v.name, status: v.status, count: v.geometry?.count, mathCount: v.geometry?.mathCount, faults: v.geometry?.totalFaults })),
    screenshotsCreated: result.imageUsage.screenshotsCreated, faults: result.faults.map(f => f.message),
    evidence: path.join(OUT, 'browser-evidence.json'),
  }));
}
