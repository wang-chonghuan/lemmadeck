# 44. 函数的和的导数

设 $u$ 和 $v$ 是定义在同一个区间上的两个函数.

定理. 如果两个函数都有导数，那么它们的和的导数等于它们的导数的和，即

$(u(x)+v(x))'=u'(x)+v'(x)$.

证明 用 $w(x)$ 表示这两个函数的和 $u(x)+v(x)$，并计算 $w(x)$ 的导数：

$\frac{\Delta w(x)}{\Delta x}=\frac{w(x+\Delta x)-w(x)}{\Delta x}=\frac{u(x+\Delta x)+v(x+\Delta x)-u(x)-v(x)}{\Delta x}=\frac{u(x+\Delta x)-u(x)+v(x+\Delta x)-v(x)}{\Delta x}=\frac{\Delta u}{\Delta x}+\frac{\Delta v}{\Delta x}$，

于是，

$(u+v)'=w'=\lim_{\Delta x\to0}\frac{\Delta w(x)}{\Delta x}=\lim_{\Delta x\to0}\left(\frac{\Delta u}{\Delta x}+\frac{\Delta v}{\Delta x}\right)=\lim_{\Delta x\to0}\frac{\Delta u}{\Delta x}+\lim_{\Delta x\to0}\frac{\Delta v}{\Delta x}=u'+v'$.

定理证毕.

注　用数学归纳法可以证明，这个定理对任意有限个函数的和也正确：$(u_1+u_2+\cdots+u_n)'=u_1'+u_2'+\cdots+u_n'.$
