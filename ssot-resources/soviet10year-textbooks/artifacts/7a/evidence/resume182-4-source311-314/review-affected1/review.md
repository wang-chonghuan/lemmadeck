# STEMROBIN-182: source/layout311 affected1 独立审查

日期：2026-11-19。工作目录：`/Users/yong/.codex/worktrees/stemrobin-182-resume/lemmadeck`。

## 结论

**受影响修订 PASS；窄 layout 候选批准集成；311 正常机械 finalize 仍待执行。没有新的 REVISE。**

批准的候选：`.tmp/resume182-4-layout311/layout.py`，SHA256 `9416b0d2319c9efad203f732558b3376d5c1f668d0a3e6ecb993f0177b0716c5`。

当前未改的真实代码：`.claude/skills/ld-s10y-lesson/tools/layout.py`，SHA256 `5da491a31921c68bbeb9b5d01f6458bbdb31de2ba516471b2f0e1c51b57539fb`。

批准只覆盖这两个绑定版本之间的窄差异，不是全仓验收或生产授权。遇到新的并发编辑须保留他人字节，不能用整文件覆盖来实施本批准。本审没有集成候选、修改作者稿、提交 Git、写库或调用其它会话。

## FIRST 复用与保全

- 原 `review-FIRST/review.md` / `review.json` 哈希分别仍为 `861ea15fe280f3be6a741ab2b8f46ffcc575efe2f604f48d00d174c4c3e60959` / `d93a032fd9874f5fddb5a7de9717ae547ce854a25fed4b5db6b3f0fce3ba969b`，未修改历史结论。
- `history/source-FIRST/pages/0311..0314/{page.md,page.json,audit.json}` 十二文件哈希全部匹配 FIRST 绑定。当前 311 的三个文件也仍是 FIRST 字节，包括原 19/20 失败 audit。
- 冻结不安全候选 `.tmp/resume182-4-layout311/history/unsafe-width-FIRST/layout.py`，哈希 `6bdcf1caf5b17f615261a5e169aa61030e9ff21688a68bb5cada5d60ad6b1241`，匹配 FIRST 审查对象。
- 全行内容、1051 表的 owner/6 行/12 空格、1056б 无括号平方、根号范围及跨页题边界直接复用 FIRST 源审。只读字节哈希确认四份源 page.png 与表 crop 未变，没有重新开图。
- 本轮新增图片 0；FIRST 累计 5 图不清零。没有执行任何 probe、test、finalize，没有打开答案、choice、旧源页或扩大旧 helper/tests 审查。

## 三页受影响修订

### 312 / 1053а：PASS

历史到当前的 Markdown/JSON 差异只有将 `$3x_1$` 与 `$+4x_2=29$` 两段合为完整 `$3x_1↵+4x_2=29$`。断点位置与 FIRST 要求一致；一条 Markdown/JSON 字符串加一个 `↵` 仍表示两条印刷行，不是删掉一行。

其它题面、表块、`owner-ex 1051` 和 `owner_exercise="1051"`、表框 `[174,226,1140,851]` 全未改。表 crop 哈希仍是 `5374efe95470d966c53f53504f4b37520aeaf6cf4ac058ed0edd4630381715d1`。

### 313 / 1060、1056б note：PASS

Markdown 的 `1060 open` 保留，JSON 已从 `open=false` 更新为 `true`；314 的 `1060 cont` 未改，1061 前闭合。除此之外只更新 note，记录 FIRST 实际观察“右括号后无可见上标”，公式本身未变、errata 仍空，不借预期结构补 `^2`。

### 314 / 1061：PASS

只把公式中的 `kx^2` 恢复为 `bx^2`，后文 `求 k 取值的集合` 完全保留，另加原变量不一致的 note。Markdown 与 JSON 同步；未选数学修正式、未登记 errata。1060 续问及 1061 章末边界均未变，复用 FIRST 判定。

## 保存的正常 finalize 回执

只读取 `receipts/source-affected1-p0312..0314/{start.record,receipt.record,stdout.txt,stderr.txt}` 和 before 快照的绑定，没有重跑命令。

