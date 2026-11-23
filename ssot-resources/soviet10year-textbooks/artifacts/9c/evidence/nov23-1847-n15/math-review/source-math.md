# N15 source mathematics and solution freeze

STEMROBIN-184; ana9-c3-s1-n15; 2026-11-23; independent TEXT-ONLY review, finish=review.
Sole cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
Read the recovered, already-source-compared `page.md` print prose in
`.tmp/stemrobin-184-six/n15-nov23-recovery/raw/9c/pages/`:
0059 only from heading 15 (`p0059#6`), 0060-0062, and 0063 only exercises 124/125 (`p0063#1-2`, before heading 16).
At the user's subsequent authorization, also read only the retained raw
`ssot-resources/soviet10year-textbooks/artifacts/9c/lessons/ana9-c3-s1-n12/lesson.md`
paragraph beginning `2.` and its following paragraphs (lines 21-25), solely to resolve the negative-decimal notation. No N12 re-review or edit.
JSON supplies block identity, not mathematical approval. Existing authored notes are not approval.
No images, external lookup, modern/answer/choice candidates, source edits, finalization, Git, DB, app, dependency changes, or agent/chat interactions. This freezes source-only derivations, not a modern-edition acceptance.

## Teaching mathematics and source-bound repair

**One definite incomplete mathematical expression; its physical cause is unknown.**
Physical 61 / printed 54, `p0061#4` (fourth JSON block, third line; MD line 56):

```latex
original: $x_5+y_5=0.99999,\quad x'_5+{}'_5=1.00001$.
proposed modern repair: $x_5+y_5=0.99999,\quad x'_5+y'_5=1.00001$.
```

Bound recovered page JSON SHA-256: `83c7d252ffae7e3a97e862ca9d3f6024a7565080eaea2dde41badf3d17b527c1`.
Bound recovered page MD SHA-256: `046d91a59a7f10e86343867943be08c9197c7b6d6d2b288df03ad9f94019f149`.
The source-bound text deliberately has the empty base `{}'_5`; this review does **not** claim pixels show `y`, or decide printing omission versus damage/illegibility.
The repair is mathematical: the stated operands give \(x'_5=0.14509\), \(y'_5=0.85492\), whose sum is \(1.00001\); the following midpoint formula explicitly uses \(x'_5+y'_5\).
This is a proposed bound repair, not a registered erratum. The source/erratum contract requires exact block/original/hash binding and a registered `math-correction` before modern substitution; raw source remains unchanged.

**Domain and precision qualifications, not newly established source misreadings:**

