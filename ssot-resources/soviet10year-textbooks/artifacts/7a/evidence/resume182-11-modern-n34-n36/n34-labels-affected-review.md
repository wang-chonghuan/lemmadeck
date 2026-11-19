# n34 Affected-Only Label Visual Gate

Ticket: STEMROBIN-182. Date: 2026-11-18. Sole command cwd: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.

**Fig-47 PASS; fig-51 PASS, for the three named label placements only.**

## Affected Observations

| Figure | Affected Objects | Narrow Verdict |
| --- | --- | --- |
| fig-47 | `x-value-minus-2` | PASS. In the complete CURRENT 640px preview, `-2` is horizontally centered on the exact x=-2 grid division beneath its zero crossing, not nearer x=-3. The sign and digit have visible clearance from the ascending curve and remain separated from the y-axis `-2` and other labels. No new placement ambiguity or clipping. |
| fig-51 | `source-x-minus-8`, `source-y-minus-8` | PASS. The x caption is above the axis at exact x=-8; the y caption is right of the axis at exact y=-8. Both remain aligned with their corresponding grid divisions, with clearly readable signs/digits and ample visible clearance from the negative branch. Neither introduces an ambiguous association, neighboring-label collision or clipping. |

Source-backed side choices for fig-51 are inherited from the original independent FIRST report. No source pixels were reopened or independently reinterpreted here.

## Scope Verification

Read the image skill and quality gate, both original independent FIRST `.md/.json` reports, both `independent-label-repair.json` declarations and the existing affected-render stages. A structured full-spec comparison against each `failed-independent-visual-FIRST/spec.json` confirms only the three named text objects changed:

- Fig-47: `at` changes from `[-2,0]` to `[-2,-1.6]`, placement from `NW`/gap 20 to `CENTER`/gap 0, plus that object's authored-addition explanation. Exact x=-2 is unchanged.
- Fig-51 x label: `[-8,-1.4]` to `[-8,1.4]`; y label: `[-1.3,-8]` to `[1.3,-8]`. Both retain `CENTER`, replace zero offset with gap 0, and document the source-backed side choice.
- Every label value/font/weight/color, source declaration/inventory, curve/path/knot, grid, assertion, frame/display/layout, object order and every other object is unchanged. Source PNG hashes equal the FIRST bindings; the archived before-spec hashes equal the actual FIRST failed spec hashes.

Both owner stages, `stages/fig47-affected-label-render.*` and `stages/fig51-affected-label-render.*`, have recorded exit 0. Their command paths, stdout/stderr hashes and current render-to-spec/SVG hashes match. Current render status is `pass` at width 640, with minimum text 18px/20px respectively. These stages were read, never rerun; their technical passes did not substitute for visual inspection.

## Evidence

Exactly **two** images were opened, using `detail: original`: CURRENT fig-47 `complete-preview.png` once, then CURRENT fig-51 `complete-preview.png` once, both complete 640x640 previews. Zero originals, reopens, crops, historical previews or other figures were loaded.

All 28 source/candidate/history/stage evidence files were SHA-256 hashed before the first image open at `2026-11-18T23:40:28.190Z`. They were rehashed after observation and all remained unchanged. The JSON companion contains the requested `figures` array with `id`, narrow `status`, source/spec/render/SVG/preview absolute paths and SHA-256 values, and empty `findings` for each passing affected figure.

Reviewer-owned sibling receipts:

- `n34-labels-affected-review-receipts/pre-open-hashes.json`: pre-open bindings, inherited inventories, exact structured diffs and stage checks.
- `n34-labels-affected-review-receipts/post-observation-binding.json`: post-observation stability for all 28 bound files.
- `n34-labels-affected-review-receipts/image-load-ledger.json`: exact two-load order and affected observations.
- `n34-labels-affected-review-receipts/check-bindings.mjs`: local receipt/binding checker only; no rendering, source review or application access.

## Boundaries

All unaffected/source/math approvals are inherited, not newly reviewed. The two real FIRST failures remain recorded in their original reports and archived failed specs; this narrowly clears their three placement findings only for the current hash-bound versions.

No candidate edits, source edits, Git/env/network/DB/app operations, answer-key reads, render/validation reruns, durable `review@1` record, promotion or whole-lesson approval. Writes are limited to the requested affected-review `.md/.json` and reviewer-owned sibling receipts. Parent n36/answer work is outside this review. Any later change to a bound source/spec/render/SVG/preview invalidates that version's verdict.
