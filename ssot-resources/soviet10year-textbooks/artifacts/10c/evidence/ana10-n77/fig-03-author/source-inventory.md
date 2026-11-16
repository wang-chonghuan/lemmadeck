# 10c fig-03 source inventory / routing

## 阶段、输入与观察复用

本文件只完成 source inventory 与 routing，未制作 FigureSpec、坐标稿、SVG、preview 或 render/review 文件；没有运行门禁、批准或提升。正式批准的现代全文及官方 context 尚待父方提供。本清单不是现代文本绑定的替代品。

实际原 PNG 已在本代理紧接此前的 n77 CHOICE 源先求解阶段完整单张打开；本轮按明确授权复用该次像素观察，不重复开图。未读其他 spec、父方源冻结、答案或选项。

工作树根：`/Users/yong/.codex/worktrees/a07e/lemmadeck`。

| 输入 | 相对工作树路径 | SHA256 |
| --- | --- | --- |
| 实际原图 | `ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-03.png` | `8afe9f878ada47111cae799797fe1643af109941f7fa3cb0f157919752932f37` |
| 本代理既有源观察与求解冻结 | `.intentfold/tickets/STEMROBIN-184/tmp/ana10-n77-choice-source-first.md` | `0e766e575c4f50564e5304dcbda0338a69ad1d34d37ec73fe8d4114fb6ff6480` |
| 已读忠实正文 JSON | `ssot-resources/soviet10year-textbooks/artifacts/10c/lessons/ana10-c6-s1-n77/lesson.json` | `77472c809c8e64c55b9fb261943affe171aac1f2bc13e375dba361a84beaf378` |
| 已读忠实正文 MD | `ssot-resources/soviet10year-textbooks/artifacts/10c/lessons/ana10-c6-s1-n77/lesson.md` | `03fc2da90374479f6fdd398c0ac0fa30582be0859ee2f1edcb0ffcfa59377d72` |

这些哈希绑定此前实际输入及本轮开始时复核的原图/冻结报告，不声称现代文本已批准或已经与之绑定。CHOICE 冻结报告保持原字节不变；本图清单不新增任何习题求解或候选选项。

## 实际像素 inventory

只有一幅图，无子面板、坐标轴、刻度表或网格。下表 ID 是将来对象映射的稳定来源 ID，不是已存在的 spec 对象。

| 来源 requirement ID | 完整源对象/事实 | 拟用稳定对象 ID |
| --- | --- | --- |
| `source-point-o` | O 在左下，是 OA、OB 与角弧的共同顶点。 | `point-o`, `label-o` |
| `source-point-a` | A 在右下，是 OA、AB、弦 AD 与圆弧的共同端点。 | `point-a`, `label-a` |
| `source-point-b` | B 在右上，是 AB 与 OB 的交点。 | `point-b`, `label-b` |
| `source-point-d` | D 在斜线 OB 中途，介于 O 与 B，是弦及圆弧的另一端。 | `point-d`, `label-d` |
| `source-arc-c-label` | C 标识 D 至 A 圆弧上的位置；不是另一个直线交点。没有从 O 到 C 的可见半径。 | `point-c`（构造锚点）, `label-c` |
| `source-base-oa` | OA 为横向连续实线段，图的下边。 | `segment-oa` |
| `source-side-ab` | AB 为竖向连续实线段，图的右边。 | `segment-ab` |
| `source-ob-with-d` | OB 为连续斜向实线，包含 O-D 与 D-B 两部分；不能漏去 D-B。 | `segment-ob` |
| `source-chord-ad` | AD 为从 D 到 A 的连续直线弦；它与圆弧是不同对象。 | `segment-ad` |
| `source-arc-dca` | D 到 A 另有向右凸出的连续圆弧，C 的标字沿该弧；不能以弦替代。 | `arc-dca` |
| `source-angle-x` | O 附近小角弧及 x 标签完整，夹在 OA 与 OD/OB 之间。 | `arc-angle-x`, `label-x` |

全部六个源标签为 O、A、B、C、D、x，均须保留。没有源数字角度、半径数值 1/r/l 标签、长度刻痕、等长刻痕、直角方块、箭头、虚线、额外点、第三半径、完整圆周或区域填色。不得因数学上有直角/单位半径就将这些新符号伪称为原图内容。标签位置不自动要求另加可见点圆盘；原图没有明确独立点标记的地方，不凭构造点对象新增黑点。

原扫描的黑墨磨损/纹理不是数学对象，不复制为现代图装饰。

## 忠实正文赋予的数学关系

以下事实来自已经允许阅读的完整忠实 n77 正文及面积比较论证，不由图的粗略长度、斜率或 raster determinant 推断。批准现代 context 到达后须检查其完整表述，不能事先假定现代文字改动。

