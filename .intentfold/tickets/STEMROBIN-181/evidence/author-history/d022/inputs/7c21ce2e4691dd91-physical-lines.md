# Independent SOURCE Review: Physical 212-215

Date: 2026-11-16. Book: 9p. Workspace:
`/Users/yong/.codex/worktrees/00b1/lemmadeck`.

## Decision

| Physical PDF page | Printed page | Independent physical rows | Frozen authored rows | Frozen native masked rows | Frozen-candidate decision |
| --- | --- | --- | --- | --- | --- |
| 212 | 203 | 20 | 20 | 21 | needs-correction: counting metadata only |
| 213 | 204 | 25 | 25 | 25 | pass within this SOURCE scope |
| 214 | 205 | 14 | 14 | 16 | needs-correction: counting metadata only |
| 215 | 206 | 26 | 26 | 26 | pass within this SOURCE scope |

Overall: needs-correction, not PASS. No omitted source text row, missing formula,
wrong figure label, incorrect caption sharing, or incorrect continuation marker
was found. No source text, figure box, crop-padding or counter-code repair is
requested. Nothing is finalized or promoted by this review.

## Evidence Method

Exactly four individual `functions.view_image` calls, each at `detail=original`,
each on the corresponding original `page.grid.png`, once only:

| Order | Absolute image path | Actual SHA-256 |
| --- | --- | --- |
| 1 | `/Users/yong/.codex/worktrees/00b1/lemmadeck/.tmp/ld-s10y-lesson/9p/pages/0212/page.grid.png` | `6eb2b1cbf4149946f2880cd9c8215883aee0f777fe171e84acdaf7373ba20ce2` |
| 2 | `/Users/yong/.codex/worktrees/00b1/lemmadeck/.tmp/ld-s10y-lesson/9p/pages/0213/page.grid.png` | `47ca98582217954a8ddf7c67340369d984edf1792d1b4a2e0f9e5497360c52c6` |
| 3 | `/Users/yong/.codex/worktrees/00b1/lemmadeck/.tmp/ld-s10y-lesson/9p/pages/0214/page.grid.png` | `fe1e683cf21a4191de06f4fa6bc1ec6a13f74a10bd729661bb8a3b85c2e06692` |
| 4 | `/Users/yong/.codex/worktrees/00b1/lemmadeck/.tmp/ld-s10y-lesson/9p/pages/0215/page.grid.png` | `8234672d87a857764051f40b1689c7906623a64cd48f286d0dbfe2bccbfee2ce` |

Fresh-image-context flag remains false as instructed. No earlier context was
reclassified as fresh. This review loaded four images, zero reopens, zero crops,
zero other images. No image payload is forwarded to the main author. Batch
limit eight and context limit twenty-four were not approached.

Each source page is 1504 x 2289 px. Coordinates below use that original pixel
space. The exact integer y intervals are locators from the existing, hash-bound
`author-check.json`, not a new counter invocation or new clean-text bounding-box
measurement. I independently matched each interval to its physical printed row
in the original grid image. Some native locators include emphasis dots, arrow
accents or edge specks; their boundaries need not equal the text-only ink bounds.
False native bands are explicitly separated from real printed rows below.

Candidate line numbers refer to the frozen `NNNN.page.md` under:
`/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d022-source212-215-author/`.

## Physical 212

