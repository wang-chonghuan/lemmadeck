import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const work = path.resolve('.tmp/STEMROBIN-181/9p-d018-n62-figures');
const ticket = path.resolve('.intentfold/tickets/STEMROBIN-181/tmp');
const inventoryPath = path.join(ticket, 'd018-n62-figure-source-inventory.json');
const proseFreezePath = path.join(ticket, '9p-n62-prose-freeze.json');
const freezePath = path.join(ticket, 'd018-n62-figures-author-freeze.json');
const python = path.resolve('.claude/skills/ld-s10y-lesson/.venv/bin/python');
const scripts = path.resolve('.agents/skills/ld-s10y-image/scripts');
const ids = ['tbl-p0153-01', 'fig-106', 'fig-107'];
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => ({ path: path.resolve(file), sha256: sha(fs.readFileSync(file)) });
const writeNew = (file, data, raw = false) => {
  assert(!fs.existsSync(file), `Preserve existing evidence: ${file}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, raw ? data : `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
};
const inventory = read(inventoryPath);
const frozen = read(proseFreezePath);
const lessonPath = frozen.bindings.template.path;
const lesson = read(lessonPath);
assert.deepEqual(bind(lessonPath), frozen.bindings.template);
assert.deepEqual(bind(lessonPath), inventory.lesson);
assert.deepEqual(bind(proseFreezePath), inventory.proseFreeze);
assert.deepEqual(bind(frozen.bindings.source.path), inventory.sourceLesson);
assert.deepEqual(lesson.source.data, read(frozen.bindings.source.path));
assert.equal(lesson.exercise_count, 0);
const text = [lesson.printed_title, ...lesson.prose.map(block => block.text)].join('\n\n');
delete process.env.PWDEBUG;
const env = { ...process.env, PYTHON: python, PYTHONDONTWRITEBYTECODE: '1', PLAYWRIGHT_HTML_OPEN: 'never' };
const run = (command, args, input) => {
  const result = spawnSync(command, args, { env, input, encoding: 'utf8', maxBuffer: 12 * 1024 * 1024 });
  return { code: result.status, stdout: result.stdout, stderr: result.stderr };
};
const file = (id, suffix) => path.join(work, `${id}.${suffix}`);
const sourceItem = id => {
  const item = inventory.figures.find(item => item.id === id);
  assert(item?.actuallyOpened);
  assert.equal(bind(item.source.path).sha256, item.source.sha256);
  return item;
};

function context(id) {
  const source = sourceItem(id).source;
  const result = run(python, ['-B', '-c', String.raw`
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
 'authoritativeRule':'Complete frozen current n62 prose overrides source pixels. Original PNG provides portrait or apparatus/charge-pair structure, not new readings, exact unmeasured geometry, charge values, historical dates or answers.'
},ensure_ascii=False))
`], JSON.stringify({
    id, source, lesson, text,
    inputs: { lesson: bind(lessonPath), proseFreeze: bind(proseFreezePath), sourceLesson: inventory.sourceLesson, inventory: bind(inventoryPath) },
  }));
  assert.equal(result.code, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.deepEqual(payload.lessons[0].fullProse, lesson.prose);
  assert.equal(payload.lessons[0].authoritativeText, text);
  writeNew(file(id, 'context.json'), payload);
}

function base(id, height, description, coordinates = {}) {
  const source = sourceItem(id).source;
  const screen = ([x, y]) => [x, height - y];
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
    source: { image: { path: source.path, sha256: source.sha256 }, authoritativeText: [{ lesson: lesson.id, text }], inventory: [] },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper' },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, widths: [640, 331, 342], minTextPx: 16 },
    objects: [], assertions: [], layout: { minLabelGap: 5 },
  };
  for (const [id, at] of Object.entries(coordinates)) spec.objects.push({ id, type: 'point', at: screen(at), visible: false });
  const edge = (id, from, to, style = {}) => {
    spec.objects.push({ id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 4, ...style });
    spec.assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from, to });
  };
  const label = (id, at, value) => spec.objects.push({ id, type: 'text', at: screen(at), text: value, fontSize: 34, labelPlacement: { position: 'CENTER' } });
  const curve = (id, d, style = {}) => spec.objects.push({ id, type: 'svgPath', d, stroke: 'ink', strokeWidth: 4, ...style });
  const circle = (id, center, radius, style = {}) => spec.objects.push({ id, type: 'circle', center, radius, stroke: 'ink', strokeWidth: 4, ...style });
  return { spec, screen, edge, label, curve, circle };
}

