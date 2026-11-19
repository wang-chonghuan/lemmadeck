# n34 Figures 50-53: Independent FIRST Visual Gate

Overall: **REVISE**. Fig-50 **PASS**, fig-51 **REVISE**, fig-52 **PASS**, fig-53 **PASS**.

This is one independent FIRST visual gate, not a promotion or a second review. All commands used `/Users/yong/.codex/worktrees/d9b1/lemmadeck`. Writes are limited to this report, its JSON counterpart and the reviewer-owned sibling receipts directory. No candidate/source/app/Git/env/network/DB changes, promotion, durable `record_review`, rendering or standalone-validation reruns occurred.

## Evidence and Observation

All sources, current specs, renders, SVGs, current previews, figure contexts and inventories were SHA-256 hashed before the first image open, at `2026-11-18T23:28:33.306Z`. The complete modern n34 lesson and all eight exercises were read. No answer key was read.

Exactly eight `view_image` calls used `detail: original`, in order: fig-50 source/preview, fig-51 source/preview, fig-52 source/preview, fig-53 source/preview. Each original `source.image` and current `complete-preview.png` was opened once. No reopens, crops, historical preview images, screenshots or extra images occurred. Current previews were viewed whole at 640px: 640x640 for figs50-52 and 640x345 for fig53.

The JSON counterpart contains the requested `figures` array with each `id`, `status: pass/revise`, `source`, `spec`, `render`, `svg`, `preview`, exact SHA-256 values and detailed findings. Paths resolve from the sole cwd. The two receipts are:

- `n34-figures50-53-review-FIRST-receipts/pre-open-hashes.json`, SHA-256 `ee95f8992293a723053df850e4f2cf9c6a6bea5c9817619e0a82661f16e22f4d`.
- `n34-figures50-53-review-FIRST-receipts/post-observation-checks.json`, SHA-256 `739ebfd5ddbd50dcebf10d99eb64c580cd35a53ccbc9cfada8598b00472e9e2d`.

Each source lattice and curve was independently interpreted from the pixels. Object totals, executable assertions and technical render passes were not substituted for source fidelity.

## Fig-51: REVISE

**[P1] Negative branch crosses both `-8` labels at actual 640px display.**

The x-axis label `source-x-minus-8` is centered at `(-8,-1.4)`, while the curve has `(-8,-1.5)`. Their vertical separation is only **2.42px** at `640/26.4` px per unit. The 20px label footprint is visibly intersected by the 3.4px negative-branch stroke.

The y-axis label `source-y-minus-8` is centered at `(-1.3,-8)`, while the curve has `(-1.5,-8)`. Their horizontal separation is only **4.85px**. Here too the stroke runs through the negative-value label. These are visible sign/digit-readability failures, despite the current render's `status: pass` and empty collision list.

The original source avoids these conflicts by placing negative x-axis numbers above the x-axis and negative y-axis numbers to the right of the y-axis. Request a narrowly scoped **spec label-placement repair** for those two objects, preserving their value/tick alignment and creating clear space for the full text footprint. Preserve all graph mathematics and rerender through the owner workflow; never hand-edit SVG. This reviewer performed no repair.

Other checks pass:

- Source pixels have **13 vertical and 13 horizontal rulings: 12x12 cells**, each **2x2 units**, with both coordinate ranges `[-10,14]`. The current grid preserves this structure and scale.
- Both solid branches are actually visible now, decrease separately in quadrants I and III, remain separate across `x=0`, and neither joins nor crosses an axis. The origin `0` labels the coordinate frame, not a function value.
- The source and formula-authoritative curve agree with `y=12/x`, including prose values `(-2,-6)` and `(6,2)`, without turning those examples into visible answer markers. Formula, other labels, axis arrows and frame boundaries are intact.
- `context-after-erratum.json` and `text-binding.json` were used. A structured comparison confirms only the final larger-function-value to smaller-function-value correction in `source.authoritativeText[0].text`. Every other spec field is unchanged; render changed only `spec.sha256`. SVG and preview hashes still equal the pre-text-binding output receipt. The corrected final paragraph exactly matches the current lesson.

This is the **FIRST actual visual observation of the current scale-repaired preview**. It is not a second independent pass, and text rebinding is not visual approval. Historical absent curves and technical passes remain historical.

## Fig-50: PASS

The original has one shared coordinate frame, **13x13 rulings / 12x12 unit cells**, `x=-5..7`, `y=-3..9`. The current preview preserves all columns and rows, including five negative-x columns and three negative-y rows; there is no invented half-unit lattice.

