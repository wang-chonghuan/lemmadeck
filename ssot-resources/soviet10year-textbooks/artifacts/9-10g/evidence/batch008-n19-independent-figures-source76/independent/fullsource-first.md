# Independent Source-First Freeze: Figures 74-76

## Scope And Separation

- Ticket: STEMROBIN-184.
- Workspace: /Users/yong/.codex/worktrees/a07e/lemmadeck.
- Phase: A only. This is an independent source inventory, not final-output approval.
- Each original PNG was opened individually once, at original resolution, in the order 74, 75, 76. No source reopen, crop, contact sheet, original SVG, modern SVG, author spec, author inventory, author render, or author review was inspected.
- Complete draft lesson and exercise JSON for n18 and n19 was read from the expressly authorized production context-root. The top-level edition prose and exercises, not the embedded transcription alone, determine text-given constraints.
- No answer files, choice material, database, publisher, Git, IntentFold invocation, SkillHost invocation, update, rebase, or official review writer was used.
- Image budget: 3 of 8 opens used. Reserve at most 3 for later per-figure browser comparison composites, and 2 only for a concrete issue that necessitates an additional small inspection.
- Independent observations below predate all final-author artifact disclosure. The parent's later statement that fig-74 exhausted its repair and is HOLD is external workflow information, not an observation made in this review. It does not change this inventory.

## Read Contracts

Read `.agents/skills/ld-s10y-image/SKILL.md`, `references/figure-spec.md`, and `references/quality-gate.md` in full. The binding checks relevant to these figures are:

- Edition text supplies the mathematical meaning; source pixels supply the visual structure.
- Preserve all instructional strokes, arrow directions, names, arrangements, and meaningful intermediate constructions.
- Every semantic arrow requires an executable `connects` relationship. Source-bound points must be covered by relationships within their inventory group, not merely counted.
- An arrowhead must actually render, and its direction and connection must be visually checked.
- Hidden labelled point anchors may represent labels, but may not erase a point marker actually printed in the source.
- Distinguish deliberate modern regularization from source facts. No invented numerical lengths, coordinates, angle marks, or equal-length ticks.
- Use semantic vector roles and actual readable text of at least 16 CSS pixels at all declared media widths, with neutral, accent, and print inspection of current SVG output.
- A validator or a deterministic render pass alone cannot establish source fidelity.

## Frozen Input Paths And Raw SHA-256

All paths below are workspace-relative. `freeze.json` additionally binds absolute paths, exact input bytes, snapshots, and this inventory.

| Input | SHA-256 |
| --- | --- |
| ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-74.png | 389850630f1bb3235a7b6b3706edb3a96f221dd2efb9f15e536424b2aed3ee3c |
| ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-75.png | 6ea7e7639f4a1f7a0a6853382b3547be6967cf9d2eb5c214c4fcabf1dd88df10 |
| ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-76.png | 5e9725824b6fb73536d5650509fac2bdb2027f0f471bd19c9f27117f68ac3b8c |
| .intentfold/tickets/STEMROBIN-184/tmp/n18-n19-production/context-root/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s2-n18/lesson.json | 06f5a9e5c1471ef20d9c056f004213856ca118dd853df30dd282b4f8d7c097ec |
| .intentfold/tickets/STEMROBIN-184/tmp/n18-n19-production/context-root/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s2-n18/exercises.json | ac5146aebad5b8f957d0376287253036aa9e00419ceab272fed4add72b66d89b |
| .intentfold/tickets/STEMROBIN-184/tmp/n18-n19-production/context-root/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s2-n19/lesson.json | 9793aea8ff74f5c3729212b3fd6c7f156f96a38f1174198dba48a222e6134287 |
| .intentfold/tickets/STEMROBIN-184/tmp/n18-n19-production/context-root/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s2-n19/exercises.json | 964aa686a1e629507bacd00f3ea4986da24191b49a930c1fbaf6a7bf8ac16594 |

## Complete Draft Text Context

### n18

All prose blocks were read, including Theorem 9 on composition, its two-point proof and collinear case; vector sum as composition; the triangle rule including collinear or coincident points; the construction using a, b, c and A, B, C; zero, commutative and associative laws; arbitrary ordering/grouping; and the polygon rule. Figures 71-73 are context only and were not opened.

