# 106/107受影响独立复核

审查者：Sagan / independent_agent，非修复作者。日期：2026-11-15。

工作树：`/Users/yong/.codex/worktrees/0f12/lemmadeck`。

**结论：PASS，仅关闭106的F106-1计数门禁和107的N107-1附记歧义。108结构仍BLOCKED，不获批准。**

复用 `source-review-106-110.md` 中已完成的106/107原像素、全部正文、公式/数值、图84/85、open/cont与边界判断。本次不重新打开原页、图、完整语料或现代课程；只比较保留的修复前后文件、当前audit、实际行带、测试及命令记录。原独立拒绝报告未修改，SHA256仍为 `500a096cc1d1bcf516936e7b2ddba5dcac83d5fbff5e05420f6d759f8dc90982`。

## 106：计数修复PASS

- 当前持久 `page.md`、`page.json` 与 `counter-repair/before/0106/` 完整字节一致，且匹配首次独立审查hash。正文、强调、标题44、页脚95、末字“力”和所有open/cont未变；没有通过删行、删页脚、补字或降低声明行数来迎合计数。
- 当前audit为 `lines_printed:25, lines_md:25, errors:[]`，无图、无规范化、无未知字或公式warning。旧audit的24/25 error原样保留。
- 独立只读调用旧/当前 `layout.line_bands`，输入同一实际106 PNG的ink mask，不调用作者会写文件的verify包装器，也不处理108或其他页。实际结果为旧24条、新25条，与保留的前后行带逐项一致。
- 新25条行带与作者记录的25个原像素行中心双向一一对应，分别逐条重算，不仅接受 `anchorCheck.ok` 布尔值。它与此前独立原像素清点的 `4+4+4+4+3+1+4+1=25` 一致。

| 受影响区域 | 旧行带 | 当前实际行带 |
| --- | --- | --- |
| 第9–11行强调正文 | `[784,845]`、`[846,908]`、`[909,970]` | `[784,824]`、`[856,898]`、`[928,970]` |
| 第12行短强调及第13行新正文 | 合并为 `[1003,1113]` | `[1003,1040]`、`[1072,1113]` |
| 页脚95 | `[2010,2040]` | `[2010,2040]`，不变 |

新行带排除了字下强调点的桥接，没有将点当成文字行或擦除原PNG。检查旧/当前计数器差异未发现页面号或目标25硬编码；本次结论仅覆盖授权的实际106输入及局部回归，不声称全语料计数器已独立批准。

原prepare `layout.json`仍保留原字节，不冒称已被新行带替换。新25行证据位于 `counter-repair/after/0106/repaired-layout.json`，与独立当前算法回放一致。

作者原命令记录可核：`finalize --book 6p --page 106` exit0，8块/25行、印刷25、0图、0规范化；`vectorize --book 6p --page 106` exit0，0图通过、0图超限。其收口audit与当前事实一致。本审查没有再次finalize/vectorize。

## 107：仅附记修正PASS

旧附记尾部：“实验段跨图续到108末立着，不补写。”

当前附记尾部：“实验段跨图，107末立着，108首（图85, б），不补写。”

这明确了此前独立判读的107末“立着”、108首原图85西里尔 `б` 引用，没有把它改成108末，亦未改原标签为拉丁b。

结构化比较证明：

- MD块体字节相同；JSON完整 `blocks` 深度相同。
- MD/JSON全部meta除 `notes` 外相同，且当前MD meta与当前JSON meta一致。
- audit完整字节相同，仍15/15、无errors。
- 图84/85框仍 `[224,224,1085,455]`、`[307,1551,873,299]`；正文、caption、数量和open/cont全部不变。
- 当前原PNG、两个裁图PNG及两个SVG的实际hash匹配保留前后manifest。PNG同时匹配首次独立视觉审批绑定；SVG这里只核字节未变，不新增矢量图视觉审批。

作者 `finalize --book 6p --page 107` 的保留命令记录为exit0、11块/15行、2图、0规范化；本次没有重跑收口或重开图。

## 实际局部测试

独立直接运行同一组30项unittest：**30/30 PASS，exit0，0.242s**。使用既有解释器 `/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`，设置 `PYTHONDONTWRITEBYTECODE=1`；cwd为本工作树 `.claude/skills/ld-s10y-lesson/tests`。输出保留在本次工具记录，没有向其他路径写测试报告。

完整运行的四模块：`test_printed_row_distinction`、`test_inline_fraction_row`、`test_fraction_line_spacing`、`test_short_numeric_rows`；另仅运行以下六个 `test_layout.LineBandsTest` 方法，不运行整模块/整套/全语料：

```text
test_keeps_split_standalone_enumerator_near_a_table
test_nested_fraction_fragments_ignore_scan_edge_streak
test_keeps_separate_narrow_row_outside_fraction_span
test_three_brace_connected_rows_use_nearest_pitch
test_parallel_two_row_systems_with_fraction_spill
test_tall_nested_fraction_remains_one_row
```

新增十项覆盖两强调点/缺点、浅/分裂字身、单点与不对齐点反例、分式下独立正文、错位页脚、完整单分式、分裂数字以及普通行在多行带之前；正反例均通过。完整单分式不会为修106而被拆成多行，分裂数字也不冒充两条完整行。原 `before-focused-tests.json`、`after-focused-tests.json`、`after-2-focused-tests.json` 仍存在，未覆盖或删除；不把作者的早期失败改写为从未失败。