1. O 是圆心，OA 与 OD 是单位圆半径。源面积式采用半径 1，但原图没有刻写数字 1。A、D 及弧上的 C 属于同一圆周。
2. AB 是该圆在 A 处的切线；OA 垂直 AB。OB 沿 OD 方向延长至 B，D 严格位于 O、B 之间。只画源有限线段，不把切线扩成未给的无限线。
3. x 是 OA 与 OD 的夹角，采用弧度，范围为 `0 < x < pi/2`；不是固定数值角，也不是 AD 的弦长。
4. AD 是弦；D-C-A 是对应小圆弧。C 只作弧上的命名位置，不因其字母新增 OC 或另一条交线。
5. 三角形 OAD、扇形 OACD、切线三角形 OAB 的面积依次为 `sin(x)/2`、`x/2`、`tan(x)/2`。作为平面区域，前者是中者的真子集，中者是后者的真子集；它们共享 OA/OD 等边界，不能误写为所有边界点都严格位于后一区域内部。
6. 因而这是正文建立 `sin(x) < x < tan(x)` 的几何证明装置。面积公式及不等式是正文语义，不要求往图上另加答案式标注或填色。

## 后续对象/关系映射计划

关系组 `source-unit-sector-tangent` 将覆盖 `point-o`, `point-a`, `point-b`, `point-c`, `point-d`，并声明 `requires: ["pointRelationships"]`。下列是待 context 批准后落实的断言 ID 计划，当前尚无可执行 spec 或通过结果。

| 断言 ID 计划 | 来源关系 | 既有 schema 类型/核对边界 |
| --- | --- | --- |
| `relation-radius-oa` | OA = 1 | `distance` |
| `relation-radius-od` | OD = 1 | `distance` |
| `relation-equal-radii` | OA = OD | `equalDistance` |
| `relation-a-on-circle` | A 在以 O 为心的单位圆周上 | `pointOnCircle` |
| `relation-d-on-circle` | D 在同一圆周上 | `pointOnCircle` |
| `relation-c-on-circle` | C 在同一圆周上，且标签落在源小弧附近 | `pointOnCircle`；另核对 C 位于 A-D 小弧内，不能仅据整圆断言宣称弧次序已证 |
| `relation-o-d-b-collinear` | O、D、B 共线 | `collinear`；另由构造核对严格 O-D-B 顺序 |
| `relation-radius-tangent` | OA 垂直 AB，切线接触点是 A | `perpendicular`，配合 A 在圆上及半径事实 |
| `relation-connect-oa` | 源有限边 OA 的两个端点 | `connects` |
| `relation-connect-ab` | 源有限边 AB 的两个端点 | `connects` |
| `relation-connect-ob` | 源完整边 OB 的两个端点，不遗漏 D-B | `connects`，配合 O-D-B 共线与顺序 |
| `relation-connect-ad` | 源弦 AD 的两个端点 | `connects` |

每一个来源点均须进入该组内实际多点关系，不能用总对象数覆盖漏点。现有 `arc` 可以忠实表示 D-C-A 圆弧与 O 处角弧；圆弧方向、C 的弧内位置、x 的锐角范围、共享边界及区域真包含由精确构造与作者/非作者检查分别明确，不杜撰 schema 断言类型，也不把渲染机械 PASS 当作全部数学证明。

没有网格/计量刻度，`gridDimensions` 不适用。正文面积不要求额外 polygon 填色或图内公式。后续若选择代表角及坐标，只能作为明确声明的现代显示布局，并维持可变 x、等半径、严格共线顺序、切线与圆弧的 exact 数学关系；本阶段不选坐标或代表角。

## Routing 与等待边界

- 路由：`mode: deterministic`；仅需现有 JSXGraph 点、segment、arc 与 renderer-owned label，纯几何对象不需要生成服务、自然物素材或新引擎。
- 用途：`display.purpose: instructional`。读者需要辨认弦/圆弧及内接/扇形/切线三角形的关系，不能作 decorative 缩图。
- 后续显示合同：最终所有标签至少 16px，实际媒体宽度及 inline/scroll 选择待官方 context 和授权后确定；不能把 canvas 尺寸冒充实际 CSS 显示宽度。本轮没有浏览器或宽度测量。
- 所属：正文预备定理的 worked-proof apparatus。原十题32–41没有 figure refs；本图不自动进入 CHOICE seed，也绝不是题41分段 `sin(x)/x` 连续延拓函数的答案图像。
- 状态：source inventory/routing 已冻结，等待官方批准的完整现代 context 及进一步 deterministic 作者授权。未 build_context、spec、validate、render、record_review 或 promote；本清单不是独立图审 PASS。
