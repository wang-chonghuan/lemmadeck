---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10p",
  "page": 50,
  "printed_page": 40,
  "source": {
    "pdf": "10p 苏联中学课本 物理 十年级 .pdf",
    "pdf_sha256": "7190041b66182e5f6c5a4ef7ae0b04ee3f1afa0df1f5b3ff6317b2c2d1cb8f40",
    "pdf_page": 50
  },
  "render": {
    "dpi": 300,
    "w": 1536,
    "h": 2337,
    "sha256": "72dd4ba14a9a5e6a8150af1ef043bd09060c77bab82bd6eec0410c054dfc6eea"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "54c02ea7d234571bd2d87c14289640701d1aa7ada4c3aed67403cec26680cddc"
  },
  "notes": [
    "源作者逐印刷视觉行转写，图26、27、28仅标粗网格框；未收口、未重画、未作独立或科学审批。",
    "首段 cont 接0049末段的在，至针在平衡位置附近摆动句结束，随后小节18标题；目录确认小节18始于印刷40页。",
    "图26图题与首段末行共排；图27图题与我们来观察段第一行共排，故该段在图题前后拆为 open/cont。图28为完整一图，а部分含两幅开关电路，б部分为弹簧振子，不拆独立图。",
    "图28а的а按原书分图序列写西里尔小写；电量公式采用正常数学 q_m、C，m形与C形同形字的实际字母编码不可由扫描判定。",
    "式(2.1)为一个完整印刷公式行，分子分母不算额外行，未添加↵。公式后图28及页码透明，open 接0051不缩进的这里说明行。"
  ],
  "errata": [],
  "figure_crops": {
    "fig-28": {
      "padding_px": 0,
      "reason": "The separate main caption begins beside the lowest spring displacement tip. Remove extra padding without shortening the snapped instructional diagram.",
      "exclude_text_regions": [
        {
          "block": 11,
          "line": 1,
          "text": "图 28",
          "box": [
            670,
            1981,
            140,
            3
          ],
          "reason": "The top pixels of the separately retained main caption enter the bottom edge at a different horizontal position from the spring tip. Whiten only this caption fragment in the crop, retaining both circuits, subdivision labels and the full spring displacement stroke."
        }
      ]
    }
  },
  "printed_lines": 21,
  "figures": [
    {
      "id": "fig-26",
      "label": "图 26",
      "box": [
        974,
        279,
        265,
        493
      ]
    },
    {
      "id": "fig-27",
      "label": "图 27",
      "box": [
        1019,
        1061,
        264,
        229
      ]
    },
    {
      "id": "fig-28",
      "label": "图 28",
      "box": [
        207,
        1724,
        1043,
        260
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
匀强磁场里转动就能产生交变电动势
（图26）. 这时，穿过线圈框架的磁通
量周期性地变化. 根据电磁感应定律，
感生电动势也周期性地变化. 在这种
情况下，感生电动势是这样产生的：磁
场对随线圈框一起运动的电子有力的
作用，它使电子沿导线移动. 在电路闭
合时，交变电流通过电流计并且使指
针在平衡位置附近摆动.

<!-- fig 图 26 box 974,279,265,493 -->
![图 26](figures/fig-26.png)

<!-- cap 图 26 samerow -->
图 26

<!-- h3 -->
18. 振荡回路

<!-- p -->
**最简单**的能产生自由电振荡的系统是
由一个电容器和一个与电容器的极板连接
的线圈构成的（图27）. 这样的系统叫做**振**
**荡回路**.

<!-- fig 图 27 box 1019,1061,264,229 -->
![图 27](figures/fig-27.png)

<!-- p open -->
**我们来观察为什么**在回路里产生振

<!-- cap 图 27 samerow -->
图 27

<!-- p cont open -->
荡？ 当电容器未充电时，系统一直处于平衡状态，在系统中不
发生任何过程. 用开关使电容器与电池组接通一段时间来给
电容器充电（图28а），这时电容器获得能量
$E=\frac{q_m^2}{2C}$　（2.1）

<!-- fig 图 28 box 207,1724,1043,260 -->
![图 28](figures/fig-28.png)

<!-- cap 图 28 -->
图 28

<!-- foot -->
· 40 ·
