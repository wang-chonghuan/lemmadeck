# SOURCE167 Independent Stage 1 Freeze

Status: STAGE1_FROZEN_WITH_SOURCE_HOLD; reviewer remains OPEN.
Ticket authorization: SAME STEMROBIN-184 / 184-6, independent staged reviewer.
No author disclosure or Stage 2 comparison has occurred.

## Source Binding And Image Accounting

- Original: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/ld-s10y-lesson/9c/pages/0167/page.png`
- Encoded bytes: 59046.
- Encoded SHA-256: `b38bfbb3d75ae23022f2c714b57c1e9bf52993156bf9dbfd7587f818fffa4c22`.
- Supplied dimensions: 1695 x 2381; the native whole-page view presented the original.
- Actual action: exactly one `functions.view_image` call on that original path.
- This reviewer: 1 native whole-page view; 0 crops, ROIs, reopens, OCR, alternate decoders, screenshots, or other source-page reads.
- SOURCE167 known prior 5 + this actual view 1 = known cumulative 6. Never reset.
- Tracked 164/165/166/167 known prior aggregate 30 + this view 1 = 31.
- Hidden/internal image operations are UNKNOWN, not asserted to be zero.
- Fresh review batch: 1/8; fresh review context: 1/24. Parent stays permanently 24/24, with 0 new parent views/decodes.
- No source168+ activity.

## Literal Physical Rows

The row IDs below follow the original top-to-bottom order. There are 21 body
baselines and one decorated folio baseline, total 22. A stacked fraction belongs
to its containing physical typographic row; its numerator, denominator and rule
are inventoried separately, not invented as additional prose baselines. Math is
encoded in TeX without changing the observed formula. U1 is an unresolved source
glyph, not a mathematical correction. Cyrillic `а` is a transcription convention
for the printed a-shaped subpart label; its Unicode identity cannot be learned
from a scan. The distinct printed `б` and `в` are retained.

| Row | Owner / Type | Literal body |
| --- | --- | --- |
| R01 | incoming prose fragment | 可微分的函数. |
| R02 | prose | 事实上， |
| R03 | polynomial formula, first row | $(a_0x^n+a_1x^{n-1}+\cdots+a_{n-1}x+a_n)'$ |
| R04 | same formula, second row | $=(a_0x^n)'+(a_1x^{n-1})'+\cdots+(a_{n-1}x)'+(a_n)'$ |
| R05 | same formula, third row | $=na_0x^{n-1}+(n-1)a_1x^{n-2}+\cdots+a_{n-1}.$ |
| R06 | example 1 | 例 1. $(x^{10})'=10x^9.$ |
| R07 | example 2, first row | 例 2. $(5x^4+4x^3+3x^2+2x+1)'=5\cdot4x^3+4\cdot3x^2+3\cdot2x$ |
| R08 | example 2, continuation | $+2=20x^3+12x^2+6x+2.$ |
| R09 | exercise heading | 习　题 |
| R10 | shared request, 375 and 376 | 求下列各函数的导数： |
| R11 | exercise 375, all three subparts share a row | 375. а) $f(x)=x^4$; б) $g(x)=x^3$; в) $h(x)=(x-4)^4.$ |
| R12 | exercise 376, subpart а | 376. а) $f(x)=2x^5-3x^4+7x^2-5x+9$; |
| R13 | exercise 376, subpart б | б) $g(x)=7-2x^3+x^4-3x^{\langle U1\rangle}.$ |
| R14 | exercise 377, local graph request | 377. 作下列各函数的图象： |
| R15 | exercise 377, both subparts share a row | а) $y=x^2(x-2)$; б) $y=x^3-6x.$ |
| R16 | next numbered heading | 47. 商 的 导 数 |
| R17 | theorem, first row | 定理. 如果函数 $u$ 和 $v$ 在点 $x$ 有导数，而且 $v(x)\ne0$，那 |
| R18 | theorem, second row, inline stacked quotient | 么它们的商 $\frac{u}{v}$ 在这点也有导数，这个导数由公式 |
| R19 | theorem, displayed quotient formula | $\left(\frac{u}{v}\right)'=\frac{u'v-uv'}{v^2}$ |
| R20 | theorem, final row | 给出. |
| R21 | next proof, incomplete at page boundary | 证明　用 $w$ 表示商 $\frac{u}{v}$. 这时 |
| R22 | folio, bottom left | • 160 • |

## Object And Boundary Freeze

- R01 is only the visible tail of preceding prose. Its unseen antecedent is NOT
  reconstructed, and no prior166 page or draft was read.
- R02-R05 are the polynomial differentiation derivation: three formula rows,
  fixed coefficients `a_0,...,a_n`, exponent `n`, decreasing exponents, and final
  constant coefficient `a_{n-1}`. The constant `a_n` contributes zero.
- R06 is complete example 1. R07-R08 are one complete example 2; the leading
  `+2` at R08 belongs to R07, not a new exercise.
- R09 is the unnumbered exercise heading; its visual spacing is presentation,
  not another word. R10 supplies the derivative request to BOTH 375 and 376.
- 375 contains three subparts; 376 contains two; 377 contains two. Total seven
  new written subparts. No answers, choices or printed solution figures appear.
- R14 is the request for 377 only. R15 contains two polynomial graph tasks.
  The source does not provide a plotted graph, axes, scales or point labels.
- R16 introduces numbered section 47, not another exercise subpart.
- R17-R20 form one complete quotient-rule theorem, including both stacked
  quotients and the condition `v(x) != 0`.
- R21 starts a proof, defines `w` as the quotient, and ends at `这时`. It is
  OPEN_TO_LATER_PAGE. No unseen later equation or proof text is supplied.
- R22 is printed folio 160, not exercise 160 or source167 body text.
- No figure, caption, table, diagram, footnote, boxed request, or marginal
  mathematical annotation was observed.

## Gaps And Ancillary Ink

The top white margin precedes the incoming fragment. There are visible paragraph
and formula separations after R01, around R02-R05, between examples, a larger
gap before the centered exercise heading, exercise-row spacing, a larger gap
before section 47, and lower spacing before the proof and folio. These spaces
do not establish omitted exercises or missing figures.

Four conspicuous non-text dark marks occur in the far right margin: a small
horizontal mark level with example 2, a larger blot near the exercise heading,
a small blot level with the theorem opening, and a large blot level with the
displayed quotient formula. Their approximate centers in the supplied native
coordinate scale are (1580,700), (1575,875), (1590,1670), and (1580,1855);
these are visual approximations, not decoded pixel measurements or crop boxes.
They are kept as ancillary source ink, not punctuation or math symbols.
Scattered isolated scan flecks occur in the upper prose/formula gap, between
some body rows and in the margins. Their identity is UNKNOWN; no semantic
annotation is inferred from them. The two dots surrounding folio 160 are
intentional folio decoration and are not discarded as scan noise.

## Source HOLD

U1: the final exponent of the last term `-3x^(...)` in 376 б), R13. The single
whole-page view suggested `9`, but did not establish it sufficiently to exclude
`3`. This freeze preserves `{9,3}` as conditional candidates; it does NOT choose
the glyph using algebra, an expected answer, a canonical transcription or an
author draft. No additional viewing authority is assumed.

All other listed mathematical glyphs were read directly from the one authorized
view. Mathematical work for both U1 candidates is frozen in `math.json`.

## Independent Mathematical Verdict

The visible polynomial derivative formula and both examples check out. The five
derivative-request subparts have independent calculations, with 376 б) conditional
on U1. Both graph tasks have complete mathematical and manual-sketch analyses:
domain, intercepts, derivatives, critical points, extrema, monotonicity, range,
ends, asymptote exclusion, curvature, inflection and symmetry.

The quotient-rule statement is correct under its printed hypotheses. The
independent verification in `math.json` is an audit of that statement, NOT a
transcription or completion of the unobserved continuation of R21.

Concrete verdict: SOURCE_HOLD_U1; resolved mathematics PASS, U1 mathematics
CONDITIONALLY_VERIFIED. Not source-fidelity PASS, not author approval, not
assembly authorization and not closure.

## Isolation And Release Gate

No author package, canonical167, other parent math draft, answer key, choice
artifact, modern edition, actual page template/layout/grid, TOC, PDF text, prior166
content, backend, DB, network, model call, environment/credential inspection,
Git operation, branch/worktree operation, descendant, other-chat inspection or
message was used. Generic lesson/source grammar and image-batch/production-resume
instructions were read. The session entry router was read as instructed.

Only the four new files in this reviewer-owned directory are deliverables. Seal
individual files 0444; leave the directory writable for an explicitly authorized
later Stage 2. Parent must fully intake this Stage 1 text before any explicit
fixed-author release. The reviewer remains OPEN and stops here. Stage 2, source
reopening, SOURCE168+, n46 assembly, publishing, merging, deployment and ticket
closure have not occurred.
