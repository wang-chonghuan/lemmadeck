# n79 CHOICE Stage2: Peirce view-only independent freeze

## Authority and snapshot

STEMROBIN-184. Independent reviewer, not the choice author. Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

This stage reads only the disclosed `ana10-n79-choice-views.json` and current review rules, carrying forward the already-frozen Stage1 source conclusions. No fresh source solving, source-image review, browser, answer artifact, draft, key, author source-solve/notes, or other reviewer report is involved.

| Snapshot | Raw SHA-256 |
| --- | --- |
| `.intentfold/tickets/STEMROBIN-184/tmp/ana10-n79-choice-views.json` | `6bae66d6b2b69d2368450a64571ed7a5216f05274012cce31d92681a355e4666` |
| `.intentfold/tickets/STEMROBIN-184/tmp/ana10-n79-choice-peirce-source-first.md` | `8c2a1cffdc050d96af99da840734dfeacfdf75ca50a8e1f0c5e2e84859d71c14` |

The observed snapshot has 10 questions and 45 options. Every view/option has an empty figure list. No new choice figure is present. Parent layout evidence is not substituted for semantic evidence here.

The source association below is inferred solely from the written mathematical tasks, not read from internal mapping:

| Source | Visible questions |
| --- | --- |
| 46 | Q1, Q2 |
| 47 | Q3 |
| 48 | Q4, Q5 |
| 49 | Q6, Q7 |
| 50 | Q8, Q9 |
| 51 | Q10 |

## Phase A: fidelity, redundancy, leakage, and capacity

This section was recorded before the per-option mathematics section. It does not derive any answer from an author's key.

### Task fidelity

- **Q1:** A complete first/second-derivative, motion, convexity, and range description of source 46(a). The original interval is unchanged. All alternatives supply the same range, so this particular question does not assess independently finding the range or excluding its endpoints.
- **Q2:** Retains the whole interval of source 46(b), whole-interval monotonicity, derivative behavior on each side of zero, and the interior convexity change. It does not silently assign one convexity type to the whole interval.
- **Q3:** Coherently retains all three intervals of source 47 in one response unit. Domain, range, speed, and convexity distinctions remain visible. It is not one click per original interval.
- **Q4/Q5:** Split the two objectives of source 48 into the complete pair of tangent equations and inflection reasoning. Both abscissae remain; Q5 includes local tangent-side geometry and a general sufficiency claim to judge.
- **Q6/Q7:** Preserve both locations in source 49, the pair of tangent equations, branch intervals, asymptotes, and inflection/tangent relationships. Q7 is a verbal recognition task, not an actual drawing or examination of a completed drawing.
- **Q8/Q9:** Split source 50 into two derivative calculations and a joint algebraic proof criterion using tangent residuals for arbitrary real `x,t`. Q9 requires checking the identities; the target convexity names in the stem are the original proposition to prove, not a supplied proof.
- **Q10:** Preserves the cubic, both requested unbounded open intervals, and the complete second-derivative/convexity result of source 51. Selection can require derivative and sign reasoning, but does not demonstrate composing the written proof.

No essential source condition has been added, reversed, or silently dropped in these visible stems. The explicitly supplied course naming of convexity must continue to govern every check.

### Redundancy and response units

The splits Q4/Q5, Q6/Q7, and Q8/Q9 distinguish calculation from explanation/geometry/proof and are not merely numerical answer slots.

There is material partial overlap:

- Q2(d) revisits the zero-point sine inflection that Q5(a) addresses through second-derivative signs.
- Q3(e) supplies the zero-point tangent crossing that is part of Q7(b)/(c).

Some overlap comes from the original source tasks themselves. Q5 additionally tests the point at `pi` and a general inflection criterion; Q7 additionally tests the branch centered at `-pi` and asymptote/branch geometry. Thus neither pair is a duplicate of an entire mathematical task. The common facts should not be counted as independent new coverage, and package cueing is evaluated separately.

