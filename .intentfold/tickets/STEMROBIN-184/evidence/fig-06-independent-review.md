# STEMROBIN-184 fig-06 独立数学与视觉审查

日期：2026-11-15。审查者未参与绘制该图。

## 结论与范围

**PASS：当前暂存 fig-06 的数学、原图忠实性和声明尺寸下的视觉显示通过。未发现必须修图的问题。**

这不是完整 cap4 提升/发布验收，也不是 `record_review` 产物。当前 render 元数据仍绑定 `.tmp/` 输出；主作者若提升，须按技能要求绑定耐久最终路径并完成对应的正式 review 和 lesson/product 门禁。本报告不把当前暂存路径说成已满足“耐久最终输出”条件。

已读 `.agents/skills/ld-s10y-image/SKILL.md`、`references/quality-gate.md`、`references/figure-spec.md`。按要求先打开实际耐久原图，再打开完整 560 x 400 preview；随后读取当前 spec、SVG 和 render.json，直接把当前 SVG 字节送入隔离的无头 Chrome 检查，并实际打开下面六张浏览器截图。

没有读取答案文件、选择题、source_solution、数据库或其他工作者的文档；没有网络请求、服务启动、测试套件、提升、record_review、finalize 或图像重新生成。本任务唯一耐久写入是 apply_patch 新建本报告，另有六张获准的临时浏览器截图。

## 原图与规格独立核对

实际原图：

`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-06.png`

实算尺寸 **274 x 212**。直接从原像素认出的库存：

- 一个竖向狭长的封闭透镜，两个曲边在上、下端相接，内部为斜向阴影线。
- 左曲边较平缓，右曲边较弯；不是左右等曲率的透镜。
- 左圆心点与 O1 在透镜左边，右圆心点与 O2 在右边；两个点都不在透镜内。
- 原图圆心基线略倾斜。没有完整圆、半径线、数值、具名交点、网格或其他子图。

当前 spec 的 `source-lens` 与 `source-centers` 库存完整，不以 objectCount 代替上述视觉确认。`source-centers` 声明 `pointRelationships`，所映射的 `center-spacing` 只引用组内两点，覆盖二者。透镜库存的四条 pointOnCircle 断言 ID 和 one-region ID 均存在，点/圆心引用可解析。

spec 明确把 **半径 2.2、3.2、圆心距 4** 记为实现未量度示意图的 construction choices，把水平基线和以浅语义填色替换旧阴影线记为 modern regularization。它们不是源图给定值，且没有作为数值/线段/解释文字出现在图上。这种声明和当前原图一致。

当前预览与实际浏览器 SVG 保留一个封闭填色透镜、左 O1/右 O2 两点及两标签、较平缓左弧/较弯右弧。没有新增完整圆、半径、等半径暗示或交点标签。字形 O1/O2 保留数学标识含义；未复制旧书的中文图题或扫描污点。

阅读 spec 内完整相关题文：

> 16. 1) 两个圆的交是怎样的图形？2) 图6上画出的图形叫做“透镜”．给出这种图形的定义．

当前图不增加可见定义、运算、答案文字或测量提示；可见文字严格只有 O1、O2。没有中文/西里尔文、旗帜、徽章、文化装饰或历史纹理。本报告不读取/核验题目答案。

## SVG 弧段数学

没有仅凭四条独立字面坐标断言推定路径正确：用 XML 解析实际 SVG，读取真实 d 和父变换，再独立做 SVG endpoint-to-center 圆弧解算。

实际路径与 spec 字节一致：

```text
M 2.825 0.7437611210316515
A 2.2 2.2 0 0 1 2.825 4.2562388789683485
A 3.2 3.2 0 0 1 2.825 0.7437611210316515 Z
```

父变换为 `scale(80 80)`。画布 boundingBox `[-1.5,2.5,5.5,-2.5]` 的两个方向都为 **80 px/单位**，没有把圆弧拉成椭圆。路径采用技能定义的 source-screen 坐标，其到数学坐标的换算为 `x_math=x_path-1.5`、`y_math=2.5-y_path`。

