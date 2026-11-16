import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { bind } from './retain-d016-evidence.mjs';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const source = 'ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/phy9-c2-s2-n64';
const k = 9e9;
const molecules = 0.03 / 3e-23;
const electrons = 10 * molecules;
const vacuumForce = k / 1000 ** 2;
const q = 2e-8, l = 2, r = 0.16;
const horizontalForce = k * q ** 2 / r ** 2;
const sinAlpha = r / (2 * l);
const tension = horizontalForce / sinAlpha;
const q1 = -3e-8, q2 = 1e-8, q3 = 5e-8;
const epsilon = 2.1, r12 = 0.4, r23 = 0.6, r13 = r12 + r23;
const f12 = k * Math.abs(q1 * q2) / (epsilon * r12 ** 2);
const f13 = k * Math.abs(q1 * q3) / (epsilon * r13 ** 2);
const f23 = k * Math.abs(q2 * q3) / (epsilon * r23 ** 2);
const signedForces = [f12 + f13, -f12 - f23, -f13 + f23];
assert.ok(Math.abs(molecules / 1e21 - 1) < 1e-12);
assert.ok(Math.abs(electrons / 1e22 - 1) < 1e-12);
assert.equal(vacuumForce, 9000);
assert.ok(Math.abs(tension - 0.003515625) < 1e-15);
assert.deepEqual(signedForces.map(value => Number((Math.abs(value) * 1e6).toFixed(1))), [14.5, 14, 0.5]);
assert.ok(Math.abs(signedForces.reduce((sum, value) => sum + value, 0)) < 1e-18);
await fs.writeFile(`${work}/d018-n64-independent-raw-solutions.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', lesson: 'phy9-c2-s2-n64', reviewer: 'session-D',
  source: await bind(`${source}/lesson.json`), sourceMarkdown: await bind(`${source}/lesson.md`),
  references: await bind(`${work}/d018-n64-science-reference-notes.json`),
  calculations: [
    { example: 1, inputs: { waterMassGram: 0.03, moleculeMassGram: 3e-23, electronsPerNeutralMolecule: 10 },
      molecules, electrons, sourceResult: '10^22 electrons', condition: 'Neutral-water molecular counting model; no ionization/net-charge inference.' },
    { example: 2, inputs: { k, eachChargeCoulomb: 1, separationMetre: 1000 },
      forceNewton: vacuumForce, sourceResult: '9000 N', condition: 'Static same-sign point charges in vacuum with the retained rounded k.' },
    { example: 3, inputs: { k, q, l, r }, horizontalForceNewton: horizontalForce, sinAlpha,
      tensionNewton: tension, sourceResult: '3.5e-3 N',
      condition: 'Symmetric static configuration, equal positive tension, ideal strings, vacuum/air approximation and negligible other horizontal forces. Given separation supplies the geometry; mass is not needed for horizontal balance.' },
    { example: 4, inputs: { k, q1, q2, q3, epsilon, r12, r23, r13 },
      pairForceNewton: { f12, f13, f23 }, signedForcesNewton: signedForces,
      sourceRoundedMagnitudesMicroNewton: [14.5, 14, 0.5],
      directions: ['right', 'left', 'left'],
      condition: 'Uniform linear isotropic liquid/effective medium model, fixed point-charge approximation and negligible boundaries. Arrow lengths are not force measurements.' }
  ],
  status: 'source-calculations-consistent-at-printed-precision',
  limits: 'Independent raw-source solutions for the one pending64 SCI gate, not a second pass or author-template approval. No source formula/value/erratum change and no answer/choice task invention.',
}, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ molecules, electrons, vacuumForce, tension, signedForces }));