### Concrete cross-question leakage

**V1: Q3(d) can be rejected from other stems without its own domain reasoning.** Q6 asks for the tangent to the tangent-function graph at abscissa zero; Q7 explicitly considers a continuous branch containing zero and its center tangent. Those stems already establish that zero is a graph-point abscissa, contrary to the Q3(d) claim that the function is undefined there.

**V2: zero-slope distractors are excluded by another question's entire answer universe.** Every Q4 candidate has a first tangent slope `+1` or `-1`, never zero. Therefore, given the single-choice task's assertion that one group is correct, Q2(e)'s zero-slope claim can be rejected without independently differentiating sine. Likewise every Q6 candidate assigns slopes `+1` or `-1`, never zero, which excludes Q7(e)'s claim that both tangents have slope zero. This is a cross-question elimination route, not a claim that an unselected alternative is an answer.

These are visible package dependencies. They do not make the source mathematics indeterminate, but warrant a **revise** judgment on affected answer-leakage checks. No author text was changed.

### Capacity and proof/drawing losses

- Q1/Q2/Q3 recognize supplied descriptions rather than independently composing a complete function discussion. Q1 additionally provides the same range in every alternative.
- Q4/Q6 recognize pairs of equations rather than producing them without alternatives.
- Q5/Q7 recognize inflection explanations and graph relations rather than writing full arguments.
- **Source 49's autonomous drawing task is not performed anywhere in this view.** Q7 can assess meaningful branch/asymptote/tangent reasoning but must not be claimed to prove drawing ability. No picture is present.
- Q8 recognizes derivative results. Q9 recognizes an algebraic proof mechanism rather than producing its expansions and explanation. Q10 recognizes the derivative/sign/convexity result rather than composing the original proof.

These are concrete losses to compare against the internal limitations/coverage only after Stage3 authorization. Loss of production is not automatically an essential blocker under the contract: these views still require substantive mathematical judgment. Honest declaration is required; unseen coverage cannot be presumed adequate.

## Phase B: independent option mathematics

Phase A was first written before these checks. Each assertion below was then evaluated independently under its actual stem and the carried-forward course convention, without an author key. `T` means correct and `F` means incorrect.

### Q1

For the stated interval, differentiating the visible sine gives `f'=cos x<0` and `f''=-sin x>0`. Its derivative increases while its absolute value decreases. The limiting function values are `0` and `-1`, both excluded.

| Option | Truth | Independent reason |
| --- | --- | --- |
| a | T | Both signs are correct, so the function decreases with decreasing speed and is 向下凸; the open range is `(-1,0)`. |
| b | F | `cos x` is negative here, not positive. Its claimed increase contradicts the first derivative, although its second-derivative sign and supplied range are correct. |
| c | F | `-sin x` is positive, not negative. The decreasing function slows rather than accelerates, and its graph is 向下凸, not 向上凸. |
| d | F | Both claimed derivative signs are reversed. Its increasing/convexity description therefore does not describe the sine on this interval. |

Complete true set: **`{a}`**. The single mode has exactly one mathematical answer.

### Q2

On the stated whole interval, `f'=cos x>0`; `f''=-sin x` is positive for `x<0` and negative for `x>0`. The open range is `(-1,1)`. Near zero the curve-minus-tangent expression is `sin x-x`, positive on the left and negative on the right.

| Option | Truth | Independent reason |
| --- | --- | --- |
| a | T | Strict increase follows from `cos x>0`; excluded endpoint limits are `-1,1`, giving precisely the displayed open range. |
| b | T | The derivative `cos x` increases on the negative half because its derivative `-sin x>0`, and decreases on the positive half where `-sin x<0`. |
| c | F | Strict increase is true, but whole-interval 向下凸 is false: on `(0,pi/2)` the second derivative is negative and the graph is 向上凸. |
| d | T | The second derivative changes sign at zero, and `sin x-x` changes from positive to negative; the claimed inflection and local above/below-tangent relation both hold. |
| e | F | `f'(0)=1`, not zero, and strict increase on both sides excludes a local maximum at zero. |

