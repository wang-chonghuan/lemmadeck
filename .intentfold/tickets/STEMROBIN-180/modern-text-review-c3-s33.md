# s33 / §47 独立现代文字审查

审查者：Sagan，独立于 Ramanujan 作者。结论：**TEXT PASS**，仅针对下列冻结 lesson/exercises 模板的完整现代文字、四道原书写题、来源绑定和图引用对应。不是现代图92/93审批、adapt-finalize、装订或整课完整批准。

## 范围与实际证据

完整对照 `.tmp/ld-s10y-lesson/approved-through-120/artifacts/6p/lessons/phy6-c3-s33/{lesson,exercises}.json` 与 `.tmp/ld-s10y-lesson/text-author-c3-s31-s33/adapt/6p/modern-us-neutral/lessons/phy6-c3-s33/{lesson,exercises}.template.json`。现代语义只取上层 prose/exercises，不把 source.data 当现代文字。复用已批准源页像素，不重审源114–116或121+。

为落实本次文本所需的子图引用对应，实际以 `view_image(original)` 打开 `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-92.png`，仅核对源装置状态与源子标；没有打开、审查或批准现代图92/93，也没有执行图技能审批。随后核对候选 figures.template.json 的图身份与来源清单、作者 handoff/notes、保留的首次失败及现有机械报告；作者声称的 PASS 不作为独立物理依据。

没有读取 answer-source-c3-s33.md、任何标准答案、作者答案、选择题或 s31 候选。不审图90/91或新源页，不作发布、晋升、源码/模板修改。

## 全部12块

以下 B0–B11 为实际 prose 的零基索引；全部均与 raw 的 kind/id/label/printed_page/source_refs 一一相等，source_text 与对应 raw.text 完全相等。

| 块 / source_refs | 独立结论 |
| --- | --- |
| B0 / p0114#5 | PASS。碰撞产生压强保留；补“单位面积、相同时间、每次平均作用相近”，避免把总碰撞次数或不同强度直接当压强判据。 |
| B1 / p0114#6 | PASS。质量固定、同温比较明确；每立方厘米分子数、密度、碰撞频率和压强增大的因果链全部保留，未添加数值比例。 |
| B2 / p0114#7 | PASS。玻璃管、薄橡皮膜、活塞、封闭气体及向内压缩/外凸完整。一般图92引用与初始a、压缩b均在；同外压和恢复比较温度是控制条件，不是给出题目答案。 |
| B3 / p0114#8 | PASS。fig-92 的身份、空文本和原块位置保留，不用文字概念替代图对象。 |
| B4 / p0114#9 | PASS。独立 caption“图92”及标签保留。 |
| B5 / p0115#1 | PASS。扩张时分子数密度、碰撞、压强的反向链，向外拉/内凹以及其他气体的同条件比较全部保留。子图c的来源判断见下文，不把它冒称单纯“б→c”转写。 |
| B6 / p0115#2 | PASS。两向体积变化的定性结论及完整强调保留；补固定质量/温度，不声称无条件或给出精确反比公式。 |
| B7 / p0115#3 | PASS。固定质量、封闭定容的加热比较明确；平均速度、撞击频率和平均碰撞作用增大三个环节均保留。没有把每一个分子的瞬时速度都断言相同或必然增大。 |
| B8 / p0115#4 | PASS。定质量、定容、温度越高压强越大的强调结论保留。 |
| B9 / p0115#5,p0115#8 | PASS。储存/运输、压缩导致高压、专用坚固钢瓶及图93、压缩空气/焊接氧气均保留。潜艇改潜水设备已记 context；“尽量压缩”改限定安全条件已记 clarification，无虚构额定压力或无穷压缩。 |
| B10 / p0115#6 | PASS。fig-93 原图对象身份、来源及位置保留，没有由正文推定现代成图通过。 |
| B11 / p0115#7 | PASS。独立 caption“图93”及标签保留。 |

适用边界：上述是本课气体分子碰撞的简化定性模型和指定比较条件，不推广为任意物态、任意泄漏或温度过程下都成立的无条件定律。

## 子图对应的独立判读

实际源PNG从左到右为：标а的初始状态（膜底近直）；标б的活塞向下/向内压缩状态（下向箭头、膜外凸）；标в的活塞向上/向外拉状态（上向箭头、膜内凹）。因此自然顺序拉丁标a/b/c分别对应源а/б/в。

raw 的压缩段引用б与像素一致；raw 膨胀段也写б，却描述向外拉和内凹，与中间б状态不符。候选膨胀段引用c对应原第三幅в，保留同一图、同一组的实际状态，而非用“膨胀”概念造一个新图对象。作者已在该块 changes 写 `source-figure-reference`，notes 明记原引用错误，source_text/source.data 仍原样保存б。本项是有源像素依据且公开记录的正文图引用纠正，不是公式或数值改写；不伪造数学 errata，也不把原始源字默改。

此结论只批准文字应指向第三子图；后续现代图仍须独立验证真实 a/b/c 状态、装置和子标，不能用本 TEXT PASS 替代。

## 四道原书写题