function plan106() {
  const { spec, edge, label, curve, circle } = base('fig-106', 1380,
    'Full source torsion-balance apparatus: enclosure/lid, suspension tube, top adjusting controls, slanted lid port, wire B, glass rod A with metal sphere a and opposite open counterweight c, separate lid-supported metal sphere b, and unnumbered front graduation band. All projected contour dimensions, tilt, graduation spacing/count and coordinate anchors are modern unmeasured schematic regularization. No angle reading, force arrow, charge sign or extra experimental state.',
    {
      'lid-suspension-junction': [340, 738], 'suspension-pivot': [340, 971],
      'sphere-a-center': [200, 982], 'counterweight-c-center': [480, 960],
      'lid-fixed-support': [164, 713], 'sphere-b-center': [173, 934],
      'lower-spindle-tip': [340, 1015],
    });
  curve('enclosure-back-bottom', 'M 65 1250 C 65 1144 575 1144 575 1250', { stroke: 'muted', dash: 2, strokeWidth: 3 });
  curve('enclosure-shell', 'M 65 690 L 65 1250 C 65 1360 575 1360 575 1250 L 575 690');
  curve('graduation-ring-back', 'M 78 968 C 78 851 562 851 562 968', { stroke: 'muted', dash: 2, strokeWidth: 3 });
  curve('graduation-ring-front', 'M 78 968 C 78 1086 562 1086 562 968 L 562 1008 C 562 1126 78 1126 78 1008 Z', { fill: 'paper', fillOpacity: 1 });
  const ticks = [];
  // Unnumbered marks indicate a graduated band, not a reconstructed calibration.
  for (let index = 0; index <= 20; index++) {
    const theta = Math.PI * index / 20;
    const x = 320 - 242 * Math.cos(theta);
    const y = 968 + 88 * Math.sin(theta);
    const id = `symbolic-graduation-${index + 1}`;
    curve(id, `M ${x} ${y + 5} L ${x} ${y + (index % 5 === 0 ? 31 : 21)}`, { strokeWidth: 2.2 });
    ticks.push(id);
  }
  edge('fixed-sphere-support', 'lid-fixed-support', 'sphere-b-center', { strokeWidth: 3.5 });
  edge('glass-rod-A', 'sphere-a-center', 'counterweight-c-center', { strokeWidth: 6 });
  edge('elastic-wire-B', 'lid-suspension-junction', 'suspension-pivot', { strokeWidth: 2.6 });
  edge('lower-suspension-spindle', 'suspension-pivot', 'lower-spindle-tip', { strokeWidth: 3 });
  curve('lower-spindle-eye', 'M 325 1015 C 325 1028 355 1028 355 1015 C 355 1005 325 1005 325 1015');
  circle('metal-sphere-b', 'sphere-b-center', 20, { fill: 'ink', fillOpacity: 1 });
  circle('metal-sphere-a', 'sphere-a-center', 18, { fill: 'ink', fillOpacity: 1 });
  circle('open-counterweight-c', 'counterweight-c-center', 23, { fill: 'paper', fillOpacity: 1 });
  curve('stationary-lid', 'M 65 690 C 65 575 575 575 575 690 C 575 806 65 806 65 690 Z', { fill: 'paper', fillOpacity: 1 });
  curve('slanted-lid-port-base', 'M 109 674 L 173 633 L 194 647 L 130 693 Z', { fill: 'muted', fillOpacity: 0.3 });
  curve('slanted-lid-port-stopper', 'M 138 663 L 185 605 L 204 613 L 157 675 Z', { fill: 'paper', fillOpacity: 1 });
  curve('tube-lower-collar', 'M 280 651 C 280 626 360 626 360 651 L 360 704 C 360 729 280 729 280 704 Z', { fill: 'muted', fillOpacity: 0.2 });
  curve('suspension-tube', 'M 286 190 L 286 659 C 286 680 354 680 354 659 L 354 190', { fill: 'paper', fillOpacity: 1 });
  curve('tube-top-collar', 'M 276 182 C 276 155 364 155 364 182 L 364 208 C 364 235 276 235 276 208 Z', { fill: 'muted', fillOpacity: 0.2 });
  curve('adjusting-head', 'M 238 124 C 238 87 402 87 402 124 L 402 148 C 402 185 238 185 238 148 Z', { fill: 'paper', fillOpacity: 1 });
  curve('side-adjuster-arm', 'M 260 127 L 218 124 L 218 111 L 260 114 Z', { fill: 'ink', fillOpacity: 1 });
  curve('side-adjuster-knob', 'M 217 106 C 185 104 179 144 203 159 C 213 163 217 150 212 142 C 204 132 206 120 219 119 Z', { fill: 'ink', fillOpacity: 1 });
  curve('central-adjusting-spindle', 'M 308 106 L 308 63 C 295 62 300 46 312 41 L 320 24 L 328 41 C 341 47 345 61 332 63 L 332 106 Z', { fill: 'ink', fillOpacity: 1 });
  label('rod-A-label', [265, 930], 'A');
  label('wire-B-label', [378, 864], 'B');
  label('sphere-a-label', [199, 1030], 'a');
  label('sphere-b-label', [119, 922], 'b');
  label('counterweight-c-label', [492, 1010], 'c');
  spec.assertions.push(
    { id: 'pivot-on-glass-rod', type: 'pointOnLine', point: 'suspension-pivot', a: 'sphere-a-center', b: 'counterweight-c-center' },
    { id: 'wire-vertical', type: 'displacement', from: 'lid-suspension-junction', to: 'suspension-pivot', dx: 0, dy: -233 },
    { id: 'fixed-sphere-above-test-sphere', type: 'displacement', from: 'sphere-a-center', to: 'sphere-b-center', dx: -27, dy: 48 },
    { id: 'distinct-test-and-fixed-spheres', type: 'distance', a: 'sphere-a-center', b: 'sphere-b-center', value: Math.hypot(27, 48) },
  );
  const groups = [
    {
      id: 'source-covered-apparatus-controls',
      description: sourceItem('fig-106').sourceFacts[0].description + ' Projected contours and collars are modern schematic geometry, not source measurements.',
      objects: ['enclosure-back-bottom','enclosure-shell','stationary-lid','slanted-lid-port-base','slanted-lid-port-stopper','tube-lower-collar','suspension-tube','tube-top-collar','adjusting-head','side-adjuster-arm','side-adjuster-knob','central-adjusting-spindle'],
      assertions: [],
    },
    {
      id: 'source-suspension-rod-and-end-components',
      description: sourceItem('fig-106').sourceFacts[1].description + ' Separate a/b, open c, lid-bound b and the A/B suspension topology are retained; all coordinate points are explicitly invisible construction anchors.',
      objects: ['fixed-sphere-support','glass-rod-A','elastic-wire-B','lower-suspension-spindle','lower-spindle-eye','metal-sphere-a','metal-sphere-b','open-counterweight-c','rod-A-label','wire-B-label','sphere-a-label','sphere-b-label','counterweight-c-label'],
      assertions: ['fixed-sphere-support-connects','glass-rod-A-connects','elastic-wire-B-connects','lower-suspension-spindle-connects','pivot-on-glass-rod','wire-vertical','fixed-sphere-above-test-sphere','distinct-test-and-fixed-spheres'],
    },
    {
      id: 'source-unnumbered-graduated-band',
      description: sourceItem('fig-106').sourceFacts[2].description + ' Tick count and spacing are expressly modern symbolic regularization, not a recovered calibration. There are no added numbers or angles.',
      objects: ['graduation-ring-back','graduation-ring-front', ...ticks], assertions: [],
    },
  ];
  spec.source.inventory = groups;
  assert(Math.hypot(27,48) > 18 + 20);
  return spec;
}

