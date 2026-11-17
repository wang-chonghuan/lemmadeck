# n97 Independent Views-Only Review: Stage2

Reviewer: independent choice reviewer n97, STEMROBIN-184, 2026-11-17.
Status: Stage2 frozen; WAIT for explicit Stage3 internals.

## Snapshot and Isolation

Only candidate text read: `../author/views.json`.
Raw-byte SHA-256: `30667c88c102bdcdc8a436747c413437edbfb271d3d4a90798c09971224b827f`.
The ten entries contain 42 options. References below use their question and
option IDs; exact JSON pointers are indexed in `stage2-ledger.md`.

Source authority remains the Stage1 seed, canonical SHA-256
`54cb3765d97f5f74b7dc26cf5ff7cfd2e5c552f9545a0582412e5f28e67cf091`.
Unchanged Stage1 raw-byte hashes:
`source-first.md`: `d56409b043adb7e0715e27e675f63a920d72f582411fdf77e9d2c68ac42437ac`;
`ledger.md`: `78384113f2161bf5133dc78237d9b0398aa574b4217541490aa47b1d86e55e45`.
No author solution, draft, key, rationale, misconception record, or handoff
was read. Independent truth below is not an assertion of author-key agreement.

## First: Fidelity, Redundancy, and Leakage

Assessment standard: substantive derivative/proof recognition is permissible;
it need not establish independent written proof production. Source functions,
intervals, signs, root conventions, and the primitive relationship must remain
mathematically relevant. Recognition and reasonable elimination are not,
by themselves, evidence of leakage.

| Question | Fidelity assessment before true-set enumeration | Redundancy and leakage assessment |
| --- | --- | --- |
| n97-392 | Acceptable proof-step recognition, not a full primitive proof. Both subparts retain finite difference quotients, constant cancellation, cube factorization, and trigonometric addition. The explicit $h\ne0$ and $x,x+h\in I_i$ conditions preserve admissible increments. Taking limits and concluding $F_i'=f_i$ are not requested. | The target derivatives do not identify the quotient identities by copying. Radical and sine subparts require different reasoning. Shared structure with 393 is transferable algebra, not disclosure of that question's answer. |
| n97-393 | Acceptable proof-step recognition with the same final-limit loss. The squared cube-root numerator and minus-cosine increment distinguish this from 392; neither the extra factor $u+v$ nor the trigonometric signs can be copied from $f_i$. | This is not a duplicate cube-root task: the difference of squares survives cancellation of a difference of cubes. Its trigonometric sign issue differs from 392's additive constant. |
| n97-394 | Acceptable derivative-proof recognition. A chain-rule product and a quotient-rule numerator must be judged on the original positive and tangent intervals; a false closed-interval extension is explicitly tested. Simplifying the derivative to $f_i$ and producing a proof are not separately required. | Correct-looking targets alone do not settle the chain or quotient rule. False claims include mathematical formulas and a substantial domain claim, not just visibly mismatched targets. 395 transfers the quotient-rule method but changes numerator, sign, and poles. |
| n97-395 | Acceptable derivative-proof recognition. The inner derivative $3x^2$, subtraction of a negative cotangent derivative, and the original open intervals are substantive. Full written simplification and proof construction are replaced by recognition. | The paired radical/cotangent reasoning is distinct from 394. Missing inner factor, wrong outer sign, and a false finite-limit claim test different errors. |
| n97-396 | Acceptable complete-assertion recognition of both source subparts. The derivative of each fixed constant and of $-1/x$, the two separate half-lines, and exclusion of zero are retained. | The derivative clause alone is insufficient: B and C share that correct clause, but B adds a false global extension. D requires rejecting a sign change caused solely by negative $x$. This prevents target-only selection. |
| n97-397 | Acceptable branch-based primitive recognition. Both half-line conclusions depend on $|x|=x$ or $|x|=-x$, not merely matching the displayed $f_\pm$. Zero is an added, relevant differentiability boundary, not a replacement interval. | B and C cover distinct source branches. D versus E tests symmetric versus ordinary derivative limits. Opposed claims in a multiple-choice item are normal mathematical contrasts, not an independent answer channel. |
| n97-398 | Acceptable recognition of a primitive of the original cubic on all $\mathbb R$. Shifted-square expressions require differentiating or expanding and canceling an extra linear term. It does not require constructing a primitive or stating its complete family. | All options share the same base expression; its derivative alone cannot select an answer. The correct polynomial is not printed in the stem. |
| n97-399 | Acceptable recognition of a primitive of the original quartic on all $\mathbb R$. Binomial expansion or differentiation must account for every cancellation term. Construction and the complete family are not elicited. | A and B differ by constant versus linear subtraction, which is a real derivative distinction. C changes a coefficient. 398 does not supply these cancellation terms. |
| n97-400 | Acceptable recognition of two primitives of the original linear function on all $\mathbb R$. Shift corrections and additive-constant freedom remain meaningful; construction and the entire family are not requested. | The two valid functions are equivalent modulo a nonzero constant, intentionally testing nonuniqueness rather than duplicating the same expression. Earlier polynomial items teach a method, not these option truths. |
| n97-401 | Acceptable constant-primitive family recognition, retaining all real $C$ and all real $x$. The stem explicitly provides $2\frac12=\frac52$, so independent mixed-numeral decoding is lost. The core task of obtaining a linear primitive remains. | Stating the numerical value of the given $f$ is not disclosure of a primitive: copying it as $F_C$ gives the constant-function distractor. A, B, and C still require rejecting wrong slope, zero derivative, or variable derivative. |

