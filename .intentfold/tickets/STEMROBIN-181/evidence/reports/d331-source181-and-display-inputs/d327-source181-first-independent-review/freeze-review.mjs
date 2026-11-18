import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const out = path.join(repo, "tmp/d327-source181-first-independent-review");
const input = path.join(repo, ".intentfold/tickets/STEMROBIN-181/evidence/reports/d285-bounded-progress/d279-source181-first-author");
const expected = "32053bbdb3df7c9157fe785c280ea0f71781e515cc27be89304cae2794e270ad";
const hash = (file) => {
  const data = fs.readFileSync(file);
  return { path: file, sha256: crypto.createHash("sha256").update(data).digest("hex"), bytes: data.length };
};
const save = (name, value) => fs.writeFileSync(path.join(out, name), JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
const manifest = hash(path.join(input, "author-freeze.json"));
if (manifest.sha256 !== expected) throw new Error("Author freeze changed");
const original = JSON.parse(fs.readFileSync(manifest.path, "utf8"));
const checkedInputs = original.artifacts.map((item) => {
  const relative = path.relative(original.writeDomain, item.path);
  if (relative.startsWith("..")) throw new Error("Unexpected author path");
  const actual = hash(path.join(input, relative));
  if (actual.sha256 !== item.sha256 || actual.bytes !== item.bytes) throw new Error(`Author changed: ${relative}`);
  return { ...actual, manifestPath: item.path, relativePath: relative, unchanged: true };
});

const views = [
  [input, "work/10p/pages/0181/page.png", "pixel-first before candidate text", [1536, 2337]],
  [input, "work/10p/pages/0181/page.grid.png", "pixel-first before candidate text", [1536, 2337]],
  [input, "work/10p/pages/0181/figures/fig-137.png", "RAW137 versus observed source page", [1152, 346]],
  [input, "work/10p/pages/0181/figures/fig-138.png", "RAW138 versus observed source page", [390, 446]],
  [out, "fig-137.existing-svg.resvg.png", "existing SVG raster versus RAW137", [1152, 346]],
  [out, "fig-138.existing-svg.resvg.png", "existing SVG raster versus RAW138", [390, 446]],
  [out, "fig-138.raw.central-detail-3x.png", "central RAW glyph/detail crop", [645, 405]],
  [out, "fig-138.existing-raster.central-detail-3x.png", "matched existing-raster glyph/detail crop", [645, 405]],
].map(([root, file, purpose, size], index) => ({
  ordinal: index + 1,
  ...hash(path.join(root, file)),
  tool: "functions.view_image",
  detail: "original",
  actualOpen: true,
  numberOfOpens: 1,
  reopens: 0,
  size,
  purpose,
  timestampPolicy: "Ordinal comes from actual tool sequence; no fabricated per-open timestamp.",
}));
save("actual-opens.json", {
  schema: "source181-independent-actual-opens@1",
  actualOpens: views,
  inheritedImagePayloads: 0,
  batchImageCount: 8,
  contextImageCount: 8,
  limitBatch: 8,
  limitContext: 24,
  imagesInReturn: 0,
  previousParentOrAgentBudgetsReset: false,
});
save("input-hashes.json", {
  schema: "source181-independent-input-hashes@1",
  originalRequestedPath: path.join(repo, "tmp/d279-source181-first-author/author-freeze.json"),
  requestedPathExists: fs.existsSync(path.join(repo, "tmp/d279-source181-first-author/author-freeze.json")),
  retainedRoot: input,
  authorFreeze: manifest,
  verifiedAfterReview: true,
  checkedInputs,
});

const decisions = JSON.parse(fs.readFileSync(path.join(out, "decisions.json"), "utf8"));
save("report.json", {
  ...decisions,
  schema: "source181-first-independent-review@1",
  completedUtc: new Date().toISOString(),
  workspace: repo,
  recordedBranchFromTicketOnly: "codex/STEMROBIN-181-textbooks",
  branchWasNotQueriedOrChanged: true,
  writeDomain: out,
  inputRoot: input,
  inputFreezeSHA256: expected,
  actualOpens: views,
  authorInputHashVerification: checkedInputs,
  evidence: [
    "source-first-observations.md",
    "actual-opens.json",
    "input-hashes.json",
    "raster-receipts.json",
    "pixel-comparison.json",
    "detail-crop-receipts.json",
    "decisions.json",
    "render-existing.mjs",
    "compare-existing.py",
    "detail-crops.py",
  ].map((file) => hash(path.join(out, file))),
});

const files = fs.readdirSync(out).filter((file) => fs.statSync(path.join(out, file)).isFile()).sort();
save("review-freeze.json", {
  schema: "source181-independent-review-freeze@1",
  frozenUtc: new Date().toISOString(),
  ticket: "STEMROBIN-181",
  outputDirectory: out,
  overallVerdict: decisions.overallVerdict,
  inputFreezeSHA256: expected,
  authorArtifactsUnchanged: checkedInputs.length,
  imageCount: views.length,
  nativeReuseCount: 0,
  nativeFinalizeInvocations: 0,
  nativeVectorizeInvocations: 0,
  policy: "Every file including this manifest is chmod 0444 after creation. This manifest excludes itself from recursive hashes.",
  artifacts: files.map((file) => hash(path.join(out, file))),
});
for (const file of fs.readdirSync(out)) {
  const target = path.join(out, file);
  if (!fs.statSync(target).isFile()) throw new Error(`Unexpected directory ${target}`);
  fs.chmodSync(target, 0o444);
}
const frozen = JSON.parse(fs.readFileSync(path.join(out, "review-freeze.json"), "utf8"));
for (const artifact of frozen.artifacts) {
  const actual = hash(artifact.path);
  const mode = fs.statSync(artifact.path).mode & 0o777;
  if (actual.sha256 !== artifact.sha256 || actual.bytes !== artifact.bytes || mode !== 0o444) throw new Error("Freeze verification failed");
}
if ((fs.statSync(path.join(out, "review-freeze.json")).mode & 0o777) !== 0o444) throw new Error("Manifest mode incorrect");
console.log(JSON.stringify({
  verdicts: { SOURCE181_TEXT: decisions.SOURCE181_TEXT, SOURCE181: decisions.SOURCE181, RAW137: decisions.RAW137, RAW138: decisions.RAW138 },
  actualImageOpens: views.length,
  authorInputsUnchanged: checkedInputs.length,
  allOutputFilesMode: "0444",
  outputFiles: fs.readdirSync(out).length,
  report: hash(path.join(out, "report.json")),
  freeze: hash(path.join(out, "review-freeze.json")),
}, null, 2));
