const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const BASE = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const OWN = `${BASE}/source239-arbitration`;
const PAGE = "ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0239";
assert.equal(fs.realpathSync(process.cwd()), ROOT);

const expected = {
  ".tmp/ld-s10y-lesson/7a/pages/0239/page.png":
    "7453e58f72dff78bad95ac2a10025f9c31b83b80cce8081af03d500aaa89a961",
  [`${OWN}/page0239-x180-1320-y285-390-nearest2x.png`]:
    "9fe41685a2a6bcb4711fcfc42945c8f6489bf72699441bc6bca51bd539242588",
  [`${OWN}/pixel-observation.json`]:
    "84c77c26802c2804e5ec393f4f8cdd5343a4b871ec5154f17b0f8dcd6e662f51",
  [`${OWN}/create_crop.py`]:
    "f6134afaa2a1a108a1c21dc5a71cb9ff82b9f270d229256fcdfb38ea6c9333c6",
  [`${OWN}/crop-provenance.json`]:
    "ccaefda9a63abdeab59f2e769f55276c422cfd5e3536cfd21fda90a94d17dd9e",
  [`${PAGE}/page.md`]:
    "9716c54daac7520a1a5ea196fa2efe9f377c613265793fd22d9f31a769f28de6",
  [`${PAGE}/page.json`]:
    "cce8b7c7c6f3930b44c3aaabfe8e79b1a6abbaace408357fc6ea3577d573313c",
  [`${PAGE}/audit.json`]:
    "5d7dddbf83571b93317ec6100da342641b11ba94694fc6ed624083500240802e",
  [`${BASE}/source235-242-review/source235-242-review.json`]:
    "de932016520e14c08037372da92a919f22cd3a99f4e927cae84d53d1d9ec1593",
  [`${BASE}/source235-242-review/source235-242-review.md`]:
    "72340f9d5747215cebc64c3776d03249c53ab386335e67f158d88555a99cfe94",
  [`${BASE}/source235-242-review/source-observations.md`]:
    "a3fa64d9a1466b8649e218da5529b48c1931c6b68cc881ed490f99bb56def88d",
  [`${BASE}/source235-242-author/source235-242-author.json`]:
    "2ae508613059a9c2601c3e2ab975282243c5a54ed928a8d6a940bd9024112fd3",
  [`${BASE}/source235-242-author/source235-242-author.md`]:
    "0de3fd9861dbf948f95d45aaafcde6214742f6003f72ee0950f4ca9039de58dd"
};

const absolute = (relative) => path.join(ROOT, relative);
const bytes = (relative) => fs.readFileSync(absolute(relative));
const sha = (relative) => crypto.createHash("sha256").update(bytes(relative)).digest("hex");
const json = (relative) => JSON.parse(bytes(relative).toString("utf8"));
const bind = (relative) => ({
  path: absolute(relative),
  sha256: sha(relative),
  bytes: fs.statSync(absolute(relative)).size
});
const verifyInputs = () => {
  for (const [relative, digest] of Object.entries(expected)) {
    assert.equal(sha(relative), digest, `Input drift: ${relative}`);
  }
};

verifyInputs();
const observed = json(`${OWN}/pixel-observation.json`);
const provenance = json(`${OWN}/crop-provenance.json`);
const current = json(`${PAGE}/page.json`);
const audit = json(`${PAGE}/audit.json`);
const md = bytes(`${PAGE}/page.md`).toString("utf8");
const mdMeta = JSON.parse(md.match(/^---\n([\s\S]*?)\n---/)[1]);
const review = json(`${BASE}/source235-242-review/source235-242-review.json`);
const author = json(`${BASE}/source235-242-author/source235-242-author.json`);
const finding = review.findings.find((item) => item.id === "R239-lookup");
const authorPage = author.pages.find((item) => item.page === 239);
const erratum = current.meta.errata.find((item) => item.id === "p0239-math-1");

