import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = '/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck';
if (process.cwd() !== ROOT) throw new Error(`Required explicit cwd: ${ROOT}`);
const BASE = path.dirname(fileURLToPath(import.meta.url));
const OUT = process.argv.includes('--replay')
  ? path.join(BASE, `replay-${Date.now()}`) : BASE;
if (!OUT.startsWith(`${ROOT}/.tmp/stemrobin-184-resume/table36-review`))
  throw new Error('Output outside scoped review directory');
fs.mkdirSync(OUT, { recursive: true });
if (fs.existsSync(path.join(OUT, 'checks.json')))
  throw new Error('Preserving existing evidence; use --replay for a new bounded run');
const read = relative => fs.readFileSync(path.join(ROOT, relative), 'utf8');
const json = relative => JSON.parse(read(relative));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fileHash = relative => sha(fs.readFileSync(path.join(ROOT, relative)));
const write = (name, value) => fs.writeFileSync(
  path.join(OUT, name), typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`);
const sourcePath = 'ssot-resources/soviet10year-textbooks/artifacts/9c/figures/tbl-p0036-01.png';
const candidatePath = '.tmp/stemrobin-184-resume/table36';
const inventoryPath = '.tmp/stemrobin-184-resume/table36-review/independent-source-inventory.json';
const retainedPath = 'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-n8/table-inventory.json';
const lessonPath = '.tmp/ld-s10y-lesson/adapt/9c/modern-us-neutral/lessons/ana9-c2-s2-n8/lesson.template.json';
const exercisePath = '.tmp/ld-s10y-lesson/adapt/9c/modern-us-neutral/lessons/ana9-c2-s2-n8/exercises.template.json';
const inputPaths = [sourcePath, inventoryPath, `${candidatePath}/spec.json`,
  `${candidatePath}/figure.svg`, `${candidatePath}/render.json`, retainedPath,
  lessonPath, exercisePath, 'app/src/styles/app.css'];
const hashes = Object.fromEntries(inputPaths.map(p => [p, fileHash(p)]));
const frozen = json(inventoryPath);
const spec = json(`${candidatePath}/spec.json`);
const render = json(`${candidatePath}/render.json`);
const retained = json(retainedPath);
const lesson = json(lessonPath);
const exercises = json(exercisePath);
const svg = read(`${candidatePath}/figure.svg`);
const checks = [];
const check = (id, pass, details) => checks.push({ id, status: pass ? 'pass' : 'fail', details });
const approx = (a, b) => Number.isFinite(a) && Math.abs(a - b) < 1e-7;
const objects = new Map(spec.objects.map(o => [o.id, o]));
const assertions = new Map(spec.assertions.map(a => [a.id, a]));
const expected = frozen.rows.flatMap((row, r) => [
  { id: `index-r${r}`, text: row.index, r, c: -1 },
  ...row.values.map((text, c) => ({ id: `value-r${r}-c${c}`, text, r, c }))
]);
const expectedIds = new Set(expected.map(e => e.id));
check('source-hash', hashes[sourcePath] === frozen.source.sha256
  && spec.source.image.sha256 === frozen.source.sha256
  && spec.source.image.path === sourcePath, hashes[sourcePath]);
check('render-hash-binding', render.spec.sha256 === hashes[`${candidatePath}/spec.json`]
  && render.output.svg.sha256 === hashes[`${candidatePath}/figure.svg`], render);
check('existing-official-render', render.status === 'pass' && render.objects === 79
  && render.labels === 77 && render.collisions.length === 0, {
  rerun: false, status: render.status, objects: render.objects, labels: render.labels,
  assertionCountIndependentlyDerived: spec.assertions.length,
  officialValidator: 'PASS reported by requester; not rerun or independently attributed to a missing log'
});
check('retained-inventory-comparison-after-freeze',
  JSON.stringify(retained.literal_rows.map(r => ({ index: r.index_literal, values: r.data_literals })))
    === JSON.stringify(frozen.rows), { role: 'comparison only, not pixel substitute', sha256: hashes[retainedPath] });
check('edition-authority-context', lesson.id === 'ana9-c2-s2-n8'
  && lesson.edition === 'modern-us-neutral'
  && lesson.prose.some(p => p.kind === 'fig' && p.id === spec.id && p.label === null)
  && lesson.prose.filter(p => p.kind === 'p').every((p, i) => spec.source.authoritativeText[i]?.text === p.text)
  && exercises.lesson === lesson.id
  && exercises.exercises.every(e => e.figure_refs.length === 0), {
  lesson: lessonPath, exercises: exercisePath,
  meaning: '11 rows, adjacent sum placed below second addend, first/last 1',
  exerciseMathApproved: false, wholeLessonApproved: false
});
check('display-contract', spec.display.purpose === 'instructional'
  && spec.display.layout === 'scroll' && spec.display.widths.includes(640)
  && spec.display.minTextPx >= 16, spec.display);
check('unique-objects-assertions', objects.size === spec.objects.length
  && assertions.size === spec.assertions.length, { objects: objects.size, assertions: assertions.size });
check('literal-label-domain', spec.objects.filter(o => o.label !== undefined).length === expected.length
  && spec.objects.every(o => o.label === undefined || expectedIds.has(o.id)), {
  sourceDerivedExpected: expected.length, noObjectCountStandIn: true
});
const frame = objects.get('table-frame');
const divider = objects.get('index-divider');
const frameXs = frame.points.map(p => p[0]), frameYs = frame.points.map(p => p[1]);
const bounds = {
  left: Math.min(...frameXs), right: Math.max(...frameXs),
  bottom: Math.min(...frameYs), top: Math.max(...frameYs)
};
check('one-frame-one-divider-no-grid', frame.type === 'polygon'
  && frame.points.length === 4 && divider.type === 'segment'
  && approx(divider.from[0], divider.to[0])
  && approx(divider.from[1], bounds.top) && approx(divider.to[1], bounds.bottom)
  && spec.objects.filter(o => !expectedIds.has(o.id)).length === 2
  && spec.objects.every(o => expectedIds.has(o.id) || ['table-frame', 'index-divider'].includes(o.id)), {
  frame: frame.id, divider: divider.id, bounds, grid: 0, headings: 0, ticks: 0
});
for (const e of expected) {
  const o = objects.get(e.id);
  check(`source-label:${e.id}`, o?.label === e.text && o?.visible === false,
    { expected: e.text, actual: o?.label, anchorAt: o?.at, hiddenDotNotHiddenLabel: true });
  check(`frame-and-divider-side:${e.id}`, !!o
    && o.at[0] > bounds.left && o.at[0] < bounds.right
    && o.at[1] > bounds.bottom && o.at[1] < bounds.top
    && (e.c < 0 ? o.at[0] < divider.from[0] : o.at[0] > divider.from[0]), o?.at);
}
const assertionResults = [];
for (const a of spec.assertions) {
  let pass = false, details;
  if (a.type === 'inside') {
    const p = objects.get(a.point), container = objects.get(a.container);
    pass = !!p && container?.id === frame.id && p.at[0] > bounds.left
      && p.at[0] < bounds.right && p.at[1] > bounds.bottom && p.at[1] < bounds.top;
    details = { point: a.point, container: a.container, anchor: p?.at };
  } else if (a.type === 'displacement') {
    const from = objects.get(a.from), to = objects.get(a.to);
    const actual = from && to ? [to.at[0] - from.at[0], to.at[1] - from.at[1]] : [];
    pass = approx(actual[0], a.dx) && approx(actual[1], a.dy);
    details = { from: a.from, to: a.to, expected: [a.dx, a.dy], actual };
  } else details = { unsupported: a.type };
  assertionResults.push({ id: a.id, type: a.type, status: pass ? 'pass' : 'fail', details });
}
check('all-153-assertions-evaluated', assertionResults.length === 153
  && assertionResults.every(a => a.status === 'pass'), {
  inside: assertionResults.filter(a => a.type === 'inside').length,
  displacement: assertionResults.filter(a => a.type === 'displacement').length,
  results: assertionResults
});
const coverage = [];
for (const group of spec.source.inventory) {
  const mapped = new Set(group.objects);
  check(`inventory-references:${group.id}`, group.objects.every(id => objects.has(id))
    && group.assertions.every(id => assertions.has(id))
    && expected.every(e => mapped.has(e.id))
    && group.requires.includes('pointRelationships'), { mappedObjects: group.objects.length });
  for (const id of group.objects.filter(id => objects.get(id)?.type === 'point')) {
    const inside = group.assertions.filter(aid => {
      const a = assertions.get(aid);
      return a?.type === 'inside' && a.point === id && mapped.has(a.container);
    });
    const relations = group.assertions.filter(aid => {
      const a = assertions.get(aid);
      return a?.type === 'displacement' && (a.from === id || a.to === id)
        && mapped.has(a.from) && mapped.has(a.to);
    });
    coverage.push({ group: group.id, point: id, inside, relations });
  }
}
check('every-mapped-point-wholly-covered', coverage.length === 77
  && coverage.every(c => c.inside.length && c.relations.length), coverage);
for (const row of frozen.rows) {
  const r = Number(row.index), ix = objects.get(`index-r${r}`);
  const vals = row.values.map((_, c) => objects.get(`value-r${r}-c${c}`));
  const previous = r ? objects.get(`index-r${r - 1}`) : null;
  check(`necessary-source-relationships:row-${r}`, vals.every((o, c) =>
    approx(o.at[1], ix.at[1]) && (c === 0 || o.at[0] > vals[c - 1].at[0]))
    && approx(vals[0].at[0], objects.get('value-r0-c0').at[0])
    && (!previous || (approx(ix.at[0], previous.at[0]) && ix.at[1] < previous.at[1]))
    && vals.slice(1).every((o, c) => {
      const above = objects.get(`value-r${r - 1}-c${c + 1}`);
      return !above || approx(o.at[0], above.at[0]);
    }), { leftAligned: true, growsRight: true, belowSecondAddendColumn: true });
}
const blankSlots = frozen.rows.flatMap((row, r) => Array.from(
  { length: 11 - row.values.length }, (_, i) => ({ r, c: row.values.length + i })));
check('55-unprinted-slots-in-spec', blankSlots.length === 55
  && blankSlots.every(s => !objects.has(`value-r${s.r}-c${s.c}`)), blankSlots);
const description = spec.source.inventory.map(i => i.description).join('\n');
check('source-holds-and-modern-decisions-explicit',
  /regulariz/i.test(description) && /equal row\/column spacing/.test(description)
  && /HOLD/.test(description) && /specks/.test(description)
  && /protrusion/.test(description) && /glyph/.test(description)
  && /rough border/.test(description), { description, retainedHolds: frozen.holds });
const roles = new Set(['ink', 'muted', 'accent', 'accentSoft', 'grid', 'paper']);
check('spec-semantic-colors', spec.objects.every(o =>
  ['fill', 'stroke'].every(k => o[k] === undefined || roles.has(o[k]))), { allowed: [...roles] });
check('no-active-or-external-svg-content',
  !/<(?:script|image|foreignObject|iframe)\b/i.test(svg)
  && !/\bon\w+\s*=|\b(?:href|xlink:href)\s*=/i.test(svg), { localOnly: true });

// Copy only the authoritative token block and figure rules; do not load CSS imports.
const css = read('app/src/styles/app.css');
const tokenStart = css.indexOf(':root {', css.indexOf('Lemmadeck design tokens') === -1
  ? css.indexOf('LemmaDeck design tokens') : css.indexOf('Lemmadeck design tokens'));
const tokenBlock = css.slice(tokenStart, css.indexOf('\n}', tokenStart) + 2);
const figureStart = css.indexOf('.sr-figure-media {');
const figureEnd = css.indexOf('.sr-math-answer {', figureStart);
const figureRules = css.slice(figureStart, figureEnd);
check('actual-app-css-extracted', tokenBlock.includes('--sr-ink:')
  && figureRules.includes('width: 40em;'), {
  source: 'app/src/styles/app.css', sourceSha256: hashes['app/src/styles/app.css'],
  mediaRule: 'scroll figure .sr-figure-media width:40em; at 16px = 640px',
  fixtureNotLiveProduct: true
});
const appRequire = createRequire(path.join(ROOT, 'app/package.json'));
const { chromium } = appRequire('@playwright/test');
const screenshots = [];
const browserRuns = [];
let browser;
let browserClosed = false;
try {
  browser = await chromium.launch({
    headless: true,
    args: ['--disable-background-networking', '--disable-component-update', '--disable-sync', '--no-first-run']
  });
  for (const [name, viewport] of [
    ['desktop', { width: 1440, height: 960 }],
    ['mobile', { width: 390, height: 844 }]
  ]) {
    const context = await browser.newContext({
      viewport, deviceScaleFactor: 1, offline: true, serviceWorkers: 'block'
    });
    const errors = [], requests = [];
    try {
      await context.route('**/*', route => {
        requests.push(route.request().url());
        return route.abort('blockedbyclient');
      });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
      const html = `<!doctype html><html><head><meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <style>${tokenBlock}\n${figureRules}
        *{box-sizing:border-box}html,body{margin:0;background:var(--sr-white);font-size:16px}
        main{width:calc(100% - 32px);max-width:900px;margin:24px auto}
        figure.sr-read-fig{margin:0;font-size:16px}
        </style></head><body><main><figure class="sr-read-fig" data-figure-layout="scroll">
        <div class="sr-figure-media">${svg}</div></figure></main></body></html>`;
      await page.goto(`data:text/html;base64,${Buffer.from(html).toString('base64')}`, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const measured = await page.evaluate(({ expected, blankSlots }) => {
        const root = document.querySelector('svg');
        const figure = document.querySelector('figure');
        const media = document.querySelector('.sr-figure-media');
        const rootBox = root.getBoundingClientRect();
        const rect = b => ({ x: b.x, y: b.y, width: b.width, height: b.height,
          left: b.left, right: b.right, top: b.top, bottom: b.bottom });
        const visible = e => {
          for (let p = e; p && p !== root.parentElement; p = p.parentElement) {
            const s = getComputedStyle(p);
            if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return false;
          }
          return true;
        };
        const labels = [...root.querySelectorAll('text')].filter(visible).map(e => {
          const m = e.getScreenCTM(), b = e.getBoundingClientRect();
          return { id: e.getAttribute('data-label-id'), text: e.textContent,
            x: Number(e.getAttribute('x')), y: Number(e.getAttribute('y')),
            size: parseFloat(getComputedStyle(e).fontSize) * Math.hypot(m.a, m.b),
            fillAttribute: e.getAttribute('fill'), rect: rect(b) };
        });
        const matches = expected.map(e => {
          const actual = labels.find(l => l.id === `${e.id}-label`);
          return { id: e.id, expected: e.text, actual: actual?.text,
            pass: actual?.text === e.text, rect: actual?.rect };
        });
        const collisions = [];
        for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
          const a = labels[i].rect, b = labels[j].rect;
          if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 0.1
            && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 0.1)
            collisions.push([labels[i].id, labels[j].id]);
        }
        const lines = [...root.querySelectorAll('line')].filter(visible).map(e => ({
          id: e.id, x1: Number(e.getAttribute('x1')), y1: Number(e.getAttribute('y1')),
          x2: Number(e.getAttribute('x2')), y2: Number(e.getAttribute('y2')),
          width: Number.parseFloat(e.getAttribute('stroke-width')),
          strokeAttribute: e.getAttribute('stroke'), stroke: getComputedStyle(e).stroke
        }));
        const painted = [...root.querySelectorAll('path,line,polygon,ellipse,circle,rect,text')]
          .filter(e => !e.closest('defs') && visible(e))
          .filter(e => {
            const s = getComputedStyle(e);
            return (s.fill !== 'none' && Number(s.fillOpacity) > 0)
              || (s.stroke !== 'none' && Number(s.strokeOpacity) > 0);
          }).map(e => ({ tag: e.tagName, id: e.id, fill: e.getAttribute('fill'), stroke: e.getAttribute('stroke') }));
        const scale = rootBox.width / 1280;
        const frameBox = { left: rootBox.left + 40 * scale, right: rootBox.left + 1240 * scale,
          top: rootBox.top + 40 * scale, bottom: rootBox.top + 740 * scale };
        const footprintIssues = labels.filter(l => l.rect.left < frameBox.left + 0.5
          || l.rect.right > frameBox.right - 0.5 || l.rect.top < frameBox.top + 0.5
          || l.rect.bottom > frameBox.bottom - 0.5
          || (l.id.startsWith('index-') ? l.rect.right >= rootBox.left + 200 * scale - 0.375
            : l.rect.left <= rootBox.left + 200 * scale + 0.375));
        const blank = blankSlots.map(s => ({
          ...s, x: 280 + 90 * s.c, y: 80 + 60 * s.r,
          noLabel: !labels.some(l => Math.abs(l.x - (280 + 90 * s.c)) < 44
            && Math.abs(l.y - (80 + 60 * s.r)) < 29)
        }));
        return { root: rect(rootBox), media: rect(media.getBoundingClientRect()),
          scroller: { width: figure.clientWidth, scrollWidth: figure.scrollWidth,
            overflowX: getComputedStyle(figure).overflowX },
          labels, matches, collisions, lines, painted, frameBox, footprintIssues, blank,
          forbiddenNodes: root.querySelectorAll('script,image,foreignObject,iframe').length,
          visibleShapes: painted.filter(e => e.tag !== 'text' && e.tag !== 'line'),
          documentOverflow: document.documentElement.scrollWidth > innerWidth };
      }, { expected, blankSlots });
      check(`${name}:640px-media`, approx(measured.media.width, 640)
        && approx(measured.root.width, 640) && approx(measured.root.height, 390), measured.media);
      check(`${name}:all-77-visible-source-labels`, measured.labels.length === 77
        && measured.matches.every(m => m.pass), measured.matches);
      check(`${name}:minText-16`, measured.labels.every(l => l.size >= 16),
        { minimumMeasuredPx: Math.min(...measured.labels.map(l => l.size)) });
      check(`${name}:no-collision-clipping`, measured.collisions.length === 0
        && measured.footprintIssues.length === 0 && !measured.documentOverflow,
        { collisions: measured.collisions, footprintIssues: measured.footprintIssues,
          noDocumentOverflow: !measured.documentOverflow });
      const endpoints = [[1240, 40, 1240, 740], [1240, 740, 40, 740],
        [40, 740, 40, 40], [40, 40, 1240, 40], [200, 40, 200, 740]];
      check(`${name}:one-visible-frame-divider-no-other-marks`, measured.lines.length === 5
        && endpoints.every(p => measured.lines.some(l => [l.x1, l.y1, l.x2, l.y2].every((n, i) => approx(n, p[i]))))
        && measured.visibleShapes.length === 0 && measured.forbiddenNodes === 0,
        { lines: measured.lines, visibleShapes: measured.visibleShapes });
      check(`${name}:55-upper-right-blank`, measured.blank.length === 55
        && measured.blank.every(s => s.noLabel), measured.blank);
      check(`${name}:visible-semantic-colors`, measured.labels.every(l => l.fillAttribute.startsWith('var(--ld-figure-'))
        && measured.lines.every(l => l.strokeAttribute.startsWith('var(--ld-figure-')), {
          hiddenRendererDefaults: 'Hidden #D55E00 helper shapes are not visible paint or semantic ticks.'
        });
      const raster = await page.evaluate(async svgSource => {
        const image = new Image();
        image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgSource)))}`;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = 640; canvas.height = 390;
        const c = canvas.getContext('2d', { willReadFrequently: true });
        c.fillStyle = '#fff'; c.fillRect(0, 0, 640, 390);
        c.drawImage(image, 0, 0, 640, 390);
        const data = c.getImageData(0, 0, 640, 390).data;
        let light = 0, dark = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) light++;
          if (data[i] < 100 && data[i + 1] < 100 && data[i + 2] < 100) dark++;
        }
        const slots = [];
        for (let r = 0; r < 11; r++) for (let col = r + 1; col < 11; col++) {
          let nonwhite = 0;
          const x = (280 + 90 * col) / 2, y = (80 + 60 * r) / 2;
          for (let yy = Math.ceil(y - 11); yy <= Math.floor(y + 11); yy++)
            for (let xx = Math.ceil(x - 18); xx <= Math.floor(x + 18); xx++) {
              const i = (yy * 640 + xx) * 4;
              if (data[i] < 240 || data[i + 1] < 240 || data[i + 2] < 240) nonwhite++;
            }
          slots.push({ r, c: col, nonwhite });
        }
        return { lightFraction: light / (640 * 390), darkFraction: dark / (640 * 390),
          blankSlots: slots, source: 'candidate SVG, native browser canvas at 640x390; no image file generated' };
      }, svg);
      check(`${name}:raster-not-blank-not-black`, raster.darkFraction > 0.002
        && raster.darkFraction < 0.15 && raster.lightFraction > 0.8, raster);
      check(`${name}:all-55-blank-slot-pixels`, raster.blankSlots.length === 55
        && raster.blankSlots.every(s => s.nonwhite === 0), raster.blankSlots);
      const snapshot = async suffix => {
        if (screenshots.length >= 3) throw new Error('Bounded screenshot budget exhausted');
        const filename = `${name}-${suffix}.png`;
        await page.screenshot({ path: path.join(OUT, filename), fullPage: false });
        screenshots.push({ path: path.join(OUT, filename),
          sha256: sha(fs.readFileSync(path.join(OUT, filename))), viewport,
          observationStatus: 'pending-human-single-open', kind: 'fresh-screenshot' });
      };
      await snapshot('start');
      const scrollEnd = await page.evaluate(() => {
        const f = document.querySelector('figure');
        f.scrollLeft = f.scrollWidth - f.clientWidth;
        const end = document.querySelector('[data-label-id="value-r10-c10-label"]').getBoundingClientRect();
        const root = document.querySelector('svg').getBoundingClientRect(), box = f.getBoundingClientRect();
        return { offset: f.scrollLeft, max: f.scrollWidth - f.clientWidth,
          clientWidth: f.clientWidth, scrollWidth: f.scrollWidth,
          endLabelVisible: end.left >= box.left && end.right <= box.right,
          rightBorderVisible: root.left + 620.5 <= box.right && root.left + 619.5 >= box.left };
      });
      check(`${name}:horizontal-end-reachable`, approx(scrollEnd.offset, scrollEnd.max)
        && scrollEnd.endLabelVisible && scrollEnd.rightBorderVisible
        && (name !== 'mobile' || scrollEnd.max > 0), scrollEnd);
      if (name === 'mobile') await snapshot('end');
      const themeChecks = [];
      for (const theme of ['neutral', 'accent', 'print']) {
        const colors = await page.evaluate(theme => {
          const media = document.querySelector('.sr-figure-media');
          media.dataset.figureTheme = theme === 'accent' ? 'accent' : 'neutral';
          if (theme === 'print') {
            media.style.setProperty('--ld-figure-ink', '#000000');
            media.style.setProperty('--ld-figure-paper', '#ffffff');
          } else {
            media.style.removeProperty('--ld-figure-ink');
            media.style.removeProperty('--ld-figure-paper');
          }
          return {
            ink: getComputedStyle(document.querySelector('text')).fill,
            rule: getComputedStyle(document.querySelector('svg line')).stroke,
            paper: getComputedStyle(document.querySelector('svg')).backgroundColor
          };
        }, theme);
        themeChecks.push({ theme, ...colors });
      }
      check(`${name}:neutral-accent-print-variables`, themeChecks.every(t => t.ink === t.rule
        && t.ink !== t.paper) && themeChecks[2].ink === 'rgb(0, 0, 0)', themeChecks);
      check(`${name}:network-blocked-no-errors`, requests.length === 0 && errors.length === 0,
        { requests, errors, offline: true, routeAbortAll: true, serviceWorkers: 'block' });
      browserRuns.push({ name, viewport, measured, raster, scrollEnd, themeChecks, requests, errors });
    } finally {
      await context.close();
    }
  }
} catch (error) {
  check('browser-execution', false, { message: error.message, stack: error.stack });
} finally {
  if (browser) {
    await browser.close();
    browserClosed = true;
  }
}
check('owned-browser-closed', browserClosed, { headless: true, isolatedContexts: true });
check('inputs-unchanged', inputPaths.every(p => fileHash(p) === hashes[p]), hashes);
const failures = checks.filter(c => c.status === 'fail');
const result = {
  schema: 'independent-figure-checks@1', scope: '9c n8 tbl-p0036-01 only',
  status: failures.length ? 'fail' : 'pass', hashes, checks, failures, browserRuns,
  visualInspection: 'Pending reviewer opening the three fresh screenshots exactly once.',
  preservedOperationalFailures: [
    { command: 'rg against nonexistent repo-root src/package.json', exitCode: 2,
      disposition: 'No candidate conclusion; corrected to app paths, no writes.' },
    { command: 'rg included nonexistent render_lesson.mjs', exitCode: 2,
      disposition: 'No official renderer executed; actual app.css used.' }
  ],
  forbiddenActionsPerformed: [],
  limitations: [
    'Offline candidate-only fixture using actual app figure CSS, not a live product session.',
    'No official validator or renderer rerun, no whole-lesson/math/answer approval.',
    'Source ink HOLDs and all unrelated prior failures remain in force.'
  ]
};
write('checks.json', result);
write('images-ledger.json', {
  schema: 'independent-image-ledger@1', maxTotal: 6,
  sourceObservationCount: 1, roiCount: 0, screenshotsCreated: screenshots.length,
  screenshotOpenBudget: 3, totalImageObservationsPlanned: 1 + screenshots.length,
  reopens: 0, enhancement: false, imageBearingHistoryReceived: false,
  parentBudget: 'permanently 24/24; return only text, paths and hashes',
  images: [
    { path: path.join(ROOT, sourcePath), sha256: hashes[sourcePath],
      observationOrdinal: 1, observationStatus: 'opened-once-before-freeze-and-candidate' },
    ...screenshots
  ],
  computedCanvasPixelCheck: 'Numeric data only, no canvas image returned or saved.',
  browserClosed
});
write('review.json', {
  schema: 'ld-s10y-image/review@1', figure: spec.id, scope: 'independent figure review only',
  status: failures.length ? 'fail' : 'hold',
  mathematical: { status: result.status, boundary: 'Figure literal values and layout only; no MathGate2/source64/E59/116 approval' },
  visual: { status: 'hold', reason: 'Fresh screenshot inspection pending' },
  cultural: { status: 'pass', reason: 'Only the source-bound digits and frame/divider are visible; no cultural text or symbols' },
  hashes, holds: frozen.holds, failures,
  producer: 'Parent remains production author; no promotion/candidate edits/canonical writes',
  checks: { path: path.join(OUT, 'checks.json'), sha256: sha(fs.readFileSync(path.join(OUT, 'checks.json'))) },
  screenshots, reviewScript: { path: fileURLToPath(import.meta.url),
    sha256: sha(fs.readFileSync(fileURLToPath(import.meta.url))) }
});
write('review.md', `# Independent Figure Review\n\nFigure: ${spec.id}; 9c n8 only.\n\n`
  + `Automated checks: ${result.status.toUpperCase()}; ${failures.length} failures.\n`
  + 'Final verdict pending one opening of each fresh screenshot. Source ink HOLDs remain.\n'
  + 'No candidate repairs, canonical edits, official rerender, publisher, DB, network, models, Git, workers or chat actions.\n');
console.log(JSON.stringify({
  status: result.status, failureCount: failures.length, failures,
  checks: checks.length, assertionResults: assertionResults.length,
  screenshots: screenshots.map(s => ({ path: s.path, sha256: s.sha256 })),
  hashes, browserClosed, out: OUT
}, null, 2));
if (failures.length) process.exitCode = 1;
