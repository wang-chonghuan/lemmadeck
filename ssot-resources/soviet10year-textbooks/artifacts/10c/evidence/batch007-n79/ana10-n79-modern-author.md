# n79现代文字作者交接

身份：STEMROBIN-184 worker B、本课现代TEXT作者，非独立批准者。当前两个template为完整作者DRAFT；一次只读文字契约检查实际exit1，三处数字分题标签触发非公式数字检查，不能称为全门禁PASS。未自行修工具、回换标号、填numeric_changes或finalize。

## 允许输入及顺序

先读取完整忠实n79课文/46–51原题及其官方source快照，再编辑两个template。未读取母方源/math冻结报告、答案、choices或其他作者材料；未重开原扫描、裁图或做新图审。

- 原lesson：`ssot-resources/soviet10year-textbooks/artifacts/10c/lessons/ana10-c6-s2-n79/lesson.json`，SHA256 `6ec5e4c8c85243e88f1c28d6f66ffe9cdf37d0f7c4d1247224fbf31bc0076cf5`。
- 原exercises：同目录 `exercises.json`，SHA256 `ce3f1239a506e5bf744ce09a2187dcc85a297c49963697e2264ee9a6ff1fde27`。
- 当前lesson技能此前本轮已全文读取；本任务另直接读 `references/edition-text-contract.md`、`profiles/modern-us-neutral.json`、实际edition.py文字/布局/勘误契约及官方prose_flow.mjs。
- 官方prepare已经由母方完成；本作者没有prepare或刷新源绑定。初始两份模板在编辑前完整保存，非仅记录hash。

## 完整覆盖

正文27对象不增不减：16个p、6个fig占位、5个cap。所有source_text、source_refs、kind/id/label/printed_page、source.data、source.path/sha256、课程身份及figure数组保留。

|正文对象，0-based|保留内容及本次文字处理|
|---|---|
|0|二阶导函数的定义、完整f/f'/f''及“两撇”读法，保留例式引导|
|1|全部四条sin/cos一阶及二阶导数原式，逐公式分行，未改数学|
|2|一阶为变化速度，二阶为该速度的变化速度|
|3|整个开区间]a,b[上导函数存在、各自同一正号/负号，四种组合；保留右三角印记|
|4|f'>0/f''>0、函数上升、导函数上升、加速上升及图5|
|5–8|图5、图6及两caption原对象完整不动|
|9|f'>0/f''<0、减速上升及图6|
|10|f'<0/f''>0、下降、负变化速度增大/绝对值减小、减速下降及图7，短段落完整承接|
|11–14|图7、图8及两caption原对象完整不动|
|15|f'<0/f''<0、加速下降及图8|
|16|四种情况与图5/7、6/8归组；保留正二阶时切线上方、负二阶时切线下方；显式“向下凸=切线上方、向上凸=切线下方”，在切点除外，不逆转源命名|
|17|一般给定区间内凸性仅取决于二阶符号，与一阶符号无关；I上的正/负两分支完整|
|18|余弦书源例题两个完整开区间，函数cos|
|19–20|符号表引导及tbl-p0021-01整个表图占位保留；没有重制或假定表像素已通过现代图门禁|
|21|由表得前区间加速下降/情形4，后区间减速下降/情形3|
|22|原“注”完整：x=pi/2加速转减速、点(pi/2,0)为拐点、图9|
|23|原切线方程y=pi/2-x完整|
|24|切点左侧切线上方、右侧切线下方，保留左三角印记|
|25–26|图9和caption原占位完整不动|

原绑定的27对象中没有独立`foot note`对象，本作者未凭页外材料添加或删除脚注；已有原“注”、两方向三角及每题星号完整保留。

六道任务身份、数量、group/group_id、pages、空figure_refs/figures全部不动；全部题头仍为原数学星号形式`$46^{*}$`至`$51^{*}$`。自然语言与标点放在数学区外，source_text与原source快照不改。

|原题|任务和边界保留|
|---|---|
|46|一阶、二阶导数共同讨论sin；]-pi,-pi/2[及]-pi/2,pi/2[两个区间都保留|
|47|tg三整个区间]-pi/2,0[、]0,pi/2[、]-pi/2,pi/2[完整；未把跨0的第三问删掉或改成仅两侧|
|48|sin在x=0、x=pi的两切线方程及两点拐点理由|
|49|tg在x=0、x=-pi的两切线方程、作图、拐点说明全保留；这是生产图任务，不是缺失输入图|
|50|原f/g两函数、求二阶导数和整体证明全保留；两个编号各独占行，证明在独立段，不误吞进第二分题；只有注册区间修正|
|51|原三次函数、求二阶导数、]-infty,1[向上凸与]1,infty[向下凸两证明域完整|

本次将46/47/50原Cyrillic分题按授权数字自然顺序写为1)/2)、1)/2)/3)、1)/2)，各行独立。没有新增题号、数学给定数值或答案，没有把源数学改写成新结论。当前门禁对这三组编号存在下述真实FAIL，未利用numeric_changes规避。

## 唯一数学修正

官方复制的erratum完整绑定保留，仅填写corrected并改目标练习50的相应唯一公式：

```json
{
  "id": "p0022-ex50-full-real-interval",
  "target": "exercises[4]",
  "source": {
    "page": 22,
    "printed_page": 16,
    "block": "p0022#6",
    "sha256": "58bd337ac06e13b0b9e29c9325b64d5d8d63fa731835ede82b9e34a783a31f47",
    "pdf_sha256": "47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40"
  },
  "original": "$]\\infty,\\infty[$",
  "corrected": "$]-\\infty,\\infty[$"
}
```

