# FIRST: independent source solving and pixel inventory

Reviewer scope: SAME188-6 / STEMROBIN-188 / N32, offline, sole new independent
reviewer. Created before any modern figure, spec, template, key or author report
was read. This entire file is to remain unchanged after its sequential 0444
chmod, stat and SHA receipt. No product or canonical approval is implied.

## Bound source evidence actually read

- source-only.json:
  /Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n32-integrated-independent-inputs-10/source-only.json
  SHA256 3acbfd12a5e8136309c90bb6edc54c5c0bdae1a77e6e41668abb6fd2741c5363.
  Its NOT_DISPATCHED / package-not-prepared fields are historical per the direct
  human instruction, not permission to inspect other roots.
- Entire raw lesson.json:
  /Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n32-draft-first-10/artifacts/6-8g/lessons/geo68-c3-s1-n32/lesson.json
  SHA256 acc7868d23f46e6a6f74ab194145a0fc86b21064e38df2d326127afd63821279.
- Entire raw exercises.json, exactly 432 through 440, including all ten 438
  subparts and its footnote:
  /Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n32-draft-first-10/artifacts/6-8g/lessons/geo68-c3-s1-n32/exercises.json
  SHA256 2454f9398c397ac5d39363fc8ce8ea81d7c3d206142a95853e0c8f972b464a8e.
- Original207 PNG, actually opened once:
  /Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-207.png
  SHA256 8720742d9778ca1b7d55a7271c27493b2a147fc9045268a1fce975f57e975835.
- Original208 PNG, actually opened once:
  /Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-208.png
  SHA256 a87ef68e5938055d0d8c87753b319b64fa0cb4c19209c72135cdee15581eadfa.

Required guidance read: project readme/project/product/engineering/operations;
intentfold routing (no capability execution); lesson/image/answer SKILLs;
answer gate2, image quality gate, production-resume. Direct OFFLINE assignment
overrides normal live-ticket/publish/app instructions. No network, DB, env,
paid calls, dependencies, app, children, Git operation or Charter edits.

## Raw knowledge and boundaries

The card is N32, "parallel axiom", chapter parallelism and translation, section
parallel lines. Raw prose is precisely:

1. Prior existence of at least one parallel through any point; accept without
   proof axiom41, at most one such parallel.
2. Corollary1: a line crossing one of two parallel lines crosses the other;
   contradiction to uniqueness at the first intersection (fig204 excluded).
3. Corollary2: a perpendicular and an oblique to the same line intersect;
   construct another perpendicular, use N31 parallelism of perpendiculars and
   axiom uniqueness (fig205 excluded).
4. Corollary3: two lines parallel to the same line are parallel; otherwise their
   intersection gives two parallels through one point (fig206 excluded).
5. Actual concept switch at raw prose "2": N31 central symmetry implies
   parallelism; converse theorem42 says two parallel lines are centrally
   symmetric. Choose A on a, A1 on b, O the midpoint of AA1. A half-turn maps A
   to A1 and line a to a parallel through A1 by theorem39; axiom uniqueness
   identifies its image with b (fig207).

The lesson uses prior half-turn/isometry properties, theorem39, midpoint and
vertical/linear-pair angle facts. It does NOT state a ready-made corresponding-
angle theorem, alternate-angle theorem, parallelogram side theorem or triangle
angle-sum theorem as a premise. Exercise438 must establish its relationships
using available symmetry, rather than invoke those same relationships to prove
themselves. Exercise440 can use the conclusions established in 438, but needs
an independent symmetry argument for side lengths.

Four occurrences of the operator subscript in p0154#2/#5 are literally
Z_{\text{UNKNOWN}} in the bound raw text. Preserve all four UNKNOWN identities.
Readable point O in fig207 supports the midpoint construction, NOT the
unreadable printing codepoint identities of those four operator subscripts.
Source155 glyph failure and all printing-role UNKNOWN holds remain outside N32
modern-output clearance. No original204206 pictures read, and no inventory or
review is asserted for those pictures. Existing201203/204206/205 holds remain.

The source tasks432/434/435 collectively signal the textbook's inclusive
parallel relation, including a line parallel to itself: "any point" existence
and the reflexivity questions are coherent with that convention. The bound N32
does not reproduce the earlier definition. This is a declared convention
inference, not a claim to have read N31; if the intended definition were strict
disjointness, 432 on-line and 434(1)/435 would require changed answers. Distinct
lines are understood in intersection and nontrivial multi-line cases below.

## Independent complete solutions

### 432

Existence is the prior result explicitly recalled at the opening of N32;
axiom41 gives at most one. Therefore exactly one parallel through any point.
For a point on the given line, under the source's inclusive convention the
given line itself is that unique line. Under a strict definition excluding
coincident lines the printed universal statement would be false, not a proof.

### 433

No. If d were parallel to both intersecting a and b, corollary3 would give
a parallel b, contradicting the stated intersection of distinct lines.
Equivalently at a cap b there would be two different parallels to d.

### 434

