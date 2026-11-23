# STEMROBIN-188 n38 Display Review7

Status: **HOLD**. Finish: review. Date: 2026-11-23.

Sole cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
Owned output: `.intentfold/tickets/STEMROBIN-188/tmp/n38-exercises-display-independent7`.
Complete bounded EXERCISES and read-only STANDARDS observer for `geo68-c3-s2-n38`, written 488-505 only. No source, mathematical or figure re-review.

## Decision

All seven authorized screenshots were opened exactly once, covering every prompt and every standard region in both viewports. Desktop mathematical endpoints are visible. Six mobile formula right ends remain **UNKNOWN** because they are outside the captured initial horizontal windows. They are not certified readable, missing, or permanently unreachable.

The permitted existing offline `exercises.html` was inspected once with the own app-installed Playwright, headless, `file:` navigation, offline and no remote requests. It contains the 18 prompts but **no standards and no display-math nodes**. At mobile it is 3387 px high, not the screenshots' 15916 px standards-bearing surface. Therefore it does not provide the affected actual scroll windows. No answer injection, reconstruction, style/content change or new capture was made.

The reserved one additional endpoint image was not used: there was no authorized actual standards window to capture. HOLD is an evidence limitation, not a new scientific/content verdict.

## Bound Inputs

Manifest: `ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n38/display7/exercises.json`.

Authorized and actual SHA256: `7befdf4734ae35a41decf78686543eb920d1ee7c54515ebcdb24616338e23f75`.

The seven PNG hashes and header dimensions match this manifest. Canonical expected content was read only from `ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/lessons/geo68-c3-s2-n38/`:

- `exercises.json`: `b413044f460c6231b4a1e1658126033273b0d35e4bd939570cf9e903beae6a25`, matches manifest.
- `answer-keys.json`: `13bd707a4cb35e03937bef472e914cb9fe892f27688fd090853c5eb9ebcab68e`, matches manifest.
- `figures.json`: `b2396f54d51986a5ca3ddab4e8230f241fd6a8d8063861f587c215a9176d2556`, current inventory; no figures.json hash is supplied by the manifest.
- Existing offline HTML: `eec26ead41a0f8970cbb19817ce3093132a66aadad331a363d666d4bcc8504d5`.

The manifest's lesson.json hash is recorded in review7.json as received, not independently read. Explicitly authorized scientific/content PASS and modern fig-238 PASS are reused; other reviewers/authors and original images were not opened.

## Observed Regions

All paths below are in the manifest's `display7` directory; full SHA256 bindings and dimensions are in review7.json.

| Image | Document Y | Substantive observation |
|---|---|---|
| `exercises-1440-part1.png` | 0-5193 | Title/group, 488-497 complete. Three 488 cases; 489 primed chain; three 490 displays; 491 basis paragraphs and chain; all literal 493 UNKNOWN labels, conditions, examples and interval paragraphs; both 495 subquestions and two three-row lists; 496 cases and 497 closing caveat. |
| `exercises-1440-part2.png` | 5193-9697 | 498-504 complete. Whole 499 figure and four proof displays through closing sentence; four numbered cases each for 500/501/502, two 503 arguments, all five 504 cases and closing paragraph. |
| `exercises-1440-part3.png` | 9697-11345 | 505 complete: both headings, five foot-position cases, both long exterior chains, vertex-triangle list, boxed final sum, closing comparison, return link and blank bottom margin. |
| `exercises-390-part1.png` | 0-5163 | 488-494 prompts and all standard prose/paragraph regions. Four formula ends are not visible, listed below. 493 literal labels and its examples/interval paragraphs wrap without overlap. |
| `exercises-390-part2.png` | 5163-9793 | 495-500 complete. Both 495 three-row lists and fractional display; separated 496/498 cases; 499 full figure, seven labels and four proof displays; all four 500 rows. |
| `exercises-390-part3.png` | 9793-13445 | 501-504 complete. Fraction bars/denominators, boxed values, degree/d notation and all case rows through closing paragraphs are visible. |
| `exercises-390-part4.png` | 13445-15916 | 505 prompt, both sections, all five cases and prose; two exterior-chain tails are not visible. Other displays, final paragraph, return link and blank bottom margin are visible. |

## Counts And Layout

