# SOURCE248249 FIRST 独立审查

Reviewer: Codex SOURCE248249 independent reviewer. Author: Wegener.
本审查者未参与这两页的转写或修复；本次为两页唯一一次完整 FIRST。

## 结论

248 REVISE，249 REVISE；整批 FAIL，批准集合为空。
两页既有机械检查均通过，但各有一处原文保真缺陷，不能以机械成功代替 source PASS。
作者两页预算各 0/1，本审查不消耗修复预算，不修作者、不重跑、不覆盖失败结论。

| 物理页 / 印刷页 | 块数 | 独立原印刷行 / MD / JSON / audit | 题块 | 原图 | FIRST |
| --- | ---: | --- | ---: | ---: | --- |
| 248 / 237 | 15 | 23 / 23 / 23 / 23 | 8 | 0 | REVISE F248-1 |
| 249 / 238 | 10 | 26 / 26 / 26 / 26 | 0 | 0 | REVISE F249-1 |
| 合计 | 25 | 49 / 49 / 49 / 49 | 8 | 0 | FAIL |

## 全部必要 Finding

### F248-1: Q 后的原句点误写为逗号

位置：`p0248#2` 第 2 印刷行；冻结 MD 第 44 行；
JSON `blocks[1].lines[1]`。

候选：`**$Q$，需将被燃烧的燃料的质量乘以该种燃料的燃烧值：**`
原 full original 的该行在 Q 之后印的是圆点句点，不是逗号；
应忠实保留为 `$Q$.`，而不是 `$Q$，`。这里不修改原书的语法或公式，
不是把下一行 `$Q=qm$，` 的真实逗号改成句点。
允许差异仅此标点及 MD/JSON 的对应传播；本审查未实施差异。

完整原像素证据：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-7p-248249-first/inputs/pages/0248/page.png`
SHA256 `e1a3b2bb8bf4734b07682396b4e2ce4505722b22999fc368419d0e975ba9520b`。
没有为此打开或生成 grid、crop、reopen。

### F249-1: 粗体提前结束，遗漏“的发现”

位置：`p0249#7` 第 2 印刷行；冻结 MD 第 70 行；
JSON `blocks[6].lines[1]`。

候选：`**与转化定律**的发现.`
原 full original 的第二行“与转化定律的发现”全部为粗体，
不是仅“与转化定律”粗体。缺失的精确文本强调范围为“的发现”三字。
文字本身和末句点都已保存，不需要改写；应将三个字纳入当前粗体范围，
保持句点原样。前一行“观察和实验导致了物理学的基本定律之一”仍是普通字体，
不因此整段加粗。
允许差异仅此强调范围及 MD/JSON 的对应传播；本审查未实施差异。

完整原像素证据：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-7p-248249-first/inputs/pages/0249/page.png`
SHA256 `b32a1dbab31f25490d0a28795db1e5e7858bf1f74879a782e155118ca06fb1eb`。
没有为此打开或生成 grid、crop、reopen。

## 一次完整逐页覆盖

完整原 PNG 各单独实际打开一次，随后未重新加载图像。逐字对照全 MD/JSON，
覆盖全部文字、标点、公式、符号、数字、单位、强调、块头、题号、行数和页脚。
逐块结果保存在 `review.json`；不是仅定位两个 finding 的抽样检查。

248 的逐块独立源行数为：
`2,4,1,1,1,2,1,1,2,2,1,1,1,2,1`。

- `#1 cont` 的千卡/千克准确接 247 的 `3400`；1 千克泥炭、
  完全燃烧、`1.4×10^7` 焦耳及 3400 千卡均保留。
- `#2` 两行粗体计算规则及 Q、m 的字形含义保留；唯一例外是 F248-1。
  下一行 `Q=qm`、逗号以及 `q` 后的双破折号和燃烧值解释均准确，
  没有为这些普通公式/说明额外加粗。
- `#3–#7` “问题”与四道题完整，第二题量度单位、第三题两种分式单位及
  指数 7、第四题原请求均无删节，没有加入答案。
- `#8–#12` “练习47”与四道题完整：第236页表引用、石油、10500 及配单位请求；
  干木柴和褐煤、完全相同条件及理由请求；15 千克木炭和 200 克酒精；
  2 升煤油。保留两个栏目各自 1–4 的印刷编号，不装订或自行赋跨栏目新身份。
- `#13` 原 95 标题全文与 TOC 对应；`#14 open` 保留 §82、
  势能向动能转化及末尾“铅球”；`#15` 实际双圆点页脚 `·237·`。
  本页无脚注或插图，没有把高分式的分子/分母另计成正文行。

249 的逐块独立源行数为：`2,5,2,5,1,2,2,2,4,1`。

