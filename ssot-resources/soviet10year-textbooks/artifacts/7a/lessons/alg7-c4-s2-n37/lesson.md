# 37. 积和分式的平方根

我们来比较根式 $\sqrt{81\times4}$ 和 $\sqrt{81}\cdot\sqrt{4}$ 的值：$\sqrt{81\times4}=\sqrt{324}=\sqrt{18^2}=18$，$\sqrt{81}\cdot\sqrt{4}=9\times2=18$.

我们看到，$\sqrt{81\times4}=\sqrt{81}\cdot\sqrt{4}$.

定理1 如果 $a\geq 0$ 和 $b\geq 0$，那么 $\sqrt{ab}=\sqrt{a}\cdot\sqrt{b}$.

为了证明当 $a\geq 0$ 和 $b\geq 0$ 时等式$\sqrt{ab}=\sqrt{a}\cdot\sqrt{b}$　　(1)成立，我们应当规定 $\sqrt{a}\cdot\sqrt{b}\geq 0$ 和 $(\sqrt{a}\cdot\sqrt{b})^2=ab$.于是，根据二次根式的定义，就能断定在给定的变量值下，等式（1）是正确的.

1) 积 $\sqrt{a}\cdot\sqrt{b}$ 是非负的，因为按照二次根式的性质，当 $a\geq 0$ 和 $b\geq 0$ 时，根式 $\sqrt{a}$ 和 $\sqrt{b}$ 当中的每一个都有意义并且取非负值.

2) 按照积的幂的性质，$(\sqrt{a}\cdot\sqrt{b})^2=(\sqrt{a})^2\cdot(\sqrt{b})^2=ab$.

于是，等式（1）成立.

因此，对于算术平方根来说，下面的性质成立：

两个非负因数的积的平方根等于这两个因数的平方根的积.

根号下面的因数多于两个时，定理也成立.

分式的算术平方根具有类似的性质.

定理2 如果 $a\geq 0$ 和 $b>0$，那么 $\sqrt{\frac{a}{b}}=\frac{\sqrt{a}}{\sqrt{b}}$.为了证明当 $a\geq 0$ 和 $b>0$ 时，等式$\sqrt{\frac{a}{b}}=\frac{\sqrt{a}}{\sqrt{b}}$　　(2)成立，我们利用和证明定理1时同样的方法，就是证明在给定的变量值下，$\frac{\sqrt{a}}{\sqrt{b}}\geq 0$，　$\left(\frac{\sqrt{a}}{\sqrt{b}}\right)^2=\frac{a}{b}$.

1) 商 $\frac{\sqrt{a}}{\sqrt{b}}$ 的值是非负的. 因为按照二次根式的性质，当$a\geq 0$ 和 $b>0$ 时，式 $\sqrt{a}$ 和 $\sqrt{b}$ 当中的每一个都有意义，并且$\sqrt{a}\geq 0$ 和 $\sqrt{b}>0$.

2) 按照分式的幂的性质，$\left(\frac{\sqrt{a}}{\sqrt{b}}\right)^2=\frac{(\sqrt{a})^2}{(\sqrt{b})^2}=\frac{a}{b}$.

根据二次根式的定义，当 $a\geq 0$ 和 $b>0$ 时，等式（2）成立.

于是，分子是非负数而分母是正数的分式的平方根，等于分子的平方根除以分母的平方根.

我们举几个应用这两个定理的例子.

1. 求 $\sqrt{64\times0.04}$ 的值.利用定理1：$\sqrt{64\times0.04}=\sqrt{64}\cdot\sqrt{0.04}=8\times0.2=1.6$.

2. 求根式 $\sqrt{32\times98}$ 的值.将被开方式变形：$32\times98=(16\times2)(49\times2)=16\times49\times4$.为了求出 $\sqrt{16\times49\times4}$ 的值，利用关于非负因数的积的平方根的定理，得到：$\sqrt{16\times49\times4}=\sqrt{16}\times\sqrt{49}\times\sqrt{4}=4\times7\times2=56$.

3. 求 $\sqrt{\frac{36}{169}}$ 的值.根据定理2，得：$\sqrt{\frac{36}{169}}=\frac{\sqrt{33}}{\sqrt{169}}=\frac{6}{13}$.

4. 把 $\sqrt{49a^2}$（$a<0$）写成单项式.根据关于非负因数的积的平方根定理，$\sqrt{49a^2}=\sqrt{49}\times\sqrt{a^2}=7\times|a|$.如果 $a<0$，那么 $|a|=-a$，于是，$\sqrt{49a^2}=7\times(-a)=-7a$.

5. 求积 $\sqrt{20}\times\sqrt{5}$ 的值.我们把等式 $\sqrt{ab}=\sqrt{a}\times\sqrt{b}$（$a\geq 0$，$b\geq 0$）写成另一形式，就是：$\sqrt{a}\cdot\sqrt{b}=\sqrt{ab}$.得到：$\sqrt{20}\cdot\sqrt{5}=\sqrt{100}=10$.

6. 求商 $\frac{\sqrt{80}}{\sqrt{5}}$ 的值.我们把等式 $\sqrt{\frac{a}{b}}=\frac{\sqrt{a}}{\sqrt{b}}$（$a\geq 0$，$b>0$）写成另一形式，就是：$\frac{\sqrt{a}}{\sqrt{b}}=\sqrt{\frac{a}{b}}$.得到：$\frac{\sqrt{80}}{\sqrt{5}}=\sqrt{\frac{80}{5}}=\sqrt{16}=4$.

7. 把 $\frac{3}{\sqrt{2}}$ 写成 $a\sqrt{b}$ 的形式，其中 $a$ 是有理数，$b$ 是自然数.我们把分式 $\frac{3}{\sqrt{2}}$ 的分子和分母乘以 $\sqrt{2}$，得：$\frac{3}{\sqrt{2}}=\frac{3\sqrt{2}}{\sqrt{2}\times\sqrt{2}}=\frac{3\sqrt{2}}{2}=1.5\sqrt{2}$.
