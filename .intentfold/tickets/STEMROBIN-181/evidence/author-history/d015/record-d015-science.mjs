import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const ticket = '.intentfold/tickets/STEMROBIN-181';
const work = `${ticket}/tmp`;
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));
const references = await bind(`${work}/d015-science-references.json`);
const reviews = [
  {
    n: 'n50', id: 'phy9-c1-s6-n50', status: 'revise',
    assessment: [
      'All 14 prose blocks actually read in source order, with 38 preserved math fragments and all six figure placeholders. Zero tasks remains zero.',
      'Fixed-support axial tension/compression, transmitted internal force, average stress versus local stress, length change versus strain, stiffness k versus modulus E, and the uniaxial linear-elastic model are distinguished.',
      'F=k|Delta l| and k=ES/l0 yield F=ES|Delta l|/l0 and sigma=E|epsilon| consistently. Magnitudes do not silently redefine signed compressive strain. Small strain alone does not guarantee elasticity; compression excludes buckling.',
      'Ordinary positive-Poisson lateral contraction is conditional, not universal. Small-angle shear proportionality and simple-shear volume statements have appropriate limits; beam bending and fastener shear are not conflated.',
      'Original Delta L versus Delta l is explicitly identified as one length increment. Equal final-length wording is separated from the correct same-initial-length stiffness comparison. No unauthorized mathematical alias is introduced.',
    ],
    findings: [{
      id: 'F1', severity: 'blocking', target: 'lesson.prose[10]', source_refs: ['p0126#1'],
      original: '$E=7\\times10^7$',
      assessment: 'The frozen text leaves aluminum modulus at 7 times 10^7 N/m^2 and says its order of magnitude is doubtful. The MIT rendered property entry gives 70 GPa, equivalent to 7 times 10^10 N/m^2. A recoverable, confirmed factor-1000 error should be corrected in the modern example rather than left unresolved.',
      requiredCorrection: 'Register only a source-bound metadata erratum on page126 block1 for the exact full original formula. Preserve every original source body/block/crop and source lesson snapshot. In the modern block replace only that complete formula with $E=7\\times10^{10}$, identify it as a typical corrected value rather than a universal constant, remove the pending-error disclaimer, and use the native bound math-correction contract. Rebuild only affected prose-flow boundary objects and current figure context bindings; do not rerender unchanged geometry.',
    }],
  },
  {
    n: 'n51', id: 'phy9-c1-s6-n51', status: 'pass',
    assessment: [
      'All eight prose blocks actually read, 15 math fragments retained, zero tasks and the fig88 placeholder retained.',
      'Engineering stress uses initial area and engineering strain initial gauge length; true stress is expressly excluded from the ordinate. Proportionality OA and recoverable nonlinear AB are distinct.',
      'The source residual-strain 0.1% convention, one-percent difference statement and 1.7..10 safety-factor range are source-attributed, not universal experimental or engineering standards.',
      'CD is a possible plastic-yield plateau, not a liquid phase. E is the maximum nominal tensile stress; subsequent necking may lower force without requiring local true stress to decrease. K is rupture, not the maximum itself.',
      'The retained n=sigma_limit/sigma_allow definition is consistent and only defines this strength margin. Actual stress must remain allowable; fatigue, buckling, deformation and other failure modes prevent an unconditional claim of structural safety.',
    ],
    findings: [],
  },
  {
    n: 'n52', id: 'phy9-c1-s6-n52', status: 'revise',
    assessment: [
      'All eight prose blocks actually read, 15 math fragments retained, zero tasks and fig89/90 placeholders retained.',
      'Recoverability, linearity, plasticity and ductility are distinct. Rubber large elastic deformation is not assumed Hookean. Steel strain examples and cooled lead temperature are not universal thresholds.',
      'Hot forging is industrial context, not a child operation. Brittle behavior means little prefracture plastic strain; steel, copper and lead are not claimed immune to brittle fracture.',
      'Original cast-iron/steel numbers and graph89 approximate endpoint versus 0.45% prose discrepancy remain source-attributed. No invented numerical erratum or graphical precision has been introduced.',
    ],
    findings: [{
      id: 'F1', severity: 'blocking', target: 'lesson.prose[6]', source_refs: ['p0130#4'],
      assessment: 'The printed steel point 2 times 10^7 Pa at 0.1% strain implies a secant modulus 2 times 10^10 Pa if it is treated as linear elastic. This cannot be used interchangeably with the previous steel modulus example 21 times 10^10 Pa. Calling all values merely sample examples still leaves their quantitative use insufficiently constrained; the graphs also do not certify an exact material experiment.',
      requiredCorrection: 'Keep every printed number and formula, but explicitly state that the original data/graph set is not quantitatively reconciled and cannot serve as verified material constants or be combined with the prior modulus example for numerical inference. Retain only its source-attributed qualitative brittle-versus-ductile comparison; do not invent replacement numbers, specimen conditions, exact break coordinates or a source erratum.',
    }],
  },
];
for (const item of reviews) {
  const freezePath = `${work}/9p-${item.n}-prose-freeze.json`;
  const freeze = await read(freezePath);
  assert.deepEqual(await bind(freeze.template.path), freeze.template);
  assert.deepEqual(await bind(freeze.source.path), freeze.source);
  const lesson = await read(freeze.template.path);
  assert.deepEqual(lesson.source.data, await read(freeze.source.path));
  assert.equal(lesson.exercise_count, 0);
  assert.equal(freeze.nativeAuthorCheck.status, 'pass');
  await fs.writeFile(`${work}/9p-${item.n}-science-review.json`, JSON.stringify({
    ticket: 'STEMROBIN-181', lesson: item.id, status: item.status,
    review: 'Unique initial independent substantive SCI by Main on Carson-authored frozen prose. Source fidelity and geometry are separate existing gates, not repeated here.',
    authorFreeze: await bind(freezePath),
    bindings: { template: freeze.template, source: freeze.source },
    references, sourceBlocks: freeze.sourceBlocks, mathFragments: freeze.mathFragments,
    coverage: item.assessment, findings: item.findings,
    nextReviewScope: item.findings.length ? 'Only the identified block, necessary binding metadata and affected boundary/context bindings; inherit every unchanged initial SCI result.' : 'None; do not repeat this initial SCI gate.',
    limits: 'No figure/pixel approval, source transcription gate, browser rerun, whole-project tests, production write, app/dependency/Charter changes or corpus-complete claim.',
  }, null, 2) + '\n', { flag: 'wx' });
}
const t6FreezePath = `${work}/9p-t6-author-freeze.json`;
const t6Freeze = await read(t6FreezePath);
for (const binding of Object.values(t6Freeze.templates)) assert.deepEqual(await bind(binding.path), binding);
const t6Source = await bind(`${root}/lessons/phy9-c1-s5-t6/exercises.json`);
assert.equal(t6Source.sha256, t6Freeze.source.exercises.sha256);
await fs.writeFile(`${work}/9p-t6-science-review.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', lesson: 'phy9-c1-s5-t6', status: 'revise',
  review: 'Unique initial independent SCI and written-task fidelity review by Main on Huygens-authored frozen eleven-task edition.',
  authorFreeze: await bind(t6FreezePath),
  bindings: {
    template: t6Freeze.templates['lesson.template.json'],
    exercisesTemplate: t6Freeze.templates['exercises.template.json'],
    source: t6Freeze.source.lesson, exercisesSource: t6Source,
  },
  coverage: [
    'All eleven original and modern task stems actually read independently, with stable numbers, data55/146mm and radius0.8mm, groups and source references preserved.',
    'Tasks1/3/4/5/6/7 retain open examples, the given wetting test, conditional thin-film adhesion, theoretical surface-tension-gradient transport, conditional soil transport and a free equal-density drop. No gasoline or mercury operation is requested.',
    'Task8 appropriately restricts a temperature-rise argument to equal-initial-temperature isolated coalescence after transients have dissipated, with competing energy stores excluded.',
    'Task9 distinguishes an ideal two-interface constant-tension soap-bubble model from real film evolution. Tasks10/11 honestly expose missing property and boundary conditions rather than invent a unique density or remaining mass.',
    'No standard answer, new choice question or answer-interaction structure is approved by this stem gate.',
  ],
  findings: [{
    id: 'F1', severity: 'blocking', targets: ['exercise2.text', 'exercise9.text'],
    assessment: 'The author replaced the original firsthand experimental demonstration/verification with analysis of unspecified existing records, explicitly saying no experiment is required. The ticket requires experimental tasks to remain read-only written tasks; read-only is a product interaction boundary, not permission to delete their experimental capacity. No existing records are supplied, so this replacement also cannot be completed as written.',
    requiredCorrection: 'Restore the original safe experimental comparison in2 and experimental verification in9 as open written tasks, with adult supervision and suitable low-risk apparatus. Preserve hypotheses versus actual observations and do not fabricate results. Do not require an in-app answer input or force an auto-graded experimental result. Keep all unchanged scientific conditions, data and identity fields.',
  }],
  nextReviewScope: 'Only changed task2/task9 stems and their identity/data/native text bindings. Tasks10/11 remain condition-dependent and their later standard answers must expose missing inputs or explicitly sourced assumptions.',
  limits: 'Initial stem gate only. Taskcard is not delivered; standard answers and choice questions still uncreated and require their own unique independent gates.',
}, null, 2) + '\n', { flag: 'wx' });
console.log('Recorded initial SCI: n50 revise, n51 pass, n52 revise; t6 task-preservation revise.');
