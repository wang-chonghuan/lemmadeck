---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9c",
  "page": 162,
  "printed_page": 155,
  "source": {
    "pdf": "9c 苏联十年制学校数学教材 代数和分析初步 九年级.pdf",
    "pdf_sha256": "622f972014ce83a76a36b3174ce6d6995e77b86efa0f8dbaba7f5497729a8aec",
    "pdf_page": 162
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2381,
    "sha256": "5e24bca8c2c126b73b1d2dd0fad19fb5ea2fc4f80b3a6f704b1651fd3611ca58"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0"
  },
  "notes": [
    "Independent SOURCE candidate only; all H162-* HOLDs remain pending.",
    "Residual margin/bottom ink and specks retained as observations; no count_exclusions proposed.",
    "Observed heading 44 and complete theorem proof do not establish off-page unit closure.",
    "23 layout bands map to 21 frozen physical baselines; two tier splits are metadata only."
  ],
  "errata": [],
  "printed_lines": 21,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- ex 358 -->
358. $g(x)=ax^2+bx+c$. 求 $g'(x)$，$g'(0)$，$g'(2)$.

<!-- p owners-ex ["359","360","361","362"] -->
利用第 37 小节中的内容，求下列各函数的递增区间、递
减区间、极大值和极小值，并作出它们的图象：

<!-- ex 359 -->
359. $y=x^3-x$.

<!-- ex 360 samerow -->
360. $y=3x-x^3$.

<!-- ex 361 -->
361. $y=x^3-3x^2$.

<!-- ex 362 samerow -->
362. $y=3x^2-x^3$.

<!-- h3 -->
44. 函数的和的导数

<!-- p -->
设 $u$ 和 $v$ 是定义在同一个区间上的两个函数.

<!-- p -->
定理. 如果两个函数都有导数，那么它们的和的导数等
于它们的导数的和，即

<!-- p -->
$(u(x)+v(x))'=u'(x)+v'(x)$.

<!-- p -->
证明 用 $w(x)$ 表示这两个函数的和 $u(x)+v(x)$，并计
算 $w(x)$ 的导数：

<!-- p -->
$\frac{\Delta w(x)}{\Delta x}=\frac{w(x+\Delta x)-w(x)}{\Delta x}↵=\frac{u(x+\Delta x)+v(x+\Delta x)-u(x)-v(x)}{\Delta x}↵=\frac{u(x+\Delta x)-u(x)+v(x+\Delta x)-v(x)}{\Delta x}↵=\frac{\Delta u}{\Delta x}+\frac{\Delta v}{\Delta x}$，

<!-- p -->
于是，

<!-- p -->
$(u+v)'=w'=\lim_{\Delta x\to0}\frac{\Delta w(x)}{\Delta x}=\lim_{\Delta x\to0}\left(\frac{\Delta u}{\Delta x}+\frac{\Delta v}{\Delta x}\right)↵=\lim_{\Delta x\to0}\frac{\Delta u}{\Delta x}+\lim_{\Delta x\to0}\frac{\Delta v}{\Delta x}=u'+v'$.

<!-- p -->
定理证毕.

<!-- foot -->
• 155 •
