import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const tmp = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp');
const owned = path.join(tmp, 'd616-n77-r07-first-affected-text-review');
assert.equal(path.dirname(fileURLToPath(import.meta.url)), owned);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const absolute = name => path.isAbsolute(name) ? name : path.resolve(root, name);
const records = new Map();
const json = name => JSON.parse(fs.readFileSync(absolute(name), 'utf8'));
const mode = name => `0${(fs.statSync(name).mode & 0o777).toString(8).padStart(3, '0')}`;
const criterion = json(path.join(owned, 'criterion.json'));
assert.equal(mode(path.join(owned, 'criterion.json')), '0444');

function pin(name, expected, role, expectedMode = '0444') {
  const file = absolute(name);
  assert(file.startsWith(`${root}/`));
  assert(!file.startsWith(`${owned}/`));
  assert(/\.(json|mjs|md)$/.test(file), 'Text artifacts only; never read image bytes');
  assert(!fs.lstatSync(file).isSymbolicLink(), 'Do not follow an input symlink');
  const bytes = fs.readFileSync(file);
  const actualMode = mode(file);
  assert.equal(sha(bytes), expected, `Input SHA mismatch: ${file}`);
  if (expectedMode) assert.equal(actualMode, expectedMode, `Input mode mismatch: ${file}`);
  const prior = records.get(file);
  if (prior) {
    assert.equal(prior.sha256, expected);
    if (!prior.roles.includes(role)) prior.roles.push(role);
  } else {
    records.set(file, { path: file, sha256: expected, bytes: bytes.length, mode: actualMode, roles: [role] });
  }
  return bytes;
}

const firstDir = path.join(tmp, 'd608-n77-first-independent-text-review');
const repairDir = path.join(tmp, 'd615-n77-r07-first-text-repair');
const authorDir = path.join(tmp, 'd607-n77-first-bilingual-text-author');
for (const [file, expected] of [
  [path.join(firstDir, 'report.json'), 'e819a49e2431c08d4065baa7cd7d03d8612f283ee353489d72058ac1423c809a'],
  [path.join(firstDir, 'review-freeze.json'), '66e03a5a480079783c952772542987ba8d5704c2af178c4baaf8d6faf8e1249b'],
  [path.join(repairDir, 'report.json'), '4e30570a036639c6bedf53db39557a0d5203623fdad3b3604879fb8e7fbf7f06'],
  [path.join(repairDir, 'author-freeze.json'), '090dbfd86d4a535dc7a7c9a6acd853d7093aa0414832087f19884c0e159be360']
]) pin(file, expected, 'human-supplied-pin');

for (const item of json(path.join(firstDir, 'review-freeze.json')).files) {
  const bytes = pin(item.path, item.sha256, 'original-review-freeze');
  assert.equal(bytes.length, item.bytes);
  assert.equal(mode(absolute(item.path)), item.mode);
}
const first = json(path.join(firstDir, 'report.json'));
const firstBindings = json(path.join(firstDir, 'inputbindings.json'));
for (const item of firstBindings.files) {
  if (item.path.startsWith(`${tmp}/`) || item.path.includes('/artifacts/10p/pages/')) {
    const bytes = pin(item.path, item.sha256, 'original-pass-premise-byte-binding', item.mode);
    assert.equal(bytes.length, item.bytes);
  }
}
for (const manifest of [
  path.join(authorDir, 'author-freeze.json'),
  path.join(repairDir, 'author-freeze.json'),
  path.join(tmp, 'd605-n77-first-bilingual-text-author/failure-freeze.json')
]) {
  for (const item of json(manifest).files) pin(item.path, item.sha256, 'frozen-manifest-file');
}

