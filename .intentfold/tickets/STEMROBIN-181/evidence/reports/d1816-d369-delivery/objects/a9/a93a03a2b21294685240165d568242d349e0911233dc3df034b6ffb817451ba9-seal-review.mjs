import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const own = path.join(process.cwd(), ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d358-n151-first-text-review");
const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
const bind = p => {
  const bytes = fs.readFileSync(p);
  return {path: path.resolve(p), bytes: bytes.length, sha256: crypto.createHash("sha256").update(bytes).digest("hex")};
};
const report = read(path.join(own, "report.json"));
const initial = read(path.join(own, "input-freeze.json"));
const primary = read(path.join(own, "primary-evidence.json"));
const comparison = read(path.join(own, "comparison-observations.json"));
const namedEvidence = [
  ...Object.values(report.independence).filter(v => v && typeof v === "object" && v.path),
  report.bindings.comparisonEvidence
];
const namedEvidenceMatches = namedEvidence.every(b => bind(b.path).sha256 === b.sha256);
const inputBindings = [
  initial.d357Package,
  ...initial.declaredBindings,
  ...initial.sourcePages,
  ...initial.authority,
  ...primary.references.flatMap(r => [r.receipt, r.stdout, r.stderr].filter(Boolean)),
  primary.fermilab,
  ...comparison.retainedAuthorEvidence,
  ...comparison.retainedSourceReviews,
  ...comparison.locales.flatMap(l => [l.bindings.flowReceipt, ...l.auxiliary.flatMap(a => [a.current, a.originalAuthorWorking])]),
  comparison.currentD361IdentityCode
];
const inputs = [...new Map(inputBindings.map(b => [b.path, b])).values()].map(b => ({
  ...bind(b.path), reviewedSha256: b.sha256, unchanged: bind(b.path).sha256 === b.sha256
}));
const allInputsUnchanged = inputs.every(b => b.unchanged);
if (!namedEvidenceMatches || !allInputsUnchanged) throw new Error("Reviewed input/evidence drift; do not seal a stale verdict.");
const output = {
  schema: "stemrobin181/independent-review-freeze@1",
  stage: "D358",
  frozenAtUtc: new Date().toISOString(),
  status: report.status,
  SCI: report.SCI.status,
  ZHEN: report.ZHEN.status,
  report: bind(path.join(own, "report.json")),
  artifacts: fs.readdirSync(own).sort().filter(f => f !== "review-freeze.json").map(f => bind(path.join(own, f))),
  exactInputs: inputs,
  allInputsUnchanged,
  namedEvidenceMatches,
  elapsedMsSinceIndependentSourceFreeze: Date.now() - Date.parse(initial.frozenAtUtc),
  imagesOpened: 0,
  nativeProducerCalls: 0,
  usage: report.usage,
  boundary: "D358 first-review source/science expectations and verdict are frozen before opening D367 inputs."
};
fs.writeFileSync(path.join(own, "review-freeze.json"), JSON.stringify(output, null, 2) + "\n", {flag: "wx"});
console.log(JSON.stringify({stage: "D358", status: output.status, SCI: output.SCI, ZHEN: output.ZHEN, allInputsUnchanged, report: output.report, reviewFreeze: bind(path.join(own, "review-freeze.json"))}, null, 2));
