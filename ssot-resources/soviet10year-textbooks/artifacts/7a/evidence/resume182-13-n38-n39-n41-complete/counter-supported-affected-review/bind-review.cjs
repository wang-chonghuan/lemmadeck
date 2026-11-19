const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const cp = require("node:child_process");
const assert = require("node:assert/strict");

const root = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const output = `${base}/counter-supported-affected-review`;
const owned = `${base}/counter-supported-owned-RECOVERY2`;
const tool = ".claude/skills/ld-s10y-lesson/tools/layout.py";
const expectedHead = "bf7d8a1cc29d492b89cce112e090d0f21d265083";
assert.equal(process.cwd(), root);
assert.equal(__dirname, path.join(root, output));
const hashes = {};
const digest = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const read = relative => {
  assert(!/\.(png|jpg|jpeg|webp|pdf|pyc)$/i.test(relative));
  const absolute = path.resolve(root, relative);
  assert(absolute.startsWith(`${root}/`));
  const bytes = fs.readFileSync(absolute);
  hashes[path.relative(root, absolute)] = digest(bytes);
  return bytes.toString("utf8");
};
const json = relative => JSON.parse(read(relative));
const git = args => cp.execFileSync("git", args, { cwd: root });
const head = git(["rev-parse", "HEAD"]).toString().trim();
const branch = git(["branch", "--show-current"]).toString().trim();
assert.equal(head, expectedHead);
assert.equal(branch, "codex/STEMROBIN-182-textbooks");

const current = read(tool);
const candidate = read(`${owned}/layout.py`);
const savedHead = read(`${owned}/head-layout.py`);
assert.equal(savedHead, git(["show", `HEAD:${tool}`]).toString());
const helper = text => {
  const start = text.indexOf("def _fraction_baselines(");
  const end = text.indexOf("def _single_fraction_row(");
  assert(start >= 0 && end > start);
  return text.slice(start, end);
};
const guard = "    if len(_fraction_baselines(ink, a, b, line_h)) > 1:\n        return False\n";
const snapshots = [
  `${base}/counter-affected/.claude__skills__ld-s10y-lesson__tools__layout.py`,
  `${base}/counter-affected/layout-first-candidate.py`,
];
const excluded = snapshots.map(file => {
  const text = read(file);
  assert.equal(helper(text), helper(current));
  assert.equal(text.split(guard).length, 2);
  return { path: file, helperByteUnchanged: true, guardByteUnchanged: true };
});
assert.equal(current.split(guard).length, 2);
assert.equal(candidate, current.replace(helper(current), "").replace(guard, ""));
assert(!candidate.includes("_fraction_baselines"));
const ownPatch = read(`${owned}/own.patch`);
const diff = cp.spawnSync("git", [
  "diff", "--no-index", "--", `${owned}/head-layout.py`, `${owned}/layout.py`,
], { cwd: root, encoding: "utf8" });
assert.equal(diff.status, 1);
const regenerated = diff.stdout
  .replace(/^diff --git .+$/m, `diff --git a/${tool} b/${tool}`)
  .replace(/^--- .+$/m, `--- a/${tool}`)
  .replace(/^\+\+\+ .+$/m, `+++ b/${tool}`);
assert.equal(ownPatch, regenerated);
const producerBinding = json(`${owned}/binding.json`);
assert.equal(producerBinding.head, head);
assert.equal(producerBinding.candidateSha256, digest(candidate));
assert.equal(producerBinding.workingFileSha256, digest(current));
assert.equal(producerBinding.ownPatchSha256, digest(ownPatch));
assert.equal(producerBinding.excludedHelperSha256, digest(helper(current)));

const receipt = name => {
  const file = `${base}/stages/${name}.receipt.json`;
  const data = json(file);
  assert.equal(data.cwd, root);
  for (const stream of data.streams) {
    assert.equal(digest(read(stream.path)), stream.sha256);
  }
  return { path: file, exit: data.exit, command: data.command,
    streamsHashVerified: true };
};
const testReceipt = receipt("verify-supported-counter-owned-RECOVERY2");
assert.equal(testReceipt.exit, 0);
assert.equal(testReceipt.command.at(-1), `${owned}/layout.py`);
read(`${base}/verify-counter-owned.py`);
read(`${base}/prepare-counter-owned.cjs`);
const tests = json(`${owned}/test-result-FIRST.json`);
assert.deepEqual(tests, json(`${base}/stages/verify-supported-counter-owned-RECOVERY2.stdout`));
assert.equal(tests.status, "pass");
assert.equal(tests.testsRun, 71);
assert.equal(tests.skipped, 4);
assert.equal(tests.failures, 0);
assert.equal(tests.errors, 0);
assert(tests.userHelperTestsExcluded);
assert(!tests.patterns.includes("test_wrapped_fraction_baselines.py"));
const testModuleBinding = tests.patterns.map(name => {
  const file = `.claude/skills/ld-s10y-lesson/tests/${name}`;
  read(file);
  return { path: file, sha256: hashes[file] };
});

