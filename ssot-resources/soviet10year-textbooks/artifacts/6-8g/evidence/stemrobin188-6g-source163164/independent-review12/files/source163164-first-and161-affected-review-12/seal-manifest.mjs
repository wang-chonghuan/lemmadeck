import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const owned = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/source163164-first-and161-affected-review-12");
assert.equal(process.cwd(), repo);
const sha256 = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const entry = (file, purposes) => ({
  path: file,
  sha256: sha256(file),
  bytes: fs.statSync(file).size,
  mode: `0${(fs.statSync(file).mode & 0o777).toString(8)}`,
  purposes,
  use: "new-review-evidence",
});
const file = path.join(owned, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(file, "utf8"));
const receipt = JSON.parse(fs.readFileSync(path.join(owned, "first-freeze-receipt.json"), "utf8"));
for (const frozen of receipt.lockedFiles) {
  assert.equal(sha256(frozen.path), frozen.sha256);
  assert.equal(fs.statSync(frozen.path).mode & 0o777, 0o444);
}
const report = JSON.parse(fs.readFileSync(path.join(owned, "report.json"), "utf8"));
assert.equal(report.scopeA.defects.length, 5);
assert.equal(report.scopeB.page161RevisionUsed, 1);
assert.equal(report.counters.freshReviewerChargedAttempts, 4);
assert.deepEqual(report.activeExecSessions, []);
for (const name of ["report.json", "REPORT.md", "verification-command.receipt.json", "affected161-markdown-audit.receipt.json", "seal-manifest.mjs"]) {
  manifest.newEvidence.push(entry(path.join(owned, name), ["final focused review evidence"]));
}
manifest.guidanceReferences = [
  path.join(repo, "AGENTS.md"),
  path.join(repo, ".intentfold/readme.md"),
  path.join(repo, ".intentfold/charter/engineering.md"),
  path.join(repo, ".claude/skills/ld-s10y-lesson/SKILL.md"),
  path.join(repo, ".claude/skills/ld-s10y-lesson/references/production-resume.md"),
  path.join(repo, ".agents/skills/ld-s10y-image/SKILL.md"),
  "/Users/yong/.agents/skills/intentfold/SKILL.md",
].map((file) => ({ path: file, sha256: sha256(file), use: "read-only local instructions" }));
manifest.status = report.status;
manifest.firstFreezeStillMode0444AndHashUnchanged = true;
manifest.verificationCommandExit = 0;
manifest.finalSealCommand = { command: "node", argv: [path.join(owned, "seal-manifest.mjs")], cwd: repo };
manifest.activeExecSessions = [];
fs.writeFileSync(file, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({
  status: report.status,
  sourceFIRSTUnchanged: true,
  sourceFIRSTMode: "0444",
  reportsAndEvidence: ["report.json", "REPORT.md", "FIRST.md", "inventory.json", "first-freeze-receipt.json", "verification.json", "verification-command.receipt.json", "manifest.json"].map((name) => ({ path: path.join(owned, name), sha256: sha256(path.join(owned, name)) })),
  counters: { chargedAttempts: 4, limit: 8, contextImages: 4, contextLimit: 24, parent: "24/24", failedImageRequests: 0, sourceCandidateRevisions: 0, page161RevisionRetained: 1 },
  activeExecSessions: [],
}, null, 2));
