# Numeric Subpart Layout Repair

STEMROBIN-184. Parent-requested targeted layout correction; no prepare/finalize.

The initial six template files were copied byte-for-byte into:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/geo910-modern-latin-initial/`
with separate `geo910-c1-s1-n1/` and `geo910-c1-s1-n2/` directories. The original author report and its failed-check record are retained unchanged.

Only the eight exercise texts listed below and their corresponding `lines` arrays changed. At each original subpart line start, the Latin prefix was replaced by the equivalent original numeric prefix followed by the same ASCII `)` and space. All33 subparts retain exactly the same following characters, formulas, punctuation, order, and line breaks. No source expression or field declaration changed.

The complete before texts are in the saved `exercises.template.json` objects named by `number`; the complete after texts are in the matching current prepared template objects. UTF-8 text-string hashes bind those exact before/after texts independently of JSON formatting.

| Lesson / Task | Exact Prefix Mapping | Before Text SHA-256 | After Text SHA-256 |
| --- | --- | --- | --- |
| n1 / 2 | `a)..j)` -> `1)..10)` | `6f2d8fafe008b02569942d5bc5a23555f0c52b6a17677de00ff58963b6375111` | `913569e95826ac4adfbd32bbe7f13656ec332e29401640e59186715f983ab86e` |
| n2 / 3 | `a)..f)` -> `1)..6)` | `8372d5adb1564186e7f5413f6175a730cb20846b71e478c9f508fa7af4cbb538` | `6c383bb6695cf9665d40fbf580edc3b70f27b4070703411deb8384e5e3f6f873` |
| n2 / 4 | `a)..d)` -> `1)..4)` | `beca42989bb365d167cc842e73bf00e3f63ce41dd1187757b4ced80ecdc43016` | `1f1e1134e8aaa43cf520e1589fdd717ec798e53d4fa8f61e32906c858c4364ac` |
| n2 / 5 | `a)..d)` -> `1)..4)` | `37490b6cc0c72aca16dbba429bfd353edb6a54270b914b83617763de50c335a6` | `8a5b0e98566d141abbc35649b079c92f13c637781ec01865eed9a64373eba702` |
| n2 / 6 | `a)..b)` -> `1)..2)` | `6ac14cad3cb3f53afdc89af50875a86849e34fb125f895416b09d618df2444fe` | `f79a6f15cab96031313d2d3737d2b7a72a087dd137fa305eedacbd8e706182e6` |
| n2 / 7 | `a)..c)` -> `1)..3)` | `aa4b8a8c574f1afe489849c67e4c28db20f3533282b633df88fc1ecbe91d6efd` | `844b03ff1b1e364598fa435f2ba5659457565f4b7ba91c82e9be4511ca9342fc` |
| n2 / 8 | `a)..b)` -> `1)..2)` | `ca566d65f6a37f4d734d5459a8cd3e86a554fa4409e7b6219afc161163542256` | `5c941e2f849156e538bec992983cd2a51341165730b779639363c4e495ef2d92` |
| n2 / 10 | `a)..b)` -> `1)..2)` | `69a2e145a5f59e3ba305e4251063deed51c17e6c647a8a392c8b9ae642b56ad4` | `89752eb90ee5c307406c715ad25ba841866ccad54c61e8576edcfe59f1942ea8` |

## Protected Equality

Structured comparison of each saved/current exercise document after deleting only each exercise's `text` and `lines` is exactly equal. The seven unaffected exercise objects are also exactly equal without deleting fields. Both lesson files and both figure manifests remain byte-identical to the saved copies. `lines` equals `text.splitlines()` before and after for all changed objects.

Protected SHA-256 uses UTF-8 JSON with sorted keys, compact separators, `ensure_ascii=False`, and only `text/lines` removed:

- n1 exercises: `acd605c771e55988ccc5e67552e563b3552af163b48810d384df2cb76873e1f1`
- n2 exercises: `c2bdabe2e0a71eaf7f56e00f85f11b481552c25fea8287ce891ad788a45f9cd7`

File byte hashes:

- n1 exercises before: `d64073372027dd0382f0f85ce7cfcfcb4159c06d0fa90c6d083469af810d4ceb`
- n1 exercises current: `6861f0ac6c88e14c9674d87dfbd5fed8eb04d4be446fc25673b6262f87581383`
- n2 exercises before: `42f0a1348317c44115a381f4679d54dffee66d32e50a1c14a56d8342a4282530`
- n2 exercises current: `f267f55cd243f4123a2d1195f1bcb7f77614fbf1b2e32f987be8c6f11ebdf301`
- n1 lesson unchanged: `df3109b37d80ea76a9209f0456e86a33bc2930ecf3a125cb86caa6e58ca16ad5`
- n2 lesson unchanged: `b27482f669ed847457a0da47eb19062efed18937d01f6bbf95921ef28a41fa32`
- n1 figures unchanged: `95cdb4f56814a27d280a759ceaf79745006b03fc20820b1a39b8aaf36336d1b6`
- n2 figures unchanged: `f2fc95cb6dcb93a7499e5cbe1e8decab2fb5714b4ae42fa05c327c0edc5fd1d1`

## Existing Check, Once

Ran read-only `edition.validate_text` once on every current lesson/exercise text after this correction: `validate_text_errors=[]`, status `pass`, process exit0. The existing `normalize_numbered_subparts` also leaves each of the eight corrected texts unchanged, confirming complete natural-order numeric sequences with one subpart per line.

The previous eight marker-number errors are historical evidence, not current blockers. Numeric source smallpart labels are valid modern markers; no tool patch is needed for this package. This limited text check is not independent semantic review or adaptation finalization.

No other template edits, tool changes, source corrections, answers, choices, render, DB, or promotion.