1. True under inclusive parallelism: a is parallel to itself.
2. True: the relation does not change when its two lines are exchanged.
3. True: corollary3 (including a coincident-line degeneracy).
4. False: two distinct perpendiculars to b are parallel, not perpendicular.
   Counterexample b: y=0, a: x=0, c: x=1.
5. False: take a: y=0, c: y=1 and b: x=0; b crosses each but a,c do not cross.

### 435

All three: reflexive by the inclusive convention, symmetric by the definition,
transitive by corollary3. Do not silently switch to strict parallelism, whose
reflexivity and unrestricted transitivity would fail.

### 436

a and c intersect by corollary1. If they did not, at the point b cap c the
distinct lines b and c would both be parallel to a, violating axiom41.

### 437

Let the acute angle have vertex V and sides actual rays r=V+tu, s=V+tw
(t >= 0), where u,w are unit vectors and 0 < theta < 90 degrees, so
u dot w = cos(theta) > 0. "Perpendicular to a side" needs the perpendicular
line to meet that actual ray, not only its supporting line. Let its foot
P=V+pu, p >= 0. Its equation is (X-V) dot u=p. On the second ray the equation
is t cos(theta)=p, so t=p/cos(theta) >= 0 and there is an actual ray
intersection. If p>0 it lies strictly beyond the vertex; if p=0 it is V.
The opposite order of angle sides is the same argument.

Supporting-line proof: the second supporting line is oblique, not
perpendicular to the first, so corollary2 forces an intersection with the
perpendicular. That alone is NOT enough to locate it on the ray. The
acute-angle/positive-direction argument above supplies the missing premise.
If only supporting-line perpendicularity is asserted and p<0 is permitted,
the supporting lines intersect but the second ray does not; e.g. theta=45
degrees, first ray positive x-axis and perpendicular x=-1. A standard answer
must explicitly handle this distinction and not pass a supporting-line-only
argument as proof of actual ray intersection.

### 438: all ten subparts, independently

Analytic names P (upper a cap c) and Q (lower b cap c) are for this proof only;
they are NOT visible original labels and must not be added to the question.
Let H be the half-turn about midpoint M of PQ. By theorem42's uniqueness
argument, H maps line a to b; since M lies on c, H maps c to itself. It swaps
P and Q and reverses both ray directions. Thus it sends sector1 to sector3,
sector2 to sector4, sector5 to sector8 and sector6 to sector7. Its angle
preservation is a prior central-symmetry fact. This constructs the required
mapping without assuming the angle-equality statements being proved.

At upper P vertical angles give 1=5 and 2=6. At lower Q they give 8=3 and
7=4. Linear pairs at P give 1+2=180 degrees, 1+6=180 degrees, 5+2=180
degrees and 5+6=180 degrees. These are local two-line facts, not a
parallel-angle theorem.

- a) 1=3 directly under H.
- b) 1=8 because H gives 1=3 and vertical angles at Q give 3=8.
- c) 6=7 directly under H.
- d) 3=5 because H gives 3=1 and vertical angles at P give 1=5.
- e) 4=6 because vertical angles at Q give 4=7 and H gives 7=6.
- f) 7=2 because H gives 7=6 and vertical angles at P give 6=2.
- g) 5=8 directly under H.
- h) 2=4 directly under H.
- i) 2+8=180 degrees: local linear pair 2+1=180, replace 1 by 8 from b.
- j) 7+1=180 degrees: local linear pair 2+1=180, replace 2 by 7 from f.

Footnote source content: (1,8) and (7,2) are corresponding-angle examples;
(2,4) and (8,5) are alternate-interior-angle examples for a,b cut by c.
The prose ellipsis after corresponding examples is not an extra subpart.
Inventory verifies those positions. Corresponding positions also include
(6,4) and (5,3), but those unprinted expansions are analysis only, not new
question text. The two supplementary tasks are same-side interior (2,8) and
same-side exterior (7,1), respectively. No future theorem is necessary.

### 439

Use the elementary fact that a half-turn maps a line to a parallel line;
an invariant single line must contain its center. For a finite union, line
images permute its constituent complete lines, since a complete line cannot
be contained in a finite union of other, different lines.

1. Two distinct parallel lines: infinitely many centers, every point on their
   equidistant middle parallel. A half-turn centered there exchanges them;
   conversely the center must bisect their perpendicular separation.
2. Three distinct lines with at least one parallel pair:
   - Exactly two parallel and third transverse: precisely one center, the
     intersection of the third line with the middle parallel of the pair.
     The parallel pair must exchange and the only line with the third
     direction must be fixed, hence contain the center.
   - All three parallel, in transverse-coordinate order h1<h2<h3:
     centers exist iff 2*h2=h1+h3 (equal adjacent spacing).
     Then infinitely many centers, all points of the middle line h2.
     Otherwise zero. Reflection h -> 2*m-h of a three-element height set
     must fix its middle element and swap the outer two.
   This is not automatically "one": the printed "two are parallel" does not
   exclude the all-three-parallel case.
3. Two distinct intersecting lines: exactly one center, their intersection.
   Different directions prohibit swapping the lines; each must be invariant,
   so the center lies on both. Two distinct parallel lines: infinitely many
   on their middle parallel as in (1). If "two lines" can coincide, their
   union is one line, with infinitely many centers on that line.