- `#1 cont` 接“铅球”，保留铅板、本身及铅板的内能、汽车和拖拉机例子。
- `#2` 保留水轮机叶轮、风力发动机风翼、热传递、
  燃着的炉子和室内空气的全部句子；`#3` 原提问完整。
- `#4` 实际原书印的是 `第234页` 和 `第421页`，不是擅自纠正后的页号。
  冷、热水混合、放出与得到等量内能、量值不变五行完整。
  `#5` 原“这一结论不仅只适用于内能的情况”完整。
- `#6` “明，”前后强调边界及整个能量转换量值不变陈述准确；
  `#7` 前述普通字体与“能量守恒”起点准确，但末尾有 F249-1。
- `#8` 原“这个定律是说，”普通，随后两行能量既不能消灭也不能创造、
  形式转换或物体间传递的粗体文字范围准确，未加现代解释。
- `#9 open` 保留全部四行、两处分号、太阳能来源、“放射火箭”的原措辞。
  尾部准确为“量；室内空气的温度升高了，即其内能增加了，是因为它由炉”；
  仍未闭合。`#10` 实际双圆点页脚 `·238·`。
  本页无新题、无数学公式、无脚注或插图。

247 只读 MD 文本用于 continuation，不打开 247 像素，不审查或批准 247 全页/表。
248 `p0248#14 open` 与 249 `p0249#1 cont` 对接正确；
249 `p0249#9 open` 不补 250 内容，不冒称 n95 或任何完整课已闭合。

## 冻结与当前绑定

开始时作者根没有 final `author-handoff.json`、`source-manifest.json` 或
`call-ledger.json`，尽管作者报告已经叙述 Frozen Evidence。
按本次明确授权，于 `2026-11-16T10:59:21.807Z` 独立复制当前两页输入、
六次成功调用的记录/开始记录/streams、247 MD 和作者报告，共 38 文件。
这是 reviewer-owned 当前输入冻结，不伪称作者已经冻结，也不修改作者根。
`inputs-manifest.json` 是图像加载前写出的固定清单。

共同 6-7p PDF 实际 23802196 字节，SHA256
`46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`，
与 source manifest、两页元数据一致；7p 为 `lesson-group`。
物理 248/249 对应印刷 237/238；TOC 的 n94 始于印刷235，
n95 始于印刷237。本次仅对 PDF 字节做哈希，不渲染 PDF、不打开其它源页。

全 25 块的 MD/JSON 块体、类型、编号、open/cont/samerow 与元数据表示相等。
当前 MD/JSON/audit/layout/full PNG 与既有 finalize/vectorize 输出的
30 项对应比较均相等。历史 62 项文件字节/hash 核对无不符；
10 项 grid 二进制绑定明确不读、不复制、不加载。
38 项冻结原路径的当前绑定无漂移；最终检查写入 `current-bindings.json`。
历史 tool-before/tool-after 各保留在调用记录中，不强行匹配今天的工具 epoch。

每页既有 prepare/finalize/vectorize 各一次 exit0；六次均复用。
vectorize 的原记录为 0 图通过 / 0 图超限，不伪称审了 SVG。
两页现存 audit 的 errors、normalizations、unknown_chars、katex_warnings 均为空，
errata 均 0。以上机械成功不取消本次两项语义 FAIL。

## 边界和计数

- 实际图片加载 2：248 full original 1 次，249 full original 1 次。
  grid 0、crop 0、reopen 0、247/其它页像素 0；本批 2/8，本上下文 2/24。
- reviewer 修复 0；新增 prepare/finalize/vectorize/native/render/gate 0；
  assemble/promote/canonical/source index/tools/app/deps/DB/Git 改动均 0。
- 浏览器未打开，task-owned 浏览器剩余 0；不关闭他人的浏览器或回滚他人。
  没有启动服务、后台执行会话或继续执行的作业。
- noexec 偏离须如实记录：入口误用 `exec_command` 执行了一次只读 `pwd`，
  exit0；随后未再调用 shell/exec，也未启动任何管线、门禁或外部子进程。
- 239、242 的永久缺口不跨越、不批准、不装订；原有作者失败、修复历史、
  其它 agent 产物和分支均不改动。当前 branch 仅按用户说明及 ticket.json 记录，
  没有运行 Git 来宣称新验证。
- noexec 下没有运行 n-plane 的唯一 shell helper，所以不伪称已 live 读取后端工单；
  本次执行的是用户明确指定的 source FIRST，不执行 IntentFold 开发/交付能力。

Own root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-7p-248249-first`

交接文件：`review.json`、`inputs-manifest.json`、`provenance-bindings.json`、
`historical-bindings.json`、`current-bindings.json`、`reviewer-handoff.json`。
handoff 绑定本报告和所有记录的实际 path/bytes/SHA，批准页数为 0。
本次 FIRST 停在 REVISE；没有自行修作者或启动第二次审查。
