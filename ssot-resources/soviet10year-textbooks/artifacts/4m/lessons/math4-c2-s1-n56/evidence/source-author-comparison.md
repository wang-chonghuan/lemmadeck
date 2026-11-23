# N56 source / author / modern-text comparison

## Scope and immutable baseline

- Date: 2026-11-23. Ticket: STEMROBIN-187; lesson: math4-c2-s1-n56.
- 唯一根目录及所有命令的显式 workdir：`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`。
- 本次为获授权后的首次作者/候选文本对照，不再声称未读作者文本；独立 SOURCE、独立求解及原图 inventory 则保持其先于本次对照的独立性和原字节。
- 只读取已冻三报告、raw N56 `lesson.json` / `exercises.json`、0208–0210 的 `page.md` / `audit.json`、`evidence/author-solutions.md`，及指定目录内三个 `*.template.json`。
- 只新写本文；不修改旧报告、页转录、raw 文件、作者稿、template、现代 spec 或图。
- 本次新增 image=0，累计实际 image=6/24；没有开图、crop、截图或浏览器。没有 env/DB、APP、付费、安装、Git、其他聊天或 spawn。
- 本文结论限定于下列哈希绑定的文本，不覆盖之后的候选改动、图像渲染、choice/answer 发布、显示或 wholeLesson。

## Read snapshot hashes

下列路径相对于唯一根目录；哈希均为 SHA-256。

| 冻结独立基准 | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n56/evidence/independent-source.md` | `c93aeec79e11d83192ee63744cc8fcf0181353db28b8dc86b292b626215032dd` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n56/evidence/independent-solutions.md` | `99e35a3301f84f15d0e787b3c78944a0a0e5e49e57ffbb20870f52d15670e38b` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n56/evidence/source-figure-inventory.md` | `aaa6584fc9e85fcdf0d3a8923b73cfd963cef1d12627e766113c7170800218a3` |

以上三个哈希与首次交付一致，旧报告未改。

| raw / author 输入 | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n56/lesson.json` | `d814bf066a7f045d8c2a185d10b4c844fac89c6d3c6a29b012895f107d3f9482` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n56/exercises.json` | `660a1a7095f7f2d43df41743ef9a61ab50b2ed710cd2efc29ff3fa896875c34e` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n56/evidence/author-solutions.md` | `4823122154a5a1201ba031e81b3abfc93846c90bf9b4f4ac5c0e07dead909ec6` |

| 原页文本 / audit 输入 | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/pages/0208/page.md` | `f2ac2bd1e220f233d3d3fa9034dd1a4a991b825b91d82b0cf372ca3eb93c6acd` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/pages/0208/audit.json` | `b909dfebd065e9ad379247bed909d03a60631d30a0a10ccc7375c0408323071e` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/pages/0209/page.md` | `3e1eee81d240ac1d1db77eca68d03014265ced07b68b5882d8ac75eeb66b63f4` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/pages/0209/audit.json` | `ee4adca23b2ce13a9c96fd7e54c94559d604851dacc947b5147937f79acfa337` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/pages/0210/page.md` | `fef68e1dfec53352f26b32582816740baea743ccbc0004b0dd376d6238ed166c` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/pages/0210/audit.json` | `1057f9b197de88d7ed8602ce3bbd3d10ff0e647ac90fc7b2f636a68fd9e7607e` |

以下三个候选均在 `.tmp/ld-s10y-lesson/adapt/4m/modern-us-neutral/lessons/math4-c2-s1-n56/`，均为 `status: draft`。引用其哈希是本次对照的快照绑定，不把 `.tmp/` 候选当作持久成品。

| template | SHA-256 |
| --- | --- |
| `lesson.template.json` | `4831c771cafc399e68f05712327156d61b90d466cd8a3f170c24240fedabac28` |
| `exercises.template.json` | `9573a8ce80dd2b039a7d7c0b4e863229811b9253ebd21448a53c725fb7d7dd28` |
| `figures.template.json` | `017324ca2b64e2ce862f0812235e957911888c736723e81c1c5f6f4b7a19a163` |

## SOURCE to raw / modern lesson prose

数学内容对照 PASS；逐字全同不是本次结论，见后面的两个非数学文字差异。

