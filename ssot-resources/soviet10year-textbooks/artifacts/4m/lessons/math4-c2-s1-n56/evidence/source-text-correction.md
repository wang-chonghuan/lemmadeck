# N56 affected source-text correction check

## Scope and authorization provenance

- Date: 2026-11-23. Ticket: STEMROBIN-187; lesson: math4-c2-s1-n56.
- 唯一根目录及所有命令的显式 workdir：`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`。
- 本次仅补核两个文本修正及必要来源快照，不重解 935–945，不重跑 producer、assemble、modernizer、finalize 或 validator。
- 仅读取本课当前 raw `lesson.json` / `exercises.json`、当前三个 `*.template.json`、旧比较与独立 SOURCE；对旧四报告只读计算哈希确认字节未变。
- 只新写本文，不修改旧三报告、旧比较、源页、作者稿、raw 或候选。
- 本次新增 image=0，累计实际 image=6/24；未开图、浏览器、DB/env、APP、付费、安装、Git、其他聊天或 spawn。
- 旧 `source-author-comparison.md` 中“用户明确给出方案”的表述，其实际来源是 **parent send_input 的方案委派，即 parent delegation under existing human production authorization**，不是一项新的直接人类批准。本文补正这一授权来源说明，不改旧报告，也不将合同分析提升为图批准或发布批准。
- parent 报告上游对 0208、0210 两行作修正、官方 finalize 分别为 23/23 和 22/22，并作用域 assemble、重建模板及重新应用 modernizer。本次没有读取新页/audit 或执行这些命令，不把上游报告冒写为本方执行或独立验证 finalize 的证据；下面只认证实际读到的本课 raw / template 文本及快照。

## Preserved evidence

下列路径相对于唯一根目录；哈希为 SHA-256，与旧交付一致。

| 冻结 evidence 文件 | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n56/evidence/independent-source.md` | `c93aeec79e11d83192ee63744cc8fcf0181353db28b8dc86b292b626215032dd` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n56/evidence/independent-solutions.md` | `99e35a3301f84f15d0e787b3c78944a0a0e5e49e57ffbb20870f52d15670e38b` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n56/evidence/source-figure-inventory.md` | `aaa6584fc9e85fcdf0d3a8923b73cfd963cef1d12627e766113c7170800218a3` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n56/evidence/source-author-comparison.md` | `03a9b5224d0939b2b96056103b8784260c28b56f8c04c12081e4cdb6785a2066` |

## Current compared snapshot

| 当前输入 | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n56/lesson.json` | `745d1f37e0fc9788a72466163d8e62690534c8ee0d2378e72508ab5450d73f09` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n56/exercises.json` | `1e745b66f75cb094d14a7fd8ac348920d17e7b3b2e7abc4893cba26f64a8b674` |
| `.tmp/ld-s10y-lesson/adapt/4m/modern-us-neutral/lessons/math4-c2-s1-n56/lesson.template.json` | `c6d69842af7a766f38be6d36d83b6a7a2abd9e935b4dd550b5922b74c58ed940` |
| `.tmp/ld-s10y-lesson/adapt/4m/modern-us-neutral/lessons/math4-c2-s1-n56/exercises.template.json` | `5768fe01f82bc8e08763fec452fd066c319323242c6d8ee2400300ab1203d566` |
| `.tmp/ld-s10y-lesson/adapt/4m/modern-us-neutral/lessons/math4-c2-s1-n56/figures.template.json` | `017324ca2b64e2ce862f0812235e957911888c736723e81c1c5f6f4b7a19a163` |

以上三个 template 仍为 draft，哈希限定本次文本补核，不将临时候选当作已发布成品。

## Two corrections: PASS

### TEXT-DIFF-UNIT-PUNCTUATION

已冻 SOURCE：“是角的度量单位——度的符号。”

当前 raw `lesson.json.prose[5].text` 已包含相同“度量单位——度的符号”；现代 `prose[5].text`、`source_text`、内嵌 `source.data.prose[5].text` 及相应 `section_breaks[1].before` 都同步采用修正后的破折号。

旧比较中“度量单位一度的符号”的差异已在当前快照中消除；角名/角大小记法及读法未改变。

