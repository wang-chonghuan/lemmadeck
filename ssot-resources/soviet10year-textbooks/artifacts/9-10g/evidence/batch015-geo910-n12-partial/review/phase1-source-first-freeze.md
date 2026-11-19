# STEMROBIN-184 / worker184-3: Phase1 Source-First Freeze

Date: 2026-11-19.
Checkout for every command: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Only owned output directory: `.tmp/s10y-choice/batch015-geo910-n12-independent/`.

**Phase1 is complete. This is an independent affected-source freeze, not an
authoring artifact, question approval, completed semantic gate, or authorization
to start Phase2.** No author keys, new learner views, repair internals, or prior
Stage2/3 were inspected.

## 1. Authority, Chronology, and Finite Scope

Read the current choice SKILL, contract, review order, and production-resume
contract. The direct human instruction limits this continuation to offline
Phase1. The permitted repair seed was read before deriving any question answer;
no options are available or assumed.

Fresh independent derivations are limited to **99(1), 101, and 104(2)**.
For 99(2)/(3), record only genuine unresolved source conventions and conditional
examples demonstrating their relevance; do not guess an unconditional answer.

The permitted immutable source-first record was used only for exact input
binding, actually observed unchanged fig39/41 evidence, and passed context,
including the book-wide inclusive-parallel convention. Its sections 2-4
(lines 26-106) and binding/heading locators were consulted. Its section 5
affected-source solutions were not read or reused as the new derivations.
The current seed's entire file-byte and canonical hashes equal the seed hashes
in that old record.

Under the human's affected-only instruction, previously passed source/question
work for 97, 98, 100(1)/(2), 102, 103(1)/(2), 104(1), 105, and 106 stays reusable.
Unchanged fig39/41 checks stay reusable. No previous pass is rerun or rescinded
by this source freeze, and the rejected package is not converted into a pass.
The existing 99(2)/(3) uncertainty is not relabeled as passed.

Later review may inspect the disclosed changed views for these three affected
units and their actual direct coverage, redundancy, leakage, or convention
dependencies. No unseen question IDs are invented here; that dependency check
does not license a fresh review of the whole unchanged question set.

The initial directory check found the owned independent directory absent.
Creating that directory corrected only the output-location issue; it did not
restart or redo an earlier content stage.

## 2. Exact Input Binding

Machine-readable receipt: `phase1-input-hashes.json` in this directory.
It records SHA-256 of every file read, canonical hashes of the affected exercise
objects and selected definition objects, and separately labeled inherited
trace/figure hashes.

Seed:
`.tmp/s10y-choice/batch015-geo910-n12-repair/seed.json`.

- File-byte SHA-256:
  `b902a808e1fbe32a89e0060b8091f1970c717083b6d40ca3f82616029feedf17`.
- Contract canonical JSON SHA-256:
  `e4a23600dcc57983ae486b56ef88280f79707dbe0b5a0d8ad0f0265f27facdcd`.
- Book `9-10g`, lesson `geo910-c1-s1-n12`.
- Seed contains exercises 97-106, definition blocks 1/9/10/11/12, and concept
  figures `fig-39`/`fig-41`. The exercise objects have no figure IDs.

Immutable binding/context record:
`ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/batch007-n12-choice-rejected/geo910-n12-choice-independent-source-first.md`.
Actual file-byte SHA-256:
`354cdd50c340ad9b0abb02a2839ecdab55b2f6f773940c5e5b29e7acd01cae92`.

The old record reports actual source/asset hash checks. This phase verifies the
seed/record identity and their reported bindings, **not current underlying
canonical-file or image-byte freshness**. None of the four canonical trace
files or any image bytes was read or rehashed. Figure reuse additionally follows
the human's explicit unchanged-figure authorization. Do not represent this as
a new validator run or present-tense visual inspection.

## 3. Reused Actually Observed Figure Context

This is attributed previous observation, not observation by this invocation.

