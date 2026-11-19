const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const author = `${base}/n43-choice-author`;
const reviewer = `${base}/n43-choice-review`;
const output = `${base}/n43-choice-path-bound`;
const stable = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s3-n43/choice-set/evidence";
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: sha(file) });
const original = read(`${reviewer}/review.json`);
assert.equal(original.outcome, "pass");
assert.equal(sha(`${reviewer}/review.json`), "f4aa18ed0bf7fb61e7ed91d90113eba26157fbdf8c5f0e9620c62387ab6aab50");
assert.equal(read(`${author}/draft.json`).new_figures.length, 0);
assert(!fs.existsSync(output));
fs.mkdirSync(output);
const records = [];
for (const name of ["source-solutions.json", "view-review.json", "every-option-true-sets.json",
  "stage2-freeze-receipt.json", "review.json"]) {
  const source = `${reviewer}/${name}`;
  const destination = `${stable}/${name.replace(/\.json$/, ".record")}`;
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
  assert.equal(sha(source), sha(destination));
  records.push({ original: ref(source), retained: ref(destination) });
}
const bind = value => {
  if (Array.isArray(value)) return value.map(bind);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, bind(item)]));
  }
  if (typeof value !== "string") return value;
  for (const record of records) {
    value = value.replaceAll(path.join(cwd, record.original.path), record.retained.path);
  }
  return value;
};
const bound = bind(original);
assert.equal(bound.seed_sha256, original.seed_sha256);
assert.equal(bound.draft_sha256, original.draft_sha256);
for (const name of ["seed.json", "draft.json"]) {
  fs.copyFileSync(`${author}/${name}`, `${output}/${name}`, fs.constants.COPYFILE_EXCL);
  assert.equal(sha(`${author}/${name}`), sha(`${output}/${name}`));
}
fs.writeFileSync(`${output}/review.inherited.json`, `${JSON.stringify(bound, null, 2)}\n`, { flag: "wx" });
fs.writeFileSync(`${base}/n43-choice-evidence-binding.json`, `${JSON.stringify({
  originalReview: ref(`${reviewer}/review.json`), boundReview: ref(`${output}/review.inherited.json`),
  records, seedAndDraftBytesUnchanged: true,
  onlyRetainedEvidencePathsChanged: true, imagesOpened: 0,
  independentBindingPending: true,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ boundEvidenceFiles: records.length, output }));
