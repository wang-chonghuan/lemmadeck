import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const output = '/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d1231-n98-q1q2-definition-binding-recovery';
assert.equal(process.cwd(), root);
assert.equal(path.dirname(fileURLToPath(import.meta.url)), output);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = filename => fs.readFileSync(filename);
const bind = (filename, expected) => {
  const bytes = read(filename);
  const sha256 = hash(bytes);
  assert.equal(sha256, expected, `Hash mismatch: ${filename}`);
  return { path: filename, sha256, bytes: bytes.length };
};
const oldRoot = path.join(root, 'tmp/d1225-n98-first-independent-answer-review');
const oldHashes = {
  'adjudication.json': '06c9056bb2eb9627c8f2d80638138a9a29f0eb4676360a3d7e6e9c2c04b3f27d',
  'freeze-seal.json': 'ca150bf7480ef8fa8e37ee215bb92bf091250a67c78de5e1fcf28bc23af68e27',
  'freeze.mjs': '0a137a420cdf6a6343f87a194fc4b694841b8590b5bbcb7cb9dba94ee376c6c9',
  'independent-inventory.json': 'df4a97dd0b474b9e45a3831ece8be054e4f8434b2ea59f73b83ffdd28fcc2183',
  'independent-solutions.json': '267623065899d3a1987251b2f53d7607ab00d5c30cb635c27c882180a2a03c80',
  'report.json': '9383dd8d438ae32049796abe15adf1aef1fdfc15b064571f86a68ae73ade6b81',
  'usage.json': '2694aa8b73da1c49fa150112f8f50dccfa549933fc618e08da9d983b3ca4ddca',
  'verify-and-report.mjs': 'b0e2b1591e810ce27473dc345064576984ffd24d2ad85bae9943e5d81fd177ad'
};
assert.deepEqual(fs.readdirSync(oldRoot).sort(), Object.keys(oldHashes).sort());
const originalBindings = Object.entries(oldHashes).map(([name, sha256]) => bind(path.join(oldRoot, name), sha256));
const oldReportBinding = originalBindings.find(binding => binding.path.endsWith('/report.json'));
const oldReport = JSON.parse(read(oldReportBinding.path));
assert.equal(oldReport.verdict, 'FAIL');
assert.equal(oldReport.content_verdict, 'PASS');
assert.equal(oldReport.failure_kind, 'missing_required_definition_input');
assert.equal(oldReport.findings.length, 1);
assert.equal(oldReport.findings[0].id, 'N98-FIRST-INPUT-1');
assert.deepEqual(oldReport.findings[0].exercises, ['1', '2']);
assert.equal(oldReport.findings[0].candidate_defect, false);
assert.equal(oldReport.independence.derivation_frozen_before_candidate_content_or_author_report_read, true);
const ticket = path.join(root, '.intentfold/tickets/STEMROBIN-181');
const definitionPaths = {
  zh: path.join(ticket, 'tmp/d1090-n94-first-bilingual-text-author/zh/lesson.template.json'),
  en: path.join(ticket, 'tmp/d1090-n94-first-bilingual-text-author/en/lesson.template.json')
};
const expectedDefinitions = {
  zh: 'd4aa094820ab4216ab81618d54e40866a5cbc741d152f6ae09782ab5ff3fb1af',
  en: '7bbe0f72da36d7dda3dcf3f07021da4d0c34ec9aa5f6ddcb777a30d7ba4ea962'
};
const approvalPath = path.join(ticket, 'evidence/reports/d1113-progress/n94/text-independent-review.json');
const approvalBinding = bind(approvalPath, '30d1f15ae127da9ffb181d3158fa82e9a3be15ff6a188ebd538d3abf488ef651');
const approval = JSON.parse(read(approvalPath));
assert.equal(approval.status, 'PASS');
assert.equal(approval.ticket, 'STEMROBIN-181');
assert.equal(approval.card, 'phy10-c2-s4-n94');
assert.equal(approval.completeCard, false);
const definitions = [];
const excerpts = {};
for (const locale of ['zh', 'en']) {
  const binding = bind(definitionPaths[locale], expectedDefinitions[locale]);
  const approved = approval.candidates.find(candidate => candidate.path === binding.path);
  assert.ok(approved, `Definition missing from approval candidates: ${binding.path}`);
  assert.equal(approved.sha256, binding.sha256);
  const definition = JSON.parse(read(binding.path));
  assert.equal(definition.id, 'phy10-c2-s4-n94');
  assert.equal(definition.card_id, 'phy10-c2-s4-n94');
  assert.equal(definition.locale, locale);
  excerpts[locale] = ['p0252#2', 'p0252#3', 'p0252#4', 'p0252#5'].map(ref => {
    const index = definition.prose.findIndex(block => block.source_refs.includes(ref));
    assert.ok(index >= 0);
    const block = definition.prose[index];
    assert.equal(block.kind, 'p');
    return {
      source_ref: ref,
      json_pointer: `/prose/${index}/text`,
      text: block.text,
      text_sha256: hash(Buffer.from(block.text, 'utf8'))
    };
  });
  definitions.push({
    locale,
    ...binding,
    supplied_hash_matches: true,
    approved_text_receipt_binding_matches: true
  });
}
const candidateBindings = oldReport.candidates.map(previous => ({
  locale: previous.locale,
  ...bind(previous.path, previous.sha256),
  matches_FIRST_candidate_file_hash: true,
  all_eight_answers_unchanged: true,
  unchanged_exercise_ids: ['1', '2', '3', '4', '5', '6', '7', '8'],
  proof: 'Exact whole-file SHA256 equals the original FIRST review binding; no Q3-Q8 candidate content was reopened for review.'
}));
const questionSourceBindings = oldReport.input_bindings
  .filter(input => /^questions_/.test(input.role))
  .map(input => ({ role: input.role, ...bind(input.path, input.sha256), unchanged_since_FIRST: true }));
