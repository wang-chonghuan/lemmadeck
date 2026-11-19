# n41 Independent Source Freeze: Stage1 Only

Ticket: STEMROBIN-182.
Reviewer: fresh independently assigned n41 CHOICE reviewer in this chat.
Checkout: /Users/yong/.codex/worktrees/d9b1/lemmadeck.
Date: 2026-11-19.
No learner choices, author draft, author solution, author key, answer records,
or previous n41 choice review were opened.

This is a source-solution freeze, NOT a choice review or approval.
Exact source mathematics is recorded for 17 exercises / 80 tasks.
There are 12 distinct "simplify, then consult a table" tasks, not merely
12 algebraic answers. Eleven have complete direct cell evidence. The twelfth,
843.b, has an independently derived alternative table route but lacks the
literal direct sqrt(10) entry for its simplest rationalized expression.
Final SVG bytes were hashed but could not be visually opened; raw source
fig56/57 PNGs were both opened in full. Stage1 remains BLOCKED.

## Authority and Conventions

- Exercise text comes from seed.json, checked verbatim against all 17 current
  modern exercise texts. Original written prose and source references are
  retained in that exercise file. No judging or answer fields were used.
- Seed selected concepts: none. No worked example was used to obtain an
  exercise solution or to invent a required numerical rounding convention.
- All variables and solutions are real. sqrt(t) is the nonnegative real
  square root, defined exactly for t >= 0. Constant decimal literals in these
  symbolic exercises are exact unless the problem expressly calls for an
  approximate table evaluation. Formula inversion has no supplied physical
  sign restrictions; none are silently introduced.
- Cancellation preserves the ORIGINAL domain, including removed-factor holes.
- An ordinary formula for a parameter must be accompanied by all singular
  cases. Multiplication by an original denominator does not erase its exclusion.
- The table values below are literal captured strings, not values computed
  by a square-root evaluator. Commas in captured numbers denote decimal points.
- Raw arithmetic on those approximate cells is shown explicitly. It is not
  a claim that every displayed digit is accurate, nor a mandated final rounding
  format. The source exercise prose specifies no final number of digits.
- Only general rules in source-rules.json / rules were admitted. Direct main
  entries have at most half a unit of last-place error (I-main-entry-error);
  the captured correction/inverse rules are not needed for these exact main
  addresses. No universal four-significant-figure answer cutoff is invented.
- The complete source-rules.json was inadvertently displayed by the initial
  read, exposing non-rule metadata and unrelated n39 prior-result summaries.
  Those non-rule sections were excluded, not followed, and their referenced
  files were not opened. This access-scope deviation is disclosed rather than
  described as a strictly rules-only read. No n41 answer or choice content
  appeared in that packet.

## Literal Table Evidence

| Root | Authorized capture | Literal address | Main value | Correction |
| --- | --- | --- | --- | --- |
| sqrt(2) | bradis-cell-review/capture-36.json, record id r2, index 37 | IV, row "2,0", main column "0" | "1,414" | corrections []: none needed |
| sqrt(3) | n41-table-cell-source/capture-36.json, IV-root-3 | IV, row "3,0", main column "0" | "1,732" | column/cell null: no printed zero asserted |
| sqrt(5) | n41-table-cell-source/capture-37.json, IV-root-5 | IV, row "5,0", main column "0" | "2,236" | column/cell null: no printed zero asserted |
| sqrt(7) | n41-table-cell-source/capture-37.json, IV-root-7 | IV, row "7,0", main column "0" | "2,646" | column/cell null: no printed zero asserted |

The row/column digits independently reconstruct arguments 2.00, 3.00, 5.00,
7.00. Address-packet exercise associations and any inferred algebra are not
solution authority. sqrt(10)'s literal main entry is NOT supplied. No source
table page, correction crop, PDF, historical table context, or missing cell
was reopened or reconstructed.

For the three n41 captures, PDF image 36/37 and printed footer 35/36 are
metadata from the admitted capture, not a new visual observation by this reviewer.
The root-2 capture's printed page is 35. The captured roots all have last
decimal place 0.001, hence direct-entry error <= 0.0005 under the admitted
main-entry rule. Scaling an error by an exact coefficient is explicitly accounted
for below, rather than giving the final expression a blanket half-unit bound.

## 834: Simplification (6 Tasks)

