import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
assert.equal(process.cwd(), cwd);
const ticketRoot = path.join(cwd, ".intentfold/tickets/STEMROBIN-188/tmp");
const authorRoot = path.join(ticketRoot, "source157159-author");
const reviewRoot = path.join(ticketRoot, "source157159-review");
const firstPath = path.join(reviewRoot, "FIRST.md");
const firstExpected = "7b3ea79bdd164b6a2aa215a455eba15fd8d345cf8091890b9d8a1e85fab7e3aa";
const records = new Map();
const referenceChecks = [];
const outsideReferences = [];

function fingerprint(file) {
  const bytes = fs.readFileSync(file);
  const record = {
    path: file,
    bytes: bytes.length,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
  };
  if (file.endsWith(".png")) {
    assert.equal(bytes.subarray(1, 4).toString("ascii"), "PNG");
    record.dimensions = [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
    record.image_payload_loaded = false;
  }
  records.set(file, record);
  return record;
}

function readJson(file) {
  fingerprint(file);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

// This script verifies bytes/JSON only. It never imports or runs source tools.
function verifyReferences(value, document) {
  if (!value || typeof value !== "object") return;
  if (
    typeof value.path === "string" &&
    typeof value.sha256 === "string" &&
    typeof value.bytes === "number"
  ) {
    if (value.path.startsWith(`${authorRoot}/`)) {
      const actual = fingerprint(value.path);
      const matches = actual.bytes === value.bytes && actual.sha256 === value.sha256;
      referenceChecks.push({
        document,
        path: value.path,
        claimed_bytes: value.bytes,
        claimed_sha256: value.sha256,
        matches_current_bytes: matches,
      });
      assert.ok(matches, `Reference drift: ${value.path}`);
    } else {
      outsideReferences.push({ document, path: value.path, action: "not read or executed" });
    }
  }
  for (const child of Object.values(value)) verifyReferences(child, document);
}

assert.equal(fingerprint(firstPath).sha256, firstExpected);
const authorReportPath = path.join(authorRoot, "report.json");
const authorReport = readJson(authorReportPath);
verifyReferences(authorReport, authorReportPath);
const generationPath = path.join(authorRoot, "report-generation-receipt.json");
const generation = readJson(generationPath);
verifyReferences(generation, generationPath);
fingerprint(path.join(authorRoot, "report.md"));
fingerprint(path.join(authorRoot, "byte-manifest.json"));

const pages = [];
for (const physical of [157, 158, 159]) {
  const pageName = String(physical).padStart(4, "0");
  const candidateRoot = path.join(authorRoot, "artifacts/9-10g/pages", pageName);
  const firstRoot = path.join(authorRoot, "evidence", pageName, "first");
  const receiptPath = path.join(firstRoot, "receipt.json");
  const receipt = readJson(receiptPath);
  verifyReferences(receipt, receiptPath);
  assert.equal(receipt.cwd, cwd);
  assert.equal(receipt.page, physical);
  assert.equal(receipt.exit_code, physical === 159 ? 1 : 0);

  const equality = [];
  for (const name of ["page.md", "page.json", "audit.json"]) {
    const candidate = fingerprint(path.join(candidateRoot, name));
    const firstSnapshot = fingerprint(path.join(firstRoot, name));
    const same = candidate.sha256 === firstSnapshot.sha256;
    equality.push({ file: name, current_equals_first_snapshot: same });
    assert.ok(same, `First-snapshot drift: ${physical}/${name}`);
  }

  const source = fingerprint(path.join(authorRoot, "work/9-10g/pages", pageName, "page.png"));
  const retainedSource = fingerprint(path.join(candidateRoot, "page.png"));
  const pageJson = readJson(path.join(candidateRoot, "page.json"));
  const audit = readJson(path.join(candidateRoot, "audit.json"));
  const md = fs.readFileSync(path.join(candidateRoot, "page.md"), "utf8");
  const envelope = md.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(envelope);
  assert.deepEqual(JSON.parse(envelope[1]), pageJson.meta);
  assert.equal(pageJson.meta.numbering_scope, "g10");
  assert.equal(audit.numbering_scope, "g10");
  assert.equal(source.sha256, retainedSource.sha256);
  assert.equal(source.sha256, pageJson.meta.render.sha256);
  assert.deepEqual(audit.count_exclusions, []);

  pages.push({
    physical_page: physical,
    printed_page: pageJson.meta.printed_page,
    numbering_scope: pageJson.meta.numbering_scope,
    md_metadata_equals_json_metadata: true,
    source_work_equals_retained_source: true,
    render_hash_matches_source: true,
    receipt_exit_code: receipt.exit_code,
    receipt: records.get(receiptPath),
    current_candidate_equals_first_snapshot: equality,
    author_mechanical_lines_md: audit.lines_md,
    author_mechanical_lines_printed: audit.lines_printed,
    author_mechanical_errors: audit.errors,
    count_exclusions: audit.count_exclusions,
    source: records.get(source.path),
    candidates: ["page.png", "page.md", "page.json", "audit.json"].map((name) =>
      records.get(path.join(candidateRoot, name))
    ),
    crops: (pageJson.meta.figures || []).map((figure) => ({
      id: figure.id,
      raw_printed_label: figure.label,
      source_box_xywh: figure.box,
      file: fingerprint(path.join(candidateRoot, "figures", `${figure.id}.png`)),
    })),
  });
}

const diagnosticPath = path.join(authorRoot, "evidence/0159/first/count-diagnostic.json");
const diagnostic = readJson(diagnosticPath);
verifyReferences(diagnostic, diagnosticPath);
assert.equal(diagnostic.lines_md, 23);
assert.equal(diagnostic.lines_printed, 24);
assert.deepEqual(diagnostic.count_exclusions, []);
assert.deepEqual(diagnostic.bands.at(-1).y, [2105, 2121]);
assert.equal(diagnostic.bands.at(-1).ink_pixels, 314);
assert.equal(diagnostic.finalize_rerun, false);
assert.equal(diagnostic.author_repair_count, 0);
fingerprint(path.join(authorRoot, "evidence/0159/first/lower-source-crop.png"));
fingerprint(path.join(authorRoot, "diagnose159.py"));

const boundaryRoot = path.join(
  cwd, "ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0156"
);
fingerprint(path.join(boundaryRoot, "page.md"));
fingerprint(path.join(boundaryRoot, "page.json"));
for (const file of [
  ".claude/skills/ld-s10y-lesson/SKILL.md",
  ".claude/skills/ld-s10y-lesson/references/production-resume.md",
  ".agents/skills/ld-s10y-image/SKILL.md",
]) fingerprint(path.join(cwd, file));
fingerprint(path.join(reviewRoot, "capture-evidence.mjs"));

const output = {
  schema: "independent-source-review/evidence@1",
  created_utc: new Date().toISOString(),
  cwd,
  owned_root: reviewRoot,
  first_source_observations: records.get(firstPath),
  first_created_before_author_lookup: true,
  role: "Independent source reviewer only",
  independent_readable_rows_from_FIRST: { "157": 18, "158": 18, "159": 23 },
  verification_is_not_a_source_pass: true,
  no_count_tools_run: true,
  no_image_payloads_loaded_by_this_script: true,
  pages,
  first_failure_preservation: {
    physical_page: 159,
    exit_code: 1,
    first_receipt: records.get(path.join(authorRoot, "evidence/0159/first/receipt.json")),
    first_stdout: records.get(path.join(authorRoot, "evidence/0159/first/stdout.txt")),
    first_stderr: records.get(path.join(authorRoot, "evidence/0159/first/stderr.txt")),
    diagnostic: records.get(diagnosticPath),
    extra_band: diagnostic.bands.at(-1),
    lower_crop: records.get(path.join(authorRoot, "evidence/0159/first/lower-source-crop.png")),
    lower_crop_source_box_ltrb: diagnostic.crop.source_box_ltrb,
    current_audit_still_failed: true,
    exclusions_applied: 0,
    author_repairs: 0,
    reviewer_repairs: 0,
    reviewer_finalize_runs: 0,
  },
  author_reference_checks: referenceChecks,
  author_references_outside_scoped_author_root_not_read: outsideReferences,
  files: [...records.values()].sort((a, b) => a.path.localeCompare(b.path)),
};
const outputPath = path.join(reviewRoot, "evidence.json");
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({
  evidence: fingerprint(outputPath),
  captured_file_count: output.files.length,
  author_references_verified: referenceChecks.length,
  first_failure_preserved: true,
  source_tools_run: 0,
  images_loaded: 0,
}, null, 2));
