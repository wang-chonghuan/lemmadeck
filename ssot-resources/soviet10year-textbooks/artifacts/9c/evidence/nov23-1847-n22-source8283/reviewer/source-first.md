# N22 independent source-first freeze: Phase A

ROOT: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`

Ticket: STEMROBIN-184. Book reviewed: 9c. Scope: all N22 source content
on physical pages 82 and 83, stopping at the N23 heading. No 10c content,
N23 body, prior N21 content, candidate/native text, answers, keys, or prior
reports was consulted. This is a source review, not candidate approval.

Session date: 2026-11-23. Hash observation time: 2026-11-23T11:50:09+0000.
Read the requested image-batch rules and production-resume contract first.
No child reviewer was started; this review was performed in this context.

## Image binding and honest counters

1. Opened once, first:
   `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n21-nov23-source7982/prepared/9c/pages/0082/page.png`
   SHA-256: `67db120051442916d43f8cb2e4a8ebf722d33594c69a00d26769d9d84c4ac39e`.
   Observed printed page 75. N22 starts with its heading at the top of the
   text; the bottom of its example 1 ends mid-sentence at "根据极限".
   No prior N21 boundary was needed or reviewed.
2. Opened once, second:
   `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n22-nov23-source8283/prepared/9c/pages/0083/page.png`
   SHA-256: `0aa96ec7501c4ebe3364e842e92afa08e6b86ca08475821fb488b90a655d4d57`.
   Observed printed page 76. Its opening completes N22 example 1, followed
   by example 2 and the exercise headed 163. Only after all four exercise
   parts does the N23 heading occur. This pixel boundary, not a page-start
   TOC allocation, defines the end of N22.

Images loaded into this review context: **2**. Unique originals: **2**.
Reopens: **0**. Crops: **0**. Enlargements: **0**. Other images: **0**.
External checker/browser/model calls: **0**. Candidate/native text reads:
**0**. Prior report/key/draft reads: **0**.

All prose and mathematics below were read independently from these two
single original-image views. No fixed count target was used. The supplied
native first-pass information was not inspected and supplies no approval.

## Transcription conventions and one UNKNOWN

Chinese source wording, mathematical variables, signs, strict/non-strict
inequalities, quantifiers, example numbers, and exercise ownership are
retained. Layout is reflowed and mathematical typesetting uses LaTeX.
The printed epsilon is represented by `\varepsilon`; `N` remains the
source's natural-number symbol. Ordinary prose punctuation is typeset
conventionally, not claimed as a typographic facsimile.

**UNKNOWN U1:** the small separator between the two phrases in the N22
heading cannot be identified reliably as a particular punctuation mark
from the one permitted view. It is not silently replaced by a period,
colon, or middle dot. Both title phrases and all mathematical content are
legible. There are no unresolved mathematical signs, values, quantifiers,
exercise formulas, or body words.

The first exercise label has the visible a-shaped glyph, represented as
`а)` in the sequence `а), б), в), г)`. Its Latin/Cyrillic Unicode identity
is not recoverable from that visually identical glyph; this is a
typesetting equivalence, not a different exercise or a mathematical
uncertainty. The other three labels are retained as Cyrillic glyphs.
The open intervals in example 2 retain the source's `] ... [` notation.

## Frozen N22 source: physical 82 / printed 75

### 22. 极限的唯一性[UNKNOWN U1: 分隔标点]收敛数列和发散数列

凭着直观感觉，数列只能有一个极限，似乎是对的。

**定理：如果数列收敛，那么它只有一个极限。**

证明 设
\[
\lim_{n\to\infty}x_n=a,\qquad \lim_{n\to\infty}x_n=b.
\]
根据极限的定义，对于任意 \(\varepsilon>0\)，存在这样的 \(n_1\)
和 \(n_2\)，使得，当 \(n>n_1\) 时，
\[
|x_n-a|<\frac{\varepsilon}{2},
\]
当 \(n>n_2\) 时，
\[
|x_n-b|<\frac{\varepsilon}{2}.
\]
取一个同时大于 \(n_1\) 和 \(n_2\) 的数 \(n_0\)。那么，
\[
|x_{n_0}-a|<\frac{\varepsilon}{2},\qquad
|x_{n_0}-b|<\frac{\varepsilon}{2},
\]
于是
\[
\begin{aligned}
|a-b|
&=|(a-x_{n_0})+(x_{n_0}-b)|\\
&\leq |a-x_{n_0}|+|x_{n_0}-b|\\
&<\frac{\varepsilon}{2}+\frac{\varepsilon}{2}
=\varepsilon.
\end{aligned}
\]
我们得到，非负数 \(|a-b|\) 小于任意正数 \(\varepsilon\)。
但是，能满足这个条件的只有零这个数，即 \(|a-b|=0\)，因此 \(a=b\)。

于是，数列只可能有两种情况：1) 数列有极限，而且只有一个，
这样的数列叫做收敛数列；2) 数列没有极限，这样的数列叫做发散数列。

举几个发散数列的例子。

**例 1.** \(x_n=n,\ n\in N\)。

假设数列 \((x_n)\) 收敛，且有极限 \(a\)。取
\(\varepsilon=1\)。那么，根据极限

**Page break:** the sentence continues directly on physical 83. It is
not a completed proof on physical 82.

## Frozen N22 carryout: physical 83 / printed 76

的定义，存在这样的数 \(n_1\)，使得对于一切 \(n>n_1\)，
不等式 \(|x_n-a|<1\) 成立，即对于一切 \(n>n_1\)，
不等式 \(|n-a|<1\) 成立。
将它写成双不等式的形式，即对一切 \(n>n_1\)，有
\[
-1<n-a<1,
\]
或者
\[
a-1<n<a+1.
\]
但是，不等式 \(n<a+1\) 不可能对一切 \(n>n_1\) 都成立，
因为自然数集合是无界的。

**例 2.** \(x_n=(-1)^n,\ n\in N\)。

跟前面的例子一样，用反证法证明。假设数列 \((x_n)\) 收敛于
\(a\)。取点 \(a\) 的邻域
\[
\left]a-\frac12,\ a+\frac12\right[.
\]
因为这个区间的长等于 1，点 1 和点 \(-1\) 的距离又等于 2，
所以这两个点不可能同时落入该区间。这就是说，在点 \(a\) 的邻域
\[
\left]a-\frac12,\ a+\frac12\right[
\]
之外有数列的无穷多项。因此，数 \(a\) 不可能是数列 \((x_n)\)
的极限。

### 习题

**163.** 证明数列 \((x_n)\) 收敛，而数列 \((y_n)\) 发散：

- а) \(\displaystyle x_n=\frac{6n-3}{3n}\)；
- б) \(\displaystyle x_n=2+\frac{(-1)^n}{n}\)；
- в) \(\displaystyle y_n=(-1)^n+1\)；
- г) \(\displaystyle y_n=2n-1\)。

The `+1` in part в) is outside the exponent. The denominator in part а)
is `3n`, not `3`, and the `-3` is in the numerator. The denominator in
part б) is `n`; its `2+` is outside the fraction. The final part has
coefficient `2` and subtracts `1`.

## Frozen next-heading boundary only

Immediately after exercise 163, the source heading reads:
\[
23.\quad \text{当 }|q|<1\text{ 时 }\lim_{n\to\infty}q^n=0.
\]

This heading is recorded solely as the N22 exclusion boundary. No N23
body was transcribed, reviewed, or solved. N22 has real carryout and all
of exercise 163 on physical 83 despite N23's TOC start on that page.

## Independent mathematics checks

### M1: uniqueness theorem and complete proof

**PASS.** The statement is conditional on convergence; it does not assert
that every sequence converges. Its proof addresses ordinary finite real
limits. For each positive epsilon, the two convergence assumptions give
two tail thresholds for epsilon/2. A natural index \(n_0\) strictly larger
than both exists. Both estimates therefore apply to the same term
\(x_{n_0}\). The displayed equality and triangle inequality are correct;
the triangle-inequality comparison is non-strict, and the final bound is
strict. Since epsilon was arbitrary, the resulting fixed nonnegative
distance \(d=|a-b|\) must vanish: if \(d>0\), choosing epsilon \(d\)
would require \(d<d\). Thus \(a=b\). The chosen index may depend on
epsilon; no uniform index for every epsilon is assumed.

### M2: convergent/divergent definitions

**PASS.** The source's two definitions classify whether a finite limit
exists; uniqueness excludes multiple finite limits. "发散" here means
absence of a finite limit, not only unboundedness and not only oscillation.
There is no source claim that divergence must be convergence to infinity.

### M3: example 1 and its page-spanning contradiction

**PASS.** Assuming a finite limit \(a\), epsilon 1 would require
\(|n-a|<1\) for every natural \(n>n_1\). Both rearrangements are
equivalent, including their strict inequalities. Unboundedness of the
naturals provides an \(n>\max(n_1,a+1)\), contradicting \(n<a+1\).
The continuation on physical 83 supplies the essential contradiction;
omitting it would leave example 1 incomplete.

### M4: example 2

**PASS.** For every possible real limit \(a\), the open radius-1/2
neighborhood has length 1. The values 1 and -1 are distance 2 apart,
so they cannot both lie in it. At least one value is outside, and each
value occurs at infinitely many natural indices of its parity. Therefore
for every tail threshold there is a term outside this fixed neighborhood.
This contradicts convergence for epsilon 1/2. The source's "无穷多项"
counts repeated terms/indices, not infinitely many distinct values.

### T163-а: first convergence task

**PASS.** Independently,
\[
x_n=\frac{6n-3}{3n}=2-\frac1n,\qquad |x_n-2|=\frac1n.
\]
Given any epsilon \(>0\), choose a natural \(N\geq1/\varepsilon\).
For every natural \(n>N\), \(1/n<\varepsilon\). The finite limit is 2.

### T163-б: second convergence task

**PASS.** Independently,
\[
|x_n-2|=\left|\frac{(-1)^n}{n}\right|=\frac1n.
\]
The same quantified threshold works. Alternating signs do not prevent
convergence because their magnitude tends to zero. The finite limit is 2.

### T163-в: bounded divergence task

**PASS.** Independently, odd-index terms equal 0 and even-index terms
equal 2. For any proposed real limit \(a\), a radius-1/2 open
neighborhood cannot contain both values, whose distance is 2. A parity
occurring infinitely often stays outside. Thus no finite limit exists.
The sequence is bounded and divergent; `+1` must not be moved into the
exponent or silently omitted.

### T163-г: unbounded divergence task

**PASS.** Independently, \(y_n=2n-1\) is unbounded above. For any
real bound \(M\), choose a natural \(N>(M+1)/2\). Then every \(n>N\)
satisfies \(2n-1>M\). In particular, if a finite limit \(a\) existed,
its epsilon-1 tail would require \(2n-1<a+1\), contradicted by sufficiently
large natural indices. It is divergent under the source's definition.
Its growth to \(+\infty\) is an independent explanation, not an invented
finite limit or a replacement source formula.

## Scope verdict and freeze

Source mathematical review: **PASS for the complete N22 scope**.
Observed source mathematical errors: **0**. Numbered exercise groups:
**1** (163). Exercise subparts independently checked: **4**.
Worked examples checked: **2**. Theorem/proof checked: **1**.
Definitions checked: **2**. Source illustrations/diagrams in N22: **0**.
Boundary headings recorded without body review: **1** (N23).

Source reading/fidelity verdict: **COMPLETE_WITH_UNKNOWN**, with exactly
one unresolved heading separator, U1. The mathematics, N22 body, and
carryout/task ownership are not unknown. This is not an unconditional
claim of exact source typography and is not candidate/native approval.

These are immutable Phase A observations. Set this snapshot and the
paired `source-math-first.json` read-only after creation. Phase B must use
separate comparison evidence after candidate/native TEXT disclosure;
it must not overwrite this source-first freeze or reopen either image.
