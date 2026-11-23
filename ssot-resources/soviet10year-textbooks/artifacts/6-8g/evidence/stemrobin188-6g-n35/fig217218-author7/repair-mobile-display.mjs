import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const cwd = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
const own = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n35-fig217218-author7');
if (process.cwd() !== cwd) throw new Error('Wrong cwd');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const file = path.join(own, 'display-check.json');
const prior = JSON.parse(fs.readFileSync(file, 'utf8'));
if (prior.status !== 'fail' || prior.views.length !== 1 || prior.views[0].status !== 'pass') {
  throw new Error('Not the affected mobile-only display repair');
}
const preserved = path.join(own, 'first-failure', 'display-check.json');
if (fs.existsSync(preserved)) throw new Error('Original display failure already preserved');
fs.copyFileSync(file, preserved);
const { chromium } = await import(path.join(cwd, '.agents/skills/node_modules/playwright-core/index.mjs'));
const executablePath = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
  .find(p => fs.existsSync(p));
const browser = await chromium.launch({ executablePath, headless: false });
const report = {
  ...prior, status: 'mobile-repair-in-progress', browserClosed: false,
  failureHistory: [{ path: preserved, sha256: hash(preserved),
    actualFailure: prior.error, firstMobileMetricsNotSaved: true,
    diagnosedCause: 'Mobile horizontal scrollbar increased stacked page height; a vertical scrollbar reduced layout width in the short viewport.',
    changedSurface: 'Only mobile viewport height: 930 to 1100; figure specs/SVGs unchanged.',
    desktopPassReused: true }],
};
delete report.error;
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 1100 }, deviceScaleFactor: 1 });
  await page.route('**/*', route => route.abort());
  const sections = ['fig-217', 'fig-218'].map(id =>
    `<section data-figure="${id}"><h2>${id === 'fig-217' ? 'Theorem 43' : 'Exercise 450'}</h2>
    <div class="media-scroll">${fs.readFileSync(path.join(own, `${id}.svg`), 'utf8')}</div></section>`).join('');
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
    :root{--ld-figure-ink:#202124;--ld-figure-muted:#646970;--ld-figure-accent:#202124;
    --ld-figure-accent-soft:#f0f1f2;--ld-figure-grid:#a8adb2;--ld-figure-paper:#ffffff;}
    *{box-sizing:border-box}html,body{margin:0;background:#fff;color:#202124}
    body{padding:18px 16px;font-family:Arial,Helvetica,sans-serif}
    section{margin:0 0 18px}h2{font-size:16px;font-weight:500;margin:0 0 6px}
    .media-scroll{width:100%;overflow-x:auto;overflow-y:hidden}
    .media-scroll svg{display:block;width:640px;max-width:none;height:auto}
    </style></head><body>${sections}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  const metrics = await page.evaluate(() => [...document.querySelectorAll('section')].map(section => {
    const container = section.querySelector('.media-scroll'), svg = section.querySelector('svg');
    const rect = svg.getBoundingClientRect();
    const labels = [...svg.querySelectorAll('[data-label-id]')].map(label => {
      const matrix = label.getScreenCTM(), bbox = label.getBBox();
      const corners = [[bbox.x, bbox.y], [bbox.x + bbox.width, bbox.y],
        [bbox.x, bbox.y + bbox.height], [bbox.x + bbox.width, bbox.y + bbox.height]]
        .map(([x, y]) => new DOMPoint(x, y).matrixTransform(matrix));
      return { id: label.dataset.labelId, text: label.textContent,
        renderedFontPx: Number.parseFloat(getComputedStyle(label).fontSize) * Math.hypot(matrix.c, matrix.d),
        fitsMedia: corners.every(p => p.x >= rect.left - .1 && p.x <= rect.right + .1 &&
          p.y >= rect.top - .1 && p.y <= rect.bottom + .1) };
    });
    const maximum = container.scrollWidth - container.clientWidth;
    container.scrollLeft = maximum;
    const actualScrollEnd = container.scrollLeft;
    const reached = Math.abs(actualScrollEnd - maximum) < 1;
    container.scrollLeft = 0;
    return { figure: section.dataset.figure, containerWidth: container.clientWidth,
      mediaWidth: rect.width, mediaHeight: rect.height,
      minFontPx: Math.min(...labels.map(l => l.renderedFontPx)), labels,
      geometryCount: svg.querySelectorAll('path,line,circle,polygon,polyline').length,
      scrollMaximum: maximum, actualScrollEnd, scrollEndReachable: reached };
  }));
  const screenshot = path.join(own, 'mobile.png');
  await page.screenshot({ path: screenshot, fullPage: true });
  const view = { name: 'mobile', viewport: { width: 390, height: 1100 }, metrics,
    screenshot: { path: screenshot, sha256: hash(screenshot) },
    status: metrics.every(m => m.containerWidth === 358 && m.mediaWidth === 640 &&
      m.minFontPx >= 16 && m.labels.every(l => l.fitsMedia) && m.geometryCount > 0 &&
      m.scrollEndReachable) ? 'pass' : 'fail' };
  report.views.push(view);
  report.counters.screenshotFiles++;
  report.status = view.status === 'pass' ? 'pass-author-offline-display-only' : 'fail';
  report.mobileRepairScript = { path: path.join(own, 'repair-mobile-display.mjs'),
    sha256: hash(path.join(own, 'repair-mobile-display.mjs')) };
} catch (error) {
  report.status = 'fail';
  report.error = error.message;
  throw error;
} finally {
  await browser.close();
  report.browserClosed = true;
  fs.writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`);
}
console.log(JSON.stringify({ status: report.status,
  mobile: report.views.at(-1).metrics.map(m => ({
    figure: m.figure, containerWidth: m.containerWidth, mediaWidth: m.mediaWidth,
    minFontPx: m.minFontPx, scrollMaximum: m.scrollMaximum, reached: m.scrollEndReachable })),
  browserClosed: report.browserClosed }, null, 2));
