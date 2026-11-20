# N64 离线答案作者交付

身份：STEMROBIN-188 / SAME188-6，仅答案作者。结论：**AUTHOR_CANDIDATE_PENDING_INDEPENDENT_REVIEW**。不是独审 PASS，不执行正式 finalize 或 publish。候选仍为 `draft`。

## 当前字节

根候选：`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n64-answer-author/answer-keys.candidate.json`

SHA256：`c1e8476fd7beebb6dcc0862b342201d0d0ab3fd8fafa514b45709edd46ab7f3a`；10011 bytes；实际 mode `0644`。

独立 FIRST：`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n64-answer-author/answer-keys.FIRST.json`

SHA256：`24e5f35315ffc023b776111eaf88dfbdd62143cf33920d7b8c0593e0464ed124`；9891 bytes；实际 mode `0444`。FIRST 独立文件，不是根候选的别名；修订后不动 FIRST。

## 输入绑定

下列四个实际输入的前后 SHA256 均一致；不是引用 JSON 内嵌的旧 source 哈希。

- 模板：`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n64-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s3-n64/answer-keys.template.json`；前后 `c31ecf9024b3116903897cd9d8bb7ac5fbf1053cbb76ebf1b22219a8f026f57d`。
- 现代 lesson：`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s3-n64/lesson.json`；前后 `bfd06a504247d374859a8ef65cca35916e268405f01375e9256d1e30986a3a37`。
- 现代 exercises：`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s3-n64/exercises.json`；前后 `d3f6634821215ab1fd9d4cd5b261b14a9a95f1f86abc6c03ed834f58ad0e91f1`。
- 现代 figures 清单：`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s3-n64/figures.json`；前后 `c4a4853af0a36eee6d1b5c9a20c9ad3af11ef3a178344a622061e67775c28351`。

正文是8个对象合计：6段正文、1个 fig、1个 cap；不是8段正文另加图。模板七项均无 `bookRaw`，故全部 `source: derived`；未打开原书答案文件。模板题文与当前现代七题逐项相同。232有1)、2*)两个实际小问。

## 独立逐题解

1. **229，ungraded。** 1) 球面上点仅有一个切面，法线是该点半径。2) 球面外点有无穷多个切面：令球心为 $C$、外点为 $P$，$d=|CP|>r>0$，切点满足 $\overrightarrow{CA}\cdot\overrightarrow{CP}=r^2$，在距离球心 $r^2/d<r$ 的平面上组成一圆；每个切点给出一个经过 $P$ 的不同切面。严格球内点没有切面。三维计数，不能用圆的“两条切线”类推切面数。无穷计数与说明不硬设有限 numeric。

2. **230，ungraded。** 1) 球面上点有无穷多条切线，恰为该点切面内所有过该点直线。以球心为原点，$p=\overrightarrow{CP}$，$v\ne0$，$p\cdot v=0$，则 $|p+t\cdot v|^2=r^2+t^2|v|^2$，只在 $t=0$ 与球面相交。2) 外点也有无穷多条切线，接触圆上每个点 $A$ 给出一条 $PA$，且 $CA\perp PA$；这些线组成切锥。球内没有切线。不是圆的球面上1条、外点2条。

3. **231，ungraded。** 1) 若 $O$ 在已知平面上，球心集合是过 $O$ 的法线去掉 $O$，即 $C=O+t n$，$t\ne0$，对应正半径 $|t|$；两侧都保留。若 $O$ 不属于平面，集合为空。2) 已知正半径 $r$，球心集合是平面两侧距离各为 $r$ 的两个平行平面。若原平面为 $n\cdot X=h$、$n$ 为单位法向量，则 $n\cdot C=h\pm r$。没有指定半空间不能只取一侧；零半径不属于通常球面。

4. **232，ungraded，两个小问。** 1) $R>0$，$0<\varphi<\pi$，两切面相异且不平行。过球心与棱的垂足作垂直棱的截平面，截成两直线，球心到两线距离均为 $R$。球心在所选角或对顶角内时，$d=R/\sin(\varphi/2)$；在相邻补角内时，$d=R/\cos(\varphi/2)$。题面未说明选取的二面角包含球心，不能习惯性把第一式当唯一；$\varphi=\pi/2$ 两式同为 $\sqrt2R$，端点0或 $\pi$ 不提供所需确定交棱。2*) 三坐标平面的距离条件是 $|a|=|b|=|c|=R$，正坐标条件唯一选出 $(R,R,R)$，球面方程 $(x-R)^2+(y-R)^2+(z-R)^2=R^2$；若指球体点集则用 $\le R^2$。去掉正坐标条件共有八种中心。schema 只能整题分配 grading，故不能用第2问掩盖第1问缺条件。距离和半径为相同长度单位，方程两侧为长度平方。

