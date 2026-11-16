import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const tmp = '.intentfold/tickets/STEMROBIN-181/tmp';
const proof = `${tmp}/source-review-9p-0204-0207-correction-proof`;
const digest = value => createHash('sha256').update(value).digest('hex');
const verified = new Map();
async function bind(relative, expected) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(path.join(root, relative))) hash.update(chunk);
  const sha256 = hash.digest('hex');
  if (expected) assert.equal(sha256, expected, `SHA changed: ${relative}`);
  verified.set(relative, sha256);
  return { path: relative, sha256 };
}
const read = relative => readFile(path.join(root, relative));
const json = async relative => JSON.parse((await read(relative)).toString('utf8'));
const reviewBinding = await bind(`${tmp}/source-review-9p-0204-0207.json`,
  '018cc5c7e5c4db55312a23862b0d4da3e860e2936f458af7667118b8ea7961df');
const freezeBinding = await bind(`${tmp}/9p-next-source-0204-0207/author-freeze.json`,
  '0cefcbb06e96ef22eee2c130d59cf752da54604722fefbf977664dd94c00effa');
const correctionBinding = await bind(`${tmp}/9p-next-source-0204-0207-correction-1/author-correction-freeze.json`,
  'e24e12971dabe48e147a5bafc7c3aed336f689453f9e80e90026fffa8713343b');
const review = await json(reviewBinding.path);
const freeze = await json(freezeBinding.path);
const correction = await json(correctionBinding.path);
assert.equal(review.status, 'needs-correction');
assert.equal(review.completion, 'partial');
assert.deepEqual(correction.originalFreeze, freezeBinding);
assert.deepEqual(correction.independentReview, reviewBinding);
assert.equal(review.freeze.sha256, freezeBinding.sha256);
await bind(correction.preservedFreeze.path, freezeBinding.sha256);
await bind(correction.preservedReview.path, reviewBinding.sha256);
await bind(correction.helper.path, correction.helper.sha256);
assert.deepEqual(review.pages.map(page => page.pdf_page), [204, 205, 206, 207]);
assert.deepEqual(correction.pages.map(page => page.pdf_page), [204, 205, 206, 207]);
for (const binding of [review.pdf, review.toc, freeze.manifest, freeze.profile,
  freeze.lesson_skill, freeze.image_rules, freeze.incoming_context.snapshot]) {
  await bind(binding.path, binding.sha256);
}
assert.deepEqual(review.pdf, freeze.pdf);
assert.deepEqual(review.toc, freeze.toc);
const counterBinding = await bind(review.configured_counter_proof.path,
  review.configured_counter_proof.sha256);
const counter = await json(counterBinding.path);
assert.deepEqual(counter.freeze, freezeBinding);
assert.equal(counter.configured_counter_calls_total, 2);
assert.equal(counter.baseline_counter_calls_this_review, 0);
assert.equal(counter.parameter_sweeps, 0);
assert.equal(counter.top_margin_probes, 0);
assert.equal(counter.image_outputs, 0);
await bind(counter.helper.path, counter.helper.sha256);
assert.deepEqual(counter.native_tools, freeze.tools);
for (const binding of Object.values(counter.native_tools)) await bind(binding.path, binding.sha256);
assert.deepEqual(counter.pages.map(page => page.pdf_page), [204, 206]);

function frontmatter(bytes) {
  const text = bytes.toString('utf8');
  assert.ok(Buffer.from(text).equals(bytes), 'UTF-8 roundtrip');
  assert.ok(text.startsWith('---\n'));
  const end = text.indexOf('\n---\n', 4);
  assert.ok(end > 4);
  return { text, end, meta: JSON.parse(text.slice(4, end)), body: Buffer.from(text.slice(end)) };
}

