# Stage A: Independent Source Freeze

Scope: STEMROBIN-184 / book `10c` / lesson `ana10-c6-ex`.
Sole cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
All 57 selected original tasks, 335 through 391, have independent mathematical
solutions below and in `source-first.json`. This is not semantic approval of any
NEW-choice component.

## Actual Seed Binding

- Only mathematical input: `.tmp/stemrobin-184-six/c6-resume/seed.json`.
- Canonical SHA-256:
  `975572b776f0d768d41ad48d2bc5f45c2c1ce80f6c6fa727171d7e39107fe5a8`.
- Actual file-byte SHA-256:
  `f0747835c331c9950447f95619afe40c76bc1517a19a6eb3479a5086ff3d0c84`.
- Canonical digest, identity, exact ordered range, count 57, empty concepts and
  empty figures were checked from that actual file, not assumed from the request.
- No views, draft, author solutions, handoff, keys, old reviews, answers,
  interactions, checkpoint, history or other lesson was opened.
- Protocol reads only: installed choice `SKILL.md`, `references/review.md`,
  `references/contract.md`, and the lean `production-resume.md` boundaries.

The reviewer is the directly human-authorized independent agent. No peer or own
agent was contacted. Network/paid auxiliary calls, dependencies, DB, app, Git,
branches, worktrees, publication and image use: zero. Model/hidden cost: UNKNOWN.

## Conventions

Unmarked angles are radians; explicit degree angles stay degrees. `tan=tg`,
`cot=ctg`, `k` is any integer. Principal inverse ranges are arcsin
`[-pi/2,pi/2]`, arccos `[0,pi]`, arctan `(-pi/2,pi/2)`; conventional arcctg is
`(0,pi)`. Only its positive argument 1 occurs, giving `pi/4`.

Harmonic amplitudes are positive. Sine and cosine phase values are distinguished,
equivalent modulo `2pi`; a phase is not a horizontal shift. In 348 and 349 the
mixed numbers mean `8/3` and `5/3`. In 338 the literal constant is `2.3` and
the shifted argument is exactly `x+2`.

Simplification never silently extends the original domain. All equation
solutions below are complete real solution sets, not merely principal roots.
For graph descriptions, `t` locates a maximum and `T` is the least period.
Derivative-sign intervals are open; the monotone graph arcs include their
stationary endpoints. There is no scientific HOLD in the actual seed.

## Derivatives: 335-341

335. For `y=sin(5x)`, chain differentiation gives
`y'=5cos(5x)`, for every real x. The inner factor 5 is indispensable.

336. For `y=cos(6x+pi/2)`,
`y'=-6sin(6x+pi/2)=-6cos(6x)`, on R. The phase is constant, but the
argument's derivative is 6; both the chain factor and cosine's minus sign remain.

337. For `y=cos^2(ax+b)` with fixed real a,b, square and inner-chain
differentiation give
`y'=-2a cos(ax+b)sin(ax+b)=-a sin(2ax+2b)`. This includes `a=0`.
Domain: R.

338. For `y=2x sin x-(x^2-2.3)cos(x+2)`, each product must be differentiated:
`y'=2sin x+2x cos x-2x cos(x+2)+(x^2-2.3)sin(x+2)`, on R.
The outside subtraction changes the sign of the second product's negative
cosine derivative. Neither the decimal nor the shift is altered.

339. For `y=(x^2+x+1)sin(3x)`,
`y'=(2x+1)sin(3x)+3(x^2+x+1)cos(3x)`, on R, by product and chain rules.

340. For `y=sin x cos x`,
`y'=cos^2 x-sin^2 x=cos(2x)`, on R. The equivalent
`y=(1/2)sin(2x)` checks the same result.

341. For `y=tan x+(1+cot x)cos x`,
`y'=1/cos^2 x-cos x/sin^2 x-(1+cot x)sin x`
`=1/cos^2 x-cos x/sin^2 x-sin x-cos x`.
The original domain excludes `x=kpi/2`: both sine and cosine must be nonzero.
The simplification does not restore excluded points.