The fig-74 paragraph explicitly gives:

- s = a1 + a2 + a3 + a4.
- An arbitrary starting point A.
- Directed AA1 = a1, A1A2 = a2, A2A3 = a3, and A3A4 = a4, constructed successively.
- Directed AA4 = s.
- Repeated application of the triangle rule is the stated justification.

All seven written exercises 179-185 were read: possible short sums; trapezoid base-vector constructions with a > b; a triangle median identity; an AB/DA identity; a triangle-cycle sum; three tetrahedron sums; and four parallelepiped sums. Every exercise has empty `figure_refs` and `figures` in this draft. None adds a new data requirement to fig-74 or authorizes an exercise solution annotation there. No exercise was solved for purposes of constructing this inventory.

### n19

All prose blocks were read: AB + BA = AA = zero; definition of opposites; equal lengths and reverse directions for nonzero opposites with fig-75; BA = -AB; the c = a + (-b) discussion and c + b = a definition of difference; subtraction as addition of an opposite; the OB - OA = AB formula and its triangle-rule argument with fig-76; and the subsequent M, P, Q identities stated without using a figure.

Fig-75 must illustrate nonzero equal-magnitude opposite vectors. The prose uses the named points A and B in an algebraic example, but the source fig-75 does not label any endpoint A or B.

Fig-76 must illustrate:

- Arbitrary points O, A, B.
- Directed OA + AB = OB.
- Consequently directed AB = OB - OA.
- A common origin O for OA and OB. AB connects their terminal points from A to B, not B to A.

All six written exercises 186-191 were read: opposites from a tetrahedron vertex; a parallelogram implication for O, A, B, C; three vector constructions from an out-of-plane point; a right-triangle sum/difference-length statement and converse; a parallelogram identity from an arbitrary spatial O; and a tetrahedron identity with a four-arbitrary-points extension. Every exercise has empty `figure_refs` and `figures`. They do not add points C, D, M, P, Q or solution constructions to figs 75-76.

These are complete draft-text reads, not whole-lesson approval. The exact JSON snapshots will be retained alongside the freeze. A whitespace-normalized fingerprint of all edition prose text and exercise text/lines is supplemental evidence for the parent's pending n18T1 layout-only patch, not permission to accept future semantic changes silently.

## Figure 74: Independent Pixel Inventory

### Panel And Points

- One unframed panel, white background; no subpanel identifiers, axes, grid, scale, numerical measurements, title or caption within the PNG.
- Five named geometric junctions: A at the bottom-left-ish origin; A1 above and to the right of A; A2 near the lower-right; A3 at the top; A4 at the left, above A.
- Approximate screen anchors, solely to identify source features: A (147,375), A1 (267,278), A2 (371,369), A3 (218,64), A4 (63,229). These are visual estimates, not mathematical coordinates or metric givens.
- Point labels: `A` below the origin; `A1` above the inner upper-right kink; `A2` below/right of the lower-right junction; `A3` above the top junction; `A4` left of the left junction. All five must remain individually associated with their correct junctions.
- Point markers are not confidently separable from the thick strokes/heads at these junctions. No isolated free-standing dot away from the seven arrows is visible. This is not evidence that every endpoint has a separate circular marker.

### Every Geometric Stroke And Head

| Independent ID | Directed stroke | Pixel structure and head |
| --- | --- | --- |
| f74-edge-AA1 | A -> A1 | Heavy straight diagonal rising right; terminal head at A1. |
| f74-edge-A1A2 | A1 -> A2 | Heavy straight diagonal descending right; terminal head at A2. |
| f74-edge-A2A3 | A2 -> A3 | Heavy steep diagonal rising left; terminal head at A3. |
| f74-edge-A3A4 | A3 -> A4 | Heavy diagonal descending left; terminal head at A4. |
| f74-edge-AA4 | A -> A4 | Heavy diagonal rising left; terminal head at A4, distinct from the A3 -> A4 approach. |
| f74-edge-AA2 | A -> A2 | Thin, near-horizontal rising-right internal construction; visible rightward terminal head at A2. |
| f74-edge-AA3 | A -> A3 | Thin, steep rising-right internal construction; visible upward terminal head at A3, distinct from the A2 -> A3 approach. |