function plan107() {
  const { spec, edge, label } = base('fig-107', 250,
    'Source two-positive-charge static repulsion diagram. Left point1 bears vector F12 directed left, right point2 vector F21 directed right, with separation r on their common line. Equal arrow lengths encode the frozen static action/reaction condition on different charges; lengths and spacing have no numerical scale. No inward-force or negative-charge alternative is added.',
    { 'left-force-tip': [25,145], 'right-force-tip': [615,145] });
  spec.objects.push(
    { id: 'charge-1', type: 'point', at: [140,105], visible: true, size: 6, stroke: 'ink', fill: 'ink' },
    { id: 'charge-2', type: 'point', at: [500,105], visible: true, size: 6, stroke: 'ink', fill: 'ink' },
  );
  edge('charge-joining-interval', 'charge-1', 'charge-2', { strokeWidth: 3 });
  edge('force-on-1-F12', 'charge-1', 'left-force-tip', { type: 'arrow', strokeWidth: 4.5 });
  edge('force-on-2-F21', 'charge-2', 'right-force-tip', { type: 'arrow', strokeWidth: 4.5 });
  label('charge-1-positive-label', [140,89], '+');
  label('charge-2-positive-label', [500,89], '+');
  label('charge-1-number-label', [140,197], '1');
  label('charge-2-number-label', [500,197], '2');
  label('separation-r-label', [320,60], 'r');
  label('force-F12-label', [67,46], 'F\u20d7\u2081\u2082');
  label('force-F21-label', [573,46], 'F\u20d7\u2082\u2081');
  spec.assertions.push(
    { id: 'source-point-1-to-2-order', type: 'displacement', from: 'charge-1', to: 'charge-2', dx: 360, dy: 0 },
    { id: 'force-1-leftward', type: 'displacement', from: 'charge-1', to: 'left-force-tip', dx: -115, dy: 0 },
    { id: 'force-2-rightward', type: 'displacement', from: 'charge-2', to: 'right-force-tip', dx: 115, dy: 0 },
    { id: 'static-pair-equal-magnitude', type: 'equalDistance', a: 'charge-1', b: 'left-force-tip', c: 'charge-2', d: 'right-force-tip' },
    { id: 'force-1-collinear-with-charges', type: 'collinear', a: 'charge-1', b: 'charge-2', c: 'left-force-tip' },
    { id: 'force-2-collinear-with-charges', type: 'collinear', a: 'charge-1', b: 'charge-2', c: 'right-force-tip' },
    { id: 'two-source-force-arrows', type: 'objectCount', objectType: 'arrow', count: 2 },
  );
  spec.source.inventory = [
    {
      id: 'source-two-positive-points-and-separation',
      description: sourceItem('fig-107').sourceFacts[0].description + ' Spacing is unmeasured modern regularization. Exactly two visible source point objects; construction force-tip anchors are hidden.',
      objects: ['charge-1','charge-2','charge-joining-interval','charge-1-positive-label','charge-2-positive-label','charge-1-number-label','charge-2-number-label','separation-r-label'],
      assertions: ['source-point-1-to-2-order','charge-joining-interval-connects'], requires: ['pointRelationships'],
    },
    {
      id: 'source-outward-force-pair-labels',
      description: sourceItem('fig-107').sourceFacts[1].description + ' Equal modern arrow lengths follow frozen static prose, not measured ink lengths. F12 remains on1 and F21 on2; vector diacritics/subscripts retained.',
      objects: ['force-on-1-F12','force-on-2-F21','force-F12-label','force-F21-label'],
      assertions: ['force-on-1-F12-connects','force-on-2-F21-connects','force-1-leftward','force-2-rightward','static-pair-equal-magnitude','force-1-collinear-with-charges','force-2-collinear-with-charges','two-source-force-arrows'],
    },
  ];
  assert.equal(spec.objects.filter(object => object.type === 'point' && object.visible !== false).length, 2);
  return spec;
}

