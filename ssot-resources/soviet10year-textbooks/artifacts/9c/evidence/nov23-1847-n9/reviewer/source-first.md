# STEMROBIN-184 / 9c N9: independent source-first freeze

Reviewer phase: A only. Date: 2026-11-23. Source freeze: COMPLETE.
Sole checkout: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

## Authority and limits

- Evidence is restricted to the five original prepared `page.png` images under
  `.tmp/stemrobin-184-six/n9-nov23-source3842/9c/pages/0038` through `0042`.
  These paths identify the observed originals, not a runtime dependency.
- The image-batch rule in `.agents/skills/ld-s10y-image/SKILL.md` was read before
  the first image open. One batch, at most five original opens; no reopens,
  crops, decodes, derived renders, or other images.
- No candidates, templates, content totals, previous reviews, answers, choices,
  or parent source observations were consulted.
- The only supplied prior-page TEXT is the heading `9. 牛顿公式·主要推论`
  and the open paragraph `大家都熟悉下列公式： $(a+b)^1=a+b$，`.
  Page 0037 has not been opened. That supplied text is not independent pixel evidence.
- Each page is recorded below immediately following its single observation.
  Mathematical derivations are separate from the literal transcript.
  This report grants no candidate, template, finalizer, count, or publication approval.

## Transcription conventions

Chinese in this evidence is intentionally non-ASCII because it transcribes Chinese print.
Within each `text` block, newlines preserve visible prose/display wrapping, including
continuations across pages. Indentation records a display continuation approximately,
not measured coordinates. TeX is a readable transcription of printed math layout;
it is not recovered source markup. `C_n^m` records the visible C-shaped letter
with a lower n and upper m, not a proof that the original typesetting encoded
Latin U+0043 rather than a visually identical character. The same restriction
applies to all Latin-looking variables, digits, operators, and punctuation.
Raster pixels contain no recoverable physical Unicode provenance.
An uncertain glyph is marked explicitly and is not silently repaired using mathematics.
Print dirt, marginal marks, and page ornaments are inventoried separately.

## Open ledger

| Original path suffix | Opens | Observation/freeze |
| --- | ---: | --- |
| `0038/page.png` | 1 | Frozen below |
| `0039/page.png` | 1 | Frozen below |
| `0040/page.png` | 1 | Frozen below |
| `0041/page.png` | 1 | Frozen below |
| `0042/page.png` | 1 | Frozen below |

Final image payload count: 5, one batch. Each original opened exactly once.
Reopens/crops/other image opens: 0. No image opens remain authorized in this phase.

## Page 0038 / printed page 31

Source: `.tmp/stemrobin-184-six/n9-nov23-source3842/9c/pages/0038/page.png`.
One original open. This section is the independent pixel freeze for this page.

### Literal transcription

```text
                    (a+b)^2=a^2+2ab+b^{[2?]}，
                    (a+b)^3=a^3+3a^2b+3ab^2+b^3.
不难算出：
             (a+b)^4=a^4+4a^3b+6a^2b^2+4ab^3+b^4，
      (a+b)^5=a^5+5a^4b+10a^3b^2+10a^2b^3+5ab^4+b^5.
我们很快就发现，这些公式右边各项的系数等于帕斯卡三角
里相应一行的数.
    看来对于任意自然数 n，下列公式成立：
 (a+b)^n=C_n^0 a^n+C_n^1 a^{n-1}b+⋯+C_n^m a^{n-m}b^m+⋯+C_n^n b^n.  (1)
这个公式叫做牛顿公式，以此纪念英国物理学家、数学家牛顿
（1643—1727）. 等式（1）右边的式子叫做 (a+b)^n 的二项展
开式.
    我们用数学归纳法来证明公式（1）. 对于任意给定的 n，
用 A(n) 表示等式（1）.
    1） A(1) 成立，因为
                 (a+b)^1=(a+b)=C_1^0 a+C_1^1 b.
    2） 然后证明：对于任意自然数 k，A(k) ⇒ A(k+1).
首先拿 k=3 的情况作例子进行证明. 假设已知
            (a+b)^3=C_3^0 a^3+C_3^1 a^2b+C_3^2 ab^2+C_3^3 b^3.
这时
            (a+b)^4=(C_3^0 a^3+C_3^1 a^2b+C_3^2 ab^2+C_3^3 b^3)(a+b)
                    =C_3^0 a^4+C_3^1 a^3b+C_3^2 a^2b^2+C_3^3 ab^3
                          +C_3^0 a^3b+C_3^1 a^2b^2+C_3^2 ab^3+C_3^3 b^4
                    =C_3^0 a^4+(C_3^0+C_3^1)a^3b+(C_3^1+C_3^2)a^2b^2
                          +(C_3^2+C_3^3)ab^3+C_3^3 b^4.
```

