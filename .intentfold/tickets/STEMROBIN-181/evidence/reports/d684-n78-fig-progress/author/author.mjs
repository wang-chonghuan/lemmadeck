import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const owned = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d662-n78-fig182183-author');
assert.equal(process.cwd(), repo);
const args = process.argv.slice(2);
assert.ok(args.length === 1 && ['prepare', 'fig-182', 'fig-183', 'summarize'].includes(args[0]));
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: sha(file), bytes: fs.statSync(file).size });
const write = (relative, value) => {
  const target = path.resolve(owned, relative);
  assert.ok(target.startsWith(`${owned}/`), 'outside author ownership');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return target;
};
const skill = path.join(repo, '.agents/skills/ld-s10y-image');
const validator = path.join(skill, 'scripts/validate_spec.py');
const renderer = path.join(skill, 'scripts/render_spec.mjs');
const inventory = read(path.join(owned, 'source-inventory.json'));
const candidateRoot = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d660-n78-flow-affected-repair/candidate');
const textPaths = ['zh', 'en'].map(locale => path.join(candidateRoot, locale, 'lesson.template.json'));
const texts = textPaths.map(read);
texts.forEach(text => assert.equal(text.card_id, 'phy10-c2-s2-n78'));
const retained = path.join(repo, '.intentfold/tickets/STEMROBIN-181/evidence/reports');
const widthRecords = [
  path.join(retained, 'd588-source204-and-first-n76/d578-n75-fig166167-first-modern-author/routing-decision.json'),
  path.join(retained, 'd547-source200-and-first-figures/d533-n74-first-modern-figure-author/report.json'),
  path.join(retained, 'd617-source207-and-ready-candidates/d603-n76-fig177178-first-modern-author/report.json'),
  path.join(retained, 'd658-external-archive-recovery.json'),
];
const widths = read(widthRecords[0]).requestedDisplayContractIfUnblocked.widths;
assert.deepEqual(widths, [331, 342, 640]);
assert.deepEqual(read(widthRecords[1]).figures[0].display.widths, widths);
assert.match(read(widthRecords[2]).nativeWidthObservations, /331-342-640/);
assert.match(read(widthRecords[3]).returnedResults.n78Figure182183.authorObservation, /331\/342\/640/);

function base(id, height, description) {
  return {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
    source: {
      image: bind(path.join(repo, inventory.sourceFacts[id].path)),
      authoritativeText: texts.flatMap((text, i) => text.prose
        .filter(block => block.kind === 'p' && block.text)
        .map(block => ({ lesson: `phy10-c2-s2-n78:${['zh', 'en'][i]}`, text: block.text }))),
      inventory: [],
    },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', minTextPx: 16, widths, maxWidthPx: 640 },
    layout: { minLabelGap: 4 }, objects: [], assertions: [],
  };
}

