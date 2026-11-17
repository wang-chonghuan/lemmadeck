# n15/n16 Choice Offline Independent Display Review

STEMROBIN-184. Date: 2026-11-16.
Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

Scope: screenshot-only visual display inspection of the four full PNGs listed
below. No choice draft, author key, seed, solution, semantic review, source
figure, HTML, renderer, or application code was read. The two existing
`choices-report.json` files were read only for snapshot and display metadata.
No browser or checker was rerun.

## Disposition

- **n15: QUALIFIED DISPLAY PASS for visible text/controls**, with two
  nonblocking P3 layout findings below. **Full mobile figure visibility remains
  UNKNOWN** because the supplied mobile screenshot shows only its right-end
  horizontal scroll position.
- **n16: DISPLAY PASS WITH NONBLOCKING P3 PUNCTUATION WRAP**. No figure is visible
  in either supplied n16 screenshot; no figure completeness is certified.
- No blocking clipping, overlapping controls, unreadable option text, missing
  screenshot bottom, or whole-page right-edge cutoff was observed within the
  inspected raster bounds.
- These dispositions apply only to the bound snapshots. In particular the
  n15 record describes the original choice-display snapshot supplied before
  its forthcoming semantic repair, not future repaired views. No choice set
  receives semantic approval or completion from this report.

## Display Findings

### P3: n15 Desktop Q7 Option D Exceeds the Main Text Column

In the 1440 px n15 screenshot, the long single-line option D in question 7
extends visibly to the right of the section-rule/main-column boundary used by
the preceding text and other options. Its text remains inside the full
1440 px raster, is readable to the end, and does not collide with another
item. This is a column-containment inconsistency, not observed page clipping.

The existing command report measures the option container, not the visual
rightmost glyph of this line; its mechanical PASS does not negate this
screenshot observation. No new DOM or glyph measurement was performed.

### P3: Mobile Final Punctuation Falls Onto a Separate Line

The 390 px n15 screenshot shows the final full stop of question 7 options
B and F alone on an additional line below their preceding mathematical label.
The 390 px n16 screenshot shows the same presentation in question 6 option A,
after the displayed segment notation.

The punctuation and preceding text are present, legible, and do not overlap
the next option. These are nonblocking wrap/polish findings, not semantic
errors or omitted answer content. No renderer diagnosis or repair was attempted.

## Observed Surfaces

| Surface | Screenshot-only observation |
| --- | --- |
| n15 desktop | Seven question sections are visible, with radio controls for the first two and square checkboxes for the remaining sections. Headings, prompts, option letters, formulas and controls are readable. The single question-2 figure is fully framed at this width, with visible labels separated from surrounding prose/options. The final question and its final F option are visible through their ends, followed by bottom whitespace. The Q7-D column overrun is recorded above. |
| n15 mobile | All seven sections and their options are visible from the wrapped title through final option F and bottom whitespace. Long stems/options wrap without colliding with controls or later sections. The title's last character moves to a second line without clipping. The question-2 figure's right-hand portion and right/lower outline are visible, but its left part is outside this captured scroll position. The Q7-B/F punctuation wraps are recorded above. |
| n16 desktop | Six sections are visible. The two long paired-option lists both reach their N entries, and the final section reaches H with complete visible text and bottom whitespace. Radio/checkbox shapes, option letters, subscripts, intervals and direction symbols render without visible raw LaTeX or error banners. No figure is visible. No column/page-edge clipping or control collision was observed. |
| n16 mobile | All six sections are visible through final H and bottom whitespace. Long first/fourth/fifth-section options and the final-section options wrap within the visible page. Both paired lists retain their visible A-N entries without overlap. Formulas, brackets and subscripts remain readable at the displayed size. No figure is visible. The Q6-A punctuation wrap is recorded above. |

This records rendered presence and layout only. It does not assess mathematical
truth, correct choices, distractors, task fidelity, learner prerequisites,
answer leakage, or whether any absent figure should exist.

## Bounds and Existing Command Evidence

All four images were opened with `detail: original`, once each. Their full
raster extents, including the right edge and final bottom content/whitespace,
were available in the returned image and inspected. No whole-image height
truncation prevented the bottom inspection. No crop, resize, repeat open,
additional screenshot, source image, or browser was used.

The n15 mobile figure is the specific uninspectable bound: the existing report
records 358 px of visible scroll width for 640 px media at endpoint 282.
Together with the visible right-hand figure portion, this supports an
end-position capture. The leftmost 282 px of that media are outside this
screenshot. They were not independently inspected at mobile scale. The
desktop full figure is not a substitute for that missing mobile start view.
Scroll interaction, intermediate positions and discoverability remain
unverified; an existing `reachable: true` declaration is not a new interaction.

Both existing reports declare mechanical `status: pass` and report document
widths equal to 1440/390. The n15 report lists 36 option containers, six
28 px figure-label measurements, and the scroll geometry above. The n16 report
lists 48 option containers and no figure-label/scroll entries. These are
preexisting command observations, not new measurements by this review.

Reported HTML SHA-256 values, recorded as report provenance only:

- n15: `05901d16504a0e1e5f441be0e6bd7aaf11497f598d21d043b61f4d7c3371501e`
- n16: `7d8779ad0a0321a7e87a89be3936bde4322e54070d6118e452817d53fe8b9dff`

The HTML files themselves were not opened or independently hash-checked.
Static screenshots do not establish headed/OS behavior, touch scrolling,
selection/submission, judging, persistence, or product integration.

## Exact Image Ledger

Context started image-free: **0 prior opens**. One four-image batch; each
specified full screenshot opened exactly once. New and total context opens:
**4/8 batch, 4/24 context**.

| Open Order | Absolute File Path | Dimensions | Raw SHA-256 |
| --- | --- | --- | --- |
| 1 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n15/choices-1440.png` | 1440 x 3610 | `8b55f4da8332e8919d1712d57a87d25d9d843f00535306de53fae65c37de4b72` |
| 2 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n15/choices-390.png` | 390 x 5052 | `a805e965c01933f9f157c1256aeb48ff1d4149bff2d76101c2a9090d68ecd990` |
| 3 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n16/choices-1440.png` | 1440 x 3986 | `829b7f8fa78428b3bde3ba0b6b2bdecaab9b5acb4e00e91fce1d4acb0f12f5c5` |
| 4 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n16/choices-390.png` | 390 x 5270 | `76f8731eaafeb561365667fb39e35a2c3a947a8834f235968d0827b53f52a4e4` |

## Report Metadata Bindings

| Absolute File Path | Raw SHA-256 |
| --- | --- |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n15/choices-report.json` | `f854cc282d9d295f267f41486f57793c925c9593e61099faa1db312ff4558440` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n16/choices-report.json` | `616d554c41eea696017da03e6d1744326848d34564dd2e883df132b9b719ba93` |

All six raw file hashes were checked before inspection and remained unchanged
after the four image opens. Each screenshot hash also matches its existing
report's declared screenshot hash. No current or repaired draft was consulted.

## Scope Close

Only this Markdown sidecar was written. No existing screenshot, report, draft,
template, asset, helper, renderer, application, dependency, parent plan, usage,
database, environment file, Git/history, publisher, or another chat was changed
or operated. No semantic review or content gate was performed. No image payload
is returned to the parent; this sidecar and its externally supplied raw hash
are the textual result.
