# 当前检查点

2026-11-19：187-6重建。官方create_worktree operation
71d3ecbf-8f24-45ab-9d14-54c5ee1ee575已completed并合法注册。
指定基线及分支记录于ticket.json；main未制作、pull或写入。

只读旧树实际比对：3m 175文件、5m 9448文件同字节；4m 1082文件同字节，
另有未提交图文件。无整包恢复、未知字节恢复或旧树改动。
旧182 progress与错误/锁/备份/stash/费用仍在旧路径，未清零或删除。
原3m/5m/4m索引仅是复用基线，不算本单新交付。

现存4m现代n13/n15/n18/n19缺answer-keys。
n18原253仅引用图IV但未在figures.json绑定，先确认真实颜色图版来源。
n19正文明确“7-x=10没有根”，核验此约定是否足以确定264的数域。
第一批补缺继续中；尚无新增完整课、commit/push或review交付。

## 第一批实际接续

- 原拟4m n13/n15/n18/n19共58题。唯一独审者Heisenberg
  `01a1f61e-0dea-7210-95a9-75f3c5c7a293`先冻结独立源解，再比较作者键。
  源解sha256 `b29c195398d7f5a4678b3672c33abf9877db2e820bd56764561cd84be5ded224`。
  `.tmp/stemrobin-187/reviewer-batch1/source-solutions.json`和各比较报告未覆写。
- 独审实际确认57题的显示数学答案；264仍HOLD。旧“正文7-x=10无根即证明非负域”
  的结论已由独审明确撤回，原结论保留不改；新264草稿仅列非负/实数条件解，
  不创建无条件选择题键。266只答共同砝码单位的3倍，kg出处仍未确认。
- n13/n15/n18新的答案parts已现场按冻结推导列出，分别auto=9/6/12；
  合计27auto、10ungraded。255因任意自设付款变量的开放建模保留ungraded。
  官方`lesson_answers.py finalize --book 4m --edition modern-us-neutral`
  同时检查这三课已exit0，含numeric/expression及真实MathLive编辑检查。
  新parts字段映射的受影响独审仍在同一审者排队；不重审原display PASS。
- 图IV来源为PDF322/印刷313，原crop sha256
  `64467cd61618023b63f8d26be1ee10214f85fc96d747c3da70abc856f07cbcb3`。
  独审实际看原整页、crop和现代预览，确认10同心圆、AB/BC/CD/DA四直连接、
  无多加数学条件；目前该审者累计15图，后续5m两图各原/现代共4图将为19。
  父方没有复看整批。
- 新持久图`editions/modern-us-neutral/figures/tbl-p0322-03.*`已提升，
  首次提升spec与独审候选同字节sha256（后续宽度增补见下段）
  `c891be0d8268d86dcc677f17330969bbef9ad45f643ed6138babd1c2e4993482`，
  SVG同字节sha256
  `1b831fd94fe0ead22a1fb2970456b95ea8a88a30afb168afbb0f294e7ae5ba78`。
  正式render与record_review通过。第253题raw/modern的图绑定和源快照已补，
  题文字节不变；n18官方adapt-finalize exit0。book索引仅n18图数及源哈希更新。
- 源附图页0322首次失败已保存在
  `.tmp/stemrobin-187/page322-first-failure/`和4m持久evidence文本副本。
  I/VI图号像素在图框内，新增显式caption box还原真实行计数；
  V/VI并排使用samerow。计数6=6通过，vectorize已通过。
  最小代码修复为layout遮框时保留显式caption像素，以及assemble识别罗马图号、
  将远处实际引用图纳入课清单。两项新聚焦测试分别3/2项exit0。
  未整书assemble或改写其它课。
- 新补题作者Socrates `01a1f623-334f-7ac2-8828-d130784655e2`不是审者。
  n13原187/192的两题、n15原210一题结构/语义已通过，
  n19原264无题键blocked及checker exit2保留。
  原作者目录与交接在`.tmp/stemrobin-187/choices-supplement/`。
- 新旧PASS包已仅作集成合并，不重写任何旧view/key/数学审查对象：
  `.tmp/stemrobin-187/merged-n13`为10源/13题，
  `merged-n15`为11源/14题；prepare_seed只刷新当前合法来源trace。
  原包尚未移动/覆盖或retain。跨题新增影响由同审者待查。
- 作者正在补5m `math5-c3-s3` 的1201-1213：
  `.tmp/stemrobin-187/choices-supplement/math5-c3-s3-author-20261119T233921/`。
  此课原正文/答案/图PASS复用；只缺选择阶段。两图fig195/196原/现代各看一次；
  作者此前2图加这4图、随后n18图IV两图总8，禁止再预取。
  完成此课后同作者补n18原253新题，新目录不读旧选择或答案。
