# S11 Offline Display Observation

2026-11-19. Status: **HOLD**, not approval. Observed visible regions: **PASS**.
Only display was inspected; no mathematics, answers/key or source fidelity was reviewed.

- All six full screenshots were actually opened and scanned from heading through bottom content, not judged from a clipped thumbnail. All six hashes match `result.json`; its SHA-256 is `bbcd99445cef955a132e000e2cacbcc86b638a0ea0057514029968fc87eff00e`.
- Both sizes visibly contain 17 originals numbered 107-123, including the complete last question; both choices screenshots contain 13 groups and 58 options: `4,4,4,6,8,4,4,4,4,4,4,4,4`. The final D option and bottom separator are visible.
- No visible prose/formula overlap, text-container overflow or bottom truncation was observed. Inline formulas wrap on mobile. No table or large display formula is present.
- Desktop正文 figures 54-58 are fully visible. Desktop original/choices figure 59 shows both complete panels, lower baseline and bottom `b)` label.
- Mobile screenshots show only initial left scroll endpoints: right figure portions and fig-59 `a)`/`b)` labels are outside the visible region. This is the user-confirmed existing scroll contract, not an established rendering defect.
- Supplementary `scroll-result.json` SHA-256: `e1613b3996dcc809c1e098de42f40690f5b380d1199b20987a845bef8b8dfb8e`. Its seven real endpoints reach the right edge: text/choices `358/640/282`; originals `310/640/330`, with only `0.015625 px` right-edge difference.
- All three right-end screenshot hashes were verified as metadata, but **none was visually opened**. Their real scroll assertions support reachability, not an eyewitness mobile-right PASS. The shared fig-59 SVG hash is user-reported, not independently verified here.
- Exact image accounting: **8 loads, one batch, no reset**. Six original opens, one genuine 390x1200 fig-59 crop, then one duplicate full-image reopen. The second intended crop actually retained 390x5785 and the original choices hash; its misleading filename is explicitly recorded in JSON. No further images were opened.
- `result.json` lacks `DOMcounts`: original `questionCount` is null and choices has only 13, not 58 options. Visual counts above are independent observations, not fabricated DOM evidence.

The HOLD concerns the uncompleted mobile right-end visual observation under the exhausted eight-image limit. It does not assert that the scroll contract is broken. No previous review output was overwritten. Per-screenshot hashes, dimensions, observations, exact open ordinals and the unopened supplemental bindings are in `visual-review.json`.
