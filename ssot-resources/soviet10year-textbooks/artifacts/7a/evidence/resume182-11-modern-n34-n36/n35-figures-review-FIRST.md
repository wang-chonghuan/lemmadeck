# n35 Independent Visual Gate FIRST

**Result: PASS for fig-54 and tbl-p0220-01.** No blocking revision found.

This is an independent review of the current candidates, not author self-approval,
promotion, publication, or a durable `review@1` record. All shell commands used
`/Users/yong/.codex/worktrees/d9b1/lemmadeck` as their sole cwd. Only this report,
its JSON companion, and reviewer-owned sibling receipts were written.

## Inspection Boundary

- Read `.agents/skills/ld-s10y-image/SKILL.md` and `references/quality-gate.md`.
- Read the complete current modern n35 `lesson.json` and `exercises.json`
  (754-760), both contexts, specs, render reports, and current SVG text.
- Hashed both original `source.image` PNGs and both completed current previews
  before loading. Opened exactly those four complete images, once each at
  original resolution. No crop, reopen, failed-preview image, or extra image.
- Reused existing mechanical receipts; did not rerun validation or rendering.
- No candidate, source, app, Git, environment, network, database, answer, or
  promotion work was performed.

## fig-54: PASS

The original shows one shared coordinate frame, origin 0, x labels 1-9,
unambiguously readable y labels 1, 2, 3, x/y axis names, positive arrowheads,
and one solid increasing concave-down square-root curve starting at the origin.
The curve stops at the right border, not at x=9, and has no negative-x branch.

Independent full-source comparison agrees with 120 small columns and 62 small
rows, origin at column 10 / row 50 measured from the top, and 0.1-unit cells.
Thus there are 10 columns left of the origin, 110 right, 50 rows above, and
12 below. The regularized candidate preserves that frame. Its current SVG has
121 vertical and 63 horizontal grid lines, including both borders.
Existing numeric scanline evidence is supporting analysis only: its noisy peak
detector reports 117 vertical / 62 horizontal peaks, not an authoritative cell
count. Neither those peak totals nor the candidate object list replaced source
pixel comparison.

**Top y-axis glyph resolution:** only 1, 2, 3 are reliably identifiable numeric
labels in the supplied original. The upper area does not provide a reliably
readable additional numeral amid the grid and scan/bleed marks. I cannot
independently identify a printed 4 there, or prove that an invisible numeral
must exist. The local gate requires preservation of source-visible labels; it
does not mandate inventing an inferred invisible numeral. No missing-source-glyph
revision is justified, and no new upper numeral should be added on this evidence.

The exact curve is an author reconstruction from the authoritative formula,
not a claim of exact printed queried coordinates or a printed endpoint ordinate.
For Bezier parameter u in [0,1], the current raw path and canvas transform give
x=11u^2 and y=sqrt(11)u, hence y=sqrt(x), ending at the source right border x=11.
This algebra is reviewer analysis, not an added figure label. No queried values
or answer annotations from exercises 754/758, A-D points from 755, or distant
prose examples are inserted.

The complete current 640x360 preview visibly contains the actual continuous
curve and complete grid. Axis labels, origin, and formula are readable and
separate; there is no collision or clipping. SVG text is 18/20 px; the existing
640 px render check reports minimum 18 px, no collisions, and status pass.

## tbl-p0220-01: PASS

Original and current complete preview both have exactly 2 rows and 12 columns,
including the first row-label column, with no missing or blank data cell:

| Row | Entries, Left to Right |
| --- | --- |
| x | x, 0, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9 |
| sqrt(x) | sqrt(x), 0, 0.71, 1, 1.41, 1.73, 2, 2.24, 2.45, 2.65, 2.83, 3 |

Every original column pairing is preserved, including 0.5 / 0.71. These are
source table givens, not newly computed exercise answers. The actual SVG has
13 vertical and 3 horizontal boundaries. In the full current 640x320 preview
all 24 labels are readable at 18 px, remain inside their cells, and do not
collide with labels or borders. The existing render report also passes at
640 px with minimum 18 px and no collisions.

## Context and Existing Repairs

The source statement "when x>0, sqrt(x) is meaningful" is a sufficient true
statement, not an iff claim or an erratum. The complete lesson explicitly
includes x=0 in the domain and gives y=0 at the origin. Both figures preserve
that fact; no text or numeric erratum is requested.

Both first renders retain exit 2 and their failed-files evidence: 9 x-axis
label collisions for fig-54, and 1 table row-label collision for tbl-p0220-01.
Each has exactly the preserved targeted label-only repair and render-02 exit 0.
The graph repair changes x-tick label offsets; the table repair removes the
misplaced x row-label offset. They do not change source facts or mathematical
geometry. Existing failures have not been overwritten or reset by this review.

Current source/spec/SVG hashes match their provenance/render bindings. Current
render and preview hashes are recorded independently, rather than substituted
from an older execution receipt. See the JSON companion and
`n35-figures-review-FIRST-receipts/inspection.json` for bindings.

This gate covers the supplied completed 640 px previews. App/offline lesson
verification, durable path rewriting, answer review, and promotion remain
outside this independent visual review.
