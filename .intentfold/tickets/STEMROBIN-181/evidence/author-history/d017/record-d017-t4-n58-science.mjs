import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const bind = async file => ({
  path: file, sha256: crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex'),
});
const verify = async binding => assert.equal((await bind(binding.path)).sha256, binding.sha256);
for (const [short, id] of [['t4', 'phy9-c1-s7-t4'], ['n58', 'phy9-c2-s1']]) {
  const freezePath = `${work}/9p-${short}-prose-freeze.json`;
  const freeze = await read(freezePath);
  const folder = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${id}`;
  const sourceFolder = `${root}/lessons/${id}`;
  const lesson = await read(`${folder}/lesson.template.json`);
  const exercises = await read(`${folder}/exercises.template.json`);
  const source = await read(`${sourceFolder}/lesson.json`);
  const sourceExercises = await read(`${sourceFolder}/exercises.json`);
  const frozen = short === 't4'
    ? [freeze.templates['lesson.template.json'], freeze.templates['exercises.template.json'],
      freeze.source.lesson, freeze.source.exercises]
    : [freeze.bindings.lesson_template, freeze.bindings.exercises_template,
      freeze.bindings.source_lesson, freeze.bindings.source_exercises];
  for (const binding of frozen) await verify(binding);
  assert.equal(lesson.card_id, id);
  assert.equal(exercises.exercises.length, short === 't4' ? 7 : 0);
  assert.equal(sourceExercises.count, exercises.exercises.length);
  assert.equal(lesson.prose.length, source.prose.length);
  const evidence = short === 't4' ? [
    'Uniform, free, isotropic expansion/no phase change makes the sector angle invariant; originalfig101 uncalibrated geometry remains the task context, not a new measurement.',
    'Equal liquid/container temperature, fixed liquid mass and no evaporation support a comparison of liquid volume versus vessel capacity; given level-rise is not asserted universal.',
    'Matched mercury/glass, equal uniform capillary diameter and negligible capillary inventory permit reservoir-volume comparison. Equilibrium column-height sensitivity is distinguished from response time.',
    'Actual initial hoop inner diameter is the reference D0; fixed1m wheel and5mm deficit retained. The approximate constant coefficient12e-6/K is explicitly a model over the contemplated temperature interval, not practical heating guidance.',
    'Both samples occupy the same fixed actualvolume; masses need not match. Equal composition/pressure/gravity and initial-reference volume law prevent mistaking vessel expansion or reversing the density ratio.',
    'Initially stress-free, fixed spacing, constantE/beta and linear elastic/no-buckling conditions support the original10C-to25C stress question;3e7Pa and all original temperatures retained.',
    'All3 response targets retained: switching mechanism, whichlayer has smaller expansion, and conceptually changed contact arrangement. Originaluppercontact/rightfixedend configuration remains authoritative. No exactconstanttemperature or actualmains modifications promised.',
  ] : [
    'Classical electrodynamics includes charges/currents/fields and propagation, energy/momentum. Mechanics and molecular physics are not falsely claimed never to study force origins.',
    'Four known interactions retained. Macroscopic friction/elastic/muscular forces are qualified by quantum/material/biochemical structure, not reduced to a naked pairwise charge law.',
    'Independent weak-interaction footnote now applies to certain transformations/decays, not every particle transformation.',
    'Light and molecular/biochemical structure retain electromagnetic role; orbital free fall has small support force, not absentgravity. Long-term weightlessness is not asserted harmless.',
    'Interaction dominance is distinguished from existence. Nuclearbinding includesstrong interaction andelectromagneticrepulsion; atomic/chemical structure requiresquantumrules. Gravity not confined tolarge scales; weakdecays canhave observablemacroscopic effects.',
    'SourceMaxwellportrait reference retained, withno visualapproval implied bythisSCIgate.',
    'Maxwell1831-1879 biography, electromagnetism/kinetictheory/statisticalcontribution retained. Removed universal earliest-probability priority claim; historicalidentities declared.',
    'Changingelectricfield magneticeffect/waveprediction retained. RoyalInstitution1821 rotation versusMaxwell1831 birth independently disproves the originalallmotors-afterfulltheory chronology. Radiohistory avoidssoleinventor/single-direction theory-to-technology claim.',
    'Electrification/communication importance retained without an absolute civilization counterfactual.',
    'Originalnext-study aim preserved; no writtenexercise invented for a sourcewithouttasks.',
  ];
  if (short === 't4') {
    for (const [index, exercise] of exercises.exercises.entries()) {
      assert.equal(exercise.number, String(index + 1));
      assert.equal(exercise.source_text, sourceExercises.exercises[index].text);
      assert.deepEqual(exercise.figure_refs, sourceExercises.exercises[index].figure_refs);
      assert.deepEqual(exercise.numeric_changes, []);
    }
  } else {
    for (const [index, block] of lesson.prose.entries()) {
      assert.equal(block.source_text, source.prose[index].text);
      assert.deepEqual(block.source_refs, source.prose[index].source_refs);
    }
  }
  await fs.writeFile(`${work}/9p-${short}-science-review.json`, JSON.stringify({
    ticket: 'STEMROBIN-181', lesson: id, status: 'pass',
    reviewKind: 'unique-independent-initial-science-gate',
    reviewer: `Main, independent of ${short === 't4' ? 'Huygens' : 'Zeno'} author`,
    inputOrder: 'Read complete current original source and frozen modern prose/tasks, including every condition/response target. No modern standard-answer or choice draft consulted. Exercise8 was independently solved before its three bookRaw capture candidates were read; those captures are not modern-answer approval. Source transcription and figure approvals not repeated.',
    bindings: {
      template: await bind(`${folder}/lesson.template.json`),
      source: await bind(`${sourceFolder}/lesson.json`),
      exercisesTemplate: await bind(`${folder}/exercises.template.json`),
      exercisesSource: await bind(`${sourceFolder}/exercises.json`),
      authorFreeze: await bind(freezePath),
      references: await bind(`${work}/d017-science-reference-notes.json`),
      ...(short === 't4' ? { independentRawSolutions: await bind(`${work}/d017-independent-raw-solutions.md`) } : {}),
    },
    evidence,
    sourceOrCulturalLimits: short === 't4'
      ? 'Historical mercury/gasoline/heating/mains scenarios are non-operational analysis. Allnumbers/units/sourcefigures retained; moderndrawing approval and finalization stillpending.'
      : 'Maxwell/Newton/Britain/Popov are source-bound real history, not a fictional cultural transplant. Popovprintedinitials retained as sourceink, not a claim resolving the original Latin/Cyrillic same-glyph uncertainty. Portrait approval pending.',
    findings: [], unresolved: [],
    limits: 'SCI only; no answer/choice/figure approval, new browser check, production write, formalhandoff or full-project test.',
  }, null, 2) + '\n', { flag: 'wx' });
}
console.log('Unique independent SCI PASS: exercise8 seven tasks and canonical58 electrodynamics prose.');
