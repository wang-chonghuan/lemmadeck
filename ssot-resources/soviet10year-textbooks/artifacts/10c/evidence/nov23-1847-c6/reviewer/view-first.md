# Stage B: Independent Key-Free View Freeze

Scope: STEMROBIN-184 / `10c` / `ana10-c6-ex`.
Sole cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
All 60 visible questions and all 215 options have determinate independent
checks below and in `view-first.json`. There are 46 single and 14 multiple items.
No author key, solution, rationale, draft, handoff, answer, history or internal
mapping was opened. Stage A was accepted by the caller and was not reread,
rewritten or re-solved. This is not independent semantic approval.

## Binding and Order

Only newly read input: `.tmp/stemrobin-184-six/c6-resume/question-views.json`.

- View file-byte SHA-256:
  `1fbc9fb0b8579e2e2b98ccf524b25f77a5982d416f14b0cb4b8cd8136d115740`.
- View canonical SHA-256:
  `765bf6d6e96d05b455c04575505897b1d6ec85de2f4b8c010f84f77fd370e536`.
- Accepted seed canonical SHA-256:
  `975572b776f0d768d41ad48d2bc5f45c2c1ce80f6c6fa727171d7e39107fe5a8`.
- Previously frozen source JSON file-byte SHA-256:
  `6e3702b330b8065ffc57aca011601edb5100f51715be8ab067e67e5edd8e98b0`.
- Previously frozen source JSON canonical SHA-256:
  `2c1171e2649a3fbce0562e54ff90afd3c73d761e9e09b191c56aded502e2e224`.
- Previously frozen source Markdown SHA-256:
  `1ceba2991cb864c26bbfb102ddf6323b4783ab4a43f5f4e46388302fea669b52`.

The actual views were checked for exactly `id`/`view` objects, distinct IDs,
60 questions, 215 options and no figures. Fidelity, redundancy and leakage were
judged with no author key. The following true sets and each option's mathematics
were then independently determined; no author correctness label supplied them.
These are snapshot-bound view findings, not a final `s10y-choice-review-v1`.

## Visible Findings Before Internal Comparison

**Revise: c6-370, c6-372, c6-373.**
Each asks verification of a supplied equality, but exactly one alternative claims
the required verification conclusion:

- In 370, only b says addition verifies the equality; a,c say it does not hold.
- In 372, only c says the terms cancel; a,b say they do not cancel.
- In 373, only b says the equality holds; a,c say it does not hold.

Thus conclusion matching uniquely identifies the mathematically true alternative
without testing an inverse value, principal branch, oddness argument or proof
step. This is a specific proof-conclusion leakage defect, not a rejection of
proof recognition. The contrast is 371: a and c both claim verification, but c
has false swapped endpoint values, so the inference itself must be judged.
The three items' mathematically determinate true sets do not rescue their
fidelity/leakage defects. Their repaired views must remove unique-conclusion
identification while preserving the decisive inference; no options were edited
or authored by this reviewer.

Other visible items preserve substantive mathematical distinctions. The
following capacity losses and scope notes remain for final comparison with
internal `limitations`, source mappings and coverage, not assumed approved:

- 348/349 retain both derivatives, all graph-property intervals, extrema,
  zeros/inflections, curvature, intercept, full reflection axes, parity, five
  period landmarks and central symmetry. Recognition replaces free construction
  and drawing; that production loss must be explicit. Recognition itself passes
  the visible fidelity test.
- 350 retains the specifically worded global ODE check and both derivatives.
  It contains no graph investigation. The frozen source conservatively included
  the inherited investigation/graph heading, so this visible absence is noted for
  final coverage/limitations comparison. It is not silently counted as a graph
  investigation, and no extra graph requirement is inferred solely from that
  shared heading.
- All 346b alternatives supply the correct amplitude and period; only the
  normalized sine phase is discriminated.
- 352/356 supply the arctangent phase-ratio magnitude; 356 also supplies the
  correct amplitude in every alternative. Sign/quadrant and coefficient
  verification remain, but discovery of those supplied quantities is lost.
- 381 actually includes all three requested rational representations and values.
  Independent derivation of those formulas is not measured, and some alternatives
  can be rejected numerically. This is a derivation-to-verification loss rather
  than an absent representation task.
- 387 supplies the normalized principal-angle parameter theta; completeness of
  the two sine families and their correct periods remains discriminated.
- All six requested half-angle outputs and both harmonic subpart pairs remain.
  The visible expressions provisionally account for the 57 frozen sources by
  three two-part splits; authoritative mappings are still undisclosed.
- Graph extrema/zeros overlap with landmarks but landmarks also add central
  symmetry; related t-formula/value statements still cover distinct requested
  functions. These are explicit mathematical relationships, not hidden-key cues.
- The independently determined multiple sets show a position regularity:
  all 14 have a,b true, and 13 have a true prefix followed by a false suffix.
  Item 379 is the exception with a,b,e. This is a reported positional risk,
  not a proven way to determine every full set without mathematics, and it is
  not counted as an additional semantic failure.

