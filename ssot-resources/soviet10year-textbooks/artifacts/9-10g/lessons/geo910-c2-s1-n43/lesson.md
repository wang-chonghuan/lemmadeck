# §43. 根据向量的坐标计算向量的长和两个向量的夹角

> 十 年 级 · 第四章 空间坐标方法

问题1. 求向量 $\vec a=(x,y,z)$（图3）的长.

解. 利用数性积的坐标公式（§42），得到：$\vec a\cdot\vec a=xx+yy+zz$，即 $\vec a^2=x^2+y^2+z^2$，因此，$|\vec a|=\sqrt{x^2+y^2+z^2}$.

![图 3](../../figures/fig-g10-03.svg)

*图3*

![图 4](../../figures/fig-g10-04.svg)

*图4*

由此可见，向量的长度等于它的坐标的平方和的平方根.

问题2. 求两个非零向量 $\vec a=(x_1,y_1,z_1)$ 和 $\vec b=(x_2,y_2,z_2)$的夹角 $\varphi$（图4）.

解. 从两个向量的数性积的定义得到，$\cos\varphi=\frac{\vec a\cdot\vec b}{|\vec a|\cdot|\vec b|}$.

但是 $\vec a\cdot\vec b=x_1x_2+y_1y_2+z_1z_2$（§42）；$|\vec a|=\sqrt{x_1^2+y_1^2+z_1^2}$，$|\vec b|=\sqrt{x_2^2+y_2^2+z_2^2}$（问题1）. 于是

$\cos\varphi=\frac{x_1x_2+y_1y_2+z_1z_2}{\sqrt{x_1^2+y_1^2+z_1^2}\cdot\sqrt{x_2^2+y_2^2+z_2^2}}$.
