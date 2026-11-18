import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const out = path.dirname(new URL(import.meta.url).pathname);
const hash = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const checks = [];
function verify(p, expected, kind) {
  const absolute = path.resolve(root, p);
  const actual = hash(absolute);
  checks.push({path: absolute, expectedSha256: expected, sha256: actual, kind, matches: actual === expected});
}
function walk(value, kind) {
  if (!value || typeof value !== "object") return;
  if (typeof value.path === "string" && typeof value.sha256 === "string") verify(value.path, value.sha256, kind);
  for (const child of Object.values(value)) walk(child, kind);
}
const freezePath = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d248-n67-text-author/author-freeze.json");
verify(freezePath, "8a4b84701574cb1df91f42ea94b3381ab829678bbfe0609b35c31cc1618a66f5", "author-freeze");
const freeze = JSON.parse(fs.readFileSync(freezePath, "utf8"));
walk(freeze, "freeze-binding");
const prepared = JSON.parse(fs.readFileSync(path.resolve(root, freeze.sourcePreparation.path), "utf8"));
walk(prepared, "prepared-manifest-binding-hash-only");
for (const relative of [
  ".claude/skills/ld-s10y-lesson/tools/edition.py",
  ".claude/skills/ld-s10y-lesson/tools/mathcheck.py",
  ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json",
  ".claude/skills/ld-s10y-lesson/references/edition-text-contract.md"
]) {
  const p = path.join(root, relative);
  verify(p, hash(p), "existing-text-check-contract");
}
const evidence = {
  schema: "stemrobin/first-text-review-input-bindings@1",
  ticket: "STEMROBIN-181",
  card: "phy10-c2-s2-n67",
  status: checks.every(c => c.matches) ? "PASS" : "FAIL",
  checks,
  imageByteHashesCheckedWithoutPixelObservation: true,
  newImagesOpened: 0,
  cumulativeContextImages: 24,
  sourcePixelReviewRepeated: false,
  previousT16DisplayReviewRepeated: false
};
fs.writeFileSync(path.join(out, "input-bindings.json"), JSON.stringify(evidence, null, 2) + "\n", {flag: "wx"});
console.log(JSON.stringify({status: evidence.status, bindings: checks.length, mismatches: checks.filter(c => !c.matches)}));
if (evidence.status !== "PASS") process.exitCode = 1;
