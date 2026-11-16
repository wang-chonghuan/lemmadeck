# physical48 同门禁 affected-only 复核

## 结论与边界

**PASS，本次48限定修复。** 原StageB的110/112接续空格问题已准确修复；真实脚注分隔线的separator-rule排除框合法且不覆盖题文、译注或folio；notes[5]正确区分首次稿与后续修复。实际保存的targeted finalize为25/25、exit0、errors=[]。

此结论由原48内容PASS与本次严格限定diff复用合成，不是重新全页审查、重新计行或答题。原26/25 firstFAIL、初次StageB REVISE和完整初稿均保留，不改写历史结论。49修订未读、未审、未放行。

角色：STEMROBIN-184 worker B，48原独立SOURCE reviewer，同一门禁changed-only复核，不是修稿作者。授权来自现有工单下母方委托，不冒称新的逐题人类批准。

根目录 `/Users/yong/.codex/worktrees/a07e/lemmadeck`；T为根下 `.intentfold/tickets/STEMROBIN-184/tmp`。

## 已冻结证据复用

- StageA最终：`T/source-review-9g-p48-p49-source-first.md`，rawSHA `51b5b00b8166ef8ffe6aa5343d1c9e597f183998fc2b35de1e9f5fc58f9b3acf`。
- 初次48StageB：`T/source-review-9g-p48.md`，rawSHA `65c7d71c6afa92324bb3dd9b285c26e2e86ce1b1f3741a5eb5191233f6a88a24`。
- 原48题文、全部数学、星号/空心圆、117 open、脚注及folio内容PASS复用，不重新逐题核数学或重数横排。
- 原PNG rawSHA仍为 `da3df874a53f44755c010140615c32d0981cc8cde74540269fa76c6bfb8cd76a`，本轮只取哈希，没有打开整页。
- 本次读取已授权 `T/source-9g-p48-targeted-repair.md`、`T/9g-p48-count-diagnostic/`的记录/前后稿/实际命令streams；仅对已保存局部strip做一次original-detail观察。

## 两处行尾空格

| 位置 | 旧值 | 当前末尾 | 字节结论 |
| --- | --- | --- | --- |
| `p0048#1`，110第2排；JSON `blocks[0].lines[1]` | `求作角 $B_1$ 的平分线.` | `求作角 $B_1$ 的平分线. ` | 恰好追加一个U+0020 |
| `p0048#3`，112第2排；JSON `blocks[2].lines[1]` | `哪些性质不成立.` | `哪些性质不成立. ` | 恰好追加一个U+0020 |

实际是**每排一个ASCII空格，合计两个**，不是每排两个。两处尾部码点均为 `[46,32]`（原句点+ASCII空格）。符合初次StageB的最小缺失范围；没有去掉112源句点、替换标点、另起行或重排小问。

只读字节比较真实输出：

```text
onlyExpectedTwoSpacesInBlocks: true
两处 exactlyOneU0020Appended: true
mdBodyOnlyTwoSpaces: true
```

## separator-rule确切几何

当前frontmatter及audit同一记录：

```json
{
  "kind": "separator-rule",
  "box": [138,1874,456,18],
  "reason": "The native strip shows only the thin footnote separator at x146-585/y1880-1885 in this box; the real teaching footnote starts at y1915 and the complete folio at y1982. Counting copy only, with all source text, footnote and original pixels retained."
}
```

本次独立实际打开的是既存 `separator-foot-folio-native.png`，原页框 `[0,1840,1506,195]`，不是整页、不是新crop。画面明确显示薄分隔横线、其下完整星号译注、再下decorated41。它与此前StageA已观察的脚注分隔线身份一致。

已保存诊断定位（不重新运行counter）：

- 旧额外band24是横线，inclusive `x146–585/y1880–1885`，宽440、高6。
- 本次box的半开范围为 `x[138,594)、y[1874,1892)`，完整包住该薄横线，并仅多出周边空白。
- 题文最后一排保存范围止于y1805，box从1874起，不覆盖题文。
- 真实译注保存范围为y1915–1946，box止于1892之前，不覆盖译注或星号。
- folio保存范围为y1982–2011，完全在box下方，不覆盖41或装饰点。

所以该框仅排除**separator-rule**，不是把正文当scan-artifact遮掉；该种类适用于已观察薄分隔横线，不要求伪装成外缘5%噪点。本轮未加其他exclusion、mask、人工期望行数、虚假公式断点，也未删除文字行。

diagnostic `report.json` 的 `counter_invocations:0/finalize_invocations:0`记录其存量band定位阶段；之后实际修复finalize另有时间/exit记录，不把诊断阶段的0误称“修复未运行”。

## notes[5]阶段叙述

旧值：

> 脚注前横线及页边墨迹仅记观察，未作计数排除或数学勘误。

新值：

> 首次作者稿未作计数排除或数学勘误；独立源审后仅为计行登记脚注前的真实薄分隔横线，并恢复110/112各第二排句点后的一个接续空格，题面与印刷行数不变。