Seven semantic arrows total: four chain edges, one result edge, two unlabeled internal construction arrows. The two internal arrows are not additional terms a5/a6 and are not non-directed plain edges. Preserve both, even though the surrounding modern paragraph explicitly names only the four terms and the final result.

The four chain arrows form A -> A1 -> A2 -> A3 -> A4. The result is A -> A4, not A4 -> A. There is no A1 -> A3 or A1 -> A4 stroke and no separate closed return arrow A4 -> A.

### Every Mathematical Label

- Vector `a1`, with an over-arrow, sits above/left of the A -> A1 diagonal within the central region.
- Vector `a2`, with an over-arrow, sits above the shallow A -> A2 construction and near/below the A1 -> A2 chain edge.
- Vector `a3`, with an over-arrow, sits to the right of the steep A2 -> A3 chain edge.
- Vector `a4`, with an over-arrow, sits left of the A3 -> A4 edge.
- Vector `s`, with an over-arrow, sits left of the A -> A4 result edge.
- Thus there are five point-name labels and five vector labels. The five over-arrows on vector names are notation, not additional geometric vectors.
- The internal A -> A2 and A -> A3 arrows have no printed mathematical names or equations.

### Uncertainty And Modern-Text Boundary

- The two thin internal strokes have scan-visible breaks and variable darkness. A -> A2 looks intermittently broken; A -> A3 is also interrupted. This single source opening cannot confidently distinguish a deliberately dashed construction from degraded thin printing. Do not report a definite source dash cadence or definite uniform solidness. Retain their thin/subordinate hierarchy and both terminal heads; keep this uncertainty explicit in later comparison.
- The crowded A2, A3, A4 heads make it unsafe to infer separate marker circles from junction thickness. Labels and all incoming connections remain mandatory irrespective of marker choice.
- No exact angles, lengths, parallelism, equal segment lengths, or numerical coordinates are given. Regularized layout must not be described as a measured source fact.
- The explicit text requires the four named vector displacements and AA4 = s. Source-only additions to that explicit text are the two internal construction arrows and their relative stroke hierarchy.
- Later executable coverage must include all seven `connects` relations, all five named points in mapped internal point relationships, and the four-step chain/result consistency. Approximate screen coordinates above are not permitted as numeric textbook givens.

## Figure 75: Independent Pixel Inventory

### Panel And Endpoints

- One unframed panel containing two vertically separated vector examples. No `(a)`/`(b)` panel identifiers, enclosing frames, common origin, axes, grid, ticks, numerical lengths, title or caption.
- Four unnamed endpoints, arranged as two displaced parallel diagonal segments. There are no printed point-name labels.
- Upper segment: tail near the right (429,108), terminal head near the upper-left (139,18); direction is up-left.
- Lower segment: tail near the left (15,174), terminal head near the lower-right (306,266); direction is down-right.
- Both underlying segments slope downward when followed left to right and appear the same length. Approximate positions are identification aids, not exact measurements.
- No separately printed circular point markers are unambiguously visible; the tails are rounded thick-line endings.

### Every Stroke, Head And Label

- `f75-upper-vector`: one thick straight arrow, right/lower tail -> left/upper head. The head is clearly at the upper-left, not at the right-hand tail.
- `f75-lower-vector`: one thick straight arrow, left/upper tail -> right/lower head. The head is clearly at the lower-right.
- Upper label: vector `a`, with an over-arrow, above the upper stroke near its middle-right.
- Lower label: `-a`, with the minus left of the vector letter and an over-arrow over the `a`, above the lower stroke near its middle.
- Two geometric arrowheads and two mathematical labels total. The notation arrows do not create extra geometric arrows.
- No joining stroke between the two vectors; no result zero vector, self-loop, bracket, length tick, equation, A/B endpoint name, or extra third vector.
- A tiny central dark fleck is not joined to a stroke and has no label. It is scan noise, not an instructional point.

### Text Constraints And Uncertainty

