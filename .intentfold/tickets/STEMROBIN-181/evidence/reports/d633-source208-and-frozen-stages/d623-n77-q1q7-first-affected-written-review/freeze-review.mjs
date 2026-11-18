import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const workspace = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const tmp = path.join(workspace, '.intentfold/tickets/STEMROBIN-181/tmp');
const reviewId = 'd623-n77-q1q7-first-affected-written-review';
const owned = path.join(tmp, reviewId);
assert.equal(path.dirname(fileURLToPath(import.meta.url)), owned);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const jsonBytes = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
const inputs = new Map();
const absolute = file => path.resolve(workspace, file);

function readBound(file, expected, expectedMode, expectedBytes) {
  const full = absolute(file);
  assert.ok(full.startsWith(tmp + '/'), full);
  assert.ok(!/\.(png|jpe?g|gif|webp|svg|pdf)$/i.test(full), full);
  assert.ok(!fs.lstatSync(full).isSymbolicLink(), full);
  const bytes = fs.readFileSync(full);
  const stat = fs.statSync(full);
  const digest = hash(bytes);
  if (expected) assert.equal(digest, expected, full);
  if (expectedMode) assert.equal((stat.mode & 0o777).toString(8).padStart(4, '0'), expectedMode, full);
  if (expectedBytes !== undefined) assert.equal(bytes.length, expectedBytes, full);
  if (inputs.has(full)) {
    assert.equal(digest, inputs.get(full).sha256, full);
    assert.equal(stat.mode & 0o777, inputs.get(full).permissions, full);
  }
  inputs.set(full, {
    path: full, sha256: digest, bytes: bytes.length,
    mode: (stat.mode & 0o777).toString(8).padStart(4, '0'),
    permissions: stat.mode & 0o777,
  });
  return bytes;
}

function parseBound(file, expected, mode = '0444', bytes) {
  return JSON.parse(readBound(file, expected, mode, bytes));
}

function manifest(directory, name, digest) {
  const file = path.join(tmp, directory, name);
  const value = parseBound(file, digest);
  for (const item of value.files) {
    readBound(item.path, item.sha256, '0444', item.bytes);
  }
  return value;
}

const criterion = JSON.parse(fs.readFileSync(path.join(owned, 'criterion.json')));
const judgments = JSON.parse(fs.readFileSync(path.join(owned, 'affected-judgments.json')));
assert.equal(criterion.review_id, reviewId);
assert.equal(criterion.sole_repair.further_author_repairs_allowed, 0);
const firstDir = criterion.original_review.directory;
const repairDir = criterion.sole_repair.directory;
manifest(firstDir, 'review-freeze.json', criterion.original_review.review_freeze_sha256);
manifest(repairDir, 'author-freeze.json', criterion.sole_repair.author_freeze_sha256);
const firstReport = parseBound(path.join(tmp, firstDir, 'report.json'), criterion.original_review.report_sha256);
const repairReport = parseBound(path.join(tmp, repairDir, 'report.json'), criterion.sole_repair.report_sha256);
const firstBindings = parseBound(
  path.join(tmp, firstDir, 'input-bindings.json'),
  'eb9d21300f5ff280b9757f01609f0321f9ff59a0d4fedf8b38cf11a4785cdb30',
);
const firstEvidence = parseBound(
  path.join(tmp, firstDir, 'independent-evidence.json'),
  'c9faf3f86e2238e4fc1359f8268b95d34c526dcf78d5b3a170a4f26fe12ab6c8',
);
assert.equal(firstReport.status, criterion.original_review.original_status_retained);
assert.equal(firstReport.SCI, 'FAIL');
assert.equal(firstReport.current_written_bundle_approved, false);
assert.equal(repairReport.repairNumber, 1);
assert.equal(repairReport.repairsAllowedAfterThis, 0);
assert.equal(repairReport.firstReview.sha256, criterion.original_review.report_sha256);
const firstAuthorFreezeEntry = firstBindings.input_files.find(v =>
  v.path === path.join(tmp, 'd610-n77-first-written-answer-author/author-freeze.json'));
