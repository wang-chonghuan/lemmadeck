import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const root = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const tmp = ".intentfold/tickets/STEMROBIN-184/tmp";
const evidence = "ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence";
const archive = `${evidence}/batch008-late-text-source-counter-reviews`;
const helper = `${tmp}/complete-batch008-late-retention-provenance.mjs`;
const absolute = (p) => path.isAbsolute(p) ? p : path.resolve(root, p);
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
function bytes(p) {
  p = absolute(p);
  assert.ok(p.startsWith(`${root}/`), "Outside-workspace read refused");
  let cursor = "/";
  for (const part of p.slice(1).split("/")) {
    cursor = path.join(cursor, part);
    assert.equal(fs.lstatSync(cursor).isSymbolicLink(), false, `Symlink refused: ${cursor}`);
  }
  assert.ok(fs.lstatSync(p).isFile());
  return fs.readFileSync(p);
}
function bound(p, hash) {
  const data = bytes(p);
  assert.equal(sha(data), hash, `Binding mismatch: ${p}`);
  return JSON.parse(data);
}
const firstPath = `${archive}/retention.json`;
const firstSha = "e99373fb13740fd461e67bfeea94751552730c4a037ec75b2d20cd345a188a08";
const first = bound(firstPath, firstSha);
const old = [
  { path: `${evidence}/batch008-n18-n19-author-disposition/retention.json`, sha256: "471090966e04af10f3da9dbfa834cfe31dc34249ec08b2560ad03d501b9b64e6" },
  { path: `${evidence}/batch008-source72-76-completed-reviews/retention.json`, sha256: "b4818453402b3ebd5f3952505f5392ca2dadb2f2f53f607d8f59a3b5bd5b9675" },
  { path: `${evidence}/batch008-source71-assembly73-diagnostic76-author/retention.json`, sha256: "e980611ed346b78b26d866e81d37fdf2642f140ccfaa2c2d98a0d3aff58361fd" },
  { path: `${evidence}/batch008-counter-and-source-p72-p75-disposition/retention.json`, sha256: "a5fd2b32a6d8f1f8ed9da5dc4f4b20cc1cafe25f9a6335d78d2d23627816ff40" },
  { path: `${evidence}/batch008-source-p72-p75-before-finalize/retention.json`, sha256: "650adc01b5b27c6d62cf66c569099389cb6b97dc26200d2092a3c090084bd5b3" },
];
const oldRecords = old.flatMap((manifest) =>
  bound(manifest.path, manifest.sha256).files.map((record) => ({ ...record, manifest })));
function exactRecord(original, hash) {
  return oldRecords.find((record) =>
    record.sha256 === hash
    && record.retainedPath
    && [record.path, record.sourcePathProvenanceOnly, record.pathProvenanceOnly]
      .filter(Boolean).some((p) => absolute(p) === original));
}
function verified(record) {
  const data = bytes(record.retainedPath);
  assert.equal(sha(data), record.sha256);
  if (record.bytes != null) assert.equal(data.length, record.bytes);
  return {
    retainedPath: record.retainedPath,
    retainedSha256: record.sha256,
    bytes: data.length,
    priorArchiveManifest: record.manifest.path,
    priorArchiveManifestSha256: record.manifest.sha256,
  };
}

const resolved = [];
const files = first.files.map((record) => {
  if (record.retainedPath) return record;
  const previous = exactRecord(record.originalPath, record.sha256);
  assert.ok(previous, `Still local-only: ${record.originalPath}`);
  const updated = {
    ...record,
    ...verified(previous),
    action: "REUSED_EXACT_OLD_DURABLE_BYTES",
    reuseMatch: "ORIGINAL_PATH_AND_HASH",
    initialDispositionPreservedAt: firstPath,
  };
  resolved.push(updated);
  return updated;
});
assert.equal(resolved.length, 2);
const metadataPointers = first.unhashedLocalOnlyOriginalPaths.filter((item) => item.originalPath === "/prose/2/text");
assert.equal(metadataPointers.length, 1);
const unbound = first.unhashedLocalOnlyOriginalPaths.filter((item) => item.originalPath !== "/prose/2/text");
const unhashedResolved = [];
const remainingLocalOnly = [];
for (const item of unbound) {
  const previous = item.original.sha256 ? exactRecord(item.originalPath, item.original.sha256) : null;
  if (previous) {
    unhashedResolved.push({
      ...item, ...verified(previous),
      action: "UNHASHED_FROZEN_REFERENCE_WITH_VERIFIED_EXISTING_DURABLE_MAPPING",
      qualifier: "Original package supplied no hash for this reference; existing prior mapping is retained provenance, not a new review or retrospective result.",
    });
  } else remainingLocalOnly.push(item);
}
for (const record of files) {
  assert.ok(record.retainedPath);
  assert.equal(sha(bytes(record.retainedPath)), record.sha256);
}
for (const manifest of old) bound(manifest.path, manifest.sha256);
assert.equal(sha(bytes(firstPath)), firstSha);

function generated(p, data) {
  fs.writeFileSync(absolute(p), data, { flag: "wx" });
  return { path: p, sha256: sha(Buffer.from(data)), bytes: Buffer.byteLength(data) };
}
const helperBytes = bytes(helper);
const helperCopy = `${archive}/retention-provenance-completion-helper.mjs`;
fs.copyFileSync(absolute(helper), absolute(helperCopy), fs.constants.COPYFILE_EXCL);
assert.equal(sha(bytes(helperCopy)), sha(helperBytes));

