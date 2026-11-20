---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10p",
  "page": 74,
  "printed_page": 64,
  "source": {
    "pdf": "10p 苏联中学课本 物理 十年级 .pdf",
    "pdf_sha256": "7190041b66182e5f6c5a4ef7ae0b04ee3f1afa0df1f5b3ff6317b2c2d1cb8f40",
    "pdf_page": 74
  },
  "render": {
    "dpi": 300,
    "w": 1536,
    "h": 2337,
    "sha256": "55fe6841e7f15b0c515e660fe82bdb6f13121e3f09a0ca364b0fd0d6f601c985"
  },
  "notes": [
    "FIRST visual author candidate only; original page.png and grid inspected separately, with 25 actual printed rows including footer. Independent source review is pending.",
    "The flush-left opening 这个式子的物理意义很简单 actually continues the preceding candidate's open paragraph after P=UI (2.43). The preceding physical page73 remains D207_AUTHOR_ONLY_NATIVE73_UNATTEMPTED_SOURCE_REVIEW_PENDING; this pairing is not approval.",
    "HOLD: italic amplitude subscripts in the unnumbered voltage/current formulas and (2.45) are transcribed provisionally as Cyrillic м, consistent with the incoming candidate. Source glyph/script disambiguation still requires independent review; no physics-derived substitution is authorized.",
    "The phrase 平均功率 in the second row of the 通常 paragraph is visibly bold and is retained as emphasis.",
    "The last paragraph ends with 的两角余弦乘积的公式： and remains open into physical page75. No formula is invented on this page.",
    "There is no heading, exercise group, task number, figure, caption, square marker or erratum on this page. Formula scope and printed equation labels (2.44), (2.45) are preserved."
  ],
  "errata": [],
  "profile": {
    "id": "soviet-cn",
    "sha256": "54c02ea7d234571bd2d87c14289640701d1aa7ada4c3aed67403cec26680cddc"
  },
  "printed_lines": 25,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p cont -->
这个式子的物理意义很简单. 因为电压$U$乃是移动单位电荷
时电场力做的功，那么乘积$UI$就是在单位时间内通过导体横
截面的电荷做的功，也就是功率. 如果能量从线路的其它部
分输入这段电路，那么在这段电路上电流的功率是正值，而如
果能量从这段电路输回线路，则功率是负值. 在很小的时间
间隔内交流电流可以看作是不变的，所以交流电路里的瞬时
功率也用这样的公式确定：
$p=ui$ （2.44）

<!-- p -->
如果电路两端的电压按简谐规律变化
$u=U_{м}\cos\omega t$
那么，电流强度将以同样的频率随时间简谐变化. 但在一般
情况下，相对于电压将有相位差：
$i=I_{м}\cos(\omega t+\varphi)$
其中$\varphi$就是相位差，所以瞬时功率可以写为：
$p=ui=U_{м}I_{м}\cos\omega t\cdot\cos(\omega t+\varphi)$ （2.45）

<!-- p -->
在这种情况下，功率无论其模还是符号都随时间变化. 在
一个周期的一部分时间内能量输入该段电路（$p>0$），但在该
周期的另一段时间内，一部分能量重新输回电路中去（$p<0$）.

<!-- p -->
通常，在所有的情况下，我们要求知道的是在含有很多周
期的一段足够长的时间内，一段电路中电流的**平均功率**. 为此
只要求出在一个周期内的平均功率就可以了（见第23节）.

<!-- p open -->
为了求出在一个周期内的平均功率，我们变换公式
（2.45），把其中与时间无关的项分出来. 为此，我们利用已知
的两角余弦乘积的公式：

<!-- foot -->
• 64 •
