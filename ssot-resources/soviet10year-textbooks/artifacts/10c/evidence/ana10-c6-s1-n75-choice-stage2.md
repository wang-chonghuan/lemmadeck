# ana10-c6-s1-n75 Independent Choice Review: Stage2

2026-11-15. Independent reviewer, not author Peirce.
Learner-view-only review, before author intent/key/coverage disclosure.

## Freeze And Boundary

Authorized views:
`.intentfold/tickets/STEMROBIN-184/tmp/ana10-c6-s1-n75-views.json`.
Raw SHA-256:
`32074badde4b312033322a54675207a7619449503d7191cd46bb86656dffa578`.

Reused frozen source record:
`.intentfold/tickets/STEMROBIN-184/tmp/ana10-c6-s1-n75-choice-stage1.md`.
Raw SHA-256:
`35dfd3c92f8e0c52b1d32bf31538fe4269d0ace2480a84ed6a95af0d68c44a20`.
The authorized written-heading confirmation in that record establishes
that original sources1-10 ask for derivative functions.

The views contain11 questions and49 options:9 single,2 multiple.
Every top-level entry contains only `id` and `view`; all question and
option figure lists are empty. No actual image is required or opened.
No draft, author notes/source, internal key/rationale/coverage, standard
answer, answer key, interaction, history, old choices or tests were read.
No browser, validator, source/tool/application edit, service, dependency,
database, publisher, promotion or cross-chat action occurred.
Only this Stage2 report is written.

The parent's reported initial serialization false-positive is not
investigated or used as semantic evidence here. No serialization repair
or structural-validation rerun is performed.

Review order: visible task fidelity/redundancy/leakage/capacity were
examined first; every option was then independently calculated or
refuted, without a key or an inference from `single` mode.
The sets below are reviewer results, not a transcription of an author key.

## Complete Independent True Sets

| Learner question ID | Independently inferred original sources | Complete true set |
| --- | --- | --- |
| sine-linear | 1 | {c} |
| half-angle-phase | 2 | {a} |
| complement-and-reversal | 3 | {d} |
| nested-square | 4 | {b} |
| difference-identity | 5 | {a} |
| constant-cancellations | 6,7 | {a} |
| sum-with-phase | 8 | {d} |
| power-and-reflected-phase | 9 | {c} |
| quarter-turn-product | 10 | {b} |
| uniform-sign-proofs | 11,14 | {a,c} |
| amplitude-and-function-study | 12,13 | {a,b,c,d,e,f} |

Exactly17 options are true and32 are false. All49 are checked below.
The source mapping is inferred from the visible function formulas/tasks,
not from an unopened internal `source_numbers` or coverage record.

## Per-Question Evidence

### sine-linear

Fidelity PASS: the original all-real derivative task is retained, including
inner argument3x. Redundancy PASS: this tests a scaling factor, unlike the
next question's phase reversal and half-factor. Leakage PASS: the stem
gives only the original function/domain, not a derivative; the alternatives
are function identities, not answers at a supplied test point.
Capacity loss: expression recognition replaces independently producing
the derivative and its chain-rule derivation.

Independent computation: $(\sin3x)'=3\cos3x$ on $\mathbb R$.

| Option | Truth | Concrete evidence |
| --- | --- | --- |
| a | False | Missing inner factor3; at x=0 it gives1, actual derivative3. |
| b | False | Sine is not the outer derivative; at x=0 it gives0, actual3. |
| c | True | Outer cosine multiplied by $(3x)'=3$. |
| d | False | Inner factor is positive3, not negative3; at x=0 it gives-3. |

### half-angle-phase

Fidelity PASS: the half-factor and addition of pi are unchanged.
Redundancy PASS: both negative phase-shift sign and factor1/2 distinguish
this task from sine-linear. Leakage PASS: no equivalent simplification or
derivative is supplied as a stem fact.
Capacity loss: recognition does not demonstrate producing a chain-rule
calculation independently.

Independent computation:
$g'=\frac12\cos(x/2+\pi)=-\frac12\cos(x/2)$.

