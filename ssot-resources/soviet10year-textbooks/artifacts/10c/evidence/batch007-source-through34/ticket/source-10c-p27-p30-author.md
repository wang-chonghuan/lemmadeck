# 10c physical27–30 源作者不可变交接

角色：STEMROBIN-184既有worker B授权下的唯一cap1源作者，非独立审者；Dalton后续执行唯一original-first review。本包是第七批候选的前置源页，不计完整课。

## 输入与范围

本次完整阅读当前 `.claude/skills/ld-s10y-lesson/SKILL.md` 及 `profiles/soviet-cn.json`。实际manifest的10c指向 `ssot-resources/soviet10year-textbooks/sources/soviet10years/10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf`，369页，PDF SHA256 `47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40`。官方prepare直接用1-based物理页号。物理26页仅尾文读取作边界背景，不改、不重新审查其未决符号；27页原PNG页脚21确认本段偏移+6。

开始时durable/scratch pages0027–0030及本报告均不存在。逐页prepare一次 -> 单张fullPNG -> 同页grid -> 独立原像素观察冻结 -> apply_patch完整page.md -> finalize一次 -> 读取实际audit/哈希及实际crop。计行FAIL保留，不以机器结果改正文，不登记排除或人工expected，不更新book索引，不assemble/vectorize/adapt。只读技能/本册源元数据，不读取答案、choices或其他代理材料。

## p0027 原图先行观察

- 唯一prepare实际命令：`.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py prepare --book 10c --page 27`，exit0，1695×2580@300dpi，未遮图machine23行。
- 完整page.png及page.grid.png分别实际打开。原PNG SHA256 `0a50daeabe59fed1935454ce84e6304733e20d808160221b061d3c0d115cf721`；页脚21。
- 原对象清单：exhead习题1；ex52三行；ex53三行；ex54四行；ex55三行；ex56三行；ex57两行；ex58一行；ex59一行；foot一行。10对象，实际22横排。无图/crop，无正文段。
- 保留52周期(3/2)pi、初相pi/3；53函数y(t)；54全三角式及目标形式；55原带分数3又1/2与3sqrt(3)/2；56恒零解排除；57–59原方程/动词/问句完整。不作答案推导，不改数学表达。
- 八题都闭合，无open/cont；新课标题未在本页出现，不能将页界冒称完成课程。顶边/底边细线、左缘散点、栏标题右侧污点原像素保留，无count_exclusions。
- 本页没有经独立证据确认的新数学erratum，errata=[]；不回读/处理26未决记号。
- 唯一finalize实际命令：`.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 27`，exit1；10块、MD22/machine23、图0、normalizations0。仅错误“行数对不上：印刷23行，块体22行”；unknown_chars、katex_warnings、count_exclusions均空。完整首次FAIL保留，不重跑。
- 当前完整文件SHA256：
  - page.md `b101e6e3fcc5399cdbd06881f14dbe9bafec29252ac3dd08d783c2e840969eb3`
  - page.json `180480cf59a57e22ed7348f97a83ba16c729a0775237c14c1dfc02fc6ae0085e`
  - audit.json `27594d824ff5a31728151bc53388ff1a31561d665b08a985796d1029300d6f78`
  - page.grid.png `5320e1b65024cd02cf8bba48a6996396be3c96bf46d2259aacb0d10a15d04c5e`
  - page.template.md `5834a07dbb471d89fe7ffaa667baf2ea515f5ca7ebc97a6dca0feef288e6480e`
  - layout.json `7cbbe26e82c5d6b08a27fce76345a59129c0cf5dffa78d8643340323ab04053f`

## p0028 原图先行观察

