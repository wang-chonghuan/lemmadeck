# n15 Independent Final-Offline DISPLAY Review

- Ticket: STEMROBIN-184.
- Lesson: `geo910-c1-s2-n15`, edition `modern-us-neutral`.
- Review date: 2026-11-16.
- Result: **FAIL (DISPLAY only)**. One newly observed exercise-number formatting defect.
- Scope: one fresh independent visual inspection of existing final-offline evidence. Exactly eight images opened once each: four full-page screenshots at 1440/390, then four mobile figure-scroll start/end screenshots. No crops, reopens, additional images or browser runs.

## New Finding

**[P2] Exercise 159 splits and duplicates the source-prefix punctuation.**

In `exercises-1440.png`, the blue number reads `159.°`, followed by a separate leading period in the black question body. In `exercises-390.png`, the blue degree marker wraps onto its own line below `159.`, while the black body still begins with the leftover period.

The finalized exercise text begins `159°. 任意一个...`. Its source exercise marker should render once as one intact `159°.` prefix, with no additional body-leading period and no detached marker. This is not a duplicated full numeric prefix: it is misplaced/extra prefix punctuation and a mobile numbering-layout defect. These observations come from n15's own screenshots, not an inference from the parent's n16 finding. No renderer code was inspected to establish the cause.

The parent owns the renderer fix and any affected-display follow-up. No repair, regeneration, source/seed mathematics change or second visual pass was performed here.

## Other Observations

| Surface | Observation |
| --- | --- |
| Full lesson, desktop/mobile | All displayed prose is legible. The two concept separators occur after the center-symmetry proof/figure and after the angle-preservation statement. Definition text, the concluding congruence properties and the five-exercise link remain visible. No obvious text overlap, collision or page-edge cutoff. |
| Rendered notation | Subscripts in `Z_0`, `M_1`, `N_1`, `Phi_1` and `Phi_2`, distance bars/equality, `F(A)F(B)`, Greek letters and congruence symbols render visibly, without exposed dollar delimiters or raw LaTeX. Mobile line wrapping does not clip these expressions. Exercise 160's non-membership and parallel notation is rendered. The source degree marker on 159 remains visible but its prefix placement fails as described above. |
| Exercise 159 | Question body is otherwise readable and complete at both widths; numbering defect above. |
| Exercise 160 | Stem and both subquestions are readable in natural order at both widths. Figure 61 is displayed once inside this exercise, after the prompt/subquestions; its visible labels do not collide with surrounding prose. |
| Exercise 161 | All three subquestions are visible, each on its own line, with one top-level `161.` number. |
| Exercise 162 | Both subquestions are visible; longer mobile lines wrap inside the body column, with one top-level `162.` number. |
| Exercise 163 | Definition and all seven subquestions are visible through the final item at both widths. Mobile wrapped continuations do not overlap adjacent items; one top-level `163.` number. |
| Figure references | The current prose references figure 60; it appears once in the text view with its caption. Only exercise 160 references figure 61; it appears once in the exercises view. The other four exercises have no figure references. Neither reference is missing or duplicated in the viewed evidence. |
| Figure 60, mobile endpoints | Start shows `M_1`, `N_1`, `O`, `alpha`; end shows `N`, `M`, `O`, `alpha`. The two views jointly show all six labels and the figure's left/right boundaries. Labels remain legible; clipping at a scroll-window edge is intentional rather than permanent loss. |
| Figure 61, mobile endpoints | Start shows `M`, `M_1`, `alpha`; end shows `N`, `N_1`, `ell`. All six labels are visible across the endpoints, without evident label/text collisions or vertical cutoff. |

No other new DISPLAY defect was observed within the inspected evidence. Source fidelity and current-figure mathematical reviews were already PASS and were not repeated or independently recertified here.

## Existing Command Evidence And Limits

The supplied `report.json` records a PASS from isolated headless Chromium at `2026-11-16T16:04:49.589Z`. It reports 14 prose rows, five exercises, zero first-line indentation, two prose separators, no remote resources, and document widths equal to the 1440/390 viewports. Both rendered figures are 640 px wide with all six labels reported as 28 px and `fits: true`.

