---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "10p",
  "page": 65,
  "printed_page": 55,
  "source": {
    "pdf": "10p 苏联中学课本 物理 十年级 .pdf",
    "pdf_sha256": "7190041b66182e5f6c5a4ef7ae0b04ee3f1afa0df1f5b3ff6317b2c2d1cb8f40",
    "pdf_page": 65
  },
  "render": {
    "dpi": 300,
    "w": 1536,
    "h": 2337,
    "sha256": "235a22cab125ce6efaa58ada5f4b3ca6086f9e08d5f411563be4e062b6fd2bfe"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "c364d68442cfccc9920d3e23932d418c3d7b123cf4a47408e6535dcb19f7104a"
  },
  "notes": [
    "AUTHOR CANDIDATE ONLY; no native finalize, counter, vectorize or independent SOURCE review has run for this draft.",
    "物理65/印刷55，全部内容归N24。首p cont承接SOURCE64候选p0064#11的在接通；SOURCE64独立SOURCE审查仍待定。",
    "图37、38各为一张原书图；图37由上页N24正文引用，图38由本页N24正文引用。图题同排，cap图38标samerow。",
    "目视19条文字印刷行：图题横排1、正文/独立公式17、页脚1；两图内部字形不另计文字行。块体20行减同排1。",
    "页末p open止于（图，归N24，待SOURCE66的39）接续；本页无题、无分题、无新单元标题、无脚注或表格。",
    "振幅下标保留观察到的м形，草稿采用西里尔м U+043C；该印刷字体与拉丁斜体M的脚本身份不能仅凭像素确定，记录SOURCE alphabet HOLD，不宣称批准。",
    "仅实际加粗的电流强度的振荡比电容器上电压的振荡超前用强调标记；因此、分式π/2及（图不加粗。图框为待native吸附的粗框，不是已通过裁图。"
  ],
  "errata": [],
  "provenance": {
    "cap": "1",
    "normalized": true
  },
  "printed_lines": 19,
  "figures": [
    {
      "id": "fig-37",
      "label": "图 37",
      "box": [
        221,
        141,
        566,
        302
      ]
    },
    {
      "id": "fig-38",
      "label": "图 38",
      "box": [
        895,
        140,
        411,
        287
      ]
    }
  ]
}
---

<!-- fig 图 37 box 221,141,566,302 -->
![图 37](figures/fig-37.png)

<!-- fig 图 38 box 895,140,411,287 -->
![图 38](figures/fig-38.png)

<!-- cap 图 37 -->
图 37

<!-- cap 图 38 samerow -->
图 38

<!-- p cont -->
交流电压时灯泡就亮了.

<!-- p -->
如果电路实际上是断路（在电容器极板之间电荷不可能
通过），交流电流怎么能够在电路中通过呢？这里实际上是在
交流电压作用下，电容器周期性地充电和放电. 电容器反复
充电时，电路里的电流使电灯灯丝变热了.

<!-- p -->
如果导线和电容器极板的电阻可以忽略不计，我们来求
出只有电容器的电路中电流强度是如何随时间变化的
（图 38）.

<!-- p -->
电容器上的电压

<!-- p -->
$u=U_1-U_2=\frac{q}{C}$

<!-- p -->
等于电路两端的电压（其中 $q$ 为上极板的电量）. 因此，

<!-- p -->
$\frac{q}{C}=U_{м}\cos\omega t$ （2.23）

<!-- p -->
电容器的电量按简谐规律变化：

<!-- p -->
$q=CU_{м}\cos\omega t$ （2.24）

<!-- p -->
作为电量对时间的导数的电流强度等于：

<!-- p -->
$i=q'=-U_{м}C\omega\sin\omega t=U_{м}C\omega\cos\left(\omega t+\frac{\pi}{2}\right)$ （2.25）

<!-- p open -->
因此，**电流强度的振荡比电容器上电压的振荡超前** $\frac{\pi}{2}$（图

<!-- foot -->
· 55 ·