- 批次计划改为4m n13/n15/n18及5m c3s3；n19因264来源HOLD留待后续，
  不将其条件解说成完整课。
- 一次全批次离线检查脚本已建立（尚未执行）：
  `.intentfold/tickets/STEMROBIN-187/tmp/check-offline-batch.cjs`；
  隔离headless、offline=true，1440x960及390x844，四课正文/书写题/选择/内部答案预览，
  全题全滚动、字体/图非空、无键泄漏、书写题无输入控件等可失败断言。
  等审查与retain齐全才官方render后执行，输出到新目录保留真实失败。

当前仍无完整四课批次、commit/push或最终review交付。未写共享DB、
未动旧树/其它生产分支/178/六年级266题，未付费调用、合并或部署。

### 随后受影响收口

- 27auto/102parts独审为26PASS、1REVISE：213的第一label误写“第二块地长”。
  已仅改为“第二块钢缆长”；原有first-parts REVISE报告和当时完整n15键均保留。
  本地结构比较exit0证明除此label外整个n15答案对象完全相同，
  expected/judge/unit/display没有变化，原实际MathLive/ComputeEngine PASS复用。
  独审已被授权仅核对修正字段并另存补充，不复解102parts。
- n13/n15合并包的受影响跨题冗余/泄漏/覆盖和当前来源绑定独审PASS，
  两包官方validate各exit0。原24题及新增3题、27个数学审查对象均原样继承，
  没有重写旧view/key或替换旧独解。原三份JSON已原样移到
  `4m/review-history/stemrobin-187-batch1/<lesson>/baseline/`，
  当前合并包经官方retain_choices各成功保留到各课choice-set；n15图资产未移动。
- 图IV离线媒体实测：1440宽为480px/标签27px；
  390宽为310.015625px/标签17.43837890625px。
  当前spec只将display.widths加上保守整数310，source/inventory/objects/assertions
  与SVG输出未变；新specsha256
  `7b4e28adcef42c229ae42d9373bb2c875d37212b79c47851749ff276713f2f15`。
  原正式spec/render/review和一次被整数格式门禁拒绝的310.015625草稿已存
  `.tmp/stemrobin-187/plate-width-before/`；按整数310修正后正式render/review PASS，
  不重看图。页0322其余实际source PNG和vectorize通过的SVG也保留于本书figures，
  不新增其它现代图或课程批准。
- 作者本批已完成（当前completed，不接下一批）：
  5m c3s3的13源/11题，目录
  `.tmp/stemrobin-187/choices-supplement/math5-c3-s3-author-20261119T233921/`；
  n18原253的一题自然多选，目录
  `.tmp/stemrobin-187/choices-supplement/math4-c1-s3-n18-author-20261119T235003/`。
  每份含先于题稿的source-solution、结构checker一次exit0及实际streams/handoff。
  作者context累计8图各看一次；不会再预取。本批唯一审者接续这两份，
  n18图按已看源解复用、5m4图按seed先独解，再读view，最后比较key，
  审者累计将为19图（当前相关审查尚未返回）。
- 等同批选择审查期间，仅补原已读取n19中18可确定题的parts；
  264/265/266仍ungraded，其中264域HOLD，265需开放根意义解释，
  266原SI单位来源仍缺失。n19整体status保留draft，不生成ready/audit或声称完整课。
  官方check_math_expressions直接检查新字段34项exit0；
  check_mathlive_exact直接检查10候选，每候选实际输入编辑、attempts=1、inputEvents>0，
  全部pass，完整报告`.tmp/stemrobin-187/n19-mathlive-exact-report.json`。
  尚未进行18新parts的独审比较，不能算最终Gate2或新增完整课。
- 通过项目assemble._toc_cards从完整TOC展开：
  3m有28卡、raw索引2；4m有82卡、raw22；5m有66卡、raw66。
  这是实际结构计数，不是完整交付计数。5m仅c3s3尚缺选择阶段；3m/4m仍有
  实际缺失来源/现代阶段，不以少量现存目录假称整册完成。

下一步：收取213单字段以及n18/5m选择独审，n18合并旧PASS+253后只查新增包关系，
官方retain两份，再四课官方render到`.tmp/stemrobin-187/offline/<book>/`，
执行一次全批次offline浏览器检查（保留失败并只修真实原因）。齐全后约四课批次
commit/push，然后按书序继续4m已有raw但缺现代的最近卡片，不预取下一批图片。

