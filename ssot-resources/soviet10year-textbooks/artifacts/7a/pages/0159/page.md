---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "7a",
  "page": 159,
  "printed_page": 153,
  "source": {
    "pdf": "7a 苏联十年制学校数学教材 代数 七年级.pdf",
    "pdf_sha256": "8070c333ee46fb0dc650cb32d4d898f605ed308559b6cc430425d908dae6b052",
    "pdf_page": 159
  },
  "render": {
    "dpi": 300,
    "w": 1504,
    "h": 2289,
    "sha256": "914fe37b7dbd84f554fcc82d6117be8b65c8cd7a49c56456ac5c81460079bd72"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "Leading 的不足近似值 fragment continues physical page 158's open paragraph. Footer 153 is read from pixels; no unit or section heading is printed.",
    "定义1 and 定义2 have wavy-underlined labels and bold definition text; they are inline prose objects, not invented numbered lesson headings.",
    "Figure 33 is the printed number line with a, x, b, 3.2, 3.3 and brace labels 0.083 and 0.017. Its rough box excludes the separate printed caption and the prose to its left.",
    "The final paragraph wraps beside figure 33 and ends at 为了求. It is open across the figure and to physical page 160. The caption shares the last prose row."
  ],
  "errata": [],
  "printed_lines": 26,
  "figures": [
    {
      "id": "fig-33",
      "label": "图 33",
      "box": [
        781,
        1815,
        547,
        134
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
的不足近似值，$b=3.3$ 是 $x$ 的过剩近似值。

<!-- p -->
定义1 一个量的准确值与近似值的差，叫做这个近似
值的误差。

<!-- p -->
把 $x$ 用它的不足近似值 $a$ 来代替，所产生的误差是：
$x-a=3.283-3.2=0.083$。
如果取 $x$ 的过剩近似值 $b$ 作为 $x$ 的近似值，那么这个近似值
的误差是：
$x-b=3.283-3.3=-0.017$。
显然，不足近似值的误差总是为正，而过剩近似值的误差总是
为负。

<!-- p -->
定义2 一个量的准确值与近似值之差的绝对值，叫做
这个近似值的绝对误差。

<!-- p -->
在我们所举的例子中，不足近似值的绝对误差：
$|x-a|=|0.083|=0.083$，
而过剩近似值的绝对误差：
$|x-b|=|-0.017|=0.017$。
比较这两个绝对误差的大小，得：
$|x-b|<|x-a|$。
由此可见，数 $x$ 的两个近似值中较好的近似值是过剩近似
值；它与 $x$ 相差较小。

<!-- p -->
不等式 $|x-b|<|x-a|$ 表明，在数轴上坐标为 $x$ 和 $b$ 的
两点间的距离小于坐标为 $x$ 和 $a$ 的两点间的距离（图33）。

<!-- p open -->
近似值的绝对误差表示

<!-- fig 图 33 box 781,1815,547,134 -->
![图 33](figures/fig-33.png)

<!-- p cont open -->
所选择的近似值和量的准确
值相差多少。但是，为了求

<!-- cap 图 33 samerow -->
图33

<!-- foot -->
153
