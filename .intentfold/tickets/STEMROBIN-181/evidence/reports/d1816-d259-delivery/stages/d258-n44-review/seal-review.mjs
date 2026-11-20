import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
assert.equal(process.cwd(), cwd);
const author = ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d256-n44-author";
const review = ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d258-n44-review";
const json = (path) => JSON.parse(readFileSync(path, "utf8"));
const binding = (path) => {
  const bytes = readFileSync(path);
  return {
    path,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
};
const inputs = new Map();
let verifiedBindingRecords = 0;
function verify(record) {
  const actual = binding(record.path);
  assert.equal(actual.sha256, record.sha256, `Changed input: ${record.path}`);
  if (record.bytes !== undefined) assert.equal(actual.bytes, record.bytes);
  inputs.set(actual.path, actual);
  verifiedBindingRecords += 1;
}
function walk(value) {
  if (!value || typeof value !== "object") return;
  if (value.path && value.sha256) verify(value);
  for (const child of Object.values(value)) {
    if (child && typeof child === "object") walk(child);
  }
}
const baseline = json(`${author}/author-freeze.json`);
const prepared = json(`${author}/prepared.json`);
const bilingual = json(`${author}/bilingual-figure-bindings.json`);
const report = json(`${review}/report.json`);
verify(report.bindings.originalAuthorFreeze);
verify(report.bindings.prepared);
verify(report.bindings.currentBilingualBindings);
walk(baseline);
walk(prepared);
walk(bilingual);
const oldSpec = json(bilingual.originalSpec.path);
const spec = json(bilingual.spec.path);
const withoutText = (value) => {
  const copy = structuredClone(value);
  delete copy.source.authoritativeText;
  return copy;
};
assert.deepEqual(withoutText(spec), withoutText(oldSpec));
assert.deepEqual(spec.source.authoritativeText[0], oldSpec.source.authoritativeText[0]);
assert.equal(spec.source.authoritativeText.length, 2);
assert.equal(spec.source.authoritativeText[1].text, baseline.englishText);
const oldRender = json(bilingual.originalRender.path);
const render = json(bilingual.render.path);
// Bilingual metadata adds byte counts, not new render results.
const renderFacts = (value) => {
  const copy = structuredClone(value);
  delete copy.spec;
  for (const output of Object.values(copy.output)) delete output.bytes;
  return copy;
};
assert.deepEqual(renderFacts(render), renderFacts(oldRender));
assert.equal(render.status, "pass");
assert.equal(render.spec.sha256, bilingual.spec.sha256);
const native = json(`${review}/fig-68.review.json`);
assert.equal(native.schema, "ld-s10y-image/review@1");
assert.equal(native.status, "fail");
assert.equal(native.spec.sha256, bilingual.spec.sha256);
assert.equal(native.render.sha256, bilingual.render.sha256);
assert.equal(native.source.sha256, baseline.source.sha256);
assert.equal(native.outputs.svg.sha256, baseline.svg.sha256);
const lessonSource = "ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/phy9-c1-s5-n44/lesson.json";
verify({
  path: lessonSource,
  sha256: json(baseline.templates.zh.path).source.sha256,
});
for (const path of [
  ".claude/skills/ld-s10y-lesson/references/production-resume.md",
  ".agents/skills/ld-s10y-image/SKILL.md",
  ".agents/skills/ld-s10y-image/references/figure-spec.md",
  ".agents/skills/ld-s10y-image/references/quality-gate.md",
  ".agents/skills/ld-s10y-image/scripts/record_review.py",
  ".agents/skills/ld-s10y-image/scripts/validate_spec.py",
  ".intentfold/readme.md",
  ".intentfold/charter/engineering.md",
  "/Users/yong/.agents/skills/intentfold/SKILL.md",
]) {
  inputs.set(path, binding(path));
}
for (const item of report.imageUsage.orderedOpens) {
  assert(inputs.has(item.path));
}
const outputPaths = [
  `${review}/english-review.json`,
  `${review}/source-inventory.json`,
  `${review}/fig-68.review.json`,
  `${review}/report.json`,
  `${review}/seal-review.mjs`,
];
const freeze = {
  schema: "STEMROBIN-181/independent-review-freeze@1",
  ticket: "STEMROBIN-181",
  batch: "D258",
  book: "9p",
  lesson: "phy9-c1-s5-n44",
  status: report.status,
  sealedAt: new Date().toISOString(),
  cwd,
  writeRoot: resolve(review),
  verifiedBindingRecords,
  bindingMismatches: [],
  inputs: [...inputs.values()].sort((a, b) => a.path.localeCompare(b.path)),
  outputs: outputPaths.map(binding),
  currentNativeBindings: {
    spec: binding(bilingual.spec.path),
    render: binding(bilingual.render.path),
    source: binding(baseline.source.path),
    svg: binding(baseline.svg.path),
    review: binding(`${review}/fig-68.review.json`),
    nativeReviewStatus: native.status,
  },
  imageUsage: report.imageUsage,
  usage: report.usage,
  preservation: {
    originalAuthorFreezeVerified: true,
    originalPreparedBindingsVerified: true,
    approvedChineseTemplateUnchanged: true,
    retainedSourceLessonHashVerifiedWithoutProseReview: true,
    bilingualSpecChangedOnlyByCompleteReviewedEnglishContext: true,
    originalAssertionsAndAllNonContextFieldsUnchanged: true,
    originalSvgAndBothPreviewsUnchanged: true,
    rendererPassReusedWithoutExecution: true,
  },
  limits: report.limits,
  selfBinding: "This freeze excludes itself to avoid a circular hash; its SHA-256 is printed on completion.",
};
const freezePath = `${review}/review-freeze.json`;
writeFileSync(freezePath, JSON.stringify(freeze, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({
  status: freeze.status,
  verifiedBindingRecords,
  inputFiles: freeze.inputs.length,
  outputFiles: freeze.outputs.length,
  imageOpens: freeze.imageUsage.imageOpens,
  freeze: binding(freezePath),
}, null, 2));
