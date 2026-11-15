# 6p 物理151–155页源作者冻结

日期：2026-11-15。身份：Codex，151–155源转写作者，非独立审查者。

**草稿已冻结，五页官方机械阶段全部首轮exit 0；独立全文源审pending。** 本批没有真实门禁FAIL，没有修复或重试，不存在要隐藏/覆盖的失败存档。没有assemble、持久晋升、发布、DB、Git、app、依赖或稳定工具/profile/schema修改。

## 产物与实际读取边界

```text
R = /Users/yong/.codex/worktrees/0f12/lemmadeck
B = R/.tmp/ld-s10y-lesson/source-author-151-155
A = B/artifacts/6p/pages
W = B/work/6p/pages
P = /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python
S = R/.claude/skills/ld-s10y-lesson/tools/p2c.py
```

本批仅写A/0151–0155的page.md及官方派生page.json/audit.json，W/0151–0155的官方备料/裁图/矢量产物，以及本报告；这是隔离draft树，不是持久pages或全书图库。

实际读取现有lesson技能cap1/cap3约定、当前blocks及官方阶段入口。只读取已冻结150的尾部文本作上下文：§58末段“要象计算液体的压强（§53）那样来计算大气压强是不行”是p open，151从“的.”续接。没有重新打开150像素、复核其audit或修改它。

为153无编号肖像的显式归属，仅在6p/zh.json中筛选“托里拆利”匹配项，实际获得`phy6-c4-s11`、printedSection58、印刷起页139；没有读取其它课内容或据答案推断归属。

五张原页和五张网格分别以`view_image(detail="original")`实际打开，逐页读取完整模板/layout，人工逐行转写；七张最终PNG裁图也分别完整实际打开。没有多页拼图、未查看156及以后、未读取答案/choices/现代稿/其它作者页，也没有浏览器、网络或模型服务调用。

## 计行与真实阶段调用

所有prepare/finalize/vectorize均用上述共享P、`-B`、同一官方S，以及：

```text
--book 6p
--root .tmp/ld-s10y-lesson/source-author-151-155/artifacts
--work .tmp/ld-s10y-lesson/source-author-151-155/work
--page <151|152|153|154|155>
```

每页prepare 1次、finalize 1次、vectorize 1次，合计15次官方调用，全部exit 0；无安装、force或工具改写。五次prepare可并行、实际像素识读和转写逐页完成。无图152也真实执行一次vectorize，报告0张，而不是冒称矢量化了不存在的图。

| 物理/印刷页 | 原页尺寸@300dpi | prepare未遮图估计 | 作者逐行/官方finalize | 块数 | 图 | 原题对象/片段 | prepare/finalize/vectorize |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 151/140 | 1472×2161 | 26 | 26/26 | 11 | 1 | 0/0 | 各1次，exit 0 |
| 152/141 | 1472×2161 | 24 | 24/24 | 12 | 0 | 3/3 | 各1次，exit 0 |
| 153/142 | 1472×2172 | 31 | 29/29 | 12 | 2 | 5/6 | 各1次，exit 0 |
| 154/143 | 1472×2161 | 15 | 9/9 | 10 | 2 | 0/0 | 各1次，exit 0 |
| 155/144 | 1472×2161 | 25 | 18/18 | 11 | 2 | 3/3 | 各1次，exit 0 |
| 总计 | 五页 | 非文字完整性结论 | **106/106** | **56** | **7** | **11/12** | **15次，零FAIL/修复/重试** |

prepare包含图墨迹，153/154/155的初始估计不能当纯文字行数。finalize用真实裁图遮罩后的印刷行与完整块体对账；未减字、造行或调阈值。

作者逐行拆分如下；不是独立审查计数：

