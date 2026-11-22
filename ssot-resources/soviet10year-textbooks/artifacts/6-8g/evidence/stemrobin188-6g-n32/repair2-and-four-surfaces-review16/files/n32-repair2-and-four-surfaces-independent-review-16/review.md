# SAME188-6 independent repair2 and four-surface review

Date: November 22, 2026. Sole fresh nonfork independent reviewer; finish=review.
Dewey's prior review remains received, retained and closed; it was not reopened.

## A. Code Verdict: CHANGES_REQUESTED

Two P2 compatibility defects remain in the affected repair2 code. The four prior
false-acceptance counterexamples are covered by the retained passing eleven-test
run, and unchanged actual written438 passes its retained standalone validation.
Those successes do not establish compatibility with other legitimate complete
list layouts.

### [P2] Pre-normalization qualification rejects valid two-column and inline lists

Location: current `edition.py:763-766`, used at `950-958`. The current file is
byte-identical to immutable `edition.repair2.py`; line references refer to both.

The qualifier accepts a bare marker only after a newline, colon, semicolon or
the initial exercise number. Source lists requiring the existing layout
normalizer can therefore have fewer "structural" labels than their correctly
line-broken modern equivalents. The new cross-text count gate runs before
normalization, and rejects them even when normalized source and modern are
identical.

Actual new pure-validation example, run once:

```text
source: 12. a) $x=1$<U+3000><U+3000>b) $y=2$
        $x=3$<U+3000><U+3000>$y=4$
modern: 12.
        a) $x=1$ $x=3$
        b) $y=2$ $y=4$
```

Existing discovery finds `a,b` on both sides. Repair2 structural discovery finds
only `a` in source and `a,b` in modern. Both normalizers produce the exact modern
string above, preserving column ownership and formula order. Repair1 returns
`[]`; repair2 returns the complete-subpart-count/order mismatch error. All
changes are layout-only and there is no numeric declaration.

This violates the explicit two-column restoration contract in the lesson skill,
lines 365-370. It is not a demand for an additional parent acceptance gate.

A second new example, `12. a) Draw a circle, b) Name its center.` versus the same
list with each subpart on its own line, also normalizes identically on both
snapshots. Source/modern structural counts are 1/2, repair1 accepts, and repair2
rejects. Complete lists are not restricted to semicolon-delimited source prose
by the existing edition-text contract.

### [P2] Excluding every opening parenthesis rejects real line-start lists

Location: current `edition.py:762`, with fallback comparison at `965-966` and
`980-1006`.

The P2 identifier defense correctly prevents ordinary inline point identifiers
from entering label canonicalization. But `not marker.group("open")` also
excludes clearly structured, already line-broken lists:

```text
source: 12.
        (a) Draw a circle;
        (b) Name its center.
modern: 12.
        (1) Draw a circle;
        (2) Name its center.
```

Both old and current marker discovery recognize two complete labels.
Repair2 structural discovery recognizes zero on both sides. Repair1 accepts;
repair2 rejects with `want=['12'], got=['12','1','2']`, treating only the modern
structural labels as newly introduced problem data. The old supported paired
delimiter shape, explicit line starts, complete order, and separate instruction
bodies distinguish this from the prior ordinary prose identifier example.
No problem number or mathematical content changes.

No code fixes, test edits, candidate edits or producer/native calls were made.

### Correctness And Retained Verification

- Repair2's extracted existing discovery still masks formulas with equal-length
  spaces and excludes nested markers. Its discovery function and the suffix /
  two-column normalizer are unchanged from repair1.
- Valid qualified sequences canonicalize to nonnumeric Latin labels, not numeric
  problem tokens. Source and modern counts and complete-sequence validity are
  compared separately before this exemption. A mismatch records an error that
  numeric declarations cannot cancel.
- The three prior label/data/figure-number cancellations now reach the separate
  structure error. Ordinary `(a)/(b)` point identifiers are not canonicalized;
  their introduced numeric identifiers remain visible to number validation.
  The retained eleven tests exercise all four prior concrete counterexamples.
  They were not rerun.
- Retained `eleven-affected-regressions.execution.json`: exit 0, eleven dots,
  `Ran 11 tests in 0.001s`, `OK`; stdout empty. Actual stderr and both stream hashes
  were read and checked against the receipt.
