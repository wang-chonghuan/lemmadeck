# STEMROBIN-184 / 9c N9: independent source mathematics

Phase A, 2026-11-23. Derivation: COMPLETE, with scoped HOLDs below.
Checkout: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

## Basis and separation

The only mathematical task inputs are the original pixels frozen in
`source-first.md`, pages 0038 through 0042, printed pages 31 through 35.
No candidates, templates, previous solutions, choices, or parent observations
were consulted. No additional image was opened during these derivations.
The neighboring section 10 on page 0042 is excluded from mathematical review.

Statements labeled **Book** below report the frozen source. Statements labeled
**Derived** are independent mathematics, not claims about literal print.
Any normalization/correction must remain separately identified; these reports
do not authorize changing the source or choosing a candidate treatment.

## Mathematical contract

**Derived.** For a nonnegative integer n and integer 0 <= k <= n, write

```tex
C_n^k=\binom nk=\frac{n!}{k!(n-k)!},
\qquad
T_k=C_n^k A^{n-k}B^k,
\qquad
(A+B)^n=\sum_{k=0}^{n}T_k.
```

This is an identity for commuting indeterminates, hence for real substitutions
where A and B are defined. It is not an unrestricted noncommutative identity.
Polynomial endpoint factors of exponent zero mean the constant polynomial 1;
this does not require assigning a numerical value to a separately posed 0^0.

**Book.** The proof starts with A(1), discusses natural n, and explicitly says
first term T_0, second T_1, third T_2.

**Derived.** Ordinary left-to-right ordinal r corresponds to k=r-1.
The book's preceding wording about calling the (k+1)-st term the k-th term
announces a shifted labeling convention, but does not remove the conflict
with its own ordinary first/second/third examples. Keep both kinds of index
visible when judging the later examples. Do not delete zero-valued terms
before determining formal positions.

## Formula, proof, and binomial corollaries

**Derived proof.** The base n=1 is A+B. Multiply the n=k expansion by A+B.
The coefficient of A^{k+1-j}B^j for 1 <= j <= k is
C_k^j+C_k^{j-1}=C_{k+1}^j; the two endpoint coefficients are 1.
This proves n=k+1 and completes induction for positive integers.
The n=0 extension is the constant polynomial 1.

The k=3 worked induction on pages 0038-0039 has the same endpoint values
and adjacent sums, giving 1,4,6,4,1. The general distribution and collection
on page 0039 match that argument, including the representative
(C_k^m+C_k^{m+1})A^{k-m}B^{m+1}.
Its concluding prose `由（1）和（2）` can refer to the two proof parts;
it is not a reason to reinterpret the later displayed equation (2).

The opening power identities are independently:

```tex
(a+b)^2=a^2+2ab+b^2,
(a+b)^3=a^3+3a^2b+3ab^2+b^3,
(a+b)^4=a^4+4a^3b+6a^2b^2+4ab^3+b^4,
(a+b)^5=a^5+5a^4b+10a^3b^2+10a^2b^3+5ab^4+b^5.
```

These verify the mathematics of the visible displays, but the derived b^2
does not resolve the worn last superscript in the first original display.

**Derived corollary requirements.**

- There are n+1 indexed summands k=0,...,n in the formal expansion. This
  does not assert n+1 nonzero or distinct numerical terms after substitution.
  This supplies the source's embedded `说明为什么` task in corollary 1.
- The exponents of A decrease from n to 0, those of B increase from 0 to n,
  and the sum of their formal exponents is n in every summand. After A/B
  themselves are powers of the same variable, the resulting single-variable
  exponent need not be n.
- Coefficient symmetry is C_n^k=C_n^{n-k}, directly from the factorial formula.
- For 0 <= k < n,
  C_n^{k+1}/C_n^k=(n-k)/(k+1). It is greater than 1 when
  k<(n-1)/2, equal when k=(n-1)/2, and smaller when k>(n-1)/2.
- For n=2m, the unique maximum coefficient is C_{2m}^m.
  For n=2m+1, the two equal maximum coefficients are C_{2m+1}^m
  and C_{2m+1}^{m+1}. At n=1 both coefficients are 1; growth and
  decline are empty parts of the pattern.
- The general term is exactly T_k=C_n^k A^{n-k}B^k. The value of a term
  includes the A/B factors and is not merely its binomial coefficient.
  Central binomial coefficients do not imply central largest term values.

## Worked source examples

### Example 1 / page 0039

**Book and derived agree.**

```tex
(a+b)^7=a^7+7a^6b+21a^5b^2+35a^4b^3
          +35a^3b^4+21a^2b^5+7ab^6+b^7.
```

### Example 2 / page 0040: ordinal HOLD

**Book.** Task says fourth term of (z^{1/2}+z^{2/3})^{12}.
The explanation also says fourth, and the calculation prints
T_4=C_{12}^4(z^{1/2})^8(z^{2/3})^4=495z^{20/3}.

**Derived.** With real powers, require z>=0. For the book's zero-based index,

