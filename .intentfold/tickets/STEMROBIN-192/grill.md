# STEMROBIN-192 — grill

`Grill: human`。全批次写在开工前；下面三条过了 bar，送到人；其余记在「替你定了」。

## 你的决定

无——三条都按建议采纳，没有偏离建议的改动，也没有额外补充。

## 采纳了建议的


### 1. AC2 的 500 万 token / 60 turns 在哪个会话里量？

`meter.py` 读的是**一个会话的 transcript**。开发这张单的会话必然远超 60 轮，
所以在这里跑端到端会把读数污染成废数。

- **建议**：开一个独立的生产会话，只做一件事——用新技能把 `math3-c1-ex5` 做出来并入库；
  `meter.py read --transcript <那个会话的 jsonl>` 读它。开发会话只负责写代码和构造
  失败样例（AC3/AC4/AC5）。
- 理由：这是唯一能让 AC2 这条读数说话的量法，而且它顺带就是"这条路径真的只要 25 轮"的证据。
  替代做法是在本会话里跑，然后用"管线命令数 + gate 数"替代读数——那等于不验这条 AC。
- **答：采纳建议**（2026-11-24，人在会话里答的）

### 2. 验证那一课要不要真写进生产库？

AC1 写的是"做成一课**并入库**"。`publish.mjs` 对 `math3-c1-ex5` 是纯增量 upsert
（库里现在没有这个 id），但它会在同一事务里按完整 TOC **重排同册既有课程的 `lesson_order`**，
也就是会 UPDATE 已发布那四课的排序列（内容、版次、插图数不变——AC6 就是在钉这个）。
而且代码还没合并，课会先上线。

- **建议**：真发布。先 `--dry` 看一遍，再真写，然后读回比对 `tmp/db-baseline.json`。
- 理由：工单明确要求入库，191 的三课也是从 worktree 发布的；不入库这条 AC 就没验。
- **答：采纳建议**（2026-11-24，人在会话里答的）

### 3. 命令的入口参数：页码范围，还是课 id？

AC1 的措辞是"给定一本书和一段页码范围"。但"小节边界落在印刷页中间"这个结构缺陷，
用 TOC 从**课 id** 反推页码范围就天然消失了：TOC 知道这张卡起于印刷页 40、下一张起于 43，
所以范围就是 40–42，末页必须被下一张卡的标题收口。给页码范围则要反过来猜它想做哪张卡。

- **建议**：两个都接。`--lesson` 和 `--pages` 任给其一就从 TOC 推出另一个，两个都给就互相校验、
  不一致即失败；文档把 `--lesson` 写成推荐入口。这样 AC1 的页码范围形式仍然成立。
- 理由：页码范围是人手上有的东西（"抽 44–46 页"），课 id 是对象的真名；互推比二选一强。
- **答：采纳建议**（2026-11-24，人在会话里答的）

## 替你定了

### 4. 新技能只装驱动，四处改造落在现有工具上

`.claude/skills/pages2lesson/` 只有 `SKILL.md` + `tools/p2l.py`；校验器收全错误、
渲染器自解布局、候选裁图区域、边界检查四处都是对 `ld-s10y-lesson/tools/` 和
`ld-s10y-image/scripts/` 的向后兼容增量。
**依据**：工单 Proposed solution「不是推倒重来…把缝焊上」；charter engineering.md Guidance
「Reuse before inventing — 一件事已经有一条路，再造第二条就是缺陷」。复制一份工具进新技能
会立刻产生两份真相，而 Constraint 要求的只是 `ld-s10y-lesson` 保持可用，不是冻结。

### 5. 新技能放 `.claude/skills/`，不放 `.agents/skills/`

**依据**：charter engineering.md Contract —— `.claude/skills/` 是 repository-local S10Y lesson
and answer pipelines，`.agents/skills/` 是现代图/故事/星图那几个。pages2lesson 是 S10Y 课程管线。

### 6. 扩画布只在 `displayChecks` 仍全绿时接受

扩画布让几何像素不变、只多出空白边距，所以在固定产品宽度下整张图等比缩小，标签 px 跟着变小，
可能撞 `display.minTextPx ≥ 16`。
**依据**：`minTextPx ≥ 16` 是 `validate_spec.py` 和 `edition.py` 既有的硬判据，
工单 Constraints 没有放宽它；所以扩画布是最后一级让步，且必须复测显示字号。
失败时报出试过的全部布局（工单 Scope 原话）。

### 7. `generated`（Azure gpt-image-2）一律停下来问人

驱动遇到 `mode: generated` 直接非零退出并报告，不自己调 Azure。
**依据**：工单 Constraints「零付费图像调用」；3m 现有 13 张图全是 `deterministic` 表格，
`math3-c1-ex5` 预计同类，真撞上就是停。

### 8. 不修 `x1-承上页` 与 `book.json` 既有的题号缺号

`book.json` 的 audit 里已有 191 遗留的 `x1-承上页/未命名栏目(g0)` 缺号错误。
**依据**：charter engineering.md Guidance「Surgical changes — 只碰工单需要的，不顺手修」。
驱动的对账按**本次交付的那张卡**作用域，所以这条既有红不会把新路径刷红；
handoff 里报告它的存在。

### 9. 边界检查记在 `assemble.py` 的 audit 里，不只记在驱动里

**依据**：工单把它定成"补上 191 暴露但没修的结构性缺陷"，而缺陷在装订层——
放在 `assemble.py` 里 `ld-s10y-lesson` 也一起受保护；驱动只是把它从警告升级成本次交付的硬失败。

### 10. 红线查了一遍，没有一条拦住这条路线

engineering.md 1–11、operations.md 1–13、ui.md 1–4、product.md 1 逐条对过本计划要做的动作：
不加依赖（5）、不改 schema（7）、不碰生成文件（6）、只用 `LEMMADECK_DATABASE_URL`（8）、
内容脚本走 `content-db.mjs`（9）、产物只落 `ssot-resources/`（11）、不部署、不动域名、
零付费调用（operations 13）。唯一贴边的是 operations.md 5「对 `sr_*` 的无过滤 UPDATE 需人批」——
`publish.mjs` 的排序重排是按书册过滤的既定发布路径，不是无过滤 UPDATE，但它会动已发布四课的
`lesson_order`，所以并进问题 2 一起问。