assert.ok(firstAuthorFreezeEntry);
assert.equal(repairReport.firstAuthorFreeze.sha256, firstAuthorFreezeEntry.sha256);
manifest('d610-n77-first-written-answer-author', 'author-freeze.json', repairReport.firstAuthorFreeze.sha256);
for (const entry of firstBindings.input_files.filter(v =>
  v.path.startsWith(path.join(tmp, 'd610-n77-first-written-answer-author') + '/'))) {
  readBound(entry.path, entry.sha256, entry.mode, entry.bytes);
}

const sourceEntry = firstBindings.input_files.find(v => v.role.includes('primary task authority'));
assert.ok(sourceEntry);
const originalBytes = readBound(sourceEntry.path, sourceEntry.sha256, sourceEntry.mode, sourceEntry.bytes);
const original = JSON.parse(originalBytes);
const rawDir = path.join(tmp, 'd601-n77-first-independent-raw-solutions');
const rawFreezeEntry = firstBindings.input_files.find(v => v.path === path.join(rawDir, 'review-freeze.json'));
assert.ok(rawFreezeEntry);
manifest('d601-n77-first-independent-raw-solutions', 'review-freeze.json', rawFreezeEntry.sha256);
const rawEntry = firstBindings.input_files.find(v => v.path === path.join(rawDir, 'independent-solutions.json'));
const raw = parseBound(rawEntry.path, rawEntry.sha256, rawEntry.mode, rawEntry.bytes);
const receiptPath = path.join(tmp, 'd610-n77-first-written-answer-author/local-latex.receipt.json');
const receiptEntry = firstBindings.input_files.find(v => v.path === receiptPath);
const receipt = parseBound(receiptPath, receiptEntry.sha256);
const latexResults = JSON.parse(receipt.stdout);
assert.equal(receipt.invocations, 1);
assert.equal(receipt.exitCode, 0);
assert.equal(latexResults.length, 28);
assert.ok(latexResults.every(v => v.ok === true && v.warnings.length === 0));

function differences(left, right, pointer = '') {
  if (Object.is(left, right)) return [];
  if (left === null || right === null || typeof left !== 'object' || typeof right !== 'object') {
    return [pointer];
  }
  assert.equal(Array.isArray(left), Array.isArray(right), pointer);
  const leftKeys = Object.keys(left);
  assert.deepEqual(leftKeys, Object.keys(right), pointer);
  return leftKeys.flatMap(key => differences(left[key], right[key], pointer + '/' + key));
}

const mathSpans = text => [...text.matchAll(
  /\$\$[\s\S]*?\$\$|\$(?:\\.|[^$\\])+\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g,
)].map(v => v[0]);
const affectedIndices = [0, 6];
const untouchedIndices = [1, 2, 3, 4, 5, 7];
const localeBindings = [];
const affectedContexts = [];
let formulaCount = 0;

