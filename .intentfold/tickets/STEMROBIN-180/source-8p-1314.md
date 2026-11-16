# 8p Physical 13/14 SOURCE Author Handoff

2026-11-16. STEMROBIN-180/C 同一已授权 cap3 离线续作。
状态：两页当前 SOURCE 作者包已冻结，独立 SOURCE 审批仍待进行。
不是完整引言、完整课程、装订或发布交付；没有开启新 capability、更新技能或改动工单。

## 冻结身份

隔离根：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-1314`

[Frozen Handoff](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-1314/freeze/handoff.md)
：4020 bytes，SHA-256
`bc142d6d02e71712169fa4f7ac1a4f7bf86239c7bed35c5bb46871a00afefcd6`。

[Frozen Manifest](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-1314/freeze/manifest.json)
：15736 bytes，84 个冻结文件，SHA-256
`c7e763fe92663a54c86b7c5e625c555fdc9c6a278fb77143d1b00dcefc28988f`。

[Outgoing 14 Boundary Only](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-1314/freeze/outgoing14-boundary-only.json)
：1552 bytes，SHA-256
`ff9433c30536abd28c207b2cf76b74125a07f8a15bc9d2a0064c7fa74b1ab5fb`。

## 直接观察

Main 的 `8p-source-entry.json` 所绑源、TOC 和源 manifest 原始字节/哈希均核对一致。
8p 自有 PDF SHA-256 为
`4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46`；
TOC SHA-256 为
`5a8b0e5a4a95f6bd2cdb998e39d4288d051570ab61123b004739be1e085b413f`。
沿用 Main 已验证的 309 扫描页、0 嵌入字体、0 非空白文字层字符证据；未重新 prepare。

实际像素确认物理 13 页脚为印刷 1，物理 14 页脚为印刷 2。
这只确认授权的两个映射点，不套用 7p 偏移、不外推未看页。
物理 13 的 h1/h2/h3 依次对应运动学、第一章运动的一般知识、引言，
与 TOC `phy8-c1 / phy8-c1-s1 / phy8-c1-s1-t1`（起始印刷 1）相符。
物理 14 无新标题。

| 物理页 | 印刷页 | 块数 | 印刷/MD 行 | 文字/分隔线行 | 图 | 可见习题 |
|---|---|---|---|---|---|---|
| 13 | 1 | 7 | 19/19 | 19/0 | 0 | 0 |
| 14 | 2 | 11 | 27/27 | 26/1 | 0 | 0 |

当前 audit 均为 0 errors、0 normalizations、0 unknown_chars。
第 14 页实际脚注横线计 1 版面行，脚注小字计 2 文字行；不是补空行或伪造习题。
圈号以等价 HTML numeric entity 保存；正文着重点、黑体、嵌套倾斜字形、
印刷页脚及未闭合正文均保留于 MD/JSON，原始 PNG 同时冻结。
两页无可见习题或栏目号，ExerciseNumbering 为 **UNSET**，scope verified 为 false。
不得从 7p 或本两页推断 book/lesson/lesson-group；首批习题像素建立范围前不装订。

## FIRST 与唯一修复

解释器使用用户指定的已证明路径；加 `-B` 防止在工具目录写 Python 缓存。
全部 finalize 通过 Main 不可覆盖的 `record-step.mjs`，CWD 为指定仓库。

| 标签 | 实际 exit | 修复累计 |
|---|---|---|
| `batch26-8p-source13-finalize-first` | 0 | 0/1 |
| `batch26-8p-source14-finalize-first` | 1 | 0/1（FIRST 当时） |
| `batch26-8p-source14-finalize-repair-01` | 0 | 1/1，已耗尽 |

第 14 页 FIRST 因说明字段含 frontmatter 分隔符发生
`JSONDecodeError: Unterminated string`，尚未创建 page JSON/audit。
FIRST stdout 为 0 bytes；stderr 为 1504 bytes，SHA-256
`071b05990a19475dd4f8a69e7786ac3fcb463c24dae2ce135573e210eb9ec632`。
FIRST call JSON 为 1013 bytes，SHA-256
`f1d4ce1de5bca99aac2783dcbf6b7e098a1e42bbb23347d188da670292d0f303`。
失败时 MD 为 4843 bytes，SHA-256
`688623abbd5fb8fea1d188a83143ea360a37b5068547fe9d8330debf108fea29`。

失败流、call、原样 MD 及无 JSON/audit 的实际状态保留在
`freeze/failure-first/0014/`，未重置、覆盖或隐藏。
唯一修复仅改一条 notes 说明，不改变正文、脚注或横线；
修复调用前的已修复输入保留在 `freeze/repair-01/0014/page.md`。
第 13 页成功未重跑，第 14 页修复成功未重跑。工具、wrapper、源绑定和 work 输入哈希未变。
两页 prepare 各为 Main 既有 1 次 exit 0，本作者 prepare 重跑为 0。

## 给 Main 的边界元数据

Main 仅可把上列 `outgoing14-boundary-only.json` 转给独立 15/16 作者：

- 最后实际块：`p0014#11`，kind `foot`，cont false，open false，印刷页 2。
- 最后正文块：`p0014#8`，kind `p`，cont false，open true，4 印刷行。
- 本页首正文块：`p0014#1`，kind `p`，cont true，open false。
- 脚注横线 `p0014#9` 与闭合脚注 `p0014#10` 不属于未闭合正文；脚注引用 `p0014#7`。
- 继承标题 `h1 p0013#1 / h2 p0013#2 / h3 p0013#3`；
  TOC card 为 `phy8-c1-s1-t1`，物理 14 无新标题。
- 无需 closed/open 文本片段，故未附任何正文；没有图片、候选路径或审批授予。
- 作者向下游直接传输为 0；SOURCE approval 保持 pending。

## 实际预算与边界

图像读取 8/8 batch，8/24 context：自有源页 2 次、必要自有裁片 6 次，
reopen 0、parent image opens 0、own figure 0、inflight 0。
逐次图像路径/原始 SHA/bytes 见冻结 `image-ledger.json`；
原始命令及 stdout/stderr/call 见冻结 `commands/main/` 与本作者 `commands/`。

只在授权隔离根及本持久交接文档写入；Main wrapper 自行写其明确授权的命令证据目录。
未触碰其他作者编辑，没有 git、环境、DB、网络、服务、安装、依赖、app、schema、
源 manifest/config、7p、modern、choices、private answers、canonical promotion、
assembly、publishing 或 closure 操作。两页作者事实不代替独立 SOURCE 审批。
