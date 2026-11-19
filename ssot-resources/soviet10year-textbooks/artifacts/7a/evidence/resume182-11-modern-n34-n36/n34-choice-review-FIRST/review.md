# STEMROBIN-182 n34 Independent FIRST Choice Review

Semantic FIRST verdict: **pass**.

Eight questions and all 38 options were independently checked. Source evidence was
completed and frozen before the structured `{id,view}` projection. Fidelity,
redundancy, leakage and all truth sets were frozen before intent, keys,
misconceptions or coverage were exposed. No source or candidate edits were made.

## Snapshot Binding

- Seed canonical SHA-256: `2379eaac29b0f067ffc5469a178c69e92fb2d4dab09b140e44eb728f362a6c73`.
- Draft canonical SHA-256: `9c5a56f1d82e26e00058da4d2e0a8ec72ebac487a0d3dd2408eee1eb258eacf7`.
- Completed source canonical SHA-256: `5f14f1f7ec74fe0a99f53d5c75bd5e3ee495e872439e5804ca552fa2c26f2b43`.
- Visible independent review canonical SHA-256: `84c1602b5dd7be0c423a8aab9c400d99e33a96bacf0a2d0ead8877e05c1a4298`.
- Canonical review SHA-256: `22763dd3c12368d93ddbc096adbf6a57b1f6c661619a3958482876883f6c076a`.

## Recovery and Image Usage

Total image loads: **4**. The two original faulty conversions and original
SOURCE-FIRST HOLD remain unchanged. Recovery opened only the two existing full
640-px normal-width previews after hashing each PNG and proving its sibling SVG
byte-equal to the seed durable SVG. There were no crops or further image loads.
Sources 748-753 were reused unchanged, not solved again. The original HOLD is
historical conversion-failure evidence; affected-only recovery resolves it.

### fig-52

Asset: `ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/figures/fig-52.svg`.
Asset SHA-256: `8fc492d5eb6dabdb3983936fbca77e3098ccb126e7668ab15932d7f79514d1c5`.
Preview: `.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-52/complete-preview.png`.
Preview SHA-256: `a0b591708acea5e423a18925b2318f5b8ae3497f203ae257b219f98ee81d1066`.

Opened the entire 640 by 640 styled preview once in authorized recovery, after the pre-open receipt established both hashes and sibling-SVG byte equality to the durable seed SVG. The full grid and both axes are visible, including their arrowheads, the rightmost rising branch and the complete bottom margin. The curve descends on the negative-x side, reaches its bottom at x=0 slightly below the horizontal axis, then ascends on the positive-x side. Labels -4, -2, 0, 2, 4 on the horizontal scale and 2, 4 on the vertical scale are legible. No exact minimum height, quadratic formula or equality of opposite-argument values is needed or inferred.

### fig-53

Asset: `ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/figures/fig-53.svg`.
Asset SHA-256: `0837b07d3cc374b0ea8d1f906f57464775f9e9b780ddec669b58a4a9a18a9d16`.
Preview: `.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-53/complete-preview.png`.
Preview SHA-256: `72b19bd615c1e5be24352e27d5934037d5777aa3468593d1ef995858e54ec164`.

Opened the entire 640 by 345 styled preview once in authorized recovery after recording hashes and sibling-SVG byte equality. The complete grid, t (s), v (m/s), axis arrowheads, rightmost end at t=16 and bottom labels are visible and unobscured. The trace starts at (0,0), rises to (6,5), is horizontal to (14,5), then falls to (16,0). Time labels 6, 14, 16 identify the phase boundaries; v=5 lies midway between the marked values 4 and 6. The axis beyond t=16 is not asserted to be an additional speed trace.

## Independent Source Solutions and Coverage

### Source 746

The actual styled fig-52 graph has a single bottom turning point at x=0. Moving left to right on the negative-x branch lowers the function value, while moving left to right on the positive-x branch raises it. Thus a) -3.6 < -2.1 < 0 implies f(-2.1) < f(-3.6); b) 0 < 1.3 < 2.8 implies f(1.3) < f(2.8); c) x1 < x2 < 0 implies f(x1) > f(x2); d) 0 < x1 < x2 implies f(x1) < f(x2). The decreasing argument set is x<0, and the increasing argument set is x>0; adjoining x=0 gives the valid maximal closed-ended half-lines (-infinity,0] and [0,infinity), respectively. This is a reading of branch order, not an assumption that the curve is exactly x^2, even, or has a specified minimum height. The stated full domain R remains unchanged.