### TEXT-DIFF-945-PUNCTUATION

已冻 SOURCE：“求下式的值：”

当前 raw 第 945 题正式 `text` 及提示语辅助 `lines` 均已使用冒号；现代第 945 题正式 `text`、`lines`、`source_text` 及内嵌 raw 快照均同步修正。

原计算式 `(59 942−14 989−4000):51−(49 387+24 489):92` 保持，冒号除法及各数字未变。没有重新计算原式，只核对文本和旧基准。

## Affected-only drift and source binding check: PASS

本次使用只读 JSON 解析及内存字符串还原验证；没有写回、生成候选或运行项目校验器。

1. 当前 JSON 使用其现有两空格缩进和末尾换行重新序列化到内存，与当前文件字节哈希一致，因此可作精确快照比较。
2. 只在内存把“度量单位——度的符号”还原为旧“度量单位一度的符号”，把“求下式的值：”还原为旧句号；现代文件的根 `source.sha256` 同时还原为旧 raw 哈希。不变更其他字段。
3. 这样重建的 raw lesson、raw exercises、modern lesson、modern exercises 各自完整 SHA-256 均精确等于旧 `source-author-comparison.md` 记录的对应快照。图 manifest 当前完整哈希直接等于旧值。

| 文件 | 受影响字符串出现处数 | 精确恢复旧比较哈希 |
| --- | --- | --- |
| raw lesson | 破折号修正 1 处 | PASS |
| raw exercises | 945 提示标点 2 处：text / lines | PASS |
| modern lesson | 破折号修正 4 处：text / source_text / source.data / section_break before；另更新 raw 来源哈希 | PASS |
| modern exercises | 945 提示标点 5 处：text / lines / source_text / source.data 的 text / lines；另更新 raw 来源哈希 | PASS |
| modern figures | 无文本或字段变化 | PASS，字节未变 |

这证明当前所读五文件相对旧快照的变化仅为两处文本修正的相应副本及必要 raw 来源哈希更新，没有额外正文、数学、小题值序、分组、图引用或元数据漂移。

- `lesson.template.json.source.sha256` 等于当前 raw lesson 文件哈希；`source.data` 与当前 raw lesson JSON 完全一致。
- `exercises.template.json.source.sha256` 等于当前 raw exercises 文件哈希；`source.data` 与当前 raw exercises JSON 完全一致。
- 当前 raw / modern 题数均为 11，题号仍为 935–945。小题内容和顺序与旧比较及已冻 SOURCE 相符，不重新求解。
- 第 937–941 题 Latin a/b/c/d、942 的 1)/2) 顺序、第 944 题两处 Ben 及其分数所作用的时间量均保持旧候选形式。
- raw / modern 正式题面仅经既有空白、小题标签、Ben→别佳对照归一化后逐题相等；没有归一化数值、运算符、负号、小数点或分母。
- 现代 `source_text` 均与当前 raw 正式文本一致；正文去空白后与 raw 对应项一致。所有 `numeric_changes` 仍为空。
- 两项 `section_breaks` 的 before / after 都精确命中当前 prose 文本；修正后的第二项 before 不再引用旧“一度”句。
- 现代辅助 `lines` 不含旧 raw 的 `↵` 断行标记；原 raw 第 935 题辅助转录痕迹并未在本次修正中扩大为数学或题面变化。

## Limited close-out

- SOURCE-TEXT-CORRECTION: PASS，两处差异在当前 raw、现代文本及来源快照中已与已冻 SOURCE 对齐。
- NO-MATH / SUBPART-ORDER-DRIFT: PASS，精确快照差异限定如上；沿用旧独立数学及作者对照证据，没有重解。
- 授权来源已补充为 parent delegation under existing human production authorization；不是新的直接人类批准。
- 旧三文件与旧比较字节保持；原 HOLD-215-TICKS 不解除。不批准 fig-215、其他现代图或 wholeLesson，不批准显示、choices、answers 或发布。
- 本次仅新增 `evidence/source-text-correction.md`。新增图片 0，累计 6/24。本 N56 源批到此结束；后续现代图由 fresh 独审处理，本方不载入后续图。