assert.equal(observed.observed_formula_latex, "\\sqrt{2.45}\\approx1.565");
assert.deepEqual(observed.approximation_digits_in_order, ["1", "5", "6", "5"]);
assert.equal(observed.crop_display_count, 1);
assert.equal(observed.remaining_image_budget, 0);
assert.equal(current.meta.render.sha256, provenance.source_sha256);
assert.equal(mdMeta.render.sha256, provenance.source_sha256);
assert.equal(authorPage.images.find((item) => item.path.endsWith("/page.png")).sha256,
  provenance.source_sha256);
assert.equal(current.blocks[0].lines[1], "$\\sqrt{2.45}\\approx1.555$.");
assert.equal(erratum.original, "$\\sqrt{2.45}\\approx1.555$");
assert.deepEqual(mdMeta.errata, current.meta.errata);
assert.equal(audit.errata, current.meta.errata.length);
for (const item of authorPage.triplet) assert.equal(sha(item.path), item.sha256);

const instructionPaths = [
  ".agents/skills/ld-s10y-image/SKILL.md",
  ".claude/skills/ld-s10y-lesson/SKILL.md",
  ".claude/skills/ld-s10y-lesson/references/production-resume.md"
];
const instructionBindings = instructionPaths.map(bind);
const report = {
  schema: "source-pixel-arbitration@1",
  ticket: "STEMROBIN-182",
  finish: "review",
  cwd: ROOT,
  owned_directory: absolute(OWN),
  created_at_utc: new Date().toISOString(),
  status: "complete-arbitration; corrective action unapplied",
  scope: {
    book: "7a",
    physical_page: 239,
    printed_page: 233,
    target: "first displayed lookup decimal only, p0239#1",
    other_page_pixels_inspected: false,
    broader_source_inventory_performed: false,
    independent_of_conflicting_reports_and_math_at_observation: true,
    does_not_approve_whole_page_or_batch: true
  },
  instructions_read: instructionBindings,
  protocol_order: [
    "Created one targeted lossless PNG crop and its source/crop SHA256 log.",
    "Displayed only that crop exactly once with functions.view_image, detail original.",
    "Saved pixel-observation.json before reading current triplet, author note or conflicting review.",
    "Compared current physical239 triplet, registered erratum, R239-lookup and author note.",
    "Calculated square root and both squares independently using Python Decimal at precision 50.",
    "Wrote this hash-bound textual arbitration; did not change source or rerun production."
  ],
  crop: provenance,
  image_usage: {
    total_context_image_displays: 1,
    crop_displays: 1,
    full_page_displays: 0,
    grid_displays: 0,
    other_image_displays: 0,
    reopens: 0,
    remaining_budget: 0,
    display_tool: "functions.view_image",
    display_detail: "original",
    sole_displayed_path: provenance.crop_path,
    source_decoded_by_PIL_only_for_crop_creation_not_displayed: true,
    image_payload_returned_to_parent: false
  },
  frozen_pixels_only_observation: {
    file: bind(`${OWN}/pixel-observation.json`),
    observed_text: observed.observed_text_ascii,
    formula_latex: observed.observed_formula_latex,
    digits: observed.approximation_digits_in_order,
    glyph_evidence: observed.glyph_evidence,
    legibility: observed.legibility
  },
  current_file_bindings: Object.keys(expected).map(bind),
  current_triplet: {
    page_md_lookup_location: { path: absolute(`${PAGE}/page.md`), line: 46 },
    block: "p0239#1",
    lookup: current.blocks[0].lines[1],
    author_note: current.meta.notes[0],
    registered_erratum: erratum,
    audit: {
      lines_printed: audit.lines_printed,
      lines_md: audit.lines_md,
      errata: audit.errata,
      errors: audit.errors,
      interpretation: "Mechanical pass and errata count do not establish source glyph fidelity."
    },
    md_and_json_metadata_errata_agree: true,
    image_SHA_matches_md_json_and_author_record: true,
    author_record_triplet_SHA_matches_current_files: true
  },
  comparison: {
    review_finding: finding,
    review_disposition: "R239-lookup substantiated by the fresh targeted crop.",
    author_claim: authorPage.notes[0],
    author_md_location: {
      path: absolute(`${BASE}/source235-242-author/source235-242-author.md`),
      line: 29
    },
    author_disposition: "Claim that 1.555 is faithfully printed is contradicted by the crop.",
    later_formula_in_current_text: current.blocks[1].lines[1],
    later_formula_was_not_visually_reinspected: true
  },
  mathematics_after_pixels: {
    method: "Independent Python Decimal calculation, precision 50; values stored as decimal strings.",
    sqrt_2_45: "1.5652475842498527874864215681118933648084328517281",
    rounded_to_four_significant_digits: "1.565",
    square_1_565_exact: "2.449225",
    square_1_555_exact: "2.418025",
    error_1_565: "0.0002475842498527874864215681118933648084328517281",
    error_1_555: "0.0102475842498527874864215681118933648084328517281",
    half_unit_last_place: "0.0005",
    observed_1_565_within_rounding_tolerance: true,
    conflicting_1_555_within_rounding_tolerance: false,
    math_used_to_identify_glyphs: false
  },
  verdict: {
    definitive_source_reading: "\\sqrt{2.45}\\approx1.565",
    middle_fractional_digit: "6",
    classification: "source transcription error, not a genuine printed mathematical erratum",
    current_faithful_layer_has_digit_error: true,
    registered_erratum_exists_currently: true,
    registered_erratum_supported_by_pixels: false,
    registered_erratum_status: "p0239-math-1 still registered but invalid: its claimed printed original is not the observed source.",
    genuine_erratum_for_this_lookup: false,
    arithmetic_reason_for_1_555_is_numerically_valid_but_source_premise_false: true
  },
  corrective_action_proposed_only: [
    "The source owner, after separate authorization, should transcribe p0239#1 as sqrt(2.45) approximately 1.565.",
    "Replace/remove the mistaken first note claiming the source prints 1.555.",
    "Remove p0239-math-1 rather than retaining it with original 1.565: the printed approximation is valid.",
    "Keep page.md, page.json and audit.json consistent through the authorized affected-only canonical workflow; no tool was rerun here.",
    "Treat the author assertion as superseded by this arbitration while preserving existing author/review evidence unchanged.",
    "Do not describe the transcription repair as a modern-edition mathematical correction or as approval for other findings."
  ],
  changes_and_authorization: {
    source_tool_index_edits: false,
    production_reruns: false,
    git_commands: false,
    network_access: false,
    database_access: false,
    publish_or_deploy: false,
    app_started_or_used: false,
    dependency_install_or_change: false,
    agents_spawned_or_messaged: false,
    other_owners_files_edited: false,
    corrective_action_applied: false,
    human_approval_claimed: false,
    promotion_authorized: false,
    all_task_artifact_writes_below_owned_directory: true
  },
  technical_recovery: {
    first_crop_execution: "Default python3 lacked PIL; no crop was created and no image displayed.",
    recovery: "Used the existing .claude/skills/ld-s10y-lesson/.venv/bin/python; no dependency installation.",
    successfully_created_crops: 1
  },
  verification: {
    expected_input_SHA_checked_before_and_after_report_generation: true,
    frozen_observation_SHA_unchanged: true,
    report_outputs_exclusive_create: true,
    PDF_hash_from_existing_metadata_only_not_independently_read:
      current.meta.source.pdf_sha256,
    return_payload: "text plus report paths and hashes only; no image payload"
  }
};

