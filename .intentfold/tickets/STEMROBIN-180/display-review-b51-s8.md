# Batch51 s8 Offline Display Observer

**Verdict: DISPLAY PASS.** No display blocker observed in the bounded sample for `6p / phy6-c5-s8` on 2026-11-17. This is screenshot-only observation, not full-book acceptance, ticket handoff, course completion, DB publication, or deployment approval.

## Scope And Evidence

- Same shared checkout; preserved others. No content repairs, Git, DB, app changes, dependencies, services, browser launch, render, or offline-check rerun.
- Reused the human-authorized headless offline run, exit 0, finished `2026-11-17T02:27:55.280Z`; existing official-render output records success. Headless was explicitly authorized, not headed evidence.
- Existing report: six pages, text/exercises/choices at `1440x960` and `390x844`, status `pass`. HTML hashes below still match that report.
- Prior independent semantic/media passes are reused as supplied by the human. No answer keys, author solutions, new source, math solving, FIG review, or CHOICE review performed.
- Exactly **8 image observations**, including 5 mechanical crops; **0 reopens, parent 0**. Unseen regions are not claimed visually reviewed.

Exact roots:

```text
E = /Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/offline-evidence-b51-s8
C = /Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/display-review-b51-s8
H = /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/display-b51/render/6p/modern-us-neutral/phy6-c5-s8
```

`E/report.json` SHA-256: `ea561c4651996a3ebd6ca1a528b0019a87d6b44f09c3a030d75012e5c38402bf`.

| Current HTML | SHA-256 |
| --- | --- |
| H/text.html | 402915025afdd06b393d9d5cd114e3bdd2f04a75d2953bf1aeeadaa1758a923b |
| H/exercises.html | 52487f3fa4506c455c2467fe95d655fff5d4b223e0d5d2bf41fc6949df05f13e |
| H/choices.html | 1f137ae4ae85d691714ce99fc2a65a8bf6307d37588d51764a82bd73315f7fd6 |

## Observations

- **1, full fig196 mobile:** frame top/base, both axle markers, rope attachment and free end, both instruments, suspended block, and complete `h`/`2h` dimension arrows are visible inside the image. No missing edge, label collision, or broken-image state.
- **2, full fig100 written mobile:** both piston columns and connected vessel outline are complete; `A/B`, `S₁/S₂`, `F₁/F₂` and arrowheads remain readable without overlap.
- **3, full fig181 written mobile:** `B/O/A`, indexed `l₂/l₁`, `F₂/F₁`, fulcrum, ticks and arrowheads fit. Small indices are visually distinguishable.
- **4 and 6, desktop/mobile first choice:** all five options and native square checkbox affordances are visible, empty and neutral. Prose/formulas wrap within the page; mobile option C continues after `=` without clipping or collision. Desktop heading wraps its final character onto the next line, without overlap.
- **5, mobile single choice:** all four native round radio affordances and three-column tables are readable; column headings, decimal values, `m` and `J` fit. This crop starts/ends inside adjacent figures by selection, not because those figures are missing.
- **7, mobile last choice:** complete hydraulic figure and all four radio options are visible. Fractions, subscripts and squared expressions fit on successive lines. Some punctuation starts a new line; none is hidden or overlapping. Final option and bottom whitespace are present.
- **8, written last task/end:** existing `作业` instruction, `F₁/h₁/h₂` text, full hydraulic figure, and `回课文` button are visible through the page bottom. The preceding subtask is intentionally cut at this crop's top.
- **Leak boundary:** no answer key, selected/correct option styling, solution feedback or reviewer hints appear in the sampled choices. The written task visibly contains its own retained sentence `提示：证明时利用图100。`; this is recorded honestly, not treated as a hidden answer or independently re-adjudicated.
- **Size/reachability:** the report's actual mobile SVG label minimum is `17.4375px` in written fig181; written fig100 is `20.34375px`; text/choice fig181/196 labels are `20.1375px` (choice fig100 `23.49375px`). All exceed 16px and agree with the readable samples. This is not a claim that every caption, breadcrumb or subscript glyph is 16px. The retained check asserts no page-wide horizontal overflow, no `.err`/pageerror, correct native input types and unchecked state, and last-element scroll reachability at both sizes. No fresh scrolling or input interaction was tested; inputs are deliberately disabled in the offline HTML.

## Eight-Image Ledger

Rectangles are source-image pixels `(x,y,w,h)`. Each row was opened exactly once.

| # | Exact observed file | Source / rectangle | SHA-256 |
| --- | --- | --- | --- |
| 1 | E/phy6-c5-s8-text-390-fig-196.png | Existing full figure, 358x561 | 3913ccfcf84f62c441358f334133f72247a283df1d0cf0aac68a3fc36751863f |
| 2 | E/phy6-c5-s8-exercises-390-fig-100.png | Existing full figure, 311x272 | bd7023b31fd3b2538b20a62ac88b07c1b119c8fa9ba97e0b23d4b6d1ca1cbb82 |
| 3 | E/phy6-c5-s8-exercises-390-fig-181.png | Existing full figure, 311x233 | b6816173cd3dc87505ea5dcef57a3b292cd058b119a496c554f506e429247476 |
| 4 | C/04-choices-desktop-top-x350-y0-w740-h1100.png | D; (350,0,740,1100), pixel-identical crop | e5d94c88b30423363fe7383e5a45179ceeaa1b65431b887743c1c9815d2ecaf4 |
| 5 | C/05-choices-mobile-radio-tables-x0-y1884p5-w390-h1250.png | M; (0,1884.5,390,1250), SIPS centered crop | 9f03486e44d99132c10471e2a0dcc39079a0424b210d8f47c1d039651177a9ce |
| 6 | C/06-choices-mobile-top-x0-y0-w390-h1250.png | M; (0,0,390,1250), exact integer crop | 949443527ce0e890696ec52df2720c5c0c6d49ab23e74bdbca48de115a85ce20 |
| 7 | C/07-choices-mobile-end-exact-x0-y3569-w390-h1450.png | M; (0,3569,390,1450), exact integer crop | 1f7a0c0460a04fe67968675b256698bab15a5fb6ceb50c9f3dcc641da93e47f3 |
| 8 | C/08-written-mobile-end-exact-x0-y1149-w390-h1000.png | W; (0,1149,390,1000), exact integer crop | fd9463dbfd04705ac02d73bc5c79c6ac6ffd28ddb7c5287bfdd5ac9d8a2e3740 |

| Crop source | Exact original file / dimensions | SHA-256 |
| --- | --- | --- |
| D | E/phy6-c5-s8-choices-1440.png, 1440x5400 | 30e395ff3e91dabab1c62dd26c84a9ce22b3fa96545f826d41748d4b30aac601 |
| M | E/phy6-c5-s8-choices-390.png, 390x5019 | 27783f6ce79fb330c5ed2a4a0d38a255d16685cc527a85d0e4f6593208a35e5d |
| W | E/phy6-c5-s8-exercises-390.png, 390x2149 | 2368e1caed3b3508bc77664f075864a7874bc2d25343a2f30c47df3032d6a79e |

Crop 5 was initially requested at `(0,0)` with SIPS, which instead centered it at fractional `y=1884.5`. Its filename above records the actual region, not the initial request. Pixel comparison with the adjacent-row half-pixel blend differs by at most 1/255 per channel. Crops 6-8 were then made with the existing Pillow runtime at exact integer bounds, without browser use, scaling, annotation or content repair. No image was reopened.

**Return to parent: DISPLAY PASS for this bounded single-course observation; no display repair required.** Parent retains responsibility for committing complete-course work and continuing the batch.
