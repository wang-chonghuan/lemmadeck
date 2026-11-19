# STEMROBIN-180 / b59 / FIRST Independent Literal SOURCE Review

**FIRST verdict: FAIL.** Physical168 fails exact underdot representation; physical169
has two omitted characters, a sentence stop changed to a comma, and the independently
confirmed disclosed missing terminal space. All remain unrepaired. This is a literal
SOURCE review only, not scientific, edition, publication or course-completion approval.

Date: 2026-11-17. Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Only this new report and the new
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b59-source-review168169/`
were written. No other work was edited or reverted.

## Findings

The references below address the unchanged current MD under absolute artifact prefix
`A = /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b59-friction/artifacts/8p/pages`.
Block numbering is one-based; row numbering is within the block.

| ID | Location | Literal pixels | Frozen/current MD and JSON | Judgment |
|---|---|---|---|---|
| F1 | A/0169/page.md:74, p0169#5 row4 | `察到在液体中是没有静摩擦力的.` | `察到在液体中是没有静摩擦的.` | Omitted `力`. |
| F2 | A/0169/page.md:93, p0169#10 row1 | `液体或气体中的阻力不同于干摩擦力.` | `液体或气体中的阻力不同于摩擦力，` | Omitted `干`. This is visible source text, not a physics-based correction. |
| F3 | A/0169/page.md:93, p0169#10 row1 | `干摩擦力. 它不仅` | `摩擦力，它不仅` | Sentence stop and separator replaced by a comma; independent of F2. |
| F4 | A/0169/page.md:94, p0169#10 row2 | Printed sentence ends `有关.`; next row begins `当速度` | Row ends U+002E with no U+0020; direct join is `有关.当速度` | Disclosed issue confirmed independently. Required line-end separator is missing; FIRST remains unrepaired. |
| F5 | A/0168/page.md:52, p0168#1 rows2-3 | Underdots on `当速度的方向改变时` and `摩擦力的方向也改变`, not punctuation | Both MD/JSON lines are plain text; meta.notes only says the two lines have dots | Exact spans and literal emphasis are not represented in the typed block. The note acknowledges the source but does not reproduce its span-level typography. |

F1-F4 are already present in the original manually authored FIRST169 MD. F5 is
already present in FIRST168 MD. Read-only diffs show only subsequently generated
frontmatter/count/figure metadata, snapped boxes and image-reference lines; no prose
repair. MD and JSON agree throughout: agreeing representations can share the same
source omission.

All other Chinese wording, numeric tokens, printed row breaks and visible heading/
caption text were compared against the separate original-page views. No additional
literal wording difference was identified. Chinese commas, colons, parentheses and
question marks use the candidate's ordinary transcription forms; F3 changes the
punctuation category, not merely its width. No displayed equation occurs on these
pages; no formula was invented or scientifically checked.

Bold `练习 24` and `42. 物体在液体或气体中运动的阻力` are retained as
`exhead` and `h3`, respectively. No separate prose bold span was established from
the original views; underdots are not silently reclassified as bold.

## Frozen Inputs

Before any image view, all18 files in the four candidate page directories, the
existing author report and all39 `b59-author168169-` scratch/receipt files were
copied byte-for-byte and SHA256-bound: 58 inputs total. Opaque hashing/copying did
not interpret MD/JSON before source viewing. Both complete originals were then
opened alone before either page's MD/JSON/audit or the author prose was interpreted.
A fresh source inventory was written before reading candidate text.

Evidence prefix:
`R = /Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b59-source-review168169`.
The manifest maps every original absolute input to its exact frozen absolute path.

| Evidence | SHA256 |
|---|---|
| R/input-bindings.FIRST.json | `a53b14634a9a5e297890831f139a5b033c4fa1068dec7cf1715c13de743c143c` |
| R/source-inventory.FIRST.md, complete independent original row/object inventory | `8c248b8012a579ce3ddbfe951c997bb23429b70452b41abc0225525bb78a3c55` |
| R/candidate-facts.FIRST.json, complete candidate row arrays/flags/audits/receipts | `29e6d7a11f3d1446a8f92119f4b8c868a0fc1f4ea218d006673aa298c028f8a5` |
| R/crop-attempt.failed-FIRST.json | `390665fc8ff611e85cc75bcf45005e74f33c0189fe042e4b67648bbe796daf16` |
| Original source-author-8p168169-b59.md, frozen in R/frozen/.intentfold/tickets/STEMROBIN-180/ | `df576260c316c2f7260a61202c8b4388d4f90053c08dbef57e11fbd2c3008d95` |
| Frozen manually authored FIRST168 MD | `abbf914d6f0f0f9cf9734d97c838490aa0cd3246afb05a27366064df07f01853` |
| Frozen manually authored FIRST169 MD | `2a2015e720b5e3891375bf4030aab57d12d6ac55c0a6af7cc7ca4a7650061b25` |

The source PDF SHA recorded in both candidate metas is
`4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46`.
It was not reopened or newly verified. No source-page identity beyond the bound
original PNGs is independently asserted.

## Full Block Inventory

Exact source rows are in R/source-inventory.FIRST.md; all actual candidate rows,
flags and null exercise ownership are in R/candidate-facts.FIRST.json. The complete
block inventory follows, including every figure/caption/footer.

| Physical168 / printed156 block | Kind / flags | Counted rows | Comparison |
|---|---|---:|---|
| p0168#1 | p cont, closed | 3 | Begins `有关.`; words match; F5 underdots are note-only. |
| p0168#2 | p, closed | 1 | Introduces the following table; matches. |
| p0168#3 | fig 表, tbl-p0168-01 | 0 | Full unnumbered prose table; no invented caption/owner. |
| p0168#4 | p, closed | 3 | Unlubricated surfaces, steel/ice and `0.04`; matches. |
| p0168#5 | p, closed | 1 | `摩擦力的种类目前还没有讲完.` matches. |
| p0168#6 | p, closed | 2 | Dry-friction definition; closes `摩擦叫做干摩擦.`; matches. |
| p0168#7 | exhead | 1 | `练习 24`; matches. |
| p0168#8 | ex 1, closed | 1 | Table/static-friction question; matches. |
| p0168#9 | ex 2, closed | 2 | Child, cabinet and Newton's second-law question; matches. |
| p0168#10 | ex 3, closed | 2 | Horizontal-surface force question; matches. |
| p0168#11 | ex 4, closed | 3 | `20` kilograms and constant speed; matches. |
| p0168#12 | ex 5 open | 1 | `600` newtons; tail `雪之间的`; matches. |
| p0168#13 | foot | 1 | `156`; flanking decorative dots not body text. |
| Total | 13 blocks | 21 | FIRST audit21/21; exact typography still fails. |

| Physical169 / printed157 block | Kind / flags | Counted rows | Comparison |
|---|---|---:|---|
| p0169#1 | ex 5 cont, closed | 2 | `0.005`, `100` kilograms; closes before42; matches. |
| p0169#2 | h3 | 1 | Exact numbered title42; matches. |
| p0169#3 | p, closed | 6 | Fluid contact, airplane/ship and resistance wording; matches. |
| p0169#4 | p, closed | 2 | Original `不存在有静摩擦力` wording retained without correction. |
| p0169#5 | p, closed | 4 | Raft/land example; final row omits `力` (F1). |
| p0169#6 | p open | 1 | Full-width experiment start; `(图 115)` reference; matches. |
| p0169#7 | fig 图 115 | 0 | Complete source figure; unowned by exercise. |
| p0169#8 | p cont, closed | 5 | Same experiment, wrapping left of figure; words/rows match. |
| p0169#9 | cap 图 115 samerow | 0 | One caption row shares preceding paragraph's final row; matches. |
| p0169#10 | p open | 3 | F2/F3 row1, F4 row2; exact last-row fragment preserved. |
| p0169#11 | foot | 1 | `157`; flanking decorative dots not body text. |
| Total | 11 blocks | 25 | FIRST audit25/25; four literal findings still fail. |

## Actual Figure Inventories

**Table:** current entire crop961x456, snapped source box `[330,579,937,432]`.
Two columns; one header tier and four data tiers. Left header is spaced `物 质`,
right `摩擦系数`. Top-to-bottom rows: `木头和木头 / 0.25`,
`橡皮和木头 / 0.75`, `钢和冰 / 0.04`, `钢和钢 / 0.20`.
Full outer frame, central vertical divider and one header/body horizontal rule;
no horizontal data-row rules. Irregular endpoints, white edge gaps and the lower
right frame discontinuity remain visible. No source label/value or full data tier
is clipped. The prose table is not assigned to an exercise.

**Figure115:** current entire crop300x264, snapped source box
`[1125,1660,276,240]`. Hand/fingers enter above-left and hold a narrow oblique
paper strip; strip approaches/reaches the small dark floating block at the water
surface. Oval bowl opening/rim, water/local ink marks, curved vessel sidewall and
dark bottom are present. No arrows, axes, scale or subfigure labels. No source
object is visibly clipped. The separate printed `图 115` caption is outside the
crop and correctly retained as `cap samerow`, not baked into illustration pixels.

Both current SVGs are byte-bound, have matching961x456 /300x264 root viewBoxes
and one path each, with no embedded image. No SVG was rendered or reopened as an
image in this review. Existing FIRST mismatch receipts remain table0.152% and
figure1150.000%; these are retained mechanical observations, not new raster
verification or literal-text approval.

## Object Boundaries

- Incoming167 is **user-supplied TEXTONLY, pending source review**:
  `而与物体的速度` + current168 start `有关.`. The textual join is
  `而与物体的速度有关.`. No167 image/artifact was inspected; no167 approval or
  complete pre-title lesson ownership is assumed. Candidate notes saying167 was
  not supplied describe the author's earlier context, not approval in this review.
- Exercise5 is `p0168#12 ex 5 open` -> `p0169#1 ex 5 cont`, closed by
  `的最大重量是多少？` before `p0169#2 h3 42`. No part is reassigned to42.