### 2026-11-20 最终选择收取与机械检查

- 独审最终交接已实际收取：213唯一label修正PASS；n18原253的一题/4选项PASS；
  5m c3s3的13源/11题/44选项PASS，两份带review的官方checker各exit0。
  原始自由测量、放样、画图与自填表的能力损失不计为已证明；
  新公开测量例数不冒充原图精确尺寸。审者累计19图，本阶段没有重开图片。
- n18合并产物已生成于`.tmp/stemrobin-187/merged-n18/`，16源/22题，
  只合并原21题与新253，正在等待新增跨题关系和当前trace的受影响核对。
- 5m c3s3独审review按原字节放入作者交接目录；正式retain成功。
  首次retain误传不存在的`--review`参数，退出2，未写目标；按工具实际四参数
  合同修正后退出0，无作者或语义审查重跑。正式5m render退出0。
- 项目机械检查实际结果：content-db测试exit0，教材validate exit0，
  app测试exit0，app build exit0（仅原有chunk-size warning）。
  `python3 ssot-resources/audit.py`实际exit1，输出含继承7a重复页图、
  历史临时模板及6a/4m持久证据中的临时路径。不能记录全仓机械防线PASS，
  不改其它组资源或放宽audit。32个本批修改/新增JSON独立路径检查exit0，
  无新增disposable reference；这只证明本批差集，不替代全仓审计。
  原完整失败输出留在当前工具记录，历史文件和失败记录未覆写。

- n18新增跨题关系独审已PASS；21旧题与新253的全部source/question/figure
  审查对象保持原字节，只有reviewer.identity追加包证据。最终checker一次exit0，
  原三份JSON已原样归档，本课当前16源/22题经正式retain成功。
- 四课官方render均exit0；一次
  `node .intentfold/tickets/STEMROBIN-187/tmp/check-offline-batch.cjs .tmp/stemrobin-187/offline-check-first`
  实际exit0，32页面/视口检查PASS。覆盖1440x960及390x844的正文、
  书写题、选择题、内部答案预览，全段落/题文/公式/选项/图与滚动末尾断言。
  报告sha256 `e986b0f9a125e50a885e88cbb15e5230f207a3663aa0043ce8cc2dd4a7f0fd3f`。
  本次内部答案预览不成为learner页面；书写题和选择题不含答案键或输入控件。
  四课分别10/11/16/13原题、13/14/22/11选择题，共50原题/60选择题。
  本单新增37标准答案及15选择题，其余阶段为已有PASS复用。
- fresh显示观察者Schrodinger `01a1f64d-8bf6-76e0-aa91-442baf43d874`
  仅查看本次四课桌面/手机choices共8张既有PNG，无数学重审或浏览器重跑。
  原作者与数学审者均已completed并关闭，未接下一批或新开图。
  标准答案源解、首parts REVISE、213修正及n18包关系证据按原字节保留在
  `4m/evidence/stemrobin-187-batch1/`，预览HTML/PNG仍只在.tmp。
  n19新18题parts尚缺受影响独审，整课draft/HOLD留工作树，不纳入完整批次。

- 原8张choices全页显示观察为6PASS、2BLOCKED，后两项仅因n18超过一万像素
  的PNG被查看工具缩小，非发现渲染缺陷；原报告原样保留。只补n18原尺寸首尾
  桌面/手机四图及两视口各96题干/选项区域字号检查（最小16px），脚本exit0。
  fresh Hooke `01a1f652-16af-78d3-864d-27607328cff6`实际只看四图，各一次，
  全部PASS；与已通过全段DOM/公式/末尾滚动证据合用，解决长图缩放限制，
  不声称逐像素读完全22题。补充报告`.tmp/stemrobin-187/n18-readable-views/observation.json`，
  不改原BLOCKED、不改课程、不重做数学/整批显示。
- 提交前origin fetch exit0，没有pull/rebase/合并其它生产分支。暂存71文件
  窄范围核对exit0，无n19草稿、其它册、.env或凭据；尾部多余空行已修，
  `git diff --cached --check`随后exit0。该批将作为开发批次留存，不代表
  全仓机械防线PASS或最终整组review完成；之后继续最近有源缺项。

### 第一批提交与第二批接续

- 第一批已commit/push：`8fcd8b3b233f6fb298c3ed3208c13ae682a47bdf`；
  当时`git ls-remote`确认本地HEAD与远端分支SHA一致。四课完整批次已留存，
  不代表三册完成；全资源audit的继承失败仍未解决，未声明最终review完成。
