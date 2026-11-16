import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const helperPath = fileURLToPath(import.meta.url);
const tmp = dirname(helperPath);
const root = resolve(tmp, '../../../..');
assert.equal(root, '/Users/yong/.codex/worktrees/00b1/lemmadeck');
const prefix = '.intentfold/tickets/STEMROBIN-181/tmp/';
const reportPath = `${prefix}source-review-9p-0208-0211-correction.json`;
const proofPath = `${prefix}source-review-9p-0208-0211-correction-proof.json`;
for (const path of [reportPath, proofPath]) {
  assert.ok(!existsSync(resolve(root, path)), `Write-once output already exists: ${path}`);
}
const initialGate = {
  path: `${prefix}source-review-9p-0208-0211.json`,
  sha256: '32b9fda4bbf03ce5ec5ceb726aad839a8feeddc0a1a2fff31ecbd9be3f6d8a3a',
};
const originalFreeze = {
  path: `${prefix}9p-next-source-0208-0211/author-freeze.json`,
  sha256: '242f28dd4e675c1a6abbfcbdc6c091bd46f58b2f7e38a59f7e29d80f3ce56f47',
};
const correctionFreeze = {
  path: `${prefix}9p-next-source-0208-0211-correction-1/author-correction-freeze.json`,
  sha256: '1bd11d70b2976c1bd2da409aa915ad6ba64f49dc0f16d30e270c71b8f50ef68d',
};
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const consumed = new Map();
function bound(binding) {
  assert.equal(typeof binding.path, 'string');
  assert.match(binding.sha256, /^[a-f0-9]{64}$/);
  const bytes = readFileSync(resolve(root, binding.path));
  assert.equal(sha(bytes), binding.sha256, `Binding changed: ${binding.path}`);
  if (consumed.has(binding.path)) assert.equal(consumed.get(binding.path), binding.sha256);
  consumed.set(binding.path, binding.sha256);
  return bytes;
}
const boundJson = binding => JSON.parse(bound(binding).toString('utf8'));
function consume(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') bound(value);
  for (const item of Object.values(value)) consume(item);
}
function unchanged() {
  for (const [path, sha256] of consumed) bound({ path, sha256 });
}
function splitPage(bytes) {
  const text = bytes.toString('utf8');
  assert.ok(Buffer.from(text).equals(bytes), 'UTF-8 round trip must preserve all bytes');
  assert.ok(text.startsWith('---\n'));
  const end = text.indexOf('\n---\n', 4);
  assert.ok(end > 4);
  return {
    text,
    metadata: JSON.parse(text.slice(4, end)),
    metadataBytes: bytes.subarray(4, Buffer.byteLength(text.slice(0, end))),
    body: Buffer.from(text.slice(end)),
  };
}
function replaceOnce(text, from, to) {
  assert.equal(text.split(from).length, 2, 'Authorized byte insertion must occur exactly once');
  return text.replace(from, to);
}