- `834.a`: (5 + 4 - 10)sqrt(3) = -sqrt(3).
- `834.b`: (3*2 + 2*3 - 5)sqrt(2) = 7sqrt(2).
- `834.c`: (11 - 10 + 2)sqrt(2) = 3sqrt(2).
- `834.d`: (3 + 4 - 5)sqrt(6) = 2sqrt(6).
- `834.e`: sqrt(1/3) = sqrt(3)/3, so
  (6/3 - 2 + 1)sqrt(3) = sqrt(3).
- `834.f`: sqrt(2/5) = sqrt(10)/5 and sqrt(1000) = 10sqrt(10),
  so (40/5 - 10 + 2)sqrt(10) = 0.

## 835: Simplification AND Actual Table Evaluation (6 Tasks)

- `835.a`: (3 + 4 - 10)sqrt(2) = -3sqrt(2).
  Lookup: IV row "2,0", column "0", "1,414", no correction.
  Table arithmetic: -3*1.414 = -4.242.
  Absolute error from the direct entry <= 0.0015.
- `835.b`: (2*6 - 5 - 2*2)sqrt(2) = 3sqrt(2).
  Lookup: IV row "2,0", column "0", "1,414", no correction.
  Table arithmetic: 3*1.414 = 4.242.
  Absolute error <= 0.0015.
- `835.c`: (5 + (1/3)*3 - 4)sqrt(3) = 2sqrt(3).
  Lookup: IV row "3,0", column "0", "1,732", no correction.
  Table arithmetic: 2*1.732 = 3.464.
  Absolute error <= 0.001.
- `835.d`: (4 + (1/2)*2 + 3*3)sqrt(5) = 14sqrt(5).
  Lookup: IV row "5,0", column "0", "2,236", no correction.
  Table arithmetic: 14*2.236 = 31.304.
  Absolute error <= 0.007. A chosen four-significant-digit display is 31.30,
  but that formatting is not prescribed by this problem.
- `835.e`: (5 - 0.1*10 - 3)sqrt(3) = sqrt(3).
  Lookup: IV row "3,0", column "0", "1,732", no correction.
  Table result: 1.732. Absolute error <= 0.0005.
- `835.f`: (7 - 6 + (1/2)*2)sqrt(2) = 2sqrt(2).
  Lookup: IV row "2,0", column "0", "1,414", no correction.
  Table arithmetic: 2*1.414 = 2.828.
  Absolute error <= 0.001.

## 836: Distribution and Binomial Squares (6 Tasks)

- `836.a`: 15 - 2sqrt(15) + sqrt(60) =
  15 - 2sqrt(15) + 2sqrt(15) = 15.
- `836.b`: (2sqrt(7) - 2sqrt(3) + sqrt(7))*sqrt(7)
  + 2sqrt(21) = 21 - 2sqrt(21) + 2sqrt(21) = 21.
- `836.c`: sqrt(12)*(sqrt(2)/2) = sqrt(6);
  2sqrt(18)*(sqrt(2)/2) = 6; sqrt(96) = 4sqrt(6).
  Result: 6 - 3sqrt(6).
- `836.d`: 24 - 4sqrt(18) - 2sqrt(3) =
  24 - 12sqrt(2) - 2sqrt(3).
- `836.e`: 6 + 5 + 2sqrt(30) - sqrt(120) =
  11 + 2sqrt(30) - 2sqrt(30) = 11.
- `836.f`: 14 + 18 - 6sqrt(28) + 6sqrt(28) = 32.

## 837: Factoring (8 Tasks)

- `837.a`: sqrt(7)(sqrt(2) - 1), by sqrt(14) = sqrt(7)sqrt(2).
- `837.b`: sqrt(11)(sqrt(3) + sqrt(2)).
- `837.c`: sqrt(3)(sqrt(5) - sqrt(2)).
- `837.d`: sqrt(3)(sqrt(3) + 1), since 3 = (sqrt(3))^2.
- `837.e`: sqrt(10)(sqrt(10) - 2).
- `837.f`: sqrt(a)(sqrt(a) - 5), exactly on a >= 0.
  At a = 0 both the original expression and the factorization are 0.
- `837.g`: sqrt(b)(sqrt(b) - 3), exactly on b >= 0.
  At b = 0 the factorization remains valid.