- 第二批从4m `math4-c1-s1-n2`接续；官方adapt-prepare成功，15正文块、
  20原题、5图。现代正文模板只改布局及与批准图3一致的Oakview/Riverton/Emma，
  数值数学不变，section_breaks取自官方prose_flow输出。
- 原题标准解草稿存于`.tmp/stemrobin-187/batch2/n2-answer-source-derivation.md`，
  拟13auto/7ungraded，尚无独审/finalize。31的端点距离依实际画法而定，
  明示垂直样本不作为唯一键；17的实际图5解释尚待绑定。
- Banach `01a1f655-44ba-73b0-9f4f-0f435bfbcab0`负责图1/2局部修复，
  当前写入仅在`.tmp/stemrobin-187/batch2/figure-repair/`，尚待最终交接。
  图1已留下真实HOLD：现有上视蛋糕遮住盘底，删除像素不等于恢复盘底；
  图2有已渲染候选，尚无独审批准。原拒绝、费用、素材和图3/4/5的PASS均保留。
- 接续时live Plane读取HTTP200，工单仍started/Finish review，范围及离线边界未变。
  n19唯一持久未提交答案草稿仍保留且不暂存，不计完整课程。

### 第二批当前实际结果

- Banach已收取并关闭，图1仍HOLD；图2候选无opaque matte、无残余整圆，
  但不是批准。作者实际7图；handoff sha256
  `a7014d50058f8e18ee3d4914d8bfb18b615137edfceef1c7d9118c3146376196`。
- 唯一独审Gibbs `01a1f65c-daea-77b2-b052-3d4b5b360f98`已完成并关闭。
  图2实际7图后FAIL：原图三个蛋糕块的厚度和两条浅色夹层丢失，
  只剩相等平面面积。几何、完整人物/盘缘、无遮罩与文化检查通过，
  不以它们代替源图立体蛋糕量的要求。原fail review sha256
  `5f9418ac61f05a999415076deec3159264ffc9587114a0eb21d19509c359a5f8`，
  handoff及截图保持原样，未提升图2。
- 父方只针对图2厚度缺陷在新目录
  `.tmp/stemrobin-187/batch2/figure-depth-repair/fig-02/`创建一次候选：
  旧三个顶面/radius53、贴图、人物/盘子位置保持不变，新增三份同厚分层切面。
  24-unit厚度为明确现代模型，不伪称源图实测。draft validate exit0，
  正式render exit0（25 objects、0 labels）。父方本图片批仅原图、旧候选、
  新候选各一次共3图；这只是局部作者检查，仍待受影响独审，不声明PASS。
- 图3/4/5已按retention中的源、spec、render、review及输出哈希逐一绑定，
  只更新正式source/asset/output路径和由此产生的元数据hash。旧reviewedAt保留，
  SVG/artwork与旧PASS同字节，无重新渲染或视觉复核。三个正式spec的
  rendered stage校验均exit0；仅接入n2草稿清单，n2整课仍未收口或交付。
- 4m `math4-c1-s3-n22`已有真实3正文块、2原题、0图。官方adapt-prepare及
  adapt-finalize已完成；保留一次错传`--work-dir`退出2、Cyrillic标签拒绝、
  数字标签被识别为新增数据的失败。只在现代层改为profile要求的Latin a)/b)，
  raw及source快照不改。官方现代finalize exit0。
- n22标准答案由父方按原题生成，独审先冻结源解再比较display/parts，内容PASS。
  315两个完整解集为1auto、两parts，各接受两种元素排列；316完整射线作法ungraded，
  不把数集键冒充作图。自然数从1开始由本课明确列尽的原文1..5支持。
  随后官方lesson_answers finalize exit0，4个exact候选完成真实MathLive编辑，
  auto=1/ungraded=1；独审保留原draft审查并另存ready/count元数据绑定补充。
- 新选择作者Newton `01a1f65d-d89c-7882-bb19-5e9c7707bcff`已完成并关闭，
  未读答案，0图，2源/2自然single，原题不替换；其先于draft的source-solution
  sha256 `391ee18822642aa2d09466a6b25f7f5ca5009400798cf51cf184461874806ae6`。
  同一Gibbs用自己的冻结源解，先view后key审查PASS，checker with-review exit0，
  review sha256 `c37c1beb8a8900db7b15712725fb98c175e135541f0120712f2ee6ceef1b1cff`。
  写集合与实际射线标点的能力损失均明确保留，不算选择题已证明。
