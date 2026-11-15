# STEMROBIN-184 / 9-10g 首批四页 Source Author

状态：本次明确子任务已停止，四页 source author 产物已保留；仅 cap1，finish review。三页 finalize 通过，一页真实计行失败，不能称全批通过；父方负责独立审查和后续。

## 范围与隔离

- 工作树：`/Users/yong/.codex/worktrees/a07e/lemmadeck`。
- 本次唯一持久写范围：`ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0008` 至 `0011` 的 cap1 source 产物，以及本文件。prepare/finalize 的本批页级工作料仅位于 `.tmp/ld-s10y-lesson/9-10g/pages/`。
- 不读取旧答案/choices；不执行 assemble/adapt/vectorize、答案或 choice 流程、DB、publisher、服务或 browser；不创建用户聊天，不发跨会话消息，不 commit/push。
- 入场时 9-10g 的 artifacts 和工作料不存在，没有旧页重做。其他代理的修改保留。
- 已读 AGENTS.md、.intentfold/readme.md、project.json、ticket.json、charter/product.md、engineering.md、operations.md 及其 Redlines，以及 ld-s10y-lesson/SKILL.md cap1。
- 已通过 n-plane helper 只读 GET 核对 live 工单 `208cf289-ab15-4f5c-ab68-daa924a9ea10`（STEMROBIN-184，四册 scope，Finish review）。本次用户明确恢复并限制为四页 source 子任务，覆盖工单的暂停和批次 commit/push 默认；未写 Plane。

## 来源与定位

- TOC：`ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json`；目录物理 4–7，§1 印刷 1，§2 印刷 3。
- manifest catalog：`book: 9-10g`，`sourcePdf: 9-10g`；`exerciseNumbering` 未声明。工具默认 book，但本批只核对实际出现的题号，不据此推测全书编号。
- source PDF：`ssot-resources/soviet10year-textbooks/sources/soviet10years/9-10g 苏联十年制学校数学教材 几何 9-10年级.pdf`；manifest 342 物理页、8,302,528 bytes。
- PDF SHA-256：`1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a`，prepare 已读取实际文件并匹配。
- 先 prepare 物理 8，再打开完整单张 `page.png`（1506x2126，300dpi）：右下印着 `· 1 ·`，且出现第一章和 §1 标题。实际偏移为 `physical = printed + 7`。没有预猜偏移。

## 页级状态

| 物理页 | 印刷页 | 状态 | 实际行 / 机器行 | 图 |
| --- | --- | --- | --- | --- |
| 0008 | 1 | 唯一一次 finalize 已执行，失败：仅行数差异 | 21 / finalize 20 | 无 |
| 0009 | 2 | 唯一一次 finalize 通过（14 块，0 次规范化） | 22 / 22（挖图后） | 图 1、2，已看实际裁图 |
| 0010 | 3 | 唯一一次 finalize 通过（7 块，0 次规范化） | 25 / 25 | 无 |
| 0011 | 4 | 唯一一次 finalize 通过（17 块，0 次规范化） | 22 / 22（挖图后） | 图 3、4、5，已看实际裁图 |

四页分别按 prepare → 完整单张 page.png → apply_patch 写带块 MD → finalize 一次执行，没有重复 finalize，没有预置或追加 count_exclusions。每页均保留 `page.md`、`page.json`、`audit.json`。47 块、实际 90 行，工具合计 89 行；唯一缺口为 p0008 页脚漏计。各页 `normalizations`、`unknown_chars`、`katex_warnings`、`count_exclusions` 均空，`errata` 均为 0。

## 实际题号与 Source 诊断

- 本批仅见两道原书习题：p0009#12 的习题 1（口答符号及脚注星号）、p0010#1 的习题 2（口答符号，10 个数字小问）。都属于 §1；题干均完整，没有跨页习题残片。
- p0008/p0009 的正文列表 1–4，以及 §2 的公理 1–3 都不是习题编号。§2 在本批内没有出现习题，不能由此推断其题号起点，更不能推断全书是否重编号。
- p0008 唯一一次 finalize 退出码 1，audit 原文：`行数对不上：印刷 20 行，块体 21 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）`。该错误保留，不改 audit、不删除页脚、不凑行、不设置排除区、不修计数工具。
- 源诊断：完整原 PNG 明确有右下 `· 1 ·`；正文及标题 20 行加页脚为 21。只读调用现有 `layout.line_bands` 并观察返回局部变量，`line_h=43`、`glyph_h=39.0`、`typical_h=43.0`；页脚候选为 y1974–1985（12px 高），x20–1279（1260px 宽），`peak_row_ink=30`，存在于 raw/merged，却不在 out。页边墨迹拉宽了页脚候选；该候选满足 `band_h < 0.4 * typical_h`（12 < 17.2）及 `band_w > 0.3 * content_w`（1260 > 439.8），在工具末尾 `decoration` 过滤中被移除。最终 bands 止于 y1890–1931。问题是当前扫描/计数判据组合漏计真实页脚，不是少写正文；未通过修改工具或扫描像素绕过。