| 已冻 SOURCE 内容 | raw / modern 正文对照 |
| --- | --- |
| 直角分成 90 等份，得到 90 个合同的角 | 保留 90、等份及“合同”，未改为别的分份数 |
| 每小角为直角的 1/90；一度定义及其强调句 | 两段定义均保留，没有删掉或改写分母 |
| MOP 包含 40 度，角大小写作上帽 MOP=40° | 40、M/O/P 次序和上帽等式均保留 |
| ∠MOP 是角，上帽 MOP 是角的大小 | 两种记法及两种读法均保留，没有交换 |
| 直角 90°、平角 180° | 数值和角类别保持 |
| 锐角小于 90°，钝角大于 90°且小于 180° | 严格不等式保持，未把边界包含进去 |
| ABC 为锐角、KED 为钝角的两式 | ABC<90°、90°<KED<180°及点名字序保持 |
| N56 从 0208 的 56 标题起，至 0210 的 945 止 | raw 和 modern 的题号均仅 935–945；未纳入 933/934、57 课或图 214/218 |
| 图 215、216、217 的课内关系 | lesson 三图列表保持；936 引用 216，943 引用 217；没有把图 217 插入 944 的语义条件 |

现代正文相对 raw 仅有已记录的换行；用 JSON 结构读取后，7 个 prose 项的 `text` 去空白逐项相等。`lesson.template.json.source.data` 与当前 raw `lesson.json` 完全相等，声明的 raw SHA-256 也相符。以上机械相等不能替代与已冻 SOURCE 的独立内容对照。

### 两处非数学文字差异

1. TEXT-DIFF-UNIT-PUNCTUATION：已冻 SOURCE 写“是角的度量单位——度的符号”；0208 `page.md:100`、raw 正文及现代正文写“是角的度量单位一度的符号”。源中的说明性破折号变成了字“一”。这是进入 raw 前已有的转录差异，不是现代 template 新增的数学数值变更；建议正文所有者在自己的可写稿中保留说明性标点、避免“一度”造成句法歧义。本次不修改任何输入。
2. TEXT-DIFF-945-PUNCTUATION：已冻 SOURCE 的提示语为“求下式的值：”，0210 `page.md:83`、raw 和现代题面为“求下式的值。”。计算式完全一致，只有提示语标点不同。不能据此宣称逐字保真，也不影响第 945 题结果。

这些差异已明确报告，没有新增数学 HOLD，也没有修改已冻 SOURCE 去迁就 raw。

### 页面 audit 的证据边界

- 0208 audit：`lines_printed=lines_md=23`；0209、0210 均为 22。三份报告的 `unknown_chars`、`katex_warnings`、`errors`、`normalizations` 均为空，`errata=0`。
- 各 `page.md` 声明的 render SHA-256 与已冻 SOURCE 三个原页 PNG 绑定一致。本次没有重开或重哈希 PNG。
- audit 的空错误数组仅是该文件的报告事实，不是独立逐字或逐刻度通过，也不会解除 HOLD-215-TICKS。
- 原 0209 `page.md:51` 与 raw 第 935 题的辅助 `lines` 留有 `↵87` 的显式断行记号；raw 正式 `text` 已是 A=87°，现代正式 `text` 及辅助 `lines` 都不含该记号。将其记作原辅助转录痕迹，不当作数学字符或现代题面新条件。
- N55 / N57 内容只用来核对共享页的课边界；不据其文本新作其他课审查。

## 935–945: 题面、小题次序、作者推导逐题对照

raw、现代候选均为 11 题，编号顺序严格为 935 到 945。每题 `number`、`source_number`、`group`、`group_id`、`pages`、`figure_refs`、`figures` 在 raw 与现代之间均相等。现代 `source.data` 与当前 raw exercises 完全相等，声明的 raw SHA-256 相符。

