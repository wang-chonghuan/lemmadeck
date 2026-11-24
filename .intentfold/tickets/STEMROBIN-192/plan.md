# STEMROBIN-192 — plan

## 读代码读到的、工单没说的事

- **`finalize` 已经是批量报错的**（`p2c.py:265` 把所有页级失败收进一个 `errors` 列表）。
  一次只报一类错的是另外两处：`edition.py` 的来源绑定链（`SourceBook.candidates`、
  `_authoritative_source_targets`、`source_errata` 里 10 处 `raise SystemExit`）在第一处绑定
  不一致就整轮退出，于是图、FigureSpec、display 这些本来独立的检查根本没跑；
  `validate_spec.py` 的 `validate()` 本身是单遍全收的，它的"三轮"来自 **stage 阶梯**
  （draft → rendered → approved）和"渲染失败才看见下一类错误"。
- **渲染器的候选集默认只有一个。** `render_spec.mjs:722` —— spec 写了
  `labelPlacement.position` 而没写 `fallback` 时，候选集就是那一个位置，撞了直接判 collision 失败。
  八个候选只在没指定 position 时才用。这就是"标签位置来回五次"的机制。
- **候选区域的材料已经齐了。** `layout.py` 有连通域标注、行带统计、页边/书脊过滤和
  `snap()`；缺的只是"把非文字连通域聚成簇、编号、画在图上"这一步。
- **`math3-c1-ex5` 正是工单说的那个结构缺陷的现场**：TOC 说它从印刷页 40 起、下一张卡
  （`math3-c2`）在印刷页 43，所以它占印刷页 40–42（PDF 44–46）。仓库里只有 PDF 44，
  `book.json` 已经把它装订成"8 道题"的一课并且没有任何机械检查报警。
- **既有污染**：`book.json` 的 audit 里已有 `x1-承上页` 的题号缺号错误（191 遗留）。
  本单不修它（surgical changes），但驱动的对账必须按交付的那张卡作用域，不能被它刷红。
- 四课已发布的基线（`tmp/db-baseline.json`）：ex1 36 题 / 6 svg，s2 17 / 3，s3 31 / 4，
  s4 16 / 3，全部 `modern-us-neutral`；`math3-c1-ex5` 不在库里，所以发布它是纯增量。

## 路线

新技能 `.claude/skills/pages2lesson/` 只装**驱动**，不复制工具：四处改造落在
`ld-s10y-lesson/tools/` 和 `ld-s10y-image/scripts/`，全部向后兼容、不动它们的对外命令。
理由在 charter Guidance「Reuse before inventing」；复制一份工具会立刻产生两份真相。

### A. 驱动：`.claude/skills/pages2lesson/tools/p2l.py`

一条命令、可重入、按 gate 停：

```
p2l.py run --book 3m --lesson math3-c1-ex5            # 或 --pages 44-46
```

每次调用把**所有机械活一路跑到下一个未满足的 gate**，然后一次性输出"还缺什么"。
机器阶段与模型 gate 交替：

| 阶段 | 机器做 | 之后的 gate |
|---|---|---|
| P0 解析 | TOC 认领卡片 id ↔ 页码范围互推互校；**小节边界检查** | — |
| P1 备料 | 批量 `prepare`（复用 `production.prepare_range`）+ **候选裁图区域** + 工单清单 | **G1 写页面文本** |
| P2 装订 | 批量 `finalize`（全页收齐错误）→ `assemble` → `vectorize` → `assemble` → 对象级对账 + 边界检查 | **G2 写现代版文本** |
| P3 成图 | 每图 `validate_spec` + `render_spec` + `record_review`，再 `adapt-finalize`；全部图与 edition 的错误并成一份报告 | **G3 写插图语义** |
| P4 交付 | `render` 自包含 HTML → `publish.mjs` 真实入库 → 读回核对 | — |

失败时不在第一处退出：每个阶段把本阶段**所有**页/图/判据的失败收进一份结构化报告
（`.intentfold`/`.tmp` 外的 `.tmp/pages2lesson/<book>/<card>/report.json` + 人读的摘要）。

### B. 校验器一次报全

- `edition.py`：`_authoritative_source_targets` / `source_errata` / `SourceBook` 的
  `raise SystemExit` 改成返回错误列表，由 `validate_lesson` 并进它已有的 `errors`；
  绑定失败只跳过**依赖绑定**的文本比对，schema、图、FigureSpec、display、layout 照跑。
  模板缺文件也走同一条路（现在是 `load()` 直接 SystemExit）。
- `validate_spec.py`：`main()` 对缺文件/坏 JSON 返回 JSON 错误载荷而不是抛出，驱动才能
  把它和别的图并进一份报告。
- `render_spec.mjs`：`Unsupported label placement` 这类硬 `throw` 改成收集错误；
  一次报出全部标签、全部 display 宽度的失败。
- 驱动：一张图失败不跳过其余图；edition 与图的失败同一份报告。

### C. 标签布局由渲染器自己解

`render_spec.mjs` 的打分保留，外面套三级让步，全部在现有单次 `page.evaluate` 内：

1. **错位**：候选集 = 指定位置优先 + 其余八个方位（`fallback` 变成默认，不再只试一个）。
2. **错开**：每个方位再乘 gap 系数 `1 / 1.5 / 2.25 / 3`。
3. **扩画布**：仍不行就给 viewBox 加边距 `m ∈ {0, 8%, 16%, 25%} × max(W,H)`，
   重跑整轮布局（`occupied` 清空），`outsideArea` 按扩后的矩形算。
   几何像素不变、只多出空白，所以在固定显示宽度下标签会等比变小——因此
   **只有 `displayChecks` 仍然全绿的边距才接受**（`display.minTextPx ≥ 16` 是既有硬约束）。

成功时把解出来的布局写进 render 报告的 `layout.resolution`（边距、每个标签的方位与 gap 系数）；
全部试完仍失败时报出 `layout.attempts`——试过哪些边距、每个标签在哪个方位得了多少分。

### D. 裁图框由机器提候选

- `layout.py` 新增 `candidate_regions(ink, …)`：连通域分簇（非字形连通域 + 被它们包住的
  字形）、复用既有页边/书脊/细线过滤、`snap()` 收边、按面积排序编号 `r1..rN`，
  每项带 `box / components / ink_px / rows`。
- `prepare` 把它写进 `layout.json`，并多画一张 `page.regions.png`（框上标 `r1 r2 …`）。
- `blocks.py` 的 `fig` 块头接受 `region r3` 作为 `box x,y,w,h` 的替代；
  `finalize` 从 `layout.json` 按 id 取精确框，不再吸附（候选框本来就贴着连通域），
  重复执行稳定。旧的 `box` 语法原样保留。

### E. 小节边界检查

`assemble.py` 的 audit 新增一条：一张卡的最后一张**已转写**页上若没有下一张 TOC 卡片的
标题块，而它正好是本书已转写页的末页，就记 `unclosed_card`。驱动把本次交付的那张卡的
`unclosed_card` 当**硬失败**（不是警告）处理——这是连续三课漏题的那条缺口。

## 不做的

- 不删、不改名、不改 `ld-s10y-lesson` 的对外命令；迁移与下线另议。
- 不修 `x1-承上页` 与 `book.json` 既有的题号缺号，只报告。
- 不动已发布 `math3-c1-s2/s3/s4/ex1` 的产物与库里条目。
- 零付费图像调用：驱动遇到 `generated` 模式直接停下来报告，不自己走 Azure。
- 不加依赖、不改 lockfile。
