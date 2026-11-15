# fig-16 一次修复后的独立复审

日期：2026-11-15。当前结论：**pass**。第一次结论仍为fail，以下区分两份快照；未晋升，不解除图15的独立失败。

## 原图与顺序

本次先重新实际打开原始PNG，再读取当前spec、完整九段authoritativeText和render，用本地Chromium打开当前完整SVG。原图三个阶段竖直排列，每组有左右侧壁，没有闭合顶盖、完整底边、标签、编号或计量格。首组空心主要在上、实心主要在下，界面清楚；中组界面附近交错并仍上下偏聚；末组两类散乱遍布整体。原图没有逐格异类相间，点数、半径、位置不是测量值。

全文涉及液体分层、几天界面模糊、两周均匀、扩散定义、持续无规则运动和向邻近层扩展的解释，以及其他扩散应用。本图只承担液体三阶段示意，不声称测得扩散时间或具体运动轨迹。

## 首次失败保留

首次五个文件完整留在 `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/fig-16/review-history/rejected-1/`。本次实际计算哈希，全部与先前拒绝快照一致，未改归档：

| 归档文件 | SHA-256 |
| --- | --- |
| fig-16.spec.json | `ad10df20574597fd36e6d96ea88a32b81dd3c6b6487926df9f07be63e780e4d1` |
| fig-16.svg | `e52b9c605b045316e007122fb49dc34f99d30663493d9241778dd8a842d71a75` |
| fig-16.render.json | `41ce1bce2dee214da1311c3253615a78d5a59cd929f8ca5bedf441f54d57f397` |
| independent-review.md | `2acef49421f61476b4946368fca71643721822cc90d97ef5bb05b2495fadcb9f` |
| fig-16.review.json | `f7fe2ea04f14b4b95d18196b3071d9b3f0440e8f2cff911a7f66dc348bc43091` |

第一次失败是中间混合带和末阶段严格空实棋盘式排布，坐标扰动不能消除异类邻接周期，容易把无规则扩散画成有序晶格。首次review仍为fail，原路径和原哈希保留；归档内原路径没有被偷偷重新绑定，不拿旧记录批准当前图。

此为作者一次修复后的第二次审查，不是审查者修图。改的是位置和类别分配，保留三阶段和明确声明的示意36+36；若第二次仍有实质缺陷，就应fail并停止，不再修。

## 当前实际哈希

| 角色与绝对路径 | SHA-256 |
| --- | --- |
| 源 `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-16.png` | `4e164c3b51a34d664ab9513608cc0d98f5c9fba6b5769503788cd8730c6cf673` |
| spec `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/fig-16/fig-16.spec.json` | `2408439ba0235921c4c96264649ed038e180e9b77d648be98a9b221799711e99` |
| SVG `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/fig-16/fig-16.svg` | `ebde96910cbbc3d90858e06d270698e25bbf989c65d12e5b0a337198d744b7bd` |
| render `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/fig-16/fig-16.render.json` | `e6917dbe918855f8ad39e1924cb38de65d95c15dd0c1d67b54857505042e01e5` |

全部实际由shasum对字节计算，不沿用旧图哈希。

## 逐阶段实质观察

**首阶段：pass。** 空心主要在上、实心主要在下，少量界面附近交错，界面是分布而非实体隔板。两侧壁和圆点完整，位置不再呈九列八行阵列，符合原图较清楚的分层。

**中阶段：pass。** 上部空心较多，下部实心较多，界面附近有不规则双向交错，没有第三类、交替棋盘带或提前画成全域均匀。保留从分层到部分混合的关系，而非要求原图每一点坐标逐个复刻。

**末阶段：pass。** 两类在上下左右均出现，无贯穿容器的清楚界面。可见同类小团簇和异类邻接，不严格逐行逐列交替；局部统计起伏不等于重新分层。当前72个圆的最近邻类别辅助核对为35个同类、37个异类，证明去掉了强制异类配对，但不是原图测量或随机性的数学证明。600、480、300px的完整画面支持整体混合而非晶格的独立视觉判断。

**计数与示意边界：pass。** 每阶段36实心+36空心，共216个轮廓。36+36、相等半径和最小距离是作者明确声明的示意布局，源无编号和计量格，不读成真实分子数比、浓度、粒子直径或间距。计数守恒无需每小区精确等数，也不作为完整溶液化学模型。

**完整显示、边界与文化：pass。** 实际打开600x1000整SVG，再按300x500、480x800显示，应用中性语义CSS并关闭页面内过渡；截图仅内存显示。三面板、最右圆、最下侧壁完整，216轮廓存在，300px空心中心仍可辨，透明polygon不变成新边框。没有圆点越界、重叠、标签、数值、轨迹、答案标记、文化符号或旧纸纹理。向量用语义角色，两类靠空实而不只颜色区分。无文字，render字号测量null，不冒称已测16px标签或生产页面。

只读坐标检查各阶段最小边界余量约12.11至12.45、圆间净间距约4.007至4.177，均为作者绘图单位，非源尺寸或真实粒间距。将每面板辅助分四个绘图高区：中阶段仍有上下浓度趋势，末阶段各区都含两类且非精确等数。辅助分区不是原图计量格。

## 验证与审批

实际validate_spec.py的draft、rendered阶段均退出0、输出PASS。render@2记录status pass、labels0、collisions空、300/480px检查pass，spec/SVG哈希与本报告相同。结构通过不能代替上述实质检查。

首次缺陷在此一次修复快照已消除，未发现第二次实质失败；当前允许记录hash-bound review@1 pass，作为图16独立图审批准。审查者不晋升，持久路径重绑、lesson/product门禁须作者另行完成；图15第二次碰撞失败不会因本图pass解锁。

本轮只重写current independent-review.md和fig-16.review.json，归档不变。精确审查模型ID、推理设置及完整模型token用量不可观察，未知。

实际record_review.py使用当前spec/render、status pass和上述修复观察记录，退出0、输出 `PASS: fig-16 -> .tmp/s10y-image/fig-16/fig-16.review.json`。随后Node重算当前source/spec/render/SVG四项哈希均相等，且确认首次归档status fail、旧spec/render/SVG三项归档字节匹配旧绑定，退出0。第一份五文件的完整哈希另已核对如上。

## 持久晋升绑定

上文保留独立审查当时的原始路径与历史哈希，未伪造新的视觉检查。作者仅复制当前 spec 和 SVG 到同目录的 `fig-16.spec.json`、`fig-16.svg`；重新渲染 `fig-16.render.json` 只指向持久文件，实际断言 SVG 与独立批准字节完全一致。spec 仍为 `2408439ba0235921c4c96264649ed038e180e9b77d648be98a9b221799711e99`，SVG 仍为 `ebde96910cbbc3d90858e06d270698e25bbf989c65d12e5b0a337198d744b7bd`。同目录 `fig-16.review.json` 绑定持久 source/spec/render/SVG；现代资源运行时不依赖上文的 scratch 或拒绝快照。

本图通过不等于扩散课已完整：原文引用的彩图 I 下图仍需定位、核对和补齐，§9 的图 15 独立阻塞也仍保留。
