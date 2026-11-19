# STEMROBIN-180 n94 Independent TEXT Review

Date: 2026-11-19. Verdict: **TEXT REVISE**.

Offline C-group review of `phy7-c1-s1-n94`, not a SOURCE, figure, answer, or course approval. This is a fresh comparison of the supplied frozen text and approved page JSON/MD/audit. No author review, answer key, chat, history, image, unfinished figure output, database, environment file, application, or canonical content was inspected or changed.

## Required Revisions

1. **TEXT-N94-1: Short-paragraph and sentence-line layout is missing.** Frozen `lesson.template.json` `prose[0]` (`p0246#4`) and `prose[2]` (`p0246#6`) each contain six complete sentences in one uninterrupted paragraph. The actual `prose_flow.mjs` result retains each as one paragraph, at outline indices 0 and 2. The lesson skill requires complete sentences on separate lines and short paragraphs containing two or three consecutive sentences. Split these six-sentence objects into short paragraphs within their existing `text` fields, preserving the 14 source-object identities, all words, formulas, numbers, units, and source snapshots. Apply sentence-line layout to the other multi-sentence paragraphs as well; do not invent scientific or cultural edits.

2. **TEXT-N94-2: The separately introduced formula remains inline.** Frozen `prose[13]` (`p0248#2`) contains `...燃烧值：**$Q=qm$，式中$q$...` on the same line as its introduction and symbol definition. Merging the adjacent bold delimiters correctly removes the source's `****`, but does not satisfy the skill's separate-line requirement for an introduced formula. Put the complete formula on its own line and preserve the introduction, the following definition of `q`, the non-bold formula/definition, and every mathematical token. Record only layout changes. Do not alter the approved source's punctuation or scientific wording as part of this repair.

These are TEXT layout revisions, not scientific, numerical, question-content, or figure defects. No missing or ambiguous source premise requires TEXT HOLD. No candidate was repaired by this reviewer.

## Exact Inputs

Author input manifest: `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n94-text-author/manifest.json`.

SHA-256: `1d82a274062474be35ef650aaf660b22519980ad7bfe224e9d618e223f2b155a`, verified against the actual bytes rather than accepted from its status or change summary.

All six snapshots below are under `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n94-text-author/current-freeze/`; their manifest digests, byte counts, and `0444` modes match.

| Snapshot | SHA-256 |
| --- | --- |
| `lesson.template.json` | `3b1bb262950d15908e185d5f00d185d6f915c60efda2ecdec964169ae02be7d3` |
| `exercises.template.json` | `8b3c564d3504c2d41e788b800abfe85f5b7af81be28249d93084ac7e132433af` |
| `figures.template.json` | `747e7927712a8ed647c90fdfe08346557a4e7dae4962c86494cbead540bab722` |
| `source/lesson.json` | `425d4ebc98b2e83b4d44067aebc429f24fd92d867ddd40382593805dc1ad321e` |
| `source/lesson.md` | `561ef26fd44287c09ee36425b6b72c316d824c07932c03d446fa6ba30b2ad869` |
| `source/exercises.json` | `28ca3f7295a5e1df61266fb675e6d919722536d8314fc09450674fefabe8cbab` |

The evidence manifest additionally binds the exact nine approved `page.json`, `page.md`, and `audit.json` files in `.tmp/ld-s10y-lesson/resume-180-4-n94-cohort/artifacts/7p/pages/{0246,0247,0248}/`, the instructions and relevant text helpers, this report, the checking script, generated checks, and completed command receipts with their stdout/stderr hashes.

## Scope and Source Binding

Physical pages 246, 247, and 248 correspond to printed pages 235, 236, and 237. The selected stream starts after the n94 heading at `p0246#3` and ends before the n95 heading at `p0248#13`. The n95 open paragraph at `p0248#14` is unselected; preceding n93 exercises and page footers are not lesson content.

Reconstructing the selected approved page blocks reproduces all 14 source prose objects and all eight source exercise objects exactly. The cross-page paragraph joins `p0247#8` directly to `p0248#1`, retaining the continuation after `3400` and its `千卡/千克` unit. Source `lesson.md` is exactly reconstructed from source `lesson.json`, including its heading, captions, textual figure references, and original adjacent bold delimiters.

The lesson/exercise embedded `source.data` values deep-match their supplied source JSON. Their source paths and SHA-256 values match; every `source_text`, object kind, identifier, label, printed page, source reference, question number, source number, group, group ID, and declared figure reference is preserved.

The supplied page audits report 24/24, 13/13, and 23/23 text lines, respectively, with empty error and errata lists. These are inherited approved SOURCE facts, not new pixel review or SOURCE approval.

## All 14 Prose Objects

