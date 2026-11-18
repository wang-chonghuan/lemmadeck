const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const owned = "/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d620-n77-first-choice-author";
assert.equal(__dirname, owned);
const zh = JSON.parse(fs.readFileSync(path.join(owned, "draft.zh.json"), "utf8"));
const en = JSON.parse(fs.readFileSync(path.join(owned, "draft.en.json"), "utf8"));
assert.equal(zh.schema, en.schema);
assert.equal(zh.seed_sha256, en.seed_sha256);
assert.deepEqual(zh.new_figures, en.new_figures);
assert.deepEqual(zh.coverage, en.coverage);
assert.equal(zh.questions.length, en.questions.length);
let options = 0;
let single = 0;
let multiple = 0;
const math = (text) => [...text.matchAll(/\$([^$]+)\$/g)].map((match) => match[1]);
for (let i = 0; i < zh.questions.length; i += 1) {
  const a = zh.questions[i];
  const b = en.questions[i];
  assert.equal(a.id, b.id);
  assert.deepEqual(a.source_numbers, b.source_numbers);
  assert.deepEqual(a.intent, b.intent);
  assert.deepEqual(a.key, b.key);
  assert.equal(a.view.mode, b.view.mode);
  assert.deepEqual(a.view.figure_ids, b.view.figure_ids);
  assert.deepEqual(math(a.view.stem), math(b.view.stem));
  assert.equal(a.view.options.length, b.view.options.length);
  for (let j = 0; j < a.view.options.length; j += 1) {
    const x = a.view.options[j];
    const y = b.view.options[j];
    assert.equal(x.id, y.id);
    assert.deepEqual(x.figure_ids, y.figure_ids);
    assert.deepEqual(math(x.text), math(y.text));
    options += 1;
  }
  if (a.view.mode === "single") single += 1;
  if (a.view.mode === "multiple") multiple += 1;
}
console.log(JSON.stringify({
  status: "MECHANICAL-ALIGNMENT-PASS-NOT-ZHEN-OR-SEMANTIC-REVIEW",
  questions_per_language: zh.questions.length,
  options_per_language: options,
  single,
  multiple,
  checked: "Identical IDs, native modes, inline math, figure references, source bindings, shared author intent/keys/rationales and coverage.",
  not_checked: "Natural-language equivalence, mathematics, task fidelity, redundancy, leakage or approval.",
}));
