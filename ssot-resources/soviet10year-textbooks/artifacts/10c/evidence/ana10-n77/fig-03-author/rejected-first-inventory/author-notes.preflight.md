# 10c fig-03 deterministic author handoff

## 当前状态

**BLOCKED，停于首次 renderer 内置 spec-validation；没有实际浏览器渲染。**

本代理是图作者，不是独立审批者。没有 review PASS、record_review、promotion、现代文件/索引/工具编辑、Git、DB、服务、网络、依赖或模型调用。CHOICE 源先求解冻结及本图 source-inventory 保持原字节不变，正式 CHOICE seed/选项阶段仍未开始。

本轮已经读取父方提供的官方 `context.json` 和当前 durable 批准现代 lesson.json 的全部正文；没有读取父方 text-review、源冻结、答案或其他 spec。原图观察严格复用本代理紧接此前实际打开的完整 PNG，不再次开图。

## 产物和输入绑定

根目录：`/Users/yong/.codex/worktrees/a07e/lemmadeck/`。本表各路径相对该工作树根。

| 路径 | SHA256 | 角色/结果 |
| --- | --- | --- |
| `.tmp/s10y-image/10c-fig03/context.json` | `310085827d444eb51b4ecc16e430004ec579a10e0bd382bd257dff34df7ec043` | 父方已有官方 context，本代理只读 |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s1-n77/lesson.json` | `3f45ebb716cde48cde966e22c5fbcf9f672e462f000218a1449c2a542633c313` | 完整批准现代全文，本代理只读 |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-03.png` | `8afe9f878ada47111cae799797fe1643af109941f7fa3cb0f157919752932f37` | 已实际观察的原图，复用既有源事实 |
| `.tmp/s10y-image/10c-fig03/source-inventory.md` | `793bab607659319b18f6cbff022530aa881d276a02297724b2f627b5d59b6aaf` | 先于现代 context 的完整源清单，未改 |
| `.tmp/s10y-image/10c-fig03/spec.json` | `90fd15ccdaef1c3768e076cc7abdaf81d230e884ce317cdcda05d31ad23b72ad` | 首次确定性作者稿，未修改 |
| `.tmp/s10y-image/10c-fig03/rejected-first-inventory/spec.json` | `90fd15ccdaef1c3768e076cc7abdaf81d230e884ce317cdcda05d31ad23b72ad` | 首次失败 spec 的原字节副本 |
| `.tmp/s10y-image/10c-fig03/rejected-first-inventory/spec.validation.json` | `5170db611a07b647a08d22a056ccb033bc4eed4acece2973825b0499b37dbe78` | 按实际 stdout 原 JSON 结构保存的五条失败诊断；不是 renderer 自动生成的 render report |
| `.agents/skills/ld-s10y-image/scripts/render_spec.mjs` | `28ab00dbc42840537fc06289358bd7c6934d205b8f9e2fb9e60d5a25f57e7d91` | 本次实际 renderer，只读 |
| `.agents/skills/ld-s10y-image/scripts/validate_spec.py` | `09710764de37027add910c734832a953f77b909cc50080807765b8aa20299668` | 产生 preflight 拒绝的现有校验器，只读 |

`source.authoritativeText` 包含批准正文的全部 20 个非空 text 对象（包括图题与补充教材说明），保留原次序及实际字符串。只读结构比较返回 `approvedFullProseItems=20, specAuthoritativeItems=20, exactOrderAndText=true`。空的 figure 占位由本 spec 的图 ID 承担，未伪造正文。

## 作者数学与来源检查

路由仍为 `deterministic` / `instructional`，使用现有 point/segment/arc/text 能力，不需要新引擎。全文确认它仍是预备定理的面积比较 apparatus，而不是题41连续延拓函数的答案图像；context 的练习列表为空。

