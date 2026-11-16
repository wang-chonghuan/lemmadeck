# STEMROBIN-184: 6-8g p64-p67, independent Stage B

2026-11-16. Sole independent reviewer; Halley's AUTHOR is separate. This is the single Stage B comparison, after explicit parent disclosure. The original Stage A freeze remains unchanged and is the ONLY full-source text/figure baseline. No native page was reopened.

## Evidence binding

- Stage A: `.intentfold/tickets/STEMROBIN-184/tmp/source-geo68-p64-p67-independent-source-first.md`, SHA-256 `5671969b33ac88f301beb1e7ce4a68269b5d32d1b127b5ac5b9196d84aed3fca`.
- Disclosed AUTHOR is in repo-root `tmp/source-geo68-p64-p67-author.md`, NOT ticket tmp; SHA-256 `b320389dc1959499c79ba2b7089c932e2e601dd6ae0d3d27067af973cafacc8f`.
- Disclosed author manifest: repo-root `tmp/source-geo68-p64-p67-author.manifest.json`, SHA-256 `47ff0388b1721c5ddd8c1bc1b87b2742da1a5625f25006c50afa1227237d2a0e`.
- All three hashes matched the parent's disclosed bindings. All four current durable page MD hashes and all four actual-crop hashes matched the author manifest. Page MD native-render hashes also match Stage A.
- Full text and block markers of the four disclosed durable page MD files were read. Crop paths came from `image_batch.views` with kind `actual_post_finalize_crop`; each of the four actual crops was opened once. Four Stage A native images plus four Stage B crops exhaust this batch's eight-image allowance; no further images are authorized here.
- Prior first-finalize PASS evidence `26/18/25/22` is accepted from the parent and disclosed author manifest, NOT regenerated or used as independent text/figure proof. No finalize/count/diagnostic/validator/new gate was run.

## Observed Differences

1. **D1, low severity: nonliteral punctuation.** Durable p0064 `page.md:58` has `无关，也就是说`, whereas the frozen printed row is `无关. 也就是说`. Durable p0067 `page.md:77-78` separates 179(2)'s lettered conditions with semicolons; Stage A has commas after `不相交` and `切`. These are identifiable full-text transcription differences, not missing subparts or claimed mathematical-answer errors. Source-fidelity agreement is not byte/verbatim punctuation agreement. No correction was made.
2. **D2, low severity: inequality glyph representation.** Durable p0065 `page.md:62-63` uses `\leq` and `\geq`; Stage A recorded the printed slanted forms `\leqslant` and `\geqslant`. The non-strict comparison directions are preserved; this finding is about literal source glyph shape, not a changed mathematical relation. No normalization policy is newly inferred or enforced by this review.

## Unresolved / Scope Limits

- **L1, 160 bars UNKNOWN:** durable p0064 `page.md:94` retains `AD<|AB|+|BC|+|CD|`, with no added left-member bars and no registered erratum. This complies with the frozen literal reading. Whether the source has missing/faint flanking bars remains UNKNOWN; the author's categorical “no bars” note is not independent resolution.
- **L2, 164 word UNKNOWN:** durable p0065 `page.md:91` supplies `下列数据的闭折线`; Stage A froze `下列数[UNKNOWN]的闭折线`. “数据” remains the AUTHOR candidate, not an independently confirmed source reading. All printed number/unit groups match the freeze, but that word cannot receive an unqualified source-text match. None of the permitted figure crops contains this text, and no extra text crop/native reopen was taken.
- **L3, 154(2) faint intersection:** durable p0064 `page.md:53` has `\cap`, matching Stage A's provisional reading. The frozen degraded-ink uncertainty is retained; author agreement alone does not resolve it.
- **L4, 166 literal lock:** durable p0066 `page.md:45-47` retains `七段 / 7a / 棱长a / 正方形`. It agrees with Stage A. No silent cube repair, answer solving or confirmed erratum is claimed.
- **L5, object closure is not unit completion:** 175 is open at physical 66 and continued/closed at 67. 181 is locally closed, not a chapter-end or whole-supplementary-unit completion claim. No page 68/69, old source/figure/HOLD or previous durable page was reopened/reapproved.
- **L6, assembly/display not exercised:** fig 79 belongs semantically to 175 by the frozen source and its text reference; the MD places its pixels/caption after 176, consistent with the physical shared-row layout. This review confirms source text/reference and `samerow`, not downstream assembled figure ownership, media resolution or learner rendering. No assembly, app/browser or new acceptance gate was invoked.

