# Independent Modern Text Review

Status: PASS: first independent new modern TEXT semantic review only
Lesson: ana10-c8-s2-n114; reviewer: Codex SessionB; independent of the frozen author; date: 2026-11-17

## Scope

Read every complete source and modern prose block, their order and surrounding explanations. Judge the actual new text for clarity, format and meaning. Literal comparison and hash receipts support this judgment, not substitute for it. Do not repeat prior source-pixel or independent mathematical proof reviews.

All 28 modern prose blocks retain the source's introduction, seven natural-logarithm properties, proof sequence, definition of e, inverse exponential and general-base conclusion. There is no added marketing, replacement explanation, lost condition, new exercise, figure or unfinished next-unit text. The only text changes are authorized outside-math layout, four enumeration-label conversions with both references in subpart d), and the one registered replacement in prose[27].

Lesson identity, title and starred printed title, number 114, null chapter/section, physical/printed start pages, prose order, kind/id/label/printed_page/source_refs, and literal source_text are retained. The empty exercise object keeps its lesson, count and empty exercises; no group, number or exercise entry exists to be renamed. The modern figure object names this same lesson and has no figure entries.

New text failures: none. Exact repairs: none. Author templates and canonical files: unchanged.

## Section Breaks

### Boundary 0

The end of the integral-definition introduction is followed by the first basic property. This is a real conceptual transition, not a break inside a formula or proof.
Exact saved first-flow boundary joining reported paragraphs 4 and 5, including the newline after the colon in the after anchor. No flow rerun or hand-derived anchor.

```json
{
  "before": "可以把等式（1）当作函数 $\\ln$ 的定义. 我们从定义（1）出发，引出函数 $\\ln$ 的基本性质.",
  "after": "1. 函数 $\\ln$ 在区间 $]0,\\infty[$ 内每一点都可以微分. 事实上，根据第 102 小节中的（1）式：\n$\\ln' x=\\left(\\int_1^x\\frac{1}{t}dt\\right)'=\\frac{1}{x}$.在任何一点可以微分的函数在这一点是连续的（九年级第 45 小节）. 于是，函数 $\\ln$ 在区间 $]0,\\infty[$ 内每一点都连续."
}
```

### Boundary 1

The unbounded-range argument has finished before the corollary defines e and introduces the inverse exponential. The transition leaves the argument intact.
Exact saved first-flow boundary joining reported paragraphs 24 and 25, with the bold corollary marker intact. No flow rerun or hand-derived anchor.

```json
{
  "before": "考虑到 $\\ln2^n=n\\ln2$ 和 $\\ln2^{-n}=-n\\ln2$，$n\\in N$，如果这样来选取自然数 $n$，使得不等式 $n>\\frac{M}{\\ln2}$ 成立，那么取 $x_1=2^n$ 和$x_2=2^{-n}$ 就行了. 于是$\\ln x_1=\\ln2^n=n\\ln2>M$，$\\ln x_2=\\ln2^{-n}=-n\\ln2<-M$.",
  "after": "**推论** 存在数 $e\\in R_+$，使得 $\\ln e=1$. 我们得到你们已经熟悉的数 $e=2.718\\cdots$ 的新定义."
}
```

## Registered Erratum

Exactly p0171-exp-base-definition applies to lesson.prose[27], sourced from physical page 171 / printed page 165, block p0171#5. The actual page JSON and PDF hashes match the modern record. The faithful page block, source lesson, embedded source data and source_text retain exp_a on BOTH sides. Only the displayed modern right-hand exp loses its subscript, giving the registered exp_a(x)=exp(x*ln(a)) formula with its exact original LaTeX tokens. The existing independent proof is not repeated or re-qualified here.

Original: `$\exp_a(x)=\exp_a(x\cdot\ln a)$`
Modern: `$\exp_a(x)=\exp(x\cdot\ln a)$`

## Full Per-Prose Review

### prose[0]

Source refs: p0168#2; printed page 162.
Source UTF-8: 428 bytes; SHA-256 62214e4eb0028b1733a66d8bb0e1fa89b89aa475f0df4a2bd2f51d4ed97acf6e
Modern UTF-8: 428 bytes; SHA-256 62214e4eb0028b1733a66d8bb0e1fa89b89aa475f0df4a2bd2f51d4ed97acf6e

Source:

我们还记得，在我们的教材里，指数函数和对数函数是按下述方式引入的. 根据已知的法则，对于任何的 $a>0$，$a\ne1$，在有理数集上定义指数函数 $a^x$. 然后不作证明而承认可以用唯一的方式“扩充”这个函数，使得所得到的函数在实数集上有定义并且连续. 最后，作为函数 $a^x$ 的反函数，引入以 $a$ 为底的对数函数 $\log_a$.

