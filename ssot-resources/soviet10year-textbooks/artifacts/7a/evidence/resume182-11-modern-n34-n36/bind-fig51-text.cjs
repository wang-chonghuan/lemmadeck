const fs = require("node:fs");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const dir = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-51";
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const hash = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const save = (p, value, exclusive = false) =>
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + "\n", exclusive ? { flag: "wx" } : {});
for (const name of ["spec.json", "render.json"]) {
  fs.copyFileSync(`${dir}/${name}`, `${dir}/before-text-binding-${name}`, fs.constants.COPYFILE_EXCL);
}
const before = read(`${dir}/spec.json`);
const spec = structuredClone(before);
assert.equal(spec.source.authoritativeText.length, 1);
const oldText = spec.source.authoritativeText[0].text;
assert.equal(oldText.split("函数值也较大").length, 2);
spec.source.authoritativeText[0].text = oldText.replace("函数值也较大", "函数值也较小");
const context = read(`${dir}/context-after-erratum.json`);
assert(context.lessons[0].prose[0].nearbyText.some((text) => text.includes("函数值也较小")));
const rollback = structuredClone(spec);
rollback.source.authoritativeText = before.source.authoritativeText;
assert.deepEqual(rollback, before);
const svgSha = hash(`${dir}/fig-51.svg`);
const previewSha = hash(`${dir}/complete-preview.png`);
save(`${dir}/spec.json`, spec);
const render = read(`${dir}/render.json`);
assert.equal(render.output.svg.sha256, svgSha);
render.spec.sha256 = hash(`${dir}/spec.json`);
save(`${dir}/render.json`, render);
assert.equal(hash(`${dir}/fig-51.svg`), svgSha);
assert.equal(hash(`${dir}/complete-preview.png`), previewSha);
save(`${dir}/text-binding.json`, {
  changed: ["source.authoritativeText[0].text", "render.spec.sha256"],
  geometryObjectsAssertionsDisplayUnchanged: true,
  sourceImageSha256: spec.source.image.sha256,
  specSha256: hash(`${dir}/spec.json`),
  renderSha256: hash(`${dir}/render.json`),
  svgSha256: svgSha,
  previewSha256: previewSha,
  contextSha256: hash(`${dir}/context-after-erratum.json`),
  imageLoads: 0,
  visualApproval: false,
}, true);
console.log(JSON.stringify(read(`${dir}/text-binding.json`)));
