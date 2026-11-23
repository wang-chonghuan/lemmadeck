# Count diagnosis: physical 9c pages 0046-0049

Date: 2026-11-23. Sole cwd:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
This is diagnosis only. All originals, source candidates and first failures are
unchanged. No finalizer was replayed. No helper was repaired, count overridden,
source text changed or exclusion added to page metadata. Parent authorization
and independent candidate comparison remain prerequisites for any changes.

N11 ends at exercise 89, before the supplement heading on physical 0049.
Physical 0050/0051 are not N11 and were neither read nor processed.
The page-0049 native count nevertheless includes the supplement already present
on that physical page; its exercise-91 annotation is distinguished below from
N11's content.

## Method and Evidence

The unchanged existing `layout.ink_mask` and `layout.line_bands` were called on
the existing PNG bytes, using the same original ink-derived `content_width`
(1623) as native finalize. The helper's internal left/right trim is 16 px.
Existing `scipy.ndimage.label`/`find_objects` supplied connected-component
bounds and ink areas. Unaltered band totals agree with the four saved native
audits: 25, 25, 26, 22; this is not a finalizer rerun.

Coordinate convention: source-pixel origin at top left; row y endpoints are
inclusive; boxes are `[x, y, width, height]`, with exclusive upper bounds.
Component identifiers in `crop-component-facts.json` refer to the full,
untrimmed source ink labels; those in `native-count-facts.json` refer instead
to the helper's 16-px edge-trimmed copy.

Four precisely localized, unscaled source crops were opened once each. There
were no full-page reopens, grids, montages or additional image payloads.
The earlier physical-wrap freeze, not a desired total, supplies text/object
ownership. Diagnostic mask comparisons operate only on transient ink copies;
their totals are not approved native page statuses.

## Affected Native Rows

| Page | Native row / y inclusive | Cause and source ownership |
| --- | --- | --- |
| 0046 | row 23, y=2037-2049 | Thin genuine instructional-footnote separator, not an extra prose line. Full-source CC 899: `[225,2036,470,14]`, 3108 ink pixels. |
| 0047 | row 25, y=2338-2380 | Bottom-edge scan trace well below the footer. Main full-source CC 818: `[0,2334,1575,47]`, 15900 ink pixels; neighboring tiny edge marks extend the union to x=1595. |
| 0048 | row 9, y=813-868 | Far-left blotch in the gap before the centered exercise heading. Full-source CC 334: `[0,811,52,71]`, 2832 ink pixels. |
| 0049 | row 9, y=842-887 | Far-right solid blotch after exercise 89, before the supplement heading. Full-source CC 282: `[1562,843,47,45]`, 1540 ink pixels. |
| 0049 | rows 15-16, y=1520-1583 and 1584-1648 | The single printed physical row containing exercise 91а/б is split into two native bands on the annotated input. The second band contains printed denominator glyphs and handwriting, not a new printed subquestion or a source formula wrap. |

### Wrap and Object Mapping

- 0046 native rows 1-22 match frozen physical lines 1-22. Native row 23 is
  the separator; row 24 at y=2077-2113 is the genuine `* 用对数计算.` note,
  frozen line 23. Row 25 at y=2161-2191 is the footer, frozen line 24.
  Preserve the note and separator provenance; do not label the note as noise.
- 0047 native rows 1-24 match the frozen 24 printed lines. Only native row 25
  is additional. Other far-right blotches overlap existing formula/body bands
  but do not add separate native rows in this run.
- 0048 native rows 1-8 match frozen lines 1-8. Native row 9 is the blotch;
  row 10 at y=869-924 contains the heading plus the blotch's lower tail.
  Rows 10-26 correspond to frozen lines 9-25. Removing only the blotch in
  a diagnostic copy leaves the heading intact.
- 0049 native rows 1-8 match the N11 exercises 87-89. Row 9 is the blotch.
  Row 10 at y=979-1024 is the supplement heading, frozen line 9. The
  annotation-related split occurs later in supplement exercise 91, not N11.
  No source-supported additional print line or math-wrap marker is missing.

## Proposed Eligible Boxes

These proposals come from actual component geometry plus source-object
inspection, not from the count differences. They are proposals only.