const diagnosisNames = [
  "next-fraction-gap-diagnostic-FIRST",
  "next-fraction-gap-diagnostic-RECOVERY1",
  "next-fraction-gap-diagnostic-mask-delta-FIRST",
  "next-fraction-gap-patch-FIRST",
];
read(`${base}/diagnose-next-fraction-gaps.py`);
const diagnoses = diagnosisNames.map(name => ({
  ...receipt(name),
  output: json(`${base}/stages/${name}.stdout`),
}));
const firstFailures = ["FIRST", "RECOVERY1"].map(label => {
  const execution = receipt(`verify-supported-counter-owned-${label}`);
  const result = json(`${base}/counter-supported-owned-${label}/test-result-FIRST.json`);
  assert.equal(execution.exit, 1);
  assert.equal(result.status, "fail");
  return { ...execution, testsRun: result.testsRun, failures: result.failures,
    errors: result.errors, historicalOnly: true };
});
const focusedFirst = receipt("supported-fraction-tests-FIRST");
assert.equal(focusedFirst.exit, 1);

const reviewPath = `${base}/source259-266-review/report.md`;
read(reviewPath);
const sourceManifestPath = `${base}/source259-266-review/input-hashes.sha256`;
const sourceManifest = new Map(read(sourceManifestPath).trim().split("\n").map(line => {
  const match = /^([a-f0-9]{64})  (.+)$/.exec(line);
  assert(match);
  return [match[2], match[1]];
}));
const freezePath = `${base}/source259-266-review/freeze.sha256`;
for (const line of read(freezePath).trim().split("\n")) {
  const match = /^([a-f0-9]{64})  (.+)$/.exec(line);
  assert(match);
  assert.equal(digest(read(`${base}/source259-266-review/${match[2]}`)), match[1]);
}
read(`${base}/source259-266-author/freeze.json`);
read(`${base}/source259-266-author/count-diagnostic.stdout.json`);
const historical = file => {
  const text = read(file);
  assert.equal(digest(text), sourceManifest.get(file));
  return text;
};
const body = text => {
  const delimiter = "\n---\n";
  const start = text.indexOf(delimiter, 4);
  assert(text.startsWith("---\n") && start >= 0);
  JSON.parse(text.slice(4, start));
  return text.slice(start + delimiter.length);
};
const fraction = "$x=\\frac{7\\pm\\sqrt{4}}{9}$";
const repairedMd = text => {
  const needle = `${fraction}\uFF0C`;
  assert.equal(text.split(needle).length, 2);
  return text.replace(needle, fraction);
};
const affectedPages = [261, 264].map(page => {
  const number = String(page).padStart(4, "0");
  const original = `${base}/source259-266-author/original-authored/${number}.page.md`;
  const before = `${base}/source259-266-author/first-finalize/${number}`;
  const durable = `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/${number}`;
  const originalMd = historical(original);
  const oldReceipt = JSON.parse(historical(`${before}/receipt.json`));
  assert.equal(oldReceipt.exit_code, 1);
  for (const name of ["page.md", "page.json", "audit.json"]) {
    assert.equal(digest(read(`${before}/${name}`)), oldReceipt.outputs[name].sha256);
  }
  for (const stream of ["stdout", "stderr"]) {
    assert.equal(digest(read(oldReceipt[stream].path)), oldReceipt[stream].sha256);
  }
  const beforeMd = read(`${before}/page.md`);
  const currentMd = read(`${durable}/page.md`);
  assert.equal(body(originalMd), body(beforeMd));
  assert.equal(page === 264 ? repairedMd(beforeMd) : beforeMd, currentMd);
  const beforeJsonText = read(`${before}/page.json`);
  const currentJsonText = read(`${durable}/page.json`);
  const oldLine = JSON.stringify(`${fraction}\uFF0C`);
  if (page === 264) assert.equal(beforeJsonText.split(oldLine).length, 2);
  assert.equal(page === 264
    ? beforeJsonText.replace(oldLine, JSON.stringify(fraction))
    : beforeJsonText, currentJsonText);
  const oldJson = json(`${before}/page.json`);
  const currentJson = json(`${durable}/page.json`);
  if (page === 264) {
    assert.equal(oldJson.blocks[0].lines[0], `${fraction}\uFF0C`);
    oldJson.blocks[0].lines[0] = fraction;
  }
  assert.deepEqual(oldJson, currentJson);
  const oldAudit = json(`${before}/audit.json`);
  const currentAudit = json(`${durable}/audit.json`);
  const changedKeys = Object.keys(oldAudit).filter(key =>
    JSON.stringify(oldAudit[key]) !== JSON.stringify(currentAudit[key]));
  assert.deepEqual(changedKeys, ["lines_printed", "errors"]);
  const count = page === 261 ? 20 : 25;
  assert.equal(currentAudit.lines_printed, count);
  assert.equal(currentAudit.lines_md, count);
  for (const key of ["errors", "normalizations", "unknown_chars", "katex_warnings"]) {
    assert.deepEqual(currentAudit[key], []);
  }
  const finalization = receipt(`source${page}-supported-counter-RECOVERY2`);
  assert.equal(finalization.exit, 0);
  const stdout = read(`${base}/stages/source${page}-supported-counter-RECOVERY2.stdout`);
  assert(stdout.includes(`p${number}:`) && stdout.includes(String(count)));
  return { page, currentDirectory: durable, originalAuthored: original,
    firstSnapshotDirectory: before, contentComparison: page === 261
      ? "MD and JSON byte unchanged"
      : "Only U+FF0C removed at MD line 38 and /blocks/0/lines/0; all other bytes unchanged",
    originalAuthoredBodyEqualsFirstSnapshot: true,
    auditChangedKeysOnly: changedKeys, beforeDetectedRows: oldAudit.lines_printed,
    currentDetectedAndMdRows: count, firstFailureExit: oldReceipt.exit_code,
    firstFailureReceiptSha256: hashes[`${before}/receipt.json`],
    finalization, currentErrors: [], noOtherTextFormulaOrMetadataChange: true };
});

