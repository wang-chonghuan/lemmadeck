# C6 New Display Review

STEMROBIN-184 / `10c` / `ana10-c6-ex`.
Sole root: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

**Outcome: pass within the declared new-display evidence scope.**

Exactly eight declared representative PNG captures were opened once in one
batch. Cumulative image opens: **0 -> 8**. No reopens, crops, screenshots,
old-image opens or image forwarding were performed. This is display evidence,
not a replay of the completed source, choice or answer mathematics reviews.

## Binding Checks Before Image Opens

Report:
`ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov23-1847-c6/display-new/report.json`.
Actual byte SHA-256:
`bd0ad14d1a470c2c97b70c6648b0d6b511a4a2fff521617f41176808197bc2a4`.

All 20 declared bindings matched actual bytes: eight input records, two new
HTML pages, two unchanged prior written HTML pages and eight PNG captures.
Input records were read as bytes for hashing only, not as mathematical inputs.
All four desktop captures are 1440x960; all four mobile captures are 390x844.

The retained choice draft is byte-bound to the accepted final candidate:
`26e4c9ffff1d5137da44d10fa51e59e97f52b396302c9012f905dc1bd12be079`.
The retained semantic review is byte-bound to its accepted pass:
`0a098d8c972bae5f8953ff55af218fb15f3506524f6b5431d68e5badb11810ad`.
No canonical choice artifact, report, capture or prior review was modified.

New HTML byte hashes:

- choices.html:
  `0630cde978d5194081293140540f5a80b6c4158505999e7623c85eba567c2ecd`.
- answers.html:
  `735e61fd4480dbad0ada84243510bae2cac608affdb890c7e226fc49c1c739c4`.

## Eight Actual Pixel Observations

1. **choices-1440-0.png.** The navigation and heading are legible. The first
   two questions show aligned radio controls, readable derivative marks,
   signs and fractions. The next question has square checkbox controls.
   The visible text and math are separated from controls and section rules.
   The viewport ends during the next question; that is not evidence of
   an inaccessible article or clipped container.

2. **choices-1440-1.png.** The final three choice units are visible with
   clearly separated radio rows. Greek letters, square brackets, fractions
   and superscripts are readable in the sampled formulas. The last unit's
   final option is wholly visible with bottom whitespace and no overlap.

3. **answers-1440-0.png.** Answer-owner headings 335 through 339 and their
   visible formula rows are legible. The longer displayed line under 338
   fits the sampled desktop content area. Separators, text and math do not
   overlap. The next heading begins at the viewport bottom; its body is not
   pixel-reviewed by this image.

4. **answers-1440-1.png.** The final answer region through owner 391 is
   readable, including fractions, the integer-set marker and multi-line
   text/math. The final row has visible right and bottom space. The partial
   preceding line at the top is ordinary vertical viewport sampling.

5. **choices-390-0.png.** Navigation and heading stay inside the mobile
   page. The first stem wraps across lines without colliding with its
   controls; the first two questions' radio rows and inline fractions are
   legible. The third question begins at the bottom. No incoherent overlap
   or page-edge spill is visible in the sampled region.

6. **choices-390-1.png.** The last two full choice units have readable
   wrapped stems, aligned radio controls and legible bracket/fraction math.
   The final option and bottom whitespace are visible. Earlier option rows
   at the top belong to the preceding partially sampled unit, not an
   article whose omitted pixels are claimed approved.

7. **answers-390-0.png.** The initial headings and visible short answer
   formulas are readable. Longer formulas under 337/338 are partially shown
   at the left position of horizontal math ports. The HTML gives those
   ports horizontal auto overflow, and the helper restores the original
   scroll position before captures. This image is not a full-tail pixel
   witness; it does not by itself establish inaccessible clipping.

8. **answers-390-1.png.** The final answer region has readable wrapped
   text, fractions and math rows, with owner 391's final expression fully
   visible and separated from the previous section. The heading of the
   preceding partial answer is above this bottom-scrolled viewport.

All eight captures were inspected from their pixels; a hash alone was not
treated as visual approval. No sampled illegibility or incoherent overlap
requires revision, and no concrete missing affected evidence requires a HOLD.

## Mechanical and Owner/Control Evidence