- 源 O/A/B/C/D/x 六标签完整；四条源有限实线 OA、AB、OB、AD 及两条源圆弧分别建模。
- 代表布局是 `O=(0,0), A=(1,0), D=(3/5,4/5), B=(1,4/3), C=(4/5,3/5)`。这些数值只在 spec/作者说明中作为现代显示 regularization，不作为源已给长度或角度、不在图内新增标注。
- OA、OD、OC 的长度均为 1；其中 OC 只是检查用距离，**没有绘制 OC 半径**。O、D、B 共线，且 `D=(3/5)B`，所以严格 O-D-B 顺序得到保证。OA 水平、AB 垂直，AB 在单位圆 A 处相切。所有这些必要关系都有对应既有 schema 断言。
- 代表角为 `atan(4/3)`，但源 x 保持可变量 `0<x<pi/2`。一般构造是 D=(cos x,sin x)、B=(1,tan x)；选定值只是非退化展示，不会把证明局限为某个源数字角。
- `atan(3/4)` 严格位于 0 与 `atan(4/3)` 之间，所以 C 的位置确在 A-D 小弧内；只显示其弧标签。unit arc 从 A 向 D 逆时针绘制，与源 D-C-A 是同一小弧。C 不被当作额外交线交点。
- O 处角弧的两个向量为 `(0.22,0)` 与 `(0.132,0.176)=(0.22)D`，两端等距且分别沿 OA、OD，中心仍是 O。它不是第二个圆心或另加物理圆。
- AD 是独立的直线弦，不能与圆弧替换。一般 `0<x<pi/2` 时，源两个三角形和扇形的区域真包含及共享边界仍成立；面积 `sin(x)/2 < x/2 < tan(x)/2`。本图不另印面积或答案公式、不填色。
- 没有新增完整圆周、直角刻痕、半径标签、轴、箭头、数值角、等长标记、额外中心或点标记。

当前 `visible:false` 点对象是几何/标签锚点，不是图中需要新增的实心点；现有 renderer 在 point 分支中仍执行 `addLabel(object, object.at)`，因此隐藏 marker 并不隐藏 O/A/B/C/D 的标签。`label-x` 是独立 text。renderer 生成标签 ID 为 `point-o-label` 等及 `label-x-label`，不是遗漏独立源标签。

## 唯一一次实际命令与结果

```sh
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never node \
  .agents/skills/ld-s10y-image/scripts/render_spec.mjs \
  --spec .tmp/s10y-image/10c-fig03/spec.json \
  --svg .tmp/s10y-image/10c-fig03/fig-03.svg \
  --png .tmp/s10y-image/10c-fig03/fig-03.preview.png \
  --report .tmp/s10y-image/10c-fig03/fig-03.render.json
```

实际 exit **1**，stderr 为 `ERROR: FigureSpec validation failed`，其 JSON 有五条 `missing visible object`，分别指向 point-o/a/b/d/c。该命令先调用内置 `validate_spec.py`，失败即抛错；未进入 `render()` 或 chromium.launch。因此：

- renderer 命令尝试 **1** 次；内置 draft validation **1** 次；实际渲染 **0** 次。
- spec repair **0** 次；没有第二次命令或反复尝试。
- 没有生成 `fig-03.svg`、`fig-03.render.json`、`fig-03.preview.png`，也没有 native/240neutral/346print 的任何成功预览。
- 没有浏览器需要关闭；无用户窗口/profile/CDP/OS 输入。已检查现有 renderer 的 launcher 明写 `headless:true` 且 finally 关闭其 browser；实际命令也已清除 PWDEBUG 并禁自动打开 HTML。
- spec 预定 native 640x720、CSS 宽度 640/240/346，标签原尺寸 44px，等比缩放预计为 44/16.5/23.7875px。**这只是计划值，尚无实际 display/截图证据，不声称字号或视觉已通过。**

## 精确工具/合同阻塞与最小建议

现有 `validate_spec.py:406-409` 拒绝 inventory 所有 `visible is False` 的对象；另一方面 `:460-469` 要求 `pointRelationships` 组至少映射两个 point，`:472-501` 又要求实际多点断言完整覆盖。当前五点均映射并有对应关系，但前一个可见性检查拒绝了它们。

这与当前 renderer 的“point marker 隐藏但 label 正常绘制”能力不一致。将这些点改为可见会新增原图未给的点圆盘，尤其 C 明确只允许弧标签；改为仅文本 inventory、删除 `pointRelationships`、用总数顶替关系、透明/极小 marker 规避，均不能诚实解决来源映射要求。因此没有实施投机性 spec 修补。

最小通用修正建议（仅报告，不改工具）：允许 inventory 映射到**有非空且实际可见 label 的隐藏 point anchor**，同时保留 pointRelationships 多点覆盖、bounds、render 的 label collision/clipping/minText 检查。应继续拒绝无标签且无可见实体的失踪点，不豁免源点关系覆盖；也不能用页号/图号特判。该改动需父方另行授权工具责任方，本次作者 scratch scope 不包含它。

## 停止交接

保留当前完整 spec 与首次诊断，状态 BLOCKED，不能提升。没有假报 render/visual PASS 或购买服务补救。待父方处理合同/工具边界并明确下一步授权；本代理不自行再渲染或启动 CHOICE。
