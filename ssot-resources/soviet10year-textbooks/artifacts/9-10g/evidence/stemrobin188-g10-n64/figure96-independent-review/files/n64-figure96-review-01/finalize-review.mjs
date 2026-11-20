import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const scope = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n64-figure96-review-01");
const author = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n64-text-review-figure-author-01");
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const read = (name) => JSON.parse(fs.readFileSync(path.join(scope, name), "utf8"));
function fileBinding(target) {
  const st = fs.statSync(target);
  return { path: path.resolve(target), sha256: hash(fs.readFileSync(target)), bytes: st.size, mode: (st.mode & 0o7777).toString(8).padStart(4, "0") };
}
function output(name, value) {
  const target = path.resolve(scope, name);
  assert.ok(target.startsWith(`${scope}/`));
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
}
const initial = read("input-before.json").bindings;
function currentInputs() {
  return initial.map((item) => {
    const after = fileBinding(item.path);
    return {
      role: item.role, path: item.path,
      sha256Before: item.sha256, sha256After: after.sha256,
      bytesBefore: item.bytes, bytesAfter: after.bytes,
      modeBefore: item.mode, modeAfter: after.mode,
      unchanged: item.sha256 === after.sha256 && item.bytes === after.bytes && item.mode === after.mode
    };
  });
}

assert.ok(currentInputs().every((item) => item.unchanged), "Inputs changed before review recording.");
const math = read("independent-math-check.json");
const mapping = read("source-comparison.json");
const visual = read("visual-review.json");
const browser = read("browser-receipt.recovery-01.json");
const failedBrowser = read("browser-receipt.json");
const first = read("source-FIRST-inventory.json");
const freeze = read("source-FIRST-freeze-receipt.json");
const spec = JSON.parse(fs.readFileSync(path.join(author, "spec.json"), "utf8"));
assert.equal(math.status, "pass");
assert.equal(mapping.status, "pass");
assert.equal(visual.status, "pass");
assert.equal(browser.status, "pass");
assert.equal(browser.browserClosed, true);
assert.equal(failedBrowser.status, "blocked");
assert.equal(failedBrowser.screenshots.length, 0);
assert.equal(freeze.sha256, fileBinding(path.join(scope, "source-FIRST-inventory.json")).sha256);
assert.equal(fileBinding(path.join(scope, "source-FIRST-inventory.json")).mode, "0444");
assert.equal(visual.actualImageInspections.length, 5);
assert.equal(browser.screenshots.length, 4);
const mappedIds = new Set(mapping.mappings.map((item) => item.firstId));
for (const item of [...first.subfigures, ...first.facts, ...first.relations]) assert.ok(mappedIds.has(item.id), `Unmapped FIRST observation ${item.id}`);
for (const item of mapping.mappings) {
  assert.equal(item.status, "pass");
  for (const id of item.objects ?? []) assert.ok(spec.objects.some((object) => object.id === id), id);
  for (const id of item.assertions ?? []) assert.ok(spec.assertions.some((assertion) => assertion.id === id), id);
  for (const id of item.independentChecks ?? []) assert.ok(math.checks.some((check) => check.id === id && check.status === "pass"), id);
}
assert.equal(mapping.findings.length + visual.findings.length, 0);
const ledger = {
  schema: "same188/figure-review-image-ledger@1",
  ticket: "STEMROBIN-188",
  assignment: "SAME188-6",
  scope,
  inheritedParentImages: 0,
  batches: [{
    batch: 1, limit: 8, actualImagesLoaded: 5,
    events: visual.actualImageInspections.map((event) => ({
      ordinal: event.ordinal, kind: event.kind, ...fileBinding(event.path),
      actuallyViewed: true, tool: "functions.view_image",
      reopen: false, crop: false,
      ...(event.scrollLeft === undefined ? {} : { scrollLeft: event.scrollLeft })
    }))
  }],
  cumulativeLimit: 24,
  actualImagesLoadedIntoContext: 5,
  originalImages: 1,
  modernImages: 4,
  crops: 0,
  reopens: 0,
  sourcePageImages: 0,
  historyImages: 0,
  browserScreenshotsCreated: 4,
  screenshotsActuallyViewed: 4,
  failedBrowserAttemptImages: 0,
  imagePayloadsReturnedToParent: 0
};
output("image-ledger.json", ledger);
output("technical-recovery.json", {
  schema: "same188/technical-recovery@1",
  status: "resolved",
  firstFailure: fileBinding(path.join(scope, "browser-receipt.json")),
  originalScript: fileBinding(path.join(scope, "independent-check.FIRST.mjs")),
  recoveryScript: fileBinding(path.join(scope, "independent-check.mjs")),
  recoveredBrowserEvidence: fileBinding(path.join(scope, "browser-receipt.recovery-01.json")),
  diagnosis: "Overbroad external-network route also aborted the local file SVG. This is a test-harness execution failure, not a mathematical or visual defect.",
  correction: "Allow exactly the current file SVG and this scope's offline HTML; keep context offline, service workers blocked, all other requests aborted, external name resolution disabled and a closed local proxy.",
  successfulStagesRepeated: [],
  reusedMath: fileBinding(path.join(scope, "independent-math-check.json")),
  rendererRerun: false,
  standaloneValidatorRerun: false,
  sourceReopened: false,
  extraImagesLoaded: 0,
  paidCalls: 0
});

