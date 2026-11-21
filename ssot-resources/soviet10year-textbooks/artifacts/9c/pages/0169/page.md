---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9c",
  "page": 169,
  "printed_page": 162,
  "source": {
    "pdf": "9c 苏联十年制学校数学教材 代数和分析初步 九年级.pdf",
    "pdf_sha256": "622f972014ce83a76a36b3174ce6d6995e77b86efa0f8dbaba7f5497729a8aec",
    "pdf_page": 169
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2381,
    "sha256": "e6fd1b2fa4d2381457325869d814818e1a262e173ad5b0008f306883f7ac1f1d"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0"
  },
  "notes": [
    "FIRST source169 author, physical169 printed162, finish=review. Immutable source and band evidence under source169-active; no independent approval.",
    "Source observed before generated layout/template. Original viewed once; no grid/ROI/next page/TOC/answers consulted.",
    "U01: inclusive inequalities encoded geqslant/leqslant; precise printed glyph form awaits independent review.",
    "U02: filled full stops encoded ASCII period; prose commas/colons fullwidth; typography, alignment and spacing disclosed in source.inventory.md.",
    "U03: right-margin spots and bottom-edge trace provisionally nontext; folio flanking marks inventoried as decoration. NO count exclusions or pixel changes.",
    "U04: all mathematical/scientific claims and long derivative chain await independent literal/scientific review; no errata inferred.",
    "Top h3 is literal 48. 有理分式函数的导数, positive source evidence of n47 right boundary only; n47 closure approval pending independent review.",
    "Body is byte-exact frozen source.body.md. True formula wrap L13/L14 represented by one U+21B5; tall fraction tiers each remain one row.",
    "n44strictCompliance=false; prior FAIL/HOLD/UNKNOWN and old n17/104/122/135 dirt remain unchanged."
  ],
  "errata": [],
  "printed_lines": 23,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- h3 -->
48. 有理分式函数的导数

<!-- p -->
定理. 以整数$n$为指数的幂函数
$x\to x^n$，
它的导数等于指数$n$和幂函数$x^{n-1}$的积，即
$(x^n)'=nx^{n-1}$　(1)
当$n\geqslant2$时对一切$x$成立，而当$n\leqslant1$时只对$x\ne0$成立.

<!-- p -->
证明　当$n>1$时，公式在第46小节已经得到证明.
如果$n=1$，那么当$x\ne0$时，有
$(x)'=1=1\cdot x^{1-1}$，
因此，定理对$n=1$成立. 当$n=0$，公式(1)也成立：当$x\ne0$，有
$x^0=1$，且$(1)'=0=0\cdot x^{0-1}$. 如果$n$是负整数，那么设$n=-m$，
其中$m$是正整数. 利用商的导数定理，当$x\ne0$时，得到
$(x^n)'=(x^{-m})'=\left(\frac{1}{x^m}\right)'=\frac{(1)'x^m-(x^m)'}{x^{2m}}=\frac{-mx^{m-1}}{x^{2m}}↵=-mx^{-m-1}=nx^{n-1}$.

<!-- p -->
定理证毕.

<!-- p -->
特别是，
$\left(\frac{1}{x}\right)'=(x^{-1})'=(-1)\cdot x^{-2}=-\frac{1}{x^2}$.

<!-- p -->
于是，
$\left(\frac{1}{x}\right)'=-\frac{1}{x^2}$.

<!-- p -->
因为有理分式函数可以表示为两个多项式的商，所以由
上述定理得到一个重要的结论：有理分式函数在它的整个定
义域上可微.

<!-- foot -->
162
