import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const freezePath = `${work}/9p-t8-answer-author-freeze.json`;
const freeze = await read(freezePath);
for (const [name, binding] of Object.entries(freeze.bindings)) {
  assert.deepEqual(await bind(binding.path), binding, `Changed author input:${name}`);
}
const draft = await read(freeze.bindings.draft.path);
const prepared = await read(freeze.bindings.prepared_template.path);
assert.equal(draft.answers.length, 11);
assert.equal(prepared.answers.length, 11);
for (const [index, answer] of draft.answers.entries()) {
  assert.equal(answer.exercise, String(index + 1));
  assert.equal(answer.exercise, prepared.answers[index].exercise);
  assert.equal(answer.grading, 'ungraded');
  assert.deepEqual(answer.parts, []);
  assert.equal(answer.bookRaw, prepared.answers[index].bookRaw);
}
const evidence = [
  'Direction dependence is insufficient for crystallineorder; randompolycrystal averaging and aligned/stressedamorphous counterexamples retained. Isotropy doesnot implyamorphous.',
  'Hypothetical sharpmelting constrains below-melting softening, not all liquidprocessing. Viscosity, crystallization andshape-retention uncertainties prevent both unconditional conclusions.',
  'Ordinarygranulatedsugar andsolidaluminum crystalline; ordinaryamber amorphous. Samplelimits andsingle/polycrystal distinction retained.',
  'Allioncount2rhoNA/M givesd=(M/(2rhoNA))^(1/3)≈2.80e-10m for declaredroundedNA. Complete original/currentPNG andspec actuallyread; no photo calibration used.',
  'Diameter.004m, area4pi*10^-6m2 andstress1.5e8Pa giveF=600piN≈1884.96N. Original1884 usespi3.14, a declaredapproximation not error.',
  'Bottomstressrho*g*H=352800Pa withdeclaredg9.8, not printed3.53e8. Heightz localstressrho*g*(H-z) decreasesupward; actualsamebrickgrade may stillmeetallrequirements. Bothsource targets answered.',
  'Uniformwire largeststressatfixedtoprho*g*L, criticalL4186.29m≈4.2km. Crosssectioncancels, lowerfreeendnotmaximum, theoreticalbreakthresholdnot safedesign.',
  'Area2.5e-6m2/strain2e-4 givebothstress4e7Pa andE2e11Pa. Correctbookmodulus iscompletedwithoriginallyomittedstress; sameunits do notmean samequantity.',
  '50C=323.15K, DeltaT276.85K. Both heating andfusion pluskineticfactoronehalf give345.27m/s. Masscancels andnooperationalexperiment.',
  'Originalwater releases12600J; introducedice absorbsperkg6300+340000+33600=379900J/kg. Completewarm/melt/warm balance gives.0331666kg, notprinted.33kg. Positivefinal8Cvalidatesallintroducedicemelting.',
  'UsesactualchapterL2.26e6,cw4200,lambda340000:17688J<18496J, residualice2.37647g andequilibrium0C. Originalwaterat0C hasnoheat-capacityterm inthisphasebranch; no liquidonlynegativeTf or temporalpathclaim.',
];
await fs.writeFile(`${work}/9p-t8-answer-review.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', lesson: 'phy9-c1-s6-t8', status: 'pass',
  reviewKind: 'unique-independent-initial-answer-gate',
  reviewer: 'Main, independent of Carson answer author',
  order: 'All11 original/current written tasks independently solved before any answer or choice draft. Current source/edition andactualfig77/spec read before answerdraft; then all11displayanswers, notes andexactbookRaw compared.',
  bindings: {
    draft: freeze.bindings.draft, authorFreeze: await bind(freezePath),
    prepared: freeze.bindings.prepared_template,
    modernExercises: freeze.bindings.edition_exercises,
    sourceExercises: freeze.bindings.source_exercises,
    capturedBookAnswers: freeze.bindings.source_answers,
    independentRawSolutions: await bind(`${work}/d016-independent-raw-solutions.md`),
    actualFigureObservation: await bind(`${work}/d016-choice-source-review-freeze.json`),
  },
  exercises: draft.answers.map((answer, index) => ({
    exercise: answer.exercise, status: 'pass', evidence: evidence[index],
    grading: 'ungraded', parts: [], source: answer.source,
    bookRawExact: Object.hasOwn(answer, 'bookRaw'),
  })),
  correctionsAlreadyInAuthorDraft: [
    'Task6 retainsprinted3.53e8 bookRaw andcorrectsstandardto3.53e5Pa.',
    'Task8 retainsbookmodulusonly andsuppliesmissingrequestedstress.',
    'Task10 retainsprinted.33kg andcorrectsstandardto.0332kg.',
  ],
  constants: {
    gravity: 9.8, roundedAvogadro: 6.02e23, waterSpecificHeat: 4200,
    iceSpecificHeat: 2100, iceFusion: 340000, waterVaporization: 2260000,
    kelvinOffset: 273.15,
  },
  choiceConstantDifference: 'Choice11 explicitlyrounds vaporizationto2.3e6; thisstandarduseschapter2.26e6. Bothgivevalid0Cice-watercoexistence butdifferentresidualicemass. Neitheriscross-applied.',
  findings: [], unresolved: [],
  limits: 'Independentsemanticanswergate only; sourcecaptureandfigureapprovalinherited, notrepeated. Numericstandardsintentionallyread-only/ungraded per ticket. Noauto-gradingkeyboard, legacyinteractions, browseracceptance, production or fullprojectchecks.',
}, null, 2) + '\n', { flag: 'wx' });
console.log('Independent answer gate PASS:11read-onlystandards, eightexactbookRawentries, allsource targets retained.');
