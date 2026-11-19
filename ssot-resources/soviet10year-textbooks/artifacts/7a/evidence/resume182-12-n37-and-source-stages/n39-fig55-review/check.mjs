import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
assert.equal(process.cwd(), root);
const base = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-12';
const owned = `${base}/n39-fig55-review`;
const candidate = `${base}/n39-fig55-render`;
const author = `${base}/n39-fig55-author`;
const lessonDir = `${base}/n38-n39-modern-work/adapt/7a/modern-us-neutral/lessons/alg7-c4-s2-n39`;
const source = 'ssot-resources/soviet10year-textbooks/artifacts/7a/figures/fig-55.png';
const load = name => JSON.parse(fs.readFileSync(name, 'utf8'));
const hash = name => crypto.createHash('sha256').update(fs.readFileSync(name)).digest('hex');
const write = (name, value) => {
  assert.ok(path.resolve(name).startsWith(`${root}/${owned}/`));
  fs.writeFileSync(name, `${JSON.stringify(value, null, 2)}\n`);
};
const protectedPaths = [
  source, `${candidate}/spec.json`, `${candidate}/fig-55.svg`, `${candidate}/fig-55.render.json`,
  `${candidate}/spec-FIRST.json`, `${candidate}/fig-55-FIRST.svg`, `${candidate}/fig-55.render-FIRST.json`,
  `${candidate}/text-binding-FIRST.json`, `${author}/spec-draft.json`,
  `${author}/source-inventory.json`, `${author}/notes.md`, `${author}/compile_and_check.py`,
  `${author}/draft-check.json`, `${lessonDir}/lesson.template.json`, `${lessonDir}/exercises.template.json`,
  ...fs.readdirSync(`${base}/stages`).filter(name => name.startsWith('n39-fig55-render-FIRST.'))
    .map(name => `${base}/stages/${name}`),
];
const before = protectedPaths.map(name => ({ path: name, sha256: hash(name) }));
write(`${owned}/input-hashes.json`, before);
const checks = [];
function check(id, condition, detail) {
  checks.push({ id, status: condition ? 'pass' : 'fail', detail });
}
const spec = load(`${candidate}/spec.json`);
const first = load(`${candidate}/spec-FIRST.json`);
const draft = load(`${author}/spec-draft.json`);
const render = load(`${candidate}/fig-55.render.json`);
const firstRender = load(`${candidate}/fig-55.render-FIRST.json`);
const inventory = load(`${author}/source-inventory.json`);
const draftCheck = load(`${author}/draft-check.json`);
const lesson = load(`${lessonDir}/lesson.template.json`);
const exercises = load(`${lessonDir}/exercises.template.json`);
const svgText = fs.readFileSync(`${candidate}/fig-55.svg`, 'utf8');
const measureOnly = process.argv.includes('--measure-only');
const objects = Object.fromEntries(spec.objects.map(o => [o.id, o]));
const curve = objects['source-curve'];
check('source-hash', hash(source) === '0923bc94f6867f6e07c0551fbf5fd92d40daa6823096675d1bb99de78cf8546f'
  && hash(source) === spec.source.image.sha256 && hash(source) === inventory.source.sha256,
  { path: source, sha256: hash(source) });
check('frozen-exercise-and-full-current-lesson-read', hash(`${lessonDir}/exercises.template.json`) === 'e50a97986c1e4f115049e9ae5003c4ff5b658f3fb25ad8a83a4e3aa48c14d907'
  && lesson.prose.length === 28 && exercises.exercises.length === 14,
  { lessonProseBlocksRead: lesson.prose.length, exercisesRead: exercises.exercises.length,
    currentLessonTemplateSha256: hash(`${lessonDir}/lesson.template.json`),
    earlierCap1LessonTemplateSha256: curve.geometryProvenance.frozenLessonTemplateSha256,
    note: 'Current full lesson was read independently. Earlier cap1 lesson digest is not current; no current lesson prose references fig55. Figure-specific exercise hash/text is current.' });
const relevant = exercises.exercises.filter(e => e.figure_refs.includes('fig-55')
  || e.figures.some(f => f.id === 'fig-55') || /图\s*55/.test(e.text));