Unmarked angles are radians; explicit degree arguments remain degrees. Principal
inverse ranges are the ones stated in each view. `k` is any integer. The `t`
in 348/349 is the view's translated coordinate, not Stage A's fixed maximum
location. All wrong options below are rejected for the complete statement or
complete solution set requested, even if some individual roots or terms are true.

## All 60 True Sets and 215 Option Checks

### c6-335

Fidelity/redundancy/leakage: pass. The chain-sine derivative is unchanged and no
derivative is given. Independent calculation: `u=5x`, so `y'=5cos(5x)`.
Complete true set: **a**.

- a true: outer cosine times inner derivative 5 gives the displayed formula.
- b false: at x=0 it gives 1 while the derivative is 5; factor 5 is missing.
- c false: at x=0 it gives -5 while the derivative is 5; the sign is reversed.

### c6-336

Fidelity/redundancy/leakage: pass. The shifted cosine retains its negative outer
derivative and inner factor. `y'=-6sin(6x+pi/2)`, domain R.
Complete true set: **b**.

- a false: at x=0 it gives +6 rather than -6.
- b true: cosine differentiation and `u'=6` give both the minus and factor 6.
- c false: at x=0 it gives -1 rather than -6; chain factor omitted.

### c6-337

Fidelity/redundancy/leakage: pass. Universal real a,b,x includes a=0; the two
true forms test double-angle equivalence. With `u=ax+b`,
`y'=-2a sin u cos u=-a sin(2u)`.
Complete true set: **a,b**.

- a true: square differentiation gives `2cos u*(-a sin u)`.
- b true: `sin2u=2sin u cos u` makes this identical to a.
- c false: at a=1,b=0,x=pi/6 it gives -1/2 instead of -sqrt(3)/2.
- d false: a=0,b=pi/4 makes y constant with derivative 0, but d gives -1.

### c6-338

Fidelity/redundancy/leakage: pass. Decimal 2.3 and x+2 are unchanged.
The two product rules give
`2sin x+2x cos x-2x cos(x+2)+(x^2-2.3)sin(x+2)`.
Complete true set: **b**.

- a false: the last sign is wrong; x=0 gives +2.3sin2 rather than -2.3sin2.
- b true: it keeps both product terms and distributes the outside subtraction.
- c false: `2sin x` is missing; at x=pi/2 it is smaller than the derivative by 2.

### c6-339

Fidelity/redundancy/leakage: pass. Both product terms and the sine chain scale
remain. Independent derivative:
`(2x+1)sin3x+3(x^2+x+1)cos3x`.
Complete true set: **c**.

- a false: at x=0 it gives 1 rather than 3, missing the inner factor.
- b false: at x=pi/6 it gives 0 rather than `1+pi/3`; multiplying derivatives
  does not implement the product rule.
- c true: it is the sum of the two product contributions with chain factor 3.

### c6-340

Fidelity/redundancy/leakage: pass. The product and double-angle equivalent are
both evaluated universally. `y'=cos^2x-sin^2x=cos2x`.
Complete true set: **a,b**.

- a true: the cosine derivative in the second product contributes `-sin^2x`.
- b true: the double-angle identity gives the same difference.
- c false: at x=0 it is 0 while the derivative is 1.
- d false: it is always 1, but the derivative at x=pi/4 is 0.

### c6-341

Fidelity/redundancy/leakage: pass. Both original exclusions and the full product
derivative remain. Domain `sin x cos x!=0`; derivative
`sec^2x-cos x/sin^2x-(1+cot x)sin x`.
Complete true set: **a,b**.

- a true: the sine/cosine zero union is exactly `x=kpi/2`.
- b true: `cot'=-csc^2` and differentiating the multiplying cosine gives it.
- c false: its difference from the derivative is `2cos x/sin^2x`, nonzero at pi/4.
- d false: it admits x=0 where the original cotangent is undefined.

### c6-342

Fidelity/redundancy/leakage: pass. With `h=pi/2-x`, `sin h/h -> 1`.
The reverse-slope substitution affects both numerator and denominator.
Complete true set: **c**.

- a false: the substitution does not negate the ratio's +1 limit.
- b false: zero numerator and zero denominator require normalization, giving 1.
- c true: it is the two-sided fundamental radian sine-over-argument limit.

### c6-343

Fidelity/redundancy/leakage: pass. The actual scale ratio remains to be calculated.
`sin3x/(5x)=(3/5)[sin3x/(3x)] -> 3/5`.
Complete true set: **a**.

- a true: it retains numerator scale 3 divided by denominator scale 5.
- b false: 1/5 omits the inner coefficient 3.
- c false: 5/3 reverses the quotient's scales.

### c6-344

Fidelity/redundancy/leakage: pass. Two sine normalizations yield
`(4/7)[sin4x/(4x)]/[sin7x/(7x)] -> 4/7`.
Complete true set: **b**.

