import assert from 'node:assert/strict';
import { ticket, read, bind, verify, exists, immutableWrite } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const freezePath = `${work}/9p-n76-prose-freeze.json`;
const output = `${work}/9p-n76-science-review.json`;
assert.ok(!await exists(output), 'Unique science review already recorded');
await verify(freezePath, '15ec182e105424ca2983a246357ea7cc6196dadc3639acaa0b741aa37bd5608b');
const freeze = await read(freezePath);
for (const binding of Object.values(freeze.bindings)) await verify(binding.path, binding.sha256);
for (const binding of Object.values(freeze.nativeTools)) await verify(binding.path, binding.sha256);
const source = await read(freeze.bindings.sourceLesson.path);
const lesson = await read(freeze.bindings.lessonTemplate.path);
const sourceExercises = await read(freeze.bindings.sourceExercises.path);
const exercises = await read(freeze.bindings.exercisesTemplate.path);
assert.deepEqual(lesson.source.data, source);
assert.equal(source.prose.length, 24);
assert.equal(lesson.prose.length, 24);
assert.equal(sourceExercises.count, 0);
assert.equal(exercises.exercises.length, 0);
const atoms = text => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map(match => match[1] ?? match[2]);
const comparison = lesson.prose.map((block, index) => {
  const original = source.prose[index];
  assert.equal(block.source_text, original.text);
  for (const key of ['kind', 'id', 'label', 'printed_page', 'source_refs']) {
    assert.deepEqual(block[key], original[key]);
  }
  assert.deepEqual(atoms(block.text), atoms(original.text));
  return { index, source_refs: original.source_refs, mathAtomsExact: true, identityExact: true };
});
assert.equal(comparison.reduce((sum, entry) => sum + atoms(source.prose[entry.index].text).length, 0), 17);
const groups = [
  { blocks: [0, 2, 3, 5, 6, 7, 8], assessment: 'Nonzero signed probe charge and uniform static E are explicit. Displacement is along E with positive separation. Dot-product work equals q*E*d for either charge sign; q cancellation is valid. V=U1-U2 gives a positive potential drop for nonzero E and d, whereas negative-charge work is negative. Force direction is not confused with field direction.' },
  { blocks: [9, 10], assessment: 'Comparisons hold at the same along-field distance. Spatially constant potential implies zero full E; a constant value in only one direction determines only its corresponding component. The finite-distance relation is a local approximation in a continuous nonsingular static field with negligible directional and magnitude variation, not an arbitrary-field exact equality.' },
  { blocks: [11, 12, 13, 14], assessment: 'The SI operational definition includes along-field separation and endpoint order. V/m=(J/C)/m=N/C. The historical conversion uses the source rounded volt factor and centimetre conversion, yielding1/(300*100)=1/(3*10^4); prose explicitly disclaims exactness of the rounded conversion. All original math atoms remain unchanged.' },
  { blocks: [15, 16], assessment: 'Each infinitesimal tangential displacement is transverse to the local static E, so its work contribution is zero. A path-connected smooth surface with that property has constant potential. Uniform-field surfaces are parallel planes and point-charge surfaces concentric spheres. Normality and decreasing-potential direction are restricted to regular nonzero-field locations; infinity is a specified reference for the positive point-charge illustration.' },
  { blocks: [23], assessment: 'The conductor is the same connected body in electrostatic equilibrium. The material interior has zero E, the external surface-adjacent tangential component vanishes, and its potential is constant. The solid isolated spherical conductor is undisturbed and in the same homogeneous-medium model with infinity reference. The potential evaluated at the surface radius is also the interior constant; an interior observation radius must not be substituted into the exterior point-charge expression.' },
  { blocks: [1, 4, 17, 18, 19, 20, 21, 22], assessment: 'All four original figure slots and all four captions remain exactly bound. This textual science review creates no source-image inventory, geometry decision, visual approval or figure promotion.' },
].map(group => ({ ...group, status: 'pass',
  source_refs: group.blocks.flatMap(index => source.prose[index].source_refs) }));
assert.deepEqual(groups.flatMap(group => group.blocks).sort((a, b) => a - b),
  Array.from({ length: 24 }, (_, index) => index));
const references = [
  {
    title: 'OpenStax College Physics2e19.2 Electric Potential in a Uniform Electric Field',
    url: 'https://openstax.org/books/college-physics-2e/pages/19-2-electric-potential-in-a-uniform-electric-field',
    reader: 'cloak-fetch', readDate: '2026-11-16', httpStatus: 200,
    supports: 'Work/potential-drop sign convention; charge cancellation; uniform-field-only finite relation; N/C=V/m; variable fields require the differential limit.',
  },
  {
    title: 'OpenStax College Physics2e19.4 Equipotential Lines',
    url: 'https://openstax.org/books/college-physics-2e/pages/19-4-equipotential-lines',
    reader: 'cloak-fetch', readDate: '2026-11-16', httpStatus: 200,
    supports: 'Zero static-field work on equipotentials; point-charge spherical surfaces; conductor surface normality in static situations; spherical-conductor exterior potential equivalence.',
  },
];
const referencePath = `${work}/d020-n76-science-references.json`;
await immutableWrite(referencePath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', references,
  originalEquation8_28: {
    page: await bind('ssot-resources/soviet10year-textbooks/artifacts/9p/pages/0186/page.md'),
    equation: '$U=\\frac{q}{4\\pi\\varepsilon_0\\varepsilon r}$',
    scope: 'Existing approved186 equation only. No interpretation or approval of blocked187 and no new75 science gate.',
  },
  noSourceArticleCopied: true,
}, null, 2)}\n`);
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D020', lesson: lesson.id, status: 'pass',
  reviewer: 'Main, independent of Dalton prose author',
  reviewRound: 'unique-initial-independent-science',
  bindings: { authorFreeze: await bind(freezePath), ...freeze.bindings,
    references: await bind(referencePath) },
  comparison, blockAssessments: groups,
  independentDerivations: [
    'A=q integral E dot dl=q E d for constant E and parallel displacement. Electrostatic work is q(U1-U2); nonzero q cancels even if negative. Hence E=(U1-U2)/d. Only the work sign changes with probe sign.',
    'For a short displacement, dU=-E dot dl. A directional zero derivative removes one component only; zero gradient throughout a spatial region removes all components. Curvature/magnitude variation leaves a higher-order finite-step error, so the modern text correctly states local approximation.',
    'On an equipotential tangent, dU=0 and E dot dl=0. At a regular point E is normal to its constant-potential surface. The static connected conductor has no internal field; integrating along paths inside its material gives equal potentials.',
    'The approved source equation8-28 gives the spherical exterior potential in its medium. Evaluating at the conductor radius gives the constant interior potential without treating interior observation points as exterior radii.',
  ],
  sourceBlocks: 24, sourceMathAtoms: 17, modernFlowParagraphs: 27,
  originalTasks: 0, modernTasks: 0, findings: [], requiredAuthorChanges: [],
  remaining: 'Independent modern figures140-143, native finalization and D020 batch display.',
  limits: 'Existing author/source pixel gates consumed, not rerun. No image load, native validation/render, source/template/tool/index edit, browser acceptance, DB, Git or full-project test/build.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(output)));
