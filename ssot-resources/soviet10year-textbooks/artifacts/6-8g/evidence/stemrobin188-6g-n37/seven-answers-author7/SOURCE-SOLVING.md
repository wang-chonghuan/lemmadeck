# N37 Seven Figure-Free Answers: Independent Source Solving

Role: AUTHOR ONLY. This document records independent mathematical derivation
before any candidate answer standard is written. It is not independent review,
source approval, modern-prompt approval, a native-finalizer result, or publication.

## Authorization and bindings

- Sole command cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
- Sole owned output directory: `.intentfold/tickets/STEMROBIN-188/tmp/n37-seven-answers-author7`.
- Book: `6-8g`; lesson: `geo68-c3-s2-n37`; delivery: offline, finish review.
- Authorized exercises, in source order: `480, 481, 482, 483, 484, 485, 487`.
- Every answer must be `source="derived"`, `grading="ungraded"`, `parts=[]`.
  Display is read-only; no input, interaction, keyboard, judging, or automatic grading.
- No source, canonical, runtime, DB, environment, dependency, app, Git, worktree,
  other-chat, or peer operations are authorized.

Source directory P:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188/ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n37/preparation7/artifacts/6-8g/lessons/geo68-c3-s2-n37`.

| Bound file | SHA-256 |
| --- | --- |
| `P/lesson.json` | `d6f9fa5d20e0af46340c1aa39631db1d2281c8ca3e1ca1654564aef4c7fb8f6d` |
| `P/exercises.json` | `e168b2951fdd627bd5eb3808e6aa8a50a694d9534a5b09fe76b294a2bd911bd1` |
| `preparation7/manifest.json` | `67246ca726e8755448ca6a805c459327aafd20884da3d51a8db3b13fb8326351` |
| `.claude/skills/ld-s10y-answer/tools/lesson_answers.py` | `30b7ba6be1397b2e005b8f9b3a682ca5ff9b680d6c77af9c1d06cedbef70d9e2` |

The first two files are the only mathematical source inputs. The manifest was
read for preparation provenance/counts/boundaries, not as an answer source.
The answer tool was read only for the native answer document/field contract;
it was not executed, and no existing answer data were read.

The prepared lesson has 6 prose entries: 4 mathematical text paragraphs, one
figure reference, and one caption. It has 9 exercises, numbered 479 through 487,
and figure references 229, 230, 231. The seven authorized exercises have empty
`figure_refs` and `figures`. Zero images were opened or loaded. Reading the native
exercise source list did not involve reading or deriving standards for 479/486.
Those two are excluded, with no placeholder answer; their answers remain deferred
until the parent's modern figures 230/231 are approved.

## Complete-prose foundation

All four text paragraphs in `lesson.json` were read before solving:

1. `p0171#14,p0172#1,p0172#4`: translating O to O1 carries both rays into
   the rays at O1 with the same respective directions. The two convex angles
   consequently have equal measures.
2. `p0172#5`: the measure is independent of the chosen common starting point;
   a direction with itself has measure 0 degrees.
3. `p0172#6`: corresponding same-direction sides give congruent convex angles.
4. `p0172#7`: the direction angle is a measure, not a particular drawn figure,
   and means the convex rather than reflex angle of common-origin rays.

For calculations below write d(a,b) for this convex direction measure, between
0 and 180 degrees. Opposite directions have measure 180 degrees: after
transport to one origin their rays form a straight angle. For a strict convex
angle the usual interior range is 0 < alpha < 180; 0/180 are also recorded as
direction-measure boundaries, without redefining the source's terminology.
Every defined ray has distinct origin and defining endpoint. A construction
must never use a zero-length vector to choose a ray.

The following elementary derivations will be used explicitly, not assumed from
an answer key:

- Transport both directions to one origin, justified by the four source paragraphs.
- Reversing both rays is the half-turn x -> -x about that origin. Distances are
  preserved since |(-x)-(-y)|=|x-y|, so the convex angle is congruent.
- Reversing only b gives b and -b as opposite rays. The straight half-plane
  containing a is partitioned by a into convex sectors (b,a) and (a,-b).
  Thus d(a,b)+d(a,-b)=180. Boundary pairs are 0/180 or 180/0.
- A simultaneous quarter-turn adds 90 degrees to both direction bearings;
  their bearing difference modulo 360 is unchanged. The smaller of the two
  sector measures is therefore unchanged.

## 480: two placements, each with same and opposite directions

Exact source:
> 480. 已知角 $AOB$. 作一个角，它的两条边与角 $AOB$ 的两个边方向相同(或方向相反)，而它的顶点是已知的点 $M$:1) $M$ 在角 $AOB$ 的一条边上；2) $M$ 不在角 $AOB$ 的一条边上.

Source reference: `p0173#5`. No figure is referenced.