Canonical inventory: 18 written prompts, 18 standards, 54 prompt lines including the intentional blank line, 83 blank-line-delimited standard paragraphs and 18 display-math blocks. All 18 standards are `source=derived`, `grading=ungraded`, `parts=[]`, and their prompts match canonical exercise text. These are content/structure counts, not a fresh mathematical proof.

Both viewports show the uninterrupted sequence 488-505 and all 18 corresponding standard regions. The 10 multipart prompts contain 30 primary subquestions plus the three nested literal-UNKNOWN conditions in 493. The other eight prompts are single tasks. There are no expected or observed tables; the calculation rows and 495 line-pair lists were checked as lines. Paragraph breaks, numbered rows, prose endings, primes, degree/d notation, fractions, boxes, wide angle accents and subscripts were checked where visible.

Every clip abuts the next with zero geometric gap. Desktop seams are between 497/498 and 504/505. Mobile seams are between 494/495, 500/501 and 504/505. The preceding closing paragraph/result and the following exercise beginning are present at each seam; no lost line or split glyph was observed there.

The last desktop and mobile parts contain 505's final prose, the return link and white space through the bottom edge. No prose, list, fraction, figure-label or adjoining-region overlap was observed. That statement does not certify hidden horizontal formula ends.

499's full drawing is visible in both viewports: M/A/N above the upper line, K/C/L below the lower line, B beside the bend. Reused manifest geometry is desktop width 627.234375 px, seven labels, minimum label 37.24084821428571 px; mobile width 310.015625 px, seven labels, minimum label 18.40625 px. Both figure scroll ends are 0 and reached 0. This figure geometry does **not** establish standards formula endpoints.

## Unresolved Endpoints

These are display observations against canonical TeX only, not re-solving:

- 489, mobile part1: the chain reaches the equality sign after the primed beta term; final primed gamma and punctuation are not visible.
- 490 vertex definitions, mobile part1: X and Y are visible, but only Z begins at the right edge; its equality/intersection suffix is not visible.
- 490 boxed angles, mobile part1: three angle values are visible, but the box's right border and final punctuation are not visible.
- 491 final chain, mobile part1: the terminal 180-degree value is cut at the right edge; full result and punctuation are not visible.
- 505 exterior-A case, mobile part4: the first two parenthesized terms are visible; `(q-p)`, the 270-degree term and the final 180-degree tail are outside the capture.
- 505 exterior-B case, mobile part4: the first two parenthesized terms are visible; `(q-p)`, the 270-degree term and the final 180-degree tail are outside the capture.

Actual standards scroll endpoint checks: **0**. Desktop full expressions, canonical TeX and general overflow CSS do not substitute for mobile end evidence. No clipped formula is called completely readable.

## Numbering And Unknowns

495 and 505 visibly use number cells `495.*` / `505.*` and a further leading `. ` in the prompt body, instead of canonical prefixes `495*.` / `505*.`. This punctuation discrepancy appears in both screenshot viewports and was also observed in the existing file's DOM. Exercise identity and subquestion counts remain intact. It is a display observation, not a new source/math defect; no shared renderer was edited.

493's `[UNKNOWN:493-2-1]`, `[UNKNOWN:493-2-2]`, `[UNKNOWN:493-2-3]` remain literal and visible in both viewports. Standard positions `2)(1)`, `2)(2)`, `2)(3)` are present in order. No unknown printed glyph was reconstructed or reclassified as a new content defect.

## Read-Only And Limits

Across the seven screenshots, standards are static text with no visible answer-entry, submission or grading controls. The existing prompt-only file's actual DOM has 0 inputs, textareas, selects, buttons, editable elements and forms; 18 exercise rows, 0 standard containers, 0 display-math blocks, 0 tables. Browser fonts were loaded, document client/scroll widths were both 390 px, command exited 0 and the browser closed. DOM absence is not falsely attributed to a reconstructed standards page.

One image batch; seven images loaded; zero reopens/crops/new images. Limits: 8 per batch, 24 per context. One additional endpoint-image allowance remained unused. One headless offline browser launch; no product app, functionality test, original image, separate figure image, choices, other author/reviewer, math solving, source/figure re-review, .env/DB access, paid call, install, freshness update, Git command, agent/message, timer/automation, promotion or shared edit.

Only review7.json and this report are created in the owned directory, sealed 0444. Stop at review. No display PASS, promotion, publication or scope expansion.
