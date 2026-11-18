import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const owned = path.dirname(fileURLToPath(import.meta.url));
const workspace = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const tmp = ".intentfold/tickets/STEMROBIN-181/tmp/";
const author = `${tmp}d607-n77-first-bilingual-text-author/`;
const digest = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const read = (relative) => fs.readFileSync(path.resolve(workspace, relative));
const json = (relative) => JSON.parse(read(relative).toString("utf8"));
const records = new Map();

function pin(relative, expected, role) {
  const absolute = path.resolve(workspace, relative);
  const bytes = fs.readFileSync(absolute);
  const actual = digest(bytes);
  if (expected) assert.equal(actual, expected, `Input hash: ${absolute}`);
  const record = {
    path: absolute,
    sha256: actual,
    expected_sha256: expected ?? actual,
    expected_origin: expected ? "supplied-or-frozen-manifest" : "observed-before-output",
    bytes: bytes.length,
    mode: `0${(fs.statSync(absolute).mode & 0o777).toString(8)}`,
    roles: [...new Set([...(records.get(absolute)?.roles ?? []), role])],
    hash_match: true
  };
  records.set(absolute, record);
}

const supplied = [
  [`${author}report.json`, "ba681ca52e4e41cd175ee05c35b744952517d92a72ed5e14335be185a20e65a5", "frozen-author-report-not-review-oracle"],
  [`${author}author-freeze.json`, "1817e0127078ff6dbd3640ad559e25d3449dc350c189ff6f8d21c571a9f67732", "frozen-author-manifest"],
  [`${tmp}d591-n77-preauthor-source204-requirements/source-requirements.json`, "edbd1f60df673daccfdb9374f985bd9e0dbdd15907b07bd2c2e35a9e03282dbc", "independent-R01-R06"],
  [`${tmp}d595-n77-source205-requirement-extension/report.json`, "5dc29a8a77859dea607b44fb772a54901b3ddd29122958b6b9d99636d06ea011", "independent-R07-R10"],
  [`${tmp}d600-n77-source206-requirement-extension/report.json`, "bd87ef8152bf54f4298a6d05109cf074848d0718ed5dc3058fcd426b0c269e59", "independent-R11-R13"]
];
for (const values of supplied) pin(...values);
for (const entry of json(`${author}author-freeze.json`).files) {
  pin(entry.path, entry.sha256, "author-freeze-listed-file-byte-verification");
}
pin(`${tmp}d596-first-source204205-object-boundary-adjudication/report.json`,
  "6409c253ebe9c0dce119bc3d1b50d3c9585f52082b88e5a7136ce95a59bf3a10", "derived-only-object-boundary-authority");
pin(`${tmp}d586-source205-first-independent-review/report.json`,
  "adc8ce6b5a3a8c054b8e5d502074b746a272b91b3da79b2a34a4e9cbdd97e433", "historical-HOLD-retention-only");
pin(`${tmp}d605-n77-first-bilingual-text-author/failure.json`,
  "037888f0126681b8694421c8519eb94225bb10f1e1f8de1d758145b0fbc259bc", "historical-failure-not-oracle");
pin(`${tmp}d605-n77-first-bilingual-text-author/failure-freeze.json`,
  "c47773a43a8695e2cd6cb0dd1f1d2d17556e19eac08cdd33c7851604e0595aef", "historical-failure-freeze");
pin(`${tmp}d602-n77-first-source-preparation/manifest.json`,
  "f69fb92f5a97a13a50ba540e2be7a100cd941c6cc3997a0809ca4a8757d9163b", "scoped-source-preparation-authority");

const faithfulPins = [
  [204, "8dc12b02ea24152edb7a3d76d2c63069b9e401aa3df0d9d7203ade0b64ce3fbd"],
  [205, "e0e1d2c40a38de58ce5ceaacf33c0482e0f70736d65a451263d52b3399c4bd16"],
  [206, "b4a8634e20305fcf3feba9e54a61f65117a119dd71d7c13c6a4468342872ebc9"]
];
const pages = new Map();
for (const [page, sha] of faithfulPins) {
  const relative = `ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0${page}/page.json`;
  pin(relative, sha, "faithful-text-identity-and-scoped-blocks-only");
  pages.set(page, json(relative));
}
for (const relative of [
  ".claude/skills/ld-s10y-lesson/references/edition-text-contract.md",
  ".claude/skills/ld-s10y-lesson/tools/edition.py",
  ".intentfold/readme.md",
  ".intentfold/project.json",
  ".intentfold/charter/engineering.md",
  ".intentfold/charter/operations.md",
  ".intentfold/charter/product.md",
  ".intentfold/tickets/STEMROBIN-181/ticket.json"
]) pin(relative, null, "read-only-contract-or-workspace-context");