Capacity losses must remain explicit in the later internal comparison:
392-393 test the algebraic difference-quotient stage but not the final limits;
394-397 recognize derivative arguments rather than produce full proofs;
398-400 recognize particular primitives rather than construct all primitives;
401 supplies numeral conversion and offers the primitive family for recognition.
These are real losses, not a claim of full written-task equivalence.

The recognition-level fidelity assessment is acceptable because every source
subpart still has a nontrivial, source-specific mathematical distinction.
In particular, 392-393 are partial proof-step tasks, not completed derivative
verifications: quotient algebra could be solved without knowing its final limit.
Author internals must not claim those final steps were independently assessed.
No essential source subpart disappears at the stated recognition level.

Package transfer: 392-393 share cube factorization and trigonometric increments;
394-395 share the quotient rule and $\sin^2x+\cos^2x=1$; 396 and 397 both exclude
zero for different reasons. These are legitimate mathematical connections.
No visible question prints another question's required true set or exact
primitive. 398-400 require different polynomial cancellations, and 401 requires
a constant slope rather than those cancellations. No source-number mapping,
author key, truth marker, or solution prose is exposed in the views.

## Second: Independent Mathematics, Every Option

T/F below denotes the truth of the entire visible assertion, including domains
and conjunctive clauses. All counterexamples obey the relevant stem conditions.

### n97-392: True Set {B, C}

For the radical subpart, $h=u^3-v^3$, $u,v>0$, and $h\ne0$ implies $u\ne v$.
For the sine subpart, expand $\sin(x+h)$ before subtracting $\sin x$.

| Option | Truth | Independent calculation or counterexample |
| --- | --- | --- |
| A | F | The two additive constants cancel: $(3-3)/h=0$, not $3/h$. At $x=0,h=1$, the true quotient is $\sin1$ but the option gives $\sin1+3$. |
| B | T | $u^3-v^3=(u-v)(u^2+uv+v^2)$, so $3(u-v)/h=3/(u^2+uv+v^2)$. All divisions are justified; the last denominator is positive. |
| C | T | $\sin(x+h)-\sin x=\cos x\sin h+\sin x(\cos h-1)$, and division by nonzero $h$ gives exactly the asserted quotient. |
| D | F | At $x=1,h=7$, $u=2,v=1$. The true quotient is $3/7$; the final expression is $3/(2-1)^2=3$. |

