# 10c physical41 erratum metadata-only 独立复核

日期：2026-11-16。STEMROBIN-184。Worker B / Codex，父方既有工单委托下的原唯一SOURCE reviewer，非erratum数学作者。本次仅登记结构/原式/源及命令绑定核对；**不是第二次数学审批**，不重新推导或审核reason中的反例。

## 限定结论

**metadata-only limited PASS。** 仅新增一条 `p0041-math-1`，绑定本页第16个原block及确切原式；faithful正文 `g(y)` 原样存在。当前完整page JSON仅 `/meta/errata`变化，audit仅 `/errata`数量0→1。完整MD body和全部17个blocks保持原值；notes/source/render/rows及其余字段未变。现有一次affected-finalize为21/21、exit0，本审者没有执行它。

复用原41/42 Stage B的其余limited PASS及109字形磨损等UNKNOWN；**不解决严格单调定义出处UNKNOWN，不批准未来现代定义/文本/答案或整个84**。新增reason是父方登记的既有数学结论载荷，这里只核完整性与一致性，不冒称本审者再次独立数学PASS。

## 范围与冻结

原唯一Stage B `source-review-10c-p41-p42.md` raw SHA256 `814349b976936ffc42d02a73086acdcd19475e67e209d0ceae8e4de3a3bed372`；原完整source-first最终冻结 `source-review-10c-p39-p42-source-first.md` SHA256 `68cd478a852dab7c538cb4d604c3c18cc0e6108741b109150a2500575cd8788c`。均未改，全部已通过事实及初读/读稿后局部辨字顺序限制继续保留。

本次仅读 `D=.intentfold/tickets/STEMROBIN-184/tmp/n84-source-erratum/` 的before/after三文件、comparison.json、finalize命令/streams及当前durable41；没有打开该目录的modern template-before、其他作者/独立数学报告、现代正文、图、答案或choice。

before三文件分别byte-equal旧Stage B已审 `source-10c-p41-p42-evidence/0041/after-finalize/durable/`。修后durable三文件分别byte-equal本次 `D/after/`；不是对另一份漂移稿作绑定。未重开原页、grid或任何crop。

## 唯一erratum精确绑定

当前 `/meta/errata` 从空数组变为长度1，条目字段恰为非空string `id/block/original/reason`：

```text
id: p0041-math-1
block: p0041#16
original: $y_0=f(x_0)\Longleftrightarrow x_0=g(y)$
```

- `p0041`与当前meta.page41一致；1-based第16个block实际存在，`kind=p`、`open=true`、`cont=false`。
- 第16个block的第二条 `lines` 中包含上列完整`original`，逐字符相同；全17个blocks只有第16个匹配，且该block内完整原式恰一次，没有把相似式/另一题作为绑定。
- 第16个block及其全部三条真实源行与before严格deep equal，原 `x_0=g(y)` 没有加下标、替换或删去。MD body同样字节值相同，未把erratum修复式回写faithful正文。
- `reason`与comparison.json的条目逐字段deep equal，原样保留父方量词/反例/修改理由/provenance记录；这里只确认该载荷，不重解数学或核读其中所指另一作者材料。

实际cap1 JSON用位置和`lines`承载block，不含独立`id`/`text`字段。初次只读辅助检查误按`id/text`查找，出现undefined/false；随后按实际第16个block及`lines`核验，得到唯一原式匹配。错误查询结果不是源绑定错误，也没有据此修源/工具或伪造失败gate。

## 全字段差异和保护范围

对before与完整current page JSON做递归deep comparison，唯一新增叶项为 `/meta/errata/0`；去除errata后整个JSON严格deep equal。17个blocks全部deep equal，未改kind/open/cont/lines/行数/标签/owner/框/samerow。

MD raw diff只在frontmatter `errata: []`处追加这一对象。所有notes原值保留，包括初次源作者关于忠实录 `g(y)`、当时不补字/不作勘误的原记录；不将旧记录当作“当前未登记erratum”的断言。未改notes、正文或旧观察来迎合此次登记。

audit唯一差异 `/errata: 0→1`。其余完整字段严格deep equal：`lines_printed=21`、`lines_md=21`、page41、figures空、normalizations/unknown_chars/katex_warnings/count_exclusions/errors均空。独立21排复用原冻结，不重新计数；audit空unknown不能消除旧字形UNKNOWN。

保护的meta.source仍为原PDF名/原PDF SHA `47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40`/pdf_page41；meta.render仍dpi300、1695×2580、原PNG SHA如下。没有重新读取PDF、现代lesson triples或现代render来扩大确认；comparison.json中的跨lesson限制声明不是本次另行检查证据。

当前prepared原PNG/grid/template/layout静态字节均与旧Stage B after快照相同：

| 文件 | raw SHA256 |
| --- | --- |
| page.png | `93ef6af360bbf1136ec61fd934426ca4485cd6b6d2cb152520b76b3768a6ed8c` |
| page.grid.png | `e00ac3682d44706050b69ec8dd2d3fa16d4861f8bbb1f0d612ca90e6b9f91263` |
| page.template.md | `cb0eb66769889642efe62880d4d46614e3361f877d77b14e12c3d157c4393fb8` |
| layout.json | `629227693f6e2e9fe94133bcfa4ee173ac1fec58f1d80f4fb0ce8af3f1ee7983` |

41无实际figure/crop对象，本次没有图像观察或图形approval。

## 当前raw SHA及实际affected命令

durable root `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0041/`：

| 文件 | D/before raw SHA256 | current durable / D/after raw SHA256 |
| --- | --- | --- |
| page.md | `8ee796b41f8ea8c661b1ca95cd11582f7e343f069c595f76e1a813ef5576f6e3` | `8afccb7bf8fae5963f4b27a1348099499859bfa93986b247e7c0dab4c9adda99` |
| page.json | `a9d4042068c380444408c85dbbdc81f86a3164b90540ceb20f5292c612085e7a` | `2eb9461fb205b8e31a1df0f894239ff46512ddad5d08125e0554f07c36042881` |
| audit.json | `1ccae30ce59217801998737444e9326029013955fc617393f517aa4bda189eac` | `7bde5e9d7ebb3c39b80f9312d943a98bbe9484cb220f99db6faa6a51dc0b17db` |

| D证据文件 | raw SHA256 |
| --- | --- |
| comparison.json | `a6ba77df1383a171b677a5d74fd2551e567784f5bf368c872e84b64d3c4b3202` |
| finalize.command.json | `ba580f704c4eeeb2dd0cc02209e2c016e0c520b2b2a6125cf3e2ad31586f4391` |
| finalize.stdout.txt | `4b7c0cd6e4474f53c473503de4c8e4c8e9515d3793dc14b6135578b782a8feeb` |
| finalize.stderr.txt，空 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

父方保存的actual argv为 `.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 41`，cwd本工作树。记录2026-11-16T07:03:29.291Z开始、07:03:29.740Z结束，exitCode0、signal/error null、stderr空；stdout实际17块/21行（印刷21）/图0/规范化0，通过。与comparison.json `actualExitCode=0`及current audit相符，未声称本审者执行或复跑。

## 停止

只新建本metadata-only报告，旧SOURCE报告/冻、n83两表StageA和所有源/工具字节不改。没有新数学审查、原页/图重复观察、counter/test/finalize、metadata修稿、modern/template/答案/choice、装订/发布、Git/DB/网络/浏览器或其他聊天操作。

外取本报告raw SHA后停止；等待父方披露n83表author完整包才进行唯一表Stage B。本次erratum绑定限定PASS不能用作严格单调定义出处、现代文本或表图批准。
