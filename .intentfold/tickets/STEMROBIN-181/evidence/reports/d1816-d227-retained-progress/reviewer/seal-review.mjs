import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const repo = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
const owned = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d227-source63-voltage-affected-review");
const author = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d226-source63-voltage-bar-repair");
const prior = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d215-source63-bars-science-review");
const expectedInput = "445116b0aa93a100ac93283bf29d207766ad14fae417ad79fcfe8ce3213f0a9d";
const digest = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const binding = (file, role) => {
  const bytes = fs.readFileSync(file);
  return { role, path: file, bytes: bytes.length, sha256: digest(bytes) };
};
const check = (record) => {
  const actual = binding(record.path, record.role);
  assert.equal(actual.bytes, record.bytes, record.path);
  assert.equal(actual.sha256, record.sha256, record.path);
};
const writeOwned = (name, value) => {
  const file = path.join(owned, name);
  assert.equal(path.dirname(file), owned);
  assert.equal(fs.existsSync(file), false, `Do not overwrite sealed artifact: ${file}`);
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
};

function differences(left, right, pointer = "") {
  if (Object.is(left, right)) return [];
  if (left === null || right === null || typeof left !== "object" || typeof right !== "object") {
    return [{ pointer, before: left, after: right }];
  }
  assert.equal(Array.isArray(left), Array.isArray(right), pointer);
  assert.deepEqual(Object.keys(left), Object.keys(right), `Structural drift: ${pointer}`);
  return Object.keys(left).flatMap((key) => differences(left[key], right[key], `${pointer}/${key}`));
}

function markdown(text) {
  assert.ok(text.startsWith("---\n"));
  const boundary = text.indexOf("\n---\n", 4);
  assert.ok(boundary > 4);
  return { meta: JSON.parse(text.slice(4, boundary)), body: text.slice(boundary + 5) };
}

function replaceExactlyOnce(text, from, to) {
  assert.equal(text.split(from).length - 1, 1, from);
  return text.replace(from, to);
}