**fig39.** Seed SVG path ends in
`editions/modern-us-neutral/figures/fig-39.svg`; its seed-declared and previously
actually checked SHA-256 is
`e8615612dd24ab32114684e2f61af45a1c11490c98f977fc6a290e5ab9077d6e`.
The old reviewer actually opened the complete 640x480 native PNG,
`.tmp/s10y-image/batch007/9-10g/fig-39/repair/fig-39.native.png`,
SHA-256
`9cf55350129740b997b74a8cdbf172ac758905cbf9d7c59e6d1f5c2a0da12331`.
That reviewer observed A1 and its plane intersection A on l1, a same-direction
reference l intersecting the outlined alpha plane, and the complete labels and
occluded continuation. No right-angle marker or numeric datum was present.
Reuse: pointwise parallel projection, not orthogonal projection.

**fig41.** Seed SVG path ends in
`editions/modern-us-neutral/figures/fig-41.svg`; its seed-declared and previously
actually checked SHA-256 is
`6352060de070f8f32ca8c98250fc82c061cf33fd5625d5b466af995a5081f272`.
The old reviewer actually opened the complete 640x560 native PNG,
`.tmp/s10y-image/batch007/9-10g/fig-41/repair/fig-41.native.png`,
SHA-256
`68cc813bdbc31bc63f4300e4569a326d6af7cf6fe8e020248a311dd4b50f2f96`.
That reviewer observed all corresponding source/shadow hexagon vertices,
centers, common-direction projecting strokes, and right/bottom boundaries,
without perpendicular or equal-length marks.
Reuse: the prose specifies a regular source model; it does not specify a
regular shadow, length preservation, or exclusion of collapse elsewhere.

Neither figure supplies half-plane boundary ownership or an angle's point-set
definition. No new image review, image decoding, ROI, render, or screenshot
occurred. These two concept figures introduce no new individual exercise data.

## 4. Source Model and Definition Scope

Definition block 1 projects every point along a direction transverse to alpha,
and defines the image of a figure as the set of all point images.
Block 9 restricts the following properties to source lines/segments not
parallel to the projecting direction. This does not prohibit investigating
collapse in the written exercises. Blocks 10/11/12 assert respectively
line images, parallel line images, and parallel-segment length-ratio preservation
within that stated noncollapse scope.

For alpha = {x : n dot x = c}, choose direction d with n dot d != 0. Derive

```text
P(x) = x - ((n dot x - c)/(n dot d)) d
L(v) = v - ((n dot v)/(n dot d)) d.
```

P is affine; its linear part L has kernel D = span(d), image
W = {v : n dot v = 0}, and rank two. Restriction to a direction plane V has
rank `dim(V) - dim(V intersect D)`. No perpendicularity is assumed.

The permitted old source-first record, section 3, explicitly attests the
already-confirmed book convention: parallelism of lines permits coincidence.
This convention is reused as authorized passed context, not re-proved from a
new book lookup. The seed itself does not restate that inherited convention.

## 5. Independent Solution: 99(1)

Source task: what figure can the parallel projection of a plane be?

Let the source plane be Pi = p + V, with dim(V) = 2.
The whole-plane image is P(p) + L(V).

1. If d is not in V, V intersects D only at zero. L restricted to V has rank
   two, so L(V) = W and P(Pi) is the **entire target plane alpha**.
2. If d is in V, V intersects D in one dimension. The restriction has rank one,
   so P(Pi) is a **whole straight line**, not a ray or segment. Since d is
   transverse to alpha and belongs to the source direction plane, this line is
   exactly Pi intersect alpha.

A point image would require V to lie in the one-dimensional kernel and is
impossible. A half-plane, bounded segment, ray, or finite point collection
cannot be the affine image of the entire source plane.

Existence witnesses: with alpha: z = 0 and d = (0,0,1), source z = 1 maps onto
all alpha, while source y = 0 maps onto the x-axis. Source Pi = alpha also maps
to alpha by fixed points; containment/coincidence is not silently excluded.

