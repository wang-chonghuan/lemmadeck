---
name: pages2lesson
description: 把扫描教材的一段页码做成一课并入库——一条命令按书号与卡片 id（或 PDF 页范围）跑完识别、装订、矢量化、现代版改写、自包含 HTML 与生产入库，模型只在三处介入：看页面图写页面文本、写现代版文本、写插图语义。用于苏联十年制教材的逐课生产。
---

# pages2lesson

**一条命令，一课入库。**

```bash
P=.claude/skills/ld-s10y-lesson/.venv/bin/python
L=.claude/skills/pages2lesson/tools/p2l.py

$P $L run --book 3m --lesson math3-c1-ex5
```

反复跑**同一条命令**，直到它说 `done`。每次调用都把机械活一路跑到下一个未满足的 gate，
然后一次性告诉你还缺什么。失败时报出本阶段**全部**不通过项，不是第一项。

## 为什么是这样

这条链的能力早就跑通了（`ld-s10y-lesson` 的 cap1..cap6 + `ld-s10y-image`），
问题出在它们之间的缝：每道缝都要模型接一次。STEMROBIN-191 实测一课 254 个 turn，
其中 107 个（42%）既没调用任何工具也没输出一个字；132 条 shell 命令里管线本身只要约 20 条。
成本 = turns × 每轮上下文，所以要治的是**来回次数**，不是上下文大小。

于是这个驱动只做一件事：**把缝焊上**。它不复制那些工具，只按顺序调用它们，
把每一步的结构化结果收集起来，在该停的地方停。

## 三个 gate，别的都不要你管

| gate | 你写什么 | 写到哪 |
|---|---|---|
| **G1 写页面文本** | 逐页读 `page.grid.png` / `page.regions.png`，写带类型的块 | `artifacts/<book>/pages/<page>/page.md` |
| **G2 写现代版文本** | 把 `text` 改成 modern-us-neutral | `.tmp/.../adapt/.../*.template.json` |
| **G3 写插图语义** | FigureSpec（有哪些物件、哪些数值、谁拥有它）+ 目视验收 | `editions/<edition>/figures/<id>.spec.json`，然后 `--accept-figure <id>` |

**裁图框先看候选。** `prepare` 把候选区域画在 `page.regions.png` 上并编了号，
块头写 `region r3` 认领；一张表被拆成两个候选时写 `region r2+r3`。

实测（3m 印刷页 40–43）：**候选只对「有外框的连续墨块」有效。** 那一课两张图一个都没认领成——
靠留白分组的竖式阵列根本没被提出来，被细网格线切碎的方格条只提出左半截，
反而把背面透印的竖条和纸边污点提成了候选。所以判据是：
**对得上就认领，对不上直接 `box x,y,w,h`，不要为了用 region 去凑。**
手画的粗框 `finalize` 照旧吸附，代价不大。

**标签位置不要你算。** 写 `labelPlacement.position` 当首选就行。渲染器自己错位（八个方位）、
错开（gap ×1/1.5/2.25/3）、扩画布（边距 8%/16%/25%，且只在实测字号仍 ≥ `minTextPx` 时接受），
解不开才失败，并报出它试过哪些布局。

**FigureSpec 的骨架和数值边界在 G3 的工单里直接给出**，照抄即可——不要去 dump 现成的
spec 文件学格式，那是实测里最贵的一次读。最容易白跑一轮的两条：`canvas.width` 和
`canvas.height` 都必须是 **320–4096** 的整数（高度也不能小于 320），
`display.widths` 在 `layout: inline` 下必须含一个 ≤352 的产品宽度。

内容规则（块格式、字符白名单、西里尔小问标号、现代版改写判据、FigureSpec 字段）
**全在 `ld-s10y-lesson/SKILL.md` 和 `ld-s10y-image/SKILL.md` 里**，这里不复述。
驱动在每个 gate 的工单里给出要读的确切路径。

## 命令

```bash
$P $L run    --book 3m --lesson math3-c1-ex5      # 跑到下一个 gate
$P $L run    --book 3m --pages 44-47              # 从页码反推卡片
$P $L status --book 3m --lesson math3-c1-ex5      # 只看进度，什么都不改
```

- `--lesson` 与 `--pages` **任给其一就从 TOC 推出另一个，两个都给就互相校验**。
  推荐 `--lesson`：页码范围由目录决定，**自动包含收口页**。
- `--accept-figure <id>`（可重复）：目视验收后记 review 证据。
- `--no-publish`：做到发布预检就停，真实入库交给人。
- `--force-prepare`：重建 `.tmp` 里的页渲染与模板。
- `--json`：只输出结构化报告。报告永远同时落在
  `.tmp/pages2lesson/<book>/<card>/report.json`。

退出码：`0` 已交付 / `3` 停在 gate（已打印工单）/ `1` 本阶段有失败（已全部列出）/
`2` 硬停（需要人决定）。

## 收口页：这条检查是本技能存在的另一半理由

**小节边界常落在印刷页中间。** TOC 说这张卡起于印刷页 40、下一张起于 43，
那么 40–42 属于这张卡——而只有把 **43 也转写出来**，才知道第 42 页之后没有本卡的内容了。

43 没转写时，装订照样产出一课、题号连续性照样过（本卡自己的题号没缺）、
页级行数对账也照样全绿（它只看单页）。于是一课少几道题是**静默**的：
这已经连续让三课漏题（长度单位漏五道、重量单位漏两道、时间单位第 175 题分栏糊成一句）。

所以 `--lesson` 推出的页码范围**包含下一张卡的首页**，而
`assemble` 的 audit 里新增 `unclosed_cards`；驱动把本次交付那张卡的 `unclosed_card`
当**硬失败**，带着它不允许入库。只发布本卡，边界页带出来的下一节不发布。

## 纪律

- **零付费图像调用。** 驱动遇到 `mode: generated`（Azure gpt-image-2）直接硬停并报告，
  不自己调。要么改成 deterministic/hybrid，要么让人决定。
- **不动别的课。** `assemble` 是全书重算。驱动在装订后检查 `git status`，
  凡是改到别的课 `lessons/<other>/` 的文件一律 `git checkout --` 还原并在报告里记下来。
  已发布课程的 `lesson.json`/`lesson.md`/`exercises.json` 另有 rebind 防线（`--allow-rebind` 才放行）。
- **python 用 `ld-s10y-lesson/.venv`。** 本技能不自带环境、不装依赖。
- **`--dry` 不是终点。** 预检之后必须真实写库，否则这一课不算交付。

## 和 `ld-s10y-lesson` 的关系

`ld-s10y-lesson` 仍然是逐 cap 的入口，**没有被删除、改名或改动对外命令**；
需要只跑某一个 cap、或者处理驱动没覆盖的情形（整章生成、选择题接入、答案键）时用它。
pages2lesson 是它之上的驱动，共用同一套工具、同一套产物目录和同一个发布器。
