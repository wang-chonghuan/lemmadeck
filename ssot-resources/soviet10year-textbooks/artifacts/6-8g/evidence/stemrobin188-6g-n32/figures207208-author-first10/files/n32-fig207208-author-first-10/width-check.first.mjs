import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.agents/skills/node_modules/playwright-core/index.mjs';

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const owned = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n32-fig207208-author-first-10');
const id = Number(process.argv[2]);
if (![207, 208].includes(id)) throw new Error('Wrong figure scope');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const load = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const files = Object.fromEntries(['FIRST.json', 'spec.json', 'render.json', 'svg', 'native.png']
  .map(suffix => [suffix, path.join(owned, `fig-${id}.${id === 208 && suffix !== 'FIRST.json' ? 'r1.' : ''}${suffix}`)]));
const spec = load(files['spec.json']);
const report = load(files['render.json']);
if (report.status !== 'pass' || report.spec.sha256 !== hash(files['spec.json']) ||
    report.output.svg.sha256 !== hash(files.svg)) throw new Error('Render binding failed');
if ((fs.statSync(files['FIRST.json']).mode & 0o777) !== 0o444) throw new Error('FIRST was unfrozen');
const first = load(files['FIRST.json']);
if (hash(path.join(root, first.source.path)) !== first.source.sha256) throw new Error('Source binding failed');
const svg = fs.readFileSync(files.svg, 'utf8');
if (/<(?:script|image|foreignObject)\b/.test(svg)) throw new Error('Unexpected SVG payload');
// This expectation is transcribed from FIRST's pixel observations, independently of author.mjs.
const pixelSectorMap = {
  upper: { '6': [-1, -1], '1': [-1, 1], '5': [1, -1], '2': [1, 1] },
  lower: { '4': [-1, -1], '8': [-1, 1], '3': [1, -1], '7': [1, 1] },
};
const executablePath = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
  .find(p => fs.existsSync(p));
