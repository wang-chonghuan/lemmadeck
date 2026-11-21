# N45 Independent Choice Semantic Review: Key-Last Comparison

Actual semantic outcome: **pass**, for the declared additional recognition
practice with the original written exercises unchanged and the limitations below.
Administrative status: **OPEN** awaiting full parent intake and actual close.
No official validation, retained integration, publication or author draft edit
has been performed.

Reviewer: Locke, independent agent `01a1fc03-9575-7663-9950-4de58154372e`.
The final review JSON uses only `s10y-choice-review-v1` contract fields.
Images authorized/opened: 0/0. Seed, draft and views have no figure references.

## Snapshot and Independence

The independent source solution was frozen before any view. Visible-purpose
findings and all option true sets were frozen before any author key, intent,
coverage, solution or misconception was opened. Stage 3 did not alter those
earlier files or any correct set. Every newly revealed key agrees with the
pre-key set; there was no normalization toward the author.

The final draft projection `[{id,view}]` is deeply equal to the entire authorized
stage-2 packet: modes, stems, every option text, order, IDs and empty figure
arrays. No key or intent appears in that projection.

| Input | Bytes | Raw SHA-256 |
| --- | --- | --- |
| seed.json | 3705 | `7ffa1cecf4f86cfe0ec44e87a0114cc0533b8ac5c1ca5781b8b7ab716dc43086` |
| view-only.json | 6763 | `6a6240cbc2397a943c900b353b55c9b8a9b6b412c23e0c42a7d5b5e6f82cd8b7` |
| draft.json | 27387 | `4808984cae0ff0d27cb25d66f9c010b4e884cea44f4c4f621d6800dbe29016e4` |
| fullsource_solutions.md | 8072 | `265b8481f5dd807eec6306a923011dc7be3983575b22087be6eaae7bb3d01b9b` |

These four inputs are in `.tmp/stemrobin-184-six/n45-choices/`.
The receipt binds all of them and all six immutable stage-1/stage-2 artifacts.

Canonical seed digest:
`f4f46fa299605cfcabdef556d484ae9462a601a55cfde4573eb30d242f1d41d5`.

Canonical draft digest:
`8c81805a2ba7b3862ef25fc251b5118882f5b7ecd2b4a96ee5b7cc7ed84e9f9a`.

Canonicalization follows the contract: sorted object keys, preserved array
order, ASCII-escaped JSON strings, and compact comma/colon separators. The
draft's seed digest agrees. Byte hashes and all existing frozen modes were
verified, but no original-source trace target was read or refreshed. The author
document's historical provenance claim is not independently audited here;
its actual mathematics is compared below.

## Complete Key Comparison

| Question | Pre-key independent true set | Author key | Result |
| --- | --- | --- | --- |
| nc01 | c | c | exact agreement |
| nc02 | a | a | exact agreement |
| nc03 | b | b | exact agreement |
| nc04 | d | d | exact agreement |
| nc05 | b | b | exact agreement |
| nc06 | a, b, c, e | a, b, c, e | exact agreement |
| nc07 | b, c, e, g | b, c, e, g | exact agreement |

All 34 options were checked, not merely each selected answer: 13 are true and
21 false. Author rationale truths agree for every option. Each correct rationale
has null misconception; each false alternative has a substantive wrong procedure.
The following comparison checks whether that procedure actually produces its
displayed alternative and whether the alternative is false here.

## Every Rationale and Misconception

### nc01: Four Constant Slopes

Independent tuple: `(1/5,-3/4,2,-7/2)` on R.

| Option | Comparison with author rationale and misconception |
| --- | --- |
| a, false | Using c'=c rather than 0 gives f3'=2-5=-3 and f4'=2-7/2=-3/2, with the first two slopes unchanged. This exactly generates the tuple. The actual affine slopes are 2 and -7/2, so it is false. |
| b, false | The specified fractional-only inversion maps 1/5 to 5, -3/4 to -4/3 and -7/2 to -2/7, leaving integer slope 2 alone. It generates every displayed entry, and those three reciprocals differ from the true slopes. The procedure is explicitly scoped; there is no need to invent inversion of the integer coefficient. |
| c, true | Using x'=1 and c'=0 with unchanged constant multipliers gives all four independent slopes exactly. Correct derivation; null misconception. |
| d, false | Using x'=x but c'=0 gives the four displayed x-dependent expressions. At x=0 they are all 0, unlike the true nonzero constants. The stated degree-retention error accurately produces a false result. |

### nc02: Scaled and Unscaled Two-Factor Products

Independent tuple:
`((6x-6)/5,(12x-5)/7,12x-7)` on R.