for (const file of ["AGENTS.md", ".intentfold/readme.md", ".intentfold/project.json",
  ".intentfold/charter/product.md", ".intentfold/charter/engineering.md",
  ".intentfold/charter/operations.md", ".claude/skills/ld-s10y-lesson/references/production-resume.md",
  ".claude/skills/ld-s10y-lesson/tools/p2c.py"]) read(file);
read(`${output}/review.md`);
read(`${output}/bind-review.cjs`);
const binding = {
  schema: "STEMROBIN-182/counter-supported-affected-review@1",
  verdict: "PASS", date: "2026-11-19", workspace: root, branch, head,
  pathResolution: "All file paths are relative to workspace unless absolute.",
  scope: "Independent affected-only counter delta and source 261/264 binding",
  ownership: {
    savedHeadByteEqualsGitBlob: true, gitHeadBlobSha256: digest(savedHead),
    candidateEqualsWorkingMinusExcludedHelperAndGuard: true,
    candidateWithoutUserHelper: true, ownPatchByteEqualsHEADToCandidateDiff: true,
    producerBindingHashesMatch: true,
    excludedHelperSha256: digest(helper(current)), excludedGuardSha256: digest(guard),
    originalSnapshots: excluded, excludedRegionsCorrectnessNotReviewed: true,
  },
  reusedCandidateExecution: { receipt: testReceipt, result: tests, testModuleBinding },
  numericalDiagnosis: diagnoses,
  reusedSourceReview: { path: reviewPath, sha256: hashes[reviewPath],
    freezeManifestHashVerified: true, imagesOpenedDecodedOrHashedDuringThisReview: 0,
    pixelObservationsReusedNotRepeated: true },
  affectedPages,
  preservedFailures: { firstCandidateFailures: firstFailures, focusedFirst,
    sourceFirstFailuresRemainExitOne: true, noHistoricalOutputsRewritten: true },
  activity: { behavioralTestsRun: 0, finalizationsRun: 0, imagesRead: 0,
    networkCalls: 0, databaseAccess: 0, environmentAccess: 0,
    productionOrDependencyOrToolEdits: 0, writesOnly: output,
    noNewRetryCountGate: true, noWholeSourceLessonOrPublicationApproval: true },
  fileHashes: Object.fromEntries(Object.entries(hashes).sort(([a], [b]) => a.localeCompare(b))),
};
fs.writeFileSync(path.join(root, output, "binding.json"),
  `${JSON.stringify(binding, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({
  verdict: binding.verdict, candidateSha256: digest(candidate),
  sourcePages: affectedPages.map(p => ({ page: p.page, rows: p.currentDetectedAndMdRows,
    exit: p.finalization.exit })), boundTextFiles: Object.keys(hashes).length,
  bindingSha256: digest(fs.readFileSync(path.join(root, output, "binding.json"))),
}, null, 2));
