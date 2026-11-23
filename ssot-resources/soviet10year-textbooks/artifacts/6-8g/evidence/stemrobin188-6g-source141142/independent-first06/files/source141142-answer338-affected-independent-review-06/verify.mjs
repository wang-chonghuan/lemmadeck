import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const own = path.dirname(fileURLToPath(import.meta.url));
const root = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
assert.equal(process.cwd(), root);
const tmp = path.join(root, ".intentfold/tickets/STEMROBIN-188/tmp");
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const json = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const observed = new Map();
function bind(ref) {
  const bytes = fs.readFileSync(ref.path);
  const stat = fs.statSync(ref.path);
  assert.equal(hash(bytes), ref.sha256, ref.path);
  if (ref.bytes !== undefined) assert.equal(bytes.length, ref.bytes, ref.path);
  if (ref.mode !== undefined) {
    assert.equal(stat.mode & 0o777, Number.parseInt(ref.mode.replace(/^0o/, ""), 8), ref.path);
  }
  observed.set(ref.path, {
    path: ref.path, sha256: hash(bytes), bytes: stat.size,
    mode: (stat.mode & 0o777).toString(8).padStart(4, "0"),
    mtime: stat.mtime.toISOString(), ctime: stat.ctime.toISOString()
  });
  return bytes;
}
function bindRefs(value) {
  if (value === null || typeof value !== "object") return;
  if (typeof value.path === "string" && typeof value.sha256 === "string") bind(value);
  for (const entry of Object.values(value)) bindRefs(entry);
}
const sourceManifestPath = path.join(tmp, "source141142-independent-FIRST-inputs-06/post-FIRST/candidates.json");
bind({ path: sourceManifestPath, sha256: "e56d58ddc2b544b5734f00b6e7cc6922612657b72570350783beee2eaef22c79" });
const sourceManifest = json(sourceManifestPath);
bindRefs(sourceManifest);
const sourceManifestUniqueReferences = observed.size - 1;
const sourceReport = json(sourceManifest.authorReport.path);
const collection = json(sourceManifest.collection.path);
const receiptChecks = [];
for (const name of ["prepare141142", "finalize141", "finalize142"]) {
  const declared = sourceReport.execution[name];
  bind(declared.receipt);
  const actual = json(declared.receipt.path);
  assert.equal(actual.cwd, root);
  assert.equal(actual.exit_code, 0);
  assert.deepEqual(actual.argv, declared.actual.argv);
  assert.equal(actual.exit_code, declared.actual.exit_code);
  assert.equal(actual.cwd, declared.actual.cwd);
  bindRefs(actual.streams);
  const collected = collection.receipts.find((item) => item.receipt.path === declared.receipt.path);
  assert.equal(collected.exitCode, actual.exit_code);
  assert.equal(collected.replayed, false);
  assert.deepEqual(actual.streams.stdout.path, declared.actual.streams.stdout.path);
  assert.deepEqual(actual.streams.stderr.path, declared.actual.streams.stderr.path);
  const stdout = fs.readFileSync(actual.streams.stdout.path, "utf8");
  if (name === "prepare141142") {
    const result = JSON.parse(stdout);
    assert.equal(result.ok, true);
    assert.deepEqual(result.pages.map((page) => [page.page, page.returncode, page.status]),
      [[141, 0, "prepared"], [142, 0, "prepared"]]);
  } else {
    const number = name.endsWith("141") ? 141 : 142;
    const count = number === 141 ? 25 : 24;
    assert(stdout.includes(`p0${number}`));
    assert(stdout.includes(`${count} 行`));
    assert(stdout.includes("通过"));
    assert.equal(fs.readFileSync(actual.streams.stderr.path).length, 0);
  }
  receiptChecks.push({ name, receipt: declared.receipt, actual, collectionMatched: true, producerReplayed: false });
}
bindRefs(sourceReport.failures);
bind(sourceReport.image_ledger.file);
const authorFailure = json(sourceReport.failures[0].path);
assert.equal(authorFailure.exit_code, 1);
assert.equal(authorFailure.charged_image_requests, 1);
assert.equal(authorFailure.image_payload_loaded, false);
const sourcePages = [];
for (const page of sourceManifest.pages) {
  const data = json(page.finalized["page.json"].path);
  const audit = json(page.finalized["audit.json"].path);
  const md = fs.readFileSync(page.finalized["page.md"].path, "utf8");
  const snapshot = fs.readFileSync(page.snapshot.path, "utf8");
  const front = (text) => {
    assert(text.startsWith("---\n"));
    const end = text.indexOf("\n---\n", 4);
    assert(end > 4);
    return { meta: JSON.parse(text.slice(4, end)), body: text.slice(end + 5) };
  };
  assert.deepEqual(front(md).meta, data.meta);
  let expectedBody = front(snapshot).body;
  if (page.physical === 142) {
    const before = "<!-- fig 图 194 box 800,1270,385,235 -->";
    const after = "<!-- fig 图 194 box 809,1278,362,220 -->\n![图 194](figures/fig-194.png)";
    assert.equal(expectedBody.split(before).length - 1, 1);
    expectedBody = expectedBody.replace(before, after);
  }
  assert.equal(expectedBody, front(md).body);
  const rows = data.blocks.filter((block) => block.kind !== "fig" && !block.samerow)
    .reduce((sum, block) => sum + block.lines.reduce((n, line) => n + line.split("↵").length, 0), 0);
  assert.equal(rows, page.physical === 141 ? 25 : 24);
  assert.equal(audit.lines_printed, rows);
  assert.equal(audit.lines_md, rows);
  assert.deepEqual(audit.errors, []);
  assert.deepEqual(audit.count_exclusions, []);
  if (page.physical === 141) {
    assert.deepEqual(data.blocks.map((block) => block.kind), ["p", "p", "p", "exhead", "ex", "ex", "foot"]);
    assert(data.blocks.every((block) => !block.open && !block.cont));
  } else {
    const start = data.blocks.findIndex((block) => block.label === "381");
    assert.deepEqual(data.blocks.slice(start, start + 4).map((block) =>
      [block.kind, block.label, block.open, block.cont, block.samerow]), [
      ["ex", "381", true, false, false],
      ["fig", "图 194", false, false, false],
      ["cap", "图 194", false, false, true],
      ["ex", "381", false, true, false]
    ]);
    assert.equal(data.blocks.find((block) => block.kind === "exhead").lines[0], "第二章补充习题");
    assert.equal(data.blocks.at(-2).label, "383");
    assert.equal(data.blocks.at(-2).open, true);
    assert(data.blocks.at(-2).lines.at(-1).endsWith("它自身的"));
  }
  sourcePages.push({
    physical: page.physical, rows, auditMatched: true, metadataMatched: true,
    snapshotBodyUnchanged: page.physical === 141,
    snapshotProseUnchangedExceptDeclaredNativeFinalization: true,
    blocks: data.blocks.map((block) => ({
      kind: block.kind, label: block.label, rows: block.lines.reduce((n, line) => n + line.split("↵").length, 0),
      open: block.open, cont: block.cont, samerow: block.samerow
    }))
  });
}
const answerManifestPath = path.join(tmp, "n26-answer338-part3-repair-06/affected-review-input.json");
bind({ path: answerManifestPath, sha256: "a9a6051118b7d9b357fb24d6201c67bad415c00661d70fc69016ea1ed8af96ab" });
const answerManifest = json(answerManifestPath);
bindRefs(answerManifest);
const repair = json(answerManifest.repair.path);
const original = json(answerManifest.original.path);
const candidate = json(answerManifest.candidate.path);
assert.equal(original.answers.length, 1);
assert.equal(candidate.answers.length, 1);
assert.equal(repair.before, "其他到达点增加竖直方向的距离，因而路线更长。");
assert.equal(repair.after, "在首先遇到的这条铁轨上，其他高度的点会增加竖直方向的距离；另一条铁轨与$C$的水平距离更大。因此，上述水平线段最短。");
const expected = structuredClone(original);
assert.equal(expected.answers[0].displayAnswer.split(repair.before).length - 1, 1);
expected.answers[0].displayAnswer = expected.answers[0].displayAnswer.replace(repair.before, repair.after);
assert.equal(JSON.stringify(expected), JSON.stringify(candidate));
assert.deepEqual(original.answers[0].notes, candidate.answers[0].notes);
const objectBytes = Buffer.from(JSON.stringify(candidate.answers[0]), "utf8");
assert.equal(hash(objectBytes), "942dd99bfb091211a3ca421347a9f86da27d800f7f71dd533fb1949dfcaa3878");
const ownBaseline = json(path.join(own, "ANSWER338-affected-baseline.json"));
bind(ownBaseline.Fermat_report);
bind(ownBaseline.Fermat_sealed_baseline);
const inherited = json(ownBaseline.Fermat_sealed_baseline.path);
for (const ref of [
  inherited.reused_authority.Boole_SOURCE_FIRST,
  inherited.reused_authority.report,
  inherited.reused_authority.current_fig168_PASS,
  inherited.modern338
]) {
  bind({ path: ref.path, sha256: ref.actual_sha256 ?? ref.actual_file_sha256 });
}
const seals = [];
for (const [name, sha] of [
  ["FIRST.json", "86b8a6d84a5c7310d8ccc36162ec325c0aa48eed6ca0fe3921bd94e8bed3528e"],
  ["ANSWER338-affected-baseline.json", "b1f5a7e557c148df3dc0a0524810245aa75c7868e09759e7e80842b543246efd"]
]) {
  const file = path.join(own, name);
  bind({ path: file, sha256: sha, mode: "0o444" });
  seals.push(observed.get(file));
}
const output = {
  status: "PASS_BINDINGS_RECEIPTS_AND_AFFECTED_ONLY_DIFF",
  observedAt: new Date().toISOString(),
  sourceManifestUniqueReferences,
  observedBindings: [...observed.values()],
  actualSourceReceipts: receiptChecks,
  sourcePages,
  authorHistoricalFailure: authorFailure,
  authorCountersRetained: sourceReport.counters,
  sourceCropHash: sourceManifest.nativeFigure194.native_finalize_crop.sha256,
  answer338: {
    exactOnlyRepairSentenceChanged: true,
    allOtherRootAndObjectFieldsAndOrderUnchanged: true,
    allOtherDisplayAnswerTextUnchanged: true,
    oldNotesExactUnchanged: true,
    originalFileHash: answerManifest.original.sha256,
    candidateFileHash: answerManifest.candidate.sha256,
    objectHash: hash(objectBytes),
    objectUTF8Bytes: objectBytes.length,
    objectPropertyOrder: Object.keys(candidate.answers[0]),
    after: repair.after,
    contentRepairCount: repair.contentRepairCount,
    newImageRequests: 0,
    other11ObjectsAccessed: false,
    finalized: false,
    published: false
  },
  ownSealsUnchanged: seals,
  imageDecodingPerformedByThisScript: false,
  producerExecutionPerformedByThisScript: false,
  outputWritesOnlyOwn: true
};
fs.writeFileSync(path.join(own, "check-output.json"), JSON.stringify(output, null, 2) + "\n");
console.log(JSON.stringify({
  status: output.status, observedAt: output.observedAt,
  sourceManifestUniqueReferences, totalUniqueBindings: observed.size,
  sourceRows: sourcePages.map((page) => [page.physical, page.rows]),
  sourceReceipts: receiptChecks.map((check) => [check.name, check.actual.exit_code]),
  answer338: output.answer338, ownSealsUnchanged: seals,
  checkOutputHash: hash(fs.readFileSync(path.join(own, "check-output.json")))
}, null, 2));