| Option | Truth | Concrete evidence |
| --- | --- | --- |
| a | True | Both phase sign and inner derivative1/2 are retained. |
| b | False | Twice the actual function derivative; at x=0, -1 rather than -1/2. |
| c | False | Incorrect phase sign; at x=0, +1/2 rather than -1/2. |
| d | False | Sine rather than cosine; at x=0, 0 rather than -1/2. |

### complement-and-reversal

Fidelity PASS: the input reversal in pi/2-x is retained.
Redundancy PASS: the inner derivative is -1 and the complementary-angle
identity produces sine, unlike either preceding derivative.
Leakage PASS: the visible stem does not supply h=cos x or h'=-sin x.
Capacity loss: choosing the final expression does not demonstrate
independent production of the simplification/differentiation.

Independent computation:
$h'=-\cos(\pi/2-x)=-\sin x$.

| Option | Truth | Concrete evidence |
| --- | --- | --- |
| a | False | At x=pi/2, +1 instead of the actual -1. |
| b | False | At x=0, +1 instead of the actual0. |
| c | False | At x=0, -1 instead of the actual0. |
| d | True | Sine differentiation with inner factor-1, then the complementary identity. |

### nested-square

Fidelity PASS: the coefficient3, square of sine and affine argument are
all retained; no sampled-point question replaces the derivative function.
Redundancy PASS: this adds an outer power layer to the scaling task.
Leakage PASS: the final coefficient12 is not supplied in the stem.
Capacity loss: full chain/power-rule production is replaced by recognition.

With v=2x-1,
$M'=3\cdot2\sin v\cos v\cdot2=12\sin v\cos v$.

| Option | Truth | Concrete evidence |
| --- | --- | --- |
| a | False | Missing inner factor2; at v=pi/4, gives3 rather than6. |
| b | True | Correct coefficient3 times square factor2 times inner factor2. |
| c | False | Differentiating the square does not yield cos-squared; at v=0, gives12 rather than0. |
| d | False | Keeping sine-squared is incorrect; at v=pi/2, gives12 rather than0. |

### difference-identity

Fidelity PASS: the source derivative task is retained in a complete
identity-plus-derivative record; the identity provides a valid route, not
a substituted unrelated task. Redundancy PASS: cancellation of angles
2t-t differs from oddness/double-angle cancellation in the next question.
Leakage PASS: no stem assertion tells the learner that f=sin t.
Capacity loss: a correct complete record does not demonstrate independently
writing the identity or derivative.

Independent computation:
$\sin2t\cos t-\sin t\cos2t=\sin(2t-t)=\sin t$, hence $f'=\cos t$.

| Option | Truth | Concrete evidence |
| --- | --- | --- |
| a | True | Both the subtraction identity and derivative are correct. |
| b | False | It uses the addition angle3t; at t=pi/6, actual f=1/2 but claimed f=1. |
| c | False | Identity is correct, derivative factor3 is not; at t=0, actual f'=1 but claimed3. |
| d | False | Difference order has been reversed; at t=pi/2, actual f=1 but claimed-1. |

### constant-cancellations

Fidelity PASS: both original derivatives are tested in one complete
record. Oddness makes the first function0; the double-angle identity makes
the second5, so the distinct constant values are not erased.
Redundancy PASS: the two inputs use different identities but share the
constant-derivative consequence. Leakage PASS: no original identity is
supplied in the stem. Solving only the first leaves a/c/d; solving only
g=5,g'=0 leaves a/b. Neither source alone fixes the complete record.
Capacity loss: joint record recognition replaces two independently
written simplifications/derivative calculations.

Independent computation: $f=0,f'=0$ and $g=5,g'=0$ for every real x.

| Option | Truth | Concrete evidence |
| --- | --- | --- |
| a | True | Both constant functions and both zero derivatives are correct. |
| b | False | sin(-x)=-sin x, not +sin x; at x=pi/2, actual f=0 but claimed2. |
| c | False | The double-angle terms cancel completely; at x=pi/4, actual g=5 but claimed4; at x=0, claimed g'=-2 rather than0. |
| d | False | No doubled residual sine remains; at x=pi/4, claimed g=7 rather than5; at x=0, claimed g'=4 rather than0. |