- a false: both normalized limits are 1, but their unequal scales leave 4/7.
- b true: it is the quotient of the original inner scales.
- c false: 7/4 is the reciprocal of the calculated result.

### c6-345

Fidelity/redundancy/leakage: pass. Replacing tangent by sine/cosine gives
`(5/3)[sin5x/(5x)][3x/sin3x]cos3x -> 5/3`.
Complete true set: **c**.

- a false: 3/5 reverses the numerator and denominator scales.
- b false: 15 multiplies scales despite the original quotient.
- c true: all normalized factors tend to 1 and leave 5/3.

### c6-346a

Fidelity/redundancy/leakage: pass. The already-normalized sine still requires
least-period identification. `A=3,T=pi,phi=-pi/4` in the prescribed phase range.
Complete true set: **a**.

- a true: every component agrees with the positive-frequency sine form.
- b false: 2pi is a period but not least; a shift pi already repeats the wave.
- c false: at x=0 it gives +3sqrt(2)/2 rather than -3sqrt(2)/2.

### c6-346b

Visible fidelity: pass with recorded common-amplitude/period production loss.
Redundancy/leakage: pass; phase still must be converted.
`2cos(pi/5-4x)=2sin(4x+3pi/10)`.
Complete true set: **b**.

- a false: it represents `2cos(4x+pi/5)`. At x=0 the values coincide, but the
  slopes are opposite: -8sin(pi/5) instead of +8sin(pi/5).
- b true: cosine evenness and the cosine-to-sine pi/2 shift give phase 3pi/10.
- c false: -pi/5 is the cosine phase, not sine phase; x=0 gives
  -2sin(pi/5) rather than 2cos(pi/5).

### c6-347a

Fidelity/redundancy/leakage: pass. `-0.6cos(x/2+3pi/10)`
`=0.6sin(x/2-pi/5)`, hence `A=0.6,T=4pi,phi=-pi/5`.
Complete true set: **c**.

- a false: adding pi to the correct phase negates the entire function.
- b false: a shift pi changes the argument by pi/2, not a whole cycle;
  the least period is 4pi.
- c true: `-cos u=sin(u-pi/2)` gives both the phase and positive amplitude.

### c6-347b

Fidelity/redundancy/leakage: pass. For `u=x+1`,
`sin(u+pi/6)=(sqrt(3)/2)sin u+(1/2)cos u`.
Complete true set: **a**.

- a true: amplitude 1, period 2pi and phase `1+pi/6` recover both coefficients.
- b false: the amplitude is the norm `sqrt(3/4+1/4)=1`, not the coefficient sum.
- c false: a pi/3 increment exchanges the original coefficient pair.

### c6-348

Visible fidelity: pass; free construction/drawing loss is recorded.
Redundancy/leakage: pass. Related extrema/landmarks add different claims.
The view's `t=x+pi/24` has derivative 1.
`f=(3/2)cos(8t/3)`, `f'=-4sin(8t/3)`,
`f''=-(32/3)cos(8t/3)`, least period `3pi/4`.
Argument values 2kpi, pi+2kpi and pi/2+kpi give maxima, minima and zeros.
Sine/cosine signs fix monotonicity and curvature.
Complete true set: **a,b,c,d,e,f,g,h**.

- a true: domain R; scaled cosine range `[-3/2,3/2]`; `2pi/(8/3)=3pi/4`.
- b true: derivative coefficients are `(3/2)(8/3)=4` and `-4(8/3)=-32/3`.
- c true: maxima at `t=3kpi/4`, minima at `t=3pi/8+3kpi/4`, from cosine
  arguments 2kpi and pi+2kpi.
- d true: zeros at `t=3pi/16+3kpi/8`, hence `x=7pi/48+3kpi/8`;
  the second derivative changes sign at each.
- e true: the sine is positive on the first half-period, making f' negative,
  and negative on the second, making f' positive.
- f true: cosine is positive on `(-3pi/16,3pi/16)` modulo 3pi/4 and negative
  on `(3pi/16,9pi/16)`, so the negative second-derivative coefficient gives
  exactly the displayed curvature signs.
- g true: the intercept is `(3/2)cos(pi/9)`. All reflection axes are
  `x=-pi/24+3kpi/8`. Nonzero f(0) rules out oddness, and nonzero
  `f'(0)=-4sin(pi/9)` rules out evenness.
- h true: the five arguments 0,pi/2,pi,3pi/2,2pi yield the displayed values.
  `cos(pi/2+s)=-cos(pi/2-s)` around every zero proves central symmetry.
- i false: least period is 3pi/4; 16pi/3 divided by it is 64/9, not even an
  integer number of periods.
- j false: it lacks inner factor 8/3; at t=3pi/16 it gives -3/2 rather than -4.
- k false: those x-values are maxima with f=3/2, not zeros.

### c6-349

