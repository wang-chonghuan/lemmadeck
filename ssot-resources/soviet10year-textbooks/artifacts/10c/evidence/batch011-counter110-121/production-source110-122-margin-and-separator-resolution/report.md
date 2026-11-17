# STEMROBIN-184: Bounded Source-Pixel Resolution

Date: 2026-11-17.

## Result

Q1-Q4 have conclusive content classifications and narrowly bounded, count-only exclusion candidates. Q5 remains unresolved: neither inspected page-122 crop contains the requested sentence separator. No separator transcription is asserted.

This is an evidence report, not an extraction, count audit, exclusion application, acceptance decision, or handoff. No source content was edited, no expected count was supplied, and no exclusion was applied.

## Authority and Boundaries

- Existing invocation only; no setup or skill update.
- Read `.claude/skills/ld-s10y-lesson/SKILL.md`, including cap1, and `.agents/skills/ld-s10y-image/SKILL.md`, including Image batches.
- Read the repository entry instructions and engineering charter; performed no ticket-backend or workflow operations.
- Image inputs were exclusively the five original PNG paths listed below. Originals were decoded for native rectangular crops but never displayed to the model.
- Every image-bearing load was one new, individual, unresized PNG crop at original detail. Eight distinct crops were loaded once each; no crop file was reopened.
- Two context crops overlap earlier crop rectangles. They are independently generated native rectangles, not reopens of earlier files. The second Q1 crop supplies the footer missing from the first; the second Q3 crop supplies the right ends of the footnote lines missing from the first.
- No whole-page display, resize, enhancement, montage, OCR, external lookup, count test, math solving, Git, database, publishing, other-chat, or production tool-code change was performed. The only new code is the authorized local crop helper.
- Source/crop dimensions, SHA-256 hashes, native XYWH, and saved-versus-original decoded pixel equality were emitted before each image load. All eight equality checks passed.
- The parent-reported permanent image budget is 24/24. This report transfers text paths and hashes only; it does not authorize any parent image load.

## Coordinate Convention

All boxes are zero-based native `[x,y,w,h]`, with exclusive right/bottom boundaries `x+w,y+h`. Inclusive ranges supplied in the questions are converted explicitly below. Candidate geometry follows those supplied dispute spans; it is not claimed to be an automatically measured connected-component boundary.

## Original PNG Identity

All five originals are RGB, 1695 x 2580 pixels.

### Page 110

Path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c110-113/10c/pages/0110/page.png`

SHA-256: `6568b4f13de15cfac55dc4bd41534271e85f5cb59ea19c932af79cfecb8b77b7`

### Page 114

Path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117/10c/pages/0114/page.png`

SHA-256: `2980fbc008cd2659ebe3d679425d8c06fa03a3ea31de4acf72e69f73362f730f`

### Page 117

Path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117/10c/pages/0117/page.png`

SHA-256: `0cb266fa62ecab5b0d5587233b13ee77e817179dea55d252181ef3b97c4b20bb`

### Page 121

Path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121/10c/pages/0121/page.png`

SHA-256: `82505d0db4d3bb0d2609d69938d3957b2e49563e19fd4810a240a69e49782496`

### Page 122