reason与官方prepare完整原值逐字不变，未删reason或source字段。目标exercise50的changes为wording/layout/math-correction，其他目标无math-correction，全部numeric_changes=[]。只修改现代template，不修改源题/页、索引、source wrapper或勘误绑定。

## 实际分界锚点

运行官方：

```text
node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs .tmp/ld-s10y-lesson/adapt/10c/modern-us-neutral/lessons/ana10-c6-s2-n79/lesson.template.json
```

先实际观察文字流，再读取内存`normalize_lesson_layout`输出的三处段落布局，手动apply_patch照该输出整理第三符号情况、凸性说明、三角结尾，再运行上述工具取得最终相邻boundary。复制其实际before/after至section_breaks；没有从prose object计数推整数。一次最终只读契约实际解析到18文字段落，三个锚点resolvedBreaks为3、9、12：

- 变化速度解释之后 -> 四种符号组合的整体假设。
- 情形4之后 -> 图象相对切线位置及源用语定义。
- 一般凸性符号规则之后 -> 余弦完整例题。

公式例示不从定义中分隔，四种情况内部不加概念分界；例题的表、结论、拐点及切线说明连续。

## 一次只读契约的真实结果

没有调用adapt-finalize/validate_lesson（后者会要求图资产）。实际用既有`.venv/bin/python`静态导入edition.py，调用其真实`validate_source`、`validate_errata`、`validate_identity_fields`、`validate_text`、`validate_numbered_subpart_layout`、`normalize_lesson_layout`（仅deepcopy）及`prose_flow_contract`。读取仅本课两template、本课两faithful JSON、modern profile及本作者完整初稿；权威errata由现有官方helper核验。此check未写文件、未替代独立语义审查，整套只运行一次。

标准输出完整为：

```json
{
  "check": "n79 read-only source/text/protected-fields/errata/layout",
  "prose_objects": 27,
  "written_tasks": 6,
  "figure_placeholders": 6,
  "source_wrappers_equal_initial": true,
  "errata_corrections": {
    "exercises[4]": [
      {
        "original": "$]\\infty,\\infty[$",
        "corrected": "$]-\\infty,\\infty[$"
      }
    ]
  },
  "resolved_breaks": [
    3,
    9,
    12
  ],
  "errors": [
    "exercises[0] 的非公式数字变化未被准确声明: want=[], got=['1', '2']",
    "exercises[1] 的非公式数字变化未被准确声明: want=[], got=['1', '2', '3']",
    "exercises[4] 的非公式数字变化未被准确声明: want=[], got=['1', '2']"
  ]
}
```

真实exit1，没有重跑。现有`number_signature`收集数学区以外所有数字；原Cyrillic标号没有数字，数字1)/2)/3)会进入该列表。由实际三个错误可定位冲突为编号转换的契约计数，而非数学公式、给定量或源绑定变化。本作者不宣告这三项已PASS，不自行去掉数字、填伪造numeric_changes或修改helper；等待母方决定当前规则下允许的最小处理。若后续改稿，须先保留此FAIL完整字节。

## 精确变更与字节快照

与编辑前完整template深等比较：

- lesson顶层仅prose、section_breaks、errata不同。16个p仅text/changes不同；6个fig和5个cap逐对象深等完全未动。
- exercises顶层仅exercises不同；6题各只改text/lines/changes；lines等于text.splitlines()。
- errata仅corrected从空串变成全实数区间，其他字段包括reason完全相同。
- source_text、全部来源refs/pages、两source wrapper/data/hash、数学式（除注册目标）、课程/题目身份及图对象均通过一次只读契约而无错误。
- 没有改figures.template.json，未打开其内部spec或创建context/render；仅交接时计算当前文件hash。

当前可交付template：

|文件|SHA256|
|---|---|
|lesson.template.json|`f524ad010824e99b00118d124b150e0d8e9aa1eeff5999ee27fd74c63c6682cf`|
|exercises.template.json|`ebbb3284a5948d6c943eb9c16f482f498e97e531a43d820ab5cf60f5102b5cbd`|
|未修改的figures.template.json|`95f2ec1df6cd42810292f57e1a50a9703dea5396c84b3eafbc8db599b1799159`|

编辑前原模板完整快照：`.intentfold/tickets/STEMROBIN-184/tmp/ana10-n79-modern-initial/`：

- lesson.template.json SHA256 `1ed5d1afafc21f789680019d91456ad3e38d5c953d37f0f5f8ef094dce553cac`。
- exercises.template.json SHA256 `3c18228da8f46b3ba6a2fdf9d486d5df5f2aab9c0febe282d466062091f04d12`。

首次实际contractFAIL完整快照：`.intentfold/tickets/STEMROBIN-184/tmp/ana10-n79-modern-first-contract-fail/`；两文件与当前template原字节相同，SHA分别为`f524ad01...682cf`及`ebbb3284...b5cbd`（完整值见当前表）。不是只记录hash替代原稿。

绝对模板目录：`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/adapt/10c/modern-us-neutral/lessons/ana10-c6-s2-n79/`。

绝对证据/报告根：`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/`。

## 限制与停止

作者文字已完整制作，但数字标号契约FAIL未处理，六个现代图资产仍是另一流程占位，本包不称完整审批PASS。原source中的注/三角/星号与所有任务保留，不新增标准答案、交互或图形。

没有改source/index/book/7–22页或27–30源稿，没有prepare、finalize、assemble、adapt-finalize、render、spec/context、现代持久JSON、工具改动、Git/stage、DB/env/install/network或其他chat动作。仅两文字template及本单报告/完整保存快照。停止等待母方独立文本审查与门禁决定。
