---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9c",
  "page": 37,
  "printed_page": 30,
  "source": {
    "pdf": "9c 苏联十年制学校数学教材 代数和分析初步 九年级.pdf",
    "pdf_sha256": "622f972014ce83a76a36b3174ce6d6995e77b86efa0f8dbaba7f5497729a8aec",
    "pdf_page": 37
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2381,
    "sha256": "b89113fbf7359c8da80fd075a1ec363b350c3904ffdc37b7618c60bed3cbbb15"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0"
  },
  "notes": [
    "Source-first draft from physical0037 original pixels, one detail=original view at 1695x2381. Independent source inventory frozen before authoring; no counter/parser/finalizer or source/page/unit/math/display acceptance.",
    "Incoming0036 is parent TEXT only: a locally closed unlabelled table with indices0-10. No old page was read; the opening reference to equality(1) does not certify an external join.",
    "Exercise70 first a-shaped label is represented as Cyrillic а and second as б; fine glyph/alphabet ancestry remains HOLD. Font/emphasis and punctuation ancestry remain HOLD.",
    "Margin specks, blobs and scan-edge marks have UNKNOWN origin and no supported semantic object identity. Final formula-list paragraph is locally continued on new0038."
  ],
  "errata": [],
  "count_exclusions": [
    {
      "kind": "scan-artifact",
      "box": [
        1540,
        1800,
        65,
        45
      ],
      "reason": "Independent source-count review identified a right-edge scanner blob separate from the section heading; it falsely expands that one row into two. Source SHAb89113fbf7359c8da80fd075a1ec363b350c3904ffdc37b7618c60bed3cbbb15; evidence artifacts/9c/evidence/nov19-1844-count3537/report.md and rowmap.json. Count-only exclusion; no printed glyph removed."
    },
    {
      "kind": "scan-artifact",
      "box": [
        0,
        2325,
        1695,
        56
      ],
      "reason": "Independent source-count review identified bottom scanner-edge ink below the printed folio. Source SHAb89113fbf7359c8da80fd075a1ec363b350c3904ffdc37b7618c60bed3cbbb15; evidence artifacts/9c/evidence/nov19-1844-count3537/report.md and rowmap.json. Interior uncertain ink remains untouched."
    }
  ],
  "printed_lines": 26,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p -->
等式(1)可以借助于下面的推理用另一种方法证明。

<!-- p -->
设给定 $n+1$ 个元素的集合 $A=\{a_1,a_2,\cdots,a_n,a_{n+1}\}$。每次从中取
$m+1$ 个元素的子集，总数等于 $C_{n+1}^{m+1}$。另一方面，这个总数可以用以下
方法计算。

<!-- p -->
集合 $A$ 中含有 $m+1$ 个元素的子集可以分为(不相交的)两类：
1) 包含元素 $a_{n+1}$ 的子集；
2) 不包含 $a_{n+1}$ 的子集。

<!-- p -->
$n$ 个元素的集合
$A'=\{a_1,a_2,\cdots,a_n\}$
有多少个含有 $m$ 个元素的子集，第一类就有多少子集。它们的个数等
于 $C_n^m$。

<!-- p -->
第二类子集的个数等于集合 $A'$ 中含有 $m+1$ 个元素的子集的个
数，即 $C_n^{m+1}$。因此，集合 $A$ 中含有 $m+1$ 个元素的子集的总数是
$C_n^m+C_n^{m+1}$。

<!-- p -->
于是，对于包含 $n+1$ 个元素的集合 $A$，我们得到了两个不同的式
子，它们都表示包含 $m+1$ 个元素的子集个数。因此，
$C_n^m+C_n^{m+1}=C_{n+1}^{m+1}$。

<!-- exhead -->
习 题

<!-- ex 70 -->
70. 证明等式成立：
а) $C_n^m+2C_n^{m+1}+C_n^{m+2}=C_{n+2}^{m+2}$；
б) $C_n^m+3C_n^{m+1}+3C_n^{m+2}+C_n^{m+3}=C_{n+3}^{m+3}$。

<!-- h2 -->
§ 4. 二项式定理(牛顿公式)

<!-- h3 -->
9. 牛顿公式·主要推论

<!-- p open -->
大家都熟悉下列公式：
$(a+b)^1=a+b$，

<!-- foot -->
• 30 •
