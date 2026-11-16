# 85. 正弦函数的性质和图象. 反正弦函数和方程 $\sin x=a$ 的解

> 第六章 三角函数及其图象和导数（续） · §17. 三角函数的研究

我们来讨论在闭区间 $[-\pi,\pi]$ 上函数 $y=\sin x$ 的图象（图24）. 按照一般的讨论步骤，求出导函数：

$\sin'x=\cos x$.

求驻点. 因为在闭区间 $[-\pi,\pi]$ 上，仅当 $x=-\frac{\pi}{2}$ 和 $x$ $=\frac{\pi}{2}$时，$\cos x=0$，所以这两点就是驻点. 函数的上升和下降表示在下面的表里.

![表](../../figures/tbl-p0043-01.svg)

因为正弦函数具有周期$2\pi$，在平移$\vec{T}(2\pi,0)$的情况下，它的图象变成它自身. 于是，在$[-\pi+2\pi n,\pi+2\pi n]$里，$\sin$函数的图象可以由图24画出的图象通过平移$\vec{T}(2\pi n,0)$，$n\in Z$得出（图25）.

![图 24](../../figures/fig-24.svg)

*图 24*

![图 25](../../figures/fig-25.svg)

*图 25*

正弦函数在闭区间$\left[-\frac{\pi}{2},\frac{\pi}{2}\right]$上是上升的，而且由于连续性，它取闭区间$[-1,1]$里所有的值. 因此函数$y=\sin x$在闭区间$\left[-\frac{\pi}{2},\frac{\pi}{2}\right]$上是可逆函数，就是说，它有反函数，叫做反正弦，记作$\arcsin$. 函数$y=\arcsin x$的图象表示在图26中.这个图象和函数$y=\sin x\left(x\in\left[-\frac{\pi}{2},\frac{\pi}{2}\right]\right)$的图象关于直线$y=x$是对称的. 由反函数的定义得出，$D(\arcsin)=[-1,1]$，$E(\arcsin)=\left[-\frac{\pi}{2},\frac{\pi}{2}\right]$，于是，反正弦是奇函数并且是增函数.

我们来计算几个反正弦的值.

$\arcsin\frac{\sqrt{2}}{2}=\frac{\pi}{4}$，因为　　$\sin\frac{\pi}{4}=\frac{\sqrt{2}}{2}$，而且　　$\frac{\pi}{4}\in\left[-\frac{\pi}{2},\frac{\pi}{2}\right]$；

![图 26](../../figures/fig-26.svg)

*图 26*

$\arcsin\left(-\frac{1}{2}\right)=-\frac{\pi}{6}$，因为$\sin\left(-\frac{\pi}{6}\right)=\frac{1}{2}$，而且　　$-\frac{\pi}{6}\in\left[-\frac{\pi}{2},\frac{\pi}{2}\right]$；

$\arcsin1=\frac{\pi}{2}$，因为$\sin\frac{\pi}{2}=1$，而且　　$\frac{\pi}{2}\in\left[-\frac{\pi}{2},\frac{\pi}{2}\right]$；

$\arcsin(-1)=-\frac{\pi}{2}$，因为$\sin\left(-\frac{\pi}{2}\right)=-1$，而且　　$-\frac{\pi}{2}\in\left[-\frac{\pi}{2},\frac{\pi}{2}\right]$.

求带有两位小数的$\arcsin$函数值，利用数值自变量的$\sin$函数表最简单. 为了计算带有四位小数的$\arcsin$函数值，要利用两个表：用度表示的角度的正弦表和把角度的度数换算成弧度的表. 这时利用了这样一个事实：即数$y$的正弦等于$y$弧度角的正弦.

为了求出$\arcsin x$，在$-90^\circ\leqslant\alpha^\circ\leqslant90^\circ$范围内求出角度$\alpha^\circ$，使得

$\sin\alpha^\circ=x$；

把$\alpha^\circ$表示成弧度：　　$\alpha^\circ=y$弧度，得到

$\sin y=x$，$\arcsin x=y$.

例 1 求$\arcsin0.9063$.

$0.9063\approx\sin65^\circ$，$65^\circ\approx1.1345$弧度，$\arcsin0.9063\approx1.1345$.

现在说明怎样借助引入的反正弦函数解

$\sin x=a$　　　　　　　　　(1)

这种形式的最简单的方程.

因为$-1\leqslant\sin x\leqslant1$，那么当$a>1$和$a<-1$时，方程(1)无解（图27）.

当$a=1$时，方程(1)具有$\sin x=1$的形式，得到解

$x=\frac{\pi}{2}+2k\pi$，$k\in Z$.

![图 27](../../figures/fig-27.svg)

*图 27*

![图 28](../../figures/fig-28.svg)

*图 28*

当$a=-1$时，

$x=-\frac{\pi}{2}+2k\pi$，$k\in Z$.