| Physical row | Saved native y locator, px | Frozen candidate line(s) | Source content |
| --- | --- | --- | --- |
| 1 | 227-267 | 33 | Completes incoming scalar-current sentence; begins conductor discussion |
| 2 | 299-339 | 34 | Left/right current directions; reference 165 |
| 3 | 370-410 | 35 | Distinguishing signed current strengths |
| 4 | 440-480 | 36 | Which direction is positive |
| 5 | 509-551 | 37 | Negative sign; the two directions are equivalent |
| 6 | 580-623 | 38 | Arbitrarily prescribe a positive direction |
| 7 | 651-693 | 39 | Coordinate-axis direction is positive |
| 8 | 721-765 | 40 | Opposite negative; compare current with prescribed direction |
| 9 | 791-833 | 41 | `I>0` and `I<0` |
| 10 | 1185-1215 | 48 and 51 | Captions 165 and 166 share one physical row |
| 11 | 1253-1299 | 54 | Charge, particle density |
| 12 | 1322-1369 | 55 | Directed speed and cross-sectional area, with source bold emphasis |
| 13 | 1392-1441 | 56 | Area `S`; positive left-to-right direction |
| 14 | 1465-1513 | 57 | `q_0`, electron case `q_0=-e`, sections 1 and 2 |
| 15 | 1536-1585 | 58 | `nS\Delta l` particles and density `n` |
| 16 | 1606-1655 | 59 | Reference 166; `q=q_0nS\Delta l`; average motion |
| 17 | 1685-1755 | 60 | Speed `v`; tall inline fraction `\Delta t=\Delta l/v` is ONE row |
| 18 | 1797-1841 | 61 | All particles cross section 2; introduces current formula |
| 19 | 1884-1963 | 64 | Complete tall formula and equation label `(9-2)`, ONE row |
| 20 | 2012-2039 | 67 | Printed footer 203 |

Excluded from the physical-row inventory: native band `y=2149-2181`.
In the original image this is the bottom-right triangular scan shadow
(approximately `x=1405-1503`) and left-edge speck/shadow remnants, below footer
203, not a twenty-first printed line. The central page area contains no text
there. This is edge-ink counting contamination, not an omitted paragraph,
formula denominator row, caption, or figure fragment.

The complete equation is faithfully retained:
`I=q/\Delta t=(q_0nvS\Delta l)/\Delta l=q_0nvS.` with label `(9-2)`.
Do not remove the repeated `\Delta l`, alter the physics, split the inline
fraction into fictitious rows, add a blank row, or change caption `samerow`.

Block rows before the one shared-caption deduction:
`[9,0,0,1,1,8,1,1]`; total 21 minus 1 equals 20.

## Physical 213

| Physical row | Saved native y locator, px | Frozen candidate line(s) | Source content |
| --- | --- | --- | --- |
| 1 | 235-273 | 33 | SI current unit is ampere |
| 2 | 306-345 | 34 | Magnetic interaction defines unit; ammeter |
| 3 | 377-416 | 35 | Seventh-year prior knowledge |
| 4 | 449-484 | 36 | Operating principle |
| 5 | 566-613 | 39 | Printed numbered unit heading 87 |
| 6 | 661-702 | 42 | Free charged particles are necessary; source bold statement |
| 7 | 730-774 | 43 | Bound positive/negative particles in atoms or molecules |
| 8 | 802-842 | 44 | Their displacement cannot form current |
| 9 | 873-915 | 47 | Free charges alone are insufficient |
| 10 | 941-987 | 48 | Ordered motion requires force of a definite direction |
| 11 | 1012-1050 | 49 | End of the source bold force statement |
| 12 | 1083-1142 | 52, before `U+21B5` | Electric force introduction, ending `\vec{F}=` |
| 13 | 1143-1202 | 52, after `U+21B5` | Begins `q\vec{E}.`; internal field maintains ordered motion |
| 14 | 1224-1274 | 53 | Only for charges at rest |
| 15 | 1296-1336 | 54 | Internal field vanishes |
| 16 | 1368-1416 | 57 | Potential difference at conductor ends |
| 17 | 1436-1486 | 58 | Time-independent difference gives steady current |
| 18 | 1508-1557 | 59 | Potential decreases along conductor |
| 19 | 1580-1622 | 60 | Experiment can display that decrease |
| 20 | 1650-1699 | 63 | Horizontally suspended wet wooden strip |
| 21 | 1719-1770 | 64 | It conducts despite not being a good conductor; electrostatic machine |
| 22 | 1792-1840 | 65 | Determine potential relative to earth |
| 23 | 1860-1912 | 66 | Metal foils; one machine electrode grounded |
| 24 | 1932-1984 | 67 | Other electrode at one end; circuit nonclosed; outgoing split word |
| 25 | 2009-2033 | 70 | Printed footer 204 |

