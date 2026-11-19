---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "7a",
  "page": 256,
  "printed_page": 250,
  "notes": [
    "The first row completes the open paragraph from physical 255, including the split word 集合.",
    "The source prose says 第一项与第二项的和的两倍, while the adjacent displayed identity is 5x=2*x*(5/2). The printed prose is retained, not silently corrected.",
    "The completing-the-square equality occupies two actual printed rows despite its tall fractions.",
    "The final paragraph about example 2 remains open at 就是说 and continues to physical 257."
  ],
  "errata": [
    {
      "id": "p0256-math-1",
      "block": "p0256#5",
      "original": "而把 $5x$ 看成第一项与第二项的和的两倍（$5x=2\\cdot x\\cdot\\frac{5}{2}$）",
      "reason": "原文说5x是x与5/2的和的两倍，但所列恒等式5x=2*x*(5/2)表示积的两倍。代入x=0，和的两倍为5而5x为0；前文p0255#8及后续配方均使用积的两倍。忠实文字和全部公式不改，只在现代层将和改为积。"
    }
  ],
  "source": {
    "pdf": "7a 苏联十年制学校数学教材 代数 七年级.pdf",
    "pdf_sha256": "8070c333ee46fb0dc650cb32d4d898f605ed308559b6cc430425d908dae6b052",
    "pdf_page": 256
  },
  "render": {
    "dpi": 300,
    "w": 1504,
    "h": 2289,
    "sha256": "e22e473d4c407024990d5e8b24aaaa004a1bdaf532a86ea0db3ad481db30b69f"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "printed_lines": 21,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p cont -->
合，是 $\{-5,-1\}$.

<!-- p -->
我们利用在方程的左边配一个二项式的平方的方法（简
称：配方法），再解几个 $ax^2+bx+c=0$（$a\neq0$）这种形式的方
程.

<!-- p -->
例 1　解方程

<!-- p -->
$x^2-5x+8=0$.

<!-- p -->
由三项式 $x^2-5x+8$ 配出二项式的平方. 如果把 $x^2$ 看
成二项式第一项的平方，而把 $5x$ 看成第一项与第二项的和的
两倍（$5x=2\cdot x\cdot\frac{5}{2}$），那么二项式的第二项是 $\frac{5}{2}$. 把两个大
小相等符号相反的数 $\left(\frac{5}{2}\right)^2$ 和 $-\left(\frac{5}{2}\right)^2$ 加到三项式里，得到：

<!-- p -->
$x^2-5x+8=x^2-2\cdot x\cdot\frac{5}{2}+\left(\frac{5}{2}\right)^2-\left(\frac{5}{2}\right)^2+8↵=\left(x-\frac{5}{2}\right)^2-\frac{25}{4}+8=\left(x-\frac{5}{2}\right)^2+\frac{7}{4}$.

<!-- p -->
已知方程和下列方程同解：

<!-- p -->
$\left(x-\frac{5}{2}\right)^2+\frac{7}{4}=0$.

<!-- p -->
因为当 $x$ 是任何数时，表示式 $\left(x-\frac{5}{2}\right)^2+\frac{7}{4}$ 是正的，于是所得
到的方程的解集合是空集，因此方程 $x^2-5x+8=0$ 的解集合
是空集.

<!-- p -->
例 2　解方程

<!-- p -->
$x^2-18x+81=0$.

<!-- p open -->
方程左边的三项式恒等于二项式 $x-9$ 的平方. 就是说，

<!-- foot -->
250
