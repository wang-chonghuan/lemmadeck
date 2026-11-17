# B51 Fig-34 First Independent Semantic Review

Date: 2026-11-17. Book: 6p. Lesson: phy6-c3-s5. Edition: modern-us-neutral.

Semantic verdict: **PASS for the current figure substance only**. No substantive defect found in source fidelity, mathematical meaning, queried interval, visible labels, native-width readability, or cultural neutrality. This is not process-compliance approval, repair-budget approval, promotion approval, or a retention decision. The parent decides retention.

## Scope And Image Accounting

Read the image SKILL, quality gate, and FigureSpec contract. Read the complete approved modern lesson and exercises, including embedded source data, and both complete canonical raw-source JSON files. No answer, answer key, choice artifact, database, Git, app, dependency, promotion, or finalization operation was used.

The canonical source PNG was opened FIRST, before reading the candidate FigureSpec or inspecting candidate images. Its independent pixel inventory was recorded in this review session before comparison with candidate objects. Then exactly the two requested native neutral PNGs were opened once each, at their original sizes.

Image count: **3** in this task and this context: original, 306-neutral, 640-neutral. One batch; no crops, reopens, other screenshots, or SVG image opens. Limits: 3 <= 8 per batch and 3 <= 24 per context. No image payload is included in this report; parent image opens for this review: 0.

Existing validator, renderer, and native-preview PASS evidence is reused, with current hashes checked. No browser, new rendering, or additional native render gate was run. The required review recorder performs its own built-in validation; it is not a new render.

## Independent Original-Pixel Inventory

1. One shared speed-time coordinate frame, with a rightward horizontal time axis and upward vertical speed axis, each arrowheaded. Origin is marked 0. Original variable labels are v and t; the printed Chinese units mean metres per second and seconds.
2. Exactly seven time ticks, labeled 1, 2, 3, 4, 5, 6, 7, below the axis. Successive values are one second apart.
3. Exactly five positive speed ticks, labeled 2, 4, 6, 8, 10, left of the axis. Successive values are two metres per second apart.
4. One solid constant-speed line meeting the vertical axis at 10 and extending past time tick 7. The source has slight scan skew; the line is parallel to the scanned time axis, not evidence of acceleration.
5. The unmarked right endpoint is approximately t=7.6 s by visual extent. This is NOT a printed given, an exact measurement, or a question datum. There is no endpoint dot, endpoint label, or arrowhead on the speed line.
6. No second subfigure, lattice, plotted point, dashed line, shaded area, solution formula, computed distance, or answer annotation occurs in the source.

## Mapping And Semantic Comparison

- Frame inventory maps to `time-axis`, `speed-axis`, `time-arrow`, `speed-arrow`, `origin-label`, `time-unit-label`, and `speed-unit-label`; assertions cover the shared frame, perpendicular axes, connected arrow endpoints, and absence of plotted markers, grid, and shaded area.
- Time inventory maps to the seven literal `time-axis.ticks` coordinates and labels, with `time-unit-interval` and `time-full-tick-span`. Speed inventory maps to the five literal `speed-axis.ticks` coordinates and labels, with `speed-unit-interval` and `speed-full-tick-span`. Every tick was checked, not merely the endpoint assertions.
- Constant-line inventory maps to `speed-line`, from [0,10] to [7.6,10], solid and unmarked. `source-segment-endpoints`, `source-segment-horizontal`, `source-segment-height`, `source-reading-at-five`, `source-reading-at-seven`, and `exactly-one-speed-segment` cover its meaning. The endpoint extent is explicitly documented as approximate and remains undisplayed.
- Modern additions/regularization are straightened axes, equal tick spacing, deterministic typography and stroke widths, readable label spacing, semantic color roles, and unit-label conversion to `v (m/s)` and `t (s)`. These are not claimed as new source givens.
- Both inspected PNGs preserve the source reading of constant 10 m/s and make the complete 0-to-5-second interval readable. Exercise g2/6 still requires the learner to read the speed and apply the lesson relation; there is no extra answer text, evaluated expression, area shading, distance result, or answer-bearing construction. The line's position at the original 10 tick is source data, not an added answer annotation.
- Native sizes are 306 x 268 raster pixels (267.75 CSS-pixel height) and 640 x 560 pixels. All 15 labels, both arrowheads, all 12 positive ticks, origin, and the line are visible and unclipped, with no overlap. Reported minimum text sizes are 16.25625 px and 34 px, both >=16 px.
- SVG XML independently contains exactly the seven time labels, five speed labels, origin 0, and unit labels `t (s)` and `v (m/s)`, all at font size 34 before scaling. Its line joins the 10 tick and remains horizontal. Visible strokes and text use semantic CSS variables.
- Cultural verdict: PASS. The modern visible figure contains only Latin variables, SI units, and numerals; no Chinese/Cyrillic unit text, Soviet symbols, flags, costume, historical styling, or invented cultural wording leaks through. Chinese authoritative lesson text is context metadata, not visible figure labeling.
- The existing native report records PASS for neutral, accent, and print at both widths. Only the two neutral PNGs were visually opened. Its `arrowheads: 0` telemetry is not used as visual proof: both arrowheads are independently visible in both requested PNGs. No telemetry or other candidate file was changed.