const lines = [
  "# Physical239 Source Pixel Arbitration",
  "",
  "STEMROBIN-182; book7a physical239 / printed233; offline finish=review.",
  "",
  "## Verdict",
  "",
  "**The source prints `sqrt(2.45) approximately 1.565`. Digits: 1, 5, 6, 5.**",
  "The middle fractional digit is a legible 6, not 5. This independently substantiates",
  "`R239-lookup` and contradicts the author note. Current `1.555` is a transcription",
  "error, not a genuine source mathematical erratum.",
  "",
  "## Pixels First",
  "",
  `Source image: \`${provenance.source_path}\``,
  `SHA256: \`${provenance.source_sha256}\``,
  `Sole crop: \`${provenance.crop_path}\``,
  `SHA256: \`${provenance.crop_sha256}\``,
  "Bounds [180,285,1320,390), source coordinates; 1140x105 enlarged to 2280x210",
  "by nearest-neighbor, lossless PNG. Target formula y317-362 is inside those bounds.",
  "**One crop display; zero full-page/grid/other-image displays; zero reopens. Budget exhausted.**",
  `Frozen observation SHA256: \`${expected[`${OWN}/pixel-observation.json`]}\`.`,
  "It was saved before current artifacts, conflicting reports, author note and calculation.",
  "",
  ...observed.glyph_evidence.map((item) =>
    `- ${item.position}: **${item.reading}**. ${item.evidence}`),
  "",
  "## Comparison And Erratum Status",
  "",
  "`page.md:46` and `page.json` p0239#1 currently contain `1.555`.",
  "`page.md:23` and author report:29 claim that value is faithfully printed.",
  "`p0239-math-1` is still registered in MD/JSON, with original `1.555`; audit counts one",
  "erratum and passes 26/26 lines. Those mechanical facts do not prove printed fidelity.",
  "**Registration remains unchanged but is unsupported: its printed-original premise is false.**",
  "The existing review's `R239-lookup` reads 1.565 and identifies the middle 6, agreeing",
  "with this fresh crop. The later current-text 1.565 was compared as text only, not reopened.",
  "",
  "## Mathematics After Pixels",
  "",
  "`sqrt(2.45) = 1.5652475842498527874864215681118933648084328517281`",
  "at Decimal precision 50; four significant digits give `1.565`.",
  "`1.565^2 = 2.449225`; root error about `0.00024758425`, below `0.0005`.",
  "`1.555^2 = 2.418025`; root error about `0.01024758425`, above `0.0005`.",
  "The erratum's arithmetic about 1.555 is correct, but arithmetic cannot make that",
  "misread value a printed fact. The observed 1.565 is a valid approximation.",
  "",
  "## Unapplied Corrective Action",
  "",
  ...report.corrective_action_proposed_only.map((item) => `- ${item}`),
  "",
  "No source/tool/index edits, production reruns, Git, network, DB, publication, app",
  "use, dependency changes, or agent dispatch/messaging occurred. No other owner files",
  "were edited. This arbitration approves no broader page, batch or downstream stage.",
  "The first default Python lacked PIL; the existing lesson Python created the one crop.",
  "",
  "## Current Input SHA256",
  "",
  "| File | SHA256 |",
  "| --- | --- |",
  ...report.current_file_bindings.map((item) => `| \`${item.path}\` | \`${item.sha256}\` |`),
  "",
  "The JSON report contains exact compared fields, source image binding, instruction",
  "hashes, protocol order, and operation restrictions. All expected inputs were checked",
  "before and after generation. `report-hashes.json` binds JSON, Markdown, and local",
  "evidence files without copying source pages or returning image payloads.",
  ""
];