## Limits: 342-345

342. Put `h=pi/2-x`. As x approaches pi/2 from either side, h approaches zero,
and `sin h/h -> 1`. The value at the missing point is unnecessary.

343. `sin(3x)/(5x)=(3/5)[sin(3x)/(3x)] -> 3/5`.

344. In a small punctured neighborhood of zero,
`sin(4x)/sin(7x)=(4/7)[sin(4x)/(4x)]/[sin(7x)/(7x)] -> 4/7`.
The denominator has no other nearby zero.

345. Replacing tangent by sine/cosine yields
`(5/3)[sin(5x)/(5x)][3x/sin(3x)]cos(3x) -> 5/3`.
All four are two-sided radian limits; normalizing each actual argument is the
decisive calculation, rather than treating every coefficient as one.

## Amplitudes and Phases: 346-347

346(a). `3sin(2x-pi/4)` has amplitude 3, frequency 2, period pi,
sine phase `-pi/4`; cosine form is `3cos(2x-3pi/4)`.

346(b). Cosine evenness changes `2cos(pi/5-4x)` to
`2cos(4x-pi/5)`. Amplitude 2, positive frequency 4, period `pi/2`,
cosine phase `-pi/5`. Sine form is `2sin(4x+3pi/10)`.
The original signed frequency -4 and phase pi/5 also describe the same function;
it is inconsistent to change one without the other.

347(a). `-0.6cos(x/2+0.3pi)` equals
`(3/5)cos(x/2+13pi/10)` or `(3/5)sin(x/2-pi/5)`.
Amplitude `3/5`, frequency `1/2`, period `4pi`; positive-amplitude
cosine phase `13pi/10=-7pi/10 (mod 2pi)` or sine phase `-pi/5`.

347(b). With `u=x+1`, the addition formula gives
`(sqrt(3)/2)sin u+(1/2)cos u=sin(u+pi/6)`.
Amplitude 1, frequency 1, period `2pi`, sine phase `1+pi/6`;
cosine phase `1-pi/3`. The offset 1 remains.

## Derivative Investigations and Graphs: 348-350

348. `f(x)=(3/2)cos((8/3)x+pi/9)`
`=(3/2)cos((8/3)(x-t))`, with `t=-pi/24`, `T=3pi/4`.
Domain R, range `[-3/2,3/2]`, amplitude `3/2`, shift left `pi/24`.
Derivatives:
`f'=-4sin((8/3)x+pi/9)`,
`f''=-(32/3)cos((8/3)x+pi/9)=-(64/9)f`.
Maxima `t+kT` have height `3/2`; minima `t+T/2+kT` have height `-3/2`.
The derivative is negative on `(t+kT,t+T/2+kT)` and positive on
`(t+T/2+kT,t+T+kT)`.
Zeros/inflections are `t+T/4+kT/2=7pi/48+3kpi/8`.
Positive/concave-down arcs:
`(t-T/4+kT,t+T/4+kT)`.
Negative/concave-up arcs:
`(t+T/4+kT,t+3T/4+kT)`.
Successive complete-period landmarks are
`(t,3/2)`, `(t+3pi/16,0)`, `(t+3pi/8,-3/2)`,
`(t+9pi/16,0)`, `(t+3pi/4,3/2)`.
Repeat these with the stated derivative signs. The y-intercept is
`(3/2)cos(pi/9)`. The smooth bounded graph is neither even nor odd about zero;
it has reflection symmetry about each extremum and central symmetry about zeros.
Giving only amplitude/period would omit the derivative and graph task.