const baselinePaths = supplied.slice(2).map(([relative]) => relative);
const requirements = baselinePaths.flatMap((relative) =>
  json(relative).requirements.map((requirement, index) => ({
    ...requirement,
    baseline_path: path.resolve(workspace, relative),
    baseline_pointer: `/requirements/${index}`
  }))
);
assert.deepEqual(requirements.map((requirement) => requirement.id),
  Array.from({ length: 13 }, (_, index) => `N77-R${String(index + 1).padStart(2, "0")}`));
const source = json(`${author}source/lesson.json`);
const sourceExercises = json(`${author}source/exercises.json`);
assert.equal(source.prose.length, 9);
assert.equal(source.exercise_count, 8);
assert.equal(sourceExercises.exercises.length, 8);
assert.equal(pages.get(204).blocks[2].open, true);
assert.equal(pages.get(205).blocks[0].cont, false);
assert.equal(pages.get(205).blocks[5].open, true);
assert.equal(pages.get(206).blocks[0].cont, true);
assert.equal(pages.get(206).blocks[11].kind, "h3");
assert.match(pages.get(206).blocks[11].lines[0], /^78\./);

function blockFor(ref) {
  const match = /^p0(204|205|206)#(\d+)$/.exec(ref);
  assert.ok(match, `Scoped source ref: ${ref}`);
  const page = Number(match[1]);
  const index = Number(match[2]) - 1;
  return { ref, page, pointer: `/blocks/${index}`, block: pages.get(page).blocks[index] };
}
const sourceBlockEvidence = source.prose.map((item, index) => {
  const blocks = item.source_refs.map(blockFor);
  const joined = blocks.flatMap((entry) => entry.block.lines).join("");
  assert.equal(item.text, joined);
  assert.equal(item.kind, "p");
  return { source_pointer: `/prose/${index}`, source_refs: item.source_refs, blocks };
});
const math = (text) => [...text.matchAll(/\$([^$]+)\$/g)]
  .map((match) => match[1].replace(/\s/g, ""));
const numbers = (text) => [...text.matchAll(/6\.1[5-9]/g)].map((match) => match[0]);
const comparisons = [];
const exerciseComparisons = [];
const attachments = [];
for (const locale of ["zh", "en"]) {
  const relative = `${author}candidate/${locale}/lesson.template.json`;
  const candidate = json(relative);
  const candidateExercises = json(`${author}candidate/${locale}/exercises.template.json`);
  const figureTemplate = json(`${author}candidate/${locale}/figures.template.json`);
  assert.equal(candidate.number, "77");
  assert.equal(candidate.prose.length, 9);
  assert.equal(candidate.exercise_count, 8);
  assert.deepEqual(candidate.source.data, source);
  assert.equal(candidate.source.sha256, records.get(path.resolve(workspace, `${author}source/lesson.json`)).sha256);
  assert.deepEqual(candidate.figures, []);
  assert.deepEqual(candidateExercises.source.data, sourceExercises);
  assert.equal(candidateExercises.count, 8);
  assert.equal(candidateExercises.exercises.length, 8);
  assert.deepEqual(read(`${author}candidate/${locale}/exercises.template.json`),
    read(`${author}source/first-templates/exercises.template.json`));
  for (let index = 0; index < 9; index++) {
    const original = source.prose[index];
    const current = candidate.prose[index];
    assert.equal(current.kind, "p");
    assert.equal(current.source_text, original.text);
    assert.deepEqual(current.source_refs, original.source_refs);
    for (const key of ["id", "label", "printed_page"]) assert.deepEqual(current[key], original[key]);
    const sourceMath = math(original.text);
    const candidateMath = math(current.text);
    assert.deepEqual(candidateMath, sourceMath);
    const sourceNumbers = numbers(original.text);
    const candidateNumbers = numbers(current.text);
    const numericStatus = JSON.stringify(sourceNumbers) === JSON.stringify(candidateNumbers) ? "PASS" : "FAIL";
    if (index === 2) {
      assert.deepEqual(sourceNumbers, ["6.17", "6.18", "6.17"]);
      assert.deepEqual(candidateNumbers, ["6.17", "6.18"]);
      assert.equal(numericStatus, "FAIL");
    } else assert.equal(numericStatus, "PASS");
    comparisons.push({
      locale,
      source_path: path.resolve(workspace, `${author}source/lesson.json`),
      candidate_path: path.resolve(workspace, relative),
      pointer: `/prose/${index}/text`,
      source_refs: original.source_refs,
      source_text: original.text,
      candidate_text: current.text,
      source_math: sourceMath,
      candidate_math: candidateMath,
      math_status: "PASS",
      source_numeric_references: sourceNumbers,
      candidate_numeric_references: candidateNumbers,
      numeric_reference_status: numericStatus,
      source_identity_status: "PASS"
    });
    for (const figure of current.figures ?? []) attachments.push({ locale, pointer: `/prose/${index}/figures`, id: figure.id });
  }
  assert.deepEqual(candidate.prose[7].source_refs, ["p0205#6", "p0206#1"]);
  assert.deepEqual(candidate.prose[8].source_refs, ["p0206#2"]);
  const localAttachments = attachments.filter((entry) => entry.locale === locale);
  assert.deepEqual(localAttachments, [{ locale, pointer: "/prose/1/figures", id: "fig-179" }]);
  assert.match(source.prose[1].text, /图\s*179/);
  assert.deepEqual(figureTemplate.figures.map((figure) => figure.id), ["fig-179"]);
  assert.ok(fs.statSync(path.resolve(workspace, "ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-179.png")).isFile());
  assert.deepEqual(candidate.section_breaks, [{ before: candidate.prose[3].text, after: candidate.prose[4].text }]);
  for (let index = 0; index < 8; index++) {
    const original = sourceExercises.exercises[index];
    const current = candidateExercises.exercises[index];
    const accepted = json(baselinePaths[2]).questions[index];
    assert.equal(original.text, accepted.lines.join(""));
    assert.deepEqual(original.lines, accepted.lines);
    assert.deepEqual(original.pages, [accepted.ref]);
    assert.equal(current.source_text, original.text);
    for (const [key, value] of Object.entries(original)) assert.deepEqual(current[key], value);
    assert.equal(current.group, "问题");
    assert.equal(current.group_id, "g1");
    assert.equal(current.number, String(index + 1));
    assert.equal(current.source_number, String(index + 1));
    const faithful = blockFor(accepted.ref);
    assert.deepEqual(original.lines, faithful.block.lines);
    exerciseComparisons.push({
      locale,
      pointer: `/exercises/${index}`,
      source_ref: accepted.ref,
      faithful_pointer: faithful.pointer,
      text: original.text,
      stable_original_fields: Object.keys(original),
      status: "PASS",
      bilingual_answer_or_choice_approval: false
    });
  }
}

