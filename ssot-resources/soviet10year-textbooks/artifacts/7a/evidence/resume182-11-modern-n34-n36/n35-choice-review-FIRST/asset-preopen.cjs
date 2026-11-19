const fs = require("node:fs");
const crypto = require("node:crypto");

const root = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
if (process.cwd() !== root) throw new Error("Wrong cwd");
const { Resvg } = require(`${root}/.claude/skills/ld-s10y-lesson/node_modules/@resvg/resvg-js`);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const out = `${base}/n35-choice-review-FIRST`;
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
};
const canonical = (value) => JSON.stringify(stable(value)).replace(/[^\x00-\x7f]/g, (c) =>
  `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
const seedPath = `${base}/n35-choice-author/seed.json`;
const seedBytes = fs.readFileSync(seedPath);
const seed = JSON.parse(seedBytes);
const asset = seed.figures.find((figure) => figure.id === "fig-54").assets[0];
const svg = fs.readFileSync(asset.path);
const svgHash = hash(svg);
if (svgHash !== asset.sha256) throw new Error("SVG is not the seeded snapshot");
const render = new Resvg(svg, { fitTo: { mode: "width", value: 640 } }).render();
if (render.width !== 640 || render.height !== 360) throw new Error("Unexpected full image dimensions");
const png = render.asPng();
const pngPath = `${out}/fig-54-full-640-FIRST.png`;
fs.writeFileSync(pngPath, png, { flag: "wx" });
const record = {
  stage: "source-asset-before-only-image-open",
  time: new Date().toISOString(),
  cwd: root,
  seed_path: seedPath,
  seed_raw_sha256: hash(seedBytes),
  seed_sha256: hash(canonical(seed)),
  asset_path: asset.path,
  asset_sha256: svgHash,
  converted_png_path: pngPath,
  converted_png_sha256: hash(png),
  width: render.width,
  height: render.height,
  transformation: "Existing local resvg rasterization only; full SVG viewBox, no crop, no geometry edits or new figure.",
  technical_observation: "SVG declares width 640, height 360, viewBox 0 0 640 360; PNG dimensions confirmed before opening. No visual interpretation claimed before image open.",
  visual_observation: "Pending the single authorized full image open.",
  image_budget: { authorized: 1, opened_so_far: 0, crops: 0, reopens: 0 },
  draft_access: "No draft, author solution, key or rationale has been opened."
};
const recordPath = `${out}/asset-before-open-FIRST.json`;
fs.writeFileSync(recordPath, `${JSON.stringify(record, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(pngPath, 0o444);
fs.chmodSync(recordPath, 0o444);
console.log(JSON.stringify(record, null, 2));