| Option | Comparison with author rationale and misconception |
| --- | --- |
| a, true | Both product terms and outside factors yield precisely all three derivatives. Correct derivation; null misconception. |
| b, false | The invalid (uv)'=u'v' gives (3/5)*1*1, 3*2/7, and 2*3: exactly 3/5,6/7,6. At x=0 the actual tuple is (-6/5,-5/7,-7), so all three claimed constant identities are false. |
| c, false | Keeping only u'v gives (3/5)(x-2), 3(2x-3)/7, and 2(3x+1), exactly the candidate. The omitted terms 3x/5, 2(3x+2)/7 and 3(2x-3) are not identically 0. The stated fixed-second-factor mistake accurately generates the false tuple. |
| d, false | Correct inner differentiation with both outside scalars omitted gives 2x-2 and 12x-5; unscaled r still gives 12x-7. This exactly matches the option. At zero the first two entries -2,-5 differ from -6/5,-5/7, confirming the dropped-multiplier error. |

### nc03: Three Distinct Factors

With A=3x/5+1, B=x/2-2 and C=x/3+3, the independent derivative is
`(9x^2+40x-83)/30`. The author products and contributions also check exactly:

```text
AB=(3/10)x^2-(7/10)x-2.
BC=(1/6)x^2+(5/6)x-6.
AC=(1/5)x^2+(32/15)x+3.
A'BC=(1/10)x^2+(1/2)x-18/5.
AB'C=(1/10)x^2+(16/15)x+3/2.
ABC'=(1/10)x^2-(7/30)x-2/3.
```

| Option | Comparison with author rationale and misconception |
| --- | --- |
| a, false | Keeping only A'BC gives (3x^2+15x-108)/30 exactly. It differs from the full derivative and at zero gives -108/30 rather than -83/30. The first-factor-only procedure is accurate. |
| b, true | Adding all three contributions gives 3/10, 4/3 and -83/30 as the quadratic, linear and constant coefficients. Correct complete derivation; null misconception. |
| c, false | Multiplying slopes (3/5)(1/2)(1/3)=1/10 reproduces the candidate. It is a constant, not the actual quadratic; its value at zero 3/30 differs from -83/30. |
| d, false | Differentiating AB while holding C fixed gives A'BC+AB'C=(6x^2+47x-63)/30. The omitted ABC' is nonzero; at zero the option gives -63/30 rather than -83/30. The stated omission generates the expression exactly. |

### nc04: Repeated Affine Cube

Independent derivative: `6(2x-3)^2=24x^2-72x+54`.

| Option | Comparison with author rationale and misconception |
| --- | --- |
| a, false | Treating t=2x-3 as unit-rate, t'=1, gives three t^2 contributions and hence 3(2x-3)^2. At zero it gives 27, not 54. The missing slope-two error matches. |
| b, false | Differentiating only one of three equal copies gives t'tt=2(2x-3)^2, exactly the candidate. It gives 18 rather than 54 at zero. |
| c, false | Invalid multiplication of all three derivatives yields 2*2*2=8, exactly the option. It is not the actual quadratic and fails at zero, where the derivative is 54. |
| d, true | All three contributions 2(2x-3)^2 sum to the frozen independent derivative. Correct derivation; null misconception. |

### nc05: Quartic Product

Independent derivative: `6x-12x^3`.

| Option | Comparison with author rationale and misconception |
| --- | --- |
| a, false | Holding the second factor fixed leaves only 6x(1-x^2)=6x-6x^3. The omitted -6x^3 is nonzero; at x=1 the option is 0, not -6. |
| b, true | The terms 6x-6x^3 and -6x^3 sum to 6x-12x^3, also obtained from 3x^2-3x^4. Correct derivation; null misconception. |
| c, false | Multiplying (3x^2)' and (1-x^2)' gives (6x)(-2x)=-12x^2, exactly as displayed. At x=1 it is -12 rather than the actual -6. |
| d, false | The author's stated wrong expansion is 3x^2+3x^4, not the original 3x^2-3x^4. Its derivative is exactly 6x+12x^3, which gives 18 rather than -6 at x=1. This is a specific expansion-sign error, not an inaccurately claimed product-rule error. |

### nc06: x+1/x

Independent derivative signs are positive, negative, negative, positive over
the four listed intervals. Local maximum is (-1,-2), local minimum (1,2).
Branch ranges are `(-infinity,-2]` and `[2,infinity)`.

