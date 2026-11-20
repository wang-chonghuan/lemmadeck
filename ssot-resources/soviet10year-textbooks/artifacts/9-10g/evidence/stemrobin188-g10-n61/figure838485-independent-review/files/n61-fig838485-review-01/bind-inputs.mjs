import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const root = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n61-fig838485-review-01");
const stage = process.argv[2];
if (!["before", "after"].includes(stage)) throw new Error("Expected before or after");
const intakePath = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n61-fig838485-review-inputs-01/blind-intake.json");
const intake = JSON.parse(fs.readFileSync(intakePath, "utf8"));
const manifestPath = intake.afterAllOriginalFIRSTsSealed.path;
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const imageAllowlist = new Set(manifest.figures.flatMap(f => [f.source.sourceImage.path, f.snapshot.path]));
const files = new Map([[intakePath, null], [manifestPath, intake.afterAllOriginalFIRSTsSealed.sha256]]);
const excluded = [];
for (const b of manifest.bindings) {
  if (b.path.includes("fig-g10-86") || /\/(?:fig86-|prepare-fig86)/.test(b.path)) {
    excluded.push({ ...b, reason: "figure86-state-only; bytes not opened" });
  } else if (/\.(png|jpe?g|webp)$/i.test(b.path) && !imageAllowlist.has(b.path)) {
    excluded.push({ ...b, reason: "failed/noncurrent image; bytes not opened" });
  } else {
    files.set(b.path, b.sha256);
  }
}
for (const f of manifest.figures) {
  for (const b of [f.source.sourceImage, f.source.context, f.spec, f.render, f.svg, f.snapshot]) {
    files.set(b.path, b.sha256);
  }
}
for (const relative of [
  ".intentfold/readme.md",
  ".intentfold/charter/engineering.md",
  ".intentfold/charter/operations.md",
  ".agents/skills/ld-s10y-image/SKILL.md",
  ".agents/skills/ld-s10y-image/references/routing.md",
  ".agents/skills/ld-s10y-image/references/figure-spec.md",
  ".agents/skills/ld-s10y-image/references/quality-gate.md",
  ".claude/skills/ld-s10y-lesson/references/production-resume.md"
]) files.set(path.join(repo, relative), null);
const digest = b => crypto.createHash("sha256").update(b).digest("hex");
const entries = [...files].sort(([a], [b]) => a.localeCompare(b)).map(([p, expected]) => {
  const b = fs.readFileSync(p);
  const actual = digest(b);
  return { path: p, sha256: actual, bytes: b.length, actualMode: (fs.statSync(p).mode & 0o777).toString(8).padStart(4, "0"), expectedSha256: expected, matchesExpected: expected === null || actual === expected };
});
const firsts = [83, 84, 85].map(n => {
  const p = path.join(root, `figure${n}-FIRST.json`);
  const b = fs.readFileSync(p);
  return { path: path.relative(root, p), sha256: digest(b), bytes: b.length, actualMode: (fs.statSync(p).mode & 0o777).toString(8).padStart(4, "0") };
});
let changes = [];
if (stage === "after") {
  const before = JSON.parse(fs.readFileSync(path.join(root, "inputs-before.json"), "utf8"));
  const prior = new Map(before.entries.map(e => [e.path, e]));
  changes = entries.filter(e => !prior.has(e.path) || prior.get(e.path).sha256 !== e.sha256 || prior.get(e.path).bytes !== e.bytes || prior.get(e.path).actualMode !== e.actualMode);
  changes.push(...firsts.filter(e => {
    const old = before.FIRSTs.find(x => x.path === e.path);
    return !old || old.sha256 !== e.sha256 || old.actualMode !== e.actualMode;
  }));
}
const result = {
  schema: "bounded-review-input-binding@1",
  stage,
  observedAt: new Date().toISOString(),
  entries,
  excluded,
  FIRSTs: firsts,
  mismatches: entries.filter(e => !e.matchesExpected),
  changes,
  status: entries.every(e => e.matchesExpected) && changes.length === 0 && firsts.every(e => e.actualMode === "0444") ? "PASS" : "FAIL",
  imageHashReadsAreNotVisualReopens: true,
  figure86ArtifactsAndFailedImagesNotRead: true
};
const output = path.join(root, `inputs-${stage}.json`);
fs.writeFileSync(output, JSON.stringify(result, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ output, status: result.status, files: entries.length, exclusions: excluded.length, mismatches: result.mismatches, changes, FIRSTs: firsts }, null, 2));
if (result.status !== "PASS") process.exitCode = 1;
