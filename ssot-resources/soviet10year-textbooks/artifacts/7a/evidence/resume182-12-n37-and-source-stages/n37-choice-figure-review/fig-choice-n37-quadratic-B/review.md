# fig-choice-n37-quadratic-B

Verdict: pass. Scope: independent authored-figure review only.
Reviewer: independent_agent `01a1f199-5b64-7701-ad3f-af3234bccc9e`.
Image opens: 1 (batch ordinal 6/8), original 640x420.

## Observed Image

Opened the entire final 640x420 PNG once at original resolution. The left heading y=ax^2, a>0 has an upward parabola with endpoints (52,120),(268,120), vertex (160,210). The right heading y=ax^2, a<0 has a downward parabola with endpoints (372,300),(588,300), vertex (480,210). Both vertical axes visibly read y/|a|, with +/-3 normalized ticks; neither heading nor axis assigns a numeric value to a. Dividing ax^2 by |a| independently yields +x^2 for a>0 and -x^2 for a<0. At x=+/-1 the normalized values are +1 and -1, and at +/-1.5 they are +2.25 and -2.25. The normalization text is separated from the equation and +3 tick. The right-hand objects and both bottom origin captions are complete.

## Mathematical Binding

Parameter pair normalized by the visibly labelled y/|a| axis. For a>0 draw +x^2; for a<0 draw -x^2, both at origin. No fixed value of a is introduced. x unit 72 and normalized vertical unit 40 canvas units. Values at +/-1 are +/-1 and at +/-1.5 are +/-2.25 in normalized units. Layout repair only: x tick labels are +/-1.5, y ticks are +/-3 vertical base units (numeric +/-5.19 or +/-44.4; normalized +/-3); Origin (0,0) is captioned below. All curve segment coordinates are unchanged.

Recomputed 130 polynomial nodes, 128 curve segments and their 384 endpoint/connectivity assertions. All 136 finite SVG segments (curves and ticks) match spec coordinates; four axis shafts plus materialized arrowheads preserve each full endpoint within 0.05 px. All 398 spec assertions passed the record_review.py rendered-stage validation. Canonical values and subpixel interpolation errors are retained in result.json. No answer-key comparison was performed.

## Layout And Display

At the declared scroll-media width 640 px, the inspected PNG is already the natural display size: the SVG has 20 px formula headings and 18 px axis titles, numeric labels and origin captions, all above the 16 px minimum. All 16 labels are visible and match the SVG text. The two origins are screen (160,210) and (480,210), and their captions are centered below at (160,395),(480,395); the captions identify coordinates, not a second plotted origin. The rightmost x title at (617,210), top headings at y=20 and bottom captions at y=395 have visible clearance from the 640x420 edge. No black raster, accidental text/curve overlap, clipping, missing arrowhead, missing right/bottom object, or cultural/foreign-language label is observed. The finite sampled x window [-1.5,1.5] is not a domain claim: axes extend beyond the curves and there are no filled endpoint markers or domain labels. No app, scroll interaction, alternative viewport screenshot or lesson surface was opened; display approval is limited to this declared 640 px figure contract.

## Current Byte Bindings

- spec: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-quadratic-B/spec.json`
  SHA-256: `bb6886de75e796f538ae059f3ff0b140cc0bc7275f6c6c73b1325addfbf406e1`
- render: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-quadratic-B/render.json`
  SHA-256: `d3861a0a86fce40b622b113506501aee2bcc4ea6d3b3d9b6144bbc6585b02c87`
- svg: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-quadratic-B/figure.svg`
  SHA-256: `30e6997da19592ca620716848ad852e95e95ff806a947feb8ad169208fe81846`
- png: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-quadratic-B/preview.png`
  SHA-256: `27f138f75c850a570c62ecae3c54feef2b79eb2357b7f2fff03921de0cf24356`

- Review: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-figure-review/fig-choice-n37-quadratic-B/figure.review.json`
  SHA-256: `7f689a7c63ad70802b04af2c3ea743cdfe37873c1b17f20ee29397c656e4e60a`

## Findings

No definite asset defect; no repair requested.
The repair1 array names preview.png rather than figure.png. The authoritative final path was opened; no substitute was generated.
Inputs were hash-checked before and after review. Original assets and FIRST files were untouched. No app or lesson approval is implied.
