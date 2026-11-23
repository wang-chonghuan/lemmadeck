---
{
  "book": "9c",
  "page": 82,
  "printed_page": 75,
  "notes": [
    "Fresh AUTHOR only; OPEN pending parent full intake, no source/page/unit approval.",
    "Actual original heading: 22. 极限的唯一性·收敛数列和发散数列. No TOC-derived heading or boundary.",
    "One triangle-inequality chain spans two physical rows; its exact physical break is encoded by ↵ on one schema line. FIRST's original literal-newline-plus-marker representation remains immutable; this canonical representation change is documented separately. Fraction internals are not fabricated rows.",
    "Last actual body row ends 根据极限 and is p open toward 83. No inferred completion.",
    "Epsilon font variant uncertain, transcribed as \\varepsilon; slanted less-than-or-equal as \\leqslant. Nested x_{n_0} retained.",
    "No figures or exercises on this page. Printed footer dots around 75, source specks retained, no count exclusions.",
    "No 79/84 pixel access; outer84 UNKNOWN. Source/render/profile binding left for native finalizer."
  ],
  "schema": "ld-s10y-lesson/page@3",
  "source": {
    "pdf": "9c 苏联十年制学校数学教材 代数和分析初步 九年级.pdf",
    "pdf_sha256": "622f972014ce83a76a36b3174ce6d6995e77b86efa0f8dbaba7f5497729a8aec",
    "pdf_page": 82
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2381,
    "sha256": "67db120051442916d43f8cb2e4a8ebf722d33594c69a00d26769d9d84c4ac39e"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0"
  },
  "printed_lines": 22,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- h3 -->
22. 极限的唯一性·收敛数列和发散数列

<!-- p -->
凭着直观感觉，数列只能有一个极限，似乎是对的.

<!-- p -->
定理. 如果数列收敛，那么它只有一个极限.

<!-- p -->
证明 设$\lim_{n\to\infty}x_n=a$，$\lim_{n\to\infty}x_n=b$. 根据极限的定义，对于
任意$\varepsilon>0$，存在这样的$n_1$和$n_2$，使得，当$n>n_1$时，
$|x_n-a|<\frac{\varepsilon}{2}$，
当$n>n_2$时，
$|x_n-b|<\frac{\varepsilon}{2}$.

<!-- p -->
取一个同时大于$n_1$和$n_2$的数$n_0$，那么，
$|x_{n_0}-a|<\frac{\varepsilon}{2}$，$|x_{n_0}-b|<\frac{\varepsilon}{2}$，
于是
$|a-b|=|(a-x_{n_0})+(x_{n_0}-b)|\leqslant|a-x_{n_0}|+|x_{n_0}-b|↵<\frac{\varepsilon}{2}+\frac{\varepsilon}{2}=\varepsilon$.

<!-- p -->
我们得到，非负数$|a-b|$小于任意正数$\varepsilon$. 但是，能满足这个
条件的只有零这个数，即$|a-b|=0$，因此$a=b$.

<!-- p -->
于是，数列只可能有两种情况：1) 数列有极限，而且只有
一个，这样的数列叫做收敛数列；2) 数列没有极限. 这样的数
列叫做发散数列.

<!-- p -->
举几个发散数列的例子.

<!-- p -->
例1. $x_n=n$，$n\in N$.

<!-- p open -->
假设数列$(x_n)$收敛，且有极限$a$. 取$\varepsilon=1$，那么，根据极限

<!-- foot -->
• 75 •
