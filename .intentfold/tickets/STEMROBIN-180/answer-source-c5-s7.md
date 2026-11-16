# phy6-c5-s7 独立 source-only 五题作者报告

## 范围与状态

仅作者 source-only 推导，不是正式答案键或独立审查结论。五道原题全部覆盖，完整推导5/5，遗漏0。第4题包含两幅完整ASCII杠杆示意及支点、力方向、力臂与力矩式。修复预算总1次，已用0；没有作者首FAIL，不制造PASS。待 main/非作者独立比较，未设自动判题、未准备或冻结 finalmodern keys。

自有根绝对路径：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/source-author-c5-s7`

最终交接 `author-handoff.json` 绑定 `source-solutions.json`、`source-inputs.json`、`source-manifest.json` 和本报告的实际SHA；manifest枚举全体自有文件。原题与冻结现代TEXT题面分别按精确UTF-8 text 字符串计算SHA，不包含额外包装或换行规范化，不冒称 finalmodern 答案绑定。

## 白名单与证据复用

完整读取 durable `phy6-c5-s7/lesson.json`、`lesson.md`、`exercises.json`，完整冻结现代lesson/exercises/figures模板及该TEXT作者handoff。使用用户最新明确的“批准冻结TEXT”授权；原TEXT作者handoff仍保留原 pending 字段，未改状态。

实际逐张查看完整原图189–194：189在前一上下文已完成，190–194在本次续接中各用 `functions.view_image` 打开一次。完整观察及每PNG SHA在 `figure-observations.authored.json`。这些仅是作答所需源上下文观察，不是另一次图独审；没有打开现代在途图或运行图门禁。没有重复源/TEXT审查、finalize、vectorize或测试。

源lesson SHA `1777b369eb13eefbf36a46187c293bd8a5b0f513cf50351e9f7b883d816d315a`。
源exercises SHA `fad2719cbf19cf3bcc0917cfe8ad4f05c2482de48f5221b877b92c3a86d934df`。
完整冻结现代lesson SHA `8e5866c05ee1f90093e3a5eb9a65a56f2ec385f84cec7048eac3e2d322e13de3`。
完整冻结现代exercises SHA `4fc556e571f5735a4b818df908d2ac6bc72a073ea4ad099062cc351634387709`。
figures模板 SHA `347b59e16e1a576661c1a2c5c368812242b5ce934fc4d3eeb683a6e88614c107`。

没有读取main私有answer-source、任何旧键、choices、interactions或答案历史。完整白名单原文件和快照身份在 `source-inputs.json`，不跨读额外源页像素。

## 模型

忽略绳索与滑轮自重及轴处摩擦，绳不可伸长，重物静止或匀速升降，同一理想绳索各处张力相等。单个动滑轮省一半力还要求课文所示两段竖直绳索承托。P为重物重力，F为施力端所需力，r是原文半径符号，不添数值。图190的O是轴心；图192的O是左侧接触处等效支点，图192轴心是A。两图不得混绑。

## 五题完整推导

1. **定义。** 提升时轴相对支承位置不变的是定滑轮；轴随重物升降的是动滑轮。定滑轮仍可绕轴旋转，“定”不等于轮不能转。原图190与191分别对应两种轴位置关系。覆盖原题1的两个问题。

2. **定滑轮目的。** 主要改变施力方向，让操作方便：图190向下拉右端能提升左端重物。以轴心O为支点，左右作用线竖直，OA=OB=r，P·r=F·r，故F=P，不能省力。P、F在轮上的两侧向下作用，不能把轮的受力箭头与重物运动方向混为一谈。

3. **动滑轮省力。** 图191所示理想装置由两段竖直绳索承托动滑轮，每段张力都是F。整体平衡2F=P，故所需拉力F=P/2；相对于直接提升P，省去P−F=P/2，即省一半力。结论限于该理想模型和绳索布置，不推广到任意穿绳、倾斜绳段或不可忽略自重摩擦的装置。

4. **两种杠杆示意。** 可以按本课理想模型等效。字母和箭头来自实际原图190、192；ASCII只属答案文字，不是新图稿。

```text
定滑轮：原图190
A-------O-------B
|       ^       |
v    support    v
P               F

OA = r; OB = r
P * OA = F * OB
F = P

动滑轮等效：原图192
                F
                ^
                |
O-------A-------B
^       |
pivot   v
        P

OA = r; AB = r; OB = 2r
P * OA = F * OB
F = P/2
```

第一图support表示固定轴心支点，A侧P向下、B侧F向下，两个力矩反向且力臂相同。第二图pivot只是等效支点符号，不是新增力；A处P向下、B处F向上。动力臂OB=2OA，故F=P/2。第二图不能把O错当轮心或把动滑轮轴心A画成固定轴。

5. **应用实例。** 图193吊装滑轮组：上方定滑轮改变施力方向，下方带负载滑轮随重物移动，操作者拉自由绳端提升重物。图194车载起重机：下方钩上的滑轮1为动滑轮，臂端2与后部3为课文所标定滑轮，用于组合起重。两例都来自本课实际原图及原文。题目开放，不设唯一例子集，不凭起重机外观猜省力倍率。

## 输入身份与边界

五题沿原source_number 1–5、group_id g1、栏目“问题”记录。原题1两个源行来源 `p0199#10`、`p0199#14`合属同题；其余依次 `p0200#1` 至 `p0200#4`。原exercise `figure_refs`空数组保持原样，另列作答观察所用的正文图，不伪造题目图归属。

现代题3、4新增的理想条件限定用于防止原句无条件泛化；源题原text、所有source.refs、身份和数据保持不变。实际现代图未纳入此阶段final answer evidence，后续如有finalmodern键委托必须另受明确通知约束。

## 实际命令与冻结

仅两条本地快照/hash绑定命令；不执行答案技能正式门禁。运行时实际argv、解释器路径、脚本SHA和完成时间写入 `commands/01-capture.json`、`commands/02-freeze.json`。

```text
/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/source-author-c5-s7/source-freeze.py capture
/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/source-author-c5-s7/source-freeze.py freeze
```

命令的进程exit与handoff/solutions/manifest/report实际SHA由终端返回值及交接输出报告，不用机械hash核对冒充物理内容独立PASS。保存后全部作者字节冻结，若以后需修订必须新候选且保留原freeze。

未改s11已冻结TEXT或source-only七题：s11 handoff SHA仍 `2dadf8908bf1cf9c5b73d62bb4cf392ac3d771e9cb1a7c5a77bed7a9dc51a323`。无浏览器、网络/Azure/model服务、DB、Git、app、工具、schema、canonical或其他作者路径写入；没有准备、retain、finalize、晋升和自审批。外部调用0，新服务费用0美元；模型token未取得独立计量，不虚报数值。完成后无在途session，停止。
