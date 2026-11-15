# STEMROBIN-180: Caption Merger Repair

2026-11-15. **PASS for the authorized merger repair and its single focused post-patch test run.** This is not assembly, source/modern approval, publication, or repair of instructional exercise-caption loss.

## Implemented Scope

Only production [assemble.py:52](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/assemble.py:52) and new [focused tests](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tests/test_caption_continuations.py) were changed:

- Caption continuations are handled before transparent pass-through, using a separate nearest-caption candidate.
- Matching requires explicit `open` / `cont`, exact label and equal explicit lesson/exercise ownership. Figure/footer interruptions remain transparent. Text/heading/column boundaries clear the caption candidate even if the input text block is itself consumed by body continuation.
- A successful merge retains head identity/location/ownership, exact ordered lines and all existing/new source spans; only the final continuation determines `open`.
- Orphans, closed heads and label/ownership mismatches remain intact and produce warnings. No search past another caption, implicit closure or page/figure-specific rule.
- Prose/exercise matching still ignores `fig/cap/foot`. Output line/span lists are owned, preventing in-memory mutation of loaded source blocks.

No exercise-caption field, footnote-kind support, schema/app/renderer/publisher/dependency/Charter change, source rewrite or artifact materialization was implemented. Existing 120 footnote encoding and `cut_lessons` logic were not changed.

## Actual Verification

**Before the patch:** one literal test method was executed, containing the two independently specified approved-caption fixtures. Exit **1**, with two failures: both fig99 and fig102 returned **two** caption objects instead of one. The complete first output is retained in [prepatch failure](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/caption-merger-prepatch-failure.txt), not overwritten.

**After the patch:** the complete focused module was executed **once**. Exit **0**, `Ran 8 tests`, `OK`. Complete output is retained in [focused result](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/caption-merger-focused-tests.txt). No failed post-patch iteration or second post-patch test run occurred.

The eight methods cover literal fig99/102 text/lines/spans and first-fragment same-row flags, transparent prose/exercise continuation and repeatability/input nonmutation, multi-fragment ownership/provenance chains, orphan and identity/owner mismatches, source-stream boundaries including consumed body continuations, refusal to search past another caption, and preservation of an uncontinued open head. Subcases remain in this one focused suite, not separate gates.

Actual commands, each under `zsh -o pipefail -c` with stderr included in the recorded output:

```sh
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tests/test_caption_continuations.py CaptionContinuationsTest.test_approved_caption_fragments -v 2>&1 | tee .intentfold/tickets/STEMROBIN-180/caption-merger-prepatch-failure.txt
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tests/test_caption_continuations.py -v 2>&1 | tee .intentfold/tickets/STEMROBIN-180/caption-merger-focused-tests.txt
```

No old test assertions drove expected results. No existing broad test suite, finalize, assemble, reviewed validation, HTML rendering, browser, DB, Git, package install or model/network service ran.

## Effects And Unresolved Issue

The fixtures now yield one exact fig99 caption with `["p0119#13","p0119#14"]` and one exact fig102 caption with `["p0123#7","p0123#8"]`, both closed. Original printed-line metadata is not recomputed from merged objects. Page-level source artifacts and existing assembled lessons were not rewritten, so their stored assembly audit/snapshots have **not** been refreshed.

[Completed diagnosis](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tooling-footnote-diagnosis.md) separately quantifies the unresolved ownership loss: current assembled c4-s1 `g2-3` / fig99 and c4-s3 exercise `2` / fig102 omit **two complete captions, four source fragments, six printed caption rows and eight numbered definitions**. A structured read-only inventory of current explicitly labelled raw caption/exercise records found these two cases; this is not a new corpus-wide source approval.

The suggested existing-label display-string route is **not currently valid end to end**: edition copying can carry a label, but offline and app figure consumers use it as alt/ARIA text, not a visible full caption. Replacing the printed label or merely enlarging accessibility text does not faithfully deliver those definitions. The diagnosis records the smallest separate propagation proposal and necessary consumers; **none of that proposal was implemented**. No bulk migration or artwork regeneration is proposed for already approved lessons.

