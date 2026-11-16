# 9-10g physical49 独立 SOURCE StageB

## 结论

当前49作者包 **REVISE**，有两处披露前源观察已确定的转录差异：

1. **B1，118第二小问**：原“如果正方形的棱长……”被写成“如果正方体的棱长……”。这不是源疑字，而是已冻结原像素中明确的“形”字；不能借几何常识纠正源措辞。
2. **B2，122第二排**：原“在同一个平面内. 这些点是怎样”被写成“在同一个平面内，这些点是怎样”。句点被换成逗号，改变原句边界；应忠实保留ASCII句点与其后的空格。

其余完整任务、117 continuation、119/120字面区别、复习题标题、脚注、folio及123 open边界符合冻结源事实。当前机器门禁真实23/23、exit0；不能用它覆盖上述两处源差异。没有新的确定字形UNKNOWN，无源数学纠正/答案推导。

## 角色、先后顺序与禁止范围

- STEMROBIN-184 worker B，当前49唯一非作者独立SOURCE reviewer；源作者Peirce。此为现有工单下母方委托，不冒称额外逐题人类数学批准。
- 根目录 `/Users/yong/.codex/worktrees/a07e/lemmadeck`，T为根下 `.intentfold/tickets/STEMROBIN-184/tmp`。
- 先读取自己已完整冻结的49原像素观察：`T/source-review-9g-p48-p49-source-first.md`，最终rawSHA `51b5b00b8166ef8ffe6aa5343d1c9e597f183998fc2b35de1e9f5fc58f9b3acf`。
- 随后只读当前durable49 MD/JSON，之后audit及首次运行记录/streams，最后读此次授权的作者报告与29文件manifest。
- 未重新打开任何整页PNG、grid、作者库存或figure；没有新局部像素观察。B1复用StageA已实际观察的118/119局部原像素，B2复用原生整图逐排记录。
- 只为绑定差异读取49完整before-finalize MD的118/122片段，并作当前49三件文件与first after-finalize快照的bytes equality；没有重数原图、运行counter/validator/finalize。
- 没有读取48当前MD/JSON/audit或重审48；117 incoming只复用已有边界事实。未读取50关闭123，未读答案/modern/choices，未解题或推导源纠正。

## B1：118字面误转录

位置：`p0049#2`（118）第3排，durable `page.md:49`，JSON `blocks[1].lines[2]`。

| 证据 | 内容 |
| --- | --- |
| 披露前原像素冻结 | `的截面; 2) 如果正方形的棱长等于 a, 求截面的最大的边.` |
| 当前MD与JSON | `的截面；2) 如果正方体的棱长等于 $a$，求截面的最大的边.` |
| 完整before-finalize MD | 同样已经为“如果正方体的棱长……” |

同题第一排源实际写“正方体”，当前第一排正确；本发现仅针对第二小问的一个“体→形”字。119源“正方体”、120源“长方体”也均正确保留，不能全局替换这些词。

最小建议：仅忠实恢复118此处为“如果正方形的棱长等于 $a$”。这是恢复原像素字面，不是数学勘误；不改变原 `|AM|=|MA_1|=2`、棱/线段标识、a条件、两项请求或任何换行。没有授权/实施任何修稿。

## B2：122源句点被逗号取代

位置：`p0049#7`（122）第2排，durable `page.md:70`，JSON `blocks[6].lines[1]`。

| 证据 | 内容 |
| --- | --- |
| 披露前逐排冻结 | `段 AB, BC, CD, DA 的中点在同一个平面内. 这些点是怎样` |
| 当前MD与JSON | `段 $AB$、$BC$、$CD$、$DA$ 的中点在同一个平面内，这些点是怎样` |
| 完整before-finalize MD | 已经是同一逗号连接 |

证明共面与辨识图形这两项请求没有被删，但原分句终止符被改了。最小建议仅将 `平面内，这些点` 恢复为 `平面内. 这些点`，保持在同一既有印刷排；不加排、不改数学内容、不替换其他全/半角标点。

这与48两处行尾空格是不同单元的独立发现，本轮没有重审或修复48。

## 全部对象/任务与边界比较

| 块 | 与冻结原观察的比较 | 结论 |
| --- | --- | --- |
| `p0049#1`，117 cont，4排 | 起于“中点.”，MD `ex 117 cont`，JSON `cont:true/open:false`；没有重复新题号。KM/KN对AD/DC的垂直作图、D与相对面中线交点连线和KMN平面的交点、共棱长a下KMN面积，三项全部完整。N右上星号保留并有底部脚注说明，不定义N-star为新数学变量。 | PASS |
| `p0049#2`，118，3排 | 初始“正方体”、M在AA1、`|AM|=|MA_1|=2`、过M平分两线段BB1/CC1的截面、最大边请求均在；不擅改2为比例或添加截面方向。第二小问源字误写如B1。 | REVISE |
| `p0049#3`，119，3排 | `119^{*}`、源“正方体”、三棱AB/BC/BB1与3/2/1成比例、过B1向BC1/BA1作两条垂线均保留。没有为数学一致性把原“正方体”静默改成长方体。 | PASS，源literal不校正 |
| `p0049#4`，120，3排 | 原“长方体”与119区别保留，原比例3/2/1、AB和角BB1A1平分线交点、CC1和角BB1C1平分线交点两项全部在；角中间B1下标完整。 | PASS |
| `p0049#5`，1排 | 实际居中“第一章复习题”完整、独立于120/121；MD/JSON记无编号h3边界，未伪造编号单元或把它并入题干。此处只批准真实标题/边界事实，不作TOC装订或课程id审批。 | PASS |
| `p0049#6`，121，2排 | n≥4、任何四个不共面、过其中三个可作多少不同平面请求保留；没有补独立三点条件或答案表达式。原不等号观察为大于等于形，当前 `\geq` 表达同一关系，不声称扫描的LaTeX/Unicode原码点。 | 内容/关系PASS |
| `p0049#7`，122，3排 | 非共面A/B/C/D、AB/BC/CD/DA中点、证明共面及辨识图形两个请求完整；B2原句点被逗号取代。 | REVISE |
| `p0049#8`，123 open，2排 | 上标空心圈、仅与一/二/三条棱有公共点的三种情况完整，最后分号保留，JSON `open:true/cont:false`；未添加未见后页的主请求或第四情形。 | PASS，仅本页open片段 |
| `p0049#9`，foot note，1排 | 源“在本题和以后某些习题里，作图均指作出直观图.”完整；独立底部脚注，不混入117/119题面。 | PASS |
| `p0049#10`，foot，1排 | `· 42 ·` 与原decorated folio42及physical49一致，身份字段printed_page42保留。 | PASS |

