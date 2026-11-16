---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9p",
  "page": 237,
  "printed_page": 228,
  "source": {
    "pdf": "9p 苏联中学课本 物理 九年级.pdf",
    "pdf_sha256": "df0ea9c3417b7ba0166872b33a8ec81ef20cfb9e15b512a44993174fe92162c0",
    "pdf_page": 237
  },
  "render": {
    "dpi": 300,
    "w": 1504,
    "h": 2289,
    "sha256": "a66c726b0571755170426c41894e702c876ccef078562dad0ef3c4f6cf99ed4d"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "c364d68442cfccc9920d3e23932d418c3d7b123cf4a47408e6535dcb19f7104a"
  },
  "notes": [
    "D025 SOURCE AUTHOR only; AUTHOR-not-approved. Physical237 native page.grid.png opened exactly once, second of four authorized grid opens; no original-page open, crop or reopen.",
    "Incoming p cont is the single printed display-equation row I=epsilon/(R+r/3), following physical236's unfinished paragraph.",
    "Source example1 prints Q=1785焦耳. That literal value is retained without recalculation or modern scientific correction; no errata review is claimed.",
    "Figure187 is a three-branch circuit with epsilon1,r in the upper branch, R in the middle A-B branch, and epsilon2,r in the lower branch. Only a rough box is authored; the caption shares the row 因为在下面的分路中没有电流，.",
    "Example2 continues across the figure and into physical238 after the final printed colon. The solution remains part of ex2, not a new prose object.",
    "Explicit spaces terminate epsilon controls before Latin letters in products. Peripheral thin scan-border ink and isolated bottom-margin specks are left outside the transcription; no counting override or counting run."
  ],
  "errata": [],
  "printed_lines": 21,
  "figures": [
    {
      "id": "fig-187",
      "label": "图 187",
      "box": [
        909,
        1539,
        339,
        298
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
$I=\frac{\varepsilon}{R+\frac{r}{3}}$.

<!-- exhead -->
例 题

<!-- ex 1 -->
1. 电动势$|\varepsilon|=6$伏特和内电阻$r=0.1$欧姆的蓄电池，
给电阻$R=12.4$欧姆的外电路供电. 在$t=10$分钟内，整个
电路放出多少热量？
解 根据全电路欧姆定律，电路中的电流$I=\frac{\varepsilon}{R+r}$. 在
外电阻上放出热量
$Q_1=I^2Rt$；
在内电阻上放出热量$Q_2=I^2rt$. 总热量为
$Q_1+Q_2=I^2(R+r)t=\frac{\varepsilon^2t}{R+r}$；
$Q=1785$焦耳.

<!-- ex 2 open -->
2. 在图187所示的电路中，电阻$R$等于什么数值时，含
有电动势$\varepsilon_2$的电池的分路中的电流等于零？
解 根据题意，电流$I$只在含有电动势$\varepsilon_1$的电池和电阻
$R$的回路中通过. 取逆时针的方向为回路的正方向. 于是，
$I=\frac{\varepsilon_1}{r+R}$
和
$V_{AB}=IR=\frac{\varepsilon_1 R}{r+R}$.
因为在下面的分路中没有电流，

<!-- fig 图 187 box 909,1539,339,298 -->
![图 187](figures/fig-187.png)

<!-- cap 图 187 samerow -->
图 187

<!-- ex 2 cont open -->
所以电荷沿着这个分路移动时静电力的功等于外来力的功：

<!-- foot -->
· 228 ·