### Object inventory and source qualifications

- `p0038-opening-powers`: two displays continuing the supplied preceding-page
  paragraph, powers 2 and 3. The final exponent on b in the power-2 display is
  worn/fragmented and is visually consistent with 2, but recorded as `[2?]`;
  the expected mathematical exponent 2 is not substituted into the literal line.
- `p0038-powers-4-5`: two further displays after `不难算出：`, powers 4 and 5,
  with coefficients 1,4,6,4,1 and 1,5,10,10,5,1.
- `p0038-pascal`: two wrapped prose lines relating coefficients to a row of
  Pascal's triangle. No triangle diagram is printed on this page.
- `p0038-equation-1`: one numbered general binomial display with explicit
  first two terms, a generic m term, ellipses, and the last term.
- `p0038-name`: three wrapped lines naming Newton, the dates 1643 to 1727,
  and the binomial expansion. `牛顿公式` has a wavy underline in the print.
- `p0038-induction`: the assertion A(n), numbered proof parts 1 and 2,
  the n=1 base display, and the k=3 illustrative step.
- `p0038-k3-step`: the cubic premise followed by a five-line quartic
  multiplication/collection display. Both distributed rows, both coefficient
  sums in the first collection row, and the last collection row are present.
- No exercise heading, independently numbered exercise, geometric figure,
  table, or learner-response blank occurs on this page.
- Footer is the printed page number 31 with a dot on either side. There is
  substantial black edge dirt at the left and minor stray marks; these are
  not mathematical signs or task objects.
- The numeral, Latin-shaped letters, minus/plus signs, and punctuation in
  the transcript are editorial encodings of observed shapes only. Physical
  source codepoints cannot be established from this raster.

## Page 0039 / printed page 32

Source: `.tmp/stemrobin-184-six/n9-nov23-source3842/9c/pages/0039/page.png`.
One original open. This section is the independent pixel freeze for this page.

### Literal transcription