### 440

Assume the standard nondegenerate quadrilateral in cyclic vertex order with
AB parallel CD and AD parallel BC. Let M be midpoint of AC and H its
half-turn. The image of line AB is a parallel through C, hence line CD by
axiom41; the image of line AD is line CB similarly. Consequently H(B) is
their intersection D. H(A)=C, H(B)=D, so AB=CD=2 cm and BC=DA=4 cm by
isometry. This proves the opposite-side facts without assuming a later
parallelogram theorem.

Half-turn also gives angle A=angle C and angle B=angle D. Along transversal
AB of parallel AD and BC, the internal angles at A and B are supplementary
by the established 438 relationship (or the same half-turn/linear-pair
argument). Thus A=C=30 degrees and B=D=150 degrees. Complete requested
answer: A30, B150, C30, D150; AB2, BC4, CD2, DA4, all lengths in cm.

## Independent original207 pixel inventory

Single subfigure, no grid, axes, angle sectors or arcs.
Two long approximately horizontal black straight lines, upper a, lower b,
distinct and parallel in the construction. A diagonal segment descends right
from A on upper a to A1 on lower b. O is the filled interior midpoint on
that segment. Visible named points: A, O, A1, with three black point marks.
Visible line labels: a near upper right, b near lower right. Point labels:
A above its upper intersection; O below-left of its midpoint; A1 below
its lower intersection. These are the entire five-label inventory.

Two matching single transverse tick strokes: one on AO, one on OA1,
indicating AO=OA1. The strokes cross the connector, not either parallel
line. No arrow, right-angle square, numerical length, coordinate or center
operator is printed. The printed O point is distinct from unresolved text
operator subscripts.

Required relationships: A on a, A1 on b, A/O/A1 collinear, O strictly between
endpoints, AO=OA1, midpoint O of AA1, a parallel b; half-turn about O sends
A to A1 and line a to b. A modern finite framing must support opposite
endpoint pairs for the displayed line representatives if it claims complete
central symmetry; it cannot assert only the A/A1 pair and leave a/b endpoint
geometry unchecked. Artificial endpoint IDs are renderer supports, not source
named points. Every point mapped into an inventory group must have a mapped
multi-point relationship entirely inside that group; counts are insufficient.

## Independent original208 pixel inventory

Single shared frame, no grid, axes or panel split. Lines a (upper) and b
(lower) are parallel, both rising gently right on the image. Transversal c
rises steeply right, crosses a near upper-middle and b near lower-middle.
c extends beyond both crossings, as do a and b in both directions. Visible
line labels a near upper-right end, b near lower-right end, c near top end.
No named point, symmetry center, equality, numerical degree, explanatory
arrow, solution line or measurement is printed. P,Q above are analysis IDs
only, not source labels.

All eight numbered sectors are visible and must remain in these locations:

| Crossing | Sector | Bounding rays (visual directions) | Position | Arc count |
|---|---|---|---|---|
| upper a/c | 1 | a northeast, c northeast (steeper) | upper-right acute | 1 |
| upper a/c | 2 | a northeast, c southwest | lower-right obtuse | 2 |
| upper a/c | 5 | c southwest, a southwest | lower-left acute | 1 |
| upper a/c | 6 | a southwest, c northeast | upper-left obtuse | 2 |
| lower b/c | 8 | b northeast, c northeast (steeper) | upper-right acute | 1 |
| lower b/c | 7 | b northeast, c southwest | lower-right obtuse | 2 |
| lower b/c | 3 | c southwest, b southwest | lower-left acute | 1 |
| lower b/c | 4 | b southwest, c northeast | upper-left obtuse | 2 |

Total: eight sectors, four single-arc acute sectors {1,5,8,3}, four double-arc
obtuse sectors {2,6,7,4}, twelve distinct arc strokes. Arc style is part of
the original, not newly supplied equality proof. Each arc must stay at its
own vertex and inside its actual bounded sector, including its outer
concentric partner for a double arc. Object counts alone cannot prove this.

Top/lower incidence, shared transversal collinearity, parallel a/b,
positive direction alignment and the sector placements give the half-turn
sector pairs (1,3),(2,4),(5,8),(6,7). The center needed for reasoning is
the midpoint of the two crossings, not a source-visible annotation.
Required modern geometry: each crossing lies on its own parallel line and
on the shared c; each line support pair remains collinear with its crossing;
all defining opposite support/intersection pairs must be covered if a
central-symmetry assertion is made. All mapped point assertions must be
wholly inside their declared source inventory groups. No support point
may escape the group to obtain apparent coverage.

## Pre-lock facts

Two charged image attempts, two successful originals, no failures/reopens/crops.
Fresh context image total2/24; charged batch2/8. Modern/native/mobile all
unopened. No draft keys/templates/specs/author outputs read. No active exec
session was created (every command returned a completed exit result).
The FIRST text contains the full independent solving and inventory above;
it is not merely a promise to solve after opening answers.
