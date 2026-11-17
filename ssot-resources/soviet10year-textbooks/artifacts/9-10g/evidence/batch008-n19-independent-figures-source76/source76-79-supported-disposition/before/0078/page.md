---
{
  "schema": "ld-s10y-lesson/page@3",
  "book": "9-10g",
  "page": 78,
  "printed_page": 71,
  "source": {
    "pdf": "9-10g 苏联十年制学校数学教材 几何 9-10年级.pdf",
    "pdf_sha256": "1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a",
    "pdf_page": 78
  },
  "render": {
    "dpi": 300,
    "w": 1506,
    "h": 2126,
    "sha256": "783765059f784fa0ca4ef272ffe48db5ba063da5b04fee86e88b2ecc474422b7"
  },
  "profile": {
    "id": "soviet-cn",
    "sha256": "dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849"
  },
  "notes": [
    "物理78页脚71，physical=printed+7。图85、86及各自图题在页首并排；两图题同一印刷行，第二cap标samerow。图和图题透明，后续p cont承接物理77问题2字面尾“O是”。",
    "图85源图清单：四个实心点O、A、M、B；O在左下，A在左上，上方斜线点序A-M-B。实线OA、OB、OM和AB；可辨箭头O→A、O→M、O→B、A→M、M→B共五处，B附近两条不同方向箭头分别来自O和M，M附近两条来自O和A。无虚线、刻痕、角弧、长度或数值。图题“图85”。",
    "图86源图清单：六个实心点B、C、A、C_1、M、O；B左上、C右上、A在B与C下方且O上方、O右下。三角形ABC实线边；BA上的点序B-C_1-A，CC_1上的点序C-M-C_1。O分别与A、B、C、C_1、M有实线相连。O→A、O→C_1、O→M、O→C各一处可辨箭头，CC_1在C_1近处有朝C_1的箭头。B附近OB、AB交汇墨迹中有朝B的箭头；此处独立箭头数及是否另有沿AB指向B的箭头仍不确定，未按数学意义补齐。无可辨虚线、等长刻痕、角弧或数值。图题“图86”。",
    "问题2解中首个中线公式原印为向量MC_1等于1/3乘无箭头的CC_1，忠实保留该箭头差异，不作勘误或补箭头。"
  ],
  "errata": []
}
---

<!-- fig 图 85 box 245,208,435,352 -->

<!-- cap 图 85 -->
图　85

<!-- fig 图 86 box 733,263,493,286 -->

<!-- cap 图 86 samerow -->
图　86

<!-- p cont -->
空间任意一点，那么下列等式成立：
$\overrightarrow{OM}=\frac{1}{3}(\overrightarrow{OA}+\overrightarrow{OB}+\overrightarrow{OC})$.

<!-- p -->
**解.** 设$[CC_1]$是三角形$ABC$的中线（图86）. 根据三角
形中线的性质，$\overrightarrow{MC_1}=\frac{1}{3}CC_1$. 对向量$\overrightarrow{MC_1}$和$\overrightarrow{CC_1}$运用向量
的减法公式（§19），得到$\overrightarrow{OC_1}-\overrightarrow{OM}=\frac{1}{3}(\overrightarrow{OC_1}-\overrightarrow{OC})$. 因此，
$\overrightarrow{OM}=\frac{1}{3}\overrightarrow{OC}+\frac{2}{3}\overrightarrow{OC_1}$. 但是$\overrightarrow{OC_1}=\frac{1}{2}(\overrightarrow{OA}+\overrightarrow{OB})$（问题1），
所以
$\overrightarrow{OM}=\frac{1}{3}\overrightarrow{OC}+\frac{2}{3}\cdot\frac{1}{2}(\overrightarrow{OB}+\overrightarrow{OA})=\frac{1}{3}(\overrightarrow{OA}+\overrightarrow{OB}+\overrightarrow{OC})$. $\blacksquare$

<!-- exhead -->
习　题

<!-- ex 206 -->
206. 点$M_1$和$M_2$分别是线段$A_1B_1$和$A_2B_2$的中点.
证明：
$\overrightarrow{M_1M_2}=\frac{1}{2}(\overrightarrow{A_1A_2}+\overrightarrow{B_1B_2})$.

<!-- ex 207 -->
207. 证明：梯形两底的中点和它的两腰的延长线的交
点属于同一条直线.

<!-- foot -->
71