- Retained standalone actual written438 validation: exit 0, sourceLabels=10,
  modernLabels=10, errors=[]; identical DATA-only signature on both sides:
  `['438','208','1','8','7','2','2','4','8','5']`. Stderr is empty. No standalone
  rerun or native438 rerun.
- Formula signature checking and bound-errata handling remain separate and
  unchanged. Label-span replacements operate outside masked formulas. Retained
  tests include undeclared data and formula changes and declared context-number
  behavior. No new formula/data bypass was demonstrated by this review.
- Preserve old eighteen suffix PASS and broader thirty-five-test result:
  34 PASS plus unchanged
  `test_prose_is_line_broken_at_sentences_and_introduced_formulas` FAIL.
  These are reused historical results supplied by the user and disclosed in the
  prior technical report, not a newly verified green suite. Neither was rerun;
  unchanged prose normalization is outside this affected review.
- One genuinely new pure-validation batch ran three compatibility cases against
  both immutable snapshots. All three were accepted by repair1 and rejected by
  repair2. Child exit 1 records those findings, not a tool fault; stderr empty.
  Exact argv, timestamps, stdout/stderr and hashes are retained inline in
  `new-list-compatibility.execution.json`. AST-selected definitions only, no
  whole-module import, formula-render continuation, app or native execution.

The prior technical manifest's `currentCode` path is intentionally historical.
It is not used as a present-code equality gate. Its immutable repair1 snapshot
and concrete P1/P2 evidence remain bound and preserved.

## B. Four Actual Offline Surface Verdicts

These are independent of A. All four current full-page PNGs were opened once.
Their actual SHA-256 values match `result.json`; current durable `lesson.json`
and `exercises.json` match each surface's `sourceHashes`. These are real saved
offline/headless surfaces, not imagined code or native-figure previews.

| Surface | Viewport | Actual PNG | Verdict |
| --- | --- | --- | --- |
| text desktop | 1440x960 | 1440x4699 | PASS |
| exercises desktop | 1440x960 | 1440x2365 | PASS |
| text mobile | 390x844 | 390x4150 | PASS |
| exercises mobile | 390x844 | 390x2381 | PASS |

### Text Desktop: PASS

The entire page is nonblank and framed, from title and chapter/section metadata
through both sections, all proof paragraphs, figures204-207 and the final
exercise link. Prose, mathematical runs and paragraph separation are readable;
no clipped text, missing media, overlapping labels or incoherent section
overlap was observed. All four actual figures are fully visible at the retained
measured width 640px (minimum final figure text 36px).

Figure206 contains exactly four clear annotation lines, separated from its
geometry and caption:

```text
Rejected hypothesis:
a meets b at P
Dashes are schematic,
not straight extensions.
```

This checks annotation visibility and layout, not whether its mathematical
interpretation is correct. The complete final figure207, its label subscript,
caption and following link fit without clipping.

### Exercises Desktop: PASS

The full exercise page432-440, bottom return link and actual figure208 are
visible. Gutter numbers and existing repeated body numbers remain readable;
they do not overlap the prose. Written438 has ten separately visible submarkers
1)-10), each with a typeset statement. The two supplementary-angle statements,
degree signs, hats, equality and plus signs are rendered, not raw TeX.

The asterisked explanatory footnote is visibly a separate paragraph after
subpart10, not a continuation glued into the tenth statement. Figure208 fits
fully below that footnote; labels1-8 and a,b,c can all be read without clipping
or text/geometry collisions. Retained actual media width is 627.234375px,
minimum final figure text 37.242041015625px. Later exercises and the return link
do not collide with the figure.

### Text Mobile: PASS

The title, metadata and full reading flow fit the 390px page with clear margins.
Proof lines and mathematical runs wrap within the column; retained long
`Z_UNKNOWN` notation is visibly typeset and does not overflow or obscure prose.
All four actual media fit at 358px, minimum text 20.1375px, above the 16px rule.
Figure205's labels and right-angle marks remain legible; figure206 has all four
annotation lines readable and separated. Figure207 and the final link are
complete. No blank media, horizontal clipping, overlapping prose or truncated
figure/caption was observed.

### Exercises Mobile: PASS

The 390px page retains distinct exercise rows and a usable text column beside
their gutter numbers. Formula and prose wrapping remains readable, including
the final exercise's angle, lengths and units. Written438's ten labels are all
visible in order; parts9 and10 are separate. Its footnote wraps into a distinct
paragraph, with space before the actual figure208.

