import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
assert.equal(process.cwd(), cwd);
const root = path.dirname(fileURLToPath(import.meta.url));
const load = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const files = new Map();

function bind(record) {
  const absolute = path.resolve(record.path);
  const bytes = fs.readFileSync(absolute);
  const actual = { path: absolute, bytes: bytes.length, sha256: digest(bytes) };
  if (record.sha256) assert.equal(actual.sha256, record.sha256, absolute);
  if (record.bytes !== undefined) assert.equal(actual.bytes, record.bytes, absolute);
  const previous = files.get(absolute);
  if (previous) assert.deepEqual(actual, previous);
  files.set(absolute, actual);
  return actual;
}

function records(value) {
  if (!value || typeof value !== "object") return;
  if (typeof value.path === "string" && value.sha256) {
    bind(value);
    return;
  }
  for (const item of Object.values(value)) records(item);
}

const reportPath = path.join(root, "report.json");
const report = load(reportPath);
const inventory = load(report.sourceFirstInventory.path);
const sourceOnlyPath = path.join(root, "source-only.json");
const afterPath = path.join(root, "after-inventory.json");
const sourceOnly = load(sourceOnlyPath);
const after = load(afterPath);
const inputFreeze = load(report.inputFreeze.path);
const author = load(after.authorReport.path);

assert.equal(report.actualImageOpens, 8);
assert.equal(report.imageLedger.length, report.actualImageOpens);
assert.deepEqual(report.imageLedger.map((item) => item.open), [1, 2, 3, 4, 5, 6, 7, 8]);
assert.equal(report.wholeCourseApproved, false);
assert.equal(report.atomImageD169.verdict, "HOLD");
assert.equal(report.sourceFirstInventory.sha256, "19ca7d0980be56bbb11f8d2a2c767a88f73eaa5e33fec6cf4f8e9f2adbc443cc");
assert.equal(report.inputFreeze.sha256, "f6213263d2d7115af24d62386339a3d1bd3d49a44de45e17c78ef9f39bb05acb");
records(report);
records(inputFreeze);
records(sourceOnly);
records(after);

for (const figure of report.figures) {
  assert.deepEqual(
    figure.exactSourceFirstObservations,
    inventory.figures[figure.figure].pixel_observations,
    figure.figure,
  );
  assert.equal(figure.totalContentRepairs, 1);
  assert.equal(figure.repairsRemaining, 0);
  assert.equal(figure.reviewerRepairs, 0);
  const selected = after.selected.find((item) => item.figure === figure.figure);
  assert(selected);
  assert.equal(figure.currentSpec.sha256, selected.candidate.spec.sha256);
  assert.equal(figure.currentRender.sha256, selected.candidate.render.sha256);
  assert.equal(figure.currentOutput.sha256, selected.candidate.svg.sha256);
  const native = load(figure.nativeReview.path);
  assert.equal(native.status, "pass");
  assert.equal(native.figure, figure.figure);
  assert.equal(native.spec.sha256, figure.currentSpec.sha256);
  assert.equal(native.render.sha256, figure.currentRender.sha256);
  assert.equal(native.source.sha256, figure.source.sha256);
  assert.equal(native.outputs.svg.sha256, figure.currentOutput.sha256);
  records(native);
  for (const receipt of [figure.validationReceipt, figure.renderReceipt]) {
    const payload = load(receipt.path);
    assert.equal(payload.exitCode, 0);
    records(payload);
  }
  const authored = author.figures.find((item) => item.figure === figure.figure);
  assert(authored);
  records(authored.currentInput);
  records(authored.nativeContexts);
  records(authored.templateBindings);
  records(authored.allApprovedLessonExerciseAndFigureTemplateBindings);
  const spec = load(figure.currentSpec.path);
  const joinProse = (lesson) => lesson.prose
    .map((fragment) => fragment.text)
    .filter(Boolean)
    .join("\n\n");
  assert.deepEqual(spec.source.authoritativeText.map((entry) => entry.text),
    report.approvedCurrentText.map((entry) => joinProse(load(entry.path))));
}