```text
因为
           C_3^0=1=C_4^0， C_3^0+C_3^1=C_4^1， C_3^1+C_3^2=C_4^2，
                   C_3^2+C_3^3=C_4^3， C_3^3=1=C_4^4，
因此最后得
        (a+b)^4=C_4^0 a^4+C_4^1 a^3b+C_4^2 a^2b^2+C_4^3 ab^3+C_4^4 b^4.
    对于任意自然数 k，类似地进行计算：
    (a+b)^{k+1}=(C_k^0 a^k+C_k^1 a^{k-1}b+⋯+C_k^m a^{k-m}b^m
         +⋯+C_k^k b^k)(a+b)
    =C_k^0 a^{k+1}+C_k^1 a^k b+⋯+C_k^{m+1} a^{k-m}b^{m+1}+⋯+C_k^k ab^k
                 +C_k^0 a^k b+⋯+C_k^m a^{k-m}b^{m+1}+⋯+C_k^{k-1}ab^k
                 +C_k^k b^{k+1}
    =C_k^0 a^{k+1}+(C_k^0+C_k^1)a^k b+⋯+(C_k^m+C_k^{m+1})a^{k-m}b^{m+1}
                 +⋯+(C_k^{k-1}+C_k^k)ab^k+C_k^k b^{k+1}
    =C_{k+1}^0 a^{k+1}+C_{k+1}^1 a^k b+⋯+C_{k+1}^{m+1}a^{k-m}b^{m+1}+⋯
                 +C_{k+1}^k ab^k+C_{k+1}^{k+1}b^{k+1}.
    由（1）和（2），根据数学归纳法得出：对于任意自然数 n，
命题 A(n) 成立. 公式（1）证毕.
    例 1. (a+b)^7=a^7+7a^6b+21a^5b^2+35a^4b^3+35a^3b^4
                       +21a^2b^5+7ab^6+b^7.
    牛顿公式中的系数 C_n^k 叫做二项式系数.
    我们研究牛顿公式的主要推论.
    1°. 根据牛顿公式，(a+b)^n 的展开式有 n+1 项. 这可
由等式（1）看到（说明为什么）.
    2°. 牛顿公式即等式（1）里，a 的幂指数由 n 减小到 0，而
b 的幂指数由 0 增加到 n. 展开式的每一项中，a 与 b 的幂
```

### Object inventory and source qualifications

- `p0039-k3-close`: two lines of coefficient equalities, followed by one
  quartic display closing the k=3 example on printed page 31.
- `p0039-general-step`: nine physical display lines: two for the product
  premise, three for distribution, two for collection, and two for the
  `k+1` coefficient form. The representative collected term uses
  `C_k^m+C_k^{m+1}`, `a^{k-m}`, and `b^{m+1}`.
- `p0039-induction-close`: two prose lines conclude A(n). Literal prose
  says `由（1）和（2）`; these refer contextually to the two proof steps,
  and should not be silently relabeled to a later numbered formula (2).
- `p0039-example-1`: `例 1.` is a worked expansion of `(a+b)^7`, displayed
  over two lines, not an independently numbered exercise.
- `p0039-coeff-name`: one prose line defines `C_n^k` as a binomial coefficient;
  `二项式系数` has a wavy underline.
- `p0039-corollary-intro`: one prose line introduces the main corollaries.
- `p0039-corollary-1`: two prose lines state that the formal expansion has
  n+1 terms and contain the embedded task `说明为什么`.
- `p0039-corollary-2-head`: two prose lines begin the exponent discussion;
  the last visible text is `a 与 b 的幂`, an unfinished sentence.
- No geometric figure, table, or response blank occurs. Printed footer is
  32, with dots on either side at the lower left. Black edge marks at the
  right and a dark bottom scan boundary are non-content.
- Superscript small circles in `1°` and `2°` are visually recorded as such;
  this is not provenance for U+00B0 versus another degree-like character.
  No additional unresolved content glyph is identified on this page.

## Page 0040 / printed page 33

Source: `.tmp/stemrobin-184-six/n9-nov23-source3842/9c/pages/0040/page.png`.
One original open. This section is the independent pixel freeze for this page.

### Literal transcription