## Frozen Hashes

| Input / Output | SHA256 |
| --- | --- |
| Prepatch `assemble.py` read snapshot, bound in diagnosis | `eecd6b9e314200805f3672681c897556e459cff273012b0f9da4674f9dcddb8f` |
| Repaired `assemble.py` | `4585cc25530203b678ed1587feb3bead61bffcdc0afeb3072a350aea0bec61fd` |
| New focused test module | `435439a489ac4ff07b2ec00139f825fb5147a20a79538d92ece5f91a095e4405` |
| Preserved prepatch failure output | `b934ea1a6a68021a3210939ac72988a13e653f09ed1331071377bf3c29da87bd` |
| Single post-patch focused output | `c1c68da16563ac470c9d8343695bd79f0e64b4b01bcd2ad22dab7fc6b1f7e301` |
| Completed diagnosis report | `2f83ca5a26373485b136ac3da5570343606d9b5909c1e61d933de6b32c282d01` |

Final read-only SHA comparison confirms all nine 119/120/123 MD/JSON/audit files and both inspected lessons' four raw JSON files still match the diagnosis snapshot. `blocks.py`, `edition.py`, renderer, publisher and both inspected app consumers also retain their previously recorded hashes.

| Unchanged Raw File | SHA256 |
| --- | --- |
| 0119 MD / JSON / audit | `09fe866f221a3fdffc26cc76256e1d81945c97b126b279502a1f17aed2fce633` / `819ac3f71f4e67079406e6fa5f86553a220c9efdb09b57e857041d95c64270d5` / `7ecb5699ae79d1b0f1d3a6a59716e9cd708fc78f902a5ebb0c09765582819480` |
| 0120 MD / JSON / audit | `cf216da184b8948d205afd1c21306298afbb8eef49635db42d0b88f9e2cc4d5c` / `ee72d34da3056326939bfbf2f36e4d575a5d3aa16156ae9ea196e2323133a8c5` / `c247012baee44d44906347e0a962216dccd870dcae994cc129a8828214c03661` |
| 0123 MD / JSON / audit | `318b51ce77b5498cd88e9de60a4946c9888043c94cee2dad27411146952c508b` / `8c0d3fd42c5d2df8b43f7762c50391dd28ac1427f146ee2b0458b03c324382b3` / `123b56e03bb125f075496b70ac900364a163a4a8439199db7f005973d629c09b` |
| c4-s1 lesson / exercises | `9e89ce7a39972080c10f58fa59cc1c80f853cf225dd7eba3818eb8f835403429` / `62c50a2f80934db605c6e639c8daa6dc24c2e5749c385da8f1d2cce783af799b` |
| c4-s3 lesson / exercises | `aeaab52bfcad1d3d6ada3009d05f4cd3316d568f753a6fe56cd0e0b4d3d81470` / `f4abe2e93026154a74c48412a1eab9e1a3b3d5bbca34c8301e7a5b74d38404f1` |

### Concurrent 135 Changes

135's MD/JSON/audit hashes changed during this shared-workspace task, outside this author's edits. No contents were modified, rereviewed, restored or revalidated by this repair. The diagnosis's 135 findings apply to its explicitly bound earlier snapshot, not an assertion about the page's present approval status.

Observed final hashes: MD `11eeb6628e5628c1ec74275b8fa5846db2c4a366caa53df5d48faa5d7429a84e`; JSON `dbcf2db58026888fab922f35ad79200f52b10b21d197b0a7ad435f4dcca7f18f`; audit `4569edad20155363f764f6295cb9e9ec167ac5ffb012753058c690abfb5b15d0`.

## Stop Boundary

Production edits stop at the merger function. New writes are the focused test module, its two actual command-output logs, this repair report and the requested diagnosis supplement. No raw/modern/figure/index/schema/app/dependency/Charter write, old review overwrite, assembly/promotion, Git/DB/network/browser operation, answer-key read, or unrelated rollback. Merger handoff is complete; instructional exercise-caption propagation still awaits separate main instruction.