The omitted proof completion is independently valid:
$u\to v$ gives $3/(3v^2)=1/\sqrt[3]{x^2}$; the sine quotient tends to
$\cos x$ using $\sin h/h\to1$ and $(\cos h-1)/h\to0$.

### n97-393: True Set {A, C}

For positive inputs $\sqrt[3]{(x+h)^2}=u^2$ and $\sqrt[3]{x^2}=v^2$.
The constants $-5$ and $4$ disappear from their respective increments.

| Option | Truth | Independent calculation or counterexample |
| --- | --- | --- |
| A | T | $(3/2)(u^2-v^2)/(u^3-v^3)=3(u+v)/[2(u^2+uv+v^2)]$, canceling the nonzero $u-v$. |
| B | F | This is the negative of the actual minus-cosine increment. At $x=\pi/2,h=\pi/2$, the true quotient is $2/\pi$, whereas the option gives $-2/\pi$. |
| C | T | $\cos x-\cos(x+h)=\cos x(1-\cos h)+\sin x\sin h$; divide by $h$. |
| D | F | Cancellation must retain $u+v$. At $x=1,h=7$, the quotient is $(3/2)(4-1)/7=9/14$, not $3/14$. |

The omitted limits are $3(2v)/[2(3v^2)]=1/v=1/\sqrt[3]{x}$ and $\sin x$.
The finite-quotient question itself does not require performing these limits.

### n97-394: True Set {A, C}

| Option | Truth | Independent calculation or counterexample |
| --- | --- | --- |
| A | T | On $x>0$, the chain-rule product is $(3/4)(1/3)(x^4)^{-2/3}(4x^3)=x^{3-8/3}=x^{1/3}=f_1(x)$. |
| B | F | Differentiating $\sin x/\cos x$ gives a plus in the numerator. At $x=\pi/4$, the proposed derivative is $0$, but the actual derivative is $2$. |
| C | T | $\cos x>0$ on $(-\pi/2,\pi/2)$. The quotient-rule numerator is $\cos x\cos x-\sin x(-\sin x)=\cos^2x+\sin^2x=1$; $-\sqrt2$ differentiates to zero. |
| D | F | From inside the interval, $\tan x\to+\infty$ at $\pi/2$ and $\tan x\to-\infty$ at $-\pi/2$; $1/\cos^2x\to+\infty$ at both. There is no finite continuous extension. |
| E | F | At $x=8$, $\sqrt[3]{x^4}=16$, not $64=x^2$. The actual derivative is $2$, not $(3/4)(16)=12$. |

### n97-395: True Set {B, C}

| Option | Truth | Independent calculation or counterexample |
| --- | --- | --- |
| A | F | The derivative of the inner $x^3$ is missing. At $x=1$, this expression is $1/3$, while $F_1'(1)=1$. |
| B | T | $\sin x>0$ on $(0,\pi)$. $(\cot x)'=[(-\sin x)\sin x-\cos x\cos x]/\sin^2x=-1/\sin^2x$; subtracting it gives positive $1/\sin^2x$. |
| C | T | The chain-rule product is $(2/3)(3x^2)/(2\sqrt{x^3})=x^2/x^{3/2}=\sqrt x$ on $x>0$. |
| D | F | At $x=\pi/2$, the actual derivative of $3-\cot x$ is $1$, not $-1$. |
| E | F | $\cot x\to+\infty$ as $x\to0^+$ and $\cot x\to-\infty$ as $x\to\pi^-$; $1/\sin^2x\to+\infty$ at both endpoints. No finite continuous extension exists. |

### n97-396: True Set {C}

