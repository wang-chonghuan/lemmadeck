# § 10. 两个平面的相关位置. 平面平行的判定

> 九年级 · 第一章　立体几何的基本概念．空间平行关系

我们已经知道两个平面相关位置的两种情形：1) 两个平面重合，如果它们有三个不在同一条直线上的公共点（公理4）；2) 相交，如果它们不相同且有一个公共点（公理 5）.

我们来证明两个平面相关位置的第三种情形：两个平面没有公共点的情形.

在平面 $\alpha$ 内作两条相交直线 $a$ 和 $b$（图 30）. 过不属于 $\alpha$ 的点 $\beta_1$ 作直线 $a_1\mathbin{//}a$ 和 $b_1\mathbin{//}b$；过 $a_1$ 和 $b_1$ 作平面 $\beta$（§ 3，推论 2）.

![图 30](../../figures/fig-30.svg)

*图　30*

用反证法证明 $\alpha$ 和 $\beta$ 没有公共点. 假设点 $M$ 是平面 $\alpha$ 和$\beta$ 的公共点. 从公理 5 得到它们的交线是某一条直线 $c$. 但是平面 $\alpha$ 通过 $a$，平面 $\beta$ 通过 $a_1$，并且 $a\mathbin{//}a_1$，于是，$c\mathbin{//}a$（§ 8，定理 4）.

同理可以证明 $c\mathbin{//}b$，结果同平行线公理矛盾：在平面 $\alpha$ 内过点 $\beta$ 有两条直线 $a$ 和 $b$ 平行于直线 $c$. 因而，平面 $\alpha$ 和 $\beta$ 不可能有任何公共点. $\blacksquare$

这样，对于两个平面 $\alpha$ 和 $\beta$ 只可能有三种情形：1) $\alpha=\beta$；2) $\alpha\cap\beta=a$；3) $\alpha\cap\beta=\phi$.

我们再将第一与第三种情形合并起来.

定义. 如果两个平面没有公共点或者重合，就说这两个平面平行.

平面 $\alpha$ 和 $\beta$ 平行记作：$\alpha\mathbin{//}\beta$.

定理 6 （两个平面平行的判定）. 如果一个平面内的两条相交直线分别平行于另一个平面内的两条直线，那么这两个平面平行.

如果已知的平面是不同的平面，上述判定定理的正确性可以从以前的论证中得出. 这个证明用符号写出如下：

已知：$a\subset\alpha$，$b\subset\alpha$，$a\cap b=B$；$a_1\subset\beta$，$b_1\subset\beta$；$a_1\mathbin{//}a$，$b_1\mathbin{//}b$.

求证：$\alpha\mathbin{//}\beta$.

证明（反证法）.

假设 $\alpha\cap\beta=C$. 有：

$(a\mathbin{//}a_1,a\subset\alpha,a_1\subset\beta)\Rightarrow c\mathbin{//}a$（定理 4）.

$(b\mathbin{//}b_1,b\subset\alpha,b_1\subset\beta)\Rightarrow c\mathbin{//}b$.

我们得到与平行公理相矛盾的情形. 所以，$\alpha\mathbin{//}\beta$.

平面 $\alpha$ 和 $\beta$ 重合时也满足定理的条件（图 31）. 因为重合的平面平行. 在这种情形下，判定定理仍然正确.

![图 31](../../figures/fig-31.svg)

*图　31*
