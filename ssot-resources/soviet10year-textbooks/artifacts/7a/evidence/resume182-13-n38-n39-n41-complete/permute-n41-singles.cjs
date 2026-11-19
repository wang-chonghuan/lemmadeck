const fs = require("node:fs");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const source = `${base}/n41-choice-author`;
const target = `${base}/n41-choice-position-affected`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const save = (name, value) => fs.writeFileSync(`${target}/${name}`, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
const original = read(`${source}/draft.json`);
const draft = structuredClone(original);
const plans = [
  ["q16", ["B", "C", "A"]], ["q19", ["C", "A", "B"]],
  ["q20", ["A", "C", "B"]], ["q21", ["C", "B", "A"]],
  ["q22", ["A", "B", "C"]], ["q23", ["B", "A", "C"]],
  ["q24", ["C", "A", "B"]], ["q25", ["B", "C", "A"]],
  ["q26", ["B", "A", "C"]], ["q27", ["A", "C", "B"]],
  ["q28", ["C", "B", "A"]],
];
assert(!fs.existsSync(target));
fs.mkdirSync(target);
const mappings = [];
for (const [id, order] of plans) {
  const question = draft.questions.find(value => value.id === id);
  assert.equal(question.view.mode, "single");
  const before = structuredClone(question);
  assert.deepEqual(before.key.correct, ["A"]);
  const labels = ["A", "B", "C"];
  const map = Object.fromEntries(order.map((oldId, index) => [oldId, labels[index]]));
  question.view.options = order.map(oldId => ({
    ...before.view.options.find(option => option.id === oldId), id: map[oldId],
  }));
  question.key.correct = before.key.correct.map(oldId => map[oldId]);
  question.key.rationales = order.map(oldId => ({
    ...before.key.rationales.find(value => value.option_id === oldId), option_id: map[oldId],
  }));
  const restored = structuredClone(question);
  const inverse = Object.fromEntries(Object.entries(map).map(([a, b]) => [b, a]));
  restored.view.options = before.view.options.map(old => ({
    ...question.view.options.find(option => inverse[option.id] === old.id), id: old.id,
  }));
  restored.key.correct = question.key.correct.map(value => inverse[value]);
  restored.key.rationales = before.key.rationales.map(old => ({
    ...question.key.rationales.find(value => inverse[value.option_id] === old.option_id),
    option_id: old.option_id,
  }));
  assert.deepEqual(restored, before);
  mappings.push({ question_id: id, original_ids_in_new_order: order, old_to_new_id: map });
}
const affected = new Set(plans.map(([id]) => id));
for (const [index, question] of draft.questions.entries()) {
  if (!affected.has(question.id)) assert.deepEqual(question, original.questions[index]);
}
for (const key of Object.keys(draft).filter(key => key !== "questions")) {
  assert.deepEqual(draft[key], original[key]);
}
fs.copyFileSync(`${source}/seed.json`, `${target}/seed.json`, fs.constants.COPYFILE_EXCL);
save("draft.json", draft);
save("learner-views.json", draft.questions.map(question => question.view));
save("permutation.json", {
  source: { path: `${source}/draft.json`, sha256: hash(`${source}/draft.json`) },
  output: { path: `${target}/draft.json`, sha256: hash(`${target}/draft.json`) },
  mappings, unchanged_questions: 17,
  option_texts_math_intent_coverage_and_figures_unchanged: true,
  restored_questions_deep_equal: true, new_images: 0, mathematics_repeated: false,
  independent_affected_view_review_pending: true,
});
for (const name of ["seed.json", "draft.json", "learner-views.json", "permutation.json"]) {
  fs.chmodSync(`${target}/${name}`, 0o444);
}
console.log(JSON.stringify({ target, affected: plans.length, unchanged: 17, mathematicsChanged: false }));