function drawing(spec) {
  const add = object => { spec.objects.push(object); return object.id; };
  const assertion = object => { spec.assertions.push(object); return object.id; };
  const point = (id, at, visible = false, size = 0.65) => add({
    id, type: 'point', at, visible, size, stroke: 'ink', fill: 'ink', strokeWidth: 1,
  });
  const segment = (id, from, to, style = {}) => add({
    id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 2.8, ...style,
  });
  const label = (id, at, text, fontSize = 34) => add({
    id, type: 'text', at, text, fontSize, labelPlacement: { position: 'CENTER' },
  });
  const coordinates = value => typeof value === 'string'
    ? spec.objects.find(object => object.id === value).at : value;
  const connect = (id, edge, from, to) => assertion({ id, type: 'connects', arrow: edge, from, to });
  const directionalRay = (id, from, to, style = {}) => {
    const edge = segment(id, from, to, style);
    const connection = connect(`${id}-connects`, edge, from, to);
    const a = coordinates(from), b = coordinates(to);
    const dx = b[0] - a[0], dy = b[1] - a[1], length = Math.hypot(dx, dy);
    assert.ok(length > 0);
    const direction = [dx / length, dy / length], normal = [-dy / length, dx / length];
    const tip = [a[0] + dx * 0.61, a[1] + dy * 0.61];
    const headLength = Math.min(8, length * 0.22), halfWidth = Math.min(3, length * 0.08);
    const back = [tip[0] - direction[0] * headLength, tip[1] - direction[1] * headLength];
    const head = add({
      id: `${id}-direction`, type: 'polygon',
      points: [tip, [back[0] + normal[0] * halfWidth, back[1] + normal[1] * halfWidth],
        [back[0] - normal[0] * halfWidth, back[1] - normal[1] * halfWidth]],
      fill: style.stroke || 'ink', fillOpacity: 1, stroke: style.stroke || 'ink', strokeWidth: 1,
    });
    const directionAssertion = assertion({
      id: `${id}-direction-on-ray`, type: 'pointOnLine', point: tip, a: from, b: to,
    });
    return { objects: [edge, head], assertions: [connection, directionAssertion] };
  };
  // Curved glass profiles are renderer-owned svgPath objects, never edited output SVG.
  const lens = (id, x, y, halfHeight, halfWidth, shape = 'double') => {
    const sy = spec.canvas.height - y;
    const top = sy - halfHeight, bottom = sy + halfHeight;
    const left = shape === 'right' ? 0 : halfWidth;
    const right = shape === 'left' ? 0 : halfWidth;
    const d = `M ${x} ${top} C ${x + right} ${top + 8} ${x + right} ${bottom - 8} ${x} ${bottom} C ${x - left} ${bottom - 8} ${x - left} ${top + 8} ${x} ${top} Z`;
    const ids = [add({ id, type: 'svgPath', d, fill: 'accentSoft', fillOpacity: 0.18, stroke: 'ink', strokeWidth: 2.8 })];
    ids.push(segment(`${id}-top-cap`, [x - 6, y + halfHeight], [x + 6, y + halfHeight]));
    ids.push(segment(`${id}-bottom-cap`, [x - 6, y - halfHeight], [x + 6, y - halfHeight]));
    for (const [i, h] of [-24, -8, 8, 24].entries()) {
      const center = x + (shape === 'right' ? 4 : shape === 'left' ? -4 : 0);
      ids.push(segment(`${id}-glass-${i}`, [center - 2, y + h - 3], [center + 2, y + h + 3],
        { stroke: 'muted', strokeWidth: 1.6 }));
    }
    return ids;
  };
  return { add, assertion, point, segment, label, connect, directionalRay, lens };
}

