import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const own = path.dirname(fileURLToPath(import.meta.url));
const previous = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d544-n74-fig161162-first-independent-review');
const author = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d533-n74-first-modern-figure-author');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read = p => JSON.parse(fs.readFileSync(p));
const binding = p => ({ path: p, sha256: hash(p) });
const writeNew = (name, value) => {
  const p = path.join(own, name);
  fs.writeFileSync(p, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return binding(p);
};
const priorExpected = [
  ['READY.json', '5d0a1f471391f64dd3b7c9fbd9dba337ab339435e98c2da777299f09bfe16929'],
  ['report.json', 'd78dfdb7f5782a76ae4e3fcf479f9b62fd2738cc54a313d4245218f93f3f0ca7'],
  ['review-freeze.json', 'b6199832fa05bfe5b8aca0a9e0b556a1ca7e86f419ea5450ea8d333523baf9ef'],
  ['independent-inventory.json', 'b975e3f05908cebdba85471f344d0459f1e7d487e3a38d7e841060672e48dfb9'],
  ['actual-opens.json', 'ef1a39585e8291cf8c21ad3e1630aa4587439739dbab753da31f9281a40e52ce']
];
const authorExpected = [
  ['READY.json', '3c03a682e55276ae4ae3a6a4122ea0fc0d99c54902b4cf80e7bbe21c0e206c7d'],
  ['author-freeze.json', '39ed97b932909080385f928962bdf793aa5daafef510e46888599ecc7fc77c8e'],
  ['report.json', '315b62236120279e3027dc7c1d28c4c8c4f7455e7198fb0957b0e101ead7d067']
];
for (const [dir, entries] of [[previous, priorExpected], [author, authorExpected]]) {
  for (const [name, expected] of entries) {
    const p = path.join(dir, name);
    assert.equal(hash(p), expected, p);
    assert.equal(fs.statSync(p).mode & 0o777, 0o444);
  }
}
const prior = read(path.join(previous, 'report.json'));
assert.equal(read(path.join(previous, 'actual-opens.json')).actualOpenCount, 6);
assert.equal(prior.imageBudget.actualTotal, 6);
const inputs = prior.figures.map(item => {
  for (const key of ['source', 'context', 'spec', 'render', 'SVG', 'nativePNG']) {
    assert.equal(hash(item[key].path), item[key].sha256, `${item.figure} ${key}`);
  }
  return {
    figure: item.figure,
    source: item.source,
    context: item.context,
    spec: item.spec,
    nativeRender: item.render,
    SVG: item.SVG,
    nativePNG: item.nativePNG,
    originalStructureStatus: item.sourceAndNativeStructure.status,
    retainedD544MobileStatus: item.mobileGate.status
  };
});
delete process.env.PWDEBUG;
const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
const executablePath = chromium.executablePath();
assert.ok(fs.existsSync(executablePath), 'existing Chromium required; do not install');
const environment = {
  viewport: { width: 390, height: 400 },
  deviceScaleFactor: 1,
  headless: true,
  executablePath,
  profile: 'fresh isolated context, no user profile/CDP',
  mediaWidthPx: 342,
  background: '#ffffff',
  CSSVariablesDefinedByHarness: false,
  CSSStringsSubstituted: false,
  SVGOrSpecEdited: false
};
const command = writeNew('command.json', {
  schema: 'd556/affected-browser-command@1',
  preparedAt: new Date().toISOString(),
  command: 'node .intentfold/tickets/STEMROBIN-181/tmp/d556-n74-fig161162-mobile-browser-affected-review/browser-mobile.mjs',
  script: binding(fileURLToPath(import.meta.url)),
  playwright: { version: require('playwright/package.json').version, modulePath: require.resolve('playwright') },
  environment,
  originalBindings: inputs,
  reusedD544Bindings: priorExpected.map(([name, sha256]) => ({ path: path.join(previous, name), sha256 })),
  authorBindings: authorExpected.map(([name, sha256]) => ({ path: path.join(author, name), sha256 })),
  firstAffectedBrowserAttempt: true,
  originalAndNativeImagesReopened: false,
  initialActualImageOpenCount: 6,
  authorizedAdditionalActualOpens: 2,
  purpose: 'Correct only the CSS-var-incompatible raw resvg preview test environment. Retain every d544 verdict and pixel file without alteration.',
  noRenderSpecOrValidator: true,
  fullcardDISPLAY: 'pending'
});
const results = {
  schema: 'd556/affected-browser-results@1',
  command,
  environment,
  startedAt: new Date().toISOString(),
  figures: [],
  requests: [],
  pageErrors: [],
  browserClosed: false,
  contextClosed: false,
  actualImageOpensByThisScript: 0
};
let browser;
let context;
try {
  browser = await chromium.launch({ executablePath, headless: true });
  results.chromiumVersion = browser.version();
  context = await browser.newContext({
    viewport: environment.viewport,
    deviceScaleFactor: 1,
    offline: true
  });
  await context.route('**/*', route => {
    results.requests.push(route.request().url());
    return route.abort();
  });
  for (const input of inputs) {
    const rawSVG = fs.readFileSync(input.SVG.path, 'utf8');
    const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
html, body { margin: 0; padding: 0; background: #ffffff; }
#media { width: 342px; background: #ffffff; }
#media > svg { display: block; width: 100%; height: auto; }
</style></head><body><div id="media">${rawSVG}</div></body></html>`;
    const htmlBinding = writeNew(`${input.figure}.browser-harness.html`, html);
    const page = await context.newPage();
    page.on('pageerror', error => results.pageErrors.push(`${input.figure}: ${error.message}`));
    await page.setContent(html, { waitUntil: 'load' });
    const dom = await page.evaluate(figure => {
      const svg = document.querySelector('#media > svg');
      const media = document.querySelector('#media');
      const rect = element => {
        const r = element.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      };
      const matrix = svg.getScreenCTM();
      const prefix = `ld-${figure}_ld-s${figure.slice(4)}`;
      const lines = [...svg.querySelectorAll('line')].filter(node => node.id.startsWith(prefix));
      const lineRecords = lines.map(node => {
        const computed = getComputedStyle(node);
        const m = node.getScreenCTM();
        const start = new DOMPoint(node.x1.baseVal.value, node.y1.baseVal.value).matrixTransform(m);
        const end = new DOMPoint(node.x2.baseVal.value, node.y2.baseVal.value).matrixTransform(m);
        return {
          id: node.id,
          strokeAttribute: node.getAttribute('stroke'),
          computedStroke: computed.stroke,
          computedStrokeWidth: computed.strokeWidth,
          screenStrokeWidthPx: parseFloat(computed.strokeWidth) * Math.hypot(m.a, m.b),
          computedStrokeOpacity: computed.strokeOpacity,
          computedOpacity: computed.opacity,
          computedDisplay: computed.display,
          computedVisibility: computed.visibility,
          screenStart: [start.x, start.y],
          screenEnd: [end.x, end.y],
          screenLength: Math.hypot(end.x - start.x, end.y - start.y),
          rect: rect(node)
        };
      });
      return {
        figure,
        measuredAt: new Date().toISOString(),
        media: rect(media),
        SVG: rect(svg),
        svgIntrinsicWidth: svg.getAttribute('width'),
        svgIntrinsicHeight: svg.getAttribute('height'),
        viewBox: svg.getAttribute('viewBox'),
        screenCTM: { a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d, e: matrix.e, f: matrix.f },
        devicePixelRatio,
        containerBackground: getComputedStyle(media).backgroundColor,
        svgBackground: getComputedStyle(svg).backgroundColor,
        rootInkVariable: getComputedStyle(document.documentElement).getPropertyValue('--ld-figure-ink'),
        svgInkVariable: getComputedStyle(svg).getPropertyValue('--ld-figure-ink'),
        visibleTextNodes: [...svg.querySelectorAll('text')].map(node => node.textContent),
        lineRecords,
        faceLineCount: lineRecords.filter(line => line.id.includes('-face-')).length,
        rayLegLineCount: lineRecords.filter(line => /-ray-\d+-leg-/.test(line.id)).length,
        directionLineCount: lineRecords.filter(line => line.id.includes('-direction')).length
      };
    }, input.figure);
    const failures = [];
    if (dom.media.width !== 342 || dom.SVG.width !== 342 || dom.SVG.height !== 342) failures.push('media/SVG must measure 342x342');
    if (dom.containerBackground !== 'rgb(255, 255, 255)') failures.push('container must be white');
    if (dom.rootInkVariable || dom.svgInkVariable) failures.push('harness must not define CSS palette variables');
    if (dom.faceLineCount !== 3) failures.push('three prism boundary lines required');
    if (dom.rayLegLineCount !== (input.figure === 'fig-161' ? 8 : 10)) failures.push('all source path segments required');
    if (dom.directionLineCount !== (input.figure === 'fig-161' ? 4 : 6)) failures.push('all existing direction lines required');
    for (const line of dom.lineRecords) {
      if (line.computedStroke !== 'rgb(21, 32, 31)' ||
          line.screenStrokeWidthPx <= 0 ||
          Number(line.computedStrokeOpacity) <= 0 ||
          Number(line.computedOpacity) <= 0 ||
          line.computedDisplay === 'none' ||
          line.computedVisibility === 'hidden' ||
          line.screenLength <= 0) failures.push(`not visibly stroked: ${line.id}`);
    }
    dom.status = failures.length ? 'FAIL' : 'PASS';
    dom.failures = failures;
    dom.evidenceSavedBeforeScreenshot = true;
    const domBinding = writeNew(`${input.figure}.dom-media-stroke.json`, dom);
    const screenshotPath = path.join(own, `${input.figure}.browser-mobile-342.png`);
    assert.equal(fs.existsSync(screenshotPath), false, 'first element screenshot only');
    const screenshot = await page.locator('#media > svg').screenshot({ type: 'png', scale: 'css' });
    fs.writeFileSync(screenshotPath, screenshot, { flag: 'wx' });
    assert.equal(screenshot.readUInt32BE(16), 342);
    assert.equal(screenshot.readUInt32BE(20), 342);
    assert.equal(hash(input.SVG.path), input.SVG.sha256, 'frozen source SVG must remain unchanged');
    results.figures.push({
      figure: input.figure,
      frozenSVG: input.SVG,
      harness: htmlBinding,
      exactFrozenSVGInlineVerified: html.includes(rawSVG),
      dom: domBinding,
      domStatus: dom.status,
      screenshot: { ...binding(screenshotPath), width: 342, height: 342, ordinalForFigure: 1 },
      screenshotsTakenForFigure: 1,
      actuallyOpened: false
    });
    await page.close();
  }
} finally {
  if (context) {
    await context.close();
    results.contextClosed = true;
  }
  if (browser) {
    await browser.close();
    results.browserClosed = true;
  }
  results.finishedAt = new Date().toISOString();
  for (const [name, expected] of priorExpected) assert.equal(hash(path.join(previous, name)), expected, `d544 unchanged: ${name}`);
  writeNew('browser-results.json', results);
}
console.log(JSON.stringify({
  browserClosed: results.browserClosed,
  contextClosed: results.contextClosed,
  chromiumVersion: results.chromiumVersion,
  requests: results.requests,
  pageErrors: results.pageErrors,
  figures: results.figures.map(x => ({ figure: x.figure, domStatus: x.domStatus, screenshot: x.screenshot }))
}, null, 2));