The solid V has the source endpoints `(-5,5)` and `(7,7)` and meets exactly at `(0,0)`. The left arm decreases and right arm increases, consistent with both `y=|x|` and the full lesson's separate monotonicity statements. Exact straight arms are justified by the authoritative formula.

All x labels `-4,-2,0,2,4`, y labels `2,4,6`, axis titles and formula are present. At 640px the formula is clear of the right arm, labels and signs are readable, the vertex is visible, and grid/curve ends are not clipped. No added point disks, curve arrows, answer annotations or cultural/scan leakage appear. Existing render reports 20px minimum text; it was not rerun.

## Fig-52: PASS

Source pixels have **13x13 rulings / 12x12 unit cells**, `x=-6..6`, `y=-3..9`, one shared frame and one solid unlabelled U-shaped curve. The current preview retains this structure, source scales/labels, minimum **below the origin near the y-axis**, visibly falling negative arm, rising positive arm and finite source ends.

Only the queried ordering is approved:

- `f(-2.1) < f(-3.6)` in both source and preview.
- `f(1.3) < f(2.8)` in both source and preview.
- For `x1 < x2 < 0`, the negative arm gives `f(x1) > f(x2)`.
- For `0 < x1 < x2`, the positive arm gives `f(x1) < f(x2)`.

No analytic formula, parabola identification, symmetry claim, exact unlabelled ordinate, exact zero/minimum value or extrapolation is inferred. Approximate trace knots remain digitization evidence, not exact given data. The inequalities above are reviewer-only observations; none is printed on the candidate.

At full 640px the grid, curve and all source labels are legible. Moving the origin `0` above-right clears the low curve while keeping it an unambiguous axis value. No curve-label collision, query markers, highlighted answer intervals, added endpoint disks or cultural leakage is visible.

This is the **FIRST actual observation of the current scale-repaired preview**. Current render pass and 20px minimum text were read, not rerun. Earlier missing-curve technical passes do not prove fidelity.

## Fig-53: PASS

Source pixels have **25 vertical and 13 horizontal rulings: 24x12 unit cells**, `t=-3..21`, `v=-2..10`. The current wide preview keeps three negative-time columns, two negative-speed rows and the grid beyond the end of the data.

Using the original shared origin, unit grid and labelled time positions, the four endpoints/turns are **`(0,0)`, `(6,5)`, `(14,5)`, `(16,0)`**. The current graph rises to `t=6`, stays flat at **speed 5 from `t=6` through `t=14`**, and falls to zero at `t=16`. The plateau lies on the row midway between the labelled speeds 4 and 6.

The arms retain their observed bending without a claimed physical formula or invented exact intermediate velocities. No graph appears before `t=0` or after `t=16`, although the instructional grid extends farther. No data arrows, endpoint disks, dashed substitutions, interval-answer annotations or extra endpoint labels are added.

All time labels `0,2,4,6,8,10,12,14,16`, speed labels `2,4,6` and correct neutral unit labels `t (s)` / `v` / `(m/s)` are present. At 640x345, `0` and `16` have modest extra downward clearance but remain aligned with their intended time positions, readable and clear of endpoints. `(m/s)` is clear of the v title/arrow. Finite borders fit the canvas; no overlap or broken raster is visible.

Historical FIRST collisions involving `16`, `0` and `(m/s)` remain recorded failures; historical absent curves and later render passes remain historical. This is the **FIRST actual visual observation of the current corrected preview**, not an author's prior approval. Existing current render reports pass and 16px minimum text; it was not rerun.

## Hash Stability and Integration

Post-observation byte checks covered all 38 pre-open entries. **Every figure source, candidate and bound evidence file remained unchanged.** Only the full lesson/exercises changed during the parent's parallel text work, and their current contents were reread.

Fig-50 and fig-51 nearby paragraphs still exactly match their frozen contexts. Exercises 746 and 747 differ only by Cyrillic-to-Latin subitem lettering; their mathematical questions and figure refs are unchanged. Current full-file hashes are lesson `203f46e1097f28784e8a6d3c0c205add59240f91e05a05f1c9f4fc8c30b2146e` and exercises `b913c6c7ac477537ed3769c7d0cc939d855d8e2a675e078a01e46b58e99280dc`.

This semantic compatibility is **not** byte-identical authoritative-text provenance. Before promotion, the parent must reconcile any changed text binding and require exact current source/spec/render/SVG/preview hashes. A change invalidates this report's approval of that artifact version.

**No aggregate PASS or promotion is recorded. Fig-51's listed hashes fail this visual gate and require repair plus fresh bounded review. Figs50,52,53 pass only for the exact versions listed in the JSON report.**
