# n25 independent native-source follow-up

Date: 2026-11-23. SOURCE only. This supplements, never replaces,
original-inventory-freeze.md (SHA-256
1d72e43bf0004ed0ba2759a2c376b23f251f3babb0c0243117cc99976cffc8fa).
Candidate access began only after that freeze was saved.

## Actual native crops

All coordinates are [x,y,width,height] in the original 1695 x 2580,
300-dpi prepared page, without resizing, annotation or candidate-font rendering.
These four crops are the only additional images actually loaded.

| Image load | Canonical file under source-review/original-crops/ | Native box |
|---|---|---|
| 5 | p0116-inertia-and-mass.png | [130,780,1300,490] |
| 6 | p0117-final-ratio-paragraph.png | [250,1940,1290,290] |
| 7 | p0118-intrinsic-property-and-fig79.png | [150,1610,1280,630] |
| 8 | p0119-vector-and-approach-glyph.png | [250,1180,1290,535] |

Final actual loads: four original native pages + four source-only native crops
= 8/8 for this phase and 8/24 in this reviewer's current context.
The author's separately reported image usage is not this reviewer's usage.
No 120 image, separate extracted figure image, candidate rendering or browser
screenshot was loaded. No full page was reopened.

## Literal resolutions

1. 116 S02: a real comma follows 之一. It is not a blank-only separator.
   The current candidate drops that comma.
2. 117 R21: the final character of 离心机械 is 械: the right-hand component
   belongs to 械, not the 由 component of 轴. Current 离心机轴 is a
   transcription defect. Keep the source wording 离心机械.
3. 119 R13: inline v has a short horizontal arrow with a right-pointing head.
   Current `\vec{v}` is source-faithful. R15 has ordinary scalar `v^2`
   and `c^2`; no vector mark is introduced into the displayed formula.
4. 119 R16: the native source reads 超近于, with the 召 component of 超,
   not the 刍 component of 趋. Current 超 is source-faithful.
   This anomalous source wording must not be silently normalized to
   趋近于 or 接近于. It is separate from the historical mass convention.
5. 119 R16: the punctuation after 变大了 is a semicolon, not a comma.
   The candidate's semicolon is correct.
6. 119 R15: the following comma is outside the mass formula; the nested
   fraction, radical, minus sign and powers are one actual printed row.

## Corrections to the initial observation, not to the source

- 117 R02: the freeze over-segmented the long horizontal 一 as an additional
  explanatory dash. The native row reads 单位长度一米, as in the candidate;
  no inserted —— is required. The first observation is not an authoring
  instruction, and remains unchanged.
- Figure 79: the initial description of a base/collar without a rotation
  arrow was incomplete. Native crop 7 shows a curved rotation arrow around
  the lower central shaft, with the shaft end visible below it. Retain this
  arrow. No additional direction, speed or numerical label is inferred.

## Typography adjudication

The source alternates upright body type with visibly distinct slanted/Kai-like
type for terms; Markdown italic is the existing transcription representation.
Ordinary page skew does not explain these within-line differences. The
following are definite missing minima, not permission to italicize entire
paragraphs, headings, captions or uninspected neighbouring lessons.

| Source rows | Definite source distinction |
|---|---|
| 116 S02-S03 | Every 物体 in the first selected paragraph, including the word split at the row break, is in the distinct slanted type. |
| 116 S04-S05 | 物体 at paragraph start, after 例如, and in 用物体 are likewise distinct slanted terms. |
| 116 S07 | 物理 in 六年级物理课程 is distinctly slanted; 质量 separately bears dots. |
| 117 R22 | 物体 after 无论取什么 is distinctly slanted in native crop 6. |
| 118 R19 | Both 物体 after 与 and after 也与 are distinctly slanted in native crop 7. |
| 118 R19-R20 | 物体 in 不管物 / 体怎样 is the same distinct term split across the source rows/figure boundary. |
| 119 R13 | 物体 in 设某静止物体 and in 运动的物体 is distinctly slanted in native crop 8. |
| 119 R16 | 物体 in 物体的质量变大了 is distinctly slanted in native crop 8. |

Preserve the already marked 117 该物体 and subsequent 物体, 118 物理
and paragraph-initial 物体, 119 mass-increase emphasis and exercise 1's
initial 物体. Do not expand italic spans merely because the same term recurs.
This review does not certify arbitrary punctuation-inclusive italic endpoints
outside these definite spans.

116's dots under 质量 and its inverse-ratio sentence, 117's two bold
definition rows, and 119's dotted additive sentence are different source
typographic treatments. The dotted additive sentence starts at 当 in
119 R06 and continues through R07's ending punctuation; it is not an extra
printed row. Current 119 prose has no emphasis markup for it.
The existing extraction convention represents dot emphasis with strong markup;
this is not a claim that the original was bold.

117 R18-R23 and 119 R10-R22 are smaller-type explanatory text, not footnotes,
exercises or separate sublessons. Footer digits 105, 106 and 107 are visibly
slanted/italic in the original native pages; current footers are unmarked.
No new renderer, display gate or source-format extension is prescribed.

## Margin holds

The large irregular outer-margin marks and isolated top/margin specks on
117/118/119 are scan contamination, not legible text, equations, bullets,
additional figures, captions or physical text rows. This conclusion comes
from the original pages' position, irregular shape and absence of alignment
with the printed text; it does not change the row inventories.
Do not remove source pixels from retained originals.

The original author LOCAL HOLD notes and all author snapshots remain untouched.
Resolved issues are adjudicated here rather than erased from their records.

## Source crop identity

Canonical fig-79.png is 582 x 384. Its core corresponds exactly to native
box [842,1807,558,360], with the extractor's existing 12-pixel white padding
on all sides. The RGB core and padded output were compared mechanically and
match the original pixels. Comparing the padded asset directly with an
unpadded 558 x 360 crop initially returned unequal dimensions; the existing
padding contract explains that observation, not a source defect.

The source inventory, complete diagram group, labels, arrow and caption
placement were observed in original native pixels. No extra visual image load
was required for this deterministic file comparison, and no modern figure
output is reviewed or approved.
