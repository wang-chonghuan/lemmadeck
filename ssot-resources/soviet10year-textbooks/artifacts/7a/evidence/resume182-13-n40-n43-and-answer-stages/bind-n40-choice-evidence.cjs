const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const author = `${base}/n40-choice-affected-author/RECOVERY-BINDING`;
const reviewer = process.argv[2];
assert.equal(path.resolve(reviewer), path.resolve(`${base}/n40-choice-review`));
const output = `${base}/n40-choice-path-bound`;
const stable = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n40/choice-set/evidence";
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: sha(file) });
const digest = file => cp.execFileSync(".claude/skills/ld-s10y-lesson/.venv/bin/python", [
  ".agents/skills/ld-s10y-choice/scripts/prepare.py", "digest", file,
], { encoding: "utf8" }).trim();
const original = read(`${reviewer}/review.json`);
assert.equal(original.outcome, "pass");
assert.equal(original.seed_sha256, digest(`${author}/seed.json`));
assert.equal(original.draft_sha256, digest(`${author}/draft.json`));
const draft = read(`${author}/draft.json`);
assert.equal(draft.new_figures.length, 0);
assert.equal(draft.questions.length, 20);
assert.equal(draft.questions.reduce((n, q) => n + q.view.options.length, 0), 84);
assert(!fs.existsSync(output));
const records = [];
const copy = (source, name) => {
  const retained = `${stable}/${name.replace(/\.json$/, ".record")}`;
  fs.mkdirSync(path.dirname(retained), { recursive: true });
  fs.copyFileSync(source, retained, fs.constants.COPYFILE_EXCL);
  assert.equal(sha(source), sha(retained));
  records.push({ original: ref(source), retained: ref(retained) });
};
const collect = folder => {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = `${folder}/${entry.name}`;
    if (entry.isDirectory()) collect(file);
    else if (entry.isFile() && /\.(json|md|sha256)$/.test(file)) {
      copy(file, `affected-review/${path.relative(reviewer, file)}`);
    }
  }
};
collect(reviewer);
assert.equal(read(`${reviewer}/review-FIRST.json`).outcome, "blocked");
for (const name of ["source-provenance.json", "reviewer-views.json", "preservation-receipt.json",
  "recovery-receipt.json"]) copy(`${author}/${name}`, name);
const bind = value => {
  if (Array.isArray(value)) return value.map(bind);
  if (value && typeof value === "object") return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, bind(item)]));
  if (typeof value !== "string") return value;
  for (const row of records) {
    value = value.replaceAll(path.join(cwd, row.original.path), row.retained.path);
    value = value.replaceAll(row.original.path, row.retained.path);
  }
  return value;
};
fs.mkdirSync(output);
for (const name of ["seed.json", "draft.json"]) {
  fs.copyFileSync(`${author}/${name}`, `${output}/${name}`, fs.constants.COPYFILE_EXCL);
  assert.equal(sha(`${author}/${name}`), sha(`${output}/${name}`));
}
fs.writeFileSync(`${output}/review.inherited.json`, `${JSON.stringify(bind(original), null, 2)}\n`, { flag: "wx" });
fs.writeFileSync(`${base}/n40-choice-evidence-binding.json`, `${JSON.stringify({
  originalReview: ref(`${reviewer}/review.json`),
  candidate: ["seed.json", "draft.json", "review.inherited.json"].map(name => ref(`${output}/${name}`)),
  records, seedAndDraftBytesUnchanged: true, onlyCitationPathsChanged: true,
  inheritedFIRST17Approvals: true, affectedQuestions: 3, imagesOpened: 0,
  independentPathBindingPending: true,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ retainedEvidenceFiles: records.length, output }));
