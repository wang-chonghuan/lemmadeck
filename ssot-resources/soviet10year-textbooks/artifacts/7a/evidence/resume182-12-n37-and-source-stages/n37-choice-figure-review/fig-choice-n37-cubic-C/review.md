# fig-choice-n37-cubic-C

Verdict: pass. Scope: independent authored-figure review only.
Reviewer: independent_agent `01a1f199-5b64-7701-ad3f-af3234bccc9e`.
Image opens: 1 (batch ordinal 3/8), original 640x420.

## Observed Image

Opened the entire final 640x420 PNG once at original resolution. The left panel visibly draws a straight rising line from screen (52,270) to (268,150), and the right draws a straight falling line from (372,150) to (588,270). Both pass through their axis intersection with a nonzero tangent. Thus the drawn models are +x and -x under the retained cubic headings, exactly the declared linear substitutes. At x=+/-1.5 their vertical magnitude is 1.5, not the cubic magnitude 3.375. No curve is missing because it lacks cubic curvature; that is deliberate. The right endpoints, +/-3 y labels and both bottom origin captions are visible.

## Mathematical Binding

Deliberate linear substitutes y=x and y=-x under the cubic formula headings. Origins and (+/-1,+/-1) agree but the curvature, growth at +/-1.5 and tangent at zero differ. x unit 72 and y unit 40 canvas units. Layout repair only: x tick labels are +/-1.5, y ticks are +/-3 vertical base units (numeric +/-5.19 or +/-44.4; normalized +/-3); Origin (0,0) is captioned below. All curve segment coordinates are unchanged.

Recomputed 130 polynomial nodes, 128 curve segments and their 384 endpoint/connectivity assertions. All 136 finite SVG segments (curves and ticks) match spec coordinates; four axis shafts plus materialized arrowheads preserve each full endpoint within 0.05 px. All 398 spec assertions passed the record_review.py rendered-stage validation. Canonical values and subpixel interpolation errors are retained in result.json. No answer-key comparison was performed.

## Layout And Display

At the declared scroll-media width 640 px, the inspected PNG is already the natural display size: the SVG has 20 px formula headings and 18 px axis titles, numeric labels and origin captions, all above the 16 px minimum. All 16 labels are visible and match the SVG text. The two origins are screen (160,210) and (480,210), and their captions are centered below at (160,395),(480,395); the captions identify coordinates, not a second plotted origin. The rightmost x title at (617,210), top headings at y=20 and bottom captions at y=395 have visible clearance from the 640x420 edge. No black raster, accidental text/curve overlap, clipping, missing arrowhead, missing right/bottom object, or cultural/foreign-language label is observed. The finite sampled x window [-1.5,1.5] is not a domain claim: axes extend beyond the curves and there are no filled endpoint markers or domain labels. No app, scroll interaction, alternative viewport screenshot or lesson surface was opened; display approval is limited to this declared 640 px figure contract.

## Current Byte Bindings

- spec: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-cubic-C/spec.json`
  SHA-256: `43d592015ee8227a49514f44ccebd61e706c2f1b76dad5fd04d5a3a0f1aa6f8b`
- render: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-cubic-C/render.json`
  SHA-256: `c583822ac4ab4c9687384af0f28ab9b9245af0294f05c059551ebd6006511f1a`
- svg: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-cubic-C/figure.svg`
  SHA-256: `108996a492fdb6c283a18b04228e154d6a6e9f939dba423e3f15e80f0612f1b3`
- png: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-cubic-C/preview.png`
  SHA-256: `80273ffd18781cfc579abf94c926e226f6dd52df31f4f1056dcd28f57e4e23ad`

- Review: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-figure-review/fig-choice-n37-cubic-C/figure.review.json`
  SHA-256: `99b0beea864cb24f1695dcfb90da2b93c07cedc4a00d09205ca2e6e1abb7446a`

## Findings

No definite asset defect; no repair requested.
The repair1 array names preview.png rather than figure.png. The authoritative final path was opened; no substitute was generated.
Inputs were hash-checked before and after review. Original assets and FIRST files were untouched. No app or lesson approval is implied.
