# 10c n83 两表独立 Figure Gate Stage A：original-only 冻结

日期：2026-11-16。STEMROBIN-184。实际身份 Worker B / Codex，父方既有工单委托的唯一独立两表源图审者，非现代表作者。本报告只冻结原表库存；不是现代文本/表格/spec/视觉或数学审批，不标现代PASS。

## 来源、实际观察复用及顺序

复用本审者先前35–38 SOURCE gate的实际原像素观察：

- `source-review-10c-p35-p38-source-first.md`，raw SHA256 `b62dc6950a9ddad4b7768eb94c502ddce67153af904ad0ab54cb911291076c2c`。当时36、38各完整native原页实际单张打开，逐页冻结全部每cell/行列/边界/空白后才披露cap1作者稿。
- `source-review-10c-p35-p38.md`，raw SHA256 `84f8aad58ffe21417f9f3b52a5fcb366b016da533a914f4f741b40611790237e`。当时两张完整generated source table crop各用 `view_image(detail=original)` 实际打开一次，与原冻结逐cell及框线比对。该旧报告是本审者自己的SOURCE记录，不是现代表作者库存。

本次先核对以上旧冻结完整性，再仅读两份durable原PNG字节SHA；与当时看过的原crop完全相同。旧记录已经涵盖所有cell和边界，因此**本次不重新打开两表、不增加局部/放大/整页观察**。下列库存全部来自上述已完成的实际像素观察，不把本次hash读取冒称新的开图。

本次没有读取任何现代作者报告/库存、现代lesson/exercises、context/spec/assertions/SVG/output、答案、choice或其他独立审者材料。旧SOURCE gate已披露cap1稿/audit的实际顺序保留，不假称从未看过原源转录稿；这里复用的完整原表观察仍早于现代Stage B披露。旧报告及原PNG不改。

| 原对象 | 当前durable原PNG | raw SHA256，与旧实际crop相同 | 已观察原crop尺寸 |
| --- | --- | --- | --- |
| 物理36 / 印刷30的sin/cos正文表 | `ssot-resources/soviet10year-textbooks/artifacts/10c/figures/tbl-p0036-01.png` | `ab6f1b14ae9b98c981eb337d5c0b55bd692b1661fa45716c9c8132ff42f978a4` | 1146×964 |
| 物理38 / 印刷32的tg/ctg正文表 | `ssot-resources/soviet10year-textbooks/artifacts/10c/figures/tbl-p0038-01.png` | `5efbd8da9ee3dcbaa1f50bd9b40315d4647f8c0a3705f15185b959a1cd301ba9` | 1141×580 |

workspace `/Users/yong/.codex/worktrees/a07e/lemmadeck`；本报告目录 `T=.intentfold/tickets/STEMROBIN-184/tmp/`。文件名是pipeline对象身份，**不是源印出的表号或caption**。

## 表36：完整行/列/每cell库存

源为无表号的正文公式表，没有独立caption、子图、度数值、题号或边界外标签。四列从左至右为序号、u、sin u、cos u；**8个文字横排 = 表头1 + 数据7**。所有四列均跨表全高；32个cell位置，含唯一空白左表头。不是每个数据排都有横格线。

以下每行四项分别对应实际四个cell。`∅（空白）`只是库存标记，源该格没有这个符号；LaTeX宏用于表达源公式，不是新的数学推导。无前导负号的函数cell为原印原值，不补一个正号。

| 源文字排 | C1 序号/空白 | C2 u | C3 sin u | C4 cos u |
| --- | --- | --- | --- | --- |
| H | ∅（空白） | \(u\) | \(\sin u\) | \(\cos u\) |
| D1 | \(1\) | \(\frac{\pi}{2}+\alpha\) | \(\cos\alpha\) | \(-\sin\alpha\) |
| D2 | \(2\) | \(\pi+\alpha\) | \(-\sin\alpha\) | \(-\cos\alpha\) |
| D3 | \(3\) | \(\frac{3\pi}{2}+\alpha\) | \(-\cos\alpha\) | \(\sin\alpha\) |
| D4 | \(4\) | \(-\alpha\) | \(-\sin\alpha\) | \(\cos\alpha\) |
| D5 | \(5\) | \(\frac{\pi}{2}-\alpha\) | \(\cos\alpha\) | \(\sin\alpha\) |
| D6 | \(6\) | \(\pi-\alpha\) | \(\sin\alpha\) | \(-\cos\alpha\) |
| D7 | \(7\) | \(\frac{3\pi}{2}-\alpha\) | \(-\cos\alpha\) | \(-\sin\alpha\) |

### 符号与实际分隔

- C2 D1/D3的加号，D4的单独负α，D5/D6/D7的减号分别在源格内；不按结果改运算。C3/C4所有前导负号按上述逐格保留，不挪到列标题/另排，不互换sin/cos。
- \(\pi/2\) 和 \(3\pi/2\) 为实际上下印刷分式；分子3与π同层，分母2。分数横线不是table横格线，也不构成新表排。其余格没有分式、等号、括号、单位或条件附注。
- 外框四边完整；三条实际竖分隔划成四列。旧native原页人工近似位置：表范围x238–1355、y667–1588；竖分隔约x455、754、1054。仅为既有源观察近似，不能当exact现代坐标或测量约束。
- 实际内横线仅有三条：H与D1之间（约y801）、D3与D4之间（约y1148）、D4与D5之间（约y1240）。它们贯穿四列；与外框一起形成H、D1–D3组、D4、D5–D7组。
- **D1/D2、D2/D3、D5/D6、D6/D7之间没有逐排横线。** 文字基线区分各数据排，不为整齐网格补这些源没有的线。
- C1 H真实空白，不补“序号”“№”“u”或数字0；C1 D1–D7全在表内，不是七道独立练习。其他31个cell均有上述实际内容，无额外空白数据格或隐含第8数据排。
- 源格内/格间留白不是新的字符、边框或数学点。已有crop保留全部外框、竖线及实际横线，局部磨损/断续是原墨迹，不据此添加第二条平行线或修美；无邻文、folio/caption混入。