const initial = boundJson(initialGate);
const frozen = boundJson(originalFreeze);
const corrected = boundJson(correctionFreeze);
const originalProof = boundJson(initial.proof);
consume(frozen);
consume(corrected);
consume(originalProof);
for (const [path, sha256] of Object.entries(originalProof.binding_sha256)) bound({ path, sha256 });
assert.equal(initial.status, 'needs-correction');
assert.equal(initial.reviewer, 'D021');
assert.equal(initial.book, '9p');
assert.deepEqual(initial.freeze.path, originalFreeze.path);
assert.equal(initial.freeze.sha256, originalFreeze.sha256);
assert.deepEqual(corrected.originalFreeze, originalFreeze);
assert.deepEqual(corrected.independentReview, initialGate);
assert.ok(bound(corrected.preservedFreeze).equals(bound(originalFreeze)));
assert.ok(bound(corrected.preservedReview).equals(bound(initialGate)));
assert.deepEqual(corrected.configuredCounterProof, initial.configured_counter_proof);
assert.equal(initial.configured_counter_proof.status, 'pass');
assert.equal(initial.configured_counter_proof.fixed_edge_margin_px, 90);
assert.equal(initial.configured_counter_proof.top_margin_used, false);
assert.equal(initial.configured_counter_proof.parameter_sweep, false);
assert.equal(originalProof.probes_match, true);
assert.deepEqual(originalProof.freeze, originalFreeze);
assert.deepEqual(initial.required_corrections.map(item => item.pdf_page), [208, 210]);
assert.deepEqual(originalProof.configured_counter_probes.map(item => item.pdf_page), [208, 210]);
const pageNumbers = [208, 209, 210, 211];
const independentRows = [25, 29, 19, 24];
for (const list of [initial.pages, frozen.pages, corrected.pages, originalProof.pages]) {
  assert.deepEqual(list.map(item => item.pdf_page), pageNumbers);
}
const pages = [];
const pageProof = [];
const parserPayload = [];
const inheritedProbes = [];
for (const [index, number] of pageNumbers.entries()) {
  const reviewed = initial.pages[index];
  const author = frozen.pages[index];
  const item = corrected.pages[index];
  const inherited = originalProof.pages[index];
  const correction = initial.required_corrections.find(entry => entry.pdf_page === number);
  assert.deepEqual(author.draft, reviewed.draft);
  assert.deepEqual(inherited.draft, reviewed.draft);
  assert.deepEqual(item.original, reviewed.draft);
  assert.deepEqual(item.source, reviewed.source);
  assert.deepEqual(author.source, reviewed.source);
  assert.equal(reviewed.source_fidelity_status, 'pass');
  assert.equal(reviewed.independent_printed_rows_including_footer, independentRows[index]);
  assert.equal(inherited.printed_rows, independentRows[index]);
  assert.equal(inherited.flags_and_source_lines_match_frozen_bindings, true);
  assert.equal(item.approvedIndependentRows, independentRows[index]);
  const originalBytes = bound(reviewed.draft);
  const beforeBytes = bound(item.before);
  const afterBytes = bound(item.corrected);
  assert.ok(originalBytes.equals(beforeBytes), `Preserved original bytes on ${number}`);
  const before = splitPage(beforeBytes);
  const after = splitPage(afterBytes);
  assert.equal(before.metadata.page, number);
  assert.ok(before.body.equals(after.body), `All source body bytes on ${number}`);
  let reversed = after.text;
  let delta = {};
  let addedBytes = 0;
  let probe = null;
  if (correction) {
    assert.equal(correction.kind, 'frontmatter-counting-metadata-only');
    assert.equal(correction.bound_draft_sha256, reviewed.draft.sha256);
    assert.deepEqual(item.authorizedCorrection, correction);
    assert.deepEqual(Object.keys(correction.authorized_metadata), ['counting']);
    delta = correction.authorized_metadata;
    assert.deepEqual(Object.keys(delta.counting).sort(), ['edge_margin_px', 'reason']);
    assert.equal(delta.counting.edge_margin_px, 90);
    assert.equal(typeof delta.counting.reason, 'string');
    assert.ok(!Object.hasOwn(before.metadata, 'counting'));
    assert.deepEqual(after.metadata, { ...before.metadata, ...delta });
    const oldTail = '  "errata": []\n}\n---\n';
    const newTail = `  "errata": [],\n  "counting": ${JSON.stringify(delta.counting, null, 2).replaceAll('\n', '\n  ')}\n}\n---\n`;
    assert.ok(Buffer.from(replaceOnce(before.text, oldTail, newTail)).equals(afterBytes));
    reversed = replaceOnce(after.text, newTail, oldTail);
    addedBytes = Buffer.byteLength(newTail) - Buffer.byteLength(oldTail);
    probe = originalProof.configured_counter_probes.find(entry => entry.pdf_page === number);
    assert.deepEqual(probe.configured_counting, delta.counting);
    assert.equal(probe.calls_this_review, 1);
    assert.equal(probe.native_count, independentRows[index]);
    assert.equal(probe.independent_expected_rows, independentRows[index]);
    assert.equal(probe.matches_independent_rows, true);
    assert.equal(probe.extra_below_footer_band_absent, true);
    assert.deepEqual(probe.figure_masks_xywh, author.figures.map(figure => figure.snapped_box));
    inheritedProbes.push({
      pdf_page: number,
      independent_rows: independentRows[index],
      native_rows: probe.native_count,
      counting: delta.counting,
      inherited_from: initial.proof,
      pointer: `configured_counter_probes[pdf_page=${number}]`,
      original_probe_calls: 1,
      current_probe_calls: 0,
      rerun: false,
    });
    parserPayload.push({ pdf_page: number, before: before.text, after: after.text, counting: delta.counting });
  } else {
    assert.equal(item.authorizedCorrection, null);
    assert.ok(afterBytes.equals(originalBytes), `Whole-file identity on ${number}`);
    assert.ok(before.metadataBytes.equals(after.metadataBytes));
    assert.deepEqual(after.metadata, before.metadata);
  }
  assert.ok(Buffer.from(reversed).equals(originalBytes), `Exact byte reversal on ${number}`);
  assert.equal(sha(Buffer.from(reversed)), reviewed.draft.sha256);
  const { count_status_for_unmodified_draft, count_status, ...sourcePage } = reviewed;
  pages.push({
    ...sourcePage,
    status: 'pass',
    draft: item.corrected,
    original_draft: reviewed.draft,
    independent_rows: independentRows[index],
    independent_rows_basis: 'Inherited bound unique D021 SOURCE gate; no image open or recount.',
    original_count_status: count_status_for_unmodified_draft ?? count_status,
    count_status: 'pass: exact approved metadata and unchanged body; original native evidence inherited.',
    exact_metadata_delta: delta,
    whole_file_byte_identical: !correction,
    full_file_byte_reversal_restores_original: true,
    reversed_sha256: sha(Buffer.from(reversed)),
    other_metadata_body_rowbreaks_labels_math_flags_and_roughboxes_unchanged: true,
    configured_probe_inherited: Boolean(probe),
  });
  pageProof.push({
    pdf_page: number,
    original: reviewed.draft,
    preserved: item.before,
    corrected: item.corrected,
    independent_rows_inherited: independentRows[index],
    body_sha256_before: sha(before.body),
    body_sha256_after: sha(after.body),
    exact_metadata_delta: delta,
    added_byte_count: addedBytes,
    forward_bytes_match_current_corrected_file: true,
    reverse_bytes_match_original_and_preserved_file: true,
    reversed_sha256: sha(Buffer.from(reversed)),
    whole_file_byte_identical: !correction,
    counting_reason_matches_bound_gate_exactly: correction ? true : null,
  });
}
assert.deepEqual(parserPayload.map(item => item.pdf_page), [208, 210]);
assert.deepEqual(initial.figures.map(item => item.id), ['fig-161', 'fig-162', 'fig-163', 'fig-164']);
assert.deepEqual(corrected.figures.map(item => item.id), initial.figures.map(item => item.id));
const figures = initial.figures.map((figure, index) => {
  const item = corrected.figures[index];
  const pixelProof = originalProof.figures.find(entry => entry.id === figure.id);
  const author = frozen.pages.flatMap(page => page.figures).find(entry => entry.id === figure.id);
  assert.ok(['pass', 'pass-with-explicit-inventory-uncertainty'].includes(figure.status));
  assert.equal(initial.summary.source_crops_and_no_leakage,
    'pass with explicit overlapping-vector count uncertainty');
  assert.equal(figure.exact_source_pixel_equality, true);
  assert.equal(figure.different_channel_values, 0);
  assert.equal(item.unchanged, true);
  assert.deepEqual(item.candidate, figure.candidate);
  assert.deepEqual(author.candidate, figure.candidate);
  assert.deepEqual(pixelProof.candidate, figure.candidate);
  bound(figure.candidate);
  assert.equal(pixelProof.exact_source_pixel_equality, true);
  assert.equal(pixelProof.different_channel_values, 0);
  for (const key of ['source_ref', 'rough_box_xywh', 'snapped_box_xywh', 'padding_px',
    'exact_source_extraction_box_xywh']) {
    assert.deepEqual(pixelProof[key], figure[key]);
  }
  assert.deepEqual(author.rough_box, figure.rough_box_xywh);
  assert.deepEqual(author.snapped_box, figure.snapped_box_xywh);
  assert.deepEqual(author.exact_source_extraction_box_xywh, figure.exact_source_extraction_box_xywh);
  assert.equal(author.padding_px, figure.padding_px);
  return {
    ...figure,
    status: 'pass',
    original_gate_status: figure.status,
    initial_gate: initialGate,
    inherited_pixel_proof: initial.proof,
    candidate_bytes_unchanged: true,
    original_SOURCE_crop_approval_inherited: true,
    uncertainty_retained_without_new_semantic_endorsement: true,
    image_opens_this_review: 0,
    raster_decodes_this_review: 0,
  };
});
const helper = { path: relative(root, helperPath), sha256: sha(readFileSync(helperPath)) };
bound(helper);
unchanged();

