# STEMROBIN-180 源页独立审查：73

结论：**FAIL（仅物理页 0073 / 印刷页 62）**。发现练习对象漏字及公式末尾多写标点两处缺陷。未修源；作者须修复并重验，已传播的装订产物也须由作者更新。本报告不批准现代版或发布完整性。

审查时间：2026-11-15，Europe/Dublin。仓库：`/Users/yong/.codex/worktrees/0f12/lemmadeck`。

## 缺陷

### [P2] 练习 13 第（2）题漏掉“弹”

- 源图 `.tmp/ld-s10y-lesson/6p/pages/0073/page.png` 的练习 13 第（2）题首行：`（2）100 厘米³铝的质量是多少？100 厘米³铅弹的质量也这样大`，下一行 `吗？为什么？`。
- 持久 `ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0073/page.md` **L70** 写为 `……$100$ 厘米$^3$铅的质量也这样大`。
- 同页 `page.json` **L167**，`blocks[10].lines[0]` 同样漏掉“弹”。
- 已实际打开完整源页，并单独查看原图 `[215,1380,1175,120]` 的内存条带，明确可见“铅弹”两个字；不是仅凭常识或作者文字判断。
- 建议：仅将该位置的“铅的质量”恢复为“铅弹的质量”。不得为了概念表达方便将原书对象简化为“铅”。由作者 finalize 页 73、复核该字、更新装订及受影响下游；本审查未做上述动作。

### [P3] 体积公式行末多写句点

- 源图同页体积公式：`V=m/ρ，V=(6500 千克)/(2600 千克/米³)=2.5 米³`，末尾米³之后没有印刷句点。
- `page.md` **L52** 和 `page.json` **L95**，`blocks[4].lines[0]` 却在公式结束后添加了 ASCII `.`。
- 已单独查看源图 `[425,780,795,115]` 的内存条带，包含完整公式及右侧空白；确认末尾没有句点。不是将分母或上标墨迹误读为标点。
- 建议：删除该公式闭合 `$` 后的额外句点；保留前半句逗号、所有数字、单位及数学内容。此为转写多字，不是数学印刷勘误，不应登记 errata。

## 方法和范围

- 先前已实际读取 `.claude/skills/ld-s10y-lesson/SKILL.md` cap1 与工程约束，本页按相同单页规则执行；当前技能不存在独立 `gate1` 文件的事实已记入第一份报告。
- 实际只打开 `0073/page.png`，逐字逐行对照持久 `page.md`、`page.json`、`audit.json`；另两次分别打开本页内存条带，未生成磁盘图像。未同时输入多张图片，未扩扫 74 或其他页。
- 只用页 72 的尾部文本确认左边界：“可见，要根据物体的密度和体积来计算物体的质量，需将 / 密度与体积相乘.”。没有为本报告重新查看页 72 像素或更改其既有审查。
- 下文 MD/JSON 行号均指 `ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0073/`。只读重验现有解析器输出与 JSON 的元数据、全部块字段及逐行块体，实际原图尺寸为 1472×2161、300 dpi。

## 逐项事实

| MD 行 | 像素对照结果 |
|---|---|
| 36 | `质量=密度×体积，或 m=ρV.` 一印刷行；乘号、ρ、大写 V、末尾句点完整且正确。 |
| 39–42 | 四行完整段落：已知质量和密度可求体积；不规则物体无法借助尺测体积时，此方法最方便。原印“测定”未误写“测量”。 |
| 45–46 | 花岗石例题：质量 6.5 吨、密度 2600 千克/米³，求体积；“花岗 / 石”跨行接续。 |
| 49 | `在公式 m=ρV 中，现在体积是未知量.` 原字“现在”及公式准确。 |
| 52 | `V=m/ρ` 和 `V=(6500 千克)/(2600 千克/米³)=2.5 米³` 同一印刷行，数值、分子分母、ρ、体积单位均正确；仅存在上述多句点缺陷。6.5 吨换为 6500 千克、结果 2.5 米³没有错误。 |
| 55 | 独立栏目“问题”。 |
| 58 | （1）怎样根据物体的密度和体积算出物体的质量？一行闭合。 |
| 61 | （2）怎样根据物体的密度和质量算出物体的体积？一行闭合；没有互换“体积”和“质量”。 |
| 64 | 独立栏目“练习 13”，不是第 13 题。 |
| 67 | （1）分别求 10 升水、10 升汽油、10 升水银的质量；三个对象、三处 10、单位升均完整。没有把汽油写成煤油。 |
| 70–71 | （2）100 厘米³铝与 100 厘米³铅弹的质量比较；两处 100、立方厘米、问句和“吗？为什么？”完整；唯独“弹”漏写，见缺陷。 |
| 74 | （3）5 升容积的瓶子中能装入多少千克煤油？单位分别为升和千克；材料确为煤油，不是汽油；一行闭合。 |
| 77–78 | §28 标题恰为两印刷行：`28. 用分子的质量及单位体积中的分子数来表 / 示物质的密度`；“表示”跨行完整，不能压成一行凑计数。 |
| 81–83 | 三行新段落：分子组成物质、组成物体的分子质量总合；豌豆袋类比。原印“总合”、“比如”、“就象”保留，不静默改成“总和/例如/就像”。最后停在“求得”，没有句末标点。 |
| 86 | 印刷页码 62；装饰点不计入正文。 |

