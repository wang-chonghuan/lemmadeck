import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const out = path.dirname(fileURLToPath(import.meta.url));
const first = path.dirname(out);
const name = process.argv[2];
assert(['desktop', 'mobile'].includes(name));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const binding = file => ({ path: file, bytes: fs.statSync(file).size, sha256: hash(file) });
const priorFile = path.join(first, `${name}-evidence/browser-evidence.json`);
const prior = JSON.parse(fs.readFileSync(priorFile, 'utf8'));
const viewport = name === 'desktop' ? { width: 1440, height: 960 } : { width: 390, height: 844 };
const indices = name === 'desktop' ? [5, 6, 7] : [11, 12];
const dir = path.join(out, `${name}-capture`);
fs.mkdirSync(dir);
const runtime = path.join(dir, 'runtime');
fs.mkdirSync(runtime);
process.env.TMPDIR = runtime;
const appRequire = createRequire(path.join(root, 'app/package.json'));
const { chromium } = appRequire('playwright');
const report = {
  schema: 'stemrobin1846/recovery02-capture-only@1', status: 'RUNNING',
  cwd: root, argv: process.argv, startedAt: new Date().toISOString(),
  name, viewport, headed: true, htmlBindingReusedUnchanged: prior.html, url: prior.url,
  existingAssertionsReused: binding(priorFile),
  scope: name === 'desktop'
    ? 'Only block5, block8 paragraph7 and section boundary1, including both adjacent anchors.'
    : 'Only section boundary2 rule and its two adjacent anchors.',
  targetParagraphIndices: indices,
  anchorTextForNewVisualObservation: indices.map(index => ({
    index, text: prior.paragraphs.find(p => p.index === index).text,
  })),
  figureExclusion: {
    selector: '.figure-media, .figure-media *',
    method: 'visibility:hidden!important only; no display, dimension, mask, parent or text changes',
    maskUsed: false,
    layoutGeometryPreserved: true,
  },
  runtime: { playwright: appRequire.resolve('playwright'),
    chromium: chromium.executablePath(), runtimeDirectory: runtime },
  captureAttempts: 0, successfulScreenshots: 0, imageViews: 0,
  captures: [], forbiddenRequests: [], browserClosed: false, contextClosed: false,
  noPassedDOMFontLayoutMetadataOrNativeProducerStageRerun: true,
};
const write = (file, data) => fs.writeFileSync(path.join(dir, file),
  JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
let browser;
let context;
try {
  browser = await chromium.launch({ headless: false });
  report.runtime.version = browser.version();
  context = await browser.newContext({ viewport, offline: true, serviceWorkers: 'block' });
  await context.route('**/*', route => {
    const url = route.request().url();
    if (url.startsWith('file:') || url.startsWith('data:')) return route.continue();
    report.forbiddenRequests.push(url);
    return route.abort();
  });
  // Hide only media paint; retain every figure box, caption, prose anchor and rule.
  await context.addInitScript(() => {
    const install = () => {
      if (!document.documentElement) return false;
      const style = document.createElement('style');
      style.textContent = '.figure-media, .figure-media *{visibility:hidden!important}';
      document.documentElement.appendChild(style);
      return true;
    };
    if (!install()) {
      const observer = new MutationObserver(() => {
        if (install()) observer.disconnect();
      });
      observer.observe(document, { childList: true, subtree: true });
    }
  });
  const page = await context.newPage();
  await page.goto(prior.url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => new Promise(resolve =>
    requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const geometry = await page.evaluate(({ indices }) => {
    const paragraphs = [...document.querySelectorAll('p.para')];
    const rect = node => {
      const r = node.getBoundingClientRect();
      return { x: r.x + scrollX, right: r.right + scrollX,
        y: r.y + scrollY, bottom: r.bottom + scrollY, width: r.width, height: r.height };
    };
    const anchors = indices.map(index => ({ index, rect: rect(paragraphs[index]) }));
    const left = Math.min(...anchors.map(a => a.rect.x));
    const right = Math.max(...anchors.map(a => a.rect.right));
    const top = Math.min(...anchors.map(a => a.rect.y));
    const bottom = Math.max(...anchors.map(a => a.rect.bottom));
    const x = Math.max(0, Math.floor(left - 8));
    const y = Math.max(0, Math.floor(top - 12));
    const clip = { x, y, width: Math.ceil(right + 8 - x), height: Math.ceil(bottom + 12 - y) };
    const after = anchors.at(-1).rect;
    return { anchors, clip,
      ruleLocation: { x: after.x, right: after.right, y: after.y },
      documentExtentForCrop: {
        width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight,
      } };
  }, { indices });
  report.preAcquisitionGeometry = geometry;
  write('pre-acquisition-geometry.json', {
    cwd: root, viewport, url: prior.url, measuredBeforeScreenshot: true, ...geometry,
  });
  const { clip } = geometry;
  assert(clip.width > 0 && clip.height > 0);
  assert(clip.width <= viewport.width && clip.height <= viewport.height,
    'Missing-region crop must be bounded within one viewport-sized image');
  assert(clip.x + clip.width <= geometry.documentExtentForCrop.width);
  assert(clip.y + clip.height <= geometry.documentExtentForCrop.height);
  for (const anchor of geometry.anchors) {
    assert(anchor.rect.x >= clip.x && anchor.rect.right <= clip.x + clip.width);
    assert(anchor.rect.y >= clip.y && anchor.rect.bottom <= clip.y + clip.height,
      'Crop must contain the entire target anchor');
  }
  assert(geometry.ruleLocation.y >= clip.y
    && geometry.ruleLocation.y < clip.y + clip.height);
  await page.evaluate(y => scrollTo(0, y), clip.y);
  const file = path.join(dir, `${name}-missing-region.png`);
  report.captureAttempts++;
  await page.screenshot({ path: file, fullPage: true, clip, animations: 'disabled' });
  report.successfulScreenshots++;
  const png = fs.readFileSync(file);
  const dimensions = { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
  report.captures.push({ ...binding(file), viewport, clip, actualPNGDimensions: dimensions,
    targetParagraphIndices: indices, noFigurePixelsIntended: true, noMaskOverlay: true,
    inspected: false });
  assert.equal(dimensions.width, clip.width, 'Genuine crop width, not viewport truncation');
  assert.equal(dimensions.height, clip.height, 'Genuine crop height, not viewport truncation');
  report.status = 'CAPTURE_PASS_PENDING_ONE_NEW_VISUAL_VIEW';
} catch (error) {
  report.status = 'HOLD';
  report.firstFailure = { message: String(error), stack: error.stack };
  process.exitCode = 1;
} finally {
  if (context) { await context.close(); report.contextClosed = true; }
  if (browser) { await browser.close(); report.browserClosed = true; }
  report.finishedAt = new Date().toISOString();
  write('capture-evidence.json', report);
  console.log(JSON.stringify(report, null, 2));
}
