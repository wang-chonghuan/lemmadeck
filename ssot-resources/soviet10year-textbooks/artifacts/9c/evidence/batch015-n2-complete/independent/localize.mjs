import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repo = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
assert.equal(process.cwd(), repo);
const original = ".tmp/s10y-choice/batch015-ana9-n2-repair";
const output = ".tmp/s10y-choice/batch015-ana9-n2-zh";
const draft = JSON.parse(fs.readFileSync(path.join(original, "draft.json")));
const prior = structuredClone(draft);
const views = [
  {
    stem: "对于正整数 $n$，设 $U_n=1+2+\\cdots+n$，$V_n=1^2+2^2+\\cdots+n^2$。考虑恒等式 $U_n=\\frac{n(n+1)}2$ 和 $V_n=\\frac{n(n+1)(2n+1)}6$。选出下列所有正确的归纳论证。在每个递推计算中，$k$ 是任意正整数，并假设对应恒等式在 $k$ 时成立。",
    options: [
      "$U_1=1=\\frac{1\\cdot2}{2}$，且 $U_{k+1}=\\frac{k(k+1)}2+(k+1)=\\frac{(k+1)(k+2)}2$。这两步证明了关于 $U_n$ 的恒等式。",
      "$V_1=1=\\frac{1\\cdot2\\cdot3}{6}$，且 $V_{k+1}=\\frac{k(k+1)(2k+1)}6+(k+1)^2=\\frac{(k+1)(k+2)(2k+1)}6$。这两步证明了关于 $V_n$ 的恒等式。",
      "$U_1=1=\\frac{1\\cdot2}{2}$，且 $U_{k+1}=\\frac{k(k+1)}2+(k+1)=\\frac{(k+1)^2}2$。这两步证明了关于 $U_n$ 的恒等式。",
      "$V_1=1=\\frac{1\\cdot2\\cdot3}{6}$，且 $V_{k+1}=\\frac{k(k+1)(2k+1)}6+(k+1)^2=\\frac{(k+1)(k+2)(2k+3)}6$。这两步证明了关于 $V_n$ 的恒等式。"
    ]
  },
  {
    stem: "一个等差数列满足 $a_{n+1}=a_n+d$，且 $S_n=a_1+\\cdots+a_n$。初始值是 $a_1$ 和 $S_1=a_1$。假设 $a_k=a_1+(k-1)d$ 和 $S_k=\\frac{k(2a_1+(k-1)d)}2$。应用 $a_{k+1}=a_k+d$ 和 $S_{k+1}=S_k+a_{k+1}$，下列哪一对结果能对任意实数 $a_1,d$ 和正整数 $k$ 完成这两个归纳步骤？",
    options: [
      "$a_{k+1}=a_1+kd$，且 $S_{k+1}=\\frac{(k+1)(2a_1+(k+1)d)}2$。",
      "$a_{k+1}=a_1+(k-1)d$，且 $S_{k+1}=\\frac{(k+1)(2a_1+(k-1)d)}2$。",
      "$a_{k+1}=a_1+kd$，且 $S_{k+1}=\\frac{(k+1)(2a_1+kd)}2$。",
      "$a_{k+1}=a_1+kd$，且 $S_{k+1}=(k+1)(2a_1+kd)$。"
    ]
  },
  {
    stem: "一个数列满足 $b_{n+1}=q b_n$，其中 $b_1,q$ 为实数，$q\\ne1$；也包括 $q=0$ 的情形。设 $S_n=b_1+\\cdots+b_n$。初始值是给定的 $b_1$ 和 $S_1=b_1$。对于任意正整数 $k$，归纳假设是：若 $q\\ne0$，则 $b_k=b_1q^{k-1}$、$S_k=\\frac{b_1(q^k-1)}{q-1}$；若 $q=0$，则 $S_k=b_1$，且 $b_j=0$（$2\\le j\\le k$）。应用 $b_{k+1}=q b_k$ 和 $S_{k+1}=S_k+b_{k+1}$，下列哪一个完整分类对所有允许的 $b_1,q,k$ 都成立？",
    options: [
      "| 情况 | $b_{k+1}$ | $S_{k+1}$ |\n| --- | --- | --- |\n| $q\\ne0$ | $b_1q^{k+1}$ | $\\frac{b_1(q^{k+2}-1)}{q-1}$ |\n| $q=0$ | $0$ | $b_1$ |",
      "| 情况 | $b_{k+1}$ | $S_{k+1}$ |\n| --- | --- | --- |\n| $q\\ne0$ | $b_1q^k$ | $\\frac{b_1(q^{k+1}-1)}{q-1}$ |\n| $q=0$ | $0$ | $b_1$ |",
      "| 情况 | $b_{k+1}$ | $S_{k+1}$ |\n| --- | --- | --- |\n| $q\\ne0$ | $b_1q^{k+1}$ | $\\frac{b_1q(q^{k+1}-1)}{q-1}$ |\n| $q=0$ | $0$ | $0$ |",
      "| 情况 | $b_{k+1}$ | $S_{k+1}$ |\n| --- | --- | --- |\n| $q\\ne0$ | $b_1+kq$ | $\\frac{(k+1)(2b_1+kq)}2$ |\n| $q=0$ | $b_1$ | $(k+1)b_1$ |"
    ]
  },
  {
    stem: "对于正整数 $n$，设 $S_n=\\frac1{1\\cdot2}+\\frac1{2\\cdot3}+\\cdots+\\frac1{n(n+1)}$。下列哪一个计算能对每个 $n$ 正确求出这个和？",
    options: [
      "$\\frac1{j(j+1)}=\\frac1{j+1}-\\frac1j$，所以 $S_n=\\frac1{n+1}-1=-\\frac n{n+1}$。",
      "$\\frac1{j(j+1)}=\\frac1j-\\frac1{j+1}$，所以 $S_n=\\frac1{n+1}$。",
      "$\\frac1{j(j+1)}=\\frac1j-\\frac1{j+1}$，所以 $S_n=1-\\frac1{n+1}=\\frac n{n+1}$。",
      "$\\frac1{j(j+1)}=\\frac1j-\\frac1{j+1}$，所以 $S_n=1-\\frac1n=\\frac{n-1}n$。"
    ]
  },
  {
    stem: "对于正整数 $n$，设 $T_n=\\sum_{j=1}^n j(j+1)$，$R_n=\\sum_{j=1}^n j(3j+1)$。考虑恒等式 $T_n=\\frac{n(n+1)(n+2)}3$ 和 $R_n=n(n+1)^2$。选出所有正确的归纳论证。每个递推计算都假设对应恒等式在任意正整数 $k$ 时成立。",
    options: [
      "$T_1=2=\\frac{1\\cdot2\\cdot3}{3}$，且 $T_{k+1}=\\frac{k(k+1)(k+2)}3+(k+1)(k+2)=\\frac{(k+1)^2(k+2)}3$。这两步证明了关于 $T_n$ 的恒等式。",
      "$T_1=2=\\frac{1\\cdot2\\cdot3}{3}$，且 $T_{k+1}=\\frac{k(k+1)(k+2)}3+(k+1)(k+2)=\\frac{(k+1)(k+2)(k+3)}3$。这两步证明了关于 $T_n$ 的恒等式。",
      "$R_1=4=1\\cdot2^2$，且 $R_{k+1}=k(k+1)^2+(k+1)(3k+3)=(k+1)^2(k+3)$。这两步证明了关于 $R_n$ 的恒等式。",
      "$R_1=4=1\\cdot2^2$，且 $R_{k+1}=k(k+1)^2+(k+1)(3k+4)=(k+1)(k+2)^2$。这两步证明了关于 $R_n$ 的恒等式。"
    ]
  },
  {
    stem: "下列哪一个论证正确证明了 $n^3+11n$ 能被 $6$ 整除（对所有正整数 $n$）？",
    options: [
      "$n^3+11n=(n-1)n(n+1)+12n$。这三个连续整数因子中，至少一个是偶数，至少一个能被 $3$ 整除。因此，这三个因子的乘积和 $12n$ 均能被 $6$ 整除。",
      "$n^3+11n=(n-1)n(n+1)+10n$。这三个连续整数因子中，至少一个是偶数，至少一个能被 $3$ 整除。因此，这三个因子的乘积和偶数项 $10n$ 均能被 $6$ 整除。",
      "$n^3+11n=(n-1)n(n+1)+12n$。这三个连续整数因子全是偶数，且至少一个能被 $3$ 整除。因此，这三个因子的乘积和 $12n$ 均能被 $6$ 整除。",
      "$n^3+11n=(n-1)n(n+1)+12n$。这三个连续整数因子中至少一个是偶数，且三个因子全能被 $3$ 整除。因此，这三个因子的乘积和 $12n$ 均能被 $6$ 整除。"
    ]
  },
  {
    stem: "设 $y_n=7^n-1$（$n$ 为正整数）。初始情况 $y_1=6$ 已验证。假设 $y_k=6m$，其中 $m$ 为整数，$k$ 是任意正整数。下列哪一个递推计算能正确完成归纳证明的递推步骤，证明每个 $y_n$ 都能被 $6$ 整除？",
    options: [
      "$y_{k+1}=7y_k=6(7m)$，是 $6$ 的整数倍。",
      "$y_{k+1}=y_k+6=6(m+1)$，是 $6$ 的整数倍。",
      "$y_{k+1}=7y_k-6=6(7m-1)$，是 $6$ 的整数倍。",
      "$y_{k+1}=7y_k+6=6(7m+1)$，是 $6$ 的整数倍。"
    ]
  }
];
const translated = [];
for (let index = 0; index < draft.questions.length; index++) {
  const question = draft.questions[index];
  const originalView = prior.questions[index].view;
  question.view.stem = views[index].stem;
  for (const [optionIndex, option] of question.view.options.entries()) {
    option.text = views[index].options[optionIndex];
  }
  translated.push({ id: question.id, view: question.view });
  for (const [before, after] of [
    [originalView.stem, question.view.stem],
    ...originalView.options.map((option, i) => [option.text, question.view.options[i].text])
  ]) {
    assert.deepEqual(after.match(/\$[^$]+\$/g), before.match(/\$[^$]+\$/g));
  }
  assert.deepEqual({ ...question, view: originalView }, prior.questions[index]);
}
fs.mkdirSync(output);
fs.writeFileSync(path.join(output, "seed.json"), fs.readFileSync(path.join(original, "seed.json")), { flag: "wx" });
fs.writeFileSync(path.join(output, "draft.json"), JSON.stringify(draft, null, 2) + "\n", { flag: "wx" });
fs.writeFileSync(path.join(output, "view-only.json"), JSON.stringify(translated, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ questions: draft.questions.length, view_path: `${output}/view-only.json`,
  formulas_identical: true, all_nonview_fields_identical: true }));
