# B83 副标题受影响 DISPLAY 复核

日期：2026-11-18。结果：**DISPLAYPASS，仅 DISPLAY-B83-01 / phy7-c2-s3-n144 的受影响标题区**。四张指定截图均未发现字面 Markdown 残留、重叠或遮挡；标题、章节文字和印刷页标签不变。不声明原整批、图审或 formal product AC 的新 PASS。

## 范围

- 所有 shell 均显式 `workdir=/Users/yong/.codex/worktrees/0f12/lemmadeck`。
- 首先读取 AGENTS.md、lesson SKILL、production-resume、image 图片批次规则、ips-chrome-background 和原 `display-review-b83.md`，并读取已有 `tmp/b83-subtitle/report.json`；该 tmp 位于工单目录下，不在 checkout 根目录。
- 只复核已发现的 DISPLAY-B83-01。原报告保持不变；不重新进行完整工具、课件内容、来源忠实性或图片审查。
- 唯一新增写入为本报告及 `tmp/b83-subtitle-review/evidence.json`。未修改候选/source/code/index/usage/checkpoint，未执行 Git、DB、服务、发布、其他聊天或后代操作。

## 四图目视

下列 PNG 都是已有标题区截图，位于 `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-subtitle/`。每张实际打开一次，共 **4 图 / 4 次**；尺寸只读自 PNG 文件头。

| 文件 | PNG 尺寸 | 实际观察 |
|---|---|---|
| text-1440.png | 1440 x 122 | `144. 电功` 完整；章节名强调显示，无 `**`；`印刷页 355` 清楚，标题与副标题无重叠或遮挡。 |
| text-390.png | 390 x 106 | 手机标题和副标题分行清楚；章节名、页标签完整，无字面 Markdown、重叠或遮挡。 |
| exercises-390.png | 390 x 106 | `144. 电功 · 习题` 完整；章节名及 `印刷页 355` 保留，无星号或遮挡。 |
| choices-390.png | 390 x 106 | `144. 电功 · 选择题` 完整；章节名及页标签可读，标题区无 Markdown 残留、重叠或遮挡。 |

共同可见副标题为 `电功和电功率 · 印刷页 355`。未打开 exercises-1440.png、choices-1440.png、原整批截图或源图；未新裁图、重开、另存缩图或生成截图。

## 字符串与已有证据

已有 `report.json` 记录 partial render `--titles-only` 退出码 **0**，以及 isolated headless 的 **3 surface x 2 viewport = 6 页面**标题断言 PASS。只读现存脚本确认其使用 headless Chrome、独立 context，断言章节和页标签的 `innerText`、strong 文本及 h1/crumb 不交叠和横向边界。这些是父级已执行证据，不是本轮新执行或六张新目视。

本轮另做一次不启动 renderer/browser 的只读纯字符串及 SHA-256 核对：text、exercises、choices 的 FIRST 快照和当前 HTML 均与已有报告哈希一致，且每个当前 HTML 严格等于 FIRST HTML 仅替换以下唯一一处：

```html
<div class="crumb">**电功和电功率** · 印刷页 355</div>
```

替换为：

```html
<div class="crumb"><strong>电功和电功率</strong> · 印刷页 355</div>
```

因此三个 HTML 的 h1、crumb 外 body、CSS、figure、习题及 options 逐字不变；改变仅为章节强调的格式输出。canonical 课件/图/答案/题不变沿用父报告和用户给定范围，不冒充本轮新内容审查。

四张标题区像素观察与该唯一差异共同支持 **DISPLAY-B83-01 受影响 DISPLAYPASS，未发现具体缺陷**。正文、图、滚动表格、题目与选项的视觉结果沿用原证据，不因本次标题复核扩展覆盖。

## 用量与绑定

本轮：**4 图，零付费调用 / $0，零 renderer 重跑，零 browser 重跑 / 新页面，零新截图 / 新裁图**。原 16 页整批和图审均未重跑。

已有报告 SHA-256：

```text
bb90e3676067ae9d5c94a4c23299defc3b0768bb1c7841e87c466c9eadcc3c6c
```

逐图 SHA-256、尺寸、打开次数、三个 HTML 的前后哈希、原报告及既有脚本绑定记录在：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-subtitle-review/evidence.json`。
