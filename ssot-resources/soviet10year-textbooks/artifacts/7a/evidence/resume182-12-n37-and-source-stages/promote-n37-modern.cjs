const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const cp = require("node:child_process");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const source = `${base}/n37-source-stage-affected/artifacts/7a/editions/modern-us-neutral`;
const target = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral";
const id = "alg7-c4-s2-n37";
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const ref = (file) => ({ path: file, sha256: hash(file) });
const review = `${base}/n37-modern-review/result.json`;
assert.equal(hash(review), "0559eca31b8af93755519cb6a2d4e8e066e659a46986a031164ad0f9fa299cd2");
assert.equal(read(review).status, "PASS");
assert(!fs.existsSync(`${target}/lessons/${id}`));
const before = read(`${target}/book.json`);
fs.copyFileSync(`${target}/book.json`, `${base}/n37-modern-index-before.json`, fs.constants.COPYFILE_EXCL);
const outputs = [];
const author = read(`${base}/n37-modern-author/result.json`);
for (const name of ["lesson.json", "exercises.json", "figures.json", "adaptation.audit.json"]) {
  const from = `${source}/lessons/${id}/${name}`;
  const to = `${target}/lessons/${id}/${name}`;
  const binding = author.outputs.find((item) => item.path === path.resolve(from));
  assert(binding);
  assert.equal(hash(from), binding.sha256);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(from), hash(to));
  outputs.push(ref(to));
}
const result = cp.spawnSync(".claude/skills/ld-s10y-lesson/.venv/bin/python", [
  `${base}/update-modern-index.py`, `${source}/book.json`, id,
], { cwd: process.cwd(), stdio: "inherit" });
assert.equal(result.status, 0, "existing modern index helper failed");
const current = read(`${target}/book.json`);
assert.deepEqual(current.lessons.filter((item) => item.id !== id), before.lessons);
fs.writeFileSync(`${base}/n37-modern-promotion.json`, `${JSON.stringify({
  review: ref(review), outputs, index: ref(`${target}/book.json`),
  priorIndex: ref(`${base}/n37-modern-index-before.json`),
  priorRowsUnchanged: true, exactOutputBytesReused: true, fullLessonCredit: false,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ id, promotedModern: true, fullLessonCredit: false }));
