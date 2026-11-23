# Comparison 7

Completed bounded author comparison, not a whole-lesson or mathematical-correctness approval.
Sole cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
Only new comparison/evidence files were written under the existing independent7 ownership root. The three first-stage files retain their original bytes and permissions.

## Verdicts

| Scope | Substantive Source Verdict | Native Result |
| --- | --- | --- |
| Physical 175 / printed 165 | **HOLD_SOURCE_WORD_DISAGREEMENT**: one unverified one-character difference, “中”, remains against sealed row 03. No other prose/math-content disagreement remains after the authorized local inspection. | Retain actual first exit 0, 24/24. This does not decide the word disagreement. |
| Physical 176 / printed 166 | **PASS_SOURCE_CONTENT_WITH_RETAINED_UNKNOWNS**: all 20 print-text rows, literal math, exercise 488, captions, and the nontext separator match. | **HOLD_COUNT_ONLY**: retain actual first exit 1, text 20 / projection 21. |
| Actual native figures 234-237 | **PASS_SOURCE_CROP_FIDELITY_WITH_RETAINED_UNKNOWNS**, each inspected once. Whole labels, endpoints, and figure boundaries are retained; captions/prose are not baked into the crops. | Do not regenerate these passed crops to address a text or count issue. |

For 176, no source text/math/exercise/figure repair is evidenced: the concrete native reconciliation gap is the independently confirmed separator. For 175, a source-word disagreement needs one affected-row check before deciding whether a one-character author repair or another independent-first observation correction is appropriate.

## Seals And Bindings

Parent retained the original first seal before author disclosure:

- `first-seal.json`: `4752c9177cf88f456bc9c30e8f83022bce6d3149ead2b1b6765514b4b03c0623`
- `SOURCE-FIRST.md`: `60452ccc55d4bc97cee7a93383e468782067d761dcb3571cb07e1aa77dfc9923`
- `source-inventory.json`: `744236f8a7d1ae21810194b5e54dc0328006216f045451f43009e4dbf5a855e7`

All three byte hashes were verified unchanged. No first-stage finding was rewritten.