Coverage **pass**: a retains both concrete comparisons, f both universal comparisons, and c both branch sets. The author's source solution agrees with the independently recovered fig-52 reading, without imposing a formula or symmetry. The sole capacity loss, independent written output, is explicitly recorded in intent and coverage.

### Source 747

The actual styled graph starts at (t,v)=(0,0), rises to (6,5), remains at v=5 from t=6 to t=14, and then decreases to (16,0). Consequently speed increases on [0,6], decreases on [14,16], and remains constant on [6,14]. The open interiors describe the same phases; the common boundary instants are shared endpoints, not extra phases or unassigned time gaps. The graph's displayed motion ends at t=16, so no further rest interval is inferred from the horizontal coordinate axis. Units are seconds and m/s. The final decreasing arc need not represent uniform deceleration.

Coverage **pass**: d,e,b retain respectively the rising, constant and falling phases with boundary times 0,6,14,16 and the actual graph. Author reasoning agrees with the recovered preview and does not infer post-16 continuation. The choice of phase-interior/half-open statements is explicitly described rather than falsely excluding closed plateau endpoints. Independent interval writing is recorded as lost.

### Source 748

For y = 17x - 2, points (0,-2) and (1,15) determine the straight line; its y-intercept is -2 and its x-intercept is 2/17. For x2 > x1, f(x2)-f(x1) = 17(x2-x1) > 0, so it increases on all R. For y = -2.8x + 1 = -(14/5)x + 1, points (0,1) and (5,-13), or (1,-9/5), determine the line; the x-intercept is 5/14. Its difference is -(14/5)(x2-x1) < 0, so it decreases on all R. Recognizing these completed line relationships would not demonstrate personally constructing the graphs.

Coverage **pass**: Both complete lines remain determined by two valid points and extension in both directions; both monotonicity classifications are checked. The internal solutions' intercepts 2/17 and 5/14 agree with the frozen source solve and are implicit in the recognized lines. Actual drawing, plotting accuracy and scale selection are expressly omitted, not claimed as demonstrated.

### Source 749

8x-5 and 0.01x = x/100 increase on R because their slopes 8 and 1/100 are positive. -3x+10, -49x+1000 and -x/12 decrease on R because their slopes -3, -49 and -1/12 are negative. 0x+5 = 5 is constant, hence neither increasing nor decreasing under blocks 12, 14 and 28: for any x1 < x2 its difference is zero. For each linear expression the exact difference is k(x2-x1), so large or small intercepts have no effect.

Coverage **pass**: The complete classification contains all six formulas and the positive, negative and zero slope boundary cases. Strictness and the constant's neither-category status agree with the selected definitions. The author records loss of independent writing/proof, with no substantive formula omission.

### Source 750

y = x^2 is an upward-opening parabola with vertex (0,0), symmetry axis x=0, and points (+/-1,1), (+/-2,4). It strictly decreases on (-infinity,0] and strictly increases on [0,infinity). For x1 < x2 <= 0, x2^2-x1^2 = (x2-x1)(x2+x1) < 0; for 0 <= x1 < x2 it is > 0. y = -x^2 reflects that graph across the x-axis, with points (+/-1,-1), (+/-2,-4): it increases on (-infinity,0] and decreases on [0,infinity). The open half-lines have the same direction; including the vertex is mathematically valid. Neither quadratic is globally monotone on R. Graph recognition loses personal graph construction but can retain shape, symmetry, vertex and interval judgments.

Coverage **pass**: Both quadratic shapes, vertices, representative points and all four half-line directions are retained. The author keeps zero in both domains and denies global monotonicity. Actual parabola plotting is explicitly omitted, while the mathematical geometry and interval distinctions remain.

### Source 751

Both domains are R excluding 0, with asymptotes x=0 and y=0 and no axis intercepts. For -6/x the negative-x branch is positive (quadrant II) and the positive-x branch negative (quadrant IV), for example (-3,2), (-1,6), (1,-6), (3,-2). On either (-infinity,0) or (0,infinity), x1 < x2 gives f(x2)-f(x1) = 6(x2-x1)/(x1*x2) > 0, so each branch increases. For 4/x, branches lie in quadrants III and I, with (-2,-2), (-1,-4), (1,4), (2,2); the difference is -4(x2-x1)/(x1*x2) < 0 on either half-line, so each branch decreases. Neither is globally increasing or decreasing on the disconnected domain. In particular -1 < 1 but (-6)/(-1)=6 > -6=(-6)/1 refutes global increase of -6/x, and 4/(-1)=-4 < 4=4/1 refutes global decrease of 4/x. Within-branch pairs refute the opposite global direction. Never join the half-lines into a single global monotonicity claim or include x=0.

