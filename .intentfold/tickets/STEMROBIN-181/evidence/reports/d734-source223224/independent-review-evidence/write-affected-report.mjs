import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
assert.equal(process.cwd(), repo);
const tmp = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp");
const own = path.join(tmp, "d718-source223224-first-review");
const current = path.join(tmp, "d728-source224-linewrap-continuation");
const passed223 = path.join(tmp, "d727-source223224-affected-repair");
const sha = filename => createHash("sha256").update(fs.readFileSync(filename)).digest("hex");
const binding = filename => ({ path: filename, sha256: sha(filename), bytes: fs.statSync(filename).size });
const firstPath = path.join(own, "report.json");
const firstBinding = binding(firstPath);
assert.equal(firstBinding.sha256, "32d71fb54c7cdd95abf310483245f7a7ca4a8a2ccf2d15f49b03374e2a4507dd");
const first = JSON.parse(fs.readFileSync(firstPath, "utf8"));
assert.equal(first.status, "FAIL_SOURCE_LITERALITY");
const continuationPath = path.join(current, "report.json");
const continuationBinding = binding(continuationPath);
const continuation = JSON.parse(fs.readFileSync(continuationPath, "utf8"));
assert.equal(continuation.status, "SOURCE223224-FOUR-LITERAL-REPAIRS-NATIVE-PASS-AFFECTED-REVIEW-PENDING");

const changes = [
  { id: "223-SOURCE-01", page: "0223", block: 4, before: "那末又会获得白光（彩图 II）. 分解出来的光谱", after: "那末又会获得白光（彩图 II），分解出来的光谱" },
  { id: "224-SOURCE-01", page: "0224", block: 5, before: "那么它就是白色", after: "那么它就呈白色" },
  { id: "224-SOURCE-02", page: "0224", block: 5, before: "入射到它那里去的太阳光线", after: "入射到它那里的太阳光线" },
  { id: "224-SOURCE-03", page: "0224", block: 4, before: "就会显出紫色. 但\n是没有出现这种现象", after: "就会显出紫色，但\n是没有出现这种现象" },
];
function replaceOnce(text, before, after) {
  assert.equal(text.split(before).length, 2, "Expected exactly one affected excerpt");
  return text.replace(before, after);
}
const body = text => text.slice(text.indexOf("<!--"));
const findings = [];
const pages = [];
const currentFiles = {};