Modern:

我们还记得，在我们的教材里，指数函数和对数函数是按下述方式引入的. 根据已知的法则，对于任何的 $a>0$，$a\ne1$，在有理数集上定义指数函数 $a^x$. 然后不作证明而承认可以用唯一的方式“扩充”这个函数，使得所得到的函数在实数集上有定义并且连续. 最后，作为函数 $a^x$ 的反函数，引入以 $a$ 为底的对数函数 $\log_a$.

Judgment: PASS

The paragraph recounts the original rational-exponent construction, the assumed unique continuous extension to real arguments, and the inverse definition of logarithm. It still distinguishes an admitted assumption from a proved result and retains both base conditions.

The ordered account is intact and reads as one introduction. All four sentences and their formulas remain literal; no unfamiliar modern claim or explanatory insertion was added.

### prose[1]

Source refs: p0168#3; printed page 162.
Source UTF-8: 209 bytes; SHA-256 5f869f4385e591ccd8b907060a18f840486c9033ec825a2d69ced5b324823b58
Modern UTF-8: 209 bytes; SHA-256 5f869f4385e591ccd8b907060a18f840486c9033ec825a2d69ced5b324823b58

Source:

上面所指出的缺陷有可能弥补，但同时必须克服相当大的技术上和原则上的困难. 对于在第 109 小节中推导指数函数的导函数公式时所采用的假设，也是同样的.

Modern:

上面所指出的缺陷有可能弥补，但同时必须克服相当大的技术上和原则上的困难. 对于在第 109 小节中推导指数函数的导函数公式时所采用的假设，也是同样的.

Judgment: PASS

The caveat still refers back to the preceding unproved extension and to the assumption used in section 109. The transition toward a different construction has not been weakened or overstated.

Both sentences and the historical section number remain unchanged. The short paragraph connects naturally to prose[0] and prose[2].

### prose[2]

Source refs: p0168#4; printed page 162.
Source UTF-8: 167 bytes; SHA-256 044c3c3e9c626ab28873e616397606f12b1d863f88ba0420508dc1c2a1cff318
Modern UTF-8: 167 bytes; SHA-256 044c3c3e9c626ab28873e616397606f12b1d863f88ba0420508dc1c2a1cff318

Source:

还有另一种引入指数函数和对数函数的方法，它在较大的程度上克服了上面指出的缺点. 这种方法的根据是公式$\ln' x=\frac{1}{x}$.

Modern:

还有另一种引入指数函数和对数函数的方法，它在较大的程度上克服了上面指出的缺点. 这种方法的根据是公式$\ln' x=\frac{1}{x}$.

Judgment: PASS

The alternative construction is introduced through the natural-logarithm derivative, not a new definition of a different function. The quoted derivative and the qualification about overcoming the earlier defects are preserved.

The two sentences provide a clear bridge into the integral construction. The formula remains inline and literal, including the source's tight spacing.

### prose[3]

Source refs: p0168#5; printed page 162.
Source UTF-8: 244 bytes; SHA-256 401ed4a87fa2aaa80c402d998926eb3ee58f7c2d664367a174ece8f2b46f1eb4
Modern UTF-8: 242 bytes; SHA-256 75e8b00f5b72156d0839aebf107a3b7204b58d88133e9ab24e497882ad4c2b98

Source:

