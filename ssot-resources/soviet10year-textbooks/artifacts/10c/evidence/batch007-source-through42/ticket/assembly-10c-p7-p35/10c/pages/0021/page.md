---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10c",
  "page": 21,
  "printed_page": 15,
  "notes": [
    "逐张观察原 page.png、page.grid.png、source-top-crop.png、source-table-crop.png 和 source-example-bottom-crop.png 后转写；作者目读实际印刷 16 行（挖除表及图，图 9 图题与最后正文行同排，含页码），未独立复审。",
    "无编号导函数符号表属于正文例子而非练习图，整体保留原表框、两列区间及各项数学字形，不添加 owner-ex。表头为 0<x<π/2 与 π/2<x<π；cos'x(=-sin x) 两列均 <0，cos''x(=-cos x) 两列依次 <0、>0。",
    "图 9 保留余弦曲线、切线、坐标轴及原标注；图题与最后一行正文同排。",
    "页顶、页底细线及左边孤立点未写入正文，未添加 count_exclusions。",
    "例子的结束实心左三角以 LaTeX blacktriangleleft 保留。末句完整结束，本页不含新单元或习题；仍属 n79。"
  ],
  "errata": [],
  "source": {
    "pdf": "10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf",
    "pdf_sha256": "47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40",
    "pdf_page": 21
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2580,
    "sha256": "cad9ed0128b3c2865a28c22fe7a42cb71602d88c0b6923d3b30926c91afc0328"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "printed_lines": 16,
  "figures": [
    {
      "id": "tbl-p0021-01",
      "label": "表",
      "box": [
        315,
        806,
        1109,
        344
      ]
    },
    {
      "id": "fig-09",
      "label": "图 9",
      "box": [
        1021,
        1711,
        454,
        370
      ]
    }
  ],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p -->
在数学分析教程里，可以证明，凸性仅仅由二阶导数的符
号确定（与一阶导数的符号无关）：如果在区间 $I$ 里，二阶导
数是正的，那么图象向下凸；如果在区间 $I$ 里，二阶导数是负
的，那么图象向上凸.

<!-- p -->
例　在区间 $]0,\frac{\pi}{2}[$ 和 $]\frac{\pi}{2},\pi[$ 上，讨论函数 $\cos$ 的性质.

<!-- p -->
为了便于讨论，把函数 $\cos$ 的导函数符号列成表：

<!-- fig 表 box 315,806,1109,344 -->
![表](figures/tbl-p0021-01.png)

<!-- p -->
由表可以看出，在区间 $]0,\frac{\pi}{2}[$ 上，余弦函数加速下降（参
看情形 4），而在区间 $]\frac{\pi}{2},\pi[$ 上，减速下降（参看情形 3）.

<!-- p -->
注　在 $x=\frac{\pi}{2}$ 这一点，余弦函数的加速下降变成减速下降. 余弦
函数的图象在点 $\left(\frac{\pi}{2},0\right)$ 有“拐点”（图 9）.

<!-- p -->
在这一点的切线方程是
$y=\frac{\pi}{2}-x$.

<!-- p -->
切点左边，切线在函数图象的
上方通过，而切点右边，切线在函数
图象的下方通过. $\blacktriangleleft$

<!-- fig 图 9 box 1021,1711,454,370 -->
![图 9](figures/fig-09.png)

<!-- cap 图 9 samerow -->
图 9

<!-- foot -->
· 15 ·
