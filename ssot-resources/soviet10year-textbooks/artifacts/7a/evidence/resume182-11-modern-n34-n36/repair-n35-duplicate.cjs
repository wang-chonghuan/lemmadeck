const fs = require("node:fs");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const source = `${base}/n35-choice-author`;
const target = `${base}/n35-choice-repaired`;
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const hash = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const original = read(`${source}/draft.json`);
const draft = structuredClone(original);
const graph = draft.questions.find((q) => q.id === "n35-q06");
assert(graph);
assert(draft.questions.some((q) => q.id === "n35-q09"));
graph.source_numbers = ["758", "759"];
graph.view.stem = "在实数范围内，结合图中的 $y=\\sqrt{x}$ 与水平直线 $y=2$，判断 $\\sqrt{x}=2$、$\\sqrt{x}>2$、$\\sqrt{x}<2$ 的解。下列关于图象位置与解集对应关系的结论，哪些正确？这里讨论函数的整个定义域。";
const extensions = {
  A: "因此 $\\sqrt{x}=2$ 的解为 $x=4$。",
  B: "这也是 $\\sqrt{x}>2$ 的解集。",
  C: "这也是 $\\sqrt{x}<2$ 的解集。",
  D: "这也是 $\\sqrt{x}<2$ 的解集。",
  E: "因此 $\\sqrt{x}=2$ 的解为 $x=2$。",
  F: "这也是 $\\sqrt{x}>2$ 的解集。",
};
for (const option of graph.view.options) option.text += extensions[option.id];
graph.intent.task = "将同一阈值2下的图象相交、上方、下方与三个等式/不等式解集配对；合并原758与759c的相同数学结果，保留定义域和严格端点。";
graph.intent.unit_reason = "758与759c请求同一三个条件的图象解释和代数解集，原稿把相同完整结果暴露在两题中。一个图象—解集对应判断同时认领两道原题的这组任务，避免独立题之间复用答案；759a、b的不同阈值仍保留。";
graph.intent.limitations = [
  "给定图象的选择判断不能证明独立画出y=2、标交点、涂区域或书写图解解释。",
  "图象与解集对应选择不能证明独立推导并书写三个代数解集；两种生产能力均不宣称已实现。",
  "有限图窗以外的整个定义域结论仍依赖给定根函数定义和单调性，不由不可见终点推出。",
];
assert.deepEqual(graph.key, original.questions.find((q) => q.id === "n35-q06").key);
draft.questions = draft.questions.filter((q) => q.id !== "n35-q09");
const c758 = draft.coverage.find((c) => c.source_number === "758");
c758.omitted_tasks = ["独立作出水平直线、标交点、涂区域和书写图解解释未覆盖。"];
c758.reason = "相交、上方、下方与等式/不等式解集在同一实际图象判断中保留；其数学结果与759c相同，按多对一来源关系合并，避免跨题提示。";
const c759 = draft.coverage.find((c) => c.source_number === "759");
c759.question_ids = ["n35-q06", "n35-q07", "n35-q08"];
c759.reason = "a、b的六个不同阈值条件仍由q07、q08覆盖；c的三个条件与758合并到q06的图象—解集对应判断，九个原任务均保留，不重复暴露同一完整答案。";
for (const question of draft.questions) {
  if (question.id !== "n35-q06") assert.deepEqual(question, original.questions.find((q) => q.id === question.id));
}
for (const coverage of draft.coverage) {
  if (!["758", "759"].includes(coverage.source_number)) assert.deepEqual(coverage, original.coverage.find((c) => c.source_number === coverage.source_number));
}
fs.mkdirSync(target, { recursive: false });
fs.copyFileSync(`${source}/seed.json`, `${target}/seed.json`, fs.constants.COPYFILE_EXCL);
fs.writeFileSync(`${target}/draft.json`, `${JSON.stringify(draft, null, 2)}\n`, { flag: "wx" });
fs.writeFileSync(`${target}/affected-repair.json`, `${JSON.stringify({
  original: { path: `${source}/draft.json`, sha256: hash(`${source}/draft.json`) },
  repaired: { path: `${target}/draft.json`, sha256: hash(`${target}/draft.json`) },
  changedQuestion: "n35-q06", removedDuplicateQuestion: "n35-q09",
  affectedSources: ["758", "759"], unchangedQuestions: 9,
  changedQuestionKeyUnchanged: true, imagesOpened: 0, semanticGatePending: true,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ questions: draft.questions.length, options: draft.questions.reduce((n, q) => n + q.view.options.length, 0), unchangedQuestions: 9 }));
