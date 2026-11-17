import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const root = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const tmp = ".intentfold/tickets/STEMROBIN-184/tmp";
const evidence = "ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence";
const archive = `${evidence}/batch008-late-text-source-counter-reviews`;
const helper = `${tmp}/retain-batch008-late-text-source-counter-reviews.mjs`;
const scratch = `${tmp}/late-text-source-counter-retention-result.json`;
const plato = `${tmp}/source-9g-p76-p79-targeted-clarification`;
const arendt = `${tmp}/source-9g-p73-counter-candidate`;
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const absolute = (p) => path.isAbsolute(p) ? path.normalize(p) : path.resolve(root, p);
const relative = (p) => path.relative(root, absolute(p));
const inside = (p, parent) => p === parent || p.startsWith(`${parent}/`);
const blockedName = (p) =>
  /(?:^|\/)(?:\.venv|venv|node_modules|__pycache__|\.git|\.env(?:\.[^/]*)?|id_rsa|id_ed25519)(?:\/|$)/.test(p)
  || /(?:^|\/)(?:python(?:\d+(?:\.\d+)*)?|node|bash|zsh|sh)(?:$)/.test(p)
  || /\.(?:pem|key|p12|pfx)$/.test(p);

function noLinks(p) {
  const parsed = path.parse(p);
  let cursor = parsed.root;
  for (const part of p.slice(parsed.root.length).split(path.sep).filter(Boolean)) {
    cursor = path.join(cursor, part);
    const stat = fs.lstatSync(cursor);
    if (stat.isSymbolicLink()) {
      const error = new Error(`Symlink traversal refused: ${cursor}`);
      error.code = "SYMLINK";
      throw error;
    }
  }
  return fs.lstatSync(p);
}

function readRegular(p) {
  p = absolute(p);
  assert.ok(inside(p, root), `Outside-workspace byte read refused: ${p}`);
  assert.ok(!blockedName(p), `Runtime/environment/secret-name read refused: ${p}`);
  assert.ok(noLinks(p).isFile(), `Not a regular file: ${p}`);
  const bytes = fs.readFileSync(p);
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(bytes.toString("utf8"))) {
    throw new Error(`Private-key payload refused: ${p}`);
  }
  return bytes;
}

function bound(p, expected) {
  const bytes = readRegular(p);
  assert.equal(sha(bytes), expected, `Frozen binding mismatch: ${p}`);
  return { path: relative(p), sha256: expected, bytes: bytes.length };
}

function tree(p) {
  const files = [];
  function walk(folder) {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(folder, entry.name);
      if (entry.isSymbolicLink()) files.push({ path: relative(file), type: "symlink-not-followed" });
      else if (entry.isDirectory()) walk(file);
      else if (entry.isFile()) {
        const bytes = readRegular(file);
        files.push({ path: relative(file), sha256: sha(bytes), bytes: bytes.length });
      } else files.push({ path: relative(file), type: "nonregular-not-read" });
    }
  }
  walk(absolute(p));
  return { files, treeSha256: sha(Buffer.from(JSON.stringify(files))) };
}

assert.equal(process.cwd(), root);
assert.ok(!fs.existsSync(absolute(archive)), "New archive must not already exist");
assert.ok(!fs.existsSync(absolute(scratch)), "New scratch receipt must not already exist");

const fixed = {
  t1Report: bound(`${tmp}/n18-T1-text-independent-affected-review.md`, "314e61ba2883bae87b049dd78564a4d773f0c71dacb383d3e9619a25e40795d3"),
  t1Ledger: bound(`${tmp}/n18-T1-text-independent-affected-review.json`, "27e215e7fa40ef3f858c8fd0a55094ec0183aa493eaf8a41c64f3d540788ffbb"),
  platoDelivery: bound(`${plato}/delivery-manifest.json`, "714feee59903a0ccaf3e4dd824f35eb13496b1471bfe929058599f892f83890f"),
  platoFreeze: bound(`${plato}/freeze-manifest.json`, "edc56e4ca4907355f1dca235147c8bd1ff0e696aa8a1df113112af7533643ebe"),
  platoProvenance: bound(`${plato}/crop-provenance.json`, "cee6a96e563d7187d871fd6159367303bcc895e58571de15ab4ba7ef0c70489c"),
  arendtManifest: bound(`${arendt}/manifest.json`, "d47d3f523e64cb500127cd04e35e29958ba5063a785e5106fa2d005aed0d5fb5"),
};
const priorBindings = [
  bound(`${evidence}/batch008-n18-n19-author-disposition/retention.json`, "471090966e04af10f3da9dbfa834cfe31dc34249ec08b2560ad03d501b9b64e6"),
  bound(`${evidence}/batch008-source72-76-completed-reviews/retention.json`, "b4818453402b3ebd5f3952505f5392ca2dadb2f2f53f607d8f59a3b5bd5b9675"),
  bound(`${evidence}/batch008-source71-assembly73-diagnostic76-author/retention.json`, "e980611ed346b78b26d866e81d37fdf2642f140ccfaa2c2d98a0d3aff58361fd"),
];
const priorTrees = priorBindings.slice(0, 2).map((binding) => ({
  manifest: binding,
  ...tree(path.dirname(binding.path)),
}));
const parse = (p) => JSON.parse(readRegular(p));
const delivery = parse(fixed.platoDelivery.path);
const provenance = parse(fixed.platoProvenance.path);
const frozen = parse(fixed.arendtManifest.path);
const ledger = parse(fixed.t1Ledger.path);
assert.equal(frozen.files.length, 227);

