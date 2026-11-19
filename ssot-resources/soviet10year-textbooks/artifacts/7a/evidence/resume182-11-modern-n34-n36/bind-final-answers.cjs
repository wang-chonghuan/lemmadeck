const fs = require("node:fs");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const [name, lesson, approvedHash, reviewPath] = process.argv.slice(2);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const file = `ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/${lesson}/answer-keys.json`;
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const document = JSON.parse(fs.readFileSync(file, "utf8"));
assert.equal(document.status, "ready");
assert.equal(document.count, document.answers.length);
const draft = structuredClone(document);
draft.status = "draft";
delete draft.count;
assert.equal(hash(`${JSON.stringify(draft, null, 2)}\n`), approvedHash,
  "Finalization must change only status/count, not approved content");
const output = `${base}/${name}-answer-finalization-binding.json`;
fs.writeFileSync(output, `${JSON.stringify({
  lesson, review: { path: reviewPath, sha256: hash(fs.readFileSync(reviewPath)) },
  approvedDraftSha256: approvedHash,
  finalized: { path: file, sha256: hash(fs.readFileSync(file)) },
  onlyChanges: ["status: draft -> ready", "count added"],
  allAnswersAndBookRawByteEquivalent: true, repeatedSemanticReview: false,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ lesson, answerContentUnchanged: true }));
