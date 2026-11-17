import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const base = path.dirname(fileURLToPath(import.meta.url));
assert.equal(process.cwd(), root);
const hash = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write = (p, j) => fs.writeFileSync(p, `${JSON.stringify(j, null, 2)}\n`, { flag: 'wx' });
const source = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-114.png');
const sourceSHA = 'b87f6b0a98c6948fd384c61818fecc1c59507aa2e203587201dc26b408e3e96e';
assert.equal(hash(source), sourceSHA);
assert.equal(hash(path.join(base, '../author-freeze.json')), '0fcf6458cdd6f5447a13185b9a87cf5b0aca2e93e12608296e56d17421a03050');
assert.equal(hash(path.join(base, '../frozen/evidence/source-inventory.json')), 'd5bce351452a229bfb67d9454c62ecddc376e839f7ba796ad74353cdaf15a9ea');

const height = 520;
const at = (x, y) => [x, height - y];
const objects = [];
const assertions = [];
const groups = new Map();
const group = (id, description) => {
  groups.set(id, { id, description, objects: [], assertions: [] });
};
group('src-tube', 'Source: circular triode enclosure, upper plate, broken grid, separate curved cathode and filament with two descending unconnected heater leads. The anode, grid and cathode connect to the source circuit, not to invented power sources.');
group('src-upper-coils-capacitor', 'Source: two coupled upper windings; the right winding and two-plate capacitor share upper/lower buses; left winding connects grid to cathode return. Coil glyph curvature is regularized; lobes are not a measured turn count.');
group('src-lower-transformer-dc', 'Source: lower transformer with two windings and a core; left winding is in series with the two-cell DC branch, right winding goes to two external terminals. Two DC cells retain short plate on the left and long plate on the right. There are no source printed + or - marks or voltage values.');
group('src-oscilloscope', 'Source: rectangular oscilloscope, one circular screen with one variable-height rapid trace, and two terminals connected across the LC buses. No source axes, calibrated zeros, endpoint values, or independent envelope exist.');
group('src-circuit-connections', 'Source: retain the electrical nets and visible bus junctions of the one connected apparatus. The lower transformer primary is electrically isolated from the series secondary; coupling is magnetic. The two heater leads remain unconnected as drawn.');

const add = (obj, gid) => {
  objects.push(obj);
  if (gid) groups.get(gid).objects.push(obj.id);
  return obj.id;
};
const fact = (a, gid) => {
  assertions.push(a);
  if (gid) groups.get(gid).assertions.push(a.id);
};
const node = (id, x, y, visible = false, terminal = false) => add({
  id, type: 'point', at: at(x, y), visible,
  size: terminal ? 4 : 3, strokeWidth: 2, stroke: 'ink',
  fill: terminal ? 'paper' : 'ink',
  provenance: { kind: 'source-topology', note: 'Position is modern layout, not a source coordinate value.' },
}, visible ? 'src-circuit-connections' : null);
const segment = (id, from, to, gid, wire = false, extra = {}) => {
  add({
    id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 3,
    provenance: { kind: wire ? 'source-wire' : 'source-component-symbol' },
    ...extra,
  }, gid);
  fact({ id: `${id}-connects`, type: 'connects', arrow: id, from, to }, gid);
};
const wire = (id, from, to) => segment(id, from, to, 'src-circuit-connections', true);
const circle = (id, x, y, radius, gid) => add({
  id, type: 'circle', center: at(x, y), radius,
  stroke: 'ink', strokeWidth: 3, fillOpacity: 0,
}, gid);
const arc = (id, center, start, end, gid) => {
  add({ id, type: 'arc', center, start, end, stroke: 'ink', strokeWidth: 3 }, gid);
  const radius = Math.hypot(start[0] - center[0], start[1] - center[1]);
  fact({ id: `${id}-start`, type: 'pointOnCircle', point: start, center, radius }, gid);
  fact({ id: `${id}-end`, type: 'pointOnCircle', point: end, center, radius }, gid);
};
const winding = (id, x, y, side, gid) => {
  const r = 14;
  for (let i = 0; i < 3; i++) {
    const top = at(x, y + i * r * 2);
    const bottom = at(x, y + (i + 1) * r * 2);
    arc(`${id}-lobe-${i + 1}`, at(x, y + (2 * i + 1) * r),
      side === 'right' ? bottom : top, side === 'right' ? top : bottom, gid);
  }
};
const label = (id, x, y, text, basis) => add({
  id, type: 'text', at: at(x, y), text, fontSize: 18, fontWeight: 500,
  labelPlacement: { position: 'CENTER' },
  provenance: {
    kind: 'modern-addition-notation',
    basis,
    notSourceTranscription: true,
  },
});

