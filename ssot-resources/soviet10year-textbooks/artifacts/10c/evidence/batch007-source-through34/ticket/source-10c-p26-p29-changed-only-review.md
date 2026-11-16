# 10c physical26-29: immutable changed-only source review

Date: 2026-11-16. Disposition: **PASS for the explicitly authorized changes
only. No new finding requiring REVISE.** This is not a new whole-page
source review, mathematical approval, assembly gate or modern-figure PASS.

## Scope and frozen prerequisites

The original-only geometry33-41 Stage A was completed before this review.
Its report remains unchanged:
`geo910-n11-n12-figure-review-source-first.md`, 27519 bytes,
SHA-256 `f8795a9129dc0524a6caa56be577ea14ec7c572ce9dd97f50357018e246476aa`.
No geometry-author inventory, spec, rendering or answer was read.

Reused complete source reviews, without repeating their content/pixel review:

| Report in this ticket's tmp | Bytes | SHA-256 |
| --- | --- | --- |
| source-review-10c-p27-p30.md | 32464 | f77f276f19b8df8a304c5716ae9509b035e93ae72d6f1ae053212da63de3623f |
| source-review-10c-p23-p26.md | 34506 | 715e04b011ea7256acc9a299e42bd1df02db9ca0f409f2b98fcf84475f3aa4b2 |

Stopped Banach repair handoff:
`source-10c-p27-p29-targeted-repair.md`.
Actual SHA-256 matches the parent's immutable disclosure:
`89aa0cb48bb446ba4993f7cfb6a99478535d43fd4aedc40e016ce1639d475d56`.
Evidence root: `source-10c-p27-p29-targeted-repair-evidence/`.
p26 evidence root: `10c-p26-phase-metadata/`.
All ticket-relative paths here are under
`.intentfold/tickets/STEMROBIN-184/tmp/`.

Read-only in-memory checks used `mcp__node_repl.js`, filesystem byte reads,
SHA-256, JSON parsing, structural comparisons and exact string/byte
comparisons. No original page or passed crop was displayed or decoded.
No prepare/finalize, counter, validator, test, renderer, browser, network,
Git, DB, index or other-chat operation was run. Only this report was written.

## p26: two errata, faithful source unchanged

The supplied `before.page.md` is an **exact reconstructed prepatch file**,
not a claimed pre-edit backup. Its actual SHA matches the original frozen
review. The JSON/audit baselines also match that review:

| Evidence file | SHA-256 |
| --- | --- |
| before.page.md | e8530f0b51790e9b0d127ae8a3c47fd9959c41d9db24815eb7336a2ee18ac71e |
| before.page.json | c4df28b46c4fc33ac3ff8ca228aa56b7c1a101377743a34b1bfad57d9d9c2c39 |
| before.audit.json | 797731462d5357d322b1c670970c24496ccac12d8f23fb19a369b82e0bf076c9 |

The complete current MD differs from that baseline by one insertion of
1045 bytes at zero-based byte offset1683, inside the formerly empty
frontmatter `errata` array. No old byte was deleted or replaced.
Parsed MD frontmatter equals current JSON meta. Resetting current
`meta.errata` to the original empty array restores the exact old meta.
The only JSON changes are the two new array entries under `/meta/errata`.

All body bytes, all ten JSON blocks and every pre-existing note, identity,
provenance, formula, flag, expected print total and figure inventory remain
unchanged. Equal MD body:1289 bytes,
SHA-256 `606f15356c372338b64f61793e7627f8e7da417a838c9f6d3cfa4dff0a32faf5`.
Equal UTF-8 `JSON.stringify(blocks)` in existing property order:
SHA-256 `5e261445c2bd3528854f92c62e7c223fa1c27e2bb7fa15d3c6b127d6feb0b203`.

Exact errata bindings, independently checked against the fourth block
(`p0026#4`, one-based block identity) and its two original line strings:

| Erratum id | Original span | Occurrences in block | Actual line |
| --- | --- | --- | --- |
| p0026-phase-coordinate-sign | `$\frac{v_0}{\omega}$` | 1 | 1 |
| p0026-phase-vector-sign | `$\vec{r}\left(x_0,\frac{v_0}{\omega}\right)^{*}$` | 1 | 2 |

Each full original line also occurs exactly once in the current MD body.
The two positive-coordinate source spans remain faithful and unchanged;
the coordinate span includes its math delimiters and does not accidentally
match the coordinate embedded inside the full vector span. No source minus
was inserted. No formula was corrected in the faithful blocks or footnote.

These page errata have no hash field at this stage; that is not a missing
binding repair to invent. The current MD/JSON SHA table below provides the
external source binding for this review. The supplied
`comparison.json.currentPageSha256` matches **current page.json**, not MD.
Actual comparison.json SHA:
`3241b6f6334e70ebc95039c7f95148b6e66e4d952350fcac160953522ddfcdd6`.

