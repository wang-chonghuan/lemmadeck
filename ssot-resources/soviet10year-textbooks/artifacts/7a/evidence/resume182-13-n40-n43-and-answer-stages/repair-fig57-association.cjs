const fs = require("node:fs");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const folder = `${base}/n41-n42-figure-author/fig-57`;
const input = `${folder}/spec-bound-REPAIR-1.json`;
const output = `${folder}/spec-bound-ASSOCIATION-2.json`;
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const original = JSON.parse(fs.readFileSync(input, "utf8"));
const spec = structuredClone(original);
const axis = spec.objects.find(row => row.id === "source-y-axis");
const tick = axis.ticks.find(row => row.label === "-2");
assert.deepEqual(tick.at, [0, -2]);
tick.fontSize = 24;
tick.labelPlacement = { position: "NW", gap: 8, offset: [0, -12] };
assert.deepEqual(spec.source, original.source);
assert.deepEqual(spec.assertions, original.assertions);
fs.writeFileSync(output, `${JSON.stringify(spec, null, 2)}\n`, { flag: "wx" });
fs.writeFileSync(`${base}/fig57-association-repair.json`, `${JSON.stringify({
  input: { path: input, sha256: sha(input) }, output: { path: output, sha256: sha(output) },
  finding: "fig-57-y-minus-2-axis-association",
  change: "Only y=-2 numeral placement and font size; NW near its unchanged tick. 24px canvas text is 16px at 640px.",
  sourceAndMathematicsUnchanged: true, independentReviewPending: true,
  parentSpecificFindingImages: 1, originalReopens: 0,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ repairedLabel: "-2", sourceAndMathematicsUnchanged: true }));
