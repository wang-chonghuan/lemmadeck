import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const cwd = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
const own = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n35-fig217218-author7');
if (process.cwd() !== cwd) throw new Error('Wrong cwd');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write = (p, j) => fs.writeFileSync(p, `${JSON.stringify(j, null, 2)}\n`);
const sub = (a, b) => a.map((v, i) => v - b[i]);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
const near = n => Math.abs(n) < 1e-7;
const samePoint = (a, b) => a.every((v, i) => near(v - b[i]));
const requireFact = (truth, message) => { if (!truth) throw new Error(message); };
const allResults = [];
for (const id of ['fig-217', 'fig-218']) {
  const specPath = path.join(own, `${id}.spec.json`);
  const svgPath = path.join(own, `${id}.svg`);
  const renderPath = path.join(own, `${id}.render.json`);
  const spec = read(specPath), render = read(renderPath);
  const objects = new Map(spec.objects.map(o => [o.id, o]));
  const pos = value => Array.isArray(value) ? value :
    (objects.get(value)?.at || (() => { throw new Error(`Missing point ${value}`); })());
  const ends = support => {
    const edge = objects.get(support);
    requireFact(edge?.type === 'segment', 'Not a finite displayed support');
    return [pos(edge.from), pos(edge.to)];
  };
  const results = [];
  const checked = (claim, fn) => {
    try { results.push({ id: claim, status: 'pass', evidence: fn() }); }
    catch (e) { results.push({ id: claim, status: 'fail', error: e.message }); }
  };
  checked(`${id}-native-bindings`, () => {
    requireFact(render.status === 'pass', 'Native render did not pass');
    requireFact(render.spec.sha256 === hash(specPath), 'Spec hash drift');
    requireFact(render.output.svg.sha256 === hash(svgPath), 'SVG hash drift');
    requireFact(render.root === spec.layout.metadata.root &&
      render.spec.path === `figures/${id}.spec.json` &&
      render.output.svg.path === `figures/${id}.svg`, 'Final metadata path mismatch');
    const img = path.join(cwd, spec.source.image.path);
    requireFact(hash(img) === spec.source.image.sha256, 'Original hash drift');
    return { specSha256: hash(specPath), svgSha256: hash(svgPath), nativeRenderSha256: hash(renderPath) };
  });
  checked(`${id}-full-approved-context`, () => spec.source.authoritativeText.map(entry => {
    const envelope = JSON.parse(entry.text);
    requireFact(/\/text-author7\/(lesson|exercises)\.template\.json$/.test(envelope.path),
      'Unexpected authoritative context');
    const text = fs.readFileSync(path.join(cwd, envelope.path), 'utf8');
    requireFact(text === envelope.text, 'Not the exact full approved JSON text');
    requireFact(hash(path.join(cwd, envelope.path)) === envelope.sha256, 'Approved context hash drift');
    JSON.parse(envelope.text);
    return { path: envelope.path, sha256: envelope.sha256, fullTextByteLength: Buffer.byteLength(envelope.text) };
  }));
  for (const claim of spec.layout.metadata.semanticAssertions) {
    checked(claim.id, () => {
      if (claim.type === 'ordered') {
        const pts = claim.points.map(pos);
        const v = sub(pts.at(-1), pts[0]);
        const length2 = dot(v, v);
        requireFact(length2 > 0, 'Degenerate ordering frame');
        const parameters = pts.map(p => {
          requireFact(near(cross(v, sub(p, pts[0]))), 'Point not on shared support');
          return dot(sub(p, pts[0]), v) / length2;
        });
        requireFact(parameters.every((t, i) => i === 0 || t > parameters[i - 1]), 'Wrong point order');
        let extent;
        if (claim.support) {
          const [start, finish] = ends(claim.support);
          requireFact(near(cross(v, sub(start, pts[0]))) &&
            near(cross(v, sub(finish, pts[0]))), 'Support end left its source line');
          extent = [start, finish].map(p => dot(sub(p, pts[0]), v) / length2);
          requireFact(extent[0] < 0 && extent[1] >= 1, 'Named points not on displayed support');
          if (claim.support !== 'f218-upper-support') requireFact(extent[1] > 1, 'Missing final continuation');
          else requireFact(near(extent[1] - 1), 'B must be the rightmost displayed end');
        }
        return { points: claim.points, parameters, displayedExtent: extent };
      }
      if (claim.type === 'intersection') {
        const [a, b] = ends(claim.supports[0]), [c, d] = ends(claim.supports[1]);
        const u = sub(b, a), v = sub(d, c), denominator = cross(u, v);
        requireFact(!near(denominator), 'Intersection is not unique');
        const t = cross(sub(c, a), v) / denominator;
        const s = cross(sub(c, a), u) / denominator;
        const intersection = a.map((value, i) => value + t * u[i]);
        requireFact(samePoint(intersection, pos(claim.point)), 'Wrong shared intersection');
        requireFact(t > 0 && t < 1 && s > 0 && s < 1, 'Intersection outside displayed support');
        return { point: claim.point, intersection, supportParameters: [t, s], unique: true };
      }
      if (claim.type === 'exactSupports') {
        const supports = spec.objects.filter(o =>
          ['segment', 'line', 'arrow', 'polygon', 'arc', 'circle', 'svgPath', 'grid', 'axis', 'measure'].includes(o.type));
        requireFact(supports.length === claim.supports.length &&
          supports.every(o => claim.supports.includes(o.id)), 'Extra or missing source support');
        const points = spec.objects.filter(o => o.type === 'point');
        requireFact(points.length === 8 && points.every(p => p.visible === true), 'Missing displayed point');
        const labels = points.map(p => p.label).sort();
        requireFact(JSON.stringify(labels) === JSON.stringify([...claim.labels].sort()), 'Changed labels');
        requireFact(spec.objects.every(o => o.type === 'point' || o.type === 'segment'),
          'Unexpected answer-bearing annotation');
        return { supports: claim.supports, visiblePoints: points.map(p => p.id), labels, extraJoins: 0, answerAnnotations: 0 };
      }
      if (claim.type === 'raySetSymmetry') {
        const center = pos(claim.center);
        const [a, b] = claim.first.map(pos), [a1, b1] = claim.second.map(pos);
        const v = sub(b, a), v1 = sub(b1, a1);
        requireFact(v.every((value, i) => Number.isFinite(value) && Number.isFinite(v1[i])),
          'Invalid defining directions');
        const length2 = dot(v, v);
        requireFact(length2 > 0 && dot(v1, v1) > 0 && near(cross(v, v1)), 'Not parallel ray supports');
        const scale = -dot(v, v1) / length2;
        requireFact(scale > 0 && v.every((value, i) => near(v1[i] + scale * value)), 'Not opposite directions');
        requireFact(samePoint(center.map((value, i) => 2 * value - a[i]), a1), 'Origins not opposite');
        requireFact(!near(cross(sub(a1, a), v)), 'Source rays incorrectly made collinear');
        claim.rays.forEach((ray, index) => {
          const [start, finish] = ends(ray);
          const [origin, defining] = index === 0 ? [a, v] : [a1, v1];
          requireFact(samePoint(start, origin) && near(cross(sub(finish, origin), defining)) &&
            dot(sub(finish, origin), defining) > 0, 'Displayed ray points wrong way');
          const marker = index === 0 ? b : b1;
          requireFact(dot(sub(marker, origin), defining) < dot(sub(finish, origin), defining),
            'Named direction point beyond displayed ray');
        });
        const imageOfB = center.map((value, i) => 2 * value - b[i]);
        requireFact(!samePoint(imageOfB, b1), 'Accidental B/B1 point-pair claim');
        const paired = spec.assertions.filter(a => a.type === 'centralSymmetry').flatMap(a => a.pairs);
        requireFact(paired.length === 1 && paired[0].a === 'f217-A' && paired[0].b === 'f217-A1',
          'Invented defining point pairing');
        return {
          directionScale: scale,
          exactUniversalIdentity: 'S(A+t*v)=A1+(t/scale)*v1 for every t>=0; inverse parameter=scale*u for every u>=0.',
          parameterBijectionPositive: true,
          supportIdentity: 'The same affine identity holds for every real t, so entire support lines map.',
          imageOfB, B1: b1, BToB1Asserted: false,
          visibleLengthValuesOrEqualityTicks: 0,
        };
      }
      if (claim.type === 'halfplaneExchange') {
        const center = pos(claim.center), [a, a1] = claim.boundary.map(pos);
        const direction = sub(a1, a);
        requireFact(dot(direction, direction) > 0 && near(cross(direction, sub(center, a))),
          'Center not on boundary');
        const signed = p => cross(direction, sub(p, a));
        for (const name of claim.positive) requireFact(signed(pos(name)) > 0, 'Wrong alpha1 side');
        for (const name of claim.negative) requireFact(signed(pos(name)) < 0, 'Wrong alpha side');
        const normal = [-direction[1], direction[0]];
        const constant = -dot(normal, a);
        requireFact(near(2 * (dot(normal, center) + constant)), 'Halfplane transform constant does not negate');
        const regionSigns = [-1, 1];
        claim.regions.forEach((regionId, i) => {
          const vertices = objects.get(regionId).points.map(pos);
          requireFact(vertices.every(p => regionSigns[i] * signed(p) >= -1e-7),
            'Displayed region crosses boundary');
          requireFact(vertices.filter(p => near(signed(p))).length === 2, 'Region missing shared boundary');
        });
        for (const hatchId of claim.hatchIds) {
          const [start, finish] = ends(hatchId);
          requireFact(signed(start) <= 1e-7 && signed(finish) <= 1e-7, 'Hatching escaped alpha');
        }
        return {
          affineForm: { normal, constant },
          universalIdentity: 'h(2O-X)=-h(X) for every X; h=0 boundary is invariant; h<0 and h>0 halfplanes exchange bijectively.',
          allPositiveMembers: claim.positive, allNegativeMembers: claim.negative,
          checkedHatchCount: claim.hatchIds.length,
          regionPolygonsAreDisplayClipsNotFiniteHalfplanes: true,
        };
      }
      throw new Error(`Unsupported claim type ${claim.type}`);
    });
  }
  const status = results.some(r => r.status !== 'pass') ? 'fail' : 'pass';
  const report = { schema: 'n35-author-semantic-check@1', figure: id, status,
    candidateOnly: true, independentReview: 'not performed',
    root: spec.layout.metadata.root,
    bindings: { spec: { path: `figures/${id}.spec.json`, sha256: hash(specPath) },
      svg: { path: `figures/${id}.svg`, sha256: hash(svgPath) },
      render: { path: `figures/${id}.render.json`, sha256: hash(renderPath) },
      checkerSha256: hash(path.join(own, 'verify-candidate.mjs')) }, results };
  write(path.join(own, `${id}.semantic-check.json`), report);
  allResults.push(report);
  console.log(`${id}: supplementary executable assertions ${status}`);
}
if (allResults.some(r => r.status !== 'pass')) process.exit(2);

