# N37 figures 229-231: affected review 7

Date: 2026-11-23. Reviewer: independent7. Ticket: STEMROBIN-188.
Status: **revise**. Only remaining defect: exact actual-width enumeration.

Sole working root:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
Only write root:
`.intentfold/tickets/STEMROBIN-188/tmp/n37-fig229231-independent7/`.
All paths below are relative to the sole working root.

This continuation reviews ONLY the original provenance and affected-display
findings. Existing source/geometry/point/label/cultural PASS comparisons are
reused, not repeated. This is not a native review or a whole-lesson approval.

## Retained Basis

The four original records remain unchanged and sealed 0444:

| File in the owned directory | SHA-256 |
| --- | --- |
| `SOURCE-FIRST.md` | `07ce12237f2831327e726d4768df1cf0e99fd2858817642ddf4b133aed6b506e` |
| `source-review.json` | `5b02fbc9bd8cf70c405222b478a54ac5505890e1a9104e14420db39610217ce1` |
| `COMPARISON.md` | `a04045398b50de97c3484ec0d08479bf3dd413a777ee4d8782613a877f7584b5` |
| `review.json` | `516a225fad6f0a1e1bef3a882338824fdbb610b394362dfd6f4c727861a10c0a` |

The original HOLD and first native clearance failure remain historical evidence.
No original PNG, final isolated preview, or failed preview was visually reopened.
No new prose transcription, mathematical solving, geometry review, cultural
review, renderer replay or native validator invocation was performed.

## Provenance Finding: Resolved

Let N be
`ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n37`.
The current figure-229 candidate is in `N/figure-provenance-repair7/`.

Independent structural comparison finds EXACTLY one spec-field change:
`source.inventory[0].description`. The new description records an observed
diagonal connector, leaves its arrowhead/directed-vector status UNKNOWN, and
separately identifies the modern O-to-O_1 arrow as authorized by the approved
translation prose. It also continues to distinguish candidate layout
displacements and differing finite stroke lengths from source givens.

The render report changes EXACTLY `spec.sha256`, binding the new metadata.
The current SVG is byte-identical to the previously compared SVG. Source
declaration, every geometry object, every label, assertions, canvas and display
are structurally unchanged. Existing mathematical/visual/cultural PASS therefore
remains applicable; there is no new drawing to review.

The disclosed affected draft-validation exit 0 is a direct human execution fact;
the supplied recovery record itself describes the metadata changes and zero
renderer replays, not a separate execution receipt. No new receipt requirement
or validator replay is imposed by this review.

## Affected Surfaces: Pass

The supplied fixture uses current app CSS and the copied Prose/Exercises/
FigureMedia DOM, with approved retained text and the exact current candidate
SVGs. Manifest source hashes were independently verified against the current
CSS/route files and retained inputs by byte hashing only; no app implementation
or full lesson prose was reviewed. Surface HTML was hash-bound, not replayed.

This is explicitly an **offline app-container fixture**. It is not evidence of a
running product, DB read/write, functionality, complete lesson, or full-suite test.
Its limited scope is sufficient for the missing affected media fit/readability
comparison. A running product or whole-product test is NOT requested.

Both supplied screenshots were opened exactly once:

| Fixture viewport | Figure / role | Container width | Actual media width | SVG height | Minimum measured label |
| --- | --- | --- | --- | --- | --- |
| 1440 x 960 | 229 / prose | 700 | 480 | 480 | 34 px |
| 1440 x 960 | 230 / exercise | 648.40625 | 480 | 400 | 34 px |
| 1440 x 960 | 231 / exercise | 648.40625 | 480 | 400 | 34 px |
| 390 x 844 | 229 / prose | 346 | 346 | 346 | 24.508333333333333 px |
| 390 x 844 | 230 / exercise | 294.40625 | 294.40625 | 245.328125 | 20.852890625 px |
| 390 x 844 | 231 / exercise | 294.40625 | 294.40625 | 245.328125 | 20.852890625 px |

At both sizes all three figures render fully, in their respective prose/exercise
containers. Media does not overflow its available width. No label or stroke is
clipped or collides with surrounding content; subscript labels, alpha/arc and D
remain legible. This is a display check, not a repeated source/math/cultural
comparison. The different prose/exercise widths are measured independently.

The manifest records full-natural-height captures that adjust HEIGHT only and
verify unchanged media widths before/after that adjustment. Both screenshot
hashes match the manifest. Thus the taller screenshot is not evidence of a
wider media allocation.

The old conservative native checks `[280,300,320,331,352,480]` are reused as
their actual original checks. They are NOT relabelled as tests at 346 or
294.40625. Current offline-surface measurements provide separate actual font/
fit evidence at those exact widths, and every measured label clears 16 px.

## Remaining Revision: Exact Width Declarations

All three actual specs still declare:
`display.widths = [280,300,320,331,352,480]`.

