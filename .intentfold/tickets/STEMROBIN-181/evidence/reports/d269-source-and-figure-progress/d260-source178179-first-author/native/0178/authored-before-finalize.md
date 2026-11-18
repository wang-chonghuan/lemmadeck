---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10p",
  "page": 178,
  "printed_page": 168,
  "source": {
    "pdf": "10p 苏联中学课本 物理 十年级 .pdf",
    "pdf_sha256": "7190041b66182e5f6c5a4ef7ae0b04ee3f1afa0df1f5b3ff6317b2c2d1cb8f40",
    "pdf_page": 178
  },
  "render": {
    "dpi": 300,
    "w": 1536,
    "h": 2337,
    "sha256": "b66042548cf0422970bd1811663a7797bad8ad35570a4713d995d9b7a5075bf5"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "c364d68442cfccc9920d3e23932d418c3d7b123cf4a47408e6535dcb19f7104a"
  },
  "notes": [
    {
      "type": "source-boundary",
      "block": "p0178#3",
      "previous_source_ref": "p0177#11",
      "basis": "178页第一块正文以“第一个面同样的……”实际续接177稿末“光源以对”；页顶图136及图题按物理顺序保留为透明图块，不打断正文cont。"
    },
    {
      "type": "bold",
      "block": "p0178#8",
      "line_range": [1, 1],
      "text": "这就是说，表面的照度与光线入射角的余弦成正比.",
      "character_range_1based_inclusive": [1, 23],
      "basis": "该整行相对前后常规正文明确粗体；未把下一行总结句擅自增设为粗体。"
    },
    {
      "type": "italic",
      "block": "p0178#10",
      "line_range": [1, 1],
      "text": "168",
      "character_range_1based_inclusive": [3, 5],
      "basis": "页脚三位数字右倾，装饰点不属于正文。"
    },
    {
      "type": "math-typography",
      "blocks": ["p0178#3", "p0178#4", "p0178#5", "p0178#6", "p0178#7"],
      "basis": "原式变量a、b、b_0、E、E_0、S、Phi和alpha保留LaTeX数学斜体，cos保留直立运算符；所有显示分式每一横排只计一印刷行。"
    },
    {
      "type": "source-observation",
      "basis": "本页无新编号标题、题目、解释性脚注或可确认的字下强调点；图136完整位于页顶，图内Delta S、Delta S_0、a、b、b_0、alpha由裁图保存，不额外抄作正文。页末总结句以句点结束，未观察179前不猜是否另有新单元。"
    }
  ],
  "errata": []
}
---

<!-- fig 图 136 box 350,245,780,250 -->
![图 136](figures/fig-136.png)

<!-- cap 图 136 -->
图 136

<!-- p cont -->
第一个面同样的光通量照在这个平面上. 如果第二个平面和
第一平面成 $\alpha$ 角，那末从中心光源射在它上面的光线的入射
角同样等于 $\alpha$. 第二个平面的面积等于 $\Delta S$. 从图形中很容易
看出，两个平面都具有同一宽度 $a$，但长度 $b$ 和 $b_0$ 不同，并
且因为
$\frac{b_0}{b}=\cos\alpha$

<!-- p -->
所以
$\frac{\Delta S_0}{\Delta S}=\frac{ab_0}{ab}=\cos\alpha$

<!-- p -->
当光通量均为 $\Delta\Phi$ 时，两个平面的照度就将不同：
$E=\frac{\Delta\Phi}{\Delta S}$，　$E_0=\frac{\Delta\Phi}{\Delta S_0}$

<!-- p -->
于是
$\frac{E}{E_0}=\frac{\Delta S_0}{\Delta S}=\cos\alpha$

<!-- p -->
因此，与光线倾斜的面上的照度 $E$ 与光线垂直的面上的照度
$E_0$ 有如下的联系：
$E=E_0\cos\alpha$ (6.6)

<!-- p -->
这就是说，表面的照度与光线入射角的余弦成正比.

<!-- p -->
综合得出的结果，可以总结出一条一般的规律.

<!-- foot -->
• 168 •