function inspect() {
  const input = read(path.join(owned, "input-freeze.json"));
  assert.equal(binding(path.join(owned, "input-freeze.json")).sha256, expectedInput);
  const source = read(input.sourceOnly.path);
  const baseline = read(path.join(owned, "affected-pre-comparison-baseline.json"));
  assert.equal(baseline.phase, "SAVED_BEFORE_READING_AFTER_BASELINE_OR_D226_CANDIDATE");
  assert.equal(baseline.inputFreezeSha256, expectedInput);
  for (const record of [input.sourceOnly, input.afterBaseline, source.independentPixelBaseline, source.firstIndependentAdjudication]) check(record);
  const after = read(input.afterBaseline.path);
  for (const record of Object.values(after)) {
    if (record && typeof record === "object" && record.path && record.sha256) check(record);
  }
  const prepared = read(path.join(author, "prepared.json"));
  const authorReport = read(after.authorReport.path);
  const authorFreeze = read(after.authorFreeze.path);
  for (const record of [...prepared.before, ...authorFreeze.frozen, authorFreeze.report, authorFreeze.prepared, authorFreeze.preNative, authorReport.native]) check(record);

  const beforeJsonPath = path.join(author, "before/page.json");
  const beforeMdPath = path.join(author, "before/page.md");
  const before = read(beforeJsonPath);
  const candidate = read(after.repairedSourceJson.path);
  const beforeMd = fs.readFileSync(beforeMdPath, "utf8");
  const candidateMd = fs.readFileSync(after.repairedSourceMd.path, "utf8");
  const beforeParsed = markdown(beforeMd);
  const candidateParsed = markdown(candidateMd);
  assert.deepEqual(beforeParsed.meta, before.meta);
  assert.deepEqual(candidateParsed.meta, candidate.meta);
  const deltas = differences(before, candidate);
  assert.deepEqual(deltas.map((item) => item.pointer), ["/meta/profile/sha256", "/meta/notes/3", "/blocks/10/lines/0"]);
  const oldLine = before.blocks[10].lines[0];
  const newLine = candidate.blocks[10].lines[0];
  assert.equal(newLine, replaceExactlyOnce(oldLine, "\\overline{u^2}", "\\overline{u}^2"));
  let expectedMd = replaceExactlyOnce(beforeMd, oldLine, newLine);
  expectedMd = replaceExactlyOnce(expectedMd, JSON.stringify(before.meta.notes[3]), JSON.stringify(candidate.meta.notes[3]));
  expectedMd = replaceExactlyOnce(expectedMd, before.meta.profile.sha256, candidate.meta.profile.sha256);
  assert.equal(candidateMd, expectedMd, "No unlisted Markdown byte delta");
  assert.equal(candidateParsed.body, replaceExactlyOnce(beforeParsed.body, oldLine, newLine));
  assert.equal(candidate.meta.book, "10p");
  assert.equal(candidate.meta.page, 63);
  assert.equal(candidate.meta.printed_page, 53);
  assert.deepEqual(candidate.meta.errata, []);
  assert.equal(fs.readFileSync(path.join(author, "before/audit.json")).equals(fs.readFileSync(path.join(author, "frozen/audit.json"))), true);

  const d215 = read(source.firstIndependentAdjudication.path);
  const d215Baseline = read(source.independentPixelBaseline.path);
  assert.equal(candidate.meta.render.sha256, d215Baseline.source.sha256);
  const rebindings = d215.proposalScienceVerdicts.map((record, index) => {
    const blockIndex = [3, 5, 7][index];
    assert.equal(record.scienceVerdict, "PASS_SCOPED_PROPOSAL_ONLY");
    assert.deepEqual(candidate.blocks[blockIndex], before.blocks[blockIndex]);
    assert.equal(candidate.blocks[blockIndex].lines[0], record.exactOriginalBlockLine);
    assert.equal(candidate.blocks[blockIndex].lines[0].startsWith(record.original), true);
    assert.ok(candidateMd.includes(record.exactOriginalBlockLine));
    return {
      proposedId: record.proposedId,
      priorReportPointer: `/proposalScienceVerdicts/${index}`,
      equation: record.equation,
      block: record.block,
      candidateJsonPointer: `/blocks/${blockIndex}/lines/0`,
      exactOriginalBlockLine: record.exactOriginalBlockLine,
      original: record.original,
      correction: record.correction,
      inheritedScienceVerdict: record.scienceVerdict,
      oldPageSha256: record.sourcePageSha256,
      candidatePageSha256: after.repairedSourceJson.sha256,
      structuralBindingVerdict: "PASS_EXACT_UNCHANGED_ORIGINAL_AND_BLOCK",
      scienceRereviewPerformed: false,
      registered: false
    };
  });
  assert.equal(rebindings.length, 3);
  const proposal = read(after.proposal.path);
  check(proposal.candidatePage);
  assert.deepEqual(proposal.candidatePage, after.repairedSourceJson);
  assert.equal(proposal.block, "p0063#11");
  assert.equal(proposal.original, newLine.slice(0, newLine.lastIndexOf("$") + 1));
  assert.equal(proposal.corrected, replaceExactlyOnce(proposal.original, "\\overline{u}^2", "\\overline{u^2}"));
  assert.equal(proposal.originalImage.sha256, candidate.meta.render.sha256);
  assert.deepEqual(proposal.originalImage, d215.exactReferences.originalPhysical63 && {
    path: d215.exactReferences.originalPhysical63.path,
    bytes: d215.exactReferences.originalPhysical63.bytes,
    sha256: d215.exactReferences.originalPhysical63.sha256
  });
  assert.equal(proposal.registered, false);

  const canonicalRoot = path.join(repo, "ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0063");
  assert.equal(fs.readFileSync(path.join(canonicalRoot, "page.json")).equals(fs.readFileSync(beforeJsonPath)), true);
  assert.equal(fs.readFileSync(path.join(canonicalRoot, "page.md")).equals(fs.readFileSync(beforeMdPath)), true);
  const meterPath = path.join(repo, ".intentfold/tickets/STEMROBIN-181/production-meter.json");
  const meterBytes = fs.readFileSync(meterPath);
  const meter = JSON.parse(meterBytes);
  const qualifications = [];
  function findQualification(value, pointer = "") {
    if (!value || typeof value !== "object") return;
    for (const [key, item] of Object.entries(value)) {
      const next = `${pointer}/${key}`;
      if (key === "sourcePagesCounterQualification" && typeof item === "string" && item.includes("SOURCE63")) {
        qualifications.push({ pointer: next, value: item });
      } else if (item && typeof item === "object") findQualification(item, next);
    }
  }
  findQualification(meter);
  assert.equal(qualifications.length, 1);
  return {
    schema: "d227-scoped-mechanical-comparison@1",
    batch: "D227",
    status: "PASS_EXACT_AFFECTED_DELTA_AND_STRUCTURAL_BINDINGS",
    inputFreezeSha256: expectedInput,
    deltas,
    markdownExactThreeReplacements: true,
    inheritedBodyBytesEqualExceptVoltageScope: true,
    allOtherJsonLeavesAndStructureUnchanged: true,
    auditBytesUnchanged: true,
    printedLines: candidate.meta.printed_lines,
    blockCount: candidate.blocks.length,
    affectedPrintedContentScopes: 1,
    ancillaryNativeMetadataPointers: ["/meta/profile/sha256"],
    currentThreeRebindings: rebindings,
    fourthProposalBinding: {
      proposedId: proposal.proposedId,
      original: proposal.original,
      corrected: proposal.corrected,
      candidatePage: proposal.candidatePage,
      originalImage: { ...proposal.originalImage, verificationMode: "INHERITED_D215_SEALED_REFERENCE_NO_IMAGE_FILE_READ" },
      verdict: "PASS_EXACT_ONE_AVERAGING_SCOPE_ONLY"
    },
    canonicalStillBeforeBytes: true,
    counterQualificationObservation: {
      source: { path: meterPath, bytes: meterBytes.length, sha256: digest(meterBytes) },
      projection: qualifications[0],
      liveFileIsMutableNotAnImmutableDependency: true,
      consumption: "PENDING_PARENT_AFTER_REVIEW_CLOSURE",
      countersChangedByReviewer: false
    },
    imageFileReads: 0,
    imageOpens: 0,
    nativeCalls: 0,
    writesOutsideOwnedDirectory: 0
  };
}

