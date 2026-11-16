# 10c p15/p16 Limit Row Diagnostic

角色：只读计行诊断，不是 source 重新审查或工具修复批准。复用 Confucius 已冻结的真实横排22/20；不以 audit 的24/23推定源文字，不删下标、换行或正文。

结论：**五处错误已逐处复现；保守单条件修复 STOP**。当前证据不支持通过增大统一 gap、禁用高带展开、把所有 `_single_fraction_row=True` 都当真实分式等单一放宽覆盖五处且保持真实跨行。父方可据下列具体机制继续决定最小工具修复；本轮未改生产代码或源层。

## Inputs And Reproduction

- 冻结观察：`tmp/transcription-review-10c-p15-p18.md`，SHA256 `4118a801804bdb872e18e1f661edf4d97975a2d06fe982e8bc1818af0f8d21e4`。
- 实际 production：`.claude/skills/ld-s10y-lesson/tools/layout.py`，SHA256 `887b464fbf1bf8bef65d6a6070e29475dc01100fa154abf84d69dce82ad18fc7`。
- p15原PNG：`.tmp/ld-s10y-lesson/10c/pages/0015/page.png`，SHA256 `eb8a734d0f3823857b8fbc1f9c72eed5c40a7486fece8e80548e69cbf80a0a41`；原layout SHA256 `f46f916975450338d5fa463b039d281ed2d5fa5b1572c9e8300b563fa45a54a9`。
- p16原PNG：对应`0016/page.png`，SHA256 `ccecddca9bd0eee706caea1de7612167a0e164e446b2b7874bc592d3c0698340`；原layout SHA256 `93dfdbcd477649c6660995e6d5ad2ab3372754c49add4993ca7ff9834394e173`。
- 两页均1695×2580，无题图遮罩或count_exclusions。原目录没有持久countmask；scratch mask来自现有`ink_mask`、`counting_ink(...,[])`及生产`line_bands`自身清理阶段的内存副本，不是新墨迹算法。

脚本：`tmp/10c-p15-p16-limit-row-diagnostic.py`。仅静态import当前layout并捕获生产函数locals，未复制一份替代计行器。每页生产`line_bands`调用一次，其输出必须与既存layout逐带完全相同；这项断言实际成立。保存PNG/MD/JSON/audit/layout的前后hash，全部未变。

实际命令：

```sh
PYTHONDONTWRITEBYTECODE=1 .claude/skills/ld-s10y-lesson/.venv/bin/python \
  .intentfold/tickets/STEMROBIN-184/tmp/10c-p15-p16-limit-row-diagnostic.py \
  --out .intentfold/tickets/STEMROBIN-184/tmp/10c-limit-row-diagnostic-first
```

真实exit **1**，因为下列五区与冻结横排不符，不是诊断脚本运行失败。`guarded_files_unchanged=true`。全部raw trace、分式判断locals、连通域完整box、mask及局部叠线图位于`tmp/10c-limit-row-diagnostic-first/`，核心证据`diagnostic.json`。输出目录必须全新，脚本不覆盖既有证据。

## Concrete Defects

| 实际源横排 | production结果 | 真实机制 |
|---|---|---|
| p15第14行，单行正弦极限 | `[1438,1474]`、`[1492,1506]`，多1 | 下标作为独立短带未合并，非高带展开 |
| p15第20–21行，“于是”加一行高商式 | 三个等高切片`[2016,2085]`、`[2086,2155]`、`[2156,2225]`，多1 | 先把两条真实横排合进一个高带，再按pitch估成3 |
| p16第4行，题32/33/34同排 | `[540,585]`、`[586,630]`，多1 | 下标跨列叠加的投影高度误作第二条正文行 |
| p16第5行，题35/36/37同排 | `[677,727]`、`[728,779]`，多1 | 同上 |
| p16第6行，题38/39同排 | `[803,859]`、`[860,916]`，多1 | 同上 |

### p15 Single Limit Attachment

实测`line_h=43`、`glyph_h=40`、`merge_gap=16`。主带高度37、下标带高度15；前后端点差18，所以layout.py:327的简单gap条件不成立。

主带x范围677–1029，宽353；下标带x范围678–750，宽73。layout.py:343比较整带中心和，差278，大于容差43，故`aligned=false`。同时73/353约0.207，低于layout.py:367的0.65，紧凑居中分式路径也不成立。`fraction_spill`要求更高的主带：37既未达1.8×43，也未达短下标分支的1.35×43。因此join阶段仍是两带，展开阶段分别保持count1；错误不是“lim被高带拆成两行”。

