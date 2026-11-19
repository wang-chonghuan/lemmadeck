import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const T = path.join(R, '.intentfold/tickets/STEMROBIN-181');
const O = path.join(T, 'tmp/d874-n87-first-independent-answer-review');
assert.equal(process.cwd(), R);
for (let p = O; p !== path.dirname(p); p = path.dirname(p)) {
  assert(!fs.lstatSync(p).isSymbolicLink(), `Symlink boundary: ${p}`);
}
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const read = p => JSON.parse(fs.readFileSync(p));
const writeNew = (name, value) => fs.writeFileSync(
  path.join(O, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' },
);
const expectedPath = path.join(O, 'expectations-FIRST.json');
const expectedBytes = fs.readFileSync(expectedPath);
assert.equal(sha(expectedBytes), '9d6fe4c68764b74234caec3f41839716a145193c345063c401e955c8aaecf3e0');
const expected = JSON.parse(expectedBytes);
const preBindingsPath = path.join(O, 'input-bindings-pre-candidate-FIRST.json');
assert.equal(sha(fs.readFileSync(preBindingsPath)), '54e40c5359327cf5e082c1fbf2223ac6411dd7a40722748f51763b790f1992cf');
const preBindings = read(preBindingsPath);
const checks = [];
function check(name, fn) {
  fn();
  checks.push({ name, result: 'PASS' });
}
const currentInputs = preBindings.inputs.map(row => {
  const bytes = fs.readFileSync(row.path);
  check(`unchanged pre-candidate input: ${row.relative_path}`, () => {
    assert.equal(sha(bytes), row.sha256);
    assert.equal(bytes.length, row.bytes);
  });
  return { ...row, final_sha256: sha(bytes), unchanged_since_binding: true };
});
const candidates = Object.fromEntries(['zh', 'en'].map(locale => {
  const p = path.join(T, `tmp/d849-n87-first-written-answer-author/candidate/${locale}/answer-keys.candidate.json`);
  const bytes = fs.readFileSync(p);
  const row = {
    locale, path: p, relative_path: path.relative(R, p),
    sha256: sha(bytes), bytes: bytes.length,
  };
  return [locale, { binding: row, document: JSON.parse(bytes) }];
}));
const candidateHashes = {
  zh: 'aaf3e864b0e7c92717119d2ec5c71f08fbcc06af1aa4b05cb065ea670d29f860',
  en: 'c0edb96139ad0f2d361433517cf308ca3ac1f32ee4b6d62d99c4004556fab3ce',
};
const hashLedgerPath = path.join(T, 'tmp/d849-n87-first-written-answer-author/output-hashes.json');
const hashLedgerBytes = fs.readFileSync(hashLedgerPath);
const hashLedger = JSON.parse(hashLedgerBytes);
check('author output hash ledger unchanged from read', () => {
  assert.equal(sha(hashLedgerBytes), '10b5681aaa27983bbc5ca9c81a762f916ab0322945b8ff472d6114ab44449c29');
});
const authorInputHashes = read(path.join(T, 'tmp/d849-n87-first-written-answer-author/input-hashes.json'));
const modern = Object.fromEntries(['zh', 'en'].map(locale => [
  locale,
  read(path.join(T, `tmp/d858-n87-text-first-repair/candidate/${locale}/exercises.template.json`)),
]));
const gradingKeys = new Set(['judge', 'expected', 'correct_index', 'correct_indices', 'accept', 'choices', 'options']);
function assertNoGradingPayload(value) {
  if (Array.isArray(value)) {
    value.forEach(assertNoGradingPayload);
  } else if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) {
      assert(!gradingKeys.has(key), `Unexpected judging/choice field: ${key}`);
      assertNoGradingPayload(entry);
    }
  }
}
for (const locale of ['zh', 'en']) {
  const { document, binding } = candidates[locale];
  check(`${locale}: candidate exact FIRST hash and author-ledger binding`, () => {
    assert.equal(binding.sha256, candidateHashes[locale]);
    assert.equal(hashLedger.outputs.find(row => row.path === `candidate/${locale}/answer-keys.candidate.json`).sha256, binding.sha256);
  });
  check(`${locale}: header, lesson-local six-ID coverage and unique standards`, () => {
    assert.equal(document.schema, 'ld-s10y-answer/lesson-answers@1');
    assert.equal(document.book, '10p');
    assert.equal(document.lesson, expected.card);
    assert.equal(document.edition, 'modern-us-neutral');
    assert.equal(document.status, 'draft');
    assert.deepEqual(document.answers.map(answer => answer.exercise), expected.questions.map(q => q.exercise));
    assert.equal(new Set(document.answers.map(answer => answer.exercise)).size, 6);
  });
  check(`${locale}: d858 exercise bytes equal author's original bound exercise`, () => {
    const modernInput = currentInputs.find(row => row.relative_path.includes(`d858-n87-text-first-repair/candidate/${locale}/exercises`));
    const originalAuthorPath = `.intentfold/tickets/STEMROBIN-181/tmp/d837-n87-first-bilingual-text-author/candidate/${locale}/exercises.template.json`;
    assert.equal(modernInput.sha256, authorInputHashes.inputs.find(row => row.path === originalAuthorPath).sha256);
  });
  check(`${locale}: no judging, choice or book-answer payload`, () => {
    assertNoGradingPayload(document);
    for (const answer of document.answers) {
      assert(!Object.hasOwn(answer, 'bookRaw'));
    }
  });
  document.answers.forEach((answer, i) => {
    check(`${locale}/Q${i + 1}: prompt identity, complete derived/ungraded standard and zero image need`, () => {
      assert.equal(answer.exercise, expected.questions[i].exercise);
      assert.equal(answer.prompt, modern[locale].exercises[i].text);
      assert.equal(answer.grading, 'ungraded');
      assert.equal(answer.source, 'derived');
      assert.equal(typeof answer.displayAnswer, 'string');
      assert(answer.displayAnswer.trim().length > 0);
      assert.deepEqual(answer.parts, []);
      assert.deepEqual(answer.figureEvidence, []);
      assert.deepEqual(answer.historical_entities, []);
    });
  });
}
check('source unit relationships, without assigning a testing wavelength', () => {
  const nmPerCm = 1e7;
  assert.equal(5.5e-5 * nmPerCm, 550);
  assert.equal(550 / 10, 55);
  assert.equal(1e-6 * nmPerCm, 10);
  assert.notEqual(55, 10);
});
const assessmentPath = path.join(O, 'assessment-FIRST.json');
const assessmentBytes = fs.readFileSync(assessmentPath);
const assessment = JSON.parse(assessmentBytes);
check('manual FIRST assessment covers the same six independent IDs and both locales', () => {
  assert.equal(assessment.review_pass, 'FIRST');
  assert.equal(assessment.overall_verdict, 'PASS');
  assert.deepEqual(assessment.actionable_findings, []);
  assert.deepEqual(assessment.per_question.map(q => q.exercise), expected.questions.map(q => q.exercise));
  assessment.per_question.forEach((q, i) => {
    assert.equal(q.scoped_identity, expected.questions[i].scoped_identity);
    assert.deepEqual(q.source_refs, expected.questions[i].source_refs);
    assert.equal(q.independent_solution_pointer, expected.questions[i].independent_solution_pointer);
    assert.equal(q.verdict, 'PASS');
    assert.equal(q.zh_verdict, 'PASS');
    assert.equal(q.en_verdict, 'PASS');
    assert.equal(q.bilingual_equivalence, 'PASS');
    assert.equal(q.standard_complete, true);
    assert.deepEqual(q.hold_reasons, []);
  });
});
const bound = p => {
  const row = currentInputs.find(entry => entry.path === p);
  assert(row, `Unbound input: ${p}`);
  return { path: p, sha256: row.sha256, bytes: row.bytes };
};
const independentBinding = bound(expected.independent_source.path);
const sourceExerciseBinding = bound(path.join(T, 'tmp/d836-source233-consume-n87-prepare/root/10p/lessons/phy10-c2-s3-n87/exercises.json'));
const sourceLessonBinding = bound(path.join(T, 'tmp/d836-source233-consume-n87-prepare/root/10p/lessons/phy10-c2-s3-n87/lesson.json'));
const sourceRequirementBinding = bound(path.join(T, 'tmp/d836-source233-consume-n87-prepare/n87-preauthor-source-requirements.json'));
const frozenAt = new Date().toISOString();
const report = {
  ...assessment,
  status: 'FIRST-PASS-FROZEN',
  frozen_at_utc: frozenAt,
  R, T, write_root: O,
  expected_snapshot: {
    path: expectedPath, sha256: sha(expectedBytes),
    frozen_at_utc: expected.frozen_at_utc,
    before_first_candidate_content_read: true,
  },
  exact_input_bindings: {
    independent_source: independentBinding,
    raw_source_exercises: sourceExerciseBinding,
    raw_source_lesson: sourceLessonBinding,
    raw_source_requirements: sourceRequirementBinding,
    source_identity_numbering: bound(path.join(T, 'tmp/d836-source233-consume-n87-prepare/root/10p/book.json')),
    gate2: bound(path.join(R, '.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md')),
    answer_candidates: Object.fromEntries(['zh', 'en'].map(locale => [locale, candidates[locale].binding])),
    d858_current_text: Object.fromEntries(['zh', 'en'].map(locale => [locale, {
      lesson: bound(path.join(T, `tmp/d858-n87-text-first-repair/candidate/${locale}/lesson.template.json`)),
      exercises: bound(path.join(T, `tmp/d858-n87-text-first-repair/candidate/${locale}/exercises.template.json`)),
    }])),
    manual_assessment: { path: assessmentPath, sha256: sha(assessmentBytes) },
  },
  per_question: assessment.per_question.map((q, i) => ({
    ...q,
    independent_expectation_binding: {
      ...independentBinding,
      pointer: `/solutions/${i}`,
      snapshot: { path: expectedPath, sha256: sha(expectedBytes), pointer: `/questions/${i}` },
    },
    source_exercise_binding: { ...sourceExerciseBinding, pointer: `/exercises/${i}` },
    locale_bindings: Object.fromEntries(['zh', 'en'].map(locale => {
      const candidate = candidates[locale];
      const answer = candidate.document.answers[i];
      const exercise = modern[locale].exercises[i];
      return [locale, {
        candidate: {
          ...candidate.binding,
          pointer: `/answers/${i}`,
          displayAnswer_pointer: `/answers/${i}/displayAnswer`,
          displayAnswer_line: q.candidate_line,
          entry_json_sha256: sha(JSON.stringify(answer)),
          displayAnswer_utf8_sha256: sha(answer.displayAnswer),
        },
        modern_exercise: {
          ...bound(path.join(T, `tmp/d858-n87-text-first-repair/candidate/${locale}/exercises.template.json`)),
          pointer: `/exercises/${i}`,
          entry_json_sha256: sha(JSON.stringify(exercise)),
          prompt_utf8_sha256: sha(exercise.text),
        },
        contract: {
          exercise: answer.exercise, source: answer.source, grading: answer.grading,
          parts_count: answer.parts.length,
          displayAnswer_nonempty: true,
          prompt_exact_match: true,
          automatic_grading_payload_present: false,
        },
      }];
    })),
  })),
  summary: {
    questions: 6,
    locale_standards: 12,
    question_pass: 6,
    question_hold: 0,
    bilingual_equivalence_pass: 6,
    missing_standards: 0,
    duplicate_standards: 0,
    grading_auto_entries: 0,
    derived_ungraded_entries: 12,
  },
  independent_review_integrity: {
    author_derivations_read: false,
    author_self_solutions_used_as_expectations: false,
    author_checks_or_reports_read: false,
    author_hash_ledgers_used_only_for_provenance: true,
    prior_scientific_or_answer_review_used_as_expectations: false,
    independent_expectations_changed_after_candidate_read: false,
    candidate_repairs: 0,
    first_review_retries: 0,
  },
  images: expected.image_declaration,
  checks_not_run: ['native', 'finalize', 'MathLive', 'render', 'choice', 'DB', 'canonical/index', 'meter', 'Git', 'deploy'],
  operational_scope: {
    project_reads_root: R,
    writes_only: O,
    external_skill_read: '/Users/yong/.agents/skills/intentfold/SKILL.md',
    existing_other_files_preserved: true,
    other_chats_contacted: 0,
    publication_or_choice_approval: false,
    stop_after_hash_verification: true,
  },
  hash_semantics: {
    file_sha256: 'Exact on-disk file bytes.',
    entry_json_sha256: 'UTF-8 JSON.stringify of the parsed entry, retaining parsed key order; not a raw source byte slice.',
    displayAnswer_utf8_sha256: 'Decoded displayAnswer string as UTF-8; not its escaped JSON representation.',
    freeze: 'One-shot files plus SHA-256 manifest; no chmod, filesystem immutable flag or external lock.',
  },
};
writeNew('report-FIRST.json', report);
writeNew('input-bindings-FIRST.json', {
  schema: 'STEMROBIN-181/d874-final-input-bindings-FIRST@1',
  verified_at_utc: frozenAt,
  algorithm: 'sha256',
  pre_candidate_snapshot: {
    path: preBindingsPath,
    sha256: sha(fs.readFileSync(preBindingsPath)),
    captured_at_utc: preBindings.captured_at_utc,
  },
  inputs: [
    ...currentInputs,
    ...['zh', 'en'].map(locale => ({ ...candidates[locale].binding, unchanged_from_first_read_and_author_ledger: true })),
    { path: hashLedgerPath, sha256: sha(hashLedgerBytes), bytes: hashLedgerBytes.length, unchanged_from_first_read: true },
  ],
  d858_exercise_bytes_unchanged_from_author_inputs: { zh: true, en: true },
});
writeNew('verification-FIRST.json', {
  schema: 'STEMROBIN-181/d874-verification-FIRST@1',
  status: 'PASS',
  verified_at_utc: frozenAt,
  scope: 'Read-only byte integrity, identity, coverage, ungraded payload and report completeness; scientific/bilingual verdicts are the separate manual assessment.',
  native_pipeline_invoked: false,
  checks_count: checks.length,
  checks,
  scientific_spot_check_limit: 'The unit arithmetic check is independent arithmetic, not an assignment of the coating wavelength to the source surface test.',
  input_preservation_limit: 'Scoped bound-byte checks only; no whole-worktree forensic or Git audit.',
});
writeNew('usage.json', {
  schema: 'STEMROBIN-181/d874-observed-usage-FIRST@1',
  recorded_at_utc: frozenAt,
  report_passes: 1,
  questions_reviewed: 6,
  locale_standards_reviewed: 12,
  mechanical_verification_runs: 1,
  mechanical_checks: checks.length,
  project_input_bindings: currentInputs.length + 3,
  images_loaded: 0,
  images_created: 0,
  image_batches: 0,
  image_limits: { per_batch: 8, context: 24 },
  browser_calls: 0,
  web_or_context7_calls: 0,
  additional_model_or_provider_generation_calls: 0,
  paid_external_generation_calls: 0,
  native_finalize_render_choice_calls: 0,
  database_calls: 0,
  git_commands: 0,
  deploy_calls: 0,
  other_chat_contacts: 0,
  meter_calls: 0,
  scoped_action_accounting: {
    through_planned_final_manifest_check_and_output_inventory: true,
    exec_command_calls: 35,
    multi_tool_parallel_wrappers: 8,
    apply_patch_calls: 2,
    own_node_script_invocations: 2,
    failed_exec_commands: 1,
    failure_reason: 'Readonly ls confirmed the output directory did not exist before creation; no content or review failure.',
    no_running_exec_sessions_at_completion: true,
  },
  inference_telemetry: {
    input_tokens: null,
    output_tokens: null,
    total_tokens: null,
    cost: null,
    reason: 'Not exposed by the available turn tools; no estimate or meter operation performed.',
  },
  output_root: O,
  expected_snapshot_frozen_at_utc: expected.frozen_at_utc,
  elapsed_seconds_after_expectation_snapshot: (Date.parse(frozenAt) - Date.parse(expected.frozen_at_utc)) / 1000,
  elapsed_scope: 'From pre-candidate expectation freeze to report freeze, not total session time.',
});
// Recheck the scoped inputs before creating the one-shot integrity manifest.
for (const row of currentInputs) assert.equal(sha(fs.readFileSync(row.path)), row.sha256);
for (const locale of ['zh', 'en']) {
  assert.equal(sha(fs.readFileSync(candidates[locale].binding.path)), candidateHashes[locale]);
}
assert.equal(sha(fs.readFileSync(hashLedgerPath)), sha(hashLedgerBytes));
const entries = fs.readdirSync(O, { withFileTypes: true });
assert(entries.every(entry => entry.isFile()), 'Unexpected directory, symlink or special file in report bundle');
const names = entries.map(entry => entry.name).sort();
assert(!names.includes('SHA256SUMS'), 'FIRST manifest already exists');
const manifest = names.map(name => `${sha(fs.readFileSync(path.join(O, name)))}  ${name}\n`).join('');
fs.writeFileSync(path.join(O, 'SHA256SUMS'), manifest, { flag: 'wx' });
console.log(JSON.stringify({
  status: report.status,
  questions: report.summary.questions,
  PASS: report.summary.question_pass,
  HOLD: report.summary.question_hold,
  locale_standards: report.summary.locale_standards,
  mechanical_checks: checks.length,
  bound_inputs: currentInputs.length + 3,
  report_path: path.join(O, 'report-FIRST.json'),
  report_sha256: sha(fs.readFileSync(path.join(O, 'report-FIRST.json'))),
  findings_sha256: sha(fs.readFileSync(path.join(O, 'findings-FIRST.md'))),
  input_bindings_sha256: sha(fs.readFileSync(path.join(O, 'input-bindings-FIRST.json'))),
  usage_sha256: sha(fs.readFileSync(path.join(O, 'usage.json'))),
  manifest_sha256: sha(fs.readFileSync(path.join(O, 'SHA256SUMS'))),
  manifest_entries: names.length,
  images_loaded: 0,
  images_created: 0,
}, null, 2));
