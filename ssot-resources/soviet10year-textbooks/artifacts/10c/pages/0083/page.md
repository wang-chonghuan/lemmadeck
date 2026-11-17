---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10c",
  "page": 83,
  "printed_page": 77,
  "source": {
    "pdf": "10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf",
    "pdf_sha256": "47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40",
    "pdf_page": 83
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2580,
    "sha256": "e5c85c21c403e46f71619e6a972348712b3ad78af6e47c26de23ab40d3e534fa"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "源稿，未 finalize，未经独立源审查；页脚直接确认印刷页 77。",
    "首块承接物理页 82 的推导；保留公式编号 (1)-(4) 及其定义域说明。",
    "定义域段落在 x=π/2+ 与后一处 x= 之后有真实印刷断行，均用 ↵ 保留，不把分式分子、分母误计成另行。",
    "Z 字母可读，但其具体字重/黑板粗体属性未独立确认，暂只记 Z，不根据整数集语义补造字体。",
    "页末例题 3cos x+4sin x=5 的印刷解答在（当之后续到物理页 84；无图表。"
  ],
  "errata": [],
  "count_exclusions": [
    {
      "kind": "scan-artifact",
      "box": [
        0,
        2470,
        1695,
        40
      ],
      "reason": "独立原图局部观察确认此页脚下方矩形仅含孤立、边缘不齐且粗细不均的外围墨迹，无正文、公式、图或页码；物理成因 UNKNOWN，仅用于计数排除，原像素不改。"
    }
  ],
  "printed_lines": 16,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p cont -->
现在我们用$\cos^2\frac{x}{2}$来除分子和分母，得到：
$\sin x=\frac{2\operatorname{tg}\frac{x}{2}}{1+\operatorname{tg}^2\frac{x}{2}}$， (1)
$\cos x=\frac{1-\operatorname{tg}^2\frac{x}{2}}{1+\operatorname{tg}^2\frac{x}{2}}$。 (2)

<!-- p -->
这时应当考虑所讨论的函数和分式的定义域。在这种情况
下，$x\ne(2k+1)\pi$，$k\in Z$。

<!-- p -->
如果利用倍角的正切公式，就可以用$\operatorname{tg}\frac{x}{2}$表示其他三角
函数：
$\operatorname{tg}x=\frac{2\operatorname{tg}\frac{x}{2}}{1-\operatorname{tg}^2\frac{x}{2}}$， (3)
$\operatorname{ctg}x=\frac{1-\operatorname{tg}^2\frac{x}{2}}{2\operatorname{tg}\frac{x}{2}}$。 (4)

<!-- p -->
同时应当考虑所讨论的函数和分式的定义域。当$x=\frac{\pi}{2}+↵\pi k\ (k\in Z)$和$x=\pi+2\pi l\ (l\in Z)$时，(3)式失去意义，而当$x=↵\pi k\ (k\in Z)$时，(4)式失去意义。

<!-- p -->
例 解方程
$3\cos x+4\sin x=5$。

<!-- p open -->
我们用带有半角正切的式子代替正弦和余弦，得到（当

<!-- foot -->
77
