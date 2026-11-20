# N46 Choice Author Record

Status: author draft complete; parent gates pending. Internal artifact only. The one native structural check passed on the preserved first candidate, before the single targeted content repair. The repaired candidate is not independently reviewed or native-rechecked.

## Boundary

- Ticket: STEMROBIN-188; assignment: SAME188-6 N46 CHOICE AUTHOR ONLY.
- Every exec cwd: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`.
- Write root: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n46-choice-author`.
- Only current native whitelist projection and prepared seed supply mathematical input. No source answers, previous choices, peer outputs, interaction specifications, tests, compatibility versions, backend, environment, database, model, Git, messaging, delegation, approval, finalization, publication or retention.
- Image opens, crops, screenshots and generated figures: 0. All six exercise figure references and selected concept figure references are empty.
- Parent-reported passed text/figure review and successful modern finalization/render are authorization context, not an author semantic gate; those outputs were not read.

## Native Inspect Receipt

Command, executed once with Python bytecode writes disabled:

```text
python3 -B .agents/skills/ld-s10y-choice/scripts/prepare.py inspect --repo . --book 9-10g --lesson geo910-c2-s1-n46
```

Exit 0. Tool receipt `180529`. Inventory: exercises 34, 35, 36, 37, 38, 39, each with `figure_ids: []`; candidate prose blocks 0, 1, 2, 3, 4, 9, 10, 11, 12, 13, 16, 17, 18, 19; manifest figure identifiers fig-g10-12, fig-g10-13, fig-g10-14, none selected or opened.

Explicit selection: exercises 34-39; concepts 0 (coordinate-formula definition), 4 (nonzero-coefficient vector definition of homothety), 12 (plane-image theorem). Block 3 is a general-space/plane relation, unnecessary alongside the complete definition. Blocks 1 and 9 are problem prompts; 2, 10, 13, 16, 17, 19 are worked solutions/proof blocks and are excluded. Blocks 11 and 18 are not needed definitions.

This author's inspect is an inventory receipt, not semantic approval or a reuse of the parent's inspection.

## Native Prepare Receipt

Executed once:

```text
python3 -B .agents/skills/ld-s10y-choice/scripts/prepare.py prepare --repo . --book 9-10g --lesson geo910-c2-s1-n46 --exercise 34 --exercise 35 --exercise 36 --exercise 37 --exercise 38 --exercise 39 --concept-block 0 --concept-block 4 --concept-block 12 --out .intentfold/tickets/STEMROBIN-188/tmp/n46-choice-author/seed.json
```

Exit 0. Tool receipt `402e27`. Exact stdout:

```text
prepared 6 written seeds; no questions generated
seed_sha256=a19d3814468994c4890c3dc9afd6453bac5547c43e519f312d6f4afae07073b2
```

The native seed includes its native `include_group_instructions: true` selector. It is not manually modified. The tool's book-index trace is identity provenance, not authority for reading other lessons.

## Independent Solutions Before Options

This section was written before any draft options. It is author derivation, not independent review.

### 34: Both Image Planes

Let image coordinates be (X,Y,Z). Translation by p=(-1,5,3) gives (X,Y,Z)=(x-1,y+5,z+3), so the inverse is (x,y,z)=(X+1,Y-5,Z-3). Substitution into 3x-y+8z-17=0 gives 3X-Y+8Z+3+5-24-17=0, or 3X-Y+8Z-33=0. Equivalently n.p=16, so the original offset 17 becomes 17+16=33. The displacement is not inserted forward into the old equation.

For origin-centered k=-3/2, (X,Y,Z)=k(x,y,z). Inverse substitution gives (3/k)X-(1/k)Y+(8/k)Z-17=0. Multiplication by nonzero k gives 3X-Y+8Z-17k=0, hence 3X-Y+8Z+51/2=0, equivalent to 6X-2Y+16Z+51=0. The normal direction remains proportional; the entire equation is not simply scaled into an unchanged plane.

### 35: All Three Coordinate Symmetries

