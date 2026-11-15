# STEMROBIN-180 源页 72–73：第一次修复独立复核

结论：**PASS（三处修复及原始 s13 装订传播）**。三处原缺陷均已消除；72/73 其余页级事实复用原独审，通过精确变更范围和未变原图哈希绑定。原 FAIL 报告保留，不覆盖历史结论。本次没有再次修源，也未触发“仍 FAIL 则 blocked”的条件。

审查时间：2026-11-15，Europe/Dublin。仓库：`/Users/yong/.codex/worktrees/0f12/lemmadeck`。

## 实际复核范围

仅实际重新打开三处受影响源像素，逐次一张内存条带：

| 原图 | 原页矩形 `[x,y,w,h]` | 直接读到的事实 |
|---|---|---|
| `.tmp/ld-s10y-lesson/6p/pages/0072/page.png` | `[145,1135,1195,80]` | `制机器时，工程师可以根据制作这台机器所需材料的密度及`，原字为“作”。 |
| `.tmp/ld-s10y-lesson/6p/pages/0073/page.png` | `[215,1380,1175,120]` | 练习 13（2）第二个对象为“铅弹”，下一印刷行是“吗？为什么？”。 |
| `.tmp/ld-s10y-lesson/6p/pages/0073/page.png` | `[425,780,795,115]` | 完整体积公式结果 `2.5 米³` 后没有句点。 |

未重新全量扫描 72/73 的其他像素，未扩大到其他页；没有制作落盘截图或临时脚本。另读取当前两页 MD/JSON/audit、新哈希及原始 `lessons/phy6-c3-s13/` 的 lesson/exercises，核对修复传播。

## 三处闭环

以下页文件位于 `ssot-resources/soviet10year-textbooks/artifacts/6p/pages/`；课程文件位于同册 `lessons/phy6-c3-s13/`。

| 原缺陷 | 当前页稿 / JSON | 原始装订传播 | 结果 |
|---|---|---|---|
| 72：“制作”误写“制造” | `0072/page.md` L64、`page.json` L143 / `blocks[8].lines[1]` 现为“根据制作这台机器” | `lesson.json` L16、L20–21 的正文及来源 `p0072#9`；`lesson.md` L5，均保留“制作” | PASS |
| 73：练习 13（2）漏“弹” | `0073/page.md` L70–71、`page.json` L167–168 / `blocks[10].lines` 现为完整“铅弹”及两行问句 | `exercises.json` L51–61：`number=g2-2`、`source_number=2`、`group=练习 13`、`group_id=g2`，来源 `p0073#11`；text 和 lines 均含“铅弹” | PASS |
| 73：体积公式末尾额外句点 | `0073/page.md` L52、`page.json` L95 / `blocks[4].lines[0]` 现以公式闭合 `$` 结束，无额外 `.` | `lesson.json` L96、L100–101，来源 `p0073#5`；`lesson.md` L21 同样无额外句点 | PASS |

来源标识 `p0072#9`、`p0073#5`、`p0073#11` 按当前装订文件的一基块序号，分别对应 JSON 零基 `blocks[8]`、`blocks[4]`、`blocks[10]`，不能错绑到相邻正文、公式说明或练习第一题。

只读现有 `tools/blocks.py` 得到的页块文本，与上述两段 `lesson.json` 正文和目标 exercise 的 text 精确一致；目标 exercise 的两条 lines 也与原页两条 lines 精确一致。三个来源在对应目标集合中均唯一。`lesson.md` 实际保留两个修复后的正文字符串。

原始 s13 `lesson.json` 的 id/card_id 为 `phy6-c3-s13`、印刷 §27、起始物理页 72 / 印刷页 61；`exercise_count=5` 与 `exercises.json` 的 count 和五题数组长度一致。这里没有以题数代替修复文字的核对。

## 复用其余已审事实的证据

- 原图 72、73 的 SHA-256 与首次审查完全相同，没有更换扫描页。
- 当前两页 MD frontmatter 与 JSON meta、所有逐行块体和块字段精确一致；实际原图哈希与各页 `render.sha256` 相符。当前计行仍为 25、23，audit 对应一致且 errors 为空；这是辅助证据，不是字形 PASS 的理由。
- **只在内存反向替换这三处修复**：72“制作”还原为旧“制造”；73“铅弹”还原为旧“铅”；73 指定公式末尾加回旧句点。所得四份 MD/JSON 的 SHA-256 精确恢复为：