| 题号 | 已冻 SOURCE / 现代题面及小题次序 | 作者推导与独立解答对照 |
| --- | --- | --- |
| 935 | A=87°、E=175°、M=92°、P=3°，问锐/钝；点名和数值顺序保持 | A、P 锐角，E、M 钝角；作者分类及“没有直/平角”正确 |
| 936 | AOB=37°、BOC=19°，求 AOC，引用图 216 | 作者以 OB 在 OA、OC 之间相加，37+19=56°；关系和推导 PASS |
| 937 | a) 1/2 直角；b) 1/3 直角；c) 1/2 平角；d) 1/3 平角 | 作者依序 45°、30°、90°、60°；未将两列误作先上后下读序 |
| 938 | a) A=30°；b) A=15°，问占直角的分数 | 30/90=1/3，15/90=1/6；作者分母、约分及顺序正确 |
| 939 | a) 30°；b) 45°；c) 60°；d) 120°，问占平角的分数 | 作者依序 1/6、1/4、1/3、2/3；均除以 180 而非 90 |
| 940 | a) 37.0654；b) 450.1207，问每位单位数 | 两组位值完整匹配独立表；作者保留十分位/个位/千分位等各处 0，没有错位 |
| 941 | a) 12.567 与 125.67；b) 7.399 与 7.4 | 作者两处 `<` 正确；整数部分比较、7.400 对齐推导正确 |
| 942 | 1) 14k−(8k+3k)=1512；2) 11n−(5n−3n)=8136 | 作者分别化为 3k、9n，得 504、904；第二个减括号的变号正确，与独立代回一致 |
| 943 | CMK=42°、AMK=132°，求 AMC，引用图 217；给定顺序保持 | 作者用 MC 在 AMK 内部，132−42=90°，正确；两弧不是两个互不相交角域 |
| 944 | 总计 1 小时 40 分，先总量 1/5，再剩余的 1/4；仅把两处“别佳”改为 Ben | 作者 100→20，余 80→20，共 40 分钟=2/3 小时；没有将后一分数错施于总量 |
| 945 | (59 942−14 989−4000):51−(49 387+24 489):92；全部数值和两括号运算保持 | 作者 40 953=51×803，73 876=92×803，两商相减为 0；与独立求解及乘回相符，没有为整除改数 |

- 第 937–941 题原 Cyrillic 小题字母按顺序改为 a/b/c/d，记录了 `subpart-labels` / `layout`；值序和所求未改。
- 第 942 题仍为 1)、2)，只改成独立行；没有把 2) 放到 1) 前。
- 第 944 题的 Ben 属姓名现代化且记录 `changes: ["names"]`，不是历史身份断言或数学条件变更。两次替换一致。
- 所有现代题目的 `numeric_changes` 均为空；这与本次逐题数值复核一致，不仅依赖字段声明。
- JSON 比较对 raw / modern 使用的归一化仅为去空白、四个小题字母映射及 Ben→别佳；11 项正式题面均相等。没有归一化运算符、负号、小数点、分数分母、点名或数值。
- `author-solutions.md` 中全部 11 题都有实质推导或判据，与已冻独立解答一致；未发现数学错误、漏题、漏小题或倒置顺序。作者并未逐题写代回，但第 942、945 题已有独立基准中的精确复核；不为本次对照另造重复求解门槛。

## fig-215 proposed normalization: concrete contract analysis

### 结论及其范围

**可以表达已确定的正文概念而不依赖未知源数值，前提是严格采用下列事实分层和数学关系。** 这是对用户明确给出方案的合同分析，不是已生成现代图的通过结论。原 HOLD-215-TICKS 原样保持；未知原短刻线数量仍未知。

本次 `figures.template.json` 只列出三个图的 spec / svg / render / review 引用和源哈希；三项 `source.png.sha256` 与已冻 inventory 一致。该 manifest 本身不描述 72 条短线的构造，也不证明 spec 实际作了上述声明。本次没有读取其引用的 spec、SVG、render 或 review，没有用路径存在或源哈希匹配代替图审查。

### 1. 已确定源事实

- 保留 19 个五度长线/边界方向及 19 个原有五度数值标签：0°、5°、10°、……、90°。
- 从水平右边界 0° 起逆时针，依次递增至左竖边界 90°；两条边界共享一个未命名角点。
- 内部 17 条长线保持截短显示，不全部延伸到角点；不添加 O/M/P 等源图没有的点名。
- “直角 90 等份，每小角为直角 1/90，即 1°”是已冻正文直接给定，不需要从模糊像素读数。
- 19 个数字的数值和边界次序来自已确认的源图；其精确角位置和下面的细分几何依正文作现代规范化，不能声称原墨迹斜率逐条经精确测量。

