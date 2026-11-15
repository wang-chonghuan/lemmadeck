# n4 Choice Author: Independent Source Solutions

Author only. This source solution record is written before any draft/options.
No answer keys/templates, parent answer/source-first/reviews, previous choices,
history, browser, services or database were opened. Existing approved body
Fig. 11 is not a task image and is not reopened or imported into this seed.

## Explicit Inputs

Inspected the current durable whitelist for book `9-10g`, lesson
`geo910-c1-s1-n4`. Prepared once with exercises 27/28/29 and concept block 1.
Block 1 is the operational meaning of spatial construction: prove existence
of an object satisfying the given conditions. The full block also includes its
inseparable explanatory reference to an earlier plane-existence corollary.
It is not the solved parallel example. Blocks 3--8/11 (parallel problem,
solution, uniqueness argument and conclusion) are not selected as definitions.
No concept figure is selected; all three source figure_refs are empty.

Seed: `geo910-c1-s1-n4-choice-seed.json`

Canonical digest:
`804b2ce7fbb35175e1406cd7521824f4c389255053daee3c0770c7f47e35e1db`

Commands:

```sh
python3 .agents/skills/ld-s10y-choice/scripts/prepare.py inspect \
  --repo . --book 9-10g --lesson geo910-c1-s1-n4
python3 .agents/skills/ld-s10y-choice/scripts/prepare.py prepare \
  --repo . --book 9-10g --lesson geo910-c1-s1-n4 \
  --exercise 27 --exercise 28 --exercise 29 --concept-block 1 \
  --out .intentfold/tickets/STEMROBIN-184/tmp/geo910-c1-s1-n4-choice-seed.json
```

Read the complete seed after preparation. No supplemental convention,
prerequisite source, solved example or body image has been inserted.

## Exercise 27: Complete Two-Case Construction and Count

Demand: in space, through M construct a line that **intersects** a at a right
angle; count the solutions separately for M outside/on a. Direction-only
orthogonality of a skew line is not sufficient.

If M is not on a, there is a unique plane containing a and M. In that plane,
draw the perpendicular from M to a; planar perpendicular existence and
uniqueness give one line. Any qualifying spatial line intersects a and passes
through M, so it and a lie in that same unique plane. It must be the planar
perpendicular already found. Thus exactly one solution, not one per arbitrary
space plane.

If M lies on a, take any plane through a. The perpendicular to a through M
inside this plane is a solution. Distinct planes through a give distinct
perpendiculars: otherwise the common perpendicular together with a would
determine both planes. There are infinitely many such planes, hence infinitely
many perpendicular lines. Conversely every qualifying line meets a at M:
meeting a at any other point would put both distinct points of a on the line,
making it a itself, which is not perpendicular to itself. Each solution and a
determine one such plane. This describes the entire solution family.

The source's right-angle intersection wording settles the meaning needed here;
no convention about coincident parallel lines is used.

## Exercise 28: Original Data and Complete Branches

Demand: with `a intersect alpha=M`, `N notin alpha`, construct the intersection
of alpha with a plane containing a and N. No assumption `N notin a` occurs.
The selected construction definition asks for existence, not an unqualified
uniqueness theorem.

Consequences of the given data: a is not contained in alpha; M lies on a and
in alpha; N is not M. A plane containing a cannot equal alpha.

### N Not on a

A unique plane beta contains a and N. Through N draw b parallel to a. Here
b is distinct from a because N is outside a, so no coincident-parallel
convention is needed. b lies in beta and meets alpha at a point P. Since
b has the same transverse direction as a, the meeting exists and is unique.
P is not M; if b passed through M, its common direction and common point with
a would force b=a and put N on a.

Both M and P belong to alpha and beta. Therefore the line MP is contained
in both. Distinct intersecting planes meet in exactly one line, so
`alpha intersect beta=MP`. This constructs the unique intersection in this
branch, not a line obtained by joining N to a point of alpha.

For an explicit general existence check, choose proof coordinates with
alpha the z=0 plane, M the origin and `a={t d}` where `d_z !=0`.
Write N as n with `n_z !=0`. The parallel line b has points `n+t d`,
and its intersection is `P=n-(n_z/d_z)d`. P is zero exactly when N is on a,
so it is nonzero in this branch. These are arbitrary proof coordinates,
not invented exercise givens or a required new diagram.

### N on a (Allowed by the Original Data)

There is no unique plane determined by a and N: a already contains N.
Choose any Q in alpha different from M. Q is not on a because the only
point of a in alpha is M. The line a and Q determine a plane beta, which
contains N automatically. The two distinct planes intersect in MQ.

Conversely every line ell in alpha through M is obtainable: choose Q on ell
different from M and take the plane through a and Q. Thus the possible
intersection lines are **all lines in alpha through M**, infinitely many.
Every admissible beta has one intersection line through M, but the original
data do not select one beta or one intersection.

In this branch the preceding parallel auxiliary construction fails as a
two-point construction: the line through N parallel to a is a itself,
and P=M, so MP does not determine a line. That is why the separate Q
construction is necessary rather than suppressing the branch.

### Honest Source Boundary

The definite phrase "the plane through a and N" is underdetermined in the
N-on-a branch. It is not grounds to invent N-off-a or claim a unique line for
all original data. A complete existential construction and its nonunique
family are nevertheless available under the expressly permitted definition
of "construct". The choice task must retain both branches visibly, give a
valid construction in each, and state where uniqueness fails.

This does **not** establish what omitted premise an author might have intended.
If a later reviewer interprets the original demand as requiring one plane
determined solely by the data, that stronger demand remains unavailable and
must be reported, not normalized into a unique key. The authored plan is
whole two-branch construction recognition, not an invariant partial quiz
misrepresented as the original unique theorem.

