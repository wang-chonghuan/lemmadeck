import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const expectedRoot = "/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d392-source185-text-affected-review";
assert.equal(root, expectedRoot);
const readJSON = (name) => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
const evidence = readJSON("exact-binding.json");
const report = readJSON("report.json");
const opens = readJSON("actual-opens.json");
const digest = (file) => {
  const stat = fs.lstatSync(file);
  assert.ok(stat.isFile());
  const bytes = fs.readFileSync(file);
  return {
    path: file,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    bytes: bytes.length,
    mode: `0${(stat.mode & 0o777).toString(8)}`,
  };
};

assert.equal(evidence.eligible, true);
assert.equal(evidence.failures.length, 0);
assert.equal(report.composition.eligible, true);
assert.equal(report.exactComparison.checkCount, evidence.checks.length);
assert.equal(report.exactComparison.sha256, digest(path.join(root, "exact-binding.json")).sha256);
assert.equal(opens.actualOpens.length, 0);
assert.deepEqual(report.totals, {
  old: 23, new: 0, cumulative: 23, limit: 24, reopens: 0, remaining: 1,
  historyBreakdown: { SOURCE181: 8, d369: 5, d376: 8, d383: 1, d386: 1 },
  budgetReset: false, imageHistoryClearedOrCompressed: false, imagePayloadsReturnedToParent: 0,
});
for (const key of ["SOURCE185", "RAW145", "RAW146", "RAW147"]) assert.equal(report[key], "PASS");
for (const input of evidence.inputBindings) {
  const current = digest(input.path);
  assert.equal(current.sha256, input.sha256, `Input changed: ${input.path}`);
  assert.equal(current.bytes, input.bytes);
  assert.equal(current.mode, input.mode);
}

const files = ["verify-affected.mjs", "exact-binding.json", "report.json", "actual-opens.json", "seal-evidence.mjs"];
assert.deepEqual(fs.readdirSync(root).sort(), [...files].sort());
for (const file of files) fs.chmodSync(path.join(root, file), 0o444);
const manifest = {
  schema: "source185-text-affected-review-freeze@1",
  ticket: "STEMROBIN-181",
  frozenUtc: new Date().toISOString(),
  outputDirectory: root,
  SOURCE185: report.SOURCE185,
  RAW145: report.RAW145,
  RAW146: report.RAW146,
  RAW147: report.RAW147,
  composition: { eligible: true, SOURCE185: "PASS", RAWVerdictKind: "INHERITED_PASS" },
  totals: report.totals,
  artifacts: files.map((file) => digest(path.join(root, file))),
  inputBindingsRecheckedUnchangedAtSeal: evidence.inputBindings.length,
  historicalD376HOLDAndD386REVISEPreserved: true,
  nativeRuns: 0,
  newImageOpens: 0,
  fullGate2PASS: false,
  fullDISPLAYPASS: false,
  fullCardPASS: false,
  canonicalPromoted: false,
  fileMode: "0444",
  selfHashPolicy: "Manifest excludes itself; its final SHA256 is returned as text.",
};
const manifestPath = path.join(root, "review-freeze.json");
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(manifestPath, 0o444);
for (const artifact of manifest.artifacts) {
  assert.deepEqual(digest(artifact.path), artifact);
  assert.equal(artifact.mode, "0444");
}
assert.equal(digest(manifestPath).mode, "0444");
console.log(JSON.stringify({
  SOURCE185: report.SOURCE185,
  RAW145: report.RAW145,
  RAW146: report.RAW146,
  RAW147: report.RAW147,
  compositionEligible: report.composition.eligible,
  totals: report.totals,
  inputBindingsRecheckedUnchangedAtSeal: evidence.inputBindings.length,
  outputs: [...manifest.artifacts, digest(manifestPath)],
}, null, 2));
