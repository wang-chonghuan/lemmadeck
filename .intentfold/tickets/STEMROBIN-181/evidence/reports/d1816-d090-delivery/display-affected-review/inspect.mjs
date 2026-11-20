import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const W = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
const T = ".intentfold/tickets/STEMROBIN-181/tmp";
const OUT = path.join(W, T, "d1816-d098-n128-layout-display-n129-affected-review");
assert.equal(process.cwd(), W);
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const absolute = (p) => path.isAbsolute(p) ? p : path.join(W, p);
const roots = [
  [`${T}/d1816-d090-n128-promotion/layout-display-author-freeze.json`, "3d11a3c96001bc42a1e68bf66951bd80891506f8c026151f2d0853052402f203"],
  [`${T}/d1816-d096-n129-affected-author/author-freeze.json`, "61c6ac947c413c02daac8222d1d81075682192a3069fc24e52293cb8ffd64e84"],
  [`${T}/d1816-d090-n128-display/result.json`],
  [`${T}/d1816-d090-n128-promotion/native-layout-recovery.json`],
  [`${T}/d1816-d096-n129-affected-author/proposed-corrected-text.json`],
  [`${T}/d1816-d096-n129-affected-author/source-bound-registration-decision.json`],
  [`${T}/d1816-d096-n129-affected-author/native-affected-text-validation.json`],
  [`${T}/d1816-d096-n129-affected-author/inherited-counts-failures-stages.json`],
  [`${T}/d1816-d089-n128-first-review/report.json`],
  [`${T}/d1816-d095-affected128-source320321-review/report.json`],
  [`${T}/d1816-d095-affected128-source320321-review/review-freeze.json`],
  [`${T}/d1816-d091-n129-first-review/report.json`],
  [`${T}/d1816-d091-n129-first-review/review-freeze.json`],
];
for (const name of [
  "d090-n128-zh-first-finalize", "d090-n128-en-first-finalize",
  "d090-n128-zh-layout-finalize-recovery", "d090-n128-en-layout-finalize-recovery",
  "d090-n128-zh-first-offline-render", "d090-n128-en-first-offline-render",
  "d090-n128-first-offline-dom",
]) roots.push([`${T}/d1816-recovery/native/${name}/receipt.json`]);
const files = new Map();
const claims = [];
function bind(p, expected, role) {
  const filename = absolute(p);
  assert.ok(filename.startsWith(`${W}/`), filename);
  if (!files.has(filename)) {
    const bytes = fs.readFileSync(filename);
    files.set(filename, {path: filename, sha256: sha(bytes), bytes: bytes.length, roles: []});
  }
  const b = files.get(filename);
  if (!b.roles.includes(role)) b.roles.push(role);
  if (expected) claims.push({path: filename, expectedSha256: expected, actualSha256: b.sha256, exact: expected === b.sha256, role});
  return b;
}
function references(value, role) {
  if (!value || typeof value !== "object") return;
  if (typeof value.path === "string" && /^[0-9a-f]{64}$/.test(value.sha256 || "")) {
    bind(value.path, value.sha256, role);
  }
  for (const child of Object.values(value)) references(child, role);
}
for (const [p, expected] of roots) {
  bind(p, expected, "reviewed evidence");
  references(JSON.parse(fs.readFileSync(absolute(p), "utf8")), p);
}
for (const p of [
  ".intentfold/readme.md", ".intentfold/project.json",
  ".intentfold/charter/product.md", ".intentfold/charter/engineering.md",
  ".intentfold/charter/ui.md", ".intentfold/charter/operations.md",
  ".claude/skills/ld-s10y-lesson/references/production-resume.md",
  ".agents/skills/ld-s10y-image/SKILL.md",
  `${T}/d1816-recovery/native/d061-live181-read/stdout.txt`,
  `${T}/d1816-recovery/native/d061-live179-comments-read/stdout.txt`,
  ".claude/skills/ld-s10y-lesson/tools/htmlfrag.js",
  ".claude/skills/ld-s10y-lesson/tools/prose_flow.mjs",
  `${T}/d1816-recovery/check-d090-n128-offline.mjs`,
]) bind(p, null, "routing and saved authority");
for (const [p] of roots.filter(([p]) => p.endsWith("/receipt.json"))) {
  bind(p.replace("/receipt.json", "/stdout.txt"), null, "saved native evidence");
  bind(p.replace("/receipt.json", "/stderr.txt"), null, "saved native evidence");
}
const stage = process.argv[2] || "start";
const snapshot = {
  reviewer: "D098", stage, workdir: W, capturedAt: new Date().toISOString(),
  inputCount: files.size, claimsCount: claims.length,
  claims, failures: claims.filter((c) => !c.exact), inputs: [...files.values()],
};
if (stage === "end") {
  const before = JSON.parse(fs.readFileSync(path.join(OUT, "inspection-start.json"), "utf8"));
  const supplement = JSON.parse(fs.readFileSync(path.join(OUT, "inspection-supplemental-start.json"), "utf8"));
  const firstBindings = new Map(supplement.inputs.map((b) => [b.path, b]));
  for (const b of before.inputs) firstBindings.set(b.path, b);
  snapshot.beforeAfterBindings = [...firstBindings.values()].map((b) => {
    const a = files.get(b.path);
    return {path: b.path, before: b, after: a, byteIdentical: b.sha256 === a?.sha256 && b.bytes === a?.bytes};
  });
  snapshot.allInputsByteIdentical = snapshot.beforeAfterBindings.every((b) => b.byteIdentical);
}
fs.writeFileSync(path.join(OUT, `inspection-${stage}.json`), `${JSON.stringify(snapshot, null, 2)}\n`, {flag: "wx"});
console.log(JSON.stringify({
  stage, inputCount: snapshot.inputCount, claimsCount: snapshot.claimsCount,
  failures: snapshot.failures, allInputsByteIdentical: snapshot.allInputsByteIdentical,
}, null, 2));
assert.equal(snapshot.failures.length, 0, "frozen binding drift");
if (stage === "end") assert.equal(snapshot.allInputsByteIdentical, true, "input changed during review");
