# STEMROBIN-182 n35 FIRST Offline Display Gate

**Status: REVISE.** Four surfaces require removal of visible footer navigation controls; two choices surfaces pass. This is display-only, not a semantic, source, mathematical, or publication verdict.

Cwd for every operation: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.

## Evidence and Image Usage

Reused the authoritative headed desktop 1440x960 / mobile 390x844 run, completed 2026-11-19T00:17:56.676Z: exit 0, six surfaces, result `pass`. Current `result.json` SHA-256: `8ccd156c3bbd8b2728087f2b860c9f061faff19839d8314c4dfc329425122b41`.

All six PNGs and their HTML bindings were hashed before any image open at 00:20:46.059Z and remained unchanged after observation at 00:21:38.183Z. Read six full-page screenshots exactly once each, in order: text desktop/mobile, exercises desktop/mobile, choices desktop/mobile. Image usage: **6/8**, zero crops, zero reopens, zero standalone/source image opens. No renderer, browser, DOM, or fresh capture was run.

## Per-Surface Verdicts

| Surface | Verdict | Concrete Observation |
| --- | --- | --- |
| Text desktop | revise | Centered readable column; table and curve visibly nonblank and contained; formulas do not collide with prose. Graph caption is centered beneath its graph, not overlaid or associated with another figure. Blue footer control `去做题 · 7 道 →` violates the control-free offline display gate. |
| Text mobile | revise | Title and paragraphs fit; proof formulas wrap without visible overlap. Table/curve right sides are outside the initial horizontal-scroll view, not independently observed here. Caption remains separate below the curve. Same blue footer navigation control remains. |
| Written desktop | revise | Exercises 754-760 have clear number gutters and dividers; review heading and stacked fractions remain separate and visible. No figure is expected on this surface. Blue footer control `← 回课文` violates the control-free gate. |
| Written mobile | revise | Two-line title, numbered exercises and six final domain expressions fit vertically. A trailing semicolon wraps to its own line in 754(a) and 759(b); this is a minor wrap detail, not an obstruction. Same blue footer navigation control remains. |
| Choices desktop | pass | Ten numbered question sections, three nonblank curve placements, aligned option gutters and separated rows. Merged q06's stem, graph and A-F rows remain distinct; final displayed questions 9 and 10 are visible with no fraction/radical collision. No footer navigation control is visible. |
| Choices mobile | pass | Title wraps; all ten sections remain in sequence. Long q06 alternatives and q07/q08 set expressions wrap within their own rows; q09's A-H fractions and the final radical stem do not overlap neighboring rows. Three graphs retain readable initial regions but hide their right sides in local scroll areas. No visible footer control. |

## Required Display Repair

`F01`: Remove the existing `a.jump[href="exercises.html"]` footer from n35 offline text display. `F02`: Remove `a.jump[href="text.html"]` from n35 offline written display. Both were independently visible in both sizes and confirmed by a read-only search of the existing hash-bound HTML bytes. Parent owns any repair and affected-only recapture; do not change durable lesson, choice or figure bytes.

The existing successful checker asserts zero `input,textarea,button,select`, but does **not** test anchors. Its native-control assertion passes while the broader no-UI-control display gate fails on these four surfaces. Root overflow is 0 on all six; all recorded scroll ends are reachable; console errors are empty. These are reused machine facts, not new DOM checks.

No independently established n35 detached-caption defect is reported. There is generous figure/caption spacing, but the single graph caption remains visibly associated with its own graph and does not overlap prose.

## Current Screenshot Bindings

Each filename is below this report's directory; full HTML and evidence bindings are in `visual-review.json` and `ownreceipts/pre-open-hashes.json`.

| Screenshot | SHA-256 |
| --- | --- |
| alg7-c4-s1-n35-text-1440.png | `7e81c317087d653413faaf03b644eb149da8e10b9c0bc78e903cf22081c53765` |
| alg7-c4-s1-n35-text-390.png | `fec6fe79d7729849abd87e585ae94374af4e755c8eea5678ab572ca8b5e1d659` |
| alg7-c4-s1-n35-exercises-1440.png | `a0b1946bf9a620f2ec472773cf11a2b407c908ec39fc8e5e28f89ee68678b52a` |
| alg7-c4-s1-n35-exercises-390.png | `00eea6d0f4c967987d9ca0088dcc2a1da679a8013dcc46bbf4d7050383f8ea4a` |
| alg7-c4-s1-n35-choices-1440.png | `dc402512475f98c94b200553bd055bd9a581e961ea79692025e61608fb9f5f93` |
| alg7-c4-s1-n35-choices-390.png | `ca66c6ac6fc0cf75051e4b3339159c13fdb75c251484e61a8aa0d1449e02136c` |

## Reuse and Limitations

The two independently passed source/math/label figure reviews are reused, not redone from full-page pixels. Current durable SVGs equal the approved outputs: `fig-54` SHA-256 `473153e455c3d9f177108177ed14f526f38a8528d2317275e653e888925daaad`; `tbl-p0220-01` SHA-256 `143408710b41091d5568489ec1745c1d906e0fa7c436ec6d174e61775bd3bc29`.

Final choices remain **10 questions / 48 options, PASS**, after the affected q06/q09 merge. Canonical draft binding `08cfb241b5ba9fd6fe25cd45102bd4e1f85e5c2ca4cb52c812083433b2f428fe` matches the passed review; no semantic judgment was reconsidered.

Static full pages cannot show the hidden horizontal-scroll ends, interactions, alternate themes, or other viewports. Whole-page viewing may downsample small glyphs; this is not a new exact figure-number/label audit. Actual PNG dimensions are 1425x2388 / 375x2960 (text), 1425x1560 / 375x1829 (written), and 1425x4862 / 375x5752 (choices), distinct from the recorded browser viewports. The original receipt does not hash the checker source; its current contract hash is recorded without claiming historical source immutability.

Two reviewer-owned prehash assumptions failed before image opens (PNG width equality and raw-vs-canonical choice digest). Both failure receipts and targeted technical recoveries are retained in `ownreceipts`; neither is a content verdict. Only this report, its JSON and `ownreceipts` were written. No app, DB, .env, network, Git, source or candidate edits.