```tex
T_k=C_{12}^k z^{(12-k)/2+2k/3}
   =C_{12}^k z^{6+k/6}.
T_3=220z^{13/2},\qquad T_4=495z^{20/3}.
```

The printed algebra for T_4 is correct. T_4 is the FIFTH ordinary term,
while the FOURTH ordinary term is T_3. The shifted convention sentence can
explain using coefficient index 4; it cannot justify concealing the difference
from the source's explicit first-term T_0 mapping.
HOLD any unqualified assertion that the printed value is the ordinary fourth
term. Possible editorial choices, neither authorized here, are to retain and
explain the book's shifted label or explicitly correct the ordinal/result.

### Example 3 / page 0040: ordinal HOLD

**Book.** Task asks for a term independent of z in (z+z^{-2})^{12}.
The calculation finds k=4 and calls the resulting term `第四项`.

**Derived.** Require z!=0. The term is

```tex
T_k=C_{12}^k z^{12-3k}.
12-3k=0 \Longrightarrow k=4,\qquad T_4=C_{12}^4=495.
```

The constant term is uniquely T_4, the FIFTH ordinary term. The fourth
ordinary term would be T_3=220z^3 and is not z-independent.
HOLD the printed ordinary-ordinal claim; retain the book's wording separately
from the mathematical correction or convention explanation.

### Starred Example 4 / pages 0040-0041

**Book.** Asks which term of (1+0.01)^{1000} is largest and concludes T_9.

**Derived.** All T_k=C_{1000}^k/100^k are positive. For 0 <= k <= 999,

```tex
\frac{T_{k+1}}{T_k}=\frac{1000-k}{100(k+1)}.
\frac{T_{k+1}}{T_k}\ge1
\Longleftrightarrow 900\ge101k
\Longleftrightarrow k\le\frac{900}{101}=8\frac{92}{101}.
```

The ratio is >1 at integer k=0,...,8 and <1 at integer k=9,...,999.
Equality does not occur. Thus T_9=C_{1000}^9/100^9 is the unique maximum,
which is the TENTH ordinary term. The book's conclusion in T-notation is
correct; calling it ninth without explaining the index would be misleading.
The ratio formula should not be applied to k=1000, since T_{1001} is not
one of the expansion's indexed summands.

### Coefficient note / page 0041

**Book and derived agree.**

```tex
(2a-3b)^4=16a^4-96a^3b+216a^2b^2-216ab^3+81b^4.
```

The third ordinary term has numeric coefficient
C_4^2*2^2*(-3)^2=6*4*9=216, whereas its binomial coefficient is only 6.
This distinction also applies to exercises 71 and to substituted binomials
in exercise 73; do not use ordinary coefficients in the binomial sum identity.

## Exercise 71 / page 0041

**Book requirement.** Expand each displayed binomial, preserving its exact
base, exponent, sign, and subpart identity. Below, labels are the convenient
visual Cyrillic transcriptions frozen in `source-first.md`, not assertions
about original physical Unicode.

**Derived method.** For each subpart, substitute its two summands as A and B
in C_n^k A^{n-k}B^k. A minus sign belongs inside B, so signs alternate
according to (-1)^k. Fractional powers below denote real roots, not unspecified
complex branches. Each displayed answer retains the original expansion order.

### а) (a+b)^6

```tex
a^6+6a^5b+15a^4b^2+20a^3b^3+15a^2b^4+6ab^5+b^6.
```

### б) (x+y)^5

```tex
x^5+5x^4y+10x^3y^2+10x^2y^3+5xy^4+y^5.
```

### в) (x-y)^5

```tex
x^5-5x^4y+10x^3y^2-10x^2y^3+5xy^4-y^5.
```

### г) (sqrt(x)-sqrt(y))^4

**Domain:** x>=0 and y>=0 for real square roots.

```tex
x^2-4x^{3/2}y^{1/2}+6xy-4x^{1/2}y^{3/2}+y^2.
```

### д) (x^{1/3}+y^{1/3})^5

**Domain:** arbitrary real x,y if 1/3 powers mean real cube roots.
For negative arguments, x^{j/3} here means (cuberoot(x))^j.

```tex
x^{5/3}+5x^{4/3}y^{1/3}+10xy^{2/3}
       +10x^{2/3}y+5x^{1/3}y^{4/3}+y^{5/3}.
```

### е) (x-2y)^6

```tex
x^6-12x^5y+60x^4y^2-160x^3y^3+240x^2y^4-192xy^5+64y^6.
```

### ж) (3x-1)^7

```tex
2187x^7-5103x^6+5103x^5-2835x^4+945x^3-189x^2+21x-1.
```

### з) (1+y^2)^4

```tex
1+4y^2+6y^4+4y^6+y^8.
```

### и) (p^{-2}-1)^6

**Domain:** p!=0.

```tex
p^{-12}-6p^{-10}+15p^{-8}-20p^{-6}+15p^{-4}-6p^{-2}+1.
```

### к) (1/y+2)^5

**Domain:** y!=0.

```tex
y^{-5}+10y^{-4}+40y^{-3}+80y^{-2}+80y^{-1}+32.
```