由这个公式得出，函数 $\ln$ 是函数 $\frac{1}{x}$ 在区间 $]0,\infty[$ 上的一个原函数. 更确切地说，当 $x=1$ 时，这个原函数取值为 0. 于是（参看第 102 小节），$\ln x=\int_1^x\frac{1}{t}dt$.　（1）

Modern:

由这个公式得出，函数 $\ln$ 是函数 $\frac{1}{x}$ 在区间 $]0,\infty[$ 上的一个原函数. 更确切地说，当 $x=1$ 时，这个原函数取值为 0. 于是（参看第 102 小节），$\ln x=\int_1^x\frac{1}{t}dt$. （1）

Judgment: PASS

The antiderivative on the positive open interval is normalized by its value at 1, leading to the variable-upper-limit integral. The lower limit, integrand, variable and equation label (1) remain unchanged.

Replacing the wide space before the equation label is layout only. The formula is not detached from the cited normalization or the section 102 reference.

### prose[4]

Source refs: p0168#6; printed page 162.
Source UTF-8: 118 bytes; SHA-256 1467614575a0514e7ed0a8a57238b6d42091dd6527ffe286b3a96ae6214f4c71
Modern UTF-8: 118 bytes; SHA-256 1467614575a0514e7ed0a8a57238b6d42091dd6527ffe286b3a96ae6214f4c71

Source:

可以把等式（1）当作函数 $\ln$ 的定义. 我们从定义（1）出发，引出函数 $\ln$ 的基本性质.

Modern:

可以把等式（1）当作函数 $\ln$ 的定义. 我们从定义（1）出发，引出函数 $\ln$ 的基本性质.

Judgment: PASS

Equation (1) is now explicitly adopted as a definition, followed by a plan to derive basic properties. It is not presented as an already independent proof of those properties.

The short pivot paragraph is unchanged. Its end supplies the exact first section-break before the property list.

### prose[5]

Source refs: p0168#7, p0169#1; printed page 162.
Source UTF-8: 333 bytes; SHA-256 8afa489381e9a243265f15a27bc1a719cf8900971df7d29aaab4eee118dd622e
Modern UTF-8: 334 bytes; SHA-256 0a4208ff19afbae3e5973dc77bd10578be3ceeb7144e3241634a6b7935183166

Source:

1. 函数 $\ln$ 在区间 $]0,\infty[$ 内每一点都可以微分. 事实上，根据第 102 小节中的（1）式：$\ln' x=\left(\int_1^x\frac{1}{t}dt\right)'=\frac{1}{x}$.在任何一点可以微分的函数在这一点是连续的（九年级第 45 小节）. 于是，函数 $\ln$ 在区间 $]0,\infty[$ 内每一点都连续.

Modern:

1. 函数 $\ln$ 在区间 $]0,\infty[$ 内每一点都可以微分. 事实上，根据第 102 小节中的（1）式：
$\ln' x=\left(\int_1^x\frac{1}{t}dt\right)'=\frac{1}{x}$.在任何一点可以微分的函数在这一点是连续的（九年级第 45 小节）. 于是，函数 $\ln$ 在区间 $]0,\infty[$ 内每一点都连续.

Judgment: PASS

Property 1 retains differentiability at every positive argument, the derivative calculation from the integral, and the resulting continuity. Its cross-page continuation and earlier differentiation-to-continuity citation remain complete.

The new newline follows the introducing colon, not a split in the derivative expression. All explanatory sentences remain in their original order; the formula-to-next-sentence spacing is inherited.

### prose[6]

Source refs: p0169#2; printed page 163.
Source UTF-8: 113 bytes; SHA-256 f50ad6188f8d3e0b055738d868fd4a03303e6cdcbef15a7b65a4f99aedd3624f
Modern UTF-8: 113 bytes; SHA-256 f50ad6188f8d3e0b055738d868fd4a03303e6cdcbef15a7b65a4f99aedd3624f

Source:

2. 函数 $\ln$ 在区间 $]0,\infty[$ 上上升. 实际上，在区间 $]0,\infty[$上，$\ln' x=\frac{1}{x}>0$.

Modern:

2. 函数 $\ln$ 在区间 $]0,\infty[$ 上上升. 实际上，在区间 $]0,\infty[$上，$\ln' x=\frac{1}{x}>0$.

Judgment: PASS

Property 2 still infers increase on the positive open interval from the strictly positive derivative. The inequality and domain are not changed to non-strict versions.

The numbered statement and its reason remain together. French interval notation and the source's wording for increase remain literal and understandable in context.

### prose[7]

Source refs: p0169#3; printed page 163.
Source UTF-8: 34 bytes; SHA-256 b74fb87b746eacc171b0aae5620eb30cc8a099b4df723760c5dad6a233e8dadb
Modern UTF-8: 34 bytes; SHA-256 b74fb87b746eacc171b0aae5620eb30cc8a099b4df723760c5dad6a233e8dadb

Source:

3. $\ln1=\int_1^1\frac{1}{x}dx=0$.

Modern:

3. $\ln1=\int_1^1\frac{1}{x}dx=0$.

Judgment: PASS

Property 3 supplies the zero value at argument 1 by the equal-limit integral. Neither endpoint, integrand nor zero has changed.

A short numbered formula is a complete statement here. Its punctuation is outside the math delimiters and no explanatory text has been removed.

### prose[8]

Source refs: p0169#4; printed page 163.
Source UTF-8: 77 bytes; SHA-256 b0c31e898d4d1b6db70430fd6585cb6976b41f2417cc43ce520583466ea769a7
Modern UTF-8: 77 bytes; SHA-256 b0c31e898d4d1b6db70430fd6585cb6976b41f2417cc43ce520583466ea769a7

Source:

4.（加法定理.）对于任何的 $a>0$ 和 $b>0$，$\ln(ab)=\ln a+\ln b$.

Modern:

4.（加法定理.）对于任何的 $a>0$ 和 $b>0$，$\ln(ab)=\ln a+\ln b$.

Judgment: PASS

Property 4 states the product-to-sum identity for two positive factors. The name, conditions, product and both logarithm terms are preserved.

The theorem statement is distinguishable from the proof that follows. Its numbering and punctuation are source-literal.

### prose[9]

Source refs: p0169#5; printed page 163.
Source UTF-8: 51 bytes; SHA-256 3f2539bd869a2b3afcce575633a609df54efbed4fd6e5c10631bd60eb425fec2
Modern UTF-8: 51 bytes; SHA-256 3f2539bd869a2b3afcce575633a609df54efbed4fd6e5c10631bd60eb425fec2

Source:

为了证明它，我们讨论函数$g(x)=\ln(ax)$.

Modern:

为了证明它，我们讨论函数$g(x)=\ln(ax)$.

Judgment: PASS

The auxiliary function g is still introduced to prove property 4. The base parameter a is the previously quantified positive factor, not a newly unrestricted constant.

The introductory sentence directly precedes its derivative calculation. The single inline definition has not been displaced or renamed.

### prose[10]

Source refs: p0169#6; printed page 163.
Source UTF-8: 129 bytes; SHA-256 eda72f3c41d44e12c9988be33e074c8ebcf4cf670c94bdfb96f03a534de1166c
Modern UTF-8: 130 bytes; SHA-256 55203682ff9492197da8734a940fd327410684caf904ab4a0dd051337bfb3d09

Source:

它的导函数 $g'$ 根据复合函数的导函数公式计算：$g'(x)=\frac{1}{ax}\cdot(ax)'=\frac{1}{ax}\cdot a=\frac{1}{x}$.

Modern:

它的导函数 $g'$ 根据复合函数的导函数公式计算：
$g'(x)=\frac{1}{ax}\cdot(ax)'=\frac{1}{ax}\cdot a=\frac{1}{x}$.

Judgment: PASS

The chain-rule calculation retains every intermediate factor and its final 1/x. The modern layout neither drops the derivative of ax nor changes the role of g'.

The explanatory colon now leads to the intact formula on the next line. The following paragraph can still refer to that result without a missing step.

### prose[11]

Source refs: p0169#7; printed page 163.
Source UTF-8: 113 bytes; SHA-256 15a4e77a6ada3b2a911a6815fc397942c1ce5f669fe6487c9dc5342c1288c8d6
Modern UTF-8: 113 bytes; SHA-256 15a4e77a6ada3b2a911a6815fc397942c1ce5f669fe6487c9dc5342c1288c8d6

Source:

因此，函数 $\ln(ax)$ 是函数 $\frac{1}{x}$ 的一个原函数，于是可以把它写成$\ln(ax)=\ln x+C$.

Modern:

因此，函数 $\ln(ax)$ 是函数 $\frac{1}{x}$ 的一个原函数，于是可以把它写成$\ln(ax)=\ln x+C$.

Judgment: PASS

The common antiderivative argument yields ln(ax)=ln x+C with a constant term. The text has not falsely treated the two functions as equal without that constant.

The reason and displayed identity remain in one unchanged sentence. The paragraph prepares the next substitution clearly.

### prose[12]

Source refs: p0169#8; printed page 163.
Source UTF-8: 91 bytes; SHA-256 18e40d890bafd5f0d6fc1759699066200a4fe34e61493bffb092fede5c1c5ce2
Modern UTF-8: 91 bytes; SHA-256 18e40d890bafd5f0d6fc1759699066200a4fe34e61493bffb092fede5c1c5ce2

Source:

代入等式 $x=1$，得 $\ln a=\ln1+C$，因此 $C=\ln a$. 于是，$\ln(ax)=\ln a+\ln x$.

Modern:

代入等式 $x=1$，得 $\ln a=\ln1+C$，因此 $C=\ln a$. 于是，$\ln(ax)=\ln a+\ln x$.

Judgment: PASS

Substituting x=1 determines C as ln a and then supplies the full product relation. The normalization from property 3 and the signs are retained.

The substitution, determination of C and resulting formula remain ordered. There is no layout-induced detachment of a conclusion from its preceding equality.

### prose[13]

Source refs: p0169#9; printed page 163.
Source UTF-8: 37 bytes; SHA-256 89b45f0714c0c5ee8e4617804cb2bdf61c92c06fedef5f4cb9f838d96226e9fa
Modern UTF-8: 37 bytes; SHA-256 89b45f0714c0c5ee8e4617804cb2bdf61c92c06fedef5f4cb9f838d96226e9fa

Source:

设 $x=b$，得$\ln(ab)=\ln a+\ln b$.

Modern:

设 $x=b$，得$\ln(ab)=\ln a+\ln b$.

Judgment: PASS

The proof specializes x to b and recovers the statement of property 4. No variable, factor or logarithm term is changed.

The short concluding sentence closes the proof before the generalization. Its source-literal tight spacing does not introduce a new ambiguity.

### prose[14]

Source refs: p0169#10; printed page 163.
Source UTF-8: 149 bytes; SHA-256 7001e1a3b70fa3bcca0d17f3d6edac7feab2e58a4dc734fa123851f53f636e0d
Modern UTF-8: 149 bytes; SHA-256 7001e1a3b70fa3bcca0d17f3d6edac7feab2e58a4dc734fa123851f53f636e0d

Source:

利用数学归纳法容易证明，对于任何正数 $a_1,a_2,\cdots,a_n$，$\ln(a_1\cdot a_2\cdot\ldots\cdot a_n)=\ln a_1+\ln a_2+\cdots+\ln a_n$.

Modern:

利用数学归纳法容易证明，对于任何正数 $a_1,a_2,\cdots,a_n$，$\ln(a_1\cdot a_2\cdot\ldots\cdot a_n)=\ln a_1+\ln a_2+\cdots+\ln a_n$.

Judgment: PASS

The product rule is generalized to n positive factors by the stated induction method. Indices, factor list, summands and both ellipsis styles remain as in the source.

The full statement remains complete in its own paragraph. It does not silently turn the finite product into an infinite one.

### prose[15]

Source refs: p0169#11, p0170#1; printed page 163.
Source UTF-8: 179 bytes; SHA-256 79c2ffa2a53d4275cfc2e6c9825eed5b38dbfdd83d09f3250df6144e6ffafb4f
Modern UTF-8: 179 bytes; SHA-256 79c2ffa2a53d4275cfc2e6c9825eed5b38dbfdd83d09f3250df6144e6ffafb4f

Source:

5. 对于任何正数 $a$ 和 $b$，$\ln\frac{a}{b}=\ln a-\ln b$.实际上，$\ln a=\ln\left(\frac{a}{b}\cdot b\right)=\ln\frac{a}{b}+\ln b$.于是，$\ln\frac{a}{b}=\ln a-\ln b$.

Modern:

5. 对于任何正数 $a$ 和 $b$，$\ln\frac{a}{b}=\ln a-\ln b$.实际上，$\ln a=\ln\left(\frac{a}{b}\cdot b\right)=\ln\frac{a}{b}+\ln b$.于是，$\ln\frac{a}{b}=\ln a-\ln b$.

Judgment: PASS

Property 5 retains the quotient rule, its product-rule justification, and the final rearrangement. Its cross-page source continuation has neither lost the divisor nor reversed the subtraction.

The numbered statement and both proof sentences remain in their original sequence. Adjacent formulas and ASCII full stops are inherited, not a new truncation.

### prose[16]

Source refs: p0170#2; printed page 164.
Source UTF-8: 51 bytes; SHA-256 96b2cf5405972b7a9af2bfde005c34535b45d3846c488d14d8e7aa568cae7f85
Modern UTF-8: 51 bytes; SHA-256 96b2cf5405972b7a9af2bfde005c34535b45d3846c488d14d8e7aa568cae7f85

Source:

6. 对于 $x>0$ 并且 $r\in Q$，$\ln x^r=r\ln x$.

Modern:

6. 对于 $x>0$ 并且 $r\in Q$，$\ln x^r=r\ln x$.

Judgment: PASS

Property 6 is explicitly limited to positive x and rational r. The exponent identity has not been extended to arbitrary real r at this point.

The condition and claim are legible together as the next numbered property. The formula remains exactly literal.

### prose[17]

Source refs: p0170#3; printed page 164.
Source UTF-8: 28 bytes; SHA-256 6d2a0b43c48f14cf8efa03d1b613d17b2f4eefa4fde1f479e55e6dfd3c4e90c0
Modern UTF-8: 28 bytes; SHA-256 6d2a0b43c48f14cf8efa03d1b613d17b2f4eefa4fde1f479e55e6dfd3c4e90c0

Source:

我们分几步进行证明.

Modern:

我们分几步进行证明.

Judgment: PASS

The one-sentence plan signals a multistep proof of property 6, not a separate result. It still introduces the following four cases.

The complete introductory sentence is retained. The modern subpart sequence follows immediately and is consistent with that plan.

### prose[18]

Source refs: p0170#4; printed page 164.
Source UTF-8: 86 bytes; SHA-256 7165577db6eeab9227765da4c646db2fdf6a2afcbc88c0e447a200deca9f6509
Modern UTF-8: 86 bytes; SHA-256 0afbe9fa80b4421dfdc6b4b5a2e1b057080830fec8cf6170fddde7f5a7f7bc37

Source:

а) 对于 $r=0$ 和 $r=1$：$\ln x^0=\ln1=0=0\cdot\ln x$.$\ln x^1=\ln x=1\cdot\ln x$.

