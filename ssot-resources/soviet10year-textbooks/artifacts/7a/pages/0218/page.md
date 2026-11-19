---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "7a",
  "page": 218,
  "printed_page": 212,
  "notes": [],
  "errata": [
    {
      "id": "p0218-math-1",
      "block": "p0218#9",
      "original": "函数 $y=\\frac{12}{x}$ 在整个定义域上是减函数，那就错了. 实际上，取 $x_1=-2$，$x_2=6$，从不等式 $x_2>x_1$ 并不能得出：$\\frac{12}{x_2}<\\frac{12}{x_1}$（因为 $\\frac{12}{x_2}=\\frac{12}{6}=2$，$\\frac{12}{x_1}=\\frac{12}{-2}=-6$）.这样一来，对于我们指出的一对自变量的值来说，“自变量较大的值对应的函数值也较大”这个条件不成立.",
      "reason": "For the specified pair x1=-2<x2=6, f(x1)=-6<f(x2)=2. The larger-input/larger-output comparison is true, whereas the decreasing comparison is false. Replace only the last comparison word 较大 with 较小, keeping 不成立 and every formula/value, to preserve the counterexample to whole-domain decrease. Equivalent editorial alternatives do not create mathematical-intent ambiguity. Independent local clarification SHA2565ff1ae960d4064043a1f30203bdfbb9045118944ca2b17fdbd60a0c06500e366; FIRST verdict retained; printed source body unchanged."
    }
  ],
  "source": {
    "pdf": "7a 苏联十年制学校数学教材 代数 七年级.pdf",
    "pdf_sha256": "8070c333ee46fb0dc650cb32d4d898f605ed308559b6cc430425d908dae6b052",
    "pdf_page": 218
  },
  "render": {
    "dpi": 300,
    "w": 1504,
    "h": 2289,
    "sha256": "a8d8d705f99793cd24e18ce84e4f6fe4e138edf852525a96a0fd1628648dc8f6"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "printed_lines": 24,
  "figures": [
    {
      "id": "fig-51",
      "label": "图 51",
      "box": [
        226,
        759,
        366,
        376
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
此，所讨论的函数可以写成另一形式：
$y=\begin{cases}-x,\ \text{当 }x\in]-\infty,0[;↵x,\ \text{当 }x\in[0,+\infty[.\end{cases}$

<!-- p -->
从这种表示式可以看出，在集合 $]-\infty,0[$ 上，所讨论的函数就是
线性函数 $y=kx+l$，其中 $k=-1$，$l=0$，因此函数 $y$ 在这个集合上
减小；而在集合 $[0,+\infty[$ 上，所讨论的函数就是线性函数 $y=kx+l$，
其中 $k=1$，$l=0$，因此函数 $y$ 在这个集合上增大.

<!-- p -->
例3 在图51里作出了函数 $y=\frac{12}{x}$ 的图象.

<!-- fig 图 51 box 226,759,366,376 -->
![图 51](figures/fig-51.png)

<!-- p -->
函数的定义域是集合
$]-\infty,0[\cup]0,+\infty[$.

<!-- p -->
从图象可以看出，在负数集
合上函数减小，在正数集合上函
数也减小.

<!-- p open -->
注意，如果由此便作出结论，

<!-- cap 图 51 samerow -->
图51

<!-- p cont -->
函数 $y=\frac{12}{x}$ 在整个定义域上是减函数，那就错了. 实际上，
取 $x_1=-2$，$x_2=6$，从不等式 $x_2>x_1$ 并不能得出：
$\frac{12}{x_2}<\frac{12}{x_1}$（因为 $\frac{12}{x_2}=\frac{12}{6}=2$，$\frac{12}{x_1}=\frac{12}{-2}=-6$）.
这样一来，对于我们指出的一对自变量的值来说，“自变量较
大的值对应的函数值也较大”这个条件不成立.

<!-- ex 746 open -->
746. 函数 $f$ 的定义域是实数集. 利用它的图象（图52）比较
下列两个函数值的大小：
а) $f(-2.1)$ 和 $f(-3.6)$；б) $f(1.3)$ 和 $f(2.8)$；
в) $f(x_1)$ 和 $f(x_2)$，其中 $x_1<0$，$x_2<0$，且 $x_2>x_1$；

<!-- foot -->
212
