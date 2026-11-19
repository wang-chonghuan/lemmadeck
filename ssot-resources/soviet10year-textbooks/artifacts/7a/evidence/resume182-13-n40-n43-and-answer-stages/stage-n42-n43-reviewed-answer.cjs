const fs = require("node:fs");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const id = process.argv[2];
assert(["alg7-c4-s3-n42", "alg7-c4-s3-n43"].includes(id));
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const summaryPath = `${base}/n42-n43-answer-review/stage2-summary.json`;
const summary = read(summaryPath);
assert.equal(summary.status, "PASS");
assert.equal(summary.perLesson.find(row => row.lesson === id).status, "PASS");
const binding = summary.comparisonInputs.find(row => row.lesson === id);
assert.equal(sha(binding.author.path), binding.author.sha256);
const targetDir = `ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/${id}`;
const current = read(`${targetDir}/exercises.json`);
assert.equal(sha(binding.exerciseSourceBinding.path), binding.exerciseSourceBinding.sha256);
const reviewed = JSON.parse(cp.execFileSync(".claude/skills/ld-s10y-lesson/.venv/bin/python", [
  "-B", "-c",
  "import sys,json; sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools'); import edition; d=json.load(open(sys.argv[1],encoding='utf-8')); edition.normalize_exercise_layout(d); print(json.dumps(d,ensure_ascii=False))",
  binding.exerciseSourceBinding.path,
], { encoding: "utf8" }));
const project = doc => doc.exercises.map(row => ({ number: row.number, text: row.text, pages: row.pages }));
assert.deepEqual(project(current), project(reviewed));
const target = `${targetDir}/answer-keys.json`;
assert(!fs.existsSync(target));
fs.copyFileSync(binding.author.path, target, fs.constants.COPYFILE_EXCL);
fs.chmodSync(target, 0o644);
assert.equal(sha(target), binding.author.sha256);
fs.writeFileSync(`${base}/${id}-answer-stage.json`, `${JSON.stringify({
  lesson: id, candidate: binding.author,
  target: { path: target, sha256: sha(target) },
  review: { path: summaryPath, sha256: sha(summaryPath) },
  exerciseOutput: { path: `${targetDir}/exercises.json`, sha256: sha(`${targetDir}/exercises.json`) },
  exerciseContentUnchanged: true, finalizePending: true,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ stagedReviewedAnswer: id }));
