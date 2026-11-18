# B83 DISPLAY 纯视觉复核

日期：2026-11-18。结论：**发现 1 项 P3 DISPLAY 缺陷，不声明无缺陷 PASS**。正文、公式、图181、滚动表格、已实看的手机题目与选项布局通过；缺陷仅为 n144 副标题的可见格式标记。

## 范围与执行

- 工作目录固定为 `/Users/yong/.codex/worktrees/0f12/lemmadeck`，所有 shell 均显式指定该 workdir。
- 已读 AGENTS.md、.intentfold/readme.md、engineering.md、operations.md、ld-s10y-image 图片批次规则和 ips-chrome-background。
- 复核完整批 n144 / n65 / n75 的现有证据。沿用 **headless、真实离线 file 页面、内容只读**范围，不是线上验证，也不是 formal product AC。
- 实际查看指定完整截图 **8/8**，每张只打开一次；未裁图、缩图另存、重开图片或重跑浏览器。图片解码观察只发生于这 8 次 view_image；随后读取 PNG 文件头和 SHA-256 不产生新的视觉观察。
- 未打开源图、模板、答案文件，未重做内容语义或源忠实性审查。仅只读检查现有 DISPLAY 脚本及其图像断言实现，以解释机械证据边界；未执行这些浏览器脚本。
- 本轮仅写本文件及工单 `tmp/b83-display-visual/evidence.json`。无 DB、服务、图生成、安装、应用编辑、Git/index、checkpoint、usage、其他聊天或后代操作。

## 可复现缺陷

**DISPLAY-B83-01 / P3：n144 章节副标题漏出字面 Markdown 星号。**

在以下 3 张已实看截图中，标题下一行、印刷页 355 前，均直接显示 `**电功和电功率**`，包括前后各两个星号；副标题没有按强调文本显示。

1. `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-display/phy7-c2-s3-n144-text-1440.png`
2. `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-display/phy7-c2-s3-n144-text-390.png`
3. `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-display/phy7-c2-s3-n144-choices-390.png`

复现方法：查看上述现存完整 PNG 的顶部副标题行，不需要源图、重新渲染或新浏览器。预期为无格式标记的章节标签。该问题是截图中的格式残留，不是对章节文字语义的重新审查。现有脚本只断言 h1 不含 `**`，并未覆盖副标题，因此与 16 页机械 PASS 不矛盾。没有修复或改动原输出。

## 8 张实际观察

所有截图均位于 `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-display/`。下表尺寸来自 PNG 文件头，非推测视口尺寸。

| # | 文件 | 完整 PNG 尺寸 | 实际视觉观察 |
|---|---|---|---|
| 1 | phy7-c2-s3-n144-text-1440.png | 1440 x 2162 | 正文、独立公式、例题两列表格、末端计算及跳转按钮分区清楚；表格两列完整可见，无重叠。副标题存在 DISPLAY-B83-01。 |
| 2 | phy7-c2-s3-n144-text-390.png | 390 x 2401 | 正文正常换行；公式和末端按钮可见。表格保持大字与固定媒体宽度，右列在局部滚动容器右缘截显，不是整页横向溢出；截图不能单独证明右端可达。副标题存在同一缺陷。 |
| 3 | phy7-c2-s3-n144-choices-390.png | 390 x 1123 | 2 题均完整可读，各 a-d 共 8 个选项；首题方形控件、次题圆形控件，标签与公式错开，无遮挡；末项 d 可见。副标题存在同一缺陷。 |
| 4 | phy8-c4-s2-n65-text-1440.png | 1440 x 4047 | 正文、向量、上下标和分式均正常呈现；图181完整且非空白，标签、箭头与图注可辨；例题计算到末端按钮均可见，无相互覆盖。 |
| 5 | phy8-c4-s2-n65-text-390.png | 390 x 4525 | 长标题换行不遮挡后文；图181完整缩放、比例正常，F、v1、v2、X、s 可辨；分式及长计算式在内容宽度内，无横向整页裁切；末端按钮可见。 |
| 6 | phy8-c4-s2-n65-exercises-390.png | 390 x 1528 | 习题 1-9 均实际可见；第6题的多段题干和第9题的多个问句完整，题目间分隔清楚，无遮挡；回课文按钮可见。 |
| 7 | phy8-c4-s2-n65-choices-390.png | 390 x 2723 | 5 题均实际可见，选项数分别为 4/5/4/4/4，共 21 项；第二题为方形控件，其余为圆形；分式、根式、指数正常呈现。长选项及句末标点有换行，但没有重叠或消失，末题末项完整。 |
| 8 | phy8-c4-s2-n75-text-390.png | 390 x 2743 | 全文段落、长句换行与最后一段可读，无重叠；末端“去做题 · 0 道”按钮可见，未出现选择题入口。不据此推断按钮的运行时行为。 |

