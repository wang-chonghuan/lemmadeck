import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import {
  cwd, root, directory, previous, bind, read, write, hash,
  annotationIds, annotationTexts, assertBinding,
} from './evidence.mjs';

const { chromium } = await import(pathToFileURL(
  path.join(cwd, '.agents/skills/node_modules/playwright-core/index.mjs'),
));
const spec = path.join(directory, 'spec.r2.json');
const svgFile = path.join(directory, 'fig-206.r2.svg');
const reportFile = path.join(directory, 'fig-206.r2.render.json');
const figureSpec = read(spec);
const render = read(reportFile);
assert.equal(render.status, 'pass');
const inputs = [bind(spec), bind(svgFile), bind(reportFile)];
const expectedLabels = [
  ['s206-P', 'P'], ['s206-a-label', 'a'], ['s206-b-label', 'b'], ['s206-c-label', 'c'],
  ...annotationIds.map((id, index) => [id, annotationTexts[index]]),
];
const expectedStrokes = figureSpec.objects.filter(object => object.type === 'segment');
const expectedStrokeIds = expectedStrokes.map(object => object.id);
const startedAt = new Date().toISOString();
write(path.join(root, 'media.started.json'), { argv: process.argv, cwd, startedAt, inputs });
const outputs = [];
const measurements = [];
let browser = null;
let browserClosed = false;
let error = null;
let remoteRequestsBlocked = 0;