| Option | Truth | Independent calculation or counterexample |
| --- | --- | --- |
| A | F | $14$ and $9$ have zero derivative. At $x=-1$ in $I_1$ the actual derivative is $1$, not $15$; at $x=1$ in $I_2$ it is $1$, not $10$. |
| B | F | The local derivative clause is true, but $1/x\to-\infty$ from the left of zero and $+\infty$ from the right. Neither the reciprocal nor $1/x^2$ has a finite extension at zero. |
| C | T | For every $x\ne0$, $(c-x^{-1})'=0-(-x^{-2})=x^{-2}$. Both given half-lines avoid zero, so the original two primitive conclusions hold on their respective intervals. |
| D | F | At $x=-1$, $F_1'(x)=1$, not $-1$. Negative input does not change the sign of the positive derivative $x^{-2}$. |

### n97-397: True Set {B, C, E}

| Option | Truth | Independent calculation or counterexample |
| --- | --- | --- |
| A | F | At $x=-1$, $|x|=1\ne-1=x$. Throughout $I_-$, $|x|=-x$ and $F'=-1=f_-$, contradicting both its branch and conclusion. |
| B | T | Throughout $I_+$, $|x|=x$, and its derivative is $1=f_+$. |
| C | T | Throughout $I_-$, $|x|=-x$, and its derivative is $-1=f_-$. |
| D | F | The symmetric quotient is indeed zero for every $h\ne0$, because $|h|=|-h|$, but it is not the ordinary derivative criterion. $[F(h)-F(0)]/h=|h|/h$ has distinct right and left limits $1,-1$, so $F'(0)$ does not exist. |
| E | T | The ordinary one-sided quotients are exactly $1$ for $h>0$ and $-1$ for $h<0$. Their disagreement excludes a derivative at zero and does not invalidate either open-half-line primitive statement. |

### n97-398: True Set {B}

Let $G=(x^2+1)^2/4=x^4/4+x^2/2+1/4$, so $G'=x^3+x$.
All four candidate functions are polynomials on $\mathbb R$.

| Option | Truth | Independent calculation or counterexample |
| --- | --- | --- |
| A | F | $F'=x^3+x$; at $x=1$ this is $2$, not $f(1)=1$. |
| B | T | $F'=x^3+x-x=x^3$ for all real $x$. Equivalently $F=x^4/4+1/4$, a member of the source primitive family. |
| C | F | $F'=x^3+x-2x=x^3-x$; at $x=1$ this is $0$, not $1$. |
| D | F | $F'=x^3+x-1/2$; at $x=0$ this is $-1/2$, not $0$. |

### n97-399: True Set {B}

Let $H=(x+1)^5/5$. Then
$H'=(x+1)^4=x^4+4x^3+6x^2+4x+1$.
All three functions are polynomials on $\mathbb R$.

| Option | Truth | Independent calculation or counterexample |
| --- | --- | --- |
| A | F | Subtracting the derivatives of $x^4+2x^3+2x^2+1$ gives $F'=x^4+1$; at $x=0$ this is $1$, not $0$. |
| B | T | Subtract $4x^3+6x^2+4x+1$ from $H'$ to get $x^4$. Expanding $H$ gives $F=x^5/5+1/5$. |
| C | F | The derivative of $4x^4$ is $16x^3$, not $4x^3$. Thus $F'=x^4-12x^3$; at $x=1$ this is $-11$, not $1$. |

### n97-400: True Set {A, D}

All four candidates are polynomials on $\mathbb R$.

| Option | Truth | Independent calculation or counterexample |
| --- | --- | --- |
| A | T | $F'=(x+1)-1=x$; expansion gives $F=x^2/2+1/2$. |
| B | F | $F'=x+1$; at zero this is $1$, not $0$. Subtracting a constant cannot remove the shift in the derivative. |
| C | F | $F'=(x-2)-2=x-4$; at zero this is $-4$, not $0$. |
| D | T | $F'=(x-2)+2=x$; expansion gives $F=x^2/2+2$. This differs from A by $3/2$, a constant. |