- `837.h`: sqrt(b)(sqrt(b) - sqrt(3)), exactly on b >= 0.
  sqrt(3b) = sqrt(3)sqrt(b) on that full real domain, including b = 0.

## 838: Reduction, With Original Domains (9 Tasks)

- `838.a`: (sqrt(2) + 2)/sqrt(2) = 1 + sqrt(2).
  The constant denominator is nonzero.
- `838.b`: (5 + sqrt(10))/sqrt(10) = 1 + sqrt(10)/2,
  since 5/sqrt(10) = sqrt(10)/2.
- `838.c`: (2sqrt(3) - 3)/(5sqrt(3)) = (2 - sqrt(3))/5.
- `838.d`: Original real domain: a > 0 AND b > 0.
  Individual roots require a,b >= 0; denominator sqrt(ab) != 0 excludes
  either zero. Divide numerator factors by sqrt(a)sqrt(b):
  result sqrt(a) + sqrt(b). Do not extend it to a = 0 or b = 0.
- `838.e`: Original real domain: x > 0 AND a > 0.
  sqrt(x) and a*sqrt(x) != 0 force x > 0, a != 0; sqrt(ax)
  then forces a >= 0, hence a > 0.
  Numerator = sqrt(x)*(sqrt(x) - sqrt(a)); cancel sqrt(x) to get
  (sqrt(x) - sqrt(a))/a, on the ORIGINAL domain only.
- `838.f`: Original real domain: y > 0 AND b != 0, with NEGATIVE b allowed.
  Numerator = sqrt(y)(sqrt(y) + b).
  Result (sqrt(y) + b)/b = 1 + sqrt(y)/b.
  Cancellation does not admit y = 0 or b = 0.
- `838.g`: 2 + sqrt(2) = sqrt(2)(sqrt(2) + 1).
  Result sqrt(2), since 1 + sqrt(2) > 0.
- `838.h`: Numerator = sqrt(5)(sqrt(3) - 1);
  denominator = -(sqrt(3) - 1). Result -sqrt(5).
- `838.i`: Numerator = sqrt(3)(2 - sqrt(2)) =
  sqrt(6)(sqrt(2) - 1); denominator = 2(sqrt(2) - 1).
  Result sqrt(6)/2. sqrt(2) - 1 != 0.

## 839: Simplification and Cancellation Holes (6 Tasks)

- `839.a`: Original domain x >= 0, y >= 0, x + y > 0.
  Numerator = sqrt(x)(sqrt(x) + sqrt(y)); result sqrt(x).
  x = 0,y > 0 and y = 0,x > 0 are allowed; only (0,0) is excluded.
- `839.b`: Original domain x >= 0, x != 1.
  sqrt(x)(sqrt(x) - 1)/(sqrt(x) - 1) = sqrt(x).
  x = 0 is valid; the removable x = 1 hole remains excluded.
- `839.c`: Original domain a >= 0, with NO cancellation hole.
  Numerator = sqrt(a)(sqrt(a) + sqrt(6));
  denominator = sqrt(6)(sqrt(6) + sqrt(a)), strictly positive.
  Result sqrt(a)/sqrt(6) = sqrt(6a)/6, including a = 0.
- `839.d`: Original domain p >= 0, p != 4.
  sqrt(p)(sqrt(p) - 2)/[2(sqrt(p) - 2)] = sqrt(p)/2.
  p = 0 is valid; p = 4 remains excluded.
- `839.e`: Original domain a >= 0, a != 4.
  (sqrt(a) - 2)(sqrt(a) + 2)/(sqrt(a) - 2) = sqrt(a) + 2.
- `839.f`: Original domain b >= 0, with NO hole at b = 9.
  Denominator sqrt(b) + 3 >= 3.
  Factoring the numerator gives result sqrt(b) - 3.
  b = 0 gives -3; b = 9 gives 0; both are valid.

## 840: Exact Comparisons (4 Tasks)

- `840.a`: sqrt(2.5) > (sqrt(2) + sqrt(3))/2.
  Both sides are positive. Left square minus right square =
  (5 - 2sqrt(6))/4 > 0, since 25 > 24.
- `840.b`: sqrt(11) - 1 < sqrt(5) + sqrt(7).
  Both sides are positive. Their squares are respectively
  12 - 2sqrt(11) and 12 + 2sqrt(35), so the first is smaller.