Coverage **pass**: Both modern formulas, coefficient signs, points, quadrants and separate branch trends are covered; cross-zero comparisons explicitly refute global monotonicity. The independent source solution and internal solution agree on the excluded zero and coordinate-axis asymptotes. Coverage names the omitted actual drawings and visual asymptotic approach; it does not claim those were produced or substitute candidate assets.

### Source 752

One complete witness is f(x)=-x on [-5,-2), f(-2)=0, f(x)=x on (-2,4), f(4)=0, and f(x)=-x on (4,7]. The outer-piece difference is -(x2-x1)<0 and the middle-piece difference is x2-x1>0 on each specified interval. This graph includes filled points (-5,5), (-2,0), (4,0), (7,-7), and open endpoints (-2,2), (-2,-2), (4,4), (4,-4) for the three line pieces; each x in [-5,7] has exactly one value and there are no values outside that domain. The prescribed open monotonicity intervals place no condition on f(-2) or f(4) beyond their existence as real values. They do not force continuity, endpoint heights, or local extrema at the two transitions. The heights in this witness are a choice, not inferred source givens; many continuous and discontinuous graphs satisfy the source. A proposed graph with holes at -2 or 4 fails the full-domain condition. Graph recognition would lose the ability to independently invent and draw a witness.

Coverage **pass**: The complete witness preserves the entire closed domain, including values at -2,4 and the outer endpoints, and all three prescribed directions. The internal continuous witness differs from the independent discontinuous witness but both are admissible; the author explicitly states nonuniqueness, possible discontinuity and freedom of transition heights. Loss of open-ended invention and drawing is named, without converting selected heights into source requirements.

### Source 753

a) sqrt(0.16)=2/5 and sqrt(225)=15, so 3*(2/5)-(1/10)*15 = 6/5-3/2 = -3/10 = -0.3. b) sqrt(900)=30 and sqrt(1/9)=1/3, so (1/5)*30+(9/5)*(1/3) = 6+3/5 = 33/5 = 6.6. Square roots denote their nonnegative principal values, not +/- alternatives.

Coverage **pass**: Both unchanged expressions and their ordered exact results -3/10,33/5 are retained. Principal roots and coefficient arithmetic agree with the independent source freeze. The loss of producing written calculation sequences is explicitly recorded, and neither expression is silently dropped.

## Question and Option Evidence

### n34-746-orders

Fidelity **pass**: The real fig-52 remains visible and the domain stays R. Option a tests both numerical comparisons; f tests the two quantified same-sign comparisons; c states both branch intervals. These are all requested source relationships. No quadratic formula, opposite-argument equality or unlabelled height is introduced.

Redundancy **pass**: c and f express the same branch order in interval language and quantified comparison language; b and e similarly reverse it. Those two representations are explicitly requested by the written source and are retained within one coherent question, not inflated into separate repetitive questions. a additionally instantiates the order at the four supplied decimal arguments. Translation between equivalent monotonicity formulations is legitimate reasoning rather than a second independent graph task.

Leakage **pass**: The stem gives only the source graph and domain. Opposite numerical, quantified and interval claims are presented without correctness labels or misconception wording. None of the other questions states the order of this particular graph; equivalence between c and f follows from the selected definition, not from an exposed key.

Mathematics **pass**: From the inspected graph the negative branch decreases and the positive branch increases. Thus -3.6 < -2.1 gives f(-2.1) < f(-3.6), 1.3 < 2.8 gives f(1.3) < f(2.8), x1 < x2 < 0 gives f(x1) > f(x2), and 0 < x1 < x2 gives f(x1) < f(x2). The complete true set is a,c,f. Post-freeze comparison: The author's a,c,f key is identical to the frozen independent set. The internal graph reading, source task and concept blocks 8,12,14 agree with the source authority; no exact heights or symmetry are added.

Frozen complete true set: `a,c,f`.

