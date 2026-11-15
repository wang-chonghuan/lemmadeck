# Fig71 Independent Review

Status: **PASS**, limited to the current scratch figure. Reviewer: **Sagan**, independent_agent, not the author. Date: 2026-11-15.

Repository: `/Users/yong/.codex/worktrees/0f12/lemmadeck`. All paths below are relative to this root. No promotion, source/template/spec/output edits, answer/choice reads, service calls or browser execution.

## Independent Inventory And Actual Viewing

Opened the original `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-71.png` with `view_image(detail="original")` before comparing the candidate. One large unlabelled circular body; three vertically DOWNWARD arrows sharing an origin inside that body and a single action line. The shortest F1 is the light inset arrow, F2 is intermediate and dark, R is broadest/longest with the lowest tip. Three independent labels sit to the right of their tips. No numerical force, unit, grid, scale, material or dimension is given.

Read the complete current SVG, FigureSpec, frozen context and full upper modern s23 prose plus all seven exercises. Actually opened `author-preview/width-theme-sheet.png` at original resolution: it contains the complete neutral/mixed/print images at native media widths 640 and 306, not viewport-width estimates. Inspected all six cases, the full circular boundary, shared origin, inset F1 head, F2 head, lowest R tip, labels and right/bottom edges. Individual case PNGs were also byte-hash checked against the bound media record; they were not separately reopened or rerendered.

## Substantive Findings

- Source fidelity: all three arrows remain common-origin, collinear and downward, nested on the same frame. The white/paper F1 is a negative-space arrow inside the darker shafts, not a missing arrow; its short downward head is visible in all three themes at both widths. F2 and R remain separately identifiable. No head-to-tail relocation or second body was added.
- Mathematics: in upward-positive drawing coordinates the origin is `[245,560]` and tips are `[245,410]`, `[245,310]`, `[245,160]`. Thus the signed displacements are -150, -250 and -400, with -150 + -250 = -400. Each semantic arrow has a `connects` assertion; the source point group is covered by displacements and collinearity. The rendered heads agree with these endpoints and directions.
- Drawing lengths 150/250/400 and small endpoint markers are declared modern regularization, not measured source forces, exact raster proportions, or separate source-given data. The source approximate proportions are not asserted as exact. No N values or arithmetic answer are visible.
- The assertion named `added-origin-inside-body` actually tests a circle-boundary coordinate, not containment of the origin. I did not use that name or its pass as proof. Actual containment is independently established by the identical body-center/common-origin coordinates and positive radius 210, and is visible in the SVG and complete preview. This naming limitation does not change the current physical relation.
- Typography: final SVG labels are real `F₁`, `F₂`, `R`, base font 40. At media width 306 the scale is 306/640, giving 19.125 px; at 640 it is 40 px. This agrees with the existing screen-transform evidence. No text touches the circle or another label. F1's repaired position is farther right but still level with its own short tip and unambiguous.
- Semantic CSS: visible objects use ink/muted/paper roles. The inset and both dark heads remain distinguishable in neutral, alternate-accent mixed and print appearances; no source cultural wording or decoration is present.
- Full-text compatibility/leakage: same-body, same-line, same-direction addition is the demonstrated relation. The complete authority also includes the opposite-force experiment, equal/opposite balance, explicit g approximation and initial-motion clarification. None is contradicted or replaced by this diagram. All seven prompts have empty figure_refs; no numerical exercise solution was imported or drawn. This is figure approval, not answer approval or whole-s23 approval.

No blocking mathematical, semantic, visual, cultural or leakage defect found.

## Retained Repair

The initial F1/circle label-collision FAIL remains in `failure-01-label-collision/`. Structured old/current comparison found exactly one spec change: `F1-label.at[0]`, 333 -> 470. All vector endpoints, body geometry, directions, other labels, authority and assertions are unchanged. The complete retained first render reports that collision; current render reports pass with no collisions. Sole repair budget 1/1 is consumed. No further repair was made or requested.

## Actual SHA-256 Bindings

These are full-byte local hashes independently calculated, not copied without verification.

| File | SHA-256 |
|---|---|
| Original fig-71.png | `4563d043efb7b571de83df3908803fafee1732fc890058e6ffac5dec47477058` |
| spec.json | `8cde74d0b4ef44af34acb5345be807c0a585f702bc3dc3ae3f1032acc067ce3a` |
| fig-71.svg | `56de290652b8aa4b104471be66bb5f8361a66c2ecf2afad05a72788f705e076a` |
| render.json | `cde6bfa749eaf09870f0f89e7da3d1f5402895c32276c6afe0e061ad9c0307a7` |
| context.json | `724c47a24c493ec41bc2139b4d3d4f8a7910e39c79d7e0f3bb7dbfbeda657911` |
| s23 lesson.template.json | `01b0274797df4655d37db3dd0e15179d7addb19e88ce5f58f9170a851e8e73ea` |
| s23 exercises.template.json | `2df5dd3ae194f06ccabd2471bd30fd3078fee93ebc2534a0b7dbf3c9f3674019` |
| author-preview/width-theme-sheet.png | `1cf2fb8f01fed4165af1b6a90a039381b64a71c971e0e4fd0307094486548050` |
| author-preview/media-checks.json | `4a3ce9530d1aadfae97004542ad605e950d01876abf6750e51269ff0073c32ac` |
| author-preview/neutral-306.png | `84c6ac42daf153f07b38168ddad34a1ba0d8261ca16614f836f9ff2b606b9990` |
| author-preview/neutral-640.png | `5d50508153bb9ba7162116d495fed770e836a7311e33ad521c53785e210ca804` |
| author-preview/mixed-306.png | `450a05490b5cfc514c60584c1aab37e3e343c48c6dc2e59d1d4935865dee64f9` |
| author-preview/mixed-640.png | `8a540a752da25deea0fab2e60f77ad5a299c81057e4d6ce0e3129b2c0208ce66` |
| author-preview/print-306.png | `fcde185f388a4eb264c7430d5118ef642bd35ccdda33ed6da234129505b8c55b` |
| author-preview/print-640.png | `70402def9a25be1300e4a1ee3e69b2e4f90f5c5e257c6d284b10df32fceaea54` |
| failure-01-label-collision/spec.json | `bd56b874c0ed803ff3e7208fc4df868dfcd1aef241cea28dc544f6697e4964a6` |
| failure-01-label-collision/render.json | `55468d4027fa127fd2f94fe6929946c5bfa109153e4baaf5b21ca26801d2d697` |

Both context and spec authoritativeText were structurally checked equal to all 22 current upper modern text entries, including seven prompts. Source/spec/output/media hashes and all six preview hashes match their records. Existing render PASS (11 objects, 3 labels) is mechanical evidence only; no rerender was performed. Formal `review.json` is recorded with the existing `record_review.py`, binding this report's hash in notes.

Reviewer runtime is Codex; exact deployed model, reasoning setting and token/cost totals are unknown. Reviewer image-service calls: 0; new browser sessions: 0. Existing author browser evidence describes isolated headless contexts only and does not claim tested desktop behavior.
