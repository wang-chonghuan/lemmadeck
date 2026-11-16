# STEMROBIN-180: n96 Modern TEXT Author

2026-11-16。C 仅现代中文 TEXT 作者。
状态 `authorfrozen_pending_FIRST_textreview`；FIRST 独立完整文本审查尚未进行。
不自批准，不宣称 SOURCE 重新审查、完整课程 finalize 或可发布。

## Scope And Source

仅写 `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-7p-n96/`
和本报告，其他会话的改动保持不动。无 Git 或聊天操作。
AGENTS、readme、Charter、当前 lesson modern 契约、edition text contract、
production `edition.validate_text`、来源绑定、数学勘误及数字策略已读。
本次是已分配工单的隔离文本子任务，不调用 IntentFold 能力或 backend。

TOC 身份为 `phy7-c1-s2-n96`，不是 s1。印刷243-244对应物理254-255；
下一单元从印刷245开始。本课源正文 JSON/Markdown 和4道完整书写题均已读。
复用批准并保留的 canonical `lessons/phy7-c1-s2-n96/`：
8个正文对象、问题栏 g1 的1-4题、0图、0公式。
SOURCE 审阅 `source-review-7p-254255.md` 为 PASS，覆盖18页块、46印刷行。
254末段与255首段合成一个完整对象，保留 `p0254#7 / p0255#1` 与原§14引用。
不读取257或前缺口内容，不执行 SOURCE 审阅、收口或装订门禁。

Main 的隔离 approved-7p-254255 assemble 一次 exit0和 adapt-prepare 一次 exit0
复用，不再次执行。保留现有 double-adapt 目录：
`adapt/adapt/7p/modern-us-neutral/lessons/phy7-c1-s2-n96/`。
继承命令没有记录历史工具 SHA，明确未知，不用当前 epoch 倒填。

85项输入的原始路径、字节数和 SHA256、完整文本与工具字节副本见作者根
`source-input-manifest.json`；PDF仅冻结原始哈希，不打开或渲染图片。
共同PDF SHA256 `46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`。
canonical book 仅冻结本课条目与book/numbering投影，不绑定其他作者可变条目；
投影 SHA256 `b0e3050fe5ad3b972915d9dbc1972495c34679aa6fd53394cc6da858705bb410`。
全部来源正文、题目、254255页 JSON/MD/audit、三模板与 SOURCE 审阅上下文
保存在 `source-context.json` 和 `inputs/`。

## Modern Wording

8个原始正文对象的 kind/id/label/printed_page/source_refs、课程印刷身份、
完整 `source.data` 和逐块 `source_text` 均保持不变。
生产、四类合金、蒸汽推动涡轮机、制冷、水循环、露云雪、
冬季结冰及春季熔化等原例全部保留，句意完整且适合儿童阅读。
合金成分取决于材料及配比，不把熔化本身写成产生新成分；
云雪说明区分小水滴与冰晶，不把雪说成液态凝结物。

以水等分子物质、且没有化学反应为范围，说明相变通常不改变分子组成，
但排列、间距、运动和相互作用不同，状态还取决于温度与压强条件。
不宣称所有材料都由独立分子构成，不宣称不同状态中位置及运动相同。
气体保留大气压条件并限定通常稀薄气体；液固态保留密度、密集排列、
平均动能与吸引作用的比较，不把分子写成停止运动或绝无分子能离开。

明确原书“只把晶体视为固体”是本节历史简化，非晶体也是固体。
晶体用“微粒”说明规则排列，分子晶体才具体称为分子。
保留正向相变即使温度不变仍增加内能的完整重点，说明吸收的热量可用于
克服吸引、改变排列或间距并增加相互作用势能；反向相变释放能量并减少内能。
不扩展成新公式、物性数据、实验操作或后续课程。

问题1-4的原范围、顺序和唯一“问题”分组不变；
仅整理中文，不给答案提示、不增反向或恒温小问、不改成选择题或输入交互。
`errata=[]`、全部 `numeric_changes=[]`、全部原数学与数字签名不变。
未发明来源数学勘误。历史简化澄清是明示文本调整，不是数学勘误豁免。
完整原文/现代文本及12个转换对象断言在 `author-context.json`。

## Single Mechanics And Budget

一次 production layout normalize、一次真实 `prose_flow.mjs --stdin`、
一次完整 TEXT contract、其内部一次 KaTeX，均 exit0。
153项检查全部通过，0错误，12个原文/现代转换对象，0公式；
KaTeX实际输入 `[]`，不是跳过或推测通过。
最终14个正文短段，3个概念分界来自真实相邻段落的精确 before/after 文本；
解析位置5/6/10仅记录输出，不按块手算，不重跑 flow。

argv/cwd/stdin、stdout/stderr/exit及每次调用前后的完整工具 epoch
保存在 `commands/`。三个顶层检查调用内工具字节均未变化；
当前 shared htmlfrag/render_lesson 只是本次观察到的 epoch，
不要求它们等于历史 SOURCE 作者的显示 epoch，不更改任何稳定工具。
`text-mechanics.json` 保留完整检查结果；prose 与题目检查均为生产契约适配，
不调用完整 figure gate、`validate_lesson`、adapt-finalize或现有 full tests。

首次失败0，修复 **0/1已用、1剩余**；额度包含任何机械或语义修复，
与 SOURCE/figure 预算无关。FIRST独立文本审查仍 pending，不与作者机械通过混同。

## Exact Candidate Bytes

三模板位于作者根上述 double-adapt 课程目录，均为 draft：

| Template | Bytes | SHA256 |
| --- | ---: | --- |
| lesson.template.json | 15751 | `206c42783797e93043ded2a107af7ffc3a542dc13a622d0abc387819ba55935a` |
| exercises.template.json | 4838 | `62352d22baa5b5fcff230e07d6a9ce05bc0d2530705ebdbf40b65d34d8c062a5` |
| figures.template.json | 153 | `0593f235eed96f880794903c355638b91ff5c0c53f0006169a32b62af152ba4a` |

零图 figures 模板字节不变。候选完成后只追加本报告和冻结上下文/manifest/handoff，
不再改候选文本、不重跑已成功检查。
`author-manifest.json` 绑定所有作者材料和本报告；
`author-handoff.json` 绑定精确三模板、完整上下文、输入清单、结果、报告、预算及计数。
交接状态固定 `authorfrozen_pending_FIRST_textreview`。

新 prepare/assemble/source gates/adapt-finalize/render/native/answer/choice/full tests
执行均0。canonical/source/tools/index/app/DB/publish/Git/backend/chats写入均0。
图片打开0，任务求解0，浏览器0，服务0，后台作业0；所有命令已退出，无 in-flight。