## Full-Text / Marker Comparison

Paths in this table are under `ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/`; source comparison is exclusively to the original Stage A.

| Durable MD | Compared objects and markers | Result within this review |
|---|---|---|
| `0064/page.md:50-97` | 154's five circle/circumference operations; 155's ratio with the sole actual formula fold `x_1:↵x_2`; 156; all of 157's prose/parts, with same-page `ex 157 open` -> fig 76 -> `cap samerow` -> `ex 157 cont`; 158 number group `1,5,6,8,10`; 159; displayed 160; folio 54 | No omitted object, request, given value or printed-row boundary detected. D1 and L1/L3 remain. The 155 folded formula preserves the two printed rows rather than omitting one. |
| `0065/page.md:60-96` | All four 161 conditions; both full 162 parts including changed origin/direction/unit and both point/distance lists; numbered figs 77/78 and separate captions; both 163 requests; all three 164 length groups and wrapped rows; folio 55 | No omitted subpart, point request, distance request, length or unit detected. D2 and L2 remain. No open/cont or shared-row caption invented. |
| `0066/page.md:39-86` | All of 165-174; literal 166; 167's two propositions; single-row fraction in 170; split `两圆` / `周` in 173; all four 174 triples in original order; `ex 175 open` ending at `圆环(图`; folio 56; no fig block | Matches frozen content/row boundaries and open boundary, subject to L4. No figure 79 pixels/caption falsely assigned to this physical page. |
| `0067/page.md:49-91` | Three-row `ex 175 cont` closure; all of 176-181; fig 79 and `cap samerow`; all three 177 requests; both 178 cases; both 179 parts and Cyrillic а/б/в; 180's ordered AB/BC/AC = 4/5/6 cm and external tangency; 181's common M, FIRST-TWO internal tangency, distance list and collinearity request; folio 57 | No omitted object, given, lettered condition or fabricated continuation detected. D1 and L5/L6 remain. No unprinted radius order or chapter-completion assertion accepted. |

Space insertion, `$...$` delimiters, subscript LaTeX, `\mathrm{cm}` and the actual `↵` formula fold were treated as transcription representation, not added answers. Cyrillic exercise sublabels agree with the frozen subpart sequences.

## Four Actual Crops

Only the following PNGs were viewed in Stage B, all once, all hash-bound in the companion manifest:

| Crop | Independent observation against Stage A |
|---|---|
| `.tmp/ld-s10y-lesson/6-8g/pages/0064/figures/fig-76.png` | A/B/C/D/E/F/G and all ten frozen road/value pairs retained: AF 8, FB 2, BC 5, BD 6, CD 2, DE 5, CE 2, EG 3, GA 4, AC 5. Small outlined F retained. No added directed road, shortest-path value or answer marking. |
| `.tmp/ld-s10y-lesson/6-8g/pages/0065/figures/fig-77.png` | Whole 16-column/7-row lattice, heavy source row, six points in A/B/O/E/D/C order and frozen vertical-grid positions retained; C remains on the right boundary. No added numeric ticks/coordinates or arrows. |
| `.tmp/ld-s10y-lesson/6-8g/pages/0065/figures/fig-78.png` | Both frozen 16-glyph Cyrillic rows retained as source strokes. Detached Й mark, separate Ы upright, Д/Ц/Щ tails, loops/crossings and angular glyph forms are visible. No font substitution or selection of 163 answers. |
| `.tmp/ld-s10y-lesson/6-8g/pages/0067/figures/fig-79.png` | Annulus boundaries, blank center, source diagonal hatching and unequal vertically tangent outlines retained, with both а)/б) marks. Existing weak source strokes remain weak, not repaired. No centers, radii or answer labels added. |

No crop-fidelity discrepancy was observed against the frozen figure inventory. Main numbered captions being separate MD blocks is consistent with Stage A, not a crop omission.

## Close

One Stage B completed with the two identified literal-fidelity differences and the explicit unresolved/scope limits above. No missing exercise/subpart/value/figure was detected within the frozen comparison. This is NOT an unqualified full-source PASS, a new gate, a promotion decision or whole-unit completion.

Only this ticket-tmp review and its companion manifest were written. Stage A, Halley's AUTHOR/package, durable pages, crops and other agents' work were left untouched. No repair, finalize, page count, exclusion, source/tool/Git/DB/browser operation or further image load was performed.
