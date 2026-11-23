import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const tmp = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp");
const owned = path.join(tmp, "source163164-first-and161-affected-review-12");
assert.equal(process.cwd(), repo);
const bound = new Map();
const json = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");

function bind(ref, purpose) {
  assert.equal(path.isAbsolute(ref.path), true);
  assert.equal(ref.path.startsWith(`${tmp}/`), true);
  assert.equal(/source6g167168-author-first-12|\/016[256]\//.test(ref.path), false);
  const bytes = fs.readFileSync(ref.path);
  const actual = hash(bytes);
  if (ref.sha256) assert.equal(actual, ref.sha256, ref.path);
  const item = bound.get(ref.path) ?? {
    path: ref.path,
    sha256: actual,
    bytes: bytes.length,
    mode: `0${(fs.statSync(ref.path).mode & 0o777).toString(8)}`,
    purposes: [],
    use: ref.path.startsWith(`${owned}/`) ? "new-review-evidence" : "reused-input",
  };
  assert.equal(item.sha256, actual);
  if (!item.purposes.includes(purpose)) item.purposes.push(purpose);
  bound.set(ref.path, item);
  return bytes;
}

function input(relative, sha256, purpose) {
  const ref = { path: path.join(tmp, relative), sha256 };
  return JSON.parse(bind(ref, purpose).toString("utf8"));
}

const sourceOnly = input(
  "source163164-independent-inputs-11/source-only.json",
  "28607e4741b47157a442914f92be4cd076da7f16d5c5e042903c28c388ff7ae4",
  "A source-only authorization",
);
const post = input(
  "source163164-independent-inputs-11/post-FIRST.json",
  "96b8c11ca3805bc5dbb47e4034494af95bc95cda27467d3e28d026ac73bd12fb",
  "A post-lock comparison inputs",
);
const affected = input(
  "source161-affected-inputs-12/inputs.json",
  "5764dd2a9800326c3b9c022341dd99f88a904e3858beb591e9f861297e501635",
  "B zero-image affected-only authorization",
);
const freeze = json(path.join(owned, "first-freeze-receipt.json"));
for (const ref of freeze.lockedFiles) {
  bind(ref, "A immutable independent FIRST");
  assert.equal(fs.statSync(ref.path).mode & 0o777, 0o444);
}
assert.deepEqual(freeze.completedSequence.map((x) => x.command), ["chmod", "stat", "shasum"]);
assert.equal(freeze.completedSequence.every((x) => x.exitCode === 0), true);
assert.equal(freeze.postFirstOpened, false);
for (const ref of sourceOnly.originalImages) bind(ref, "A original page hash only in verifier");
for (const ref of [post.authorManifest, post.authorReport, post.receiverRecord]) bind(ref, "A completed handoff reference");
for (const ref of post.sourceCrops) bind(ref, "A actually viewed native source crop");

function receipt(ref, expectedPage, expectedExit) {
  const r = JSON.parse(bind(ref, `retained native ${expectedPage} execution`).toString("utf8"));
  assert.equal(r.cwd, repo);
  assert.equal(r.exitCode, expectedExit);
  assert.equal(r.argv[r.argv.indexOf("--book") + 1], "6-8g");
  assert.equal(r.argv[r.argv.indexOf("--page") + 1], `${expectedPage}`);
  assert.equal(r.argv.includes("finalize"), true);
  assert.equal(Boolean(r.startedAt ?? r.started_at), true);
  assert.equal(Boolean(r.finishedAt ?? r.ended_at), true);
  const stdout = bind(r.streams.stdout, `retained native ${expectedPage} stdout`).toString("utf8");
  const stderr = bind(r.streams.stderr, `retained native ${expectedPage} stderr`).toString("utf8");
  assert.equal(stderr, "");
  return { path: ref.path, sha256: ref.sha256, cwd: r.cwd, argv: r.argv, exitCode: r.exitCode, startedAt: r.startedAt ?? r.started_at, finishedAt: r.finishedAt ?? r.ended_at, streams: r.streams, stdout, stderr };
}

const a = [];
for (const c of post.candidates) {
  for (const ref of c.files) bind(ref, `A candidate${c.physical} comparison`);
  const page = json(c.files.find((x) => x.path.endsWith("/page.json")).path);
  const audit = json(c.files.find((x) => x.path.endsWith("/audit.json")).path);
  const r = receipt(c.nativeReceipt, c.physical, 0);
  const expectedRows = c.physical === 163 ? 21 : 25;
  assert.equal(audit.lines_printed, expectedRows);
  assert.equal(audit.lines_md, expectedRows);
  assert.deepEqual(audit.errors, []);
  assert.deepEqual(audit.count_exclusions ?? [], []);
  assert.equal(page.meta.render.sha256, sourceOnly.originalImages[c.physical - 163].sha256);
  a.push({
    page: c.physical,
    nativeReceipt: r,
    rows: [audit.lines_printed, audit.lines_md],
    nativeErrors: audit.errors,
    bodyUnknownLocations: page.blocks.flatMap((b, bi) =>
      b.lines.flatMap((line, li) => line.includes("UNKNOWN") ? [{ pointer: `/blocks/${bi}/lines/${li}`, line }] : [])),
    structures: page.blocks.map((b, index) => ({ index, kind: b.kind, label: b.label, owner_exercise: b.owner_exercise, open: b.open, cont: b.cont, samerow: b.samerow, rows: b.lines.length, box: b.box })),
  });
}

for (const key of ["originalIndependentReport", "originalIndependentFIRST", "repairRecord", "repairStaging", "before", "execution"]) {
  bind(affected[key], `B ${key} reused`);
}
for (const ref of affected.after) bind(ref, "B changed affected candidate evidence");
const previousReport = json(affected.originalIndependentReport.path);
const previousFirst = fs.readFileSync(affected.originalIndependentFIRST.path, "utf8");
assert.equal(previousFirst.includes("14 你们在五年级已经学过“方向”的概念。但是它没有定义。"), true);
assert.equal(previousFirst.includes("y1788..1794; no prose on it."), true);
assert.equal(fs.statSync(affected.originalIndependentFIRST.path).mode & 0o777, 0o444);
const previous161 = previousReport.source_verdicts.find((x) => x.physical_page === 161);
assert.deepEqual(previous161.row_discrepancy.source_region_xywh, [191, 1788, 420, 6]);
const staging = json(affected.repairStaging.path);
const before = json(affected.before.path);
const after = json(affected.after.find((x) => x.path.endsWith("/page.json")).path);
const afterAudit = json(affected.after.find((x) => x.path.endsWith("/audit.json")).path);

function diff(beforeValue, afterValue, pointer = "") {
  if (JSON.stringify(beforeValue) === JSON.stringify(afterValue)) return [];
  if (beforeValue === undefined || afterValue === undefined ||
      beforeValue === null || afterValue === null ||
      typeof beforeValue !== "object" || typeof afterValue !== "object") {
    return [{ pointer, before: beforeValue, after: afterValue }];
  }
  const keys = new Set([...Object.keys(beforeValue), ...Object.keys(afterValue)]);
  return [...keys].flatMap((key) => diff(beforeValue[key], afterValue[key], `${pointer}/${key}`));
}

const changes = diff(before, after);
assert.deepEqual(changes.map((x) => x.pointer).sort(),
  ["/blocks/7/lines/0", "/meta/count_exclusions", "/meta/notes/2"].sort());
assert.equal(before.blocks[7].lines[0], "你们在五年级已经学过“方向”的概念，但是它没有定义。");
assert.equal(after.blocks[7].lines[0], "你们在五年级已经学过“方向”的概念。但是它没有定义。");
assert.equal(after.meta.notes[2], staging.newNote);
assert.deepEqual(after.meta.count_exclusions, [staging.exclusion]);
assert.deepEqual(staging.exclusion.box, [191, 1788, 420, 6]);
assert.equal(staging.exclusion.kind, "separator-rule");
const unchangedWork = [];
let originalAudit;
for (const mapping of staging.mappings) {
  bind(mapping.source, "B original161 before repair binding");
  if (mapping.source.path.endsWith("/audit.json")) originalAudit = json(mapping.source.path);
  if (/\/work\/.*\/(?:page\.png|layout\.json)$/.test(mapping.source.path)) {
    bind(mapping.output, "B unchanged source pixels or layout; no image opened");
    assert.equal(fs.readFileSync(mapping.source.path).equals(fs.readFileSync(mapping.output.path)), true);
    unchangedWork.push({ source: mapping.source, after: mapping.output, byteIdentical: true, imageOpened: false });
  }
}
assert.equal(unchangedWork.length, 2);
assert.equal(originalAudit.lines_printed, 25);
assert.equal(originalAudit.lines_md, 24);
assert.equal(afterAudit.lines_printed, 24);
assert.equal(afterAudit.lines_md, 24);
assert.deepEqual(afterAudit.count_exclusions, [staging.exclusion]);
assert.deepEqual(afterAudit.unknown_chars, originalAudit.unknown_chars);
const expectedErrors = ["白名单外字符 2 处: ▼(U+25BC), ▸(U+25B8)", "p#9: 小问标号 'a' 不是西里尔"];
assert.deepEqual(afterAudit.errors, expectedErrors);
assert.equal(expectedErrors.every((e) => originalAudit.errors.includes(e)), true);
const bReceipt = receipt(affected.execution, 161, 1);
assert.equal(bReceipt.stdout.includes("24 行（印刷 24）"), true);
assert.equal(expectedErrors.every((e) => bReceipt.stdout.includes(e)), true);
assert.equal(affected.page161RevisionUsed, 1);
const images = json(path.join(owned, "image-attempts.json"));
assert.equal(images.chargedAttemptsTotal, 4);
assert.equal(images.scopeBNewImageAttempts, 0);
assert.equal(images.attempts.every((x) => x.status === "opened-successfully"), true);
const authorLedger = json(post.authorManifest.path).ledger;
const evidence = {
  status: "SCOPED_HASH_RECEIPT_AND_AFFECTED_DIFF_VERIFICATION_PASS_NOT_SOURCE_APPROVAL",
  cwd: repo,
  command: "node",
  argv: [path.join(owned, "verify.mjs")],
  producerReplays: 0,
  scopeA: a,
  scopeB: {
    status: "TWO_AFFECTED_REPAIRS_PASS_RETAINED_NATIVE_FAILURE",
    previousFIRST: affected.originalIndependentFIRST,
    previousReport: affected.originalIndependentReport,
    prior161Rows: [previous161.native_printed_rows, previous161.candidate_text_rows],
    structuredDifferences: changes,
    allOtherStructuredLeavesUnchanged: true,
    unchangedWork,
    sourcePixelsByteIdentical: true,
    layoutByteIdentical: true,
    rows: [24, 24],
    nativeReceipt: bReceipt,
    nativeErrors: afterAudit.errors,
    glyphRecordsUnchanged: true,
    metadataNoteMatches: true,
    page161RevisionUsed: 1,
    source162ReviewReplayed: false,
    source162PASSReusedByReferenceOnly: affected.unchangedPage162PASSReused,
    noNewFIRSTOrImageOpen: true,
    stagingHashesMeaning: "MD/JSON/audit output hashes in staging describe pre-repair copies; current outputs bind to affected-inputs after hashes. Unchanged PNG/layout staging bindings still match.",
  },
  counters: {
    currentReviewer: { chargedImages: 4, imageLimit: 8, contextImages: 4, contextLimit: 24, imageFailures: 0, originalReopens: 0, scopeBImages: 0, sourceCandidateRevisions: 0, annotationSupplements: 1, nativeProducerCalls: 0, localExecFailures: 1, localExecFailure: "Initial ls of absent fresh owned root exited 1; no image or scientific failure.", activeExecSessions: [] },
    parentPermanentImages: "24/24",
    inherited163164Author: { chargedImages: authorLedger.charged_images, imageRequests: authorLedger.image_requests, prepareRangeInvocations: authorLedger.prepare_range_invocations, finalizeInvocations: authorLedger.native_finalize_invocations, revisions: authorLedger.content_revisions, failures: authorLedger.content_or_native_failures, transportFailures: authorLedger.transport_proxy_failures, execNotes: authorLedger.execution_notes },
    inherited161162Review: previousReport.reviewer_counters,
    inherited161162Author: previousReport.preserved_author_counters,
    inherited161Repair: { revisions: 1, finalizeExit: 1, glyphAlphabetFailures: expectedErrors },
    inheritedAffectedInputPreparationFailure: affected.preparationTechnicalFailure,
  },
  activeExecSessions: [],
};
fs.writeFileSync(path.join(owned, "verification.json"), `${JSON.stringify(evidence, null, 2)}\n`);
for (const name of ["FIRST.md", "inventory.json", "first-freeze-receipt.json", "FIRST-annotations.md", "image-attempts.json", "verify.mjs", "verification.json"]) {
  bind({ path: path.join(owned, name) }, "new scoped reviewer evidence");
}
const manifest = {
  scope: "A first163164 / B affected161 only",
  inputFiles: [...bound.values()].filter((x) => x.use === "reused-input"),
  newEvidence: [...bound.values()].filter((x) => x.use === "new-review-evidence"),
  noPackageCopies: true,
  noImagesReturned: true,
  activeExecSessions: [],
};
fs.writeFileSync(path.join(owned, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({
  status: evidence.status,
  verifiedFiles: bound.size,
  scopeA: a.map((x) => ({ page: x.page, rows: x.rows, nativeExit: x.nativeReceipt.exitCode, unknownBodyLines: x.bodyUnknownLocations.length })),
  scopeB: { differences: changes.map((x) => x.pointer), rows: [24, 24], nativeExit: 1, sourcePixelsByteIdentical: true, nativeErrors: expectedErrors },
  outputs: ["verification.json", "manifest.json"].map((name) => ({ path: path.join(owned, name), sha256: hash(fs.readFileSync(path.join(owned, name))) })),
  activeExecSessions: [],
}, null, 2));
