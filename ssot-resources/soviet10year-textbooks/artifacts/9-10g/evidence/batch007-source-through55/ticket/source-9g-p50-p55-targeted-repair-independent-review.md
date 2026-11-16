# STEMROBIN-184 / 9-10g / 唯一 affected-only 修复复核

结论：**有限 PASS：声明的50/51/53/55定点修复精确完成，其余文字、metadata及源像素未发生未声明变化。** 仅承接原唯一 StageB 的修复项，不是重做六页源审查、数学解答、装订或发布门禁；未决字符不因本结论转为已确认。

工作区：`/Users/yong/.codex/worktrees/a07e/lemmadeck`。
证据绝对目录：`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p50-p55-targeted-repair-evidence`。
比较其 `before/<page>/{page.md,page.json,audit.json}`、四个 affected 页的 `<page>/after/` 与当前 durable 文件；像素只作 `work-before/` 与当前文件的原字节比较。沿用本批原已读8张图片事实，**新增图片0，累计仍8**，没有重新打开图、grid或原页。

## 精确修复

下列 MD 引用均在 `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/`；JSON索引从0开始。MD完整差异与JSON全部路径差异相符，仅有这些变化：

| 页 / 当前引用 | 已确认变化 |
|---|---|
| 0050/page.md:77、:78、:86；JSON `blocks[6].lines[0..1]`、`blocks[8].lines[1]` | 127的subset后 `；→，`；127/129两处“相互位置→相关位置”。其他关系、条件、正文字符及断行不变。 |
| 0050/page.md:24、:25；JSON `meta.notes` | 125的 `dot{-}` 改为暂记、精确宏身份UNKNOWN；新增图54 `p/ρ UNKNOWN`。既有大写C、源符号正文、噪迹notes均保留，不任意改数学或图标签。 |
| 0051/page.md:49、:54；JSON `blocks[0].open`、`blocks[0].lines[4]` | `ex 133 cont → ex 133 cont open`，JSON false→true；“交点. 其中→交点，其中”。既有cont、分析全文、交集顺序、↵断点及52页后续均不变。 |
| 0053/page.md:83；JSON `blocks[10].lines[0]` | 150首处 `$A_1$、$B_1$→$A_1B_1$`；第二处 `$A$、$B$`及图56а引用原样保留。其他body及metadata不变。 |
| 0055/page.md:25；JSON `meta.notes` | 仅新增章标题低位点号编码UNKNOWN、图57 `l/ℓ UNKNOWN`。全部body逐字节不变，包括暂定标题点号、原“射影/象”、公式、samerow及末p open止于“四”。 |

四页JSON的其余全部路径一致；MD其余内容、空白/行尾连接空格、印刷断点及块头不变。除51上述open外，全部open/cont/samerow不变；图块/图引用/归属、source/render/profile、printed_lines、errata、计数排除亦不变。146字面“和平行面[BCD]”、150到54图56а的边界、55页n14未完边界未被改写。

## 原字节与机械记录

四页当前MD/JSON/audit全部与定点修复 `<page>/after/` 原字节一致。下表绑定此次实际after，而非旧首finalize结果：

| 页 | 当前 page.md SHA-256 | 当前 page.json SHA-256 | 已存本次 exit / md与印刷行 |
|---|---|---|---|
| 0050 | `b1596b90af2724f3ec4be6c056ecfaaec270eaed50e8e2347b2af87b1be2744b` | `dded5bdb61c329ebeceb21dd8817c96d921ce6d176599d9d6a667607abbd23b7` | 0 / 26/26 |
| 0051 | `1b49aa1dc112d1b93a4d431e7c7c245e1b2e79d73647c43fa8ed7d48e0b7208c` | `a80e6627912e07aa68b073942b13be163e4cdcdd56a519f70694f6e8b7b02f79` | 0 / 9/9 |
| 0053 | `608a15f278a6de15bc17152fab3aa3f822fff7ed8cfba40dd40fae1fd4ea3123` | `b54488bf61d4503f76d540312cb36c4912d2eea91acc82832a56b49d19133e94` | 0 / 26/26 |
| 0055 | `5a50d723885b619fef7c78597b4e9cf8fe3898b43d6404d42d3425766a610b29` | `aae04caefc5396fb2015372e4f777d29db463857291acd8a5ffd274b50e15426` | 0 / 21/21 |