For M=(x,y,z), origin central symmetry has O as midpoint of MM', giving M'=(-x,-y,-z). Reflection in z=0 preserves the foot (x,y,0) and negates the perpendicular displacement, giving M'=(x,y,-z). Symmetry about the z-axis is taken explicitly as a half-turn about that axis: the midpoint of MM' is its perpendicular foot (0,0,z), giving M'=(-x,-y,z). This is not a reflection in a vertical plane. All three maps are involutions.

### 36: Dependent Plane Transforms

The instruction to use the preceding results binds z_0 to the origin central symmetry and the two other transformations to the corresponding reflection and axis half-turn in 35. The learner stem makes these conventions explicit rather than requiring a hidden prior answer.

For 7x-2y-5z-1=0, use the inverse (identical) coordinate maps. Central symmetry gives -7X+2Y+5Z-1=0, equivalently 7X-2Y-5Z+1=0. Reflection in z=0 gives 7X-2Y+5Z-1=0. The z-axis half-turn gives -7X+2Y-5Z-1=0, equivalently 7X-2Y+5Z+1=0. The central symmetry and axis half-turn change the normalized constant sign; plane reflection does not. No independent convention is guessed from z_0 alone.

### 37: Coefficient, Fixed-Point, Line, Plane and Isometry Cases

Use H(P)=O+k(P-O), k real and nonzero. H(P)=P is equivalent to (k-1)(P-O)=0. For k=1 the map is the identity and every point, line and plane maps to itself. For every k!=1, including k=-1, only O is a fixed point.

A line through O is O+t v and maps to O+kt v; since k!=0, t ranges over the same real line, so the line is invariant as a set. For a line not containing O choose coordinates relative to O and its closest point r!=0, r perpendicular to direction v. The image is k r+t v. Equality with the old line requires (k-1)r parallel to v, which for nonzero perpendicular r forces k=1. Thus at k!=1 exactly the lines through O are invariant.