| Page | Kind | Exact box | Justification / retained source |
| --- | --- | --- | --- |
| 0046 | `separator-rule` | `[225,2036,470,14]` | Only the inspected thin horizontal separator. It stops at y=2049; the teaching note starts at y=2077. No note, prose, math or figure is masked. |
| 0047 | `scan-artifact` | `[0,2334,1596,47]` | Exact ink union of the inspected bottom-edge trace/marks. Confined to the bottom 5% of the 2381-px page, below the footer ending y=2169; no source text/math/figure there. |
| 0048 | `scan-artifact` | `[0,811,52,71]` | Exact far-left blotch component. Right edge x=52 lies within the 5% left margin (84.75 px), far from body/heading glyphs. The centered heading is retained. |
| 0049 | `scan-artifact` | `[1562,843,47,45]` | Exact far-right blotch. Left edge x=1562 is beyond the 90% boundary (1525.5 px), separate from the last printed exercise-89 line and later centered heading. Supported by the frozen original/independent source inventory and original component pixels; no additional blotch crop was opened. |

All four proposal geometries are accepted by unchanged `layout.counting_ink`.
In-memory attribution observations with each proposed object removed, keeping
the original content-width input:

| Page | Unaltered helper count | Diagnostic-copy count | Interpretation |
| --- | --- | --- | --- |
| 0046 | 25 | 24 | One genuine non-text separator adds one native band. |
| 0047 | 25 | 24 | Bottom-edge trace adds one native band. |
| 0048 | 26 | 25 | Far-left blotch adds one native band. |
| 0049 | 22 | 21 | Far-right blotch accounts for one band only; annotation issue remains. |

No other margin boxes are proposed merely to tidy the page. The saved native
finalize statuses remain FAIL with original native/MD counts 25/24, 25/24,
26/25 and 22/20.

## Annotation and Provenance HOLD

### 0049 Handwriting

The localized crop confirms handwriting separate from printed exercise 91б.
Four handwriting CCs have full-source bounds:

```text
476 [1252,1592,32,40] 321 ink pixels
479 [1231,1603,8,39]  145 ink pixels
481 [1160,1614,30,46] 457 ink pixels
482 [1199,1617,22,34] 220 ink pixels
```

Their union is `[1160,1592,124,68]`, totaling 1143 ink pixels. This union is
**not an exclusion proposal**. It also contains 27 non-handwriting ink pixels
from the printed semicolon after `420`, whose lower CC 466 has bounds
`[1207,1579,11,18]` and total area 140. A rectangular annotation removal would
damage printed punctuation. It is also internal to the page, not a permissible
far-margin `scan-artifact`, and not a thin `separator-rule`.

For causal diagnosis only, removing exactly the four handwriting CCs from an
ink copy, after the proposed far-right blotch removal, restores the printed
formula band to y=1520-1621 and leaves the next в) formula at y=1651-1748.
The helper then counts 20 bands, without deleting denominator or semicolon
pixels. This demonstrates annotation-induced segmentation: the annotated
input double-counts a genuine single formula row. It does **not** demonstrate a
clean-source fraction-counter defect requiring a general tool repair.

Treatment of internal handwriting remains a provenance/policy HOLD; no
allowable exclusion is proposed for it. Its intended handwritten comparison
or answer is not adjudicated and does not change printed mathematics.

### 0048 Underline

The wavy strokes beneath `集合论` have CC bounds
`[1231,401,47,8]`, `[1280,400,46,8]`, `[1327,401,46,7]` (199, 189, 171 ink
pixels). They lie under internal body text and are included in native row 3
at y=347-407 rather than adding a separate native row. They are not the cause
of the page's extra count.

The earlier freeze called the strokes printed emphasis; that provenance is
not established by pixel shape alone and the current human instruction marks
it uncertain. Preserve the original freeze and candidate as-is. Current
diagnostic provenance is HOLD, with no scan-artifact/separator-rule box
proposed. No extra image was opened to resolve this non-causal uncertainty.

## New Artifacts

All new files are confined to:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n11/author4649/count-diagnostic/`

```text
count-diagnostic.md
native-count-facts.json
crop-component-facts.json
count-attribution.json
collect-count-facts.py
make-local-crops.py
test-count-attribution.py
0046-footnote-separator.png
0047-bottom-edge.png
0048-left-blotch-heading.png
0049-ex91-fractions-annotation.png
```

The three diagnostic-only scripts retain exact reproducible evidence-generation
recipes; none changes the page finalizer or shared tools. Source/crop hashes,
component bounds, original audits and observed comparison bands are retained
in the JSON data.

## Image Ledger and Stop

Prior visual opens: 4/8 (original pages once each).
New visual opens: 4 localized crops, once each.
**Cumulative visual opens: 8/8.** No reopens, grids or full-page images in this
continuation. Programmatic pixel reads for numeric diagnosis are not additional
image payloads in model context.

Diagnosis complete; eligible box proposals await parent comparison and
authorization. No source/first-failure edits, finalize replays, tool repairs,
assembly, adaptation, promotion, publication or other-agent actions occurred.
No process remains running. Stop.
