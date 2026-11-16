import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const freezePath = `${work}/9p-n55-prose-freeze.json`;
const freeze = JSON.parse(await fs.readFile(freezePath, 'utf8'));
for (const binding of [freeze.templates['lesson.template.json'], freeze.source.lesson]) {
  assert.deepEqual(await bind(binding.path), binding);
}
const url = 'https://www.fhwa.dot.gov/pavement/concrete/coefficient.cfm';
const text = execFileSync('cloak-fetch', [url], { encoding: 'utf8', timeout: 180000 });
const evidencePath = `${work}/d017-concrete-expansion-reference.txt`;
await fs.writeFile(evidencePath, text, { flag: 'wx' });
assert.ok(text.toLowerCase().includes('coefficient of thermal expansion'));
assert.ok(text.toLowerCase().includes('aggregate'));
const templatePath = '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c1-s7-n55/lesson.template.json';
const sourcePath = 'ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/phy9-c1-s7-n55/lesson.json';
await fs.writeFile(`${work}/9p-n55-science-review.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D017', lesson: 'phy9-c1-s7-n55', status: 'pass',
  reviewKind: 'unique-independent-initial-science-gate',
  reviewer: 'Main, independent of Huygens prose author',
  authorFreeze: await bind(freezePath),
  bindings: { template: await bind(templatePath), source: await bind(sourcePath) },
  sourceAndEveryModernTargetActuallyRead: true,
  counts: { sourceBlocks: 25, modernProseBlocks: 11, originalTasks: 0, figurePlaceholders: 7 },
  references: [
    {
      title: 'Federal Highway Administration: Concrete Coefficient of Thermal Expansion',
      url, access: 'CloakBrowser rendered page, fetched once for this new scientific premise',
      evidence: await bind(evidencePath),
      use: 'Concrete coefficient must be measured rather than assumed from aggregate-based default values; uniform temperature changes move joints and gradients curl slabs. Supports conditional compatibility, not exact steel/concrete equality.',
    },
    {
      title: 'OpenStax College Physics2e13.2 Thermal Expansion of Solids and Liquids',
      url: 'https://openstax.org/books/college-physics-2e/pages/13-2-thermal-expansion-of-solids-and-liquids',
      evidence: await bind(`${work}/d016-science-references.json`),
      use: 'Previously actually read through CloakBrowser; expansion, constraints, bimetal, holes and ball/ring principles inherited, not fetched again.',
    },
  ],
  assessments: [
    'Source1.5-2m wire and single fixed-end/pulley/load relation retained. Ordinary positive expansion/no-phase-change scope, supervised high-temperature/electricity boundary and no domestic wiring instructions.',
    'Absolute extension grows with initial length only for matched material, temperature change and approximately free expansion. Greater warm-wire sag is conditional on support/loading/tension, not a universal seasonal diagnostic.',
    'Thermal constraint forces depend on material, temperature and restraint. Bridge/rivet failure remains explicitly a source example, not newly verified history or an inevitable nightly event.',
    'Brittle cast-iron failure is conditional on stress exceeding resistance; source apparatus is conceptual, not an operational heated-fracture recipe. Fig93 source relationships remain a separate pixel gate.',
    'Expansion loops and joints illustrate selected arrangements, not a universal requirement for all pipelines or continuously welded rails and not construction advice.',
    'With positive coefficients and copper larger than iron, intact bonded elastic layers bend with copper on the longer outside arc. Average copper mechanical strain relative to free thermal strain is compressive and iron tensile; local bending stress need not have the same sign/value everywhere.',
    'Different-expansion materials can be joined with suitable compliance/constraints. Steel-concrete expansion compatibility is approximate and conditional; neither exact equality nor inevitable rapid destruction is asserted.',
    'Equal directional scaling is limited to homogeneous isotropic near-uniform-temperature freely expanding material. Anisotropic, constrained and nonuniform cases explicitly excluded.',
    'A hole expands with uniform positive free scaling: removed notional same material would share the displacement field. Uniform temperature by itself does not eliminate stress when the body is restrained.',
    'Ball/ring clearance depends on both thermal states: hot ball can fail, sufficiently expanded ring can allow passage; cooling ring while ball remains hot can block. Returning both to initial temperature absent permanent changes recovers initial dimensions.',
  ],
  independentDerivation: 'For uniform isotropic free expansion the displacement map is x->s*x with s>1, so every length, including a hole diameter, scales bys. With two bonded layers, differential free eigenstrain produces curvature and self-equilibrated constraint stresses; higher-expansion copper occupies the outside arc. Ball/ring clearance is ring bore minus ball diameter and must compare separate temperatures.',
  findings: [], unresolved: [],
  limits: 'New prose SCI only; no source rereview, figure source/pixel approval, rerender, finalize, promotion, batch browser, production or git action. Seven92-98 figures remain author/reviewer work in D017, not D016 delivery.',
}, null, 2) + '\n', { flag: 'wx' });
console.log('D017 n55 unique independent prose SCI PASS; seven figures remain pending.');
