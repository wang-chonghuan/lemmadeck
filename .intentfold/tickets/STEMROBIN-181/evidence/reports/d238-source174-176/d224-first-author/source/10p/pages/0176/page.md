---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10p",
  "page": 176,
  "printed_page": 166,
  "source": {
    "pdf": "10p 苏联中学课本 物理 十年级 .pdf",
    "pdf_sha256": "7190041b66182e5f6c5a4ef7ae0b04ee3f1afa0df1f5b3ff6317b2c2d1cb8f40",
    "pdf_page": 176
  },
  "render": {
    "dpi": 300,
    "w": 1536,
    "h": 2337,
    "sha256": "2f7e6a5705b5d0247b3926418843914bae3d963a024ee7a2204f7a4bc5419efa"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "c364d68442cfccc9920d3e23932d418c3d7b123cf4a47408e6535dcb19f7104a"
  },
  "notes": [
    {
      "type": "pre-author-inventory",
      "path": "sourceinventory/0176.pre-author.json",
      "sha256": "acd5f61bffbc2f9bc3b16f12da85f390a65a5ce4537d6f19e181581ecbd3e794",
      "basis": "读完自己的176源像素后先冻结独立作者 inventory，再写本稿；不是独审 SOURCE。"
    },
    {
      "type": "source-boundary",
      "block": "p0176#1",
      "previous_source_ref": "p0175#9",
      "previous_object_open": false,
      "text": "其中",
      "line_range": [
        1,
        1
      ],
      "basis": "本段解释前页完整公式的符号，仍属 n67；按 manifest 保留旧块完整状态，不改旧页，不预造 cont。"
    },
    {
      "type": "bold",
      "block": "p0176#3",
      "text": "光通量的单位",
      "line_range": [
        1,
        1
      ],
      "character_range_1based_inclusive": [
        1,
        6
      ],
      "basis": "实际 photometric-units RAW 可见粗体行内引题，不是新的编号标题。"
    },
    {
      "type": "dot-emphasis",
      "block": "p0176#3",
      "text": "流明",
      "line_range": [
        1,
        1
      ],
      "character_range_1based_inclusive": [
        9,
        10
      ],
      "position": "首次单位名称两字各自下方",
      "basis": "实际 lumen-emphasis 窄 RAW 确认两个字下强调点；不猜 bold，不写 literal dots。"
    },
    {
      "type": "bold",
      "block": "p0176#6",
      "text": "照在某一面积上的光通量 $\\Phi$ 和该面积 $S$ 的比值叫做照度 $E$.",
      "line_range": [
        1,
        2
      ],
      "ranges": [
        {
          "line": 1,
          "character_range_1based_inclusive": [
            1,
            34
          ],
          "text": "照在某一面积上的光通量 $\\Phi$ 和该面积 $S$ 的比值叫做照"
        },
        {
          "line": 2,
          "character_range_1based_inclusive": [
            1,
            6
          ],
          "text": "度 $E$."
        }
      ],
      "basis": "实际 illuminance RAW 中两行定义整句及符号为粗体；下一行 (6.5) 是完整分式，不伪造分子分母续行。"
    },
    {
      "type": "dot-emphasis",
      "block": "p0176#7",
      "text": "勒克斯",
      "line_range": [
        1,
        1
      ],
      "character_range_1based_inclusive": [
        7,
        9
      ],
      "position": "三个字各自下方",
      "basis": "实际 illuminance RAW 确认三个字下强调点，保留术语原字，不改源科技知识。"
    },
    {
      "type": "footnote",
      "block": "p0176#9",
      "text": "① 从前这个单位叫烛光.",
      "line_range": [
        1,
        1
      ],
      "owner_source_ref": "p0176#2",
      "owner_line": 2,
      "unit": "n67",
      "basis": "实际一行小字脚注按正文唯一①认领；虽在 n68 下方，仍属 n67，对 open/cont 透明。"
    },
    {
      "type": "source-wording",
      "block": "p0176#8",
      "text": "主要是要知道",
      "line_range": [
        1,
        1
      ],
      "basis": "实际 RAW 如此印刷，保留原文，不删除重复字；末段未完，标 open。"
    },
    {
      "type": "footer-layout",
      "block": "p0176#10",
      "text": "166",
      "line_range": [
        1,
        1
      ],
      "flanking_marks": "左右各一印刷实点",
      "basis": "实际完整 grid 可见页码及两侧装饰点；页码块保留数字，装饰位置在 notes 留存，不冒充点强调。"
    }
  ],
  "errata": [],
  "printed_lines": 24,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p -->
其中 $\Phi$ 是光源的全部光通量，也就是按视觉估价的从光源向
所有方向传播的光辐射的功率.

<!-- p -->
在国际单位制中，取发光强度单位坎德拉作为光度学量
的基本单位①. 对发光强度建立一个度量标准是很简单的. 用
专门的发光器作发光强度单位 (1 坎德拉) 的度量标准. 所有
其他的光学单位，其中包括光通量的单位，都是由发光强度单
位导出的.

<!-- p -->
光通量的单位 取流明作为光通量的单位. 1 流明是发
光强度为 1 坎德拉的点光源，在 1 球面度的立体角中发出来
的光通量.

<!-- h3 -->
68. 照度

<!-- p -->
光源照在物体表面几乎总是不均匀的，如挂在桌子上方
的灯，照得最亮的是桌子中心，桌边缘处照明显著较差. 问题
不仅在于电灯在不同方向的发光强度不同. 甚至在点光源的
情况下，桌子中心也比桌子边缘上获得的光强度（光通量）
大.

<!-- p -->
照在某一面积上的光通量 $\Phi$ 和该面积 $S$ 的比值叫做照
度 $E$.
$E=\frac{\Phi}{S}$ (6.5)

<!-- p -->
照度的单位是勒克斯——它是 1 流明的光通量均匀分布在 1
米$^2$表面时的照度.

<!-- p open -->
对于光度学的计算，主要是要知道任一表面上的照度 $E$

<!-- p footnote -->
① 从前这个单位叫烛光.

<!-- foot -->
166
