import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const source = 'ssot-resources/soviet10year-textbooks/artifacts/9p/lessons';
const adapt = '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons';
const read = async p => JSON.parse(await fs.readFile(p, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const references = [
  { title: 'OpenStax College Physics2e14.3 Phase Change and Latent Heat',
    url: 'https://openstax.org/books/college-physics-2e/pages/14-3-phase-change-and-latent-heat',
    evidence: await bind(`${work}/d016-latent-heat-reference.txt`), status: 200 },
  { title: 'OpenStax College Physics2e13.5 Phase Changes',
    url: 'https://openstax.org/books/college-physics-2e/pages/13-5-phase-changes',
    evidence: await bind(`${work}/d016-phase-reference.txt`), status: 200 },
  { title: 'Open University Introduction to Polymers5.5 Orientation in Polymers',
    url: 'https://www.open.edu/openlearn/science-maths-technology/chemistry/introduction-polymers/content-section-5.5',
    evidence: await bind(`${work}/d016-polymer-orientation-reference.txt`), status: 200 },
  { title: 'NIST CODATA Avogadro constant',
    url: 'https://physics.nist.gov/cgi-bin/cuu/Value?na',
    evidence: await bind(`${work}/d016-avogadro-valid-reference.txt`), status: 200 },
];
await fs.writeFile(`${work}/d016-science-references.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', date: '2026-11-16', access: 'CloakBrowser rendered text, no user browser',
  references,
  additionalAlreadyObservedReference: {
    title: 'OpenStax College Physics2e13.2 Thermal Expansion of Solids and Liquids',
    url: 'https://openstax.org/books/college-physics-2e/pages/13-2-thermal-expansion-of-solids-and-liquids',
    status: 200, evidence: 'Rendered full text observed in completed exec session82306. No retained raw transcript file and no duplicate fetch.',
  },
  failedReference: 'NIST query?na= returned ill-formed request; not used as evidence. Correct query?na returned exact constant.',
}, null, 2) + '\n', { flag: 'wx' });
for (const n of ['n54', 't8']) {
  const card = `phy9-c1-s6-${n}`;
  const freezePath = `${work}/9p-${n}-prose-freeze.json`;
  const freeze = await read(freezePath);
  const lessonPath = `${adapt}/${card}/lesson.template.json`;
  const exercisesPath = `${adapt}/${card}/exercises.template.json`;
  const lesson = await read(lessonPath);
  const exercises = await read(exercisesPath);
  const bindings = {
    template: await bind(lessonPath), exercisesTemplate: await bind(exercisesPath),
    source: await bind(`${source}/${card}/lesson.json`),
    exercisesSource: await bind(`${source}/${card}/exercises.json`),
  };
  const expected = n === 'n54' ? { template: freeze.template, source: freeze.source } : {
    template: freeze.bindings.lessonTemplate, exercisesTemplate: freeze.bindings.exercisesTemplate,
    source: freeze.bindings.sourceLesson, exercisesSource: freeze.bindings.sourceExercises,
  };
  for (const [key, value] of Object.entries(expected)) {
    assert.equal(bindings[key].path, value.path);
    assert.equal(bindings[key].sha256, value.sha256);
  }
  assert.deepEqual(lesson.source.data, await read(`${source}/${card}/lesson.json`));
  assert.deepEqual(exercises.source.data, await read(`${source}/${card}/exercises.json`));
  assert.equal(exercises.exercises.length, n === 'n54' ? 0 : 11);
  const assessments = n === 'n54' ? [
    'All38 source-bound prose blocks read against the source. Pure-substance fixed-pressure phase equilibrium is distinguished from sample-dependent kinetic conditions and supercooling; isolation alone is not equilibrium.',
    'Latent heat is not attributed universally and entirely to particle potential energy or large volume growth. Constant-pressure heat and enthalpy/internal-energy/work are distinguished; ice volume exception preserved.',
    'Freezing/deposition releases latent heat but does not guarantee ground warming during snowfall. Approximate original3.4e5J/kg=80cal/g is explicitly rounded, not exact.',
    'Liquid-gas critical temperature is separate from melting. Latent-heat ratio is not a structural-similarity measurement. Pressure/melting trends restricted to the stated phases and range.',
    'Bottle-burst operational instructions replaced by non-operational constrained-expansion explanation; fragment hazard and container/rock conditions explicit.',
    'Worked1: E=4*25*3.6/(pi*(0.0008)^2*0.002)=8.9524655e10Pa, supports rounded9e10. Initial lengthL/l0 alias is declared, not changed.',
    'Worked2: lambda340000 and waterc4200 produce .4*(340000+4200*50)/(880*25)=10kg. Required matched heat-capacity data and isolated model explicitly qualified.',
    'Worked3: .4*4200*10=16800J; .6*2100*40=50400J; deficit33600J; with lambda340000 frozen mass.09882kg. Rounded.1kg and final.3/.7kg source masses explicitly approximate; equilibrium0C remains valid.',
  ] : [
    'Task1: direction dependence alone does not prove crystallinity; oriented noncrystalline bodies and bulk averaging of polycrystals distinguish necessary/sufficient implications.',
    'Task2: specified sharp-melting hypothetical does not determine melt viscosity, kinetics or retention of blown shape; no universal disappearance of liquid shaping is inferred.',
    'Task3: common granulated sugar/aluminum crystalline and ordinary amber amorphous, with sample-state limits. Single/polycrystal category is not inferred from external faces.',
    'Task4: two alternating unlike-ion sublattices explicitly given; all-ion density2rhoNA/M and nearest-unlike spacing yield2.7973156e-10m. Photo77 is external cube appearance only, not a measured lattice.',
    'Task5: D=.004m; F=sigma*pi*D^2/4=1884.9556N. Axis, centroidal static loading and constant cross-section clear.',
    'Task6: self-weight pressure rho*g*h=352800Pa withg9.8; required strength need not be equal along height. Stress is not material strength or real-building approval.',
    'Task7: top stressrho*g*l reaches3.2e8Pa at4186.2899m withg9.8; source4200m rounded. Constant section/loading and non-operational estimate explicit.',
    'Task8: sigma4e7Pa; strain2e-4; E2e11Pa. Both requested quantities preserved in linear-elastic model.',
    'Task9: initial323.15K; complete kinetic-energy conversion givesv345.2716m/s. All given values retained, temperature scales unified and no shooting experiment requested.',
    'Task10: three ice heating/melting/water-heating contributions with negligible container heat and loss. Chapter-rounded data yield.0331666kg, not book.33kg; modern answer must declare data/model.',
    'Task11: steam heat17688J is below18496J ice fusion requirement under chapter-rounded constants. Equilibrium0C with ice remaining; no false all-melt positive/negative temperature branch.',
  ];
  await fs.writeFile(`${work}/9p-${n}-science-review.json`, JSON.stringify({
    ticket: 'STEMROBIN-181', lesson: card, status: 'pass',
    reviewKind: 'unique-independent-initial-science-gate',
    authorFreeze: await bind(freezePath), bindings,
    reviewer: 'main, independent from prose author', sourceAndEveryModernTargetActuallyRead: true,
    independentRawSolvingBeforeAnswerOrChoice: n === 't8' ? await bind(`${work}/d016-independent-raw-solutions.md`) : null,
    references: await bind(`${work}/d016-science-references.json`),
    assessments, findings: [], unresolved: [],
    scope: n === 'n54' ? '38prose blocks, all51 math fragments and3 source worked examples. No original tasks invented.' : 'All11 original written tasks retained; every numeric/model/response target checked before answer production. Shared77 current-context gate remains separate.',
    limits: 'SCI only. Author mechanical validation is not used as independent approval. No repeated source/pixel gate, browser batch, answer-template or choice-key review, app/dependency/Charter/production change.',
  }, null, 2) + '\n', { flag: 'wx' });
}
