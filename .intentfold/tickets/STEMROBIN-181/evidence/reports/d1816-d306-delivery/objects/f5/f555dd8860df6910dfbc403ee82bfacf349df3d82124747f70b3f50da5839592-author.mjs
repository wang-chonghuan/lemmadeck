import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root);
const own = path.dirname(fileURLToPath(import.meta.url));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: path.resolve(file), sha256: sha(file), bytes: fs.statSync(file).size });
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
const sourceRoot = '.tmp/STEMROBIN-181/d1816-d276';
const zhFile = `${sourceRoot}/source-work/adapt/10p/modern-us-neutral/lessons/phy10-c1-s3-n18/lesson.template.json`;
const enFile = `${sourceRoot}/source-work/adapt/10p/modern-us-neutral-en/lessons/phy10-c1-s3-n18/lesson.template.json`;
const n19SourceFile = `${sourceRoot}/root/10p/lessons/phy10-c1-s3-n19/lesson.json`;
const n19FreezeFile = '.intentfold/tickets/STEMROBIN-181/evidence/reports/10p-n19-prose-freeze.json';
const zh = read(zhFile);
const en = read(enFile);
const n19 = read(n19FreezeFile).proseFlow.paragraphs;
assert.equal(zh.id, 'phy10-c1-s3-n18');
assert.equal(en.id, zh.id);
assert.equal(n19.length, 10);
const nonfig = lesson => lesson.prose.filter(block => block.kind !== 'fig');
const lessonText = lesson => [lesson.chapter, lesson.printed_title,
  ...nonfig(lesson).map(block => block.text)].filter(Boolean).join('\n\n');
const authoritativeText = [
  { lesson: zh.id, text: `Current complete ZH N18 draft (not final approval):\n${lessonText(zh)}` },
  { lesson: en.id, text: `Current complete EN N18 draft (not final approval):\n${lessonText(en)}` },
  { lesson: 'phy10-c1-s3-n19', text:
    `Current retained ZH N19 modern prose (all ten proseFlow paragraphs; raw N19 source is not modern authority):\n${n19.map(block => block.text).join('\n\n')}` },
];
const textBinding = {
  schema: 'd281/authoritative-text-freeze@1',
  status: 'current-drafts-and-retained-prose-bound-not-final-review',
  n18: {
    zh: { ...bind(zhFile), edition: zh.edition, title: zh.title, nonfig: nonfig(zh) },
    en: { ...bind(enFile), edition: en.edition, title: en.title, nonfig: nonfig(en) },
  },
  n19: {
    retainedZh: { ...bind(n19FreezeFile), paragraphs: n19 },
    rawSourceContextOnly: bind(n19SourceFile),
    english: { status: 'not-yet-bound', text: null },
  },
  authoritativeText,
  pending: 'Parent must bind shared full bilingual final text and independent review later.',
};
write(path.join(own, 'text-freeze.json'), textBinding);

const symbol = value => ({
  q_m: 'q\u2098', '-q_m': '\u2212q\u2098',
  q: 'q', '-q': '\u2212q', I_m: 'I\u2098', i: 'i',
}[value] || value);

