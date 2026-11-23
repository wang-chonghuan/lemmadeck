---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10p",
  "page": 257,
  "printed_page": 247,
  "source": {
    "pdf": "10p 苏联中学课本 物理 十年级 .pdf",
    "pdf_sha256": "7190041b66182e5f6c5a4ef7ae0b04ee3f1afa0df1f5b3ff6317b2c2d1cb8f40",
    "pdf_page": 257
  },
  "render": {
    "dpi": 300,
    "w": 1536,
    "h": 2337,
    "sha256": "d85f6e0d38ae08a5681286dc48cf18622bf982f8cb1bbd2b5f96402c0dedb7ce"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "c364d68442cfccc9920d3e23932d418c3d7b123cf4a47408e6535dcb19f7104a"
  },
  "notes": [
    "SOURCE-FIRST：仅据物理页257原图、网格及三张细节裁图独立转写，未先读取候选或native回执。",
    "页首从“发现钟的滴答与滴答声之间的时间”开始，作为上页正文承接；冻结时前页接缝尚未检查，不补写缺失前文。",
    "图222为一个编号图，含а、б两个子图；图题与其左侧含速度矢量的正文第三行同排。",
    "可见本征时间及在运动着的系统中时间的滞留字重较重；未发现可确认的连续下点强调，不猜测Markdown加粗，source_emphasis为空。",
    "页尾正文仅一行，止于“证实”，没有句末标点；保留open，不推断或补写下页尾文。",
    "d1128 仅据 d1121 source-typography-detail.png 核定并纠正 SOURCE257-TYPO-1/2/3：p0257#8 第2行“本征时间”加粗，第3行同词保持正体；第5行末“在运动着的系统”与第6行首“中时间的滞留”连续加粗，后接句号及“参考系”保持正体；p0257#10 保留两侧正体圆点及粗斜体页码247。此说明纠正历史 notes 中将可见粗体与下点强调混同而保留 source_emphasis 为空的处理；以上历史 notes 原样保留，正文、数学、标点、印刷行、open/cont 和图框不变。FIRST 独立审查报告 SHA256 b1458d9be5386d873dc82b0f6f00fc7ab828d40e63f683a8a5480712e5ac9606；本次 native PASS 不构成 SOURCE 批准，独立 affected review 待后续另行进行。"
  ],
  "source_emphasis": [
    {
      "block": "p0257#8",
      "line": 2,
      "text": "本征时间",
      "style": "bold",
      "column_start": 11,
      "column_end": 14,
      "position": "inline"
    },
    {
      "block": "p0257#8",
      "line": 5,
      "text": "在运动着的系统",
      "style": "bold",
      "column_start": 24,
      "column_end": 30,
      "position": "line-end",
      "continued_by": "p0257#8:6:中时间的滞留"
    },
    {
      "block": "p0257#8",
      "line": 6,
      "text": "中时间的滞留",
      "style": "bold",
      "column_start": 1,
      "column_end": 6,
      "position": "line-start",
      "continues": "p0257#8:5:在运动着的系统"
    },
    {
      "block": "p0257#10",
      "line": 1,
      "text": "247",
      "style": "bold-italic",
      "column_start": 3,
      "column_end": 5,
      "position": "between-plain-dot-ornaments",
      "ornaments": {
        "left": "•",
        "right": "•",
        "style": "plain"
      }
    }
  ],
  "errata": [],
  "printed_lines": 24,
  "figures": [
    {
      "id": "fig-222",
      "label": "图 222",
      "box": [
        807,
        154,
        490,
        335
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
发现钟的滴答与滴答声之间的时间
间隔为
$\tau_0=\frac{2l}{c}$

<!-- p open -->
但是，从另一观察者的角度来
看(相对于这个观察者，钟是以速度
$\vec{v}$ 运动的)，时间间隔却是另一个数

<!-- fig 图 222 box 807,154,490,335 -->
![图 222](figures/fig-222.png)

<!-- cap 图 222 samerow -->
图 222

<!-- p cont -->
字。让我们设想，棒是垂直于速度 $\vec{v}$ 的。那时在运动着的镜中，光是沿
着折线传播的(图 222 б)，并在钟的两次滴答声之间的时间 $\tau$ 内通过的
路程为
$2\sqrt{l^2+\left(\frac{v\tau}{2}\right)^2}$

<!-- p -->
所以
$\tau=\frac{2\sqrt{l^2+\left(\frac{v\tau}{2}\right)^2}}{c}$

<!-- p -->
解出此方程的 $\tau$，且已知 $\frac{2l}{c}=\tau_0$，则我们可以得到(8.1)式。

<!-- p -->
当两个事件发生在一个系统的同一地点上时，用该系统
的钟测量的时间，叫做**本征时间**。此时间为最小，并且这个事
实具有绝对的意义。如果本征时间，举例说，等于 5 秒，则所
有运动着的观察者的钟按相对运动的速度关系就指示出更长
的时间间隔：6 秒，10 秒等等。这个效果称为**在运动着的系统
中时间的滞留**。参考系 $K$ 和 $K_1$ 等价就在于，如果两个事件发
生在系统 $K$ 的同一个点上，那么事件之间的时间间隔，对这个
系统的钟来说为最小。时间间隔不是一个绝对的量值，而是
与参考系有关的。

<!-- p open -->
时间的滞留现象是在观察寿命很短的基本粒子的衰变实验时证实

<!-- foot -->
• ***247*** •
