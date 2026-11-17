# STEMROBIN-180 batch52 / phy7-c1-s2-n100 FIRST 作者交接

状态：FIRST 结构校验通过，语义独审待父代理安排。未进行语义自审，未产生 review.json，不能据此宣称语义通过或可发布。

## 范围和先后顺序

- 仅处理 `7p/phy7-c1-s2-n100`，全部命令 cwd 为 `/Users/yong/.codex/worktrees/0f12/lemmadeck`。
- 先执行目标目录及报告的 `ls -ld`，退出1，两项均报告 `No such file or directory`；没有覆盖目标。
- 读取 AGENTS/router、readme、相关 charter、intentfold 路由、choice SKILL/authoring/contract、图片批次规则及现有准备、结构校验、记录工具。未启动新的 IntentFold 能力或流程。
- 输入只由现有 prepare 的白名单投影取得本课持久现代书写题与概念；工具按契约读取书籍单课索引、lesson.json、exercises.json、figures.json 并计算源哈希。未读取答案、SOURCE 解、旧选择题、交互、测试或其他课输出。
- inspect 后显式 prepare 四原题与概念段，再手写独立源解并取得冻结文件哈希，随后才手写 draft 和选项。
- 原分支未由本作者改变，未执行任何 Git 命令，也未回退任何已有改动。
- 未使用 modelservice、DB、publish、backend、app、依赖安装、globalchecks 或 newpipeline。

## 产物和哈希

作者产物目录：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/choices/phy7-c1-s2-n100/`

| 产物 | 路径 | SHA-256 |
| --- | --- | --- |
| seed | [seed.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/choices/phy7-c1-s2-n100/seed.json) | canonical `0f89f9e6644c5169f345c30536bbda57a9179b0529a9b94fad4a66d4cfbb64d2` |
| draft | [draft.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/choices/phy7-c1-s2-n100/draft.json) | canonical `8661af467f0b8f23e0dcf8951414087b8119c9463bcab7b7224126278eb59158` |
| 冻结独立源解 | [source-solutions.md](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/choices/phy7-c1-s2-n100/source-solutions.md) | 文件字节 `3218260490d21e925c42f1a14d4131c0139228ca51abefb4e69923d33204e7a2` |

seed 文件字节 SHA-256：`baea100e04f6417813cdbe7105b8c61c7fff390869a3e8494777d1027636fcf4`

draft 文件字节 SHA-256：`ce82644aa3b70d5ef39b667ac26df591a7223a78bee4f1fc7c4a1bd22f4b5fcd`

源解在选项构造前后所得文件字节哈希一致。seed/draft 的 canonical 摘要依既有 prepare digest 契约；不与文件字节摘要混用。

## 选种和图片

- 原题1、2、3、4的书写全文全部保留，未删除或修改原书题。
- 显式概念段：1、2、3、5。它们是微粒排列与相互作用、熔化期间吸热与内能近似、熔解热定义及单位，不包含已解数值示例。
- 不选段0原图229叙述、段8冰的数值示例及段9、10示例推论，也不选无关符号读音段。
- 四原题的结构 `figure_ids` 均为空。原图229仅为 prose 引用，未制造 slot 或本课嵌图。
- 本课持久 figures 已有 `tbl-p0261-01`；定义和单位任务无需查物质数值，因此 `concept_figure_ids=[]`，不为填覆盖强行使用表261。
- seed 图数0，新图数0；本作者实际图片加载0、重开0，本批加载0，当前作者上下文累计0，未向父代理返回图片。

## FIRST 命令与真实结果

以下均仅执行一次；既有 `record-step.mjs` 使用唯一标签。它按自身固定规则将9个证据文件写入共享 `tmp/commands/`，这是用户明确指定的记录行为；作者产物只写本课目录和本报告。

```sh
node .intentfold/tickets/STEMROBIN-180/tmp/record-step.mjs b52-phy7-c1-s2-n100-first-inspect python3 .agents/skills/ld-s10y-choice/scripts/prepare.py inspect --repo . --book 7p --lesson phy7-c1-s2-n100
node .intentfold/tickets/STEMROBIN-180/tmp/record-step.mjs b52-phy7-c1-s2-n100-first-prepare python3 .agents/skills/ld-s10y-choice/scripts/prepare.py prepare --repo . --book 7p --lesson phy7-c1-s2-n100 --exercise 1 --exercise 2 --exercise 3 --exercise 4 --concept-block 1 --concept-block 2 --concept-block 3 --concept-block 5 --out .intentfold/tickets/STEMROBIN-180/tmp/choices/phy7-c1-s2-n100/seed.json
PYTHONDONTWRITEBYTECODE=1 node .intentfold/tickets/STEMROBIN-180/tmp/record-step.mjs b52-phy7-c1-s2-n100-first-structural-validate python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/choices/phy7-c1-s2-n100/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/choices/phy7-c1-s2-n100/draft.json
```

| 步骤 | 退出码 | 真实结果 |
| --- | --- | --- |
| FIRST inspect | 0 | 返回4道原题、概念候选段0至10、表261标识；四题图引用为空 |
| FIRST prepare | 0 | `prepared 4 written seeds; no questions generated`，随后打印上述 seed canonical SHA-256 |
| FIRST structural validate | 0 | `mechanical checks passed; semantic review still required` |

三次 stderr 均为0字节，signal 均为 null。校验未传 `--review`，未运行第二次 validate。

证据前缀目录：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/`

