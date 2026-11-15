# fig-73 Independent Review

Reviewer: Sagan / independent_agent. Date: 2026-11-15. Figure author: main agent, not this reviewer.

**Decision: PASS for the inspected scratch snapshot.** No substantive mathematical, source-fidelity, visual, cultural, or answer-leakage defect found. This is not promotion, lesson-finalize, answer approval, or approval of figs70–72.

## Scope And Actual Evidence

Worktree: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

Read the current `ld-s10y-image/SKILL.md` and `references/quality-gate.md`. First actually opened the original source PNG at original resolution, independently inventoried it, then read the complete current s23 lesson/exercises templates, spec, render report and complete final SVG. Finally actually opened the two complete supplied browser screenshots with `view_image(detail="original")`:

- `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-73.png` — 244×384.
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-73/browser-preview-306.png` — 306×536, neutral.
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-73/browser-preview-accent-400.png` — 400×700, accent.

These are full images, including the upper F₁ tip/label and lowest F₂ tip/label, not cropped label samples. The complete SVG was read as deterministic geometry; its visible composition was checked through both complete previews. No browser was launched, no screenshots were regenerated, and unchanged additional previews were not reopened merely to repeat the same observation.

## Independent Original-Pixel Inventory

The original is one unlabelled, approximately circular outlined body. It has no apparatus, grid, calibration marks, printed newton values, caption inside the crop, or scene/cultural detail.

Three arrows share an interior start near the body's center on one vertical action line:

1. F₁ points upward, crossing the upper circular boundary and terminating outside it. Its label is to the upper right.
2. F₂ points downward, is visibly longer than F₁, and terminates near the bottom of the crop. Its label is to the lower right.
3. R is a thicker downward arrow from the same interior start. Its tip is below the circular body but above the F₂ tip; the label R is to its right.

The thin F₂ shaft overlaps the thicker R shaft; this is one shared action line, not two displaced lines or sequential tip-to-tail forces. The source proportions are approximately 1:2:1 for F₁:F₂:R, not a printed exact measurement. Tiny irregularities in the original strokes are not numbered ticks or source data.

Mapping after this independent observation:

| Source requirement | Current object(s) | Relevant assertion(s) / visual confirmation |
| --- | --- | --- |
| One circular body, common interior start | `body`, `common-origin` | `one-body`, `origin-at-body-center`; circle and dot visibly coincide at the center |
| Upward F₁ and independent label | `F1-arrow`, `F1-label` | `F1-connected`, `F1-up`; complete upward tip and real subscript visible |
| Longer downward F₂ and independent label | `F2-arrow`, `F2-label` | `F2-connected`, `F2-down`, `component-action-line`; lower thin shaft/tip remains visible beyond R |
| Downward R, shorter than F₂, common start | `R-arrow`, `R-label` | `R-connected`, `R-down`, `resultant-action-line`, `three-force-arrows`; thick R tip distinct from F₂ tip |

No original object or label is missing. The modern dot, stroke weights, semantic color, precise circular outline and regularized arrow lengths are presentation additions, not newly discovered source facts.

## Authoritative Text And Mathematics

Read the entire upper modern fields of:

- `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s23/lesson.template.json` — 18 prose blocks, including figures/captions.
- `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s23/exercises.template.json` — seven written prompts: four questions and three exercise17 prompts, not four total prompts.

The spec's 22 `source.authoritativeText` entries exactly equal the current title, every nonempty upper modern prose/caption text, and all seven current prompt texts in order. This was checked by structured JSON comparison, not by treating embedded `source.data` as current modern wording.

The full text supplies the relevant conditions: same body, same line, opposite directions; the resultant is along the larger component and its magnitude is the difference. It separately discusses same-direction addition, the 5N/2N experiment, equal-opposite zero resultant, and rest or uniform straight-line motion. Fig73 correctly illustrates the unequal-opposite case, not the equal-opposite case.

In the spec's upward-positive drawing coordinates:

- Common origin: `(200,460)`.
- F₁ endpoint `(200,660)`: displacement `(0,+200)`.
- F₂ endpoint `(200,60)`: displacement `(0,−400)`.
- R endpoint `(200,260)`: displacement `(0,−200)`.

Thus the signed vector sum is `+200 + (−400) = −200`; the downward resultant magnitude is `400−200=200`. The connecting, displacement, collinearity and equal-distance assertions jointly describe this geometry. In the actual SVG, all three visible shafts start at screen `(200,240)`; arrowhead transforms account for the shaft ends stopping short of the final tips. Counting shaft length alone would incorrectly ignore the thicker R arrowhead.

These are **drawing units only**. The description explicitly discloses exact 200/400/200 regularization of approximate source proportions. No force values, unit, numeric scale or calibration appear in the visible figure. In particular it does not turn the nearby 5N/2N/3N experiment into fig73 values, and does not claim the source specified F₂=2F₁ exactly.