Construction rule: through M use a supporting line parallel to each original
side's supporting line. If M already lies on that supporting line, use the
line itself; do not demand a distinct parallel through a point on it.
Choose one ray at M on each line with the prescribed original direction.
Choose their two opposite rays for the both-reversed version.

1) If M lies on OA, use line OA for the first support and the support through M
parallel to OB for the other. If M lies on OB, exchange the roles. If M=O,
both original supports can be reused. Even when M lies beyond A, "same direction
as OA" does not mean ray MA; the direction is prescribed independently of the
location of A relative to M. This gives both required versions.

2) Apply the same per-side rule at M. If M lies on neither supporting line, draw
both parallels; if it lies on one supporting line or its backward extension,
reuse that line and draw the other parallel. These cases cover the literal
source statement without changing "不在……一条边上" into an assertion that M
lies on neither side.

Let alpha be the original convex direction measure. Translating O to M proves
the same-direction construction has measure alpha. A half-turn about M carries
both selected rays to their opposite rays and preserves distances, proving
the both-reversed construction also has measure alpha. No only-one-reversed
construction is substituted for the requested both-reversed construction.
The construction also works for coincident/opposite directions, where the
direction measure is respectively 0/180 degrees. Auxiliary points, if used
to name the new rays, must be distinct from M.

## 481: two direction measures with strict betweenness

Exact source:
> 481. 点 $B$ 在点 $A$ 和 $C$ 之间. 求出下列射线两方向之间的夹角：1) $[AB)$ 和 $[BC)$；2) $[AB)$ 和 $[CB)$.

Source reference: `p0173#6`. No figure is referenced.

Strict betweenness gives three distinct collinear points in order A,B,C.
Take their line coordinate with A=0, B=b, C=c, where 0<b<c.

1) AB has positive coordinate change b, and BC has positive change c-b.
They point in the same direction. Transporting their origins together makes
the rays coincide, so the answer is 0 degrees.
2) CB has negative change b-c, whereas AB has positive change b. They are
opposite directions. Transporting their origins together gives opposite rays,
so the answer is 180 degrees.

No angle at the original distinct ray origins is used as if they shared an
origin. Coincident A/B/C are not added to a strict-betweenness source.

## 482: arbitrary-origin construction and boundary cases

Exact source:
> 482. 作射线 $AB$ 和射线 $CD$，并作一个角，它的顶点在已知点$M$，它的大小等于这两条射线方向之间的夹角.

Source reference: `p0173#7`. No figure is referenced.

Draw the rays AB and CD with A != B and C != D. At M choose a ray along the
line through M parallel to AB's support, pointing from A toward B, and another
along the line through M parallel to CD's support, pointing from C toward D.
Reuse an existing support when M lies on it. This is a construction, not merely
an instruction to calculate the original rays' angle.

The selected rays at M have exactly the two given directions. By the complete
prose's common-origin definition, their convex angle has the desired measure.
If AB and CD have the same direction the selected rays coincide and the measure
is 0 degrees. If their directions are opposite, the selected rays are opposite
and the measure is 180 degrees. Otherwise choose the convex sector, not its
360-degree reflex complement. No position of M relative to the original rays
is required.

## 483: both corresponding sides reversed

Exact source:
> 483. 求证：如果两个凸角的边方向相反，这两个角合同.

Source reference: `p0173#8`. No figure is referenced.

Pair the corresponding sides as a with -a and b with -b; this means BOTH pairs
are opposite, not just one pair. Transport the second vertex to the first.
The half-turn about the common vertex takes every vector x to -x and maps the
first convex sector and both bounding rays to the second. For any two points
x,y, their new distance is |(-x)-(-y)|=|x-y|. The map preserves the entire
angle, proving congruence and equal measure alpha. Direction boundaries 0/180
are unchanged by simultaneous reversal; strict convex angles stay strict convex.

## 484: exactly one corresponding side reversed

Exact source:
> 484. 已知两个凸角的两条边方向相同，另两条边方向相反.求证：这两个角大小的和等于 $180^\circ$.

Source reference: `p0173#9`. No figure is referenced.

After transporting the vertices together and naming the common same-direction
side a, name the remaining sides b and -b. The line consisting of b and -b
forms a straight angle. In the half-plane of that line containing a, ray a
partitions the straight angle into the two convex angles bounded by (b,a) and
(a,-b). Additivity of these adjacent sectors gives alpha+beta=180 degrees.
This is the actual supplement derivation; it does not substitute the
both-reversed result. For strict convex angles 0<alpha<180 and beta=180-alpha.
If directional boundary cases are considered, alpha=0 gives beta=180 and
alpha=180 gives beta=0. In the right-angle case both are 90.

## 485: all three named compass pairs

Exact source:
> 485. 下列方向之间的夹角的大小等于多少度？1) 南方和西方；2) 南方和北方；3) 东方和东南方.

Source reference: `p0173#10`. No figure is referenced.