function builder(id, height, inventory) {
  const objects = [];
  const assertions = [];
  const groups = [];
  const P = ([x, y]) => [x, height - y];
  const add = object => { objects.push(object); return object.id; };
  const check = assertion => { assertions.push(assertion); return assertion.id; };
  const point = (id, at, visible = false) => add({
    id, type: 'point', at: P(at), visible, size: 3, stroke: 'ink', fill: 'paper',
  });
  const edge = (id, from, to, extra = {}) => {
    add({ id, type: 'segment', from: P(from), to: P(to),
      stroke: 'ink', strokeWidth: 3, ...extra });
    check({ id: `${id}-connects`, type: 'connects', arrow: id, from: P(from), to: P(to) });
    return id;
  };
  const label = (id, at, text, fontSize = 18) => add({
    id, type: 'text', at: P(at), text, fontSize, fontWeight: 500,
    labelColor: 'ink', labelPlacement: { position: 'CENTER' },
  });
  const arrow = (id, from, to) => {
    add({ id, type: 'arrow', from: P(from), to: P(to), stroke: 'accent', strokeWidth: 3 });
    check({ id: `${id}-connects`, type: 'connects', arrow: id, from: P(from), to: P(to) });
    check({ id: `${id}-direction`, type: 'displacement', from: P(from), to: P(to),
      dx: to[0] - from[0], dy: from[1] - to[1] });
  };
  const circle = (id, center, radius, fill = 'paper') => add({
    id, type: 'circle', center: P(center), radius, fill, fillOpacity: 1,
    stroke: 'ink', strokeWidth: 3,
  });
  const group = (prefix, description, startObjects, startAssertions) => {
    groups.push({
      id: prefix, description,
      objects: objects.slice(startObjects).filter(object => object.visible !== false).map(object => object.id),
      assertions: assertions.slice(startAssertions).map(assertion => assertion.id),
    });
  };
  const coil = (prefix, x, top, radius = 20) => {
    for (let n = 0; n < 4; n++) {
      const y = top + radius * (2 * n + 1);
      add({ id: `${prefix}-coil-lobe-${n + 1}`, type: 'arc',
        center: P([x, y]), start: P([x, y + radius]), end: P([x, y - radius]),
        stroke: 'ink', strokeWidth: 3 });
      check({ id: `${prefix}-coil-lobe-${n + 1}-diameter`, type: 'distance',
        a: P([x, y - radius]), b: P([x, y + radius]), value: radius * 2 });
    }
  };
  const capacitor = (prefix, x, upper, lower, halfWidth, state) => {
    edge(`${prefix}-cap-upper`, [x - halfWidth, upper], [x + halfWidth, upper], { strokeWidth: 5 });
    edge(`${prefix}-cap-lower`, [x - halfWidth, lower], [x + halfWidth, lower], { strokeWidth: 5 });
    check({ id: `${prefix}-plates-parallel`, type: 'parallel',
      a: P([x - halfWidth, upper]), b: P([x + halfWidth, upper]),
      c: P([x - halfWidth, lower]), d: P([x + halfWidth, lower]) });
    if (state.upperLabel) {
      label(`${prefix}-charge-upper`, [x + halfWidth + 30, upper], symbol(state.upperLabel));
      label(`${prefix}-charge-lower`, [x + halfWidth + 30, lower], symbol(state.lowerLabel));
    }
    const positions = state.signsPerPlate === 4 ? [-27, -9, 9, 27] : [-20, 20];
    if (state.signsPerPlate) {
      for (const [n, offset] of positions.entries()) {
        label(`${prefix}-sign-upper-${n + 1}`, [x + offset, upper + (lower - upper) * 0.34],
          state.upperSigns === '-' ? '\u2212' : '+', 16);
        label(`${prefix}-sign-lower-${n + 1}`, [x + offset, upper + (lower - upper) * 0.68],
          state.lowerSigns === '-' ? '\u2212' : '+', 16);
      }
    }
  };
  const spring = (prefix, x, support, massY, equilibriumY, kind, referenceExtent) => {
    const startObjects = objects.length;
    const startAssertions = assertions.length;
    edge(`${prefix}-support-top`, [x - 36, support - 7], [x + 36, support - 7]);
    edge(`${prefix}-support-bottom`, [x - 36, support], [x + 36, support]);
    for (let n = 0; n < 8; n++) {
      edge(`${prefix}-support-hatch-${n + 1}`, [x - 34 + n * 9, support - 7],
        [x - 28 + n * 9, support], { stroke: 'muted', strokeWidth: 2 });
    }
    const top = support + 10;
    const bottom = massY - 14;
    edge(`${prefix}-spring-top-link`, [x, support], [x, top]);
    let from = [x, top];
    for (let n = 1; n <= 10; n++) {
      const to = [x + (n % 2 ? 11 : -11), top + (bottom - top) * n / 11];
      edge(`${prefix}-spring-zig-${n}`, from, to);
      from = to;
    }
    edge(`${prefix}-spring-bottom-link`, from, [x, bottom]);
    circle(`${prefix}-mass`, [x, massY], 14, 'ink');
    edge(`${prefix}-equilibrium-reference`, [referenceExtent[0], equilibriumY],
      [referenceExtent[1], equilibriumY], { dash: 3, stroke: 'muted' });
    const eq = point(`${prefix}-equilibrium-anchor`, [x, equilibriumY]);
    const mass = point(`${prefix}-mass-anchor`, [x, massY]);
    check({ id: `${prefix}-mass-reference-displacement`, type: 'displacement',
      from: eq, to: mass, dx: 0, dy: equilibriumY - massY });
    if (kind === 'velocity') {
      edge(`${prefix}-mass-position-extension`, [x + 14, massY], [referenceExtent[1], massY]);
      label(`${prefix}-maximum-velocity`, [x + 66, massY - 29], 'v\u20d7\u2098', 20);
    } else {
      const markerX = referenceExtent[1] - 35;
      edge(`${prefix}-mass-position-extension`, [x + 14, massY], [referenceExtent[1], massY]);
      edge(`${prefix}-displacement-marker`, [markerX, Math.min(massY, equilibriumY) - 30],
        [markerX, Math.max(massY, equilibriumY) + 35]);
      label(`${prefix}-maximum-displacement`, [markerX + 30, (massY + equilibriumY) / 2], 'x\u20d7\u2098', 20);
      check({ id: `${prefix}-marker-span`, type: 'distance',
        a: P([markerX, massY]), b: P([markerX, equilibriumY]), value: Math.abs(massY - equilibriumY) });
    }
    label(`${prefix}-equilibrium-label`, [referenceExtent[0] + 83, equilibriumY + 29],
      'Equilibrium', 18);
    group(prefix, inventory.groups.find(item => item.id === prefix)?.description ||
      inventory.groups.find(item => item.id.endsWith('-b')).description, startObjects, startAssertions);
  };
  return { objects, assertions, groups, P, add, check, point, edge, label, arrow,
    circle, group, coil, capacitor, spring };
}

