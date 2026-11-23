# 47. 商的导数

定理. 如果函数 $u$ 和 $v$ 在点 $x$ 有导数，而且 $v(x)\ne0$，那么它们的商 $\frac{u}{v}$ 在这点也有导数，这个导数由公式$(\frac{u}{v})'=\frac{u'v-uv'}{v^2}$给出。

证明　用 $w$ 表示商 $\frac{u}{v}$。这时$\frac{\Delta w(x)}{\Delta x}=\frac{w(x+\Delta x)-w(x)}{\Delta x}=\frac{\frac{u(x+\Delta x)}{v(x+\Delta x)}-\frac{u(x)}{v(x)}}{\Delta x}=\frac{\frac{u+\Delta u}{v+\Delta v}-\frac{u}{v}}{\Delta x}=\frac{v\Delta u-u\Delta v}{\Delta x\cdot v(v+\Delta v)}=\frac{v\frac{\Delta u}{\Delta x}-u\frac{\Delta v}{\Delta x}}{v(v+\Delta v)}$.

根据第45小节的引理，$\lim_{\Delta x\to0}\Delta v(x)=0$，因此

$\left(\frac{u}{v}\right)'=w'=\lim_{\Delta x\to0}\frac{\Delta w}{\Delta x}=\lim_{\Delta x\to0}\frac{v\frac{\Delta u}{\Delta x}-u\frac{\Delta v}{\Delta x}}{v(v+\Delta v)}=\frac{v\lim_{\Delta x\to0}\frac{\Delta u}{\Delta x}-u\lim_{\Delta x\to0}\frac{\Delta v}{\Delta x}}{v\lim_{\Delta x\to0}(v+\Delta v)}=\frac{vu'-uv'}{v\cdot v}=\frac{vu'-uv'}{v^2}$.

例.

$\left(\frac{2+3x}{1-2x}\right)'=\frac{(2+3x)'(1-2x)-(2+3x)(1-2x)'}{(1-2x)^2}=\frac{3(1-2x)+2(2+3x)}{(1-2x)^2}=\frac{7}{(1-2x)^2}$.