- 151：跨页首段5，实验10，解释5，“由此可见”1，黑体结论2，尾段2，页码1，共26；cap146与实验第9行同排不加行。
- 152：首段3，单位段3，计算引句1，原式2，换算结论1，观察解释4，气压计说明3，问题标题1，题1/2/3分别2/1/2，页码1，共24。
- 153：练习27标题1，题1/2/3/4/5分别4/4/8/3/4，传记4，页码1，共29；cap147与题3末行同排不加行。
- 154：两个图题2，传记续行1，59标题1，定义2，教学脚注1，装置首行1，页码1，共9。
- 155：两个同排图题1，装置续段9，气象说明3，问题标题1，三个问题各1，页码1，共18。

每份audit的normalizations、unknown_chars、katex_warnings、errors均为空，errata为0；没有捏造“无不可读内容”的独立批准。

## 原文对象与边界

151保留大气层无确定界线、密度随高度变小的完整解释，意大利/十七世纪/托里拆利原字，以及1米封闭管、装满水银、手指堵口、倒置浸入/放开、760毫米、上方真空及压强平衡全过程。两行明确黑体结论用两行粗体保存。实验段围绕图/cap用open/cont，cap146实际与“的水银柱. 管中水银柱的上方”同排；该行单独续段以明确关系。页末“来量度”p open接152“大气压强.”。

152保留780毫米两处、以1毫米高水银柱为单位、9.8牛顿/千克、13600千克/米³、0.001米及原书近似133帕斯卡的两行计算。中文单位置数学区外，上标用LaTeX。未把近似换成更精细结果或登记虚假errata。原定义强调、水银气压计黑体、日复一日观察/天气关系及问题1–3完整保存，不增添练习答案。

153练习27全部五题原字/条件保留：水下翻杯且杯缘仍在水下；帕斯卡1646年水气压计、760毫米水银柱；奥托·格里克/马德堡/1654年、金属半球抽气、八对马、2800厘米²及压力计算要求；纸盖杯倒置/撤手/液体与纸状态；1米管、封闭端/开关端、抽气/浸水银/开关及换水问题。题3分成两个ex片段仍为同一题，cap147与末行同排。传记忠实保存“托里拆利·埃范杰里斯塔(1608—1647)”、意大利学者、伽利略学生及原文，在“升”处p open跨154“高，还研究…”闭合。图/cap透明，不进入传记文字。

154图148/149只显式绑定153练习27第3/4题，没有新增或空ex块。§58问题是g1、练习27是g2，因此owner为`g2-3`与`g2-4`，不与152问题3混同。59“无液气压计”起新h3。真实教学脚注完整一行，其原物理位置在页底横线下、页码143上；沿现有源约定以p逻辑置于对应定义段后，notes明确记录纸面位置差异，不将它编码成页码foot吞掉。标题上标圈号与脚注圈号使用忠实`textcircled`表示，未换成普通编号、删圈号或改profile。末段“一个”p open接155“表面做成…”。

155完整保留抽空气的波纹金属盒1、弹簧片2、传动机构3、指针4及上盖随增/减压运动的方向、指针左右转动、按水银气压计校准的刻度盘和750毫米例子。“刻度盘”为可定位的源黑体。cap150/151同排，cap151 samerow。问题1/2完整；问题3仅原印第一行，**在“大气”处ex3 open，156未读、未补写**。本批11个原题对象中10题完整、1题跨页未闭合；12是ex片段数，不是12题。不批准完整§59装订。

五页foot仅保存印刷页码140–144，页脚两侧装饰点/脚注分隔线不编码成教学文字。153/154通页粗墨迹未凭扫描较黑推断全段新增局部强调。未发现本次需要登记的确定数学印错；不存在未披露的破损文字修复。精确字形/局部强调的最终判断仍等待独立逐页像素审查。

## 七幅源图库存、裁框与矢量

各图全原页、网格和最终PNG实际逐张查看；保留对象、标注、右/底边，未只审数学主体。六个原编号146–151连续，加一幅真实无编号肖像，不给肖像造编号148。未新增图题、量值、答案或现代图。