Other polynomial subparts impose no additional real-domain restrictions.
No such real-domain statements are explicitly printed beside the source
subparts; these are necessary derived qualifications, not literal additions.

## Exercise 72 / page 0041

**Book.** Find the two middle terms of (a^3-ab)^{31}.

**Derived.** The formal expansion has positions r=1,...,32, so its middle
ordinary positions are 16 and 17, corresponding to k=15 and k=16.
No nonzero-a assumption is needed for this polynomial identity.

```tex
T_k=C_{31}^k(a^3)^{31-k}(-ab)^k
   =(-1)^k C_{31}^k a^{93-2k}b^k.
C_{31}^{15}=C_{31}^{16}=300540195.
T_{15}=-300540195a^{63}b^{15},
\qquad
T_{16}=300540195a^{61}b^{16}.
```

The requested answer consists of those two individual terms in that order.
Their coefficient magnitudes agree; their signs are opposite.
Terms remain at those formal positions even if a later specialization makes
one or both zero. A solution must retain the factor a in the second summand
-ab; treating that summand as -b produces the wrong a exponents.

## Exercise 73 / pages 0041-0042

**Book.** Use Newton's formula to prove the total binomial coefficient sum
is 2^n, and the even-numbered-term and odd-numbered-term binomial sums agree.
Printed hints prescribe (a,b)=(1,1) and (1,-1).

### а) Total coefficient sum

**Derived.** Set a=b=1:

```tex
2^n=(1+1)^n=\sum_{k=0}^{n}C_n^k.
```

This holds for every nonnegative integer n. It refers to binomial
coefficients, not the numeric coefficients of every arbitrary transformed
expression (for example, (2a-3b)^n).

### б) Even/odd term sums

**Derived.** Require n>=1, integer. Set a=1,b=-1:

```tex
0=(1-1)^n=\sum_{k=0}^{n}(-1)^k C_n^k
 =\sum_{k\ {\rm even}}C_n^k-\sum_{k\ {\rm odd}}C_n^k.
```

Thus both parity-of-k sums are 2^{n-1}, using part а).
For ORDINARY term numbers r=k+1, odd-numbered terms correspond to even k,
and even-numbered terms to odd k. The sums are equal whichever of these
parity conventions is explicitly used, but the two classes must not be
mislabeled.

At n=0 the expansion is one term of binomial coefficient 1. The ordinary
odd-term sum is 1 and the even-term sum is 0, so part б) fails.
The source's n=1 induction start suggests positive-natural-number context,
but page 0042 prints no explicit n>=1 condition in the exercise itself.
HOLD an unrestricted n=0 parity claim; add an explicit assumption only as
an identified mathematical qualification.

## Local arithmetic evidence

After source freeze, one `python3 -c` command used ONLY standard-library
`math.comb` and `fractions.Fraction`, with inputs typed from the original
tasks and derived substitutions. It read/wrote no content files, opened no
image, used no installed third-party dependency, and made no network call.
It independently checked coefficient arithmetic, not a candidate answer.

Its exact coefficient outputs in k order were:

```text
71а:  1, 6, 15, 20, 15, 6, 1
71б:  1, 5, 10, 10, 5, 1
71в:  1, -5, 10, -10, 5, -1
71г:  1, -4, 6, -4, 1
71д:  1, 5, 10, 10, 5, 1
71е:  1, -12, 60, -160, 240, -192, 64
71ж:  2187, -5103, 5103, -2835, 945, -189, 21, -1
71з:  1, 4, 6, 4, 1
71и:  1, -6, 15, -20, 15, -6, 1
71к:  1, 10, 40, 80, 80, 32
72:   (k, signed coefficient, a exponent, b exponent)
      (15, -300540195, 63, 15), (16, 300540195, 61, 16)
Example 2: (3, 220, 13/2), (4, 495, 20/3)
Example 3: C_12^4=495
Example 4: threshold 900/101; ratios at k=8: 248/225, k=9: 991/1000
Example 1: 1, 7, 21, 35, 35, 21, 7, 1
```

This is arithmetic evidence, not template/finalizer/content-count approval.

## Phase-A decision

- Source freeze complete, five original image opens total, no reopen or crop.
- Mathematical requirements and solutions for N9 complete.
- `SOURCE-GLYPH-01`: exact worn exponent glyph on page 0038 unresolved;
  physical Unicode provenance is unavailable for every raster glyph.
- `MATH-INDEX-01/02`: retain explicit HOLD on unqualified ordinary-fourth-term
  claims in Examples 2 and 3. Printed T_4 mathematics and conventional
  ordinary term positions are separately recorded above.
- Domain/assumption qualifications are necessary for real radicals,
  reciprocal powers, and exercise 73б at n=0. The corrected-domain tasks
  are mathematically solved; these are not a reason to invent source text.
- No candidates have been reviewed and no source, template, app, database,
  dependency, environment, Git state, or other worker output was modified.

STOP after phase A. Await explicit later candidate supply for any new phase.
