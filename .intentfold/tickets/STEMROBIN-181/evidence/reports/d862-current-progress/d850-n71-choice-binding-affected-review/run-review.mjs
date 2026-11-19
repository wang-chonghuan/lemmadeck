import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const R = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const T = path.join(R, ".intentfold/tickets/STEMROBIN-181");
const O = path.join(T, "tmp/d850-n71-choice-binding-affected-review");
const D846 = path.join(T, "tmp/d846-n71-native-recovery");
assert.equal(process.cwd(), R);
assert(!fs.existsSync(path.join(O, "report.json")), "Never replay a completed round");
const bindings = new Map();
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
function readBytes(file) {
  const absolute = path.resolve(file);
  assert(fs.realpathSync(absolute).startsWith(`${R}/`), "Read outside sole checkout");
  const bytes = fs.readFileSync(absolute);
  const stamp = { path: absolute, sha256: sha(bytes), bytes: bytes.length };
  const prior = bindings.get(absolute);
  if (prior) assert.equal(stamp.sha256, prior.sha256, `Concurrent change: ${absolute}`);
  bindings.set(absolute, stamp);
  return bytes;
}
const read = (file) => JSON.parse(readBytes(file));
function ordered(value) {
  if (Array.isArray(value)) return value.map(ordered);
  if (value && typeof value === "object")
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, ordered(value[key])]));
  return value;
}
// Match the contract's Python canonical JSON digest for these integer/string artifacts.
const canonical = (value) => sha(Buffer.from(JSON.stringify(ordered(value))
  .replace(/[\u007f-\uffff]/g, (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`)));
function differences(before, after, pointer = "") {
  if (JSON.stringify(ordered(before)) === JSON.stringify(ordered(after))) return [];
  if (before && after && typeof before === "object" && typeof after === "object" &&
      Array.isArray(before) === Array.isArray(after)) {
    return [...new Set([...Object.keys(before), ...Object.keys(after)])].flatMap((key) =>
      differences(before[key], after[key], `${pointer}/${key.replaceAll("~", "~0").replaceAll("/", "~1")}`));
  }
  return [{ pointer, before, after }];
}
function writeNew(name, value) {
  const file = path.join(O, name);
  assert(path.dirname(file) === O, "Output outside ownership");
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
  return { path: file, sha256: sha(fs.readFileSync(file)), bytes: fs.statSync(file).size };
}
const findings = read(path.join(O, "findings.json"));
assert.equal(findings.status, "PASS");
const rebindingPath = path.join(D846, "choice-rebinding/report.json");
const rebinding = read(rebindingPath);
const d838Path = path.join(T, "tmp/d838-n71-source-contract-affected-review/report.json");
const d838 = read(d838Path);
const d842Path = path.join(T, "tmp/d842-n71-seed-byte-recovery/report.json");
const d842 = read(d842Path);
const d846Path = path.join(D846, "report.json");
const d846 = read(d846Path);
const d829Path = path.join(T, "tmp/d829-n71-source-contract-repair/report.json");
read(d829Path);
const inputBindings = read(path.join(T, "tmp/d838-n71-source-contract-affected-review/input-bindings.json"));
const preservedFailures = inputBindings.bindings.filter((entry) =>
  /fail|FAIL|disposition|stderr|stdout/.test(entry.path)).map((entry) => {
    readBytes(entry.path);
    assert.equal(bindings.get(entry.path).sha256, entry.sha256);
    return { ...bindings.get(entry.path), unchangedFromD838: true };
  });
assert.equal(d838.results.SCI, "PASS_AFFECTED_PROSE_ONLY");
assert.equal(d838.results.ZHEN, "PASS_AFFECTED_PROSE_ONLY");
assert.equal(d846.firstD822FailuresUntouched, true);

const rawPath = d838.rawSources.find((entry) => entry.kind === "lesson").path;
const raw = read(rawPath);
assert.equal(bindings.get(rawPath).sha256, d838.rawSources.find((entry) => entry.kind === "lesson").sha256);
const templates = {};
for (const locale of ["zh", "en"]) {
  const record = d838.candidateFiles.find((entry) => entry.locale === locale && entry.kind === "lesson");
  const current = read(record.path);
  const original = read(record.originalApproved.path);
  assert.equal(bindings.get(record.path).sha256, record.sha256);
  assert.equal(bindings.get(record.originalApproved.path).sha256, record.originalApproved.sha256);
  templates[locale] = { current, original };
}
const whitespace = (text) => text.replace(/\s+/g, " ").trim();
const labelObservations = findings.englishProseLabelFindings.map((finding) => {
  const index = Number(finding.pointer.split("/")[2]);
  const source = raw.prose[index];
  const zh = templates.zh.current.prose[index];
  const originalZH = templates.zh.original.prose[index];
  const oldEN = templates.en.original.prose[index];
  const en = templates.en.current.prose[index];
  for (const item of [source, zh, originalZH, oldEN]) {
    assert.equal(item.label, finding.originalChineseAndSource);
    assert.equal(item.kind, finding.kind);
    assert.equal(item.id, finding.figureId);
    assert.deepEqual(item.source_refs, finding.sourceRefs);
    assert.equal(item.printed_page, finding.printedPage);
  }
  assert.equal(en.label, finding.currentEnglishLabel);
  assert.equal(en.kind, finding.kind);
  assert.equal(en.id, finding.figureId);
  assert.deepEqual(en.source_refs, finding.sourceRefs);
  assert.equal(en.printed_page, finding.printedPage);
  return { ...finding, source: { label: source.label, kind: source.kind, id: source.id,
    source_refs: source.source_refs, printed_page: source.printed_page },
    current: { label: en.label, kind: en.kind, id: en.id,
      source_refs: en.source_refs, printed_page: en.printed_page } };
});

const packages = [];
for (const locale of ["zh", "en"]) {
  for (const name of ["q12", "q3"]) {
    const supplied = rebinding.changes.find((entry) => entry.locale === locale && entry.package === name);
    const objects = {};
    const stamps = {};
    for (const version of ["original", "current"]) {
      objects[version] = {};
      stamps[version] = {};
      for (const kind of ["seed", "draft", "review"]) {
        const file = path.join(D846, locale, `${version}-choice-set`, name, `${kind}.json`);
        const value = read(file);
        objects[version][kind] = value;
        stamps[version][kind] = { ...bindings.get(file), canonicalSha256: canonical(value) };
        const recorded = supplied[version].find((entry) => entry.path === file);
        assert(recorded);
        assert.equal(stamps[version][kind].sha256, recorded.sha256);
      }
    }
    const { original, current } = objects;
    const recovered = d842.recoveredSeedBytes.find((entry) => entry.locale === locale && entry.package === name);
    const recoveredBytes = readBytes(recovered.output);
    assert.equal(sha(recoveredBytes), recovered.rawSha256);
    assert.equal(stamps.original.seed.sha256, recovered.rawSha256);
    assert.equal(stamps.original.seed.canonicalSha256, recovered.canonicalSha256);
    for (const version of [original, current]) {
      assert.deepEqual(version.seed.figures, []);
      assert.deepEqual(version.draft.new_figures, []);
      assert.equal(version.draft.seed_sha256, canonical(version.seed));
      assert.equal(version.review.seed_sha256, canonical(version.seed));
      assert.equal(version.review.draft_sha256, canonical(version.draft));
      assert.equal(version.review.outcome, "pass");
    }
    assert.deepEqual(original.seed.exercises, current.seed.exercises);
    assert.deepEqual(original.seed.source, current.seed.source);
    assert.deepEqual(original.draft.questions, current.draft.questions);
    assert.deepEqual(original.draft.coverage, current.draft.coverage);
    const draftDiff = differences(original.draft, current.draft);
    const reviewDiff = differences(original.review, current.review);
    assert.deepEqual(draftDiff.map((entry) => entry.pointer), ["/seed_sha256"]);
    assert.deepEqual(reviewDiff.map((entry) => entry.pointer).sort(), ["/draft_sha256", "/seed_sha256"]);
    const seedDiff = differences(original.seed, current.seed);
    const conceptDiffs = [];
    if (name === "q12") {
      assert.deepEqual(original.seed.concepts, []);
      assert.deepEqual(current.seed.concepts, []);
      assert(seedDiff.every((entry) => /^\/trace\/\d\/sha256$/.test(entry.pointer)));
    } else {
      assert.deepEqual(current.seed.concepts.map((entry) => entry.block), [6, 9, 10, 11, 12]);
      assert(seedDiff.every((entry) => /^\/trace\/\d\/sha256$/.test(entry.pointer) ||
        /^\/concepts\/\d\/text$/.test(entry.pointer)));
      for (const concept of current.seed.concepts) {
        const old = original.seed.concepts.find((entry) => entry.block === concept.block);
        assert.equal(whitespace(concept.text), whitespace(templates[locale].current.prose[concept.block].text));
        if ([9, 10, 11].includes(concept.block)) assert.equal(whitespace(old.text), whitespace(concept.text));
        if (old.text !== concept.text) conceptDiffs.push({ block: concept.block, before: old.text,
          after: concept.text, classification: whitespace(old.text) === whitespace(concept.text)
            ? "NATIVE_WHITESPACE_ONLY_INHERITED" : "APPROVED_D829_SUBSTANTIVE_BINDING_AFFECTED_REVIEW" });
      }
      assert.deepEqual(conceptDiffs.filter((entry) => entry.classification !== "NATIVE_WHITESPACE_ONLY_INHERITED")
        .map((entry) => entry.block), [6, 12]);
    }
    const currentSource = path.join(D846, locale, "current-choice-source");
    const sourceBindings = current.seed.trace.map((entry) => {
      const file = path.join(currentSource, entry.path);
      readBytes(file);
      assert.equal(bindings.get(file).sha256, entry.sha256);
      return { ...bindings.get(file), seedTracePath: entry.path };
    });
    const lessonTrace = current.seed.trace.find((entry) => entry.path.endsWith("/lesson.json"));
    const currentLesson = read(path.join(currentSource, lessonTrace.path));
    if (name === "q3") for (const concept of current.seed.concepts)
      assert.equal(currentLesson.prose[concept.block].text, concept.text);
    const receiptPath = path.join(D846, "choice-rebinding", `${locale}-${name}-historical-exact-FIRST.receipt.json`);
    const receipt = read(receiptPath);
    assert.equal(receipt.exit, 0);
    assert.match(receipt.stdout, /mechanical checks passed; declared semantic review: pass/);
    assert.equal(bindings.get(receiptPath).sha256,
      rebinding.receipts.find((entry) => entry.path === receiptPath).sha256);
    assert(receipt.args.includes(stamps.original.seed.path));
    assert(receipt.args.includes(stamps.original.draft.path));
    assert(receipt.args.includes(stamps.original.review.path));
    packages.push({ locale, package: name, sourceRepo: currentSource, original: stamps.original,
      current: stamps.current, differences: { seed: seedDiff, draft: draftDiff, review: reviewDiff },
      conceptChanges: conceptDiffs, sourceBindings, historicalFIRST: { ...bindings.get(receiptPath),
        exit: receipt.exit, stdout: receipt.stdout, stderr: receipt.stderr },
      questionsOptionsKeysRationalesAndVerdictsUnchanged: true,
      approval: name === "q12" ? "INHERITED_EXACT_PROJECTION_TRACE_ONLY" :
        "INHERITED_UNCHANGED_APPROVALS_PLUS_NEW_D850_AFFECTED_SCI_ZHEN_PASS",
      oldWholeReviewIsCurrentFullReview: false });
  }
}
function checkUnchanged() {
  for (const stamp of bindings.values()) assert.equal(sha(fs.readFileSync(stamp.path)), stamp.sha256,
    `Input changed during bounded review: ${stamp.path}`);
}
checkUnchanged();
const substantive = writeNew("substantive-PASS-before-checker.json", {
  status: "PASS", findings: bindings.get(path.join(O, "findings.json")),
  packages, englishProseLabels: labelObservations, preservedFailures,
  qualification: "Affected substantive approval precedes the checker; inherited whole reviews remain inherited.",
  inputBindings: [...bindings.values()]
});
console.log("Substantive affected SCI/ZHEN and four EN label review: PASS; provenance checks passed.");

const executable = path.join(R, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const receipts = [];
for (const item of packages) {
  const name = `${item.locale}-${item.package}-current-FIRST.receipt.json`;
  assert(!fs.existsSync(path.join(O, name)), "No checker replay");
  const args = ["-B", ".agents/skills/ld-s10y-choice/scripts/validate.py",
    "--repo", item.sourceRepo, "--seed", item.current.seed.path,
    "--draft", item.current.draft.path, "--review", item.current.review.path];
  const startedAt = new Date().toISOString();
  const result = spawnSync(executable, args, {
    cwd: R, encoding: "utf8", env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
    timeout: 120000, maxBuffer: 1024 * 1024
  });
  const receipt = { id: name.replace(".receipt.json", ""), cwd: R, command: executable,
    args, startedAt, endedAt: new Date().toISOString(), exit: result.status,
    signal: result.signal, error: result.error?.message ?? null,
    stdout: result.stdout ?? "", stderr: result.stderr ?? "",
    substantivePASSBeforeChecker: substantive,
    semanticQualification: "Mechanical structure/freshness/binding check only; supplied whole review is inherited, not a newly executed current full semantic review.",
    independentOfHistoricalFIRSTFailureOrPass: true, retryCount: 0 };
  const stamp = writeNew(name, receipt);
  receipts.push({ ...stamp, locale: item.locale, package: item.package, exit: receipt.exit,
    stdout: receipt.stdout, stderr: receipt.stderr, args, error: receipt.error });
  console.log(`${item.locale}/${item.package}: exit ${receipt.exit}; ${receipt.stdout.trim()}`);
  if (receipt.exit !== 0 || receipt.error) break;
}
let integrity = "PASS";
let integrityError = null;
try { checkUnchanged(); } catch (error) { integrity = "HOLD"; integrityError = error.message; }
const mechanicalPASS = receipts.length === 4 && receipts.every((entry) => entry.exit === 0 && !entry.error);
const report = {
  schema: "d850-n71-current-choice-binding-affected-review@1",
  date: "2026-11-19", ticket: "STEMROBIN-181", successor: "181-3", card: "phy10-c2-s2-n71",
  status: integrity === "PASS" && mechanicalPASS ? "PASS" : "HOLD",
  root: R, writeRoot: O, scope: findings.scope, reviewer: findings.reviewer,
  decision: findings.decision, affectedFindings: findings,
  packages, englishProseLabelObservations: labelObservations,
  scopedInheritedApprovals: {
    d842: { ...bindings.get(d842Path), qualification: "Exact recovered old seed bytes and digests only." },
    d838: { ...bindings.get(d838Path), SCI: "PASS_AFFECTED_PROSE_ONLY",
      ZHEN: "PASS_AFFECTED_PROSE_ONLY",
      usedForThisReview: "Approved source repair of q3 concepts 6/12 and retained source/original text provenance. Concepts 1/4 and top-level metadata are not re-reviewed.",
      fourPreviouslyExcludedProseLabels: "Newly reviewed only by d850, not retroactively attributed to d838." },
    d846: { ...bindings.get(d846Path),
      nativeFullLessonPASS: "Supplied PASS retained; no lesson-native stage rerun.",
      choiceRebinding: bindings.get(rebindingPath), completeCard: false },
    oldQ12AndQ3: "Original exact packages retain original historical review claims. Current review JSONs change only seed/draft binding hashes, not verdicts, evidence or reviewer identities. They are not stand-alone evidence of a newly performed whole current review; use the scoped d850 findings with the inherited original approvals."
  },
  substantivePASSBeforeChecker: substantive,
  currentChoiceChecker: { status: mechanicalPASS ? "PASS" : "HOLD", calls: receipts.length,
    oncePerCurrentPackage: true, retries: 0, receipts,
    qualification: "Separate mechanical receipt layer, not scientific or bilingual proof and not deletion or replacement of a FIRST failure." },
  preservedFIRSTFailures: preservedFailures,
  sourceAndPackageIntegrity: { status: integrity, error: integrityError,
    verifiedInputCount: bindings.size, inputBindings: [...bindings.values()],
    allBoundInputsUnchanged: integrity === "PASS", noInputWrites: true },
  accounting: {
    newAffectedBilingualReviewRounds: 1, wholeReviewRounds: 0,
    q3QuestionLanguageInstancesAffected: 4, newEnglishProseLabelApprovals: 4,
    nativeChoiceCheckerCalls: receipts.length, nativeChoiceCheckerRetries: 0,
    historicalCheckerCallsReplayed: 0, nativeFullLessonCalls: 0,
    imageLoads: 0, imageCaptures: 0, imageGenerationCalls: 0, paidGenerationCalls: 0,
    externalModelCalls: 0, sourceEdits: 0, candidateEdits: 0, choiceEdits: 0,
    coreEdits: 0, validatorEdits: 0, answerArtifactReads: 0,
    sharedMeterContentReads: 0, sharedIndexContentReads: 0,
    sharedMeterWrites: 0, sharedIndexWrites: 0, canonicalWrites: 0,
    databaseOperations: 0, publisherCalls: 0, deploys: 0, gitOperations: 0,
    chatOperations: 0, fullTests: 0, builds: 0,
    shellCommandCallsBeforeThisRunner: 30, runnerInvocations: 1,
    inventoryQualification: "An initial overly broad rg --files inventory returned path names only, including shared/prohibited filenames. No shared meter/index, answer, canonical or generation content was opened from that inventory; subsequent reads were targeted. Global IntentFold skill routing was read once before bounded review; no capability or live ticket/chat operation was invoked.",
    hostTokens: null, hostCostUsd: null,
    unknownUsageExplicit: "Host inference token/cost telemetry is not exposed. Unknown is not zero; no external paid generation or model service was called."
  },
  stop: "Affected review complete. No whole review replay, full lesson-native rerun, candidate/core/validator change or downstream work.",
  completeCard: false
};
const reportStamp = writeNew("report.json", report);
console.log(JSON.stringify({ report: reportStamp, status: report.status,
  checkerCalls: receipts.length, boundInputs: bindings.size }, null, 2));
