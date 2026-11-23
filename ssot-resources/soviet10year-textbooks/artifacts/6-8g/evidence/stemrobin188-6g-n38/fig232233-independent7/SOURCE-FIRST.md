# SOURCE-FIRST: fig-232 and fig-233

Date: 2026-11-23. Ticket: STEMROBIN-188. Offline, finish=review.
Reviewer scope: independent7, SOURCE-FIRST only.
Working root: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.

This is a pre-candidate independent source inventory, NOT a modern figure
approval, FigureSpec, or `ld-s10y-image/review@1`. Modern source-fidelity,
geometry, visual, cultural and display review remain NOT PERFORMED.
Do not treat completion or a matching hash as a figure PASS.

## Inputs and isolation

- Read the installed image SKILL, FigureSpec contract, quality gate and lesson
  `references/production-resume.md`; bindings are in `source-first.json`.
- Read the specified authoritative lesson/exercise templates through a
  text-only projection. Figure-manifest values, candidate images, author
  FigureSpecs, candidate evidence and candidate output directories were not
  inspected. No answer keys or choice artifacts were inspected.
- All 32 lesson prose entries and all 18 exercise texts were read. The relevant
  figure text is the polygon-angle definition and triangle-angle-sum proof.
  Neither fig-232 nor fig-233 occurs in an exercise's `figure_refs`.
  Exercise 491 refers to the proof in words; 505 requests a different proof.
  Other figure IDs appearing in this text were not opened or reviewed.
- The caller's text-content PASS is not figure approval. This phase did not
  redo that content comparison.
- No page/crop-count review, source-page opening, reopen, crop, generation,
  renderer, candidate/answer/choice access, Git, DB, environment read, app,
  install, paid call, new agent, cross-chat message or timer was used.

## Image accounting

Fresh context began with 0 loaded images. One batch, in this order:

1. `view_image` on canonical fig-232.png: successful, 414 x 329.
2. `view_image` on canonical fig-233.png: successful, 464 x 315.

Actual total: 2 images; each original opened exactly once. No unsuccessful
image calls, reopens, crops or previews. Batch limit 8; context limit 24.
Six batch slots are reserved for later authorized previews/affected display;
22 context slots remain arithmetically. Waiting would not reset either count.

Actual first tool failure was a read-only `ls -ld` of this owned evidence
directory: exit 1, "No such file or directory". It preceded writing any
evidence. This was a missing destination, not a source/content verdict.
The requested directory was subsequently created by apply_patch. No other
tool failure occurred before these two inventory files were written.
No earlier reviewer failures/counts were supplied or reset by this reviewer.

## fig-232: independent pixel inventory

Source SHA-256:
`d27c7f9fc754bc2e9f761a07ff582b3ee7eed84e2baf160319e97d225f544a42`.

One connected planar diagram, not multiple subfigures: an irregular,
apparently convex six-sided polygon. Its cyclic vertex order is A-B-C-D-E-F-A.
The edition explicitly names A, B, F and G here. C, D and E below are inventory
aliases for the corresponding visible letter-like glyphs, not additional
names recovered from this edition paragraph. The raster does not establish
any original alphabet or character codes.

| Vertex | Visible position and incident polygon edges |
| --- | --- |
| A | Lower left; AB rises leftward, AF runs rightward with a small rise. |
| B | Left side below C; AB and BC meet here. |
| C | Upper left; BC rises rightward to C, CD rises rightward to D. |
| D | Top; CD and DE meet here. |
| E | Upper right; DE descends rightward, EF descends leftward. |
| F | Lower right; EF and FA meet here. |

All six boundary edges are visible: AB, BC, CD, DE, EF, FA. There are no
diagonals, vertex numbers, given lengths, units, right-angle squares,
equal-length ticks, parallel arrow marks or axes. Vertex ink joins are
visible; no separate circular point markers can be confidently distinguished.

Seven point-label glyphs are present: A below the lower-left vertex, B outside
the left side, C above/left of the upper-left vertex, D above the top vertex,
E right of the upper-right vertex, F below the lower-right vertex, and G
below/left of the left end of the extended lower-edge line. No caption is
present within this canonical PNG.

The lower-edge line continues left of A toward the G-labelled end and right
of F to an unlabelled end. Order along it is G-A-F, with the line visibly
continuing beyond F. AB also continues past B toward an unlabelled
upper-left end. These extensions have no arrowheads. G has no separately
printed dot that fixes an exact coordinate.

One curved angle arc at A lies INSIDE the polygon between rays AB and AF.
There is no numbered angle sector and no separate arc marking angle BAG.
The wedge between AB and AG is OUTSIDE the polygon. AF and AG are opposite
directions along the same lower-edge line. Thus the interior BAF sector and
the exterior BAG sector are adjacent and supplementary, as the edition says.
The other sector formed by rays AB and AF is the reflex complement of the
interior sector; it must not be confused with the smaller BAG exterior angle.

Several thin oblique black strokes cross the polygon's interior, roughly in
one repeated diagonal direction and meeting its boundary. They visually
resemble interior hatching, but their precise printed role is UNKNOWN.
The edition does not state that they are diagonals, a lattice, equal
intervals, parallel givens, measurements or extra polygon edges. Their exact
stroke count and boundary-coincident end fragments are not asserted from
this one unzoomed inspection. Do not invent mathematical semantics for them.
There is no text-given parallel relationship in this figure.

### Edition comparison