**Frozen result:** exactly an entire plane or an entire line, with the
rank/tangency conditions above. No unresolved convention is needed for 99(1).

## 6. Independent Solution: 101

Source task: when does "the projections of parallel lines are parallel" fail?

Write parallel source lines as
`a = A + R v`, `b = B + R v`, with nonzero v and r = B - A.

If L(v) != 0, the images are lines with the same direction L(v). They coincide
exactly when

```text
L(r) in span(L(v)),
equivalently r in span(v,d).
```

For distinct source lines this equivalently says that the projecting direction
d lies in their common direction plane span(v,r). Otherwise their images are
distinct parallel lines.

These two noncollapsed branches must not be confused:

- Under strict "distinct and disjoint lines" terminology, coincident images are
  not strictly parallel.
- Under the already-confirmed **book-wide convention permitting coincidence**,
  that same configuration still satisfies the quoted parallelism statement.
  It is not a book-convention exception.

If v is parallel to d, L(v) = 0 and each line projects to a point. For distinct
source lines the two points are distinct: equal images would imply r in D =
span(v), making the source lines the same line. If coincident source lines
are allowed, their images are the same point. Neither point configuration
constitutes two parallel line images.

Witnesses with alpha: z = 0 and d = (0,0,1):
`a={(t,0,0)}` and `b={(t,0,1)}` are distinct parallel lines with the same x-axis
image; changing b to `{(t,1,0)}` gives two distinct parallel image lines.
Source lines `{(0,0,t)}` and `{(1,0,t)}` instead collapse to distinct points.

**Frozen result:** with the book convention, noncollapsed parallel source
lines retain parallelism, including coincident line images. The failure when
the property is used without block 9's restriction is **source direction
parallel to d, hence point collapse**. Within block 9's stated premise there is
no counterexample. A changed view using strict terminology would need to say so
explicitly; it cannot silently convert coincidence into the book's failure case.

## 7. Independent Solution: 104(2)

Source task: for given skew a, b and target plane alpha, construct projecting
line l so that the line images are parallel.

Write `a = A + R v`, `b = B + R w`. Because a and b are skew, v and w are
independent and r = B - A does not belong to S = span(v,w).
S is a two-dimensional **direction plane**, not a plane containing both skew
source lines.

### Necessary and Sufficient Direction Conditions

An admissible construction has

```text
d in S,
n dot d != 0,
d not in span(v),
d not in span(w).
```

Necessity: parallel line images require L(v), L(w) to be nonzero and dependent.
Some nonzero combination of v,w therefore lies in ker(L) = span(d).
Independence of v,w makes that combination nonzero, so d belongs to S.
Transversality to alpha defines the projection; avoiding the source directions
prevents collapse to a point.

Sufficiency: for such d, L restricted to S has rank one. Both source directions
have nonzero images in that one-dimensional image, so the image lines have
the same direction. They cannot coincide: coincidence would imply
`L(r) in span(L(v))`, hence `r in span(v,d) = S`, contradicting skewness.
Thus the resulting image lines are **distinct parallel lines**, even under
strict terminology.

### Existence and Construction

There is a solution **if and only if S is not W**, equivalently at least one
of n dot v, n dot w is nonzero. If S is W, all directions in S are tangent to
alpha and violate n dot d != 0. No outside-S direction can solve the problem.

When existence holds, through an arbitrary point O draw directions parallel
to a and b, forming an auxiliary plane beta with direction plane S. Choose a
line l in beta through O whose direction is neither tangent to alpha nor
parallel to either source direction. Only finitely many directions in beta
are forbidden; such an l exists. Since beta is not direction-parallel to
alpha, beta intersect alpha gives the tangent direction that is to be avoided.
The images have direction S intersect W.

An explicit vector construction is d = v + t w with t != 0 and
`n dot v + t(n dot w) != 0`. For example, choose v+w when its normal component
is nonzero; otherwise choose v+2w. In the latter branch, existence ensures its
normal component is nonzero. Both nonzero coefficients also prevent collapse.

