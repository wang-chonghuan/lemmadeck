import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const output = path.dirname(fileURLToPath(import.meta.url));
const planPath = path.join(root, ".intentfold/tickets/STEMROBIN-181/evidence/reports/d339-t18-first-display-progress.json");
const expectedPlanSHA256 = "65564acc9947d2b8e46a818685f2f31177cca4840f21a7e3979730274be70552";
const ensure = (condition, message) => { if (!condition) throw new Error(message); };
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const hashFile = (file) => sha256(fs.readFileSync(file));
ensure(hashFile(planPath) === expectedPlanSHA256, "Frozen plan changed");
const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const tiles = plan.pendingBatches[5].tiles;
ensure(tiles.length === 8, "Expected eight assigned tiles");
tiles.forEach((tile, i) => {
  const filename = `en-answers-1440-sheet-${String(i + 3).padStart(3, "0")}.png`;
  ensure(tile.path.endsWith(`/d338-t18-written-answer-display/${filename}`), "Wrong assigned tile");
  ensure(tile.language === "en" && tile.originalPixels === true && tile.resampled === false, "Not original assigned English pixels");
});
function inspectInput(tile) {
  const absolute = path.resolve(root, tile.path);
  const bytes = fs.readFileSync(absolute);
  ensure(sha256(bytes) === tile.sha256, "Tile hash changed");
  ensure(bytes.subarray(0, 8).toString("hex") === "89504e470d0a1a0a", "Not a PNG");
  ensure(bytes.readUInt32BE(8) === 13 && bytes.toString("ascii", 12, 16) === "IHDR", "Bad PNG IHDR");
  const png = {
    signature: "89504e470d0a1a0a",
    firstChunk: "IHDR",
    headerLength: 13,
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    bitDepth: bytes[24],
    colorType: bytes[25],
    compression: bytes[26],
    filter: bytes[27],
    interlace: bytes[28],
    fileBytes: bytes.length,
  };
  ensure(png.width === tile.crop.width && png.height === tile.crop.height, "PNG dimensions differ from crop");
  return { path: absolute, sha256: tile.sha256, png, verifiedAt: new Date().toISOString() };
}
const logPath = path.join(output, "actual-opens.json");
const log = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, "utf8")) : {
  schema: "t18-first-display-actual-opens@1",
  ticket: "STEMROBIN-181",
  batch: 7,
  selection: "pendingBatches[5].tiles",
  plan: { path: planPath, sha256: expectedPlanSHA256 },
  imageCountAtContextStart: 0,
  retainedActualImageCountBeforeResume: 8,
  retainedHistorySource: "Earlier d343 batch02 in this same chat; no reset, compaction or reopen",
  newImageCountInThisBatch: 0,
  actualImageCountInThisContext: 8,
  batchLimit: 8,
  contextLimit: 24,
  countResetOnResume: false,
  retainedImagesCleared: false,
  reopens: 0,
  otherImagesOpened: 0,
  fullScreenshotsOpened: 0,
  sourceImagesOpened: 0,
  newCapturesRendersCropsScales: 0,
  opens: [],
};
function save() {
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + "\n");
}
function before(ordinal) {
  ensure(ordinal >= 1 && ordinal <= 8 && log.opens.length === ordinal - 1, "Open order invalid");
  ensure(log.opens.every((entry) => entry.status === "OPENED-VERIFIED"), "Previous open unfinished");
  const tile = tiles[ordinal - 1];
  const entry = {
    ordinal,
    cumulativeImageOrdinal: 8 + ordinal,
    path: path.resolve(root, tile.path),
    expectedSHA256: tile.sha256,
    before: inspectInput(tile),
    contentRanges: tile.contentRanges,
    crop: tile.crop,
    viewport: tile.viewport,
    originalPixels: tile.originalPixels,
    resampled: tile.resampled,
    tool: "functions.view_image",
    detail: "original",
    openCount: 0,
    status: "BEFORE-OPEN-VERIFIED",
  };
  log.opens.push(entry);
  save();
  console.log(JSON.stringify(entry));
}
function after(ordinal) {
  const entry = log.opens[ordinal - 1];
  ensure(entry?.status === "BEFORE-OPEN-VERIFIED", "No pending original-detail open");
  const post = inspectInput(tiles[ordinal - 1]);
  ensure(post.sha256 === entry.before.sha256 && JSON.stringify(post.png) === JSON.stringify(entry.before.png), "Input changed across actual open");
  entry.after = post;
  entry.openCount = 1;
  entry.openSuccess = true;
  entry.status = "OPENED-VERIFIED";
  log.newImageCountInThisBatch += 1;
  log.actualImageCountInThisContext += 1;
  save();
  console.log(JSON.stringify({ ordinal, sha256: post.sha256, PNG: post.png, newCount: log.newImageCountInThisBatch, cumulativeCount: log.actualImageCountInThisContext }));
}
function freeze() {
  ensure(log.newImageCountInThisBatch === 8 && log.actualImageCountInThisContext === 16, "Incorrect retained plus new image count");
  ensure(log.opens.length === 8 && log.opens.every((entry) => entry.status === "OPENED-VERIFIED" && entry.openCount === 1), "Incomplete actual opens");
  const reportPath = path.join(output, "report.json");
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  ensure(report.actualOpenCount === 8 && report.cumulativeImageCount === 16 && report.tiles.length === 8, "Report count mismatch");
  const inputs = [
    { path: planPath, sha256: expectedPlanSHA256, role: "frozen-plan" },
    ...tiles.map((tile, i) => ({
      ...inspectInput(tile),
      role: "assigned-original-detail-tile",
      ordinal: i + 1,
      contentRanges: tile.contentRanges,
      beforeSHA256: log.opens[i].before.sha256,
      afterSHA256: log.opens[i].after.sha256,
    })),
  ];
  const filenames = fs.readdirSync(output).sort();
  ensure(JSON.stringify(filenames) === JSON.stringify(["actual-opens.json", "evidence.mjs", "report.json"]), "Unexpected own files");
  const outputs = filenames.map((name) => {
    const absolute = path.join(output, name);
    fs.chmodSync(absolute, 0o444);
    ensure((fs.statSync(absolute).mode & 0o777) === 0o444, "Own output not frozen");
    return { path: absolute, sha256: hashFile(absolute), mode: "0444", bytes: fs.statSync(absolute).size };
  });
  const manifestPath = path.join(output, "output-frozen-manifest.json");
  const manifest = {
    schema: "t18-first-display-output-frozen-manifest@1",
    ticket: "STEMROBIN-181",
    batch: 7,
    outputFrozen: true,
    status: "TRUE",
    frozenAt: new Date().toISOString(),
    actualOpenCount: 8,
    retainedEarlierImageCount: 8,
    cumulativeImageCount: 16,
    contextLimit: 24,
    inputs,
    outputs,
    manifestSelf: {
      path: manifestPath,
      mode: "0444",
      selfSHA256: "Returned in final text; excluded here to avoid recursive self-hashing",
    },
    scope: "Only visible English desktop written-answer display tiles003-010; boundaries and unobserved scope HOLD; fullDISPLAY/fullGate2/full-card not approved",
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", { flag: "wx", mode: 0o444 });
  fs.chmodSync(manifestPath, 0o444);
  inputs.forEach((input) => ensure(hashFile(input.path) === input.sha256, "Frozen input hash verification failed"));
  outputs.forEach((entry) => ensure(hashFile(entry.path) === entry.sha256 && (fs.statSync(entry.path).mode & 0o777) === 0o444, "Frozen output verification failed"));
  ensure((fs.statSync(manifestPath).mode & 0o777) === 0o444, "Manifest not frozen");
  console.log(JSON.stringify({
    outputFrozen: true,
    actualOpenCount: 8,
    cumulativeImageCount: 16,
    inputsVerified: inputs.length,
    outputs: [...outputs, { path: manifestPath, sha256: hashFile(manifestPath), mode: "0444" }],
  }, null, 2));
}
const [phase, number] = process.argv.slice(2);
const ordinal = Number(number);
if (phase === "before") before(ordinal);
else if (phase === "after-next") { after(ordinal); before(ordinal + 1); }
else if (phase === "after") after(ordinal);
else if (phase === "freeze") freeze();
else throw new Error("Expected before, after-next, after or freeze");