function figure28(inventory) {
  const height = 760;
  const b = builder('fig-28', height, inventory);
  b.label('f28-a-label', [320, 25], 'a', 20);
  for (const [index, active] of [1, 2].entries()) {
    const prefix = `f28-a-contact${active}`;
    const startObjects = b.objects.length;
    const startAssertions = b.assertions.length;
    const offset = index * 320;
    const capX = offset + 145;
    const batteryX = offset + 38;
    const coilX = offset + 258;
    const pivot = [capX, 125];
    const c1 = [offset + 115, 75];
    const c2 = [offset + 192, 75];
    b.edge(`${prefix}-battery-top-wire`, [batteryX, 75], c1);
    b.edge(`${prefix}-coil-top-wire`, c2, [coilX, 75]);
    b.edge(`${prefix}-coil-upper-link`, [coilX, 75], [coilX, 110]);
    b.coil(prefix, coilX, 110);
    b.edge(`${prefix}-coil-bottom-link`, [coilX, 270], [coilX, 315]);
    b.edge(`${prefix}-bottom-wire`, [batteryX, 315], [coilX, 315]);
    b.edge(`${prefix}-cap-bottom-link`, [capX, 250], [capX, 315]);
    b.edge(`${prefix}-cap-top-link`, pivot, [capX, 170]);
    b.capacitor(prefix, capX, 170, 250, 36, {
      upperLabel: 'q_m', lowerLabel: '-q_m',
      upperSigns: '+', lowerSigns: '-', signsPerPlate: 4,
    });
    b.edge(`${prefix}-battery-upper-link`, [batteryX, 75], [batteryX, 142]);
    for (let n = 0; n < 2; n++) {
      const y = 142 + n * 85;
      b.edge(`${prefix}-cell-${n + 1}-positive-plate`, [batteryX - 17, y], [batteryX + 17, y], { strokeWidth: 4 });
      b.edge(`${prefix}-cell-${n + 1}-negative-plate`, [batteryX - 9, y + 16], [batteryX + 9, y + 16], { strokeWidth: 4 });
      b.label(`${prefix}-cell-${n + 1}-positive-sign`, [batteryX - 26, y - 18], '+', 16);
      b.label(`${prefix}-cell-${n + 1}-negative-sign`, [batteryX - 26, y + 30], '\u2212', 16);
      if (n === 0) b.edge(`${prefix}-cell-series-wire`, [batteryX, y + 16], [batteryX, y + 85], { dash: 2 });
    }
    b.edge(`${prefix}-battery-bottom-link`, [batteryX, 243], [batteryX, 315]);
    b.circle(`${prefix}-contact1`, c1, 4);
    b.circle(`${prefix}-contact2`, c2, 4);
    b.circle(`${prefix}-pivot`, pivot, 4);
    b.edge(`${prefix}-switch-blade`, pivot, active === 1 ? c1 : c2);
    b.label(`${prefix}-contact1-label`, [c1[0], 48], '1', 18);
    b.label(`${prefix}-contact2-label`, [c2[0], 48], '2', 18);
    b.label(`${prefix}-state-label`, [offset + 156, 348],
      active === 1 ? 'Contact 1: charging' : 'Contact 2: LC loop', 18);
    b.check({ id: `${prefix}-open-contact-gap`, type: 'distance',
      a: b.P(active === 1 ? c1 : c2), b: b.P(active === 1 ? c2 : c1), value: 77 });
    b.group(prefix, inventory.groups.find(item => item.id === prefix).description, startObjects, startAssertions);
  }
  b.label('f28-b-label', [320, 409], 'b', 20);
  b.spring('f28-b', 280, 456, 659, 589, 'displacement', [83, 571]);
  return finishSpec('fig-28', height, inventory, b,
    'Switching a charged capacitor from the two-cell battery (contact 1) to the LC circuit (contact 2), both within group a; spring initial displacement in group b shared with N19.');
}