The only audit difference is `/errata`:0 ->2. All other fields are equal,
including stored23/23, empty errors, exclusions and figure arrays. The
parent's already-approved internal mathematical decision is reused only
as authorization for these metadata entries; it was not re-solved or
re-reviewed, and its answer-review report was not opened.

## p27: approved bottom counting exclusion only

Current MD/JSON adds exactly one `count_exclusions` item, absent in the
baseline: kind `scan-artifact`, box `[0,2460,1695,40]`.
The complete kind/box/reason item agrees among MD meta, JSON meta and audit.
There is no additional exclusion or changed expected-row field.

This box lies within the1695x2580 original and its bottom5% region
(threshold y2451). Classification of the broken bottom scan band reuses
the parent's authorized original-pixel diagnosis; this reviewer did not
repeat it or infer a missing source row from the counter.

Removing the new meta field restores the entire original JSON object.
All ten blocks, notes, exercise52-59 identities, formulas, punctuation,
boundaries and original source/render identity are unchanged. MD body
SHA before/after is
`f34978ff05b223c50047f9cb9c25110b9685f7195902430c0549c34c4729c71f`.
The frozen independent22-row observation and stored printed_lines22 were
not changed.

Only audit `lines_printed`23 ->22, `count_exclusions`empty ->one item,
and `errors`original count failure ->empty changed. The preserved before
audit still has23/22 FAIL and its complete original error; it was not
overwritten with PASS. Saved later stdout and current audit show22/22 PASS.

## p28 and p29: exact approved punctuation repairs

