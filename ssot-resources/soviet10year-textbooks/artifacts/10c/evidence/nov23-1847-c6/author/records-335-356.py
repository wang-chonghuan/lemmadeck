# All alternatives and their truth judgments below are authored literally.
question(335, "", "single",
         r"函数 $y=\sin(5x)$ 在 $\mathbb R$ 上的导函数是哪一个？",
         "Differentiate the whole composite function.",
         "One full derivative captures the chain-rule distinction, not individual factors.", [
    ("a", r"$y'=5\cos(5x)$", True, "The inner derivative is 5 and the sine derivative is cosine.", None),
    ("b", r"$y'=\cos(5x)$", False, "At x=0 this gives 1 instead of 5.", "Differentiate sine but omit d(5x)/dx=5."),
    ("c", r"$y'=-5\cos(5x)$", False, "At x=0 this gives -5 instead of 5.", "Apply the negative sign from the derivative of cosine to sine."),
])
question(336, "", "single",
         r"函数 $y=\cos(6x+\frac{\pi}{2})$ 的导函数是哪一个？",
         "Differentiate the shifted composite cosine.",
         "The complete derivative tests outer sign and inner frequency together.", [
    ("a", r"$y'=6\sin(6x+\frac{\pi}{2})$", False, "At x=0 this is +6 while the derivative is -6.", "Use +sin as the cosine derivative."),
    ("b", r"$y'=-6\sin(6x+\frac{\pi}{2})$", True, "Chain rule yields -sin(u) times u'=6.", None),
    ("c", r"$y'=-\sin(6x+\frac{\pi}{2})$", False, "At x=0 this is -1 rather than -6.", "Omit the factor 6 from the inner derivative."),
])
question(337, "", "multiple",
         r"设 $a,b$ 是实常数，$y=\cos^2(ax+b)$。哪些公式对所有实数 $a,b,x$ 都给出 $y'$？",
         "Recognize complete derivative identities with universal parameter quantification.",
         "Equivalent derivative forms belong to one multiple-response unit; a=0 is included.", [
    ("a", r"$-2a\sin(ax+b)\cos(ax+b)$", True, "Differentiate the square, cosine, and inner affine argument in order.", None),
    ("b", r"$-a\sin(2ax+2b)$", True, "Apply sin(2u)=2sin u cos u to the derivative.", None),
    ("c", r"$-2a\sin^2(ax+b)$", False, "For a=1,b=0,x=pi/2 this is -2, whereas the derivative is 0.", "After differentiating cosine, replace its remaining factor by sine too."),
    ("d", r"$-\sin(2ax+2b)$", False, "For a=2,b=0,x=pi/8 this is -1 instead of -2.", "Use the double-angle identity but omit the inner coefficient a."),
])
question(338, "", "single",
         r"求 $y=2x\sin x-(x^2-2.3)\cos(x+2)$ 的导函数。下列哪个式子正确？",
         "Differentiate both products and the outer subtraction with the literal constant 2.3.",
         "One entire derivative preserves every product-rule term and their signs.", [
    ("a", r"$2\sin x+2x\cos x-2x\cos(x+2)-(x^2-2.3)\sin(x+2)$", False,
     "The last term should be positive after distributing the outer minus; at x=0 the difference is 4.6sin2, nonzero.",
     "Differentiate cos(x+2) with a negative sign but fail to negate this term under the outer subtraction."),
    ("b", r"$2\sin x+2x\cos x-2x\cos(x+2)+(x^2-2.3)\sin(x+2)$", True,
     "Product rules give 2sin x+2x cos x minus [2x cos(x+2)-(x^2-2.3)sin(x+2)].", None),
    ("c", r"$2x\cos x-2x\cos(x+2)+(x^2-2.3)\sin(x+2)$", False,
     "It lacks 2sin x; at x=pi/2 the difference is 2.", "Treat 2x as constant in the first product, while differentiating the second correctly."),
])
question(339, "", "single",
         r"函数 $y=(x^2+x+1)\sin(3x)$ 的导函数是哪一个？",
         "Differentiate a polynomial times a composite sine.",
         "The full polynomial-trigonometric expression is a coherent product-rule result.", [
    ("a", r"$(2x+1)\sin(3x)+(x^2+x+1)\cos(3x)$", False, "At x=0 it gives 1 instead of 3.", "Differentiate both factors but omit sine's inner coefficient 3."),
    ("b", r"$3(2x+1)\cos(3x)$", False, "At x=pi/6 it gives 0, whereas the derivative there is 1+pi/3.", "Replace derivative of a product by the product of the derivatives."),
    ("c", r"$(2x+1)\sin(3x)+3(x^2+x+1)\cos(3x)$", True, "Polynomial derivative is 2x+1; sine derivative is 3cos(3x).", None),
])
question(340, "", "multiple",
         r"哪些式子在所有实数 $x$ 上都等于函数 $y=\sin x\cos x$ 的导数？",
         "Recognize equivalent full derivatives of a product.",
         "One multiple-response item assesses product differentiation and double-angle equivalence.", [
    ("a", r"$\cos^2x-\sin^2x$", True, "The two product-rule terms are cos^2 x and -sin^2 x.", None),
    ("b", r"$\cos(2x)$", True, "cos2x=cos^2 x-sin^2 x.", None),
    ("c", r"$-\sin x\cos x$", False, "At x=0 this is 0 and the derivative is 1.", "Multiply the two derivatives instead of adding product-rule terms."),
    ("d", r"$\cos^2x+\sin^2x$", False, "At x=pi/2 this is 1 and the derivative is -1.", "Replace the negative derivative of cosine with positive sine."),
])
question(341, "", "multiple",
         r"对函数 $y=\operatorname{tg}x+(1+\operatorname{ctg}x)\cos x$，哪些结论成立？导函数公式均只在原函数定义域上判定。",
         "Differentiate tangent and the cotangent-cosine product while preserving the domain.",
         "Domain and full derivative are inseparable parts of the same function result.", [
    ("a", r"定义域为 $x\ne\frac{k\pi}{2}$，$k\in\mathbb Z$。",
     True, "tan requires cos x!=0 and cot requires sin x!=0; together exclude all kpi/2.", None),
    ("b", r"$y'=\frac1{\cos^2x}-\frac{\cos x}{\sin^2x}-(1+\operatorname{ctg}x)\sin x$。",
     True, "Use tan'=sec^2, cot'=-csc^2 and the cosine product rule.", None),
    ("c", r"$y'=\frac1{\cos^2x}+\frac{\cos x}{\sin^2x}-(1+\operatorname{ctg}x)\sin x$。",
     False, "Difference from the correct derivative is 2cos x/sin^2 x, nonzero everywhere on this domain.",
     "Use +csc^2 as the cotangent derivative."),
    ("d", r"定义域只需排除 $x=\frac\pi2+k\pi$，$k\in\mathbb Z$。",
     False, "x=0 is included by this set but cot0 is undefined.", "Check tangent's poles and overlook cotangent's poles."),
])
question(342, "", "single",
         r"求 $\displaystyle\lim_{x\to\pi/2}\frac{\sin(\pi/2-x)}{\pi/2-x}$。",
         "Compute a translated two-sided fundamental sine limit.",
         "The entire limit is one response unit, including the direction of the substitution.", [
    ("a", r"$-1$", False, "With t=pi/2-x both numerator and denominator use t, giving +1.", "Negate the denominator after changing variables but not the numerator."),
    ("b", r"$0$", False, "sin t/t tends to 1, not 0.", "Substitute the numerator's limiting zero while ignoring the simultaneous denominator zero."),
    ("c", r"$1$", True, "Set t=pi/2-x and use the two-sided limit sin t/t=1.", None),
])
question(343, "", "single",
         r"求 $\displaystyle\lim_{x\to0}\frac{\sin(3x)}{5x}$。",
         "Evaluate the ratio of inner scale and denominator scale.",
         "One limit value reflects both coefficients, rather than separate arithmetic blanks.", [
    ("a", r"$\frac35$", True, "Write (3/5)sin(3x)/(3x), whose normalized factor tends to 1.", None),
    ("b", r"$\frac15$", False, "Small-angle numerator is 3x, not x.", "Use sin(3x)~x and divide by 5x."),
    ("c", r"$\frac53$", False, "The normalized expression has prefactor 3/5, not 5/3.", "Invert the frequency-to-denominator ratio."),
])
question(344, "", "single",
         r"求 $\displaystyle\lim_{x\to0}\frac{\sin(4x)}{\sin(7x)}$。",
         "Normalize two sine arguments in a limit quotient.",
         "The quotient has a single complete result; its denominator is nonzero near but not at 0.", [
    ("a", r"$1$", False, "The normalized sine limits equal 1, but the residual coefficient is 4/7.", "Set each sine-over-its-argument limit to 1 and discard the scale ratio."),
    ("b", r"$\frac47$", True, "Normalize numerator by 4x and denominator by 7x, leaving 4/7.", None),
    ("c", r"$\frac74$", False, "The ratio is numerator frequency divided by denominator frequency.", "Reverse the numerator and denominator frequency factors."),
])
question(345, "", "single",
         r"求 $\displaystyle\lim_{x\to0}\frac{\sin(5x)}{\operatorname{tg}(3x)}$。",
         "Evaluate the mixed sine-tangent small-angle limit.",
         "One full limit preserves both argument scales and the cosine factor.", [
    ("a", r"$\frac35$", False, "sin(5x)~5x and tan(3x)~3x, so their ratio is 5/3.", "Reverse the frequency ratio."),
    ("b", r"$15$", False, "Division by 3x requires dividing by 3, not multiplying by 3.", "Replace tan(3x) by x/3 rather than 3x."),
    ("c", r"$\frac53$", True, "Rewrite as sin(5x)cos(3x)/sin(3x), then normalize; cos(3x)->1.", None),
])