349. `g(x)=3cos((5/3)x+pi/12)=3cos((5/3)(x-t))`,
`t=-pi/20`, `T=6pi/5`. Domain R, range `[-3,3]`, amplitude 3,
shift left `pi/20`.
`g'=-5sin((5/3)x+pi/12)`,
`g''=-(25/3)cos((5/3)x+pi/12)=-(25/9)g`.
Maxima `t+kT`: 3; minima `t+3pi/5+kT`: -3.
Decrease on `(t+kT,t+3pi/5+kT)`;
increase on `(t+3pi/5+kT,t+6pi/5+kT)`.
Zeros/inflections: `pi/4+3kpi/5`.
Positive/concave-down arcs:
`(t-3pi/10+kT,t+3pi/10+kT)`.
Negative/concave-up arcs:
`(t+3pi/10+kT,t+9pi/10+kT)`.
One period is fixed by the five landmarks
`(t,3)`, `(t+3pi/10,0)`, `(t+3pi/5,-3)`,
`(t+9pi/10,0)`, `(t+6pi/5,3)`.
The y-intercept is `3cos(pi/12)=3(sqrt(6)+sqrt(2))/4`.
The graph is smooth, bounded, neither even nor odd about zero and has the
corresponding extremum/zero symmetries.

350. For `y=cos(2x-pi/4)`,
`y'=-2sin(2x-pi/4)`, `y''=-4cos(2x-pi/4)=-4y` on all R.
Thus it is a global smooth solution of the differential equation, verified
identically, not merely at a point.
The inherited investigation/graph heading is also covered:
`t=pi/8`, `T=pi`, range `[-1,1]`, amplitude 1.
Maxima `t+kpi`, minima `t+pi/2+kpi`,
zeros/inflections `3pi/8+kpi/2`.
Decrease on `(t+kpi,t+pi/2+kpi)` and increase on
`(t+pi/2+kpi,t+pi+kpi)`.
Positive/concave-down on `(t-pi/4+kpi,t+pi/4+kpi)`,
negative/concave-up on `(t+pi/4+kpi,t+3pi/4+kpi)`.
Successive period values at `t,t+pi/4,t+pi/2,t+3pi/4,t+pi` are
`1,0,-1,0,1`. `y(0)=sqrt(2)/2`, `y'(0)=sqrt(2)`.

## Harmonic Rewriting: 351-356

351. The cosine difference formula produces
`2cos(2x-pi/4)=2sin(2x+pi/4)`.
Amplitude 2, frequency 2, period pi; preserve the outer factor.

352. Put `u=3x+pi/12`. The coefficient norm is 5. With
`delta=arctan(3/4)` in quadrant I, `cos delta=4/5`, `sin delta=3/5`,
so `3cos u+4sin u=5sin(u+delta)`.
Alternatively, `epsilon=arctan(4/3)` in quadrant I gives `5cos(u-epsilon)`.
The phase relation is `delta+epsilon=pi/2`; period `2pi/3`.
Expansion, including the retained pi/12 offset, fixes both coefficients and signs.

353. `(1/2)(cos x-sin x)=(sqrt(2)/2)cos(x+pi/4)`
`=(sqrt(2)/2)sin(x+3pi/4)`. Amplitude `sqrt(2)/2`, period `2pi`.

354. `3sin(2x)` is already harmonic: amplitude 3, frequency 2,
sine phase 0, period pi; cosine form `3cos(2x-pi/2)`.

355. `4-8cos^2 x=4-4(1+cos(2x))=-4cos(2x)`
`=4cos(2x+pi)=4sin(2x-pi/2)`.
Amplitude 4, frequency 2, period pi, mean zero: there is no residual vertical shift.

356. `-2sin x-4sqrt(3)cos x` has amplitude `2sqrt(13)`.
For sine form `A sin(x+phi)`, coefficient comparison gives
`cos phi=-1/sqrt(13)`, `sin phi=-2sqrt(3)/sqrt(13)`.
Thus phi is in quadrant III,
`phi=pi+arctan(2sqrt(3)) (mod 2pi)`.
Cosine form has phase
`psi=pi-arctan(1/(2sqrt(3)))` in quadrant II.
Period `2pi`. The coefficient signs, not the tangent ratio alone, choose the phase.

## Simplification with Domains: 357-360