const writeNew = (name, data) => {
  const destination = absolute(`${OWN}/${name}`);
  assert.equal(path.dirname(destination), absolute(OWN));
  fs.writeFileSync(destination, data, { flag: "wx" });
};
writeNew("source239-arbitration.json", JSON.stringify(report, null, 2) + "\n");
writeNew("source239-arbitration.md", lines.join("\n"));
verifyInputs();
for (const item of instructionBindings) {
  const relative = path.relative(ROOT, item.path);
  assert.equal(sha(relative), item.sha256, `Instruction drift: ${relative}`);
}
const outputs = [
  "source239-arbitration.json",
  "source239-arbitration.md",
  "pixel-observation.json",
  "crop-provenance.json",
  "create_crop.py",
  "write_report.cjs",
  "page0239-x180-1320-y285-390-nearest2x.png"
].map((name) => bind(`${OWN}/${name}`));
writeNew("report-hashes.json", JSON.stringify({
  schema: "source-pixel-arbitration-hashes@1",
  algorithm: "SHA256",
  self_hash_excluded_to_avoid_circular_binding: true,
  outputs,
  source_inputs_unchanged: true
}, null, 2) + "\n");
console.log(JSON.stringify({
  status: report.status,
  source_reading: report.verdict.definitive_source_reading,
  reports: outputs.slice(0, 2),
  hash_manifest: bind(`${OWN}/report-hashes.json`),
  corrective_action_applied: false
}, null, 2));