- 唯一prepare同官方命令，page=28，exit0；1695×2580@300dpi，未遮图machine18行。完整原PNG与grid分别实际打开。PNG SHA256 `9eb7f2e57bf285b8513e069a96ca9bd09951a669f537adff7bcff5a7b4fdc46d`，页脚22。
- 原对象：h3“81. 谐振动的图象”1行；p“1）你们知道……”9真实横排；fig12/cap12；fig13/cap13；foot1。共7对象，正文/标题10 + caps2 + folio1 = 13真实文字横排，无题。
- 公式保留cos x=sin(x+pi/2)、g(x)=f(x+a)、|a|、a>0向左/图12 a=pi/4、a<0向右/图13 a=-pi/3。原最后参数等号印在倒数第二排末、负分式印在下一排；完整数学串用一个真实↵保留9排，不改公式或参数。
- 图12粗框 `[110,1420,1290,320]`：两条完整正弦形曲线（实/虚）、横纵轴箭头、x/y、0/1/-1、-pi/4、两个函数标签及指示箭头；图题独立。
- 图13粗框 `[110,1850,1290,310]`：两条完整正弦形曲线（实/虚）、横纵轴箭头、x/y、0/1/-1、pi/3、y=sin(x-pi/3)和y=sin x两函数标签/箭头；图题独立。不重绘、不加答案标记。
- 正文完整结束，无open/cont。右缘墨点及底边约y2470–2490长细线只保留原像素，无排除框；errata=[]。
- 唯一finalize同官方命令，page=28，exit0；7块、MD13/machine13、图2、normalizations0。errors、unknown_chars、katex_warnings、count_exclusions均空；仅机械PASS，非独立批准。
- 实际crop已各自打开：fig-12 `[122,1429,1266,292]`、101连通域；fig-13 `[125,1863,1266,288]`、88连通域。两图全曲线/轴/函数字/指示箭头完整，没有混入图题；只留官方scratch，不提升图库。
- 当前完整字节SHA256：
  - page.md `95522290ac841f2216a9712294e0da78ed907398ba9fddf27d81d5ea0500c59a`
  - page.json `7cbd133dd2a1062f2c6c7d2a70147c8e3509daa65485bb14e10959b2dbdc860d`
  - audit.json `05baa45a729bc7cd1aec81f1314743f8c57114806d444008fa5182a3c66eb97b`
  - page.grid.png `7896416b5fc13be045018947fe84c93aa8fde06cdbded96d74f8a53fefe58ac2`
  - page.template.md `66cbd9033d785b128f72d94d671e688bbb8e44814beadab5504a9472ac58544f`
  - layout.json `94b704171fef53634d82546a6725bb1d1a32bce1f6d8fec80386afbc8a11abd5`
  - fig-12.png `a5970d8c13709475dcfd0fec39a8730bdf595686c2d8218e307b19e3507648a7`
  - fig-13.png `a30cdcdf8c7213a6d1544a427405f6e5ebd292cfc063383ae55345d79f22b989`

## p0029 原图先行观察

