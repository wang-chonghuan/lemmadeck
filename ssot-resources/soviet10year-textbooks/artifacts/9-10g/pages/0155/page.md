---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9-10g",
  "page": 155,
  "numbering_scope": "g10",
  "printed_page": 148,
  "source": {
    "pdf": "9-10g 苏联十年制学校数学教材 几何 9-10年级.pdf",
    "pdf_sha256": "1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a",
    "pdf_page": 155
  },
  "render": {
    "dpi": 300,
    "w": 1506,
    "h": 2126,
    "sha256": "3cc05770b46010d9cc9e70eebe7785ae94922b1571b7b3fa41e65ee00db0bbb0"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0"
  },
  "notes": [
    "源像素实际为几何教材，标题为 §43. 根据向量的坐标计算向量的长和两个向量的夹角；不按任务中的物理称呼改写源内容。",
    "页首仅印出 2) 小问，上一页题号本页不可见。首次独审据154已获独审的题6 open文字边界确认承接关系，保留无label的 ex cont；不在155补印题号6。原作者unknown标记和首次FAIL保留在原稿。",
    "问题1、问题2及其解属于讲授正文，不作为练习题编号。",
    "图3和图4分别完整框取，caption 分离且同排；图内标签只保留在源像素。",
    "本页末尾公式有句点且完整；未读物理页157，不添加本页像素没有的续接事实。",
    "仅作者转写，没有独立审查；不登记 count_exclusions。"
  ],
  "errata": [],
  "printed_lines": 16,
  "figures": [
    {
      "id": "fig-g10-03",
      "label": "图 3",
      "box": [
        209,
        842,
        343,
        321
      ]
    },
    {
      "id": "fig-g10-04",
      "label": "图 4",
      "box": [
        799,
        840,
        347,
        331
      ]
    }
  ],
  "provenance": {
    "cap": "1",
    "normalized": true
  }
}
---

<!-- ex cont -->
2) $\vec c=\left(\frac{1}{2},\frac{3}{5},-\frac{5}{6}\right)$ 和 $\vec d=\left(-\frac{2}{3},\frac{5}{6},-\frac{1}{5}\right)$.

<!-- ex 7 -->
7. 下列向量垂直吗？1) $\vec a=(-2,1,3)$ 和 $\vec b=(6,-5,7)$；
2) $\vec c=(6,0,12)$ 和 $\vec d=(-8,13,4)$.

<!-- h3 -->
§43. 根据向量的坐标计算向量的长和两个向量的夹角

<!-- p -->
问题1. 求向量 $\vec a=(x,y,z)$（图3）的长.

<!-- p -->
解. 利用数性积的坐标公式（§42），得到：$\vec a\cdot\vec a=xx+yy↵+zz$，即 $\vec a^2=x^2+y^2+z^2$，因此，$|\vec a|=\sqrt{x^2+y^2+z^2}$.

<!-- fig 图 3 box 209,842,343,321 -->
![图 3](figures/fig-g10-03.png)

<!-- cap 图 3 -->
图3

<!-- fig 图 4 box 799,840,347,331 -->
![图 4](figures/fig-g10-04.png)

<!-- cap 图 4 samerow -->
图4

<!-- p -->
由此可见，向量的长度等于它的坐标的平方和的平方根.

<!-- p -->
问题2. 求两个非零向量 $\vec a=(x_1,y_1,z_1)$ 和 $\vec b=(x_2,y_2,z_2)$
的夹角 $\varphi$（图4）.

<!-- p -->
解. 从两个向量的数性积的定义得到，$\cos\varphi=\frac{\vec a\cdot\vec b}{|\vec a|\cdot|\vec b|}$.

<!-- p -->
但是 $\vec a\cdot\vec b=x_1x_2+y_1y_2+z_1z_2$（§42）；$|\vec a|=\sqrt{x_1^2+y_1^2+z_1^2}$，$|\vec b|↵=\sqrt{x_2^2+y_2^2+z_2^2}$（问题1）. 于是

<!-- p -->
$\cos\varphi=\frac{x_1x_2+y_1y_2+z_1z_2}{\sqrt{x_1^2+y_1^2+z_1^2}\cdot\sqrt{x_2^2+y_2^2+z_2^2}}$.

<!-- foot -->
· 148 ·
