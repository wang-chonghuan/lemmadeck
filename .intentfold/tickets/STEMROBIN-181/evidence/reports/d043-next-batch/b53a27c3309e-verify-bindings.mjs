import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const evidence = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.dirname(evidence);
const workspace = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const author = path.join(tmp, "d042-10p-n36-author");
const freezePath = path.join(author, "complete/author-freeze.json");
const expectedFreeze = "9aa558e9044043d45890bf9bfb7a9f7c5df81176490669f8eb3d154c2eb0e0bf";
const phase = process.argv[2];
if (!["before", "after"].includes(phase)) throw new Error("Use before or after.");
const digest = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const freeze = read(freezePath);
const bindings = new Map();
const conflicts = [];
function add(binding, category) {
  const p = path.resolve(workspace, binding.path);
  if (!/\.(json|md|mjs|py|js|txt)$/.test(p)) throw new Error(`Non-text binding: ${p}`);
  const existing = bindings.get(p);
  if (existing && existing.expectedSha256 !== binding.sha256) {
    conflicts.push({ path: p, first: existing.expectedSha256, second: binding.sha256 });
    return;
  }
  if (existing) existing.categories.push(category);
  else bindings.set(p, { path: p, expectedSha256: binding.sha256, categories: [category] });
}
add({ path: freezePath, sha256: expectedFreeze }, "author-freeze");
add(freeze.initialHold, "immutable-initial-HOLD");
for (const key of ["protectedHistory", "raw3", "frozenFiles", "authorSources"]) {
  for (const b of freeze[key]) add(b, key);
}
for (const b of freeze.inputSnapshots) add(b.snapshot, "frozen-input-snapshot");
for (const b of freeze.preparedBindings) add(b.snapshot, "pre-author-prepared-snapshot");
for (const key of ["sourceClosure", "historicalBindings", "textChecks"]) add(freeze[key], key);
for (const l of freeze.languages) {
  for (const b of l.templates) add(b, `${l.language}-current-template`);
  for (const key of ["markdown", "questionDisplay", "displayTitle"]) add(l[key], `${l.language}-${key}`);
}
const closure = read(freeze.sourceClosure.path);
for (const b of closure.sourceReports) add(b, "consumed-source-authority");
for (const n of [95, 101, 102, 103, 104]) {
  for (const suffix of ["json", "md"]) {
    const p = path.join(workspace, `ssot-resources/soviet10year-textbooks/artifacts/10p/pages/${String(n).padStart(4, "0")}/page.${suffix}`);
    const snapshot = freeze.inputSnapshots.find((b) => b.original.path === p);
    if (snapshot) add(snapshot.original, "canonical-bound-source-text");
    else {
      const authority = read(closure.sourceReports[0].path);
      const b = authority.outputs.find((b) => path.resolve(workspace, b.path) === p);
      if (b) add(b, "canonical-convention-source-authority");
      else add({ path: p, sha256: digest(p) }, "canonical-boundary-text-baseline");
    }
  }
}
const files = [...bindings.values()].sort((a, b) => a.path.localeCompare(b.path)).map((b) => {
  try {
    const actualSha256 = digest(b.path);
    return { ...b, actualSha256, matches: actualSha256 === b.expectedSha256 };
  } catch (error) {
    return { ...b, matches: false, error: error.code || error.message };
  }
});
const mismatches = files.filter((b) => !b.matches);
const result = {
  schema: "ld-s10y-lesson/text-only-review-binding-verification@1",
  phase,
  verifiedAt: new Date().toISOString(),
  freeze: files.find((b) => b.path === freezePath),
  distinctFiles: files.length,
  matchedFiles: files.filter((b) => b.matches).length,
  conflicts,
  mismatches,
  initialHoldStatus: read(freeze.initialHold.path).status,
  initialHoldUnchanged: files.find((b) => b.path === freeze.initialHold.path).matches,
  preparedOriginalInterpretation: "preparedBindings.original records pre-author template hashes, not current frozen-template expectations; verify the prepared snapshot and current language template separately.",
  imagesOpened: 0,
  files,
};
if (phase === "after") {
  const before = read(path.join(evidence, "bindings-before.json"));
  const old = new Map(before.files.map((b) => [b.path, b.actualSha256]));
  result.changedSinceBefore = files.filter((b) => old.get(b.path) !== b.actualSha256).map((b) => b.path);
  result.sameBoundPathSet = before.files.length === files.length && files.every((b) => old.has(b.path));
}
result.status = conflicts.length || mismatches.length || result.changedSinceBefore?.length || result.sameBoundPathSet === false ? "FAIL" : "PASS";
fs.writeFileSync(path.join(evidence, `bindings-${phase}.json`), JSON.stringify(result, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({
  phase, status: result.status, distinctFiles: files.length, matchedFiles: result.matchedFiles,
  conflicts, mismatches, changedSinceBefore: result.changedSinceBefore,
  initialHoldUnchanged: result.initialHoldUnchanged, freezeSha256: result.freeze.actualSha256,
}, null, 2));
if (result.status !== "PASS") process.exitCode = 1;
