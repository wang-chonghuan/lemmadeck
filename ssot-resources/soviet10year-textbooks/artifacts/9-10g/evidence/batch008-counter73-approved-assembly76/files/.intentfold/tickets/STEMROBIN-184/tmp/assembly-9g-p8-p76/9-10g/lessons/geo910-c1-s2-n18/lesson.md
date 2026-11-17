# §18. 向量的加法

> 第二章　空间的变换·向量

我们首先研究一个定理，再根据它引入两个向量的和的概念.

定理9. 两个向量的合成是向量.

证明. 假设已知两个向量 $\vec a$ 和 $\vec b$. 证明它们的合成也是一个向量. 研究两个任意的不相同的点 $M$ 和 $N$. 有：$\vec a(M)=M_1$，$\vec a(N)=N_1$，$\vec b(M_1)=M_2$，$\vec b(N_1)=N_2$（图 71）.合成 $\vec b\cdot\vec a$ 将点 $M$ 和 $N$ 分别映射成 $M_2$ 和 $N_2$. 为了证明定理，只需断定 $\overrightarrow{MM_2}=\overrightarrow{NN_2}$ 就是够了. 向量是位移（§17，性质 1）. 因此 $|MN|=|M_1N_1|$，$|M_1N_1|=|M_2N_2|$. 因此，$|MN|=|M_2N_2|$（1）. 向量将每一条射线映射成和它同方向的射线（§17，性质 2），这时 $[MN)\uparrow\uparrow[M_1N_1)$，$[M_1N_1)\uparrow\uparrow[M_2N_2)$. 由此得出（§16）$[MN)\uparrow\uparrow[M_2N_2)$. （2）

![图 71](../../figures/fig-71.svg)

*图 71*

如果射线 $MN$ 和 $M_2N_2$ 不在一条直线上，那么由（2）和（1）推得 $MNN_2M_2$ 是平行四边形，于是 $\overrightarrow{MM_2}=\overrightarrow{NN_2}$. 如果$[MN)$ 和 $[M_2N_2)$ 在同一条直线上，这个等式同样成立. $\blacksquare$

向量 $\vec a$ 和 $\vec b$ 的合成通常叫做向量 $\vec a$ 与 $\vec b$ 的和. 这时，记法 $\vec b\cdot\vec a=\vec c$ 可以写成 $\vec a+\vec b=\vec c$.

研究任意的点 $A$，$B$，$C$（图 72，а）. 从关于两个向量的合成的定理推出等式：$\overrightarrow{AB}+\overrightarrow{BC}=\overrightarrow{AC}$ （3）

实际上，向量 $\overrightarrow{AB}$ 将 $A$ 映射成 $B$，向量 $\overrightarrow{BC}$ 将 $B$ 映射成$C$. 这时，这两个向量的合成是将 $A$ 映射成 $C$ 的向量（定理 9）. 因而 $\overrightarrow{AB}+\overrightarrow{BC}=\overrightarrow{AC}$.

![图 72](../../figures/fig-72.svg)

*图 72*

等式（3）叫做**三角形法则**. 当点 $A$，$B$，$C$ 属于同一条直线（图 72，б，в），而且已知点中的两个或者甚至三个点可能重合时，这个法则仍适用.

向量 $\vec a$ 与 $\vec b$ 的和 $\vec c$ 可以根据三角形法则求得（图 73）. 选取任意一点 $A$，由点 $A$ 作向量 $\overrightarrow{AB}=\vec a$，由 $B$ 作向量 $\overrightarrow{BC}=\vec b$. 向量 $\overrightarrow{AC}$ 是所求的和 $\vec c$. 实际上，$\vec a+\vec b=\overrightarrow{AB}+\overrightarrow{BC}=\overrightarrow{AC}=\vec c$.

![图 73](../../figures/fig-73.svg)

*图 73*

向量的加法具有以下的性质：

1. $\vec a+\vec 0=\vec a$（零向量的吸收律）.

2. $\vec a+\vec b=\vec b+\vec a$（交换律）.

3. $(\vec a+\vec b)+\vec c=\vec a+(\vec b+\vec c)$（结合律）.

这些性质的证明，与平面几何中的证明相同.

下面我们引出三个或者三个以上向量的和的概念. 根据向量加法的结合律 $(\vec a+\vec b)+\vec c$ 与 $\vec a+(\vec b+\vec c)$ 相等. 这两个和中的任何一个都叫做三个向量 $\vec a$，$\vec b$，$\vec c$ 的和，而且不必写括号：$\vec a+\vec b+\vec c$. 四个（或更多）向量的和可以类似地定义：$\vec a+\vec b+\vec c+\vec d=(\vec a+\vec b+\vec c)+\vec d$.

根据向量加法的交换律与结合律，可以将相加的向量随意排列和分组，而这些向量的和不变.

三个或更多向量的和可以运用**多边形法则**求出. 假如要求向量和 $\vec s=\vec a_1+\vec a_2+\vec a_3+\vec a_4$，取任意一点 $A$（图 74）. 依次作向量 $\overrightarrow{AA_1}=\vec a_1$，$\overrightarrow{A_1A_2}=\vec a_2$，$\overrightarrow{A_2A_3}=\vec a_3$，$\overrightarrow{A_3A_4}=\vec a_4$. 向量 $\overrightarrow{AA_4}$ 等于所求的和 $\vec s$. 学生可以依次地使用三角形法则，证明这个结果是正确的.

![图 74](../../figures/fig-74.svg)

*图 74*