```text
指数的和等于二项式的幂指数 n.
    3°. 与展开式的两端等距的二项式系数彼此相等（因为
C_n^m=C_n^{n-m}）.
    4°. 二项式系数开始增大，然后减小. 如果二项式的幂
指数是偶数，那么，位于展开式的中间一项的二项式系数最
大. 如果二项式的幂指数是奇数，那么，位于展开式的中间的
两项的二项式系数彼此相等而且最大.
    5°. 为了写出等式（1）的通项，把二项式幂的展开式中的
第 k+1 项当作第 k 项，较为方便，并记作 T_k. 于是有
                  T_k=C_n^k a^{n-k}b^k， k=0，1，⋯，n.         (2)
    例如，第一项 T_0=C_n^0 a^n b^0，第二项 T_1=C_n^1 a^{n-1}b^1，第三
项 T_2=C_n^2 a^{n-2}b^2.
    例2. 求 (z^{1/2}+z^{2/3})^{12} 的展开式的第四项.
    根据公式（2），展开式的第四项等于
                  T_4=C_{12}^4(z^{1/2})^8(z^{2/3})^4=495z^{20/3}.
    例 3. 求 (z+z^{-2})^{12} 的展开式中不包含 z 的项，即 z 的幂
指数等于零的项.
    根据公式（2），得
                  T_k=C_{12}^k z^{12-k}(z^{-2})^k=C_{12}^k z^{12-3k}.
    根据题的条件，12-3k=0，得 k=4. 因此，展开式的第
四项 z 的幂指数等于零.
    例4.* (1+0.01)^{1000} 的展开式中，第几项最大？
    T_{k+1}/T_k=(C_{1000}^{k+1}×0.01^{k+1})/(C_{1000}^k×0.01^k)=(0.01×k!(1000-k)!)/((k+1)!(1000-k-1)!)
```

### Object inventory and source qualifications

- `p0040-corollary-2-tail`: one prose line finishes the exponent-sum
  statement begun on printed page 32.
- `p0040-corollary-3`: two lines, including the symmetry identity
  `C_n^m=C_n^{n-m}` on the second line.
- `p0040-corollary-4`: four lines discussing coefficient growth, decline,
  and the central maximum or pair of equal central maxima.
- `p0040-corollary-5`: two introductory lines and numbered display (2).
  The printed phrase `把二项式幂的展开式中的` is underlined by a
  long irregular line. The print explicitly says `第 k+1 项当作第 k 项`.
- `p0040-index-examples`: two wrapped lines explicitly map first, second,
  third to `T_0`, `T_1`, `T_2`. Keep this alongside the preceding convention;
  do not replace the displayed subscript with an ordinary ordinal.
- `p0040-example-2`: one task line, one explanation line, one display.
  The visible task and explanation both say `第四项`; the visible display
  says `T_4`, coefficient `C_{12}^4`, powers 8 and 4, and `495z^{20/3}`.
  The variable is z-shaped, with stacked fractional exponents 1/2 and 2/3.
- `p0040-example-3`: two task lines, one introduction, one display, and
  two conclusion lines. The last phrase crosses a line break as `第` /
  `四项`. The task is to find a z-independent term; the visible solution
  gives k=4, not a supplied constant coefficient.
- `p0040-example-4-head`: a starred `例4.*`, a largest-term question for
  `(1+0.01)^{1000}`, and the ratio of adjacent terms in two successive
  fraction equalities. The three ratio expressions run horizontally on
  one display line. The ratio continues on printed page 34.
- No standalone exercise heading, geometric figure, table, or blank occurs.
  Footer is printed 33 with flanking dots. Left edge dirt is non-content.
- The first/second/third indexing examples and both later `第四项`
  statements are clear printed text, not uncertain readings. Their mutual
  consistency is a mathematical issue, not a glyph issue.
- Fractions, asterisk, degree-like marks, C/z-shaped letters, and all other
  symbols are visual readings; their original Unicode provenance is unknown.

## Page 0041 / printed page 34

Source: `.tmp/stemrobin-184-six/n9-nov23-source3842/9c/pages/0041/page.png`.
One original open. This section is the independent pixel freeze for this page.

### Literal transcription