除所列两处外，本次未发现其他源字词、数字、单位、公式或对象类型差异。本页没有插图，MD/JSON/audit 的空 figures 符合像素；没有需要裁图的漏图。

## 栏目与跨页标记

- 页 72 的末段已经以句点闭合；页 73 顶部是单独引出的质量公式。语义承接 §27，但不属于被页边截断的同一段落，首块 `p`、`cont=false` 正确。
- “问题”的（1）–（2）与“练习 13”的（1）–（3）是两个栏目、共五个独立 ex；题号各栏目重新开始符合 source manifest 的 `exerciseNumbering: "lesson-group"`。不能以重复 1、2 判缺题，也不能合并两个栏目。
- 五道题全部在 §28 标题前完整结束，JSON 各 ex 的 `open=false`、`cont=false` 正确，不归入 §28。
- `toc/6p/zh.json` L317–333：§27 对应 `phy6-c3-s13`，§28 对应 `phy6-c3-s14`，起始印刷页分别 61、62；§28 的 h3 是真正课程边界。
- JSON L196–208，`blocks[13]` 是 §28 首段，`open=true`、`cont=false`；MD L80 明确 `p open`。源像素最后为“求得”，句意未完，open 正确。标题本身两行已完整，不应标标题 open，不应把 footer 拼入段落。
- 本次没有读下一页，不能证明下一页的 cont 或整个 §28 已闭合；更不能把作者页级 PASS 或装订统计作为现代课程完整证据。

## 机械证据的限度

只读现有 `tools/blocks.py` 检查结果：MD frontmatter 与 JSON meta 精确一致；全部 15 块（含两栏五题）逐字逐行及标记一致；只有最后正文块 open。原图 SHA 与 meta 声明一致，尺寸一致。

`audit.json` L2–10 的 `page=73`、`lines_printed=lines_md=23`、空 figures/errors/normalizations/unknown_chars/katex_warnings、零 errata 与当前页稿一致。但漏“弹”及多句点都不改变印刷行数，因此 23/23 不构成源忠实 PASS。

## 哈希绑定

| 文件 | SHA-256 |
|---|---|
| `.claude/skills/ld-s10y-lesson/SKILL.md` | `b3666f4ea4a094c269a2d628a455cbb00598e770d93903fd810597e6f8a9b405` |
| `.intentfold/charter/engineering.md` | `d4b38ea7ed61f21c70da56d600500f113f9eab8987b9267be6baf905c924977c` |
| `ssot-resources/soviet10year-textbooks/sources/soviet10years/6-7p 苏联中学课本 物理 六-七年级.pdf` | `46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0` |
| `ssot-resources/soviet10year-textbooks/sources/manifest.json` | `5114f1e03c78a847555addfcaa5c6f27f5d2cb02abf3593f9c40a6f1d5cb5ed0` |
| `.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json` | `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849` |
| `ssot-resources/soviet10year-textbooks/toc/6p/zh.json` | `d2a28ad304a267a49beead1db8dde28c14fc3330245c07330f4086506f0baef2` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0072/page.md`（只取页尾文字） | `25e868e8c55500f0bfa33bcaa75d33511ee15eb9679972bf131af93bd6e509f3` |
| `.tmp/ld-s10y-lesson/6p/pages/0073/page.png` | `cf5214cbe38b989bf46b27e399dee9379df751434e18d25e27d0310cf8b1b586` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0073/page.md` | `d38b7ddfa0a463bd77e8c37fa69f2a831242ea3bbb86901106251fcf503441ac` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0073/page.json` | `aa3dc551b1226b90341e9501b0795f0ebc0e95df83f5e0d66e4f296f00323b3f` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0073/audit.json` | `3ecb78a2e5431b869425acc607f9cb5cd6f2107a3082d7078969945dd178b070` |

本次新增写集只有本报告；第二份报告首行仅校正审查报告自身的页号笔误。未做任何源修复、Git 操作、DB 连接、模型服务、assemble、finalize、现代改写或发布；没有撤销他人改动。结论仅绑定上述实际读取的快照，修复后须重新绑定证据。
