# STEMROBIN-180 源页 88 受影响修复独立复核

结论：**PASS，仅 `p0088#7` 第四行修复及指定 assembled 引文传播。**
首次 `source-review-88-90.md` 的 FAIL 原样保留；本报告关闭其中唯一的多字发现，
不覆写首次记录。88 其余单位及 89/90 的既有 PASS 沿用，不重新全页审查。
不审查或批准 91/92，不批准全书装订、现代层、SVG 保真或任何现代图。

日期：2026-11-15。审查者：Codex，非图像或源稿作者。
仓库：`/Users/yong/.codex/worktrees/0f12/lemmadeck`。
本次写集仅本报告；原物料、失败备份、他稿全部只读。

## 原像素与修复

实际重新打开 `.tmp/ld-s10y-lesson/6p/pages/0088/page.png` 的
`[590,1865,470,75]` 原像素局部，内存中按最近邻放大 2 倍显示，未新增图文件。
清楚读到“负荷能力却增为 30 倍”，其中“却 / 增 / 为”直接相接，没有“加”。
这不是同形字字种推断或措辞偏好；修复删除的是不存在于源像素的 U+52A0。
不以 finalize 26/26、作者说明或 MD/JSON 互相一致代替此像素判断。

保留失败稿与当前 `page.md:84`、`page.json:149`
（`blocks[6].lines[3]`）的实际差分均为：

```diff
-我化费同样的力气，负荷能力却增加为 $30$ 倍，所以我就可以同
+我化费同样的力气，负荷能力却增为 $30$ 倍，所以我就可以同
```

分别对两文件的原始字节断言：失败文件仅替换一次“却增加为”为“却增为”，
结果与当前文件逐字节相等，各减少 3 个 UTF-8 字节。JSON 结构差分也仅上述叶节点。
frontmatter/meta、其它行、全部块及 open/cont/samerow、图框和图 id 均未变。
“化费”未改为“花费”；真正印有“加”的 `p0088#5`“几乎增加了两倍”未受影响。

通过现有 `blocks.py` 解析前后 MD，补入工具派生的图 id 后，分别与前后 JSON
精确一致。当前印刷行数仍为 26；audit 与失败备份逐字节相等，26/26，
errors、normalizations、unknown_chars、katex_warnings 均为空。
本次未运行 finalize、assemble 或其它写入型工具。

## 图 64 未变

原 page/grid PNG 及页级 `figures/fig-64.png` 的 SHA-256 均与首次 FAIL 报告一致。
前后 MD/JSON/meta/audit 的精确框仍为 `[950,376,320,634]`。
PNG 仍为 344 × 658；内框全部 RGB 像素逐像素等于原 page.png 对应区域，
四周恰为现有 `layout.crop` 的 12 px 白边。
持久全书图库 `figures/fig-64.png` 与页级 PNG 逐字节相同。
图题块 `p0088#4 samerow` 未变；原物体与 caption 目视 PASS 沿用首次审查，
本次未重新审整图，也未批准 SVG 或现代生成图。

## 指定引文传播

只核 `lessons/phy6-c3-s19-t1/lesson.{json,md}` 中受影响的引文。
JSON 对象为 `prose[8]`，`kind=p`、`printed_page=77`，
`source_refs` 精确为 `["p0088#7", "p0089#1"]`。
其全文与当前 88 受影响块及此前已 PASS 的 89 首块经 `blocks.text_of`
拼接后逐字相等。MD 第 21 行为相同的完整独立段落，仅出现一次，
标准文件末尾 LF 不属于引文内容；两者均无“却增加为”残留。

89 MD/JSON 哈希仍与首次审查一致；本次只复用其首块作传播边界，不打开
89/90 像素或重新审查其内容。88 `open` 接 89 `cont` 的既有结构未变，
尾“在”正确接首“灶神星上”，全文一对引号于“一跃而过.”后闭合。
康·爱·齐奥尔科夫斯基、《通往星球世界的道路》、“化费”、
30 倍、60 个人、50 厘米、30 米、15 米及续页文字全部按源块保留，
没有借传播检查进行现代科学或历史译名修正。

这是指定引文的实际传播 PASS，不是整课其余段落、91/92、全书或发布 PASS。
主会话汇总的页数、课数、题数和图数不作为本次独审依据。

## 快照绑定

以下路径均相对于上述仓库：

- `R` = `.intentfold/tickets/STEMROBIN-180/`。
- `S` = `.tmp/ld-s10y-lesson/6p/pages/0088/`。
- `F` = `S/failure-02-extra-character/`。
- `D` = `ssot-resources/soviet10year-textbooks/artifacts/6p/`。
- `L` = `D/lessons/phy6-c3-s19-t1/`。

| 文件 | SHA-256 |
|---|---|
| `R/source-review-88-90.md`，保留首次 FAIL | `bec3077b1cdb150f17b4e540392f4fef0dbc008437d24073084fe77634232835` |
| `F/page.md` | `de8babf80c3ae19d7289b5c967115fb86e1e5fae971b69fc35ac6c603a0a3027` |
| `F/page.json` | `d3f8c7ced80bae041876517f2f6dd9bf2b2f168c1b782cf7902aedf6b45785d5` |
| `F/audit.json` | `1da0a801174f3999da01862c61550755ee3a9071aa13e218747a277d7afacbe4` |
| `D/pages/0088/page.md` | `226c6b82f72915de23f0149e0e57e184444fbf60afb1b8f9a5274b9715b4c5f5` |
| `D/pages/0088/page.json` | `74e613a6f970164e1e8405c7c11d4a32422bb17d454561eb3962b4c5b07104ac` |
| `D/pages/0088/audit.json` | `1da0a801174f3999da01862c61550755ee3a9071aa13e218747a277d7afacbe4` |
| `S/page.png` | `c8fecf97d8afa51c7cd00e924d61ab0c3effe4f7b702b89c2c7ca2fe6fd93ab9` |
| `S/page.grid.png` | `a34709374600c583de1c38c87891a9c218cae66312aeb2668f56450441e1a4df` |
| `S/figures/fig-64.png` | `8f0b3ef3ca8ba7d850eaaf5e8d6bcd16666371ed77a9d2297627ecd51209326a` |
| `D/figures/fig-64.png` | `8f0b3ef3ca8ba7d850eaaf5e8d6bcd16666371ed77a9d2297627ecd51209326a` |
| `D/pages/0089/page.md`，仅既有续段证据 | `b190f22a15cec3ea2ed38a16f55b76ff3d5c3d34126b4f1e0eb68ae783469351` |
| `D/pages/0089/page.json`，仅既有续段证据 | `fa87fd81535ff5c2d4e567f1cb9620eb8589e0b876aa181a3a9734a6c1fdc3d2` |
| `L/lesson.json` | `0c3d2a048076446f5fdf8963684f33360437ffdb8e163cee9ce27e214762b59f` |
| `L/lesson.md` | `ef28791618ba064b1f9339397cc152baf82db566977fa54b1c299040604a8a86` |

原 PDF 与 profile 哈希也匹配首次报告。本次只读复核使用既有 Python、
`-B`/禁用字节码、Pillow 和块解析工具，无安装。写后再核以上绑定与首次 FAIL
未变。无源/现代/他稿修复、重裁、装订、晋升、生成模型、DB、应用、依赖或 Git 修改。
本报告可作后续图审的源证据，不能替代该图的独立像素及产品显示宽度审查。
