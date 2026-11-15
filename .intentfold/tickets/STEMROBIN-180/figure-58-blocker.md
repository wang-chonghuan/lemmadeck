# fig-58 Independent Review

2026-11-15。独立审查者 Sagan，不是 Faraday 作者。
**FAIL：下方弯板与两支承块的接触几何失真，render PASS不能放行。**

## Finding

`b-board` 在左右支承块内侧穿入矩形块内部，而不是在支承面上承托。
实际完整640px、306px滚动两端和480px打印均可看到弯板斜穿支承块上部。
原PNG放大复核：弯板在块的内缘上表面附近承托，中间下弯，
没有当前图这样明显的实体穿入。问题是接触/承重关系，不是无刻度示意比例。

当前SVG屏幕布局坐标中，左支承块范围x80..170、y435..575，
`b-board` 的主体上边曲线从(125,425)经控制点(320,525)到(515,425)；
在支承块内缘x170，上/下边约y445.414/y455.414，均在支承块上表面y435之下。
右内缘x470同样如此。这些是实际SVG诊断坐标，不是原图给定测量。
`b-left-contact`/`b-right-contact` 在x125/515上的点以及水平/下挠断言
没有约束真正的board路径不穿入support多边形，因此机械断言PASS不足。
中央砝码确实接触板的上边、上下箭头方向也正确，不能抵消支承失真。

已用一次修复，当前不批准；不自行修spec/SVG，不进行第三稿或晋升。

## Final Snapshot and Actual Viewing

仓库 `/Users/yong/.codex/worktrees/0f12/lemmadeck`；以下路径相对此仓库。
作者第二次render退出0、render PASS；author-preview绑定当前所有产物，
`repairsUsed=1`、`furtherRepairAllowed=false`。审前与收口快照一致。

实际打开
`ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-58.png`，
并在本地浏览器放大完整源图后再次与完整 `fig-58.svg` 比较。
读当前spec全文；完整authoritativeText与s17现代template上层标题、
全部文字prose及2道exercises逐项相等。复用全文审阅，不读作者解或keys。

headed Chromium用现有 `app/src/styles/app.css` 实看neutral/accent全幅640px、
306px滚动左右端及480px打印。滚动媒体640px，终点334px实际可达；
5标签屏幕24px、打印18px，均在SVG边界内。截图为工具实际输出，
未创建截图文件，亦不声称已检查生产页面。

## Complete Independent Source Inventory

| Source group | Pixel observation | Current comparison |
| --- | --- | --- |
| 上a | 平直薄木板放在两个分开的矩形支承块上；无砝码、无力箭头；原а。 | a平直、两支持、空载保留；现代 `Unloaded board` 是说明，不是源标签。 |
| 下b | 相同两支持，木板中间下弯；中央带小提环的砝码接板；中央实线箭头上/下相反；原б。 | b中部下挠、重物/提环及同轴上弹力/下重力完整，a/b不倒置；但两支持与实际弯板路径相交，FAIL。 |
| 全图 | 木纹/黑白印刷，不含数字、单位、刻度或明确虚线。 | 木纹省略，SVG无dash线；没有虚构数值或文化符号。 |

等长相反箭头属于现代正文最终平衡状态的示意添加，非原墨线测得的力比；
不能解释成“运动物体在力首次相等瞬间必然停住”。正文原印“一小段时间”
保持未改，图无时间/位移标尺。微小未标名构造点、规则支承形状与坐标是
现代布局，不是源给定点。英文力名描述课文已说明的两力，无选择键泄漏。
字体和文化检查通过，但**装置接触源保真未通过**。

## Real Hashes and Gate Results

独立 `validate_spec.py --stage rendered` 实际PASS，现render PASS。
独立视觉/装置检查FAIL，两者必须分开记录。

| Input | SHA256 |
| --- | --- |
| source fig-58.png | `1a578460ea64c04c140c0294fd50678dfc189ac971d85ccb38a30b9edc89a0f4` |
| spec.json | `d98c6c3db00e4e17b9d1a262582dbce0019caddc253197113b4bd79d95ea5711` |
| fig-58.svg | `673c6e99275682374f4c95f216df23c8d001b959ef82677f0d7a865e486e06fa` |
| fig-58.render.json | `ec2ae5b9f55270a933bb9d610132687ddfb87825b5f2317c4bb8a4a3225fcc3b` |
| author-preview.json | `8bdf79204531f66f3ef6f5f3c8178d7c631fcdde109c7a288d9c892fec79e9dc` |
| s17 lesson.template.json | `df47070681d36b1de93c49fa741255fc32ac28ce25d00037bf7f043cb8200285` |
| s17 exercises.template.json | `41c19d185426aa5a7e77ca89096a9f7393ae41693724dd38fa2ee4fe0a9d1743` |
| viewed stylesheet | `9fdcb8b3060e0cd0a6b97bf8a32f18c924b60a18226fa8c0d1a485221277168f` |

初次失败spec、source.inventory及attempt记录均保留，不覆盖。
以现有 `record_review.py --render fig-58.render.json --status fail`
生成同目录 `review.json`。只写本报告和review；未改源/模板/图/工具，
未晋升、DB、Git、网络或模型服务。准确模型/推理设置/累计token未知。