p28 whole MD is exactly the preserved MD with the single replacement
`得到；如果` -> `得到: 如果`. JSON differs only at `/blocks/1/lines/6`
(p0028#2, line7). This closes frozen finding B1 without other prose edits.

p29 whole MD is exactly the preserved MD with the single replacement
`伸长，当然` -> `伸长. 当然`. JSON differs only at `/blocks/0/lines/3`
(p0029#1, line4). This closes frozen finding B2 without other prose edits.

Both audits are byte-identical to their before files. All other block
fields, metadata, notes, source identities, footnotes/captions/folios,
open/cont boundaries, formula strings and their occurrence order remain
unchanged. The real formula-break marker on p28 is preserved. All math
strings on27-29 are unchanged in occurrence order.

The nine27-29 before triple hashes match the frozen Stage B table, and
every after triple is byte-identical to its current durable file. Thus
the initial27 failure and the original28/29 audit bytes remain retained.

## Original pixels, existing crops and untouched p30

Binary-only SHA checks confirm original26-30 PNGs match both their frozen
independent observation and current JSON `meta.render.sha256`:

| Original `.tmp/ld-s10y-lesson/10c/pages/` file | Bytes | SHA-256 |
| --- | --- | --- |
| 0026/page.png | 72478 | bf022335af80cf286a6b933ef4dc1dfc505726d130d92f9ee009bc6ffa83c55e |
| 0027/page.png | 73143 | 0a50daeabe59fed1935454ce84e6304733e20d808160221b061d3c0d115cf721 |
| 0028/page.png | 67271 | 9eb7f2e57bf285b8513e069a96ca9bd09951a669f537adff7bcff5a7b4fdc46d |
| 0029/page.png | 75441 | b81591ae8c5175ffaa0fe68a92a73bfd434a795612c57972879b8aa9ccce588c |
| 0030/page.png | 75496 | 0b15d5365ba87a2a8b6e089354e07ba4aa1acde1da5a571d528b534067d2dfe9 |

The actual already-reviewed crop files remain in the page scratch
`figures/` directories below; these are not claimed to be newly assembled
book-level figures. Each current file equals its repair-evidence
`before/crops/` file byte-for-byte and matches the original Stage B hash:

| Scratch crop | Bytes | PNG SHA-256 | Unchanged snapped box x,y,w,h |
| --- | --- | --- | --- |
| 0028/figures/fig-12.png | 10091 | a5970d8c13709475dcfd0fec39a8730bdf595686c2d8218e307b19e3507648a7 | [122,1429,1266,292] |
| 0028/figures/fig-13.png | 9861 | a30cdcdf8c7213a6d1544a427405f6e5ebd292cfc063383ae55345d79f22b989 | [125,1863,1266,288] |
| 0029/figures/fig-14.png | 11943 | fab7ca5f77d266a4f6b300f539a452bcc2ceac5fa6c08a4b8e9e6d358dd8e5bc | [327,1528,1087,610] |
| 0030/figures/fig-15.png | 9659 | 3e50483b4fdcdefe9c816d7f76a77cf0100d2fe8417c3821341883efac2084b2 | [201,244,1215,383] |

Unchanged PNG bytes establish unchanged decoded pixels without decoding
or displaying them again. Reuse the prior complete crop/pixel verdict,
including the specifically recorded fig14/15 isolated-pixel differences;
do not replace it with a claim of raw-original-rectangle equality.
Figure blocks (`kind: fig`), meta inventories and audit boxes/components/
ownership are unchanged. This review does not recompute any ink hash.

p30 MD/JSON/audit hashes in the current binding table match the original
frozen review exactly. Together with fig15 and original30 equality this
confirms the reviewed p30 artifacts are untouched; its original19/19 gate
is reused, not rerun.

## Saved actual gates and immutable current binding

Actually read the saved stdout files, not just the author's outcome labels:

| Page | Saved stdout/current audit | Blocks/figures | Recorded author exit |
| --- | --- | --- | --- |
| 26 | 23/23 PASS, errata2 | 10/0 | 0 |
| 27 | 22/22 PASS, one exclusion | 10/0 | 0 |
| 28 | 13/13 PASS | 7/2 | 0 |
| 29 | 18/18 PASS | 6/1 | 0 |

Exit0 and one affected finalize per page are recorded author/parent
invocation evidence, not independently observed executions in this review.
p26 saved stderr is empty. No gate was rerun here.

| Saved stdout file, relative to ticket tmp | Bytes | SHA-256 |
| --- | --- | --- |
| 10c-p26-phase-metadata/finalize.stdout.txt | 131 | c80d64be4bf525b84f330b130d4b7fab1f75d9e82047a9bd686947d7d7a0c8e0 |
| source-10c-p27-p29-targeted-repair-evidence/p0027-finalize.stdout.txt | 131 | 68a71f6915d8d8256115d19ec38aa2f3ee18b3138d1fa449e31cd89fa2b65e72 |
| source-10c-p27-p29-targeted-repair-evidence/p0028-finalize.stdout.txt | 222 | 7143717be6ccc742036ef643a3cf86180e4e7a05444b72dec4855d5fd8f7c353 |
| source-10c-p27-p29-targeted-repair-evidence/p0029-finalize.stdout.txt | 176 | 0637ad22dbcd87e1fc4716ccb511db6f3780d891db2fad47a615e2563d16ea14 |

Current durable root:
`ssot-resources/soviet10year-textbooks/artifacts/10c/pages/`.

| Current file | Bytes | SHA-256 |
| --- | --- | --- |
| 0026/page.md | 4127 | 416da0c9efec3abad4449116ce67dcfe9595c8c5fcc6fe71b6f55ef17b219bcc |
| 0026/page.json | 6318 | 48fe34d958ad9820a114999fc539a4d8c7ee5cae5f83d2507cf9b95253b2bc22 |
| 0026/audit.json | 203 | 5507e98ab4be7b1a1a8466d947f46aa9b2da9b5268f44687402becf2446ebc1a |
| 0027/page.md | 3060 | 61ee5d6328fcffb7f9915ad0c53fb81bed4b9f1c81a50cb4e8627f71b8e0a72c |
| 0027/page.json | 5226 | 76a630559110cfe27793ee968cc12123cb4ef6b989fe592c34b6ddda37de1652 |
| 0027/audit.json | 652 | 0ebfae5fd0372bb4da2b3f8d3239bdfe49c600e3bbd4bbf4b964846870c9d539 |
| 0028/page.md | 2658 | 6e88c23ce8896043c7c1c6d4e2f83e4c21189f98d93f3a993b8ff01179e8178f |
| 0028/page.json | 4232 | 24168270964f30b7bcf0011b9ba25b5d61d40be4c5ed9d4e951c288fe5a49c6c |
| 0028/audit.json | 682 | 05baa45a729bc7cd1aec81f1314743f8c57114806d444008fa5182a3c66eb97b |
| 0029/page.md | 2865 | 951d22ba52eb32664c3e67a8081d210e5ef8ff7b665becf81390752421604998 |
| 0029/page.json | 4282 | 7a0fd8bea14c36e1839f4c78ef2737d03bd8d2f6eb482720421c814ba01f5ccb |
| 0029/audit.json | 443 | fe104435cd6a29219832eb9f45a139bbe3b5942c3e7bd25e2490c7afa29236d8 |
| 0030/page.md | 2780 | 00fe5769d130c4646c28efb7e0442c33d3ba4afb6d16b473d0c104888221a251 |
| 0030/page.json | 4400 | 3e6b47b115f9c8de802da58f866db5d58611610d7c58351849220535405c2ee1 |
| 0030/audit.json | 656 | 31cebe53591fd3e196f5ac21e1ac9183fbae28c93c4b118ef648050abd64a56d |

## Limits and stop

Frozen source-glyph limits are unchanged: p26's tiny ink above A, its
10a-like suffix/code-point ambiguity and nearby vector ink; ex55's baseline3
followed by stacked1/2 is typography evidence only, not a newly solved
coefficient or amplitude approval. Other original glyph/crop ambiguities
and the prior cross-page boundaries remain as recorded. The two approved
p26 metadata errata do not erase the positive faithful source formulas.
No unknown was resolved by assumption.

The27 counting fix closes only the authorized extra-band metadata issue;
it does not establish missing text or retrospectively convert the first
failure to success. The28/29 repairs close only B1/B2. All original full
review reports remain historical and unchanged. No future page or figure
review was started. **Immutable changed-only review complete; stop here.**