for (const receipt of author.inheritedNativeContextCallReceipts) {
  bind(receipt);
  const payload = load(receipt.path);
  records(payload.stdout);
  records(payload.stderr);
}
for (const image of report.imageLedger) bind(image);
for (const suffix of [
  "input-freeze.json",
  "repair-usage.json",
  "current-output-evidence.json",
]) {
  bind({ path: path.join(path.dirname(after.authorReport.path), suffix) });
}
for (const file of [
  ".intentfold/readme.md",
  ".intentfold/charter/engineering.md",
  ".intentfold/charter/operations.md",
  ".agents/skills/ld-s10y-image/SKILL.md",
  ".agents/skills/ld-s10y-image/references/figure-spec.md",
  ".agents/skills/ld-s10y-image/references/quality-gate.md",
  ".claude/skills/ld-s10y-lesson/references/production-resume.md",
  ".agents/skills/ld-s10y-image/scripts/record_review.py",
]) bind({ path: path.join(cwd, file) });
bind({ path: sourceOnlyPath });
bind({ path: afterPath });
bind({ path: fileURLToPath(import.meta.url) });
const reportBinding = bind({ path: reportPath });
const inventoryBinding = bind(report.sourceFirstInventory);
const freeze = {
  schema: "stemrobin/independent-figure-review-freeze@1",
  batch: "D177",
  ticket: "STEMROBIN-181",
  cwd,
  report: reportBinding,
  sourceFirstInventory: inventoryBinding,
  inputFreeze: bind(report.inputFreeze),
  figures: report.figures.map((figure) => ({
    figure: figure.figure,
    verdict: figure.verdict,
    currentSpec: bind(figure.currentSpec),
    currentRender: bind(figure.currentRender),
    currentOutput: bind(figure.currentOutput),
    nativeReview: bind(figure.nativeReview),
    totalContentRepairs: 1,
    repairsRemaining: 0,
  })),
  bindings: [...files.values()].sort((a, b) => a.path.localeCompare(b.path)),
  allDeclaredCurrentBindingsMatch: true,
  exactSourceFirstObservationsMatchSavedInventory: true,
  currentSpecBilingualTextMatchesApprovedProse: true,
  bindingPurpose: "Byte freshness and traceability only, not a replay of any passed native render, validation, context, source-page or text-review stage.",
  actualImageOpens: 8,
  maximumActualImageOpens: 8,
  parentImageOpens: 0,
  paidCalls: 0,
  reviewerRepairs: 0,
  totalRepairUsageUnchanged: report.totalRepairUsageUnchanged,
  nativeRecordReviewCalls: 2,
  nativeRecorderInternalIntegrityValidations: 2,
  standaloneValidationReruns: 0,
  renderReruns: 0,
  contextReruns: 0,
  sourcePageOrTextCheckReruns: 0,
  canonicalPromotions: 0,
  wholeCourseApproved: false,
  productAcceptance: false,
  D169AtomImageHoldUnchanged: true,
  N12D175Touched: false,
  awaitingParentCollectionAndClosure: true,
};
const target = path.join(root, "review-freeze.json");
assert.equal(target, report.reviewFreezePath);
assert(!fs.existsSync(target), "Do not overwrite an existing review freeze");
fs.writeFileSync(target, `${JSON.stringify(freeze, null, 2)}\n`, { flag: "wx" });
const freezeBytes = fs.readFileSync(target);
console.log(JSON.stringify({
  report: reportBinding,
  reviewFreeze: { path: target, bytes: freezeBytes.length, sha256: digest(freezeBytes) },
  boundFiles: freeze.bindings.length,
  figures: freeze.figures,
  actualImageOpens: report.actualImageOpens,
}, null, 2));
