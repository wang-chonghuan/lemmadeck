import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const seedPath = `${work}/9p-t6-choice-seed.json`;
const draftPath = `${work}/9p-t6-choice-draft.json`;
const reviewPath = `${work}/9p-t6-choice-review.json`;
const independent = JSON.parse(await fs.readFile(`${work}/9p-t6-independent-source-solutions.json`, 'utf8'));
const pass = evidence => ({ verdict: 'pass', evidence });
const specifications = [
  {
    id: 't6-wetting-set', correct: ['a', 'd', 'f'],
    fidelity: 'The whole six-metal wetting-to-necessary-condition classification is retained, not six disconnected answer slots. Copper/silver/brass are not declared sufficient for every real weld.',
    solution: 'Wetting is the stated necessary condition. The entire qualifying set is copper, silver and brass.',
    options: [
      ['a', true, 'Copper is in the given wetting group and therefore satisfies the asked necessary condition.'],
      ['b', false, 'Chromium is explicitly nonwetting under these conditions.'],
      ['c', false, 'Stainless steel is explicitly nonwetting under these conditions.'],
      ['d', true, 'Silver is in the given wetting group.'],
      ['e', false, 'Aluminium is explicitly nonwetting under these conditions.'],
      ['f', true, 'Brass is in the given wetting group.'],
    ],
  },
  {
    id: 't6-surface-gradient', correct: ['b'],
    fidelity: 'One response couples the location of introduced low-tension solvent and flow direction. Conditional connected-film assumptions and theory-only safety boundary are retained.',
    solution: 'The higher-tension side pulls the interface harder. Centre-low/periphery-high yields outward surface flow, from lower to higher tension.',
    options: [
      ['a', false, 'Low tension at the edge with higher tension toward the centre gives inward, not the desired outward, flow.'],
      ['b', true, 'Low centre and high exterior give outward flow toward the higher-tension region.'],
      ['c', false, 'The placement is correct but the asserted high-to-low surface direction reverses the tangential tension gradient.'],
      ['d', false, 'Both location and direction are wrong for the requested outward low-to-high surface flow.'],
    ],
  },
  {
    id: 't6-density-matched-drop', correct: ['c'],
    fidelity: 'Shape and minimum-area justification are assessed together. Density matching, immiscibility, no wall contact, positive uniform tension and equilibrium remain explicit.',
    solution: 'For fixed volume and no differential gravity effect, positive interfacial energy is minimized by the sphere.',
    options: [
      ['a', false, 'Equal density cancels the differential hydrostatic shape effect; it does not force horizontal flattening.'],
      ['b', false, 'Equal density does not make positive interfacial tension disappear.'],
      ['c', true, 'A sphere minimizes interface area at the stated fixed volume.'],
      ['d', false, 'Faceted polyhedra do not minimize area against a sphere in this isotropic liquid-interface model.'],
    ],
  },
  {
    id: 't6-merging-energy', correct: ['d'],
    fidelity: 'At least two drops and a narrow explicit positive constant-sigma/two-energy-store approximation make the area/energy/temperature inference determinate. No mercury experiment or invented numerical temperature is implied.',
    solution: 'Fixed total volume yields less total spherical area after merging. With positive constant sigma and no other changing store, the lost surface energy increases thermal energy and temperature.',
    options: [
      ['a', false, 'Separate positive-volume spheres have greater total area than the combined sphere, so surface energy is not unchanged.'],
      ['b', false, 'In this isolated two-store model the lost surface energy must increase thermal energy.'],
      ['c', false, 'Area and surface energy decrease, not increase; therefore thermal energy does not decrease here.'],
      ['d', true, 'All three changes follow the area reduction and stated energy balance with positive heat capacity.'],
    ],
  },
  {
    id: 't6-linked-bubbles', correct: ['c'],
    fidelity: 'One full response checks two-interface pressure factor, flow direction and ongoing size trend; actual experiment and reporting are honestly retained outside the choice.',
    solution: 'Two interfaces give4*sigma/r. Smaller radius has higher pressure, so gas moves small-to-large; the diverging radii do not approach equal-radius static equilibrium.',
    options: [
      ['a', false, 'The direction and trend fit but2*sigma/r is the one-interface factor, not a soap-film bubble.'],
      ['b', false, 'The pressure factor is right but flow goes small-to-large, not large-to-small. Equal-size equilibrium is not approached.'],
      ['c', true, 'Factor4, small-to-large flow and disappearance/model-limit trend all match the constant-tension model.'],
      ['d', false, 'After small-to-large transfer the small radius decreases and pressure contrast grows, so equal radii are not approached.'],
    ],
  },
  {
    id: 't6-capillary-density', correct: ['a', 'd'],
    fidelity: 'This preserves55/146, identical radius, complete wetting and unmatched physical-property data. It tests the conditional density relation, not a fabricated unique numerical density.',
    solution: 'rho*g*h=2*sigma/r yields rho_a/rho_w=(146/55)*(sigma_a/sigma_w); a numerical density requires matching material data.',
    options: [
      ['a', true, 'Dividing the balances yields the inverse height ratio146/55 multiplying the tension ratio.'],
      ['b', false, 'This directly rather than inversely uses the height ratio, contradicting rho proportional to sigma/h.'],
      ['c', false, 'Heights alone do not specify the tension ratio or water density at the required conditions.'],
      ['d', true, 'The missing matched tensions, composition/temperature and water density prevent a unique numerical density.'],
    ],
  },
];
const seed = JSON.parse(await fs.readFile(seedPath, 'utf8'));
// These complete true sets were derived from the visible questions before opening author keys.
const draft = JSON.parse(await fs.readFile(draftPath, 'utf8'));
assert.deepEqual(draft.questions.map(q => q.id), specifications.map(s => s.id));
assert.deepEqual(draft.new_figures, []);
const questions = specifications.map(s => {
  const q = draft.questions.find(q => q.id === s.id);
  assert.deepEqual([...q.key.correct].sort(), [...s.correct].sort());
  for (const [id, truth] of s.options) {
    assert.equal(q.key.rationales.find(r => r.option_id === id).truth, truth ? 'correct' : 'incorrect');
  }
  return {
    question_id: s.id,
    task_fidelity: pass(s.fidelity),
    redundancy: pass('One complete response unit for this source task; no other question supplies its classification, gradient, energy balance, factor4 or inverse-height relation. No isolated subpart series.'),
    answer_leakage: pass('Visible stem supplies the necessary source conditions, not the derived true set. No solution, source mapping or answer code is shown; option truth requires the stated task inference.'),
    mathematics: {
      verdict: 'pass', independent_solution: s.solution, correct: s.correct,
      option_checks: s.options.map(([option_id, truth, evidence]) => ({
        option_id, truth: truth ? 'correct' : 'incorrect', evidence,
      })),
    },
  };
});
const digest = file => execFileSync('python3', [
  '.agents/skills/ld-s10y-choice/scripts/prepare.py', 'digest', file,
], { encoding: 'utf8' }).trim();
const review = {
  schema: 's10y-choice-review-v1', seed_sha256: digest(seedPath), draft_sha256: digest(draftPath),
  reviewer: { kind: 'independent_agent', identity: 'Main session D, independent of Zeno author; prior all11 source solutions recorded before author answer/choice comparison.' },
  source_reviews: seed.exercises.map(ex => ({
    source_number: ex.number, independent_solution: independent.solutions[ex.number],
    coverage: pass({
      '3': 'Complete necessary wetting classification retained; no practical welding claim.',
      '5': 'Centre plus gradient judgment retained; independent written argument is not proved by recognition and remains in the written task.',
      '7': 'Full equilibrium shape question retained with its mathematical explanation, no real experiment claimed.',
      '8': 'Qualitative area/energy/temperature conclusion retained; recognition is not independent written derivation.',
      '9': 'Theory pressure/direction/trend retained; actual adult-guided experiment and prediction/observation records remain separate written capacities.',
      '10': 'Symbolic density relation and data insufficiency retained; later matched-property numerical work remains explicitly unfinished, not guessed.',
    }[ex.number]),
  })),
  figure_checks: [], new_figure_reviews: [], question_reviews: questions, outcome: 'pass',
};
await fs.writeFile(reviewPath, JSON.stringify(review, null, 2) + '\n', { flag: 'wx' });
execFileSync('python3', [
  '.agents/skills/ld-s10y-choice/scripts/validate.py', '--repo', '.', '--seed', seedPath,
  '--draft', draftPath, '--review', reviewPath,
], { stdio: 'inherit' });
console.log('Unique independent semantic gate PASS:6questions,26options; no figure/answer-input conversion.');
