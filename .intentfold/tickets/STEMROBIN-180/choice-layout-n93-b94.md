# STEMROBIN-180 n93 Layout Binding b94

Status: AFFECTED_SNAPSHOT_BINDING_COMPLETE.
Retained original semantic outcome: pass.
New snapshot with-review validation: exit 0, exactly once.
Date: 2026-11-19. Offline C, finish=review.
This is affected equality/binding only; no fresh semantic review.

## Approved Basis

Exact root:
`/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck`.

Original FINAL manifest:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-CHOICE-FIRST-FINAL/manifest.json`,
SHA-256 `0af93d50ea84495932d0b5d760845a8af54a0b59ab42760298b43ac6173064a0`,
25257 bytes. Parent reported 50 bindings. Its designated parent binding
receipt was verified exit 0:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/commands/n93-choice-FINAL-parent-bind-1.json`,
SHA-256 `ed3e2b346af9aa629baf7ca83c6e32976946e6cd62ab271868885cc842a5b33e`,
920 bytes.

Approved retarget manifest:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-choice-layout-retarget/retarget-manifest.json`,
SHA-256 `821de287cab4bbebddc3f9a8367ebbb0138daed86cbaccbefc1a8b38b5fd814e`,
3935 bytes. Its retained-layout record is hash-bound at
`71f34fb49446eb48db0c9bfe6acbe3a019e4ec4c2635719aec4deea12c322768`,
3333 bytes; no layout/pixel review was repeated.

Original official review remains untouched:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-CHOICE-FIRST-FINAL/review.json`,
SHA-256 `8fa9ca2082c4d19f164bb22bb06b0556d5c83ef9f131eb85459ac1e7b54fe4cd`,
35547 bytes.

## Affected Equalities

Seed source selectors, exercises, figure projection and selected
definition indices are exactly unchanged. Only concept text strings
at blocks 8, 18 and 19 differ, and each matches exactly after removing
whitespace. No word, quantity, question, definition index, or figure
projection difference is accepted by the audit.

Source trace paths are equal; only the n93 lesson digest changes.
Current choice lesson/exercises/figures and unchanged SVG bytes match
the corrected seed bindings.

Parsed draft equality differs only in `seed_sha256`. Views, keys,
intents, coverage and every other field are exactly equal.
Only `seed_sha256` and `draft_sha256` change in the new official review.
Reviewer identity and every source solution, figure observation,
option check, coverage/capacity note, verdict and outcome are preserved
exactly. No semantic reasoning was revised to accommodate a layout fix.

The user reports both answer files unchanged. They are not choice
inputs and were not read or independently audited here.

## New Official Review

Path:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-choice-layout-retarget/review.json`.
Schema: `s10y-choice-review-v1`. Retained outcome: `pass`.
SHA-256 `f0e9ed727f2be8146d893a2e49b1de8c9b1ec84ccb077050b411831f767deaf2`,
35547 bytes, mode 0444.

Corrected contract canonical digests:

- Seed: `3ab45185aa5f69449039452c60652076fcf6323b921a24752ac84a08290b0b9e`.
- Draft: `b45aeb00a9f6ee295d128c935297eedad354435dce54767bb2e8ace77f758c2d`.

Corrected seed/draft byte bindings:
`0d16e521a3235f93923ccae5a7538f56abfb828a736668e5bbe2ebb3c97bd0c0`,
5825 bytes; and
`fedf8541b0ebc6999cfb9258c798d6095f09713773d07c116c9957d49f215466`,
27837 bytes. Those source/draft files were not edited.

## Failure Preservation

Three original preparation receipts and two packaging receipts are
bound with their exact commands, exits, stdout/stderr bytes and hashes:

- First prepare exit 0 omitted `--concept-figure`; the incomplete seed
  remains `n93-choice-layout-retarget/FIRST-missing-concept-figure-seed.json`.
  Its only projection difference from the corrected seed is that selector.
- Second prepare exit 2 repeated exercise 4 and was rejected before
  output; duplicate-selection stderr is preserved.
- Third prepare exit 0 supplied `--concept-figure tbl-p0241-01`.
- First packaging exit 1 and corrected packaging exit 0 are preserved,
  including exact stderr in the equality audit/manifest.

All are technical preparation/packaging records, not content findings.
No failed file/receipt/output was overwritten or deleted.
Counts: five preparation/packaging receipts, two nonzero technical
receipts, one preserved incomplete seed.

## Exact Validation

One recorded new-snapshot invocation:

```text
node .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/run-stage.mjs n93-cfa-005-with-review-validator python3 -B .agents/skills/ld-s10y-choice/scripts/validate.py --repo /Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck --seed .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-choice-layout-retarget/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-choice-layout-retarget/draft.json --review .intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-choice-layout-retarget/review.json
```

Receipt:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/commands/n93-cfa-005-with-review-validator-1.json`.
Exit 0. Stdout exactly:

```text
mechanical checks passed; declared semantic review: pass (not automatically proved)
```

Stderr empty; no second with-review invocation.
Exact argv/timestamps/exit/transcript hashes are in the affected manifest.

## Evidence and Stop

Owned evidence directory:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n93-CHOICE-layout-affected/`.

`equality-bindings.json`:
SHA-256 `06070eddfd3ce03e0b78ab552a95473a01d910e4183cc9f720572cb4189f8009`,
16749 bytes.
`review-rebinding.json`:
SHA-256 `91addcef2748e603acbb9f47a8c99dad3f6cba07fcb09c8de765cfe18f60c226`,
1353 bytes.
New evidence, reports, helper, manifest and sole new target review are
frozen 0444 with path/SHA-256/byte bindings.

Three whitespace-only concept changes; one changed draft field; two
changed review digests. Zero solving/SOURCE/BLIND/FINAL semantic or image
replays. No content editing, env/DB/publish/deps/app/Git/other-agent work.
Other agents' edits and all original evidence remain untouched.

STOP after affected binding.
