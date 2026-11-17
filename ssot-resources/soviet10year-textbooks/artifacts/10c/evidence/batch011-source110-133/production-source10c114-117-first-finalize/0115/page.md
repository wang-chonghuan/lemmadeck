---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10c",
  "page": 115,
  "printed_page": 109,
  "source": {
    "pdf": "10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf",
    "pdf_sha256": "47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40",
    "pdf_page": 115
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2580,
    "sha256": "f995e5700f607944bca43d5e35bb8c0fae59142dedebe0ba97755299228f4891"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "AUTHOR ONLY; physical 115, printed 109; original opened once at detail original. No finalization or independent review.",
    "Figures 52 and 53 belong to the theorem 1 proof beginning on physical 114. Boxes are coarse source-pixel inventory only, not snapped or finalized.",
    "Containing unit 100 is boundedly linked from parent-transported independent source110-113 text, not from this author's inspection of an external heading. The local theorem/proof/figure relationship is observed within owned physical 114-116.",
    "Figure 52: x/y axes, 0, a, x, y=f(x), hatched area S(x) between a and x; curve continues to an unlabelled right vertical boundary. Do not invent a b label for that boundary.",
    "Figure 53: x/y axes; 0, a, x, x+Delta x, b; nonnegative curve; hatched increment strip; three dashed horizontal levels f(x)+epsilon, f(x), f(x)-epsilon; K,M above A,B above D,C on the two strip boundaries. Both captions share one actual printed row.",
    "The first p cont completes the visible derivation of (2) from physical 114. The final p open remains theorem 1 proof and continues onto physical 116 after S(a)=F(a)+C=0.",
    "The first displayed limit has numerator Delta S without (x), exactly as printed; the later derivative-definition limit has Delta S(x). No algebraic normalization."
  ],
  "errata": [],
  "printed_lines": 22,
  "figures": [
    {
      "id": "fig-52",
      "label": "图 52",
      "box": [
        227,
        285,
        608,
        361
      ]
    },
    {
      "id": "fig-53",
      "label": "图 53",
      "box": [
        848,
        275,
        660,
        344
      ]
    }
  ],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- fig 图 52 box 227,285,608,361 -->
![图 52](figures/fig-52.png)

<!-- fig 图 53 box 848,275,660,344 -->
![图 53](figures/fig-53.png)

<!-- cap 图 52 -->
图52

<!-- cap 图 53 samerow -->
图53

<!-- p cont -->
就可以找到这样一个数$\delta>0$，对于任意满足$|\Delta x|<\delta$的$\Delta x$，将会有
$f(x)-\varepsilon<f(x+\Delta x)<f(x)+\varepsilon$．于是，对于满足$0<\Delta x<\delta$的所有$\Delta x$
（正如从图53中所看到的一样），
面积$ABCD<\Delta S(x)<$面积$KMCD$，
或
$[f(x)-\varepsilon]\Delta x<\Delta S(x)<[f(x)+\varepsilon]\Delta x$，
就是
$f(x)-\varepsilon<\frac{\Delta S(x)}{\Delta x}<f(x)+\varepsilon$．　（3）
类似地，检验所得不等式对于满足不等式$-\delta<\Delta x<0$的所有负$\Delta x$也
成立．于是，等式（3）对于满足$0<|\Delta x|<\delta$的所有$\Delta x$成立．根据极
限的定义，这就是说，
$\lim_{\Delta x\to0}\frac{\Delta S}{\Delta x}=f(x)$．
但是，根据导数的定义：
$S'(x)=\lim_{\Delta x\to0}\frac{\Delta S(x)}{\Delta x}$，
于是得出（2）式．

<!-- p open -->
这样一来，我们得出函数$S(x)$是函数$f$的原函数，并且由于原函
数的基本性质，$S(x)=F(x)+C$，其中$C$是常数．为了求出常数$C$，我
们发现，$S(a)=0$，这是因为当$x=a$时，图52中带斜线的图形变成垂直
线段，它的面积等于零．因此应当这样来选取常数$C$，使得等式
$S(a)=F(a)+C=0$

<!-- foot -->
• 109 •