- n22官方retain_choices及render各exit0；当前正文/原题/标准答案/选择均齐，
  离线页在`.tmp/stemrobin-187/batch2/render/4m/modern-us-neutral/math4-c1-s3-n22/`，
  桌面手机全对象显示尚未运行，因此尚不计完整显示批次或新的commit/push。
- 后续n6/n7/n21官方adapt-prepare成功；未因模板存在计为完成。
  n6现代层仅ex88枚举改Latin；n21仅300/305枚举，以及306教学资料地区、
  308 Emma/美分、312学生小组语境替换。数值/公式及raw未改，仍待正式收口和独审。
  Dirac `01a1f666-7c38-7a83-b4bc-1f218ba244ba`正在唯一图片作者任务：
  n6图28/29/30/31，最多4原+4候选共8图，写入
  `.tmp/stemrobin-187/batch2/n6-figures-a/`；没有其它图片作者或在途独审，
  父方当前不再打开新图。等待实际交接后再安排下一图片批。

### 接续当前上下文

- Dirac第一批图28–31已收取并关闭，实际8图。图29–31为render PASS未批准；
  图28保留首轮O标签clearance失败，父方仅渲染作者已验证的gap34→46标签修复草稿，
  官方render实际PASS（4 objects、3 labels）。候选为`fig-28.repaired.*`，
  原失败spec/output/report未改，未提升任何n6图。
- fresh独审Euler `01a1f671-eaba-7840-a361-aee27c26c626`仅接28–31：
  4原+4候选最多8图，先冻结源库存及82/83独解，再看候选。当前唯一在途审者；
  无其它图片作者或预取，父方不重开整批图。
- 本次live Plane GET HTTP200，仍started、finish review，范围和离线边界未变。
  已有PASS、未完成n19及图1/2失败/HOLD继续保留。
- n12正式adapt-prepare已成功，实际路径`math4-c1-s2-n12`，21题/5图。
  新文字调整及非图标准解草稿均在batch2 scratch；只改Latin枚举、美元/美分、
  奶牛场语境，raw和数值不改。173严格鱼数比较需条件说明，不创建无条件auto键。
  n21的306数域问题仍留待独审，未用n12绕过或删掉它。

- Euler四图实审已PASS，各4原/4候选恰8张，不复看或补截图。独立82/83源解
  sha256 `e6b6e2159027831902c21ebe461dccf20ff651bd4c64ada954f83621f28a5bc2`；
  83依题序无/无/有，第三对在画面外相交，不把有限裁图当有限射线。
  官方record_review四份及原失败证据均保留。四份spec/SVG原字节提升到
  4m现代figures，仅render/review持久路径重绑，正式rendered校验均exit0；
  原reviewedAt保留，无再次视觉审查或渲染。
- n6混入前课图27图题的确定性装订缺陷已小范围修复：cap过滤按所有实际
  练习引用判断，真正本课正文引用的同图仍保留。两项新正反例test exit0。
  只从n6 raw正文去掉`p0028#6`的图题，页级文字、像素、数学、图与练习不改；
  当前现代模板来源快照和raw索引正文计数同步。原文件均在
  `.tmp/stemrobin-187/batch2/n6-caption-before/`保留，没有整书assemble。
- Euler目前只继续非图题的源解及caption受影响文本核对，没有新图预取。
  fresh作者Gauss `01a1f678-87af-7fe0-9d17-cb5a65954410`接图32–34，
  唯一当前图片作者，最多3原+3候选共6图，不看答案或旧选择；候选未批准。

- Euler最终收取关闭：八道82/83/84/85/86/89/90/91标准答案内容全部PASS，
  review sha256 `c2dd1d2e4880d26cd3e245e2985e284053acfcdb0c8e9458c054888f9f4fcb60`。
  82完整九线段/两直线/12具已标始点射线，并区别8条可由两个现有字母命名的射线；
  90四不同点的任意排列样本与原射线的同向子射线解释确认，无反向承载直线混入。
  cap27受影响文本绑定确认，仅观察新增section_breaks/图清单元数据，不冒称已批准它们。
- Gauss后三图首draft/render均PASS并关闭，实际只开三张原图；三张candidate PNG
  已产生但未开，不以机械PASS代替视觉审查。父方按独立作者源库存写87/88/92草稿：
  AB平行KP/NM/CD；图33顺序O/M/C/A/B/K；图34方程x+28=82、x=54毫米。
- fresh唯一独审Aristotle `01a1f680-59d0-7fa0-80da-66da8fbf588c`接32–34，
  最多3原+3候选6图，先库存和独解，再看候选及最后三个答案。另首次核对
  n6现代文字数学保真与section_breaks，不重审cap27或前四图/八答案。
