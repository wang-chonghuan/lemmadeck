# 102. 具有可变积分上限的积分

首先，我们指出，积分与积分变量的符号无关，就是说，

$\int_a^b f(x)dx=\int_a^b f(t)dt=\int_a^b f(z)dz=\cdots$。

由牛顿-莱布尼兹公式可以得出这个结论：$\int_a^b f(x)dx=\left.F(x)\right|_a^b=F(b)-F(a)$以及　$\int_a^b f(t)dt=\left.F(t)\right|_a^b=F(b)-F(a)$ 等等，就是说，得到的是同一个数。

现在我们来讨论具有可变积分上限的积分（我们用字母$x$ 表示可变的积分上限，而用字母 $t$ 表示积分变量）：$\int_a^x f(t)dt$。

这个积分是 $x$ 的函数。我们来证明，这个函数的导数$\left(\int_a^x f(t)dt\right)'=f(x)$。　（1）

实际上，根据牛顿-莱布尼兹公式：$\int_a^x f(t)dt=F(x)-F(a)$，因此$\left(\int_a^x f(t)dt\right)'=[F(x)-F(a)]'=F'(x)-[F(a)]'=f(x)$。

由牛顿-莱布尼兹公式得出：$\int_a^a f(t)dt=F(a)-F(a)=0$。

所以由 $a$ 到 $x$ 的积分$F(x)=\int_a^x f(t)dt$是函数 $f$ 的原函数，它在 $a$ 点变成零。

在 $a$ 点取值为 $q$ 的原函数可写成$q+\int_a^x f(t)dt$。　（2）
