# C6 First Offline Display Review

Verdict: **HOLD / NOT DISPLAY APPROVED**. The single first browser command exited
1 on desktop. Its raw `FAIL` evidence is retained. STEMROBIN-184 /184-6 stays
**OPEN** for parent intake, retention and actual closure.

## Scope And Inputs

Sole independent first-display reviewer; C6 candidate only, not a source,
mathematics, answers, whole-lesson, 9c/10c completion or full-course approver.
No prior reviews, original scans or answer files were opened.

Both existing inputs matched the authorized hashes before display and after
browser shutdown:

- `exercises.html`: `cc33a1856682c63224b915f912d0ff8be6e2dc2144c0aef7285ec2d9f8f6784d`
- `text.html`: `d04e59931019614e84795f559e30f2dcd6f29bd64fa32ba3a0d55acd465de952`

Absolute paths and byte sizes are in `bindings.json`. No finalized input JSON
was needed or read. New files are confined to this new evidence directory;
the owned fresh Chromium profile and browser artifacts are also confined here.

## First Execution

One ticket-scoped installed-app Playwright check, headed Chromium
149.0.7827.55, owned fresh profile, desktop 1440x960, scale 1.
Actual cwd, executable argv, exit 1, timestamps, stdout/stderr paths and hashes
are retained in `execution.json`; the browser was closed.

The text page opened once, then its real `exercises.html` link was followed.
Only those two local file document requests occurred. No app, server, DB,
login, public network request, setup, install or publish/deploy was used.

## Observations

- All 57 exercise owners rendered nonempty, distinct and ordered 335..391.
  A placeholder's nonempty DOM text establishes presence only, not approval.
- The `.sheet` is the article-equivalent surface; there are 0 semantic
  `article` elements and 12 group headings. All owner/body/group bounds and
  number/body separation were measured; no overlap or document horizontal
  overflow flags occurred (document 1425px, viewport 1440px).
- 71 KaTeX renderings, 910 text-range rectangles, 0 KaTeX/error elements.
  `document.fonts.ready` resolved; all four used KaTeX families checked loaded.
- Numeric owner labels occupy their separate column. The Latin pairs in
  346, 347 and 378 each have two separate line boxes: vertical separation
  33.609375px versus 23px label height.
- Text view: nonempty title and heading, 0 prose/paragraph/article blocks,
  0 exercise owners, and exactly one legitimate 57-exercise link. Its sheet
  children are heading, page marker and link, not a fabricated lecture.
- 0 images/figures, background-image assets, scripts, console messages,
  page errors, failed requests or external requests were observed. The
  aggregate console/asset assertion after the geometry stop was not reached.

## Blocking Measurement And Limits

The geometry assertion recorded 40 `actual-math-vertical-clipping` flags
across 8 owners: 342, 358, 359, 360, 367, 372, 375, 379. These include duplicate
ancestor flags against `.nb` and `.body`, not 40 distinct formula defects.
First flag: 342, lower text-range extent beyond `.nb` by 2.671875px.
Largest reported positive extent: 4.6484375px. No geometry faults were omitted.

**Method limitation:** these flags compare DOM Range font-layout rectangles
with computed vertical clipping/scroll boxes at a 2px tolerance. Range
rectangles are not glyph-ink pixel bounds. Without raster inspection this
does not establish actual visible character loss or a confirmed renderer bug.
The raw check label is retained, not promoted into a pixel finding. One
horizontal math scrollport was observed; scroll reachability was not proven.

Desktop therefore cannot receive a display PASS. The stop occurred before
dependent capture/mobile work. There was no retry, test replay, repair,
fallback, source check, renderer or finalizer rerun.

## Unexecuted Work And Image Ledger

Mobile 390x844: **NOT RUN**.
All six required PNGs: **NOT CAPTURED** (individual records in `bindings.json`).
No image hashes are fabricated. Screenshot creations 0/6; model image views
0/6; current image context 0/6; batch 0/8; conservative usage
`creation + 2 * model views = 0/18`. No crops, ROIs, source headers, pixel
reconstruction or paid calls. No image payload is returned to the parent.

15 necessary text executions total, including routing, the one browser
command and final manifest verification; no polling. See `execution-ledger.md`.
Both browser streams are complete; no timeout, signal or stream truncation.

## Existing Decisions Remain Unchanged

The human-supplied already-passed source/math 56-answer and affected-text
reviews are reused directly, not recreated or newly certified here. The
retained first modern-finalizer exit 2 and affected finalizer exit 0 are not
rerun or inspected. Representation-only repairs and 3 label-only changed
exercises receive no additional content credit from this display attempt.

Source 338 UNKNOWN 2.3 / empty answer, 371/373 qualified ownership and
full-course HOLD remain. This report authorizes no answer import, whole
lesson/course acceptance, publishing, messaging, Git operation or closure.
