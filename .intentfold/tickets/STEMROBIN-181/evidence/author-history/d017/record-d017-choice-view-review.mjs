import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const viewPath = `${work}/9p-t4-choice-view.json`;
const seedPath = `${work}/9p-t4-choice-seed.json`;
const view = await read(viewPath);
const seed = await read(seedPath);
assert.equal(view.questions.length, 7);
const evidence = [
  {
    id: 'q-angle', correct: ['b'],
    solution: 'Uniform isotropic free thermal scaling is a similarity; phi stays fixed while both radius and gap lengths scale.',
    fidelity: 'Selects the angle and its physical/geometric reason together; retains isotropy, uniform temperature, free expansion and no phase change. No numerical angle inferred from101.',
    options: [
      ['a', false, 'Expansion scales the radial edges; it does not fill missing material inward to shrink their angle.'],
      ['b', true, 'A common linear scale factor preserves the angle and similarity.'],
      ['c', false, 'The radius is not fixed while the gap expands; both scale together.'],
      ['d', false, 'The material boundary lengths change although the missing sector has no material; its purported reason is false.'],
    ],
  },
  {
    id: 'q-liquid', correct: ['c'],
    solution: 'At common temperature and fixed liquid mass, relative liquid volume growth exceeding reference cavity growth explains the observed rise.',
    fidelity: 'Retains rising-level given phenomenon rather than declaring all materials rise. Requires relative liquid/cavity reasoning, not apparatus operation.',
    options: [
      ['a', false, 'A larger cavity gives more capacity, not upward squeezing; smaller relative liquid growth need not raise the level.'],
      ['b', false, 'At fixed mass, larger density means smaller liquid volume; it cannot explain the stated relative expansion.'],
      ['c', true, 'Excess liquid growth beyond the co-expanding reference capacity enters higher portions of the tube.'],
      ['d', false, 'Glass expansion increases, not universally shrinks, the capillary diameter; liquid change cannot be ignored.'],
    ],
  },
  {
    id: 'q-sensitivity', correct: ['b'],
    solution: 'Equal capillary area and effective expansion properties give delta-h proportional to reservoir volume times the common temperature change.',
    fidelity: 'Selects the reservoir comparison with its volume-to-height reason. Matched properties, negligible tube inventory and equilibrium-height definition retain the needed model; response speed is explicitly different.',
    options: [
      ['a', false, 'Effective volume increment is proportional to reservoir volume, not independent of it.'],
      ['b', true, 'Larger reservoir supplies a larger excess volume into the same capillary area.'],
      ['c', false, 'Equal area does not ensure equal excess volume; the reservoir factor remains.'],
      ['d', false, 'Equilibrium sensitivity does not guarantee faster thermal equilibration; no thermal conductance/heat-capacity model is supplied.'],
    ],
  },
  {
    id: 'q-hoop', correct: ['c'],
    solution: 'D0=1-0.005=0.995m; delta-T=0.005/(0.995*12e-6)=418.760469K, rounded to1C gives419C.',
    fidelity: 'Preserves1m/5mm/12e-6, actual initial inner-diameter reference, minimum no-clearance requirement and explicit rounding. Tests setup and result together.',
    options: [
      ['a', false, 'Uses the wheel diameter as D0;417C follows that incorrect1m reference.'],
      ['b', false, '42C arises from reducing the5mm increment by a factor of10; it falls short.'],
      ['c', true, 'Correct initial diameter and rounded computed temperature rise.'],
      ['d', false, '838C doubles the required diameter increment as if5mm were a radial rather than diametral difference.'],
    ],
  },
  {
    id: 'q-density', correct: ['a', 'c', 'e'],
    solution: 'Equal actual volumes and common g imply rho60/rho0=83/88. Fixed-mass V60/V0=88/83, hence alpha=(88/83-1)/60=0.001004016/K.',
    fidelity: 'Multiple mode retains density inversion, fixed-mass reference interpretation and mean coefficient in one response unit; both equal-volume sample and unequal-mass distinction are explicit.',
    options: [
      ['a', true, 'At common fixed V and g, weight ratio is density ratio83/88.'],
      ['b', false, 'Equal sampled volumes do not mean the same mass had zero expansion; sampled masses differ.'],
      ['c', true, 'Initial-reference linear expansion uses the reciprocal density ratio88/83 and the60K interval.'],
      ['d', false, 'Dividing by88 uses the wrong reference volume; it gives0.00094697/K rather than0.001004016/K.'],
      ['e', true, 'For a fixed mass, volume is inversely proportional to density, giving88/83.'],
    ],
  },
  {
    id: 'q-stress', correct: ['d'],
    solution: 'Stress-free0C plus constant E/beta and fixed axial length give total compressive magnitude3e7*(25/10)=7.5e7Pa.',
    fidelity: 'Retains fully fixed linear-elastic model,0C reference,10C datum and25C total stress, excluding wall deformation/buckling/plasticity.',
    options: [
      ['a', false, '4.5e7Pa is only the extra15K stress above10C, not total stress from0C.'],
      ['b', false, '1.2e7Pa uses inverse10/25 scaling instead of direct proportionality.'],
      ['c', false, '3e7Pa incorrectly freezes the10C value while thermal strain increases.'],
      ['d', true, 'Direct25/10 scaling gives7.5e7Pa compressive magnitude.'],
    ],
  },
  {
    id: 'q-switch', correct: ['a', 'd', 'e'],
    solution: 'Current102 shows upper contact over the free left portion and right fixed/connected side. Warming must bend downward to open; lower beta is smaller. A below-path initially separated signal contact closes on warming.',
    fidelity: 'One multiple response retains all three source tasks: feedback mechanism, lower/upper coefficient relation and conceptual signal-contact change. No layer swap, new diagram or operating instructions.',
    options: [
      ['a', true, 'Downward bend breaks the upper series contact; cooling restores it, providing switching feedback rather than exact constant temperature.'],
      ['b', false, 'Lower layer is the shorter inner side of a downward bend, so its free thermal extension is smaller, not larger.'],
      ['c', false, 'Downward motion increases separation from an upper contact initially above the strip.'],
      ['d', true, 'Upper outer layer has greater free extension; lower layer smaller beta.'],
      ['e', true, 'A lower fixed contact in the downward path can close after the initial gap is traversed.'],
    ],
  },
];
const questionReviews = view.questions.map((question, index) => {
  const item = evidence[index];
  assert.equal(question.id, item.id);
  assert.deepEqual(question.options.map(option => option.id), item.options.map(option => option[0]));
  return {
    question_id: question.id,
    task_fidelity: { verdict: 'pass', evidence: item.fidelity },
    redundancy: { verdict: 'pass', evidence: 'No repeated response slot or package dependence. Numerical tasks use distinct datasets; liquid-rise and sensitivity tasks require different comparisons, and neither selects the other answer.' },
    answer_leakage: { verdict: 'pass', evidence: 'The visible stem supplies conditions and givens only. Alternatives require judging full claims; no source mapping, author reasoning, answer key or diagram solution annotation appears.' },
    mathematics: {
      verdict: 'pass', independent_solution: item.solution, correct: item.correct,
      option_checks: item.options.map(([option_id, truth, evidence]) => ({
        option_id, truth: truth ? 'correct' : 'incorrect', evidence,
      })),
    },
  };
});
await fs.writeFile(`${work}/d017-choice-view-review-freeze.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', seed: await bind(seedPath), view: await bind(viewPath),
  rawIndependentSolutions: await bind(`${work}/d017-independent-raw-solutions.md`),
  priorFigureGate: await bind(`${work}/9p-t4-figure-review.json`),
  source_reviews: seed.exercises.map((exercise, index) => ({
    source_number: exercise.number, independent_solution: evidence[index].solution,
    coverage: { verdict: 'pass', evidence: evidence[index].fidelity + ' Recognition replaces free written explanation; that response-capacity limit is explicit, not a mathematical task omission.' },
  })),
  figure_checks: seed.figures.flatMap(figure => figure.assets.map(asset => ({
    figure_id: figure.id, asset_path: asset.path, asset_sha256: asset.sha256,
    observation: figure.id === 'fig-101'
      ? 'Original101 plus unchanged640/331/342 previews actually opened in this invocation. One radial missing sector with phi and hatched remainder; no calibrated value or expansion state. Durable SVG matches inspected media.'
      : 'Original102 plus unchanged640/331/342 previews actually opened in this invocation. Upper contact over free left portion, right fixed/connected, plain upper and hatched lower layers, single heater in series; no answer-bearing bend or beta labels. Durable SVG matches inspected media.',
  }))),
  question_reviews: questionReviews,
  reviewOrder: 'Seed/current source and original/modern figures first; main raw solutions preceded all answer and choice drafts. View-only questions solved and complete true sets recorded here before reading this choice author key/intent/rationales.',
  authorKeyConsulted: false, new_figures: [],
  limits: 'Only this view-stage snapshot written. No draft mutation, source/figure/SCI gate repeated, browser, production or whole-project checks.',
}, null, 2) + '\n', { flag: 'wx' });