Visible fidelity: pass with construction/drawing production loss.
Redundancy/leakage: pass; 348's numerical relations do not determine these.
For `t=x+pi/20`, `g=3cos(5t/3)`, `g'=-5sin(5t/3)`,
`g''=-(25/3)cos(5t/3)`, least period 6pi/5.
Complete true set: **a,b,c,d,e,f,g,h**.

- a true: domain R, range [-3,3], and `2pi/(5/3)=6pi/5`.
- b true: the two derivative coefficients are -5 and -25/3.
- c true: cosine arguments 2kpi and pi+2kpi give the stated extrema and heights.
- d true: zeros `t=3pi/10+3kpi/5` translate to `x=pi/4+3kpi/5`;
  g'' changes sign there.
- e true: positive sine on the first stated half-period makes g'<0;
  negative sine on the second makes g'>0.
- f true: positive cosine on `(-3pi/10,3pi/10)` modulo 6pi/5 gives g''<0;
  negative cosine on `(3pi/10,9pi/10)` gives g''>0.
- g true: `3cos(pi/12)=3(sqrt(6)+sqrt(2))/4`. All reflection axes are
  `x=-pi/20+3kpi/5`. Nonzero g(0) and g'(0) rule out odd and even parity.
- h true: arguments 0,pi/2,pi,3pi/2,2pi give 3,0,-3,0,3; each zero has
  the same cosine antisymmetry establishing central symmetry.
- i false: 10pi/3 is not the least period 6pi/5; their ratio is 25/9.
- j false: at t=0 the actual second derivative is -25/3, not +25/3.
- k false: x=-pi/12 gives t=-pi/30, argument -pi/18 and value
  `3cos(pi/18)<3`, so it is not a maximum.

### c6-350

Specific-task fidelity/redundancy/leakage: pass; the visible absence of any
investigation/graph task is separately recorded against the inherited heading.
With `u=2x-pi/4`, `y'=-2sin u`, `y''=-4cos u=-4y` globally on R.
Complete true set: **a**.

- a true: both chain derivatives are correct and the global equation holds.
- b false: at x=pi/8 it gives y''=+4 instead of -4; its negative judgment is false.
- c false: the first derivative lacks factor 2 and at x=pi/8 its second
  derivative gives -2 instead of -4; the ODE judgment is also false.

### c6-351

Fidelity/redundancy/leakage: pass. The cosine difference formula gives
`2cos(2x-pi/4)`.
Complete true set: **b**.

- a false: at x=pi/4 its plus phase gives -sqrt(2), but the original is +sqrt(2).
- b true: expansion recovers both positive product terms and outer factor 2.
- c false: outer factor 2 is lost; x=0 gives sqrt(2)/2 instead of sqrt(2).

### c6-352

Visible fidelity/redundancy/leakage: pass with provided phase-ratio loss noted.
The given quadrant-I delta has cosine 4/5 and sine 3/5.
`5sin(u+delta)=4sin u+3cos u`.
Complete true set: **c**.

- a false: `5sin(u-delta)=4sin u-3cos u`; at u=0 it gives -3 instead of 3.
- b false: amplitude 7 is wrong; u=0 gives 21/5 instead of 3.
- c true: both original coefficients are reproduced by expansion.

### c6-353

Fidelity/redundancy/leakage: pass.
`(sqrt(2)/2)cos(x+pi/4)=(1/2)cos x-(1/2)sin x`.
Complete true set: **a**.

- a true: the norm and phase sign recover the original half difference.
- b false: x=0 gives sqrt(2)/4 instead of 1/2.
- c false: x=pi/2 gives +1/2 instead of -1/2, due to the sine sign.

### c6-354

Fidelity/redundancy/leakage: pass. Converting the already-harmonic sine to a
positive-amplitude cosine is legitimate: `sin2x=cos(2x-pi/2)`.
Complete true set: **b**.

- a false: it equals -3sin2x; at x=pi/4 it gives -3 rather than +3.
- b true: minus pi/2 is the correct cosine phase shift.
- c false: it equals 3sin x and changes frequency; x=pi/2 gives 3 rather than 0.

### c6-355

Fidelity/redundancy/leakage: pass.
`4-8cos^2x=-4cos2x=4cos(2x+pi)`.
Complete true set: **c**.

- a false: x=0 gives +4 instead of -4; sign reversed.
- b false: x=0 gives -8 instead of -4; amplitude doubled.
- c true: the pi phase negates the doubled-frequency cosine with amplitude 4.

### c6-356

Visible fidelity/redundancy/leakage: pass with supplied ratio and amplitude loss.
The given quadrant-I delta has cosine `1/sqrt(13)` and sine
`2sqrt(3)/sqrt(13)`. Positive `2sqrt(13)sin(x+delta)` has both coefficients
positive, so subtracting pi from its phase negates both.
Complete true set: **a**.