assert.equal(first.SCI, 'PASS-TEXT-ONLY');
assert.equal(first.ZHEN, 'FAIL-EXACT-NUMERIC-REFERENCE-PRESERVATION');
assert.equal(first.requirements.length, 13);
const originalR07 = first.requirements.find(item => item.id === criterion.requirement);
assert(originalR07);
const unchanged = first.requirements.filter(item => item.id !== criterion.requirement);
assert.equal(unchanged.length, 12);
for (const locale of ['zh', 'en']) {
  assert.equal(originalR07.ZHEN[locale].status, 'FAIL');
  for (const req of first.requirements) assert.equal(req.SCI[locale].status, 'PASS');
  for (const req of unchanged) assert.equal(req.ZHEN[locale].status, 'PASS');
}
assert.deepEqual(first.blocking_list.map(item => item.id).sort(), originalR07.blockers.slice().sort());
assert.equal(first.retained_history.historical_SOURCE204205_JOIN.status, 'HOLD');
const repair = json(path.join(repairDir, 'report.json'));
assert.equal(repair.repairNumber, 1);
assert.equal(repair.repairsAllowedAfterThis, 0);
assert.equal(repair.affectedRequirement, criterion.requirement);
assert.equal(repair.deltas.length, 2);

function differences(a, b, pointer = '') {
  if (Object.is(a, b)) return [];
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return [pointer];
  if (Array.isArray(a) !== Array.isArray(b)) return [pointer];
  const keysA = Object.keys(a), keysB = Object.keys(b);
  if (JSON.stringify(keysA) !== JSON.stringify(keysB)) return [pointer];
  return keysA.flatMap(key => differences(a[key], b[key], `${pointer}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`));
}
const math = text => [...text.matchAll(/\$\$[\s\S]*?\$\$|\$[^$]*\$/g)].map(match => match[0]);
const refs = text => [...text.matchAll(/[\uff08(](6\.\d+)[\uff09)]/g)].map(match => match[1]);
const encoded = text => Buffer.from(JSON.stringify(text).slice(1, -1));
const source = json(path.join(authorDir, 'source/lesson.json')).prose[2];
assert.deepEqual(source.source_refs, [criterion.source_ref]);
assert.deepEqual(math(source.text), criterion.expected_math_spans);
assert.deepEqual(refs(source.text), criterion.expected_formula_references);
const baselineR07 = json(path.join(tmp, 'd595-n77-source205-requirement-extension/report.json')).requirements[0];
assert.equal(baselineR07.id, criterion.requirement);
const deltaEvidence = [], affectedEvidence = [];