Solvable witness: alpha: z = 0,
`a={(t,0,0)}`, `b={(0,1,s)}`, d = (1,0,1).
The source lines are skew; their images are the distinct lines y = 0 and
y = 1 in alpha.

### No-Solution Investigation

Counterexample to unconditional existence: alpha: z = 0,
`a={(t,0,1)}`, `b={(0,s,2)}`. The lines are skew, and both direction vectors
are tangent to alpha. Any permissible d has a nonzero z component; L fixes
both (1,0,0) and (0,1,0), so the two image directions remain independent.
No admissible projecting line produces parallel images.

Joining arbitrary points on the two skew source lines cannot fix this:
any such direction has form r + s w - t v, which is outside S. It violates
the necessary direction condition.

**Frozen result:** this is a conditional construction with a fully determined
no-solution branch, not an unresolved convention and not a universal existence
claim. A view must preserve the investigation of existence or explicitly supply
the missing direction-plane condition and record any resulting scope loss.
No present source evidence justifies dropping the no-solution case.

## 8. Genuine Conventions Blockers: 99(2)/(3)

These blockers concern unconditional interpretation, not execution or image
legibility. Selected definitions and permitted figure context do not settle them.

**99(2), half-plane:** is the boundary line part of the figure?
For coordinates in a source plane, an interpretation
`H={p+s u+t v : s in R, t >= 0}` is closed; replacing `>=` by `>` excludes the
boundary. For a rank-one projection with L(u)=0 and L(v)!=0, these have
respectively a ray including its initial point and a ray without that point.
For rank two, the boundary inclusion likewise remains visible in the half-plane
image. Thus an unconditional statement about endpoint/boundary ownership is
not justified. If L(u)!=0 in rank one, varying s already fills a whole line;
this conditional fact does not resolve the missing definition.

**99(3), non-straight angle:** does "angle" mean only the two bounding rays,
a filled angular region, or a specified open/closed region? Which angle range
is permitted, in particular zero or reflex angles? With an injective restriction
to the source plane, the two-ray set remains two rays, whereas a filled sector
has a two-dimensional angular-region image. If a zero angle is permitted,
its single ray can collapse to a point; a filled sector with two independent
boundary directions cannot collapse wholly into the one-dimensional kernel.
These are concrete truth-changing dependencies, not reasons to select a
preferred convention by habit.

**Frozen status:** 99(2)/(3) remain blocked for any unconditional learner claim
depending on these unsettled conventions. No complete true set, author key,
or unconditional catalogue is inferred. A later explicitly convention-bound
view may be evaluated under its stated assumptions without asserting that the
seed supplied them. No additional source lookup is authorized in this phase.

## 9. Verification, Reuse, and Stop

Offline Node assertions checked the explicit plane, 101 coincidence/collapse,
104 skew-solvable, and 104 no-solution witnesses above. They also checked the
v+w / v+2w construction for all 576 independent direction-vector pairs with
coordinates in {-1,0,1} for which at least one normal component is nonzero.
Result: pass. These finite checks supplement, and do not replace, the written
necessity/sufficiency proofs or a later semantic gate.

The choice validator was not run: the draft and author internals remain
intentionally undisclosed. This phase cannot emit a contract-complete
`s10y-choice-review-v1`, determine option sets, or approve revised questions.
Previously passed stages remain reusable on their unchanged scope; no old
Stage2/3 report was read.

No image opens, decodes, ROIs, image-byte reads/rehashes, services, network,
paid calls, DB, canonical edits, Git, descendants, or chat tools occurred.
No other worker's edits were altered. Only the two new files in the owned
independent directory were written. Input byte/canonical bindings and the
receipt's object hashes were rechecked after writing.

**Stop here.** Await the human's new-view disclosure for Phase2. Only after
that separate phase is completed may the human disclose author internals.
