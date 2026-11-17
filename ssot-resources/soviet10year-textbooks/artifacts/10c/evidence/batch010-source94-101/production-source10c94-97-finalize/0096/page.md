---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10c",
  "page": 96,
  "printed_page": 90,
  "source": {
    "pdf": "10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf",
    "pdf_sha256": "47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40",
    "pdf_page": 96
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2580,
    "sha256": "226031830ec888dc6f3887289f30805cbde82f663e41df89cd93d9bf01e2d022"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "源作者草稿，未 finalize、装订或矢量化。首句承接物理95页 n95 首段。",
    "原书数轴区间 ]-∞,∞[ 照录，不改为圆括号；定向裁图确认后段两支参数为 m、p，括号内为 (m, p∈Z)，未改成 n。",
    "α=π/4+πk/2 的公式确实跨两条印刷行，按块格式在实际断点处用 ↵ 表示，未增加虚构行。",
    "最后的恒等式(3)与「因此，」尚未完，p open 接续物理97页首块。无插图、表格或图题；页码圆点照录，右边缘黑痕与零星细点保留源像素，未遮除。"
  ],
  "errata": [],
  "printed_lines": 22,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p cont -->
两边变形，使它们化为同一个式子。

<!-- p -->
有的等式，在一个集合中是恒等式，而在另一个集合中，
它不是恒等式。举例说，大家知道的三角公式在一定的集合
中是恒等式。例如，式
$\sin^2\alpha+\cos^2\alpha=1$　(1)
在整个数轴 $\mathbb{R}$ 上（即 $\alpha\in]-\infty,\infty[$）是恒等式。

<!-- p -->
倍角正切的公式
$\operatorname{tg}2\alpha=\frac{2\operatorname{tg}\alpha}{1-\operatorname{tg}^2\alpha}$　(2)

<!-- p -->
就不是在整个数轴 $\mathbb{R}$ 上是恒等式，第一，应当除去 $\operatorname{tg}\alpha$ 和
$\operatorname{tg}2\alpha$ 没有定义的那些点，也就是 $\alpha=\frac{\pi}{2}+\pi n\ (n\in\mathbb{Z})$，$\alpha=\frac{\pi}{4}+↵\frac{\pi k}{2}\ (k\in\mathbb{Z})$ 这种形式的点。第二，应当除去使右边的分母变成
零的那些点。在这些点上，$\operatorname{tg}^2\alpha=1$，就是 $\operatorname{tg}\alpha=1$ 和 $\operatorname{tg}\alpha=-1$。
这些点就是 $\alpha=\frac{\pi}{4}+\pi m$ 和 $\alpha=-\frac{\pi}{4}+\pi p\ (m,\ p\in\mathbb{Z})$ 这种形式
的点（我们发现，这些点已经除去，因为 $\alpha$ 取这些值时，$\operatorname{tg}2\alpha$
没有定义）。

<!-- p -->
证明恒等式时，有时在中间运算中要进行约分。那么就
应当从给出恒等式的区域中除去使所用约简因式变成零的那
些值。

<!-- p open -->
例如，证明恒等式
$\frac{\cos^4\alpha-\sin^4\alpha}{\cos^2\alpha-\sin^2\alpha}=1$　(3)
时，我们使左边变形，用 $\cos^2\alpha-\sin^2\alpha$ 除分子和分母。因此，

<!-- foot -->
• 90 •