function figure29(inventory) {
  const height = 1040;
  const b = builder('fig-29', height, inventory);
  b.label('f29-a-first-heading', [320, 30], 'First quarter-period', 20);
  b.label('f29-a-second-heading', [320, 335], 'Second quarter-period', 20);
  for (const [index, state] of inventory.states.entries()) {
    const prefix = state.id;
    const startObjects = b.objects.length;
    const startAssertions = b.assertions.length;
    const x = 18 + (index % 3) * 210;
    const y = index < 3 ? 0 : 305;
    const capX = x + 36;
    const coilX = x + 164;
    b.edge(`${prefix}-top-wire`, [capX, y + 75], [coilX, y + 75]);
    b.edge(`${prefix}-bottom-wire`, [capX, y + 267], [coilX, y + 267]);
    b.edge(`${prefix}-cap-top-link`, [capX, y + 75], [capX, y + 120]);
    b.edge(`${prefix}-cap-bottom-link`, [capX, y + 200], [capX, y + 267]);
    b.capacitor(prefix, capX, y + 120, y + 200, 34, state);
    b.edge(`${prefix}-coil-top-link`, [coilX, y + 75], [coilX, y + 104]);
    b.coil(prefix, coilX, y + 104, 18);
    b.edge(`${prefix}-coil-bottom-link`, [coilX, y + 248], [coilX, y + 267]);
    if (state.currentArrow) {
      b.arrow(`${prefix}-current-arrow`, [x + 135, y + 116], [x + 135, y + 222]);
      b.label(`${prefix}-current-label`, [x + 108, y + 163], symbol(state.currentLabel), 20);
    }
    b.group(prefix, `${state.row}, column ${state.column}: ${state.chargeState}; ${state.currentState}. Four coil lobes and unchanged current direction.`,
      startObjects, startAssertions);
  }
  b.label('f29-a-label', [320, 603], 'a', 20);
  b.label('f29-b-first-heading', [160, 650], 'First quarter-period', 18);
  b.label('f29-b-second-heading', [480, 650], 'Second quarter-period', 18);
  b.spring('f29-b-first', 155, 701, 902, 902, 'velocity', [25, 291]);
  b.spring('f29-b-second', 470, 701, 852, 902, 'displacement', [340, 614]);
  b.label('f29-b-label', [320, 1002], 'b', 20);
  return finishSpec('fig-29', height, inventory, b,
    'All six source LC states across first and second quarter-periods, including both zero-charge maximum-current drawings, plus both corresponding spring pictures in group b, shared with N19.');
}