function figure182() {
  const spec = base('fig-182', 840,
    'Six-panel fixed-film focusing and depth-of-field comparison in an ideal thin-lens paraxial model. The image-side stop position follows the source pixels, not an unreported correction of the edition aperture-side wording.');
  const d = drawing(spec), model = [];
  d.label('opening-wide', [160, 808], 'Wide opening');
  d.label('opening-small', [480, 808], 'Small opening');
  d.label('paraxial-scope', [320, 38], 'Paraxial model');
  for (const panel of inventory.sourceFacts['fig-182'].panels) {
    const prefix = `s182-${panel.id}`, x0 = panel.column * 320;
    const y = [688, 438, 188][panel.row], lensX = x0 + 150, filmX = x0 + 250;
    const u = [100, 70, 130][panel.row], f = 50, v = 1 / (1 / f - 1 / u);
    const stopOffset = 12, stopGap = 10, wideHalfOpening = 28;
    const effectiveHalfOpening = panel.opening === 'wide' ? wideHalfOpening : stopGap / (1 - stopOffset / v);
    const ids = [], assertionIds = [];
    const sourcePoint = d.point(`${prefix}-object`, [lensX - u, y], true, 3);
    const center = d.point(`${prefix}-lens-center`, [lensX, y]);
    const conjugate = d.point(`${prefix}-conjugate`, [lensX + v, y]);
    ids.push(sourcePoint, d.label(`${prefix}-object-name`, [lensX - u, y + 33], panel.point));
    ids.push(d.label(`${prefix}-panel-name`, [x0 + 28, y + 94], panel.id));
    ids.push(d.label(`${prefix}-film-name`, [x0 + 285, y], panel.filmMark));
    ids.push(...d.lens(`${prefix}-lens`, lensX, y, 43, 12));
    ids.push(d.segment(`${prefix}-film`, [filmX, y - 58], [filmX, y + 58], { strokeWidth: 3.2 }));
    assertionIds.push(d.assertion({
      id: `${prefix}-object-distance`, type: 'distance', a: sourcePoint, b: center, value: u,
    }));
    assertionIds.push(d.assertion({
      id: `${prefix}-conjugate-distance`, type: 'distance', a: center, b: conjugate, value: v,
    }));
    const intercepts = [];
    for (const [i, sign] of [1, -1].entries()) {
      const rim = d.point(`${prefix}-rim-${i}`, [lensX, y + sign * effectiveHalfOpening]);
      const intercept = d.point(`${prefix}-film-${i}`, [filmX, y + sign * effectiveHalfOpening * (1 - 100 / v)]);
      intercepts.push(intercept);
      for (const ray of [
        d.directionalRay(`${prefix}-incident-${i}`, sourcePoint, rim),
        d.directionalRay(`${prefix}-transmitted-${i}`, rim, intercept),
      ]) {
        ids.push(...ray.objects); assertionIds.push(...ray.assertions);
      }
      assertionIds.push(d.assertion({
        id: `${prefix}-outgoing-collinear-${i}`, type: 'collinear', a: rim, b: intercept, c: conjugate,
      }));
      if (panel.opening === 'small') {
        const stopHit = d.point(`${prefix}-stop-hit-${i}`, [lensX + stopOffset, y + sign * stopGap]);
        assertionIds.push(d.assertion({
          id: `${prefix}-admitted-at-stop-${i}`, type: 'collinear', a: rim, b: stopHit, c: conjugate,
        }));
        const outerRim = d.point(`${prefix}-blocked-rim-${i}`, [lensX, y + sign * wideHalfOpening]);
        const blockedHit = d.point(`${prefix}-blocked-hit-${i}`,
          [lensX + stopOffset, y + sign * wideHalfOpening * (1 - stopOffset / v)]);
        for (const ray of [
          d.directionalRay(`${prefix}-blocked-incident-${i}`, sourcePoint, outerRim, { stroke: 'muted' }),
          d.directionalRay(`${prefix}-blocked-after-lens-${i}`, outerRim, blockedHit, { stroke: 'muted' }),
        ]) {
          ids.push(...ray.objects); assertionIds.push(...ray.assertions);
        }
        assertionIds.push(d.assertion({
          id: `${prefix}-blocked-outgoing-${i}`, type: 'collinear', a: outerRim, b: blockedHit, c: conjugate,
        }));
      }
    }
    const blurDiameter = 2 * effectiveHalfOpening * Math.abs(1 - 100 / v);
    if (panel.row === 0) {
      const focus = d.point(`${prefix}-film-focus`, [filmX, y], true, 3);
      ids.push(focus);
      assertionIds.push(d.assertion({
        id: `${prefix}-focus-relative-to-object`, type: 'displacement', from: sourcePoint, to: focus, dx: u + 100, dy: 0,
      }));
      spec.source.inventory.push({
        id: `${prefix}-focused-point-relationship`,
        description: 'The source luminous A and A-prime meet on the film; quantitative displacement is a separately declared thin-lens construction, not a source measurement.',
        objects: [sourcePoint, focus], assertions: [`${prefix}-focus-relative-to-object`], requires: ['pointRelationships'],
      });
    } else {
      ids.push(d.segment(`${prefix}-defocus-section`, intercepts[0], intercepts[1], { stroke: 'accent', strokeWidth: 7 }));
      assertionIds.push(d.assertion({
        id: `${prefix}-nonzero-defocus-diameter`, type: 'distance', a: intercepts[0], b: intercepts[1], value: blurDiameter,
      }));
    }
    if (panel.opening === 'small') {
      for (const [i, sign] of [1, -1].entries()) {
        ids.push(d.segment(`${prefix}-stop-bar-${i}`, [lensX + stopOffset, y + sign * stopGap],
          [lensX + stopOffset, y + sign * 48], { strokeWidth: 4 }));
      }
    }
    spec.source.inventory.push({
      id: `${prefix}-source-panel`, description: `${panel.observed} Clean lens contours, hatching and calculated intercepts regularize the schematic; neither these coordinates nor the thin-lens focal length are source givens.`,
      objects: [...new Set(ids)], assertions: [...new Set(assertionIds)],
    });
    model.push({
      panel: panel.id, point: panel.point, lensX, filmX, axisY: y,
      objectDistance: u, imageDistance: v, focalLength: f, fixedFilmDistance: 100,
      effectiveHalfOpening, filmBlurDiameter: blurDiameter,
      ...(panel.opening === 'small' ? { imageSideStopOffset: stopOffset, physicalStopHalfGap: stopGap } : {}),
    });
  }
  return { spec, model, additions: [
    'Exact selected u/v/f coordinates satisfy the ideal paraxial thin-lens equation. No numerical optical givens are printed.',
    'Lens profiles and diagonal glass marks are regularized source structure, not measured curvatures or counted optical rays.',
    'Image-side stop has a fixed physical half-gap. Its admitted lens height depends on conjugate distance; blocked rays stop at the bars. This preserves the source-side stop without silently claiming it was before the objective.',
    'Thick short film-plane segments represent edge-on defocus diameters, not front-view circles. B-prime/C-prime name film spots and never the hidden exact conjugate points.',
    'Only A is represented by a point on film. Nonzero B/C defocus remains after stopping down; diffraction/aberration are not modeled.',
    'English opening headers and a Paraxial model scope label are deliberate instructional additions.',
    'Directed rays use native segment and polygon objects with connects/on-line assertions; they do not depend on SVG marker geometry.',
  ] };
}

