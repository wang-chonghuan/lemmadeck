import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const evidenceRoot = path.dirname(fileURLToPath(import.meta.url));
const authorRoot = path.join(evidenceRoot, '../d045-10p-fig6971-author');
const freezePath = path.join(authorRoot, 'author-freeze.json');
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const binding = file => ({ path: path.resolve(file), sha256: hash(file) });
const expectedFreeze = '562f488fc55d447c7316f637dafba1790f723ad125ca5b8c3b4c091792093e7b';
assert.equal(hash(freezePath), expectedFreeze);
const freeze = load(freezePath);
const checked = new Map();
const failures = [];
function verifyBindings(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    const file = path.resolve(value.path);
    assert.equal(hash(file), value.sha256, `Stale binding: ${file}`);
    checked.set(file, value.sha256);
  }
  for (const child of Object.values(value)) verifyBindings(child);
}
verifyBindings(freeze);
const near = (a, b, message) => assert.ok(Math.abs(a - b) < 0.00002, message);
const pointRefs = assertion => ['from', 'to', 'a', 'b', 'c', 'd', 'point', 'center']
  .map(key => assertion[key]).filter(value => typeof value === 'string');
const figures = [];
for (const frozen of freeze.figures) {
  try {
    const spec = load(frozen.spec.path);
    const render = load(frozen.render.path);
    const width = load(frozen.actualWidthCheck.path);
    verifyBindings(width);
    const objects = new Map(spec.objects.map(object => [object.id, object]));
    const assertions = new Map(spec.assertions.map(item => [item.id, item]));
    const prefix = frozen.figure === 'fig-69' ? 'fig69' : 'fig71';
    const xy = ref => Array.isArray(ref) ? ref : objects.get(ref).at;
    assert.equal(objects.size, spec.objects.length);
    assert.equal(assertions.size, spec.assertions.length);
    assert.equal(render.status, 'pass');
    assert.equal(render.spec.sha256, frozen.spec.sha256);
    assert.equal(render.output.svg.sha256, frozen.svg.sha256);
    assert.deepEqual(render.collisions, []);
    assert.equal(spec.display.purpose, 'instructional');
    assert.equal(spec.display.layout, 'scroll');
    assert.deepEqual(spec.display.widths, [640, 1100]);
    assert.ok(render.displayChecks.every(item => item.status === 'pass'
      && item.measuredMinPx >= 16 && item.failures.length === 0));

    for (const group of spec.source.inventory) {
      assert.ok(group.objects.every(id => objects.has(id)), group.id);
      assert.ok(group.assertions.every(id => assertions.has(id)), group.id);
      if (!group.requires?.includes('pointRelationships')) continue;
      const mappedPoints = group.objects.filter(id => objects.get(id).type === 'point');
      for (const id of mappedPoints) {
        assert.ok(group.assertions.some(assertionId => {
          const item = assertions.get(assertionId);
          const refs = pointRefs(item);
          return item.type !== 'objectCount' && refs.includes(id)
            && refs.length >= 2 && refs.every(ref => group.objects.includes(ref));
        }), `Uncovered point ${id} in ${group.id}`);
      }
    }
    for (const item of spec.assertions) {
      if (item.type === 'displacement') {
        const from = xy(item.from);
        const to = xy(item.to);
        near(to[0] - from[0], item.dx, item.id);
        near(to[1] - from[1], item.dy, item.id);
      } else if (item.type === 'connects') {
        const edge = objects.get(item.arrow);
        assert.deepEqual(edge.from, item.from, item.id);
        assert.deepEqual(edge.to, item.to, item.id);
      } else if (item.type === 'equalDistance') {
        const distance = (a, b) => Math.hypot(xy(b)[0] - xy(a)[0], xy(b)[1] - xy(a)[1]);
        near(distance(item.a, item.b), distance(item.c, item.d), item.id);
      } else if (item.type === 'objectCount') {
        assert.equal(spec.objects.filter(object => object.type === item.objectType).length, item.count);
      } else {
        throw new Error(`Unexpected unchecked assertion type ${item.type}`);
      }
    }
    const upper = Array.from({ length: 18 }, (_, index) => objects.get(`${prefix}-a-ball-${index + 1}`));
    assert.equal(spec.objects.filter(object => object.id.includes('-a-ball-')).length, 18);
    for (let i = 1; i <= 18; i++) {
      const ball = objects.get(`${prefix}-a-ball-${i}`);
      assert.notEqual(ball.visible, false);
      const label = objects.get(`${prefix}-number-${i}`);
      assert.equal(label.text, String(i));
      near(label.at[0], ball.at[0], `Number ${i} identity`);
      assert.ok(label.at[1] < ball.at[1]);
      for (let side = 1; side <= 2; side++) {
        const thread = objects.get(`${prefix}-thread-${i}-${side}`);
        assert.equal(thread.to, ball.id);
      }
      if (i < 18) {
        near(upper[i].at[0] - ball.at[0], upper[1].at[0] - upper[0].at[0], `Upper gap ${i}`);
        near(upper[i].at[1], ball.at[1], `Upper row ${i}`);
        const coil = Array.from({ length: 15 }, (_, index) => objects.get(`${prefix}-spring-${i}-coil-${index}`));
        assert.ok(coil.every(Boolean));
        assert.equal(coil[0].from, ball.id);
        assert.equal(coil.at(-1).to, upper[i].id);
        for (let segment = 1; segment < coil.length; segment++) {
          assert.deepEqual(coil[segment].from, coil[segment - 1].to, `Spring ${i} continuity`);
        }
      }
    }
    assert.equal(spec.objects.filter(object => object.id.includes('-thread-')).length, 36);
    assert.equal(spec.objects.filter(object => object.id.includes('-coil-')).length, 255);
    const expectedLabels = frozen.figure === 'fig-69'
      ? Array.from({ length: 18 }, (_, i) => String(i + 1))
      : [...Array.from({ length: 18 }, (_, i) => String(i + 1)), 'a', 'b', '\u03bb'];
    assert.deepEqual(spec.objects.filter(object => object.type === 'text').map(object => object.text), expectedLabels);
    assert.equal(spec.objects.filter(object => object.type === 'grid' || object.type === 'svgPath').length, 0);
    const offsets = [];
    const gaps = [];
    const repeats = [];
    if (frozen.figure === 'fig-71') {
      const sourceSigns = [1, 1, 1, 0, -1, -1, -1, -1, -1, 0, 1, 1, 1, 1, 1, 0, -1, -1];
      assert.equal(spec.objects.filter(object => object.id.includes('-b-ball-')).length, 18);
      assert.equal(spec.objects.filter(object => object.id.includes('-equilibrium-mark-')).length, 18);
      for (let i = 1; i <= 18; i++) {
        const lower = objects.get(`fig71-b-ball-${i}`);
        assert.notEqual(lower.visible, false);
        near(lower.at[1], 145, `Lower row ${i}`);
        const mark = objects.get(`fig71-equilibrium-mark-${i}`);
        near(mark.from[0], upper[i - 1].at[0], `Reference ${i}`);
        near(mark.to[0], upper[i - 1].at[0], `Reference ${i}`);
        const offset = lower.at[0] - upper[i - 1].at[0];
        const sign = Math.abs(offset) < 3 ? 0 : Math.sign(offset);
        assert.equal(sign, sourceSigns[i - 1], `Independent pixel direction ${i}`);
        offsets.push({ particle: i, dx: offset, qualitativeSourceDirection: sign, assertion: `fig71-source-longitudinal-displacement-${i}` });
        if (i < 18) {
          const next = objects.get(`fig71-b-ball-${i + 1}`);
          gaps.push({ from: i, to: i + 1, dx: next.at[0] - lower.at[0] });
          assert.ok(next.at[0] > lower.at[0]);
        }
        if (i <= 6) {
          const repeated = objects.get(`fig71-b-ball-${i + 12}`);
          near(repeated.at[0] - upper[i + 11].at[0], offset, `Same offset ${i}/${i + 12}`);
          repeats.push({ from: i, to: i + 12, distance: repeated.at[0] - lower.at[0], assertion: `fig71-given-repeat-${i}-${i + 12}` });
        }
      }
      const right = objects.get('fig71-lambda-arrow-right');
      const left = objects.get('fig71-lambda-arrow-left');
      assert.deepEqual(right.from, left.to);
      assert.deepEqual(right.to, left.from);
      near(right.to[0] - right.from[0], 12 * (upper[1].at[0] - upper[0].at[0]), '12 equilibrium intervals');
      near(right.from[0], objects.get('fig71-b-ball-4').at[0], 'Lambda start ball 4');
      near(right.to[0], objects.get('fig71-b-ball-16').at[0], 'Lambda end ball 16');
      assert.equal(spec.objects.filter(object => object.type === 'arrow').length, 2);
    } else {
      assert.equal(spec.objects.filter(object => object.type === 'arrow').length, 0);
    }

    const contexts = [];
    for (const language of ['en', 'zh']) {
      const contextPath = path.join(authorRoot, 'inputs/current', frozen.figure, language, 'full-context.json');
      const context = load(contextPath);
      for (const lesson of context.authoritativeLessons) {
        verifyBindings(lesson.lessonBinding);
        verifyBindings(lesson.exerciseBinding);
        verifyBindings(lesson.proseBinding);
        const prose = fs.readFileSync(lesson.proseBinding.path, 'utf8');
        assert.equal(prose, lesson.completeText);
        assert.ok(spec.source.authoritativeText.some(item => !item.exercise && item.lesson === lesson.card && item.text === prose));
        for (const exercise of lesson.exercises.exercises) {
          assert.ok(spec.source.authoritativeText.some(item => item.lesson === lesson.card
            && item.exercise === exercise.number && item.text === exercise.text));
        }
        contexts.push({ language, card: lesson.card, prose: lesson.proseBinding, questions: lesson.exercises.count });
      }
    }
    assert.equal(width.status, 'PASS');
    assert.equal(width.headed, true);
    assert.equal(width.cssSource.sha256, hash(width.cssSource.path));
    const fixture = fs.readFileSync(width.fixture.path, 'utf8');
    const css = fs.readFileSync(width.cssSource.path, 'utf8');
    for (const selector of width.extractedSelectors) {
      const start = css.indexOf(`${selector} {`);
      assert.ok(start >= 0, selector);
      const block = css.slice(start, css.indexOf('}', start) + 1);
      assert.ok(fixture.includes(block), `Non-verbatim CSS ${selector}`);
    }
    const surfaces = width.observations.map(observation => {
      assert.equal(observation.status, 'PASS');
      assert.equal(observation.mediaWidth, 640);
      assert.equal(observation.pageOverflow, false);
      assert.deepEqual(observation.overlaps, []);
      assert.ok(observation.entities.every(entity => entity.present));
      assert.equal(observation.labels.length, expectedLabels.length);
      assert.ok(observation.labels.every(label => label.fontPx >= 16 && !label.clippedBySvg));
      assert.equal(observation.scrollEnd.lastBallReachable, true);
      assert.equal(observation.scrollEnd.scrollLeft, observation.scrollEnd.max);
      if (observation.surface === 'mobile') {
        assert.equal(observation.scrollEnd.max, 324);
        assert.equal(observation.hostWidth, 316);
        verifyBindings(observation.startPreview);
        verifyBindings(observation.endPreview);
      }
      return {
        surface: observation.surface, viewport: observation.viewport,
        mediaWidth: observation.mediaWidth, hostWidth: observation.hostWidth,
        minTransformedFontPx: Math.min(...observation.labels.map(label => label.fontPx)),
        scrollEnd: observation.scrollEnd, screenshots: [observation.startPreview, observation.endPreview].filter(Boolean)
      };
    });
    figures.push({
      figure: frozen.figure, status: 'PASS', bindings: frozen,
      sourceInventoryMapped: true, pointRelationshipGroupsChecked: spec.source.inventory.filter(group => group.requires?.includes('pointRelationships')).length,
      assertionCountChecked: spec.assertions.length,
      particleRows: frozen.figure === 'fig-69' ? 1 : 2, particlesPerRow: 18,
      threads: 36, springConnections: 17, lowerOffsets: offsets, lowerGaps: gaps,
      sameDisplacementPairs: repeats, contexts, surfaces,
      velocityArrows: 0, timeLabels: 0, gridDimensions: 'not applicable: no source lattice/grid',
      sinusoidAssumed: false, rendererInvocations: 0
    });
  } catch (error) {
    failures.push({ figure: frozen.figure, message: error.message });
  }
}
const result = {
  schema: 'independent-figure-binding-and-geometry-check@1',
  status: failures.length ? 'FAIL' : 'PASS',
  freeze: binding(freezePath),
  independentSourceInventory: binding(path.join(evidenceRoot, 'independent-source-inventory.json')),
  checkedBindings: [...checked].map(([file, sha256]) => ({ path: file, sha256 })),
  figures, failures, rendererInvocations: 0, imageDecodesOrOpens: 0,
  scope: 'Read-only geometry, current text, and existing render/width receipts. Not full-card or production acceptance.'
};
fs.writeFileSync(path.join(evidenceRoot, 'binding-and-geometry-check.json'), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({ status: result.status, checkedBindings: checked.size, figures: figures.map(item => ({ figure: item.figure, assertions: item.assertionCountChecked, minFontPx: item.surfaces[0].minTransformedFontPx })), failures }, null, 2));
if (failures.length) process.exitCode = 1;
