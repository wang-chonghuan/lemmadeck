# 121/124/125 首FAIL受影响单元复核

审查者 Sagan。结论：**F121-1 PASS、F124-1 PASS、F125-1 PASS**。仅按本次明确授权复核三个新增真实缺陷及 page.json 传播，复用首次独立源像素/全文/裁图结论，不重审整页。没有新缺陷或越出授权范围的作者改动。

**不批准122，不批准整体121–125闭合，不核验126，不触碰108拒绝或另开源页。** 本报告是原拒绝报告之后的追加受影响结论，不替换、倒改或删除首次FAIL与124既有join修复历史。

## 独立依据

先行完整报告 `.intentfold/tickets/STEMROBIN-180/source-review-121-125.md`，本次实际字节SHA256：
`62c737ff0ff96e8c6160905c1322e5789091730211e38cbc6bfb0076b19d7f97`。

首审机器清单 `.intentfold/tickets/STEMROBIN-180/tmp/source-review-121-125-evidence/hashes.json` 未变，实际SHA256：
`3730d3f0fe98caead4ae8c80343395c35398952648787956517a49758b9aa683`。

复用首审实际打开的0121-lower-detail、0124-emphasis-detail、0125-spray-word源裁证据；本次分别实际计算SHA256，依次仍为 `3f3177758122993bf4a77e06b94aff2380be1837714bb00f7c7c3eaa4c16c844`、`f1438af10508f49f5c62cdfb43d1eda6fb53c58f709962013fb0aaadb1dcb394`、`84de8fa81cb6aa35355c0e4d53e2f3dbf166bf88252ba764eaab5cacc3077dba`。没有重新裁取、生成或重开全页。

## 三个授权单位

| 单位 | 实际MD差异及JSON传播 | 结论 |
| --- | --- | --- |
| F121-1 | 第8块仅将“例如，”改为“**例题**. ”；对应 JSON `/blocks/7/lines/0` 同步。原字“例题”、句点、栏目加粗全部恢复；后续 S1=10、S2=↵100、F1=10、厘米²/牛顿、平衡问句及忽略摩擦条件逐字未变。 | PASS |
| F124-1 | 第9块仅由 `**铆钉枪**和**风镐**` 改成 `**铆钉枪和风镐**`；JSON `/blocks/8/lines/0` 同步。MD notes 和 JSON `/meta/notes/0` 同步说明六字含“和”全部强调，符合已独立判读的六个着重号，不用notes替代像素。 | PASS |
| F125-1 | 第6块仅 `**喷砂机**`→`**喷沙机**`；JSON `/blocks/5/lines/0` 同步。MD notes 和 JSON `/meta/notes/0` 同步恢复源“沙”，保持三字强调，后续气流/沙子/清扫器壁两印刷行未变。 | PASS |

实际 `diff -u` 的三份MD差异只有上表授权内容。read-only Node 递归比较旧/新 page.json，差异路径严格只有上表所列共五处；**全部其余blocks、lines、标签、行数、公式、数值、单位、caption、图框、samerow、open/cont、元数据和来源render绑定深相等**。124先前修复的两处句间ASCII空格保持，未重新修改join单位。

三份旧/新 audit.json **字节相等且结构无差异**：121为24/24、124为22/22、125为18/18；errors、normalizations、unknown_chars、katex_warnings均为空，errata=0。与首审真实印刷行账一致。本次读取已有审计，不重跑作者finalize，作者本次退出0的执行由main持有；不将本次只读比对冒称再次工具执行。

## 源、图及拒绝快照未变

三幅源page.png实际SHA仍与首审清单及当前 page.json `meta.render.sha256` 同时相等：

| 页 | page.png SHA256 |
| --- | --- |
| 0121 | `2fd016dea3d527673ee06a166ad0b5352c364cd05b66689055cb5e6fc52da52b` |
| 0124 | `5567202f6740911ff13e624248496307a994a9ae4b5ad624ff05cb898bd7689b` |
| 0125 | `f542f39e82571d48d2d5e9ef8a9b398efd02d3694cdc7e93759948a96dd697f1` |

