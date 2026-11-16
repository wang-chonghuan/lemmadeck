import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const freeze = await read(`${work}/9p-t8-choice-author-freeze.json`);
const draftPath = `${work}/9p-t8-choice-draft.json`;
assert.deepEqual(await bind(draftPath), {
  path: freeze.bindings.draft.path, sha256: freeze.bindings.draft.sha256,
});
const draft = await read(draftPath);
const visible = draft.questions.map(({ id, source_numbers, view }) => ({ id, source_numbers, view }));
const correct = [['a', 'c'], ['c'], ['a', 'b', 'd'], ['b'], ['b'], ['d'], ['c'], ['a'], ['c'], ['d'], ['b']];
const solutions = [
  'Preferred polycrystal orientation does not prove single crystal; noncrystalline directional structure defeats crystallinity inference. Isotropy also does not rule out crystalline order.',
  'Below-melting softening is changed but liquid processing requires additional viscosity/kinetic/shape-retention conditions. Sharp melting neither prevents every deformation nor preserves solid lattice after melting.',
  'Sugar crystalline; amber amorphous; aluminum crystalline even as a macroscopically isotropic randomly oriented polycrystal.',
  'WithNA6.02e23, total ion density2rhoNA/M givesd=(M/(2rhoNA))^(1/3)≈2.80e-10m. Same-species nearest distance is sqrt2*d, not target unlike distance.',
  'D=.004m,A=piD^2/4;F=600piN≈1.9e3N.',
  'sigma_bottom=1800*9.8*20=352800Pa; identical safety factor makes minimum required strength increase with the supported height above each section.',
  'Top supports whole wire:rho*g*l=limit; l=3.2e8/(7800*9.8)=4.186km. Lower free end stress is zero.',
  'A2.5mm2=2.5e-6m2; sigma4e7Pa; epsilon.001/5=.0002; E2e11Pa.',
  '50C=323.15K; heating276.85K. v=sqrt(2*(125*276.85+25000))=345.27m/s.',
  '12600J released bywater; eachkgice absorbs6300+340000+33600=379900J. m=.0331666kg, rounds.0332kg.',
  'With explicitly suppliedL2.3e6, steam gives.0066*(2300000+420000)=17952J; full ice fusion18496J. Residual ice544/340000=.0016kg, coexistence0C.',
];
const checks = [
  ['Preferred orientations can preserve anisotropy without one continuous crystal.', 'Random polycrystal/cubic crystal counterexample disproves isotropy=>amorphous.', 'Amorphous directional response supplies counterexample to the universal inference.', 'Excluding external shape does not exclude aligned/stressed amorphous material.'],
  ['Sharp melting says nothing preventing all mechanical shape changes, including liquid.', 'Liquid alone does not guarantee workable viscosity/kinetics/shape retention.', 'Correctly identifies the altered method and still-missing liquid processing conditions.', 'Melting destroys the long-range solid lattice; solid identity is not permanent shape.'],
  ['Ordinary sucrose particles have periodic crystalline order.', 'Ordinary amber lacks the stipulated long-range periodic lattice.', 'Random orientation between crystals does not make each grain amorphous.', 'Aluminum remains crystalline despite possible bulk isotropy.'],
  ['Counts one ion instead oftwo per formula unit; gives3.52e-10m, too large by cube-root2.', 'All-ion count2rhoNA/M and1site perd^3 gives2.80e-10m.', 'Eight-ion count invents an extra factor4 relative to the correct formula-unit count; gives1.76e-10m.', 'sqrt2*d is nearest same-species diagonal spacing, not nearest unlike spacing.'],
  ['Usingdiameter asradius inflates area/force4times:7540N≈7.5e3N.', 'Correct diameter conversion and circular area give1885N≈1.9e3N.', 'Treating.4cm as.04m inflates force100times≈1.9e5N.', 'Treating.4cm as.0004m reduces force100times≈19N.'],
  ['Usesmean supported height10m instead of full20m, halving bottom stress.', 'Correct bottom stress but equal minimum strength ignores different supported weight.', '1800*20=36000 omitsg; weight force cannot be mass-only.', 'Full20m supported weight gives3.53e5Pa; lowersections need greater minimum strength under fixed safety factor.'],
  ['Usingaverage stressrho*g*l/2 as maximum doubles threshold length.', 'Right length but lowerfree end supports no wire weight; not controllingsection.', 'Correct threshold4.19km and maximumtop stress.', 'A tenfold excessiveg or decimal shift reduces lengthtenfold to.419km.'],
  ['Both requested targets correct:4e7Pa and2e11Pa.', 'Convertingmm2 asmm instead of squaring usesarea2.5e-3m2, makingboth values1000times too small.', 'Treating1mm as1m inflatesstrain1000times and reducesE1000times.', 'Multiplyingstress bystrain instead ofdividing yields8000Pa.'],
  ['Omits fusion term: sqrt(2*125*276.85)=263.08m/s.', 'Subtracts50directly from600without temperature-scale conversion:433.01m/s.', 'IncludesKelvin conversion, latent heat and kinetic factor2:345.27m/s.', 'Drops kinetic-energyfactor2: sqrt(125*276.85+25000)=244.14m/s.'],
  ['Omits icewarming6300J/kg:12600/373600=.0337259kg rounds.0337.', 'Omits melted-waterwarming33600J/kg:12600/346300=.0363846kg rounds.0364.', 'Omits fusion340000J/kg:12600/39900=.315789kg rounds.316.', 'Allthree absorptionstages yield.0331666kg rounds.0332.'],
  ['Usessteam energy to heatall.561kgwater while omitting originalicemelting:17952/(.561*4200)=7.619C.', 'Steam heat544Jshort of fullfusion leaves1.60gice at0C.', 'Exactlyall melted at0C would require18496J, not17952J.', 'Liquid-only equation gives-544/(.561*4200)=-.23088C outside its all-liquid assumedregime; ice/water coexistence remains0C.'],
];
const fidelity = [
  'Retains the sufficient-evidence question and both crystalline/polycrystal and amorphous counterexamples rather than only naming anisotropy.',
  'Retains the hypothetical occupational/process implication; selects a conditional argument rather than a vocabulary label.',
  'Requires allthree named material classifications and distinguishes bulkisotropy from crystalgrain order.',
  'RetainsM,rho, suppliedideal alternatingion model and nearestunlike distance; explicit roundedNA completes arithmetic without pretending photo calibration.',
  'Retains diameter, axialload, uniformstress, static/centroidal/no-self-weight assumptions and complete force target.',
  'Complete answer must combinebottomstress and minimumstrength comparison; matched safetyfactor clarifies rather than replaces original qualitative target.',
  'Retains uniformarea/selfweight/freeend/strength/density; controllingtopsection adds necessary reasoning to the length.',
  'Retains every numericaldatum and jointly testsbothstress andmodulus, not just one slot.',
  'Retains600K/50C and all energydata; suppliedconversion still requires applying both scales and both energyterms.',
  'Retainsmass andthree temperatures; suppliedroundedphysicalconstants preserve allthree heatstages and originalice-mass target.',
  'Retainsallmasses/temperatures andoriginal finaltemperature, addsphasejudgment needed to avoid invalidenergybranch; explicit2.3e6 is roundedcandidateconstant, not source-table recovery.',
];
const redundancy = [
  'q03 also uses polycrystal/isotropy but doesnot supply the stressedamorphous counterexample or this complete true set.',
  'No otherquestion supplies meltviscosity/kinetics argument.',
  'q01 doesnot identify sugar/amber/aluminum structures; neither question can be answered solely by the other.',
  'Unique microscopicnumberdensity/cuberoot target; no other option gives thisspacing.',
  'q08 uses relatedstress law but neither supplies thisarea orforce; q08 also requires strain/modulus.',
  'q07 concerns hangingtension atupperend, not thisbase compression ormaterialstrengthcomparison.',
  'q06 doesnot provide thissteelstrength/density or controllingfreeend condition.',
  'q05 force inverse lacks thisextension and Youngmodulus; both outputs require independent arithmetic.',
  'q10/11 thermalbalance shares heatconcept but no speed/absolute-temperature/kinetic result.',
  'q11 supplies similarphysicalconstants, already explicit here; itdoesnot give thiscoldice three-stage mass result.',
  'q10all-liquid final8C is different regime; thisice/steam energytest must be done independently.',
];
const questionReviews = visible.map((question, index) => ({
  question_id: question.id,
  task_fidelity: { verdict: 'pass', evidence: fidelity[index] },
  redundancy: { verdict: 'pass', evidence: redundancy[index] },
  answer_leakage: { verdict: 'pass', evidence: index === 3
    ? 'Externalfig77has no ions/scale/result. Stemstateslatticemodel but notdistance formula; alternatives still require totalioncount andvolume-root.'
    : 'Stem supplies physicaldata/conditions, not the requested conclusion; no key/rationale/source-mapping cue visible. Differences among complete alternatives require the recorded reasoning.' },
  mathematics: {
    verdict: 'pass', independent_solution: solutions[index], correct: correct[index],
    option_checks: question.view.options.map((option, optionIndex) => ({
      option_id: option.id, truth: correct[index].includes(option.id) ? 'correct' : 'incorrect',
      evidence: checks[index][optionIndex],
    })),
  },
}));
assert.equal(questionReviews.length, 11);
assert.equal(questionReviews.reduce((sum, question) => sum + question.mathematics.option_checks.length, 0), 44);
await fs.writeFile(`${work}/d016-choice-view-review-freeze.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', role: 'Unique initial semantic gate view-only stage',
  authorFreeze: await bind(`${work}/9p-t8-choice-author-freeze.json`),
  draft: await bind(draftPath),
  sourceReview: await bind(`${work}/d016-choice-source-review-freeze.json`),
  visible, questionReviews,
  all44OptionsIndependentlyChecked: true,
  authorCorrectSetsRationalesOrIntentRead: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log('Frozen source/view-first fidelity and independent true sets for11questions/44options before key disclosure.');
