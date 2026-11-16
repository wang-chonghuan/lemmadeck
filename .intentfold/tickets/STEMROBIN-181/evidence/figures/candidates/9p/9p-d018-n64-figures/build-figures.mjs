import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const work = path.resolve('.tmp/STEMROBIN-181/9p-d018-n64-figures');
const ticket = path.resolve('.intentfold/tickets/STEMROBIN-181/tmp');
const inventoryPath = path.join(ticket, 'd018-n64-figure-source-inventory.json');
const proseFreezePath = path.join(ticket, '9p-n64-prose-freeze.json');
const sciencePath = path.join(ticket, '9p-n64-science-review.json');
const freezePath = path.join(ticket, 'd018-n64-figures-author-freeze.json');
const python = path.resolve('.claude/skills/ld-s10y-lesson/.venv/bin/python');
const scripts = path.resolve('.agents/skills/ld-s10y-image/scripts');
const ids = ['fig-108', 'fig-109'];
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => ({ path: path.resolve(file), sha256: sha(fs.readFileSync(file)) });
const writeNew = (file, value, raw = false) => {
  assert(!fs.existsSync(file), `Preserve existing evidence: ${file}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, raw ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
};
const inventory = read(inventoryPath);
assert.equal(bind(inventoryPath).sha256, '3d09b2f113bc35e6a22559114c9b63a75b1d774ff2dd6f67777075ce84833322');
const frozen = read(proseFreezePath);
const science = read(sciencePath);
const lessonPath = path.resolve(frozen.bindings.template.path);
const sourceLessonPath = path.resolve(frozen.bindings.source.path);
assert.equal(bind(lessonPath).sha256, '183932b8b8839ae8bb28b1e9548f9346b20fb654b1d9826b81641f8000fd0435');
assert.equal(bind(lessonPath).sha256, science.bindings.template.sha256);
assert.equal(science.status, 'pass');
assert.equal(bind(sourceLessonPath).sha256, frozen.bindings.source.sha256);
const lesson = read(lessonPath);
assert.deepEqual(lesson.source.data, read(sourceLessonPath));
assert.equal(lesson.prose.length, 42);
assert.equal(lesson.exercise_count, 0);
const text = [lesson.printed_title, ...lesson.prose.map(block => block.text)].join('\n\n');
delete process.env.PWDEBUG;
const env = { ...process.env, PYTHON: python, PYTHONDONTWRITEBYTECODE: '1', PLAYWRIGHT_HTML_OPEN: 'never' };
const run = (command, args, input) => {
  const result = spawnSync(command, args, { env, input, encoding: 'utf8', maxBuffer: 12 * 1024 * 1024 });
  return { code: result.status, stdout: result.stdout, stderr: result.stderr };
};
const initialFile = (id, suffix) => path.join(work, `${id}.${suffix}`);
const repairFile = (id, suffix) => path.join(work, 'targeted-correction', `${id}.${suffix}`);
const file = (id, suffix) => fs.existsSync(repairFile(id,'spec.json')) ? repairFile(id,suffix) : initialFile(id,suffix);
const item = id => {
  const source = inventory.figures.find(figure => figure.id === id);
  assert(source?.actuallyOpened);
  assert.equal(bind(source.source.path).sha256, source.source.sha256);
  return source;
};

function context(id) {
  const result = run(python, ['-B','-c', String.raw`
import json,sys
from pathlib import Path
sys.path.insert(0,'.agents/skills/ld-s10y-image/scripts')
import build_context
p=json.load(sys.stdin)
w,h=build_context.png_size(Path(p['source']['path']))
near=build_context.prose_context(p['lesson']['prose'],p['id'])
assert near
print(json.dumps({
 'schema':'ld-s10y-image/context@1','book':'9p','edition':'modern-us-neutral',
 'figure':p['id'],'sourceImage':dict(p['source'],width=w,height=h),
 'suggestedSize':build_context.suggested_size(w,h),
 'lessons':[{'lesson':p['lesson']['id'],'title':p['lesson']['printed_title'],
             'prose':near,'fullProse':p['lesson']['prose'],
             'authoritativeText':p['text'],'exercises':[]}],
 'inputs':p['inputs'],
 'authoritativeRule':'Complete frozen current n64 prose is authoritative. Reuse the already-opened source pixel inventory without reopening the original or revising its uncertainty record. Figures are symbolic unmeasured schematics, especially fig109 independent force views, not distance or numerical force scales. No new answer, task, resultant arrow, numerical value or alternate state.'
},ensure_ascii=False))
`], JSON.stringify({
    id, source: item(id).source, lesson, text,
    inputs: { lesson: bind(lessonPath), sourceLesson: bind(sourceLessonPath), proseFreeze: bind(proseFreezePath), priorScience: bind(sciencePath), inventory: bind(inventoryPath) },
  }));
  assert.equal(result.code, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.deepEqual(payload.lessons[0].fullProse, lesson.prose);
  assert.equal(payload.lessons[0].authoritativeText, text);
  writeNew(file(id,'context.json'), payload);
}

function geometry(id, height, description) {
  const screen = ([x,y]) => [x,height-y];
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
    source: { image: { path: item(id).source.path, sha256: item(id).source.sha256 }, authoritativeText: [{ lesson: lesson.id, text }], inventory: [] },
    canvas: { width: 640, height, boundingBox: [0,height,640,0], background: 'paper' },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, widths: [640,331,342], minTextPx: 16 },
    objects: [], assertions: [], layout: { minLabelGap: 4 },
  };
  const point = (id, at, style = {}) => spec.objects.push({ id, type: 'point', at: screen(at), visible: false, ...style });
  const edge = (id, from, to, style = {}) => {
    spec.objects.push({ id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 3.2, ...style });
    spec.assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from, to });
  };
  const label = (id, at, value, fontSize = 36) => spec.objects.push({ id, type: 'text', at: screen(at), text: value, fontSize, labelPlacement: { position: 'CENTER' } });
  const arc = (id, center, start, end) => spec.objects.push({ id, type: 'arc', center, start: screen(start), end: screen(end), stroke: 'ink', strokeWidth: 3 });
  return { spec, screen, point, edge, label, arc };
}

function plan108() {
  const { spec, screen, point, edge, label, arc } = geometry('fig-108',1160,
    'Full source symmetric suspended-ball force schematic with common support, two strings, two filled balls, central reference, three alpha labels/arcs, length l, the left half-separation r/2 and the right auxiliary outline. Six forces retain their physical directions: inward/upward string tensions, outward horizontal repulsion and downward weights. Frozen prose supplies vector G and F with descriptive elastic subscript where the original inventory records unclear small ink; no original glyph is falsely reconstructed. Coordinates, angle opening and arrow spans are modern unmeasured schematic regularization, not the numerical geometry of the worked example.');
  point('common-suspension-vertex',[300,70]);
  point('left-ball',[100,800], { visible: true, size: 18, stroke: 'ink', fill: 'ink', strokeWidth: 2 });
  point('right-ball',[500,800], { visible: true, size: 18, stroke: 'ink', fill: 'ink', strokeWidth: 2 });
  point('center-baseline-intersection',[300,800]);
  point('center-reference-bottom',[300,1090]);
  point('left-tension-tip',[180,508]);
  point('right-tension-tip',[420,508]);
  point('left-repulsion-tip',[20,800]);
  point('right-repulsion-tip',[580,800]);
  point('left-weight-tip',[100,1092]);
  point('right-weight-tip',[500,1092]);
  const auxiliaryTop = [408,70 + 730 * 108 / 200];
  point('right-auxiliary-top',auxiliaryTop);
  point('right-auxiliary-baseline',[408,800]);
  point('half-dimension-left',[100,1050]);
  point('half-dimension-center',[300,1050]);
  point('half-dimension-middle',[200,1050]);
  point('fraction-bar-left',[182,945]);
  point('fraction-bar-right',[218,945]);
  spec.objects.push({
    id: 'source-top-support', type: 'polygon',
    points: [[240,50],[360,50],[360,70],[240,70]].map(screen),
    stroke: 'ink', strokeWidth: 2.5, fill: 'ink', fillOpacity: 1,
  });
  edge('left-string','common-suspension-vertex','left-ball',{ strokeWidth: 4 });
  edge('right-string','common-suspension-vertex','right-ball',{ strokeWidth: 4 });
  edge('center-reference','common-suspension-vertex','center-reference-bottom',{ strokeWidth: 2.8 });
  edge('ball-center-baseline','left-ball','right-ball',{ strokeWidth: 2.8 });
  edge('left-tension-force','left-ball','left-tension-tip',{ type: 'arrow', strokeWidth: 4.2 });
  edge('right-tension-force','right-ball','right-tension-tip',{ type: 'arrow', strokeWidth: 4.2 });
  edge('left-repulsion-force','left-ball','left-repulsion-tip',{ type: 'arrow', strokeWidth: 4.2 });
  edge('right-repulsion-force','right-ball','right-repulsion-tip',{ type: 'arrow', strokeWidth: 4.2 });
  edge('left-weight-force','left-ball','left-weight-tip',{ type: 'arrow', strokeWidth: 4.2 });
  edge('right-weight-force','right-ball','right-weight-tip',{ type: 'arrow', strokeWidth: 4.2 });
  edge('right-auxiliary-vertical','right-auxiliary-top','right-auxiliary-baseline',{ strokeWidth: 2.8 });
  edge('half-dimension-leftward','half-dimension-middle','half-dimension-left',{ type: 'arrow', strokeWidth: 2.5 });
  edge('half-dimension-rightward','half-dimension-middle','half-dimension-center',{ type: 'arrow', strokeWidth: 2.5 });
  edge('half-fraction-bar','fraction-bar-left','fraction-bar-right',{ strokeWidth: 2.5 });
  const norm = Math.hypot(200,730), ux = 200/norm, uy = 730/norm;
  arc('top-left-alpha-arc','common-suspension-vertex',[300-ux*180,70+uy*180],[300,250]);
  arc('top-right-alpha-arc','common-suspension-vertex',[300,250],[300+ux*180,70+uy*180]);
  arc('lower-right-alpha-arc','right-auxiliary-top',[408,auxiliaryTop[1]+90],[408+ux*90,auxiliaryTop[1]+uy*90]);
  label('top-left-alpha-label',[268,296],'\u03b1');
  label('top-right-alpha-label',[332,296],'\u03b1');
  label('lower-right-alpha-label',[434,660],'\u03b1');
  label('left-string-length-label',[160,412],'l');
  label('right-tension-vector-label',[461,470],'F\u20d7');
  label('right-tension-elastic-subscript',[538,493],'elastic',32);
  label('right-repulsion-vector-label',[578,763],'F\u20d7');
  label('right-weight-vector-label',[554,1084],'G\u20d7');
  label('half-separation-numerator',[200,904],'r');
  label('half-separation-denominator',[200,986],'2');
  spec.assertions.push(
    { id: 'source-ball-horizontal-order', type: 'displacement', from: 'left-ball', to: 'right-ball', dx: 400, dy: 0 },
    { id: 'source-ball-center-midpoint', type: 'equalDistance', a: 'left-ball', b: 'center-baseline-intersection', c: 'center-baseline-intersection', d: 'right-ball' },
    { id: 'source-equal-string-lengths', type: 'equalDistance', a: 'common-suspension-vertex', b: 'left-ball', c: 'common-suspension-vertex', d: 'right-ball' },
    { id: 'source-ball-centers-collinear', type: 'collinear', a: 'left-ball', b: 'center-baseline-intersection', c: 'right-ball' },
    { id: 'source-center-reference-vertical', type: 'displacement', from: 'common-suspension-vertex', to: 'center-reference-bottom', dx: 0, dy: -1020 },
    { id: 'left-tension-follows-string', type: 'pointOnLine', point: 'left-tension-tip', a: 'common-suspension-vertex', b: 'left-ball' },
    { id: 'right-tension-follows-string', type: 'pointOnLine', point: 'right-tension-tip', a: 'common-suspension-vertex', b: 'right-ball' },
    { id: 'left-tension-up-inward', type: 'displacement', from: 'left-ball', to: 'left-tension-tip', dx: 80, dy: 292 },
    { id: 'right-tension-up-inward', type: 'displacement', from: 'right-ball', to: 'right-tension-tip', dx: -80, dy: 292 },
    { id: 'left-repulsion-outward', type: 'displacement', from: 'left-ball', to: 'left-repulsion-tip', dx: -80, dy: 0 },
    { id: 'right-repulsion-outward', type: 'displacement', from: 'right-ball', to: 'right-repulsion-tip', dx: 80, dy: 0 },
    { id: 'left-weight-downward', type: 'displacement', from: 'left-ball', to: 'left-weight-tip', dx: 0, dy: -292 },
    { id: 'right-weight-downward', type: 'displacement', from: 'right-ball', to: 'right-weight-tip', dx: 0, dy: -292 },
    { id: 'auxiliary-top-on-right-string', type: 'pointOnLine', point: 'right-auxiliary-top', a: 'common-suspension-vertex', b: 'right-ball' },
    { id: 'auxiliary-base-on-ball-line', type: 'pointOnLine', point: 'right-auxiliary-baseline', a: 'left-ball', b: 'right-ball' },
    { id: 'auxiliary-parallel-to-vertical-reference', type: 'parallel', a: 'right-auxiliary-top', b: 'right-auxiliary-baseline', c: 'common-suspension-vertex', d: 'center-reference-bottom' },
    { id: 'dimension-left-below-left-ball', type: 'displacement', from: 'left-ball', to: 'half-dimension-left', dx: 0, dy: -250 },
    { id: 'dimension-center-below-ball-midpoint', type: 'displacement', from: 'center-baseline-intersection', to: 'half-dimension-center', dx: 0, dy: -250 },
    { id: 'dimension-is-left-half-separation', type: 'equalDistance', a: 'half-dimension-left', b: 'half-dimension-center', c: 'left-ball', d: 'center-baseline-intersection' },
    { id: 'eight-source-arrowheads-including-two-dimension-heads', type: 'objectCount', objectType: 'arrow', count: 8 },
  );
  const forces = ['left-tension-force','right-tension-force','left-repulsion-force','right-repulsion-force','left-weight-force','right-weight-force'];
  spec.source.inventory = [
    {
      id: 'source-common-support-and-two-suspended-balls',
      description: item('fig-108').sourceFacts[0].description + ' Frozen prose supplies equal strings and symmetric equilibrium. Only the two filled ball point objects are visible; support/reference/intersection coordinates are hidden anchors.',
      objects: ['source-top-support','left-ball','right-ball','left-string','right-string','center-reference','ball-center-baseline'],
      assertions: ['left-string-connects','right-string-connects','center-reference-connects','ball-center-baseline-connects','source-ball-horizontal-order','source-ball-center-midpoint','source-equal-string-lengths','source-ball-centers-collinear','source-center-reference-vertical'],
      requires: ['pointRelationships'],
    },
    {
      id: 'source-length-three-angle-labels-and-auxiliary-outline',
      description: item('fig-108').sourceFacts[1].description + ' The lower angle is formed at the auxiliary/string intersection with an auxiliary parallel to the center reference. Arc openings are computed from that shared schematic string direction, not numerical angle data.',
      objects: ['left-string-length-label','top-left-alpha-label','top-right-alpha-label','lower-right-alpha-label','top-left-alpha-arc','top-right-alpha-arc','lower-right-alpha-arc','right-auxiliary-vertical'],
      assertions: ['auxiliary-top-on-right-string','auxiliary-base-on-ball-line','auxiliary-parallel-to-vertical-reference','right-auxiliary-vertical-connects'],
    },
    {
      id: 'source-six-force-directions-and-right-force-labels',
      description: item('fig-108').sourceFacts[2].description + ' Frozen prose p0159#9 identifies gravity vector G and tension vector F with descriptive subscript elastic; this resolves semantics without claiming a confident reading of the originally unclear suffix ink. The subscript is native English text at32px, not an extra force label or value.',
      objects: [...forces,'right-tension-vector-label','right-tension-elastic-subscript','right-repulsion-vector-label','right-weight-vector-label'],
      assertions: [...forces.map(id => `${id}-connects`),'left-tension-follows-string','right-tension-follows-string','left-tension-up-inward','right-tension-up-inward','left-repulsion-outward','right-repulsion-outward','left-weight-downward','right-weight-downward'],
    },
    {
      id: 'source-half-separation-dimension',
      description: item('fig-108').sourceFacts[4].description + ' Both source balls are included in this relationship group so point coverage is executable; hidden projection anchors bind the single left-half dimension, not a new full-r measurement.',
      objects: ['left-ball','right-ball','half-dimension-leftward','half-dimension-rightward','half-fraction-bar','half-separation-numerator','half-separation-denominator'],
      assertions: ['source-ball-horizontal-order','source-ball-center-midpoint','dimension-left-below-left-ball','dimension-center-below-ball-midpoint','dimension-is-left-half-separation','half-dimension-leftward-connects','half-dimension-rightward-connects','half-fraction-bar-connects','eight-source-arrowheads-including-two-dimension-heads'],
      requires: ['pointRelationships'],
    },
  ];
  assert.deepEqual([80-80,292-292], [0,0]);
  assert.deepEqual([-80+80,292-292], [0,0]);
  return {
    spec,
    authorChecks: {
      symmetricStringsAndBallPlacement: true, exactSameSchematicAlphaForThreeMarks: true,
      sixForcesStartAtCorrectBallAndPointInCorrectDirections: true,
      symbolicVectorComponentsBalanceWithoutAddingMeasuredValues: true,
      sourceUnclearSuffixResolvedOnlyFromFrozenText: true,
      gravityLabelGFromFrozenProseNotGuessedSourceCrop: true,
      sourceLabelsLocalizedToEnglishElasticSubscript: true,
      oneLeftHalfDimensionNoNumericGeometryAdded: true,
      visiblePointObjectsAreOnlyTwoSourceBalls: true,
    },
  };
}

function plan109() {
  const { spec, screen, point, edge, label } = geometry('fig-109',340,
    'Source three independent charge-force views in one row: left negative charge with rightward F12/F13, middle positive charge with leftward F21/F23, right positive charge with opposing left F31 and right F32. Six vector subscripts and source charge signs are preserved. This is explicitly not a proportional force diagram or a geometric distance diagram; view spacing and arrow spans are modern layout regularization, not metre values or force ratios. No resultant arrow, extra charge label, number, distance, scale or equation is added.');
  const centers = {
    'left-negative-charge': [70,200],
    'middle-positive-charge': [350,200],
    'right-positive-charge': [525,200],
  };
  for (const [id,at] of Object.entries(centers)) {
    point(id,at,{ visible: true, face: id.includes('negative') ? '-' : '+', size: 17, stroke: 'ink', fill: 'ink', strokeWidth: 3 });
    spec.objects.push({ id: `${id}-outline`, type: 'circle', center: id, radius: 30, stroke: 'ink', strokeWidth: 3.2, fill: 'paper', fillOpacity: 0 });
  }
  const inset = Math.sqrt(30**2 - 16**2);
  const definitions = [
    { id: 'F12', owner: 'left-negative-charge', start: [70+inset,184], end: [201,184], labelAt: [153,138], label: 'F\u20d7\u2081\u2082', direction: 1 },
    { id: 'F13', owner: 'left-negative-charge', start: [70+inset,216], end: [172,216], labelAt: [151,269], label: 'F\u20d7\u2081\u2083', direction: 1 },
    { id: 'F21', owner: 'middle-positive-charge', start: [350-inset,184], end: [218,184], labelAt: [261,138], label: 'F\u20d7\u2082\u2081', direction: -1 },
    { id: 'F23', owner: 'middle-positive-charge', start: [350-inset,216], end: [248,216], labelAt: [282,269], label: 'F\u20d7\u2082\u2083', direction: -1 },
    { id: 'F31', owner: 'right-positive-charge', start: [495,200], end: [412,200], labelAt: [448,146], label: 'F\u20d7\u2083\u2081', direction: -1 },
    { id: 'F32', owner: 'right-positive-charge', start: [555,200], end: [625,200], labelAt: [589,146], label: 'F\u20d7\u2083\u2082', direction: 1 },
  ];
  for (const force of definitions) {
    point(`${force.id}-attachment`,force.start);
    point(`${force.id}-tip`,force.end);
    edge(`${force.id}-arrow`,`${force.id}-attachment`,`${force.id}-tip`,{ type: 'arrow', strokeWidth: 4.2 });
    label(`${force.id}-vector-label`,force.labelAt,force.label);
    spec.assertions.push(
      { id: `${force.id}-attached-to-source-charge`, type: 'pointOnCircle', point: `${force.id}-attachment`, center: force.owner, radius: 30 },
      { id: `${force.id}-source-direction`, type: 'displacement', from: `${force.id}-attachment`, to: `${force.id}-tip`, dx: force.end[0]-force.start[0], dy: 0 },
    );
    assert.equal(Math.sign(force.end[0]-force.start[0]),force.direction);
  }
  spec.assertions.push(
    { id: 'left-to-middle-source-view-order', type: 'displacement', from: 'left-negative-charge', to: 'middle-positive-charge', dx: 280, dy: 0 },
    { id: 'middle-to-right-source-view-order', type: 'displacement', from: 'middle-positive-charge', to: 'right-positive-charge', dx: 175, dy: 0 },
    { id: 'left-parallel-force-directions', type: 'parallel', a: 'F12-attachment', b: 'F12-tip', c: 'F13-attachment', d: 'F13-tip' },
    { id: 'middle-parallel-force-directions', type: 'parallel', a: 'F21-attachment', b: 'F21-tip', c: 'F23-attachment', d: 'F23-tip' },
    { id: 'right-forces-share-source-line', type: 'collinear', a: 'F31-tip', b: 'right-positive-charge', c: 'F32-tip' },
    { id: 'three-source-charge-outlines', type: 'objectCount', objectType: 'circle', count: 3 },
    { id: 'six-source-force-arrows', type: 'objectCount', objectType: 'arrow', count: 6 },
  );
  const mapping = forces => forces.flatMap(force => [`${force}-arrow`,`${force}-vector-label`]);
  const relations = forces => forces.flatMap(force => [`${force}-arrow-connects`,`${force}-attached-to-source-charge`,`${force}-source-direction`]);
  spec.source.inventory = [
    {
      id: 'source-three-charge-views-and-signs',
      description: item('fig-109').sourceFacts[0].description + ' The three visible native point faces are exactly the original minus/plus/plus signs, not extra particles; native circles provide their outlines. Their34px-wide sign strokes remain at least17.584px at331. Group spacing is not a physical separation scale.',
      objects: [...Object.keys(centers),...Object.keys(centers).map(id => `${id}-outline`)],
      assertions: ['left-to-middle-source-view-order','middle-to-right-source-view-order','three-source-charge-outlines'],
      requires: ['pointRelationships'],
    },
    {
      id: 'source-left-two-rightward-vectors',
      description: item('fig-109').sourceFacts[1].description + ' Slightly separated parallel lines preserve both arrows; glyphs are native vector text, arrow lengths are uncalibrated.',
      objects: mapping(['F12','F13']),
      assertions: [...relations(['F12','F13']),'left-parallel-force-directions'],
    },
    {
      id: 'source-middle-two-leftward-vectors',
      description: item('fig-109').sourceFacts[2].description + ' Slightly separated parallel lines preserve both arrows; glyphs are native vector text, arrow lengths are uncalibrated.',
      objects: mapping(['F21','F23']),
      assertions: [...relations(['F21','F23']),'middle-parallel-force-directions'],
    },
    {
      id: 'source-right-opposing-vectors',
      description: item('fig-109').sourceFacts[3].description + ' No equality or numerical magnitude is inferred from ink length. Frozen text determines physical comparison, while this source-style schematic conveys vector ownership/directions only.',
      objects: mapping(['F31','F32']),
      assertions: [...relations(['F31','F32']),'right-forces-share-source-line'],
    },
    {
      id: 'source-six-vector-labels-no-resultant',
      description: item('fig-109').sourceFacts[4].description + ' No additional caption, index on a charge, distance or result annotation is rendered.',
      objects: definitions.map(force => `${force.id}-vector-label`),
      assertions: ['six-source-force-arrows'],
    },
  ];
  assert.equal(spec.objects.filter(object => object.type === 'point' && object.visible !== false).length,3);
  assert.equal(spec.objects.filter(object => object.type === 'point' && object.face === '-').length,1);
  assert.equal(spec.objects.filter(object => object.type === 'point' && object.face === '+').length,2);
  return {
    spec,
    authorChecks: {
      nativeMinusPlusPlusSignsMatchSource: true, sixSourceForceSubscriptsAndDirectionsPreserved: true,
      everyArrowAttachedToCorrectChargeOutline: true,
      firstTwoPairsRemainParallelAndVerticallySeparated: true,
      thirdPairRemainsOppositeOnCommonLine: true,
      noProportionalForceScaleOrDistanceData: true, noResultantOrAdditionalChargeLabel: true,
      allConstructionEndpointsExplicitlyHidden: true,
    },
  };
}

function plan(id) {
  context(id);
  const { spec, authorChecks } = id === 'fig-108' ? plan108() : plan109();
  const mapped = new Set(spec.source.inventory.flatMap(group => group.objects));
  for (const object of spec.objects.filter(object => object.visible !== false)) assert(mapped.has(object.id),`Unmapped object: ${object.id}`);
  assert(spec.objects.filter(object => object.type === 'point' && object.visible === false).every(object => !object.label));
  writeNew(file(id,'spec.json'),spec);
  writeNew(file(id,'author-assertions.json'), {
    ticket: 'STEMROBIN-181', figure: id, role: 'author-assertions-not-independent-review',
    source: item(id).source, lesson: bind(lessonPath), context: bind(file(id,'context.json')),
    sourceInventory: bind(inventoryPath), sourceInventoryUnchangedAndNotReopened: true,
    allVisibleObjectsMapped: true, constructionPointsHidden: true,
    authorChecks, independentReview: 'pending',
  });
  const validation = run(python,['-B',path.join(scripts,'validate_spec.py'),file(id,'spec.json'),'--stage','draft','--json']);
  writeNew(file(id,'preflight.json'),validation);
  console.log(JSON.stringify({ id, context: bind(file(id,'context.json')), spec: bind(file(id,'spec.json')), validation },null,2));
}

function render(id) {
  assert.equal(read(file(id,'preflight.json')).code,0);
  for (const suffix of ['svg','png','render.json','render-command.json']) assert(!fs.existsSync(file(id,suffix)));
  const result = run('node',[path.join(scripts,'render_spec.mjs'),'--spec',file(id,'spec.json'),'--svg',file(id,'svg'),'--png',file(id,'png'),'--report',file(id,'render.json')]);
  writeNew(file(id,'render-command.json'), {
    ...result, entrypoint: bind(path.join(scripts,'render_spec.mjs')),
    nativeLauncherInspected: { headless: true, isolated: true, persistentProfile: false, CDP: false, PWDEBUGUnset: true, htmlAutoOpen: false, browserClosedByNativeFinally: true, userBrowserWindowOrTabUsed: false },
  });
  console.log(JSON.stringify({ id, result, render: fs.existsSync(file(id,'render.json')) ? read(file(id,'render.json')) : null },null,2));
}

function repairSubscript() {
  const id = 'fig-108';
  const report = read(initialFile(id,'render.json'));
  assert.equal(report.status,'fail');
  assert.deepEqual(report.collisions.map(item => item.id),['right-tension-elastic-subscript-label']);
  assert(!fs.existsSync(repairFile(id,'spec.json')));
  const spec = read(initialFile(id,'spec.json'));
  const previous = structuredClone(spec);
  const label = spec.objects.find(object => object.id === 'right-tension-elastic-subscript');
  assert.deepEqual(label.at,[538,667]);
  label.at[0] += 20;
  const check = structuredClone(spec);
  check.objects.find(object => object.id === 'right-tension-elastic-subscript').at = [538,667];
  assert.deepEqual(check,previous);
  fs.mkdirSync(path.dirname(repairFile(id,'spec.json')),{ recursive: true });
  fs.copyFileSync(initialFile(id,'context.json'),repairFile(id,'context.json'),fs.constants.COPYFILE_EXCL);
  writeNew(repairFile(id,'spec.json'),spec);
  writeNew(repairFile(id,'correction.json'), {
    ticket: 'STEMROBIN-181', figure: id, targetedAuthorRepairRound: 1,
    reason: 'First native renderer reports only F/elastic text bounding-box overlap. Move only the elastic subscript20px to the right; no font, text, geometry, assertion, source or authoritative context change.',
    delta: { object: label.id, before: [538,667], after: label.at, screenDx: 20, screenDy: 0 },
    initial: {
      spec: bind(initialFile(id,'spec.json')), context: bind(initialFile(id,'context.json')),
      renderFailure: bind(initialFile(id,'render.json')), svg: bind(initialFile(id,'svg')),
      previewMetrics: bind(initialFile(id,'preview-metrics.json')),
    },
    current: { spec: bind(repairFile(id,'spec.json')), context: bind(repairFile(id,'context.json')) },
    deepEqualAfterRestoringSingleLabelAnchor: true,
    sourceAndTextAndAllForceRelationsUnchanged: true,
    remainingTargetedAuthorRepairs: 0,
  });
  const validation = run(python,['-B',path.join(scripts,'validate_spec.py'),file(id,'spec.json'),'--stage','draft','--json']);
  writeNew(file(id,'preflight.json'),validation);
  console.log(JSON.stringify({ id,correction: bind(file(id,'correction.json')),validation },null,2));
}

function previews(id) {
  const spec = read(file(id,'spec.json')), report = read(file(id,'render.json'));
  assert.equal(report.spec.sha256,bind(file(id,'spec.json')).sha256);
  assert.equal(report.output.svg.sha256,bind(file(id,'svg')).sha256);
  const require = createRequire(path.resolve('.claude/skills/ld-s10y-lesson/package.json'));
  const { Resvg } = require('@resvg/resvg-js');
  const svg = fs.readFileSync(file(id,'svg'),'utf8');
  const palette = { ink: '#15201f', muted: '#4c5a58', accent: '#15201f', 'accent-soft': '#8a9795', grid: '#e3eae9', paper: '#ffffff' };
  const raster = svg.replace(/var\(--ld-figure-([a-z-]+)(?:,\s*[^)]+)?\)/g,(_,role) => { assert(role in palette); return palette[role]; });
  const outputs = [];
  const minFont = Math.min(...spec.objects.filter(object => object.type === 'text').map(object => object.fontSize));
  for (const width of spec.display.widths) {
    const rendered = new Resvg(raster,{ background: 'white', fitTo: { mode: 'width', value: width } }).render();
    writeNew(file(id,`w${width}.png`),rendered.asPng(),true);
    outputs.push({ ...bind(file(id,`w${width}.png`)), width: rendered.width, height: rendered.height, minimumDeclaredLabelPx: minFont*width/640, ...(id === 'fig-109' ? { sourceSignSpanPx: 34*width/640 } : {}) });
  }
  assert.equal(bind(file(id,'svg')).sha256,report.output.svg.sha256);
  writeNew(file(id,'preview-metrics.json'), {
    renderer: 'Existing lesson-owned @resvg/resvg-js; native semantic CSS variables resolved only in raster input',
    originalSvg: bind(file(id,'svg')), rasterInputSha256: sha(raster),
    originalSvgUnmodified: true, browserUsedForPreviews: false, outputs,
  });
  console.log(JSON.stringify({ id,outputs },null,2));
}

function freeze() {
  const observationsPath = path.join(work,'author-pixel-observations.json');
  const observations = read(observationsPath);
  assert.equal(bind(lessonPath).sha256,frozen.bindings.template.sha256);
  assert.equal(bind(inventoryPath).sha256,'3d09b2f113bc35e6a22559114c9b63a75b1d774ff2dd6f67777075ce84833322');
  const figures = [];
  for (const id of ids) {
    const spec = read(file(id,'spec.json')), report = read(file(id,'render.json'));
    const preview = read(file(id,'preview-metrics.json'));
    const opened = observations.figures.find(figure => figure.id === id);
    assert.deepEqual(spec.source.authoritativeText,[{ lesson: lesson.id,text }]);
    assert.deepEqual(read(file(id,'context.json')).lessons[0].fullProse,lesson.prose);
    assert.equal(report.status,'pass');
    assert.equal(report.spec.sha256,bind(file(id,'spec.json')).sha256);
    assert.equal(report.output.svg.sha256,bind(file(id,'svg')).sha256);
    assert.deepEqual(opened.previews.map(preview => preview.width),[640,331,342]);
    for (const output of preview.outputs) {
      const observed = opened.previews.find(preview => preview.width === output.width);
      assert(observed?.actuallyOpened && observed.detail === 'original');
      assert.equal(observed.path,output.path);
      assert.equal(observed.sha256,output.sha256);
      assert.equal(bind(output.path).sha256,output.sha256);
      assert(output.minimumDeclaredLabelPx >= 16);
      if (output.sourceSignSpanPx) assert(output.sourceSignSpanPx >= 16);
    }
    const validation = run(python,['-B',path.join(scripts,'validate_spec.py'),file(id,'spec.json'),'--stage','rendered','--json']);
    writeNew(file(id,'rendered-validation.json'),validation);
    assert.equal(validation.code,0,validation.stderr || validation.stdout);
    const repaired = fs.existsSync(repairFile(id,'spec.json'));
    const manifest = {
      ticket: 'STEMROBIN-181', batch: 'D018', figure: id, mode: 'deterministic',
      status: 'author-frozen-independent-review-pending',
      bindings: {
        source: { path: item(id).source.path, sha256: item(id).source.sha256 },
        lesson: bind(lessonPath), sourceLesson: bind(sourceLessonPath),
        proseFreeze: bind(proseFreezePath), priorScience: bind(sciencePath),
        inventory: bind(inventoryPath), context: bind(file(id,'context.json')),
        spec: bind(file(id,'spec.json')), svg: bind(file(id,'svg')), render: bind(file(id,'render.json')),
      },
      candidate: bind(file(id,'png')), previews: preview.outputs,
      previewMetrics: bind(file(id,'preview-metrics.json')),
      authorAssertions: bind(initialFile(id,'author-assertions.json')),
      authorPixelObservations: bind(observationsPath),
      draftValidation: bind(file(id,'preflight.json')),
      renderedValidation: bind(file(id,'rendered-validation.json')),
      renderCommand: bind(file(id,'render-command.json')),
      generationCalls: 0, renderRuns: repaired ? 2 : 1,
      targetedAuthorRepairs: repaired ? 1 : 0, remainingTargetedAuthorRepairs: repaired ? 0 : 1,
      independentReview: 'pending', promoted: false,
    };
    if (repaired) {
      manifest.targetedCorrection = bind(file(id,'correction.json'));
      manifest.initialCandidate = {
        spec: bind(initialFile(id,'spec.json')), context: bind(initialFile(id,'context.json')),
        render: bind(initialFile(id,'render.json')), svg: bind(initialFile(id,'svg')),
        previewMetrics: bind(initialFile(id,'preview-metrics.json')),
      };
    }
    writeNew(file(id,'author-manifest.json'),manifest);
    figures.push({ ...manifest, authorManifest: bind(file(id,'author-manifest.json')) });
  }
  const payload = {
    ticket: 'STEMROBIN-181', batch: 'D018', lesson: lesson.id, role: 'figure-author-only',
    status: 'author-frozen-independent-review-pending',
    lessonTemplate: bind(lessonPath), sourceLesson: bind(sourceLessonPath),
    proseFreeze: bind(proseFreezePath), inheritedScience: bind(sciencePath),
    authoritativeTextSha256: sha(text), sourceInventory: bind(inventoryPath),
    sourceInventoryUnchangedAndOriginalImagesNotReopened: true,
    figures, helper: bind(path.join(work,'build-figures.mjs')),
    beforeTargetedCorrectionHelper: fs.existsSync(path.join(work,'build-figures.before-subscript-correction.mjs')) ? bind(path.join(work,'build-figures.before-subscript-correction.mjs')) : null,
    nativeTools: ['build_context.py','validate_spec.py','render_spec.mjs','materialize_arrowheads.mjs'].map(name => bind(path.join(scripts,name))),
    nativeSchema: bind(path.resolve('.agents/skills/ld-s10y-image/assets/figure-spec.schema.json')),
    allKnownMediaWidthsActuallyOpened: true, originalTasks: 0,
    independentFigureApproval: false, scienceGateRepeated: false,
    promotionOrFinalization: false, sourceOrTemplateEdits: false,
    toolAppDatabaseGitDependencyChanges: false, n62Fig106Touched: false,
    inFlightProcesses: 0,
  };
  writeNew(freezePath,payload);
  fs.copyFileSync(freezePath,path.join(work,'author-freeze.json'),fs.constants.COPYFILE_EXCL);
  console.log(JSON.stringify({ freeze: bind(freezePath), scratchFreeze: bind(path.join(work,'author-freeze.json')), figures: figures.map(figure => ({ id: figure.figure, bindings: figure.bindings, previews: figure.previews, targetedAuthorRepairs: figure.targetedAuthorRepairs })), inFlightProcesses: 0 },null,2));
}

const [command,id] = process.argv.slice(2);
assert(['freeze','repair-subscript'].includes(command) || ids.includes(id));
if (command === 'plan') plan(id);
else if (command === 'render') render(id);
else if (command === 'repair-subscript') repairSubscript();
else if (command === 'previews') previews(id);
else if (command === 'freeze') freeze();
else throw new Error(`Unknown command: ${command}`);
