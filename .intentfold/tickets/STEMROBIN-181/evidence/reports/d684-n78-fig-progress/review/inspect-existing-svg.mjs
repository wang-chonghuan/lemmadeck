import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181');
const owned = path.join(ticket, 'tmp/d672-n78-fig183-first-review');
const author = path.join(ticket, 'tmp/d662-n78-fig182183-author');
const figure = path.join(author, 'fig-183');
assert.equal(process.cwd(), repo);
const require = createRequire(path.join(repo, 'app/package.json'));
const { chromium } = require('playwright');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length };
};
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const spec = read(path.join(figure, 'spec.json'));
const render = read(path.join(figure, 'render.json'));
const svg = fs.readFileSync(path.join(figure, 'figure.svg'), 'utf8');
const cssPath = path.join(repo, 'app/src/styles/app.css');
const css = fs.readFileSync(cssPath, 'utf8');
const inputs = [
  spec.source.image.path,
  ...['spec.json', 'render.json', 'figure.svg', 'native.png', 'model-additions.json',
    'author-model-check.json', 'validation.receipt.json'].map(file => path.join(figure, file)),
  ...['report.json', 'source-inventory.json', 'output-hashes.json', 'preview-receipt.json',
    'author-freeze.json'].map(file => path.join(author, file)),
  ...['zh', 'en'].map(locale => path.join(ticket,
    `evidence/reports/d670-n78-text-progress/candidate/${locale}/lesson.template.json`)),
  path.join(ticket, 'evidence/reports/d670-n78-text-progress/report.json'),
  cssPath,
].map(bind);
assert.equal(spec.id, 'fig-183');
assert.equal(render.status, 'pass');
assert.equal(render.spec.sha256, bind(path.join(figure, 'spec.json')).sha256);
assert.equal(render.output.svg.sha256, bind(path.join(figure, 'figure.svg')).sha256);
assert.equal(spec.source.image.sha256, bind(spec.source.image.path).sha256);
assert.deepEqual(render.collisions, []);

const objects = new Map(spec.objects.map(object => [object.id, object]));
const assertions = new Map(spec.assertions.map(assertion => [assertion.id, assertion]));
assert.equal(objects.size, spec.objects.length);
assert.equal(assertions.size, spec.assertions.length);
for (const group of spec.source.inventory) {
  for (const id of group.objects) assert.ok(objects.has(id), `Unresolved inventory object: ${id}`);
  for (const id of group.assertions) assert.ok(assertions.has(id), `Unresolved inventory assertion: ${id}`);
}
const point = id => objects.get(id).at;
const axis = point('s183-O-center')[1];
const slideX = point('s183-slide-tip-0')[0];
const objectiveX = point('s183-O-center')[0];
const screenX = point('s183-image-tip-0')[0];
const u = objectiveX - slideX;
const v = screenX - objectiveX;
const f = u * v / (u + v);
assert.ok(f > 0 && f < u && u < 2 * f && v > 2 * f);
assert.ok(point('s183-source')[0] < 168 && 168 < 198 && 198 < slideX && slideX < objectiveX);
const rayChecks = [];
for (const index of [0, 1]) {
  const objectPoint = point(`s183-slide-tip-${index}`);
  const imagePoint = point(`s183-image-tip-${index}`);
  const objectHeight = objectPoint[1] - axis;
  const imageHeight = imagePoint[1] - axis;
  assert.ok(Math.abs(imageHeight / objectHeight + v / u) < 1e-10);
  assert.equal(imagePoint[0], screenX);
  for (const ray of [0, 1]) {
    const incident = objects.get(`s183-image-incident-${index}-${ray}`);
    const outgoing = objects.get(`s183-image-exit-${index}-${ray}`);
    assert.equal(incident.from, `s183-slide-tip-${index}`);
    assert.equal(outgoing.to, `s183-image-tip-${index}`);
    assert.equal(incident.to, outgoing.from);
    const lensPoint = point(incident.to);
    const slopeIn = (lensPoint[1] - objectPoint[1]) / u;
    const slopeOut = (imagePoint[1] - lensPoint[1]) / v;
    const residual = slopeOut - slopeIn + (lensPoint[1] - axis) / f;
    assert.ok(Math.abs(residual) < 1e-10, 'Paraxial refraction law failed');
    rayChecks.push({ index, ray, slopeIn, slopeOut, residual });
  }
}
const relevantText = [];
for (const locale of ['zh', 'en']) {
  const file = path.join(ticket,
    `evidence/reports/d670-n78-text-progress/candidate/${locale}/lesson.template.json`);
  const lesson = read(file);
  const projector = lesson.prose.filter(block =>
    block.source_refs?.some(ref => ['p0208#4', 'p0208#5'].includes(ref)));
  assert.equal(projector.length, 2);
  for (const block of projector) {
    assert.ok(spec.source.authoritativeText.some(entry =>
      entry.lesson.endsWith(`:${locale}`) && entry.text === block.text),
    `Current FIG183 context differs for ${locale}`);
  }
  relevantText.push({ locale, file: bind(file), sourceRefs: ['p0208#4', 'p0208#5'],
    exactRelevantContextMatch: true });
}