phase_loss = ("初相按题面明确的正振幅、正频率正弦标准形式判定；未将其冒称为原教材未提供的初相约定。",)
question(346, "a", "single",
         r"把 $y=3\sin(2x-\frac\pi4)$ 写成 $y=A\sin(\omega x+\varphi)$，约定 $A>0,\omega>0,-\pi<\varphi\le\pi$。$(A,T,\varphi)$（$T$ 为最小正周期）是哪一组？",
         "Determine amplitude, least period, normalized phase for the first oscillation.",
         "A complete parameter triple is coherent; the second source oscillation is independently normalized.", [
    ("a", r"$(3,\ \pi,\ -\frac\pi4)$", True, "A=3, omega=2, T=2pi/2; the written phase is already normalized.", None),
    ("b", r"$(3,\ 2\pi,\ -\frac\pi4)$", False, "pi is already a positive period; 2pi is not least.", "Use the base sine period without dividing by frequency 2."),
    ("c", r"$(3,\ \pi,\ \frac\pi4)$", False, "At x=0 this phase gives +3sqrt(2)/2 rather than -3sqrt(2)/2.", "Drop the negative sign of the phase while keeping the other parameters."),
], phase_loss)
question(346, "b", "single",
         r"把 $y=2\cos(\frac\pi5-4x)$ 写成 $y=A\sin(\omega x+\varphi)$，约定 $A>0,\omega>0,-\pi<\varphi\le\pi$。$(A,T,\varphi)$（$T$ 为最小正周期）是哪一组？",
         "Determine parameters after reversing cosine's argument and converting to sine.",
         "This independent oscillation adds the sign-of-frequency distinction to a complete triple.", [
    ("a", r"$(2,\ \frac\pi2,\ \frac{7\pi}{10})$", False, "The phase 7pi/10 yields initial derivative 8cos(7pi/10)<0, while the original derivative at 0 is 8sin(pi/5)>0.",
     "Change cos(pi/5-4x) incorrectly to cos(4x+pi/5), then add pi/2 for sine."),
    ("b", r"$(2,\ \frac\pi2,\ \frac{3\pi}{10})$", True, "Evenness gives cos(4x-pi/5); add pi/2 to obtain sine phase 3pi/10; T=2pi/4.", None),
    ("c", r"$(2,\ \frac\pi2,\ -\frac\pi5)$", False, "At x=0 this sine form is negative, but the original is positive.", "Normalize the frequency but report the cosine phase as a sine phase."),
], phase_loss)
question(347, "a", "single",
         r"把 $y=-0.6\cos(\frac x2+0.3\pi)$ 写成 $y=A\sin(\omega x+\varphi)$，约定 $A>0,\omega>0,-\pi<\varphi\le\pi$。$(A,T,\varphi)$（$T$ 为最小正周期）是哪一组？",
         "Absorb a negative amplitude and normalize its sine phase.",
         "The whole parameter triple tests sign normalization and low frequency together.", [
    ("a", r"$(0.6,\ 4\pi,\ \frac{4\pi}{5})$", False, "This sine is the negative of the required function, including opposite value at x=0.", "Add pi/2 to the cosine phase but ignore the negative coefficient."),
    ("b", r"$(0.6,\ \pi,\ -\frac\pi5)$", False, "A shift by pi changes the argument by pi/2, not a full turn, so pi is not a period.", "Multiply 2pi by frequency 1/2 instead of dividing."),
    ("c", r"$(0.6,\ 4\pi,\ -\frac\pi5)$", True, "Absorb minus with phase +pi, convert cosine to sine with +pi/2, subtract 2pi; phase=-pi/5 and T=4pi.", None),
], phase_loss)
question(347, "b", "single",
         r"把 $y=\frac{\sqrt3}{2}\sin(x+1)+\frac12\cos(x+1)$ 写成 $y=A\sin(\omega x+\varphi)$，约定 $A>0,\omega>0,-\pi<\varphi\le\pi$。$(A,T,\varphi)$（$T$ 为最小正周期）是哪一组？",
         "Combine two same-frequency terms and determine the complete parameter triple.",
         "The vector coefficients, common frequency and phase constitute one oscillation.", [
    ("a", r"$(1,\ 2\pi,\ 1+\frac\pi6)$", True, "The coefficient norm is 1; cos(pi/6)=sqrt3/2 and sin(pi/6)=1/2 give the required sum.", None),
    ("b", r"$(\frac{\sqrt3+1}{2},\ 2\pi,\ 1+\frac\pi6)$", False, "This multiplies both correct coefficients by (sqrt3+1)/2!=1.", "Add the two coefficients arithmetically instead of taking their Euclidean norm."),
    ("c", r"$(1,\ 2\pi,\ 1+\frac\pi3)$", False, "Expansion swaps the coefficients of sin(x+1) and cos(x+1).", "Assign the cosine coefficient to cos(phi) instead of sin(phi)."),
], phase_loss)

