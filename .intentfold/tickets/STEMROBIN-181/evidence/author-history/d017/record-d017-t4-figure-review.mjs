import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const verifyTree = async value => {
  if (!value || typeof value !== 'object') return;
  if (value.path && value.sha256) assert.equal((await bind(value.path)).sha256, value.sha256, value.path);
  for (const child of Object.values(value)) await verifyTree(child);
};
const freezePath = `${work}/d017-t4-figures-author-freeze.json`;
const freeze = await read(freezePath);
assert.equal(freeze.status, 'author-frozen-independent-review-pending');
await verifyTree(freeze);
const observations = {
  'fig-101': [
    'Original PNG and all three actual640/331/342px previews separately opened at original resolution in this unique gate. One circular remainder with one upward missing sector; phi marks the small angle between two radial boundaries sharing the apex.',
    'Diagonal hatching stays entirely in remaining material, not the open sector. The two angle-arc tips are visible. The source contains no numerical calibration, center label/dot, thermal outline or answer; none is added.',
    'Native marker-contract correction already used the one permitted repair. Current visible geometry has no extra construction markers. Phi is contained and reads at16.55/17.1px mobile, with no collision or clipping.',
  ],
  'fig-102': [
    'Original PNG and all three actual640/331/342px previews separately opened at original resolution in this unique gate. Two diagonally marked left AC terminals and~; upper wire descends to one contact above the free left-side portion of the straight two-layer strip.',
    'Strip extends left beyond the contact, and its right-side connection returns through the single bottom heater in series to the lower terminal. No bypass, separate invented clamp, extreme-left-tip contact, source current direction or extra thermal state is introduced.',
    'Upper layer unhatched and lower layer diagonally hatched, sharing one horizontal interface. Source heater text legitimately translated to Heater. No coefficient/material labels or answer-bearing bend arrows; contained English text remains16.55/17.1px mobile.',
  ],
};
const figures = [];
for (const item of freeze.figures) {
  assert.equal(item.nativeStatus, 'pass');
  const spec = await read(item.spec.path);
  const render = await read(item.nativeRender.path);
  const exercises = await read(item.inputs.exercisesTemplate.path);
  assert.deepEqual(spec.source.image, item.inputs.sourceImage);
  assert.equal(render.status, 'pass');
  assert.equal(render.spec.sha256, item.spec.sha256);
  assert.equal(render.output.svg.sha256, item.svg.sha256);
  const contexts = spec.source.authoritativeText.filter(context => context.lesson === freeze.lesson);
  assert.equal(contexts.length, 7);
  assert.equal(new Set(contexts.map(context => String(context.exercise))).size, 7);
  for (const context of contexts) {
    assert.equal(context.text, exercises.exercises.find(task => task.number === String(context.exercise)).text);
  }
  for (const task of exercises.exercises.filter(task => task.figure_refs.includes(item.figure))) {
    assert.ok(contexts.some(context => String(context.exercise) === task.number));
  }
  assert.deepEqual(item.hardBlockers, []);
  assert.ok(item.previews.every(preview => !preview.metrics.horizontalOverflow &&
    preview.metrics.labels.every(label => label.inside && label.px >= 16)));
  figures.push({
    id: item.figure, status: 'pass', reviewer: 'Main, independent of Einstein author',
    contextKind: 'exercises',
    bindings: {
      source: item.inputs.sourceImage, context: item.context, lesson: item.inputs.exercisesTemplate,
      spec: item.spec, svg: item.svg, render: item.nativeRender,
    },
    inspectedPixels: item.previews,
    independentSourceAndPixelObservations: observations[item.figure],
    nativeMathematicalAssertions: item.authorAssertions,
    contextCoverage: 'All7 source tasks included and byte-match current modern exercise text; every actual referencing task covered. Extra nonreferencing tasks are complete context, not solutions.',
    initialRepairsUsed: item.targetedRepairs, remainingRepairs: item.remainingRepairs,
    findings: [],
  });
}
await fs.writeFile(`${work}/9p-t4-figure-review.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', lesson: freeze.lesson, status: 'pass',
  reviewKind: 'unique-independent-initial-source-spec-actual-preview-gate',
  authorFreeze: await bind(freezePath), figures,
  actualImageCalls: 8,
  limits: 'One independent gate, two original images and six real previews. Existing native reports reused, no rerender/new repair/promotion/SCI repetition/source transcription gate or production write.',
}, null, 2) + '\n', { flag: 'wx' });
