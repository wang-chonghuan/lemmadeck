import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from '../../../../../.agents/skills/node_modules/playwright-core/index.mjs';

const cwd = process.cwd();
const root = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n32-fig204206-author-first-10');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const assets = [
  path.join(root, 'fig-204/fig-204.svg'),
  path.join(root, 'fig-206/fig-206.r1.svg'),
];
const reports = [
  path.join(root, 'fig-204/fig-204.render.json'),
  path.join(root, 'fig-206/fig-206.r1.render.json'),
];
for (const file of reports) {
  if (JSON.parse(fs.readFileSync(file)).status !== 'pass') throw new Error('Mobile preview requires successful native render');
}
const before = assets.map(bind);
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const startedAt = new Date().toISOString();
const measurements = [];
const outputs = [];
try {
  for (const width of [300, 358]) {
    const page = await browser.newPage({ viewport: { width, height: 800 }, deviceScaleFactor: 1 });
    await page.route('**/*', route => {
      const url = route.request().url();
      return /^(data:|about:|file:)/.test(url) ? route.continue() : route.abort();
    });
    const sources = assets.map(file => fs.readFileSync(file, 'utf8'));
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
      html,body{margin:0;padding:0;background:white;width:${width}px}
      section{margin:0;padding:0;width:${width}px}
      section+section{margin-top:12px}
      section>svg{width:100%;height:auto;display:block}
      </style></head><body>${sources.map((svg, i) => `<section data-figure="${i}">${svg}</section>`).join('')}</body></html>`);
    const data = await page.evaluate(async ({ width, sources }) => {
      const figures = [];
      for (let i = 0; i < sources.length; i++) {
        const svg = document.querySelector(`section[data-figure="${i}"]>svg`);
        const outer = svg.getBoundingClientRect();
        const scale = outer.width / svg.viewBox.baseVal.width;
        const labels = [...svg.querySelectorAll('text[data-label-id]')].map(node => {
          const rect = node.getBoundingClientRect();
          return {
            id: node.getAttribute('data-label-id'), text: node.textContent,
            actualTextPx: parseFloat(getComputedStyle(node).fontSize) * scale,
            rectangle: { x: rect.x - outer.x, y: rect.y - outer.y, width: rect.width, height: rect.height },
            insideMedia: rect.x >= outer.x - 0.1 && rect.y >= outer.y - 0.1 && rect.right <= outer.right + 0.1 && rect.bottom <= outer.bottom + 0.1,
          };
        });
        const image = new Image();
        image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(sources[i])))}`;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = Math.ceil(outer.height);
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let inkPixels = 0;
        for (let j = 0; j < pixels.length; j += 4) {
          if (pixels[j + 3] > 100 && Math.max(pixels[j], pixels[j + 1], pixels[j + 2]) < 200) inkPixels++;
        }
        figures.push({
          index: i, actualWidth: outer.width, actualHeight: outer.height,
          minTextPx: Math.min(...labels.map(label => label.actualTextPx)),
          labels, inkPixels, nonblank: inkPixels > 100,
        });
      }
      return { width, figures, height: Math.ceil(document.body.getBoundingClientRect().height) };
    }, { width, sources });
    if (data.figures.some(f => !f.nonblank || f.actualWidth !== width || f.minTextPx < 16 || f.labels.some(l => !l.insideMedia))) {
      throw new Error(`Mobile readability failure at ${width}`);
    }
    await page.setViewportSize({ width, height: data.height });
    const output = path.join(root, `mobile-${width}.png`);
    if (fs.existsSync(output)) throw new Error('Cannot repeat mobile screenshot');
    await page.screenshot({ path: output, fullPage: true });
    outputs.push(bind(output));
    measurements.push(data);
    await page.close();
  }
} finally {
  await browser.close();
}
if (assets.some((file, i) => hash(file) !== before[i].sha256)) throw new Error('Native SVG changed during preview');
const result = {
  schema: 'bounded-author-mobile-evidence@1', role: 'AUTHOR_SANITY_NOT_REVIEW',
  argv: process.argv, cwd, startedAt, finishedAt: new Date().toISOString(),
  sourceAssets: before, nativeReports: reports.map(bind), outputs,
  actualWidths: [300, 358], nativeAssetsRewritten: false, browserClosed: true,
  remoteRequestsAllowed: false, noAppOrServerUsed: true,
  measurements, status: 'completed',
};
fs.writeFileSync(path.join(root, 'mobile.evidence.json'), `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' });
console.log('Mobile evidence completed: unchanged SVG assets at 300 and 358 px; browser closed.');