- The experiment is `p0169#6 p open` -> figure115 -> `p0169#8 p cont`,
  closed at `才能使它运动.`. One full-width plus five wrapped rows belong to
  one paragraph; the same-row caption does not add a counted row.
- `p0169#10 p open` remains open after exact `它和速`; no next character,
  next-page text or section completion is inferred.

## Actual Image Ledger

Fresh review inherited0 image payloads; user-reported parent usage21/24.
Exactly **4/8 actual images** loaded, with0 reopens and0 old HOLD images.
Each path is `R/frozen/` followed by the relative work input shown below; R and W
are absolute prefixes, not image attachments.

`W = /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b59-friction/work/8p/pages`.

| Order | Bound current input | Actual view | SHA256 |
|---|---|---|---|
| 1 | W/0168/page.png | Original alone before text | `1ec7435d5d65e01309005501fd9f9dfe47239f6d55241d5a79242757f8c7c2f0` |
| 2 | W/0169/page.png | Original alone before text | `f713bf5091b45d38b3b31ef7cf80b0c49c43e861e6efc54fba68e32792b99f39` |
| 3 | W/0168/figures/tbl-p0168-01.png | Entire current table | `b9fd67d38d1a35112958c4e4cccc2be04b5fc4fc307dc0affacf1f9c63c4827c` |
| 4 | W/0169/figures/fig-115.png | Entire current figure115 | `4bf3872ae4b875caa8010a78eb8995161e864578390b6599e67439b72300b4ea` |

