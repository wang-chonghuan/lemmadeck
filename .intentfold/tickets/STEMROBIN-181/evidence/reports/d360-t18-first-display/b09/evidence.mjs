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
const batch = plan.pendingBatches[7];
const tiles = batch.tiles;
ensure(batch.batch === 9 && tiles.length === 8, "Wrong batch");
tiles.forEach((tile, i) => {
  const name = `zh-answers-390-sheet-${String(i + 8).padStart(3, "0")}.png`;
  ensure(tile.path.endsWith(`/d338-t18-written-answer-display/${name}`), "Wrong tile order");
  ensure(tile.language === "zh" && tile.originalPixels === true && tile.resampled === false, "Not assigned original Chinese pixels");
});
function inspect(tile) {
  const absolute = path.resolve(root, tile.path);
  const bytes = fs.readFileSync(absolute);
  const actualSHA256 = sha256(bytes);
  ensure(actualSHA256 === tile.sha256, "Tile hash changed");
  ensure(bytes.subarray(0, 8).toString("hex") === "89504e470d0a1a0a", "Not PNG");
  ensure(bytes.readUInt32BE(8) === 13 && bytes.toString("ascii", 12, 16) === "IHDR", "Bad PNG header");
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
  ensure(png.width === tile.crop.width && png.height === tile.crop.height, "PNG dimensions mismatch");
  return { path: absolute, sha256: actualSHA256, png, verifiedAt: new Date().toISOString() };
}
const logPath = path.join(output, "actual-opens.json");
const log = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, "utf8")) : {
  schema: "t18-first-display-actual-opens@2",
  ticket: "STEMROBIN-181",
  batch: 9,
  scope: "pendingBatches[7].tiles",
  plan: { path: planPath, sha256: expectedPlanSHA256 },
  history: {
    retainedD343Images: 8,
    retainedD363Images: 8,
    resetOnResume: false,
    retainedImagesCleared: false,
    newChatAgentWorktree: false,
    otherImagesOpenedThisBatch: 0,
    fullScreenshotsOpened: 0,
    sourceImagesOpened: 0,
  },
  totals: {
    new: 0,
    old: 16,
    cumulative: 16,
    contextLimit: 24,
    batchLimit: 8,
    usage: "16/24",
    reopens: 0,
  },
  actualOpens: [],
};
const save = () => fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + "\n");
function before(ordinal) {
  ensure(ordinal >= 1 && ordinal <= 8 && log.totals.cumulative < 24, "No more image opens allowed");
  ensure(log.actualOpens.length === ordinal - 1 && log.actualOpens.every((entry) => entry.successfulPixelLoad), "Open order invalid");
  const tile = tiles[ordinal - 1];
  const pre = inspect(tile);
  const entry = {
    ordinal,
    cumulativeImageOrdinal: 16 + ordinal,
    path: pre.path,
    sha256: pre.sha256,
    expectedSHA256: tile.sha256,
    beforeSHA256: pre.sha256,
    beforePNG: pre.png,
    beforeVerifiedAt: pre.verifiedAt,
    detail: "original",
    tool: "functions.view_image",
    successfulPixelLoad: false,
    openCount: 0,
    status: "BEFORE-OPEN-VERIFIED",
    contentRanges: tile.contentRanges,
    crop: tile.crop,
    viewport: tile.viewport,
    originalPixels: tile.originalPixels,
    resampled: tile.resampled,
  };
  log.actualOpens.push(entry);
  save();
  console.log(JSON.stringify(entry));
}
function after(ordinal) {
  const entry = log.actualOpens[ordinal - 1];
  ensure(entry?.status === "BEFORE-OPEN-VERIFIED", "No pending pixel load");
  const post = inspect(tiles[ordinal - 1]);
  ensure(post.sha256 === entry.beforeSHA256 && JSON.stringify(post.png) === JSON.stringify(entry.beforePNG), "Input changed across open");
  entry.sha256 = post.sha256;
  entry.afterSHA256 = post.sha256;
  entry.afterPNG = post.png;
  entry.afterVerifiedAt = post.verifiedAt;
  entry.successfulPixelLoad = true;
  entry.openCount = 1;
  entry.status = "OPENED-VERIFIED";
  log.totals.new += 1;
  log.totals.cumulative += 1;
  log.totals.usage = `${log.totals.cumulative}/24`;
  if (log.totals.cumulative === 24) log.noFurtherImagesAllowedInThisContext = true;
  save();
  console.log(JSON.stringify({ ordinal, sha256: post.sha256, PNG: post.png, successfulPixelLoad: true, openCount: 1, totals: log.totals }));
}
function freeze() {
  ensure(log.totals.new === 8 && log.totals.old === 16 && log.totals.cumulative === 24 && log.totals.reopens === 0, "Wrong image totals");
  ensure(log.actualOpens.length === 8 && log.actualOpens.every((entry) => entry.successfulPixelLoad && entry.openCount === 1 && entry.beforeSHA256 === entry.afterSHA256 && entry.sha256 === entry.afterSHA256), "Incomplete actual opens");
  const reportPath = path.join(output, "report.json");
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  ensure(report.scope === "pendingBatches[7].tiles" && report.observations.length === 8 && report.actualOpenCount === 8 && report.cumulativeImageCount === 24, "Report scope/count mismatch");
  report.observations.forEach((observation, i) => {
    ensure(observation.path === log.actualOpens[i].path && observation.sha256 === log.actualOpens[i].sha256, "Observation input mismatch");
    ensure(JSON.stringify(observation.contentRanges) === JSON.stringify(tiles[i].contentRanges), "Observation range mismatch");
  });
  const inputs = [
    { path: planPath, sha256: expectedPlanSHA256, role: "frozen-plan" },
    ...tiles.map((tile, i) => ({
      ...inspect(tile),
      role: "assigned-original-detail-tile",
      ordinal: i + 1,
      contentRanges: tile.contentRanges,
      beforeSHA256: log.actualOpens[i].beforeSHA256,
      afterSHA256: log.actualOpens[i].afterSHA256,
    })),
  ];
  const names = fs.readdirSync(output).sort();
  ensure(JSON.stringify(names) === JSON.stringify(["actual-opens.json", "evidence.mjs", "report.json"]), "Unexpected own files");
  const outputs = names.map((name) => {
    const absolute = path.join(output, name);
    fs.chmodSync(absolute, 0o444);
    ensure((fs.statSync(absolute).mode & 0o777) === 0o444, "Output not frozen");
    return { path: absolute, sha256: hashFile(absolute), bytes: fs.statSync(absolute).size, mode: "0444" };
  });
  const manifestPath = path.join(output, "output-frozen-manifest.json");
  const manifest = {
    schema: "t18-first-display-output-frozen-manifest@2",
    ticket: "STEMROBIN-181",
    batch: 9,
    scope: "pendingBatches[7].tiles",
    outputFrozen: true,
    status: "TRUE",
    frozenAt: new Date().toISOString(),
    totals: log.totals,
    noFurtherImagesAllowedInThisContext: true,
    inputs,
    outputs,
    manifestSelf: { path: manifestPath, mode: "0444", sha256Location: "Final textual return, excluded here to avoid recursive self-hashing" },
    approvalBoundary: "Only actual visible portions; source14/16, tasks1/9, conditions, fullDISPLAY, Gate2 and complete-card HOLD unchanged",
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", { flag: "wx", mode: 0o444 });
  fs.chmodSync(manifestPath, 0o444);
  inputs.forEach((entry) => ensure(hashFile(entry.path) === entry.sha256, "Frozen input mismatch"));
  outputs.forEach((entry) => ensure(hashFile(entry.path) === entry.sha256 && (fs.statSync(entry.path).mode & 0o777) === 0o444, "Frozen output mismatch"));
  ensure((fs.statSync(manifestPath).mode & 0o777) === 0o444, "Manifest not frozen");
  console.log(JSON.stringify({ outputFrozen: true, totals: log.totals, inputsVerified: inputs.length, outputs: [...outputs, { path: manifestPath, sha256: hashFile(manifestPath), mode: "0444" }] }, null, 2));
}
const [phase, number] = process.argv.slice(2);
const ordinal = Number(number);
if (phase === "before") before(ordinal);
else if (phase === "after-next") { after(ordinal); before(ordinal + 1); }
else if (phase === "after") after(ordinal);
else if (phase === "freeze") freeze();
else throw new Error("Expected before, after-next, after or freeze");
