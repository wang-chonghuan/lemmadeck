# Batch58 Bounded Display Repair

2026-11-17, STEMROBIN-180, same invocation. This record preserves the FIRST
DISPLAY failure and the sole affected content repair; it does not grant visual
approval or full-book acceptance.

## First Failure And Freeze

`display-review-batch58.md` remains immutable, SHA256
`a7aa6f1abe6d750b7491a5205019930914e40b49a9fa8d0642a1aaa40ae5cdb9`.
Its n39 gray formula-adjacent blocks and n68 leaked emphasis delimiters were
observed independently despite the original automated 14-view PASS.

Before edits, 50 files were byte-frozen: all three modern course directories,
n68's correct template, renderer/shared HTML parser, original report, seven HTML
files and original screenshots. The original report and all FIRST observations
remain untouched.

The attempted combined renderer/JSON/template patch failed atomically because
the expected template text was absent; it changed zero files. The actual n68
template already had correct emphasis and was never edited. No manual generated
lesson repair was applied.

## Sole Affected Repair

- Renderer `.nb` keeps horizontal scrolling and adds `overflow-y:hidden` with
  `.2em` vertical padding. Only n39 text was rendered once after this CSS edit.
- `edition.py.normalize_prose_layout` carries closing star runs with their
  sentence. The separate `prose-emphasis-delimiter-repair-b58.md` records the
  insertion-only 19-line patch, 17 passing focused methods, FIRST reproduction
  failure and eight intermediate subtest failures. No prior dirty code was lost.
- n68 alone ran one affected `adapt-finalize` from the unchanged correct
  template: PASS10/10 prose, zero exercises/figures. Its text-only render ran
  once: PASS12 final paragraphs.

Exact post-repair comparison: **46 frozen files unchanged; four changed**:
renderer, n68 lesson JSON, n39 text HTML, n68 text HTML. In n68, only whitespace
placement changed in prose indexes3/7/9; every non-whitespace character,
mathematical expression, source binding and other metadata is unchanged.
Exercises, answers, figures, audit, template, all n19 files and all original
screenshots/report are byte-identical. Repair budget1/1 used, zero remaining.

Recorder labels: `b58-energy-definition-delimiter-affected-finalize`,
`b58-energy-definition-delimiter-affected-render`,
`b58-display-repair-exact-comparison`; all exit0. The scoped byte comparison is
in ticket `tmp/b58-display-repair-byte-comparison.json`; the essential results
are repeated above, not dependent on retaining that scratch.

## Check Failure And Assertion Correction

The first affected headed check, `b58-display-sole-affected-check`, exited1
before saving any accepted view or screenshot. Its newly added assertion
required integer `scrollHeight <= clientHeight`; this FIRST failure is retained
with the exact check copied to
`tmp/b58-display-before-sole-repair/offline-check.FIRST-strict-height.mjs`.

A separate numeric-only browser diagnosis, not a visual approval or content
repair, measured actual text ranges, vector SVG and fraction-rule rectangles:

| Course / Both Viewports | Formula Wrappers Per View | Max Integer Height Difference | Min Top Clearance | Min Bottom Clearance |
| --- | --- | --- | --- | --- |
| n39 | 13 | 1px | 0.890625px | 0.8984375px |
| n68 | 4 | 0px | 4.40625px | 4.03125px |

Every wrapper has computed `overflowY=hidden`. The deepest n39 formula measures
47.3203125px in its actual border box, with integer client/scroll values47/48.
Its glyphs span0.890625 through46.421875px, strictly within the actual boundary.
Thus the integer inequality was an invalid no-clipping proxy in this case.

Only the scratch assertion was corrected: at most1px integer discrepancy,
hidden vertical overflow, nonempty glyph coverage, and every actual text/SVG/
fraction-rule rectangle fully contained in the border box. No content, CSS,
template, HTML or answer changed after the failed check. The one assertion
continuation, `b58-display-affected-height-assertion-continue`, exited0:
**four affected text views PASS**, n39/n68 at1440x960 and390x844. Browser closed.
Current report is separate from all prior reports:
`tmp/offline-evidence-b58-affected-height-assertion-corrected/report.json`.

## Acceptance Boundary

Independent affected screenshot review in `display-review-batch58-affected.md`
is FIRST affected PASS4/4, SHA256
`ababb6e8600bd6566a89444aaece8ee4ea68d4fd0b3cdd41b63f0102312339b4`.
That separate pixel review supplies visual approval, not this diagnosis. Reuse the original
n19 screenshot approval and ten unchanged automated observations; replace only
the four affected text observations in a separate accepted report. The original
overall DISPLAY FAIL must never be relabeled as a PASS.

Parent image loads0, conservative baseline21/24 unchanged. No image service
calls/retries, source/physics/answer replay, app/dependency change, shared DB,
publication, merge, deployment or full-project checks occurred. Billing and
model-token usage remain unknown. This is a bounded three-course offline batch,
not ticket completion.
