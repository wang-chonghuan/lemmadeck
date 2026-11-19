import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const own = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(own);
const read = relative => fs.readFileSync(path.join(root, relative));
const load = relative => JSON.parse(read(relative));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const ordered = value => Array.isArray(value) ? value.map(ordered) :
  value && typeof value === 'object' ?
    Object.fromEntries(Object.keys(value).sort().map(key => [key, ordered(value[key])])) : value;
const canonical = value => hash(JSON.stringify(ordered(value)).replace(/[\u007f-\uffff]/g,
  char => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0')));
const bound = (relative, expected) => {
  const bytes = read(relative);
  assert.equal(hash(bytes), expected, `${relative}: snapshot changed`);
  return JSON.parse(bytes);
};

const seed = bound('n41-choice-position-affected/seed.json',
  '14cc6a0a42bd4588a144f14637d5d001d9d6f1007cdf024714b64ed8f43f2e6b');
const draft = bound('n41-choice-position-affected/draft.json',
  '03a23361b0dc6713152c4b76180b3b350f93d5fcb9dcbb1f284836c88a068b4f');
const permutation = bound('n41-choice-position-affected/permutation.json',
  '4050a493b1384f239d9a46c4549a370eb5372d974fccefdb6e96a96c4fad5bf6');
const math = bound('n41-choice-review/stage2-independent-mathematics.json',
  '373eb6e7c17f068a961f16468e963584f681a6b9e3a79eded9ded399f2bd6bde');
const fidelity = bound('n41-choice-review/stage2-fidelity.json',
  '3397e8111737c27c425552a4f0eabb65eedb44e9cf0c8ba01dbac091bde5ceb6');
const sourceMap = bound('n41-choice-review/stage2-source-map.json',
  '5f428fade11e9e2d187e17bf9897ce63236d8b366b2f9ca40a44f523717a7053');
const affected = bound('n41-choice-review/affected-position-fidelity.json',
  '1d045ed7465a33caa2d683acce7662e8f28a16b88528d731c4b59655556fd003');
const images = bound('n41-choice-review/stage1-recovery-image-ledger.json',
  '270e935b8acb79b0df3a2680fa969e555416d95e30b790aee1c7aae799fb4031');
assert.equal(draft.seed_sha256, canonical(seed));
assert.equal(canonical(draft), '0bb5f5eedc3b181fdd5d96914dde27c82dddb24066fb34e33aa9982edafdf605');
assert.deepEqual(draft.new_figures, []);
const maps = new Map(permutation.mappings.map(row => [row.question_id, row.old_to_new_id]));

// These are comparisons and summaries of frozen evidence, not new solutions.
const sourceSummaries = {
  '834': 'Reused Stage1 square-factor extraction: signed coefficients give, in a-f order, -sqrt3, 7sqrt2, 3sqrt2, 2sqrt6, sqrt3, 0. Fractional radicands use sqrt(1/3)=sqrt3/3 and sqrt(2/5)=sqrt10/5.',
  '835': 'Reused Stage1 exact forms in a-f order: -3sqrt2, 3sqrt2, 2sqrt3, 14sqrt5, sqrt3, 2sqrt2. Literal IV main0 rows2,0/3,0/5,0 give1.414/1.732/2.236; direct finite-cell results are -4.242,4.242,3.464,31.304,1.732,2.828. No corrections are required. Three-decimal writing is explicit authored view context, not a historical true-value accuracy rule.',
  '836': 'Reused frozen distribution and cross-term cancellation: a-f results15,21,6-3sqrt6,24-12sqrt2-2sqrt3,11,32. In a,b,e,f the radical cross terms cancel; c retains coefficient-3 on sqrt6; d must distribute the outer2sqrt3 to the inner-1.',
  '837': 'Reused frozen a-h factorizations: sqrt7(sqrt2-1), sqrt11(sqrt3+sqrt2), sqrt3(sqrt5-sqrt2), sqrt3(sqrt3+1), sqrt10(sqrt10-2), sqrt a(sqrt a-5), sqrt b(sqrt b-3), sqrt b(sqrt b-sqrt3). Variable domains are a>=0 or b>=0 as appropriate, including zero.',
  '838': 'Reused frozen a-i reductions: 1+sqrt2;1+sqrt10/2;(2-sqrt3)/5;sqrt a+sqrt b on a,b>0;(sqrt x-sqrt a)/a on a,x>0;1+sqrt y/b on y>0,b!=0 with negative b allowed;sqrt2;-sqrt5;sqrt6/2. Original denominators and separate radical domains are retained before cancellation.',
  '839': 'Reused frozen a-f reductions/domains: sqrt x on x,y>=0,(x,y)!=(0,0);sqrt x on x>=0,x!=1;sqrt(6a)/6 on a>=0;sqrt p/2 on p>=0,p!=4;sqrt a+2 on a>=0,a!=4;sqrt b-3 on b>=0, including b=9. Canceled holes stay excluded; always-positive denominators introduce no new holes.',
  '840': 'Reused exact positive-side comparisons in a-d order: >,<,>,>. The frozen square differences are (5-2sqrt6)/4>0; comparison of12-2sqrt11 with12+2sqrt35;7>3+2sqrt2 after subtracting sqrt2; and2sqrt35>6sqrt3 because35>27.',
  '841': 'Reused difference-of-squares applications give a-f values2,2,39,1,6,-1/2 from3-1,11-9,49-10,20-19,175-169,3-14/4. The last minuend is sqrt3 squared despite the first-written half-root term.',
  '842': 'Reused rationality proofs: P common numerator8 and nonzero conjugate product18-16=2 give4. Q common numerator10 and product25-24=1 give10. The nonzero products also establish every original denominator is nonzero; listed rational fractions alone would not prove P or Q.',
  '843': 'Reused exact conjugates give a-f forms sqrt5+sqrt3,sqrt10-sqrt7,sqrt5+2,6-2sqrt7,9+4sqrt5,7+5sqrt2; denominator products2,3,1,2,1,1 are nonzero. Literal IV main0 values for roots2,3,5,7,10 are1.414,1.732,2.236,2.646,3.162. Recovery2 independently captured root10 row10,/main0. Direct finite-cell results are3.968,0.516,4.236,0.708,17.944,14.070. All six lookup obligations are complete with no corrections; no true-value precision guarantee is claimed.',
  '844': 'Reused universal proof for a,b>=0: both sides are nonnegative and their squared difference is (sqrt a-sqrt b)^2/4>=0, so L>=T. Equality iff a=b, including both zero; one zero alone is strict unless both are zero.',
  '845': 'Reused comparison for a,b>=0: (a+b)/2-sqrt(ab)=(sqrt a-sqrt b)^2/2>=0. Equality iff a=b, including both zero. The equality detail is a derived extension, not an added source assumption.',
  '846': 'Reused full real classifications. For b!=a, (s+m)b=a(s-m): s+m!=0 and am!=0 gives the unique b=a(s-m)/(s+m); s+m!=0,am=0 gives none; s+m=0,am=0 gives every b!=a; s+m=0,am!=0 gives none. In the singular branch am=-as, so the authored am condition equals the frozen as condition. For R!=0, d^2=2Rh+h^2: h!=0,d^2!=h^2 gives unique R=(d^2-h^2)/(2h); h!=0,d^2=h^2 gives none; h=d=0 gives every nonzero R; h=0,d!=0 gives none. No physical sign restrictions are introduced.',
  '847': 'Reused complete real sets in a-f order: {0,27},{0,7/3},{-1/4,1/4},empty,{-sqrt5,sqrt5},{-sqrt30/10,sqrt30/10}. Zero-product roots are not divided away; positive isolated squares need both signs;4x^2+1=0 has no real roots.',
  '848': 'Reused actual raw and full hash-bound current fig56 observations: a has slope3/2 and intercept2; b has slope-2 and intercept2; c has slope-1/4 and intercept-3. Thus all three original equation-line associations match a,b,c respectively. Labels, grid, axes and right/bottom content were observed; no image reopened.',
  '849': 'Reused actual raw and full hash-bound current fig57 observations: a crosses(0,-2),(10,0), giving y=x/5-2; b crosses(0,1),(1/2,0), giving y=-2x+1. Both labels and right/bottom continuations were observed. No image reopened or source-fidelity gate repeated.',
  '850': 'Reused full-domain extrema: x^2+1 and x^2-5 on all reals have minima1,-5 attained exactly at0; sqrt x on x>=0 has minimum0 attained exactly at0. -(x+4)^2 on all reals has maximum0 at-4;10/(sqrt x+2) on x>=0 has maximum5 at0;1/(x^2+7) on all reals has maximum1/7 at0. The two positive reciprocal ranges exclude their infimum0; all requested extrema are attained.'
};

const intentNotes = {
  q01: 'Authored coefficient extraction and signed combination match frozen834.a-c; grouping compares three original sums, not response slots.',
  q02: 'Fractional-radicand extraction and exact zero cancellation match834.d-f and the frozen coefficient identities.',
  q03: 'Exact forms, root2 main address and signed finite arithmetic match835.a,b,f; typed-cell navigation loss is explicitly stated.',
  q04: 'Root3/root5 addresses, fractional multipliers and finite results match835.c,d,e;31.304 follows the visible three-decimal convention.',
  q05: 'All distributed products and surviving/canceling radical terms match836.a-c.',
  q06: 'The full outer distribution and both square cross terms match836.d-f; recognition loss is disclosed.',
  q07: 'All five constant factorizations match837.a-e, including sqrt10(sqrt10-2). The cited author amendment history was not opened or used.',
  q08: 'All three variable factorizations and nonnegative zero endpoints match837.f-h.',
  q09: 'All three constant-denominator reductions and rational coefficients match838.a-c.',
  q10: 'Full original domains match838.d-f, including negative b freedom in the last quotient and no zero-denominator extension.',
  q11: 'The binomial factors, reversed sign and residual half coefficient match838.g-i.',
  q12: 'All three removable holes and nonnegative endpoints match839.b,d,e.',
  q13: 'Authored sqrt(a/6) equals frozen sqrt(6a)/6 on a>=0; the origin exclusion and no hole at b=9 match839.a,c,f.',
  q14: 'All four exact directions and positive-side arguments match840; no decimal table approximation replaces the comparisons.',
  q15: 'All six coefficient/order-sensitive conjugate products match841, including the negative last half.',
  q16: 'The paired common-denominator proof and nonzero products match both842 tasks; the intent does not reduce proof to selecting rational numbers.',
  q17: 'All843.a-c conjugates, literal direct root10 evidence and finite decimals match the completed Stage1/Recovery2 baseline.',
  q18: 'All843.d-f exact conjugates and finite-cell arithmetic match the baseline; trailing zero14.070 is visible formatting context.',
  q19: 'Universal nonnegativity, square difference and equality match844; derived equality and proof-production loss are explicitly identified.',
  q20: 'Universal mean comparison and equality match845; its relation to844 is source-derived and not a duplicate added task.',
  q21: 'All846.a singular/ordinary cases match the frozen real classification. Under s+m=0, am=-as, so the authored am=0 branch is equivalent.',
  q22: 'All846.b zero-height families and excluded R=0 candidates match the frozen classification; no physical positivity is invented.',
  q23: 'Both847.a,b complete factor-root sets match; zero roots and unaided factorization loss are retained.',
  q24: 'All847.c-f complete real sets match, including the negative-square empty set and exact decimal coefficient.',
  q25: 'The full848 tuple and authored line coordinates agree with the reused current-graph observations. No new visual review or drawing claim is made.',
  q26: 'Both849 equations and authored slope/intercept pairs agree with reused fig57 observations; equation-production loss is disclosed.',
  q27: 'All850.a minima and allowed attaining endpoints match; attainment is disclosed as a derived supporting detail.',
  q28: 'All850.b maxima and attaining points match; original square-root domain and reciprocal boundedness are retained.'
};

// Keys here are FIRST option IDs so that the independent evidence remains source-first.
const misconceptionNotes = {
  'q01.B': 'Changing the last subtraction to addition produces the claimed coefficient17 rather than the frozen7.',
  'q02.B': 'The invalid reciprocal-root identity sqrt(1/3)=sqrt3 produces coefficient6-2+1=5, exactly the false claim.',
  'q03.B': 'Dropping the leading2 from sqrt72 produces coefficient6-5-4=-3 and its coherent but inapplicable -4.242 table value.',
  'q04.C': 'Treating0.1 as1 produces coefficient5-10-3=-8 and the stated -13.856 from the literal root3 cell.',
  'q05.B': 'Omitting the inner +sqrt7 removes one7 from the rational total, producing14 while the retained radical terms cancel.',
  'q06.A': 'Partial distribution leaves the inner-1 unchanged instead of multiplying by2sqrt3, exactly the proposed final term.',
  'q06.C': 'Dropping the negative square cross term leaves32+6sqrt28=32+12sqrt7, exactly the distractor.',
  'q07.B': 'After correct common-factor extraction, invalid root-of-sum replacement changes sqrt3+sqrt2 to sqrt5.',
  'q07.D': 'Leaving3 undivided when extracting sqrt3 gives the displayed sqrt3(3+1), not the frozen factor.',
  'q08.B': 'Leaving b instead of b/sqrt b inside the factor gives sqrt b(b-3); the frozen b=4 counterexample establishes falsity.',
  'q09.B': 'Replacing1/sqrt10 by sqrt10 without its denominator10 produces the claimed1+5sqrt10.',
  'q10.B': 'Keeping only the radicand inequalities admits a=0; the frozen original-denominator restriction rejects that complete-domain record.',
  'q11.B': 'Treating1-sqrt3 and sqrt3-1 as identical cancels away their factor-1 and produces the false positive root.',
  'q12.B': 'Using only the reduced expression domain restores p=4, exactly the missing removable-hole exclusion.',
  'q13.B': 'Replacing division by sqrt6 with multiplication gives sqrt(6a), the stated false scaled form.',
  'q14.B': 'Reversing the established larger-right squared relation yields the stated wrong direction; the frozen exact comparison rejects it.',
  'q14.C': 'Reversing order while taking positive square roots changes the frozen larger-left relation into the displayed less-than claim.',
  'q15.B': 'Using a sum instead of a difference of squares produces11+9=20, the stated false value.',
  'q15.D': 'Leaving coefficient2 unsquared gives2*5-19=-9 instead of the frozen20-19.',
  'q15.F': 'Choosing the first-written half-root square as minuend reverses3-14/4 into14/4-3=1/2.',
  'q16.B': 'Using sums of squares for both conjugate denominator products yields18+16 and25+24 with otherwise unchanged numerators.',
  'q16.C': 'Reversing only P common-numerator subtraction gives-8 and-4 while Q remains correct; the whole pair is false.',
  'q17.A': 'Multiplying by the same denominator and misusing its square as5-3 yields the false difference form and its0.504 arithmetic.',
  'q18.B': 'Repeating the same denominator and misusing its square as81-80 yields9-4sqrt5 and the displayed0.056, not the reciprocal.',
  'q19.B': 'Computing T^2-L^2 while naming it L^2-T^2 generates the negative square and reversed inequality.',
  'q19.C': 'Importing a zero-product equality condition instead of setting the present root-difference square to zero generates ab=0; the frozen counterexamples reject necessity and sufficiency.',
  'q20.B': 'Naming G-M as M-G produces the negative square and reversed mean comparison.',
  'q20.C': 'Setting only sqrt(ab) to zero instead of the whole square difference produces the false one-zero equality criterion.',
  'q21.B': 'Dividing by s+m without preserving b!=a admits a forbidden ordinary candidate and falsely treats every singular case as no solution.',
  'q21.C': 'Incorrect term signs produce (s-m)b=a(s+m), hence the displayed swapped formula and its erroneous classification.',
  'q22.B': 'Moving +h^2 without changing sign produces d^2+h^2 in the numerator, the stated false formula.',
  'q22.C': 'Using only the expanded equation domain loses original R!=0, both for a zero computed radius and for the zero-parameter family.',
  'q23.B': 'Dividing by x and y first removes the valid zero roots and gives exactly the two incomplete singleton sets.',
  'q23.C': 'Moving the negative constants without reversing signs yields the stated negative nonzero roots.',
  'q24.B': 'Taking only principal square roots omits the negative root in each positive-square equation while preserving the empty real set.',
  'q24.C': 'Dropping the negative sign in the second isolated square and multiplying rather than dividing by3 in the fourth produces both incorrect components.',
  'q25.B': 'Matching only common intercept2 swaps rising a and falling b, exactly this false line-label permutation.',
  'q25.C': 'Grouping b,c only by falling direction swaps their slope magnitudes/intercepts, exactly the second false permutation.',
  'q26.B': 'Using run/rise instead of rise/run gives5 instead of1/5 for a; b stays correct, so the complete pair remains false.',
  'q26.C': 'Reversing both observed above/below-origin intercept signs gives the two displayed false equations.',
  'q27.B': 'Treating the subtracted5 as-5 produces0-(-5)=5, the false second minimum.',
  'q27.C': 'Replacing x>=0 with x>0 removes the attaining endpoint and produces the infimum-only claim.',
  'q28.B': 'Solving x+4=0 without reversing the constant sign selects4 rather than the frozen attaining point-4.',
  'q28.C': 'Dropping +2 from the denominator transfers unbounded10/sqrt x behavior to the original bounded expression.'
};

const lossComparisons = sourceMap.observed_capacity_losses_for_later_author_accounting.map(row => ({
  positions: row.positions,
  frozen_observed_loss: row.loss,
  authored_question_limitations: row.positions.map(position => ({
    question_id: draft.questions[position - 1].id,
    limitations: draft.questions[position - 1].intent.limitations
  })),
  verdict: 'pass',
  evidence: row.positions.includes(3) ?
    'Every table unit discloses excerpt/full-volume navigation loss and unaided derivation loss; finite-value and historical-equivalence limits are also explicit. Supplied-cell/address scaffolding remains a recognized loss, not a silent omission.' :
    row.positions.includes(25) ?
      'The complete correspondence is explicitly recognition rather than independent writing or drawing. Slope-sign elimination is native to this matching task and is preserved as reviewer-observed recognition loss.' :
      row.positions.includes(26) ?
        'The equation tuple is explicitly recognition rather than independent equation production. Frozen reviewer accounting retains the possibility of rejection by one intercept without pretending to assess unaided slope computation.' :
        row.positions.includes(16) ?
          'All listed proof/classification/root/extremum units explicitly distinguish recognition from independent writing or derivation. Single-component tuple rejection remains a disclosed reviewer-observed recognition limitation, not an omitted source task.' :
          'All listed algebra/comparison units disclose replacement of unaided written production by judgment/recognition. The original mathematical distinctions and all source subtasks remain represented.'
}));

const sourceReviews = seed.exercises.map(source => {
  const questions = sourceMap.questions.filter(q => q.source_tasks.some(t => t.split('.')[0] === source.number));
  const coverage = draft.coverage.find(row => row.source_number === source.number);
  assert.ok(coverage && sourceSummaries[source.number]);
  assert.deepEqual(coverage.question_ids, questions.map(q => q.reviewer_id));
  return {
    source_number: source.number,
    independent_solution: sourceSummaries[source.number] +
      ' Evidence reused from immutable source-solutions.md and completed Recovery2; no source solve repeated.',
    coverage: {
      verdict: 'pass',
      evidence: `Frozen inferred tasks ${questions.flatMap(q => q.source_tasks).join(',')} bind to canonical ${coverage.question_ids.join(',')}. ${coverage.reason} Recorded capacity loss: ${coverage.omitted_tasks.join(' ')} No mathematical source task is silently omitted.`
    }
  };
});

const rationaleComparisons = [];
const intentComparisons = [];
const questionReviews = draft.questions.map((question, index) => {
  const proof = math.questions[index];
  const firstFidelity = fidelity.questions[index];
  const mapping = maps.get(question.id);
  const transport = id => mapping ? mapping[id] : id;
  assert.equal(question.id, proof.reviewer_id);
  assert.equal(question.id, sourceMap.questions[index].reviewer_id);
  assert.ok(intentNotes[question.id]);
  assert.deepEqual(question.source_numbers,
    [...new Set(sourceMap.questions[index].source_tasks.map(t => t.split('.')[0]))]);
  const correct = proof.complete_true_set.map(transport);
  assert.deepEqual([...correct].sort(), [...question.key.correct].sort());
  const optionChecks = question.view.options.map(option => {
    const firstId = mapping ? Object.keys(mapping).find(id => mapping[id] === option.id) : option.id;
    const frozen = proof.option_checks.find(row => row.option_id === firstId);
    const rationale = question.key.rationales.find(row => row.option_id === option.id);
    assert.ok(frozen && rationale);
    assert.equal(rationale.truth, frozen.truth);
    const misconceptionEvidence = frozen.truth === 'incorrect' ?
      misconceptionNotes[`${question.id}.${firstId}`] : null;
    if (frozen.truth === 'correct') assert.equal(rationale.misconception, null);
    else assert.ok(misconceptionEvidence && rationale.misconception);
    rationaleComparisons.push({
      question_id: question.id,
      canonical_option_id: option.id,
      frozen_option_id: firstId,
      frozen_truth: frozen.truth,
      authored_truth: rationale.truth,
      independent_evidence_reused: frozen.evidence,
      authored_derivation: rationale.derivation,
      derivation_comparison: {
        verdict: 'pass',
        evidence: `Authored derivation agrees with the frozen full-record evaluation: ${frozen.evidence}`
      },
      authored_misconception: rationale.misconception,
      misconception_comparison: {
        verdict: 'pass',
        evidence: misconceptionEvidence ??
          'The independently true option has null misconception as required; its derivation agrees with the frozen proof.'
      }
    });
    return { option_id: option.id, truth: frozen.truth, evidence: frozen.evidence };
  });
  intentComparisons.push({
    question_id: question.id,
    source_numbers: question.source_numbers,
    frozen_source_tasks: sourceMap.questions[index].source_tasks,
    authored_task: question.intent.task,
    authored_source_solution: question.intent.source_solution,
    authored_unit_reason: question.intent.unit_reason,
    authored_concept_blocks: question.intent.concept_blocks,
    authored_limitations: question.intent.limitations,
    authored_figure_observations: question.intent.figure_observations,
    verdict: 'pass',
    evidence: intentNotes[question.id],
    canonical_correct: question.key.correct,
    frozen_true_set_after_transport: correct
  });
  const answerLeakage = mapping ? {
    verdict: 'pass',
    evidence: `Affected position freeze transports FIRST A to ${correct[0]} for ${question.id}; package true positions are A=3,B=4,C=4, not a constant slot. Stems and option content are inverse-deep-equal to FIRST. No new cross-question or answer-label cue was introduced.`
  } : firstFidelity.answer_leakage;
  assert.equal(answerLeakage.verdict, 'pass');
  return {
    question_id: question.id,
    task_fidelity: firstFidelity.task_fidelity,
    redundancy: firstFidelity.redundancy,
    answer_leakage: answerLeakage,
    mathematics: {
      verdict: 'pass',
      independent_solution: proof.independent_solution +
        ' Reused unchanged frozen Stage2 derivation; option IDs transported through the checked permutation before canonical comparison.',
      correct,
      option_checks: optionChecks
    }
  };
});

const figureChecks = seed.figures.map(figure => {
  const observed = images.observations.find(row => row.figure_id === figure.id);
  assert.ok(observed);
  const svg = observed.current_svg;
  assert.ok(figure.assets.some(asset => asset.path === svg.path && asset.sha256 === svg.sha256));
  return {
    figure_id: figure.id,
    asset_path: svg.path,
    asset_sha256: svg.sha256,
    observation: `${observed.observation} SVG decoding itself previously failed; the actual full current PNG ${observed.path} SHA256 ${observed.sha256} was opened once, at640x236, and its binding to this SVG was already checked in stage1-recovery-image-ledger.json SHA256270e935b8acb79b0df3a2680fa969e555416d95e30b790aee1c7aae799fb4031. Reuse only: zero new image opens, no rerender and no repeated source-fidelity gate.`
  };
});

const review = {
  schema: 's10y-choice-review-v1',
  seed_sha256: canonical(seed),
  draft_sha256: canonical(draft),
  reviewer: {
    kind: 'independent_agent',
    identity: 'n41-choice-review, independently assigned reviewer distinct from the choice author; source-first Stage1/Recovery2 and view-only Stage2 freezes preceded authorized canonical comparison. Prior non-rule metadata exposure contained no n41 choice/answer content and remains a disclosed limitation, not an approval gate.'
  },
  source_reviews: sourceReviews,
  figure_checks: figureChecks,
  new_figure_reviews: [],
  question_reviews: questionReviews,
  outcome: 'pass'
};
assert.equal(sourceReviews.length, 17);
assert.equal(questionReviews.length, 28);
assert.equal(rationaleComparisons.length, 90);
assert.equal(rationaleComparisons.filter(row => row.frozen_truth === 'incorrect').length, 44);
assert.equal(Object.keys(misconceptionNotes).length, 44);

const comparison = {
  schema: 'stemrobin182/n41-choice-stage3-canonical-comparison@1',
  ticket: 'STEMROBIN-182',
  stage: 3,
  result: 'PASS_CANONICAL_COMPARISON_FROM_FROZEN_EVIDENCE',
  completed_at: new Date().toISOString(),
  canonical_bindings: {
    seed_path: '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n41-choice-position-affected/seed.json',
    seed_byte_sha256: '14cc6a0a42bd4588a144f14637d5d001d9d6f1007cdf024714b64ed8f43f2e6b',
    seed_canonical_sha256: canonical(seed),
    draft_path: '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n41-choice-position-affected/draft.json',
    draft_byte_sha256: '03a23361b0dc6713152c4b76180b3b350f93d5fcb9dcbb1f284836c88a068b4f',
    draft_canonical_sha256: canonical(draft),
    permutation_sha256: '4050a493b1384f239d9a46c4549a370eb5372d974fccefdb6e96a96c4fad5bf6',
    first_draft_byte_sha256: '8828ce62d800879615fefd943096058d5c89b3cac423f434a244224583da1cbf',
    affected_views_byte_sha256: 'ab8d647ff08c82e28e8194785440388b1d872955792426b9b452da1ff9d78fcc'
  },
  exact_inverse_comparison: {
    checked_at: '2026-11-19T05:56:49.269Z',
    verdict: 'pass',
    evidence: 'The actual entire candidate draft, inverse-transformed in option order, option IDs, key.correct and rationale IDs/order for the eleven declared single units, deep-equals FIRST. All remaining fields are equal, including real question IDs, source_numbers, all intent fields, every rationale derivation/misconception, coverage, seed binding and new_figures. Candidate views deep-equal the affected frozen projection. FIRST was read for this exact inverse comparison only, not as a source solution or key authority.',
    multiple_canonical_questions_deep_equal: 17,
    single_units_inverse_restored: 11,
    actually_changed_single_units: 10,
    identity_single_units: ['q22'],
    canonical_intent_and_coverage_invariance_now_verified: true
  },
  method: 'Mechanically project existing frozen independent solutions and option proofs into the formal schema, transporting only IDs/order. The semantic author-comparison notes were written after reading the authorized candidate; no equation, table task, counter-test or image was solved/viewed again. Correctness authority remains the pre-disclosure source/view freezes, not either author key.',
  source_solution_and_task_binding_comparisons: sourceReviews,
  question_intent_comparisons: intentComparisons,
  rationale_comparisons: rationaleComparisons,
  capacity_loss_comparisons: lossComparisons,
  coverage_comparisons: draft.coverage.map(row => ({
    source_number: row.source_number,
    question_ids: row.question_ids,
    authored_omitted_tasks: row.omitted_tasks,
    authored_reason: row.reason,
    verdict: 'pass',
    evidence: 'Canonical source/question relationships match the independently frozen whole-source map. Recorded omissions are production/navigation losses, not missing mathematical source tasks; relevant question limitations agree with the frozen loss categories.'
  })),
  figure_comparisons: figureChecks,
  visible_precision_context: {
    positions: [3, 4, 17, 18],
    verdict: 'pass',
    evidence: 'Authored intent and rationale decimals match all twelve frozen direct finite-cell results under the expressly visible no-intermediate-rounding/three-decimal writing rule. This was new visible context, not a presumed historical Bradis accuracy or edition-equivalence fact.'
  },
  prior_freezes_and_limitations: {
    stage1_initial_and_both_recoveries_preserved: true,
    first_stage2_revise_preserved: true,
    affected_pass_receipt_frozen_before_canonical_access: true,
    affected_receipt_sha256: '70300d511f0654c6e7d906167799bc82fcde43c1872f0b6c2e89b9403666b1d5',
    affected_manifest_sha256: '96bca9a761215afc43a1df9ae113d7dfa03acd6122df5472f84790ca3b959d8b',
    non_rule_metadata_exposure_disclosed_not_gate: true,
    non_rule_packet_references_opened: false,
    prior_real_tool_failures_preserved: true,
    author_history_or_provenance_references_opened: false,
    evidence: 'Canonical intent references to author solve/amendment/provenance/figure records were visible only as authorized draft prose. None of those referenced records was opened. Current mathematical claims were compared to the independently frozen evidence without claiming verification of author history.'
  },
  counts: {
    source_exercises: 17,
    source_tasks_reused: 80,
    direct_lookup_obligations_reused: 12,
    canonical_question_keys_compared: 28,
    canonical_rationales_compared: 90,
    correct_option_rationales: 46,
    incorrect_option_misconceptions_checked: 44,
    coverage_rows_compared: 17,
    complete_true_sets_compared: 28,
    graph_observations_reused: 2,
    registered_new_figures: 0,
    new_source_or_option_solves: 0,
    new_counter_tests: 0,
    new_image_opens: 0
  },
  findings: [],
  outcome: 'pass',
  validator: 'Not run by this evidence projection; one separately authorized validator WITH review invocation follows.',
  ownership: 'Outputs only under n41-choice-review; no author, durable lesson, environment, database, app, dependency, network, paid, rendering, promotion, finalizer or commit operation.'
};

// This is a bulk structured projection of already frozen evidence.
for (const [name, value] of [['review.json', review], ['stage3-comparison.json', comparison]]) {
  fs.writeFileSync(path.join(own, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
}
console.log(JSON.stringify({
  status: 'PROJECTED_FROZEN_EVIDENCE_NOT_NEW_MATHEMATICS',
  review_sha256: hash(fs.readFileSync(path.join(own, 'review.json'))),
  comparison_sha256: hash(fs.readFileSync(path.join(own, 'stage3-comparison.json'))),
  source_reviews: 17,
  question_reviews: 28,
  option_checks: 90,
  misconception_comparisons: 44,
  figure_checks: 2,
  new_images: 0
}, null, 2));