function planPortrait() {
  const source = sourceItem('tbl-p0153-01');
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id: source.id, mode: 'generated',
    description: 'Decorative compact contemporary textbook bust of source-bound C. A. Coulomb; preserve source image-right-facing three-quarter head, swept-back hair, high forehead, clean-shaven face and civilian shoulders. No inscription, archival-photo claim, apparatus, symbols or invented historical setting.',
    source: {
      image: { path: source.source.path, sha256: source.source.sha256 },
      authoritativeText: [{ lesson: lesson.id, text }],
      inventory: source.sourceFacts.map(item => ({ id: `source-${item.id}`, description: `${item.description} ${source.proseSuppliedSemantics}`, objects: [], assertions: [] })),
    },
    canvas: { width: 1024, height: 1024, boundingBox: [0,1024,1024,0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'decorative', layout: 'inline', maxWidthPx: 160, widths: [160], minTextPx: 16 },
    assets: [{ id: 'coulomb-portrait', role: 'artwork', path: file(source.id,'png'), metadata: file(source.id,'png.json') }],
    objects: [], assertions: [],
  };
  const prompt = [
    'MODE: generated. One compact decorative contemporary textbook identification portrait, not a scientific apparatus figure or archival photograph.',
    'The attached original extracted PNG is the sole facial/layout reference for source-bound C. A. Coulomb. The complete frozen modern-edition text below is authoritative and overrides pixels. Do not invent or infer dates, initials, historical claims or props.',
    'Create one full-color head-and-shoulders/chest bust on plain white, square1024x1024. Use a clean contemporary painted educational illustration with clear facial shapes legible at160px media width. Retain a three-quarter head facing image RIGHT, broad high forehead, swept-back wavy hair reaching ears/neck, eyebrows, prominent nose, clean-shaven face, dark civilian lapelled coat and light high shirt/neck opening. Preserve the supplied facial likeness; do not substitute a generic scientist. Complete hair/head and both shoulders, no clipping. Face and shoulders occupy most of the canvas with small white outer margins.',
    'Colors are restrained contemporary illustration choices, not claims about exact historical colors. No glasses, beard, hat, uniform, flags, medals, apparatus, scales, arrows, equations, text, letters, dates, labels, watermark, second person, decorative border, archival paper texture, monochrome engraving or invented scenery. No answer annotations.',
    'COMPLETE FROZEN CURRENT EDITION TEXT:',
    text,
  ].join('\n\n');
  writeNew(file(source.id,'prompt.txt'), `${prompt}\n`, true);
  return spec;
}