- **a: correct.** The negative arguments satisfy -3.6 < -2.1, and the decreasing branch makes f(-2.1) smaller. The positive arguments satisfy 1.3 < 2.8, and the increasing branch makes f(1.3) smaller. Both conjuncts hold. Internal comparison: The author correctly reverses output order on the negative branch and preserves it on the positive branch; both strict inequalities match the independent graph reading. A correct option has null misconception.
- **b: incorrect.** Both directions are reversed. On x1 < x2 < 0 the actual inequality is f(x1) > f(x2); on 0 < x1 < x2 it is f(x1) < f(x2). Internal comparison: Reading each branch in decreasing-x order and transferring its rise/fall labels to increasing x reverses both quantified inequalities exactly as displayed. Both resulting claims are false on the actual graph.
- **c: correct.** The left branch falls as x increases toward zero and the right branch rises as x increases away from zero, giving decrease on (-infinity,0) and increase on (0,infinity). Internal comparison: The author's negative-decrease/positive-increase interval explanation matches the recovered source graph and selected strict definitions; the correct option has null misconception.
- **d: incorrect.** It reverses both numerical comparisons established in a: f(-2.1) < f(-3.6) and f(1.3) < f(2.8), not greater in either case. Internal comparison: The stated wrong rule smaller absolute input magnitude implies greater height gives > for both 2.1<3.6 and 1.3<2.8, reproducing this option. Both conclusions contradict the source curve; no source symmetry is asserted.
- **e: incorrect.** It assigns increase to the falling negative branch and decrease to the rising positive branch, the opposite of the inspected curve. Internal comparison: Descending-x traversal followed by unchanged rise/fall labels gives negative increase and positive decrease, exactly this false reversed interval assignment.
- **f: correct.** These are precisely the strict defining inequalities on the negative and positive branches: larger negative input gives smaller output, while larger positive input gives larger output. Internal comparison: Applying strict decrease/increase to the two ordered same-sign pairs gives the displayed > and < signs, agreeing with the independent set; the correct option has null misconception.

### n34-747-ride

Fidelity **pass**: The actual speed-time graph is retained with seconds as the time unit. The options cover all three observed phases with their genuine boundaries 0,6,14,16. The half-open/interior interval forms are valid subsets of the full phases; they neither move the boundary times nor invent a phase beyond t=16. The stem asks which time-segment descriptions are true, not for an exhaustive disjoint partition of every singleton time.

Redundancy **pass**: The six options offer opposing classifications for three different time segments. The initial rise, middle plateau and final fall must each be read; no phase supplies another phase's answer, and there are no separate repeated yes/no questions.

Leakage **pass**: The stem does not name any phase direction. Every proposed classification is an ordinary affirmative description of its segment, with no correct-set count or clue from another question. The shared graph is necessary source data, not an answer annotation.

Mathematics **pass**: The trace rises from (0,0) to (6,5), is horizontal from (6,5) to (14,5), then falls to (16,0). Therefore the offered initial interval [0,6) increases, (6,14) is constant and (14,16] decreases. The complete true set is b,d,e. Post-freeze comparison: The author's b,d,e key matches the independent freeze and all graph boundaries. The internal statement about endpoint conventions does not assert that closed plateau endpoints are impossible.

Frozen complete true set: `b,d,e`.

- **a: incorrect.** For any t1 < t2 within (6,14), v(t1)=v(t2)=5, so the plateau is not strictly increasing. Internal comparison: The positive-height-as-positive-slope error applies to the horizontal v=5 segment and yields the asserted increase, although its actual speed difference is zero.
- **b: correct.** The final trace falls strictly from the plateau toward v=0 at t=16; hence it decreases throughout (14,16]. Internal comparison: The author correctly reads the falling final segment in forward time through the included endpoint t=16; its decrease agrees with the independent reading. Misconception is null.
- **c: incorrect.** The first phase rises from v=0 toward v=5 as time moves from 0 to 6, so [0,6) is increasing, not decreasing. Internal comparison: Traversing the first segment from t=6 toward t=0 makes its height fall; assigning that traversal to forward time produces exactly the displayed false decrease.
- **d: correct.** The first phase has increasing height for increasing t on [0,6); the included origin and excluded upper endpoint do not change that strict order. Internal comparison: The author's increasing-time reading of the initial rising trace agrees with the independent result on [0,6). Misconception is null.
- **e: correct.** Every time in (6,14) has speed 5 m/s on the horizontal trace, so the speed is constant there. Internal comparison: The author correctly identifies the middle horizontal v=5 trace as constant on (6,14), matching the independently solved interval. Misconception is null.
- **f: incorrect.** The final phase contains distinct speeds, for example positive speed before t=16 and v(16)=0; it cannot be constant on (14,16]. Internal comparison: Assigning the final speed v(16)=0 to every preceding point on the falling phase makes a false horizontal zero-speed segment and reproduces the asserted constancy.

