import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { R, OWN, bind, read, write, run, ledgerEvent } from './evidence.mjs';

const require = createRequire(path.join(R, '.agents/skills/package.json'));
const { chromium } = require('playwright-core');
assert.equal(process.cwd(), R);
const specPath = path.join(OWN, 'figures/fig-187.spec.json');
const svgPath = path.join(OWN, 'figures/fig-187.svg');
const renderPath = path.join(OWN, 'figures/fig-187.render.json');
const spec = read(specPath), render = read(renderPath);
assert.equal(render.status, 'pass');
assert.equal(render.spec.sha256, bind(specPath).sha256);
assert.equal(render.output.svg.sha256, bind(svgPath).sha256);
assert.equal(spec.display.layout, 'scroll');
assert.deepEqual(spec.display.widths, [640]);
const svg = fs.readFileSync(svgPath, 'utf8');
const contacts = path.join(OWN, 'contacts');
const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
const measurements = [], panels = [], browserErrors = [], requests = [];
let closed = false;

function fixture(viewport, mediaWidth) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;background:#fff;width:100%;overflow-x:hidden}
.window{width:${viewport}px;height:${mediaWidth / 2}px;overflow-x:auto;overflow-y:hidden}
.window>svg{display:block;width:${mediaWidth}px!important;height:${mediaWidth / 2}px!important;max-width:none!important;flex:none}
</style></head><body><div class="window">${svg}</div></body></html>`;
}
try {
  const context = await browser.newContext({ offline: true, deviceScaleFactor: 1 });
  await context.route('**/*', route => { requests.push(route.request().url()); return route.abort(); });
  const page = await context.newPage();
  page.on('pageerror', e => browserErrors.push(e.message));
  for (const [viewport, mediaWidth] of [[960, 960], [640, 640], [358, 640], [300, 640]]) {
    await page.setViewportSize({ width: viewport, height: 600 });
    const html = fixture(viewport, mediaWidth);
    write(path.join(contacts, `fig-187.viewport-${viewport}.html`), html);
    await page.setContent(html);
    const sample = async phase => page.evaluate(({ viewport, mediaWidth, phase }) => {
      const windowNode = document.querySelector('.window');
      const root = windowNode.querySelector('svg');
      const media = root.getBoundingClientRect(), windowRect = windowNode.getBoundingClientRect();
      const texts = [...root.querySelectorAll('text')].map(node => {
        const matrix = node.getScreenCTM(), rect = node.getBoundingClientRect();
        return {
          id: node.getAttribute('data-label-id'), text: node.textContent,
          px: parseFloat(getComputedStyle(node).fontSize) * Math.hypot(matrix.a, matrix.b),
          insideMedia: rect.left >= media.left - .01 && rect.top >= media.top - .01 && rect.right <= media.right + .01 && rect.bottom <= media.bottom + .01,
          insideWindow: rect.left >= windowRect.left - .01 && rect.right <= windowRect.right + .01,
          rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom }
        };
      });
      const clone = root.cloneNode(true), nodes = [...root.querySelectorAll('*')], copies = [...clone.querySelectorAll('*')];
      nodes.forEach((node, i) => {
        if (['path', 'line', 'circle', 'ellipse', 'polygon', 'polyline', 'rect', 'text'].includes(node.tagName)) {
          copies[i].setAttribute('fill', getComputedStyle(node).fill);
          copies[i].setAttribute('stroke', getComputedStyle(node).stroke);
        }
      });
      clone.removeAttribute('style');
      clone.setAttribute('width', String(media.width)); clone.setAttribute('height', String(media.height));
      const ns = 'http://www.w3.org/2000/svg';
      const windowSvg = document.createElementNS(ns, 'svg');
      windowSvg.setAttribute('width', String(viewport)); windowSvg.setAttribute('height', String(media.height));
      windowSvg.setAttribute('viewBox', `0 0 ${viewport} ${media.height}`);
      windowSvg.setAttribute('overflow', 'hidden');
      clone.setAttribute('x', String(-windowNode.scrollLeft)); clone.setAttribute('y', '0');
      windowSvg.appendChild(clone);
      return {
        measurement: {
          viewport, phase, mediaWidth: media.width, mediaHeight: media.height, layout: viewport === 960 ? 'native canvas' : 'fixed640 scroll',
          scrollLeft: windowNode.scrollLeft, scrollWidth: windowNode.scrollWidth, clientWidth: windowNode.clientWidth,
          scrollMax: windowNode.scrollWidth - windowNode.clientWidth, endReached: Math.abs(windowNode.scrollLeft - (windowNode.scrollWidth - windowNode.clientWidth)) < 1,
          mediaRightAtWindowRight: Math.abs(media.right - windowRect.right) < 1,
          measuredMinPx: Math.min(...texts.map(t => t.px)), minTextPx: 16, labels: texts,
          noDocumentHorizontalOverflow: document.documentElement.scrollWidth === viewport,
          capture: 'Serialized actual browser DOM with computed colors and measured scrollLeft, then native resvg; no source crop or figure geometry edit'
        },
        panel: new XMLSerializer().serializeToString(windowSvg)
      };
    }, { viewport, mediaWidth, phase });
    const start = await sample('start');
    assert.equal(start.measurement.mediaWidth, mediaWidth);
    assert.equal(start.measurement.mediaHeight, mediaWidth / 2);
    assert.equal(start.measurement.scrollLeft, 0);
    assert.equal(start.measurement.labels.length, 23);
    assert.ok(start.measurement.labels.every(t => t.insideMedia));
    assert.ok(start.measurement.measuredMinPx >= 16);
    assert.ok(start.measurement.noDocumentHorizontalOverflow);
    measurements.push(start.measurement); panels.push({ ...start, id: `${viewport}-start` });
    if (viewport < mediaWidth) {
      await page.mouse.move(viewport / 2, 160);
      await page.mouse.wheel(2000, 0);
      await page.waitForFunction(() => {
        const w = document.querySelector('.window');
        return Math.abs(w.scrollLeft - (w.scrollWidth - w.clientWidth)) < 1;
      }, undefined, { timeout: 5000 });
      const end = await sample('end');
      assert.equal(end.measurement.scrollMax, 640 - viewport);
      assert.ok(end.measurement.endReached);
      assert.ok(end.measurement.mediaRightAtWindowRight);
      assert.ok(end.measurement.labels.find(t => t.id === 'right-panel-label').insideWindow);
      assert.ok(end.measurement.labels.find(t => t.id === 'right-A-label').insideWindow);
      assert.ok(end.measurement.labels.every(t => t.insideMedia));
      assert.ok(end.measurement.measuredMinPx >= 16);
      measurements.push(end.measurement); panels.push({ ...end, id: `${viewport}-end` });
    }
  }
  assert.deepEqual(requests, []);
  assert.deepEqual(browserErrors, []);
  const positions = [
    ['960-start', 0, 28, 'Native 960px render'],
    ['640-start', 0, 536, 'Fixed 640px media'],
    ['300-start', 660, 536, '300px window: start'],
    ['358-start', 0, 884, '358px window: start'],
    ['358-end', 374, 884, '358px window: wheel-scroll end'],
    ['300-end', 748, 884, '300px window: wheel-scroll end']
  ];
  const composite = await page.evaluate(({ panels, positions }) => {
    const ns = 'http://www.w3.org/2000/svg', doc = document.implementation.createDocument(ns, 'svg');
    const root = doc.documentElement;
    root.setAttribute('width', '1048'); root.setAttribute('height', '1204'); root.setAttribute('viewBox', '0 0 1048 1204');
    const paper = doc.createElementNS(ns, 'rect');
    paper.setAttribute('width', '1048'); paper.setAttribute('height', '1204'); paper.setAttribute('fill', 'white'); root.appendChild(paper);
    for (const [id, x, y, captionText] of positions) {
      const node = new DOMParser().parseFromString(panels.find(p => p.id === id).panel, 'image/svg+xml').documentElement;
      const imported = doc.importNode(node, true); imported.setAttribute('x', String(x)); imported.setAttribute('y', String(y)); root.appendChild(imported);
      const caption = doc.createElementNS(ns, 'text');
      caption.setAttribute('x', String(x + 4)); caption.setAttribute('y', String(y - 8));
      caption.setAttribute('font-family', 'Arial'); caption.setAttribute('font-size', '16'); caption.setAttribute('fill', '#202020');
      caption.textContent = captionText; root.appendChild(caption);
    }
    return new XMLSerializer().serializeToString(root);
  }, { panels, positions });
  const contactSvg = path.join(contacts, 'fig-187.contact.svg'), contactPng = path.join(contacts, 'fig-187.contact.png');
  write(contactSvg, composite);
  write(path.join(contacts, 'fig-187.measurements.json'), { measurements, interactions: 'Actual mouse wheel horizontal input at 358 and 300; waited for physical scroll end; no scrollLeft assignment', requests, browserErrors });
  for (const [id] of positions) ledgerEvent({ kind: id === '960-start' || id === '640-start' ? 'render-contact-view' : 'display-window-crop', view: id, charge: 1, contact: contactPng, status: 'charged before rasterization; pending author open' });
  const raster = run('native-resvg-contact', [process.execPath, path.join(R, '.claude/skills/ld-s10y-lesson/tools/svg_raster.js'), contactSvg, contactPng, '1048'], {
    inputs: [contactSvg], outputs: [contactPng], chargeFailure: true
  });
  assert.equal(raster.exitCode, 0, 'Native resvg failure retained; stop dependent stage');
  const pixels = await page.evaluate(async ({ data, positions, panels }) => {
    const image = new Image(); image.src = data; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
    return positions.map(([id, x, y]) => {
      const panel = panels.find(p => p.id === id).measurement;
      const w = panel.viewport, h = panel.mediaHeight;
      const rgba = ctx.getImageData(x, y, w, h).data;
      let ink = 0, paper = 0;
      for (let i = 0; i < rgba.length; i += 4) {
        if (rgba[i] < 200 && rgba[i + 1] < 200 && rgba[i + 2] < 200) ink++;
        if (rgba[i] > 245 && rgba[i + 1] > 245 && rgba[i + 2] > 245) paper++;
      }
      return { id, x, y, width: w, height: h, inkPixels: ink, paperPixels: paper, nonblank: ink > 200, notBlackRaster: paper > w * h * .8 };
    });
  }, { data: 'data:image/png;base64,' + fs.readFileSync(contactPng).toString('base64'), positions, panels });
  assert.ok(pixels.every(p => p.nonblank && p.notBlackRaster));
  await context.close();
  await browser.close();
  closed = true;
  write(path.join(contacts, 'fig-187.display.json'), {
    status: 'AUTHOR_PHYSICAL_DISPLAY_PASS_PENDING_AUTHOR_VISUAL_INSPECTION',
    createdAt: new Date().toISOString(), spec: bind(specPath), svg: bind(svgPath), nativeRender: bind(renderPath),
    contact: bind(contactPng), contactSvg: bind(contactSvg), measurements, resvgPixelChecks: pixels,
    scrollEndReachability: { 358: { maximum: 282, reachedBy: 'mouse wheel' }, 300: { maximum: 340, reachedBy: 'mouse wheel' } },
    browser: { mode: 'headless isolated offline local per-figure media', executablePath, requests, errors: browserErrors, sessionsOpen: 0, closed },
    headedProductAcceptance: false, wholeLessonValidation: false, independentApproval: false,
    evidenceScope: 'Only modern fig-187; fixed 640px media in actual 358/300px browser viewport windows plus native/640 full views'
  });
  console.log(JSON.stringify({ figure: 'fig-187', status: 'AUTHOR_PHYSICAL_DISPLAY_PASS', min640TextPx: 16, contact: bind(contactPng), scrollEndReached: [358, 300], sessionsOpen: 0 }));
} finally {
  if (!closed) await browser.close();
}