Mobile text scrolling reports `clientWidth=358`, `scrollWidth=640`, `actualScrollLeft=maxScrollLeft=282`. Mobile exercise scrolling reports `clientWidth=310`, `scrollWidth=640`, `actualScrollLeft=maxScrollLeft=330`. Desktop exercise media has a small internal overflow (`627` versus `640` px), with the existing report recording its 13 px endpoint reached; desktop endpoint images were not opened.

The report's mechanical PASS does not override the newly observed visual numbering failure. Current offline HTML SHA-256 values and all eight inspected screenshot hashes match the supplied report values.

These are static offline screenshots plus pre-existing headless command results, not a new browser interaction. They do not establish headed/OS behavior, touch-scroll discoverability, intermediate scroll positions, product UI, paging, quiz judging or persistence. Figure 61's two 310 px endpoint screenshots leave a 20 px middle strip of its 640 px canvas unsampled by those endpoint images; all its labels are nevertheless visible in the inspected start/end views and the desktop full-page image. No additional image or browser run was used to close that limit.

## Hash-Bound Inputs

All SHA-256 hashes below were read from the existing local files during this review.

| File | SHA-256 |
| --- | --- |
| [Final lesson JSON](/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s2-n15/lesson.json) | `8197e28ea1b525c867ff017fee112d67fbb2df8328468bdc9b4703f3d78f7b28` |
| [Final exercises JSON](/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s2-n15/exercises.json) | `93d7e594c7f57358d73b839e6b7523741b64a52b9e6b5a4e7fc0702cb3afa9cf` |
| [Final figures manifest](/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s2-n15/figures.json) | `97333f7d44e134478e9e041e184e0610490d538abf4b801ad0711985309f80e4` |
| [Existing offline report](/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n15/report.json) | `9b9214660f37430034bc388679a6f9db918789b90231740d9c01a3805ea17857` |
| [Offline text HTML](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/geo910-c1-s2-n15/text.html) | `c97b81039ab4ecc362a43cd8d18f4d9357a3a309e7807c09db8d728936331a3e` |
| [Offline exercises HTML](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/geo910-c1-s2-n15/exercises.html) | `5a1afa3fa5b1ec09e8616134f6e61729478f6a2727446c3c5cd88efdba31d493` |

## Exact Image Ledger

| Open order | Existing screenshot | SHA-256 |
| --- | --- | --- |
| 1 | [text-1440.png](/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n15/text-1440.png) | `f97f2db9a85d245ac64a1fb8dd056fe313498454c82656e7869d62a93a5a2585` |
| 2 | [exercises-1440.png](/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n15/exercises-1440.png) | `a6c2bab107908392a4651633bef8f0ed43eaea2f50586b548fbaf20c6b71c966` |
| 3 | [text-390.png](/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n15/text-390.png) | `38e6b59ed4521012e22180f229290884d8c84aaf211685aadc95cdc0950ccdaf` |
| 4 | [exercises-390.png](/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n15/exercises-390.png) | `5d655ff144b425d29f97cf4f0a1852bec09006cb48a98d2ef3b0cb7aeacff9e2` |
| 5 | [text-390-scroll-0-start.png](/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n15/text-390-scroll-0-start.png) | `5d7507827d32d97a6aa737dfa699255be0c14d2a24b10efaf07cf25ae333c89a` |
| 6 | [text-390-scroll-0-end.png](/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n15/text-390-scroll-0-end.png) | `4d648bea746d50558075dd4fa1a295ef94b2995e7e1685fbe266839dce40c6c6` |
| 7 | [exercises-390-scroll-0-start.png](/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n15/exercises-390-scroll-0-start.png) | `7a95b5e851542b41e09916103d59012a2c3f3c5e810620f0d966e10a651ebd44` |
| 8 | [exercises-390-scroll-0-end.png](/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n15/exercises-390-scroll-0-end.png) | `eb645b3d7a0a11feb5c8829760db0eafa0ee026b617e71bcce2bab038e0dffbc` |

## Scope Close

Only this Markdown review was written. No choice drafts, choice answers, author keys, solution precursors, source pipeline, database, Git, app/dependency files or promotion were inspected or operated. The finalized lesson/exercise files' embedded provenance was not used to conduct another source-fidelity review.

Available for a separately authorized learner-first choice review; no choice inspection has started.
