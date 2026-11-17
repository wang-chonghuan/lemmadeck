# Physical 0176: Independent Source Inventory

Input SHA-256: 927c8443b78c76ac6ac5e749bd71baa7c58e6afac649c1f3396d9bd982eaf238

One native original view, detail=original. No transformations or second view. Printed footer: bullet-like mark, 170, bullet-like mark. Physical/printed identities are separately recorded, not inferred from a TOC.

## Reading Rows

Rows below follow the visually observed top-to-bottom order. Formula letters are descriptive mnemonics for visible letter shapes, not certification of the scan's original Unicode code points. `LEQ-TYPE-UNKNOWN` denotes a visible less-than-or-equal-like mark whose exact lower-stroke type / Unicode identity is unresolved.

| Row | Independently visible source content |
| --- | --- |
| R01 | 得证。 |
| R02 | 这个定理的意义是，当 $x$ 很大时，分式 $\frac{x^p}{a^x}$ 很小，也就是分 |
| R03 | 母比分子大许多倍。关于这一点，简单地说就是：当 $x$ 趋向无 |
| R04 | 穷大时，指数函数比幂函数增大得快。 |
| R05 | **定理 2 存在这样一个数 $M$，使得对于所有的 $x>1$，不** |
| R06 | **等式** |
| R07 | $\frac{\ln x}{x^p}$ `LEQ-TYPE-UNKNOWN` $\frac{M}{x^{p/2}}$， with printed equation label **(2)** far to the right on this same formula row. |
| R08 | **成立。** |
| R09 | 为了证明它，我们讨论函数 $y=\frac{\ln x}{x^{p/2}}$，并且考察当 $x>1$ 时 |
| R10 | 这个函数的极值。导函数 |
| R11 | $y'=\frac{1}{x}\cdot x^{-p/2}+\ln x\left(-\frac{p}{2}\right)x^{-p/2-1}=\frac{p}{2x^{1+p/2}}\left(\frac{2}{p}-\ln x\right)$， |
| R12 | 当 $x\in]1,e^{2/p}[$ 时，它取正值，而当 $x\in]e^{2/p},\infty[$ 时，它取负值。于 |
| R13 | 是，在点 $e^{2/p}$，所讨论的函数取极大值，我们用字母 $M$ 表示它。 |
| R14 | 对于所有的 $x>1$， |
| R15 | $\frac{\ln x}{x^{p/2}}$ `LEQ-TYPE-UNKNOWN` $M$。 |
| R16 | 用 $x^{p/2}$ 除这个不等式的两边，得不等式 (2)。定理 2 得证。 |
| R17 | 这个定理的意义与定理 1 的意义类似。当 $x$ 很大时，分 |
| R18 | 式 $\frac{\ln x}{x^p}$ 的分母比它的分子大许多倍。关于这一点，简单地说就 |
| F01 | bullet-like mark, **170**, bullet-like mark. |

## Formula And Layout Facts

- R02 is one prose row containing a tall fraction: numerator $x^p$, denominator $a^x$. The raised letters are individually present in the pixels; no positivity/base condition is added from predecessor context.
- R05-R08 comprise a bold theorem statement interrupted by one centered display formula. The word 不等式 physically wraps after 不; R06 is not an independent heading.
- R07 is one formula-bearing row, with numerator $\ln x$ over $x^p$ on the left; numerator $M$ over $x^{p/2}$ on the right. The exponent $p/2$ is itself a small stacked fraction. The equation label (2) shares that row. Do not create separate rows for fraction components or the equation label.
- R09 has one inline tall fraction $\ln x / x^{p/2}$ and explicit condition $x>1$. R09-R10 are a continuing prose statement, not two independent conditions.
- R11 is one continuous horizontal derivative equality chain. It contains $1/x$, a multiplication dot, $x^{-p/2}$, $+\ln x(-p/2)x^{-p/2-1}$, and the final product with tall fraction $p/(2x^{1+p/2})$ and parenthesis $2/p-\ln x$. Both $p/2$ exponents are stacked; the denominator power on the final fraction visibly includes $1+$.
- R12 preserves outward-facing French interval delimiters: $]1,e^{2/p}[$ and $]e^{2/p},\infty[$. Both interval conditions occur on the same prose row. The sentence wraps at 于.
- R13 includes the same visible $e^{2/p}$ point and the letter-shaped maximum label $M$.
- R15 contains one tall fraction, a less-than-or-equal-like mark and $M$; no equation number is printed on that row.
- R16 begins with $x^{p/2}$ as the divisor named by the source. Do not replace it with a derived expression.
- R18 starts with the second half of the split word 分式 and contains $\ln x/x^p$.
- No figure, caption, table, exercise, exercise star, shared exercise instruction, new numbered lesson heading, chapter or section heading is visible on this page. Theorem 2 is a theorem within continuing prose, not a new source-unit boundary.
- Top edge thin dark line and isolated margin specks are visible scan marks. Their origin is UNKNOWN because no neighbor page was opened; no pixel exclusion, box or counting claim is asserted.

## Uncertainty

- U176-01: the less-than-or-equal-like glyphs in R07 and R15 are legible as relations but their exact stroke TYPE / Unicode identity is UNKNOWN. No normalization to `≤`, `⩽`, `\leq` or `\leqslant` is authorized by this inventory.
- U176-02: letter shapes such as $p$, $x$, $a$, $y$, $M$ and $e$ are transcribed descriptively. Where Latin/Cyrillic code points have identical printed shapes, source Unicode is UNKNOWN; the scan does not encode a recoverable text layer. Mathematical convention does not prove a code point.
- Punctuation is a readable textual rendering of the print, not a byte-level reconstruction of a nonexistent text layer.

## Open Boundaries

- TOP: local pixels begin with 得证。 They contain no local title or theorem-1 start. Parent transport from physical 175 ends "于是定理 1"; proposed text join "于是定理 1得证。" is transport-to-local continuation only, NOT local inspection of physical 175. Keep the predecessor title / star / earlier conditions outside this page's verified source facts.
- BOTTOM: R17-R18 form open prose ending exactly at visible "关于这一点，简单地说就". The next-page completion is not yet claimed in this inventory.
- Footer F01 is transparent to the open prose boundary. No content below the footer is claimed.

StageA record only. No author comparison, finalization, fidelity PASS, source edit, publication or StageB decision.