The read-only FigureSpec contract states, at
`.agents/skills/ld-s10y-image/references/figure-spec.md:115` and `:138`,
that inline figures with `maxWidthPx` include each resulting desktop/mobile
width, including their actual mobile media width.

The precise remaining metadata gap is:

- Current repaired `fig-229.spec.json`, `$.display.widths`, omits **346**.
- Unchanged `fig-230.spec.json`, `$.display.widths`, omits **294.40625**.
- Unchanged `fig-231.spec.json`, `$.display.widths`, omits **294.40625**.
- Desktop **480** is already declared for all three.

The actual surfaces PASS, so this is NOT a readability, source, mathematical,
cultural or missing-screenshot HOLD. Add the corresponding exact widths to the
owning FigureSpecs and bind the affected metadata to the already obtained
actual-width evidence. Preserve the existing conservative native checks and
completed comparisons. No new geometry drawing, original/output reopen,
surface screenshot, running DB/product test or full-suite review is requested.
Changed metadata must receive the normal affected hash binding; do not silently
reuse an old spec hash as though the width field had not changed.

## Current Input Bindings

| Path below N | SHA-256 |
| --- | --- |
| `figure-provenance-repair7/fig-229.spec.json` | `7c7c572b02a9ddae719331d1f1d03f0364881016e4eb535505b340b9784a548c` |
| `figure-provenance-repair7/fig-229.render.json` | `afb969556b45b7cd5c18e7e562937020953e2fc03674949bc12621a18bbe7e7d` |
| `figure-provenance-repair7/fig-229.svg` | `fbb24f5c3655702d5f5a59bf6aa38faad5db857834ba7591353fe31e61f2b971` |
| `figure-provenance-repair7/recovery.json` | `20d6d4e530eb4384454d9c2551c0d33c5fd19e65ac791d08e63cf1e41af79b2e` |
| `fig229231-author7/fig-230.spec.json` | `bfe939d392163a05ff2a7b3ca42e51840351f06ac25f49ab4cc346dbbd873f6a` |
| `fig229231-author7/fig-230.render.json` | `a593675a5fd745e3b492c178c31c39f79ab0b71dd652234ffca5ceee714f6bdb` |
| `fig229231-author7/fig-230.svg` | `a06e50e1f3d6b60b70f8f5bfb62b972c600a0c352fad35674fba73e5d72ec72a` |
| `fig229231-author7/fig-231.spec.json` | `84eb07ea499a1e6caae62890d107acad96387742e80309163f79be478a6d5fb7` |
| `fig229231-author7/fig-231.render.json` | `422e35176a9dc9b3405d1766054f7b26294878ded188286f433730dd3222b936` |
| `fig229231-author7/fig-231.svg` | `f5bf96cbcdb8482be898f80194e90bbdaac212cedd599a1fdfba7383f9294b8c` |
| `figure-surfaces7/manifest.json` | `e270b50e3036967f3fb3b13a167491cbdf03ab6798962101b020b424c332e0dc` |
| `figure-surfaces7/surface.html` | `a670f227e165925be12e75ad7d00497d20cf6216742438b89800b0ca2c982377` |
| `figure-surfaces7/surface-1440.png` | `81180ba7547cfcd8877920cdb4d2d97059679b9232ef745203b20e26bb61db81` |
| `figure-surfaces7/surface-390.png` | `2f28232540deb490e05f29af65da91dbee39d4dbf3016e6d91d2095db2adf9ba` |

The source PNG hashes and original approved-text hashes remain those in FIRST
and original HOLD; their visual/content review was not repeated. The surface
manifest binds retained text copies to those same approved hashes.

## Diagnostic And Counters

One local verification command initially required ideal font scaling to match
reported browser values at 1e-8 px tolerance and exited 1 on mobile exercises.
The discrepancy is only 0.0008854166666658614 px; ideal arithmetic is not a
requirement on quantized browser measurement. The corrected check validates
actual reported fonts directly against 16 px, actual widths against containers,
and the unchanged-width capture facts, and passes. This local diagnostic is
retained here; it was not a renderer/native/content failure and triggered no
new images, layout changes or producer execution.

Reviewer cumulative image counts: originals 3, final previews 3, affected
screenshots 2. Current batch **8/8**, current context **8/24**. Each surface was
opened once; source/output/failed-preview reopens and crops are zero. No image
budget reset occurred. Remaining batch allowance is zero.

This stage: provenance-only affected comparison 1, affected surface comparisons
2, existing complete figure PASS sets reused 3. New source transcription,
solving, geometry/label/cultural review, renderer/native-validator replay,
paid/model calls, browser sessions, git/DB/environment/dependency/canonical
writes: all zero. CSS/route access was read-only byte hashing for fixture
binding, not code review.

Only `affected-COMPARISON7.md` and `affected-review7.json` are new outputs,
sealed 0444. Original four records remain unchanged. Alphabet, source
arrowhead/directed-vector status and C-speck role remain UNKNOWN. No native
review is recorded and no native PASS or whole-lesson approval is authorized
by this revise result.