for (const locale of ['zh', 'en']) {
  const oldFile = path.join(tmp, 'd610-n77-first-written-answer-author', locale, 'answer-keys.candidate.json');
  const newFile = path.join(tmp, repairDir, locale, 'answer-keys.candidate.json');
  const oldBytes = readBound(oldFile);
  const newBytes = readBound(newFile);
  const before = JSON.parse(oldBytes);
  const after = JSON.parse(newBytes);
  assert.equal(before.answers.length, 8);
  assert.equal(after.answers.length, 8);
  const changedPointers = differences(before, after);
  assert.deepEqual(changedPointers, ['/answers/0/displayAnswer', '/answers/6/displayAnswer']);
  const substitutions = repairReport.deltas.filter(v => v.locale === locale);
  assert.equal(substitutions.length, 2);
  assert.deepEqual(substitutions.map(v => v.index), affectedIndices);
  let reconstructed = Buffer.from(oldBytes);
  const substitutionsEvidence = [];
  const intervals = { before: [], after: [] };

  for (const delta of substitutions) {
    assert.equal(delta.pointer, `/answers/${delta.index}/displayAnswer`);
    const oldString = before.answers[delta.index].displayAnswer;
    assert.equal(oldString.split(delta.old).length, 2, delta.pointer);
    assert.equal(oldString.replace(delta.old, delta.replacement), after.answers[delta.index].displayAnswer);
    const oldToken = Buffer.from(JSON.stringify(delta.old).slice(1, -1));
    const newToken = Buffer.from(JSON.stringify(delta.replacement).slice(1, -1));
    const oldOffset = oldBytes.indexOf(oldToken);
    const newOffset = newBytes.indexOf(newToken);
    assert.ok(oldOffset >= 0 && newOffset >= 0);
    assert.equal(oldBytes.indexOf(oldToken, oldOffset + oldToken.length), -1);
    assert.equal(newBytes.indexOf(newToken, newOffset + newToken.length), -1);
    const currentOffset = reconstructed.indexOf(oldToken);
    assert.ok(currentOffset >= 0);
    reconstructed = Buffer.concat([
      reconstructed.subarray(0, currentOffset), newToken,
      reconstructed.subarray(currentOffset + oldToken.length),
    ]);
    intervals.before.push([oldOffset, oldOffset + oldToken.length]);
    intervals.after.push([newOffset, newOffset + newToken.length]);
    substitutionsEvidence.push({
      pointer: delta.pointer, old: delta.old, replacement: delta.replacement,
      old_utf8_json_content_offset: oldOffset, new_utf8_json_content_offset: newOffset,
      old_utf8_json_content_bytes: oldToken.length, new_utf8_json_content_bytes: newToken.length,
      old_utf8_json_content_sha256: hash(oldToken), new_utf8_json_content_sha256: hash(newToken),
      exactly_one_occurrence_each: true,
    });
  }
  assert.ok(reconstructed.equals(newBytes), newFile);
  function complement(bytes, ranges) {
    const parts = [];
    let cursor = 0;
    for (const [start, end] of ranges.sort((a, b) => a[0] - b[0])) {
      assert.ok(start >= cursor);
      parts.push(bytes.subarray(cursor, start));
      cursor = end;
    }
    parts.push(bytes.subarray(cursor));
    return parts;
  }
  const oldComplement = complement(oldBytes, intervals.before);
  const newComplement = complement(newBytes, intervals.after);
  assert.equal(oldComplement.length, newComplement.length);
  const complementarySpans = oldComplement.map((bytes, index) => {
    assert.ok(bytes.equals(newComplement[index]));
    return { index, bytes: bytes.length, sha256: hash(bytes), byte_identical: true };
  });
  const oldTemplate = path.join(tmp, 'd610-n77-first-written-answer-author', locale, 'exercises.template.json');
  const newTemplate = path.join(tmp, repairDir, locale, 'exercises.template.json');
  const oldTemplateBytes = readBound(oldTemplate);
  const newTemplateBytes = readBound(newTemplate);
  assert.ok(oldTemplateBytes.equals(newTemplateBytes));
  const template = JSON.parse(newTemplateBytes);
  assert.deepEqual(template.source.data, original);
  assert.equal(template.source.sha256, sourceEntry.sha256);
  assert.equal(template.exercises.length, 8);
  const mathSequence = before.answers.map((answer, index) => {
    const oldSpans = mathSpans(answer.displayAnswer);
    const newSpans = mathSpans(after.answers[index].displayAnswer);
    assert.deepEqual(oldSpans, newSpans);
    formulaCount += oldSpans.length;
    return {
      id: `N77-Q${index + 1}`, pointer: `/answers/${index}/displayAnswer`,
      mathematical_spans: oldSpans, sequence_sha256: hash(jsonBytes(oldSpans)),
      ordered_original_sequence_unchanged: true,
    };
  });
  const untouched = untouchedIndices.map(index => {
    const id = `N77-Q${index + 1}`;
    const prior = firstReport.per_question.find(v => v.id === id);
    const priorContext = firstEvidence.per_question.find(v => v.id === id);
    assert.equal(prior.SCI, 'PASS');
    assert.equal(prior.ZHEN, 'PASS');
    assert.deepEqual(before.answers[index], after.answers[index]);
    assert.equal(before.answers[index].displayAnswer, after.answers[index].displayAnswer);
    assert.equal(hash(Buffer.from(before.answers[index].displayAnswer)),
      priorContext.locales[locale].display_answer_sha256);
    return {
      id, pointer: `/answers/${index}`,
      object_serialization_sha256: hash(jsonBytes(before.answers[index])),
      display_answer_utf8_sha256: hash(Buffer.from(before.answers[index].displayAnswer)),
      all_object_fields_unchanged: true,
      exact_byte_basis: 'Whole-file equality after only the two uniquely located permitted prose replacements; all complementary byte spans equal.',
      SCI: prior.SCI, ZHEN: prior.ZHEN,
      decision: 'INHERITED_D613_PASS_EXACT_BYTE_BOUND_NOT_REREVIEWED',
    };
  });
  for (const index of affectedIndices) {
    const id = `N77-Q${index + 1}`;
    const inherited = firstEvidence.per_question.find(v => v.id === id);
    const expected = criterion.affected.find(v => v.id === id);
    const sourceQuestion = original.exercises[index];
    assert.equal(hash(Buffer.from(sourceQuestion.text)), expected.original_question_text_sha256);
    assert.equal(sourceQuestion.text, inherited.original_question);
    assert.equal(sourceQuestion.text, raw.solutions[index].original_question);
    assert.equal(sourceQuestion.source_number, String(index + 1));
    assert.deepEqual(sourceQuestion.pages, [expected.source_ref]);
    assert.equal(sourceQuestion.group_id, 'g1');
    assert.equal(sourceQuestion.text, template.exercises[index].source_text);
    assert.equal(after.answers[index].prompt, template.exercises[index].text);
    assert.equal(after.answers[index].source_number, sourceQuestion.source_number);
    assert.deepEqual(after.answers[index].source_refs, sourceQuestion.pages);
    assert.equal(after.answers[index].grading, 'ungraded');
    assert.deepEqual(after.answers[index].parts, []);
    assert.deepEqual(after.answers[index].figureEvidence, []);
    assert.equal(before.answers[index].displayAnswer, inherited.locales[locale].displayAnswer);
    assert.equal(hash(Buffer.from(before.answers[index].displayAnswer)), inherited.locales[locale].display_answer_sha256);
    const displayLines = after.answers[index].displayAnswer.split('\n');
    assert.equal(displayLines.length, index === 0 ? 3 : 7);
    affectedContexts.push({
      id, locale, original_question: sourceQuestion,
      original_question_file: sourceEntry.path,
      original_question_pointer: `/exercises/${index}`,
      original_question_text_sha256: expected.original_question_text_sha256,
      prompt_file: newTemplate, prompt_pointer: `/exercises/${index}/text`,
      prompt: after.answers[index].prompt,
      prompt_utf8_sha256: hash(Buffer.from(after.answers[index].prompt)),
      answer_file: newFile, answer_pointer: expected.answer_pointer,
      full_answer_object: after.answers[index],
      full_display_answer: after.answers[index].displayAnswer,
      display_answer_utf8_sha256: hash(Buffer.from(after.answers[index].displayAnswer)),
      display_lines: displayLines.map((text, line) => ({ line_1based: line + 1, text })),
      d613_context_byte_binding: {
        original_author_file: oldFile, original_answer_pointer: expected.answer_pointer,
        original_display_answer_utf8_sha256: inherited.locales[locale].display_answer_sha256,
        exact_original_display_text_matches_bound_d613_evidence: true,
      },
    });
  }
  localeBindings.push({
    locale,
    original_answer_file: inputs.get(oldFile),
    repaired_answer_file: inputs.get(newFile),
    changed_pointers: changedPointers,
    substitutions: substitutionsEvidence,
    whole_repaired_file_equals_original_plus_only_permitted_substitutions: true,
    complementary_spans: complementarySpans,
    all_other_fields_metadata_sources_prompts_and_formatting_exact_bytes_unchanged: true,
    templates: {
      original_file: inputs.get(oldTemplate), repaired_file: inputs.get(newTemplate),
      entire_file_byte_identical: true,
      source_snapshot_pointer: '/source/data',
      entire_original_source_snapshot_deep_equal: true,
      exact_embedded_source_snapshot_bytes_unchanged: true,
      source_authority_file: inputs.get(sourceEntry.path),
      embedded_source_serialization_sha256: hash(jsonBytes(template.source.data)),
      all_eight_prompt_bytes_unchanged: true,
    },
    original_mathematical_span_sequence: mathSequence,
    untouched_six_answers: untouched,
  });
}

