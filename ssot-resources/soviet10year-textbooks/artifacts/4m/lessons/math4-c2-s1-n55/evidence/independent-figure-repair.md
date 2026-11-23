# N55 图214修稿限定独审

日期：2026-11-23。
唯一根：`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`。
课：`math4-c2-s1-n55`，55《小数的数位》。

## 范围、计数与历史保留

在零图的两项文字补核并保存 `independent-comparison-supplement.md` 后，仅打开本次指定的 `.tmp/stemrobin-187/n55/previews/fig-214-repair.png` 一次。新增图片1，累计 **17/24**。没有重开任何原页、原PNG、212/213现代预览或214旧预览，没有额外裁图/截图。

依据沿用已冻结的图214源inventory：两种代表个体，甲虫三对六腿、蜘蛛四对八腿；男孩和展示板不携带题目收藏数量。此次只核修稿的腿连身、仍6/8腿、头身搭接、无文化或答案泄漏及指定预览可读性，不重新转写源或重解933，不读答案/键、其他课或env/DB。

两份FIRST不改。上一 `independent-figure-review.md` 的REVISE原字节保留，SHA-256为 `07c1677693dea67ce5340e5fa84ca0298ecf8939dba0675c398798474758834f`。该旧失败对应旧spec/render/SVG，未改写为PASS。212/213既有限定PASS直接复用，本批不重核它们。

本文件不是 `ld-s10y-image/review@1`，不调用record_review、checker、renderer、promote或APP，不批准wholeLesson。

## 当前候选绑定

