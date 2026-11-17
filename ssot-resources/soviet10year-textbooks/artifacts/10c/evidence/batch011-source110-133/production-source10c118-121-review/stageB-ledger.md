# STEMROBIN-184 - Sole StageB Ledger

Status: COMPLETE comparison; findings/repairs reported, not applied. WAIT.
Date: 2026-11-17.
Workspace: /Users/yong/.codex/worktrees/a07e/lemmadeck.

## Entry and Immutable Checkpoint

- Parent explicitly reported full consumption of StageA `eeeb8a7c...` and ledger `78d3f99d...`, including all seven image events.
- Rechecked full immutable StageA SHA-256: `eeeb8a7cb79689d9928c33232110bfacb80548f080188694130ada4a0ae015a1`.
- Rechecked full immutable StageA ledger SHA-256: `78d3f99d15e8e02ae219c8b894553da9de9252d3e724f2b2c1de88bd9c26bc4f`.
- Neither file was edited. No old full original or old crop was reopened.

## Sole AUTHOR Text Consumption

All six disclosed file hashes matched before comparison, and all six files were read completely with nontruncated text output:

| File | Exact SHA-256 | Consumption |
| --- | --- | --- |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0118/page.md | 6fcbd1c4b46eaf2069eab4ce8c4a3b773021a316817b97fbed0ae270d3daef22 | Frontmatter, all body blocks, foot read. |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0119/page.md | b65a1a1e553e9a739c805becbd1a44fe5dd4d8b885b2f3067850b27ba5ec7297 | Frontmatter/errata, all body blocks, figures/captions, foot read. |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0120/page.md | c8fd46d3bc4a853b001e60636ebf221de72cda61e427343c4a42d25dbd591764 | All frontmatter, exercises/shared headings, body, foot read. |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0121/page.md | 075db8247314fe9cbf7d4171d17edfbf8f6c760583d71c40fcc194a8a33ecbae | All frontmatter, claim/proof/conclusion blocks, foot read. |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121/author-handoff.md | 09e2afb5b8f39e24afa3c0d6efa7e12c36f2f4411a98b08995db3bc4724bfd32 | Complete handoff including boundary/conflict/limits read. |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121/author-ledger.md | 89fa364735542eb63bbbda1b6fb68948bc1c2060ab3519325dd319d886f25233 | Complete ledger including all seven AUTHOR image events, every row map, figure inventories, transport and limits read. |

No AUTHOR image was opened. AUTHOR's reported seven image events are text-only provenance, not this reviewer's image usage.

## Exact Binding Check

- A read-only Node command parsed physical119's JSON frontmatter, enumerated its actual typed block headers for identity, and selected the exact block named by `p0119-math-1`.
- Observed binding: `p0119#9`; actual header `p`.
- `text.includes(erratum.original)` returned true for that selected block.
- The complete registered formula contains actual integral lower-2, evaluation lower-1, one `↵`, and next-row (-2) substitutions. It is not rebound to triangle p0119#10.
- This is an exact text/block-identity comparison, not a source-row counter, test suite, count repair, parser acceptance, or mathematical validation.

## Bounded Parent Predecessor TEXT

- New parent-provided bounded114-117 observation transport only; no earlier source pixels/text file discovery.
- Physical116: §20 积分 +101 heading.
- Physical117: definition F(b)-F(a), reversed/equal limits permitted.
- Exact last MAIN row: `于是，根据积分的定义*，如果$F'=f$那么`.
- Teaching footnote and foot111 transparent to MAIN continuation.
- Result:118's top formula is101 exposition continuation; retain initial UNKNOWN historically and transport qualification. Earlier whole-object completeness is not established.
- Unit102 right/global closure remains UNKNOWN beyond121.

## One New Essential Native Image Event

Pre-I08 source hash check:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121/10c/pages/0119/page.png`
SHA-256 `56f4329ee03192c18f8c4c18261564ceb9cf45d37f80257c66fcaae82e17b49d`, identical to StageA.

| Event | Image | Original-coordinate box / checked dimensions | Pre-open SHA-256 | Detail / permanent usage |
| --- | --- | --- | --- | --- |
| I08 | /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121-review/0119-stageB-triangle-terminal-native.png | [300,2135,880,120] / 880 x 120 | 079ece104cdf8f00c4b54c130a30b3bdfac3f0aeec11dd3b6f7fa1e6cbde0316 | First and only open, detail=original; reviewer8/8, current context8/24. |

- Reason: source-supported resolution of AUTHOR comma versus frozen period at119 triangle terminal; qualify the small final subscript observed in the same row.
- Created from the unchanged original with `sips --cropToHeightWidth 120 880 --cropOffset 2135 300 ... --out ...`.
- Dimensions and SHA-256 checked before its individual image open.
- New owned path was absent before creation. No scaling, filtering, annotation, grid, montage, or adjacent pixels.
- Source observation: compact period-like terminal mark, no discernible comma tail; small final triangle subscript is C/O-shaped and not independently resolved into a replacement character.
- No full original, old reviewer crop, or AUTHOR crop was loaded in StageB.
- Reviewer lifetime totals: four original opens + four new native crop opens =8/8. Remaining0. No reset or clearing claim. Parent remains24/24, text-only delivery.

## Writes and Findings

- Exact new StageB output paths were absent before creation.
- Only manual text writes: owned `StageB.md` and this `stageB-ledger.md`, via `apply_patch`.
- The only other new output is I08's native scratch crop, generated with `sips`; source remains unchanged.
- All row/block/formula/owner comparisons are recorded in StageB.
- F1: source-period repair needed in AUTHOR119 p0119#10 and related page note/handoff/ledger claims. Preserve worked-example open ->120 close.
- Q1: small triangle subscript remains qualified; no algebraic replacement.
- F2: p0119-math-1 exact binding/original verified, conflict retained; no repair.
- No other omitted/duplicated row, changed formula, task-type error, or semantic-owner error found in the disclosed text.
- No page edit, finalize, count repair/counter, assembly, tests, mathematical approval, Git, workflow, or other-chat tool.

## Freeze and WAIT

After the last manual edit, external SHA-256 is to be returned for:

- /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121-review/StageB.md
- /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121-review/stageB-ledger.md

No self-referential file hash is embedded. Recheck the immutable StageA pair and six AUTHOR inputs to detect concurrent change; do not adopt any new bytes. Return complete findings/affected repairs and ledger hashes as text, then WAIT. No production repair or proactive new author-byte discovery.
