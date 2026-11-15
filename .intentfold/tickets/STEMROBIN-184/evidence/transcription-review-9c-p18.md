# 9c physical18 independent source review

## Scope and verdict

2026-11-15，独立 reviewer，源作者仍为 Ptolemy。只对本次新页 physical18 / printed11 作一次 source-first 审查：先打开单张完整高清原扫描，独立理解和数行，再对照整个当前 page.md，最后读 audit 并只读复现现有计行。不重新打开旧页扫描，不改源、工具或 audit，不 assemble、发布、访问 DB 或使用浏览器。

**PASS：完整源转写、对象/跨页归属和当前实际机械门禁均通过。没有发现需要作者修订的实质转写错误。**

## Binding

- Full original scan: `.tmp/ld-s10y-lesson/9c/pages/0018/page.png`，1695×2381，300 dpi。
- Original PNG SHA256: `0a5531800db9ca0f797fcbe73d5ed8347e349fe95e6e0f2c5df2b6607e9330bd`。
- Reviewed source: `ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0018/page.md`。
- page.md SHA256: `127c48a8ae6935f9dc1fe15598f10c7ed484cc872da01beb9ed8ec3754c5f6a6`。
- audit.json SHA256: `a0338d71784d276a39da658b3adb4897696911963cc23e466a47a5b1529c383a`。
- Frontmatter source 为原9c PDF physical18、printed11，PDF SHA256 `622f972014ce83a76a36b3174ce6d6995e77b86efa0f8dbaba7f5497729a8aec`；render 哈希与实际 PNG 一致。

## Independent line inventory

完整扫描独立数得 **22 行正文、公式、标题、题面 + 1 行页脚 = 23 行**；不是取 audit 的23作预期。手绘下划线不另算正文或公式。

| Printed rows | page.md lines | Source-first observations |
| --- | --- | --- |
| 1-3 | 37-39 | 由 A(k) 推出 A(k+1) 的证明续文；断点“因 / 为”“分别相 / 乘，得到”完整。k≥5、k>1、k-2>1 及两处2的指数对应 |
| 4 | 42 | k(k-2)>1、k^2-2k>1、k^2>2k+1，同一排的三个不等式；手绘下划线不成新排 |
| 5 | 45 | 因此，一条短正文行 |
| 6 | 48 | 2^{k+1}=2×2^k>2k^2=k^2+k^2>k^2+2k+1=(k+1)^2，完整一排等号/不等号链 |
| 7 | 51 | 于是，2^{k+1}>(k+1)^2，结论单独一行 |
| 8 | 54 | 习 题，一行标题 |
| 9-11 | 57-59 | 题10前缀一行，а)、б)各一行；а)是2^n>n且n≥0、n∈Z；б)是2^n>2n+1且n≥3、n∈Z |
| 12-13 | 62-63 | 题11前缀 n≥2 一行；绝对值和的三角不等式一行，左侧一个整体绝对值、右侧逐项绝对值，方向≤ |
| 14 | 66 | 第一章 补充习题，新的栏目/单元标题，不归入题11 |
| 15-16 | 69-70 | 题12 x+|x|≥0与说明要求，两行，断点“说明 / 在证明”；“完全归纳法”不是“数学归纳法” |
| 17-20 | 73-76 | 题13整数x、y和x^2+y^2除4不能余3；两行题干＋两行完整提示，断点“后， / 不可能”“一偶一奇 / 的情况” |
| 21-22 | 79-80 | 题14 a、b都非3倍数，则a^2+b^2除3余2；断点“平方和 / a^2+b^2” |
| 23 | 83 | · 11 ·，两个圆点及双位页码都保留 |

## Object and mathematics transcription findings

- 页首 `p cont` 承接冻结 p17 尾部“可以”，组成“可以由命题…推出命题…”，本页证明完整结束。这里复用前页已冻结尾文，没有重读旧扫描。
- 正文和题10、11仍属于带上标+的“数学归纳法原理的推广”。随后 `h3`“第一章 补充习题”与题12-14分开；题号10-14均完整，没有将补充习题题干吞入上一段。
- 题13的提示完整保存在同一 ex13对象内，未裁为插图；题12所问的归纳法类别及题13/14的整数/余数文字均忠实，没有替作者增补条件或改成标准答案。
- 全页无插图、图题、表格或要绑定的无编号练习图；figures=[]正确。手绘波浪线与页边污迹不作为图。
- 不读取后续答案、选择题或相邻新扫描；此处审核的是全部对象的源转录，不是作者标准答案。
- 父方负责 assemble及上标+章节号与TOC身份处理；本次不执行装订，也不从源审PASS推断课程id归属或未读后续补充页已完成。

## Count and noise facts

- 当前23个块体 Markdown物理行、无 ↵，实际块体计23；audit lines_printed23/lines_md23、errors=[]，unknown_chars/katex_warnings/normalizations均为空，errata=0。
- 只读复现现有计行实际23带；现有 `layout.py` SHA256 `b820fad300c03a49df3e8c1bf0960196ffa7cd318f145e8e53489a3f86da69dd`，只作为结果复现，不是源行数权威。
- 页脚实际带 `[2183,2212]`。底部5%区域散噪包络 `[9,2262,1622,119]`，不含正文或页脚；当前没有额外底噪行，**不要求添加排除项**。
- 左边扫描污迹 `[0,661,38,49]`、`[0,767,64,124]`、`[3,1644,35,23]`、`[7,1811,42,36]`均在无正文页缘。第二块影响“习题”与题10附近的投影分段，但现有带仍对应两条实际文本行，没有额外题面行；不把墨块转成文字。
- 当前count_exclusions=[]，没有靠mask遮去公式、绝对值、习题编号或脚注。审核PASS不需要源稿修复。

## Prior-page closure

p12-17最终独立源观察全部复用；本轮只补当前metadata/audit确认全部为26/26、21/21、21/21、26/26、22/22、24/24，errors=[]。三页新增排除框及新绑定写入 `transcription-review-9c-p12-p17.md` 的 metadata-only closure，未重审旧源。
