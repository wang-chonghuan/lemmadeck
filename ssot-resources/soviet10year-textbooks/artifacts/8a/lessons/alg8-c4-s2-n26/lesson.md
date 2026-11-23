# 26. $n$ 次算术根的性质

我们知道算术平方根具有下列性质：

如果 $a\geqslant0$，$b\geqslant0$，那么 $\sqrt{ab}=\sqrt{a}\cdot\sqrt{b}$；

如果 $a\geqslant0$，$b>0$，那么 $\sqrt{\frac{a}{b}}=\frac{\sqrt{a}}{\sqrt{b}}$。

$n$ 次算术根（当 $n>2$ 时）具有类似的性质。

定理 $1$ **如果 $a\geqslant0$，$b\geqslant0$，那么 $\sqrt[n]{ab}=\sqrt[n]{a}\cdot\sqrt[n]{b}$。**

定理 $2$ **如果 $a\geqslant0$，$b>0$，那么 $\sqrt[n]{\frac{a}{b}}=\frac{\sqrt[n]{a}}{\sqrt[n]{b}}$。**

我们来证明定理 $1$。

式 $\sqrt[n]{a}\cdot\sqrt[n]{b}$ 的值是非负数，因为当 $a\geqslant0$ 和 $b\geqslant0$ 时，其中每一个式子都有意义并且取非负值。此外，积 $\sqrt[n]{a}\cdot\sqrt[n]{b}$的 $n$ 次幂等于 $ab$，就是：$(\sqrt[n]{a}\cdot\sqrt[n]{b})^n=(\sqrt[n]{a})^n\cdot(\sqrt[n]{b})^n=ab$。

所以，根据 $n$ 次算术根的定义，等式 $\sqrt[n]{ab}=\sqrt[n]{a}\cdot\sqrt[n]{b}$ $(a\geqslant0,b\geqslant0)$ 是真等式。

因此，当 $n$ 是任何自然数时，两个非负因数的积的 $n$ 次算术根等于这两个因数的 $n$ 次算术根的积。

通过类似的讨论，可以证明 $n$ 次算术根的第二个性质（定理 $2$）：当 $n$ 是任何自然数时，分子是非负数而分母是正数的分数的 $n$ 次算术根等于分子的 $n$ 次算术根除以分母的 $n$ 次算术根。

我们举出应用这两个定理的例子。

例 $1$ 求式 $\sqrt[4]{16\times81}$ 的值。

根据定理 $1$ 得：$\sqrt[4]{16\times81}=\sqrt[4]{16}\times\sqrt[4]{81}=2\times3=6$。

例 $2$ 化简 $\sqrt[3]{2}\times\sqrt[3]{4}$。

我们写出等式 $\sqrt[n]{ab}=\sqrt[n]{a}\cdot\sqrt[n]{b}$（$a\geqslant0,b\geqslant0$），或写成另一形式：$\sqrt[n]{a}\cdot\sqrt[n]{b}=\sqrt[n]{ab}$。利用这个等式，得到：$\sqrt[3]{2}\times\sqrt[3]{4}=\sqrt[3]{2\times4}=\sqrt[3]{8}=2$。

例 $3$ 求式 $\sqrt[3]{2\frac{10}{27}}$ 的值。

根据定理 $2$，得$\sqrt[3]{2\frac{10}{27}}=\sqrt[3]{\frac{64}{27}}=\frac{\sqrt[3]{64}}{\sqrt[3]{27}}=\frac{4}{3}=1\frac{1}{3}$。

现在，我们讨论 $n$ 次算术根的其他性质。我们从例子着手。

假设需要比较根式 $\sqrt{\sqrt[3]{64}}$ 和 $\sqrt[6]{64}$ 的值的大小，$\sqrt{\sqrt[3]{64}}=\sqrt{4}=2$，　　$\sqrt[6]{64}=\sqrt[6]{2^6}=2$。

我们看到，这两个式子的值相等，也就是，$\sqrt{\sqrt[3]{64}}=\sqrt[6]{64}$。

定理 $3$ 如果 $a\geqslant0$，那么 $\sqrt[n]{\sqrt[k]{a}}=\sqrt[nk]{a}$（$n$ 和 $k$ 是自然数）。

式 $\sqrt[n]{\sqrt[k]{a}}$ 的值是非负的，此外，式 $\sqrt[n]{\sqrt[k]{a}}$ 的 $nk$ 次幂等于 $a$。

实际上：$(\sqrt[n]{\sqrt[k]{a}})^{nk}=((\sqrt[n]{\sqrt[k]{a}})^n)^k=(\sqrt[k]{a})^k=a$。

于是，根据 $n$ 次算术根的定义，等式 $\sqrt[n]{\sqrt[k]{a}}=\sqrt[nk]{a}$（$a\geqslant0$）是真等式。

定理 $4$ 如果 $a\geqslant0$，那么 $\sqrt[nk]{a^{mk}}=\sqrt[n]{a^m}$（$n$、$k$ 和 $m$ 是自然数）。

根据定理 $3$ 得到：$\sqrt[nk]{a^{mk}}=\sqrt[n]{\sqrt[k]{a^{mk}}}=\sqrt[n]{\sqrt[k]{(a^m)^k}}=\sqrt[n]{a^m}$。

我们已经证明，如果根指数和被开方式的幂指数同乘以或者同除以同一个自然数，那么根式的值不变。

有时，我们把根式的这个性质叫做根式的基本性质（和分式的基本性质类似）。

我们举一个应用定理 $3$ 和定理 $4$ 的例子。

化简 $\sqrt[3]{2\sqrt{2}}$。

把因数 $2$ 移到平方根号下面，得到：$\sqrt[3]{2\sqrt{2}}=\sqrt[3]{\sqrt{2^2\times2}}=\sqrt[3]{\sqrt{2^3}}$。

根据定理 $3$，得：$\sqrt[3]{\sqrt{2^3}}=\sqrt[6]{2_3}$。

应用定理 $4$，得：$\sqrt[6]{2^3}=\sqrt{2}$。

因此，$\sqrt[3]{2\sqrt{2}}=\sqrt{2}$。
