import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
assert.equal(process.cwd(), root);
const dir = resolve(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d215-source63-bars-science-review");
const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const binding = (path, role) => {
  const bytes = readFileSync(path);
  return { role, path: resolve(path), bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") };
};
const inputs = read(resolve(dir, "input-freeze.json"));
const source = read(inputs.sourceOnly.path);
const after = read(inputs.afterBaseline.path);
const baseline = read(resolve(dir, "independent-pixel-baseline.json"));
const report = read(resolve(dir, "report.json"));
const page = read(after.sourcePage.path);
const md = readFileSync(after.sourceMarkdown.path, "utf8");
const proposal = read(after.authorProposal.path);
const oldReview = read(after.firstTextReview.path);
const checkBinding = (expected) => {
  const actual = binding(expected.path, "checked_input");
  assert.equal(actual.bytes, expected.bytes);
  assert.equal(actual.sha256, expected.sha256);
};

assert.equal(binding(resolve(dir, "input-freeze.json")).sha256, "976ccf8f1cc20e094f842951b0dd39ed7ac2cb35cb2a9b33399df4b3da22a86b");
checkBinding(inputs.sourceOnly);
checkBinding(inputs.afterBaseline);
checkBinding(source.original);
checkBinding(source.originalReconstruction);
source.crops.forEach((crop) => checkBinding(crop.native));
Object.values(after).filter((value) => value?.path).forEach(checkBinding);
assert.equal(page.meta.book, "10p");
assert.equal(page.meta.page, 63);
assert.equal(page.meta.printed_page, 53);
assert.equal(page.meta.render.sha256, source.original.sha256);
assert.equal(page.meta.errata.length, 0);
assert.equal(binding(proposal.pdf.path).sha256, page.meta.source.pdf_sha256);
assert.equal(baseline.phase, "BEFORE_AFTER_BASELINE_CANONICAL_AUTHOR_AND_SCIENCE");
assert.equal(binding(resolve(dir, "independent-pixel-baseline.json")).sha256, report.readOrder.baselineSha256);
assert.equal(proposal.proposed_records.length, 3);
assert.equal(report.proposalScienceVerdicts.length, 3);
assert.equal(oldReview.findings[0].id, "D202-SCI-01");

const expectedBlocks = [4, 6, 8];
const expectedEquations = ["2.19", "2.20", "2.21"];
const recordChecks = proposal.proposed_records.map((record, index) => {
  const reviewed = report.proposalScienceVerdicts[index];
  const originalLine = page.blocks[expectedBlocks[index] - 1].lines[0];
  assert.equal(record.block, `p0063#${expectedBlocks[index]}`);
  assert.equal(record.equation, expectedEquations[index]);
  assert.equal(record.source_page_sha256, after.sourcePage.sha256);
  assert.equal(record.source_image_sha256, source.original.sha256);
  assert.equal(record.exact_original_block_line, originalLine);
  assert.equal(originalLine, `${record.original} \uff08${record.equation}\uff09`);
  assert.equal(md.split("\n")[reviewed.canonicalMarkdownLine - 1], originalLine);
  assert.equal(record.original.split("\\overline{i}^2").length - 1, 1);
  assert.equal(record.corrected, record.original.replace("\\overline{i}^2", "\\overline{i^2}"));
  assert.equal(reviewed.proposedId, record.proposed_id);
  assert.equal(reviewed.block, record.block);
  assert.equal(reviewed.original, record.original);
  assert.equal(reviewed.exactOriginalBlockLine, record.exact_original_block_line);
  assert.equal(reviewed.correction, record.corrected);
  assert.equal(reviewed.sourcePageSha256, record.source_page_sha256);
  assert.equal(reviewed.sourceImageSha256, record.source_image_sha256);
  assert.equal(reviewed.scienceVerdict, "PASS_SCOPED_PROPOSAL_ONLY");
  assert.equal(reviewed.registered, false);
  assert.equal(oldReview.findings[0].literalEquationsUnchanged[index], record.original.slice(1, -1));
  return {
    proposedId: record.proposed_id,
    block: record.block,
    exactPageImageBlockOriginalAndCorrectionScope: "PASS",
    scientificVerdict: reviewed.scienceVerdict
  };
});
const voltageLine = page.blocks[10].lines[0];
assert.equal(voltageLine, `${report.transcriptionVerdicts[3].canonicalLiteralFormula} \uff082.22\uff09`);
assert.equal(md.split("\n")[86], voltageLine);
assert.equal(oldReview.findings[0].voltageContrast, report.earlierFindingAdjudication.quotedVoltageClaim);
assert.equal(report.counters.actualImageOpens, 5);
assert.equal(report.counters.contextImageOpens, 5);
assert.equal(report.counters.currentProposalSciencePasses, 3);
assert.equal(report.counters.registeredErrata, 0);
assert.equal(report.voltageConsequence.fourthProposalCreated, false);
assert.equal(report.voltageConsequence.visualScopeUnclear, false);
assert.equal(report.completion.releaseAuthorized, false);

const files = [
  [resolve(dir, "input-freeze.json"), "supplied_input_freeze"],
  [inputs.sourceOnly.path, "source_only_instruction"],
  [inputs.afterBaseline.path, "after_baseline_instruction"],
  [resolve(dir, "independent-pixel-baseline.json"), "immutable_independent_precomparison_baseline"],
  [source.original.path, "original_pixels"],
  ...source.crops.map((crop) => [crop.native.path, `unchanged_native_crop_${crop.equation}`]),
  [source.originalReconstruction.path, "existing_reconstruction_receipt_read_only_not_replayed"],
  ...Object.entries(after).filter(([, value]) => value?.path).map(([key, value]) => [value.path, key === "collectedAuthor" ? "collected_author_hash_binding_only" : key]),
  [resolve(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d212-source63-bar-diagnosis-author/original-first-open-observation.json"), "immutable_author_first_observation"],
  [proposal.pdf.path, "retained_pdf_hash_binding_only_not_opened_or_rendered"],
  [resolve(root, ".agents/skills/ld-s10y-image/SKILL.md"), "image_batch_instructions"],
  [resolve(root, ".claude/skills/ld-s10y-lesson/references/production-resume.md"), "recovery_instructions"],
  [resolve(root, ".intentfold/readme.md"), "repo_router"],
  [resolve(root, ".intentfold/charter/engineering.md"), "binding_engineering_instructions_read_only"],
  ["/Users/yong/.agents/skills/intentfold/SKILL.md", "intentfold_instructions_no_capability_restarted"],
  [resolve(dir, "report.json"), "independent_review_report"],
  [resolve(dir, "verify-review.mjs"), "read_only_scoped_binding_verifier"]
];
assert.equal(new Set(files.map(([path]) => path)).size, files.length);
const firstObservation = files.find(([, role]) => role === "immutable_author_first_observation");
assert.equal(binding(firstObservation[0]).sha256, report.exactReferences.authorImmutableFirstObservation.sha256);
console.log(JSON.stringify({
  status: "PASS_SCOPED_BINDINGS_AND_ARTIFACT_CONSISTENCY",
  imageOpensByVerifier: 0,
  imageProcessingByVerifier: 0,
  writesByVerifier: 0,
  sourceErrataCount: 0,
  recordChecks,
  scientificReasoningEvidence: "Direct analytic derivation in report.json, not numeric approximation or a mechanical proof claim.",
  bindings: files.map(([path, role]) => binding(path, role))
}, null, 2));