- a true: it expands exactly to `-2sin x-4sqrt(3)cos x`;
  delta-pi and delta+pi differ by a full cycle.
- b false: both coefficients are positive, the negative of the source wave.
- c false: it expands to `+2sin x-4sqrt(3)cos x`; x=pi/2 gives +2 instead of -2.

### c6-357

Fidelity/redundancy/leakage: pass. On `cos alpha!=0`,
`-cos alpha*tan alpha=-sin alpha`.
Complete true set: **a,b**.

- a true: the original cotangent denominator is cos alpha.
- b true: cancellation of that nonzero cosine gives negative sine.
- c false: alpha=pi/6 gives original -1/2, not +1/2.
- d false: alpha=pi/2 includes undefined cot0 in the original.

### c6-358

Fidelity/redundancy/leakage: pass. Numerator `-tan alpha cos beta`,
denominator `+tan alpha cos beta`; exact domain needs cosine alpha,
sine alpha and cosine beta all nonzero.
Complete true set: **a,b**.

- a true: the tangent definitions and both nonzero denominator factors give
  precisely these three conditions.
- b true: the defined numerator is the negative of the denominator.
- c false: alpha=pi/4,beta=0 gives -1, not +1.
- d false: alpha=0,beta=0 meets its cosine conditions but the tangent
  denominator factor is zero.

### c6-359

Fidelity/redundancy/leakage: pass. Numerator `sin^2x`, denominator `cos^2x`;
the full simplified result is tan^2x on `cos x!=0`.
Complete true set: **b**.

- a false: at x=pi/6 it gives cot^2x=3 instead of 1/3; it also loses allowed x=0.
- b true: both the value and exact original domain agree.
- c false: its added `sin x!=0` excludes x=0, where the original is defined as 0.

### c6-360

Fidelity/redundancy/leakage: pass. The original is
`cos^2alpha/(1+sin alpha)=1-sin alpha` on `sin alpha!=-1`.
Complete true set: **a,b**.

- a true: denominator 1+sin alpha vanishes exactly at sin alpha=-1.
- b true: factor and cancel the nonzero `1+sin alpha`.
- c false: sin alpha=1 gives numerator 0, denominator 2 and defined value 0.
- d false: alpha=pi/6 gives 1/2 rather than `1+sin alpha=3/2`.

### c6-361

Fidelity/redundancy/leakage: pass. Decisive reductions and domain are judged.
On `cos x!=0`, both shifted terms on the left are -tan x;
the sum and the independently reduced RHS are -tan x.
Complete true set: **a,b,c**.

- a true: every original trig denominator reduces to +/-cos x.
- b true: both negative-tangent reductions follow from sine/cosine signs.
- c true: the left three terms sum to -tan x, and the right reduction is correct.
- d false: x=pi/4 gives cot3pi/4=-1, not tanpi/4=+1.
- e false: x=pi/2 meets sin x!=0 but original tangent and cotangent terms fail.

### c6-362

Fidelity/redundancy/leakage: pass. Keep degrees. Both sides reduce to
`cos y*(-cos y)*(-tan y)=sin y cos y` on `cos y!=0`.
Complete true set: **a,b,c**.

- a true: both cotangent sine denominators are +/-cos y; y=0 is allowed.
- b true: the two product triples have exactly those signs, using cotangent's
  180-degree period.
- c true: `cos^2y*tan y=sin y cos y` on the domain.
- d false: y=45deg gives cot315deg=-1 rather than +1.
- e false: y=90deg makes cot360deg and cot180deg undefined; zero factors
  cannot define an otherwise undefined product.

### c6-363

Fidelity/redundancy/leakage: pass.
Reference-angle values are -1, -1/2 and -sqrt(2)/2; multiply with 10.
Complete true set: **c**.

- a false: three negative factors make the result negative, not positive.
- b false: both half factors yield -10sqrt(2)/4, not -5sqrt(2).
- c true: the actual product is -5sqrt(2)/2.

### c6-364

Fidelity/redundancy/leakage: pass.
`2sin^2225=1`, `cot330=-sqrt(3)`, `tan405=1`.
Complete true set: **a**.

- a true: subtracting the negative product gives 1+sqrt(3).
- b false: it loses the negative cot330 sign under subtraction.
- c false: -sqrt(3)/3 would be tan330, not cot330.

### c6-365

Fidelity/redundancy/leakage: pass. Principal inverse values are pi/3 and pi/6.
Complete true set: **b**.

- a false: pi/3 is just the first term, omitting pi/6.
- b true: the angle sum is pi/2.
- c false: 7pi/6 is not the sum and exceeds the sum's possible principal-range
  upper bound pi.

### c6-366

Fidelity/redundancy/leakage: pass. Principal inverse cosines are pi/3 and pi/4.
The same numeric total in 369 does not establish this different expression.
Complete true set: **c**.

- a false: 5pi/12 substitutes pi/6 for the actual first value pi/3.
- b false: pi/12 is the difference, not the sum.
- c true: pi/3+pi/4=7pi/12.