// One native parser invocation compares only the two affected pages; no raster/counter imports.
const parserOutput = execFileSync(resolve(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), [
  '-B', '-c', `
import hashlib, json, sys
sys.dont_write_bytecode = True
sys.path.insert(0, sys.argv[1])
import blocks
results = []
for item in json.load(sys.stdin):
    before_meta, before_blocks = blocks.parse(item["before"])
    after_meta, after_blocks = blocks.parse(item["after"])
    assert "counting" not in before_meta
    assert after_meta.pop("counting") == item["counting"]
    assert after_meta == before_meta
    assert before_blocks == after_blocks
    canonical = json.dumps(before_blocks, ensure_ascii=True, sort_keys=True, separators=(",", ":"))
    results.append({
        "pdf_page": item["pdf_page"],
        "native_parse_calls": 2,
        "parsed_block_count": len(before_blocks),
        "all_parsed_fields_equal": True,
        "parsed_blocks_sha256_before_and_after": hashlib.sha256(canonical.encode()).hexdigest(),
        "fields_compared": ["kind", "label", "box", "owner_exercise", "cont", "open", "samerow", "lines"]
    })
print(json.dumps({"status": "pass", "invocations": 1, "parse_calls": 4, "pages": results}))
`, resolve(root, '.claude/skills/ld-s10y-lesson/tools'),
], {
  input: JSON.stringify(parserPayload),
  encoding: 'utf8',
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  maxBuffer: 1024 * 1024,
});
const parser = JSON.parse(parserOutput);
assert.equal(parser.status, 'pass');
assert.equal(parser.invocations, 1);
assert.equal(parser.parse_calls, 4);
assert.deepEqual(parser.pages.map(item => item.pdf_page), [208, 210]);
unchanged();
const limits = {
  images_loaded: 0,
  image_payloads: 0,
  visual_opens: 0,
  raster_decodes: 0,
  source_or_candidate_reopens: 0,
  binary_sha256_reads_only_for_image_bindings: true,
  current_native_counter_calls: 0,
  counter_or_configured_probe_reruns: 0,
  native_parser_invocations: 1,
  native_parse_calls: 4,
  native_parser_purpose: 'Affected-page metadata and complete parsed-block delta equality only.',
  prepare_finalize_assemble_vectorize_rerender_runs: 0,
  system_browser_db_git_backend_or_promotion_actions: 0,
  durable_or_unowned_writes: 0,
  source_draft_candidate_freeze_or_original_gate_edits: 0,
  glyph_or_math_changes: 0,
  new_answers_solved: 0,
  SOURCE_science_endorsement: false,
  SCI_approval: false,
  in_flight_processes: [],
};
const proof = {
  schema: 'STEMROBIN-181/source-correction-proof@1',
  ticket: 'STEMROBIN-181',
  reviewer: 'D021',
  date: '2026-11-16',
  status: 'pass',
  binding: {
    initial_gate: initialGate,
    original_author_freeze: originalFreeze,
    correction_freeze: correctionFreeze,
    original_proof: initial.proof,
    helper,
  },
  original_status_preserved: 'needs-correction',
  original_gate_and_freezes_untouched: true,
  all_consumed_bindings_verified_before_and_after: true,
  consumed_files: [...consumed].map(([path, sha256]) => ({ path, sha256 })),
  pages: pageProof,
  native_blocks_delta_parse: parser,
  inherited_configured_probes: inheritedProbes,
  figures: figures.map(figure => ({
    id: figure.id,
    status: figure.status,
    candidate: figure.candidate,
    original_gate_status: figure.original_gate_status,
    initial_gate: initialGate,
    inherited_pixel_proof: initial.proof,
    candidate_bytes_unchanged: true,
    original_pixel_approval_inherited_without_image_decoding: true,
  })),
  limits,
};
const proofBytes = Buffer.from(`${JSON.stringify(proof, null, 2)}\n`);
const proofBinding = { path: proofPath, sha256: sha(proofBytes) };
const report = {
  schema: 'STEMROBIN-181/source-correction-review@1',
  ticket: 'STEMROBIN-181',
  delivery: 'D021',
  reviewer: 'D021',
  book: '9p',
  role: 'unique-independent-affected-only-SOURCE-metadata-correction-review',
  date: '2026-11-16',
  workspace: root,
  status: 'pass',
  completion: 'Exact authorized 90px counting metadata on208/210 passes. All other bytes and candidates are unchanged. Original unique SOURCE content, crops and native25/19 probes are inherited, not repeated. No SCI approval.',
  scope: {
    pdf_pages: pageNumbers,
    affected_pages: [208, 210],
    whole_byte_identical_pages: [209, 211],
    owned_outputs: [reportPath, proofPath, helper.path],
    text_only: true,
    zero_images: true,
  },
  binding: {
    initial_gate: initialGate,
    original_author_freeze: originalFreeze,
    preserved_gate: corrected.preservedReview,
    preserved_author_freeze: corrected.preservedFreeze,
    correction_freeze: correctionFreeze,
    inherited_original_proof: initial.proof,
    proof: proofBinding,
    helper,
  },
  original_status_preserved: 'needs-correction',
  original_gate_and_freezes_untouched: true,
  pdf: initial.pdf,
  manifest: initial.manifest,
  toc: initial.toc,
  pages,
  figures,
  inherited_configured_probes: inheritedProbes,
  resolved_corrections: initial.required_corrections.map(correction => ({
    pdf_page: correction.pdf_page,
    kind: correction.kind,
    authorized_metadata: correction.authorized_metadata,
    corrected_draft: pages.find(page => page.pdf_page === correction.pdf_page).draft,
    status: 'pass',
    original_required_correction_applied_field_remains_false_in_preserved_gate: true,
  })),
  unresolved_corrections: [],
  boundaries: initial.boundaries,
  cards: initial.cards,
  source_units: [
    {
      number: 84,
      id: 'phy9-c2-s2-n84',
      reviewed_tail_status: 'closed-after208',
      incoming_example1_ref: 'p0208#1',
      incoming_example1_closed: true,
      example2_closed_ref: 'p0208#5',
      prior84_source_or_SCI_approval_inherited: false,
    },
    { number: 85, id: 'phy9-c2-s3-n85', status: 'closed', closes_ref: 'p0211#7' },
    {
      number: 86,
      id: 'phy9-c2-s3-n86',
      status: 'incomplete-open-to212',
      open_ref: 'p0211#13',
      outgoing_page: 212,
      outgoing_page_read_or_inferred: false,
    },
  ],
  uncertainties: initial.uncertainties,
  summary: {
    ...initial.summary,
    remaining_correction_count: 0,
    remaining_correction_kind: null,
    current_correction_image_opens: 0,
    actualopens: 0,
    original_gate_actualopens_inherited_not_repeated: initial.summary.actualopens,
    source_crops_and_no_leakage: 'pass, inherited unchanged with explicit original inventory uncertainties',
  },
  limits,
};
const reportBytes = Buffer.from(`${JSON.stringify(report, null, 2)}\n`);
unchanged();
writeFileSync(resolve(root, proofPath), proofBytes, { flag: 'wx' });
writeFileSync(resolve(root, reportPath), reportBytes, { flag: 'wx' });
unchanged();
assert.ok(readFileSync(resolve(root, proofPath)).equals(proofBytes));
assert.ok(readFileSync(resolve(root, reportPath)).equals(reportBytes));
console.log(JSON.stringify({
  path: resolve(root, reportPath),
  sha256: sha(reportBytes),
  status: report.status,
  proof: proofBinding,
  verified_binding_count: consumed.size,
  independent_rows: pages.map(page => page.independent_rows),
  inherited_figures: figures.map(figure => ({ id: figure.id, status: figure.status })),
  images_loaded: 0,
  counter_runs: 0,
  native_parser_invocations: 1,
  original_status_preserved: initial.status,
}, null, 2));
