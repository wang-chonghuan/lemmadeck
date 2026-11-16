# phy7-c1-s1-n81 Modern TEXT Author Handoff

作者：Wegener。状态：AUTHOR_COMPLETE_PENDING_INDEPENDENT_TEXT_REVIEW；不是TEXT独审PASS、图批准、整课批准或发布结论。仅授权的81单元，无225+页像素或其他新课阅读。

## Exact Roots And Standard Entry

- 隔离work：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-7p-n81/`。
- 完整三模板：该work下 `adapt/7p/modern-us-neutral/lessons/phy7-c1-s1-n81/{lesson,exercises,figures}.template.json`。
- 原课：`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/lessons/phy7-c1-s1-n81/{lesson,exercises}.json`。
- 原图207：`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/figures/fig-207.png`；已亲自完整打开一次，非现代图审。
- 完整upper-modern正文/题面及原图绑定：work下 `author-context.json`。全部字节、SHA、argv/exit、工具epochs：`author-manifest.json` / `author-handoff.json`。

现有官方工具按book参数提供7p标准TEXT流程，无备用流水线。`run-prepare.mjs`仅记录并调用：

```text
/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python
/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/p2c.py
adapt-prepare --book 7p --edition modern-us-neutral --lesson phy7-c1-s1-n81
--root /Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts
--work /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-7p-n81
```

官方prepare仅一次，exit0；stdout明确6正文块、4题、1图。虽然工具提示未来写入edition的路径，本作者没有执行adapt-finalize或持久写入。原始准备模板单独保存于 `prepared-snapshot/`。

## Full Content And Task Preservation

完整6个原正文对象是4个p块、1个fig块、1个cap块，而不是6个p块。现代仍6对象，实际发布文字流6个短段落；图207与独立图题保持原位置。完整4题均保留 `问题/g1`、原号/稳定号1–4、`p0216#5`至`#8`、空题图引用与自由说明/举例任务。前三题逐字不变；第四题仅印刷ASCII句点改中文句号。没有添加答题提示、答案或选项，也不声称作答/实际操作能力已被自动判定。

完整保留：

- 单个分子运动属于机械运动；路程、平均速度、与其他分子碰撞，以及图207放大数百万倍的气体分子轨迹片断。
- 总体分子数极多、各自复杂轨迹、向四面八方高速运动、相互/容器壁碰撞、速度改变和下一次碰撞的完整机制。
- `1厘米$^3$`、`$25000000000000000000$`、`$2.5\times10^{19}$`及“大约”，无numeric_changes、无数学式改写。唯一context变更把该数量明确标为原书的近似说明，未造温压条件或当作任意气体状态的精确普适常数。
- 原`§11`跨课引用、温度与分子运动速度有关，以及完整单句粗体“把分子的无规则运动，叫做热运动”。没有插入新动能公式、统计定律或额外定义。
- 热现象的作用和全套原实例：昼夜/四季气温，冰融化/水冻结，金属熔解/凝固，水蒸发/降露；原中性教学措辞保留。

没有需要替换的虚构苏联人名或文化情境，也没有原文真实历史教学身份：全部 `historical_entities=[]`，不虚报声明。除来源近似数量说明外，仅中文句号和完整句排版；原`source.data`、`source_text`、身份、source_refs、groupIDs、数值、公式、图号全部原样保存。

## Mechanical Evidence And Flow

一次 `text-check.py` 使用技能现有 `edition.normalize_lesson_layout`、`normalize_exercise_layout`、`validate_identity_fields`、`validate_text`、`blocks.text_of`、`mathcheck`和共享`prose_flow.mjs`。exit0，errors0，warnings0，3数学片段；6正文对象+4题共10个source-ref与批准page JSON块精确绑定。源码与图源字节不变，来源快照在 `source-snapshots/`。

锚点先从normalize后的真实outline复制，再对最终模板运行官方 `prose_flow.mjs --json`一次：0-based边界 `[2,4,5]`，即第2/3、4/5、5/6段相邻概念切换。粗体定义完整落在第5段，无跨段未闭合。最终绑定证据在 `anchor-report.json`，不是手数原prose块或伪造整数。

工具当时before/after哈希逐阶段保留于prepare/text-check/anchor ledgers；不要求历史工具hash强行等于后续shared工具版本。作者机械成功仅可复用为机械证据，不能替代接下来的独立全文TEXT审。

## Original Figure And Boundaries

本作者完整观察原207：矩形外框内多条带空心圆节点的折线路径，局部交叠/密集；无文字标签、方向箭头、坐标轴或刻度。正文描述放大了数百万倍的轨迹片断，不从该示意图反推精确速度、时长、轨迹倍率或分子数。没有重画、裁图、render或做figure gate。

`figures.template.json`完全复用prepare的未解决现代图声明；原PNG SHA `df5c0261d89b3e84e33232243ff5b4f0b415aa7c23947232d13f6701c4f08ad8`，原SVG SHA `9dc86a4f0d3ef85fd8d23f85e6e09e1d4de522c5cbc367e57ad4926f9ac7bed1`。现代207仍需另派图作者和独审，不能视为整课图闭合。

## Budget And Stop

机械inclusive每unit修复最多1次，本次首轮无FAIL、未修复，预算0/1。若后续独审发现必要缺陷，由main决定唯一affected修复；不由作者自批准。当前没有首FAIL可虚造，首prepared及作者机械输入/输出均冻结。

无answers/answer-source/keys/choices/private-source读取；无canonical/源/索引变动、DB/Git、网络/模型服务、app/browser、figure author、retention或发布。所有新写入只在本作者work及本ticket报告。保持原198/199与s13-t1源解冻结不变，交接后停止。
