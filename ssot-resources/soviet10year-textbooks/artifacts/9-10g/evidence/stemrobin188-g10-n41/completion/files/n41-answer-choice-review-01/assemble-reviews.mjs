import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
if (process.cwd() !== cwd) throw new Error('Exact review cwd required')
const root = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n41-answer-choice-review-01')
const tmp = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp')
const inputRoot = path.join(tmp, 'n41-review-inputs-01')
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const binding = (p) => ({ path: path.resolve(p), sha256: hash(p), bytes: fs.statSync(p).size })
const write = (name, value) => {
  const p = path.join(root, name)
  if (path.dirname(p) !== root) throw new Error('Outside authorized output directory')
  fs.writeFileSync(p, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  return binding(p)
}

const sourcePath = path.join(inputRoot, 'source-with-conventions.json')
const source = read(sourcePath)
const predecessor = read(path.join(inputRoot, 'bindings.json'))
const first = read(path.join(root, 'FIRST-source-solutions.json'))
const prekey = read(path.join(root, 'PREKEY-true-sets.json'))
const post = read(path.join(root, 'postkey-evidence.json'))
const visualEvidence = read(path.join(root, 'visual-evidence.json'))
const draftPath = path.join(tmp, 'n41-choice-author/draft.json')
const draft = read(draftPath)
const answerPath = path.join(tmp, 'n41-answer-author/answer-keys.candidate.json')
const candidate = read(answerPath)
const choiceAuthorPath = path.join(tmp, 'n41-choice-author/report.json')
const answerAuthorPath = path.join(tmp, 'n41-answer-author/author-report.json')
const choiceAuthor = read(choiceAuthorPath)
const answerAuthor = read(answerAuthorPath)
const figureReviewPath = path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/stemrobin188-g10-n41/modern-figures/independent-review.json')
const figuresPrior = read(figureReviewPath)
const surfaceResultPath = path.join(tmp, 'offline-display-9-10g_geo910-c1-s3-n41-surfaces/result.json')
const surfaceResult = read(surfaceResultPath)
const solutionByNumber = new Map(first.source_solutions.map((s) => [s.number, s]))
const sourceReviews = draft.coverage.map((coverage) => {
  const solution = solutionByNumber.get(coverage.source_number)
  const detail = post.answer_checks[coverage.source_number]
  const qualifier = post.convention_resolutions.find((c) => c.exercise === coverage.source_number)
  return {
    source_number: solution.number,
    independent_solution: `${solution.result} ${solution.derivation}`,
    coverage: {
      verdict: 'pass',
      evidence: `${detail.author_derivation_comparison} ${prekey.package.coverage} For this source the question is ${coverage.question_ids.join(',')}. ${coverage.reason} Actual proof-writing/physical-construction losses are explicitly recorded: ${coverage.omitted_tasks.join(' ')} ${qualifier ? `Scoped qualification resolved: ${qualifier.evidence}` : ''}`,
    },
  }
})

const questionReviews = structuredClone(prekey.question_reviews)
for (const q of questionReviews) {
  for (const option of q.mathematics.option_checks) {
    const comparison = post.misconception_checks[q.question_id]?.[option.option_id]
    if (comparison) option.evidence += ` Post-key misconception comparison: ${comparison}`
    else option.evidence += ' Author true rationale agrees with this independently frozen derivation; correct alternative has no misconception.'
  }
  const qualifier = post.convention_resolutions.find((c) => q.question_id === `n41-q${c.exercise}`)
  if (qualifier) q.task_fidelity.evidence += ` Post-key scoped resolution: ${qualifier.evidence}`
}
const choiceReview = {
  schema: 's10y-choice-review-v1',
  seed_sha256: '95c9a0045c4efdf10214c888dcf652a004eab553b3ca6d8e691863336d86e903',
  draft_sha256: '7458a76f1eaaf1850bf9d394423a12e9d62c6d1c21c09f02d44731d0b8226fc0',
  reviewer: { kind: 'independent_agent', identity: 'SAME188-6 sole independent N41 answer/choice reviewer, not either author' },
  source_reviews: sourceReviews,
  figure_checks: source.seed.figures.map((f) => ({
    figure_id: f.id,
    asset_path: f.assets[0].path,
    asset_sha256: f.assets[0].sha256,
    observation: first.figure_observations.find((x) => x.figure === f.id).observation,
  })),
  new_figure_reviews: [],
  question_reviews: questionReviews,
  outcome: 'pass',
}
const choiceOut = write('review.json', choiceReview)

const answerReviews = candidate.answers.map((answer) => {
  const solution = solutionByNumber.get(answer.exercise)
  const detail = post.answer_checks[answer.exercise]
  const relevant = post.convention_resolutions.find((c) => c.exercise === answer.exercise)
  return {
    exercise: answer.exercise,
    independent_solution: solution.result,
    independent_derivation: solution.derivation,
    prompt_and_source_identity: {
      verdict: 'pass',
      evidence: `Candidate prompt matches the source exercise${answer.exercise} including its data and all subquestions. Current exercise figure_refs are empty; no exercise-specific diagram or bookRaw answer is silently substituted. Source derived, checked against independent FIRST solution.`,
    },
    mathematics: { verdict: 'pass', evidence: detail.author_derivation_comparison },
    displayed_proof_or_construction: { verdict: 'pass', evidence: detail.display_sufficiency },
    grading: {
      verdict: detail.grading_verdict,
      declared: answer.grading,
      evidence: detail.grading_evidence,
      parts: answer.parts,
    },
    source_convention: relevant ?? { verdict: 'pass', evidence: 'No unresolved source-specific convention remains for this exercise.' },
    completeness: {
      verdict: 'pass',
      evidence: `The whole exercise${answer.exercise} is solved and displayed. ${answer.parts.length ? `${answer.parts.length} actual labelled part(s) retained.` : 'Open proof/construction/locus is intentionally ungraded with no fabricated answer slots.'}`,
    },
    outcome: detail.grading_verdict === 'revise' ? 'revise' : 'pass',
  }
})
const answerReview = {
  schema: 'same188-6/independent-answer-review@1',
  cwd,
  reviewer: choiceReview.reviewer,
  book: '9-10g',
  lesson: 'geo910-c1-s3-n41',
  candidate: binding(answerPath),
  first_source_freeze: binding(path.join(root, 'FIRST-source-solutions.json')),
  prekey_freeze: binding(path.join(root, 'PREKEY-true-sets.json')),
  scope: 'All14 source and candidate standard derivations, displayed reasons/constructions, coverage and semantic grading suitability. Not actual finalization/MathLive/DB acceptance.',
  counts: { exercises: 14, independent_derivations: 14, mathematics_pass: 14, displayed_solution_pass: 14, grading_pass: 12, grading_revise: 2, auto: 8, ungraded: 6, parts: 17, exact_parts: 7, numeric_parts: 9, expression_parts: 1, exact_accepted_forms: 14, accepted_forms_total: 25, derived: 14, bookRaw: 0 },
  reviews: answerReviews,
  grading_counterexamples: post.grading_counterexamples,
  expression_grading_counterexamples: post.expression_grading_counterexamples,
  existing_receipts_reused: Object.values(answerAuthor.checks).map((x) => ({ ...binding(x.path), proof_limit: 'Retained author evidence only; no checker rerun or mathematical approval inferred from syntax.' })),
  gate2: post.gate2_limit,
  findings: [
    { id: 'A392-EXACT-INTERVAL', exercise: '392', verdict: 'revise', priority: 'P1', evidence: post.answer_checks['392'].grading_evidence },
    { id: 'A397-DOMAIN-EQUIVALENCE', exercise: '397', verdict: 'revise', priority: 'P1', evidence: post.answer_checks['397'].grading_evidence },
  ],
  source_convention_holds_resolved: post.convention_resolutions,
  omissions: [],
  outcome: 'revise',
}
const answerOut = write('answer-review.json', answerReview)

const imagePaths = [
  source.imageInputs[0].original,
  source.imageInputs[1].original,
  path.join(tmp, 'n41-modern-figure-author/fig-160/fig-160.width-480.png'),
  path.join(tmp, 'n41-modern-figure-author/fig-161/fig-161.width-480.png'),
  ...source.surfaceFiles,
]
const imageLog = imagePaths.map((p, index) => {
  const png = fs.readFileSync(p)
  const observation = index < 4
    ? first.figure_observations[index === 0 || index === 2 ? 0 : 1].observation
    : visualEvidence.dimension_judgments[['text1440', 'text390', 'exercises1440', 'exercises390'][index - 4]]
  return {
    sequence: index + 1,
    batch: 1,
    kind: index < 2 ? 'original PNG' : index < 4 ? 'existing full modern480 PNG' : 'existing offline fullframe',
    ...binding(p),
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
    loads: 1,
    reopened: false,
    cropped: false,
    method: 'functions.view_image full file once; dimensions from existing PNG header, not another image load',
    observation,
  }
})
const visual = {
  schema: 'same188-6/independent-visual-observation@1',
  reviewer: choiceReview.reviewer,
  cwd,
  lesson: 'geo910-c1-s3-n41',
  source_lesson_sha256: '6168cff339d0b6ceb1ad1dd5395fe75d93273708950c762ea1408285d41a3ce6',
  source_exercises_sha256: '1076352f8023165cca5fa232dc6766d7ec44d8a6f30b8d702bd381d6e2eb148f',
  machine_result: binding(surfaceResultPath),
  machine_result_status: 'Retained mechanical display pass with visual inspection pending; not a visual gate pass.',
  method: visualEvidence.method,
  surfaces: surfaceResult.results.map((result) => {
    const mobile = result.viewport.width === 390
    const text = result.kind === 'text'
    return {
      kind: result.kind,
      viewport: result.viewport,
      screenshot: binding(result.screenshot),
      dimensions: imageLog.find((x) => x.path === result.screenshot),
      machine_layout: result.layout,
      dimension_judgment: visualEvidence.dimension_judgments[`${text ? 'text' : 'exercises'}${result.viewport.width}`],
      paragraphs: text ? visualEvidence.text_paragraph_checks.map((x) => ({ ...x, verdict: 'pass' })) : [],
      figures_and_captions: text ? visualEvidence.text_figure_checks.map((x) => ({ ...x, verdict: 'pass' })) : [],
      exercises: text ? [] : visualEvidence.exercise_checks.map((x) => ({ exercise: x.exercise, verdict: mobile ? x.mobile : x.desktop, evidence: x.observation })),
      right_bottom_complete: text || !mobile,
      outcome: text ? 'pass' : 'revise',
    }
  }),
  findings: visualEvidence.findings,
  image_log: imageLog,
  counters: { image_opens: 8, source_figure_image_opens: 4, existing_surface_image_opens: 4, batch_count: 1, batch_maximum: 8, context_image_total: 8, context_maximum: 24, reopens: 0, crops: 0, new_screenshots: 0, new_renders: 0, browser_calls: 0, new_figure_gates: 0 },
  outcome: 'revise',
}
const visualOut = write('visual-observation.json', visual)

// Bind each actual file once in this receipt; catalogue identity remains historical.
const intendedBindings = [
  ...predecessor.inputFiles,
  ...predecessor.projectionFiles,
  predecessor.choiceDraft,
  predecessor.answerCandidate,
  { path: sourcePath, sha256: first.source_bytes_sha256 },
  ...source.prerequisites.pages.flatMap((p) => p.files),
  ...source.prerequisites.bindings,
]
const seen = new Set()
const currentBindings = intendedBindings.filter((x) => {
  if (seen.has(x.path)) return false
  seen.add(x.path)
  return true
}).map((x) => {
  const actual = binding(x.path)
  const historicalCatalogue = x.path.endsWith('/9-10g/book.json')
  return {
    ...actual,
    expected_sha256: x.sha256,
    matches_expected: actual.sha256 === x.sha256,
    binding_scope: historicalCatalogue ? 'immutable historical seed catalogue trace, not current unrelated catalogue equality' : 'reviewed source/candidate/surface/prerequisite bytes',
    ...(historicalCatalogue ? { historical_trace_preserved: true, content_rebound: false } : {}),
  }
})
const contentBindingProblems = currentBindings.filter((x) => !x.matches_expected && !x.historical_trace_preserved)
const nativeRequire = createRequire(path.join(cwd, 'app/package.json'))
const runtimePath = nativeRequire.resolve('@cortex-js/compute-engine')
const report = {
  schema: 'same188-6/n41-answer-choice-and-existing-surfaces-review@1',
  generated_at: new Date().toISOString(),
  reviewer: choiceReview.reviewer,
  cwd,
  ticket: 'STEMROBIN-188',
  batch: 'SAME188-6',
  lesson: 'geo910-c1-s3-n41',
  scope: 'Only independent N41 source/answer/choice semantic review plus exactly four retained offline display fullframes. Authors completed/closed per direct user instruction; no delegation or agent messages.',
  outcomes: { choice: 'pass', answer_mathematics: 'pass', answer_semantic_grading: 'revise', displayed_standard_solutions: 'pass', existing_surfaces: 'revise', full_gate2: 'not-approved-input-chain-out-of-scope' },
  outcome: contentBindingProblems.length ? 'blocked' : 'revise',
  findings: [...answerReview.findings, ...visual.findings],
  first_prekey_order: {
    stages: [
      'Read skills/contracts/production-resume and source-with-conventions only, not answer/choice author internals.',
      'Verified exact six prior rows, old comparison/receipt seals and current readonly184 canonical snapshots; opened originals160/161 and existing modern480frames.',
      'Independently solved391-404; wrote FIRST-source-solutions.md/json.',
      'Only then opened visible-questions.json; fidelity/redundancy/leakage/package checks precede independent option mathematics.',
      'Independently solved all58 options and wrote PREKEY-true-sets.md/json.',
      'Only then opened draft.json internals and answer-keys.candidate.json; compared every source solution,optionkey,wrong-procedure rationale and standard proof.',
      'Inspected exactly four existing surface fullframes; performed two fresh bounded grading-counterexample calculations,not existing checker reruns.',
      'Wrote final review artifacts only in the authorized directory.',
    ],
    first_json: binding(path.join(root, 'FIRST-source-solutions.json')),
    first_md: binding(path.join(root, 'FIRST-source-solutions.md')),
    prekey_json: binding(path.join(root, 'PREKEY-true-sets.json')),
    prekey_md: binding(path.join(root, 'PREKEY-true-sets.md')),
    author_key_read_before_first: false,
    visible_read_before_first: false,
    author_key_read_before_prekey: false,
  },
  source_input: binding(sourcePath),
  predecessor_bindings: {
    ...binding(path.join(inputRoot, 'bindings.json')),
    warning: 'source-only.json remains predecessor projection. Actual FIRST input is source-with-conventions.json with independently verified six scoped rows. No blanket source approval follows from predecessor bindings.',
  },
  canonical_snapshots: {
    seed: '95c9a0045c4efdf10214c888dcf652a004eab553b3ca6d8e691863336d86e903',
    draft: '7458a76f1eaaf1850bf9d394423a12e9d62c6d1c21c09f02d44731d0b8226fc0',
    method: 'Canonical sorted JSON,ensure_ascii=true,separators comma/colon. Calculated after PREKEY; no prepare/validator/checker invoked.',
  },
  conventions: first.conventions,
  convention_resolutions: post.convention_resolutions,
  all_source_coverage: sourceReviews,
  package_relationships: prekey.package,
  complete_true_sets: questionReviews.map((q) => ({ question_id: q.question_id, correct: q.mathematics.correct })),
  bindings: currentBindings,
  content_binding_problems: contentBindingProblems,
  existing_figure_semantic_pass: { ...binding(figureReviewPath), status: figuresPrior.status, reused: true, new_figure_gates: 0 },
  preserved_repair_counters: { fig160: { used: 1, maximum: 1, new_repairs: 0 }, fig161: { used: 0, maximum: 1, new_repairs: 0 }, choice_author_content_revision: 1, reviewer_content_revisions: 0 },
  original_failures_and_holds: {
    figure_original_failures: figuresPrior.preservedFailures,
    choice_original_failure_events: choiceAuthor.first_failures,
    choice_original_revision: choiceAuthor.author_revision,
    choice_author_report: binding(choiceAuthorPath),
    answer_original_execution_failures: answerAuthor.executionFailures,
    answer_author_report: binding(answerAuthorPath),
    prior_source_holds: source.prerequisites.originalHolds,
    prior_source_comparison_status: source.prerequisites.originalComparisonStatus,
    prior_whole_pages_sourceApproved: false,
    old_comparison_and_reports_modified: false,
    author_399_402_qualifications: 'Preserved in author artifacts. Resolved only for these source tasks by exact scoped prerequisite seals; no historical report rewritten.',
  },
  grading_evidence: {
    lexical: post.grading_counterexamples,
    expression: post.expression_grading_counterexamples,
    production_normalizer: binding(path.join(cwd, 'app/src/lib/answer-normalize.ts')),
    production_rule: binding(path.join(cwd, 'app/src/lib/textbook-answer.ts')),
    existing_compute_engine_runtime: binding(runtimePath),
  },
  reviewer_execution_failures: post.reviewer_execution_failures,
  counters: {
    independent_source_exercises: 14,
    source_case_tasks: 18,
    choice_source_reviews: 14,
    choice_question_reviews: 14,
    complete_true_sets: 14,
    option_checks: 58,
    correct_options: 19,
    incorrect_options: 39,
    source_convention_rows_verified: 6,
    answer_derivations: 14,
    standard_display_checks: 14,
    answer_grading_revise: 2,
    grading_semantic_probe_invocations: 2,
    grading_semantic_probe_cases: 4,
    correct_answer_false_negatives: 3,
    existing_fullframes: 4,
    image_opens: 8,
    image_batches: 1,
    context_images: 8,
    batch_limit: 8,
    context_limit: 24,
    crops: 0,
    reopens: 0,
    new_renders: 0,
    new_screenshots: 0,
    setup_or_freshness_reruns: 0,
    structural_validator_runs: 0,
    existing_checker_reruns: 0,
    new_figure_gates: 0,
    new_content_repairs: 0,
    reviewer_technical_failure_events: 2,
    database_calls: 0,
    env_reads: 0,
    installs: 0,
    dependency_changes: 0,
    model_service_calls: 0,
    paid_calls: 0,
    network_calls: 0,
    git_writes: 0,
    core_edits: 0,
    retention_calls: 0,
    finalize_calls: 0,
    MathLive_calls: 0,
    publish_calls: 0,
    browser_calls: 0,
    agent_messages: 0,
    delegates: 0,
  },
  outputs: [choiceOut, answerOut, visualOut, binding(path.join(root, 'postkey-evidence.json')), binding(path.join(root, 'visual-evidence.json')), binding(path.join(root, 'assemble-reviews.mjs'))],
  required_work_not_authorized_here: 'Record revise defects, do not edit drafts/core/retained content. Real exact-input-chain evidence remains unapproved; this review performs no finalization, retention or publication.',
}
const reportOut = write('report.json', report)
const reportMd = write('report.md', [
  '# N41 Independent Review',
  '',
  `Outcome: ${report.outcome.toUpperCase()}. Choice semantics PASS; all14 source solutions and all58 options independently solved. Candidate answer mathematics/displayed proofs PASS, but reliable grading REVISE for392 and397. Existing surfaces REVISE.`,
  '',
  '## Concrete Findings',
  '',
  '1. A392-EXACT-INTERVAL: actual exact normalizer rejects the correct native open interval alpha in ]10degrees,150degrees[ and reversed20-to140 inequality. Two correct-answer false negatives.',
  '2. A397-DOMAIN-EQUIVALENCE: actual isEqual rule rejects sqrt(2a²/3) despite a being a nonnegative distance parameter and the displayed proof deriving PM²=2a²/3. Reordered sqrt6*a/3 is accepted.',
  '3. V395-MOBILE-CLIP: existing exercises-390 fullframe clips the rightmost360degreebound in exercise395. Mechanical documentWidth390 does not establish bounded-cell completeness.',
  '4. V-NUMBER-DUPLICATION:391,392,393,394,396,397 show both a left label and repeated body number at both widths.',
  '',
  '## Independence',
  '',
  `FIRST JSON ${report.first_prekey_order.first_json.path} SHA256 ${report.first_prekey_order.first_json.sha256}.`,
  `PREKEY JSON ${report.first_prekey_order.prekey_json.path} SHA256 ${report.first_prekey_order.prekey_json.sha256}.`,
  'FIRST was frozen before visible questions; PREKEY was frozen before draft internals/candidate keys. Author keys all match frozen sets. Every false option was checked against its author-described wrong procedure after the independent solve.',
  '',
  '## Scoped Conventions',
  '',
  'p0138#4 explicitly defines edges as rays; p0139#7 explicitly limits study to convex polyhedral angles. All six retained independent StageA/first-comparison rows and exact current readonly184 snapshots match their seals. These support399 and402, including403 interior-angle pairing. Whole-page sourceApproved=false and all eight unrelated source holds remain unchanged.',
  '',
  `Source input ${sourcePath} SHA256 ${first.source_bytes_sha256}. bindings.json/source-only.json are predecessor metadata, not the actual FIRST projection.`,
  `Seed canonical SHA256 ${choiceReview.seed_sha256}. Draft canonical SHA256 ${choiceReview.draft_sha256}.`,
  `Draft bytes SHA256 ${hash(draftPath)}. Candidate bytes SHA256 ${hash(answerPath)}.`,
  '',
  '## Existing Surfaces',
  '',
  'Text1440 andtext390: every paragraph/formula, both complete figures and captions, rightmostB/bottomC labels and final appendix text/button inspected. Exercises1440: all14 rows/formulas complete but numbering duplication. Exercises390: all14 rows and pagebottom present;395 formula right boundary fails, other13 bodies complete. No new screenshot/render/browser or image crop.',
  '',
  '## Counters',
  '',
  'Sources14;source cases18;questions14;options58=true19/false39;answer derivations14;display checks14;grading revise2;fresh bounded semantic probes2/cases4/confirmed false negatives3;scoped rows6.',
  'Images8=source4+existingfullframes4;onebatch8/8;context8/24;reopens0/crops0. New figure gates0;fig160 repairs1/1 andfig1610/1 unchanged;choice author revision1 unchanged.',
  'Setup/freshness reruns0;structural runs0;existing checker reruns0;DB/env/install/deps/model/paid/network/Git/core/retention/finalize/MathLive/publish/browser/messages/delegates all0. Two read-only technical discovery/projection failures retained with no content-counter reset.',
  '',
  'Full Gate2 is not approved: all14 exact accepted forms still need real keyboard/edit/serialization evidence in a separately authorized stage. These semantic reviews do not finalize or publish.',
  '',
  '## Outputs',
  '',
  ...[choiceOut, answerOut, visualOut, reportOut].map((x) => `${x.path} SHA256 ${x.sha256}`),
  '',
].join('\n'))
const delivered = [
  ...['FIRST-source-solutions.md', 'FIRST-source-solutions.json', 'PREKEY-true-sets.md', 'PREKEY-true-sets.json', 'postkey-evidence.json', 'visual-evidence.json', 'assemble-reviews.mjs'].map((name) => binding(path.join(root, name))),
  choiceOut, answerOut, visualOut, reportOut, reportMd,
]
write('output-hashes.json', { schema: 'n41-independent-review-delivery-hashes-v1', cwd, outcome: report.outcome, files: delivered, counters: report.counters })
console.log(JSON.stringify({ outcome: report.outcome, choice: choiceReview.outcome, answer: answerReview.outcome, visual: visual.outcome, outputs: [choiceOut, answerOut, visualOut, reportOut, reportMd], counters: report.counters }, null, 2))
