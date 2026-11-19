import assert from "node:assert/strict";
import fs from "node:fs";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
assert.equal(process.cwd(), repo);
const root = ".tmp/s10y-choice/batch015-ana9-n2-independent";
const original = ".tmp/s10y-choice/batch015-ana9-n2-repair";
const final = ".tmp/s10y-choice/batch015-ana9-n2-zh";
const load = file => JSON.parse(fs.readFileSync(file));
const draft = load(`${final}/draft.json`);
const old = load(`${original}/draft.json`);
const digest = file => {
  const result = spawnSync("python3", [".agents/skills/ld-s10y-choice/scripts/prepare.py", "digest", file],
    { cwd: repo, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};
assert.equal(digest(`${original}/draft.json`), "ec7fcd6dc810a2df44b1b78405a14689f038c4ce4c9b975eada3bce2b0e3fd77");
const correct = [["A", "D"], ["C"], ["B"], ["C"], ["B", "D"], ["A"], ["D"]];
const solutions = [
  "两和式在1时均为1。加k+1得(k+1)(k+2)/2；加(k+1)^2后，k(2k+1)+6(k+1)=(k+2)(2k+3)，得平方和的完整递推。",
  "a(k+1)=a1+kd；S(k+1)=k[2a1+(k-1)d]/2+a1+kd=(k+1)(2a1+kd)/2。对任意a1,d成立。",
  "非零q由b(k+1)=qb(k)得b1q^k，相加得b1(q^(k+1)-1)/(q-1)。q=0时用给定b1作初始项，每个后续项为0，正项数的和始终为b1，不使用0^0。",
  "1/[j(j+1)]=1/j-1/(j+1)，抵消内部项后剩1-1/(n+1)=n/(n+1)，两端和最后一项均保留。",
  "T的新项为(k+1)(k+2)，因式分解得(k+1)(k+2)(k+3)/3。R的新项为(k+1)(3k+4)，因式分解得(k+1)(k+2)^2；初始值分别2、4。",
  "n^3+11n=(n-1)n(n+1)+12n。三连续整数的积同时含因子2、3，加上12n仍被6整除；不需要所有因子同时是偶数或3的倍数。",
  "令y(n)=7^n-1，则y(k+1)=7(y(k)+1)-1=7y(k)+6。y1=6且y(k)=6m时，后项是6(7m+1)。"
];
const optionEvidence = [
  [
    "加k+1所得表达式正是n=k+1的线性和，初始值也验证。",
    "平方和递推的第三因子应为2k+3；k=1时该末式为3而真实平方和为5。",
    "通分加整数时遗漏因子2；k=1时末式为2而真实和为3。",
    "平方新项完整加入，2k²+7k+6=(k+2)(2k+3)，初始值为1。"
  ],
  [
    "和式多计一个d；a1=d=k=1时给4而真实S2为3。",
    "未推进末项和偏移；同一参数给(a2,S2)=(1,2)，真实为(2,3)。",
    "推进末项后相加得到(k+1)(2a1+kd)/2，系数逐项一致。",
    "使用端点和而非平均数，导致真实部分和加倍。"
  ],
  [
    "非零分支跳到k+2；b1=1,q=2,k=1时给(4,7)，真实(2,3)。零行正确不足以使整表正确。",
    "两条非零递推均正确；q=0的后项为0、部分和保留b1，包含k=1。",
    "整个数列先乘q而丢掉给定首项；同参数给(4,6)，q=0又误给总和0。",
    "把乘公比换成加公差；同参数给(3,4)，且q=0误作常数数列。"
  ],
  [
    "分解符号倒置，每个差都是原正项的负数，n=1即给-1/2。",
    "只留下末倒数而丢掉首端1；n=2给1/3而真实和为2/3。",
    "逐项分解并抵消，保留1和-1/(n+1)，得完整和。",
    "止于n-1项，n=1给0而真实和为1/2。"
  ],
  [
    "加入新项时未按分母3通分，k=1给4而真实T2为8。",
    "新项完整加入后剩因子k/3+1=(k+3)/3，满足下一恒等式。",
    "新因子应为3k+4而非3k+3；k=1给16而真实R2为18。",
    "新项代入完整3(k+1)+1，剩多项式k²+4k+4=(k+2)²。"
  ],
  [
    "准确恒等式和连续整数的存在性整除关系共同推出目标，n=1时零乘积也合法。",
    "+10n得到n³+9n而非目标；偶数10n也未必被6整除。",
    "把至少一个偶因子换成全部为偶，n=2的因子1,2,3反驳该前提。",
    "把至少一个3的倍数换成全部被3整除，同一因子组反驳该前提。"
  ],
  [
    "遗漏仿射修正+6，k=1给42而实际48。",
    "把指数关系误作每步加6的等差关系，k=1给12而实际48。",
    "把修正+6反写为-6，k=1给36而实际48。",
    "由7^k=y(k)+1恢复正确+6，代入归纳假设后为整数倍6(7m+1)。"
  ]
];
const fidelity = [
  "两个完整和式及各自初始/递推步骤均保留，要求判断整个证明而非孤立计算。",
  "同一新末项连接通项与部分和，任意参数和正整数域显式保留。",
  "通项和部分和两任务都保留；给定初始项和所有零分支明确，未自定0^0。",
  "完整原和的分解与两个端点同时呈现，仍要求识别正确抵消关系。",
  "两个多项式和的初始值和新项都进入完整归纳论证。",
  "源要求一般证明而未强制归纳法；保留准确多项式及存在性整除推理。",
  "指数定义、初始值、任意k的假设和整除后项结论同一论证中保留。"
];
const leakage = [
  "四项采用相同初始值/递推/结语框架，不能靠结语或源给出的结果区别正误。",
  "四个完整成对公式形式可比，必须判断末项偏移和平均因子。",
  "四个表格都含零/非零行，其中A零行也正确，零分支是否出现不标记答案。",
  "四项都给分解与总和，需要判断符号和端点，而非答案标识。",
  "两和式各有同样完整格式的论证，区别在新项和通分，而不是文字详略。",
  "四段都列同类恒等式和整除说理，正确性来自准确等式及量词。",
  "四项都表示某个6的整数倍，必须从指数定义推导正确仿射递推。"
];
for (let index = 0; index < draft.questions.length; index++) {
  assert.deepEqual(draft.questions[index].key.correct, correct[index]);
  assert.deepEqual({ ...draft.questions[index], view: old.questions[index].view }, old.questions[index]);
}
const review = {
  schema: "s10y-choice-review-v1",
  seed_sha256: digest(`${final}/seed.json`),
  draft_sha256: digest(`${final}/draft.json`),
  reviewer: {
    kind: "independent_agent",
    identity: "Codex parent worker184-3, independent from Dewey: source-first/view-first/internal mathematics; Lovelace: affected-only Chinese wording, inherited mathematics explicitly attributed"
  },
  source_reviews: load(`${final}/seed.json`).exercises.map((exercise, index) => ({
    source_number: exercise.number,
    independent_solution: solutions[index],
    coverage: { verdict: "pass", evidence: fidelity[index] + " 独立书写/发现证明的响应损失已明确；不存在未披露核心任务遗漏。" }
  })),
  figure_checks: [],
  new_figure_reviews: [],
  question_reviews: draft.questions.map((question, index) => ({
    question_id: question.id,
    task_fidelity: { verdict: "pass", evidence: fidelity[index] },
    redundancy: { verdict: "pass", evidence: "本题保留这一源的完整数学判断；其他题虽共用归纳原理，但没有给出此题的完整推理结果。" },
    answer_leakage: { verdict: "pass", evidence: leakage[index] },
    mathematics: {
      verdict: "pass",
      independent_solution: solutions[index],
      correct: correct[index],
      option_checks: question.view.options.map((option, optionIndex) => ({
        option_id: option.id,
        truth: correct[index].includes(option.id) ? "correct" : "incorrect",
        evidence: optionEvidence[index][optionIndex]
      }))
    }
  })),
  outcome: "pass"
};
const localization = load(".tmp/s10y-choice/batch015-ana9-n2-localization-independent/affected-review.json");
assert.equal(localization.outcome, "pass", "affected Chinese wording must pass before binding this final review");
fs.writeFileSync(`${final}/review.json`, JSON.stringify(review, null, 2) + "\n", { flag: "wx" });
const args = [".agents/skills/ld-s10y-choice/scripts/validate.py", "--repo", repo,
  "--seed", `${final}/seed.json`, "--draft", `${final}/draft.json`, "--review", `${final}/review.json`];
const result = spawnSync("python3", args, { cwd: repo, encoding: "utf8" });
fs.writeFileSync(`${root}/validation-final.json`, JSON.stringify({
  command: ["python3", ...args], exit: result.status, stdout: result.stdout, stderr: result.stderr,
  seed_sha256: review.seed_sha256, draft_sha256: review.draft_sha256,
  parent_images: 0, new_paid_calls: 0
}, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ exit: result.status, stdout: result.stdout, draft_sha256: review.draft_sha256 }));
process.exitCode = result.status;
