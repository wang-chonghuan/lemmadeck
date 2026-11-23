# N35 Exercises Display Review

status: fail

Independent retained offline desktop/mobile display review only. No mathematical re-solving, source/figure gate, product/keyboard test, canonical edit or original capture rerun.

## Findings

1. F1, exercise 454, `#ex-454 .body`: blue outer `454.` plus inline printed `454` with superscript bullet and period. Visible in desktop part 1 and mobile part 2. References: canonical exercises `[4].number` and `[4].text`. Two printed numbers, one bullet; the bullet itself is not duplicated.
2. F2, exercise 456, `#ex-456 .body`: blue outer `456.` plus inline printed `456` with superscript bullet and period. Visible in desktop part 1 and mobile part 2. References: canonical exercises `[6].number` and `[6].text`. Two printed numbers, one bullet.
3. F3, exercise 459, `#ex-459 .body`: blue outer `459.` plus a separate inline printed `459` with superscript star and period. Visible in desktop part 2 and mobile part 3. References: canonical exercises `[9].number` and `[9].text`. Two printed numbers, one star.
4. F4, exercise 451, `#ex-451 .answer-support`: the final Chinese full stop after the two ray-set expressions occupies a line by itself above exercise 452 on mobile part 1. Reference: answer keys `[1].displayAnswer`, last sentence. Minor sentence-flow defect, not missing mathematics.

All findings are minor display defects. Number duplication is established from the screenshots, not inferred from source fields.

## Coverage

- All 10 prompts 450-459 and all 10 complete standard answers are present and readable on both widths. All 18 numeric subparts and 11 Latin subpart labels match, including both a/b pairs in 452 and 453 and a/b/c in 459.
- Current canonical counts are 10 exercises and 10 answers, all 10 ungraded, auto 0. All 10 answer prompts exactly match the canonical exercise text.
- Desktop: two original PNGs, continuous document range 0-7773 at viewport 1440x960. Mobile: three original PNGs, continuous range 0-12077 at viewport 390x844. No gaps or cut exercise objects; both final screenshots include the last proof and return-to-lesson footer.
- All requested math/symbols remain readable. No observed overlaps, page overflow, missing content or unreachable clipping. No answer input controls are visible; answers are plain read-only content.
- Some mobile 450 comma separators start wrapped lines, but the adjacent ray expressions remain readable and correctly ordered.

## Wide Math

Exercise 459 mobile answer, `#ex-459 .answer-support`, part 1 c), four six-sided polygon coordinate rows: the apparent missing right parentheses in mobile part 3 are reachable, not lost.

The targeted offline observation reused the existing native HTML, current answer renderer and retained answer CSS. Answer width is 310px, scroll width 316px, `overflow-x: auto`; requested and reached scroll end are both 6px. All four rightmost coordinate parentheses are readable in the endpoint PNG. The left ends remain reachable at the initial scroll position. The document itself remains 390px wide. No table is present in these answers.

Only one extra 390x397 PNG was generated and opened. The first diagnostic attempt failed on an incorrect paragraph-node assumption before generating a screenshot; that technical failure is recorded in review.json. Both owned browsers closed. No original capture or capture manifest was overwritten.

Fig-218 source/math/media/scroll PASS is reused. Capture-manifest measurements remain 640px media, 8 labels, 22px minimum label size; desktop scroll 13/13px and mobile 330/330px. No figure gate or separate figure image was reopened.

## Bindings

Absolute paths, all five original screenshot hashes/dimensions, exact exercise references and the targeted evidence path are in review.json.

- Original capture manifest SHA-256: `5960bfe29fa0b92e2fcdcfba5904c1897a1f999781bbc78a30e69c42dd070c4a`. Its `mechanical-pass-visual-review-pending` status is unchanged.
- Current canonical exercises SHA-256: `748d8c76cf516434a3d0a1218b124e61867d91269fe0468de2b771df6753acbf`.
- Current canonical answers SHA-256: `a41b7858fa96468d21f07a99d593d942dd70aae6f36ea4a2951381598120a535`.
- Targeted endpoint PNG SHA-256: `460982fc74eecf9cac88aa796713320af974398e94f3f646f6f3e2d2c0f6eff2`.

Images: 5 exact originals opened once each, 0 reopens, 1 targeted extra, 6 total in this batch/context against limits 8/24. Findings: 4, comprising 3 duplicate printed numbers and 1 punctuation-flow defect. Missing-content findings: 0. Unreachable-clipping findings: 0. Canonical/original capture edits: 0. Product/keyboard/source/figure/finalizer/DB/environment/network/install/Git/worktree/chat/peer/supervisor actions: 0.