const executable = [process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
  .filter(Boolean).find(fs.existsSync);
assert.ok(executable);
const browser = await chromium.launch({ executablePath: executable, headless: true });
const observations = [];
const screenshots = [];
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  await page.route('**/*', route => route.abort());
  const scenarios = [
    { width: 640, layout: 'scroll', theme: 'neutral', screenshot: 'actual-svg-scroll-640.png' },
    { width: 331, layout: 'scroll', theme: 'neutral', screenshot: 'actual-svg-scroll-end-331.png' },
    { width: 342, layout: 'scroll', theme: 'neutral' },
    { width: 331, layout: 'inline', theme: 'neutral' },
    { width: 342, layout: 'inline', theme: 'neutral' },
    { width: 640, layout: 'inline', theme: 'accent' },
    { width: 640, layout: 'inline', theme: 'neutral', print: true },
  ];
  for (const scenario of scenarios) {
    const { width, layout, theme } = scenario;
    await page.setViewportSize({ width: Math.max(width, 640), height: 540 });
    await page.emulateMedia({ media: scenario.print ? 'print' : 'screen' });
    const inlineStyle = layout === 'inline'
      ? `style="width:${width}px;max-width:100%"` : '';
    await page.setContent(`<!doctype html><style>${css}
      html,body { margin:0; overflow:visible; background:var(--sr-white); }
      .review-surface { width:${width}px; font-size:16px; }
      .review-surface figure { margin:0; }
      </style><main class="review-surface ${scenario.print ? 'sr-print-lesson' : ''}">
      <figure class="sr-read-fig" data-figure-layout="${layout}">
      <div class="sr-figure-media" data-figure-theme="${theme}" ${inlineStyle}>
      ${svg}</div></figure></main>`);
    const dom = await page.evaluate(() => {
      const svgNode = document.querySelector('.sr-figure-media svg');
      const media = svgNode.getBoundingClientRect();
      const labels = [...svgNode.querySelectorAll('text')].map(node => {
        const box = node.getBoundingClientRect();
        const ctm = node.getScreenCTM();
        return { text: node.textContent, fontPx: parseFloat(getComputedStyle(node).fontSize)
          * Math.hypot(ctm.a, ctm.b), left: box.left - media.left,
        top: box.top - media.top, right: box.right - media.left,
        bottom: box.bottom - media.top,
        color: getComputedStyle(node).fill };
      });
      const collisions = [];
      for (let a = 0; a < labels.length; a++) for (let b = a + 1; b < labels.length; b++) {
        const x = labels[a], y = labels[b];
        if (x.left < y.right && y.left < x.right && x.top < y.bottom && y.top < x.bottom)
          collisions.push([x.text, y.text]);
      }
      const wrapper = document.querySelector('figure');
      wrapper.scrollLeft = wrapper.scrollWidth;
      const end = wrapper.getBoundingClientRect();
      const screen = svgNode.getBoundingClientRect();
      return { mediaWidth: media.width, mediaHeight: media.height, labels, collisions,
        scroll: { clientWidth: wrapper.clientWidth, scrollWidth: wrapper.scrollWidth,
          scrollLeft: wrapper.scrollLeft, endReached:
            Math.abs(wrapper.scrollLeft + wrapper.clientWidth - wrapper.scrollWidth) <= 1,
          rightEdgeVisible: screen.right <= end.right + 1 },
        geometryCount: svgNode.querySelectorAll('path,line,polygon').length,
        roles: { ink: getComputedStyle(svgNode).getPropertyValue('--ld-figure-ink').trim(),
          muted: getComputedStyle(svgNode).getPropertyValue('--ld-figure-muted').trim(),
          paper: getComputedStyle(svgNode).getPropertyValue('--ld-figure-paper').trim() } };
    });
    assert.equal(dom.mediaWidth, layout === 'scroll' ? 640 : width);
    assert.equal(dom.labels.length, 6);
    assert.deepEqual(dom.labels.map(label => label.text), ['S', 'K', 'D', 'O', 'Screen', 'Paraxial model']);
    assert.ok(dom.labels.every(label => label.fontPx >= 16 && label.left >= 0
      && label.top >= 0 && label.right <= dom.mediaWidth && label.bottom <= dom.mediaHeight));
    assert.deepEqual(dom.collisions, []);
    assert.ok(dom.geometryCount > 30);
    assert.ok(dom.scroll.endReached && dom.scroll.rightEdgeVisible);
    const buffer = await page.locator(layout === 'scroll' && width < 640
      ? 'figure' : '.sr-figure-media').screenshot({ animations: 'disabled',
      ...(scenario.screenshot ? { path: path.join(owned, scenario.screenshot) } : {}) });
    const pixels = await page.evaluate(async base64 => {
      const image = new Image();
      image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      const rgba = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let dark = 0, nonwhite = 0;
      for (let index = 0; index < rgba.length; index += 4) {
        if (rgba[index] < 245 || rgba[index + 1] < 245 || rgba[index + 2] < 245) nonwhite++;
        if (rgba[index] < 100 && rgba[index + 1] < 100 && rgba[index + 2] < 100) dark++;
      }
      return { width: canvas.width, height: canvas.height, dark, nonwhite,
        nonwhiteFraction: nonwhite / (canvas.width * canvas.height) };
    }, buffer.toString('base64'));
    assert.ok(pixels.dark > 100 && pixels.nonwhiteFraction > 0.005 && pixels.nonwhiteFraction < 0.45);
    if (scenario.screenshot) screenshots.push(bind(path.join(owned, scenario.screenshot)));
    observations.push({ ...scenario, dom, pixels, status: 'pass' });
  }
} finally {
  await browser.close();
}
for (const input of inputs) assert.equal(bind(input.path).sha256, input.sha256,
  `Input changed during bounded review: ${input.path}`);
const receipt = {
  schema: 'd672/fig183-readonly-existing-svg-evidence@1',
  cwd: repo, generatedAt: new Date().toISOString(), inputs,
  nativeValidationAndRenderReused: true, geometryRerenders: 0,
  relevantText, inventory: { groups: spec.source.inventory.length,
    objects: objects.size, assertions: assertions.size, allMappedIdsResolve: true },
  independentModel: { u, v, f, magnification: -v / u, axis, slideX, objectiveX,
    screenX, fLessThanULessThan2f: true, enlargedInvertedImage: true, rayChecks },
  browser: { executable, headless: true, deviceScaleFactor: 1,
    offlineFigureHarnessOnly: true, productCss: bind(cssPath), networkBlocked: true },
  observations, screenshots, allInputHashesUnchanged: true,
  fullCardApproval: false, recordReviewRun: false, promotionRun: false,
};
const output = path.join(owned, 'inspection-receipt.json');
fs.writeFileSync(output, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ receipt: bind(output), screenshots, scenarios: observations.length,
  independentModel: receipt.independentModel }, null, 2));