357. `cos(pi-alpha)=-cos alpha`,
`cot(pi/2-alpha)=tan alpha`, so the product is `-sin alpha`.
Original domain `cos alpha!=0`, excluding `alpha=pi/2+kpi`.

358. The four reductions are respectively `tan alpha`, `-cos beta`,
`-cos beta`, `-tan alpha`. The quotient is therefore -1.
Original domain requires `cos alpha!=0`, `sin alpha!=0`, `cos beta!=0`:
`alpha!=kpi/2`, `beta!=pi/2+kpi`. Cancelling the two denominator factors
does not authorize their zeros.

359. Squaring `sin(3pi/2+x)=-cos x` and `sin(pi+x)=-sin x` leaves
`sin^2 x/cos^2 x=tan^2 x`. Domain `x!=pi/2+kpi`.

360. `cos(3pi/2-alpha)=-sin alpha`, so the quotient is
`cos^2 alpha/(1+sin alpha)=1-sin alpha`.
Original exclusion is only `sin alpha=-1`, or `alpha=-pi/2+2kpi`;
`sin alpha=1` is allowed and produces zero.

## Reduction Identities: 361-362

361. On `cos x!=0`,
`tan(pi-x)=-tan x`, `cot(pi/2+x)=-tan x`.
The LHS independently reduces to `-tan x`; the RHS
`tan(2pi-x)` also reduces to `-tan x` by oddness and periodicity.
Original joint domain is `x!=pi/2+kpi`, not an exclusion of `sin x=0`.

362. Keep degrees. Write `s=sin y`, `c=cos y`. The factors on the left
become `c,-c,-tan y`; those on the right likewise become
`c,-c,-tan y`, since cotangent has period 180 degrees.
Both products are `c^2 tan y=sc` on `c!=0`.
Joint domain `y!=90deg+180deg*k`. Both side reductions, including signs,
are the proof, rather than selecting the displayed RHS.

## Exact and Principal Inverse Values: 363-373

363. Quadrant/reference-angle values:
`cot135deg=-1`, `sin210deg=-1/2`, `cos225deg=-sqrt(2)/2`.
Product `10*(-1)*(-1/2)*(-sqrt(2)/2)=-5sqrt(2)/2`.

364. `2sin^2(225deg)=1`, `cot330deg=-sqrt(3)`,
`tan405deg=tan45deg=1`. The subtraction gives `1+sqrt(3)`.

365. `arcsin(sqrt(3)/2)=pi/3`, `arcsin(1/2)=pi/6` on the
principal sine-inverse range; sum `pi/2`.

366. `arccos(1/2)=pi/3`, `arccos(sqrt(2)/2)=pi/4` on `[0,pi]`;
sum `7pi/12`.

367. `arcsin(-1/2)=-pi/6`, `arccos(-sqrt(3)/2)=5pi/6`;
sum `2pi/3`. The negative cosine argument calls for quadrant II, not a
negative inverse-cosine angle.

368. Principal `arctan(-1)=-pi/4`, `arctan(1)=pi/4`; sum zero.

369. Principal `arctan(sqrt(3))=pi/3`, `arcctg(1)=pi/4`;
sum `7pi/12`.

370. Independently evaluating `arccos0=pi/2` and
`arcsin(sqrt(2)/2)=pi/4` verifies the sum `3pi/4`.

371. The actual seed is `arccos(-1)+arccos1=pi`. On `[0,pi]`,
the inverse endpoint values are pi and zero. Their sum verifies the equality.
There is no concrete ambiguity in this expression.

372. Principal values `-pi/4` and `pi/4` verify the zero sum;
oddness of principal arcsin gives the same conclusion.

373. The actual seed is `arctan(-1)+arcctg1=0`. Principal values
`-pi/4` and `pi/4` independently give zero. No negative inverse-cotangent
argument or unresolved branch is present. Neither this nor 371 uses any
historical provenance notice as mathematical evidence.