- `840.c`: sqrt(2) + sqrt(7) > 2sqrt(2) + 1.
  Equivalent to sqrt(7) > sqrt(2) + 1; both sides positive.
  7 > 3 + 2sqrt(2), since 4 > 2sqrt(2).
- `840.d`: sqrt(5) + sqrt(7) > 3 + sqrt(3).
  Positive sides have squares 12 + 2sqrt(35) and 12 + 6sqrt(3).
  sqrt(35) > 3sqrt(3), since 35 > 27.

## 841: Difference of Squares (6 Tasks)

- `841.a`: 3 - 1 = 2.
- `841.b`: 11 - 9 = 2.
- `841.c`: (7 + sqrt(10))(7 - sqrt(10)) = 49 - 10 = 39.
- `841.d`: 4*5 - 19 = 1.
- `841.e`: 25*7 - 169 = 6.
- `841.f`: (sqrt(3) + sqrt(14)/2)(sqrt(3) - sqrt(14)/2)
  = 3 - 14/4 = -1/2. The order is essential.

## 842: Proof of Rational Values (2 Tasks)

- `842.a`: Combine the fractions over denominator
  (3sqrt(2) - 4)(3sqrt(2) + 4) = 18 - 16 = 2.
  Numerator = (3sqrt(2) + 4) - (3sqrt(2) - 4) = 8.
  Value 8/2 = 4, a rational number.
  The nonzero product 2 also proves neither denominator vanishes.
- `842.b`: Combined denominator = 25 - 4*6 = 1,
  combined numerator = (5 - 2sqrt(6)) + (5 + 2sqrt(6)) = 10.
  Value 10, rational. Both denominators are nonzero because their product is 1.

## 843: Rationalization AND Actual Table Evaluation (6 Tasks)

- `843.a`: Multiply by sqrt(5) + sqrt(3). Denominator 5 - 3 = 2
  cancels the numerator coefficient 2. Exact result sqrt(5) + sqrt(3).
  Lookups: IV "5,0"/"0" -> "2,236" and "3,0"/"0" -> "1,732";
  no correction for either.
  Table arithmetic: 2.236 + 1.732 = 3.968.
  Absolute error <= 0.001.
- `843.b`: Multiply by sqrt(10) - sqrt(7); denominator 10 - 7 = 3.
  Exact result sqrt(10) - sqrt(7).
  DIRECT simplified-root table route is BLOCKED: the literal sqrt(10)
  main cell is absent from the authorized captures. sqrt(7) is supported
  by IV "7,0"/"0" -> "2,646", no correction.
  No guessed string "3.162", remembered root value, or computed sqrt(10)
  is claimed as table evidence.
  An alternative independently derived exact form is
  sqrt(2)*sqrt(5) - sqrt(7). This uses three ACTUAL captured main lookups:
  IV "2,0"/"0" -> "1,414"; "5,0"/"0" -> "2,236";
  "7,0"/"0" -> "2,646"; no corrections.
  Its raw approximate arithmetic is
  1.414*2.236 - 2.646 = 3.161704 - 2.646 = 0.515704.
  If one explicitly chooses a three-decimal display, that is 0.516.
  The alternative is source-legal algebra and table arithmetic, but is NOT
  silently asserted to be the prescribed canonical direct-table route.
  With errors <= 0.0005 in each main entry, its absolute error is bounded by
  1.414*0.0005 + 2.236*0.0005 + 0.0005^2 + 0.0005
  = 0.00232525. This does not guarantee a correctly rounded final 0.516.
- `843.c`: Conjugate sqrt(5) + 2 gives denominator 5 - 4 = 1.
  Exact result sqrt(5) + 2.
  Lookup IV "5,0"/"0" -> "2,236", no correction.
  Table arithmetic 2.236 + 2 = 4.236. Absolute error <= 0.0005.
- `843.d`: Conjugate 3 - sqrt(7) gives denominator 9 - 7 = 2.
  Exact result 2(3 - sqrt(7)) = 6 - 2sqrt(7).
  Lookup IV "7,0"/"0" -> "2,646", no correction.
  Table arithmetic 6 - 2*2.646 = 0.708. Absolute error <= 0.001.