const pageResults = [];
const nativeInput = [];
const acceptedRows = [17, 23, 24, 21];
for (const [index, page] of review.pages.entries()) {
  const frozen = freeze.pages.find(item => item.pdf_page === page.pdf_page);
  const changed = correction.pages[index];
  assert.deepEqual(page.draft, frozen.draft);
  assert.deepEqual(page.source, frozen.source);
  assert.deepEqual(changed.original, page.draft);
  assert.deepEqual(changed.source, page.source);
  assert.deepEqual(changed.authorizedCorrections, page.authorized_corrections);
  assert.equal(page.source_text_status, 'pass');
  assert.equal(page.independent_rows, acceptedRows[index]);
  assert.equal(changed.approvedIndependentRows, page.independent_rows);
  await bind(page.source.path, page.source.sha256);
  await bind(changed.original.path, changed.original.sha256);
  await bind(changed.before.path, changed.original.sha256);
  await bind(changed.corrected.path, changed.corrected.sha256);
  const originalBytes = await read(changed.original.path);
  const beforeBytes = await read(changed.before.path);
  const afterBytes = await read(changed.corrected.path);
  assert.ok(originalBytes.equals(beforeBytes));
  const before = frontmatter(beforeBytes);
  const after = frontmatter(afterBytes);
  assert.ok(before.body.equals(after.body), `Body changed on ${page.pdf_page}`);
  assert.equal(before.meta.render.sha256, page.source.sha256);
  assert.equal(before.meta.page, page.pdf_page);
  assert.equal(before.meta.printed_page, page.printed_page);
  assert.equal(before.meta.source.pdf_sha256, review.pdf.sha256);
  assert.equal(before.meta.profile.sha256, freeze.profile.sha256);
  let provenance;
  let delta = null;
  if ([204, 206].includes(page.pdf_page)) {
    assert.equal(page.authorized_corrections.length, 1);
    const authorization = page.authorized_corrections[0];
    assert.equal(authorization.kind, 'counting-metadata-only');
    assert.equal(authorization.field, 'frontmatter.counting');
    assert.equal(authorization.before, 'absent');
    assert.equal(authorization.bound_draft_sha256, page.draft.sha256);
    assert.equal(authorization.bound_source_sha256, page.source.sha256);
    assert.deepEqual(Object.keys(authorization.value).sort(), ['edge_margin_px', 'reason']);
    assert.equal(authorization.value.edge_margin_px, 120);
    assert.ok(!Object.hasOwn(before.meta, 'counting'));
    assert.deepEqual(after.meta.counting, authorization.value);
    const revertedMeta = { ...after.meta };
    delete revertedMeta.counting;
    assert.deepEqual(revertedMeta, before.meta);
    const oldTail = '  "errata": []\n}\n---\n';
    const newTail = `  "errata": [],\n  "counting": ${JSON.stringify(authorization.value, null, 2).replaceAll('\n', '\n  ')}\n}\n---\n`;
    assert.equal(before.text.split(oldTail).length, 2);
    assert.equal(after.text.split(newTail).length, 2);
    assert.ok(Buffer.from(before.text.replace(oldTail, newTail)).equals(afterBytes));
    assert.ok(Buffer.from(after.text.replace(newTail, oldTail)).equals(originalBytes));
    const probe = counter.pages.find(item => item.pdf_page === page.pdf_page);
    assert.deepEqual(probe.source, page.source);
    assert.deepEqual(probe.draft, page.draft);
    assert.deepEqual(probe.figure_masked_counting_copy, frozen.figure_masked_counting_copy);
    await bind(probe.figure_masked_counting_copy.path, probe.figure_masked_counting_copy.sha256);
    assert.deepEqual(probe.configured_probe.config, after.meta.counting);
    assert.equal(probe.configured_probe.entrypoint, 'p2c._counting_line_bands');
    assert.equal(probe.configured_probe.calls_this_review, 1);
    assert.equal(probe.configured_probe.excluded_top_rows, 0);
    assert.equal(probe.configured_probe.count, page.independent_rows);
    assert.equal(probe.draft_printed_rows, page.independent_rows);
    assert.equal(probe.independent_physical_rows_including_footer, page.independent_rows);
    assert.equal(probe.configured_probe.bands.length, page.independent_rows);
    assert.deepEqual(probe.configured_probe.excluded_x_half_open, [[0, 120], [1384, 1504]]);
    assert.equal(probe.configured_probe.matches_independent_physical_rows, true);
    assert.deepEqual(probe.baseline.bands, frozen.native_bands);
    assert.equal(probe.baseline.count, page.counting.frozen_native_default_rows);
    assert.equal(probe.baseline.count, frozen.native_count);
    assert.ok(probe.configured_probe.bands.some(band =>
      JSON.stringify(band) === JSON.stringify(page.counting.preserved_footer_band_y)));
    if (page.pdf_page === 206) {
      for (const band of page.counting.preserved_equation_8_44_bands_y) {
        assert.ok(probe.configured_probe.bands.some(item => JSON.stringify(item) === JSON.stringify(band)));
      }
    }
    nativeInput.push({
      pdf_page: page.pdf_page, before: before.text, after: after.text,
      authorized_counting: authorization.value,
    });
    delta = {
      operation: 'add-only-frontmatter.counting',
      authorized_fields: authorization.allowed_fields,
      exact_authorized_value: authorization.value,
      all_other_metadata_equal: true,
      byte_exact_reversal_recovers_original_draft: true,
      removed_or_added_source_rows_or_wrap_markers: 0,
    };
    provenance = {
      kind: 'reused-bound-original-independent-reviewer-configured-probe',
      proof: counterBinding, helper: counter.helper, native_tools: counter.native_tools,
      original_draft: probe.draft, source: probe.source,
      figure_masked_counting_copy: probe.figure_masked_counting_copy,
      entrypoint: probe.configured_probe.entrypoint,
      config: probe.configured_probe.config,
      accepted_count: probe.configured_probe.count,
      bands: probe.configured_probe.bands,
      frozen_default_count: probe.baseline.count,
      footer_preserved: true,
      equation_8_44_bands_preserved: page.pdf_page === 206,
      new_counter_calls: 0,
    };
  } else {
    assert.equal(page.authorized_corrections.length, 0);
    assert.ok(afterBytes.equals(originalBytes), `Unchanged page ${page.pdf_page} changed`);
    assert.deepEqual(after.meta, before.meta);
    assert.ok(!Object.hasOwn(after.meta, 'counting'));
    assert.equal(frozen.native_count, page.independent_rows);
    assert.equal(page.counting.frozen_native_default_rows, page.independent_rows);
    await bind(frozen.figure_masked_counting_copy.path, frozen.figure_masked_counting_copy.sha256);
    provenance = {
      kind: 'reused-frozen-native-default-with-original-independent-row-approval',
      original_freeze: freezeBinding, original_review: reviewBinding,
      original_draft: page.draft, source: page.source,
      figure_masked_counting_copy: frozen.figure_masked_counting_copy,
      accepted_count: frozen.native_count, bands: frozen.native_bands,
      new_counter_calls: 0,
    };
  }
  pageResults.push({
    pdf_page: page.pdf_page, printed_page: page.printed_page,
    source: page.source, original_draft: changed.original, preserved_before: changed.before,
    corrected_draft: changed.corrected, original_draft_untouched: true,
    source_body_bytes_sha256: digest(before.body), source_body_byte_identical: true,
    inherited_source_text_status: page.source_text_status, no_new_source_text_review: true,
    delta, whole_draft_unchanged: delta === null,
    accepted_rows_including_footer: page.independent_rows,
    native_count_provenance: provenance,
  });
}

