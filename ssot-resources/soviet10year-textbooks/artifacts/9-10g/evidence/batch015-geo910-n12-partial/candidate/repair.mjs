import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
assert.equal(process.cwd(), repo);
const root = path.join(repo, ".tmp/s10y-choice/batch015-geo910-n12-repair");
const prior = path.join(repo, "ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/batch007-n12-choice-rejected");
const seedBytes = fs.readFileSync(path.join(prior, "geo910-n12-choice-seed.json"));
const draft = JSON.parse(fs.readFileSync(path.join(prior, "geo910-n12-choice-draft.json")));
assert.ok(fs.existsSync(path.join(root, "source-repair.md")));
assert.equal(draft.seed_sha256, "e4a23600dcc57983ae486b56ef88280f79707dbe0b5a0d8ad0f0265f27facdcd");
assert.equal(draft.questions.length, 9);
const oldViews = draft.questions.map(({ id, view, key }) => ({ id, view, key }));
const q04 = draft.questions.find(question => question.id === "n12-q04");
q04.intent.source_solution += " 本书允许重合直线平行，故重合不使原题的广义平行结论失效；只有原线沿d缩点时不再得到平行像直线。本题显式采用两个不同像直线的较强判断，故其A/B答案不等同于原题只有缩点这一例外。";
q04.intent.limitations[0] = "本书允许重合直线平行；本题问两个不同像直线，未另行要求学生判断重合像仍满足原题的广义平行结论。";
const c101 = draft.coverage.find(entry => entry.source_number === "101");
c101.omitted_tasks = [
  "不证明学生能独立推导缩点与重合两种较强结论例外的穷尽性。",
  "未单独要求原题广义平行结论的例外判断：仅缩点失去像直线，重合的非退化像仍平行。"
];
c101.reason = "保留原题的退化机制及较强的不同像线分类，但不将重合误称为原题广义平行结论的反例；较强判断的响应范围与未单独要求的原题判断明确区分。";
const q07 = draft.questions.find(question => question.id === "n12-q07");
q07.intent.source_solution = q07.intent.source_solution.replace(
  "104(2)另需投影方向d属于两原方向张成的平面U、避开原方向且横截alpha；当两原方向都平行alpha时不存在此d，所以其无条件构造仍HOLD，不由本题键解决。",
  "104(2)另需投影方向d属于两原方向张成的平面U、避开原方向且横截alpha；当两原方向都平行alpha时不存在此d。完整可行性与条件化构造由新增n12-q11要求，不由本题键解决。"
);
q07.intent.limitations[1] = "本题仅覆盖104(1)，不独立要求104(2)的可行性及构造；后者由n12-q11另行保留，不证明学生独立作图。";

