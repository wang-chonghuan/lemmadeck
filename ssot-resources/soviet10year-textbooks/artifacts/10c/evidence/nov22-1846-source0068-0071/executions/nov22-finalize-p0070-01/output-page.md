---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10c",
  "page": 70,
  "printed_page": 64,
  "source": {
    "pdf": "10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf",
    "pdf_sha256": "47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40",
    "pdf_page": 70
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2580,
    "sha256": "d83dc5f270be7d7f98d19bd02672a60bd9ca2e8a1ef5f290ec16c6c6224f9e0f"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0"
  },
  "notes": [
    "SOURCE AUTHOR only; N88中段，未装订、未独立审核。本页首段另起完整段，不是0069句子残片。",
    "图41右侧绕排；图题的实际印刷行与首段末行“得到解：”同排，cap samerow仅记录这个可见同排事实。首段经图和图题以open/cont接回独立公式(2)。",
    "例2、例3为正文例题；1、2是余切基本性质，不是习题号。末项2句子完整，无outgoing prose open。",
    "页脚64；未登记计数排除。"
  ],
  "errata": [],
  "printed_lines": 25,
  "figures": [
    {
      "id": "fig-41",
      "label": "图 41",
      "box": [
        945,
        397,
        465,
        550
      ]
    }
  ],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p open -->
为了求出方程（1）所有的解，只要在长度为 $\pi$ 的任一区
间上（因为余切的周期是 $\pi$）求
出这个方程所有的解就行了。由
图41可以看出，取区间 $]0,\pi[$ 比
较方便。根据反余切的定义，在
区间 $]0,\pi[$ 上，方程（1）的解是
$\operatorname{arcctg}a$。现在，为了写出方程
（1）所有的解，必须利用余切函
数的周期性，就是把 $\operatorname{arcctg}a$ 加
上 $\pi n(n\in Z)$ 这种形式的数，得到解：

<!-- fig 图 41 box 945,397,465,550 -->
![图 41](figures/fig-41.png)

<!-- cap 图 41 samerow -->
图 41

<!-- p cont -->
$x=\operatorname{arcctg}a+\pi n(n\in Z)$。 （2）

<!-- p -->
例2 解方程
$\operatorname{ctg}x=1$。

<!-- p -->
根据（2）式得到：
$x=\operatorname{arcctg}1+\pi k$；$x=\frac{\pi}{4}+\pi k$，$k\in Z$。

<!-- p -->
例3 解方程
$\operatorname{ctg}x=\sqrt{3}$。

<!-- p -->
根据（2）式得到：
$x=\operatorname{arcctg}\sqrt{3}+\pi k$，$x=\frac{\pi}{6}+\pi k$，$k\in Z$。

<!-- p -->
现在列出余切的基本性质：

<!-- p -->
1. 函数的定义域是去掉 $\pi n$（其中 $n\in Z$）这种形式的数以
外所有实数集合。

<!-- p -->
2. 余切函数值的集合是整个数轴：$E(\operatorname{ctg})=R$。因此，
余切是无界函数。

<!-- foot -->
64