All verification tasks require decisive inverse evaluations; their printed RHS
cannot itself supply the learner's mathematical reasoning.

## Double/Half-Angle Proofs and Values: 374-381

374. With `c=cos alpha`, `s=sin alpha`, numerator `(c-s)(c+s)`,
denominator `(c+s)^2`. Cancel on `c+s!=0` to prove `(c-s)/(c+s)`.
Joint exclusion `alpha=-pi/4+kpi`; `c=0` alone is not excluded.

375. Let `u=pi/4+alpha`. On `cos u!=0`,
`(tan^2 u-1)/(tan^2 u+1)`
`=(sin^2 u-cos^2 u)/(sin^2 u+cos^2 u)`
`=-cos(2u)=-cos(pi/2+2alpha)=sin(2alpha)`.
Domain `alpha!=pi/4+kpi`. No `tan alpha` exists in the original expression,
so no separate exclusion of `cos alpha=0` may be introduced.

376. With `s=sin alpha`, `c=cos alpha`, numerator `2s(s+c)`,
denominator `2c(c+s)`. Cancellation proves `s/c=tan alpha` on
`c!=0` and `c+s!=0`: exclude `pi/2+kpi` and `-pi/4+kpi`.
The second excluded set does not disappear from the identity's domain.

377. `2sin15deg cos15deg=sin30deg=1/2`; dividing by 2 verifies
the stated product `1/4`. The double-angle inference must remain substantive.

378(a). Given `sin alpha=4/5`, `0<alpha<pi/2`, derive `cos alpha=3/5`.
The half-angle is in quadrant I: the positive roots yield
`sin(alpha/2)=1/sqrt(5)`, `cos(alpha/2)=2/sqrt(5)`,
`tan(alpha/2)=1/2`.

378(b). Given `tan alpha=24/7`, `180deg<alpha<270deg`,
the 7-24-25 triangle and quadrant III yield
`sin alpha=-24/25`, `cos alpha=-7/25`.
The half-angle is in quadrant II, between 90 and 135 degrees.
Therefore `sin(alpha/2)=4/5`, `cos(alpha/2)=-3/5`,
`tan(alpha/2)=-4/3`. Magnitudes alone are insufficient; both quadrants and
all six requested values must survive a later fidelity comparison.

379. Set `c=cos(beta/2)`, `s=sin(beta/2)`.
RHS `sec beta-tan beta=(1-sin beta)/cos beta`
`=(c-s)^2/[(c-s)(c+s)]=(c-s)/(c+s)` when `cos beta!=0`.
This proves the LHS on joint domain `beta!=pi/2+kpi`.
The LHS alone is defined at `beta=pi/2+2kpi` and gives zero, but the original
RHS is undefined there; cancellation does not extend the identity to those points.

380. With `t=alpha/2`,
`cot t-tan t=(cos^2 t-sin^2 t)/(sin t cos t)`
`=cos alpha/[(1/2)sin alpha]=2cot alpha`.
Joint domain `sin alpha!=0`, excluding `alpha=kpi`; both half-angle
denominators are then nonzero. The factor 2 is essential.

381. Given `cos alpha=-1/2`, `pi<alpha<3pi/2`, alpha is `4pi/3`
and its half is quadrant II. If `t=tan(alpha/2)`,
`(1-t^2)/(1+t^2)=-1/2` implies `t^2=3`; the quadrant selects `t=-sqrt(3)`.
The requested representations are
`sin alpha=2t/(1+t^2)`,
`tan alpha=2t/(1-t^2)`,
`cot alpha=(1-t^2)/(2t)`.
They give `-sqrt(3)/2`, `sqrt(3)`, `sqrt(3)/3`, respectively.
The sine formula has positive denominator for real t; tangent requires
`t^2!=1`, cotangent `t!=0`, both satisfied. Merely listing the values would
omit the source's explicit rational-representation task.

## Complete Equation Solutions: 382-387

