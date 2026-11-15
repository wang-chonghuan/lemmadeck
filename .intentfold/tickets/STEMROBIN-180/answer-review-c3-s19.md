# Batch 4 s19 Independent Key Review

2026-11-15。审查者：Sagan，independent_agent；不是现代正文或答案作者。

**首审结论：PASS（phy6-c3-s19全部9答案的独立gate2实质审查）。**
复用已经先于作者键保存的9题独立源解，不倒改该基线。当前持久现代题文与已审模板逐项相同，正文/分段与已审模板一致；本次只核对finalize后的受影响绑定与新答案，不重审其他课。

当前答案文件实际为 `status: draft`。本报告不是答案finalize或发布记录，没有借现代adapt-finalize或此前图审批代替答案审查。未发现须动用修复的实质缺陷，未修改作者文件或制造拒绝/修复历史。

## 实际读取与绑定

仓库：`/Users/yong/.codex/worktrees/0f12/lemmadeck`。以下为仓库相对路径，哈希均由Node crypto对实际文件完整字节计算。

| 实际读取/复用文件 | SHA256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s19/answer-keys.json` | `c101e248e14529e9aba52b6759affeb1523212b6485ff725b2f9fdc7e3d6fa98` |
| 同一持久现代目录 `lesson.json` | `0cc12f01903cfc1a91d850fe8a324e8c07c3fdc1b9828b51bee1c6e70f11f811` |
| 同一持久现代目录 `exercises.json` | `8dce7c854274ce1ed1e9665a1106ebf0fad7907ecb712abbbfc205fe89b279a0` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s19/lesson.json` | `34b963cfdfd140d097841f026ae33415a35552578d469c165f390d072bbdb3cf` |
| 同一source目录 `exercises.json` | `6d3bac77ed7843582c80ad3f3c2ecb1196d77ddfeb081aa77c30b0f269144336` |
| `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s19/lesson.template.json` | `172df705f3c6afcb3dd5b89dacdcb9d5b8d06af633cb4a7f4dbd639cfc41a934` |
| 同一现代scratch目录 `exercises.template.json` | `ecb81c7ab2e362cb45a40ffdab418ca32ae380a8684ff274926be83e13373860` |
| `.intentfold/tickets/STEMROBIN-180/tmp/answers/batch-4-s19-independent-source.md` | `c222c18490bd2404118bab3f2b15a1a50548954ad83b7744b597bc5c37060e84` |
| `.intentfold/tickets/STEMROBIN-180/modern-text-review-c3-s19.md`（既有文字结论与哈希复用） | `2bf0cf55703b1f31e446687578dd4fa966ae57dc955aa420904439fdbd0dffcc` |
| `.claude/skills/ld-s10y-answer/SKILL.md` | `afc242003e5bc2f3165dfc5bee60e2e684ed85e2627c7d57ce3501cdd76bfc83` |
| `.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md` | `9f2c6e2b781b008af8141f9685c20fc7cefb2a2ef457d05ac689070c504274a9` |

实际先重新读取独立源解，再比较授权的全部9个键。持久现代上层正文/题文亦实际读取；只读断言验证其与已审模板一致，以及两份嵌入source.data/source.sha256与真实source文件一致。

## 逐题标准答案与grading

每一行均同时核对现代完整题面、原独立解、实际displayAnswer、parts、unit及grading。下表中的题号保留实际稳定身份，不将“问题1”与“练习15题1”混同。

| exercise / 源身份 | 独立比较及理由 | grading / parts | 结论 |
| --- | --- | --- | --- |
| `1` / g1-1，`p0086#13` | 答案完整说明与选定力单位比较、确定倍数并写数值和单位；不误作质量测量。与源正文块1/2及先行独立解一致。开放解释不伪造词匹配判分。 | ungraded / 0 | PASS |
| `2` / g1-2，`p0086#14` | N、kN及1kN=1000N正确；适用于重力、弹力等力，非仅重量。没有把kg作为力单位或额外考查历史人物。 | ungraded / 0 | PASS |
| `3` / g1-3，`p0086#15` | 1kg、1s、1m/s速度变化三项完整；明确产生变化的合力以及其他力抵消的边界，未说任意单个施力必改变速度。速度变化不等于已有该速度；1N=1kg·m/s²可由完整定义推导。 | ungraded / 0 | PASS |
| `4` / g1-4，`p0086#16` | 1kg按g=9.8N/kg得9.8N；明确用课文允许的g约10估算得约10N。displayAnswer保留地点/重力条件，不冒称所有地点精确相同；numeric part同时列两种源有据值。 | auto / 1，牛顿 | PASS |
| `5` / g1-5，`p0087#1` | F=gm、先把m换成kg、当地g以N/kg计算及F以N表达完整；9.8与10近似有明确口径。题目求方法，不强制仅判一个公式词串。 | ungraded / 0 | PASS |
| `6` / g1-6，`p0087#2` | 水平支承相对地球静止、物体静止、无其他外力改变支承受力的条件完整；P=gm及重量作用于支承物/悬挂物、重力作用于物体的区别正确。“大小相等”不混作同一个力。 | ungraded / 0 | PASS |
| `g2-1` / g2-1，`p0087#4` | 2.5kg、800g、1.2公制吨、50g四量及顺序保留；换算0.8/1200/0.05kg正确，F=gm，两套结果见下表。displayAnswer给完整换算及推导，四个独立parts标签与质量逐一配对。 | auto / 4，各牛顿 | PASS |
| `g2-2` / g2-2，`p0087#5` | 本课静止水平支承的重量约定明确；200g=0.2kg及P=gm正确，两物体的重量与两套g取值逐一配对，未偷换成kg。 | auto / 2，各牛顿 | PASS |
| `g2-3` / g2-3，`p0087#6` | 完整P=gm逆运算m=P/g；800/9.8=4000/49kg，约81.63kg；g约10时约80kg。80并非81.632653…普通舍入。notes说明源允许两套g且未指定近似精度，采用ungraded，不用有限名单误拒合理舍入。标准展示仍有完整公式、两套结果和kg单位。 | ungraded / 0 | PASS |