### n34-748-lines

Fidelity **pass**: The two original formulas are unchanged. Each candidate gives two determining points and states extension in both directions, so the learner judges graph location and monotonicity for both complete straight lines. Recognition does not demonstrate personal plotting; that production loss must be accounted for in the internal coverage record.

Redundancy **pass**: Each option is one coherent pair of graph descriptions, not isolated arithmetic clicks. The four pairs differ by intercept signs, slope signs, correct coefficients, or slope/intercept exchange; none is equivalent to another.

Leakage **pass**: All alternatives use the same two-point-and-direction form. The stem supplies the source equations but no point values. The separate classification question contains different functions and does not disclose these intercepts or sampled values.

Mathematics **pass**: At x=0 and x=1, 17x-2 gives -2 and 15, with positive slope 17; -2.8x+1 gives 1 and -1.8, with negative slope -2.8. Only c gives both lines and both directions correctly. Post-freeze comparison: The author's unique c key matches the independent point substitutions and direction checks. Each alternative's wrong formulas reproduce all its stated points and classifications.

Frozen complete true set: `c`.

- **a: incorrect.** The listed pairs describe 17x+2 and -2.8x-1. They have the right direction signs but wrong source intercepts: actual f(0)=-2 and h(0)=1, not 2 and -1. Internal comparison: Negating the intercepts yields 17x+2 and -2.8x-1, hence (0,2),(1,19) and (0,-1),(1,-3.8), with the displayed directions. This exactly reproduces the option but changes both source lines.
- **b: incorrect.** The pairs describe -17x-2 and 2.8x+1. They reverse both source slopes and thus both monotonicity judgments; actual values at x=1 are 15 and -1.8, not -19 and 3.8. Internal comparison: Negating the x-coefficients yields -17x-2 and 2.8x+1, hence (0,-2),(1,-19) and (0,1),(1,3.8) and reversed directions. The procedure and false option match.
- **c: correct.** 17*0-2=-2, 17*1-2=15, and slope 17>0. -2.8*0+1=1, -2.8*1+1=-1.8, and slope -2.8<0. All four point values and both directions agree. Internal comparison: All four point values and signs of the source slopes match independent substitution. The stated correct derivation has null misconception.
- **d: incorrect.** The pairs instead determine -2x+17 and x-2.8, obtained by exchanging the slope and intercept roles. Their x=0 values 17 and -2.8 contradict the source values -2 and 1. Internal comparison: Swapping slope and intercept yields -2x+17 and x-2.8, producing exactly the stated four point values and decrease/increase directions. It is not an arbitrary nearby-coordinate distractor.

### n34-749-classification

Fidelity **pass**: All six original expressions occur in each complete classification, and the visible strict definition matches selected blocks 12,14,28. The constant function must be separated from both monotone categories. No function or sign is dropped.

Redundancy **pass**: The response unit is a complete six-function classification. The alternatives distinguish actual slope signs, absolute slope signs, intercept-based classification and non-strict treatment of the constant. They are different mathematical partitions or assertions, not repeated cell questions.

Leakage **pass**: The strict definition is necessary semantic data and supplies no classification of a named expression. All options use the same category headings. There is no source-number mapping, rationale wording or answer in a different question for these six functions.

Mathematics **pass**: The signs of the six slopes are positive, positive, negative, negative, negative, zero. Hence only b has the complete strict classification; the intercept does not influence any direction. Post-freeze comparison: The author's b key matches the complete frozen six-function classification. Its mistaken procedures reproduce the complete alternative groups, including the constant-function behavior.

Frozen complete true set: `b`.

