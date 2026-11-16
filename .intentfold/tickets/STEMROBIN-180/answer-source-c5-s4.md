# phy6-c5-s4 SOURCE-only 答案作者冻结

2026-11-16。角色：独立于main私有解的**源答案作者**，不是本稿独立审查员。
状态：七道原题推导完整，冻结待最终现代TEXT及所需图独立批准通知。不是最终答案键，不是独立答案PASS，不执行prepare/retain/finalize/publish。

## 输入与实际读图

完整读取canonical raw `phy6-c5-s4/lesson.json`、`lesson.md`与完整七题`exercises.json`。实际逐张打开原PNG176/180/181；另实际打开原194完整扫描，核对六道问题、作业全部六印刷行、两对硬币、火柴盒要求及硬币质量附注。canonical191–194的MD/JSON字节纳入源绑定；没有宣称重新审查这四页所有像素。

| 输入 | SHA256 |
| --- | --- |
| canonical lesson.json | `c498c6fb90dda491d68701e127875eb7c3e7b64d9d27b43b051f97e79b663021` |
| canonical lesson.md | `be1e85a016053f1265c9b9985409e9aae177a58c9efb4ad0a33f54fca98dae89` |
| canonical exercises.json | `27f0ee2fdaf71ad84cb96c051ac96c46e1d09c52ed11c22ccc441634c9b7ec80` |
| 原fig176 PNG | `c8bd8fa74fc7f9751e4cc60f89a47e5c239e94582e09dca56d7e7ff98720bc92` |
| 原fig180 PNG | `2e4e439322dd71e17943a64aa28e3b0e15ed3e54d16e1833ed4a6a53514d333d` |
| 原fig181 PNG | `5ff76d068fe06f9c9ab0fcb13f84b4fcad63ce8a88a24dfcf45d858c079b838a` |
| 实际原194 PNG | `3ed1badf8f26f8c31e6725e166a6146f7bd2fe78d4fd868b131b865270bbacde` |
| source-inputbindings.json | `70e40566e6ba5cdedffa2d191d654da8c4bb6bfa9b733b1eef2e0963f8e1ca63` |

源输入绑定共17文件，含技能/gate2参考及canonical191–194页MD/JSON，另逐题保存原题完整文本、原行、栏目、原题号、页块和精确原题文本SHA。冻结前检查全部输入字节仍与先行捕获值一致，七题身份/文本与源记录一致。

原176保留两种工人施力与A/B/O/F/P；180为支点两侧挂砝码；181是A侧F1、B侧F2同向下但相反转动作用的示意。未从像素猜读数、标尺或比例，也未把图上的挂重数量当作硬币实验结果。题面自身七题的figure_refs均为空，三图作为完整源正文的物理上下文使用。

`exercises.md`不存在，完整题面权威为现有`exercises.json`。canonical页目录没有`page.png`，实际原194读取现有 `.tmp/ld-s10y-lesson/6p/pages/0194/page.png`，字节SHA与canonical194的render一致。没有为缺少这些可选路径新跑渲染或造图。

## 七题作者覆盖

| 源题身份 / 页块 | 完整推导内容 |
| --- | --- |
| 问题/g1/1，p0194#3 | 固体可绕固定支点/轴线转动的定义；不把任意棒或必然省力当定义 |
| 问题/g1/2，p0194#4 | 力臂为支点到确定力作用线的垂距，区分棒长、作用点距离与长度单位 |
| 问题/g1/3，p0194#5 | 定支点、作/延长作用线、作垂线并量OH；实际181中OA/OB及零力臂条件 |
| 问题/g1/4，p0194#6 | 顺/逆时针转动作用；大小/位置/方向影响；F1/F2同向下仍可相反转动；静止受力不必正在转动 |
| 问题/g1/5，p0194#7 | 正文砝码实验完整测力/量臂步骤及原给定2N/4N情形；独立推导F1l1=F2l2/反比；相反转动、支点反力及其他转动作用条件 |
| 问题/g1/6，p0194#8 | 阿基米德，保留源课科学史归属，不增加无来源生平细节 |
| 作业/g2/q1，p0194#10，source_number=null | 空尺中点先平衡；完整5/1、2/3硬币实验；实际量重心作用线对应力臂；检验理论反比；同一杠杆比较称火柴盒；误差、单位和盒重公式完整 |

每题是本作者从原题/原文/原图形成的推导，不参考书后答案或main私有解。原课240kg石头的已解示例只是完整raw正文的一部分，不增编为第八题。

## 实验不造测值

原附注给1/2/3/5戈比币分别为1/2/3/5g。理论上 `5d5=d1`、`d5:d1=1:5`，以及 `2d2=3d3`、`d2:d3=3:2`；均明确为理论预测，不是实测记录。

火柴盒用已知比较物重量WC配平，实测非零力臂dC、d箱后：

$$W_{\text{箱}}=W_C\frac{d_C}{d_{\text{箱}}}
=\frac{M}{1000}g\frac{d_C}{d_{\text{箱}}}\ \text{N},$$

M以克计，g以N/kg计；盒质量另为 `M*dC/d箱` 克，不将克数误当牛顿。若已知币位于不同力臂，使用各Wi·di之和，不随意乘一个共同力臂。

尺先在中点水平平衡消去其自重的净转动作用；保持窄稳支承、无额外手力/桌面接触。按真实重心作用线测量，盒内内容必须明确，不能默认不均匀装载盒的几何中心就是重心。复测/交换左右和先定位重心均是建议的可复现操作，不是假称已做的实验。

源题无力臂读数、盒内容或盒重数据。没有实施实验，actual_measurements及numerical_matchbox_weight保持null。纯公式不能代替实际操作记录，更不能凭含公式而将整个开放实验硬自动判题。此阶段不创建grading/parts/expected或最终答案schema；未来概念/作法/实验的开放性须随最终授权现代题面保留。

## 冻结产物与边界

隔离根：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/source-author-c5-s4`

- [source-only.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/source-author-c5-s4/source-only.json)：七题精确身份/完整原题、逐题理由/结论/条件/单位、实验完整操作及limitations。
- [source-only.md](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/source-author-c5-s4/source-only.md)：完整书写解与全部实验步骤。
- [source-inputbindings.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/source-author-c5-s4/source-inputbindings.json)：17源文件及七原题精确绑定、实际PNG观察。
- [author-handoff.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/source-author-c5-s4/author-handoff.json)：绑定本报告、上述三产物及所有作者scratch字节；`independent_approval:false`、`final_keys_created:false`。

新增执行只有本scratch的源输入SHA捕获与冻结一致性检查；officialprepare/retain/finalize、图制作/渲染/裁图、浏览器、DB、Git、环境安装/配置、模型/网络服务及publish均0。没有读取任何main私有answer-source、书后答案、旧key、choices或现代作者候选；没有改canonical或其他作者产物。

待main提供最终现代TEXT及所需图独立批准通知后，才另行授权最终答案作者绑定。本次源解冻结不冒充现代收口或独立审查批准。
