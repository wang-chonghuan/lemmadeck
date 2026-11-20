import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const hash = (b) => crypto.createHash("sha256").update(b).digest("hex");
const readJSON = (name) => JSON.parse(fs.readFileSync(path.join(root, name)));
const seals = readJSON("FIRST-seals.json");
const checks = [];
for (const seal of seals.sealedFIRSTs) {
  const file = path.join(root, seal.path);
  const bytes = fs.readFileSync(file);
  const mode = fs.statSync(file).mode & 0o777;
  checks.push({
    check: "immutable FIRST seal",
    file: seal.path,
    pass: hash(bytes) === seal.sha256 && bytes.length === seal.bytes && mode === 0o444
  });
}
const verdict = readJSON("verdict219-FIRST.json");
checks.push({
  check: "FIRST-seals document hash and mode",
  pass: hash(fs.readFileSync(path.join(root, "FIRST-seals.json"))) === verdict.FIRST.sealsSha256 &&
    (fs.statSync(path.join(root, "FIRST-seals.json")).mode & 0o777) === 0o444
});
for (const group of ["source219", "supplement215216", "affected215216"]) {
  for (const phase of ["before", "after"]) {
    const name = `bindings-${group}-${phase}.json`;
    const ledger = readJSON(name);
    checks.push({ check: "binding ledger", file: name, pass: ledger.pass === true });
  }
}
checks.push({ check: "corrected isolated metadata diffs", pass: readJSON("metadata-affected-diffs-corrected.json").pass === true });
checks.push({ check: "failed first comparison preserved", pass: readJSON("metadata-affected-diffs.json").pass === false });
const images = readJSON("image-ledger.json");
checks.push({
  check: "bounded image ledger",
  pass: images.loads.length === 6 &&
    images.totals.currentContext <= images.limits.context &&
    images.totals.currentBatch <= images.limits.batch &&
    images.totals.source215216VisualLoads === 0
});
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const p = path.join(dir, entry.name);
  if (entry.isSymbolicLink()) throw new Error("Unexpected symlink in owned output");
  if (entry.isDirectory()) return walk(p);
  if (!entry.isFile()) throw new Error("Unexpected non-file output");
  return [p];
});
for (const file of walk(root)) {
  if (file.endsWith(".json")) JSON.parse(fs.readFileSync(file, "utf8"));
}
if (checks.some((c) => !c.pass)) throw new Error(JSON.stringify(checks.filter((c) => !c.pass)));
const readiness = {
  schema: "stemrobin188-review-output-collection-readiness@1",
  status: "SEALED-READY-FOR-PARENT-COLLECT-THEN-CLOSE",
  scope: "Owned output integrity only; not a product formal check, source approval or invocation closure",
  checks,
  allChecksPass: true,
  parentCollectAndCloseBeforeReadingOutputs: true
};
fs.writeFileSync(path.join(root, "collection-readiness.json"), JSON.stringify(readiness, null, 2) + "\n", { flag: "wx" });
const excluded = new Set(["output-index.json", "output-index.sha256"]);
const outputs = walk(root)
  .filter((p) => !excluded.has(path.relative(root, p)))
  .map((p) => {
    const bytes = fs.readFileSync(p);
    return { path: path.relative(root, p).split(path.sep).join("/"), sha256: hash(bytes), bytes: bytes.length };
  })
  .sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
const index = {
  schema: "stemrobin188-owned-review-output-index@1",
  ticket: "STEMROBIN-188",
  assignment: "SAME188-6",
  outputRoot: root,
  outputCount: outputs.length,
  outputs,
  selfExcluded: "output-index.json",
  externalIndexSeal: "output-index.sha256",
  externalSealNotIndexed: "The separate seal derives from this index; excluding it avoids a circular hash.",
  parentMustCollectAndCloseBeforeReadingOutputs: true
};
const indexBytes = Buffer.from(JSON.stringify(index, null, 2) + "\n");
const indexHash = hash(indexBytes);
fs.writeFileSync(path.join(root, "output-index.json"), indexBytes, { flag: "wx" });
for (const entry of outputs) {
  const bytes = fs.readFileSync(path.join(root, entry.path));
  if (hash(bytes) !== entry.sha256 || bytes.length !== entry.bytes) throw new Error(`Output drift: ${entry.path}`);
}
fs.writeFileSync(path.join(root, "output-index.sha256"), `${indexHash}  output-index.json\n`, { flag: "wx" });
for (const file of walk(root)) fs.chmodSync(file, 0o444);
const actualHash = hash(fs.readFileSync(path.join(root, "output-index.json")));
if (actualHash !== indexHash) throw new Error("Index changed during sealing");
console.log(JSON.stringify({
  status: readiness.status,
  outputRoot: root,
  outputs: outputs.length,
  outputIndexSha256: actualHash,
  externalSeal: path.join(root, "output-index.sha256"),
  allOwnedOutputsMode: "0444"
}, null, 2));
