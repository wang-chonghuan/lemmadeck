# n8 Whole-Lesson Offline Layout Review

**FAIL.** First whole-lesson check for STEMROBIN-184 B continuation 184-4. One run, no repair or retry. This is not source/math or production approval.

## Confirmed Finding

- **P2: choice four-class numerals use the wrong font and scale.** Sixteen `3/2/1/0` labels per viewport in `.option-text .sr-prose-math` render in Songti/CJK serif at 16.64px (1.00em), not KaTeX_Main at 18.304px (1.10em). The view HTML emits `sr-prose-math`, while its CSS only defines `prose-math`. A-D labels already inherit the correctly styled `option-letter` and pass.

## Measurement Diagnosis

- Raw first-run evidence remains unchanged: 122 pass / 6 fail. Two failures are the confirmed numeral defect, repeated across viewports.
- Two table sizing flags are measurement false positives: SVG font-size36 is in the 1280x780 viewBox; its actual 640x390 screen box scales by0.5, giving exactly18px labels. No table repair or review replay is warranted.
- Two aligned-proof flags are retained line-box warnings: fifteen span boxes per viewport begin3.015625px above the `.nb` scroll box. The once-opened screenshots do not establish lost ink; these are not confirmed mathematical render failures. No KaTeX error, missing formula or blank math occurred.

## Passing Evidence

- Exact canonical coverage: all12 prose entries, consisting of11 complete paragraphs and the table in its canonical position; full algebraic and two-class set proofs; E70 with complete Latin a)/b) formulas.
- Exact supplied-HTML view coverage across all six pages. Per viewport, all35 text,2 exercise and44 choice KaTeX roots use KaTeX_Main1.10em; native italic math descendants remain normal KaTeX typography.
- Two questions/eight options; A-D labels separate from controls/text; all four class lines per second-question option remain present, ordered and collision-free.
- Every checkbox checked cumulatively then individually unchecked; every radio selected exclusively. No key, result, script, text change or judging operation.
- Table fixed640x390 with77 displayed18px labels. Mobile end282/282px exposes the SVG right boundary. Aligned proof scroll97/97px and E70b scroll15/15px are reachable; edge occlusion is intentional horizontal scrolling, not document overflow.
- All lesson regions, exercise content, controls and final navigation reachable. Documents remain1440px desktop/390px mobile with no horizontal overflow.
- Inline fonts/SVG and pixel checks nonblank; zero console/page errors, failed requests, remote calls or missing images.

## Evidence

Owned directory: /Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/n8-offline-review

- `check.mjs`: first-run isolated offline Playwright check, protected by `first-run.lock`.
- `report.json`: complete raw DOM measurements, assertions, errors, pixel checks, interactions, scrolling, input and screenshot bindings; retained without editing.
- `review.json`: visual adjudication and scale-aware diagnosis, linked to raw report hash.
- `images-ledger.json`: six screenshots opened once each in one batch; no source/figure images, crops or reopens.
- `finish-evidence.mjs`: report-only evidence finalization; does not launch a browser or rerun checks.

Input-set SHA-256: 39177524ba8b1e33e3f1a7e5fec09a0293242f247d5240b1dc08d8a4582e5ed8
Raw report SHA-256: c98dcdb1e95ee1a10c1705f5e83a24fa3a01da2c892a82e884d8b8b2052bdcfe
Review JSON SHA-256: d6d8872ba0b49c9fd7ee90ac8f8e25ccbedf0c5eab2fddaa046f667442775e48

HTML/canonical SHA-256 bindings:
- `text.html` (HTML preview): `ff9a95aa71d513f55ca3b45da0b5145b02ff1ecadc5a184018262ee3d09dedb7`
- `exercises.html` (HTML preview): `5e3d3b70d07e2aaf4d379acce8e95eaa2cada6f3f9f01ff7978fda0a8b6e9245`
- `choices.html` (HTML preview): `f92530bc3d1076c2a2db9871890f51f0be916951f51ae2994c98520a6b22f762`
- `lesson.json` (canonical): `a352e00ac7cf74b25472b4206a996bb701fce5c2aef2164149bbf2f26a0412f8`
- `exercises.json` (canonical): `eb834b64106a30c7b2da6f8fec2a9d3925bb2cf45fa7ab10c07c297ec5caa74c`
- `figures.json` (canonical): `a6637810dacce57299ae5864d69196846fd3a770b0ee71279836c419da2abd35`

Screenshot files (all fullpage, absolute paths/hashes in report and ledger):
- `text-desktop.png` 1440x2071: `34a614f07189a938a33a3bdd41f7fb3e9240be77e85d19ac3fda31cd645bd462`
- `exercises-desktop.png` 1440x960: `82b820dd16491a7b7d21ea0c1206e26913a9b9454d7a427e320a05d38b6b8a97`
- `choices-desktop.png` 1440x1402: `4ab97485b2cd0b27541f3cb5bffda4f19b04e9eee27d3ea38c722913dffef603`
- `text-mobile.png` 390x2381: `b158dca3bf88543c29f1f8fe2281c976f428007d43fd9daf837dd66f3c5efdb2`
- `exercises-mobile.png` 390x844: `57264ca0f22f63057d841bd0c6341823e3ed5f4c038340e973d935195308b6fa`
- `choices-mobile.png` 390x1585: `d8577428c633eea8f2bd856066d1f7ca1adaf8cd3d8bdb2bc0e2fd85d18f4e15`

**STOP:** no repair or retry. Chromium and all6 fresh contexts explicitly closed. Reviewer images6/6, one batch6/8, reopens0; parent remains permanently24/24 and receives TEXT ONLY. Inputs remained unchanged throughout the browser run and evidence finalization. Writes only in the owned directory; no application/skill/canonical edits, installs, .env, services, DB/publisher, keys/author internals, Git, workers, other tasks or supervisor messages.