为了求出当$|a|<1$时方程(1)所有的解，只要在长度为$2\pi$的任一区间上，求出这个方程所有的解就行了，因为正弦的周期等于$2\pi$. 由图28可以看出，取闭区间$\left[-\frac{\pi}{2},\frac{3}{2}\pi\right]$比较方便. 实际上，在闭区间$\left[-\frac{\pi}{2},\frac{\pi}{2}\right]$上，正弦是上升的，并且取它的每一个值一次. 而在闭区间$\left[\frac{\pi}{2},\frac{3}{2}\pi\right]$上，正弦是下降的，并且也取它的每一个值一次. 于是，在这两个闭区间的每一闭区间上，方程(1)有一个解. 根据反正弦的定义，在闭区间$\left[-\frac{\pi}{2},\frac{\pi}{2}\right]$上方程(1)的解是$\arcsin a$.

为了求出在闭区间$\left[\frac{\pi}{2},\frac{3}{2}\pi\right]$上方程(1)的解，利用公式$\sin x=\sin(\pi-x)$.如果$x\in\left[\frac{\pi}{2},\frac{3}{2}\pi\right]$，那么$\pi-x\in\left[-\frac{\pi}{2},\frac{\pi}{2}\right]$（说明为什么）.方程$\sin x=a$和方程$\sin(\pi-x)=a$同解. 又因为$\pi-x\in\left[-\frac{\pi}{2},\frac{\pi}{2}\right]$，那么$\pi-x=\arcsin a$，就是说，$x=\pi-\arcsin a$.

现在，为了写出方程(1)所有的解，必须利用正弦的周期性，就是把所得两个解中的每一个解加上数$2\pi m$，$m\in Z$. 得到的解集合是由两个无穷子集构成的：

$x=\arcsin a+\pi2m$，　　　　　　　　　(2)$x=-\arcsin a+\pi(2m+1)$.　　　　　　　(3)

我们看出，可以把式(2)和(3)合并成一个式子：

$x=(-1)^k\arcsin a+\pi k$，$k\in Z$.　　　(4)

实际上，当$k$是偶数时，由(4)式得到(2)式；当$k$是奇数时，由(4)式得到(3)式（把$k=2m$和$k=2m+1$代入(4)式进行检验）.

注　当$a=1$和$a=-1$时，由式(2)和(3)确定的解集合相同.

例 2 解方程$\sin x=\frac{\sqrt{2}}{2}$.

根据(4)式得：$x=(-1)^k\arcsin\frac{\sqrt{2}}{2}+\pi k$，$k\in Z$，因为$\arcsin\frac{\sqrt{2}}{2}=\frac{\pi}{4}$（参看上面），那么$x=(-1)^k\frac{\pi}{4}+\pi k$，$k\in Z$.

例 3 解方程$\sin x=1$.

根据(4)式得：$x=(-1)^k\arcsin1+\pi k$；因为$\arcsin1=\frac{\pi}{2}$（参看上面），那么$x=(-1)^k\frac{\pi}{2}+\pi k$.

当$k=2m$是偶数时，得到：$x=\frac{\pi}{2}+2m\pi$. 当$k=2m+1$是奇数时，得到：$x=-\frac{\pi}{2}+(2m+1)\pi=\frac{\pi}{2}+2m\pi$. 由此看出，当$a=1$时，解的写法可简化成：$x=\frac{\pi}{2}+2m\pi$，$m\in Z$.

例 4 解方程$\sin x=0$.根据(4)式得：$x=(-1)^k\arcsin0+\pi k$.因为$\sin0=0$，$0\in\left[-\frac{\pi}{2},\frac{\pi}{2}\right]$，所以$\arcsin0=0$，因此　　　　　　$x=\pi k$，$k\in Z$.

例 5 解方程$\sin x=0.932$.

根据(4)式得：$x=(-1)^k\arcsin0.932+\pi k$，$k\in Z$，其中$\arcsin0.932\approx1.2$.反正弦的近似值根据伯拉基斯编的《数学用表》求出.

现在列出正弦函数的基本性质.

1. 函数的定义域是整个数轴：$D(\sin)=R$.

2. 正弦值的集合是闭区间$[-1,1]$：$E(\sin)=[-1,1]$，就是说，正弦是有界函数.

3. 正弦是奇函数：对于所有的$x\in R$，$\sin(-x)=-\sin x$.

4. 正弦是具有最小正周期$2\pi$的周期函数：对于所有的$x\in R$，$\sin(x+2\pi)=\sin x$.

5. 对于所有的$x=\pi n$，其中$n\in Z$，$\sin x=0$.

6. 对于所有的$x\in]2\pi n;\pi+2\pi n[(x\in Z)$，$\sin x>0$.

7. 对于所有的$x\in]\pi+2\pi n;2\pi+2\pi n[(n\in Z)$，$\sin x<0$.

8. 正弦函数是连续的，并且在数轴的每一点都有导数.

9. 正弦函数在区间$\left[-\frac{\pi}{2}+2\pi n,\frac{\pi}{2}+2\pi n\right]$　$(n\in Z)$上，由$-1$上升到$1$.

10. 正弦函数在区间$\left[\frac{\pi}{2}+2\pi n,\frac{3}{2}\pi+2\pi n\right]$　$(n\in Z)$上，由$1$下降到$-1$.

11. 在点$x=\frac{3}{2}\pi+2\pi n$　$(n\in Z)$，正弦函数具有等于$-1$的极小值.

12. 对于所有的$x=\frac{\pi}{2}+2\pi n$　$(n\in Z)$，正弦函数具有等于$1$的极大值.