### n97-401: True Set {D}

$2\frac12=2+1/2=5/2$ is the constant target.
For each option, $C$ is any fixed real constant, so $dC/dx=0$.

| Option | Truth | Independent calculation or counterexample |
| --- | --- | --- |
| A | F | $F_C'=1\ne5/2$, for every $C$. |
| B | F | $F_C'=0\ne5/2$, for every $C$; copying the constant target as a constant function is not integration. |
| C | F | $F_C'=(5/2)x$, not the constant $5/2$. At $x=0$ the derivative is zero for every $C$. |
| D | T | $F_C'=5/2$ for every real $x$ and every real $C$. Each function is defined and differentiable throughout $\mathbb R$. |

Thus every independent true set is nonempty and agrees with the displayed mode:
the single-mode questions each have exactly one true option. No undefined
expression or unresolved convention prevents mathematical determination.

## Existing Screenshot Evidence and Limits

The parent described viewport captures at desktop 1440x960 and mobile 390x844.
These are full-page images, not single-viewport crops. Each exact asset was
opened once with `detail=original`; no crops, reopens, resets, or new render
were made.

| Screenshot | Raw-byte SHA-256 | Stored dimensions and visual observation |
| --- | --- | --- |
| `../../offline/ana10-c7-s1-n97/choices-1440.png` | `6db80510322736f6518abfcc4ff4fcc07ad7f9cf20fb578708cb1fbbffc50c6e` | PNG 1440x5159. The supplied display shows a centered single column, ten sequential sections, rendered formulas, and checkbox/radio markers. The bottom reaches question 10's D option; no gross section truncation is apparent. |
| `../../offline/ana10-c7-s1-n97/choices-390.png` | `6944388995e37050250eac4b0b2c342ef5571937c6e9a667a20e4f63d993ad51` | PNG 390x6979. An explicit tool notice says it was resized to 335x6000. Long quotient chains and prose wrap onto multiple lines; the ten-section stack extends through question 10's D option. This is a reduced tall-page observation, not native-pixel fine-detail certification. |

The desktop call supplied no resize notice, but the tool did not certify
the actual on-screen display ratio. No claim of a certified 1:1 inspection,
minimum rendered font size, perfect fine-detail readability, or absence of
every possible local overlap is made for either image. The mobile reduction
particularly limits confidence about small fraction bars, subscripts, and
wrapped formula spacing. Gross page completeness is observable; microscopic
legibility and interaction behavior are not established by this evidence.

The existing `../../offline/ana10-c7-s1-n97/choices-report.json` was read,
not regenerated. Its raw-byte SHA-256 is
`ecc2b708545100f6eec2223f2ba9ab3606bd6d19cee7b49f71580b0216fb1176`.
It reports `status=pass`, both viewport widths equal to document widths,
and 42 option boxes per width. Reported option extents are
377.59375..1062.40625 at width 1440 and 16..374 at width 390.
These existing measurements support horizontal containment of option boxes;
they do not independently certify all glyphs or fine visual detail.
The report itself limits coverage to offline view-only layout, excluding
judging, persistence, OS behavior, and product integration.

Image budget: started 0/8 batch and 0/24 context; now permanently 2/8 batch
and 2/24 context. No image payload is relayed to the parent.

## Stage2 Disposition

Views-only fidelity, redundancy, and leakage: acceptable at the explicitly
bounded recognition level, with the capacity losses above retained.
Independent mathematics: complete for all ten questions and all 42 options.
Visual evidence: broad full-page layout inspected; fine-detail certification
remains limited, not inferred from the report's `pass`.
No claim about author-key agreement, distractor misconception derivations,
internal limitation disclosure, or a final aggregate candidate verdict is made.
Leave both Stage1 files and both new Stage2 files immutable after freezing.
STOP. WAIT for explicit Stage3 internal comparison.
