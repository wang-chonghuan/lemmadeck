# Batch 4 s15 Independent Key Review

2026-11-15。独立审查者：Sagan，independent_agent；不是正文或答案作者。

**首审结论：PASS，phy6-c3-s15全部4个derived/ungraded答案。**
复用 `batch-4-independent-source.md` 中先于作者键完成的s15独立基线，逐题比较当前标准答案；不重解source15/16，不倒改原独立结论。未发现需启用一次affected repair的实质缺陷，只新增本报告，不修改作者文件或先前报告。

本批已完成的独立键比较数量为s15四题、s16四题、s19九题，共17道原书书写任务；不包含blocked s17或s18-t1，不因原源解文件曾包含这两课就将其纳入本批批准。本次只审s15新键，不重审s16/s19或验证其发布状态。

## 实际范围与哈希

仓库 `/Users/yong/.codex/worktrees/0f12/lemmadeck`；以下为仓库相对路径。SHA256均由Node crypto对实际完整文件字节计算。

| 文件 | SHA256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s15/answer-keys.json` | `1cb73c282f72e356256a90bc54a96c56e00d9c5b0c39a62141595d568e4037ce` |
| 同一持久现代目录 `lesson.json` | `ab12b5c1317d957252785505af3362813c3d9214cba141af97a1282845ab022f` |
| 同一持久现代目录 `exercises.json` | `7faf1895ad7862e4d5fdb4a498738f894b2fb75292790dc1ad4e395b7648e9c0` |
| `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s15/lesson.template.json` | `6220965c96d575ebfc474309626cd54ea94605703c43f4f5c4bb73d021cadae8` |
| 同一scratch现代目录 `exercises.template.json` | `794143435f24a4a53d42bad7e37effa574dd172b4ed9c26f2ba06787223962c4` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s15/lesson.json`（仅核文件哈希） | `a731588db8d7a8fbd019308f905f03d0670453d32141061f0065c0dae48ab6dd` |
| 同一source目录 `exercises.json`（仅核文件哈希） | `43465bcaa046b80482e6613bf55a52e3300f15282029df9f114baa695e942f99` |
| `.intentfold/tickets/STEMROBIN-180/tmp/answers/batch-4-independent-source.md` | `665c0bd928cd29c4f5019a7c3a3dbe8335aba55b59e677d2192747532a1e2d0b` |
| `.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md`（沿用本轮已实际读取的规则） | `9f2c6e2b781b008af8141f9685c20fc7cefb2a2ef457d05ac689070c504274a9` |

实际读取先行源解中的s15四题、授权的四个完整标准答案，以及持久现代上层正文/题文。当前两份template哈希与独立基线相同；持久prose/section_breaks及exercises数组与template逐字段一致。两份持久现代文件的source.sha256分别与当前source文件字节哈希一致；没有重新阅读源逐段求解或重做源像素检查。

## 四题逐项比较

块号沿用原独立基线的现代上层prose一基顺序。

| exercise / 源身份 | 原独立基线与当前标准答案比较 | grading / parts / unit | 结论 |
| --- | --- | --- | --- |
| `1` / g1-1，`p0077#10` | 开始运动、停止运动、速度大小或方向改变，以及形状改变两类效果均保留。明确这些是可能效果，不等于任何力都必然改变运动状态；未强迫两类效果同时出现。与正文块1/12/13/14及先行独立解一致，不仅答“加速”。 | ungraded / 0 / 无数值单位待填 | PASS |
| `2` / g1-2，`p0078#1` | 四个实例全部完整：人推静止斗车使其运动；磁铁吸引软木上的铁块，使两者运动；压缩弹簧伸长推动球；手或球拍使飞来的球停止或转向。每例明确施力物体、受作用物体及速度如何改变。满足“一些”而非只列一个名词，依据块2/7/8/11；不拿仅发生形变的例子替代速度变化。 | ungraded / 0 / 无数值单位待填 | PASS |
| `3` / g1-3，`p0078#2` | 力是物体对物体的作用；按本课表述是速度变化的原因，也可引起形变；有大小、是物理量。与块13/14/19及原独立解一致。“运动本身不证明有沿运动方向的力”补充边界正确，未把力定义为速度、速率增加或只有运动物体才有的属性。题1的“可能而非必然”边界亦保持，不制造任意单个力必加速的结论。 | ungraded / 0 / 无数值单位待填 | PASS |
| `4` / g1-4，`p0078#3` | 完整因果为各部分位移不同、相对位置改变、发生形变。球被压缩、木板中部比两端下移更多两个例子与块14一致；明确相同整体平移不改变形状，不循环答“因为受力”，也不声称任意受力都必有可见形变。 | ungraded / 0 / 无数值单位待填 | PASS |

四题允许开放解释或多种正确实例，derived/ungraded合理；每个displayAnswer仍提供完整标准定义、例子或理由。没有通过单词exact匹配伪造判分，也没有遗漏应拆为numeric parts的待求量或单位。题2的四例、题4的两例是各自同一道书写题的解释内容，不额外增加本批原题数量。

## 对齐与实际检查

- 实际键文件为 `ld-s10y-answer/lesson-answers@1`，book=6p、lesson=phy6-c3-s15、edition=modern-us-neutral、status=draft；持久现代lesson/exercises为ready。答案finalize仍由用户随后执行。
- 实际四题四键，exercise顺序为1/2/3/4，无漏题或重题；每个键prompt逐字等于现代题文，group_id=g1、group=问题、source_number分别为1至4，页引用逐项匹配。
- 题2实际prompt保留现代题文末尾的句点；比较以文件真实文本为准，不把独立解中的题文转述标点误当成生产修改。
- 全部source=derived，无bookRaw；未读取书后答案、choice稿/作者解或作者计划作为依据。全部grading=ungraded、parts=[]，且四个displayAnswer均非空并已逐项实质审查。
- 全部四题figure_refs/figures及键figureEvidence实际为空。正文虽含图项，本四答案依赖现代文字可完整解释；未重审图片或借图PASS替代答案判断。
- 答案未增加姓名、国家、年份、数值或测量数据；historical_entities为空合理。未引入本课未要求的单位换算或数值定律。
- 实际Node只读断言退出0：schema/edition/状态、题量/题号/栏目/页引用、prompt、derived/ungraded、空parts/图证据、原template哈希、持久文字一致性及source.sha256绑定均PASS。断言不代替上述四项独立物理判断。
- 未执行prepare/finalize/publish、产品输入链测试、DB、Git或网络/模型服务操作；不把结构检查冒充答案finalize或整课发布PASS。

实际只新增本报告，先行独立源解与其他审查记录保留不变。精确部署模型ID、推理设置及累计输入/输出/总token不可观察，均未知。完成后停止，等待用户处理finalize或另行授权。