Modern:

a) 对于 $r=0$ 和 $r=1$：
$\ln x^0=\ln1=0=0\cdot\ln x$.$\ln x^1=\ln x=1\cdot\ln x$.

Judgment: PASS

The zero and unit exponent cases both remain, with their complete equalities. Cyrillic a is converted only in the enumeration label; no mathematical a, r, x or logarithm token is changed.

The a) condition introduces the formulas after a newline. The existing full stop separates the two identities; their inherited same-line arrangement is not a lost or merged case.

### prose[19]

Source refs: p0170#5; printed page 164.
Source UTF-8: 147 bytes; SHA-256 577513f63a4762e7bb8e29f2b5f96ca8ef001c4c534cfa8225e1e73755ec400d
Modern UTF-8: 147 bytes; SHA-256 20f6d24b6b9c67fc40da2a62c327929fecfe6025d3773cdbcbe8304a5f4b0c43

Source:

б) 对于自然数 $r>1$：$\ln x^r=\ln(\underbrace{x\cdots x}_{r\text{ 个因数}})=\underbrace{\ln x+\ln x+\cdots+\ln x}_{r\text{ 项}}=r\ln x$.

Modern:

b) 对于自然数 $r>1$：
$\ln x^r=\ln(\underbrace{x\cdots x}_{r\text{ 个因数}})=\underbrace{\ln x+\ln x+\cdots+\ln x}_{r\text{ 项}}=r\ln x$.

