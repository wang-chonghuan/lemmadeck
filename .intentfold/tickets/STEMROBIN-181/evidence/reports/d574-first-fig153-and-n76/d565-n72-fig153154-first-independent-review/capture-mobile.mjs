import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const owned = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(owned, '../../../../..');
const author = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d546-n72-fig153154-first-modern-author');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (name, value) => fs.writeFileSync(path.join(owned, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const reportPath = path.join(author, 'report.json');
const freezePath = path.join(author, 'author-freeze.json');
const expectedReport = '2443bd6c87983970a19baa6e4f0334918128801525404a2d5eb71c405f41c238';
const expectedFreeze = '1cb7824bf550b4d01c0a13ecd29464d8689a3808e5e001b4a404b57ac0fcdf68';
if (hash(fs.readFileSync(reportPath)) !== expectedReport || hash(fs.readFileSync(freezePath)) !== expectedFreeze) {
  throw new Error('Author envelope changed');
}
const report = json(reportPath);
const freeze = json(freezePath);
const binding = json(report.binding.path);
const refs = new Map();
const visit = value => {
  if (!value || typeof value !== 'object') return;
  if (value.path && value.sha256) refs.set(path.resolve(root, value.path), value.sha256);
  for (const child of Object.values(value)) visit(child);
};
visit(report);
visit(binding);
refs.set(reportPath, expectedReport);
refs.set(freezePath, expectedFreeze);
for (const figure of report.figures) {
  visit(json(figure.routingEvidence.path));
  const suffix = `${figure.figure}/candidate.${figure.figure === 'fig-153' ? 'repair' : 'first'}.640.png`;
  const raster = freeze.files.find(file => file.path.endsWith(suffix));
  if (!raster) throw new Error('Unbound native raster: ' + suffix);
  refs.set(raster.path, raster.sha256);
}
const files = [...refs].map(([file, expected]) => {
  const bytes = fs.readFileSync(file);
  const actual = hash(bytes);
  return { path: file, expectedSha256: expected, sha256: actual, bytes: bytes.length, mode: (fs.statSync(file).mode & 0o777).toString(8), matches: expected === actual };
});
if (files.some(file => !file.matches)) throw new Error('Current binding mismatch');
const fullText = ['en', 'zh'].map(language => {
  const file = path.resolve(root, binding[language === 'en' ? 'fullEN' : 'fullZH'].path);
  const lesson = json(file);
  const text = lesson.prose.map(item => item.text || '').filter(Boolean).join('\n\n');
  return {
    language,
    path: file,
    sha256: hash(fs.readFileSync(file)),
    paragraphs: lesson.prose.length,
    nonemptyTextObjects: lesson.prose.filter(item => item.text).length,
    textSha256: hash(text),
    figures: report.figures.map(figure => ({
      figure: figure.figure,
      completeTextEqualsSpec: json(figure.spec.path).source.authoritativeText[language === 'en' ? 0 : 1].text === text
    }))
  };
});
write('binding-evidence.json', {
  schema: 'd565/current-bound-byte-comparison@1',
  timestampUtc: new Date().toISOString(),
  sourceInventoryFrozenBeforeAuthorExposure: {
    path: path.join(owned, 'source-inventory.json'),
    sha256: '37ac9eec6ad626af5268b7acd5388437db3aa2b1a90337d5a738f927da7560e5',
    mode: (fs.statSync(path.join(owned, 'source-inventory.json')).mode & 0o777).toString(8),
    frozenAtUtc: '2026-11-18T11:31:47.156Z'
  },
  files,
  fullText,
  standaloneValidatorInvocations: 0,
  nativeRerenders: 0,
  sciZhenReReview: false
});

