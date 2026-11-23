---
{
  "book": "9c",
  "page": 81,
  "printed_page": 74,
  "notes": [
    "Fresh AUTHOR only; OPEN pending parent full intake, no source/page/unit approval.",
    "Figure 12 is prose-owned, with a right-directed number line and three filled points labeled a-epsilon, a, a+epsilon from left to right. Native coarse box only; no crop or snapping performed.",
    "Caption 图12 shares a physical row with 或者. The geometric explanation paragraph is open/cont across the figure/caption, not split into unrelated paragraphs.",
    "Side-by-side subparts remain on their actual physical rows. Original open interval notation retained. No answers or arithmetic errata.",
    "Epsilon font variant uncertain; transcribed as \\varepsilon. Subpart lookalikes encoded Cyrillic per source profile.",
    "Wavy underlining retained descriptively; footer dots around 74. Source specks are not count exclusions.",
    "No 79/84 image access; outer84 UNKNOWN. Source/render/profile binding left for native finalizer."
  ],
  "schema": "ld-s10y-lesson/page@3",
  "source": {
    "pdf": "9c 苏联十年制学校数学教材 代数和分析初步 九年级.pdf",
    "pdf_sha256": "622f972014ce83a76a36b3174ce6d6995e77b86efa0f8dbaba7f5497729a8aec",
    "pdf_page": 81
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2381,
    "sha256": "19c84168ff0718a3de9f7c037f218022b583a6bf825f7bdf76982f913428895f"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0"
  },
  "printed_lines": 22,
  "figures": [
    {
      "id": "fig-12",
      "label": "图 12",
      "box": [
        803,
        493,
        526,
        62
      ]
    }
  ],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p -->
因此
$\lim_{n\to\infty}\alpha_n=\alpha$，$\lim_{n\to\infty}\alpha'_n=\alpha$.

<!-- p open -->
我们来阐明数列的极限的几何意义. 不等式 (2) 等价于
双不等式
$-\varepsilon<x_n-a<\varepsilon$，

<!-- fig 图 12 box 803,493,526,62 -->
![图 12](figures/fig-12.png)

<!-- p cont open -->
或者

<!-- cap 图 12 samerow -->
图 12

<!-- p cont -->
$a-\varepsilon<x_n<a+\varepsilon$.　(3)

<!-- p -->
不等式(3)说明，收敛于$a$的数列$(x_n)$中，所有序号$n>N$的
项，即$x_{N+1}$，$x_{N+2}$，…，均落到开区间$]a-\varepsilon,a+\varepsilon[$内(图12).
这个区间叫做点$a$的$\varepsilon$邻域.

<!-- p -->
因此，如果数$a$是数列$(x_n)$的极限，那么该数列的项，除
了有限项外，全都落到点$a$的任意一个（不管怎样小的）邻域
内.

<!-- exhead -->
习题

<!-- ex 159 -->
159. 证明：
а) $\lim_{n\to\infty}\frac{n+1}{n}=1$；　б) $\lim_{n\to\infty}\frac{5n-2}{n}=5$；
в) $\lim_{n\to\infty}\frac{3n-2}{2n}=1.5$；　г) $\lim_{n\to\infty}\frac{1}{n^2+1}=0$.

<!-- ex 160 -->
160. 求下列各数列的极限(加以证明)：
а) $a_n=\frac{5n-1}{2n}$；　б) $b_n=\frac{3n^2+1}{n^2}$.

<!-- ex 161 -->
161. 假设$x_n=c$，这里$c$是某一个常数. 证明：$\lim_{n\to\infty}x_n=c$.

<!-- ex 162 -->
162. 证明：数1不是数列$a_n=\frac{n+1}{2n}$的极限.

<!-- foot -->
• 74 •