const oldByHash = new Map();
const oldByOriginal = new Map();
for (const binding of priorBindings) {
  for (const record of parse(binding.path).files) {
    if (!record.retainedPath || !record.sha256) continue;
    const item = {
      path: relative(record.retainedPath),
      sha256: record.sha256,
      bytes: record.bytes,
      archiveManifest: binding.path,
      archiveManifestSha256: binding.sha256,
    };
    const hashItems = oldByHash.get(item.sha256) ?? [];
    hashItems.push(item);
    oldByHash.set(item.sha256, hashItems);
    for (const original of [record.path, record.sourcePathProvenanceOnly].filter(Boolean)) {
      const key = `${absolute(original)}\n${item.sha256}`;
      const items = oldByOriginal.get(key) ?? [];
      items.push(item);
      oldByOriginal.set(key, items);
    }
  }
}

const requests = new Map();
const pathReferences = new Map();
function request(p, hash, bytes, origin, group, primary = false) {
  assert.match(hash, /^[a-f0-9]{64}$/);
  const original = absolute(p);
  const key = `${original}\n${hash}`;
  const prior = requests.get(key);
  if (prior) {
    prior.origins.push(origin);
    prior.primary ||= primary;
    if (prior.bytes == null && bytes != null) prior.bytes = bytes;
    return prior;
  }
  const item = { originalPath: original, sha256: hash, bytes: bytes ?? null, origins: [origin], group, primary };
  requests.set(key, item);
  return item;
}
request(fixed.t1Report.path, fixed.t1Report.sha256, fixed.t1Report.bytes, "explicit T1 report", "t1", true);
request(fixed.t1Ledger.path, fixed.t1Ledger.sha256, fixed.t1Ledger.bytes, "explicit T1 ledger", "t1", true);
request(fixed.platoDelivery.path, fixed.platoDelivery.sha256, fixed.platoDelivery.bytes, "Plato delivery manifest", "plato", true);
for (const item of delivery.files) {
  request(`${plato}/${item.path}`, item.sha256, null, `Plato delivery: ${item.role}`, "plato", true);
}
for (const crop of provenance.crops) {
  request(crop.native_path, crop.native_sha256, null, `Plato crop ${crop.id}: native`, "plato", true);
  request(crop.display_path, crop.display_sha256, null, `Plato crop ${crop.id}: nearest2`, "plato", true);
  request(crop.source_path, crop.source_sha256, null, `Plato crop ${crop.id}: source provenance`, "plato-provenance");
}
request(fixed.arendtManifest.path, fixed.arendtManifest.sha256, fixed.arendtManifest.bytes, "Arendt frozen manifest", "arendt", true);
for (const item of frozen.files) {
  assert.ok(inside(absolute(item.path), absolute(arendt)), "Frozen Arendt list escaped its package");
  request(item.path, item.sha256, item.bytes, "Arendt d47d3f52 frozen files[]", "arendt", true);
}

