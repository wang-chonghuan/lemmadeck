# §21. 共面的向量

> 第二章　空间的变换·向量

求两个不共线的向量的和, 有时候利用在平面几何中学过的平行四边形法则较为方便. 我们来复习这个法则.

假如要求出不共线的向量$\vec{a}$和$\vec{b}$的和. 从任意点$O$作向量$\overrightarrow{OA}=\vec{a}$和$\overrightarrow{OB}=\vec{b}$(图80), 作平行四边形$AOBC$, 其中$[OC]$是平行四边形的对角线, 向量$\overrightarrow{OC}$是所求的和. 实际上, 根据三角形法则有$\overrightarrow{OA}+\overrightarrow{OB}=\overrightarrow{OA}+\overrightarrow{AC}=\overrightarrow{OC}$.

![图 80](../../figures/fig-80.svg)

*图 80*

**定义. 三个非零向量, 如果给出它们的方向的射线所在的直线平行于某个平面(图81), 这三个向量叫做共面向量.**

![图 81](../../figures/fig-81.svg)

*图 81*

![图 82](../../figures/fig-82.svg)

*图 82*

当向量$\overrightarrow{OA}$, $\overrightarrow{OB}$, $\overrightarrow{OC}$共面时, 点$O$, $A$, $B$, $C$属于同一个平面(图82).

**定理11. 如果向量$\vec{a}$和$\vec{b}$不共线, 那么与向量$\vec{a}$和$\vec{b}$共面的任意一个向量$\vec{c}$可以写成唯一的形式:**

$\vec{c}=x\vec{a}+y\vec{b}$.

证明. 设向量$\vec{a}$, $\vec{b}$, $\vec{c}$共面, 并且$\vec{a}$和$\vec{b}$不共线, 求满足等式$\vec{c}=x\vec{a}+y\vec{b}$. 由点$O$作向量$\overrightarrow{OA}=\vec{a}$, $\overrightarrow{OB}=\vec{b}$, $\overrightarrow{OC}=\vec{c}$, 从定理的条件得出点$O$, $A$, $B$, $C$属于某一个平面$\alpha$. 我们研究$C\notin(OA)$和$C\notin(OB)$的情形(图83)在平面$\alpha$内, 过点$C$作直线平行于直线$OA$和$OB$, 得到平行四边形$MONC$. 根据平行四边形法则，可以写成：$\overrightarrow{OC}=\overrightarrow{OM}+\overrightarrow{ON}$. 但是，$\overrightarrow{OM}=x\overrightarrow{OA}$和$\overrightarrow{ON}=y\overrightarrow{OB}$（§20），所以$\overrightarrow{OC}=x\overrightarrow{OA}+y\overrightarrow{OB}$，或者$\vec{c}=x\vec{a}+y\vec{b}$.

![图 83](../../figures/fig-83.svg)

*图 83*

同样，如果$C\in(OA)$或者$C\in(OB)$，那么在最后的等式中分别有$y=0$或者$x=0$.

可以证明，数$x$和$y$是唯一确定的. 也就是说，如果$\vec{c}=x\vec{a}+y\vec{b}$. 和$\vec{c}=x_1\vec{a}+y_1\vec{b}$，那么$x=x_1$，$y=y_1$. $\blacksquare$

如果已知不共线的向量$\vec{a}$和$\vec{b}$，那么同$\vec{a}$和$\vec{b}$共面的向量$\vec{c}$的表达式（写成$x\vec{a}+y\vec{b}$的形式），称为向量$\vec{c}$关于向量$\vec{a}$和$\vec{b}$的**分解式**.
