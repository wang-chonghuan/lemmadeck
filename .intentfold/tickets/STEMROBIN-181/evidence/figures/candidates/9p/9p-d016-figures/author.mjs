import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const work = '.tmp/STEMROBIN-181/9p-d016-figures';
const ticket = '.intentfold/tickets/STEMROBIN-181/tmp';
const helper = `${work}/author.mjs`;
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const renderer = '.agents/skills/ld-s10y-image/scripts/render_spec.mjs';
const contextAPI = '.agents/skills/ld-s10y-image/scripts/build_context.py';
const widths = [640, 331, 342];
const [command, id] = process.argv.slice(2);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => ({ path: file, sha256: hash(fs.readFileSync(file)) });
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const verify = binding => assert.deepEqual(bind(binding.path), { path: binding.path, sha256: binding.sha256 });
const saveNew = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
};
const env = { ...process.env, PYTHON: path.resolve(python), PYTHONDONTWRITEBYTECODE: '1', PLAYWRIGHT_HTML_OPEN: 'never' };
delete env.PWDEBUG;
const run = (executable, args, input) => {
  const result = spawnSync(executable, args, { env, input, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  return { executable, args, exitCode: result.status, signal: result.signal, stdout: result.stdout, stderr: result.stderr };
};

function inputsFor(figure) {
  assert(['fig-99', 'fig-100'].includes(figure), 'Own only figures99/100.');
  const number = figure === 'fig-99' ? 56 : 57;
  const lessonId = `phy9-c1-s7-n${number}`;
  const template = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${lessonId}/lesson.template.json`;
  const sourceLesson = `ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/${lessonId}/lesson.json`;
  const proseFreeze = `${ticket}/9p-n${number}-prose-freeze.json`;
  assert(fs.existsSync(proseFreeze), `Await ${proseFreeze}; do not bind/render unfinished prose.`);
  const frozen = read(proseFreeze), lesson = read(template);
  const frozenTemplate = frozen.templates['lesson.template.json'];
  const frozenSource = frozen.source.lesson;
  assert.equal(frozen.lesson, lessonId);
  assert.equal(path.resolve(frozenTemplate.path), path.resolve(template));
  assert.equal(frozenTemplate.sha256, bind(template).sha256, 'Authoritative prose changed.');
  assert.equal(path.resolve(frozenSource.path), path.resolve(sourceLesson));
  assert.equal(frozenSource.sha256, bind(sourceLesson).sha256);
  for (const binding of Object.values(frozen.templates)) verify(binding);
  assert.equal(lesson.id, lessonId);
  assert.deepEqual(lesson.source.data, read(sourceLesson));
  assert.equal(lesson.exercise_count, 0);
  assert(lesson.prose.some(block => block.kind === 'fig' && block.id === figure));
  const fullText = [lesson.printed_title, ...lesson.prose.map(block => block.text)].join('\n\n');
  assert.equal(lesson.prose.length, frozen.counts.source_prose_blocks);
  const inventoryFile = `${work}/${figure}.source-inventory.json`;
  const inventory = read(inventoryFile);
  verify(inventory.source);
  verify(inventory.sourcePage);
  assert.equal(inventory.source.actuallyOpened, true);
  const inputs = {
    template: bind(template), sourceLesson: bind(sourceLesson), proseFreeze: bind(proseFreeze),
    sourceImage: bind(inventory.source.path), sourcePage: bind(inventory.sourcePage.path),
    sourceInventory: bind(inventoryFile),
    proseScienceReview: bind(`${ticket}/9p-n${number}-science-review.json`),
    figureTemplate: bind(path.join(path.dirname(template), 'figures.template.json')),
    exerciseTemplate: bind(path.join(path.dirname(template), 'exercises.template.json')),
  };
  return { lessonId, lesson, fullText, inventory, inputs };
}

function currentInputs(inputs) {
  for (const binding of Object.values(inputs)) verify(binding);
}

function plan(figure) {
  const data = inputsFor(figure);
  const { lessonId, lesson, fullText, inventory, inputs } = data;
  assert(!fs.existsSync(`${work}/${figure}.spec.json`), 'Initial plan already exists.');
  const contextResult = run(python, ['-B', '-c', `
import json,sys
from pathlib import Path
sys.path.insert(0,'.agents/skills/ld-s10y-image/scripts')
import build_context as B
p=json.load(sys.stdin)
image=Path(p['inputs']['sourceImage']['path'])
assert B.sha256(image)==p['inputs']['sourceImage']['sha256']
w,h=B.png_size(image)
near=B.prose_context([dict(b,label=b.get('label') or '') for b in p['lesson']['prose']],p['id'])
assert near
print(json.dumps({
 'schema':'ld-s10y-image/context@1','book':'9p','edition':'modern-us-neutral','figure':p['id'],
 'sourceImage':dict(p['inputs']['sourceImage'],width=w,height=h),'suggestedSize':B.suggested_size(w,h),
 'authoritativeRule':'Complete current frozen title and all prose/captions are authoritative; original PNG supplies the finite schematic graph and its labels. No quantitative calibration, answer key, extra curve endpoint or atom scene.',
 'lessons':[{'lesson':p['lesson']['id'],'title':p['lesson']['printed_title'],'prose':near,
 'fullProse':p['lesson']['prose'],'authoritativeText':p['fullText'],'exercises':[]}],
 'inputs':p['inputs'],'construction':'Existing native build_context API on the current author-frozen scratch template.'
},ensure_ascii=False))
`], JSON.stringify({ id: figure, lesson, fullText, inputs }));
  assert.equal(contextResult.exitCode, 0, contextResult.stderr);
  saveNew(`${work}/${figure}.context.json`, JSON.parse(contextResult.stdout));

  const height = figure === 'fig-99' ? 480 : 460;
  const at = ([x, y]) => [x, height - y];
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id: figure, mode: 'deterministic',
    description: figure === 'fig-99'
      ? 'Uncalibrated length-temperature schematic: two horizontal and two vertical dashed guides, zero origin, l_0/l and t_0/t labels. One positive straight line begins at the reference pair and continues past the later pair to the printed finite unlabelled end. No line to the origin, added endpoint marker or material coefficient calibration.'
      : 'Uncalibrated water volume-temperature schematic: volume decreases from zero temperature to the printed minimum at4 degrees C, then increases. Preserve the single vertical dashed minimum projection, zero origin and V/t axes. No numeric volume, endpoint temperature, extra extrema, second curve or atom scene.',
    source: { image: inputs.sourceImage, authoritativeText: [{ lesson: lessonId, text: fullText }], inventory: [] },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, minTextPx: 16, widths },
    objects: [], assertions: [], layout: { minLabelGap: 4 },
  };
  const positions = new Map(), groups = [];
  const group = (name, description, relations = false) => {
    const value = { id: name, description, objects: [], assertions: [], ...(relations ? { requires: ['pointRelationships'] } : {}) };
    groups.push(value);
    return value;
  };
  const record = (object, g) => {
    spec.objects.push(object);
    g?.objects.push(object.id);
    return object.id;
  };
  const assertion = (value, g) => {
    spec.assertions.push(value);
    g?.assertions.push(value.id);
  };
  const point = (name, p, g) => {
    positions.set(name, p);
    return record({ id: name, type: 'point', at: at(p), visible: true, label: '',
      size: 0.2, stroke: 'ink', fill: 'ink', strokeWidth: 0.2 }, g);
  };
  const resolve = value => typeof value === 'string' ? value : at(value);
  const segment = (name, from, to, g, dashed = false, strokeWidth = 2.4) =>
    record({ id: name, type: 'segment', from: resolve(from), to: resolve(to),
      stroke: 'ink', strokeWidth, ...(dashed ? { dash: 2 } : {}) }, g);
  const text = (name, p, value, g) =>
    record({ id: name, type: 'text', at: at(p), text: value,
      fontSize: 32, fontWeight: 500, labelPlacement: { position: 'CENTER' } }, g);
  const relation = (name, from, to, g) => {
    const a = positions.get(from), b = positions.get(to);
    assertion({ id: name, type: 'displacement', from, to, dx: b[0] - a[0], dy: a[1] - b[1] }, g);
  };
  const axes = group('source-shared-axes', inventory.sourceFacts[0], true);
  const origin = [86, figure === 'fig-99' ? 410 : 390];
  point('source-origin', origin, axes);
  point('source-vertical-tip', [86, figure === 'fig-99' ? 54 : 40], axes);
  point('source-horizontal-tip', [604, origin[1]], axes);
  for (const [name, end] of [['source-length-or-volume-axis', 'source-vertical-tip'], ['source-temperature-axis', 'source-horizontal-tip']]) {
    record({ id: name, type: 'arrow', from: 'source-origin', to: end, stroke: 'ink', strokeWidth: 2.6 }, axes);
    assertion({ id: `${name}-connects`, type: 'connects', arrow: name, from: 'source-origin', to: end }, axes);
  }
  segment('source-horizontal-axis-tail', [44, origin[1]], 'source-origin', axes);
  segment('source-vertical-axis-tail', 'source-origin', [86, origin[1] + 43], axes);
  text('source-vertical-axis-label', [51, figure === 'fig-99' ? 54 : 40], figure === 'fig-99' ? 'l' : 'V', axes);
  text('source-temperature-axis-label', [592, origin[1] + 39], 't', axes);
  text('source-origin-label', [59, origin[1] + 30], '0', axes);

  let curveEvidence;
  if (figure === 'fig-99') {
    const curve = group('source-positive-straight-line', inventory.sourceFacts[3], true);
    const guides = group('source-two-guide-pairs', inventory.sourceFacts.slice(1, 3).join(' '), true);
    const start = [180, 286], sample = [420, 136], end = [532, 66];
    point('source-reference-intersection', start, curve);
    point('source-later-intersection', sample, curve);
    guides.objects.push('source-reference-intersection', 'source-later-intersection');
    segment('source-linear-trend', 'source-reference-intersection', end, curve, false, 3.8);
    assertion({ id: 'source-straight-through-both-pairs', type: 'collinear',
      a: 'source-reference-intersection', b: 'source-later-intersection', c: at(end) }, curve);
    relation('source-reference-to-later-positive-trend', 'source-reference-intersection', 'source-later-intersection', curve);
    for (const [suffix, p, node] of [
      ['reference', start, 'source-reference-intersection'], ['later', sample, 'source-later-intersection'],
    ]) {
      const verticalFoot = `source-${suffix}-temperature-foot`;
      const horizontalFoot = `source-${suffix}-length-foot`;
      point(verticalFoot, [p[0], origin[1]], guides);
      point(horizontalFoot, [origin[0], p[1]], guides);
      segment(`source-${suffix}-vertical-guide`, node, verticalFoot, guides, true);
      segment(`source-${suffix}-horizontal-guide`, horizontalFoot, node, guides, true);
      relation(`source-${suffix}-vertical-projection`, node, verticalFoot, guides);
      relation(`source-${suffix}-horizontal-projection`, horizontalFoot, node, guides);
    }
    text('source-initial-length-label', [49, start[1]], 'l\u2080', guides);
    text('source-later-length-label', [54, sample[1]], 'l', guides);
    text('source-initial-temperature-label', [start[0], 449], 't\u2080', guides);
    text('source-later-temperature-label', [sample[0], 449], 't', guides);
    assert(start[0] > origin[0] && start[1] < origin[1]);
    assert(sample[0] > start[0] && sample[1] < start[1]);
    assert(end[0] > sample[0] && end[1] < sample[1]);
    assert.equal((sample[0] - start[0]) * (end[1] - start[1]) - (sample[1] - start[1]) * (end[0] - start[0]), 0);
    curveEvidence = {
      kind: 'source-schematic-straight-line', start, laterGuideIntersection: sample,
      finiteUnlabelledSourceEnd: end, positiveSlope: true,
      startsAtReferencePairNotOrigin: true, extendsPastLaterPair: true,
      sourceCoordinatesArePhysicalData: false, addedVisibleEndpointMarkers: 0,
    };
  } else {
    const curve = group('source-decrease-minimum-increase', inventory.sourceFacts.slice(1, 4).join(' '), true);
    const guide = group('source-four-degree-minimum-projection', inventory.sourceFacts[2], true);
    const start = [86, 307], minimum = [132, 323], end = [552, 136];
    const leftControls = [start, [104, 319], [112, 323], minimum];
    const rightControls = [minimum, [244, 323], [444, 198], end];
    point('source-zero-temperature-curve-start', start, curve);
    point('source-four-degree-minimum', minimum, curve);
    relation('source-zero-to-four-volume-decrease', 'source-zero-temperature-curve-start', 'source-four-degree-minimum', curve);
    guide.objects.push('source-four-degree-minimum');
    point('source-four-degree-temperature-foot', [minimum[0], origin[1]], guide);
    segment('source-four-degree-vertical-guide', 'source-four-degree-minimum', 'source-four-degree-temperature-foot', guide, true);
    relation('source-four-degree-vertical-projection', 'source-four-degree-minimum', 'source-four-degree-temperature-foot', guide);
    const d = `M${start.join(',')} C${leftControls.slice(1).map(p => p.join(',')).join(' ')} C${rightControls.slice(1).map(p => p.join(',')).join(' ')}`;
    record({ id: 'source-volume-curve', type: 'svgPath', d, stroke: 'ink', strokeWidth: 3.8 }, curve);
    text('source-four-degree-label', [minimum[0], 428], '4\u00b0C', guide);
    const derivativeControls = controls => controls.slice(1).map((p, index) =>
      [3 * (p[0] - controls[index][0]), 3 * (p[1] - controls[index][1])]);
    const leftDerivative = derivativeControls(leftControls), rightDerivative = derivativeControls(rightControls);
    assert(leftDerivative.every(([dx, dy]) => dx > 0 && dy >= 0));
    assert(rightDerivative.every(([dx, dy]) => dx > 0 && dy <= 0));
    assert(leftDerivative.slice(0, 2).every(([, dy]) => dy > 0));
    assert(rightDerivative.slice(1).every(([, dy]) => dy < 0));
    assert.equal(leftDerivative[2][1], 0);
    assert.equal(rightDerivative[0][1], 0);
    assert(minimum[1] < origin[1] && start[0] === origin[0]);
    curveEvidence = {
      kind: 'source-schematic-cubic-strokes', leftControls, rightControls,
      derivativeBernsteinControls: { left: leftDerivative, right: rightDerivative },
      proof: 'Positive horizontal derivative controls on both pieces; screen-y derivative nonnegative before the common minimum and nonpositive after, strictly signed in each open interval. Both tangents horizontal at the minimum, which stays above the temperature axis.',
      minimumBoundToPrintedFourDegreesOnly: true, noOtherExtrema: true,
      quantitativeTemperatureVolumeCalibration: false, addedVisibleEndpointMarkers: 0,
    };
  }
  spec.source.inventory = groups;
  const dashed = spec.objects.filter(object => object.dash);
  assert.equal(dashed.length, figure === 'fig-99' ? 4 : 1);
  assert.equal(spec.objects.filter(object => object.type === 'text').length, inventory.printedLabels.length);
  assert.equal(spec.objects.filter(object => object.type === 'grid').length, 0);
  assert(spec.objects.filter(object => object.type === 'text').every(object => object.fontSize >= 32 && !/[\u0400-\u04ff]/u.test(object.text)));
  saveNew(`${work}/${figure}.author-assertions.json`, {
    ticket: 'STEMROBIN-181', figure, status: 'author-construction-evidence-not-independent-review',
    inputs, curveEvidence, sourceGroups: groups, nativeAssertions: spec.assertions,
    guideCounts: inventory.counts, physicalCalibration: false,
    constructionNodes: 'Unlabelled0.2px construction nodes lie under source strokes; they add no visible data markers or endpoint labels.',
    minimumLabelPxAt331: 32 * 331 / 640,
  });
  saveNew(`${work}/${figure}.initial.spec.json`, spec);
  saveNew(`${work}/${figure}.spec.json`, spec);
  currentInputs(inputs);
  console.log(JSON.stringify({ spec: bind(`${work}/${figure}.spec.json`), context: bind(`${work}/${figure}.context.json`) }));
}

function render(figure, repaired = false) {
  const { inputs } = inputsFor(figure);
  const base = `${work}/${figure}`;
  currentInputs(read(`${base}.context.json`).inputs);
  const commandPath = `${base}.${repaired ? 'corrected-render-command' : 'render-command'}.json`;
  assert(!fs.existsSync(commandPath), 'Do not repeat this render attempt.');
  if (repaired) {
    assert(fs.existsSync(`${base}.rejected-initial/preservation.json`), 'Preserve first attempt before a scoped manual repair.');
    assert.notEqual(bind(`${base}.initial.spec.json`).sha256, bind(`${base}.spec.json`).sha256);
  }
  const result = run('node', [renderer, '--spec', `${base}.spec.json`, '--svg', `${base}.svg`,
    '--png', `${base}.png`, '--report', `${base}.render.json`]);
  saveNew(commandPath, result);
  const report = fs.existsSync(`${base}.render.json`) ? read(`${base}.render.json`) : null;
  const evidence = {
    figure, initialAttempts: 1,
    initialFailureCount: repaired ? read(`${base}.attempts.json`).initialFailureCount : Number(result.exitCode !== 0),
    targetedRepairs: Number(repaired), maximumRepairs: 1, remainingRepairs: Number(!repaired),
    spec: bind(`${base}.spec.json`), command: bind(commandPath),
    nativeReport: report ? bind(`${base}.render.json`) : null,
    nativeStatus: report?.status ?? 'not-rendered', independentReview: 'pending-Mencius-only',
  };
  saveNew(`${base}.${repaired ? 'repair-evidence' : 'attempts'}.json`, evidence);
  currentInputs(inputs);
  console.log(JSON.stringify({ exitCode: result.exitCode, nativeStatus: report?.status,
    collisions: report?.collisions, displayChecks: report?.displayChecks, stderr: result.stderr }));
  if (result.exitCode !== 0) process.exitCode = 1;
}

function preserve(figure) {
  const base = `${work}/${figure}`, rejected = `${base}.rejected-initial`;
  assert(!fs.existsSync(rejected));
  assert(!fs.existsSync(`${base}.repair-evidence.json`));
  const first = read(`${base}.attempts.json`);
  assert.equal(first.targetedRepairs, 0);
  fs.mkdirSync(rejected);
  const preserved = [];
  for (const suffix of ['spec.json', 'svg', 'png', 'render.json', 'render-command.json', 'attempts.json']) {
    const file = `${base}.${suffix}`;
    if (!fs.existsSync(file)) continue;
    const destination = `${rejected}/${figure}.${suffix}`;
    fs.copyFileSync(file, destination, fs.constants.COPYFILE_EXCL);
    assert.equal(bind(file).sha256, bind(destination).sha256);
    preserved.push(bind(destination));
  }
  saveNew(`${rejected}/preservation.json`, {
    figure, initialFailureCount: first.initialFailureCount, preserved, maximumRepairs: 1,
    scope: 'Preserved initial attempt for at most one defect-specific manual repair; not an independent review.',
  });
}

async function previews(figure) {
  const { inputs } = inputsFor(figure), base = `${work}/${figure}`;
  assert(!fs.existsSync(`${base}.preview-manifest.json`), 'No repeated actual-width preview generation.');
  currentInputs(read(`${base}.context.json`).inputs);
  const report = read(`${base}.render.json`);
  verify(report.spec);
  verify(report.output.svg);
  const require = createRequire(path.resolve('.agents/skills/package.json'));
  const { chromium } = require('playwright-core');
  const executablePath = [chromium.executablePath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(file => fs.existsSync(file));
  assert(executablePath, 'Use existing native renderer browser only; no install or user session.');
  const browser = await chromium.launch({ executablePath, headless: true });
  const outputs = [];
  try {
    const page = await browser.newPage({ deviceScaleFactor: 1 });
    await page.route('**/*', route => route.abort());
    await page.setContent(`<style>html,body{margin:0;background:white}#media,svg{display:block}</style><div id="media">${fs.readFileSync(`${base}.svg`, 'utf8')}</div>`);
    const canvas = read(`${base}.spec.json`).canvas;
    for (const width of widths) {
      const height = canvas.height * width / canvas.width;
      await page.setViewportSize({ width, height: Math.ceil(height) });
      await page.evaluate(({ width, height }) => {
        const media = document.querySelector('#media'), svg = document.querySelector('svg');
        media.style.width = `${width}px`; media.style.height = `${height}px`;
        svg.setAttribute('width', width); svg.setAttribute('height', height);
        svg.style.width = `${width}px`; svg.style.height = `${height}px`;
      }, { width, height });
      const metrics = await page.evaluate(() => {
        const media = document.querySelector('#media').getBoundingClientRect();
        return {
          width: media.width, height: media.height,
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          labels: [...document.querySelectorAll('svg text')].map(node => {
            const matrix = node.getScreenCTM(), box = node.getBoundingClientRect();
            return { text: node.textContent, px: Number(node.getAttribute('font-size')) * Math.hypot(matrix.a, matrix.b),
              inside: box.left >= media.left && box.right <= media.right && box.top >= media.top && box.bottom <= media.bottom };
          }),
        };
      });
      assert.equal(metrics.width, width);
      assert(!metrics.horizontalOverflow);
      assert(metrics.labels.every(label => label.px >= 16 && label.inside));
      const file = `${base}.w${width}.png`;
      assert(!fs.existsSync(file));
      await page.screenshot({ path: file, animations: 'disabled' });
      outputs.push({ ...bind(file), width, metrics });
    }
  } finally { await browser.close(); }
  currentInputs(inputs);
  saveNew(`${base}.preview-manifest.json`, {
    figure, inputs, spec: bind(`${base}.spec.json`), context: bind(`${base}.context.json`),
    svg: bind(`${base}.svg`), nativeRender: bind(`${base}.render.json`), previews: outputs,
    status: 'author-actual-width-previews-independent-review-pending',
    browser: { isolatedNativeFigurePreview: true, headless: true, closed: true,
      networkDisabled: true, userProfile: false, classroomBrowserBatch: false },
    independentReview: 'pending-Mencius-only',
  });
  console.log(JSON.stringify(bind(`${base}.preview-manifest.json`)));
}

function freeze() {
  const figures = ['fig-99', 'fig-100'].map(figure => {
    const { lessonId, fullText, inputs } = inputsFor(figure), base = `${work}/${figure}`;
    const context = read(`${base}.context.json`), spec = read(`${base}.spec.json`);
    const native = read(`${base}.render.json`), preview = read(`${base}.preview-manifest.json`);
    const observations = read(`${base}.author-pixel-observations.json`);
    currentInputs(inputs);
    currentInputs(context.inputs);
    assert.equal(spec.source.authoritativeText[0].text, fullText);
    verify(native.spec);
    verify(native.output.svg);
    assert.deepEqual(preview.inputs, inputs);
    for (const item of preview.previews) verify(item);
    assert.deepEqual(observations.inspected.map(item => item.width), widths);
    for (const item of observations.inspected) {
      verify(item);
      assert.equal(item.actuallyOpened, true);
    }
    const attempts = read(`${base}.attempts.json`);
    const repairFile = `${base}.repair-evidence.json`;
    const repair = fs.existsSync(repairFile) ? read(repairFile) : null;
    const targetedRepairs = repair?.targetedRepairs ?? attempts.targetedRepairs;
    assert(targetedRepairs <= 1);
    const blocked = native.status !== 'pass' || observations.hardBlockers.length > 0;
    return {
      figure, lesson: lessonId, status: blocked ? 'author-blocked' : 'author-frozen-independent-review-pending',
      inputs, fullAuthoritativeTextSha256: hash(fullText),
      sourceInventory: inputs.sourceInventory, context: bind(`${base}.context.json`),
      spec: bind(`${base}.spec.json`), initialSpec: bind(`${base}.initial.spec.json`),
      svg: bind(`${base}.svg`), canvasPng: bind(`${base}.png`), nativeRender: bind(`${base}.render.json`),
      authorAssertions: bind(`${base}.author-assertions.json`), attempts: bind(`${base}.attempts.json`),
      initialFailureCount: attempts.initialFailureCount, targetedRepairs, remainingRepairs: 1 - targetedRepairs,
      repairEvidence: repair ? bind(repairFile) : null,
      previewManifest: bind(`${base}.preview-manifest.json`), previews: preview.previews,
      authorObservations: bind(`${base}.author-pixel-observations.json`),
      nativeRenderStatus: native.status, hardBlockers: observations.hardBlockers,
      sourceFindings: observations.sourceFindings,
      independentFigureSCIGate: 'pending-Mencius-only', promoted: false,
    };
  });
  const output = `${ticket}/d016-figures-author-freeze.json`;
  saveNew(output, {
    ticket: 'STEMROBIN-181', stage: 'D016', author: 'Einstein',
    status: figures.some(figure => figure.status === 'author-blocked')
      ? 'author-frozen-with-blockers' : 'author-frozen-independent-review-pending',
    figures, helper: bind(helper), renderer: bind(renderer), nativeContextAPI: bind(contextAPI),
    actualWidths: widths, modelWidth: 640, modelLabelPx: 32, minimumDisplayedTextPx: 16,
    maximumRepairsPerFigure: 1, modelCalls: 0, inFlightProcesses: [],
    independentReview: 'pending-Mencius-only', promoted: false,
    limits: 'Author-only scratch figures99/100. Full frozen prose and actual source PNG inventories bound. No independent gate approval, promotion, other figures, source/prose/tool/app/dependency/DB/git edits, network or classroom browser batch.',
  });
  console.log(JSON.stringify(bind(output)));
}

if (command === 'plan') plan(id);
else if (command === 'render') render(id);
else if (command === 'preserve') preserve(id);
else if (command === 'repair-render') render(id, true);
else if (command === 'previews') await previews(id);
else if (command === 'freeze') freeze();
else throw new Error('Use plan/render/preserve/repair-render/previews/freeze; figure99/100 only.');