382. Difference of fourth powers at the half-angle equals
`(sin^2(x/2)-cos^2(x/2))*1=-cos x`.
Thus `cos x=-1/4`. Complete set:
`x=+/- arccos(-1/4)+2kpi`, equivalently
`x=pi +/- arccos(1/4)+2kpi`.
The principal arccos here lies in quadrant II; both families are required.

383. Moving `2sin(2x)=4sin x cos x` gives
`(cos x-2sin x)^2=0`.
Neither `cos x=0` nor `sin x=0` can satisfy the original equation.
Hence `tan x=1/2`, complete set `x=arctan(1/2)+kpi`.
There is no extra plus/minus branch for a square equal to zero.

384. Set `c=cos(x/2)`. The original equation becomes
`8c^2=3(1-c^2)c`, hence `c(3c-1)(c+3)=0`.
`c=-3` is outside the cosine range. Preserve `c=0` and `c=1/3`.
The complete union is
`x=pi+2kpi` and `x=+/-2arccos(1/3)+4kpi`.
Dividing by c loses the first branch. Using `2kpi` instead of `4kpi` in
the second incorrectly changes the sign of the unsquared half-angle cosine.

385. `sin x+sin3x=2sin2x cos x=4sin x cos^2 x`.
The factor-zero sets are `x=kpi/2` and `x=pi/2+kpi`; the latter is
contained in the former. Complete nonredundant family `x=kpi/2`.

386. `cos2x-cos6x=2sin4x sin2x`.
The root sets are `x=kpi/4` and `x=kpi/2`, with the latter contained in
the former. Complete family `x=kpi/4`.

387. Sine difference gives `sqrt(3)sin x=1`. Put
`theta=arcsin(1/sqrt(3))` in quadrant I.
Complete set `x=theta+2kpi` or `x=pi-theta+2kpi`.
`theta+kpi` is not equivalent: alternate terms have negative sine.

## Product-to-Sum: 388-391

388. With `A=2x+y`, `B=x+2y`,
`sin A cos B=(1/2)[sin(A+B)+sin(A-B)]`
`=(1/2)sin(3x+3y)+(1/2)sin(x-y)`, for all real x,y.
The sine difference is oriented; reversing it needs a sign change.

389. `cos(2alpha-beta)cos(2alpha+beta)`
`=(1/2)[cos4alpha+cos(-2beta)]`
`=(1/2)cos4alpha+(1/2)cos2beta`, for all real alpha,beta.
The negative difference angle is removed by cosine evenness, not sine oddness.

390. For `A=2x-y`, `B=x+2y`,
`sin A sin B=(1/2)[cos(A-B)-cos(A+B)]`
`=(1/2)cos(x-3y)-(1/2)cos(3x+y)`, for all real x,y.
Both the minus and the y-coefficients are decisive.

391. `4cos^2(x/2)sin^2(x/2)=[2sin(x/2)cos(x/2)]^2`
`=sin^2 x=1/2-(1/2)cos2x`, for all real x.
The final constant-plus-cosine sum, not merely the intermediate square, completes
the written task.

## Freeze Boundary and Limitations

The independent mathematical source work is complete for all 57 sources.
Scientific HOLD list: empty. The source and task distinctions above are frozen
before receiving any question views. No alternatives or option keys have been
constructed, and there is no semantic `outcome` or independent approval yet.

Next disclosure must contain only key-free question `id`/`view` objects.
Every visible option must be independently evaluated and complete true sets
frozen before any author solution, key or misconception derivation is opened.
Fidelity, redundancy, leakage and coverage remain wholly unassessed at this stage.
Graph/construction-to-recognition will be judged by substantive distinctions and
explicit losses, not rejected simply for being recognition.

The existing 57-answer review is not this assignment and has not been read.
Unchanged written display evidence is to be reused, not rerun.
The final complete NEW-component desktop/mobile display remains a later stage;
images so far 0, any later batches bounded by 8 and total 24.
All writes are restricted to this reviewer directory. These two files are
source-freeze evidence, not replacements for the final contract review.