实际读取既有页级 `.tmp/ld-s10y-lesson/6p/pages/{0124,0125}/figures/` 中六份图字节计算哈希，均与首审清单相等，未重新vectorize、打开或渲染：

| 图 | PNG SHA256 | SVG SHA256 |
| --- | --- | --- |
| 103 | `4128139e4f29e4bac71924b255c3636ec415834405af98c73da9a599790ebaf2` | `d58d5b301db3443677640d0490978408957093cb20cba51766364079c740dc04` |
| 104 | `cc0edaa67f064741b9a089ebfce765af51ac2d199ab093a3936800488b4e2e83` | `18e0fd4c8f31515b312624f3ea57c093e5118bf2184a825f7266d869859d40e4` |
| 105 | `53068283514bb743c93dc3b45a32659f71d1dd34d418d3470f56c52730d38e40` | `d473901f0a41a47b3c146862b5a6b423ed4213fd2a123eb48d55845242a1e79c` |

图框仍分别为103 `[431,1008,661,253]`、104 `[402,251,189,488]`、105 `[963,220,182,546]`；源到精确框绑定也未变，既有完整装置/标签/边界像素审批可复用。

拒绝目录 `.intentfold/tickets/STEMROBIN-180/tmp/source-rejected-121-124-125/{0121,0124,0125}/` 的全部九份MD/JSON/audit实际哈希与首审清单逐文件相等，确为原样保留的拒绝快照。124 `.tmp/ld-s10y-lesson/6p/pages/0124/failure-01-join-space/` 的page.md/page.json/audit.json/failure.md四份实际哈希也与首审清单相等，既有首join失败及修复证据未覆盖。未读取或操作108/122新候选来扩大批准范围。

## 当前持久页稿哈希

以下均实际计算完整字节SHA256，绑定 `ssot-resources/soviet10year-textbooks/artifacts/6p/pages/<页>/` 当前三文件：

| 页 | page.md SHA256 | page.json SHA256 | audit.json SHA256 |
| --- | --- | --- | --- |
| 0121 | `ee863cb81052bb26e0ebbf5ec566ca9a09f0119eb957599f4ef58f1bb584fd0a` | `447adf3b201e4dfade0c55ea8d6c136b9dbca4f2a8e5ef6c8243dda695381729` | `0ef8c0ab409c644fdb9b104a49cd545056b139a9f2c3b218fc760531e0b81846` |
| 0124 | `e617e459ae11f99e726b1bf6535b62989a6746913066370000b6e2e841e73b41` | `33ab90c946e5639387168be5fd0cb8892d9cff3e1770628f12bf6a37f3fae59d` | `e7f5ba443590c562b89e88588ad99a6bdabc53011e8dbf91f28d41403679a832` |
| 0125 | `c3f36ea788a996cefcf71d77f2f99f5d442703bd9719238deb3a321aa225d109` | `2c3040552a22cf3493baca5e035fa15321e20ff7a3f8a60a497e588fc2784593` | `3c892fef14f46363ddfd2b02239a8d9d7cc663faf0028450c30ba627d319e107` |

## 收口

复用首审未变内容的PASS并修复本次三处真实缺陷后，121/124/125各自的**源页转写文字PASS**可成立；这不批准122机械计行，也不批准整体121–125、补充阅读跨126闭合或任何装订/现代课。

只新增本报告；原报告、拒绝快照、作者MD/JSON/audit、图与源完全不写。自有只读hash采集首次错取顶层render而未完成输出，核对真实字段meta.render后完成采集；没有任何生产写入或机械测试。未重跑finalize/vectorize、计行器、浏览器、测试或assemble，无DB/Git/网络/模型服务。精确模型部署、推理设置、token/费用计量未知。完成并停止。
