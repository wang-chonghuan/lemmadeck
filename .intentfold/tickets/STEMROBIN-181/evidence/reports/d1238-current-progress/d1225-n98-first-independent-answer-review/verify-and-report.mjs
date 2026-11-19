import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const output = path.dirname(fileURLToPath(import.meta.url));
assert.equal(process.cwd(), root);
assert.equal(output, path.join(root, 'tmp/d1225-n98-first-independent-answer-review'));
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const readJson = filename => JSON.parse(fs.readFileSync(filename));
const hashFile = filename => {
  const bytes = fs.readFileSync(filename);
  return { path: filename, bytes: bytes.length, sha256: sha256(bytes) };
};
const inventoryPath = path.join(output, 'independent-inventory.json');
const sealPath = path.join(output, 'freeze-seal.json');
const inventory = readJson(inventoryPath);
const seal = readJson(sealPath);
const adjudicationPath = path.join(output, 'adjudication.json');
const adjudication = readJson(adjudicationPath);
for (const frozen of seal.files) {
  assert.equal(hashFile(frozen.path).sha256, frozen.sha256, `Frozen derivation changed: ${frozen.path}`);
  assert.equal(fs.statSync(frozen.path).mode & 0o222, 0);
}
const sourceChecks = inventory.inputs.map(input => {
  if (input.status === 'missing') {
    assert.equal(fs.existsSync(input.path), false, 'A missing input became available; review the affected binding before reporting.');
    return { ...input, unchanged_since_freeze: true };
  }
  assert.equal(hashFile(input.path).sha256, input.sha256, `Input changed: ${input.path}`);
  return { ...input, unchanged_since_freeze: true };
});
assert.equal(inventory.derivation.candidate_content_read_before_freeze, false);
assert.equal(inventory.derivation.candidate_author_report_read_before_freeze, false);
const candidateRoot = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1220-n98-first-readonly-answers');
const authorReportPath = path.join(candidateRoot, 'report.json');
const authorReport = readJson(authorReportPath);
const candidateBindings = [];
const authorHashChecks = [];
const questionChecks = [];
const expectedIds = Array.from({ length: 8 }, (_, index) => String(index + 1));
for (const locale of ['zh', 'en']) {
  const filename = path.join(candidateRoot, locale, 'answer-keys.json');
  const bytes = fs.readFileSync(filename);
  const candidate = JSON.parse(bytes);
  const binding = { locale, path: filename, bytes: bytes.length, sha256: sha256(bytes) };
  candidateBindings.push(binding);
  assert.equal(candidate.schema, 'ld-s10y-answer/lesson-answers@1');
  assert.equal(candidate.book, '10p');
  assert.equal(candidate.lesson, inventory.lesson);
  assert.equal(candidate.edition, 'modern-us-neutral');
  assert.equal(candidate.status, 'draft');
  assert.deepEqual(candidate.answers.map(answer => answer.exercise), expectedIds);
  const claimed = authorReport.outputs.find(item => item.locale === locale);
  assert.ok(claimed);
  assert.equal(claimed.candidate.path, filename);
  assert.equal(claimed.candidate.sha256, binding.sha256);
  const sourceBinding = sourceChecks.find(item => item.role === `questions_${locale}`);
  assert.equal(claimed.exercises.path, sourceBinding.path);
  assert.equal(claimed.exercises.sha256, sourceBinding.sha256);
  authorHashChecks.push({ locale, candidate_hash_matches: true, exercise_hash_matches: true });
  const textLines = bytes.toString('utf8').split('\n');
  candidate.answers.forEach((answer, index) => {
    const source = inventory.inventory[index];
    const decision = adjudication.questions[index];
    assert.equal(answer.exercise, source.exercise);
    assert.equal(answer.exercise, decision.exercise);
    assert.equal(answer.prompt, source.question_text[locale]);
    assert.equal(answer.grading, 'ungraded');
    assert.equal(answer.source, 'derived');
    assert.deepEqual(answer.figureEvidence, []);
    assert.deepEqual(answer.parts, []);
    assert.equal(Object.hasOwn(answer, 'bookRaw'), false);
    assert.ok(answer.displayAnswer.trim());
    assert.equal(/!\[|<img\b/i.test(answer.displayAnswer), false);
    assert.ok(textLines[decision.candidate_line - 1].trim().startsWith('"displayAnswer":'));
    assert.ok(textLines[decision.candidate_line - 1].includes(JSON.stringify(answer.displayAnswer)));
    questionChecks.push({
      locale,
      exercise: answer.exercise,
      json_pointer: `/answers/${index}/displayAnswer`,
      line: decision.candidate_line,
      prompt_matches_frozen_source: true,
      identity: {
        source_number: source.source_number,
        group_id: source.group_id,
        source_refs: source.source_refs
      },
      derived: true,
      ungraded: true,
      no_image_dependency: true,
      display_answer_nonempty: true,
      content_verdict: decision.content_verdict,
      substantive_correct: decision.substantive_correct[locale],
      complete_for_prompt: decision.complete_for_prompt[locale],
      required_definition_evidence: decision.required_definition_evidence
    });
  });
}
assert.equal(authorReport.sourceQuestionCount, 8);
assert.equal(authorReport.grading, 'ungraded');
assert.equal(authorReport.source, 'derived');
assert.equal(authorReport.oldAnswersRead, false);
assert.equal(authorReport.nativeExecutions, 0);
assert.equal(authorReport.paidCalls, 0);
assert.equal(authorReport.completeCard, false);
const almostEqual = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-12);
const gamma = beta => 1 / Math.sqrt(1 - beta * beta);
almostEqual(gamma(0.6), 1.25);
almostEqual(Math.sqrt(1 - 0.6 * 0.6), 0.8);
const pionBeta = Math.sqrt(0.99);
almostEqual(gamma(pionBeta), 10);
const pionDistance = pionBeta * 3e8 * 10 * 2.6e-8;
assert.ok(Math.abs(pionDistance - 78) < 0.4);
const lowSpeed = 0.02 / 1.0001;
assert.ok(Math.abs(lowSpeed - 0.02) < 0.000002);
const checkedAt = new Date().toISOString();
const report = {
  schema: 'd1225/n98-first-independent-answer-review@1',
  ticket: 'STEMROBIN-181',
  batch: 'D037',
  lesson: inventory.lesson,
  edition: 'modern-us-neutral',
  round: 'FIRST',
  verdict: adjudication.verdict,
  status: 'FIRST-FAIL-MISSING-CANONICAL-N94-DEFINITION-NO-SUBSTANTIVE-ANSWER-DEFECTS',
  content_verdict: adjudication.content_verdict,
  requested_definition_verification: adjudication.requested_definition_verification,
  failure_kind: adjudication.failure_kind,
  checked_at: checkedAt,
  cwd: root,
  exclusive_write_root: output,
  authorization: {
    direct_delegation: true,
    offline_only: true,
    no_publication: true,
    author_is_sole_workflow_owner: true,
    author_workflow: 'pending; not finalized by reviewer'
  },
  summary: 'Eight identities and sixteen bilingual standards are substantively correct and complete against the independently frozen solutions. The full requested source-definition gate cannot pass because canonical modern n94 is absent; this is an input-evidence failure, not a scientific error or a request to change the candidate answers.',
  independence: {
    derivation_frozen_at: inventory.frozen_at,
    derivation_frozen_before_candidate_content_or_author_report_read: true,
    inventory: hashFile(inventoryPath),
    solutions: hashFile(path.join(output, 'independent-solutions.json')),
    freeze_seal: hashFile(sealPath),
    inventory_unchanged_after_candidate_review: true,
    previous_answers_choices_interactions_used: false,
    candidate_content_review_passes: 1,
    machine_checks_are_not_native_finalize_or_semantic_proof: true
  },
  candidates: candidateBindings,
  author_report: {
    ...hashFile(authorReportPath),
    read_after_independent_freeze: true,
    status: authorReport.status,
    claimed_hash_checks: authorHashChecks
  },
  input_bindings: sourceChecks,
  source_pdf_sha256_as_declared_by_page_artifacts: '7190041b66182e5f6c5a4ef7ae0b04ee3f1afa0df1f5b3ff6317b2c2d1cb8f40',
  pdf_opened_or_rehashed: false,
  findings: adjudication.findings.map(finding => ({
    ...finding,
    definition_path: path.join(root, finding.definition_path),
    affected_candidates: candidateBindings.map(binding => ({
      locale: binding.locale,
      path: binding.path,
      sha256: binding.sha256,
      exercises: finding.exercises,
      json_pointers: finding.candidate_json_pointers,
      lines: finding.candidate_lines
    })),
    affected_question_sources: sourceChecks.filter(binding => /^questions_/.test(binding.role)),
    available_supporting_definition: sourceChecks.find(binding => binding.role === 'canonical_definition_n95')
  })),
  substantive_candidate_findings: [],
  questions: adjudication.questions,
  mechanical_checks: {
    check_run: true,
    entrypoint: hashFile(fileURLToPath(import.meta.url)),
    candidate_count: 2,
    question_identities_per_locale: expectedIds,
    source_question_count: 8,
    reviewed_standard_count: 16,
    all_derived_and_ungraded: true,
    no_book_answer_inputs: true,
    no_image_dependencies: true,
    q5_crosspage_identity: ['p0263#11', 'p0264#1'],
    frozen_inputs_unchanged: true,
    author_claimed_candidate_and_question_hashes_match: true,
    per_standard_checks: questionChecks,
    independent_numeric_sanity_checks: {
      v_over_c_0_6_gamma: gamma(0.6),
      v_over_c_0_6_longitudinal_length_ratio: Math.sqrt(1 - 0.6 * 0.6),
      pion_gamma_10_v_over_c: pionBeta,
      pion_gamma_10_lab_mean_lifetime_seconds: 10 * 2.6e-8,
      pion_gamma_10_mean_distance_meters_using_c_3e8: pionDistance,
      low_speed_v_equal_v1_equal_0_01c_result_over_c: lowSpeed
    }
  },
  scope: {
    standard_answer_substance_reviewed: true,
    native_cap2_finalize: 'NOT_RUN',
    native_cap2_gate_execution: 'NOT_RUN; author-owned',
    publication: 'NOT_AUTHORIZED_NOT_RUN',
    choices_approved: false,
    figures_approved: false,
    rendered_display_approved: false,
    complete_card_approved: false,
    candidate_files_edited: false,
    unrelated_changes_reverted: false
  },
  usage: inventory.usage,
  usage_receipt: hashFile(path.join(output, 'usage.json')),
  adjudication: hashFile(adjudicationPath)
};
const reportPath = path.join(output, 'report.json');
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  report: hashFile(reportPath),
  round: report.round,
  verdict: report.verdict,
  content_verdict: report.content_verdict,
  finding_count: report.findings.length,
  substantive_candidate_finding_count: 0,
  reviewed_standard_count: 16,
  native_finalize: 'NOT_RUN',
  publication: 'NOT_RUN',
  usage: report.usage
}, null, 2));