node('tube-anode', 85, 158);
node('anode-top-left', 85, 50);
node('anode-top-right', 245, 50);
node('lc-top', 245, 180, true);
node('tube-grid', 120, 180);
node('feedback-top', 175, 180);
node('feedback-bottom', 175, 264);
node('cathode-return', 135, 264, true);
node('tube-cathode', 115, 216);
node('cathode-elbow', 135, 216);
node('heater-left-top', 66, 221);
node('heater-right-top', 104, 221);
node('heater-left-terminal', 66, 284);
node('heater-right-terminal', 104, 284);
node('tank-coil-top', 204, 180);
node('tank-coil-bottom', 204, 264);
node('lc-bottom', 245, 264, true);
node('capacitor-top-bus', 300, 180, true);
node('capacitor-bottom-bus', 300, 264, true);
node('capacitor-top-plate', 300, 216);
node('capacitor-bottom-plate', 300, 232);
node('scope-top-elbow-a', 430, 180);
node('scope-top-elbow-b', 430, 230);
node('scope-top-terminal', 495, 230, true, true);
node('scope-bottom-terminal', 554, 264, true, true);
node('series-top-elbow', 245, 304);
node('secondary-top-elbow', 270, 304);
node('secondary-top', 270, 322);
node('secondary-bottom', 270, 406);
node('dc-positive-elbow', 270, 435);
node('dc-positive', 240, 435);
node('dc-negative-elbow', 135, 435);
node('dc-negative', 170, 435);
node('cell1-positive', 180, 435);
node('cell2-negative', 230, 435);
node('audio-primary-top', 320, 322);
node('audio-primary-bottom', 320, 406);
node('audio-input-top', 400, 322, true, true);
node('audio-input-bottom', 400, 406, true, true);

circle('tube-envelope', 85, 180, 48, 'src-tube');
segment('tube-anode-plate', at(70, 158), at(100, 158), 'src-tube', false, { strokeWidth: 5 });
for (const [i, x1, x2] of [[1, 50, 66], [2, 76, 92], [3, 102, 120]]) {
  segment(`tube-grid-stroke-${i}`, at(x1, 180), at(x2, 180), 'src-tube');
}
arc('tube-cathode-arc', at(85, 238), at(115, 216), at(55, 216), 'src-tube');
arc('tube-filament-arc', at(85, 249), at(104, 221), at(66, 221), 'src-tube');
segment('heater-left-lead', 'heater-left-top', 'heater-left-terminal', 'src-tube');
segment('heater-right-lead', 'heater-right-top', 'heater-right-terminal', 'src-tube');
wire('anode-riser', 'tube-anode', 'anode-top-left');
wire('anode-top-wire', 'anode-top-left', 'anode-top-right');
wire('anode-lc-wire', 'anode-top-right', 'lc-top');
wire('grid-feedback-wire', 'tube-grid', 'feedback-top');
wire('feedback-return-wire', 'feedback-bottom', 'cathode-return');
wire('cathode-lead', 'tube-cathode', 'cathode-elbow');
wire('cathode-return-wire', 'cathode-elbow', 'cathode-return');