R/images-ledger.FIRST.json records exact absolute paths/dimensions/order. Grids,
SVG previews,167,170,172 and older HOLD images were not viewed.

The FIRST attempted optional detail-crop command could not start: local
`.claude/skills/ld-s10y-lesson/.venv/bin/python` does not exist; exit127, exact
stderr retained in R/crop-attempt.failed-FIRST.json. No detail crop was created or
viewed. No installation, alternative interpreter, rerun or retry was attempted.
The four completed views above are the entire actual visual evidence.

## Complete Page File Hashes

All18 hashes match the existing author inventory and the pre-view snapshot.
One read-only binding comparison observed no live input drift. No Git operation
or product test was used to establish that fact.

| Input | Bytes | SHA256 |
|---|---:|---|
| A/0168/audit.json | 417 | `4f322ddb4b78aef38027367b8b8daa336a4660f16d8651aee28c2d8bf91ff91e` |
| A/0168/page.json | 5556 | `f2e561c9b2bdbf1e046f1ce96e017b971e139f882fb1c0abdbc9efc61d5daaef` |
| A/0168/page.md | 2876 | `b02ea2eddc106bd88f9e7918e7f8baebc5664a86780a735a057ad22e8d8c67a6` |
| W/0168/figures/tbl-p0168-01.png | 9564 | `b9fd67d38d1a35112958c4e4cccc2be04b5fc4fc307dc0affacf1f9c63c4827c` |
| W/0168/figures/tbl-p0168-01.svg | 64808 | `04ebbae5b7206c05c959d509e0b3f39f0669c2a80520a220548e912479dad64c` |
| W/0168/layout.json | 994 | `faeac8c9e61764884b4111fa721e193dd1129f114f935791fd44fb374f7c2703` |
| W/0168/page.grid.png | 116041 | `e328dd650c8b0600462418a2789a20d55e437fbb74779bbc4c14efea585ba5e3` |
| W/0168/page.png | 94316 | `1ec7435d5d65e01309005501fd9f9dfe47239f6d55241d5a79242757f8c7c2f0` |
| W/0168/page.template.md | 1439 | `e716c207d83d82a4ecdde25cd389cd4e5b5410068d8c66eca4d5b8f46441004b` |
| A/0169/audit.json | 419 | `479567d58e1a362ac6d001fcbbe6d0905d7abd690ea87e8e18fa7bae0746a533` |
| A/0169/page.json | 5768 | `c4e66d99dbab0eba4c48a15afeaebb87f9ae371d5df95403bf558156c0d12315` |
| A/0169/page.md | 3407 | `5bacd239275d755f1b3a9b1eeeca1c69600c893052c3b1915e2682f1cc1b389e` |
| W/0169/figures/fig-115.png | 3437 | `4bf3872ae4b875caa8010a78eb8995161e864578390b6599e67439b72300b4ea` |
| W/0169/figures/fig-115.svg | 17838 | `a7b3dfbf7f8ffc5cd1393c9aee48e683248016978a3b50e66773951d21fa85da` |
| W/0169/layout.json | 959 | `5e36b916b1d1f358b204963aa4eea1d0490a4a1386a0b268f07680f072762717` |
| W/0169/page.grid.png | 140641 | `4dbf6a9caafe03f29c09127c5c46bf9448582fa59e44acd9d734ffada3e69ffe` |
| W/0169/page.png | 116410 | `f713bf5091b45d38b3b31ef7cf80b0c49c43e861e6efc54fba68e32792b99f39` |
| W/0169/page.template.md | 1439 | `e2a948cecb1bad586be6925a4759adab5cfe2be3e5145f06d100b034bc1d0668` |

