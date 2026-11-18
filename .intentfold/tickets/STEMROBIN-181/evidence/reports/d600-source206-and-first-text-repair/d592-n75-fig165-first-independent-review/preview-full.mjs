import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const owned = path.dirname(fileURLToPath(import.meta.url));
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const entry = (p) => ({ path: p, sha256: sha(p) });
const audit = JSON.parse(fs.readFileSync(path.join(owned, 'binding-audit.json'), 'utf8'));
const svgPath = audit.browser.svg.path;
const cssPath = audit.browser.css.path;
const svg = fs.readFileSync(svgPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
assert.equal(sha(svgPath), audit.browser.svg.sha256);
assert.equal(sha(cssPath), audit.browser.css.sha256);
const outputPath = path.join(owned, 'full-browser-observations.json');
assert.equal(fs.existsSync(outputPath), false, 'FIRST preview only');
const htmlPath = path.join(owned, 'isolated-full.html');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style><style>
html, body { margin: 0; padding: 0; width: 640px; background: var(--sr-white); }
#media { display: block; width: 640px; margin: 0; border: 0; max-width: none; }
#media > svg { display: block; width: 100%; height: auto; max-width: none; }
</style></head><body><div id="media" class="sr-figure-media">${svg}</div></body></html>`;
assert.equal(fs.readFileSync(htmlPath, 'utf8'), html, 'Reuse exact original wrapper without overwrite');
const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
const executablePath = chromium.executablePath();
assert.ok(fs.existsSync(executablePath), 'Existing Chromium required');
const browser = await chromium.launch({ headless: true, executablePath });
const errors = [];
let result;
try {
  const context = await browser.newContext({ deviceScaleFactor: 1, viewport: { width: 640, height: 450 } });
  await context.route('**/*', (route) => route.abort());
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  result = await page.locator('#media > svg').evaluate((svgElement) => {
    const rect = svgElement.getBoundingClientRect();
    const all = [...svgElement.querySelectorAll('*')];
    const visible = (node) => {
      if (node.closest('defs')) return false;
      for (let parent = node; parent && parent !== svgElement.parentElement; parent = parent.parentElement) {
        const style = getComputedStyle(parent);
        if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse' || Number(style.opacity) === 0) return false;
      }
      return true;
    };
    const inside = (b, padding = 0) => b.left - padding >= rect.left - 0.01
      && b.right + padding <= rect.right + 0.01 && b.top - padding >= rect.top - 0.01
      && b.bottom + padding <= rect.bottom + 0.01;
    const labels = [...svgElement.querySelectorAll('text')].map((node) => {
      const style = getComputedStyle(node);
      const matrix = node.getScreenCTM();
      const bounds = node.getBoundingClientRect();
      return {
        id: node.getAttribute('data-label-id'), text: node.textContent,
        px: parseFloat(style.fontSize) * Math.hypot(matrix.a, matrix.b), fill: style.fill,
        bounds: bounds.toJSON(), inside: inside(bounds), visible: visible(node)
      };
    });
    const geometry = all.filter((node) => {
      if (!['path', 'line', 'polygon', 'polyline', 'circle', 'ellipse'].includes(node.tagName) || !visible(node)) return false;
      const style = getComputedStyle(node);
      return (style.stroke !== 'none' && Number(style.strokeOpacity) > 0 && parseFloat(style.strokeWidth) > 0)
        || (style.fill !== 'none' && Number(style.fillOpacity) > 0);
    });
    const geometryEvidence = geometry.map((node) => {
      const style = getComputedStyle(node);
      const bounds = node.getBoundingClientRect();
      const strokePadding = style.stroke === 'none' ? 0 : parseFloat(style.strokeWidth) / 2;
      return {
        id: node.id, tag: node.tagName, stroke: style.stroke, fill: style.fill,
        bounds: bounds.toJSON(), fitsWithStroke: inside(bounds, strokePadding),
        declaredStroke: node.getAttribute('stroke'), declaredFill: node.getAttribute('fill'),
        pathLength: node.tagName === 'path' ? node.getTotalLength() : null
      };
    });
    const roles = Object.fromEntries(['ink', 'muted', 'accent', 'accent-soft', 'grid', 'paper']
      .map((role) => [role, getComputedStyle(svgElement).getPropertyValue(`--ld-figure-${role}`).trim()]));
    const hiddenLiteralColorNodes = all.filter((node) => !visible(node) && /#[0-9a-f]{3,8}\b/i.test((node.getAttribute('stroke') || '') + (node.getAttribute('fill') || ''))).length;
    return {
      width: rect.width, height: rect.height, viewBox: svgElement.getAttribute('viewBox'),
      allSvgNodesParsed: all.length, visibleGeometry: geometryEvidence, labels, roles,
      hiddenLiteralColorNodes, minTextPx: Math.min(...labels.map((x) => x.px)),
      colorsResolved: geometryEvidence.every((x) => !/var\(/.test(x.stroke + x.fill)),
      visibleSemanticColorsOnly: geometryEvidence.every((x) => [x.declaredStroke, x.declaredFill].every((c) => !c || c === 'none' || c.startsWith('var(--ld-figure-'))),
      noClipping: geometryEvidence.every((x) => x.fitsWithStroke) && labels.every((x) => x.inside),
      languageOnlyEnglish: labels.every((x) => /^[A-Za-z -]+$/.test(x.text))
    };
  });
  assert.equal(result.width, 640);
  assert.equal(result.height, 440);
  assert.equal(result.labels.length, 4);
  assert.ok(result.visibleGeometry.length >= 9);
  assert.ok(result.minTextPx >= 16 && result.colorsResolved && result.visibleSemanticColorsOnly && result.noClipping && result.languageOnlyEnglish);
  assert.deepEqual(errors, []);
  const screenshotPath = path.join(owned, 'native-svg-full-640.chromium.png');
  await page.locator('#media > svg').screenshot({ path: screenshotPath, animations: 'disabled' });
  result.screenshot = entry(screenshotPath);
  await context.close();
} finally {
  await browser.close();
}
assert.equal(sha(svgPath), audit.browser.svg.sha256);
assert.equal(sha(cssPath), audit.browser.css.sha256);
for (const binding of audit.bindings) assert.equal(sha(binding.path), binding.actual_sha256, `Unchanged input ${binding.path}`);
const output = {
  schema: 'd592-first-independent-full-browser-preview@1', figure: 'fig-165', status: 'PASS',
  sourceSvg: entry(svgPath), css: entry(cssPath), html: entry(htmlPath), script: entry(fileURLToPath(import.meta.url)),
  command: [process.execPath, fileURLToPath(import.meta.url)], browser: 'isolated headless Chromium',
  executablePath, browserVersion: browser.version(), deviceScaleFactor: 1, networkBlocked: true,
  nativeRenderInvocations: 0, resvgInvocations: 0, browserClosed: true, browserErrors: errors,
  priorOwnHarnessFailure: entry(path.join(owned, 'first-preview-harness-failure.json')),
  browserMeasurementInvocations: 2, screenshotsProduced: 1, figureRepairs: 0,
  svgBytesUnmodified: true, authorAndInputBindingBytesUnchangedAfterPreview: true,
  fullCardAcceptance: false, result
};
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ status: 'PASS', width: result.width, minTextPx: result.minTextPx, visibleGeometry: result.visibleGeometry.length, noClipping: result.noClipping, browserClosed: true, screenshot: result.screenshot }));
