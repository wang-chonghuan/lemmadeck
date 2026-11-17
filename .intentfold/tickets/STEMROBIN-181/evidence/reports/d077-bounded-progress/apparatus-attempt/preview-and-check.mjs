import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const base = path.dirname(fileURLToPath(import.meta.url));
const selected = path.join(base, 'repair1');
const requireApp = createRequire(path.join(root, 'app/package.json'));
const { chromium } = requireApp('playwright');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert.equal(process.cwd(), root);
const dir = path.join(base, 'previews');
fs.mkdirSync(dir);
const specFile = path.join(selected, 'fig-114.spec.json');
const svgFile = path.join(selected, 'fig-114.svg');
const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
const geometry = JSON.parse(fs.readFileSync(path.join(selected, 'geometry.json'), 'utf8'));
const render = JSON.parse(fs.readFileSync(path.join(selected, 'fig-114.render.json'), 'utf8'));
assert.equal(render.status, 'pass');
assert.equal(render.spec.sha256, hash(specFile));
assert.equal(render.output.svg.sha256, hash(svgFile));
assert.deepEqual(render.collisions, []);
assert.equal(spec.display.purpose, 'instructional');
assert.equal(spec.display.layout, 'scroll');
assert.deepEqual(spec.display.widths, [640]);

const objs = new Map(spec.objects.map(o => [o.id, o]));
const coords = id => typeof id === 'string' ? objs.get(id).at : id;
const wires = spec.objects.filter(o => o.provenance?.kind === 'source-wire');
const key = p => coords(p).join(',');
const edgeList = wires.map(o => [key(o.from), key(o.to)]);
const connected = (from, to, removedComponent = null, includeComponents = false) => {
  const edges = [...edgeList];
  if (includeComponents) {
    for (const c of geometry.components) {
      if (c.conductive && c.id !== removedComponent) edges.push(c.terminals.map(key));
    }
  }
  const frontier = [key(from)];
  const seen = new Set(frontier);
  while (frontier.length) {
    const a = frontier.pop();
    if (a === key(to)) return true;
    for (const [x, y] of edges) {
      const next = x === a ? y : y === a ? x : null;
      if (next !== null && !seen.has(next)) { seen.add(next); frontier.push(next); }
    }
  }
  return false;
};
const sameNet = ids => ids.every(id => connected(ids[0], id));
assert.ok(sameNet(['tube-anode', 'tank-coil-top', 'capacitor-top-plate', 'scope-top-terminal']));
assert.ok(sameNet(['tank-coil-bottom', 'capacitor-bottom-plate', 'secondary-top', 'scope-bottom-terminal']));
assert.ok(sameNet(['tube-grid', 'feedback-top']));
assert.ok(sameNet(['tube-cathode', 'feedback-bottom', 'dc-negative']));
assert.ok(sameNet(['dc-positive', 'secondary-bottom']));
assert.ok(sameNet(['audio-input-top', 'audio-primary-top']));
assert.ok(sameNet(['audio-input-bottom', 'audio-primary-bottom']));
assert.ok(connected('dc-positive', 'lc-bottom', null, true));
assert.equal(connected('dc-positive', 'lc-bottom', 'series-secondary', true), false);
for (const id of ['tube-anode', 'tube-grid', 'tube-cathode', 'dc-positive', 'lc-bottom']) {
  assert.equal(connected('audio-input-top', id, null, true), false);
  assert.equal(connected('audio-input-bottom', id, null, true), false);
}
assert.equal(connected('heater-left-terminal', 'dc-negative', null, true), false);
assert.equal(connected('heater-right-terminal', 'dc-negative', null, true), false);

const windingGap = Math.abs(objs.get('tank-winding-lobe-1').center[0] -
  objs.get('feedback-winding-lobe-1').center[0]) - 28;
assert.equal(windingGap, 11);
assert.ok(windingGap - 3 >= 4);
const plateLength = id => {
  const o = objs.get(id), a = coords(o.from), b = coords(o.to);
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
};
for (const index of [1, 2]) {
  assert.ok(plateLength(`cell${index}-long-plate`) > plateLength(`cell${index}-short-plate`));
  assert.ok(coords(objs.get(`cell${index}-long-plate`).from)[0] >
    coords(objs.get(`cell${index}-short-plate`).from)[0]);
}
const trace = spec.objects.filter(o => o.id.startsWith('scope-trace-'));
assert.equal(trace.length, 180);
for (let i = 0; i < trace.length; i++) {
  const a = coords(trace[i].from), b = coords(trace[i].to);
  if (i) assert.deepEqual(a, coords(trace[i - 1].to));
  for (const p of [a, b]) assert.ok(Math.hypot(p[0] - 542, p[1] - 390) < 44);
}
assert.equal(spec.objects.filter(o => o.type === 'axis' || o.type === 'svgPath').length, 0);
const topologyEvidence = {
  authorOnly: true, independentReview: 'pending',
  LCAndScopeShareBothNets: true,
  feedbackBetweenGridAndCathodeReturn: true,
  lowerSecondaryInSeriesWithDC: true,
  removeSecondaryBreaksDCToLCPath: true,
  audioPrimaryIsElectricallyIsolated: true,
  heaterLeadsRemainUnconnected: true,
  twoCellsShortLeftLongRight: true,
  windingCenterlineGapPx: windingGap,
  windingStrokeClearancePx: windingGap - 3,
  oneContinuousTraceInsideScreen: true,
  tracePointsAreModernIllustrativeCoordinatesNotSourceSamples: true,
  sourceNumericValuesClaimed: [],
  originalVoltageSuffix: 'unknown; modern U_audio notation separately declared',
  axisOrOpaquePathAdded: false,
};
fs.writeFileSync(path.join(dir, 'topology-evidence.json'), `${JSON.stringify(topologyEvidence, null, 2)}\n`, { flag: 'wx' });

delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = 'never';
const browser = await chromium.launch({ headless: true });
const pageErrors = [];
const previews = [];
try {
  for (const width of [331, 342, 640]) {
    const page = await browser.newPage({ viewport: { width, height: 560 }, deviceScaleFactor: 1 });
    page.on('pageerror', e => pageErrors.push(e.message));
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
      :root { --ld-figure-ink:#15201f; --ld-figure-muted:#4c5a58;
        --ld-figure-accent:#15201f; --ld-figure-accent-soft:#8a9795;
        --ld-figure-grid:#e3eae9; --ld-figure-paper:#fff; }
      html,body { margin:0; padding:0; width:100%; background:white; }
      #media { width:${width}px; overflow-x:auto; overflow-y:hidden; }
      #media svg { display:block; width:640px; min-width:640px; max-width:none; height:auto; }
    </style></head><body><div id="media">${fs.readFileSync(svgFile, 'utf8')}</div></body></html>`);
    await page.evaluate(() => document.fonts.ready);
    const measurement = await page.evaluate(() => {
      const media = document.getElementById('media');
      const svg = media.querySelector('svg');
      const box = svg.getBoundingClientRect();
      const labels = [...svg.querySelectorAll('text')].map(n => {
        const m = n.getScreenCTM(), r = n.getBoundingClientRect();
        return {
          id: n.getAttribute('data-label-id'), text: n.textContent,
          finalPx: parseFloat(n.getAttribute('font-size')) * Math.hypot(m.a, m.b),
          bbox: { left: r.left, top: r.top, right: r.right, bottom: r.bottom },
          outsideCanvas: r.left < box.left || r.right > box.right || r.top < box.top || r.bottom > box.bottom,
        };
      });
      const overlaps = [];
      for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
        const a = labels[i].bbox, b = labels[j].bbox;
        if (Math.min(a.right, b.right) > Math.max(a.left, b.left) &&
          Math.min(a.bottom, b.bottom) > Math.max(a.top, b.top)) overlaps.push([labels[i].id, labels[j].id]);
      }
      return {
        containerWidth: media.clientWidth, mediaWidth: box.width, mediaHeight: box.height,
        scrollWidth: media.scrollWidth, maxScrollLeft: media.scrollWidth - media.clientWidth,
        minTextPx: Math.min(...labels.map(n => n.finalPx)), labels, overlaps,
        documentOverflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    assert.equal(measurement.containerWidth, width);
    assert.equal(measurement.mediaWidth, 640);
    assert.equal(measurement.mediaHeight, 520);
    assert.equal(measurement.labels.length, 6);
    assert.ok(measurement.minTextPx >= 16);
    assert.ok(measurement.labels.every(l => !l.outsideCanvas));
    assert.deepEqual(measurement.overlaps, []);
    assert.equal(measurement.documentOverflow, false);
    const shots = [];
    const capture = async position => {
      const p = path.join(dir, `width-${width}-${position}.png`);
      assert.equal(fs.existsSync(p), false);
      await page.locator('#media').screenshot({ path: p, animations: 'disabled' });
      shots.push({ position, path: p, sha256: hash(p) });
    };
    await capture(width === 640 ? 'full' : 'start');
    await page.evaluate(() => {
      const media = document.getElementById('media');
      media.scrollLeft = media.scrollWidth;
    });
    const end = await page.evaluate(() => {
      const m = document.getElementById('media'), s = m.querySelector('svg');
      const a = m.getBoundingClientRect(), b = s.getBoundingClientRect();
      return { scrollLeft: m.scrollLeft, svgRight: b.right, viewportRight: a.right };
    });
    assert.equal(end.scrollLeft, measurement.maxScrollLeft);
    assert.ok(Math.abs(end.svgRight - end.viewportRight) <= 1);
    if (width !== 640) await capture('end');
    previews.push({ containerWidth: width, ...measurement, end, screenshots: shots, checkResult: 'pass-author-preview-only' });
    await page.close();
  }
  assert.deepEqual(pageErrors, []);
} finally {
  await browser.close();
}
fs.writeFileSync(path.join(dir, 'preview-evidence.json'), `${JSON.stringify({
  schema: 'd067/fig114-author-preview@1',
  authorOnly: true, independentReview: 'pending', checkResult: 'pass-author-preview-only',
  browser: 'existing app Playwright Chromium, isolated headless fresh contexts',
  env: { PWDEBUG: 'unset', PLAYWRIGHT_HTML_OPEN: 'never' },
  helperBasis: [
    path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d023-n91-fig171-author/commands/capture-previews.mjs'),
    path.join(root, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
  ],
  spec: { path: specFile, sha256: hash(specFile) },
  svg: { path: svgFile, sha256: hash(svgFile) },
  render: { path: path.join(selected, 'fig-114.render.json'), sha256: hash(path.join(selected, 'fig-114.render.json')) },
  scrollWidthContract: 'Container widths 331/342/640 all retain 640px media. Renderer widths=[640] checks actual media size, not incorrectly shrunken scroll media.',
  topologyEvidence: { path: path.join(dir, 'topology-evidence.json'), sha256: hash(path.join(dir, 'topology-evidence.json')) },
  previews, pageErrors,
}, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  topology: topologyEvidence,
  previews: previews.map(p => ({ container: p.containerWidth, media: p.mediaWidth, minTextPx: p.minTextPx, endScroll: p.end.scrollLeft })),
}));