Judgment: PASS

The natural-number case r>1 retains the repeated product and sum with their r-factor and r-term annotations. No underbrace content or exponent is altered.

The converted b) label occupies the condition line and the full formula follows it. The annotation text remains within the exact source LaTeX.

### prose[20]

Source refs: p0170#6; printed page 164.
Source UTF-8: 150 bytes; SHA-256 b4dcd6633bdc70b4152867a520b0d99d508c54d3e3553c6bc8c88d46b43bd831
Modern UTF-8: 150 bytes; SHA-256 4604f653023b5093dca45e0beff2dff1e5e44c801a87345959d4f480a4632c20

Source:

в) 对于负整数 $r$，就是 $r=-n$，这里 $n$ 是自然数，利用性质 5，得到：$\ln x^r=\ln\frac{1}{x^n}=\ln1-\ln x^n=0-n\ln x=r\ln x$.

Modern:

c) 对于负整数 $r$，就是 $r=-n$，这里 $n$ 是自然数，利用性质 5，得到：
$\ln x^r=\ln\frac{1}{x^n}=\ln1-\ln x^n=0-n\ln x=r\ln x$.

Judgment: PASS

The negative-integer case still writes r=-n and invokes property 5 to reduce it to the preceding positive-integer case. Every reciprocal, minus sign and terminal equality is unchanged.