只读四份已存 `command.json/stdout.txt/stderr.txt`：每个affected页有一次定点finalize记录，executable `.claude/skills/ld-s10y-lesson/.venv/bin/python`，args `["-B",".claude/skills/ld-s10y-lesson/tools/p2c.py","finalize","--book","9-10g","--page","<50|51|53|55>"]`，cwd为本工作区，exit0、signal/error为null、stderr为空。块数14/4/12/10；四份after audit与before逐字节一致，errors/normalizations/unknown_chars/katex_warnings/count_exclusions为空、errata0。未在本轮执行这些命令或重算印刷行。

`before.json`所列40项before快照摘要全部匹配；其工作文件与当前文件全部一致，包括六页page.png、page.grid.png、layout.json及全部四张实际crop。图框和audit中的components/from均未漂移：

| crop / 实际框 | 未变 SHA-256 |
|---|---|
| 0050/fig-54 / [841,551,373,424] | `73f9540d57e421709a2c2c04e594ec8ed48ef8dfc3c08e2f537be96d7b0e51b9` |
| 0051/fig-55 / [151,686,1065,1191] | `6f203be966b1afd76d7937ac2784d2663361e831eac293503d3163265375ce2e` |
| 0054/fig-56 / [158,264,1125,385] | `18b6d23fc5f1cdcb5d6b233929a956854fa501315873dab8c056b70459821c93` |
| 0055/fig-57 / [735,1083,497,409] | `bd34fe188dae7839256bb265a7cbe43853fb867bf9fb53da26a2477cec97d0c1` |

52/54仅作未受影响文件的字节比较，没有重读正文或新授来源结论：两页MD/JSON/audit各与before完全一致，因而既有全部body/rows/figurebox不变；52无crop，54仅上述fig-56。原图55三子图、图56两子图及其分图标的源事实沿用原StageB，不重复目视或调整计行口径。

## 冻结与未决

原唯一REVISE `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p50-p55-independent-review.md` 仍为 `583ba665c09e308df62cdc8bcfb2d935980087525b8bc861ffb7e9d6142efe03`，未覆写、删除或改为PASS。

两份首AUTHOR报告仍为 `4348338d43ba3be1ccfecc30321eba052ccdabe5acea83db8d23c2d8ca3cfae5` / `8b92599b8b2c5b28c80643ffbabcd5427d7db5bbe34641fcba51f3fc6ab2347b`；原manifests仍为 `10959956c44768e5ae31e77425ca44ae99e3324463a172f28ba1ef71107f070f` / `50068df0c688749ed66da437f905f26375468d96692503fc574ee6f6a8cfeee3`。其中62+32个原首attempt文件全部匹配各原manifest的raw摘要，首command/stdout/stderr及before/after记录未变。两份StageA冻结也保持原摘要 `902d3b839e84068a2dafdeab64d141e46a7de78a6ea3129ca58354f5eca89e5e` / `4aff2b04b38374aeddffa9d49f0c0f9d0dbcc8ae4ef5d36ee6ccae40cf3e66b3`。

**照留UNKNOWN**：151细小列表分隔的来源码点；125点横符号精确宏；图54 p/ρ、图57 l/ℓ、标题点号编码；а形字母的像素身份及原分图同排边界。源profile的Cyrillic要求与光学确认分开；不把暂定读形或机械白名单成功当成解码，不任意修数学。n14仍open，“四”后未读。

本轮唯一写入为本报告；没有页/图/工具/计数/排除修改，没有图片加载，没有finalize、计数器、validator、浏览器、DB、Git、答案求解或其他gate操作。至此停止，返回本报告路径与外取raw SHA-256。