try {
  browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });
  for (const width of [300, 358]) {
    const output = path.join(root, `current-media-${width}.png`);
    assert.ok(!fs.existsSync(output), 'Capture already attempted; do not replay passed widths');
    const height = figureSpec.canvas.height * width / figureSpec.canvas.width;
    const page = await browser.newPage({
      viewport: { width: width + 32, height: Math.ceil(height) + 32 }, deviceScaleFactor: 1,
    });
    await page.route('**/*', route => {
      if (/^(about:|data:|file:)/.test(route.request().url())) return route.continue();
      remoteRequestsBlocked++;
      return route.abort();
    });
    await page.setContent('<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:white}main{margin:0;padding:0}iframe{display:block;border:0;margin:0;padding:0}</style></head><body><main id="media"></main></body></html>');
    await page.evaluate(({ width, height, source }) => {
      const main = document.querySelector('main');
      main.style.width = width + 'px';
      const frame = document.createElement('iframe');
      frame.id = 'figure-206';
      frame.style.width = width + 'px';
      frame.style.height = height + 'px';
      frame.srcdoc = '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:white}svg{width:100%;height:auto;display:block}</style></head><body>' + source + '</body></html>';
      main.append(frame);
    }, { width, height, source: fs.readFileSync(svgFile, 'utf8') });
    await page.waitForFunction(() => {
      const frames = document.querySelectorAll('iframe');
      return frames.length === 1 && frames[0].contentDocument?.querySelectorAll('text[data-label-id]').length === 8;
    });
    const data = await page.evaluate(async ({ expectedLabels, expectedStrokes, width }) => {
      const frame = document.querySelector('iframe');
      const doc = frame.contentDocument;
      await doc.fonts.ready;
      const svg = doc.querySelector('svg');
      const media = svg.getBoundingClientRect();
      const labels = [...svg.querySelectorAll('text[data-label-id]')].map(node => {
        const rect = node.getBoundingClientRect();
        const ctm = node.getScreenCTM();
        return {
          id: node.getAttribute('data-label-id'), text: node.textContent,
          actualTextPx: parseFloat(getComputedStyle(node).fontSize) * Math.hypot(ctm.a, ctm.b),
          rectangle: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          insideMedia: rect.left >= media.left - 0.1 && rect.top >= media.top - 0.1
            && rect.right <= media.right + 0.1 && rect.bottom <= media.bottom + 0.1,
          annotationBelowOriginalCanvas: !node.getAttribute('data-label-id').startsWith('modern206-')
            || rect.top >= media.top + 360 * width / 640,
        };
      });
      const overlaps = [];
      for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
        const a = labels[i].rectangle;
        const b = labels[j].rectangle;
        if (Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x) + 0.1
          && Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y) + 0.1) {
          overlaps.push([labels[i].id, labels[j].id]);
        }
      }
      const visibleLines = [...svg.querySelectorAll('line')].filter(line => {
        const style = getComputedStyle(line);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
      const strokes = expectedStrokes.map(object => {
        const node = visibleLines.find(line => line.id.endsWith(object.id));
        if (!node) return { id: object.id, present: false };
        return {
          id: object.id, present: true, nodeId: node.id,
          x1: Number(node.getAttribute('x1')), y1: Number(node.getAttribute('y1')),
          x2: Number(node.getAttribute('x2')), y2: Number(node.getAttribute('y2')),
          strokeWidth: Number(node.getAttribute('stroke-width')),
          dashArray: node.getAttribute('stroke-dasharray'),
          nativeCoordinatesPreserved: Number(node.getAttribute('x1')) === object.from[0]
            && Number(node.getAttribute('y1')) === 360 - object.from[1]
            && Number(node.getAttribute('x2')) === object.to[0]
            && Number(node.getAttribute('y2')) === 360 - object.to[1],
        };
      });
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      return {
        width, viewportWidth: innerWidth, actualMediaWidth: media.width, actualMediaHeight: media.height,
        iframeWidth: frame.getBoundingClientRect().width, iframeHeight: frame.getBoundingClientRect().height,
        minTextPx: Math.min(...labels.map(label => label.actualTextPx)), labels, overlaps,
        expectedLabelsPresent: expectedLabels.every(([id, text]) => labels.some(label => label.id === id && label.text === text)),
        visibleLineCount: visibleLines.length, strokes,
        noForeignFigureNodes: !svg.querySelector('[id^="ld-fig-204"], [id^="ld-fig-205"]'),
      };
    }, { expectedLabels, expectedStrokes, width });
    assert.ok(Math.abs(data.actualMediaWidth - width) < 0.1);
    assert.ok(Math.abs(data.actualMediaHeight - height) < 0.1);
    assert.ok(data.minTextPx >= 16 && data.expectedLabelsPresent);
    assert.ok(data.labels.every(label => label.insideMedia && label.annotationBelowOriginalCanvas));
    assert.deepEqual(data.overlaps, []);
    assert.equal(data.visibleLineCount, 5);
    assert.ok(data.strokes.every(stroke => stroke.present && stroke.nativeCoordinatesPreserved));
    assert.ok(data.noForeignFigureNodes);
    await page.locator('#media').screenshot({ path: output, animations: 'disabled' });
    outputs.push(bind(output));
    const pixels = await page.evaluate(async ({ png, width, expectedStrokeIds }) => {
      const image = new Image();
      image.src = 'data:image/png;base64,' + png;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      const bitmap = context.getImageData(0, 0, image.width, image.height);
      const dark = (x, y) => {
        const index = (Math.round(y) * image.width + Math.round(x)) * 4;
        return bitmap.data[index + 3] > 100
          && Math.max(bitmap.data[index], bitmap.data[index + 1], bitmap.data[index + 2]) < 200;
      };
      const scale = width / 640;
      const countBox = (x1, y1, x2, y2) => {
        let count = 0;
        for (let y = Math.max(0, Math.floor(y1)); y < Math.min(image.height, Math.ceil(y2)); y++) {
          for (let x = Math.max(0, Math.floor(x1)); x < Math.min(image.width, Math.ceil(x2)); x++) {
            if (dark(x, y)) count++;
          }
        }
        return count;
      };
      const solidBands = [70, 160, 300].map((y, index) => ({
        id: expectedStrokeIds[index],
        inkPixels: countBox(60 * scale, y * scale - 2, (index === 2 ? 520 : 370) * scale, y * scale + 3),
      }));
      const annotationRows = [395, 445, 495, 545].map(y => ({
        nativeAnchorY: y, inkPixels: countBox(80 * scale, (y - 25) * scale, 560 * scale, (y + 25) * scale),
      }));
      return {
        imageWidth: image.width, imageHeight: image.height, solidBands, annotationRows,
        dashCrossingRegionInkPixels: countBox(400 * scale, 72 * scale, 595 * scale, 160 * scale),
        blankCornerIsPaper: !dark(image.width - 3, image.height - 3),
        originalDiagramAndAnnotationWithinImage: image.height >= Math.floor(600 * scale),
      };
    }, { png: fs.readFileSync(output).toString('base64'), width, expectedStrokeIds });
    assert.equal(pixels.imageWidth, width);
    assert.ok(pixels.solidBands.every(band => band.inkPixels > width / 5));
    assert.ok(pixels.annotationRows.every(row => row.inkPixels > 100));
    assert.ok(pixels.dashCrossingRegionInkPixels > 50);
    assert.ok(pixels.blankCornerIsPaper && pixels.originalDiagramAndAnnotationWithinImage);
    measurements.push({ ...data, pixels, output: bind(output) });
    await page.close();
  }
} catch (caught) {
  error = { name: caught.name, message: caught.message, stack: caught.stack };
  process.exitCode = 2;
} finally {
  if (browser) {
    await browser.close();
    browserClosed = true;
  }
  try {
    inputs.forEach(assertBinding);
  } catch (caught) {
    error = { name: caught.name, message: caught.message };
    process.exitCode = 2;
  }
  const evidence = {
    schema: 'scoped-actual-media-evidence@1', figure: 'fig-206', contentRevision: 2,
    role: 'AUTHOR_ONLY_NOT_INDEPENDENT_REVIEW',
    argv: process.argv, cwd, startedAt, finishedAt: new Date().toISOString(),
    exitCode: process.exitCode || 0, status: error ? 'failed' : 'completed', error,
    inputs, outputs, measurements, actualMediaWidths: [300, 358],
    previousPatternReadOnly: bind(path.join(previous, 'check-media.mjs')),
    wrapper: 'one fig206 SVG in its own iframe document; viewport 32px wider than actual media; no viewport resize',
    historicalImagesLoadedOrRerendered: false, nativeStagesRerun: false,
    assetsRewritten: hash(svgFile) !== inputs[1].sha256,
    remoteRequestsAllowed: false, remoteRequestsBlocked, browserClosed,
    formalProductAcceptance: false, independentApproval: false,
    limitation: 'Isolated offline media only; no app or lesson rendered.',
    activeExecSessions: [],
  };
  write(path.join(root, 'media.evidence.json'), evidence);
  if (error) write(path.join(root, 'media.firstfailure.json'), {
    evidence: bind(path.join(root, 'media.evidence.json')), outputs, error,
    dependentStagesStopped: true, revisionsAndAttemptsNotReset: true,
  });
}
console.log(JSON.stringify({
  status: error ? 'failed' : 'completed', outputs, error,
  measurements: measurements.map(data => ({
    width: data.actualMediaWidth, height: data.actualMediaHeight,
    minTextPx: data.minTextPx, visibleLineCount: data.visibleLineCount,
    pixels: data.pixels,
  })), activeExecSessions: [],
}, null, 2));
