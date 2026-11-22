import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";

const root = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
assert.equal(process.cwd(), root);
const mode = process.argv[2];
assert.ok(["pending", "complete"].includes(mode));
const scratch = ".tmp/stemrobin-184-six";
const file = ".intentfold/tickets/STEMROBIN-184/usage.json";
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const bind = (file) => ({ path: file, sha256: hash(fs.readFileSync(file)) });
const usage = JSON.parse(fs.readFileSync(file));
assert.equal(Object.keys(usage).length, 524);
const others = ({ nov22_1846_production_resume, ...rest }) => hash(JSON.stringify(rest));
const before = others(usage);
assert.equal(before, "d60934a3024a940de18dee6fd57df19c53e482228f0efe47f04874b26d8366be");
const entry = usage.nov22_1846_production_resume;
const current = entry.laterContinuationNov22;
const record = {
  sameInvocation: true, finish: "review",
  status: mode === "complete" ? "N88_OFFLINE_REVIEW_READY_DELIVERY_PENDING_PRODUCTION_ACTIVE" :
    "N88_CANONICAL_FINALIZED_CHOICES_RETAINED_AFFECTED_PROSE_DISPLAY_RUNNING",
  cropReview: {
    report: bind(`${scratch}/n88-original-crop-gap-first/report.md`),
    originalFreeze: bind(`${scratch}/n88-original-crop-gap-first/original-freeze.md`),
    execution: bind(`${scratch}/n88-original-crop-gap-first/execution.md`),
    status: "PASS38-41_OBJECT_PRESERVATION_ONLY",
    agent: "01a202b5-163d-7a40-9da3-6053f6f8fdba", actuallyClosed: true,
    imageOpens: 7, pixelDecodes: 7, views: 8, newRois: 1,
    originalEncodingFaintInkOffscaleIntent: "UNKNOWN",
  },
  promotion: bind(`${scratch}/n88-canonical-ready/promotion.json`),
  nativeExecutions: Object.fromEntries([
    "promotion-first", "canonical-reindex-first", "reindex-fragment-focused-tests",
    "canonical-reindex-fragment-recovery", "canonical-finalize-first",
    "current-choice-binding-first", "current-choice-retention-first",
    "delivery-fetch-first", "delivery-remote-head-first",
  ].map(stage => [stage, bind(`${scratch}/n88-stage-executions/${stage}/execution.json`)])),
  firstReindexFailure: "Pre-existing unclaimed unnumbered continuation fragment; preserved, not deleted",
  reindexFocusedTests: 3, canonicalFinalizerExit: 0,
  allFourCanonicalReadyJsonsByteExactRawReady: true,
  currentChoiceBinding: bind(`${scratch}/n88-current-choice-binding/binding-refresh.json`),
  choicesRetainedInternalValidatorExit: 0,
  all34Exercises18Questions72OptionsSolutionsCoverageAndReviewObjectsExact: true,
  onlyConceptBlocks0_8_17_26NativeRepresentationNormalization: true,
  noSourceOrMathOrFigureOrChoiceOrWrittenDisplayReplay: true,
  baseRetention: bind("ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov22-1846-n88-ready-delivery/retention-base.json"),
  affectedDisplay: {
    agent: "01a202bf-a110-7242-8221-57bdc35e52eb",
    root: `${scratch}/n88-ready-prose-display-affected-first`,
    status: mode === "complete" ? "PASS" : "SCREENSHOT_ONLY_GAP_RECOVERY_RUNNING_FIRST_DOM_AND_METADATA_PASS_REUSED",
    normalizedBlocks: [0, 5, 8, 12, 17, 21, 23, 26],
    sectionBoundaries: 5, firstScreenshotViews: 8, newRecoveryBatchMaxViews: 2,
    firstFindings: bind(`${scratch}/n88-ready-prose-display-affected-first/findings.json`),
    firstManifest: bind(`${scratch}/n88-ready-prose-display-affected-first/manifest.json`),
    actualFirstScope: "DOM21paragraphs/5boundaries/4metadata transfers PASS; missing desktop5/8/boundary1 and masked mobileboundary2 visual observation only",
    countClarification: "50flowitems =42prose paragraphs +4figures +4captions",
    ...(mode === "complete" ? { completion: bind(process.argv[3]), actuallyClosed: true } : {}),
  },
  completedLessons: mode === "complete" ? 1 : 0,
  parentPermanentImageBudget: "24/24 exhausted", parentImageViewsOrDecodes: 0,
  knownCharges: 74, paidGenerationCalls: 0, fees: "UNKNOWN",
  databaseWritesPublicationsMergesDeployments: 0,
  allOtherDirtFailuresHoldsAndUsagePreserved: true,
};
current.n88CanonicalReadyContinuation = record;
entry.status = record.status;
current.newCompletedLessons = record.completedLessons;
entry.preservation.newCompletedLessons = record.completedLessons;
assert.equal(others(usage), before);
fs.writeFileSync(file, JSON.stringify(usage, null, 2) + "\n");
assert.equal(others(JSON.parse(fs.readFileSync(file))), before);
console.log(JSON.stringify({ status: record.status, keys: 524, other523Sha256: before,
  completedLessons: record.completedLessons, usage: bind(file) }));