function plan(id) {
  context(id);
  const spec = id === 'fig-106' ? plan106() : id === 'fig-107' ? plan107() : planPortrait();
  for (const object of spec.objects.filter(object => object.type === 'point' && object.visible === false)) assert(!object.label);
  const mapped = new Set(spec.source.inventory.flatMap(group => group.objects));
  for (const object of spec.objects.filter(object => object.visible !== false)) assert(mapped.has(object.id), `Unmapped visible object: ${object.id}`);
  writeNew(file(id,'spec.json'), spec);
  const validation = run(python, ['-B',path.join(scripts,'validate_spec.py'),file(id,'spec.json'),'--stage','draft','--json']);
  writeNew(file(id,'preflight.json'), validation);
  console.log(JSON.stringify({ id, context: bind(file(id,'context.json')), spec: bind(file(id,'spec.json')), validation }, null, 2));
}

function render(id) {
  assert.notEqual(id, 'tbl-p0153-01');
  assert.equal(read(file(id,'preflight.json')).code, 0);
  for (const suffix of ['svg','png','render.json','render-command.json']) assert(!fs.existsSync(file(id,suffix)));
  const result = run('node', [path.join(scripts,'render_spec.mjs'),'--spec',file(id,'spec.json'),'--svg',file(id,'svg'),'--png',file(id,'png'),'--report',file(id,'render.json')]);
  writeNew(file(id,'render-command.json'), {
    ...result, entrypoint: bind(path.join(scripts,'render_spec.mjs')),
    nativeLauncher: { headless: true, isolated: true, persistentProfile: false, CDP: false, PWDEBUGUnset: true, autoHtmlReportOpen: false, browserClosedByNativeFinally: true, userWindowOrTabUsed: false },
  });
  console.log(JSON.stringify({ id, result, render: fs.existsSync(file(id,'render.json')) ? read(file(id,'render.json')) : null }, null, 2));
}

function generate() {
  const id = 'tbl-p0153-01';
  assert.equal(read(file(id,'preflight.json')).code, 0);
  for (const suffix of ['png','png.json','generation-command.json']) assert(!fs.existsSync(file(id,suffix)));
  const generator = '/Users/yong/.agents/skills/n-azure/scripts/generate_image.py';
  const result = run(python, [generator,'--prompt-file',file(id,'prompt.txt'),'--reference-image',sourceItem(id).source.path,'--output',file(id,'png'),'--size','1024x1024','--quality','high','--background','opaque','--retries','0']);
  writeNew(file(id,'generation-command.json'), { ...result, helper: bind(generator), generationAttempt: 1, targetedAuthorRepairs: 0, silentRetries: 0 });
  console.log(JSON.stringify(result, null, 2));
}

