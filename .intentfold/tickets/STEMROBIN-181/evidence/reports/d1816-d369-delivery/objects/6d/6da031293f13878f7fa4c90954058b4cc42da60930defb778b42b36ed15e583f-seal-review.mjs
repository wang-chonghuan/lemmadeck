import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const own = path.join(process.cwd(), ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d367-n149-layout-context-review");
const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
const bind = p => {
  const bytes = fs.readFileSync(p);
  return {path: path.resolve(p), bytes: bytes.length, sha256: crypto.createHash("sha256").update(bytes).digest("hex")};
};
const report = read(path.join(own, "report.json"));
const initial = read(path.join(own, "input-freeze.json"));
const evidence = read(path.join(own, "comparison-observations.json"));
const inputBindings = [initial.manifest, initial.expectations, ...initial.declared.filter(b => b.matches !== undefined), ...initial.additional];
const inputs = [...new Map(inputBindings.map(b => [b.path, b])).values()].map(b => ({
  ...bind(b.path), reviewedSha256: b.sha256, unchanged: bind(b.path).sha256 === b.sha256
}));
const evidenceMatches = bind(report.evidence.comparison.path).sha256 === report.evidence.comparison.sha256;
const allInputsUnchanged = inputs.every(b => b.unchanged);
const localeChecksPass = evidence.localeObservations.every(l =>
  l.currentWorkingBytesEqualAfterSnapshot && l.beforeMatchesD355ReviewedText && l.beforeMatchesD347ApprovedAfter &&
  l.sourceSnapshotsUnchangedAndExactRaw && l.fixedMetadataUnchanged && l.onlyAllowedFieldsChanged &&
  l.normalization.beforeNormalizationProducesAfterProse && l.normalization.currentLessonUnchangedAfterTwoNormalizations &&
  l.currentFlow.exitCode === 0 && l.boundaryChecks.every(b => b.currentUniqueAdjacentPair && b.unchangedCompactTextPosition) &&
  l.perBlock.every(b => b.compactTextUnchanged && b.formulaBodiesUnchanged && b.digitSequenceUnchanged && b.protectedEntryMetadataUnchanged));
const figureChecksPass = evidence.figure.allOtherSpecFieldsExactlyUnchanged &&
  evidence.figure.completeAuthoritativeTextExactlyCurrentTemplates &&
  evidence.figure.onlyFiveExpectedContextEntriesChanged &&
  evidence.figure.oldAndCanonicalPNGHashesIdenticalAndMatchDeclared && evidence.figure.svgMatchesD344AndD355;
if (!allInputsUnchanged || !evidenceMatches || !localeChecksPass || !figureChecksPass) {
  throw new Error("Affected evidence drift/inconsistency; do not seal a stale PASS.");
}
const output = {
  schema: "stemrobin181/independent-review-freeze@1",
  stage: "D367",
  frozenAtUtc: new Date().toISOString(),
  status: report.status,
  report: bind(path.join(own, "report.json")),
  artifacts: fs.readdirSync(own).sort().filter(f => f !== "review-freeze.json").map(f => bind(path.join(own, f))),
  exactInputs: inputs,
  allInputsUnchanged,
  evidenceMatches,
  elapsedMsSinceInputFreeze: Date.now() - Date.parse(initial.frozenAtUtc),
  usage: report.usage,
  imagesOpened: 0,
  producerCalls: 0,
  boundary: "D367 is sealed before inspecting D371 candidate inputs."
};
fs.writeFileSync(path.join(own, "review-freeze.json"), JSON.stringify(output, null, 2) + "\n", {flag: "wx"});
console.log(JSON.stringify({stage: "D367", status: output.status, allInputsUnchanged, report: output.report, reviewFreeze: bind(path.join(own, "review-freeze.json"))}, null, 2));
