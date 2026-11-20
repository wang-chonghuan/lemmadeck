import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const outputRoot = path.dirname(fileURLToPath(import.meta.url));
const repo = process.cwd();
const inputRoot = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp");
const phase = process.argv[2];
if (!["before", "after"].includes(phase)) throw new Error("Expected before or after");
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const intakePath = path.join(inputRoot, "source219-FIRST-review-inputs-01/blind-intake.json");
const intakeBytes = fs.readFileSync(intakePath);
const intake = JSON.parse(intakeBytes);
const groups = [
  {
    name: "source219",
    document: intake.afterAllOriginalFIRSTsSealed.path,
    expectedDocumentSha256: intake.afterAllOriginalFIRSTsSealed.sha256,
    expectedCount: 20
  },
  {
    name: "supplement215216",
    document: path.join(inputRoot, "source219-FIRST-review-inputs-01/after-FIRST-metadata-affected-supplement.json"),
    expectedDocumentSha256: null,
    expectedCount: 37
  }
];
const supplement = JSON.parse(fs.readFileSync(groups[1].document));
groups.push({
  name: "affected215216",
  document: supplement.affectedManifest.path,
  expectedDocumentSha256: supplement.affectedManifest.sha256,
  expectedCount: 33
});
for (const group of groups) {
  const bytes = fs.readFileSync(group.document);
  const manifest = JSON.parse(bytes);
  const documentSha256 = hash(bytes);
  const bindings = manifest.bindings.map((binding, i) => {
    const boundBytes = fs.readFileSync(binding.path);
    const stat = fs.statSync(binding.path);
    const actualSha256 = hash(boundBytes);
    return {
      ordinal: i + 1,
      path: binding.path,
      expectedSha256: binding.sha256,
      actualSha256,
      bytes: boundBytes.length,
      mode: (stat.mode & 0o777).toString(8).padStart(4, "0"),
      match: actualSha256 === binding.sha256
    };
  });
  const result = {
    schema: "stemrobin188-review-binding-ledger@1",
    phase,
    group: group.name,
    scope: "byte hashes and file metadata only; not a native, source, render or formal check",
    document: {
      path: group.document,
      sha256: documentSha256,
      bytes: bytes.length,
      expectedSha256: group.expectedDocumentSha256,
      expectedHashMatch: group.expectedDocumentSha256 === null || documentSha256 === group.expectedDocumentSha256,
      unanchoredSupplement: group.expectedDocumentSha256 === null
    },
    intake: { path: intakePath, sha256: hash(intakeBytes), bytes: intakeBytes.length },
    expectedCount: group.expectedCount,
    actualCount: bindings.length,
    bindings,
    pass: bindings.length === group.expectedCount &&
      (group.expectedDocumentSha256 === null || documentSha256 === group.expectedDocumentSha256) &&
      bindings.every((binding) => binding.match)
  };
  if (phase === "after") {
    const before = JSON.parse(fs.readFileSync(path.join(outputRoot, `bindings-${group.name}-before.json`)));
    result.documentUnchangedFromBefore = before.document.sha256 === documentSha256;
    result.bindingsUnchangedFromBefore = bindings.length === before.bindings.length &&
      bindings.every((binding, i) => binding.path === before.bindings[i].path &&
        binding.actualSha256 === before.bindings[i].actualSha256 &&
        binding.bytes === before.bindings[i].bytes &&
        binding.mode === before.bindings[i].mode);
    result.pass &&= result.documentUnchangedFromBefore && result.bindingsUnchangedFromBefore;
  }
  fs.writeFileSync(path.join(outputRoot, `bindings-${group.name}-${phase}.json`), JSON.stringify(result, null, 2) + "\n", { flag: "wx" });
  console.log(JSON.stringify({ group: group.name, phase, count: result.actualCount, pass: result.pass, documentSha256 }));
  if (!result.pass) process.exitCode = 1;
}
