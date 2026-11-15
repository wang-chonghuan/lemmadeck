# fig-61 Independent Review

2026-11-15。独立审查者 Sagan，不是 Faraday 作者。
**FAIL：当前最终render本身失败，独立实际视图确认标签压住弹簧。**

## Failure and Final Author State

当前 `fig-61.render.json` 为 `status=fail`，不是PASS。
`render-command.attempt-2.json` 退出2，记录
`a-elastic-label-label` / `Elastic force` / `position=CENTER` / `score=10000`。
`author-preview.json` 虽顶层 `status=pass`，内部 `renderStatus=fail`，
两者不一致。其绑定的spec/SVG/render仍为当前真实文件，
不能拿预览顶层PASS掩盖render失败。

完整640px neutral/accent SVG、306px左端和480px打印均实际看到：
`Elastic force` 文本右侧与a状态弹簧线圈重叠，英文force尾部压住线圈。
这不是字体过小或画布裁切，字号和边界通过也无法消除碰撞。
`repairsUsed=1`、`furtherRepairAllowed=false`，当前已是作者限定最后稿，
不批准、不代修、不做第三稿、不晋升。保留原有全部失败证据。

## Actual Opening and Authority

仓库 `/Users/yong/.codex/worktrees/0f12/lemmadeck`；以下路径相对此仓库。
实际打开完整源
`ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-61.png`，
并在浏览器将完整原图放大，再核对上下两状态。读当前spec全文，
完整authoritativeText与s18-t1现代template上层标题及所有文字prose逐项相等；
该课exercises为空，不捏造附图题或第11个答案。

实际headed Chromium以现有 `app/src/styles/app.css` 载入完整 `fig-61.svg`：
neutral/accent媒体640px、306px滚动左右端、480px打印。
媒体保持640px，实际滚动末端334px可达；10标签屏幕24px/打印18px，
全部在SVG边界内。截图真实显示于工具输出而不写新截图文件，
未检查或批准生产页面，未读作者答案/计划。

## Complete Independent Source Inventory

| Source group | Independent pixel observation | Current SVG comparison |
| --- | --- | --- |
| 上a | 固定横支承、上挂线/环、长而拉伸的竖弹簧、下钩、矩形物体；物体处同轴向上/向下实线箭头；原а。 | 左a，`At rest`/`Stretched`；支承—线—上钩—弹簧—下钩—物体连接齐全。上弹力/下重力正确，但弹力标签碰撞线圈。 |
| 下b | 固定横支承仍在，上挂线余端；空隙；下段余线/环、较短密弹簧、下钩、矩形物体；仅向下箭头；原б。 | 右b，断线两残端之间是真实空隙，下段与弹簧及物体连续；`Falling together`/`Unstretched`，仅下向Gravity，无上弹力箭头。 |
| 状态关系/线型 | a拉伸、b无伸长示意；支承没有随系统落下，失去的是挂线连接；原图无数字/标尺或明确虚线。 | a弹簧比b长，未把无伸长画成零重力；SVG无dash线，断线空隙没有用虚线假接起来。 |

原图线圈内部各段是弹簧结构，不能凭用户提及“源虚线”就 invent 一条
在现PNG没有辨认到的虚线；上下挂线断开处实际是白色空隙。
现代左右重排、English状态/力名、规则线圈和微小构造点是现代添加，
不冒称原图标签、坐标、圈数或力测量。a等长相反箭头表达正文静止平衡，
b保留同示意重力长度不是零重力；长度无数值测量意义。
文字中的共同自由下落、重量零而重力非零保持，不能理解成磁悬浮或失去引力。

所有钩/物体连接、a/b映射和物理状态检查未另发现实质错误；
英文标签无文化符号或选择键泄漏。但**标签碰撞与实际render FAIL足以拒绝**，
其他检查通过不得转成整图PASS。

## Actual Hashes and Gate Results

独立 `validate_spec.py --stage rendered` 实际PASS，只表示spec结构；
render FAIL与独立可视碰撞分别如实记录。审前至收口文件哈希一致。

| Input | SHA256 |
| --- | --- |
| source fig-61.png | `6ca227cd72cb618462f96c751101e1c9cb32666b57677c7bf6bfa8a3bfdb0e9b` |
| spec.json | `f9c754ea8039bf8bb00bcafbb14fe6c082ca80a0222c5765fe835cbe825623c5` |
| fig-61.svg | `474b2aba5f8b9ee8af6076cd3a28c08514519486693fe7bb566ac9450ee0812d` |
| fig-61.render.json | `3ddfffc211ff4a2f0b999b17996094c79a6e555b4260cecfcb235baf41930b17` |
| author-preview.json | `95058d857720cf6c938bc7394451228869ca0f32c651a46bcfb83789515fc6bb` |
| s18-t1 lesson.template.json | `38b5179aa3d0616061458de5ac8e8511495612fb672eb69beb71a383ef84e9f5` |
| s18-t1 exercises.template.json | `e1cfabcdfdda63775eddefc881de26090609a9b39b9745266c762b4926bef91e` |
| viewed stylesheet | `9fdcb8b3060e0cd0a6b97bf8a32f18c924b60a18226fa8c0d1a485221277168f` |

`spec.first-failure.json`、`source.inventory.first-failure.json`、
`validate.attempt-1.json`、attempt2/render/现有预览全部保留，不改历史。
用现有 `record_review.py --render fig-61.render.json --status fail`
写同目录 `review.json`，不生成pass。不改任何图/spec/源/模板/工具，
不晋升、不DB/Git/网络/模型服务。准确模型/推理设置/累计token未知。
