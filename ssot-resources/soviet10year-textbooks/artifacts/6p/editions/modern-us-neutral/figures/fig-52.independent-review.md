# fig-52 Independent Review

2026-11-15。独立审查者 Sagan；作者为用户指定的 Faraday，本人不是作者。
**PASS：当前图可用于现代正文的球/弹簧作用示意；不是课程或答案审批。**

## Final Snapshot and Actual Viewing

仓库 `/Users/yong/.codex/worktrees/0f12/lemmadeck`；以下路径相对此仓库。
检查 `authoring.json`、`author-preview.json` 和 `render-command.attempt-2.json`：
作者第二次渲染退出0，render PASS，预览绑定当前spec/SVG/render，
`repairsUsed=1`、`furtherRepairAllowed=false`。审前与收口哈希一致；
只审此最终稿，不以作者预览PASS代替独立视觉结论。

实际打开完整原图
`ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-52.png`。
读 `spec.json`，其中完整 `source.authoritativeText` 与 s15 现代template
上层标题、全部有文字prose和4道exercises逐项完全相等。
复用此前全文语义审阅，不看作者答案或计划。

在本地headed Chromium实际载入完整 `fig-52.svg` 和现有
`app/src/styles/app.css`：neutral/accent全幅640px、306px滚动窗口左右端、
480px打印。媒体在滚动窗口中仍为640px；实际滚动终点334px可达。
全部6标签为英文/Latin a,b，屏幕24px、打印18px，全部在SVG边界内。
截图实际显示于工具输出，未写新的截图文件；不是生产页面/DB审批。

## Independent Pixel Inventory and Comparison

| Source group | Pixel observation | Current SVG finding |
| --- | --- | --- |
| 左a | 手贴住球左上侧；球落在水平底面；球右侧接水平压缩弹簧；弹簧右端抵固定竖壁；穿球实线箭头向右。原а标签，无数字/单位。 | a在上面：球、底面、右壁和弹簧连接完整，短弹簧紧密，箭头向右；`Hand push`明确代替手的轮廓，作用语义保留。 |
| 右b | 无手；同类球仍在底面并接更长弹簧左端；固定壁在右；穿球箭头向左；原б标签。 | b在下面：较长弹簧推球向左，球仍接弹簧/底面；不误画成手继续压缩，不交换a/b。 |
| 状态关系 | 相同实验的压缩/伸长两状态，无刻度、测量比例或虚线。 | 两态同球半径、同右壁布局，b弹簧明显长于a；无刻度或数值，SVG无dash线。 |

手的自然轮廓是明确声明的符号化替换，不声称现代图保留了手像素。
英文 `Compressed spring`、`Expanding spring`、`Spring push` 来自现代正文；
它们描述已讲述的实验状态，不添加题目答案、测量值或选择键。
堆叠布局、规则化线圈、相同示意球半径及微小未标名构造点是现代绘图，
不是原图给定的粒子、坐标或数值。两箭头长度不作力大小的跨态比较。

检查源库存映射、指向/连接断言及实际图元：球—弹簧—右壁和球—底面
均相接；a/b源标签对应Latin a/b正确。无文化符号、制服、旗帜或旧书纹理。
neutral与accent方向一致，打印不依赖颜色才能辨认。**未发现实质缺陷。**

## Hashes and Gates

均为当前文件真实字节SHA256；独立执行 `validate_spec.py --stage rendered`
实际PASS。当前 `fig-52.render.json` PASS；未重跑render或修改任何图文件。

| Input | SHA256 |
| --- | --- |
| source fig-52.png | `2a00c2f13dbabab7267da089a72bdd309ca98b2c96e57a517d3a36444e4952fe` |
| spec.json | `69aa6192c883557e764a80df4f0bd1d58654f5ca4c99e4754ed75e0bdfc4d791` |
| fig-52.svg | `5f945ccbf76a3566c48c0a6c6bd0efc21fe4d926f710d9c475b71566e3d2849b` |
| fig-52.render.json | `205ea6000ebf45ee696528bcf4bb5876ca462f031d50ed08b5f9d5a06907d228` |
| author-preview.json | `263442d1f50ef2028adb839b8b746297d195ed7f9e980d6e9b8b890efa61d923` |
| s15 lesson.template.json | `6220965c96d575ebfc474309626cd54ea94605703c43f4f5c4bb73d021cadae8` |
| s15 exercises.template.json | `794143435f24a4a53d42bad7e37effa574dd172b4ed9c26f2ba06787223962c4` |
| viewed stylesheet | `9fdcb8b3060e0cd0a6b97bf8a32f18c924b60a18226fa8c0d1a485221277168f` |

作者初次失败 `spec.first-failure.json`、`source.inventory.first-failure.json`
及attempt记录原样保留。用现有 `record_review.py --render fig-52.render.json`
记录同目录 `review.json` 为pass。不晋升、不修图、不改源/模板/工具，
不读keys，不DB/Git/网络/模型服务。准确模型ID、推理设置与累计token未知。