function finishSpec(id, height, inventory, b, description) {
  const groups = inventory.groups.filter(item => item.children).map(item => ({
    id: item.id, description: item.description,
    objects: b.objects.filter(object => object.id.startsWith(`${item.id}-`) &&
      object.visible !== false).map(object => object.id),
    assertions: b.assertions.filter(assertion => assertion.id.startsWith(`${item.id}-`)).map(assertion => assertion.id),
  }));
  return {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
    source: { image: { path: path.resolve(inventory.source.path), sha256: inventory.source.sha256 },
      authoritativeText, inventory: [...groups, ...b.groups] },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0],
      background: 'paper', keepAspectRatio: true },
    display: { layout: 'scroll', purpose: 'instructional', minTextPx: 16, widths: [640] },
    objects: b.objects, assertions: b.assertions, layout: { minLabelGap: 2 },
  };
}

for (const [id, build] of [['fig-28', figure28], ['fig-29', figure29]]) {
  const inventoryFile = path.join(own, `${id}.inventory.json`);
  const inventory = read(inventoryFile);
  assert.equal(sha(inventory.source.path), inventory.source.sha256);
  const folder = path.join(own, 'first', id);
  fs.mkdirSync(folder, { recursive: true });
  const spec = build(inventory);
  write(path.join(folder, 'spec.json'), spec);
  write(path.join(folder, 'inventory-bindings.json'), {
    schema: 'd281/inventory-object-assertion-bindings@1',
    independentInventory: bind(inventoryFile),
    source: bind(inventory.source.path),
    modernAdditions: inventory.modernAdditions,
    mappings: spec.source.inventory,
    limitations: 'Native assertions execute geometry/topology. Source-state polarity/count correspondence requires the scoped semantic assertion report and later independent review.',
  });
}
write(path.join(own, 'input-freeze.json'), {
  schema: 'd281/input-bindings@1',
  textFreeze: bind(path.join(own, 'text-freeze.json')),
  inputs: [zhFile, enFile, n19SourceFile, n19FreezeFile,
    `${sourceRoot}/root/10p/figures/fig-28.png`, `${sourceRoot}/root/10p/figures/fig-29.png`,
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.agents/skills/ld-s10y-image/references/figure-spec.md',
    '.agents/skills/ld-s10y-image/references/routing.md',
    '.agents/skills/ld-s10y-image/references/generation.md',
    '.agents/skills/ld-s10y-image/references/quality-gate.md',
    '.claude/skills/ld-s10y-lesson/references/production-resume.md',
    '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
    '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
    '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/preview-d118-n19-existing-svg.mjs',
    '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/recover-d261-n44-preview.mjs',
  ].map(bind),
  sourceAuthority: 'Edition text controls semantics; PNG controls visual structure. Raw N19 is context only. English N19 not yet bound.',
});
console.log(JSON.stringify({
  status: 'first-candidates-authored', textFreeze: bind(path.join(own, 'text-freeze.json')),
  figures: ['fig-28', 'fig-29'].map(id => bind(path.join(own, 'first', id, 'spec.json'))),
  imageLoads: 4, paidCalls: 0, reviewPassWritten: false, canonicalPromotion: false,
}));
