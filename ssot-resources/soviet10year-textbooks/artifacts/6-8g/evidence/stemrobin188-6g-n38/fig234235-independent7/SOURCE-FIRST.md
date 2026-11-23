# SOURCE-FIRST

Ticket: STEMROBIN-188. Offline, finish=review.
Reviewer scope: new bounded independent review of fig-234 and fig-235 only.
Phase: original pixels and authoritative edition text, before any candidate
disclosure. This is not a final figure PASS, a replacement of a prior review,
or authorization to promote, publish, commit, or reopen images.

## Inputs And Isolation

Sole working directory:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
Only owned directory:
`.intentfold/tickets/STEMROBIN-188/tmp/n38-fig234235-independent7`.

Both canonical PNG hashes matched the human-supplied hashes before opening:

- `ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-234.png`:
  `591754f84242a6e0ba18eef352a6acfd6bc9f2f29cc2b8d0c6526338e40788b3`.
- `ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-235.png`:
  `a25712949bf83f2da5a035f26370ca99455bb8918914cc9dc62e89c4e6f97154`.

Read the installed image SKILL, FigureSpec reference, quality gate, and lesson
production-resume. No freshness, bootstrap, install, renderer, shared-tool
execution, browser, app, Git, environment, DB, paid call, other agent, message,
timer, or promotion was used.

Parsed only the two named modern templates and disclosed their text projection.
Prose, title, and exercise text were read in full; figure metadata and
answer/standard/choice branches were excluded. Raw hashes bind the original
template bytes, not a claim to have inspected their non-text fields:

- `lesson.template.json`:
  `9f61dabc64e3545533685aa2026402ccc7431ca42e78d791532b7c264bae5d9b`.
  Text projection SHA-256:
  `a33b7cf91eef3af9272cc26cc470790fa24bfb51458cf4da20cca72c78c2a133`.
- `exercises.template.json`:
  `ebb0a3a864771163705b9c6f441deedbab5d1e611992e63439da11c328784f60`.
  Text projection SHA-256:
  `4571d8a821b7ee531fac730eb31f4309d7e338bcf968b8905b5bfad583f5f720`.

The supplied independent text PASS was accepted as supplied, not rerun.
Reading the lesson's theorem proofs is edition context, not reading an answer
key or solving/reviewing exercise answers. Textual references to other figures
do not authorize opening those figures; none was opened.

## Fig-234: Independent Pixel Inventory

There is one unframed diagram, not a multi-panel composition.

Stable positional aliases, independent of old Unicode identities:

- `f234-left-base`: left end of the horizontal baseline and triangle corner.
  A nearby dark main glyph lies to its left/below.
- `f234-upper`: high, far-right triangle corner. A nearby main glyph is above it.
- `f234-base-junction`: lower-right triangle corner, where the descending side
  meets the baseline. A nearby main glyph is below it.
- `f234-extension-end`: right end of the baseline extension. A nearby main
  glyph is below/right. It is not a fourth triangle vertex.

The boundary comprises left-base to upper, upper to base-junction, and
base-junction to left-base. The baseline continues from base-junction to the
right-hand extension end. It does not continue visibly to the left of the
left-base corner. There are no intentional standalone vertex dots, arrowheads,
spokes, grid, numerical values, or axis.

Angle marks from the original single opening:

- Two nested curved strokes at the left-base corner, inside the triangle
  between the ascending side and the rightward baseline.
- Three nested curved strokes at the upper corner, inside the triangle
  between its two descending sides.
- One curved stroke at the base-junction, outside the triangle on its right,
  between the ray toward the upper corner and the baseline extension.
- No visible arc in the triangle's interior angle at the base-junction.

The distinct arc multiplicities are visible facts, not evidence that the
marked angles are equal. The left-base and upper corners look acute; the
triangle's base-junction corner looks obtuse and its marked exterior sector
acute. These are qualitative pixel observations, not measured angle givens.
The upper corner is right of the base-junction; the extension end is farther
right still. The triangle interior is above the baseline.

The heavy ascending side has irregular dark/thickened patches, and the fine
stroke ends and label glyph details are not confidently assigned a code,
alphabet, tick meaning, overbar meaning, or cultural role. Keep those roles
UNKNOWN; do not convert scan ink into equality marks or new mathematics.

## Fig-234: Modern Mathematical Requirements

The modern prose at `/prose/16/text` and `/prose/19/text` states the exterior-angle
corollary and its proof. It identifies triangle ABC, exterior angle BCD, interior
angle C, and remote interior angles A and B:

`angle BCD + angle C = 180 degrees`;
`(angle A + angle B) + angle C = 180 degrees`;
therefore `angle BCD = angle A + angle B`.

Bind modern A to `f234-left-base`, B to `f234-upper`, C to
`f234-base-junction`, and D to `f234-extension-end`. This mapping comes from the
text's geometric roles plus pixel positions, not transcription of old glyphs.
A, C, D must be collinear in that order, with C between A and D. B must be
off the baseline, above it. The exterior-angle arc belongs between CB and CD,
not to interior angle BCA. The two remote angle-mark groups remain at A and B.