## Frozen Text And Hash Checks

The full 10 modern prose blocks and all 8 modern exercise items were read. Read-only structured comparison confirms 47 verbatim bound strings, their identities/source references, and every individual UTF-8 SHA-256 in `source.authoritativeText` against the approved templates and `text-bindings.json`. This includes exercise groups, full exercise texts, individual lines, lesson identity strings, and figure labels. Embedded `source.data` equals each complete canonical raw-source JSON, every `source_text` equals its corresponding raw item, and both raw-source file hashes match the templates.

The fig-34 exercise full-text string SHA-256 is `e821e607f913db45eb284b9d7f689349f600bbce9871e7e0e9e218dcc0dceab8`; its two individual line hashes are `8f6e4eaa82762ac8ca0a87808b906bd760f90ac5219b875ad0b1af8d8f68940b` and `275075f3a676e2e9179c293cea922c0c744e016d5af48d20b309f2698a4f94a4`. No frozen text was changed.

Paths below are absolute; all hashes are SHA-256.

| Artifact | Exact Path | SHA-256 |
| --- | --- | --- |
| Original canonical 6p PNG | `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-34.png` | `9dcada7a001e806ebf91b3b4860be4bf8f0d07266bcce85f56073338d679e658` |
| Current FigureSpec | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig34/spec.json` | `dda2c4b9e26be5e0d98a68549fe8744b6940fdfd003466c3ab0036a033aa7502` |
| Current render report | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig34/fig-34.render.json` | `fc7220fabfe9db74e8a430b24c190a77076ddb9e716d20b455b5ab0fa8836580` |
| Current SVG | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig34/fig-34.svg` | `7a9c9963001dbbdc8dc05c0db7c20b79068394c1b8eb44700a15405f920626ff` |
| Inspected 306 neutral PNG | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig34/preview-306-neutral.png` | `64bb2126001e1424c2191874cbccb22d36a8fb37aa8d2771d3df90289a656b49` |
| Inspected 640 neutral PNG | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig34/preview-640-neutral.png` | `38eb2631e34932a82be288c95eccc3c60e12804b5d0d656d113c11ceae461a9e` |
| Existing native report | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig34/native-preview.json` | `ab3f4076f28b4aec12756e480f84e849e74ab22ac54b1c7946355617cf2ded84` |
| Existing draft validation PASS | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig34/calls/06-validate.stdout` | `96884ee099a00d31978aab8b9ba81178f497d3eee842f0038b6369c44b08f38c` |
| Frozen modern lesson | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-distancetime-b51/lessons/phy6-c3-s5/lesson.template.json` | `bc828629d4e55f090d923af8dddaeeaf94585cb7f14f78e0eda2a5778bdd1cae` |
| Frozen modern exercises | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-distancetime-b51/lessons/phy6-c3-s5/exercises.template.json` | `b3c2cd60f882a6df86567d37e96a78fc1f72dca3b3286a4cca6c42974a3b61c6` |
| Canonical raw lesson | `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s5/lesson.json` | `fbfe15649b33ce82c2c0327730e24dd20fa86c78ca0cd83e301771d4c6c53f8f` |
| Canonical raw exercises | `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s5/exercises.json` | `7f10b147ad619680bd9ff439e2034e51b73f4bcc7bd3c97c322c9c9b5a1d24f0` |
| Existing text bindings | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig34/text-bindings.json` | `1195898d4f59116b9ad87c5eabf03489e0ab7077cb326a4d702cbc0e943bfc9f` |