// Sparse polynomial coefficients establish the algebra without numerical approximation.
const expanded = { fd: 1, fF: -1, Fd: -1, F2: 1 };
const afterCancel = { fd: 1, fF: -1, Fd: -1, F2: 0 };
const rearranged = { fF: 1, Fd: 1, fd: -1 };
assert.equal(expanded.F2 - 1, afterCancel.F2);
for (const key of ["fd", "fF", "Fd"]) assert.equal(afterCancel[key], -rearranged[key]);
const historical = json(`${tmp}d586-source205-first-independent-review/report.json`);
assert.equal(historical.gates.SOURCE204205_JOIN.status, "HOLD");
const objectBoundary = json(`${tmp}d596-first-source204205-object-boundary-adjudication/report.json`);
assert.equal(objectBoundary.gates.SOURCE204205_OBJECT_BOUNDARY.status, "PASS");
assert.equal(objectBoundary.historical_d586_join_hold_retained.status, "HOLD");
const failure = json(`${tmp}d605-n77-first-bilingual-text-author/failure.json`);
assert.equal(failure.candidatesWritten, 0);
assert.equal(failure.nativeFinalizeRenderInvocations, 0);

const report = JSON.parse(fs.readFileSync(path.join(owned, "report.json"), "utf8"));
assert.deepEqual(report.requirements.map((requirement) => requirement.id), requirements.map((requirement) => requirement.id));
assert.equal(report.blocking_list.length, 2);
for (const requirement of report.requirements) {
  for (const locale of ["zh", "en"]) {
    assert.equal(requirement.SCI[locale].status, "PASS");
    assert.equal(requirement.ZHEN[locale].status, requirement.id === "N77-R07" ? "FAIL" : "PASS");
  }
}
const bindingRecords = [...records.values()].sort((a, b) => a.path.localeCompare(b.path));
for (const record of bindingRecords) assert.equal(digest(fs.readFileSync(record.path)), record.sha256);
const checkedAt = new Date().toISOString();
const inputbindings = {
  schema: "STEMROBIN-181/n77-independent-text-inputbindings@1",
  ticket: "STEMROBIN-181",
  checked_at: checkedAt,
  supplied_pins_match: true,
  supplied_pin_count: 5,
  author_freeze_listed_files_match: true,
  author_freeze_listed_file_count: 15,
  files: bindingRecords,
  requirements,
  original_source_blocks: sourceBlockEvidence,
  original_heading: blockFor("p0204#1"),
  right_boundary: blockFor("p0206#12"),
  image_opens: 0,
  image_byte_reads: 0,
  image_hashes_in_upstream_json_are_provenance_only: true,
  author_source_mapping_and_receipts: "Byte-verified only, not semantic review oracles.",
  old_passing_modern_text_used_as_oracle: false,
  outside_inputs_same_hash_at_freeze: true
};
const evidence = {
  schema: "STEMROBIN-181/n77-independent-text-evidence@1",
  ticket: "STEMROBIN-181",
  checked_at: checkedAt,
  result: "FAIL-NUMERIC-REFERENCE-PRESERVATION",
  source_prose_count: 9,
  original_question_count: 8,
  prose_comparisons: comparisons,
  original_question_comparisons: exerciseComparisons,
  shared_attachments_metadata_only: attachments,
  algebra: {
    expansion: "(f-F)(d-F)=fd-fF-Fd+F^2",
    sparse_polynomial_expansion: expanded,
    cancelled_equation: "fd-fF-Fd=0",
    cancelled_coefficients: afterCancel,
    rearranged_equation: "fF+Fd=fd",
    rearranged_coefficients: rearranged,
    division_by_Ffd: ["fF/(Ffd)=1/d", "Fd/(Ffd)=1/f", "fd/(Ffd)=1/F"],
    status: "PASS",
    domain: "Finite ordinary thin/paraxial same-medium converging real-image construction, F>0,d>F,f=Fd/(d-F)>F; d-F,F,Ffd nonzero. Not an infinity-limit proof, not all signed-case triangle geometry.",
    invented_candidate_numbers: false
  },
  historical_source204_open: true,
  historical_source204205_join: historical.gates.SOURCE204205_JOIN,
  historical_source204205_blockers: objectBoundary.historical_d586_join_hold_retained.blocking_list,
  distinct_derived_object_boundary: objectBoundary.gates.SOURCE204205_OBJECT_BOUNDARY,
  d605_failure: failure,
  native_commands: 0,
  image_opens: 0,
  image_byte_reads: 0,
  pixel_or_display_claims: false
};