for (const allowed of criterion.allowed_deltas) {
  const locale = allowed.locale;
  const repairDelta = repair.deltas.find(item => item.locale === locale);
  assert.equal(repairDelta.pointer, allowed.pointer);
  assert.equal(repairDelta.old, allowed.old_clause);
  assert.equal(repairDelta.replacement, allowed.new_clause);
  assert.equal(allowed.old_clause.replace(allowed.anchor, allowed.anchor + allowed.insertion), allowed.new_clause);
  const oldPath = path.join(authorDir, `candidate/${locale}/lesson.template.json`);
  const newPath = path.join(repairDir, `candidate/${locale}/lesson.template.json`);
  assert.equal(absolute(repairDelta.original.path), oldPath);
  assert.equal(absolute(repairDelta.candidate.path), newPath);
  const oldBytes = pin(oldPath, repairDelta.original.sha256, 'original-candidate');
  const newBytes = pin(newPath, repairDelta.candidate.sha256, 'sole-repair-candidate');
  const oldLesson = JSON.parse(oldBytes), newLesson = JSON.parse(newBytes);
  assert.deepEqual(differences(oldLesson, newLesson), [allowed.pointer]);
  const oldText = oldLesson.prose[2].text, newText = newLesson.prose[2].text;
  assert.equal(oldText.split(allowed.old_clause).length, 2);
  assert.equal(newText, oldText.replace(allowed.old_clause, allowed.new_clause));
  const from = encoded(allowed.old_clause), to = encoded(allowed.new_clause);
  const byteStart = oldBytes.indexOf(from);
  assert(byteStart >= 0);
  assert.equal(oldBytes.indexOf(from, byteStart + 1), -1);
  const prefix = oldBytes.subarray(0, byteStart), suffix = oldBytes.subarray(byteStart + from.length);
  assert.deepEqual(newBytes, Buffer.concat([prefix, to, suffix]));
  assert.deepEqual(newBytes.subarray(0, byteStart), prefix);
  assert.deepEqual(newBytes.subarray(byteStart + to.length), suffix);
  assert.deepEqual(newLesson.prose[2].source_refs, source.source_refs);
  assert.equal(newLesson.prose[2].source_text, source.text);
  assert.deepEqual(math(oldText), math(source.text));
  assert.deepEqual(math(newText), math(source.text));
  assert.deepEqual(refs(oldText), ['6.17', '6.18']);
  assert.deepEqual(refs(newText), criterion.expected_formula_references);
  assert.equal(math(newText).filter(item => item === '$\\frac{1}{|d|}$').length, 2);

  deltaEvidence.push({
    locale, pointer: allowed.pointer,
    original: records.get(oldPath), repaired: records.get(newPath),
    sole_json_difference: [allowed.pointer],
    old_clause: allowed.old_clause, new_clause: allowed.new_clause, insertion: allowed.insertion,
    exact_serialized_replacement_equals_entire_new_file: true,
    unchanged_file_prefix: { bytes: prefix.length, sha256: sha(prefix) },
    unchanged_file_suffix: { bytes: suffix.length, sha256: sha(suffix) },
    inserted_utf8_bytes: newBytes.length - oldBytes.length,
    all_other_fields_and_bytes_unchanged: true,
    unchanged_requirements: unchanged.map(item => item.id),
    unchanged_original_exercises_and_figure_json: 'Hash-bound only; not semantically reviewed or approved here'
  });
  affectedEvidence.push({
    locale, requirement: criterion.requirement, source_ref: criterion.source_ref,
    source_path: path.join(authorDir, 'source/lesson.json'), source_pointer: criterion.source_pointer,
    candidate_path: newPath, candidate_pointer: allowed.pointer,
    full_original_R07_paragraph: source.text,
    full_old_R07_paragraph: oldText, full_repaired_R07_paragraph: newText,
    exact_changed_clause: { before: allowed.old_clause, after: allowed.new_clause },
    raw_math_spans: { original: math(source.text), old: math(oldText), repaired: math(newText) },
    raw_math_characters_order_multiplicity: 'PASS-EXACT-NO-NORMALIZATION',
    formula_references: { original: refs(source.text), old: refs(oldText), repaired: refs(newText) },
    formula_reference_order_multiplicity: 'PASS',
    ZHEN: 'PASS',
    fresh_review_scope: 'Full affected paragraph and exact changed clause, independently against original; no other requirement re-reviewed',
    linguistic_assessment: locale === 'zh'
      ? 'The inserted full-width reference immediately follows formula and unambiguously modifies its right-hand side. The complete paragraph retains the thin-lens name, signed d/f/F, stated real-positive convention without further proof, all real/virtual signs and both object reciprocals. Its final sentence retains the hypothetical forward continuation of unchanged incoming converging rays and denial of an actual light source. No clause or meaning is displaced by the insertion.'
      : 'The inserted of (6.17) is grammatical and attaches directly to right-hand side, explicitly restoring the original diverging-lens equation reference. Independently read against the original, the whole paragraph retains the thin-lens name, signed d/f/F, convention stated without further proof, all real/virtual signs and both object reciprocals. The virtual-object sentence remains a hypothetical forward continuation in incident directions without lens alteration, not backward actual propagation or a luminous source. No meaning is changed by the insertion.',
    contextual_assessment: 'The third reference identifies the same (6.17) already named at the paragraph opening; it does not renumber a formula or alter the existing negative reciprocal. Paragraph-internal converging/diverging contrast and following image/object clauses remain coherent. External model/derivation context is byte-bound to the original passed candidate, not freshly reassessed.',
    SCI: 'ORIGINAL-PASS-REUSED-NOT-FRESHLY-ASSESSED',
    old_blocker_addressed_only_for_bound_repaired_candidate: originalR07.blockers.find(id => id.includes(`-${locale.toUpperCase()}-`))
  });
}