23个原真实横排复用披露前冻结，不由本次audit反推：117四排、118–120各三排、栏目标题一排、121两排、122三排、123两排、脚注一排、folio一排。所有块 `samerow:false` 符合冻结原排事实；多个小问共享一横排未被机械拆为额外排。

源figure库存为0，当前MD/JSON/audit也无fig/cap/crop；不是漏看生成图。本轮没有新的源数学诊断：118第二小问的原“正方形”和119的原“正方体+比例”无论数学上是否有问题，都应保留literal，不借正确解答反校源字。

## audit、首次实际结果与UNKNOWN边界

当前audit真实事实：`page:49`，`lines_printed:23`，`lines_md:23`，`figures:[]`，`normalizations:[]`，`unknown_chars:[]`，`katex_warnings:[]`，`errata:0`，`count_exclusions:[]`，`errors:[]`。

首次真实run：

```text
[".claude/skills/ld-s10y-lesson/.venv/bin/python",
 ".claude/skills/ld-s10y-lesson/tools/p2c.py",
 "finalize","--book","9-10g","--page","49"]
cwd: /Users/yong/.codex/worktrees/a07e/lemmadeck
exit:0; signal:null; error:null
```

真实stdout：

```text
[finalize] 9-10g p0049: 10 块 / 23 行（印刷 23）, 插图 0 张, 规范化 0 处
  ✓ 通过 行数对账 + 白名单 + 公式
```

stderr为空。本审者没有运行这个命令；这里只读保存的首次证据，不将其机器PASS冒称源逐字PASS。

没有新增待判字形UNKNOWN。123缺失后续主请求是实际open边界，不是假造漏题结论；题号空心圆的课程分类含义不擅定义。原扫描的具体字符编码本来不可由像素证明；记录可读字形/关系而非猜原码点。

## 实际rawSHA与快照

当前durable49根：
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0049/`

| 输入 | 实际rawSHA256 |
| --- | --- |
| 当前 `page.md` | `83e0f316a540bc0c057052d7d41d8dd80a22b7179b6f66ff00dc7579bd51648e` |
| 当前 `page.json` | `5717f5e77b8b92370db444688e96c58ca926d2cd0079e5726d6a84ba8f2ef284` |
| 当前 `audit.json` | `d18b61a07dd2c3444edcc291c9b286188caa2b592b2d6a684ff814b56649c36d` |
| 已授权 `T/source-9g-p49-author.md` | `eed16e8775f71c07e9fea406188c62b2a7313f6f54aecaef136fdada5864f043` |
| 29文件manifest `T/source-9g-p49-evidence/hashes.json` | `29e5fff56a242380db3aa96d827e517bae3eafd1900f57da3f821a9faf0fa555` |
| 保存的 `finalize-run.json` | `47fce4a8cf6097a2fb2fdf546ec75f5b1d71277f3c2c714c247c1b74e8ed3097` |
| 保存的 `finalize.stdout.txt` | `73d1dae2ddab7a0b1d98865410d8173a72a2aff351da55c9cbd0aef4b418751e` |
| 保存的 `finalize.stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

streams/manifest/snapshots均在 `T/source-9g-p49-evidence/`。本轮实际验证当前49MD/JSON/audit分别与 `after-finalize/durable/` 三件字节相同，三个bytes-equality输出均true。完整before-finalize MD仍保存，manifest绑定SHA为 `5694343812160bca75d0995dcab340b984eb4b6de98b69df72d96db64b43a546`；本轮只读其中B1/B2对应片段，没有覆盖初稿。

自己的StageA最终SHA仍为 `51b5b00b8166ef8ffe6aa5343d1c9e597f183998fc2b35de1e9f5fc58f9b3acf`。原49PNG已冻结SHA `a92263b577cabc139629387ad50773b4c89b6f90b5c6359c3b6997c300f74868` 与当前meta.render/source作者manifest一致，无需重开PNG。

作者报告与manifest实际rawSHA匹配本次授权，报告最后才作为记录读取；作者“保留完整/无源改字”陈述不能覆盖B1/B2。没有打开作者source-first正文或未授权图/grid/layout，也不冒称核验29文件全部内容。

## 停止

仅新增本报告，未修改源/作者稿/StageA/已有48StageB；没有新图、题解、源纠正推导、counter/tool/Git/DB/browser/net操作或prepare/finalize重跑。49真实verdict为REVISE；23/23机器PASS保留但不放行源差异。等待母方最小范围处理，本报告冻结后停止，SHA从文件外取得。
