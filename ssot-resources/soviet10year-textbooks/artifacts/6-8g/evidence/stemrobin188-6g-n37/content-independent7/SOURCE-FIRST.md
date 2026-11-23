# STEMROBIN-188 N37 - FIRST independent content/mathematics freeze

Freeze identity: FIRST. Recorded on 2026-11-23, after the three permitted
original figures were read and before any candidate was disclosed or inspected.
This is an offline independent mathematical baseline, not a production answer
file, source-transcription rereview, crop review, or final semantic approval.

## Scope and exact inputs

The only command cwd is
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188` (W).
The only owned output directory is
`W/.intentfold/tickets/STEMROBIN-188/tmp/n37-content-independent7`.

Let S be the following exact absolute input root:

`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188/ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n37/preparation7/artifacts/6-8g`

Complete raw text read, once per file:

- `S/lessons/geo68-c3-s2-n37/lesson.json`
  SHA-256 `d6f9fa5d20e0af46340c1aa39631db1d2281c8ca3e1ca1654564aef4c7fb8f6d`
- `S/lessons/geo68-c3-s2-n37/exercises.json`
  SHA-256 `e168b2951fdd627bd5eb3808e6aa8a50a694d9534a5b09fe76b294a2bd911bd1`

Actual original PNGs opened, once each, in this order:

- `S/figures/fig-229.png`
  SHA-256 `d12430595d34eddd92ad4f9aa3d8036549397e98460929fe4ccd3fb02002fa3c`
- `S/figures/fig-230.png`
  SHA-256 `c15026fd061594260867f8ce83a2fc33a0ba8de472ebda87b34e57569870d27f`
- `S/figures/fig-231.png`
  SHA-256 `e8e8b389d51b21ddab9d8b53b3f560a05b69931e406ef8deead5b5789da04dba`

Counters: one image batch, 3/8; current-context image loads, 3/24; three
distinct originals; zero reopens, derived crops, page opens, modern images,
candidate reads, old answer/choice/config reads, or standard-answer reads.
No browser, renderer, native producer, prepare/finalize, app, environment,
DB, install, Git, worktree, chat/peer, or paid model call was used.
Only these two review files are authored.

Read procedural instructions: lesson SKILL.md, production-resume.md,
ld-s10y-image's Image batches and ownership boundaries, answer SKILL.md and
its cap1/cap2/cap3 boundaries, repository session/engineering routing, and
the intentfold routing skill. No IntentFold capability was invoked.

The supplied preparation provenance is reused, not reverified:
native source-scoped assemble and adapt-prepare each first exited 0;
six prose entries, four text entries, nine exercises 479-487;
selected source range `[p0171#13,p0174#1)`;
new page 173 source status PASS_WITH_EXPLICIT_UNKNOWNS;
native crops 230 and 231 PASS;
retained source observations/repairs for 171 and 172 and crop 229 PASS.
These are caller-reported source/crop approvals, not task-math approvals.
No original page, source-review report, or native receipt was reopened.

## Pixel observations needed for this mathematics

The following letter names are notation aliases for visible glyph shapes and
the raw task references. Their exact glyph/codepoint/alphabet identity stays
UNKNOWN. They were not inferred from figure metadata. No angle was measured
from the scan; apparent slopes and lengths are not additional given data.

### Figure 229

There are two angle vertices: an O-shaped label at the lower vertex and an
O-shaped label with a subscript-shaped 1 at the upper-left vertex. At each,
one branch goes up-right to an A-shaped label and the other goes slightly
down-right to a B-shaped label; the upper pair has subscript-shaped 1 labels.
Both convex sectors have a single arc. A slanted segment joins the vertices.
There is no printed degree value or equal-length marking.

The picture supplies the paired ray positions for the prose. Equality of
direction is given by the prose, not certified by measuring scanned slopes.
The connecting segment is not a third side of either discussed angle.
In particular, the picture does NOT establish that the chosen labeled A
and B points are themselves mapped to the chosen A1 and B1 points.

### Figure 230

Two left-right lines are crossed by one rising-right transversal. On the
upper line the visible glyph order is A, P, B; on the lower it is C, Q, D.
Along the transversal the spatial order is M below Q, then P, then N above P.
Thus PA and QC point left, PB and QD right, PN and QN up-right, and PQ/PM
and QM down-left. The task, not approximate image geometry, supplies the
parallel-line premise.

No numeric angle is printed. Any small C-adjacent mark remains UNKNOWN:
it is not a named point, extra ray, prime, degree mark, or new condition.

### Figure 231

The upper left-right line has A left, B at its intersection, C right.
The lower has F left, D at its intersection, E right. A descending-right
transversal runs from the R-shaped upper-left label through B and D toward
a P-shaped lower-right terminal label. The alpha-shaped label and its arc
are in the sector between the rightward upper ray BC and the descending
ray BD. Hence the marked convex angle is CBD.

The premise `(AC) parallel (FE)` is supplied by task 486. Together with
these actual incidences it gives BC/DE the same direction, BA/DF the
opposite direction to them, BR/DR the same up-left direction, and BD/DP
the opposite down-right direction. The C-adjacent speck's role remains
UNKNOWN and supplies no additional object or condition.

## Prose definition and relationship checks

All four raw mathematical prose entries were read in full. The figure and
caption entries were also read; the raw total is six entries.

1. **Translation proof and independence of the vertex.**
   For the translation T(x) = x + (O1 - O), every point O + t u on a ray,
   t >= 0, maps to O1 + t u. Thus the ray direction and the convex angle
   measure are preserved. The ray with this origin and direction is unique.
   This proves angle(AOB) = angle(A1O1B1) without assuming equal distances
   OA/O1A1 or OB/O1B1, or that T(A) = A1 and T(B) = B1.
2. **Definition.**
   Two oriented directions determine the non-reflex/convex angular
   separation theta, independent of the chosen common initial point.
   It is a magnitude, not a particular region, and not a clockwise signed
   turn. Equal directions have separation 0 degrees. Opposite directions
   have separation 180 degrees, as required explicitly by 481 and 485.
   The endpoint conventions include the degenerate zero and straight cases.
3. **Same-direction corresponding sides.**
   Translating the vertices to coincide identifies both corresponding
   rays, so the convex angles are congruent. Parallel supporting lines
   alone are insufficient: two parallel rays may point oppositely.
4. **Two regions from the same rays.**
   For an ordinary 0 < theta < 180 degree separation the other region
   is reflex, 360 - theta, not the chosen direction-angle magnitude.
   The common-origin requirement concerns the rays used to draw an angle;
   arbitrary original ray origins are handled by direction-preserving
   translation. One must not connect their endpoints and use that new angle.

Definition counterchecks: east/east gives 0, east/west gives 180, and
east/north gives 90, not the reflex 270. Two 30-degree and 330-degree
regions have the same boundary rays but are not congruent; dropping
the convex/non-reflex qualification changes the claim.

## Independent solutions of every new written task

These are frozen derivations for later comparison, not authored final answers.
Any construction or counterexample labels below are expressly auxiliary;
they are not inferred unprinted source points or conditions.

### 479 - all four same-direction pairs

The actual figure gives exactly four elementary sector correspondences
between P and Q:

1. angle(APN) and angle(CQN): left / up-right.
2. angle(NPB) and angle(NQD): up-right / right.
3. angle(BPQ) and angle(DQM): right / down-left.
4. angle(QPA) and angle(MQC): down-left / left.

At Q, QN can equally be written QP; at P, PQ can equally be written PM.
These are aliases on the printed transversal, not extra points.
Each pair is congruent by the prose's same-direction theorem.
Other equal-angle pairs are not interchangeable with this requested list:
vertical or alternate-interior equalities can have both corresponding rays
opposite, rather than the same direction. Numerical degree values are not given.

### 480 - both locations, both requested direction variants

Write u and v for the directions of OA and OB.

1. **M on a side, same directions:** through M take the ray with direction
   u and the ray with direction v. The support of the side containing M
   is reused; construct the parallel support of the other if needed.
2. **M on a side, both opposite directions:** on those supports take
   directions -u and -v instead.
3. **M not on a side, same directions:** through M construct the supports
   parallel to OA and OB, or reuse any coincident support, and choose
   half-rays u and v.
4. **M not on a side, both opposite directions:** choose half-rays
   -u and -v on the same supports.

The same-direction angle has the original convex magnitude theta; reversing
both directions also preserves theta (proved in 483). M = O, or M on a
supporting line but outside the original ray, requires no new premise.
Merely saying "draw parallels" omits the essential half-ray choices.

Boundary/countercheck: with auxiliary O=(0,0), A=(1,0), M=(2,0), the ray
MA points west although OA points east. Therefore using the existing
named point A indiscriminately fails the same-direction construction.
The wording "M not on one side" is positionally ambiguous (neither side
versus at least one side); the construction works for every M, so this
does not prevent solving either printed case. Its exact wording is not repaired.

### 481 - both separations

B strictly between A and C implies distinct collinear points in the order
A-B-C. Vectors B-A and C-B are positive multiples of the same direction.

1. `[AB)` and `[BC)`: 0 degrees.
2. `[AB)` and `[CB)`: 180 degrees, since B-C reverses the first direction.

Their different starting points do not change the direction-angle definition.
For example A=0, B=1, C=2 on an auxiliary coordinate line gives east/east
and east/west, respectively. No triangle angle at different origins is used.

### 482 - construction at M

Draw the two requested rays AB and CD. Through M construct a ray in the
direction of AB and a ray in the direction of CD. Use their convex sector
as the constructed angle. It equals the two original ray-direction
separation by the definition and translation proof.

No numerical value or particular placement of M is specified or needed.
If supports coincide, reuse them and still choose the correct directions.
Identical directions give the limiting 0-degree angle; opposite directions
give the straight 180-degree angle. The text supplies no nonparallel restriction.
Choosing the wrong half of a support can change theta to 180 - theta.

### 483 - both pairs opposite

Let the first convex angle have directions u,v and magnitude theta.
The second has corresponding directions -u,-v. A half-turn at the first
vertex sends its rays to -u,-v and preserves its angle. Translate that
vertex to the second vertex to identify the resulting rays with the second
angle. Therefore the two convex angles are congruent.

Independent check: (-u) dot (-v) = u dot v for unit directions, so their
non-reflex angle magnitudes agree. Reversing just one ray is not this
hypothesis: an auxiliary 60-degree angle would become 120 degrees.
"Opposite" concerns corresponding sides of the two angles, not a demand
that each individual angle be straight.

### 484 - one pair same, one pair opposite

Translate to a common vertex. Write the first pair u,v and the second
u,-v after choosing the matching same-direction side as u. The rays
v and -v are opposite, so the two convex sectors share u and together
form a straight angle. Their measures theta and 180 - theta sum to
180 degrees. The result is the same if the other corresponding pair
is the one reversed.

Check at theta=60: the second measure is 120, not 60. Reversing neither
ray, or both rays, would instead give theta again and does not imply
the required sum except incidentally when theta=90. The endpoint
theta=0/180 cases also satisfy the supplementary formula.

### 485 - all three compass pairs

Using compass directions as rays, not travel displacements:

1. south / west: 90 degrees.
2. south / north: 180 degrees.
3. east / southeast: 45 degrees.

An auxiliary heading convention east=0, north=90, west=180, south=270,
southeast=315 verifies the smaller separations 90, 180, 45.
Southeast bisects east/south; using the reflex 315-degree turn for the
last pair would violate the prose definition.

### 486 - actual figure, part 1 and all four part-2 items

Let alpha be the marked angle CBD, not a degree value estimated from the scan.

**1. All elementary convex angles equal to alpha:**

- angle(CBD), the marked angle (CBP is the same sector).
- angle(ABR), its vertical angle: both corresponding directions reversed.
- angle(EDP), the lower right/down-right corresponding sector.
- angle(FDR), the lower left/up-left vertical/corresponding sector.

P in EDP denotes the visible lower terminal P-shaped glyph, without resolving
its alphabet. Equivalently, that sector is between DE and the printed
down-right continuation of BD through D; it does not need an invented point.
The remaining four elementary sectors are ABD, RBC, BDE and FDP,
and each is 180 - alpha. Straight angles ABC, FDE and RBD are not the
marked sector. The picture shows an acute marked sector but provides no
calibrated numerical alpha. The four listed alpha equalities are guaranteed
by the premises; if alpha were 90 degrees, the four supplementary sectors
would also equal alpha. No right-angle premise is printed, so one must not
assert that special equality or infer a numerical value.

**2. Requested direction separations, in the raw printed order:**

- first item, BC / DE: 0 degrees (both rightward).
- second item, BC / DF: 180 degrees (rightward / leftward).
- third item, BA / DR: alpha (leftward / up-left; both reversed relative
  to BC / BD).
- fourth item, BR / DE: 180 - alpha (up-left / rightward; only one
  direction reversed relative to BD / BC).

Checks: an auxiliary alpha=40-degree model would yield 0, 180, 40, 140,
but 40 is not source data and is not an answer to this diagram.
BR and DR are the same direction; DB is opposite to DR. Replacing
DR by DB would therefore incorrectly swap alpha and its supplement.

### 487 - same-type hypothesis is essential

The star is retained as a literal source mark; its semantic role is UNKNOWN.
Pair the corresponding sides as perpendicular. If the first angle has
directions u,v with non-reflex magnitude theta, a perpendicular to u is
either its +90-degree or -90-degree rotation, and likewise for v.
When the two rotations have the same sign, the second magnitude is theta.
When their signs differ, exactly one of these rotated directions is
reversed, so 484 gives the second magnitude 180 - theta.

If both angles are acute, the supplementary alternative is obtuse and is
excluded. If both are obtuse, the supplementary alternative is acute and
is excluded. In either stated case the magnitudes must be equal, hence
the angles are congruent. A right/right case would also be equal, but
is not a replacement for the two explicitly stated cases.

Concrete counterexample to dropping the same-type qualification: take
auxiliary first headings 0 and 30 degrees and second headings 90 and
300 degrees. Each corresponding pair is perpendicular, but the first
convex angle is 30 degrees and the second is 150 degrees. Thus "any two
angles with perpendicular corresponding sides are congruent" is false.
The 487 mark cannot supply an extra mathematical premise.

## Findings, unknowns, and later-use boundary

Coverage: nine of nine tasks; 17 printed terminal requests; the two printed
location cases of 480 are additionally expanded into all four constructions
for the same-direction/both-opposite alternatives. The raw four prose
texts and both non-text entries are accounted for.

No essential mathematical underdetermination was found for the requested
symbolic, construction, and proof responses. No numerical alpha is determined
for 486, nor are numeric angles required in 479. That is not permission to
measure pixels, assume a convenient angle, or add a missing condition.
The nonessential 480 location-wording ambiguity is explicitly preserved.

Explicit UNKNOWNs:

- Exact glyph identity/codepoints and Latin/Cyrillic/other alphabet identity
  of visible point/subpart labels. Naming aliases do not resolve these.
- Semantic role of C-adjacent speck(s); no point, prime, angle mark, or
  mathematical condition is inferred.
- Semantic role of the literal 487 star; not inferred to mean difficulty,
  grading, multiplication, a footnote, or an extra hypothesis.

N36 caption HOLD and page 174 post-N38 source disputes are outside scope.
No source repair, typography normalization, source-transcription approval,
crop/native approval, or old-choice solving is performed here.

Every eventual written answer must remain derived, ungraded, read-only,
with parts=[]; this applies to all nine tasks. No grading, keyboard, answer
finalization, production answer-key authoring, or final semantic approval
is authorized at this stage.

Candidate exposure before FIRST: none. Comparison of modern text and the
seven figure-free standards (480,481,482,483,484,485,487), and later diagram
answer comparison (479,486), are all pending. Reuse this FIRST baseline
and these exact source hashes for those comparisons; do not reopen these
original images merely because the comparison stage starts.

The accompanying source-review.json contains the machine-readable version
of this independent baseline. Both files are sealed 0444 after authoring.
