# 7p SOURCE245246247 FIRST 独立审查

Reviewer: Codex independent reviewer，非作者 Wegener；唯一 full substantive FIRST。
Overall: **BLOCKED**。245 PASS；246 BLOCKED；247 PASS。未修复、未晋升、未装订。

## Findings

- **F246-1 / P2 / FAIL**：`p0246#2` 第2印刷行，原页第一圈号项以 `200°C;` 结束；当前稿将分号写成 `$200^\circ\mathrm{C}$，`。定位：[246 page.md:54](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-7p-245249/repair-246-01/artifacts/7p/pages/0246/page.md:54)。完整原页逐字读取，无细节裁图。246 已用 `repair-246-01`、预算 **1/1 耗尽**，直接 BLOCKED，不修。
- **F246-2 / P2 / FAIL**：`p0246#6` 第2印刷行，原文 `常用的燃料（煤、石油、汽油等）都含有碳.`；当前稿为 `汽油等等`，多一个“等”。定位：[246 page.md:78](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-7p-245249/repair-246-01/artifacts/7p/pages/0246/page.md:78)。同一完整原页证据；预算耗尽，不修。
- **H245247-1 / P2 / BLOCKED**：作者报告 [source-7p-245249.md:47](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/source-7p-245249.md:47) 宣称已有冻结 manifest/handoff，实际作者 root 的 `source-manifest.json`、`author-handoff.json`、`call-ledger.json`、`freeze-comparisons.json`、`repair-deltas.json` 均不存在。暂停检查点也记录最终 manifest/handoff 未生成。作者草稿、当前页和历史调用快照实际存在；不能称作者 handoff 已冻。只冻结本 reviewer 当前三页 input，未改作者。

## Scope And Counts

同 worktree `/Users/yong/.codex/worktrees/0f12/lemmadeck`，同 branch `codex/STEMROBIN-180-textbooks`。
Current SHA `31b1b46fd80841c5b92e065126b98efcfe5fa546`，只读 checkout 指针，没有执行 Git 命令。

实际审阅作者56块中的 **31块 / 61文字行 / 9题块 / 8独立题 / 2原图**。248、249只解析计数，共25块，不冒称审过。

| 物理/印刷页 | 当前 variant | 块/文字行/题块 | 逐页结论 | 已用预算 |
| --- | --- | --- | --- | --- |
| 245/234 | base | 13/24/7 | PASS | 0/1 |
| 246/235 | repair-246-01 | 9/24/2 | BLOCKED：F246-1、F246-2 | 1/1 |
| 247/236 | repair-247-01 | 9/13/0 | PASS | 1/1 |

## Full Source Results

245：13块逐字完整。`Q₂=4200×0.8×(40−25)=50400焦耳`、单位分式、乘减号和末句点正确；incoming244 `p0244#6 open` 的 `Q₂=c₂m₂(t₂−t₁)` 接本页首 `p cont`。两处源强调的全文范围均保留；原点状强调与粗斜体按作者已声明 notes 转 strong，未声称字体形状复刻，“实验表明”没有误入强调。五行热损失说明完整。问题1–4与练习46的1–3分组正确，920/0.22及第230页引用准确。末“冷却内”open，下一页“燃机）？”cont，未补字。无图、无脚注，`·234·` 两点保留，24/24行。

246：9块完整检查，除两项 FAIL 无其它发现。续题3与题4的五行、三圈号、1.5千克/200°C、50克/20→90°C、2吨/10→60°C均保留；圈号原首机械失败和唯一保形编码修复均保留。94标题与 TOC printed235吻合。分子分解六行、地球/锻锤比喻四行、燃料五行完整；强调仅“燃料”，图226引用及二氧化碳原子关系正确。24文字行＋1排图形墨迹对应原layout25排，caption与`·235·`完整。本页机械PASS不能豁免字词/标点FAIL。

247：9块逐字完整。1千克/充分燃烧定义、仅“燃料的燃烧值”加粗、字母q、焦耳/千克，千卡/千克或卡/克保持；修复后的第一单位分隔逗号与全原页吻合。实验/表引句完整。表caption区域 `[620,990,290,45]` 与图框 `[175,992,1157,882]` 真实相交，旧成功audit恢复恰一行；13正文/caption/footer行与13表内行分开，不遗漏或重复计表文。末`1.4×10⁷焦耳/千克或3400`保持open，未读取248像素或补其单位，不冒称跨页已闭合。`·236·`完整。

图226：full page、source PNG、完整native SVG栅格各实际看一次。左侧两空心带阴影氧球＋一黑碳球、向右箭头、右侧氧—碳—氧组合及留白均保留；裁图不含正文、caption或footer，无新增标签/答案。

燃烧值表：full page、source PNG、完整native SVG栅格各实际看一次。三栏、header＋12数据行、两条内部分栏及原上下/表头横线完整，无捏造外侧边线。逐行值如下（焦耳/千克；千卡/千克或卡/克）：

| 燃料 | q1 | q2 |
| --- | --- | --- |
| 干木柴 | 1.0×10⁷ | 2500 |
| 泥炭 | 1.4×10⁷ | 3400 |
| 莫斯科附近出产的褐煤 | 1.3×10⁷ | 3000 |
| 煤 | 2.7×10⁷—3.0×10⁷ | 6500—7500 |
| 酒精 | 2.7×10⁷ | 6500 |
| 无烟煤 | 3.0×10⁷ | 7500 |
| 木炭 | 3.4×10⁷ | 8000 |
| 天然气 | 4.4×10⁷ | 10500 |
| 石油 | 4.4×10⁷ | 10500 |
| 汽油 | 4.6×10⁷ | 11000 |
| 煤油 | 4.6×10⁷ | 11000 |
| 氢气 | 12×10⁷ | 30000 |

## Frozen Evidence And Reuse

Reviewer root `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-7p-245247-first`。

- `input-manifest.json`：只冻当前三页 MD/JSON/audit 内容、图片路径/哈希、原PDF/TOC/catalog/incoming244文字与历史调用。SHA256 `3bcc0de485e76f46f363f4f35850e523f52784805415b46f83669cb43e68e33f`。PDF SHA256 `46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`；catalog `7p→6-7p`，题号 `lesson-group`。
- `review.json`：31个块逐块观察、精准findings、表清单及counts；`reviewer-handoff.json`：当前SHA、输入/报告/review哈希、完成时绑定复核与真实结论。只记录独立审查，不伪造作者 handoff。
- 三页 current page.json SHA256：245 `a9558eb997a848a7eda442880871b08109e4116a6577c558aeeca743838f76d6`；246 `7a4d06bcb6f73e8e76470e904eb6e7b4410d8a41b7a3e9e358de5df19bd1469c`；247 `fdd0682c2994c73d54e224f8d61dc4020e452207a72beb7835387fb01838e956`。
- 已成功prepare/finalize/vectorize gate原样复用，不rerun；保留三页相关11 official调用（10 exit0、246首finalize exit1）及2 native观察调用。图226/表旧vector不匹配率0.030%/0.067%复用；247标点修复后SVG/native字节未变。历史工具epoch不假定等于当前epoch。
- 图片 **7/8**：fulloriginal3＋source2＋nativevector2；grid0、detail crop0、reopen0、旧244图片0。没有向父返回图片载荷。
- reviewer repair0、gate新增0、native新增0；作者/工具/app/deps/DB/Git改动0，browser0、残留exec0。只写本reviewer root及本ticket报告；既有239/242 blocker原样，不repair、不跨gap、不assemble/promote/canonical。