```text
            =(1000-k)/(100(k+1)).
    我们来考查一下，当 k 是多大的数时，T_{k+1}/T_k≥1：
                  (1000-k)/(100(k+1))≥1 ⇔ k≤8 92/101.
因此，当 k≤8 时，T_{k+1}/T_k>1，对于其他的 k，即对于 k≥9，
T_{k+1}/T_k<1.
    因此，(1+0.01)^{1000} 的展开式的项随着项的序号的增大
而逐步增大，一直到 T_9，然后逐步减小. 因此，T_9 是展开式的
最大项.
    注 应当注意展开式各项的系数和展开式各项的二项式系数之间
是有区别的. 例如，展开式
             (2a-3b)^4=16a^4-96a^3b+216a^2b^2-216ab^3+81b^4
的第三项的系数等于 216，但是它的二项式系数等于 C_4^2=6.

                           习    题

71. 求二项展开式：
    а) (a+b)^6；             б) (x+y)^5；             в) (x-y)^5；
    г) (√x-√y)^4；           д) (x^{1/3}+y^{1/3})^5；  е) (x-2y)^6；
    ж) (3x-1)^7；            з) (1+y^2)^4；            и) (p^{-2}-1)^6；
    к) (1/y+2)^5.
72. 求 (a^3-ab)^{31} 的展开式的中间两项.
73. 利用牛顿公式证明：
```

### Object inventory and source qualifications

- `p0041-example-4-tail`: one ratio continuation display, one prose
  question including a fraction, one inequality display, two wrapped
  prose lines comparing ratios, and three prose lines concluding T_9
  is largest. `8 92/101` is a mixed-number display, not a product.
- `p0041-coeff-note`: the `注` paragraph has two lines before a single
  `(2a-3b)^4` display and one prose line after. It explicitly distinguishes
  ordinary term coefficient 216 from binomial coefficient `C_4^2=6`.
- `p0041-exercise-heading`: centered `习 题` introducing the exercise set.
- `p0041-ex71`: the visible identifier 71 and command `求二项展开式：`.
  Subpart positions and labels are independently inventoried as:
  row 1 left `а)` `(a+b)^6`; center `б)` `(x+y)^5`; right `в)` `(x-y)^5`;
  row 2 left `г)` `(√x-√y)^4`; center `д)` `(x^{1/3}+y^{1/3})^5`;
  right `е)` `(x-2y)^6`;
  row 3 left `ж)` `(3x-1)^7`; center `з)` `(1+y^2)^4`;
  right `и)` `(p^{-2}-1)^6`;
  row 4 left `к)` `(1/y+2)^5`.
  The square-root bars cover x and y individually. Each 1/3 is a
  stacked exponent fraction. In the last subpart, 1/y is a stacked
  fraction inside parentheses with +2.
- `p0041-ex72`: one complete task line, identifier 72, exponent 31,
  base `a^3-ab`, asking for the middle two terms.
- `p0041-ex73-head`: identifier 73 and proof command only; no identity
  belonging to 73 is printed on this page.
- The label transcription uses convenient Cyrillic Unicode for the visible
  Russian alphabet forms. This is NOT evidence of physical original
  codepoints. In particular а/е/к-shaped labels have Latin-looking
  confusables; the less confusable б/г/д/ж/з/и shapes support the visual
  alphabet reading, but no raster can prove its former encoding.
- No geometric diagram, table, or answer blank occurs. The exercise array
  is a typographic three-column arrangement, not a mathematical table.
  Footer is printed 34 with flanking dots. Right edge blobs and bottom
  boundary dirt are non-content. No unresolved mathematical glyph was
  identified in the exercise statements on this page.

## Page 0042 / printed page 35

Source: `.tmp/stemrobin-184-six/n9-nov23-source3842/9c/pages/0042/page.png`.
One original open. This section is the independent pixel freeze for this page.

### Literal N9 transcription

```text
    а) (a+b)^n 的展开式的全部二项式系数之和等于 2^n；
    б) 展开式的偶数项二项式系数之和等于奇数项二项式
    系数之和.
    提示.    а) 设牛顿公式中 a=1，b=1.
             б) 设牛顿公式中 a=1，b=-1.
```

### Adjacent-section text, boundary only

The following is visible on the same allowed original. It is retained solely to
make the section boundary explicit, not included among N9 tasks or mathematical
requirements and not reviewed for mathematical or historical correctness.

