import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from '../../../../.agents/skills/node_modules/playwright-core/index.mjs';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const out = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
assert.equal(process.cwd(), root);
assert.equal(out, path.join(root, '.tmp/STEMROBIN-181/9p-d021-n84-fig160'));
delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = 'never';
process.env.PYTHONDONTWRITEBYTECODE = '1';
const executable = chromium.executablePath();
assert(fs.existsSync(executable), 'Use the installed isolated testing Chromium only');
process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = executable;
delete process.env.CHROME_PATH;
const abs = p => path.resolve(root, p);
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const bind = p => ({ path: abs(p), sha256: sha(abs(p)), bytes: fs.statSync(abs(p)).size });
const read = p => JSON.parse(fs.readFileSync(abs(p), 'utf8'));
const write = (p, data) => {
  assert(p.startsWith(`${out}/`), 'All writes stay in the owned author directory');
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
};
const freezePath = `${out}/author-freeze.json`;
assert(!fs.existsSync(freezePath), 'Never overwrite a frozen package');
const templateRoot = '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s2-n84';
const textFreezePath = '.intentfold/tickets/STEMROBIN-181/tmp/9p-n84-prose-freeze.json';
const completionPath = '.intentfold/tickets/STEMROBIN-181/tmp/d021-n83-n84-text-20261116-a/completion-bindings.json';
assert.equal(sha(abs(textFreezePath)), 'b61d034f9b7e21c72418f65e5587c0ba86fdfad9c338db73ea387fb958a8cda8');
assert.equal(sha(abs(completionPath)), 'c1213dce723e7305385fa989f8afdc3fbd19b5e48239b89b490888555f53bcca');
const textFreeze = read(textFreezePath);
const completion = read(completionPath);
const lesson = read(`${templateRoot}/lesson.template.json`);
const exercises = read(`${templateRoot}/exercises.template.json`);
const exercise = exercises.exercises.find(item => String(item.number) === '1');
assert(exercise.figure_refs.includes('fig-160'));
const card = completion.cards.find(item => item.freeze.path === abs(textFreezePath));
assert(card);
for (const item of card.templates) assert.equal(sha(item.path), item.sha256);
for (const item of textFreeze.templates) {
  assert.equal(sha(item.active.path), item.active.sha256);
  assert.equal(sha(item.snapshot.path), item.active.sha256);
}
assert.equal(lesson.errata.length, 1);
assert.equal(lesson.errata[0].id, 'p0207-first-series-capacitance-subscript');
assert(exercise.text.includes(lesson.errata[0].corrected));
const source = abs('ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-160.png');
const png = fs.readFileSync(source);
assert.equal(png.subarray(1, 4).toString(), 'PNG');
const sourceSize = { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
assert.deepEqual(sourceSize, { width: 271, height: 552 });
const inputs = [source, textFreezePath, completionPath,
  ...card.templates.map(item => item.path),
  'ssot-resources/soviet10year-textbooks/artifacts/9p/pages/0207/page.json',
  'ssot-resources/soviet10year-textbooks/artifacts/9p/pages/0207/page.md',
  'ssot-resources/soviet10year-textbooks/artifacts/9p/pages/0207/audit.json',
].map(bind);
const snapshotInputs = inputs.map((item, index) => {
  const target = `${out}/spec/inputs/${index}-${path.basename(item.path)}`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(item.path, target, fs.constants.COPYFILE_EXCL);
  return { active: item, snapshot: bind(target) };
});
const authoritativeText = [
  ...lesson.prose.filter(item => item.text).map(item => ({ lesson: lesson.id, text: item.text })),
  { lesson: lesson.id, exercise: '1', text: exercise.text },
];
const context = {
  schema: 'ld-s10y-image/context@1',
  book: '9p', edition: 'modern-us-neutral', figure: 'fig-160',
  contextKind: 'exercises',
  authoritativeRule: 'Complete bound modern edition text is authoritative; source PNG supplies visual structure. Worked-example solution stays in text only, never in SVG.',
  sourceImage: { ...bind(source), ...sourceSize },
  suggestedSize: '1024x1536',
  lessons: [{
    lesson: lesson.id, title: lesson.printed_title,
    prose: [],
    exercises: [{ exercise: '1', group: exercise.group, text: exercise.text }],
    fullProse: lesson.prose, fullExercises: exercises.exercises,
    authoritativeText,
  }],
  bindings: { textFreeze: bind(textFreezePath), completion: bind(completionPath), templates: card.templates },
  errata: lesson.errata,
  scientificReview: 'in-flight elsewhere; no SCI performed or claimed here',
};
write(`${out}/spec/context.json`, context);

// Coordinates regularize the observed scan without changing its orientation or topology.
const objects = [];
const assertions = [];
const segment = (id, from, to, strokeWidth = 3, stroke = 'ink') => {
  objects.push({ id, type: 'segment', from, to, strokeWidth, stroke });
  assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from, to });
  return id;
};
const arrow = (id, from, to) => {
  objects.push({ id, type: 'arrow', from, to, strokeWidth: 3, stroke: 'ink' });
  assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from, to });
  assertions.push({ id: `${id}-nonzero`, type: 'distance', a: from, b: to, value: Math.hypot(to[0] - from[0], to[1] - from[1]) });
  return id;
};
const label = (id, at, text) => {
  objects.push({ id, type: 'text', at, text, fontSize: 36, fontWeight: 500,
    labelPlacement: { position: 'CENTER', offset: [0, 0] }, labelColor: 'ink' });
  return id;
};
const relation = (id, type, a, b, c, d) => {
  assertions.push({ id, type, a, b, c, d });
  return id;
};
const left = 207, slabLeft = 294, slabRight = 348, right = 432;
const top = 890, bottom = 230, middle = 560;
const plateObjects = [
  segment('source-left-plate', [left, bottom], [left, top], 6),
  segment('source-right-plate', [right, bottom], [right, top], 6),
];
objects.push({
  id: 'source-floating-metal-slab', type: 'polygon',
  points: [[slabLeft, bottom], [slabRight, bottom], [slabRight, top], [slabLeft, top]],
  stroke: 'ink', strokeWidth: 4, fill: 'paper', fillOpacity: 1,
});
const hatchObjects = [];
for (let y = bottom - 42, index = 0; y < top; y += 24, index++) {
  const start = [slabLeft + Math.max(0, bottom - y), Math.max(bottom, y)];
  const end = [slabLeft + Math.min(54, top - y), Math.min(top, y + 54)];
  if (end[0] <= start[0]) continue;
  hatchObjects.push(segment(`source-slab-hatch-${String(index).padStart(2, '0')}`, start, end, 2));
}
const terminals = [
  segment('source-left-terminal', [99, middle], [left, middle], 5),
  segment('source-right-terminal', [right, middle], [533, middle], 5),
];
const dimensionD = [
  segment('source-d-extension-left', [slabLeft, top], [slabLeft, 977], 2),
  segment('source-d-extension-right', [slabRight, top], [slabRight, 977], 2),
  segment('source-d-baseline', [232, 950], [411, 950], 2),
  arrow('source-d-arrow-left', [232, 950], [slabLeft, 950]),
  arrow('source-d-arrow-right', [411, 950], [slabRight, 950]),
  label('source-d-text', [321, 1010], 'd'),
];
const dimensionX = [
  segment('source-x-extension-left', [left, bottom], [left, 70], 2),
  segment('source-x-extension-slab', [slabLeft, bottom], [slabLeft, 141], 2),
  segment('source-x-baseline', [117, 157], [366, 157], 2),
  arrow('source-x-arrow-left', [117, 157], [left, 157]),
  arrow('source-x-arrow-right', [366, 157], [slabLeft, 157]),
  label('source-x-text', [250.5, 198], 'x'),
];
const dimensionL = [
  segment('source-l-extension-right', [right, bottom], [right, 70], 2),
  segment('source-l-baseline', [left, 85], [right, 85], 2),
  arrow('source-l-arrow-left', [291, 85], [left, 85]),
  arrow('source-l-arrow-right', [349, 85], [right, 85]),
  label('source-l-text', [319.5, 126], 'l'),
];
const geometryRelations = [
  relation('source-outer-plates-parallel', 'parallel', [left, bottom], [left, top], [right, bottom], [right, top]),
  relation('source-slab-left-parallel', 'parallel', [left, bottom], [left, top], [slabLeft, bottom], [slabLeft, top]),
  relation('source-slab-right-parallel', 'parallel', [right, bottom], [right, top], [slabRight, bottom], [slabRight, top]),
  relation('context-full-area-left-height', 'equalDistance', [left, bottom], [left, top], [slabLeft, bottom], [slabLeft, top]),
  relation('context-full-area-right-height', 'equalDistance', [right, bottom], [right, top], [slabRight, bottom], [slabRight, top]),
  relation('source-d-matches-slab-thickness', 'equalDistance', [slabLeft, 950], [slabRight, 950], [slabLeft, top], [slabRight, top]),
  relation('source-x-matches-left-vacuum-gap', 'equalDistance', [left, 157], [slabLeft, 157], [left, bottom], [slabLeft, bottom]),
  relation('source-l-matches-outer-separation', 'equalDistance', [left, 85], [right, 85], [left, bottom], [right, bottom]),
  relation('source-d-normal-to-plates', 'perpendicular', [slabLeft, 950], [slabRight, 950], [left, bottom], [left, top]),
  relation('source-x-normal-to-plates', 'perpendicular', [left, 157], [slabLeft, 157], [left, bottom], [left, top]),
  relation('source-l-normal-to-plates', 'perpendicular', [left, 85], [right, 85], [left, bottom], [left, top]),
];
for (const [id, a, b, value] of [
  ['source-left-positive-gap', [left, bottom], [slabLeft, bottom], 87],
  ['source-right-positive-gap', [slabRight, bottom], [right, bottom], 84],
  ['source-positive-slab-thickness', [slabLeft, top], [slabRight, top], 54],
]) assertions.push({ id, type: 'distance', a, b, value });
assertions.push({ id: 'source-exactly-one-filled-conductor-slab', type: 'objectCount', objectType: 'polygon', count: 1 });
assertions.push({ id: 'source-exactly-three-printed-labels', type: 'objectCount', objectType: 'text', count: 3 });
assertions.push({ id: 'source-exactly-six-real-dimension-arrows', type: 'objectCount', objectType: 'arrow', count: 6 });
const mapped = ids => assertions.filter(a => ids.includes(a.arrow)).map(a => a.id);
const inventory = [
  {
    id: 'source-three-vertical-conductors',
    description: 'One subfigure: two thin vertical outer plates and one finite-thickness vertical middle slab, all aligned at the top and bottom. Exactly three conductors, not a dielectric sheet. The two outer mid-height leads terminate outward, and no lead touches the middle slab.',
    objects: [...plateObjects, 'source-floating-metal-slab', ...terminals],
    assertions: [...mapped([...plateObjects, ...terminals]), ...geometryRelations.slice(0, 5),
      'source-exactly-one-filled-conductor-slab', 'source-left-positive-gap', 'source-right-positive-gap', 'source-positive-slab-thickness'],
  },
  {
    id: 'source-slab-rising-diagonal-hatching',
    description: 'Only the middle slab is hatched. Repeated diagonal strokes rise from lower-left to upper-right within its closed rectangular cross-section; the vacuum gaps and outer plates have no hatching. Individual noisy scan-stroke count is not a physical quantity.',
    objects: ['source-floating-metal-slab', ...hatchObjects],
    assertions: mapped(hatchObjects),
  },
  {
    id: 'source-d-thickness-dimension',
    description: 'Printed d is above the slab; a horizontal line above the plate tops has opposing arrows approaching the two slab-face extension lines from outside. It measures slab thickness, not either vacuum gap.',
    objects: dimensionD,
    assertions: [...mapped(dimensionD), 'source-d-matches-slab-thickness', 'source-d-normal-to-plates',
      'source-d-arrow-left-nonzero', 'source-d-arrow-right-nonzero'],
  },
  {
    id: 'source-x-left-gap-dimension',
    description: 'Printed x is below the conductors and above l. Opposing outside arrows point toward the left plate and the left slab face; vertical extensions meet the dimension line. It is the left vacuum gap only.',
    objects: dimensionX,
    assertions: [...mapped(dimensionX), 'source-x-matches-left-vacuum-gap', 'source-x-normal-to-plates',
      'source-x-arrow-left-nonzero', 'source-x-arrow-right-nonzero'],
  },
  {
    id: 'source-l-total-plate-separation',
    description: 'Printed lowercase l is the lowest dimension. Arrows within the total span point out toward the left and right outer-plate extension lines. l measures the entire outer-plate separation, including the middle slab. The right vacuum gap is unlabelled in the source.',
    objects: ['source-x-extension-left', ...dimensionL],
    assertions: [...mapped(dimensionL), 'source-l-matches-outer-separation', 'source-l-normal-to-plates',
      'source-l-arrow-left-nonzero', 'source-l-arrow-right-nonzero',
      'source-exactly-three-printed-labels', 'source-exactly-six-real-dimension-arrows'],
  },
];
const sourceObservations = {
  schema: 'ld-s10y-image/source-inventory-observations@1',
  figure: 'fig-160', observerRole: 'author-not-independent-reviewer',
  source: bind(source), imageOpen: 1,
  inventory,
  absent: ['charge plus/minus annotations', 'electric-field arrows', 'ground', 'voltage source',
    'wire to inserted slab', 'formula', 'C/C1/C2 labels', 'derived right-gap label', 'numeric dimension values', 'S label'],
  scanNoise: {
    pixel: [205, 9], disposition: 'Previously accepted harmless scan noise; not an additional object.',
    limit: 'This exclusion does not excuse missing diagram content.',
  },
  regularizations: [
    'Straightened scan lines, common top/bottom alignment and equal-height full-area depiction.',
    'Same vertical orientation, left-to-right order, hatch slope and all dimension endpoint relationships.',
    'Approximate source relative gaps and thickness retained; canvas coordinates are layout units, not printed numerical givens.',
    'Hatch spacing and count regularized, no new scientific annotations.',
  ],
  contextConditions: {
    floatingInitiallyNeutral: 'No slab terminal, ground, supply or charge annotations added.',
    noncontact: 'Both vacuum gaps strictly positive.',
    fullArea: 'Slab spans the same depicted height as both facing outer plates; full overlap in suppressed depth follows the complete bound exercise, not an added perspective scene.',
    solutionHandling: 'Embedded worked solution accepted in full authoritative text only; diagram contains solely source-printed d, x, l.',
  },
};
write(`${out}/spec/source-inventory.json`, sourceObservations);
const spec = {
  schema: 'ld-s10y-image/figure-spec@2',
  id: 'fig-160', mode: 'deterministic',
  description: 'Source-faithful three-conductor cross-section for modern worked exercise 1: two parallel capacitor plates with a floating neutral noncontact full-area metal slab between them. Read only the printed d, x, l dimension arrows. No solution or induced-charge annotations.',
  source: { image: { path: source, sha256: sha(source) }, authoritativeText, inventory },
  canvas: { width: 640, height: 1080, boundingBox: [0, 1080, 640, 0], background: 'paper', keepAspectRatio: true },
  display: { layout: 'inline', purpose: 'instructional', maxWidthPx: 640, widths: [640, 331, 342], minTextPx: 16 },
  objects, assertions,
};
write(`${out}/spec/fig-160.spec.json`, spec);
const tools = [
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/routing.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs',
  '.agents/skills/ld-s10y-image/scripts/build_context.py',
  '.agents/skills/node_modules/jsxgraph/distrib/jsxgraphcore.js',
  '.agents/skills/node_modules/jsxgraph/distrib/jsxgraph.css',
  '.agents/skills/node_modules/jsxgraph/package.json',
  '.agents/skills/node_modules/playwright-core/package.json',
];
const toolSnapshots = tools.map((p, i) => {
  const target = `${out}/scripts/tools/${i}-${path.basename(p)}`;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(abs(p), target, fs.constants.COPYFILE_EXCL);
  return { active: bind(p), snapshot: bind(target) };
});
const envRecord = {
  PWDEBUG: 'unset', PLAYWRIGHT_HTML_OPEN: 'never', PYTHONDONTWRITEBYTECODE: '1',
  PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH: executable, headless: true,
  freshContext: true, persistentProfile: false, CDP: false,
  userWindow: false, systemInput: false, externalNetwork: false,
};
const invoke = (name, cmd, args) => {
  const result = spawnSync(cmd, args, { cwd: root, encoding: 'utf8', env: process.env, timeout: 120000 });
  const record = { command: cmd, args, cwd: root, environment: envRecord,
    exitCode: result.status, signal: result.signal, stdout: result.stdout, stderr: result.stderr,
    error: result.error?.message ?? null };
  write(`${out}/native/${name}-invocation.json`, record);
  return result;
};
const validation = invoke('validation', 'python3', [
  '-B', abs('.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
  `${out}/spec/fig-160.spec.json`, '--stage', 'draft', '--json',
]);
write(`${out}/native/validation.json`, JSON.parse(validation.stdout));
assert.equal(validation.status, 0, 'Native validation failed; do not weaken any assertion');
const render = invoke('render', process.execPath, [
  abs('.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
  '--spec', `${out}/spec/fig-160.spec.json`,
  '--svg', `${out}/native/fig-160.svg`,
  '--report', `${out}/native/fig-160.render.json`,
]);
assert.equal(render.status, 0, 'Native render failed; preserve attempt for at most one targeted repair');
const report = read(`${out}/native/fig-160.render.json`);
assert.equal(report.status, 'pass');
assert.equal(report.labels, 3);
assert.equal(report.spec.sha256, sha(`${out}/spec/fig-160.spec.json`));
const svg = fs.readFileSync(`${out}/native/fig-160.svg`, 'utf8');
const browser = await chromium.launch({ executablePath: executable, headless: true });
const metrics = [];
try {
  const browserContext = await browser.newContext({ deviceScaleFactor: 1 });
  await browserContext.route('**/*', route => route.abort());
  const page = await browserContext.newPage();
  fs.mkdirSync(`${out}/previews`, { recursive: true });
  for (const width of spec.display.widths) {
    const height = Math.ceil(width * 1080 / 640);
    await page.setViewportSize({ width, height });
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>
      html,body{margin:0;background:white;overflow:hidden}
      svg{display:block;width:${width}px!important;height:auto!important;max-width:640px}
      </style>${svg}`);
    const measured = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      const bounds = svg.getBoundingClientRect();
      const texts = [...svg.querySelectorAll('text')].map(node => {
        const matrix = node.getScreenCTM();
        const rect = node.getBoundingClientRect();
        const px = parseFloat(getComputedStyle(node).fontSize) * Math.hypot(matrix.a, matrix.b);
        return { text: node.textContent, px,
          bounds: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          inside: rect.x >= 0 && rect.y >= 0 && rect.right <= bounds.right && rect.bottom <= bounds.bottom };
      });
      return { width: bounds.width, height: bounds.height, texts,
        minTextPx: Math.min(...texts.map(item => item.px)),
        forbiddenTags: svg.querySelectorAll('image,foreignObject,script').length,
        nonemptyShapes: svg.querySelectorAll('path,line,polygon,polyline').length };
    });
    assert.deepEqual(measured.texts.map(item => item.text).sort(), ['d', 'l', 'x']);
    assert(measured.minTextPx >= 16);
    assert(measured.texts.every(item => item.inside));
    assert.equal(measured.forbiddenTags, 0);
    assert(measured.nonemptyShapes >= 20);
    const preview = `${out}/previews/width-${width}.png`;
    await page.screenshot({ path: preview, animations: 'disabled' });
    metrics.push({ ...measured, preview: bind(preview), status: 'pass' });
  }
  await browserContext.close();
} finally {
  await browser.close();
}
write(`${out}/native/preview-evidence.json`, {
  schema: 'ld-s10y-image/preview-evidence@1', figure: 'fig-160',
  status: 'pass', environment: envRecord, browserClosed: true,
  svg: bind(`${out}/native/fig-160.svg`), widths: metrics,
  note: 'Actual screenshots require author image inspection before freeze; mechanical metrics are not independent review.',
});
write(`${out}/native/repair-history.json`, {
  schema: 'ld-s10y-image/repair-history@1', figure: 'fig-160',
  nativeValidationInvocations: 1, nativeRenderInvocations: 1,
  rendererAlsoValidatesDraftInternally: true, repairCount: 0, allowedTargetedRepairs: 1,
  sharedFixes: 0, attempts: [{ id: 'initial', validation: bind(`${out}/native/validation.json`),
    render: bind(`${out}/native/fig-160.render.json`), status: 'pass' }],
});
write(`${out}/native/construction-bindings.json`, {
  schema: 'ld-s10y-image/author-construction-bindings@1', figure: 'fig-160',
  contextKind: 'exercises', status: 'native-pass-awaiting-author-preview-observation',
  inputs: snapshotInputs, tools: toolSnapshots,
  executable: bind(executable), node: process.version, authorScript: bind(fileURLToPath(import.meta.url)),
  context: bind(`${out}/spec/context.json`),
  sourceInventory: bind(`${out}/spec/source-inventory.json`),
  spec: bind(`${out}/spec/fig-160.spec.json`),
  svg: bind(`${out}/native/fig-160.svg`), render: bind(`${out}/native/fig-160.render.json`),
  previews: metrics.map(item => item.preview), environment: envRecord,
  noInputDrift: inputs.every(item => sha(item.path) === item.sha256),
});
assert(inputs.every(item => sha(item.path) === item.sha256), 'Bound input changed during construction; preserve snapshot and stop');
console.log(JSON.stringify({ status: 'native-pass-preview-observation-needed', imageOpens: 1,
  repairCount: 0, minTextPx: metrics.map(item => [item.width, item.minTextPx]), output: out }));