四题的 number/source_number=1–4、group=问题、group_id=g1、pages 均与 raw 相等；第二题跨 p0115#11/p0116#1 绑定完整。每题 figure_refs/figures 都为空，未增题、删题、变选择或增加评分部件。

| 题 / pages | 独立任务忠实性 |
| --- | --- |
| 1 / p0115#10 | PASS。压缩与膨胀两方向及“为什么”都保留，固定质量/温度澄清排除混入变温或漏气条件；没有吞掉分子层面的解释任务。 |
| 2 / p0115#11,p0116#1 | PASS。冷/热状态比较与理由均保留；封闭定质量/定容使比较确定，不把一般受热膨胀误当定容加热。 |
| 3 / p0116#2 | PASS。“为什么专用气瓶”仍是开放理由题，保存→储存仅措辞；未要求不存在的额定数值、材料量或读图测量。 |
| 4 / p0116#3 | PASS。同容积第二空瓶连通的原任务完整；把“空”明确为抽空，并注明封闭不漏气和回到初温，避免第二瓶仍有空气或变温带来的歧义。仍只问压强怎样变化，没有提供结论或数值比例。 |

表达损失：原四题均仍为书写任务，保留比较、解释和自主组织答案；没有选择化或自动判定损失。控制条件使原口语歧义收窄，该收窄已逐题记录 clarification，不是隐藏的新题或新数据。

## 来源、排版和历史

实际 read-only Node 结构对照结果：两份 source.data 与 approved-only raw 深相等；两份 source.sha256 与实际 raw 字节哈希相等；lesson 元数据和图清单相等；12/12块及4/4题的身份/引用/source_text 核对全部 true。四题 lines 拼接与各自现代 text 相等。现代 prose/exercises 按字符码位检查，西里尔字母数为0；只在忠实原文快照出现原标。没有人物身份、年代或新非公式数值，numeric_changes 与 historical_entities 均为空，无未声明文化身份。

实际运行一次只读 `node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs <候选lesson.template.json> --json`，输出9个实际文字段，两个相邻 before/after 锚点解析为 `[6,8]`，与模板相等。概念顺序为体积结论→加热比较、温度结论→储运应用；没有手算块数或用横线截断题/图所属组。

首次作者失败保留在 `.tmp/ld-s10y-lesson/text-author-c3-s31-s33/failure-01-s33-figure-reference-signatures/`。实际新旧结构差异只有 B2 恢复一般“图92所示”的引用及 B5 删除“图 92”中的一个空格；其余 lesson 字段深相等，exercises/figures 模板字节相同。这是作者各受影响单位1/1的历史，不冒称独立首轮拒绝，也不覆盖失败记录。现有 text-author-check.json 的 errors/katex_warnings 为空，仅作机械证据，本次没有重跑该 checker、finalize 或图渲染。

## 冻结字节 SHA256

以下为本审查实际读取文件后计算的完整字节 SHA256，非手猜 canonical 值：

| 文件（上述候选/raw目录内） | SHA256 |
| --- | --- |
| candidate lesson.template.json | `59c4c7dbecf060f484ab4619895df0bf509beec754c16c6e7ad8760e360c1c10` |
| candidate exercises.template.json | `fce2caea60941e5637e8172e2a2b9c9ea2396590895caa32f683d4f0e6379b83` |
| candidate figures.template.json（仅清单） | `335d606a87a19df7d43d82400740d2e11cc111ea4eccc77066ae72cc7104c26f` |
| approved-only raw lesson.json | `fc8405b26a7f1ed2a9fa8dc9b0de5f605d40f5af42fb37db084abea71e39b5c9` |
| approved-only raw exercises.json | `99c7f7d8580187cadfdb9926e3d90ad144160f6b2891e9eea91f19abf3259e70` |
| 实际打开的原 fig-92.png | `0fa0f7517c8f519a703d2eaaa88946861d9fb786265fd64d519b985712e11aa7` |
| candidate author-handoff.json | `6437b54fd9bd0d9fe2e34128e8625bb265b7fa472e3aae56c7b681b118b1c7fd` |
| candidate author-notes.md | `c4aa262ec7cc57adb6d732ac2d7b908b62c062eb84a7e7fa56137c36b1c9a158` |
| candidate text-author-check.json | `f31781dafdc91eb112aba68c1769b5d3a9c6faa38130c22b6ff141c60c402230` |
| retained first lesson.template.json | `edc2b1163945521ad8a4e49918eeb871e7c6cc79e2fcbc221825fa512ce9f379` |
| retained first text-author-check.json | `b2c497b7e4a11fc30cbd29ca571ef020546678be16a57da4abdb9aa87fac9356` |
| retained first-failure.md | `7d4d1055d6c7fdb092401bfd6e947f92277208c73fe320ecf9245e87c1c5c86f` |

只写本报告；不改作者稿/源/工具，不读答案或choices，无浏览器、DB、Git、网络或外部模型调用。精确模型部署、推理设置、可观察token/费用计量未知。s33本次文字审查收口，图件及整课批准仍待各自门禁。