## 已确认边界

- p0008 章首三段导语使用 `p preface`，随下一张 §1 卡保存。
- p0008 末尾 `1．列出不给定义的基本概念．`、`2．建立反映基本概念性质的公理．` 是正文列表，不是习题；以 `p open` 保留列表续页边界。
- p0008 实际 21 行含页脚；prepare 的 line_bands 最后一行停在 y1890–1931，未列出右下页脚。不得删除页脚或减少真实行数来对账。
- p0009 `p cont` 承接 p0008 正文列表，写出第 3、4 点后闭合。两张图属于 §1 正文，图题同排仅计一行。
- p0009 实际出现习题 1（口答上角符号和脚注星号），题面完整，没有 open。教学脚注与页脚分块保留。
- p0009 图 1、2 已打开 finalize 实际裁 PNG：图 1 两幅轮廓和 α、β 均在，图 2 平面 α 内实点 A 均在，无图题或邻图文字混入；图 2 右斜边下部的原扫描断笔保留。吸附后机器框分别为 `[149,1164,629,144]`、`[791,1143,391,160]`，不是人工精修框。
- p0010 习题 2 在 §2 标题之前，属于 §1；原始数字小问 1)–10) 全部保留，最后一小问在本页闭合。该页没有重印“习题”标题，未人为添加。
- p0010 §2“立体几何的公理”起于印刷 3，吻合 TOC。末尾正文“从公理 1 得到……点 A（图”以 `p open` 等下一页承接。
- p0011 首个 `p cont` 为“3）．这时就说……”，完成 p0010 的图 3 引用并闭合正文，不误认作习题 3。
- p0011 图 3、4 的图题同排；图 5 图题与“根据公理 1，存在平面 α 内的”同排，分别用 cap samerow。最后一段在图 5/cap 之间以 `p open` → `p cont open` 保存，末行“通过点 A 和点 B 作”待物理 12 的 source 承接。本批不补取第五页，不认为 §2 已完成。

稳定块引用：

- p0008#3–#5：章首 `p preface`，附着于 §1。
- p0008#8 `p open` → p0009#1 `p cont`：正文逻辑结构列表闭合。
- p0009#13：`foot note`，教学脚注完整保留；不是页码，也不混入题面。
- p0010#6 `p open` → p0011#1 `p cont`：公理 1 后的图 3 引用及句子闭合。
- p0011#13 `p open` → 图 5（#14）/cap samerow（#15）→ p0011#16 `p cont open`：同一正文段，右边界仍开放；后续应从原扫描物理 12 继续，不能凭语义补写。
- p0009 图 1、2 均有本页正文引用；图 3 的引用跨 p0010/p0011；图 4、5 在 p0011 正文引用。五张图都是正文图，没有练习专用图或无编号表格。

## 实图观察

- 图 1（p0009）：左侧平行四边形标 α，中间不规则闭合轮廓标 β，两幅为同一图；实际裁图两部分及标签完整。
- 图 2（p0009）：平行四边形表示平面 α，内部一实点 A；实际裁图保留点与标签，原右斜边下部断笔原样保留。
- 图 3（p0011）：不规则平面轮廓标 α，上方轮廓外一实点 A；实际裁图保留 A、α 和平面内部的原扫描细碎墨迹，没有解释为新对象或抹掉。
- 图 4（p0011）：不规则平面轮廓标 α，内部一条标 a 的实线；实际裁图轮廓、a、α 完整，无端点标签增补。
- 图 5（p0011）：不规则平面 α 和斜直线 a；A 在平面内线上，B 在上方平面外线上；A 以下经过平面内部部分为虚线，下方出平面及上方 A/B 方向为实线。实际裁图全部标注和虚实关系完整，不添加解答。
- 五张 finalize 实际裁 PNG 均逐张打开；图题均在 cap 文字块，不混入裁图。图 3–5 吸附后的机器框分别是 `[142,640,435,242]`、`[751,698,414,194]`、`[775,1535,424,298]`。粗框与吸附框均由各页 audit 保留。
- 只执行 cap1，裁图依工具约定保存在本批 `.tmp`，没有 assemble 提升全书图库、生成 SVG 或现代图。持久事实是本批页级 source、图号与审计框；工作料全部保留可供父方审查。

