# FIRST source review exact bindings

Review date: 2026-11-23. All paths below are relative to the exact absolute root:

`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`

SHA-256 values describe the bytes actually inspected or identity-hashed by this reviewer. They do not invent execution-time stream/output hashes absent from the retained receipts. Scratch image/assembly paths are historical observations in Markdown, not durable JSON dependencies. The original durable PDF is the source identity; no PDF rerender or additional page inspection occurred.

## Frozen Inventory

| Exact path | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c1-s2-t1/source-review/first-source-inventory.md` | `3fa446addbb520b4c06d7a6cf8b233f6c75dc3abd67a944d4e64ac207c87db27` |

Inventory permission at freeze: `0444`. Written and frozen BEFORE candidate comparison.

## Source Identity and Rules

| Exact path | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/sources/soviet10years/8p 苏联中学课本 物理 八年级.pdf` | `4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46` |
| `.tmp/ld-s10y-lesson/8p/pages/0054/page.grid.png` | `51128c95d801dff00b8c1027d9c17f97516bb20d975a5a1adc715b7ba5bf97ed` |
| `.tmp/ld-s10y-lesson/8p/pages/0054/page.png` | `094fc0f6b63da572c908110155b9fc56e638995d6febaf612ad8280dc09d9e02` |
| `.claude/skills/ld-s10y-lesson/SKILL.md` | `e176728cf431fd01fa57f284ff8945f5e88dc97ff2bdc7d791aa838e64e5c8fc` |
| `.agents/skills/ld-s10y-image/SKILL.md` | `c0f7f9b7ab9203195a54fd35f812db4313dd242c31e47ef6ece4b38f46197f32` |
| `.claude/skills/ld-s10y-lesson/references/production-resume.md` | `13b89b436d595d08af0d5d5408a74bba552807d025973de5cb5857d3b25bb9a9` |

Only `page.grid.png` was visually opened. PNG/PDF hashing does not count as image loading. Source page identity is physical 54 / printed 42; image dimensions 1695 x 2580, metadata DPI 300.

## Current Durable Page and TOC

| Exact path | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0054/page.md` | `ecf07a7972d2a007bd7f4c39aad51088510b75f592c1b63bddc9107c6da9ce99` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0054/page.json` | `86aa31fee9d54ef3e135675206b5762456881dc8f30ef744da51e359ce9dc067` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0054/audit.json` | `17ba2e6ddf5bc221b1375c0c9a02e1dfdee3f640814a5adff5757e30dae34248` |
| `ssot-resources/soviet10year-textbooks/toc/8p/zh.json` | `12799b8b9e414dc4b8ca9fc246cd146a18886a7751aca91aaf9c9618d434baa8` |

TOC content inspected: relevant ancestor metadata/numbering note and the selected adjacent leaves only. Selected entry: `contents[0].lessons[1].topics[0]`; next boundary: `contents[0].lessons[1].topics[1]`.

## Retained Original First Failure

| Exact path | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0054/source-finalize.execution.json` | `1a52c6201bfa6425dde1c90f9f6aee95e12ac5f7cadc36339cfa03d135e12d5a` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0054/source-finalize.stdout` | `0a6114882b8fb85b6b3712f2cebba7bb570358f7367a38aa4821bdb70fa94f51` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0054/source-finalize.stderr` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0054/finalize-first-failure/page.md` | `d4dca516e3ab0eb6e78851164bfec82ca4d54f6917d8b7f98da167cac92d5c86` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0054/finalize-first-failure/page.json` | `c55c622edc7bae33f4b3e94f2e51fa564693ec5142ba02f93d05ac380f3e8b1d` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0054/finalize-first-failure/audit.json` | `9c11079f29a123191ee1de8f84cfe64ab6405bfc963ffa6f20ad57af4db2e49e` |

Execution facts: root above; argv is that root's `.claude/skills/ld-s10y-lesson/.venv/bin/python`, that root's `.claude/skills/ld-s10y-lesson/tools/p2c.py`, `finalize`, `--book`, `8p`, `--page`, `54`; exit code 1. The original receipt records `2026-11-23T05:19:39.710Z` through `2026-11-23T05:19:40.269Z`. Relative stream paths resolve beside the original execution receipt. Original failure: printed 22 / block 21.

## Retained Counter-Recovery Receipt

| Exact path | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0054/finalize-counter-recovery/execution.json` | `68ae5964a49ed7683dba9e16f0dbcda30e8f3e48884b108bc401c523a1585040` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0054/finalize-counter-recovery/stdout.txt` | `9e724dc72ae8dfd7a7f29ec4586468fb5716c9dbb7cbb0397744f68b3c7bbf7b` |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0054/finalize-counter-recovery/stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

Execution facts: same root and argv as original; exit code 0; phase `finalize-counter-recovery`. Relative stream paths resolve beside this recovery receipt. Recovery stdout: 11 blocks / 21 block lines / 21 printed lines; no figures; technical success. No current candidate output hash is recorded inside that receipt.

## Complete Selected Scratch Assembly

| Exact path | SHA-256 |
| --- | --- |
| `.tmp/180-7-intro2-assembly/8p/lessons/phy8-c1-s2-t1/lesson.json` | `5d6be59edd0be157e3b8f23585c952d3d3776f3e90644b1a3fa8fd3b826b66d3` |
| `.tmp/180-7-intro2-assembly/8p/lessons/phy8-c1-s2-t1/lesson.md` | `1549b53d530ab569eaae25611f8444499d02ec0eded5a8ffcca0dde494c37fae` |
| `.tmp/180-7-intro2-assembly/8p/lessons/phy8-c1-s2-t1/exercises.json` | `a2c54919ed9a3357266b16bd2cd0a4a1e86a3e4e51e6b8e97c142dc421f8d495` |

Reviewed owner: `phy8-c1-s2-t1`. Prose source references exactly `p0054#3`, `p0054#4`, `p0054#5`. Counts: 3 prose paragraphs / 9 original print rows / 2 inline formula occurrences / 0 exercises / 0 figures / 0 scientific footnotes. Right boundary: exclude `p0054#6` (`11. 变速运动的速度`) and every following block on this page.

## Read-Only Comparison Result

The local read-only assertion command exited 0. It verified matching MD/JSON metadata and all 11 source blocks; selected title/chapter/owner/start-page metadata; exact concatenation of each selected source block; identical assembled MD/JSON prose; zero-exercise ownership/count; and original/current page JSON equality after changing only the original introduction kind from `h2` to `h3`. Separate MD and JSON diffs confirmed that sole difference. Diff exit code 1 means that actual heading difference, not a failed review.

No source-image reopen, counter-code review, pipeline invocation, file promotion, Git operation or publication occurred. These hashes bind this FIRST source review only.
