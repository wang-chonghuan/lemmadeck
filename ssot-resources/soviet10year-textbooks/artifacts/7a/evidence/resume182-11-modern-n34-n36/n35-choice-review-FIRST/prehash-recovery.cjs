const fs = require("node:fs");
const crypto = require("node:crypto");
const root = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
if (process.cwd() !== root) throw new Error("Wrong cwd");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const out = `${base}/n35-choice-review-FIRST`;
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const seed = JSON.parse(fs.readFileSync(`${base}/n35-choice-author/seed.json`, "utf8"));
const asset = seed.figures.find((figure) => figure.id === "fig-54").assets[0];
const previewSvg = `${base}/n35-figures/fig-54/fig-54.svg`;
const pngPath = `${base}/n35-figures/fig-54/complete-preview.png`;
const authoritativeBytes = fs.readFileSync(asset.path);
const previewSvgBytes = fs.readFileSync(previewSvg);
if (!authoritativeBytes.equals(previewSvgBytes)) throw new Error("Preview SVG differs from seed SVG");
if (sha(authoritativeBytes) !== asset.sha256) throw new Error("Seed asset changed");
const png = fs.readFileSync(pngPath);
if (png.subarray(1, 4).toString("ascii") !== "PNG") throw new Error("Not PNG");
const record = {
  stage: "source-image-technical-recovery-before-second-open",
  time: new Date().toISOString(),
  cwd: root,
  authorization: "Latest direct human message permits one additional complete-preview inspection solely for failed theme-variable resvg recovery, at most two total images; no repeat of passed review.",
  seed_asset_path: asset.path,
  seed_asset_sha256: sha(authoritativeBytes),
  preview_svg_path: previewSvg,
  preview_svg_sha256: sha(previewSvgBytes),
  byte_identical: true,
  preview_png_path: pngPath,
  preview_png_sha256: sha(png),
  width: png.readUInt32BE(16),
  height: png.readUInt32BE(20),
  technical_observation: "Existing complete PNG from styled browser render; no new rendering, crop or source edit. Hash-bound SVG equality established before opening.",
  prior_fault_evidence: `${out}/asset-before-open-FIRST.json`,
  prior_source_freeze: `${out}/source-freeze-FIRST.json`,
  images_already_opened: 1,
  authorized_total: 2,
  author_internals_disclosed: false
};
const recordPath = `${out}/asset-recovery-before-open.json`;
fs.writeFileSync(recordPath, `${JSON.stringify(record, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(recordPath, 0o444);
console.log(JSON.stringify(record, null, 2));