Cyrillic v is correctly converted to c), not a visually guessed e). The introducing colon and formula newline retain a clear case boundary.

### prose[21]

Source refs: p0170#7; printed page 164.
Source UTF-8: 224 bytes; SHA-256 33e589e1ed344ae4cb68f1e8a35e243fbef4d573f7d6c1264e664549fba3793a
Modern UTF-8: 220 bytes; SHA-256 27a1e94f2a441d93a756315519f555d08f388c0f05f714a74ea76b20be2066d5

Source:

г) 对于 $r=\frac{m}{n}$（$m$ 是整数，$n$ 是自然数），由于 б) 和 в)，得到：$n\ln x^r=n\ln x^{\frac{m}{n}}=\ln\left(x^{\frac{m}{n}}\right)^n=\ln x^m=m\ln x$.于是，　$\ln x^r=\frac{m}{n}\ln x=r\ln x$.

Modern:

d) 对于 $r=\frac{m}{n}$（$m$ 是整数，$n$ 是自然数），由于 b) 和 c)，得到：
$n\ln x^r=n\ln x^{\frac{m}{n}}=\ln\left(x^{\frac{m}{n}}\right)^n=\ln x^m=m\ln x$.于是， $\ln x^r=\frac{m}{n}\ln x=r\ln x$.