for (const page of ["0223", "0224"]) {
  const local = {};
  for (const name of ["page.md", "page.json", "audit.json"]) {
    const filename = path.join(current, "root/10p/pages", page, name);
    local[name] = binding(filename);
    currentFiles[`${page}_${name}`] = local[name];
    const declared = continuation.outputs.find(entry => path.join(repo, entry.path) === filename);
    assert.ok(declared, "Current output absent from d728 report");
    assert.equal(local[name].sha256, declared.sha256);
  }
  const previousMd = first.files[`${page}_page.md`];
  const previousJson = first.files[`${page}_page.json`];
  assert.equal(sha(previousMd.path), previousMd.sha256);
  assert.equal(sha(previousJson.path), previousJson.sha256);
  const oldJson = JSON.parse(fs.readFileSync(previousJson.path, "utf8"));
  const newJson = JSON.parse(fs.readFileSync(local["page.json"].path, "utf8"));
  const newMd = fs.readFileSync(local["page.md"].path, "utf8");
  let expectedBody = body(fs.readFileSync(previousMd.path, "utf8"));
  const expectedBlocks = structuredClone(oldJson.blocks);
  const pageChanges = changes.filter(change => change.page === page);

  for (const change of pageChanges) {
    const priorFinding = first.findings.find(finding => finding.id === change.id);
    assert.ok(priorFinding);
    assert.equal(priorFinding.page, Number(page));
    assert.equal(priorFinding.location.candidateBlockIndex0, change.block);
    assert.equal(change.after.replaceAll("\n", ""), priorFinding.expectedCandidateExcerpt);
    expectedBody = replaceOnce(expectedBody, change.before, change.after);
    const block = expectedBlocks[change.block];
    block.lines = replaceOnce(block.lines.join("\n"), change.before, change.after).split("\n");
    assert.ok(newMd.includes(change.after));
    assert.ok(newJson.blocks[change.block].lines.join("\n").includes(change.after));
    assert.ok(!newMd.includes(change.before));
    findings.push({
      id: change.id,
      page: Number(page),
      status: "RESOLVED_PASS_AFFECTED_ONLY",
      sourceBasis: { report: firstBinding, source: priorFinding.source, sourceExcerpt: priorFinding.sourceExcerpt },
      priorText: change.before,
      currentText: change.after,
      preservedLiteralNewline: change.id === "224-SOURCE-03",
      candidateBlockIndex0: change.block,
      currentEvidence: [local["page.md"], local["page.json"]],
    });
  }
  // Identity outside the four patches carries prior evidence, not a new full review.
  assert.equal(body(newMd), expectedBody);
  assert.deepEqual(newJson.blocks, expectedBlocks);
  assert.deepEqual(newJson.meta, oldJson.meta);
  const audit = JSON.parse(fs.readFileSync(local["audit.json"].path, "utf8"));
  assert.equal(audit.lines_printed, 26);
  assert.equal(audit.lines_md, 26);
  pages.push({
    page: Number(page),
    printedPage: newJson.meta.printed_page,
    SOURCE: "PASS_AFFECTED_ONLY_WITH_UNCHANGED_PRIOR_CONTENT_REUSED",
    resolvedFindingIds: pageChanges.map(change => change.id),
    unchangedMarkdownOutsideFourPatches: true,
    unchangedJsonOutsideFourPatches: true,
    evidence: Object.values(local),
    nativeLineCount: { linesPrinted: 26, linesMd: 26, status: "SAVED_PASS_REUSED" },
  });
}

const figures = [];
for (const [page, figure] of [["0223", "fig-196"], ["0224", "fig-197"]]) {
  const priorPage = first.pages.find(entry => entry.page === Number(page));
  assert.equal(priorPage.RAW.status, "PASS");
  assert.equal(priorPage.SVG.status, "PASS");
  const outputs = [];
  for (const [extension, role] of [["png", "raw"], ["svg", "svg"]]) {
    const filename = path.join(current, "work/10p/pages", page, "figures", `${figure}.${extension}`);
    const actual = binding(filename);
    const previous = first.files[`${page}_${role}`];
    assert.equal(actual.sha256, previous.sha256);
    const declared = continuation.unchangedFigures.find(entry => path.join(repo, entry.path) === filename);
    assert.ok(declared);
    assert.equal(actual.sha256, declared.sha256);
    outputs.push({ role, ...actual, prior: previous, exactHashUnchanged: true });
  }
  figures.push({ page: Number(page), figureId: figure, RAW: "PASS_REUSED_EXACT_HASH", SVG: "PASS_REUSED_EXACT_HASH", priorReview: firstBinding, imageOpens: 0, outputs });
}

const native = [];
for (const [page, directory] of [["0223", passed223], ["0224", current]]) {
  const filename = path.join(directory, `${Number(page)}-finalize.receipt.json`);
  const actual = binding(filename);
  const saved = JSON.parse(fs.readFileSync(filename, "utf8"));
  assert.equal(saved.exitCode, 0);
  assert.ok(saved.stdout.includes("26 行（印刷 26）"));
  if (page === "0223") {
    assert.equal(actual.sha256, continuation.source223NativePASSReused.sha256);
    assert.equal(actual.path, path.join(repo, continuation.source223NativePASSReused.path));
    for (const name of ["page.md", "page.json", "audit.json"]) {
      assert.equal(sha(path.join(passed223, "root/10p/pages", page, name)), currentFiles[`${page}_${name}`].sha256);
    }
  } else {
    assert.equal(actual.sha256, continuation.native[0].sha256);
    assert.equal(actual.path, path.join(repo, continuation.native[0].path));
  }
  native.push({ page: Number(page), stage: "finalize", status: "PASS_REUSED", receipt: actual, stdout: saved.stdout, rerun: false });
}
const wrapperScript = binding(path.join(repo, continuation.firstWrapperFailure.script.path));
assert.equal(wrapperScript.sha256, continuation.firstWrapperFailure.script.sha256);
assert.equal(sha(first.priorFailure.receipt.path), first.priorFailure.receipt.sha256);
assert.equal(sha(firstPath), firstBinding.sha256);
assert.equal(sha(continuationPath), continuationBinding.sha256);