- n12非图18答案草稿已写于batch2；171/172/181仍等真实图表。
  所有新答案/选择尚未正式n6/n12收口，n22显示尚待批次检查；第二批未commit/push。

- n2仅16/24/28/33小问标号已改Latin，原字节快照保留；图1HOLD及图2首FAIL/
  新厚度候选仍未批准，n2仍未计完成。
- Aristotle后三图、最后三答案和n6现代文本/layout首次核对全部PASS，已收取关闭，
  实际6图，handoff sha256 `3fcdbcae649d624de6a5a82ee9a7cb40d6a1bd36c883d659116103722986ab38`。
  87的三条平行棱、88全部2/5与3/5线段及CB=2/5、92方程/根/毫米单位均确认。
  三图旧spec/SVG原字节提升，只有持久metadata路径重绑，无重渲染或重复图审。
- n6官方adapt-finalize exit0，2/6正文块和2/11题只有布局改写，7图全部批准绑定。
  官方答案prepare后，按当前11题顺序合并两个已审草稿，答案对象不变；
  官方lesson_answers finalize exit0，auto4/ungraded7。没有exact项，因此
  不声明发生过真实MathLive编辑，numeric/表达式机械合同通过。
- fresh选择作者Carson `01a1f688-e14f-7220-834b-03fa4d6624fa`接n6全11源，
  只能读现代题面/定义/实图，不读任何标准答案、旧选择、审查源解。
  预计最多7张实际现代图，当前唯一图片作者；尚无新的选择批准或显示检查。
- n12非图18标准答案草稿已完成，13auto/5ungraded；其中179和182/183的exact
  输入候选尚未跑真实编辑门禁，不能计为已通过。三道图题继续待实际图表与独审。

- 已原字节留存11份n6/n22标准答案及源解/审查文本到
  `4m/evidence/stemrobin-187-batch2/`；图片预览/运行时仍只在.tmp，原失败未替换。
- 跨标题cap修复已进一步收窄：本课已有同号prose图时不使用全局练习引用过滤，
  保持其独立图题；三项针对性测试exit0。第一次实际绑定命令误用系统Python，
  因无PIL退出1，未改依赖；改用课文技能现成venv后exit0，n6来源仍原样匹配。
- 当前共享逻辑对三册已有现代课的只读来源绑定核对exit0：3m=0、4m=7、
  5m=66，共73当前绑定有效。无重渲染、答案或选择审查重跑；
  0不是3m完成，73也不是三册完整课计数。
- n12第174题未审样例补明每格20/30对应单位线段一格的1/20或1/30，
  不把大格当表示1的单位线段。仍是草稿，待独审及正式收口。

- n6选择作者Carson已完成并关闭：11源/12题、9single/3multiple、54选项，
  官方结构检查exit0，尚无语义批准。作者只看7张现代图各一次。
  当前唯一独审Cicero `01a1f696-2424-73b2-8a0b-5f998645e3d1`
  只处理n12的18道非图题，0图；先冻结源解再比较草稿。
- Peirce `01a1f697-36a0-70e2-8965-ada0c5ce667e`是唯一当前图片作者，
  仅图57/58/表p0048/图59，4原+4候选最多8图；图60不预取。
  已冻结来源库存，父方没有复看图片。172完整八正方形及两组合同关系
  据库存写为未审ungraded草稿，不以只判数量代替原任务。
- 第二批离线脚本已包含可见绘制内容、正文/选择题原尺寸首尾截图断言，
  尚未执行。n6/n12/n22全部收口后一次执行；不复跑第一批已有PASS。

- n12文字独审18/18 PASS，review sha256
  `c121752309478c09cc37662cdf2c19725cd37502da2e9179ab8cabcdfa367dba`。
  prompt中的“raw4m”只是原始4m的描述，规范持久来源路径已澄清；
  原缺路径查询失败及初报告保留，另有source-identity补充，不重审内容。
  文字答案、独立源解、初报告和补充均原字节留到batch2持久文本证据。
- n12图作者第一批结束关闭，实际8图。表与图59首轮标签碰撞FAIL保持原样；
  两份标签间距修复稿随后父方官方render exit0，机械差集仅声明的标签位置/间距。
  同一独审4原+4候选恰8图：图57/58/表与171 PASS，图59及172 REVISE。
  后者原图底行实际X/L/Y/E，作者误记X/Y/Z/E；原误记、候选、FAIL和REVISE未改。
