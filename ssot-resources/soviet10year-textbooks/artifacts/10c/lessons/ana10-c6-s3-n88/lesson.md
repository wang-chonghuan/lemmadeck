# 88*. 余切函数的性质和图象。反余切函数和方程$\operatorname{ctg}x=a$的解

因为余切函数的最小正周期等于$\pi$，所以为了研究函数$y=\operatorname{ctg}x$的性质，只要在长度为$\pi$的任一区间上讨论它就行了。我们取区间$]0,\pi[$。区间的端点应当去掉，因为在这两点，余切函数没有定义。为了研究图象，我们来求导函数：

$\operatorname{ctg}'x=-\frac{1}{\sin^2x}$。

当自变量取所有的值时（除去$x=\pi n,\ n\in\mathbf{Z}$，对于这些$x$值，余切函数和它的导函数都没有定义），式$-\frac{1}{\sin^2x}$是负的。就是说，在整个区间$]0,\pi[$上，余切函数下降。考虑到上面进行的讨论和$\operatorname{ctg}\frac{\pi}{2}=0$，我们作出图象（图38）。

![图 38](../../figures/fig-38.svg)

*图38*

由于余切函数的周期等于 $\pi$，当平移 $\vec r(\pi,0)$ 时，它的图象变成它自身。于是，在区间 $]\pi n,\pi(n+1)[$ 上，余切函数的图象可以由画在图38中的图象平移 $\vec r(\pi n,0)$（$n\in Z$）得出（图39）。

![图 39](../../figures/fig-39.svg)

*图 39*

在区间 $]0,\pi[$ 上，余切下降并且取数轴 $R$ 上所有的值，也就是对于值域来说，得到：$E(\operatorname{ctg})=]-\infty,\infty[$。因此，在区间 $]0,\pi[$ 上，余切函数有反函数。在区间 $]0,\pi[$ 上余切的反函数叫做反余切，记作 $\operatorname{arcctg}$。函数 $y=\operatorname{arcctg}x$ 的图象表示在图40中。这个图象和函数 $y=\operatorname{ctg}x$ 的图象关于直线 $y=x$是对称的。由反函数的定义得出，$D(\operatorname{arcctg})=]-\infty,\infty[$，$E(\operatorname{arcctg})=]0,\pi[$，而且反余切函数是减函数。

![图 40](../../figures/fig-40.svg)

*图 40*

我们来计算几个反余切函数的值：

$\operatorname{arcctg}\sqrt{3}=\frac{\pi}{6}$，因为 $\operatorname{ctg}\frac{\pi}{6}=\sqrt{3}$，而且 $\frac{\pi}{6}\in]0,\pi[$；$\operatorname{arcctg}\frac{\sqrt{3}}{3}=\frac{\pi}{3}$，因为 $\operatorname{ctg}\frac{\pi}{3}=\frac{\sqrt{3}}{3}$，而且 $\frac{\pi}{3}\in]0,\pi[$；$\operatorname{arcctg}(-1)=\frac{3\pi}{4}$，因为 $\operatorname{ctg}\frac{3\pi}{4}=-1$，而且 $\frac{3\pi}{4}\in]0,\pi[$。

$\operatorname{arcctg}$ 函数值可利用用度表示的角度的余切表和把角度的度数换算成弧度的表求出。

为了求出带有四位小数的 $\operatorname{arcctg}x$，在 $0^\circ<\alpha^\circ<180^\circ$ 范围内求出角度 $\alpha^\circ$，使得$\operatorname{ctg}\alpha^\circ=x$；把 $\alpha^\circ$ 表示成弧度：$\alpha^\circ=y$ 弧度。得到$\operatorname{ctg}y=x$，$\operatorname{arcctg}x=y$。

例1 求 $\operatorname{arcctg}3.078$。$3.078\approx\operatorname{ctg}18^\circ$，$18^\circ\approx0.3142$ 弧度，$\operatorname{arcctg}3.078\approx0.3142$。

现在说明怎样借助引入的反余切函数解方程$\operatorname{ctg}x=a$。 （1）

为了求出方程（1）所有的解，只要在长度为 $\pi$ 的任一闭区间上（因为余切的周期是 $\pi$）求出这个方程所有的解就行了。由图41可以看出，取区间 $]0,\pi[$ 比较方便。根据反余切的定义，在区间 $]0,\pi[$ 上，方程（1）的解是$\operatorname{arcctg}a$。现在，为了写出方程（1）所有的解，必须利用余切函数的周期性，就是把 $\operatorname{arcctg}a$ 加上 $\pi n(n\in Z)$ 这种形式的数，得到解：$x=\operatorname{arcctg}a+\pi n(n\in Z)$。 （2）

![图 41](../../figures/fig-41.svg)

*图 41*

例2 解方程$\operatorname{ctg}x=1$。

根据（2）式得到：$x=\operatorname{arcctg}1+\pi k$，$x=\frac{\pi}{4}+\pi k$，$k\in Z$。

例3 解方程$\operatorname{ctg}x=\sqrt{3}$。

根据（2）式得到：$x=\operatorname{arcctg}\sqrt{3}+\pi k$，$x=\frac{\pi}{6}+\pi k$，$k\in Z$。

现在列出余切的基本性质。

1. 函数的定义域是去掉 $\pi n$（其中 $n\in Z$）这种形式的数以外所有实数集合。

2. 余切函数值的集合是整个数轴：$E(\operatorname{ctg})=R$。因此，余切是无界函数。

3. 余切是奇函数：对于所有的 $x\in D(\operatorname{ctg})$，$\operatorname{ctg}(-x)=$ $-\operatorname{ctg}x$。

4. 余切是具有最小正周期 $\pi$ 的周期函数：对于所有的$x\in(\operatorname{ctg})$，$\operatorname{ctg}(x+\pi)=\operatorname{ctg}x$。

5. 对于所有的 $x=\frac{\pi}{2}+\pi n(n\in Z)$，$\operatorname{ctg}x=0$。

6. 对于所有的 $x\in]\pi n,\frac{\pi}{2}+\pi n[(n\in Z)$，$\operatorname{ctg}x>0$。

7. 对于所有的 $x\in]-\frac{\pi}{2}+\pi n,\pi n[(n\in Z)$，$\operatorname{ctg}x<0$。

8. 对于所有的 $x\in D(\operatorname{ctg})$，函数 $\operatorname{ctg}$ 连续并且可微。

9. 在任何一个区间 $]n\pi,\pi+n\pi[(n\in Z)$ 上，函数 $\operatorname{ctg}$下降。