| 页/图 | 最终box `[x,y,w,h]` | PNG及SVG尺寸/viewBox | 完整源对象库存/身份 | 官方vectorize实际rounded mismatch |
| --- | --- | --- | --- | --- |
| 151/146 | `[975,517,190,580]` | 214×604 | 封闭管顶、整根水银柱、底部槽、两侧a/水平虚线、h及上下高度箭头，所有端部完整。 | 0.007% |
| 153/147 | `[971,258,301,941]` | 325×965 | 完整高楼/屋顶/窗门、竖直水管上下端/底槽/支承、两个人物及地面；不是只截水柱。编号图归原练习2的引用。 | 0.077% |
| 153/tbl-p0153-02 | `[947,1569,329,391]` | 353×415 | 完整托里拆利半调肖像及原暗/斜边；无印刷号/独立图题，owner-lesson `phy6-c4-s11`。不误归练习5或挤入连续编号。 | 0.183% |
| 154/148 | `[213,197,1127,625]` | 1151×649 | 马德堡全景两队马匹/牵引/人物/树木/地形；上方两分开半球、合拢装置、环及小配件均完整。未以题中八对马替代像素库存或重画数量。owner-ex `g2-3`。 | 0.094% |
| 154/149 | `[578,958,340,332]` | 364×356 | 整只手、倒置杯轮廓、虚线液面、纸及各端部。owner-ex `g2-4`。 | 0.033% |
| 155/150 | `[246,201,456,454]` | 480×478 | 圆壳/双弧刻度/全部原数字、指针及内部机械、下支承完整；未凭正文750补缺数字、正规化刻度或添单位。 | 0.009% |
| 155/151 | `[851,373,409,263]` | 433×287 | 波纹金属盒、弹簧片、传动/支承、长指针左右端及1/2/3/4原标/引线全保留；未裁去左下1、左3或右固定部。 | 0.010% |

官方vectorize七张全部通过，没有超过2%门禁。只读XML解析确认每个SVG恰有1个path、零嵌入image/零text、`fill=currentColor`，width/height/viewBox与PNG逐一匹配；图内源字已描成path，零text不等于无标签。未另跑vectorize、渲染或误差测试冒充新证据。

实际裁图PNG合计 **1,456,309 bytes**；SVG合计 **1,392,055 bytes**。包含原PNG彩色/半调字节，不拿“看起来黑白”推断压缩字节或图密度。

## 冻结哈希

以下为真实读字节SHA-256。49文件规范manifest覆盖五页MD/JSON/audit、五页PNG/grid/layout/template及七对PNG/SVG；每条`<sha256>  <相对B路径>\n`按相对路径字典序排序后拼接，再SHA-256：

```text
file_count = 49
canonical_manifest_sha256 = 630fae2e98e6ba94b4cbe3738f2fef98afbb3141d65a71298609cddfbcff7c76
```

本报告不在49文件中。源PDF事实绑定SHA `46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`由官方prepare/finalize核验；未独立审完整PDF。

