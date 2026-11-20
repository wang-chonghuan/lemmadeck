import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
if (process.cwd() !== root) throw new Error('Unexpected cwd');
const tmp = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp');
const out = path.join(tmp, 'n42-answer-choice-review');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const canonical = value => JSON.stringify(value, (key, val) => val && typeof val === 'object' && !Array.isArray(val)
  ? Object.fromEntries(Object.keys(val).sort().map(key => [key, val[key]])) : val)
  .replace(/[\u007f-\uffff]/g, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
const read = file => JSON.parse(fs.readFileSync(file));
const write = (name, value) => fs.writeFileSync(path.join(out, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const source = read(path.join(tmp, 'n42-review-inputs/source-only.json'));
const firstSeal = read(path.join(out, 'FIRST-seal.json'));
const prekeySeal = read(path.join(out, 'PREKEY-seal.json'));
const keyReceipt = read(path.join(out, 'keys-read-receipt.json'));
const choiceReceipt = read(path.join(out, 'choice-comparison-receipt.json'));
const choiceReview = read(path.join(out, 'review.json'));
const answerEvidence = read(path.join(out, 'answer-evidence.json'));
const visualEvidence = read(path.join(out, 'visual-observation.evidence.json'));
const defect = read(path.join(out, 'first-defect.json'));
const rendered = read(path.join(out, 'render-receipt.json'));
const surfacePath = path.join(tmp, 'offline-display-9-10g_geo910-c2-s1-n42-surfaces/result.json');
const surface = read(surfacePath);
const candidatePath = keyReceipt.candidate;
const candidate = read(candidatePath);
const bindings = new Map();
const bind = (file, role, expected) => {
  const absolute = path.resolve(root, file);
  const bytes = fs.readFileSync(absolute);
  const actual = hash(bytes);
  if (expected && actual !== expected) throw new Error(`Changed evidence bytes: ${absolute}`);
  if (bindings.has(absolute)) {
    const known = bindings.get(absolute);
    if (!known.roles.includes(role)) known.roles.push(role);
    return known;
  }
  const binding = { path: absolute, sha256: actual, size: bytes.length, roles: [role] };
  if (absolute.endsWith('.json')) binding.canonical_sha256 = hash(canonical(JSON.parse(bytes)));
  bindings.set(absolute, binding);
  return binding;
};
for (const phase of [firstSeal, prekeySeal]) {
  for (const entry of phase.bindings) bind(entry.path, entry.role, entry.sha256);
}
for (const entry of choiceReceipt.bindings) bind(entry.path, entry.role, entry.sha256);
for (const entry of keyReceipt.earlier) bind(entry.path, 'key-last chronology guard', entry.sha256);
bind(candidatePath, 'authorized answer candidate read key-last', answerEvidence.candidate_sha256);
for (const name of [
  'n42-review-inputs/bindings.json',
  'n42-choice-prerequisite-repair-01/report.md',
  'n42-choice-prerequisite-repair-01/prerequisite-bindings.json',
  'n42-choice-prerequisite-repair-01/task-solutions.md',
  'n42-choice-author/task-solutions.md',
  'n42-answer-author/report.json',
  'n42-answer-author/report.md',
  'n42-answer-author/derivations.pre-candidate.md',
]) bind(path.join(tmp, name), 'authorized author/prerequisite/projection evidence interpreted after PREKEY');
for (const name of [
  'FIRST-seal.json', 'PREKEY-seal.json', 'keys-read-receipt.json',
  'choice-comparison-receipt.json', 'choice-comparison.json',
  'answer-evidence.json', 'visual-observation.evidence.json', 'first-defect.json',
  'render-current.mjs', 'seal.mjs', 'assemble-choice.mjs', 'read-key-last.mjs', 'assemble-final.mjs',
]) bind(path.join(out, name), 'review-local current evidence');
for (const file of [
  '.claude/skills/ld-s10y-answer/SKILL.md',
  '.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md',
  '.agents/skills/ld-s10y-choice/SKILL.md',
  '.agents/skills/ld-s10y-choice/references/contract.md',
  '.agents/skills/ld-s10y-choice/references/review.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.intentfold/readme.md',
  '.intentfold/charter/engineering.md',
  '.intentfold/charter/operations.md',
  '.claude/skills/ld-s10y-lesson/node_modules/@resvg/resvg-js/package.json',
  '.claude/skills/ld-s10y-lesson/node_modules/@resvg/resvg-js/index.js',
  '.claude/skills/ld-s10y-lesson/node_modules/@resvg/resvg-js-darwin-arm64/resvgjs.darwin-arm64.node',
]) bind(file, 'current governing instruction or installed render dependency');
const machineBinding = bind(surfacePath, 'existing four-surface machine result, never modified', visualEvidence.machine_result_sha256);
for (const entry of surface.results) {
  bind(entry.screenshot, 'actually opened complete surface screenshot exactly once', entry.screenshotSha256);
}
const lessonPath = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n42/lesson.json');
const exercisePath = path.join(path.dirname(lessonPath), 'exercises.json');
const lesson = read(lessonPath);
const exercises = read(exercisePath);
const candidateIdentity = candidate.answers.map(answer => {
  const exercise = exercises.exercises.find(e => e.number === answer.exercise);
  return {
    exercise: answer.exercise,
    prompt_byte_equality: answer.prompt === exercise.text,
    group_id_equality: answer.groupId === exercise.group_id,
    source_number_equality: answer.sourceNumber === exercise.source_number,
    source_pages_equality: canonical(answer.sourcePages) === canonical(exercise.pages),
    figure_refs_empty: exercise.figure_refs.length === 0 && answer.figureEvidence.length === 0,
  };
});
if (candidateIdentity.some(entry => Object.entries(entry).some(([key, val]) => key !== 'exercise' && val !== true))) throw new Error('Candidate source identity mismatch');
if (fs.existsSync(path.join(root, answerEvidence.source_policy.book_answers_path))) throw new Error('Book answer provenance changed');
if (surface.results.length !== 4 || visualEvidence.screenshots.length !== 4) throw new Error('Unexpected image count');
const firstHash = hash(fs.readFileSync(path.join(out, 'FIRST-seal.json')));
const prekeyHash = hash(fs.readFileSync(path.join(out, 'PREKEY-seal.json')));
const keysHash = hash(fs.readFileSync(path.join(out, 'keys-read-receipt.json')));
const seals = {
  first: { path: path.join(out, 'FIRST-seal.json'), sha256: firstHash, sealed_at: firstSeal.sealed_at },
  prekey: { path: path.join(out, 'PREKEY-seal.json'), sha256: prekeyHash, sealed_at: prekeySeal.sealed_at },
  keys_read: { path: path.join(out, 'keys-read-receipt.json'), sha256: keysHash, opened_at: keyReceipt.opened_at },
};
const allInputs = [...bindings.values()];
write('answer-review.json', {
  schema: 'n42-answer-review-v1',
  reviewer: { kind: 'independent_agent', identity: 'Codex sole independent reviewer STEMROBIN-188/SAME188-6 N42' },
  status: answerEvidence.status,
  candidate: { path: candidatePath, sha256: answerEvidence.candidate_sha256, status_preserved: candidate.status },
  candidate_sha256: answerEvidence.candidate_sha256,
  input_bindings: allInputs,
  seals,
  ...Object.fromEntries(Object.entries(answerEvidence).filter(([key]) => !['schema', 'candidate_sha256', 'status'].includes(key))),
  candidate_identity_comparison: candidateIdentity,
  actual_mathlive_finalize: 'pending for parent; not run',
});
write('visual-observation.json', {
  ...visualEvidence,
  reviewer: { kind: 'independent_agent', identity: 'Codex sole independent reviewer N42, fresh four-surface observation' },
  input_bindings: allInputs,
  seals,
  machine_result: machineBinding,
  lesson_source: bind(lessonPath, 'visual lesson source', visualEvidence.source_hashes['lesson.json']),
  exercise_source: bind(exercisePath, 'visual exercise source', visualEvidence.source_hashes['exercises.json']),
  affected_proof_block_canonical_sha256: hash(canonical(lesson.prose[15])),
  last_proof_block_canonical_sha256: hash(canonical(lesson.prose[16])),
});
const imageFiles = [
  { path: source.imageInputs[0].original, kind: 'original-source-crop', id: 'fig-g10-01' },
  { path: source.imageInputs[1].original, kind: 'original-source-crop', id: 'fig-g10-02' },
  { path: rendered[0].output, kind: 'complete-current-svg-render', id: 'fig-g10-01', svg: source.imageInputs[0].modern },
  { path: rendered[1].output, kind: 'complete-current-svg-render', id: 'fig-g10-02', svg: source.imageInputs[1].modern },
  ...surface.results.map(entry => ({ path: entry.screenshot, kind: 'complete-existing-surface-screenshot', id: `${entry.kind}-${entry.viewport.width}` })),
];
const firstSource = read(path.join(out, 'FIRST-source.json'));
const ledgerImages = imageFiles.map((entry, index) => {
  const bytes = fs.readFileSync(entry.path);
  const sourceFigure = firstSource.figure_inventory.find(f => f.id === entry.id);
  const observation = index < 2 ? sourceFigure.original_observation
    : index < 4 ? sourceFigure.modern_observation
      : visualEvidence.screenshots[index - 4].observations.join(' ');
  return {
    load: index + 1,
    ...entry,
    sha256: hash(bytes),
    dimensions: { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) },
    actual_loads: 1,
    full_frame: true,
    reopened: false,
    cropped: false,
    observation,
    verdict: index === 6 ? 'revise' : 'pass',
    ...(entry.svg ? { current_svg_sha256: hash(fs.readFileSync(entry.svg)) } : {}),
  };
});
write('image-ledger.json', {
  schema: 'n42-eight-actual-image-loads-v1',
  status: 'complete',
  batch_count: 1,
  fresh_context_start_images: 0,
  actual_loads: 8,
  batch_limit: 8,
  context_image_count: 8,
  context_limit: 24,
  reopens: 0,
  crops: 0,
  new_browser_runs: 0,
  new_figures: 0,
  paid_or_model_calls: 0,
  seals,
  input_bindings: allInputs,
  images: ledgerImages,
  failures: visualEvidence.failures,
  scope: 'Original figures, complete current SVG renders, and exactly four declared existing screenshots. Figure observations are not repeated formal approvals.',
  limitations: visualEvidence.limitations,
});
const outputNames = ['answer-review.json', 'review.json', 'visual-observation.json', 'image-ledger.json'];
const artifacts = outputNames.map(name => ({ path: path.join(out, name), sha256: hash(fs.readFileSync(path.join(out, name))) }));
const technicalEvents = [
  { command: 'ls -ld review-output .agents/skills/node_modules/@resvg/resvg-js original-crops', exit: 1, detail: 'Output directory did not yet exist and the guessed installed resvg location was absent. Recovered locally by apply_patch directory creation and locating existing lesson-owned resvg; no install.', content_failure: false },
  { command: 'rg --files installed dependency roots -g *resvg*', exit: 2, detail: 'Missing repo-root node_modules warning; same command located installed lesson-owned resvg. No dependency, env or network change.', content_failure: false },
  { command: 'rg render_offline.mjs and render_spec.mjs', exit: 2, detail: 'Guessed render_offline.mjs path absent. Direct current-SVG resvg rasterization subsequently succeeded; FigureSpec renderer never ran.', content_failure: false },
];
const report = {
  schema: 'n42-combined-independent-review-v1',
  ticket: 'STEMROBIN-188',
  assignment: 'SAME188-6 N42',
  reviewer: { kind: 'independent_agent', identity: 'Codex sole independent reviewer; no other reviewer dispatched/contacted' },
  status: 'revise',
  recorded_at: new Date().toISOString(),
  cwd: root,
  write_root: out,
  seals,
  candidate: { path: candidatePath, sha256: answerEvidence.candidate_sha256 },
  seed_canonical_sha256: choiceReview.seed_sha256,
  draft_canonical_sha256: choiceReview.draft_sha256,
  input_bindings: allInputs,
  source_policy: answerEvidence.source_policy,
  outcomes: { answer_semantics: answerEvidence.status, choice_semantics: choiceReview.outcome, fresh_four_surface_visual: visualEvidence.status, overall: 'revise' },
  artifacts,
  counts: { ...answerEvidence.counts, choice_questions: 7, choice_options: 28, choice_single: 5, choice_multiple: 2, source_reviews: 7, figure_checks_in_choice_review: 1, new_figures: 0, original_image_loads: 2, current_render_image_loads: 2, screenshot_image_loads: 4, total_actual_image_loads: 8 },
  preserved_history: {
    original_four_question_bindings: choiceReceipt.preservationChecks,
    historical_hold_coverage: choiceReceipt.historicalHolds,
    historical_author_hold_records: choiceReceipt.prior_author_holds_retained_as_history,
    unrelated_n20_figure116_hold: 'Unapproved, unread and untouched; not a prerequisite approval gate.',
    candidate_status: 'draft, never edited or promoted',
    machine_result_status: surface.results.map(r => ({ kind: r.kind, width: r.viewport.width, status: r.status })),
  },
  failures: visualEvidence.failures,
  first_genuine_defect: { ...defect, path: path.join(out, 'first-defect.json'), sha256: hash(fs.readFileSync(path.join(out, 'first-defect.json'))) },
  technical_events: technicalEvents,
  historical_author_boundary_deviation: 'The authorized answer-author report discloses an initial read-only git status invocation. This independent reviewer made zero Git calls; the historical deviation is retained and is not used as mathematical evidence.',
  boundaries: {
    offline: true, network_calls: 0, db_calls: 0, env_or_credentials_access: 0, model_or_paid_calls: 0, installs: 0, git_calls: 0,
    other_agent_messages: 0, core_edits: 0, candidate_edits: 0, promotion_or_finalize: 0,
    in_flight_batch02_retainer_author_read: false, prior_lesson_choice_review_or_test_outputs_consulted: false,
    setup_or_freshness_gate_rerun: false, structural_validator_rerun: false, formal_figure_or_content_gate_rerun: false,
    current_hash_binding_checks_only: true, browser_runs: 0, image_reopens: 0, image_crops: 0,
  },
  limitations: [
    ...answerEvidence.limitations, ...visualEvidence.limitations,
    'Only the supplied N20 prose0/prose22 and N43 prose8 prerequisites were interpreted. Their whole-file bytes were hashed for binding, not reviewed as entire lessons.',
    'FigureSpec bytes were bound, not rerendered/revalidated or used as numerical source data; all seven exercise figure_refs are empty. Earlier passed source/content/formal figure gates were reused.',
    'This is independent offline semantic evidence. It does not certify runtime choice widgets, answer display layout, real input-chain grading, retention, production or publication.',
  ],
  remaining_stages: [
    'Parent presentation-only repair of N42-VIS-01 and affected-only fresh mobile text observation; retain current REVISE history.',
    'Parent reviewed choice checker against the current seed/draft and review.json; reviewer did not rerun the structural validator.',
    'Parent actual MathLive keyboard editing for15 exact parts/18 accepted forms and lesson_answers.py finalize; current candidate remains draft.',
    'No promotion, retention or publishing is authorized or performed by this review.',
  ],
};
write('report.json', report);
const lines = [
  '# N42 Independent Answer / Choice / Surface Review', '',
  'Overall: REVISE. Answer semantics: PASS. Choice semantics: PASS. Fresh four-surface visual: REVISE.', '',
  '## First Defect',
  'N42-VIS-01 (P2): The complete text-390 screenshot cuts the end of the first expanded dot-product proof row in prose[15], p0154#1. The full trailing +y1y2*j^2 term is not visible. Desktop text and both exercise screenshots pass. No silent edit; REVISE is retained. Scroller recoverability is untested and no new browser run is permitted.', '',
  '## Independent Order',
  `FIRST seal: ${seals.first.path}`, `SHA256: ${firstHash}`,
  `PREKEY seal: ${seals.prekey.path}`, `SHA256: ${prekeyHash}`,
  `Keys-read receipt: ${seals.keys_read.path}`, `SHA256: ${keysHash}`,
  'The seven source solutions and four actual source/current figure observations preceded visible options. Seven visible-question reviews and all28 option truth records were made immutable before current author internals. The answer candidate was opened only after choice comparison. No prior answer-key read informed the independent mathematics.', '',
  '## Results',
  'Source results: coordinates as FIRST-source; sums(-1,2,5),(-9,3,-4),(4,4,-1); scalar results(-6,-2,4),(-14/3,0,-7),(18,-5,19); collinearity witnesses2/3 and-3/4; parameters x=-5/3,y=6/5; dot products7,1/3; perpendicularity dots4,0 => no,yes.',
  'Answers: seven correct displays, six auto/one ungraded, nineteen graded parts (15 exact/4 numeric), twenty source subtasks and twenty-one requested quantities/reasoning responses. All22 accepted forms are mathematically checked; actual MathLive is pending.',
  'Choices: seven questions/28 options, five single/two multiple. True sets C;B;A,D,F;D;A,B;B;C. Every option, rationale and wrong-procedure mechanism was checked. Source4 written witnesses are lost in recognition and explicitly documented; the original two pairs both qualify, without invented false data.',
  'Original four question canonical hashes are unchanged. Three original HOLD coverage records and both author HOLD records are preserved as history. Supplied real prerequisites settle only these current tasks; N20 figure116 HOLD remains unrelated/unapproved. New figures0.', '',
  '## Bindings',
  `Candidate: ${candidatePath}`, `SHA256: ${answerEvidence.candidate_sha256}`,
  `Canonical seed: ${choiceReview.seed_sha256}`, `Canonical draft: ${choiceReview.draft_sha256}`,
  ...artifacts.flatMap(a => [`${a.path}`, `SHA256: ${a.sha256}`]),
  `Existing machine result: ${surfacePath}`, `SHA256: ${machineBinding.sha256}`,
  'Machine result visual-pending bytes/status are unchanged. report.json contains all current source/author/figure/screenshot/record/dependency bindings; SHA256SUMS binds every local report file without self-referential hashes.', '',
  '## Images And Boundaries',
  'Exactly eight actual loads in one fresh batch: two original crops, two complete current-SVG resvg480x400 frames, and exactly four complete declared screenshots. Zero reopens/crops/new browser runs. Image-ledger binds all image and source hashes. No images are returned to the parent.',
  'Offline only; exact required cwd on every exec; all writes only in this review directory via apply_patch-authored files or their local evidence generators. No DB/env/credentials/network/model/paid/install/Git/other-agent messages/core edits/promotion/finalize; no in-flight batch02-retainer-author or prior lesson choice/review/test outputs read.',
  'Missing guessed paths during dependency lookup were technical-only and recovered using already installed resvg. The answer-author historical read-only Git deviation is disclosed separately; this reviewer used no Git.', '',
  '## Remaining',
  'Parent: targeted mobile proof-presentation repair and affected-only fresh observation; reviewed choice checker; real MathLive edited serialization for15 exact parts/18 forms and answer finalize. Static lesson screenshots do not prove candidate answer/choice runtime display or input behavior. No promotion/retention/publication was performed or authorized.',
];
fs.writeFileSync(path.join(out, 'report.md'), lines.join('\n') + '\n', { flag: 'wx' });
fs.chmodSync(path.join(out, 'first-defect.json'), 0o444);
const localFiles = fs.readdirSync(out).filter(name => fs.statSync(path.join(out, name)).isFile()).sort();
const manifest = localFiles.map(name => {
  const bytes = fs.readFileSync(path.join(out, name));
  return { path: path.join(out, name), sha256: hash(bytes), size: bytes.length };
});
write('artifact-hashes.json', {
  schema: 'n42-local-artifact-byte-manifest-v1',
  recorded_at: new Date().toISOString(),
  files: manifest,
  note: 'Excludes this manifest and SHA256SUMS to avoid self-reference. SHA256SUMS additionally binds this manifest.',
});
const sumNames = [...localFiles, 'artifact-hashes.json'].sort();
fs.writeFileSync(path.join(out, 'SHA256SUMS'), sumNames.map(name => `${hash(fs.readFileSync(path.join(out, name)))}  ${name}`).join('\n') + '\n', { flag: 'wx' });
console.log(JSON.stringify({
  status: report.status,
  outcomes: report.outcomes,
  artifacts: [...artifacts, { path: path.join(out, 'report.json'), sha256: hash(fs.readFileSync(path.join(out, 'report.json'))) }, { path: path.join(out, 'report.md'), sha256: hash(fs.readFileSync(path.join(out, 'report.md'))) }],
  seals,
  inputs: allInputs.length,
  actual_image_loads: 8,
  first_defect: defect.id,
  candidate_sha256: answerEvidence.candidate_sha256,
  machine_result_status_unchanged: hash(fs.readFileSync(surfacePath)) === machineBinding.sha256,
}, null, 2));