function figure183() {
  const spec = base('fig-183', 420,
    'Projector schematic distinguishing illumination by condenser K from the enlarged inverted real slide image formed by objective O, with separately declared ideal thin-lens paraxial coordinates.');
  const d = drawing(spec), model = { slideX: 224, objectiveX: 332, screenX: 602, axisY: 198,
    objectDistance: 108, imageDistance: 270, focalLength: 1 / (1 / 108 + 1 / 270),
    magnification: -2.5, slideHalfHeight: 20 };
  const y = model.axisY;
  const group = (id, description, objects, assertions) => spec.source.inventory.push({ id, description, objects, assertions });
  const source = d.point('s183-source', [70, y], true, 3);
  const lampObjects = [source, d.label('s183-S', [43, y + 28], 'S')];
  for (let i = 0; i < 8; i++) {
    const angle = i * Math.PI / 4;
    lampObjects.push(d.segment(`s183-lamp-spoke-${i}`, [70 + 7 * Math.cos(angle), y + 7 * Math.sin(angle)],
      [70 + 15 * Math.cos(angle), y + 15 * Math.sin(angle)], { strokeWidth: 2.2 }));
  }
  const housing = d.add({ id: 's183-light-housing', type: 'polygon',
    points: [[20, 110], [205, 110], [205, 274], [20, 274]],
    fill: 'paper', fillOpacity: 0, stroke: 'ink', strokeWidth: 2.8 });
  lampObjects.push(housing);
  group('s183-lamp-and-housing', 'S and radiating lamp mark inside the rectangular source housing; short lamp strokes are cleaned schematic marks, not measured source angular data.',
    lampObjects, [d.assertion({ id: 's183-lamp-inside-housing', type: 'inside', point: source, container: housing })]);
  const condenserObjects = [
    ...d.lens('s183-K-left', 168, y, 43, 17, 'right'),
    ...d.lens('s183-K-right', 198, y, 43, 17, 'left'),
    d.label('s183-K', [182, 308], 'K'),
  ];
  const condenserAssertions = [];
  for (const [i, h] of [28, 9, -9, -28].entries()) {
    const first = d.point(`s183-K-entry-${i}`, [168, y + h]);
    const second = d.point(`s183-K-exit-${i}`, [198, y + h]);
    const slide = d.point(`s183-D-illumination-${i}`, [224, y + h * 20 / 28]);
    for (const ray of [
      d.directionalRay(`s183-illumination-entry-${i}`, source, first, { stroke: 'muted' }),
      d.directionalRay(`s183-illumination-condenser-${i}`, first, second, { stroke: 'muted' }),
      d.directionalRay(`s183-illumination-slide-${i}`, second, slide, { stroke: 'muted' }),
    ]) {
      condenserObjects.push(...ray.objects); condenserAssertions.push(...ray.assertions);
    }
  }
  group('s183-condenser-and-illumination', 'Pair K and right-going illumination fan collected onto D. Quantitative condenser optics are NOT asserted; this is a source-structured illumination schematic, not slide-image formation by K.',
    condenserObjects, condenserAssertions);
  const frame = d.add({ id: 's183-slide-frame', type: 'polygon',
    points: [[219, 158], [229, 158], [229, 238], [219, 238]],
    fill: 'accentSoft', fillOpacity: 0.18, stroke: 'ink', strokeWidth: 3 });
  const slideObjects = [frame, d.segment('s183-slide-active', [224, y - 20], [224, y + 20], { strokeWidth: 5 }),
    d.label('s183-D', [241, 308], 'D'), d.segment('s183-D-leader', [238, 279], [228, 239], { strokeWidth: 1.8 })];
  group('s183-slide', 'Upright framed D immediately after K with a label leader; its selected active height is a model addition, not a pixel measurement.', slideObjects, []);
  const objectiveObjects = [...d.lens('s183-objective', 332, y, 30, 11),
    d.label('s183-O', [332, 308], 'O'),
    d.segment('s183-tube-upper-1', [230, 243], [312, 243]),
    d.segment('s183-tube-upper-2', [312, 243], [312, 231]),
    d.segment('s183-tube-upper-3', [312, 231], [370, 231]),
    d.segment('s183-tube-lower-1', [230, 153], [312, 153]),
    d.segment('s183-tube-lower-2', [312, 153], [312, 165]),
    d.segment('s183-tube-lower-3', [312, 165], [370, 165]),
    d.segment('s183-tube-exit', [370, 165], [370, 231])];
  group('s183-objective-and-tube', 'Small O in a stepped tube with a vertical exit rim, farther right than D; contour regularization introduces no physical lens measurements.', objectiveObjects, []);
  group('s183-screen', 'Tall vertical screen at far right; English Screen is an addition for the originally unlabeled screen.',
    [d.segment('s183-screen-line', [602, 58], [602, 352], { strokeWidth: 4 }),
      d.label('s183-screen-name', [550, 383], 'Screen')], []);
  const rayObjects = [], rayAssertions = [];
  const center = d.point('s183-O-center', [332, y]);
  for (const [i, sign] of [1, -1].entries()) {
    const slide = d.point(`s183-slide-tip-${i}`, [224, y + sign * 20], true);
    const image = d.point(`s183-image-tip-${i}`, [602, y - sign * 50], true);
    const rim = d.point(`s183-O-rim-${i}`, [332, y + sign * 28]);
    rayObjects.push(slide, image);
    for (const [j, intercept] of [center, rim].entries()) {
      for (const ray of [
        d.directionalRay(`s183-image-incident-${i}-${j}`, slide, intercept),
        d.directionalRay(`s183-image-exit-${i}-${j}`, intercept, image),
      ]) {
        rayObjects.push(...ray.objects); rayAssertions.push(...ray.assertions);
      }
    }
    rayAssertions.push(d.assertion({
      id: `s183-center-ray-${i}`, type: 'collinear', a: slide, b: center, c: image,
    }));
    rayAssertions.push(d.assertion({
      id: `s183-slide-image-displacement-${i}`, type: 'displacement', from: slide, to: image, dx: 378, dy: -sign * 70,
    }));
  }
  group('s183-slide-objective-image-paths', 'Source-directed paths from D through O to an enlarged image on the screen; two selected slide heights and their ideal conjugates make the inverted thin-lens relationship executable without claiming a calibrated scan.',
    rayObjects, rayAssertions);
  spec.source.inventory.at(-1).requires = ['pointRelationships'];
  d.label('s183-paraxial-scope', [320, 28], 'Paraxial model');
  return { spec, model, additions: [
    'A fixed-f ideal paraxial objective realizes u=108, v=270 in arbitrary drawing units, so f<u<2f and image magnification is -2.5. None is a source-given number.',
    'Two selected slide endpoints map to larger inverted screen endpoints; native collinearity/displacement/connects assertions bind them. They are not named source image points.',
    'K illumination is schematic. Its two cleaned facing lens profiles and glass hatching are not calibrated curvatures or exact condenser refraction data.',
    'Rectangular housing and stepped objective tube are regularized from source structure.',
    'English Screen and Paraxial model labels are explicit additions; S,K,D,O retain source identities.',
    'Directed rays use renderer-owned segments/polygons rather than hand-edited SVG or unsupported marker modifications.',
  ] };
}