### sum-with-phase

Fidelity PASS: both summands, their common inner factor2 and exact shift3.5
are retained for all real x. Redundancy PASS: a sum with a non-special phase
does not duplicate the earlier subtraction identity or constant cancellations.
Leakage PASS: neither a sum-to-product identity nor a derivative is given.
Capacity loss: derivative-expression recognition replaces production.

Independent computation:
$D(x)=2\cos(2x-3.5)+2\cos2x$.
For a concrete comparison put x=7/8; then both cosine terms equal
$C=\cos(7/4)\ne0$, so the actual derivative is4C.

| Option | Truth | Concrete evidence |
| --- | --- | --- |
| a | False | Missing factor2 in both summands; at x=7/8 gives2C rather than4C. |
| b | False | The sum becomes a difference; at x=7/8 gives0 rather than4C. |
| c | False | Uses negative sines, not cosines; at x=7/8 the opposite sine terms cancel to0 while D=4C. |
| d | True | Each sine differentiates to cosine with its own inner factor2. |

### power-and-reflected-phase

Fidelity PASS: the linear term, exact coefficient3.6, fifth power and
reflected argument are retained. Redundancy PASS: this tests a power5
and two sign reversals, not the square-power calculation again.
Leakage PASS: the simplified supplementary-angle derivative is not
given in the stem. Capacity loss: expression recognition replaces
production of the power/chain-rule derivation.

Independent computation:
$M'=2-18\sin^4(\pi-x)\cos(\pi-x)=2+18\sin^4x\cos x$.
At x=pi/4 the actual derivative is $2+9\sqrt2/4$.

| Option | Truth | Concrete evidence |
| --- | --- | --- |
| a | False | The chain minus and supplementary-cosine minus must cancel; at pi/4 gives $2-9\sqrt2/4$. |
| b | False | Missing fifth-power factor5; at pi/4 gives $2+9\sqrt2/20$. |
| c | True | Correct linear derivative2, factor18, power4 and final plus sign. |
| d | False | The sine power must decrease to4; at pi/4 gives $2+9/4$, not $2+9\sqrt2/4$. |

### quarter-turn-product

Fidelity PASS: the pi/2 constants and inner factor2 remain in an
identity-plus-derivative record. Redundancy PASS: exact quarter-turn
constants annihilate one term, unlike the angle subtraction in source5.
Leakage PASS: neither cosine(pi/2)=0 nor the resulting simplification is
asserted in the stem. Capacity loss: complete-record recognition replaces
independent simplification and differentiation.

Independent computation: $f=-\sin2u$ and $f'=-2\cos2u$.

| Option | Truth | Concrete evidence |
| --- | --- | --- |
| a | False | At u=0 actual f=0 but claimed f=1. |
| b | True | Exact quarter-turn constants give -sin2u, with inner derivative2. |
| c | False | Correct function but missing derivative factor2; at u=0 gives -1 rather than -2. |
| d | False | Wrong sign in both entries; at u=0 gives derivative+2 rather than -2. |

### uniform-sign-proofs

Fidelity PASS, with proof-production limitation: the views retain both
all-real sign estimates and complete mean-value-theorem order arguments,
not just assertions that the functions increase/decrease.
Redundancy PASS: pairing compares opposite uniform signs arising from
a linear term dominating a bounded trigonometric derivative.
Leakage PASS: all stems give the functions, not the derivatives or
monotonic conclusions. The visible `a<b` quantifier is all-real, not a
hidden restriction to a period.

Independent computations:
$F'=2-\cos x\in[1,3]$ and
$G'=2\cos(2x-5)-3\in[-5,-1]$.
Both functions are differentiable on every [a,b], so the corresponding
MVT difference bounds are valid.