function previews(id) {
  const spec = read(file(id,'spec.json'));
  const outputs = [];
  if (spec.mode === 'generated') {
    const result = run(python, ['-B','-c', String.raw`
import json,sys,hashlib
from pathlib import Path
from PIL import Image
p=json.load(sys.stdin)
with Image.open(p['input']) as im:
 assert im.size==(1024,1024)
 im.resize((160,160),Image.Resampling.LANCZOS).save(p['output'])
b=Path(p['output']).read_bytes()
print(json.dumps({'path':p['output'],'sha256':hashlib.sha256(b).hexdigest(),'width':160,'height':160,'minimumDeclaredLabelPx':None,'noEmbeddedTextExpected':True}))
`], JSON.stringify({ input: file(id,'png'), output: file(id,'w160.png') }));
    assert.equal(result.code, 0, result.stderr);
    outputs.push(JSON.parse(result.stdout));
  } else {
    const report = read(file(id,'render.json'));
    assert.equal(report.spec.sha256, bind(file(id,'spec.json')).sha256);
    assert.equal(report.output.svg.sha256, bind(file(id,'svg')).sha256);
    const require = createRequire(path.resolve('.claude/skills/ld-s10y-lesson/package.json'));
    const { Resvg } = require('@resvg/resvg-js');
    const svg = fs.readFileSync(file(id,'svg'),'utf8');
    const palette = { ink: '#15201f', muted: '#4c5a58', accent: '#15201f', 'accent-soft': '#8a9795', grid: '#e3eae9', paper: '#ffffff' };
    const raster = svg.replace(/var\(--ld-figure-([a-z-]+)(?:,\s*[^)]+)?\)/g, (_, role) => { assert(role in palette); return palette[role]; });
    for (const width of spec.display.widths) {
      const output = new Resvg(raster, { background: 'white', fitTo: { mode: 'width', value: width } }).render();
      writeNew(file(id,`w${width}.png`), output.asPng(), true);
      outputs.push({ ...bind(file(id,`w${width}.png`)), width: output.width, height: output.height, minimumDeclaredLabelPx: 34 * width / 640 });
    }
    assert.equal(bind(file(id,'svg')).sha256, report.output.svg.sha256);
  }
  writeNew(file(id,'preview-metrics.json'), {
    existingDependenciesOnly: true, browserUsedForPreviews: false,
    renderer: spec.mode === 'generated' ? 'Existing Pillow LANCZOS from native generated PNG' : 'Existing lesson-owned Resvg; resolve native semantic color variables in memory only; original SVG unmodified',
    outputs,
  });
  console.log(JSON.stringify({ id, outputs }, null, 2));
}

