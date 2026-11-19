# 41. 含二次根式的代数式的变形

现在我们讨论各种不同的题,解这种题时,需要把含二次根式的代数式变形.

1. 化简表示式$2.3\sqrt{5}-\sqrt{20}-\sqrt{\frac{1}{5}}$.

利用从根号下面提出因数的方法可以使$\sqrt{20}$变形:$\sqrt{20}=\sqrt{4\times5}=2\sqrt{5}$.

利用关于分数的平方根的定理和分数的基本性质使$\sqrt{\frac{1}{5}}$变形:$\sqrt{\frac{1}{5}}=\frac{1}{\sqrt{5}}=\frac{1\times\sqrt{5}}{\sqrt{5}\times\sqrt{5}}=\frac{1}{5}\sqrt{5}=0.2\sqrt{5}$.

于是$2.3\sqrt{5}-\sqrt{20}-\sqrt{\frac{1}{5}}=2.3\sqrt{5}-2\sqrt{5}-0.2\sqrt{5}=\sqrt{5}(2.3-2-0.2)=0.1\sqrt{5}$.

2. 约分: $\frac{\sqrt{15}+2\sqrt{5}}{3+2\sqrt{3}}$.

因为$\sqrt{15}=\sqrt{5}\cdot\sqrt{3}$, $3=(\sqrt{3})^2$, 那么$\frac{\sqrt{15}+2\sqrt{5}}{3+2\sqrt{3}}=\frac{\sqrt{5}\cdot\sqrt{3}+2\sqrt{5}}{(\sqrt{3})^2+2\sqrt{3}}=\frac{\sqrt{5}(\sqrt{3}+2)}{\sqrt{3}(\sqrt{3}+2)}$ $=\frac{\sqrt{5}}{\sqrt{3}}$.

把分子和分母同乘以$\sqrt{3}$, 得:$\frac{\sqrt{5}}{\sqrt{3}}=\frac{\sqrt{5}\cdot\sqrt{3}}{\sqrt{3}\cdot\sqrt{3}}=\frac{1}{3}\sqrt{15}$.

于是,$\frac{\sqrt{15}+2\sqrt{5}}{3+2\sqrt{3}}=\frac{1}{3}\sqrt{15}$.

3. 查平方根表求表示式$\frac{3\sqrt{2}+4}{\sqrt{2}-1}$的近似值.

我们设法化简这个表示式. 把这个分式的分子和分母分解因式不能化简,因此用下面的方法来作: 把这个分式的分子和分母乘以这样一个式子,使得在分母里得到有理数.

式$\sqrt{2}+1$是这种因式当中最简单的一个.

实际上,$(\sqrt{2}-1)(\sqrt{2}+1)=(\sqrt{2})^2-1^2=2-1=1$.

于是,$\frac{3\sqrt{2}+4}{\sqrt{2}-1}=\frac{(3\sqrt{2}+4)(\sqrt{2}+1)}{(\sqrt{2}-1)(\sqrt{2}+1)}=(3\sqrt{2}+4)(\sqrt{2}+1)$.

作乘法计算后,得到:$(3\sqrt{2}+4)(\sqrt{2}+1)=3(\sqrt{2})^2+4\sqrt{2}+3\sqrt{2}+4=3\times2+7\sqrt{2}+4=10+7\sqrt{2}$.

查表求出$\sqrt{2}\approx1.414$. 由此得:$10+7\sqrt{2}\approx10+7\times1.414=19.898$.

4. 证明: 对于任何$a\geq0$和$b\geq0$, 不等式$\sqrt{a+b}\leq\sqrt{a}+\sqrt{b}$成立.

显然,对于任何$a\geq0$和$b\geq0$来说,$\sqrt{a+b}$和$\sqrt{a}+\sqrt{b}$的值是非负的. 我们来比较它们的平方的大小:$(\sqrt{a+b})^2=a+b$;$(\sqrt{a}+\sqrt{b})^2=(\sqrt{a})^2+2\sqrt{a}\cdot\sqrt{b}+(\sqrt{b})^2=a+b+2\sqrt{a}\sqrt{b}$.

因为$2\sqrt{a}\sqrt{b}\geq0$, 所以$(\sqrt{a+b})^2\leq(\sqrt{a}+\sqrt{b})^2$.

由此 $\sqrt{a+b}\leq\sqrt{a}+\sqrt{b}$.