| Option | Comparison with author rationale and misconception |
| --- | --- |
| a, true | Domain excludes 0; the zero equation is x^2+1=0, with no real root. A y-intercept is also excluded. Correct domain and intercept reasoning; null misconception. |
| b, true | Signed divergent limits give vertical x=0, and f-x=1/x tends to 0 at both infinite ends, giving oblique y=x. Correct rationale; null misconception. |
| c, true | Since x^2>0, the sign of f' is that of x^2-1. The four open intervals and split at excluded zero are exact. Correct rationale; null misconception. |
| d, false | The specific wrong derivative 1/x^2-1 reverses all four signs, producing a minimum at -1 and maximum at 1 while retaining the original values -2 and 2. It exactly generates the candidate. The actual derivative signs give the opposite classifications. |
| e, true | Correct sign changes and the two ends of each component establish the attained extrema and closed range endpoints. Independent bounds f+2=(x+1)^2/x<=0 for x<0 and f-2=(x-1)^2/x>=0 for x>0 confirm them. Correct rationale; null misconception. |
| f, false | Incorrectly isolating x as 1/x instead of -1/x gives x^2=1 and the two candidate spurious zeros. Actual f(-1)=-2 and f(1)=2, so the lost-transposition-sign error reproduces a false intercept claim. |
| g, false | Taking the interval hull of the two unbounded component ranges yields R and fills (-2,2). This is exactly the stated wrong procedure. The actual range union omits 0, so y=0 is a concrete counterexample to the horizontal-line claim. |

### nc07: x^2+2/x

Independent negative branch is strictly decreasing with range R.
Only the positive branch has minimum 3 at x=1 and range `[3,infinity)`.

| Option | Comparison with author rationale and misconception |
| --- | --- |
| a, false | The stated substitution 2/x -> 2/abs(x) makes both one-sided limits positive infinity, reproducing the candidate. Actual left limit is negative infinity. The sign-ignoring procedure matches and its conjunction is false. |
| b, true | Domain excludes zero; h=0 gives x^3+2=0 with sole real root -cuberoot(2), and no y-intercept. Correct rationale; null misconception. |
| c, true | Zero-side limits are negative and positive infinity, and h-x^2=2/x tends to 0 at both infinite ends. This is quadratic asymptotic behavior, not a straight-line asymptote. Correct rationale; null misconception. |
| d, false | Considering only x>0 gives precisely minimum 3 and range [3,infinity), which the wrong procedure promotes to whole-domain claims. But h(-1)=-1<3 and h tends to negative infinity at 0-. Dropping the negative component accurately explains both false assertions. |
| e, true | On x<0, h'=2(x^3-1)/x^2<0. Its continuous decrease from positive to negative infinity yields every real output. Correct rationale and full-range inference; null misconception. |
| f, false | The wrong reciprocal derivative +2/x^2 gives 2(x^3+1)/x^2, with negative-to-positive sign change at -1. Retaining actual h(-1)=-1 invents the displayed minimum (-1,-1). The actual derivative is negative on the whole negative component and equals -4 at -1. This precise sign error generates the false turn. |
| g, true | On positive x the correct derivative is negative before 1 and positive after; h(1)=3 and both positive ends tend to positive infinity. The identity h-3=(x-1)^2(x+2)/x>=0 confirms the branch-only bound and range. Correct rationale; null misconception. |

## All Eight Source Mappings and Unit Justifications

Every source number occurs exactly once in coverage, and its question IDs equal
the reverse mapping from question source_numbers. No omitted source is hidden.

| Source | Author mapping | Independent coverage and capacity comparison |
| --- | --- | --- |
| 367 | nc01 | Both proportional derivatives retained; merge with 368 compares constant slopes against additive intercepts. Written production of the two functions is explicitly not assessed. |
| 368 | nc01 | Both affine derivatives retained, including constants' zero contribution. The same coherent slope unit preserves the distinction. Written production is explicitly not assessed. |
| 369 | nc02 | Both scaled products retained with all original factors; merge with 370 contrasts scalars and unscaled products. Author declares that tuple recognition does not establish the three calculations. First-entry-only discrimination is an additional concrete sampling limit retained below. |
| 370 | nc02 | Entire unscaled derivative retained as third component, not silently dropped for redundancy. It shares the same product theorem while differing in factor offset and scaling. Separate calculation is not forced on every elimination route. |
| 371 | nc03 | Distinct three-factor extension kept as one full quadratic result. Author internal terms match independently; lost written construction/simplification is declared. |
| 372 | nc04 | Equal-factor multiplicity and nonunit slope kept in one derivative. Repeated products suffice without a new selected chain-rule definition. Lost written derivation is declared. |
| 373 | nc05 | Both quadratic-factor contributions and subtraction kept in a full cubic derivative. Lost independent writing or expansion is declared. |
| 374 | nc06, nc07 | Both genuinely different curves kept as separate native multiple questions, with both negative branches included. Both original drawings remain unchanged; graph-production losses and untested mathematical relationships are explicitly recorded. |

