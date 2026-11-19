# fig-choice-n37-cubic-A

Verdict: pass. Scope: independent authored-figure review only.
Reviewer: independent_agent `01a1f199-5b64-7701-ad3f-af3234bccc9e`.
Image opens: 1 (batch ordinal 1/8), original 640x420.

## Observed Image

Opened the entire final 640x420 PNG once at original resolution. The left heading y=x^3 sits over a decreasing, flattened-at-zero odd cubic; its endpoints are screen (52,75) and (268,345), corresponding to (-1.5,3.375) and (1.5,-3.375). The right heading y=-x^3 sits over the increasing reflection, endpoints (372,345) and (588,75). Both curves cross their axis intersection. This is exactly the declared exchange of +x^3 and -x^3, not an accidental sign defect. The y ticks are +3 above and -3 below; x ticks are -1.5 left and +1.5 right. Both right-hand curve ends and both bottom Origin (0,0) captions are visible.

## Mathematical Binding

Deliberate exchange: the panel labelled y=x^3 draws -x^3, and the panel labelled y=-x^3 draws x^3. Each odd cubic has origin (0,0), x unit 72 canvas units, y unit 40 canvas units; sampled x in [-1.5,1.5]. Layout repair only: x tick labels are +/-1.5, y ticks are +/-3 vertical base units (numeric +/-5.19 or +/-44.4; normalized +/-3); Origin (0,0) is captioned below. All curve segment coordinates are unchanged.

Recomputed 130 polynomial nodes, 128 curve segments and their 384 endpoint/connectivity assertions. All 136 finite SVG segments (curves and ticks) match spec coordinates; four axis shafts plus materialized arrowheads preserve each full endpoint within 0.05 px. All 398 spec assertions passed the record_review.py rendered-stage validation. Canonical values and subpixel interpolation errors are retained in result.json. No answer-key comparison was performed.

## Layout And Display

At the declared scroll-media width 640 px, the inspected PNG is already the natural display size: the SVG has 20 px formula headings and 18 px axis titles, numeric labels and origin captions, all above the 16 px minimum. All 16 labels are visible and match the SVG text. The two origins are screen (160,210) and (480,210), and their captions are centered below at (160,395),(480,395); the captions identify coordinates, not a second plotted origin. The rightmost x title at (617,210), top headings at y=20 and bottom captions at y=395 have visible clearance from the 640x420 edge. No black raster, accidental text/curve overlap, clipping, missing arrowhead, missing right/bottom object, or cultural/foreign-language label is observed. The finite sampled x window [-1.5,1.5] is not a domain claim: axes extend beyond the curves and there are no filled endpoint markers or domain labels. No app, scroll interaction, alternative viewport screenshot or lesson surface was opened; display approval is limited to this declared 640 px figure contract.

## Current Byte Bindings

- spec: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-cubic-A/spec.json`
  SHA-256: `e8e9a2949df3a10be4cb24363c27cb373afe54f30ece59f60c486de9916b253a`
- render: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-cubic-A/render.json`
  SHA-256: `05ef1ab0b334cfed79abb9323424739662da615c911bf1a47f7922ee0c2c14f0`
- svg: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-cubic-A/figure.svg`
  SHA-256: `cd030f27af8576bbae8534782cc01fae0c625bc34a203227c75ed4dad89f9bef`
- png: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author/figures/fig-choice-n37-cubic-A/preview.png`
  SHA-256: `de7131f688eaf03a0ed38d8284da6236b0a57c0d573c479cdb10e504ef145d50`

- Review: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-figure-review/fig-choice-n37-cubic-A/figure.review.json`
  SHA-256: `8b7f8eb56bfb965d7bad7ee39d4a47e9d6ec43260053a34e4c997e2ac60e1cab`

## Findings

No definite asset defect; no repair requested.
The repair1 array names preview.png rather than figure.png. The authoritative final path was opened; no substitute was generated.
Inputs were hash-checked before and after review. Original assets and FIRST files were untouched. No app or lesson approval is implied.