构造两圆为 O1=(0,0)、r1=2.2，O2=(4,0)、r2=3.2。独立计算公共端点：

```text
x = (4^2 + 2.2^2 - 3.2^2) / (2*4) = 1.325
y = ±sqrt(2.2^2 - 1.325^2) = ±1.7562388789683485
```

这正好对应真实 SVG 路径端点 `(2.825,0.7437611210316515)` 与 `(2.825,4.2562388789683485)`。真实路径的两次 `A` 采用 large-arc=0、sweep=1；独立解算如下：

| 项目 | 第一弧，右边界 | 第二弧，左边界 |
| --- | --- | --- |
| 半径 | 2.2 | 3.2 |
| 解出的路径空间圆心 | (1.5,2.5) | (5.5,2.5) |
| 对应数学圆心 | (0,0) | (4,0) |
| 对应像素圆心 | (120,200) | (440,200) |
| 实际扫角 | 105.9343125100° | 66.5728326765° |

浮点解算圆心的最大偏差 < 1e-15。SVG 中两个实际点 ellipse 的中心也正好为 `(120,200)`、`(440,200)`；因此不是弧画在别处、只让断言里的假端点通过。第一弧构成较弯的右边界，第二弧构成较平缓的左边界，与原图方向一致。路径 Z 回到已共享的首端点，没有额外跨透镜的直线。

**独立复算所有 pointOnCircle：**

| 断言 | 距离实算 | 声明半径 | 绝对误差 |
| --- | ---: | ---: | ---: |
| top-on-first | 2.2 | 2.2 | 0 |
| top-on-second | 3.2 | 3.2 | 0 |
| bottom-on-first | 2.2 | 2.2 | 0 |
| bottom-on-second | 3.2 | 3.2 | 0 |

center-spacing 实算为 4；实际 SVG 只有一个可见透镜路径，one-region 也满足。

为排除“端点对但弧方向错”，另外按实际扫角在每弧采样 **2001 点**：

- 第一弧相对自身圆的最大半径误差 `8.881784197001252e-16`；第二弧为 `4.440892098500626e-16`。
- 第一弧相对另一圆盘的最大越界量 `4.440892098500626e-16`；第二弧为 `8.881784197001252e-16`，均仅为浮点舍入。正确选取了位于另一圆盘内的弧，而不是外侧补弧。
- 透镜数学 x 范围为 `[0.8,2.2]`，O1 的 x=0、O2 的 x=4，两个圆心均在透镜外。两弧的凸向/扫角构成所声明的封闭交叠区域。

## 实际浏览器视觉与显示门禁

使用项目现有 Playwright，隔离 **headless Chrome 157.0.8103.52**，deviceScaleFactor=1。直接加载原 SVG 字节到内存 HTML，只加 CSS 显示宽度和测试颜色变量；不调用 render_spec，不改 SVG 或 render.json。CSP 禁止外部资源，并设置所有请求拦截；实际请求列表与浏览器错误列表均为空。已关闭本任务的浏览器。

从每个 SVG text 的 `getComputedStyle(fontSize)` 与 `getScreenCTM()` 实测最终字号，不只做画布比例估算：

| 声明/实际 CSS 宽度 | 实际 SVG 高度 | 两标签最终字号 | 当前 render.displayChecks 字号 | 独立结论 |
| ---: | ---: | ---: | ---: | --- |
| 280 | 200 | 16 | 16 | PASS |
| 300 | 214.28125 | 17.1425 | 17.1425 | PASS |
| 358 | 255.703125 | 20.45625 | 20.45625 | PASS |
| 560 | 400 | 32 | 32 | PASS |

四个宽度均实际打开截图核查，不只是读取 render 的 pass：

