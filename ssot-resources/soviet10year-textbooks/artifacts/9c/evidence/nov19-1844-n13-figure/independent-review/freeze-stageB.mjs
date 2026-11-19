import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const repo = "/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck";
const out = path.join(repo, ".tmp/stemrobin-184-resume/n13-figure-independent-review");
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const describe = (filename) => {
  const bytes = fs.readFileSync(filename);
  return { path: filename, bytes: bytes.length, sha256: hash(bytes) };
};
const writeNew = (name, value) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(value, null, 2)}\n`, { flag: "wx", mode: 0o444 });
const result = JSON.parse(fs.readFileSync(path.join(out, "targeted-check.result.json"), "utf8"));
const receipt = JSON.parse(fs.readFileSync(path.join(out, "targeted-check.receipt.json"), "utf8"));
assert.equal(receipt.exitCode, 0);
assert.equal(receipt.stderr, "");
assert.equal(result.status, "pass-mechanical-only-pending-two-visual-views");
const integrity = result.inputs.map((input) => {
  const current = describe(input.path);
  assert.equal(current.bytes, input.bytes, `Input bytes changed: ${input.path}`);
  assert.equal(current.sha256, input.sha256, `Input hash changed: ${input.path}`);
  return { role: input.role, ...current };
});
const projected = describe(path.join(out, "tbl-p0056-01.smallest-331.png"));
assert.equal(projected.sha256, result.svgDom.projection.sha256);
const observedRasters = [
  { ...integrity.find((item) => item.role === "naturalRaster"), width: 360, height: 424, observedOnce: true, cumulativeAfter: 2 },
  { role: "actual331Raster", ...projected, width: 331, height: 390, observedOnce: true, cumulativeAfter: 3, projectionOfSvgSha256: result.svgDom.projection.sourceSvgSha256 },
];
const binding = (role) => integrity.find((item) => item.role === role);
writeNew("independent.verdict.json", {
  schema: "independent-bounded-figure-verdict@1",
  ticket: "STEMROBIN-184",
  lesson: "ana9-c3-s1-n13",
  figure: "tbl-p0056-01",
  stage: "B",
  status: "pass",
  scope: "Formal independent figure review and exact intended metadata approval only; not whole-lesson PASS or promotion.",
  recordedAt: new Date().toISOString(),
  sameReviewerStageAAndB: true,
  independentSourceFIRST: binding("independentFIRST"),
  inputs: integrity,
  observedRasters,
  commandEvidence: {
    result: describe(path.join(out, "targeted-check.result.json")),
    receipt: describe(path.join(out, "targeted-check.receipt.json")),
    actualStdout: describe(path.join(out, "targeted-check.stdout.txt")),
    actualStderr: describe(path.join(out, "targeted-check.stderr.txt")),
    exitCode: receipt.exitCode,
    targetedInvocations: 1,
    officialRendererInvocations: 0,
    officialValidatorInvocations: 0,
    previousStageCheckReplays: 0,
  },
  semanticVisualEvidence: describe(path.join(out, "semantic-visual-review.md")),
  groupVerdicts: [
    { group: "division-header", status: "pass", existingAssertionsEvaluated: 10, evidence: "Literal 55/12/0.218, roof and hook sides, angular regularization declared, actual SVG text and line endpoints matched and both rasters observed." },
    { group: "digit-columns", status: "pass", existingAssertionsEvaluated: 29, evidence: "Every FIRST glyph mapped to an actual spec point and SVG label; all rows and shared columns preserved, no invented zeros or repeated digits." },
    { group: "subtraction-bars", status: "pass", existingAssertionsEvaluated: 15, evidence: "Exactly three solid bars, correct paired neighboring rows, inset and extents; full right/bottom stroke and glyph boundaries checked and observed." },
    { group: "recurrence-track", status: "pass", existingAssertionsEvaluated: 11, evidence: "Both actual triangular heads point RIGHT toward the correct leading 1; tips and glyph clearance measured; shared track is an unheaded segment, not an upward return arrow." },
  ],
  assertionVerdict: {
    status: "pass",
    evaluated: 65,
    types: { displacement: 54, connects: 9, pointOnLine: 2 },
    coverage: "Every assertion has a source group; every mapped point has a wholly in-group relationship; all segment/arrow literal anchors are tied to fixed actual endpoints.",
    notCountOnly: true,
    perAssertionExpectedObservedRecords: "targeted-check.result.json / assertionAudit",
  },
  mathematicalReview: { status: "pass", evidence: "Internal arithmetic of 12/55 matches quotient digits 2/1/8, products 110/55/440 and repeated remainder 10; no extra visible answers or source-absent steps." },
  culturalReview: { status: "pass", evidence: "Only source digits, decimal point and mathematical strokes visible; no cultural words/symbols, texture or answer annotation." },
  visualReview: {
    status: "pass",
    widthsActuallyObserved: [360, 331],
    smallestIsActualPixelProof: true,
    minTextPxAt331: result.svgDom.minTextPx,
    fullBoundaryEvidence: result.svgDom.boundaryEvidence,
    actualHeadEvidence: result.svgDom.arrowHeadAudit,
    labelCollisions: [],
    projectionLimit: "Isolated full SVG projection, not running-product or whole-lesson acceptance.",
  },
  intendedMetadataApproval: {
    status: "approved-exact-intended-bytes-not-promoted",
    originalReport: binding("originalReport"),
    intendedReport: binding("intendedReport"),
    projectionReceipt: binding("intendedReceipt"),
    actualCandidateSpec: binding("spec"),
    actualCandidateSvg: binding("svg"),
    exactChangedFields: ["spec.path", "output.svg.path"],
    futureSpecPath: result.metadataProjection.differences.find((item) => item.field === "spec.path").intended,
    futureSvgPath: result.metadataProjection.differences.find((item) => item.field === "output.svg.path").intended,
    futureDestinationExistenceNotAsserted: true,
    approvalInvalidatedByAnyBoundByteChange: true,
  },
  usage: {
    imagesBeforeStageB: 1, newVisualLoads: 2, cumulativeImages: 3, maximum: 4, remaining: 1,
    reset: false, sourceReopens: 0, crops: 0, candidateNaturalViews: 1, actual331Views: 1,
    unviewed350Raster: true, parentPermanentImages: 24, parentMaximum: 24, returnPayload: "TEXT_ONLY",
    paidCalls: 0, officialRendererRuns: 0, officialValidatorRuns: 0, headlessProjectionRuns: 1,
    headedBrowsers: 0, userWindowUse: 0, browserClosed: true,
  },
  retainedUnknowns: [
    { id: "src-limit-speck", status: "UNKNOWN", detail: "StageA source-speck origin/intention remains unknown; no mathematical role was inferred and no history judgment is added." },
    { id: "src-limit-metrics", status: "UNKNOWN_EXACT_METRICS", detail: "Original scan metrics remain visual estimates; modern layout regularization is declared." },
  ],
  preservedOtherEvidence: "No prior FIRST, FAIL, UNKNOWN, StageA file or candidate file edited. Earlier author-context mismatch is not erased; this verdict binds the current templates.",
  failures: [],
  blockers: [],
  promotionPerformed: false,
  recordReviewPerformed: false,
  canonicalWrites: false,
  wholeLessonApproval: false,
  stop: "Parent intake only. No promotion, publisher, DB, backend, Git/history, paid call or other worker message.",
});
const names = fs.readdirSync(out).sort();
assert.ok(!names.includes("manifest.json"));
const files = names.map((name) => {
  const filename = path.join(out, name);
  assert.ok(fs.lstatSync(filename).isFile(), `Unexpected leftover runtime: ${filename}`);
  fs.chmodSync(filename, 0o444);
  return describe(filename);
});
const evidenceBytes = files.reduce((total, file) => total + file.bytes, 0);
writeNew("manifest.json", {
  schema: "hash-bound-independent-figure-manifest@1",
  status: "pass-figure-only-parent-intake",
  mode: "0444",
  inputs: integrity,
  observedRasters,
  files,
  fileCountExcludingManifest: files.length,
  bytesExcludingManifest: evidenceBytes,
  usage: { cumulativeImages: 3, maximum: 4, remaining: 1, reset: false, paidCalls: 0 },
  selfExcluded: "This manifest is excluded from its own hash list. Its bytes and SHA-256 are emitted separately.",
});
for (const file of files) {
  assert.equal(fs.statSync(file.path).mode & 0o777, 0o444);
  assert.equal(describe(file.path).sha256, file.sha256);
}
const manifest = describe(path.join(out, "manifest.json"));
assert.equal(fs.statSync(manifest.path).mode & 0o777, 0o444);
console.log(JSON.stringify({
  status: "pass-figure-only-parent-intake",
  independentVerdict: describe(path.join(out, "independent.verdict.json")),
  approvedIntendedReport: binding("intendedReport"),
  actualCandidateSpec: binding("spec"),
  actualCandidateSvg: binding("svg"),
  observedRasters,
  files,
  manifest,
  fileCountIncludingManifest: files.length + 1,
  bytesIncludingManifest: evidenceBytes + manifest.bytes,
  mode: "0444",
  imageUsage: "3/4 cumulative, not reset; parent24/24; text only",
  stop: "No promotion or whole-lesson approval.",
}, null, 2));