- 父方仅定点打开图59原图确认争议字形，新增source-label-repair候选同时修正
  点id/标签/source.inventory/关系断言；数字几何不变，draft/render exit0。
  172新草稿同步改为MKLX/KPYL/PTEY/ACYX/BDEL，原b片段保留。
  图57/58/表三图已按独审PASS原字节提升，仅持久metadata路径重绑，
  三份官方rendered校验exit0，没有重渲染或重看整批。
- 图60本批由父方现场制作：原图仅A/B/C/D同一直线四点和有限AD线段，
  没有刻度、等长或箭头。首spec因canvas.height128低于门禁320被拒，原稿保留；
  仅同比扩大画布和像素样式到1200x320、原boundingBox/显示合同/来源数学不变，
  修正draft/render exit0。181完整归属答案仍为未审ungraded草稿。
  父方本图片批实际只看图59原/修正和图60原/候选共4张各一次，未复看第一批。
  Cicero只接59修正候选一张及60原/候选两张，计划新增3图、累计11；
  其它既有18答案、171及三图PASS不重审。当前仍待两图与172/181补审。
- n6正文和11书写题官方render exit0；选择页待独审后用choices-only生成，
  不重复正文渲染。第二批仍无一次完整桌面/手机显示或commit/push。

- Cicero受影响补审已完成关闭：图59/172、图60/181均PASS，新增3图、累计11。
  旧FAIL/REVISE保留；两张spec/SVG原字节提升，只有metadata持久路径重绑。
  n12官方adapt-finalize exit0，随后21题答案prepare/按已审片段合并/finalize exit0，
  auto13/ungraded8，内置真实MathLive门禁包含8个exact候选并通过；
  不声明未另行保存的attempts/inputEvents明细。机械对象比较21/21与已审片段相同，
  只加根级ready/count。官方正文与书写题render exit0。
- fresh选择独审Arendt `01a1f6af-1851-7172-b684-162bf1f72f23`已完成关闭：
  n6全11源独解、12题/54选项及包内关系PASS，7张现代源预览各一次。
  checker with-review仅一次exit0，输入字节不变。其误执行一次只读git status
  已在交接中披露，没有git修改；不把它抹成“无git命令”。
  n6正式retain_choices exit0，choices-only render exit0（sourcePagesSkipped=true）。
- n12官方选择seed已备21源，只有纯定义prose[3]，排除worked examples；
  练习实图仅表/59/60三张。作者Kuhn `01a1f6b2-5840-72c0-8f68-efaad3cc69ca`
  先以0图冻结18非图源解和部分草稿；n6图审结束关闭后才授权三图续制。
  原seed及冻结稿不覆盖，不读标准答案或旧选择。当前选择仍未批准，
  三课统一离线显示检查尚未运行，第二批未commit/push。

- Kuhn完整作者任务已完成关闭：21源/23题（22single、1multiple）/71选项，
  实际三张现代练习图各一次，0新增图。两个独立作者源解冻结与初partial均未覆盖；
  完整产物文件名为`choices-n12/officialdraft.json`（原字节保留，不把局部稿当完整稿），
  文件sha256 `1bc3dcdf812552d080d71b567746ec7a4ec5696ff0f0b11149fcb73d199c0485`，
  official checker仅一次exit0，仍无语义批准。
- fresh唯一独审Goodall `01a1f6c1-0ee0-7762-9aac-574d939a34b2`
  正在`choices-n12-review/`按21源、三实图先独解，再view、71选项真值及最后键比较；
  计划三图各一次，不读标准答案或旧选择，不重审图稿，不并发预取。
  n6/n22已有选择PASS和render不重做；n12待独审及choices-only render，
  统一离线检查脚本尚未执行。第一批commit仍为8fcd8b3，第二批未提交。

### 第二批选择修正与显示接续

- 接续live Plane GET HTTP200；工单仍started、Finish review，离线边界未变。
  Goodall首审21源/23题/71选项，全部数学键一致，只有n12-178的三个选项共同
  给出正确商313/427导致task-fidelity/leakage REVISE；其它22题PASS。
  首稿officialdraft、首审officialreview、冻结源解/选项真值和首失败均未覆写。
- 只在可编辑draft副本去掉178三个选项的共同商，并同步一条limitations和coverage
  reason，共五字段；原式、key和其它题不改。同审者受影响核对PASS，0新图；
  repair validator恰一次exit0。修后canonical draft sha256
  `08f445bb405ced99b890017719f358734152d28b231e5dcc74b78df23553b7ea`，
  review字节sha256 `ae266a112146cc0988511b3b1c977dbceebaef31673230aea085c4a752ef7e07`。
  已收取关闭Goodall，正式retain及choices-only render均exit0。
  37份原字节文字证据保留到batch2持久evidence，无整包图片/运行时复制。
