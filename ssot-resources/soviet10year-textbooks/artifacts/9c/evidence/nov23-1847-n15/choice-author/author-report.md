# STEMROBIN-184 N15 离线作者报告

日期：2026-11-23。
唯一工作目录：`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`。
状态：草稿已交付；结构检查成功；独立语义评审仍待进行。没有语义自评通过结论。

## 输入与顺序

直接阅读范围限定为 `.agents/skills/ld-s10y-choice/SKILL.md`、其 `references/authoring.md`、`references/contract.md`，以及已准备的
`.tmp/stemrobin-184-six/n15-nov23-recovery/choices/seed.json`。
数学输入为全部书面源题 118–125 和明确选定的定义块 1、2、3、5、8、15、16；无图。
先独立解完全部源题并写入 `source-solutions.md`，再按数学推理手工写 `draft.json`，最后手工写严格的 id/view 学习者投影。
内部算术检查使用标准库精确分数与十进制算术核对端点、乘法和平方；它不是独立语义评审。

没有读取答案、source-math/modern 评审、旧选择题、交互、测试或票据输出、带快照的完整现代 JSON 或线程历史。
结构检查器按自身契约复核 seed 的源快照，此过程没有被用来读取或推断答案与候选。
没有使用 Git、DB、环境配置、应用、依赖安装、网络、浏览器、模型服务、其他代理或发布器。
零模型图片，零新增图片，`new_figures=[]`。
只新增以下四个在写入前均不存在的作者输出；未修改 seed、已有脏文件或他人文件。

## 产物

目录：
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n15-nov23-recovery/choices/`

- `source-solutions.md`：完整独立源题解答，内部。
- `draft.json`：题目、覆盖、源解答、误解推导及正确集合，内部。
- `learner-views.json`：仅顶层 `questions`，每题仅 `id` 与 `view`；没有 source、intent、solution、misconception 或 key 字段。
- `author-report.md`：本报告，内部。

## 数量与响应单位

总计 8 题、34 个选项：7 道原生单选、1 道原生多选。
数量来自完整数学响应单位，不是按题号空格、单元格或点击配额生成。

| 源题 | 本地题目 id | 模式 | 选项数 | 响应单位 |
| --- | --- | --- | --- | --- |
| 118 | `n15-bounds-proof` | single | 3 | 完整上下界证明 |
| 119 | `n15-tenths-table` | single | 4 | 四数的完整十分位近似表 |
| 120 | `n15-nested-prefix` | single | 4 | 四位截取及完整位值依据 |
| 121 | `n15-characteristic-profiles` | multiple | 8 | 每数三对近似值、整数部分、三位尾数的完整资料 |
| 122 | `n15-sum-prefix` | single | 4 | 和的五位前缀与保证区间 |
| 123 | `n15-product-prefix` | single | 4 | 积的两位前缀与保证区间 |
| 124 | `n15-four-significant-sums` | single | 4 | 两项和的四位有效数字完整结果对 |
| 125 | `n15-actual-product-digits` | single | 3 | 两项实际积的三位截取完整结果对 |

第 121 题不规定应选数量、不用组合编码，也不拆分为单格正误。
第 124 题保留最近舍入、四位有效数字与末尾零。
第 125 题明确求真实数字而非舍入值；内部解答控制真实积区间。
学习者文本为中文；内部投影检查确认数学分隔符平衡，中文逗号、分号、顿号和句号均在数学区域外。

## 结构检查

只运行一次如下指定命令，没有 `--review`，没有再次结构运行或以自评替代独立评审：

```bash
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .tmp/stemrobin-184-six/n15-nov23-recovery/choices/seed.json --draft .tmp/stemrobin-184-six/n15-nov23-recovery/choices/draft.json
```

运行 cwd：
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`

退出码：`0`。
原样输出：

```text
mechanical checks passed; semantic review still required
```

内部投影/摘要检查另行确认：

```text
projection: exact id/view-only match; no source, intent, solution, misconception, or key fields
math delimiters: balanced; Chinese separators outside math
items: 8 options: 34 modes: {'single': 7, 'multiple': 1}
registered new figures: 0
semantic review: not performed
```

结构成功只表示机械契约与输入快照检查成功，不是数学正确性、题意忠实度、干扰项质量、冗余或答案泄漏的语义证明。
结构检查后没有修改 draft 或 learner views。

## 快照绑定

下列 JSON 摘要使用契约规定的规范化 SHA-256；源题解答摘要为实际 UTF-8 文件字节的 SHA-256。

- Seed：`0e52f8bbc8c61a52456c10e917b668e3e67abe7fd644f7747dc2a987126da899`
- Draft：`06e3c6b71bc1061938df127e7b0ea9e907d1059a440aae76bb3110e374f25478`
- Learner views：`d652018fabb947c130e41ce535f746122b797e5a2b62a96be26cab9ecf2fcd2d`
- Source solutions 字节：`8f7a43473f54324bdae59b16651af494ab84bf3ac272a4265ba13f720b3bfce3`

## 覆盖与诚实损失

全部八个源题均有覆盖条目，无未解约定、未读图或被隐藏的求值分支。
第 121 题涵盖四数的全部十二对近似值及四组三位尾数。
但选择反应不是书面生产的同等证明：

- 完整证明、整表和整份资料只能识别，不能据此声称独立推导、运算、长除法或规范书写已通过。
- 整体候选可以因单处错误被排除，无法确保候选全部字段、或一组中每个积与和，都由学习者独立计算。
- 第 120 题末区间自身显示前缀，虽加入位值依据判断，仍可能利用端点外观作答。
- 第 121 题使用等价的负整数加非负尾数记法，没有验证横线特征小数的符号生产。
- 第 122、123 题将保证区间作为完整可见判断，保留尾数误差任务，但不验证学习者自行构造区间或选择最小额外精度。
- 第 124 题正确格式保留 `3.650`，识别该格式不等于亲自输出末尾零。
- 第 125 题两个真实积的三位最近舍入值恰与截取值相同，选对结果不能诊断最终是否用了舍入；没有为此伪造错误的最近舍入数字。

具体损失保留在每题 `intent.limitations` 与逐源 `coverage.omitted_tasks` 中。
未创建 review 文件，未做语义自评通过宣告；后续独立评审仍需审查题意、响应单位、误解推导、数学、等价性与泄漏。
本次停止于离线作者交付，不发布、不集成、不改写已有产物。