| 反向还原对象 | 与旧独审完全相同的 SHA-256 |
|---|---|
| 72 MD | `25e868e8c55500f0bfa33bcaa75d33511ee15eb9679972bf131af93bd6e509f3` |
| 72 JSON | `c0b1e2dd7945a6d18791b15c27aa8571f24d258962828c1ed990423aec3f8af7` |
| 73 MD | `d38b7ddfa0a463bd77e8c37fa69f2a831242ea3bbb86901106251fcf503441ac` |
| 73 JSON | `aa3dc551b1226b90341e9501b0795f0ebc0e95df83f5e0d66e4f296f00323b3f` |

因此，相比原独审的页级快照，四份文件只发生这三处预期修复，没有其他字节改动；包括其他文字、公式、元数据及 open/cont 标记。可复用原报告的其他已审事实，不需要全量重复像素检查。反向替换没有写回任何文件。

## 明确不批准

- 本次只批准原始源页三处修复及原始 `phy6-c3-s13` lesson/exercises 的相应传播。
- **scratch s13 旧模板尚未刷新，不在本次批准范围**；未读取它来作为证据，也未刷新或批准它。
- 不批准现代 edition 的完整性、现代图、答案、交互、发布或生产 UI。不将母 agent 的全书装订数量作为这些阶段的证据。
- 原 `.intentfold/tickets/STEMROBIN-180/source-review-71-72.md` 和 `source-review-73.md` 的 FAIL 绑定旧字节，保持原状；这份 repaired 报告绑定新字节，不能覆盖或伪造旧审查结果。

## 新快照哈希

| 文件 | SHA-256 |
|---|---|
| `.tmp/ld-s10y-lesson/6p/pages/0072/page.png` | `aca99f0a17cdfeda8896c08eb8bc2d67ea3e4829db877b414e2e9bbbfe39424e` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0072/page.md` | `81f5881fd0f88c886a09b318796c2ddb7bcb7b2480470867aa1a71d2e9d206aa` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0072/page.json` | `35b66268daad2f9aae84a2eefdfd872260bd4a762e66c3a27b99b4db104550c0` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0072/audit.json` | `cec7ec84af0501bd9784a0167784b49517a8678fe7d63ace93f23e13786024df` |
| `.tmp/ld-s10y-lesson/6p/pages/0073/page.png` | `cf5214cbe38b989bf46b27e399dee9379df751434e18d25e27d0310cf8b1b586` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0073/page.md` | `1347defb0fe9a31cc4d783897389df3bf2ba5e80e1e4ffd58991c7884674f77a` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0073/page.json` | `d9dd89969ca923e43152127bc2e4a2fa50cb16bc11cb98f14a7f6e01b86205bb` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0073/audit.json` | `3ecb78a2e5431b869425acc607f9cb5cd6f2107a3082d7078969945dd178b070` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s13/lesson.json` | `35648886d1ae67e00ee51b553196354e72be82e8e31f722ecaad82ca881eda6c` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s13/lesson.md` | `97f2a34f4bf84ecef5333b10c92eff776437f4adb1fdb3948f02915d3a8ee1ba` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s13/exercises.json` | `dc9875c0b61a7e3046389eee4285363478a650068328cd99f6f382663e15c724` |
| `.intentfold/tickets/STEMROBIN-180/source-review-71-72.md`（保留旧 FAIL） | `9f03794aa9650ab61f8eb68cbfd92092e58066c43db5f0cea579a9bea6c365ec` |
| `.intentfold/tickets/STEMROBIN-180/source-review-73.md`（保留旧 FAIL） | `3ed2b839037a7d2bc05a72f05f0963397647663d831c0af7976eae47f20309dd` |

本次追加写集仅本文件。没有源修改、Git 操作、DB 连接、模型服务、assemble、finalize、scratch 刷新或其他写入，未撤销他人改动。第一次修复复核通过，三处缺陷不再需要修复；后续来源或装订文件改变时须重新绑定对应证据。