- 首次完整batch2 offline命令实际失败：前两项n6桌面text/exercises PASS后，
  choices中88的长度公式竖线被GFM表格分隔，单元格公式及后列缺失。
  原失败报告保留`.tmp/stemrobin-187/batch2/offline-check-first/report.json`；
  不把它当数学题稿FAIL，不重复已批准的数学/图审。
- 最小修复`choice_html.mjs`在表格词法分析前暂存完整数学片段、单元格渲染前
  原样恢复，普通非表格仍沿用inline。Context7已实际取得Marked源合同。
  原4项加新3项聚焦测试exit0，覆盖竖线、display math、标记碰撞、
  普通表格、非表格及HTML转义。n6/n12受影响choices-only render exit0；
  新目录offline-check-table-repair只续失败及未运行项，继承前两项PASS，
  原失败和截图不覆盖。当前续检查未收取，第二批仍未commit/push。
- 提交前origin fetch exit0，无pull/rebase/其它分支合并；
  63个本批新增JSON无disposable path依赖检查exit0，diff check exit0。
  这不替代全仓resource audit，继承的全仓失败仍保留，未声明最终review完成。

- 表格修复后续检实际再发现n12原168连续星号被粗体规则消费：
  `$72***$`/`$75***$`的公式annotation丢星。原失败报告和修复前HTML保留。
  共享htmlfrag及自包含render_lesson的两个独立路径均只暂存已渲染数学，
  处理正文粗体后原样恢复；公式及题稿不改。11项聚焦测试exit0；
  首次只修共享路径的预览续检仍FAIL原样保留，随后同因补齐预览路径。
  n12正文重新输出与已PASS正文同字节，不重检这一项。
- 最后续检所有19新项及5继承项均PASS，共24页面/视口组合：
  三课正文、原题、选择、内部答案，两宽度1440x960/390x844。
  全文/公式/选项/图/字号/scroll-end断言及截图齐全。原始书写题无输入、
  按钮或标准答案，选择页无私有键；内部答案预览不成为learner页面。
  该命令在browser.close等待未返回，不能记exit0：检查PID55705已无子进程，
  仅为该进程启用localhost Node inspector，从运行时取出唯一实际report对象，
  断言status=pass及19+5全部pass后原样保存，再仅SIGTERM该PID，实际exit143。
  PID退出已确认；无浏览器/内容检查重跑，无其它进程终止。
  live-report-before-close字节sha256
  `e1829e4cbc1f4ef8b1abdb7cb00221a40e2336c43bc15c1c26b81d7f0663f94e`。
  页面观察PASS与关闭执行限制分开保留在持久display证据；
  42份原字节文本证据已保留，无整包图片/运行时复制。
- Fresh Popper仅看n6正文/choices桌面手机首尾8张既有PNG，各一次，
  全部在可见范围PASS，已收取关闭。未声称逐像素检查长页中段或手机图右端；
  后者使用既有全量DOM/媒体/scroll-end断言。observation sha256
  `6ea2294e0c6ad276d4726db51212a592214214ba359928a508cf00ec5c8202f6`。
  Fresh Dalton单独接n12相同8图边界，当前唯一在途显示观察者。
  第二批仍未commit/push；最终三册review仍未完成。

- Dalton n12八图各一次、可见范围全部PASS，已收取关闭；observation sha256
  `833ab85d0198c1b13228e6854f11f3e6ea02ebc1f2a39b3c25e612331cdccd43`。
  Herschel n22八记录、五张不同PNG各一次，另外三项按同字节显式继承，
  可见范围全部PASS，已收取关闭；observation sha256
  `326b196ef2a8fecc79e89968e91f2d1b9f80e35e7805673d3b62ec94e51f8ffc`。
  三组父方均未复开整批图，不声明未显示中段的逐像素审查。
- 第二批已完成范围：4m n6/n12/n22，共34原题/34ready标准答案
  （18auto/16ungraded）、37选择/133选项、12现代图。
  45份原字节文本证据包括首choice REVISE、两类真实渲染失败、
  全量浏览器断言结果及exit143清理限制、三课显示观察。
  窄范围提交只含这三课、图28–34/57–60/表p0048、raw n6图题确定修复、
  两书索引、必要装订/渲染代码与聚焦测试、既有progress/evidence。
  n2图3–5、图1HOLD/图2FAIL和厚度候选、n19未完答案继续保留，不暂存。
  此为开发批次，不代表三册完成或全仓机械防线PASS；最终review尚未交付。
