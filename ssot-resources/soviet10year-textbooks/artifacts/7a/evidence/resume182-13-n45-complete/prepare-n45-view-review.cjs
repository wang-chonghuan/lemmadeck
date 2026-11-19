const fs = require("node:fs");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const author = `${base}/n45-choice-author`;
const review = `${base}/n45-choice-review`;
assert.equal(hash(`${author}/seed.json`), hash(`${review}/seed-source-only.json`));
const draft = JSON.parse(fs.readFileSync(`${author}/draft.json`, "utf8"));
const view = {
  lesson: "alg7-c4-s3-n45",
  questions: draft.questions.map(question => ({ id: question.id, mode: question.mode, view: question.view })),
};
assert.equal(view.questions.length, 48);
const file = `${review}/view-only.json`;
fs.writeFileSync(file, `${JSON.stringify(view, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(file, 0o444);
fs.writeFileSync(`${base}/n45-choice-view-binding.json`, `${JSON.stringify({
  seed: { path: `${author}/seed.json`, sha256: hash(`${author}/seed.json`) },
  draft: { path: `${author}/draft.json`, sha256: hash(`${author}/draft.json`) },
  view: { path: file, sha256: hash(file) },
  authorKeysOrSolutionsDisclosed: false,
  questions: view.questions.length,
  options: view.questions.reduce((count, question) => count + question.view.options.length, 0),
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ prepared: file, questions: view.questions.length }));