const mode = process.argv[2];
if (mode === "inspect") {
  const evidence = inspect();
  writeOwned("scope-evidence.json", evidence);
  console.log(JSON.stringify(evidence, null, 2));
} else if (mode === "seal") {
  const report = read(path.join(owned, "report.json"));
  const evidence = read(path.join(owned, "scope-evidence.json"));
  const paths = [
    [path.join(owned, "input-freeze.json"), "supplied_input_freeze"],
    [path.join(owned, "source-only.json"), "source_only_read_first"],
    [path.join(owned, "dispatch-record.json"), "supplied_dispatch"],
    [path.join(owned, "affected-pre-comparison-baseline.json"), "sealed_pre_comparison_baseline"],
    [path.join(owned, "after-baseline.json"), "after_baseline_read_after_save"],
    [path.join(prior, "independent-pixel-baseline.json"), "D215_sealed_independent_original_observation_reused"],
    [path.join(prior, "report.json"), "D215_science_verdicts_reused_without_replay"],
    [path.join(prior, "review-freeze.json"), "D215_seal_reference_not_reverified"],
    [path.join(author, "prepared.json"), "D226_permitted_delta_and_before_bindings"],
    [path.join(author, "report.json"), "D226_author_claims_not_independent_authority"],
    [path.join(author, "author-freeze.json"), "D226_immutable_candidate_seal"],
    [path.join(author, "parent-collected.json"), "D226_author_lane_closed_not_approval"],
    [path.join(author, "pre-native/page.md"), "D226_pre_native_identity_only"],
    [path.join(author, "before/page.md"), "unchanged_before_markdown"],
    [path.join(author, "before/page.json"), "unchanged_before_json"],
    [path.join(author, "before/audit.json"), "unchanged_before_audit"],
    [path.join(author, "frozen/page.md"), "affected_candidate_markdown"],
    [path.join(author, "frozen/page.json"), "affected_candidate_json"],
    [path.join(author, "frozen/audit.json"), "unchanged_candidate_audit_no_native_replay"],
    [path.join(author, "voltage-errata-proposal.json"), "fourth_proposal_independently_adjudicated"],
    [path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native/d226-source63-voltage-bar-first-affected-finalize/receipt.json"), "existing_native_receipt_not_replayed"],
    [path.join(repo, "ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0063/page.json"), "canonical_still_unrepaired_read_only"],
    [path.join(repo, "ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0063/page.md"), "canonical_still_unrepaired_read_only"],
    [path.join(repo, ".intentfold/readme.md"), "repo_entry"],
    [path.join(repo, ".intentfold/project.json"), "project_boundary"],
    [path.join(repo, ".intentfold/charter/product.md"), "product_redlines"],
    [path.join(repo, ".intentfold/charter/engineering.md"), "engineering_redlines"],
    [path.join(repo, ".intentfold/charter/operations.md"), "operations_redlines"],
    [path.join(repo, ".intentfold/charter/ui.md"), "ui_redlines_read_only"],
    [path.join(repo, ".intentfold/tickets/STEMROBIN-181/ticket.json"), "ongoing_invocation_finish_review"],
    [path.join(repo, ".claude/skills/ld-s10y-lesson/SKILL.md"), "lesson_scope_authorization"],
    [path.join(repo, ".claude/skills/ld-s10y-lesson/references/production-resume.md"), "production_resume_bounded_reuse"],
    ["/Users/yong/.agents/skills/intentfold/SKILL.md", "intentfold_no_capability_restarted"],
    [path.join(owned, "scope-evidence.json"), "sealed_comparison_and_counter_qualification_projection"],
    [path.join(owned, "report.json"), "affected_review_report"],
    [path.join(owned, "seal-review.mjs"), "scoped_comparison_and_once_only_freeze_verifier"]
  ];
  const bindings = paths.map(([file, role]) => binding(file, role));
  assert.equal(new Set(bindings.map((item) => item.path)).size, bindings.length);
  writeOwned("review-freeze.json", {
    schema: "d227-affected-review-freeze@1",
    batch: "D227",
    ticket: "STEMROBIN-181",
    cwd: repo,
    finish: "review",
    offline: true,
    inputFreezeSha256: expectedInput,
    status: report.status,
    verdicts: report.verdicts,
    affectedOnly: true,
    bindingCount: bindings.length,
    bindings,
    inheritedOriginalImageReference: evidence.fourthProposalBinding.originalImage,
    counterQualification: evidence.counterQualificationObservation,
    counters: report.counters,
    remainingHolds: report.remainingHolds,
    exactBytesSemantics: "Bindings are absolute paths, exact byte lengths and SHA256, not scientific or image approval. D215 baseline and findings are reused without image file reads. The mutable production meter is recorded as a historical hash plus exact sealed qualification projection in scope-evidence.json, not frozen or rewritten. No inherited freeze verifier or native stage is replayed. These output files are sealed by content, not by changing others' permissions.",
    verification: {
      command: `node ${path.join(owned, "seal-review.mjs")} verify`,
      requiredInvocations: 1,
      imageReads: 0,
      writes: 0,
      globalChecks: 0,
      resultLocation: "Final response reports the observed exit/result and both completed hashes; no self-hash cycle or post-verification rewrite."
    },
    parentConsumption: "Only parent handles qualified consumption after closure. No consumption, registration, canonical promotion, modern formula change or whole-course approval by D227.",
    selfHash: "Computed externally after sealing, never embedded."
  });
  console.log(JSON.stringify({ sealed: true, bindingCount: bindings.length }));
} else if (mode === "verify") {
  const freezeBytes = fs.readFileSync(path.join(owned, "review-freeze.json"));
  const freeze = JSON.parse(freezeBytes);
  assert.equal(freeze.bindingCount, freeze.bindings.length);
  for (const record of freeze.bindings) check(record);
  const reportBytes = fs.readFileSync(path.join(owned, "report.json"));
  const report = JSON.parse(reportBytes);
  const evidence = read(path.join(owned, "scope-evidence.json"));
  assert.equal(freeze.inputFreezeSha256, expectedInput);
  assert.deepEqual(freeze.verdicts, report.verdicts);
  assert.deepEqual(freeze.counters, report.counters);
  assert.deepEqual(freeze.remainingHolds, report.remainingHolds);
  assert.deepEqual(report.currentThreeRebindings, evidence.currentThreeRebindings);
  assert.equal(report.sourceFidelity.changedPrintedContentScopes, 1);
  assert.equal(report.fourthVoltageSciProposal.original, evidence.fourthProposalBinding.original);
  assert.equal(report.fourthVoltageSciProposal.corrected, evidence.fourthProposalBinding.corrected);
  assert.equal(report.fourthVoltageSciProposal.candidatePageSha256, evidence.fourthProposalBinding.candidatePage.sha256);
  assert.equal(report.counters.actualImageOpens, 0);
  assert.equal(report.counters.currentScienceRereviews, 0);
  assert.equal(report.counters.registeredErrata, 0);
  console.log(JSON.stringify({
    status: "PASS_OWN_FREEZE_VERIFIED_ONCE",
    bindingCount: freeze.bindings.length,
    report: { bytes: reportBytes.length, sha256: digest(reportBytes) },
    reviewFreeze: { bytes: freezeBytes.length, sha256: digest(freezeBytes) },
    imageOpens: 0,
    writes: 0
  }, null, 2));
} else {
  throw new Error("Expected inspect, seal or verify");
}
