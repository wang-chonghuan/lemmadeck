import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const workspace = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const tmp = path.join(workspace, ".intentfold/tickets/STEMROBIN-181/tmp");
const own = path.join(tmp, "d624-source208-first-independent-review");
const author = path.join(tmp, "d612-source208-first-author");
const accepted207 = path.join(tmp, "d606-source207-first-independent-review/report.json");
const digest = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const load = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const mode = (file) => (fs.statSync(file).mode & 0o777).toString(8).padStart(4, "0");
const describe = (file) => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: digest(bytes), bytes: bytes.length, mode: mode(file) };
};
function write(name, value) {
  const target = path.resolve(own, name);
  assert.equal(path.dirname(target), own);
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
}
function regularFiles(root) {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(root, entry.name);
    assert(!entry.isSymbolicLink(), `Unexpected symlink: ${file}`);
    if (entry.isDirectory()) return regularFiles(file);
    assert(entry.isFile(), `Unexpected nonregular entry: ${file}`);
    return [file];
  }).sort();
}
const manifestPath = path.join(author, "frozen-files.json");
const anchors = [
  [manifestPath, "3bc81fdfdb11750b2c134d3c601586b77166125a4f77dbb7a008b6d225cc6b80"],
  [path.join(author, "report.json"), "6b96c152c684ff01d1a9eb38cacc986af5e3a9b4d6a6ef5a1d02a75955e42cc8"],
  [accepted207, "ffb4dc35e735f8e828b11c48496508a7844de0eda23652632b8cae9def2c001e"],
  [path.join(author, "source/10p/pages/0208/page.json"), "a6982b5dbf0cf6401e3a46edfe44c4a49833e9d59d1238f935fe13dbdc077722"],
  [path.join(author, "source/10p/pages/0208/page.md"), "0ef6af2fa0eac3a5d9a18ccb7ed08aadacbb189652d65adca3766c898d66a56b"],
  [path.join(author, "work/10p/pages/0208/page.png"), "ba804d477e7ef7d26aea43eee13790856ee7166a138c3536033401db8eb98876"],
  [path.join(author, "work/10p/pages/0208/page.grid.png"), "3231aec0d3815cb92e268649d81b4c74db6abac1a0890f22e1a5c6287d560511"],
  [path.join(author, "work/10p/pages/0208/figures/fig-182.png"), "1b126e58b3603201b5d341d9e51773c8a91e58f750d219abd1827ff819f46e0a"],
  [path.join(author, "work/10p/pages/0208/figures/fig-182.svg"), "e4e09ca37699416a5d322145605fc867f5299140717b073b3fae31ab8360b1c8"]
];
function verifyInputs() {
  const checkedAnchors = anchors.map(([file, sha256]) => {
    const observed = describe(file);
    assert.equal(observed.sha256, sha256, file);
    assert.equal(observed.mode, "0444", file);
    return { ...observed, expectedSha256: sha256, status: "PASS" };
  });
  const manifest = load(manifestPath);
  const listed = new Set();
  const files = manifest.files.map((expected) => {
    assert(expected.path.startsWith(`${author}/`));
    assert(!listed.has(expected.path));
    listed.add(expected.path);
    assert(fs.lstatSync(expected.path).isFile());
    const actual = describe(expected.path);
    assert.equal(actual.sha256, expected.sha256, expected.path);
    assert.equal(actual.bytes, expected.bytes, expected.path);
    assert.equal(actual.mode, expected.mode, expected.path);
    assert.equal(actual.mode, "0444");
    return { ...actual, status: "PASS" };
  });
  const all = regularFiles(author);
  assert.deepEqual(all, [...listed, manifestPath].sort());
  const accepted = load(accepted207);
  assert.equal(accepted.gates.SOURCE207.status, "PASS");
  assert.equal(accepted.gates.OUTGOING207.source_ref, "p0207#7");
  assert.equal(accepted.gates.OUTGOING207.exact_tail, "减小光圈的孔，可以使到照相机不");
  assert.equal(accepted.gates.OUTGOING207.native_open, true);
  return {
    schema: "d624-source208-first-independent-review/input-verification@1",
    status: "PASS",
    anchors: checkedAnchors,
    authorFrozenManifest: describe(manifestPath),
    listedFiles: files.length,
    authorRegularFilesIncludingManifest: all.length,
    missingFiles: 0,
    unlistedFiles: 0,
    sha256Mismatches: 0,
    byteLengthMismatches: 0,
    modeMismatches: 0,
    everyFrozenFileVerified: true,
    files,
    accepted207: {
      ...describe(accepted207),
      sourceStatus: accepted.gates.SOURCE207.status,
      existingOutgoingStatus: accepted.gates.OUTGOING207.status,
      sourceRef: accepted.gates.OUTGOING207.source_ref,
      nativePointer: accepted.gates.OUTGOING207.native_pointer,
      exactTail: accepted.gates.OUTGOING207.exact_tail,
      scope: "Existing accepted report and outgoing text only; no207 pixel opens, source rereview or report rewriting."
    }
  };
}

