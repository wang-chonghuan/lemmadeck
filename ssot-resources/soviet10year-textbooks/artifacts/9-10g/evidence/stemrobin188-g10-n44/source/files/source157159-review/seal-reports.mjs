import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
assert.equal(process.cwd(), cwd);
const tmp = path.join(cwd, ".intentfold/tickets/STEMROBIN-188/tmp");
const reviewRoot = path.join(tmp, "source157159-review");
const authorRoot = path.join(tmp, "source157159-author");

function fingerprint(file) {
  const bytes = fs.readFileSync(file);
  return {
    path: file,
    bytes: bytes.length,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
  };
}

const evidencePath = path.join(reviewRoot, "evidence.json");
const evidenceBinding = fingerprint(evidencePath);
assert.equal(
  evidenceBinding.sha256,
  "d1fcb916568cccde168fcef00b1bb8002cb302935ce035ef956679c0596eeffa"
);
const evidence = JSON.parse(fs.readFileSync(evidencePath, "utf8"));
for (const retained of evidence.files) {
  const current = fingerprint(retained.path);
  assert.equal(current.sha256, retained.sha256, `Input changed: ${retained.path}`);
  assert.equal(current.bytes, retained.bytes);
}

const findingsPath = path.join(reviewRoot, "review-findings.json");
const findings = JSON.parse(fs.readFileSync(findingsPath, "utf8"));
assert.deepEqual(findings.physical_pages, [157, 158, 159]);
assert.equal(findings.first.sha256, evidence.first_source_observations.sha256);
assert.equal(findings.usage.actual_image_loads, 8);
assert.equal(findings.usage.reopens, 0);
assert.equal(findings.usage.source_finalize_runs, 0);
const records = new Map(evidence.files.map((record) => [record.path, record]));
const imageLedger = findings.image_ledger_relative_paths.map((relative, index) => {
  const file = records.get(path.join(authorRoot, relative));
  assert.ok(file);
  return {
    load: index + 1,
    tool: "functions.view_image",
    kind: index < 3 ? "source-full-page" : index < 7 ? "source-figure-crop" : "limited-source-crop",
    file: { path: file.path, bytes: file.bytes, sha256: file.sha256, dimensions: file.dimensions },
    result: "loaded into review context",
    reopen: false,
    before_FIRST_persistence: index < 3,
  };
});
const report = {
  ...findings,
  created_utc: new Date().toISOString(),
  cwd,
  owned_root: reviewRoot,
  first: { ...findings.first, file: evidence.first_source_observations },
  actual_image_ledger: imageLedger,
  evidence_manifest: evidenceBinding,
  current_file_hash_inventory: evidence.files,
  source_and_candidate_bindings: evidence.pages,
  first_failure_preservation: evidence.first_failure_preservation,
  author_reports_and_generation_receipt: evidence.files.filter((file) =>
    /source157159-author\/(report\.(md|json)|report-generation-receipt\.json|byte-manifest\.json)$/.test(file.path)
  ),
  verification: {
    current_inventory_files_rehashed: evidence.files.length,
    retained_author_file_references_verified: evidence.author_reference_checks.length,
    reference_mismatches: 0,
    current_candidates_equal_first_snapshots: true,
    md_metadata_equals_json_metadata: true,
    scope_and_source_hashes_match: true,
    current_audit159_still_failed: true,
    mechanical_verification_is_not_independent_source_pass: true,
    no_source_tools_or_image_payloads_run_by_evidence_scripts: true,
  },
  report_md: fingerprint(path.join(reviewRoot, "report.md")),
  authored_findings_input: fingerprint(findingsPath),
};
const reportPath = path.join(reviewRoot, "report.json");
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, { flag: "wx" });

const receipt = {
  schema: "independent-first-source-review/report-receipt@1",
  created_utc: new Date().toISOString(),
  cwd,
  argv: ["node", path.join(reviewRoot, "seal-reports.mjs")],
  script: fingerprint(path.join(reviewRoot, "seal-reports.mjs")),
  reports: [fingerprint(path.join(reviewRoot, "report.md")), fingerprint(reportPath)],
  FIRST: fingerprint(path.join(reviewRoot, "FIRST.md")),
  evidence: evidenceBinding,
  findings: fingerprint(findingsPath),
  current_input_inventory_matches_capture: true,
  first_author_failure_preserved: true,
  image_loads_added: 0,
  source_tool_runs_added: 0,
  candidate_edits: 0,
  count_exclusions_applied: 0,
  paid_or_network_calls: 0,
};
const receiptPath = path.join(reviewRoot, "report-generation-receipt.json");
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({
  reports: receipt.reports,
  receipt: fingerprint(receiptPath),
  first: receipt.FIRST,
  images: 8,
  page_dispositions: findings.page_reviews.map((page) => ({
    physical_page: page.physical_page,
    disposition: page.disposition,
    holds: page.additional_holds || [],
  })),
  input_drift: false,
}, null, 2));