const counts = {
  ...first.counts,
  retainedHashMappings: files.length,
  reusedOldMappings: first.counts.reusedOldMappings + resolved.length,
  unresolvedHashMappings: 0,
  unhashedFilesystemProvenancePaths: unbound.length,
  unhashedReferencesResolvedToPriorDurableMappings: unhashedResolved.length,
  remainingUnhashedLocalOnlyOriginalPaths: remainingLocalOnly.length,
  nonFilesystemJSONPointersReclassified: 1,
  additionalPayloadCopies: 0,
};
delete counts.unhashedProvenancePaths;
const completed = {
  schema: "STEMROBIN-184/exact-byte-retention-provenance-completion@1",
  status: "RETENTION_ONLY_NO_GATE_OR_PROMOTION",
  archive,
  firstRetentionManifest: { path: firstPath, sha256: firstSha, unchanged: true },
  counts,
  priorArchives: old,
  files,
  twoInitialLocalOnlyMappingsResolved: resolved,
  metadataPointersNotFilesystemOriginals: metadataPointers,
  unhashedReferencesResolvedToExistingDurableMappings: unhashedResolved,
  remainingUnhashedLocalOnlyOriginalPaths: remainingLocalOnly,
  missingHashBoundOriginalPaths: first.missingOriginalPaths,
  historicalOriginalVersionsRetained: first.currentOriginalDifferentFromFrozenPaths,
  arendtUnmanifestedPathsNotReadOrRetained: first.arendtUnmanifestedPathsNotRetained,
  interpretation: first.interpretation,
  limits: first.limits,
  firstReceiptAndHashListPreserved: true,
  helper: { path: helperCopy, sha256: sha(helperBytes), bytes: helperBytes.length },
};
const json = generated(`${archive}/retention-completion.json`, `${JSON.stringify(completed, null, 2)}\n`);
const lines = [
  "# Final Late Text/Source/Counter Retention Receipt",
  "",
  "Opaque byte retention and provenance completion only. No reviews, image display/decoding, tests, counters, finalize, gates or promotion ran.",
  `All ${counts.primaryPayloadMappings} primary mappings retained: T1 2, Plato 24, Arendt frozen d47d3f52 package 228.`,
  `All ${counts.totalHashMappings} hash-bound mappings now resolve to durable exact bytes; old mapping reuse ${counts.reusedOldMappings}, new-package reuse ${counts.reusedNewMappings}. New payload files ${counts.newPayloadFiles}, payload bytes ${counts.newPayloadBytes}. No additional payload was copied for this completion.`,
  "Arendt membership remains 227 manifest-listed files plus manifest. The 34 unmanifested paths were not read or retained. Frozen Plato observations and final H3c retraction remain separate unchanged payloads.",
  "Prior 47109096/b4818453 trees remain unchanged as recorded in the first receipt. Additional a5fd2b32/650adc01 archive metadata supplies existing exact mappings for the two references initially marked local-only; no old file was rewritten.",
  "",
  "## Missing and Local-Only Originals",
  "",
  `Missing hash-bound originals: ${first.missingOriginalPaths.length}. Unresolved hash-bound mappings: 0.`,
  `Unhashed filesystem provenance paths: ${unbound.length}; resolved to existing prior durable mappings: ${unhashedResolved.length}; remaining local-only: ${remainingLocalOnly.length}.`,
  ...remainingLocalOnly.map((item) => `- \`${item.originalPath}\`: ${item.original.status}; no frozen hash supplied and no new copy.`),
  "",
  "The initial `/prose/2/text` entry is a JSON pointer, not an original filesystem path. It is excluded from final filesystem counts. The unchanged first receipt preserves its initial classification.",
  ...unhashedResolved.map((item) => `- Already durable unhashed reference: \`${item.originalPath}\` -> \`${item.retainedPath}\`; SHA256 \`${item.retainedSha256}\`.`),
  ...resolved.map((item) => `- Resolved exact prior hash mapping: \`${item.originalPath}\` -> \`${item.retainedPath}\`; SHA256 \`${item.sha256}\`.`),
  "",
  "Seven historical/current version differences remain mapped to exact frozen snapshots in retention-completion.json; none is substituted with current bytes. Original absolute paths are provenance, never runtime dependencies.",
  `All original/retained hashes are in retention-completion.json, SHA256 \`${json.sha256}\`. First retention.json, report, hash list and helper are preserved unchanged. SHA256SUMS-final.txt covers all new archive files except itself; its own hash is in the final TMP receipt.`,
  "",
];
const report = generated(`${archive}/retention-completion-report.md`, `${lines.join("\n")}\n`);
const all = [];
function walk(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const p = path.join(folder, entry.name);
    assert.equal(entry.isSymbolicLink(), false);
    if (entry.isDirectory()) walk(p);
    else {
      const data = bytes(p);
      all.push({ path: path.relative(root, p), sha256: sha(data), bytes: data.length });
    }
  }
}
walk(absolute(archive));
const sums = generated(`${archive}/SHA256SUMS-final.txt`,
  `${all.map((item) => `${item.sha256}  ${path.relative(archive, item.path)}`).sort().join("\n")}\n`);
const receipt = {
  status: "RETENTION_ONLY_NO_GATE_OR_PROMOTION",
  counts,
  manifest: json,
  report,
  finalHashList: sums,
  allArchiveFileHashes: [...all, sums],
  localOnlyOriginalPaths: remainingLocalOnly,
};
generated(`${tmp}/late-text-source-counter-retention-completion-result.json`, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify({ ...receipt, allArchiveFileHashes: undefined }, null, 2));
