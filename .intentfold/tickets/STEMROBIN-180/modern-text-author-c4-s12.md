# C4-S12 Modern Text Author Freeze

STEMROBIN-180,2026-11-15. `phy6-c4-s12`, printed§59“无液气压计”。
**完整作者稿已冻结，待一次独立全文审查；不自审批或晋升。**

## Scope And Complete Reading

完整读取 durable raw `lesson.json`、`lesson.md`、`exercises.json`，
lesson skill、modern-us-neutral profile、edition text contract及现有生产参数/API。
来源完整8块，4项任务，图150/151，脚注1项；无独立表格。
8块=4个文字块（含脚注）、2个图块、2个图题；现代显示6个正文短段落。
4任务=问题1/2/3（g1）及无编号作业q1（g2），未用新题替代实作。

图150/151原始PNG均实际单独打开；图150另作最近邻2倍放大观察，
没有重绘或改原像素。机构及刻度完整上下文冻结在
[original-figure-observations.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s12/original-figure-observations.json)。
SHA256 `aa9905d21036b49e289e6ac4c7708ef5576fe66e8d18327ed40cb45da573b088`。

## Source And Figure Facts

原图150保留圆壳、双层弧形刻度、中心机构窗、向上指针及下部配重。
外圈实际数字960–1040，内圈可见720/730/740/760/770/780；
中心指针遮住部分字形，750解释来自原完整正文，而非臆读被遮数字。
外圈没有明确单位；不增写hPa、Pa、mbar或其他猜测，不造精确小刻度数。
器材数据属于针盘刻度，不冒称存在来源表格。

原图151实际标签1/2/3/4对应原文的波纹抽气金属盒、弹簧片、
传动机构、指针；保留右侧固定支架及相连机构。上盖随气压变化
凹下/被弹簧拉起的关系完整，不改成液体腔或添加灵敏度等校准数据。

| Complete Raw Input | SHA256 |
|---|---|
|lesson.json|`7d8d6e6ac4cc3fd50ed0baf59cbb5ac80e6883f7e4a65e69336bbd6c61a27ec9`|
|lesson.md|`772ee78c4a04bd8e95b2aa2f91be218536bd51ca460705d4666c5adcdfa10d1c`|
|exercises.json|`b3b747e66fed1c847421e699a860f8b820118c3793f1377267802f1ee18913fc`|
|fig-150.png|`c9ca7243a874f810e473986a2a2e1a41eafd94a40eb837b428ac66fc29012735`|
|fig-151.png|`308a4a800df17d9b92e0cef61a74238d058ae0438512aa46e294c49af258e1a1`|