Judgment: PASS

The rational case retains r=m/n, the integer/natural-number qualifications and the full calculation. Both references previously naming Cyrillic b) and v) now name b) and c), matching the corresponding modern cases rather than different steps.

The g-to-d label conversion, two reference conversions, formula newline and outside-math wide-space normalization are the only changes. The subsequent 'therefore' identity remains attached to the rational argument.

### prose[22]

Source refs: p0170#8; printed page 164.
Source UTF-8: 14 bytes; SHA-256 f941c006e8b50a5fd794cf4843e4bc42aeab2368061c641e5a8d5fe7975cf300
Modern UTF-8: 14 bytes; SHA-256 f941c006e8b50a5fd794cf4843e4bc42aeab2368061c641e5a8d5fe7975cf300

Source:

7. $E(\ln)=R$.

Modern:

7. $E(\ln)=R$.

Judgment: PASS

Property 7 still states that the value set of ln is R. The range notation has not been confused with its positive domain.

The short numbered claim opens the immediately following argument. Its literal formula and punctuation are retained.

### prose[23]

Source refs: p0170#9, p0171#1; printed page 164.
Source UTF-8: 275 bytes; SHA-256 f66e776d538ec19fca9d725f2ddafb20da782c088557ac7e17190f8a88b19884
Modern UTF-8: 275 bytes; SHA-256 f66e776d538ec19fca9d725f2ddafb20da782c088557ac7e17190f8a88b19884

Source:

函数 $\ln$ 连续. 根据第 84 小节中定理的第一部分，函数值的集合是某一个区间. 因此只要证明这个区间没有上界和下界就够了，也就是对于任何正数 $M$，可以找到这样的 $x_1$ 和$x_2$，使得 $\ln x_1>M$，$\ln x_2<-M$.

Modern:

函数 $\ln$ 连续. 根据第 84 小节中定理的第一部分，函数值的集合是某一个区间. 因此只要证明这个区间没有上界和下界就够了，也就是对于任何正数 $M$，可以找到这样的 $x_1$ 和$x_2$，使得 $\ln x_1>M$，$\ln x_2<-M$.

Judgment: PASS

The continuity-based interval argument still reduces the range claim to finding values above M and below -M for every positive M. Both witnesses, both inequalities and the section 84 reference remain complete across the page seam.

The explanation and quantified goal retain their original order. There is no next-page fragment or lost lower-bound clause.

### prose[24]

Source refs: p0171#2; printed page 165.
Source UTF-8: 252 bytes; SHA-256 52b1b0230a3db2d0c0912c08ef6f247a179e8445f8b7d51f6951e31e67ee1f45
Modern UTF-8: 252 bytes; SHA-256 52b1b0230a3db2d0c0912c08ef6f247a179e8445f8b7d51f6951e31e67ee1f45

Source:

考虑到 $\ln2^n=n\ln2$ 和 $\ln2^{-n}=-n\ln2$，$n\in N$，如果这样来选取自然数 $n$，使得不等式 $n>\frac{M}{\ln2}$ 成立，那么取 $x_1=2^n$ 和$x_2=2^{-n}$ 就行了. 于是$\ln x_1=\ln2^n=n\ln2>M$，$\ln x_2=\ln2^{-n}=-n\ln2<-M$.

Modern:

考虑到 $\ln2^n=n\ln2$ 和 $\ln2^{-n}=-n\ln2$，$n\in N$，如果这样来选取自然数 $n$，使得不等式 $n>\frac{M}{\ln2}$ 成立，那么取 $x_1=2^n$ 和$x_2=2^{-n}$ 就行了. 于是$\ln x_1=\ln2^n=n\ln2>M$，$\ln x_2=\ln2^{-n}=-n\ln2<-M$.

Judgment: PASS

The powers of 2 and their reciprocals supply the two witnesses with the stated choice of n. The positive and negative logarithmic bounds and every exponent are literal.

The construction closes the range argument before the corollary. The exact end of this full paragraph supplies the second section-break anchor.

### prose[25]

Source refs: p0171#3; printed page 165.
Source UTF-8: 120 bytes; SHA-256 2849d600c65a8995ef733f879066b65265e4b2c05785fbed270193c1a49b42d1
Modern UTF-8: 118 bytes; SHA-256 4f661a43834da834b42ba83d74e98ebb05f9bdb7a3de6c615c9a75b8f7410590

