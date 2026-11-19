import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const R = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
assert.equal(process.cwd(), R);
const ticket = path.join(R, ".intentfold/tickets/STEMROBIN-181");
const O = path.join(ticket, "tmp/d829-n71-source-contract-repair");
const D = path.join(ticket, "tmp/d822-n71-first-bilingual-native");
const evidence = path.join(ticket, "evidence");
const hash = (b) => crypto.createHash("sha256").update(b).digest("hex");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const targets = read(path.join(D, "choice-bindings.json")).packages.map((p) => ({
  locale: p.locale, package: p.package, expected: p.seedExpected,
  approvedCanonicalDigest: p.approvedSeedCanonicalDigest, locationsChecked: [],
  exactByteMatches: [], frozenObjectMatches: [],
}));
const index = read(path.join(evidence, "index.json"));
const gitArgs = [];
function git(args, options = {}) {
  gitArgs.push(["git", "--no-optional-locks", ...args]);
  return execFileSync("git", ["--no-optional-locks", ...args], {
    cwd: R, maxBuffer: 32 * 1024 * 1024, ...options,
  });
}
const safe = (p) => {
  assert.ok(p.startsWith(`${R}/`), p);
  if (fs.existsSync(p)) assert.ok(fs.realpathSync(p).startsWith(`${R}/`), p);
  return p;
};
function inspectBytes(bytes, location) {
  const sha256 = hash(bytes);
  for (const target of targets) if (sha256 === target.expected.sha256) {
    assert.equal(bytes.length, target.expected.bytes);
    target.exactByteMatches.push({ ...location, sha256, bytes: bytes.length });
  }
  return sha256;
}
for (const target of targets) {
  const indexed = index.reports.filter((b) => b.sha256 === target.expected.sha256);
  assert.equal(indexed.length, 1);
  assert.equal(path.join(R, indexed[0].originalPath), target.expected.path);
  for (const p of new Set([target.expected.path, ...indexed.map((b) => path.join(R, b.path))])) {
    safe(p);
    const exists = fs.existsSync(p);
    const result = { path: p, exists };
    if (exists) {
      const bytes = fs.readFileSync(p);
      result.sha256 = inspectBytes(bytes, { path: p, representation: "regular-file" });
      result.bytes = bytes.length;
    }
    target.locationsChecked.push(result);
  }
}
const sizes = new Set(targets.map((t) => t.expected.bytes));
const inventory = { directories: 0, regularJsonFiles: 0, sizeMatchedFilesHashed: [],
  symlinksSkipped: [], fileCountLimit: 60000 };
function walk(dir) {
  inventory.directories++;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) { inventory.symlinksSkipped.push(p); continue; }
    if (entry.isDirectory()) {
      if (!["node_modules", ".git"].includes(entry.name)) walk(p);
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      inventory.regularJsonFiles++;
      assert.ok(inventory.regularJsonFiles <= inventory.fileCountLimit, "Lookup bound exceeded");
      const bytesCount = fs.statSync(p).size;
      if (!sizes.has(bytesCount)) continue;
      const bytes = fs.readFileSync(p);
      inventory.sizeMatchedFilesHashed.push({ path: p, bytes: bytes.length,
        sha256: inspectBytes(bytes, { path: p, representation: "regular-file" }) });
    }
  }
}
walk(evidence);
walk(D);