No source figure or caption appears. The single wrap marker in candidate
line 52 represents a genuine source split between `\vec{F}=` and `q\vec{E}.`;
the complete formula and its two vector accents are preserved, not inferred.
Four physical lines belong to that paragraph despite three literal file lines.
Block counts are `[4,1,3,3,4,4,5,1]`, total 25. No row correction.

Unit 86 ends with the four-line ampere paragraph. Unit 87 starts only at the
printed heading, not at the page boundary. The last paragraph really remains
open after its final character, joining physical 214.

## Physical 214

| Physical row | Saved native y locator, px | Frozen candidate line(s) | Source content |
| --- | --- | --- | --- |
| 1 | 201-244 | 34 | Completes physical 213 split word; turn machine handle; equal foil angles |
| 2 | 273-316 | 35 | Reference 167; all conductor points have equal potential to earth |
| 3 | 347-387 | 36 | Equilibrium; change to grounding the other end |
| 4 | 418-462 | 37 | Turning machine changes result; earth is conductive |
| 5 | 487-530 | 38 | Grounding closes circuit; starts sentence about grounded end |
| 6 | 967-996 | 43 | Caption 167, its own row |
| 7 | 1408-1435 | 48 | Caption 168, a DIFFERENT row |
| 8 | 1475-1523 | 51 | Grounded-end foil stays closed; potential effectively earth potential |
| 9 | 1546-1593 | 52 | Small drop in metal conductor; machine-connected end |
| 10 | 1617-1675 | 53 | Largest foil opening near machine, reference 168 |
| 11 | 1676-1733 | 54 | Opening decreases away from machine; potential decreases |
| 12 | 1820-1887 | 57 | Printed numbered unit heading 88 |
| 13 | 1914-1962 | 60 | Inline bold internal-field lead and unfinished shape word |
| 14 | 1997-2025 | 63 | Printed footer 205 |

Two native bands have NO printed source text:

1. `y=1230-1346`, saved full-band x extent `1-152`. The visible dense block
   occupies approximately `x=10-55,y=1230-1292`, with separate thin edge marks
   below it around `y=1307-1346`. This sits far left of figure 168, whose
   rough left edge is x=290 and frozen memory-snap left edge x=297.
   The small detached specks within the full extent are also not source
   characters. This is scanning-edge contamination, not the lower apparatus'
   earth lead, foil, caption or text.
2. `y=2152-2177`, below footer 205. The bottom-right triangular scan shadow
   begins approximately x=1435 and reaches the page edge. Sparse left-edge
   marks share this native band. There is no source continuation line here.

The saved x extents include all isolated ink in each native band and are
not the bounding boxes of the dense edge marks. Do not expand figure 168
leftward to swallow the marks or mask all of its vertical span: its genuine
left-hand grounding wire and earth symbol are inside the existing figure.
Do not delete either caption or claim `samerow`; they are at different heights.
Block counts `[5,0,1,0,1,4,1,1,1]` total 14, no samerow deduction.

## Physical 215

