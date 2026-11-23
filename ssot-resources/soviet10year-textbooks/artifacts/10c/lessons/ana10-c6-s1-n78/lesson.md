# 78$^{*}$　弦长与弦所对的弧长的比的极限

> 第六章 三角函数及其图象和导数（续） · § 15. 三角函数的导函数

我们从证明第 75 小节假设 6 着手.

定理 1$\lim_{x\to0}\frac{\sin x}{x}=1$.

证明　设 $0<x<\frac{\pi}{2}$ 或 $-\frac{\pi}{2}<x<0$. 于是，有不等式$|\sin x|<|x|<|\operatorname{tg}x|$（参看第 77 小节）. 用 $|\sin x|$ 除这个不等式的各个部分，得到：$1<\left|\frac{x}{\sin x}\right|<\frac{1}{|\cos x|}$.考虑到在给定条件下，$\frac{x}{\sin x}>0$，$\cos x>0$，就有$1<\frac{x}{\sin x}<\frac{1}{\cos x}$，　因此　$1>\frac{\sin x}{x}>\cos x$.由此得到：$0<1-\frac{\sin x}{x}<1-\cos x=\cos0-\cos x$.因为余弦函数是连续函数，那么对于任意的 $\varepsilon>0$，可以指定$\delta>0$，使得$|0-x|<\delta\Longrightarrow|\cos0-\cos x|<\varepsilon$.因此，对于 $x\ne0$ 并满足不等式 $|x|<\delta$ 的 $x$，有$\left|1-\frac{\sin x}{x}\right|=1-\frac{\sin x}{x}<\cos0-\cos x=|\cos0-\cos x|<\varepsilon$.这就是说，$\lim_{x\to0}\frac{\sin x}{x}=1$.

根据定理 1，可以计算某些极限.

例 1　$\lim_{x\to0}\frac{x}{\sin x}=\lim_{x\to0}\frac{1}{\frac{\sin x}{x}}=\frac{1}{\lim_{x\to0}\frac{\sin x}{x}}=\frac{1}{1}=1$.

例 2　$\lim_{x\to0}\frac{\sin4x}{x}=\lim_{x\to0}\frac{\sin4x}{4x}\cdot4=1\cdot4=4$.

例 3　$\lim_{x\to0}\frac{\operatorname{tg}x}{x}=\lim_{x\to0}\frac{\sin x}{x}\cdot\frac{1}{\cos x}=\lim_{x\to0}\frac{\sin x}{x}\cdot\lim_{x\to0}\frac{1}{\cos x}=1$.

注　在数学分析里，正弦是数值自变量的数值函数. 但是这个函数是从几何意义引入的（参看第 63 小节里的定义）. 在几何学里，把正弦看作角度值的数值函数. 角度值可以利用不同的测量单位度量. 把正弦定义成数值自变量的函数时，取角度的弧度制作为基础：数 $x$ 的正弦等于 $x$ 弧度角的正弦. 为了确切起见，应当写成$\sin x=\sin_{\text{г}}(x\text{ 弧度})$.　(2)在等式左边，$\sin$ 是数值自变量的函数的记号，而在等式右边，$\sin_{\text{г}}$ 是角度值的函数的记号. 当用弧度制度量角度时，得到$\sin x=\sin_{\text{г}}\left(\frac{180}{\pi}\cdot x\right)^\circ$.　(3)如果在数学分析里引入函数$f(x)=\sin_{\text{г}}(x^\circ)=\sin_{\text{г}}\left(\frac{\pi}{180}x\text{ 弧度}\right)=\sin\left(\frac{\pi}{180}x\right)$，代替用等式(2)定义的函数 $\sin$，那么，对于它来说，就得到公式$f'(0)=\lim_{x\to0}\frac{f(x)}{x}=\frac{\pi}{180}$，而不是简单公式$\sin'(0)=\lim_{x\to0}\frac{\sin x}{x}=1$.这样做是不方便的.

定理 2　圆的弦长与弦所对的弧长的比，当弧长趋向零时，极限等于 1（图 4）.

![图 4](../../figures/fig-04.svg)

*图 4*

证明　设圆的半径等于 $r$，它的弦 $AB$ 所对的弧是 $x$ 弧度，那么弦 $AB$ 的长度等于 $|AB|=2r\sin\frac{x}{2}$，而弧长等于 $xr$.用 $l$ 表示弧长，得到：$\lim_{l\to0}\frac{|AB|}{l}=\lim_{l\to0}\frac{2r\cdot\sin\frac{x}{2}}{xr}=\lim_{x\to0}\frac{\sin\frac{x}{2}}{\frac{x}{2}}=1$.

正如我们在第 75 小节里看到的，根据定理 1，可以证明正弦函数的导函数公式，利用它又可以证明基本三角函数的导函数公式.

当 $x\to0$ 时，$\frac{\sin x}{x}$ 的极限有时叫做“第一个重要极限”.

求极限：