const expectedIds = Array.from({ length: 8 }, (_, index) => String(index + 1));
assert.deepEqual(oldReport.questions.map(question => question.exercise), expectedIds);
for (const question of oldReport.questions) {
  assert.equal(question.content_verdict, 'PASS');
  assert.equal(question.substantive_correct.zh, true);
  assert.equal(question.substantive_correct.en, true);
  assert.equal(question.complete_for_prompt.zh, true);
  assert.equal(question.complete_for_prompt.en, true);
  assert.equal(question.bilingual_equivalent, true);
  if (Number(question.exercise) >= 3) {
    assert.equal(question.required_definition_evidence, 'COMPLETE');
  }
}
const recovered = [
  {
    exercise: '1',
    status: 'PASS',
    action: 'Recovered missing definition binding only; FIRST substantive solution and candidate review reused unchanged.',
    independent_solution_pointer: '/inventory/0',
    candidate_answer_pointer: '/answers/0/displayAnswer',
    candidate_line: 14,
    definition_refs: ['p0252#2', 'p0252#3', 'p0252#5'],
    source_binding_assessment: {
      all_physical_laws_same_form_in_every_inertial_frame: 'Supported by both approved templates at p0252#3.',
      no_privileged_inertial_frame: 'Supported by both approved templates at p0252#2.',
      vacuum_light_speed_same_in_all_inertial_frames: 'Supported by both approved templates at p0252#5.',
      independence_from_source_or_observer_motion: 'Both approved templates explicitly state source/receiver independence at p0252#5; observer in the candidate is the light receiver.',
      conclusion: 'Both unchanged FIRST Q1 candidates and the pre-candidate frozen independent solution are supported by the approved current bilingual n94 TEXT.'
    },
    required_definition_evidence: 'COMPLETE'
  },
  {
    exercise: '2',
    status: 'PASS',
    action: 'Recovered missing definition binding only; FIRST substantive solution and candidate review reused unchanged.',
    independent_solution_pointer: '/inventory/1',
    candidate_answer_pointer: '/answers/1/displayAnswer',
    candidate_line: 24,
    definition_refs: ['p0252#2', 'p0252#3', 'p0252#4'],
    source_binding_assessment: {
      mechanics_only_to_all_physical_laws: 'Both approved templates at p0252#4 explicitly extend the classical mechanical relativity principle to all physical processes.',
      electromagnetic_processes_included: 'Explicitly supported in both approved templates at p0252#2 and p0252#4.',
      inertial_frame_qualification: 'Explicitly retained in both approved templates at p0252#3 and p0252#4.',
      conclusion: 'Both unchanged FIRST Q2 candidates and the pre-candidate frozen independent scope distinction are supported by the approved current bilingual n94 TEXT.'
    },
    required_definition_evidence: 'COMPLETE'
  }
];
const usage = {
  content_revision_rounds: 0,
  candidate_edits: 0,
  independent_derivation_replays: 0,
  FIRST_content_review_replays: 0,
  Q3_Q8_review_replays: 0,
  n94_TEXT_review_replays: 0,
  image_calls: 0,
  image_reads: 0,
  paid_calls: 0,
  native_calls: 0,
  db_calls: 0,
  app_calls: 0,
  chat_calls: 0,
  publication_calls: 0
};
const report = {
  schema: 'd1231/n98-q1q2-definition-binding-recovery@1',
  ticket: 'STEMROBIN-181',
  batch: 'D037',
  lesson: 'phy10-c2-s4-n98',
  edition: 'modern-us-neutral',
  status: 'PASS',
  verdict: 'PASS',
  stage: 'Q1-Q2 definition-binding-only recovery of FIRST independent review',
  recorded_at: new Date().toISOString(),
  cwd: root,
  exclusive_write_root: output,
  summary: 'The authorized approved bilingual n94 TEXT exactly matches the caller-supplied hashes and its FIRST independent TEXT PASS receipt. It supplies the missing Q1/Q2 definition binding. Unchanged FIRST Q1/Q2 substantive PASS and FIRST Q3-Q8 PASS are reused without content-review replay. All eight bilingual standards now have complete source-bound review evidence.',
  resolution: {
    finding_id: 'N98-FIRST-INPUT-1',
    status: 'RESOLVED',
    cause: 'Caller supplied the wrong canonical n94 path, not an answer-content defect.',
    resolved_by: 'Direct human authorization of the exact approved current bilingual n94 TEXT templates.',
    affected_exercises: ['1', '2'],
    candidate_revision_required: false,
    n94_promotion_required: false,
    original_failure_retained_unchanged: true
  },
  original_FIRST: {
    ...oldReportBinding,
    original_verdict: 'FAIL',
    original_content_verdict: 'PASS',
    overwritten_or_rewritten: false,
    independent_inventory: oldReport.independence.inventory,
    independent_solutions: oldReport.independence.solutions,
    freeze_seal: oldReport.independence.freeze_seal,
    frozen_before_candidate_access: true,
    directory_files_unchanged: originalBindings,
    directory_hashes_checked_before_and_after_recovery: true
  },
  authorized_n94_definitions: definitions,
  n94_TEXT_approval_receipt: {
    ...approvalBinding,
    status: approval.status,
    card: approval.card,
    candidate_hashes_checked: true,
    inspection_scope: 'PASS status and exact template path/SHA256 bindings only; no full n94 TEXT review replay.',
    completeCard: approval.completeCard
  },
  n94_definition_excerpts: excerpts,
  recovered_definition_bindings: recovered,
  candidates: candidateBindings,
  candidate_file_hash_proves_all_eight_bilingual_answers_unchanged: true,
  question_source_bindings: questionSourceBindings,
  reused_FIRST_Q3_Q8_PASS: {
    report: oldReportBinding,
    exercises: ['3', '4', '5', '6', '7', '8'],
    status: 'PASS',
    action: 'REUSED_NOT_REVIEWED_AGAIN',
    source_pointers: ['/questions/2', '/questions/3', '/questions/4', '/questions/5', '/questions/6', '/questions/7'],
    review_replays: 0,
    all_candidate_hashes_unchanged: true,
    original_source_definition_hashes_retained_by_reference: '/input_bindings in original_FIRST report'
  },
  combined_questions: oldReport.questions.map((question, index) => ({
    exercise: question.exercise,
    status: 'PASS',
    substantive_correct: question.substantive_correct,
    complete_for_prompt: question.complete_for_prompt,
    bilingual_equivalent: question.bilingual_equivalent,
    source: 'derived',
    grading: 'ungraded',
    required_definition_evidence: 'COMPLETE',
    content_review: 'REUSED_FIRST_PASS_NO_REPLAY',
    binding_action: index < 2 ? 'MISSING_N94_BINDING_RECOVERED' : 'REUSED_FIRST_COMPLETE_BINDING',
    FIRST_report_pointer: `/questions/${index}`
  })),
  findings: [],
  scope: {
    n94_card_status: 'portrait-HOLD retained per direct caller instruction',
    n94_promoted: false,
    portraits_or_figures_inspected: false,
    choices_approved: false,
    figures_approved: false,
    rendered_display_approved: false,
    complete_card_approved: false,
    native_finalize: 'NOT_RUN; author-owned pending workflow',
    publication: 'NOT_RUN_NOT_AUTHORIZED',
    other_edits: false,
    other_chats: false,
    original_d1225_artifacts_unchanged: true
  },
  usage,
  recovery_tool: {
    path: fileURLToPath(import.meta.url),
    sha256: hash(read(fileURLToPath(import.meta.url))),
    kind: 'Local read/hash binding utility; not a native lesson/answer pipeline execution.'
  }
};
for (const previous of originalBindings) bind(previous.path, previous.sha256);
for (const candidate of candidateBindings) bind(candidate.path, candidate.sha256);
for (const definition of definitions) bind(definition.path, definition.sha256);
bind(approvalBinding.path, approvalBinding.sha256);
assert.deepEqual(fs.readdirSync(oldRoot).sort(), Object.keys(oldHashes).sort());
const reportPath = path.join(output, 'report.json');
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  status: report.status,
  report: { path: reportPath, sha256: hash(read(reportPath)) },
  recovered_exercises: ['1', '2'],
  reused_FIRST_PASS_exercises: ['3', '4', '5', '6', '7', '8'],
  all_eight_bilingual_candidate_hashes_unchanged: true,
  original_failure_unchanged: true,
  n94_portrait_HOLD_retained: true,
  usage
}, null, 2));
