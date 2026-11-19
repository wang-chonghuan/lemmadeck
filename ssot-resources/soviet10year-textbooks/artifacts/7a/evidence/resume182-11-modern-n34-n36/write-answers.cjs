const fs = require("node:fs");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const [name, lesson] = process.argv.slice(2);
const prepared = `${base}/answer-prepare/7a/modern-us-neutral/lessons/${lesson}/answer-keys.template.json`;
const document = JSON.parse(fs.readFileSync(prepared, "utf8"));
const candidates = new Map(require(`${process.cwd()}/${base}/${name}-answer-candidates.cjs`));
assert.equal(candidates.size, document.answers.length);
for (const answer of document.answers) {
  assert(candidates.has(answer.exercise));
  answer.grading = "ungraded";
  answer.displayAnswer = candidates.get(answer.exercise);
  answer.parts = [];
  delete answer.prompt;
  delete answer.figureEvidence;
}
const target = `ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/${lesson}/answer-keys.json`;
fs.writeFileSync(target, `${JSON.stringify(document, null, 2)}\n`, { flag: "wx" });
const hash = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
fs.writeFileSync(`${base}/${name}-answer-candidate-binding.json`, `${JSON.stringify({
  lesson, prepared: { path: prepared, sha256: hash(prepared) },
  candidates: { path: `${base}/${name}-answer-candidates.cjs`, sha256: hash(`${base}/${name}-answer-candidates.cjs`) },
  output: { path: target, sha256: hash(target) },
  retainedBookRaw: true, allUngraded: true, judgingParts: 0,
  semanticGatePending: true, imagesOpened: 0,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ lesson, answers: document.answers.length, semanticGatePending: true }));