Raw目录：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c4-s12`。
原图在同册 `figures/fig-150.png`、`fig-151.png`，其PNG/SVG完整绑定在handoff。

## Every Authored Change

- prose0：定义句现代措辞及句号，仍为常用的金属无液气压计。
- prose1：只改句号；完整保留源脚注及“不含水银”的解释，标题脚注公式字节不变。
- prose2：完整机构说明按完整语句改写、由官方normalizer分成3段。
  抽气金属盒1、弹簧片2、指针4经传动机构3、压力两向变化、
  根据水银气压计示数校准的粗体“刻度盘”全部保留。
  唯一单位澄清是把原750对应750毫米水银柱明确称为毫米汞柱（mmHg）；
  限于原示数例子，不替外圈猜单位。
- prose3–6：两个图块和两个图题不改身份、来源或文字。
- prose7：天气段仅现代措辞；仍称气压变化与天气有关且观测重要，
  不添加“只凭气压即可唯一预测天气”的结论。
- 题1：完整不改；题2：“怎样刻度”改为“刻度怎样校准”，目标不变、不写答案。
- 题3：“测定”改“测量”，不同地点、有系统测量条件全部保留。
- q1：整理原学校实验室墙上水银/无液气压计场景，认真学习测压、
  一段时间内持续观察完整保留；“记录变化”是观察结果的明确化，
  不造测量值、时长或新实验。

所有 `numeric_changes=[]`、`historical_entities=[]`。
本课没有需声明的真实历史人物/地点；原脚注是仪器名称说明，完整保留。
公式字节未变，150/151、机构1/2/4/3及750两次等原数据不变。
官方 `number_signature` 会遗漏紧邻中文的数字，因此handoff另列逐块
全部literal digit tokens供独审比对；没有靠该限制放行数值改写。

## Official Prepare And Text-Only Evidence

工作目录 `/Users/yong/.codex/worktrees/0f12/lemmadeck`，共享Python均使用
`PYTHONDONTWRITEBYTECODE=1`与`-B`。唯一official prepare：

```sh
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py adapt-prepare --book 6p --edition modern-us-neutral --lesson phy6-c4-s12 --root ssot-resources/soviet10year-textbooks/artifacts --work .tmp/ld-s10y-lesson/text-author-c4-s12
```

exit0，8正文块/4题/2图；`--books`留默认。只写新scratch，不覆盖canonical。
编辑用apply_patch，随后调用现有 `normalize_lesson_layout`、
`normalize_exercise_layout`；规范化记录在 `normalization.json`。

实际运行 `node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs <候选lesson.template.json>`，
exit0，复制其真实相邻对象，最终resolvedBreaks为4和5：
机构动作段→刻度读数段；刻度读数段→天气观测段。
没有手算块索引替代anchor。完整before/after字节在模板、check及handoff。

唯一text-only机械检查：

```sh
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/ld-s10y-lesson/text-author-c4-s12/author-text-tools.py check
```

exit0，errors=[]、math_warnings=[]：来源快照、所有身份字段/绑定、
题号/分组/实作、声明、数字/公式、图引用、normalizer幂等、两边界通过。
复用official prepare的零errata，不重跑源勘误/源页或完整lesson/图门禁。
这是作者机械证据，不是独立语义审批。

[text-only-check.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s12/text-only-check.json)，5731bytes：
`c94c12db1ab5c524a3941c2e913f04682cb0d900f21f24e156d7281a08619f01`。
每次命令原argv、stdout/stderr、exit/hash均在scratch `evidence/*.call.json`，
无失败或修复轮，未覆盖任何firstFAIL。

## Immutable Candidate

模板目录：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s12/adapt/6p/modern-us-neutral/lessons/phy6-c4-s12`

| File | Bytes | SHA256 |
|---|---:|---|
|lesson.template.json|9825|`0fc208f0b5a0c7b99920d84f8c073e5ac68d0797331b127e550be630d2a26b52`|
|exercises.template.json|5185|`c8b7f5412902e8e697d010f9bad453930d31c9a349a23acbdcde9fa520b00be8`|
|figures.template.json|1134|`c4415173e73ac95fe7bd28e0f799b13d1a7aae66a02887d59c2406c8a6b22a5d`|

[author-handoff.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s12/author-handoff.json)，29283bytes：
`5af1c25fdc09e200a359ca6830b15f3213b76119260b3450b3b081122c058af6`。
完整逐块原/现代文本、逐题全文/hash、原PNG/SVG、模板、工具记录、
anchor及未完成依赖均已绑定。完整正文组合hash：
`c80cb6c3330456e09a2d4af5da0dfed087d17f42ffd495c2df1a28067be45cce`；
四题组合hash：
`9cd9d32f8902274bcac3419fe30f5470c09c9e592de180ee7bddf51ba605a7e9`。

现代figuretemplates只保留official source绑定和待制作路径，不是现代图成品。
图150/151制作必须等待main一次全文独审通过，再另委托ld-s10y-image；
图作者还须自行重开原PNG，不把本文清单视为图审证据。

## Stop

候选冻结后不再改。没有读取main私有源解、answers或choices；
无modern图制作、自审批、正式lesson finalize、durable课/图编辑、
晋升、DB、Git、服务、浏览器、依赖安装或app/tool/schema改动。
全部命令结束，交main一次独立全文审查。