| 实际文件，路径相对于唯一根 | 当前SHA-256 |
| --- | --- |
| `.tmp/stemrobin-187/n55/previews/fig-214-repair.png` | `4fa15fe3f5eba54d6689434e36643a592d192362d679238235c4d250fbd1ff24` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/figures/fig-214.spec.json` | `14095625e3cbbc17c3b52dad9e9f8cf71655ed3a66ce9d9801f4f90129734c87` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/figures/fig-214.render.json` | `32f80721455dd603dc48f82d6ba12918b9275115907793aedb94ce201eb5b55f` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/figures/fig-214.svg` | `0fd3f7039745e4bfaf0635f911513301b4a4571b3f1dcd41ae72d0a660316033` |
| `.tmp/ld-s10y-lesson/adapt/4m/modern-us-neutral/lessons/math4-c2-s1-n55/exercises.template.json` | `cc0ab943a9e981a11e78d81edbd52b55d12ea0b37242bd61eaa67385e2183f54` |

当前render记录的spec和SVG持久路径/hash与上述实际文件一致。spec的 `source.image` 沿用已独立冻结的原图214路径及SHA-256 `68bd73a641039ecfc0d06b6ceca1d35846c58007d4835d912377d00b283a705c`，本批未重开原PNG。

spec的 `authoritativeText` 与当前模板933的实际 `text` 完全相等：Ben收集两类数量相等，合计308只脚，问各类数量。此处只核文字绑定，不计算答案。

## 限定结论

**PASS：当前图214修稿的源数学关系、腿/头身连接、计数、非泄漏与指定单张预览视觉scope。**

原来Spider最上方左右两条腿与身体之间的白隙，在这张新预览中已经消失；每条腿都可沿线追到本类身体。甲虫顶部两腿也接入身体轮廓。两类各一个代表个体，腿分别可辨为左右三条和左右四条，没有用动物收藏数量代替腿数示意。

本结论来自实际单次目视与当前spec/SVG对应关系核对，不是直接沿用render的pass标记。未发现本次受影响范围仍有真实断裂、缺腿、遮挡、标签截断或答案泄漏。

## 蜘蛛：八个身体附着点

当前 `spider-body` center=(625,195)、radius=60。四对腿的起点如下，坐标均为当前spec的现代画布坐标，不声称为原图像素：

| 腿索引 | 左侧起点 | 右侧起点 | 对应新增断言 |
| --- | --- | --- | --- |
| 0 | (601.0208423834364,250) | (648.9791576165636,250) | `spider-leg-0-left-body-attachment`、`spider-leg-0-right-body-attachment` |
| 1 | (570.4564394268215,220) | (679.5435605731785,220) | `spider-leg-1-left-body-attachment`、`spider-leg-1-right-body-attachment` |
| 2 | (565.208696284493,190) | (684.791303715507,190) | `spider-leg-2-left-body-attachment`、`spider-leg-2-right-body-attachment` |
| 3 | (576.2660282759551,160) | (673.7339717240449,160) | `spider-leg-3-left-body-attachment`、`spider-leg-3-right-body-attachment` |

八条新增断言全部为 `pointOnCircle`，各绑定对应腿的start，center/radius与当前身体对象一致；全部八个起点距圆心为60，浮点计算最大绝对偏差约 `4.27e-14`。它们完整列入 `spider-schematic` inventory的assertions，原八条segment端点 `connects` 也保留。因此本候选不再仅检验segment连接自身端点，而明确检验各start在当前身体圆周。

SVG的y坐标是 `390-y`：四对start分别位于y=140、170、200、230，x与spec相同；八条线段均从这些身体轮廓点朝外端延伸。新预览中四对腿均与轮廓相接，起点圆标记不形成脱离身体的悬浮点，不与上方头部误连。

八个 `spider-leg-*` segment仍在；`spider-leg-count`仍为8。实际目视也有左右各四条彼此分开的腿，未以八segment计数代替视觉判断。

## 甲虫与两类头身

甲虫腿靠身端的x由中心225向左右偏移36，分别为189/261；原来44的偏移不再使用。顶部腿polygon靠身两角的y为238/242，至圆心距离分别约56.08和59.20，均在radius60内，polygon向外延伸时实际穿过身体轮廓。中、下两对也连入轮廓。

新预览可清楚辨出左右各三条甲虫腿，共六条；没有把头部圆圈、腿轮廓的两条边或触角当作额外腿。六个 `beetle-leg-*` polygon及 `beetle-leg-count=6` 保留。薄双边轮廓是腿的现代画法，不是每边算一腿。

两动物身体的y中心都是195、radius60，头中心y都是270、radius25；头身圆心距75，小于半径和85，形成10画布单位的搭接。SVG头中心y=120、身体中心y=195，与该搭接一致。预览头身相接，没有新白隙或把头画成另一个收藏个体。

## 非泄漏、文化与可读性

SVG实际可见text只有 `Beetle` 和 `Spider`，字号32，预览标签完整清晰。图内未出现解题结果、方程、收藏总数或每类收藏数；两代表动物不能被解释成“每类只收藏一只”的统计数据。

预览没有中文/西里尔文化标记、制服、旗帜或源扫描装饰。男孩、两块展示板、触角装饰和照片式外观仍被spec明确声明为非数学叙事省略，不影响本题6/8腿参考。圆形身体、腿角度、圆点和所有坐标均是现代regularization，不冒充原像素。

本次单张850×390预览的标签、身体轮廓及全部腿清楚可辨，两个个体分离，线条没有遮住标签或跨接到另一种动物。已有render报告在instructional/scroll、media width640、minTextPx16下记录 `measuredMinPx=24.093589743589742`、无collision且status=pass；这只是当前候选的已有尺寸证据。本审没有再缩图或做APP、桌面/手机、多主题/打印实测，限定PASS不包括这些未观察范围。

## 收束

完成本次单图affected-only修稿复核，累计17/24。只写本 `independent-figure-repair.md`；当前spec/render/SVG/预览未修改，FIRST和上一REVISE保留。父方依当前hash处理正式record_review；本审不写review@1、不批准wholeLesson、不执行DB/env、paid、安装、APP、commit/push或其他聊天。