Complete true set: **`{a,b,d}`**.

### Q3

Within the principal tangent branch, `g'=sec^2 x>0` and `g''=2 tan x sec^2 x`. The latter is negative to the left of zero and positive to the right. `tan 0=0` and `g'(0)=1`. Near zero, `tan x-x` has derivative `tan^2 x`, making the residual negative on the left and positive on the right.

| Option | Truth | Independent reason |
| --- | --- | --- |
| a | T | On the negative half, a positive first derivative decreases because `g''<0`: decelerating increase and 向上凸. |
| b | T | On the positive half, `g'>0` and `g''>0`: accelerating increase and 向下凸. |
| c | F | Whole-branch strict increase holds, but its negative half is 向上凸, so it is not 向下凸 everywhere. |
| d | F | `cos 0=1`, hence `tan 0=0` exists. Its poles are `pi/2+k*pi`, not zero. |
| e | T | The convexity changes at zero and the curve-minus-tangent residual changes from negative to positive. Both the inflection and tangent-side statement are correct. |
| f | T | The endpoint limits yield `(-infinity,0)` and `(0,infinity)` on the two halves; inclusion of the zero value in the entire continuous increasing branch gives all `R`. |

Complete true set: **`{a,b,e,f}`**.

### Q4

The tangent formula applied at zero gives `y=x`. At `pi`, the point is `(pi,0)` and the slope is `cos pi=-1`, giving `y=-(x-pi)=pi-x`.

| Option | Truth | Independent reason |
| --- | --- | --- |
| a | T | Both lines have the correct slopes and pass through their required points in the required order. |
| b | F | The second line evaluates to `-2*pi` at `x=pi`, not zero. It has the right slope but the wrong intercept. |
| c | F | The slopes are `-1,+1`, opposite to the actual `+1,-1`. The second line does pass through `(pi,0)` but is not tangent there. |
| d | F | The second line has value `-pi` at `x=pi`; it is not the tangent through the required point. |

Complete true set: **`{a}`**.

### Q5

Use `f''=-sin x`. Around zero its sign is left positive/right negative; around `pi` its sign is left negative/right positive. At `pi`, with `u=x-pi`, the tangent residual is `u-sin u`, negative on the left and positive on the right.

| Option | Truth | Independent reason |
| --- | --- | --- |
| a | T | The stated second-derivative sign change at zero is exact and changes the course convexity type. |
| b | T | Immediately left of `pi`, sine is positive so its negative is negative; immediately right, sine is negative so its negative is positive. |
| c | F | Counterexample: `h(x)=x^4` has `h''(0)=0` but `h''(x)=12x^2>0` on both punctured sides. The graph does not change convexity at zero. |
| d | F | Near zero sine is left negative/right positive, but near `pi` it is left positive/right negative. The two function-value sign-change directions are opposite. |
| e | T | The residual `u-sin u` has precisely the claimed left-negative/right-positive signs relative to the tangent at `pi`. |

Complete true set: **`{a,b,e}`**. The zero-second-derivative distractor is false even though both particular source points are inflection points.

### Q6

At both `0` and `-pi`, tangent has value zero and derivative `sec^2 x=1`. The equations are `y=x` and `y=x+pi`.

| Option | Truth | Independent reason |
| --- | --- | --- |
| a | T | The slope-one lines pass through `(0,0)` and `(-pi,0)`, respectively. |
| b | F | The second candidate gives value `-2*pi` at `x=-pi`, so it misses the required point. |
| c | F | Both slopes are `-1`, whereas the tangent derivative at each point is `+1`. Passing through the contact points does not fix these wrong slopes. |
| d | F | Its second line gives value `-pi` at `x=-pi`; reusing the first tangent omits the translation of the contact point. |

Complete true set: **`{a}`**.

### Q7

