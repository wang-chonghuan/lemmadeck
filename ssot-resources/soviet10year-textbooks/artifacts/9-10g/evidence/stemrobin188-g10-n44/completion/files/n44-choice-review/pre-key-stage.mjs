import { choice, read, write, seal, binding, now } from './audit-lib.mjs';

const optionEvidence = [
  [
    ['a', true, 'Midpoint (2,3,1)=A.'],
    ['b', true, 'Oxz reflects y: (1,1,2) -> (1,-1,2)=B.'],
    ['c', true, 'Oyz reflects x: (3,1/2,-1) -> (-3,1/2,-1)=D.'],
    ['d', true, 'Oxy reflects z: (0,2,3) -> (0,2,-3)=E.'],
    ['e', true, 'Midpoint O,(0,0,-3)=(0,0,-3/2)=G.'],
    ['f', false, 'Positive x translation gives (5,0,1), not A.'],
    ['g', false, 'Reflecting x gives (-1,1,2), not B.'],
    ['h', false, 'Midpoint is (-3,1/2,1), wrong z sign.'],
  ],
  [
    ['a', false, 'P-Q reverses both required triples.'],
    ['b', false, 'P+Q=(1,-1,-3),(-1/10,-4/3,3/2) is not Q-P.'],
    ['c', true, 'Q-P=(-3,5,-3),(-11/10,4/3,-1/6).'],
    ['d', false, 'Absolute differences lose negative components.'],
  ],
  [
    ['a', false, 'Zeros y: Oxz projection, not Oyz.'],
    ['b', true, 'Oyz: B=(0,-3,1); norm sqrt(10).'],
    ['c', false, 'Zeros z: Oxy projection, not Oyz.'],
    ['d', false, '10 is squared norm; norm sqrt(10).'],
  ],
  [
    ['a', false, 't=-1: squared distances 5,13.'],
    ['b', false, 't=0: squared distances 6,10.'],
    ['c', false, 't=2: squared distances 14,10.'],
    ['d', true, 't=1: squared distances 9,9; 4t=4 uniquely.'],
  ],
  [
    ['a', false, 'Unaveraged B+C-A=(4,3,7), A+C-B=(4,-3,-1): squared 74,26, not medians.'],
    ['b', true, 'Median squared norms 62/4,53/4; positive roots sqrt(62)/2,sqrt(53)/2.'],
    ['c', false, 'Half side lengths BC/2,AC/2 do not give medians.'],
    ['d', false, 'BC and AC side lengths, not medians.'],
  ],
  [
    ['a', true, 'T=(10/3,-1/3,3); OT squared=182/9.'],
    ['b', false, 'Norm of coordinate sum, omitted /3.'],
    ['c', false, 'AB midpoint (3,-1/2,3) has norm sqrt(73)/2, not centroid.'],
    ['d', false, 'Coordinate sum /2, not centroid /3.'],
  ],
  [
    ['a', false, 'C dot product -5, not +5; C is obtuse.'],
    ['b', false, '225,150,54 are squared products; cosine denominators are their positive roots.'],
    ['c', false, 'Origin-ray dots 12,27,15 with norms sqrt(14),sqrt(35),5; not vertex-based internal angles.'],
    ['d', true, 'Cosines 14/15,11/(5sqrt(6)),-5/(3sqrt(6)); angles 21.03947,26.08454,132.87599 degrees.'],
  ],
  [
    ['a', false, 'Only one of three completions; incomplete all-cases answer.'],
    ['b', false, 'Pairs selected from known segments are not the required diagonal pairs.'],
    ['c', true, 'All three opposite-known-pair cases: squared diagonals (33,105),(10,174),(59,27).'],
    ['d', false, 'D=A+B+C yields wrong alternative squared lengths 9,54,3 instead of 105,174,27.'],
  ],
  [
    ['a', true, 'Equal midpoint (0,2,1/2); AC,BD not proportional; bisecting diagonals suffice.'],
    ['b', false, 'True telescoping identity insufficient: D=(0,0,0) counterexample still satisfies it.'],
    ['c', true, 'AB=DC=(-1,-3,1); AB cross BC=(-23,5,-8) nonzero; D=A+C-B.'],
    ['d', false, 'CD=(1,3,-1)=-AB; stated equality does not hold.'],
  ],
  [
    ['a', false, 'Denominator 6441 is squared-norm product, not sqrt(6441).'],
    ['b', true, 'Acute ray angle arccos(63/sqrt(6441))=38.28028412223281 degrees.'],
    ['c', false, 'Supplement of wrong squared-norm angle.'],
    ['d', true, 'True supplement 141.7197158777672 degrees; four rays have exactly these two sizes.'],
  ],
];
const fidelity = [
  'All five named points retained; midpoints/reflections/translation require endpoint geometry. Actual drawing capacity deferred, not input copying.',
  'Both original P,Q pairs and direction retained; full two-triple unit. Written derivation deferred.',
  'Oyz projection and origin distance retained; distinguishes component removal and length from square.',
  'Entire real Oy preserved; unique equidistant point, no sign-domain narrowing.',
  'Both full medians retained; opposing midpoints distinguished from half sides.',
  'Centroid-origin distance retained; no median or midpoint replacement.',
  'All A,B,C internal angles, arccos [0,pi], including obtuse C.',
  'No source vertex order assumed; all three unordered diagonal pairs required.',
  'True sufficient nondegenerate proof arguments required; telescoping identity is not proof. Free proof composition deferred.',
  'All intersection-ray sizes, explicit acute and supplement; source diagonal-angle conventions not silently narrowed.',
];
const views = read(`${choice}/views-only.json`);
const questions = views.map((view, index) => ({
  ordinal: index + 1,
  task_fidelity: { verdict: 'pass', evidence: fidelity[index] },
  redundancy: { verdict: 'pass', evidence: 'Distinct response unit; shared coordinates in 5-7 and 9-10 target different source subtasks, not duplicate answers.' },
  answer_leakage: { verdict: 'pass', evidence: 'No source selectors/keys; repeated data are not results. Q10 internal intersection does not prove Q9 midpoint/equal-side criteria; Q9 supplies no Q10 norms/dot.' },
  mathematics: {
    verdict: 'pass', independent_solution: optionEvidence[index].map(e => `${e[0]}: ${e[2]}`).join(' '),
    correct: optionEvidence[index].filter(e => e[1]).map(e => e[0]),
    option_checks: optionEvidence[index].map(([option_id, truth, evidence]) => ({ option_id, truth: truth ? 'correct' : 'incorrect', evidence })),
  },
}));
if (questions.reduce((n, q) => n + q.mathematics.option_checks.length, 0) !== 44) throw new Error('Not 44 independent option checks');
write(`${choice}/pre-key.json`, {
  schema: 'same188-6/pre-key-independent-options@1', completed_at: now(),
  disclosed_fields: 'questions[].view only',
  prior_FIRST_seal: binding(`${choice}/FIRST-source.seal.json`),
  view_read_receipt: binding(`${choice}/views-read-receipt.json`),
  evidence: binding(`${choice}/pre-key.md`), question_reviews: questions,
  count: { questions: 10, options: 44, single: 7, multiple: 3 },
  author_correct_sets_read: false, author_rationales_read: false, author_coverage_read: false,
});
seal('pre-key', [`${choice}/pre-key.md`, `${choice}/pre-key.json`, `${choice}/views-only.json`, `${choice}/views-read-receipt.json`], {
  chronology: 'All fidelity/redundancy/leakage judgments and all 44 independent truth checks persisted before any author internals/coverage/rationales.',
});