Path: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125/10c/pages/0122/page.png`

SHA-256: `f2b14350ddc99c9330a0de3fcbd531bf4def183e79ec33a0c5fd0dacce501582`

## Q1: Page 110 Bottom Broken Horizontal Mark

Disputed native span: inclusive x=107..544, y=2479..2482; XYWH `[107,2479,438,4]`.

Evidence: `nativecrops/q1-bottom-margin.png`, XYWH `[70,2340,960,210]`, and `nativecrops/q1-footer-separation-context.png`, XYWH `[70,2190,1510,340]`. Resolve these evidence names only below this report's absolute directory; full paths and hashes are in `ledger.md`.

Pixel observation: the disputed mark is a discontinuous, thin, horizontal chain of dark strokes in an otherwise blank lower margin. The larger context separately shows the printed footer `104` with its flanking dots well above this mark, with a broad blank interval between them. A small portion of body mathematics at the top of the context is also separate from the disputed span.

Classification: nontext page-margin scan mark (`scan-artifact`); not source prose, formula, figure, or printed footer. Its physical manufacturing/scanning cause is not inferred.

Conclusive count-only candidate: `{"kind":"scan-artifact","box":[107,2479,438,4]}`.

Safety scope: this rectangle covers only the specified broken margin mark. It does not touch the printed footer or the visible body mathematics. It does not propose removal of every other speck in the margin.

Application: none.

## Q2: Page 114 Lower Sloping Rule and Marks

Disputed native span: inclusive x=16..1601, y=2474..2513; XYWH `[16,2474,1586,40]`.

Evidence: `nativecrops/q2-lower-margin-context.png`, XYWH `[0,2190,1640,370]`.

Pixel observation: a long, slightly downward-sloping, broken horizontal mark runs across the lower blank margin, with a separated thin continuation toward the right. The crop also shows a body-text line and printed footer `108` above the margin marks; neither touches the disputed span. There are additional isolated margin specks outside the proposed rectangle; they are not included in this candidate.

Classification: nontext page-margin scan mark (`scan-artifact`); not a prose line, mathematical minus/fraction bar, source figure, or printed footer. Slope and brokenness describe the observed pixels, not an inferred physical cause.

Conclusive count-only candidate: `{"kind":"scan-artifact","box":[16,2474,1586,40]}`.

Safety scope: the entire proposed rectangle is below the shown body text and footer in their blank lower margin. Geometry is restricted to the supplied disputed span; it does not claim to cover all marks visible in the crop.

Application: none.

## Q3: Page 117 Horizontal Footnote Separator

Disputed native span: inclusive x=245..727, y=1986..1993; XYWH `[245,1986,483,8]`.

Evidence: `nativecrops/q3-footnote-rule-context.png`, XYWH `[225,1940,1230,310]`, and `nativecrops/q3-complete-footnote-context.png`, XYWH `[225,1970,1420,265]`.

Pixel observation: the thin horizontal rule lies above a distinct starred footnote, separated from its first text line by blank paper. The complete context contains the star and the complete right ends of the footnote lines. The note begins `在许多教材里，把具有给定积分限 a 和 b 的积分叫做“定积分”` and contains inline mathematical notation within its actual text; that notation is below, not attached to, the disputed rule.

Classification: source footnote separator (`separator-rule`). The rule is not a mathematical minus sign or fraction bar. The footnote prose and its inline mathematics are actual source content and must remain.

Conclusive count-only candidate: `{"kind":"separator-rule","box":[245,1986,483,8]}`.

Safety scope: only the thin rule's supplied native rectangle is proposed. The star, all footnote glyphs, and all inline mathematics are outside this rectangle. No footnote text is hidden or proposed for exclusion. The first crop's right-edge truncation is an evidence-framing limitation, corrected by the second crop, not a source-text exclusion.

Application: none.

## Q4: Page 121 Far-Left Compact Blot

Disputed native XYWH: `[17,823,15,15]`, equivalent to inclusive x=17..31, y=823..837.

Evidence: `nativecrops/q4-left-margin-blot-context.png`, XYWH `[0,770,400,130]`.

Pixel observation: the disputed mark is one irregular compact dark blot near the extreme left edge. Blank paper surrounds it. The visible beginning of the nearby body-text area is much farther right, in the lower-right part of the context; no stroke connects that text to the blot. The blot does not form a recognizable source character, numeral, mathematical operator, or figure detail in this context.

Classification: isolated nontext page-margin blot (`scan-artifact`), not source content. The physical origin of the blot is not determined.

Conclusive safe count-only candidate: `{"kind":"scan-artifact","box":[17,823,15,15]}`.

Safety scope: this exact 15 x 15 native candidate excludes only the supplied compact blot. It includes no nearby body-text pixels and does not extend across the blank margin to the text.

Application: none.

## Q5: Page 122 Separator After the Specified Phrase

User-supplied locator, not independently transcribed from inspected pixels: paragraph beginning `由上一小节的(2)式可以得到同一个公式`, with the requested separator after `同一个公式` and before `因为`.

Evidence inspected: `nativecrops/q5-upper-paragraph-context.png`, XYWH `[90,130,1430,470]`, and `nativecrops/q5-sentence-separator-context.png`, XYWH `[90,875,1430,530]`.

Pixel observation: the first crop contains the section heading and opening body text, not the requested locator. The second crop contains earlier displayed formulas and adjacent explanatory text; its last complete sentence ends with `坐标`. It does not show the requested phrase, `因为`, or the separator between them.

Status: UNRESOLVED, insufficient target-pixel coverage. This is not a claim that an inspected target glyph is blurry or ambiguous: the target glyph was not observed.

Printed separator transcription: unavailable. Period-versus-colon uncertainty remains explicitly unresolved; neither `.`/`。` nor `:`/`：` is selected. Punctuation elsewhere in the crops and grammatical expectations provide no basis for selecting it.

No ninth image was opened. No fabricated separator, target geometry, or exclusion candidate is supplied.

## Final Scope

All eight image loads and metadata checks are recorded in `ledger.md`. Q1-Q4 candidates are recommendations for later independent consideration only. This resolver applied none of them, computed no content-line count, supplied no expected-count override, changed no source artifact, and performed no finalization or publishing.

Q5 remains an explicitly documented unresolved item. This report is complete as a bounded evidence record, not complete as a five-of-five resolution. No further image load is authorized in this assignment. Await instructions.