| Option | Truth | Concrete evidence |
| --- | --- | --- |
| a | True | Correct derivative, uniform bound and $F(b)-F(a)\ge b-a>0$ for arbitrary a<b. |
| b | False | At x=0 the actual derivative is1, not the asserted3. The identical positive-range/MVT tail does not rescue a false derivative equality. |
| c | True | Correct inner factor2 and range; MVT gives $G(b)-G(a)\le-(b-a)<0$. |
| d | False | At x=5/2 actual G'=-1, not the asserted-2. Its claimed upper bound-2 and difference estimate fail; for a=5/2,b=5/2+pi/6, the asserted inequality would require $\sqrt3/2\le\pi/6$, which is false. |

Capacity/lower diagnostic resolution: the records supply their proof
framework for recognition. Their wrong entries are distinguishable by
derivative errors, so a correct response alone does not show that the
learner independently generated the bounds or validated every step of
the MVT implication. This is not automatically a failure under the
contract's allowance for complete-record recognition and reasonable
elimination; it must not be represented as independent proof production
or as separate measurement of every proof step. Stage3 must check the
author's actual limitations/coverage statements against this loss.

### amplitude-and-function-study

Fidelity PASS, with discussion/graph-production limitation: the task
retains the full stationary sets, strict-increase proof for g despite its
discrete derivative zeros, h's alternating order/extremum structure and
global graph relationships. It does not stop at a derivative-only table.
Redundancy PASS: amplitude1 and amplitude2 share the linear term but
have mathematically different global monotonicity; grouped comparison
exposes that distinction. Leakage PASS: k is explicitly an arbitrary
integer; the stem does not tell which statements or monotonic conclusions
are true. Internally related alternatives remain propositions to check,
not authoritative facts supplied by another question's answer.

| Option | Truth | Concrete evidence |
| --- | --- | --- |
| a | True | $g'=1-\cos x$ vanishes exactly at2kpi; $h'=1-2\cos x$ vanishes exactly at2kpi +/- pi/3. Both integer families include negative k and0. |
| b | True | On any a<b a nondegenerate subinterval avoids the discrete set2piZ. MVT first gives global nondecrease and strict increase on that subinterval, hence the displayed strict chain. The differentiable h has h'(0)=-1 and h'(pi)=3, excluding global increase and global decrease. |
| c | True | cos x>1/2 gives h'<0 on the central intervals, and cos x<1/2 gives h'>0 between them. At -pi/3 modulo2pi the derivative changes + to - and the value is2kpi-pi/3+sqrt3; at +pi/3 it changes - to + with value2kpi+pi/3-sqrt3. |
| d | True | Both pass through(kpi,kpi). Their second derivatives are sin x and2sin x, with precisely the stated sign changes. Tangent slopes are1-(-1)^k and1-2(-1)^k. In particular g's horizontal points are stationary inflections, not local extrema. |
| e | True | Both are continuous odd functions with all-real domain. Bounded deviations from x yield limits +/- infinity and hence range R and no absolute extrema. The2pi shifts add2pi to the values, not0; the profiles repeat by diagonal translation, not by periodicity. |
| f | True | Strict increase and g(0)=0 give g's unique zero. For h, a root has absolute value at most2; h decreases below0 on(0,pi/3] and increases on[pi/3,2]. The tighter bracket here is valid: h(pi/2)=pi/2-2<0 and h(2)>0, so a unique positive alpha lies in(pi/2,2). Oddness gives exactly -alpha,0,alpha, and the displayed four sign regions follow. |
| g | False | All h order directions and extremum types are reversed. At x=0, h'=-1 refutes the claimed increase on(-pi/3,pi/3); the left stationary point is a maximum, not a minimum. The coordinates being otherwise correct do not rescue the types. |
| h | False | g'(2kpi)=0 only at isolated inputs. Every neighborhood contains intervals with g'>0; the MVT subinterval proof gives strict increase, so there is no horizontal segment or constant interval. |
| i | False | Bounded difference is not convergence to0. At x=pi/2+2npi and x=3pi/2+2npi, g(x)-x is respectively-1 and+1 and h(x)-x is-2 and+2. Taking n to either positive or negative infinity refutes y=x as an oblique asymptote at both ends. |

