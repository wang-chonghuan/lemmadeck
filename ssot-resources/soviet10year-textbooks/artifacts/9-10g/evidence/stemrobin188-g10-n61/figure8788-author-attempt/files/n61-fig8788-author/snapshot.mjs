import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.dirname(fileURLToPath(import.meta.url));
if (process.cwd() !== repo) throw new Error('Wrong checkout');
const require = createRequire(path.join(repo, '.agents/skills/package.json'));
const { chromium } = require('playwright-core');
const [figure, draft] = process.argv.slice(2);
if (!['87', '88'].includes(figure) || !['FIRST', 'REPAIR1'].includes(draft)) throw new Error('Outside authorized drafts');
const stem = `fig-g10-${figure}.${draft}`;
const pngPath = path.join(root, `${stem}.widths-480-300.png`);
const receiptPath = path.join(root, `${stem}.snapshot.json`);
if (fs.existsSync(pngPath) || fs.existsSync(receiptPath)) throw new Error('Snapshot may run only once per actual draft');
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const svgFile = path.join(root, `${stem}.svg`), specFile = path.join(root, `${stem}.spec.json`), renderFile = path.join(root, `${stem}.render.json`);
const render = JSON.parse(fs.readFileSync(renderFile)), spec = JSON.parse(fs.readFileSync(specFile));
if (render.spec.sha256 !== sha(specFile) || render.output.svg.sha256 !== sha(svgFile)) throw new Error('Snapshot hash mismatch');
const receipt = {
  schema: 'bounded-author-isolated-snapshot@1', figure: spec.id, draft, nativeStatus: render.status,
  purpose: render.status === 'fail' ? 'Preserved FIRST failure diagnosis only; no dependent promotion.' : 'Author visual inspection of current mechanical render only.',
  mechanism: 'Existing n50/n56 isolated snapshot pattern: installed playwright-core, headless Chromium, unchanged exported SVG, actual CSS widths, one two-width screenshot per actual draft. No user window or external requests.',
  spec: { path: path.basename(specFile), sha256: sha(specFile) }, svg: { path: path.basename(svgFile), sha256: sha(svgFile) },
  render: { path: path.basename(renderFile), sha256: sha(renderFile) },
  headed: false, formalTest: false, independentReview: false, semanticApproval: false,
  screenshotCount: 1, imageContextLoadsByCommand: 0, measurements: [],
};
let browser;
try {
  const executablePath = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(p => fs.existsSync(p));
  if (!executablePath) throw new Error('Existing Chromium unavailable; no install authorized');
  browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 804, height: spec.canvas.height }, deviceScaleFactor: 1 });
  await page.route('**/*', r => r.abort());
  const svg = fs.readFileSync(svgFile, 'utf8');
  await page.setContent(`<style>html,body{margin:0;background:white;overflow:hidden}body{display:flex;gap:24px;align-items:flex-start}section{flex:none}svg{display:block;width:100%;height:auto}</style><section data-width="480" style="width:480px">${svg}</section><section data-width="300" style="width:300px">${svg}</section>`);
  await page.evaluate(() => document.fonts.ready);
  receipt.measurements = await page.evaluate(async () => {
    const results = [];
    for (const pane of document.querySelectorAll('section')) {
      const svg = pane.querySelector('svg'), frame = svg.getBoundingClientRect(), width = Number(pane.dataset.width);
      const localBox = n => {
        const b = n.getBoundingClientRect();
        return { x: b.x - frame.x, y: b.y - frame.y, width: b.width, height: b.height };
      };
      const within = b => b.x >= -0.01 && b.y >= -0.01 && b.x + b.width <= frame.width + 0.01 && b.y + b.height <= frame.height + 0.01;
      const labels = [...svg.querySelectorAll('text')].map(n => ({
        id: n.getAttribute('data-label-id'), text: n.textContent, box: localBox(n),
        fontPx: Number(n.getAttribute('font-size')) * Math.hypot(n.getScreenCTM().a, n.getScreenCTM().b),
      }));
      const geometry = [...svg.querySelectorAll('line,path,circle,ellipse,polyline,polygon')].filter(n => !n.closest('defs') && getComputedStyle(n).display !== 'none' && getComputedStyle(n).visibility !== 'hidden').map(n => ({ id: n.id, box: localBox(n) })).filter(g => g.box.width || g.box.height);
      const clone = svg.cloneNode(true);
      clone.setAttribute('width', String(width)); clone.setAttribute('height', String(frame.height));
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }));
      let pixels;
      try {
        const image = new Image(); image.src = url; await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = Math.round(frame.height);
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const rgba = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let ink = 0, dark = 0, border = 0;
        for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          if (Math.min(rgba[i], rgba[i + 1], rgba[i + 2]) < 235) {
            ink++;
            if (Math.max(rgba[i], rgba[i + 1], rgba[i + 2]) < 100) dark++;
            if (x < 2 || y < 2 || x >= canvas.width - 2 || y >= canvas.height - 2) border++;
          }
        }
        pixels = { width, height: canvas.height, ink, dark, border, nonblankNotBlack: ink > 100 && dark > 100 && ink < width * canvas.height * 0.35, unclipped: border === 0 };
      } finally { URL.revokeObjectURL(url); }
      const overlaps = [];
      for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
        const a = labels[i].box, b = labels[j].box;
        if (Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x) && Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y)) overlaps.push([labels[i].id, labels[j].id]);
      }
      const roles = [...new Set([...svg.querySelectorAll('[stroke],[fill]')].flatMap(n => ['stroke', 'fill'].map(k => n.getAttribute(k)).filter(v => v?.startsWith('var(--ld-figure-'))))];
      results.push({ width: frame.width, height: frame.height, labels, minFontPx: labels.length ? Math.min(...labels.map(l => l.fontPx)) : null, clippedLabels: labels.filter(l => !within(l.box)), clippedGeometry: geometry.filter(g => !within(g.box)), labelOverlaps: overlaps, geometryCount: geometry.length, semanticRoles: roles, pixels });
    }
    return results;
  });
  await page.screenshot({ path: pngPath, animations: 'disabled' });
  receipt.screenshot = { path: path.basename(pngPath), sha256: sha(pngPath) };
  receipt.checks = {
    declaredWidths: receipt.measurements.map(m => m.width).join(',') === '480,300',
    labelsAtLeast16: receipt.measurements.every(m => m.labels.every(l => l.fontPx >= 16)),
    labelsAndGeometryUnclipped: receipt.measurements.every(m => !m.clippedLabels.length && !m.clippedGeometry.length),
    labelsDoNotOverlap: receipt.measurements.every(m => !m.labelOverlaps.length),
    nonblankNotBlack: receipt.measurements.every(m => m.pixels.nonblankNotBlack && m.pixels.unclipped),
    semanticPalette: receipt.measurements.every(m => m.semanticRoles.length > 0),
  };
  receipt.status = Object.values(receipt.checks).every(Boolean) ? 'AUTHOR_SNAPSHOT_MECHANICAL_SATISFIED' : 'AUTHOR_SNAPSHOT_FAILED';
} catch (error) {
  receipt.status = 'EXECUTION_FAULT'; receipt.error = error.stack; process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
  for (const file of [receiptPath, pngPath, svgFile, renderFile]) if (fs.existsSync(file)) fs.chmodSync(file, 0o444);
}
console.log(JSON.stringify({ path: path.basename(receiptPath), sha256: sha(receiptPath), status: receipt.status, nativeStatus: receipt.nativeStatus, checks: receipt.checks, error: receipt.error }));
if (receipt.status === 'AUTHOR_SNAPSHOT_FAILED') process.exitCode = 2;
