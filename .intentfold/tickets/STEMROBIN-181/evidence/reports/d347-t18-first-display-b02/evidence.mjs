import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const output = path.dirname(fileURLToPath(import.meta.url));
const planPath = path.join(root, ".intentfold/tickets/STEMROBIN-181/evidence/reports/d339-t18-first-display-progress.json");
const expectedPlan = "65564acc9947d2b8e46a818685f2f31177cca4840f21a7e3979730274be70552";
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ensure = (condition, message) => { if (!condition) throw new Error(message); };
ensure(hash(planPath) === expectedPlan, "Retained plan hash mismatch");
const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const selected = plan.pendingBatches[0].tiles;
ensure(selected.length === 8, "Assignment must contain exactly eight tiles");
const expectedNames = [
  "d335-t18-existing-desktop-capture-tiles/en-choices-sheet-003.png",
  "d335-t18-existing-desktop-capture-tiles/en-choices-sheet-004.png",
  "d335-t18-existing-desktop-capture-tiles/en-choices-sheet-005.png",
  "d335-t18-existing-desktop-capture-tiles/en-choices-sheet-006.png",
  "d335-t18-existing-desktop-capture-tiles/en-choices-sheet-007.png",
  "d337-t18-mobile-choice-display/zh-choices-sheet-001.png",
  "d337-t18-mobile-choice-display/zh-choices-sheet-002.png",
  "d337-t18-mobile-choice-display/zh-choices-sheet-003.png",
];
selected.forEach((tile, i) => ensure(tile.path.endsWith(expectedNames[i]), "Assignment order mismatch"));
const logPath = path.join(output, "actual-opens.json");
const log = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, "utf8")) : {
  schema: "t18-first-display-actual-opens@1",
  ticket: "STEMROBIN-181",
  batch: 2,
  selection: "pendingBatches[0].tiles",
  plan: { path: planPath, sha256: expectedPlan },
  imageCountAtContextStart: 0,
  imageCountInThisBatch: 0,
  imageCountInThisContext: 0,
  batchLimit: 8,
  contextLimit: 24,
  compactionReset: false,
  parentImagesReceived: 0,
  reopenedImages: 0,
  fullScreenshotsOpened: 0,
  otherImagesOpened: 0,
  opens: [],
};
const saveLog = () => fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + "\n");
function before(ordinal) {
  ensure(log.opens.length === ordinal - 1, "Open order mismatch");
  ensure(log.opens.every((entry) => entry.status === "OPENED-HASH-VERIFIED"), "Previous open incomplete");
  const tile = selected[ordinal - 1];
  const absolute = path.resolve(root, tile.path);
  const actual = hash(absolute);
  ensure(actual === tile.sha256, "Pre-open tile hash mismatch");
  const entry = {
    ordinal,
    path: absolute,
    expectedSHA256: tile.sha256,
    beforeSHA256: actual,
    beforeVerifiedAt: new Date().toISOString(),
    tool: "functions.view_image",
    detail: "original",
    openCount: 0,
    status: "PRE-OPEN-HASH-VERIFIED",
    language: tile.language,
    crop: tile.crop,
    contentRanges: tile.contentRanges,
    originalPixels: tile.originalPixels,
    resampled: tile.resampled,
  };
  log.opens.push(entry);
  saveLog();
  console.log(JSON.stringify(entry));
}
function after(ordinal) {
  const entry = log.opens[ordinal - 1];
  ensure(entry?.status === "PRE-OPEN-HASH-VERIFIED", "No pending open");
  const actual = hash(entry.path);
  ensure(actual === entry.expectedSHA256 && actual === entry.beforeSHA256, "Post-open tile hash mismatch");
  entry.afterSHA256 = actual;
  entry.afterVerifiedAt = new Date().toISOString();
  entry.openCount = 1;
  entry.status = "OPENED-HASH-VERIFIED";
  entry.openSuccess = true;
  log.imageCountInThisBatch += 1;
  log.imageCountInThisContext += 1;
  saveLog();
  console.log(JSON.stringify({ ordinal, afterSHA256: actual, status: entry.status, count: log.imageCountInThisBatch }));
}
function freeze() {
  ensure(log.imageCountInThisBatch === 8 && log.imageCountInThisContext === 8, "Exactly eight successful opens required");
  ensure(log.opens.length === 8 && log.opens.every((entry) => entry.openCount === 1 && entry.status === "OPENED-HASH-VERIFIED"), "Incomplete open log");
  const reportPath = path.join(output, "report.json");
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  ensure(report.actualOpenCount === 8 && report.tiles.length === 8, "Report count mismatch");
  const inputs = [
    { path: planPath, sha256: expectedPlan, role: "retained-assignment-plan" },
    ...selected.map((tile, i) => ({
      path: path.resolve(root, tile.path),
      sha256: tile.sha256,
      role: "original-detail-opened-tile",
      openOrdinal: i + 1,
      beforeSHA256: log.opens[i].beforeSHA256,
      afterSHA256: log.opens[i].afterSHA256,
      contentRanges: tile.contentRanges,
    })),
  ];
  inputs.forEach((input) => ensure(hash(input.path) === input.sha256, "Freeze input hash mismatch"));
  const ownNames = fs.readdirSync(output).sort();
  ensure(JSON.stringify(ownNames) === JSON.stringify(["actual-opens.json", "evidence.mjs", "report.json"]), "Unexpected own output");
  const outputs = ownNames.map((name) => {
    const file = path.join(output, name);
    fs.chmodSync(file, 0o444);
    const stat = fs.statSync(file);
    ensure((stat.mode & 0o777) === 0o444, "Output not read-only");
    return { path: file, sha256: hash(file), bytes: stat.size, mode: "0444" };
  });
  const manifestPath = path.join(output, "output-frozen-manifest.json");
  const manifest = {
    schema: "t18-first-display-output-frozen-manifest@1",
    ticket: "STEMROBIN-181",
    batch: 2,
    outputFrozen: true,
    status: "TRUE",
    frozenAt: new Date().toISOString(),
    actualOpenCount: 8,
    inputs,
    outputs,
    manifestSelf: {
      path: manifestPath,
      mode: "0444",
      sha256Location: "Final textual return, not embedded recursively in this manifest",
      excludedFromOutputsToAvoidSelfReference: true,
    },
    scope: "Original-pixel visual display observations only; unseen scope HOLD; no full-card, Gate2, or AC approval",
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", { flag: "wx", mode: 0o444 });
  fs.chmodSync(manifestPath, 0o444);
  outputs.forEach((file) => ensure(hash(file.path) === file.sha256 && (fs.statSync(file.path).mode & 0o777) === 0o444, "Frozen output verification failed"));
  ensure((fs.statSync(manifestPath).mode & 0o777) === 0o444, "Manifest not read-only");
  console.log(JSON.stringify({ outputFrozen: true, inputsVerified: inputs.length, actualOpenCount: 8, outputs: [...outputs, { path: manifestPath, sha256: hash(manifestPath), mode: "0444" }] }, null, 2));
}
const [phase, ordinalText] = process.argv.slice(2);
const ordinal = Number(ordinalText);
if (phase === "before") before(ordinal);
else if (phase === "after-next") { after(ordinal); before(ordinal + 1); }
else if (phase === "after") after(ordinal);
else if (phase === "freeze") freeze();
else throw new Error("Expected before, after-next, after, or freeze");
