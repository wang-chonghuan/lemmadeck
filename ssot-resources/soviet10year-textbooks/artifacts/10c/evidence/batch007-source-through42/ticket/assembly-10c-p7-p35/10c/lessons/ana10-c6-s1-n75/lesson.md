# 75. 正弦函数的导函数

> 第六章 三角函数及其图象和导数（续） · § 15. 三角函数的导函数

在这一节里，将推出三角函数的导函数公式. 首先我们证明：

$\sin' x=\cos x^{*}$. (1)

(1)式是根据下面两点假设推出的（稍后就证明这两点假设的正确性）：

а) 当自变量取所有的值时，函数$\cos$是连续的，就是$\lim_{\Delta x\to0}\cos(x+\Delta x)=\cos x$；

б) $\lim_{x\to0}\frac{\sin x}{x}=1$.

![图 1](../../figures/fig-01.svg)

*图 1*

关于$\lim_{x\to0}\frac{\sin x}{x}$等于1的假设，从几何上考虑就足以使人信服. 事实上，如果首先认为$x$是正的，在单位圆上（图1）从点$P_0$向两边取长度为$x$的弧$\widehat{P_0A}$和$\widehat{P_0B}$. 整段弧$\widehat{AB}$的长度就等于$2x$. 我们来计算弦$AB$的长度：$|AB|=|AC|+|CB|=2\sin x$.因此，$AB$弦长对$AB$弧长的比等于$\frac{2\sin x}{2x}=\frac{\sin x}{x}$.由图可以看出，当$x$很小时，弦长和弧长几乎相等，就是说，比$\frac{\sin x}{x}$趋近于1.

* 等式(1)可以写成$(\sin x)'=\cos x$.

因为$\frac{\sin(-x)}{-x}=\frac{\sin x}{x}$，那么当$x$为负并且它的绝对值很小时，比$\frac{\sin x}{x}$也趋近于1.

现在转回到推出(1)式，根据导数的定义，求出极限$\lim_{\Delta x\to0}\frac{\Delta\sin x}{\Delta x}$，其中$\Delta\sin x=\sin(x+\Delta x)-\sin x$. 我们把正弦的改变量写成积的形式. 为此，在公式$\sin\alpha-\sin\beta=2\cos\frac{\alpha+\beta}{2}\sin\frac{\alpha-\beta}{2}$ （参看第74小节）里，设$\alpha=x+\Delta x$，$\beta=x$. 那么$\Delta\sin x=\sin(x+\Delta x)-\sin x=2\cos\left(x+\frac{\Delta x}{2}\right)\sin\frac{\Delta x}{2}$.因此$\sin' x=\lim_{\Delta x\to0}\frac{\Delta\sin x}{\Delta x}$ $=\lim_{\Delta x\to0}\frac{2\cos\left(x+\frac{\Delta x}{2}\right)\cdot\sin\frac{\Delta x}{2}}{\Delta x}=\lim_{\Delta x\to0}\cos\left(x+\frac{\Delta x}{2}\right)\cdot\lim_{\Delta x\to0}\frac{\sin\frac{\Delta x}{2}}{\frac{\Delta x}{2}}=\cos x\cdot1=\cos x$.

例 利用复合函数微分法，得出：

1. $[\sin(ax+b)]'=\cos(ax+b)\cdot(ax+b)'=a\cos(ax+b)$.

2. $\left(\sin\frac{1}{x}\right)'=-\frac{1}{x^2}\cos\frac{1}{x}$.