All eight angle labels and three line labels are visible within the actual
310.015625px media. Minimum final figure text is 18.407177734375px, above 16px.
The complete figure, subsequent exercises and bottom return link fit without
clipping, overlap or missing media.

### Scope And Preserved Uncertainty

No unintended visible Cyrillic or source-script leakage was observed in final
figure labels or newly reviewed structural submarkers. Chinese prose and
Chinese captions are the intentional edition language, not figure-label leakage.
The original code/symbol identity UNKNOWNs are visible and intentionally
preserved. This is NOT a clean-source, identity or whole-content qualification.

Existing source/math/figure-native300358 PASS is reused on the explicit human
handoff authority. No source pages, native figures, source inventories, answers
or choice-authoring roots were opened. No mathematics was re-solved. Historical
source HOLD remains historical HOLD; this review neither repairs nor approves
it, and does not reopen source/math/figure approval.

## Named Binding Hashes

- Current `edition.py` and immutable repair2:
  `5332783f83fb56b3cc2f7173ec2bf10712c59b795ae6ce455dd9149012d82381`.
- Immutable rejected repair1:
  `ec0202f4ed6dfac891b4f0ae5dde391e4a3da9434b1e6f035c7066943926af85`.
- Repair2 record:
  `729e62082902286e9666a401155167afc7a319995cda39782bd1326b03a716ab`.
- Eleven-test execution receipt:
  `9288c3ea6f16bde614f9625c016f3c8c4730cf72113512b39c129425c1cce84d`.
- Unchanged438 execution receipt:
  `4409e40090bf29bc47fbd262a93f96157bbf6ab1b25194a67051e58a578882f2`.
- Unchanged exercise template:
  `5ad97637caff38ecc7f76ff6704e9e8300e051711d184065c6b79543008a3138`.
- Offline display result:
  `8e253a77a74f06530f630b65df4ed884f4823c38aa665d932a2707470e107cb7`.
- text1440:
  `ed397bb261c2f1d943a5cefdef82f918bb5f8d8c1ccb77a8b9a4aca3dc976bdd`.
- exercises1440:
  `326af13e58189c547e8bf7c970ff1f198b10f6e39bc611bef9fea6d12af08941`.
- text390:
  `5964604594843fbcb746de970c8fa26069e70add4059fad2450d331fa477e3bb`.
- exercises390:
  `98e46ee579ae58f0c332475c4c5b1817bfefe9e268c98955fe5155aec4d1254b`.
- Current durable lesson JSON:
  `217aadc9c93d363dbf23cd44905baaf862f0c65c9be451faab381c2d6b23bce4`.
- Current durable exercises JSON:
  `b5697cf9213bc91722609423a3a1772453195e3322c814b6e9eaeaa06a2fae1a`.

Absolute artifact paths and further contract/receipt bindings are in
`manifest.json`. This report is substantive review, not a status-only review.

## Actual Ledger And Boundaries

Image attempts in order: text1440, exercises1440, text390, exercises390.
Each was one successful `view_image` open of the current saved PNG, charged once.
Reviewer batch=4/8 and context=4/24, failed image attempts=0, reopens=0,
additional crops=0/4, new images=0. Full-page visibility settled the specified
layout criteria without a crop. Counters never reset; parent remains permanently
24/24 with zero additional image loads and no returned image payloads.

Code part A image attempts=0; visual part B image attempts=4. Reused eleven-test
run=1, reused standalone438 run=1; new validation batch=1, cases=3.
Passed-test reruns=0; native/producer/render/editor reruns=0. Technical revisions
remain cumulative2, new content revisions=0, code fixes=0.

Writes only under the assigned independent review root, via apply_patch. No
network/docs service, env, DB, paid, install, app, dependency, Charter, Git,
schema, candidate or product-code writes. No choice files/keys or authoring-root
reads. No new workers, fork, publication or live acceptance.

Code CHANGES_REQUESTED and four surface PASS are separate results. Even a future
code PASS plus these surface PASS results would not approve the whole lesson:
choices remain pending, preserved source uncertainties remain unresolved, and
headless/offline screenshots are not live product acceptance.

wholeLessonApproved=false; wholeTicketApproved=false; published=false;
liveProductAccepted=false; choicesPending=true; activeExecSessions=[].
