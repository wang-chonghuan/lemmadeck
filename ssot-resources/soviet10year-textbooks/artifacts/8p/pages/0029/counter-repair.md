# p0029 Bounded Counter Repair

2026-11-23, STEMROBIN-180 /180-7. Execution root throughout:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.

## Actual Cause

The extra counted row was scan ink at y567-591, x24-68, not missing
transcription or figure/caption geometry. The closed margin cluster is
`[24,566,45,28]`: 710 ink pixels, density 0.56349, no enclosed holes, and
710 pixels in its clearance region. Estimated body glyph height was 45 px.
All existing margin-blot guards passed except the compact aspect guard:
width/height = 1.60714 exceeds 1.4.

Opened the actual page once and the enlarged offending source crop once.
The source shows ten body rows, two shared caption rows and one footer row.
Actual retained counting bands, excluding the blot:
`831-863; 900-948; 981-1027; 1061-1108; 1142-1188; 1223-1269;
1302-1350; 1382-1430; 1462-1512; 1545-1594; 2105-2141; 2173-2223;
2262-2289`.
All four source figures were masked with their existing precise rectangles;
both caption pairs remain outside those rectangles. No candidate row repair
was needed for this discrepancy. This is not full source-content approval.

## Minimal Change

Only `tools/layout.py` counter logic and new
`tools/test_line_bands_margin_core.py` were authored.
The existing compact-aspect path remains. A shallow, glyph-sized cluster can
also qualify when square morphological opening, sized to 0.2 body glyph
height, retains at least 70% of its ink as a solid core. Existing margin,
height, density/hole and isolation guards still apply. This source retains
550/710 pixels (77.46%) under the 9 px opening.
No page identity, expected count, source mask, profile or global threshold
was added. Source/extraction pixels are unchanged. The right-margin
`int(0.95 * ink.shape[1])` repair from 29a7f8c88 is untouched.

## Verification and Retained Failures

After implementation: 11/11 focused tests PASS, including all four existing
fraction/body controls and seven new smear/stroke/isolation/quotient tests.
Historical pre-29a7f8c88, current-before-repair and repaired code count the
actual page as 14 / 14 / 13. The repaired result equals the actual source
with only the offending blot removed, with all other band coordinates intact.
Deleting each of the ten observed body rows independently now yields 12,
never a false 13. Printed outlines, interior ink, neighboring margin ink,
standalone quotient digits and two single-glyph body rows remain counted.

The first verification run exited 1: four actual body-deletion controls
changed glyph height to 44-44.75 px, causing the first core guard's strict
one-glyph width bound to retain the 45 px blot. Preserved its implementation,
matrix and diagnosis; corrected that bound to the existing counter's
1.3-glyph component-width envelope, without lowering the deletion assertions.
The subsequent bounded verification exited 0. Historical/current comparator
assertion failures are retained, not reported as repaired-code passes.
An initial directory inspection exited 1 because the scratch directory did
not yet exist; no missing-package installation or runtime repair was needed.

Diagnostics under `.tmp/180-7-n5-counter/` include:
`source-diagnosis.json`, `blot-shape-diagnosis.json`, `masked-row-overlay.png`,
`blot-source-crop.png`, `layout-current.py`,
`layout-first-core-control-failure.py`, `verification-matrix.json`,
`first-body-control-failure-diagnosis.json`,
`verification-matrix-guarded.json`, both sets of `tests-*.txt`,
`finalize.stdout`, `finalize.stderr` and `post-finalize-check.json`.
The diagnostic scripts are retained there as well.

## Exactly One Finalize

Ran `p2c.py finalize --book 8p --page 29` exactly once after repair:
exit 0; 12 blocks; printed 13 / Markdown 13; figures 4; errors 0;
normalizations 0.
`page.md`, `page.json`, source PNG, all four figure crop bytes and precise
boxes are unchanged. Only the current audit reflects recovered counting.
Both `audit-first-counter-failure.snapshot.json` and
`page-first-counter-failure.snapshot.md` remain byte-identical.
`git diff --check` for owned paths passed.

Image loads: 2 total, no reopens; within 4/task, 8/batch and 24/context.
No other page, source review, publisher, database, environment file, app,
schema, installer edit, installation, paid call, commit, push or new
worktree/branch/chat/timer/subagent was touched or created.