The report records no page overflow, no renderer-error markers and loaded
fonts in all four page/viewport combinations. Choices have 60 articles and
427 KaTeX nodes at each width; answers have 57 articles and 204 KaTeX nodes.
The retained helper also checks browser page errors before declaring success.

Static inspection of the actual bound HTML confirms:

- 60 distinct choice article owners, with 215 native option inputs:
  138 radios and 77 checkboxes.
- Each input name matches its containing question owner, and each
  option-label identifier matches its input aria-label.
- 57 distinct answer owners, beginning at 335 and ending at 391.
- 427 choice and 204 answer KaTeX root nodes, agreeing with the report.

The helper constructs choice stems/options from `view`, not the author key,
intent or source solution. It constructs answer articles from their existing
display-answer strings; this review does not rejudge those mathematical
answers. Native option controls were tested by the upstream helper, not clicked
by this reviewer. Its per-viewport radio/checkbox sequence corresponds to
`138 + 2*77 = 292` clicks, and two widths account for the reported 584.
After radio clicks it checks exactly one selected input in the owner group;
checkboxes are clicked on and off and checked in both states.

The reported math-port checks cover four desktop choice ports, nine mobile
choice ports and ten mobile answer ports. All 23 reached their scroll ends,
with terminal bounds inside the frame under the helper's 1px tolerance.
These are programmatic scrollLeft/end and terminal-geometry checks; they are
not a mouse-drag/touch-gesture or exhaustive painted-glyph test. Fractional
terminal/frame differences within the tolerance are not used to infer
pixel clipping from font bounds.

The CSS `.nb`/`.sr-nb` overflow contract matches the observed partial mobile
answer math and the report's end-reach checks. Sampled pixel legibility and
the all-control/port checks are complementary; neither is relabeled as the
other. The helper records `browserClosed: true`; this reviewer opened no
browser and did not rerun the helper.

Retained helper:
`ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov23-1847-c6/c6-new-display.mjs`.
Current byte SHA-256:
`e77f59327409780409cd9477f63f14694b3c1e5e7e45228c8068d445c5cd80f6`.
This binds the inspected retained code; the report does not separately claim
an execution-time helper-source digest.

## Written Display Reuse and Limits

The report's old written-review reference is retained. The applicable reuse
record is the parent evidence directory's `reuse.md`, not a file inside
display-new. Its byte SHA-256 is
`4af2a95036eaa794d81b618643937efbdf8397f94121ac23570ef5aeeabf3167`.

The prior written HTML hashes match:

- exercises.html:
  `cc33a1856682c63224b915f912d0ff8be6e2dc2144c0aef7285ec2d9f8f6784d`.
- text.html:
  `d04e59931019614e84795f559e30f2dcd6f29bd64fa32ba3a0d55acd465de952`.

The existing written-display pass is reused at its original seven-sample
and reported mobile-scroll-end scope, not as exhaustive glyph approval.
No old image or old review was reopened and no cap7/written render was rerun.

This new pass is limited to the two bound offline pages, the two specified
viewports, all reported option/port checks and the eight representative pixel
samples. It does not claim inspection of every one of the 427/204 KaTeX
instances, every middle article or every terminal glyph. In particular the
three revised inverse-proof units are not first/last pixel samples.
It does not certify live-app integration, grading, persistence, navigation
clicks, keyboard or gesture behavior, or mathematical correctness beyond
the separately retained semantic evidence.

## Actual Operations and Costs

Before creating these review files: ten read-only shell invocations
(eight successful, one no-match search, one missing-path read subsequently
resolved), and eight successful view_image calls in one batch.
No additional images were loaded for recovery. The receipt in the JSON is
bounded before file creation; its creation and final digest-only read are
outside that cutoff.

Reviewer image opens: 8; previous cumulative opens: 0; final cumulative: 8.
Reviewer screenshots/crops/browser/mouse/keyboard calls: zero.
Upstream helper clicks: 584; upstream captures: eight; upstream image opens
reported as zero before this independent inspection.
Auxiliary paid calls: zero. Model, hidden raster/model cost, total tokens,
reviewer elapsed time and monetary total are UNKNOWN; no estimate is substituted.

No source/answer/choice semantic replay, canonical edit, validator, Git, DB,
environment-secret read, app, dependency, agent or peer operation was performed.
Only this textual/JSON display review was written under the reviewer directory.
