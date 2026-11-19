import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(root, "../../..");
const contract = JSON.parse(fs.readFileSync(path.join(root, "review-contract.json"), "utf8"));
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
assert.deepEqual(fs.readdirSync(root).sort(), ["REVIEW.md", "content-check.mjs", "review-contract.json", "run-freeze.mjs"].sort(), "do not overwrite existing evidence");

function create(name, bytes) {
  assert.equal(path.basename(name), name);
  fs.writeFileSync(path.join(root, name), bytes, { flag: "wx" });
}
function createJson(name, value) {
  create(name, `${JSON.stringify(value, null, 2)}\n`);
}
function inventory(name) {
  const bytes = fs.readFileSync(path.join(root, name));
  return { path: path.join(root, name), bytes: bytes.length, sha256: sha(bytes) };
}

for (const input of contract.inputs.filter((item) => item.snapshot)) {
  const bytes = fs.readFileSync(path.join(repo, input.path));
  assert.equal(bytes.length, input.bytes, `${input.role} changed before snapshot`);
  assert.equal(sha(bytes), input.sha256, `${input.role} changed before snapshot`);
  create(input.snapshot, bytes);
}
const args = [path.join(root, "content-check.mjs")];
const started = new Date().toISOString();
const result = spawnSync(process.execPath, args, {
  cwd: repo,
  encoding: "utf8",
  timeout: 60000,
  maxBuffer: 4 * 1024 * 1024,
});
const stdout = result.stdout ?? "";
const stderr = result.stderr ?? "";
create("content-check.stdout.txt", stdout);
create("content-check.stderr.txt", stderr);
const finalLine = stdout.trim().split("\n").at(-1);
let contentReport = null;
try {
  contentReport = JSON.parse(finalLine);
} catch {
  // Preserve output and a technical failure verdict; never rerun this phase.
}
const passed = result.status === 0 && result.signal === null && !result.error &&
  contentReport?.verdict === "PASS_TEXT_ONLY";
const verdict = {
  phase: contract.phase,
  ticket: contract.ticket,
  lesson: contract.lesson,
  textual_verdict: passed ? "PASS_TEXT_ONLY" : "FAIL_OR_TECHNICAL_HOLD",
  manual_review: "REVIEW.md",
  candidate_bindings: contract.inputs,
  first_evidence_reused_by_reference: contract.first_evidence,
  current_canonical_source_bounds: [
    { page: 55, first_json_pointer: "/blocks/1", last_json_pointer: "/blocks/7" },
    { page: 56, first_json_pointer: "/blocks/0", last_json_pointer: "/blocks/8" },
    { page: 57, first_json_pointer: "/blocks/0", last_json_pointer: "/blocks/4" },
  ],
  source_ref_indexing: contract.source_ref_indexing,
  content_report: contentReport,
  execution: {
    command: [process.execPath, ...args],
    cwd: repo,
    node: process.version,
    started_at: started,
    finished_at: new Date().toISOString(),
    actual_exit: result.status,
    signal: result.signal,
    error: result.error ? { name: result.error.name, message: result.error.message, code: result.error.code } : null,
    stdout: inventory("content-check.stdout.txt"),
    stderr: inventory("content-check.stderr.txt"),
    execution_count: 1,
    capable_of_failing: "assertions report concrete binding/text defects and set exit1; no deliberate mutation or replay executed",
  },
  approvals: { textual_only: passed, figure_identity_only: true, figure_visual: false, figure_mathematics: false, whole_lesson: false, finalization: false, gate2: false, author_answers: false, choices: false, publication: false },
  first_tests_replayed: false,
  source_solutions_or_proofs_replayed: false,
  future_stage: "STOP for parent intake; later Gate2/choice disclosures require another bounded authorization",
  unknowns: contract.unknowns,
  usage: contract.usage,
};
createJson("verdict.json", verdict);
const files = fs.readdirSync(root).sort().map(inventory);
createJson("freeze.json", {
  phase: contract.phase,
  status: "frozen",
  textual_verdict: verdict.textual_verdict,
  frozen_at: new Date().toISOString(),
  files,
  manifest_self_hash: "reported in runner stdout; not embedded recursively",
  candidate_bindings: contract.inputs.filter((input) => input.snapshot).map((input) => ({
    original_path: path.join(repo, input.path),
    snapshot_path: path.join(root, input.snapshot),
    bytes: input.bytes,
    sha256: input.sha256,
  })),
  immutable_files_mode: "0444",
  immutable_directory_mode: "0555",
  old_FIRST_root: "untouched",
  approvals: verdict.approvals,
  no_future_stage_performed: true,
  usage: contract.usage,
});
const names = fs.readdirSync(root).sort();
for (const name of names) fs.chmodSync(path.join(root, name), 0o444);
fs.chmodSync(root, 0o555);
assert.equal(fs.statSync(root).mode & 0o777, 0o555);
for (const name of names) assert.equal(fs.statSync(path.join(root, name)).mode & 0o777, 0o444);
console.log(JSON.stringify({
  status: "frozen",
  textual_verdict: verdict.textual_verdict,
  actual_content_check_exit: result.status,
  check_execution_count: 1,
  checks: contentReport?.checks ?? null,
  directory: root,
  files: names.map(inventory),
  total_bytes: names.reduce((sum, name) => sum + fs.statSync(path.join(root, name)).size, 0),
  figure_and_whole_lesson_approval: false,
  image_opens: 0,
}, null, 2));
process.exitCode = passed ? 0 : 1;
