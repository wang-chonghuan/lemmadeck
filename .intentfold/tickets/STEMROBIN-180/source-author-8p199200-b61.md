# STEMROBIN-180: SOURCE Author 8p199/200, b61

Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Scope: physical 199 and 200 only, FIRST-only SOURCE author in the same invocation. STOP after these two pages.
Evidence root: `.intentfold/tickets/STEMROBIN-180/tmp/b61-author199200/`.
Artifact root: `.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/`.
Work root: `.tmp/ld-s10y-lesson/b60-elastic/work/8p/pages/`.

## Result And Full Coverage

| Physical / printed | FIRST result | Distinct rows | Text-object lines | Coverage |
| --- | --- | --- | --- | --- |
| 199 / 187 | PASS, sole finalize | 25 / 25 | 25 | 10 blocks; incoming derivation, all equations and prose, decorated foot; no figures |
| 200 / 188 | PASS, sole finalize | 27 / 27 | 28 | 16 blocks; exercise heading 32, complete questions 1-8, one figure 135 and separate caption, unit heading 51, all prose, decorated foot |

Both complete printed-line inventories were visually frozen before drafting and exactly match the final page JSON's text lines. Total: 52 distinct printed rows, 53 text-object lines.
Prepare: once per page. Finalize: once per page. Page 199 vectorize: not applicable, no figures. Page 200 vectorize: once, only new figure 135, PASS, machine-reported mismatch 0.044%.
Both FIRST audits: zero normalizations, unknown characters, KaTeX warnings, errors and errata. No FIRST failures, repairs, retries or gate replays.
All printed numbers, formulas, historical/scientific wording and punctuation were retained; no scientific correction or new errata. No genuine underdots or body bold were present. The visibly bold unit title is an h3, not invented body emphasis.
Source `tg`, vectors, equation numbers (3)/(4), and the hollow `。` after `位置` on page 199 remain intact.

## Figure And Layout

Figure 135 is exactly one panel: stippled block on a marked inclined strip, left vertical hatched support, horizontal hatched base, one rightward horizontal force arrow and vector F label. No extra labels, dimensions, subpanels, or answer arrows.
Frozen coarse native box: `[830,755,585,400]`; FIRST snapped box: `[839,757,569,392]`, 234 components. The sole finalized-crop read confirmed the whole apparatus, label and arrow, with the separate caption excluded.
The separate caption `图 135` genuinely shares exercise 5's fourth line, `135）. 试确定物体的加速度. （摩`. Its `samerow` is preserved by an open/cont split of exercise 5 around transparent figure/caption objects.
No images or figures on page 199. Both decorated printed footers are `foot` objects, not body prose.

## Exact Image Budget

Five image loads in this context, against limits 8 per batch and 24 per context: page199 grid, page199 ungrid, page200 grid, page200 ungrid, then the sole native figure135 crop.
Whole-page loads: 4. Native crop loads: 1. Same-file reopens: 0; the two ungrid rereads and crop reread are still counted as separate loads. Remaining capacity: 3 batch / 19 context. OCR: 0.
No old pixels, old drafts, page198, page201, figure134, SVG preview or comparison raster was loaded. Frozen file copies and tool-internal pixel processing do not add image-bearing model messages.

## Current Tail And Boundaries

Incoming physical 198 is UNKNOWN and uninspected. Page 199 starts `p cont` at `$0=-m|\vec{g}|\cos\alpha+|\vec{F}_2|$，`; no predecessor text or closure is inferred.
Page 199 tail: `后，就可以根据公式(4)确定 $\mu$.`, complete, not open.
Page 200 starts a new exercise group 32 with eight complete questions. Exercise 1's figure134 reference remains external and uninspected; this report does not claim book-wide figure closure.
Supplied TOC n51-at-physical200 was only a locator, never expected source wording or an answer. The actual pixels independently show `51. 物体在气体或液体中降落`.
Current page200 tail: `是，物体只要一开始运动，就出现阻力——流体的摩擦力；它`, marked `p open`. Outgoing physical 201 remains UNKNOWN. Unit51 is incomplete; no lesson assembly or publication readiness is claimed.

## Hash-Bound Named Evidence