function modelCheck(id, spec, model) {
  const close = (a, b, note) => assert.ok(Math.abs(a - b) < 1e-7, `${note}: ${a} versus ${b}`);
  const coords = name => spec.objects.find(object => object.id === name).at;
  const checks = [];
  if (id === 'fig-182') {
    for (const row of model) {
      const prefix = `s182-${row.panel}`;
      close(1 / row.focalLength, 1 / row.objectDistance + 1 / row.imageDistance, 'thin-lens equation');
      close(row.filmX - row.lensX, 100, 'fixed film distance');
      for (const i of [0, 1]) {
        const rim = coords(`${prefix}-rim-${i}`), hit = coords(`${prefix}-film-${i}`);
        const expected = (rim[1] - row.axisY) * (1 - 100 / row.imageDistance);
        close(hit[1] - row.axisY, expected, 'film intercept');
        if (row.physicalStopHalfGap) {
          const stop = coords(`${prefix}-stop-hit-${i}`);
          close(Math.abs(stop[1] - row.axisY), 10, 'same physical stop opening');
          const blocked = coords(`${prefix}-blocked-hit-${i}`);
          assert.ok(Math.abs(blocked[1] - row.axisY) > 10, 'outer ray must hit opaque stop');
        }
      }
      checks.push({ panel: row.panel, thinLens: 'pass', fixedFilm: 'pass',
        blurDiameter: row.filmBlurDiameter, focusBeyondFilm: row.imageDistance > 100, focusBeforeFilm: row.imageDistance < 100 });
    }
    close(model.find(row => row.panel === 'a').filmBlurDiameter, 0, 'a sharp focus');
    close(model.find(row => row.panel === 'd').filmBlurDiameter, 0, 'd sharp focus');
    for (const pair of [['b', 'e'], ['c', 'f']]) {
      const wide = model.find(row => row.panel === pair[0]), small = model.find(row => row.panel === pair[1]);
      assert.ok(small.filmBlurDiameter > 0 && small.filmBlurDiameter < wide.filmBlurDiameter, 'smaller NONZERO defocus');
      close(wide.objectDistance, small.objectDistance, 'paired unchanged object distance');
    }
  } else {
    const m = model;
    close(1 / m.focalLength, 1 / m.objectDistance + 1 / m.imageDistance, 'projector thin lens');
    assert.ok(m.focalLength < m.objectDistance && m.objectDistance < 2 * m.focalLength);
    close(m.magnification, -m.imageDistance / m.objectDistance, 'inverted enlargement');
    for (const i of [0, 1]) {
      const object = coords(`s183-slide-tip-${i}`), image = coords(`s183-image-tip-${i}`);
      close(image[1] - m.axisY, m.magnification * (object[1] - m.axisY), 'image endpoint');
      for (const j of [0, 1]) {
        const lensY = j ? coords(`s183-O-rim-${i}`)[1] : m.axisY;
        const incomingSlope = (lensY - object[1]) / m.objectDistance;
        const outgoingSlope = (image[1] - lensY) / m.imageDistance;
        close(outgoingSlope, incomingSlope - (lensY - m.axisY) / m.focalLength, 'paraxial lens slope change');
      }
    }
    checks.push({ fixedFThinLens: 'pass', objectBetweenFAnd2F: 'pass', enlargedInvertedImage: 'pass', condenserNotClaimedAsObjective: true });
  }
  for (const head of spec.objects.filter(object => object.id.endsWith('-direction'))) {
    const edge = spec.objects.find(object => object.id === head.id.slice(0, -10));
    const from = typeof edge.from === 'string' ? coords(edge.from) : edge.from;
    const to = typeof edge.to === 'string' ? coords(edge.to) : edge.to;
    const [tip, left, right] = head.points, back = [(left[0] + right[0]) / 2, (left[1] + right[1]) / 2];
    assert.ok((tip[0] - back[0]) * (to[0] - from[0]) + (tip[1] - back[1]) * (to[1] - from[1]) > 0);
  }
  return { status: 'pass', evidenceType: 'AUTHOR-MECHANICAL-NOT-INDEPENDENT-SCI-FIG', checks };
}