check('full-current-edition-text', relevant.length === 1 && relevant[0].number === '819'
  && relevant[0].text === spec.source.authoritativeText[0].text
  && lesson.prose.every(p => !/图\s*55|fig-55/.test(p.text)),
  { onlyReference: relevant.map(e => e.number), text: relevant[0].text,
    finalizedLessonPresent: fs.existsSync(`${lessonDir}/lesson.json`),
    binding: 'Frozen edition template is authoritative for this gate; finalization remains parent-owned.' });
check('render-current-bindings', render.status === 'pass' && render.collisions.length === 0
  && render.spec.sha256 === hash(`${candidate}/spec.json`)
  && render.output.svg.sha256 === hash(`${candidate}/fig-55.svg`), render);
check('first-failure-retained', firstRender.status === 'fail' && firstRender.collisions.length === 1
  && firstRender.collisions[0].id === 'source-origin-label-label'
  && firstRender.spec.sha256 === hash(`${candidate}/spec-FIRST.json`)
  && firstRender.output.svg.sha256 === hash(`${candidate}/fig-55-FIRST.svg`)
  && load(`${base}/stages/n39-fig55-render-FIRST.receipt.json`).exit === 2,
  { firstSpec: hash(`${candidate}/spec-FIRST.json`), firstSvg: hash(`${candidate}/fig-55-FIRST.svg`),
    firstRender: hash(`${candidate}/fig-55.render-FIRST.json`), collision: firstRender.collisions });
const normalizedFirst = structuredClone(first);
assert.deepEqual(normalizedFirst.objects.find(o => o.id === 'source-origin-label').at, [-0.2, -0.62]);
normalizedFirst.objects.find(o => o.id === 'source-origin-label').at = [-0.45, -0.62];
check('one-targeted-repair-only', JSON.stringify(normalizedFirst) === JSON.stringify(spec),
  { object: 'source-origin-label', from: [-0.2, -0.62], to: [-0.45, -0.62], geometryChanges: 0 });
const normalizedDraft = structuredClone(draft);
normalizedDraft.source.image.path = first.source.image.path;
normalizedDraft.source.inventory.find(g => g.id === 'text').description = first.source.inventory.find(g => g.id === 'text').description;
check('cap1-geometry-preserved', JSON.stringify(normalizedDraft) === JSON.stringify(first)
  && curve.d === draft.objects.find(o => o.id === 'source-curve').d
  && draftCheck.specSha256 === hash(`${author}/spec-draft.json`)
  && draftCheck.inventorySha256 === hash(`${author}/source-inventory.json`),
  { allowedClarifications: ['source.image.path (same PNG bytes)', 'source.inventory[text].description'],
    curveGeometryUnchanged: true, authorReportCurrent: true });