if (process.argv[2] === "verify") {
  const result = verifyInputs();
  write("input-verification.json", result);
  console.log(JSON.stringify({
    status: result.status, listedFiles: result.listedFiles,
    authorRegularFilesIncludingManifest: result.authorRegularFilesIncludingManifest,
    mismatches: 0, source207: "PASS"
  }));
} else if (process.argv[2] === "freeze") {
  const initial = load(path.join(own, "input-verification.json"));
  const current = verifyInputs();
  assert.deepEqual(current, initial, "Frozen inputs changed during review");
  const inventory = describe(path.join(own, "independent-inventory.json"));
  assert.equal(inventory.sha256, "f22bd504c19aa4016b4f6acefa6af37c1b7556e71a1fda0b7de0a1dd25fe4335");
  const report = load(path.join(own, "report.json"));
  assert.equal(report.boundedBatchFinished, true);
  const ledger = load(path.join(own, "open-ledger.json"));
  assert(ledger.conservativeBatchTotal <= ledger.batchLimit);
  assert(ledger.conservativeContextTotal <= ledger.contextLimit);
  const files = regularFiles(own);
  for (const file of files) fs.chmodSync(file, 0o444);
  write("first-review-freeze.json", {
    schema: "d624-source208-first-independent-review/first-review-freeze@1",
    ticket: "STEMROBIN-181", batch: "D033",
    status: report.status,
    requiredMode: "0444",
    independentInventoryUnchangedSincePreAuthorSeal: true,
    source207CurrentPinnedReportUnchanged: true,
    authorFinalInputRecheck: {
      status: "PASS", listedFiles: current.listedFiles,
      regularFilesIncludingManifest: current.authorRegularFilesIncludingManifest,
      everyFrozenHashBytesModeAndFileSetUnchanged: true,
      authorManifestSha256: current.authorFrozenManifest.sha256,
      accepted207ReportSha256: current.accepted207.sha256
    },
    files: files.map(describe),
    freezeSelfHash: "Returned externally; self omitted from own hash list.",
    fullN78: false, completeCardsAdded: 0,
    externalImagePayloadsReturned: 0,
    scope: "Only own root written; no outside restoration or cleanup and no global concurrent-byte immutability claim."
  });
  fs.chmodSync(path.join(own, "first-review-freeze.json"), 0o444);
  const freeze = load(path.join(own, "first-review-freeze.json"));
  for (const entry of freeze.files) assert.deepEqual(describe(entry.path), entry);
  assert.equal(mode(path.join(own, "first-review-freeze.json")), "0444");
  console.log(JSON.stringify({
    status: report.status,
    ownedFilesMode0444: freeze.files.length + 1,
    frozenAuthorFiles: current.listedFiles,
    imageOpens: ledger.contextOpens,
    conservativeOpens: ledger.conservativeContextTotal,
    files: ["independent-inventory.json", "report.json", "open-ledger.json", "first-review-freeze.json"].map((name) => describe(path.join(own, name)))
  }, null, 2));
} else {
  throw new Error("Use verify or freeze; this script never runs native pipelines.");
}
