# STEMROBIN-182: n34 第三勘误受影响项绑定

**PASS；受影响项无发现。** 仅核验已确认并应用的 `p0218-math-1` 的元数据、正文差异、来源绑定及恢复记录。复用既有裁决，不重新求解或进行源文字/数学评审。零图像打开、解码、渲染或视觉比较；未运行管线、Git、网络、应用或 DB，未修改生产文件。仅写本报告及同名 JSON。

唯一工作目录：`/Users/yong/.codex/worktrees/d9b1/lemmadeck`。本报告所列相对路径均基于此目录。`B` 指 `.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/`，不是报告文件本身。

## 1. 源页：仅勘误元数据改变

比较 `B/n34-errata/before/0218/{page.md,page.json,audit.json}` 与当前 `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0218/` 的同名文件：

- `page.md` 去除 JSON front matter 后的正文逐字节相同；front matter 除 `errata` 外完全相同。
- `page.json.blocks` 深度相同，包括原文、公式、块序、所有框和续接标志；`meta` 除 `errata` 外完全相同，且与当前 Markdown front matter 一致。
- 源文仍保留原末句“函数值也较大”；没有把勘误写入忠实正文。
- 两种页面元数据均只新增 `p0218-math-1`，绑定 `p0218#9` 的完整原段落；该原段落等于当前 `blocks[8].lines.join("")`。
- `audit.json` 仅 `errata` 从 0 改为 1。其余字段不变；`lines_md=24`、`lines_printed=24`，规范化及错误数组均为空。
- 图 51 的源元数据与块框 `[226,759,366,376]` 不变；这是结构比较，不是图像或裁图认证。

| 文件 | 冻结 SHA-256 | 当前 SHA-256 |
| --- | --- | --- |
| `page.md` | `f28def6191ef6e22cc68e0488ba9966bf791433755d3902600e5074c19bee753` | `be72fd1cdb2b557314ee590e65bf1e207dd4cc5bc390b431913ac1cab2b91c91` |
| `page.json` | `08ab65604279ad7d064276ebebd503b232434818001d2c1973994890ec82453c` | `dbf2211f121d90b31a101069df5f672106d263c76a4da9fc3489a8c113da5166` |
| `audit.json` | `75686a4a4c0a3a35f58aec5da492ce2913534c126c3b95eac029ebfd763cbee8` | `4098e4b35fc187ae20a5b47a422676d6dee60366693c561c3612b85d688cf55b` |

前后正文的 UTF-8 SHA-256 均为 `5bec5534757ba886dd02bb6a3dbd5a6dd581fa9d5f6ff300d3853319781c077f`。

## 2. 已有 finalize 证据：exit 0，24/24

`B/stages/source218-erratum-metadata.start.json` 与 `.receipt.json` 的工作目录、命令及开始时间一致。该已记录的单次 finalize 于 `2026-11-18T23:24:49.886Z` 开始、`23:24:50.322Z` 结束，exit 0，无 signal/error。stdout 记录 11 块、24/24 行、0 处规范化及核验通过；stderr 为空。两个流文件实际哈希与回执一致。

本绑定未重跑 finalize。这里绑定指定的单次阶段证据，不声称对未提供的其他运行作全局计数。

## 3. 第三勘误的精确应用差异

应用前冻结：

- `B/n34-third-erratum-modern-before/0-lesson.json`
- `B/n34-third-erratum-modern-before/1-lesson.json`

两份冻结字节相同，SHA-256 均为 `0da63c78d41a8b4697c7d6c3dd3950c225de951cc01f4e3d11a9bf5e762f0ad3`。

**应用后的精确冻结版本使用 `B/n34-layout-before/lesson.json`**，SHA-256 为 `55af428b8de3f67ec3417ce9cad7b82473a9bc3970e4f650fed65e9648ed32ab`，与 `B/n34-third-erratum-modern-application.json` 中两个输出的应用时哈希一致。不能用后续排版完成的当前文件代替这个阶段基线。

应用前冻结与上述应用后冻结的全部差异可严格归约为：

1. `prose[40].text` 只将唯一的“函数值也较大”替换为“函数值也较小”；该字段其他字符、原有公式换行、数值和公式完全不变。
2. `prose[40].changes` 只在既有 `layout` 后追加 `math-correction`。
3. 根 `errata` 插入完整 `p0218-math-1` 记录。按 ID 比较，`p0215-math-1` 与 `p0219-math-1` 原记录完整保留；列表位置移动不算记录改写。

