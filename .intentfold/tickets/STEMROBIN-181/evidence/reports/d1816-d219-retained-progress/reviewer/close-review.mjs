import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const repo = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
const dir = path.dirname(fileURLToPath(import.meta.url));
const expectedDir = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d219-source74-76-review");
const authorDir = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d217-10p-source74-76-author");
const authorityHash = "c5ce41efeb57b155a3e6b4e847c2744257a0a73b0ffea285beb229ef11d2e167";
assert.equal(process.cwd(), repo);
assert.equal(dir, expectedDir);
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const binding = (file) => {
  assert(path.isAbsolute(file));
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: hash(bytes) };
};
const match = (expected) => {
  const current = binding(expected.path);
  assert.equal(current.bytes, expected.bytes, `bytes: ${expected.path}`);
  assert.equal(current.sha256, expected.sha256, `sha256: ${expected.path}`);
  return current;
};
const writeNew = (name, value) => {
  const file = path.join(dir, name);
  assert.equal(path.dirname(file), dir);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
};
const mode = process.argv[2];
if (mode === "freeze") {
  const input = binding(path.join(dir, "input-freeze.json"));
  assert.equal(input.sha256, authorityHash);
  const authority = readJson(input.path);
  const source = readJson(authority.sourceOnly.path);
  const after = readJson(authority.afterInventory.path);
  const report = readJson(path.join(dir, "report.json"));
  const currentManifest = readJson(after.currentOutputBindings.path);
  const native = readJson(after.nativeSummary.path);
  const authorFreeze = readJson(after.authorFreeze.path);
  const bindings = new Map();
  const add = (entry) => {
    const verified = match(entry);
    const previous = bindings.get(verified.path);
    if (previous) assert.deepEqual(previous, verified);
    bindings.set(verified.path, verified);
  };
  const collect = (value) => {
    if (!value || typeof value !== "object") return;
    if (value.path && Number.isInteger(value.bytes) && value.sha256) add(value);
    Object.values(value).forEach(collect);
  };
  add(input);
  collect(authority.sourceOnly);
  collect(authority.afterInventory);
  collect(source);
  collect(after);
  collect(report);
  for (const stage of native.stages) {
    add(stage.receipt);
    const receipt = readJson(stage.receipt.path);
    assert.equal(stage.exitCode, 0);
    assert.equal(receipt.exitCode, 0);
    assert.equal(receipt.attempt, 1);
    assert.equal(receipt.cwd, repo);
    for (const output of receipt.outputsAtStageCompletion) {
      if (bindings.has(output.current.path)) add(output.current);
    }
    for (const name of ["stdout.txt", "stderr.txt"]) {
      const file = path.join(path.dirname(stage.receipt.path), name);
      const expected = currentManifest.nativeEvidence.find((item) => item.path === file);
      assert(expected, `missing inherited evidence binding: ${file}`);
      add(expected);
    }
  }
  const inheritedExtras = [
    path.join(authorDir, "native/vectorize-0076-first/subprocess-02.receipt.json"),
    path.join(authorDir, "native/vectorize-0076-first/subprocess-02.stdout"),
    path.join(authorDir, "native/vectorize-0076-first/subprocess-02.stderr"),
    path.join(authorDir, "native/finalize-0074-first/subprocess-01.receipt.json")
  ];
  for (const file of inheritedExtras) {
    const expected = currentManifest.nativeEvidence.find((item) => item.path === file);
    assert(expected, `missing inherited evidence binding: ${file}`);
    add(expected);
  }
  for (const figure of authorFreeze.currentFigureArtifacts) add(figure.retained);
  const rasterReceipt = readJson(inheritedExtras[0]);
  assert.equal(rasterReceipt.command[2], after.figure.svg.path);
  assert.equal(rasterReceipt.command[3], after.figure.existingNativeSvgRaster.path);
  assert.equal(rasterReceipt.exitCode, 0);
  const pageChecks = [];
  for (const item of after.pages) {
    const mdBinding = item.files.find((file) => file.path.endsWith("/page.md"));
    const jsonBinding = item.files.find((file) => file.path.endsWith("/page.json"));
    const md = fs.readFileSync(mdBinding.path, "utf8");
    const json = readJson(jsonBinding.path);
    const headerEnd = md.indexOf("\n---", 4);
    assert(headerEnd > 4);
    assert.deepEqual(JSON.parse(md.slice(4, headerEnd)), json.meta);
    let cursor = headerEnd + 4;
    let actualRows = 0;
    for (const block of json.blocks) {
      for (const line of block.lines) {
        const position = md.indexOf(line, cursor);
        assert(position >= cursor, `ordered MD/JSON row mismatch: ${item.page}`);
        cursor = position + line.length;
        if (block.kind !== "fig") actualRows += 1 + (line.match(/↵/gu) || []).length;
      }
    }
    const comparison = report.pageComparisons.find((page) => page.physicalPage === item.page);
    assert.equal(actualRows, comparison.independentTotalTextRows);
    assert.equal(json.meta.printed_lines, comparison.independentTotalTextRows);
    assert.equal(comparison.bodyRowResults.length, comparison.independentBodyRows);
    pageChecks.push({
      page: item.page,
      mdJsonOrderedRowsAndMetadataAgree: true,
      independentlyObservedPrintedRows: comparison.independentTotalTextRows,
      candidatePrintedRowsIncludingActualWraps: actualRows,
      sourceAcceptance: false
    });
  }
  assert.equal(report.actualImageLedger.length, 7);
  assert.equal(report.actualCounters.actualImageOpens, 7);
  assert.equal(report.scope.qualifyingIndependentPass, false);
  assert.equal(report.closure.canonicalConsumptionEligible, false);
  add(binding(path.join(dir, "report.json")));
  add(binding(fileURLToPath(import.meta.url)));
  assert.equal(bindings.size, 58);
  const freeze = {
    schema: "stemrobin181/review-freeze@1",
    batch: "D219",
    ticket: "STEMROBIN-181",
    role: "SOLE_FIRST_INDEPENDENT_REVIEWER",
    status: report.status,
    verdict: report.verdict,
    cwd: repo,
    createdAt: new Date().toISOString(),
    authoritativeInputSha256: authorityHash,
    sourceApproval: false,
    qualifyingIndependentPass: false,
    canonicalConsumptionEligible: false,
    completeCoursesAdded: 0,
    formalHandoff: false,
    bindingCount: bindings.size,
    report: bindings.get(path.join(dir, "report.json")),
    bindings: [...bindings.values()].sort((a, b) => a.path.localeCompare(b.path)),
    pageChecks,
    actualImageOpens: 7,
    currentContextImageOpens: 7,
    parentImageOpens: 0,
    paidCalls: 0,
    nativeReplayCalls: 0,
    gitCalls: 0,
    writesOnly: dir,
    originalsInventoriedBeforeCandidateNativeReads: true,
    verification: {
      policy: "Verify this completed freeze exactly once, then stop.",
      receiptPath: path.join(dir, "review-freeze-verification.json"),
      receiptExcludedFromFreeze: "Generated after verification; no circular self-binding."
    }
  };
  writeNew("review-freeze.json", freeze);
  console.log(JSON.stringify({ frozenBindingCount: freeze.bindingCount, freeze: binding(path.join(dir, "review-freeze.json")), report: freeze.report, actualImages: 7 }, null, 2));
} else if (mode === "verify") {
  const freezeBinding = binding(path.join(dir, "review-freeze.json"));
  const freeze = readJson(freezeBinding.path);
  assert.equal(freeze.batch, "D219");
  assert.equal(freeze.cwd, repo);
  assert.equal(freeze.bindingCount, freeze.bindings.length);
  assert.equal(new Set(freeze.bindings.map((entry) => entry.path)).size, freeze.bindingCount);
  for (const entry of freeze.bindings) match(entry);
  assert.equal(freeze.authoritativeInputSha256, authorityHash);
  assert.equal(binding(path.join(dir, "input-freeze.json")).sha256, authorityHash);
  match(freeze.report);
  const receipt = {
    schema: "stemrobin181/review-freeze-verification@1",
    batch: "D219",
    status: "VERIFIED",
    verifiedAt: new Date().toISOString(),
    verificationPasses: 1,
    verifiedBindingCount: freeze.bindingCount,
    mismatches: [],
    reviewFreeze: freezeBinding,
    report: freeze.report,
    actualImageOpens: freeze.actualImageOpens,
    parentImageOpens: 0,
    qualifyingIndependentPass: false,
    canonicalConsumptionEligible: false,
    verificationCreatesNoSourceApproval: true
  };
  writeNew("review-freeze-verification.json", receipt);
  console.log(JSON.stringify(receipt, null, 2));
} else {
  throw new Error("Use freeze or verify; no native or production stage is invoked.");
}