### 2. 72 条短线的文本推导，不是源像素数量

令两个边界之间的角方向集合为

$$
T=\{0^\circ,1^\circ,2^\circ,\ldots,90^\circ\}.
$$

其中五度长线/边界占

$$
L=\{0^\circ,5^\circ,10^\circ,\ldots,90^\circ\},\qquad |L|=19.
$$

现代增补短线占

$$
S=T\setminus L
 =\{k^\circ:1\le k\le89,\ k\not\equiv0\pmod5\},
\qquad |S|=91-19=72.
$$

等价地，18 个五度夹域各补 4 个一度位置，总计 18×4=72。于是有 91 个不同方向位置，首尾相邻差均为 1°，形成 90 个一度间隔。**91 是方向位置数，不是 91 条完整共点实画射线；72 是规范化构造结果，不是被认证的原 PNG 独立短刻线数量。**

这些计算只使用正文 90° / 90 等份和源中已确认的五度标签，不读取、猜测或倒推模糊短刻线的数量、端点或角值。

### 3. 截短长线与精确分度可以兼容

- 对内部 17 条长线，数学支撑方向可以来自同一概念角点 V，但实画对象仍是内半径大于 0 的有限线段，不是从 V 出发的全长线。
- 短线也以相应 k° 的径向方向作有限刻线。等分的是关于 V 的角度，不是等 x 间距、等 y 间距或任意直线上的等距离。
- 如需统一圆形刻度带，可在共同参考半径上定位刻线，以角方向差认证每相邻位置为 1°；这是规范化的现代几何，不是原图曲带半径或线端长度的已知数值。
- 内部线的截短长度、短线长度、标签距离等属于现代显示参数，应声明为现代选择，不冒称源给定长度。不要因共用数学参照 V，给 17 条实画线添加“端点等于 V”的错误断言。
- 不增加连续弧、角点标签或 40° 的 MOP 示例三点作为“源图对象”；如果另作教学增补，必须独立标明，而不能混入已确定的源 inventory。

### 4. spec / 证据应表达的合同边界

- 源 inventory 继续记录已确认的 19 标签/长线、边界及内部截短形式；原短刻线仍注明数量/端点逐一对应未认证。
- 72 条精确短线在 spec 中单独声明为 **modern text-driven addition / normalization**，依据正文“90 等份”和已冻 SOURCE 哈希；不能列成已像素确认的源对象数。
- 可执行几何关系应覆盖：0°与90°边界、五度标签值和次序、17 条内部长线截短、72 个互不重复且不与五度位置重合的短线方向、91 个方向位置形成的 90 个一度间隔。
- 仅 `objectCount=72` 或“输出可重复”不足以认证一度等分；位置、顺序、相邻角差和截短对象的关系需要分别成立。
- 所有现代位置关系的通过，只能证明这一现代规范化正确实现已知概念，不能逆向证明原 PNG 的细刻线恰好就是 72 条。
- 即使后续规范化数学及显示检查通过，原 HOLD-215-TICKS 也不因此解除；后续图结论必须标明它通过的是文本驱动规范化，不是源逐细刻线像素计数。

这份合同允许已确认的正文概念被准确表达，不要求对未知短刻线作猜测，也不把局部源像素 HOLD 扩成所有正文或 11 题数学的 HOLD。

## Limited verdict

- SOURCE / MODERN-TEXT-MATH-COMPARISON: PASS，N56 正文数学命题及 935–945 题面、值序、分组、所求和图引用相符；两个非数学文字差异单列，不宣称逐字全同。
- AUTHOR-MATH-COMPARISON: PASS，11 题及所有小题的作者推导与冻结独立基准相符。
- FIG215-PROPOSED-CONTRACT: 合同上可行，限定为上述文本驱动规范化；不依赖未知源短刻线数值。
- HOLD-215-TICKS: 保持，未解除。未生成或审查现代图，不批准 fig-215、fig-216、fig-217 或 wholeLesson，不批准 choices、answers、显示或发布。
- 本次只有新文件 `evidence/source-author-comparison.md`；新增图 0，累计 6/24；原三份报告及全部候选未修改。