Use the compass direction definitions, not any unstated pictured bearings.
North/south and east/west are two perpendicular opposite-direction pairs;
the four cardinal intervals equally divide the full 360-degree turn.
Southeast is the bisector between east and south.

1) South to west is one cardinal interval: 360/4=90 degrees.
2) South and north are opposite directions: 2*90=180 degrees.
3) East to southeast is half the east-to-south right angle: 90/2=45 degrees.
All values are convex measures, not clockwise travel or reflex sectors.

## 487: both acute or both obtuse; all perpendicular choices

Exact source, including the uninterpreted printed asterisk:
> 487* 求证：如果两个锐角(或钝角)的边彼此垂直，那么这两个角合同.

Source reference: `p0173#12`. No figure is referenced. The asterisk's printing
role is UNKNOWN; no difficulty, footnote, interaction, or numbering role is assigned.

Let the first angle have sides a,b and measure alpha. The assumption is either
both angles acute (0<alpha,beta<90) or both obtuse (90<alpha,beta<180).
It is NOT sufficient to allow one acute angle and one obtuse angle.
Translate the second vertex to the first and pair its sides c,d with a,b,
where c perpendicular a and d perpendicular b.

Let a*,b* be the respective 90-degree counterclockwise rotations of a,b. A
simultaneous quarter-turn leaves their direction difference unchanged, so
d(a*,b*)=alpha. Each perpendicular ray has exactly two direction choices:
c=a* or -a*, and d=b* or -b*.

| Choice of c,d | Convex measure beta | Actual derivation |
| --- | --- | --- |
| a*, b* | alpha | Both rays have the quarter-turned first angle's directions. |
| -a*, -b* | alpha | Half-turn both rays; |(-x)-(-y)|=|x-y|. |
| a*, -b* | 180-alpha | b* and -b* form a straight angle partitioned by a*. |
| -a*, b* | 180-alpha | a* and -a* form a straight angle partitioned by b*. |

For the mixed choices the convex supplement follows from the half-plane
partition proved for 484, irrespective of which side is reversed.
Equivalently, with bearings a=0 and b=alpha, the possible perpendicular bearings
are c=90/270 and d=(alpha+90)/(alpha+270) modulo 360. Same quarter-turn signs
give alpha; opposite signs give the smaller sector 180-alpha, explicitly
checking the wrap-around cases.

If both angles are acute, 180-alpha is obtuse, excluding both mixed choices.
If both angles are obtuse, 180-alpha is acute, again excluding both mixed
choices. In either authorized case beta=alpha. Translating and possibly taking
a half-turn of the quarter-turned first angle gives an isometry onto the second
convex angle, so the equal angles are congruent.

Necessity check outside the source's permitted cases: bearings a=0,b=30,c=90,
d=300 give pairwise perpendicular corresponding sides, but the convex angles
are 30 and 150 degrees. Thus the acute/obtuse matching condition cannot be
omitted. At alpha=90, both alpha and 180-alpha equal 90; right angles are outside
the printed acute/obtuse premise, although the equality also holds there.
Zero/straight angles are not acute or obtuse and are not used in this proof.

## Unknowns, failures, and handoff boundary

- Original-glyph identity: UNKNOWN; no original scan or glyph conclusion.
- Original alphabet identity: UNKNOWN; preserve the bound source text as text.
- C speck: UNKNOWN; no visual examination or correction.
- Exercise 487 asterisk printing role: UNKNOWN; preserve `487*` literally.
- The manifest's N36 source167 caption/count/glyph HOLD and source174
  post-heading token/role disagreement remain unchanged and out of scope.
  No N36 lesson or source174/N38 content was opened or used.
- Preparation status is `PREPARED_NOT_APPROVED`. Manifest warnings about the
  two unassembled ancestor sections are preserved provenance, not new failures
  or evidence of approval here.
- Author-stage execution failures observed so far: 0.
- Author-stage content failures observed so far: 0.
- Images loaded/opened/generated: 0/0/0. Paid model calls: 0.
- Native prepare/finalize/render calls, DB calls, source/canonical writes,
  runtime/app changes, installs, Git/worktree/chat/peer operations: all 0.
- Eleven source response units are covered: 480 has 2, 481 has 2, 482 has 1,
  483 has 1, 484 has 1, 485 has 3, 487 has 1. Seven of these are explicitly
  numbered subparts; four are unnumbered single tasks. The 487 task includes
  separate acute and obtuse cases and all four perpendicular-direction choices.
- Seven independent derivations completed; independent approvals: 0.
- Modern prompt bindings remain pending parent finalization. The native
  whole-lesson checker requires all nine answers; this intentionally scoped
  seven-answer candidate is not a whole-lesson finalization.

Seal procedure: write this file first, chmod it to 0444, verify its mode and
SHA-256, then write the candidate document. Do not modify the seal afterward.
