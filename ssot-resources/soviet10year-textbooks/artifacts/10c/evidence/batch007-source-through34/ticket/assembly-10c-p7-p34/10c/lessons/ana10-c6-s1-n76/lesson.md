# 76. 余弦函数、正切函数和余切函数的导函数

> 第六章 三角函数及其图象和导数（续） · § 15. 三角函数的导函数

在这一小节里，我们利用正弦函数的导函数（第75小节）计算余弦函数、正切函数和余切函数的导函数.

$\cos' x=-\sin x$， (1)$\operatorname{tg}' x=\frac{1}{\cos^2x}$， (2)$\operatorname{ctg}' x=-\frac{1}{\sin^2x}$. (3)

上列公式中的每一个式子在对应函数定义域内任何一点都成立.

为了推出(1)式，我们利用等式$\cos x=\sin\left(\frac{\pi}{2}-x\right)$和复合函数微分法则：$\cos' x=\left[\sin\left(\frac{\pi}{2}-x\right)\right]'=\cos\left(\frac{\pi}{2}-x\right)\left(\frac{\pi}{2}-x\right)'=\sin x(-1)=-\sin x$.

为了证明(2)式和(3)式，我们利用商的导数公式和已知的正弦函数和余弦函数的导函数公式：$\operatorname{tg}' x=\left(\frac{\sin x}{\cos x}\right)'=\frac{(\sin x)'\cos x-(\cos x)'\sin x}{\cos^2x}=\frac{\cos^2x+\sin^2x}{\cos^2x}=\frac{1}{\cos^2x}$，$\operatorname{ctg}' x=\left(\frac{\cos x}{\sin x}\right)'=\frac{(\cos x)'\sin x-(\sin x)'\cos x}{\sin^2x}=\frac{-\sin^2x-\cos^2x}{\sin^2x}=-\frac{1}{\sin^2x}$.

例　求正弦曲线在横坐标 $x_1=0$，$x_2=\frac{\pi}{2}$，$x_3=\pi$ 三点上的切线.

正如你们所知道的（第52小节），函数 $f$ 的图象在点$(x_0,y_0)$（这里 $y_0=f(x_0)$）的切线方程具有下面的形式：

$y-y_0=f'(x_0)(x-x_0)$.

在这种情况下，$f(x)=\sin x$. 为了解题，应当求出正弦函数在点 $0$、$\frac{\pi}{2}$ 和 $\pi$ 处的导函数值. 正弦函数的导函数等于余弦函数：$f'(0)=\cos0=1$. 其次，我们求出

$f'\left(\frac{\pi}{2}\right)=\cos\frac{\pi}{2}=0$ 和 $f'(\pi)=\cos\pi=-1$.

因此：

1) 在横坐标 $x_1=0$ 这一点，切线方程有 $y-0=1\cdot(x-0)$的形式，也就是 $y=x$. 我们看到，在点 $(0,0)$ 处，正弦曲线的切线是第一象限和第三象限的平分线（图 2）.

2) 在横坐标 $x_2=\frac{\pi}{2}$ 这一点，切线方程是$y-1=0\cdot\left(x-\frac{\pi}{2}\right)$，就是 $y=1$. 它是水平直线（图 2）.

3) 类似地，在横坐标 $x_3=\pi$ 这一点的切线方程是 $y-0=(-1)(x-\pi)$，就是 $y=\pi-x$.

![图 2](../../figures/fig-02.svg)

*图 2*