Modern F₁/R tips extend farther beyond the circular boundary than in the raster. The body radius is not a force scale or given measurement; this change does not alter the source common origin, action line, ordering of tips, directions or component/resultant distinction. It is schematic geometry, not a pixel-exact facsimile or a physical dimensional claim.

R represents the equivalent resultant of F₁ and F₂, not a third additional independent applied force. Its distinct weight/color and separate label agree with the prose's component/resultant distinction. A downward resultant does not label the body's current velocity or claim it must already be moving downward.

## Full Visual, Text And Theme Checks

At actual306 neutral and actual400 accent widths:

- The complete circle is round, unbroken and not clipped. Its paper fill does not hide the arrows, which are drawn above it.
- All shafts share the central dot; no visual offset creates separate application points.
- F₁ is upward; F₂ is longer and downward; R is downward with an independently visible tip above the F₂ tip.
- The intentional overlapping R/F₂ shafts preserve the action line. The thin lower F₂ shaft is visible after the R tip, in both themes.
- F₁, R and F₂ each have a separate readable label near the correct tip. Real Unicode subscripts appear, not literal underscores.
- No label collides with a shaft, arrowhead, circle, other label or canvas edge. The bottom F₂ label and tip are fully visible.
- SVG label `font-size=30` scales to22.95px at306 and30px at400, matching the supplied display checks and exceeding the16px effective-font requirement. Subscript glyphs are naturally smaller than the F glyph; this statement is about effective label font size, not a fabricated16px ink-height measurement for every glyph.
- All visible strokes/fills/text use semantic `--ld-figure-ink`, `--ld-figure-accent` and `--ld-figure-paper` variables. R remains distinguishable by stroke weight in the neutral black-on-white image, so meaning does not depend on the accent hue.
- The accent image preserves contrast and geometry. Neutral black-on-white also demonstrates monochrome legibility; no separate physical-print or alternate print screenshot was generated or claimed.
- Hidden JSXGraph helper elements with default colors are `display="none"` / hidden, not visible cultural or theme content.

There are no persons, Soviet symbols, Cyrillic/Chinese visible labels, flags, historical identities, fictional cultural wording, numerical answers or invented unit labels. Mathematical F₁/F₂/R labels are appropriate.

All seven current exercises have empty `figure_refs`. This is the source-bound explanatory prose figure, already showing R in the original, not a new answer diagram for a written numerical task. It does not supply the exercise17 numerical results or the requested examples/experimental descriptions. No answer keys, choices or author solution files were read.

## Current Render Gate And History

The existing final render reports `status:pass`, eight objects, three labels, no collisions, and passing306/400 display checks. Its source/spec/output binding was independently checked against actual bytes. The `record_review.py` call for this decision performs the existing rendered-stage spec/evidence validation; render pass alone was not used as semantic approval.

Per the task handoff, literal underscores were corrected to real subscripts before this first independent review. The inspected final SVG indeed uses F₁/F₂. No prior independent rejection is asserted, no rejected history is fabricated, and no repair or third version was authored by this reviewer.

The formal `review.json` is scratch-path bound. It must be invalidated/re-recorded if source/spec/render/SVG bytes change or paths are promoted; this reviewer performs no promotion.

## Actual SHA256 Binding

All hashes below were calculated from complete actual file bytes using Node crypto. They are not guessed or copied as unverified producer claims.

| Input / evidence | SHA256 |
| --- | --- |
| Original `artifacts/6p/figures/fig-73.png` | `3c051c28d291bd9a22ed852de62e06f212d37c14a08a8372ff1725207e838fc5` |
| Scratch `fig-73/spec.json` | `51e161374db1dc87385347d1744a4dbedcb6100a1aa2b2c6903f53ec2293a798` |
| Scratch `fig-73/fig-73.svg` | `425f29e2476634aed5d995c99a1d219779b26fd042485adcdbacbaf455b3b239` |
| Scratch `fig-73/fig-73.render.json` | `ec5146576531f2794b68d3a4df1092126eecd1ae29e420e6ae25bc21a44c9286` |
| s23 `lesson.template.json` | `01b0274797df4655d37db3dd0e15179d7addb19e88ce5f58f9170a851e8e73ea` |
| s23 `exercises.template.json` | `2df5dd3ae194f06ccabd2471bd30fd3078fee93ebc2534a0b7dbf3c9f3674019` |
| `browser-preview-306.png` | `74bfff8e5374ba73a68adede7f205bcd77cade992ce112dce7c37ce83f780cb7` |
| `browser-preview-accent-400.png` | `362708dd489d645a57a8c6da6b7a9d447a5355c0a3f807d32a6f235245d9dcb8` |

The original hash matches `source.image.sha256`; current spec/SVG hashes match the final render. This report retains the full text and actual-preview bindings not separately enumerated by the review@1 schema.

Only this `independent-review.md` and the authorized `review.json` are written. No source/spec/SVG/text/artwork/app/code edits, promotion, assemble, DB, Git, network/model service, user-window operation or other-task review. Exact model deployment, reasoning setting and accumulated token totals are not exposed and remain unknown.