## Retained FIRST Receipts

The six original prepare/finalize/vectorize call files and their stdout/stderr
streams remain frozen, not rerun. All six original exits are0 and stderr streams
empty. FIRST168 audit21/21 and FIRST169 audit25/25, zero normalizations/errors,
remain precisely as received; they do not count source characters or emphasis.

| Original call label | .call.json SHA256 |
|---|---|
| b59-author168169-prepare168-first | `7ed9eddf3cbae5be8df32f5978e768af4a1fd727684b5a7bc0c92ae6db1771ae` |
| b59-author168169-prepare169-first | `763bd8e5e0739081093318100b7af162810f34e54d6f8b3be7299031b8e2fb9e` |
| b59-author168169-finalize168-first | `da5cb057f97eea47bde2eadf1f1401d64cd73f521eefff4d6409aad3c5f8f180` |
| b59-author168169-finalize169-first | `0483ca03cdf471aedcb63d6919de11dae9fa8276f95720e60d632c64db417d4e` |
| b59-author168169-vectorize168-first | `fd1a57b7177b9ad9b8e63b68c273340323c40c654fae2df1c8f1e18851002632` |
| b59-author168169-vectorize169-first | `c7c829f249735c36a711663d47c9b6fd0196db2f3fec17c0d4745c73076afc01` |

The manifest also binds the complete original author inventory stream
`b59-author168169-final-inventory-first.stdout`, SHA256
`64a45ea384ec49ffeba6f5c9574351a4585862239699d25c7f1dc0518b579007`,
and all other39 prefix files. R/verdict.FIRST.json retains this independent FAIL,
the exact source/candidate differences, expected diff exit1 observations and the
failed crop attempt. No FIRST finding was repaired or replaced.

## Stop

No freshness/setup/backend/Git/network/app/DB/publish/test/finalize/vectorize/
assemble/adapt operation was performed in this review. No source candidate,
author report, charter or another worker's record was edited. SOURCE FAIL is
retained; unresolved incoming167 approval and outgoing169 tail stay unresolved.
Return text/path/hash/actual-image-ledger evidence only. Stop after this report.
