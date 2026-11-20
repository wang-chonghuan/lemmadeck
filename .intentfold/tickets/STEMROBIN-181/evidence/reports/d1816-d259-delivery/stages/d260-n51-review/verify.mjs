import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
assert.equal(process.cwd(), root);
const output = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d260-n51-review");
const read = (file) => JSON.parse(fs.readFileSync(path.resolve(root, file), "utf8"));
const hashes = [];
function binding(file) {
  const absolute = path.resolve(root, file);
  const bytes = fs.readFileSync(absolute);
  return {
    path: file,
    absolutePath: absolute,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
}
function verifyBindings(value, name) {
  if (!value || typeof value !== "object") return;
  if (typeof value.path === "string" && typeof value.sha256 === "string") {
    const actual = binding(value.path);
    assert.equal(actual.sha256, value.sha256, name);
    if (value.bytes !== undefined) assert.equal(actual.bytes, value.bytes, name);
    hashes.push({ binding: name, ...actual, match: true });
  }
  for (const [key, child] of Object.entries(value)) {
    if (child && typeof child === "object") verifyBindings(child, `${name}.${key}`);
  }
}

const authorFile = ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d257-n51-text-author/author-freeze.json";
const bilingualFile = ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d257-n51-text-author/bilingual-figure-bindings.json";
const author = read(authorFile);
const bilingual = read(bilingualFile);
const figureAuthor = read(author.figureAuthor.path);
verifyBindings(author, "D257-author-freeze");
verifyBindings(bilingual, "D257-bilingual-bindings");
verifyBindings(figureAuthor, "D255-figure-author-freeze");
const english = read(author.templates.en.path);
const chinese = read(author.templates.zh.path);
const chineseScience = read(author.chineseScienceReused.path);
assert.equal(chineseScience.status, "pass");
assert.equal(chineseScience.bindings.template.sha256, author.templates.zh.sha256);
assert.equal(chinese.prose.length, 10);
assert.equal(english.prose.length, 10);
assert.deepEqual(english.prose.map((b) => b.kind), chinese.prose.map((b) => b.kind));
assert.deepEqual(english.prose.map((b) => b.source_refs), chinese.prose.map((b) => b.source_refs));
assert.equal(chinese.exercise_count, 0);
assert.equal(english.exercise_count, 0);
assert.equal(author.originalTasks, 0);

const fullText = (template) => [template.printed_title, ...template.prose.map((b) => b.text)].join("\n\n");
const spec = read(bilingual.spec.path);
const originalSpec = read(bilingual.originalSpec.path);
assert.equal(spec.source.authoritativeText.length, 2);
assert.equal(spec.source.authoritativeText[0].text, fullText(chinese));
assert.equal(spec.source.authoritativeText[1].text, fullText(english));
assert.equal(author.englishText, fullText(english));
const chineseOnlySpec = structuredClone(spec);
chineseOnlySpec.source.authoritativeText.pop();
assert.deepEqual(chineseOnlySpec, originalSpec);
const render = read(bilingual.render.path);
const originalRender = read(bilingual.originalRender.path);
const originalBoundRender = structuredClone(render);
originalBoundRender.spec = originalRender.spec;
assert.equal(path.resolve(root, render.output.svg.path), path.resolve(root, originalRender.output.svg.path));
assert.equal(render.output.svg.sha256, originalRender.output.svg.sha256);
assert.equal(render.output.svg.bytes, fs.statSync(path.resolve(root, originalRender.output.svg.path)).size);
originalBoundRender.output.svg = originalRender.output.svg;
assert.deepEqual(originalBoundRender, originalRender);
assert.equal(render.status, "pass");
assert.equal(render.spec.sha256, bilingual.spec.sha256);
assert.equal(render.output.svg.sha256, bilingual.svg.sha256);
assert.equal(render.collisions.length, 0);

const retained = figureAuthor.retainedOriginalFailureAndCandidate;
assert.equal(read(retained.originalFailureRender.path).status, "fail");
assert.equal(read(retained.historicalSecondFailureRender.path).status, "fail");
assert.equal(figureAuthor.repairAccounting.cumulativeFailedRenderResults, 2);
assert.equal(figureAuthor.repairAccounting.cumulativeTargetedRepairs, 2);
const historicalSpec = read(retained.historicalRepairedSpec.path);
for (const key of ["canvas", "display", "assertions"]) {
  assert.deepEqual(originalSpec[key], historicalSpec[key]);
}
assert.deepEqual(originalSpec.source.image, historicalSpec.source.image);
assert.deepEqual(originalSpec.source.authoritativeText, historicalSpec.source.authoritativeText);
assert.equal(originalSpec.objects.length, historicalSpec.objects.length);
const changedObjects = [];
for (const object of originalSpec.objects) {
  const before = historicalSpec.objects.find((item) => item.id === object.id);
  assert.ok(before);
  if (JSON.stringify(object) !== JSON.stringify(before)) changedObjects.push(object.id);
}
assert.deepEqual(changedObjects, ["schematic-note"]);
const historicalNote = historicalSpec.objects.find((o) => o.id === "schematic-note");
const currentNote = originalSpec.objects.find((o) => o.id === "schematic-note");
assert.deepEqual(historicalNote.at, [125, 30]);
assert.deepEqual(currentNote.at, [125, 25]);
assert.deepEqual({ ...currentNote, at: historicalNote.at }, historicalNote);

const preview = read(figureAuthor.previewManifest.path);
const displayChecks = [];
for (const view of preview.views) {
  const png = fs.readFileSync(view.path);
  assert.equal(png.subarray(1, 4).toString("ascii"), "PNG");
  assert.equal(png.readUInt32BE(16), view.width);
  assert.equal(png.readUInt32BE(20), view.width);
  assert.equal(view.metrics.horizontalOverflow, false);
  assert.equal(view.metrics.labels.length, 15);
  assert.equal(view.metrics.measuredMinPx, 32 * view.width / 640);
  assert.ok(view.metrics.measuredMinPx >= 16);
  assert.ok(view.metrics.labels.every((label) => label.inside && label.px >= 16));
  assert.equal(view.metrics.curve[0].dash, "none");
  displayChecks.push({
    width: view.width,
    height: view.width,
    measuredMinPx: view.metrics.measuredMinPx,
    independentSvgScaleMinPx: 32 * view.width / 640,
    labels: view.metrics.labels.length,
    allInside: true,
    horizontalOverflow: false,
    hash: binding(view.path),
  });
}
for (const check of render.displayChecks) {
  assert.equal(check.status, "pass");
  assert.equal(check.measuredMinPx, 32 * check.width / 640);
  assert.ok(check.measuredMinPx >= 16);
}
assert.ok(spec.objects.filter((o) => ["segment", "arrow", "svgPath"].includes(o.type))
  .every((o) => !o.dash || o.dash === 0));
assert.equal(spec.objects.filter((o) => o.type === "text").length, 15);
assert.ok(spec.objects.filter((o) => o.type === "text").every((o) => o.fontSize === 32));
const svg = fs.readFileSync(bilingual.svg.path, "utf8");
assert.equal((svg.match(/font-size="32"/g) || []).length, 15);
assert.ok(!svg.includes("stroke-dasharray"));
assert.equal(read(path.join(output, "english-review.json")).status, "pass");
assert.equal(read(path.join(output, "source-inventory.json")).imageOpensAtInventory, 1);

const payload = {
  schema: "STEMROBIN-181/N51-review-binding-verification@1",
  status: "pass",
  cwd: root,
  inputs: [binding(authorFile), binding(bilingualFile), binding(author.figureAuthor.path)],
  hashes,
  completeBilingualTextMatchesFrozenTemplates: true,
  bilingualSpecOnlyAddsEnglishContext: true,
  bilingualRenderChangesOnlySpecBindingAndEquivalentOutputPathAndByteMetadata: true,
  currentFigureAuthorOnlyChangedSchematicAnchorAndInventory: true,
  currentFigureAuthorChangedObjects: changedObjects,
  historicalFailuresPreserved: 2,
  cumulativeTargetedRepairs: 2,
  displayChecks,
  additionalDeclaredWidth: { width: 342, minimumPx: 17.1, visualOpen: false },
  svgTextCount: 15,
  svgFontSize: 32,
  svgGuidesAndCurveDashed: false,
  imageOpens: 3,
  imageOpenLimit: 8,
  binaryHashAndPngHeaderReadsAreNotVisualOpens: true,
  sourcePageReviewRepeated: false,
  chineseSCIRepeated: false,
  candidateEdits: 0,
  rerenders: 0,
  newRepairs: 0,
  networkRequests: 0,
};
fs.writeFileSync(path.join(output, "verification.json"), `${JSON.stringify(payload, null, 2)}\n`);
console.log(JSON.stringify({
  status: "pass",
  verifiedBindings: hashes.length,
  authoritativeBlocksPerLanguage: 10,
  changedObjects,
  displayChecks,
  imageOpens: 3,
}, null, 2));
