const fs = require("node:fs");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const hash = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const save = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n", { flag: "wx" });
const fixes = [
  [47, [["x-value-minus-2", [-2, -1.6],
    "Source value -2 remains horizontally centered on its exact x=-2 division; vertical typesetting clearance only, with no change to the curve, tick, grid or value."]]],
  [51, [
    ["source-x-minus-8", [-8, 1.4],
      "Source -8 x tick remains at x=-8; its caption is placed above the x-axis as in the source, clear of the negative branch."],
    ["source-y-minus-8", [1.3, -8],
      "Source -8 y tick remains at y=-8; its caption is placed to the right of the y-axis as in the source, clear of the negative branch."],
  ]],
];
for (const [number, labels] of fixes) {
  const dir = `${base}/n34-figures/fig-${number}`;
  const frozen = `${dir}/failed-independent-visual-FIRST`;
  fs.mkdirSync(frozen, { recursive: true });
  for (const name of ["spec.json", "render.json", `fig-${number}.svg`, "complete-preview.png"]) {
    fs.copyFileSync(`${dir}/${name}`, `${frozen}/${name}`, fs.constants.COPYFILE_EXCL);
  }
  const before = read(`${dir}/spec.json`);
  const after = structuredClone(before);
  for (const [id, at, explanation] of labels) {
    const object = after.objects.find((item) => item.id === id);
    assert(object && object.type === "text");
    object.at = at;
    object.labelPlacement = { position: "CENTER", gap: 0 };
    object.authoredAdditions = explanation;
  }
  const restored = structuredClone(after);
  for (const [id] of labels) {
    const index = restored.objects.findIndex((item) => item.id === id);
    restored.objects[index] = before.objects[index];
  }
  assert.deepEqual(restored, before);
  fs.writeFileSync(`${dir}/spec.json`, JSON.stringify(after, null, 2) + "\n");
  save(`${dir}/independent-label-repair.json`, {
    figure: `fig-${number}`, imagesOpened: 0,
    changedLabelIds: labels.map(([id]) => id),
    geometryInventoryAssertionsAndEveryOtherObjectUnchanged: true,
    beforeSpecSha256: hash(`${frozen}/spec.json`),
    afterSpecSha256: hash(`${dir}/spec.json`),
    sourceSha256: after.source.image.sha256,
    visualGate: "pending-affected-only",
  });
}
console.log(JSON.stringify({ changedFigures: [47, 51], changedLabels: 3, imagesOpened: 0 }));