winding('feedback-winding', 175, 180, 'right', 'src-upper-coils-capacitor');
winding('tank-winding', 204, 180, 'left', 'src-upper-coils-capacitor');
wire('tank-coil-top-wire', 'tank-coil-top', 'lc-top');
wire('tank-coil-bottom-wire', 'tank-coil-bottom', 'lc-bottom');
wire('lc-upper-bus', 'lc-top', 'capacitor-top-bus');
wire('lc-lower-bus', 'lc-bottom', 'capacitor-bottom-bus');
wire('capacitor-top-lead', 'capacitor-top-bus', 'capacitor-top-plate');
wire('capacitor-bottom-lead', 'capacitor-bottom-plate', 'capacitor-bottom-bus');
segment('capacitor-upper-plate', at(284, 216), at(316, 216), 'src-upper-coils-capacitor', false, { strokeWidth: 5 });
segment('capacitor-lower-plate', at(284, 232), at(316, 232), 'src-upper-coils-capacitor', false, { strokeWidth: 5 });
fact({
  id: 'capacitor-plates-parallel', type: 'parallel',
  a: at(284, 216), b: at(316, 216), c: at(284, 232), d: at(316, 232),
}, 'src-upper-coils-capacitor');

wire('series-secondary-bus-lead', 'lc-bottom', 'series-top-elbow');
wire('series-secondary-elbow', 'series-top-elbow', 'secondary-top-elbow');
wire('series-secondary-top-lead', 'secondary-top-elbow', 'secondary-top');
winding('audio-secondary-winding', 270, 322, 'right', 'src-lower-transformer-dc');
winding('audio-primary-winding', 320, 322, 'left', 'src-lower-transformer-dc');
for (const [i, x] of [[1, 295], [2, 299]]) {
  segment(`audio-transformer-core-${i}`, at(x, 318), at(x, 410), 'src-lower-transformer-dc');
}
wire('series-secondary-bottom-lead', 'secondary-bottom', 'dc-positive-elbow');
wire('dc-positive-wire', 'dc-positive-elbow', 'dc-positive');
wire('dc-negative-wire', 'cathode-return', 'dc-negative-elbow');
wire('dc-negative-bottom-wire', 'dc-negative-elbow', 'dc-negative');
wire('dc-intercell-wire', 'cell1-positive', 'cell2-negative');
for (const [id, x, half, width] of [
  ['cell1-short-plate', 170, 10, 5], ['cell1-long-plate', 180, 24, 3],
  ['cell2-short-plate', 230, 10, 5], ['cell2-long-plate', 240, 24, 3],
]) {
  segment(id, at(x, 435 - half), at(x, 435 + half), 'src-lower-transformer-dc', false, { strokeWidth: width });
}
wire('audio-primary-upper-lead', 'audio-primary-top', 'audio-input-top');
wire('audio-primary-lower-lead', 'audio-primary-bottom', 'audio-input-bottom');
for (const [id, y] of [['audio-terminal-upper-slash', 322], ['audio-terminal-lower-slash', 406]]) {
  segment(id, at(392, y + 8), at(408, y - 8), 'src-lower-transformer-dc');
}

add({
  id: 'scope-frame', type: 'polygon',
  points: [at(470, 50), at(615, 50), at(615, 292), at(470, 292)],
  stroke: 'ink', strokeWidth: 3, fill: 'paper', fillOpacity: 0,
}, 'src-oscilloscope');
circle('scope-screen', 542, 130, 52, 'src-oscilloscope');
wire('scope-upper-lead-a', 'capacitor-top-bus', 'scope-top-elbow-a');
wire('scope-upper-lead-b', 'scope-top-elbow-a', 'scope-top-elbow-b');
wire('scope-upper-lead-c', 'scope-top-elbow-b', 'scope-top-terminal');
wire('scope-lower-lead', 'capacitor-bottom-bus', 'scope-bottom-terminal');