原独立源解曾说明“若自动判定，g2-3须有1个part”，并未要求必须自动。本稿因未指定精度采用ungraded有具体判分可靠性理由，仍提供完整标准答案，因此不需要修改或抹去原源解。

## 全部7个auto parts复算

独立从题面质量换成kg，以9.8及10分别相乘；未把作者expected抄作计算依据。以下每个part均为 `judge: numeric`，实际 `unit: 牛顿`，无显式tolerance字段，未用大容差把两套口径混成连续区间。

| exercise / 实际label | 独立m/kg | g=9.8所得N | g约10所得N | 实际expected | 判断 |
| --- | --- | --- | --- | --- | --- |
| `4` / 重力 | 1 | 9.8 | 约10 | `["9.8","10"]` | PASS |
| `g2-1` / 2.5千克物体的重力 | 2.5 | 24.5 | 约25 | `["24.5","25"]` | PASS |
| `g2-1` / 800克物体的重力 | 0.8 | 7.84 | 约8 | `["7.84","8"]` | PASS |
| `g2-1` / 1.2吨物体的重力 | 1200 | 11760 | 约12000 | `["11760","12000"]` | PASS |
| `g2-1` / 50克物体的重力 | 0.05 | 0.49 | 约0.5 | `["0.49","0.5"]` | PASS |
| `g2-2` / 10千克物体的重量 | 10 | 98 | 约100 | `["98","100"]` | PASS |
| `g2-2` / 200克物体的重量 | 0.2 | 1.96 | 约2 | `["1.96","2"]` | PASS |

上述有限候选是逐量使用课文两种g口径的结果，不是对g2-3无限合理舍入的穷举。每个expected均为可输入的纯数值，不含说明文字或将N/kN数值混写在同一单位下。题4的地点/近似说明作为展示解释保留，不声称单一numeric框能够自动验证学生是否口头说明了g取值。

## gate2检查与边界

- 实际9题、9键，一一对应，无漏题/重题。顺序为 `1,2,3,4,5,6,g2-1,g2-2,g2-3`；全部prompt逐字匹配现代题文。
- 源身份按 `(phy6-c3-s19, group_id, source_number)` 核对：g1原题1至6、g2原题1至3。持久题面的group/page身份与基线一致，未把栏目重号误配。
- 全部 `source: derived`，无bookRaw；这是依据完整题面/现代正文现场求解后的比对，没有读取或冒充书后答案。无姓名/年份待求量，也未在标准答案增加无题据历史实体。
- 3题auto共7个parts覆盖全部有序待求量；余6题ungraded均有完整displayAnswer。公式、单位、静态条件与近似边界没有因为ungraded而省略。
- 全部9题figure_refs/figures与键figureEvidence实际为空。不依赖附图，不新增或借用图review证据。
- 实际Node只读断言及独立复算退出0：身份/数量、prompt、derived来源、grading、parts数量/标签/单位、两套数值、现代/模板/源快照一致性均PASS。
- 未执行 `lesson_answers.py finalize`、MathLive/产品判题UI或发布。本组没有exact parts；没有把字符串自比或数值复算冒充真实编辑器输入链测试。实际运行时数值容差未在本审查测量。
- 精确部署模型ID、推理设置及累计输入/输出/总token不可观察，均未知。审查身份Sagan；未调用外部模型。

实际只新增本报告，原独立解及正文报告未改。未读15/16键、choice作者/稿、其他课答案或作者计划；不finalize、不DB、不Git、不网络/服务、不发布。完成后停止，等待用户下一步授权。