```text
a886a62bcf428a323da223784859fa30242dd8ca8444d912dee531fd3af7f5cb  artifacts/6p/pages/0151/audit.json
97a14ba03394cc41909523e3db466fba4bf1e6f52d86530b290ff1990ceb17f8  artifacts/6p/pages/0151/page.json
c7912044acec561a4ce7c3d9dc51e42b2cf59bbc60337d6d374c3b20e1a1dcf5  artifacts/6p/pages/0151/page.md
30409dc5949f1223d9fa7c75e4f22212d12916603979174b93cefc269b4c43e8  artifacts/6p/pages/0152/audit.json
2e4883d34e209b8635ccca6b32eb7b976ded0b90d650e3ac3713a78cafa27ca6  artifacts/6p/pages/0152/page.json
73bfff65bc3614d1b2bfc40801bd397880378f15cb20e138e792033278f7009d  artifacts/6p/pages/0152/page.md
657bf435978a5bd7ac66d3cd892d3978ef7cfc789d277aa8829ad677d9e67c4d  artifacts/6p/pages/0153/audit.json
1ebe2ccec1f1e0314504de0b5548981617baede7be614a85439da74f2a6439cd  artifacts/6p/pages/0153/page.json
5c50f03ae12ff9700f4fa0be6b36165a93dfd9f856d6ec8a9257fa04f7a42902  artifacts/6p/pages/0153/page.md
550a0bbf3c77ddc3ec6bfb03dfd16cdabfb1e0d95d18c3d5f8fb00eb57b1a504  artifacts/6p/pages/0154/audit.json
2c1c564f2fbf3d6dc2d978e19f6e49e4415b82ec55d08bc91864ef31375852df  artifacts/6p/pages/0154/page.json
6da7b646460b7f05fc847f4cdbfdea708c8c9725ad0560c71af7e227de4081b8  artifacts/6p/pages/0154/page.md
0d22dd38e02218b7669e2d457b21deb8fef5eeafdac760caf4a7a9e03d61bb3b  artifacts/6p/pages/0155/audit.json
5b1c5c0f2e1d1930bb328ba6c6fbde3c568082584481dba2e64ea708ac23c58b  artifacts/6p/pages/0155/page.json
504ce279c9c7f78d079e1822fe7c6e30222ce31823358716b3bfa5ad5f70a34d  artifacts/6p/pages/0155/page.md
8f5eaebd99307c494d6591b560b9f7a75c8657326842443c34736f74387a9c30  work/6p/pages/0151/figures/fig-146.png
c9223fbf74d9c92712d5b5b054b4ab47e193bc27d01e6f12f23b7cada25c0c3c  work/6p/pages/0151/figures/fig-146.svg
be6f451310b6580f9608ee2f0279d3717fce51e3ce4cae9d7622b7cb3e61622a  work/6p/pages/0151/layout.json
e83192e15b8bbf9a759137052602b86cc2db605d6da7df9cc840fe92daa01d01  work/6p/pages/0151/page.grid.png
18af43e24e316295ab1be43f6d78eba15b85bfc3c68d78712f33580efae495bc  work/6p/pages/0151/page.png
6a8d11033b9df97b0b6a7cbe9db48debdf32bbf3db5bb99088ecff9680dce09d  work/6p/pages/0151/page.template.md
277f98943d76f66f3ae90de5c4b232f784e3a2c99a06c4ff2433b86f7c04bf78  work/6p/pages/0152/layout.json
7391c9184140a566ce5f1235b16d417372405f4ed09ac36bdb306222b037ffcc  work/6p/pages/0152/page.grid.png
42dcdb858e462a4fe4f7c7f65f1f2e071a0782d3fbfdcffdc3af1bdd7354a4a1  work/6p/pages/0152/page.png
ac32f5df8512b9382337fb9452015b443a1dfce9f5a2daa5c68b356c75b92b46  work/6p/pages/0152/page.template.md
1da95a3714f186853a2d83920dbc0b86a634a2f177812d57c6a96b3a6cfecfe3  work/6p/pages/0153/figures/fig-147.png
4f335af7a3ff6b732ddecf7cecf4eef83d82a7e26c1f5abe4819eb16d902378f  work/6p/pages/0153/figures/fig-147.svg
567148f69a572e48b92fecda5430c836124752b6ffc9329fae8d87e5751fa208  work/6p/pages/0153/figures/tbl-p0153-02.png
16890e2d46d107d7a596095eb991c7e0dcf51f5816c2740468e8bb7c3f510b6a  work/6p/pages/0153/figures/tbl-p0153-02.svg
b82b909b01ea4d26b1cfab880a14ec6e8dc6f584aa3313ffc4113795c85e8674  work/6p/pages/0153/layout.json
5f6891785acdc75b4dfbcff48ba9efecc784bbc68a8dfa2183feb2641efc9d89  work/6p/pages/0153/page.grid.png
a894e65266161b52447f3590c4f6d59a75da3d78e7ba50361771eb7224a5cc32  work/6p/pages/0153/page.png
13e2d8079bf871a2a4f65ac07061fbf32822ca382bef31db751678eb66c03c76  work/6p/pages/0153/page.template.md
0df021a5feafaa08addd7dfa8aed3f5496165dfd7701b6fc28c1e14233d77681  work/6p/pages/0154/figures/fig-148.png
6dec2437159289325a44deeba7b6eb31fd7170cb8857cb58c7f389eebdac37d1  work/6p/pages/0154/figures/fig-148.svg
fcf619dded8f0aec03c3f912684c2e11b74a994ac2859ccccd038ea0b1122716  work/6p/pages/0154/figures/fig-149.png
8d9ab1a1450ead431c1acdf7826f418cf74e3c44744282ef88b1757480e56e3a  work/6p/pages/0154/figures/fig-149.svg
d6fa9de23f121b9b7203b7d062912fe99bc7b5295f1c60ac06a60969670aca57  work/6p/pages/0154/layout.json
6bbf1affe5baa562d96b99a4e987237b0534bbfd0646f4a9c0d1875efc4f167c  work/6p/pages/0154/page.grid.png
cd63e64c3daf72b9fe2596dd90038f27e04527948e2884e7c9136de66e211a24  work/6p/pages/0154/page.png
0d89bd2553cf9b0f8066d647aa665e312e562d6f210cd6c6b88d07ef160edc8e  work/6p/pages/0154/page.template.md
c9ca7243a874f810e473986a2a2e1a41eafd94a40eb837b428ac66fc29012735  work/6p/pages/0155/figures/fig-150.png
ba8671d2967f8ab82214aa98653cbac0cec574006e58e5494e8d4d65e9814d3c  work/6p/pages/0155/figures/fig-150.svg
308a4a800df17d9b92e0cef61a74238d058ae0438512aa46e294c49af258e1a1  work/6p/pages/0155/figures/fig-151.png
1dbe7ddd336931d899c70fb3d9d93696edae6b12494652231399b84c53e02873  work/6p/pages/0155/figures/fig-151.svg
c7a56908f0872bfd4e0ac81c7f44c38be7065e62f860477c4294b7fc74e49359  work/6p/pages/0155/layout.json
ad8082081333609197ceb037ff54b5d2ec24e3f4c152423e4e370d7a67cf7fb9  work/6p/pages/0155/page.grid.png
3a6a35f463eb7682d7584cc9716886dd99ccf592de49b060dbc069b270ebe016  work/6p/pages/0155/page.png
cd62ef86cf39f037fc5e170a77ae76ede25e8551ddf301a987170f8ed4e9337b  work/6p/pages/0155/page.template.md
```

