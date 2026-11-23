# N55 标准答案转写限定独审

日期：2026-11-23。
唯一根及所有命令实际 workdir：`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`。
课：`math4-c2-s1-n55`，55《小数的数位》。

## 授权范围与结论

**PASS：当前现代标准答案的来源、题面绑定、逐项 label/unit/value、完整 displayAnswer、非唯一构造和不判分设置。未发现此范围的实质转写差异。**

依据已经独立冻结的 `independent-source.md`、`independent-solutions.md` 和后续源图/现代图限定审查，核对指定 durable 现代 `answer-keys.json` 与同课当前 `exercises.json`。不重新求解，不读取书后答案，不重开任何原页、原PNG或现代预览。本轮新增图片 **0**，累计保持 **17/24**。

在此前已冻结新930盲审后，当前选择题内部比较也已完成，正式新绑定见 `.tmp/stemrobin-187/n55/choices/review.json`；该选择题 key 不是本次标准答案数值的独立依据。FIRST SOURCE/解、首选择题失败和旧图214 REVISE均保留不改。

本文件不是整课批准，也不证明应用端输入、判分、展示或发布已验收。本审未执行官方 checker、finalize、retain、DB/env、paid、安装、Git、APP或其他聊天。本审只写授权选择题 review 和本转写证据，未改答案、现代题面、图或其他文件。

## 实际结构与题面关系

- `schema = ld-s10y-answer/lesson-answers@1`，`book = 4m`，`lesson = math4-c2-s1-n55`，`edition = modern-us-neutral`。
- 本次读取的答案文件 `status = draft`，顶层字段为 `schema/book/lesson/edition/status/answers`，尚无 audit。本结论不把 draft 状态写成 ready，也不声称已经执行 finalize。
- `answers` 恰有11项，题号924–934各一次，无漏题、重题或额外题。9项 `auto`，930/932两项 `ungraded`。
- 40个 parts 均为 `judge = numeric`，每项 `expected` 恰有一个纯数值字符串；数量依次为924:19、925:2、926:1、927:4、928:5、929:4、930:0、931:2、932:0、933:2、934:1。
- 11项的 `prompt` 均与当前现代 `exercises[number].text` 逐字相同，也与该题 `lines` 用换行拼接的结果相同。没有从标准答案回写 source，也未将930选择题的候选坐标补成现代原练习的条件。
- 925现代 prompt、展示答案和parts标签使用 Latin `a)`/`b)`；历史 `source_text` 的西里尔标签只是原始追溯，未进入这三个现代作答字段。跨页第二组的万分位没有漏掉。
- 932现代 prompt保留源列举次序 `0.25,0.5,0.9,1.4,1.35,2,2.2` 和“10格作单位线段”，没有按展示图的左右次序改写源列表。
- 每项 `source = derived`，均无 `bookRaw`；全部 `historical_entities = []`。这是现场独立推导结果的转写，不是书后答案抄录或其正确性批准。

## 全部40个数值项

下表的 label、值和unit均已逐项比较实际JSON。`unit` 未设置表示数位单位的个数或无量纲数值，不擅加厘米、公斤等测量单位。数位单位名称已经包含在924的label中。

### 924：19项

实际label统一为“原数：数位单位的单位个数”，各原数的完整label后缀和值如下；19项均未设置 `unit`：

| 原数 | 全部label后缀与expected，按实际parts顺序 | 展示答案完整性 |
| --- | --- | --- |
| 456.76 | 百的单位个数=4；十的单位个数=5；一的单位个数=6；十分之一的单位个数=7；百分之一的单位个数=6 | displayAnswer逐一写出4个百、5个十、6个一、7个十分之一、6个百分之一，无漏位。 |
| 24.578 | 十的单位个数=2；一的单位个数=4；十分之一的单位个数=5；百分之一的单位个数=7；千分之一的单位个数=8 | 展示为2个十、4个一、5个十分之一、7个百分之一、8个千分之一，末8不是万分位。 |
| 1.878 | 一的单位个数=1；十分之一的单位个数=8；百分之一的单位个数=7；千分之一的单位个数=8 | 两个8分别绑定十分之一和千分之一，不混成同一单位。 |
| 0.5211 | 一的单位个数=0；十分之一的单位个数=5；百分之一的单位个数=2；千分之一的单位个数=1；万分之一的单位个数=1 | 0个一明确保留，末两个1的千分/万分单位不同；完整四个原数均有独立展示段。 |

### 925–934：其余21项及两项不判分构造

