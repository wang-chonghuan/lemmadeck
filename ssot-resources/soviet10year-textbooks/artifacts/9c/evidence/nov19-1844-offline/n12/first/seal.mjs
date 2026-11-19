import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const out = path.dirname(fileURLToPath(import.meta.url));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const bytes = (name) => readFileSync(path.join(out, name));
const json = (name) => JSON.parse(bytes(name));
const bind = (name) => ({ path: path.join(out, name), bytes: bytes(name).length, sha256: hash(bytes(name)) });
const write = (name, value) => writeFileSync(path.join(out, name), value, { flag: "wx" });
const writeJson = (name, value) => write(name, `${JSON.stringify(value, null, 2)}\n`);
const reportBefore = bytes("report.json");
const mdBefore = bytes("report.md");
const report = JSON.parse(reportBefore);
const observations = json("visual-observations.json");
const closeoutStdout = bytes("closeout.native.stdout").toString();
const closeoutOutput = JSON.parse(closeoutStdout);
const closeoutReceipt = json("closeout.native-exit.json");
assert.equal(hash(reportBefore), closeoutOutput.report.sha256);
assert.equal(hash(mdBefore), closeoutOutput.markdown.sha256);
assert.equal(closeoutReceipt.actual_exit, 0);
assert.equal(closeoutReceipt.script_sha256, bind("closeout.mjs").sha256);
assert.equal(closeoutReceipt.stdout_sha256, bind("closeout.native.stdout").sha256);
assert.equal(closeoutReceipt.stderr_sha256, bind("closeout.native.stderr").sha256);
const priorObservation = report.evidence_bindings.find((entry) => entry.path.endsWith("/visual-observations.json"));
assert.ok(priorObservation);
for (const entry of report.evidence_bindings) {
  if (entry === priorObservation) continue;
  assert.equal(hash(readFileSync(entry.path)), entry.sha256, `Changed evidence: ${entry.path}`);
}
assert.equal(report.visual_gate_verdict, "FAIL");
assert.equal(report.original_native_check_exit, 1);
assert.equal(observations.actual_opens_this_batch, 6);
assert.equal(observations.visual_verdict, "FAIL");
assert.equal(observations.pages[3].finding_ids[0], "F001");

write("report.preseal.json", reportBefore);
write("report.preseal.md", mdBefore);
const correction = {
  reason: "Text-only finalization before intake; no evidence collection or gate replay.",
  changes: [
    "Describe the visible -117 and stacked 1/3 notation without implying multiplication.",
    "Describe the captured paragraph/formula indices instead of implying an unverified CSS nth-of-type selector."
  ],
  observation_before: priorObservation,
  observation_after: bind("visual-observations.json"),
  preseal_report: bind("report.preseal.json"),
  preseal_markdown: bind("report.preseal.md"),
  closeout_native_stdout_report_hash_matches_preseal: true,
  native_capture_and_closeout_streams_modified: false,
  new_browser_or_image_operations: 0,
  verdicts_or_mathematics_changed: false
};
writeJson("editorial-finalization.json", correction);
report.findings = observations.findings;
report.evidence_bindings = report.evidence_bindings.map((entry) =>
  entry === priorObservation ? bind("visual-observations.json") : entry);
report.evidence_bindings.push(...[
  "closeout.mjs", "closeout.native.stdout", "closeout.native.stderr", "closeout.native-exit.json",
  "report.preseal.json", "report.preseal.md", "editorial-finalization.json", "seal.mjs"
].map(bind));
report.editorial_finalization = correction;
report.native_command_exits.closeout_utility = 0;
report.native_command_exits.sealing_utility = "Actual native receipt is in seal.native-exit.json, captured after this utility returns.";
writeFileSync(path.join(out, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(path.join(out, "report.md"), `${mdBefore.toString()}
## Finalization

Closeout utility exit was 0; it only created artifacts and does not replace visual-check exit 1. Its original stdout's report hashes match preserved \`report.preseal.json/md\`. Before intake, two text-only description corrections were applied and rebound in the final report; \`editorial-finalization.json\` records them. No image, browser, source mathematics or gate was replayed.
`);

const finalReport = json("report.json");
for (const entry of finalReport.evidence_bindings) {
  assert.equal(hash(readFileSync(entry.path)), entry.sha256, `Final binding mismatch: ${entry.path}`);
}
for (const entry of finalReport.input_bindings) {
  assert.equal(hash(readFileSync(entry.path)), entry.sha256, `HTML changed: ${entry.path}`);
}
const ledger = json("images-ledger.json");
assert.equal(ledger.actual_opens, 6);
assert.equal(ledger.actual_captures, 6);
assert.ok(ledger.entries.every((image) => image.image_open_count === 1));
assert.equal(finalReport.visual_gate_verdict, "FAIL");
assert.equal(finalReport.semantic_verdict, "NOT_REVIEWED_AWAITING_FRANKLIN");
assert.equal(json("check.native-exit.json").actual_exit, 1);
console.log(JSON.stringify({
  sealing_integrity: "PASS", visual_gate_verdict: "FAIL", native_visual_exit: 1,
  source_HTMLs_unchanged: true, screenshots_unchanged: true,
  images_opened: 6, reopened: 0,
  final_report: bind("report.json"), final_markdown: bind("report.md"),
  images_ledger: bind("images-ledger.json")
}, null, 2));