const displayPath = path.join(own, 'display-check.json');
if (fs.existsSync(displayPath)) throw new Error('Refusing to redo passed display stage');
const { chromium } = await import(path.join(cwd, '.agents/skills/node_modules/playwright-core/index.mjs'));
const candidates = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
const executablePath = candidates.find(p => fs.existsSync(p));
if (!executablePath) throw new Error('No installed local Chromium');
const browser = await chromium.launch({ executablePath, headless: false });
const display = {
  schema: 'n35-author-offline-display@1', status: 'candidate-check-in-progress',
  candidateOnly: true, independentReview: 'not performed',
  authority: 'Direct assigned stable offline usable-width contract. Affected figure media only, not whole lesson acceptance.',
  headed: true, networkRequestsAllowed: false, views: [], browserClosed: false,
  counters: { sourceImageContextLoads: 2, sourceCrops: 0, sourceReopens: 0,
    nativePreviewPngs: 0, screenshotFiles: 0, screenshotContextLoads: 0 },
};
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  await page.route('**/*', route => route.abort());
  const media = ['fig-217', 'fig-218'].map(id => ({
    id, svg: fs.readFileSync(path.join(own, `${id}.svg`), 'utf8'),
  }));
  for (const view of [
    { name: 'desktop', viewport: { width: 720, height: 930 }, padding: 40, usable: 640 },
    { name: 'mobile', viewport: { width: 390, height: 930 }, padding: 16, usable: 358 },
  ]) {
    await page.setViewportSize(view.viewport);
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
      :root{--ld-figure-ink:#202124;--ld-figure-muted:#646970;--ld-figure-accent:#202124;
      --ld-figure-accent-soft:#f0f1f2;--ld-figure-grid:#a8adb2;--ld-figure-paper:#ffffff;}
      *{box-sizing:border-box}html,body{margin:0;background:#fff;color:#202124}
      body{padding:18px ${view.padding}px;font-family:Arial,Helvetica,sans-serif}
      section{margin:0 0 18px}h2{font-size:16px;font-weight:500;margin:0 0 6px}
      .media-scroll{width:100%;overflow-x:auto;overflow-y:hidden}
      .media-scroll svg{display:block;width:640px;max-width:none;height:auto}
    </style></head><body>${media.map(({ id, svg }) =>
      `<section data-figure="${id}"><h2>${id === 'fig-217' ? 'Theorem 43' : 'Exercise 450'}</h2>
      <div class="media-scroll">${svg.replace(/<\?xml[^>]*>/, '')}</div></section>`).join('')}
    </body></html>`);
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(() => [...document.querySelectorAll('section')].map(section => {
      const container = section.querySelector('.media-scroll'), svg = section.querySelector('svg');
      const rect = svg.getBoundingClientRect();
      const labels = [...svg.querySelectorAll('[data-label-id]')].map(label => {
        const ctm = label.getScreenCTM(), bbox = label.getBBox();
        const font = Number.parseFloat(getComputedStyle(label).fontSize);
        const corners = [[bbox.x, bbox.y], [bbox.x + bbox.width, bbox.y],
          [bbox.x, bbox.y + bbox.height], [bbox.x + bbox.width, bbox.y + bbox.height]]
          .map(([x, y]) => new DOMPoint(x, y).matrixTransform(ctm));
        return { id: label.dataset.labelId, text: label.textContent,
          renderedFontPx: font * Math.hypot(ctm.c, ctm.d),
          fitsMedia: corners.every(p => p.x >= rect.left - .1 &&
            p.x <= rect.right + .1 && p.y >= rect.top - .1 && p.y <= rect.bottom + .1) };
      });
      const geometryCount = svg.querySelectorAll('path,line,circle,polygon,polyline').length;
      const maximum = container.scrollWidth - container.clientWidth;
      container.scrollLeft = maximum;
      const reached = Math.abs(container.scrollLeft - maximum) < 1;
      const actualEnd = container.scrollLeft;
      container.scrollLeft = 0;
      return { figure: section.dataset.figure, containerWidth: container.clientWidth,
        mediaWidth: rect.width, mediaHeight: rect.height, minFontPx: Math.min(...labels.map(l => l.renderedFontPx)),
        labels, geometryCount, scrollMaximum: maximum, actualScrollEnd: actualEnd, scrollEndReachable: reached };
    }));
    for (const metric of metrics) {
      requireFact(metric.containerWidth === view.usable && metric.mediaWidth === 640, 'Wrong usable/media display width');
      requireFact(metric.minFontPx >= 16 && metric.labels.every(l => l.fitsMedia), 'Label size/clipping failure');
      requireFact(metric.scrollEndReachable && metric.geometryCount > 0, 'Missing geometry or inaccessible scroll end');
    }
    const screenshot = path.join(own, `${view.name}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    display.counters.screenshotFiles++;
    display.views.push({ name: view.name, viewport: view.viewport, metrics,
      screenshot: { path: screenshot, sha256: hash(screenshot) }, status: 'pass' });
  }
  display.status = 'pass-author-offline-display-only';
} catch (error) {
  display.status = 'fail';
  display.error = error.message;
  throw error;
} finally {
  await browser.close();
  display.browserClosed = true;
  display.bindings = allResults.map(r => ({ figure: r.figure, ...r.bindings }));
  write(displayPath, display);
}
console.log('Desktop/mobile affected-media checks completed; owned browser closed.');
