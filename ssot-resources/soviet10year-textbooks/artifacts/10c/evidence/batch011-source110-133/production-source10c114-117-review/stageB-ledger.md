# STEMROBIN-184 book10c physical114-117: sole StageB ledger

Status: COMPLETE StageB; findings and instructions only; WAIT.
Date: 2026-11-17.
Workspace: /Users/yong/.codex/worktrees/a07e/lemmadeck.

## StageA preservation

Parent reported complete consumption before disclosure of the author bytes.
Both frozen files were hash-checked before StageB and never edited:

| Absolute path | Frozen SHA-256 |
| --- | --- |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117-review/source-first.md | 9c2f533056d786c8d61a6083e1fcdab99bba5d734b6548584e85e32eee893579 |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117-review/ledger.md | 9c4db0f998f404674822d5193e4e5f93f0c0defb750597f3dd122a3419239f7a |

## Exact disclosed author-text manifest

All six matched parent disclosure before complete `nl -ba` text reads. No template bodies or other author artifacts were discovered/read.

| Absolute path | SHA-256 |
| --- | --- |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0114/page.md | 4154404a1b95fd16a7c26bd4146a3edf7b7be8cc447f8b2278f7ecc3c4ae2a18 |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0115/page.md | 738aadb9fd349793726af5e93471885ca82c31534b5db59592a2e0942f16cccf |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0116/page.md | 126ddb92401a8fc6c157e114cedbc7d2fe47f4e897893ef9b5b9e582da1955f5 |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0117/page.md | 27ea375832fdf70f49245bc7c23da6c5fda9db0162cf5dfc4ab7ab8e433fade2 |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117/author-handoff.md | d43da50cb9ea70308861deef3a8ba967845062d121be9bb8a0807c55cd0dcba7 |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117/author-ledger.md | a0d761f59443cebc612111e32b534f4350655bad7721d72f9abdf4060e917e3f |

All parent-disclosed author files were fully consumed as text; their author-native-crop references were read as text only. No author crop, adjacent page, original reopen, grid, answer, choice, TOC or old review was opened.

## Original source provenance

All originals remain 1695 x 2580, as checked in StageA and confirmed during StageB native rectangle inspection. SHA-256 rechecked before crop creation:

| Absolute original path | SHA-256 |
| --- | --- |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117/10c/pages/0114/page.png | 2980fbc008cd2659ebe3d679425d8c06fa03a3ea31de4acf72e69f73362f730f |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117/10c/pages/0115/page.png | f995e5700f607944bca43d5e35bb8c0fae59142dedebe0ba97755299228f4891 |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117/10c/pages/0116/page.png | 8ccddcb95f5df74bf631aa8bb34274b6a0fca5fcd39b51158094395dfd3d1ac4 |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117/10c/pages/0117/page.png | 0cb266fa62ecab5b0d5587233b13ee77e817179dea55d252181ef3b97c4b20bb |

No source original was visually reopened in StageB. Pixel decoding to create/check a crop is not an additional original image payload in the model context.

## NEW essential native crop manifest

All four newly created here, under own review output directory; no author crop reuse.
Rectangles are native [x,y,width,height] in the above original.
Mechanical creation: `sips --cropToHeightWidth HEIGHT WIDTH --cropOffset Y X ORIGINAL --out NEW_CROP`.
No resizing, upscaling, binarization, annotation, combination, sharpening or reconstruction.
Before any crop visual open:

- `sips` confirmed all four exact output dimensions.
- `shasum -a 256` established all four output hashes.
- A read-only Pillow rectangle comparison confirmed each output's decoded RGBA pixels exactly equal the specified rectangle of its unchanged original: all four `exact_native_pixels True`; source dimensions1695x2580 and crop dimensions matched the table.
- No text/source file writes by that rectangle comparison; no lesson pipeline, counter, gate or test suite invoked.