Each relative name below is under the roots declared above. SHA256 values are full digests. FIRST.json binds the original author MD, template, layout, source PNG/grid, PDF, profile and tool hashes before the sole finalize; RESULT.json binds the actual FIRST output and command receipts.

| Named file | SHA256 |
| --- | --- |
| Source PDF `8p 苏联中学课本 物理 八年级.pdf` | `4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46` |
| Work `0199/page.png` | `36368aa3d85cb39ff75da400efb61d1163b09867c814c0161c1a0daf4c857e6e` |
| Work `0200/page.png` | `d3508f5403b4270881509b8e76f17b4d7e3b5ac54bef196eb8ff2b99b349cb83` |
| Evidence `source-observation-0199.md` | `f1ef43dd6c5b3dc061f0bdb283a04135069a2ab4171026744cc09c35f6513d38` |
| Evidence `source-observation-0200.md` | `88cc62b1aa3509101b5cb02d30aa1bda53c490753d419f5b1e3b173811463aef` |
| Artifacts `0199/page.md` | `b9d04aaa593337ec3a1a5ef1100e805fd4f035022e8b697308f19b85c170818c` |
| Artifacts `0199/page.json` | `c35ef236debd613dd8091f6918256ebba5120c266ba6b95456543c86af736979` |
| Artifacts `0199/audit.json` | `16e1c07a8dd47de25f0274d56d9e563b5a56b53e20aefa82949b164a7ec7f782` |
| Artifacts `0200/page.md` | `17d67cd100b48b592c6a67b1d8ce2ef28c9d8a719c8d96b5cddbfac201ff51e9` |
| Artifacts `0200/page.json` | `663d744699ef22ec2d92cd25191ec8b40af9f2c7ed71a6c6238b34724786b1b3` |
| Artifacts `0200/audit.json` | `4ba1ab3cdf9b34cfbb8685ead8062b50b2fd41cb28754b10ad1584ddb18b1c04` |
| Work `0200/figures/fig-135.png` | `e35603e71aae592ce0123f276071087eac27e9c929afb39dfc35fb1327ff9b16` |
| Work `0200/figures/fig-135.svg` | `c443eb674783fa2896d8747dfbe27b560d45d0f0457722db9ff57f0cbf7a62fe` |
| Evidence `first-0199/FIRST.json` | `b3d94e80ecb602fc0664e1639b419226c42aa32538ece8d97dd674896b2dc6e6` |
| Evidence `first-0200/FIRST.json` | `46ae769972de4c88d3dba45105beaecfaa41fe7a1ef2fd4e55659f51174bbdf2` |
| Evidence `first-0199/RESULT.json` | `fed60cb98bc075979d8161ab658ffe4d2817a6078a9ce84a185fd2d8b4590cdc` |
| Evidence `first-0200/RESULT.json` | `a753b830d1d75d535780012f9f188c8abaaaa6faba3e003fd7efdb2e9da65586` |
| Evidence `image-receipt.json` | `d3c084a28a73a0796b46179962fcda7d62bb52c5152e17e67dd51e4d313b77d7` |
| Evidence `delivery-receipt.json` | `303562ecd8db24403551e447b1f0ef03104462d9401e2c421c0c94056e5b6f4c` |

Recorder receipts: `tmp/commands/b61-author199200-{prepare199,prepare200,first-finalize199,first-finalize200,first-vectorize200}.{call.json,stdout,stderr}`; exact command arrays and stream hashes are bound in RESULT.json and delivery-receipt.json. All shell commands after the sole unwrapped recorder read used unique recorder labels and the specified Python path with `-B`.
A read-only format lookup returned exit2 because `tools/page_md.py` does not exist; it was retained in recorder evidence, not hidden or retried. Actual `blocks.py` was read separately. This was not a SOURCE FIRST failure.
Only owned new page artifacts/work, unique evidence, the named report, and recorder-managed uniquely labelled command evidence were written. Tools/profile/charter/shared index/other authors were not changed. No freshness, setup, oldPASS, OCR, assembly, modern edition, answers, choices, DB/backend, Git or publication.
The final `b61-author199200/report-receipt.json` binds this completed report, delivery receipt and the recorder inventory. It is a textual hash seal only, not a production or gate replay.