Source:

**推论**　存在数 $e\in R_+$，使得 $\ln e=1$. 我们得到你们已经熟悉的数 $e=2.718\cdots$ 的新定义.

Modern:

**推论** 存在数 $e\in R_+$，使得 $\ln e=1$. 我们得到你们已经熟悉的数 $e=2.718\cdots$ 的新定义.

Judgment: PASS

The corollary introduces a positive e with ln e=1 and retains the approximate decimal value. It neither changes the normalization nor claims a terminating decimal identity.

The bold corollary marker survives; only the following wide space is normalized. The paragraph clearly begins the new e/exponential topic.

### prose[26]

Source refs: p0171#4; printed page 165.
Source UTF-8: 193 bytes; SHA-256 beb6b4eebad8fbaf40904410ab519e941e2be3888c45dd1dd5a13f3b04b4053f
Modern UTF-8: 193 bytes; SHA-256 beb6b4eebad8fbaf40904410ab519e941e2be3888c45dd1dd5a13f3b04b4053f

Source:

下面，定义函数 $\exp$ 作为函数 $\ln$ 的反函数，并且证明函数 $\exp$ 具有指数函数的性质 1—3. 由这些性质可以得出，当 $r$是有理数时，$\exp(r)=e^r$.

Modern:

下面，定义函数 $\exp$ 作为函数 $\ln$ 的反函数，并且证明函数 $\exp$ 具有指数函数的性质 1—3. 由这些性质可以得出，当 $r$是有理数时，$\exp(r)=e^r$.

Judgment: PASS

The function exp is introduced as the inverse of ln, followed by the stated plan and rational-exponent consequence. The source's property range 1-3 and rational restriction are retained without a new proof claim.

The paragraph connects the corollary to the general-base definition. The source's literal range dash, sentence order and math tokens remain untouched.

### prose[27]

Source refs: p0171#5; printed page 165.
Source UTF-8: 264 bytes; SHA-256 0a8c202deb266a29c3cc1d0381cb2fc07e9f282306c980cd65e3b4ec505fc8d5
Modern UTF-8: 264 bytes; SHA-256 bb6bfd2a7ecad19e569b97882a51b6eb94602c42d9723afe06ff5216061f87b9

Source:

对于任意底数 $a>0$，$a\ne1$，指数函数 $\exp_a$ 由下面的等式定义：$\exp_a(x)=\exp_a(x\cdot\ln a)$，而以 $a$ 为底的对数函数就定义为函数 $\exp_a$ 的反函数. 在这里，请大家尝试着完成所拟定的讨论函数的计划.

Modern:

对于任意底数 $a>0$，$a\ne1$，指数函数 $\exp_a$ 由下面的等式定义：
$\exp_a(x)=\exp(x\cdot\ln a)$，
而以 $a$ 为底的对数函数就定义为函数 $\exp_a$ 的反函数. 在这里，请大家尝试着完成所拟定的讨论函数的计划.

Judgment: PASS

The modern general-base definition matches the sole registered correction exactly: exp_a on the left, ordinary exp on the right. The base conditions, x*ln(a) argument, inverse-logarithm explanation and invitation to complete the stated discussion remain intact.

Newlines isolate the introduced formula and then resume its explanation. The comma stays outside math; source_text still contains BOTH exp_a terms. No source or old independent proof is modified or re-reviewed.

## Preserved Unknowns

The source's ASCII full stops, tight formula-to-prose spacing, historical section citations, French open-interval notation, and the existing sentence/formula grouping are retained rather than rewritten. The text is readable in that source style; no new ambiguity is introduced by the authorized layout. Pixel fidelity, rendered typography, finalization, publication, DB state and every historical UNKNOWN remain unassessed. Older page notes are preserved as historical notes; the actual current errata array is the binding record.

## Evidence And Stop

Full byte snapshots, per-prose fields and exact math-token comparisons are in review.json and inputs/.
Actual evidence program argv, cwd, exit status, program hash and raw stdout/stderr are in commands/.
The original first-flow command and raw streams are frozen inputs, not commands run by this reviewer.
The PDF was read as bytes for SHA-256 only; no pixels were decoded, rendered, cropped or shown.
Manifest hashes cover all output files other than the self-referential manifest itself.

Model image ledger: 0 added; human-supplied lifetime 0/24 unchanged.

Stop after this one new-text semantic review and evidence freeze. No finalizer, counts job, assembly, adapt-finalize, flow, test, old PASS rerun, canonical edit or subsequent pipeline work.