| Physical row | Saved native y locator, px | Frozen candidate line(s) | Source content |
| --- | --- | --- | --- |
| 1 | 215-257 | 34 | Completes physical 214 split word; coils and arbitrary bends |
| 2 | 288-329 | 35 | Ammeter: current strength independent of shape |
| 3 | 358-400 | 38 | Fixed current; formula reference `(9-2)` |
| 4 | 432-471 | 39 | Electron directed speed unchanged |
| 5 | 501-541 | 40 | Same speed through conductor section of given diameter |
| 6 | 572-612 | 41 | Ordered electron motion |
| 7 | 642-683 | 42 | Dependence on applied force |
| 8 | 711-777 | 43 | Internal field strength; begins dot-emphasized conclusion |
| 9 | 778-845 | 44 | Equal field strength at all sections |
| 10 | 846-912 | 45 | Does not change when shape changes |
| 11 | 913-979 | 46 and 51 | Length of conductor, ending in field; caption 169 shares this row |
| 12 | 980-1047 | 54 | `\vec{E}` field lines parallel to conductor surface, reference 169 |
| 13 | 1048-1114 | 57 | Hypothetical normal component of `\vec{E}` |
| 14 | 1140-1184 | 58 | Charged particles move toward and accumulate on surface |
| 15 | 1209-1257 | 59 | Their field affects motion |
| 16 | 1282-1322 | 60 | Current could not remain constant |
| 17 | 1352-1399 | 63 | Inline bold external-field lead; electrostatic field |
| 18 | 1422-1472 | 64 | Equipotential surface; potential along current-carrying conductor |
| 19 | 1492-1544 | 65 | Printed reference `(8-31)`; longitudinal `\vec{E}` component |
| 20 | 1560-1614 | 66 | Field lines form an angle with surface |
| 21 | 1636-1676 | 67 | Completes angle statement |
| 22 | 1708-1757 | 70 | Electrostatic machine; wet strip in castor oil |
| 23 | 1780-1828 | 71 | Experiment displays field lines |
| 24 | 1848-1894 | 72 | Rectangular dielectric pieces align with lines |
| 25 | 1922-1970 | 75 | Inline bold field-formation lead; unfinished charge-origin paragraph |
| 26 | 1996-2025 | 78 | Printed footer 206 |

The source emphasis dots belong to existing sentences, not additional lines.
All vector accents and references `(9-2)`, `(8-31)` are retained. Do not
modernize either reference, add answer content, or treat the inline bold
leads as new numbered headings. Block counts
`[2,9,0,1,1,4,5,3,1,1]` total 27 minus the shared caption row equals 26.
No row or text correction.

## Source Figure Bounds and Ownership

The rough boxes below come from the frozen candidates. Memory-snap boxes come
only from the already saved author-check evidence. Neither set was changed
or recomputed. This comparison verifies semantic coverage on the original page,
not fidelity of an extracted crop, vectorization, or a modern figure candidate.
No extracted candidate figure exists in this authored package; none was opened.

| Source figure | Source block | Rough box x,y,w,h | Saved memory-snap x,y,w,h | Source-pixel coverage |
| --- | --- | --- | --- | --- |
| 165 | p0212#2 | 315,960,465,105 | 323,964,453,85 | Both horizontal conductor cylinders, their end rims, and opposite current arrows |
| 166 | p0212#3 | 815,870,425,280 | 826,876,408,272 | Entire cylindrical conductor, shaded end, sections 1/2, dashed/solid section boundaries, vector-v arrow and Delta-l dimension line/arrowheads |
| 167 | p0214#2 | 290,570,1010,370 | 300,577,987,354 | Horizontal strip, five equal-angle foil pairs, two ball-top supports/bases, electrostatic machine, connecting leads and right earth connection; strip's left end is not grounded |
| 168 | p0214#4 | 290,1040,1000,350 | 297,1047,985,334 | Corresponding apparatus with five foil positions, left grounded position closed and progressively greater openings toward machine; both grounding connections and full stands/machine retained |
| 169 | p0215#3 | 880,455,380,440 | 898,466,345,419 | Entire bent/U-shaped conductor, heavy boundaries, nested internal field lines and directed arrows, transverse curved strokes and exterior arrows on both sides |

All five rough boxes contain the relevant original source object. None encloses
its printed caption or neighboring prose. The saved snapped bounds are
consistent with the visibly complete objects; no clipping is visible from this
source-page comparison. Figure 169's outer arrows are part of the source,
not modern additions; preserve them.

Figures 165/166 belong to unit 86 by the first paragraph's reference 165 and
the particle-flow paragraph's reference 166. Their captions share the same row.
Figures 167/168 belong to unit 87 through its experiment, even though unit 88
starts later on physical 214. Their captions are separate rows. Figure 169
belongs to unit 88 and is transparent to its interrupted paragraph, whose
caption shares the last narrow text row. No exercise numbering, owner-ex
binding or invented table is needed on these pages.