- `843.e`: Conjugate 9 + 4sqrt(5) gives denominator 81 - 80 = 1.
  Exact result 9 + 4sqrt(5).
  Lookup IV "5,0"/"0" -> "2,236", no correction.
  Table arithmetic 9 + 4*2.236 = 17.944. Absolute error <= 0.002.
- `843.f`: Conjugate 5sqrt(2) + 7 gives denominator 50 - 49 = 1.
  Exact result 7 + 5sqrt(2).
  Lookup IV "2,0"/"0" -> "1,414", no correction.
  Table arithmetic 7 + 5*1.414 = 14.070. Absolute error <= 0.0025.

All six original constant denominators are nonzero. For a,b their conjugate
products are 2 and 3, and for c,d,e,f they are 1,2,1,1 respectively.
Exact rationalization is deliberately completed before approximate evaluation,
avoiding a reciprocal of a rounded small denominator.

## 844-845: Universal Inequalities (2 Tasks)

- `844`: For every a,b >= 0, both sides of the claimed inequality are
  nonnegative. The left square minus the right square is
  (a+b)/2 - (a+b+2sqrt(ab))/4
  = (sqrt(a) - sqrt(b))^2/4 >= 0.
  Taking the order of nonnegative square roots proves the inequality.
  Equality iff sqrt(a) = sqrt(b), equivalently a = b, including a=b=0.
  Otherwise it is strict. Zero in only one variable is allowed and is strict.
- `845`: (a+b)/2 - sqrt(ab)
  = (sqrt(a) - sqrt(b))^2/2 >= 0 for all a,b >= 0.
  Thus the arithmetic mean is at least the geometric mean.
  Equality iff a=b, including both zero; otherwise strict.

## 846: Solve for Parameters With Every Real Exception (2 Tasks)

- `846.a`: Original formula requires b != a.
  On that domain, s(a-b)=m(a+b), hence
  (s+m)b = a(s-m).
  Complete classification for fixed real a,s,m:
  1. If s+m != 0 and a*m != 0, the UNIQUE allowed solution is
     b = a(s-m)/(s+m).
     Its difference from a is -2*a*m/(s+m), which is nonzero.
  2. If s+m != 0 and a*m = 0, the rearranged candidate is b=a,
     forbidden by the original denominator; there is NO solution.
  3. If s+m = 0 and a*s = 0, every real b != a is a solution.
     Indeed m=-s and a(s-m)=2*a*s=0.
     This includes s=m=0 for ANY a, and a=0,s=-m for any s.
  4. If s+m = 0 and a*s != 0, there is NO solution.
  These cases partition all real parameters. No positivity or nonzero
  parameter convention absent from the prose is assumed.
- `846.b`: Original formula requires R != 0, even if h = 0.
  Only on that domain can it be expanded to d^2 = 2Rh + h^2.
  Complete classification for real fixed d,h:
  1. If h != 0 and d^2 != h^2, the UNIQUE allowed solution is
     R = (d^2-h^2)/(2h), and it is nonzero.
  2. If h != 0 and d^2 = h^2 (d=h or d=-h), the rearranged candidate
     R=0 is excluded, so there is NO solution.
  3. If h=0 and d=0, every real R != 0 is a solution.
  4. If h=0 and d!=0, there is NO solution.
  No physical R>0, h>=0, or d>=0 constraint is supplied. Adding it would
  change the problem; it is not silently substituted for the full real answer.

## 847: Complete Real Solution Sets (6 Tasks)

- `847.a`: x(x-27)=0 -> x in {0,27}; do not divide away the zero root.
- `847.b`: y(3y-7)=0 -> y in {0,7/3}.
- `847.c`: (4y-1)(4y+1)=0 -> y in {-1/4,1/4}.
- `847.d`: 4x^2+1 >= 1 for real x -> NO real solution.
  A complex answer would change the explicitly recorded real setting.
- `847.e`: x^2=5 -> x in {-sqrt(5),sqrt(5)}.
- `847.f`: x^2=0.9/3=0.3=3/10 ->
  x in {-sqrt(30)/10,sqrt(30)/10}; both signs are required.

## 848: Match Every Line in Raw Figure 56 (3 Tasks)

The original PNG was opened once at original detail in full. The labels a,b,c,
both axes, top/right/bottom boundaries, and every line were visible. No source
fidelity reapproval is attempted. Final SVG display was unsuccessful, so these
are explicitly observations of the original PNG, not final rendered pixels.

