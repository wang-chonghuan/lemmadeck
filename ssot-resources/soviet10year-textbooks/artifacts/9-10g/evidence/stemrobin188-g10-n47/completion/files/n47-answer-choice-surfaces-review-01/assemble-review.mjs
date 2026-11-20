import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n47-answer-choice-surfaces-review-01');
const inputRoot = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n47-answer-choice-surfaces-review-inputs-01');
assert.equal(process.cwd(), cwd);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const local = name => read(path.join(root, name));
const save = (name, value) => fs.writeFileSync(path.join(root, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const binding = p => ({ path: p, sha256: sha(fs.readFileSync(p)) });
const canonical = value => {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => canonical(k) + ':' + canonical(value[k])).join(',') + '}';
  return JSON.stringify(value).replace(/[\u0080-\uffff]/g, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
};
const digest = value => sha(Buffer.from(canonical(value), 'utf8'));
const manifest = read(path.join(inputRoot, 'manifest.json'));
const phase1 = local('source-solutions-FIRST.json');
const phase2 = local('visible-FIRST.json');
const phase3 = local('phase3-comparison.json');
const answer = local('answer-review.json');
for (const phase of [1, 2]) {
  const sealed = local(`phase${phase}-seal.json`);
  assert.equal(sha(fs.readFileSync(sealed.artifact.path)), sealed.artifact.sha256);
}
assert.deepEqual(answer.candidate, manifest.keyLast.answerCandidate);

if (process.argv[2] === 'reviews') {
  const sourceOnly = read(manifest.sourceOnly.path);
  const visible = read(manifest.visibleQuestions.path);
  const draft = read(manifest.keyLast.draft.path);
  const candidate = read(manifest.keyLast.answerCandidate.path);
  assert.equal(sha(fs.readFileSync(manifest.keyLast.draft.path)), manifest.keyLast.draft.sha256);
  assert.equal(sha(fs.readFileSync(manifest.keyLast.answerCandidate.path)), manifest.keyLast.answerCandidate.sha256);
  assert.deepEqual(draft.questions.map(q => ({ id: q.id, view: q.view })), visible.questions);
  assert.equal(digest(sourceOnly.seed), draft.seed_sha256);
  assert.equal(draft.questions.length, 7);
  assert.equal(draft.questions.reduce((n, q) => n + q.view.options.length, 0), 24);
  assert.deepEqual(draft.new_figures, []);
  assert.deepEqual(candidate.answers.map(a => a.exercise), ['49', '50', '51', '52', '53', '54']);
  const questionReviews = phase2.question_reviews.map(q => {
    const author = draft.questions.find(a => a.id === q.question_id);
    const comparison = phase3.question_comparisons.find(a => a.question_id === q.question_id);
    assert.deepEqual(q.mathematics.correct, author.key.correct);
    assert.deepEqual(q.mathematics.correct, comparison.independent_correct);
    const result = structuredClone(q);
    result.mathematics.option_checks.forEach(option => {
      const rationale = author.key.rationales.find(r => r.option_id === option.option_id);
      const checked = comparison.option_checks.find(r => r.option_id === option.option_id);
      assert.equal(option.truth, rationale.truth);
      assert.equal(option.truth, checked.truth);
      option.evidence += ' Key-last derivation comparison: ' + checked.evidence;
    });
    result.mathematics.independent_solution = result.mathematics.independent_solution.replaceAll('CDEF', 'DCEF');
    result.mathematics.independent_solution += ' Key-last comparison: ' + comparison.solution_evidence;
    result.mathematics.verdict = comparison.verdict;
    return result;
  });
  const usedFigure = sourceOnly.seed.figures[0];
  assert.equal(usedFigure.id, 'fig-g10-22');
  const asset = usedFigure.assets[0];
  assert.equal(sha(fs.readFileSync(path.join(cwd, asset.path))), asset.sha256);
  const review = {
    schema: 's10y-choice-review-v1',
    seed_sha256: digest(sourceOnly.seed),
    draft_sha256: digest(draft),
    reviewer: phase1.reviewer,
    source_reviews: phase1.exercises.map(e => ({
      source_number: e.exercise,
      independent_solution: e.independent_solution.replaceAll('CDEF', 'DCEF'),
      coverage: {
        verdict: phase3.source_coverage.find(c => c.source_number === e.exercise).verdict,
        evidence: phase3.source_coverage.find(c => c.source_number === e.exercise).evidence
      }
    })),
    figure_checks: [{
      figure_id: usedFigure.id,
      asset_path: asset.path,
      asset_sha256: asset.sha256,
      observation: 'Seed final SVG is bound by its actual hash above; the observed pixels were the manifest-bound original PNG f65761d78aa1c3a878d39dcff144f9622e271d5cb599e2086f84efbcc7df2564 and its current 480px PNG rendition 904bf47db34c3970eb664f88c968dedc77610dd5c8f212c2fc1c4fafe8fa51b3, each opened once in phase1. No separate SVG image reopen is claimed. Actual current PNG path: ' + phase1.figure_observations[1].asset_path + '. ' + phase1.figure_observations.map(f => f.observation.replaceAll('CDEF', 'DCEF')).join(' ') + ' Correct opposite trapezoid boundary order is D-C-E-F-D (or C-D-F-E-C), not the draft internal C-D-E-F order. The four full-page screenshots independently display all endpoints and labels at desktop/mobile sizes, including rightmost B and bottom A/D. No new figure or repeated seven-figure fidelity approval.'
    }],
    new_figure_reviews: [],
    question_reviews: questionReviews,
    outcome: 'revise'
  };
  save('review.json', review);
  save('visual-review.json', {
    status: 'pass',
    lesson: manifest.lesson,
    reviewer: phase1.reviewer,
    scope: 'FIRST independent review of four manifest-bound actual offline text/exercise screenshots; not whole33-object or seven-figure mathematical/fidelity review.',
    screenshots: phase2.screenshots,
    image_ledger: binding(path.join(root, 'image-ledger.json')),
    image_loads: 6,
    crops: 0,
    reopens: 0,
    full_content_and_bottom_endpoints_observed: true,
    inherited_holds_unchanged: phase1.inherited_holds_unchanged,
    font_pixels_measured_by_reviewer: false,
    browser_or_renderer_run_by_reviewer: false,
    gui_interaction_or_product_publication_claimed: false,
    findings: []
  });
  const receiptPath = manifest.bindings.find(b => b.path.endsWith('/n47-answer-author/evidence/exact-receipt.json')).path;
  const mathPath = manifest.bindings.find(b => b.path.endsWith('/n47-answer-author/evidence/mathlive-exact.json')).path;
  const receipt = read(receiptPath);
  const exact = read(mathPath);
  const expected = candidate.answers.flatMap(a => a.parts.filter(p => p.judge === 'exact').flatMap(p => p.expected.map(value => ({ name: `${candidate.lesson}/${a.exercise}/${p.label}`, value }))));
  assert.equal(expected.length, 10);
  assert.equal(receipt.candidateSha256, answer.candidate.sha256);
  assert.equal(receipt.exitCode, 0);
  assert.equal(exact.results.length, 10);
  for (const item of expected) {
    const result = exact.results.find(r => r.name === item.name && r.input === item.value);
    assert.ok(result && result.inserted && result.preserved && result.accepted && result.inputEvents > 0);
    assert.equal(result.emitted, item.value);
    assert.equal(result.attempts, 1);
  }
  const theta = Math.atan(Math.sqrt(3) / 4) * 180 / Math.PI;
  const cosTheta = Math.acos(4 / Math.sqrt(19)) * 180 / Math.PI;
  const perUnitArea = 1 + 3 * Math.sqrt(3) / 16 + 3 * Math.sqrt(19) / 16 + 1 / 4 + 1 / 4;
  assert.ok(Math.abs(theta - cosTheta) < 1e-12);
  assert.ok(Math.abs(perUnitArea - 3 * (8 + Math.sqrt(3) + Math.sqrt(19)) / 16) < 1e-12);
  save('assembly-receipt.json', {
    status: 'pass',
    scope: 'Offline evidence assembly and local consistency checks only; not native finalize, with-review validator or semantic re-review.',
    seed_canonical_sha256: review.seed_sha256,
    draft_canonical_sha256: review.draft_sha256,
    draft_bytes_sha256: manifest.keyLast.draft.sha256,
    exact_evidence: [binding(receiptPath), binding(mathPath)],
    exact_receipt_matches_candidate: true,
    exact_alternatives_checked: expected.length,
    complete_keys_and_all_option_truths_agree: true,
    option_count: 24,
    theta_degrees: theta,
    equivalent_arccos_degrees: cosTheta,
    unit_a_surface_area: perUnitArea,
    numeric_evaluation_scope: 'Elementary mathematical check only, not execution of the product numeric/expression grader.',
    seals_intact: true
  });
  console.log(JSON.stringify({ choice: review.outcome, answer: answer.status, visual: 'pass', draft_canonical_sha256: review.draft_sha256, theta_degrees: theta }, null, 2));
} else if (process.argv[2] === 'report') {
  const before = local('bindings-before.json');
  const after = local('bindings-after.json');
  assert.equal(before.status, 'pass');
  assert.equal(after.status, 'pass');
  assert.equal(after.binding_count, 107);
  assert.equal(after.changed_since_before.length, 0);
  const outputNames = ['review.json', 'answer-review.json', 'visual-review.json', 'source-solutions-FIRST.json', 'visible-FIRST.json', 'phase1-seal.json', 'phase2-seal.json', 'phase3-comparison.json', 'image-ledger.json', 'bindings-before.json', 'bindings-after.json', 'assembly-receipt.json'];
  const report = {
    status: 'revise',
    ticket: 'STEMROBIN-188',
    assignment: 'SAME188-6',
    lesson: manifest.lesson,
    review_type: 'FIRST independent ANSWER/CHOICE/SURFACES review ONLY',
    reviewer: phase1.reviewer,
    findings: phase3.findings,
    decisions: {
      choice: 'revise',
      answer: 'pass',
      visual: 'pass',
      all_complete_choice_keys_and_24_truths_agree: true,
      new_figures: 0,
      actual52_drawing_completed: false,
      learner_proof_certified: false,
      whole_lesson_approved: false,
      inherited_holds_resolved: false
    },
    source_results: [
      { exercise: '49', result: 'tetrahedron; minimum4 faces;6 edges;4 vertices;0 polyhedron diagonals' },
      { exercise: '50', result: 'quadrilateral face possible; pentagonal face impossible in five-faced convex solid' },
      { exercise: '51', result: 'minimum12 edges, attained by hexagonal pyramid' },
      { exercise: '52', result: 'eight: quadrilateral pyramid; nine: triangular prism or triangular bipyramid; recognition does not complete drawings' },
      { exercise: '53', result: 'intersection claim true; union claim false by L-prism counterexample' },
      { exercise: '54', result: 'a>0;60 degrees;arctan(sqrt(3)/4);net area3a^2(8+sqrt(3)+sqrt(19))/16 in squared units' }
    ],
    choice_true_sets_in_order: phase2.question_reviews.map(q => ({ question: q.question_id, correct: q.mathematics.correct })),
    phase_order: [
      { phase: 1, sealed: binding(path.join(root, 'source-solutions-FIRST.json')), keys_read: false, image_loads: 2 },
      { phase: 2, sealed: binding(path.join(root, 'visible-FIRST.json')), keys_read: false, options_solved: 24, image_loads: 6 },
      { phase: 3, comparison: binding(path.join(root, 'phase3-comparison.json')), draft_and_candidate_read_after_both_seals: true }
    ],
    notation_disclosure: phase3.sealed_notation_disclosure,
    bindings: {
      manifest: after.manifest,
      before: binding(path.join(root, 'bindings-before.json')),
      after: binding(path.join(root, 'bindings-after.json')),
      count: 107,
      mismatches_before: 0,
      mismatches_after: 0,
      changed: 0
    },
    images: { total_loads: 6, batch_limit: 8, context_limit: 24, crops: 0, reopens: 0, new_image_payloads_forwarded: 0 },
    scope_and_holds: {
      glyph49_meaning: 'unresolved and not inferred',
      all_ink_hold: 'unchanged',
      prior_whole33_objects_and_seven_figure_pass: 'not repeated',
      construction_and_proof_capacity: 'limitations explicit;52 ungraded;proofs not auto certified',
      gui_claim: 'actual supplied offline screenshots observed;no interactive product or publication claimed',
      author_candidates_and_failed_outputs: 'left untouched;all107 bindings identical before/after',
      native_finalize: 'not run;parent handles',
      with_review_validator: 'not run;parent handles',
      retention: 'not performed;parent handles',
      web_db_credentials_dependencies_model_service_git: 'no calls',
      supervisor_peer_messages: 'none'
    },
    outputs: outputNames.map(name => binding(path.join(root, name))),
    collection_state: 'Review artifacts ready for collection; stop. No candidate repair, native finalization, retention or publication authorized here.'
  };
  save('report.json', report);
  const md = [
    '# N47 FIRST Independent ANSWER / CHOICE / SURFACES Review',
    '',
    '**Overall: REVISE.** Answer review: PASS. Four screenshot surfaces: PASS. All seven complete keys and all 24 option truth values agree with the sealed independent solutions.',
    '',
    '## Finding',
    '',
    'N47-CHOICE-54-CYCLIC-FACE: the choice draft names the opposite trapezoidal boundary face `CDEF` in `questions[6].intent.source_solution` (line206) and its figure observation (line213). Observed edges give the cycle D-C-E-F-D, equivalently C-D-F-E-C; DE and FC are not boundary edges. Use `DCEF` or `CDFE` in those internal records. The coordinates, angle results, five face-area contributions, visible options and key D are correct. No candidate was edited.',
    '',
    'The sealed independent records also used CDEF as an informal vertex list. Those FIRST artifacts remain unchanged; the final review explicitly corrects the cyclic notation without changing any independently derived result or true set.',
    '',
    '## Evidence',
    '',
    'Phase1 sealed source solutions before visible questions or keys. Phase2 sealed fidelity/redundancy/leakage judgments and complete true sets for all24 options before the internal draft/candidate was read. Complete true sets: B; A; C; A; A/B; A; D.',
    '',
    'Source54: a>0; AF inclination60 degrees; plane angle arctan(sqrt(3)/4), approximately23.413224 degrees; total net area3a^2(8+sqrt(3)+sqrt(19))/16. The correct cyclic trapezoid DCEF and both triangular end faces are included in the answer candidate.',
    '',
    'Exactly six image loads: original/current Figure22 PNGs and four full-page desktop/mobile text/exercise screenshots. No crops/reopens. All screenshot content, rightmost/bottommost objects and end navigation were observed; no clipping or overlaps found. No new browser or renderer ran.',
    '',
    'Answer candidate: all six answers independently verified, with twelve auto result parts and source52 ungraded. The existing exact receipt binds the requested candidate hash and records all ten exact alternatives passing keyboard insertion/restoration in one attempt each. Reading that frozen evidence was not a native finalize rerun.',
    '',
    'All107 bindings and the manifest match before/after; no candidate, failed output, core, Charter, Git or database changes. The source49 glyph and all-ink holds remain unchanged. No actual52 drawing or learner proof certification is claimed.',
    '',
    '## Collection',
    '',
    'Artifacts are confined to ' + root + '. Exact absolute paths and SHA-256 values appear in report.json and output-index.json; the index excludes itself.',
    '',
    'Parent handles native finalize, with-review validator and retention. No whole-lesson approval, GUI interaction, product publication or supervisor/peer message is claimed. Stop for collection/closure.'
  ].join('\n') + '\n';
  fs.writeFileSync(path.join(root, 'report.md'), md, { flag: 'wx' });
  console.log(JSON.stringify({ status: report.status, bindings: report.bindings.count, unchanged: true, report: binding(path.join(root, 'report.json')) }, null, 2));
} else {
  throw new Error('Use reviews or report');
}
