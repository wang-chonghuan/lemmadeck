---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10c",
  "page": 114,
  "printed_page": 108,
  "source": {
    "pdf": "10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf",
    "pdf_sha256": "47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40",
    "pdf_page": 114
  },
  "render": {
    "dpi": 300,
    "w": 1695,
    "h": 2580,
    "sha256": "2980fbc008cd2659ebe3d679425d8c06fa03a3ea31de4acf72e69f73362f730f"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "AUTHOR ONLY; physical 114, printed 108; original opened once at detail original. No finalization or independent review.",
    "INITIAL HISTORICAL STATE: leading predecessor physical 113 was not yet transcribed/reviewed and its owner identity/boundary were UNKNOWN when authoring began. This author has never opened physical 113.",
    "BOUNDED LINKAGE UPDATE: parent-transported independent source110-113 observation states physical 112 has heading 100 曲边梯形的面积 after 409-418, and example 1 starts there for the x^2 region on [1,2]. Its physical 113 tail ends 由此可以看出，当 Delta x 趋向零时，分式 Delta S(x)/Delta x 有等于 x^2 的极. This agrees with this author's actual physical 114 first word 限: 极|限.",
    "The first p cont is thus boundedly linked to unit 100 example 1, with its locally visible ending S(2)=7/3. External owner/boundary provenance is transported text, NOT direct-human pixel evidence and NOT this author's independent inspection or review of physical 112-113. No blanket verification of the complete external example is claimed.",
    "The inline S(1) equation crosses actual printed rows after its final equals sign. One ↵ encodes that newline; no adjacent literal newline duplicates it.",
    "No figure pixels on this page. References to figures 50, 48, 52 and 53 are retained. Parent-transported text assigns figures 49-51 to example 1; that is bounded external context only. Figures 52-53 are inspected on this author's own physical 115; figure 48 is unseen here.",
    "Theorem 1 statement is fully visible here; its proof continues onto physical 115 after 任意一个数 epsilon>0."
  ],
  "errata": [],
  "printed_lines": 23,
  "figures": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- p cont -->
限．因此，
$S'(x)=\lim_{\Delta x\to0}\frac{\Delta S(x)}{\Delta x}=x^2$．
所以，$S(x)$是函数$x^2$的原函数，并且由于原函数的基本性质
可以把它写成$\frac{x^3}{3}+C$．为了确定常数$C$，我们发现，$S(1)=0$，
这是因为当$x=1$时，图50中的图形变成垂直线段，它的面积
等于零．因此应当这样来选取常数$C$，使得$S(1)=\frac{1^3}{3}+C=↵0$，由此得出
$C=-\frac{1}{3}$．
于是，
$S(x)=\frac{x^3}{3}-\frac{1}{3}$．
而所求的面积是
$S(2)=\frac{2^3}{3}-\frac{1}{3}=\frac{7}{3}$．

<!-- p -->
上面进行的讨论，在一般情况下也成立．

<!-- p -->
定理1　设$f$是在闭区间$[a,b]$上非负的连续函数，而
$S$是对应曲边梯形的面积（参看图48）．如果$F$是$f$在包含
闭区间$[a,b]$的区间上的原函数，那么
$S=F(b)-F(a)$．　（1）

<!-- p open -->
我们来看这个曲边梯形位于$x$点左边的部分（图52）．这个图形
的面积是$x$的函数，用$S(x)$表示它．我们来证明
$S'(x)=f(x)$．　（2）
如果$\Delta x>0$，那么$\Delta S(x)=S(x+\Delta x)-S(x)$是图53中带斜线的
图形的面积．因为函数$f$在$x$点是连续的，那么对于任意一个数$\varepsilon>0$，

<!-- foot -->
• 108 •
