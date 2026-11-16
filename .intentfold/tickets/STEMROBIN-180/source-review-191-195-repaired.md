# SOURCE 191–195 受影响独立复核

2026-11-16。身份：`independent_agent`；不是本批作者或修复作者。
结论：**F193-1 PASS；F195-1 PASS。批准本报告绑定的191–195源页 union，非装订完成或图185批准。**

仅复核两处授权修复的原像素、MD/JSON/audit和冻结差异。191/192/194完整PASS、193/195其余全文PASS及五图180–184完整PASS均从首轮独审复用，没有再次全文审题、审图或跑机械门禁。

## 输入绑定与首轮保留

修复候选根：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-191-195-repair-01`

| 输入 | SHA256 |
| --- | --- |
| 修复 author-handoff.json | `48b1217908328b696e4d9579e5eb9ec634445424d1eab9973c496e6fe07436a0` |
| 修复 source-manifest.json | `b24ca3b32319667f94bd34a5eceb1c99608c917ded0ee64f2929bc4b601ee82f` |
| 修复作者报告 | `3b7a7a254fa1e520c6aa96762c1277e11dee981c81fa22dc02f8bb63e49024ce` |
| 原作者 handoff | `89aabd89c03c7b7b1fe3f62875fe497752cd8459035d62d3f32588219e0f8a17` |
| 首轮独审 FAIL 报告 | `9da561ff7e6d6b9acc3a4600f7d101531f8d61d7546b5d67bcb79767ceebfb27` |
| 首轮独审 review-manifest | `db895df26b7006e170b9ba890fd7ccba5065e3ec4b2a242b46a32efb9b3a18aa` |
| 首轮拒绝副本清单 | `8910b20db824f6b8904a784a11cb081f706632a58838d90a31a99389e886a762` |

首先独立计算修复handoff SHA与委托一致，然后逐项核对其154个拥有文件绑定及原handoff的112项冻结绑定；全部匹配。首轮拒绝副本的全部copy字节、原审查报告及绑定审计亦核对未变。未覆盖或改写任何原FAIL证据。

## F193-1：PASS

实际打开修复根 `work/6p/pages/0193/page.png` 完整无网格原像素一次，仅观察授权标点所在行；该PNG与首轮原PNG字节一致，SHA `20cce0aacc3ea307d299750760ef34593bd0091c19bd362e332901b9a4b9a53b`。原“力”之后清楚是基线句号，“而”开始下一句，不是逗号。首轮局部像素证据保留复用，未新裁图。

修复 [page.md:60](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-191-195-repair-01/artifacts/6p/pages/0193/page.md:60)：

```text
旧：力平衡甚至克服较大的力，而为此只需选择适当长度的力臂.
新：力平衡甚至克服较大的力. 而为此只需选择适当长度的力臂.
```

独立逐字节验证整份新MD恰等于旧MD唯一一次 `力，而为此`→`力. 而为此`；不是仅相信作者diff。JSON整树恰只有 `/blocks/6/lines/1` 相同替换，meta、其他块/行/公式、粗体、open/cont/samerow、owner、notes/errata、源身份全部不变。新MD解析出的meta/块与新JSON一致。

audit字节不变：`e96a7b8e493c24d100d240900c165767f0bf193744c8556126182373bd053680`。完整原PNG/grid/layout/template work文件集与原根相同且逐项字节一致；原审的24行/13块结论复用。

作者唯一修复1/1；已有官方finalize一次exit0、24/24、0规范化、stderr空，当前三产物与该调用输出绑定一致。只读已有日志，无重跑。

## F195-1：PASS

实际打开修复根 `work/6p/pages/0195/page.png` 完整无网格原像素一次，仅核指定第四行的标点；其SHA `bf0f8f6be73fb4441134dfe60a17e9c71beb9f645a8dfa74e5fdcb16a26113b2`与首轮相同。“长得多”之后的基线句号清楚，“这”属于下一句。首轮局部原像素证据继续保留，没有新裁图。

修复 [page.md:62](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-191-195-repair-01/artifacts/6p/pages/0195/page.md:62)：

```text
旧：得整齐. 剪金属片用的剪刀（图183）的柄要比锋刃长得多，这
新：得整齐. 剪金属片用的剪刀（图183）的柄要比锋刃长得多. 这
```

整份新MD恰是旧MD唯一一次 `长得多，这`→`长得多. 这`；JSON整树仅 `/blocks/0/lines/3` 的对应文字变动，meta、其他正文/题面/图号/西里尔枚举、所有标记/notes/errata不变。新MD/JSON全部字段一致；此比较是复用结论的差异证明，不是重新做全文审查。

audit字节不变：`aa13ef8dea05aa10b45d7ca472b530928b924cb556d1b993caddfebb58254f12`。PNG/grid/layout/template及图183/184的完整PNG/SVG文件集逐项与原根字节相同，几何框与原审一致；图完整PASS只复用，不重新打开或渲染。原审22行/13块/3题与末尾closed结论不变。

作者唯一修复1/1；已有finalize一次exit0、22/22、0规范化、两图原框未变、stderr空，当前MD/JSON/audit绑定与该输出一致。没有再次prepare、crop或vectorize。

## 当前批准 union

| 页 | 使用的根 | 独立批准依据 | 块 / 原印刷行 / 题块 |
| --- | --- | --- | --- |
| 191 | 原 `source-author-191-195` | 原完整PASS与字节不变复用 | 13 / 23 / 3 |
| 192 | 原 `source-author-191-195` | 原完整PASS与图180/181不变复用 | 11 / 18 / 0 |
| 193 | 新 `source-author-191-195-repair-01` | F193-1 PASS＋其余原完整PASS复用 | 13 / 24 / 0 |
| 194 | 原 `source-author-191-195` | 原完整PASS与图182不变复用 | 17 / 23 / 7 |
| 195 | 新 `source-author-191-195-repair-01` | F195-1 PASS＋其余全文及图183/184原PASS复用 | 13 / 22 / 3 |
| 总计 | 以上精确union | 源页批准，仅本批 | 67 / 110 / 13，5图 |

两个根均为仓库下 `.tmp/ld-s10y-lesson/` 的独立scratch。批准清单逐页列完整绝对 `active_root/artifacts_root/work_root`、MD/JSON/audit、原PNG/grid/layout、完整work文件及图PNG/SVG的bytes/SHA，避免将修复根中的其他副本当作191/192/194批准版本。

| 受影响页 | 当前MD SHA256 | 当前JSON SHA256 |
| --- | --- | --- |
| 193 | `cc19ca6e9e6acaf31043389119f1db4e5590fafcce65410fbd236f9912596bc6` | `4ff36b958e128ae1de5cc9d114f9d4e334db191278ea07b81de3d01ee1ca43d8` |
| 195 | `0bd428991bd065c1bb6f3c20b6772791259d9ba2c54cced8d320fb09783ef2ed` | `2f5f7f75126b51bdcfa584eb39acbc283dd91520430b85b7d9ad730a137d0330` |

五图180–184的PNG/SVG SHA和原框保持首轮批准值；195的183/184采用新根中的字节相同副本。其余三页三产物SHA全部保持首轮批准值，完整清单有精确记录。

## 执行与边界

本审查官方prepare/finalize/vectorize、crop/render、浏览器、服务、DB、Git、canonical编辑、晋升及assemble调用全部0。只实际查看两张已有完整原PNG的受影响句号，然后做只读哈希和新旧结构/字节比较。

审查自有scratch脚本首次读新调用日志时因不存在`streams`字段退出1；只修该脚本读取已handoff绑定的独立stdout/stderr文件，重新完成只读比较，未重跑官方门禁或改变候选。此自有日志解析问题记录在 `helper-first-run-error.json`，不是新源缺陷或作者第二次修复。已有两次作者官方调用工具before/after集合相同，相关日志与当前输出已只读核实。

195题面的图185是本批之外的后续图引用。本报告**不批准图185，不读取196–200冻结、不宣称下游引用闭合或装订完成**。主代理仍需等待后续源独审批准后自行处理晋升与装订；本批准仅针对上述191–195源页union。

## 交接文件

- 本报告：[source-review-191-195-repaired.md](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/source-review-191-195-repaired.md)。
- 受影响审计：[affected-audit.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-191-195-repaired/affected-audit.json)，SHA `fab90059f98407a193574229efc7eab750842a74da760e094d6330592c32905e`。
- 精确批准union：[approved-manifest.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-191-195-repaired/approved-manifest.json)，`approved_manifest:true`、`page_source_approval_only:true`，绑定本报告、两处PASS、首轮FAIL及新旧handoff；未执行晋升。

首轮FAIL报告、manifest与拒绝副本保留原样。本次两处affected-only审查已结束，无额外作者修复或后续页审查。
