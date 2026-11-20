---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9-10g",
  "page": 160,
  "printed_page": 153,
  "numbering_scope": "g10",
  "source": {
    "pdf": "9-10g 苏联十年制学校数学教材 几何 9-10年级.pdf",
    "pdf_sha256": "1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a",
    "pdf_page": 160
  },
  "render": {
    "dpi": 300,
    "w": 1506,
    "h": 2126,
    "sha256": "eaff995642c1934b88d92badde7003a32adad627cc897b443be8b5c2e1df8a9f"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "19d56195a3a63cf4be93a7a159e1513d37b9b17d1b92235d8ae3d4e826cc45d0"
  },
  "notes": [
    "作者源稿，未独审、未批准；仅 physical 160，numbering_scope 沿用已建立的 g10。",
    "页首 p cont 只依据本页首行及调用方提供的 p159 尾部文字；未打开 p159 像素。",
    "跨印刷行的数学表达式在相邻原始行之间保持同一对数学定界符；每一原始文本行对应一实际印刷行。",
    "HOLD p0160-lower-ink：约 x1010–1040、y1720–1745 的孤立残墨无法确认字形或归属；原像素保留，未并入正文、未作 count_exclusions，也未猜作下一行公式。",
    "页尾“我们研究任意的一次方程:”为开放正文，续页实际内容须由 p161 像素确定。",
    "星号脚注逐行照抄；脚注上方分隔横线仅为版式，不转写为文字。"
  ],
  "errata": [],
  "printed_lines": 25,
  "figures": [
    {
      "id": "fig-g10-10",
      "label": "图 10",
      "box": [
        845,
        401,
        422,
        395
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
在坐标空间里,这个数组对应一个点 $M(x,y,z)$.

<!-- p -->
以方程 $P(x,y,z)=0$ 的解为坐标的所有空间的点的集
合,是某个图形 $\Phi$. 就说这个方程给定图形 $\Phi$,或是说这个方
程是图形 $\Phi$ 的方程.

<!-- p -->
1. 问题. 求过点 $M_1(x_1,y_1,
z_1)$ 且与非零向量 $\vec{n}=(a,b,c)$ 垂
直的平面 $\alpha$ 的方程*.

<!-- p open -->
解. 对于平面 $\alpha$ 内的任意点
$M(x,y,z)$ $(M\ne M_1)$,向量 $\overrightarrow{M_1M}$
垂直于向量 $\vec{n}$ (图 10). 因此

<!-- fig 图 10 box 845,401,422,395 -->
![图 10](figures/fig-g10-10.png)

<!-- cap 图 10 samerow -->
图 10

<!-- p cont -->
$\vec{n}\cdot\overrightarrow{M_1M}=0$　(1)

<!-- p -->
这个等式当 $M=M_1$ 时也成立. 考虑到 $\overrightarrow{M_1M}=(x-x_1,
y-y_1,z-z_1)$ (§44,问题 2)和 $\vec{n}=(a,b,c)$,从等式(1)得到
(§42):
$a(x-x_1)+b(y-y_1)+c(z-z_1)=0$.　(2)

<!-- p -->
任何不属于平面 $\alpha$ 的点 $N$ 的坐标,因为 $\vec{n}\cdot\overrightarrow{M_1N}\ne0$,不满
足方程(2).

<!-- p -->
这样,每一个平面可以用三个变量的线性方程给定,变量
的系数中至少有一个不等于零*.

<!-- p -->
2. 现在我们来证明,所有含有三个变量的一次方程在坐
标空间里给定一个平面.

<!-- p open -->
我们研究任意的一次方程:

<!-- foot note -->
* 如果直线 $AA_1$ 垂直于平面 $\alpha$,称向量 $\overrightarrow{AA_1}$ 垂直于这个平面.

<!-- foot note -->
* 这样的方程以后称为一次方程.

<!-- foot -->
• 153 •