The relevant continuous branches have centers `0` and `-pi` and are translated by `pi`. Each is strictly increasing. Setting `u=x-a` at either center gives `tan x=tan u`, second derivative `2 tan u sec^2 u`, and tangent residual `tan u-u`.

| Option | Truth | Independent reason |
| --- | --- | --- |
| a | T | Consecutive tangent poles bound each branch: `(-pi/2,pi/2)` and `(-3pi/2,-pi/2)`. At each bounding vertical line the function has an infinite one-sided limit, giving the stated asymptotes. |
| b | T | `sec^2 x>0` on each branch. The residual `tan u-u` is negative left of its center and positive right of it, so both tangent-side descriptions hold. |
| c | T | In each local coordinate `u`, the second derivative changes from negative to positive. Both named curve points are therefore inflection points. |
| d | F | At `x=-pi/2`, cosine is zero and tangent is undefined; there is a vertical asymptote, not the alleged finite connection or differentiable point. |
| e | F | Each center has derivative `1`, not zero, and tangent increases on both sides. Neither is stationary or a local minimum. |

Complete true set: **`{a,b,c}`**.

### Q8

Differentiate each visible polynomial twice:

```latex
f'=-2-2x,\quad f''=-2;\qquad
g'=12x-3,\quad g''=12.
```

| Option | Truth | Independent reason |
| --- | --- | --- |
| a | T | Both second derivatives equal the computed constants. |
| b | F | The quadratic `6x^2` contributes second derivative `12`, not `6`; its power-rule factor cannot be omitted. |
| c | F | Both signs are reversed relative to actual differentiation. |
| d | F | These are the first derivatives, not their derivatives. The claimed result stops one differentiation too early. |

Complete true set: **`{a}`**.

### Q9

The visible tangent formula requires its full derivative, evaluated at `t`. Direct expansion yields

```latex
f(x)-f(t)-(-2-2t)(x-t)=-(x-t)^2,
g(x)-g(t)-(12t-3)(x-t)=6(x-t)^2.
```

For `x!=t` these are strictly negative and strictly positive, respectively, with zero at contact. Under the supplied naming, these identities prove the entire-real-line 向上凸/向下凸 claims.

| Option | Truth | Independent reason |
| --- | --- | --- |
| a | T | Both identities are exact for every real `x,t`; their residual signs supply the required global proof. |
| b | F | Both residuals have been negated. They would describe tangent-minus-function, not the specified function-minus-tangent. At `t=0,x=1` the actual residual pair is `(-1,6)`, not `(1,-6)`. |
| c | F | Both quadratic coefficients are twice their true values. The second derivative contributes half its value to a quadratic tangent residual, not its full value. At `t=0,x=1` this option gives `(-2,12)`, not `(-1,6)`. |
| d | F | The nonzero linear terms must cancel when subtracting the full tangent. Its pair at `t=0,x=1` is `(-3,3)`, not `(-1,6)`. |

Complete true set: **`{a}`**. The alternatives all coincide at `x=t`, but the universal quantifier requires the identities elsewhere too; they are not equivalent answer forms.

A concrete mistaken procedure can generate option d: omit `-2` from `f'(t)` and omit `-3` from `g'(t)` before constructing the tangents. Subtracting those incomplete tangent expressions leaves the displayed linear terms. This is an independently identified possible error route, not a claim about the unread author's misconception record.

### Q10

Differentiate the visible cubic twice:

```latex
f'=3x^2-6x,\qquad f''=6x-6.
```

The second derivative is negative throughout `(-infinity,1)` and positive throughout `(1,infinity)`, giving 向上凸 on the first interval and 向下凸 on the second. The point `1` is excluded from both strict-sign assertions.

