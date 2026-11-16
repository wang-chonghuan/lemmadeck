# 6p 源186–190独立审查

结论：**PASS，仅本报告所绑定的active union源页**。186–189各完成一次完整原像素审查；随后按新增授权，190完成第一次完整原像素审查及唯一cap.box计行修复的独立审查。不是作者机械PASS的复述，不批准现代图、答案或未闭合课程，不做晋升/assemble。

## 精确冻结与范围

- Bacon原handoff：`.tmp/ld-s10y-lesson/source-author-186-190/author-handoff.json`，SHA256 `7ee6abc4dc2b5afe87857edaa398370b8b4f46ad709748e07864f5374165dff9`。
- 原source manifest：同root的`source-manifest.json`，SHA256 `85e8de20a2c9764369b51ed655cd2bc58fb3185ec86feda4ee34e98bd6f9bbff`。
- main190修复handoff：`.tmp/ld-s10y-lesson/source190-caption-repair-01/author-handoff.json`，SHA256 `b8cb4df55c459bcc79a51b5c0855ec9d46a66edf19da82de2158135a85755f95`。
- 原PDF：`ssot-resources/soviet10year-textbooks/sources/soviet10years/6-7p 苏联中学课本 物理 六-七年级.pdf`，实际SHA256 `46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`。
- 186/187仅批准`source-author-186-190/repair-01/{artifacts,work}/6p/pages/0186、0187`；不批准该author原root中旧186/187文本。
- 188/189批准`source-author-186-190/{artifacts,work}/6p/pages/0188、0189`。
- 190仅批准`source190-caption-repair-01/{artifacts,work}/6p/pages/0190`；原root的190首FAIL仍保持FAIL，不在批准union。
- Reviewer冻结：`.tmp/ld-s10y-lesson/source-review-186-190/approved-manifest.json`及`review-handoff.json`。manifest逐页列绝对artifact/work roots、page.md/page.json/audit、PNG/grid/layout、全部裁图PNG/SVG的精确SHA及字节数；只包含本次PASS页186–190。报告本身绑定在manifest内，无循环自签。

全部原page.png/page.grid.png均由`view_image`逐张实际打开，没有同时喂多页。所有active page.md逐行读，page.json全部块/flags/元数据及audit全部读。完整188表crop、176–179四图crop和既存原尺寸SVG栅格视图分别实际打开；SVG本体XML另读，均为native path，非内嵌位图。未重新render/vectorize。185只读已批准page.md尾文本作边界，未重审185像素；未读191。

## 逐页事实

### 186 / 印刷175 — PASS

原PNG SHA `8340321e625d51ae39514efa28f29a78a9c800242ace89bd6c568da6c1265c31`。
active md/json/audit SHA依次为`665aaf63a37886418dde65e56a2c4951f8e221b0c2cb44708aead420541da156`、`970a6f2dc1ebc76e06e278b1ae79beaf4b18144d1e735f18cfa3dee819950ae3`、`a2594487f17f2bea550136932d1d32854e3e35b9c8e5bc86a3039df4eafadad6`。

逐一核对p0186#1–#12，25条实际印刷横排：

- #1独立作业（2）四行，1千米、0.05倍、提示、粗体和两句末点俱在。185尾作业（1）已句点闭合，因此本题不是`ex cont`，也不新建作业栏。
- #2“69. 功率　功率的单位”；#3六行机械功比较：几百块砖/几分钟/整整一个工作日、马10—12小时耕1公顷、多铧犁拖拉机40—50分钟，全字、数字与破折范围一致。
- #4三行“等量的功”比较；#5两行粗体定义；#6两行单位时间/做功速度说明；#7粗体计算句。
- #8（md69行）原功率分式为功/时间，N=A/t，中文分子“功”和分母“时间”确为粗体。使用repair-01的`\textbf`，不是已拒绝`\text`稿；高分式只是一条印刷横排，不漏/增式子。
- #9原N、A、t含义及标点；#10粗体单位定义；#11焦耳/秒与瓦特、简称为瓦；#12页脚`· 175 ·`均一致。页末段closed，不把187首式伪标cont。

### 187 / 印刷176 — PASS

原PNG SHA `e04b4debf13b5e259a22f07d8c8cb380ae557c33b74743bffc79d9d0395dc15a`。
active md/json/audit SHA依次为`c5321477a73ee1ff0057b653945df03404437a5b6bdc61d53b0b060d91986a4a`、`330152979da1dc96fd8e8c41239c51619f8cf4839b2cc1016f491a080c9e3c0b`、`5c1683705693ca5739d3c16337331bf4fde2d5852295459f0d874b65c7e48f88`。

