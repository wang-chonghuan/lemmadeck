---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10c",
  "page": 25,
  "printed_page": 19,
  "source": {
    "pdf": "10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf",
    "pdf_sha256": "47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40",
    "pdf_page": 25
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2580,
    "sha256": "597d669b9b3c8a8abac3b6d53a27e5c35c7bf8e81150b7dc60b6537c28e64019"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "物理25页页脚19，无插图；正文/公式21横排，教学脚注2横排，页脚1横排，共24。",
    "页首“书的范围”承接前页“中学教科”，星号对应本页两行教学脚注；foot note 保留脚注内容，短分隔线不是文字行。",
    "式(9)实际为上下两横排 x(0)=x_0 和 v(0)=v_0，无左大括号，编号(9)居两排之间；aligned公式以一个真实换排标记记录两行。",
    "正文保留 A=0 最小周期例外、振幅A/频率omega/初相phi定义和原初始时刻条件；未新增条件。",
    "末句“由（8）和（9）得到：”open 到下一页；顶部、底部细横迹和左缘散点保留原像素，不登记计数排除。"
  ],
  "count_exclusions": [
    {
      "kind": "separator-rule",
      "box": [
        232,
        2097,
        484,
        8
      ],
      "reason": "源物理25页孤立脚注横分隔线的精确墨迹框；Ptolemy只读诊断10c-p23-p25-count-diagnostic.md（SHA-256 f7f33c51058a1fbd3b8837f73b0d123ebf1841e7b817fa0715e7058d97dd4c90）及母方实际打开原像素p0025-separator-footnotes-folio.png确认该线与y2149–2195、y2196–2243两行教学脚注分离，不是文字行。仅从计数副本排除该横线，完整保留两行脚注、页码、原PNG和正文。"
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

<!-- p cont -->
书的范围$^{*}$.

<!-- p -->
因此，公式（2）是谐振动的普遍公式.

<!-- p -->
很明显，函数 $f$ 绝对值的最大值等于 $A$. 我们把常数 $A$
叫做振动的振幅. 可以证明，由公式（2）给出的函数 $f$ 具有
周期
$T=\frac{2\pi}{\omega}.$
除了我们不感兴趣的情形 $A=0$ 以外，这个周期是最小的. 我
们把常数 $\omega$ 叫做振动频率. 最后，我们把常数 $\varphi$ 叫做振动的
初相.

<!-- p -->
$\blacktriangleright$ 现在我们回到小球的问题上来. 根据上面所说的道理，小
球应当按照规律
$x(t)=A\cos(\omega t+\varphi)\qquad(8)$
运动. 其中
$\omega=\sqrt{\frac{k}{m}}.$

<!-- p -->
在公式（8）里，$A$ 和 $\varphi$ 这两个常数暂时仍然是任意的. 当然，
由于把某一时刻当作初始时刻的不同，小球的初始位置和速
度不同，小球将按不同的方式运动. 例如，把 $t=0$ 当作起始
时刻，小球的坐标和速度由下式给出：
$\begin{aligned}x(0)&=x_0,\\↵v(0)&=v_0.\end{aligned}\qquad(9)$

<!-- p open -->
由（8）和（9）得到：

<!-- foot note -->
*　容易验证，限制 $A\geqslant0$，$\varphi\in[0,2\pi[$ 并不重要；取消这个限制，按照公式
（2），我们不会得出新的解.

<!-- foot -->
· 19 ·
