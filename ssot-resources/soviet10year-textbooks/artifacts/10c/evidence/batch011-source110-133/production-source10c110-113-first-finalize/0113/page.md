---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10c",
  "page": 113,
  "printed_page": 107,
  "source": {
    "pdf": "10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf",
    "pdf_sha256": "47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40",
    "pdf_page": 113
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2580,
    "sha256": "6102a01cb60241ee1b45458a025c600820edafc98fa11cbedc4acb0600f946b1"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "原始 page.png 以原生 1695×2580 尺寸单独读取一次；未读取网格图或范围外相邻页，未用裁图。",
    "本页全部正文继续0112页单元100例1；正文被图50、51分开，使用p cont open连接同一已解owner。两个图及图题也属于完整已解owner，不作未来盲题种子。",
    "图50、51各为单张编号图，粗框采用原生坐标；图题并排同一印刷行，图51图题为samerow。图51保留源点A、B、C、D、E、N和x、x+Δx等标注，仅在author ledger登记库存，未重画。",
    "页末实印文字截在“有等于$x^2$的极”的“极”字，正文open由可见残句证明；未读取0114，完整例1及单元100的未来右边界仍未证明。",
    "独立印刷文字行16行，包含并排图题1行、页脚1行，排除图形内部标注。所有高分式、不等式各按实际横排计一次，没有公式换行标记或重复边界。",
    "未设置计行排除区，未登记仅靠数学推测的勘误。"
  ],
  "errata": [],
  "printed_lines": 16,
  "figures": [
    {
      "id": "fig-50",
      "label": "图 50",
      "box": [
        416,
        454,
        342,
        521
      ]
    },
    {
      "id": "fig-51",
      "label": "图 51",
      "box": [
        814,
        444,
        473,
        530
      ]
    }
  ],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p cont open -->
我们取$x\in[1,2]$并讨论这个曲边梯形位于$x$点左边的部
分（图50）．

<!-- fig 图 50 box 416,454,342,521 -->
![图 50](figures/fig-50.png)

<!-- fig 图 51 box 814,444,473,530 -->
![图 51](figures/fig-51.png)

<!-- cap 图 50 -->
图50

<!-- cap 图 51 samerow -->
图51

<!-- p cont open -->
在图50中带斜线的图形用$S(x)$表示．从而在区间
$[1,2]$上定义了一个函数$S(x)$．我们来计算这个函数的导函
数．为了不使计算复杂化，我们列出当$\Delta x>0$的情形下直观
的计算步骤．于是，
$\Delta S(x)=S(x+\Delta x)-S(x)$
是图51中带斜线的图形的面积．显然，
面积$ABCD<\Delta S(x)<$面积$ECDN$，
或
$x^2\Delta x<\Delta S(x)<(x+\Delta x)^2\Delta x$，
也就是$x^2<\frac{\Delta S(x)}{\Delta x}<(x+\Delta x)^2$，
$0<\frac{\Delta S(x)}{\Delta x}-x^2<2x\Delta x+(\Delta x)^2$．
由此可以看出，当$\Delta x$趋向零时，分式$\frac{\Delta S(x)}{\Delta x}$有等于$x^2$的极

<!-- foot -->
•107•