- 唯一prepare同官方命令，page=29，exit0；1695×2580@300dpi，未遮图machine19行。完整page.png及grid分别实际打开。PNG SHA256 `b81591ae8c5175ffaa0fe68a92a73bfd434a795612c57972879b8aa9ccce588c`。
- 页脚整页缩览末位不够清楚，额外生成并实际打开局部原像素 `folio-diagnostic.png`，裁块 `[1290,2240,200,80]`，无改像素/缩放。两数字读作23，末位3有破碎墨迹；notes保留识别局限，不把偏移当字形权威。裁块SHA随后绑定。
- 原对象：p第2)段8行；p小字号“事实上，方程……”4行；p例1四行；fig14/cap14；foot1。6对象，正文/公式16 + cap1 + folio1 = 18真实文字横排。小字号同解说明不能漏作非正文。
- 保留映射 `(x,y)->(x,ky)`、k>0、k<1/k>1两个比例及压缩/伸长术语说明、g(x)=kf(x)、`y=f(x)`和`ky=g(x)`的同解解释；例1的4cos x、(2/3)cos x、两个比例及虚线比较全部忠实。无答题或推导。
- 图14粗框 `[320,1530,1095,625]`：完整实线大振幅/虚线原曲线、横纵轴全笔画与箭头、x/y、0、4、-4、y=4cos x和y=cos x两标签。图题独立。
- 例1同时引用14/15，但本页实际只有14；不根据文字捏造15或追加图形。三正文段完整结束，无open/cont；图15将在其实际源页确认。
- 顶边、底边约y2480细线及边缘散点保留原PNG，不作文字/排除框；errata=[]。
- 唯一finalize同官方命令，page=29，exit0；6块、MD18/machine18、图1、normalizations0。errors、unknown_chars、katex_warnings、count_exclusions均空，仅机械PASS。
- 实际fig-14 crop已打开，吸附框 `[327,1528,1087,610]`，65连通域；两曲线全部笔画、轴端与全部标签完整，无混入图题。保留官方scratch，不提升图库。
- 当前完整字节SHA256：
  - page.md `b7213ce18c394e8748cd5e966ef66da8de0e226ef39fc84bca991aefc75219e1`
  - page.json `875a990e267a8ea0de6f3ad462c74fda9a4ca57a9be9f285a58abba156f6eb85`
  - audit.json `fe104435cd6a29219832eb9f45a139bbe3b5942c3e7bd25e2490c7afa29236d8`
  - page.grid.png `52c09e1c04ebf194169b30931849a3c583273d2d2cd8d960fc8d97bc64b039b2`
  - page.template.md `b1520470e65d7bd74d313bdebc632eae9c14def608142e1ff15cafa1ed1eb9bc`
  - layout.json `75db9d5a45690685b7b2fe177ec0d8e04d88cd169b2ed80d404d587f4629bd35`
  - fig-14.png `fab7ca5f77d266a4f6b300f539a452bcc2ceac5fa6c08a4b8e9e6d358dd8e5bc`
  - folio-diagnostic.png `b823fa956b705aa5d1df79ede3bd0b056213ac8f157d232339d5f24400c82a63`

## p0030 原图先行观察

- 唯一prepare同官方命令，page=30，exit0；1695×2580@300dpi，未遮图machine24行。完整原PNG和grid分别实际打开；PNG SHA256 `0b15d5365ba87a2a8b6e089354e07ba4aa1acde1da5a571d528b534067d2dfe9`；页脚24。
- 原对象：fig15/cap15；p第3)段6横排；p小字号同解说明4横排；p例2四横排；p第4)段3横排；foot1。7对象，正文/公式17 + cap1 + folio1 = 19真实文字横排，无题/新标题。
- 图15实际页顶出现，粗框 `[175,245,1250,390]`：两完整余弦形曲线、实虚线型、全轴笔画/箭头、x/y、0、1、-1、-2/3及y=cos x/y=(2/3)cos x两标签，cap独立。语义引用来自29页例1，没有空p cont。
- 全部横向映射、k>0、比例1:k、g(x)=f(x/k)、g(kx)=f(kx/k)=f(x)及两个同解方程/点坐标保留。例2的cos(x/2)/cos20x、1:2与1:(1/20)、虚线比较、图16/17引用保留，本页无16/17实际图，不补画。
- 第4)段保留完整y=Acos(omega x+phi)、A>0、omega>0及编号(1)，末句“的图象.”完整结束，无open/cont，但81课后续说明尚未取页，不能计闭合。
- 右缘x1580–1660散点/短竖迹、顶部及底部y2480–2500横迹保留原PNG，无计数排除；errata=[]。
- 唯一finalize同官方命令，page=30，exit0；7块、MD19/machine19、图1、normalizations0。errors、unknown_chars、katex_warnings、count_exclusions均空，仅机械PASS。
- 实际fig-15 crop已打开：吸附 `[201,244,1215,383]`，103连通域；完整曲线端部、轴端和全部字/数字保留，图题未混入。官方自动crop归属记录为snapped-components、27969 ink pixels、ink_sha256 `9d26d674affdc49b35e973cfc6ec5237044d5c8cfa05bfe28f0b51323f32372c`；没有手工像素mask/计数排除或工具改动。
- 当前完整字节SHA256：
  - page.md `00fe5769d130c4646c28efb7e0442c33d3ba4afb6d16b473d0c104888221a251`
  - page.json `3e6b47b115f9c8de802da58f866db5d58611610d7c58351849220535405c2ee1`
  - audit.json `31cebe53591fd3e196f5ac21e1ac9183fbae28c93c4b118ef648050abd64a56d`
  - page.grid.png `1bd34c176b03a0c8153699d060b44072ec69cdaf0a7ce40b37947a9293a59942`
  - page.template.md `7022801596c94f636643863378ec10a16e4342dc1008ec029d9e5c8807694902`
  - layout.json `bb874eaac8a51abc95191e30ca5bfcbea73b895b28571b92cbac2e3251fb9773`
  - fig-15.png `3e50483b4fdcdefe9c816d7f76a77cf0100d2fe8417c3821341883efac2084b2`