function looksLocal(p) {
  return typeof p === "string"
    && (p.startsWith("/") || /^(?:\.tmp|\.intentfold|\.claude|ssot-resources)\//.test(p));
}
function addReference(p, origin) {
  if (!looksLocal(p)) return;
  const original = absolute(p);
  const entries = pathReferences.get(original) ?? [];
  entries.push(origin);
  pathReferences.set(original, entries);
}

// Extract provenance only: no source text, math, tests, or image contents are interpreted.
function scan(value, origin, group) {
  if (typeof value === "string") {
    addReference(value, origin);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => scan(item, `${origin}[${index}]`, group));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) {
    if (looksLocal(key)) {
      addReference(key, `${origin}.${key}`);
      if (typeof item === "string" && /^[a-f0-9]{64}$/.test(item)) request(key, item, null, `${origin}.${key}`, group);
      if (item && typeof item === "object" && /^[a-f0-9]{64}$/.test(item.sha256 ?? "")) {
        request(key, item.sha256, item.bytes, `${origin}.${key}`, group);
      }
    }
    if (looksLocal(item)) {
      addReference(item, `${origin}.${key}`);
      let hashKey = key === "path" ? "sha256" : `${key.replace(/_path$/, "")}_sha256`;
      if (key === "before_template") hashKey = "before_sha256";
      if (key === "current_template") hashKey = "current_sha256";
      const hash = value[hashKey];
      if (/^[a-f0-9]{64}$/.test(hash ?? "")) request(item, hash, key === "path" ? value.bytes : null, `${origin}.${key}`, group);
    }
    scan(item, `${origin}.${key}`, group);
  }
}
scan(ledger, fixed.t1Ledger.path, "t1-provenance");
scan(delivery, fixed.platoDelivery.path, "plato-provenance");
scan(provenance, fixed.platoProvenance.path, "plato-provenance");
scan(frozen, fixed.arendtManifest.path, "arendt-provenance");
for (const item of frozen.files.filter((item) => item.path.endsWith(".json"))) {
  const bytes = readRegular(item.path);
  assert.equal(sha(bytes), item.sha256);
  scan(JSON.parse(bytes), relative(item.path), "arendt-provenance");
}
for (const file of ["freeze-manifest.json", "observation-ledger.json", "adjudication-ledger.json"]) {
  scan(parse(`${plato}/${file}`), `${plato}/${file}`, "plato-provenance");
}

const originalStates = new Map();
function originalState(p) {
  if (originalStates.has(p)) return originalStates.get(p);
  let state;
  if (blockedName(p)) state = { status: "LOCAL_ONLY_RUNTIME_ENVIRONMENT_OR_SECRET_NAME_NOT_READ" };
  else if (!inside(p, root)) state = { status: "LOCAL_ONLY_OUTSIDE_WORKSPACE_NOT_READ" };
  else {
    try {
      const stat = noLinks(p);
      if (stat.isDirectory()) state = { status: "LOCAL_ONLY_DIRECTORY_NOT_COPIED" };
      else if (!stat.isFile()) state = { status: "LOCAL_ONLY_NONREGULAR_NOT_COPIED" };
      else {
        const bytes = readRegular(p);
        state = { status: "REGULAR_ORIGINAL_PRESENT", sha256: sha(bytes), bytes: bytes.length };
      }
    } catch (error) {
      if (error.code === "ENOENT") state = { status: "MISSING_ORIGINAL" };
      else if (error.code === "SYMLINK") state = { status: "LOCAL_ONLY_SYMLINK_NOT_FOLLOWED" };
      else throw error;
    }
  }
  originalStates.set(p, state);
  return state;
}

const primaries = [...requests.values()].filter((item) => item.primary);
assert.equal(primaries.filter((item) => item.group === "t1").length, 2);
assert.equal(primaries.filter((item) => item.group === "plato").length, 24);
assert.equal(primaries.filter((item) => item.group === "arendt").length, 228);
const primaryByHash = new Map();
for (const item of primaries) {
  const state = originalState(item.originalPath);
  assert.equal(state.status, "REGULAR_ORIGINAL_PRESENT", `Primary not regular: ${item.originalPath}`);
  assert.equal(state.sha256, item.sha256, `Primary no longer frozen: ${item.originalPath}`);
  if (item.bytes != null) assert.equal(state.bytes, item.bytes);
  item.bytes = state.bytes;
  const peers = primaryByHash.get(item.sha256) ?? [];
  peers.push(item);
  primaryByHash.set(item.sha256, peers);
}