- 两个标签均在画布内，O1 在左点西南，O2 在右点东南；标签互不碰撞，也不碰撞两个可见点。
- 圆弧闭合、填色位于透镜内部，尖端完整，两个圆心点清楚，没有漏对象或裁切。
- 560 宽实际透镜边界包围盒为 x=184..296、y=59.50089..340.49911；3px 描边留有充分画布余量。280 宽仍可清楚区分透镜边界、阴影和两个标签。
- 两个实际点 ellipse 为 rx=ry=5（560 宽），均清楚显示；SVG 内没有完整 circle 或 raster image 对象。两个 JSXGraph 默认隐藏占位路径是 `display=none`，不属于可见源库存。
- 280/300/358/560 的非白像素实测分别为 6378/7284/10207/24237（阈值 min(R,G,B)<245）；没有空白或全黑渲染。
- 语义 CSS 变量的中性色、蓝色 accent 和黑白 print 变体均实际查看过。填色透明度 0.18，轮廓与标签保持可读，没有把浅填色变成遮字黑块。颜色变体仅为浏览器诊断，不写回 spec。

该检查验证了 **声明的四个媒体宽度**。没有访问产品或离线 lesson，也不声称独立测到了产品容器实际宽度；若后续最终媒体宽度小于 280，需要重新检查，不能沿用最小 16px 的结论。

## 当前文件哈希绑定

以下均通过 `shasum -a 256` 实算，检查前后未发生变化。source.image.sha256、render.spec.sha256 和 render.output.svg.sha256 与真实文件一致。

| 绝对文件路径 | SHA-256 |
| --- | --- |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-06.png` | `c276abc4f8d0c7f7592abf595c50993f1958329ba7ac1108c2c6ee333d548cf0` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/6-8g/fig-06/fig-06.spec.json` | `e522a7f79a2e169acea4f01bf42bf79cbf4c25f805a317a0a1008a0de0380b7b` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/6-8g/fig-06/fig-06.svg` | `532c8982949804d509b7338b49fe7a05f20dbffde6546505ff0c3e9abb12f73b` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/6-8g/fig-06/fig-06.render.json` | `a39c96b58dcae0822f15d2d58a8e42b9ca5ee4a9db9110f4e3d26f0c88d7dbe7` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/6-8g/fig-06/fig-06.preview.png` | `95a10e0041b1c5b8725a3870e62110f33a53bbcf93f715226c21aa7087a04ef2` |

当前 render 为 status pass、objects=3、labels=2、collisions=[]，四项 displayChecks 全 pass，与上述独立实测一致。但其 spec/output path 为暂存 `.tmp/`，正式提升时仍须遵守耐久最终输出路径契约。本报告不作提升操作，也不替代生成器正式 schema 验证或 hash-bound review@1。

## 本任务输出与截图证据

唯一手工/耐久写入：

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/fig-06-independent-review.md`

另写入并实际打开以下六张 scratch 截图。截图尺寸包含浏览器对子像素高度的向上取整；这不是修改 SVG 的画布比例。

| 截图绝对路径 | 尺寸 | SHA-256 |
| --- | --- | --- |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/fig06-independent-280-neutral.png` | 280 x 200 | `1d3c0b4a58a89fee410cca871be6789fc4190852e1a7e44e8f6395d60d6076fc` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/fig06-independent-300-neutral.png` | 300 x 215 | `be0f3755dfebb8105d41273778fc2cf420e453870a97318991bd167fa0f57169` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/fig06-independent-358-neutral.png` | 358 x 256 | `241f148888ed59755fc87ec88d5ac7c0e406cfb25ed63f84a38693c641989a4b` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/fig06-independent-560-neutral.png` | 560 x 400 | `41d24d7686ba546d4a9292b1badb9b2500b979946e503b9a42204ccd28e004c0` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/fig06-independent-560-accent.png` | 560 x 400 | `7d97420785bbd09103e1f9e765ea7da7ca4fbedb011676c6e4fae5555fc37a00` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/fig06-independent-560-print.png` | 560 x 400 | `d942bd6c7cc3640d6681ed0da1ef8643980c5e9f66ccd1046e6874a52d5c7256` |

本结论只绑定表中当前源/spec/SVG/render/preview 字节。任何后续变化使本次独立审查失效，须对变更部分重新确认。
