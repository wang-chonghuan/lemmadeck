import fs from 'node:fs';
import { createRequire } from 'node:module';
const root = '/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck';
if (process.cwd() !== root) throw new Error('Explicit cwd required');
delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = 'never';
const { chromium } = createRequire(`${root}/app/package.json`)('playwright-core');
const previous = JSON.parse(fs.readFileSync('.tmp/stemrobin-184-resume/table-figure-review/diagnostic.json', 'utf8'));
const result = { schema: 'independent-table-glyph-check@1', headless: true, screenshotCount: 0, closedInFinally: false, observations: [], networkRequests: [] };
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 800, height: 700 }, deviceScaleFactor: 1, serviceWorkers: 'block' });
  await context.route('**/*', (route) => { result.networkRequests.push(route.request().url()); return route.abort(); });
  const page = await context.newPage();
  for (const id of ['tbl-p0028-01', 'tbl-p0031-01']) for (const width of [640, 331]) {
    const svg = fs.readFileSync(`.tmp/stemrobin-184-resume/tables/${id}/figure.svg`, 'utf8');
    await page.setContent(`<!doctype html><style>${previous.correctFixtureCss}</style><div class="sr-figure-media" style="width:${width}px">${svg}</div>`);
    const observation = await page.evaluate(() => {
      const svg = document.querySelector('svg'), ctx = document.createElement('canvas').getContext('2d');
      const texts = [...svg.querySelectorAll('text')];
      const visible = (e) => { const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden'; };
      const lines = [...svg.querySelectorAll('line')].filter(visible).map((e) => {
        const matrix = e.getScreenCTM();
        const a = new DOMPoint(+e.getAttribute('x1'), +e.getAttribute('y1')).matrixTransform(matrix);
        const b = new DOMPoint(+e.getAttribute('x2'), +e.getAttribute('y2')).matrixTransform(matrix);
        return { id: e.id, a, b, halfStroke: parseFloat(getComputedStyle(e).strokeWidth) * Math.hypot(matrix.a, matrix.b) / 2 };
      });
      const pointSegment = (p, a, b) => {
        const dx = b.x - a.x, dy = b.y - a.y;
        const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
        return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy);
      };
      const segmentRectDistance = (a, b, r) => {
        let lo = 0, hi = 1;
        for (const [key, min, max] of [['x', r.left, r.right], ['y', r.top, r.bottom]]) {
          const d = b[key] - a[key];
          if (Math.abs(d) < 1e-9) { if (a[key] < min || a[key] > max) { lo = 2; break; } }
          else { const u = (min - a[key]) / d, v = (max - a[key]) / d; lo = Math.max(lo, Math.min(u, v)); hi = Math.min(hi, Math.max(u, v)); }
        }
        if (lo <= hi) return 0;
        const corners = [{ x: r.left, y: r.top }, { x: r.right, y: r.top }, { x: r.right, y: r.bottom }, { x: r.left, y: r.bottom }];
        const pointRect = (p) => Math.hypot(Math.max(r.left - p.x, 0, p.x - r.right), Math.max(r.top - p.y, 0, p.y - r.bottom));
        return Math.min(...corners.map((p) => pointSegment(p, a, b)), pointRect(a), pointRect(b));
      };
      const glyphs = texts.map((e) => {
        const s = getComputedStyle(e), matrix = e.getScreenCTM(), scale = Math.hypot(matrix.a, matrix.b), bbox = e.getBBox();
        const reference = e.cloneNode(true);
        reference.removeAttribute('data-label-id');
        reference.setAttribute('x', '0'); reference.setAttribute('y', '0');
        reference.setAttribute('dominant-baseline', 'alphabetic'); reference.setAttribute('text-anchor', 'start');
        svg.appendChild(reference);
        const alphabeticBox = reference.getBBox();
        reference.remove();
        const baseline = new DOMPoint(bbox.x, bbox.y - alphabeticBox.y).matrixTransform(matrix);
        ctx.font = `${s.fontWeight} ${parseFloat(s.fontSize) * scale}px Arial`;
        ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
        const m = ctx.measureText(e.textContent);
        const ink = { left: baseline.x - m.actualBoundingBoxLeft, right: baseline.x + m.actualBoundingBoxRight, top: baseline.y - m.actualBoundingBoxAscent, bottom: baseline.y + m.actualBoundingBoxDescent };
        const closest = lines.map((l) => ({ line: l.id, clearancePx: segmentRectDistance(l.a, l.b, ink) - l.halfStroke })).sort((a, b) => a.clearancePx - b.clearancePx)[0];
        return { id: e.dataset.labelId, text: e.textContent, ink, canvasWidthDifferencePx: m.width - e.getBoundingClientRect().width, closest };
      });
      return { glyphs, minRuleClearancePx: Math.min(...glyphs.map((g) => g.closest.clearancePx)), potentialInkRuleCollisions: glyphs.filter((g) => g.closest.clearancePx < -0.05), method: 'SVG alphabetic reference isolates baseline shift from dominant-baseline=middle; Canvas TextMetrics at actual projected font measures ink, not the full font box. Distances include half the projected rule stroke. Conservative ink rectangles can over-report collisions.' };
    });
    result.observations.push({ id, width, ...observation });
  }
} finally {
  if (browser) { await browser.close(); result.closedInFinally = true; }
  fs.writeFileSync('.tmp/stemrobin-184-resume/table-figure-review/glyph-check.json', JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify(result.observations.map((o) => ({ id: o.id, width: o.width, minRuleClearancePx: o.minRuleClearancePx, potentialInkRuleCollisions: o.potentialInkRuleCollisions, corner: o.glyphs.filter((g) => g.id.startsWith('corner')) })), null, 2));
}