const copied = [];
const mappingByKey = new Map();
const newByHash = new Map();
const verifiedOld = new Map();
function exactOld(item) {
  const key = `${item.originalPath}\n${item.sha256}`;
  const exact = oldByOriginal.get(key) ?? [];
  const candidates = [...exact, ...(oldByHash.get(item.sha256) ?? []).filter((entry) => !exact.includes(entry))];
  for (const candidate of candidates) {
    if (!verifiedOld.has(candidate.path)) {
      const bytes = readRegular(candidate.path);
      assert.equal(sha(bytes), candidate.sha256, `Old retained bytes changed: ${candidate.path}`);
      assert.equal(bytes.length, candidate.bytes);
      verifiedOld.set(candidate.path, candidate);
    }
    if (item.bytes != null && candidate.bytes !== item.bytes) continue;
    return { ...candidate, match: exact.includes(candidate) ? "ORIGINAL_PATH_AND_HASH" : "EXACT_HASH_AND_BYTES" };
  }
  return null;
}

fs.mkdirSync(absolute(archive));
function copyExclusive(source, destination, expected) {
  const bytes = readRegular(source);
  assert.equal(sha(bytes), expected);
  fs.mkdirSync(path.dirname(absolute(destination)), { recursive: true });
  fs.copyFileSync(absolute(source), absolute(destination), fs.constants.COPYFILE_EXCL);
  const saved = readRegular(destination);
  assert.equal(sha(saved), expected);
  assert.equal(saved.length, bytes.length);
  const item = { path: destination, sha256: expected, bytes: saved.length };
  copied.push(item);
  return item;
}

for (const item of [...primaries, ...requests.values()].filter((item, index, all) => all.indexOf(item) === index)) {
  const key = `${item.originalPath}\n${item.sha256}`;
  const state = originalState(item.originalPath);
  const base = {
    ...item,
    original: state,
    originalHashMatchesFrozen: state.sha256 === item.sha256,
    sourcePathProvenanceOnly: true,
    runtimeDependency: false,
    inertHistoricalEvidence: true,
  };
  if (blockedName(item.originalPath)) {
    mappingByKey.set(key, { ...base, action: "LOCAL_ONLY_BLOCKED_NOT_COPIED", retainedPath: null });
    continue;
  }
  const old = exactOld(item);
  if (old) {
    mappingByKey.set(key, {
      ...base, bytes: old.bytes, action: "REUSED_EXACT_OLD_DURABLE_BYTES",
      retainedPath: old.path, retainedSha256: old.sha256,
      priorArchiveManifest: old.archiveManifest, priorArchiveManifestSha256: old.archiveManifestSha256,
      reuseMatch: old.match,
    });
    continue;
  }
  const existing = newByHash.get(item.sha256);
  if (existing) {
    mappingByKey.set(key, {
      ...base, bytes: existing.bytes, action: "REUSED_EXACT_NEW_PACKAGE_BYTES",
      retainedPath: existing.path, retainedSha256: existing.sha256,
    });
    continue;
  }
  const primary = item.primary ? item : primaryByHash.get(item.sha256)?.[0];
  const canCopyT1Reference = item.group === "t1-provenance"
    && state.status === "REGULAR_ORIGINAL_PRESENT" && state.sha256 === item.sha256;
  if (primary || canCopyT1Reference) {
    const source = primary?.originalPath ?? item.originalPath;
    const destination = `${archive}/files/${relative(source)}`;
    const saved = copyExclusive(source, destination, item.sha256);
    newByHash.set(saved.sha256, saved);
    mappingByKey.set(key, {
      ...base, bytes: saved.bytes, action: "EXCLUSIVE_EXACT_BYTE_COPY",
      retainedPath: saved.path, retainedSha256: saved.sha256,
      copiedFrom: relative(source),
    });
  } else {
    mappingByKey.set(key, {
      ...base, action: "LOCAL_ONLY_NO_FROZEN_OR_PRIOR_DURABLE_WITNESS_NOT_COPIED", retainedPath: null,
    });
  }
}

const files = [...mappingByKey.values()].sort((a, b) =>
  `${a.originalPath}\n${a.sha256}`.localeCompare(`${b.originalPath}\n${b.sha256}`));
const unresolved = files.filter((item) => !item.retainedPath);
const missing = files.filter((item) => item.original.status === "MISSING_ORIGINAL");
const changedOriginals = files.filter((item) => item.original.sha256 && !item.originalHashMatchesFrozen);
const unhashed = [...pathReferences.entries()]
  .filter(([p]) => !files.some((item) => item.originalPath === p))
  .map(([originalPath, origins]) => ({ originalPath, origins, original: originalState(originalPath), action: "UNHASHED_PROVENANCE_ONLY_NOT_COPIED" }));