| ID | Source physical | Native rectangle | Dimensions | Exact crop SHA-256 | Absolute new crop path |
| --- | --- | --- | --- | --- | --- |
| B1 | 0116 | [400,900,230,90] | 230 x 90 | 827f3fb16b870848e5651adc15114cacd0a95889f19d0a3c4deb70fb7160a336 | /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117-review/native-stageB-crops/0116-exponent-review.png |
| B2 | 0116 | [400,2050,710,110] | 710 x 110 | 9428edfe44434c808abde2a7852b94138596cd22004a16bd2614e35cbfd90d51 | /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117-review/native-stageB-crops/0116-title-review.png |
| B3 | 0117 | [300,1870,960,105] | 960 x 105 | 5f40358b52788d9f25d66b76d15adcdc5d5b7263e590030ed33baa6a530be7a3 | /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117-review/native-stageB-crops/0117-derivative-comma-review.png |
| B4 | 0114 | [500,1815,915,330] | 915 x 330 | 32e72cbb48eba3091462206713bcb7df85e72ea43f9e45c0100a58f07ab599a1 | /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117-review/native-stageB-crops/0114-equations-punctuation-review.png |

## Permanent visual-load ledger

| Permanent load | Stage | Image | One open / detail | Observed result |
| --- | --- | --- | --- | --- |
| 1 | A | physical0114 original | once / original | frozen StageA |
| 2 | A | physical0115 original | once / original | frozen StageA |
| 3 | A | physical0116 original | once / original | frozen StageA |
| 4 | A | physical0117 original | once / original | frozen StageA |
| 5 | B | new crop B1 | once / original | smallest exponent still unresolved2/3 |
| 6 | B | new crop B2 | once / original | title source character 茨 confirmed |
| 7 | B | new crop B3 | once / original | comma after F'=f confirmed; author correct |
| 8 | B | new crop B4 | once / original | equation(1)/(2) full stops confirmed; author correct |

Permanent batch usage: 8/8. Model-context visual usage for this reviewer: 8/24, with the stricter8 limit exhausted. StageB reserved crops: 4/4 used, 0 remaining. No reset or presumed clearance. Parent24/24 receives text paths/hashes only, never these image payloads.

## Text contract inspection and comparisons

- Complete six disclosed author texts compared with every frozen StageA printed row, formula, caption/footer/footnote, typed block and owner boundary.
- Read-only narrow contract inspection: lesson SKILL.md cap2; p2c.py import routing; tools/assemble.py `split_lesson` lines139-171; blocks.py block text/body mechanics. No assembler/counter/function execution.
- Confirmed exhead sets inherited exercise group, ex gets that group, p stays in prose; therefore physical116 shared directive's p typing is defective.
- All four author body files have complete manual row/block coverage in StageB.md; no missing/extra physical row claimed. The issue is semantic type, not a detector count.
- Parent-transported physical112/113 heading, example and exact tail were consumed as bounded text. Additive 极/限 owner splice supported; no earlier pixels opened, initial UNKNOWN in StageA untouched.
- F1: repair typed ownership of physical116 shared directive for419-424.
- F2: repair physical116 unit101 heading 兹 -> 茨 and corresponding current-observation record labels.
- F3: repair physical117 line61 comma after 被积函数 -> full stop, based on frozen StageA117.T17.
- U1: smallest nested exponent remains unresolved; no proved x^3-versus-x^2 source error and no algebra repair.
- Correct author punctuation confirmed in crops: physical117 F'=f comma; physical114 numbered equations1/2 full stops.
- Fine diagram joins/dashes remain qualified, not precisely reviewed or approved.

## Outputs and prohibition compliance

Only new manual text files:

- /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117-review/StageB.md
- /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c114-117-review/stageB-ledger.md

Manual text authored with apply_patch. New image evidence is exactly the four mechanical crops listed above.
No source edits, finalize, count repair, gate, assemble execution, math approval, vectorization, adaptation, answer/choice processing, tests, DB/publish/Git/workflow/SkillHost/other-chat actions.
No existing worker files or frozen StageA bytes changed.

COMPLETE StageB. Return full findings/repair instructions via StageB.md plus both exact new text paths and external hashes. Hashes are returned externally; this ledger does not embed its own hash.
WAIT after return. No further visual load or production action authorized here.
