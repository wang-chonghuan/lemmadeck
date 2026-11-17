# STEMROBIN-184: n19 Independent Source-First Review

## Phase Boundary

Phase 1 only. No choice views, draft, internal key, author reasoning, author
reports, prior answers, interactions, judging parts or reviewer outputs were
disclosed or inspected. This is a source-solution freeze, not a semantic-gate
approval and not `s10y-choice-review-v1`. Package outcome, visible-question
fidelity, redundancy, leakage and option mathematics remain unassessed.

`TMP` means
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp`.
The sole mathematical prose input is `geo910-n19-choice-seed.json` there.
Its canonical SHA-256 matches
`21aba5ade30915e19ae40469c14a891e7b70f16f33ac4e9c32f7fe14536de2f4`.
Raw-file SHA-256 is
`387ab4aeea2bb091ca3e07ce97dfb23e0854c05e27eb4a5c826e2a499c1d3e96`.
The four seed trace files were freshness-hashed only, not parsed as extra prose.
No prepare, inspect, validator, skill-version test or history command ran.

My only created files are this report and files within the new sibling
`geo910-n19-choice-independent-source-first-evidence/` directory. No root
`TMP` file was created. Initial path probes found no seed at root `TMP/`,
root `.tmp/` or root `tmp/`; no other directory was searched.
No source, edition, database, app, publish, Git or workflow file was written.
Other workers' files were left untouched.

## Source Images

Both actual seed SVGs were rendered, without editing, using the existing
`app/` Playwright Chromium package. The browser was headless, with a new
isolated context, no user profile, no CDP and no OS input. Network requests
were aborted. No application or database was started. The browser and
context were closed at completion.

Each 1440 x 960 full-page screenshot contains the entire native SVG with
24 px margin. This is source-asset evidence, not final learner-display
evidence. No concept image was substituted with a spec, remembered report,
source scan or historical rendition.

- **fig-75:** actual SVG hash
  `95df61862b6419a63d457e08bdbcfed93f0edc04fa2a3bdd47f687c2e6aa256a`.
  The upper arrow labelled vector `a` points up-left; the lower arrow
  labelled vector `-a` points down-right. The two segments visibly have
  equal length and parallel supporting directions, with opposite
  arrowheads. Both vector labels and both complete arrows are visible;
  the rightmost upper endpoint and bottommost lower arrowhead are included.
  No numerical length is asserted from pixels.
- **fig-76:** actual SVG hash
  `a4c46e416463c9301e152d28a92b192c09c372e03ee4081a7b1fba98f3ea43a8`.
  `A` is left, `B` above-right, and `O` below-right. There are arrows
  `O -> A`, `O -> B`, and `A -> B`. The complete `O` point and label at the
  bottom-right, both arrowheads meeting `B`, and the arrowhead at `A`
  are visible. Thus `OA + AB = OB`, or `OB - OA = AB`; reversing the
  subtraction gives `OA - OB = BA`. `A` and `O` are not interchangeable.
  The shared terminal point of two arrows at `B` is meaningful incidence,
  not evidence of a missing edge.

Image budget: **2 opens of 8, 0 reopens, 6 remaining**. The remaining allowance
is reserved for later authorized learner/final-display evidence. Screenshots
are retained as local paths and hashes; no image payload is forwarded to a
parent chat.

## Definitions Frozen

Exact selected definition text is retained in `phase1.json`, copied only from
the verified seed. The mathematical content is:

- Block 1: opposite vectors add to the zero vector; `a + (-a) = 0`.
- Block 2: nonzero opposite vectors have equal lengths and opposite
  directions; `BA = -AB`. The zero vector is its own opposite but has no
  ordinary directional claim.
- Block 5: `c + b = a` defines the ordered difference `c = a - b`.
- Block 8: subtraction is addition of the opposite of the subtrahend.
- Block 9: for any three spatial points, `OB - OA = AB`.

No solved example or additional lesson paragraph was used.
Throughout the following solutions, `UV` denotes the directed vector from
`U` to `V`, not an unoriented segment. Lowercase letters are position
vectors relative to the explicitly stated origin. A construction specifies
both the required starting point and the endpoint, not just a free vector.

## 186: Three Opposites From A

Given the tetrahedron `ABCD`, construct three distinct required vectors
starting at **A**, not at the origin used to write coordinates.
With positions `a,b,c,d` relative to any common origin:

1. `-DB = BD = d-b`. The endpoint is `X1 = a+d-b`; hence
   `AX1 = d-b = -DB`. Complete parallelogram **B-D-X1-A**, or draw through
   `A` the line parallel to `BD` and lay off the length `|BD|` in the
   direction `B -> D`.
2. `-CD = DC = c-d`. The endpoint is `X2 = a+c-d`; hence
   `AX2 = c-d = -CD`. Complete parallelogram **D-C-X2-A**, laying off
   `|DC|` in the direction `D -> C`.
3. `-BC = CB = b-c`. The endpoint is `X3 = a+b-c`; hence
   `AX3 = b-c = -BC`. Complete parallelogram **C-B-X3-A**, laying off
   `|CB|` in the direction `C -> B`.

Tetrahedron vertices are distinct and noncoplanar, so the relevant edges
are nonzero and `A` is not on any of their lines. Each parallelogram
construction is consequently nondegenerate. Equality of lengths alone
does not suffice; the direction must be reversed and the start fixed at `A`.

Independent coordinate check: for `A=(0,0,0)`, `B=(1,0,0)`,
`C=(0,1,0)`, `D=(0,0,1)`, the endpoints are respectively
`(-1,0,1)`, `(0,1,-1)`, `(1,-1,0)`.

## 187: Ordered Parallelogram OBAC

Use `O` as origin: `OA=a`, `OB=b`, and the condition gives `OC=c=a-b`.
Therefore `BA=a-b=OC`, and `CA=a-c=b=OB`.
The opposite sides of **O-B-A-C**, in that cyclic order, have the requisite
equal directed vectors: `OB=CA` and `BA=OC`.
Equivalently, translating `O,B` by `OC` produces `C,A`.

Because `O,A,B` are noncollinear, `a,b` are linearly independent; so are
`b,a-b`. Thus `C` is in plane `OAB`, all four vertices are distinct,
and the two adjacent directions span a nondegenerate parallelogram.
The conclusion is about **OBAC**, not an arbitrary permutation such as
`OABC`. Its diagonals are `OA` and `BC`, with common midpoint `a/2`.

The noncollinearity condition cannot silently disappear. For collinear
points `O=0`, `A=3`, `B=1`, the equation yields `C=2`; all four points
are distinct, but the ordered figure is degenerate. Also,
`AB = -OC`, not `AB = OC`.

## 188: Three Constructions From O Outside the Base Plane

Here `ABC` is a genuine triangle and **O is outside plane ABC**.
Take `O` as origin, with `a=OA`, `b=OB`, `c=OC`.
These three vectors are linearly independent: otherwise `O,A,B,C` would
lie in a plane. A point of plane `ABC` has unique coefficients in
`a,b,c` whose sum is one.

1. For `OA-OB`, set `X1=a-b`.
   Then `OX1=BA`. Complete parallelogram **B-A-X1-O**, equivalently
   translate the directed edge `B -> A` to start at `O`.
   The endpoint lies in plane `OAB`, and in the plane through `O`
   parallel to `ABC`; it is not in plane `ABC`.
2. For `-OA-OC`, first reflect `A,C` in `O` to obtain
   `A'=-a`, `C'=-c`. Complete parallelogram **O-A'-X2-C'**,
   so `X2=-a-c` and `OX2=-OA-OC`.
   Equivalently, if `M` is the midpoint of `AC`,
   `OX2=-2OM`: take twice `OM` in the opposite direction.
   Both input vectors are negated, not just one; the endpoint is in
   plane `OAC` and outside plane `ABC`.
3. For `OA+OB-OC`, let `M` be the midpoint of `AB` and reflect
   **C in M** to obtain `X3=2m-c=a+b-c`.
   Equivalently, complete parallelogram **C-A-X3-B** in the base
   plane. Then draw `O -> X3`. This is the required vector from `O`;
   `AX3` or `CX3` is not the requested output.
   Unlike the first two endpoints, `X3` **is in plane ABC**, because
   its coefficient sum is `1+1-1=1`.

The constructions are all well defined and nonzero under the stated
nondegeneracy. A drawing that flattens the outside-plane hypothesis
without marking it does not establish the spatial task.

Independent coordinate check: `O=(0,0,0)`, `A=(1,0,0)`,
`B=(0,1,0)`, `C=(0,0,1)` yields respectively
`X1=(1,-1,0)`, `X2=(-1,0,-1)`, `X3=(1,1,-1)`.
The base plane is `x+y+z=1`, confirming the stated endpoint distinction.

## 189: Equality of Norms and the Converse

Let `u=CA`, `v=CB`. Since `ABC` is a triangle, both vectors are nonzero.
Euclidean norm identities give

```text
|u+v|^2 = |u|^2 + |v|^2 + 2 u.v
|u-v|^2 = |u|^2 + |v|^2 - 2 u.v
|u+v|^2 - |u-v|^2 = 4 u.v.
```

Forward direction: a right angle `ACB` makes `u.v=0`, so the squared
norms, and therefore the nonnegative norms, are equal.

**The converse is true.** Equality of the norms forces `u.v=0`.
For nonzero `u,v`, this means exactly `angle ACB = 90 degrees`.
Thus the complete conclusion, under the triangle hypothesis, is an
equivalence, not just a one-way implication.

Geometrically, complete parallelogram **C-A-D-B**. Its diagonals are
`CD=u+v` and `BA=u-v`. A right angle at `C` makes a rectangle with
equal diagonals; conversely, equal diagonals in this nondegenerate
parallelogram force a rectangle.

This is **equality of lengths**, not vector equality `u+v=u-v`.
Zero-vector cases satisfy the norm identity without a defined angle,
so the triangle hypothesis must remain attached to the converse.
For a nonright example, `u=(1,0)`, `v=(1,1)` give norms
`sqrt(5)` and `1`, respectively.

## 190: Any Spatial Origin, Opposite Vertices

For the ordered parallelogram `ABCD`, let `M` be the common midpoint of
diagonals `AC` and `BD`. For **every point O in space**,

```text
OA + OC = 2OM = OB + OD.
```

To verify without assuming a location for `O`, write the positions
relative to `O` as `a`, `b=a+u`, `d=a+v`, `c=a+u+v`.
Both sides equal `2a+u+v`.
The midpoint formula follows equally from `a+c=2m=b+d`.

No assumption that `O` lies in the parallelogram plane, at the diagonal
intersection, or outside that plane is required. At `O=M` both sides
are zero; at `O=A`, the identity is the diagonal-addition rule
`AC=AB+AD`. The paired vertices are opposite pairs `A,C` and `B,D`.

The identity is not automatic for four arbitrary points: for
`O=A=(0,0)`, `B=(1,0)`, `C=(0,1)`, `D=(2,2)`,
the two sides are `(0,1)` and `(3,2)`. This condition-sensitive identity
must remain distinct from the unconditional four-point identity in 191.

## 191: Identity and Arbitrary-Four-Point Extension

For tetrahedron `ABCD`, path addition gives

```text
AD = AB + BD
BC = BA + AC
AD + BC = AB + BA + BD + AC = BD + AC.
```

An independent common-origin calculation gives

```text
AD + BC = (d-a)+(c-b) = c+d-a-b
BD + AC = (d-b)+(c-a) = c+d-a-b.
```

**Part 2 is true for any four points.** The calculation used no
tetrahedron, noncoplanarity, noncollinearity, distinctness, parallelogram
or common-plane requirement. It therefore includes coplanar, collinear
and coincident points in Euclidean space.

For four collinear distinct points `A=0`, `B=1`, `C=3`, `D=7`,
both sums are `9`. If `A=B`, both expressions reduce to `AD+AC`.
These are illustrations; the algebra proves the universal extension.
The order and sign of every directed segment remain essential even
though the geometric restrictions disappear.

## Frozen Coverage and Fidelity Hypotheses

These are pre-disclosure expectations, **not verdicts about unseen choices**.
There are six full sources and twelve substantive source tasks: three
constructions in 186; a proof in 187; three constructions in 188; the
forward proof and converse in 189; the arbitrary-origin proof in 190;
and the identity proof and arbitrary-four-point extension in 191.

| Source | Mathematical distinctions that must survive |
| --- | --- |
| 186 | All three ordered negatives; translated start at A; equal length and opposite direction; correct endpoints or complete constructions. |
| 187 | `OA-OB=BA`; cyclic order OBAC; noncollinearity; a sufficient proof relationship, not merely a named shape. |
| 188 | All three expressions and both minus signs in part 2; start at O; O outside ABC; the different endpoint-plane behavior; substantive construction or derived relationships. |
| 189 | Norm rather than vector equality; right angle at C; both implication directions; nonzero triangle conditions and a reason for the converse. |
| 190 | Opposite-pair sums; parallelogram condition; any spatial O, not a privileged origin; a proof relationship. |
| 191 | Exact directed identity plus the unconditional arbitrary-four-point extension, including degeneracies; a universal justification. |

Recognition can meaningfully preserve these mathematical judgments.
Complete constructions, coordinate tables or equivalence packages are not
automatically defective merely because elimination is possible. However,
each alternative must preserve its own substantive mathematical distinctions.
Selecting a point does **not** demonstrate drawing a translated vector;
selecting an implication does **not** demonstrate independently producing
a proof.

Expected production-capacity losses must be recorded separately:

- 186 and 188 may lose independent drawing, endpoint placement and execution
  of translation/parallelogram construction.
- 187, 189, 190 and 191 may lose independent organization and written
  production of a proof, and the learner's own formulation of its scope.
- If recognition still tests the construction relations or proof logic,
  that loss alone is not an automatic failure. If the only remaining
  action copies an exposed endpoint, formula or answer label, or if a
  key part is omitted, the source task has not been preserved.

Potential cross-question dependencies to check later: one visible question
must not expose 186/188 sign answers, 187's parallelogram conclusion,
189's converse, or 190/191's quantifier distinction as another question's
answer. Source mapping and internal solutions must not appear in the
learner-facing text. Merging and splitting require mathematical coverage,
not an item-count assertion.

## Freeze and Next Disclosure

`phase1.json` contains the full exact seed prose and definitions, complete
source solutions/conditions, observations and frozen hypotheses.
`complete-inputhashledger.json` records semantic inputs, hash-only freshness
checks, source-field digests, image-open events and output hashes.
`freeze-manifest.json` binds this report and Phase 1 JSON to the verified
seed, rendered-image evidence and ledger.
Reviewer-created coordinate checks in `arithmetic-evidence.json` verify
the signed examples for all six sources. These are new source-derived
checks, not old skill tests or author-key comparisons; finite examples
support the sign checks and do not replace the general proofs above.
The first arithmetic run stopped because strict JavaScript comparison
distinguished `0` and `-0`. `arithmetic-attempt-1.json` retains the exact
failure and old script hash. The comparison was repaired to use ordinary
numeric equality; no source solution or expected nonzero value changed.

Stop here until **explicit Phase 2 learner-view-only disclosure**.
Phase 2 may provide only the selected `view` subtrees and their actual
visible figure assets. It must not disclose internal intents, solutions,
keys, rationales, misconceptions, coverage reports or author/reviewer
judgments. Independently check fidelity, redundancy and leakage, solve
every visible question and option, and freeze the complete true sets.
Only a separately authorized later Phase 3 may compare those frozen
results with the internal author material. No review JSON with a `pass`
outcome is justified before those stages.
