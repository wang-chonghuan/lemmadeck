# Figure 62 Independent Review

结论：**PASS，当前 generated 图独立目视审查。**
日期：2026-11-15。审查者：Codex；图像作者为主会话，非本审查者。
本次只新增本目录 `independent-review.md` 与脚本生成的 `review.json`。
没有改图、spec、源、模板、失败记录、其它作者稿或持久资源，没有晋升。

## 权威与实际打开

仓库：`/Users/yong/.codex/worktrees/0f12/lemmadeck`。
完整读取当前现代 `phy6-c3-s18-t1` 的 lesson/exercises/figures 模板，
以 lesson 上层现代正文为权威，不以嵌套 `source.data` 旧正文替代。
完整读取 spec、author-inventory、prompt、generation JSON 和首次结构失败说明。
实际逐张打开以下完整 PNG，未漏最右、底部或以库存描述代替像素：

- 原始 `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-62.png`，
  RGB，1078 × 506。
- 当前 `.tmp/s10y-image/6p/fig-62/fig-62.png`，RGB，1536 × 1024。
- 同一生成图保持比例的完整 306 × 204 和 640 × 427 普通 media 显示。
  两次缩小图均在内存生成，无新增预览文件，不裁边。

本课是失重补充阅读，当前 exercises count=0、列表为空；未读答案键。
图 62 的现代图块来源为 `p0083#8`，相邻正文引用跨 `p0083#7/p0084#1`。
spec 的九个 authoritativeText 对象逐项精确等于全部九段现代正文；
generation.prompt 与 prompt.txt 一致，完整正文仅有排版空白差异，未遗漏上下文。

## 独立源库存与像素比较

| 从原 PNG 独立识别的事实 | 生成图及普通宽度核对 |
|---|---|
| 只有一名戴头盔的宇航员，位于中左；胳臂与腿弯曲，悬浮而非立于支承物上。 | 仍为一名；完整头盔、躯干、双臂与双腿可辨，两膝弯曲，两靴悬空，没有手脚搭在船体或地面的支承接触。 |
| 一条实际绳缆从宇航员延伸并连接右侧飞船，带弯曲/松弛段；不是运动或力的箭头。 | 白色绳缆从背包/身体侧可追踪到右船体的连接件，末端确实接船；弯曲下垂的松弛段连续，没有断开、浮空末端或箭头。它不充当承重悬挂物。 |
| 飞船只有右侧部分入画，带外部突出结构。 | 右侧部分船体、接口、外部杆件及舱口可见；船体刻意从右画边延伸，不是遗漏语义对象。没有额外人物。外伸杆是船体构件，不是力矢量。 |
| 左下有弧形地球边缘，周围为太空。 | 左下蓝色地球弧缘和云层可辨；宇航员在其前方漂浮，两靴没有接触地表，未将弧缘画成落脚平台。 |
| 无图内文字、字母、数字、单位、网格、刻度或量值。 | 无可读文字、数字、单位、箭头、尺度、网格、水印或答案注记；没有把无量值场景改成测量图。 |

上述关系在 306 和 640 px 都清楚；306 px 下绳缆仍连续可辨、右侧连接端可见，
宇航员的悬空双靴与地球/船体可区分。没有靠放大原画布掩盖普通 media 的缺失。
无可读标签，16 px 字号门槛无标签对象可测；不把此项称为已测得标签字号。

独立库存与作者库存、spec 库存相容，但结论来自实际 PNG。
生成图无旗帜、徽记、苏联文化装饰、印刷字、旧书纹理或手写体。
现代改编为自然色教材插画，扩展地球可见面积、重构船体/宇航服外观和视角；
这些是非量值的视觉改编，不冒称原图精确几何、原照片复原或真实史料。
源图没有指定人物身份；本图不被认定为正文末段格·斯·季托夫的肖像。

## 物理语义与模式

完整现代正文明确：自由下落时重量为零，**重力不为零**；
卫星、宇航员与物体共同绕地球运行，如不停地向地球自由下落。
生成图保留地球与轨道太空背景，不画支承接触、承重绳或“没有重力”标签，
与正文失重解释相容。此处不以单幅静态图证明轨道运动或力值，
也不把悬浮等同于地球引力消失。

本图没有刻度、数值或需精确作图的数学结构，generated 路由合理；
objects/assertions 为空不被冒充执行过几何或数量证明。
一名宇航员、实体松绳连接和相对位置通过上述像素目视核对。
与空练习模板一致，没有借答案输入制作图片或泄露答案。

## 结构修复与机械证据

只读比较 `spec-rejected-1.json` 与当前 spec：
唯一 JSON 字段变化为 `source.authoritativeText` 从 string 变为九对象 list，
正文去排版空白后相同，其它字段（包括源图、库存、canvas）完全相等。
`spec-first-failure.md` 和拒绝快照保留，不重复修复。
generation 中记录的 prompt、源参考路径/字节数/SHA 和输出路径/尺寸/字节数/SHA
均匹配实际文件；生成 PNG 与原始 PNG 是不同文件和不同字节，不冒充真实原图。
既有 validate_spec.py 以 rendered 阶段只读复验：退出 0，PASS。

独立审后按用户指定，用 record_review.py 的
`--spec spec.json --generation fig-62.png.json --output review.json --status pass`
记录具体目视结论。review.json 绑定当前源、spec、generation 和输出，
以下表额外绑定完整权威模板及作者证据。任何相关变化均需重新核验。

## 快照

`R` = `.tmp/s10y-image/6p/fig-62/`；
`T` = `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s18-t1/`；
路径均相对于上述仓库。

| 文件 | SHA-256 |
|---|---|
| 原始 `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-62.png` | `376ba6a5ab8ea83aab35b611dc8649fb28ad14d7bf428d4688fec9073c3900ca` |
| `R/spec.json` | `926a96392747567be155462a49f3ab7abfae3b850abff91eb968882b68d344d8` |
| `R/author-inventory.md` | `df8b30cee261ead4eb2cdeda8260b8d74340738c875a514ff645d055d0504c05` |
| `R/prompt.txt` | `a09de0e6fd3bc62b63db1b31a1556d5dc67baf97b7f97b400765ab75ffe68242` |
| `R/fig-62.png.json` | `89f10534022e50da98a75435569ee965a726db29df50284ee373d00e64cbe056` |
| `R/fig-62.png` | `5fafb3bf3ebbbef4a25a033aac66818c74d359c24fc70267ffd42aa91c79a2a1` |
| `R/spec-rejected-1.json` | `3d58d03ada75a5c820853750e4eac5975806eadaf1459b0ff11cedd46e38a17d` |
| `R/spec-first-failure.md` | `f14e01241df93da99ce470966f62900ffc7a1d665b5a8561b5e2cda7cb98ee70` |
| `T/lesson.template.json` | `38b5179aa3d0616061458de5ac8e8511495612fb672eb69beb71a383ef84e9f5` |
| `T/exercises.template.json` | `e1cfabcdfdda63775eddefc881de26090609a9b39b9745266c762b4926bef91e` |
| `T/figures.template.json` | `247c6fc69bca989f92828d9a55e0819d475c350454f68f1c10c2e7a65a53e227` |

写后再核证据绑定。本报告只批准当前图及声明普通 media 宽度的独立图审；
模板仍为 draft，未运行 edition finalize、离线整课 render 或产品浏览器验收，
不宣称完整晋升/发布门禁通过。无生成调用、Git/DB/应用/依赖操作。
