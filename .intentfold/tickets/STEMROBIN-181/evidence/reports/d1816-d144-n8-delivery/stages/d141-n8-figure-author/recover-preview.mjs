import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const home = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d141-n8-figure-author');
const candidate = path.join(repo, '.tmp/STEMROBIN-181/d1816-d141/figure05/candidate-2');
assert.equal(process.cwd(), repo);
const require = createRequire(path.join(repo, '.agents/skills/package.json'));
const { chromium } = require('playwright-core');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const binding = file => ({ path: file, sha256: hash(file) });
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const firstReceipt = path.join(home, 'native/fig05-c2-author-preview-inspect/receipt.json');
const firstError = path.join(home, 'native/fig05-c2-author-preview-inspect/stderr.txt');
assert.equal(read(firstReceipt).exitCode, 1);
const stderr = fs.readFileSync(firstError, 'utf8');
assert(stderr.includes("locator('[data-label-id=\"distance-axis-label\"]')"));
assert(stderr.includes('inspect-preview.mjs:109:92'));
const htmlPath = path.join(candidate, 'author-preview.html');
const svgPath = path.join(candidate, 'fig-05.svg');
const renderPath = path.join(candidate, 'fig-05.render.json');
const specPath = path.join(candidate, 'fig-05.spec.json');
const startPath = path.join(candidate, 'author-mobile-scroll-start.png');
const endPath = path.join(candidate, 'author-mobile-scroll-end.png');
const outputPath = path.join(candidate, 'author-preview.assertions.json');
assert(fs.existsSync(startPath), 'Preserve first-run start screenshot');
assert(!fs.existsSync(outputPath) && !fs.existsSync(endPath));
const render = read(renderPath);
assert.equal(render.status, 'pass');
assert.equal(render.spec.sha256, hash(specPath));
assert.equal(render.output.svg.sha256, hash(svgPath));
const before = [binding(specPath), binding(svgPath), binding(renderPath), binding(htmlPath), binding(startPath)];
const executablePath = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  chromium.executablePath(),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean).find(file => fs.existsSync(file));
assert(executablePath);
const browser = await chromium.launch({ executablePath, headless: true });
const checks = [];
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`file://${htmlPath}`);
  const end = await page.locator('figure').evaluate(f => {
    f.scrollLeft = f.scrollWidth;
    return { scrollLeft: f.scrollLeft, maxScroll: f.scrollWidth - f.clientWidth, hostWidth: f.clientWidth };
  });
  assert(end.maxScroll > 0);
  assert(Math.abs(end.scrollLeft - end.maxScroll) < 1);
  const rightAxis = await page.locator('[data-label-id="distance-axis-label-label"]').evaluate(el => {
    const label = el.getBoundingClientRect();
    const host = el.closest('figure').getBoundingClientRect();
    return { text: el.textContent, visible: label.left >= host.left && label.right <= host.right };
  });
  assert.equal(rightAxis.text, 'r');
  assert(rightAxis.visible);
  checks.push({ id: 'author-mobile-scroll-end-reachable', status: 'pass', ...end, rightAxis });
  await page.screenshot({ path: endPath });
  const pixels = await page.evaluate(async svgText => {
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgText)));
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = 640; canvas.height = 520;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white'; ctx.fillRect(0, 0, 640, 520);
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, 640, 520).data;
    let nonwhite = 0, white = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] < 240 || data[i + 1] < 240 || data[i + 2] < 240) nonwhite++;
      else white++;
    }
    return { nonwhite, white, total: 640 * 520 };
  }, fs.readFileSync(svgPath, 'utf8'));
  assert(pixels.nonwhite > 1000 && pixels.nonwhite < pixels.total * 0.2);
  assert(pixels.white > pixels.total * 0.8);
  checks.push({ id: 'exported-svg-nonblank-not-black', status: 'pass', ...pixels });
  assert.deepEqual(errors, []);
  checks.push({ id: 'no-recovery-preview-page-errors', status: 'pass' });
} finally {
  await browser.close();
}
for (const file of before) assert.equal(hash(file.path), file.sha256, `Recovery changed completed output: ${file.path}`);
const report = {
  schema: 'STEMROBIN-181/author-preview-assertions@1',
  status: 'pass',
  independentApproval: false,
  productAcceptance: false,
  surface: 'Isolated offline author-preview SVG host, not native lesson/product integration.',
  browser: { headed: false, reason: 'Author-only SVG check; native headed/product acceptance remains with parent after independent approval.' },
  technicalRecovery: {
    cause: 'Renderer suffixes spec object ids with -label. First run used distance-axis-label instead of distance-axis-label-label.',
    scope: 'Only failed mobile-end label lookup and not-yet-executed pixel/no-page-error checks; native validate/render and earlier viewport/theme assertions were not repeated.',
    firstReceipt: binding(firstReceipt),
    firstStderr: binding(firstError),
    firstScript: binding(path.join(home, 'inspect-preview.mjs')),
    firstRunCompletedBeforeTimeout: [
      'Exact exported raw-path d, stroke width, dash, no-fill and semantic CSS variables.',
      '1440px and 390px viewport checks in neutral, accent and print themes: 640px media, seven labels at least 16px, no label clipping or overlap, visible strokes.',
      'Mobile overflow and scroll-end coordinates; start screenshot saved.',
    ],
    priorChecksEvidence: 'Sequential assertions precede the failing line in the hash-bound first script; retained timeout stack identifies that exact lookup. Prior metrics were not separately serialized.',
    figureBytesUnchanged: true,
  },
  spec: binding(specPath), svg: binding(svgPath), render: binding(renderPath), html: binding(htmlPath),
  screenshots: [binding(startPath), binding(endPath)],
  checks,
};
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status: report.status, recoveryChecks: checks.length, report: outputPath, nativeRenderRepeated: false, imagePayloadsReturned: 0 }));
