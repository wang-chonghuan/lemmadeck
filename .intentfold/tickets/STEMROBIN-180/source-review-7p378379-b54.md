# Batch54 FIRST Independent SOURCE Review: 7p 378/379

Verdict: **PASS_LOCAL_SOURCE_ONLY**. No source text, flag, emphasis, mathematics,
task, caption, figure-object or crop-boundary defect found in these two pages.
This is not upstream source approval, full-course approval or promotion approval.
Candidate and author files were not edited.

Owned scratch:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-7p378379-b54/`.
Only that directory and this ticket report were written; others' work preserved.

## Independent Comparison

Opened physical 378 and 379 original PNGs individually with `detail=original`
before reading candidate/final text or the author report/inventory. Mapping and
ledger were read beforehand for routing, not treated as semantic evidence.
Original-first observations were recorded separately before candidate comparison.
Then opened both final PNG crops. Total image opens **4**, batch/context **4/4**,
limits **8/24**, reopens **0**, parent image payload **0**.

Physical 378 = printed 367; physical 379 = printed 368. All **21 blocks** compared
against originals, frozen candidates, final Markdown and final page JSON.

| Source Ref | Final MD Lines | Independent Result |
| --- | --- | --- |
| p0378#1 | 54-57 | Three source lines; bold 保险器 retained, not underdots |
| p0378#2 | 59-62 | Three complete source lines, no continuation flag needed |
| p0378#3 | 64-67 | Three lines; component labels 1/2/3/4 and 图306 unchanged |
| p0378#4 | 69-73 | Four lines; 5安培 and 10安培 retained, no math correction |
| p0378#5 | 75-76 | One line; bold 熔断式保险器 retained, not underdots |
| p0378#6 | 78-80 | Two lines; 图307 remains a prose reference |
| p0378#7 | 82-83 | Whole 图307 drawing, final source box matches audit |
| p0378#8 | 85-86 | Both views of 图308 kept together, final source box matches |
| p0378#9 | 88-89 | Separate 图307 caption, outside drawing |
| p0378#10 | 91-92 | Separate 图308 caption; true same row with previous caption |
| p0378#11 | 94-96 | Two-line open prose ends in 玻璃管; 图308 reference retained |
| p0378#12 | 98-99 | Dotted footer 367 retained |
| p0379#1 | 33-34 | One-line cont closes p0378#11; verified from both originals |
| p0379#2 | 36-37 | Bold 问题 heading, not underdot emphasis |
| p0379#3 | 39-40 | Printed task (1), one complete line and question mark |
| p0379#4 | 42-44 | Printed task (2), two complete lines and question mark |
| p0379#5 | 46-47 | Printed task (3), one complete line and question mark |
| p0379#6 | 49-51 | Printed task (4), two complete lines and question mark |
| p0379#7 | 53-54 | Printed task (5), one complete line and question mark |
| p0379#8 | 56-57 | Printed task (6), one complete line and question mark |
| p0379#9 | 59-60 | Dotted footer 368 retained; otherwise blank lower page |

Line sums: 378 has 18 prose lines + one shared caption row + footer = **20**;
379 has one continuation line + heading + eight task lines + footer = **11**.
Only p0378#11 is open, p0379#1 cont and p0378#10 samerow. All other flags match.
Three bold spans total, no intentional underdot runs; nine inline numeric math
spans on 378, no display equations, no math spans on 379, no boxes/tables.
Empty notes/errata do not hide a detected uncertainty or confirmed source error.

## All Final Crops

**图307**, p0378#7: source box `[316,1357,209,415]`. PNG/SVG canvas **233x439**
includes 12px white padding per side. One mounting board, four corner fasteners
with their differing appearances, two adjacent tall holders with circular front
caps and slot details, upper terminals, paired winding leads/dark round feature,
and two separate lower leads/loops all remain. No printed internal labels,
values, arrows or grid; caption is outside the crop.

**图308**, p0378#8: source box `[866,1502,322,192]`. PNG/SVG canvas **346x216**
includes the same padding. Upper horizontal glass cartridge retains both metal
caps and internal longitudinal wire; lower support retains two shaped clips,
feet/details, base thickness and separate outward leads. The cartridge remains
separated above the support. Both source views share one figure without added
subfigure lettering. Caption is outside the crop.

The author's `crop_size` entries match the **unpadded source rectangles**, not
the larger encoded PNG dimensions; these distinct sizes are explicitly frozen
in the reviewer record. No candidate change or new crop was made.

## Numbering And Boundaries

Manifest independently confirms `7p -> 6-7p`, `exerciseNumbering: lesson-group`.
TOC independently confirms structural ID `phy7-c2-s3-n149`, printed number 149,
start page 366. This local review saw no ancestor or lesson heading. Incoming
377 was PURE structure only; its identities are not re-verified upstream facts.
Local 问题 tasks **(1)-(6)** are complete and sequential in this group. The
whole-lesson numbering/history is not approved.

Local prose closure p0378#11 -> p0379#1 is verified, not whole-course completion.
The local 图306 reference is accurate, but its upstream pixels and component
placements were not inspected. No upstream body, pixel or HOLD payload read.
TOC's next identity `phy7-c2-s4-n150`, printed start 369, was observed as metadata
only; it does not prove the next page's content or this lesson's completion.
PURE `outgoing-structure.json` targets 380/381, contains identities/refs/flags
only, leaves completeness and next first-body cont unknown, and carries no prose,
formula, image or failed-report payload. Neither next page was opened.

## Receipt Reuse And Full Binding

No pipeline replay. Existing finalize378 **20/20 actual exit 0**, finalize379
**11/11 actual exit 0**, vectorize378 **2/2 actual exit 0**, mismatches **0.005%**
(307) / **0.016%** (308). One original attempt each, repair debits **0/0**.
Vectorize379 was not run by the author because this page has no figures.

Verified ledger SHA-256 equals the user-supplied value:
`33a3826ac0869d94ae9cfd5b9578cb6cf04bcd1aa382a2ff7caf8f4a757cb179`.
All **51** ledger paths pass current byte-length/SHA checks; all **17** frozen
static paths pass hash/length/resolved-path checks. All three before/after static
lists match frozen inputs, all after-snapshot files match current outputs, and
monotonic ordering passes. Both finalize before snapshots match frozen
candidates; both work originals/layouts match frozen counterparts.

Full paths/hashes, argv, UTC/wall/monotonic stamps, stdout/stderr, runtime/source
bindings and graph edges are retained in the unchanged hash-bound author
`frozen-hash-ledger.json`, `frozen/inputs.json`, and `commands/` evidence.
The reviewer `review.json` binds that entire manifest, not a selected subset,
and adds independent block/crop coverage, image sequence and explicit limits.

| File Relative To Author Root | SHA-256 |
| --- | --- |
| frozen/work-inputs/0378/page.png | b951e6138b88af90005cf470e30e6d04c26595d2c8d12f02ab11e13dab829913 |
| frozen/work-inputs/0379/page.png | 3bdead7961a4b6350cc0dad519800c9802106765ee96b0673a8f6fe502ffea36 |
| frozen/candidates/0378/page.md | ba043df751ff48590e7ea9730669d6683b896454c7c9ecbd027f8056fd8c955b |
| frozen/candidates/0379/page.md | 18be26f0ecc81e307902741afbbcf3127f593dae59ddf5d6a896a376c7e11879 |
| artifacts/7p/pages/0378/page.md | 61db25d4b2435bb48370bd8a9d22c6b17777ddf1a1ce04d4ebab1125e55be887 |
| artifacts/7p/pages/0379/page.md | 7202a50b00feb0549ad7f324f52e61eaebc205662e633f588cc87312c6a4ad3c |
| artifacts/7p/pages/0378/page.json | 90cb13b20686d4fd99760d14156ea0f4bcf581286c024af3e94265c6cf00634d |
| artifacts/7p/pages/0379/page.json | 3fbf65aad5d442ca8e9f9ae561b6853d66df2bc81aa8eba21857b03e74145494 |
| artifacts/7p/pages/0378/audit.json | 8c528ff77ff6406a967a38c2a645027f49e380ab60dcc7f1235de037a0426f44 |
| artifacts/7p/pages/0379/audit.json | efd7429ce3f400a0d58aa99892ab7bcb03827f6fcdfd054d54053355d08d591e |
| work/7p/pages/0378/figures/fig-307.png | fd30d58353107d77cc1b39761d820b5c338606367cfcf6f602769e804b14218f |
| work/7p/pages/0378/figures/fig-307.svg | 3dfbc4288150a5f7b954a6cacae152d4a2aaa242d65bc889be999b8f7015643d |
| work/7p/pages/0378/figures/fig-308.png | ceaa71734aec50ea8cf19008718672f63c96fc7a38142d0600a6d9593f7fbb5d |
| work/7p/pages/0378/figures/fig-308.svg | 00d3487c9aed9d7a571a2516a5cc09f4066ffa69b723f3df5d11f17733aea0a7 |

## Frozen Limits And STOP

PDF/PNG association is reused prepared evidence with current source hashes, not
a new PDF render. SVG fidelity reuses current hash-bound receipts, not a new
rasterization. Static binding covers the 17 declared paths, not every installed
dependency. One read-only inline Node probe had a traversal TypeError; the
corrected traversal passed all three graph checks without modifying evidence.

No repairs, extraction, finalize, vectorize, assembly, promotion, modern work,
answers, choices, Git, backend, DB, app, dependency changes, global tests or new
pipeline. Own inflight **0**. Textual local verdict only; STOP.