// An uncalibrated mathematical schematic, not digitized source samples.
const trace = [];
for (let i = 0; i <= 180; i++) {
  const t = i / 180;
  const envelope = 12 + 17 * Math.sin(Math.PI * t) ** 2;
  trace.push(at(502 + 80 * t, 130 - envelope * Math.sin(12 * Math.PI * t)));
}
for (let i = 0; i < trace.length - 1; i++) {
  add({
    id: `scope-trace-${String(i).padStart(3, '0')}`, type: 'segment',
    from: trace[i], to: trace[i + 1], stroke: 'ink', strokeWidth: 2,
    provenance: {
      kind: 'modern-schematic-regularization',
      notSourceSamples: true,
      basis: 'Source has one rapid variable-height trace on a screen; edition describes AM. Domain, frequency ratio, amplitude parameters and endpoints are layout choices, not source values.',
    },
  }, 'src-oscilloscope');
  fact({
    id: `scope-trace-inside-${i}`, type: 'inside', point: trace[i],
    container: 'scope-frame', margin: 8,
  }, 'src-oscilloscope');
}
fact({ id: 'scope-last-trace-inside', type: 'inside', point: trace.at(-1), container: 'scope-frame', margin: 8 }, 'src-oscilloscope');
fact({ id: 'scope-top-terminal-inside', type: 'inside', point: 'scope-top-terminal', container: 'scope-frame', margin: 12 }, 'src-oscilloscope');
fact({ id: 'scope-bottom-terminal-inside', type: 'inside', point: 'scope-bottom-terminal', container: 'scope-frame', margin: 12 }, 'src-oscilloscope');

label('modern-triode-name', 85, 318, 'Triode', 'p0154#2 names the triode; original symbol has no printed name.');
label('modern-capacitor-notation', 338, 224, 'C', 'Modern notation for the source two-plate capacitor, not a printed source label.');
label('modern-secondary-notation', 236, 365, 'AC', 'p0154#4: an additional low-frequency AC source is in series with the DC supply.');
label('modern-audio-notation', 412, 365, '~ U_audio', 'p0154#4: primary audio-frequency current and secondary additional supply. U_audio is modern notation, NOT a recovered source suffix.');
label('modern-dc-name', 205, 480, 'DC supply', 'p0154#4: direct-current anode supply; no source numerical voltage.');
label('modern-scope-name', 542, 25, 'Oscilloscope', 'p0154#7 names the oscilloscope.');