| Index | Approved source binding | Independent comparison |
| --- | --- | --- |
| 0 | `p0246#4` | Water's one oxygen/two hydrogen atoms, decomposition, work, and energy account are text-identical; six-sentence layout needs revision. |
| 1 | `p0246#5` | Gravity, lifting, falling, and the forging-hammer analogy are text-identical; retain all three sentences. |
| 2 | `p0246#6` | Fuel examples include coal, petroleum, and gasoline; one carbon/two oxygen atoms, carbon dioxide, and figure 226 are text-identical; six-sentence layout needs revision. |
| 3 | `p0246#7` | Empty figure object `fig-226`, label, position, and source reference are unchanged; no image inspected. |
| 4 | `p0246#8` | Caption `图226` is text-identical. |
| 5 | `p0247#1` | Coal, peat, firewood, petroleum, oil shale, natural gas, engine calculations, and experimental comparison are text-identical. |
| 6 | `p0247#2` | The definition uses 1 kilogram and complete combustion; wording and emphasis are text-identical. |
| 7 | `p0247#3` | `q` and all three unit formulas, `焦耳/千克`, `千卡/千克`, and `卡/克`, are token-identical. |
| 8 | `p0247#4` | Experimental measurement statement is text-identical. |
| 9 | `p0247#5` | Table introduction is text-identical and remains immediately before the table object/caption. |
| 10 | `p0247#6` | Empty table object `tbl-p0247-01`, label, position, and source reference are unchanged; no image inspected. |
| 11 | `p0247#7` | Caption `燃料的燃烧值` is text-identical. |
| 12 | `p0247#8`, `p0248#1` | Peat's `1.4\times10^7`, 3400, 1 kilogram, both heat quantities, and continuation units are text-identical. |
| 13 | `p0248#2` | Only the four adjacent asterisks between `热量` and `$Q$` are removed; `m`, `Q`, `Q=qm`, and `q` are token-identical. Introduced-formula layout needs revision. |

The historical atomic/energy explanation and gravity analogy are retained, not replaced with an invented modern mechanism. There are zero scientific rewrites, numerical substitutions, unit conversions, or math corrections, and no registered erratum is silently discarded. This fidelity judgment is not an independent approval of every historical scientific simplification.

## All Eight Tasks

| Stable number | Group / source number | Source reference | Independent comparison |
| --- | --- | --- | --- |
| `1` | 问题 / 1 (`g1`) | `p0248#4` | Definition question is text-identical. |
| `2` | 问题 / 2 (`g1`) | `p0248#5` | Unit question is text-identical. |
| `3` | 问题 / 3 (`g1`) | `p0248#6` | Meaning question preserves both complete `1.4\times10^7` and `3400` unit formulas; only source print-line wrapping is flattened. |
| `4` | 问题 / 4 (`g1`) | `p0248#7` | Heat-calculation question is text-identical. |
| `g2-1` | 练习47 / 1 (`g2`) | `p0248#9` | Printed-page reference 236, petroleum, 10500, and both unit/meaning questions are unchanged; `tbl-p0247-01` reference/display identity is retained. Only print-line wrapping is flattened. |
| `g2-2` | 练习47 / 2 (`g2`) | `p0248#10` | Dry-firewood/brown-coal comparison and request for justification are unchanged; no mass assumption or result is added. Only print-line wrapping is flattened. |
| `g2-3` | 练习47 / 3 (`g2`) | `p0248#11` | 15 kilograms of charcoal and 200 grams of alcohol, complete combustion, and both requested quantities are unchanged. |
| `g2-4` | 练习47 / 4 (`g2`) | `p0248#12` | 2 liters of kerosene and complete combustion are unchanged; no density, conversion, or solution is supplied. |

All eight `text` strings are exact source matches. The three changed `lines` arrays merely join approved print lines; all modern arrays equal their full task text. The two groups retain separate 1-4 source numbering without collisions. No task has been omitted, answered, combined with another task, or extended into n95.

## Culture, Flow, and Limits

The published prose/caption/task strings contain none of the current edition profile's forbidden cultural terms or fictional names, no Cyrillic letters, no print-column full-width spaces, no hand-authored HTML wrappers, and no Chinese punctuation inside their math spans. Empty `historical_entities` declarations are appropriate for these strings. The table's internal historical wording and English figure labels belong to the separate figure review and are not certified here.

`section_breaks` is empty, and the authoritative helper resolves zero breaks without error. No invalid or fabricated anchor exists; an empty array is not itself a defect. If the author introduces a separator during layout repair, its adjacent final-paragraph anchors must come from the repaired `prose_flow.mjs` output. The present helper returns ten textual paragraphs, two figure identities, and two captions; object count alone does not satisfy the short-paragraph contract.

Mechanical fidelity checks: **PASS**. Human TEXT verdict on these exact frozen inputs: **REVISE**, for TEXT-N94-1 and TEXT-N94-2 only. These verdicts are deliberately distinct.

Counts: **14 prose objects = 10 text objects + 2 figure objects + 2 captions; 8 exercises; 2 groups; 2 figure identities; images 0**. Figure, answer, full-course, publication, and n95 approvals: **not given**.

## Frozen Evidence

Generated checks: `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n94-FIRST-TEXT/checks.json`, SHA-256 `39eb974291446f1710e643e3a853147c8a2f9b6c936a7a3a79db0d3a7ee555ad`.

Evidence manifest: `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n94-FIRST-TEXT/manifest.json`. The report and manifest are sealed `0444`. The manifest binds all completed pre-seal command receipts. The final runner-generated seal receipt is an external envelope containing the final report/manifest digests, avoiding a recursive self-hash.

Every exec used the explicitly authorized worktree and the existing `run-stage.mjs` recorder. One read-only helper lookup (`n94-first-text-014-layout-locations`) exited 2 because three guessed helper paths did not exist; its original receipt is retained. Searching the existing tools directory recovered the lookup without a dependency, app, source, candidate, or content change. No scientific or acceptance verdict was inferred from that technical failure.