| Option | Truth | Independent reason |
| --- | --- | --- |
| a | T | The derivative, dividing point, both open intervals, and both convexity names agree with the calculation and criterion. |
| b | F | The derivative is correct, but both names are exchanged: negative second derivative means 向上凸 in this course. |
| c | F | The contribution `-6` from differentiating `-3x^2` twice is missing. The actual sign-change point is `1`, not `0`. |
| d | F | Its polynomial is the first derivative. Using its zeros at `0,2` to classify convexity confuses first-derivative monotonicity information with second-derivative convexity information. |

Complete true set: **`{a}`**.

## Complete independent true sets

| Question | Mode | True set | Checked options |
| --- | --- | --- | --- |
| q1 | single | `a` | 4/4 |
| q2 | multiple | `a,b,d` | 5/5 |
| q3 | multiple | `a,b,e,f` | 6/6 |
| q4 | single | `a` | 4/4 |
| q5 | multiple | `a,b,e` | 5/5 |
| q6 | single | `a` | 4/4 |
| q7 | multiple | `a,b,c` | 5/5 |
| q8 | single | `a` | 4/4 |
| q9 | single | `a` | 4/4 |
| q10 | single | `a` | 4/4 |

Total: **10/10 questions and 45/45 options independently checked.** Every single-mode question has exactly one true option. Every multiple-mode question has a determinate nonempty complete true set. No unresolved convention or definite false asserted-as-true author key is claimed: no author key has been read.

## Phase C: package findings after independent solving

### Mathematics and distractor substance

There is no visible mathematical ambiguity preventing the listed true sets. No within-question duplicate result defeats a single-mode key. Several correct multiple options express related but distinct properties of the same function; that is not by itself an invalid response unit.

The false alternatives expose identifiable mistakes: sign/quadrant confusion, constant-sign convexity over a split interval, treating `f''=0` as sufficient, confusing a zero with a pole, substituting the wrong tangent base point, stopping at the first derivative, omitting power-rule factors or linear tangent terms, and using `f'` to classify convexity. No arbitrary numerical distractor is identified from the views. Whether each actual internal misconception derivation generates its specific option remains a Stage3 check, not an assumption.

### V3: positional cue, distinct from a source/key leak

The independently computed answers reveal that **all six single questions have their true option first (`a`)**. All four multiple questions also include `a` and `b` in their true sets.

This is a conspicuous fixed-order pattern and a package guessing risk. Selecting the first option on every single question would obtain 6/6 without calculus once that pattern is inferred. This observation is not a claim that learners are given the key, nor a new quota requiring evenly distributed letters. It is an additional answer-design concern; the definite content dependencies V1/V2 already justify revision independently of a positional balancing policy.

### Coverage and losses

All six selected source numbers are represented by substantive visible tasks. Whole intervals, ordered tangent pairs, both quadratic functions, and the cubic's dividing point are retained. The extra range/inflection/domain assertions are connected to the original property discussions, not a replacement by unrelated facts.

Original autonomous construction/production is not fully represented:

- Source 49's requested actual graph is absent; Q7 tests verbal mathematical graph relations only.
- Sources 48/49 do not require independently writing the tangent equations.
- Sources 50/51 do not require independently producing their proof text; Q9 preserves a substantial exact algebraic proof mechanism, while Q10 preserves the derivative-sign criterion.

Whether omissions and limitations are fully and accurately recorded cannot be settled without the separately authorized internal comparison. These views are not a completed written-task assessment, and are not given an unconditional coverage PASS on the basis of correct option sets alone.

### Stage2 disposition

**View-only disposition: REVISE for answer-leakage/package dependencies V1/V2; mathematics is determinate for all 45 options.** There is no essential missing-source-premise blocker at this stage. Drawing/proof-production losses must be explicitly compared against the internal coverage; no uninspected declaration is silently accepted.

The findings identify affected content only. No author string, answer order, source, seed, or draft was edited. No structural validator, browser/layout gate, full test, service, Git, DB, or other-chat operation was run. Only this report was written.

This Stage2 report is now complete and frozen. Stop after hashing/handoff, before any internal draft/key/source-solve access. Await explicit Stage3 authorization.