The authoritative text names AB and AF as two sides of a convex polygon,
defines the internal sector of their rays as an interior angle, and gives
BAG as an exterior angle adjacent and supplementary to it. The visible
six-vertex boundary, A-centred interior arc, and G-A-F extension support
those relationships. The figure is irregular; regularity or numerical
angles are not given. No source/text geometry contradiction was observed
in these named relationships. This observation is not modern approval.

## fig-233: independent pixel inventory

Source SHA-256:
`9a154605af91a9da0d4ffc8425420a6e56331ab74d26f8d28d6697d8e2397a0c`.

One connected triangle proof diagram with a construction through its apex.
A is lower left, B lower right, C above the base. Boundary edges AB, AC and
BC are all visible. AB is the lower horizontal-looking segment. The
horizontal-looking line through C has M at its left end and N at its right
end. AC continues past C up/right to F; BC continues past C up/left to H.
Source orders are A-C-F, B-C-H, and M-C-N.

Seven point-label glyphs are visible: A beside the lower-left base endpoint,
B beside the lower-right endpoint, C below/right of the common upper
intersection, M left of the upper line, N right of it, H above the
upper-left oblique end, and F above/right of the upper-right oblique end.
The edition explicitly names A, B, C, M, N and F here. H is an inventory
alias for the upper-left H-like glyph, not a name stated in the supplied
proof. None of these source codepoints is verified. In particular, the
H-like glyph cannot establish Latin H versus a visually matching non-Latin
character. No caption is present within the PNG.

The drawn objects are the base segment AB, the upper line MN, and the two
oblique side-plus-extension strokes A-C-F and B-C-H. MN and AB have the same
approximately horizontal direction in the raster. No parallel-arrow symbols
are printed; the parallel relationship is explicitly supplied by the text.
No arrowheads, numerical angle measures, lengths, units, right-angle squares,
equal-length ticks, extra vertices, grids or axes are visible. At C there is
a dark common ink join, not an unambiguous separate point circle. Tiny
light/fine or interrupted radial ink close to the angle arcs is not evidence
of additional rays or an independently meaningful dashed construction.

Every numbered angle sector:

| Number | Vertex and bounding rays | Position | Visible arc strokes |
| --- | --- | --- | --- |
| 1 | A: AB and AC | Above AB, inside triangle at left base | One |
| 2 | C: CA and CB | Below C, inside triangle | Two nested |
| 3 | B: BA and BC | Above AB, inside triangle at right base | Three nested |
| 4 | C: CF and CN | Upper right, above MN | One |
| 5 | C: CH and CF | Above C, between side extensions | Two nested |
| 6 | C: CM and CH | Upper left, above MN | Three nested |

The arc multiplicities are observations from the one source opening. The
equal-angle interpretation is independently grounded in the edition proof,
not merely guessed from the ink convention. At C, unnumbered sectors also
exist below MN to the left and right of the triangle's interior sector.
Do not relocate 4 or 6 into those lower sectors and do not introduce 7 or 8.

### Edition comparison and actual geometric reasoning

The text constructs MN through C parallel to AB and extends AC and BC.
The observed endpoint order places F on AC beyond C and H on BC beyond C.
AF and CF therefore have the same direction. AB and CN also have the same
direction, agreeing with the stated proof of angle 1 = angle 4.

Similarly, BA and CM point left, while BC and CH point up/left, so
angle 3 = angle 6. CA and CF are opposite rays; CB and CH are opposite rays,
so angle 2 and angle 5 are vertical opposite angles. Above MN the successive
sectors are 6 (CM to CH), 5 (CH to CF), then 4 (CF to CN). Their union is
the straight angle MCN, with no overlap or omitted upper sector.
Consequently the source topology supports the edition's 1+2+3 = 4+5+6
and the 180-degree triangle-angle-sum argument.

Raster strokes are not exact Euclidean coordinates. The parallel and
collinear claims above are text-backed relationships whose drawn directions
and order were checked, not exact measurements inferred from pixels.
No source/text contradiction was observed in these relationships. This is
not a candidate geometry, readability, rendering or cultural PASS.

## Unresolved Source Details

- Original glyph alphabet and exact character codes for both figures:
  UNKNOWN. Explicit edition identifiers ground their future Latin-label
  mapping; remaining inventory aliases need a justified mapping. Do not claim
  the PNG proved its encoding.
- fig-232 fine oblique black strokes: precise source role and exact count
  UNKNOWN. Appearance alone does not confer theorem or measurement meaning.
- Very fine ink at fig-233 C: exact printing/overlap role UNKNOWN; the visible
  named line topology and numbered sectors do not require invented objects.
- Precise pixel coordinates, angle degrees, interval equality and separate
  point-dot status beyond the observations above are not established.

## Requirements For A Later Disclosed Candidate

These are independent expectations, not author-spec mappings or approval:

- Preserve fig-232's one convex six-vertex boundary, all A-F labels and edges,
  G-A-F opposite rays, visible side/line extensions and A's internal sector;
  BAG must remain exterior and supplementary, without a new numerical given.
- Preserve fig-233's one shared construction, all seven point identifiers,
  triangle sides, A-C-F/B-C-H/M-C-N orders, MN parallel AB, and the exact
  locations of sectors 1-6. Cover equalities 1=4, 2=5 and 3=6 with substantive
  geometric evidence, not object counts or arc styling alone.
- Resolve changes to fine strokes as explicit modern treatment rather than
  unverified source facts. Original font/handwriting and unknown encodings are
  not a reason to copy non-Latin glyphs into the modern figure.
- Modern render, source-fidelity, label clarity/collision, cultural neutrality,
  actual desktop/mobile media widths and final text size remain unchecked.

Stop here. Await parent confirmation that FIRST is retained and subsequent
explicit disclosure before inspecting any modern candidate.
