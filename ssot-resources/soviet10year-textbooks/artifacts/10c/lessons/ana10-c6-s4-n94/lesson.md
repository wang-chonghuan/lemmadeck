# 94.　解三角方程举例

在第 85—88 小节里，已经说明怎样解最简单的三角方程。

我们还会遇到比较复杂的三角方程。解这类方程需要熟悉表示三角函数性质的公式。我们来看几个例子。

例 1　解方程$6\sin^2x-5\sin x+1=0$。　　　　　　　　　(1)

引入新变量，记作 $\sin x=y$。于是方程 (1) 可以写成$6y^2-5y+1=0$。

我们得到二次方程。它的根是 $y=\frac{1}{2}$ 或 $y=\frac{1}{3}$，因而 $\sin x$ $=\frac{1}{2}$ 或 $\sin x=\frac{1}{3}$。在第一种情况下得到解：$x=(-1)^k\operatorname{arc\,sin}\frac{1}{2}+\pi k$或　　　　　　　　　$x=(-1)^k\frac{\pi}{6}+\pi k,\ k\in\mathbf{Z}$。

在第二种情况下得：$x=(-1)^m\operatorname{arc\,sin}\frac{1}{3}+\pi m$或　　　　　　　　　$x\approx(-1)^m\cdot0.34+\pi m,\ m\in\mathbf{Z}$。

例 2　解方程$6\cos^2x-5\sin x+5=0$。

用 $1-\sin^2x$ 代替 $\cos^2x$ 后，得出关于 $\sin x$ 的二次方程。因此，通过代换能把已知方程化为含同一个函数的方程，然后再作一次代换就得到代数方程。

例 3　方程$\cos2x+\sin x=0$

也可归结成二次方程，只要用式 $1-2\sin^2x$ 代替 $\cos2x$，随后将 $\sin x$ 用 $y$ 表示（请解出结果）。

例 4　解方程$\operatorname{tg}x+2\operatorname{ctg}x=3$。

我们用 $y$ 代替 $\operatorname{tg}x$ 并考虑到 $\operatorname{ctg}x=\frac{1}{\operatorname{tg}x}$ 后，得到方程$y+2\cdot\frac{1}{y}=3$。

在 $y\ne0$ 的条件下，可以把它化成二次方程 $y^2-3y+2=0$。它的解是 $y=2$ 和 $y=1$。

I. $\operatorname{tg}x=2,\ x=\operatorname{arctg}2+\pi n,\ n\in\mathbb{Z}$，$x\approx1.11+\pi n,\ n\in\mathbb{Z}$。II. $\operatorname{tg}x=1,\ x=\frac{\pi}{4}+\pi k,\ k\in\mathbb{Z}$。

例5　解方程$3\sin^2x-4\sin x\cos x+\cos^2x=0$。　(2)

对于这个方程，可以利用半角的正切公式，然后再解所得到的双二次方程。但是已知方程可以比较简单地求解。

方程左边的每一项都是关于变量 $y$ 和 $z$ 的二次单项式，其中 $y=\sin x$，$z=\cos x$。这就是说，它是关于正弦和余弦的二次齐次方程。正弦和余弦不可能同时等于零。因此，使这两个函数当中的一个变成零的自变量的值不是这个方程的解。所以可以用 $\cos^2x$（或 $\sin^2x$）除方程的两边，从而得到与方程(2)同解的方程：

$3\operatorname{tg}^2x-4\operatorname{tg}x+1=0$，

由此得

$\operatorname{tg}x=1$ 或 $\operatorname{tg}x=\frac{1}{3}$。

于是，

$x=\frac{\pi}{4}+\pi n,\ n\in\mathbb{Z}$，

或

$x=\operatorname{arctg}\frac{1}{3}+\pi n,\ n\in\mathbb{Z}$。

一次齐次方程，例如方程 $\sin x+2\cos x=0$，以及三次齐次方程，例如 $\sin^3x+2\sin^2x\cos x-3\sin x\cos^2x+2\cos^3x=0$，经常可以遇到。解这类方程时，也是用余弦或正弦的幂（次数等于齐次方程的次数）去除方程的左边和右边。举例说，一次方程用 $\cos x$ 或 $\sin x$ 去除，而三次方程用 $\cos^3x$ 或 $\sin^3x$去除。然后用 $y$ 代替 $\operatorname{tg}x$ 或 $\operatorname{ctg}x$，得出代数方程。
