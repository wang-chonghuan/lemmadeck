const fs = require("node:fs");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const [name, ...stages] = process.argv.slice(2);
assert(name && stages.length);
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const hash = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const ref = (p) => ({ path: p, sha256: hash(p) });
const current = new Map();
const inherited = [];
for (const stage of stages) {
  const dir = `${base}/display/${stage}`;
  const result = read(`${dir}/result.json`);
  const visual = read(`${dir}/visual-review.json`);
  assert.equal(result.status, "pass");
  assert(["pass", "revise"].includes(visual.status));
  const observations = (visual.screenshots || visual.surfaces || []).map((v) =>
    ({ ...v, path: v.path || v.screenshot?.path, sha256: v.sha256 || v.screenshot?.sha256 }));
  assert(observations.length);
  inherited.push({ stage, mechanical: ref(`${dir}/result.json`),
    visual: ref(`${dir}/visual-review.json`), originalVisualStatus: visual.status });
  for (const check of result.checks) {
    const id = `${check.surface}-${check.viewport.width}`;
    const verdict = observations.find((s) =>
      s.path === check.screenshot.path || s.id === id);
    assert(verdict, `${stage}: missing screenshot verdict ${id}`);
    assert.equal(verdict.sha256, check.screenshot.sha256);
    assert.equal(hash(check.screenshot.path), check.screenshot.sha256);
    assert.equal(hash(check.html.path), check.html.sha256);
    if (verdict.status === "pass") current.set(id, { check, stage, verdict });
    else current.delete(id);
  }
}
assert.equal(current.size, 6);
const lessonIds = new Set([...current.values()].map((v) => v.check.lesson));
assert.equal(lessonIds.size, 1);
for (const surface of ["text", "exercises", "choices"]) {
  for (const width of [1440, 390]) assert(current.has(`${surface}-${width}`));
}
const out = `${base}/display-current/${name}`;
assert(!fs.existsSync(out));
fs.mkdirSync(out, { recursive: true });
const save = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
save(`${out}/result.json`, {
  status: "pass", checks: [...current.values()].map((v) => v.check),
  method: "Hash-bound union of original and affected-only passing checks, not a repeated browser run.",
  inherited, newBrowserRuns: 0, newImageOpens: 0,
});
save(`${out}/visual-review.json`, {
  status: "pass", lesson: [...lessonIds][0],
  method: "Six current static displays, inheriting each independent screenshot verdict by hash.",
  screenshots: [...current.values()].map((v) => ({ ...v.verdict, inheritedFromStage: v.stage })),
  inherited, originalFailuresPreserved: true, newImageOpens: 0,
  scope: "Offline static composition only; inherited source, mathematics and figure-label scopes remain limited to their original reviews.",
});
console.log(JSON.stringify({ name, status: "pass", currentSurfaces: current.size, stages, output: out }));