## 108边界

108的F108-1原拒绝仍有效。只核验其持久MD/JSON/audit仍匹配首次未批准快照hash；未读scratch candidate、未重新求解/审全文、未回放108计数、未批准27/26候选、未要求或实施再次修复。作者记录的候选BLOCKED与当前授权边界一致。106计数PASS、107附记PASS不能使108或原106–110整组自动转为PASS。

## 实际SHA256绑定

以下均对实际完整文件字节计算；路径以本工作树为根。`E`为 `.tmp/ld-s10y-lesson/6p/pages/0106/counter-repair/`，`D`为 `ssot-resources/soviet10year-textbooks/artifacts/6p/pages/`。

| 文件 | SHA256 |
| --- | --- |
| D0106/page.md，前后相同 | `cb07d8b0d0a1b3b126bda95e91db70d9d4ace31ea02e99b3697ad49e6459511c` |
| D0106/page.json，前后相同 | `b4019e6531321ba7790fef460c6ba59731d434b5c876c45086a85f5bf94d2492` |
| Ebefore/0106/audit.json | `5ab7f83c0f8190972c446365a467c46bd2271538821eb33449421426cf6f8391` |
| D0106/audit.json，当前 | `7b9b792d6bf16b373eac01ad7b1f0d8512fe85da62d60fad3be41e6a9d6903cf` |
| 0106原PNG | `6861429ac7e9dfcdd02f189dc74ffb885760e8a5b6925a345ed4eb9d66824ea1` |
| Ebefore/0107/page.md | `eee943409ed630018c91f49c023beaf424595c443062c5712820ca375cdc8595` |
| Ebefore/0107/page.json | `1ee1588d7a4fbb38ae3118bdfdaf503be18e838b477a584589b90e77be918d86` |
| D0107/page.md，当前 | `261defa7431c536f27dabfde5a5e4d5ea5082260c98989a584ccbdc09702e237` |
| D0107/page.json，当前 | `a0267ccc9d7c407213ee783f25725d974e5c272386df3a6daeaa76fc3ca3b95f` |
| D0107/audit.json，前后相同 | `3df3dc58b31221c32faa8c2c8407365d4cbd3023e780e53b8e6388ece034cb00` |
| 0107原PNG | `c12823df1f6b3ed3a16014437efb46b8864ce4cc57187260211719f1d1424e9e` |
| Ebefore/hashes.json | `e9c34c9de6c04b16d603ff1625f666cdbef6b93f32949737766d4d6d1d0fa0fd` |
| Eafter/hashes.json，含未变图PNG/SVG | `124d28eea8208b895adc6358f2524f581ee9f0d779bc77b622113445282f7111` |
| Erow-verification.json，仅复核106/107条目 | `213b3d20ade034e70afcd8a6e39c24aa9c99794cdf0c93ec8bc1566a85cbd558` |
| Ebefore/0106/layout.json / 原prepare layout | `473eca79fcc8eeae683bfbb3524bdf091449c0d841ac6c5bf1f994c1dad44d09` |
| Eafter/0106/repaired-layout.json | `b2b8e78ae93c6b7c10291e004ebe683331c9de621bc8a6a1cc32305855a20b26` |
| Efinalize-106/command.json | `29de2d3570cb24538f49d6fc9cd2fa259d77854670e89561427f6b7380ba29a1` |
| Evectorize-106/command.json | `7335b615e297eb3d84df3502204eb365834e802eff021ed9569004e287f59fa3` |
| Efinalize-107/command.json | `e9a9a537084a74b3af8b2fde6e8b697e499939e6f4947e49503547c366edd2bc` |
| Ebefore/layout.py | `efedf93fcd931bb71eb454ede6316a14a25967a0aa32f65fe3a4b6e8eebfed9d` |
| 当前tools/layout.py，仅读/执行 | `1db896d4e81f41bf4557fc0a36a4c543a1cfdbc630124ba1fd8b450eaf412c2c` |
| tests/test_printed_row_distinction.py | `3ab1d761317b1e95823e559563507d40e81dbe08755af136f4c333ffc9adecd0` |
| tests/test_inline_fraction_row.py | `b63b008fd677b80f58895e8c638a8dedc5cebed60c7ce2bcfdcc5c1dc5b61902` |
| tests/test_fraction_line_spacing.py | `30e0ccc0d88f84085683745252785d3bc1ae6125ce53b9d40e1633ab03907f0b` |
| tests/test_short_numeric_rows.py | `1f69871b178429d5344eac78d9c05933c0f99bc9445728375743176257f50893` |
| tests/test_layout.py，仅六方法执行 | `ffcd9b71aa2b13127bc33bfe3004be2095069b62bacafeface9b370c8e8dd637` |
| Efocused-context-tests.json，作者30项原记录 | `a35cced20b0038a1cb169ef340900871ff66dddfa3df119090810bcaae466a9c` |
| 工单source-counter-106-108-repair.md | `60292cefd280689c79b441eac315cd7c01a54f606c2eead3893b190b3bc62c92` |
| 工单source-unit-107-108-repair.md | `ab123505d5cd022ad4e453d4eae07ff9a313bd5313c94285679c9149e271dc53` |

唯一新增源复核文件为本报告。未改源、代码、技能或旧报告；未assemble、finalize、vectorize、Git、DB、浏览器、发布或重新审其他页。精确模型部署、推理设置和累计token未知，不以工具输出计数冒充总用量。
