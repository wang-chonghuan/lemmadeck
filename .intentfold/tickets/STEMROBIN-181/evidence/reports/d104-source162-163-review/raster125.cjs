const fs = require("node:fs");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const { Resvg } = require("/Users/yong/.codex/worktrees/00b1/lemmadeck/.claude/skills/ld-s10y-lesson/node_modules/@resvg/resvg-js");

const input = "/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d089-source162-163-author/work/10p/pages/0163/figures/fig-125.svg";
const output = "/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d097-source162-163-review/fig-125-original-svg-raster.png";
assert.equal(fs.existsSync(output), false, "Raster evidence must not be overwritten");
const svg = fs.readFileSync(input);
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
assert.equal(sha256(svg), "de57ef26628eed0ff3bcb6e4dcbce858a6283548800e36eebc918486d7954d5c");
const rendered = new Resvg(svg, {
  background: "white",
  font: { loadSystemFonts: false },
}).render();
assert.equal(rendered.width, 855);
assert.equal(rendered.height, 466);
const png = rendered.asPng();
fs.writeFileSync(output, png, { flag: "wx" });
console.log(JSON.stringify({
  operation: "one-direct-rasterization-of-existing-original-svg",
  nativeStagesRun: 0,
  vectorizeRuns: 0,
  input: { path: input, sha256: sha256(svg) },
  output: { path: output, sha256: sha256(png), width: rendered.width, height: rendered.height },
  imagesOpenedByScript: 0,
}, null, 2));
