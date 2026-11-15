# STEMROBIN-180 源页修复独立复核：76

结论：**PASS（仅 p0076#9 图 52 首分图引用的字种修复）**。
首次 `source-review-76.md` 的 FAIL 原样保留；本报告关闭其中唯一 P2，
并复用其余未受影响的源审查结论，不重新进行全页目视审查。
不批准装订传播、§29 跨页闭合、现代版、答案或发布。

审查日期：2026-11-15。审查者：Codex，独立于修复作者。
仓库：`/Users/yong/.codex/worktrees/0f12/lemmadeck`。

## 前后快照差异

修前文件没有另存为独立备份，本次没有伪称直接读取了备份。
以首次独立 FAIL 报告绑定的旧 SHA-256 为校验依据，在内存中对当前
MD/JSON 的唯一“（图 52，а）”逆变换为“（图 52，a）”，恢复修前候选。
两份候选分别精确匹配旧文件 SHA-256，才用于生成前后 diff。
候选快照和 diff 均未写入磁盘；这不是只接受作者的变更说明。

| 对象 | 修前 | 修后 | 独立核对 |
|---|---|---|---|
| `page.md:94` | Latin `a`，U+0061 | Cyrillic `а`，U+0430 | 整份文件仅一个码点改变，UTF-8 长度增加 1 字节。 |
| `page.json:181`，`/blocks/8/lines/0` | Latin `a`，U+0061 | Cyrillic `а`，U+0430 | 唯一 JSON 叶子差异；其他 meta、块、文字、标记及字段顺序不变。 |
| 同段第二分图，MD 95 / JSON 182 | Cyrillic `б`，U+0431 | Cyrillic `б`，U+0431 | 未改为 Latin b，整行未变。 |

两份文件的 diff 均只有以下一行替换：

```diff
-当手作用于球时（图 52，a），弹簧被压缩，即弹簧的端点
+当手作用于球时（图 52，а），弹簧被压缩，即弹簧的端点
```

使用现有 `tools/blocks.py` 重新解析修前候选与当前 MD：
二者分别与对应 JSON 完全一致，当前 p0076#9 的五行正文完整，
未改变手压、弹簧压缩/伸长、球运动的先后关系或其他标点。

## 源同形字的字种依据

本次只重新打开原始 `fig-52.png`，1152 × 201，完整看到左右两分图
及右侧 б 标号；没有重新打开整页 page/grid 或图 50/51。
原图哈希与首次审查一致，因此此前源页段落、图题及各物体关系的
实际像素观察可以复用。

左标号为 a 形，右标号明确为 б 形。同组“а / б”的西里尔序列及
首次报告记录的本书源层字种约定，是把首标号存为 U+0430 的依据。
当前 profile 的 `enum_marker_script="cyrillic"` 及技能的同形字警告
也未变化；这里不是把现代版 Latin a/b 规则应用于原始层。

证据限制不变：位图没有 Unicode 码点，不能仅凭同形 a/а 的左侧
像素区分 Latin 与 Cyrillic。PASS 依据是源分图序列的字种身份、
当前文本的实际码点，以及经旧哈希验证的唯一变更，不是声称
肉眼看出了 U+0430，也不是以作者 finalize PASS 代替独立比较。

## 未受影响的证据复用

- page.png、page.grid.png、audit.json、三张原始裁图 PNG 均与首次
  FAIL 报告绑定的哈希一致；没有重裁图或以新近似图框替换精确框。
- 三个精确框仍为图 50 `[209,483,467,277]`、图 51
  `[878,461,261,312]`、图 52 `[168,1529,1128,177]`。
- JSON 仅 `/blocks/8/lines/0` 改变，其他正文、图题、figure 身份、
  open/cont/samerow 及页码均未改变。继续复用首次审查中这些项目的
  已通过观察，不作第二遍全页视觉审批。
- 使用用户指定的现有 Python，只读调用既有 layout 行带计数与块解析：
  按原精确框遮图后，当前印刷行数 18；块体行数、meta 和 audit
  均为 18，audit errors 为空。未运行 finalize，也未安装依赖。
- 页末 open 结构未变，但本次不核对后续页，不证明跨页闭合。
  不读取或触碰 Feynman 正在审查的 77/78，不涉及另派的 79–82。

## 哈希绑定

| 文件 | 修前 SHA-256 | 当前 SHA-256 |
|---|---|---|
| 持久 `pages/0076/page.md` | `c3cc9b8d28fffda696cd8428ab15fd9dee648a7073ec7e8cd0a9aa95a8eb04be` | `4ec10851d80a7a7d2c7cd389c568f4dbd18c5c75b20ab6daa7dd4f8d09d05026` |
| 持久 `pages/0076/page.json` | `e24777575242e4e6c235d81b0a448cd4bf073266fa40cc73194c562bc0e0aafc` | `1f9804c3a8f4146563c79ac627a50cb7d2847e464078af5afeab7de2beba0ed6` |

下列文件已与首次报告绑定值独立比较，均未变：

| 文件 | SHA-256 |
|---|---|
| 首次 `source-review-76.md` | `ac8e5f98124e9263d2d3ac4d3723f9d1b570079b8120f7b533a8ea3a55af390c` |
| `.tmp/.../0076/page.png` | `3e74174543feac51d78222b6cc5601774b5e5e5420e5d52332eb5c5b35955ad4` |
| `.tmp/.../0076/page.grid.png` | `f4e85ecf867ab8627a2b1f46663793a06b65b61922c0815c2c0bb9244ca71e61` |
| 持久 `pages/0076/audit.json` | `ff8b2c8acaa27d88f5b768b03b14e24054438c98c17f3802c99f017a66b5b7dc` |
| `.tmp/.../0076/figures/fig-50.png` | `e938567a51bf8fb034b331b895a5e644b6e61a0f8b677b467db53d01db12329b` |
| `.tmp/.../0076/figures/fig-51.png` | `04e66edb8a3036ebcf33a1c93df356dab0124fabe06e188f02ff4d8434bb6de2` |
| `.tmp/.../0076/figures/fig-52.png` | `2a00c2f13dbabab7267da089a72bdd309ca98b2c96e57a517d3a36444e4952fe` |
| `ld-s10y-lesson/SKILL.md` | `b3666f4ea4a094c269a2d628a455cbb00598e770d93903fd810597e6f8a9b405` |
| `profiles/soviet-cn.json` | `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849` |

首次报告的哈希是在本次复核开始时记录、结束时复验，并非首次报告
对自身的自绑定。其正文及首次 FAIL 结论没有改写。
`.tmp/...` 指 `.tmp/ld-s10y-lesson/6p/pages/`；
持久 pages 指 `ssot-resources/soviet10year-textbooks/artifacts/6p/pages/`。

复核解释器：
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`，
设置 `PYTHONDONTWRITEBYTECODE=1` 并使用 `-B`。
本次写集只有 `.intentfold/tickets/STEMROBIN-180/source-review-76-repaired.md`；
无源修改、finalize、assemble、晋升、传播验收、模型调用、DB、应用、
依赖或 Git 修改，不撤销其他 agent 的工作。
