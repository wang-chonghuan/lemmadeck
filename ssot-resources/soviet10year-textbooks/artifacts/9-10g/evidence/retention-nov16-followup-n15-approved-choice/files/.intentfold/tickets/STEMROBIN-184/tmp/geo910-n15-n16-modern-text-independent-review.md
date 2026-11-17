# STEMROBIN-184: n15/n16 Modern TEXT Independent Review

日期：2026-11-16。唯一一次本轮原始 snapshot → current 现代 TEXT 实质比较。

**PASS：28/28 正文对象、9/9 整题（159–167）、20/20 数字小问、22/22 语义任务保留；未发现新增文字缺陷。** 两项已登记纠错来源绑定匹配。此结论仅属于下列四份 template 的文字，不是图片、数学全套、validator、finalize、产品显示或发布 PASS。

## 范围与依据

`R = /Users/yong/.codex/worktrees/a07e/lemmadeck`；以下路径均相对 R 展开。先读 repo routing、四份 charter、lesson SKILL 和 current `references/edition-text-contract.md`；通过 n-plane 只读 live STEMROBIN-184（UUID `208cf289-ab15-4f5c-ab68-daa924a9ea10`），不更新工单。

独立先读四份 `source.data` 的全部原文，再逐项读 current 的 `source_text`、现代 `text` 与引用。已有独立数学 report 虽含结论，本次只复用其有根据的 inclusive parallel、合法对象/非零射线、非唯一包含平面、一般平行六面体及位置分支边界，不把答案清单变成现代题面要求；不重解数学。未打开数学作者稿、derived-answer precursor、旧 answers 或 choice。

完成上述比较后才读 modern-text-author.md 与 numeric-label-repair.md：作者关于先前 Latin labels、FAIL 和访问局限的披露保留为历史观察，不作 current 权威。current 160–166 恢复源数字 labels 合法；166 的 `1°)` 在 snapshot/source_text 保留，现代为 `1)`，不改变数量或任务。

## Current 字节绑定

`T = .tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons`；`S = ssot-resources/soviet10year-textbooks/artifacts/9-10g`。四份 template 在读入及写报告前两次只读哈希一致。

| Current text path（R 下） | Raw SHA-256 |
|---|---|
| T/geo910-c1-s2-n15/lesson.template.json | `a089ee985c5f397f2d48ca1fe5acc5aaebf5f4346e8089ee71b4d5e79d8bd171` |
| T/geo910-c1-s2-n15/exercises.template.json | `8c24be15a1a878d3946937f78649aa6f98c7835b0edadd556064a23cabd0445d` |
| T/geo910-c1-s2-n16/lesson.template.json | `03a194601450544f3bb1a60870b79b16198706b3ccc651e9cf1451f92d5245f7` |
| T/geo910-c1-s2-n16/exercises.template.json | `158ffe88994d67c6ffc40b072c20d71af37da479ed4603be24e1ddd50ec41bdc` |

| 原始 snapshot 对应 path（R 下） | Raw SHA-256 = template.source.sha256 |
|---|---|
| S/lessons/geo910-c1-s2-n15/lesson.json | `78131e44852840b8c1bdb7c273c21d10c70b66ea5ea4c76ee2cd9a9f10bd9da0` |
| S/lessons/geo910-c1-s2-n15/exercises.json | `6d53ac8520088a734935022cf69249fa07b6b63371bd907e7946308511c68ba0` |
| S/lessons/geo910-c1-s2-n16/lesson.json | `d7b77bc175e5ed83743065ab7b01107e40d1f024e576b23740b6fb13a66921c9` |
| S/lessons/geo910-c1-s2-n16/exercises.json | `202c0bbc5c230805edd30dc3a548fdbeff10c9beff43db823155f19db63d794e` |

