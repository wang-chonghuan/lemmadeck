import { choice, answer, read, write, binding, now, seal } from '../n44-choice-review/audit-lib.mjs';

const first = read(`${choice}/FIRST-source.json`);
const candidate = read(`${answer}/candidate.raw.json`);
const receipt = read(`${answer}/candidate-read-receipt.json`);
const srcDir = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n44';
const exercises = read(`${choice}/source-projection.json`).exercises;
const displayEvidence = {
  '16': 'FIRST construction paths agree for all five points: 2i+3j+k; i-j+2k; -3i+j/2-k; 2j-3k; -3k/2. E in Oyz, G negative Oz. Actual drawing correctly ungraded.',
  '17': 'FIRST Q-P gives complete triples (-3,5,-3),(-11/10,4/3,-1/6). Both original subtasks retained.',
  '18': 'FIRST B=(0,-3,1) on x=0, norm sqrt(10), positive coordinate length.',
  '19': 'FIRST t in R, t^2+2t+6=t^2-2t+10, unique t=1; full M=(0,1,0), equal squared distances 9.',
  '20': 'FIRST medians sqrt(62)/2,sqrt(53)/2; T=(10/3,-1/3,3), OT=sqrt(182)/3. Three internal angle cosines 14/15,11/(5sqrt(6)),-5/(3sqrt(6)), finite and C obtuse. Added AB cross AC=(-2,4,-3) is arithmetically correct and confirms nondegeneracy.',
  '21': 'FIRST three opposite-known pairs have fourth points (0,-6,0),(2,0,0),(-6,8,2), with paired squared diagonal lengths (33,105),(59,27),(10,174). All source-compatible cases retained; ungraded avoids unordered-set lexical grading.',
  '22': 'FIRST AB=DC, AD=BC, nonzero cross (-23,5,-8), common midpoint (0,2,1/2); AC/BD dot 63, squared norms 113,57. Labelled AXB,CXD acute and BXC,DXA supplement correct. Conditional smaller-line-angle convention explicit; no source proof omitted. Whole proof task correctly ungraded.',
};
const partEvidence = {
  '17': [
    'FIRST part 1: Q-P=(-3,5,-3); ordered signed tuple, no unit.',
    'FIRST part 2: (-3/5-1/2,4/3,2/3-5/6)=(-11/10,4/3,-1/6); full ordered fractional tuple.',
  ],
  '18': ['FIRST positive norm sqrt(10), not squared length 10; coordinate-length unit.'],
  '19': ['FIRST unique M=(0,1,0); label requires full tuple, expected includes x,z zeros.'],
  '20': [
    'FIRST AA1 squared=62/4; positive length sqrt(62)/2.',
    'FIRST BB1 squared=53/4; positive length sqrt(53)/2.',
    'FIRST OT squared=182/9; positive length sqrt(182)/3.',
    'FIRST A=21.039469781317237 degrees; formula arccos(14/15) times 180/pi is that degree value. |14/15|<1; tolerance 0.01 degrees consistent.',
    'FIRST B=26.084541552047035 degrees; arccos(11/(5sqrt(6))) times 180/pi; cosine square 121/150<1; tolerance 0.01 degrees consistent.',
    'FIRST C=132.87598866663575 degrees; negative cosine -5/(3sqrt(6)), square 25/54<1. Multiplication 180/pi preserves obtuse internal angle, tolerance 0.01 degrees consistent.',
  ],
};
const perExercise = candidate.answers.map(a => {
  const source = exercises.find(e => e.number === a.exercise);
  const identity = source && a.prompt === source.text && a.sourceNumber === source.source_number && a.groupId === source.group_id;
  if (!identity) throw new Error(`Source identity mismatch ${a.exercise}`);
  return {
    exercise: a.exercise, source_number: a.sourceNumber, group_id: a.groupId,
    source_identity: { verdict: 'PASS', evidence: 'Current permitted written prompt, number/source number and g1 match exactly; mathematical identity independently checked through FIRST.', inherited_source_surface_pass_not_rerun: true },
    display_answer: { verdict: 'PASS', evidence: displayEvidence[a.exercise] },
    original_subtasks_finite_cases_domain_angles: { verdict: 'PASS', evidence: displayEvidence[a.exercise], independent_first_solution: first.sources.find(s => s.source_number === a.exercise) },
    grading: { declared: a.grading, semantic_verdict: 'PASS', evidence: a.grading === 'auto' ? 'Fixed ordered tuple or finite real numerical quantities, all requested quantities present; actual product parser/editor verification pending parent.' : 'Construction/proof or unordered associated case-set cannot be reliably auto-judged by these fixed lexical/numeric parts; concrete complete displayAnswer remains present.' },
    source: { declared: a.source, verdict: 'PASS', evidence: 'derived; no bookRaw; book answers path absent, no old answers consulted.' },
    verdict: 'PASS',
    parts: a.parts.map((p, index) => ({
      part_index: index + 1, label: p.label, judge: p.judge, expected: p.expected,
      unit: p.unit ?? null, tolerance: p.tolerance ?? null,
      semantic_verdict: 'PASS', evidence: partEvidence[a.exercise][index],
      clear_label_unit: 'PASS',
      expected_scope: p.judge === 'exact' ? 'Full ordered coordinate triple, not a single component; mathematical correctness checked against FIRST.' : 'One labelled requested real quantity; positive length or explicitly degree-valued internal angle.',
      runtime_gate: p.judge === 'exact' ? 'PENDING_PARENT_REAL_MATHLIVE_EDIT_AND_FINALIZE' : 'PENDING_PARENT_COMPUTE_ENGINE_FINALIZE',
      actual_MathLive_attempts: 0, editor_or_runtime_pass_claimed: false,
    })),
  };
});
const allParts = perExercise.flatMap(e => e.parts);
const counts = {
  exercises: perExercise.length, auto: candidate.answers.filter(a => a.grading === 'auto').length,
  ungraded: candidate.answers.filter(a => a.grading === 'ungraded').length,
  expected_parts: allParts.length, exact: allParts.filter(p => p.judge === 'exact').length,
  numeric: allParts.filter(p => p.judge === 'numeric').length,
};
if (JSON.stringify(counts) !== JSON.stringify({ exercises: 7, auto: 4, ungraded: 3, expected_parts: 10, exact: 3, numeric: 7 })) throw new Error('Unexpected answer counts');
write(`${answer}/answer-review.json`, {
  schema: 'same188-6/n44-standard-answer-semantic-review@1',
  completed_at: now(), reviewer: { kind: 'independent_agent', identity: 'SAME188-6 independent reviewer, STEMROBIN-188' },
  outcome: 'PASS', semantic_outcome: 'PASS', gate_2_completion: 'PENDING_PARENT_EXACT_EDIT_AND_FINALIZE',
  candidate: receipt.candidate, requested_sha256: receipt.expected_sha256,
  raw_candidate: receipt.retained_raw_candidate,
  input_bindings: {
    candidate_read_receipt: binding(`${answer}/candidate-read-receipt.json`),
    FIRST_source_md: binding(`${choice}/FIRST-source.md`), FIRST_source_json: binding(`${choice}/FIRST-source.json`),
    FIRST_seal: binding(`${choice}/FIRST-source.seal.json`),
    source_projection: binding(`${choice}/source-projection.json`),
    current_lesson: binding(`${srcDir}/lesson.json`), current_exercises: binding(`${srcDir}/exercises.json`), current_figures_manifest: binding(`${srcDir}/figures.json`),
    image_ledger: binding(`${choice}/image-ledger.json`), source_svg_preview_bindings: binding(`${choice}/preview-bindings.json`),
    prior_choice_review: binding(`${choice}/review.json`), prior_choice_seal: binding(`${choice}/review.seal.json`),
  },
  source_identity_and_incompleteness: {
    verdict: 'PASS', book: candidate.book, edition: candidate.edition, lesson: candidate.lesson,
    exercises: ['16', '17', '18', '19', '20', '21', '22'], all_source_derived: true,
    no_omitted_original_subtask_or_source_compatible_finite_case: true,
    book_answers: receipt.book_answers,
    proof_and_angle_convention: 'Exercise22 gives all four labelled cross-diagonal intersection sectors and conditional smaller-line-angle convention; it does not make the choice question unrestricted four-ray claim.',
  },
  counts, per_exercise: perExercise, findings: [],
  parent_pending_gates: ['Actual MathLive keyboard editing, input/delete events and reserialization for all 3 exact parts; 0 attempts by reviewer.', 'Product parser/judging and lesson_answers finalize; no expected-to-itself string comparison can substitute.', 'Repair/review choice CHOICE-01 separately; this answer semantic PASS does not waive it.'],
  source_authors_figures_text_surface_gates: 'Inherited, not rerun or repaired. Candidate note of figure8 author inspection is not a reviewer image-open claim.',
  repairs: { used: 0, allowance_per_affected_unit: 1, affected_answer_units: [] },
  independent_solve_count: { per_source: 1, after_candidate_read: 0 },
  MathLive_gate: { status: 'NOT_RUN_PENDING_PARENT', semantic_PASS_claimed_for_MathLive: false, attempts: 0 },
  forbidden_actions_run: false,
});
seal('answer-review', [`${answer}/answer-review.json`, `${answer}/answer-review.md`, `${answer}/candidate-read-receipt.json`, `${answer}/candidate.raw.json`], {
  outcome: 'semantic_PASS', pending: 'Parent exact real editing and finalize; choice CHOICE-01 remains REVISE.',
  counts, reports_owned_by: answer, repairs_used: 0,
}, answer);