- `848.a`: y=1.5x+2 corresponds to line a, the steep rising line.
  It crosses the y-axis at 2 and passes (2,5); slope (5-2)/(2-0)=3/2.
- `848.b`: y=-2x+2 corresponds to line b, the steep falling line.
  It shares y-intercept 2 with a and crosses the x-axis at 1.
  Slope (0-2)/(1-0)=-2.
- `848.c`: y=-x/4-3 corresponds to line c, the shallow falling line.
  Its y-intercept is -3; moving right by 4 lowers y by 1,
  for example from (0,-3) to (4,-4).
  The c label belongs to this shallow line on the left, not either steep line.

## 849: Derive Both Equations From Raw Figure 57 (2 Tasks)

The original PNG was opened once at original detail in full. Two labelled lines
a,b are visible. The rightmost x=10 label, continuation of a farther right,
the bottom of steep b, both axes, the unit grid and boundaries were seen.

- `849.a`: Line a rises gently, with coordinates (0,-2), (5,-1), (10,0).
  Slope (0-(-2))/(10-0)=1/5, intercept -2.
  Equation y=x/5-2.
- `849.b`: Line b falls steeply, through (0,1), (1,-1), (2,-3).
  Its x-axis crossing is at x=1/2, not x=1; its y-intercept is 1,
  not the figure-56 intercept 2.
  Slope (-3-1)/(2-0)=-2. Equation y=-2x+1.

No equation was read from a figure spec, stored review, answer author, or key.
The final SVG association and full-view visibility remain unobserved; the parent
must not treat these raw-PNG observations as a final-SVG visual receipt.

## 850: Extrema, Attainment and Real Domains (6 Tasks)

- `850.a1`: x^2+1 has real domain R and range [1,infinity).
  Minimum 1, attained EXACTLY at x=0.
- `850.a2`: x^2-5 has real domain R and range [-5,infinity).
  Minimum -5, attained EXACTLY at x=0.
- `850.a3`: sqrt(x) has real domain [0,infinity) and the same range.
  Minimum 0, attained EXACTLY at x=0; negative x is not admissible.
- `850.b1`: -(x+4)^2 has real domain R and range (-infinity,0].
  Maximum 0, attained EXACTLY at x=-4, not x=4.
- `850.b2`: 10/(sqrt(x)+2) has real domain [0,infinity).
  Denominator >=2, so maximum 5, attained EXACTLY at x=0.
  Range (0,5]. Infimum 0 as x tends to infinity is NOT attained,
  and is not a minimum.
- `850.b3`: 1/(x^2+7) has real domain R; denominator >=7.
  Maximum 1/7, attained EXACTLY at x=0.
  Range (0,1/7]. Infimum 0 as |x| tends to infinity is NOT attained.

## Coverage and Stop

Task counts in source-number order:
834:6, 835:6, 836:6, 837:8, 838:9, 839:6, 840:4, 841:6,
842:2, 843:6, 844:1, 845:1, 846:2, 847:6, 848:3, 849:2, 850:6.
Total 80, including 5 graph tasks and 6 attained-extremum tasks.

All 80 exact mathematical tasks are independently solved from source prose/raw
pixels. There are 12 recorded table obligations; 11 have complete direct main
cell support, and 843.b has a disclosed optional three-cell computation rather
than an invented direct sqrt(10) table entry.

Outstanding Stage1 requirements:
1. Actual complete CURRENT final SVG pixel observations for BOTH fig56 and fig57.
   The first-party image tool rejected SVG; in-app browser was unavailable;
   Chrome refused the local file URL by policy. No workaround or rerender.
2. A literal source-only sqrt(10) main cell, if the parent requires the direct
   lookup of the simplest rationalized 843.b expression. Alternatively the
   parent must explicitly accept the separately derived three-cell table route
   and its precision limitations. Neither decision is guessed here.
3. The initial non-rule read exposure must not be erased from the receipt.

STOP. Stage2 visible-question review has NOT begun and requires direct parent
authorization after the required Stage1 evidence is complete. Stage3 canonical
key/author comparison requires a separate later authorization.
No semantic approval, publication, promotion, finalizer, app, database,
dependency install, paid call, network source request or commit is authorized
or performed.