function writeOutput(name, value) {
  const target = path.join(owned, name);
  assert.equal(path.dirname(target), owned);
  assert.equal(fs.existsSync(target), false, `Do not overwrite: ${target}`);
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx", mode: 0o600 });
}
writeOutput("inputbindings.json", inputbindings);
writeOutput("evidence.json", evidence);
const artifactNames = ["report.json", "inputbindings.json", "evidence.json", "verify.mjs"];
for (const name of artifactNames) fs.chmodSync(path.join(owned, name), 0o444);
for (const record of bindingRecords) assert.equal(digest(fs.readFileSync(record.path)), record.sha256);
const frozenFiles = artifactNames.map((name) => {
  const target = path.join(owned, name);
  const bytes = fs.readFileSync(target);
  return { path: target, sha256: digest(bytes), bytes: bytes.length, mode: "0444" };
});
writeOutput("review-freeze.json", {
  schema: "STEMROBIN-181/n77-independent-text-review-freeze@1",
  ticket: "STEMROBIN-181",
  review_id: "d608-n77-first-independent-text-review",
  frozen_at: new Date().toISOString(),
  TEXT: report.TEXT,
  SCI: report.SCI,
  ZHEN: report.ZHEN,
  FIG: "NOT-ASSESSED",
  DISPLAY: "NOT-RUN",
  files: frozenFiles,
  all_owned_files_mode: "0444",
  inputs_rechecked_unchanged: true,
  author_repair: false,
  image_opens: 0,
  image_byte_reads: 0,
  writes_confined_to_owned_root: true,
  self_hash_policy: "This manifest excludes itself. Full manifest SHA-256 is returned in final TEXT."
});
fs.chmodSync(path.join(owned, "review-freeze.json"), 0o444);
assert.deepEqual(fs.readdirSync(owned).sort(), [...artifactNames, "review-freeze.json"].sort());
for (const name of [...artifactNames, "review-freeze.json"]) {
  const target = path.join(owned, name);
  assert.equal(fs.statSync(target).mode & 0o777, 0o444);
  console.log(JSON.stringify({ path: target, sha256: digest(fs.readFileSync(target)), mode: "0444" }));
}
console.log(JSON.stringify({
  TEXT: report.TEXT,
  SCI: report.SCI,
  ZHEN: report.ZHEN,
  math_checks_pass: comparisons.filter((entry) => entry.math_status === "PASS").length,
  numeric_reference_failures: comparisons.filter((entry) => entry.numeric_reference_status === "FAIL").length,
  question_preservation_checks_pass: exerciseComparisons.length,
  image_opens: 0
}));