const cssPath = path.join(root, 'app/src/styles/app.css');
const css = `:root {
  --sr-ink: #15201F; --sr-ink-soft: #4C5A58; --sr-ink-dim: #8A9795;
  --sr-line: #E3EAE9; --sr-white: #FFFFFF;
}
html,body { margin:0; padding:0; width:342px; background:var(--sr-white); }
.sr-figure-media {
  --ld-figure-ink:var(--sr-ink); --ld-figure-muted:var(--sr-ink-soft);
  --ld-figure-accent:var(--sr-ink); --ld-figure-accent-soft:var(--sr-ink-dim);
  --ld-figure-grid:var(--sr-line); --ld-figure-paper:var(--sr-white);
  display:block; width:342px; height:342px; margin:0; padding:0;
}
.sr-figure-media > svg { width:342px; height:342px; max-width:100%; }`;
const runtime = path.join(owned, 'runtime');
fs.mkdirSync(runtime);
process.env.TMPDIR = runtime;
const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
const evidence = {
  schema: 'd565/first-independent-isolated-chromium-capture@1',
  timestampUtc: new Date().toISOString(),
  playwrightResolvedPath: require.resolve('playwright'),
  playwrightResolutionBasis: path.join(root, 'app/package.json'),
  cssProvenance: { path: cssPath, sha256: hash(fs.readFileSync(cssPath)), tokenLines: '77-97', figureRoleLines: '704-710' },
  css,
  cssSha256: hash(css),
  viewport: { width: 342, height: 342 },
  deviceScaleFactor: 1,
  theme: 'app-neutral',
  originalSvgUnmodified: true,
  screenshotCount: 0,
  noExternalNetwork: true,
  fullcardOrHeadedAppEvidence: false,
  allBrowsersClosed: false,
  captures: []
};
let browser;
let context;
try {
  browser = await chromium.launch({ headless: true });
  evidence.browserVersion = browser.version();
  context = await browser.newContext({ viewport: evidence.viewport, deviceScaleFactor: 1, serviceWorkers: 'block' });
  await context.route('**/*', route => route.abort());
  for (const figure of report.figures) {
    const svgBytes = fs.readFileSync(figure.svg.path);
    if (hash(svgBytes) !== figure.svg.sha256) throw new Error('SVG changed before capture');
    const png = path.join(owned, `${figure.figure}.independent.chromium.342.png`);
    if (fs.existsSync(png)) throw new Error('First screenshot already exists; replay forbidden');
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="sr-figure-media">${svgBytes.toString('utf8')}</div></body></html>`);
    await page.evaluate(() => document.fonts.ready);
    const observation = await page.locator('svg').evaluate(svg => {
      const matrix = svg.getScreenCTM();
      const rect = svg.getBoundingClientRect();
      const labels = [...svg.querySelectorAll('text')].map(text => {
        const style = getComputedStyle(text);
        const bounds = text.getBoundingClientRect();
        return {
          text: text.textContent,
          id: text.id,
          computedFontPx: parseFloat(style.fontSize),
          screenFontPx: parseFloat(style.fontSize) * Math.hypot(matrix.a, matrix.b),
          fill: style.fill,
          bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height },
          withinSvg: bounds.x >= rect.x && bounds.y >= rect.y && bounds.right <= rect.right && bounds.bottom <= rect.bottom
        };
      });
      const strokes = [...svg.querySelectorAll('line,path,polygon,polyline,circle,rect')].filter(element => !element.closest('defs')).map(element => ({
        id: element.id,
        tag: element.tagName,
        stroke: getComputedStyle(element).stroke,
        fill: getComputedStyle(element).fill
      }));
      return {
        actualSvgCssSize: { width: rect.width, height: rect.height },
        screenTransform: { a: matrix.a, b: matrix.b, c: matrix.c, d: matrix.d, e: matrix.e, f: matrix.f },
        roleValues: Object.fromEntries(['ink', 'muted', 'accent', 'accent-soft', 'grid', 'paper'].map(role => [role, getComputedStyle(svg).getPropertyValue('--ld-figure-' + role).trim()])),
        minScreenTextPx: Math.min(...labels.map(label => label.screenFontPx)),
        labels,
        strokes
      };
    });
    await page.locator('svg').screenshot({ path: png, animations: 'disabled' });
    evidence.screenshotCount += 1;
    evidence.captures.push({
      figure: figure.figure,
      svg: figure.svg,
      svgHashAfterCapture: hash(fs.readFileSync(figure.svg.path)),
      png: { path: png, sha256: hash(fs.readFileSync(png)), bytes: fs.statSync(png).size },
      observation,
      pageErrors: errors,
      screenshotOrdinalForFigure: 1,
      screenshotInspectedInContext: false
    });
    await page.close();
  }
} finally {
  if (context) await context.close();
  if (browser) await browser.close();
  evidence.allBrowsersClosed = true;
  write('mobile-capture-evidence.json', evidence);
}
console.log(JSON.stringify({
  screenshotCount: evidence.screenshotCount,
  allBrowsersClosed: evidence.allBrowsersClosed,
  captures: evidence.captures.map(capture => ({
    figure: capture.figure,
    png: capture.png,
    actualCssSize: capture.observation.actualSvgCssSize,
    minScreenTextPx: capture.observation.minScreenTextPx,
    clippedLabels: capture.observation.labels.filter(label => !label.withinSvg),
    pageErrors: capture.pageErrors
  }))
}, null, 2));