Default 12px padding derived from the SAVED boxes would also remain clear of
neighboring prose/captions: figures 165/166 have an inter-crop horizontal gap;
167 ends before caption 167; 168 ends before caption 168; 169 stays right of
the wrapped text and above caption 169. This is coordinate-based guidance
only, not a crop-pixel approval or a request to author/configure crops.

## Cross-Page and Cross-Figure Boundaries

- Physical 211 was read as text only. Its outgoing unit-86 scalar-current
  paragraph is `p open`, ending in the first part of the negative-sign
  phrase. Physical 212 `p cont` supplies its remainder and then completes
  that paragraph after the signed-current conditions.
- Physical 212 ends with complete formula `(9-2)`. Physical 213 correctly
  starts a NEW `p`, not `p cont`, for the SI unit discussion. Unit 86 closes
  immediately before the actual heading 87.
- Physical 213 `p open` ends with the first character of the handle-turning
  word. Physical 214 `p cont open` completes it and remains open through
  figures 167/168 and their captions. Physical 214 `p cont` continues the
  grounded-end sentence and closes the experiment before heading 88.
- Physical 214 unit-88 `p open` ends with the first character of the shape
  word. Physical 215 `p cont` completes the word and that paragraph.
- Physical 215's next `p open` is interrupted by figure 169 and its caption;
  its `p cont` supplies the last full-width field-line sentence.
- Physical 215's final field-origin paragraph is genuinely `p open`,
  without terminal punctuation. Physical 216 was NOT inspected or
  reconstructed. The bounded review does not certify completion of unit 88.
- Footers 203/204/205/206 are standalone `foot` blocks and transparent to
  continuation pairing. No explanatory footnote occurs in this batch.

## Requested Author Repair, Not Applied

Preserve this entire author package, its old candidate bytes, saved native
counts and original freeze. Author corrected successor candidates separately.
Only physical 212 and 214 need repair; 213 and 215 need no changes.

For physical 212, suggest the existing contractual frontmatter object:

```json
{
  "counting": {
    "edge_margin_px": 100,
    "reason": "Independent original-grid SOURCE review: the left 100px and right 100px contain only scanning-edge ink/specks, not printed content. The extra native band y2149-2181 lies below footer203 y2012-2039 and contains triangular edge shadow, not a missing row. Exclude these side strips only in the counting copy; retain all source pixels, body/formula rows, figure boxes and captions."
  }
}
```

For physical 214, suggest:

```json
{
  "counting": {
    "edge_margin_px": 100,
    "reason": "Independent original-grid SOURCE review: the dense left-edge mark around x10-55,y1230-1346 is outside figure168 and has no source text ownership; the extra native band y2152-2177 is below footer205 y1997-2025 and contains edge shadow/specks. The left/right 100px strips contain no printed text, caption, footer or source figure. Exclude only those strips in the counting copy; preserve the complete apparatus and both real caption rows."
  }
}
```

Both suggestions use the ALREADY EXISTING field documented in the frozen cap1
contract, not a new count override or counter change. A 100px edge margin is
6.65% of the 1504px width, below the 10% limit. It retains x in `[100,1404)`.
All printed text, formulas, labels, footer and figures are visibly inside that
retained region. The full native extent x=1-152 on physical 214 includes isolated
non-character specks, not a 152px-wide source text object; removal of the dense
edge mark is the proposed remedy, not a claim that every speck is cleared.

These values have NOT been tested or applied here. Native counter calls by this
review: ZERO. Expected physical targets remain 20 and 14; no configured-native
success is claimed. The author should apply the metadata only to successor
candidates, preserving the old bytes, and supply fresh native evidence for
the affected pages. A later independent affected-only correction review must
validate the resulting counts and unchanged source coverage. If native counts
still disagree, remain correction-required; do not sweep margins, invent rows,
alter tools or claim this initial review approves the repair.