核p0187#1–#16，24横排；#1（md36行）粗体1瓦特=1焦耳/1秒以及“或1瓦特=1焦/秒.”，repair-01中文分子分母粗体正确。
#2千瓦/兆瓦/马力和1000、1000000、736全部一致。#3–#13完整源例题仍是正文而非习题：落差25米、每分钟120米³、m=ρV、1000千克/米³×120米³=120000千克、F=9.8牛顿/千克×120000千克≈1200000牛顿、A=Fh、1200000×25=30000000焦耳、N=A/t、t=1分钟=60秒、30000000焦耳/60秒=500000瓦特=0.5兆瓦。保留源约等号和近似数，不自行数学勘误。三处高分式按像素独立横排保留。
#14五行发动机功率及电动刮脸刀/缝纫机/水轮机/汽轮机/铭牌字句一致；#15两行70—80瓦特、730瓦特与末“在一些”一致，`p open`正确；#16页脚`· 176 ·`完整。

### 188 / 印刷177 — PASS

原PNG SHA `2dd323c2e22d70e894ed0f294d6c2b696b1b588620cd74458a1919f98e57acd6`。
md/json/audit SHA依次为`99d8514620b40e427742b2b4eb2b535f1cd0ec53b86746f000fadb9a02a89aa5`、`ce3e48b840272807760568571fe55cd75fed125c7ab21c1f229960349176da11`、`6a81ecc69d23969a9b787ed09cfd6f8cbff07b1607f07bd37ecb02d7d45c7884`。

核p0188#1–#15，表外18横排。#1“个别的场合，功率甚至还可以更大些.”以`p cont`精确闭合187尾“在一些”；#2粗体“发动机功率举例”加非粗体“（单位：千瓦）”独立cap，未烙入表crop。

#3无编号`tbl-p0188-01`，完整框[172,336,1159,376]，两长横线及中间竖线完整，六行两列没有漏行/对错位：

| 源对象 | 千瓦 |
| --- | ---: |
| 《伏尔加》牌汽车 | 72 |
| 内燃机车 | 3000 |
| 电气机车 | 4000 |
| 《列宁号》原子破冰船 | 32500 |
| 《北极号》原子破冰船 | 55200 |
| 宇宙火箭发动机 | 20000000 |

表PNG SHA `eae10967aeab0e342b394a353a26490a69fae8d969af6f922b2663893b1f454a`；SVG SHA `e557c0191001a75d8ef266af6f013b57b829da6cca1d163f958c905f8677f81d`。实际完整crop和native SVG视图1183×400均保留上列所有字形/数值/原线，不把姓名船名改写。语义归属是69功率课正文表、TOC `phy6-c5-s2`，非问题（5）或任一练习所有；不人为添加owner-ex。

#4–#8正文全核：N=A/t→A=Nt；电风扇35瓦特/10分钟；“解：”与A=Nt同一行；35瓦特×600秒=21000瓦特·秒=21000焦耳，下一行=21千焦耳。一个`↵`保存两实际计算横排，无凑行。#9问题栏目；#10–#14问题（1）–（5）全部文字及问号完整，问题（5）两行closed；#15页脚`· 177 ·`一致。

### 189 / 印刷178 — PASS

原PNG SHA `9026af54c80d741ff6d06931413904d8456e5dd32b5e0af845050cb39b8051bc`。
md/json/audit SHA依次为`e463cf80f3318f01d1f42935e164fca5ce861ebd379ce26cb6d3f9a47c922ca7`、`c55a041d848211dfc5263751ced234d5d259be7b9b4b18e0f8fff52b8109f16e`、`be9ea22d447cf9e28b9c27c13627df48937202228ad64e2f555f1ac280a81c33`。

核p0189#1–#15，26横排。188末问题（5）已闭合，本页#1开始独立“练习36”，不存在题干续接：

- #2–#5四道原题完整粗体：22米/每10分钟/500吨；2小时/10000步/每步40焦耳；100千瓦/20分钟；1小时/30米³沙子/6米/密度1500千克/米³。末题密度单位原跨印刷行保留，不改成立方厘米或重量。
- #6作业标题；#7–#9三题粗体完整：缓慢及快速从一层到二层或三层/全部数据自行取得；查学校车间车床和钻床电动机铭牌；查汽车/拖拉机型号发动机功率。没有生成解答或伪造测量。
- #10“70. 简单机械”；#11远古装置；#12石块/柜子/车床、结实长棒杠杆、图176及西里尔а(U+0430)、б(U+0431)；#13“三千年前古埃及修建金字塔”历史源句、图177；#14斜面滚/拉重物而非直接搬、图178及末“（图”均忠实。最后`p open`不提前填179。#15页脚`· 178 ·`完整。

### 190 / 印刷179 — PASS（唯一修复后的active字节）

原PNG SHA `603e37e3ff6371123bc470fbed9583164bbeac763b36dd3936fcd40534fec987`。
active md/json/audit SHA依次为`6c3de9deae88252fd6b016ad6b04a0357dc3f7e05f2501b0b17bdd60115badc8`、`4672f5eb0c6a14ac780ccb96240b4f74ba9be19e7b8cb231a661ecef40cea542`、`133ac841ea72a00cab3a3a1628ed23eb686a8ba41fab45517250013351236262`。

首次完整审p0190#1–#13，13条实际表外印刷横排；所有4图完整PNG和native SVG视图分别实际查看：