// The existing recorder performs its own mandatory integrity guard internally.
// No standalone validator or renderer command is rerun.
const recorder = path.join(repo, ".agents/skills/ld-s10y-image/scripts/record_review.py");
const args = [
  recorder,
  "--spec", path.join(author, "spec.json"),
  "--render", path.join(author, "fig-g10-96.render.json"),
  "--output", path.join(scope, "fig-g10-96.review.json"),
  "--status", "pass",
  "--notes", `Independent SAME188-6 figure-only review. Source FIRST observed once and frozen 0444 before author/context: ${freeze.sha256}. Every source fact/relation and all 20 assertions reviewed; 3D tangent plane/line linked to projected objects without invented source lines or screen-right-angle claims. ${path.join(scope, "source-comparison.json")} SHA256 ${fileBinding(path.join(scope, "source-comparison.json")).sha256}; ${path.join(scope, "visual-review.json")} SHA256 ${fileBinding(path.join(scope, "visual-review.json")).sha256}. Actually viewed current 640px full SVG screenshot and mobile 390x844, 300px window at scrollLeft 0/170/340; final screen font em 26px >=16. Original+modern images 5, no reopens/crops. Existing renderer and modern-text PASS reused. Headless offline preview only, not headed product/whole-lesson acceptance. No promotion.`
];
assert.equal(fs.existsSync(path.join(scope, "fig-g10-96.review.json")), false, "Do not run the recorder again.");
const recordStart = new Date().toISOString();
const recorded = spawnSync("python3", args, {
  cwd: repo,
  encoding: "utf8",
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  timeout: 60000
});
output("record-review.receipt.json", {
  command: "python3", args, cwd: repo, startedAt: recordStart, finishedAt: new Date().toISOString(),
  invocationCount: 1, exitCode: recorded.status, signal: recorded.signal,
  stdout: recorded.stdout, stderr: recorded.stderr,
  error: recorded.error ? String(recorded.error) : null,
  pythonBytecodeWritesDisabled: true,
  standaloneValidatorInvocations: 0,
  recorderInternalIntegrityGuard: "The existing record_review.py calls validate() internally; this was not a separate passed pipeline-stage rerun.",
  output: fs.existsSync(path.join(scope, "fig-g10-96.review.json")) ? fileBinding(path.join(scope, "fig-g10-96.review.json")) : null
});
const inputBindings = currentInputs();
const stable = inputBindings.every((item) => item.unchanged);
const recorderPassed = recorded.status === 0 && fs.existsSync(path.join(scope, "fig-g10-96.review.json")) && read("fig-g10-96.review.json").status === "pass";
const status = stable && recorderPassed ? "pass" : "blocked";
const ownTemp = path.join(scope, "runtime-tmp");
assert.equal(browser.browserClosed, true);
if (fs.existsSync(ownTemp)) fs.rmSync(ownTemp, { recursive: true, force: true });
output("report.json", {
  schema: "same188/independent-figure-review-report@1",
  ticket: "STEMROBIN-188", assignment: "SAME188-6",
  lesson: "geo910-c2-s3-n64", figure: "fig-g10-96",
  status, completedAt: new Date().toISOString(), reviewerScope: scope,
  role: "Sole assigned in-flight independent figure reviewer; not the figure author; no parent image history.",
  findings: [],
  mathematics: {
    status: math.status, assertionsReviewed: math.assertionsReviewed,
    independentChecks: math.checks.length,
    evidence: fileBinding(path.join(scope, "independent-math-check.json")),
    result: "A and B are opposite sphere points; O is their center/midpoint; AB is normal to alpha; plane distance is R with unique contact A; a lies in alpha through A and has no other sphere intersection. All coordinates bind to the visible XY projection. No projected 90-degree or projected A/B-on-silhouette assumption."
  },
  sourceFidelity: {
    status: mapping.status,
    first: fileBinding(path.join(scope, "source-FIRST-inventory.json")),
    freezeReceipt: fileBinding(path.join(scope, "source-FIRST-freeze-receipt.json")),
    mapping: fileBinding(path.join(scope, "source-comparison.json")),
    allFirstFactsAndRelationsMapped: true,
    unmapped: [], unresolvedLabels: [], absentSourceLinesAdded: false,
    modernRegularizations: mapping.modernRegularizationsNotSourceFacts
  },
  visual: {
    status: visual.status,
    evidence: fileBinding(path.join(scope, "visual-review.json")),
    browserReceipt: fileBinding(path.join(scope, "browser-receipt.recovery-01.json")),
    actualCurrentSvgFirstVisualCheck: true,
    actualMediaWidthPx: 640,
    actualMobileViewportPx: [390, 844],
    actualMobileWindowWidthPx: 300,
    actualMobileScrollLeftPx: [0, 170, 340],
    maximumScrollLeftPx: 340,
    finalMinimumFontEmPx: 26,
    finalMinimumGlyphBBoxHeightPx: 30,
    requiredMinimumTextPx: 16,
    allLabelsReachable: true,
    intrinsicFigureClipping: false,
    headedProductTestPerformed: false,
    testedSurface: "Isolated headless offline current-SVG file preview; 640px media and 300px mobile scroll contract, not the headed application."
  },
  cultural: {
    status: visual.culturalReview.status,
    findings: [],
    result: "Only A/O/B/a and mathematical alpha are visible; no prohibited cultural text or symbols, invented scenario, numerical construction givens or answer marks."
  },
  inputBindings, allInputsUnchanged: stable,
  existingStagesReused: {
    rendererPass: fileBinding(path.join(author, "fig-g10-96.render.json")),
    draftValidationPass: fileBinding(path.join(author, "validate-draft-repair-01.receipt.json")),
    renderedValidationPass: fileBinding(path.join(author, "validate-rendered.receipt.json")),
    modernTextPass: fileBinding(path.join(author, "text-review.json")),
    modernTextRereviewed: false,
    wholeLessonPassClaimed: false
  },
  authorHistoryPreserved: {
    initialDraftFail: fileBinding(path.join(author, "validate-draft.receipt.json")),
    firstSpec: fileBinding(path.join(author, "spec.FIRST.json")),
    firstSvg: fileBinding(path.join(author, "fig-g10-96.FIRST.svg")),
    firstRender: fileBinding(path.join(author, "fig-g10-96.render.FIRST.json")),
    repairOne: fileBinding(path.join(author, "repair-01.json")),
    unchanged: inputBindings.filter((item) => item.role.startsWith("closed-author/")).every((item) => item.unchanged),
    additionalRepairsAllowedZeroIsHumanApprovalGate: false,
    reviewerRepairsPerformed: 0
  },
  technicalRecovery: fileBinding(path.join(scope, "technical-recovery.json")),
  review: recorderPassed ? fileBinding(path.join(scope, "fig-g10-96.review.json")) : null,
  recorderReceipt: fileBinding(path.join(scope, "record-review.receipt.json")),
  imageLedger: { ...ledger, evidence: fileBinding(path.join(scope, "image-ledger.json")) },
  scopeCompliance: {
    onlyWriteDirectory: scope,
    sourceEdits: 0, candidateEdits: 0, templateEdits: 0,
    wholeBookIndexEdits: 0, databaseCalls: 0, appEdits: 0,
    envFilesRead: 0, installations: 0, paidModelCalls: 0,
    gitOperations: 0, messagesToOtherChats: 0,
    rendererInvocations: 0, standaloneValidatorInvocations: 0,
    recordReviewInvocations: 1, sourcePageImagesOpened: 0,
    userDesktopBrowserUsed: false, externalNetworkAccess: false,
    browserClosed: true, ownBrowserTemporaryFilesRemoved: true,
    promotionPerformed: false, parentN66WorkTouched: false
  },
  limits: [
    "Figure-only substantive offline review; no new N64 text PASS or whole-lesson acceptance.",
    "Offline headless harness reproduces the explicitly requested width/scroll surface, not headed product acceptance.",
    "No integration, promotion, whole-book indexing, DB or application modification."
  ]
});
const outputs = fs.readdirSync(scope).sort().filter((name) => name !== "output-index.json").map((name) => {
  const target = path.join(scope, name);
  assert.equal(fs.lstatSync(target).isFile(), true, `Unexpected non-file output ${target}`);
  return fileBinding(target);
});
output("output-index.json", {
  schema: "same188/output-index@1", ticket: "STEMROBIN-188", assignment: "SAME188-6", scope,
  outputs
});
assert.ok(outputs.every((item) => item.path.startsWith(`${scope}/`) && /^[0-7]{4}$/.test(item.mode)));
assert.ok(currentInputs().every((item) => item.unchanged));
console.log(JSON.stringify({
  status, actualImagesLoaded: ledger.actualImagesLoadedIntoContext,
  report: fileBinding(path.join(scope, "report.json")),
  review: recorderPassed ? fileBinding(path.join(scope, "fig-g10-96.review.json")) : null,
  index: fileBinding(path.join(scope, "output-index.json")),
  indexedFiles: outputs.length,
  allInputsUnchanged: stable, recordReviewInvocations: 1
}, null, 2));
if (status !== "pass") process.exitCode = 1;
