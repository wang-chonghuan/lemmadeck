# Sealed source inventory

Scope: STEMROBIN-188 ACTIVE offline finish=review; bounded author7 only.
Status: AUTHOR_ONLY, source inventory before any FigureSpec draft.
Sole cwd: /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188
No answers, choices, other author directories or review directories were read.
No freshness, installation, bootstrap, DB, environment, Git, app, shared-tool,
agent, message or timer changes are authorized.

## Inputs

- Canonical fig-232.png:
  ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-232.png
  SHA256 d27c7f9fc754bc2e9f761a07ff582b3ee7eed84e2baf160319e97d225f544a42
- Canonical fig-233.png:
  ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-233.png
  SHA256 9a154605af91a9da0d4ffc8425420a6e56331ab74d26f8d28d6697d8e2397a0c
- Authoritative lesson.template.json:
  .tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n38/lesson.template.json
  SHA256 9f61dabc64e3545533685aa2026402ccc7431ca42e78d791532b7c264bae5d9b
- Authoritative exercises.template.json:
  .tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n38/exercises.template.json
  SHA256 ebb0a3a864771163705b9c6f441deedbab5d1e611992e63439da11c328784f60

Both text files were read in full. Neither of the assigned figures is referenced
by an exercise. Relevant modern roles are determined by lesson prose, not by
decoding original labels. Text approval is supplied by the caller, not claimed
by this author.

## Pixel observations: fig-232

One subfigure, no independent panels, axes, grid, numerical dimensions or values.
The main boundary is a convex six-sided polygon: bottom-left corner, left
intermediate corner, upper-left corner, top corner, upper-right corner,
bottom-right corner, returning along the bottom side. The left lower side
continues beyond its intermediate corner toward the upper left; the bottom
side continues left of its bottom-left corner and right of its bottom-right
corner. No separate point disks are clearly printed.

There is a visible curved interior-angle stroke at the bottom-left corner,
between the upward-left side and the bottom side to the right. Its fine extent
and arc-mark semantics are UNKNOWN. Repeated rising-left-to-right oblique
strokes fill the polygon and terminate at its edges; precise fine hatch count
is UNKNOWN from this one inspection. The hatch structure must be represented,
not excluded as decoration. There are letter-like glyphs adjacent to all six
corners and the left bottom extension. Original alphabet/code/fine glyph roles
are UNKNOWN. Any thick/blackbar interpretation is UNKNOWN; none is invented.
The strokes themselves remain geometry/inventory, not a cultural exclusion.

Authoritative text supplies A at the bottom-left vertex, B on its upward-left
side, F at the bottom-right vertex, and G on the opposite extension of AF.
The remaining three letter-like labels have unresolved original identity.
Their visible label slots will be retained as "?", not assigned invented
modern letter roles. Object ids C, D and E denote source positions only.

## Pixel observations: fig-233

One shared diagram, no independent panels, grid, dimensions or given degree
values. A triangle sits on a horizontal lower base, with its third vertex
above the base near the horizontal middle. A second horizontal line passes
through the upper vertex and extends far left and right. Both sloping sides
continue above that common vertex: the left lower-to-upper side continues
upper-right, and the right lower-to-upper side continues upper-left. The upper
extensions are visibly unequal in length. No separate point disks are clearly
printed. Thick, broken and fine scan strokes do not establish blackbar roles:
UNKNOWN.

Letter-like glyphs occur at the lower-left vertex, lower-right vertex,
upper/common vertex (below/right), left and right horizontal extents, and both
upper sloping extents. Their original alphabet/code/fine glyph roles are
UNKNOWN. Modern text supplies A, B, C, M, N and F; the upper-left endpoint's
original identity is UNKNOWN. Its visible label slot will be retained as "?".
Object id H denotes that source position only, not a decoded letter role.

Numeral sectors are visibly numbered 1 through 6:

- 1: lower-left triangle interior between the base-right and side-up-right.
- 2: upper triangle interior below C, between the two downward sloping sides.
- 3: lower-right triangle interior between the base-left and side-up-left.
- 4: above/right of C, between horizontal-right and sloping-up-right.
- 5: above C between the two upward sloping extensions.
- 6: above/left of C, between sloping-up-left and horizontal-left.

Curved angle strokes appear in all six numbered sectors. The lower angles
visibly use one stroke at 1, two at 2, and three at 3. The upper sectors appear
to repeat one at 4, two at 5, and a closely packed multi-stroke mark at 6
(fine multiplicity UNKNOWN; planned three-stroke readable rendering remains
provisional). Arc-mark semantics are UNKNOWN from pixels. No extra equality
symbols, numeric angle results, proof equations or parallel-arrow markings
are to be added. The prose already requires the parallel line, extended sides,
and numbered sectors; those are not solution additions.

## Requirement-to-assertion plan

Stable source-position groups precede the spec. Coordinates and readable stroke
spacing are deliberate modern regularization, never literal scan measurements.

| Source group | Required visible objects | Executable assertion plan |
| --- | --- | --- |
| 232-boundary | 232-A, 232-B, 232-C, 232-D, 232-E, 232-F; six polygon edges | connects for every boundary edge; displacement coverage for every vertex; convex/order check in owned supplemental validator |
| 232-extensions | 232-G; bottom-left and bottom-right extension strokes; upper-left continuation stroke | collinear A/F/G; pointOnLine and displacement for both finite continuation endpoints; connects |
| 232-angle | interior curved stroke anchored at A | pointOnCircle for endpoints; pointOnLine endpoints on AB/AF; supplemental arc center/start/end and sector check |
| 232-hatch | repeated parallel clipped oblique strokes inside the polygon | parallel to hatch direction; inside for every hatch endpoint; supplemental nonempty hatch-family check |
| 233-frame | 233-A, 233-B, 233-C, 233-M, 233-N, 233-F, 233-H; base, two sides, horizontal/upper extensions | connects; collinear A/C/F and B/C/H and M/C/N; parallel AB/MN; displacement covers every source-position point |
| 233-sector-1..6 | six numbered labels plus every planned native arc stroke | label inside its own sector container; pointOnCircle and pointOnLine for all arc endpoints; supplemental exact label/arc sector and multiplicity checks |

All applicable point groups require pointRelationships. Supplemental checks
will enforce facts not expressible by a named native assertion without
weakening or changing the installed validator. No hand SVG is permitted.

## Unresolved facts and review boundary

- Original alphabet/code/fine glyph/blackbar roles: UNKNOWN for both sources.
- Fig-232 hatch fine stroke count and fine arc extent/mark semantics: UNKNOWN.
- Fig-233 fine upper-left arc multiplicity and all arc-mark semantics: UNKNOWN.
- Unresolved source-position labels C/D/E in fig-232 and H in fig-233 are
  represented by visible "?" placeholders, not invented original or modern
  letter roles. Their final text requires independent source resolution.
- Source inspection and deterministic checks cannot establish independent
  source-fidelity approval. This author will deliver candidates only.

## Image load ledger at sealing

Batch 1, current context: 2 of maximum 8 batch loads, 2 of maximum 24 context
loads. Load 1: canonical fig-232.png once, complete original. Load 2: canonical
fig-233.png once, complete original. Reopens: 0. Crops: 0. Paid calls: 0.
Later complete modern previews and any failed preview loads must be recorded
in AUTHOR-RECORD, without editing this sealed inventory.

Pre-draft command failure retained: ls -ld of the exact ownedroot exited 1
because the directory did not yet exist. This is not a content verdict.