for (const item of records.values()) {
  assert.equal(sha(fs.readFileSync(item.path)), item.sha256);
  assert.equal(mode(item.path), item.mode);
}
const checkedAt = new Date().toISOString();
function write(name, value) {
  const file = path.join(owned, name);
  assert.equal(path.dirname(file), owned);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o444 });
}
write('inputbindings.json', {
  schema: 'STEMROBIN-181/n77-r07-affected-inputbindings@1',
  checked_at: checkedAt, supplied_pin_count: 4, supplied_pins_match: true,
  criterion_sha256: sha(fs.readFileSync(path.join(owned, 'criterion.json'))),
  files: [...records.values()], frozen_manifest_files_verified: true,
  original_pass_premises_byte_bound: true,
  original_requirements_semantically_reassessed: false,
  source_whole_file_hash_only_except_R07: true,
  input_hashes_and_modes_rechecked_before_outputs: true,
  global_concurrent_workspace_status_claimed: false
});
write('delta-binding.json', {
  schema: 'STEMROBIN-181/n77-r07-affected-delta-binding@1',
  checked_at: checkedAt, criterion: 'criterion.json',
  allowed_delta_count: 2, verified_delta_count: 2, deltas: deltaEvidence,
  source_and_original_passes_byte_bound: true, extra_delta_count: 0
});
write('affected-evidence.json', {
  schema: 'STEMROBIN-181/n77-r07-first-affected-evidence@1',
  checked_at: checkedAt, criterion: 'criterion.json',
  original_requirement: baselineR07,
  independent_original: 'Standalone d607/source/lesson.json, not candidate source_text or embedded source.data',
  assessments: affectedEvidence,
  new_SCI_assessments: 0, image_opens: 0, image_byte_reads: 0
});
const effectiveRequirements = first.requirements.map(req => {
  if (req.id !== criterion.requirement) return structuredClone(req);
  return {
    ...structuredClone(req),
    ZHEN: Object.fromEntries(affectedEvidence.map(item => [item.locale, {
      status: item.ZHEN, evidence: item.linguistic_assessment,
      provenance: 'FIRST-AFFECTED-ONLY', artifact: 'affected-evidence.json'
    }])),
    blockers: [],
    SCI_provenance: 'Unchanged d608 PASS values reused; no fresh science approval'
  };
});
const report = {
  schema: 'STEMROBIN-181/n77-r07-first-affected-text-review@1',
  ticket: criterion.ticket, batch: criterion.batch, review_id: criterion.review_id,
  card: criterion.card, owned_root: owned,
  status: 'PASS-FIRST-AFFECTED-R07-ZHEN-TEXT-ONLY',
  TEXT: 'PASS-TEXT-ONLY', ZHEN: 'PASS', SCI: 'PASS-TEXT-ONLY',
  SCI_provenance: 'D608-EXISTING-PASS-REUSED-NOT-FRESH-SCI-PASS',
  FIG: 'NOT-ASSESSED', DISPLAY: 'NOT-RUN', completeCard: false,
  affected_requirement: criterion.requirement,
  input_binding_artifact: 'inputbindings.json', criterion_artifact: 'criterion.json',
  delta_binding_artifact: 'delta-binding.json', affected_evidence_artifact: 'affected-evidence.json',
  effective_pass_composition: {
    condition: 'Both fresh R07 ZHEN PASS judgments AND exact allowed delta binding AND unchanged original ZHEN passes and SCI premises byte-bound',
    condition_satisfied: true, fresh_ZHEN_requirements: [criterion.requirement],
    fresh_ZHEN_per_language: { zh: 1, en: 1 },
    reused_ZHEN_requirements: unchanged.map(item => item.id),
    reused_ZHEN_per_language: { zh: 12, en: 12 },
    reused_SCI_per_language: { zh: 13, en: 13 }, fresh_SCI_per_language: { zh: 0, en: 0 },
    first_review: records.get(path.join(firstDir, 'report.json')),
    first_review_freeze: records.get(path.join(firstDir, 'review-freeze.json')),
    sole_repair: records.get(path.join(repairDir, 'report.json')),
    sole_repair_freeze: records.get(path.join(repairDir, 'author-freeze.json')),
    applies_only_to_repaired_candidates: repair.candidates.map(item => ({
      path: absolute(item.path), sha256: item.sha256
    }))
  },
  requirements: effectiveRequirements, blocking_list: [],
  original_first_review_preserved: {
    status: first.status, TEXT: first.TEXT, ZHEN: first.ZHEN, SCI: first.SCI,
    original_blocking_list: first.blocking_list,
    overwritten: false, erased_or_replaced: false,
    note: 'Historical first FAIL remains. Only its two localized blockers are resolved for the pinned d615 candidates by this affected review.'
  },
  retained_history: first.retained_history,
  original_conditions_retained: {
    shared_figure_text_contract: first.shared_figure_text_contract,
    original_qualifications: first.requirements.filter(item => item.qualification)
      .map(item => ({ requirement: item.id, qualification: item.qualification })),
    source204205_JOIN_HOLD_reassessed_or_closed: false,
    original_question_bilingual_answers_choices_approval_here: false,
    original_R12: 'Original-question preservation PASS reused only, not bilingual question, answer or choice approval'
  },
  repair_policy: { sole_semantic_repair: 'd615', repairNumber: 1, repairsAllowedAfterThis: 0, reviewer_repairs: 0 },
  constraints_observed: {
    imageOpens: 0, imageByteReads: 0, parentImageCount: 24, oldBudgetReset: false,
    nativeFinalizeRenderInvocations: 0, nativePipelineInvocations: 0, tests: 0,
    wholeSourceOrWholeTextReview: false, otherRequirementsFreshReview: false,
    freshScienceReview: false, answerOrChoiceApproval: false,
    authorRepairs: 0, canonicalEdits: 0, charterWrites: 0, toolOrDependencyWrites: 0,
    envReadsOrWrites: 0, DBOperations: 0, backendReadsOrWrites: 0, gitOperations: 0,
    deployOperations: 0, paidCalls: 0, newPermanentOrReplacementWorkers: 0,
    newWorktrees: 0, newBranches: 0,
    writesAndPermissionChangesConfinedToOwnedRoot: true,
    outsideBytesWritten: 0, outsideEditsPreserved: true,
    outsideWholeWorkspaceStatusNotClaimed: true
  },
  freeze_policy: {
    all_owned_files_mode: '0444', manifest: 'review-freeze.json',
    criterion_frozen_before_formal_check: true,
    input_pins_rechecked_at_freeze: true,
    self_hash: 'Manifest excludes itself; full manifest SHA-256 is returned in the final TEXT handoff'
  },
  final_disposition: 'Bounded FIRST affected-only R07 batch finished. Effective TEXT/ZHEN PASS for pinned d615 text only; original SCI PASS reused, not freshly reassessed. All old FAIL/HOLD and qualifications remain. No further author repair, FIG/DISPLAY, bilingual questions, answers/choices or whole-card approval.'
};
write('report.json', report);
for (const item of records.values()) {
  assert.equal(sha(fs.readFileSync(item.path)), item.sha256);
  assert.equal(mode(item.path), item.mode);
}
const files = fs.readdirSync(owned).map(name => {
  const file = path.join(owned, name);
  assert(fs.lstatSync(file).isFile());
  fs.chmodSync(file, 0o444);
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: sha(bytes), bytes: bytes.length, mode: mode(file) };
}).sort((a, b) => a.path.localeCompare(b.path));
write('review-freeze.json', {
  schema: 'STEMROBIN-181/n77-r07-first-affected-review-freeze@1',
  ticket: criterion.ticket, batch: criterion.batch, review_id: criterion.review_id,
  frozen_at: new Date().toISOString(),
  TEXT: report.TEXT, ZHEN: report.ZHEN, SCI: report.SCI, SCI_provenance: report.SCI_provenance,
  FIG: report.FIG, DISPLAY: report.DISPLAY, completeCard: false,
  files, all_owned_files_mode: '0444', inputs_rechecked_unchanged: true,
  writes_confined_to_owned_root: true, author_repairs: 0, image_opens: 0, image_byte_reads: 0,
  self_hash_policy: 'Manifest excludes itself; its full SHA-256 is returned externally'
});
for (const item of files) {
  assert.equal(sha(fs.readFileSync(item.path)), item.sha256);
  assert.equal(mode(item.path), '0444');
}
const freezePath = path.join(owned, 'review-freeze.json');
assert.equal(mode(freezePath), '0444');
console.log(JSON.stringify({
  TEXT: report.TEXT, ZHEN: report.ZHEN, SCI: report.SCI_provenance,
  frozen_files: files.length + 1, input_files_verified: records.size,
  artifacts: [...files, {
    path: freezePath, sha256: sha(fs.readFileSync(freezePath)),
    bytes: fs.statSync(freezePath).size, mode: mode(freezePath)
  }]
}, null, 2));
