---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9c",
  "page": 163,
  "printed_page": 156,
  "source": {
    "pdf": "9c 苏联十年制学校数学教材 代数和分析初步 九年级.pdf",
    "pdf_sha256": "622f972014ce83a76a36b3174ce6d6995e77b86efa0f8dbaba7f5497729a8aec",
    "pdf_page": 163
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2381,
    "sha256": "6f4b76b91eae3620ae5af6485e63fd309bd81a432ca9c4fe05e3fd4095599b50"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0"
  },
  "notes": [
    "SOURCE freeze/HOLDs: freeze.json",
    "Inert projection/count discrepancy: projection.json"
  ],
  "errata": [],
  "count_exclusions": [],
  "printed_lines": 25,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p -->
注　用数学归纳法可以证明，这个定理对任意有限个函数的和也
正确：
$(u_1+u_2+\cdots+u_n)'=u_1'+u_2'+\cdots+u_n'.$

<!-- exhead -->
习　题

<!-- p owners-ex ["363","364","365"] -->
利用第 43 小节中的例子和第 352 和 354 题，求下列各
函数的导数：

<!-- ex 363 -->
а) $f(x)=x+5$；　　б) $g(x)=x^2+3.$

<!-- ex 364 -->
а) $h(x)=x^2+x$；　　б) $u(x)=x^2+x+7.$

<!-- ex 365 -->
а) $v(x)=x^2+\frac{1}{x}+5$；　　б) $y(x)=x^2+\frac{1}{x}+\sqrt{x}.$

<!-- ex 366 -->
证明：如果两个函数都有导数，那么它们的差的导数等
于它们的导数的差。

<!-- h3 -->
45. 函数的积的导数

<!-- p -->
引理．如果函数 $f$ 在点 $x_0$ 有导数，那么
$\lim_{\Delta x\to0}\Delta f(x_0)=0.$

<!-- p -->
证明

<!-- p -->
$\lim_{\Delta x\to0}\Delta f(x_0)=\lim_{\Delta x\to0}\frac{\Delta f(x_0)}{\Delta x}\cdot\Delta x=f'(x_0)\cdot0=0.$

<!-- p -->
由这个引理得出，函数 $f$ 在点 $x_0$ 有导数，那么函数 $f$ 在该点连续。

<!-- p -->
事实上，因为

<!-- p -->
$f(x)=f(x_0)+f(x)↵-f(x_0)=f(x_0)+\Delta f(x_0),$

<!-- p -->
所以只要回忆一下第 42 小节中对公式（3）所作的说明就可
得出：

<!-- p -->
$\lim_{x\to x_0}f(x)=\lim_{\Delta x\to0}(f(x_0)+\Delta f(x_0))↵=f(x_0)+\lim_{\Delta x\to0}\Delta f(x_0)=f(x_0).$

<!-- foot -->
• 156 •