| 题号 | 实际label → expected / unit | 完整displayAnswer与冻结独解比较 |
| --- | --- | --- |
| 925 | `a)` → `15.379` / 无；`b)` → `0.3041` / 无 | 两分题均给最终小数，并保留 `15+0.3+0.07+0.009` 与 `0.3+0+0.004+0.0001`；明确百分位0占位。15个一和b的万分位完整，不是0.341。 |
| 926 | `AB的长度` → `5.762` / 米 | 明确 `AB=5.762米`，展示四项 `5+0.7+0.06+0.002`，原分米、厘米、毫米均正确转为米，没有单位仅换名称而不换数值。 |
| 927 | `米` → `4` / 米；`分米` → `5` / 分米；`厘米` → `7` / 厘米；`毫米` → `3` / 毫米 | 完整写出4米5分米7厘米3毫米，并有 `4+0.5+0.07+0.003`，末项毫米未舍去或近似。 |
| 928 | `A` → `5.3`；`B` → `5.8`；`C` → `6.2`；`D` → `6.6`；`K` → `6.8`，五项unit均无 | 五点依次全部展示，最后仍K而非E；说明5到6十小格、每格0.1，与已审图213同一单位间隔一致。不是长度单位，也不混成五条独立数轴。 |
| 929 | `Alex` → `40.8` / 公斤；`Ben` → `42.5` / 公斤；`Casey` → `37.7` / 公斤；`Drew` → `39.2` / 公斤 | 四人完整展示，并说明 `Casey < Drew < Alex < Ben`；依比较关系分配质量，而非沿题干原质量列表直接配姓名。 |
| 930 | `ungraded`，`parts=[]`，无唯一numeric键 | 展示尺绘四段及ABCDE连接顺序；坐标例有完整A、B、C、D、E，并明确厘米单位、四相邻长度和转角未规定。细节见下节。 |
| 931 | `1)` → `82339` / 无；`2)` → `13` / 无 | 两个数式均展示最终值及关键步骤。第一保留除得45、再减再乘74加6489；第二保留乘积17835、整和除427得132、再减119。千位LaTeX空格仅为展示分组，不进入numeric字符串。 |
| 932 | `ungraded`，`parts=[]`，无点位numeric判题槽 | 七数、按源顺序七个格数、两个半格中点、实际左右次序及布局可自定说明完整。没有因要求全覆盖就将一种画法设成唯一自动答案。 |
| 933 | `甲虫` → `22` / 只；`蜘蛛` → `22` / 只 | 明确Ben收集两类各22只；展示甲虫6腿、蜘蛛8腿、配对14腿及308÷14=22对，并以132+176=308验算。22是每类个体数，不是腿数，也没有把308当动物总数。 |
| 934 | `表达式的值` → `0` / 无 | 展示原543、乘97得52671、457乘13得5941、加7070得65682、除738得89、再减89乘11得0。数式、运算作用域及步骤均对应先冻SOURCE，不以结果0选择源数字。 |

### 930非唯一边界

当前标准答案坐标例为 `A=(0,0), B=(2.3,0), C=(2.3,3.5), D=(7.1,3.5), E=(7.1,1.8)`。

冻结独解给出的一个例子E为 `(7.1,5.2)`；两例E不同不构成转写错误。已有独立比较及新930盲审已明确二者末段均为1.7厘米，其余三段不变，本轮不重算或重画。当前展示明确“这只是一个例子”“原题没有规定转角”“折线形状可以不同”，没有将当前E、直角、方向或整组坐标设为唯一答案。

`grading=ungraded` 和空parts与源尺绘任务对应。930选择题对完整候选构造的多选识别与这里原练习自由尺绘是不同响应形式；新选择题真集 `{a,d}` 不意味着标准答案只能接受两幅轴向折线。

### 932确定点位与非唯一布局

当前展示按源题顺序对应 `2.5,5,9,14,13.5,20,22` 格。0.25明确位于第2与3格端点中点，1.35明确位于第13与14格端点中点，不舍入到整格；左到右的排序明确把1.35放在1.4左侧。

展示采用“从O向右”的一种画法，同时说原点位置和纸上小格大小可以自定。这是可复现构造说明，不是原题新增唯一朝向；源题给定单位后的相对点位不能随意改变，而纸上平移、方向和标注布局不唯一。`ungraded`、空parts不强制一套点字母或物理坐标。

## 姓名、图资产与非泄漏依据

929保持已授权映射：科里雅→Alex、别佳→Ben、任尼亚→Casey、谢尼亚→Drew；四个parts标签和displayAnswer逐人一致。933仅使用Ben，题面和展示答案一致。11项现代prompt、displayAnswer和parts标签中均未重新引入上述原姓名或西里尔字符；没有无来源历史实体声明。

只有928和933的 `figureEvidence` 非空，分别对应当前练习 `figure_refs` 的fig-213、fig-214，各一次。其 `originalPng/editionAsset/figureSpec` 均是正确的本课原图库及现代资产路径；当前spec的 `source.authoritativeText` 中该题正文与answer prompt完全一致，`source.image.path`与originalPng一致。

