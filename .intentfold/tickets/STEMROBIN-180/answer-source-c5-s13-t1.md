# phy6-c5-s13-t1 Source-Only Answer Author Freeze

状态：**SOURCE_ONLY_AUTHOR_COMPLETE**，2/2完整独立源解；不是现代答案键、独立答案审批或发布结论。作者Wegener。本阶段在198/199 FIRST图审报告、officialreview及handoff全部冻结之后开始，产物单独保存，不改动图审冻结。

## Exact Inputs And Scope

仅本阶段读取的正文与题面输入：

- `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c5-s13-t1/lesson.json`，SHA `6c9deb8f508584f6957785b0cda79d18d074b7a17180d67a53276fcb15602ea8`；完整22块，来源物理211–214。
- 同目录 `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c5-s13-t1/exercises.json`，SHA `87b6bc1e9ad3a86b36ac741a6dd15ab8a9e5409e8f202424dea42b73ee6b35e0`；完整2题，`练习 41/g1`，原号与稳定号均1、2。

本人此前担任过本课现代文字独审者，不假称从未见过现代正文；此次源解没有重新读取候选现代文、任何主会话/其他作者答案、answer-source报告、答案键或选择题。只从以上批准raw重新提取原题独立推导。已读答案技能的分工规则，但不运行cap2/prepare/finalize或读取书后答案。

两题 `figure_refs=[]/figures=[]`，均不要求读图取值。正文四个水轮/风力机图不是两题的测量图；本阶段未读取它们的现代稿或声称现代图审批闭合。复用原页批准，不重审源页、不补造图像数据。

## 练习41 / g1 / 原题1

来源 `p0214#4`；原题完整：

> (1) 在河的什么地方每一立方米水的势能最大，在发源地还是在河口？为什么？

**作答**：按原题通常的河流由高处流向低处的情形，发源地处每一立方米水的重力势能较大，因为发源地高于河口；比较的是相同体积、近似相同密度的水，相对于同一水平参考面的高度不同。

**推导**：令每份水的体积为 \(V=1\,\mathrm{m^3}\)，共同密度为 \(\rho\)，则两份水质量相同，\(m=\rho V\)。在同一近地重力场、同一零势能参考面下：

\[
E_{\mathrm{源}}=\rho Vgh_{\mathrm{源}},\qquad
E_{\mathrm{口}}=\rho Vgh_{\mathrm{口}},
\]
\[
E_{\mathrm{源}}-E_{\mathrm{口}}
=\rho Vg(h_{\mathrm{源}}-h_{\mathrm{口}})>0
\quad\text{当 }h_{\mathrm{源}}>h_{\mathrm{口}}.
\]

单位：\((\mathrm{kg/m^3})(\mathrm{m^3})(\mathrm{N/kg})(\mathrm m)=\mathrm{N\,m}=\mathrm J\)。
可选河口所在水平面为零势能面，此时 \(E_{\mathrm{口}}=0\)，但这只是共同参考面的选择，不表示河口水“绝对没有能量”或没有动能。

**边界**：原题未给两处高度，不能计算具体焦耳数；若比较不同密度的水或不同参考面，不能仅按高度下同样结论。这里依据原题的正常河流高低情形，不宣称对泵送水、任意支流/人工河道都存在同样的全程最高点。理由不是“源头水更重”，也不是由流速决定重力势能。

## 练习41 / g1 / 原题2

来源 `p0214#5`；原题完整：

> (2) 是在山区的河流中，还是在平原地区的河流中，每一立方米流动着的水具有较多的动能？

**作答**：在原书所设想的典型山区河流比平原河流流得快、且水密度相同的条件下，山区河流的每一立方米水动能较多，因为质量相同而流速较大。但是仅有“山区／平原”的地理名称并不足以严格保证这个速度关系；实际应比较两处相对于同一地面参考系的水流速度。

**完整推导和条件**：

\[
m_{\mathrm{山}}=m_{\mathrm{平}}=\rho V,\quad V=1\,\mathrm{m^3},
\qquad E_k=\tfrac12\rho Vv^2,
\]
\[
E_{k,\mathrm{山}}-E_{k,\mathrm{平}}
=\tfrac12\rho V(v_{\mathrm{山}}^2-v_{\mathrm{平}}^2).
\]

若 \(v_{\mathrm{山}}>v_{\mathrm{平}}\)，山区每立方米动能较多；若流速相等，动能相等；若平原处流速较大，则平原处动能较多。原题不提供具体流速，不能强制无条件的地区排序，也不能伪造速度或数值倍率。两处速度均非零时才可写 \(E_{k,\mathrm{山}}/E_{k,\mathrm{平}}=(v_{\mathrm{山}}/v_{\mathrm{平}})^2\)。

单位：\(\mathrm{kg}\cdot(\mathrm{m/s})^2=\mathrm J\)。相同体积与共同密度意味着相同质量，不是把动能当成河流全部水量的能量；山区海拔较高不是本题动能较大的直接公式依据。较陡坡度可以解释原书典型流速背景，但局部流速还取决于河道条件，不能把它当已测数据。

## Numeric And Production Limits

正文原例的 \(9.8\times1000\times50=490000\,\mathrm J\)，按原书近似写约500000焦耳=500千焦耳；本源解不改raw公式，也不把该例的50米、1000千克或500千焦耳当成这两题的独立已知。\(g=9.8\,\mathrm{N/kg}\) 的原例与约整结果有明确区分，没有悄改为 \(g=10\)。

两题都需要说明比较理由及适用条件，建议未来答案作者完整展示为derived/ungraded；不能为自动判定只留“发源地／山区”而丢解释或速度条件。本稿不生成 `answer-keys.json`、parts或互动，不宣称完成实验、实测或现代答案审批。

源解报告与两份原始输入字节由 `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/answer-source-c5-s13-t1-wegener/author-handoff.json` 冻结。无DB/Git/发布、原题或图像修改。完成源解后停止，未来键比较须另行授权。