| 页 | 保存的 UTC 执行时间 | returncode | 印刷/稿件行 | 规范化 | 状态 |
|---|---|---|---|---|---|
| 312 | 13:07:59.756–13:08:00.142 | 0 | 13/13 | 0 | PASS |
| 313 | 13:08:00.143–13:08:00.735 | 0 | 20/20 | 0 | PASS |
| 314 | 13:08:00.736–13:08:01.122 | 0 | 5/5 | 0 | PASS |

三份回执都指向本工作目录、book 7a、各自页码、当前 scratch artifacts 与原 work 路径；signal/error 为 null，stderr 为空。start.record 的三项 before 哈希均与快照相符。before/page.md 已是本次作者修订输入，哈希与当前输出相同；before/page.json 则是旧结构化稿，不能把它误当修订输出。当前 audit 均 errors=[]；计数/表框不变使三份 audit 的字节仍与 FIRST 相同，这不影响独立保存的本次正常命令回执。

## 非空 guard 与新反例：PASS

相对冻结不安全候选，唯一受影响改动在短行宽度条件：

```python
and (supported_columns := np.flatnonzero(
    ink[a:b + 1].sum(axis=0) >= MIN_BAND_HEIGHT
)).size
and 0.5 * glyph_h <= np.ptp(supported_columns) + 1 <= 2 * glyph_h
```

Python 的 `and` 短路使 `.size == 0` 时不会调用 `ptp`；空支持带只失去短行保护资格，交由原过滤流程处理。支持集非空时，宽度计算与 FIRST 候选完全相同，因此原 311 正例和去 c / 微残迹对照的先前结果不因本 guard 改写而失效。

相对当前真实代码仍只有两个局部差异：带非空保护的累计列宽判据，以及组件保护高度 `<0.3*glyph_h → <0.65*glyph_h`。没有绝对页号、题号或坐标特判。diff 其余部分无变化，旧 short_fraction helper/guard 和提取像素逻辑继续保持原字节；没有扩大审查或测试它们。

新脚本 `.tmp/resume182-4-layout311/empty-columns.py` 哈希 `c4ac807bdc0d07486e2f1b7b510cfeb2ec737e082d83e77826ab10e60471145a`。只审脚本与已有结果，未执行。

结果文件 `.tmp/resume182-4-layout311/empty-columns-FIRST.result.record` 哈希 `8e70dd167542abc2c7bcf052e45320c0f5d96b2680d389df314e7f071245904e`：

- 冻结旧候选确实抛 `zero-size array to reduction operation maximum which has no identity`。
- guard 后与无噪声对照完全相同：`[(40,79),(140,179),(340,379)]`，不是仅行数相等。
- `counting_input_unchanged=true`，`status=PASS`。脚本构造的是新空列反例，没有读取原书 311 或重跑旧 fixture。
- 这份 result.record 没有内嵌退出码或被加载源码哈希；不伪造这些字段。exit 0 与该次执行事实来自用户本轮明确说明；文件路径、冻结源码和当前 guard 的哈希在此独立绑定。

原 311 probe 的旧 19 / 新 20、唯一新增 `443–464`、去 c / 微残迹 / 原像素 PASS，按用户本轮明确确认的 genuine prior tool-summary fact 承接。旧 raw receipt 未保存的限制继续记录，不补造、不重跑、不改 FIRST 报告。此前候选证据等待不再因缺 raw receipt 独立阻止本次批准。

## 尚待事项

只有 **311 正常 finalize 的页级机械结果尚待父执行**。现存 311 audit 仍为 `lines_printed=19, lines_md=20` 的 FIRST 失败；本次批准不是它的机械 PASS，不意味着集成已经完成。复用 FIRST 确认的 20 行及真实独立 `c.`，不删字、不凑行、不重做源审。

当前三页 page.md 哈希：

- 312：`defa7e68495b6e45d7f3a4c933d789b6d4b284cfcbe837e272930a7bdcd16e13`
- 313：`3a96e0dd8bf50adf1f4c56a34093d8c732b06200ab697792dbab41fa6631e5d5`
- 314：`f2c7b9949246b42647d8280014a8eeeb54eed2d85719765d78be0ae292e47b81`

完整绝对路径、JSON/audit、历史及回执哈希见同目录 `review.json`。批准冻结到此报告的候选与输入绑定，后续不同字节不自动承继批准。
