---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10p",
  "page": 175,
  "printed_page": 165,
  "source": {
    "pdf": "10p 苏联中学课本 物理 十年级 .pdf",
    "pdf_sha256": "7190041b66182e5f6c5a4ef7ae0b04ee3f1afa0df1f5b3ff6317b2c2d1cb8f40",
    "pdf_page": 175
  },
  "render": {
    "dpi": 300,
    "w": 1536,
    "h": 2337,
    "sha256": "234c586865f427ca515d1e31da1c9bf3c891791a5d28a30c5e74d1f15ea69b38"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "c364d68442cfccc9920d3e23932d418c3d7b123cf4a47408e6535dcb19f7104a"
  },
  "notes": [
    {
      "type": "continuation",
      "block": "p0175#1",
      "previous_source_ref": "p0174#7",
      "previous_tail_text": "立体角 用立体角来描述光源在不同方向发出的光通",
      "basis": "175 实际 grid 开头为“量.”，承接前页纯文本尾部；仍为 n67，不猜新标题。"
    },
    {
      "type": "layout",
      "block": "p0175#4",
      "text": "图 134",
      "line_range": [
        1,
        1
      ],
      "shared_with": "p0175#2",
      "shared_line": 4,
      "basis": "完整 grid 中图题与上方段落第四行同排；图题独立 cap samerow，不删正文行。"
    },
    {
      "type": "bold",
      "block": "p0175#5",
      "text": "立体角",
      "line_range": [
        1,
        1
      ],
      "character_range_1based_inclusive": [
        25,
        27
      ],
      "basis": "实际 solid-angle RAW 中第一行末三字为粗体，其余同名术语不据此扩张字重。"
    },
    {
      "type": "dot-emphasis",
      "block": "p0175#6",
      "text": "球面度",
      "line_range": [
        2,
        2
      ],
      "character_range_1based_inclusive": [
        26,
        28
      ],
      "position": "三个字各自下方",
      "basis": "实际 solid-angle RAW 可见三个字下强调点；不是 bold，不把强调点写成 literal dots。"
    },
    {
      "type": "bold",
      "block": "p0175#8",
      "text": "发光强度",
      "line_range": [
        1,
        1
      ],
      "character_range_1based_inclusive": [
        1,
        4
      ],
      "basis": "实际 intensity RAW 确认粗体行内引题，不是编号 h3。"
    },
    {
      "type": "bold",
      "block": "p0175#8",
      "text": "光源在单位立体角内所产生的光通量叫光源的发光强度.",
      "line_range": [
        1,
        2
      ],
      "ranges": [
        {
          "line": 1,
          "character_range_1based_inclusive": [
            6,
            24
          ],
          "text": "光源在单位立体角内所产生的光通量叫光源"
        },
        {
          "line": 2,
          "character_range_1based_inclusive": [
            1,
            6
          ],
          "text": "的发光强度."
        }
      ],
      "basis": "实际 intensity RAW 中定义整句为粗体，后面的“如果”起恢复普通字重。"
    },
    {
      "type": "source-formulas",
      "block": "p0175#9",
      "text": "(6.4)",
      "line_range": [
        3,
        3
      ],
      "basis": "公式按源页保留；末式完整但没有 n67 结束或下一标题的实图证据，不以知识推测边界。"
    }
  ],
  "errata": [],
  "printed_lines": 23,
  "figures": [
    {
      "id": "fig-134",
      "label": "图 134",
      "box": [
        749,
        108,
        571,
        272
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
量.

<!-- p open -->
我们来研究任意形状的
面积，并设想从某点向包围
这一面积的曲线上的所有点
作一些直线（图 134）. 这些

<!-- fig 图 134 box 749,108,571,272 -->
![图 134](figures/fig-134.png)

<!-- cap 图 134 samerow -->
图 134

<!-- p cont -->
直线在空间划出一个锥形的区域. 这样的空间区域叫立体角
$\Omega$. 设一球面以角的顶点为中心，半径为 $R$，立体角 $\Omega$ 在球面
上切下面积为 $S$ 的曲面. 从数量上看立体角 $\Omega$ 的值可理解为
这个面积对球面半径的平方之比：
$\Omega=\frac{S}{R^2}$ (6.1)

<!-- p -->
不难理解，立体角的值和球的半径无关，因为立体角切下的面
积 $S$ 与半径的平方成正比. 立体角的单位叫做球面度，一个
球面度的立体角在球面上切割的面积等于球面半径的平方.

<!-- p -->
包含点周围的所有空间的整个立体角，等于
$\Omega=\frac{S}{R^2}=\frac{4\pi R^2}{R^2}=4\pi$ 球面度 (6.2)

<!-- p -->
发光强度 光源在单位立体角内所产生的光通量叫光源
的发光强度. 如果光源在立体角 $\Omega$ 里建立的光通量为 $\Phi$，那
么光源发光强度 $I$ 按下式确定：
$I=\frac{\Phi}{\Omega}$ (6.3)

<!-- p -->
因为整个立体角含有 $4\pi$ 球面度，那么点光源的发光
强度
$I=\frac{\Phi}{4\pi}$ (6.4)

<!-- foot -->
165
