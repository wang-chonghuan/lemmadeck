import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const out = path.dirname(fileURLToPath(import.meta.url));
const [candidate = 'first'] = process.argv.slice(2);
assert(['first', 'repair'].includes(candidate));
const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const bind = file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const base = candidate === 'first' ? 'fig-26' : 'fig-26.repair';
const svgFile = path.join(out, `${base}.svg`);
const renderFile = path.join(out, `${base}.render.json`);
const render = JSON.parse(fs.readFileSync(renderFile, 'utf8'));
const specFile = path.resolve(render.spec.path);
const before = [svgFile, specFile, renderFile].map(bind);
const reportFile = path.join(out, `${base}.preview.json`);
assert(!fs.existsSync(reportFile));
const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
assert.equal(render.output.svg.sha256, before[0].sha256);
assert.equal(render.spec.sha256, before[1].sha256);
const requests = [];
const previews = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 900, height: 700 } });
  try {
    await context.route('**/*', route => {
      requests.push(route.request().url());
      return route.abort();
    });
    const page = await context.newPage();
    const svg = fs.readFileSync(svgFile, 'utf8');
    await page.setContent(`<!doctype html><style>
      :root {
        --ld-figure-ink:#15201f; --ld-figure-muted:#4c5a58;
        --ld-figure-accent:#15201f; --ld-figure-accent-soft:#8a9795;
        --ld-figure-grid:#e3eae9; --ld-figure-paper:#ffffff;
      }
      html,body{margin:0;padding:0;background:#ffffff}
      body{display:flex;gap:30px;align-items:flex-start;padding:15px}
      .full{width:420px}.mobile{width:331px}
      svg{width:100%;height:auto;display:block;background:#ffffff}
    </style><div class="full">${svg}</div><div class="mobile">${svg}</div>`);
    await page.evaluate(() => document.fonts.ready);
    for (const [selector, width] of [['.full', 420], ['.mobile', 331]]) {
      const geometry = await page.locator(`${selector} svg`).evaluate(node => ({
        width: node.getBoundingClientRect().width,
        height: node.getBoundingClientRect().height,
        background: getComputedStyle(node).backgroundColor,
        labels: [...node.querySelectorAll('text')].map(text => {
          const matrix = text.getScreenCTM();
          return { text: text.textContent, px: parseFloat(getComputedStyle(text).fontSize) * Math.hypot(matrix.a, matrix.b) };
        }),
        paintedGeometry: [...node.querySelectorAll('line,path,polygon,ellipse')].filter(n =>
          getComputedStyle(n).display !== 'none' && (getComputedStyle(n).stroke !== 'none' || getComputedStyle(n).fill !== 'none')).length,
        outOfCanvas: [...node.querySelectorAll('line,path,polygon,ellipse,text')]
          .filter(n => !n.closest('defs') && getComputedStyle(n).display !== 'none')
          .flatMap(n => {
            const b = n.getBBox();
            if (!b.width && !b.height) return [];
            const root = node.getBoundingClientRect();
            const r = n.getBoundingClientRect();
            const epsilon = 1;
            return r.left < root.left - epsilon || r.top < root.top - epsilon ||
              r.right > root.right + epsilon || r.bottom > root.bottom + epsilon ?
              [{ id: n.id, box: { x: b.x, y: b.y, width: b.width, height: b.height } }] : [];
          }),
      }));
      assert.equal(geometry.width, width);
      assert.equal(geometry.background, 'rgb(255, 255, 255)');
      assert(geometry.labels.every(label => label.px >= spec.display.minTextPx));
      assert(geometry.paintedGeometry > 20);
      assert.equal(geometry.outOfCanvas.length, 0);
      previews.push({ width, geometry });
    }
    const previewFile = path.join(out, `${base}.preview.png`);
    const reusedPreview = fs.existsSync(previewFile);
    if (!reusedPreview) await page.screenshot({ path: previewFile, type: 'png', animations: 'disabled' });
    const cropBoxes = previews.map((item, i) => ({
      width: item.width, height: Math.round(item.geometry.height), left: i === 0 ? 15 : 465, top: 15,
    }));
    const pixelCall = spawnSync(`${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, [
      '-c', `import json,sys
from PIL import Image
image=Image.open(sys.argv[1]).convert("RGBA")
rows=[]
for b in json.loads(sys.argv[2]):
    crop=image.crop((b["left"],b["top"],b["left"]+b["width"],b["top"]+b["height"]))
    pixels=list(crop.getdata())
    rows.append({"width":b["width"],"darkPixels":sum(min(p[:3])<150 for p in pixels),"opaquePixels":sum(p[3]==255 for p in pixels),"area":len(pixels)})
print(json.dumps(rows))`,
      previewFile, JSON.stringify(cropBoxes),
    ], { encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
    assert.equal(pixelCall.status, 0, pixelCall.stderr);
    const pixels = JSON.parse(pixelCall.stdout);
    for (const row of pixels) {
      const { darkPixels: dark, opaquePixels: opaque, area } = row;
      assert(dark > 500, `blank diagram at ${row.width}`);
      assert.equal(opaque, area);
    }
    assert.deepEqual(requests, []);
    for (const row of before) assert.equal(bind(row.path).sha256, row.sha256);
    const result = {
      schema: 'd282/unchanged-svg-preview@1', candidate, status: 'pass',
      inputs: before, nativeRenderStatus: render.status, preview: bind(previewFile),
      previews, pixels, requests, headless: true, whiteBackground: true,
      existingSvgRasterOnly: true, geometryRerenders: 0, svgChanged: false,
      specChanged: false, renderChanged: false, imageOpens: 0, paidCalls: 0,
      reusedPreview, screenshotsCreatedThisCall: reusedPreview ? 0 : 1,
      pixelCheck: 'Existing ld-s10y-lesson Pillow runtime; no added dependency.',
      helperBasis: '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/preview-d118-n19-existing-svg.mjs and recover-d261-n44-preview.mjs',
      scope: 'Isolated SVG surface only, not product or full-lesson acceptance.',
    };
    fs.writeFileSync(reportFile, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
    console.log(JSON.stringify({ report: bind(reportFile), preview: result.preview, widths: previews.map(p => ({ width: p.width, labels: p.geometry.labels })), pixels }));
  } finally { await context.close(); }
} finally { await browser.close(); }