## Exercise 29: Complete Plane Construction and Uniqueness

Demand: a and M lie in alpha; N is outside alpha. Construct beta through N
such that its intersection with alpha passes through M and is perpendicular
to a.

Within alpha draw ell through M perpendicular to a. This is the unique planar
perpendicular whether or not M lies on a. Since N is outside alpha, N is
outside ell. The line ell and N determine a unique plane beta. beta is not
alpha because it contains N. Both planes contain ell, so their intersection
is precisely ell. It meets both required properties.

Conversely any qualifying plane has an intersection line in alpha through M
perpendicular to a. Planar perpendicular uniqueness makes it ell, and the
plane must contain ell and N. Line-and-off-line-point plane uniqueness makes
it the constructed beta. Thus exactly one plane satisfies the entire task.
This is not a plane chosen only to contain a and N, and not any arbitrary
plane through N. No `M notin a` condition is needed or added.

## Choice Capacity and Task Units, Before Options

All three sources are mathematically addressed, including both 27 subparts
and the 28 branch not excluded by the original data. No images are essential
for these textual construction/existence records.

Plan: one whole two-case count/construction-family task for 27; one whole
two-branch intersection-construction record for 28; one whole constructed-plane
record for 29. These are different mathematical demands, not repeated
line/plane existence quizzes. No local scalar answer slots or source-number
instructions will be learner-facing.

Recognition cannot demonstrate independently generating the spatial
construction, its auxiliary choice or the existence/uniqueness proof.
These are concrete production losses to retain in every intent and coverage.
The ability to determine a single intersection solely from 28's unqualified
data is not present in the source itself; keep that distinction separate from
the ordinary loss of writing to choice recognition.

## Authored Response Units

Draft: `geo910-c1-s1-n4-choice-draft.json`.

Three native single-response questions, four complete records per question.
No source subpart is turned into a scalar answer slot; no task images or new
figures are needed. Complete derivations and reproducible erroneous procedures
are internal in the draft. No options were generated from an answer artifact.

- `spatial-perpendicular`: keeps both position cases, spatial intersection,
  valid construction, and completeness/count of the solution family. The
  erroneous records respectively generalize one fixed auxiliary plane's
  uniqueness to space, count direction-orthogonal skew lines, and mistake two
  orthogonal basis directions for the entire family.
- `plane-intersection-branches`: keeps both allowed N positions in every record.
  The stem explicitly uses the selected existential construction definition.
  Its wrong procedures extend the nondegenerate parallel construction through
  coincident points, use N rather than M as a second common point, or confuse
  nonuniqueness with nonexistence. Original definite-plane underdetermination is
  not resolved or silently removed; intent and coverage retain that unavailable
  stronger demand separately from choice-format production losses.
- `specified-intersection-plane`: evaluates a full plane construction with the
  required intersection line and an existence/uniqueness argument. The wrong
  constructions fix the plane using a instead of the target intersection,
  replace an intersection-direction condition by a whole-plane perpendicular
  construction without securing M, or use the same-direction line instead of
  the perpendicular.

## Package Relationships and Handoff Boundary

The first and third questions both use planar perpendicular existence and
uniqueness, but their response objects and spatial constraints differ: a line
with a changing auxiliary-plane family versus a plane fixed by an intersection
line and a point outside the given plane. They do not repeat a scalar result.
The second and third questions both use common-line incidence of two planes;
one must construct that intersection and handle a free-plane degeneracy, while
the other must determine a plane from the prescribed intersection. All
mathematical data needed for each question are present in its own stem; no
option refers to another question or provides an extra premise for it.

The source28 stem is a transparent existential restatement, not a claim that
the unqualified original data specify one plane. Its complete branch coverage
can be evaluated by an independent reviewer, who may still reject fidelity if
the original task requires that stronger determination. This author draft is
not a semantic approval.

The three records retain the stated construction relationships but do not
demonstrate autonomous spatial drawing or proof production. These losses
remain explicit for all three sources. No new figure is warranted merely to
decorate a textual construction-proof task.

Parent has requested a Stage2-only projection. After the bounded structural
check, the generated `geo910-c1-s1-n4-choice-views.json` contains only local
question identifiers and their `view` subtrees, with no intent, solution,
coverage, source mapping, rationale, or key.

## Frozen Structural Handoff

Executed exactly once:

```sh
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . \
  --seed .intentfold/tickets/STEMROBIN-184/tmp/geo910-c1-s1-n4-choice-seed.json \
  --draft .intentfold/tickets/STEMROBIN-184/tmp/geo910-c1-s1-n4-choice-draft.json
```

Exit `0`: `mechanical checks passed; semantic review still required`.
There are 3 questions, 12 options, 3 covered source numbers, 1 selected
definition block, and 0 task/new figures. No semantic review artifact or
author approval was produced.

Draft canonical digest:
`9b0128377ae9c00a5325744dee7f76a3f48a9bfaf98fc9e7ab87076a53d01e60`

Raw file SHA-256:

- Seed: `e6254f6c66f04ff610e28742fd030b6a6d9c179673b4411d6e7f4587f690834d`
- Draft: `8951f42ce05545593083192e665e83f394c0b0d41a895a88d366960dcc022306`
- View-only projection: `1de0182d46f36ac05d59f9f3436bd4dcabaa8f392dd97d8052b5b9c73daf0e08`

Read the current semantic-gate procedure after the structural check; the
parent's separate staged reviewer, not this author, will apply it. No source
solve, prepare, image render or structural validation was repeated after
context continuation. Draft and view bytes are frozen pending independent
findings.