const validation = spawnSync('python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  `${candidate}/spec.json`, '--stage', 'rendered', '--json'],
  { cwd: root, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
write(`${owned}/spec-validation.json`, JSON.parse(validation.stdout));
check('canonical-rendered-validation', validation.status === 0, JSON.parse(validation.stdout));
const counts = {};
for (const o of spec.objects) counts[o.type] = (counts[o.type] || 0) + 1;
const xvalues = [-6, -5, -4, -3, -2, -1, 2, 3, 4, 5, 6, 7, 8];
check('source-structure-and-label-allowlist', counts.grid === 1 && counts.axis === 2 && counts.arrow === 2
  && counts.text === 3 && counts.point === 4 && counts.svgPath === 1
  && spec.objects.filter(o => o.type === 'point').every(o => o.visible === false && !o.label)
  && JSON.stringify(objects['source-x-axis'].ticks.map(t => [t.at, t.label]))
    === JSON.stringify(xvalues.map(x => [[x, 0], String(x)]))
  && JSON.stringify(objects['source-y-axis'].ticks.map(t => [t.at, t.label])) === JSON.stringify([[[0, 2], '2'], [[0, 3], '3']])
  && spec.objects.filter(o => o.type === 'text').map(o => o.text).sort().join(',') === '0,x,y'
  && curve.dash === 0 && !curve.fill,
  { counts, xLabels: xvalues, origin: '0', yLabels: [2, 3], axisNames: ['x', 'y'],
    yLabel1: 'Absent in independently opened original/crop and absent in candidate.' });

// Read the actual path commands; these checks do not rely on hidden witness assertions.
function parseCubic(d) {
  const tokens = d.match(/[MC]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/gi);
  assert.equal(tokens[0], 'M');
  let cursor = [Number(tokens[1]), Number(tokens[2])];
  const segments = [];
  for (let i = 3; i < tokens.length; i += 7) {
    assert.equal(tokens[i], 'C');
    const n = tokens.slice(i + 1, i + 7).map(Number);
    assert.equal(n.length, 6);
    const s = [cursor, n.slice(0, 2), n.slice(2, 4), n.slice(4, 6)];
    segments.push(s);
    cursor = s[3];
  }
  return segments;
}
const raw = parseCubic(curve.d);
const [xmin, ymax] = spec.canvas.boundingBox;
const segments = raw.map(s => s.map(([x, y]) => [x + xmin, ymax - y]));
const bezier = (values, t) => (1 - t) ** 3 * values[0] + 3 * (1 - t) ** 2 * t * values[1]
  + 3 * (1 - t) * t ** 2 * values[2] + t ** 3 * values[3];
function derivativeRange(values) {
  const a = -values[0] + 3 * values[1] - 3 * values[2] + values[3];
  const b = 3 * values[0] - 6 * values[1] + 3 * values[2];
  const c = -3 * values[0] + 3 * values[1];
  const locations = [0, 1];
  const vertex = -b / (3 * a);
  if (Number.isFinite(vertex) && vertex > 0 && vertex < 1) locations.push(vertex);
  const evaluated = locations.map(t => 3 * a * t * t + 2 * b * t + c);
  return { min: Math.min(...evaluated), max: Math.max(...evaluated), locations };
}
const segmentChecks = segments.map((s, i) => {
  const xs = s.map(p => p[0]), ys = s.map(p => p[1]);
  const dx = derivativeRange(xs), dy = derivativeRange(ys);
  const direction = Math.sign(ys[3] - ys[0]);
  return { segment: i, increasingX: dx.min > 0, direction,
    derivativeY: dy, monotoneY: direction > 0 ? dy.min >= -1e-7 : dy.max <= 1e-7 };
});
const turns = segmentChecks.slice(1).flatMap((s, i) => s.direction === segmentChecks[i].direction ? [] : [segments[i + 1][0]]);
const crossings = [];
for (const s of segments) {
  const ys = s.map(p => p[1]);
  if (ys[0] * ys[3] >= 0) continue;
  let lo = 0, hi = 1;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if ((bezier(ys, mid) > 0) === (ys[0] > 0)) lo = mid; else hi = mid;
  }
  crossings.push(bezier(s.map(p => p[0]), (lo + hi) / 2));
}
check('actual-path-finite-domain-control-hulls', segments[0][0][0] === -6 && segments.at(-1)[3][0] === 8
  && segments.every(s => s.every(([x, y]) => x >= -6 && x <= 8 && y >= -1.5 && y <= 3))
  && segmentChecks.every(s => s.increasingX), { domain: [-6, 8], range: [-1.5, 3], segments: segments.length });
check('actual-path-endpoints-extrema-no-extra-turns', turns.length === 2
  && turns.every((p,i) => p.every((v,j) => Math.abs(v - [[-2,2],[2,-1]][i][j]) < 1e-8))
  && segmentChecks.every(s => s.monotoneY)
  && segments[0][0][1] >= -1.6 && segments[0][0][1] <= -1.4
  && segments.at(-1)[3][1] >= 2.9 && segments.at(-1)[3][1] <= 3.1,
  { endpoints: [segments[0][0], segments.at(-1)[3]], interiorExtremaRepresentatives: turns,
    method: 'Every actual cubic: analytic derivative extrema plus positive x derivative. Only two sign changes.' });
const independentRanges = [[-4.15, -3.85], [0.45, 0.75], [2.85, 3.15]];
check('actual-path-source-bound-crossings', crossings.length === 3
  && crossings.every((x, i) => x >= independentRanges[i][0] && x <= independentRanges[i][1]),
  { approximateInterpolationCrossings: crossings, independentSourceReadingRanges: independentRanges,
    notExactFunctionOrAnswers: true, middleIsNotForcedToHalfUnit: Math.abs(crossings[1] - 0.5) > 0.05 });
check('witnesses-bound-to-actual-path', spec.objects.filter(o => o.type === 'point').every(o =>
  segments.some(s => s.some(p => Math.abs(p[0] - o.at[0]) < 1e-8 && Math.abs(p[1] - o.at[1]) < 1e-8))),
  { hiddenPoints: 4, visibleSourcePoints: 0 });
write(`${owned}/path-checks.json`, { status: 'pass', checks: segmentChecks, turns, crossings,
  interpretation: 'Interpolation diagnostics only; no exact source function or answer set is asserted.' });

fs.mkdirSync(`${owned}/browser-tmp`, { recursive: true });
process.env.TMPDIR = `${root}/${owned}/browser-tmp`;
const require = createRequire(`${root}/app/package.json`);
const { chromium } = require('playwright');
const browser = await chromium.launchPersistentContext(`${root}/${owned}/browser-profile`, {
  headless: true, viewport: { width: 1000, height: 400 }, deviceScaleFactor: 1,
  offline: true, serviceWorkers: 'block',
  args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'],
});
const blockedRequests = [], browserErrors = [], browserResults = [];
try {
  await browser.route('**/*', async route => { blockedRequests.push(route.request().url()); await route.abort(); });
  const page = browser.pages()[0] || await browser.newPage();
  page.on('pageerror', error => browserErrors.push(String(error)));
  for (const width of [960, 640]) {
    await page.setViewportSize({ width: width + 40, height: Math.round(width * 360 / 960) + 40 });
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
      html,body{margin:0;padding:0;background:#fff;}#media{width:${width}px;margin:20px;}
      #media>svg{width:100%;height:auto;}
    </style></head><body><main id="media">${svgText}</main></body></html>`);
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.evaluate(() => {
      const svg = document.querySelector('#media>svg');
      const frame = svg.getBoundingClientRect();
      const rectangle = r => ({ x: r.x, y: r.y, width: r.width, height: r.height });
      const visible = e => !e.closest('defs') && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden';
      const texts = [...svg.querySelectorAll('text')].filter(visible).map(t => {
        const m = t.getScreenCTM();
        return { id: t.getAttribute('data-label-id'), text: t.textContent,
          fontScreenPx: parseFloat(getComputedStyle(t).fontSize) * Math.hypot(m.a, m.b),
          bounds: rectangle(t.getBoundingClientRect()), fill: getComputedStyle(t).fill };
      });
      const collidingTexts = [];
      for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
        const a = texts[i].bounds, b = texts[j].bounds;
        if (a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y)
          collidingTexts.push([texts[i].id, texts[j].id]);
      }
      const v = [...svg.querySelectorAll('line[id*="source-grid-v-"]')];
      const h = [...svg.querySelectorAll('line[id*="source-grid-h-"]')];
      const curve = [...svg.querySelectorAll('path')].find(e => e.getAttribute('d')?.startsWith('M 1.6 6.1'));
      const m = curve.getCTM();
      const length = curve.getTotalLength();
      const transform = p => ({ x: m.a * p.x + m.c * p.y + m.e, y: m.b * p.x + m.d * p.y + m.f });
      const box = curve.getBBox();
      const axes = [...svg.querySelectorAll('line[id$="ld-source-x-axis"],line[id$="ld-source-y-axis"]')];
      const painted = [...svg.querySelectorAll('line,path,text')].filter(visible);
      const clipped = painted.filter(e => {
        const r = e.getBoundingClientRect();
        return r.width + r.height > 0 && (r.x < frame.x - 0.1 || r.y < frame.y - 0.1
          || r.right > frame.right + 0.1 || r.bottom > frame.bottom + 0.1);
      }).map(e => e.id || e.getAttribute('data-label-id'));
      const style = getComputedStyle(curve);
      const cv = curve.getScreenCTM();
      const origin = texts.find(t => t.text === '0').bounds;
      const yAxisX = frame.x + 380 * frame.width / 960;
      return { width: frame.width, height: frame.height, texts, collidingTexts, clipped,
        gridVerticalLines: v.length, gridHorizontalLines: h.length,
        verticalLocations: v.map(e => Number(e.getAttribute('x1'))),
        horizontalLocations: h.map(e => Number(e.getAttribute('y1'))),
        curve: { d: curve.getAttribute('d'), matrix: { a:m.a,b:m.b,c:m.c,d:m.d,e:m.e,f:m.f },
          endpointsCanvas: [transform(curve.getPointAtLength(0)), transform(curve.getPointAtLength(length))],
          bboxRaw: rectangle(box), stroke: style.stroke, fill: style.fill, dash: style.strokeDasharray,
          rawStroke: Number(curve.getAttribute('stroke-width')), vectorEffect: style.vectorEffect,
          transformScale: Math.hypot(cv.a,cv.b) },
        originRightClearanceFromYAxisPx: yAxisX - origin.x - origin.width,
        axisElementIds: axes.map(e => e.id),
        arrowMarkers: [...svg.querySelectorAll('g[data-arrowhead-for]')].filter(visible).map(e => {
          const matrix=e.getCTM(),child=e.querySelector('path'),box=child.getBoundingClientRect();
          return { for:e.getAttribute('data-arrowhead-for'),bounds:rectangle(box),
            direction:{x:matrix.a,y:matrix.b},fill:getComputedStyle(child).fill };
        }),
        axisArrowStyles: [...svg.querySelectorAll('line[id$="ld-source-x-arrow"],line[id$="ld-source-y-arrow"]')]
          .map(e => ({id:e.id,markerStart:getComputedStyle(e).markerStart,markerEnd:getComputedStyle(e).markerEnd})),
        markerDefinitions: [...svg.querySelectorAll('marker')].map(e => e.id),
        visibleCircles: [...svg.querySelectorAll('circle,ellipse')].filter(visible).map(e => e.id),
        gridColor: getComputedStyle(v[0]).stroke, inkColor: texts[0].fill,
        paperColor: getComputedStyle(svg).backgroundColor };
    });
    check(`browser-${width}-actual-sizing-and-text`, Math.abs(geometry.width - width) < 0.01
      && geometry.texts.length === 18 && geometry.texts.every(t => t.fontScreenPx >= 16),
      { mediaWidth: geometry.width, mediaHeight: geometry.height,
        minTextScreenPx: Math.min(...geometry.texts.map(t => t.fontScreenPx)), labelCount: geometry.texts.length });
    check(`browser-${width}-grid-frame`, geometry.gridVerticalLines === 37 && geometry.gridHorizontalLines === 13
      && geometry.verticalLocations.every((x,i) => Math.abs(x - (30 + i * 25)) < 1e-6)
      && geometry.horizontalLocations.every((y,i) => Math.abs(y - (330 - i * 25)) < 1e-6)
      && geometry.curve.d === curve.d && Math.abs(geometry.curve.matrix.a - 50 * width / 960)<1e-8
      && Math.abs(geometry.curve.matrix.d - 50 * width / 960)<1e-8,
      { columns: 36, rows: 12, commonCanvasScale:50, actualMatrix:geometry.curve.matrix,
        halfUnitPitchAtWidth: 25 * width / 960 });
    check(`browser-${width}-no-clipping-collision-extra-markers`, geometry.clipped.length === 0
      && geometry.collidingTexts.length === 0 && geometry.visibleCircles.length === 0
      && geometry.arrowMarkers.length === 2 && geometry.originRightClearanceFromYAxisPx > 6
      && geometry.arrowMarkers[0].for.endsWith('source-x-arrow') && geometry.arrowMarkers[0].direction.x>0
      && Math.abs(geometry.arrowMarkers[0].direction.y)<1e-8
      && geometry.arrowMarkers[1].for.endsWith('source-y-arrow') && geometry.arrowMarkers[1].direction.y<0
      && Math.abs(geometry.arrowMarkers[1].direction.x)<1e-8
      && geometry.curve.fill === 'none' && geometry.curve.dash === 'none',
      { clipped: geometry.clipped, collidingTexts: geometry.collidingTexts,
        visibleCircles: geometry.visibleCircles, axisArrows: geometry.arrowMarkers,
        axisArrowStyles: geometry.axisArrowStyles, markerDefinitions: geometry.markerDefinitions,
        originRightClearancePx: geometry.originRightClearanceFromYAxisPx });
    if (!measureOnly) await page.locator('#media>svg').screenshot({ path: `${root}/${owned}/fig-55-${width}.png`, animations: 'disabled' });
    browserResults.push(geometry);
  }
  const themeResults = [];
  for (const [name, ink, grid, paper] of [
    ['neutral-default', '#15201f', '#e3eae9', '#ffffff'],
    ['accent-override', '#15201f', '#b7c6c3', '#ffffff'],
    ['print-override', '#000000', '#b5b5b5', '#ffffff'],
  ]) {
    themeResults.push(await page.evaluate(([name,ink,grid,paper]) => {
      const svg = document.querySelector('#media>svg');
      svg.style.setProperty('--ld-figure-ink',ink);
      svg.style.setProperty('--ld-figure-grid',grid);
      svg.style.setProperty('--ld-figure-paper',paper);
      const c = [...svg.querySelectorAll('path')].find(p => p.getAttribute('d')?.startsWith('M 1.6 6.1'));
      const g = svg.querySelector('line[id*="source-grid-v-"]');
      return { name, ink: getComputedStyle(svg.querySelector('text')).fill,
        curve: getComputedStyle(c).stroke, grid: getComputedStyle(g).stroke,
        paper: getComputedStyle(svg).backgroundColor };
    }, [name,ink,grid,paper]));
  }
  check('semantic-theme-recoloring', themeResults[2].curve === 'rgb(0, 0, 0)'
    && themeResults[2].ink === 'rgb(0, 0, 0)' && themeResults[2].grid === 'rgb(181, 181, 181)',
    { themes: themeResults, note: 'DOM color overrides only, not product-theme acceptance.' });
  await page.evaluate(() => {
    const svg = document.querySelector('#media>svg');
    svg.style.removeProperty('--ld-figure-ink');svg.style.removeProperty('--ld-figure-grid');svg.style.removeProperty('--ld-figure-paper');
    document.querySelector('#media').style.cssText = 'width:640px;margin:0;';
    const scroll = document.createElement('div');scroll.id='scroll';scroll.style.cssText='width:390px;overflow-x:auto;';
    document.body.append(scroll);scroll.append(document.querySelector('#media'));
    scroll.scrollLeft = scroll.scrollWidth;
  });
  const scroll = await page.evaluate(() => {
    const s=document.querySelector('#scroll'),svg=document.querySelector('svg');
    return { clientWidth:s.clientWidth,scrollWidth:s.scrollWidth,scrollLeft:s.scrollLeft,
      mediaWidth:svg.getBoundingClientRect().width, endReached:s.scrollLeft+s.clientWidth===s.scrollWidth };
  });
  check('isolated-scroll-end-reachable', scroll.endReached && scroll.mediaWidth === 640 && scroll.clientWidth === 390,
    { ...scroll, scope:'Isolated SVG scroll host only, not app route/interaction approval.' });
  check('browser-offline-no-errors', blockedRequests.length === 0 && browserErrors.length === 0,
    { blockedRequests, browserErrors, headless: true, contentSource:'setContent of unchanged local SVG; no server/model/app.' });
  write(`${owned}/browser-checks.json`, { status:checks.some(c => c.status==='fail')?'fail':'pass', browserVersion:browser.browser()?.version(),
    packageResolved:require.resolve('playwright'), headless:true, offline:true,
    widths:browserResults, themes:themeResults, scroll, blockedRequests, browserErrors,
    screenshots:[960,640].map(width => ({ path:`${owned}/fig-55-${width}.png`,sha256:hash(`${owned}/fig-55-${width}.png`) })) });
} finally {
  await browser.close();
}
check('read-only-input-preservation', before.every(record => hash(record.path) === record.sha256),
  { protectedFiles:before.length, changed:before.filter(record => hash(record.path)!==record.sha256) });
const status=checks.some(c => c.status==='fail')?'fail':'pass';
write(`${owned}/executed-checks.json`, { status, checks, count:checks.length,
  imageCaptures:2, expectedVisualOpens:4,
  scope:'Independent fig55-only source/geometry and local browser evidence. Not whole lesson, answers, choices, app, promotion, publication or closure approval.' });
console.log(JSON.stringify({status,checks:checks.length,failed:checks.filter(c=>c.status==='fail'),crossings,turns,owned},null,2));
process.exitCode=status==='pass'?0:2;
