import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const out = path.dirname(fileURLToPath(import.meta.url));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const originalScript = path.join(out, 'layout.mjs');
const retainedScript = path.join(out, 'layout-first-attempt.mjs');
fs.copyFileSync(originalScript, retainedScript, fs.constants.COPYFILE_EXCL);
assert.equal(hash(originalScript), hash(retainedScript));
const priorFile = path.join(out, 'desktop-evidence/browser-evidence.json');
const prior = JSON.parse(fs.readFileSync(priorFile, 'utf8'));
assert.equal(prior.boundaries.length, 5);
assert(prior.paragraphs.every(p => p.layoutStatus === 'PASS'));
assert.equal(prior.captureCount, 1);
assert(prior.firstFailure.message.includes('Clipped area'));
assert.equal(hash(prior.html.path), prior.html.sha256);
assert.equal(hash(prior.captures[0].path), prior.captures[0].sha256);
const dir = path.join(out, 'desktop-capture-recovery');
fs.mkdirSync(dir);
const runtime = path.join(dir, 'runtime');
fs.mkdirSync(runtime);
process.env.TMPDIR = runtime;
const appRequire = createRequire(path.join(root, 'app/package.json'));
const { chromium } = appRequire('playwright');
const report = {
  schema: 'stemrobin1846/screenshot-only-recovery@1', status: 'RUNNING',
  cwd: root, argv: process.argv, viewport: prior.viewport, headed: true,
  html: prior.html, reusedDesktopDOMAndBoundaries: { path: priorFile, sha256: hash(priorFile) },
  retainedFirstScript: { path: retainedScript, sha256: hash(retainedScript) },
  diagnosis: 'Document-relative screenshot clips past the viewport require fullPage:true.',
  scope: 'Missing screenshot bands 2-4 only; no passed desktop layout assertions rerun.',
  captures: [], newCaptureCount: 0, inheritedCaptureCount: 1,
  browserClosed: false, contextClosed: false, externalRequests: [],
};
let browser;
let context;
try {
  browser = await chromium.launch({ headless: false });
  report.chromiumVersion = browser.version();
  context = await browser.newContext({ viewport: prior.viewport, offline: true, serviceWorkers: 'block' });
  await context.route('**/*', route => {
    const url = route.request().url();
    if (url.startsWith('file:') || url.startsWith('data:')) return route.continue();
    report.externalRequests.push(url);
    return route.abort();
  });
  await context.addInitScript(() => {
    new MutationObserver(() => {
      for (const media of document.querySelectorAll('.figure-media')) {
        media.style.setProperty('visibility', 'hidden', 'important');
      }
    }).observe(document, { childList: true, subtree: true });
  });
  const page = await context.newPage();
  await page.goto(prior.url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const bands = [[8,20], [20,30], [30,34]];
  for (const [number, [first, last]] of bands.entries()) {
    const bounds = await page.evaluate(({ first, last }) => {
      const nodes = [...document.querySelectorAll('p.para')];
      const top = nodes[first].getBoundingClientRect().top + scrollY;
      const bottom = nodes[last].getBoundingClientRect().bottom + scrollY;
      const sheet = document.querySelector('.sheet').getBoundingClientRect();
      return { x: Math.floor(sheet.x), y: Math.max(0, Math.floor(top - 8)),
        width: Math.ceil(sheet.width), height: Math.ceil(bottom - top + 16) };
    }, { first, last });
    assert(bounds.height <= 4200);
    const file = path.join(dir, `desktop-prose-band-${number + 2}.png`);
    await page.screenshot({ path: file, clip: bounds, fullPage: true, animations: 'disabled',
      mask: [page.locator('.figure-media')], maskColor: '#ffffff' });
    report.newCaptureCount++;
    report.captures.push({ path: file, sha256: hash(file), firstParagraph: first,
      lastParagraph: last, clip: bounds, figureMediaHiddenAndMasked: true, inspected: false });
  }
  assert.deepEqual(report.externalRequests, []);
  report.status = 'CAPTURE_PASS_PENDING_NEW_VISUAL_INSPECTION';
} catch (error) {
  report.status = 'HOLD';
  report.firstFailure = { message: String(error), stack: error.stack };
  process.exitCode = 1;
} finally {
  if (context) { await context.close(); report.contextClosed = true; }
  if (browser) { await browser.close(); report.browserClosed = true; }
  fs.writeFileSync(path.join(dir, 'capture-evidence.json'),
    JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify(report, null, 2));
}