const frozenPaths = new Set(frozen.files.map((item) => absolute(item.path)));
frozenPaths.add(absolute(fixed.arendtManifest.path));
const arendtExcluded = [];
function listUnmanifested(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) listUnmanifested(file);
    else if (!frozenPaths.has(file)) {
      arendtExcluded.push({
        path: relative(file),
        action: "NOT_IN_D47D3F52_MEMBERSHIP_NOT_READ_OR_RETAINED",
        type: entry.isSymbolicLink() ? "symlink-not-followed" : "unmanifested-path",
      });
    }
  }
}
listUnmanifested(absolute(arendt));
const oldAfter = priorBindings.slice(0, 2).map((binding) => tree(path.dirname(binding.path)));
priorTrees.forEach((before, index) => assert.equal(oldAfter[index].treeSha256, before.treeSha256, "Prior archive tree changed"));
for (const binding of priorBindings) bound(binding.path, binding.sha256);
for (const item of primaries) bound(item.originalPath, item.sha256);
for (const item of files.filter((item) => item.retainedPath)) {
  const bytes = readRegular(item.retainedPath);
  assert.equal(sha(bytes), item.sha256);
  assert.equal(bytes.length, item.bytes);
}

const helperBytes = readRegular(helper);
const retainedHelper = copyExclusive(helper, `${archive}/retention-helper.mjs`, sha(helperBytes));
const counts = {
  primaryPayloadMappings: primaries.length,
  primaryT1: 2,
  primaryPlato: 24,
  primaryArendt: 228,
  totalHashMappings: files.length,
  retainedHashMappings: files.filter((item) => item.retainedPath).length,
  reusedOldMappings: files.filter((item) => item.action === "REUSED_EXACT_OLD_DURABLE_BYTES").length,
  reusedNewMappings: files.filter((item) => item.action === "REUSED_EXACT_NEW_PACKAGE_BYTES").length,
  newPayloadFiles: copied.length - 1,
  newPayloadBytes: copied.slice(0, -1).reduce((sum, item) => sum + item.bytes, 0),
  retainedHelperFiles: 1,
  unresolvedHashMappings: unresolved.length,
  missingOriginalHashMappings: missing.length,
  currentOriginalDifferentFromFrozenMappings: changedOriginals.length,
  unhashedProvenancePaths: unhashed.length,
  arendtFilesNotInFrozenManifestNotRetained: arendtExcluded.length,
};
assert.equal(files.filter((item) => item.primary && !item.retainedPath).length, 0);

