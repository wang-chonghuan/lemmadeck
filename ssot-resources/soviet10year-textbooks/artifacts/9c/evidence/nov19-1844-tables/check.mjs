import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck';
if (process.cwd() !== root) throw new Error('Explicit review cwd required');
delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = 'never';
const requireApp = createRequire(path.join(root, 'app/package.json'));
const { chromium } = requireApp('playwright-core');
const out = path.join(root, '.tmp/stemrobin-184-resume/table-figure-review');
const read = (p) => fs.readFileSync(path.resolve(root, p), 'utf8');
const hash = (p) => crypto.createHash('sha256').update(fs.readFileSync(path.resolve(root, p))).digest('hex');
const save = (name, value) => fs.writeFileSync(path.join(out, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const ids = ['tbl-p0028-01', 'tbl-p0031-01'];
const originalRows = [
  [[1], [1, 1], [1, 2, 2], [1, 3, 6, 6], [1, 4, 12, 24, 24], [1, 5, 20, 60, 120, 120]],
  [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1], [1, 5, 10, 10, 5, 1]],
];
const factorial = (n) => n < 2 ? 1 : n * factorial(n - 1);
const inventoryPath = '.tmp/stemrobin-184-resume/table-source-review/inventory.json';
const inventory = JSON.parse(read(inventoryPath));
const inputPaths = [
  inventoryPath, '.tmp/stemrobin-184-resume/table-source-review/inventory.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  'app/src/styles/app.css', 'app/playwright.config.ts', 'app/package.json',
  '/Users/yong/.agents/skills/ips-chrome-background/SKILL.md',
  ...ids.flatMap((id) => [
    `ssot-resources/soviet10year-textbooks/artifacts/9c/figures/${id}.png`,
    ...['spec.json', 'figure.svg', 'render.json'].map((file) => `.tmp/stemrobin-184-resume/tables/${id}/${file}`),
  ]),
];
const evidence = {
  schema: 'independent-table-figure-checks@1', ticket: 'STEMROBIN-184', part: 'B',
  root, startedAt: new Date().toISOString(), canonicalApproval: false,
  browser: { dependency: requireApp.resolve('playwright-core'), headless: true, isolated: true, closedInFinally: false, networkRequests: [] },
  inputHashesBefore: Object.fromEntries(inputPaths.map((p) => [p, hash(p)])),
  figures: [], screenshots: [], failures: [],
};
const check = (ok, message) => { if (!ok) evidence.failures.push(message); };
const css = read('app/src/styles/app.css');
const cssBlock = (selector) => {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`Missing app CSS block ${selector}`);
  return css.slice(start, css.indexOf('}', start) + 1);
};
const fixtureCss = [
  cssBlock(':root'),
  cssBlock('.sr-figure-media'),
  cssBlock('.sr-figure-media[data-figure-theme="accent"]'),
  'html,body{margin:0;background:white} .sr-figure-media{max-width:none;margin:0} .sr-figure-media svg{display:block;width:100%;height:auto;max-width:100%}',
  `@media print { ${cssBlock('.sr-print-lesson .sr-figure-media')} }`,
].join('\n');
save('fixture-css.json', { source: 'app/src/styles/app.css', sha256: hash('app/src/styles/app.css'), css: fixtureCss, scope: 'Exact specified SVG widths; not a whole product page or publish check.' });
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  evidence.browser.version = browser.version();
  const context = await browser.newContext({ viewport: { width: 800, height: 700 }, deviceScaleFactor: 1, serviceWorkers: 'block' });
  await context.route('**/*', (route) => {
    evidence.browser.networkRequests.push(route.request().url());
    return route.abort();
  });
  const page = await context.newPage();
  for (const [index, id] of ids.entries()) {
    const base = `.tmp/stemrobin-184-resume/tables/${id}`;
    const spec = JSON.parse(read(`${base}/spec.json`));
    const render = JSON.parse(read(`${base}/render.json`));
    const objects = new Map(spec.objects.map((o) => [o.id, o]));
    const labels = spec.objects.filter((o) => o.type === 'point' && o.label);
    const validation = spawnSync('python3', [
      '.agents/skills/ld-s10y-image/scripts/validate_spec.py', `${base}/spec.json`, '--stage', 'rendered', '--json',
    ], { cwd: root, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
    const result = { id, validator: { invocations: 1, exitCode: validation.status, stdout: validation.stdout, stderr: validation.stderr }, existingRender: render, rows: [], assertionCoverage: {}, widths: [] };
    evidence.figures.push(result);
    check(validation.status === 0, `${id}: official spec validation`);
    check(hash(spec.source.image.path) === spec.source.image.sha256, `${id}: source hash`);
    check(hash(`${base}/spec.json`) === render.spec.sha256 && hash(`${base}/figure.svg`) === render.output.svg.sha256, `${id}: render hash bindings`);
    check(render.status === 'pass' && render.collisions.length === 0 && [640, 331].every((w) => render.displayChecks.some((d) => d.width === w && d.status === 'pass' && d.measuredMinPx >= 16)), `${id}: existing render/display pass`);
    check(spec.source.inventory[0].description.includes(hash(inventoryPath)), `${id}: frozen inventory hash reference`);
    check(spec.objects.filter((o) => o.type === 'grid').length === 0, `${id}: no finite grid object`);
    check(spec.objects.filter((o) => o.type !== 'point').map((o) => o.id).sort().join(',') === ['table-frame', 'header-rule', 'stub-rule', 'corner-diagonal', ...(index ? ['sums-rule'] : [])].sort().join(','), `${id}: source-only rule objects, no lattice`);
    const group = spec.source.inventory[0];
    const groupObjects = new Set(group.objects);
    const mappedAssertions = spec.assertions.filter((a) => group.assertions.includes(a.id));
    result.assertionCoverage = {
      hiddenLabelledAnchors: labels.length,
      inside: labels.filter((o) => mappedAssertions.some((a) => a.type === 'inside' && a.point === o.id && a.container === 'table-frame')).length,
      pointRelationships: labels.filter((o) => mappedAssertions.some((a) => a.type === 'displacement' && [a.from, a.to].includes(o.id) && groupObjects.has(a.from) && groupObjects.has(a.to))).length,
      displacementAssertions: mappedAssertions.filter((a) => a.type === 'displacement').length,
      allMarkersHidden: labels.every((o) => o.visible === false),
      gridDimensionsApplicable: false,
      rationale: 'Logical text rows/columns in an unruled coefficient field are not a finite grid/lattice. Frame and separators do not create a cell grid. Displacements cover regularized anchor relationships, not exact scanned pixel distances.',
    };
    check(result.assertionCoverage.inside === labels.length && result.assertionCoverage.pointRelationships === labels.length && result.assertionCoverage.allMarkersHidden, `${id}: complete hidden-labelled-anchor assertion coverage`);
    for (let n = 0; n <= 5; n++) {
      check(objects.get(`row-n${n}`).label === String(n) && objects.get(`header-m${n}`).label === String(n), `${id}: header/row ${n}`);
      const row = { n, coefficients: [], blanks: [], ...(index ? { sum: Number(objects.get(`sum-n${n}`).label) } : {}) };
      for (let m = 0; m <= 5; m++) {
        const o = objects.get(`value-n${n}-m${m}`);
        if (m > n) { row.blanks.push(m); check(!o, `${id}: invalid position n=${n},m=${m} must be blank`); continue; }
        const arrangement = factorial(n) / factorial(n - m);
        const combination = arrangement / factorial(m);
        const actual = Number(o?.label);
        row.coefficients.push({ m, actual, arrangement, combination, source: originalRows[index][n][m] });
        check(actual === originalRows[index][n][m] && actual === (index ? combination : arrangement), `${id}: coefficient n=${n},m=${m}`);
        check(inventory.tables[index].rows[n].values[m] === String(actual), `${id}: frozen source n=${n},m=${m}`);
      }
      if (index) check(row.sum === 2 ** n && row.sum === row.coefficients.reduce((s, c) => s + c.actual, 0), `${id}: sum n=${n}`);
      result.rows.push(row);
    }
    check(labels.length === (index ? 41 : 35), `${id}: no extra visible text`);
    check(!index || spec.source.modernAdditions.some((s) => s.includes('dash') && s.includes('uncertainty')), `${id}: retained dash provenance`);
    for (const width of [640, 331]) {
      await page.emulateMedia({ media: 'screen' });
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${fixtureCss}</style></head><body><div class="sr-print-lesson"><div class="sr-figure-media" style="width:${width}px">${read(`${base}/figure.svg`)}</div></div></body></html>`);
      await page.evaluate(() => document.fonts.ready);
      const widthResult = { width, themes: [] };
      result.widths.push(widthResult);
      for (const theme of ['neutral', 'accent', 'print']) {
        await page.locator('.sr-figure-media').evaluate((el, t) => el.dataset.figureTheme = t === 'neutral' ? 'neutral' : 'accent', theme);
        await page.emulateMedia({ media: theme === 'print' ? 'print' : 'screen' });
        const metrics = await page.evaluate(({ spec, theme }) => {
          const svg = document.querySelector('svg');
          const visible = (e) => { const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0'; };
          const rect = (e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height }; };
          const texts = [...svg.querySelectorAll('text')].filter(visible).map((e) => {
            const matrix = e.getScreenCTM();
            return { id: e.dataset.labelId, text: e.textContent, rect: rect(e), center: new DOMPoint(+e.getAttribute('x'), +e.getAttribute('y')).matrixTransform(matrix).toJSON(), projectedFontPx: parseFloat(getComputedStyle(e).fontSize) * Math.hypot(matrix.a, matrix.b), fill: getComputedStyle(e).fill, rawFill: e.getAttribute('fill') };
          });
          const frame = rect(svg.querySelector('polygon'));
          const lines = [...svg.querySelectorAll('line')].filter(visible).map((e) => ({ id: e.id, rect: rect(e), stroke: getComputedStyle(e).stroke, rawStroke: e.getAttribute('stroke') }));
          const collisions = texts.flatMap((a, i) => texts.slice(i + 1).filter((b) => a.rect.left < b.rect.right && b.rect.left < a.rect.right && a.rect.top < b.rect.bottom && b.rect.top < a.rect.bottom).map((b) => [a.id, b.id]));
          const boundsFailures = texts.filter((t) => t.rect.left <= frame.left || t.rect.right >= frame.right || t.rect.top <= frame.top || t.rect.bottom >= frame.bottom).map((t) => t.id);
          const matrix = svg.getScreenCTM();
          const bbox = spec.canvas.boundingBox;
          const projectedPositions = spec.objects.filter((o) => o.type === 'point' && o.label).map((o) => {
            const expected = new DOMPoint((o.at[0] - bbox[0]) / (bbox[2] - bbox[0]) * spec.canvas.width, (bbox[1] - o.at[1]) / (bbox[1] - bbox[3]) * spec.canvas.height).matrixTransform(matrix);
            const actual = texts.find((t) => t.id === `${o.id}-label`);
            return { id: o.id, textMatches: actual?.text === o.label, dxPx: actual ? actual.center.x - expected.x : null, dyPx: actual ? actual.center.y - expected.y : null };
          });
          const columnCenters = Array.from({ length: 6 }, (_, m) => texts.find((t) => t.id === `header-m${m}-label`).center.x);
          const rowCenters = Array.from({ length: 6 }, (_, n) => texts.find((t) => t.id === `row-n${n}-label`).center.y);
          const whitespace = texts.filter((t) => t.id.startsWith('value-')).map((t) => {
            const [, n, m] = t.id.match(/value-n(\d)-m(\d)/);
            return { id: t.id, columnOffsetPx: t.center.x - columnCenters[+m], rowOffsetPx: t.center.y - rowCenters[+n] };
          });
          const blankOccupants = [];
          const stepX = columnCenters[1] - columnCenters[0], stepY = rowCenters[1] - rowCenters[0];
          for (let n = 0; n < 6; n++) for (let m = n + 1; m < 6; m++) {
            for (const t of texts) if (Math.abs(t.center.x - columnCenters[m]) < stepX / 2 && Math.abs(t.center.y - rowCenters[n]) < stepY / 2) blankOccupants.push({ n, m, id: t.id });
          }
          const styles = getComputedStyle(document.querySelector('.sr-figure-media'));
          return { theme, svg: rect(svg), frame, texts, lines, collisions, boundsFailures, projectedPositions, whitespace, blankOccupants, columnCenters, rowCenters,
            visibleMarkers: [...svg.querySelectorAll('circle,ellipse')].filter(visible).map((e) => e.id),
            visiblePaths: [...svg.querySelectorAll('path')].filter(visible).map((e) => e.id),
            roles: Object.fromEntries(['ink', 'accent', 'accent-soft', 'paper'].map((r) => [r, styles.getPropertyValue(`--ld-figure-${r}`).trim()])),
          };
        }, { spec, theme });
        widthResult.themes.push(metrics);
        check(Math.abs(metrics.svg.width - width) < 0.01 && Math.abs(metrics.svg.height - width * spec.canvas.height / spec.canvas.width) < 0.05, `${id}/${width}/${theme}: actual full SVG dimensions`);
        check(metrics.texts.length === labels.length && metrics.texts.every((t) => t.projectedFontPx >= 16), `${id}/${width}/${theme}: all labels >=16px`);
        check(metrics.collisions.length === 0 && metrics.boundsFailures.length === 0, `${id}/${width}/${theme}: label collision/clipping`);
        check(metrics.visibleMarkers.length === 0 && metrics.visiblePaths.length === 0 && metrics.lines.length === (index ? 8 : 7), `${id}/${width}/${theme}: no dots/lattice/extra paths`);
        check(metrics.projectedPositions.every((p) => p.textMatches && Math.abs(p.dxPx) < 0.05 && Math.abs(p.dyPx) < 0.05) && metrics.whitespace.every((p) => Math.abs(p.columnOffsetPx) < 0.05 && Math.abs(p.rowOffsetPx) < 0.05) && metrics.blankOccupants.length === 0, `${id}/${width}/${theme}: projected text/alignment/blank positions`);
        check(metrics.texts.every((t) => t.rawFill.startsWith('var(--ld-figure-') && t.fill === 'rgb(21, 32, 31)') && metrics.lines.every((l) => l.rawStroke.startsWith('var(--ld-figure-') && l.stroke === 'rgb(21, 32, 31)'), `${id}/${width}/${theme}: semantic visible paint`);
        check(metrics.roles.accent === (theme === 'accent' ? '#0E7C9B' : '#15201F') && metrics.roles.paper === '#FFFFFF', `${id}/${width}/${theme}: app theme role resolution`);
        check(metrics.lines.every((l) => l.rect.left >= metrics.svg.left && l.rect.right <= metrics.svg.right && l.rect.top >= metrics.svg.top && l.rect.bottom <= metrics.svg.bottom), `${id}/${width}/${theme}: finite geometry inside SVG`);
        if (theme === 'neutral') {
          const file = `${id}-${width}.png`;
          await page.locator('svg').screenshot({ path: path.join(out, file), animations: 'disabled', scale: 'css' });
          evidence.screenshots.push({ figure: id, width, path: path.join(out, file), sha256: hash(path.join(out, file)), wholeSvg: true, deviceScaleFactor: 1 });
        }
      }
    }
  }
  check(evidence.screenshots.length === 4, 'Exactly four screenshots required');
  check(evidence.browser.networkRequests.length === 0, 'No browser network requests permitted');
} catch (error) {
  evidence.failures.push(String(error.stack || error));
} finally {
  if (browser) { await browser.close(); evidence.browser.closedInFinally = true; }
  evidence.inputHashesAfter = Object.fromEntries(inputPaths.map((p) => [p, hash(p)]));
  check(inputPaths.every((p) => evidence.inputHashesAfter[p] === evidence.inputHashesBefore[p]), 'Reviewed input bytes changed during review');
  evidence.finishedAt = new Date().toISOString();
  evidence.status = evidence.failures.length ? 'HOLD_OR_REVISE' : 'MACHINE_CHECKS_PASS_PENDING_VISUAL_REVIEW';
  save('checks.json', evidence);
  console.log(JSON.stringify({ status: evidence.status, failures: evidence.failures, screenshots: evidence.screenshots, closedInFinally: evidence.browser.closedInFinally }, null, 2));
}
