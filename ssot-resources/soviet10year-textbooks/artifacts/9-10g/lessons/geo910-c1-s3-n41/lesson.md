# §41. 三面角和多面角的面角的性质

**定理24. 三面角的每一个面角的度数小于其它两个面角度数的和.**

证明. 三面角 $SABC$ 的面角的度数记作 $\alpha$、$\beta$、$\gamma$（图160）. 设 $\gamma$ 是这些角中最大的. 只需证明，$\gamma<\alpha+\beta$.

在角 $ASB$ 的内部作射线 $SM$，它同射线 $SA$ 组成大小为$\beta$ 的角. 作线段 $AB$，它和射线 $SM$ 交于一点 $N$. 在射线 $SC$上取线段 $SD$ 与线段 $SN$ 合同. 三角形 $ASD$ 和 $ASN$ 合同（根据两条边和夹角）. 从 $\triangle ABD$ 中有：$|AD|+|DB|>|AB|$.但是，$|AB|=|AN|+|NB|$ 和 $|AD|=|AN|$，所以从最后的不等式得到 $|DB|>|NB|$。

对三角形 $BSD$ 和 $BSN$ 应用余弦定理，从不等式 $|DB|^2>|NB|^2$ 得到，$\cos\alpha<\cos(\widehat{NSD})$，因此 $\widehat{NSB}<\alpha$。于是，$\widehat{ASN}+\widehat{NSB}<\alpha+\beta$，即 $\gamma<\alpha+\beta$。$\blacksquare$

![图 160](../../figures/fig-160.svg)

![图 161](../../figures/fig-161.svg)

*图 160*

*图 161*

推论．三面角的每一个面角的度数大于其它两个面角的度数的差。

实际上，从不等式 $\gamma<\alpha+\beta$ 得到 $\alpha>\gamma-\beta$。

定理 25．在三面角中，它的所有面角的度数的和小于$360^\circ$。

证明．研究面角为 $\alpha$、$\beta$、$\gamma$ 的三面角 $SABC$（图 161）。作射线 $SA_1$，它和射线 $SA$ 构成一条直线。三面角 $SA_1BC$ 的面角的度数等于：$\alpha$、$180^\circ-\beta$、$180^\circ-\gamma$。对这个三面角应用定理 24，得到：$\alpha<(180^\circ-\beta)+(180^\circ-\gamma)$，即 $\alpha+\beta+\gamma<360^\circ$。$\blacksquare$

不等式 $|\beta-\gamma|<\alpha<\beta+\gamma$ 和 $\alpha+\beta+\gamma<360^\circ$ 中的每一个都表示面角为 $\alpha$、$\beta$、$\gamma$ 的三面角存在的必要条件：可以看出，关于这两个不等式成立也是这样的三面角存在的充分条件。（参看《附录》第 301—302 页。）

凸的多面角的面角的性质类似于三面角的性质：

1．多面角的每一个面角的度数小于其它的面角的度数的和。

2．在凸多面角中，各面角的度数的和小于 $360^\circ$。

这些性质在《附录》（第 302—304 页）中给出了证明。
