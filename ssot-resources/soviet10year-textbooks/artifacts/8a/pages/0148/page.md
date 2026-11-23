---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "8a",
  "page": 148,
  "printed_page": 141,
  "notes": [
    "FIRST N23 source author; physical 148 / printed 141 confirmed from pixels, offset +7.",
    "No figures, captions, or exercises on this page; numbered items 2, 3, 4 are body properties, not exercises.",
    "Wavy underlining visibly emphasizes the symmetry and monotonicity statements; it is not a separate figure.",
    "Real printed formula breaks after f(-a)= in property 3а and 3б are represented with ↵.",
    "Proof of property 4а ends on this page; the later proof subpart is not inferred from unseen pixels.",
    "Independent source review PENDING."
  ],
  "errata": [],
  "source": {
    "pdf": "8a 苏联十年制学校数学教材 代数 八年级.pdf",
    "pdf_sha256": "5978388efc80df4085400f80d5912f710efb052a806222633b172b0a9479b071",
    "pdf_page": 148
  },
  "render": {
    "dpi": 300,
    "w": 2480,
    "h": 3509,
    "sha256": "cdeec341a3236067e6c41b6cb7b7ee8859ca02375d40e22240f45cd8120b8b8e"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "printed_lines": 27,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p -->
2. а) 如果 $x\ne 0$ 并且 $n$ 是奇数，那么 $x^n$ 当 $x$ 为正数时
取正值，当 $x$ 为负数时取负值。因此，当 $n$ 是奇数时，函数 $f$
的图象位于第一象限和第三象限。

<!-- p -->
б) 如果 $x\ne 0$ 并且 $n$ 是偶数，那么 $x^n>0$。因此，当 $n$ 是
偶数时，函数 $f$ 的图象位于第一象限和第二象限。

<!-- p -->
3. а) 如果 $n$ 是奇数（$n=2k-1$，$k\in N$），那么自变量的两
个相反的值 $x=-a$ 和 $x=a$ 对应于函数的两个相反的值：
$f(-a)=(-a)^{2k-1}=-a^{2k-1}$，$f(a)=a^{2k-1}$，也就是 $f(-a)=↵-f(a)$。

<!-- p -->
于是，当 $n$ 是奇数时，函数 $f$ 的图象有对称中心，对称中
心是坐标原点。

<!-- p -->
б) 如果 $n$ 是偶数（$n=2k$，$k\in N$），那么自变量的两个相反
的值 $x=-a$ 和 $x=a$ 对应于函数的两个相等的值：$f(-a)=↵(-a)^{2k}=a^{2k}$，$f(a)=a^{2k}$，也就是 $f(-a)=f(a)$。于是，当 $n$
是偶数时，函数 $f$ 的图象有对称轴，对称轴是 $y$ 轴。

<!-- p -->
4. а) 当 $n$ 是奇数时，函数 $f$ 是增函数。б) 当 $n$ 是偶数
时，函数 $f$ 在负数集合上下降，而在正数集合上上升。

<!-- p -->
证明：а) 设 $a$ 和 $b$ 是自变量两个任意的值，并且 $a<b$。

<!-- p -->
如果 $0<a<b$，那么，根据真数值不等式逐项相乘的定理，得到：

<!-- p -->
$(a<b)\Rightarrow(a^2<b^2)\Rightarrow\cdots\Rightarrow(a^{2k-1}<b^{2k-1})$，$k\in N$。

<!-- p -->
如果 $a<b<0$，那么 $-a>-b>0$。因为 $-a$ 和 $-b$ 是正数，所以
$(-a)^{2k-1}>(-b)^{2k-1}$。于是 $-a^{2k-1}>-b^{2k-1}$，而 $a^{2k-1}<b^{2k-1}$。

<!-- p -->
如果 $a<0<b$，那么 $a^{2k-1}<0$，$b^{2k-1}>0$，也就是 $a^{2k-1}<b^{2k-1}$。

<!-- p -->
于是，对于任何的 $a$ 和 $b$ 得：

<!-- p -->
$(a<b)\Rightarrow[f(a)<f(b)]$，

<!-- p -->
也就是当 $n$ 是奇数时，函数 $f$ 在所有的数的集合上上升。

<!-- foot -->
· 141 ·