A plane relative to O has n.(P-O)=c, n!=0. Its image has n.(P'-O)=k c. It is the same plane iff (k-1)c=0. At k!=1 exactly the planes through O (c=0) are invariant. The parallel-image theorem does not mean distinct parallel planes are identical. Invariance of a line or plane is setwise; at k=-1 noncentral points exchange with their opposites and are not individually fixed.

For distinct P,Q, H(P)-H(Q)=k(P-Q), so the distance ratio is |k|. The source's word "位移" is assessed as a distance-preserving space transformation (isometry), explicitly visible in the stem, as required by the assignment. Precisely k=1 and k=-1 are isometries; k=0 is outside the definition and is not silently added. For k=-1 this is central symmetry, not a nonzero translation.

### 38: Complete Tetrahedron Algorithms and Ratios

Let ABCD be an arbitrary nondegenerate tetrahedron and O any point. Do not assume a regular tetrahedron, an origin coordinate frame, or a center inside/outside it. For each vertex V distinct from O, use the line OV.

At k=-2 place V' on the ray opposite OV with OV'=2 OV. At k=0.5 place V' on the ray OV with OV'=OV/2, equivalently the midpoint of OV. If a vertex coincides with O it stays O in either case. Apply the same global center and coefficient to all four vertices, join all six corresponding pairs, and take the four corresponding triangular faces. The affine map preserves the nondegeneracy of the tetrahedron for nonzero k; applying the rule only to a convenient subset of vertices is insufficient.

Each edge length scales by |k|. Each face's base and in-plane altitude scale by |k|, so its area and the sum of all face areas scale by k^2. If S is the given surface area and S' the constructed area, S:S' is 1:4 for k=-2 and 4:1 for k=0.5. Areas are positive; a negative coefficient changes placement, not area sign. These are original:image ratios, not the reciprocal and not the cube used for volume.

### 39: Complete Parallelepiped Algorithm and Ratio

Let O be the chosen vertex of an arbitrary nondegenerate parallelepiped. Let adjacent edge vectors from O be a,b,c, linearly independent. Its eight vertices are O plus all sums epsilon_1 a+epsilon_2 b+epsilon_3 c, with each epsilon in {0,1}. At k=1/3 keep O fixed and send each of the other seven vertices V to the point on OV with OV'=OV/3. Join pairs corresponding to the original twelve edges to obtain all six faces. Equivalently divide the three adjacent edge vectors by three and complete the parallelepiped with parallel edges; all vertices then satisfy the same center rule. These constructions require no particular lengths or angles.

The image has surface area S'=S/9 because each face has two independent length directions scaled by 1/3. The requested original:image ratio is S:S'=9:1, not 1:9, 3:1 or 27:1. O does not move; the farthest/opposite vertex is also scaled and is not retained in place.

## Decisions and Holds

- All source mathematics is determined under the explicit 35/36 symmetry convention and 37 isometry terminology requested by the assignment.
- No unresolved source HOLD was identified. The dependent symmetry convention, nonzero coefficient domain, arbitrary construction geometry and original:image ratio direction are explicitly preserved. This is not a semantic pass.
- Drawing production and independently writing coordinate derivations/proofs cannot be demonstrated by selection. These losses must be carried into each relevant question and coverage.
- Independent semantic review, review-bound check, visual gates and any retention remain for the parent. None is performed or approved here.
- Failed tool calls: 0. Native inspect calls: 1. Native prepare calls: 1. Native validate calls: 1. Images: 0. Technical retries: 0.
- Author-detected content findings: 1; targeted content repairs: 1; cumulative candidate revisions: 1. First finding and first candidate are preserved below.

## Structural Check Receipt

Executed exactly once, without a review:

```text
python3 -B .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-188/tmp/n46-choice-author/seed.json --draft .intentfold/tickets/STEMROBIN-188/tmp/n46-choice-author/draft.json
```

Exit 0. Tool receipt `5ab489`. Exact stdout:

```text
mechanical checks passed; semantic review still required
```

Checked seed canonical SHA-256: `a19d3814468994c4890c3dc9afd6453bac5547c43e519f312d6f4afae07073b2`.
Checked first draft canonical SHA-256: `b39fd924f485702f6aff62574a17b368da2f297ba9a5f375337120c749ff0963`.
Checked first draft byte SHA-256: `8ea35283f8744d09d15464812d000725ad00a68a474a82d157d16efad668b572`.

The later content repair supersedes that draft binding. No second native check or review was run. A JSON parse/count/hash comparison is inventory evidence only, not replacement validation or semantic review.

## First Finding and Targeted Repair

After the structural check, author inspection found that the isometry question asked only about four example coefficients. The internal solution covered all nonzero real k, but the visible response did not directly require the complete coefficient classification requested by source 37.

Preserved first candidate:
`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n46-choice-author/draft.first.json`.
Preservation command receipt `1e36cb`, exit 0: `cp -n .../draft.json .../draft.first.json`, both paths within the authorized root.

Repair 1 changes only `n46-isometry-coefficients` and the corresponding source-37 coverage explanation. It replaces finite coefficient examples with necessary-and-sufficient assertions for all positive and all negative coefficients, together with distinct direction-versus-distance distractors. It updates the internal derivations and key of that same question. No other question, source, image, schema or concept selection changes. This is an author-detected coverage defect and targeted repair, not an independent review verdict.

Read-only comparison receipt `2f4f83` confirms the changed question list contains only `n46-isometry-coefficients`, and the changed coverage source list contains only `37`. The first candidate bytes match the structural check snapshot. No failed candidate or receipt was overwritten or discarded.

## Counts and Coverage

- Sources: 6, exactly 34-39.
- Questions: 11; options: 44; single: 10; multiple: 1. Both snapshots have these counts.
- Seed images: 0; new figures: 0; question/option image references: 0; image opens/reopens/crops/screenshots: 0.
- 34: two whole-plane equation units, one per distinct transform.
- 35: one complete three-symmetry coordinate table.
- 36: one complete three-symmetry image-plane table, with the source's dependence on 35 made explicit through conventions, not hidden answers.
- 37: one complete fixed-point/invariant-line/invariant-plane classification and one all-nonzero-coefficient isometry classification.
- 38: two complete tetrahedron construction algorithms and one paired surface-area-ratio table.
- 39: one complete vertex-centered parallelepiped construction algorithm and one surface-area ratio.

There is no arbitrary item quota or literal answer-slot conversion. Mathematical source subcases are represented; drawing, independent written derivation and proof production remain explicit losses in the draft's coverage. The two solids retain their separately requested ratios; recognizing the area-scaling relationship across them is ordinary mathematical transfer, not a visible key or source mapping.

## Input Bindings

Native byte traces, with exact absolute paths:

- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/book.json`: `81cacdffb0169322660f4dbd224d66d9a135a17107866898a95b41760ca2011b` (native identity/index provenance only).
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n46/lesson.json`: `586647c2b1d69f78c7256e82933c23c977a8e3fff94545bac81da5ce942264ba`.
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n46/exercises.json`: `e71222708729dd8b204a9679d03c352aec6c8454484e23592eeba8eb24fb7fc3`.
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n46/figures.json`: `eb6b515af485904080f97b90a4ec88a92519b337489b93a5ebeabd26d6ef6b83`.

Procedural input hashes for the skill, authoring/contract/review, shared image budget, production-resume and project charters are recorded in report.json; hash receipt `3b0d22`.

## Output Bindings

- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n46-choice-author/seed.json`: byte SHA-256 `45e29c232f6ca61a681105583a7d80054163bba75d30d4f718722a7c139cafb0`; canonical SHA-256 `a19d3814468994c4890c3dc9afd6453bac5547c43e519f312d6f4afae07073b2`.
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n46-choice-author/draft.first.json`: byte SHA-256 `8ea35283f8744d09d15464812d000725ad00a68a474a82d157d16efad668b572`; canonical SHA-256 `b39fd924f485702f6aff62574a17b368da2f297ba9a5f375337120c749ff0963`.
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n46-choice-author/draft.json`: byte SHA-256 `3e5d7214b2d4bc693bf2a2b7e533c5a77f2a9e2e52a678ce27b309ac67ad70dc`; canonical SHA-256 `5c118fc4ef54866c6a0951b15f90d0ebcbfa7999ef4624065852a97752cc89b4`.
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n46-choice-author/report.json`: machine-readable author report; its own byte hash is given in the final textual receipt, not embedded recursively.
- `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n46-choice-author/report.md`: this internal pre-option solution and final author record; final byte hash is recorded in report.json and the final textual receipt.

Canonical JSON SHA-256 uses the native contract's sorted-key, ASCII-escaped, compact representation. Byte hashes bind actual file formatting as well as content.

## Parent-Only Remaining Gates

The current repaired draft awaits independent semantic review, the parent's review-bound native check, and any applicable visual/retention gates. No review.json, semantic approval, finalization, publication, integration or retention was created or claimed. No unresolved mathematical HOLD, technical blocker or failed native command remains; pending parent authorization/evidence is not silently treated as passed.

## Latest Parent Convention Context

The parent subsequently reported the genuine definition text "以O为中心的中心对称将用符号Z_0表示" in
`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s2-n14/lesson.md`,
with provenance in
`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0056/page.json`,
and reported corroborating center-symmetry notation in N15.

This is recorded solely as direct parent-provided context. These additional files were not opened, hashed, independently interpreted, added to the native seed or self-admitted as new authority. There was no unresolved symbol HOLD in this author candidate to invoke the conditional extra-input procedure. The parent's independent interpretation remains its own gate.

N46's literal lowercase `z_0` remains unchanged in the native seed and in the visible explanation of that notation. No draft content changed on receiving this note. First candidate and receipts remain intact; cumulative content findings, repairs and draft revisions remain 1. Report updates do not reset or increment the draft-content revision counter.
