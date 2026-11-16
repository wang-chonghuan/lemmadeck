# 77$^{*}$. 三角函数的连续性

> 第六章 三角函数及其图象和导数（续） · § 15. 三角函数的导函数

在第75小节里，我们提出了关于函数 $\cos$ 连续性的假设.现在证明这个假设以及函数 $\sin$、$\operatorname{tg}$、$\operatorname{ctg}$ 在它们有定义的所有各点的连续性. 为此，我们需要下面的预备定理.

预备定理　对于满足条件$0<|x|<\frac{\pi}{2}$所有 $x$ 的值，不等式$|\sin x|<|x|<|\operatorname{tg}x|$　(1)成立.

现在从 $0<x<\frac{\pi}{2}$ 的情形开始证明. 我们来比较面积 $S_{OAD}$（三角形$OAD$）、$S_{OAB}$（三角形 $OAB$）和 $S_{OACD}$（扇形 $OACD$）（图 3）.

![图 3](../../figures/fig-03.svg)

*图 3*

这些面积很容易算出：

$S_{OAD}=\frac{1}{2}|OA|\cdot|OD|\cdot\sin x=\frac{1}{2}\sin x$，$S_{OAB}=\frac{1}{2}|OA|\cdot|AB|=\frac{1}{2}\operatorname{tg}x$，$S_{OACD}=\frac{1}{2}r^2\cdot x=\frac{1}{2}x$.

*　划星号的是补充教材，不要求全体学生都学习. 在许多情况下，这种补充教材划两个三角形：$\blacktriangleright$（在开头部分），$\blacktriangleleft$（在末尾部分），参看第13—15页等等.

由图 3 看出，$S_{OAD}<S_{OACD}<S_{OAB}$，或$\frac{1}{2}\sin x<\frac{1}{2}x<\frac{1}{2}\operatorname{tg}x$，就是$\sin x<x<\operatorname{tg}x$.　(2)

因为当 $0<x<\frac{\pi}{2}$ 时，$\sin x$ 和 $\operatorname{tg}x$ 都是正的，所以当 $0<x<\frac{\pi}{2}$ 时，不等式(1)成立.

剩下的问题是讨论 $-\frac{\pi}{2}<x<0$ 的情形. 当 $x$ 取这些值时，得 $0<-x<\frac{\pi}{2}$，并且对于 $-x$ 可以利用不等式(2)：$\sin(-x)<-x<\operatorname{tg}(-x)$.　(3)

因为现在 $-x=|x|$，$\sin(-x)=|\sin x|$，$\operatorname{tg}(-x)=|\operatorname{tg}x|$，那么由(3)可以得出(1).

这样，对于区间 $]-\frac{\pi}{2},\frac{\pi}{2}[$ 里所有 $x\ne0$ 的值，完全证明了不等式(1).

定理 1　在整个数轴上，余弦函数是连续的，也就是对于任意 $x_0\in R$，$\lim_{x\to x_0}\cos x=\cos x_0$.

证明　我们来估计 $|\cos x-\cos x_0|$.$|\cos x-\cos x_0|=\left|2\sin\frac{x_0-x}{2}\sin\frac{x+x_0}{2}\right|=2\left|\sin\frac{x_0-x}{2}\right|\cdot\left|\sin\frac{x+x_0}{2}\right|\leqslant2\left|\sin\frac{x-x_0}{2}\right|\leqslant2\left|\frac{x-x_0}{2}\right|=|x-x_0|$.

因此，如果对于任意的 $\varepsilon>0$，设 $\delta=\varepsilon$，当 $|x-x_0|<\delta$ 时，就有：$|\cos x-\cos x_0|\leqslant|x-x_0|<\varepsilon$.

这就是说，$\lim_{x\to x_0}\cos x=\cos x_0$，也就是余弦函数在点 $x_0$ 是连续的.

类似地，可以证明定理 2：

定理 2　在整个数轴上，正弦函数是连续的，也就是对于任意 $x_0\in R$，$\lim_{x\to x_0}\sin x=\sin x_0$.

定理 3　正切函数和余切函数在它的定义域内都是连续的，就是对于任意 $x_0\in D(\operatorname{tg})$，$\lim_{x\to x_0}\operatorname{tg}x=\operatorname{tg}x_0$；对于任意 $x_0\in D(\operatorname{ctg})$，$\lim_{x\to x_0}\operatorname{ctg}x=\operatorname{ctg}x_0$.

证明　实际上，如果 $x_0\ne\frac{\pi}{2}+k\pi$，$k\in Z$，那么 $\cos x_0\ne0$.于是，$\lim_{x\to x_0}\operatorname{tg}x=\lim_{x\to x_0}\frac{\sin x}{\cos x}=\frac{\lim_{x\to x_0}\sin x}{\lim_{x\to x_0}\cos x}=\frac{\sin x_0}{\cos x_0}=\operatorname{tg}x_0$，类似地，可以证明定理 3 的第二部分.
