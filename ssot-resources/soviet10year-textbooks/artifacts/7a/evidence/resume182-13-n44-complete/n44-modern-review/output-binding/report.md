# N44 Final Output Binding

Ticket: STEMROBIN-182. Date: 2026-11-19.
Checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Branch: `codex/STEMROBIN-182-textbooks`.
Observed HEAD: `bf7d8a1cc29d492b89cce112e090d0f21d265083`.
Exclusive writes: `resume182-13/n44-modern-review/output-binding/`.
Paths below resolve under
`.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/` in this checkout.

## Decision

**PASS: finalized outputs transport the exact Stage 2-approved candidate.**
For `lesson.json`, `exercises.json` and `figures.json`, exhaustive structural
comparison finds only `/status: draft -> ready`. There are zero normalization
text changes, no changed source refs, no new mathematics or question conditions,
and no section-anchor drift. The final audit independently matches the outputs.
No defect was found in this affected output-binding scope.

The complete Stage 2 source/math/knowledge/question-condition approval and
Stage 1 coefficient judgement are reused. Neither was reviewed or solved again.
All Stage 2 evidence remains unchanged and 0444.

## Exact Outputs

Output directory:
`n44-source-stage/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s3-n44/`.

| Output | SHA-256 |
| --- | --- |
| lesson.json | `5d2ba0da5bef44af9b1d5880f3ff16b42703c9c45a06f8ef6957b9b3d58a6e04` |
| exercises.json | `3ce1d1c18854e9be5b485ea4a2ee43b72c141bc30a84ead690b7b2c9c4317ec0` |
| figures.json | `38e5c165b41465c37ea2a3af0185168055b10338507776d7cebeda71cc03f75b` |
| adaptation.audit.json | `c886ccc01981b651157f807ac617a449c0d648b91e7569a5d801be8816bad0c1` |

The three current WORKING templates still match the exact hashes approved
in frozen Stage 2 `review.json`, SHA-256
`8f1b1c8333b3589189c7020def9fcde4e97b056ff2015cb5a154439bfce4f0bc`.
Parsed documents deep-equal their corresponding output after removing only
top-level status. This proves transport of all 78 prose objects and all 15
complete exercise objects, including text, lines, identities, source refs,
groups, source snapshots, labels, formula attachments and erratum metadata.
The Stage 2 counts of 202 formula spans and 63 Latin subparts are transported,
not newly revalidated for mathematical or semantic correctness.
Empty figure data is preserved exactly.

## Paragraph And Source Anchors

Existing read-only `htmlfrag.proseOutline`, `proseFlow` and
`sectionBreakIndices` produce exactly the approved outline and flow:
78 source prose blocks, 80 final paragraphs, same text, block indices,
within-block positions, source refs and printed-page metadata.

Zero-based source-block to final-paragraph mapping:

| Source block | Final paragraph |
| --- | --- |
| 0-15 | Same index |
| 16, `p0260#1` | 16 and 17 |
| 17-52 | Block index + 1 |
| 53, `p0262#9` | 54 and 55 |
| 54-77 | Block index + 2 |

These are the already approved internal splits, not new finalization edits.
Every before/after section anchor still resolves to its unique adjacent
paragraph pair. The final audit's complete `resolvedSectionBreaks` array
equals the actual output parser result and the approved boundary indices.

| Final paragraph index | Before / after source blocks | Before / after source refs |
| --- | --- | --- |
| 12 | 11 / 12 | `p0259#7` / `p0259#8` |
| 13 | 12 / 13 | `p0259#8` / `p0259#9` |
| 16 | 15 / 16 | `p0259#11` / `p0260#1` |
| 30 | 28 / 29 | `p0260#13` / `p0260#14` |
| 36 | 34 / 35 | `p0261#5` / `p0261#6` |
| 46 | 44 / 45 | `p0261#15` / `p0262#1` |
| 50 | 48 / 49 | `p0262#4` / `p0262#5` |
| 53 | 51 / 52 | `p0262#7` / `p0262#8` |
| 66 | 63 / 64 | `p0263#5` / `p0263#6` |
| 73 | 70 / 71 | `p0263#12` / `p0263#13` |

`report.json` binds both exact text sides of each anchor with SHA-256,
in addition to hashing the full output files. No concept/knowledge
reassessment or source-stream reconstruction was added.

## Receipt, Audit And Provenance

Existing `stages/n44-adapt-finalize-FIRST.receipt.json` is reused:
exit 0, started November 19, 2026 at `06:20:09.407Z`, finished
`06:20:09.878Z`. Its cwd and stdout/stderr hashes match. No producer rerun.

The audit matches an independently derived expected object:
status pass, 78 prose blocks, 60 changed prose blocks, 15 exercises,
15 changed exercises, 10 exact resolved boundaries, one erratum, zero figures
and an empty errors array. The changed counts are relative to RAW source;
they do not mean that finalization changed 60 approved prose blocks.

Current RAW lesson/exercise SHA-256 values still match Stage 2, as does
source page 262 SHA-256
`38064a0691c0a820b753865b66cb1a4f8ec4e671a3bf2e2b0b6edf14b276af29`.
The final embedded source bindings and `p0262-math-1` object are unchanged
from the approved WORKING lesson. The reason-only P3 resolution and exact
coefficient correction are transported, not adjudicated again.

## Preservation And Stop

Only read-only transport assertions and file hashes were executed.
No images, source/answer re-solving, full modern re-review, normalization
command, producer rerun, global tests, promotion, network/environment/DB/app/
dependency operation, shared-code/source/template edit or commit.
No Stage 1, Stage 2, author FIRST or producer evidence was overwritten.
New report and hashes are frozen 0444 in `output-binding/`.
Work stops; parent promotion remains afterward.