Selected definitions also agree with the independent stage-1 interpretation:
block 10 adds both product terms and extends by repetition; block 14 retains a
constant multiplier. nc01 cites 14; nc02/nc03/nc05 cite 10 and 14; nc04 cites
10 for repeated products. Graph questions need not artificially cite these
selected definitions. No unresolved definition or image evidence is required.

### The nc02 First-Entry Discrimination Limit

The first entries of a,b,c,d are all different. Computing only
`p'=(6x-6)/5` can therefore select a without evaluating q' or r'. This is a
real limit on evidence of whole-tuple mastery, preserved from stage 2.

The author does not claim each successful route independently calculates every
component. Its recorded limitation says the ordered selection does not
demonstrate production of all three product-rule calculations, and its unit
reason presents a coherent complete-result contrast rather than independent
response cells. q' and r' are mathematically present and every alternative's
three entries were independently checked; presence is not recast as proof that
a learner calculated each one.

Computing p' still requires a genuine product and scalar judgment. There is no
trusted answer cell to copy. Requiring every elimination route to force every
component would invent a stronger assessment requirement than the declared
additional-recognition-practice purpose. No revise verdict is imposed for that
stronger requirement, and the limitation is not erased.

### Production Loss Versus Untested Mathematics in 374

Producing axes, scale, plotted points, tangents and coordinated branch drawings
is not demonstrated by property selection. Both drawing tasks are named
separately in coverage omitted_tasks and remain unchanged as written tasks.

There are also actual mathematical relationships not directly tested by the
views, distinct from drawing production:

- For f: origin symmetry; concavity on both signs of x; no inflection at excluded
  zero; positions below/above y=x; explicit signed end behavior in a coordinated
  drawing.
- For h: concavity/convexity and negative inflection at its x-intercept; lack of
  even/odd symmetry; positions below/above y=x^2; lack of a straight-line
  asymptote at infinity; coordinated placement in quadrants II, III and I.

The author's intent limitations and 374 coverage explicitly record symmetry,
concavity, the second inflection, asymptote-side position and straight-line
asymptote rejection. The complete internal author solutions correctly supply
those facts, including f''=2/x^3 and h''=2+4/x^3, and agree with frozen stage 1.
Internal solution correctness is not treated as learner assessment of them.

What is visibly tested remains substantial: domains, zeros, asymptotic
behavior, both branches' monotonicity, extrema and separate ranges. In
particular, the negative branch of h is retained and is essential to refuting
the whole-graph minimum claim. This is not a silent removal of the original
drawing task or a claim that recognition proves complete graph construction.
The recorded narrower mathematical sampling is acceptable for the stated
additional practice, not approval of an exhaustive replacement assessment.

## Fidelity, Redundancy and Leakage After Key Disclosure

The pre-key visible-purpose findings remain unchanged. Constant slopes,
two-factor products, unequal three-factor products, repeated factors and the
quartic product are distinct coherent units. The curves differ decisively in
their negative branch and full-range behavior.

Within nc06, establishing derivative signs can refute reversed extrema, and
establishing branch ranges can refute range R. Within nc07, establishing the
negative branch refutes both the invented turn and the whole-graph minimum.
These are implications between untrusted candidate statements and require
mathematical judgment. No candidate is certified as a premise, no correct-count
hint is given, and no other stem supplies a correct set. Such consistency and
reasonable elimination are not answer leakage.

## Local Verification Note

The first local assertion run stopped on strict binary floating-point equality:
JavaScript evaluated `(3/5)*(1/2)*(1/3)` as `0.09999999999999999`, while
`1/10` is represented as `0.1`. This first check failure is retained here,
not erased or characterized as a semantic pass by that failed run.

The mathematical identity is exact: the product is `3/30=1/10`.
The completed local check uses integer cross-multiplication, `3*10=30`,
for this identity instead of binary floating-point strict equality.
No source, option, author derivation, true set or semantic verdict changed.
This numerical assertion failure is not an author defect or a reviewer
revise/blocked verdict. Official validation remains unrun.

## Verdict and Remaining Boundary

Every source coverage verdict, visible fidelity/redundancy/leakage verdict and
option-mathematics verdict is pass with the concrete evidence in review.json.
No first revise or blocked verdict arose, so none was replaced, normalized or
discarded. All 21 misconceptions produce their actual false alternatives;
false options themselves are not author failures.

This is an offline semantic pass for this exact seed/draft snapshot and
declared purpose. It does not certify independent learner writing or drawing,
every-component calculation on every route, original-source freshness,
historical author process, official mechanical validation, retained integration
or publication.

All final artifacts are to be frozen at 0444. STOP OPEN for full parent intake
and actual close. Official reviewed-retention validation belongs to the parent
after that intake/close; it was not run here. No other lesson was rerun or read,
and no author draft was changed.