const report = {
  schema: "STEMROBIN-181/source-text-affected-review@1",
  ticket: "STEMROBIN-181",
  continuation: "181-3",
  createdAt: new Date().toISOString(),
  cwd: repo,
  ownedDirectory: own,
  status: "PASS_AFFECTED_TEXT_ONLY",
  scope: "Only the four original d718 literal findings; unchanged first RAW/SVG PASS reused by exact hash. No new images, full source review or native execution.",
  imagesOpened: 0,
  firstReview: { ...firstBinding, status: first.status, retainedWithoutOverwrite: true },
  currentContinuationReport: continuationBinding,
  findings,
  pages,
  figures,
  native,
  firstWrapperFailure: {
    script: wrapperScript,
    error: continuation.firstWrapperFailure.error,
    cause: "The d727 wrapper searched a joined excerpt where original source-preserved text contains a literal newline between 但 and 是.",
    resolution: "d728 restored the comma using the proper literal newline. The native page223 PASS was preserved and reused; page224 saved native receipt passes26/26.",
    retainedWithoutOverwrite: true,
    nativeFailureOrScienceVerdict: false,
  },
  originalWhitelistFailure: { ...first.priorFailure.receipt, retainedWithoutOverwrite: true },
  sourceBoundary: { ...first.sourceBoundary, n83Complete: false, fullCardClosureReviewed: false, status: "UNCHANGED_PRIOR_BOUNDARY_REUSED" },
  approvalBoundaries: {
    modernScience: "NOT_REVIEWED_NOT_APPROVED",
    modernFigures: "NOT_REVIEWED_NOT_APPROVED",
    fullCard: "NOT_REVIEWED_NOT_APPROVED",
    n83Complete: false,
    externalColorPlateAcquisition: false,
    canonicalPromotion: false,
    sourceText: "Four original findings resolved; prior untouched text evidence reused, not re-reviewed.",
    RAWAndSourceSVG: "Original first PASS reused only for exact-hash-identical current figure196/197 files.",
  },
  actions: {
    imagesOpened: 0,
    fullReviewRepeated: false,
    nativeCommandsRun: 0,
    vectorizersRun: 0,
    canonicalToolsRun: 0,
    canonicalWrites: false,
    productionMeterTouched: false,
    gitCommandsRun: 0,
    backendCalls: 0,
    databaseCalls: 0,
    paidCalls: 0,
    newAgents: 0,
    newWorktrees: 0,
    newBranches: 0,
    freshnessUpdatesRun: 0,
    otherChatsMessaged: false,
    testSuitesRun: 0,
    candidateFilesModified: false,
    writesOnlyOwnedDirectory: true,
    allExecWorkdirs: repo,
  },
  code: binding(path.join(own, "write-affected-report.mjs")),
};
const output = path.join(own, "affected-report.json");
fs.writeFileSync(output, JSON.stringify(report, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ ...binding(output), status: report.status, resolvedFindingCount: findings.length, figures: figures.map(({ figureId, RAW, SVG }) => ({ figureId, RAW, SVG })), imagesOpened: 0, nativeCommandsRun: 0, firstFAILPreserved: true }, null, 2));