四份 `source.data` 与对应原始 JSON 结构相等；37 个对象的 `source_text` 与 snapshot.text 逐字相等。kind/id/label/printed_page/source_refs 及题号/source_number/group/group_id/pages/figure_refs/figures 均保持。逐引用查 current 页 JSON 的实际块：28+9 对象全部存在、类型/题标正确；仅去除印刷换行空白与 `↵` 后，引用块拼接文字均等于 snapshot。四个拼接对象 n15 prose[6]、160、161、n16 prose[1]，以及跨图拼接 n16 prose[14] 均完整。9 题 `lines.join("\n") === text`。

## 正文逐对象

索引为零基 `prose[index]`。fig/cap 的 PASS 只指文字对象、id、标签、顺序及引用保持，**不指 pixel PASS**。

| 对象 | Source refs | 原文 → 现代的实质覆盖 | 结果 |
|---|---|---|---|
| n15[0] p | p0058#4 | 任意两点保距、像与原距相等、中心对称例及证明引入；未排除重合点 | PASS |
| n15[1] p | p0058#5 | Z_0、M/N→M_1/N_1、五点共面、所选 α 不变、平面限制、距离等式；未要求平面唯一或点一般位置 | PASS |
| n15[2] fig | p0058#6 | fig-60、空 text、图 60 | PASS（text/ref） |
| n15[3] cap | p0058#7 | 独立图 60 图题 | PASS（text/ref） |
| n15[4] p | p0058#8 | 定义1：空间保距变换为位移；未缩成平移或保定向变换 | PASS |
| n15[5] p | p0058#9 | 恒等、逆、合成三性质齐全，а/б/в→a/b/c；未给一般单射偷加全空间逆 | PASS |
| n15[6] p | p0058#10,p0059#1 | 跨页完整直线→直线、平面→平面，不降为部分包含 | PASS |
| n15[7] p | p0059#2 | 线段及端点像、半平面及边界 p、半空间及边界 α、四面体及四顶点像、角度；未添开闭侧/定向/正角限制 | PASS |
| n15[8] p | p0059#3 | 定义2：存在位移将整个 Φ 映射成 Φ_1；未替换为包含或相似 | PASS |
| n15[9] p | p0059#4 | 合同符号及 Φ_1、Φ 操作数顺序不变 | PASS |
| n15[10] p | p0059#5 | 三个合同性质齐全；仅已登记反身性修正，见下表 | PASS |
| n16[0] p | p0060#5 | 飞机/空间站、八年级平面方向→空间方向；无新增数学条件 | PASS |
| n16[1] p | p0060#6,p0061#1 | 两条不同平行载线、α、O_1O_2 分界、α_1/α_2、同侧/异侧两定义、§3、图62 a/b；起点仍在分界，未另添离界条件 | PASS |
| n16[2] fig | p0060#7 | fig-62、空 text、图 62 | PASS（text/ref） |
| n16[3] cap | p0060#8 | 独立图 62 图题 | PASS（text/ref） |
| n16[4] p | p0061#2 | 同载线：交集为射线/不是射线两分支、图63 a/b/c/d；相同射线及空集/线段/单点未被排除 | PASS |
| n16[5] fig | p0061#3 | fig-63、空 text、图 63 | PASS（text/ref） |
| n16[6] fig | p0061#4 | fig-64、空 text、图 64，原数组位置保留 | PASS（text/ref） |
| n16[7] cap | p0061#5 | 独立图 63 图题 | PASS（text/ref） |
| n16[8] cap | p0061#6 | 独立图 64 图题及顺序 | PASS（text/ref） |
| n16[9] p | p0061#7 | 两方向符号、AB 射线/(AB) 直线、任意 M、唯一 m、公共始点 m_1/m_2、§4 和图64；未限定 M 在线外，inclusive parallel 仍允许载线重合 | PASS |
| n16[10] p | p0061#8 | 每一个空间起点恰有一同向与一反向射线；未排除原起点/原载线 | PASS |
| n16[11] p | p0061#9 | 中心对称反向每一射线、包含射线及中心的平面、公理9；未要求中心在线外或包含平面唯一 | PASS |
| n16[12] p | p0062#1 | 同方向反身/对称/传递全部公式和图65；未要求三射线整体共面 | PASS |
| n16[13] p | p0062#2 | 单个方向的同向射线集合；仅已登记直线→射线修正 | PASS |
| n16[14] p | p0062#3,p0062#6 | 一条射线确定全体同向射线集合、代表空间方向；跨图续文完整 | PASS |
| n16[15] fig | p0062#4 | fig-65、空 text、图 65 | PASS（text/ref） |
| n16[16] cap | p0062#5 | 独立图 65 图题 | PASS（text/ref） |