No numerical angle values, equality of A and B, parallel line, right-angle
mark, equilateral condition, or additional ray is authorized. Modern labels
may be English mathematical labels A, B, C, D. Those are modern roles and do
not resolve the original alphabet.

## Fig-235: Independent Pixel Inventory

There is one unframed, irregular convex seven-sided polygon, not separate
panels or a regular-polygon declaration.

Boundary aliases in clockwise screen order:

1. `f235-v1-upper-left`: near the top, left of the long nearly horizontal edge.
2. `f235-v2-upper-right`: right end of that top edge; the highest corner.
3. `f235-v3-right-middle`: farthest-right corner, near the junction's height.
4. `f235-v4-lower-right`: lower-right corner.
5. `f235-v5-bottom`: lowest corner, left of the interior junction.
6. `f235-v6-left-lower`: lower end of the near-vertical left edge.
7. `f235-v7-left-upper`: upper end of that left edge.

The seven boundary edges are v1-v2, v2-v3, v3-v4, v4-v5, v5-v6,
v6-v7, and v7-v1. One interior common junction,
`f235-interior-junction`, lies right of the left boundary, left of the right
boundary, below the top edge, and above the lower edges.

Seven straight interior segments connect the junction to v1 through v7, one
per vertex. The segment to v3 is almost horizontal to the right. The other
segments reach upper-left, upper-right, lower-right, bottom/down-left,
left-lower, and left-upper respectively. They meet at that one junction and
divide the polygon into seven triangular sectors.

There is one main rounded dark glyph just below the junction, inside the
polygon and between the downward-going segments. There are no discernible
main labels at the seven boundary vertices. No deliberate arc, angle number,
right-angle box, equality tick, arrowhead, circle, grid, or measurement is
visible. The junction is visibly dark where strokes meet; that does not prove
a separately printed point marker.

The outer boundary is heavier and rougher than the spokes. Small irregular
outward/dark ink features are visible especially near the upper-right and
right-middle corners; their exact fine-glyph/black-bar roles are UNKNOWN.
Do not label them as equal-side ticks, right-angle marks, extra vertices,
extra spokes, rays, or cultural symbols. No exact collinearity of opposite
spokes, equal lengths, equal angles, central symmetry, or regularity is
established by these pixels.

## Fig-235: Modern Mathematical Requirements

The modern prose at `/prose/20/text` and `/prose/21/text` states the convex
n-gon interior-angle-sum theorem, `2d(n-2)`, and the interior-point proof.
It requires one arbitrary point O strictly inside the polygon, joined to
every boundary vertex. All these segments stay inside the convex polygon.
They partition it into n triangles with common vertex O.

For this source illustration n is seven: retain all seven boundary corners,
all seven boundary edges, all seven spokes, and the one interior junction.
Bind modern O to `f235-interior-junction` by the prose's interior-point role,
not by identifying the original rounded glyph as Latin O or digit zero.
Keep its label legible within the polygon and away from the dense junction.

The proof requires the sum of the triangle angles to be 2dn, the full turn
around O to be 4d, and the polygon interior sum to be 2dn-4d = 2d(n-2).
These are supplied theorem/proof statements, not figure-specific answer
annotations. Here d is the right-angle unit implied by the lesson's use of
2d for a triangle sum and 4d for a full turn.

Seven sectors need not be equal. O need not be the centroid or center of
symmetry. A modern regularization that makes the polygon regular, imposes
opposite-spoke collinearity, or makes equal angles/lengths would be an addition,
not a source fact. Unnamed boundary vertices need no invented names.

## Unknowns And Later Checks

Original alphabet, code identities, exact fine-glyph readings, and roles of
the irregular dark edge features remain UNKNOWN for both figures. Main
positional labels and geometry are inventoried without silently resolving
these unknowns. They block claims about those old identities, not the
text-authorized modern A/B/C/D and O roles.

Candidate object/assertion mappings, output fidelity, normal-width legibility,
affected preview, display widths, cultural leakage, and final PASS remain
UNASSESSED. No candidate, source-spec, author evidence/output, other
author/reviewer directory, or existing reviewer result has been inspected.
Later disclosure must compare against this sealed inventory without reopening
or cropping these originals.

## Execution And Image Budget

Both `functions.view_image` calls succeeded, in order fig-234 then fig-235,
one opening each. No other image was loaded. Current batch/context usage is
2; ceilings are 8 per batch and 24 per context. Six batch slots remain for
later authorized modern full/normal views and affected preview. No reset or
new batch is claimed.

Actual tool failure: the initial read-only `ls -ld` of this owned directory
returned exit code 1, `No such file or directory`. This is a setup fact, not
a scientific/content FAIL. `apply_patch` creates only the authorized directory
and files. No source or text review was repeated to recover from that failure.
No other tool failure occurred before these source-phase files were written.

Seal `SOURCE-FIRST.md`, `source-first.json`, and `first-seal.json` to mode 0444.
The seal binds the two source hashes, the two raw/text-projection hashes,
installed guidance hashes, the original tool failure, and image usage.
Stop at the sealed-path/hash return, awaiting parent retention confirmation
and candidate disclosure. The parent is not asked to redo source inspection.