### c6-367

Fidelity/redundancy/leakage: pass. Principal inverse sine is -pi/6;
principal inverse cosine is 5pi/6, not a negative angle.
Complete true set: **a**.

- a true: the sum is 4pi/6=2pi/3.
- b false: -pi/3 cannot equal -pi/6 plus the actual nonnegative value 5pi/6.
- c false: pi would incorrectly replace the first negative value by +pi/6.

### c6-368

Fidelity/redundancy/leakage: pass. Related unmarked proof alternatives in 373
are mathematical overlap, not a disclosed key. Principal tangent inverse is odd.
Complete true set: **b**.

- a false: pi requires an out-of-range branch such as 3pi/4 for the first term.
- b true: -pi/4 and pi/4 cancel.
- c false: pi/2 adds two positive pi/4 values and loses the first sign.

### c6-369

Fidelity/redundancy/leakage: pass. Principal values are pi/3 and pi/4;
overlapping unmarked arcctg1 proof terms do not themselves designate a key.
Complete true set: **c**.

- a false: pi/6 has tangent 1/sqrt(3), not the specified sqrt(3).
- b false: pi/12 subtracts the two inverse values.
- c true: pi/3+pi/4=7pi/12.

### c6-370

Task fidelity/leakage: **revise** for the unique-verification-conclusion
shortcut; redundancy: pass. Mathematics is separately determinate:
principal arccos0=pi/2 and arcsin(sqrt(2)/2)=pi/4.
Complete true set: **b**.

- a false: cos0=1, so arccos0 cannot be 0; its proof and conclusion are false.
- b true: both direct inverse values lie in their ranges and sum to 3pi/4.
- c false: 3pi/4 has the right sine but lies outside the arcsin principal range.

### c6-371

Fidelity/redundancy/leakage: pass. Options a and c share the same verification
conclusion, so false intermediate values cannot be hidden behind the RHS.
Complete true set: **a**.

- a true: cospi=-1, cos0=1, and both endpoints lie in [0,pi]; inverse values pi,0.
- b false: -pi lies outside the inverse-cosine range despite its correct cosine.
- c false: both inverse values are swapped; the true arithmetic sum does not
  validate those false steps.

### c6-372

Task fidelity/leakage: **revise** for the unique-cancellation-conclusion
shortcut; redundancy: pass. Independently, restricted sine is odd and injective,
so its inverse is odd and the two values are -pi/4 and pi/4.
Complete true set: **c**.

- a false: 5pi/4 has the negative sine but is outside [-pi/2,pi/2].
- b false: pi/4 has positive sine, not the first negative argument; magnitudes
  cannot erase the sign.
- c true: oddness of an invertible function on a symmetric interval transfers
  to its inverse, and the opposite principal angles cancel.

### c6-373

Task fidelity/leakage: **revise** for the unique-validity-conclusion shortcut;
redundancy: pass. Principal values are -pi/4 and pi/4 on their different ranges.
Complete true set: **b**.

- a false: 3pi/4 has tangent -1 but is outside the inverse-tangent range.
- b true: both direct values and both principal-range checks are valid; sum zero.
- c false: -pi/4 is outside (0,pi) and has cotangent -1 rather than +1.

### c6-374

Fidelity/redundancy/leakage: pass. The numerator factors to `(c-s)(c+s)`;
denominator to `(c+s)^2`, and cancellation requires `c+s!=0`.
Complete true set: **a,b**.

- a true: expansion gives `c^2-s^2` and `1+2sc`.
- b true: both original denominators have zero set c+s=0; cancel only otherwise.
- c false: `(c-s)^2=1-sin2alpha`; at alpha=pi/4 it is 0 while the asserted
  left expression is 2.
- d false: alpha=-pi/4 makes the original denominators zero after all.

### c6-375

Fidelity/redundancy/leakage: pass. With `u=pi/4+alpha`, the domain
`cos u!=0` permits multiplication by cos^2u, producing -cos2u=sin2alpha.
Complete true set: **a,b,c**.

- a true: tangent needs nonzero cosine and its finite square plus 1 is positive.
- b true: the nonzero multiplier gives denominator 1 and numerator
  `sin^2u-cos^2u=-cos2u`.
- c true: `2u=pi/2+2alpha`, with shifted cosine equal to negative sine.
- d false: at u=0 the original quotient is -1 while cos2u is +1.
- e false: alpha=pi/4 makes u=pi/2 and tangent undefined.

### c6-376

Fidelity/redundancy/leakage: pass. Both numerator orientation and original
nonzero factors remain in a full proof response.
Complete true set: **a**.

- a true: numerator `2s(s+c)`, denominator `2c(s+c)`; c and s+c must both
  be nonzero to cancel and obtain s/c.
- b false: numerator and denominator are interchanged; alpha=pi/6 would give
  cotalpha=sqrt(3) rather than tanalpha=1/sqrt(3).