现有合同/工具/TOC的本次只读身份，不是工具修改：

```text
b3666f4ea4a094c269a2d628a455cbb00598e770d93903fd810597e6f8a9b405  R/.claude/skills/ld-s10y-lesson/SKILL.md
483ebed7d79146af36e547a3d8c88ac4fdca06944fb46c759f83e2cb14a6b06b  R/.claude/skills/ld-s10y-lesson/tools/p2c.py
9723a80790ee216716e4a6097c77a57cc9bf4deab78da0250f851ad6bb7d9435  R/.claude/skills/ld-s10y-lesson/tools/layout.py
b21f0af41a8f623cfb11e29014e6d7174aafb206a0fc1463678c3496fc8f9d82  R/.claude/skills/ld-s10y-lesson/tools/blocks.py
dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849  R/.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json
d2a28ad304a267a49beead1db8dde28c14fc3330245c07330f4086506f0baef2  R/ssot-resources/soviet10year-textbooks/toc/6p/zh.json
```

## 交接状态

第一真实失败数0，已用修复0，无机械阻塞。明确未闭合边界是155问题3至156；本批不读取156、不自补、不声称完整课通过。肖像显式owner及154教学脚注的源表示方式均已在notes和本报告披露，待独立审查实际像素/源流确认。

没有全语料测试、工具阈值调整、其它页重审、第二工作流、现代/答案/choices输出、自签review、assemble或晋升。保持49文件冻结，等待main的独立源审。
