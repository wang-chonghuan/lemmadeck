---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "7a",
  "page": 91,
  "printed_page": 85,
  "source": {
    "pdf": "7a 苏联十年制学校数学教材 代数 七年级.pdf",
    "pdf_sha256": "8070c333ee46fb0dc650cb32d4d898f605ed308559b6cc430425d908dae6b052",
    "pdf_page": 91
  },
  "render": {
    "dpi": 300,
    "w": 1504,
    "h": 2289,
    "sha256": "bf976b1b6fc803031b7df087a080231a044083c442be099016db2a440e28e9b8"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "One grid open only. Printed footer 85 read from pixels. Leading bold statement continues physical page 90.",
    "Unnumbered prose example table, no printed caption: headers a, (a+8)(a-1), (a+3)(a+4); rows (-10,22,42), (-1,-14,6), (0,-8,12), (1,0,20), (10,162,182).",
    "Example 1 product (a+8)(a-1) breaks within a factor; the visible intra-page break is recorded with ↵.",
    "Final prose and product stop after (a+8)× and continue on physical page 92; no missing factor supplied here.",
    "Strict/non-strict inequality symbols read as <, > and ≤, ≥ respectively."
  ],
  "errata": [],
  "printed_lines": 18,
  "figures": [
    {
      "id": "tbl-p0091-01",
      "label": "表",
      "box": [
        237,
        955,
        1127,
        543
      ]
    }
  ],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p cont -->
$a$ 小于 $b$，当且仅当差 $a-b$ 为负。

<!-- p -->
显然，$a=b$，当且仅当差 $a-b$ 等于零。

<!-- p -->
由此得到，$a\geqslant b$，当且仅当差 $a-b$ 为正或等于零；$a\leqslant b$，
当且仅当差 $a-b$ 为负或等于零。

<!-- p -->
用符号 $<$ 或 $>$ 连接的不等式叫做严格的不等式；用符号
$\leqslant$ 或 $\geqslant$ 连接的不等式叫做不严格的不等式。

<!-- p -->
我们说明在解决具体问题时怎样应用上述定理。

<!-- p -->
例1 设已知含有同一个变量 $a$ 的两个式子 $(a+8)(a-↵1)$ 和 $(a+3)(a+4)$。在下表中列出了对应于某些 $a$ 值的这两
个式子的值。

<!-- fig 表 box 237,955,1127,543 -->
![表](figures/tbl-p0091-01.png)
$a$ | $(a+8)(a-1)$ | $(a+3)(a+4)$
$-10$ | $22$ | $42$
$-1$ | $-14$ | $6$
$0$ | $-8$ | $12$
$1$ | $0$ | $20$
$10$ | $162$ | $182$

<!-- p open -->
我们看到，对于所取的 $a$ 值，第一个式子的值小于第二个
式子的对应值。是不是对于任何 $a$ 值，式 $(a+8)(a-1)$ 的值
都小于式 $(a+3)(a+4)$ 的值呢？为了回答所提出的这个问题，
我们写出上述两个式子的差并把它变形：
$(a+8)(a-1)-(a+3)(a+4)↵=a^2+8a-a-8-a^2-3a-4a-12=-20$。
这个差对于任何 $a$ 值都为负。因此，对于任何 $a$，式 $(a+8)\times$

<!-- foot -->
85