const figureResults = [];
for (const figure of review.figures) {
  const frozen = freeze.pages.flatMap(page => page.figures).find(item => item.id === figure.id);
  const changed = correction.figures.find(item => item.id === figure.id);
  assert.deepEqual(figure.candidate, frozen.candidate);
  assert.deepEqual(changed.candidate, figure.candidate);
  assert.equal(changed.unchanged, true);
  await bind(figure.candidate.path, figure.candidate.sha256);
  const sourceBinding = figure.id === 'fig-160' ? figure.binding : figure;
  assert.equal(frozen.block, sourceBinding.source_ref);
  assert.deepEqual(frozen.rough_box, sourceBinding.rough_box_xywh);
  assert.deepEqual(frozen.snapped_box, sourceBinding.frozen_snapped_box_xywh);
  assert.deepEqual(frozen.exact_source_extraction_box_xywh,
    sourceBinding.frozen_exact_extraction_box_xywh);
  assert.equal(frozen.padding_px, sourceBinding.padding_px);
  if (figure.id === 'fig-160') {
    assert.equal(figure.status, 'pending');
    assert.equal(figure.actually_opened_candidate, false);
    assert.equal(figure.source_inventory_status, 'independently-observed-on-the-single-original207-page-load');
    assert.equal(figure.binding.freeze_sha256, freezeBinding.sha256);
    assert.deepEqual(figure.binding.source, review.pages[3].source);
    assert.deepEqual(figure.binding.draft, review.pages[3].draft);
    assert.equal(figure.binding.source_ref, 'p0207#9');
    assert.equal(figure.binding.caption_ref, 'p0207#10');
    assert.equal(figure.binding.owner, 'phy9-c2-s2-n84');
    assert.equal(figure.binding.owner_object, 'original worked example1');
    assert.deepEqual(figure.binding.frozen_exact_extraction_box_xywh, [966, 1050, 271, 552]);
    assert.deepEqual(figure.binding.candidate_dimensions_px_from_frozen_rectangle, [271, 552]);
    const bytes = await read(figure.candidate.path);
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(bytes.subarray(12, 16).toString('ascii'), 'IHDR');
    assert.deepEqual([bytes.readUInt32BE(16), bytes.readUInt32BE(20)], [271, 552]);
    assert.equal(figure.candidate.sha256,
      '555f7da22a2e1eb566f4d19b583dbc3ef503757865a6492027d8055b31e9f634');
  } else {
    assert.equal(figure.status, 'pass');
    assert.equal(figure.actually_opened_candidate, true);
  }
  figureResults.push({
    id: figure.id, candidate: figure.candidate, candidate_unchanged: true,
    source_ref: sourceBinding.source_ref, caption_ref: sourceBinding.caption_ref,
    owner: sourceBinding.owner, rough_box_xywh: sourceBinding.rough_box_xywh,
    frozen_snapped_box_xywh: sourceBinding.frozen_snapped_box_xywh,
    padding_px: sourceBinding.padding_px,
    frozen_exact_extraction_box_xywh: sourceBinding.frozen_exact_extraction_box_xywh,
    approval_basis: figure.id === 'fig-160' ? 'actual-candidate-visual-gate-pending'
      : 'inherited-original-independent-SOURCE-crop-review',
    image_opened_this_task: false,
  });
}

