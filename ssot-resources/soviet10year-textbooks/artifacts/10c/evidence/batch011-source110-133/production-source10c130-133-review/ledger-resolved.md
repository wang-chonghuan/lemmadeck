# STEMROBIN-184 SessionB Additive StageA Ledger

Date: 2026-11-17. StageA only; independent source-first review.
This additive record does not modify or reclassify the frozen original failure
artifacts source-first.md and ledger.md.

Corrected source prefix (absolute):
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c130-133/10c/pages/`.
Every source path below is that prefix plus the indicated suffix.

## Native Metadata

| Physical | Suffix | Width x height | SHA-256 |
| --- | --- | --- | --- |
| 130 | 0130/page.png | 1695 x 2580 | 20b99ecbddcf7da8cc40c5fe29c401cb1170b15b5913533c186f504ad4238536 |
| 131 | 0131/page.png | 1695 x 2580 | 2dec1ab3b23b0a3a2853cecb82f81ba573e759c1852b902ffd94cd3109808abc |
| 132 | 0132/page.png | 1695 x 2580 | f57c201e62a33505f186c6d093512a4afa7a9225bf61b42189518827a07cd83d |
| 133 | 0133/page.png | 1695 x 2580 | 5e95f8447938b6b0d6781ea937124a1b4cac643181dec76445735237a2093816 |

Metadata obtained without image loads using sips and shasum. Initial assignment
and lifetime image load count: 0, confirmed by the human's continuation.
Maximum: 8 images for the entire assignment, 24 lifetime.

## Incoming Before Pixel Inspection

Physical-130 incoming: "UNKNOWN".

Quoted bounded parent TEXT, not pixel evidence:
"105 header actually127;129 completed workedgravity example2;446complete;447 onlyа) visible129, whole rightUNKNOWN, objectopen."

No claim in that incoming text has yet been independently verified. In
particular, "whole rightUNKNOWN, objectopen" remains unresolved before load 1.

## Permanent Load Log

1. LOADED ONCE: physical 130, native 0130/page.png, original detail,
   entire native image, no alteration. Hash and dimensions as above.
   Printed page 124. Manual 26 unique text rows with footer / 25 without;
   caption shares a row. Incoming was initially UNKNOWN; visible б) ends
   before 448, resolving its right boundary only. Pending uncertainties:
   "origin glyph O/0 in 图 63", coefficient nu versus Latin v.
2. LOADED ONCE: physical 131, native 0131/page.png, original detail,
   entire native image, no alteration. Hash and dimensions as above.
   Printed page 125. Manual 23 rows with footer / 22 without. 454 CLOSED
   by its one-line continuation; 455-457 complete; new 106* unit OPEN.
3. LOADED ONCE: physical 132, native 0132/page.png, original detail,
   entire native image, no alteration. Hash and dimensions as above.
   Printed page 126. Manual 21 rows with footer / 20 without. Third rule,
   proofs I/II/III supplied; no unanswered seeds. 106* still OPEN.
4. LOADED ONCE: physical 133, native 0133/page.png, original detail,
   entire native image, no alteration. Hash and dimensions as above.
   Printed page 127. Manual 16 rows with footer / 15 without. Proof III
   explicitly closes. Worked examples 1/2 excluded from seeds; whole right
   boundary of example 2 and unit 106* UNKNOWN beyond physical 133.

Native loads completed: 4. No native source may be reopened.

## Concrete Crop Requests

Two additional native rectangle crops are authorized for concrete ambiguities,
not for rereading an entire page. They must have pre-load dimensions, hash,
rectangle, and decoded pixel-equality verification logged before image load:

- Physical 130: rectangle [545,430,865,450] in [x,y,width,height] native pixels.
  Concrete question: "origin glyph O/0 in 图 63" and the nu/Latin-v-shaped
  coefficient in 448's last line. This rectangle includes those exact glyphs.
- Physical 133: rectangle [315,392,1160,748].
  Concrete question: example-1 dense powers/signs/evaluation limits and final
  "-27 21/32". This is a native calculation-area rectangle only.

No crop has yet been loaded. No grid loads, reopens, resizing, enhancement,
or montage.
No author disclosure or StageB access.

## Crop Metadata Recorded BEFORE Any Crop Load

Both crops were created by Pillow's native pixel rectangle operation with no
resize, enhancement, compositing or color conversion. Saved PNGs were decoded
and checked byte-for-byte against the corresponding source rectangle, including
mode and dimensions. This is pixel provenance verification, not a row detector.

### Crop 130

- Absolute path:
  `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c130-133-review/crops/0130-origin-coefficient.png`
- Source: corrected 0130/page.png, SHA-256
  `20b99ecbddcf7da8cc40c5fe29c401cb1170b15b5913533c186f504ad4238536`.
- Source dimensions/mode: 1695 x 2580, RGB.
- Native rectangle [x,y,width,height]: [545,430,865,450].
- Crop dimensions/mode: 865 x 450, RGB.
- File SHA-256:
  `478fd82d1433e16ed22d386860b14c013872c86ddaf59e3c59832071c1a22946`.
- Decoded pixel SHA-256:
  `d029e68a28379cae43b9448cc045b71c9acec17d58c02ea181c6a237ebbcddaf`.
- `pixel_equal_native_rectangle: true`, verified before load.
- Permanent load 5: LOADED ONCE, original detail.
  Both origin glyphs match the printed zero glyphs in q<0/q>0 in this same
  crop: transcribe 0, not an inferred letter O. Coefficient shape remains a
  concrete nu/gamma discrimination question after this crop.

### Crop 133

- Absolute path:
  `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c130-133-review/crops/0133-example1-calculation.png`
- Source: corrected 0133/page.png, SHA-256
  `5e95f8447938b6b0d6781ea937124a1b4cac643181dec76445735237a2093816`.
- Source dimensions/mode: 1695 x 2580, RGB.
- Native rectangle [x,y,width,height]: [315,392,1160,748].
- Crop dimensions/mode: 1160 x 748, RGB.
- File SHA-256:
  `30b330dda9f7f06e1d4e17728825686ad6f6d585e4e7768c1895f8e77934b20e`.
- Decoded pixel SHA-256:
  `3dd91ce2a7ee90bb6a5f74454085a86d5f97b413a2a4a5ce71a169220ecea2fb`.
- `pixel_equal_native_rectangle: true`, verified before load.
- Permanent load 6: LOADED ONCE, original detail.
  Dense five-row example-1 calculation confirmed, including mixed number
  -27 21/32. The final +10 term on its fourth row has one outer parenthesis
  enclosing the fractional base AND its -1/2 exponent; preserve that layout.

### Concrete Third Crop Request

Physical 130, native rectangle [850,1760,230,110]. Compare the actual 452
coefficient glyph against already-loaded crop 130's 448 coefficient glyph to
resolve "nu/gamma". No page reopen, no coefficient inferred from physical law.
Crop metadata must be logged before permanent load 7.

### Crop 130 / 452 Metadata BEFORE Load 7

- Absolute path:
  `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c130-133-review/crops/0130-ex452-coefficient.png`
- Source: corrected 0130/page.png, SHA-256
  `20b99ecbddcf7da8cc40c5fe29c401cb1170b15b5913533c186f504ad4238536`.
- Source dimensions/mode: 1695 x 2580, RGB.
- Native rectangle [x,y,width,height]: [850,1760,230,110].
- Crop dimensions/mode: 230 x 110, RGB.
- File SHA-256:
  `1efb0b91a13d6d2b029402042166dd5760a59fed06df586cac780955e1a7a895`.
- Decoded pixel SHA-256:
  `eeb43ad967a7b11e5ea7edf643817611af0460c43ae9612f8c86592299f94872`.
- `pixel_equal_native_rectangle: true`, verified before load.
- Permanent load 7: LOADED ONCE, original detail.
  The gamma-shaped coefficient in 452 matches 448's actual glyph from load 5,
  including its descender/curled branch. Final source reading in both is
  gamma; provisional nu was superseded from actual source-local comparison.

## Frozen Manual Row and Object Ledger

| Physical / printed | Without footer | Footer | Unique text rows with footer | Shared-caption adjustment |
| --- | --- | --- | --- | --- |
| 130 / 124 | 25 | 1 | 26 | Caption 63 contributes 1 body row but 0 extra unique rows |
| 131 / 125 | 22 | 1 | 23 | None |
| 132 / 126 | 20 | 1 | 21 | None |
| 133 / 127 | 15 | 1 | 16 | None |
| Total | 82 | 4 | 86 | One shared row in block-body total 87 |

All rows manually inventoried from source, not from grids/templates/detectors.
Per-object row counts and the full visible transcription are in
source-first-resolved.md. Figure-internal lettering is separately inventoried.

Incoming state sequence:

1. Before corrected pixels: physical-130 incoming "UNKNOWN".
2. Load 1: source starts unnumbered б), finishes a question, and begins 448.
   Parent TEXT supplies the 447 name; source supplies right CLOSED before 448.
3. Earlier 447 а) and unit-105 shorthand remain unverified from these pixels.
4. 454 ends physical 130 at "设沙的密度等": actual OPEN page cue.
5. Load 2: continuation "于 rho 并且是从圆锥体的底平面将沙堆高" closes
   454. Actual new unit heading 106* follows 457.
6. Load 3: supplied third rule and proofs, not new unanswered exercises.
7. Load 4: "法则 III 得证" closes proof III. Worked example 1 closes before
   worked example 2. Worked example 2's final observed sentence is complete,
   but its WHOLE right boundary and that of unit 106* remain UNKNOWN.

Exact pixel-observed complete unanswered set: 448-457 inclusive, 10 exercises,
all with no printed prose subpart labels. Figure-63 а)/б) are figure cases,
not separate exercise prose part headings. Additional visible fragment:
unnumbered incoming б), 447 only by parent text, not a whole seed in this scope.
Supplied worked/proof objects EXCLUDED: proofs I/II/III, worked examples 1/2.

Sole numbered figure: 63, explicit exercise-448 owner. Two horizontal
right-directed x axes: upper а), 0-a-b, q<0; lower б), 0-b-a, q>0.
No distances/grid units or force/electron arrows are invented. A small lower
axis stroke between b and a remains "tick or ink irregularity UNKNOWN".

## Final Permanent Load Accounting

| Load | Type | Source / crop suffix | Loads |
| --- | --- | --- | --- |
| 1 | Native | 0130/page.png | 1 |
| 2 | Native | 0131/page.png | 1 |
| 3 | Native | 0132/page.png | 1 |
| 4 | Native | 0133/page.png | 1 |
| 5 | Native rectangle crop | 0130-origin-coefficient.png | 1 |
| 6 | Native rectangle crop | 0133-example1-calculation.png | 1 |
| 7 | Native rectangle crop | 0130-ex452-coefficient.png | 1 |

Total assignment 7 / 8; total lifetime 7 / 24. Zero reopens, grids, montages,
resizes, enhancements or other images. No further source image load is planned.
Three crops: each pre-load hash/dimensions/rectangle/pixel equality logged above.

## Frozen Exact Uncertainty Spans

- "447 WHOLE left text and pixel-authenticated identity UNKNOWN".
- "pre-106* unit number/title UNKNOWN from this scope".
- "lower-axis intermediate stroke: tick or ink irregularity UNKNOWN".
- "worked example 2 WHOLE right boundary UNKNOWN".
- "106* WHOLE right boundary UNKNOWN".

Earlier O/0 and coefficient ambiguities were resolved by actual source crops,
not by an author disclosure or by inference from the physics.

## Isolation

The required instruction reads from the initial invocation remain in force.
Only the additive source-first-resolved.md, ledger-resolved.md and three native
PNG crops were written. Original failure artifacts remain unchanged and are
not relabelled PASS. No author text, peer reports, answers/choices/modern/TOC,
source edits, setup/update, finalizer, counter, test, assembly, adaptation,
Git, DB, publication, workflow or other-chat operation occurred.

StageA frozen source-first evidence only; not a pipeline PASS. WAIT for
separately authorized sole StageB disclosure. Do not seek author files.