- c false: alpha=-pi/4 has c!=0 but s+c=0, so the asserted cancellation is invalid.

### c6-377

Fidelity/redundancy/leakage: pass. The stem asks whether the proposed equality
holds, rather than declaring a verification result. The double-angle scale and
sin30 value must support that judgment.
Complete true set: **b**.

- a false: the product is half sin30, not sin30; factor 2 omitted.
- b true: `2sin15 cos15=sin30=1/2` gives product 1/4.
- c false: the double-angle identity is right, but sin30 is 1/2, not 1.

### c6-378a

Fidelity/redundancy/leakage: pass. All three outputs and the original quadrant
are included. cosalpha=3/5, half-alpha in quadrant I, so positive roots give
`1/sqrt(5),2/sqrt(5),1/2`.
Complete true set: **b**.

- a false: its half-angle pair implies sinalpha=2sc=3/5 rather than 4/5,
  and tangent 1/3 rather than 1/2.
- b true: the positive roots of `(1-3/5)/2` and `(1+3/5)/2`, with correct ratio.
- c false: half-alpha is between 0 and pi/4, so negative cosine/tangent violate
  the required signs.

### c6-378b

Fidelity/redundancy/leakage: pass. The ratio 24/7 in quadrant III gives
`sin alpha=-24/25,cos alpha=-7/25`; half-alpha lies in quadrant II.
Complete true set: **c**.

- a false: a positive sine/cosine half-pair doubles to first-quadrant alpha with
  cosalpha=+7/25,sinalpha=+24/25, contrary to the given quadrant.
- b false: half-angle sine must be positive; its both-negative pair also
  doubles to sinalpha=+24/25 rather than the original negative value.
- c true: the positive sine root 4/5 and negative cosine root -3/5 give
  the correct quadrant and ratio -4/3.

### c6-379

Fidelity/redundancy/leakage: pass. Factor the RHS with
`cos beta=(c-s)(c+s)`, `1-sin beta=(c-s)^2`, then cancel on cosbeta!=0.
Complete true set: **a,b,e**.

- a true: the nonzero product cosbeta forces both factors nonzero and defines
  both original sides.
- b true: combining the RHS fractions and factoring gives the displayed proof.
- c false: beta=pi/2 has c+s=sqrt(2)!=0 but the RHS is undefined.
- d false: `(c+s)^2=1+sinbeta`; at beta=pi/2 it is 2, while 1-sinbeta is 0.
- e true: beta=pi/2 gives c=s=sqrt(2)/2 and defined LHS 0, but original
  secant and tangent on the RHS are undefined.

### c6-380

Fidelity/redundancy/leakage: pass. Two alternatives claim the original identity;
the common-denominator domain must distinguish the valid full argument.
Complete true set: **a**.

- a true: `sin(alpha/2)cos(alpha/2)=(1/2)sin alpha`; on sin alpha!=0 both
  half-angle functions are defined and their difference is 2cotalpha.
- b false: the missing half in the denominator loses factor 2; alpha=pi/4
  gives actual left side 2, not cotalpha=1.
- c false: alpha=0 meets its cosine condition but contains undefined cot0.

### c6-381

Visible fidelity/redundancy/leakage: pass with formula-generation loss noted.
Alpha is 4pi/3, half-alpha is 2pi/3, so t=-sqrt(3).
The sine, tangent and cotangent rational formulas use denominators
`1+t^2`, `1-t^2`, `2t`, respectively, all valid here.
Complete true set: **a,b,c,d**.

- a true: the half-angle quadrant selects negative sqrt(3) from t^2=3.
- b true: the sine double-angle rational expression gives
  `2t/(1+t^2)=-2sqrt(3)/4=-sqrt(3)/2`.
- c true: sine divided by cosine double-angle expressions gives
  `2t/(1-t^2)=sqrt(3)`.
- d true: the reciprocal gives `(1-t^2)/(2t)=1/sqrt(3)=sqrt(3)/3`.
- e false: positive sqrt(3) violates the half-angle quadrant-II tangent sign.
- f false: it uses the sine formula and value for tangent; tanalpha is +sqrt(3),
  not -sqrt(3)/2.
- g false: it uses the tangent expression/value for cotangent, which must be
  its nonzero reciprocal 1/sqrt(3).

### c6-382

Fidelity/redundancy/leakage: pass. Difference of fourth powers at the half-angle
is -cosx, hence cosx=-1/4. Both periodic cosine families are necessary.
Complete true set: **b**.

- a false: its roots have cosine +1/4 and original left side -1/4 rather than +1/4.
- b true: it includes both signs of the correct arccos angle with 2pi repeats.
- c false: it misses the negative principal-angle branch; that angle is not
  congruent to the positive one because the angle is neither 0 nor pi.

### c6-383

Fidelity/redundancy/leakage: pass. Moving all terms yields
`(cosx-2sinx)^2=0`; cosine zero cannot solve it, so tanx=1/2.
Complete true set: **c**.