- #1/#2图176两幅整体完整：[269,187,906,418]。两个人、长杠杆、箱/重物、左中支承与右端支承、а/б及A、B、O、F、P与原方向箭头俱在。两个下指P箭头全保留；中央“图176”为独立文字caption，不是正文/其他cap的同排行。右P与中央caption大致同高不意味着两者要声明cap samerow；它们分别是图内标注和文本图题。
- #3/#4图177[221,622,1079,363]：全部阶梯石块、搬运人群、杠杆/支承、右侧两人及金字塔轮廓完整，独立图题在crop外；SVG1103×387不删人/石块/关系。
- #5/#6图178[216,1034,662,233]：整幅可见车体/车轮/车台、圆形重物、推物人、斜板两端/落地端/支承完整；独立图题在crop外，SVG686×257一致。
- #7图179[1099,1023,159,889]：完整高建筑顶、上部支架/轮与平台上的人、滑轮绳/吊篮、整条长绳及底部人/石块全部保留，SVG183×913未截上端或下端。
- #8“179）.”以`p cont`闭合189末“（图”；四图/cap对这段正文配对透明，未插造空正文或移动题干。#9粗体“用来改变力的装置叫做简单机械.”；#10两行杠杆/滑轮/绞车；斜面/劈/螺旋及原分号；#11五行生活用具/机器/切割、卷压或冲压钢板/拉制织布极细人造纤维丝全部逐字、标点核对。末“甚至在现代的结构”未完，`p open`正确，不读/审批191。
- #12“图179”实际位于正文末行右侧同一横排，`cap samerow`正确；#13页脚`· 179 ·`独立保留。13行来自3个独立cap、续句1、定义1、列表2、末段5、footer1；cap179同排不另加一行。不是以行数相等代替像素内容判断。

## 唯一capmask修复审查

原190是真实BLOCKED：Bacon保留的audit为印刷12/块体13；首FAIL在`source-author-186-190/first-failures/p0190-finalize/`。该FAIL和author手稿没有被覆盖，本次批准不追溯改称旧稿PASS。

独立`diff -u`确认active page.md唯一delta为`<!-- cap 图 176 -->`增加既有`box 670,573,129,32`；page.json递归比对唯一delta为`/blocks/1/box: null → [670,573,129,32]`。meta、所有正文/图题字节、13块顺序/flags、四fig boxes/ids完全不变；active work的12文件（原PNG/grid/layout/template和4PNG+4SVG）逐一与Bacon冻结字节相等。

实际原PNG/grid和完整图176crop核实：指定区域只覆盖中央“图176”印刷墨迹，未混入右P、а/б、杆/支承/箭头；完整矩形图框仍须保留两幅底端P，不能裁掉右P迎合计行。读当前`p2c.py`282–311、374–380及439行：mask先使用copy遮figure，再只恢复显式非空cap.box的原始ink；有范围/相交/区域行数验证，恢复不改源PNG或crop，不用内容分类、不含190/176页图号硬编码。与13行像素独立判断一致。

作者新official finalize仅一次exit0、13/13、0normalizations、0KaTeX warnings，audit新增一条真实caption_regions[图176,box,1行]。本审复用该已绑定调用及main明确提供的8项focused caption tests PASS，不重跑finalize/vectorize/counter/tests。190修复1/1、186/187修复各1/1已耗尽；本审没有源修复。

历史工具SHA明确分开，不把before/after声明冒充当前等值：

| 文件 | Bacon冻结历史SHA | 本次读取时当前SHA |
| --- | --- | --- |
| p2c.py | `483ebed7d79146af36e547a3d8c88ac4fdca06944fb46c759f83e2cb14a6b06b` | `acda64449af5a9c043a8502e7840f6391c95cf01a63458bbf005011b773fa8ac` |
| blocks.py | `b21f0af41a8f623cfb11e29014e6d7174aafb206a0fc1463678c3496fc8f9d82` | `e143da93b1f11e88113512cdf757a05c0fd703eefea449e90480403e41d2944b` |

其他工具/配置的历史与当前比较详见review-binding-evidence.json。blocks.py现文档说明cap.box，既有BOX解析/dump路径照读；没有声称只一个文件历史hash发生变化。

原handoff全部211项绑定（193独立路径）当前无漂移；原source-manifest的calls.input_files属于历史调用输入，不是当前产物断言。七项与当前路径不同的旧输入SHA均能对应保留的finalize-input快照，必须以历史解释；不能把它们判为当前字节相等。所有active当前源绑定另行核对。main190新handoff及当前工具绑定21项亦无漂移。

## 完成边界

active union共71块、106印刷行、13原题、5源图；逐页行数25/24/18/26/13，题数1/0/5/7/0。页审PASS不代表课程闭合：c5-s1增加作业（2）；c5-s2完整源到189作业；c5-s3仍在190末open。owner/caption和全部来源保持页级，未assemble核传播。

仅新增本报告及reviewer自有证据/manifest/冻结handoff；没有canonical写、作者源写、tool改、finalize、vectorize、assemble、晋升、Git、DB、服务、浏览器或测试调用。未读main私有解、keys/choices。s19七题source-only源解冻结不变；最新172 BLOCKED已收到，不重审172、不创建最终answer bindings。