Definition authority: option i is judged by the ordinary asymptote
condition that the difference from the proposed line tends to0, not a
new convention that bounded deviation defines an asymptote. No author
note is used to change that condition. Alpha in f is explicitly defined
by its equation and interval; its tighter bracket was checked rather
than assumed from Stage1's weaker pi/3<r<2 bound.

Capacity loss: the learner selects textual research/graph-building
relationships, not an actually plotted candidate curve or an independently
drawn graph. The records do retain the qualitative geometry needed to
reconstruct the graph, including flat non-extremum points, curvature,
integer translations and the nonzero roots/sign regions for h. Recognition
of those distinctions is meaningful under the contract; it is not a
claim that the source12 drawing or source13 discussion was independently
produced. That response-format/production loss must be stated in Stage3.

## All14 Source Tasks Accounted For

| Original source | Visible response unit | Preserved mathematical task and recorded loss |
| --- | --- | --- |
| 1 | sine-linear | Full derivative including factor3; derivative-production replaced by recognition. |
| 2 | half-angle-phase | Full derivative with phase sign and half-factor; production replaced by recognition. |
| 3 | complement-and-reversal | Reversal/complementary-angle derivative; production replaced by recognition. |
| 4 | nested-square | Square/power/inner chain factors; production replaced by recognition. |
| 5 | difference-identity | Correct identity and derivative in one record; independent computation/writing not demonstrated. |
| 6 | constant-cancellations | Odd-sine cancellation gives f=0,f'=0; grouped record, not independent production. |
| 7 | constant-cancellations | Double-angle cancellation gives g=5,g'=0; both sources remain discriminated in the full record. |
| 8 | sum-with-phase | Both inner factors and exact shift; production replaced by recognition. |
| 9 | power-and-reflected-phase | Linear derivative, fifth-power factor and two signs; production replaced by recognition. |
| 10 | quarter-turn-product | Quarter-turn simplification and full inner factor; independent production not demonstrated. |
| 11 | uniform-sign-proofs | All-real positive derivative estimate and strict-increase argument; supplied proof recognized, not produced or independently assessed step-by-step. |
| 12 | amplitude-and-function-study | Complete derivative-zero set, legitimate strict-increase proof and qualitative graph relationships; no independent proof/graph drawing or actual plotted-curve recognition is performed. |
| 13 | amplitude-and-function-study | All-real derivative signs, stationary/extremum types, roots, symmetry/range and graph relations; full discussion production replaced by selecting records. |
| 14 | uniform-sign-proofs | All-real negative estimate and strict-decrease proof; supplied argument recognized, not independently produced. |

No visible source is omitted, and no original all-real domain is reduced
to a sampled point, nonnegative integers or a single period.
The paired units are supported by actual mathematical relationships, not
merely by wanting fewer questions. Sources11/14 retain opposite order
conclusions; sources12/13 retain the amplitude-dependent difference
between strict increase and changing derivative signs.

No answer is stated as a guaranteed stem conclusion. No separate question
gives the answer to another's actual function. Familiar derivative
patterns and the consistency of alternative records can support
legitimate mathematical elimination; that is distinct from copying
supplied data or wording that labels one alternative as correct.

## Stage2 Result And Next Gate

Visible semantic checks: **PASS for all11 units**, with the production
and diagnostic limitations explicitly recorded above. All49 option
truths and complete true sets are frozen independently. No definite
view-only mathematics, task-direction/domain, redundancy or leakage
defect was found in this snapshot.

This is not final package approval. Internal key agreement, misconception
derivations, exact coverage/source links and honest declaration of the
recorded capacity losses remain unreviewed until Stage3 authorization.
In particular supplied proof recognition must not be advertised as
independent proof production, and the textual graph-study task must not
be advertised as an independently drawn or actually inspected graph.

No current view was changed and no unit was re-reviewed as a repaired
snapshot. Freeze this report/hash now; stop and await separate Stage3
authorization before opening any author internals.