### 归属与限制

旧原页冻结中此表属于83正文，表前说明“前3行”，表后分别说第4行及5–7行；此处只复用其指代关系，不解题、不新读正文。它不是无owner的练习图，也不应因序号1–7被拆成七张新图。

表内没有印出新的定义域/角区间限定或完整证明；不把表外已谈到的区间写入一个源没有的cell。没有源cell的数学字符未识别UNKNOWN；但仅凭此表库存不能批准任何现代新增条件、域解释或具体排版/style。

## 表38：完整行/列/每cell库存

源为另一个无表号的正文公式表，四列序号、u、tg u、ctg u。**4个文字横排 = 表头1 + 数据3**；16个cell位置，含唯一空白左表头。不是表36的继续行号8–10，也没有子图/题号/caption。

源函数拼写tg/ctg忠实保留；`∅（空白）`不是源字符，无前导负号的函数cell不添正号：

| 源文字排 | C1 序号/空白 | C2 u | C3 tg u | C4 ctg u |
| --- | --- | --- | --- | --- |
| H | ∅（空白） | \(u\) | \(\mathrm{tg}\,u\) | \(\mathrm{ctg}\,u\) |
| D1 | \(1\) | \(\frac{\pi}{2}+\alpha\) | \(-\mathrm{ctg}\,\alpha\) | \(-\mathrm{tg}\,\alpha\) |
| D2 | \(2\) | \(-\alpha\) | \(-\mathrm{tg}\,\alpha\) | \(-\mathrm{ctg}\,\alpha\) |
| D3 | \(3\) | \(\frac{\pi}{2}-\alpha\) | \(\mathrm{ctg}\,\alpha\) | \(\mathrm{tg}\,\alpha\) |

### 符号与实际分隔

- D1 C2明确加号，D2 C2为负α，D3 C2明确减号。D1/D2两函数cell均有前导负号；D3两函数cell无前导负号。D1/D3的tg与ctg对换归属按原格保留，不根据列名填相同函数。
- C2 D1/D3的π/2为上下分式，分子π、分母2，其分数线不作为表分隔。表内无额外条件、等号、求值结果、括号、单位或数值角。
- 完整四边外框及三条竖分隔。旧native原页人工近似范围x234–1345、y783–1325；竖分隔约x452、748、1042。
- **每一相邻文字排之间都有横分隔**：H/D1约y918、D1/D2约y1053、D2/D3约y1190；底外框约y1323。各线贯穿四列，无未划线的两数据排合组。不能拿表36只分组的格线模式替换。
- C1 H空白，C1数据序号1/2/3完整；其他15个cell均有上述内容，无额外空白数据格、隐藏第四数据排或新的header文字。
- 外框、竖线和每个横线的原局部断续均保留；不补齐成另一种整齐新源。已有实际crop无表外正文/folio混入，不把原扫描局部磨损认作新的符号。

### 归属与限制

复用旧原页冻结，此表为83正文的正切/余切诱导公式表；表前介绍第1行，表后第2行奇性与第3行替换关系。该指代仅是源库存归属，不是本次重新数学求解或现代说明。

表自身没有另印tg/ctg的未定义点/端点排除条件，也没有证明；不能为使现代命题无歧义而假称源已有条件cell、补“未定义”值或删除一格。没有已冻结的未识别cell；数学适用域及现代文本解释须在后续披露中另按完整源/context判断，本Stage A不先行批准。

## 完整性、UNKNOWN与禁止扩大

两表全部数学cell、行号、空白表头、真实竖/横分隔及外框在旧原native观察和旧实际crop比较中均已记录，本次沿用同字节源。这里的cell transcription可供后续逐格全比较，不是靠行数/objectCount替代结构。

没有新增疑字符的源像素事实；也不虚造“每笔画exact无疑”。原线条磨损/断续的每个微像素、精确线宽/坐标、字体和同形字符Unicode身份没有从旧人工库存计算出来，仍不能据此推出exact renderer geometry/style。近似页坐标及旧crop尺寸只是绑定与观察记录，不是精确测量规范。

两表都无编号caption、a/b子图、图21标签、圆/角弧、定义域附格或解答数据；不得因pipeline的tbl文件名新造源标题。35的细标点/图21箭头UNKNOWN及38曾有的计行FAIL是原SOURCE gate的其他范围，本表Stage A不重审或消除它们，也不把后来机械PASS变成现代表PASS。

## 冻结停止

只新建本报告，旧源冻/图/作者及其他报告字节保留。本次未打开新图，因为旧库存完整且两原PNG raw SHA相同；没有现代作者/库存/spec/输出、答案/choice/其他审者材料读取，没有prepare/finalize/counter/test/render、源/metadata/工具/索引/装订/现代写入、Git、DB、网络/服务、浏览器或其他聊天操作。

**n83两表 original-only Stage A结束。** 由外部命令计算本报告raw SHA后停止，等待父方后续披露现代完整正文及author/spec/output，才进入唯一Stage B；不预标现代PASS。