assert.equal(formulaCount, 28);
assert.equal(affectedContexts.length, 4);
assert.deepEqual(judgments.affected.map(v => v.id), ['N77-Q1', 'N77-Q7']);
for (const judgment of judgments.affected) {
  assert.equal(judgment.SCI, 'PASS');
  assert.equal(judgment.ZHEN, 'PASS');
  assert.deepEqual(judgment.blocking_findings, []);
  for (const locale of ['zh', 'en']) {
    assert.equal(judgment.locale_results[locale].SCI, 'PASS');
    assert.equal(judgment.locale_results[locale].ZHEN, 'PASS');
  }
}

const common = {
  ticket: 'STEMROBIN-181', batch: 'D033', card: 'phy10-c2-s2-n77',
  review_id: reviewId, record_date: '2026-11-18', workspace, ownership_root: owned,
};
const externalBindings = [...inputs.values()].map(({ permissions, ...entry }) => entry);
const deltaBinding = {
  schema: 'n77-q1q7-first-affected-written-delta-binding@1', ...common,
  status: 'PASS_EXACT_BYTE_BOUND_FOUR_PROSE_DELTAS_ONLY',
  original_review: { path: path.join(tmp, firstDir, 'report.json'), sha256: criterion.original_review.report_sha256 },
  original_review_freeze: { path: path.join(tmp, firstDir, 'review-freeze.json'), sha256: criterion.original_review.review_freeze_sha256 },
  sole_repair: { path: path.join(tmp, repairDir, 'report.json'), sha256: criterion.sole_repair.report_sha256 },
  sole_repair_freeze: { path: path.join(tmp, repairDir, 'author-freeze.json'), sha256: criterion.sole_repair.author_freeze_sha256 },
  external_inputs: externalBindings,
  supplied_four_hashes_and_all_referenced_freeze_files_verified: true,
  locales: localeBindings,
  mathematical_spans_unchanged: formulaCount,
  new_author_mathematical_spans: 0,
  author_KaTeX_receipt: {
    ...inputs.get(receiptPath),
    status: 'FIRST28PASS_REUSED_AUTHOR_ATTRIBUTION_ONLY',
    original_invocations: 1, original_exit_code: 0, pass_count: latexResults.length,
    every_original_formula_span_preserved: true, reviewer_reruns: 0, reviewer_native_PASS: false,
  },
  six_accepted_answers_re_reviewed: false,
  scientific_or_language_PASS_not_inferred_from_mechanical_assertions: true,
};
const affectedEvidence = {
  schema: 'n77-q1q7-first-affected-written-SCI-ZHEN-evidence@1', ...common,
  criterion_file: path.join(owned, 'criterion.json'),
  judgment_file: path.join(owned, 'affected-judgments.json'),
  immutable_d613_affected_criterion: firstEvidence.per_question.filter(v => ['N77-Q1', 'N77-Q7'].includes(v.id)),
  inherited_d613_assumptions: {
    refraction: firstEvidence.assumptions.refraction, lens: firstEvidence.assumptions.lens,
  },
  full_affected_contexts: affectedContexts,
  actual_semantic_judgments: judgments,
  RAW_comparison: {
    file: rawEntry.path, sha256: rawEntry.sha256,
    semantic_pointers_read: ['/solutions/0', '/solutions/6'],
    only_affected_entries: [raw.solutions[0], raw.solutions[6]],
    status: 'FROZEN_UNAPPROVED_NOT_AN_ORACLE',
    blanket_RAW_approval: false,
  },
  SCI: 'PASS', ZHEN: 'PASS_TEXT_ONLY',
  reviewed_question_count: 2, reviewed_locale_contexts: 4,
  other_six_fresh_semantic_reviews: 0,
  original_FAIL_and_HOLD_not_replaced: true,
  images_or_display_observed: false,
};

