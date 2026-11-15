# 136页F136-1受影响复核

2026-11-15。独立审查者 Sagan / Codex，非修复作者。

**PASS：F136-1已在当前136页快照中修复。** 复用首次完整源审对其他文字、公式字符、图对象、行数及137–140页/七裁图的有效结论，不重复全页或五页审查。首次FAIL报告保持原样，不覆盖历史。

## 范围与实际比较

唯一仓库根：`/Users/yong/.codex/worktrees/0f12/lemmadeck`。

```text
D = <仓库根>/ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0136
A = <仓库根>/.intentfold/tickets/STEMROBIN-180/tmp/source136-rejected-before-wrap-repair
T = <仓库根>/.tmp/ld-s10y-lesson/6p/pages/0136
F = <仓库根>/.intentfold/tickets/STEMROBIN-180/source-review-136-140.md
E = <仓库根>/.intentfold/tickets/STEMROBIN-180/tmp/source-review-136-140/0136-formula-detail.png
```

实际读取当前MD/JSON/audit，逐文件与A归档作只读diff及结构化比较；核对原FAIL报告和先前实际打开的源公式局部证据。A三文件的实际SHA逐项等于首次报告中的拒绝快照SHA，归档不是被新版本替换的伪旧记录。F、E实际SHA也未变。

没有重新打开整页、重审其他四页或重渲染七裁图。只重算136原页/网格/layout及图119 PNG/SVG哈希，复用已有像素判断。没有执行finalize/vectorize/assemble、门禁、测试、浏览器、Git、DB或服务；未改源、作者文件、归档或旧报告。141+未读取/未审批。

## 定点事实

1. MD完整字节比较结果为：当前文件严格等于归档MD仅将 `$P=\ng\rho hS$` 中的一个换行替换为 `$P=↵g\rho hS$`。全MD仅有这一个 `↵`，没有其他字符/空格/标点/公式/强调/块头变更。
2. 当前第二p块包含完整 `$P=↵g\rho hS$`。JSON只把原两条字符串合为一条含断点的字符串，其他七块、全部meta及该p块的非lines字段逐项相同。
3. 将该p块按 `↵` 展开，结果与归档的四条物理行数组逐字完全相同，断点仍在源印的 `P=` 后：

```text
另外，由于各容器的底面积相同，故液体对各容器底所产
生的压力就相同. 这个压力等于竖直液柱$abdc$的重量：$P=
g\rho hS$，式中$S$—底面积，$hS$—液柱的体积，$\rho hS$—液柱的
质量.
```

4. 该p块现为3条MD/JSON逻辑行，含一个显式断点，对应4个物理行。8块的物理行数仍为 `[5,4,2,1,0,1,5,1]`，总计19；全页18条非空块体逻辑行加一个断点，不能误认少了一条印刷行。
5. 当前audit与归档audit字节完全相同：`lines_printed=19`、`lines_md=19`；normalizations/unknown_chars/katex_warnings/errors均空，errata为0。主代理报告本次官方finalize仅一次exit0；本人没有重跑或把它冒称为本人执行。
6. 图119最终框仍 `[389,1082,732,444]`，audit的components=23、from=`[385,1075,745,455]`均不变。当前MD/JSON图身份、图题、页脚、open/cont和其余块不变；原页、网格、layout、图119 PNG/SVG及局部证据实际哈希均等于首次冻结值。

因此当前编码符合此前指出的cap1完整公式/显式印刷断点要求，且没有借修复改变数学原式或其他源内容。**当前136页源级PASS；首次136 FAIL仍作为历史证据保留。** 137–140及七裁图PASS仅复用原有效审查，没有再次批准装订、整课闭合或范围外页面。

## 真实SHA-256绑定

以下由本轮实际 `shasum -a 256` 计算，字节SHA而非手猜：

```text
F                         b428d2e8008125fc08e93676765880871eb602aa2da5907914ff9b95c9181878
A/page.md                 e3011ec9fc349657879b407d0d5a2c7a9df4ec84a5eea037e1474c1c75bc5b2e
A/page.json               f9dc9d022fc3f8e0361816bca5c2fa99923de7fe3f85032c69d3d27247b17930
A/audit.json              2cf72a7c676e3554f623eae126dd980addd79b4d0347704a7ddabc88a8ce7a72
D/page.md                 8e56439327ed07149f7f79b05a594ba79e65e4b1c3767d6cb74c5e5d237c98c8
D/page.json               3c07224c12171fe0dde07faef9e368b53e89889404cc9a8e2d753dd6dd823684
D/audit.json              2cf72a7c676e3554f623eae126dd980addd79b4d0347704a7ddabc88a8ce7a72
T/page.png                7d7328d634e0740f6e421f46b301502d0c134398bc89c74c86c157bdb06b77d6
T/page.grid.png           d877e7d44efb8965673a5da37c72ce82b4d84acb2f53dafb55e54773c76a84bc
T/layout.json             00b1e5f5c02edb58b352bb0f40007d3bcc573f6f1aa772206a1ed085e3f8f584
T/figures/fig-119.png      bd335e2efcbfeb2cccb54aec050fffa1902ed5785297ca0b8865b89d7cc63850
T/figures/fig-119.svg      c1596da7ac98442b2c776caabbd82e55da717efa52bce840465a7d226190d536
E                         5c5725e4b7b3555575c58ab49391861b3e660c81f1eec85d4aeb826d1188648e
```

本次唯一新增文件为本报告。精确模型部署ID、推理档位、全程/推理token和费用未知，未将局部工具输出token当总计量。受影响复核已冻结并停止。
