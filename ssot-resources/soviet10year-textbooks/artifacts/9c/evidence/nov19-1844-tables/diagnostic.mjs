import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const root = '/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck';
if (process.cwd() !== root) throw new Error('Explicit cwd required');
delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = 'never';
const requireApp = createRequire(path.join(root, 'app/package.json'));
const { chromium } = requireApp('playwright-core');
const css = fs.readFileSync('app/src/styles/app.css', 'utf8');
const before = fs.readFileSync('.tmp/stemrobin-184-resume/table-figure-review/checks.json', 'utf8');
const previous = JSON.parse(before);
const block = (selector, startAt = 0) => {
  const start = css.indexOf(`${selector} {`, startAt);
  if (start < 0) throw new Error(selector);
  return css.slice(start, css.indexOf('}', start) + 1);
};
const fixtureCss = [
  block(':root', css.indexOf('LemmaDeck design tokens')),
  block('.sr-figure-media'), block('.sr-figure-media[data-figure-theme="accent"]'),
  'html,body{margin:0;background:white}.sr-figure-media{max-width:none;margin:0}.sr-figure-media svg{display:block;width:100%;height:auto}',
  `@media print{${block('.sr-print-lesson .sr-figure-media')}}`,
].join('\n');
const diagnostic = {
  schema: 'independent-table-figure-diagnostic@1',
  reason: 'Initial fixture used the first :root block, which lacks --sr-* tokens. Corrected fixture uses the actual LemmaDeck token block. No validator or renderer rerun, no screenshots, no visual image opens.',
  correctFixtureCss: fixtureCss, initialChecksSha256: crypto.createHash('sha256').update(before).digest('hex'),
  results: [], networkRequests: [], headless: true, closedInFinally: false,
};
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 800, height: 700 }, deviceScaleFactor: 1, serviceWorkers: 'block' });
  await context.route('**/*', (route) => { diagnostic.networkRequests.push(route.request().url()); return route.abort(); });
  const page = await context.newPage();
  for (const f of previous.figures) for (const w of f.widths) {
    const svg = fs.readFileSync(`.tmp/stemrobin-184-resume/tables/${f.id}/figure.svg`, 'utf8');
    await page.setContent(`<!doctype html><html><head><style>${fixtureCss}</style></head><body><div class="sr-print-lesson"><div class="sr-figure-media" style="width:${w.width}px">${svg}</div></div></body></html>`);
    for (const theme of ['neutral', 'accent', 'print']) {
      await page.locator('.sr-figure-media').evaluate((el, t) => el.dataset.figureTheme = t === 'neutral' ? 'neutral' : 'accent', theme);
      await page.emulateMedia({ media: theme === 'print' ? 'print' : 'screen' });
      const r = await page.evaluate(() => {
        const host = document.querySelector('.sr-figure-media');
        const styles = getComputedStyle(host);
        const texts = [...document.querySelectorAll('svg text')];
        const visible = (e) => { const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden'; };
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const corner = texts.filter((e) => e.dataset.labelId.startsWith('corner')).map((e) => {
          const s = getComputedStyle(e), box = e.getBBox();
          ctx.font = `${s.fontWeight} ${s.fontSize} Arial`;
          ctx.textBaseline = 'alphabetic';
          const m = ctx.measureText(e.textContent);
          return { id: e.dataset.labelId, bbox: { x: box.x, y: box.y, width: box.width, height: box.height }, canvasMetrics: Object.fromEntries(['width', 'actualBoundingBoxLeft', 'actualBoundingBoxRight', 'actualBoundingBoxAscent', 'actualBoundingBoxDescent', 'fontBoundingBoxAscent', 'fontBoundingBoxDescent', 'alphabeticBaseline'].map((k) => [k, m[k]])) };
        });
        return {
          roles: Object.fromEntries(['ink', 'muted', 'accent', 'accent-soft', 'grid', 'paper'].map((r) => [r, styles.getPropertyValue(`--ld-figure-${r}`).trim()])),
          textFills: [...new Set(texts.map((e) => getComputedStyle(e).fill))],
          lineStrokes: [...new Set([...document.querySelectorAll('svg line')].filter(visible).map((e) => getComputedStyle(e).stroke))],
          background: getComputedStyle(document.querySelector('svg')).backgroundColor,
          corner,
        };
      });
      diagnostic.results.push({ figure: f.id, width: w.width, theme, ...r });
    }
  }
} finally {
  if (browser) { await browser.close(); diagnostic.closedInFinally = true; }
  diagnostic.inputsUnchanged = Object.entries(previous.inputHashesBefore).every(([p, h]) => crypto.createHash('sha256').update(fs.readFileSync(path.resolve(root, p))).digest('hex') === h);
  fs.writeFileSync('.tmp/stemrobin-184-resume/table-figure-review/diagnostic.json', JSON.stringify(diagnostic, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ roles: diagnostic.results.slice(0, 3), p31: diagnostic.results.filter((r) => r.figure === 'tbl-p0031-01' && r.width === 640 && r.theme === 'neutral'), inputsUnchanged: diagnostic.inputsUnchanged, closedInFinally: diagnostic.closedInFinally }, null, 2));
}