## 冻结交接

|物理/印刷页|对象数|实际观察及MD横排|首次finalize machine/MD|exit|作者交接状态|
|---|---:|---:|---|---:|---|
|27/21|10|22|23/22|1|完整首次countFAIL保留|
|28/22|7|13|13/13|0|机械PASS，未独立批准|
|29/23（末位碎墨，局部留证）|6|18|18/18|0|机械PASS，未独立批准|
|30/24|7|19|19/19|0|机械PASS，未独立批准|

共30完整page对象、72真实文字横排；8道原题52–59、4张实际原图12–15及各独立cap。所有正文、公式、小字号说明、书源例题和页脚保留；本页范围未确认新数学erratum，全部errata=[]，不解决26符号/负号未知。

### 实际边界

- p0027为完整习题栏，52–59每题均完整，无cont/open。它不是26正文的文字残片。
- p0028出现新的h3“81. 谐振动的图象”，第1)段完整结束；两图位于该段后。
- p0029第2)段、同解说明和例1都是完整段落；p0029#3引用图14与图15，图14在本页，图15实在p0030#1。这是图引用跨页而非缺字，未创建空cont。
- p0030第3)段、同解说明、例2和第4)段开头均完整成句；p0030#5原例2引用图16/17，当前范围不含其原PNG，不猜绘、不补图。p0030#6仅引出目标函数，81课整体后续仍未取，不能计课闭合。
- 本单四页文字对象没有需要open/cont的真实跨页残句，未人为填标记。无读取31页或扩大页范围。

### 实际命令顺序

每条一次，每页prepare之后打开同页原PNG/grid并完成忠实转写，才执行同页finalize；不存在四页一起喂图或先参考作者/审者notes。

```text
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py prepare --book 10c --page 27   # exit0
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 27  # exit1; 23/22
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py prepare --book 10c --page 28   # exit0
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 28  # exit0; 13/13
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py prepare --book 10c --page 29   # exit0
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 29  # exit0; 18/18
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py prepare --book 10c --page 30   # exit0
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 30  # exit0; 19/19
```

附加本地证据仅p29页脚原crop，通过既有Pillow将 `page.png` 的 `[1290,2240,200,80]` 区域原像素保存成 `folio-diagnostic.png`，未改源、未覆盖文件、无网络。没有执行新诊断counter或外部浏览器。

### 完整文件位置

持久源MD/JSON/audit：`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0027/`、`0028/`、`0029/`、`0030/`。

原PNG/grid/初次template/layout和实际crop：`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/10c/pages/0027/` 至 `0030/`；图12/13在0028/figures，图14在0029/figures，图15在0030/figures，页脚证据在0029/folio-diagnostic.png。逐页上列哈希绑定全部当前完整文件；不是只留哈希替代失败字节。

所有新源页保持未批准；没有执行任何Git操作或stage，没有prepare/finalize重跑23–26，没有改counter/工具/计数排除/人工count override。没有assemble/vectorize/bookindex/adapt/现代图/答案/choices/DB/env/install/network/其他chat操作。已停止本范围，等待Dalton唯一独立源审查，不将第七批候选计作完整。
