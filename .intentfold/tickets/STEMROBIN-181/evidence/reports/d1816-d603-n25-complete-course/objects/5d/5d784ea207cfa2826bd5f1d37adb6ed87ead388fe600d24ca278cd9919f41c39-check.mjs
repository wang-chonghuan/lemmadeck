import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
const ticket = ".intentfold/tickets/STEMROBIN-181";
const oldTextRoot = `${ticket}/tmp/d1816-d591-n25-bilingual-author`;
const currentRoot = `${ticket}/tmp/d1816-d600-n25-affected-repair`;
const beforeRoot = `${ticket}/evidence/reports/d1816-d600-n25-affected-repair/before`;
const firstPath = `${ticket}/evidence/reports/d1816-d600-n25-affected-repair/first-review/report.json`;
const repairPath = `${currentRoot}/repair.json`;
const indices = [9, 10, 11, 12, 18];
const inputs = new Map();

function binding(path, expected) {
  const absolute = resolve(root, path);
  const bytes = readFileSync(absolute);
  const result = {
    path: absolute,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
  if (expected) {
    assert.equal(result.sha256, expected.sha256, `SHA mismatch: ${absolute}`);
    if (expected.bytes !== undefined) {
      assert.equal(result.bytes, expected.bytes, `Byte length mismatch: ${absolute}`);
    }
  }
  inputs.set(absolute, result);
  return result;
}

function json(path) {
  return JSON.parse(readFileSync(resolve(root, path), "utf8"));
}

function exactJson(path, value) {
  assert.equal(
    readFileSync(resolve(root, path), "utf8"),
    `${JSON.stringify(value, null, 2)}\n`,
    `Unexpected JSON content or formatting: ${path}`,
  );
}

const first = json(firstPath);
const repair = json(repairPath);
const firstBinding = binding(firstPath, repair.firstReview);
assert.equal(firstBinding.sha256, "1083ec7f8a17cc6445524c9d1f5db1434c026c777de75e580dbca845e4e8c201");
const repairBinding = binding(repairPath);
assert.equal(repairBinding.sha256, "8f7d720d6ba32d73d73c71b1c9f43a63f32eb8ef0db8d49514e4ab4afb0d53f3");
assert.deepEqual(
  first.findings.map((finding) => finding.id),
  ["N25-TEXT-NOTATION-DECLARATION", "N25-F42-CURVE-WEIGHT"],
);
assert.deepEqual(first.findings[0].zero_based_prose_indices, indices);

const textResults = [];
for (const locale of ["zh", "en"]) {
  const receipt = repair.text.find((item) => item.locale === locale);
  assert.ok(receipt);
  assert.deepEqual(receipt.zeroBasedProseIndices, indices);
  const beforePath = `${oldTextRoot}/${locale}/lesson.template.json`;
  const afterPath = `${currentRoot}/${locale}/lesson.template.json`;
  const beforeBinding = binding(beforePath, first.text_bindings[`${locale}_lesson`]);
  assert.equal(beforeBinding.sha256, receipt.before.sha256);
  const afterBinding = binding(afterPath, receipt.after);
  const before = json(beforePath);
  const after = json(afterPath);
  const expected = structuredClone(before);
  const modified = indices.map((index) => {
    assert.ok(Array.isArray(before.prose[index].changes));
    assert.ok(!before.prose[index].changes.includes("notation"));
    expected.prose[index].changes.push("notation");
    return {
      zeroBasedProseIndex: index,
      before: before.prose[index].changes,
      after: after.prose[index].changes,
    };
  });
  assert.deepEqual(after, expected);
  exactJson(beforePath, before);
  exactJson(afterPath, expected);

  const exercisesBeforePath = `${oldTextRoot}/${locale}/exercises.template.json`;
  const exercisesAfterPath = `${currentRoot}/${locale}/exercises.template.json`;
  const exercisesBefore = binding(
    exercisesBeforePath,
    first.text_bindings[`${locale}_exercises`],
  );
  const exercisesAfter = binding(exercisesAfterPath, exercisesBefore);
  assert.ok(
    readFileSync(resolve(root, exercisesBeforePath)).equals(
      readFileSync(resolve(root, exercisesAfterPath)),
    ),
  );
  textResults.push({
    locale,
    status: "PASS",
    before: beforeBinding,
    current: afterBinding,
    exercisesBefore,
    exercisesCurrent: exercisesAfter,
    modified,
    onlyAuthorizedChanges: true,
    allOtherFieldsAndBytesPreserved: true,
  });
}

const oldFigure = first.figures["fig-42"].hashes;
const beforeBindings = {};
const currentBindings = {};
for (const [kind, suffix, authorityKey, receiptKey] of [
  ["spec", "spec.json", "spec", "spec"],
  ["svg", "svg", "svg", "svg"],
  ["render", "render.json", "render", "render"],
  ["preview", "preview.png", "browser_preview_png", "preview"],
]) {
  beforeBindings[kind] = binding(`${beforeRoot}/fig-42.${suffix}`, {
    sha256: oldFigure[authorityKey],
  });
  currentBindings[kind] = binding(
    `${currentRoot}/fig-42.${suffix}`,
    repair.figure[receiptKey],
  );
}
assert.equal(beforeBindings.spec.sha256, repair.figure.before.sha256);
const sourceBinding = binding(
  ".tmp/STEMROBIN-181/d1816-d208/source-work/10p/pages/0069/figures/fig-42.png",
  { sha256: oldFigure.source_png },
);

const beforeSpecPath = `${beforeRoot}/fig-42.spec.json`;
const currentSpecPath = `${currentRoot}/fig-42.spec.json`;
const beforeSpec = json(beforeSpecPath);
const currentSpec = json(currentSpecPath);
const expectedSpec = structuredClone(beforeSpec);
const oldCurrent = expectedSpec.objects.find((object) => object.id === "current-curve");
const voltage = beforeSpec.objects.find((object) => object.id === "voltage-curve");
assert.equal(oldCurrent.strokeWidth, 3);
assert.equal(voltage.strokeWidth, 3);
oldCurrent.strokeWidth = 5;
const inventoryNote = " The source distinguishes a thicker current curve from a thinner voltage curve; the modern current stroke is visibly heavier while both curves remain solid.";
const inventory = expectedSpec.source.inventory.find(
  (item) => item.id === "source-axes-curves-and-leaders",
);
assert.ok(inventory);
inventory.description += inventoryNote;
assert.deepEqual(currentSpec, expectedSpec);
exactJson(beforeSpecPath, beforeSpec);
exactJson(currentSpecPath, expectedSpec);
assert.equal(resolve(root, currentSpec.source.image.path), sourceBinding.path);
assert.equal(currentSpec.source.image.sha256, sourceBinding.sha256);

const beforeSvg = readFileSync(resolve(root, `${beforeRoot}/fig-42.svg`), "utf8");
const currentSvg = readFileSync(resolve(root, `${currentRoot}/fig-42.svg`), "utf8");
const currentPathTag = `<path d="${oldCurrent.d}" fill="none" stroke="var(--ld-figure-ink, #15201f)" stroke-width="3" vector-effect="non-scaling-stroke"></path>`;
assert.equal(beforeSvg.split(currentPathTag).length, 2);
const expectedSvg = beforeSvg.replace(
  currentPathTag,
  currentPathTag.replace('stroke-width="3"', 'stroke-width="5"'),
);
assert.equal(currentSvg, expectedSvg);
const voltagePathTag = `<path d="${voltage.d}" fill="none" stroke="var(--ld-figure-ink, #15201f)" stroke-width="3" vector-effect="non-scaling-stroke"></path>`;
assert.ok(beforeSvg.includes(voltagePathTag));
assert.ok(currentSvg.includes(voltagePathTag));
const changedByteOffsets = [];
const oldSvgBytes = Buffer.from(beforeSvg);
const newSvgBytes = Buffer.from(currentSvg);
assert.equal(oldSvgBytes.length, newSvgBytes.length);
for (let index = 0; index < oldSvgBytes.length; index += 1) {
  if (oldSvgBytes[index] !== newSvgBytes[index]) changedByteOffsets.push(index);
}
assert.equal(changedByteOffsets.length, 1);
assert.equal(oldSvgBytes[changedByteOffsets[0]], "3".charCodeAt(0));
assert.equal(newSvgBytes[changedByteOffsets[0]], "5".charCodeAt(0));

const beforeRenderPath = `${beforeRoot}/fig-42.render.json`;
const currentRenderPath = `${currentRoot}/fig-42.render.json`;
const beforeRender = json(beforeRenderPath);
const currentRender = json(currentRenderPath);
assert.equal(currentRender.status, "pass");
assert.equal(currentRender.spec.sha256, currentBindings.spec.sha256);
assert.equal(currentRender.output.svg.sha256, currentBindings.svg.sha256);
assert.equal(resolve(root, currentRender.spec.path), currentBindings.spec.path);
assert.equal(resolve(root, currentRender.output.svg.path), currentBindings.svg.path);
const expectedRender = structuredClone(beforeRender);
expectedRender.spec = currentRender.spec;
expectedRender.output.svg = currentRender.output.svg;
assert.deepEqual(currentRender, expectedRender);
exactJson(currentRenderPath, expectedRender);

for (const captured of inputs.values()) {
  binding(captured.path, captured);
}

console.log(JSON.stringify({
  status: "PASS",
  reviewerIsAuthor: false,
  firstReview: firstBinding,
  repair: repairBinding,
  text: textResults,
  figure: {
    status: "PASS",
    source: sourceBinding,
    before: beforeBindings,
    current: currentBindings,
    specChanges: ["objects[current-curve].strokeWidth: 3 -> 5", "source.inventory[source-axes-curves-and-leaders].description: append source line-weight note"],
    svgChangedByteOffsetsZeroBased: changedByteOffsets,
    svgOnlyChange: "current path stroke-width 3 -> 5",
    voltageStrokeWidth: 3,
    bothPathsRemainSolid: true,
    allOtherSpecAndSvgContentUnchanged: true,
    renderBindingMatches: true,
    renderOtherFieldsUnchanged: true,
    previewReceiptBindingMatches: true,
  },
  inputHashesStableAtEndOfCheck: true,
  candidateWrites: 0,
  imageOpensByScript: 0,
  apiCalls: 0,
  scientificReproof: false,
  holdAdjudication: false,
}, null, 2));
