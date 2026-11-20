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
