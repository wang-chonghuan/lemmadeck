# STEMROBIN-184 / closed10c / ana10-c6-s3-n85

## Author Boundary

- Role: SOURCE MATH AUTHOR ONLY. Frozen author package, not a review, approval, publication artifact, answer key, or release gate.
- Invocation: active STEMROBIN-184, samecwd, sameinvocation; workspace `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
- Scope: all 65 source lesson prose objects, original tasks 119-146 (28), and six original source media. All mathematics below is newly derived from those sources, not from old answers, choices, modern editions, tests, reviewers, or previous ticket mathematics gates.
- Only this file and `ana10-n85-math-author.manifest.json` are authored. No optional derived-answer precursor is needed.
- No source, durable content, modern content, figure, code, app, tool, dependency, Git, index, DB, or chat changes. No tests, rendering, pipeline commands, OCR, additional models, browser, freshness, re-init, grill, or ticket-state operation.
- Independent Stage A status is UNKNOWN and was not inspected. Do not disclose the mathematical body to the parent before independent Stage A freezes. The final response carries only package paths and SHA256 values.
- Original PNG batch: six images, each opened exactly once before deriving mathematics; no crops, reopens, or additional images. Batch/context loads = 6/6, below 8/24.
- All identities use real variables; unmarked angles are radians. Degree marks retain degree semantics. Integer parameters below belong to Z.
- The source encodings `T` versus tau at p0043#3 and final `a` versus `q` at p0046#7 remain optical UNKNOWN. Mathematical context must not resolve the glyphs.
- Property 6 retains its literal qualifier `x in Z`; it is NOT converted to `n in Z`.
- p0046#7 is locally closed; p0047#1 is separately preserved prose despite its source `cont` flag. No marker, counter, assembler, or boundary change is made here.

## Source Binding

Paths in this section are relative to the workspace named above. SHA256 binds complete file bytes; source refs use one-based original `page.json` block positions. Prose ordinals refer to the frozen `lesson.json` array, not visual line numbers.

| Input | SHA256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/book.json` | `06983b7e6b58e7b587412e1fcac994da249d8b4a3fc89ed7fbe370221537a3b5` |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/lessons/ana10-c6-s3-n85/lesson.json` | `72d959ff173df0af16d52018483553fe86c0b8302e1ca8af3186d248dc8bb25d` |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/lessons/ana10-c6-s3-n85/lesson.md` | `01885da125560270d447fbb98415822693cd48a02ad4a886d0fe3e3748f80d8f` |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/lessons/ana10-c6-s3-n85/exercises.json` | `48d001eed7586b09b522a6d882d5014e8ecd831c664cfc44425b93c21e71e9bb` |

The human-supplied book hash is the book.json hash, not the PDF hash. Original page metadata and the source manifest declare PDF SHA256 `47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40` for `10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf`. This is a declared provenance value; no PDF was opened, re-rendered, or independently rehashed in this role.

All source page bindings are to original files below `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/`:

| File | SHA256 |
| --- | --- |
| `0042/page.json` | `fd6cb4428a9c17614402475f1c2c9ed2668c7a516cc5809f6de89894c655f4f5` |
| `0043/page.json` | `d1d1f05b8c7e5f6a7e329008c27027cd565e55c889d27527d9fcc1a464b9dcf5` |
| `0044/page.json` | `5b48fb7e21ef53d99bc2650230e9c03afcb7c8166be0df4745dfa47463449fb8` |
| `0045/page.json` | `71023115699a9053ca7cba5160e4fca962da8aea0b0f02fa2da52c3f17fbdeff` |
| `0046/page.json` | `fc2f8d9fd484a1bb47e54a73d9750c92603f91411a7e53af8319220c010d8214` |
| `0047/page.json` | `6a756a0e797c997b6aa39cf646feaf5b84210cccd6be5e478c7372c80dcddcbf` |
| `0048/page.json` | `fb13611816d968f20daec23f6676c95d024f157c677e520055261f73ef87adb8` |
| `0049/page.json` | `c8daca0b911b3bd1aa93fd8c34220480e68ad2aa0f97b86a9c793050567c0e00` |
| `0050/page.json` | `a90b024245b3d99895eaf738d5a185dc7e3293495f9582c43e2e3e45868032c7` |
| `0051/page.json` | `7c1165646bce4b3c611aa5afff2302545aea8cf896ec85da044f003b96ee4df7` |

No previous exercise or answer was displayed or consulted. Original source page text was restricted to this lesson and its source block explanations; previous prose was not needed for definitions. Metadata-only book inspection did not expose other lessons, exercises, or audit judgments.

## Mathematical Basis

### B1. Sine, Signs, and Monotonicity

On the unit circle C = {(u,v): u^2+v^2=1}, the point corresponding to angle t has coordinates P_t=(cos t,sin t). The exercise group supplies the unit-circle/sine relationship; the ordered-pair notation here is an author definition, not a claim to have reread a previous source definition.

Reflection in the horizontal axis gives sin(-t)=-sin t. A full revolution gives sin(t+2*pi*n)=sin t. From the unit-circle coordinates, -1 <= sin t <= 1, with every intermediate ordinate attained, so D(sin)=R and E(sin)=[-1,1].

Using the standard radian limits sin h/h -> 1 and (cos h-1)/h -> 0,

    [sin(x+h)-sin x]/h
      = sin x*(cos h-1)/h + cos x*(sin h/h) -> cos x.

Thus (sin x)'=cos x everywhere and sine is continuous. In [-pi,pi], the only stationary points are -pi/2 and pi/2. Cosine is negative on (-pi,-pi/2), positive on (-pi/2,pi/2), and negative on (pi/2,pi). By the mean value theorem sine strictly decreases, increases, decreases on the corresponding CLOSED intervals, with values 0,-1,1,0 at -pi,-pi/2,pi/2,pi. Derivative values at the outer endpoints are -1, not 0.

For integer n, sine is positive on (2*pi*n,pi+2*pi*n), negative on (pi+2*pi*n,2*pi+2*pi*n), and zero exactly at pi*n. The sign assertions exclude their endpoints.

If T>0 is any period, evaluating sin(x+T)=sin x at x=0 gives sin T=0, so T=m*pi. At x=pi/2 it gives cos T=1, hence m is even. Therefore all positive periods are 2*pi*m with positive integer m, and the least is 2*pi. This T is an author proof variable, not an optical resolution of p0043#3.

### B2. Principal Inverse

Sine is continuous and strictly increasing from -1 to 1 on the closed interval J=[-pi/2,pi/2]. It is therefore a bijection J -> [-1,1]. Its inverse arcsin has domain [-1,1], range J, and both endpoints included. Every arcsin value below is the UNIQUE angle in J with the specified sine, not an arbitrary solution of a sine equation.

If y=arcsin u, then sin y=u. Oddness and uniqueness give arcsin(-u)=-arcsin u. Strict increase of the original bijection gives strict increase of the inverse. Swapping coordinates maps (y,u) on the restricted sine graph to (u,y) on the inverse graph, so the two graphs reflect in y=x.

In particular:

    arcsin(-1)=-pi/2; arcsin(-sqrt(3)/2)=-pi/3;
    arcsin(-sqrt(2)/2)=-pi/4; arcsin(-1/2)=-pi/6;
    arcsin 0=0;
    arcsin(1/2)=pi/6; arcsin(sqrt(2)/2)=pi/4;
    arcsin(sqrt(3)/2)=pi/3; arcsin 1=pi/2.

This follows from the 30/60/90 and 45/45/90 triangle ratios and quadrant signs, together with membership in J. For |u|>1 the real arcsin is undefined. No unqualified identity arcsin(sin x)=x is used outside J.

### B3. Exact Complete Equation Families

For a real parameter a:

- |a|>1: sin x=a has no real solution.
- |a|<=1: let alpha=arcsin a in J. All solutions are

      x=alpha+2*pi*n OR x=pi-alpha+2*pi*n, n in Z,
      equivalently x=(-1)^k*alpha+pi*k, k in Z.

To prove completeness, first choose [-pi/2,3*pi/2]. On J the unique root is alpha. On [pi/2,3*pi/2], pi-x belongs to J because subtracting the bounds from pi reverses their order and gives [-pi/2,pi/2]. Also sin(pi-x)=sin x, so the unique root there is pi-alpha. Translate these representatives by whole periods. Conversely every displayed root has sine a. This proves necessity and sufficiency, not only substitution.

The two families are disjoint for |a|<1: equality would imply 2*alpha=pi+2*pi*m, possible in [-pi,pi] only at alpha=pi/2 or -pi/2. At a=1 both families are the SAME set pi/2+2*pi*Z. At a=-1 both are the SAME set -pi/2+2*pi*Z, since 3*pi/2+2*pi*Z equals that set. At a=0 their union is pi*Z. A closed interval of length 2*pi may repeat an endpoint root, which does not add a new solution.

For b != 0 the general affine equation sin(b*x+c)=a has domain R and the complete solution families

    x=(alpha-c+2*pi*n)/b OR x=(pi-alpha-c+2*pi*n)/b.

The inverse affine map is bijective, so dividing does not lose roots. If b=0, every x is a solution when sin c=a, and otherwise there is no solution. These edge cases are author mathematics, not additional source tasks.

### B4. Numerical Worked Examples

The degree/radian conversion is y=alpha*pi/180, where alpha is the numeric degree measure. The expressions "alpha degrees = y radians" identify the SAME angle, not equality of bare numeric degree and radian measures.

For exact input 0.9063, a direct scalar evaluation gives

    sin 65 degrees = 0.9063077870366499,
    65*pi/180 = 1.1344640137963142,
    arcsin 0.9063 = 1.1344455884618865.

Thus the source's tabular approximation 1.1345 is close, with absolute error about 0.0000544115381 radians. However the correctly rounded exact-input value to four decimal places is 1.1344. Rounding the degree lookup to 65 degrees before conversion explains the source value; this is not evidence that exact arcsin(0.9063) rounds to 1.1345. The source uses approximation signs, so record a precision limitation, not an invented exact equality or an automatically authorized erratum.

For exact input 0.932:

    arcsin 0.932 = 1.1998921492746244,
    sin 1.2 = 0.9320390859672263.

Hence 1.2 is a valid coarse approximation (error about 0.0001078507254 radians). The exact general solution retains alpha=arcsin(0.932); replacing alpha by 1.2 produces approximate roots only.

These are read-only arithmetic calculations, not tests, model calls, source-table consultation, or validators. They assess mathematical precision, not optical fidelity or table provenance.

## All 65 Body Objects

The following is a complete one-row-per-object inventory. "Consistent" means the author's derivation agrees with the stated mathematics under its stated context; it is NOT reviewer PASS.

| Ordinal | Kind / Source Refs | Body / Formula Assessment |
| --- | --- | --- |
| 1 | p / p0042#9 | Discuss sin on CLOSED [-pi,pi]; consistent with B1 and fig-24. Endpoints included. |
| 2 | p / p0042#10 | Source `sin'x=cos x` denotes (sin x)'=cos x; B1 derives it in radians. Not sin(x') or derivative of an inverse. |
| 3 | p / p0042#11,p0043#1 | Only stationary points in [-pi,pi] are +/-pi/2; B1. Split `x` and `=pi/2` remains one mathematical assertion. |
| 4 | fig / p0043#2 | tbl-p0043-01; exact three-row/eight-column inventory below, including derivative endpoint -1 and attached extrema boxes. |
| 5 | p / p0043#3 | Translation (2*pi*n,0) maps the restricted graph to [-pi+2*pi*n,pi+2*pi*n]; integer n and B1 justify it. Source vector-name T/tau optical UNKNOWN, not needed for the displacement mathematics. |
| 6 | fig / p0043#4 | fig-24; source closed-domain sine segment, roots and extrema consistent with B1. |
| 7 | cap / p0043#5 | Caption "figure 24"; no independent formula. |
| 8 | fig / p0043#6 | fig-25; periodic sine illustration, all marked roots and extrema inventoried below. No exact finite endpoint inferred from canvas edges. |
| 9 | cap / p0043#7 | Caption "figure 25"; no independent formula. |
| 10 | p / p0043#8,p0044#1 | Restricted sine bijection, arcsin domain/range, reflection in y=x, oddness and increase all derived in B2. Both endpoint brackets closed. |
| 11 | p / p0044#2 | Introduces inverse-value calculations; no extra formula. |
| 12 | p / p0044#3 | arcsin(sqrt(2)/2)=pi/4, sine value and principal interval membership consistent by B2. |
| 13 | fig / p0044#4 | fig-26; inverse graph through (-1,-pi/2),(0,0),(1,pi/2), dashed coordinate projections; B2. |
| 14 | cap / p0044#5 | Caption "figure 26"; no independent formula. |
| 15 | p / p0044#6 | arcsin(-1/2)=-pi/6 and interval membership are correct; source supporting equality sin(-pi/6)=+1/2 is FALSE. D1 diagnoses the sign without editing it. |
| 16 | p / p0044#7 | arcsin 1=pi/2; sin(pi/2)=1 and principal endpoint membership consistent. |
| 17 | p / p0044#8 | arcsin(-1)=-pi/2; sin(-pi/2)=-1 and principal endpoint membership consistent. |
| 18 | p / p0045#1 | Sine-table inversion in principal range and degree-to-radian conversion mathematically valid. Claimed decimal accuracy depends on lookup precision; B4 records the limitation. Actual historical tables were not read. |
| 19 | p / p0045#2 | Principal degree interval [-90,90], closed; meaningful for input x in [-1,1], not for arbitrary real input. |
| 20 | p / p0045#3 | sin(alpha degrees)=x; context restricts alpha and x as in 19/B2. |
| 21 | p / p0045#4 | Same angle in radians y=alpha*pi/180; unit-aware interpretation in B4. |
| 22 | p / p0045#5 | sin y=x and arcsin x=y follow when y in J. The principal restriction is inherited, not omitted. |
| 23 | p / p0045#6 | Example 1 requests arcsin 0.9063; valid real inverse input. |
| 24 | p / p0045#7 | Approximate sine of 65 degrees and conversion are close. Source 1.1345 is a tabular estimate, not correctly rounded exact input at four decimals; B4/D4. |
| 25 | p / p0045#8 | Introduces inverse-based equation solving; no extra formula. |
| 26 | p / p0045#9 | Equation (1): sin x=a, real x and real a; B3 exhausts domain and parameter cases. |
| 27 | p / p0045#10 | Describes this elementary equation form; no extra formula. |
| 28 | p / p0045#11 | Range bound and no roots for a>1 or a<-1; "and" lists two separate parameter cases, not simultaneous conditions. Fig-27/B3. |
| 29 | p / p0045#12 | Case a=1; all roots determined by upper ordinate of unit circle. |
| 30 | p / p0045#13 | pi/2+2*k*pi with integer k is complete, by B3. |
| 31 | fig / p0046#1 | fig-27; bounded wave and external levels above 1 and below -1, all labels/projections inventoried. |
| 32 | cap / p0046#2 | Caption "figure 27"; no independent formula. |
| 33 | fig / p0046#3 | fig-28; two roots per period for interior a and dashed projections. Rightmost crest-label concern D3 is not silently corrected. |
| 34 | cap / p0046#4 | Caption "figure 28"; no independent formula. |
| 35 | p / p0046#5 | Case a=-1. |
| 36 | p / p0046#6 | -pi/2+2*k*pi with integer k is complete, by B3. |
| 37 | p / p0046#7 | For |a|<1, each of the two stated CLOSED half-period intervals has exactly one root. B3 proves all claims for those intervals. The final stored `a` in arcsin a is optical a/q UNKNOWN; conditional semantics only. "Any interval of length 2*pi" requires representative-covering endpoint convention; D5. Source paragraph remains separately closed. |
| 38 | p / p0047#1 | sin x=sin(pi-x); bound reversal puts pi-x in J. Therefore second-half root pi-arcsin a; full explanation in B3. Source cont is already separately preserved, no source mutation. |
| 39 | p / p0047#2 | Add full periods to both representatives; complete two infinite subsets, by B3. |
| 40 | p / p0047#3 | (2) alpha+pi*2m and (3) -alpha+pi*(2m+1) are B3's two families. `pi2m` is multiplication in the written order, not pi raised to 2m. |
| 41 | p / p0047#4 | Introduces combined family; no extra formula. |
| 42 | p / p0047#5 | (4) (-1)^k*arcsin a+pi*k, integer k; exact for |a|<=1, undefined as real inverse for |a|>1. |
| 43 | p / p0047#6 | k=2m gives (2), k=2m+1 gives (3). Direct parity proof in B3. |
| 44 | p / p0047#7 | At EACH parameter endpoint a=1 and a=-1, the two branch sets agree. Does not mean the a=1 and a=-1 root sets agree with each other. B3 proves both endpoint collapses. |
| 45 | p / p0048#1 | Example 2 sin x=sqrt(2)/2; valid and fully solved below/task 142. |
| 46 | p / p0048#2 | (-1)^k*pi/4+pi*k, integer k; exact by B2/B3. Two branches pi/4+2*pi*n and 3*pi/4+2*pi*n. |
| 47 | p / p0048#3 | Example 3 sin x=1; valid. |
| 48 | p / p0048#4 | (-1)^k*pi/2+pi*k follows from arcsin 1=pi/2, integer k inherited; consistent. |
| 49 | p / p0048#5 | Both parity branches reduce to pi/2+2*pi*m. Calculation is exact, duplicates removed as sets. |
| 50 | p / p0048#6,p0049#1 | Example 4 sin x=0; arcsin 0=0 and x=pi*k, integer k, complete. Original cross-page object remains bound to both refs. |
| 51 | p / p0049#2 | Example 5 sin x=0.932; valid real range input. |
| 52 | p / p0049#3 | Exact family (-1)^k*arcsin(0.932)+pi*k. Source inverse approximation 1.2 is coarse and consistent as approximate, B4; table attribution not independently investigated. |
| 53 | p / p0049#4 | Introduces twelve numbered properties; these are prose, not tasks. |
| 54 | p / p0049#5 | Property 1: D(sin)=R, B1. |
| 55 | p / p0049#6 | Property 2: E(sin)=[-1,1], boundedness and attained endpoints, B1. |
| 56 | p / p0049#7 | Property 3: oddness for every real x, B1. |
| 57 | p / p0049#8 | Property 4: periodicity and LEAST positive period 2*pi; minimality proof in B1, not only demonstration of a period. |
| 58 | p / p0049#9 | Property 5: x=pi*n, integer n, gives sin x=0; also exact zero set by B1/B3. |
| 59 | p / p0049#10 | Property 6 LITERAL `(x in Z)` retained. The unbound interval parameter n prevents an unconditional all-real sign theorem. D2 separates a contextual integer-n reading from a false unrestricted-n reading. No source qualifier repair. |
| 60 | p / p0049#11 | Property 7: negative on (pi+2*pi*n,2*pi+2*pi*n), integer n; consistent. Endpoints are zero, excluded. |
| 61 | p / p0049#12 | Property 8: continuity and differentiability everywhere, B1. |
| 62 | p / p0049#13,p0050#1 | Property 9: strictly increasing from -1 to 1 on CLOSED [-pi/2+2*pi*n,pi/2+2*pi*n], integer n; B1. |
| 63 | p / p0050#2 | Property 10: strictly decreasing from 1 to -1 on CLOSED [pi/2+2*pi*n,3*pi/2+2*pi*n], integer n; B1. |
| 64 | p / p0050#3 | Property 11: minima -1 at 3*pi/2+2*pi*n; same set as -pi/2+2*pi*n after integer reindexing. |
| 65 | p / p0050#4 | Property 12: maxima 1 at pi/2+2*pi*n, integer n; B1. |

## All 28 Requests and Author Solutions

Every request has exactly one original exercise object, one printed number, and one mathematical request. The g3 instruction is to DRAW THE POINT SET, not merely give angle solutions: coordinates, arc membership, and inclusion/exclusion below specify a drawable answer without producing a new figure.

For tasks 126-136, let t0 be the representative in [0,2*pi). The all-real t families are given separately to avoid treating the artificial cut at 0 as an inequality endpoint. The points at t=0 and 2*pi are the same point (1,0).

### 119 / g2 / p0050#7

Request: prove sin(2.3*pi)=sin(0.3*pi).

Since 2.3*pi=0.3*pi+2*pi, one-period invariance gives the identity immediately. Both arguments are real radian measures; no rounding of 2.3 or 0.3 is used.

### 120 / g2 / p0050#8

Request: prove sin(-330 degrees)=-sin(330 degrees).

By oddness the equality holds. In explicit values, -330 degrees is coterminal with 30 degrees, so its sine is 1/2; 330 degrees is coterminal with -30 degrees, so its sine is -1/2. Thus both sides equal 1/2. The degree marks are essential.

### 121 / g2 / p0050#9

Request: prove sin(3.7*pi)=-sin(0.3*pi).

Write 3.7*pi=4*pi-0.3*pi. Removing the two full periods yields sin(-0.3*pi), which is -sin(0.3*pi) by oddness. This proves the exact identity.

### 122 / g2 / p0050#10

Request: prove sin(15 degrees)<sin(75 degrees)<sin(86 degrees).

The angles satisfy 0<15<75<86<90 degrees. Sine is strictly increasing on the closed principal interval, or equivalently [0,90 degrees] after converting by the positive factor pi/180. Hence both inequalities are strict. No approximate sine lookup is required.

### 123 / g2 / p0050#11

Request: prove sin(2.16)>0.

The bare real argument is radians. Since 0<2.16<3<pi, it lies in the positive half-wave (0,pi). Therefore its sine is positive. It is not an endpoint.

### 124 / g2 / p0050#12

Request: prove sin(4.5)<0.

Using pi<4<4.5<6<2*pi, the radian argument lies in (pi,2*pi), so sine is negative. It is not a zero.

### 125 / g2 / p0050#13

Request: prove sin(95 degrees)>sin(105 degrees)>sin(175 degrees).

All three angles lie strictly in (90,180 degrees), where sine is strictly decreasing. Alternatively sin(95)=sin(85), sin(105)=sin(75), sin(175)=sin(5), and 85>75>5 in the increasing first quadrant. Both approaches give the strict ordering without decimals.

### 126 / g3 / p0050#15

Request: draw {P_t: sin t<1/2}.

Answer: C intersect {v<1/2}; retain the long arc below the horizontal chord v=1/2. The two threshold points (sqrt(3)/2,1/2) at pi/6 and (-sqrt(3)/2,1/2) at 5*pi/6 are EXCLUDED. The long retained arc passes through (-1,0),(0,-1),(1,0), including all three.

    t0 in [0,pi/6) union (5*pi/6,2*pi).
    t in union over n in Z of (5*pi/6+2*pi*n,13*pi/6+2*pi*n).

Proof: a horizontal ordinate 1/2 intersects C at precisely those two points; sine is above or equal to 1/2 exactly on the complementary closed upper arc [pi/6,5*pi/6] modulo a period. The complement gives the strict set.

### 127 / g3 / p0050#16

Request: draw {P_t: sin t<0}.

Answer: the OPEN lower semicircle C intersect {v<0}. Both (1,0) and (-1,0) are excluded; (0,-1) is included.

    t0 in (pi,2*pi).
    t in union over n in Z of (pi+2*pi*n,2*pi+2*pi*n).

Proof: v is the ordinate sin t; negative ordinate is exactly below the diameter, with zero-ordinate endpoints excluded.

### 128 / g3 / p0050#17

Request: draw {P_t: sin t=sqrt(2)/2}.

Answer: exactly TWO included points

    (sqrt(2)/2,sqrt(2)/2) and (-sqrt(2)/2,sqrt(2)/2).
    t0 in {pi/4,3*pi/4}.
    t=pi/4+2*pi*n OR t=3*pi/4+2*pi*n, n in Z.

Proof: substituting v=sqrt(2)/2 in u^2+v^2=1 gives u^2=1/2, hence both and only these signs of u. Equality includes the points, not the intervening arc.

### 129 / g3 / p0051#1

Request: draw {P_t: sin t=0}.

Answer: exactly (1,0) and (-1,0), both included.

    t0 in {0,pi}; all real t=pi*k, k in Z.

Proof: v=0 forces u^2=1. No upper or lower semicircle is included.

### 130 / g3 / p0051#2

Request: draw {P_t: sin t>=1}.

Answer: exactly the included top point (0,1).

    t0=pi/2; all real t=pi/2+2*pi*n, n in Z.

Proof: v<=1 on C, so >=1 forces equality. Then u^2=0. This is not empty and not a positive-length arc.

### 131 / g3 / p0051#3

Request: draw {P_t: sin t<sqrt(3)/2}.

Answer: C intersect {v<sqrt(3)/2}, the long arc below that chord. Exclude both threshold points (1/2,sqrt(3)/2) at pi/3 and (-1/2,sqrt(3)/2) at 2*pi/3. The top point is excluded; left, bottom, and right axis points are included.

    t0 in [0,pi/3) union (2*pi/3,2*pi).
    t in union over n in Z of (2*pi/3+2*pi*n,7*pi/3+2*pi*n).

Proof: equality gives u=+/-1/2; the complementary upper closed cap is [pi/3,2*pi/3]. Remove it because the inequality is strict.

### 132 / g3 / p0051#4

Request: draw {P_t: sin t>-sqrt(3)/2}.

Answer: C intersect {v>-sqrt(3)/2}, the long arc ABOVE the lower chord. Exclude (-1/2,-sqrt(3)/2) at 4*pi/3 and (1/2,-sqrt(3)/2) at 5*pi/3. The bottom point is excluded; left, top, and right axis points are included.

    t0 in [0,4*pi/3) union (5*pi/3,2*pi).
    t in union over n in Z of (-pi/3+2*pi*n,4*pi/3+2*pi*n).

Proof: the lower CLOSED cap [4*pi/3,5*pi/3] has v<=-sqrt(3)/2. Its complement is the requested strict greater-than set. The interval (-pi/3,4*pi/3) is the same retained arc across the angle cut.

### 133 / g3 / p0051#5

Request: draw {P_t: sin t<=1/2}.

Answer: the same long lower arc as 126 but BOTH threshold points (sqrt(3)/2,1/2) and (-sqrt(3)/2,1/2) are INCLUDED. Left, bottom, and right axis points remain included.

    t0 in [0,pi/6] union [5*pi/6,2*pi).
    t in union over n in Z of [5*pi/6+2*pi*n,13*pi/6+2*pi*n].

Proof: remove only the OPEN upper cap (pi/6,5*pi/6); equality endpoints stay. The half-open canonical cut excludes 2*pi only as a duplicate of included 0.

### 134 / g3 / p0051#6

Request: draw {P_t: sin t=1}.

Answer: exactly (0,1), included.

    t0=pi/2; t=pi/2+2*pi*n, n in Z.

Proof: ordinate 1 on C forces u=0. This agrees with 130 for a different explicit request.

### 135 / g3 / p0051#7

Request: draw {P_t: sin t<1}.

Answer: the ENTIRE circle except the top point (0,1). All other points, including (1,0),(-1,0),(0,-1), are included. Only one excluded point is to be marked; the whole circle is not a closed inequality set.

    t0 in [0,pi/2) union (pi/2,2*pi).
    t in union over n in Z of (pi/2+2*pi*n,5*pi/2+2*pi*n).

Proof: sine reaches 1 exactly at the top point and is strictly smaller everywhere else.

### 136 / g3 / p0051#8

Request: draw {P_t: sin t>-2}.

Answer: ALL of C, with no excluded point. Canonical t0 in [0,2*pi); all real t in R.

Proof: v>=-1>-2 on C, including the bottom point. The strict inequality does not exclude any circle endpoint or point.

### 137 / g4 / p0051#10

Request: find arcsin(1/2).

Answer: pi/6. Proof: sin(pi/6)=1/2 and pi/6 is in the CLOSED principal range J, so inverse uniqueness applies. Input is in [-1,1].

### 138 / g4 / p0051#11

Request: find arcsin(sqrt(2)/2).

Answer: pi/4. Proof: sin(pi/4)=sqrt(2)/2 and pi/4 is in J. The supplementary 3*pi/4 is not a principal inverse value.

### 139 / g4 / p0051#12

Request: find arcsin(sqrt(3)/2).

Answer: pi/3. Proof: sin(pi/3)=sqrt(3)/2 and pi/3 is in J. Input is in [-1,1].

### 140 / g4 / p0051#13

Request: find arcsin 0.

Answer: 0. Proof: sin 0=0 and 0 is in J; unique inverse value. Do not return the entire sine-zero family for an inverse-value request.

### 141 / g4 / p0051#14

Request: find arcsin 1.

Answer: pi/2. Proof: sin(pi/2)=1, and the CLOSED endpoint pi/2 belongs to J. There is no inverse-domain exclusion at 1.

### 142 / g5 / p0051#16

Request: solve sin x=sqrt(2)/2.

Domain: x in R. Let alpha=pi/4 by 138. B3 gives the exact complete answer:

    x=pi/4+2*pi*n OR x=3*pi/4+2*pi*n, n in Z;
    equivalently x=(-1)^k*pi/4+pi*k, k in Z.

Both branches substitute to sqrt(2)/2. They account for the two distinct intersections per full period; no other branch, inequality interval, or finite range restriction belongs to this request.

### 143 / g5 / p0051#17

Request: solve sin(2*x)=sqrt(3)/2. The entire argument is 2*x, not 2*sin x.

Domain: x in R. Put u=2*x. By B3, u=pi/3+2*pi*n or u=2*pi/3+2*pi*n. Dividing every term by 2 gives

    x=pi/6+pi*n OR x=pi/3+pi*n, n in Z;
    equivalently x=(-1)^k*pi/6+pi*k/2, k in Z.

The period in x is pi. Substitution restores the two u branches, proving validity; the bijection x -> 2*x proves completeness. Dividing the base angle without dividing the period would be an incomplete answer.

### 144 / g5 / p0051#18

Request: solve the source `sin(1/2 x)=0.5`, encoded literally as `\sin\frac{1}{2}x=0.5`.

EXPLICIT PARSER SEMANTICS: the function's ENTIRE argument is `(1/2)*x`, i.e. `sin(x/2)=1/2`. The mathematical tree is `Equal(Sin(Multiply(Rational(1,2),x)),Rational(1,2))`. It is NOT `Multiply(Sin(Rational(1,2)),x)=1/2`, NOT `(sin x)/2=1/2`, and NOT `sin(1/(2*x))=1/2`. No parser or app execution was used to test or normalize this; source bytes remain unchanged. Any later consuming parser must preserve the stated function-argument scope.

Domain: x in R, including x=0 as a valid input though not a solution. There is no denominator-x domain exclusion. Put u=x/2. Then u=pi/6+2*pi*n or u=5*pi/6+2*pi*n, hence

    x=pi/3+4*pi*n OR x=5*pi/3+4*pi*n, n in Z;
    equivalently x=(-1)^k*pi/3+2*pi*k, k in Z.

Period in x is 4*pi. Substituting either family into x/2 gives exactly the two source sine branches. Because x -> x/2 is bijective, the answer is complete.

### 145 / g5 / p0051#19

Request: solve sin x=0.6.

Domain: x in R. The decimal is exactly 3/5. Let alpha=arcsin(3/5), with 0<alpha<pi/2. The exact answer is

    x=arcsin(3/5)+2*pi*n
      OR x=pi-arcsin(3/5)+2*pi*n, n in Z;
    equivalently x=(-1)^k*arcsin(3/5)+pi*k, k in Z.

For orientation only, alpha approximately 0.6435011087932844 radians. This decimal is not a replacement for the exact principal inverse value. Both branches have sine 3/5 by B3; the principal restriction and period proof establish completeness.

### 146 / g5 / p0051#20

Request: solve sin(4*x-pi/6)=-0.5.

Domain: x in R. Put u=4*x-pi/6. Since arcsin(-1/2)=-pi/6, the two complete u branches are

    u=-pi/6+2*pi*n OR u=7*pi/6+2*pi*n.

Add pi/6 and divide by 4:

    x=pi*n/2 OR x=pi/3+pi*n/2, n in Z;
    equivalently x=pi*(1-(-1)^k)/24+pi*k/4, k in Z.

For even k=2*n the compact family is pi*n/2; for odd k=2*n+1 it is pi/3+pi*n/2. Substitution of the first branch gives u=-pi/6+2*pi*n; the second gives u=7*pi/6+2*pi*n, both with sine -1/2. Inverting the affine map proves there are no missing roots. The x period is pi/2, and no finite interval or inequality endpoint restriction is imposed.

## Six Original Media Inventories

These inventories come from the six actual original PNGs, not SVGs, FigureSpecs, modern figures, source answer figures, or another author's inventory. They are textual observations and mathematical assessments, not newly rendered assets or review records.

### F1. tbl-p0043-01 / p0043#2

Path: `ssot-resources/soviet10year-textbooks/artifacts/10c/figures/tbl-p0043-01.png`.

SHA256: `502daf2525eae862f68d5f750e5e95d37e754f84538da7ce94767cd38e99e589`.

One table, three main rows and EIGHT main columns including the left row-header column. Two attached boxed labels lie below the stationary-point columns; they are not a fourth full-width row.

| Column | x row | derivative row `sin' x` | sine row |
| --- | --- | --- | --- |
| 1 | row header x | row header sin' x | row header sin x |
| 2 | -pi | -1 | 0 |
| 3 | open interval ]-pi,-pi/2[ | minus | descending arrow |
| 4 | -pi/2 | 0 | -1 |
| 5 | open interval ]-pi/2,pi/2[ | plus | ascending arrow |
| 6 | pi/2 | 0 | 1 |
| 7 | open interval ]pi/2,pi[ | minus | descending arrow |
| 8 | pi | -1 | 0 |

Attached labels: minimum value below column 4 and maximum value below column 6, printed in Chinese. Vertical and horizontal ruling separates all row/column groups; preserve three open interval entries, two stationary points, both boundary values, all derivative signs, and all three directional arrows. B1 derives every numeric entry and trend. Interval-row openness describes derivative signs, whereas the sine segment discussed in prose is closed. No named points, coordinate axes, separate subfigures, or unanswered cells are present.

### F2. fig-24 / p0043#4; caption p0043#5

Path: `ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-24.png`.

SHA256: `39d1906beba349067a337f6a164e5608ced000e01b5b35fa33dc0ca521664644`.

One graph with horizontal x-axis/right arrow, vertical y-axis/up arrow, origin 0, and horizontal labels -pi, -pi/2, pi/2, pi. One solid sine curve runs from the left root at -pi, down to a trough above the -pi/2 abscissa, through 0, up to a crest above pi/2, and down to the right root at pi. No +/-1 ordinate labels, dashed projections, y=x line, or lettered points are printed in this PNG.

The mathematical coordinates derived from the body are (-pi,0),(-pi/2,-1),(0,0),(pi/2,1),(pi,0). The extrema values +/-1 are author deductions, not additional visible labels. The source body explicitly gives [-pi,pi], so the endpoints belong to the graph even though the source does not use open/closed endpoint circles. B1 matches all root, phase, and trend relationships.

### F3. fig-25 / p0043#6; caption p0043#7

Path: `ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-25.png`.

SHA256: `39089fd532ea6b6892d06bf38638bf13a64726fbba4b44c947fcfefbb9823d74`.

One solid periodic sine curve with x/y axes, right/up arrows and origin 0. Printed y-axis values: 1 and -1. Printed x values, from left to right: -2*pi, -3*pi/2, -pi, -pi/2, 0, pi/2, pi, 3*pi/2, 2*pi, 5*pi/2, 3*pi. Fractions sometimes put pi after the fraction rather than in its numerator; this changes typography, not the value.

Visible root crossings align with -2*pi,-pi,0,pi,2*pi,3*pi. Crests align with -3*pi/2,pi/2,5*pi/2; troughs with -pi/2,3*pi/2. The solid wave continues slightly beyond the extreme marked roots in the pictured window. Those image edges are not declared function-domain endpoints. No dashed projection family, isolated lettered point, or second curve is present. The ordinate bounds, 2*pi translation, and phase relations follow from B1.

### F4. fig-26 / p0044#4; caption p0044#5

Path: `ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-26.png`.

SHA256: `47adf3220b439fe7a24d9495986174a9ef4c094a95ba34747f452b540b3b9a52`.

One solid increasing inverse-sine curve, lower-left to upper-right, through origin 0. Axes x/y have right/up arrows. Printed abscissas -1 and 1; printed ordinates -pi/2 and pi/2. Four dashed coordinate projection segments connect the two endpoints to their axis positions: vertical at x=-1 from y=0 to -pi/2, horizontal at y=-pi/2 from x=-1 to 0; vertical at x=1 from y=0 to pi/2, horizontal at y=pi/2 from x=0 to 1.

Endpoints are (-1,-pi/2) and (1,pi/2), included by the source domain/range statement. There is no second sine graph or drawn y=x reflection line in the PNG, even though the prose discusses that relationship. No additional named points. B2 proves the inverse graph relationships. Its increasingly steep ends do not imply real values beyond x=+/-1.

### F5. fig-27 / p0046#1; caption p0046#2

Path: `ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-27.png`.

SHA256: `90383a12ea5f11571494ead792efb20820ecd75a16e849c88f16b0089fa210b4`.

One solid periodic sine curve, one horizontal x-axis with right arrow, one vertical y-axis with up arrow. Origin 0; printed ordinate bounds 1 and -1. FOUR additional solid horizontal levels: the upper external level labelled a and a>1, the upper bound level y=1, lower bound level y=-1, and lower external level labelled a and a<-1.

Five printed extrema abscissas: -3*pi/2,-pi/2,pi/2,3*pi/2,5*pi/2. Dashed vertical projections join each extremum to its corresponding x-axis position. Three crests align with -3*pi/2,pi/2,5*pi/2 at y=1; two troughs with -pi/2,3*pi/2 at y=-1. External levels do not intersect the sine curve. Bound levels touch the extrema, not empty sets. Dots at projection feet/axis level positions are not new lettered problem points.

The two external labels illustrate alternative values of a, not a single a simultaneously above 1 and below -1. Source p0046#7's final a/q uncertainty is a separate PROSE glyph issue, not a reason to guess or rename these visible figure levels. No finite mathematical domain is inferred from the window edges. B1/B3 justify the intersection count and endpoint cases.

### F6. fig-28 / p0046#3; caption p0046#4

Path: `ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-28.png`.

SHA256: `c8f7749b95bc91e1a22b2cf2aac1aeee9b9346540bd032fb5c69fb4d4d85b809`.

One solid periodic sine curve, x/y axes with right/up arrows, origin 0. Two non-axis solid horizontal example levels, upper positive and lower negative, labelled a on the y-axis. Printed inequalities 0<a<1 above the left-central part and -1<a<0 below near the center identify separate cases, not simultaneous restrictions on one number.

Printed extrema abscissas visibly include -3*pi/2,-pi/2,pi/2,3*pi/2. The final right-hand crest has a fraction-times-pi label whose single-view reading resembles 3*pi/2 rather than the phase-required 5*pi/2; see D3. No source label is replaced in this package. Preserve the existence, placement and uncertain/possibly erroneous numerator of that last label separately from the derived coordinate.

Projection inventory: SIX upper-level intersections, two around each of three visible crests; FOUR lower-level intersections, two around each of two visible troughs. Each of these ten intersections has a dashed vertical projection to an x-axis foot. Five additional dashed extrema verticals project the three crests and two troughs to the x-axis. These extrema projections are distinct from the ten level-intersection projections. No root coordinate, arcsin label, endpoint circle, or new lettered point is printed at those intersections.

Mathematical relationship inventory: for positive a, in each period the two intersection abscissas are alpha and pi-alpha, alpha=arcsin a in (0,pi/2), translated by 2*pi*n. For negative a, alpha is in (-pi/2,0), and pi-alpha in (pi,3*pi/2), again translated by 2*pi*n. The horizontal levels therefore cross twice per period for either interior sign. The upper-level roots shown in successive crest groups belong around -3*pi/2,pi/2,5*pi/2; the lower-level roots belong around -pi/2,3*pi/2. Level spacing is schematic and supplies no exact numeric a. B3 proves these claims without assuming the questionable right-hand numerator.

## Source Defects, Precision Limits, and Holds

### D1. Incorrect Supporting Sine Sign

Binding: original p0044#6, printed page 38, body ordinal 15; source page SHA256 `5b48fb7e21ef53d99bc2650230e9c03afcb7c8166be0df4745dfa47463449fb8`.

Source original equality: `\sin\left(-\frac{\pi}{6}\right)=\frac{1}{2}`. The original page transcription explicitly preserves the absent minus; this role did not open a full-page PNG and does not independently attest that optical detail.

Proof of mathematical falsehood: sin(pi/6)=1/2 and oddness imply sin(-pi/6)=-1/2. Thus the printed/transcribed right side +1/2 disagrees by 1. Meanwhile the displayed inverse value arcsin(-1/2)=-pi/6 is correct, because -pi/6 is in J and its sine is -1/2.

Diagnosis: mathematically incorrect supporting sign, consistent with a suspected printing omission if the source transcription is optically faithful. A possible mathematical repair would change the supporting right side to -1/2, but this is a DIAGNOSIS, not permission to edit source, modern content, or errata. Full-page optical confirmation and any durable correction decision are outside this package.

### D2. Property 6 Literal Qualifier

Binding: original p0049#10, printed page 43, body ordinal 59; source page SHA256 `c8daca0b911b3bd1aa93fd8c34220480e68ad2aa0f97b86a9c793050567c0e00`.

Source original:

    x in ]2*pi*n;pi+2*pi*n[ (x in Z), sin x>0.

The original qualifier is x in Z. It remains x in Z here; no conversion to n in Z and no registered erratum.

Under a separately stated contextual assumption n in Z, the interval is a positive half-wave and the inequality is true even after restricting x to integers. However it then says only something about integer x, and cannot itself express the full real-argument positivity property.

If no integer assumption for n is supplied, the literal statement has a free parameter and is false under a natural universal-real-n reading. Counterexample: choose x=4 in Z and n=1/pi. The interval becomes (2,pi+2), so 2<4<pi+2, but 4 is in (pi,2*pi), hence sin 4<0 (approximately -0.7568024953079282).

Diagnosis: missing/misassigned parameter qualification as a source mathematical statement, with a conditional true reading and an explicit false unrestricted reading. Likely intended full sign theorem is B1 with integer n and real x, but that theorem is author mathematics, not a replacement transcription. Optical fidelity of the stored x is not newly certified.

### D3. Rightmost Crest Label in fig-28

Binding: actual original `fig-28.png`, p0046#3, printed page 40, body ordinal 33; PNG SHA256 `c8f7749b95bc91e1a22b2cf2aac1aeee9b9346540bd032fb5c69fb4d4d85b809`.

The single original-image observation shows a fraction-times-pi label at the final positive crest resembling 3*pi/2. The nearby earlier trough already aligns with 3*pi/2. This is recorded as a suspect source label, not replaced by a clean intended label.

Mathematical counterexample to a positive crest at 3*pi/2: sin(3*pi/2)=-1, while any sine crest has ordinate +1. The positive crest one full cycle after pi/2 is at pi/2+2*pi=5*pi/2. Thus if the source glyph is indeed 3, the label is a mathematical printing error. If the glyph is instead a degraded 5, the issue is optical rather than mathematical. Mathematical phase cannot decide that pixel identity.

Hold: suspect-label attribution remains conditional on independent source optical resolution. No crop or second opening was used. Do not silently modernize the source to 5*pi/2, register an erratum, or claim a confirmed printing-error glyph from this author's phase proof alone.

### D4. Four-Decimal Approximation Qualification

Binding: original p0045#1 and p0045#7, printed page 39, body ordinals 18 and 24; page SHA256 `71023115699a9053ca7cba5160e4fca962da8aea0b0f02fa2da52c3f17fbdeff`.

B4 distinguishes the exact inverse at numeric input 0.9063 from inversion of its rounded sine-table entry at 65 degrees. Source approximate 1.1345 is close, but its error exceeds half a unit in the fourth decimal. It must not be represented as certified four-place nearest rounding of the exact input. No conclusion about which table or printing stage caused the difference is authorized.

Binding for the separate coarse 1.2 estimate: p0049#3, source page SHA256 `c8daca0b911b3bd1aa93fd8c34220480e68ad2aa0f97b86a9c793050567c0e00`. That estimate is mathematically reasonable at its displayed precision; exact equation families still contain arcsin(0.932).

### D5. Fundamental-Interval Endpoint Convention

Binding: p0046#7, body ordinal 37; page SHA256 `fc2f8d9fd484a1bb47e54a73d9750c92603f91411a7e53af8319220c010d8214`.

The chosen CLOSED interval [-pi/2,3*pi/2] and its two CLOSED half-period pieces are valid as written for |a|<1. A blanket "any interval of length 2*pi" is not valid if interpreted as an OPEN interval whose excluded endpoints are roots. Counterexample: a=0 and I=(0,2*pi) give only pi; translations of pi by 2*pi omit every even multiple of pi, although those are also roots. A closed or half-open representative-covering interval avoids that loss.

Diagnosis: endpoint-convention precision issue in the general prose, not a proven printing error. Do not alter source words, brackets, continuation markers, counters, or assembler behavior. The actual selected closed interval supports all subsequent B3 derivations.

### O1. Translation Name T/tau

Binding: p0043#3, body ordinal 5; page SHA256 `d1d1f05b8c7e5f6a7e329008c27027cd565e55c889d27527d9fcc1a464b9dcf5`.

The source lesson encodes vector T. Its original T/tau identity remains optical UNKNOWN. The displacement (2*pi,0) and repeated displacement (2*pi*n,0) have a complete mathematical assessment in B1. That assessment does not settle or rewrite the vector name.

### O2. Final a/q in Locally Closed p0046#7

Binding: p0046#7, body ordinal 37; page SHA256 `fc2f8d9fd484a1bb47e54a73d9750c92603f91411a7e53af8319220c010d8214`.

The final source token is encoded a in the assembled expression arcsin a, but a/q remains optical UNKNOWN. Under encoded-a semantics the principal solution is proved in B3. If the actual symbol were q, the isolated assertion would require q=a or a definition not provided here; equation (1) does not optically authorize changing q to a. The p0046#7/p0047#1 separation remains exactly as observed in the supplied sources.

## Freeze Meaning

This package freezes the author's complete mathematical position for all 65 objects, all 28 requests, and all six media, INCLUDING the explicitly stated holds. It is not a claim that every original printing is correct, that all optical unknowns were resolved, that an independent reviewer agreed, or that anything is ready for publication.

Only file bytes plus hashes define this freeze. There is no new review PASS, ticket transition, tool gate, source correction, index change, or answer publication. The manifest binds this file, original inputs, complete inventories, and the non-disclosure boundary. Parent mathematical disclosure remains gated on an independent Stage A freeze that this role neither read nor changed.
