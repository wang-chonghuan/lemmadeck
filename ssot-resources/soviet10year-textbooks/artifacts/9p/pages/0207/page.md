---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9p",
  "page": 207,
  "printed_page": 198,
  "source": {
    "pdf": "9p 苏联中学课本 物理 九年级.pdf",
    "pdf_sha256": "df0ea9c3417b7ba0166872b33a8ec81ef20cfb9e15b512a44993174fe92162c0",
    "pdf_page": 207
  },
  "render": {
    "dpi": 300,
    "w": 1504,
    "h": 2289,
    "sha256": "bdc86b2e2ed53ba9badc9031140bca53a9dce5569447b4aab898429b355d9bf3"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "c364d68442cfccc9920d3e23932d418c3d7b123cf4a47408e6535dcb19f7104a"
  },
  "notes": [
    "One individual original-page view:21 physical printed rows including footer. Figure160 caption shares row4 of the seven-row worked-solution body.",
    "84 continues by ownership; first source paragraph is new prose after closed equation8-44, not a fabricated p cont. Density equations8-45/8-46 preserved.",
    "Source heading 例 题 introduces worked example1, not a new numbered lesson. Its four-row statement and seven-row solution belong to one ex1 open object; final 因此， remains open to unviewed208.",
    "First capacitance formula visibly prints C without subscript, while following reciprocal formula prints C1. Retain literal C; source-subscript reading needs independent source confirmation, no mathematical repair or SCI approval.",
    "Figure160 is the fifth candidate in this batch and will remain unviewed under the eight-image cap; whole-page view does not substitute for candidate inspection.",
    "No counting override, reconstructed figure, solution completion or modern rewrite."
  ],
  "errata": [
    {
      "id": "p0207-first-series-capacitance-subscript",
      "block": "p0207#8",
      "original": "$C=\\frac{\\varepsilon_0 S}{x}$",
      "reason": "原页独立观察确认首式印为 C，没有下标；随后串联式区分总电容 C 与两段电容 C_1、C_2。首式计算第一段间隙的电容，应标为 C_1。忠实正文、公式、块身份与行数保持原印刷内容，仅现代层按此来源绑定勘误改下标。"
    }
  ],
  "printed_lines": 21,
  "figures": [
    {
      "id": "fig-160",
      "label": "图160",
      "box": [
        978,
        1062,
        247,
        528
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
(8-44)式被电场所占有的体积$Sd$除，则得到单位体积的能
量，即能量密度:

<!-- p -->
$\omega=\frac{\varepsilon_0\varepsilon E^2}{2}.$　(8-45)

<!-- p -->
在静电单位制中，

<!-- p -->
$\omega=\frac{\varepsilon E^2}{8\pi}.$　(8-46)

<!-- p -->
得到的表示式(8-45)和(8-46)，不仅对于平行板电容器的匀
强电场是正确的，对于任何静电场，都是正确的. 而且，所得
到的能量密度的表示式，对于交变电场也是正确的.

<!-- exhead -->
例　题

<!-- ex 1 open -->
1. 电容器极板的面积为$S$，极板间的
距离为$l$. 如果在电容器的两板间平行极
板插入一个厚度为$d$的金属板. 试求该电
容器的电容(图160).

<!-- ex 1 cont open -->
解　在其中插入一金属板的电容器，
可看成为两个串联的电容器. 其中第一
个电容器的电容为$C=\frac{\varepsilon_0 S}{x}$，式中$x$——
一个极板到金属板的距离. 第二个电容器

<!-- fig 图160 box 978,1062,247,528 -->
![图160](figures/fig-160.png)

<!-- cap 图160 samerow -->
图160

<!-- ex 1 cont open -->
的电容为$C_2=\frac{\varepsilon_0 S}{l-d-x}$. 串联电容器组的电容，由下式确定:
$\frac{1}{C}=\frac{1}{C_1}+\frac{1}{C_2}=\frac{l-d}{\varepsilon_0 S}.$
因此，

<!-- foot -->
· 198 ·
