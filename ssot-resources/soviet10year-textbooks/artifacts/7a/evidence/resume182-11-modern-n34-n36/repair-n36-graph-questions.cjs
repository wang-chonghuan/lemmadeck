const fs = require("node:fs");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const source = `${base}/n36-author`;
const target = `${base}/n36-choice-repaired`;
const durable = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n36/choice-set/figures";
const hash = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const original = read(`${source}/draft.json`);
const draft = structuredClone(original);
assert.equal(draft.new_figures.length, 0);
const figures = [
  {
    question: "q774-line-graphical", id: "fig-choice-n36-774-line",
    stem: "图中两条曲线分别表示方程 $\\sqrt{x}=6-x$ 的左边和右边。观察它们的交点并读取横坐标，哪项正确描述曲线配对、共同定义域和图解结果？",
    observation: "同一坐标网格显示根曲线和下降直线，没有交点坐标标注；由交点向横轴读取约为4。",
    basis: "Direct graphs of y=sqrt(x) and y=6-x on a shared unit coordinate lattice. The finite display includes x=9 and negative line values; it does not restrict the functions' global domains. No intersection marker or answer-bearing coordinate label.",
  },
  {
    question: "q774-reciprocal-graphical", id: "fig-choice-n36-774-reciprocal",
    stem: "图中两条曲线分别表示方程 $\\sqrt{x}=\\frac6x$ 的左边和右边。观察它们的交点，并用网格估读横坐标，哪项正确描述曲线配对、共同定义域和图解近似值？",
    observation: "同一半单位坐标网格显示递增根曲线和正的递减双曲线，没有交点坐标标注；交点横坐标在3与3.5之间，估读约为3.3。",
    basis: "Direct graphs of y=sqrt(x) and the positive branch y=6/x on one half-unit coordinate lattice. Both curves are clipped only to the finite display window; the common global domain is x>0. No intersection marker or answer-bearing coordinate label.",
  },
];
for (const figure of figures) {
  const svg = `${durable}/${figure.id}.svg`;
  assert.equal(read(`${durable}/${figure.id}.review.json`).status, "pass");
  draft.new_figures.push({ id: figure.id, path: svg, sha256: hash(svg), basis: figure.basis });
  const question = draft.questions.find((q) => q.id === figure.question);
  assert(question);
  question.view.stem = figure.stem;
  question.view.figure_ids = [figure.id];
  question.intent.task = "使用原方程左右两条实际曲线的交点与坐标网格读取图解结果，并判断共同定义域；保留原曲线配对与唯一交点判断。";
  question.intent.limitations = [
    "图象已给定，选择仍不能证明独立选择坐标尺度、描点和绘制曲线；自主作图生产能力未覆盖。",
  ];
  question.intent.figure_observations = [{ figure_id: figure.id, observation: figure.observation }];
  assert.deepEqual(question.key, original.questions.find((q) => q.id === figure.question).key);
}
const coverage = draft.coverage.find((c) => c.source_number === "774");
coverage.omitted_tasks = ["独立选择坐标尺度、描点并绘制原方程的左右曲线仍未覆盖。"];
coverage.reason = "两题均提供原左右函数的实际共享坐标图，保留交点视觉定位和近似读数；不把给定图象的选择阅读宣称为自主作图。";
const changed = new Set(figures.map((f) => f.question));
for (const question of draft.questions) {
  if (!changed.has(question.id)) assert.deepEqual(question, original.questions.find((q) => q.id === question.id));
}
for (const item of draft.coverage) {
  if (item.source_number !== "774") assert.deepEqual(item, original.coverage.find((c) => c.source_number === item.source_number));
}
fs.mkdirSync(target, { recursive: false });
fs.copyFileSync(`${source}/seed.json`, `${target}/seed.json`, fs.constants.COPYFILE_EXCL);
fs.writeFileSync(`${target}/draft.json`, `${JSON.stringify(draft, null, 2)}\n`, { flag: "wx" });
fs.writeFileSync(`${target}/affected-repair.json`, `${JSON.stringify({
  originalDraft: { path: `${source}/draft.json`, sha256: hash(`${source}/draft.json`) },
  repairedDraft: { path: `${target}/draft.json`, sha256: hash(`${target}/draft.json`) },
  changedQuestions: [...changed], unchangedQuestions: 19,
  keysUnchanged: true, sourceCoverageChangedOnly774: true, seedUnchanged: true,
  figureOutputs: draft.new_figures, semanticGatePending: true, imagesOpened: 0,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ changedQuestions: [...changed], unchangedQuestions: 19, newFigures: 2 }));