对象对账：n15 = 9 p + 1 fig + 1 cap = 11；n16 = 9 p + 4 fig + 4 cap = 17。fig-61 属于160，未虚增为正文对象。正文图引用60、62–65，160 的 sole figure_refs/display 为 fig-61，其他八题均无图引用；不从这些图文声明推出实图正确。

## 整题逐任务

| 题 / Source refs | 小问覆盖及原条件、边界 | 结果 |
|---|---|---|
| 159 / p0059#7 | single：任意空间到自身保距映射是否为空间变换；未附加先验满射/仿射条件，未泄漏判断 | PASS |
| 160 / p0059#8,p0059#11 | 1、2：α 与 l 相交；全部 M∉α、MM_1∥l、α 平分线段；α 上全部点固定；分别问变换/位移。没有新增垂直或斜向条件，不把示意图当 normal 前提；正常/斜向合法横截方向均留在题域，未把含于 α 的无效构造强称可定义 | PASS |
| 161 / p0059#12,p0060#1 | 1、2、3：线线、线面、面面平行是否保持；无“不同”“不相交”附加限制，inclusive 的重合线/含线平面/重合平面未排除 | PASS |
| 162 / p0060#2 | 1、2：中心对称的直线及平面平行像证明；中心在直线/平面上的相同像仍在域内，未要求严格分离 | PASS |
| 163 / p0060#3 | 1线段、2直线、3平面、4平行两平面并集、5相交两平面并集、6相交线面并集、7平行线面并集；先保留整图形自映的中心定义，再问各个中心数量。未改并集为交集，未加不同/唯一交点/线面垂直；重合/包含的 inclusive 或宽读边界及单点线段未被偷偷排除。无需把中心位置答案写入题面 | PASS，7/7 |
| 164 / p0062#8 | 1、2：一般四面体 ABCD，射线 AB、AC、AD、CD 全部，分别问有无同向/反向；未添正四面体或直角，合法四面体和非零射线域不变 | PASS |
| 165 / p0062#9 | 1、2：一般平行六面体 ABCDA_1B_1C_1D_1；八射线 AB、AD、AA_1、BC、C_1D、BB_1、C_1C、A_1D_1 顺序/端点完整；literal C_1D 未补成 C_1D_1，未换成 CC_1，未添矩形/正交/等棱；仍要求指出同向和反向，不要求预给配对答案 | PASS，8/8射线 |
| 166 / p0062#10 | 1、2：反方向传递性问题、共同反向第三射线则彼此同向的证明；未把问句改成断言；共同起点、同/不同平行载线域保留；源 `1°)` 不丢于 snapshot | PASS |
| 167 / p0062#11 | single：两条原关系 [AB)↑↑[MN)、[CD)↑↓[MN) 原样；“有哪些可能的相对位置”保留全部分支，不收窄为只求方向或某一个位置。不同平行载线及同载线均未排除；同载线按起点顺序的非零线段、公共始点、空交全部可答。未加异面/非平行相交载线可能性或强定起点次序；零射线仍非合法题设 | PASS，全位置请求 |

小问序列为 `0,2,3,2,7,2,2,2,0`：20 个 explicit 小问 + 159/167 两个 single = 22 个语义任务。current 数字标号自然顺序、各问独占一行；正文原 Cyrillic 性质/图分栏字母的 Latin 转换与源数字 labels 是不同事项。未给任何练习添加求解步骤或答案。

## 两项 Current 纠错