把应用后版本的 `prose[40]` 与 `errata` 恢复为应用前值后，整个对象与应用前冻结深度相等。因此没有其他本课字段变化，也没有新的旧勘误科学裁决。

根第三勘误：

- `target=lesson.prose[40]`；`source.page=218`、`printed_page=212`、`block=p0218#9`。
- `source.sha256` 精确等于当前源 `page.json` 的 `dbf2211f121d90b31a101069df5f672106d263c76a4da9fc3489a8c113da5166`。
- `source.pdf_sha256` 等于当前源元数据原值；未打开或重新认证 PDF。
- `original` 是 #9 的完整原段落，不是只截取错误词；`corrected` 是该完整段落的现代排版版本，只有最后的比较字作数学修改。其公式前换行本来就在冻结现代正文中，并非第三勘误引入。
- 完整根记录与应用回执的 `newErratum` 深度相等；原文、修订段落及源 SHA 详列于同名 JSON。
- `prose[40]` 仍以 `source_refs=["p0218#7","p0218#9"]` 承接原开放块；全部 `source_text`、整个 `source` 对象及 `source.data` 与应用前冻结深度相同。

## 4. 后续排版另行归属，不算第三勘误

当前模板：

`.tmp/ld-s10y-lesson/adapt/7a/modern-us-neutral/lessons/alg7-c4-s1-n34/lesson.template.json`

当前耐久稿：

`ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s1-n34/lesson.json`

两者当前字节相同，SHA-256 均为 `203f46e1097f28784e8a6d3c0c205add59240f91e05a05f1c9f4fc8c30b2146e`。

对应用后冻结 `B/n34-layout-before/lesson.json` 的当前差异仅为 `prose[17].text` 删除末尾孤立 `*`、`prose[23].text` 删除相邻强调边界 `****`、以及 `section_breaks`。后者与 `B/n34-modern-text-complete.json` 记录一致。恢复这三个排版字段后，整个当前对象与应用后冻结深度相等。

当前稿的 `prose[40]`、三个根勘误记录、全部 `source_text` 与 `source`/`source.data` 都未被后续排版改变。耐久稿哈希与排版完成回执一致；未读取或评审该回执所列的练习文件内容。

## 5. 首次失败与恢复，不冒称首遍成功

首次应用阶段 `n34-third-erratum-application` 于 `23:25:49.701Z` 开始、`23:25:49.783Z` 结束，exit 1。stderr 是验证错误，stdout 为空；不把它记成 PASS。

恢复阶段 `n34-third-erratum-application-recovery` 于 `23:26:32.111Z` 开始、`23:26:32.219Z` 结束，exit 0，带 `--recover`；stdout 的完整 JSON 与应用回执深度相等，stderr 为空。两阶段全部流哈希已核对。

“首次 helper 实参次序错误”是用户提供的阶段历史；本次未拿恢复后的脚本假冒失败时脚本快照。已核对恢复脚本的 helper 参数顺序与现行声明相符。失败 traceback 的断言位于首个工作输出写入之前；恢复脚本在使用已有冻结 0 时要求 `--recover` 且断言冻结字节等于工作文件的应用前字节。成功恢复、冻结 0/1 相同及上述精确应用差异支持“首次未写工作文件、恢复复用原冻结 0”的记录。未执行该脚本。

## 6. 裁图仅当前哈希绑定

当前耐久裁图 `ssot-resources/soviet10year-textbooks/artifacts/7a/figures/fig-51.png`：

`83e3626bdbb44ee252a050beb49956a99b04e67635c2678ba471bab59e8882da`

当前缓存裁图 `.tmp/ld-s10y-lesson/7a/pages/0218/figures/fig-51.png` 记录为同一当前哈希。这里只读取字节计算摘要，没有打开或解码图像。冻结源 triplet 不包含裁图哈希基线，**不声称裁图与修改前字节相同**，不评审裁图质量，不读取或批准正在单独准备的 fig51 context。

## 范围

PASS 仅属于第三勘误应用/绑定及与已记录后续排版的差异归属。既有 FIRST 和澄清裁决哈希保留在 JSON 中；未新增数学结论。不是 n34 全文通过、图候选通过、现代版本最终 finalize 通过或 STEMROBIN-182 全部工作批准。
