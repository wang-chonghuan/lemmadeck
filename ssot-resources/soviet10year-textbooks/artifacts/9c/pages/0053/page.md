---
{
  "printed_page": 46,
  "notes": "一次原图目视及一次冻结R1原生裁片。无新标题、无独立习题、无图。上划线表示负的整数部分，保留在2、1及118之上。原印不等式为0≤a_k<9，忠实保留严格小于9，未作勘误。R1确认2.500000000…为5后八个零，1.21100000…为211后五个零，118上划线覆盖三位整数，尾部五个6；FIRST候选未改。裁片边界缺字不作源文重构。未登记计行排除；外页边界不推补。",
  "schema": "ld-s10y-lesson/page@3",
  "book": "9c",
  "page": 53,
  "source": {
    "pdf": "9c 苏联十年制学校数学教材 代数和分析初步 九年级.pdf",
    "pdf_sha256": "622f972014ce83a76a36b3174ce6d6995e77b86efa0f8dbaba7f5497729a8aec",
    "pdf_page": 53
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2381,
    "sha256": "d75d43289fbf4aa433eb51333966ae16c69aba3611ec469b973ca681853168af"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0"
  },
  "count_exclusions": [
    {
      "kind": "scan-artifact",
      "box": [
        0,
        2330,
        1695,
        51
      ],
      "reason": "Hash-bound independent fullscan review: sloping scanner boundary below folio 46; retained detector band 25 (2338..2380 inclusive), no printed body or folio ink. Report: /Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-count5255/report.md; report SHA-256 c394f905c896d5a634a14f961391643f28d2805b5232e215ad50a0f194c5eb1d; original PNG SHA-256 d75d43289fbf4aa433eb51333966ae16c69aba3611ec469b973ca681853168af."
    }
  ],
  "errata": [
    {
      "id": "p0053-decimal-digit-domain",
      "block": "p0053#6",
      "original": "$0\\leqslant a_k<9$",
      "reason": "Base-ten long division requires integer digits 0 through 9. The same page states that every nonnegative rational has a decimal expansion and gives -0.789; excluding 9 cannot represent its positive opposite 0.789. Modern editorial correction to an inclusive upper9 is supported by the independent frozen inquiry retained at artifacts/9c/evidence/nov19-1844-n12/inquiry; the faithful strict <9, source glyph observations and author intent remain unchanged."
    }
  ],
  "printed_lines": 24,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p -->
对于整数，也可以在小数点的右面补上无穷个零：
$17=17.00000\ldots.$

<!-- p -->
这样一来，我们看到，任何非负有理数都可以用无穷小数的形
式来表示：
$r=a_0.a_1a_2a_3\ldots.$

<!-- p -->
这里的 $a_0$ 是 $r$ 的整数部分，而
$0.a_1a_2a_3\ldots$
是它的小数部分。

<!-- p -->
2. 这种表示法，对于负有理数也适用。不过为了避免误
解，必须在负数的整数部分上方画一横线（负号）。例如，将数
$-\frac{3}{2}=-2+\frac{1}{2}$
写成以下形式：
$\overline{2}.500000000\ldots.$

<!-- p -->
类似地，
$-0.789=\overline{1}.21100000\ldots,$
$-117\frac{1}{3}=-117.3333\ldots=-118+\frac{2}{3}=\overline{118}.66666\ldots.$

<!-- p -->
因此，任何有理数 $r$ 都可以表示为无穷小数：
$r=a_0.a_1a_2a_3\ldots,$
其中的 $a_0$ 是整数，而整数 $a_k$（$k=1,2,3,\ldots$）是满足不等式
$0\leqslant a_k<9$
的整数。这时，$a_0$ 是数 $r$ 的整数部分，而数 $r$ 的小数部分是无
穷小数：
$0.a_1a_2a_3\ldots.$

<!-- foot -->
• 46 •