const retention = {
  schema: "STEMROBIN-184/exact-byte-retention@1",
  status: "RETENTION_ONLY_NO_GATE_OR_PROMOTION",
  retainedAtUtc: new Date().toISOString(),
  archive,
  interpretation: {
    t1: "Accepted text-only T1 closure bytes retained verbatim; no retrospective helper/figure/whole-lesson promotion.",
    plato: "Frozen source-first and observation ledger preserved alongside final report/adjudication ledger; delivery manifest's final H3c retraction is not merged back into frozen observations.",
    arendt: "Only payload membership frozen by d47d3f52, plus its manifest and provenance mappings to those bytes or existing archives. Valid candidate FAIL and pending promotion remain historical states, not new decisions.",
    priorArchives: "47109096 and b4818453 retained unchanged. Their e980611e predecessor provides exact existing byte witnesses.",
  },
  fixedBindings: fixed,
  priorArchives: priorBindings,
  priorArchivePreservation: priorTrees.map((item) => ({
    manifest: item.manifest, treeSha256Before: item.treeSha256,
    treeSha256After: item.treeSha256, files: item.files,
  })),
  counts,
  files,
  missingOriginalPaths: missing,
  localOnlyOriginalHashPaths: unresolved,
  currentOriginalDifferentFromFrozenPaths: changedOriginals,
  unhashedLocalOnlyOriginalPaths: unhashed,
  arendtUnmanifestedPathsNotRetained: arendtExcluded,
  copiedFiles: copied,
  retainedHelper,
  limits: {
    imageDisplays: 0, imageDecodesOrCrops: 0, reviewReruns: 0, testOrCounterRuns: 0,
    finalizeRuns: 0, promotionOrGate: false, symlinkTargetsCopied: 0,
    interpretersOrEnvironmentsCopied: 0, sourceProductTemplatePlanUsageWrites: 0,
    originalPathsAreProvenanceOnly: true,
  },
};
function generated(p, bytes) {
  fs.writeFileSync(absolute(p), bytes, { flag: "wx" });
  return { path: p, sha256: sha(bytes), bytes: Buffer.byteLength(bytes) };
}
const retentionFile = generated(`${archive}/retention.json`, `${JSON.stringify(retention, null, 2)}\n`);
const exceptions = [
  ...missing.map((item) => `- MISSING original: \`${item.originalPath}\` SHA256 \`${item.sha256}\`; retained: \`${item.retainedPath ?? "none"}\`.`),
  ...unresolved.map((item) => `- LOCAL-ONLY hash mapping: \`${item.originalPath}\` SHA256 \`${item.sha256}\`; ${item.action}.`),
  ...changedOriginals.map((item) => `- ORIGINAL differs from frozen: \`${item.originalPath}\`; frozen \`${item.sha256}\`, current \`${item.original.sha256}\`; retained \`${item.retainedPath ?? "none"}\`.`),
  ...unhashed.map((item) => `- LOCAL-ONLY unhashed reference: \`${item.originalPath}\`; ${item.original.status}; not copied.`),
];
const reportText = [
  "# Batch008 Late Text/Source/Counter Retention",
  "",
  "Exact opaque byte retention only. No image display/decoding, review rerun, counter/test/finalize command, gate, or promotion.",
  "",
  `Primary membership: ${counts.primaryPayloadMappings} mappings: T1 2; Plato package 24 (8 root documents/scripts/manifests and 16 crop files); frozen Arendt 228 (227 manifest-listed files plus manifest).`,
  `All hash mappings: ${counts.totalHashMappings}; retained ${counts.retainedHashMappings}; old-byte reuse ${counts.reusedOldMappings}; new-package-byte reuse ${counts.reusedNewMappings}.`,
  `New payload files ${counts.newPayloadFiles}; payload bytes ${counts.newPayloadBytes}; retained helper 1. Generated retention.json, this report and SHA256SUMS.txt are separate archive metadata.`,
  "",
  "The freeze and final H3c retraction remain separate, unchanged records. Arendt membership is bound to d47d3f523e64cb500127cd04e35e29958ba5063a785e5106fa2d005aed0d5fb5; unmanifested files are not included. Existing FAIL/HOLD states are not promoted.",
  "Prior 47109096/b4818453 archive trees are hash-identical before/after. Exact mappings from those archives and their e980611e predecessor are reused without rewriting any old files.",
  "",
  "## Missing and Local-Only Originals",
  "",
  `Missing hash-bound original mappings: ${missing.length}; unresolved hash mappings: ${unresolved.length}; differing-current mappings: ${changedOriginals.length}; unhashed provenance paths: ${unhashed.length}.`,
  ...(exceptions.length ? exceptions : ["None."]),
  "",
  "Every mapping, expected/source/retained SHA256, origin and disposition is listed in retention.json. Absolute original paths in unmodified payloads are provenance, not new runtime dependencies.",
  "No interpreters, environments, secrets, or symlink targets are copied. Original product/source/template/plan/usage files are untouched.",
  "",
  `retention.json SHA256: \`${retentionFile.sha256}\`.`,
  `retention-helper.mjs SHA256: \`${retainedHelper.sha256}\`.`,
  "",
].join("\n");
const reportFile = generated(`${archive}/retention-report.md`, reportText);
const archiveFiles = tree(archive).files.filter((item) => item.sha256);
const sums = archiveFiles.map((item) => `${item.sha256}  ${path.relative(archive, item.path)}`).sort().join("\n") + "\n";
const sumsFile = generated(`${archive}/SHA256SUMS.txt`, sums);
const receipt = {
  schema: "STEMROBIN-184/retention-receipt@1",
  status: "RETENTION_ONLY_NO_GATE_OR_PROMOTION",
  archive,
  counts,
  retentionFile,
  reportFile,
  sumsFile,
  allNewArchiveFileHashes: [...archiveFiles, sumsFile],
  missingOriginalPaths: missing.map((item) => ({ path: item.originalPath, sha256: item.sha256, retainedPath: item.retainedPath })),
  localOnlyOriginalHashPaths: unresolved.map((item) => ({ path: item.originalPath, sha256: item.sha256, action: item.action })),
  unhashedLocalOnlyOriginalPaths: unhashed,
  helper: retainedHelper,
};
generated(scratch, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify({ ...receipt, allNewArchiveFileHashes: undefined, unhashedLocalOnlyOriginalPaths: undefined }, null, 2));