graph_loss = ("识别导数与完整曲线性质，不证明能够独立绘制曲线。",)
question(348, "", "multiple",
         r"对 $f(x)=1.5\cos(\frac83x+\frac\pi9)$ 作导数及图象分析。记 $t=x+\frac\pi{24}$。以下哪些结论成立？各式中 $k\in\mathbb Z$。",
         "Recognize derivative analysis and the full translated cosine profile.",
         "One coordinated multiple-response profile relates derivative, extrema, monotonicity, concavity and graph landmarks; no candidate drawing is essential.", [
    ("a", r"定义域为 $\mathbb R$，值域为 $[-\frac32,\frac32]$，最小正周期为 $\frac{3\pi}4$。",
     True, "Amplitude 3/2 bounds cosine and T=2pi/(8/3)=3pi/4.", None),
    ("b", r"$f'(x)=-4\sin(\frac83t)$，$f''(x)=-\frac{32}3\cos(\frac83t)$。",
     True, "The first coefficient is -(3/2)(8/3)=-4; the second is -4(8/3)=-32/3.", None),
    ("c", r"$t=\frac{3k\pi}4$ 时取最大值 $\frac32$；$t=\frac{3\pi}8+\frac{3k\pi}4$ 时取最小值 $-\frac32$。",
     True, "The arguments are respectively 2kpi and pi+2kpi.", None),
    ("d", r"全部零点为 $x=\frac{7\pi}{48}+\frac{3k\pi}8$，这些点也都是拐点。",
     True, "Argument pi/2+kpi yields t=3pi/16+3kpi/8; subtract pi/24; f'' changes sign there.", None),
    ("e", r"在 $t\in(\frac{3k\pi}4,\frac{3\pi}8+\frac{3k\pi}4)$ 上递减，在 $t\in(\frac{3\pi}8+\frac{3k\pi}4,\frac{3\pi}4+\frac{3k\pi}4)$ 上递增。",
     True, "On these open half cycles sine has respectively positive and negative signs, so f' has opposite signs.", None),
    ("f", r"在 $t\in(-\frac{3\pi}{16}+\frac{3k\pi}4,\frac{3\pi}{16}+\frac{3k\pi}4)$ 上 $f''<0$；在 $t\in(\frac{3\pi}{16}+\frac{3k\pi}4,\frac{9\pi}{16}+\frac{3k\pi}4)$ 上 $f''>0$。",
     True, "These argument intervals are (-pi/2,pi/2) and (pi/2,3pi/2) modulo 2pi; f'' is negative cosine.", None),
    ("g", r"$f(0)=\frac32\cos\frac\pi9$；曲线的全部竖直对称轴为 $x=-\frac\pi{24}+\frac{3k\pi}8$，但函数关于原点既非奇函数也非偶函数。",
     True, "The intercept is direct; cosine symmetry axes have argument kpi. The intercept excludes oddness and f'(0)=-4sin(pi/9)!=0 excludes evenness.", None),
    ("h", r"一个周期内按 $t=0,\frac{3\pi}{16},\frac{3\pi}8,\frac{9\pi}{16},\frac{3\pi}4$ 依次有函数值 $\frac32,0,-\frac32,0,\frac32$；曲线以每个零点为中心旋转 $180^\circ$ 后重合。",
     True, "Quarter-cycle arguments are 0,pi/2,pi,3pi/2,2pi; around cosine's zero the function is odd in displacement.", None),
    ("i", r"最小正周期为 $\frac{16\pi}3$。",
     False, "At t=0 a shift of 16pi/3 has argument change 128pi/9, not a multiple of 2pi.", "Multiply 2pi by frequency 8/3 instead of dividing."),
    ("j", r"$f'(x)=-\frac32\sin(\frac83t)$。",
     False, "At t=3pi/16 this gives -3/2 rather than -4.", "Differentiate cosine without its inner coefficient 8/3."),
    ("k", r"全部零点为 $x=-\frac\pi{24}+\frac{3k\pi}4$。",
     False, "At each claimed zero the cosine argument is 2kpi and f=3/2.", "Locate cosine zeros at full-turn arguments instead of odd quarter-turn arguments."),
], graph_loss + ("题面给出平移坐标 t；独立发现该坐标变换的能力不由本题证明。",))
question(349, "", "multiple",
         r"对 $g(x)=3\cos(\frac53x+\frac\pi{12})$ 作导数及图象分析。记 $t=x+\frac\pi{20}$。以下哪些结论成立？各式中 $k\in\mathbb Z$。",
         "Recognize the complete derivative and graph profile of the second frequency.",
         "A coordinated multiple-response unit preserves graph landmarks and derivative sign relationships, not independent drawing.", [
    ("a", r"定义域为 $\mathbb R$，值域为 $[-3,3]$，最小正周期为 $\frac{6\pi}5$。",
     True, "A=3, T=2pi/(5/3)=6pi/5.", None),
    ("b", r"$g'(x)=-5\sin(\frac53t)$，$g''(x)=-\frac{25}3\cos(\frac53t)$。",
     True, "Coefficients are -3(5/3)=-5 and -5(5/3)=-25/3.", None),
    ("c", r"$t=\frac{6k\pi}5$ 时取最大值 $3$；$t=\frac{3\pi}5+\frac{6k\pi}5$ 时取最小值 $-3$。",
     True, "Corresponding arguments are 2kpi and pi+2kpi.", None),
    ("d", r"全部零点为 $x=\frac\pi4+\frac{3k\pi}5$，这些点也都是拐点。",
     True, "Zeros at t=3pi/10+3kpi/5 become x=pi/4+3kpi/5; g'' changes sign.", None),
    ("e", r"在 $t\in(\frac{6k\pi}5,\frac{3\pi}5+\frac{6k\pi}5)$ 上递减，在 $t\in(\frac{3\pi}5+\frac{6k\pi}5,\frac{6\pi}5+\frac{6k\pi}5)$ 上递增。",
     True, "The negative-sine derivative is negative then positive over the two half cycles.", None),
    ("f", r"在 $t\in(-\frac{3\pi}{10}+\frac{6k\pi}5,\frac{3\pi}{10}+\frac{6k\pi}5)$ 上 $g''<0$；在 $t\in(\frac{3\pi}{10}+\frac{6k\pi}5,\frac{9\pi}{10}+\frac{6k\pi}5)$ 上 $g''>0$。",
     True, "These are the cosine-positive and cosine-negative argument half cycles; g'' reverses their signs.", None),
    ("g", r"$g(0)=\frac{3(\sqrt6+\sqrt2)}4$；曲线的全部竖直对称轴为 $x=-\frac\pi{20}+\frac{3k\pi}5$，但函数关于原点既非奇函数也非偶函数。",
     True, "Use cos15 degrees=(sqrt6+sqrt2)/4; axes have argument kpi; nonzero intercept and nonzero derivative at 0 exclude oddness and evenness.", None),
    ("h", r"一个周期内按 $t=0,\frac{3\pi}{10},\frac{3\pi}5,\frac{9\pi}{10},\frac{6\pi}5$ 依次有函数值 $3,0,-3,0,3$；曲线以每个零点为中心旋转 $180^\circ$ 后重合。",
     True, "Evaluate at consecutive quarter cycles; translated cosine is odd around each zero crossing.", None),
    ("i", r"最小正周期为 $\frac{10\pi}3$。",
     False, "At t=0 that shift changes the argument by 50pi/9, not 2kpi.", "Multiply 2pi by 5/3 instead of dividing."),
    ("j", r"$g''(x)=+\frac{25}3\cos(\frac53t)$。",
     False, "At t=0 the actual second derivative is -25/3.", "Lose the negative sign when differentiating the first negative sine derivative."),
    ("k", r"全部最大值点为 $x=-\frac\pi{12}+\frac{6k\pi}5$。",
     False, "At k=0 the argument is -pi/18, so cos is strictly less than 1.", "Use negative phase itself as the horizontal shift instead of dividing it by 5/3."),
], graph_loss + ("题面给出平移坐标 t；独立发现该坐标变换的能力不由本题证明。",))
question(350, "", "single",
         r"判断 $y=\cos(2x-\frac\pi4)$ 是否在整个 $\mathbb R$ 上满足 $y''=-4y$。下列哪组求导和判断成立？",
         "Verify the differential equation globally by computing both derivatives.",
         "The derivative chain and its global equation judgment form a single decisive verification.", [
    ("a", r"$y'=-2\sin(2x-\frac\pi4)$，$y''=-4\cos(2x-\frac\pi4)$；满足方程。",
     True, "Two chain derivatives produce -2sin u and -4cos u, so y''=-4y for every real x.", None),
    ("b", r"$y'=-2\sin(2x-\frac\pi4)$，$y''=4\cos(2x-\frac\pi4)$；不满足方程。",
     False, "The second derivative has a minus sign; at x=pi/8 it is -4 rather than +4.", "Negate the derivative of sine a second time, cancelling the existing minus incorrectly."),
    ("c", r"$y'=-\sin(2x-\frac\pi4)$，$y''=-2\cos(2x-\frac\pi4)$；不满足方程。",
     False, "The first derivative omitted the inner factor 2, leaving the second derivative coefficient half as large.", "Apply the chain rule only on the second differentiation."),
], ("识别完整验证，不证明独立书写微分方程验证。",))
question(351, "", "single",
         r"将 $y=2(\sin\frac\pi4\sin2x+\cos\frac\pi4\cos2x)$ 写成单个谐振动方程。哪个式子对所有实数 $x$ 等价？",
         "Use cosine subtraction to combine two harmonic terms.",
         "One full harmonic expression tests the coefficient signs and frequency.", [
    ("a", r"$y=2\cos(2x+\frac\pi4)$", False, "At x=pi/4 it is -sqrt2 instead of +sqrt2.", "Use the cosine addition identity for a sum with a positive sine product."),
    ("b", r"$y=2\cos(2x-\frac\pi4)$", True, "cos(U-V)=cos U cos V+sin U sin V.", None),
    ("c", r"$y=\cos(2x-\frac\pi4)$", False, "At x=pi/8 it gives 1 instead of 2.", "Combine the trigonometric products and omit the outside coefficient 2."),
])
question(352, "", "single",
         r"设 $u=3x+\frac\pi{12}$，$\delta=\operatorname{arctg}\frac34$。将 $y=3\cos u+4\sin u$ 写成单个谐振动方程，哪个式子等价？",
         "Combine unequal sine/cosine coefficients with the correct norm and phase.",
         "A full harmonic representation preserves amplitude and both coefficient relationships.", [
    ("a", r"$y=5\sin(u-\delta)$", False, "Expansion is 4sin u-3cos u; at u=0 it gives -3 instead of 3.", "Use subtraction instead of addition for the phase while keeping the positive cosine coefficient."),
    ("b", r"$y=7\sin(u+\delta)$", False, "At u=0 this is 21/5 instead of 3.", "Use amplitude 3+4 instead of sqrt(3^2+4^2)."),
    ("c", r"$y=5\sin(u+\delta)$", True, "cos delta=4/5 and sin delta=3/5; expansion recovers both coefficients.", None),
])
question(353, "", "single",
         r"将 $y=\frac12(\cos x-\sin x)$ 写成单个谐振动方程。哪个式子对所有实数 $x$ 等价？",
         "Normalize equal but oppositely signed coefficients.",
         "The full expression assesses amplitude and phase together.", [
    ("a", r"$y=\frac{\sqrt2}{2}\cos(x+\frac\pi4)$", True, "Expansion gives (cos x-sin x)/2.", None),
    ("b", r"$y=\frac12\cos(x+\frac\pi4)$", False, "At x=0 it gives sqrt2/4 rather than 1/2.", "Keep the magnitude of one coefficient as the combined amplitude."),
    ("c", r"$y=\frac{\sqrt2}{2}\cos(x-\frac\pi4)$", False, "At x=pi/2 this is +1/2 rather than -1/2.", "Use cosine subtraction and thereby give the sine coefficient the wrong sign."),
])
question(354, "", "single",
         r"将 $y=3\sin(2x)$ 写成正振幅的单个余弦谐振动方程。哪个式子对所有实数 $x$ 等价？",
         "Recognize a nontrivial equivalent harmonic normalization rather than copy the source sine.",
         "A sine-to-cosine phase transformation preserves the source's whole oscillation.", [
    ("a", r"$y=3\cos(2x+\frac\pi2)$", False, "cos(u+pi/2)=-sin u; at x=pi/4 this is -3.", "Use a positive quarter-turn instead of the required negative quarter-turn."),
    ("b", r"$y=3\cos(2x-\frac\pi2)$", True, "cos(u-pi/2)=sin u.", None),
    ("c", r"$y=3\cos(x-\frac\pi2)$", False, "At x=pi/2 this is 3 while the source is 0.", "Correctly convert sine to cosine but drop the argument frequency 2."),
])
question(355, "", "single",
         r"将 $y=4-8\cos^2x$ 写成单个谐振动方程。哪个式子对所有实数 $x$ 等价？",
         "Eliminate the squared cosine and cancel the constant offset.",
         "One full harmonic form tests the double-angle conversion and remaining sign.", [
    ("a", r"$y=4\cos(2x)$", False, "At x=0 the source is -4, not +4.", "Drop the negative sign after the constant terms cancel."),
    ("b", r"$y=-8\cos(2x)$", False, "At x=0 it is -8 instead of -4.", "Apply the half factor to the constant term but not to the doubled-angle term."),
    ("c", r"$y=4\cos(2x+\pi)$", True, "4-8(1+cos2x)/2=-4cos2x=4cos(2x+pi).", None),
])
question(356, "", "single",
         r"设 $\delta=\operatorname{arctg}(2\sqrt3)$，将 $y=-2\sin x-4\sqrt3\cos x$ 写成正振幅的单个正弦谐振动方程。哪个式子等价？",
         "Combine coefficients with the correct amplitude and phase quadrant.",
         "A full normalized equation checks both negative coefficients at once.", [
    ("a", r"$y=2\sqrt{13}\sin(x+\delta-\pi)$", True, "sin(delta-pi)=-2sqrt3/sqrt13 and cos(delta-pi)=-1/sqrt13; expansion gives -2sin x-4sqrt3cos x.", None),
    ("b", r"$y=2\sqrt{13}\sin(x+\delta)$", False, "Expansion gives +2sin x+4sqrt3cos x, the negative of the source.", "Choose the first-quadrant phase and omit the pi shift required for two negative coefficients."),
    ("c", r"$y=2\sqrt{13}\sin(x-\delta)$", False, "Expansion gives +2sin x-4sqrt3cos x; at x=pi/2 it is +2 rather than -2.", "Negate only the phase to fix cosine's coefficient, leaving sine's coefficient positive."),
])