5. **233，ungraded。** 任取球面点 $A$，过它作垂直 $CA$ 的切面；绕切面中过 $A$ 的直线转角 $\varphi$ 得到截平面。普通平面角 $0\le\varphi\le\pi/2$，球心到截平面距离 $h=R\cos\varphi$，截圆半径平方 $R^2-h^2=R^2\sin^2\varphi$，面积 $S=\pi R^2\sin^2\varphi$。0角退化成一点，面积0；直角为大圆盘，面积 $\pi R^2$。面积是长度单位平方，不虚构 cm/m。作图步骤当前不能可靠判定，不能只核对面积就判整题。

6. **234，auto，三个 expression parts。** 三点平方和逐个为 $9,9,9$，都在球面上。法向量为 $(a,b,c)$，过切点的平面满足 $a(x-a)+b(y-b)+c(z-c)=0$，化为 $ax+by+cz=9$。1) $y=3$，亦即 $3y=9$；2) $2y-\sqrt5z=9$；3) $2x-2y-z=9$。三个 expected 都保持真实平面方程，明确 LaTeX 乘法；第1问保留两个等价写法，总计4个 expected。不改成只为解析方便的不同公式，不用 exact。当前 parser 的有界等式等价正反例已实查。

7. **235，ungraded。** $R>0$，$A(m,p,q)$ 在球面上，故 $m^2+p^2+q^2=R^2$ 且半径向量非零。切面过 $A$ 并以 $OA$ 为法线：$m(x-m)+p(y-p)+q(z-q)=0$，得到 $mx+py+qz=R^2$。反过来，该平面上的点满足 $OA\perp AX$，从而 $|OX|^2=R^2+|AX|^2$，与球面相交仅当 $X=A$，证明充分性。排除不在球面的切点和 $R=0$ 退化。完整证明展示，不用单个方程键冒充证明判定。

## 真实收据

- 结构检查只运行一次：`python3 -B .intentfold/tickets/STEMROBIN-188/tmp/n64-answer-author/check-structure.py`，exit0，7题、auto1/ungraded6，无错误。实际调用已有 `validate_lesson`，没有调用 `cmd_finalize`。收据 `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n64-answer-author/structure-check.FIRST.json`，SHA256 `553478a575637b03060b8c1d72502e665c6819927a28d5ced2bb19e5c8846edf`。
- 当前 expected parser 检查只运行一次：`node .intentfold/tickets/STEMROBIN-188/tmp/n64-answer-author/check-expected-parser.mjs`，exit0。实际已有 `validateMathExpected` 检查4项全部通过，同一有界检查使用 ComputeEngine 0.58.0 / Node v24.16.0 的 `input.isEqual(target)===true` 标准实查10个等价正例、6个错误反例，无错误。收据 `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n64-answer-author/expected-parser-check.FIRST.json`，SHA256 `305f2c051097502253d878b3f5ce0f40dbcc4f5a31004067128bb580bb9e5763`。
- 两份检查针对 FIRST 哈希 `24e5f35315ffc023b776111eaf88dfbdd62143cf33920d7b8c0593e0464ed124`，不把旧收据冒充对当前全文件重跑。其后只修订230的一个 ungraded `displayAnswer`，将可能被误读为函数的 `C(P+tv)` 换成显式定义的向量范数。真实修订1次、展示记号修复1处、数学结论变更0、expected修复0、机械修复0。原错误列表为空，没有伪造失败收据。
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n64-answer-author/integrity-receipt.json` 用 JSON 字段比较和哈希绑定确认只有 `/answers/1/displayAnswer` 变化，所有身份、grading、parts、expected 与 FIRST 完全相同；不是第二次结构/parser 验证。当前候选从根路径交付，保持可写，旧 FIRST 保持0444。
- expected 只有 expression；numeric0、exact0。因此没有 exact 编辑合同目标，MathLive调用0。没有产品端、浏览器编辑器、DB、正式 finalize 或 publish 验证；有界正反例不是全输入枚举，更不是独立数学审查。

## 图与边界

图清单仅阅读1次；全部 `figureEvidence`、题目 `figure_refs` 为空。图96仅属于正文。现代图查看0、原PNG查看0、FigureSpec读取0、旧图审查读取0、图渲染0、图重审0、付费图/模型调用0。没有因无题图而缺少具体答案。

只写授权目录；不读 choice、旧答案、其他作者或其他聊天，不读 `.env`，不访问 DB，不安装，不运行 Git，不修改应用/核心/正式课文，不回退他人文件，不重新 prepare，不调用正式 finalize/publish，不占用或重派独审者。

## 交付索引与待审

`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n64-answer-author/output-index.json` 的 `outputs` 只列本作者产物，每项严格使用绝对 `path`、真实 `sha256`、`bytes`、四位八进制 `mode`，包含当前根候选、独立FIRST、报告及检查收据；不列索引自身或预先已有的模板。JSON报告中的同形 `outputs` 排除报告自身、MD报告和索引，避免哈希环。

逐题数学正确性、232的二面角条件处理、233作图题分级及234自动判定资格仍待独审。没有独审 PASS，未应用、未发布。