function freeze() {
  const observationsPath = path.join(work,'author-pixel-observations.json');
  const observations = read(observationsPath);
  assert.deepEqual(bind(lessonPath), frozen.bindings.template);
  assert.deepEqual(bind(proseFreezePath), inventory.proseFreeze);
  const figures = [];
  for (const id of ids) {
    const spec = read(file(id,'spec.json'));
    const context = read(file(id,'context.json'));
    const preview = read(file(id,'preview-metrics.json'));
    assert.deepEqual(spec.source.authoritativeText, [{ lesson: lesson.id, text }]);
    assert.deepEqual(context.lessons[0].fullProse, lesson.prose);
    const opened = observations.figures.find(item => item.id === id);
    assert(opened?.authorOutcome === 'usable-candidate-independent-review-pending');
    assert.deepEqual(opened.previews.map(item => item.width), spec.display.widths);
    for (const output of preview.outputs) {
      const observation = opened.previews.find(item => item.width === output.width);
      assert(observation?.actuallyOpened && observation.detail === 'original');
      assert.deepEqual(bind(output.path), { path: output.path, sha256: output.sha256 });
      assert.equal(observation.path, output.path);
      assert.equal(observation.sha256, output.sha256);
      if (spec.mode !== 'generated') assert(output.minimumDeclaredLabelPx >= 16);
    }
    const validation = run(python, ['-B',path.join(scripts,'validate_spec.py'),file(id,'spec.json'),'--stage','rendered','--json']);
    writeNew(file(id,'rendered-validation.json'), validation);
    assert.equal(validation.code, 0, validation.stderr || validation.stdout);
    const bindings = {
      source: { path: sourceItem(id).source.path, sha256: sourceItem(id).source.sha256 },
      lesson: bind(lessonPath), sourceLesson: inventory.sourceLesson, proseFreeze: bind(proseFreezePath),
      inventory: bind(inventoryPath), context: bind(file(id,'context.json')), spec: bind(file(id,'spec.json')),
    };
    if (spec.mode === 'generated') {
      bindings.generation = bind(file(id,'png.json'));
      const generation = read(bindings.generation.path);
      assert.equal(generation.output.sha256, bind(file(id,'png')).sha256);
    } else {
      const render = read(file(id,'render.json'));
      assert.equal(render.status, 'pass');
      assert.equal(render.spec.sha256, bindings.spec.sha256);
      assert.equal(render.output.svg.sha256, bind(file(id,'svg')).sha256);
      bindings.svg = bind(file(id,'svg'));
      bindings.render = bind(file(id,'render.json'));
    }
    const manifest = {
      ticket: 'STEMROBIN-181', batch: 'D018', figure: id, mode: spec.mode,
      status: 'author-frozen-independent-review-pending', bindings,
      candidate: bind(file(id,'png')), previews: preview.outputs,
      previewMetrics: bind(file(id,'preview-metrics.json')), authorPixelObservations: bind(observationsPath),
      draftValidation: bind(file(id,'preflight.json')), renderedValidation: bind(file(id,'rendered-validation.json')),
      generationCalls: spec.mode === 'generated' ? 1 : 0,
      renderRuns: spec.mode === 'generated' ? 0 : 1,
      targetedAuthorRepairs: 0, remainingTargetedAuthorRepairs: 1,
      initialCandidatePreserved: true, independentReview: 'pending', promoted: false,
    };
    if (spec.mode === 'generated') {
      manifest.prompt = bind(file(id,'prompt.txt'));
      manifest.generationCommand = bind(file(id,'generation-command.json'));
    } else manifest.renderCommand = bind(file(id,'render-command.json'));
    writeNew(file(id,'author-manifest.json'), manifest);
    figures.push({ ...manifest, authorManifest: bind(file(id,'author-manifest.json')) });
  }
  const payload = {
    ticket: 'STEMROBIN-181', batch: 'D018', lesson: lesson.id, role: 'figure-author-only',
    status: 'author-frozen-independent-review-pending',
    lessonTemplate: bind(lessonPath), proseFreeze: bind(proseFreezePath),
    sourceLesson: inventory.sourceLesson, authoritativeTextSha256: sha(text),
    sourceInventory: bind(inventoryPath), figures, helper: bind(path.join(work,'build-figures.mjs')),
    nativeTools: ['build_context.py','validate_spec.py','render_spec.mjs','materialize_arrowheads.mjs'].map(name => bind(path.join(scripts,name))),
    nativeSchema: bind(path.resolve('.agents/skills/ld-s10y-image/assets/figure-spec.schema.json')),
    scientificReview: 'Main pending; not repeated by figure author',
    independentFigureApproval: false, promotionOrFinalization: false,
    sourceOrLessonTemplateEdits: false, userBrowserOrAppUsed: false,
    databaseGitDependenciesOrToolsChanged: false, n60OrD017Changed: false,
    inFlightProcesses: 0,
  };
  writeNew(freezePath, payload);
  fs.copyFileSync(freezePath, path.join(work,'author-freeze.json'), fs.constants.COPYFILE_EXCL);
  console.log(JSON.stringify({ freeze: bind(freezePath), scratchFreeze: bind(path.join(work,'author-freeze.json')), figures: figures.map(item => ({ id: item.figure, bindings: item.bindings, previews: item.previews })), inFlightProcesses: 0 }, null, 2));
}

const [command,id] = process.argv.slice(2);
assert(['generate','freeze'].includes(command) || ids.includes(id));
if (command === 'plan') plan(id);
else if (command === 'render') render(id);
else if (command === 'generate') generate();
else if (command === 'previews') previews(id);
else if (command === 'freeze') freeze();
else throw new Error(`Unknown command: ${command}`);