完整局部证据：`0015-sine-limit-source-row-14.png`，裁框`[0,1426,1695,93]`。本轮实际局部观察确认下方是同一lim的下标，不能将它删掉或改正文换行凑数。

### p15 Two Real Rows Collapsed Then Overexpanded

实际“于是”投影为2016–2060；高商式最上方分子从2073起，随后为2084–2194及2205–2225。前两者端点差13≤merge_gap16，且`separate_tall_rows`的两边高度门槛不成立，所以第一轮已经合成2016–2225，join阶段仍保留该带；`fraction_starts`为空。

展开时高210，`typical_gap=34`、`pitch=77`，layout.py:414计算`round((210+34)/77)=3`。本带强投影只有一组2087–2189，因此layout.py:427要求“strong_rows恰两组”的3→2修正不触发。整带 `_single_fraction_row` 在43和40尺度均False，无法阻止3个等高切片。切片边界并不是三个真实正文行的边界。

限定额外诊断仅对同一保存mask调用现有helper，未重跑页面计数：商式自身2073–2225在43尺度 `_single_fraction_row=True`；把“于是”加进去后False。故这里的关键是第一轮错误吸收上一条正文，不能归因于“现有helper完全不会识别这条高分式”。

局部证据：`0015-thus-and-limit-source-rows-20-21.png`，裁框`[0,2004,1695,234]`，本轮已实际打开。

### p16 Projection Is Not A Glyph Baseline

实测`line_h=46`、`glyph_h=45`、`merge_gap=18`、`typical_gap=39`、`pitch=85`。三排进入展开前分别已经正确合成540–630、677–779、803–916；错误发生在layout.py:396–426。

名为`glyph_rows`的变量实际上来自`_row_fragments`的整宽y投影，并不是独立全尺寸字形。三个下方投影带分别592–630（高39）、731–779（高49）、874–916（高43），于是均与上方主带组成`compact_text_rows=true`，count至少2。

然而在这些下方范围内，真实完整连通域的最高字形分别仅17、21、22px；满足现有0.6×glyph_h（27px）高度及0.2×glyph_h宽度条件的完整字形域均为0。小型`x→...`、分式分子/分母错开在不同列，合在整宽投影中看起来像高39–49px的一排。不能用这种投影高度证明另一条正文基线存在。

三排完整调用 `_single_fraction_row` 在46/45尺度均False，`rules=[]`，在layout.py:188直接返回；小分式位于lim下标，不满足当前全带尺度的分式候选条件。这里既不是分子/分母应分别计行，也不是并排题应分别计行。

局部证据：

- `0016-parallel-limits-source-row-4.png`，`[0,528,1695,115]`；本轮已实际打开。
- `0016-parallel-limits-source-row-5.png`，`[0,665,1695,127]`。
- `0016-parallel-limits-source-row-6.png`，`[0,791,1695,138]`。

## Conservative Boundary / STOP

不能把`_single_fraction_row=True`直接升级为可靠的“分式存在”证据：p15正弦极限局部的规则候选实际落在等号x870–900；限定诊断中，“于是”自身2016–2060也返回True，候选落在汉字水平笔画x388–427。当前helper的True是启发式单行结果，不是数学符号识别。

必须保留的反例对照是p16题41的两条cases分支。完整区域1209–1370，现有生产count2，两个尺度helper均False；第二分支有真实完整字形（例如x855、y1325、40×46和x1022、y1326、46×45）。`0016-cases-source-rows-10-11-control.png`裁框`[0,1197,1695,186]`。所以“凡多投影都合为1”或“凡高公式都不展开”会漏掉真实第二分支。

单个可以提出但**不足以获准实施**的保守约束是：**新增一条计数行必须有独立全尺寸正文基线证据，不能仅凭分散小下标的整宽投影高度或等高pitch切片。** 它解释p16三处假基线，却还没有解决p15的局部下标归属和“于是”与高分子邻近时的合法分界，且不得误删真实独立短商数。因此本轮STOP在“尚无同时安全覆盖五处的单个generic修复条件”，不伪称候选已过回归或数学source审查。

## Limits And Retention

没有读取旧tests设计或运行tests、prepare、finalize、assemble、validator、browser、服务、网络或DB；未打开p18或猜未决字母体系，index7–14不动。本轮只重用冻结正文事实并看三个必要局部诊断图，不重复原页全文转写审查。

所有当前production返回带、mask、局部图及首次失败保留。限定额外统计的第一条辅助`python -c`在解析阶段SyntaxError、exit1，没有执行计数或写文件；随后修正命令仅统计现存mask/JSON并调用helper，exit0。两者不是prepare/finalize或第二次页面计数。首次诊断脚本及数据未改写。