## Reported Execution Deviation Remains Disclosed

The author disclosed two operations: (1) a failed read-only XML diagnostic, followed by a corrected read-only diagnostic after `float('1px')` parsing failed; (2) the sole FigureSpec repair, changing time-tick label gaps from 31 to 41. Existing diagnostic logs confirm exit 1 with that ValueError and then exit 0. Independent JSON comparison against FIRSTFAIL finds exactly seven field differences, all `/objects/0/ticks/<0..6>/labelPlacement/gap`, from 31 to 41; there are no other FigureSpec differences.

This records the disclosed facts only. **The execution deviation is not waived, reclassified, or approved; process compliance and repair-budget compliance are not adjudicated.** A semantic PASS does not supersede the original author note/disclosure or erase FIRSTFAIL. The parent alone decides retention. No further candidate changes are requested or made.

| Retained Evidence | Exact Path | SHA-256 |
| --- | --- | --- |
| Failed XML diagnostic log | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig34/calls/04-diagnose-render.json` | `40738f17a740c9397cde2c23f9f55293bfa072914370ad16c18a9b4791b7ea64` |
| Failed XML diagnostic stderr | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig34/calls/04-diagnose-render.stderr` | `98abedfcb4a5bdcbaaab2b6052127bb0e2a0d8c0d15c13643c274d610d0c1836` |
| Corrected read-only diagnostic log | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig34/calls/04-diagnose-repair.json` | `ef6a3b9bfb36ac5f2a39acdb7fd0c10e5d76fdc21191112dcbd226a1984cfe57` |
| FIRSTFAIL FigureSpec | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig34/FIRSTFAIL/spec.json` | `aa63609d490c3e83842e86e1ac663ebe34ddac6fb2b6d86d53e7e6292fe33901` |
| FIRSTFAIL render report | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig34/FIRSTFAIL/fig-34.render.json` | `93440ad237297c4aba663ec03ef64b19e57fb9d3a15eedc6222ee083518e9369` |
| FIRSTFAIL SVG | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig34/FIRSTFAIL/fig-34.svg` | `67a17f490c2c715a90ff4f561d99084790b32586db0f2a52eb3c7dcb2e00d29e` |

## Ownership And Preservation

Only these two review files are owned and written:

- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig34/independent-review-b51.md`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig34/review.json`

The second is produced by exactly one invocation of the existing `record_review.py`, using SharedP with `-B` and `PYTHONDONTWRITEBYTECODE=1`, `--spec`, `--render`, `--output`, `--status pass`, and notes explicitly recording independent semantic scope and the reported execution deviation.

Pre-write preservation snapshot: all 92 pre-existing files below the candidate directory hash to `83927f71a9b4aaad489c2e7b80d8dd04849f16bef44d1c2a602b6f63052a7e62`; the 32 files below FIRSTFAIL hash to `669544bc8a6bba7e6239eb39b241de0efe6c71a189865c52be245f4455fc5cd4`. Each tree digest is SHA-256 of the JSON serialization of sorted `[repo-relative-path, file-sha256]` pairs, traversed in sorted depth-first directory order; the whole-candidate digest excludes the two owned review outputs. These snapshots support a post-write preservation check without Git or modifying shared evidence.