叙述准确保留首次未排除/实际失败的历史，说明后续仅横线计行登记和两空格恢复，没有假称首次已PASS或登记数学勘误。notes[0..4]没有变化。

## 严格前后diff

本轮只读结构/字节比较的完整pageJSON diff恰为四路径：

```text
meta.notes.5
meta.count_exclusions（新增上述唯一separator-rule）
blocks.0.lines.1（仅末尾一个U+0020）
blocks.2.lines.1（仅末尾一个U+0020）
```

以完整before.blocks为底稿只追加上述两个空格后，与完整after.blocks深等。MD剥离JSON frontmatter后的body也仅有这两处空格差异；before/after MD frontmatter分别与对应pageJSON meta深等。

身份/source/render/profile、`printed_lines:25`、空errata/figures、所有其他notes、块数/行数/顺序、cont/open/samerow、脚注、folio及全部文字/数学内容不变。48没有figure crop，这一库存事实复用旧审。

audit仅三个字段改变：`lines_printed` 26→25、`count_exclusions` 空→上述记录、`errors` 原countFAIL→[]；`lines_md:25`和其余字段不变。exclusion记录与meta深等。

实际bytes equality均true：

```text
before-metadata/page.md   == 原firstFAIL after-finalize/durable/page.md
before-metadata/page.json == 原firstFAIL after-finalize/durable/page.json
before-metadata/audit.json == 原firstFAIL after-finalize/durable/audit.json
当前durable三件 == after-targeted三件（逐件true）
```

这是真实读取后的比较，不仅采信修复报告中的wrapper宣称。本轮只读JSON/字节diff，没有调用p2c、源计行/诊断工具、validator或任何重跑流水线。

## 实际修复命令证据

保存的 `finalize-command.json`：

```text
executable: .claude/skills/ld-s10y-lesson/.venv/bin/python
args: ["-B",".claude/skills/ld-s10y-lesson/tools/p2c.py",
       "finalize","--book","9-10g","--page","48"]
cwd: /Users/yong/.codex/worktrees/a07e/lemmadeck
startedAtUtc: 2026-11-16T06:51:24.300Z
finishedAtUtc: 2026-11-16T06:51:24.640Z
exitCode: 0
signal: null
error: null
```

真实stdout：

```text
[finalize] 9-10g p0048: 10 块 / 25 行（印刷 25）, 插图 0 张, 规范化 0 处
  ✓ 通过 行数对账 + 白名单 + 公式
```

stderr零字节，after audit `lines_printed:25/lines_md:25/errors:[]`。本审者只读该已有实际运行，没有自行执行或重跑。原firstFAIL26/25完整三件仍保持原哈希，不被此次25/25覆盖。

## 实际rawSHA绑定

下表D为 `T/9g-p48-count-diagnostic/`：

| 文件 | 实际rawSHA256 |
| --- | --- |
| `T/source-9g-p48-targeted-repair.md` | `c14831ad6d20987ca4bc344f0e9fcc1d4ad9fcef8fbe7be0f1b30a3c2925bca8` |
| `D/report.json` | `de9b699a820ca7f558a23533f4186851659f3ec3a22d0ba379f7c38be25ab022` |
| `D/separator-foot-folio-native.png` | `4bda62a6ec3fc97e0c1eb4c4d2bc259643791ee28e726247094a5cfb8b7ac75d` |
| `D/before-metadata/page.md` | `6c081534bbf89b7a783ea6578d5f054628e3f5821f8ab76b6fb1acad4e31caec` |
| `D/before-metadata/page.json` | `efb49e350283a849031f19fde07cc4660df6bae0606850329adf75aab4209f9b` |
| `D/before-metadata/audit.json` | `7f901b47f5159e97d2618728007cb2f9af6512e982aa77f60cd698f24dce9197` |
| `D/after-targeted/page.md`，与当前durable字节相同 | `efa7488581fccf30db9bc4dbfe321ca3920320924210f324df9c0ffc13fc4921` |
| `D/after-targeted/page.json`，与当前durable字节相同 | `1c156fa02cec1d3a65a6952af2bbadbe71db70fbe9a023469ee01189fff1a239` |
| `D/after-targeted/audit.json`，与当前durable字节相同 | `0ea924ea909fec21fccc78a1bf6a004045e95ab22718a274c26ad891278d7140` |
| `D/finalize-command.json` | `86845084906849af86e76ca60230bab880ae249453d9615ce2a5e02452622b22` |
| `D/finalize.stdout.txt` | `f9c5ad1f22ef9863729c8e2a379e72660ab001ede7c7f616bc74222405c39956` |
| `D/finalize.stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

当前durable48路径为根下 `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0048/`。原StageA及StageB哈希已外取核对，均保持不变。

## 停止

本轮仅新增此affected-only报告。无整页重开、重计数、完整源/数学复审、工具/源修稿、49修订阅读、finalize/validator重跑、图/答案/choice/Git/DB/browser/net操作。

48本次修复PASS；此结论不批准49或后续装订/现代/出版。旧FAIL、旧REVISE及完整前后稿保留。本报告自身SHA从文件外取得，冻结后停止。