零图复用的实际观察：

- 图213：同一射线23ticks，5/6在索引0/10，A/B/C/D/K在3/8/12/16/18；全部五点、K右侧刻度完整，无点值答案标签。当前spec/render/SVG均与先前限定PASS所绑定hash一致。
- 图214：当前修稿甲虫左右各3条连身腿，蜘蛛左右各4条连身腿；头身搭接，各一个代表个体，不是收藏数统计。无22、方程或文化答案提示，男孩/展示板作为非数学叙事省略，现代轮廓与坐标不冒充源像素。当前spec/render/SVG与修稿限定PASS所绑定hash一致；旧REVISE不抹除。

本轮只核文本、JSON路径和文件hash，没有新开图。源图hash仅引用已冻inventory及当前spec来源记录，没有重新打开源PNG：

| 来源图 | 已冻结source.image SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/figures/fig-213.png` | `e5ddfcf94db52eed674fcb96ca0443b60f17866b6aae088b3aa8c35f4c0655e8` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/figures/fig-214.png` | `68bd73a641039ecfc0d06b6ceca1d35846c58007d4835d912377d00b283a705c` |

## 快照绑定

下列路径均相对于上方唯一绝对根。文件hash为当前实际字节的SHA-256；数学权威是先冻SOURCE/独解及既有图观察，不是hash本身。

**answers数组语义digest：`bae507f046fb70da5f30c52c69d1c48970ed16fb60dcfca132fe4251ca4dd600`。**

算法：仅取 `answer-keys.json["answers"]`，用 `json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":"))` 规范化，UTF-8编码后求SHA-256。包含数组内所有prompt、displayAnswer、parts、单位、来源、grading和figureEvidence；不包含顶层status或audit，也不因缩进改变失效。

| 当前文件 | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/lessons/math4-c2-s1-n55/answer-keys.json` | `130773313e7a880b7e328f814b9668a03196a2aa1b7bc106efe49019e89a075b` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/lessons/math4-c2-s1-n55/exercises.json` | `7aff96c7aec9a054319b361ed33baac8f5b8e6b2d9c669360032824ca2b4aec5` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/lessons/math4-c2-s1-n55/lesson.json` | `0bf80e1f355ba3adcad3a4ca53dd0ba317884eb87e91c9a1bb53bed4ba7934de` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n55/evidence/independent-source.md` | `8507bc549d6ce70b4c03499ef3967054285f5d2d3e6cd431deb59e76dddf74ab` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n55/evidence/independent-solutions.md` | `da6fc160d5b0d7fa5550e084211dad159d121d2efb1202ad621e1157de38973c` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n55/evidence/source-figure-supplement.md` | `815d9641204f198c2c1d2798e37de68c857f096c8d70dccd22403e6d29decd57` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n55/evidence/independent-figure-review.md` | `07c1677693dea67ce5340e5fa84ca0298ecf8939dba0675c398798474758834f` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n55/evidence/independent-figure-repair.md` | `d1582e5fffadb2794fdf638f557930ab8b72972f34f4eb0b7444a42692c14873` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/figures/fig-213.spec.json` | `a8e2fc659292c6bcd55a10c359b83d47d13861a97279c0282094ae45a6167cc9` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/figures/fig-213.render.json` | `a6414ae86eb32607bf1fd78b5d48173966beb3b4645a01f63b29e552675a4196` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/figures/fig-213.svg` | `4a6b54a045b82a8bd53c6260e6b647b10e4cc9733b298f3ec7ecd8be36652d9f` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/figures/fig-214.spec.json` | `14095625e3cbbc17c3b52dad9e9f8cf71655ed3a66ce9d9801f4f90129734c87` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/figures/fig-214.render.json` | `32f80721455dd603dc48f82d6ba12918b9275115907793aedb94ce201eb5b55f` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/figures/fig-214.svg` | `0fd3f7039745e4bfaf0635f911513301b4a4571b3f1dcd41ae72d0a660316033` |

## 后续finalize的复用边界

如果官方后续finalize只更新顶层status/audit，`answers`数组保持上述语义digest，且所绑定现代prompt与图数学资产未变，则只是执行状态/审计更新，**无需重做数学或重新读图**。整文件hash会随状态/审计变化，应记录新的文件hash并引用本证据，而不是把旧字节hash声称为新文件hash。

这里是明确的复用条件，不是对尚未执行finalize的预测或批准。任何answers数组内的label、unit、value、displayAnswer、prompt、grading、来源或figureEvidence变动，以及题面/图实际数学语义变化，仍须受影响复核；不能只用顶层ready或机械pass掩盖变化。

本次授权审查已保存，累计17/24，止于离线限定交付。
