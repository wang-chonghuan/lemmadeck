import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from '../../../../../.agents/skills/node_modules/playwright-core/index.mjs';

const cwd = process.cwd();
const root = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n32-204206-scoped-repair-author-14');
const old = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n32-fig204206-author-first-10');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size });
const write = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
const assets = [
  path.join(root, 'fig-204/fig-204.r1.svg'),
  path.join(old, 'fig-206/fig-206.r1.svg'),
];
const reports = [
  path.join(root, 'fig-204/fig-204.r1.render.json'),
  path.join(old, 'fig-206/fig-206.r1.render.json'),
];
const before = assets.map(bind);
const startedAt = new Date().toISOString();
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
const outputs = [];
const measurements = [];
let historicalDiagnosis = null;
let error = null;
let browserClosed = false;
try {
  if (reports.some(file => JSON.parse(fs.readFileSync(file)).status !== 'pass')) throw new Error('Native stage not passed');
  for (const width of [300, 358]) {
    const heights = [430, 360].map(height => height * width / 640);
    const totalHeight = Math.ceil(heights[0] + 12 + heights[1]);
    const page = await browser.newPage({ viewport: { width: width + 32, height: totalHeight + 32 }, deviceScaleFactor: 1 });
    await page.route('**/*', route => /^(about:|data:|file:)/.test(route.request().url()) ? route.continue() : route.abort());
    await page.setContent('<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:white}main{margin:0;padding:0}iframe{display:block;border:0;margin:0;padding:0}iframe+iframe{margin-top:12px}</style></head><body><main id="media"></main></body></html>');
    await page.evaluate(({ width, heights, sources }) => {
      const main = document.querySelector('main');
      main.style.width = width + 'px';
      for (let i = 0; i < sources.length; i++) {
        const frame = document.createElement('iframe');
        frame.id = 'figure-' + i;
        frame.style.width = width + 'px';
        frame.style.height = heights[i] + 'px';
        frame.srcdoc = '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:white}svg{width:100%;height:auto;display:block}</style></head><body>' + sources[i] + '</body></html>';
        main.append(frame);
      }
    }, { width, heights, sources: assets.map(file => fs.readFileSync(file, 'utf8')) });
    await page.waitForFunction(() => [...document.querySelectorAll('iframe')].length === 2 && [...document.querySelectorAll('iframe')].every(frame => frame.contentDocument?.querySelectorAll('text[data-label-id]').length === 4));
    const data = await page.evaluate(async ({ width }) => {
      const figures = [];
      for (const frame of document.querySelectorAll('iframe')) {
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
            insideMedia: rect.x >= media.x - 0.1 && rect.y >= media.y - 0.1 && rect.right <= media.right + 0.1 && rect.bottom <= media.bottom + 0.1,
          };
        });
        const visibleLines = [...svg.querySelectorAll('line')].filter(line => getComputedStyle(line).display !== 'none');
        figures.push({
          figure: frame.id === 'figure-0' ? 'fig-204' : 'fig-206',
          actualMediaWidth: media.width, actualMediaHeight: media.height,
          iframeWidth: frame.getBoundingClientRect().width,
          minTextPx: Math.min(...labels.map(label => label.actualTextPx)),
          labels, visibleLineCount: visibleLines.length,
          cLine: visibleLines.find(line => /s206-c-solid$/.test(line.id))?.outerHTML || null,
          noForeignFigureNodes: !svg.querySelector(frame.id === 'figure-0' ? '[id^="ld-fig-206"]' : '[id^="ld-fig-204"]'),
        });
      }
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      return { width, viewportWidth: innerWidth, figures };
    }, { width });
    if (data.figures.some(figure => Math.abs(figure.actualMediaWidth - width) > 0.1 || figure.minTextPx < 16 || figure.labels.some(label => !label.insideMedia) || !figure.noForeignFigureNodes)) throw new Error('Actual media/label failure');
    const output = path.join(root, `current-media-${width}.png`);
    if (fs.existsSync(output)) throw new Error('Media capture already attempted');
    await page.locator('#media').screenshot({ path: output, animations: 'disabled' });
    outputs.push(bind(output));
    const pixels = await page.evaluate(async ({ png, width, y206, height206 }) => {
      const image = new Image();
      image.src = 'data:image/png;base64,' + png;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      const dark = (x, y) => {
        const [r, g, b, a] = context.getImageData(Math.round(x), Math.round(y), 1, 1).data;
        return a > 100 && Math.max(r, g, b) < 200;
      };
      const countBand = (x1, x2, y, halfHeight) => {
        let count = 0;
        for (let x = Math.ceil(x1); x < Math.floor(x2); x++) for (let yy = Math.floor(y - halfHeight); yy <= Math.ceil(y + halfHeight); yy++) if (dark(x, yy)) count++;
        return count;
      };
      return {
        imageWidth: image.width, imageHeight: image.height,
        lower206CLineInkPixels: countBand(60 * width / 640, 520 * width / 640, y206 + 300 * width / 640, 2),
        lower206RegionWithinImage: y206 + height206 <= image.height + 1,
        blankCornerIsPaper: !dark(image.width - 3, image.height - 3),
      };
    }, { png: fs.readFileSync(output).toString('base64'), width, y206: heights[0] + 12, height206: heights[1] });
    if (pixels.imageWidth !== width || pixels.lower206CLineInkPixels < width / 4 || !pixels.lower206RegionWithinImage || !pixels.blankCornerIsPaper) throw new Error('Captured lower-region pixel check failed');
    measurements.push({ ...data, pixels, output: bind(output) });

    if (width === 358) {
      historicalDiagnosis = await page.evaluate(async ({ oldPng, old206Svg, old204Svg }) => {
        const load = async (data, mime) => {
          const image = new Image();
          image.src = 'data:' + mime + ';base64,' + data;
          await image.decode();
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          const context = canvas.getContext('2d');
          context.drawImage(image, 0, 0);
          return { canvas, context, width: image.width, height: image.height };
        };
        const old = await load(oldPng, 'image/png');
        const native206 = await load(old206Svg, 'image/svg+xml');
        const native204 = await load(old204Svg, 'image/svg+xml');
        const isDark = (surface, x, y) => {
          const [r, g, b, a] = surface.context.getImageData(Math.round(x), Math.round(y), 1, 1).data;
          return a > 100 && Math.max(r, g, b) < 200;
        };
        let oldExpectedCInk = 0;
        const y206 = 430 * 358 / 640 + 12;
        const expectedCY = y206 + 300 * 358 / 640;
        for (let x = 40; x < 290; x++) for (let y = Math.floor(expectedCY - 2); y <= Math.ceil(expectedCY + 2); y++) if (isDark(old, x, y)) oldExpectedCInk++;
        let native206CInk = 0;
        for (let x = 60; x < 520; x++) for (let y = 298; y <= 302; y++) if (isDark(native206, x, y)) native206CInk++;
        return {
          oldPngSize: [old.width, old.height],
          old206NativeSize: [native206.width, native206.height],
          old204NativeSize: [native204.width, native204.height],
          expectedLower206CLineY: expectedCY,
          oldExpectedLowerCLineInkPixels: oldExpectedCInk,
          isolatedNative206CLineInkPixels: native206CInk,
          classification: 'historical multi-SVG screenshot wrapper/capture corruption, not missing c in native SVG or FigureSpec',
          engineMechanism: 'UNKNOWN: no claim that isolated engine, compositor, CSS or viewport-resize mechanism has been individually proved',
          historicalCanvasCheckLimitation: 'The old inkPixels check decoded each SVG independently rather than checking captured screenshot bytes; it could not detect foreign lower-region content.',
        };
      }, {
        oldPng: fs.readFileSync(path.join(old, 'mobile-358.png')).toString('base64'),
        old206Svg: fs.readFileSync(path.join(old, 'fig-206/fig-206.r1.svg')).toString('base64'),
        old204Svg: fs.readFileSync(path.join(old, 'fig-204/fig-204.svg')).toString('base64'),
      });
      if (historicalDiagnosis.oldExpectedLowerCLineInkPixels > 30 || historicalDiagnosis.isolatedNative206CLineInkPixels < 500) throw new Error('Historical diagnosis not supported by pixels');
    }
    await page.close();
  }
} catch (caught) {
  error = { name: caught.name, message: caught.message };
  process.exitCode = 2;
} finally {
  await browser.close();
  browserClosed = true;
  if (assets.some((file, i) => hash(file) !== before[i].sha256)) {
    error = { name: 'InputDrift', message: 'Native SVG changed during display capture' };
    process.exitCode = 2;
  }
  write(path.join(root, 'media.evidence.json'), {
    schema: 'scoped-actual-media-evidence@1', role: 'AUTHOR_ONLY_NOT_INDEPENDENT_REVIEW',
    argv: process.argv, cwd, startedAt, finishedAt: new Date().toISOString(),
    status: error ? 'failed' : 'completed', error,
    inputs: [...before, ...reports.map(bind)],
    historicalInputs: ['mobile-358.png', 'mobile.evidence.json', 'mobile.mjs', 'fig-204/fig-204.svg', 'fig-206/fig-206.r1.svg'].map(file => bind(path.join(old, file))),
    outputs, actualMediaWidths: [300, 358], measurements, historicalDiagnosis,
    nativeStagesRerun: false, assetsRewritten: false,
    wrapper: 'separate iframe document per SVG; viewport deliberately 32 px wider than measured media; no post-layout viewport resize',
    formalProductAcceptance: false, limitation: 'Offline figure display only; no app or lesson rendered.',
    browserClosed, remoteRequestsAllowed: false, activeExecSessions: [],
  });
}
console.log(JSON.stringify({ status: error ? 'failed' : 'completed', outputs, historicalDiagnosis, error }, null, 2));