```text
                 10* 历史知识·组合分析在
                       概率论中的应用
    组合分析的某些问题早就引起古希腊数学家的兴趣. 但
目前编入普通中学教程的组合分析的基本内容，是随着代数
学和概率论的发展，由 17 世纪和 18 世纪的数学家——帕斯
卡、莱布尼兹、雅可比和伯努利等人取得的.
    毫无疑问，我们每个人都遇到过这样的情况：议论过某
一事件产生的“可能性”；谈论过某一事件“十分可能”、“很少
可能”发生，或同另一事件“一样可能”发生等等. 概率论是同
如下情况，即某些事件发生的概率能够用准确的数量来估计
的情况相关的. 最简单的是具有某种对称性的情况. 例如，
在投掷一颗正立方体的骰子时，自然认为掷 1 点、2 点、3 点、
4 点、5 点或 6 点是概率相等的事件，从而认为每一事件的概
率是 1/6. 因为六种情况中有三种情况掷出的点数是偶数，所
以自然会认为，掷出偶数点的概率等于 3/6=1/2.
    总之，有利于某事件的情况的数目和互相排斥的情况总
数之比叫做这个事件的概率.
    我们举几个例子.
```

### Object inventory and source qualifications

- `p0042-ex73-a`: one subpart line completing exercise 73 from page 34.
  The statement concerns BINOMIAL coefficients, not arbitrary numeric
  coefficients of a substituted binomial. It explicitly gives `2^n`.
- `p0042-ex73-b`: a second subpart over two physical lines, comparing
  sums of coefficients of even-numbered and odd-numbered TERMS.
  It does not literally say even/odd k, and prints no `n≥1` assumption.
- `p0042-ex73-hints`: `提示.` and two hint lines, visually labeled
  а-shaped / б-shaped, prescribing (a,b)=(1,1) and (1,-1).
- `p0042-next-heading`: a centered, two-line, starred section 10 heading.
  N9 ENDS immediately before this heading.
- `p0042-next-body`: adjacent N10 historical introduction, a prose
  dice/equal-chance example containing inline fractions 1/6 and 3/6=1/2,
  a two-line wavy-underlined probability definition, and `我们举几个例子.`.
  No die drawing or other geometric image accompanies the text.
  These are not N9 inventory targets or authorized solution tasks.
- Footer is printed 35 with flanking dots. Left edge ink blobs and minor
  marks are scan artifacts, not mathematical objects.
- As for page 34, the Unicode labels are visual editorial transcriptions,
  not recovered physical codepoints. No unresolved content glyph is
  identified in the N9 portion.

## Freeze boundary and phase-A holds

All five page sections above were frozen from one original observation apiece,
before any candidate exposure. There has been no candidate exposure.
No source files were modified. Only independent evidence files are authorized.

- `SOURCE-GLYPH-01`: page 0038's final exponent in the opening square
  expansion is worn. The literal transcript retains `[2?]`. Mathematical
  expectation is 2; it does not prove an exact printed glyph or encoding.
  HOLD any claim of fully certain diplomatic glyph transcription there.
- `MATH-INDEX-01`: page 0040 prints first term `T_0` but calls the `T_4`
  worked result in Example 2 the fourth term. Its task and result need an
  explicit ordinal/convention decision; do not silently repair the source.
- `MATH-INDEX-02`: page 0040 Example 3 gives k=4 for the constant term
  but literally concludes `第四项`. Under the page's explicit first-term
  `T_0` mapping, that is the fifth term.
- `MATH-ASSUMPTIONS`: exercise 73's parity identity requires n to be a
  positive integer, not n=0; radical, negative-power, and denominator
  exercises need explicit domains when presented as real-valued tasks.
  Their exact mathematical qualifications are derived in `source-math.md`.

This is a source/mathematics freeze, not acceptance of a candidate or final lesson.
No template, finalizer, count, Git landing, database, or publication approval is given.