- **a: incorrect.** The slopes -3,-49,-1/12 are negative, so their functions decrease rather than increase. For example -3*1+10=7<10=-3*0+10. Internal comparison: Replacing every slope k by |k| produces five positive nonzero slopes and one zero slope, exactly the asserted all-nonconstant-increasing classification. Negative source slopes make that grouping false.
- **b: correct.** 8 and 0.01 are positive slopes; -3,-49,-1/12 are negative slopes; 0x+5 has zero difference for every input pair and is neither strictly increasing nor decreasing. Internal comparison: The author uses k(x2-x1), with positive slopes 8,0.01, negative slopes -3,-49,-1/12 and zero slope for 5. This matches every independent classification; misconception is null.
- **c: incorrect.** It follows intercept signs instead of slopes: -3x+10 and -49x+1000 decrease despite positive intercepts; 8x-5 increases despite its negative intercept; the two zero-intercept nonconstant functions are monotone; 5 is constant. Internal comparison: Classifying by intercept l gives positive 10,1000,5 as increasing, negative -5 as decreasing and zero intercepts as neither, reproducing the option's groups. It is demonstrably wrong for the original slopes.
- **d: incorrect.** For x1<x2, (0x2+5)-(0x1+5)=0, neither >0 nor <0. Listing the constant as both strictly increasing and strictly decreasing violates the visible definition. Internal comparison: Changing both strict inequalities to non-strict inequalities leaves the five nonzero-slope directions and puts the constant in both classes, exactly the displayed false classification under the supplied strict definitions.

### n34-750-parabolas

Fidelity **pass**: Both source quadratic formulas remain visible, with complete paired descriptions of shape, vertex, representative point and direction on each input half-line. Personal drawing is replaced by recognition and must be recorded as a production loss; the graph relationships and all four half-line directions remain.

Redundancy **pass**: One option must simultaneously describe both parabolas. The alternatives differ by replacing the curve with a line, reversing the sign, vertically translating the vertex, or preserving the original formulas. None repeats the same paired graph.

Leakage **pass**: The paired options have comparable shape/location/direction detail. The fig-52 question concerns an unformulated curve and does not identify either quadratic's equation, vertex height or sampled values; it cannot serve as a displayed answer to this item.

Mathematics **pass**: x^2 has vertex (0,0), contains (1,1), opens upward and decreases for negative inputs while increasing for positive inputs. -x^2 reflects it in the horizontal axis and reverses these directions, with point (1,-1). Only d has the full pair. Post-freeze comparison: The author's d key and source geometry agree with the independently frozen quadratic solution. Each wrong procedure accounts for all location and direction claims of its alternative.

Frozen complete true set: `d`.

- **a: incorrect.** Two sampled points do not make either quadratic a straight line. At x=2 the values are 4 and -4, whereas the claimed lines through (0,0),(1,+/-1) would give 2 and -2. The negative-half-line directions are also reversed. Internal comparison: Deleting exponent 2 gives y=x and y=-x, reproducing the claimed straight lines, sampled points and both-half-line monotonicities. The source quadratics disagree at x=-1 and x=2.
- **b: incorrect.** It swaps the two signs: x^2(1)=1, not -1, and -x^2(1)=-1, not 1. The stated opening directions and half-line monotonicities therefore belong to the opposite source formulas. Internal comparison: Interchanging x^2 and -x^2 reproduces both stated opening directions, points and half-line trends. This assigns every claim to the wrong source formula.
- **c: incorrect.** The proposed curves are x^2+1 and -x^2-1. Both source functions have value 0 at x=0 and values 1,-1 at x=1, not vertices +/-1 and values +/-2. Internal comparison: Using x^2+1 as the base graph and reflecting it gives -x^2-1, reproducing the shifted vertices and sampled points while leaving the branch trends. Source values at x=0 refute both positions.
- **d: correct.** The stated vertices, sampled points and opening directions match substitution. (x2-x1)(x2+x1) is negative for x1<x2<0 and positive for 0<x1<x2, and negating it reverses those directions for -x^2. Internal comparison: The independent vertices, points and factorized output differences all agree with the author's correct derivation. Misconception is null.

### n34-751-reciprocals

Fidelity **pass**: The modern formulas -6/x and 4/x are unchanged. Correct graph descriptions retain points, quadrants, hyperbola shape and separate branch monotonicity. The global-domain claims specifically test the selected definition's quantifier across zero. Personal graph construction is not demonstrated and must be recorded; branchwise and whole-domain order are not conflated.

Redundancy **pass**: a/b and d/e distinguish coefficient signs for two different reciprocal functions, while c/f test whether branchwise monotonicity extends to their disconnected domains. A correct branch claim does not settle a cross-zero comparison, so the global alternatives add a distinct essential judgment.

Leakage **pass**: No option labels its own procedure as a misconception. The global claims have the same affirmative tone as the branch claims. Neither the linear nor quadratic questions supplies a reciprocal-domain counterexample or tells the learner which global claims fail.