const nativeHelper = await bind(`${proof}/native-delta.py`);
const python = path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
// This is the only native invocation; the helper imports blocks, not image or pipeline tools.
const native = spawnSync(python, ['-B', path.join(root, nativeHelper.path)], {
  cwd: root, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  input: JSON.stringify({
    module: path.join(root, counter.native_tools['blocks.py'].path),
    pages: nativeInput,
  }), encoding: 'utf8', maxBuffer: 1024 * 1024,
});
assert.equal(native.status, 0, native.stderr || native.error?.message);
const structural = JSON.parse(native.stdout);
assert.equal(structural.invocations, 1);
assert.equal(structural.parse_calls, 4);
assert.equal(structural.native_counting_calls, 0);
assert.equal(structural.printed_lines_calls, 0);
for (const page of structural.pages) {
  assert.equal(page.native_block_count, freeze.pages.find(item => item.pdf_page === page.pdf_page).blocks);
}
const self = await bind(path.relative(root, fileURLToPath(import.meta.url)));
const result = {
  schema: 'STEMROBIN-181/source-affected-only-delta-proof@1',
  ticket: 'STEMROBIN-181', batch: 'D021-source-preparation',
  date: '2026-11-16', workspace: root,
  status: 'pass', scope: 'exact-204-206-counting-metadata-deltas-and-frozen-binding-preservation',
  original_partial_gate: {
    ...reviewBinding, original_status: review.status, original_completion: review.completion,
    preserved_binding: correction.preservedReview, gate_record_untouched: true,
  },
  original_author_freeze: freezeBinding,
  correction_freeze: correctionBinding,
  preserved_author_freeze: correction.preservedFreeze,
  ordered_text_manifest_binding: review.freeze.ordered_text_manifest_sha256,
  configured_counter_proof: counterBinding,
  helpers: { verify_delta: self, native_delta: nativeHelper },
  native_structure: structural, pages: pageResults, figures: figureResults,
  verified_files: [...verified].map(([path, sha256]) => ({ path, sha256 })),
  limits: {
    native_structural_invocations: 1, native_parse_calls: 4,
    counting_reruns: 0, parameter_sweeps: 0, native_pipeline_runs: 0,
    image_opens: 0, image_decodes: 0, image_writes: 0,
    original_or_corrected_draft_writes: 0, source_writes: 0,
    SCI: false, promotion: false, browser: false, DB: false, Git: false,
  },
};
await mkdir(path.join(root, proof), { recursive: true });
const output = `${proof}/delta-proof.json`;
await writeFile(path.join(root, output), `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  status: result.status, proof: await bind(output),
  pages: pageResults.map(page => ({
    pdf_page: page.pdf_page, corrected_sha256: page.corrected_draft.sha256,
    source_body_byte_identical: page.source_body_byte_identical,
    byte_reversible: page.delta?.byte_exact_reversal_recovers_original_draft ?? true,
    accepted_rows: page.accepted_rows_including_footer,
  })),
  native_structural_invocations: 1, counting_reruns: 0,
  crop160_sha_verified: true, crop160_opens: 0,
}, null, 2));
