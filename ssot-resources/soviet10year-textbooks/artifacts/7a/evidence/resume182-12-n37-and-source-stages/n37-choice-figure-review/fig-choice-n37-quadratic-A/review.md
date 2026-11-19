# fig-choice-n37-quadratic-A

Verdict: pass. Scope: independent authored-figure review only.
Reviewer: independent_agent `01a1f199-5b64-7701-ad3f-af3234bccc9e`.
Image opens: 1 (batch ordinal 5/8), original 640x420.

## Observed Image

Opened the entire final 640x420 PNG once at original resolution. The left y=1.73x^2 heading has the declared downward reflection (-1.73x^2), vertex (160,210), endpoints (52,300),(268,300). The right y=-14.8x^2 heading has the declared upward reflection (+14.8x^2), vertex (480,210), endpoints (372,120),(588,120). The vertical title is y, not x or a normalized axis. Visible y ticks are +/-5.19 on the left and +/-44.4 on the right at 120 px from zero; hence the units are 40/1.73=23.121387 px/y and 40/14.8=2.702703 px/y. Equal-looking curve widths do not imply equal y scales. At x=+/-1 the declared values are -1.73 and +14.8; at +/-1.5 they are -3.8925 and +33.3. The sign exchange is deliberate. Rightmost x, lower y ticks and both bottom origin captions are readable and uncropped.

## Mathematical Binding

Deliberately reflected numeric pair: y=1.73x^2 heading draws -1.73x^2, and y=-14.8x^2 heading draws +14.8x^2. Actual y axes have ticks +/-5.19 and +/-44.4. Independent panel vertical units are 40/1.73 and 40/14.8 canvas units per y unit. x unit 72. Thus wrong coefficient signs, not hidden changed scales, produce the wrong orientations. Layout repair only: x tick labels are +/-1.5, y ticks are +/-3 vertical base units (numeric +/-5.19 or +/-44.4; normalized +/-3); Origin (0,0) is captioned below. All curve segment coordinates are unchanged.

Recomputed 130 polynomial nodes, 128 curve segments and their 384 endpoint/connectivity assertions. All 136 finite SVG segments (curves and ticks) match spec coordinates; four axis shafts plus materialized arrowheads preserve each full endpoint within 0.05 px. All 398 spec assertions passed the record_review.py rendered-stage validation. Canonical values and subpixel interpolation errors are retained in result.json. No answer-key comparison was performed.

## Layout And Display

At the declared scroll-media width 640 px, the inspected PNG is already the natural display size: the SVG has 20 px formula headings and 18 px axis titles, numeric labels and origin captions, all above the 16 px minimum. All 16 labels are visible and match the SVG text. The two origins are screen (160,210) and (480,210), and their captions are centered below at (160,395),(480,395); the captions identify coordinates, not a second plotted origin. The rightmost x title at (617,210), top headings at y=20 and bottom captions at y=395 have visible clearance from the 640x420 edge. No black raster, accidental text/curve overlap, clipping, missing arrowhead, missing right/bottom object, or cultural/foreign-language label is observed. The finite sampled x window [-1.5,1.5] is not a domain claim: axes extend beyond the curves and there are no filled endpoint markers or domain labels. No app, scroll interaction, alternative viewport screenshot or lesson surface was opened; display approval is limited to this declared 640 px figure contract.

## Current Byte Bindings

- spec: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-quadratic-A/spec.json`
  SHA-256: `39a1d3105c792d108f816f9ffac69499bd592adef116d9e1389692a3e33a639f`
- render: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-quadratic-A/render.json`
  SHA-256: `01fece3f88e48d08bf50834855fd26251b8415f02c3d39bdd689b2ff39e3ad8f`
- svg: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-quadratic-A/figure.svg`
  SHA-256: `54ee2434331a180e8d1e497ebc55576ca7d76dbf99c2a6ec27d0ef0329730de3`
- png: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-quadratic-A/preview.png`
  SHA-256: `7036da16d6721661f1591d72fe3dbf174afcdc1900d7c7813ecfae368b29e164`

- Review: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-figure-review/fig-choice-n37-quadratic-A/figure.review.json`
  SHA-256: `07f1a87f55452b90a5b64d7ed6507c35c848da0f1fd27f64fee0f6a097a68cdb`

## Findings

No definite asset defect; no repair requested.
The repair1 array names preview.png rather than figure.png. The authoritative final path was opened; no substitute was generated.
Inputs were hash-checked before and after review. Original assets and FIRST files were untouched. No app or lesson approval is implied.