draft.questions.push({
  id: "n12-q10",
  source_numbers: ["99"],
  view: {
    mode: "multiple",
    stem: "沿与平面 $\\alpha$ 横截相交的方向 $d$ 作平行投影。一个完整平面 $\\pi$ 的射影可能是下列哪些图形？",
    figure_ids: [],
    options: [
      { id: "A", text: "一个点。", figure_ids: [] },
      { id: "B", text: "一条完整直线。", figure_ids: [] },
      { id: "C", text: "整个平面 $\\alpha$。", figure_ids: [] },
      { id: "D", text: "平面 $\\alpha$ 中的一个半平面。", figure_ids: [] }
    ]
  },
  intent: {
    task: "完整分类二维仿射平面的射影，不删去退化为直线的情形。",
    source_solution: "P的核为span(d)。pi的二维方向空间U若包含d，限制秩为1，像为完整直线；否则限制秩为2，像为整个alpha。二维U不可能包含于一维核，故像不可能为一点。完整仿射空间的线性像仍是完整仿射空间，不可能只有半平面。P(x,y,z)=(x,y,0)时，pi:y=0及pi:z=1分别实现两种像。",
    unit_reason: "同一源分类的全部可能图形作为一题多选保留，不按秩的两个情形重复拆题。",
    concept_blocks: [1, 9, 10],
    limitations: [
      "识别完整类型不证明学生能独立构造两个实例或证明秩分类。",
      "只覆盖99(1)，99(2)/(3)缺半平面边界和角集合约定，仍未解决。"
    ],
    figure_observations: []
  },
  key: {
    correct: ["B", "C"],
    rationales: [
      { option_id: "A", truth: "incorrect", derivation: "二维方向空间不可能全落在一维投影核中，限制秩至少为1。", misconception: "将平面含有投射方向误认为平面的每个方向都是投射方向，把沿d的各纤维误合并为同一纤维。" },
      { option_id: "B", truth: "correct", derivation: "pi含有d方向时限制秩为1，例如z方向投到z=0时，pi:y=0的像为x轴。", misconception: null },
      { option_id: "C", truth: "correct", derivation: "pi不含d方向时限制秩为2，例如pi:z=1沿z投到z=0时得到整个alpha。", misconception: null },
      { option_id: "D", truth: "incorrect", derivation: "完整仿射平面像只能是完整仿射子空间；二维像是整个alpha而非一侧半平面。", misconception: "把图上表示平面的有限片及其一侧可见区当成整个原平面，截去其另一侧后才作投影，误得半平面。" }
    ]
  }
});
draft.questions.push({
  id: "n12-q11",
  source_numbers: ["104"],
  view: {
    mode: "single",
    stem: "给定异面直线 $a,b$ 和平面 $\\alpha$，希望选择方向 $l$，使沿 $l$ 作到 $\\alpha$ 的平行投影后，得到两条不同的平行像直线。先过 $a$ 作平面 $\\beta$，使它含有平行于 $b$ 的方向。下列哪个完整方案正确？",
    figure_ids: [],
    options: [
      { id: "A", text: "若 $\\beta$ 与 $\\alpha$ 平行或重合，在 $\\beta$ 内选不平行于 $a,b$ 的 $l$；否则无解。", figure_ids: [] },
      { id: "B", text: "若 $\\beta$ 与 $\\alpha$ 平行或重合，无解；否则选平行于 $a$ 且不平行于 $\\alpha$ 的 $l$。", figure_ids: [] },
      { id: "C", text: "若 $\\beta$ 与 $\\alpha$ 平行或重合，无解；否则在 $\\beta$ 内选不平行于 $a,b$ 且不平行于 $\\alpha$ 的 $l$。", figure_ids: [] },
      { id: "D", text: "若 $\\beta$ 与 $\\alpha$ 平行或重合，无解；否则选方向不属于 $\\beta$ 且不平行于 $\\alpha$ 的 $l$。", figure_ids: [] }
    ]
  },
  intent: {
    task: "识别给定异面线与固定投影平面下的完整可行性判断及条件化方向构造，不默加总能作出的前提。",
    source_solution: "设原线方向为独立u,v，beta方向为U=span(u,v)。两非零像方向平行当且仅当d属于U、避开span(u)及span(v)，并不平行alpha。U等于alpha方向平面时没有合法d；否则U中至多需排除u、v和与alpha平行的三条一维方向，仍有选择。选择beta内且不平行a,b,alpha的l得到两个非退化平行像。若两个像重合，其完整逆像平面同时包含a,b，违反异面。",
    unit_reason: "可行条件、无解分支和构造属于同一给定条件的完整方案，采用成套单选，不把障碍判定和方向选择拆成互相提示的题。",
    concept_blocks: [1, 9, 10, 11],
    limitations: [
      "识别完整方案不证明学生能独立作出辅助平面、方向直线或证明构造充分必要性。"
    ],
    figure_observations: []
  },
  key: {
    correct: ["C"],
    rationales: [
      { option_id: "A", truth: "incorrect", derivation: "U等于alpha方向时每条beta内直线都平行alpha，违反合法投影的横截条件；U不等于alpha方向时却有合法方向。", misconception: "将可行性判定反转，以beta包含alpha的全部方向为可投影依据，未检查投射直线必须与alpha相交。" },
      { option_id: "B", truth: "incorrect", derivation: "l平行a时a的像为一个点，无法得到两条像直线；某些可行配置中a还平行alpha，使所指定的l根本不存在。", misconception: "把原线沿同一方向投影保持方向误用到原线平行投射方向的情形，删去性质前的不平行条件。" },
      { option_id: "C", truth: "correct", derivation: "方向属于U且避开原线方向使两个像方向非零并在一维商空间内平行；不平行alpha使投影合法。U不同于alpha方向时这些排除方向不填满U；异面性又排除像重合。", misconception: null },
      { option_id: "D", truth: "incorrect", derivation: "d不属于span(u,v)时，任何u,v的非零组合都不可能落在投影核span(d)，两个非零像方向保持独立而不平行。", misconception: "把投影方向离开原两方向张成的平面误当成压合两个方向的条件，倒置二维限制单射与秩一的判定。" }
    ]
  }
});
const c99 = draft.coverage.find(entry => entry.source_number === "99");
c99.question_ids = ["n12-q10"];
c99.omitted_tasks = [
  "不证明学生能独立构造99(1)的两种实例并证明完整分类。",
  "HOLD: 99(2)的半平面完整像分类，尤其边界及端点归属，尚无给定定义支持。",
  "HOLD: 99(3)的非平角角完整像分类，缺角作为两射线或区域以及零角/优角的允许范围定义。"
];
c99.reason = "99(1)完整像分类已由n12-q10保留；99(2)/(3)的真实约定缺口不靠新增条件或部分通过消除，整课仍不能批准。";
const c104 = draft.coverage.find(entry => entry.source_number === "104");
c104.question_ids = ["n12-q07", "n12-q11"];
c104.omitted_tasks = [
  "不证明学生能独立构造104(1)的异面反例。",
  "完整条件化构造和无解判定作为方案识别保留，但不证明学生能独立生产104(2)的辅助平面、投射方向或证明。"
];
c104.reason = "n12-q07显式判断逆命题，n12-q11保留可行条件、无解分支和辅助平面构造；不默加源题总能作出的假设。";
assert.deepEqual(draft.questions.slice(0, 9).map(({ id, view, key }) => ({ id, view, key })), oldViews);
fs.writeFileSync(path.join(root, "seed.json"), seedBytes, { flag: "wx" });
fs.writeFileSync(path.join(root, "draft.json"), JSON.stringify(draft, null, 2) + "\n", { flag: "wx" });
fs.writeFileSync(path.join(root, "view-only.json"), JSON.stringify({
  questions: draft.questions.map(({ id, view }) => ({ id, view })),
  new_figures: draft.new_figures
}, null, 2) + "\n", { flag: "wx" });
const args = [".agents/skills/ld-s10y-choice/scripts/validate.py", "--repo", repo,
  "--seed", path.join(root, "seed.json"), "--draft", path.join(root, "draft.json")];
const result = spawnSync("python3", args, { cwd: repo, encoding: "utf8" });
fs.writeFileSync(path.join(root, "structural-receipt.json"), JSON.stringify({
  command: ["python3", ...args], exit: result.status, stdout: result.stdout,
  stderr: result.stderr, prior_views_and_keys_identical: true,
  questions: draft.questions.length,
  options: draft.questions.reduce((sum, question) => sum + question.view.options.length, 0),
  semantic_outcome: "pending; source99(2)/(3) remain blocked"
}, null, 2) + "\n", { flag: "wx" });
console.log(result.stdout);
console.error(result.stderr);
process.exitCode = result.status;
