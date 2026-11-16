import fs from "node:fs";
import path from "node:path";

const root = ".intentfold/tickets/STEMROBIN-182/tmp/5m-n40";
const archive = path.join(root, "history/position-cycle-before");
const draftPath = path.join(root, "draft.json");
const viewPath = path.join(root, "view.json");
const beforeDraft = fs.readFileSync(path.join(archive, "draft.json"));
const beforeView = fs.readFileSync(path.join(archive, "view.json"));
if (!beforeDraft.equals(fs.readFileSync(draftPath)) ||
    !beforeView.equals(fs.readFileSync(viewPath))) {
  throw new Error("Current inputs no longer equal archived repair inputs.");
}
const draft = JSON.parse(beforeDraft.toString("utf8"));
const swaps = [
  { index: 6, labels: ["A", "C"] },
  { index: 10, labels: ["A", "D"] },
  { index: 14, labels: ["A", "B"] },
  { index: 20, labels: ["A", "C"] },
  { index: 24, labels: ["A", "D"] },
];
for (const { index, labels: [left, right] } of swaps) {
  const q = draft.questions[index];
  const orderedLabels = q.view.options.map(o => o.id);
  const remap = id => id === left ? right : id === right ? left : id;
  const byOption = new Map(q.view.options.map(o => [o.id, o]));
  const byRationale = new Map(q.key.rationales.map(r => [r.option_id, r]));
  q.view.options = orderedLabels.map(id => ({
    ...byOption.get(remap(id)), id,
  }));
  q.key.correct = q.key.correct.map(remap);
  q.key.rationales = orderedLabels.map(option_id => ({
    ...byRationale.get(remap(option_id)), option_id,
  }));
}
fs.writeFileSync(draftPath, JSON.stringify(draft, null, 2) + "\n");
const view = {
  questions: draft.questions.map(({ id, source_numbers, view }) => ({
    id, source_numbers, view,
  })),
};
fs.writeFileSync(viewPath, JSON.stringify(view, null, 2) + "\n");
console.log(JSON.stringify({
  operation: "specified-five-question-permutation-and-pure-view-projection-only",
  changed_zero_based_indices: swaps.map(s => s.index),
  structural_executions: 0,
  canonical_executions: 0,
  browser_executions: 0,
}, null, 2));
