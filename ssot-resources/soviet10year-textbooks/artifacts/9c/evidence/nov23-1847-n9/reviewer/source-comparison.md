# STEMROBIN-184 / 9c N9: first source-to-candidate comparison

Phase B complete, 2026-11-23. One bounded comparison; not a repeated source/math review.
Checkout: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

## Evidence boundary

Compared only `raw/9c/pages/{0038,0039,0040,0041,0042}/{page.md,page.json}`
below `.tmp/stemrobin-184-six/n9-nov23-source3842/`, against my frozen
`source-first.md` and `source-math.md` in this reviewer directory.
Read only the corresponding prepared `9c/pages/{0038,0039,0040,0041}/layout.json`
for the requested band questions. Existing phase-A image observations were retained;
no image was reopened, decoded, cropped, or rendered. Image opens remain **5 total**.

JSON metadata and every block's text/line strings, including `↵`, agree with
the corresponding Markdown representation on all five pages. This is internal
serialization consistency only, not validation of metadata claims, hashes,
printed-line totals, counters, rendering, or a finalizer.

## Specific transcription discrepancies

Locations below are relative to the allowed `raw/9c/pages/` directory.
JSON block/line indices are zero-based. Each discrepancy occurs in BOTH formats.
These are candidate-versus-freeze defects; no new pixel adjudication was attempted.

| ID | Location | Frozen source | Candidate | Finding |
| --- | --- | --- | --- | --- |
| B-01 | `0041/page.md:41`; JSON `blocks[1].lines[0]` | `我们来考查一下` | `我们来考察一下` | Character/word substitution: 查 becomes 察. Meaning is close, literal text differs. |
| B-02 | `0040/page.md:48`; JSON `blocks[2].lines[3]` | `彼此相等而且最大.` | `彼此相等，而且最大.` | Adds a prose comma not in the freeze. |
| B-03 | `0040/page.md:69`; JSON `blocks[6].lines[4]` | `根据题的条件，12-3k=0` | `根据题的条件$12-3k=0$` | Omits the prose comma after 条件; math delimiters do not supply it. |
| B-04 | `0042/page.md:59`; JSON `blocks[4].lines[2]` | `可能”发生，或同另一事件` | `可能”发生；或同另一事件` | Replaces comma with semicolon in the adjacent N10 paragraph. Boundary-only transcription finding, not N10 mathematical review. |

These do not change an equation or exercise requirement. They still prevent an
unqualified literal-prose match. Routine TeX encoding, math spacing, normalized
brackets, and convenient visual label encodings are not treated as extra defects.

## Qualified Matches and Wrapping

| Page | Compared content and result |
| --- | --- |
| 0038 | Opening powers 2/3, powers 4/5, Pascal prose, equation (1), Newton dates/name, A(n), proof parts, cubic premise, and five-line quartic calculation match, subject to `SOURCE-GLYPH-01`. Four `↵` preserve the calculation's five frozen display lines. Three-line name paragraph and all other prose breaks match. First block's continuation is consistent with the supplied prior-page text. |
| 0039 | Coefficient equalities/quartic conclusion, all terms of the general induction step, induction conclusion, Example 1, coefficient definition, corollary introduction, embedded `说明为什么`, and corollaries 1/2 match. Eight `↵` preserve nine general-proof display lines; Example 1's `↵` preserves two. Final `a与b的幂` is correctly open to page 0040. |
| 0040 | Corollary 2 tail, 3/4/5, equation (2), first/second/third term mapping, Examples 2/3, and starred Example 4 task and full ratio match apart from B-02/B-03. Examples 2/3 retain literal `第四项`, T_4, and printed powers; this preserves rather than resolves the ordinal HOLDs. `第` / `四项` wrapping is retained. Last ratio is one physical display line and correctly open to page 0041. |
| 0041 | Ratio continuation, inequalities, mixed number, T_9 conclusion, ordinary-versus-binomial coefficient note, exercise heading, every subpart of 71, full 72, and 73 heading match apart from B-01. The four exercise-71 rows preserve their positions and visible labels; radical bars, 1/3 exponents, negative power, 1/y, a^3-ab, and exponent 31 match. Exercise 73 is correctly open. |
| 0042 | Both 73 subparts and both hints match, with 73 continuation and explicit hint ownership. N9 ends before the two-line `10*` heading. Adjacent historical names/numbers, probability prose/fractions, definition, and closing sentence match except B-04; their frozen prose breaks are retained. No N10 correctness or inclusion approval is given. |

Printed footers 31 through 35 are retained. No additional formula, task-identity,
content omission/addition, or physical wrapping defect was found against this
freeze. Underlines and edge marks are not newly promoted to instructional figures.
This is a qualified comparison, not a blanket candidate PASS.

## Requested Layout Bands

Coordinates are the supplied prepared layout's y bands in its 1695 by 2381
coordinate system. Classification uses the retained original observations,
not band totals or the candidate's artifact notes.

| Page / band | Source-supported classification |
| --- | --- |
| 0038 `[2360,2380]` | Noninstructional bottom edge ink: retained original view shows ragged boundary dirt at the extreme bottom, below footer 31; no prose/formula/task there. |
| 0039 `[50,57]` | **UNKNOWN** whether all detected ink is purely noninstructional edge ink. The freeze does not identify this small top band sufficiently. Absence of a transcribed item there is not proof of artifact status. |
| 0039 `[2338,2378]` | Noninstructional bottom scan-boundary ink, explicitly observed below footer 32. |
| 0040 `[2369,2380]` | Noninstructional extreme-bottom edge flecks/boundary ink in the retained original view, below footer 33; no instructional content there. |
| 0041 `[2356,2380]` | Noninstructional bottom boundary dirt, explicitly observed below footer 34. |
| 0041 `[735,781]` and `[782,827]` | **Instructional parts of ONE physical line/object**, the standalone `T_{k+1}/T_k<1.` fraction. The frozen source has one line after the preceding prose ending `k≥9，`, not two stacked formula rows. Candidate `page.md:44` / JSON `blocks[1].lines[3]` correctly retains one full fraction line. Neither band is edge ink. |

The fraction observation identifies a segmentation/content correspondence only.
It grants no count override, exclusion, counter repair, merge rule, or desired-total approval.

## Preserved HOLDs and Stop

- `SOURCE-GLYPH-01`: candidate's definite b^2 in page 0038 is mathematically
  consistent but does not resolve the frozen worn `[2?]` exponent.
- Physical original Unicode provenance remains unknown for all raster glyphs,
  including C-shaped letters and Cyrillic/Latin-confusable subpart labels.
- `MATH-INDEX-01/02`: literal fourth-term claims in Examples 2/3 remain on HOLD
  for unqualified ordinary-ordinal use. Accurate source transcription is not
  mathematical correction approval. The T_9/ordinary-tenth distinction remains.
- `MATH-ASSUMPTIONS`: retain real-root domains, nonzero reciprocal variables,
  and positive integer n for exercise 73's parity equality. Their absence in
  literal raw transcription is source fidelity, not permission to omit them
  from later mathematical presentation.

Only this new reviewer report was written. No candidate, frozen report, canonical
source, tool, counter, or other worker file was changed. No finalizer,
complete-course certification, or publication approval. **STOP after this first comparison.**
