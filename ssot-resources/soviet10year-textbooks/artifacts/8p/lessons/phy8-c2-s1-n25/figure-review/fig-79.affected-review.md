# Independent figure 79 affected review

Date: 2026-11-23. Ticket: STEMROBIN-180. Book: 8p.
Lesson: phy8-c2-s1-n25.
Exact workdir: /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180.
Sole independent source-first reviewer; affected follow-up only.

## Verdict

**Affected PASS. Derived aggregate FIG79 PASS for the repaired bytes.**

F79-SR-01 is resolved. There is no remaining finding in the authorized
affected scope. The original `fig-79.semantic-review.md` remains **REVISE**
for its original candidate; neither that report nor its binding, source-only
freeze or read-only failed-candidate snapshots has been overwritten.

The aggregate reuses the original review's passed requirements for unchanged
body count/material, joined pair, shared apparatus, radius endpoints/order and
rotation cue, plus prior print/accent observations. The completed accepted
WHOLETEXT/SCIENCE PASS is reused without replay. This is figure approval,
not whole-edition, integration, promotion, answer or choice approval.

## F79-SR-01 Resolution

Source authority remains frozen independent object `src79-upper-connection`
and requirement `R79-upper-connection`, established from the original PNG
before author material was read. The source was not reopened.

Exact affected repaired-spec references:

- `#/source/inventory`: entry `source-upper-connection`.
- `#/objects`: `upper-connection-steel-attachment`,
  `upper-connection-left-bend`, `upper-connection-right-bend` and
  `upper-connection-aluminum-attachment` are invisible implementation anchors.
- `#/objects`: `source-upper-connection-left-terminal`,
  `source-upper-connection-span` and
  `source-upper-connection-right-terminal` are the three visible thin segments.
- `#/assertions`: the three corresponding `*-connects` assertions,
  `upper-connection-span-parallel-to-carrier`,
  `upper-connection-left-terminal-normal` and
  `upper-connection-right-terminal-normal`.
- Output: the corresponding connected segments in `figure-repair/fig-79.svg`.

The restored connection rises from the steel upper contour, crosses above
both groups and descends into the outer aluminum upper contour. The right
terminal is distinctly farther right than the joined pair's lower r1 witness;
it does not incorrectly reuse that dimension endpoint. The thin connection
is visibly separate from the thick carrier and the radius dimensions.

Implementation coordinates are [120,292] and [548,292] at the body attachments,
with raised bends [120,320] and [548,320]. These are layout evidence, not printed
physical data. The existing SVG top contour at screen y=108 maps to user
y=400-108=292; x=120 lies within the steel top span 65..175, and x=548 lies
within the outer aluminum top span 464..574. The retained author attachment
checks and the actual rendered intersections agree.

The new inventory explicitly retains uncertainty about connector material
and exact hardware, declaring rectangular shape and attachment coordinates
as modern regularization. Source connection presence/topology is preserved
without claiming recovered exact measurements, adding a force vector or
introducing numerical/solution annotations.

## Authorized Visual Inspection

Exactly two repaired images were opened, once each:

- `figure-repair/fig-79.desktop-neutral.png`: the complete upper span and both
  top attachments are visible and continuous. Material labels sit clear above
  the connector; terminals meet contours without unintended line crossings.
  The entire right carrier end and bottom shaft end remain visible.
- `figure-repair/fig-79.mobile-composite.png`: native mobile-left and
  mobile-right captures displayed side by side. Left steel attachment and
  right outer-aluminum attachment are readable at native scale, without
  affected label collisions. Both recorded ends are complete; viewport-edge
  cuts in each half are expected horizontal scrolling, not missing canvas.

The composite provenance script and successful retained execution receipt
identify the two native captures, fixed 390 px image widths and a 4 px gap,
with no apparatus rescaling/redrawing. Their hashes match the display report.
Its mobile-right case records scroll 282/282 and visible far carrier end.

Author draft validation, render and isolated headless fixture receipts are
reused, not rerun: PASS, 46 objects, four labels, 640 px media and 18 px labels;
all theme/mobile cases report complete canvas bounds and no collisions.
The repaired accent/print and individual mobile files were not opened.
Unchanged print/accent observations are inherited from the original review.

## Scope And Evidence

Structured affected comparison retained all 39 original objects, 22 original
assertions, old inventory entries and authoritative text unchanged. The only
addition is one inventory group, four invisible anchors, three thin segments
and six assertions. The unchanged rotation tip remains [226.2,72.4], with
tail [222,57]; no rotation repair or rereview was performed here.

The older author `repair-binding.json` status describes its pre-review stage,
not this verdict. Its changed-spec binding matches the final repaired spec.
Actual successful render/display receipts and this independent inspection
support the present affected PASS.

Current accepted spec SHA-256:
`0ddd211d4fccc54ae655d4d8bd0a0b32e8bb7fa8e4e09ce821efc49a6be1afbf`.

Current SVG SHA-256:
`039a27af2f97786c036232645b1a8fb5b5c2b54fdb56c3e7dd6708fa982eed01`.

Current render SHA-256:
`8de32f673c7b19210de991b92510fc5fc6c64c04363e91972a8891d1ffe8ed48`.

`record_review.py` was executed once with `python3 -B`, repaired spec/render,
status `pass` and concrete source-fidelity/resolution notes. It succeeded and
wrote only `figure-review/fig-79.review.json`; its required internal rendered
validation/hash verification is not a separate author-check replay.
`fig-79.affected-review-bindings.json` binds this report, formal review,
inspected images/provenance, accepted repaired bytes and original failure.
No full-package hash or extra gate was introduced.

## Actual Counts And Boundaries

Reviewer cumulative images: **8/8** = original once + five prior candidate
screenshots + these two repaired images. This follow-up: **2 images**.
Source/screenshot reopens: 0. Remaining batch images: **0**. Paid calls: 0.
No source-page/whole-text replay, new render/fixture/browser, parent image
opening, answer/choice key or solving-note access occurred.

Review recorder calls: 1. Separate validator/render/display reruns: 0.
DB/Git/install/app writes, promotion, new agents/chats and peer messages: 0.
Only the formal review, this report and its binding were added under
`figure-review/`. All original author/repair, dirty/staged, installer,
snapshot and failure files remain unchanged.