const prior = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d065-n58-text-repair/frozen');
const authoritativeText = [];
const textBindings = [];
for (const [locale, sha] of [
  ['zh', 'dc7aa68cac91370fd9e0680c95f649e0da09789a297e5d5bfafa9ce753044074'],
  ['en', '2b970b64f7e710efc4d752402b24f2e2b48f078f02dfc0905c96cebae444b10d'],
]) {
  const p = path.join(prior, locale, 'lesson.template.json');
  assert.equal(hash(p), sha);
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const relevant = j.prose.filter(item => item.kind === 'p' && item.source_refs.some(ref => /^p0154#[2347]$/.test(ref)));
  relevant.forEach(item => authoritativeText.push({ lesson: j.id, text: item.text }));
  textBindings.push({ locale, path: p, sha256: sha, refs: relevant.flatMap(item => item.source_refs) });
}
const spec = {
  schema: 'ld-s10y-image/figure-spec@2',
  id: 'fig-114',
  mode: 'deterministic',
  description: 'Inspect the source vacuum-tube amplitude-modulation apparatus: an AC transformer secondary is in series with the DC anode supply, and the oscilloscope is connected across the LC circuit. SOURCE FACTS: one circuit, four winding glyphs, capacitor, two unequal-plate cells, tube/filament, transformer core, two external audio terminals, two scope terminals and one screen trace. MODERN ADDITIONS: English component names and U_audio notation are declared on their text objects; original voltage suffix remains unresolved. Layout, regularized coil curves and the uncalibrated variable-height screen trace are not source measurements. No numeric voltage, frequency ratio, modulation depth, envelope curve, calibrated zero or endpoint is asserted as a source value. Author-only candidate, not a complete independent approval.',
  source: {
    image: { path: source, sha256: sourceSHA },
    authoritativeText,
    inventory: [...groups.values()],
  },
  canvas: { width: 640, height, boundingBox: [0, height, 640, 0], background: 'paper', keepAspectRatio: true },
  display: { layout: 'scroll', purpose: 'instructional', minTextPx: 16, widths: [640] },
  objects,
  assertions,
  layout: { minLabelGap: 4 },
};
const dir = path.join(base, 'initial');
fs.mkdirSync(dir);
write(path.join(dir, 'fig-114.spec.json'), spec);
write(path.join(base, 'geometry.json'), {
  schema: 'd067/fig114-apparatus-geometry@1',
  spec: { path: path.join(dir, 'fig-114.spec.json'), sha256: hash(path.join(dir, 'fig-114.spec.json')) },
  textBindings,
  source: { path: source, sha256: sourceSHA, initialPixelInventorySHA: 'd5bce351452a229bfb67d9454c62ecddc376e839f7ba796ad74353cdaf15a9ea' },
  sourceFacts: {
    topologyGroups: [...groups.values()],
    sourceNumericValues: [],
    batteryPlateOrder: ['short-left', 'long-right', 'short-left', 'long-right'],
    printedPolaritySigns: false,
    heaterSupplyAdded: false,
    originalVoltageSuffix: { status: 'unknown', finding: 'N58-FIG114-LABEL-02' },
  },
  components: [
    { id: 'feedback-winding', terminals: ['feedback-top', 'feedback-bottom'], conductive: true },
    { id: 'tank-winding', terminals: ['tank-coil-top', 'tank-coil-bottom'], conductive: true },
    { id: 'series-secondary', terminals: ['secondary-top', 'secondary-bottom'], conductive: true },
    { id: 'audio-primary', terminals: ['audio-primary-top', 'audio-primary-bottom'], conductive: true },
    { id: 'dc-cell1', terminals: ['dc-negative', 'cell1-positive'], conductive: true },
    { id: 'dc-cell2', terminals: ['cell2-negative', 'dc-positive'], conductive: true },
    { id: 'capacitor', terminals: ['capacitor-top-plate', 'capacitor-bottom-plate'], conductive: false },
  ],
  modernAdditions: objects.filter(o => o.provenance?.kind === 'modern-addition-notation'),
  modernRegularization: {
    coordinates: 'Layout-only pixel/user coordinates; not textbook values.',
    coilCurvature: 'Three-lobe standard schematic glyphs, not physical turn counts or winding measurements.',
    screenContrast: 'White screen with dark trace instead of old black screen with light trace.',
    waveform: 'One schematic trace with positive varying height: (502+80t, 130-(12+17 sin(pi*t)^2)*sin(12*pi*t)), 0<=t<=1. These parameters are not source voltages, periods, zero positions, domain or modulation depth. No sampling data is claimed.',
    envelopeDrawn: false,
  },
  localFinding: {
    id: 'N58-FIG114-LABEL-02', status: 'local-HOLD-source-suffix',
    geometryAuthoringBlocked: false,
    modernUAudioIsSourceTranscription: false,
  },
  displayContract: { actualMediaWidthPx: 640, testContainerWidthsPx: [331, 342, 640], minFinalTextPx: 16, layout: 'scroll' },
  crop: {
    path: path.join(base, 'label-02.crop6x.png'),
    sha256: hash(path.join(base, 'label-02.crop6x.png')),
    command: 'sips -c 44 86 --cropOffset 267 336 -z 264 516 ...fig-114.png --out ...label-02.crop6x.png',
    exit: 0,
    expectedRegion: { x: 336, y: 267, width: 86, height: 44, intendedScale: 6 },
    observedOutput: { width: 74, height: 29, openedOnce: true, readableLabel: false },
    finding: 'Technical crop output did not retain a readable requested label. Original bytes kept; no second crop allowed or attempted.',
  },
  authorOnly: true,
  independentReview: 'pending',
});
console.log(JSON.stringify({ spec: path.join(dir, 'fig-114.spec.json'), sha256: hash(path.join(dir, 'fig-114.spec.json')), objects: objects.length, assertions: assertions.length }));