Mathematics **pass**: For either same-sign interval, g(x2)-g(x1)=6(x2-x1)/(x1*x2)>0 and h(x2)-h(x1)=-4(x2-x1)/(x1*x2)<0. g lies in II/IV and passes (-2,3),(2,-3); h lies in III/I and passes (-2,-2),(2,2). Cross-zero comparisons refute both stated global directions. The complete true set is b,e. Post-freeze comparison: The author's b,e key matches the independently frozen set. Same-branch denominator sign restrictions are retained for true claims and their improper removal explains both false global claims.

Frozen complete true set: `b,e`.

- **a: incorrect.** g(-2)=3 and g(2)=-3, not -3 and 3. Its branches are in II/IV and increase on each half-line, so all the coefficient-sign-dependent claims are reversed. Internal comparison: Dropping the numerator minus changes g to 6/x, which has exactly the stated points, III/I quadrants and separately decreasing branches. The actual -6/x has the opposite signs and trends.
- **b: correct.** Substitution gives g(-2)=3 and g(2)=-3. Negative inputs give positive outputs and positive inputs negative outputs; the exact same-sign difference 6(x2-x1)/(x1*x2) is positive. Internal comparison: Substitution and the same-sign positive difference 6(x2-x1)/(x1*x2) match the independent correct graph and branch order. Misconception is null.
- **c: incorrect.** -1<1 but h(-1)=-4<4=h(1), contradicting the > inequality required for strict decrease on the entire domain. Separate decreasing branches are not a globally decreasing function. Internal comparison: Promoting a decreasing-branch proof to the union without the requirement x1*x2>0 yields the claimed global decrease. The frozen counterexample -1<1 but -4<4 falsifies that extension.
- **d: incorrect.** h(-2)=-2 and h(2)=2, not 2 and -2. Its branches lie in III/I and decrease separately; the option instead describes -4/x. Internal comparison: Inserting a minus changes h to -4/x, producing the displayed II/IV points and increasing branches exactly. The actual 4/x contradicts every sign-dependent part.
- **e: correct.** h(-2)=-2 and h(2)=2; its input and output signs agree. For a same-sign pair x1<x2, -4(x2-x1)/(x1*x2)<0 gives strict decrease on each branch. Internal comparison: Substitution gives the stated III/I points and the same-sign negative difference gives separate decrease, in agreement with the independent solution. Misconception is null.
- **f: incorrect.** -1<1 but g(-1)=6>-6=g(1), contradicting the < inequality required for increase on the entire disconnected domain. The branchwise increasing conclusion does not extend across zero. Internal comparison: Dropping the positive-product condition from the same-branch increasing proof produces the asserted global increase; -1<1 but 6>-6 is the independent counterexample.

### n34-752-construction

Fidelity **pass**: The full domain [-5,7] and all three original monotonicity intervals remain visible. The wording asks which particular connected-point construction is a witness, not which heights or continuity are required for every source solution. The connecting segments include values at -2 and 4. Personal invention and drawing of an arbitrary witness are lost, but recognizing one valid witness still requires checking all slopes and the full domain.

Redundancy **pass**: The four constructions distinguish the valid sign sequence (-,+,-), its reversal (+,-,+), loss of the middle increase (-,-,-), and omission of the right domain endpoint. a and d share coordinates but differ in domain membership at x=7, so they are not equivalent functions.

Leakage **pass**: Every option supplies four coordinates and a domain/end-extension declaration. No option calls itself a valid example or names its mistake. Shared coordinates in a and d still require both a slope check and a right-endpoint membership check; wording does not disclose a complete key.

Mathematics **pass**: For a the successive slopes are (0-3)/3=-1, (6-0)/6=1, (3-6)/3=-1, and the connected graph has exactly domain [-5,7] with defined values at -2,4 and both outer endpoints. This is one allowed continuous witness, not a condition imposed by the source. Only a is true. Post-freeze comparison: The author's a key agrees with the independent witness verification. Its continuous construction is admissible even though the independent source witness is discontinuous; neither continuity nor its selected heights is imposed as a universal source condition.

Frozen complete true set: `a`.