- For all real \(x\), put \(\delta=10^{-n}\), \(x_n=\delta\lfloor x/\delta\rfloor\), \(x'_n=x_n+\delta\). Then \(x_n\le x<x'_n\), \(0\le x-x_n<\delta\), and \(0<x'_n-x\le\delta\). “不足” can equal the exact value; the upper endpoint stays one unit above even for a terminating decimal.
- The retained N12 notation makes `p0060#2-4` valid also for negative canonical decimals: the integer part is negative, with a **nonnegative fractional tail**. Its explicit example is \(-3/2=-2+1/2=\overline{2}.500000000\ldots\). In general \(\overline{m}.d_1d_2\ldots=-m+0.d_1d_2\ldots\), not \(-(m+0.d_1d_2\ldots)\). Thus source prefix truncation is the floor/lower approximation. A modern explanation must distinguish this from ordinary signed-magnitude truncation, which is an upper approximation for negatives. Example: \(-1.3<-1.27<-1.2\); ordinary \(-1.2\) is not the lower approximation. This is notation clarification, not a source formula error.
- `p0060#5` says, verbatim, `$5.3991000\cdots\leqslant5.3991\cdots<5.3992000\cdots$` regardless of following digits. In ordinary real arithmetic, \(5.3991999\ldots=5.3992\): the strict upper bound requires canonical expansions, excluding an eventually-all-9 tail. State that convention; if arbitrary digit tails are admitted, only a non-strict upper bound is universal. This is an N15 qualification only. The limited N12 notation-context read does not establish its complete expansion convention or authorize review of its separate digit-bound issue.
- Addition (`p0060#9`) has interval width \(2\delta\). Its midpoint has absolute error at most \(\delta\); this does not certify the actual first \(n\) decimal digits or correctly rounded \(n\)-place result. Product bounds (`p0061#7`) require \(x,y\ge0\); width is \(\delta(x_n+y_n)+\delta^2\), tending to zero, not necessarily at most \(\delta\). Negative products use absolute values and the sign rule, not direct multiplication of signed lower/upper bounds. Shrinking widths establish uniqueness; existence uses the real-number completeness/decimal construction, not width alone.
- All other displayed teaching arithmetic checked out. `p0060#1` has \(5.39+0.01=5.399+0.001=5.4\), both correct despite differing precision. At `p0061#2-3`, \(2.01045\le x+y<2.01047\) certifies the prefix \(2.0104\ldots\), not a rounding instruction.
- At `p0061#4-5`, after the mathematical repair, \(0.99999\le x+y<1.00001\), so \(-10^{-5}\le(x+y)-1<10^{-5}\). The source \(1.00000\pm0.00001\) is an error enclosure, not an assertion that the sum equals 1 or has five fixed decimals; even its integer part is undetermined.
- At `p0061#9` / `p0062#1`, \(1.4142^2=1.99996164\), \(1.4143^2=2.00024449\). Thus \(-0.00003836\le x^2-2<0.00024449\). The interval crosses 2: the unspecified \(x=1.4142\ldots\) need not be \(\sqrt2\); choosing its tail to be \(\sqrt2\)'s gives exactly 2. No correction is needed.

## Frozen exercise solutions

“前 \(k\) 位小数” means actual digits/truncation, not rounding. Decimal prefixes below do not determine the remaining tail. In 121, use the source's barred integer part and nonnegative fractional tail for negative numbers; ordinary negative decimals are shown separately, not substituted for the requested source fractional digits.

**118** (`p0062#3`). \(2.6^2=6.76<7<7.29=2.7^2\), and squaring is increasing on nonnegative reals. Hence \(2.6<\sqrt7<2.7\); both errors are less than \(0.1\).

**119** (`p0062#4`). Lower/upper approximations to \(0.1\):

| Subpart | Number | Lower | Upper | Independent check |
|---|---|---:|---:|---|
| a | \(0.2664\) | 0.2 | 0.3 | errors 0.0664 and 0.0336 |
| b | \(-1.27\) | -1.3 | -1.2 | errors 0.03 and 0.07 |
| c | \(2-5/6=7/6\) | 1.1 | 1.2 | errors \(1/15\) and \(1/30\) |
| d | \(\sqrt{11}\) | 3.3 | 3.4 | \(3.3^2=10.89<11<11.56=3.4^2\) |

**120** (`p0062#5`). The decisive last inequality is \(3.6091<x<3.6092\). The first four decimal digits are **6091**, i.e. \(x=3.6091\ldots\), with \(0<x-3.6091<0.0001\). Retain all five printed strict inequalities; the third decimal digit is 9, not inferred by rounding \(3.60\).

**121** (`p0062#6`). The lesson lists its “first five” approximations starting at precision \(1\) (`p0059#7`); accordingly “first three” here means \(n=0,1,2\). The extra \(n=3\) column verifies the separately requested three decimal digits. Each pair is (lower, upper).

| Subpart / number | \(n=0\) | \(n=1\) | \(n=2\) | \(n=3\), supporting digits | Source prefix / fractional digits |
|---|---|---|---|---|---|
| a: \(3/14\) | (0, 1) | (0.2, 0.3) | (0.21, 0.22) | (0.214, 0.215) | \(0.214\ldots\); **214** |
| b: \(-10/3\) | (-4, -3) | (-3.4, -3.3) | (-3.34, -3.33) | (-3.334, -3.333) | \(\overline{4}.666\ldots\); **666** |
| c: \(\sqrt3\) | (1, 2) | (1.7, 1.8) | (1.73, 1.74) | (1.732, 1.733) | \(1.732\ldots\); **732** |
| d: \(-\sqrt3\) | (-2, -1) | (-1.8, -1.7) | (-1.74, -1.73) | (-1.733, -1.732) | \(\overline{2}.267\ldots\); **267** |

Long division gives \(3/14=0.2\overline{142857}\) (bar over fractional digits indicates repetition), while \(-10/3=-4+2/3=\overline{4}.666\ldots\) (bar over the integer alone indicates its negative sign).
For the roots: \(1^2<3<2^2\), \(1.7^2=2.89<3<3.24=1.8^2\), \(1.73^2=2.9929<3<3.0276=1.74^2\), \(1.732^2=2.999824<3<3.003289=1.733^2\); negate/reverse for d. In particular \(-\sqrt3=-2+(2-\sqrt3)\), with \(0.267<2-\sqrt3<0.268\), giving the source digits **267**.
Ordinary whole-number-minus notation is instead \(-10/3=-3.333\ldots\) and \(-\sqrt3=-1.732\ldots\): its digits **333** and **732** are not the source's negative fractional-tail answers. Source three-place prefixes \(\overline{4}.666=-3.334\) and \(\overline{2}.267=-1.733\) are the lower bounds in the table; ordinary \(-3.333\) and \(-1.732\) are the upper bounds.
All approximation errors are strictly below the respective unit. A modern prompt should state both the notation and precisions rather than silently changing the requested digits or shifting “first three” to \(n=1,2,3\).

**122** (`p0062#7`). Seven-place input bounds yield
\[
1.9053238\le x+y<1.9053240.
\]
This interval lies inside \([1.90532,1.90533)\), so the first five digits are **90532**: \(x+y=1.90532\ldots\).
For the truncated value \(T=1.90532\), \(0.0000038\le x+y-T<0.0000040\). A five-place nearest-rounded result happens also to be \(1.90532\), but is not what “first digits” means.

**123** (`p0062#8`). Both factors are positive:
\[
2.1468(1.5431)=3.31272708\le xy<2.1469(1.5432)=3.31309608.
\]
The entire interval lies in \([3.31,3.32)\), hence the first two digits are **31**, \(xy=3.31\ldots\). Truncation error: \(0.00272708\le xy-3.31<0.00309608<0.01\). Do not treat either known four-place prefix as an exact factor.

**124** (stem `p0062#9`; a/b `p0063#1`). The source asks “到四位有效数字”, not four decimal places, and does not explicitly specify rounding in the reviewed N15 text. Freeze nearest rounding to four significant figures as the proposed modern convention, with the truncation alternative kept distinct:

| Subpart | Exact sum / indicative decimal | Four significant figures, nearest | Absolute error | If instead taking first four significant digits |
|---|---|---|---|---|
| a | \(1/3+\sqrt2=1.7475468957\ldots\) | **1.748** | \(0.0004531042\ldots<0.0005\) | **1.747**, error \(0.0005468957\ldots<0.001\) |
| b | \(\sqrt2+\sqrt5=3.6502815398\ldots\) | **3.650** | \(0.0002815398\ldots<0.0005\) | **3.650**, same error |

Rigorous certificates: \(1.414213<\sqrt2<1.414214\), \(2.236067<\sqrt5<2.236068\), obtained by squaring (respectively \(1.999998409369<2<2.000001237796\), \(4.999995628489<5<5.000000100624\)).
Adding \(1/3\) puts a strictly between \(1.7475463333\ldots\) and \(1.7475473333\ldots\), entirely within the nearest-rounding cell \((1.7475,1.7485)\).
Adding the root bounds puts b strictly between \(3.650280\) and \(3.650282\), within \((3.6495,3.6505)\).
Thus neither rounding result depends on floating-point guesses or a tie rule. Preserve the final zero of **3.650** to communicate four significant figures; the teaching note about suppressing zeros in interval endpoints is not a rule for significant-figure output. Do not silently call 1.747 wrong without specifying the rounding convention.

**125*** (`p0063#2`, both subparts; star preserved). These ask for the first three decimal digits, so truncation is the primary result.

- a: \((1/7)\sqrt3=\sqrt3/7=0.2474358296\ldots\), first digits **247**, prefix **0.247**. Exact squared comparison: \((7\cdot0.247)^2=2.989441<3<3.013696=(7\cdot0.248)^2\), so \(0<\sqrt3/7-0.247<0.001\). Sharper: \(1.732050^2=2.999997202500<3<3.000000666601=1.732051^2\), hence \(3050/7000000<\sqrt3/7-0.247<3051/7000000\).
- b: \(\sqrt2\sqrt5=\sqrt{10}=3.1622776601\ldots\) (positive square roots), first digits **162**, prefix **3.162**. \(3.162^2=9.998244<10<10.004569=3.163^2\); hence \(0<\sqrt{10}-3.162<0.001\). Actual error is \(0.0002776601\ldots\).

Nearest rounding to three decimal places coincides with both 125 outputs, but coincidence does not change the source task to rounding.

## Verification and limits

Independent derivations used long division, monotone squaring, sign reversal, and interval propagation; offline standard-library rational arithmetic checked exact inequalities/products and 60-digit decimal arithmetic checked illustrative decimals. Certificates, not decimal approximations, justify the frozen digits and rounding.
All ten recovered source MD/JSON SHA-256 values were identical before and after writing this review.
Only the new `math-review/source-math.md` is authored. This review neither registers an erratum nor approves a reading of the empty source base, a later candidate, rendering, publication, or any DB state.
