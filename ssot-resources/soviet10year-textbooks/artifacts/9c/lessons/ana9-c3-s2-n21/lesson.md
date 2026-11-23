# 21．数列的极限的定义

我们来比较详细地研究一下前一小节中的第三个例子．“当$n$充分大时，表达式$y_n=\frac{n-1}{3n}$的值与$\frac{1}{3}$的差任意小”，这个论断的确切含意是什么呢？

先提出这样的问题：$n$应当等于多大时，差$y_n-\frac{1}{3}$的绝对值小于0.001？因为$\left|y_n-\frac{1}{3}\right|=\left|-\frac{1}{3n}\right|=\frac{1}{3n}$，

因此，问题就归结为，求满足不等式$\frac{1}{3n}<0.001$的自然数$n$．

但是，这个不等式等价于不等式$3n>1000$，或者不等式$n>333\frac{1}{3}$．

因此，对于任意$n>n_0=333$，不等式$\left|y_n-\frac{1}{3}\right|<0.001$成立．

假如我们用0.000001代替0.001，那么，经过同样的计算，可以证实：对于任意$n>n_1=333333$，有$\left|y_n-\frac{1}{3}\right|<0.000001$．

任意取一个正数$\varepsilon$，然后自问：怎样的$n$满足不等式$\left|y_n-\frac{1}{3}\right|=\frac{1}{3n}<\varepsilon$？    (1)

这个不等式等价于不等式$n>\frac{1}{3\varepsilon}$．

因为我们只对$n$取整数的情况感兴趣，因此，我们的问题的答案是：对于一切$n>N$，其中$N$是数$\frac{1}{3\varepsilon}$的整数部分，不等式(1)成立．

自己分析前一小节的例1、例2，并加以证实：在这些情况下，对于任意正数$\varepsilon$，存在这样的自然数$N$，使得对于一切$n>N$，不等式$|y_n-0|<\varepsilon$成立.

现在我们给出数列的极限的定义.

定义 如果对于任意正数$\varepsilon$，存在这样的自然数$N$，使得对于一切$n>N$，不等式$|x_n-a|<\varepsilon$，　(2)成立，那么数$a$叫做数列$(x_n)$的极限.

这时，称“数列$(x_n)$有极限$a$”，并写成$\lim_{n\to\infty}x_n=a$.

对于有极限的数列，我们说这个数列收敛.

数$N$（数列极限定义中的）既依赖于所讨论的数列，又依赖于所取的正数$\varepsilon$.

我们来证明：数$\alpha$的近似小数数列$(\alpha_n)$和$(\alpha'_n)$收敛于$\alpha$本身，即$\lim_{n\to\infty}\alpha_n=\lim_{n\to\infty}\alpha'_n=\alpha$.

如果$\alpha$是任意实数，而且$(\alpha_n)$和$(\alpha'_n)$分别是它的不足和过剩近似小数数列，那么$|\alpha_n-\alpha|\leqslant\frac{1}{10^n}$，$|\alpha'_n-\alpha|\leqslant\frac{1}{10^n}$.

因为，对于每一个正数$\varepsilon$，有这样的自然数$N$，使得当$n>N$时，有$\frac{1}{10^n}<\varepsilon$，因而也有$|\alpha_n-\alpha|<\varepsilon$，$|\alpha'_n-\alpha|<\varepsilon$.因此$\lim_{n\to\infty}\alpha_n=\alpha$，$\lim_{n\to\infty}\alpha'_n=\alpha$.

我们来阐明数列的极限的几何意义. 不等式 (2) 等价于双不等式$-\varepsilon<x_n-a<\varepsilon$，或者$a-\varepsilon<x_n<a+\varepsilon$.　(3)

![图 12](../../figures/fig-12.svg)

*图 12*

不等式(3)说明，收敛于$a$的数列$(x_n)$中，所有序号$n>N$的项，即$x_{N+1}$，$x_{N+2}$，…，均落到开区间$]a-\varepsilon,a+\varepsilon[$内(图12).这个区间叫做点$a$的$\varepsilon$邻域.

因此，如果数$a$是数列$(x_n)$的极限，那么该数列的项，除了有限项外，全都落到点$a$的任意一个（不管怎样小的）邻域内.
