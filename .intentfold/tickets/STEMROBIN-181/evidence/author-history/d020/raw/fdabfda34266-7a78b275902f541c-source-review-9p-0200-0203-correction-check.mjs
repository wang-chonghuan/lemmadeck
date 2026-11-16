import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const helperPath = fileURLToPath(import.meta.url);
const tmp = dirname(helperPath);
const root = resolve(tmp, "../../../..");
const correction = resolve(tmp, "9p-next-source-0200-0203-correction-1");
const output = resolve(tmp, "source-review-9p-0200-0203-correction.json");
assert.equal(process.argv[2], "--record-observed-visual-pass");
assert.equal(existsSync(output), false, "Never overwrite another review");
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const consumed = new Map();
function bound(entry) {
  const bytes = readFileSync(entry.path);
  assert.equal(sha(bytes), entry.sha256, entry.path);
  consumed.set(entry.path, entry.sha256);
  return bytes;
}
function boundJson(entry) {
  return JSON.parse(bound(entry).toString("utf8"));
}
const initialBinding = {
  path: resolve(tmp, "source-review-9p-0200-0203.json"),
  sha256: "5be67f9bbb43dcc9ab1c90bbac0e47b0f48e182fe61e5682cb20ae9f47a0cce6",
};
const correctionBinding = {
  path: resolve(correction, "author-correction-freeze.json"),
  sha256: "969d4163d7504f24c1aa4b6745c76a311a4a739dbdefb350dff5a93bde1b230f",
};
const initial = boundJson(initialBinding);
const author = boundJson(correctionBinding);
assert.equal(initial.status, "needs-correction");
assert.equal(initial.delivery, "D020");
assert.equal(author.delivery, "D020");
assert.equal(initial.book, "9p");
assert.equal(author.book, "9p");
assert.deepEqual(author.inputs.initial_review, initialBinding);
for (const entry of Object.values(author.inputs)) {
  if (entry && typeof entry === "object" && entry.path) bound(entry);
}
const proof = boundJson(initial.binding.bindings_proof);
const probe = boundJson(initial.binding.metadata_probe);
assert.deepEqual(author.existing_independent_metadata_probe_not_rerun, initial.binding.metadata_probe);
for (const entry of proof.inputs) bound(entry);
for (const entry of Object.values(author.contracts)) bound(entry);
for (const entry of Object.values(author.frozen_repo_tool_bindings)) bound(entry);
const findings = new Map(initial.findings.map((item) => [item.id, item]));
assert.deepEqual([...findings.keys()], [
  "F-text-201", "F-text-203", "F-count-200", "F-count-202", "F-crop-152",
]);
assert.deepEqual(author.findings_applied.map((item) => item.original_finding), initial.findings);
const inheritedRows = [24, 21, 25, 24];
const pages = [];
let beforeManifest = "";
let afterManifest = "";
function splitPage(bytes) {
  const text = bytes.toString("utf8");
  assert.ok(Buffer.from(text).equals(bytes));
  assert.ok(text.startsWith("---\n"));
  const separator = text.indexOf("\n---\n", 4);
  assert.ok(separator > 4);
  return {
    text,
    metadataText: text.slice(4, separator),
    metadata: JSON.parse(text.slice(4, separator)),
    body: text.slice(separator + 5),
  };
}
function replaceOnce(text, from, to) {
  assert.equal(text.split(from).length, 2, "Delta must occur exactly once");
  return text.replace(from, to);
}
for (const [index, item] of author.pages.entries()) {
  const page = 200 + index;
  assert.equal(item.pdf_page, page);
  const reviewed = initial.pages[index];
  assert.equal(reviewed.pdf_page, page);
  assert.equal(reviewed.independently_observed_rows, inheritedRows[index]);
  assert.equal(item.before.sha256, reviewed.draft_sha256);
  const beforeBytes = bound(item.before);
  assert.ok(beforeBytes.equals(bound(item.initial_draft)));
  const afterBytes = bound(item.after);
  const before = splitPage(beforeBytes);
  const after = splitPage(afterBytes);
  const metadataDelta = {};
  let expected = before.text;
  let reversed = after.text;
  if (page === 200 || page === 202) {
    Object.assign(metadataDelta, findings.get(`F-count-${page}`).allowed_metadata);
    if (page === 202) Object.assign(metadataDelta, findings.get("F-crop-152").allowed_metadata);
    for (const key of Object.keys(metadataDelta)) assert.equal(key in before.metadata, false);
    assert.deepEqual(after.metadata, { ...before.metadata, ...metadataDelta });
    const oldTail = '  "errata": []\n}';
    const addition = JSON.stringify(metadataDelta, null, 2).slice(2, -2);
    const newTail = `  "errata": [],\n${addition}\n}`;
    expected = replaceOnce(expected, oldTail, newTail);
    reversed = replaceOnce(reversed, newTail, oldTail);
    assert.equal(after.body, before.body);
    const configured = probe.probes.find((p) => p.kind === "counting-edge-only" && p.pdf_page === page);
    assert.equal(configured.runs, 1);
    assert.equal(configured.edge_margin_px, metadataDelta.counting.edge_margin_px);
    assert.equal(configured.native_proposed_metadata_rows, inheritedRows[index]);
    assert.equal(configured.status, "supported");
  } else {
    assert.equal(after.metadataText, before.metadataText);
    const finding = findings.get(`F-text-${page}`);
    expected = replaceOnce(expected, finding.draft_literal, finding.actual_source_literal);
    reversed = replaceOnce(reversed, finding.actual_source_literal, finding.draft_literal);
    const markers = [...after.body.matchAll(/<!-- ([^\n]*?) -->\n/g)];
    const blockIndex = Number(finding.ref.split("#")[1]) - 1;
    const marker = markers[blockIndex];
    const next = markers[blockIndex + 1];
    const block = after.body.slice(marker.index + marker[0].length, next.index).trimEnd();
    const inheritedBlock = proof.pages[index].block_inventory[blockIndex];
    assert.equal(inheritedBlock.ref, finding.ref);
    const expectedRow = replaceOnce(
      inheritedBlock.draft_rows_compared_with_actual_original_view[finding.row - 1],
      finding.draft_literal, finding.actual_source_literal,
    );
    assert.equal(block.split("\n")[finding.row - 1], expectedRow);
    assert.equal(marker[1], page === 201 ? "p open" : "p cont open");
    if (page === 203) assert.ok(block.endsWith("\u6b64"));
  }
  assert.ok(Buffer.from(expected).equals(afterBytes), `Full forward bytes on ${page}`);
  assert.ok(Buffer.from(reversed).equals(beforeBytes), `Full reversed bytes on ${page}`);
  assert.equal(sha(Buffer.from(reversed)), reviewed.draft_sha256);
  assert.deepEqual(item.exact_frontmatter_metadata_applied, metadataDelta);
  beforeManifest += `${String(page).padStart(4, "0")}:${sha(beforeBytes)}\n`;
  afterManifest += `${String(page).padStart(4, "0")}:${sha(afterBytes)}\n`;
  pages.push({
    pdf_page: page,
    printed_page: page - 9,
    status: "pass",
    draft: item.after,
    before: item.before,
    independent_rows: inheritedRows[index],
    independent_rows_basis: "Inherited actual source review; no recount",
    findings_resolved: reviewed.finding_ids,
    full_file_byte_reversal_restores_before: true,
    reversed_sha256: sha(Buffer.from(reversed)),
    exact_metadata_delta: metadataDelta,
    other_source_tokens_math_rowbreaks_flags_boxes_and_metadata_unchanged: true,
  });
}
assert.equal(beforeManifest, author.initial_text_freeze.manifest);
assert.equal(afterManifest, author.corrected_text_freeze.manifest);
assert.equal(sha(Buffer.from(beforeManifest)), initial.binding.text_freeze_sha256);
assert.equal(sha(Buffer.from(afterManifest)), author.corrected_text_freeze.sha256);
for (const entry of author.source_bindings_unchanged) bound(entry);
for (const item of author.preserved_candidate_bindings) {
  assert.ok(bound(item.initial).equals(bound(item.before)));
}
for (const item of author.unchanged_candidate_bindings) {
  assert.ok(bound(item.initial).equals(bound(item.after)));
  const inherited = initial.figures.find((figure) => figure.id === item.id);
  assert.equal(inherited.status, "pass");
  assert.deepEqual(item.frozen_snapped_box_xywh, inherited.frozen_snapped_box_xywh);
  for (const key of ["source_ref", "caption_ref", "owner"]) assert.equal(item[key], inherited[key]);
}
const crop = boundJson(author.corrected_152.binding_report);
const frozenCrop = { ...author.corrected_152 };
delete frozenCrop.binding_report;
assert.deepEqual(crop, frozenCrop);
const cropFinding = findings.get("F-crop-152");
assert.deepEqual(crop.source_rectangle_xywh, [771, 220, 554, 436]);
assert.deepEqual(crop.frozen_snapped_box_xywh, [777, 226, 542, 424]);
assert.deepEqual(crop.frozen_snapped_box_xywh, cropFinding.preserve_snapped_box_xywh);
assert.deepEqual(crop.source_rectangle_xywh, cropFinding.one_probe_result.proposed_source_rectangle_xywh);
assert.equal(crop.padding_px, 6);
assert.equal(crop.source_ref, "p0202#2");
assert.equal(crop.caption_ref, "p0202#3");
assert.equal(crop.owner, "phy9-c2-s2-n81");
const sourceBytes = bound(crop.source);
const cropBytes = bound(crop.output);
// Decode bound buffers in memory for equality; emit no source/old-crop image.
const pixelCheck = spawnSync(resolve(root, ".claude/skills/ld-s10y-lesson/.venv/bin/python"), [
  "-B", "-c", `
import base64, hashlib, json, sys
from PIL import ImageFile
payload = json.load(sys.stdin)
images = []
for key in ("source", "candidate"):
    parser = ImageFile.Parser()
    parser.feed(base64.b64decode(payload[key]))
    images.append(parser.close())
source, candidate = images
assert source.mode == candidate.mode == "RGB"
assert source.size == (1504, 2289)
assert candidate.size == (554, 436)
rectangle = source.crop((771, 220, 1325, 656))
assert candidate.tobytes() == rectangle.tobytes()
own_source = source.crop((777, 226, 1319, 650))
own_candidate = candidate.crop((6, 6, 548, 430))
assert own_source.tobytes() == own_candidate.tobytes()
print(json.dumps({
    "source_rectangle_xywh": [771, 220, 554, 436],
    "preserved_snapped_ownbox_xywh": [777, 226, 542, 424],
    "pixel_equal_to_exact_source_rectangle": True,
    "whole_ownbox_pixel_identical": True,
    "decoded_pixel_sha256": hashlib.sha256(candidate.tobytes()).hexdigest(),
    "image_emissions": 0,
    "old_crop_decodes": 0,
    "source_visual_reopens": 0,
    "method": "In-memory PNG buffer decoding and exact RGB equality; no source visual reopen"
}))
`,
], {
  input: JSON.stringify({
    source: sourceBytes.toString("base64"),
    candidate: cropBytes.toString("base64"),
  }),
  encoding: "utf8",
  maxBuffer: 2 * 1024 * 1024,
});
assert.equal(pixelCheck.status, 0, pixelCheck.stderr);
const pixels = JSON.parse(pixelCheck.stdout);
assert.equal(pixels.decoded_pixel_sha256, crop.decoded_pixel_sha256);
const figure152 = initial.figures[0];
assert.equal(figure152.id, "fig-152");
const visualInventory = [
  "Circular instrument rim, sloping pointer, vertical spindle, lower-left scale strokes and both rim-reflection groups complete.",
  "Instrument tripod, both elliptical upright plates, their separate stands and full feet, contacts, upper curved wire and lower curved wire complete.",
  "Full foreground quadrilateral slab outline complete; no clipped apparatus, wire, stand or slab observed.",
  "No caption fragment, prose, figure-number text or neighboring figure visible in any margin.",
  "No exact tiny tick count inferred; original pixel review and unresolved fine-stroke inventory inherited.",
];
const inheritedFigures = initial.figures.map((figure) => {
  const candidate = figure.id === "fig-152"
    ? crop.output
    : author.unchanged_candidate_bindings.find((item) => item.id === figure.id).after;
  return {
    id: figure.id,
    status: "pass",
    candidate,
    initial_review: initialBinding,
    inherited_inventory_pointer: `figures[id=${figure.id}].observations`,
    original_pixel_review_inherited: true,
    actuallyOpened: figure.id === "fig-152",
    unchanged_candidate_bytes: figure.id !== "fig-152",
    source_ref: figure.source_ref,
    caption_ref: figure.caption_ref,
    owner: figure.owner,
    frozen_snapped_box_xywh: figure.frozen_snapped_box_xywh,
    ...(figure.id === "fig-152" ? {
      correction_status: "pass",
      visual_completeness: "pass",
      caption_and_prose_leakage: "none observed",
      observations: visualInventory,
      independent_pixel_equality: pixels,
    } : {
      visual_status_basis: "Inherited passing unique initial SOURCE review and independently verified identical candidate bytes; not reopened",
    }),
  };
});
for (const [path, expected] of consumed) assert.equal(sha(readFileSync(path)), expected, path);
const report = {
  schema: "STEMROBIN-181/source-correction-review@1",
  ticket: "STEMROBIN-181",
  delivery: "D020",
  book: "9p",
  role: "independent-affected-only-source-correction-reviewer",
  date: "2026-11-16",
  status: "pass",
  scope: {
    cwd: root,
    source_only: true,
    affected_only: true,
    pdf_pages: [200, 201, 202, 203],
    owned_report: output,
    owned_helper: helperPath,
    unowned_files_modified: false,
    image_payload_returned: false,
  },
  binding: {
    initial_review: initialBinding,
    author_correction_freeze: correctionBinding,
    initial_author_freeze: author.inputs.initial_author_freeze,
    inherited_source_inventory: initial.binding.bindings_proof,
    inherited_configured_probes: initial.binding.metadata_probe,
    corrected_crop_binding: author.corrected_152.binding_report,
    initial_text_freeze_sha256: sha(Buffer.from(beforeManifest)),
    corrected_text_freeze_sha256: sha(Buffer.from(afterManifest)),
    pdf_sha256: initial.binding.pdf_sha256,
    toc_sha256: initial.binding.toc_sha256,
    profile_sha256: initial.binding.profile_sha256,
    all_consumed_bindings_verified: true,
    consumed_inputs_unchanged_before_after: true,
    consumed_files: [...consumed].map(([path, sha256]) => ({ path, sha256 })),
    helper: { path: helperPath, sha256: sha(readFileSync(helperPath)) },
  },
  pages,
  inheritedFigures,
  resolved_findings: [...findings.keys()],
  unresolved_findings: [],
  inheritedConfiguredProbes: probe.probes.filter((item) => item.kind === "counting-edge-only").map((item) => ({
    pdf_page: item.pdf_page,
    edge_margin_px: item.edge_margin_px,
    independent_rows: item.native_proposed_metadata_rows,
    inherited_probe: initial.binding.metadata_probe,
    rerun: false,
  })),
  boundaries: initial.boundaries,
  source_units: [
    { number: 80, id: "phy9-c2-s2-n80", status: "closed", closes_pdf_page: 200, closes_ref: "p0200#7" },
    { number: 81, id: "phy9-c2-s2-n81", status: "closed", closes_pdf_page: 202, closes_ref: "p0202#6" },
    { number: 82, id: "phy9-c2-s2-n82", status: "provisional", open_ref: "p0203#16", outgoing_page_204_unviewed: true },
  ],
  toc_and_ownership: initial.toc_and_ownership,
  preserved_uncertainties: initial.pixel_preserved_nonblocking_uncertainties,
  outside_batch_references_preserved: ["\u56fe158", "\u56fe156"],
  imagesLoaded: 1,
  actuallyOpened: [{
    kind: "corrected-source-crop",
    id: "fig-152",
    ...crop.output,
    tool: "functions.view_image",
    detail: "original",
    loads: 1,
  }],
  counts: 0,
  nativeCounterCalls: 0,
  metadataProbeRuns: 0,
  nativeParserCalls: 0,
  sourceVisualReopens: 0,
  oldCropVisualReopens: 0,
  extraImagesOrScreenshots: 0,
  not_performed: [
    "counter rerun", "parameter search", "native finalize", "vectorize", "assemble", "adapt",
    "SCI", "modern figures", "browser", "DB", "Git", "index or meters edits", "source edits",
    "skill edits", "source/old-crop visual reopens", "candidate153-155 edits", "retention or promotion",
  ],
  in_flight_processes: [],
  final_disposition: "All five exact corrections pass affected-only SOURCE review. Original pixel inventory and approved configured probes are inherited, not rerun. Unit80 closes200;81 closes202;82 remains provisional and open to unviewed204. No SCI or modern approval.",
};
writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ status: report.status, path: output, sha256: sha(readFileSync(output)), imagesLoaded: 1, counts: 0 }));
