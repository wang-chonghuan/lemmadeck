import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const adapt = '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons';
const read = async p => JSON.parse(await fs.readFile(p, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
for (const n of ['n56', 'n57']) {
  const id = `phy9-c1-s7-${n}`;
  const freezePath = `${work}/9p-${n}-prose-freeze.json`;
  const freeze = await read(freezePath);
  const templatePath = `${adapt}/${id}/lesson.template.json`;
  const template = await read(templatePath);
  const original = await read(`${root}/lessons/${id}/lesson.json`);
  assert.equal((await bind(templatePath)).sha256, freeze.templates['lesson.template.json'].sha256);
  assert.equal((await bind(`${root}/lessons/${id}/lesson.json`)).sha256, freeze.source.lesson.sha256);
  assert.deepEqual(template.source.data, original);
  assert.equal(original.prose.length, n === 'n56' ? 9 : 27);
  assert.equal(template.exercise_count, 0);
  if (n === 'n56') {
    assert.equal(template.errata.length, 1);
    assert.equal(template.errata[0].original, '$\\frac{\\Delta l}{l}=\\beta\\Delta t$');
    assert.equal(template.errata[0].corrected, '$\\frac{\\Delta l}{l_0}=\\beta\\Delta t$');
    assert.ok(template.prose[3].text.includes(template.errata[0].corrected));
    assert.equal(template.prose[3].source_text, original.prose[3].text);
  }
  await fs.writeFile(`${work}/9p-${n}-science-review.json`, JSON.stringify({
    ticket: 'STEMROBIN-181', lesson: id, status: 'pass',
    reviewKind: 'unique-independent-initial-science-gate',
    reviewer: 'main, independent from Huygens prose author',
    authorFreeze: await bind(freezePath),
    bindings: {
      template: await bind(templatePath),
      source: await bind(`${root}/lessons/${id}/lesson.json`),
      exercisesTemplate: await bind(`${adapt}/${id}/exercises.template.json`),
      exercisesSource: await bind(`${root}/lessons/${id}/exercises.json`),
    },
    everyOriginalAndModernProseBlockActuallyRead: true,
    references: await bind(`${work}/d016-science-references.json`),
    assessments: n === 'n56' ? [
      'All9 blocks: initial-reference-length definition, signed temperature change and free/uniform/no-phase-change approximation consistent.',
      'Original7-1 denominatorl would give l=l0/(1-beta*Delta_t), inconsistent with explicit7-2. Source-bound erratum changes only the exact math token to denominatorl0; current target/source/page/PDF bindings preserved. No unregistered formula correction.',
      'beta may depend on material, direction and temperature; constant coefficient is finite-small-range approximation. Source descending10^-5 to10^-6 typical range is retained as source data, not universal bounds.',
      'Invar low expansion is scoped by applicable temperature/material state, not zero expansion. Figure99 is an uncalibrated positive-slope example in one shared frame, not data for all solids.',
    ] : [
      'All27 blocks: reference volumeV0, fixed-material/pressure/no-phase-change approximation, signed Delta_t and finite-range coefficient conditions consistent.',
      'alpha approximately3beta follows (1+beta*Delta_t)^3 by dropping second/higher orders for isotropic free expansion; not exact for large expansion or generally anisotropic solids.',
      'Liquids lack intrinsic fixed direction/shape; observed level compares liquid volume with container-capacity change. Heating does not always raise the level.',
      'For fixed liquid-water mass near ordinary atmospheric pressure, volume minimum and density maximum near4C, decreasing volume0to4 then increasing, agree with the original uncalibrated graph100. Pressure/solution exceptions and deep-water stratification limits explicit.',
      'Worked1: DeltaV5.5cm^3=5.5e-6m^3; Q=DeltaV*rho*c/alpha=5.5e-6*800*2400/.0011=9600J. rho references initial state; constant c/alpha and no phase/loss process distinguished from total heater energy.',
      'Worked2: positive cooling magnitude30C means free contraction3*1.1e-5*30=.00099m. Fixed-end compensation increases tension by7e4*.00099=69.3N, supports sourceapproximately70N. F is incremental tension, not unspecified total prestress; small initial elastic extension assumption explicit.',
    ],
    findings: [], unresolved: [],
    figures: n === 'n56' ? ['fig-99'] : ['fig-100'],
    limits: 'SCI only; figures await independent native-render/current-pixel gate. No source/crop rereview, duplicate SCI gate, answer/choice draft access, batch browser or production/app/dependency/Charter changes.',
  }, null, 2) + '\n', { flag: 'wx' });
}