未实看 n144 exercises 手机图或 n75 exercises 手机图，也未查看额外桌面习题/选择题图；它们只纳入现有机械报告的 16 页范围，不冒充本轮视觉覆盖。

## 机械证据与限制

读取并只读核对：

- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-display/report.json`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-display/first-failure.json`
- 工单 tmp 下的 `b83-display-check.first.mjs`、`b83-display-check.mjs`，以及 `check_product.mjs` 的既有图像断言实现；未重跑。

报告为 `status=pass`、`headless=true`，16 个唯一真实页面 = 8 desktop + 8 mobile，均 `overflow=0`、`formulaErrors=0`、`lastVisible=true`。首失败记录的 8 个 desktop completed 条目与最终报告桌面条目逐项相等，接续完成 mobile 8 页；不存在把失败的 n75 choices 页面计入 PASS 的情况。

n75 的 choices.html 缺失是零选择题合同，报告分别记录 desktop/mobile `expectedAbsent=true`。首轮 `ERR_FILE_NOT_FOUND` 是脚本误访问该缺失页，不是内容 DISPLAY 缺陷；保留失败记录，复用已通过的桌面证据。本轮新增浏览器页面数为 0。

媒体实测来自报告：n144 表格 desktop/mobile 均为 **640 x 440 px**；n65 图181 desktop 为 **640 x 320 px**，mobile 为 **358 x 179 px**。图181两者宽高比均为 2，手机表格没有为适应窄屏而缩小整张媒体。

截图不能提供精确 computed font-size，也不能展示未截入的表格右端。以下只归属于**既有通过断言**，不是本轮新执行或新目测结果：

- `assertActualFigureText` 使用 SVG text 的 computed font-size 与 getScreenCTM 的实际缩放，断言不低于 FigureSpec 的 minTextPx，且该最低值至少为 16 px。此数值不扩展为正文、所有 KaTeX 上下标或每个子字形均至少 16 px。
- `assertPublishedFigure` 检查实际媒体宽高、图形元素非空、当前 SVG 一致性，并设 scrollLeft 到末端后验证 atEnd。n144 手机图右列当前截显与可横向到达末端并不矛盾；最右端细节本轮没有重新目测。
- `assertFigurePixels` 在现有滚动检查中仅计媒体区域绘制像素，排除图注/边框/原生滚动条，以最大可见绘制像素数 >100 证明非空；不是本轮新裁图，也不保证每个滚动片段都非空。
- 原页面检查等待字体就绪，监听 pageerror，并断言没有 HTTP(S) 请求。报告不包含独立网络明细，本轮只沿用现有通过检查，不声明新的网络审计。
- choices 检查题数、每题选项数、disabled 控件数及 radio/checkbox 类型，并断言 HTML 不含 `displayAnswer`、`seed_sha256`、`"correct":`。本轮视觉上没有答案高亮；三个指定键的阴性断言不扩展为全面安全审计或对所有可能私钥字段的证明。
- `lastVisible=true` 来自原脚本 scrollIntoViewIfNeeded、isVisible 及横向边界断言；8 张完整截图另外支持其各自可见的末题/末项/跳转区域。没有测试提交、评分、线上卡片或 OS/ headed 专属行为。

## Hash 绑定

SHA-256：

```text
report.json
a06325234a71d8f4e8f7b61f67868b51687026c25777aca3e012619f32abd1c0
first-failure.json
c4cc882f4d9d3564f29ce34de9ba283b92856580a27b04d10b57e0061c6b7d27
```

8 张原截图逐项 SHA-256、尺寸、打开次数与既有脚本 hash 记录于本轮唯一临时输出：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-display-visual/evidence.json`。
