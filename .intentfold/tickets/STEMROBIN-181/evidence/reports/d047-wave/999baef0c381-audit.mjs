import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const workspace = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const tmp = `${workspace}/.intentfold/tickets/STEMROBIN-181/tmp`;
const bindings = new Map();
const json = (path) => JSON.parse(readFileSync(path, "utf8"));
const sha256 = (path) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");
function bind(record, expected = record.sha256 ?? record.expectedSha256) {
  const path = resolve(workspace, record.path);
  assert.match(expected, /^[a-f0-9]{64}$/);
  const actual = sha256(path);
  assert.equal(actual, expected, `SHA mismatch: ${path}`);
  if (bindings.has(path)) assert.equal(bindings.get(path).expectedSha256, expected);
  bindings.set(path, { path, expectedSha256: expected, actualSha256: actual, matches: true });
  return path;
}
const originalPath = bind({
  path: `${tmp}/d045-n44-science-review.json`,
  sha256: "419ef2a3f56aff2eb6169d90be5eb7f824e763ee93191185f6c9d9169eccaa0a",
});
const repairPath = bind({
  path: `${tmp}/d046-n44-text-repair/repair-freeze.json`,
  sha256: "3dac48e44d85268eef06e8d8476dc47644fc137e2f3537884dc0e55663921472",
});
const original = json(originalPath);
const repair = json(repairPath);
assert.equal(original.status, "HOLD");
assert.equal(original.SCI, "HOLD");
assert.equal(original.ZHEN, "HOLD");
assert.equal(repair.repairs, 1);
for (const record of [
  repair.initialAuthorFreeze.original,
  repair.initialAuthorFreeze.snapshot,
  repair.independentReviewInput.original,
  repair.independentReviewInput.snapshot,
  repair.history,
  original.authorFreeze,
  ...Object.values(original.candidateBindings),
  original.sourceAuthority.review,
  original.sourceAuthority.consumed,
  original.sourceAuthority.rawZh,
  original.sourceAuthority.rawEn,
  original.sourceAuthority.page122,
  ...original.evidenceBindings.filter((record) =>
    /\/(physics-authorities|detuning-counterexample)\.json$/.test(record.path)),
]) bind(record);
const initialFreeze = json(repair.initialAuthorFreeze.original.path);
bind(initialFreeze.native);
const initialReceipt = json(resolve(workspace, initialFreeze.native.path));
assert.equal(initialReceipt.exitCode, 0);
assert.equal(JSON.parse(initialReceipt.stdout).status, "pass");
for (const output of initialFreeze.outputs) bind(output.flow);
for (const output of repair.outputs) {
  for (const record of [
    output.frozen, output.prose, output.normalization, output.derivedFlow,
    ...output.fullTemplates,
  ]) bind(record);
}
bind(repair.native);
const receipt = json(repair.native.path);
assert.equal(receipt.exitCode, 0);
assert.equal(receipt.error, null);
const native = JSON.parse(receipt.stdout);
assert.equal(native.status, "pass");
assert.deepEqual(native.errors, []);
assert.equal(native.nativeFinalizeRun, false);
assert.equal(native.fullCardApproval, false);

function differences(before, after, pointer = "") {
  if (JSON.stringify(before) === JSON.stringify(after)) return [];
  if (before === null || after === null ||
      typeof before !== "object" || typeof after !== "object" ||
      Array.isArray(before) !== Array.isArray(after)) return [pointer];
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])];
  return keys.flatMap((key) => differences(
    before[key], after[key],
    `${pointer}/${key.replaceAll("~", "~0").replaceAll("/", "~1")}`,
  ));
}
const scoped = [];
for (const output of repair.outputs) {
  const language = output.language;
  const before = json(original.candidateBindings[`${language}Template`].path);
  const after = json(output.frozen.path);
  const changedPointers = differences(before, after);
  const allowed = language === "zh" ? ["/prose/1/text"] :
    ["/prose/0/text", "/prose/1/text", "/section_breaks/0/before"];
  assert.deepEqual(changedPointers, allowed);
  assert.deepEqual(after.source, before.source);
  assert.deepEqual(after.prose.slice(2), before.prose.slice(2));
  assert.deepEqual(
    after.prose[1].text.split("\n\n").slice(0, 2),
    before.prose[1].text.split("\n\n").slice(0, 2),
  );
  const raw = json(original.sourceAuthority[language === "zh" ? "rawZh" : "rawEn"].path);
  assert.deepEqual(after.source.data, raw);
  const nativeLanguage = native.languages.find((entry) => entry.language === language);
  assert.equal(nativeLanguage.template, output.template.path);
  assert.equal(nativeLanguage.template_sha256, output.frozen.sha256);
  assert.deepEqual(nativeLanguage.errors, []);
  assert.deepEqual(nativeLanguage.katex_warnings, []);
  const flow = nativeLanguage.paragraphs;
  assert.equal(flow.paragraphs.length, 6);
  for (const [index, block] of after.prose.entries()) {
    if (block.kind !== "p") continue;
    assert.equal(
      flow.paragraphs.filter((paragraph) => paragraph.blockIndex === index)
        .map((paragraph) => paragraph.text).join("\n\n"),
      block.text,
    );
  }
  assert.deepEqual(flow.resolvedBreaks, [1]);
  assert.equal(flow.boundaries.length, 1);
  const boundary = flow.boundaries[0];
  assert.equal(boundary.index, 1);
  assert.deepEqual(
    { before: boundary.before, after: boundary.after }, after.section_breaks[0],
  );
  const position = flow.paragraphs.findIndex((paragraph) => paragraph.index === boundary.index);
  assert.equal(flow.paragraphs[position - 1].text, boundary.before);
  assert.equal(flow.paragraphs[position].text, boundary.after);
  const deriveReceipt = json(output.derivedFlow.path);
  assert.equal(deriveReceipt.exitCode, 0);
  const derived = JSON.parse(deriveReceipt.stdout);
  assert.deepEqual(derived.paragraphs, flow.paragraphs);
  assert.deepEqual(derived.resolvedBreaks, []);
  scoped.push({
    language, changedPointers, sourceSnapshotUnchanged: true,
    firstSixExperimentSentencesUnchanged: true, proseObjects2_3_4Unchanged: true,
    nativeTemplateSha256: nativeLanguage.template_sha256,
    nativeParagraphs: flow.paragraphs.length, nativeResolvedBreaks: flow.resolvedBreaks,
    finalAnchorMatchesAdjacentNativeParagraphs: true,
    preAnchorDerivationComparedWithoutReplay: true,
  });
}
console.log(JSON.stringify({
  schema: "STEMROBIN-181/n44-affected-read-only-integrity@1",
  verifiedUniqueBindings: bindings.size,
  allBindingsMatch: true,
  bindings: [...bindings.values()],
  scoped,
  nativeReceiptsConsumed: 2,
  nativeCommandsReplayed: 0,
  sourceOrModernImagesOpened: 0,
  authorScriptsExecuted: 0,
  writesByAudit: 0,
}, null, 2));