## SHA-256

以下为四页 finalize 后、未再次改写 source 的字节哈希。路径前缀：

- source：`ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/`
- render/crop：`.tmp/ld-s10y-lesson/9-10g/pages/`

```text
0008/page.md      5fbb2ca6c412bb0255b3c094ca7142c75e2cf4051b0f5f02b41cc1ce761456d4
0008/page.json    185e13a5fa2618d9fc406ea145db7fa16677d3849764990eee9a206ac415e65a
0008/audit.json   bb2e850f1e5b78e96faec68ccf373acc6a3f2e91bf172ae926eb1642af5510a3
0009/page.md      651328b02ad7d9d93f5c0462db765a526f6a753f7ca3452122c0d6f9477b3ce5
0009/page.json    a6c7f36d7b463f30fd80b69cfa719a021f8385446b52bbab9e23069bf85638ca
0009/audit.json   ba6c577ec3e1cb18346c6a54c4de9246d42b024b6b68a7a933914600c9c3a38a
0010/page.md      0f0ef4077eb4ad1a6e9ded299c71852dac13f3f1eb92466e60f273e649f8b85c
0010/page.json    3a3ca2e2a890e83aee1bcd14437750341e01d2109277e9c054388045d7ac44ba
0010/audit.json   5a8aa5eb4c955409efd4020975636c1a4dceeae97d9afb69eee383aa8bcb9f6d
0011/page.md      cc011e24dc66ca42a2c8e4601cba0273c17b03df7af8c3f8ab99fca368046333
0011/page.json    fc93e681c302fef0f8458fe3d0f1064ebc5325eaffbc172531ef0f0a573aa73e
0011/audit.json   5ac0d24e17189bd1873b807d31df1d0537aa1b0930853f3fe54653fd430b8202

0008/page.png     ae73ee7c1ecf1f674cbf8c4ea9eb221d120a691b223fbecb28b3ff014bf4f2be
0009/page.png     5221d4753851cc95a741d76c17de306705fd3a7594549b51089af14a851d9f3a
0010/page.png     f7fb45de625df7b1a53c7dd56f86265ca0ea1bdcfedf101c9e12364a7b02baba
0011/page.png     cf22156c751114885571bef3ae4ed73fe5877b2c988f9f838ef134ac73f42f74
0009/figures/fig-01.png  13076830720afe711c4f86b62eee075cb8e648af6cd9cd85f6ad3dd6172179b0
0009/figures/fig-02.png  7fd1a20dd6acde79ffc3b9da35eb9931a37b9522caf723750021b81796e14bc4
0011/figures/fig-03.png  6fed362088363e5a3ec6b73d42db732bd613bd0d2c05a4b9db60f5bbe1b1343c
0011/figures/fig-04.png  2e8a7ce9667d812c5bc03a64a0657aff5a9c2e4fb644f8178478b1fac578a997
0011/figures/fig-05.png  94bbc1bfe57ec5456c15380d0887c3edec38f347f795c2becaf0de845d9cf8db
```

只读记录的输入与工具哈希（工具未被本次 author 修改，layout.py 入场时已有他人修改）：

```text
sources/manifest.json   5114f1e03c78a847555addfcaa5c6f27f5d2cb02abf3593f9c40a6f1d5cb5ed0
toc/9-10g/zh.json        9a553a6743bec97066cddff9df7fcb7c98ee1a0dce20e4dbfd6a2aa34429ee0c
tools/p2c.py             94eb8a1436ac65844ccc1585b1c56a918140bd2f3f4100e659703652680383dc
tools/blocks.py          1b6540373067b80cdc34ab7973a26ccfc1b21b62f655139731f16408ea072b66
tools/layout.py          50cfefdb414c7af3d91dcb333a5cd907f014fd001646173124c494b12d08c721
```

## 停止交接

本子任务到此停止，所有工作保留，不 commit/push、不写 DB、不启动服务或 browser、不继续后续单元。本文件为 source author 的事实交接，不冒充父方的独立转录/图审查。父方需独立核对四页及五张实图，决定如何处理 p0008 真实计行失败，并从 p0011#16 开放正文边界继续后续授权生产；本 agent 不扩大写范围修工具或补第五页。