function nativeRun(directory, name, executable, argv) {
  const startedAt = new Date().toISOString();
  const result = spawnSync(executable, argv, {
    cwd: repo, encoding: 'utf8', timeout: 120000, maxBuffer: 12 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  return write(`${directory}/${name}.receipt.json`, {
    cwd: repo, executable, argv, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message || null,
    stdout: result.stdout || '', stderr: result.stderr || '',
  });
}

if (args[0] === 'prepare') {
  const sources = ['fig-182', 'fig-183'].map(id => path.join(repo, inventory.sourceFacts[id].path));
  write('input-pins.json', {
    date: '2026-11-18', repo, branch: 'codex/STEMROBIN-181-textbooks',
    branchEvidence: bind(path.join(repo, '.intentfold/tickets/STEMROBIN-181/ticket.json')),
    scope: ['fig-182', 'fig-183'], sourceImages: sources.map(file => {
      const bytes = fs.readFileSync(file);
      return { ...bind(file), width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
    }),
    currentText: textPaths.map(bind), sourceInventory: bind(path.join(owned, 'source-inventory.json')),
    inheritedWidthContract: { layout: 'inline', widths, maxWidthPx: 640, minTextPx: 16,
      evidence: widthRecords.map(bind), newlyMeasuredProductWidths: false },
    existingTools: [validator, renderer, path.join(skill, 'assets/figure-spec.schema.json'),
      path.join(skill, 'scripts/materialize_arrowheads.mjs')].map(bind),
    readContracts: [
      '.intentfold/readme.md', '.intentfold/project.json', '.intentfold/charter/product.md',
      '.intentfold/charter/engineering.md', '.intentfold/charter/ui.md', '.intentfold/charter/operations.md',
      '.agents/skills/ld-s10y-image/SKILL.md', '.agents/skills/ld-s10y-image/references/routing.md',
      '.agents/skills/ld-s10y-image/references/figure-spec.md', '.agents/skills/ld-s10y-image/references/quality-gate.md',
      '.claude/skills/ld-s10y-lesson/references/production-resume.md',
    ].map(file => bind(path.join(repo, file))),
    noBackendAccess: true, noGitOperations: true, previousFigureAuthorNotRevived: true,
    textSCI: 'PASS-INHERITED-NOT-REPEATED', textZHENSemantics: 'PASS-INHERITED-NOT-REPEATED',
    textAffectedFlowReview: 'PENDING-OTHER-WORKER',
    excluded: 'fig-181 not opened, authored or purchased; missing paid output HOLD remains. Historical usage is not reset.',
  });
  for (const [id, build] of [['fig-182', figure182], ['fig-183', figure183]]) {
    const result = build();
    delete result.spec.source.image.bytes;
    write(`${id}/spec.json`, result.spec);
    write(`${id}/model-additions.json`, { sourceFacts: inventory.sourceFacts[id], modernAdditions: result.additions,
      selectedModel: result.model, sourceCoordinatesMeasured: false,
      pendingIndependentFIG: true, pendingIndependentVisual: true, reviewApproval: false });
    write(`${id}/author-model-check.json`, modelCheck(id, result.spec, result.model));
  }
  console.log(JSON.stringify({ status: 'SPECS-PREPARED', owned, sourceOpens: 2, widthContract: widths }));
} else if (args[0] === 'summarize') {
  const pins = read(path.join(owned, 'input-pins.json'));
  const figures = ['fig-182', 'fig-183'].map(id => {
    const first = path.join(owned, id);
    const repaired = path.join(first, 'repair1');
    const repairUsed = fs.existsSync(path.join(repaired, 'attempt.json'));
    const dir = repairUsed ? repaired : first;
    const spec = bind(path.join(dir, 'spec.json'));
    const reportPath = path.join(dir, 'render.json');
    const render = fs.existsSync(reportPath) ? read(reportPath) : null;
    const svg = path.join(dir, 'figure.svg'), png = path.join(dir, 'native.png');
    return { id, spec, svg: fs.existsSync(svg) ? bind(svg) : null, png: fs.existsSync(png) ? bind(png) : null,
      nativeRender: render ? bind(reportPath) : null, nativeStatus: render?.status || 'NOT-EMITTED',
      nativeDisplayChecks: render?.displayChecks || null, collisions: render?.collisions || null,
      firstAttempt: fs.existsSync(path.join(first, 'attempt.json')) ? bind(path.join(first, 'attempt.json')) : null,
      firstFailurePreserved: repairUsed ? bind(path.join(first, 'render.json')) : null,
      repairReceipt: repairUsed ? bind(path.join(repaired, 'repair.json')) : null,
      finalAttempt: fs.existsSync(path.join(dir, 'attempt.json')) ? bind(path.join(dir, 'attempt.json')) : null,
      identifiedSpecRepairs: repairUsed ? 1 : 0, independentFIG: 'PENDING', independentVisual: 'PENDING',
      nativeFailureBlocksDownstream: render?.status !== 'pass',
      status: render?.status === 'pass' ? 'NATIVE-PASS-NOT-FIG-APPROVAL' : 'STOP-NATIVE-FAIL-NO-FURTHER-REPAIR',
      fullCardDISPLAY: 'NOT-RUN', approved: false, promoted: false };
  });
  write('report.json', {
    schema: 'd662/bounded-actual-modern-author@1', ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n78',
    ownedRoot: owned, status: figures.every(figure => figure.nativeStatus === 'pass')
      ? 'ACTUAL-CANDIDATES-PENDING-INDEPENDENT-FIG-VISUAL'
      : 'FIG182-STOP-AFTER-SOLE-REPAIR-FAIL-FIG183-NATIVE-PASS-PENDING-INDEPENDENT-FIG-VISUAL',
    sourceInventory: bind(path.join(owned, 'source-inventory.json')), inputPins: bind(path.join(owned, 'input-pins.json')),
    figures, textBindingStillCurrent: pins.currentText.map(pin => ({ ...pin, currentSha256: sha(pin.path),
      unchanged: sha(pin.path) === pin.sha256 })), sourceBindingStillCurrent: pins.sourceImages.map(pin => ({
      ...pin, currentSha256: sha(pin.path), unchanged: sha(pin.path) === pin.sha256 })),
    pending: ['fig-182 native d-label collision remains after its sole repair; dependent stages STOP',
      'Independent FIG/source/optical fidelity review for each figure',
      'Independent visual review at native and inherited display widths',
      'fig-182 source-right aperture versus edition-before wording resolution',
      'Affected text flow review by its existing worker', 'fig-181 missing paid output HOLD',
      'Later native finalization and full-card DISPLAY only under separate authority'],
    reviewAt1FilesWritten: 0, independentSignatures: 0, selfApproval: false, completeCardsAdded: 0,
    figuresAuthorizedOnly: ['fig-182', 'fig-183'], fig181ImagesOpened: 0, paidCalls: 0,
    previousAuthorSourceOpensClaimedAsCurrent: 0, directSVGEdits: 0, passedRendersRepeated: 0,
    canonicalWrites: 0, meterWrites: 0, indexWrites: 0, skillsWrites: 0, gitOperations: 0,
    databaseOperations: 0, backendOperations: 0, childrenCreated: 0,
    historicalFAILHOLDPreserved: true, outputPathsAreUnpublishedScratchNotDurableMetadata: true,
    imageLedger: fs.existsSync(path.join(owned, 'actual-opens.json')) ? bind(path.join(owned, 'actual-opens.json')) : null,
    authorObservations: fs.existsSync(path.join(owned, 'author-observations.json')) ? bind(path.join(owned, 'author-observations.json')) : null,
    previews: fs.existsSync(path.join(owned, 'preview-receipt.json')) ? bind(path.join(owned, 'preview-receipt.json')) : null,
  });
  console.log(JSON.stringify({ report: bind(path.join(owned, 'report.json')), figures }));
} else {
  const id = args[0], directory = id, specPath = path.join(owned, id, 'spec.json');
  const validation = nativeRun(directory, 'validation', 'python3', [validator, specPath, '--stage', 'rendered', '--json']);
  const validationReceipt = read(validation);
  if (validationReceipt.exitCode !== 0) {
    write(`${directory}/attempt.json`, { status: 'STOP-FIRST-NATIVE-VALIDATION-FAIL', validation: bind(validation),
      renderAttempted: false, allowedIdentifiedSpecRepairs: 1, repairsUsed: 0 });
  } else {
    const receipt = nativeRun(directory, 'render', 'node', [renderer, '--spec', specPath,
      '--svg', path.join(owned, id, 'figure.svg'), '--png', path.join(owned, id, 'native.png'),
      '--report', path.join(owned, id, 'render.json')]);
    const renderReceipt = read(receipt), reportPath = path.join(owned, id, 'render.json');
    write(`${directory}/attempt.json`, {
      status: renderReceipt.exitCode === 0 ? 'NATIVE-PASS-NOT-APPROVAL' : 'STOP-FIRST-NATIVE-RENDER-FAIL',
      validation: bind(validation), nativeReceipt: bind(receipt),
      nativeReport: fs.existsSync(reportPath) ? bind(reportPath) : null,
      allowedIdentifiedSpecRepairs: 1, repairsUsed: 0, noAutomaticRetries: true,
    });
  }
  console.log(JSON.stringify(read(path.join(owned, directory, 'attempt.json'))));
}