- **a: correct.** The three segment slopes are -1,+1,-1 on the required intervals. All four vertices belong to a single-valued graph and both -5 and 7 are included without extension, giving exactly [-5,7]. Internal comparison: The author computes slopes -1,+1,-1 and explicitly checks the complete closed domain and unique transition values. These agree with the independent option verification; misconception is null.
- **b: incorrect.** The slopes are (3-0)/3=+1, (-3-3)/6=-1, (0+3)/3=+1, reversing every required direction despite the correct outer domain. Internal comparison: Swapping increase/decrease and choosing the stated heights produces slopes +1,-1,+1 exactly, so the false option follows from the given wrong procedure.
- **c: incorrect.** The middle slope is (-6-0)/6=-1, so the graph decreases rather than increases on (-2,4). The three slopes are all -1. Internal comparison: Continuing the initial slope -1 across the whole domain gives x+5 horizontal steps 0,3,9,12 and heights 3,0,-6,-9, precisely the displayed points. It removes the required middle increase.
- **d: incorrect.** The slopes match a but the option explicitly excludes x=7, leaving domain [-5,7) rather than the source's closed domain [-5,7]. A limiting endpoint coordinate does not restore the excluded function value. Internal comparison: Changing only the right domain bracket deletes f(7) while keeping the correct slopes. The source requires x=7 in both the full domain and final interval, so the stated endpoint error reproduces and falsifies the option.

### n34-753-radicals

Fidelity **pass**: Both original radical expressions, decimal coefficients, subtraction/addition signs and fraction 1/9 are unchanged. The ordered pair preserves which result belongs to each expression. The unit is the complete pair of evaluations, not independent digit or radical-value clicks.

Redundancy **pass**: The four ordered pairs are distinct and no two are numerically equivalent. The two expressions must both be evaluated to verify the complete selected pair; no other question uses these values.

Leakage **pass**: All options contain two signed decimal numbers in the same notation, without intermediate computations or named mistakes. No other item states either radical evaluation, and the stem contains only the original data.

Mathematics **pass**: Principal roots are sqrt(0.16)=2/5, sqrt(225)=15, sqrt(900)=30 and sqrt(1/9)=1/3. A=6/5-3/2=-3/10 and B=6+3/5=33/5, so only c is true. Post-freeze comparison: The author's c key agrees with the exact frozen pair -3/10,33/5. All three incorrect pairs are exactly generated by their described reproducible procedures, rather than nearby guesses.

Frozen complete true set: `c`.

- **a: incorrect.** Leaving every radicand unchanged in place of its root yields 3*0.16-0.1*225=-22.02 and 0.2*900+1.8*(1/9)=180.2. Actual principal-root evaluation yields -0.3 and 6.6 instead. Internal comparison: Replacing every root by its radicand yields 0.48-22.5=-22.02 and 180+0.2=180.2, reproducing both displayed numbers and violating the source radical operations.
- **b: incorrect.** Using -0.4 for the first root in A and -30 for the first root in B, while retaining the other roots, gives -1.2-1.5=-2.7 and -6+0.6=-5.4. These negative root choices violate principal-root notation. Internal comparison: Choosing the negative root only for the leading radical in each expression gives -1.2-1.5=-2.7 and -6+0.6=-5.4. The specific sign-choice procedure reproduces both values and is invalid for principal roots.
- **c: correct.** 3*(2/5)-(1/10)*15=-3/10=-0.3 and (1/5)*30+(9/5)*(1/3)=33/5=6.6, in the stated order. Internal comparison: The author's principal roots 0.4,15,30,1/3 and subsequent arithmetic give precisely -0.3,6.6, agreeing with the independent exact results. Misconception is null.
- **d: incorrect.** Removing decimal points from the multiplicative coefficients 0.1,0.2,1.8 gives 3*0.4-1*15=-13.8 and 2*30+18*(1/3)=66. The original coefficients instead yield -0.3 and 6.6. Internal comparison: Deleting decimal points in coefficients 0.1,0.2,1.8 gives 1,2,18 and therefore 1.2-15=-13.8 and 60+6=66, reproducing both displayed numbers. The original decimal coefficients do not permit those results.

## Package Findings

The live draft has exactly eight questions, each mapped to one of the eight selected sources, with all 38 visible alternatives independently checked before internal exposure. Every source has substantive coverage and declared production losses. No source depends on another question's answer. new_figures is empty: the only used assets are the two hash-bound source SVGs already inspected through full normal-width previews. No new-figure approval is required or implied.

No actionable fidelity, leakage, coverage, key or misconception defect was found.
Construction/recognition and independent-writing losses are explicitly recorded.
No new figures are registered, so no new-figure approval is claimed or required.

## Validation

The named validator with `--review` is run once after this semantic record.
Its exact command, stdout, stderr and exit code are preserved in
`first-validation.json`; those mechanical results do not automatically prove
the semantic findings. The FIRST verdict is not changed to match tool output.