if (!executablePath) throw new Error('Existing local Chromium unavailable');
const browser = await chromium.launch({ executablePath, headless: true });
const result = {
  schema: 'same188-6/machine-width-check@1', figure: `fig-${id}`,
  status: 'fail', authority: 'AUTHOR_ONLY', notProductDisplayApproval: true,
  mode: 'existing SVG display checks; no JSXGraph full render',
  inputBindings: Object.entries(files).map(([role, p]) => ({ role, path: p, sha256: hash(p) })),
  sourcePixelSectorMap: id === 208 ? pixelSectorMap : null,
  widths: [], previews: [],
};
try {
  const page = await browser.newPage();
  await page.route('**/*', route => route.abort());
  for (const width of [300, 358, 640]) {
    const height = Math.ceil(spec.canvas.height * width / 640);
    await page.setViewportSize({ width, height });
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>
      :root { --ld-figure-ink:#15201f; --ld-figure-muted:#4c5a58; --ld-figure-accent:#15201f;
        --ld-figure-accent-soft:#8a9795; --ld-figure-grid:#e3eae9; --ld-figure-paper:#fff; }
      html,body { margin:0; padding:0; background:white; overflow:hidden; }
      svg { display:block; width:${width}px; height:auto; }
    </style>${svg}`);
    await page.evaluate(() => document.fonts.ready);
    const check = await page.evaluate(({ width, id, pixelSectorMap }) => {
      const svg = document.querySelector('svg');
      const box = svg.getBoundingClientRect();
      const failure = [];
      const must = (condition, message) => { if (!condition) failure.push(message); };
      const labelNodes = [...svg.querySelectorAll('text[data-label-id]')];
      const texts = labelNodes.map(n => n.textContent);
      const expected = id === 207 ? ['A', 'O', 'A\u2081', 'a', 'b'] : ['1','2','3','4','5','6','7','8','a','b','c'];
      must(JSON.stringify([...texts].sort()) === JSON.stringify([...expected].sort()), 'Unexpected/missing visible labels');
      const labels = labelNodes.map(n => {
        const b = n.getBBox(), m = n.getScreenCTM();
        const corners = [[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]]
          .map(([x,y]) => ({ x: m.a*x+m.c*y+m.e, y: m.b*x+m.d*y+m.f }));
        const px = Number(n.getAttribute('font-size')) * Math.hypot(m.a, m.b);
        must(px >= 16, `Text too small: ${n.textContent}`);
        must(corners.every(p => p.x >= box.left && p.y >= box.top && p.x <= box.right && p.y <= box.bottom), `Label clipped: ${n.textContent}`);
        return { id: n.getAttribute('data-label-id'), text: n.textContent, px, corners };
      });
      const named = name => [...svg.querySelectorAll('[id]')].find(n => n.id.endsWith(`ld-${name}`));
      const line = name => {
        const n = named(name);
        must(n?.tagName.toLowerCase() === 'line', `Rendered segment missing: ${name}`);
        if (!n) throw new Error(`Missing line ${name}`);
        const m = n.getScreenCTM();
        const convert = (x, y) => [m.a*x+m.c*y+m.e, m.b*x+m.d*y+m.f];
        return [convert(Number(n.getAttribute('x1')),Number(n.getAttribute('y1'))),
          convert(Number(n.getAttribute('x2')),Number(n.getAttribute('y2')))];
      };
      const cross = (v,w) => v[0]*w[1]-v[1]*w[0];
      const subtract = (a,b) => [a[0]-b[0],a[1]-b[1]];
      const intersect = (a,c) => {
        const v=subtract(a[1],a[0]), w=subtract(c[1],c[0]);
        const t=cross(subtract(c[0],a[0]),w)/cross(v,w);
        return [a[0][0]+t*v[0],a[0][1]+t*v[1]];
      };
      const sectors = [];
      if (id === 208) {
        const c = line('208-line-c');
        const cDirection = subtract(c[1],c[0]);
        for (const [level, letter] of [['upper','a'],['lower','b']]) {
          const a = line(`208-line-${letter}`), center=intersect(a,c), v=subtract(a[1],a[0]);
          for (const [digit, expectedSigns] of Object.entries(pixelSectorMap[level])) {
            const label = labels.find(n => n.id === `208-angle-${digit}-label`);
            const margin = Math.min(...label.corners.flatMap(p => {
              const q=[p.x-center[0],p.y-center[1]];
              return [cross(v,q)*expectedSigns[0]/Math.hypot(...v), cross(cDirection,q)*expectedSigns[1]/Math.hypot(...cDirection)];
            }));
            must(margin > 0, `Wrong visible label sector: ${digit} (${level})`);
            sectors.push({ digit, level, expectedSigns, entireGlyphBoxWithinWedge: margin > 0, minRayClearancePx: margin });
          }
        }
        const arcIds = [];
        for (const level of ['upper','lower']) {
          for (const sector of ['ne','nw','sw','se']) {
            for (const ring of (['nw','se'].includes(sector) ? ['inner','outer'] : ['outer'])) {
              const name=`208-${level}-${sector}-${ring}`, node=named(name);
              must(!!node && node.getBBox().width>0 && node.getBBox().height>0, `Arc absent: ${name}`);
              must(node && ['', 'none'].includes(node.getAttribute('stroke-dasharray') || ''), `Unexpected dashed arc: ${name}`);
              arcIds.push(name);
            }
          }
        }
        must(arcIds.length===12,'Incorrect arc mark count');
        must([...svg.querySelectorAll('circle,ellipse')].filter(n => !n.closest('defs')).length===0,'Added crossing marker');
      } else {
        const connector=line('207-connector');
        const lower=line('207-line-b');
        must(connector[1][1]<lower[0][1], 'Source connector gap missing');
        must([...svg.querySelectorAll('circle,ellipse')].filter(n => !n.closest('defs')).length===3,'Missing/added source point marker');
        for(const name of ['207-tick-upper','207-tick-lower']) line(name);
      }
      for (const node of svg.querySelectorAll('line,path,circle,ellipse')) {
        if (node.closest('defs')) continue;
        const b=node.getBoundingClientRect();
        must(b.left>=box.left-0.01 && b.top>=box.top-0.01 && b.right<=box.right+0.01 && b.bottom<=box.bottom+0.01, `Finite object clipped: ${node.id}`);
      }
      return {
        width, actualMediaWidthPx: box.width, actualMediaHeightPx: box.height,
        measuredMinTextPx: Math.min(...labels.map(n=>n.px)), labels, sectors,
        finiteGeometryAndLabelsFit: failure.length===0,
        errors: failure, status: failure.length ? 'fail' : 'pass',
      };
    }, { width, id, pixelSectorMap });
    result.widths.push(check);
    if (width === 300) {
      const p = path.join(owned, `fig-${id}.mobile-300.png`);
      if (fs.existsSync(p)) throw new Error('Preserve original mobile preview');
      const bytes = await page.screenshot({ path: p, animations: 'disabled' });
      result.previews.push({ path: p, sha256: hash(p), cssWidth: 300, pixels: { width, height }, pngBytes: bytes.length });
    }
  }
  result.status = result.widths.every(c => c.status === 'pass') ? 'pass' : 'fail';
} finally {
  await browser.close();
  const p = path.join(owned, `fig-${id}.width-check.json`);
  if (fs.existsSync(p)) throw new Error('Preserve original width-check');
  fs.writeFileSync(p, `${JSON.stringify(result, null, 2)}\n`);
}
console.log(JSON.stringify({ figure: result.figure, status: result.status, widths: result.widths.map(w => ({ width: w.width, minTextPx: w.measuredMinTextPx, errors: w.errors })) }, null, 2));
process.exitCode = result.status === 'pass' ? 0 : 2;