| 唯一标签 | `.call.json` 文件 SHA-256 | `.stdout` SHA-256 |
| --- | --- | --- |
| `b52-phy7-c1-s2-n100-first-inspect` | `fc7d7eaad726784fb183fe10429932a59c0729e9636d1fc7353e0dff64422d38` | `57bce74c94713203c35c17fce8ae63d35868b5a6145e5b14d242ba82d417c38d` |
| `b52-phy7-c1-s2-n100-first-prepare` | `f2ccfd2c3f8899132cde733876dc22ed8e4981bcb0334cff40a908bf624223ff` | `21e5c96d788f6862ba56ea4ea0404d188ed0172e90bb77017985d2ce68644fcc` |
| `b52-phy7-c1-s2-n100-first-structural-validate` | `cf4e2c325c1603f8fc8f81279bdd1b80371f1116d3c39fdd257c453d2c86d84f` | `1c46f6519fd9f330b0c6109ab08c85474ff02f961f0fb5eb11550590e646f90b` |

每个标签都有 `.stdout`、`.stderr`、`.call.json`；空 stderr SHA-256 均为 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`。

## 题数和覆盖

合计4题、18选项：2单选、2多选。题数来自四个独立物理任务，不是按原题槽数或图数设配额。

| 原题 | 草稿题 | 模式 | 选项数 | 作者正确项数 | 任务与能力损失 |
| --- | --- | --- | --- | --- | --- |
| 1 | `n100-q1` | single | 4 | 1 | 完整熔化恒温解释；不证明独立写出微观因果说明或主动扩充全部熔化后的阶段边界 |
| 2 | `n100-q2` | multiple | 5 | 2 | 燃料能量去向与热损失辨别；不证明无提示列出和组织完整能量追踪说明，明确限定恒压纯晶体固液共存及对外做功近似 |
| 3 | `n100-q3` | single | 4 | 1 | 完整过程定义；不证明主动写全所有定义条件 |
| 4 | `n100-q4` | multiple | 5 | 3 | 本课三种单位集合及量纲辨别；不证明无候选项时主动列全单位 |

所有选定原题均有题目覆盖，没有整题递延。表达生产能力损失已具体写入每题 `limitations` 与每原题 `coverage.omitted_tasks`。没有将选择识别等同于独立书写。

能量去向不虚构能量数值、比例或效率；不把燃料释放总能量当作晶体吸热；不将传给容器与环境的“损失”写成能量消失。没有查表、数值计算或单位换算任务，故不存在靠表261填充的额外问题。

## 修复与下一步

FIRST 结构失败0次，最小修复0/1，重跑0次。无原失败可记录；未修改校验后的草稿。

父代理可用上列 seed/draft canonical 哈希与冻结源解文件哈希安排独立语义审查。独审先从 seed 和原题独立解答，不要先把作者冻结源解或正确集合当作判题权威。作者在此停止，不语义自审、不发布、不宣称最终批准。

## 唯一受影响修复

FIRST独审数学18项均PASS，但q1-B与q2-A重复评分同一内能结论，
reviewed validate退出3的首次拒绝完整保留。父代理在原draft/review/
pure-view精确冻结为`*.FIRST.json`后，仅对q1/q2这一个相联任务单元
作一次修复：合并成同一供热过程的天然多选，删除重复q2-A，其他八项
原文字和判断不变，仅将q2-B/C/D/E重标E/F/G/H。正确集合为B/F。
合并题完整保留微观恒温解释和燃料总能量的多种去向，不插入数据或答案提示。

现为3题17项，四原题全文不变；q3/q4及其意图和键深度相等，
原源解和原拒绝不改。修复用量1/1，remaining0；仅等待SAME审者对
新的相联题与相邻包关系复核，不重解四源、不重审未变q3/q4。
修复投影与差异观察在`batch52-n100-choice-sole-repair-projection`，
未再运行独立结构门禁。此前四题18项为FIRST历史状态。