function recheckInputs() {
  for (const entry of [...inputs.values()]) {
    readBound(entry.path, entry.sha256, entry.mode, entry.bytes);
  }
}
recheckInputs();

function writeNew(name, value) {
  assert.ok(/^[a-zA-Z0-9-]+\.json$/.test(name));
  const file = path.join(owned, name);
  assert.equal(path.dirname(file), owned);
  fs.writeFileSync(file, jsonBytes(value), { flag: 'wx', mode: 0o444 });
  fs.chmodSync(file, 0o444);
}
function freezeExisting(name) {
  const file = path.join(owned, name);
  assert.equal(path.dirname(file), owned);
  assert.ok(fs.statSync(file).isFile());
  assert.ok(!fs.lstatSync(file).isSymbolicLink());
  fs.chmodSync(file, 0o444);
}
function artifact(name) {
  const file = path.join(owned, name);
  const bytes = fs.readFileSync(file);
  assert.equal(fs.statSync(file).mode & 0o777, 0o444);
  return { path: file, sha256: hash(bytes), bytes: bytes.length, mode: '0444' };
}

writeNew('delta-binding.json', deltaBinding);
writeNew('affected-SCI-ZHEN-evidence.json', affectedEvidence);
for (const name of ['criterion.json', 'affected-judgments.json', 'freeze-review.mjs']) freezeExisting(name);
const provenanceFiles = [
  'criterion.json', 'affected-judgments.json', 'freeze-review.mjs',
  'delta-binding.json', 'affected-SCI-ZHEN-evidence.json',
].map(artifact);
const perQuestion = firstReport.per_question.map(prior => {
  const newJudgment = judgments.affected.find(v => v.id === prior.id);
  return {
    id: prior.id, source_ref: prior.source_ref,
    SCI: newJudgment ? newJudgment.SCI : prior.SCI,
    ZHEN: newJudgment ? newJudgment.ZHEN : prior.ZHEN,
    basis: newJudgment ? 'FIRST_AFFECTED_Q1Q7_REVIEW_OF_EXACT_D622_FULL_CONTEXTS' : 'INHERITED_D613_PASS_EXACT_BYTE_BOUND_NOT_REREVIEWED',
    original_d613_SCI: prior.SCI, original_d613_ZHEN: prior.ZHEN,
    original_localized_defect_ids_retained: prior.localized_defect_ids,
    current_snapshot_blocking_defects: [],
  };
});
assert.ok(perQuestion.every(v => v.SCI === 'PASS' && v.ZHEN === 'PASS'));
assert.equal(firstReport.retained_scope_states.original_SOURCE204205_JOIN.status, 'HOLD');
const report = {
  schema: 'n77-q1q7-first-affected-written-answer-review-report@1', ...common,
  status: 'PASS_EFFECTIVE_WRITTEN_SCI_ZHEN_ONLY_EXACT_D622_BYTES',
  bounded_first_affected_only_review_finished: true,
  affected_SCI: 'PASS', affected_ZHEN: 'PASS_TEXT_ONLY',
  SCI: 'PASS', ZHEN: 'PASS_TEXT_ONLY',
  effective_written: {
    SCI: 'PASS', ZHEN: 'PASS_TEXT_ONLY',
    scope: 'Only the written display-answer bundle in the exact four frozen d622 candidate files.',
    formula: 'Two new affected-question SCI/ZHEN passes plus six unchanged d613 SCI/ZHEN passes, subject to exact-byte and original-math-sequence binding.',
    newly_reviewed_ids: ['N77-Q1', 'N77-Q7'],
    inherited_exact_byte_pass_ids: criterion.composition.untouched_pass_ids,
    original_review_replaced: false,
    repaired_candidate_reviewStatus_fields_unchanged: true,
  },
  per_question: perQuestion,
  blocking_findings: [],
  original_FAIL_retained: {
    report_file: path.join(tmp, firstDir, 'report.json'),
    report_sha256: criterion.original_review.report_sha256,
    review_freeze_sha256: criterion.original_review.review_freeze_sha256,
    status: firstReport.status, SCI: firstReport.SCI, ZHEN: firstReport.ZHEN,
    blocking_findings: firstReport.blocking_findings,
    unchanged: true, overwritten: false,
  },
  retained_scope_states_as_recorded_in_d613_not_re_reviewed: firstReport.retained_scope_states,
  original_HOLD_retained: {
    id: firstReport.retained_scope_states.original_SOURCE204205_JOIN.id,
    status: 'HOLD', cleared: false, source_join_signature_issued: false,
    standalone_conditional_written_review_only: true,
  },
  nonblocking_notes_retained_from_d613: firstReport.nonblocking_language_notes.filter(v =>
    v.id === 'N77-Q7_AUXILIARY_RAY_CLARITY'),
  RAW: 'FROZEN_UNAPPROVED_Q1Q7_CRITICAL_COMPARISON_ONLY',
  author_KaTeX: 'FIRST28PASS_REUSED_AUTHOR_ATTRIBUTION_ONLY_NO_RERUN',
  native: 'NOT_RUN_NOT_APPROVED',
  lesson_source_figures_choices_DISPLAY: 'OUT_OF_SCOPE_NO_NEW_APPROVAL',
  full_card_approved: false,
  repair_number_reviewed: 1, further_author_repairs_allowed: 0, reviewer_author_repairs: 0,
  verification: {
    supplied_full_hash_pins: 4, verified_bound_input_files: externalBindings.length,
    all_manifest_input_digests_and_modes: 'PASS',
    exact_allowed_delta_pointers_per_locale: ['/answers/0/displayAnswer', '/answers/6/displayAnswer'],
    exact_prose_substitution_count: 4,
    whole_repaired_answer_buffer_reconstruction: 'PASS_BOTH_LOCALES',
    every_complementary_byte_span: 'PASS_BOTH_LOCALES',
    all_other_answer_fields_and_whole_templates: 'PASS_EXACT_BYTES',
    original_source_snapshot_and_all_prompt_bytes: 'PASS_UNCHANGED',
    original_ordered_mathematical_span_count: 28,
    new_or_changed_author_math_spans: 0,
    full_affected_contexts_reviewed: 4,
    untouched_answer_objects_bound: 12,
    untouched_six_semantic_re_reviews: 0,
    original_d613_report_and_freeze_unchanged: true,
    original_and_repaired_author_candidates_unchanged: true,
    input_bytes_and_modes_rechecked_before_freeze: true,
    semantic_PASS_is_actual_reviewer_judgment_not_script_validation: true,
  },
  operations: {
    writes_outside_owned_root: 0, outside_permission_changes: 0,
    image_opens: 0, image_byte_reads: 0, env_reads_or_writes: 0,
    native_or_latex_reruns: 0, canonical_edits: 0, DB_access: 0,
    git_commands: 0, deploy_or_publish: 0, paid_calls: 0,
    ticket_backend_operations: 0, permanent_or_replacement_workers: 0,
    new_threads_worktrees_branches: 0, shared_branch_changed: false,
    external_search_or_pages: 0,
    scope_note: 'Offline evidence-only bounded review, not an IntentFold capability or product change. Unrelated concurrent bytes were not inspected, overwritten or reverted.',
  },
  artifacts: provenanceFiles,
  freeze: {
    required_mode: '0444', manifest: path.join(owned, 'review-freeze.json'),
    self_hash_policy: 'Manifest binds every other owned file; its own full SHA-256 is delivered in final text to avoid circular hashing.',
  },
};
writeNew('report.json', report);
recheckInputs();
const files = [...provenanceFiles, artifact('report.json')];
const freeze = {
  schema: 'n77-q1q7-first-affected-written-review-freeze@1', ...common,
  status: 'FROZEN_PASS_EFFECTIVE_WRITTEN_SCI_ZHEN_ONLY',
  files, input_bindings: artifact('delta-binding.json'),
  SCI: 'PASS', ZHEN: 'PASS_TEXT_ONLY',
  affected_question_ids: ['N77-Q1', 'N77-Q7'],
  inherited_six_exact_byte_bound_not_rereviewed: true,
  original_d613_FAIL_retained: true, original_source_join_HOLD_retained: true,
  RAW_unapproved: true, native_latex_reruns: 0, image_opens_or_reads: 0,
  native_DISPLAY_fig_source_lesson_choice_or_full_card_approval: false,
  further_author_repairs_allowed: 0, writes_outside_owned_root: 0,
  self: {
    path: path.join(owned, 'review-freeze.json'), required_mode: '0444',
    sha256: 'Excluded to avoid circular self-hashing; delivered externally in final text.',
  },
};
writeNew('review-freeze.json', freeze);
for (const entry of files) {
  assert.deepEqual(artifact(path.basename(entry.path)), entry);
}
assert.equal(fs.readdirSync(owned).length, files.length + 1);
recheckInputs();
console.log(JSON.stringify({
  status: report.status,
  report: artifact('report.json'),
  review_freeze: artifact('review-freeze.json'),
  owned_files_frozen_0444: files.length + 1,
  input_bytes_and_modes_preserved: true,
}, null, 2));