- The modern prose explicitly supplies nonzero magnitude, equal lengths, and opposite directions. Parallelism plus equal length alone is insufficient: the directions must actually be reversed.
- The source vectors are translated apart; they are not two opposing heads on the same segment.
- The source does not label the endpoints A and B despite the adjacent prose's BA = -AB example. Adding those names would be an author addition, not a recovered source label.
- Scan stroke irregularity does not supply a numerical length or exact relative endpoint offset. The robust invariant is equal directed magnitude with a displacement sign reversal.
- Later mathematical evidence needs two `connects` relations, equal-distance evidence, parallelism, and explicit opposite-direction displacement evidence covering all four endpoint anchors. A same-direction pair cannot pass.
- No source/edition conflict in these requirements was observed. Render/readability/colour checks remain completely unperformed.

## Figure 76: Independent Pixel Inventory

### Panel, Points And Markers

- One unframed triangular diagram, no panel identifier, axes, grid, scale, side measurements, angle marks, or caption.
- A is the left junction, approximately (55,217).
- B is the upper-right junction, approximately (357,66).
- O is the lower-right junction, approximately (361,361).
- B and O are nearly vertically aligned; A is left of both and its height is between theirs. This is a source layout fact, not a theorem that OB must be vertical or that the triangle has a special metric shape.
- A label sits left of A; the B label sits above B; the O label sits below/right of O.
- O has a clearly visible filled endpoint dot at the lower-right. Preserve it.
- At A and B, thick arrow-junction ink is visible, but a separate circular point marker is not confidently distinguishable. Do not elevate junction thickness into a count of three unequivocal dots.

### Every Stroke And Head

| Independent ID | Directed stroke | Source head and attachment |
| --- | --- | --- |
| f76-edge-OA | O -> A | Lower diagonal rises left from the O dot; head points into A at the left junction. |
| f76-edge-AB | A -> B | Upper diagonal rises right; head points into B at the upper-right junction. |
| f76-edge-OB | O -> B | Nearly vertical right edge rises from the O dot; head points upward into B, distinct from the A -> B approach. |

Three solid, heavy straight arrows total, three geometric arrowheads, three point names. No fourth side, vector-letter annotation, dotted auxiliary edge, result formula, C point, minus sign, or reverse B -> A arrow appears.

### Labels, Text Constraints And Uncertainty

- The source glyph above the upper-right junction is handwritten/italic and resembles a lower-case `b`; the edition unambiguously names point B. Render the modern mathematical point label as B.
- The lower-right rounded glyph could visually resemble a zero. The edition and geometry unambiguously identify it as capital O, not digit 0.
- The triangular geometry carries no a/b/c vector-letter labels.
- A tiny isolated fleck at upper-left is not a geometric point.
- OA and OB share O as tail. AB has A as tail and B as head. The explicit text requires OA + AB = OB and AB = OB - OA. Reversing any of those edges changes the instructional meaning.
- The source puts two heads at B and one at A; preserve their distinct directional approaches without ambiguity or label interference.
- No equal-length, perpendicularity, or angle assumption may be inferred from this schematic layout. Exact verticality can be a deliberate layout regularization only.
- Later coverage needs all three `connects` assertions and complete point relationships for O, A, B, with independently checked displacement identity. The O dot must not disappear under a hidden-marker convention.
- No source/edition conflict in these requirements was observed. Render/readability/colour checks remain completely unperformed.

## Deferred Phase B

- Stop after this freeze. Do not discover or read the author tree.
- Only explicit parent disclosure can authorize inspecting current final spec, render metadata, and SVG.
- Later prioritize figs 75 and 76 as requested; the external fig-74 repair/HOLD statement is not an independently verified rendering finding.
- At most one full comparison of disclosed current outputs using isolated headless browser screenshots at 640 and 328 CSS-pixel media widths in neutral, accent, and print. Per-figure composites may combine those six cells.
- Do not rerun `render_spec`, reopen source PNGs, restart a gate, or inspect source/answer/choice batches.
- Reuse parent-disclosed author-check logs; any additional checks must be pure assertions and browser observations, once.
- No user profile, CDP, window, OS input, PWDEBUG, or headed HTML preview.
- Reports return paths, hashes and textual observations only, with hash-bound per-figure PASS/HOLD. No image payload goes to the parent.
- No official `record_review`, product promotion, source edit/exclusion/finalization, or whole-lesson approval is authorized.

## Present Disposition

Figures 74, 75 and 76: HOLD for independent final-output review, solely because Phase B is not authorized and no current modern output has been inspected. Source-first inventory is complete. This is not an independent assertion that a current final figure fails.