- a false: at arctan2 the square is `(1-4)^2/5=9/5`, not zero.
- b false: it contains valid roots but misses arctan(1/2)+pi.
- c true: all and only the tangent solutions have this pi-periodic family.

### c6-384

Fidelity/redundancy/leakage: pass. With c=cos(x/2), the equation becomes
`c(3c-1)(c+3)=0`; retain c=0,1/3 and reject impossible c=-3.
Complete true set: **a**.

- a true: the zero branch is `pi+2kpi`, and the two nonzero branches are
  `+/-2arccos(1/3)+4kpi`; this is complete.
- b false: it omits the valid root x=pi, where both original sides are zero.
- c false: adding 2pi to a nonzero-branch root gives c=-1/3, making the
  original sides +8/9 and -8/9 rather than equal.

### c6-385

Fidelity/redundancy/leakage: pass. `sinx+sin3x=2sin2x cosx`;
the cosx zeros are already in the sin2x-zero family.
Complete true set: **b**.

- a false: it misses x=pi/2, whose sine terms are 1 and -1.
- b true: all and only factor-zero roots are kpi/2.
- c false: it misses x=0, where both sine terms vanish.

### c6-386

Fidelity/redundancy/leakage: pass. `cos2x-cos6x=2sin4x sin2x`;
the sin2x roots are a subset of the sin4x roots.
Complete true set: **c**.

- a false: it misses x=pi/4, where both cosine terms are zero.
- b false: it misses x=0, a genuine root.
- c true: kpi/4 is the complete union of the factor-zero families.

### c6-387

Visible fidelity/redundancy/leakage: pass with supplied-theta loss recorded.
Sine difference gives sqrt(3)sinx=1. The defined theta has sine 1/sqrt(3);
all roots require its principal and supplementary branches with 2pi repeats.
Complete true set: **a**.

- a true: both families have the required positive sine and exhaust its solutions.
- b false: theta+pi makes the original left side -1, not +1; the supplementary
  positive-sine branch is also missed.
- c false: at x=pi/2 the original left side is sqrt(3), not 1.

### c6-388

Fidelity/redundancy/leakage: pass. For A=2x+y,B=x+2y,
`sinA cosB=(1/2)[sin(A+B)+sin(A-B)]`;
arguments are 3x+3y and x-y.
Complete true set: **b**.

- a false: the difference sine is negated; x=pi/2,y=0 gives -1 rather than 0.
- b true: the oriented difference, plus sign and half factor are correct.
- c false: it doubles the expression; x=pi/6,y=0 gives 3/2 rather than 3/4.

### c6-389

Fidelity/redundancy/leakage: pass. The cosine product gives half the sum of
cos4alpha and cos(-2beta)=cos2beta.
Complete true set: **c**.

- a false: at alpha=beta=0 it gives 0 rather than 1.
- b false: at alpha=beta=0 it gives 2 rather than 1, omitting the half factor.
- c true: both arguments, cosine evenness and plus sign match the product formula.

### c6-390

Fidelity/redundancy/leakage: pass. The sine product is
`(1/2)[cos(x-3y)-cos(3x+y)]`.
Complete true set: **a**.

- a true: it has the correct difference/sum arguments, order and half factor.
- b false: it is the negative of the product; x=pi/4,y=0 gives -sqrt(2)/2
  rather than +sqrt(2)/2.
- c false: its difference argument is wrong; x=0,y=pi/6 gives 0 whereas the
  original sine product is -sqrt(3)/4.

### c6-391

Fidelity/redundancy/leakage: pass. The response must complete both reductions:
`[2sin(x/2)cos(x/2)]^2=sin^2x=(1-cos2x)/2`.
Complete true set: **b**.

- a false: it is twice the original; x=pi/2 gives 2 rather than 1.
- b true: it is the required final constant-minus-cosine sum without a square.
- c false: x=0 gives 1 rather than the original 0, due to the plus cosine sign.

## Stage Boundary

The independent true sets and all 215 option judgments above are frozen before
any author internals are received. Visible finding verdict: revise, for exactly
the three verification-conclusion leakage cases. No mathematical ambiguity or
unknown true set remains, but there is no final semantic approval.

Final comparison still needs the authorized snapshot's keys, rationales and
misconception derivations, explicit production limitations, source mappings and
whole-package coverage. It must preserve these independent sets, not normalize
them to author answers. A corrected view will require affected review; unchanged
source or mathematical work must not be repeated merely for packaging.

No images occur; none were demanded or opened. Images used: 0.
New-component desktop/mobile display is later; the existing written-answer and
unchanged written-display reviews were neither read nor rerun.
All writes stay in this reviewer directory. No DB, network, dependencies,
keyboard, app, Git, agent or peer-message operation was used.
Model/hidden cost: UNKNOWN.

Wait for caller acceptance of this freeze and explicit authorization of
internals; do not open them independently.