Disclosed author root:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188/ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-source175176/author-first7`.

Author manifest hash matches `b8963f75609af626283eb56ce4593e8c70695e5f6ba1563dba07b28a4cafd4a4`.
Actual retained FIRST files, first candidates/observations, native page.md/page.json/audit.json, four PNG crops, and first receipts/streams matched their manifest hashes and byte lengths. Manifest paths naming the earlier author working root were resolved only to the corresponding files in the disclosed retained root. The in-flight author root, producer implementation, model/runtime services, DB, .env, Git and peers were not accessed.

## Every Content Difference

1. **Unresolved, 175 row 03 / author block 2.** Independent first: `如果三角形中有一个角...`; both retained first/native candidates: `如果三角形有一个角...`. This is a real one-character comparison mismatch, not a spacing normalization. No targeted row-03 image was read in this batch. It is not honest to claim that the candidate or the independent first is pixel-confirmed wrong after two other first-stage transcription errors were found. Keep a narrowly scoped source-word HOLD; do not silently insert or delete “中”.
2. **Resolved independent-first error, 175 row 19 / author block 9 line 5.** First recorded `内. 因此，...`; the authorized original-source local crop visibly prints `内. 所以，...`, matching the author. No author repair is needed. Preserve the original finding in the unchanged first seal.
3. **Resolved independent-first error, 175 row 20 / author block 9 line 6.** First recorded a period after `个三角形`; the same local crop visibly prints a comma, matching `个三角形，$O$ 是它们的公共顶点.` in the author. No author repair is needed.
4. **Resolved independent-first inventory omission, figure 236.** First enumerated five outward continuations, omitting the horizontal continuation left of the lower-left polygon vertex. The actual native crop has **six** beyond-perimeter continuation pieces: left of upper-left, above/left of top, above/right of upper-right, right of lower-right, left of lower-left on the baseline, and below/right of lower-left on the slanted side. The five-sided perimeter and five exterior-angle sites remain unchanged. The author crop/description retains that left baseline terminal.

Other encoding differences were checked, not silently promoted to glyph facts: fullwidth/ASCII parentheses, whitespace around mathematics and subpart labels, dollar delimiters spanning the first formula's two rows, and printed-foot dot representation. These change no observed word, number, formula, print row, or object ownership.

The author's `\blacksquare` encodes the observed dark marks. Two source marks are visibly vertical bars, including the two-row bar beside 49, rather than square-shaped boxes. This remains an **exact-shape/role UNKNOWN**, not approval of a proof/QED meaning or an additional mathematical given. Both sides retain role UNKNOWN; no speculative replacement is requested.

Author `crop-observations.md` mentions figure-237 “foreign-component exclusion”. The actual retained audit records `snapped-components` ownership with `neighbours: []`; a nonempty foreign-component removal is **not demonstrated** by that record. This is a provenance-description qualification, not a missing-source-pixel finding or a reason to replace the crop.

## Text And Object Coverage

Every print-text row was compared, with only the disclosed shape/spacing normalizations above: 24 unique rows on 175 and 20 on 176. Three differences occur on 175, two now resolved in favor of the author; zero occur on 176. No extra/missing printed row, number, caption, exercise clause, or formula was found.

175 retains top `MCN` and the two-row expression `\hat{1}+\hat{2}+\hat{3}=180^\circ`; corollaries 1-3 and `60^\circ`; all three exterior-angle proof formulas and its parenthesized `\hat{C}`; local theorem label 48 and `2d(n-2)`; the proof's `n`, `O`, `2dn`, and `2d` occurrences. The six-row/three-row proof pieces and the two real caption/prose same-row placements remain present.

176 retains the top `O`, `4d`, `n`, `2dn`, `2d(n-2)` occurrences; quadrilateral special case `4d`; local theorem 49 in two rows; `2d`, `2dn`, and `2dn-2d(n-2)` in the five-row proof; and `6d`, `n=5`, `6d=2d(n-2)` in the four-row note. These are literal-source comparisons, not evaluated identities or solutions.

174 was accessed only through parsed canonical JSON's final open proof p (block 15) and following transparent teaching footnote. The final p has `open: true`; the following `foot note` has two lines. This settles author175 block1 `p cont` as compatible with the actual carried grouping. No other 174 text, image, or figure was emitted/reviewed.

Theorem48's author175 blocks9 `p open`, 12 `p cont open`, and author176 block1 `p cont` preserve the same proof object across transparent figure/caption/footer blocks and close before `特别是`. Printed paragraph indentation and completed sentences do not require closing that larger source proof object. No continuation repair is requested. Theorem49's proof and the note close on 176.

No teaching footnote occurs on either new page. Printed feet are 165 and 166, with two surrounding dot shapes each. `问题和习题` is the observed exercise-column heading. Exercise 488 is complete in two rows, with unchanged numeric subparts `1) 1,2,3; 2) 3,7,8; 3) 1,1,3`, and no figure attachment. No new unit/supplement heading was seen. Whole-lesson right boundary after 176 remains UNKNOWN; no 177+ or TOC reading occurred.

## Four Actual Crop Reviews

| Figure | Native Source Box | Actual PNG Dimensions | Observed Fidelity |
| --- | --- | --- | --- |
| 234 | `[802,517,404,236]` | 428 x 260 | A/B/C/D-shaped labels complete; AB/BC and A-C-D baseline intact. Actual curves resolve A=2, B=3, C exterior=1. |
| 235 | `[898,1328,338,299]` | 362 x 323 | Seven perimeter vertices/edges, seven hub connections/triangular regions, O-shaped label below hub complete. Edge flecks retained. |
| 236 | `[235,970,360,340]` | 384 x 364 | Five perimeter vertices, six beyond-perimeter continuations, five exterior sites with curve counts 1,1,2,1,1 clockwise from upper-left. All terminals visible. |
| 237 | `[765,1000,404,292]` | 428 x 316 | A/B/C/D/E-shaped labels complete; A-B-C-D-E-A boundary with notch D; A-D/B-D internal segments and three triangular regions intact. No distinct angle curve is identifiable. |

All PNG dimensions exceed their audit box dimensions by 24 pixels in each axis, with a visible white frame; the PNG canvas must not be mistaken for the source-ink box. Differences from first coarse boxes are ordinary observed native snapping, not missing geometry. Figure 237's box extends left of the coarse estimate to retain the A-shaped label. Captions remain complete separate text, with the sealed same-row relations: 234 with row09, 235 with row20, and 236/237 sharing row12.

Glyph alphabets, O-versus-zero digital identity, separate point-dot cardinalities, intentional tick/hatch/arrow roles, edge/junction flecks, and peripheral scan-fragment provenance remain UNKNOWN. Fine arc counts now observed from the actual crops are additions to this comparison only; they do not rewrite FIRST or establish modern geometry.

## Separator And Native Hold

The original-source local crop includes the preceding displayed formula, the whole separator, and the following heading. The separator is visually a thin, slightly descending nontext rule with no word, caption, formula, exercise label, or figure inside its box.

Independently observed minimal dark-ink source box: **`[144,1684,1075,17]`**, inclusive extents x144..1218, y1684..1700. This was measured read-only from the already retained local crop, at threshold <128, in the visually identified rule band. It is an observed ink bound, **not authored exclusion metadata**. The formula is above the band, the heading below it, and there are visible white gaps on both sides. No neighboring-page assumption is needed.

The existing skill lines268-273 fit this object: `separator-rule` may affect only the counting copy, with recorded provenance, without changing source/crops/text or hiding printed content. Author-native diagnostic band `[1684,1701]` is consistent with this independently observed rule. Its first audit still says 21 projected / 20 text rows; the normalized page's `printed_lines:20` is not proof that native reconciliation passed.

Minimal affected request to parent: retain first176 attempt1 and all current outputs; use the existing separator-rule contract for this observed isolated rule in a **separate repair working copy**, then check only the affected native176 reconciliation. Do not add a prose row, alter math/ex488/captions, invent a figure/owner, use a manual count override, touch source pixels/crops, or change shared counting implementation merely to clear this case. Nothing was applied or rerun here.

Separately, check only 175 corollary1's “三角形[中]有” row in a fresh bounded source context. If “中” is present, repair that one character in a separate author repair copy and verify only the affected175 result; if absent, retain the author bytes and record another independent-first error separately. Reuse all four passed crop reviews; do not reopen the batch.

## Counters And Finish

Actual cumulative batch/context image loads: **8/8 and 8/24**:
175 plain, 176 plain, native234, native235, native236, native237, target175 rows19-20, target176 separator/neighbors. Every image was loaded once; no page/grid visual reopen. Each bound original was backend-decoded once this stage solely to produce its authorized exact local region. Remaining batch image slots: **0**.

Target evidence:

- `target175-rows19-20.png`, source box `[160,1565,720,145]`, SHA-256 `b1f3cad71b3214e3a84a25a671241e7c72b986f34aa1de2cb4e0ba074fa6d86e`.
- `target176-separator-neighbours.png`, source box `[125,1578,1115,197]`, SHA-256 `6454e725e4a5a265dd517f8e9cf26fcf1af88e60136c4d9dda8bb08d5770930e`.

No producer/finalize/count-mask/source/CSS/shared-tool changes, metadata application, re-solving, modern/answer/choice work, Git/DB/service actions, peer messages, or timers. Four newly created comparison/evidence files are sealed mode0444 after write; first-stage files remain untouched. Stop here for the parent's narrow affected diagnosis.
