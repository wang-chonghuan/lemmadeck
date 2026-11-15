# 物理37至42页 F1至F4 一次修复独立复核

日期：2026-11-15。STEMROBIN-180既有短时独立审查者，不是源页或装订作者。

## 限定结论

**本次四处源字修复及其在s8源正文/练习中的传播：转写文字PASS。** 恢复的是原印文字，不是修订原书物理结论或登记源印勘误。0042保持原样；问题4现在正确跨页接成“如何解释液体的可压缩性极小？为什么液体不能保持一定的形状？”，与0040液体随容器改变形状的正文自洽。

**不批准§14整体完整。** 彩图II仍未收口，当前s8清单没有其金原子照片和金晶体模型；首次报告关于未收口裁图的发现继续有效。本结论不包含图件审批、现代版完整性、题审、产品或生产发布。另彩图I上图当前第二版已独立记录FAIL，不因本次文字PASS而解锁。图15/17及新彩图均未晋升。

## 首次拒绝证据保持

首次完整六页/彩图I/II检查报告没有改写：

- 原报告：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/source-37-42-review.md`
- 作者持久拒绝副本：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/source-review-37-42-rejected-1.md`

实际执行cmp退出0，并用Node逐字节比较确认两文件完全相同；两者SHA-256均为 `5626c3b365dd719dc34153e2b7498ed578f02fd0392ed06f3fafb3676f7cae86`。首次拒绝结论属于旧快照，保留历史，不改写成旧稿曾经通过。

本轮对0037/0038/0039/0042的page.md和page.json逐一重算哈希，均与首次已检查快照相同；六页原PNG哈希也全部未变。因此沿用首次逐页逐行、图号、题号及跨页检查证据，不声称本轮再次完整打开这四页。0042没有新增“不”、没有改“持”，也没有修改它的任何块。

## 实际重开与四处独立读字

先重新实际打开以下完整原PNG，再放大原像素疑点；放大图只在内存显示，没有输出新文件：

- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/6p/pages/0040/page.png`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/6p/pages/0041/page.png`

随后完整读取当前两页page.md/page.json以及s8的lesson.md、lesson.json、exercises.json，不读取答案或选择题稿。

| 首次发现 | 当前页稿及原PNG独立核对 | 装订传播 | 判断 |
| --- | --- | --- | --- |
| F1：0041 `p0041#10` 漏“不” | 当前“为什么液体不能保”，放大原PNG可明确读出“不” | s8问题4的第一片恢复“不能保”，第二片仍为0042“持一定的形状？”；来源仍`p0041#10`和`p0042#1` | PASS；否定已恢复，未篡改续页 |
| F2：0041 `p0041#2`第4行改写源比喻 | 当前“附近象钟摆一样地运动”，原PNG也是“象钟摆”，不是“经常作摆动” | s8晶体段恢复“象钟摆”，忠实层未擅改成“像” | PASS |
| F3：同一原行末漏“动” | 当前“由于粒子不能移动”，原PNG行末确有“动”；下一行仍“到距这一位置……” | s8拼成“由于粒子不能移动到距这一位置较远的地方” | PASS；没有吞掉下一行的“到” |
| F4：0040 `p0040#4`第3行“已”转“是” | 当前“相互吸引已很显著”，原PNG放大同为“已” | s8液体段同样恢复“已很显著” | PASS |

## 实际只读结构和回归核对

调用现有 `.claude/skills/ld-s10y-lesson/tools/blocks.py` 的parse和printed_lines，对当前MD在内存解析；0040/0041行数分别19/25，与各自meta.printed_lines一致。解析结果与持久page.json的meta及全部正文/结构字段相同；比较时只排除finalize为fig-24派生的图ID字段，不忽略任何源字、行、open/cont、题号或图框。

将首次保存的页块结构作为旧快照，仅施加F1至F4的四个精确替换后，与当前两页逐块逐字段比较并实际断言相等。变化是三条印刷行：0040一行、0041晶体行两处修复、0041问题4一行；其余行、块数、顺序、栏目、图号及跨页标记不变。两页meta.errata均为空，没有把转写错误登记为源印errata。

同样对完整s8源lesson.json作新旧比较：只有引用`p0040#4`的段传播F4、引用`p0041#2`的段传播F2/F3；其他正文、来源引用、图清单、课号等字段全部与首次快照相同。lesson.md含完整对应正文，修复字一致。

完整exercises.json与首次六题快照比较：只有问题4的text及第一条lines传播F1；其他五题、题号、分组、全部来源引用和图引用字段不变。实际断言问题4的text等于两条lines顺序拼接，来源恰为`p0041#10`和`p0042#1`，没有混入30/31页码，六题数量不变。

这些是本审查者实际执行的只读解析/差异/哈希断言。没有重新运行会写文件的finalize或assemble，也不把作者运行它们的通知当成自己的命令证据。

## 当前实际字节SHA-256

以下路径的持久源根目录为 `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p`；PNG另在上列scratch路径。哈希均用Node对真实文件字节计算，不是猜测或canonical JSON digest。

| 当前输入 | SHA-256 |
| --- | --- |
| `pages/0040/page.md` | `795788175a2b402f14dab1485bbcdb520f11ad9bb0f7e78e9e53a003c90e38de` |
| `pages/0040/page.json` | `0f910a8a7872afadfbf27113c747700e7040bdc35da502483b4bd639dc9f29bc` |
| 原 `0040/page.png` | `589fab9afc68c038e3548758f9ba9bbf4bd546065fa50b80f7fc5638fc8633ef` |
| `pages/0041/page.md` | `eb967a3976ac5cc3231fe87c801c23e7ca352d77eb41c4229f0a7f9b1d6dd618` |
| `pages/0041/page.json` | `977eb4d3bea777b1bf7559ef1f8238ed7134d05b50f88c72b3db97d5c3e1a365` |
| 原 `0041/page.png` | `2d2231d81c2a898827330aabea6d861d405462d9c5db6345b31e69ca2702d481` |
| `lessons/phy6-c2-s8/lesson.json` | `49cbc599488a18ad02b4fc45ef421cdb57e3a66ac8e8d4cacfdbecdb53776a48` |
| `lessons/phy6-c2-s8/lesson.md` | `76ce4dabaf73bb89d4576eec5ff62f3eebb53bb0de49245eb038a8a9218d5361` |
| `lessons/phy6-c2-s8/exercises.json` | `0bb4b1b7193d84b714ef82dfa118ac4db7c704ca4b872469fd74c15eb40f8110` |

## 权限与可观察计量

本复核只新写此报告，不改源、课文、页稿、errata、图件、题稿、生产库或分支；不查答案、Plane、.env、其他会话，不消息监督者，不晋升。此前彩图I上图只写独立报告并由record_review.py记录hash-bound FAIL；源/spec/render/SVG及首次图件拒绝历史哈希已验证未漂移。

精确模型ID、推理设置及完整模型token计量不可观察，明确未知；逐工具输出中的局部token数不是模型总用量。报告完成后停止。