| 登记 / target / source | 精确替换与核对 | 结果 |
|---|---|---|
| p0059-reflexivity / n15 lesson.prose[10] / 59（印52）, p0059#5 | `反身性（$\Phi\cong\Phi_1$）` → `反身性（$\Phi\cong\Phi$）`；target source_refs 含该块，原 span 在 snapshot 唯一且现代已移除，corrected 唯一，math-correction 已标 | PASS |
| p0062-direction-ray / n16 lesson.prose[13] / 62（印55）, p0062#2 | `同一条直线` → `同一条射线`；同样核对唯一原 span、唯一替换、source_refs、math-correction | PASS |

两条 id/block/original/reason 均与 current 页 `meta.errata` 相等；物理页、印刷页、PDF SHA 身份均匹配。只这两个对象含 math-correction。原始层原式仍在，未沿用旧独立数学 report 的 printing/transcription UNKNOWN 否定后续 current 登记，也未声称本轮看过印刷像素。

| 引用页文字 path（R 下） | Raw SHA-256 |
|---|---|
| S/pages/0058/page.json | `bb9756b35a80f918fa9174be80c270280eba254a9f687e9d9eef841fc065c8c7` |
| S/pages/0059/page.json（= n15 erratum.source.sha256） | `4f9a454c2ea249bb224d6246ce84749c8d47c0845e1a0c8d4bb4d4cb01640cb5` |
| S/pages/0060/page.json | `b9fd3323828501ec47bcf35aacd047e2a5d6a93797d4e725164db7f65805c31d` |
| S/pages/0061/page.json | `6ae616e123cc72bae533e66db0ff7ea12c2b990da6daafc26c21ab588a998383` |
| S/pages/0062/page.json（= n16 erratum.source.sha256） | `9952bb2c4447ff1e7452e9342eed6924954cec9fe9b985066bbd3d9e340fea52` |

登记共同 PDF 身份（读取 meta，未打开 PDF）：`1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a`。

## 复用记录与动作

`E = .intentfold/tickets/STEMROBIN-184/tmp`。

| 只读参考/evidence path（R 下） | Raw SHA-256 / 用途 |
|---|---|
| E/geo910-n15-n16-math-independent-review.md | `427c44a87b366b57d1a683513b9334dec3d8a4a85d86e786edbd3123f4e3f858`；仅复用有根据 constraints/边界 |
| E/geo910-n15-n16-modern-text-author.md | `cb4b1736d6ea4c298d75a0226af3bb87887070fd579ed899722f31c947363dc0`；后读、非权威历史观察 |
| E/geo910-n15-n16-numeric-label-repair.md | `773332855da7c103d82801bb60c8a40e7d66dd848f8ec3e81c626fa5b793bf46`；既有7/7 affected PASS，不重跑 |
| E/geo910-n15-n16-numeric-label-repair/stdout.json | `3b68120fd9d5dca74148d2fe41716d4c5fd7ce101e9fda50a278eb1bd99cf7c1`；只核字节身份 |
| E/geo910-n15-n16-numeric-label-repair/result.json | `0de431e5a4a4c9f8b0741030af1a4ace8c1088a32b36691f16b295b078bc0ab7`；读得 exit_code=0, production_validation_runs=1 |
| .claude/skills/ld-s10y-lesson/SKILL.md | `af17828a2178010d9f1c33ae463651ca92113d773e13aca24e53ec138a6f58c5` |
| .claude/skills/ld-s10y-lesson/references/edition-text-contract.md | `97d086b100b63150a23d218a2c6f0bafd2ddff17b17d189a91ec01638b75b977` |

本轮工具仅文本/结构只读比较、页文字引用及登记核对、raw hash、live ticket GET，以及 apply_patch 写本报告。没有调用 validator、figuregate、mathcheck、KaTeX、prepare/finalize/assemble/render，也没有检查/修改图文件、templates、工具、源、DB 或 Git；没有撤销他人工作。既有 affected PASS 不扩展为整课 PASS，作者历史 FAIL 不反向覆盖修复后的 current。

新加载图片、重开、裁图、截图、生成及转发 image payload 均 **0**；本任务预算 **0/8、0/24**，不把文字 figclaim 当 pixel 证据。唯一写入：`R/E/geo910-n15-n16-modern-text-independent-review.md`。指定文字比较完成，无新增修复请求。
