# STEMROBIN-180/180-3 b82 最后视觉观察

日期：2026-11-18。结论：本次指定的 6 张截图显示观察 PASS，未发现需报告的显示缺陷。

## 范围与计数

- 唯一 cwd：`/Users/yong/.codex/worktrees/0f12/lemmadeck`；所有 shell 显式使用此绝对 workdir。
- 已有 `tmp/b82-display/report.json` 为本批 headless checker PASS、18 页；本次仅读取结果，没有重跑 checker、render、18 页断言或全套检查。
- 实际 `view_image`：6 次、6 张，每张仅打开 1 次；重开 0、裁剪图 0、其他图片读取 0，未超过每批 8 图。
- 新截图：2 张，均为 n103 的 fig232 区域。隔离 Playwright 使用现有 app 依赖，`channel: 'chrome', headless: true`；仅打开已有离线 n103 `text.html`，等待 `document.fonts.ready`，滚动后捕获视口截图。
- 任务拥有的 1 个浏览器及 2 个隔离 context 已在 finally 中关闭，命令 exit 0；未使用用户窗口、持久 profile、CDP 或 headed 模式。
- 新增模型调用 0；新增图服务调用 0。未联系聊天、未派代理；未修改内容、工具、Git、DB 或既有检查结果。
- 仅为同批显示检查的最后视觉观察，不是 headed 线上验收；不重新审批课文、选择题，不重新审查已批准图的来源、数学或文化。

## 具体观察

- n105 exercises / 1440×960：练习51末题第7题的教师实验室演示文字完整，包括具备化学实验安全条件、通风且远离火源，以及不要自行取用液体或操作的限制。题号、正文、分隔线和回课文按钮分开，字体与行距清楚，无文字重叠。
- n105 exercises / 390×844：末题第7题从“观察教师在实验室中的演示”到“不要自行取用这些液体或操作”全部可见；多行换行完整，未截断末行，题号不压正文，按钮留有间距。
- n105 choices / 1440×960：末题第5题题干和 a、b、c、d 四项全部可见；每项圆形控件与文字分列，行距清楚，无重叠或缺尾。
- n105 choices / 390×844：末题第5题题干及 a–d 四项完整，含 d 项最后一句；换行保持在文字列内，圆形控件未压字，无文字重叠。
- n103 fig232 / 1440×960：完整容器轮廓、颗粒与上下箭头清楚，主体未裁切；图内无可见文字 label，图题“图 232”可读。图与图题同时在视口内，图题在图下、后续正文之前，无重叠。
- n103 fig232 / 390×844：完整容器、颗粒与箭头仍可辨，未横向或纵向裁切；“图 232”居中紧邻图下，随后才出现“开口容器中的液体常会逐渐减少……”正文，无图题与正文重叠。
- 补拍时两视口 fonts 均为 loaded；图区域分别高 360 / 201.375 px，图题紧接 `#fig-232` 的 `.figcap`，其 DOM 边界距图区域底部均为 3.1875 px，图题之后的元素为 P。截图实际观察与此顺序一致，新 renderer 未将 caption 放到正文之后。

## 六图路径与 SHA-256

以下顺序也是实际打开顺序，每项 `view_image` 计数均为 1：

```text
1 /Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b82-display/phy7-c1-s2-n105-exercises-1440.png
  a8a91540a2b9207ac7402a09bbf23d0fdc4563e005460b622e6cf8c2b24d78c8
2 /Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b82-display/phy7-c1-s2-n105-exercises-390.png
  a6b917de83a570cdfe151e41bc782607951cb10e167adc145743e2f60c099839
3 /Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b82-display/phy7-c1-s2-n105-choices-1440.png
  eff5e001218e858bc3a1a62b1bb352ed7af250a4d413e1b01ea07308f0d0947f
4 /Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b82-display/phy7-c1-s2-n105-choices-390.png
  89ee89475cf4a0479e2490e1220c50fc76d7a8cd793621f5bcdd3029f728a40d
5 /Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b82-display/phy7-c1-s2-n103-figure-1440.png
  49f90773f82f590c55f6d5685a4c0dbec1a29a56afdacf4fc82f0b5b668432ee
6 /Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b82-display/phy7-c1-s2-n103-figure-390.png
  0345e543f92de2cc7f8d935cb3a868c800a9101712a13a049348fdb6458efa2f
```

必要临时截图脚本：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b82-display/n103-figure-screenshots.mjs`。