// Inspect persisted seed objects, including JSON-encoded snapshot strings; never assemble a seed.
const snapshotPaths = execFileSync("rg", [
  "-l", "--hidden", "-g", "*.json", "s10y-choice-seed-v1", evidence, D,
], { cwd: R, encoding: "utf8", maxBuffer: 2 * 1024 * 1024 }).trim().split("\n").filter(Boolean);
assert.ok(snapshotPaths.length <= 128, "Frozen snapshot lookup bound exceeded");
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort()
    .map((key) => `${canonical(key)}:${canonical(value[key])}`).join(",")}}`;
  return JSON.stringify(value).replace(/[^\x00-\x7f]/g,
    (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`);
}
const snapshots = [];
function inspectObject(value, location, depth = 0) {
  assert.ok(depth < 64);
  if (value && typeof value === "object") {
    if (value.schema === "s10y-choice-seed-v1") {
      const digest = hash(Buffer.from(canonical(value)));
      const record = { ...location, source: value.source, canonicalDigest: digest };
      snapshots.push(record);
      for (const target of targets) if (digest === target.approvedCanonicalDigest) {
        target.frozenObjectMatches.push(record);
      }
    }
    for (const [key, child] of Object.entries(value)) {
      const escaped = key.replace(/~/g, "~0").replace(/\//g, "~1");
      inspectObject(child, { ...location, pointer: `${location.pointer}/${escaped}` }, depth + 1);
    }
  } else if (typeof value === "string" && value.includes("s10y-choice-seed-v1")) {
    try {
      const decoded = JSON.parse(value);
      inspectObject(decoded, { ...location, representation: "JSON-contained-string" }, depth + 1);
      inspectBytes(Buffer.from(value), { ...location, representation: "JSON-contained-exact-string" });
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
    }
  }
}
for (const p of snapshotPaths) {
  safe(p);
  inspectObject(read(p), { path: p, pointer: "", representation: "frozen-JSON-object" });
}
const head = git(["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const tree = git(["ls-tree", "-r", "-l", head, "--",
  path.relative(R, evidence)], { encoding: "utf8" });
const treeFiles = tree.trim().split("\n").filter(Boolean).map((line) => {
  const match = line.match(/^(\d+) blob ([a-f0-9]+)\s+(\d+)\t(.+)$/);
  return match ? { mode: match[1], blob: match[2], bytes: Number(match[3]), path: match[4] } : null;
}).filter(Boolean);
const gitCandidates = treeFiles.filter((f) => f.path.endsWith(".json") && sizes.has(f.bytes));
assert.ok(gitCandidates.length <= 256, "Git delivery lookup bound exceeded");
const gitBytesHashed = [];
for (const file of gitCandidates) {
  const bytes = git(["cat-file", "blob", file.blob]);
  gitBytesHashed.push({ ...file, sha256: inspectBytes(bytes, {
    path: path.join(R, file.path), gitCommit: head, gitBlob: file.blob,
    representation: "Git-tracked-delivery-bytes",
  }) });
}
const exactDirs = [...new Set(targets.flatMap((t) =>
  t.locationsChecked.map((b) => path.relative(R, path.dirname(b.path)))))];
const history = git(["log", "-n", "8", "--format=%H %s", head, "--", ...exactDirs],
  { encoding: "utf8" }).trim().split("\n").filter(Boolean);
assert.equal(history.length, 0, "Exact seed delivery history needs explicit inspection before stopping");
const missingTrackedPaths = targets.flatMap((target) => target.locationsChecked
  .map((b) => b.path).filter((p) => !treeFiles.some((f) => f.path === path.relative(R, p))));
for (const target of targets) {
  target.status = target.exactByteMatches.length ? "FOUND_EXACT_REVIEWED_SEED_BYTES" :
    target.frozenObjectMatches.length ? "FROZEN_OBJECT_FOUND_EXACT_BYTES_MISSING" :
    "MISSING_EXACT_REVIEWED_SEED_BYTES_AND_FROZEN_SEED_OBJECT";
}
const report = {
  schema: "d829-bounded-choice-seed-lookup@1",
  root: R, writeRoot: O, targets, searchBounds: {
    filesystemRoots: [evidence, D], gitScope: path.relative(R, evidence),
    gitCommit: head, exactSeedPathHistoryLimit: 8, otherCheckoutsRead: 0,
    snapshotFileLimit: 128, gitSizeMatchedBlobLimit: 256,
  },
  inventory, frozenSnapshotPathsChecked: snapshotPaths, frozenSeedObjects: snapshots,
  gitTrackedDeliveryFileCount: treeFiles.length, gitSizeMatchedBlobsHashed: gitBytesHashed,
  missingExactPathsNotTrackedAtHEAD: missingTrackedPaths,
  exactSeedPathHistory: history, gitReadOnlyCommands: gitArgs,
  recoveredSeedsWritten: 0, newSeedGeneration: 0, seedReconstruction: 0,
  sourceHashesSubstitutedForSeedHashes: false, validatorOrNativeStagesRun: 0,
  imageLoads: 0, paidCalls: 0,
  qualification: "Missing within these finite local scopes, not a claim about remote archives, unreachable Git objects, other refs or other checkouts.",
};
fs.writeFileSync(path.join(O, "choice-seed-lookup.json"), `${JSON.stringify(report, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({
  targets: targets.map((t) => ({ locale: t.locale, package: t.package, status: t.status,
    rawSha256: t.expected.sha256, canonicalDigest: t.approvedCanonicalDigest })),
  regularJsonFiles: inventory.regularJsonFiles, sizeMatchedFiles: inventory.sizeMatchedFilesHashed.length,
  frozenSeedObjects: snapshots.length, gitBlobsHashed: gitBytesHashed.length,
}));
